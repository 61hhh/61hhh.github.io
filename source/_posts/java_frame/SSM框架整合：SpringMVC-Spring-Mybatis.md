---
title: SSM框架整合：SpringMVC+Spring+Mybatis
tags: Spring
categories: Spring
abbrlink: 2dd9e0d6
date: 2021-03-05 12:26:14
---

## 前言

狂神的`SpringMVC`教程里，后面有SSM框架整合，跟着敲了一遍，感觉还是比较陌生，可能是看得太快了。结合着网上的博客再过一遍，捋一捋。

**目标：熟悉SSM框架开发的基本流程；了解框架结构**

<!--more-->

## 1、搭建项目的基础环境

> 前置--环境要求

- IDEA
- MySQL 5.1.6
- Maven

>基础环境搭建

《1》在IDEA新建maven项目，命名为`SSM_Union`，再右键`Add Framework support`添加web框架支持。完成后如图

<img src="https://jihulab.com/Leslie61/imagelake/-/raw/main/pictures/2023/04/image-20210305054235227.png" alt="image-20210305054235227" style="zoom:80%;" />

《2》在项目的`pom.xml`文件中添加依赖配置

```xml
<!--依赖-->
<dependencies>
    <!-- https://mvnrepository.com/artifact/org.projectlombok/lombok -->
    <dependency>
        <groupId>org.projectlombok</groupId>
        <artifactId>lombok</artifactId>
        <version>1.18.12</version>
        <scope>provided</scope>
    </dependency>
    <!--Junit-->
    <dependency>
        <groupId>junit</groupId>
        <artifactId>junit</artifactId>
        <version>4.12</version>
    </dependency>
    <!--数据库驱动-->
    <dependency>
        <groupId>mysql</groupId>
        <artifactId>mysql-connector-java</artifactId>
        <version>5.1.6</version>
    </dependency>
    <!-- 数据库连接池 -->
    <dependency>
        <groupId>com.mchange</groupId>
        <artifactId>c3p0</artifactId>
        <version>0.9.5.2</version>
    </dependency>

    <!--Servlet - JSP -->
    <dependency>
        <groupId>javax.servlet</groupId>
        <artifactId>servlet-api</artifactId>
        <version>2.5</version>
    </dependency>
    <dependency>
        <groupId>javax.servlet.jsp</groupId>
        <artifactId>jsp-api</artifactId>
        <version>2.2</version>
    </dependency>
    <dependency>
        <groupId>javax.servlet</groupId>
        <artifactId>jstl</artifactId>
        <version>1.2</version>
    </dependency>

    <!--Mybatis-->
    <dependency>
        <groupId>org.mybatis</groupId>
        <artifactId>mybatis</artifactId>
        <version>3.5.2</version>
    </dependency>
    <dependency>
        <groupId>org.mybatis</groupId>
        <artifactId>mybatis-spring</artifactId>
        <version>2.0.2</version>
    </dependency>

    <!--Spring-->
    <dependency>
        <groupId>org.springframework</groupId>
        <artifactId>spring-webmvc</artifactId>
        <version>5.1.9.RELEASE</version>
    </dependency>
    <dependency>
        <groupId>org.springframework</groupId>
        <artifactId>spring-jdbc</artifactId>
        <version>5.1.9.RELEASE</version>
    </dependency>

</dependencies>
```

《3》Maven资源过滤设置

```xml
<build>
   <resources>
       <resource>
           <directory>src/main/java</directory>
           <includes>
               <include>**/*.properties</include>
               <include>**/*.xml</include>
           </includes>
           <filtering>false</filtering>
       </resource>
       <resource>
           <directory>src/main/resources</directory>
           <includes>
               <include>**/*.properties</include>
               <include>**/*.xml</include>
           </includes>
           <filtering>false</filtering>
       </resource>
   </resources>
</build>
```

《4》搭建目录结构如图

<img src="https://jihulab.com/Leslie61/imagelake/-/raw/main/pictures/2023/04/image-20210305060016972.png" alt="image-20210305060016972" style="zoom:80%;" />

