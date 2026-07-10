<template>
  <div
    class="music-player-container"
    @mouseenter="showCard = true"
    @mouseleave="showCard = false"
  >
    <!-- 旋转CD图标 -->
    <div
      class="cd-icon"
      :class="{ spinning: state.isPlaying }"
      @click="showCard = !showCard"
    >
      <svg viewBox="0 0 100 100" class="cd-svg">
        <!-- 黑色外圈 -->
        <circle cx="50" cy="50" r="47" fill="#111" />
        <!-- 30度银灰色光泽（顶部） -->
        <defs>
          <linearGradient id="cdShine" x1="0%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stop-color="rgba(180,180,185,0)" />
            <stop offset="60%" stop-color="rgba(180,180,185,0.15)" />
            <stop offset="85%" stop-color="rgba(200,200,210,0.35)" />
            <stop offset="100%" stop-color="rgba(220,220,230,0.5)" />
          </linearGradient>
        </defs>
        <path
          d="M 50 50 L 64.5 5.3 A 47 47 0 0 0 35.5 5.3 Z"
          fill="url(#cdShine)"
        />
        <!-- 外圈纹路 -->
        <circle
          cx="50"
          cy="50"
          r="44"
          fill="none"
          stroke="#333"
          stroke-width="0.5"
          opacity="0.5"
        />
        <circle
          cx="50"
          cy="50"
          r="40"
          fill="none"
          stroke="#2a2a2a"
          stroke-width="0.3"
        />
        <circle
          cx="50"
          cy="50"
          r="36"
          fill="none"
          stroke="#333"
          stroke-width="0.5"
          opacity="0.5"
        />
        <!-- 白色中心圆 -->
        <circle cx="50" cy="50" r="18" fill="#fff" />
        <circle
          cx="50"
          cy="50"
          r="16"
          fill="none"
          stroke="#e0e0e0"
          stroke-width="0.5"
        />
        <!-- 中心小孔 -->
        <circle cx="50" cy="50" r="4" fill="#111" />
        <circle cx="50" cy="50" r="2" fill="#333" />
      </svg>
    </div>

    <!-- 悬停展开的播放器卡片 -->
    <Transition name="card-slide">
      <div v-if="showCard" class="player-card" @click.stop>
        <!-- 当前曲目信息 -->
        <div class="current-track-info">
          <div class="track-name-wrapper" v-if="currentTrack">
            <span
              class="track-name"
              :class="{ 'track-marquee': needsMarquee }"
              ref="trackNameRef"
              >{{ currentTrack.name }}</span
            >
          </div>
          <span class="track-artist" v-if="currentTrack">{{
            currentTrack.artist
          }}</span>
          <span class="no-track" v-else>暂无播放曲目</span>
        </div>

        <!-- 播放进度 -->
        <div class="progress-section">
          <div class="progress-bar-bg" @click="onProgressClick">
            <div
              class="progress-fill"
              :style="{ width: progressPercent + '%' }"
            ></div>
          </div>
          <div class="time-row">
            <span class="time-text">{{ formatTime(state.currentTime) }}</span>
            <span class="time-text">{{ formatTime(state.duration) }}</span>
          </div>
        </div>

        <!-- 控制按钮 -->
        <div class="controls-row">
          <button
            class="ctrl-btn ctrl-btn-text"
            :title="getPlayModeName(state.playMode)"
            @click="cyclePlayMode"
          >
            <span v-if="state.playMode === 'loop'">列</span>
            <span v-else-if="state.playMode === 'repeat-one'">单</span>
            <span v-else>随</span>
          </button>

          <button
            class="ctrl-btn ctrl-btn-sm"
            @click="prevTrack('background')"
            title="上一首"
          >
            <span class="nav-arrow">&lt;</span>
          </button>

          <button
            class="ctrl-btn play-btn-primary"
            @click="togglePlay('background')"
            :title="state.isPlaying ? '暂停' : '播放'"
          >
            <svg
              v-if="state.isPlaying"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <rect x="6" y="4" width="4" height="16" rx="1" />
              <rect x="14" y="4" width="4" height="16" rx="1" />
            </svg>
            <svg
              v-else
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M8 5v14l11-7z" />
            </svg>
          </button>

          <button
            class="ctrl-btn ctrl-btn-sm"
            @click="nextTrack('background')"
            title="下一首"
          >
            <span class="nav-arrow">&gt;</span>
          </button>

          <div class="volume-wrapper" title="音量">
            <IconVolume size="14" stroke="2" class="volume-icon" />
            <input
              type="range"
              class="volume-slider"
              min="0"
              max="1"
              step="0.05"
              :value="state.volume"
              @input="onVolumeChange"
            />
          </div>
        </div>

        <!-- 播放列表 -->
        <div class="playlist-section">
          <div class="playlist-header">
            <span class="playlist-title">播放列表</span>
            <span class="playlist-count">{{ state.playlist.length }} 首</span>
          </div>
          <div class="playlist-scroll">
            <div
              v-for="(track, index) in state.playlist"
              :key="track.id"
              class="playlist-item"
              :class="{ active: index === state.currentIndex }"
              @click="playByIndex(index, 'default')"
            >
              <div
                class="playlist-index"
                :class="{ 'is-active': index === state.currentIndex }"
              >
                {{ index + 1 }}
              </div>
              <div class="track-info-row">
                <span class="playlist-track-name">{{ track.name }}</span>
                <span class="playlist-track-artist">{{ track.artist }}</span>
              </div>
              <button
                class="remove-btn"
                @click.stop="removeTrack(index)"
                title="移出播放列表"
              >
                <IconX size="14" stroke="2" />
              </button>
            </div>
            <div v-if="state.playlist.length === 0" class="empty-playlist">
              <IconMusic size="24" stroke="1.5" class="empty-icon" />
              <span>暂无歌曲</span>
            </div>
          </div>
        </div>

        <!-- 添加歌曲按钮 -->
        <button class="add-btn" @click="goToTools">
          <IconPlus size="14" stroke="2" />
          添加歌曲
        </button>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, nextTick, watch } from "vue";
