---
title: Java中equals与==用法
tags: Java基础
categories: Java
abbrlink: f8b67ba9
date: 2020-08-03 21:39:02
---

有两种用法说明:

一、对于字符串变量来说，使用“==”和“equals()”方法比较字符串时，其比较方法不同。

1. `==`比较两个变量本身的值，**即两个对象在内存中的地址**。

   (java中，对象的首地址是它在内存中存放的起始地址，它后面的地址是用来存放它所包含的各个属性的地址，所以内存中会用多个内存块来存放对象的各个参数，而通过这个首地址就可以找到该对象，进而可以找到该对象的各个属性)

2. `equals()`比较字符串中所包含的内容是否相同。

<!--more-->

## 一、==

`==`比较两个变量本身的值，**即两个对象在内存中的地址**。（java中，对象的首地址是它在内存中存放的起始地址，它后面的地址是用来存放它所包含的各个属性的地址，所以内存中会用多个内存块来存放对象的各个参数，而通过这个首地址就可以找到该对象，进而可以找到该对象的各个属性)

上面说到==比较的是对象的内存地址，然鹅下面这个示例：

```java
public static void main(String[] args){
        int a = 100;
        int b = 100;
        System.out.println(a == b);

        String s1 = "123";
        String s2 = "123";
        System.out.println(s1 == s2);

        String s3 = new String("123");
        System.out.println(s1 == s3);
    }
```

<img src="https://leslie1-1309334886.cos.ap-shanghai.myqcloud.com/obsidian/image-20230424215830342.png" alt="image-20230424215830342" style="zoom:80%;" />

为什么会出现这样的情况？

对于基本数据类型（byte，short，char，int，float，double，long，boolean）来说，他们是作为常量在方法区中的常量池里面以HashSet策略存储起来的。

因此我们写下`String s1 = "123"` 时，JVM会去常量池里找，不存在就创建一个新对象；而`String s2 = "123"`也是一样，在常量池里找到了`"123"`，就直接将s2指向之前的对象`“123”`（一个常量只会对应一块内存地址），所以此时用`==`判断的话返回是true

另外，对于基本数据的包装类型（Byte, Short, Character，Integer，Float, Double，Long,  Boolean）除了Float和Double之外，其他的六种都是实现了常量池的，因此对于这些数据类型而言，一般我们也可以直接通过==来判断是否相等。

那么下面这个示例：输出的为啥是true   false 呢？

```java
Integer i1 = 127;
Integer i2 = 127;
System.out.println(i1 == i2);//true
Integer m = 128;
Integer n = 128;
System.out.println(m == n);//false
```

因为 Integer 在常量池中的存储范围为[-128,127]，127在这范围内，因此是直接存储于常量池的，而128不在这范围内，所以会在堆内存中创建一个新的对象来保存这个值，所以m，n分别指向了两个不同的对象地址，故而导致了不相等。



## 二、equals

看看Java核心技术中关于equals的解释：

Object类中的equals方法用于检测一个对象是否等于另外一个对象。在Object类中，这个方法用于判断两个对象是否具有相同的引用，如果有相同的引用那么一定相等。（然鹅对于多数类这种判断没啥意义）

Object中原生的equals方法必须满足两个对象的内容地址都一直才会返回true，同时由于Object类中原生的hashCode是参照对象地址和内容根据一定算法产生的，因此他们的hashCode也是相等的

一般继承的类中都会重写equals方法。以String中重写的equals为例：先判断是不是相同地址，调整类型，再比较内容，内容长度一致就逐个比较char内容。同样String类也重写了hashCode方法，使得只要内容相等返回的hashCode也会相同

```java
/**
 *Object类中equals的实现
 */
    public boolean equals(Object obj) {
        return (this == obj);
    }

/**
 *String类中的equals的实现
 *简单翻译下
 *将此字符串与指定对象进行比较。
 *当且仅当参数不是null且是一个String对象，表示与此对象相同的字符序列时，结果为true。
 * @参数  一个对象
 *         与这个String做对比的一个对象
 *
 * @返回  该对象是String且与要比较的String相同，返回true，否则false
 *
 * @see  #compareTo(String)
 * @see  #equalsIgnoreCase(String)
 */
public boolean equals(Object anObject) {
    if (this == anObject) {
        return true;
    }
    if (anObject instanceof String) {
        String anotherString = (String)anObject;
        int n = value.length;
        if (n == anotherString.value.length) {
            char v1[] = value;
            char v2[] = anotherString.value;
            int i = 0;
            while (n-- != 0) {
                if (v1[i] != v2[i])
                    return false;
                i++;
            }
            return true;
        }
    }
    return false;
}
```

还是上面的示例：equals比较的内容，所以就是true

```java
public static void main(String[] args){
        String s1 = "123";
        String s2 = "123";
    	String s3 = new String("123");
        System.out.println(s1 == s2);	//false
        System.out.println(s1.equals(s3);//true
    }
```

注意：

```
 StringBuffer s1 = new StringBuffer("a");
 StringBuffer s2 = new StringBuffer("a");
 System.out.println("s1.equals(s2):"+(s1.equals(s2)));//结果为false
```

解释：<u>StringBuffer类中没有重写equals方法，因此这个方法就来自Object类</u>， (Object类中的equals方法是用来比较“地址”的，所以等于false）



## 总结

对于非字符串变量来说，"=="和"equals"方法的作用是相同的都是用来比较其，对象在堆内存的首地址，即用来比较两个引用变量是否指向同一个对象。

```java
class A
{
      A obj1   =   new  A();
      A obj2   =   new  A();
}
     obj1==obj2　　//结果为false
     obj1.equals(obj2)//是false
　　　//但是如加上这样一句：
　　　obj1=obj2;　　
　　　//执行后
　　　obj1==obj2  //是true
     obj1.equals(obj2) //是true
```



1. 如果是基本类型比较，那么只能用==来比较，不能用equals 

2. 对于基本类型的包装类型，比如Boolean、Character、Byte、Shot、Integer、Long、Float、Double等的引用变量，==是比较地址的，而equals是比较内容的。

3. 对于下面的示例

   ```java
   class Value { 
   	int i; 
   } 
   public class EqualsMethod2 { 
   	public static void main(String[] args) { 
   		Value v1 = new Value(); 
   		Value v2 = new Value(); 
   		v1.i = v2.i = 100; 
   		System.out.println(v1.equals(v2));//（1）flase 
   		System.out.println(v1 == v2);//（2）false
   	} 
   } 
   ```

   如果在新类中被覆盖了equals方法，就可以用来比较内容的。但是在上面的例子中类Value并没有覆盖Object中的equals方法，而是继承了该方法，因此它就是被用来比较地址的，又v1和v2的所指向的对象不相同，故标记（1）处的v1.equals(v2)运行结果为false，标记为（2）处的v1 == v2运行结果也为false。 

4. 对于String(字符串)、StringBuffer(线程安全的可变字符序列)、StringBuilder(可变字符序列)这三个类可以看博客[Java字符串]([http://salute61.top/2020/08/03/Java%E5%AD%97%E7%AC%A6%E4%B8%B2/](http://salute61.top/2020/08/03/Java字符串/))；





## 【参考】

- Java核心技术 Object—equals

- [java中equals以及==的用法(简单介绍)](https://www.cnblogs.com/weibanggang/p/9457757.html)
- [在java中==和equals()的区别](https://blog.csdn.net/lcsy000/article/details/82782864)

























































