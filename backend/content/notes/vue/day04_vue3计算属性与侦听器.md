---
title: Vue3 计算属性与侦听器
category: vue
date: 2025年12月10日
datetime: 2025-12-10T00:00:00.000Z
wordCount: 约 950 字
readTime: 预计 5 分钟
excerpt: 学习Vue3中计算属性（computed）和侦听器（watch/watchEffect）的用法与区别，掌握响应式数据派生的最佳实践。
tags: [Vue3]
cover: "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Vue.js%20computed%20properties%20and%20watchers%20concept%20diagram%20with%20data%20flow%20arrows%20minimalist%20style&image_size=landscape_4_3"
---

# Vue3 计算属性与侦听器

## 1. 计算属性 computed

计算属性基于依赖的响应式数据进行计算，当依赖变化时自动重新求值：

```vue
<script setup>
import { ref, computed } from 'vue'

const firstName = ref('张')
const lastName = ref('三')

const fullName = computed(() => {
  return firstName.value + ' ' + lastName.value
})
</script>

<template>
  <p>{{ fullName }}</p>
</template>
```

**computed vs methods**：计算属性会缓存结果，只有依赖变化时才重新计算；方法每次调用都会执行。在性能敏感的场合优先使用 computed。

**可写计算属性**：

```vue
<script setup>
const count = ref(0)
const double = computed({
  get: () => count.value * 2,
  set: (val) => { count.value = val / 2 }
})
</script>
```

## 2. 侦听器 watch

`watch` 侦听一个或多个响应式数据源的变化，执行副作用操作：

```vue
<script setup>
import { ref, watch } from 'vue'

const question = ref('')
const answer = ref('')

// 侦听单个源
watch(question, async (newVal, oldVal) => {
  if (newVal.includes('?')) {
    answer.value = '思考中...'
    // 发起异步请求
  }
})

// 侦听多个源
watch([count, name], ([newCount, newName], [oldCount, oldName]) => {
  console.log('count 或 name 变化了')
})

// 深度侦听对象
watch(obj, handler, { deep: true })
</script>
```

**配置选项**：
- `deep: true`：深度侦听嵌套对象
- `immediate: true`：创建时立即执行一次
- `flush: 'post'`：DOM 更新后执行回调

## 3. 侦听器 watchEffect

`watchEffect` 自动追踪其回调内使用的所有响应式依赖，无需显式指定侦听源：

```vue
<script setup>
import { ref, watchEffect } from 'vue'

const count = ref(0)

watchEffect(() => {
  console.log('count 变化了:', count.value)
  // 自动追踪 count，变化时重新执行
})
</script>
```

**watch vs watchEffect**：

| 对比项 | watch | watchEffect |
|--------|-------|-------------|
| 依赖声明 | 显式指定侦听源 | 自动追踪内部依赖 |
| 旧值访问 | 支持 | 不支持 |
| 初始执行 | 默认不执行 | 立即执行 |
| 适用场景 | 需要旧值、异步操作 | 简单副作用、日志记录 |

**总结**：computed 用于派生同步数据，watch 用于响应数据变化执行异步或开销较大的操作，watchEffect 是更简洁的自动追踪方案。
