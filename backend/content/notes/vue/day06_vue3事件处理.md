---
title: Vue3 事件处理全面指南
category: vue
date: 2025年12月16日
datetime: 2025-12-16T00:00:00.000Z
wordCount: 约 920 字
readTime: 预计 5 分钟
excerpt: 掌握Vue3事件处理机制，包括事件监听、事件修饰符、按键修饰符、系统修饰键及组件上的事件处理，实现高效的交互逻辑。
tags: [Vue3]
cover: "./covers/vue.png"
---

# Vue3 事件处理全面指南

## 1. 监听事件

使用 `v-on` 指令（简写 `@`）监听 DOM 事件：

```vue
<template>
  <!-- 内联处理器 -->
  <button @click="count++">+1</button>

  <!-- 方法处理器 -->
  <button @click="handleSubmit">提交</button>

  <!-- 带参数 -->
  <button @click="say('hello', $event)">问候</button>
</template>
<script setup>
const handleSubmit = () => { /* ... */ }
const say = (msg, event) => {
  console.log(msg, event.target)
}
</script>
```

## 2. 事件修饰符

修饰符串联使用，按顺序应用：

| 修饰符 | 作用 |
|--------|------|
| `.stop` | 调用 `event.stopPropagation()` |
| `.prevent` | 调用 `event.preventDefault()` |
| `.capture` | 在捕获阶段触发 |
| `.self` | 仅当 `event.target === 当前元素` 时触发 |
| `.once` | 只触发一次 |
| `.passive` | 不调用 `preventDefault()`，提升滚动性能 |

```vue
<template>
  <!-- 阻止冒泡 + 阻止默认行为 -->
  <a @click.stop.prevent="handleClick">链接</a>

  <!-- 仅当点击自身时触发 -->
  <div @click.self="handleClick">点击内部区域无效</div>

  <!-- 只触发一次 -->
  <button @click.once="submit">仅提交一次</button>
</template>
```

## 3. 按键修饰符

监听键盘事件时指定按键：

```vue
<template>
  <!-- 按下 Enter 时提交 -->
  <input @keyup.enter="submit" />

  <!-- 按下 Esc 时取消 -->
  <input @keyup.esc="cancel" />

  <!-- 按键别名：.enter、.tab、.delete、.esc、.space、.up、.down、.left、.right -->
</template>
```

## 4. 系统修饰键

```vue
<template>
  <!-- Ctrl + 点击 -->
  <div @click.ctrl="handleClick">Ctrl+点击</div>

  <!-- Alt + Enter -->
  <textarea @keyup.alt.enter="submit"></textarea>

  <!-- 精确控制，仅当按下 Ctrl 且无其他修饰键时触发 -->
  <button @click.ctrl.exact="onClickCtrl">Ctrl 精确点击</button>
</template>
```

系统修饰键包括：`.ctrl`、`.alt`、`.shift`、`.meta`。配合 `.exact` 可实现精确组合控制。

**总结**：Vue3 的事件处理语法简洁且功能强大——`@event` 语法糖配合丰富的事件修饰符，使开发者能专注于业务逻辑而非 DOM 事件细节。合理使用 `.stop`、`.prevent`、`.self` 等修饰符可以避免大量模板代码。
