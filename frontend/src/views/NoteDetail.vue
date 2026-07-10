<template>
  <div class="note-detail" v-if="note">
    <!-- 顶部封面 -->
    <div class="note-hero">
      <div
        class="hero-cover"
        :style="{ backgroundImage: `url(${note.cover})` }"
      ></div>
      <div class="hero-overlay"></div>
      <div class="hero-content">
        <h1 class="hero-title">{{ note.title }}</h1>
        <div class="hero-meta">
          <span>{{ note.date }}</span>
          <span class="dot"></span>
          <span>{{ note.wordCount }}</span>
          <span class="dot"></span>
          <span>{{ note.readTime }}</span>
        </div>
      </div>
      <WaveDivider />
    </div>

    <!-- 主体内容 -->
    <div class="note-body">
      <div class="note-content">
        <!-- Web Worker 解析中的加载态 -->
        <div v-if="isParsing" class="parsing-loading">
          <div class="skeleton">
            <div class="skeleton-line w-80"></div>
            <div class="skeleton-line w-60"></div>
            <div class="skeleton-line w-90" v-for="i in 4" :key="i"></div>
            <div class="skeleton-line w-40"></div>
          </div>
          <p class="parsing-hint">正在解析文档...</p>
        </div>

        <!-- 解析错误 -->
        <div v-else-if="parseError" class="parse-error">
          <p>解析失败：{{ parseError }}</p>
        </div>

        <!-- 渲染完成的内容（增量更新：旧内容保留直到新内容就绪） -->
        <div v-else class="markdown-body" ref="contentRef">
          <!-- 按标题分块渲染，利用 content-visibility 实现虚拟滚动 -->
          <template v-for="(section, index) in renderedSections" :key="index">
            <div class="md-section" :data-section-index="index">
              <div v-html="section.html"></div>
            </div>
          </template>
        </div>

        <!-- 标签 -->
        <div class="note-tags" v-if="note.tags && note.tags.length">
          <span class="tag-label">标签：</span>
          <span v-for="tag in note.tags" :key="tag" class="note-tag">{{
            tag
          }}</span>
        </div>

        <!-- 上一页/下一页 -->
        <div class="note-nav">
          <div
            class="nav-card prev"
            :class="{ disabled: !adjacent.prev }"
            @click="adjacent.prev && goToNote(adjacent.prev.id)"
          >
            <span class="nav-label">
              <IconChevronLeft size="1em" stroke="1.5" />
              上一篇
            </span>
            <span class="nav-title" v-if="adjacent.prev">{{
              adjacent.prev.title
            }}</span>
            <span class="nav-title" v-else>没有更多了</span>
          </div>
          <div
            class="nav-card next"
            :class="{ disabled: !adjacent.next }"
            @click="adjacent.next && goToNote(adjacent.next.id)"
          >
            <span class="nav-label">
              下一篇
              <IconChevronRight size="1em" stroke="1.5" />
            </span>
            <span class="nav-title" v-if="adjacent.next">{{
              adjacent.next.title
            }}</span>
            <span class="nav-title" v-else>没有更多了</span>
          </div>
        </div>
      </div>

      <!-- 目录侧边栏 -->
      <aside class="toc-sidebar">
        <div class="toc-title">目录</div>
        <nav class="toc-nav">
          <ul>
            <li
              v-for="item in toc"
              :key="item.id"
              :class="[
                'toc-level-' + item.level,
                { active: activeHeading === item.id },
              ]"
            >
              <a
                :href="'#' + item.id"
                @click.prevent="scrollToHeading(item.id)"
              >
                {{ item.text }}
              </a>
            </li>
          </ul>
        </nav>
      </aside>
    </div>

    <!-- 评论区 -->
    <CommentSection :pageId="String(noteId)" />
  </div>

  <div v-else class="note-not-found">
    <p>笔记未找到</p>
    <button @click="goBack">返回首页</button>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted, nextTick } from "vue";
