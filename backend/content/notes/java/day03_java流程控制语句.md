---
title: Java流程控制语句
category: java
date: 2026年7月3日
datetime: 2026-07-03T00:00:00.000Z
wordCount: 约 2500 字
readTime: 预计 12 分钟
excerpt: 学习了顺序结构、分支结构（if、switch）和循环结构（for、while、do-while），以及break和continue跳转语句，包含大量实用代码案例。
tags: [Java,后端开发]
cover: "./covers/Java.png"
---

# Java流程控制语句

程序执行的三种基本结构：
- **顺序结构**：从上到下依次执行
- **分支结构**：根据条件选择执行（if、switch）
- **循环结构**：重复执行（for、while、do-while）

## 1. 分支结构

### 1.1 if语句

**第一种格式**：单分支

```java
if (判断条件) {
    // 如果条件为true，执行这里的代码
}
```

**第二种格式**：双分支

```java
if (判断条件) {
    // 如果条件为true，执行这里的代码
} else {
    // 如果条件为false，执行这里的代码
}
```

**第三种格式**：多分支

```java
if (判断条件1) {
    // 如果条件1为true，执行这里的代码
} else if (判断条件2) {
    // 如果条件2为true，执行这里的代码
} else if (判断条件3) {
    // 如果条件3为true，执行这里的代码
} else {
    // 如果所有条件都为false，执行这里的代码
}
```

**案例：成绩等级判断**

```java
import java.util.Scanner;

public class ScoreLevel {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        System.out.println("请输入成绩：");
        int score = sc.nextInt();
        
        if (score >= 90 && score <= 100) {
            System.out.println("优秀");
        } else if (score >= 80) {
            System.out.println("良好");
        } else if (score >= 70) {
            System.out.println("中等");
        } else if (score >= 60) {
            System.out.println("及格");
        } else if (score >= 0) {
            System.out.println("不及格");
        } else {
            System.out.println("输入的成绩无效！");
        }
        
        sc.close();
    }
}
```

**案例：判断闰年**

```java
import java.util.Scanner;

public class LeapYear {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        System.out.println("请输入年份：");
        int year = sc.nextInt();
        
        // 闰年条件：能被4整除但不能被100整除，或者能被400整除
        if ((year % 4 == 0 && year % 100 != 0) || (year % 400 == 0)) {
            System.out.println(year + "年是闰年");
        } else {
            System.out.println(year + "年不是闰年");
        }
        
        sc.close();
    }
}
```

### 1.2 switch语句

```java
switch (表达式) {
    case 值1:
        // 如果表达式的值等于值1，执行这里的代码
        break;
    case 值2:
        // 如果表达式的值等于值2，执行这里的代码
        break;
    default:
        // 如果表达式的值不在所有case中，执行这里的代码
}
```

**注意**：switch表达式支持的类型：byte、short、int、char、String、枚举

**案例：根据月份判断季节**

```java
import java.util.Scanner;

public class SeasonDemo {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        System.out.println("请输入月份(1-12)：");
        int month = sc.nextInt();
        
        switch (month) {
            case 3:
            case 4:
            case 5:
                System.out.println("春季");
                break;
            case 6:
            case 7:
            case 8:
                System.out.println("夏季");
                break;
            case 9:
            case 10:
            case 11:
                System.out.println("秋季");
                break;
            case 12:
            case 1:
            case 2:
                System.out.println("冬季");
                break;
            default:
                System.out.println("输入的月份无效！");
        }
        
        sc.close();
    }
}
```

**穿透效应**：如果case没有break语句，会继续执行下一个case的代码。

```java
// 利用穿透效应：周一到周五输出"工作日"，周末输出"休息日"
int day = 3;
switch (day) {
    case 1:
    case 2:
    case 3:
    case 4:
    case 5:
        System.out.println("工作日");
        break;
    case 6:
    case 7:
        System.out.println("休息日");
        break;
}
```