import { useRouter } from "vue-router";
import { useMusicPlayer } from "../composables/useMusicPlayer";
import { getDefaultTracks } from "../data/musicData";
import { IconVolume, IconX, IconMusic, IconPlus } from "@tabler/icons-vue";

const router = useRouter();
const showCard = ref(false);
const trackNameRef = ref<HTMLElement | null>(null);
const needsMarquee = ref(false);
const {
  state,
  currentTrack,
  formatTime,
  getPlayModeName,
  getPlayModeIcon,
  togglePlay,
  prevTrack,
  nextTrack,
  playByIndex,
  cyclePlayMode,
  removeTrack,
  seek,
  setVolume,
  setPlaylist,
} = useMusicPlayer();

const progressPercent = computed(() => {
  if (!state.duration) return 0;
  return (state.currentTime / state.duration) * 100;
});

function onProgressClick(e: MouseEvent): void {
  const target = e.currentTarget as HTMLElement;
  const rect = target.getBoundingClientRect();
  const percent = (e.clientX - rect.left) / rect.width;
  seek(percent * state.duration);
}

function onVolumeChange(e: Event): void {
  const val = parseFloat((e.target as HTMLInputElement).value);
  setVolume(val);
}

function goToTools(): void {
  showCard.value = false;
  router.push("/tools");
}

/** 检测当前曲名是否溢出容器，仅溢出时启用流动动画 */
function checkOverflow(): void {
  nextTick(() => {
    if (trackNameRef.value) {
      needsMarquee.value =
        trackNameRef.value.scrollWidth > trackNameRef.value.clientWidth;
    } else {
      needsMarquee.value = false;
    }
  });
}

// 曲目切换时重新检测溢出
watch(() => state.currentIndex, checkOverflow);
// 卡片弹出时也检测（容器宽度变化后）
watch(showCard, (val) => {
  if (val) checkOverflow();
});

// 加载默认歌单并自动播放
onMounted(async () => {
  const defaultTracks = await getDefaultTracks();
  if (defaultTracks.length > 0) {
    setPlaylist(defaultTracks, "default");
    togglePlay("background");
  }
});
</script>

