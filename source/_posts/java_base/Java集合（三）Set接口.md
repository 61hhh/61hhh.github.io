---
title: Java集合（三）Set接口
tags: Java基础
categories: Java
abbrlink: ca7445de
date: 2020-08-03 21:21:17
---

## 一、Set集合

​        一个不包含重复元素的collection。更确切地讲，<u>Set不包含满足e1.equals(e2)的元素对 e1和e2，并且最多包含一个null元素。</u>

　　Set集合由Set接口和Set接口的实现类组成，Set接口继承了Collection接口，因此包含了Collection接口的所有方法。其主要实现类有HashSet和TreeSet，在HashSet的基础上又延伸出了LinkedHashSet。

​         与List不同，Set提供了equals(Object o)和hashCode()，供其子类重写，以实现对集合中插入重复元素的处理；

HashSet和TreeSet的不同就在于如何判断两个数是否相同的方法上。

1. HashSet判断两个对象是否相同的方法时继承自Object类的equals方法。
2. TreeSet判断两个对象是否相同的方法则是Comparable接口中的compareTo()方法。（public void int compareTo(Object o)方法不仅可以比较是否相等，还可以比较大小，如果相等返回0，调用者大于参数则返回正数，否则返回负数）

<font color="red">所以可以得到添加到TreeSet中的对象必须实现Comparable接口。同时如果使用HashSet建议重写equals()方法。</font>

<img src="http://img2.salute61.top/Java_Set.png" style="zoom:67%;" />

<!--more-->

## 二、HashSet

HashSet实现了Set接口，底层是基于HashMap进行存储。遍历时不保证顺序，并不保证下次遍历的顺序和之前一样。HashSet中允许null值。

HashSet底层由HashMap实现，插入的元素被当做是HashMap的key，根据hashCode值来确定集合中的位置，由于Set集合中并没有角标的概念，所以并没有像List一样提供get（）方法。当获取HashSet中某个元素时，只能通过遍历集合的方式进行equals()比较来实现；



