---
title: Java字符串
tags: Java基础
categories: Java
abbrlink: 96b89c5
date: 2020-08-03 22:40:46
---

Java中的字符串处理，主要涉及三个类：<font color="red">**String、StringBuffer、StringBuilder**</font>

三者共同之处：都是final类，不允许被继承。

StringBuffer是线程安全，可以不需要额外的同步用于多线程中;

StringBuilder是非同步,运行于多线程中就需要使用着单独同步处理，但是速度就比StringBuffer快多了;

StringBuffer与StringBuilder两者共同之处:可以通过append、insert进行字符串的操作。

String实现了三个接口:Serializable、Comparable < String >、CharSequence

StringBuilder只实现了两个接口Serializable、CharSequence，相比之下String的实例可以通过compareTo方法进行比较，其他两个不可以。

![](https://leslie1-1309334886.cos.ap-shanghai.myqcloud.com/obsidian/Java_String.png)

<!--more-->

## 一、String简介

String是一个字符串常量，一般由String声明的字符串，长度是不可变的，这也是它与StringBuffer和StringBuilder最直观的一个区别。

一般初始化方式：`String s = "hello world";` 经过这条语句，JVM的栈内存中产生一个s变量，堆内存中产生hello world字符串对象。s指向了hello world的地址。像上面这种方式产生的字符串属于直接量字符串对象，JVM在处理这类字符串的时候，会进行缓存，产生时放入字符串池，当程序需要再次使用的时候，无需重新创建一个新的字符串，而是直接指向已存在的字符串。

```java
String s = "hello world";
String s2 = "hello world";
System.out.println(s == s2);//返回为true
```



```java
String str = "I am";
System.out.println(str);
str = str + " Salute61~";
System.out.println(str);
//I am
//I am Salute61~
```

String不是常量吗？可是输出好像显示str对象被更改了，其实这是一种假象，JVM对上面代码的操作流程是：

- 创建String对象str，并把 "I am"赋值给str
- 而`str = str + " Salute61~";`处，JVM又创建了一个新的对象str，将原str的值加上 " Salute61~"赋值给新的str，原str被JVM的垃圾回收机制给回收了！

所以对String对象操作实际上是不断创建新的对象并将旧的回收的过程！因此String的执行速度比较慢



### String常用方法

#### 1 length方法

public int length()：该方法用于获取字符串的长度

```java
/**
     * Returns the length of this string.
     * The length is equal to the number of <a href="Character.html#unicode">Unicode
     * code units</a> in the string.
     *
     * @return  the length of the sequence of characters represented by this
     *          object.
     */
    public int length() {
        return count;
    }
```

这是JDK种的原始实现，count在String类里被定义为一个整型常量：private final int count;并且不论采用哪种构造方法，最终都会为count赋值。

#### 2 equals方法

public boolean equals(Object anObject)：该方法用于比较给定对象是否与String相等。

在equals博客中有提到，继承了Object类的equals并重写了该方法

（由源码可知String的底层是基于字符数组的）

Java核心技术中提到equals的一些特性：

1）自反性：非空引用x，x.equals(x)应该返回true

2）对称性：任意引用x、y。y.equals(x)为true时x.equals(y)也应为true

3）传递性：：任意引用x、y、z。有x.equals(y)、y.equals(z)为true时，则有x.equals(z)为true

4）一致性：x、y引用的对象未发生变化，那么x.equals(y)应该返回同样的结果

**重写equals的步骤：**

1. 使用==操作符检查“实参是否为指向对象的一个引用”。
2. 使用instanceof操作符检查“实参是否为正确的类型”。
3. 把实参转换到正确的类型。
4. 对于该类中每一个“关键”域，检查实参中的域与当前对象中对应的域值是否匹配。
   - 对于既不是float也不是double类型的基本类型的域，可以使用==操作符进行比较
   - 对于对象引用类型的域，可以递归地调用所引用的对象的equals方法 
   - 对于float类型的域，先使用Float.floatToIntBits转换成int类型的值，然后使用==操作符比较int类型的值
   - 对于double类型的域，先使用Double.doubleToLongBits转换成long类型的值，然后使用==操作符比较long类型的值。
5. 当你编写完成了equals方法之后，应该检查重写的equals方法：它是否是对称的、传递的、一致的？(其他两个特性通常会自行满足)  如果答案是否定的，那么请找到这些特性未能满足的原因，再修改equals方法的代码。



#### 3 CompareTo方法

因为String类实现了public interface Comparable < T > ，而Comparable接口里有唯一的方法：public int compareTo(T o)。所以，String类还有另一个字符串比较方法：compareTo()

比较的方法就是选择长度较小的，左边对齐，while循环逐个比较，返回首个出现不同的字符的ASCII码值，没有就返回长度差值

```java
    public int compareTo(String anotherString) {
        int len1 = value.length;
        int len2 = anotherString.value.length;
        int lim = Math.min(len1, len2);
        char v1[] = value;
        char v2[] = anotherString.value;

        int k = 0;
        while (k < lim) {
            char c1 = v1[k];
            char c2 = v2[k];
            if (c1 != c2) {
                return c1 - c2;
            }
            k++;
        }
        return len1 - len2;
    }
```



#### 4 spilt方法

public String[] split(String regex)：该方法用于分割字符串，得到一个String类型的数组，根据regex可知，参数是个正则表达式。

```java
package com.xtfggef.string;
 
public class SpiltTest {
 
	public static void main(String[] args) {
		String s = "hello world";
		String s1 = "hello.worldd";
		String[] s2 = s.split(" ");
		String[] s3 = s1.split("\\.");
		for(int i=0; i<s2.length; i++){
			System.out.print(s2[i]+" ");//hello world
		}
		System.out.println();
		for(int j=0; j<s3.length; j++){
			System.out.print(s3[j]+" ");//hello worldd
		}
	}
}
```

spilt()需要注意的事项，就是当分隔符为 . 的话，处理起来不一样，必须写成\\.因为.是正则表达式里的一个特殊符号，必须进行转义



## 二、StringBuilder和StringBuffer

StringBuilder和StringBuffer成为可变字符串类，可以理解为字符串变量，因此创建后可更改，速度比String快很多！

观察其源码发现，使用`StringBuffer()`时，默认开辟16个字符的长度的空间，使用`public StringBuffer(int paramInt)`时开辟指定大小的空间，使用`public StringBuffer(String paramString)`时，开辟`paramString.length+16`大小的空间。都是调用父类的构造器super()来开辟内存。这方面StringBuffer和StringBuilder都一样，且都实现AbstractStringBuilder类。

### 主要方法

二者几乎没什么区别，基本都是在调用父类的各个方法，**一个重要的区别就是StringBuffer是线程安全的**，内部的大多数方法前面都有关键字synchronized，这样就会有一定的性能消耗，StringBuilder是非线程安全的，所以效率要高些。

以StringBuffer为例分析一下它们的方法

#### 1 append()

append()：就是在原来的字符串后面直接追加一个新的串，和String类相比有明显的好处——String类在追加的时候，源字符串不变（这就是为什么说String是不可变的字符串类型），和新串连接后，重新开辟一个内存。这样就会造成每次连接一个新串后，都会让之前的串报废，因此也造成了不可避免的内存泄露。

#### 2 trimToSize()

public synchronized void trimToSize()：该方法用于将多余的缓冲区空间释放出来。

```java
StringBuffer sb = new StringBuffer("hello erqing");
System.out.println("length:"+sb.length());//length:12
System.out.println("capacity:"+sb.capacity());//capacity:28
sb.trimToSize();
System.out.println("trimTosize:"+sb.capacity());//trimTosize:12
```



注：在equals那篇博客中提到过，StringBuffer没有重写equals方法，因此时直接继承的Object的方法

```java
StringBuffer sb = new StringBuffer("hello");
StringBuffer sb2 = new StringBuffer("hello");
System.out.println(sb.equals(sb2));//false
```



## 【参考】

- [Java之美[从菜鸟到高手演变]之字符串](https://blog.csdn.net/zhangerqing/article/details/8093919)
- [java中String、StringBuffer和StringBuilder的区别(简单介绍)](https://www.cnblogs.com/weibanggang/p/9455926.html)