| 包名       | 名称                 | 描述                                                         |
| ---------- | -------------------- | ------------------------------------------------------------ |
| controller | 控制层               | 负责具体的业务模块流程的**控制**，controller调用service的接口实现业务控制流程。 |
| dao        | 数据持久层           | 负责与底层数据打交道。常见的数据库操作、文件读写等           |
| pojo       | 实体类(也写作entity) | 与数据库的表对应，封装dao层的数据成一个对象。介于dao和service层 |
| service    | 业务层(也叫bbl)      | 业务模块操作的逻辑设计。service调用dao层                     |

- mybatis-config.xml：mybatis的配置文件

  ```xml
  <?xml version="1.0" encoding="UTF-8" ?>
  <!DOCTYPE configuration
         PUBLIC "-//mybatis.org//DTD Config 3.0//EN"
         "http://mybatis.org/dtd/mybatis-3-config.dtd">
  <configuration>
  
  </configuration>
  ```

- applicationContext.xml：spring的配置文件

  ```xml
  <?xml version="1.0" encoding="UTF-8"?>
  <beans xmlns="http://www.springframework.org/schema/beans"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://www.springframework.org/schema/beans
         http://www.springframework.org/schema/beans/spring-beans.xsd">
  
  </beans>
  ```

《5》准备项目所需的数据库`ssmbuild`

```mysql
CREATE DATABASE `ssmbuild`;

USE `ssmbuild`;

DROP TABLE IF EXISTS `books`;

CREATE TABLE `books` (
`bookID` INT(10) NOT NULL AUTO_INCREMENT COMMENT '书id',
`bookName` VARCHAR(100) NOT NULL COMMENT '书名',
`bookCounts` INT(11) NOT NULL COMMENT '数量',
`detail` VARCHAR(200) NOT NULL COMMENT '描述',
KEY `bookID` (`bookID`)
) ENGINE=INNODB DEFAULT CHARSET=utf8

INSERT  INTO `books`(`bookID`,`bookName`,`bookCounts`,`detail`)VALUES
(1,'Java',1,'从入门到放弃'),
(2,'MySQL',10,'从删库到跑路'),
(3,'Linux',5,'从进门到进牢');
```

项目基本的准备工作就OK了，然后就可以开始构建模块-->整合模块了。



## 2、Mybatis框架搭建

Mybatis层就是简化数据操作的，所以它对应的就是dao层。基本操作就是编写dao层接口、编写mapper映射文件

《1》编写数据库配置文件`db.properties`

```properties
jdbc.driver=com.mysql.jdbc.Driver
jdbc.url=jdbc:mysql://localhost:3306/ssmbuild?useSSL=true&useUnicode=true&characterEncoding=utf8
jdbc.username=root
jdbc.password=123456
```

《2》IDEA连接mysql数据库

《3》编写mybatis-config.xml文件

```xml
<?xml version="1.0" encoding="UTF-8" ?>
<!DOCTYPE configuration
        PUBLIC "-//mybatis.org//DTD Config 3.0//EN"
        "http://mybatis.org/dtd/mybatis-3-config.dtd">
<configuration>

    <!--配置数据源,现在由spring实现-->
<!--    <properties resource="db.properties" />-->

    <!--别名-->
    <typeAliases>
        <package name="com.liu.pojo"/>
    </typeAliases>
    <!--映射-->
    <mappers>
        <mapper class="com.liu.dao.BookMapper"/>
    </mappers>


</configuration>
```

《4》编写数据库实体类`com.liu.pojo.Books`（使用lombok插件简化）

```java
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Books {
    private int bookID;
    private String bookName;
    private int bookCounts;
    private String detail;
}
```

《5》编写dao层接口`com.liu.dao.Books`

