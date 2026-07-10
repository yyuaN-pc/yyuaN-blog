<template>
  <div class="album-detail-page">
    <!-- 封面区域 -->
    <div class="album-hero">
      <div
        class="hero-cover"
        :style="{ backgroundImage: `url(${coverImage})` }"
      ></div>
      <div class="hero-overlay"></div>
      <WaveDivider />
    </div>

    <!-- 主体内容 -->
    <div class="album-body">
      <div class="album-card" v-if="currentAlbum">
        <!-- 左侧区域 -->
        <div class="left-panel">
          <!-- 标题和页码 -->
          <div class="title-row">
            <h1 class="album-title">{{ currentAlbum?.title || "相册" }}</h1>
            <div class="page-indicator">
              {{ currentSetIndex + 1 }} / {{ totalSets }}
            </div>
          </div>

          <!-- 返回按钮 -->
          <button class="back-btn" @click="goBack">
            <IconChevronLeft size="1em" stroke="1.5" />
            返回
          </button>

          <!-- 拍摄地点 -->
          <div class="location-item">
            <IconMapPin size="1em" stroke="1.5" />
            <span>{{ currentPhoto?.location || "" }}</span>
          </div>

          <!-- 拍摄时间和拍摄者 -->
          <!-- <div class="time-photographer-row"> -->
          <div class="time-item">
            <IconClock size="1em" stroke="1.5" />
            <span>{{ currentPhoto?.date || "" }}</span>
          </div>
          <div class="photographer-item">
            <IconUser size="1em" stroke="1.5" />
            <span>{{ currentPhoto?.photographer || "" }}</span>
          </div>
          <!-- </div> -->

          <!-- 简介文本 -->
          <div class="photo-text">{{ currentPhoto?.description || "" }}</div>

          <!-- 快捷键和模式切换 -->
          <div class="bottom-row">
            <div class="shortcuts-hint">← → 切换</div>
            <div class="mode-switch">
              <button
                class="mode-btn"
                :class="{ active: displayMode === 'single' }"
                @click="switchMode('single')"
                title="单图模式"
              >
                <IconPhoto size="1.2em" stroke="1.5" />
              </button>
              <button
                class="mode-btn"
                :class="{ active: displayMode === 'grid' }"
                @click="switchMode('grid')"
                title="多图模式"
              >
                <IconLayoutGrid size="1.2em" stroke="1.5" />
              </button>
            </div>
          </div>
        </div>

        <!-- 右侧区域：图片容器 -->
        <div class="right-panel">
          <!-- 图片容器（nav-btn 悬浮在其内部左右两侧） -->
          <div class="photo-container">
            <!-- 左切换按键（悬停左侧区域时显示） -->
            <button class="nav-btn nav-btn-left" @click="prevSet">
              <IconChevronLeft size="1.5em" stroke="1.5" />
            </button>

            <!-- 单图模式 -->
            <div v-if="displayMode === 'single'" class="single-image-wrapper">
              <img
                :src="currentPhoto?.url"
                :alt="currentPhoto?.title"
                class="single-image"
              />
            </div>

            <!-- 多图模式 -->
            <div v-else class="grid-images-wrapper">
              <div
                v-for="(row, rowIndex) in currentGridRows"
                :key="rowIndex"
                class="grid-row"
              >
                <div
                  v-for="(photo, colIndex) in row.photos"
                  :key="colIndex"
                  class="grid-item"
                  :style="{ width: photo.width + 'px' }"
                  @click="openLightbox(photo.index)"
                >
                  <img :src="photo.url" :alt="photo.title" class="grid-image" />
                </div>
              </div>
            </div>

            <!-- 右切换按键（悬停右侧区域时显示） -->
            <button class="nav-btn nav-btn-right" @click="nextSet">
              <IconChevronRight size="1.5em" stroke="1.5" />
            </button>
          </div>
        </div>
      </div>

      <div v-else class="album-not-found">
        <p>相册未找到</p>
        <button @click="goBack">返回相册</button>
      </div>
    </div>

    <!-- 评论区 -->
    <CommentSection :pageId="'album_' + albumId" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import {
  IconChevronLeft,
  IconChevronRight,
  IconMapPin,
  IconClock,
  IconUser,
  IconPhoto,
  IconLayoutGrid,
} from "@tabler/icons-vue";
import WaveDivider from "../components/WaveDivider.vue";
import CommentSection from "../components/CommentSection.vue";
import coverImage from "../assets/album-cover.svg";
import type { Photo, GridPhoto, GridRow, AlbumInfo } from "../types/album";
import { getAlbumById } from "../data/photosData";

