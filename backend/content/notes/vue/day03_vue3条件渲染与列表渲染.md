---
title: Vue3 条件渲染与列表渲染
category: vue
date: 2025年12月7日
datetime: 2025-12-07T00:00:00.000Z
wordCount: 约 1160 字
readTime: 预计 6 分钟
excerpt: 深入掌握Vue3的条件渲染（v-if/v-show）和列表渲染（v-for）指令，以及自定义指令的创建与使用，高效实现页面的动态展示与数据遍历。
tags: [Vue3]
cover: "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Vue.js%20conditional%20and%20list%20rendering%20visualization%20with%20v-if%20v-for%20code%20examples%20minimalist%20design&image_size=landscape_4_3"
---

# Vue3 条件渲染与列表渲染

## 1. 条件渲染

### 1.1 v-if / v-else-if / v-else

根据条件决定元素是否渲染到 DOM：

```vue
<template>
  <div v-if="type === 'A'">A 类型</div>
  <div v-else-if="type === 'B'">B 类型</div>
  <div v-else>其他类型</div>
</template>
```

`v-if` 是**真正的条件渲染**，条件为假时元素不会被渲染到 DOM 中。

### 1.2 v-show

`v-show` 通过 CSS `display` 控制显示/隐藏：

```vue
<template>
  <div v-show="isVisible">通过 display 控制</div>
</template>
```

**v-if vs v-show**：

| 特性 | v-if | v-show |
|------|------|--------|
| 渲染方式 | 条件为假时不渲染 DOM | 始终渲染，通过 display 控制 |
| 切换开销 | 高（销毁/重建） | 低（仅切换 display） |
| 适用场景 | 运行时条件变化少 | 频繁切换显示状态 |

### 1.3 template 上的条件渲染

```vue
<template>
  <template v-if="isReady">
    <h2>标题</h2>
    <p>段落内容</p>
  </template>
</template>
```

`<template>` 作为不可见的包装元素，不会渲染到 DOM。

## 2. 列表渲染

### 2.1 v-for 基础用法

```vue
<template>
  <!-- 遍历数组 -->
  <li v-for="(item, index) in items" :key="item.id">
    {{ index }} - {{ item.name }}
  </li>

  <!-- 遍历对象 -->
  <div v-for="(value, key, index) in obj" :key="key">
    {{ key }}: {{ value }}
  </div>

  <!-- 遍历数字范围 -->
  <span v-for="n in 10" :key="n">{{ n }}</span>
</template>
```

### 2.2 key 的重要性

`key` 是 Vue 追踪节点的标识，用于高效更新 DOM。应使用唯一且稳定的值（如 `item.id`），避免使用索引作为 key。

### 2.3 数组变更检测

Vue 能够检测以下数组变更方法并触发更新：

- **变更方法**：`push()`、`pop()`、`shift()`、`unshift()`、`splice()`、`sort()`、`reverse()`
- **非变更方法**：`filter()`、`concat()`、`slice()` 返回新数组，需重新赋值

## 3. 自定义指令

除了内置指令，Vue3 允许注册自定义指令：

```javascript
// 全局注册
app.directive('focus', {
  mounted(el) {
    el.focus()
  }
})

// 组件内注册
const vFocus = {
  mounted: (el) => el.focus()
}
```

使用：`<input v-focus />`。

常用钩子：`created`、`mounted`、`updated`、`unmounted`，每个钩子接收 `el`、`binding`、`vnode` 等参数。

**总结**：条件渲染选择 `v-if`（低频率切换）或 `v-show`（高频率切换），列表渲染时务必绑定 `key` 以优化性能，自定义指令则提供了对 DOM 的直接控制能力。
