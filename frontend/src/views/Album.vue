<template>
  <div class="album-page">
    <!-- 封面区域 -->
    <div class="album-hero">
      <div class="hero-cover hero-cover-teal"></div>
      <!-- 波浪过渡 -->
      <WaveDivider />
    </div>

    <!-- 主体内容 -->
    <div class="album-body">
      <div class="album-card">
        <!-- 加载骨架 -->
        <LoadingSkeleton v-if="loading" type="grid" :count="4" />
        <div v-else class="sub-album-grid">
          <div
            v-for="album in subAlbums"
            :key="album.id"
            class="sub-album-card"
            @click="goToAlbum(album.id)"
          >
            <div class="sub-album-cover">
              <img :src="album.cover" :alt="album.title" />
            </div>
            <div class="sub-album-info">
              <h3 class="sub-album-title">{{ album.title }}</h3>
              <p class="sub-album-desc">{{ album.description }}</p>
              <span class="sub-album-count">{{ album.count }} 张照片</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import WaveDivider from "../components/WaveDivider.vue";
import LoadingSkeleton from "../components/LoadingSkeleton.vue";
import type { SubAlbum } from "../types/album";
import { getSubAlbums } from "../data/photosData";

const router = useRouter();
const subAlbums = ref<SubAlbum[]>([]);
const loading = ref(true);

onMounted(async () => {
  try {
    subAlbums.value = await getSubAlbums();
  } finally {
    loading.value = false;
  }
});

function goToAlbum(id: string): void {
  router.push(`/album/${id}`);
}
</script>

<style scoped>
.album-page {
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
}

.hero-cover-teal {
  background: #00695c;
}

/* 主体内容 */
.album-body {
  padding: 0px 24px 80px;
}

.album-card {
  max-width: 1200px;
  margin: 0 auto;
  background: rgba(255, 255, 255, 0.7);
  border-radius: 16px;
  padding: 40px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
}

/* 子相册网格 */
.sub-album-grid {
  display: grid;
  grid-template-columns: repeat(2, 528px);
  gap: 44px;
  justify-content: center;
}

.sub-album-card {
  width: 528px;
  height: 297px;
  border-radius: 12px;
  overflow: hidden;
  cursor: pointer;
  transition:
    transform 0.3s ease,
    box-shadow 0.3s ease;
  background: #fff;
  display: flex;
  flex-direction: column;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.sub-album-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
}

.sub-album-cover {
  width: 100%;
  flex: 1;
  overflow: hidden;
}

.sub-album-cover img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  transition: transform 0.5s ease;
}

.sub-album-card:hover .sub-album-cover img {
  transform: scale(1.05);
}

.sub-album-info {
  padding: 16px 20px;
}

.sub-album-title {
  margin: 0 0 6px;
  font-size: 1.15rem;
  font-weight: 600;
  color: var(--font-color-grey);
}

.sub-album-desc {
  margin: 0 0 8px;
  font-size: 0.85rem;
  color: var(--font-color-grey);
  opacity: 0.7;
}

.sub-album-count {
  font-size: 0.8rem;
  color: var(--color-blue);
}

@media (max-width: 1200px) {
  .sub-album-grid {
    grid-template-columns: 1fr;
    gap: 24px;
  }

  .sub-album-card {
    width: 100%;
    height: auto;
    max-height: 300px;
  }
}

@media (max-width: 768px) {
  .album-card {
    padding: 24px;
  }

  .album-body {
    padding: 40px 16px 60px;
  }
}
</style>
