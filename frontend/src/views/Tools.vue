<template>
  <div class="tools-page">
    <!-- 封面区域 -->
    <div class="tools-hero">
      <div class="hero-cover hero-cover-navy"></div>
      <WaveDivider />
    </div>

    <!-- 主体内容 -->
    <div class="tools-body">
      <div class="tools-card">
        <!-- 左侧目录 -->
        <div class="tools-sidebar">
          <div class="sidebar-header">
            <h2>工具目录</h2>
          </div>
          <nav class="tools-nav">
            <button
              v-for="tool in tools"
              :key="tool.id"
              class="nav-item"
              :class="{ active: activeTool === tool.id }"
              @click="activeTool = tool.id"
            >
              <span class="nav-icon">{{ tool.icon }}</span>
              <span class="nav-label">{{ tool.name }}</span>
            </button>
          </nav>
        </div>

        <!-- 右侧内容区 -->
        <div class="tools-content">
          <!-- 未选择工具时的默认展示 -->
          <div v-if="!activeTool" class="content-placeholder">
            <div class="toolbox-icon">
              <IconTools size="100" stroke="1.5" />
            </div>
          </div>

          <!-- 视频转音频工具 -->
          <VideoToAudio v-else-if="activeTool === 'video-to-audio'" />

          <!-- 实用网址链接 -->
          <UsefulLinks v-else-if="activeTool === 'useful-links'" />
        </div>
      </div>
    </div>

    <!-- 评论区 -->
    <CommentSection :pageId="'tool_' + activeTool" />
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { IconTools } from "@tabler/icons-vue";
import WaveDivider from "../components/WaveDivider.vue";
import CommentSection from "../components/CommentSection.vue";
import VideoToAudio from "../components/tools/VideoToAudio.vue";
import UsefulLinks from "../components/tools/UsefulLinks.vue";
import type { Tool } from "../types";

const tools: Tool[] = [
  { id: "video-to-audio", name: "视频转音频", icon: "🎵" },
  { id: "useful-links", name: "实用网址", icon: "🔗" },
];

const activeTool = ref<string>("");
</script>

<style scoped>
.tools-page {
  min-height: 100vh;
  background-color: var(--general-background-color);
}

/* 封面区域 */
.tools-hero {
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

.hero-cover-navy {
  background: #0a3d62;
}

/* 主体内容 */
.tools-body {
  padding: 0 24px 80px;
}

.tools-card {
  max-width: 1200px;
  height: 540px;
  margin: 0 auto;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 16px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
  display: flex;
  overflow: hidden;
}

/* 左侧目录 */
.tools-sidebar {
  width: 240px;
  border-right: 1px solid rgba(0, 0, 0, 0.06);
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
}

.sidebar-header {
  padding: 20px 24px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.06);
}

.sidebar-header h2 {
  margin: 0;
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--font-color-grey);
}

.tools-nav {
  flex: 1;
  padding: 12px 0;
  display: flex;
  flex-direction: column;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 24px;
  background: transparent;
  border: none;
  cursor: pointer;
  text-align: left;
  transition: all 0.3s ease;
  color: var(--font-color-grey);
  font-size: 0.95rem;
}

.nav-item:hover {
  background: rgba(59, 130, 246, 0.06);
}

.nav-item.active {
  background: rgba(59, 130, 246, 0.1);
  color: var(--color-blue);
  font-weight: 600;
  border-left: 3px solid var(--color-blue);
}

.nav-icon {
  font-size: 1.1rem;
}

/* 右侧内容区 */
.tools-content {
  flex: 1;
  width: 960px;
  overflow: hidden;
}

/* 默认占位 */
.content-placeholder {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.toolbox-icon {
  width: 100px;
  height: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* 响应式 */
@media (max-width: 1200px) {
  .tools-card {
    height: auto;
    min-height: 540px;
    flex-direction: column;
  }

  .tools-sidebar {
    width: 100%;
    border-right: none;
    border-bottom: 1px solid rgba(0, 0, 0, 0.06);
  }

  .tools-nav {
    flex-direction: row;
    padding: 8px;
    gap: 8px;
  }

  .nav-item {
    padding: 10px 16px;
    border-left: none !important;
    border-bottom: 3px solid transparent;
    border-radius: 8px;
  }

  .nav-item.active {
    border-bottom: 3px solid var(--color-blue);
  }

  .tools-content {
    width: 100%;
  }
}

@media (max-width: 768px) {
  .tools-body {
    padding: 0 16px 60px;
  }
}
</style>