const route = useRoute();
const router = useRouter();

const albumId = computed(() => route.params.id as string);
const currentAlbum = ref<AlbumInfo | undefined>();
const photos = computed(() => currentAlbum.value?.photos || []);

onMounted(async () => {
  currentAlbum.value = await getAlbumById(albumId.value);
});

const displayMode = ref<"single" | "grid">("single");
const currentSetIndex = ref(0);

const GRID_WIDTH = 960;
const ROW_HEIGHT = 165;
const ROWS_PER_SET = 3;

const totalSets = computed(() => {
  if (displayMode.value === "single") {
    return photos.value.length;
  }
  const photosPerSet = calculatePhotosPerSet();
  return Math.ceil(photos.value.length / photosPerSet);
});

function calculatePhotosPerSet(): number {
  let totalWidth = 0;
  let count = 0;
  for (let i = 0; i < photos.value.length; i++) {
    const aspectRatio = 16 / 9;
    const width = ROW_HEIGHT * aspectRatio;
    if (totalWidth + width <= GRID_WIDTH) {
      totalWidth += width;
      count++;
    } else {
      totalWidth = width;
      count++;
    }
    if (count % Math.floor(GRID_WIDTH / (ROW_HEIGHT * (16 / 9))) === 0) {
      count +=
        Math.floor(GRID_WIDTH / (ROW_HEIGHT * (16 / 9))) * (ROWS_PER_SET - 1);
      break;
    }
  }
  return Math.max(count, 1);
}

const currentPhoto = computed(() => {
  if (photos.value.length === 0) return null;
  if (displayMode.value === "single") {
    return photos.value[currentSetIndex.value];
  }
  const photosPerSet = calculatePhotosPerSet();
  const firstIndex = currentSetIndex.value * photosPerSet;
  return photos.value[firstIndex] || photos.value[0];
});

const currentGridRows = computed(() => {
  if (displayMode.value !== "grid" || photos.value.length === 0) return [];

  const photosPerSet = calculatePhotosPerSet();
  const firstIndex = currentSetIndex.value * photosPerSet;
  const setPhotos = photos.value.slice(firstIndex, firstIndex + photosPerSet);

  const rows: GridRow[] = [];
  let currentRow: GridPhoto[] = [];
  let currentRowWidth = 0;

  for (let i = 0; i < setPhotos.length; i++) {
    const photo = setPhotos[i];
    const aspectRatio = 16 / 9;
    const width = ROW_HEIGHT * aspectRatio;

    if (currentRowWidth + width <= GRID_WIDTH) {
      currentRow.push({
        url: photo.url,
        title: photo.title,
        width,
        index: firstIndex + i,
      });
      currentRowWidth += width;
    } else {
      rows.push({ photos: currentRow });
      currentRow = [
        {
          url: photo.url,
          title: photo.title,
          width,
          index: firstIndex + i,
        },
      ];
      currentRowWidth = width;
    }

    if (
      currentRow.length > 0 &&
      (rows.length === ROWS_PER_SET - 1 || i === setPhotos.length - 1)
    ) {
      rows.push({ photos: currentRow });
      break;
    }
  }

  while (rows.length < ROWS_PER_SET) {
    rows.push({ photos: [] });
  }

  return rows;
});

function goBack(): void {
  router.push("/album");
}

function switchMode(mode: "single" | "grid"): void {
  if (mode === "grid" && displayMode.value !== "grid") {
    currentSetIndex.value = 0;
  }
  displayMode.value = mode;
}

function prevSet(): void {
  currentSetIndex.value =
    currentSetIndex.value > 0 ? currentSetIndex.value - 1 : totalSets.value - 1;
}

function nextSet(): void {
  currentSetIndex.value =
    currentSetIndex.value < totalSets.value - 1 ? currentSetIndex.value + 1 : 0;
}

function openLightbox(index: number): void {
  displayMode.value = "single";
  currentSetIndex.value = index;
}

