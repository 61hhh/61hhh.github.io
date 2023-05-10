---
title: Mybatis学习六-缓存
tags: Mybatis
categories: Mybatis
abbrlink: 61e534eb
date: 2020-10-05 10:45:40
---

## 缓存

缓存的概念：存在内存中的临时数据。将用户经常查询的数据放在缓存（内存）中，用户去查询数据就不用从磁盘上(关系型数据库数据文件)查询，从缓存中查询，从而提高查询效率，解决了高并发系统的性能问题。

好处：减少和数据库的交互次数，减少系统开销，提高系统效率。

常用对象：需要频繁查询且较少改变的对象

<!--more-->

### Mybatis缓存特性

mybatis 也提供了对缓存的支持， 分为**一级缓存**和**二级缓存**。

- 默认情况下，只有一级缓存开启。（SqlSession级别的缓存，也称为本地缓存）
- 二级缓存需要手动开启和配置，他是基于namespace级别的缓存。
- 为了提高扩展性，MyBatis定义了缓存接口Cache。我们可以通过实现Cache接口来自定义二级缓存

> 【注】狂神的视频只是简单介绍了一级二级缓存以及开启方法，我将其整理，在网上找了一些**Mybatis缓存机制**相关博客进行补充！

在Mybatis的jar包中，找到`org.apache.ibatis`可以看到`cache`目录下的文件

<img src="https://jihulab.com/Leslie61/imagelake/-/raw/main/pictures/2023/04/image-20230420180957876.png" alt="image-20230420180957876" style="zoom:80%;" />

其中有一个Cache 接口，只有一个默认的实现类 PerpetualCache，它是用HashMap 实现的。





## 一级缓存

**概念原理：**

之前学习过：每当我们使用MyBatis开启一次和数据库的会话，Mybatis会创建出**一个SqlSession对象表示一次数据库会话**。一次会话中会有多次查询，其中可能就会有很多重复的，Mybatis处理的方法是什么呢？

答：MyBatis会在表示会话的SqlSession对象中建立一个缓存，将每次查询到的结果结果缓存起来，当下次查询的时候，如果判断先前有个完全一样的查询，会直接从缓存中直接将结果取出，返回给用户，不需要再进行一次数据库查询了。

SqlSession只是一个Mybatis对外的接口，SqlSession将它的工作交给了Executor执行器这个角色来完成，负责完成对数据库的各种操作。当创建了一个SqlSession对象时，Mybatis会为这个对象创建一个新的Executor执行器，而缓存信息就被维护在这个Executor执行器中，Mybatis将缓存和对缓存相关的操作封装成了Cache接口中。

<img src="https://jihulab.com/Leslie61/imagelake/-/raw/main/pictures/2023/04/Mybatis-localCache.png" alt="Mybatis-localCache" style="zoom:67%;" />

由于Session级别的一级缓存实际上就是使用**PerpetualCache**维护的，那么**PerpetualCache**是怎样实现的呢？

**PerpetualCache**实现原理其实很简单，其内部就是通过一个简单的**HashMap**来实现的，没有其他的任何限制。

> 这里作为Mybatis的入门，只是了解一下。
>
> 更多底层的执行步骤细节、源码实现，以后再专门去学习记录！



### 一级缓存的测试

编写接口方法

```java
public interface UserMapper {
    //根据ID查询用户
    User queryUserById( int id);
}
```

接口对应的Mapper文件

```xml
<select id="queryUserById" resultType="com.liu9.pojo.User">
    select * from mybatis.user
    where  id = #{id}
</select>
```

测试

```java
@Test
public void testQueryUserById(){
   SqlSession session = MybatisUtils.getSession();
   UserMapper mapper = session.getMapper(UserMapper.class);

   User user = mapper.queryUserById(1);
   System.out.println(user);
   User user2 = mapper.queryUserById(1);
   System.out.println(user2);
   System.out.println(user==user2);

   session.close();
}
```

可以看到：查询语句只执行了一次！并且判断`user1==user2`结果为true

<img src="https://jihulab.com/Leslie61/imagelake/-/raw/main/pictures/2023/04/image-20230420181057541.png" alt="image-20230420181057541" style="zoom:80%;" />