![](http://img2.salute61.top/Java_Set2.png)

查看源码可知：HashSet的集合其实就是HashMap的key的集合，然后HashMap的val默认都是PRESENT。HashMap的定义即是key不重复的集合。使用HashMap实现，这样HashSet就不需要再实现一遍。

而增删检查遍历的源码操作中，实际的操作逻辑都是HashMap的。**遍历操作其实就是HashMap的keySet的遍历**

```java
public Iterator<E> iterator() {
        return map.keySet().iterator();
    }
public boolean contains(Object o) {
        return map.containsKey(o);
    }
public boolean add(E e) {
        return map.put(e, PRESENT)==null;
    }
public boolean remove(Object o) {
        return map.remove(o)==PRESENT;
    }
public void clear() {
        map.clear();
    }
```

**HashSet底层实际上是一个HashMap，HashMap底层采用了哈希表数据结构**。哈希表又叫散列表，哈希表底层是一个数组，这个数组中每一个元素是一个单向链表，每个单向链表都有一个独一无二的hash值，代表数组的下标。在某个单向链表中的每个节点上的hash值是相同的。hash值实际上是key调用hashCode方法，再通过“hash function”转换成的值。



#### HashSet添加元素

示例代码如下：

```java
public class HashSetLEARN {
    private Integer id;
    private String name;

    public HashSetLEARN(Integer id , String name){
        this.id = id;
        this.name = name;
    }

    @Override
    public String toString() {
        return "HashSetLEARN{" +
                "id=" + id +
                ", name='" + name + '\'' +
                '}';
    }

    public static void main(String[] args){
        Set<HashSetLEARN> testSet  = new HashSet<>();
        HashSetLEARN hsl1 = new HashSetLEARN(1,"leslie");
        HashSetLEARN hsl2 = new HashSetLEARN(1,"leslie");
        testSet.add(hsl1);
        testSet.add(hsl2);

        testSet.forEach(hsl -> System.out.println(hsl));
    }
}
```

运行输出结果：出现了两组

![](http://img2.salute61.top/Java_Set3.png)

按理id、name都一样，那么在HashSet中就应该只保留一组

这是因为Set集合中所说的不允许重复，这个重复是指对象的重复。何为同一个对象？即在内存中的编号是一致的。内存中的编号是什么？就是哈希码（哈希码一般是 类名 和 对象所在内存地址的十六进制数字表示 的组合）。

增加对equals和hashcode方法的重写

```java
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        HashSetLEARN that = (HashSetLEARN) o;
        return Objects.equals(id, that.id) &&
                Objects.equals(name, that.name);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, name);
    }
```

这次就只有一组数据了

![](http://img2.salute61.top/Java_Set4.png)

向哈希表中添加元素流程

- 先调用存储的key的hashCode方法，经过 某个算法得到hash值，
- 如果这个哈希表中不存在这个hash值，则直接加入元素。
- 如果该hash值已经存在，继续调用key之间的equals方法，如果equals方法返回false，则将该元素添加。
- 如果equals方法返回true，则放弃添加该元素 ，即元素重复。

**HashMap和HashSet的初始化容量是16，默认加载因子是0.75。**





## 三、TreeSet

从名字上可以看出，此集合的实现和树结构有关。与HashSet集合类似，TreeSet也是基于Map来实现，具体实现**TreeMap**，其底层结构为**红黑树**（特殊的二叉查找树）；

TreeSet是SortedSet接口的唯一实现类，TreeSet可以确保集合元素处于排序状态。TreeSet支持两种排序方式，自然排序和自定义排序，其中自然排序为默认的排序方式。向 TreeSet中加入的应该是同一个类的对象。

TreeSet要注意的事项：

1. 往TreeSet里面添加元素时候，如果元素本具备自然顺序特性，那么就按照元素的自然顺序排序存储.
2. 往TreSet里面添加元素时候，如果元素不具备自然顺序特性，那么该元素就必须要实现Comparable接口，把元素的比较规则定义在compareTo(T o)方法中
3. 如果比较元素的时候，compareTo返回的是0，那么该元素被视为重复元素，不允许添加 (注意：TreeSet与HashCode，equals没有任何关系)
4. **往TreeSet里面添加元素时候，如果元素本身不具备自然自然顺序特性，而且元素所属类也没有实现Comparable接口，通过为需要排序的类实现Comparable或者Comparator接口来实现。**

比较器：

```java
class className implements Comparator<T>{
    
}
```



#### TreeSet设置排序

```java
public class TreeSetLEARN {
    private Integer age;

    private String name;

    public TreeSetLEARN(Integer age, String name){
        this.age = age;
        this.name = name;
    }

    public static void main(String[] args) {
        TreeSet<TreeSetLEARN> ts = new TreeSet<>();
        ts.add(new TreeSetLEARN(23, "张三"));
        ts.add(new TreeSetLEARN(13, "李四"));
        ts.add(new TreeSetLEARN(13, "周七"));
        ts.add(new TreeSetLEARN(43, "王五"));
        ts.add(new TreeSetLEARN(33, "赵六"));

        System.out.println(ts);
    }
}
//以上代码报错：Exception in thread "main" java.lang.ClassCastException: JavaCore.TreeSetLEARN cannot be cast to java.lang.Comparable
```

没有告诉TreeSet怎样比较元素，所以他就会抛出这个异常

```java
//指定比较的规则，需要在自定义类中实现Comparable接口，并重写接口中的compareTo方法  
public int CompareTo(Person o){
    return 0;     //当compareTo方法返回0的时候集合中只有一个元素
    return 1;     //当compareTo方法返回正数的时候集合会怎么存就怎么取
    return -1;    //当compareTo方法返回负数的时候集合会倒序存储
}
```

原因在于TreeSet底层其实是一个二叉树机构，且每插入一个新元素(第一个除外)都会调用```compareTo()```方法去和上一个插入的元素作比较，并按二叉树的结构进行排列。

1. 如果将```compareTo()```返回值写死为0，元素值每次比较，都认为是相同的元素，这时就不再向TreeSet中插入除第一个外的新元素。所以TreeSet中就只存在插入的第一个元素。
2. 如果将```compareTo()```返回值写死为1，元素值每次比较，都认为新插入的元素比上一个元素大，于是二叉树存储时，会存在根的右侧，读取时就是正序排列的。
3. 如果将```compareTo()```返回值写死为-1，元素值每次比较，都认为新插入的元素比上一个元素小，于是二叉树存储时，会存在根的左侧，读取时就是倒序序排列的。



#### 1 自然排序

**实现Comparable接口比较元素**：自然排序使用要排序元素的CompareTo（Object obj）方法来比较元素之间大小关系，然后将元素按照升序排列。

Java提供了一个Comparable接口，该接口里定义了一个compareTo(Object obj)方法，该方法返回一个整数值，实现了该接口的对象就可以比较大小。

**obj1.compareTo(obj2)方法如果返回0，则说明被比较的两个对象相等，如果返回一个正数，则表明obj1大于obj2，如果是 负数，则表明obj1小于obj2。**

   如果我们将两个对象的equals方法总是返回true，则这两个对象的compareTo方法返回应该返回0

利用以上规则，我们就可以按照年龄来排序：

```java
public int CompareTo(Person o){
    int num = this.age - o.age;
    return num == 0 ? this.name.compareTo(o.name) : num; 
}
```

同理按照姓名排序（Unicode编码大小）如下：

```java
public int CompareTo(Person o){
    int num = this.name.compareTo(o.name);
    retrun num == 0 ? this.age - o.age : num;
}
```

按姓名长度排序：

```java
public int CompareTo(Person o){
    int length = this.name.length() - o.name.length();
    int num = length == 0? this.name.compareTo(o.name) : length; 
    return num == 0 ? this.age - o.age : num; 
}
```





#### 2 自定义排序

**自定义比较器比较元素**

自然排序是根据集合元素的大小，以升序排列，如果要定制排序，应该使用Comparator接口，实现 int **compare(To1,To2)**方法

需求:现在要制定TreeSet中按照String长度比较String。

```java
//定义一个类，实现Comparator接口，并重写compare()方法
class CompareByLen implements Comparator<String>{
    @Override
    public int compare(String s1, String s2){    //按照字符串的长度比较
        int num = s1.length() - s2.length();    //长度为主要条件
        return num == 0 ? s1.compareTo(s2) : num;  //内容为次要条件
    }
}
```





## 四、总结

HashSet继承于AbstractSet，实现了Set, Cloneable, Serializable接口。

(1)HashSet继承AbstractSet类，获得了Set接口大部分的实现，减少了实现此接口所需的工作，实际上是又继承了AbstractCollection类；

(2)HashSet实现了Set接口，获取Set接口的方法，可以自定义具体实现，也可以继承AbstractSet类中的实现；

(3)HashSet实现Cloneable，得到了clone()方法，可以实现克隆功能；

(4)HashSet实现Serializable，表示可以被序列化，通过序列化去传输，典型的应用就是hessian协议。

具有如下特点：

- 不允许出现重复因素；
- 允许插入Null值；
- 元素无序（添加顺序和遍历顺序不一致）；
- 线程不安全，若2个线程同时操作HashSet，必须通过代码实现同步；



TreeSet

它继承AbstractSet，实现NavigableSet, Cloneable, Serializable接口。

（1）与HashSet同理，TreeSet继承AbstractSet类，获得了Set集合基础实现操作；

（2）TreeSet实现NavigableSet接口，而NavigableSet又扩展了SortedSet接口。这两个接口主要定义了搜索元素的能力，例如给定某个元素，查找该集合中比给定元素大于、小于、等于的元素集合，或者比给定元素大于、小于、等于的元素个数；简单地说，实现NavigableSet接口使得TreeSet具备了元素搜索功能；

（3）TreeSet实现Cloneable接口，意味着它也可以被克隆；

（4）TreeSet实现了Serializable接口，可以被序列化，可以使用hessian协议来传输；

具有如下特点：

- 对插入的元素进行排序，是一个有序的集合（主要与HashSet的区别）;
- 底层使用红黑树结构，而不是哈希表结构；
- 允许插入Null值；
- 不允许插入重复元素；
- 线程不安全；





## 【参考】

- [Java集合（四）、继承自Collection接口的Set接口](https://www.cnblogs.com/lixiansheng/p/11349379.html)
- [Java中的Set总结](https://www.jianshu.com/p/d6cff3517688)