---
atitle: 'Mybaits学习一:第一个Mybaits程序'
date: 2020-09-28 17:36:07
tags: Mybatis
categories: Mybatis
---

### 前言

学习Java必学SSM，先上手Mybatis！我是跟着B站的UP[狂神说](https://space.bilibili.com/95256449?spm_id_from=333.788.b_765f7570696e666f.2)的视频学习，所以笔记也按照他的视频来记录。视频学习和笔记都是根据[Mybatis官方中文文档](https://mybatis.org/mybatis-3/zh/index.html)进行

以下是Mybatis官方中文文档关于Mybatis的简介

> MyBatis 是一款优秀的持久层框架，它支持自定义 SQL、存储过程以及高级映射。MyBatis 免除了几乎所有的 JDBC 代码以及设置参数和获取结果集的工作。MyBatis 可以通过简单的 XML 或注解来配置和映射原始类型、接口和 Java POJO【Plain Old Java Objects，普通老式 Java 对象】为数据库中的记录。

- Mybatis官方文档 : http://www.mybatis.org/mybatis-3/zh/index.html
- GitHub : https://github.com/mybatis/mybatis-3

<!--more-->



### 简介

#### **持久化**

**持久化是将程序数据在持久状态和瞬时状态间转换的机制。**

简而言之就是把数据（如内存中的对象）保存到可永久保存的存储设备中（如磁盘）。持久化的主要应用是将内存中的对象存储在数据库中，或者存储在磁盘文件中、XML数据文件中等等。Java中的JDBC和文件IO就是常见的持久化机制

**为什么需要持久化服务呢？**

内存的特性就是断电数据丢失，所以重要的数据不能放在内存；其次内存成本过高，用内存做数据存储性价比很低

#### 持久层

**什么是持久层？**

介绍持久层就要提到Java的分层模型。以典型的MVC架构为例——模型Model、视图View、控制器Controller相分离，Model代表一个存取数据的对象或 JAVA POJO；View代表模型包含的数据的可视化。Controller作用于模型和视图上，它控制数据流向模型对象，并在数据变化时更新视图。

对应的分层就是表示层UI、业务逻辑层BLL、数据持久层DAO。

使用分层框架可以将重复繁琐的内容封装，屏蔽细节简化程序，使得程序员可以专注于业务层面，提高开发效率！

- 完成持久化工作的代码块 .  ---->  dao层 【DAO (Data Access Object)  数据访问对象】
- 大多数情况下特别是企业级应用，数据持久化往往也就意味着将内存中的数据保存到磁盘上加以固化，而持久化的实现过程则大多通过各种**关系数据库**来完成。
- 不过这里有一个字需要特别强调，也就是所谓的“层”。对于应用系统而言，数据持久功能大多是必不可少的组成部分。也就是说，我们的系统中，已经天然的具备了“持久层”概念？也许是，但也许实际情况并非如此。之所以要独立出一个“持久层”的概念,而不是“持久模块”，“持久单元”，也就意味着，我们的系统架构中，应该有一个相对独立的逻辑层面，专注于数据持久化逻辑的实现.
- 与系统其他部分相对而言，这个层面应该具有一个较为清晰和严格的逻辑边界。【说白了就是用来操作数据库存在的！】

#### 使用Mybatis的原因

传统的JDBC代码在配置、编写语句等方面非常繁琐，并且频繁的打开和释放连接对资源的消耗也较大，使用MyBatis的目的就是为了简化我们重复的操作

- MyBatis的优点

  - MyBatis 是一个半自动化的**ORM框架Object Relationship Mapping【对象关系映射**】，解决面向对象编程模型和关系型数据库模型之间的映射问题

- - 简单易学：本身就很小且简单。没有任何第三方依赖，最简单安装只要两个jar文件+配置几个sql映射文件就可以了，易于学习，易于使用，通过文档和源代码，可以比较完全的掌握它的设计思路和实现。
  - 灵活：mybatis不会对应用程序或者数据库的现有设计强加任何影响。sql写在xml里，便于统一管理和优化。通过sql语句可以满足操作数据库的所有需求。
  - 解除sql与程序代码的耦合：通过提供DAO层，将业务逻辑和数据访问逻辑分离，使系统的设计更清晰，更易维护，更易单元测试。sql和代码的分离，提高了可维护性。
  - 提供xml标签，支持编写动态sql。



#### 基本步骤

准备Mybatis-->创建相应Java项目-->编写项目及配置文件-->测试



### 搭建环境

本项目是利用Mybatis对数据库操作，所以需要以下准备：

- 数据库环境
- Mybatis相关jar包

创建数据库的语句如下：

```mysql
CREATE DATABASE `mybatis`;
USE `mybatis`;
DROP TABLE IF EXISTS `user`;

CREATE TABLE `user` (
`id` int(20) NOT NULL,
`name` varchar(30) DEFAULT NULL,
`pwd` varchar(30) DEFAULT NULL,
PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

insert  into `user`(`id`,`name`,`pwd`) values (1,'狂神','123456'),(2,'张三','abcdef'),(3,'李四','987654');
```

关于Mybatis：Mybatis原本是apache项目，原来被叫做 ibatis。后来移植到google code，改名为mybatis。现在在github（开源软件托管平台）脱光，官网：https://github.com/mybatis/mybatis-3/releases。

提示：由于本项目使用maven管理，所以可以在[mvnrepository](https://mvnrepository.com/)中搜索导入相应的依赖

```xml
<dependency>
    <groupId>org.mybatis</groupId>
    <artifactId>mybatis</artifactId>
    <version>3.5.2</version>
</dependency>
<dependency>
    <groupId>mysql</groupId>
    <artifactId>mysql-connector-java</artifactId>
    <version>5.1.47</version>
</dependency>
```



### 编写核心配置文件

每个基于 MyBatis 的应用都是以一个 SqlSessionFactory 的实例为核心的。SqlSessionFactory 的实例可以通过 SqlSessionFactoryBuilder 获得。而 SqlSessionFactoryBuilder 则可以从 XML 配置文件或一个预先配置的 Configuration 实例来构建出 SqlSessionFactory 实例。所以我们的第一步就是编写对应的核心配置文件`mybatis-config.xml`

关于核心配置文件内容在官方文档中就有，只需要将它复制过来就行，然后设置具体的参数（关于配置文件的内容详细再下一篇介绍，这里主要是为了能快速跑起来第一个Mybatis程序）

<img src="http://img2.salute61.top/Mybatis%E6%A0%B8%E5%BF%83%E9%85%8D%E7%BD%AE01.png" style="zoom:50%;" />

```xml
<?xml version="1.0" encoding="UTF-8" ?>
<!DOCTYPE configuration
    PUBLIC "-//mybatis.org//DTD Config 3.0//EN"
    "http://mybatis.org/dtd/mybatis-3-config.dtd">
<configuration>

<environments default="development">
    <environment id="development">
        <transactionManager type="JDBC"/>
        <dataSource type="POOLED">
            <property name="driver" value="com.mysql.jdbc.Driver"/>
            <property name="url" value="jdbc:mysql://localhost:3306/mybatis?useSSL=false&amp;useUnicode=true&amp;characterEncoding=utf8"/>
            <property name="username" value="root"/>
            <property name="password" value="leslie61"/>
        </dataSource>
    </environment>
</environments>
<mappers>
    <mapper resource="com/liu/dao/userMapper.xml"/>
</mappers>
</configuration>
```

当然，还有很多可以在 XML 文件中配置的选项，上面的示例仅罗列了最关键的部分。 注意 XML 头部的声明，它用来验证 XML 文档的正确性。environment 元素体中包含了事务管理和连接池的配置。mappers 元素则包含了一组映射器（mapper），这些映射器的 XML 映射文件包含了 SQL 代码和映射定义信息。

注：也可以不使用xml构建SqlSessionFactory，不过推荐还是用xml，更直观便捷！



### 编写Mybatis工具类

查看官方文档，找到怎样`从 XML 中构建 SqlSessionFactory`，然后就可以创建一个`utils`的package存放工具类，实际编写中要注意一点细节

![](http://img2.salute61.top/Mybatis%E6%A0%B8%E5%BF%83%E9%85%8D%E7%BD%AE02.png)

```java
package com.liu.utils;

import org.apache.ibatis.io.Resources;
import org.apache.ibatis.session.SqlSession;
import org.apache.ibatis.session.SqlSessionFactory;
import org.apache.ibatis.session.SqlSessionFactoryBuilder;

import java.io.IOException;
import java.io.InputStream;

/**
 * @Author: Salute61
 * @Date: 2020/9/18 11:37
 * @Description: Mybatis工具类
 */
public class MybatisUtils {

    private static SqlSessionFactory sqlSessionFactory;

    static {
        try {
            String resource = "mybatis-config.xml";
            InputStream inputStream = Resources.getResourceAsStream(resource);
            sqlSessionFactory = new SqlSessionFactoryBuilder().build(inputStream);
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    //获取SqlSession连接
    public static SqlSession getSession(){
        return sqlSessionFactory.openSession();
    }

}
```

注：刚开始我遇到的问题

- `getResourceAsStream`报异常，捕获一下就行
- `try-catch`用`static`修饰，不然运行时会报空指针异常`NullPointerException`



### 创建实体类POJO

创建我们要操作的对象实体类

```java
package com.liu.pojo;

/**
 * @Author: Salute61
 * @Date: 2020/9/18 15:42
 * @Description: some description
 */
public class User {
    private int id;
    private String name;
    private String pwd;

    //构造方法、set、get方法
}

```



### 编写Mapper接口类

mapper接口只是为了声明相应的函数，具体的执行代码要去mapper.xml中进行配置

```java
package com.liu.dao;

import com.liu.pojo.User;

import java.util.List;
import java.util.Map;

/**
 * @Author: Salute61
 * @Date: 2020/9/18 15:45
 * @Description: some description
 */
public interface UserMapper {
    //查询全部用户
    List<User> selectUser();
}

```

### 编写Mapper.xml配置文件

编写对应函数的执行代码

```xml
<?xml version="1.0" encoding="UTF-8" ?>
<!DOCTYPE mapper
        PUBLIC "-//mybatis.org//DTD Mapper 3.0//EN"
        "http://mybatis.org/dtd/mybatis-3-mapper.dtd">
<mapper namespace="com.liu.dao.UserMapper">
    <select id="selectUser" resultType="com.liu.pojo.User" >
  select * from user
 </select>
</mapper>
```

Mapper.xml中 标签的id即为Mapper中的函数名，一定要对应正确！

编写好的Mapper.xml要去核心配置文件中注册！！！也就是上面mybatis-config.xml中`<mappers><mappers>`那一部分的代码

### 测试类测试

测试类基本步骤：创建SqlSession；通过SqlSession获取对应mapper对象，并运行mapper映射的SQL语句；关闭连接

```java
package com.liu2.dao;

import com.liu.dao.UserMapper;
import com.liu.pojo.User;
import com.liu.utils.MybatisUtils;
import org.apache.ibatis.session.SqlSession;
import org.apache.log4j.Logger;
import org.junit.Test;

import java.util.HashMap;
import java.util.List;

/**
 * @Author: Salute61
 * @Date: 2020/9/18 16:01
 * @Description: some description
 */
public class MyTest {
    @Test
    public void selectUser() {
        //第一步：获取执行SqlSession的对象
        SqlSession session = MybatisUtils.getSession();
        //方法一:
        //List<User> users = session.selectList("com.liu.dao.UserMapper.selectUser");
        //方法二:
        UserMapper mapper = session.getMapper(UserMapper.class);
        List<User> users = mapper.selectUser();

        for (User user: users){
            System.out.println(user);
        }
        //关闭SqlSession
        session.close();
    }
}
```

运行代码，得到结果：

![](http://img2.salute61.top/Mybatis%E6%A0%B8%E5%BF%83%E9%85%8D%E7%BD%AE03.png)



第一个Mybatis程序就算跑起来了！

整体的流程也相对固定：环境-->配置文件`mybatis-config.xml`-->编写Mybatis的工具类、创建实体类pojo-->编写Mapper接口类和映射的的mapper.xml配置文件-->测试

一开始也磕磕绊绊的踩了不少坑，不过越学越感觉得到Mybatis的简单灵活~

















































































