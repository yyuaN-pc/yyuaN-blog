---
title: Java数组
category: java
date: 2026年7月4日
datetime: 2026-07-04T00:00:00.000Z
wordCount: 约 2000 字
readTime: 预计 10 分钟
excerpt: 学习了数组的定义与初始化、元素访问与遍历、常见异常（索引越界、空指针）、数组工具类使用，以及二维数组的基本用法。
tags: [Java, 数据结构, 后端开发]
cover: "./covers/Java.png"
---

# Java数组

## 1. 数组的定义与初始化

### 1.1 数组的定义

```java
// 方式1：数据类型[] 数组名（推荐）
int[] arr;

// 方式2：数据类型 数组名[]
int arr[];
```

### 1.2 静态初始化

**完整写法**：

```java
int[] arr = new int[]{1, 2, 3, 4, 5};
```

**简写方式**：

```java
int[] arr = {1, 2, 3, 4, 5};
```

**其他类型示例**：

```java
// 字符串数组
String[] names = {"张三", "李四", "王五"};

// 字符数组
char[] chars = {'a', 'b', 'c'};

// 布尔数组
boolean[] flags = {true, false, true};
```

### 1.3 动态初始化

```java
// 指定数组长度，自动初始化为默认值
int[] arr = new int[5];
```

**默认值规则**：

| 数据类型 | 默认值 |
| :---: | :---: |
| byte/short/int/long | 0 |
| float/double | 0.0 |
| char | '\u0000'（空字符） |
| boolean | false |
| 引用类型 | null |

```java
public class DefaultValues {
    public static void main(String[] args) {
        int[] intArr = new int[3];
        System.out.println(intArr[0]); // 0
        
        double[] doubleArr = new double[3];
        System.out.println(doubleArr[0]); // 0.0
        
        boolean[] boolArr = new boolean[3];
        System.out.println(boolArr[0]); // false
        
        String[] strArr = new String[3];
        System.out.println(strArr[0]); // null
    }
}
```

### 1.4 数组长度

```java
int[] arr = {10, 20, 30, 40, 50};
System.out.println("数组长度：" + arr.length); // 5
```

**注意**：数组长度一旦确定，不可改变。

## 2. 数组的访问与遍历

### 2.1 元素访问

```java
int[] arr = {1, 2, 3, 4, 5};

// 获取元素
int element = arr[0]; // 1
System.out.println(element);

// 修改元素
arr[0] = 100;
System.out.println(arr[0]); // 100
```

### 2.2 数组遍历

**方式1：普通for循环**

```java
int[] arr = {10, 20, 30, 40, 50};

for (int i = 0; i < arr.length; i++) {
    System.out.println(arr[i]);
}
```

**方式2：增强for循环（for-each）**

```java
int[] arr = {10, 20, 30, 40, 50};

for (int num : arr) {
    System.out.println(num);
}
```

**方式3：数组转字符串输出**

```java
import java.util.Arrays;

int[] arr = {10, 20, 30, 40, 50};
System.out.println(Arrays.toString(arr)); // [10, 20, 30, 40, 50]
```

### 2.3 遍历练习

```java
public class ArrayTraversal {
    public static void main(String[] args) {
        String[] fruits = {"苹果", "香蕉", "橙子", "葡萄", "西瓜"};
        
        // 正向遍历
        System.out.println("正向遍历：");
        for (int i = 0; i < fruits.length; i++) {
            System.out.println("索引[" + i + "]：" + fruits[i]);
        }
        
        // 反向遍历
        System.out.println("\n反向遍历：");
        for (int i = fruits.length - 1; i >= 0; i--) {
            System.out.println("索引[" + i + "]：" + fruits[i]);
        }
        
        // 增强for循环
        System.out.println("\n增强for循环：");
        for (String fruit : fruits) {
            System.out.println(fruit);
        }
    }
}
```

## 3. 数组的常见操作

### 3.1 数组求和

```java
public class ArraySum {
    public static void main(String[] args) {
        int[] numbers = {1, 2, 3, 4, 5, 6, 7, 8, 9, 10};
        
        int sum = 0;
        for (int num : numbers) {
            sum += num;
        }
        
        System.out.println("数组元素之和：" + sum); // 55
    }
}
```

### 3.2 数组求最大值

```java
public class ArrayMax {
    public static void main(String[] args) {
        int[] numbers = {10, 35, 20, 50, 15};
        
        int max = numbers[0];
        for (int i = 1; i < numbers.length; i++) {
            if (numbers[i] > max) {
                max = numbers[i];
            }
        }
        
        System.out.println("数组最大值：" + max); // 50
    }
}
```

### 3.3 数组求最小值

```java
public class ArrayMin {
    public static void main(String[] args) {
        int[] numbers = {10, 35, 20, 50, 15};
        
        int min = numbers[0];
        for (int i = 1; i < numbers.length; i++) {
            if (numbers[i] < min) {
                min = numbers[i];
            }
        }
        
        System.out.println("数组最小值：" + min); // 10
    }
}
```