<style scoped>
/* ============================================================
   容器定位 - 固定在导航栏右侧
   ============================================================ */
.music-player-container {
  position: fixed;
  top: 14px;
  right: 150px;
  z-index: 1001;
}

/* ============================================================
   旋转CD图标
   - 白色中心圆、黑色外圈
   - 外圈边缘有白色外发光
   - 有音乐播放时外发光有淡淡的扩散特效
   ============================================================ */
.cd-icon {
  width: 40px;
  height: 40px;
  cursor: pointer;
  border-radius: 50%;
  box-shadow: 0 0 8px rgba(255, 255, 255, 0.3);
  transition: box-shadow 0.3s ease;
  overflow: hidden;
}

.cd-icon:hover {
  box-shadow: 0 0 12px rgba(255, 255, 255, 0.5);
}

.cd-icon.spinning {
  animation: cd-spin 4s linear infinite;
}

/* 播放时的外发光扩散特效 */
.cd-icon.spinning::after {
  content: "";
  position: absolute;
  top: -4px;
  left: -4px;
  right: -4px;
  bottom: -4px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.08);
  animation: glow-pulse 2s ease-in-out infinite;
  pointer-events: none;
}

@keyframes glow-pulse {
  0%,
  100% {
    transform: scale(1);
    opacity: 0.6;
  }
  50% {
    transform: scale(1.15);
    opacity: 0.2;
  }
}

@keyframes cd-spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.cd-svg {
  width: 100%;
  height: 100%;
  display: block;
}

/* ============================================================
   播放器卡片 - 白底简洁风格
   ============================================================ */
.player-card {
  position: absolute;
  top: 48px;
  right: 0;
  width: 320px;
  background: #fff;
  border-radius: 16px;
  padding: 20px;
  box-shadow:
    0 8px 40px rgba(0, 0, 0, 0.12),
    0 2px 8px rgba(0, 0, 0, 0.06);
  color: #1a1a1a;
  display: flex;
  flex-direction: column;
  gap: 14px;
  max-height: 500px;
  overflow: hidden;
}

/* 卡片滑入动画 */
.card-slide-enter-active,
.card-slide-leave-active {
  transition: all 0.25s ease;
}
.card-slide-enter-from,
.card-slide-leave-to {
  opacity: 0;
  transform: translateY(-8px) scale(0.96);
}

/* ============================================================
   当前曲目信息
   ============================================================ */
.current-track-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-height: 36px;
}

.track-name-wrapper {
  overflow: hidden;
  white-space: nowrap;
}

.track-name {
  font-size: 14px;
  font-weight: 600;
  color: #1a1a1a;
  white-space: nowrap;
  display: inline-block;
}

.track-artist {
  font-size: 12px;
  color: #666;
}

.no-track {
  font-size: 13px;
  color: #999;
}

/* 仅当曲名溢出容器时才启用流动动画 */
.track-marquee {
  animation: track-marquee 8s linear infinite;
}

@keyframes track-marquee {
  0% {
    transform: translateX(0);
  }
  20% {
    transform: translateX(0);
  }
  70% {
    transform: translateX(calc(-100% + 200px));
  }
  90% {
    transform: translateX(calc(-100% + 200px));
  }
  100% {
    transform: translateX(0);
  }
}

/* ============================================================
   播放进度
   ============================================================ */