import { useRoute, useRouter } from "vue-router";
import DOMPurify from "dompurify";
import { IconChevronLeft, IconChevronRight } from "@tabler/icons-vue";
import WaveDivider from "../components/WaveDivider.vue";
import CommentSection from "../components/CommentSection.vue";
import type { Note, AdjacentNotes } from "../types";
import {
  categories,
  getNoteContent,
  getAdjacentNotes,
  getNotes,
} from "../data/notesData";
import { extractToc, assignHeadingIds } from "../utils/markdown";
import { useScrollSpy } from "../composables/useScrollSpy";

const route = useRoute();
const router = useRouter();

const contentRef = ref<HTMLElement | null>(null);

const noteId = computed<string>(() => route.params.id as string);
const note = ref<Note | undefined>();
const adjacent = ref<AdjacentNotes>({ prev: null, next: null });

// 加载笔记数据与内容
onMounted(async () => {
  const [allNotes, adj] = await Promise.all([
    getNotes(),
    getAdjacentNotes(noteId.value),
  ]);
  note.value = allNotes.find((n) => n.id === noteId.value);
  adjacent.value = adj;

  const content = await getNoteContent(String(noteId.value));
  parseMarkdown(content);
});

// ============================================================
// 1. Web Worker 异步解析 Markdown
// ============================================================
const workerRef = ref<Worker | null>(null);
const renderedFullHtml = ref("");
const isParsing = ref(false);
const parseError = ref("");
const rawContent = ref("");

// 存储上一次渲染的结果（增量更新用）
const prevRenderedHtml = ref("");

// 按标题分块存储
const renderedSections = ref<{ html: string }[]>([]);

function getCategoryName(catId: string): string {
  const cat = categories.find((c) => c.id === catId);
  return cat ? cat.name : catId;
}

function goBack(): void {
  router.push("/");
}

function goToNote(id: string): void {
  router.push(`/note/${id}`);
}

function scrollToHeading(id: string): void {
  const el = document.getElementById(id);
  if (el) {
    const offset = 80;
    const top = el.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: "smooth" });
    activeHeading.value = id;
  }
}

// 将 HTML 按标题分块
function splitHtmlIntoSections(html: string): { html: string }[] {
  if (!html) return [];

  // 以 h1/h2 作为分块边界
  const sectionRegex = /(<h[12][^>]*>.*?<\/h[12]>)/gi;
  const parts = html.split(sectionRegex);
  const sections: { html: string }[] = [];
  let currentSection = "";

  for (let i = 0; i < parts.length; i++) {
    const part = parts[i];
    if (/^<h[12]/i.test(part)) {
      if (currentSection) {
        sections.push({ html: currentSection });
      }
      currentSection = part;
    } else {
      currentSection += part;
    }
  }

  if (currentSection) {
    sections.push({ html: currentSection });
  }

  // 如果没分块（无标题），整段作为一个块
  if (sections.length === 0 && html) {
    sections.push({ html });
  }

  return sections;
}

// 启动解析
function parseMarkdown(content: string): void {
  if (!content) {
    renderedSections.value = [];
    isParsing.value = false;
    return;
  }

  rawContent.value = content;
  isParsing.value = true;
  parseError.value = "";
  renderedSections.value = [];

  // 保留旧内容用于增量更新（在模板中保持显示）
  if (renderedFullHtml.value) {
    prevRenderedHtml.value = renderedFullHtml.value;
  }

  if (!workerRef.value) {
    // 创建 Web Worker
    workerRef.value = new Worker(
      new URL("../workers/markdown.worker.ts", import.meta.url),
      { type: "module" },
    );

    workerRef.value.onmessage = (
      e: MessageEvent<{ html: string; error?: string }>,
    ) => {
      const { html, error } = e.data;

      if (error) {
        parseError.value = error;
        isParsing.value = false;
        return;
      }

      // 主线程执行 DOMPurify 净化
      const sanitized = DOMPurify.sanitize(html);
      renderedFullHtml.value = sanitized;

      // 按标题分块
      renderedSections.value = splitHtmlIntoSections(sanitized);
      prevRenderedHtml.value = "";
      isParsing.value = false;

      // 渲染完成后处理标题 id 和代码块懒加载
      nextTick(() => {
        if (contentRef.value) {
          assignHeadingIds(contentRef.value);
          observeCodeBlocks(contentRef.value);
        }
        updateActiveHeading();
      });
    };

    workerRef.value.onerror = () => {
      parseError.value = "Markdown 解析服务异常，请刷新重试";
      isParsing.value = false;
    };
  }

  workerRef.value.postMessage(content);
}

