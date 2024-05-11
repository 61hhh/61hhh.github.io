---
title: maven学习
tags: maven
categories: 开发工具
abbrlink: e5dd7f0f
date: 2020-07-31 21:56:16
---

### Maven简介

Mavern:项目对象模型(POM)，可以通过一小段描述信息来管理项目的构建，报告和文档的软件项目管理工具。

Maven是一个Apache的开源项目，是一个项目管理和综合工具。Maven提供了开发人员构建一个完整的生命周期框架。开发团队可以自动完成项目的基础工具建设，Maven使用标准的目录结构和默认构建生命周期。

例如：两个项目A B，项目A需要依赖一些jar包，项目B也需要依赖这些jar包，那么此时如果都把jar包引入到项目中，就是在重复造轮子，我们应该把这些所有的jar包放到一个地方，需要用的时候过去取即可。

<!--more-->

#### 1.什么是依赖管理

一个java项目需要外部的第三方jar包来进行支持。我们说这个java项目依赖了这些jar包。
依赖管理就是将项目所依赖的jar包按照一定规则进行规范化管理。

#### 2.传统项目的依赖管理

传统的依赖管理就是程序员需要什么jar包，去网上进行下载，然后手动添加到工程中。
缺点：

- jar包从网上不好找
- jar包没有进行统一管理，容易造成jar包重复及版本冲突
- jar包全部添加到工程中，造成工程过大

#### 3.maven项目的依赖管理

maven项目有一个文件叫pom.xml。我们通过在此文件中配置jar包的坐标即可将jar包引入到工程中。Jar包的坐标可从maven仓库中获取。
好处：

- 通过pom配置来引入jar包，避免了jar包的版本冲突。
- Maven团队维护了一个jar包仓库，十分全，避免了去网上寻找jar包的尴尬，节省时间。

### 安装配置

#### 目录含义

以我的安装目录`D:\Apache\apache-maven-3.6.3`为例，分析一下文件夹的内容

- bin目录：maven的运行文件。例如mvn.cmd正常运行mvn；mvnDebug.cmd以Debug方式运行
- boot目录：maven运行需要的类加载器
- conf目录：maven的配置文件目录，核心文件是setting.xml
- lib目录：maven所需的jar包



#### Maven结构

setting.xml主要用于配置maven的运行环境等一系列通用的属性，是全局级别的配置文件；而pom.xml主要描述了项目的maven坐标，依赖关系，开发者需要遵循的规则，缺陷管理系统，组织和licenses，以及其他所有的项目相关因素，是项目级别的配置文件。

一个maven项目的基本结构如下

