---
title: Java集合（四）Map接口
tags: Java基础
categories: Java
abbrlink: 2d663ae
date: 2020-08-09 14:35:28
---

## 一、Map接口简述

`public interface Map<K,V> `集合采取**键值对(key-value)方式**存储数据，<u>其中key必须唯一；value可以不唯一且value对象类型也可以是Map</u>，类似数组中的元素还可以是数组。例如：学生教务系统中，学号和学生信息就是一个key-value映射，学号是唯一的，信息可能就名字，也可能是姓名年龄专业的一个数据结构。存储时是学号和学生信息一对放一起存进去

Map集合和Set集合很像，因为Set集合的底层就是使用了Map。

Map集合是键值对形式存储值的，所以遍历Map集合无非就是获取键和值，根据实际需求，进行获取键和值。



Map接口提供三种collection试图，允许以键集、值集或键-值集映射关系集的形式查看某个映射的内容。映射顺序 定义为迭代器在映射的 collection 视图上返回其元素的顺序。某些映射实现可明确保证其顺序，如 TreeMap 类；另一些映射实现则不保证顺序，如 HashMap 类。

注：

将可变对象用作映射键时必须格外小心。当对象是映射中某个键时，如果以影响 equals 比较的方式更改了对象的值，则映射的行为将是不确定的。此项禁止的一种特殊情况是不允许某个映射将自身作为一个键包含。虽然允许某个映射将自身作为值包含，但请格外小心：在这样的映射上 equals 和 hashCode 方法的定义将不再是明确的。



所有通用的映射实现类应该提供两个“标准的”构造方法：

一个 void（无参数）构造方法，用于创建空映射；

一个是带有单个 Map 类型参数的构造方法，用于创建一个与其参数具有相同键-值映射关系的新映射。

实际上，后一个构造方法允许用户复制任意映射，生成所需类的一个等价映射。尽管无法强制执行此建议（因为接口不能包含构造方法），但是 JDK 中所有通用的映射实现都遵从它。

<!--more-->



## 二、Map实现类

Map接口的常用方法及其源码：

```java
public interface Map<K, V>{

    int size();        //返回此映射中的键-值映射关系数。

    boolean isEmpty();    //如果此映射未包含键-值映射关系，则返回 true。

    boolean containsKey(Object key);    //如果此映射包含指定键的映射关系，则返回 true。

    boolean containsValue(Object value)    //如果此映射将一个或多个键映射到指定值，则返回 true。

    V get(Object key);     //根据key查找对应value数据，如果没有，则返回 null。

    V put(K key, V value);    //向集合保存数据可选操作）。

    V remove(Object key);    //如果存在一个键的映射关系，则将其从此映射中移除（可选操作）。

    void putAll(Map<? extends K, ? extends V> m); //从指定映射中将所有映射关系复制到此映射中（可选操作）。

    void clear();    //从此映射中移除所有映射关系（可选操作）。

    Set<K> KeySet();     //返取出全部key。

    Collection<V> values();    //返回此映射中包含的值的 Collection 视图。

    Set<Map, Entry<K, V>> entrySet();    //即将Map集合转化为Set集合。


    interface Entry<K, V> {

        K getKey();

        V getValue();

        V setValue(V value);

        boolean equals(Object o);

        int hashCode();        
    }

    boolean equals(Object o);    //比较指定的对象与此映射是否相等。

    int hashCode();        //返回此映射的哈希码值。
}
```

**方法描述：**

