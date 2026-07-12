---
title: Vant 与 Ant Design Vue 组件库
category: vue
date: 2026年1月27日
datetime: 2026-01-27T00:00:00.000Z
wordCount: 约 700 字
readTime: 预计 3 分钟
excerpt: 了解移动端组件库Vant和企业级组件库Ant Design Vue的特性与核心组件，为不同类型项目选择合适UI库。
tags: [Vue3]
cover: "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Vant%20mobile%20and%20Ant%20Design%20Vue%20enterprise%20component%20library%20comparison%20modern%20UI&image_size=landscape_4_3"
---

# Vant 与 Ant Design Vue 组件库

## 1. Vant 移动端组件库

[Vant](https://vant-ui.github.io) 是轻量、可靠的移动端 Vue 组件库，适合电商类移动应用。

```bash
npm install vant
```

按需引入（推荐使用 Vant 官方 `unplugin-vue-components`）：

```javascript
// vite.config.js
import Components from 'unplugin-vue-components/vite'
import { VantResolver } from 'unplugin-vue-components/resolvers'

export default defineConfig({
  plugins: [
    Components({ resolvers: [VantResolver()] })
  ]
})
```

### 1.1 常用组件

```vue
<template>
  <!-- 按钮 -->
  <van-button type="primary" size="large">立即购买</van-button>

  <!-- 表单 -->
  <van-form @submit="onSubmit">
    <van-field v-model="phone" name="phone" label="手机号" placeholder="请输入手机号" />
    <van-field v-model="sms" name="sms" label="验证码" placeholder="请输入验证码" />
    <van-button round block type="primary" native-type="submit">登录</van-button>
  </van-form>

  <!-- 商品卡片 -->
  <van-card
    num="2"
    price="99.00"
    title="商品名称"
    thumb="https://example.com/image.jpg"
  />

  <!-- 底部导航栏 -->
  <van-tabbar v-model="active">
    <van-tabbar-item icon="home-o">首页</van-tabbar-item>
    <van-tabbar-item icon="cart-o">购物车</van-tabbar-item>
    <van-tabbar-item icon="contact">我的</van-tabbar-item>
  </van-tabbar>
</template>
```

## 2. Ant Design Vue 企业级组件库

[Ant Design Vue](https://www.antdv.com) 是 Ant Design 的 Vue3 实现，专注企业级中后台应用。

常用组件：`a-table`（表格）、`a-form`（表单）、`a-modal`（模态框）、`a-menu`（导航菜单）、`a-button`（按钮）。

**Vant vs Ant Design Vue**：

| 对比项 | Vant | Ant Design Vue |
|--------|------|---------------|
| 适用场景 | 移动端 H5 / 小程序 | PC 端中后台 |
| 设计风格 | 移动端轻量 | 企业级规范 |
| 组件数量 | 70+ | 60+ |
| 典型行业 | 电商、社交 | 管理系统、后台 |

**总结**：根据项目类型选择合适的组件库——移动端优先 Vant（轻量、移动端优化），PC 管理后台优先 Element Plus 或 Ant Design Vue（组件丰富、交互规范）。实际开发中通常只用一套主组件库，辅以少量自定义组件。
