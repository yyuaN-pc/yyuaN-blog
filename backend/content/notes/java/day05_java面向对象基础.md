---
title: Java面向对象基础
category: java
date: 2026年7月5日
datetime: 2026-07-05T00:00:00.000Z
wordCount: 约 2500 字
readTime: 预计 12 分钟
excerpt: 学习了类与对象的定义和使用、this关键字、构造方法、封装思想、权限修饰符、标准JavaBean以及static关键字和工具类。
tags: [Java, 类与对象, 后端开发]
cover: "./covers/Java.png"
---

# Java面向对象基础

## 1. 类和对象

### 1.1 什么是类和对象

- **类**：类是一种数据类型，用于描述对象的特征（属性）和行为（方法）。
- **对象**：对象是类的具体实例，用于表示具体的实体。

**举例**：

| 类别 | 类（模板） | 对象（实例） |
| :---: | :---: | :---: |
| 足球运动员 | 姓名、年龄、身高；跑、传球、射门 | 姆巴佩 |
| 汽车 | 品牌、颜色、速度；启动、加速、刹车 | 我的宝马车 |
| 手机 | 品牌、型号、价格；打电话、拍照、上网 | iPhone 15 |

### 1.2 类和对象的创建

```java
// 定义类
public class Student {
    // 属性（成员变量）
    private String name;
    private int age;
    private String gender;
    
    // 方法（成员方法）
    public void study() {
        System.out.println(name + "正在学习");
    }
    
    public void introduce() {
        System.out.println("我叫" + name + "，今年" + age + "岁，性别" + gender);
    }
}

// 创建对象并使用
public class StudentTest {
    public static void main(String[] args) {
        // 创建对象
        Student student = new Student();
        
        // 访问属性
        student.name = "张三";
        student.age = 18;
        student.gender = "男";
        
        // 调用方法
        student.introduce(); // 我叫张三，今年18岁，性别男
        student.study();     // 张三正在学习
    }
}
```

### 1.3 创建多个对象

```java
public class MultipleObjects {
    public static void main(String[] args) {
        Student s1 = new Student();
        s1.name = "张三";
        s1.age = 18;
        
        Student s2 = new Student();
        s2.name = "李四";
        s2.age = 20;
        
        s1.introduce(); // 我叫张三，今年18岁
        s2.introduce(); // 我叫李四，今年20岁
        
        // 修改s1的属性不影响s2
        s1.name = "张三改";
        s1.introduce(); // 我叫张三改，今年18岁
        s2.introduce(); // 我叫李四，今年20岁（不受影响）
    }
}
```

## 2. this关键字

### 2.1 this的作用

- **this**：指向当前对象的引用。
- **作用**：
  1. 在构造方法中区分同名的参数和成员变量
  2. 调用当前对象的其他方法
  3. 在构造方法中调用其他构造方法

### 2.2 区分同名变量

```java
public class Person {
    private String name;
    private int age;
    
    // 参数名和成员变量名相同，使用this区分
    public void setName(String name) {
        this.name = name;
    }
    
    public void setAge(int age) {
        this.age = age;
    }
    
    public void introduce() {
        System.out.println("我叫" + this.name + "，今年" + this.age + "岁");
    }
}
```

### 2.3 调用其他构造方法

```java
public class Student {
    private String name;
    private int age;
    
    // 无参构造
    public Student() {
        // 调用有参构造
        this("未知", 0);
    }
    
    // 有参构造
    public Student(String name) {
        this(name, 0);
    }
    
    // 有参构造
    public Student(String name, int age) {
        this.name = name;
        this.age = age;
    }
}
```

**注意**：`this()` 必须放在构造方法的第一行。

## 3. 构造方法

### 3.1 构造方法的定义

```java
public class Student {
    private String name;
    private int age;
    
    // 无参构造方法
    public Student() {
        System.out.println("无参构造被调用");
    }
    
    // 有参构造方法
    public Student(String name, int age) {
        this.name = name;
        this.age = age;
        System.out.println("有参构造被调用");
    }
}
```

### 3.2 构造方法的特点

| 特点 | 说明 |
| :---: | --- |
| 方法名 | 必须与类名相同，大小写一致 |
| 返回值 | 没有返回值类型（包括void） |
| 调用时机 | 创建对象时自动调用 |

### 3.3 默认构造方法

