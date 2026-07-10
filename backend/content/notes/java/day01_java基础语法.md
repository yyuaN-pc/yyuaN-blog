---
title: Java开发环境搭建和基础语法
category: java
date: 2026年6月1日
datetime: 2026-06-01T00:00:00.000Z
wordCount: 约 1200 字
readTime: 预计 8 分钟
excerpt: 完成了JDK和IDEA的安装与环境配置，创建了第一个Java项目，并学习了变量、数据类型、标识符、常量等基础语法知识。
tags: [Java, JDK, IDEA, 后端开发]
cover: "./covers/Java.png"
---

# Java开发环境搭建和基础语法

今天开始Java的正式学习，完成了JDK和IDEA的安装、环境的配置。并使用IDEA创建了简单的Java项目，完成了对Java部分基础语法的学习。项目，完成了对Java部分基础语法的学习。

## 1. 安装JDK和IDEA

[IDEA官方安装地址](https://www.jetbrains.com/idea/download/)
[JDK官方安装地址](https://www.oracle.com/java/technologies/downloads/)

### 1.1 JDK版本选择

建议安装版本：**JDK21** （官方长期维护的LTS版本）

| JDK版本 | 支持状态 | 备注 |
| :---: | :---: | --- |
| JDK 8 | 支持 | 经典版本，企业中广泛使用 |
| JDK 17 | LTS | 最新的LTS版本，推荐学习 |
| JDK 21 | LTS | 最新LTS，支持虚拟线程等新特性 |

### 1.2 环境变量配置

手动配置环境变量：

- 新增 **%JAVA_HOME%** 路径：JDK安装目录（如 `C:\Program Files\Java\jdk-21`）
- **PATH**：添加 **%JAVA_HOME%\bin**

验证配置是否成功：

```bash
java -version
javac -version
```

### 1.3 IDEA配置

首次打开IDEA需要配置JDK：
1. File → Project Structure → SDKs
2. 点击 + 号添加 JDK
3. 选择JDK安装目录

## 2. Java基础语法

### 2.1 项目结构

```
Project
  ├── module
  │     ├── package
  │     │     └── class.java
  │     └── src
  └── .idea
```

**包命名规范**：采用公司域名倒置，如 `com.example.project`

### 2.2 Hello World

```java
package com.example;

public class HelloWorld {
    public static void main(String[] args) {
        System.out.println("Hello, World!");
    }
}
```

**关键点**：
- `public`：公共访问修饰符
- `class`：定义类
- `main`：程序入口方法，必须是 `public static void main(String[] args)`

### 2.3 注释

```java
// 这是一个单行注释 ctrl + /

/* 
  这是一个
  多行注释 选中多行， ctrl + / 
 */

/** 
 * 这是一个文档注释
 * @author 作者名
 * @version 1.0
 */
```

### 2.4 关键字和字面量

**关键字**：Java中特殊含义的单词，不能用于变量名、方法名等。

```java
public class Student {
    private String name;
    public static void main(String[] args) {
        int age = 18;
    }
}
```

**字面量**：直接在代码中出现的数据值。

| 类型 | 示例 |
| :---: | --- |
| 整数 | `10`, `20`, `100` |
| 小数 | `3.14`, `2.5`, `0.0` |
| 字符串 | `"Hello"`, `"Java"` |
| 字符 | `'A'`, `'b'`, `'中'` |
| 布尔值 | `true`, `false` |

### 2.5 变量、标识符、数据类型

定义格式：数据类型 变量名 = 数据值

```java
String name = "张三";
int age = 18;
char gender = '男';
double height = 178.5;
boolean isStudent = true;
```

**标识符命名规范**：

- 以字母、下划线 `_` 或美元符号 `$` 开头
- 只能包含字母、数字、下划线
- 不能是关键字
- 区分大小写

**命名风格**：
- 小驼峰（变量、方法）: `firstName`, `isStudent`, `getAge()`
- 大驼峰（类、接口）: `Person`, `StudentService`
- 常量（全大写+下划线）: `MAX_VALUE`, `PI`

### 2.6 基本数据类型

Java有8种基本数据类型：

| 类型 | 关键字 | 占用字节 | 取值范围 | 默认值 |
| :---: | :---: | :---: | :---: | :---: |
| 字节型 | byte | 1 | -128 ~ 127 | 0 |
| 短整型 | short | 2 | -32768 ~ 32767 | 0 |
| 整型 | int | 4 | -21亿 ~ 21亿 | 0 |
| 长整型 | long | 8 | -9E18 ~ 9E18 | 0L |
| 单精度浮点 | float | 4 | ±3.4E38 | 0.0f |
| 双精度浮点 | double | 8 | ±1.7E308 | 0.0 |
| 字符型 | char | 2 | '\u0000' ~ '\uffff' | '\u0000' |
| 布尔型 | boolean | 1 | true / false | false |

### 2.7 常量

使用 `final` 关键字定义常量：

```java
// 常量命名：全大写+下划线
public class Constants {
    public static final double PI = 3.1415926;
    public static final int MAX_AGE = 120;
    public static final String SCHOOL_NAME = "清华大学";
    
    public static void main(String[] args) {
        // PI = 3.14; // 报错，常量不能重新赋值
        System.out.println("圆周率: " + PI);
    }
}
```

### 2.8 数据类型转换

**自动类型转换**（小容量→大容量）：

```java
int num = 100;
double price = num; // int → double
System.out.println(price); // 100.0
```

**强制类型转换**（大容量→小容量，可能丢失精度）：

```java
double num = 3.14;
int result = (int) num; // 强制转换
System.out.println(result); // 3（小数部分被舍弃）

double num2 = 100.99;
int result2 = (int) num2; // 100
```

### 2.9 转义字符

```java
public class EscapeCharacters {
    public static void main(String[] args) {
        // 换行符
        System.out.println("第一行\n第二行");
        
        // 制表符
        System.out.println("姓名\t年龄\t性别");
        System.out.println("张三\t18\t男");
        
        // 双引号
        System.out.println("他说:\"Hello World\"");
        
        // 单引号
        System.out.println("字符是:'A'");
        
        // 反斜杠
        System.out.println("路径是:C:\\Users\\Desktop");
    }
}
```

### 2.10 练习：输出个人信息

```java
public class PersonalInfo {
    public static void main(String[] args) {
        // 定义变量
        String name = "张三";
        int age = 25;
        double salary = 8500.00;
        char gender = '男';
        boolean isMarried = false;
        
        // 输出信息
        System.out.println("========== 个人信息 ==========");
        System.out.println("姓名:\t\t" + name);
        System.out.println("年龄:\t\t" + age + "岁");
        System.out.println("性别:\t\t" + gender);
        System.out.println("月薪:\t\t" + salary + "元");
        System.out.println("已婚:\t\t" + (isMarried ? "是" : "否"));
        System.out.println("==============================");
    }
}
```
