---
title: Mybatis学习三-注解开发
date: 2020-10-03 17:47:44
tags: Mybatis
categories: Mybatis
---

## 依赖倒转原则(DIP)

在面向对象分析与设计中，有一个很重要的原则——依赖倒转原则，定义如下

> 高层模块不应该依赖低层模块，它们都应该依赖抽象；抽象不应该依赖于细节；细节应该依赖于抽象。
>
> 另一种表述：**要针对接口编程，不要针对实现编程。**

DIP是6大原则中最难以实现的原则，它是实现开闭原则的重要途径。关键仍然是"抽象"，抽象属于高层，细节属于低层，低层依赖于高层，而不是高层依赖于低层，这正是依赖倒置的真谛。

依赖倒转的好处

- 可以通过抽象使各个类或模块的实现彼此独立，不互相影响，**实现模块间的松耦合（也是本质）**；
- 可以规避一些非技术因素引起的问题（例如需求变化导致的工作量剧增的情况）
- 可以促进并行开发

<!--more-->

【注】：依赖的三种写法

```java
//1、构造函数传递依赖对象
public interface IDriver{
	//是司机就应该会驾驶汽车
	public void drive();
}
public class Driver implements IDriver{
	private ICar car;
	//构造函数注入
	public Driver(ICar _car){
		this.car = _car;
	}	
	//司机的主要职责就是驾驶汽车
	public void drive(){
		this.car.run();
	}
}
//2--Setter方法传递依赖对象 

public interface IDriver {
	//车辆型号
	public void setCar(ICar car);
	//是司机就应该会驾驶汽车
	public void drive();
}

public class Driver implements IDriver{
	private ICar car;
	public void setCar(ICar car){
		this.car = car;
	}
	//司机的主要职责就是驾驶汽车
	public void drive(){
		this.car.run();
	}
}
```





## 注解开发

**mybatis最初配置信息是基于 XML ,映射语句(SQL)也是定义在 XML 中的。而到MyBatis 3提供了新的基于注解的配置。不幸的是，Java 注解的的表达力和灵活性十分有限。最强大的 MyBatis 映射并不能用注解来构建**

常见的sql语句的对应注解：

- @select ()
- @update ()
- @Insert ()
- @delete ()

**【注】：**利用注解开发就不需要mapper.xml映射文件了。

为接口添加注释

```java
/**
 * @Author: Salute61
 * @Date: 2020/9/18 15:45
 * @Description: some description
 */
public interface UserMapper {
    @Select("select * from user")
    List<User> getUsers();

    //方法存在多个参数时 所有参数前面必须加上@Param注解
    @Select("select * from user where id = #{id}")
    User getUserByID(@Param("id")int id2);
}
```

在mybatis的核心配置文件中注入

```xml
<!--绑定接口-->
<mappers>
    <mapper class="liu5.dao.UserMapper"/>
</mappers>
```

进行测试

```java
import liu5.dao.UserMapper;
import liu5.pojo.User;
import liu5.utils.MybatisUtils;
import org.apache.ibatis.session.SqlSession;
import org.junit.Test;

import java.util.List;

/**
 * @Author: Salute61
 * @Date: 2020/9/21 15:31
 * @Description: some description
 */
public class UserMapperTest {
    @Test
    public void test(){
        SqlSession sqlSession = MybatisUtils.getSession();
        //Deubg可以看到：底层是通过反射实现的
        UserMapper mapper = sqlSession.getMapper(UserMapper.class);

        List<User> userList = mapper.getUsers();
        for(User user:userList){
            System.out.println(user);
        }

        User userByID = mapper.getUserByID(1);
        System.out.println(userByID);

        sqlSession.close();
    }
}
```

和之前的测试结果一样：

<img src="http://img2.salute61.top/Mybatis%E6%B3%A8%E8%A7%A3%E5%BC%80%E5%8F%9101.png" style="zoom:50%;" />

> 另外三个接口注释和这个类似

利用Debug查看

![](http://img2.salute61.top/Mybatis%E6%B3%A8%E8%A7%A3%E5%BC%80%E5%8F%9102.png)



### Mybatis的执行流程

由上及之前的学习可知，Mybatis的执行流程如图（图片来自狂神公众号文章）：

![](http://img2.salute61.top/Mybatis%E6%B3%A8%E8%A7%A3%E5%BC%80%E5%8F%9103.png)

将注解与配置文件协同编程最能有助于我们的开发！