如果类中没有定义任何构造方法，编译器会自动生成一个默认的无参构造方法。

```java
// 默认构造方法（自动生成）
public class Student {
    // 编译器自动生成：
    // public Student() {}
}
```

**注意**：一旦定义了构造方法，默认构造方法就不会自动生成。

## 4. 封装思想

### 4.1 什么是封装

- **封装**：将属性和方法封装在类中，只暴露必要的接口。
- **作用**：
  - 提高代码的安全性
  - 提高代码的可维护性
  - 实现数据和数据处理相分离

### 4.2 权限修饰符

| 权限修饰符 | 同一个类 | 同一个包 | 不同包的子类 | 不同包无关类 |
| :---: | :---: | :---: | :---: | :---: |
| public | 是 | 是 | 是 | 是 |
| protected | 是 | 是 | 是 | 否 |
| default（包访问） | 是 | 是 | 否 | 否 |
| private | 是 | 否 | 否 | 否 |

```java
public class AccessModifierDemo {
    public String publicField = "公共";
    protected String protectedField = "保护";
    String defaultField = "默认"; // 包访问
    private String privateField = "私有";
    
    public void showAll() {
        System.out.println(publicField);     // 可访问
        System.out.println(protectedField); // 可访问
        System.out.println(defaultField);   // 可访问
        System.out.println(privateField);   // 可访问
    }
}
```

### 4.3 getter和setter方法

```java
public class Student {
    // 属性私有化
    private String name;
    private int age;
    
    // getter方法：获取属性值
    public String getName() {
        return name;
    }
    
    // setter方法：设置属性值
    public void setName(String name) {
        this.name = name;
    }
    
    public int getAge() {
        return age;
    }
    
    public void setAge(int age) {
        // 可以添加验证逻辑
        if (age >= 0 && age <= 120) {
            this.age = age;
        } else {
            System.out.println("年龄无效！");
        }
    }
}
```

### 4.4 标准JavaBean

**标准要求**：
1. 成员变量全部私有化
2. 提供对应的 setXxx 和 getXxx 方法
3. 提供空参数构造方法和带参数构造方法

```java
public class Person {
    private String name;
    private int age;
    private String address;
    
    // 无参构造
    public Person() {}
    
    // 有参构造
    public Person(String name, int age, String address) {
        this.name = name;
        this.age = age;
        this.address = address;
    }
    
    // getter方法
    public String getName() {
        return name;
    }
    
    public int getAge() {
        return age;
    }
    
    public String getAddress() {
        return address;
    }
    
    // setter方法
    public void setName(String name) {
        this.name = name;
    }
    
    public void setAge(int age) {
        this.age = age;
    }
    
    public void setAddress(String address) {
        this.address = address;
    }
}
```

## 5. static关键字

### 5.1 static的作用

- **static**：静态的意思，可以修饰成员变量和成员方法。
- **特点**：
  - 静态成员属于类，不属于对象
  - 可以通过类名直接访问，也可以通过对象访问
  - 所有对象共享静态成员

### 5.2 静态变量

```java
public class Counter {
    // 实例变量：每个对象独立
    private int instanceCount;
    
    // 静态变量：所有对象共享
    private static int staticCount;
    
    public Counter() {
        instanceCount++;
        staticCount++;
    }
    
    public void showCount() {
        System.out.println("实例计数: " + instanceCount);
        System.out.println("静态计数: " + staticCount);
    }
}

// 使用
Counter c1 = new Counter();
Counter c2 = new Counter();
Counter c3 = new Counter();

c1.showCount(); // 实例计数: 1, 静态计数: 3
c2.showCount(); // 实例计数: 1, 静态计数: 3
c3.showCount(); // 实例计数: 1, 静态计数: 3
```

### 5.3 静态方法

```java
public class MathUtils {
    // 静态方法：无需创建对象即可调用
    public static int add(int a, int b) {
        return a + b;
    }
    
    public static int max(int a, int b) {
        return a > b ? a : b;
    }
    
    public static int min(int a, int b) {
        return a < b ? a : b;
    }
}

// 使用：通过类名直接调用
int sum = MathUtils.add(10, 20);
int max = MathUtils.max(15, 25);
```

### 5.4 静态方法注意事项

