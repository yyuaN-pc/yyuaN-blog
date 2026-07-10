<template>
  <div class="video-to-audio">
    <!-- 输入区域 -->
    <div class="input-section">
      <div class="input-group">
        <input
          v-model="urlInput"
          type="text"
          placeholder="请输入B站视频链接，例如：https://www.bilibili.com/video/BV1xx411c7mZ"
          @keypress.enter="handleExtract"
        />
        <button class="extract-btn" :disabled="loading" @click="handleExtract">
          {{ loading ? "提取中..." : "提取音频" }}
        </button>
      </div>
      <div class="tips">
        <p>支持格式：<code>https://www.bilibili.com/video/BVxxxxxx</code></p>
      </div>
    </div>

    <!-- 错误提示 -->
    <div v-if="errorMsg" class="error-message">
      <p>{{ errorMsg }}</p>
    </div>

    <!-- 加载提示 -->
    <div v-if="loading" class="loading-text">{{ loadingText }}</div>

    <!-- 音频结果区域 -->
    <div v-if="videoInfo" class="audio-result">
      <!-- 视频信息卡片 -->
      <div class="video-info-card">
        <img :src="videoInfo.pic" :alt="videoInfo.title" class="video-cover" />
        <div class="video-meta">
          <h3 class="video-title">{{ videoInfo.title }}</h3>
          <p class="video-author">UP主：{{ videoInfo.author }}</p>
          <p class="video-bvid">视频ID：{{ videoInfo.bvid }}</p>
        </div>
      </div>

      <!-- 播放器 -->
      <div class="audio-player">
        <div class="player-controls">
          <button class="play-btn" @click="togglePlay">
            {{ isPlaying ? "❚❚" : "▶" }}
          </button>
          <div class="progress-area" @click="seek">
            <div class="progress-bar">
              <div
                class="progress-fill"
                :style="{ width: progressPercent + '%' }"
              ></div>
            </div>
            <span class="time-display"
              >{{ formatTime(currentTime) }} / {{ formatTime(duration) }}</span
            >
          </div>
          <div class="action-btns">
            <button class="download-btn" @click="downloadAudio">
              下载 MP3
            </button>
            <button
              class="add-playlist-btn"
              @click="addToPlaylist"
              :disabled="!audioProxyUrl"
            >
              <IconPlus size="14" />
              添加至播放列表
            </button>
          </div>
        </div>
        <audio
          ref="audioRef"
          :src="audioProxyUrl || undefined"
          @timeupdate="onTimeUpdate"
          @loadedmetadata="onLoadedMetadata"
          @ended="onEnded"
          @error="onAudioError"
          @play="onPlay"
        ></audio>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import type { VideoInfo } from "../../types";
import { API_BASE } from "../../config/api";
import { extractBvid, isValidBilibiliUrl } from "../../utils/bilibili";
import { useMusicPlayer } from "../../composables/useMusicPlayer";
import { IconPlus } from "@tabler/icons-vue";

const {
  addTrack,
  pause: pauseBgMusic,
  generateId,
  isPlayingFromSource,
} = useMusicPlayer();

const urlInput = ref("");
const loading = ref(false);
const loadingText = ref("");
const errorMsg = ref("");
const videoInfo = ref<VideoInfo | null>(null);
const audioProxyUrl = ref("");
const audioRef = ref<HTMLAudioElement | null>(null);
const isPlaying = ref(false);
const currentTime = ref(0);
const duration = ref(0);

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

const progressPercent = () => {
  if (!duration.value) return 0;
  return (currentTime.value / duration.value) * 100;
};

async function handleExtract(): Promise<void> {
  const url = urlInput.value.trim();

  if (!url) {
    errorMsg.value = "请输入B站视频链接";
    return;
  }

  if (!isValidBilibiliUrl(url)) {
    errorMsg.value = "请输入有效的B站视频链接";
    return;
  }

  const bvid = extractBvid(url);
  if (!bvid) {
    errorMsg.value = "无法从链接中提取视频ID，请检查链接格式";
    return;
  }

  errorMsg.value = "";
  loading.value = true;
  loadingText.value = "正在获取视频信息...";

  try {
    const infoResponse = await fetch(`${API_BASE}/api/video_info?bvid=${bvid}`);
    const infoData = await infoResponse.json();

    if (infoData.error) {
      throw new Error(infoData.error);
    }

    const { title, cid, pic, author } = infoData;
    videoInfo.value = {
      title,
      cid,
      pic: `${API_BASE}/api/proxy_image?url=${encodeURIComponent(pic)}`,
      author,
      bvid,
    };

    loadingText.value = "正在提取音频流...";

    const audioUrlResponse = await fetch(
      `${API_BASE}/api/audio_url?bvid=${bvid}&cid=${cid}`,
    );
    const audioUrlData = await audioUrlResponse.json();

    if (audioUrlData.error) {
      throw new Error(audioUrlData.error);
    }

    audioProxyUrl.value = `${API_BASE}/api/proxy_audio?url=${encodeURIComponent(
      audioUrlData.audio_url,
    )}`;
  } catch (error) {
    errorMsg.value =
      error instanceof Error ? error.message : "提取音频失败，请重试";
    videoInfo.value = null;
  } finally {
    loading.value = false;
  }
}

function togglePlay(): void {
  if (!audioRef.value || !audioProxyUrl.value) return;

  if (isPlaying.value) {
    audioRef.value.pause();
    isPlaying.value = false;
  } else {
    audioRef.value.play();
    isPlaying.value = true;
  }
}

function onTimeUpdate(): void {
  if (audioRef.value) {
    currentTime.value = audioRef.value.currentTime;
  }
}