function handleKeydown(e: KeyboardEvent): void {
  if (e.key === "ArrowLeft") {
    prevSet();
  } else if (e.key === "ArrowRight") {
    nextSet();
  } else if (e.key === "g" || e.key === "G") {
    switchMode(displayMode.value === "single" ? "grid" : "single");
  }
}

onMounted(() => {
  window.addEventListener("keydown", handleKeydown);
});

onUnmounted(() => {
  window.removeEventListener("keydown", handleKeydown);
});
</script>

<style scoped>
.album-detail-page {
  min-height: 100vh;
  background-color: var(--general-background-color);
}

/* 封面区域 */
.album-hero {
  position: relative;
  height: 180px;
  display: flex;
  align-items: flex-end;
  overflow: hidden;
}

.hero-cover {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: center;
}

.hero-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    to bottom,
    rgba(0, 0, 0, 0.2) 0%,
    rgba(0, 0, 0, 0.5) 100%
  );
}

/* 主体内容 */
.album-body {
  padding: 0px 24px 80px;
}

.album-card {
  max-width: 1200px;
  margin: -0px auto 0;
  background: rgba(255, 255, 255, 0.95);
  padding: 0;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
  display: flex;
  overflow: hidden;
  /* 新增：子元素靠左、允许右侧面板贴容器右边缘 */
  justify-content: flex-start;
}
/* .album-card {
  max-width: 1200px;
  margin: -30px auto 0;
  background: rgba(255, 255, 255, 0.95);
  padding: 0;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
  display: flex;
  overflow: hidden;
} */

/* ========== 左侧区域容器 ========== */
/* 左侧信息面板，固定宽度，纵向排列各组件 */
.left-panel {
  width: 235px;
  padding: 15px;
  display: flex;
  flex-direction: column;
}

/* 左侧区域所有直接子元素的底部外间距 */
.left-panel > div,
.left-panel > button {
  margin-bottom: 3px;
}

/* ========== 标题行（标题 + 页码） ========== */
/* 标题与页码所在行，标题左对齐，页码右下角对齐 */
.title-row {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  height: 2rem;
}

/* 相册标题样式 */
.album-title {
  font-size: 1.2rem;
  font-weight: 600;
  color: var(--font-color-grey);
  margin: 0;
}

/* 页码指示器样式 */
.page-indicator {
  font-size: 0.85rem;
  color: var(--font-color-grey);
  opacity: 0.7;
}

/* ========== 返回按钮 ========== */
/* 无背景、无边框的返回按钮，带箭头图标 */
.back-btn {
  display: flex;
  align-items: center;
  gap: 4px;
  margin-top: 15px;
  padding: 0;
  background: transparent;
  border: none;
  color: var(--font-color-grey);
  font-size: 0.85rem;
  cursor: pointer;
  transition: opacity 0.3s ease;
}

.back-btn:hover {
  opacity: 0.7;
}

/* ========== 拍摄地点 ========== */
/* 拍摄地点显示，带定位图标 */
.location-item {
  display: flex;
  align-items: center;
  gap: 4px;
  margin-top: 15px;
  font-size: 0.85rem;
  color: var(--font-color-grey);
}

.location-item svg {
  opacity: 0.5;
}

/* ========== 拍摄时间 + 拍摄者行 ========== */
/* 时间和拍摄者同行，时间左对齐，拍摄者右对齐 */
/* .time-photographer-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
} */

/* 拍摄时间样式 */
.time-item,
.photographer-item {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 0.85rem;
  color: var(--font-color-grey);
}

.time-item svg,
.photographer-item svg {
  opacity: 0.5;
}

/* ========== 简介文本 ========== */
/* 照片简介文本区域，占据左侧剩余空间，可滚动 */
.photo-text {
  font-size: 0.85rem;
  line-height: 1.6;
  /* color: var(--font-color-grey); */
  margin-top: 15px;
  opacity: 0.85;
  flex: 1;
  overflow-y: auto;
}

/* ========== 底部行（快捷键提示 + 模式切换） ========== */
/* 快捷键提示左对齐，模式切换按键右对齐 */
.bottom-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

/* 快捷键提示文字 */
.shortcuts-hint {
  font-size: 0.75rem;
  color: var(--font-color-grey);
  opacity: 0.5;
}

