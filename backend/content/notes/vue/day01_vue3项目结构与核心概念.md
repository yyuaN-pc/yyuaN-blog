---
title: Vue3 项目结构与核心概念
category: vue
date: 2025年12月1日
datetime: 2025-12-01T00:00:00.000Z
wordCount: 约 680 字
readTime: 预计 3 分钟
excerpt: 了解Vue3项目的基本结构、渐进式框架的设计理念以及组件化开发的核心理念，为后续深入学习Vue3打下基础。
tags: [Vue3]
cover: "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Modern%20Vue.js%20project%20structure%20diagram%20with%20folder%20tree%20and%20component%20architecture%20visualization%20minimalist%20style&image_size=landscape_4_3"
---

# Vue3 项目结构与核心概念

## 1. Vue3 简介

Vue 3 是一个用于构建用户界面的**渐进式框架**。与 Vue 2 相比，Vue 3 在性能、TypeScript 支持、代码组织等方面有显著提升。其核心特性包括 Composition API、Teleport、Fragment、Emits 组件通信等。

### 1.1 渐进式框架

Vue 的设计理念是**渐进式**——根据项目需求逐步引入功能模块，而非要求全量使用。你可以仅用 Vue 的核心库（视图层）完成简单的页面交互，也可以逐步引入 Vue Router（路由）、Pinia/Vuex（状态管理）、Vite（构建工具）等，构建完整的大型单页应用。这种设计降低了学习曲线，也赋予项目极高的灵活性。

## 2. 项目结构

一个典型的 Vite + Vue3 项目结构如下：

```
project/
├── index.html            # 页面入口
├── vite.config.js        # Vite 配置文件
├── package.json
├── public/               # 静态资源目录
├── src/
│   ├── main.js           # 应用入口
│   ├── App.vue           # 根组件
│   ├── components/       # 公共组件
│   ├── views/            # 页面组件
│   ├── router/           # 路由配置
│   ├── store/            # 状态管理
│   └── assets/           # 资源文件
└── node_modules/
```

## 3. 组件化开发

Vue 的核心是**组件系统**。一个组件包含三部分：

```vue
<template>
  <div class="greeting">
    <h1>{{ message }}</h1>
  </div>
</template>

<script setup>
import { ref } from 'vue'
const message = ref('欢迎学习 Vue3!')
</script>

<style scoped>
.greeting h1 { color: #42b983; }
</style>
```

**组件化开发的优势**：
- 将页面拆分为独立、可复用的组件
- 每个组件包含自己的模板、逻辑和样式
- 通过 Props 和 Events 实现组件间通信

## 4. 快速开始

```bash
# 创建 Vite + Vue3 项目
npm create vite@latest my-app -- --template vue

# 进入项目并安装依赖
cd my-app
npm install

# 启动开发服务器
npm run dev
```