// ============================================================
// 2. 代码块懒加载（IntersectionObserver）
// ============================================================
let codeBlockObserver: IntersectionObserver | null = null;

function observeCodeBlocks(container: HTMLElement): void {
  // 先清理旧 observer
  if (codeBlockObserver) {
    codeBlockObserver.disconnect();
  }

  const codeBlocks = container.querySelectorAll("pre code");
  if (!codeBlocks.length) return;

  codeBlockObserver = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          const codeEl = entry.target as HTMLElement;
          // 标记已加载，添加 class 以便后续可扩展语法高亮
          codeEl.classList.add("code-loaded");
          codeBlockObserver?.unobserve(codeEl);
        }
      }
    },
    { rootMargin: "200px 0px" },
  );

  codeBlocks.forEach((el) => codeBlockObserver!.observe(el));
}

// ============================================================
// 3. 计算与数据
// ============================================================

// 从 markdown 中提取标题生成目录（直接在 raw markdown 上操作）
const toc = computed(() => {
  if (!rawContent.value) return [];
  return extractToc(rawContent.value);
});

// 滚动高亮标题
const { activeHeading, update: updateActiveHeading } = useScrollSpy(toc);

// ============================================================
// 4. 生命周期
// ============================================================

onUnmounted(() => {
  // 销毁 Worker
  if (workerRef.value) {
    workerRef.value.terminate();
    workerRef.value = null;
  }
  // 清理 IntersectionObserver
  if (codeBlockObserver) {
    codeBlockObserver.disconnect();
    codeBlockObserver = null;
  }
});

// 监听路由变化：保留旧内容，新内容解析完成后自动替换
watch(noteId, async (newId, oldId) => {
  if (newId === oldId) return;
  window.scrollTo({ top: 0 });

  // 重新获取笔记信息
  const [allNotes, adj] = await Promise.all([
    getNotes(),
    getAdjacentNotes(String(newId)),
  ]);
  note.value = allNotes.find((n) => n.id === newId);
  adjacent.value = adj;

  const content = await getNoteContent(String(newId));
  parseMarkdown(content);
});
</script>

<style scoped>
.note-detail {
  min-height: 100vh;
  background-color: var(--general-background-color);
}

/* 顶部封面 */
.note-hero {
  position: relative;
  height: 260px;
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
  max-width: 1000px;
  margin: 0 auto;
  padding: 0 24px 90px;
}

.hero-title {
  color: #fff;
  font-size: 2rem;
  font-weight: 700;
  margin: 0 0 12px;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
}

.hero-meta {
  display: flex;
  align-items: center;
  gap: 12px;
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.9rem;
}

.hero-meta .dot {
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.5);
}

/* 主体内容 */
.note-body {
  display: flex;
  gap: 40px;
  max-width: 1100px;
  margin: 0 auto 0 calc(50% - 500px);
  padding: 0px 24px 80px;
}

/* 目录侧边栏 */
.toc-sidebar {
  flex-shrink: 0;
  width: 220px;
  position: sticky;
  top: 120px;
  align-self: flex-start;
  max-height: calc(100vh - 140px);
  overflow-y: auto;
}

.toc-title {
  font-size: 0.9rem;
  font-weight: 700;
  color: var(--font-color-grey);
  margin-bottom: 16px;
  padding-left: 12px;
  border-left: 3px solid var(--color-blue);
}

