import { reactive, computed, readonly } from "vue";
import type { Track, PlayMode, MusicSource, MusicPlayerState } from "../types/music";

// ============================================================
// 全局单例状态：所有组件共享同一个播放器状态
// ============================================================
const state = reactive<MusicPlayerState>({
  playlist: [],
  currentIndex: -1,
  isPlaying: false,
  currentTime: 0,
  duration: 0,
  volume: 0.7,
  playMode: "loop",
  source: null,
});

let audioElement: HTMLAudioElement | null = null;

/** 当前由哪个 UI 控制播放（仅用于互斥判断） */
let currentPlayerOwner: "background" | "tool" | null = null;

// ============================================================
// 帮助函数
// ============================================================
function generateId(): string {
  return `track_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

/** 将 UI 层 owner 名称转换为内部 source 字段 */
function ownerToSource(owner: "background" | "tool"): MusicSource {
  return owner === "background" ? "default" : "tool";
}

/** 将内部 source 字段转换为 UI 层 owner 名称 */
function sourceToOwner(s: MusicSource): "background" | "tool" {
  return s === "default" ? "background" : "tool";
}

// ============================================================
// 初始化音频元素（懒创建，单例）
// ============================================================
function ensureAudio(): HTMLAudioElement {
  if (!audioElement) {
    audioElement = new Audio();
    audioElement.volume = state.volume;

    audioElement.addEventListener("timeupdate", () => {
      state.currentTime = audioElement!.currentTime;
    });

    audioElement.addEventListener("loadedmetadata", () => {
      state.duration = audioElement!.duration || 0;
    });

    audioElement.addEventListener("ended", () => {
      handleTrackEnd();
    });

    audioElement.addEventListener("error", () => {
      state.isPlaying = false;
      currentPlayerOwner = null;
    });
  }
  return audioElement;
}

function handleTrackEnd(): void {
  const mode = state.playMode;

  if (mode === "repeat-one") {
    if (audioElement) {
      audioElement.currentTime = 0;
      audioElement.play().catch(() => {});
    }
  } else if (mode === "shuffle") {
    if (state.playlist.length > 0) {
      let nextIndex: number;
      do {
        nextIndex = Math.floor(Math.random() * state.playlist.length);
      } while (state.playlist.length > 1 && nextIndex === state.currentIndex);
      playByIndex(nextIndex);
    }
  } else {
    nextTrack();
  }
}

// ============================================================
// 内部核心方法（使用 MusicSource 类型）
// ============================================================

function pauseInternal(): void {
  if (audioElement) {
    audioElement.pause();
  }
  state.isPlaying = false;
  currentPlayerOwner = null;
}

function playByIndex(index: number, source?: MusicSource): void {
  if (index < 0 || index >= state.playlist.length) {
    pauseInternal();
    return;
  }

  const audio = ensureAudio();
  const track = state.playlist[index];

  if (!track || !track.url) return;

  if (source) {
    state.source = source;
  }

  state.currentIndex = index;
  audio.src = track.url;
  audio.load();

  audio.play()
    .then(() => {
      state.isPlaying = true;
      if (source) {
        currentPlayerOwner = sourceToOwner(source);
      }
    })
    .catch(() => {
      state.isPlaying = false;
    });
}

// ============================================================
// 公开方法（暴露给 UI 层，owner 参数标明调用者身份）
// ============================================================

/** 设置播放列表 */
function setPlaylist(tracks: Track[], source: MusicSource, startIndex = 0): void {
  state.playlist = tracks;
  if (tracks.length > 0) {
    playByIndex(startIndex, source);
  }
}

/** 添加单曲到播放列表末尾 */
function addTrack(track: Track, source: MusicSource): void {
  state.playlist.push(track);
  if (state.currentIndex === -1) {
    playByIndex(state.playlist.length - 1, source);
  }
}

/** 播放/暂停切换，owner 标明调用者身份：'background' 或 'tool' */
function togglePlay(owner?: "background" | "tool"): void {
  if (state.playlist.length === 0) return;

  const audio = ensureAudio();

  if (state.isPlaying) {
    audio.pause();
    state.isPlaying = false;
    if (owner) currentPlayerOwner = null;
  } else {
    if (state.currentIndex >= 0 && state.playlist[state.currentIndex]) {
      audio.play()
        .then(() => {
          state.isPlaying = true;
          if (owner) currentPlayerOwner = owner;
        })
        .catch(() => {});
    } else {
      playByIndex(0, owner ? ownerToSource(owner) : undefined);
    }
  }
}

/** 上一首 */
function prevTrack(owner?: "background" | "tool"): void {
  if (state.playlist.length === 0) return;
  let newIndex: number;
  if (state.playMode === "shuffle") {
    newIndex = Math.floor(Math.random() * state.playlist.length);
  } else {
    newIndex = state.currentIndex - 1;
    if (newIndex < 0) newIndex = state.playlist.length - 1;
  }
  playByIndex(newIndex, owner ? ownerToSource(owner) : undefined);
}

/** 下一首 */
function nextTrack(owner?: "background" | "tool"): void {
  if (state.playlist.length === 0) return;
  let newIndex: number;
  if (state.playMode === "shuffle") {
    newIndex = Math.floor(Math.random() * state.playlist.length);
  } else {
    newIndex = state.currentIndex + 1;
    if (newIndex >= state.playlist.length) newIndex = 0;
  }
  playByIndex(newIndex, owner ? ownerToSource(owner) : undefined);
}

/** 暂停 */
function pause(): void {
  pauseInternal();
}

/** 停止并释放 */
function stop(): void {
  if (audioElement) {
    audioElement.pause();
    audioElement.src = "";
  }
  state.isPlaying = false;
  state.currentIndex = -1;
  state.currentTime = 0;
  state.duration = 0;
  currentPlayerOwner = null;
}

/** 设置播放位置（秒） */
function seek(time: number): void {
  if (audioElement) {
    audioElement.currentTime = time;
    state.currentTime = time;
  }
}

/** 设置音量 */
function setVolume(vol: number): void {
  state.volume = vol;
  if (audioElement) {
    audioElement.volume = vol;
  }
}

/** 切换播放模式 */
function cyclePlayMode(): void {
  const modes: PlayMode[] = ["loop", "repeat-one", "shuffle"];
  const idx = modes.indexOf(state.playMode);
  state.playMode = modes[(idx + 1) % modes.length];
}

/** 移除曲目 */
function removeTrack(index: number): void {
  if (index < 0 || index >= state.playlist.length) return;

  const wasCurrent = index === state.currentIndex;
  state.playlist.splice(index, 1);

  if (state.playlist.length === 0) {
    stop();
    return;
  }

  if (wasCurrent) {
    if (index >= state.playlist.length) {
      playByIndex(state.playlist.length - 1);
    } else {
      playByIndex(index);
    }
  } else if (index < state.currentIndex) {
    state.currentIndex--;
  }
}

/** 检查特定 UI 层是否正在播放 */
function isPlayingFromSource(owner: "background" | "tool"): boolean {
  if (!state.isPlaying) return false;
  if (owner === "background") return state.source === "default";
  return state.source === "tool";
}

/** 获取当前曲目 */
const currentTrack = computed<Track | null>(() => {
  if (state.currentIndex < 0 || state.currentIndex >= state.playlist.length) return null;
  return state.playlist[state.currentIndex] || null;
});

/** 格式化时间 */
function formatTime(seconds: number): string {
  if (!seconds || !isFinite(seconds)) return "0:00";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

/** 获取播放模式的中文名 */
function getPlayModeName(mode: PlayMode): string {
  const map: Record<PlayMode, string> = {
    loop: "列表循环",
    "repeat-one": "单曲循环",
    shuffle: "随机播放",
  };
  return map[mode];
}

/** 获取播放模式的图标 */
function getPlayModeIcon(mode: PlayMode): string {
  const map: Record<PlayMode, string> = {
    loop: "🔁",
    "repeat-one": "🔂",
    shuffle: "🔀",
  };
  return map[mode];
}

export function useMusicPlayer() {
  return {
    state: readonly(state) as typeof state,
    currentTrack,
    formatTime,
    getPlayModeName,
    getPlayModeIcon,

    // 方法
    setPlaylist,
    addTrack,
    playByIndex,
    togglePlay,
    prevTrack,
    nextTrack,
    pause,
    stop,
    seek,
    setVolume,
    cyclePlayMode,
    removeTrack,
    isPlayingFromSource,
    generateId,
  };
}