### 3.4 数组查找元素

**线性查找**：

```java
public class LinearSearch {
    public static void main(String[] args) {
        int[] numbers = {10, 20, 30, 40, 50};
        int target = 30;
        
        int index = -1;
        for (int i = 0; i < numbers.length; i++) {
            if (numbers[i] == target) {
                index = i;
                break;
            }
        }
        
        if (index != -1) {
            System.out.println("找到了" + target + "，索引位置：" + index);
        } else {
            System.out.println("未找到" + target);
        }
    }
}
```

**二分查找**（数组必须有序）：

```java
public class BinarySearch {
    public static void main(String[] args) {
        int[] numbers = {10, 20, 30, 40, 50, 60, 70};
        int target = 40;
        
        int left = 0;
        int right = numbers.length - 1;
        int index = -1;
        
        while (left <= right) {
            int mid = (left + right) / 2;
            if (numbers[mid] == target) {
                index = mid;
                break;
            } else if (numbers[mid] < target) {
                left = mid + 1;
            } else {
                right = mid - 1;
            }
        }
        
        if (index != -1) {
            System.out.println("找到了" + target + "，索引位置：" + index);
        } else {
            System.out.println("未找到" + target);
        }
    }
}
```

### 3.5 数组排序

**冒泡排序**：

```java
public class BubbleSort {
    public static void main(String[] args) {
        int[] arr = {34, 7, 23, 32, 5, 62};
        
        // 外层循环：控制排序轮数
        for (int i = 0; i < arr.length - 1; i++) {
            // 内层循环：每轮比较次数递减
            for (int j = 0; j < arr.length - 1 - i; j++) {
                if (arr[j] > arr[j + 1]) {
                    // 交换位置
                    int temp = arr[j];
                    arr[j] = arr[j + 1];
                    arr[j + 1] = temp;
                }
            }
        }
        
        System.out.println("排序后：" + Arrays.toString(arr));
        // [5, 7, 23, 32, 34, 62]
    }
}
```

**选择排序**：

```java
public class SelectionSort {
    public static void main(String[] args) {
        int[] arr = {34, 7, 23, 32, 5, 62};
        
        for (int i = 0; i < arr.length - 1; i++) {
            int minIndex = i;
            
            // 找到最小值的索引
            for (int j = i + 1; j < arr.length; j++) {
                if (arr[j] < arr[minIndex]) {
                    minIndex = j;
                }
            }
            
            // 交换
            int temp = arr[i];
            arr[i] = arr[minIndex];
            arr[minIndex] = temp;
        }
        
        System.out.println("排序后：" + Arrays.toString(arr));
        // [5, 7, 23, 32, 34, 62]
    }
}
```

**使用Arrays工具类排序**：

```java
import java.util.Arrays;

public class ArraysSort {
    public static void main(String[] args) {
        int[] arr = {34, 7, 23, 32, 5, 62};
        
        Arrays.sort(arr);
        
        System.out.println("排序后：" + Arrays.toString(arr));
        // [5, 7, 23, 32, 34, 62]
    }
}
```

### 3.6 数组反转

```java
public class ArrayReverse {
    public static void main(String[] args) {
        int[] arr = {1, 2, 3, 4, 5};
        
        // 使用双指针法
        int left = 0;
        int right = arr.length - 1;
        
        while (left < right) {
            int temp = arr[left];
            arr[left] = arr[right];
            arr[right] = temp;
            left++;
            right--;
        }
        
        System.out.println("反转后：" + Arrays.toString(arr));
        // [5, 4, 3, 2, 1]
    }
}
```

### 3.7 数组复制

```java
import java.util.Arrays;

public class ArrayCopy {
    public static void main(String[] args) {
        int[] arr1 = {1, 2, 3, 4, 5};
        
        // 方式1：Arrays.copyOf
        int[] arr2 = Arrays.copyOf(arr1, arr1.length);
        System.out.println("arr2: " + Arrays.toString(arr2));
        
        // 方式2：System.arraycopy
        int[] arr3 = new int[arr1.length];
        System.arraycopy(arr1, 0, arr3, 0, arr1.length);
        System.out.println("arr3: " + Arrays.toString(arr3));
        
        // 方式3：手动复制
        int[] arr4 = new int[arr1.length];
        for (int i = 0; i < arr1.length; i++) {
            arr4[i] = arr1[i];
        }
        System.out.println("arr4: " + Arrays.toString(arr4));
    }
}
```

## 4. 数组的常见异常

### 4.1 数组索引越界异常

```java
int[] arr = {1, 2, 3, 4, 5};

// 错误：索引范围是0-4
int element = arr[5]; // ArrayIndexOutOfBoundsException
```

**原因**：访问了不存在的索引位置。

