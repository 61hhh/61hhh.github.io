---
title: Java自动装拆箱
tags: Java基础
categories: Java
abbrlink: d443007a
date: 2020-11-09 15:46:42
---

今天面试，面试官很照顾我，问的都是基础，结果我一直拉跨。。。之前学的时候记过笔记的知识都忘，重要的基础知识细节记不清、自动装拆箱不了解。。。

> 学而时习之啊

<!--more-->

## 1、基本数据类型

当时回顾就看了一眼，8中基本数据类型，结果问到存储格式和包装类型就懵逼。。。

Java有四种八类基本数据类型，除此之外其他的都是对象即引用类型。JDK1.5后为基本数据类型引入了对应的包装类

**1.1 基本数据类型可以分为：**

- 整数类型：byte、short、int、long
- 浮点数型：float、double
- 字符类型：char
- 布尔类型：boolean

【注】Java中数据类型不存在无符号的，即他们的取值范围是固定的



**1.2 为什么int的范围是[-2,147,483,648 , 2,147,483,647]？**

先说一个字节`byte`的范围：一个字节8位，最高位表示正负号，所以实际是**[10000000，01111111]**。即**[-2<sup>^</sup>7，2<sup>^</sup>7-1]**

`int`：是4字节32位，然后最高位0、1表示正负号，所以实际是31位数据，即**[-2<sup>^31</sup>，2<sup>^31</sup>-1]**。所以得到的结果是**[-2,147,483,648 , 2,147,483,647]**。同理其他的数据类型也是



**1.3 基本数据类型的作用**：

在Java中new的对象是存储在堆中的，我们使用都是通过栈中的引用来操作，对于这种常用的数据类型还要每个都去new就很麻烦且浪费资源，所以Java和C++一样提供这些基本数据类型，它们的变量不会在堆上创建，而是直接在栈内存中存储，因此更加高效。



## 2、包装类型

| 数据类型 | 默认值         | 存储格式 | 数据范围                                                     | 包装类型  |
| -------- | -------------- | -------- | ------------------------------------------------------------ | --------- |
| short    | 0              | 2 个字节 | -32,768 到 32,767                                            | Short     |
| int      | 0              | 4 个字节 | -2,147,483,648 到 2,147,483,647                              | Integer   |
| byte     | 0              | 1 个字节 | -128 到 127                                                  | Byte      |
| char     | 空             | 2 个字节 | Unicode 的字符范围：`\u0000`（即为 0）到 `\uffff`（即为 65,535） | Character |
| long     | 0L 或 0l       | 8 个字节 | -9,223,372,036,854,775,808 到 9,223,372,036,854,775,807      | Long      |
| float    | 0.0F 或 0.0f   | 4 个字节 | 32 位 IEEEE-754 单精度范围                                   | Float     |
| double   | 0.0 或 0.0D(d) | 8 个字节 | 64 位 IEEE-754 双精度范围                                    | Double    |
| boolean  | false          | 1 位     | true 或 false                                                | Boolean   |

**2.1 自动拆箱与装箱**

简单说，装箱就是自动将基本数据类型转化为对应的包装类，拆箱就是自动将包装类转化为基本数据类型。

**2.2为什么要这样做**

- 因为Java是面向对象语言，很多地方都需要使用对象而不是基本数据类型。比如，在集合类中，我们是无法将int 、double等类型放进去的。因为集合的容器要求元素是Object类型。
- 为泛型提供支持。因为泛型默认是Object类型
- 更多的属性和方法。让基本类型有了对象的特性，为其添加属性和方法，丰富了基本类型的操作

**2.3 实现原理**

编写代码如下：

```java
public class autoboxing {
    public static void main(String[] args) {
        Integer totalPac = 100;
        int totalNum = totalPac;
    }
}
```

编译之后，用指令`javap -c autoboxing`反编译字节码文件得到如下代码：

![image-20201109174638916](http://img2.salute61.top/PicGo/image-20201109174638916.png)

在执行上面的代码时，系统实际执行的操作：

```java
Integer totalPac = 100;
//对应👇
Integer totalPac = Integer.valueOf(100);

int totalNum = totalPac;
//对应👇
int totalNum = totalPac.intValue();
```

> 自动装箱采用的都是valueOf()方法实现，拆箱都是通过包装类对象的对应xxValue()方法实现
>
> 当然不同包装类的方法会有所不同，其中Integer、Short、Byte、Character、Long这几个类的valueOf方法的实现是类似的；Double、Float的valueOf方法的实现是直接返回新建对象。



- 查看`valueOf`源码

  源码如下：

  ```java
  public static Integer valueOf(int i) {
      if (i >= IntegerCache.low && i <= IntegerCache.high)
          return IntegerCache.cache[i + (-IntegerCache.low)];
      return new Integer(i);
  }
  
  
  ```

  可以把low和high理解为Integer的边界：如果`i`大于127或小于-128就创建一个Integer对象返回；否则就执行`cache[i+ (-IntegerCache.low)]`；`cache`是`IntegerCache`类的一个Integer类型final数组对象，即`valueOf()`返回的都是Integer对象。所以装箱会创建对应的对象，消耗内存。cache用于缓存。

- 再看`intValue`源码

  就是返回Integer对象的value属性值。【`Integer`对象有属性：`private final int value;`】

  ```java
  public int intValue() {
      return value;
  }
  ```

- **cache缓存**

  当需要进行自动装箱时，创建对象之前先从`IntegerCache.cache`中寻找，如果数字在-128至127之间时，会直接使用缓存中的对象，而不是重新创建一个对象。如果没找到才使用new新建对象。

  所以如下代码：

  ```java
  Integer num1 = 100;
  Integer num2 = 100;
  System.out.println(num1==num2);//true
  Integer num3 = 500;
  Integer num4 = 500;
  System.out.println(num3==num4);//false
  ```

  具体代码实现可以看源码`IntegerCache`部分



## 3、拆装箱的应用场景

- **<1>数据类型的比较**

  ```java
  Integer num = 100;
  System.out.println(num==100? "yes!":"no!");
  ```

  实际上比较的是`num.valueOf()`

- **<2>集合类保存基本数据类型**

  在Java中集合类只能接收对象类型，但是我们总是直接往ArrayList中直接add整数，因为系统已经自动为我们转换了

  ```java
  public class autoboxing {
      public static void main(String[] args) {
          ArrayList<Integer> list = new ArrayList<>();
          for(int i=0;i<5;++i){
              list.add(i);
          }
      }
  }
  ```

  ![image-20201109180630089](http://img2.salute61.top/PicGo/image-20201109180630089.png)

- **<3>包装类的运算**

  对于包装类，比如：

  ```java
  Integer num1 = 10;
  Integer num2 = 15;
  System.out.println(num1+num2);
  ```

  Integer对象是不能直接运算的，但是这样运行也可以，因为默认会变成`num1.intValue() + num2.intValue()`

