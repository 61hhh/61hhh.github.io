---
title: Java集合（一）概述
tags: Java基础
categories: Java
abbrlink: 95f49cfb
date: 2020-08-02 22:13:24
---

## 一、什么是集合

关于Java集合框架的维基百科定义如下：

> **Java集合框架**(**Java collections framework**)是一个包含一系列实作可重复使用集合的[数据结构](https://zh.m.wikipedia.org/wiki/資料結構)的[类别](https://zh.m.wikipedia.org/wiki/類別_(電腦科學))和[界面](https://zh.m.wikipedia.org/wiki/介面_(程式設計))集合。 虽然称为“框架”，其使用方式却像个[函式库](https://zh.m.wikipedia.org/wiki/函式庫)。集合框架提供了定义各式各样集合的界面和实作上述集合的类别。

<!--more-->

Java中集合是一个用于存放对象引用的容器，在开发时我们不能确定对象的数量也不能确定它们的类型，因此在存放上就不能用存放同一类型数据的数组，Java为解决这一问题，开发了集合

以下是集合和数组的区别：

1. 数组和集合都是Java中的容器。

2. 数组长度固定，且只能存放相同类型数据；而集合不限数量，不同类型的数据。

3. 数组只能存放的相同类型数据，可以实基本数据类型也可以是引用类型。

4. 集合只能存放对象。比如要存int类型，是转换为了Integer类后存入的。即会将基本数据类型转换为对应的引用类型存入

   ```java
   List<int> intList = new ArrayList<int>();//此处会报错：类型参数不能是原始数据
   List<Integer> intList = new ArrayList<Integer>();//改为对应的包装类即可
   ```

5. 集合存放的都是对象的引用，而非对象本身。所以我们称集合中的对象就是集合中对象的引用。对象本身还是放在堆内存中。

相应的Java原始类型(基本数据类型)与其对应的包装类：

| 原始类型(基本数据类型) | 包装类    |
| ---------------------- | --------- |
| byte                   | Byte      |
| short                  | Short     |
| int                    | Integer   |
| long                   | Long      |
| float                  | Float     |
| double                 | Double    |
| char                   | Character |
| boolean                | Boolean   |



#### 集合的接口与实现分离

与常见的数据结构类库一样，**Java中集合类库也将接口与实现分离**。以*队列(queue)*为例

*队列接口*指出可以在队列尾部添加元素，在首部删除元素，并可以查找元素个数，当需要手机对象，并按照”先进先出“规则检索对象时就应该使用队列。

```java
public interface Queue<E>{
    void add(E element);
    E remove();
    int size();
}
```

这个接口并没有说明队列是如何实现的。通常有两种实现：一是循环数组；一是链表

当在程序中使用队列时，一旦构建了集合就不需要知道究竟使用了那种实现方法。因此只有在构建集合对象时使用具体的类才有意义，可以使用接口类型存放集合的引用

```java
Queue<Customer> expressLane = new CircularArrayQueue<>(100);
expressLane.add(new Customer("Harry"));
```

利用这种方式，可以轻松修改实现，即修改调用构造器的部位即可

```java
Queue<Customer> expressLane = new LinkedListQueue<>(100);
expressLane.add(new Customer("Harry"));
```



## 二、集合框架

首先看一下集合的框架图

![](http://img2.salute61.top/Java%E9%9B%86%E5%90%88%E6%A1%86%E6%9E%B6.gif)

图中可以看到，集合主要分为Collection（集合）和Map（图）两个接口，Collection存储元素集合，Map存储键/值对映射。（其中Collection接口继承(extends)了Iterable接口，具体体现是实现了Iterator）

- Collection分别被Queue、List和Set继承。下面是一些抽象类，然后是具体类。
  - List被AbstractList实现，然后分为3个子类，ArrayList，LinkList和VectorList。
  - Set被AbstractSet实现，又分为2个子类，HashSet和TreeSet。
  - Map被AbstractMap实现，又分为2个子类，HashMap和TreeMap。
  - Map被Hashtable实现。
- **接口：**是代表集合的抽象数据类型。例如 Collection、List、Set、Map 等。之所以定义多个接口，是为了以不同的方式操作集合对象
- **实现（类）：**是集合接口的具体实现。从本质上讲，它们是可重复使用的数据结构，例如：ArrayList、LinkedList、HashSet、HashMap。
- **算法：**是实现集合接口的对象里的方法执行的一些有用的计算，例如：搜索和排序。这些算法被称为多态，那是因为相同的方法可以在相似的接口上有着不同的实现。

<img src="http://img2.salute61.top/Java-coll.png" style="zoom:67%;" />





## 三、Iterator迭代器

它是Java集合的顶层接口（不包括map系列的集合，Map接口是map系列集合的顶层接口）

- Object next()：通过反复调用next方法可以组个访问集合中的元素。但是到达了末尾next方法会抛出NoSuchElementException。因此调用next前先调用hasNext
- 遍历还可以用forEach实现，任何实现了Iterable接口的对象都可以使用
- boolean hasNext()：判断容器内是否还有可供访问的元素。
- void remove()：删除迭代器刚越过的元素。

所以除了map系列的集合，我么都能通过迭代器来对集合中的元素进行遍历。

注意：我们可以在源码中追溯到集合的顶层接口，比如Collection接口，可以看到它继承的是类Iterable

```java
public interface Collection<E> extends Iterable<E> {
    // Query Operations
}
```

那这就得说明一下Iterator和Iterable的区别：

Iterable：存在于java.util包中。　

```java
public interface Iterable<T> {
    /**
     * Returns an iterator over elements of type {@code T}.
     *
     * @return an Iterator.
     */
    Iterator<T> iterator();
    ...
}
```

看源码可知，Iterable接口里面封装了 Iterator 接口。所以只要实现了Iterable接口的类，就可以使用Iterator迭代器了。

Iterator：存在于java.util包中。核心的方法next()，hasNext()，remove()。



## 四、Collection操作简介

Collection的作用就是规定了一个集合有哪些基本的操作。在IDEA中ctrl+F12可以查看

<img src="http://img2.salute61.top/Java_Collection1.png" style="zoom:67%;" />

可以看到基本上是插入数据、清除数据、是否包含、是否相等、移除元素、转换数组等操作

比如：

　　int size()　获取元素个数

　　boolean isEmpty()　是否个数为零

　　boolean contains(Object element)　是否包含指定元素

　　boolean add(E element)　添加元素，成功时返回true

　　boolean remove(Object element)　删除元素，成功时返回true

　　Iterator<E> iterator()　获取迭代器

还有些操作整个集合的方法，比如：

　　boolean containsAll(Collection c)     是否包含指定集合 c 的全部元素

　　boolean addAll(Collection<? extends E> c)　添加集合 c 中所有的元素到本集合中，如果集合有改变就返回 true

　　boolean removeAll(Collection<?> c)　删除本集合中和 c 集合中一致的元素，如果集合有改变就返回 true

　　boolean retainAll(Collection c)    保留本集合中 c 集合中两者共有的，如果集合有改变就返回 true

　　void clear()    删除所有元素

还有对数组操作的方法：

　　Object[] toArray()　返回一个包含集合中所有元素的数组

　　<T> T[] toArray(T[] a)　返回一个包含集合中所有元素的数组，运行时根据集合元素的类型指定数组的类型



与Collection接口相关还有一个抽象类AbstractCollection：

AbstractCollection是一个抽象类，实现了Collection接口的部分功能，实现了一些最基本的通用操作，把复杂的和业务相关的延迟到子类实现。

在AbstractCollection中，主要实现了contains(), isEmpty(), toArray(), remove(), clear() 这几个操作。



## 五、Collection源码分析

**Collection是一个接口，继承自Iterable。**先看一下Iterable接口的源码

```java
/*
 * Copyright (c) 2003, 2013, Oracle and/or its affiliates. All rights reserved.
 * ORACLE PROPRIETARY/CONFIDENTIAL. Use is subject to license terms.
 */
package java.lang;

import java.util.Iterator;
import java.util.Objects;
import java.util.Spliterator;
import java.util.Spliterators;
import java.util.function.Consumer;

/**
 * 实现了这个接口可以使对象成为for-each循环的target，即可以使用foreach遍历
 * @since 1.5
 * @jls 14.14.2 The enhanced for statement
 */
public interface Iterable<T> {
    /**
     * 返回一个元素类型为<T>的迭代器
     */
    Iterator<T> iterator();

    /**
     *对{@code Iterable}的每个元素执行给定的操作，直到处理完所有元素或该操作引发异常为止。
     *除非实现类另行指定，否则操作将以迭代顺序执行（如果指定了迭代顺序）。
     *该操作引发的异常将中继给调用者。
     * @param action The action to be performed for each element
     * @throws NullPointerException if the specified action is null
     * @since 1.8
     */
    default void forEach(Consumer<? super T> action) {
        Objects.requireNonNull(action);
        for (T t : this) {
            action.accept(t);
        }
    }

    /**
     * @since 1.8
     */
    default Spliterator<T> spliterator() {
        return Spliterators.spliteratorUnknownSize(iterator(), 0);
    }
}

```



在IDEA中ctrl+F12查看Collection的源码，简要分析源码中变量、方法的含义

```java
/*
 * Copyright (c) 1997, 2013, Oracle and/or its affiliates. All rights reserved.
 * ORACLE PROPRIETARY/CONFIDENTIAL. Use is subject to license terms.
 */

package java.util;

import java.util.function.Predicate;
import java.util.stream.Stream;
import java.util.stream.StreamSupport;

/**
 *这是一个集合分层的根接口。集合代表了一组包含元素的对象。有些集合允许有重复的元素，有些不允许。
 *有些集合是有序的有些无序的。
 *jdk不对这个接口提供任何直接的实现，但是再一些直接子接口例如Set和List有实现了某些接口方法。
 *所有继承Collection的类必须提供两个默认的构造函数，一个不带参数的、一个带Collection类型参数。
 *
 */

public interface Collection<E> extends Iterable<E> {
    // 查询操作

    /**
     * @返回集合元素个数
     */
    int size();

    /**
     * 集合为空返回true
     */
    boolean isEmpty();

    /**
     *集合包含某个特定元素，返回true
     * @param o 要测试de是否存在于集合的对象
     * @return 集合包含某个特定元素o，返回true
     * @throws 抛出ClassCastException 如果该对象与集合类型不相容
     * @throws 抛出NullPointerException 如果对象为空而该集合不允许空引用
     */
    boolean contains(Object o);

    /**
     * 返回迭代器Iterator，并未说明元素的迭代顺序，除非特别的集合有此要求
     */
    Iterator<E> iterator();

    /**
     *返回一个包含该集合全部对象的数组 
     *如果集合保证是有序的，那么通过迭代器返回数组有相同顺序
     
     *返回的数组是安全的，也就是说集合有自己的引用，数组开辟新的堆内存，也有自己的引用。所以调
     *用者可以随意操作返回的数组。
     *这个方法是数组和列表之间的桥梁
     */
    Object[] toArray();

    /**
     * 返回一个集合元素类型的数组。如果集合满足指定的数组并且有足够的空间，则在其中返回此集合
     * 否则返回此集合大小的新数组。
     * 如果集合有序，那么返回此集合迭代器遍历顺序的数组
     * 如果数组大小比集合元素多，那么在数组满足集合元素后在末尾设置为null  
     *
     * 如果在这个集合中指定数组运行时类型不是运行时元素类型的超类，那么抛ArrayStoreException异常
     * 如果指定数组为空，则抛出NullPointerException
     */
    <T> T[] toArray(T[] a);

    //修改操作

    /**
     * 确保此集合包含特定的元素类型。
     * 如果此集合增加元素成功返回true。
     * 如果此集合不允许有重复元素并且已经包含所传参数，那么返回false
     * 
     * 支持此操作的集合可能会限制向该集合添加哪些元素。特别的，有些集合会拒绝null元素，有些
     * 会对要增加的元素强加一些限制。
     * Collection实现类应该在文档中明确指出所有的限制。
     *
     * 如果集合以除已经包含元素之外的任何原因拒绝添加特定元素，则必须抛出异常
     *(而不是返回false)。这保留了集合在此调用返回后始终包含指定元素的不变式。
     */
    boolean add(E e);

    /**
     * 如果此集合中存在此元素，那么移除一个特定元素类型的实例。更正式的说，如果集合中包含一个或多个这样的元素，
     * 那么删除这样的元素(o==null?e==null:o.equals(e))。如果集合包含指定的元素(或集合因调用而发生改变)，那么返回true。
     *
     * 如果指定元素的类型和集合不相容，抛出ClassCastException异常(可选的限制条件)
     * 如果指定元素是null并且这个集合不允许null元素存在，那么抛出NullPointerException异常(可选的限制条件)
     * 如果此集合不支持remove操作那么抛出UnsupportedOperationException异常(可选的限制条件)
     */
    boolean remove(Object o);


    // 容量操作

    /**
     * 如果this集合包含指定集合的所有元素，返回true
     * c集合必须要检查是否被包含在this集合
     * 如果指定元素的类型和集合不相容，抛出ClassCastException异常(可选的限制条件)
     * 如果指定元素是null并且这个集合不允许null元素存在，那么抛出NullPointerException异常(可选的限制条件)
     */
    boolean containsAll(Collection<?> c);

    /**
     * 将指定集合的所有元素到this集合中(可选的操作)。
     * 如果指定的集合在操作进行时被修改了，那么此操作行为未定义。
     * (这意味着如果指定的集合是这个集合，并且这个集合是非空的，那么这个调用的行为是未定义的。)
     * 
     * @参数:c集合包含了要被添加到这个集合的元素
     * @返回:如果调用结果改变了this集合返回true
     * @throws:如果 addAll操作不被此集合支持，那么抛出UnsupportedOpertaionException异常
     * @throws: 如果指定集合包含了空元素而this集合不允许有空元素，那么抛出NullPointerException异常
     * @throws:如果this集合阻止hiding集合元素类型添加，那么抛出ClassCastException异常
     * @throws:如果指定集合的元素的某些属性阻止将其添加到此集合，则抛出IllegalArgumentException
     * @throws:由于插入限制，如果不是所有元素都可以在此时添加，则抛出IllegalStateException异常
     */
    boolean addAll(Collection<? extends E> c);

    /**
     * 移除此集合中所有的包含在指定集合中的元素(可选的操作)。调用过此函数之后，那么此集合和指定集合将不再包含相同元素。
     *
     * @param:包含要从该集合中删除的元素的c集合
     * @return:如果此集合因调用而更改那么返回true
     * @throws:如果此集合不支持removeAll方法，则抛出UnsupportedOperationException
     * @throws:如果集合中一个或多个元素的类型与指定集合不兼容，则抛出ClassCastException(可选的操作)
     * @throws:如果该集合包含一个或多个空元素，且指定的集合不支持空元素(optional)，或者指定的集合为空，
     * 则抛出NullPointerException异常
     */
    boolean removeAll(Collection<?> c);

    /**
     * 移除此集合中所有符合给定Predicate的元素。在迭代期间或由Predicate引发的错误或运行时异常将被转发给调用方
     * @implSpec
     * 默认实现使用其迭代器遍历集合的所有元素。每一个匹配的元素使用iterator.remove()来移除。
     * 如果集合的iterator不支持移除将会抛出UnsupportedOperationException异常在匹匹厄到
     * 第一个元素时。
     * @param 过滤一个predicate
     * @param 筛选要删除的元素返回true的Predicate
     * @return 如果任何一个元素被删除返回true
     * @throws 指定过滤器为空，抛出NullPointerException
     * @throws 如果元素没有被删除，或者移除操作不支持，
     *  则立即抛出UnsupportedOperationException异常
     * @since 1.8
     */
    default boolean removeIf(Predicate<? super E> filter) {
        //如果filter为null抛出NullPointerException
        Objects.requireNonNull(filter);
        boolean removed = false;
        final Iterator<E> each = iterator();
        while (each.hasNext()) {
            if (filter.test(each.next())) {
                each.remove();
                removed = true;
            }
        }
        return removed;
    }

    /**
     * 只保留此集合中包含在指定集合中的元素(可选的操作)。
     * 也就是说，此集合中不包含在指定集合中的所有元素。
     * @param:要保留的元素的集合c
     * @return:如果此集合改变了返回true
     * @throws:如果此集合不支持retainAll，则抛出UnsupportedOperationException异常
     * @throws:如果集合中一个或多个元素的类型与指定集合不兼容，则抛出ClassCastException(可选的操作)
     * @throws:如果该集合包含一个或多个空元素，且指定的集合不支持空元素(optional)，或者指定的集合为空
     */
    boolean retainAll(Collection<?> c);

    /**
     * 移除此集合中所有元素(可选操作),调用此方法后集合里将为空。
     * @throws: 如果此集合clear操作不支持将会抛出UnsupportOperationException异常。
     */
    void clear();


    // 比较和哈希

    /**
     * 比较指定的对象与此集合是否相等
     *
     * @参数 o 比较的对象
     * @返回 相等返回true
     */
    boolean equals(Object o);

    /**
     *返回这个集合的hashCode。当集合接口没有对Object.hashCode方法的一般协议做任何规定，编程
     *人员应该注意在重写equals方法时必须重写hashCode方法，以便满足一般协议对这个
     *Object.hashCode方法。特别的，c1.equals(c2)表明c1.hashCode()==c2.hashCode()。
     */
    int hashCode();

    /**
     * 创建分流器、流操作
     * @since 1.8
     */
    @Override
    default Spliterator<E> spliterator() {
        return Spliterators.spliterator(this, 0);
    }
    default Stream<E> stream() {
        return StreamSupport.stream(spliterator(), false);
    }
    default Stream<E> parallelStream() {
        return StreamSupport.stream(spliterator(), true);
    }
}

```





## 【参考】

- [Java集合（一）、什么是Java集合？](https://www.cnblogs.com/lixiansheng/p/11348050.html)
- [Java 集合框架](https://www.runoob.com/java/java-collections.html)
- [Java之Collection接口介绍与剖析，看完后再也忘不掉](http://www.manongjc.com/article/66616.html)