```java
public interface BookMapper {
    //增加一个Book
    int addBook(Books book);
    //根据id删除一个Book
    int deleteBookById(int id);
    //更新Book
    int updateBook(Books books);
    //根据id查询,返回一个Book
    Books queryBookById(int id);
    //查询全部Book,返回list集合
    List<Books> queryAllBook();
    //查书
    Books queryBookName(String bookName);
}
```

《6》编写接口对应的mapper映射文件，执行具体的SQL操作【也可以使用注解实现，mybatis学习时用过】

```xml
<?xml version="1.0" encoding="UTF-8" ?>
<!DOCTYPE mapper
        PUBLIC "-//mybatis.org//DTD Mapper 3.0//EN"
        "http://mybatis.org/dtd/mybatis-3-mapper.dtd">

<mapper namespace="com.liu.dao.BookMapper">

    <!--增加一个Book-->
    <insert id="addBook" parameterType="com.liu.pojo.Books">
        insert into ssmbuild.books(bookName,bookCounts,detail)
        values (#{bookName}, #{bookCounts}, #{detail})
    </insert>

    <!--根据id删除一个Book-->
    <delete id="deleteBookById" parameterType="int">
        delete from ssmbuild.books where bookID=#{bookID}
    </delete>

    <!--更新Book-->
    <update id="updateBook" parameterType="com.liu.pojo.Books">
        update ssmbuild.books
        set bookName = #{bookName},bookCounts = #{bookCounts},detail = #{detail}
        where bookID = #{bookID}
    </update>

    <!--根据id查询,返回一个Book-->
    <select id="queryBookById" resultType="com.liu.pojo.Books">
        select * from ssmbuild.books
        where bookID = #{bookID}
    </select>

    <!--查询全部Book-->
    <select id="queryAllBook" resultType="com.liu.pojo.Books">
        SELECT * from ssmbuild.books;
    </select>

    <!--查询全部Book-->
    <select id="queryBookName" resultType="com.liu.pojo.Books">
        SELECT * from ssmbuild.books
        where bookName=#{bookName};
    </select>

</mapper>
```

### 2.2 Spring整合Mybatis

在学习Spring时就已经整合过，操作参照就行了

<img src="https://jihulab.com/Leslie61/imagelake/-/raw/main/pictures/2023/04/image-20210305061811079.png" alt="image-20210305061811079" style="zoom:80%;" />

新建`spring-dao.xml`用于整合。<font color="red">**并在`applicationContext.xml`中进行注册**</font>

《1》配置数据库连接池

```xml
<!-- 配置整合mybatis -->
<!-- 1.关联数据库文件 -->
<context:property-placeholder location="classpath:db.properties"/>
<!-- 2.数据库连接池 -->
<bean id="dataSource" class="org.springframework.jdbc.datasource.DriverManagerDataSource">
    <property name="driverClassName" value="${jdbc.driver}"/>
    <property name="url" value="${jdbc.url}"/>
    <property name="username" value="${jdbc.username}"/>
    <property name="password" value="${jdbc.password}"/>
</bean>
<!-- 也可以用c3p0 -->
<bean id="dataSource" class="com.mchange.v2.c3p0.ComboPooledDataSource">
    <!-- 配置连接池属性 -->
    <property name="driverClass" value="${jdbc.driver}" />
    <property name="jdbcUrl" value="${jdbc.url}" />
    <property name="user" value="${jdbc.username}" />
    <property name="password" value="${jdbc.password}" />
</bean>

```

《2》配置SqlSessionFactory对象，照搬之前的文档

官方文档在关于Spring操作SqlSession部分有以下介绍：

> 在 MyBatis 中，你可以使用 `SqlSessionFactory` 来创建 `SqlSession`。一旦你获得一个 session 之后，你可以使用它来执行映射了的语句，提交或回滚连接，最后，当不再需要它的时候，你可以关闭 session。使用 MyBatis-Spring 之后，你不再需要直接使用 `SqlSessionFactory` 了，因为你的 bean 可以被注入一个线程安全的 `SqlSession`，它能基于 Spring 的事务配置来自动提交、回滚、关闭 session。