**JDK 12+ switch表达式**（简化写法）：

```java
public class SwitchExpression {
    public static void main(String[] args) {
        int month = 6;
        
        String season = switch (month) {
            case 3, 4, 5 -> "春季";
            case 6, 7, 8 -> "夏季";
            case 9, 10, 11 -> "秋季";
            case 12, 1, 2 -> "冬季";
            default -> "无效月份";
        };
        
        System.out.println("季节：" + season);
    }
}
```

## 2. 循环结构

### 2.1 for循环

```java
for (初始化表达式; 条件表达式; 增量表达式) {
    // 循环体
}
```

**执行流程**：
1. 初始化表达式：循环开始前执行一次
2. 条件表达式：每次循环开始前判断
3. 循环体：条件为true时执行
4. 增量表达式：每次循环结束后执行

**案例：输出1-10**

```java
// 快捷键：arr.fori + enter
for (int i = 1; i <= 10; i++) {
    System.out.println(i);
}
```

**案例：倒计时**

```java
// 从10倒计时到0
for (int i = 10; i >= 0; i--) {
    System.out.println(i);
}
```

**案例：计算1-100的和**

```java
int sum = 0;
for (int i = 1; i <= 100; i++) {
    sum += i;
}
System.out.println("1-100的和：" + sum); // 5050
```

**案例：计算偶数和**

```java
int evenSum = 0;
for (int i = 1; i <= 100; i++) {
    if (i % 2 == 0) {
        evenSum += i;
    }
}
System.out.println("1-100偶数和：" + evenSum); // 2550
```

**循环嵌套**：九九乘法表

```java
// 外层循环控制行数
for (int i = 1; i <= 9; i++) {
    // 内层循环控制列数
    for (int j = 1; j <= i; j++) {
        System.out.print(i + "×" + j + "=" + (i * j) + "\t");
    }
    System.out.println(); // 换行
}
```

**输出结果**：
```
1×1=1	
2×1=2	2×2=4	
3×1=3	3×2=6	3×3=9	
...
9×1=9	9×2=18	...	9×9=81
```

### 2.2 while循环

```java
while (条件表达式) {
    // 循环体
}
```

**执行流程**：
1. 条件表达式：每次循环开始前判断
2. 循环体：条件为true时执行

**案例：计算纸张折叠次数**

```java
// 一张纸折叠多少次能超过珠峰高度(8848米)
double height = 0.1; // 纸张厚度0.1毫米
int fold = 0;

while (height < 884800) { // 转换为毫米
    height *= 2;
    fold++;
}

System.out.println("需要折叠" + fold + "次"); // 约27次
```

**案例：猜数字游戏**

```java
import java.util.Random;
import java.util.Scanner;

public class GuessNumber {
    public static void main(String[] args) {
        Random random = new Random();
        int target = random.nextInt(100) + 1; // 1-100的随机数
        
        Scanner sc = new Scanner(System.in);
        int guess;
        
        while (true) {
            System.out.println("请猜一个1-100的数字：");
            guess = sc.nextInt();
            
            if (guess == target) {
                System.out.println("恭喜你，猜对了！");
                break;
            } else if (guess < target) {
                System.out.println("太小了，再试试！");
            } else {
                System.out.println("太大了，再试试！");
            }
        }
        
        sc.close();
    }
}
```

### 2.3 do-while循环

```java
do {
    // 循环体
} while (条件表达式);
```

**特点**：至少执行一次循环体

**案例：用户登录验证**

```java
import java.util.Scanner;

public class LoginDemo {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String username;
        String password;
        
        do {
            System.out.println("请输入用户名：");
            username = sc.next();
            System.out.println("请输入密码：");
            password = sc.next();
            
            if ("admin".equals(username) && "123456".equals(password)) {
                System.out.println("登录成功！");
                break;
            } else {
                System.out.println("用户名或密码错误，请重试！");
            }
        } while (true);
        
        sc.close();
    }
}
```

