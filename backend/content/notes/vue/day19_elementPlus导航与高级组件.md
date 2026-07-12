---
title: Element Plus 导航类与高级组件
category: vue
date: 2026年1月24日
datetime: 2026-01-24T00:00:00.000Z
wordCount: 约 1420 字
readTime: 预计 7 分钟
excerpt: 深入学习Element Plus的导航类组件（菜单、标签页、面包屑、步骤条）和高级组件（对话框、抽屉、卡片、走马灯），掌握后台管理页面的构建方法。
tags: [Vue3, Element Plus]
cover: "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Element%20Plus%20navigation%20menu%20dialog%20and%20advanced%20components%20admin%20dashboard%20UI&image_size=landscape_4_3"
---

# Element Plus 导航类与高级组件

## 1. 导航类组件

### 1.1 Menu 导航菜单

支持水平/垂直两种模式，可配置路由导航：

```vue
<template>
  <el-menu :default-active="route.path" router>
    <el-menu-item index="/dashboard">
      <el-icon><DataAnalysis /></el-icon>仪表盘
    </el-menu-item>
    <el-sub-menu index="/system">
      <template #title><el-icon><Setting /></el-icon>系统管理</template>
      <el-menu-item index="/system/user">用户管理</el-menu-item>
      <el-menu-item index="/system/role">角色管理</el-menu-item>
    </el-sub-menu>
  </el-menu>
</template>
```

### 1.2 Tabs 标签页

```vue
<template>
  <el-tabs v-model="activeTab" type="border-card" closable @tab-remove="removeTab">
    <el-tab-pane label="基本信息" name="basic">基本信息内容</el-tab-pane>
    <el-tab-pane label="权限设置" name="permission">权限设置内容</el-tab-pane>
  </el-tabs>
</template>
```

### 1.3 Breadcrumb 面包屑

配合路由实现动态面包屑导航：

```vue
<template>
  <el-breadcrumb separator="/">
    <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
    <el-breadcrumb-item>系统管理</el-breadcrumb-item>
    <el-breadcrumb-item>用户管理</el-breadcrumb-item>
  </el-breadcrumb>
</template>
```

### 1.4 Steps 步骤条

```vue
<template>
  <el-steps :active="currentStep" align-center>
    <el-step title="填写信息" description="基本资料" />
    <el-step title="确认订单" description="核对信息" />
    <el-step title="完成支付" description="支付确认" />
  </el-steps>
</template>
```

## 2. 高级组件

### 2.1 Dialog 对话框

```vue
<template>
  <el-button @click="dialogVisible = true">打开对话框</el-button>
  <el-dialog v-model="dialogVisible" title="编辑用户" width="500px">
    <el-form>用户表单内容</el-form>
    <template #footer>
      <el-button @click="dialogVisible = false">取消</el-button>
      <el-button type="primary" @click="handleConfirm">确认</el-button>
    </template>
  </el-dialog>
</template>
```

### 2.2 Drawer 抽屉

```vue
<template>
  <el-drawer v-model="drawerVisible" title="详情" size="40%">
    <p>抽屉内容，适合展示详情或配置面板</p>
  </el-drawer>
</template>
```

### 2.3 Card 卡片

```vue
<template>
  <el-card shadow="hover">
    <template #header>卡片标题</template>
    <p>卡片内容区域</p>
  </el-card>
</template>
```

### 2.4 Carousel 走马灯

```vue
<template>
  <el-carousel height="300px" :interval="3000">
    <el-carousel-item v-for="item in slides" :key="item.id">
      <img :src="item.image" />
    </el-carousel-item>
  </el-carousel>
</template>
```

### 2.5 Collapse 折叠面板

```vue
<template>
  <el-collapse v-model="activeNames" accordion>
    <el-collapse-item title="FAQ 1" name="1">回答内容</el-collapse-item>
    <el-collapse-item title="FAQ 2" name="2">回答内容</el-collapse-item>
  </el-collapse>
</template>
```

**总结**：导航类组件（Menu、Tabs、Breadcrumb、Steps）构成了后台应用的导航体系，高级组件（Dialog、Drawer、Card、Carousel、Collapse）覆盖了弹窗、展示、轮播等常见交互需求。合理搭配可快速搭建功能完整的后台管理页面。
