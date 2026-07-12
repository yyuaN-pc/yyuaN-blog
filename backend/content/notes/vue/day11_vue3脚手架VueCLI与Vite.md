---
title: Vue3 脚手架：Vue CLI 与 Vite
category: vue
date: 2025年12月31日
datetime: 2025-12-31T00:00:00.000Z
wordCount: 约 1080 字
readTime: 预计 5 分钟
excerpt: 对比Vue CLI（Webpack）和Vite两种构建工具的差异，掌握Vite的配置优化、跨域代理和性能调优策略，搭建高效的Vue3开发环境。
tags: [Vue3, Vite]
cover: "./covers/vue.png"
---

# Vue3 脚手架：Vue CLI 与 Vite

## 1. Vue CLI vs Vite

| 对比项 | Vue CLI | Vite |
|--------|---------|------|
| 构建引擎 | Webpack | Rollup（生产）/ 原生 ESM（开发） |
| 开发服务器 | 打包后启动（慢） | 按需编译（极快） |
| HMR 速度 | 全量更新 | 毫秒级按需更新 |
| 配置复杂度 | 复杂（Webpack 生态） | 简洁（原生 ESM） |
| Vue3 推荐 | 不推荐 | **官方推荐** |

Vue CLI 基于 Webpack，每次启动需打包整个项目；Vite 利用浏览器原生 ES Module 支持，开发服务器秒级启动，HMR 仅更新变更模块。

## 2. Vite 项目配置

### 2.1 基础配置

```javascript
// vite.config.js
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  },
  server: {
    port: 3000,
    open: true
  }
})
```

### 2.2 跨域代理

开发时解决前后端分离的跨域问题：

```javascript
export default defineConfig({
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  }
})
```

### 2.3 生产构建优化

```javascript
export default defineConfig({
  build: {
    chunkSizeWarningLimit: 500,
    rollupOptions: {
      output: {
        manualChunks: {
          vue: ['vue', 'vue-router'],
          ui: ['element-plus']
        }
      }
    }
  },
  // CSS 预处理器配置
  css: {
    preprocessorOptions: {
      scss: { additionalData: `@import "@/styles/variables.scss";` }
    }
  }
})
```

## 3. 性能优化策略

- **代码分割**：通过 `defineAsyncComponent` 或动态 `import()` 实现按需加载
- **Tree Shaking**：移除未使用的代码，确保使用 ES Module 导入
- **图片内联**：小于 4KB 的图片自动转为 Base64
- **CDN 引入**：将 Vue、Element Plus 等库通过 CDN 加载，减小打包体积
- **PWA**：通过 `vite-plugin-pwa` 插件支持离线缓存和渐进式 Web 应用

**总结**：Vite 凭借原生 ESM 和 Rollup 成为 Vue3 官方推荐的构建工具，配置简洁且开发体验极佳。配合合理的打包优化和 CDN 策略，可构建高性能生产应用。