有两种形式：

- 使用`SqlSessionTemplate`
- 使用`SqlSessionDaoSupport`

```xml
<!-- 3.配置SqlSessionFactory对象 -->
<bean id="sqlSessionFactory" class="org.mybatis.spring.SqlSessionFactoryBean">
    <!-- 注入数据库连接池 -->
    <property name="dataSource" ref="dataSource"/>
    <!-- 配置MyBatis全局配置文件:mybatis-config.xml -->
    <property name="configLocation" value="classpath:mybatis-config.xml"/>
</bean>
```

注册完后，我们的`springIOC`容器中就有了`sqlSessionFactory`工厂，可以由此拿到`SqlSession`进而拿到代理对象，不再需要每次创建了！

《3》配置Dao层接口扫描。

有了工厂有了`SqlSession`，就要配置代理的对象了

```xml
<!-- 4.配置扫描Dao接口包，动态实现Dao接口注入到spring容器中 -->
<!--解释 ：https://www.cnblogs.com/jpfss/p/7799806.html-->
<bean class="org.mybatis.spring.mapper.MapperScannerConfigurer">
    <!-- 注入sqlSessionFactory -->
    <property name="sqlSessionFactoryBeanName" value="sqlSessionFactory"/>
    <!-- 给出需要扫描Dao接口包 -->
    <property name="basePackage" value="com.liu.dao"/>
</bean>
```

**<font color="red">总结：总的就是spring代理mybtis，将原先的配置转移到sping中，产生代理并放置于IOC容器里</font>**



## 3、搭建业务逻辑框架

业务逻辑主要涉及service层和controller层。

【这一步也可以在搭建基础环境时就准备好】

接口：与`dao`层相对应

```java
/**
 * 业务层service一般与数据层dao功能类似，
 * 区别在于dao是直接对数据库操作，service是上层调用dao
 */

public interface BookService {
    //增加一个Book
    int addBook(Books book);
    //根据id删除一个Book
    int deleteBookById(int id);
    //更新Book
    int updateBook(Books books);
    //根据id查询,返回一个Book
    Books queryBookById(int id);
    //查询全部Book,返回list集合
    List<Books> queryAllBook();
    //查书
    Books queryBookName(String bookName);
}
```

实现类：注解开发。`service层直接调用dao层的操作`

```java
public class BookServiceImpl implements BookService{

    @Autowired
    private BookMapper bookMapper;
    public void setBookMapper(BookMapper bookMapper) {
        this.bookMapper = bookMapper;
    }


    @Override
    public int addBook(Books book) {
        return bookMapper.addBook(book);
    }
    @Override
    public int deleteBookById(int id) {
        return bookMapper.deleteBookById(id);
    }
    @Override
    public int updateBook(Books books) {
        return bookMapper.updateBook(books);
    }
    @Override
    public Books queryBookById(int id) {
        return bookMapper.queryBookById(id);
    }
    @Override
    public List<Books> queryAllBook() {
        return bookMapper.queryAllBook();
    }
    @Override
    public Books queryBookName(String bookName) {
        return bookMapper.queryBookName(bookName);
    }
}
```

### 3.2 整合service层

创建`spring-service.xml`文件<font color="red">**并在`applicationContext.xml`中进行注册**</font>

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xmlns:context="http://www.springframework.org/schema/context"
       xsi:schemaLocation="http://www.springframework.org/schema/beans
       http://www.springframework.org/schema/beans/spring-beans.xsd
       http://www.springframework.org/schema/context
       https://www.springframework.org/schema/context/spring-context.xsd">

    <!--1.扫描service包-->
    <context:component-scan base-package="com.liu.service"/>
    
    <!--2.将业务类都注入到spring，可以通过注解或配置实现-->
    <bean id="BookServiceImpl" class="com.liu.service.BookServiceImpl">
        <property name="bookMapper" ref="bookMapper"/>
    </bean>

    <!--3.声明式事务配置-->
    <bean id="transactionManager" class="org.springframework.jdbc.datasource.DataSourceTransactionManager">
        <!--注入数据源-->
        <property name="dataSource" ref="dataSource"/>
    </bean>