| 方法名              | 描述                                                         |
| ------------------- | ------------------------------------------------------------ |
| clear()             | 从此映射中移除所有映射关系（可选操作）。                     |
| entrySet()          | 返回此映射中包含的映射关系的 Set 视图。                      |
| get(Object key)     | 返回指定键所映射的值；如果此映射不包含该键的映射关系，则返回 null。 |
| isEmpty()           | 如果此映射未包含键-值映射关系，则返回 true。                 |
| keySet()            | 返回此映射中包含的键的 Set 视图。                            |
| put(K key, V value) | 将指定的值与此映射中的指定键关联（可选操作）。               |
| remove(Object key   | 如果存在一个键的映射关系，则将其从此映射中移除（可选操作）。 |
| equals(Object o)    | 比较指定的对象与此映射是否相等。                             |
| hashCode()          | 返回此映射的哈希码值。                                       |

**Map接口的具体实现类：**

|      实现类       |                 描述                  |
| :---------------: | :-----------------------------------: |
|      HashMap      |      基于hash表的实现（不同步）       |
|      TreeMap      |   基于红黑树的实现（排序，不同步）    |
|   LinkedHashMap   |             有序的hash表              |
| ConcurrentHashMap |             同步的hash表              |
|     Hashtable     | 同步的hash（被ConcurrentHashMap取代） |



## 三、Map的两种取值方式

Map中没有直接取出元素的方法，而是要先转成Set集合，再通过迭代获取元素。取值方式：KeySet、entrySet

### 1 KeySet

将Map集合中所有的键存入到Set集合。因为Set集合具备迭代器，所以可以通过迭代方法取出所有的键，再根据get()方法，获取每一个键对应的值。

![](http://img2.salute61.top/Java_keySet.png)

```java
interface Map{
	public static interface Entry{
		public abstract Object getKey();
		public abstract Object getValue();
	}
}
 //Map.Entry是Map接口的一个内部接口
class HashMap implements Map{
	class Hahs implements Map.Entry{
		public Object getKey(){};
		public Object getValue(){};
	}
}
```





### 2 entrySet

先获取map中的键值关系封装成一个个的entry对象， 存储到一个Set集合中，再迭代这个Set集合， 根据entry获取对应的key和value。

![](http://img2.salute61.top/Java_entrySet.png)



## 四、HashMap

HashMap也是我们使用非常多的Collection，它是基于哈希表的 Map 接口的实现，以key-value的形式存在。在HashMap中，key-value总是会当做一个整体来处理，系统会根据hash算法来来计算key-value的存储位置，我们总是可以通过key快速地存、取value。下面就来分析HashMap的存取。

### 1 定义

HashMap实现了Map接口，继承AbstractMap。其中Map接口定义了键映射到值的规则，而AbstractMap类提供 Map 接口的骨干实现，以最大限度地减少实现此接口所需的工作

```java
public class HashMap<K,V> extends AbstractMap<K,V>
    implements Map<K,V>, Cloneable, Serializable {
    
}
```



### 2 构造函数

HashMap提供了三个构造函数：

- HashMap()：构造一个具有默认初始容量 (16) 和默认加载因子 (0.75) 的空 HashMap。
- HashMap(int initialCapacity)：构造一个带指定初始容量和默认加载因子 (0.75) 的空 HashMap。
- HashMap(int initialCapacity, float loadFactor)：构造一个带指定初始容量和加载因子的空 HashMap。

在这里提到了两个参数：初始容量，加载因子。其中容量表示哈希表中桶的数量，初始容量是创建哈希表时的容量，加载因子是哈希表在其容量自动增加之前可以达到多满的一种尺度，它衡量的是一个散列表的空间的使用程度，负载因子越大表示散列表的装填程度越高，反之愈小。

对于使用链表法的散列表来说，查找一个元素的平均时间是O(1+a)，因此如果负载因子越大，对空间的利用更充分，然而后果是查找效率的降低；如果负载因子太小，那么散列表的数据将过于稀疏，对空间造成严重浪费。系统默认负载因子为0.75，一般情况下我们是无需修改的。

构造函数的源码如下（JDK1.8）：

```java
    public HashMap(int initialCapacity, float loadFactor) {
        if (initialCapacity < 0)
            throw new IllegalArgumentException("Illegal initial capacity: " +
                                               initialCapacity);
        if (initialCapacity > MAXIMUM_CAPACITY)
            initialCapacity = MAXIMUM_CAPACITY;
        if (loadFactor <= 0 || Float.isNaN(loadFactor))
            throw new IllegalArgumentException("Illegal load factor: " +
                                               loadFactor);
        this.loadFactor = loadFactor;
        this.threshold = tableSizeFor(initialCapacity);
    }
```



### 3 数据结构

HashMap是一个散列表结构，是基于哈希表的Map接口的非同步实现，提供了所有可选的映射操作，并允许使用null作为键值对；但是它不能保证映射顺序。

#### 位桶

Node类型的数组，也成为Hash桶

```java
transient Node<K,V>[] table;
```

#### Node对象

Node是HashMap的一个内部类，实现了Map.Entry接口，本质是就是一个映射(键值对)。

```java
static class Node<K,V> implements Map.Entry<K,V> {
    final int hash;
    final K key;
    V value;
    Node<K,V> next;//指向链表的下一层（产生冲突时拉链）

    Node(int hash, K key, V value, Node<K,V> next) {//Node的构造方法
        this.hash = hash;
        this.key = key;
        this.value = value;
        this.next = next;
    }
    //相应的get方法
    public final K getKey()        { return key; }
    public final V getValue()      { return value; }
    public final String toString() { return key + "=" + value; }
    //hashCode方法
    public final int hashCode() {
        return Objects.hashCode(key) ^ Objects.hashCode(value);
    }
    //设置值
    public final V setValue(V newValue) {
        V oldValue = value;
        value = newValue;
        return oldValue;
    }
    //重写equals方法
    public final boolean equals(Object o) {
        //......
    }
}
//Map.Entry的实现——继承了HashMap.Node
static class Entry<K,V> extends HashMap.Node<K,V> {
    Entry<K,V> before, after;
    Entry(int hash, K key, V value, Node<K,V> next) {
        super(hash, key, value, next);
    }
}
```

#### 红黑树

```java
//红黑树
static final class TreeNode<k,v> extends LinkedHashMap.Entry<k,v> {
    TreeNode<k,v> parent;  // 父节点
    TreeNode<k,v> left; //左子树
    TreeNode<k,v> right;//右子树
    TreeNode<k,v> prev;    // needed to unlink next upon deletion
    boolean red;    //颜色属性
    TreeNode(int hash, K key, V val, Node<k,v> next) {
        super(hash, key, val, next);
    }
    //返回当前节点的根节点
    final TreeNode<k,v> root() {
        for (TreeNode<k,v> r = this, p;;) {
            if ((p = r.parent) == null)
                return r;
            r = p;
        }
    }
}
```



### 4 工作原理

HashMap是基于hashing的原理，我们使用put(key, value)存储对象到HashMap中，使用get(key)从HashMap中获取对象。当我们给put()方法传递键和值时，我们先对键调用hashCode()方法，计算并返回的hashCode是用于找到Map数组的bucket位置来储存Node 对象。这里关键点在于指出，HashMap是在bucket中储存键对象和值对象，作为Map.Node 。

#### hash方法

```java
//取hash值方法，HashMap的put方法的也是调用了这个方法，get方法也调用这个方法
//保证存取时key值对应的hash值是一致的，这样才能正确对应 
 static final int hash(Object key) {
        int h;
        return (key == null) ? 0 : (h = key.hashCode()) ^ (h >>> 16);
}
```



#### 存储实现：put(key,vlaue)

以JDK1.8为例，描述put的基本过程：

- ①判断键值对数组table[i]是否为空或为null，否则执行resize()进行扩容；
- ②根据键值key计算hash值得到插入的数组索引i，如果table[i]==null，直接新建节点添加，转向⑥，如果table[i]不为空，转向③；
- ③判断table[i]的首个元素是否和key一样，如果相同直接覆盖value，否则转向④，这里的相同指的是hashCode以及equals；
- ④判断table[i] 是否为treeNode，即table[i] 是否是红黑树，如果是红黑树，则直接在树中插入键值对，否则转向⑤；
- ⑤遍历table[i]，判断链表长度是否大于8，大于8的话把链表转换为红黑树，在红黑树中执行插入操作，否则进行链表的插入操作；遍历过程中若发现key已经存在直接覆盖value即可；
- ⑥插入成功后，判断实际存在的键值对数量size是否超多了最大容量threshold，如果超过，进行扩容。

**put方法的源码如下，简单分析一下：**

```java
public V put(K key, V value) {
    //调用putVal方法
    return putVal(hash(key), key, value, false, true);
}
final V putVal(int hash, K key, V value, boolean onlyIfAbsent,boolean evict) {
    //Node数组tab即为hashmap的链表数组、p是链表对象、n是长度、i是索引
    Node<K,V>[] tab; Node<K,V> p; int n, i;
    //tab为空就调用resize()方法扩容
    if ((tab = table) == null || (n = tab.length) == 0)
        n = (tab = resize()).length;
    //通过(n - 1) & hash运算得到的下标i，对应tab中为空，就newNode插入
    if ((p = tab[i = (n - 1) & hash]) == null)
        tab[i] = newNode(hash, key, value, null);
    //tab[i]不为空 ——> 发生碰撞冲突
    else {
        //定义变量Node e ,key k
        Node<K,V> e; K k;
        //p的hash值等于参数hash，key也等于参数key且非空，就把p存到e中
        if (p.hash == hash &&((k = p.key) == key || (key != null && key.equals(k))))
            e = p;
        //tab[i]是红黑树，直接插入键值对
        else if (p instanceof TreeNode)
            e = ((TreeNode<K,V>)p).putTreeVal(this, tab, hash, key, value);
        //tab[i]是链表
        else {
            //遍历tab[i]链表
            for (int binCount = 0; ; ++binCount) {
                //如果p是最后一个node,就直接新建结点添加
                if ((e = p.next) == null) {
                    p.next = newNode(hash, key, value, null);
                    //TREEIFY_THRESHOLD = 8
                    //判断链表长度是否大于8，是就转换成红黑树
                    if (binCount >= TREEIFY_THRESHOLD - 1) // -1 for 1st
                        treeifyBin(tab, hash);
                    break;
                }
                //找到与待插入元素有相同hash值和key值的结点(碰撞节点)就停止，替换
                if (e.hash == hash &&
                    ((k = e.key) == key || (key != null && key.equals(k))))
                    break;
                p = e;
            }
        }
        //e不为空,将e添加到tab中,将原来键值对中的oldVlaue用e.value替换
        if (e != null) { // 存在key的映射
            V oldValue = e.value;
            if (!onlyIfAbsent || oldValue == null)
                e.value = value;
            afterNodeAccess(e);
            return oldValue;
        }
    }
    //修改次数加1
    ++modCount;
    //判断是否超过扩容阈值,超过就扩容,先扩容再添加
    if (++size > threshold)
        resize();
    afterNodeInsertion(evict);
    return null;
}
```

基本流程可以理解为如下图：(来源：https://blog.csdn.net/alashanMt/article/details/107684187)

![](http://img2.salute61.top/Java_Map-put.jpg)



#### 读取实现：get(key)

通过get方法来获取，而get方法就是通过getNode来取得元素的。

```java
 public V get(Object key) {
        //定义一个Node对象来接收
        Node<K,V> e;
        //调用getNode()方法
        return (e = getNode(hash(key), key)) == null ? null : e.value;
}    
     
final Node<K,V> getNode(int hash, Object key) {
        //类似putVal方法,定义变量
        Node<K,V>[] tab; Node<K,V> first, e; int n; K k;
        //判断数组table是否已初始化,长度大于0
    	//通过[(n - 1) & hash]获取key对应的索引不为空
        if ((tab = table) != null && (n = tab.length) > 0 &&
            (first = tab[(n - 1) & hash]) != null) {
            //first就是桶中的第一项(数组元素),hash值和key值都相等,返回first结点
            if (first.hash == hash &&
                ((k = first.key) == key || (key != null && key.equals(k))))
                return first;
            //桶中不止一个结点,就用first.next找它的后继节点,并赋值给e变量 
            if ((e = first.next) != null) {
                //如果首节点是树类型的，那么直接调用getTreeNode()方法去红黑树里找
                if (first instanceof TreeNode)
                    return ((TreeNode<K,V>)first).getTreeNode(hash, key);
                //否则在链表中查找
                //只要e.next不为空就遍历,找到和传进来key相符合的节点，然后返回 
                do {
                    if (e.hash == hash &&
                        ((k = e.key) == key || (key != null && key.equals(k))))
                        return e;
                } while ((e = e.next) != null);
            }
        }
        //以上条件都不满足，说明没有该key对应的数据节点，返回null
        return null;
    }

```



#### resize方法扩容

- 在jdk1.8中，resize方法是在hashmap中的键值对大于阀值时或者初始化时，就调用resize方法进行扩容；
  - 例如负载因子为0.75，map填满了75%的bucket时，就会创建原来hashmap两倍大小的bucket，并将原来的对象放入新的bucket数组中，这个过程叫作rehashing。
- 每次扩展的时候，都是扩展2倍；
- 扩展后Node对象的位置要么在原位置，要么移动到<原下标+OldCap>位置。

```java
final Node<K,V>[] resize() {
    Node<K,V>[] oldTab = table;//oldTab指向hash桶数组
    int oldCap = (oldTab == null) ? 0 : oldTab.length;
    int oldThr = threshold;
    int newCap, newThr = 0;
    if (oldCap > 0) {//如果oldCap不为空的话，就是hash桶数组不为空
        if (oldCap >= MAXIMUM_CAPACITY) {//如果大于最大容量了，就赋值为整数最大的阀值
            threshold = Integer.MAX_VALUE;
            return oldTab;//返回
        }//如果当前hash桶数组的长度在扩容后仍然小于最大容量 并且oldCap大于默认值16
        else if ((newCap = oldCap << 1) < MAXIMUM_CAPACITY &&
                 oldCap >= DEFAULT_INITIAL_CAPACITY)
            newThr = oldThr << 1; // double threshold 双倍扩容阀值threshold
    }
    else if (oldThr > 0) // initial capacity was placed in threshold
        newCap = oldThr;
    else {               // zero initial threshold signifies using defaults
        newCap = DEFAULT_INITIAL_CAPACITY;
        newThr = (int)(DEFAULT_LOAD_FACTOR * DEFAULT_INITIAL_CAPACITY);
    }
    if (newThr == 0) {
        float ft = (float)newCap * loadFactor;
        newThr = (newCap < MAXIMUM_CAPACITY && ft < (float)MAXIMUM_CAPACITY ?
                  (int)ft : Integer.MAX_VALUE);
    }
    threshold = newThr;
    @SuppressWarnings({"rawtypes","unchecked"})
        Node<K,V>[] newTab = (Node<K,V>[])new Node[newCap];//新建hash桶数组
    table = newTab;//将新数组的值复制给旧的hash桶数组
    if (oldTab != null) {//进行扩容操作，复制Node对象值到新的hash桶数组
        for (int j = 0; j < oldCap; ++j) {
            Node<K,V> e;
            if ((e = oldTab[j]) != null) {//如果旧的hash桶数组在j结点处不为空，复制给e
                oldTab[j] = null;//将旧的hash桶数组在j结点处设置为空，方便gc
                if (e.next == null)//如果e后面没有Node结点
                    newTab[e.hash & (newCap - 1)] = e;//直接对e的hash值对新的数组长度求模获得存储位置
                else if (e instanceof TreeNode)//如果e是红黑树的类型，那么添加到红黑树中
                    ((TreeNode<K,V>)e).split(this, newTab, j, oldCap);
                else { // preserve order
                    Node<K,V> loHead = null, loTail = null;
                    Node<K,V> hiHead = null, hiTail = null;
                    Node<K,V> next;
                    do {
                        next = e.next;//将Node结点的next赋值给next
                        if ((e.hash & oldCap) == 0) {//如果结点e的hash值与原hash桶数组的长度作与运算为0
                            if (loTail == null)//如果loTail为null
                                loHead = e;//将e结点赋值给loHead
                            else
                                loTail.next = e;//否则将e赋值给loTail.next
                            loTail = e;//然后将e复制给loTail
                        }
                        else {//如果结点e的hash值与原hash桶数组的长度作与运算不为0
                            if (hiTail == null)//如果hiTail为null
                                hiHead = e;//将e赋值给hiHead
                            else
                                hiTail.next = e;//如果hiTail不为空，将e复制给hiTail.next
                            hiTail = e;//将e复制个hiTail
                        }
                    } while ((e = next) != null);//直到e为空
                    if (loTail != null) {//如果loTail不为空
                        loTail.next = null;//将loTail.next设置为空
                        newTab[j] = loHead;//将loHead赋值给新的hash桶数组[j]处
                    }
                    if (hiTail != null) {//如果hiTail不为空
                        hiTail.next = null;//将hiTail.next赋值为空
                        newTab[j + oldCap] = hiHead;//将hiHead赋值给新的hash桶数组[j+旧hash桶数组长度]
                    }
                }
            }
        }
    }
    return newTab;
}
```





## 【参考】

- [Java集合（五）、Map接口介绍](https://www.cnblogs.com/lixiansheng/p/11349386.html)
- [JDK1.8 HashMap源码分析](https://www.cnblogs.com/xiaoxi/p/7233201.html)