.progress-section {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.progress-bar-bg {
  height: 4px;
  background: #e8e8e8;
  border-radius: 2px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: height 0.15s ease;
}

.progress-bar-bg:hover {
  height: 6px;
}

.progress-fill {
  height: 100%;
  background: #1a1a1a;
  border-radius: 2px;
  transition: width 0.1s linear;
}

.time-row {
  display: flex;
  justify-content: space-between;
}

.time-text {
  font-size: 11px;
  color: #999;
  font-family: monospace;
}

/* ============================================================
   控制按钮
   ============================================================ */
.controls-row {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.ctrl-btn {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: none;
  background: transparent;
  color: #444;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  font-size: 14px;
}

.ctrl-btn:hover {
  background: #f0f0f0;
  color: #1a1a1a;
}

.ctrl-btn-text {
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 0;
}

.ctrl-btn-sm {
  width: 32px;
  height: 32px;
}

.nav-arrow {
  font-size: 15px;
  font-weight: 700;
  line-height: 1;
}

.play-btn-primary {
  width: 42px;
  height: 42px;
  background: #1a1a1a;
  color: #fff;
}

.play-btn-primary:hover {
  background: #333;
  color: #fff;
}

/* ============================================================
   音量滑块
   ============================================================ */
.volume-wrapper {
  display: flex;
  align-items: center;
  gap: 4px;
  margin-left: 4px;
}

.volume-icon {
  color: #888;
  flex-shrink: 0;
}

.volume-slider {
  width: 0;
  opacity: 0;
  transition: all 0.2s ease;
  cursor: pointer;
  -webkit-appearance: none;
  appearance: none;
  height: 3px;
  background: #ddd;
  border-radius: 2px;
  outline: none;
}

.volume-wrapper:hover .volume-slider {
  width: 52px;
  opacity: 1;
}

.volume-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #1a1a1a;
  cursor: pointer;
}

.volume-slider::-moz-range-thumb {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #1a1a1a;
  cursor: pointer;
  border: none;
}

/* ============================================================
   播放列表
   ============================================================ */
.playlist-section {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
  min-height: 0;
}

.playlist-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.playlist-title {
  font-size: 11px;
  font-weight: 700;
  color: #999;
  text-transform: uppercase;
  letter-spacing: 0.8px;
}

.playlist-count {
  font-size: 11px;
  color: #bbb;
}

.playlist-scroll {
  display: flex;
  flex-direction: column;
  gap: 2px;
  overflow-y: auto;
  max-height: 180px;
  scrollbar-width: thin;
  scrollbar-color: #e0e0e0 transparent;
}

.playlist-scroll::-webkit-scrollbar {
  width: 4px;
}

.playlist-scroll::-webkit-scrollbar-track {
  background: transparent;
}

.playlist-scroll::-webkit-scrollbar-thumb {
  background: #e0e0e0;
  border-radius: 2px;
}

.playlist-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 7px 8px;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.15s ease;
}

.playlist-item:hover {
  background: #f5f5f5;
}

.playlist-item.active {
  background: #f0f0f0;
}

.playlist-index {
  width: 18px;
  font-size: 11px;
  color: #bbb;
  text-align: center;
  flex-shrink: 0;
  font-variant-numeric: tabular-nums;
}

.playlist-index.is-active {
  color: #1a1a1a;
  font-weight: 700;
}

.track-info-row {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 1px;
  min-width: 0;
  overflow: hidden;
}

.playlist-track-name {
  font-size: 12px;
  font-weight: 500;
  color: #333;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.playlist-item.active .playlist-track-name {
  color: #1a1a1a;
  font-weight: 600;
}

.playlist-track-artist {
  font-size: 10px;
  color: #999;
}

.remove-btn {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  border: none;
  background: transparent;
  color: #ccc;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: all 0.15s ease;
  opacity: 0;
}

.playlist-item:hover .remove-btn {
  opacity: 1;
}

.remove-btn:hover {
  color: #ef5350;
  background: rgba(239, 83, 80, 0.08);
}

.empty-playlist {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 32px 0;
  color: #ccc;
  font-size: 12px;
}

.empty-icon {
  opacity: 0.5;
}

/* ============================================================
   添加歌曲按钮
   ============================================================ */
.add-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 9px;
  background: transparent;
  border: 1px dashed #d0d0d0;
  border-radius: 8px;
  color: #888;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.add-btn:hover {
  background: #f8f8f8;
  border-color: #aaa;
  color: #555;
}
</style>

<style>
.music-player-container .tabler-icon {
  width: 14px !important;
  height: 14px !important;
  flex-shrink: 0;
}
.music-player-container .empty-icon.tabler-icon {
  width: 24px !important;
  height: 24px !important;
}
</style>