</beans>
```



## 4、SpringMVC框架搭建

搭建SpringMVC的基本流程：

1. 导入相关依赖
2. 编写`web.xml` , 注册`DispatcherServlet`
3. 编写`springmvc`配置文件
4. 接下来就是去创建对应的控制类 , controller
5. 最后完善前端视图和controller之间的对应。测试

《1》编写`web.xml`文件<font color="red">**并在`applicationContext.xml`中进行注册**</font>

```xml
<?xml version="1.0" encoding="UTF-8"?>
<web-app xmlns="http://xmlns.jcp.org/xml/ns/javaee"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://xmlns.jcp.org/xml/ns/javaee
         http://xmlns.jcp.org/xml/ns/javaee/web-app_4_0.xsd"
         version="4.0">

    <!--DispatchServlet-->
    <servlet>
        <servlet-name>springmvc</servlet-name>
        <servlet-class>org.springframework.web.servlet.DispatcherServlet</servlet-class>
        <init-param>
            <param-name>contextConfigLocation</param-name>
            <param-value>classpath:applicationContext.xml</param-value>
        </init-param>
        <load-on-startup>1</load-on-startup>
    </servlet>
    <servlet-mapping>
        <servlet-name>springmvc</servlet-name>
        <url-pattern>/</url-pattern>
    </servlet-mapping>

    <!--乱码过滤-->
    <filter>
        <filter-name>encodingFilter</filter-name>
        <filter-class>
            org.springframework.web.filter.CharacterEncodingFilter
        </filter-class>
        <init-param>
            <param-name>encoding</param-name>
            <param-value>utf-8</param-value>
        </init-param>
    </filter>
    <filter-mapping>
        <filter-name>encodingFilter</filter-name>
        <url-pattern>/*</url-pattern>
    </filter-mapping>


    <!--Session过期时间-->
    <session-config>
        <session-timeout>15</session-timeout>
    </session-config>

</web-app>
```

《2》创建`spring-mvc.xml`配置文件。并在`web/WEB-INF`下新建`jsp`文件夹

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xmlns:context="http://www.springframework.org/schema/context"
       xmlns:mvc="http://www.springframework.org/schema/mvc"
       xsi:schemaLocation="http://www.springframework.org/schema/beans
       http://www.springframework.org/schema/beans/spring-beans.xsd
       http://www.springframework.org/schema/mvc
       http://www.springframework.org/schema/mvc/spring-mvc.xsd
       http://www.springframework.org/schema/context
       http://www.springframework.org/schema/context/spring-context.xsd ">

    <!--1.注解驱动-->
    <mvc:annotation-driven/>

    <!--2.静态资源过滤-->
    <mvc:default-servlet-handler/>

    <!--3.扫描相关的包Controller-->
    <context:component-scan base-package="com.liu.controller"/>

    <!--4.视图解析器 -->
    <bean class="org.springframework.web.servlet.view.InternalResourceViewResolver" >
        <property name="viewClass" value="org.springframework.web.servlet.view.JstlView" />
        <!-- 前缀 -->
        <property name="prefix" value="/WEB-INF/jsp/" />
        <!-- 后缀 -->
        <property name="suffix" value=".jsp" />
    </bean>

</beans>
```



最后`applicationContext.xml`应该如图：

<img src="https://jihulab.com/Leslie61/imagelake/-/raw/main/pictures/2023/04/image-20210305065107243.png" alt="image-20210305065107243" style="zoom:80%;" />



## 5、编写对应controller类和前端页面

```java
@Controller
@RequestMapping("/book")
public class BookController {

    @Autowired
    @Qualifier("BookServiceImpl")
    private BookService bookService;

    /**
     * 查找所有书籍
     * @param model
     * @return
     */
    @RequestMapping("/allBook")
    public String list(Model model) {
        List<Books> list = bookService.queryAllBook();
        model.addAttribute("list", list);
        return "allBook";
    }
    /**
     * 去添加书籍
     * @return
     */
    @RequestMapping("/toAddBook")
    public String toAddPaper() {
        return "addBook";
    }

    /**
     * 添加书籍
     * @param books
     * @return
     */
    @RequestMapping("/addBook")
    public String addPaper(Books books) {
        System.out.println(books);
        bookService.addBook(books);
        return "redirect:/book/allBook";
    }

    /**
     * 去更新书籍
     * @param model
     * @param id
     * @return
     */
    @RequestMapping("/toUpdateBook")
    public String toUpdateBook(Model model, int id) {
        Books books = bookService.queryBookById(id);
        System.out.println(books);
        model.addAttribute("book",books );
        return "updateBook";
    }

    /**
     * 更新书籍
     * @param model
     * @param book
     * @return
     */
    @RequestMapping("/updateBook")
    public String updateBook(Model model, Books book) {
        System.out.println(book);
        bookService.updateBook(book);
        Books books = bookService.queryBookById(book.getBookID());
        model.addAttribute("books", books);
        return "redirect:/book/allBook";
    }

    /**
     * 删除书籍
     * @param id
     * @return
     */
    @RequestMapping("/del/{bookId}")
    public String deleteBook(@PathVariable("bookId") int id) {
        bookService.deleteBookById(id);
        return "redirect:/book/allBook";
    }


    /**
     * 查询书籍
     * @param bookName
     * @return
     */
    @RequestMapping("/queryBookName")
    public String queryBookName(String bookName,Model model) {
        Books books = bookService.queryBookName(bookName);
        if(books==null){
            return "redirect:/book/allBook";
        }
        List<Books> list = new ArrayList<>();
        list.add(books);
        model.addAttribute("list", list);
        return "allBook";
    }
}
```

**前端页面我直接copy的代码**

`allBook.jsp`

```html
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<html>
<head>
    <title>书籍列表</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <!-- 引入 Bootstrap -->
    <link href="https://cdn.bootcss.com/bootstrap/3.3.7/css/bootstrap.min.css" rel="stylesheet">
