---
title: Element Plus 数据展示与进阶表单组件
category: vue
date: 2026年1月21日
datetime: 2026-01-21T00:00:00.000Z
wordCount: 约 1430 字
readTime: 预计 7 分钟
excerpt: 掌握Element Plus的数据展示组件（表格、标签、进度条、树形控件、分页）和进阶表单组件（上传、日期选择器、穿梭框、评分等），构建完整的数据管理界面。
tags: [Vue3, Element Plus]
cover: "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Element%20Plus%20data%20table%20pagination%20and%20upload%20components%20modern%20dashboard%20UI&image_size=landscape_4_3"
---

# Element Plus 数据展示与进阶表单组件

## 1. 数据展示组件

### 1.1 Table 表格

`el-table` 配合 `el-table-column` 实现数据展示：

```vue
<template>
  <el-table :data="tableData" stripe border @row-click="handleRowClick">
    <el-table-column type="selection" width="55" />
    <el-table-column prop="name" label="姓名" sortable />
    <el-table-column prop="age" label="年龄" />
    <el-table-column label="操作">
      <template #default="{ row }">
        <el-button size="small" @click="edit(row)">编辑</el-button>
        <el-button size="small" type="danger" @click="remove(row)">删除</el-button>
      </template>
    </el-table-column>
  </el-table>

  <!-- 分页 -->
  <el-pagination
    v-model:current-page="page"
    v-model:page-size="pageSize"
    :total="total"
    :page-sizes="[10, 20, 50]"
    layout="total, sizes, prev, pager, next, jumper"
    @current-change="fetchData"
  />
</template>
```

### 1.2 Tag 标签

```vue
<template>
  <el-tag type="success">已完成</el-tag>
  <el-tag type="warning" closable @close="handleClose">待审核</el-tag>
  <el-tag hit>默认标签</el-tag>
</template>
```

### 1.3 Progress 进度条

```vue
<template>
  <el-progress :percentage="progress" :status="progress >= 100 ? 'success' : ''" />
  <el-progress type="circle" :percentage="progress" :width="80" />
</template>
```

### 1.4 Tree 树形控件

```vue
<template>
  <el-tree
    :data="treeData"
    :props="{ label: 'name', children: 'children' }"
    default-expand-all
    @node-click="handleNodeClick"
  />
</template>
```

### 1.5 Descriptions 描述列表

```vue
<template>
  <el-descriptions title="用户信息" :column="2" border>
    <el-descriptions-item label="姓名">张三</el-descriptions-item>
    <el-descriptions-item label="角色">管理员</el-descriptions-item>
    <el-descriptions-item label="邮箱">zhang@example.com</el-descriptions-item>
  </el-descriptions>
</template>
```

## 2. 进阶表单组件

### 2.1 Upload 上传

```vue
<template>
  <el-upload
    action="/api/upload"
    :limit="3"
    :on-success="handleSuccess"
    list-type="picture-card"
    :before-upload="beforeUpload"
  >
    <el-icon><Plus /></el-icon>
  </el-upload>
</template>
```

### 2.2 DatePicker 日期选择器

```vue
<template>
  <el-date-picker v-model="date" type="date" placeholder="选择日期" />
  <el-date-picker v-model="range" type="daterange" range-separator="至" />
  <el-time-picker v-model="time" placeholder="选择时间" />
</template>
```

### 2.3 Switch 开关 / Slider 滑块

```vue
<template>
  <el-switch v-model="enabled" active-text="启用" inactive-text="禁用" />
  <el-slider v-model="volume" :min="0" :max="100" show-input />
</template>
```

### 2.4 Rate 评分 / ColorPicker 颜色选择器

```vue
<template>
  <el-rate v-model="rating" :max="5" show-score />
  <el-color-picker v-model="themeColor" />
</template>
```

### 2.5 Transfer 穿梭框

```vue
<template>
  <el-transfer
    v-model="selectedRoles"
    :data="allRoles"
    :titles="['可选角色', '已选角色']"
  />
</template>
```

**总结**：Table + Pagination 是数据管理页面的核心组合，配合 Tag、Progress、Tree 等组件可构建丰富的数据看板。Upload、DatePicker、Switch、Transfer 等进阶表单组件覆盖了文件上传、日期选择、开关控制、数据分配等专业场景。