/* 模式切换按键容器 */
.mode-switch {
  display: flex;
  gap: 4px;
}

/* 单个模式切换按键（无背景、无边框） */
.mode-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4px;
  background: transparent;
  border: none;
  color: var(--font-color-grey);
  opacity: 0.4;
  cursor: pointer;
  transition: all 0.3s ease;
}

.mode-btn:hover {
  opacity: 0.7;
}

.mode-btn.active {
  opacity: 1;
  color: var(--color-blue);
}

/* ========== 右侧区域：图片容器 ========== */
/* 右侧面板，占满剩余空间 */
.right-panel {
  /* flex: 1; 删掉这行 */
  width: 960px;
  height: 540px;
  /* 靠右对齐，配合父容器flex布局 */
  margin-left: auto;
  padding: 0;
  display: flex;
}
/* .right-panel {
  flex: 1;
  padding: 0;
  margin: 0;
  display: flex;
} */

/* 图片容器：占满整个 right-panel，作为 nav-btn 的定位父级 */
.photo-container {
  flex: 1;
  height: 540px;
  background: #fff;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

/* 悬浮切换按键：默认隐藏，悬停图片左右两侧时显示 */
.nav-btn {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(220, 220, 220, 0.6);
  border: none;
  border-radius: 50%;
  color: #fff;
  cursor: pointer;
  opacity: 0;
  transition: all 0.3s ease;
  z-index: 10;
}

/* 左切换按键：位于图片左侧 */
.nav-btn-left {
  left: 12px;
}

/* 右切换按键：位于图片右侧 */
.nav-btn-right {
  right: 12px;
}

/* 悬停整个图片容器时，显示两个按键 */
.photo-container:hover .nav-btn {
  opacity: 1;
}

/* 悬停按键本身时，背景加深 */
.nav-btn:hover {
  background: rgba(200, 200, 200, 0.8);
}

/* 单图模式：占满整个图片容器 */
.single-image-wrapper {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #fff;
}

.single-image {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  display: block;
}

/* 多图模式：占满整个图片容器 */
.grid-images-wrapper {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 10px;
  box-sizing: border-box;
}

.grid-row {
  display: flex;
  align-items: center;
  justify-content: space-evenly;
  height: 165px;
  gap: 8px;
}

.grid-item {
  height: 100%;
  border-radius: 6px;
  overflow: hidden;
  cursor: pointer;
  transition: transform 0.3s ease;
}

.grid-item:hover {
  transform: scale(1.02);
}

.grid-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

/* 相册未找到 */
.album-not-found {
  text-align: center;
  padding: 60px 24px;
}

.album-not-found p {
  font-size: 1.2rem;
  color: var(--font-color-grey);
  margin-bottom: 24px;
}

.album-not-found button {
  padding: 12px 32px;
  background: var(--color-blue);
  color: #fff;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  cursor: pointer;
  transition: background 0.3s ease;
}

.album-not-found button:hover {
  background: rgba(var(--blue-shadow-color), 0.8);
}

/* 响应式 */
@media (max-width: 1200px) {
  .album-card {
    flex-direction: column;
  }

  .left-panel {
    width: 100%;
    border-right: none;
    border-bottom: 1px solid rgba(0, 0, 0, 0.06);
    padding: 16px;
    flex-direction: row;
    flex-wrap: wrap;
    gap: 12px;
  }

  .left-panel > div,
  .left-panel > button {
    margin-bottom: 0;
  }

  .title-row {
    width: 100%;
    height: auto;
  }

  .photo-text {
    flex: none;
    width: 100%;
  }

  .bottom-row {
    width: 100%;
  }

  .photo-container {
    height: calc((100vw - 80px) * 0.5625);
    max-height: 500px;
  }

  .grid-images-wrapper {
    padding: 5px;
  }

  .grid-row {
    height: calc((100vw - 80px) * 0.5625 / 3);
    gap: 4px;
  }
}

@media (max-width: 768px) {
  .album-card {
    margin-top: -20px;
  }

  .album-body {
    padding: 16px 16px 60px;
  }

  .photo-container {
    height: calc((100vw - 60px) * 0.5625);
    max-height: 400px;
  }
}
</style>