</head>
<body>

<div class="container">

    <div class="row clearfix">
        <div class="col-md-12 column">
            <div class="page-header">
                <h1>
                    <small>书籍列表 —— 显示所有书籍</small>
                </h1>
            </div>
        </div>
    </div>

    <div class="row">
        <%--新增书籍--%>
        <div class="col-md-4 column">
            <a class="btn btn-primary" href="${pageContext.request.contextPath}/book/allBook">首页</a>
            <a class="btn btn-primary" href="${pageContext.request.contextPath}/book/toAddBook">新增书籍</a>
        </div>
        <div class="col-md-4 column">
            <%--查询书籍--%>
            <form class="form-inline" action="${pageContext.request.contextPath}/book/queryBookName" method="post" style="float: right">
                <input type="text" name="queryBookName" class="form-control" placeholder="请输入要查询的书籍名称">
                <input type="submit" value="查询" class="btn btn-primary">
            </form>
        </div>
    </div>

    <div class="row clearfix">
        <div class="col-md-12 column">
            <table class="table table-hover table-striped">
                <thead>
                <tr>
                    <th>书籍编号</th>
                    <th>书籍名字</th>
                    <th>书籍数量</th>
                    <th>书籍详情</th>
                    <th>操作</th>
                </tr>
                </thead>

                <tbody>
                <c:forEach var="book" items="${requestScope.get('list')}">
                    <tr>
                        <td>${book.getBookID()}</td>
                        <td>${book.getBookName()}</td>
                        <td>${book.getBookCounts()}</td>
                        <td>${book.getDetail()}</td>
                        <td>
                            <a href="${pageContext.request.contextPath}/book/toUpdateBook?id=${book.getBookID()}">更改</a> |
                            <a href="${pageContext.request.contextPath}/book/del/${book.getBookID()}">删除</a>
                        </td>
                    </tr>
                </c:forEach>
                </tbody>
            </table>
        </div>
    </div>
