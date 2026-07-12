<template>
  <div class="articles-page">
    <!-- 顶部封面 -->
    <div class="articles-hero">
      <div
        class="hero-cover"
        :style="{ backgroundImage: `url(${coverImage})` }"
      ></div>
      <div class="hero-overlay"></div>
      <div class="hero-content">
        <!-- 标签筛选 -->
        <div class="tag-filter" v-if="allTags.length">
          <button
            v-for="tag in allTags"
            :key="tag"
            class="tag-btn"
            :class="{ active: selectedTags.has(tag) }"
            @click="toggleTag(tag)"
          >
            {{ tag }}
          </button>
        </div>
      </div>
      <!-- 波浪过渡 -->
      <WaveDivider />
    </div>

    <!-- 文章列表 -->
    <div class="articles-body">
      <div class="container">
        <!-- 加载骨架 -->
        <LoadingSkeleton v-if="loading" type="card" :count="5" />

        <template v-else>
          <div class="filter-info" v-if="selectedTags.size > 0">
            <span>
              已选择 {{ selectedTags.size }} 个标签，找到
              {{ filteredPosts.length }} 篇文章
            </span>
            <button class="clear-btn" @click="clearTags">清除筛选</button>
          </div>

          <div class="posts-list" v-if="filteredPosts.length">
            <article
              v-for="post in filteredPosts"
              :key="post.id"
              class="post card"
              @click="goToArticle(post.id)"
            >
              <header class="post-header">
                <div class="cover-container">
                  <img
                    :src="post.cover"
                    :alt="post.title + '-cover'"
                    class="cover-image"
                    loading="lazy"
                  />
                </div>
                <div class="header-content">
                  <div class="title">
                    <h2 class="name">{{ post.title }}</h2>
                  </div>
                  <div class="meta-info-bar">
                    <IconCalendarTime class="meta-icon" size="18" stroke="1.5" />
                    <div class="time-info">
                      <time :datetime="post.datetime">{{ post.date }}</time>
                    </div>
                    <div class="separator"></div>
                    <IconArticle class="meta-icon" size="18" stroke="1.5" />
                    <div class="time-info">{{ post.wordCount }}</div>
                    <div class="separator"></div>
                    <IconClock class="meta-icon" size="18" stroke="1.5" />
                    <div class="time-info">{{ post.readTime }}</div>
                  </div>
                  <ul class="tags" v-if="post.tags && post.tags.length">
                    <li v-for="tag in post.tags" :key="tag">
                      <span class="tag-link">{{ tag }}</span>
                    </li>
                  </ul>
                  <div class="excerpt">
                    <p>{{ post.excerpt }}</p>
                  </div>
                </div>
              </header>
            </article>
          </div>

          <div class="no-results" v-else>
            <p>没有找到匹配的文章</p>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { IconCalendarTime, IconArticle, IconClock } from "@tabler/icons-vue";
import WaveDivider from "../components/WaveDivider.vue";
import LoadingSkeleton from "../components/LoadingSkeleton.vue";
import type { Note } from "../types";
import { getNotes } from "../data/notesData";
import coverImage from "../assets/articles-cover.svg";

const router = useRouter();
const notes = ref<Note[]>([]);
const loading = ref(true);

onMounted(async () => {
  try {
    notes.value = await getNotes();
  } finally {
    loading.value = false;
  }
});

// 从所有笔记中提取不重复的标签
const allTags = computed<string[]>(() => {
  const set = new Set<string>();
  notes.value.forEach((p) => p.tags.forEach((t) => set.add(t)));
  return Array.from(set).sort();
});

// 选中的标签（复选）
const selectedTags = ref<Set<string>>(new Set());

function toggleTag(tag: string): void {
  if (selectedTags.value.has(tag)) {
    selectedTags.value.delete(tag);
  } else {
    selectedTags.value.add(tag);
  }
  // 触发响应式更新
  selectedTags.value = new Set(selectedTags.value);
}

function clearTags(): void {
  selectedTags.value = new Set();
}

// 根据标签筛选文章
const filteredPosts = computed<Note[]>(() => {
  if (selectedTags.value.size === 0) return notes.value;
  return notes.value.filter((p) => p.tags.some((t) => selectedTags.value.has(t)));
});

function goToArticle(id: string): void {
  router.push(`/note/${id}`);
}
</script>

