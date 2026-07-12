---
title: Vue3 组件基础与 Props
category: vue
date: 2025年12月22日
datetime: 2025-12-22T00:00:00.000Z
wordCount: 约 1120 字
readTime: 预计 6 分钟
excerpt: 学习Vue3组件的注册方式、Props的类型验证与单向数据流机制，以及组件的属性继承控制，掌握组件化的基础实践。
tags: [Vue3]
cover: "./covers/vue.png"
---

# Vue3 组件基础与 Props

## 1. 组件注册

### 1.1 全局注册

全局注册的组件可在所有子组件中使用，无需重复导入：

```javascript
import { createApp } from 'vue'
import App from './App.vue'
import MyComponent from './components/MyComponent.vue'

const app = createApp(App)
app.component('MyComponent', MyComponent)
```

### 1.2 局部注册

在 `<script setup>` 中导入的组件自动局部可用：

```vue
<script setup>
import MyComponent from './components/MyComponent.vue'
</script>
<template>
  <MyComponent />
</template>
```

## 2. Props 详解

Props 是父组件向子组件传递数据的机制。

### 2.1 Props 声明

```vue
<script setup>
// 字符串数组声明
const props = defineProps(['title', 'count', 'user'])

// 对象声明（带类型验证）
const props = defineProps({
  title: String,
  count: { type: Number, required: true, default: 0 },
  user: { type: Object, default: () => ({ name: '默认' }) },
  status: { type: String, validator: (v) => ['active','inactive'].includes(v) }
})
</script>
```

### 2.2 Props 验证选项

| 选项 | 类型 | 说明 |
|------|------|------|
| `type` | 构造函数 | String、Number、Boolean、Array、Object、Function、Symbol |
| `required` | Boolean | 是否必传 |
| `default` | 任意或函数 | 默认值（对象/数组必须用工厂函数） |
| `validator` | Function | 自定义验证函数 |

### 2.3 单向数据流

**Props 遵循单向数据流**：父组件更新→子组件自动更新。子组件不应直接修改 props，如需修改应使用：

```vue
<script setup>
// 方式1：用 props 初始化本地数据
const localCount = ref(props.count)

// 方式2：通过计算属性派生
const displayName = computed(() => props.title.toUpperCase())

// 方式3：通过事件通知父组件
const emit = defineEmits(['update:count'])
const increment = () => emit('update:count', props.count + 1)
</script>
```

## 3. 属性继承

组件根元素会自动继承未被 props 声明的属性：

```vue
<!-- 父组件 -->
<MyButton class="large" data-testid="btn1" />

<!-- 子组件渲染结果：<button class="large" data-testid="btn1">按钮</button> -->
```

使用 `inheritAttrs: false` 可禁用自动继承，通过 `$attrs` 手动控制绑定位置：

```vue
<script setup>
defineOptions({ inheritAttrs: false })
</script>
<template>
  <div class="wrapper">
    <button v-bind="$attrs">按钮</button>
  </div>
</template>
```

**总结**：组件化是 Vue 的核心思想，Props 作为组件间数据传递的主要渠道，配合类型验证和单向数据流机制，保证了组件的健壮性和可维护性。属性继承机制则让组件封装更加灵活。
