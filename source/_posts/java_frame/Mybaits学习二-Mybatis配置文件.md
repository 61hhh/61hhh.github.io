---
title: 'Mybaits学习二:Mybatis配置文件'
tags: Mybatis
categories: Mybatis
abbrlink: 80bab4e7
date: 2020-09-28 17:40:42
---

Mybatis最重要的就是它的配置，而配置包含了Mybatis的至关重要的设置和属性等信息，官方文档中也专门给出一节来讲配置文件。本篇博客也是以[官方中文文档](https://mybatis.org/mybatis-3/zh/)为主要依据记笔记

可以ctrl+鼠标左键查看mybatis-config.xml头部的dtd头文件，点进去可以看到配置文件的element。MyBatis 的配置文件包含了会深深影响 MyBatis 行为的设置和属性信息。 配置文档的顶层结构如下：

- configuration（配置）
  - [properties（属性）](https://mybatis.org/mybatis-3/zh/configuration.html#properties)
  - [settings（设置）](https://mybatis.org/mybatis-3/zh/configuration.html#settings)
  - [typeAliases（类型别名）](https://mybatis.org/mybatis-3/zh/configuration.html#typeAliases)
  - [typeHandlers（类型处理器）](https://mybatis.org/mybatis-3/zh/configuration.html#typeHandlers)
  - [objectFactory（对象工厂）](https://mybatis.org/mybatis-3/zh/configuration.html#objectFactory)
  - [plugins（插件）](https://mybatis.org/mybatis-3/zh/configuration.html#plugins)
  - environments（环境配置）
    - environment（环境变量）
      - transactionManager（事务管理器）
      - dataSource（数据源）
  - [databaseIdProvider（数据库厂商标识）](https://mybatis.org/mybatis-3/zh/configuration.html#databaseIdProvider)
  - [mappers（映射器）](https://mybatis.org/mybatis-3/zh/configuration.html#mappers)

<font color="red">注：元素节点顺序是按照上面固定的，顺序错了会报错！</font>

（下面的学习顺序并不是按照结构来的，而是按照学习视频的代码去学的）

<!--more-->

### 环境配置（environments）

用于配置数据库运行的环境，我们可以配置多个，实现将SQL映射到多个不同的数据库上，至于具体在哪一个上运行，通过`default=" "`来设置

子元素节点`environment`就是一套环境，常见属性如下：

- 事务管理器`transactionManager`的配置（比如：type="JDBC"）。
- 数据源`dataSource`的配置（比如：type="POOLED"）。

```xml
<environments default="test">

        <environment id="development">
            <transactionManager type="JDBC"/>
            <dataSource type="POOLED">
                <property name="driver" value="com.mysql.jdbc.Driver"/>
                <property name="url" value="jdbc:mysql://localhost:3306/mybatis?useSSL=false&amp;useUnicode=true&amp;characterEncoding=utf8"/>
                <property name="username" value="root"/>
                <property name="password" value="leslie61"/>
            </dataSource>
        </environment>

        <environment id="test">
            <transactionManager type="JDBC"/>
            <dataSource type="POOLED">
                <property name="driver" value="${driver}"/>
                <property name="url" value="${url}"/>
                <property name="username" value="${username}"/>
                <property name="password" value="${password}"/>
            </dataSource>
        </environment>
    </environments>
```

- 数据源有三种内建类型：`type="[UNPOOLED|POOLED|JNDI]"`
  - unpooled：这个数据源的实现只是每次被请求时打开和关闭连接。
  - **pooled**：这种数据源的实现利用“池”的概念将 JDBC 连接对象组织起来 , 这是一种使得并发 Web 应用快速响应请求的流行处理方式。
  - jndi：这个数据源的实现是为了能在如 Spring 或应用服务器这类容器中使用，容器可以集中或在外部配置数据源，然后放置一个 JNDI 上下文的引用。
  - 数据源也有很多第三方的实现，比如dbcp，c3p0，druid等等....
- 在 MyBatis 中有两种类型的事务管理器（也就是 type="[JDBC|MANAGED]"）：
  - JDBC – 这个配置直接使用了 JDBC 的提交和回滚设施，它依赖从数据源获得的连接来管理事务作用域。
  - MANAGED – 这个配置几乎没做什么。它从不提交或回滚一个连接，而是让容器来管理事务的整个生命周期（比如 JEE 应用服务器的上下文）。 默认情况下它会关闭连接。然而一些容器并不希望连接被关闭，因此需要将` closeConnection` 属性设置为 false 来阻止默认的关闭行为。

更多详细的信息可以查阅[官方中文文档](https://mybatis.org/mybatis-3/zh/)~



### 映射器（mappers）

官方文档的解释如下：

> 既然 MyBatis 的行为已经由上述元素配置完了，我们现在就要来定义 SQL 映射语句了。 但首先，我们需要告诉 MyBatis 到哪里去找到这些语句。 在自动查找资源方面，Java 并没有提供一个很好的解决方案，所以最好的办法是直接告诉 MyBatis 到哪里去找映射文件。 你可以使用相对于类路径的资源引用，或完全限定资源定位符（包括 `file:///` 形式的 URL），或类名和包名等。

解释一下：MyBatis 是基于 sql 映射配置的框架，sql 语句都写在 Mapper 配置文件【即`UserMapper.xml`之类的文件】中，当构建 SqlSession 类之后，就需要去读取 Mapper 配置文件中的 sql 配置。而 mappers 标签就是用来配置需要加载的 sql 映射配置文件路径的。

常见的四种引入Mapper资源方式：

```xml
<!-- 使用相对于类路径的资源引用,表示文件夹下的xml文件 -->
<mappers>
 <mapper resource="org/mybatis/builder/PostMapper.xml"/>
</mappers>
<!-- 使用映射器接口实现类的完全限定类名,通过动态代理接口找到*.xml文件-->
<mappers>
  <mapper class="org.mybatis.builder.AuthorMapper"/>
  <mapper class="org.mybatis.builder.BlogMapper"/>
  <mapper class="org.mybatis.builder.PostMapper"/>
</mappers>
<!-- 使用完全限定资源定位符（URL）,绝对路径查找,不推荐使用 -->
<mappers>
  <mapper url="file:///var/mappers/AuthorMapper.xml"/>
  <mapper url="file:///var/mappers/BlogMapper.xml"/>
  <mapper url="file:///var/mappers/PostMapper.xml"/>
</mappers>
<!-- 将包内的映射器接口实现全部注册为映射器 -->
<mappers>
  <package name="org.mybatis.builder"/>
</mappers>
```

这些配置会告诉 MyBatis 去哪里找映射文件，剩下的细节就应该是每个 SQL 映射文件了，这就是下一篇SQL映射文件的内容了



### 属性（properties）

这些属性可以在外部进行配置，并可以进行动态替换。你既可以在典型的 Java 属性文件中配置这些属性，也可以在 properties 元素的子元素中设置。

以我们的项目为例，资源目录下新建文件`db.properties`，代码如下：

```properties
driver = com.mysql.jdbc.Driver
url = jdbc:mysql://localhost:3306/mybatis?useSSL=false&useUnicode=true&characterEncoding=utf8
username = root
password = leslie61
//看着很眼熟？内容其实就是mybatis-config.xml中datasource标签下的property部分啊
```

将编写的文件导入：通过`properties`标签引入

```xml
<?xml version="1.0" encoding="UTF-8" ?>
<!DOCTYPE configuration
        PUBLIC "-//mybatis.org//DTD Config 3.0//EN"
        "http://mybatis.org/dtd/mybatis-3-config.dtd">
<configuration>
    <!--引入外部配置文件-->
    <properties resource="db.properties" />

    <environments default="test">
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
    
</configuration>
```

引入`db.properties`文件目的就是为了替换需要动态配置的属性值，原来的`driver、url、username、password`属性的value被文件中对应的value替换。

如果一个属性出现在多个地方，那么Mybatis的加载顺序：

- 首先读取在 properties 元素体内指定的属性。
- 然后根据 properties 元素中的 resource 属性读取类路径下属性文件，或根据 url 属性指定的路径读取属性文件，并覆盖之前读取过的同名属性。
- 最后读取作为方法参数传递的属性，并覆盖之前读取过的同名属性。

因此，通过方法参数传递的属性具有最高优先级，resource/url 属性中指定的配置文件次之，最低优先级的则是 properties 元素中指定的属性。



### 类型别名（typeAliases）

这个比较简单，就是为pojo设置别名，正常情况下我们的代码，用到实体类都要写明路径，使用别名就可以简化操作：

```xml
<!--在核心配置文件中-->
<typeAliases>
    <typeAlias alias="User" type="com.liu2.pojo.User"/>
</typeAliases>

<!--原来的文件
<select id="selectUser" resultType="com.liu2.pojo.User" >
  select * from user
</select>
-->
<!--mapper.xml文件中简化使用-->
<select id="selectUser" resultType="User" >
  select * from user
</select>
```

当然，除了这种`type alias`方式指定别名，也可以使用`name`指定一个包名，Mybatis会在包名下搜索需要的Java Bean，没有注解的情况下采用首字母小写的非限定性类名作为别名。



### 其他配置浏览

以上是一些主要的常用配置属性，下面是一些比较重要的

#### 设置（settings）

中文文档：这是 MyBatis 中极为重要的调整设置，它们会改变 MyBatis 的运行时行为。

常见实现：

- 懒加载
- 日志的实现
- 缓存开启关闭

```xml
<settings>
 <setting name="cacheEnabled" value="true"/>
 <setting name="lazyLoadingEnabled" value="true"/>
 <setting name="multipleResultSetsEnabled" value="true"/>
 <setting name="useColumnLabel" value="true"/>
 <setting name="useGeneratedKeys" value="false"/>
 <setting name="autoMappingBehavior" value="PARTIAL"/>
 <setting name="autoMappingUnknownColumnBehavior" value="WARNING"/>
 <setting name="defaultExecutorType" value="SIMPLE"/>
 <setting name="defaultStatementTimeout" value="25"/>
 <setting name="defaultFetchSize" value="100"/>
 <setting name="safeRowBoundsEnabled" value="false"/>
 <setting name="mapUnderscoreToCamelCase" value="false"/>
 <setting name="localCacheScope" value="SESSION"/>
 <setting name="jdbcTypeForNull" value="OTHER"/>
 <setting name="lazyLoadTriggerMethods" value="equals,clone,hashCode,toString"/>
</settings>
```



#### 类型处理器（typeHandlers）

MyBatis 在设置预处理语句（PreparedStatement）中的参数或从结果集中取出一个值时， 都会用类型处理器将获取到的值以合适的方式转换成 Java 类型。

我们也可以重写类型处理器或创建你自己的类型处理器来处理不支持的或非标准的类型。

更多内容可以参看[官方中文文档](https://mybatis.org/mybatis-3/zh/)~





### 生命周期和作用域

首先应该先说执行的过程：

1. 创建SqlSessionFactoryBuilder对象，调用build(inputstream)方法读取并解析配置文件，返回SqlSessionFactory对象
2. 由SqlSessionFactory创建SqlSession 对象，没有手动设置的话事务默认开启
3. 调用SqlSession中的api，传入Statement Id和参数，内部进行复杂的处理，最后调用jdbc执行SQL语句，封装结果返回。

<img src="https://jihulab.com/Leslie61/imagelake/-/raw/main/pictures/2023/04/image-20230420180557703.png" alt="image-20230420180557703" style="zoom: 70%;" />

关于作用域狂神说的挺好的，我就直接引用了

**作用域理解**

- SqlSessionFactoryBuilder 的作用在于创建 SqlSessionFactory，创建成功后，SqlSessionFactoryBuilder 就失去了作用，所以它只能存在于创建 SqlSessionFactory 的方法中，而不要让其长期存在。因此 **SqlSessionFactoryBuilder 实例的最佳作用域是方法作用域**（也就是局部方法变量）。
- SqlSessionFactory 可以被认为是一个数据库连接池，它的作用是创建 SqlSession 接口对象。因为 MyBatis 的本质就是 Java 对数据库的操作，所以 SqlSessionFactory 的生命周期存在于整个 MyBatis 的应用之中，所以一旦创建了 SqlSessionFactory，就要长期保存它，直至不再使用 MyBatis 应用，所以可以认为 SqlSessionFactory 的生命周期就等同于 MyBatis 的应用周期。
- 由于 SqlSessionFactory 是一个对数据库的连接池，所以它占据着数据库的连接资源。如果创建多个 SqlSessionFactory，那么就存在多个数据库连接池，这样不利于对数据库资源的控制，也会导致数据库连接资源被消耗光，出现系统宕机等情况，所以尽量避免发生这样的情况。
- 因此在一般的应用中我们往往希望 SqlSessionFactory 作为一个单例，让它在应用中被共享。所以说 **SqlSessionFactory 的最佳作用域是应用作用域。**
- 如果说 SqlSessionFactory 相当于数据库连接池，那么 SqlSession 就相当于一个数据库连接（Connection 对象），你可以在一个事务里面执行多条 SQL，然后通过它的 commit、rollback 等方法，提交或者回滚事务。所以它应该存活在一个业务请求中，处理完整个请求后，应该关闭这条连接，让它归还给 SqlSessionFactory，否则数据库资源就很快被耗费精光，系统就会瘫痪，所以用 try...catch...finally... 语句来保证其正确关闭。
- **所以 SqlSession 的最佳的作用域是请求或方法作用域。**

它们之间的结构联系、生命周期如图：

<img src="https://jihulab.com/Leslie61/imagelake/-/raw/main/pictures/2023/04/image-20230420180611134.png" alt="image-20230420180611134" style="zoom:80%;" />

其实看过配置文件，多写几个demo后，就会发现常用的还是那几个，其他的配置文件感觉都是了解为主，有问题随时去[官方中文文档](https://mybatis.org/mybatis-3/zh/)查阅，主要还是要理解配置文件怎么整、Mybatis的执行过程和它们的关系！







