<template>
  <div class="page-placeholder">
    <div class="placeholder-card card glass">
      <h1>{{ pageTitle }}</h1>
      <p>该页面正在建设中...</p>
      <router-link to="/" class="back-link">返回首页</router-link>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

const pageTitle = computed(() => {
  const titles: Record<string, string> = {
    '/articles': '文章',
    '/project': '项目',
    '/album': '相册',
    '/tools': '工具',
    '/about': '关于'
  }
  return titles[route.path] || '页面'
})
</script>

<style scoped>
.page-placeholder {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 120px 24px 60px;
}

.placeholder-card {
  text-align: center;
  padding: 60px 48px;
  border-radius: 20px;
  max-width: 500px;
}

.placeholder-card h1 {
  font-size: 2rem;
  color: var(--font-color-grey);
  margin-bottom: 16px;
}

.placeholder-card p {
  color: var(--font-color-grey);
  opacity: 0.7;
  margin-bottom: 24px;
}

.back-link {
  display: inline-block;
  padding: 10px 24px;
  background: var(--color-blue);
  color: white;
  border-radius: 8px;
  font-weight: 600;
  transition: all var(--transition-time) var(--transition-curve);
}

.back-link:hover {
  background: var(--btn-hover);
  transform: translateY(-2px);
  color: white;
}
</style>
