---
title: Element Plus 表单组件详解
category: vue
date: 2026年1月18日
datetime: 2026-01-18T00:00:00.000Z
wordCount: 约 1440 字
readTime: 预计 7 分钟
excerpt: 全面掌握Element Plus表单组件体系，包括表单容器验证规则、输入框、选择器、级联选择等核心表单元素的使用方法。
tags: [Vue3, Element Plus]
cover: "./covers/vue.png"
---

# Element Plus 表单组件详解

## 1. Form 表单容器

`el-form` 提供数据验证、布局控制等功能：

```vue
<template>
  <el-form
    ref="formRef"
    :model="formData"
    :rules="rules"
    label-width="100px"
  >
    <el-form-item label="用户名" prop="username">
      <el-input v-model="formData.username" />
    </el-form-item>
    <el-form-item label="密码" prop="password">
      <el-input v-model="formData.password" type="password" />
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="handleSubmit">提交</el-button>
    </el-form-item>
  </el-form>
</template>

<script setup>
import { reactive, ref } from 'vue'

const formData = reactive({ username: '', password: '' })
const rules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, max: 20, message: '长度3~20字符', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' }
  ]
}

const handleSubmit = async () => {
  const valid = await formRef.value.validate()
  if (valid) console.log('提交成功', formData)
}
</script>
```

## 2. 输入类组件

### 2.1 Input 输入框

```vue
<template>
  <el-input v-model="search" placeholder="搜索..." clearable />
  <el-input v-model="remark" type="textarea" :rows="4" maxlength="200" show-word-limit />
  <el-input v-model="code" placeholder="验证码">
    <template #append>
      <el-button @click="sendCode">发送验证码</el-button>
    </template>
  </el-input>
</template>
```

### 2.2 InputNumber 计数器

```vue
<el-input-number v-model="quantity" :min="1" :max="99" />
```

### 2.3 AutoComplete 自动补全

```vue
<template>
  <el-autocomplete
    v-model="city"
    :fetch-suggestions="queryCities"
    placeholder="搜索城市"
    @select="onSelect"
  />
</template>
<script setup>
const queryCities = (query, cb) => {
  const results = cities.filter(c => c.value.includes(query))
  cb(results)
}
</script>
```

## 3. 选择类组件

### 3.1 Select 选择器

```vue
<template>
  <el-select v-model="selected" placeholder="请选择" clearable multiple filterable>
    <el-option label="选项1" value="1" />
    <el-option label="选项2" value="2" disabled />
    <el-option
      v-for="item in options"
      :key="item.value"
      :label="item.label"
      :value="item.value"
    />
  </el-select>
</template>
```

### 3.2 Cascader 级联选择器

```vue
<template>
  <el-cascader
    v-model="area"
    :options="areaOptions"
    :props="{ expandTrigger: 'hover' }"
    placeholder="选择地区"
    clearable
  />
</template>
```

### 3.3 Radio / Checkbox

```vue
<template>
  <!-- 单选框组 -->
  <el-radio-group v-model="gender">
    <el-radio value="male">男</el-radio>
    <el-radio value="female">女</el-radio>
  </el-radio-group>

  <!-- 复选框组 -->
  <el-checkbox-group v-model="hobbies">
    <el-checkbox value="read" label="阅读" />
    <el-checkbox value="sport" label="运动" />
    <el-checkbox value="code" label="编程" />
  </el-checkbox-group>
</template>
```

**总结**：Form 组件配合 `rules` 验证规则和 `validate` 方法是表单开发的核心模式。Input/Select/Cascader 等输入和选择组件覆盖了绝大部分表单场景，合理配置 `trigger`、`clearable` 等属性可显著提升用户体验。
