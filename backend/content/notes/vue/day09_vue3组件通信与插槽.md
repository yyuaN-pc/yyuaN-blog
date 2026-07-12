---
title: Vue3 组件通信与插槽
category: vue
date: 2025年12月25日
datetime: 2025-12-25T00:00:00.000Z
wordCount: 约 1100 字
readTime: 预计 6 分钟
excerpt: 掌握Vue3组件间的通信方式，重点学习自定义事件（$emit）和插槽（Slot）机制，包括命名插槽、作用域插槽和解构插槽Prop的高级用法。
tags: [Vue3]
cover: "./covers/vue.png"
---

# Vue3 组件通信与插槽

## 1. 自定义事件 $emit

子组件通过 `$emit` 向父组件发送消息：

```vue
<!-- 子组件 -->
<script setup>
const emit = defineEmits(['submit', 'cancel'])

const handleSubmit = () => {
  emit('submit', { username: 'user', age: 18 })
}
</script>
<template>
  <button @click="handleSubmit">提交</button>
</template>

<!-- 父组件 -->
<ChildForm @submit="onSubmit" @cancel="onCancel" />
```

**事件验证**：

```javascript
const emit = defineEmits({
  submit(payload) {
    return payload.username && payload.age > 0
  },
  cancel: null  // 不验证
})
```

## 2. 插槽 Slot

插槽让父组件向子组件传递模板内容，实现更灵活的组件组合。

### 2.1 默认插槽

```vue
<!-- 子组件 -->
<template>
  <div class="card">
    <slot />
  </div>
</template>

<!-- 父组件 -->
<Card>
  <p>插槽内容将出现在 slot 位置</p>
</Card>
```

### 2.2 命名插槽

```vue
<!-- 子组件 -->
<template>
  <div class="layout">
    <header><slot name="header" /></header>
    <main><slot /></main>
    <footer><slot name="footer" /></footer>
  </div>
</template>

<!-- 父组件 -->
<Layout>
  <template #header>顶部导航</template>
  <p>主要内容</p>
  <template #footer>底部信息</template>
</Layout>
```

`v-slot:` 可简写为 `#`。

### 2.3 作用域插槽

子组件向插槽传递数据：

```vue
<!-- 子组件 -->
<template>
  <slot :item="item" :index="index" />
</template>

<!-- 父组件 -->
<ListItem v-for="(item, index) in items" :key="item.id">
  <template #default="{ item, index }">
    <span>{{ index + 1 }}. {{ item.name }}</span>
  </template>
</ListItem>
```

### 2.4 解构插槽 Prop

作用域插槽支持解构语法：

```vue
<template #default="{ item: { name, price }, index }">
  {{ index }} - {{ name }}: ¥{{ price }}
</template>
```

**总结**：`$emit` 实现子→父通信，插槽实现父→子传递模板内容。命名插槽适用于复杂布局组件，作用域插槽让子组件数据可在父组件模板中使用，两者组合可构建高度灵活的组件体系。