### 一级缓存生命周期

- 一级缓存是SqlSession级别的缓存，所以在SqlSession会话结束后，SqlSession对象及其内部的Executor和PerpetualCache对象都会一并释放掉
- SqlSession调用了close()方法时，会释放PerpetualCache对象
- SqlSession调用了clearCache()方法时，清空缓存，对象仍可用
- SqlSession调用了增删改等方法时，清空缓存，对象仍可用



以下是四种常见的SqlSession失效情况：

#### 1、不同的SqlSession

```java
@Test
public void queryUserByIdTest(){
    SqlSession sqlSession = MybatisUtils.getSession();
    SqlSession sqlSession2 = MybatisUtils.getSession();

    UserMapper mapper = sqlSession.getMapper(UserMapper.class);
    User user1 = mapper.queryUserById(1);
    System.out.println(user1);
    System.out.println("<------------------------------------>");
    sqlSession.close();

    UserMapper mapper2 = sqlSession2.getMapper(UserMapper.class);
    User user2 = mapper2.queryUserById(1);
    System.out.println(user2);
    System.out.println("<------------------------------------>");

    System.out.println(user1==user2);
    sqlSession2.close();
}
```

上面的代码开启了两个SqlSession，分别执行相同的查询，输出如下：可以看到它执行了两次SQL，表明user1的缓存并没有作用到user2上！结论：**每个sqlSession中的缓存相互独立**

<img src="https://jihulab.com/Leslie61/imagelake/-/raw/main/pictures/2023/04/image-20230420181132780.png" alt="image-20230420181132780" style="zoom:80%;" />



#### 2、sqlSession相同，查询条件不同

```java
@Test
public void testQueryUserById(){
   SqlSession session = MybatisUtils.getSession();
   UserMapper mapper = session.getMapper(UserMapper.class);
   UserMapper mapper2 = session.getMapper(UserMapper.class);

   User user = mapper.queryUserById(1);
   System.out.println(user);
   User user2 = mapper2.queryUserById(2);
   System.out.println(user2);
   System.out.println(user==user2);

   session.close();
}
```

这个很明显，user1和user2查询的对象并不相同，user1缓存的是queryUserById(1)内容，不能复用到user2上。同样观察结果发现两次查询，判断为false

<img src="https://jihulab.com/Leslie61/imagelake/-/raw/main/pictures/2023/04/image-20230420181159362.png" alt="image-20230420181159362" style="zoom:80%;" />



#### 3、sqlSession相同，两次查询之间执行了增删改操作

增加方法updateUser

```java
//修改用户
int updateUser(Map map);
```

配置对应的SQL语句

```xml
<update id="updateUser" parameterType="map">
  update user set name = #{name} where id = #{id}
</update>
```

编写测试代码：

```java
@Test
public void testQueryUserById3(){
    SqlSession session = MybatisUtils.getSession();
    UserMapper mapper = session.getMapper(UserMapper.class);

    User user = mapper.queryUserById(1);
    System.out.println(user);

    HashMap map = new HashMap();
    map.put("name","liuyi");
    map.put("id",4);
    mapper.updateUser(map);

    User user2 = mapper.queryUserById(1);
    System.out.println(user2);

    System.out.println(user==user2);

    session.close();
}
```

在两次查询中间加入了一个update操作

<img src="https://jihulab.com/Leslie61/imagelake/-/raw/main/pictures/2023/04/image-20230420181216600.png" alt="image-20230420181216600" style="zoom:80%;" />



#### 4、sqlSession相同，手动清除一级缓存

```java
@Test
public void testQueryUserById(){
   SqlSession session = MybatisUtils.getSession();
   UserMapper mapper = session.getMapper(UserMapper.class);

   User user = mapper.queryUserById(1);
   System.out.println(user);

   session.clearCache();//手动清除缓存

   User user2 = mapper.queryUserById(1);
   System.out.println(user2);

   System.out.println(user==user2);

   session.close();
}
```

输出与上面一致，因为cache被手动清除了。



## 二级缓存

**概念原理：**