<style scoped>
.articles-page {
  min-height: 100vh;
  background-color: var(--general-background-color);
}

/* 顶部封面 */
.articles-hero {
  position: relative;
  height: 340px;
  display: flex;
  align-items: center;
  justify-content: center;
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
  filter: blur(2px);
  transform: scale(1.05);
}

.hero-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    to bottom,
    rgba(0, 0, 0, 0.3) 0%,
    rgba(0, 0, 0, 0.5) 60%,
    rgba(0, 0, 0, 0.8) 100%
  );
}

.hero-content {
  position: relative;
  z-index: 1;
  width: 100%;
  max-width: 900px;
  margin: 0 auto;
  padding: 0 24px 80px;
  text-align: center;
}

/* 标签筛选 */
.tag-filter {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 10px;
}

.tag-btn {
  padding: 6px 16px;
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 20px;
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.85rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.25s ease;
}

.tag-btn:hover {
  background: rgba(255, 255, 255, 0.25);
  color: #fff;
  border-color: rgba(255, 255, 255, 0.4);
}

.tag-btn.active {
  background: var(--color-blue);
  color: #fff;
  border-color: var(--color-blue);
  box-shadow: 0 2px 12px rgba(18, 138, 250, 0.4);
}

/* 文章列表 */
.articles-body {
  padding: 0px 0 60px;
}

.filter-info {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;
  padding: 12px 20px;
  background: rgba(255, 255, 255, 0.6);
  border-radius: 12px;
  font-size: 0.9rem;
  color: var(--font-color-grey);
}

.clear-btn {
  padding: 4px 14px;
  background: rgba(var(--blue-shadow-color), 0.1);
  color: var(--color-blue);
  border-radius: 8px;
  font-size: 0.85rem;
  font-weight: 500;
}

.clear-btn:hover {
  background: var(--color-blue);
  color: #fff;
  transform: none;
}

.posts-list {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.post {
  position: relative;
  overflow: hidden;
  border-radius: 16px;
  padding: 0;
  cursor: pointer;
  transition:
    transform 0.3s ease,
    box-shadow 0.3s ease;
}

.post:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
}

.post-header {
  display: flex;
  gap: 24px;
}

.cover-container {
  flex-shrink: 0;
  width: 280px;
  overflow: hidden;
  border-radius: 16px 0 0 16px;
}

.cover-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  transition: transform 0.5s ease;
}

.post:hover .cover-image {
  transform: scale(1.05);
}

.header-content {
  flex: 1;
  padding: 24px 24px 24px 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.name {
  margin: 0;
  font-size: 1.4rem;
  font-weight: 700;
  line-height: 1.4;
  color: var(--font-color-grey);
  transition: color 0.3s ease;
}

.post:hover .name {
  color: var(--color-blue);
}

.meta-info-bar {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 0.9rem;
  color: var(--font-color-grey);
  opacity: 0.8;
  flex-wrap: wrap;
}

.meta-icon {
  width: 1.1em;
  height: 1.1em;
  color: var(--icon-color);
}

.time-info {
  display: flex;
  align-items: center;
}

.separator {
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: var(--font-color-grey);
  opacity: 0.3;
}

.tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  list-style: none;
  padding: 0;
  margin: 4px 0;
}

.tags li {
  list-style: none;
}

.tag-link {
  display: inline-flex;
  align-items: center;
  padding: 4px 12px;
  background: rgba(var(--blue-shadow-color), 0.1);
  border-radius: 20px;
  font-size: 0.85rem;
  color: var(--color-blue);
}

.excerpt {
  color: var(--font-color-grey);
  font-size: 0.95rem;
  line-height: 1.6;
  opacity: 0.85;
  margin-top: auto;
}

.excerpt p {
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.no-results {
  padding: 60px 20px;
  text-align: center;
  color: var(--font-color-grey);
  opacity: 0.5;
  font-size: 1rem;
}

@media (max-width: 768px) {
  .hero-content {
    padding: 0 16px 60px;
  }

  .post-header {
    flex-direction: column;
    gap: 0;
  }

  .cover-container {
    width: 100%;
    height: 180px;
    border-radius: 16px 16px 0 0;
  }

  .header-content {
    padding: 20px;
  }

  .name {
    font-size: 1.2rem;
  }
}
</style>
