---
title: Redis学习二：基本数据类型及操作
date: 2021-12-06 09:37:34
tags: Redis
categories: Redis
---

## Redis简介

### Redis是什么

Redis：Remote Dictionary Server（远程字典服务器）是一个开源免费的，用ANSI C语言编写的，遵守BSD协议的高性能（Key-Value）分布式内存数据库，基于内存运行，并支持持久化的NoSQL。

<!--more-->

### Redis能干嘛

redis是一种支持key-value等多种数据结构的存储系统，有点类似于Java的`Map<key,Object>`结构。可用于缓存，事件发布或订阅，高速队列等场景。

1. 缓存：Redis最主要的用法，能有效提升系统性能
2. 排行榜：传统关系型数据库做排行很麻烦，Redis的ZSet很方便
3. 计算器/限速器：利用Redis中原子性的自增操作，同级用户的点赞、访问等数据，这类频繁读写的操作采用MySQL会对数据库带来很大的压力；限速器使用的典型场景为限制用户访问某个API的频率，比如出现抢购时，用户点击过多会限制访问，这样可以降低系统压力（限速器也是一种请求限流的实现方式）
4. 好友关系：利用Redis的集合特点，通过求交集、并集、差集等获取共同爱好、共同好友等
5. 简单消息队列：除了Redis自身的发布/订阅模式，我们也可以利用List来实现一个队列机制，比如：到货通知、邮件发送之类的需求，不需要高可靠，但是会带来非常大的DB压力，完全可以用List来完成异步解耦
6. Session共享：默认Session是保存在服务器的文件中，即当前服务器，如果是集群服务，同一个用户过来可能落在不同机器上，这就会导致用户频繁登陆；采用Redis保存Session后，无论用户落在那台机器上都能够获取到对应的Session信息



## 安装测试Redis

### 安装Redis

网课给的安装包执行解压报错，因此自行安装。

1. 使用`wget http://download.redis.io/releases/redis-6.2.1.tar.gz`获取对应压缩包。