function onLoadedMetadata(): void {
  if (audioRef.value) {
    duration.value = audioRef.value.duration;
  }
}

function onEnded(): void {
  isPlaying.value = false;
}

function onAudioError(): void {
  errorMsg.value = "音频加载失败，请重试";
  isPlaying.value = false;
}

function seek(e: MouseEvent): void {
  if (!audioRef.value || !duration.value) return;
  const target = e.currentTarget as HTMLElement;
  const rect = target.getBoundingClientRect();
  const percent = (e.clientX - rect.left) / rect.width;
  audioRef.value.currentTime = percent * duration.value;
}

async function downloadAudio(): Promise<void> {
  if (!audioProxyUrl.value || !videoInfo.value) return;
  try {
    const response = await fetch(audioProxyUrl.value);
    const blob = await response.blob();
    const blobUrl = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = blobUrl;
    link.download = `${videoInfo.value.title}.mp3`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(blobUrl);
  } catch {
    errorMsg.value = "下载失败，请重试";
  }
}

/** 添加至播放列表 */
function addToPlaylist(): void {
  if (!videoInfo.value || !audioProxyUrl.value) return;
  addTrack(
    {
      id: generateId(),
      name: videoInfo.value.title,
      artist: videoInfo.value.author || "B站UP主",
      url: audioProxyUrl.value,
    },
    "tool",
  );
  errorMsg.value = "✅ 已添加至播放列表";
}

// ============================================================
// 互斥播放：背景音乐播放时，自动暂停当前工具的播放
// ============================================================
// 监听背景音乐播放状态
watch(
  () => isPlayingFromSource("background"),
  (bgPlaying) => {
    if (bgPlaying && audioRef.value && isPlaying.value) {
      // 背景音乐开始播放，暂停工具音频
      audioRef.value.pause();
      isPlaying.value = false;
    }
  },
);

// 工具音频开始播放时，暂停背景音乐
function onPlay(): void {
  if (isPlayingFromSource("background")) {
    pauseBgMusic();
  }
}
</script>

<style scoped>
.video-to-audio {
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: 24px 32px;
  overflow-y: auto;
}

/* 输入区域 */
.input-section {
  margin-bottom: 16px;
}

.input-group {
  display: flex;
  gap: 12px;
  margin-bottom: 8px;
}

.input-group input {
  flex: 1;
  padding: 12px 16px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  font-size: 14px;
  color: var(--font-color-grey);
  outline: none;
  transition: border-color 0.3s ease;
}

.input-group input:focus {
  border-color: var(--color-blue);
}

.extract-btn {
  padding: 12px 24px;
  background: var(--color-blue);
  color: #fff;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  white-space: nowrap;
}

.extract-btn:hover:not(:disabled) {
  opacity: 0.9;
}

.extract-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.tips {
  font-size: 12px;
  color: var(--font-color-grey);
  opacity: 0.6;
}

.tips code {
  background: rgba(0, 0, 0, 0.05);
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 11px;
}

/* 错误提示 */
.error-message {
  padding: 12px 16px;
  background: rgba(239, 83, 80, 0.1);
  border-left: 4px solid #ef5350;
  border-radius: 0 8px 8px 0;
  margin-bottom: 16px;
}

.error-message p {
  color: #ef5350;
  font-size: 13px;
  margin: 0;
}

/* 加载提示 */
.loading-text {
  padding: 12px 16px;
  color: var(--color-blue);
  font-size: 14px;
}

/* 音频结果 */
.audio-result {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.video-info-card {
  display: flex;
  gap: 16px;
  padding: 16px;
  background: rgba(0, 0, 0, 0.03);
  border-radius: 12px;
}

.video-cover {
  width: 160px;
  height: 100px;
  object-fit: cover;
  border-radius: 8px;
  flex-shrink: 0;
}

.video-meta {
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 6px;
}

.video-title {
  font-size: 15px;
  font-weight: 600;
  color: var(--font-color-grey);
  margin: 0;
  line-height: 1.4;
}

.video-author,
.video-bvid {
  font-size: 12px;
  color: var(--font-color-grey);
  opacity: 0.7;
  margin: 0;
}

/* 播放器 */
.audio-player {
  padding: 16px;
  background: rgba(0, 0, 0, 0.03);
  border-radius: 12px;
}

.player-controls {
  display: flex;
  align-items: center;
  gap: 16px;
}

.action-btns {
  display: flex;
  gap: 8px;
  flex-shrink: 0;
}

.play-btn {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: var(--color-blue);
  color: #fff;
  border: none;
  font-size: 16px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: all 0.3s ease;
}

.play-btn:hover {
  transform: scale(1.05);
}

.progress-area {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
  cursor: pointer;
}

.progress-bar {
  height: 6px;
  background: rgba(0, 0, 0, 0.1);
  border-radius: 3px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: var(--color-blue);
  border-radius: 3px;
  transition: width 0.1s linear;
}

.time-display {
  font-size: 12px;
  color: var(--font-color-grey);
  opacity: 0.7;
  font-family: monospace;
}

.download-btn {
  padding: 10px 20px;
  background: transparent;
  color: var(--color-blue);
  border: 1px solid var(--color-blue);
  border-radius: 8px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  white-space: nowrap;
}

.download-btn:hover {
  background: var(--color-blue);
  color: #fff;
}

.add-playlist-btn {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 10px 16px;
  background: transparent;
  color: #22c55e;
  border: 1px solid #22c55e;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  white-space: nowrap;
}

.add-playlist-btn:hover:not(:disabled) {
  background: #22c55e;
  color: #fff;
}

.add-playlist-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}
</style>
