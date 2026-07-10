<template>
  <Teleport to="body">
    <div class="search-overlay" @click.self="close">
      <div class="search-modal">
        <!-- 搜索栏 -->
        <div class="search-bar">
          <IconSearch class="search-icon" size="20" stroke="1.5" />
          <input
            ref="inputRef"
            v-model="query"
            type="text"
            class="search-input"
            placeholder="搜索文章/笔记"
            @keydown="handleKeydown"
          />
        </div>

        <!-- 搜索结果展示区 -->
        <div class="search-results" ref="resultsRef">
          <div v-if="query && results.length === 0" class="no-results">
            没有找到相关结果
          </div>
          <div v-else-if="!query" class="no-results">
            输入关键词开始搜索
          </div>
          <div
            v-else
            v-for="(result, index) in results"
            :key="result.note.id"
            class="search-item"
            :class="{ active: index === selectedIndex }"
            @click="goToNote(result.note.id)"
            @mouseenter="selectedIndex = index"
          >
            <div class="item-header">
              <span
                class="item-title"
                v-html="highlightText(result.note.title, query)"
              ></span>
              <span class="item-tag">{{ getFieldLabel(result.matchedField) }}</span>
            </div>
            <div
              class="item-context"
              v-html="highlightText(result.context, query)"
            ></div>
          </div>
        </div>

        <!-- 快捷键提示 -->
        <div class="search-shortcuts">
          <div class="shortcut">
            <kbd>↵</kbd>
            <span>选择</span>
          </div>
          <div class="shortcut">
            <kbd>↑</kbd>
            <kbd>↓</kbd>
            <span>切换</span>
          </div>
          <div class="shortcut">
            <kbd>ESC</kbd>
            <span>退出</span>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted, nextTick } from "vue";
import { useRouter } from "vue-router";
import { IconSearch } from "@tabler/icons-vue";
import { searchNotes, highlightText } from "../utils/search";
import type { SearchResult } from "../types";

const emit = defineEmits<{ close: [] }>();
const router = useRouter();

const inputRef = ref<HTMLInputElement | null>(null);
const resultsRef = ref<HTMLElement | null>(null);
const query = ref<string>("");
const selectedIndex = ref<number>(0);

const results = ref<SearchResult[]>([]);
let searchTimer: ReturnType<typeof setTimeout> | null = null;

// 查询变化时重置选中项 + 触发搜索
watch(query, () => {
  selectedIndex.value = 0;
  if (searchTimer) clearTimeout(searchTimer);
  if (!query.value.trim()) {
    results.value = [];
    return;
  }
  searchTimer = setTimeout(async () => {
    results.value = await searchNotes(query.value);
  }, 150);
});

// 选中项变化时滚动到可视区
watch(selectedIndex, () => {
  nextTick(() => {
    if (!resultsRef.value) return;
    const items = resultsRef.value.querySelectorAll(".search-item");
    const el = items[selectedIndex.value] as HTMLElement | undefined;
    el?.scrollIntoView({ block: "nearest" });
  });
});

function getFieldLabel(field: SearchResult["matchedField"]): string {
  const labels: Record<string, string> = {
    title: "标题",
    excerpt: "摘要",
    content: "正文",
  };
  return labels[field] || "";
}

function close(): void {
  emit("close");
}

function goToNote(id: string): void {
  router.push(`/note/${id}`);
  close();
}

function selectCurrent(): void {
  const result = results.value[selectedIndex.value];
  if (result) {
    goToNote(result.note.id);
  }
}

function moveSelection(direction: "up" | "down"): void {
  if (results.value.length === 0) return;
  if (direction === "down") {
    selectedIndex.value = (selectedIndex.value + 1) % results.value.length;
  } else {
    selectedIndex.value =
      (selectedIndex.value - 1 + results.value.length) % results.value.length;
  }
}

function handleKeydown(e: KeyboardEvent): void {
  switch (e.key) {
    case "ArrowDown":
      e.preventDefault();
      moveSelection("down");
      break;
    case "ArrowUp":
      e.preventDefault();
      moveSelection("up");
      break;
    case "Enter":
      e.preventDefault();
      selectCurrent();
      break;
    case "Escape":
      e.preventDefault();
      close();
      break;
  }
}

// 弹窗打开时：聚焦输入框 + 禁止背景滚动
// 全局监听 ESC（防止焦点不在输入框时也能退出）
function handleGlobalKeydown(e: KeyboardEvent): void {
  if (e.key === "Escape") {
    e.preventDefault();
    close();
  }
}

onMounted(() => {
  inputRef.value?.focus();
  document.body.style.overflow = "hidden";
  document.addEventListener("keydown", handleGlobalKeydown);
});

onUnmounted(() => {
  document.body.style.overflow = "";
  document.removeEventListener("keydown", handleGlobalKeydown);
});
</script>

<style scoped>
.search-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
  z-index: 9999;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding-top: 12vh;
  animation: fadeIn 0.2s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.search-modal {
  width: 90%;
  max-width: 600px;
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 16px 48px rgba(0, 0, 0, 0.2);
  overflow: hidden;
  animation: slideDown 0.25s ease-out;
}

@keyframes slideDown {
  from {
    transform: translateY(-20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

/* 搜索栏 */
.search-bar {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px 20px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.06);
}

.search-icon {
  flex-shrink: 0;
  color: var(--font-color-grey);
  opacity: 0.5;
  font-size: 1.2em;
}

.search-input {
  flex: 1;
  border: none;
  outline: none;
  font-size: 1rem;
  color: var(--font-color-grey);
  background: transparent;
}

.search-input::placeholder {
  color: var(--font-color-grey);
  opacity: 0.4;
}

/* 搜索结果区 */
.search-results {
  max-height: 400px;
  overflow-y: auto;
  padding: 8px;
}

.no-results {
  padding: 48px 20px;
  text-align: center;
  color: var(--font-color-grey);
  opacity: 0.5;
  font-size: 0.95rem;
}

.search-item {
  padding: 12px 16px;
  border-radius: 10px;
  cursor: pointer;
  transition: background 0.15s ease;
}

.search-item.active {
  background: rgba(var(--blue-shadow-color), 0.08);
}

.item-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 4px;
}

.item-title {
  font-size: 0.95rem;
  font-weight: 600;
  color: var(--font-color-grey);
}

.item-tag {
  flex-shrink: 0;
  padding: 1px 8px;
  background: rgba(var(--blue-shadow-color), 0.1);
  color: var(--color-blue);
  border-radius: 10px;
  font-size: 0.7rem;
  font-weight: 500;
}

.item-context {
  font-size: 0.85rem;
  color: var(--font-color-grey);
  opacity: 0.7;
  line-height: 1.5;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

/* 高亮关键词 */
:deep(.search-highlight) {
  background: rgba(255, 213, 79, 0.5);
  color: inherit;
  padding: 0 2px;
  border-radius: 3px;
  font-weight: 600;
}

/* 快捷键提示 */
.search-shortcuts {
  display: flex;
  align-items: center;
  gap: 24px;
  padding: 12px 20px;
  border-top: 1px solid rgba(0, 0, 0, 0.06);
  background: rgba(0, 0, 0, 0.02);
}

.shortcut {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.8rem;
  color: var(--font-color-grey);
  opacity: 0.6;
}

.shortcut kbd {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 22px;
  height: 22px;
  padding: 0 6px;
  background: #fff;
  border: 1px solid rgba(0, 0, 0, 0.12);
  border-bottom-width: 2px;
  border-radius: 5px;
  font-family: inherit;
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--font-color-grey);
}
</style>
