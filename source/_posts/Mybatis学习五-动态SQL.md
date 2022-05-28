---
title: Mybatis学习五-动态SQL
tags: Mybatis
categories: Mybatis
abbrlink: 3e64f5c6
date: 2020-10-03 17:49:15
---

## 介绍

官方文档专门将动态SQL拿出来作为一个小节，可见其还是非常重要的，先看一下文档的描述：

>动态 SQL 是 MyBatis 的强大特性之一。如果你使用过 JDBC 或其它类似的框架，你应该能理解根据不同条件拼接 SQL 语句有多痛苦，例如拼接时要确保不能忘记添加必要的空格，还要注意去掉列表最后一个列名的逗号。利用动态 SQL，可以彻底摆脱这种痛苦。
>
>使用动态 SQL 并非一件易事，但借助可用于任何 SQL 映射语句中的强大的动态 SQL 语言，MyBatis 显著地提升了这一特性的易用性。
>
>如果你之前用过 JSTL 或任何基于类 XML 语言的文本处理器，你对动态 SQL 元素可能会感觉似曾相识。在 MyBatis 之前的版本中，需要花时间了解大量的元素。借助功能强大的基于 OGNL 的表达式，MyBatis 3 替换了之前的大部分元素，大大精简了元素种类，现在要学习的元素种类比原来的一半还要少。
>
>-------------------------------
>  - if
>  - choose (when, otherwise)
>  - trim (where, set)
>  - foreach
>-------------------------------

看了官方文档介绍，感觉就是：对于一些复杂SQL语句需要拼接，可能自己写的时候往往会漏个逗号多个标签之类的，而动态SQL通过上面的那些标签，可以自动的帮我们拼接

<!--more-->



## 搭建环境

准备一个博客数据库，字段有id、作者、标题、时间、浏览量

```sql
CREATE TABLE `blog` (
`id` varchar(50) NOT NULL COMMENT '博客id',
`title` varchar(100) NOT NULL COMMENT '博客标题',
`author` varchar(30) NOT NULL COMMENT '博客作者',
`create_time` datetime NOT NULL COMMENT '创建时间',
`views` int(30) NOT NULL COMMENT '浏览量'
) ENGINE=InnoDB DEFAULT CHARSET=utf8
```

使用IDUtil工具类生成随机id

```java
public class IDUtil {
   public static String genId(){
       return UUID.randomUUID().toString().replaceAll("-","");
  }
}
```

编写实体类

```java
@Data
public class Blog {
    private String id;
    private String title;
    private String author;
    private Date createTime;    //属性名和字段名不一致,(因为数据库的大小写转换)可以设置mapUnderscoreToCamelCase为true实现驼峰命名转换
    private int views;
}
```

编写接口和配置mapper文件，并在核心配置中注册mapper

```java
public interface BlogMapper {
    //插入数据
    int addBlog(Blog blog);

    //查询博客
    List<Blog> queryBlog(Map map);

    //查询博客
    List<Blog> queryBlogChoose(Map map);

    //更新博客
    int updateBlog(Map map);

    //使用forEach遍历查询
    List<Blog> queryBlogForeach(Map map);
}

```


### if语句

**需求：根据作者名字和博客名字来查询博客！如果作者名字为空，那么只根据博客名字查询，反之，则根据作者名来查询**。对应上面接口的`queryBlog`方法‘

```xml
<!--需求1：
根据作者名字和博客名字来查询博客！
如果作者名字为空，那么只根据博客名字查询，反之，则根据作者名来查询
select * from blog where title = #{title} and author = #{author}
-->
<select id="queryBlogIf" parameterType="map" resultType="blog">
  select * from blog where
   <if test="title != null">
      title = #{title}
   </if>
   <if test="author != null">
      and author = #{author}
   </if>
</select>
```

测试代码：

```java
@Test
    public void queryBlog(){
        SqlSession sqlSession = MybatisUtils.getSession();
        BlogMapper mapper = sqlSession.getMapper(BlogMapper.class);

        HashMap map = new HashMap();
//        map.put("title","Java如此简单");
        map.put("author","狂神说");
        List<Blog> blogList = mapper.queryBlog(map);
        for(Blog blog:blogList){
            System.out.println(blog);
        }

        sqlSession.close();
    }
```

这样写我们可以看到，如果 author 等于 null，那么查询语句为 select * from user where title=#{title},但是如果title为空呢？那么查询语句为 select * from user where<font color="red"> and </font>author=#{author}，这是错误的 SQL 语句！如何解决呢？请看下面的 where 语句！



### where语句

修改上面的SQL语句：

```xml
<select id="queryBlogIf" parameterType="map" resultType="blog">
  select * from blog
   <where>
       <if test="title != null">
          title = #{title}
       </if>
       <if test="author != null">
          and author = #{author}
       </if>
   </where>
</select>
```

这个“where”标签会知道如果它包含的标签中有返回值的话，它就插入一个‘where’。此外，如果标签返回的内容是以AND 或OR 开头的，则它会剔除掉。

测试类参照之前的代码



### set语句

同理，上面的对于查询 SQL 语句包含 where 关键字，如果在进行**更新操作**的时候，含有 set 关键词，我们怎么处理呢？对应接口中的`updateBlog`方法。

