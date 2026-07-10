<template>
  <section class="posts-section" id="posts-section">
    <div class="posts-content">
      <!-- 分类标签 -->
      <div class="category-bar">
        <button
          v-for="cat in allCategories"
          :key="cat.id"
          class="category-btn"
          :class="{ active: activeCategory === cat.id }"
          @click="filterByCategory(cat.id)"
        >
          {{ cat.name }}
        </button>
      </div>

      <!-- 文章列表 -->
      <div class="posts-list" v-if="!loading">
        <article
          v-for="post in paginatedNotes"
          :key="post.id"
          class="post-card"
          @click="goToNote(post.id)"
        >
          <div v-if="post.cover" class="post-cover">
            <img :src="post.cover" :alt="post.title + '-cover'" />
          </div>
          <div class="post-info" :class="{ 'no-cover': !post.cover }">
            <div class="post-meta">
              <span class="post-category">
                <IconArticle size="14" />
                {{ getCategoryName(post.category) }}
              </span>
              <span class="post-date">
                <IconCalendarTime size="14" />
                {{ post.date }}
              </span>
            </div>
            <h3 class="post-title">{{ post.title }}</h3>
            <p class="post-excerpt">{{ post.excerpt }}</p>
            <div class="post-footer">
              <div class="post-tags">
                <span v-for="tag in post.tags" :key="tag" class="post-tag">
                  <IconTag size="12" />
                  {{ tag }}
                </span>
              </div>
              <span class="post-readtime" v-if="post.readTime">
                <IconClock size="14" />
                {{ post.readTime }}
              </span>
            </div>
          </div>
        </article>
      </div>

      <!-- 加载状态 -->
      <div v-else class="list-status">加载中...</div>

      <!-- 分页 -->
      <div v-if="totalPages > 1" class="pagination">
        <button
          class="page-btn"
          :disabled="currentPage <= 1"
          @click="currentPage--"
        >
          &lt;
        </button>
        <button
          v-for="p in totalPages"
          :key="p"
          class="page-btn"
          :class="{ active: p === currentPage }"
          @click="currentPage = p"
        >
          {{ p }}
        </button>
        <button
          class="page-btn"
          :disabled="currentPage >= totalPages"
          @click="currentPage++"
        >
          &gt;
        </button>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { IconCalendarTime, IconArticle, IconClock, IconTag } from "@tabler/icons-vue";
import type { Category, Note } from "../types";
import { getNotes, categories } from "../data/notesData";

const router = useRouter();
const currentPage = ref<number>(1);
const pageSize: number = 5;
const activeCategory = ref<string>("all");
const notes = ref<Note[]>([]);
const loading = ref(true);

const allCategories: Category[] = [{ id: "all", name: "全部" }, ...categories];

const filteredNotes = computed<Note[]>(() => {
  if (activeCategory.value === "all") return notes.value;
  return notes.value.filter((n) => n.category === activeCategory.value);
});

const totalPages = computed<number>(() =>
  Math.ceil(filteredNotes.value.length / pageSize),
);

const paginatedNotes = computed<Note[]>(() => {
  const start = (currentPage.value - 1) * pageSize;
  return filteredNotes.value.slice(start, start + pageSize);
});

function filterByCategory(catId: string): void {
  activeCategory.value = catId;
  currentPage.value = 1;
}

function getCategoryName(catId: string): string {
  const cat = categories.find((c) => c.id === catId);
  return cat ? cat.name : catId;
}

function goToNote(id: string): void {
  router.push(`/note/${id}`);
}

onMounted(async () => {
  notes.value = await getNotes();
  loading.value = false;
});
</script>

<style scoped>
.posts-section {
  position: relative;
  z-index: 20;
  padding: 40px 0;
  background-color: var(--general-background-color);
}

.posts-content {
  max-width: 900px;
  margin: 0 auto;
  padding: 0 24px;
}

.category-bar {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 32px;
}

.category-btn {
  padding: 8px 20px;
  border: 1px solid rgba(0, 0, 0, 0.08);
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.6);
  color: var(--font-color-grey);
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.category-btn:hover {
  border-color: var(--color-blue);
  color: var(--color-blue);
}

.category-btn.active {
  background: var(--color-blue);
  color: #fff;
  border-color: var(--color-blue);
}

/* 文章卡片 */
.posts-list {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.post-card {
  display: flex;
  background: var(--foreground-color);
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
  cursor: pointer;
  transition: all 0.3s ease;
}

.post-card:hover {
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
}

.post-cover {
  flex: 0 0 200px;
  overflow: hidden;
}

.post-cover img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.post-info {
  flex: 1;
  padding: 20px 24px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.post-info.no-cover {
  padding: 24px;
}

.post-meta {
  display: flex;
  align-items: center;
  gap: 16px;
  font-size: 0.8rem;
  color: #888;
}

.post-meta svg {
  vertical-align: middle;
  margin-right: 4px;
}

.post-title {
  font-size: 1.2rem;
  font-weight: 700;
  color: #222;
  margin: 0;
}

.post-excerpt {
  font-size: 0.9rem;
  color: #666;
  line-height: 1.6;
  flex: 1;
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.post-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.post-tags {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.post-tag {
  display: inline-flex;
  align-items: center;
  gap: 2px;
  padding: 2px 10px;
  background: rgba(18, 138, 250, 0.08);
  border-radius: 12px;
  font-size: 0.75rem;
  color: var(--color-blue);
}

.post-readtime {
  font-size: 0.8rem;
  color: #999;
  flex-shrink: 0;
}

/* 加载状态 */
.list-status {
  text-align: center;
  padding: 60px 0;
  color: #999;
  font-size: 0.9rem;
}

/* 分页 */
.pagination {
  display: flex;
  justify-content: center;
  gap: 6px;
  margin-top: 40px;
}

.page-btn {
  min-width: 36px;
  height: 36px;
  border: 1px solid #e0e0e0;
  background: #fff;
  border-radius: 8px;
  font-size: 0.85rem;
  color: #555;
  cursor: pointer;
  transition: all 0.2s ease;
}

.page-btn:hover:not(:disabled):not(.active) {
  border-color: #bbb;
  background: #f5f5f5;
}

.page-btn.active {
  background: #1a1a1a;
  color: #fff;
  border-color: #1a1a1a;
}

.page-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

@media (max-width: 768px) {
  .post-card {
    flex-direction: column;
  }
  .post-cover {
    flex: 0 0 180px;
  }
}
</style>
