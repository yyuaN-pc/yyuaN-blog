---
title: Element Plus 布局与过渡动画
category: vue
date: 2026年1月12日
datetime: 2026-01-12T00:00:00.000Z
wordCount: 约 740 字
readTime: 预计 4 分钟
excerpt: 掌握Element Plus的布局容器、24分栏栅格系统以及内置的过渡动画类，快速构建页面框架。
tags: [Vue3, Element Plus]
cover: "./covers/vue.png"
---

# Element Plus 布局与过渡动画

## 1. 安装与引入

```bash
npm install element-plus
```

**完整引入**：

```javascript
import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

const app = createApp(App)
app.use(ElementPlus)
```

**按需引入（推荐）**：使用 `unplugin-vue-components` 和 `unplugin-auto-import` 自动按需加载组件和样式。

## 2. 布局容器

Element Plus 提供一套布局容器组件：

```vue
<template>
  <el-container>
    <el-header>顶部导航</el-header>
    <el-container>
      <el-aside width="200px">侧边栏</el-aside>
      <el-main>主内容区</el-main>
    </el-container>
    <el-footer>底部信息</el-footer>
  </el-container>
</template>
```

常见组合：`Header + Main + Footer`（基础）、`Header + Aside + Main`（后台管理）。

## 3. 栅格系统

基于 24 分栏的响应式栅格，通过 `el-row` 和 `el-col` 实现：

```vue
<template>
  <el-row :gutter="20">
    <el-col :span="8"><div class="grid-content">1/3</div></el-col>
    <el-col :span="8"><div class="grid-content">1/3</div></el-col>
    <el-col :span="8"><div class="grid-content">1/3</div></el-col>
  </el-row>

  <!-- 响应式布局 -->
  <el-row :gutter="10">
    <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="4">
      响应式列
    </el-col>
  </el-row>
</template>
```

断点：`xs(<768px)` / `sm(≥768)` / `md(≥992)` / `lg(≥1200)` / `xl(≥1920)`。

## 4. 过渡动画

Element Plus 提供内置过渡类名：

```vue
<template>
  <!-- 淡入淡出 -->
  <el-fade-in>
    <div v-show="visible">淡入淡出内容</div>
  </el-fade-in>

  <!-- 缩放 -->
  <el-zoom-in-center>
    <div v-show="visible">居中缩放</div>
  </el-zoom-in-center>

  <!-- 折叠展开 -->
  <el-collapse-transition>
    <div v-show="visible">折叠展开</div>
  </el-collapse-transition>
</template>
```

**总结**：布局容器提供标准的页面骨架，栅格系统支持灵活的响应式布局，内置过渡动画可轻松实现视觉动效。三者结合可快速搭建结构清晰、交互友好的页面框架。