</div>
```



`addBook.jsp`

```html
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>

<html>
<head>
    <title>新增书籍</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <!-- 引入 Bootstrap -->
    <link href="https://cdn.bootcss.com/bootstrap/3.3.7/css/bootstrap.min.css" rel="stylesheet">
</head>
<body>
<div class="container">

    <div class="row clearfix">
        <div class="col-md-12 column">
            <div class="page-header">
                <h1>
                    <small>新增书籍</small>
                </h1>
            </div>
        </div>
    </div>
    <form action="${pageContext.request.contextPath}/book/addBook" method="post">
        书籍名称：<input type="text" name="bookName"><br><br><br>
        书籍数量：<input type="text" name="bookCounts"><br><br><br>
        书籍详情：<input type="text" name="detail"><br><br><br>
        <input type="submit" value="添加">
    </form>

</div>
```



`updateBook.jsp`

```html
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<html>
<head>
    <title>修改信息</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <!-- 引入 Bootstrap -->
    <link href="https://cdn.bootcss.com/bootstrap/3.3.7/css/bootstrap.min.css" rel="stylesheet">
</head>
<body>
<div class="container">

    <div class="row clearfix">
        <div class="col-md-12 column">
            <div class="page-header">
                <h1>
                    <small>修改信息</small>
                </h1>
            </div>
        </div>
    </div>

    <form action="${pageContext.request.contextPath}/book/updateBook" method="post">
        <input type="hidden" name="bookID" value="${book.getBookID()}"/>
        书籍名称：<input type="text" name="bookName" value="${book.getBookName()}"/>
        书籍数量：<input type="text" name="bookCounts" value="${book.getBookCounts()}"/>
        书籍详情：<input type="text" name="detail" value="${book.getDetail() }"/>
        <input type="submit" value="提交"/>
    </form>

</div>
```

项目启动的初始页`index.jsp`

```html
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<!DOCTYPE HTML>
<html>
<head>

  <title>首页</title>

  <style type="text/css">
    a {
      text-decoration: none;
      color: black;
      font-size: 18px;
    }
    h3 {
      width: 180px;
      height: 38px;
      margin: 100px auto;
      text-align: center;
      line-height: 38px;
      background: deepskyblue;
      border-radius: 4px;
    }
  </style>

</head>
<body>

<h3>
  <a href="${pageContext.request.contextPath}/book/allBook">点击进入列表页</a>
</h3>
</body>
</html>
```



## 6、发布

完整的项目结构如图

<img src="https://jihulab.com/Leslie61/imagelake/-/raw/main/pictures/2023/04/image-20210305065635143.png" alt="image-20210305065635143" style="zoom:80%;" />

《1》在左上角File的`Project Structure`中`Artifacts`将项目打包。采用`Web Application:Exploded`打包【因为是后面添加的web framework，所以他自动打包的会缺少lib依赖，所以我们要自己打包】

《2》配置Tomcat，启动

<img src="https://jihulab.com/Leslie61/imagelake/-/raw/main/pictures/2023/04/image-20210305070415977.png" alt="image-20210305070415977" style="zoom:80%;" />

<img src="https://jihulab.com/Leslie61/imagelake/-/raw/main/pictures/2023/04/image-20210305070428608.png" alt="image-20210305070428608" style="zoom:80%;" />

<img src="https://jihulab.com/Leslie61/imagelake/-/raw/main/pictures/2023/04/image-20210305070446813.png" alt="image-20210305070446813" style="zoom:80%;" />

<img src="https://jihulab.com/Leslie61/imagelake/-/raw/main/pictures/2023/04/image-20210305070611508.png" alt="image-20210305070611508" style="zoom:80%;" />

这个项目虽然很简陋，但是基本的SSM框架很明了。两天时间快速过了一遍，仅仅也只是了解了基本流程，很多细节并不清楚。