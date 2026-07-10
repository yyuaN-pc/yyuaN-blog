---
title: Java基础语法（运算符与方法）
category: java
date: 2026年6月2日
datetime: 2026-06-02T00:00:00.000Z
wordCount: 约 1900 字
readTime: 预计 10 分钟
excerpt: 学习了Java中各类运算符（算术、赋值、关系、逻辑、三元）的用法，以及方法/函数的定义和调用格式，包含丰富的代码案例。
tags: [Java,Scanner,后端开发]
cover: "./covers/Java.png"
---

# Java基础语法（运算符与方法）

今天主要学习的是Java中的各种运算符，了解其作用以及使用方法；以及学习了Java中方法/函数的定义和调用格式。

## 1. 运算符

### 1.1 算术运算符

| 运算符 | 作用 | 额外说明 |
| :---: | :---: | --- |
| + | 加法 | 有字符串参与时，变为字符串连接符 |
| - | 减法 | - |
| * | 乘法 | - |
| / | 除法 | 两整数相除时，返回商为整数 |
| % | 取余 | 结果符号与被除数相同 |

**基本运算示例**：

```java
public class ArithmeticDemo {
    public static void main(String[] args) {
        int a = 10;
        int b = 3;
        
        System.out.println("a + b = " + (a + b)); // 13
        System.out.println("a - b = " + (a - b)); // 7
        System.out.println("a * b = " + (a * b)); // 30
        System.out.println("a / b = " + (a / b)); // 3（整数除法）
        System.out.println("a % b = " + (a % b)); // 1
        
        // 浮点数除法
        double c = 10.0;
        double d = 3.0;
        System.out.println("c / d = " + (c / d)); // 3.333...
    }
}
```

**数字位数拆分案例**：

```java
// 拆分数字 456 的个位、十位、百位
int num = 456;
int ge = num % 10;          // 6
int shi = num / 10 % 10;    // 5
int bai = num / 100;        // 4
System.out.println("百位:" + bai + " 十位:" + shi + " 个位:" + ge);
```

**自增自减运算符**：

| 运算符 | 作用 |
| :---: | --- |
| ++ | 自增，将变量值+1 |
| -- | 自减，将变量值-1 |

```java
public class IncrementDemo {
    public static void main(String[] args) {
        int a = 10;
        
        // 后置自增：先使用，再自增
        int b = a++; 
        System.out.println("a=" + a + ", b=" + b); // a=11, b=10
        
        // 前置自增：先自增，再使用
        int c = ++a;
        System.out.println("a=" + a + ", c=" + c); // a=12, c=12
        
        // 自减同理
        int d = a--;
        System.out.println("a=" + a + ", d=" + d); // a=11, d=12
    }
}
```

### 1.2 类型转换

**隐式类型转换**（小容量→大容量，自动完成）：

```java
public class ImplicitConversion {
    public static void main(String[] args) {
        int a = 10;
        // int → double（自动转换）
        double b = a;
        System.out.println("b = " + b); // 10.0
        
        // 运算时自动提升类型
        double c = b + a; // a 先提升为 double
        System.out.println("c = " + c); // 20.0
        
        byte d = 10;
        byte e = 5;
        // d 和 e 先提升至 int，所以结果也是 int
        int f = d + e;
        System.out.println("f = " + f); // 15
    }
}
```

**强制类型转换**（大容量→小容量，需显式声明）：

```java
public class ExplicitConversion {
    public static void main(String[] args) {
        double num1 = 3.99;
        int result1 = (int) num1;
        System.out.println("result1 = " + result1); // 3（小数部分被舍弃）
        
        double num2 = 5.5;
        int result2 = (int) num2;
        System.out.println("result2 = " + result2); // 5
        
        // 注意：可能造成数据溢出
        int maxInt = 2147483647;
        long bigNum = (long) maxInt + 1;
        System.out.println("bigNum = " + bigNum); // 2147483648
    }
}
```

### 1.3 赋值运算符

| 运算符 | 作用 | 示例 |
| :---: | :---: | --- |
| = | 赋值 | `a = 10` |
| += | 加后赋值 | `a += 5` 等价于 `a = a + 5` |
| -= | 减后赋值 | `a -= 3` 等价于 `a = a - 3` |
| *= | 乘后赋值 | `a *= 2` 等价于 `a = a * 2` |
| /= | 除后赋值 | `a /= 2` 等价于 `a = a / 2` |
| %= | 取余后赋值 | `a %= 3` 等价于 `a = a % 3` |