![img](https://leslie1-1309334886.cos.ap-shanghai.myqcloud.com/obsidian/maven8.png)

项目的根目录`a-maven-project`是项目名，它有一个项目描述文件`pom.xml`，存放Java源码的目录是`src/main/java`，存放资源文件的目录是`src/main/resources`，存放测试源码的目录是`src/test/java`，存放测试资源的目录是`src/test/resources`，最后，所有编译、打包生成的文件都放在`target`目录里。这些就是一个Maven项目的标准目录结构。

所有的目录结构都是约定好的标准结构，我们千万不要随意修改目录结构。使用标准结构不需要做任何配置，Maven就可以正常使用。

如图是一个典型的pom文件，我们可以为要导入的jar包添加依赖

![img](https://leslie1-1309334886.cos.ap-shanghai.myqcloud.com/obsidian/maven7.png)

```
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>

    <groupId>org.example</groupId>
    <artifactId>maven_web</artifactId>
    <version>1.0-SNAPSHOT</version>
    
    <packaging>jar</packaging>
    <properties>
        ...
    </properties>
    <dependencies>
        <dependency>
            <groupId>commons-logging</groupId>
            <artifactId>commons-logging</artifactId>
            <version>1.2</version>
        </dependency>
    </dependencies>
    
</project>
```

其中，`groupId`类似于Java的包名，通常是公司或组织名称，`artifactId`类似于Java的类名，通常是项目名称，再加上`version`，一个Maven工程就是由`groupId`，`artifactId`和`version`作为唯一标识。我们在引用其他第三方库的时候，也是通过这3个变量确定。

使用``声明一个依赖后，Maven就会自动下载这个依赖包并把它放到classpath中。而在``中可以引入多个依赖。

更多的maven依赖可以在要使用时去[*Maven* Repository: Search/Browse/Explore](https://mvnrepository.com/)查找



#### 配置环境变量

- 在[maven官网](http://maven.apache.org/)左侧的download栏中，选择对应的maven版本下载，下载的压缩包
- 解压，并配置环境变量

<img src="https://leslie1-1309334886.cos.ap-shanghai.myqcloud.com/obsidian/maven1.png" style="zoom: 67%;" />

环境变量的配置与JDK类似：

- 新建系统变量MAVEN_HOME。值为maven的安装目录
- 在path变量中添加：`%MAVEN_HOME%\bin`

配置完成后，在命令行输入`mvn -version`查看是否配置成功

<img src="https://leslie1-1309334886.cos.ap-shanghai.myqcloud.com/obsidian/maven2.png" style="zoom:67%;" />



#### 配置镜像

在maven的安装目录的conf目录下，有一个settings.xml文件，找到文件中的`<mirrors></mirrors>`标签，添加阿里镜像

```xml
<!-- 阿里云仓库 -->
    <mirror>
        <id>alimaven</id>
        <mirrorOf>central</mirrorOf>
        <name>aliyun maven</name>
        <url>http://maven.aliyun.com/nexus/content/repositories/central/</url>
    </mirror>
```

<img src="https://leslie1-1309334886.cos.ap-shanghai.myqcloud.com/obsidian/maven3.png" style="zoom: 67%;" />



#### Maven仓库

maven仓库用来存储jar包。maven项目都是从仓库中获取jar包。maven仓库分三种：本地仓库，远程仓库，中央仓库。
**本地仓库**：用来存储从远程仓库及中央仓库下载的jar包，自己来维护。项目使用的jar包优先从本地仓库获取。本地仓库的默认位置在user.home/.m2/repository。user.home/.m2/repository。{user.home}表示用户所在的位置。
**远程仓库**：如果本地仓库没有所需要的jar包，默认去远程仓库下载。远程仓库由公司来进行维护又可称为私服。
**中央仓库**：中央仓库由maven团队来进行维护，服务于整个互联网。其仓库中存储大量的jar包。

![](https://leslie1-1309334886.cos.ap-shanghai.myqcloud.com/obsidian/maven4.png)

修改本地仓库直接复制`<localrepository>`语句，例如：

```xml
  <localRepository>D:\Apache\maven-repository</localRepository>
```



#### Maven配置IDEA

在Setting中找到如图位置Maven设置，可以按需设置Maven

下面的importing可以设置自动导入，导入内容选择等；Repositories可以选择仓库，更新仓库等。

![](https://leslie1-1309334886.cos.ap-shanghai.myqcloud.com/obsidian/maven6.png)





### 依赖管理

maven依赖管理的流程：

```ascii
┌──────────────┐
│Sample Project│
└──────────────┘
        │
        ▼
┌──────────────┐
│     abc      │
└──────────────┘
        │
        ▼
┌──────────────┐
│     xyz      │
└──────────────┘
```

当我们声明了`abc`的依赖时，Maven自动把`abc`和`xyz`都加入了我们的项目依赖，不需要我们自己去研究`abc`是否需要依赖`xyz`。

因此，Maven的第一个作用就是解决依赖管理。我们声明了自己的项目需要`abc`，Maven会自动导入`abc`的jar包，再判断出`abc`需要`xyz`，又会自动导入`xyz`的jar包，这样，最终我们的项目会依赖`abc`和`xyz`两个jar包。

我们来看一个复杂依赖示例：

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-web</artifactId>
    <version>1.4.2.RELEASE</version>
</dependency>
```

当我们声明一个`spring-boot-starter-web`依赖时，Maven会自动解析并判断最终需要大概二三十个其他依赖：

```ascii
spring-boot-starter-web
  spring-boot-starter
    spring-boot
    sprint-boot-autoconfigure
    spring-boot-starter-logging
      logback-classic
        logback-core
        slf4j-api
      jcl-over-slf4j
        slf4j-api
      jul-to-slf4j
        slf4j-api
      log4j-over-slf4j
        slf4j-api
    spring-core
    snakeyaml
  spring-boot-starter-tomcat
    tomcat-embed-core
    tomcat-embed-el
    tomcat-embed-websocket
      tomcat-embed-core
  jackson-databind
  ...
```

如果我们自己去手动管理这些依赖是非常费时费力的，而且出错的概率很大。



#### 依赖关系

Maven定义了几种依赖关系，分别是`compile`、`test`、`runtime`和`provided`：

| scope    | 说明                                          | 示例            |
| :------- | :-------------------------------------------- | :-------------- |
| compile  | 编译时需要用到该jar包（默认）                 | commons-logging |
| test     | 编译Test时需要用到该jar包                     | junit           |
| runtime  | 编译时不需要，但运行时需要用到                | mysql           |
| provided | 编译时需要用到，但运行时由JDK或某个服务器提供 | servlet-api     |

其中，默认的`compile`是最常用的，Maven会把这种类型的依赖直接放入classpath。

`test`依赖表示仅在测试时使用，正常运行时并不需要。最常用的`test`依赖就是JUnit：

```
<dependency>
    <groupId>org.junit.jupiter</groupId>
    <artifactId>junit-jupiter-api</artifactId>
    <version>5.3.2</version>
    <scope>test</scope>
</dependency>
```

`runtime`依赖表示编译时不需要，但运行时需要。最典型的`runtime`依赖是JDBC驱动，例如MySQL驱动：

```
<dependency>
    <groupId>mysql</groupId>
    <artifactId>mysql-connector-java</artifactId>
    <version>5.1.48</version>
    <scope>runtime</scope>
</dependency>
```

`provided`依赖表示编译时需要，但运行时不需要。最典型的`provided`依赖是Servlet API，编译的时候需要，但是运行时，Servlet服务器内置了相关的jar，所以运行期不需要：

```
<dependency>
    <groupId>javax.servlet</groupId>
    <artifactId>javax.servlet-api</artifactId>
    <version>4.0.0</version>
    <scope>provided</scope>
</dependency>
```

最后一个问题是，Maven如何知道从何处下载所需的依赖？也就是相关的jar包？答案是Maven维护了一个中央仓库（[repo1.maven.org](https://repo1.maven.org/)），所有第三方库将自身的jar以及相关信息上传至中央仓库，Maven就可以从中央仓库把所需依赖下载到本地。

Maven并不会每次都从中央仓库下载jar包。一个jar包一旦被下载过，就会被Maven自动缓存在本地目录（用户主目录的`.m2`目录），所以，除了第一次编译时因为下载需要时间会比较慢，后续过程因为有本地缓存，并不会重复下载相同的jar包。

#### 唯一ID

对于某个依赖，Maven只需要3个变量即可唯一确定某个jar包：

- groupId：属于组织的名称，类似Java的包名；
- artifactId：该jar包自身的名称，类似Java的类名；
- version：该jar包的版本。

通过上述3个变量，即可唯一确定某个jar包。Maven通过对jar包进行PGP签名确保任何一个jar包一经发布就无法修改。修改已发布jar包的唯一方法是发布一个新版本。

因此，某个jar包一旦被Maven下载过，即可永久地安全缓存在本地。

注：只有以`-SNAPSHOT`结尾的版本号会被Maven视为开发版本，开发版本每次都会重复下载，这种SNAPSHOT版本只能用于内部私有的Maven repo，公开发布的版本不允许出现SNAPSHOT。

### 【参考】

- [maven学习笔记(超详细总结)](https://www.cnblogs.com/baizihua/p/11519509.html)
- [【狂神说Java】JavaWeb入门到实战](https://www.bilibili.com/video/BV12J411M7Sj?p=8)
- [廖雪峰——Maven基础](https://www.liaoxuefeng.com/wiki/1252599548343744/1255945359327200)