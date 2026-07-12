---
title: Vue Router 路由全面指南
category: vue
date: 2026年1月3日
datetime: 2026-01-03T00:00:00.000Z
wordCount: 约 1420 字
readTime: 预计 7 分钟
excerpt: 深入学习Vue Router 4的核心功能，包括路由模式、动态路由传参、导航守卫、路由懒加载及命名视图等，掌握单页应用的路由管理。
tags: [Vue3]
cover: "./covers/vue.png"
---

# Vue Router 路由全面指南

## 1. 路由模式

| 模式 | 实现方式 | URL 示例 | 适用场景 |
|------|---------|----------|----------|
| Hash | URL hash | `/#/home` | 兼容性好，无需服务器配置 |
| History | HTML5 History API | `/home` | 美观，需服务器配置 fallback |

```javascript
import { createRouter, createWebHashHistory, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(),  // HTML5 模式
  routes: [/* ... */]
})
```

## 2. 命名路由与命名视图

### 2.1 命名路由

```javascript
const routes = [
  { path: '/user/:id', name: 'User', component: User }
]
// 导航时使用 name 替代 path
router.push({ name: 'User', params: { id: 123 } })
```

### 2.2 命名视图

同一路由下展示多个视图：

```javascript
const routes = [{
  path: '/',
  components: {
    default: Home,
    sidebar: Sidebar,
    footer: Footer
  }
}]
```

## 3. 动态路由传参

| 方式 | 示例 | 访问 |
|------|------|------|
| `params` | `path: '/user/:id'` | `route.params.id` |
| `query` | `path: /search?q=vue` | `route.query.q` |
| `props` | 解耦模式 | 直接作为组件 props |

**props 解耦**：

```javascript
const routes = [
  // 布尔模式：params 自动转为 props
  { path: '/user/:id', component: User, props: true },
  // 函数模式：自定义映射
  { path: '/search', component: Search, props: (route) => ({ query: route.query.q }) }
]
```

## 4. 编程式导航

```javascript
// 跳转
router.push('/home')
router.push({ name: 'User', params: { id: 1 } })
router.replace('/login')

// 前进/后退
router.go(1)   // 前进 1 步
router.back()  // 后退 1 步
```

## 5. 导航守卫

### 5.1 全局守卫

```javascript
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')
  if (to.meta.requiresAuth && !token) return '/login'
  next()
})
```

### 5.2 路由独享守卫

```javascript
const routes = [{
  path: '/admin',
  component: Admin,
  beforeEnter: (to, from) => {
    if (!isAdmin()) return '/403'
  }
}]
```

### 5.3 组件内守卫

```vue
<script setup>
import { onBeforeRouteLeave } from 'vue-router'

onBeforeRouteLeave((to, from) => {
  if (hasUnsavedChanges) return '确定离开吗？'
})
</script>
```

## 6. 路由元信息与懒加载

**元信息**：在 `meta` 中存储附加数据，用于权限判断、页面标题等。

**路由懒加载**：使用动态 import 实现代码分割：

```javascript
const routes = [{
  path: '/about',
  component: () => import('@/views/About.vue')
}]
```

**总结**：Vue Router 4 提供完整的 SPA 路由解决方案。History 模式需要服务器 fallback 配置，命名路由和 props 解耦简化了传参逻辑，导航守卫体系（全局/路由独享/组件内）覆盖了所有权限控制场景。