**预防**：确保索引在 `0` 到 `arr.length - 1` 之间。

### 4.2 空指针异常

```java
int[] arr = null;

// 错误：数组为null，无法访问元素
int element = arr[0]; // NullPointerException
```

**原因**：数组引用指向了 `null`，但尝试访问其元素。

**预防**：使用前先判断数组是否为 `null`。

```java
if (arr != null && arr.length > 0) {
    int element = arr[0];
}
```

## 5. 二维数组

### 5.1 二维数组的定义

```java
// 方式1：数据类型[][] 数组名
int[][] arr;

// 方式2：数据类型 数组名[][]
int arr[][];

// 方式3：数据类型[] 数组名[]
int[] arr[];
```

### 5.2 二维数组的初始化

**静态初始化**：

```java
int[][] arr = {
    {1, 2, 3},
    {4, 5, 6},
    {7, 8, 9}
};
```

**动态初始化**：

```java
// 方式1：指定行数和列数
int[][] arr = new int[3][3];

// 方式2：只指定行数，列数动态分配
int[][] arr = new int[3][];
arr[0] = new int[2];
arr[1] = new int[3];
arr[2] = new int[4];
```

### 5.3 二维数组的遍历

**方式1：嵌套for循环**

```java
int[][] arr = {
    {1, 2, 3},
    {4, 5, 6},
    {7, 8, 9}
};

// 外层循环：遍历行
for (int i = 0; i < arr.length; i++) {
    // 内层循环：遍历列
    for (int j = 0; j < arr[i].length; j++) {
        System.out.print(arr[i][j] + "\t");
    }
    System.out.println();
}
```

**方式2：增强for循环**

```java
for (int[] row : arr) {
    for (int num : row) {
        System.out.print(num + "\t");
    }
    System.out.println();
}
```

### 5.4 二维数组练习

**案例：矩阵求和**

```java
public class MatrixSum {
    public static void main(String[] args) {
        int[][] matrix = {
            {1, 2, 3},
            {4, 5, 6},
            {7, 8, 9}
        };
        
        int sum = 0;
        for (int[] row : matrix) {
            for (int num : row) {
                sum += num;
            }
        }
        
        System.out.println("矩阵元素之和：" + sum); // 45
    }
}
```

**案例：求对角线元素之和**

```java
public class DiagonalSum {
    public static void main(String[] args) {
        int[][] matrix = {
            {1, 2, 3},
            {4, 5, 6},
            {7, 8, 9}
        };
        
        int sum = 0;
        for (int i = 0; i < matrix.length; i++) {
            sum += matrix[i][i]; // 主对角线
        }
        
        System.out.println("主对角线元素之和：" + sum); // 15
    }
}
```

### 5.5 不规则二维数组

```java
public class JaggedArray {
    public static void main(String[] args) {
        // 创建不规则二维数组
        int[][] arr = new int[3][];
        arr[0] = new int[]{1, 2};
        arr[1] = new int[]{3, 4, 5};
        arr[2] = new int[]{6, 7, 8, 9};
        
        // 遍历
        for (int i = 0; i < arr.length; i++) {
            System.out.print("第" + (i + 1) + "行(" + arr[i].length + "列): ");
            for (int j = 0; j < arr[i].length; j++) {
                System.out.print(arr[i][j] + " ");
            }
            System.out.println();
        }
    }
}
```

**输出**：
```
第1行(2列): 1 2 
第2行(3列): 3 4 5 
第3行(4列): 6 7 8 9 
```

## 6. Arrays工具类常用方法

| 方法 | 功能 |
| :---: | :---: |
| `Arrays.toString(arr)` | 将数组转换为字符串 |
| `Arrays.sort(arr)` | 对数组进行排序 |
| `Arrays.copyOf(arr, length)` | 复制数组 |
| `Arrays.fill(arr, value)` | 用指定值填充数组 |
| `Arrays.equals(arr1, arr2)` | 比较两个数组是否相等 |
| `Arrays.binarySearch(arr, key)` | 二分查找（数组必须有序） |

```java
import java.util.Arrays;

public class ArraysMethods {
    public static void main(String[] args) {
        int[] arr1 = {3, 1, 4, 1, 5, 9};
        int[] arr2 = {3, 1, 4, 1, 5, 9};
        
        // toString
        System.out.println("toString: " + Arrays.toString(arr1));
        
        // sort
        Arrays.sort(arr1);
        System.out.println("sort后: " + Arrays.toString(arr1));
        
        // equals
        System.out.println("equals: " + Arrays.equals(arr1, arr2));
        
        // fill
        int[] arr3 = new int[5];
        Arrays.fill(arr3, 10);
        System.out.println("fill后: " + Arrays.toString(arr3));
        
        // binarySearch
        int index = Arrays.binarySearch(arr1, 5);
        System.out.println("binarySearch(5): " + index);
    }
}
```