```java
public class StaticDemo {
    private int instanceVar = 10;
    private static int staticVar = 20;
    
    // 实例方法：可以访问实例变量和静态变量
    public void instanceMethod() {
        System.out.println(instanceVar); // 可以
        System.out.println(staticVar);   // 可以
    }
    
    // 静态方法：只能访问静态变量，不能访问实例变量
    public static void staticMethod() {
        // System.out.println(instanceVar); // 错误！
        System.out.println(staticVar);     // 可以
    }
}
```

### 5.5 静态代码块

```java
public class StaticBlock {
    private static int count;
    
    // 静态代码块：类加载时执行，只执行一次
    static {
        System.out.println("静态代码块被执行");
        count = 100;
    }
    
    public StaticBlock() {
        System.out.println("构造方法被执行");
    }
}

// 使用
StaticBlock obj1 = new StaticBlock(); 
// 输出：静态代码块被执行 → 构造方法被执行

StaticBlock obj2 = new StaticBlock();
// 输出：构造方法被执行（静态代码块不再执行）
```

## 6. 工具类

### 6.1 工具类设计规范

```java
public class ArrayTools {
    // 私有构造方法：防止创建对象
    private ArrayTools() {}
    
    // 静态方法：提供数组操作功能
    public static int getMax(int[] arr) {
        int max = arr[0];
        for (int i = 1; i < arr.length; i++) {
            if (arr[i] > max) {
                max = arr[i];
            }
        }
        return max;
    }
    
    public static int getMin(int[] arr) {
        int min = arr[0];
        for (int i = 1; i < arr.length; i++) {
            if (arr[i] < min) {
                min = arr[i];
            }
        }
        return min;
    }
    
    public static void printArray(int[] arr) {
        System.out.print("[");
        for (int i = 0; i < arr.length; i++) {
            if (i > 0) {
                System.out.print(", ");
            }
            System.out.print(arr[i]);
        }
        System.out.println("]");
    }
}

// 使用
int[] arr = {10, 20, 30, 40, 50};
int max = ArrayTools.getMax(arr);
int min = ArrayTools.getMin(arr);
ArrayTools.printArray(arr);
```

## 7. 综合练习

### 7.1 学生管理系统

```java
public class StudentManager {
    public static void main(String[] args) {
        Student[] students = new Student[3];
        
        students[0] = new Student("张三", 18);
        students[1] = new Student("李四", 20);
        students[2] = new Student("王五", 19);
        
        // 显示所有学生
        showAllStudents(students);
        
        // 查找年龄最大的学生
        Student oldest = findOldest(students);
        System.out.println("\n年龄最大的学生：" + oldest.getName());
    }
    
    public static void showAllStudents(Student[] students) {
        for (Student s : students) {
            System.out.println("姓名: " + s.getName() + ", 年龄: " + s.getAge());
        }
    }
    
    public static Student findOldest(Student[] students) {
        Student oldest = students[0];
        for (int i = 1; i < students.length; i++) {
            if (students[i].getAge() > oldest.getAge()) {
                oldest = students[i];
            }
        }
        return oldest;
    }
}
```

### 7.2 计算器工具类

```java
public class Calculator {
    private Calculator() {}
    
    public static double add(double a, double b) {
        return a + b;
    }
    
    public static double subtract(double a, double b) {
        return a - b;
    }
    
    public static double multiply(double a, double b) {
        return a * b;
    }
    
    public static double divide(double a, double b) {
        if (b == 0) {
            throw new IllegalArgumentException("除数不能为0");
        }
        return a / b;
    }
    
    public static double power(double base, int exponent) {
        double result = 1;
        for (int i = 0; i < exponent; i++) {
            result *= base;
        }
        return result;
    }
}
```

### 7.3 日期工具类

```java
import java.util.Scanner;

public class DateUtils {
    private DateUtils() {}
    
    public static boolean isLeapYear(int year) {
        return (year % 4 == 0 && year % 100 != 0) || (year % 400 == 0);
    }
    
    public static int getDaysInMonth(int year, int month) {
        switch (month) {
            case 2:
                return isLeapYear(year) ? 29 : 28;
            case 4:
            case 6:
            case 9:
            case 11:
                return 30;
            default:
                return 31;
        }
    }
    
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        System.out.println("请输入年份：");
        int year = sc.nextInt();
        System.out.println("请输入月份：");
        int month = sc.nextInt();
        
        int days = getDaysInMonth(year, month);
        System.out.println(year + "年" + month + "月有" + days + "天");
        
        sc.close();
    }
}
```
