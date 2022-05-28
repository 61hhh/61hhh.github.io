---
title: Tomcat学习
tags: Tomcat
categories: 学习
abbrlink: 2911faf4
date: 2020-07-05 22:01:18
---

## Tomcat学习

想学习现在热门的Spring，搜查得知在此之前应该掌握tomcat、servlet等前提知识，B站网课动则几十个小时属实劝退。。。因此就通过找博客快速了解一下相关知识吧！

> 沧浪之水清兮，可以濯吾缨。沧浪之水浊兮，可以濯吾足。

<!--more-->

### Tomcat简介

百度解释：Tomcat 服务器是一个免费的开放源代码的Web 应用服务器，属于轻量级应用服务器，在中小型系统和并发访问用户不是很多的场合下被普遍使用，是开发和调试JSP 程序的首选。对于一个初学者来说，可以这样认为，当在一台机器上配置好Apache 服务器，可利用它响应HTML页面的访问请求。  简单来说Tomcat就是一个运行Java的网络服务器，也是JSP和servlet的容器

### 下载配置

tomcat可以在[官网](https://tomcat.apache.org/)直接下载，点击左侧download选择版本后，再根据自己的版本选择压缩包下载即可，下载完成后解压（建议解压到D盘，C盘可能会出现拒绝访问问题）

<img src="http://img2.salute61.top/Tomcat1.png" alt="下载地址" style="zoom: 67%;" />

解压完成后，在环境变量中配置，在系统变量中新建，变量名为`CATALINA_HOME`，变量值即为安装目录（是tomcat整个的安装目录！）

<img src="http://img2.salute61.top/Tomcat2.png" style="zoom: 67%;"  >

然后在系统变量的path变量中添加`%CATALINA_HOME%\bin`，一路确认返回即可。

Tomcat的运行需要JDK的支持，在命令行中输入`java -version`查看Java版本，在 JDK1.8 环境下能够正常运行，如果是在12.0版本，1.7版本，Tomcat不能够正常启动！其他JDK版本具体测试，JDK自行百度

准备好后在命令行中输入`startup.bat`即可进入tomcat**（此时新产生的命令行窗口不能关闭！）**，在浏览器中输入`localhost:8080`查看到相应页面即成功配置！

<img src="http://img2.salute61.top/Tomcat3.png" style="zoom: 67%;" >





### 配置文件

Tomcat的配置文件在conf/server.xml中，可以配置主机名称、访问端口号等

常见端口号：Tomcat  8080；MySQL  3306；http  80；https  443；



配置中的常见问题：

1 启动错误，一闪而退可能是端口被占用，tomcat默认的是8080端口，可以在到安装目录下的conf/server.xml文件中修改端口

![](http://img2.salute61.top/Tomcat4.png)

2 如果出现乱码，可以在安装目录的conf文件夹下，找到logging.properties文件，打开修改UTF-8为GBK即可

![](http://img2.salute61.top/Tomcat5.png)





### 部署方式

部署前我们需要先了解Tomcat安装目录的文件结构，最好的方法就是在官网看文档**（适用于所有软件、框架的学习）**，在documentation选择自己下载的版本，进入后overview查看

- /bin：启动、关闭和一些其他的脚本文件，在Unix系统是.sh文件在window是.bat文件
- /conf：存放Tomcat的各种配置文件
- /lib：存放Tomcat的支撑jar包
- /logs：日志文件默认的存放位置
- /temp：存放运行时产生的临时文件
- /webapps：存放自己web app的位置

部署方式有两种：内嵌式部署、外部映射部署

- 内嵌式部署：直接将你的web app放在上述的webapps目录下，然后`localhost:8080/你的web app文件夹/资源文件.html`即可查看。

  具体演示：在webapps目录下新建test目录，新建一个firstweb.html文件，编写html代码，然后在浏览器中输入`localhost:8080/test/firstweb.html`即可访问

  <img src="http://img2.salute61.top/Tomcat6.png" style="zoom:33%;" />

  

  - 通过WEB-INF设置首页：我们的web app不可能就一个html文件，在多个文件的情况下要设置一个首页，可以借助WEB-INF目录下的web.xml文件实现

    在之前的test目录下创建second.html文件，编写代码，然后创建WEB-INF目录，新建web.xml文件，由于我们自己是不知道规范格式咋写的，可以直接将test同级目录的ROOT目录中的web.xml代码copy过来，然后加上：

    ```
      <welcome-file-list>
    	<welcome-file>secondweb.html</welcome-file>
      </welcome-file-list>
    ```

    ![](http://img2.salute61.top/TomcaT9.png)

    然后此时可以不用再指定资源文件了，直接浏览器输入`localhost:8080/test`即可看到设置的首页

    <img src="http://img2.salute61.top/Tomcat8.png" style="zoom:50%;" />

    

- 外部映射部署：不是在webapps目录而是在其他盘中的web app文件，也可以部署到Tomcat中，分散存放web文件既可以节约资源也比较方便管理

  具体演示：

  - 法一：在F盘中创建一个test2，按照之前的目录结构新建index.html，编写代码，然后打开Tom cat的conf目录下的server.xml，在Host标签下添加一行代码：

  ```
  <Context path="" docBase="">
  path:表示的是访问时输入的web项目名（即是映射路径）
  docBase：表示的是站点目录的绝对路径
  ```

  ![](http://img2.salute61.top/Tomcat7.png)

  打开浏览器输入`localhost:8080/new/index.html`即可

  - 法二：在conf的Catalina的localhost目录下新建一个new.xml文件然后配置xml文件

    ```
    <?xml version="1.0" encoding="UTF-8"?>
    <Context
    	reloadable:"true"
    	docBase="F:\test2">
    </Context>
    ```

    同样，打开浏览器输入`localhost:8080/new/index.html`即可。