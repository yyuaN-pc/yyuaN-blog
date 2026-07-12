---
title: Vue3 Class 与 Style 绑定详解
category: vue
date: 2025年12月13日
datetime: 2025-12-13T00:00:00.000Z
wordCount: 约 780 字
readTime: 预计 4 分钟
excerpt: 掌握Vue3中动态绑定HTML Class和内联样式（Style）的多种语法，包括对象语法、数组语法及组件上的样式绑定。
tags: [Vue3]
cover: "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Vue.js%20CSS%20class%20and%20style%20binding%20visualization%20with%20colorful%20style%20tokens%20minimalist&image_size=landscape_4_3"
---

# Vue3 Class 与 Style 绑定详解

## 1. 绑定 HTML Class

### 1.1 对象语法

动态切换 class 的最佳方式：

```vue
<template>
  <div :class="{ active: isActive, 'text-danger': hasError }"></div>
</template>
<script setup>
import { ref } from 'vue'
const isActive = ref(true)
const hasError = ref(false)
</script>
```

结合计算属性处理复杂逻辑：

```vue
<script setup>
const classObj = computed(() => ({
  active: isActive.value && !hasError.value,
  'text-danger': hasError.value && isActive.value
}))
</script>
```

### 1.2 数组语法

应用多个 class 列表：

```vue
<template>
  <div :class="[activeClass, errorClass]"></div>
</template>
<script setup>
const activeClass = ref('active')
const errorClass = ref('text-danger')
</script>
```

数组内也可嵌套对象：`[isActive ? 'active' : '', { 'text-danger': hasError }]`

### 1.3 组件上的 class 绑定

当 class 应用于组件时，会自动添加到根元素上：

```vue
<template>
  <MyComponent class="custom-class" />
</template>
```

## 2. 绑定内联 Style

### 2.1 对象语法

```vue
<template>
  <div :style="{ color: activeColor, fontSize: fontSize + 'px' }"></div>
</template>
<script setup>
const activeColor = ref('red')
const fontSize = ref(16)
</script>
```

CSS 属性名支持驼峰（recommended）或短横线分隔（需加引号）。

### 2.2 数组语法

```vue
<template>
  <div :style="[baseStyles, overrideStyles]"></div>
</template>
```

### 2.3 自动前缀与多重值

Vue 会自动为需要浏览器前缀的 CSS 属性添加前缀。多重值以数组形式提供：

```vue
<template>
  <div :style="{ display: ['-webkit-box', '-ms-flexbox', 'flex'] }"></div>
</template>
```

浏览器会选择数组中最后一个支持的值。

**总结**：Class 绑定推荐使用对象语法配合计算属性处理复杂逻辑，Style 绑定适合动态控制内联样式。两者均支持数组语法实现多组样式的组合。