​		二级缓存是用来解决一级缓存不能跨会话共享的问题的，范围是namespace 级别的，可以被多个SqlSession 共享（只要是同一个接口里面的相同方法，都可以共享），生命周期和应用同步。如果你的MyBatis使用了二级缓存，并且你的Mapper和select语句也配置使用了二级缓存，那么在执行select查询的时候，MyBatis会先从二级缓存中取输入，其次才是一级缓存，即MyBatis查询数据的顺序是：二级缓存  —> 一级缓存 —> 数据库。

MyBatis 用了一个装饰器的类来维护，就是CachingExecutor。如果启用了二级缓存，MyBatis 在创建Executor 对象的时候会对Executor 进行装饰。CachingExecutor 对于查询请求，会判断二级缓存是否有缓存结果，如果有就直接返回，如果没有委派交给真正的查询器Executor 实现类，比如SimpleExecutor 来执行查询，再走到一级缓存的流程。最后会把结果缓存起来，并且返回给用户。

<img src="https://jihulab.com/Leslie61/imagelake/-/raw/main/pictures/2023/04/image-20230420181235208.png" alt="image-20230420181235208" style="zoom:80%;" />



### 开启二级缓存

开启二级缓存可以参考官方文档，里面有介绍。

1、开启全局缓存 【mybatis-config.xml】

```xml
<!--显式地开启全局缓存-->
<setting name="cacheEnabled" value="true"/>
```

2、去每个mapper.xml中配置使用二级缓存，这个配置非常简单；【xxxMapper.xml】

```xml
<cache/>
官方示例=====>查看官方文档
<cache
 eviction="FIFO"
 flushInterval="60000"
 size="512"
 readOnly="true"/>
这个更高级的配置创建了一个 FIFO 缓存，每隔 60 秒刷新，最多可以存储结果对象或列表的 512 个引用，而且返回的对象被认为是只读的，因此对它们进行修改可能会在不同线程中的调用者产生冲突。
```

3、代码测试

```java
@Test
public void testQueryUserById(){
   SqlSession session = MybatisUtils.getSession();
   SqlSession session2 = MybatisUtils.getSession();

   UserMapper mapper = session.getMapper(UserMapper.class);
   UserMapper mapper2 = session2.getMapper(UserMapper.class);

   User user = mapper.queryUserById(1);
   System.out.println(user);
   session.close();

   User user2 = mapper2.queryUserById(1);
   System.out.println(user2);
   System.out.println(user==user2);

   session2.close();
}
```

结果成功，类似上面。

只要开启了二级缓存，我们在同一个Mapper中的查询，可以在二级缓存中拿到数据；查出的数据都会被默认先放在一级缓存中；只有会话提交或者关闭以后，一级缓存中的数据才会转到二级缓存中



**缓存原理图**

<img src="https://jihulab.com/Leslie61/imagelake/-/raw/main/pictures/2023/04/image-20230420181252335.png" alt="image-20230420181252335" style="zoom:80%;" />



**第三方缓存EhCache**

MyBatis定义了缓存接口Cache。我们可以通过实现Cache接口来自定义二级缓存。以比较知名的EhCache为例：Ehcache是一种广泛使用的java分布式缓存，用于通用缓存；

要在应用程序中使用Ehcache，需要引入依赖的jar包

```xml
<!-- https://mvnrepository.com/artifact/org.mybatis.caches/mybatis-ehcache -->
<dependency>
   <groupId>org.mybatis.caches</groupId>
   <artifactId>mybatis-ehcache</artifactId>
   <version>1.1.0</version>
</dependency>
```

在mapper文件中写入

```xml
<!--在当前的mapper中开启自定义二级缓存-->
<cache
        eviction="FIFO"
        flushInterval="60000"
        size="512"
        readOnly="true"/>
<cache type="org.mybatis.caches.ehcache.EhcacheCache"/>
```

编写ehcache.xml文件，如果在加载时未找到/ehcache.xml资源或出现问题，则将使用默认配置。

【注】：详细的配置可以自行百度了解



## 参考

- [mybatis缓存机制](https://www.cnblogs.com/wuzhenzhao/p/11103043.html)
- [《深入理解mybatis原理》MyBatis的一级缓存实现详解 及使用注意事项](https://blog.csdn.net/luanlouis/article/details/41280959)