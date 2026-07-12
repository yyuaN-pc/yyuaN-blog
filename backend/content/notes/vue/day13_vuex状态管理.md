---
title: Vuex 状态管理
category: vue
date: 2026年1月6日
datetime: 2026-01-06T00:00:00.000Z
wordCount: 约 980 字
readTime: 预计 5 分钟
excerpt: 学习Vuex 4的核心概念，包括state、getters、mutations、actions和模块化开发，掌握Vue3中集中式状态管理的完整方案。
tags: [Vue3, Vuex]
cover: "./covers/vue.png"
---

# Vuex 状态管理

## 1. Vuex 核心概念

Vuex 是一个**集中式状态管理**方案，适用于中大型应用的共享状态管理。

```
State（数据源） → Getters（派生状态）
     ↓
Actions（异步操作） → Mutations（同步修改） → State → 视图更新
```

### 1.1 State

单一状态树，全局唯一数据源：

```javascript
const store = createStore({
  state: { count: 0, user: null }
})
```

访问：`store.state.count`，组件中使用 `$store.state.count`。

### 1.2 Getters

类似计算属性，从 state 派生出新状态：

```javascript
getters: {
  doubleCount: (state) => state.count * 2,
  getUserInfo: (state) => {
    return state.user ? `${state.user.name}(${state.user.role})` : '未登录'
  }
}
```

## 2. Mutations 与 Actions

### 2.1 Mutations（同步修改）

```javascript
mutations: {
  increment(state, payload) {
    state.count += payload.amount
  }
}
// 提交
store.commit('increment', { amount: 10 })
```

**Mutation 必须是同步函数**，只能通过 commit 调用。

### 2.2 Actions（异步操作）

```javascript
actions: {
  async fetchUser({ commit }, id) {
    const user = await api.getUser(id)
    commit('setUser', user)
  }
}
// 分发
store.dispatch('fetchUser', 123)
```

## 3. 模块化开发

```javascript
const userModule = {
  namespaced: true,
  state: () => ({ name: '', roles: [] }),
  mutations: { /* ... */ },
  actions: { /* ... */ }
}

const store = createStore({
  modules: {
    user: userModule,
    cart: cartModule
  }
})
// 访问：store.state.user.name
// 提交：store.commit('user/setName', '张三')
```

**namespaced: true** 为模块启用命名空间，避免不同模块的命名冲突。

## 4. 组合式 API 中使用 Vuex

```vue
<script setup>
import { useStore } from 'vuex'
import { computed } from 'vue'

const store = useStore()
const count = computed(() => store.state.count)
const increment = () => store.commit('increment')
</script>
```

**总结**：Vuex 通过单向数据流和严格的同步 Mutation 约束，确保了状态变更的可预测性和可追踪性。模块化开发解决了大型应用的状态组织问题。不过 Pinia 已在 Vue3 生态中逐步取代 Vuex。