```java
public class AssignmentDemo {
    public static void main(String[] args) {
        int a = 10;
        
        a += 5;  // a = 15
        System.out.println("a += 5: " + a);
        
        a -= 3;  // a = 12
        System.out.println("a -= 3: " + a);
        
        a *= 2;  // a = 24
        System.out.println("a *= 2: " + a);
        
        a /= 4;  // a = 6
        System.out.println("a /= 4: " + a);
        
        a %= 4;  // a = 2
        System.out.println("a %= 4: " + a);
        
        // 扩展赋值运算符自动进行强制类型转换
        double b = 10.5;
        int c = 4;
        c += b;  // c = 14（自动转换）
        System.out.println("c += b: " + c);
    }
}
```

### 1.4 关系运算符

| 运算符 | 作用 | 返回值 |
| :---: | :---: | :---: |
| > | 大于 | boolean |
| < | 小于 | boolean |
| >= | 大于等于 | boolean |
| <= | 小于等于 | boolean |
| == | 等于 | boolean |
| != | 不等于 | boolean |

```java
public class RelationalDemo {
    public static void main(String[] args) {
        int a = 10;
        int b = 20;
        
        System.out.println("a > b: " + (a > b));     // false
        System.out.println("a < b: " + (a < b));     // true
        System.out.println("a >= b: " + (a >= b));   // false
        System.out.println("a <= b: " + (a <= b));   // true
        System.out.println("a == b: " + (a == b));   // false
        System.out.println("a != b: " + (a != b));   // true
    }
}
```

### 1.5 逻辑运算符

| 运算符 | 作用 | 短路特性 |
| :---: | :---: | :---: |
| & | 与：两边都为true才返回true | 无 |
| \| | 或：至少一边为true就返回true | 无 |
| ! | 非：取反 | - |
| ^ | 异或：两边不同返回true | - |
| && | 短路与：左边为false时右边不执行 | 有 |
| \|\| | 短路或：左边为true时右边不执行 | 有 |

**短路特性演示**：

```java
public class LogicalDemo {
    public static void main(String[] args) {
        int a = 10;
        
        // 短路与：左边为false，右边不执行，a不会自增
        boolean result1 = (a < 5) && (++a > 10);
        System.out.println("result1 = " + result1 + ", a = " + a); // result1=false, a=10
        
        // 非短路与：两边都执行，a会自增
        boolean result2 = (a < 5) & (++a > 10);
        System.out.println("result2 = " + result2 + ", a = " + a); // result2=false, a=11
        
        // 短路或：左边为true，右边不执行，a不会自增
        boolean result3 = (a > 5) || (++a > 10);
        System.out.println("result3 = " + result3 + ", a = " + a); // result3=true, a=11
    }
}
```

### 1.6 三元运算符

格式：`条件表达式 ? 值1 : 值2`

```java
public class TernaryDemo {
    public static void main(String[] args) {
        int a = 10;
        int b = 20;
        
        // 获取较大值
        int max = a > b ? a : b;
        System.out.println("最大值: " + max); // 20
        
        // 获取较小值
        int min = a < b ? a : b;
        System.out.println("最小值: " + min); // 10
        
        // 判断奇偶性
        int num = 15;
        String result = num % 2 == 0 ? "偶数" : "奇数";
        System.out.println(num + "是" + result); // 15是奇数
        
        // 嵌套使用
        int score = 85;
        String grade = score >= 90 ? "优秀" : 
                       score >= 80 ? "良好" :
                       score >= 60 ? "及格" : "不及格";
        System.out.println("成绩等级: " + grade); // 良好
    }
}
```

### 1.7 运算符优先级

| 优先级 | 运算符 |
| :---: | --- |
| 1 | `()` |
| 2 | `!` `~` `++` `--` |
| 3 | `*` `/` `%` |
| 4 | `+` `-` |
| 5 | `<<` `>>` `>>>` |
| 6 | `<` `>` `<=` `>=` |
| 7 | `==` `!=` |
| 8 | `&` |
| 9 | `^` |
| 10 | `\|` |
| 11 | `&&` |
| 12 | `\|\|` |
| 13 | `?:` |
| 14 | `=` `+=` `-=` 等 |

**建议**：使用括号明确运算顺序，提高代码可读性。