```xml
<!--注意set是用的逗号隔开-->
<update id="updateBlog" parameterType="map">
  update blog
     <set>
         <if test="title != null">
            title = #{title},
         </if>
         <if test="author != null">
            author = #{author}
         </if>
     </set>
  where id = #{id};
</update>
```

测试set

```java
    @Test
    public void UpdateBlogTest(){
        SqlSession sqlSession = MybatisUtils.getSession();
        BlogMapper mapper = sqlSession.getMapper(BlogMapper.class);

        HashMap map = new HashMap();
        //采用choose标签 默认匹配第一个就结束了
        map.put("title","Mybatis如此简单2222");
        map.put("author","狂神说2333");
        map.put("id","123");
        mapper.updateBlog(map);

        sqlSession.commit();
        sqlSession.close();
    }
```



### choose语句

有时候，我们不想用到所有的查询条件，只想选择其中的一个，查询条件有一个满足即可，使用 choose 标签可以解决此类问题，类似于 Java 的 switch 语句，遇到一个满足条件的就返回了，对应接口的`queryBlogChoose`方法。

```xml
<select id="queryBlogChoose" parameterType="map" resultType="blog">
  select * from blog
   <where>
       <choose>
           <when test="title != null">
                title = #{title}
           </when>
           <when test="author != null">
              and author = #{author}
           </when>
           <otherwise>
              and views = #{views}
           </otherwise>
       </choose>
   </where>
</select>
```

测试类参照之前的代码



### 提取SQL片段

有时候可能某个 sql 语句我们用的特别多，为了增加代码的重用性，简化代码，我们需要将这些代码抽取出来，然后使用时直接调用。

**提取SQL片段：**

```xml
<sql id="if-title-author">
   <if test="title != null">
      title = #{title}
   </if>
   <if test="author != null">
      and author = #{author}
   </if>
</sql>
```

**引用SQL片段：**

```xml
<select id="queryBlogIf" parameterType="map" resultType="blog">
  select * from blog
   <where>
       <!-- 引用 sql 片段，如果refid 指定的不在本文件中，那么需要在前面加上 namespace -->
       <include refid="if-title-author"></include>
       <!-- 在这里还可以引用其他的 sql 片段 -->
   </where>
</select>
```



### Foreach语句

将数据库中前三个数据的id修改为1,2,3；需求：我们需要查询 blog 表中 id 分别为1,2,3的博客信息，即遍历前三个数据项，对应接口`queryBlogForeach`。

```xml
<select id="queryBlogForeach" parameterType="map" resultType="blog">
  select * from blog
   <where>
       <!--
       collection:指定输入对象中的集合属性
       item:每次遍历生成的对象
       open:开始遍历时的拼接字符串
       close:结束时拼接的字符串
       separator:遍历对象之间需要拼接的字符串
       select * from blog where 1=1 and (id=1 or id=2 or id=3)
     -->
       <foreach collection="ids"  item="id" open="and (" close=")" separator="or">
          id=#{id}
       </foreach>
   </where>
</select>
```

测试类参照之前的代码



**我写的完整代码如下：**

```xml
<?xml version="1.0" encoding="UTF-8" ?>
<!DOCTYPE mapper
        PUBLIC "-//mybatis.org//DTD Config 3.0//EN"
        "http://mybatis.org/dtd/mybatis-3-mapper.dtd">
<mapper namespace="com.liu8.dao.BlogMapper">

    <insert id="addBlog" parameterType="Blog">
        insert into mybatis.blog (id, title, author, create_time, views)
        values (#{id},#{title},#{author},#{createTime},#{views});
    </insert>

    <sql id="if-title-author">
        <if test="title != null">
            title = #{title}
        </if>
        <if test="author != null">
            and author = #{author}
        </if>
    </sql>

    <select id="queryBlog" parameterType="map" resultType="Blog">
        select * from mybatis.blog
        <where>
            <include refid="if-title-author"></include>
        </where>
    </select>

    <select id="queryBlogChoose" parameterType="map" resultType="Blog">
        select * from mybatis.blog
        <where>
            <choose>
                <when test="title != null">
                    title = #{title}
                </when>
                <when test="author != null">
                    and author = #{author}
                </when>
                <otherwise>
                    and views = #{views}
                </otherwise>
            </choose>
        </where>
    </select>

    <update id="updateBlog" parameterType="map">
        update mybatis.blog
        <set>
            <if test="title != null">
                title = #{title},
            </if>
            <if test="author != null">
                author = #{author}
            </if>
        </set>
        where id = #{id}
    </update>

    <!--
        select * from blog where 1=1 and ( id=1 or id=2 or id=3 );
        传入的Collection是由map提供的
    -->
    <select id="queryBlogForeach" parameterType="map" resultType="Blog">
        select * from mybatis.blog
        <where>
            <foreach collection="ids" item="id" open="and (" close=")" separator="or">
                id = #{id}
            </foreach>
        </where>
    </select>

</mapper>
```

**总结**

其实动态 sql 语句的编写主要问题就是拼接，所以我们可以先写出完整的原生sql语句，然后再根据动态SQL选择合适的标签将其划分！

























