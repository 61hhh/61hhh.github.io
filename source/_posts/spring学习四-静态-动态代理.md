---
title: spring学习四-静态/动态代理
date: 2020-10-14 15:38:16
tags: Spring
categories: Spring
---

## 介绍

在对象中可能会有一些公共的行为，例如日志记录、权限验证等，如果每个对象都写上这些就会造成冗余。对此AOP【Aspect Oriented Programming面向切面编程】提供了一种方式：将通用的方法抽离出来并封装，定义为独立的切面，在合适的时机将其横向切入业务流程指定的位置中

![](http://img2.salute61.top/PicGo/SpringAOP1.png)

因为Spring的AOP主要作用就是通过不修改源代码的方式，将非核心的功能代码织入，来实现对方法的增强，而它实现的原理，关键就在于使用代理模式

代理模式的分类：静态代理；动态代理

<!--more-->



## 静态代理

**静态代理角色分析**

- 抽象角色 : 一般使用接口或者抽象类来实现
- 真实角色 : 被代理的角色
- 代理角色 : 代理真实角色 ; 代理真实角色后 , 一般会做一些附属的操作 .
- 客户  :  使用代理角色来进行一些操作 .

1、创建一个抽象角色，比如一些基础的增删改查业务

```java
public interface UserService {
    public void add();
    public void delete();
    public void update();
    public void select();
}
```

2、一个完成这些业务操作的真实对象

```java
public class UserServiceImpl {
    public void add(){
        System.out.println("增加用户！");
    }
    public void delete(){
        System.out.println("删除用户！");
    }
    public void update(){
        System.out.println("修改用户！");
    }
    public void select(){
        System.out.println("查询用户！");
    }
}
```

3、对于需求的变更，比如要新增一个日志功能，实现调用每个函数都有对应的日志输出：

- 实现1：在原来的接口和实现类上去加。这样太过麻烦
- 实现2：使用代理实现，在不改变原来业务的情况下增加

4、设置代理类处理日志，即代理角色

```java
public class UserServiceProxy {
    private UserServiceImpl userService;

    public void setUserService(UserServiceImpl userService) {
        this.userService = userService;
    }

    public void add(){
        log("add");
        userService.add();
    }
    public void delete(){
        log("delete");
        userService.delete();
    }
    public void update(){
        log("update");
        userService.update();
    }
    public void select(){
        log("select");
        userService.select();
    }

    //增加日志功能不再需要去每个原有方法里添加代码
    public void log(String msg){
        System.out.println("[debug] 使用了"+msg+"方法");
    }
}
```

5、编写测试代码，即客户

```java
public class Client {
    public static void main(String[] args) {
        UserServiceImpl userService = new UserServiceImpl();
        UserServiceProxy proxy = new UserServiceProxy();
        proxy.setUserService(userService);

        proxy.add();
    }
}
//输出：
//		[debug] 使用了add方法
//		增加用户！
```



通过代理类处理日志，<font color="red"> 我们在不改变原来的代码的情况下，实现了对原有功能的增强，这是AOP中最核心的思想</font>



## 动态代理

动态代理和静态代理的角色都是用到了代理，区别就在于：动态代理是动态生成的，而静态代理是提前把代理类写好了。动态代理分类：一种是基于接口动态代理；一种是基于类动态代理

- 基于接口：JDK动态代理
- 基于类：cglib

以JDK的代理为例，**JDK的动态代理需要了解两个类** :` InvocationHandler` 和`Proxy`， 打开JDK帮助文档

【InvocationHandler：调用处理程序】

![](http://img2.salute61.top/PicGo/image-20201014163240768.png)

```java
Object invoke(Object proxy, 方法 method, Object[] args)；
//参数
//proxy - 调用该方法的代理实例
//method -所述方法对应于调用代理实例上的接口方法的实例。方法对象的声明类将是该方法声明的接口，它可以是代理类继承该方法的代理接口的超级接口。
//args -包含的方法调用传递代理实例的参数值的对象的阵列，或null如果接口方法没有参数。原始类型的参数包含在适当的原始包装器类的实例中，例如java.lang.Integer或
```

【Proxy  : 代理】

![image-20201014163539946](http://img2.salute61.top/PicGo/image-20201014163539946.png)

![image-20201014163919216](http://img2.salute61.top/PicGo/image-20201014163919216.png)

```java
//生成代理类
public Object getProxy(){
   return Proxy.newProxyInstance(this.getClass().getClassLoader(),
                                 rent.getClass().getInterfaces(),this);
}
```



### 代码实现

以租房子为例，现在我们租房买房都是通过第三方中介来实现，中介就相当于代理角色，我们和房东就相当于真实角色，而租房这一操作就是客户

1、抽象角色，定义一个租房接口

```java
//租房的接口
public interface Rent {
    public void rent();
}

```

2、真实角色，要出租房子的房东

```java
//房东
public class Host implements Rent{
    public void rent() {
        System.out.println("房东要出租房子！");
    }
}
```

3、代理角色

```java
//用这个类自动生成代理类
public class ProxyInvocationHandler implements InvocationHandler {
//方法类型：
//    Foo f = (Foo) Proxy.newProxyInstance(Foo.class.getClassLoader(),
//            new Class<?>[] { Foo.class },
//            handler);

    //被代理的接口 作为newProxyInstanced的参数二
    private Rent rent;

    public void setRent(Rent rent) {
        this.rent = rent;
    }

    //生成得到代理类
    public Object getProxy(){
        return Proxy.newProxyInstance(this.getClass().getClassLoader(),rent.getClass().getInterfaces(),this);
    }

    //处理代理实例，并返回结果
    public Object invoke(Object proxy, Method method, Object[] args) throws Throwable {
        //动态代理的本质——就是使用反射机制实现！
        Object result = method.invoke(rent, args);
        seeHouse();
        fare();
        return result;
    }

    //附加操作
    public void seeHouse(){
        System.out.println("中介带你看房子!");
    }
    public void fare(){
        System.out.println("中介费!");
    }
}
```

客户

```java
public class Client {
    public static void main(String[] args) {
        //真实角色
        Host host = new Host();
        //代理角色 现在只有代理角色处理程序，并没有真实的代理角色
        ProxyInvocationHandler pih = new ProxyInvocationHandler();
        //通过调用处理程序 处理我们要调用的接口对象
        pih.setRent(host);

        //代理角色没有对应的类 而是由处理类实现！
        Rent proxy = (Rent) pih.getProxy();
        proxy.rent();
    }
}
//输出：
//		房东要出租房子！
//		中介带你看房子!
//		中介费!
```

**【总结】：**一个动态代理往往代理一类业务，他代理的是业务接口

使用动态代理可以抽离公共的代码，降低冗余、简化我们的开发，使真实角色更加存粹



































































