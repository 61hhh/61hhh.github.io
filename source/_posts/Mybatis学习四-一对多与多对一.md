---
title: Mybatis学习四-一对多与多对一
date: 2020-10-03 17:48:30
tags: Mybatis
categories: Mybatis
---

## 问题引入

在实际开发中，实体对象之间的关联往往是很复杂的，在查询时往往需要连表查询！mybatis 提供了高级的关联查询功能，可以很方便地将数据库获取的结果集映射到定义的Java Bean 中。以老师和学生为例，一个班主任带着多个学生，多个学生属于一个班主任名下

<!--more-->



## 环境准备

建立学生、老师两张表用于测试，

```sql
CREATE TABLE `teacher` (
`id` INT(10) NOT NULL,
`name` VARCHAR(30) DEFAULT NULL,
PRIMARY KEY (`id`)
) ENGINE=INNODB DEFAULT CHARSET=utf8

INSERT INTO teacher(`id`, `name`) VALUES (1, '秦老师');

CREATE TABLE `student` (
`id` INT(10) NOT NULL,
`name` VARCHAR(30) DEFAULT NULL,
`tid` INT(10) DEFAULT NULL,
PRIMARY KEY (`id`),
KEY `fktid` (`tid`),
CONSTRAINT `fktid` FOREIGN KEY (`tid`) REFERENCES `teacher` (`id`)
) ENGINE=INNODB DEFAULT CHARSET=utf8


INSERT INTO `student` (`id`, `name`, `tid`) VALUES ('1', '小明', '1');
INSERT INTO `student` (`id`, `name`, `tid`) VALUES ('2', '小红', '1');
INSERT INTO `student` (`id`, `name`, `tid`) VALUES ('3', '小张', '1');
INSERT INTO `student` (`id`, `name`, `tid`) VALUES ('4', '小李', '1');
INSERT INTO `student` (`id`, `name`, `tid`) VALUES ('5', '小王', '1');
```

Lombok插件配合库函数可以省去我们自行编写构造函数、setter、getter方法的时间

1、IDEA安装Lombok插件（Plugin中搜索安装）

2、引入Maven依赖

```xml
<!-- https://mvnrepository.com/artifact/org.projectlombok/lombok -->
<dependency>
 <groupId>org.projectlombok</groupId>
 <artifactId>lombok</artifactId>
 <version>1.16.10</version>
</dependency>
```



## 多对一情况

多个学生对同一个老师，就是从学生表去关联老师。

编写对应的pojo实体类，利用Lombok，添加注释简化操作

```java
@Data //GET,SET,ToString，有参，无参构造
public class Teacher {
   private int id;
   private String name;
}
```

```java
@Data
public class Student {
   private int id;
   private String name;
   //多个学生可以是同一个老师，即多对一
   private Teacher teacher;
}
```

编写实体类对应的接口、以及对应的mapper映射文件

```java
public interface StudentMapper {
}
```
```java
public interface TeacherMapper {
}
```

现在我们要做的就是查询学生信息，但是学生表里，老师的信息只有外键`tid`，而不是具体的老师姓名，要查询到真实的信息，就需要做联表查询！



### 1、按查询嵌套处理

通过查询嵌套来实现，就跟我们学数据库时，写的嵌套查询代码类似，是子查询

编写学生的StudentMapper接口，声明函数

```java
public interface StudentMapper {

    //查询所有的学生信息,以及对应的学生信息
    List<Student> getStudent();
}
```

编写对应的StudentMapper.xml文件

```xml
<?xml version="1.0" encoding="UTF-8" ?>
<!DOCTYPE mapper
        PUBLIC "-//mybatis.org//DTD Config 3.0//EN"
        "http://mybatis.org/dtd/mybatis-3-mapper.dtd">
<mapper namespace="com.liu6.dao.StudentMapper">
   <!--
   需求：获取所有学生及对应老师的信息
   思路：
       1. 获取所有学生的信息
       2. 根据获取的学生信息的老师ID->获取该老师的信息
       3. 思考问题——这样学生的结果集中应该包含老师，该如何处理呢，数据库中我们一般使用关联查询？
           <1>. 做一个结果集映射：StudentTeacher
           <2>. StudentTeacher结果集的类型为 Student
           <3>. 学生中老师的属性为teacher，对应数据库中为tid。
              多个 [1,...）学生关联一个老师=> 一对一，一对多
           <4>. 查看官网找到：association – 一个复杂类型的关联；使用它来处理关联查询
   -->
   <select id="getStudents" resultMap="StudentTeacher">
    select * from student
   </select>
   <resultMap id="StudentTeacher" type="Student">
       <!--association关联属性 property属性名 javaType属性类型 column表中的列名-->
       <association property="teacher" column="tid" javaType="Teacher" select="getTeacher"/>
   </resultMap>
   <!--
   这里传递过来的id，只有一个属性的时候，下面可以写任何值
   association中column多参数配置：
       column="{key=value,key=value}"
       其实就是键值对的形式，key是传给下个sql的取值名称，value是片段一中sql查询的字段名。
   -->
   <select id="getTeacher" resultType="teacher">
      select * from teacher where id = #{id}
   </select>

</mapper>
```

