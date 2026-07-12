---
title: Element Plus 基础组件与反馈类组件
category: vue
date: 2026年1月15日
datetime: 2026-01-15T00:00:00.000Z
wordCount: 约 780 字
readTime: 预计 4 分钟
excerpt: 快速上手Element Plus的按钮、链接、滚动条等基础组件，以及消息提示、通知、警告等反馈类组件，构建页面交互的基础元素。
tags: [Vue3, Element Plus]
cover: "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Element%20Plus%20UI%20components%20buttons%20alerts%20notifications%20modern%20web%20interface%20design&image_size=landscape_4_3"
---

# Element Plus 基础组件与反馈类组件

## 1. 基础组件

### 1.1 Button 按钮

```vue
<template>
  <el-button type="primary">主要按钮</el-button>
  <el-button type="success">成功</el-button>
  <el-button type="warning">警告</el-button>
  <el-button type="danger">危险</el-button>
  <el-button type="info">信息</el-button>

  <!-- 按钮变体 -->
  <el-button plain>朴素按钮</el-button>
  <el-button round>圆角按钮</el-button>
  <el-button circle icon="Edit" />

  <!-- 加载状态 -->
  <el-button :loading="isLoading">加载中</el-button>
</template>
```

### 1.2 Link 文字链接

```vue
<template>
  <el-link type="primary" :underline="false">链接</el-link>
  <el-link href="https://example.com" target="_blank">外链</el-link>
</template>
```

### 1.3 Space 间距与 Scrollbar 滚动条

- **Space**：自动管理子元素间距，避免 margin 污染
- **Scrollbar**：自定义滚动条样式，支持 `max-height`、`wrap-style`、`always` 等属性

## 2. 反馈类组件

### 2.1 Alert 警告

```vue
<template>
  <el-alert title="操作成功" type="success" show-icon closable />
  <el-alert title="警告提示" type="warning" description="详细描述文字" />
</template>
```

### 2.2 Notification 通知

```vue
<script setup>
import { ElNotification } from 'element-plus'

const notify = () => {
  ElNotification({
    title: '系统通知',
    message: '你有新的消息',
    type: 'success',
    duration: 3000,
    position: 'top-right'
  })
}
</script>
```

### 2.3 Message 消息提示

```vue
<template>
  <el-button @click="showMsg">消息提示</el-button>
</template>
<script setup>
import { ElMessage } from 'element-plus'

const showMsg = () => {
  ElMessage({ message: '保存成功', type: 'success' })
}
</script>
```

**对比**：Message 轻量自动消失，适合操作反馈；Notification 信息量更大，适合系统通知。

**总结**：Button 和 Link 是页面最基础的交互元素，配合丰富的 type 和变体可满足多种场景。Alert、Message、Notification 构成了完整的用户反馈体系，覆盖从轻量提示到系统通知的各个层级。
