<template>
  <div class="skeleton-wrapper" :class="`skeleton-${type}`">
    <!-- 文章卡片骨架 -->
    <template v-if="type === 'card'">
      <div v-for="i in count" :key="i" class="skeleton-card">
        <div class="sk-cover"></div>
        <div class="sk-body">
          <div class="sk-line sk-title"></div>
          <div class="sk-meta">
            <div class="sk-line sk-meta-line"></div>
            <div class="sk-line sk-meta-line"></div>
            <div class="sk-line sk-meta-line"></div>
          </div>
          <div class="sk-line sk-tag"></div>
          <div class="sk-line sk-excerpt"></div>
        </div>
      </div>
    </template>

    <!-- 相册网格骨架 -->
    <template v-else-if="type === 'grid'">
      <div class="skeleton-grid">
        <div v-for="i in count" :key="i" class="skeleton-grid-item">
          <div class="sk-grid-cover"></div>
          <div class="sk-grid-info">
            <div class="sk-line sk-grid-title"></div>
            <div class="sk-line sk-grid-desc"></div>
          </div>
        </div>
      </div>
    </template>

    <!-- 内容骨架（详情页） -->
    <template v-else-if="type === 'content'">
      <div class="skeleton-content">
        <div class="sk-line sk-h1"></div>
        <div class="sk-line sk-p" v-for="i in 3" :key="'p1-' + i"></div>
        <div class="sk-line sk-h2"></div>
        <div class="sk-line sk-p" v-for="i in 4" :key="'p2-' + i"></div>
        <div class="sk-code-block">
          <div class="sk-line sk-code" v-for="i in 3" :key="'c-' + i"></div>
        </div>
        <div class="sk-line sk-p" v-for="i in 2" :key="'p3-' + i"></div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  type: "card" | "grid" | "content";
  count?: number;
}>();
</script>

<style scoped>
/* ========== 共用脉冲动画 ========== */
.skeleton-wrapper {
  width: 100%;
}

@keyframes sk-pulse {
  0% {
    opacity: 0.3;
  }
  50% {
    opacity: 0.7;
  }
  100% {
    opacity: 0.3;
  }
}

.sk-line {
  height: 14px;
  border-radius: 6px;
  background: rgba(128, 128, 128, 0.15);
  animation: sk-pulse 1.6s ease-in-out infinite;
  margin-bottom: 12px;
}

.w-80 {
  width: 80%;
}
.w-60 {
  width: 60%;
}
.w-90 {
  width: 90%;
}
.w-40 {
  width: 40%;
}

/* ========== 文章卡片骨架 ========== */
.skeleton-card {
  display: flex;
  gap: 24px;
  padding: 0;
  border-radius: 16px;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.7);
  margin-bottom: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

.sk-cover {
  width: 280px;
  min-height: 200px;
  background: rgba(128, 128, 128, 0.1);
  animation: sk-pulse 1.6s ease-in-out infinite;
  border-radius: 16px 0 0 16px;
  flex-shrink: 0;
}

.sk-body {
  flex: 1;
  padding: 24px 24px 24px 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.sk-title {
  width: 65%;
  height: 22px;
  margin-bottom: 8px;
}

.sk-meta {
  display: flex;
  gap: 12px;
  align-items: center;
}

.sk-meta-line {
  width: 60px;
  height: 12px;
}

.sk-tag {
  width: 80px;
  height: 22px;
  border-radius: 20px;
  margin: 4px 0;
}

.sk-excerpt {
  width: 90%;
  margin-top: auto;
}

/* ========== 相册网格骨架 ========== */
.skeleton-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 44px;
  max-width: 1100px;
  margin: 0 auto;
}

.skeleton-grid-item {
  border-radius: 12px;
  overflow: hidden;
  background: #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

.sk-grid-cover {
  width: 100%;
  height: 180px;
  background: rgba(128, 128, 128, 0.1);
  animation: sk-pulse 1.6s ease-in-out infinite;
}

.sk-grid-info {
  padding: 16px 20px;
}

.sk-grid-title {
  width: 50%;
  height: 16px;
}

.sk-grid-desc {
  width: 70%;
  height: 12px;
}

/* ========== 内容骨架 ========== */
.skeleton-content {
  max-width: 800px;
  padding: 20px 0;
}

.sk-h1 {
  width: 50%;
  height: 28px;
  margin-bottom: 24px;
}

.sk-h2 {
  width: 35%;
  height: 22px;
  margin: 28px 0 16px;
}

.sk-p {
  width: 100%;
  height: 14px;
  margin-bottom: 10px;
}

.sk-code-block {
  margin: 16px 0;
  padding: 16px 20px;
  background: rgba(128, 128, 128, 0.05);
  border-radius: 8px;
}

.sk-code {
  height: 12px;
  width: 70%;
  margin-bottom: 8px;
}

/* ========== 响应式 ========== */
@media (max-width: 768px) {
  .skeleton-card {
    flex-direction: column;
    gap: 0;
  }

  .sk-cover {
    width: 100%;
    height: 180px;
    border-radius: 16px 16px 0 0;
  }

  .sk-body {
    padding: 20px;
  }

  .skeleton-grid {
    grid-template-columns: 1fr;
    gap: 24px;
  }
}
</style>