.toc-nav ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.toc-nav li {
  padding: 0;
  margin: 0;
}

.toc-nav a {
  display: block;
  padding: 6px 12px;
  font-size: 0.85rem;
  color: var(--font-color-grey);
  opacity: 0.7;
  text-decoration: none;
  border-left: 2px solid transparent;
  transition: all 0.2s ease;
  cursor: pointer;
  line-height: 1.5;
}

.toc-nav a:hover {
  opacity: 1;
  color: var(--color-blue);
}

.toc-nav li.active a {
  color: var(--color-blue);
  border-left-color: var(--color-blue);
  opacity: 1;
  font-weight: 500;
}

.toc-level-3 a {
  padding-left: 24px;
  font-size: 0.8rem;
}

.toc-level-4 a {
  padding-left: 36px;
  font-size: 0.75rem;
}

/* Markdown 内容容器 */
.note-content {
  flex: 1;
  min-width: 0;
}

.markdown-body {
  background: rgba(255, 255, 255, 0.7);
  border-radius: 16px;
  padding: 40px 48px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
}

/* ============================================================
   虚拟滚动：利用 content-visibility 跳过不可见区域的渲染
   ============================================================ */
.md-section {
  content-visibility: auto;
  contain-intrinsic-size: 200px;
}

/* ============================================================
   Web Worker 解析中的骨架屏加载态
   ============================================================ */
.parsing-loading {
  background: rgba(255, 255, 255, 0.7);
  border-radius: 16px;
  padding: 40px 48px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
}

