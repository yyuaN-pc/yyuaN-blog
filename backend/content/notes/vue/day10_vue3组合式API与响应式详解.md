---
title: Vue3 Composition API 与响应式详解
category: vue
date: 2025年12月28日
datetime: 2025-12-28T00:00:00.000Z
wordCount: 约 1320 字
readTime: 预计 7 分钟
excerpt: 深入学习Vue3的Composition API（setup、ref、reactive等）以及响应式系统的核心原理，掌握构建复杂逻辑的最佳实践。
tags: [Vue3]
cover: "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Vue.js%20Composition%20API%20and%20reactive%20system%20with%20Proxy%20diagram%20modern%20minimalist%20style&image_size=landscape_4_3"
---

# Vue3 Composition API 与响应式详解

## 1. setup 函数

`<script setup>` 是 Composition API 的语法糖，组件逻辑更简洁：

```vue
<script setup>
import { ref, onMounted } from 'vue'

// 顶层变量和函数直接在模板中使用
const count = ref(0)
const increment = () => count.value++
</script>
<template>
  <button @click="increment">{{ count }}</button>
</template>
```

## 2. 响应式核心 API

### 2.1 ref

`ref` 将基本类型或对象包装为响应式引用，通过 `.value` 访问：

```vue
<script setup>
import { ref } from 'vue'

const count = ref(0)
const user = ref({ name: '张三', age: 25 })

const updateUser = () => {
  user.value.age++  // ref 包裹的对象也是响应式的
}
</script>
```

### 2.2 reactive

`reactive` 直接创建响应式对象，适用于深层嵌套数据：

```vue
<script setup>
import { reactive } from 'vue'

const state = reactive({
  user: { name: '张三', profile: { age: 25 } },
  tags: ['vue', 'react']
})

// 直接修改，无需 .value
state.tags.push('typescript')
state.user.profile.age = 26
</script>
```

### 2.3 ref vs reactive

| 特性 | ref | reactive |
|------|-----|----------|
| 数据类型 | 任意类型 | 仅对象/数组 |
| 访问方式 | `.value` | 直接访问 |
| 解构 | 不影响响应式 | 会丢失响应式 |
| 重新赋值 | 支持 | 不支持（需用 Object.assign） |

### 2.4 readonly

创建只读代理，防止数据被修改：

```vue
<script setup>
const original = reactive({ count: 0 })
const copy = readonly(original)

// copy.count++  // 警告：不可修改
original.count++  // copy 同步更新
</script>
```

## 3. 响应式工具函数

- **toRef** / **toRefs**：将 reactive 对象的属性转为 ref，常用于解构时保持响应式：

```vue
<script setup>
const state = reactive({ x: 0, y: 0 })
const { x, y } = toRefs(state)  // 解构后仍是响应式
</script>
```

- **unref**：`val = isRef(val) ? val.value : val` 的语法糖
- **isRef**：判断是否为 ref 对象
- **shallowRef** / **shallowReactive**：浅层响应式，只追踪顶层属性

## 4. 响应式原理

Vue3 使用 **Proxy** 替代 Vue2 的 `Object.defineProperty`：

```javascript
const proxy = new Proxy(target, {
  get(target, key, receiver) {
    track(target, key)  // 收集依赖
    return Reflect.get(target, key, receiver)
  },
  set(target, key, value, receiver) {
    const result = Reflect.set(target, key, value, receiver)
    trigger(target, key)  // 触发更新
    return result
  }
})
```

**关键改进**：Proxy 可拦截新增/删除属性、数组索引变更等操作，无需 Vue2 的 `$set` / `$delete` 特殊处理。

**总结**：Composition API 通过 `ref` / `reactive` 将数据逻辑按功能组织，而非 Options API 的选项分散。配合 Proxy 驱动的响应式系统，Vue3 提供了更灵活、更高效的响应式编程体验。
