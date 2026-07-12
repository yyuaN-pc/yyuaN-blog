---
title: Vue3 双向绑定 v-model 详解
category: vue
date: 2025年12月19日
datetime: 2025-12-19T00:00:00.000Z
wordCount: 约 1060 字
readTime: 预计 5 分钟
excerpt: 深入掌握Vue3中v-model指令的实现原理与用法，包括表单元素绑定、修饰符以及组件上的自定义v-model，实现高效的数据双向绑定。
tags: [Vue3]
cover: "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Vue.js%20v-model%20two-way%20binding%20concept%20diagram%20with%20form%20elements%20and%20data%20flow%20arrows&image_size=landscape_4_3"
---

# Vue3 双向绑定 v-model 详解

## 1. v-model 基础

`v-model` 在表单元素上创建双向数据绑定，实质是 `value` 属性绑定和 `input` 事件监听的语法糖：

```vue
<template>
  <!-- 文本输入框 -->
  <input v-model="username" />

  <!-- 等价于 -->
  <input :value="username" @input="username = $event.target.value" />

  <!-- 多行文本 -->
  <textarea v-model="description"></textarea>

  <!-- 复选框（绑定布尔值） -->
  <input type="checkbox" v-model="agreed" />
</template>
```

## 2. 不同表单类型的绑定

### 2.1 复选框

```vue
<template>
  <!-- 单个复选框绑定布尔值 -->
  <input type="checkbox" v-model="agreed" />

  <!-- 多个复选框绑定数组 -->
  <input type="checkbox" v-model="hobbies" value="读书" />
  <input type="checkbox" v-model="hobbies" value="运动" />
  <input type="checkbox" v-model="hobbies" value="编程" />
</template>
```

### 2.2 单选框与选择框

```vue
<template>
  <!-- 单选框 -->
  <input type="radio" v-model="gender" value="男" />
  <input type="radio" v-model="gender" value="女" />

  <!-- 选择框 -->
  <select v-model="selectedCity">
    <option disabled value="">请选择城市</option>
    <option value="北京">北京</option>
    <option value="上海">上海</option>
  </select>

  <!-- 多选选择框 -->
  <select v-model="selectedTags" multiple>
    <option value="vue">Vue</option>
    <option value="react">React</option>
  </select>
</template>
```

## 3. v-model 修饰符

| 修饰符 | 作用 | 示例 |
|--------|------|------|
| `.lazy` | change 事件后同步（失去焦点） | `v-model.lazy="name"` |
| `.number` | 自动转为数字类型 | `v-model.number="age"` |
| `.trim` | 去除首尾空格 | `v-model.trim="title"` |

## 4. 组件上的 v-model

Vue3 中组件支持自定义 `v-model`，默认通过 `modelValue` prop 和 `update:modelValue` 事件实现：

```vue
<!-- 父组件 -->
<CustomInput v-model="searchText" />

<!-- 子组件 -->
<script setup>
const props = defineProps(['modelValue'])
const emit = defineEmits(['update:modelValue'])
</script>
<template>
  <input :value="modelValue" @input="emit('update:modelValue', $event.target.value)" />
</template>
```

支持多个 v-model 绑定（如 `v-model:title`、`v-model:content`），也可添加自定义修饰符。

**总结**：v-model 简化了表单数据的双向绑定流程，各类表单元素（文本、复选框、单选框、选择框）都能直接使用。组件上的 v-model 提供了自定义双向绑定的能力，是实现组件通信的常用手段。