**while vs do-while对比**：

```java
// while：条件不满足时一次都不执行
int count = 5;
while (count < 5) {
    System.out.println("while执行了"); // 不会执行
    count++;
}

// do-while：条件不满足时仍执行一次
int count2 = 5;
do {
    System.out.println("do-while执行了"); // 会执行一次
    count2++;
} while (count2 < 5);
```

## 3. 跳转语句

### 3.1 break语句

**作用**：跳出当前循环，继续执行循环后的代码。

**案例：查找数字**

```java
int[] numbers = {10, 20, 30, 40, 50};
int target = 30;

for (int i = 0; i < numbers.length; i++) {
    if (numbers[i] == target) {
        System.out.println("找到了" + target + "，索引位置：" + i);
        break; // 找到后跳出循环
    }
}
```

**案例：嵌套循环中的break**

```java
// 外层循环标签
outer:
for (int i = 1; i <= 3; i++) {
    for (int j = 1; j <= 3; j++) {
        if (j == 2) {
            break outer; // 跳出外层循环
        }
        System.out.print("i=" + i + ", j=" + j + "\t");
    }
    System.out.println();
}
// 输出：i=1, j=1
```

### 3.2 continue语句

**作用**：跳过当前循环中的剩余代码，继续执行下一次循环。

**案例：输出1-10中的奇数**

```java
for (int i = 1; i <= 10; i++) {
    if (i % 2 == 0) {
        continue; // 跳过偶数
    }
    System.out.println(i); // 只输出奇数：1,3,5,7,9
}
```

**案例：统计不及格人数**

```java
int[] scores = {85, 62, 78, 55, 90, 45, 70};
int failCount = 0;

for (int score : scores) {
    if (score >= 60) {
        continue; // 跳过及格的
    }
    failCount++;
}

System.out.println("不及格人数：" + failCount); // 2
```

### 3.3 return语句

**作用**：结束方法的执行，返回调用处。

```java
public class ReturnDemo {
    public static int divide(int a, int b) {
        if (b == 0) {
            System.out.println("错误：除数不能为0");
            return 0; // 提前返回
        }
        return a / b;
    }
    
    public static void main(String[] args) {
        int result = divide(10, 0);
        System.out.println("结果：" + result); // 0
    }
}
```

## 4. 综合练习

### 4.1 打印图形

```java
// 打印三角形
for (int i = 1; i <= 5; i++) {
    // 打印空格
    for (int j = 5; j > i; j--) {
        System.out.print(" ");
    }
    // 打印星号
    for (int k = 1; k <= i * 2 - 1; k++) {
        System.out.print("*");
    }
    System.out.println();
}
```

**输出**：
```
    *
   ***
  *****
 *******
*********
```

### 4.2 素数判断

```java
import java.util.Scanner;

public class PrimeNumber {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        System.out.println("请输入一个整数：");
        int num = sc.nextInt();
        
        boolean isPrime = true;
        
        if (num < 2) {
            isPrime = false;
        } else {
            for (int i = 2; i <= Math.sqrt(num); i++) {
                if (num % i == 0) {
                    isPrime = false;
                    break;
                }
            }
        }
        
        if (isPrime) {
            System.out.println(num + "是素数");
        } else {
            System.out.println(num + "不是素数");
        }
        
        sc.close();
    }
}
```

### 4.3 斐波那契数列

```java
public class Fibonacci {
    public static void main(String[] args) {
        // 打印前20个斐波那契数
        int a = 0;
        int b = 1;
        
        System.out.println("斐波那契数列前20项：");
        for (int i = 1; i <= 20; i++) {
            System.out.print(a + "\t");
            
            int temp = a;
            a = b;
            b = temp + b;
            
            if (i % 5 == 0) {
                System.out.println();
            }
        }
    }
}
```

**输出**：
```
0	1	1	2	3	
5	8	13	21	34	
55	89	144	233	377	
610	987	1597	2584	4181	
```