.skeleton {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.skeleton-line {
  height: 16px;
  background: linear-gradient(90deg, #e0e0e0 25%, #f0f0f0 50%, #e0e0e0 75%);
  background-size: 200% 100%;
  animation: skeleton-shimmer 1.5s ease-in-out infinite;
  border-radius: 4px;
}

.skeleton-line.w-80 {
  width: 80%;
}
.skeleton-line.w-60 {
  width: 60%;
}
.skeleton-line.w-90 {
  width: 90%;
}
.skeleton-line.w-40 {
  width: 40%;
}

@keyframes skeleton-shimmer {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}

.parsing-hint {
  text-align: center;
  color: var(--font-color-grey);
  opacity: 0.5;
  font-size: 0.85rem;
  margin-top: 16px;
}

/* 解析错误 */
.parse-error {
  background: rgba(255, 255, 255, 0.7);
  border-radius: 16px;
  padding: 40px 48px;
  text-align: center;
  color: #ef5350;
}

/* ============================================================
   代码块懒加载：未进入视口的代码块保持最小高度
   ============================================================ */
.markdown-body :deep(pre) {
  background: #1e1e2e;
  border-radius: 12px;
  padding: 20px 24px;
  overflow-x: auto;
  margin: 0 0 20px;
  /* 代码块懒加载：默认最小高度 */
  contain-intrinsic-size: 80px;
}

.markdown-body :deep(pre code) {
  background: none;
  color: #cdd6f4;
  padding: 0;
  font-size: 0.85rem;
  line-height: 1.6;
}

.markdown-body :deep(pre code.code-loaded) {
  /* 代码块加载完成的标识 class */
}

/* 保留原有 Markdown 样式 */
.markdown-body :deep(h1) {
  font-size: 1.8rem;
  font-weight: 700;
  color: var(--font-color-grey);
  margin: 0 0 24px;
  padding-bottom: 12px;
  border-bottom: 2px solid rgba(0, 0, 0, 0.06);
}

.markdown-body :deep(h2) {
  font-size: 1.4rem;
  font-weight: 600;
  color: var(--font-color-grey);
  margin: 32px 0 16px;
  padding-left: 12px;
  border-left: 4px solid var(--color-blue);
}

.markdown-body :deep(h3) {
  font-size: 1.15rem;
  font-weight: 600;
  color: var(--font-color-grey);
  margin: 24px 0 12px;
}

.markdown-body :deep(h4) {
  font-size: 1rem;
  font-weight: 600;
  color: var(--font-color-grey);
  margin: 20px 0 8px;
}

.markdown-body :deep(p) {
  font-size: 0.95rem;
  line-height: 1.8;
  color: var(--font-color-grey);
  margin: 0 0 16px;
}

.markdown-body :deep(code) {
  font-family: "JetBrains Mono", "Fira Code", monospace;
  font-size: 0.875em;
  padding: 2px 6px;
  background: rgba(0, 0, 0, 0.05);
  border-radius: 4px;
  color: #e96900;
}

.markdown-body :deep(ul),
.markdown-body :deep(ol) {
  padding-left: 24px;
  margin: 0 0 16px;
}

.markdown-body :deep(li) {
  font-size: 0.95rem;
  line-height: 1.8;
  color: var(--font-color-grey);
  margin-bottom: 4px;
}

.markdown-body :deep(blockquote) {
  margin: 0 0 16px;
  padding: 12px 20px;
  border-left: 4px solid var(--color-blue);
  background: rgba(var(--blue-shadow-color), 0.05);
  border-radius: 0 8px 8px 0;
}

.markdown-body :deep(blockquote p) {
  margin: 0;
  color: var(--font-color-grey);
  opacity: 0.85;
}

.markdown-body :deep(table) {
  width: 100%;
  border-collapse: collapse;
  margin: 0 0 20px;
  font-size: 0.9rem;
}

.markdown-body :deep(th),
.markdown-body :deep(td) {
  padding: 10px 16px;
  border: 1px solid rgba(0, 0, 0, 0.08);
  text-align: left;
}

.markdown-body :deep(th) {
  background: rgba(0, 0, 0, 0.03);
  font-weight: 600;
}

.markdown-body :deep(a) {
  color: var(--color-blue);
  text-decoration: none;
}

.markdown-body :deep(a:hover) {
  text-decoration: underline;
}

/* 标签 */
.note-tags {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 32px;
  padding: 0;
}

.tag-label {
  font-size: 0.9rem;
  color: var(--font-color-grey);
  opacity: 0.6;
}

.note-tag {
  padding: 4px 12px;
  background: rgba(var(--blue-shadow-color), 0.1);
  border-radius: 20px;
  font-size: 0.85rem;
  color: var(--color-blue);
}

/* 上一页/下一页 */
.note-nav {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  margin-top: 40px;
  padding: 0;
}

.nav-card {
  flex: 0 0 40%;
  padding: 20px 24px;
  background: rgba(255, 255, 255, 0.7);
  border-radius: 12px;
  border: 1px solid rgba(0, 0, 0, 0.06);
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.nav-card:hover:not(.disabled) {
  background: rgba(255, 255, 255, 0.95);
  border-color: var(--color-blue);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  transform: translateY(-2px);
}

.nav-card.disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.nav-card.next {
  text-align: right;
}

.nav-label {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.8rem;
  color: var(--color-blue);
  font-weight: 500;
}

.nav-card.next .nav-label {
  justify-content: flex-end;
}

.nav-title {
  font-size: 1rem;
  font-weight: 600;
  color: var(--font-color-grey);
}

/* 未找到 */
.note-not-found {
  min-height: 60vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
  background-color: var(--general-background-color);
}

.note-not-found p {
  font-size: 1.2rem;
  color: var(--font-color-grey);
}

.note-not-found button {
  padding: 8px 24px;
  background: var(--color-blue);
  color: #fff;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.9rem;
}

/* 响应式 */
@media (max-width: 900px) {
  .toc-sidebar {
    display: none;
  }

  .markdown-body,
  .parsing-loading {
    padding: 24px 20px;
  }

  .note-nav {
    flex-direction: column;
  }

  .hero-title {
    font-size: 1.5rem;
  }
}
</style>
