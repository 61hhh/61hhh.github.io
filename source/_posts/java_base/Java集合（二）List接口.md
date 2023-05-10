---
title: Java集合（二）List接口
tags: Java基础
categories: Java
abbrlink: 2789e08f
date: 2020-08-03 09:19:03
---

## 一、Collection接口

Collection接口分别有List、Set两个子接口，根据具体实现采用的结构不同又分为ArrayList、LinkedList等

![](http://img2.salute61.top/java_Collection2.png)

<!--more-->

### 1.Collection的常用功能

```java
1. 添加功能
    boolean add(E e) 
        添加一个元素
    boolean addAll(Collection c)  
        添加一批元素
2. 删除功能
   boolean remove(Object o) 
       删除一个元素
3. 判断功能
   boolean contains(Object o) 
       判断集合是否包含指定的元素
   boolean isEmpty()  
       判断集合是否为空(集合中没有元素)
4. 获取功能
   int size()  
      获取集合的长度
5. 转换功能
   Object[] toArray() 
       把集合转换为数组
```



### 2.遍历集合的方式

普通的for循环，需要索引，对数组支持的集合操作更方便

```java
import java.util.*;

public class test{
    public static void main(String[] args) {
        ArrayList<String> list = new ArrayList<String>();
        list.add("Hello");
        list.add("Java");
        list.add("World");
        for (int i = 0; i < list.size(); i++){
            String s = (String) list.get(i);
            System.out.println(s);
        }
    }
}
```



迭代器遍历，可以遍历任何集合，与传统的迭代器（例如C++标准模板库的迭代器）不同

- C++ STL中迭代器是根据数组索引建模的，给定迭代器可以查看指定位置上的元素，就像知道索引 i 可以查看数组a[i]一样，不需要查找元素就可以将迭代器前移
- Java迭代器的查找操作和位置变更是紧密相连的，查找一个元素唯一的方法是调用next，执行查找操作的同时迭代器位置前移

```java
import java.util.*;

public class test{
    public static void main(String[] args) {
        Collection<String> c = new ArrayList<String>();
        c.add("Hello");
        c.add("Java");
        c.add("World");
        //获取迭代器对象
        Iterator<String> it = c.iterator();
        //hasNext()判断是否有下一个元素，如果有就用next()获取
        while(it.hasNext()){
            //获取下一个元素
            String s = it.next();
            System.out.println(s);
        }
    }
}
```



**for-each循环**：用更简洁的方式表达同样的操作。编译器将for each循环翻译为带有迭代器的循环

```java
import java.util.*;

public class test{
    public static void main(String[] args) {
        Collection<String> c = new ArrayList<String>();
        c.add("Hello");
        c.add("Java");
        c.add("World");
        //高级for遍历集合
        for (String s : c){
            System.out.println(s);
        }

        int[] arr = {1, 2, 3, 4, 5};
        //高级for遍历数组
        for (int a : arr){
            System.out.println(a);
        }
    }
}
```





## 二、List集合

List集合包含List接口及其实现类。List集合有以下特点：

1. 集合元素允许重复
2. 集合元素有序
3. 元素可以通过索引访问

常用的实现类有：ArrayList、LinkedList、Vector。



### 1.ArrayList

ArrayList是List接口的典型实现类，本质上，ArrayList是对象引用的一个变长数组。

ArrayList是List接口的可变数组的实现。实现了所有可选列表操作，并允许包括null在内的所有元素。除了实现List接口外，此类还提供了一些方法来操作内部用来存储列表的数组的大小。

每个ArrayList实例都有一个初始容量，该容量用来储存列表元素的数组大小。**默认初始容量为10。**

ArrayList底层采用数组实现，因此它的优点是适合随机查找和遍历，缺点是不适合插入和删除。

注：<font color="red">Arrays.asList(…) 方法返回的 List 集合既不是 ArrayList 实例，也不是 Vector 实例。 Arrays.asList(…)返回值是一个固定长度的 List 集合。</font>



#### 1.1 添加元素

使用ArrayList添加元素有如下方法

- set(int index, E element)：替换数组中已经存在的元素内容。
- add(E e)：将元素添加到集合的末尾
- add(int index, E element)：将元素添加到指定的索引位置
- addAll(Collection<? extends E> c)：按照指定Collection的迭代器所返回的元素顺序，将该Collection中的所有元素添加到此列表的尾部。
- addAll(inr index, Collection<? extends E> c)：从指定的位置开始，将指定collection中的所有元素插入到此列表中

```java
List<String> platformList = new ArrayList<>();

// 添加元素
myList.add("靓仔");
myList.add("你好");
myList.add("leslie");
myList.add("cheung");
// 添加重复元素,会添加成功,因为List支持添加重复元素
myList.add("你好");
myList.add("靓仔");

myList.add(3, "个人博客");
```

#### 1.2  获取元素

获取ArrayList中指定索引处的元素的使用方法  get()：获取指定位置上的元素

```java
System.out.println("索引为3的元素为：" + myList.get(3));
```

如果指定的索引超出了集合的最大索引，比如`myList.get(10010)`就会抛出异常`java.lang.IndexOutOfBoundsException`：

#### 1.3 获取集合元素个数

获取ArrayList元素个数的使用方法如下所示：

```java
System.out.println("myList的元素个数为：" + myList.size());
```

#### 1.4 删除元素

使用ArrayList删除元素有以下两个重载：

```java
E remove(int index);

boolean remove(Object o);
```

`E remove(int index);`是删除集合中指定索引处的元素，`boolean remove(Object o);`是删除集合中的指定元素。

使用方法如下所示：

```java
// 指定索引删除重复的元素 "你好" "靓仔"
myList.remove(4);
myList.remove(4);
// 删除指定元素 "个人博客"
myList.remove("靓仔");
```

#### 1.5 修改元素

修改ArrayList中指定索引处的元素值的使用方法如下所示：

```java
myList.set(0, "salute");
myList.set(1, "LiuYi");
myList.set(2, "Bob Dylan");
```

#### 1.6 判断集合是否为空

判断ArrayList是否为空的使用方法如下所示：

```java
System.out.println("isEmpty:" + myList.isEmpty());
```

#### 1.7 清空集合

清空ArrayList中所有元素的使用方法如下所示：

```java
myList.clear();
```



**小结**：

- ArrayLlist内部是由数组来实现的。在存放数据的数组长度不够时，会进行扩容，即增加数组长度。扩展为原来的1.5倍。
- 由于是数组来实现，所以，优点是查找元素很快。可以通过下标查找元素，查找效率高。缺点是每次添加和删除元素都会进行大量的数组元素移动。长度不够会扩容。效率底下。
- ArrayList每次的增、删、改操作都伴随着数组的复制和元素的移动。这意味着新的内存空间的开辟。





### 2.LinkedList

LinkedList也是List接口的实现类，内部使用链表结构存储数据

- 分配内存空间不是必须是连续的；
- 插入、删除操作很快，只要修改前后指针就OK了，时间复杂度为O(1)；
- 访问比较慢，必须得从第一个元素开始遍历，时间复杂度为O(n)；

LinkedList类的代码声明如下所示：

```java
public class LinkedList<E>
    extends AbstractSequentialList<E>
    implements List<E>, Deque<E>, Cloneable, java.io.Serializable{
    //。。。。。。
}
```

LinkedList类的使用方法和ArrayList基本一样，只需修改下声明处的代码即可：

```java
List<String> platformList = new LinkedList<>();
```



#### 2.1 push、pop、poll

1. void push(E e)：与addFirst一样，实际上它就是addFirst； 
2. E pop()：与removeFirst一样，实际上它就是removeFirst； 
3. E poll()：查询并移除第一个元素；

```java
import java.util.*;

public class test{
    public static void main(String[] args) {
        LinkedList<String> linkedList = new LinkedList<>();
        
        linkedList.push("first");
        linkedList.push("second");
        linkedList.push("second");
        linkedList.push("third");
        linkedList.push("four");
        linkedList.push("five");
        System.out.println(linkedList);

        System.out.println("pop: " + linkedList.pop());
        //pop: five
        System.out.println("after pop: " + linkedList);
        //after pop: [four,third,second,second,first]
        System.out.println("poll: " + linkedList.poll());
        //poll: four
        System.out.println("after poll: " + linkedList);
        //after poll: [third,second,second,first]
    }
}
```

push、pop的操作很接近stack的操作。

在链表为空时，poll与pop的区别：

```java
import java.util.*;

public class test{
    public static void main(String[] args) {
        LinkedList<String> linkedList = new LinkedList<>();

        System.out.println("pop: " + linkedList.poll());
        //pop: null
        System.out.println("poll: " + linkedList.pop());
        //poll报错: Exception in thread "main" java.util.NoSuchElementException
    }
}
```

#### 2.2 peek

获取元素，可以指定第一个peekFirst，也可以时最后一个peekLast，只能获取不会移除

```java
import java.util.*;

public class test{
    public static void main(String[] args) {
        LinkedList<String> linkedList = new LinkedList<>();

        linkedList.push("first");
        linkedList.push("second");
        linkedList.push("second");
        linkedList.push("third");
        linkedList.push("four");
        linkedList.push("five");
        System.out.println("linkedList: " + linkedList);
        //linkedList: [five,four,third,second,second,first]
        System.out.println("peek: " + linkedList.peek());
        //peek: five
        System.out.println("peekFirst: " + linkedList.peekFirst());
        //peekFirst: five
        System.out.println("peekLast: " + linkedList.peekLast());
        //peekLast: first
        System.out.println("linkedList: " + linkedList);
        //linkedList: [five,four,third,second,second,first]
        
        //如果没找到对应元素，输出为null
        LinkedList<String> linkedList2 = new LinkedList<>();
        System.out.println("linkedList2: " + linkedList2);
        System.out.println("peek: " + linkedList2.peek());
        System.out.println("peekFirst: " + linkedList2.peekFirst());
        System.out.println("peekLast: " + linkedList2.peekLast());
    }
}
```



#### 2.3 offer

1. boolean offer(E e)：在链表尾部插入一个元素； 
2. boolean offerFirst(E e)：与addFirst一样，实际上它就是addFirst； 
3. boolean offerLast(E e)：与addLast一样，实际上它就是addLast；

```java
import java.util.*;

public class test{
    public static void main(String[] args) {
        LinkedList<String> linkedList = new LinkedList<>();

        linkedList.push("first");
        linkedList.push("second");
        linkedList.push("second");
        linkedList.push("third");
        linkedList.push("four");
        linkedList.push("five");
        System.out.println("linkedList: " + linkedList);
        //linkedList: [five,four,third,second,second,first]
        linkedList.offer("six");
        System.out.println("linkedList: " + linkedList);
        //linkedList: [five,four,third,second,second,first,six]
        linkedList.offerFirst("zero");
        System.out.println("linkedList: " + linkedList);
        //linkedList: [zero,five,four,third,second,second,first,six]
        linkedList.offerLast("seven");
        System.out.println("linkedList: " + linkedList);
        //linkedList: [zero,five,four,third,second,second,first,six,seven]
    }
}
```





### 3.Vector

Vector也是List接口的实现类，内部也是通过数组来实现。

java.util.vector提供了向量类(Vector)以实现类似动态数组的功能。 
创建了一个向量类的对象后，可以往其中随意插入不同类的对象，即不需顾及类型也不需预先选定向量的容量，并可以方便地进行查找。

对于预先不知或者不愿预先定义数组大小，并且需要频繁地进行查找，插入，删除工作的情况，可以考虑使用向量类。

向量类提供了三种构造方法：

```
public vector() 
public vector(int initialcapacity,int capacityIncrement) 
public vector(int initialcapacity)
```

使用第一种方法系统会自动对向量进行管理，若使用后两种方法，则系统将根据参数，initialcapacity设定向量对象的容量（即向量对象可存储数据的大小），当真正存放的数据个数超过容量时。系统会扩充向量对象存储容量。

参数capacityincrement给定了每次扩充的扩充值。当capacityincrement为0的时候，则每次扩充一倍，利用这个功能可以优化存储。

Vector类的代码声明如下所示：

```java
public class Vector<E> extends AbstractList<E>
    implements List<E>, RandomAccess, Cloneable, java.io.Serializable{
    //
}
```

与ArrayList不同的是，**Vector是线程安全的**，即某一时刻只有一个线程能够写Vector，避免多线程同时写而引起的不一致性。不过这也造成Vector的缺点：实现线程的同步需要额外的花费，因此它的访问速度会比ArrayList慢一些。

可以认为Vector是ArrayList在多线程环境下的实现版本。所以Vector类的使用方法和ArrayList基本一样，只需修改下声明处的代码即可：

```java
List<String> platformList = new Vector<>();
```

由于要支持线程同步，因此Vector类的很多方法都有synchronized关键字，如下所示：

```java
public synchronized boolean isEmpty() {
    return elementCount == 0;
}

public synchronized int size() {
    return elementCount;
}

public synchronized void addElement(E obj) {
    modCount++;
    ensureCapacityHelper(elementCount + 1);
    elementData[elementCount++] = obj;
}
```



## 三、ArrayList、LinkedList、Vector区别

### 1 底层实现

**ArrayList和Vector是基于数组实现的，LinkedList是基于双向链表实现的。**

这也就导致ArrayList适合随机查找和遍历，而LinkedList适合动态插入和删除元素。

### 2 线程安全性

**ArrayList和LinkedList是线程不安全的，Vector是线程安全的。**

Vector可以看做是ArrayList在多线程环境下的另一种实现方式，这也导致了Vector的效率没有ArraykList和LinkedList高。

如果要在并发环境下使用ArrayList或者LinkedList，可以调用Collections类的synchronizedList()方法：

```java
Collections.synchronizedList(myList);
```

### 3 扩容机制

**ArrayList和Vector都是使用Object类型的数组（Object[ ] array）来存储数据的，ArrayList的默认容量是10，Vector的默认容量是0。**

当向这两种类型中添加元素时，若容量不够，就会进行扩容，扩容的本质是产生一个新数组，将原数组的数据复制到新数组，再将新的元素添加到新数组中，使用的方法是`Arrays.copyOf()`，其中**ArrayList扩容后的容量是之前的1.5倍，Vector默认情况下扩容后的容量是之前的2倍**。



查看ArrayList的源码，就明白为什么会这样扩容：

```java
private static final int DEFAULT_CAPACITY = 10;

public boolean add(E e) {
    ensureCapacityInternal(size + 1);  // Increments modCount!!
    elementData[size++] = e;
    return true;
}

private void ensureCapacityInternal(int minCapacity) {
    ensureExplicitCapacity(calculateCapacity(elementData, minCapacity));
}

private static int calculateCapacity(Object[] elementData, int minCapacity) {
     if (elementData == DEFAULTCAPACITY_EMPTY_ELEMENTDATA) {
         return Math.max(DEFAULT_CAPACITY, minCapacity);
     }
     return minCapacity;
}

private void ensureExplicitCapacity(int minCapacity) {
     modCount++;

     // overflow-conscious code
     if (minCapacity - elementData.length > 0)
      	 grow(minCapacity);
}

private void grow(int minCapacity) {
     // overflow-conscious code
     int oldCapacity = elementData.length;
     int newCapacity = oldCapacity + (oldCapacity >> 1);
     if (newCapacity - minCapacity < 0)
         newCapacity = minCapacity;
     if (newCapacity - MAX_ARRAY_SIZE > 0)
         newCapacity = hugeCapacity(minCapacity);
     // minCapacity is usually close to size, so this is a win:
     elementData = Arrays.copyOf(elementData, newCapacity);
}
```

最核心的代码就是`int newCapacity = oldCapacity + (oldCapacity >> 1);`，所以ArrayList扩容后的容量是之前的1.5倍。

查看Vector的源码，就明白为什么会这样扩容：

```java
public synchronized void addElement(E obj) {
    modCount++;
    ensureCapacityHelper(elementCount + 1);
    elementData[elementCount++] = obj;
}

private void ensureCapacityHelper(int minCapacity) {
        // overflow-conscious code
        if (minCapacity - elementData.length > 0)
            grow(minCapacity);
    }
private static final int MAX_ARRAY_SIZE = Integer.MAX_VALUE - 8;

private void grow(int minCapacity) {
     // overflow-conscious code
     int oldCapacity = elementData.length;
     int newCapacity = oldCapacity + ((capacityIncrement > 0) ?
                                      capacityIncrement : oldCapacity);
     if (newCapacity - minCapacity < 0)
         newCapacity = minCapacity;
     if (newCapacity - MAX_ARRAY_SIZE > 0)
         newCapacity = hugeCapacity(minCapacity);
     elementData = Arrays.copyOf(elementData, newCapacity);
}
```

最核心的代码就是`int newCapacity = oldCapacity + ((capacityIncrement > 0) ?capacityIncrement : oldCapacity);`，所以Vector默认情况下扩容后的容量是之前的2倍。





## 【参考】

- [Java集合系列(二)：ArrayList、LinkedList、Vector的使用方法及区别](https://www.cnblogs.com/zwwhnly/p/11265599.html)

- [Java集合（三）、继承自Collection接口的List接口](https://www.cnblogs.com/lixiansheng/p/11349369.html)
- Java核心技术 卷一：集合