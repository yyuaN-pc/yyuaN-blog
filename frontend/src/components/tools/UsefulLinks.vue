<template>
  <div class="useful-links">
    <div
      v-for="category in linkCategories"
      :key="category.name"
      class="link-category"
    >
      <h3 class="category-title">{{ category.name }}</h3>
      <div class="link-list">
        <a
          v-for="link in category.links"
          :key="link.url"
          :href="link.url"
          target="_blank"
          rel="noopener"
          class="link-item"
        >
          <div class="link-name">{{ link.name }}</div>
          <div class="link-desc">{{ link.desc }}</div>
        </a>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { LinkCategory } from "../../types";

const linkCategories: LinkCategory[] = [
  {
    name: "开发工具",
    links: [
      {
        name: "GitHub",
        url: "https://github.com",
        desc: "全球最大代码托管平台",
      },
      {
        name: "MDN Web Docs",
        url: "https://developer.mozilla.org",
        desc: "Web 开发权威文档",
      },
    ],
  },
  {
    name: "学习平台",
    links: [
      { name: "LeetCode", url: "https://leetcode.cn", desc: "算法刷题平台" },
      { name: "菜鸟教程", url: "https://www.runoob.com", desc: "编程入门教程" },
    ],
  },
  {
    name: "百宝箱",
    links: [
      {
        name: "Notion",
        url: "https://tiermaker.com/single-use-tier-list/",
        desc: "在线分级排名网站",
      },
      {
        name: "Draw.io",
        url: "https://www.drawio.com/",
        desc: "在线图表绘制",
      },
      { name: "TinyPNG", url: "https://tinypng.com", desc: "在线图片压缩工具" },
      {
        name: "Sgsshap",
        url: "http://www.sgsshap.cn:8000/#/home",
        desc: "三国杀在线制图器",
      },
    ],
  },
];
</script>

<style scoped>
.useful-links {
  height: 100%;
  padding: 24px 32px;
  overflow-y: auto;
}

.link-category {
  margin-bottom: 24px;
}

.category-title {
  font-size: 15px;
  font-weight: 600;
  color: var(--font-color-grey);
  margin: 0 0 12px;
  padding-bottom: 8px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.06);
}

.link-list {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}

.link-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 12px 16px;
  background: rgba(0, 0, 0, 0.03);
  border-radius: 8px;
  text-decoration: none;
  transition: all 0.3s ease;
}

.link-item:hover {
  background: rgba(59, 130, 246, 0.08);
  transform: translateY(-2px);
}

.link-name {
  font-size: 14px;
  font-weight: 600;
  color: var(--font-color-grey);
}

.link-desc {
  font-size: 12px;
  color: var(--font-color-grey);
  opacity: 0.6;
}
</style>
