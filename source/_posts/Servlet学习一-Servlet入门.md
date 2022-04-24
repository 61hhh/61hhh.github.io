---
title: Servlet学习一-Servlet入门
date: 2020-11-04 15:58:30
tags: JavaWeb
categories: Java
---

## Servlet简介

Java Servlet 是运行在 **Web 服务器或应用服务器上**的程序，它是作为来自 Web 浏览器或其他 HTTP 客户端的请求和 HTTP 服务器上的数据库或应用程序之间的中间层。

![Servlet架构](http://img2.salute61.top/PicGo/image-20201104160436506.png)

作用：处理浏览器带来的HTTP请求，并返回一个响应给浏览器，从而实现浏览器和服务器的交互

开发步骤：

1. 编写一个Servlet程序
2. 部署到Web服务器

【注】：我们一般将Servlet部署在如Tomcat之类的服务器上，关于Tomcat的介绍，可以看之前的博客：[Tomcat学习](http://salute61.top/2020/07/05/Tomcat%E5%AD%A6%E4%B9%A0/)

<!--more-->



## 项目准备

1、新建一个maven项目，然后删除原来的项目结构（即原来的src目录），在主项目的pom.xml中导入依赖

```xml
<dependencies>
    <!-- https://mvnrepository.com/artifact/javax.servlet/javax.servlet-api -->
    <dependency>
        <groupId>javax.servlet</groupId>
        <artifactId>javax.servlet-api</artifactId>
        <version>4.0.1</version>
    </dependency>
    <!-- https://mvnrepository.com/artifact/javax.servlet.jsp/javax.servlet.jsp-api -->
    <dependency>
        <groupId>javax.servlet.jsp</groupId>
        <artifactId>jsp-api</artifactId>
        <version>2.1</version>
    </dependency>

</dependencies>
```

2、创建modules，勾选Create from archetype，选择webapp创建

![image-20201104162246668](http://img2.salute61.top/PicGo/image-20201104162246668.png)



## Servlet程序编写

1、在上面创建的Servlet modules的webapp目录下新建Java和resources目录并标记，编写helloServlet类继承httpServlet并重写doGet和doPost方法

```java
public class helloServlet extends HttpServlet {
    //由于get和post只是请求的不同方式，因此可以互相调用，对应逻辑相同
    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        System.out.println("进入doGet！");
        
        PrintWriter writer = resp.getWriter();
        writer.print("helloServlet");

    }

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        System.out.println("进入post！");
    }
}
```

2、在web.xml中配置，使得浏览器发出的请求能到达对应的Servlet

```xml
<?xml version="1.0" encoding="UTF-8"?>
<web-app xmlns="http://xmlns.jcp.org/xml/ns/javaee"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://xmlns.jcp.org/xml/ns/javaee
                         http://xmlns.jcp.org/xml/ns/javaee/web-app_4_0.xsd"
         version="4.0"
         >

    <!--servlet注册-->
    <servlet>
        <servlet-name>helloServlet</servlet-name>
        <servlet-class>com.liu.servlet.helloServlet</servlet-class>
    </servlet>
    <!--servlet请求路径-->
    <servlet-mapping>
        <servlet-name>helloServlet</servlet-name>
        <url-pattern>/helloServlet</url-pattern>
    </servlet-mapping>

</web-app>

```

3、IDEA中配置Tomcat

- 在右上角Run--Edit Configuration

  ![image-20201104164343123](http://img2.salute61.top/PicGo/image-20201104164343123.png)

- 在Server右侧的Configure...找到本地的Tomcat服务器，查看JRE版本和项目要保持一致、在上面的Deployment中点击+号找到我们的Servlet项目，添加Application context路径，启动访问

  ![image-20201104165240454](http://img2.salute61.top/PicGo/image-20201104165240454.png)

【注】：启动的时候报错`Error:java: Compilation failed: internal java compiler error`，应该是项目的JDK版本设置不一致，在Project Structure-->Project和Setting--Java Complier中将JDK版本都设为一致的即可！



### **浏览器通过配置定位到对应Servlet的步骤**

- 首先浏览器通过http://localhost:8080/s1找到web.xml中的`<url-pattern>`；
- 匹配到url-pattern后找到Servlet的名字helloServlet
- helloServlet对应的路径为`com.liu.servlet.helloServlet`，获取到对应的doGet和doPost方法



## Servlet创建方式

Servlet常见的创建方式有三种，我们用的继承HTTPServlet就属于其中一种，查看HttpServlet类图如下：

<img src="http://img2.salute61.top/PicGo/HttpServlet.png" alt="HttpServlet"  />

上面已经展示了继承HttpServlet类实现，还有另外两种继承GenericServlet和实现Servlet方式。

GenericServlet类继承了Servlet接口，主要作用就是实现了Servlet接口中的方法，简化了编写Servlet步骤



## Servlet生命周期

1、创建一个类，实现Servlet接口

- ctrl+o可以看到有5个方法需要重写：init【初始化】、getServletConfig【获取Servlet配置】、service【服务】、getServletInfo【获取Servlet服务信息】、destroy【销毁服务】
- 可以猜到service中应该是对应的服务代码，在service中编写代码

```java
public class testServlet implements Servlet {
    @Override
    public void init(ServletConfig config) throws ServletException {
        
    }

    @Override
    public ServletConfig getServletConfig() {
        return null;
    }

    @Override
    public void service(ServletRequest req, ServletResponse res) throws ServletException, IOException {
        res.getWriter().write("helloWorld!");
    }

    @Override
    public String getServletInfo() {
        return null;
    }

    @Override
    public void destroy() {

    }
}
```

2、配置web.xml文件，部署到Tomcat中，键入http://localhost:8080/s1/testServlet访问

- 可以发现，第一次访问时init方法和service方法被执行，后续再进入/testServlet只会执行service方法

  ![image-20201104172052959](http://img2.salute61.top/PicGo/image-20201104172052959.png)

- 关闭tomcat服务器，destroy方法被调用了

  ![image-20201104172155166](http://img2.salute61.top/PicGo/image-20201104172155166.png)



**Servlet生命周期：**

1. 加载Servlet。Tomcat第一次访问Servlet时，**会由Tomcat负责创建Servlet的实例**
2. 初始化。Servlet实例被初始化后，在访问时，Tomcat会调用init()方法初始化对象（仅执行一次）
3. 处理服务。浏览器每次访问Servlet时都会调用service()方法处理请求服务
4. 销毁。Tomcat关闭时要删除相关的Servlet，会自动调用destroy()方法，释放所占的资源

![image-20201104174537836](http://img2.salute61.top/PicGo/image-20201104174537836.png)