在Mybatis核心配置中注册我们的mapper映射，然后编写Mytest测试代码测试：

```java
@Test
public void TestStudent(){
    SqlSession sqlSession = MybatisUtils.getSession();

    StudentMapper mapper = sqlSession.getMapper(StudentMapper.class);
    List<Student> studentList = mapper.getStudents2();
    for (Student student : studentList){
        System.out.println(
            "学生名:"+ student.getName()
            +"\t老师:"+student.getTeacher().getName());
    }

    sqlSession.close();
}
```

![](http://img2.salute61.top/Mybatis%E4%B8%80%E5%AF%B9%E5%A4%9A01.png)





### 2、按结果嵌套查询

除了将查询语句嵌套，也可以按结果进行嵌套。

在接口中增加方法，并编写对应的mapper映射

```java
List<Student> getStudents2();
```

```xml
<!--
按查询结果嵌套处理
思路：
   1. 直接查询出结果，进行结果集的映射
-->
<select id="getStudents2" resultMap="StudentTeacher2" >
  select s.id sid, s.name sname , t.name tname
  from student s,teacher t
  where s.tid = t.id
</select>

<resultMap id="StudentTeacher2" type="Student">
   <id property="id" column="sid"/>
   <result property="name" column="sname"/>
   <!--关联对象property 关联对象在Student实体类中的属性-->
   <association property="teacher" javaType="Teacher">
       <result property="name" column="tname"/>
   </association>
</resultMap>
```

编写测试代码并测试（就是将上面的代码，由getStudent改为getStudent2即可），结果一样

- 按照查询进行嵌套处理就像SQL中的子查询
- 按照结果进行嵌套处理就像SQL中的联表查询



## 一对多情况

从学生的角度去看问题，就是多对一，那么从老师的角度去看，就刚好反过来，成了一对多。

```java
@Data
public class Student {
   private int id;
   private String name;
   private int tid;
}
```

```java
@Data
public class Teacher {
   private int id;
   private String name;
   //一个老师多个学生
   private List<Student> students;
}
```

在teacher接口中增加方法

```java
//获取指定老师，及老师下的所有学生
public Teacher getTeacher(int id);
```

编写对应的mapper文件，同样会有两种方式去实现

```xml
<mapper namespace="com.kuang.mapper.TeacherMapper">
   <!--按结果嵌套处理-->
   <!--
   思路:
       1. 从学生表和老师表中查出学生id，学生姓名，老师姓名
       2. 对查询出来的操作做结果集映射
           1. 集合的话，使用collection！
               JavaType和ofType都是用来指定对象类型的
               JavaType是用来指定pojo中属性的类型
               ofType指定的是映射到list集合属性中pojo的类型。
   -->
   <select id="getTeacher" resultMap="TeacherStudent">
      select s.id sid, s.name sname , t.name tname, t.id tid
      from student s,teacher t
      where s.tid = t.id and t.id=#{id}
   </select>
   <resultMap id="TeacherStudent" type="Teacher">
       <result  property="name" column="tname"/>
       <collection property="students" ofType="Student">
           <result property="id" column="sid" />
           <result property="name" column="sname" />
           <result property="tid" column="tid" />
       </collection>
   </resultMap>
    
    
    <!--按查询嵌套处理-->
    <select id="getTeacher2" resultMap="TeacherStudent2">
    select * from teacher where id = #{id}
    </select>
    <resultMap id="TeacherStudent2" type="Teacher">
       <!--column是一对多的外键 , 写的是一的主键的列名-->
       <collection property="students" javaType="ArrayList" ofType="Student" column="id" select="getStudentByTeacherId"/>
    </resultMap>
    <select id="getStudentByTeacherId" resultType="Student">
      select * from student where tid = #{id}
    </select>
</mapper>

```



**小结**

在一对多和多对一中，主要用到了标签`association`和`collection`，association是用于一对一和多对一，而collection是用于一对多的关系

JavaType和ofType都是用来指定对象类型的

- JavaType是用来指定pojo中属性的类型
- ofType指定的是映射到list集合属性中pojo的类型。

一对多和多对一是实际开发中很重要的部分，也是比较难的一块，光看视频和课堂的代码，还是不足以透彻理解啊，还是要多练习啊。。。