```java
// 不好的写法：依赖运算符优先级
int result = 10 + 5 * 2; // 20

// 好的写法：使用括号明确顺序
int result2 = 10 + (5 * 2); // 20
int result3 = (10 + 5) * 2; // 30
```

## 2. 方法

### 2.1 Scanner键盘录入

```java
import java.util.Scanner;

public class ScannerDemo {
    public static void main(String[] args) {
        // 创建Scanner对象
        Scanner sc = new Scanner(System.in);
        
        // 录入整数
        System.out.println("请输入一个整数：");
        int num = sc.nextInt();
        System.out.println("你输入的整数是：" + num);
        
        // 录入字符串
        System.out.println("请输入你的姓名：");
        String name = sc.next();
        System.out.println("你好，" + name);
        
        // 录入浮点数
        System.out.println("请输入你的身高：");
        double height = sc.nextDouble();
        System.out.println("你的身高是：" + height + "cm");
        
        // 关闭Scanner
        sc.close();
    }
}
```

### 2.2 方法的定义

```java
/* 
方法格式：
修饰符 返回值类型 方法名(参数列表) {
    方法体;
    return 返回值;
}
*/

public class MethodDemo {
    // 无返回值方法
    public static void sayHello() {
        System.out.println("Hello, Java!");
    }
    
    // 有返回值方法
    public static int add(int a, int b) {
        int sum = a + b;
        return sum;
    }
    
    // 多个参数方法
    public static double calculateBMI(double weight, double height) {
        // BMI = 体重(kg) / 身高(m)^2
        return weight / (height * height);
    }
    
    public static void main(String[] args) {
        sayHello();
        
        int result = add(10, 20);
        System.out.println("10 + 20 = " + result);
        
        double bmi = calculateBMI(65, 1.75);
        System.out.println("BMI指数: " + bmi);
    }
}
```

### 2.3 方法的调用

```java
public class MethodCallDemo {
    public static void main(String[] args) {
        // 调用无参数无返回值方法
        printSeparator();
        
        // 调用有参数有返回值方法
        int max = getMax(10, 20);
        System.out.println("最大值: " + max);
        
        // 调用有参数无返回值方法
        printInfo("张三", 25);
        
        printSeparator();
    }
    
    public static void printSeparator() {
        System.out.println("====================");
    }
    
    public static int getMax(int a, int b) {
        return a > b ? a : b;
    }
    
    public static void printInfo(String name, int age) {
        System.out.println("姓名: " + name);
        System.out.println("年龄: " + age + "岁");
    }
}
```

### 2.4 方法练习：计算器

```java
import java.util.Scanner;

public class Calculator {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        
        System.out.println("========== 简易计算器 ==========");
        System.out.print("请输入第一个数：");
        double num1 = sc.nextDouble();
        
        System.out.print("请输入运算符(+ - * /)：");
        char operator = sc.next().charAt(0);
        
        System.out.print("请输入第二个数：");
        double num2 = sc.nextDouble();
        
        double result = calculate(num1, num2, operator);
        System.out.println("结果：" + num1 + " " + operator + " " + num2 + " = " + result);
        
        sc.close();
    }
    
    public static double calculate(double num1, double num2, char operator) {
        switch (operator) {
            case '+':
                return num1 + num2;
            case '-':
                return num1 - num2;
            case '*':
                return num1 * num2;
            case '/':
                if (num2 == 0) {
                    System.out.println("错误：除数不能为0！");
                    return 0;
                }
                return num1 / num2;
            default:
                System.out.println("错误：无效的运算符！");
                return 0;
        }
    }
}
```

### 2.5 方法重载

方法重载：方法名相同，参数列表不同（个数、类型、顺序）

```java
public class MethodOverload {
    // 两个整数相加
    public static int add(int a, int b) {
        return a + b;
    }
    
    // 三个整数相加
    public static int add(int a, int b, int c) {
        return a + b + c;
    }
    
    // 两个小数相加
    public static double add(double a, double b) {
        return a + b;
    }
    
    // 整数和小数相加
    public static double add(int a, double b) {
        return a + b;
    }
    
    public static void main(String[] args) {
        System.out.println(add(10, 20));          // 调用 int + int
        System.out.println(add(10, 20, 30));      // 调用 int + int + int
        System.out.println(add(1.5, 2.5));        // 调用 double + double
        System.out.println(add(10, 2.5));         // 调用 int + double
    }
}
```
