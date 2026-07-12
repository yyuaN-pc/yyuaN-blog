---
title: Vue3 模板语法与基本指令
category: vue
date: 2025年12月4日
datetime: 2025-12-04T00:00:00.000Z
wordCount: 约 1050 字
readTime: 预计 5 分钟
excerpt: 全面了解Vue3的模板语法，包括文本插值、HTML渲染、指令系统以及常用内置指令的用法，掌握数据驱动视图的核心机制。
tags: [Vue3]
cover: "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Vue.js%20template%20syntax%20visualization%20with%20double%20curly%20braces%20and%20directives%20code%20snippets%20dark%20theme&image_size=landscape_4_3"
---

# Vue3 模板语法与基本指令

## 1. 文本插值

使用 **Mustache 语法**（双大括号）将数据绑定到模板：

```vue
<template>
  <p>{{ message }}</p>
  <p>{{ count + 1 }}</p>
  <p>{{ isActive ? '激活' : '未激活' }}</p>
</template>
```

插值内支持任意有效的 JavaScript 表达式，但不支持语句（如 `if`、`for`）。

## 2. 原始 HTML

使用 `v-html` 指令渲染 HTML 字符串（注意 XSS 风险）：

```vue
<template>
  <div v-html="rawHtml"></div>
</template>
<script setup>
const rawHtml = '<strong>加粗文本</strong>'
</script>
```

## 3. 常用内置指令

### 3.1 v-text 与 v-html

- `v-text`：替换元素文本内容，等价于 `{{ }}`
- `v-html`：渲染 HTML 内容

### 3.2 v-bind

动态绑定 HTML 属性：

```vue
<template>
  <img :src="imageUrl" :alt="altText" />
  <a :href="linkUrl" :target="isExternal ? '_blank' : '_self'">链接</a>
  <!-- 绑定布尔属性 -->
  <button :disabled="isDisabled">提交</button>
</template>
```

`v-bind:` 可简写为 `:`。

### 3.3 v-model

实现表单元素的双向数据绑定：

```vue
<template>
  <input v-model="username" placeholder="用户名" />
  <textarea v-model="description"></textarea>
  <input type="checkbox" v-model="agreed" /> 同意条款
</template>
<script setup>
import { ref } from 'vue'
const username = ref('')
const description = ref('')
const agreed = ref(false)
</script>
```

### 3.4 指令缩写

| 指令 | 完整写法 | 缩写 |
|------|---------|------|
| v-bind | `v-bind:src="url"` | `:src="url"` |
| v-on | `v-on:click="handler"` | `@click="handler"` |

## 4. 指令修饰符

```vue
<template>
  <!-- v-model 修饰符 -->
  <input v-model.lazy="name" />    <!-- 懒同步 -->
  <input v-model.number="age" />   <!-- 转数字 -->
  <input v-model.trim="text" />    <!-- 去空格 -->
</template>
```

**总结**：Vue3 的模板语法让开发者能在 HTML 中声明式地绑定数据。插值表达式用于文本输出，指令系统（v-bind、v-model、v-html 等）用于控制 HTML 属性、事件和 DOM 行为，修饰符则提供了更精细的控制能力。掌握这些基础是构建任何 Vue 应用的起点。
