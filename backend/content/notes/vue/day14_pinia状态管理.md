---
title: Pinia 状态管理
category: vue
date: 2026年1月9日
datetime: 2026-01-09T00:00:00.000Z
wordCount: 约 990 字
readTime: 预计 5 分钟
excerpt: 学习Pinia——Vue3推荐的新一代状态管理方案，掌握defineStore、Setup Store语法、Actions和插件系统，替代传统的Vuex方案。
tags: [Vue3, Pinia]
cover: "./covers/vue.png"
---

# Pinia 状态管理

## 1. Pinia 简介

Pinia 是 Vue3 官方推荐的状态管理库，相比 Vuex 更加简洁且完整支持 TypeScript。

**Pinia vs Vuex**：

| 特性 | Pinia | Vuex |
|------|-------|------|
| TypeScript | 原生支持 | 需额外类型定义 |
| 语法 | 极简（去掉了 mutations） | 繁琐（state/mutations/actions） |
| DevTools | 支持 | 支持 |
| 模块化 | 自动命名空间 | 需手动 namespaced |
| 体积 | ~1KB | ~9KB |

## 2. 定义 Store

### 2.1 基本定义

```javascript
// stores/counter.js
import { defineStore } from 'pinia'

export const useCounterStore = defineStore('counter', {
  state: () => ({ count: 0, name: '计数器' }),
  getters: {
    double: (state) => state.count * 2
  },
  actions: {
    increment() { this.count++ }
  }
})
```

### 2.2 Setup Store 语法（推荐）

类似 Composition API 的写法，更灵活：

```javascript
export const useCounterStore = defineStore('counter', () => {
  const count = ref(0)
  const name = ref('计数器')

  const double = computed(() => count.value * 2)
  const increment = () => count.value++

  return { count, name, double, increment }
})
```

## 3. 在组件中使用

```vue
<script setup>
import { useCounterStore } from '@/stores/counter'
import { storeToRefs } from 'pinia'

const store = useCounterStore()
// 保持响应式的解构
const { count, double } = storeToRefs(store)
const { increment } = store
</script>
<template>
  <p>{{ count }} x 2 = {{ double }}</p>
  <button @click="increment">+1</button>
</template>
```

## 4. 插件与持久化

通过 Pinia 插件实现状态持久化：

```javascript
// 简单持久化插件
function persistPlugin({ store }) {
  const saved = localStorage.getItem(store.$id)
  if (saved) store.$patch(JSON.parse(saved))

  store.$subscribe(() => {
    localStorage.setItem(store.$id, JSON.stringify(store.$state))
  })
}

const pinia = createPinia()
pinia.use(persistPlugin)
```

## 5. 组件外使用 Store

在路由守卫、API 拦截器等非组件环境中直接调用：

```javascript
import { useAuthStore } from '@/stores/auth'

router.beforeEach((to) => {
  const auth = useAuthStore()
  if (to.meta.requiresAuth && !auth.isLoggedIn) return '/login'
})
```

**总结**：Pinia 以极简 API、完整 TypeScript 支持和 Composition API 风格成为 Vue3 状态管理的最佳选择。Setup Store 语法将状态管理代码组织为 hook 形式，逻辑内聚且可复用。
