---
title: Java类与对象
tags: Java基础
categories: Java
abbrlink: 4dffdbe9
date: 2020-08-04 17:50:42
---

Java作为一门纯面向对象的语言，类与对象自然是其核心内容，类是最基本的抽象单位，以对象为单位编码。而最早的面向对象的概念实际上是由IBM提出的，在70年代的Smaltalk语言之中进行了应用，后来根据面向对象的设计思路，才形成C++，而由C++产生了Java这门面向对象的编程语言。

## 一、面向对象

### 1 面向对象简述

先看一下维基百科上关于面向对象的定义：

>**面向对象程序设计**（英语：Object-oriented programming，缩写：OOP）是种具有[对象](https://zh.wikipedia.org/wiki/对象_(计算机科学))概念的[程序编程典范](https://zh.wikipedia.org/wiki/编程范型)，同时也是一种程序开发的抽象方针。它可能包含[数据](https://zh.wikipedia.org/wiki/数据)、[属性](https://zh.wikipedia.org/w/index.php?title=属性_(计算机科学)&action=edit&redlink=1)、[代码](https://zh.wikipedia.org/wiki/源代码)与[方法](https://zh.wikipedia.org/wiki/方法_(電腦科學))。对象则指的是[类](https://zh.wikipedia.org/wiki/类_(计算机科学))的实例。它将[对象](https://zh.wikipedia.org/wiki/物件_(電腦科學))作为[程序](https://zh.wikipedia.org/wiki/计算机程序)的基本单元，将程序和[数据](https://zh.wikipedia.org/wiki/数据)[封装](https://zh.wikipedia.org/wiki/封裝_(物件導向程式設計))其中，以提高软件的重用性、灵活性和扩展性，对象里的程序可以访问及经常修改对象相关连的数据。在面向对象程序编程里，计算机程序会被设计成彼此相关的对象

面向对象的定义中，规定有一些基本特征：

1. 封装：将类的某些信息隐藏在类内部，不允许外部程序直接访问，而是通过该类提供的方法来实现对隐藏信息的操作和访问。
2. 继承：继承就是子类继承父类的特征和行为，使得子类对象（实例）具有父类的实例域和方法，或类从父类继承方法，使得子类具有父类相同的行为。相当于一个"is a"。
3. 多态：多态就是**对象的多种形态。**相同的引用通过不同的实例执行不同的操作

对于面向对象的开发来讲也分为三个过程：OOA（面向对象系统分析）、OOD（面向对象设计）、OOP（面向对象编程）。

<!--more-->

### 2 类和对象概念

类与对象时整个面向对象中最基础的部分。

**类**：是抽象的概念集合，表示的是一个共性的产物，类之中定义的是属性和行为（方法）；
**对象**：对象是一种个性的表示，表示一个独立的个体，每个对象拥有自己独立的属性，依靠属性来区分不同对象。

总结一下就是：类是对象的模板，对象是类的实例。编码中先写类，将类实例化为对象后，使用对象（类不能直接使用，对象可以）

#### 类的创建及初始化

类是指一类事物的抽象，小学生、初中生、大学生都是学生，可以抽象出学生这个类，小学生张三就是学生这个类的一个具体实例。其中类的属性描述了抽象出来的类它的特点，方法描述了它的功能

```java
public class Student{
    String name;
    int age;
    void Study(){}
    
    public Student(String name,int age){
        this.name = name;
        this.age = age;
    }
}
```

说一下**引用**的概念：**如果一个变量的类型是 ’类‘ 类型，而非基本类型，那么该变量又叫做引用。**

例如`new Student()`创建了一个Student对象，但是创建了对象还要能访问啊，为了访问这个对象，会使用引用`Hero zs= new Hero();`其中zs是一个Student类型变量，又叫做引用。new 操作符会为我们在内存中开辟空间，zs是对象名，也是引用，在栈上分配，指向由new在堆上分配的内容

```java
public static void main(String[] args){
    Student zs = new Student("张三",18);
}
```

再来分析一下这个过程：当调用new Student()时，编译器首先检查下原类Student中是否有Student()构造方法，此处因为有public Student(String name,int age)，所以new的时候，直接调用的该方法，但是很多时候，我们并没有显示声明构造方法，此时，编译器在调用的new Student()的时候，会自动为我们的Student类添加一个无参的空Student()构造方法：Student(){}，来执行类的构造过程。

**构造方法与变量**：不论变量放在哪儿，都会先于任意一个方法的执行前执行，包括构造方法，而构造方法是一个类必须会执行的方法，不需要显示的进行调用。同时，不论变量在哪儿分布，只要在方法外部，就一定先于方法初始化。说到这儿，我们不得不谈一下另一个关键的知识点静态块和非静态块。二者都有很简单的声明方式，只需一对大括号{}就行，静态块的话，在前面加static关键字。例如以下代码：

```java
public class Student{
    public Student(int id){
        System.out.println("Student("+id+")");
    }
    public static void main(String[] args){
        Build b = new Build();
    }
}
class Build{
    Student s1 = new Student(1);
    public Build(){
        System.out.println("这是build的block！");
        Student s2 = new Student(2);
    }
    Student s3 = new Student(3);
}
/*Student(1)
 *Student(3)
 *这是build的block！
 *student(2)
*/
```

创建对象的流程：

1. 先装载.class文件，创建Class对象，对静态数据（由static声明的）进行初始化，而且只进行一次初始化。
2. new Build()在堆上进行空间分配。
3. 执行非静态块。
4. 执行所有方法外定义的变量的初始化。
5. 执行构造器。



#### 属性&方法

描述类状态的就叫属性，可以是基本类型也可以是 ”类“ 类型；描述类功能的就叫方法，它由由方法头和方法体构成，其中包含了访问控制符、返回类型、方法名、参数列表等，还可以用关键字实现特殊的功能

当一个属性被**static**修饰的时候，就叫做**类属性**，又叫做**静态属性**，当一个属性被声明成类属性，那么**所有的对象，都共享一个值**

与对象属性对比：不同对象的 对象属性 的值都可能不一样；但是所有对象的类属性的值，都是一样的

比如每个学生的姓名年龄可能会不同，但是他们都有一个共同的身份——学生

```java
class Student{
    String name;
    int age;
    static String identity = "学生";
}
```

再看一段代码：

```java
public class Student {
 
	/*静态块*/
	static{
		System.out.println("静态块！");
	}
	/*非静态块*/
	{
		System.out.println("非静态块~");
	}
	public Student(int id) {
		System.out.println("Student(" + id + ")");
	}
	public static void main(String[] args) {
		Student p1 = new Student(1);
		Student p2 = new Student(2);
	}
}
/*静态块！
 *非静态块~
 *Student(1)
 *非静态块~
 *Student(2)
*/
```

我们new了两个对象，可是静态块只执行了一次，而非静态块执行了两个，且都是在调用构造器之前。我们似乎得出了一些结论：静态块是在类的装载时执行的（装入.class文件后），且只执行一次。而非静态块是在调用构造方法之前执行的，每生成一个实例对象，就会调用一次非静态块。

如静态块一样，其它的静态数据也具有这个特点：<font color="red">初始化只在类装载的时候执行一次。</font>

对于类方法，还有一个重要的特点就是——<font color="red"><u>访问对象方法要建立在有一个对象的前提上，但是访问类方法，不需要对象存在，直接就可以访问</u></font>



#### this

**this**这个关键字，相当于普通话里的“**我**”
**this即代表当前对象**

```java
class Student{
    String name;
    int age;
    Student(String stuName,int stuAge){
        this.name = stuName;
        this.age = stuAge;
    }
    public static void main(String[] args){
        Student zs = new Student("张三",33);
        System.out.println("打印当前对象的虚拟地址："+this);
        //输出Student@c17164
    }
}
```





#### 重载和重写

重载：是指在**同一个类**中，具有相同的方法名，不同的参数列表的方法之间的一种机制。参数列表的不同体现在：类型不同、个数不同、顺序不同，只要满足任一一个，就可以进行方法重载。

```java
void study(String math){}
void study(String english,int grade){}
void study(String cs,String cs_experiment){}
```

同一个方法名，不同的参数，实现不同的功能，这就是方法重载。这样的机制有什么好处？

主要是：同样的功能，调用同样的方法，只需传入不同的参数，增强了程序的可读性和易于维护，当有很多个功能相似的方法的时候，如果我们为每个方法设计一个名称，想通过名称来区分它们的话，会使得程序的可读性差，设计不够巧妙！



重写：重写是在继承中存在的，在两个类（子类和父类之间存在的关系）中，子类重写父类的方法，方法名相同，参数也相同的一种机制。

```java
class animal{
    void animal(String a){
        System.out.println("我是动物："+a);
    }
}
class Dog extends animal{
    void animal(String a){
        System.out.println("我是犬科动物："+a);
    }
}
```

当子类继承了父类后，想对父类的方法功能进行扩展，就可以使用重写，这样做的目的就是：当你需要扩展新的功能的时候，不需要新建方法，在父类的方法中进行补充，这样一种面向对象思维的体现，不用重写同样可以达到这样的效果，但是用了重写更加符合OO思想。类似的还有一种概念，叫**隐藏**：当子类和父类方法名相同，参数不同时，子类隐藏父类的方法实现，这就是一种机制，一种叫法，没什么实际意义，相当于我们新建了方法，只是方法名和父类的相同，但是不是父类的方法的实现。

<font color="blue">**Java中不定参数调用**</font>

有的时候，我们不能确定方法的参数个数，我们可以采取这种机制(String ... value)，这样可以使代码量降低，使得代码尽可能简单

```java
public class Student{
	
	public static String study(String ... value) {
		return "CS专业要学:" + value;
	}
	
	public static void main(String[] args) {
		System.out.println(a("data—structure","algorithm","SQL","Operating-System"));
	}
}
```





### 3 类与对象关系

#### 对象与引用

我们从内存的角度分析。首先，给出两种内存空间的概念：
（1）堆内存：保存对象的属性内容。堆内存需要用new关键字来分配空间；
（2）栈内存：保存的是堆内存的地址（在这里为了分析方便，可以简单理解为栈内存保存的是对象的名字）。

<img src="https://leslie1-1309334886.cos.ap-shanghai.myqcloud.com/obsidian/Java_class.png" style="zoom:80%;" />

如果直接使用没有实例化的对象，就会出现报错：`Exception in thread "main" java.lang.NullPointerException`空指向异常。表示只声明了Student对现象，没有实例化（只有栈空间而没有对应的堆内存空间）



引用和对象：对象只有一个，但是可以有多个引用指向它

```java
Student stu1 = new Student("张三",33);
Student stu2 = stu1;
```

<img src="https://leslie1-1309334886.cos.ap-shanghai.myqcloud.com/obsidian/Java_class2.png" style="zoom:80%;" />

一个引用同时只能指向一个对象

```java
Student stu1 = new Student("张三",33);
Student stu2 = stu1;
Student stu2 = new Student("李四",18);//此时引用stu2指向新的对象
```

<img src="https://leslie1-1309334886.cos.ap-shanghai.myqcloud.com/obsidian/Java_class3.png" style="zoom:80%;" />

再看看下面的一段代码：

```java
Student stu1 = new Student("张三",33);
Student stu2 = new Student("李四",18);
Student stu2 = stu1;
```

<img src="https://leslie1-1309334886.cos.ap-shanghai.myqcloud.com/obsidian/Java_class4.png" style="zoom:80%;" />

此时第二块堆内存空间，没有任何引用指向，这块空间就成为内存垃圾



#### 抽象类与接口

初学Java感觉抽象类和接口有点类似，

抽象类：凡是声明为形如：`abstract void function()`的方法，都是抽象方法，包含抽象方法的类就是抽象类，抽象方法只有声明没有实现。

当然一个类可以在没有抽象方法的前提下声明为抽象类，而一旦被声明为抽象类，因为抽象类没有具体实现的方法，那么它就不能直接实例化。抽象类可以说是对类的抽象

```java
class Student{//包含抽象方法的类就是抽象类
    public abstract void function();
}
public abstract class Student{
    //没有抽象方法也可以声明为抽象类
}
```

抽象类创建了就是为了被继承然后实现，因此一个类继承了抽象类，那么就必须实现父类的抽象方法，如果没有实现那么子类也将定义为abstract类。



接口：指供别人调用的方法或者函数。它是对行为的抽象。在Java中，定一个接口的形式如下：

```java
public interface goTest{
    public void writeTest();
    public void experimentTest();
}
```

可以看出：接口比抽象类更加 “ 抽象 ”。他可以定义变量，但是变量会被隐式地指定为public static final变量（即为常量），而方法会被隐式地指定为public abstract方法且只能是public abstract方法，并且接口中所有的方法不能有具体的实现，也就是说，接口中的方法必须都是抽象方法。



##### Java多继承

Java中只有单继承，不允许多继承，但是可以实现多个接口，相当于间接实现多继承

```java
public interface goStudy{void study();}
public interface goTest{void test();}
public interface goGraduate{void graduate();}
class Student{public void goSchool();}
class JuniorStudent extends Student implements goStudy,goTest,goGraduate{
    @Override
    public void study(){}
    @Override
    public void test(){}
    @Override
    public void graduate(){}
    @Override
    public void goSchool(){}
    
}
```

1、接口可以实现向上转型，多个具有共同属性的类可以将它们的共同点提取出来，做成抽象，这样层次分明，统一管理。

2、接口不具有任何实现，最适合做基类。



抽象类与接口区别：

- 抽象类可以提供成员方法的实现细节，而接口中只能存在public abstract 方法；
- 抽象类中的成员变量可以是各种类型的，而接口中的成员变量只能是public static final类型的；
- 接口中不能含有静态代码块以及静态方法，而抽象类可以有静态代码块和静态方法；
- 一个类只能继承一个抽象类，而一个类却可以实现多个接口。
- 抽象类是对一种事物的抽象，即对类抽象，而接口是对行为的抽象。抽象类是对整个类整体进行抽象，包括属性、行为，但是接口却是对类局部（行为）进行抽象。 

## 【参考】

- [Java类和对象 详解（一）](https://blog.csdn.net/wei_zhi/article/details/52745268)
- [Java之美[从菜鸟到高手演变]之类与对象(一)](https://blog.csdn.net/zhangerqing/article/details/8294039)