2. 使用`tar -zxvf redis-6.2.1.tar.gz`解压，得到`redis-6.2.1`文件夹。

   ![image-20211129221432662](http://img2.salute61.top/image-20211129221432662.png)

3. 使用`cd redis-6.2.1`进入安装目录，执行`make`指令编译。

   - 初次安装的虚拟机执行make会报错。是因为缺少GCC

     <img src="http://img2.salute61.top/image-20211129221717318.png" alt="image-20211129221717318" style="zoom:67%;" />

   - 使用`yum install gcc-c++`指令安装GCC。报错：Jemalloc/jemalloc.h：没有这个文件或目录

     <img src="http://img2.salute61.top/image-20211129221924535.png" alt="image-20211129221924535" style="zoom:67%;" />

   - 使用`make distclean`后再次make即可。

4. 执行make后执行`make install`安装。

5. 默认安装在`usr/local/bin`目录下

   <img src="http://img2.salute61.top/image-20211129222334084.png" alt="image-20211129222334084" style="zoom: 80%;" />

6. 启动测试一下

   ![image-20211129222550428](http://img2.salute61.top/image-20211129222550428.png)

**说明**

以上说明redis安装成功，不过还有一些需要修改的地方：比如刚才在`etc/opt/redis-6.2.1`目录下有个Redis.conf文件，这是Redis的配置文件，redis启动时默认按照此文件加载，后面的学习需要对此文件修改，所以可以先备份一下；现在启动Redis是前台启动的形式，启动后窗口不能执行其他操作，可以改为后台进行。

1. 在opt目录下`makedir myconf`创建myconf目录，将redis.conf复制到目录中。
2. 修改myconf里面的配置文件，将daemonize no 改成 yes，让服务在后台启动。

再次执行`redis-server /etc/opt/myconf/redis.conf`。此时服务可以启动，执行`redis-cli`启动客户端，执行ping验证连通性，得到pong即为redis启动成功。

![image-20211129223723969](http://img2.salute61.top/image-20211129223723969.png)



### Redis启动杂项

1. Redis默认端口是6379，可以通过配置文件修改端口。

2. Redis默认数据库有16个

   ![image-20211129224146572](http://img2.salute61.top/image-20211129224146572.png)

3. select命令切换数据库，默认使用0号库

   ![image-20211129232543897](http://img2.salute61.top/image-20211129232543897.png)

4. dbsize查看数据库的key数量

   ![image-20211129232703531](http://img2.salute61.top/image-20211129232703531.png)

5. flushdb清空当前库、flushall清空所有库

6. 统一密码管理：16个库都是用同样的密码

7. <font color="red">**redis高效原因：单线程＋多路复用技术**</font>

#### Redis单线程

Redis客户端对服务端的每次调用都经历了发送命令，执行命令，返回结果三个过程。其中执行命令阶段，由于Redis是单线程来处理命令的，所有每一条到达服务端的命令不会立刻执行，所有的命令都会进入一个队列中，然后逐个被执行。并且多个客户端发送的命令的执行顺序是不确定的。但是可以确定的是不会有两条命令被同时执行，不会产生并发问题，这就是Redis的单线程基本模型。

**1.Redis不是完全单线程的**

Redis单线程是处理网络请求使用单个线程来处理：即一个线程处理所有网络请求，其他模块仍使用多线程。

以Redis持久化为例，RDB方式持久化即为fork一个子线程将数据写入临时文件中。

**2.Redis使用多路复用技术**

Redis对读写时间的响应是通过封装epoll[^epoll]函数来实现的。Redis的实际处理速度完全依靠主进程的执行效率。

[^epoll]: Epoll是Linux内核为处理大批量文件描述符而作了改进的epoll，是Linux下多路复用IO接口select/poll的增强版本，它能显著提高程序在大量并发连接中只有少量活跃的情况下的系统CPU利用率。

![](https://md-blog61.oss-cn-beijing.aliyuncs.com/%E5%A4%9A%E8%B7%AF%E5%A4%8D%E7%94%A8.gif)





## Redis数据结构

Redis的五大基本数据结构：

- 字符串String：字符串是Redis最基本的类型，采用key-value形式。一个redis中字符串value最大为512M；
- 哈希Hash：hash是一个键值对集合，是一个string类型的field和value的映射表；
- 列表List：list是一个字符串列表，按照插入顺序排序。他的底层实现是链表；
- 集合Set：set是一个string类型的无序集合，通过HashTable实现；
- 有序集合Zset(Sorted set)：zset和set都是string类型的集合，不过zset中每个元素都会关联一个double类型的分数，redis通过这个分数危机和中的元素进行排序（zset的数据是唯一的，不过分数可以重复）

有关Redis的常见数据类型操作指令，可以在[Redis命令参考](Http://redisdoc.com/Http://redisdoc.com/)中查看。



### Redis Key

#### 1.结构

对Redis来说，所有的Key都是字符串

![redis-key](http://img2.salute61.top/redis-key.png)

#### 2.常用指令

| 命令   | 描述                    | 使用          |
| ------ | ----------------------- | ------------- |
| keys   | 查看当前库的所有key     | keys *        |
| exist  | 判断某个key是否存在     | exist key     |
| type   | 查看key的类型           | type key      |
| del    | 删除指定key的数据       | del key       |
| unlink | 根据value选择非阻塞删除 | unlink key    |
| expire | 未指定key设置过期时间   | expire key 10 |
| ttl    | 查看还有多久过期        | ttl key       |

执行结果如下：

![image-20211202231612405](http://img2.salute61.top/image-20211202231612405.png)

```shell
#unlink是非阻塞删除，即仅仅将数据从keyspace元数据中删除，真正的删除会在后续异步操作
#ttl key查看过期时间，-1表示永不过期，-2表示已过期
```

注：几个查看redis库的指令：

```shell
SELECT 		#切换数据库
DBSIZE 		#查看当前数据库key的数量
FLUSHDB 	#清空当前数据库
FLUSHALL 	#清空所有数据库
```

![image-20211202232040962](http://img2.salute61.top/image-20211202232040962.png)



### Redis String

#### 1.数据结构

String的数据结构为简单动态字符串（Simple Dynamic String，简写SDS）。是可修改的字符串，内部结构是线上类似于Java的ArrayList，采用预分配荣誉空间的方式来减少内少的频繁分配。

![image-20211204234129389](http://img2.salute61.top/image-20211204234129389.png)

如图所示，内部为当前字符串实际分配的空间capacity，一般要高于实际字符串长度len。

当字符串长度小于1M，扩容方式是现有空间加倍；超过1M时，每次扩容只会增加1M空间。并且字符串的最大长度为512M

Redis的String类型是二进制安全的，意思是 redis 的 string 可以包含任何数据。如数字，字符串，jpg图片或者序列化的对象。

#### 2.常用指令

| 命令   | 描述                       | 使用              |
| ------ | -------------------------- | ----------------- |
| SET    | 设置指定key的value         | set key1 value1   |
| GET    | 获取指定key的value         | get key1          |
| DEL    | 删除指定的key-value        | del key1          |
| INCR   | 将对应key的value加1        | incr key1         |
| DECR   | 将对应key的value减1        | decr key1         |
| INCRBY | 将对应key的value加指定整数 | incrby key1 count |
| DECRBY | 将对应key的value减指定整数 | decrby key1 count |

对string操作的指令执行结果如下（set、get、del上面已经演示）：

```shell
append key value    	 #在指定key的值后面追加value1，这里的追加是字符串拼接
strlen key			 	 #获取指定key的长度
setnx  key value	 	 #(set if not exist)只有在key不存在时才创建
setex  key time value	 #(set with expire)设置带过期时间的key-value
mset   K1 V1 K2 V2 ... Kn Vn	#同时设置一个或多个key-value键值对
mget   K1 K2 .. Kn	 	 #同时获取一个或多个给定key的值
msetnx K1 V1 K2 V2 ... Kn Vn	#同时设置一个或多个key-value。当且仅当所有给定key都不存在时
getset key value		 #先将给定key值设置为value，返回key的旧值(old value)。即先get再set

incr、decr、incrby、decrby    
#操作对象只能是数字。如果为空，新增值为1，减少值为-1；后两者自定义
#对数值的增减操作是原子性的
```

![image-20211202232516451](http://img2.salute61.top/image-20211202232516451.png)

#### 3.使用场景

1. 缓存：最经典最常用的场景。将一些常用的信息放在redis中，redis作为缓存层，MySQL作为持久层，达到降低MySQL的读写压力。
2. 计数器：Redis的单线程模型保证了他一次只会执行一个命令的特点
3. session：采用Spring Session+Redis实现Session共享，一次登录多次使用。



### Redis List

#### 1.数据结构

List就是链表，Redis的List采用双端链表来实现，value可重复，类似于Java中的LinkedList。所以它的特性和链表相似：对两端的插入删除操作性能很好，但是通过索引定位查找的性能较差。

![Redis-List](http://img2.salute61.top/Redis-List.png)

首先在列表元素较少的情况下会使用一块连续的内存存储，这个结构是ziplist，也即是压缩列表。它将所有的元素紧挨着一起存储，分配的是一块连续的内存。

当数据量比较多的时候才会改成quicklist。因为普通的链表需要的附加指针空间太大，会比较浪费空间。比如一个列表里存储的是基本的int或string类型数据，结构上还需要两个额外的指针prev和next。

#### 2.常用命令

list的使用命令如下：

```shell
lpush/rpush  <key><value1><value2><value3> .... # 从左边/右边插入一个或多个值。
lpop/rpop  	 <key>			# 从左边/右边吐出一个值。值在键在，值光键亡。
rpoplpush  	 <key1><key2>	# 从<key1>列表右边吐出一个值，插到<key2>列表左边。
lrange <key><start><stop>	# 按照索引下标获得元素(从左到右)
lrange list 0 -1   			# 0左边第一个，-1右边第一个，（0-1表示获取所有）
lindex <key><index>			# 按照索引下标获得元素(从左到右)
llen   <key>				# 获得列表长度 
linsert <key>  before <value><newvalue>		# 在<value>的后面插入<newvalue>插入值
lrem <key><n><value>		# 从左边删除n个value(从左到右)
lset<key><index><value>		# 将列表key下标为index的值替换成value

```

使用基础的LPUSH、RPUSH效果如图：

<img src="http://img2.salute61.top/image-20211205211524791.png" alt="image-20211205211524791" style="zoom:67%;" />

可以利用list的链表本质实现一些基本数据结构。

1. list实现队列：**LPUSH+RPOP**或**RPUSH+LPOP**；利用队列先进先出的特点，实现消息队列或异步处理等操作。

<img src="http://img2.salute61.top/image-20211205211524791.png" style="zoom:67%;" />

2.list实现栈：**LPUSH+LPOP**或**RPUSH+RPOP**；实现了栈先进后出的特点。

<img src="http://img2.salute61.top/image-20211205212523432.png" alt="image-20211205212523432" style="zoom: 80%;" />

#### 3.使用场景

list常见的场景有消息队列、时间轴、点赞评论的列表等



### Redis Hash

Redis的Hash字典是一个kv键值对集合，同时v也是一个string类型的`field-value`映射表。

<img src="http://img2.salute61.top/Redis-Hash.png" alt="Redis-Hash" style="zoom:80%;" />

#### 1.数据结构

Redis Hash类似于Java中的HashMap<String,Object>，内部实现上都是**“数组+链表”**的链地址法解决哈希冲突。

hash类型对应的数据结构是两种：ziplist(压缩链表)、hashtable(哈希表)；当`field-value`长度较短且个数较少时使用ziplist，否则使用hashtable

#### 2.常用命令

hash的常用指令如下：

```shell
hset <key><field><value>			# 给<key>集合中的<field>键赋值<value>
hget <key1><field>					# 通过<key1>集合的<field>取出对应value 
hmset <key1><field1><value1><field2><value2>... 	# 批量设置hash的值
hexists<key1><field>				# 查看哈希表key中，给定field是否存在。 
hkeys <key>							# 列出该hash集合的所有field
hvals <key>							# 列出该hash集合的所有value
hincrby <key><field><increment>		# 为哈希表 key 中的 field 的值加上增量 1、-1
hsetnx <key><field><value>			# 将哈希表 key 中的 field 的值设置为 value，当且仅当域 field 不存在 .

```

使用效果如图：

<img src="http://img2.salute61.top/image-20211205215743109.png" alt="image-20211205215743109" style="zoom: 50%;" />

#### 3.使用场景

更丰富的缓存：相比string存储字符串，hash可以存储object，可以用来存储用户信息、订单信息等



### Redis Set

Set和List都是单key多value，不过set里面的value不允许重复；集合中的元素是无序的，不能通过下表获取元素；set可以利用集合特性实现相关操作，如取交集、并集等。Redis Set提供了判断某个成员是否在一个set集合内的重要接口，这个也是list所不能提供的。

![Redis-set](http://img2.salute61.top/Redis-set.png)

#### 1.数据结构

Redis的Set是string类型的无序集合(dict字典)。它底层其实是一个value为null的hash表，所以添加，删除，查找的**复杂度都是O(1)**。

Java中HashSet的内部实现使用的是HashMap，只不过所有的value都指向同一个对象。Redis的set结构也是一样，它的内部也使用hash结构，所有的value都指向同一个内部值。

#### 2.常用命令

Set的常用命令如下：

```shell
sadd <key><value1><value2> ..... 
# 将一个或多个 member 元素加入到集合 key 中，已经存在的 member 元素将被忽略
smembers <key>					# 取出该集合的所有值。
sismember <key><value>			# 判断集合<key>是否为含有该<value>值，有1，没有0
scard<key>						# 返回该集合的元素个数。
srem <key><value1><value2> .... # 删除集合中的某个元素。
spop <key>						# 随机从该集合中吐出一个值。
srandmember <key><n>			# 随机从该集合中取出n个值。不会从集合中删除 。
smove <source><destination>value# 把集合中一个值从一个集合移动到另一个集合
sinter <key1><key2>				# 返回两个集合的交集元素。
sunion <key1><key2>				# 返回两个集合的并集元素。
sdiff <key1><key2>				# 返回两个集合的差集元素(key1中的，不包含key2中的)

```

使用效果如图：

<img src="http://img2.salute61.top/image-20211205221127567.png" alt="image-20211205221127567" style="zoom: 60%;" />

#### 3.使用场景

1. 标签（tag）：给用户添加标签，或者用户给消息添加标签，这样有同一标签或者类似标签的可以给推荐关注的事或者关注的人。
2. 点赞，或点踩，收藏等，可以放到set中实现。



### Redis Zset

Zset在Set的基础上，为每个成员增加了一个评分score，通过按score由低到高给集合中的元素排序。集合中成员是唯一的，而score是可以重复的。

由于元素有序，所以可以根据评分score和次序position来快速获取一个区间的元素。

![Redis-Zset](http://img2.salute61.top/Redis-Zset.png)

#### 1.数据结构

SortedSet(zset)是Redis提供的一个非常特别的数据结构，一方面它等价于Java的数据结构Map<String, Double>，可以给每一个元素value赋予一个权重score，另一方面它又类似于TreeSet，内部的元素会按照权重score进行排序，可以得到每个元素的名次，还可以通过score的范围来获取元素的列表。

zset底层使用了两个数据结构：

1. hash，hash的作用就是关联元素value和权重score，保障元素value的唯一性，可以通过元素value找到相应的score值。
2. 跳跃表，跳跃表的目的在于给元素value排序，根据score的范围获取元素列表。

#### 2.常用命令

Zset常用命令如下：

```shell
zadd  <key><score1><value1><score2><value2>…
# 将一个或多个 member 元素及其 score 值加入到有序集 key 当中。
zrange <key><start><stop>  [WITHSCORES]   
# 返回有序集 key 中，下标在<start><stop>之间的元素   带WITHSCORES，可以让分数一起和值返回到结果集。
zrangebyscore key min max [withscores] [limit offset count]
# 返回有序集 key 中，所有 score 值介于[min,max]的成员。有序集成员按 score 值递增(从小到大)次序排列。 
zrevrangebyscore key maxmin [withscores] [limit offset count]               
# 同上，改为从大到小排列。 
zincrby <key><increment><value>     # 为元素的score加上增量
zrem  <key><value>					# 删除该集合下，指定值的元素 
zcount <key><min><max>				# 统计该集合，分数区间内的元素个数 
zrank <key><value>					# 返回该值在集合中的排名，从0开始。

```

使用效果如图：

![image-20211205225104267](http://img2.salute61.top/image-20211205225104267.png)

#### 3.使用场景

比较常用的就是排行榜。比如文章阅读量热榜、商品销量热榜等实现。























