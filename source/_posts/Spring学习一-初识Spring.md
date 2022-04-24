---
title: Spring学习一-初识Spring
date: 2020-10-05 15:24:48
tags: Spring
categories: Spring
---

## 介绍

Spring作为Java开发应用最为广泛的一个框架（甚至可以说它是默认的JavaEE框架）能做很多事，它为企业级开发提供了丰富的功能，它们的底层都依赖于两个核心特性：依赖注入【DI：Dependency injection】和面向切面编程【AOP：Aspect Oriented Programming】。可以说它的**成功来源于理念，而不是技术本身**！

**什么是 Spring：**

1. Spring 是一个**轻量级的 DI / IoC 和 AOP 容器的开源框架**，最早由 Rod Johnson创建，并在其著作**《Expert one on one J2EE design and development》**中进行介绍。
2. Spring 提倡以**“最小侵入性”**的方式来管理应用中的代码，这意味着我们可以随时安装或者卸载 Spring

- **适用范围：任何 Java 应用**
- **Spring 的根本使命：简化 Java 开发**

<!--more-->



## Spring组成模块

Spring 框架是一个分层架构，由 7 个定义良好的模块组成。Spring 模块构建在核心容器之上，核心容器定义了创建、配置和管理 bean 的方式 .

<img src="http://img2.salute61.top/Spring%E4%BA%86%E8%A7%A301.png" style="zoom:67%;" />

组成 Spring 框架的每个模块（或组件）都可以单独存在，或者与其他一个或多个模块联合实现。每个模块的功能如下：

- **核心容器(Spring Core)**：核心容器提供 Spring 框架的基本功能。核心容器的主要组件是 BeanFactory，它是工厂模式的实现。BeanFactory 使用*控制反转*（IOC） 模式将应用程序的配置和依赖性规范与实际的应用程序代码分开。
- **Spring 上下文**：Spring 上下文是一个配置文件，向 Spring 框架提供上下文信息。Spring 上下文包括企业服务，例如 JNDI、EJB、电子邮件、国际化、校验和调度功能。
- **Spring AOP**：通过配置管理特性，Spring AOP 模块直接将面向切面的编程功能 , 集成到了 Spring 框架中。所以，可以很容易地使 Spring 框架管理任何支持 AOP的对象。Spring AOP 模块为基于 Spring 的应用程序中的对象提供了事务管理服务。通过使用 Spring AOP，不用依赖组件，就可以将声明性事务管理集成到应用程序中。
- **Spring DAO**：JDBC DAO 抽象层提供了有意义的异常层次结构，可用该结构来管理异常处理和不同数据库供应商抛出的错误消息。异常层次结构简化了错误处理，并且极大地降低了需要编写的异常代码数量（例如打开和关闭连接）。Spring DAO 的面向 JDBC 的异常遵从通用的 DAO 异常层次结构。
- **Spring ORM**：Spring 框架插入了若干个 ORM 框架，从而提供了 ORM 的对象关系工具，其中包括 JDO、Hibernate 和 iBatis SQL Map。所有这些都遵从 Spring 的通用事务和 DAO 异常层次结构。
- **Spring Web 模块**：Web 上下文模块建立在应用程序上下文模块之上，为基于 Web 的应用程序提供了上下文。所以，Spring 框架支持与 Jakarta Struts 的集成。Web 模块还简化了处理多部分请求以及将请求参数绑定到域对象的工作。
- **Spring MVC 框架**：MVC 框架是一个全功能的构建 Web 应用程序的 MVC 实现。通过策略接口，MVC 框架变成为高度可配置的，MVC 容纳了大量视图技术，其中包括 JSP、Velocity、Tiles、iText 和 POI。



## IoC基础

**IoC：Inverse of Control（控制反转）**并不是什么技术，而是一种**设计思想**，就是<font color="blue">**将原本在程序中手动创建对象的控制权，交由Spring框架来管理。**</font>DI(依赖注入)是实现IoC的一种方法，也有人认为DI只是IoC的另一种说法。没有IoC的程序中 , 我们使用面向对象编程 , 对象的创建与对象间的依赖关系完全硬编码在程序中，对象的创建由程序自己控制，控制反转后将对象的创建转移给第三方，个人认为所谓控制反转就是：获得依赖对象的方式反转了。

新建一个项目，参照我们原来的写法：创建Dao接口-->写Dao实现类-->写Service接口-->写service接口实现类-->测试代码。【通过service接口实现获取Dao接口，具体的实现通过接口的实现类完成】

1、先写一个UserDao接口

```java
public interface UserDao {
   public void getUser();
}
```

2、再去写Dao的实现类

```java
public class UserDaoImpl implements UserDao {
   @Override
   public void getUser() {
       System.out.println("获取用户数据");
  }
}
```

3、然后去写UserService的接口

```java
public interface UserService {
   public void getUser();
}
```

4、最后写Service的实现类

```java
public class UserServiceImpl implements UserService {
   private UserDao userDao = new UserDaoImpl();

   @Override
   public void getUser() {
       userDao.getUser();
  }
}
```

5、测试一下

```java
@Test
public void test(){
   UserService service = new UserServiceImpl();
   service.getUser();
}
```

得到输出：`获取用户数据`，验证代码无误。

此时如果要新增一个数据库操作用户数据

```java
public class UserDaoMySqlImpl implements UserDao {
   @Override
   public void getUser() {
       System.out.println("MySql获取用户数据");
  }
}
```

如果我们要去使用MySql的话 , 我们就需要去service实现类里面修改对应的实现

```java
public class UserServiceImpl implements UserService {
   private UserDao userDao = new UserDaoMySqlImpl();

   @Override
   public void getUser() {
       userDao.getUser();
  }
}
```

如果以后增加了Oracle实现、增加了MongDB实现······每次增加不同的实现都要去service实现类中修改对应实现，这就意味着每次需求变更都要修改代码，对于需求量很大的情况下工作量会爆增——原因就是代码设计的耦合性太高了！

### 设计修改的思路

- 其实上述的代码思路就是我们人类思考的正常思路——需要什么就去实现什么。可以理解为依赖正置；
- 我们要做的就是反过来思考——先对现实世界进行抽象，抽象的结果就是有了抽象类和接口，然后我们根据需求进行设计。这就是《面向对象设计与分析》中的**依赖倒转原则DIP**

回顾依赖倒转原则：了解依赖的三种写法

1. 通过构造函数实现依赖
2. Setter方法传递依赖对象 
3. 接口声明依赖对象

上面的代码就是通过构造函数实现，结构如下：

![](http://img2.salute61.top/Spring%E4%BA%86%E8%A7%A302.png)

我们可以在需要用到他的地方 , 不去实现它 , 而是留出一个接口 , 利用setter方法将其作为参数传入：

```java
public class UserServiceImpl implements UserService {
//    private UserDao userDao = new UserDaoImpl();
//    要修改业务就必须修改原有代码,使得操作很复杂
//    private UserDao userDao = new UserDaoMysqlImpl();
//    private UserDao userDao = new UserDaoOracleImpl();

    //简化方法：利用set方法,将userDao作为参数传入,保证主动权在调用者手中
    private UserDao userDao;
    public void setUserDao(UserDao userDao){
        this.userDao = userDao;
    }

    @Override
    public void getUser() {
        userDao.getUser();
    }
}
```

此时代码已经发生了很大的变化——由之前的程序控制创建，到现在自行传参，将控制的主动权交给了调用者手中，我们不需要再去一个个的创建对应的实现了，程序只负责提供一个接口即可，我们完全可以把关注点放在业务实现、算法思路上了！这就是IoC的基本思想。

再看我们的代码结构：

![](http://img2.salute61.top/Spring%E4%BA%86%E8%A7%A3022.png)

**IoC是Spring框架的核心内容**，使用多种方式完美的实现了IoC，可以使用XML配置，也可以使用注解，新版本的Spring也可以零配置实现IoC。

Spring容器在初始化时先读取配置文件，根据配置文件或元数据创建与组织对象存入容器中，程序使用时再从Ioc容器中取出需要的对象。

采用XML方式配置Bean的时候，Bean的定义信息是和实现分离的，而采用注解的方式可以把两者合为一体，Bean的定义信息直接以注解的形式定义在实现类中，从而达到了零配置的目的。

**控制反转是一种通过描述（XML或注解）并通过第三方去生产或获取特定对象的方式。在Spring中实现控制反转的是IoC容器，其实现方法是依赖注入（Dependency Injection,DI）。**





































