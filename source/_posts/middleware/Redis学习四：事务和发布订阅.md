---
title: Redis学习四：事务和发布订阅
tags:
  - NoSQL
  - Redis
categories: 数据库
abbrlink: 122afe43
date: 2022-05-28 10:28:24
---

## Redis事务

### 事务的概念

Redis事务定义：将多个命令打包， 然后一次性、按顺序地执行，并且事务在执行的期间不会主动中断 —— 服务器在执行完事务中的所有命令之后， 才会继续处理其他客户端的其他命令。

Redis通过`MULTI`、`EXEC`、`DISCARD`、`WATCH`指令来实现事务功能。事务的主要作用就是串联多个指令，可以将Redis的事务视作一个队列，通过`MULTI`指令开始一个事务，之后我们键入的每个命令都被添加到这个队列中，当输入`EXEC`指令就开始按照先进先出顺序执行队列中的命令。

一个事务从开始到执行经历三个阶段：

- 开始事务
- 命令入队
- 执行事务

事务相关指令含义如下：

| 命令    | 描述                                                         |
| ------- | ------------------------------------------------------------ |
| MULTI   | 标记一个事务的开始                                           |
| EXEC    | 执行一个事务队列中的所有命令                                 |
| DISCARD | 取消事务，放弃执行事务队列中的命令                           |
| WATCH   | 监视一个或多个key，如果在事务执行前这个key被其他命令改动，则事务被中断 |
| UNWATCH | 取消监视一个或多个key                                        |

<!--more-->

### 事务的执行

#### 1、正常执行

通过`MULTI`指令开启事务，添加命令到队列中，通过`EXEC`执行：

<img src="https://jihulab.com/Leslie61/imagelake/-/raw/main/pictures/2023/04/image-20220322162204162.png" alt="image-20220322162204162" style="zoom:80%;" />

#### 2、放弃事务

通过`MULTI`指令开启事务，添加命令到队列中，通过`DISCARD`取消：

<img src="https://jihulab.com/Leslie61/imagelake/-/raw/main/pictures/2023/04/image-20220323000524729.png" alt="image-20220323000524729" style="zoom:80%;" />

#### 3、全体连坐

如果事务队列中的命令存在语法错误（例如参数数量、名称等不对），或者其他更严重的错误，比如内存不足（使用 `maxmemory` 设置了最大内存限制），此时整个队列都会被取消：

<img src="https://jihulab.com/Leslie61/imagelake/-/raw/main/pictures/2023/04/image-20220323001510293.png" alt="image-20220323001510293" style="zoom:80%;" />

通过对入队命令的返回值做检查，如果是`QUEUED`标识正常入队，否则就是入队失败，2.6.5之后如果有入队失败的情况则`EXEC`时拒绝执行此事务。

#### 4、冤头债主

如果命令不是语法上的错误，而是执行阶段的错误（例如对string类型执行`INCR`等），则只有报错的命令不会被执行，而其他的正确命令都会执行，整体事务不会回滚：

<img src="https://jihulab.com/Leslie61/imagelake/-/raw/main/pictures/2023/04/image-20220323001337310.png" alt="image-20220323001337310" style="zoom:80%;" />



### WATCH监控

#### 1、悲观锁

顾名思义，就是很悲观，每次去拿数据的时候都认为别人会修改，所以每次在拿数据的时候都会上锁，这样别人想拿这个数据就会block直到它拿到锁。**传统的关系型数据库里边就用到了很多这种锁机制**，比如**行锁**，**表锁**等，**读锁**，**写锁**等，都是在做操作之前先上锁。

#### 2、乐观锁


顾名思义，就是很乐观，每次去拿数据的时候都认为别人不会修改，所以不会上锁，但是在更新的时候会判断一下在此期间别人有没有去更新这个数据，可以使用版本号等机制。**乐观锁适用于多读的应用类型**，这样可以提高吞吐量，Redis就是利用这种check-and-set机制实现事务的。【乐观锁策略:提交版本必须大于记录当前版本才能执行更新】

#### 带WATCH的事务

`WATCH` 指令用于在事务开始之前监视任意数量的键： 当调用 EXEC 命令执行事务时， 如果任意一个被监视的键已经被其他客户端修改了， 那么整个事务将被打断，不再执行， 直接返回失败。

并且`WATCH` 指令可以调用多次，从执行`WATCH` 开始生效直到`EXEC`，**当 `EXEC` 被调用时， 不管事务是否成功执行， 对所有键的监视都会被取消**。另外， 当客户端断开连接时， 该客户端对键的监视也会被取消。

设置工资开销`salary`、`spending`的初始值为10000和0，如果自己一个人正常用，洗个脚1600：

<img src="https://jihulab.com/Leslie61/imagelake/-/raw/main/pictures/2023/04/image-20220323003943605.png" alt="image-20220323003943605" style="zoom:80%;" />

假设工资是和女朋友一起用，第二次去洗脚时女朋友直接刷了个8400的包，这时结账就会出问题了：

<img src="https://jihulab.com/Leslie61/imagelake/-/raw/main/pictures/2023/04/image-20220323004419871.png" alt="image-20220323004419871" style="zoom:80%;" />

如果不加`WATCH`就会出大问题了，银行卡变成`-1600`：

<img src="https://jihulab.com/Leslie61/imagelake/-/raw/main/pictures/2023/04/image-20220323004836824.png" alt="image-20220323004836824" style="zoom:80%;" />

**watch指令，类似乐观锁**，事务提交时，如果 key 的值已被别的客户端改变，比如某个 list 已被别的客户端push/pop 过了，整个事务队列都不会被执行，同时返回Nullmulti-bulk应答以通知调用者事务执行失败

【注】当然也可以用 Redis 实现分布式锁来保证安全性，属于悲观锁



### 事务的特性

- 单独的隔离操作：事务中的所有命令都会序列化、按顺序地执行。事务在执行的过程中，不会被其他客户端发送来的命令请求所打断；

- 没有隔离级别的概念：队列中的命令没有提交之前都不会实际的被执行，因为事务提交前任何指令都不会被实际执行，也就不存在”事务内的查询要看到事务里的更新，在事务外查询不能看到”这个让人万分头痛的问题；

- 不保证原子性：redis同一个事务中如果有一条命令执行失败，其后的命令仍然会被执行，没有回滚；

  >官方的解释：
  >
  >Redis 命令只会因为错误的语法而失败（并且这些问题不能在入队时发现），或是命令用在了错误类型的键上面：这也就是说，从实用性的角度来说，失败的命令是由编程错误造成的，而这些错误应该在开发的过程中被发现，而不应该出现在生产环境中。
  >
  >因为不需要对回滚进行支持，所以 Redis 的内部可以保持简单且快速。



### 事务的原理

#### 1、开始事务

`MULTI`命令唯一做的就是， 将客户端的 `REDIS_MULTI` 选项打开， 让客户端从非事务状态切换到事务状态。

<img src="https://jihulab.com/Leslie61/imagelake/-/raw/main/pictures/2023/04/image-20220324103546438.png" alt="image-20220324103546438" style="zoom:80%;" />

#### 2、命令入队

对于非执行指令（除EXEC、DISCARD、MULTI、WATCH）直接入队，返回结果QUEUED，如果指令有语法错误则返回错误信息

<img src="https://jihulab.com/Leslie61/imagelake/-/raw/main/pictures/2023/04/image-20220324104045964.png" alt="image-20220324104045964" style="zoom:80%;" />

#### 2*、事务队列

- 每个 Redis 客户端都有自己的事务状态， 这个事务状态保存在客户端状态的 `mstate` 属性里面：

  ```c
  typedef struct redisClient {
      // ...
      // 事务状态
      multiState mstate;      /* MULTI/EXEC state */
      // ...
  } redisClient;
  ```

- 事务状态包含一个事务队列， 以及一个已入队命令的计数器 （也可以说是事务队列的长度）：

  ```c
  typedef struct multiState {
      // 事务队列，FIFO 顺序
      multiCmd *commands;
      // 已入队命令计数
      int count;
  } multiState;
  ```

- 事务队列是一个 `multiCmd` 类型的数组， 数组中的每个 `multiCmd` 结构都保存了一个已入队命令的相关信息， 包括指向命令实现函数的指针， 命令的参数， 以及参数的数量：

  ```c
  typedef struct multiCmd {
      // 参数
      robj **argv;
      // 参数数量
      int argc;
      // 命令指针
      struct redisCommand *cmd;
  } multiCmd;
  ```

- 事务队列以先进先出（FIFO）的方式保存入队的命令： 较先入队的命令会被放到数组的前面， 而较后入队的命令则会被放到数组的后面。

由上可知事务队列是一个数组， 每个数组项是都包含三个属性：

1. 要执行的命令（cmd）
2. 命令的参数（argv）
3. 参数的个数（argc）

执行如下指令时：

```Redis
redis> MULTI
OK

redis> SET book-name "Mastering C++ in 21 days"
QUEUED

redis> GET book-name
QUEUED

redis> SADD tag "C++" "Programming" "Mastering Series"
QUEUED

redis> SMEMBERS tag
QUEUED
```

得到的指令队列：

| 数组索引 | cmd      | argv                                              | argc |
| -------- | -------- | ------------------------------------------------- | ---- |
| 0        | SET      | ["book-name", "Mastering C++ in 21 days"]         | 2    |
| 1        | GET      | ["book-name"]                                     | 1    |
| 2        | SADD     | ["tag", "C++", "Programming", "Mastering Series"] | 4    |
| 3        | SMEMBERS | ["tag"]                                           | 1    |



#### 3、执行事务

当遇到EXEC、DISCARD、MULTI、WATCH这四个指令时，事务就会被执行。服务器根据客户端所保存的事务队列， 以先进先出（FIFO）的方式执行事务队列中的命令： 最先入队的命令最先执行， 而最后入队的命令最后执行。

<img src="https://jihulab.com/Leslie61/imagelake/-/raw/main/pictures/2023/04/image-20220324103946709.png" alt="image-20220324103946709" style="zoom: 80%;" />

当事务队列里的所有命令被执行完之后，EXEC命令会将回复队列作为自己的执行结果返回给客户端， 客户端从事务状态返回到非事务状态， 至此， 事务执行完毕。伪代码如下：

```python
def execute_transaction():
    # 创建空白的回复队列
    reply_queue = []
    # 取出事务队列里的所有命令、参数和参数数量
    for cmd, argv, argc in client.transaction_queue:
        # 执行命令，并取得命令的返回值
        reply = execute_redis_command(cmd, argv, argc)
        # 将返回值追加到回复队列末尾
        reply_queue.append(reply)
    # 清除客户端的事务状态
    clear_transaction_state(client)
    # 清空事务队列
    clear_transaction_queue(client)
    # 将事务的执行结果返回给客户端
    send_reply_to_client(client, reply_queue)
```



#### WATCH实现

在每个代表数据库的 `redis.h/redisDb` 结构类型中， 都保存了一个 `watched_keys` 字典， 字典的键是这个数据库被监视的键， 而字典的值则是一个链表， 链表中保存了所有监视这个键的客户端。如图：

<img src="https://jihulab.com/Leslie61/imagelake/-/raw/main/pictures/2023/04/image-20220324143007715.png" alt="image-20220324143007715" style="zoom:80%;" />

其中， 键 `key1` 正在被 `client2` 、 `client5` 和 `client1` 三个客户端监视， 其他一些键也分别被其他别的客户端监视着。

WATCH命令的作用， 就是将当前客户端和要监视的键在 `watched_keys` 中进行关联。

举个例子， 如果当前客户端为 `client10086` ， 那么当客户端执行 `WATCH key1 key2` 时， 前面展示的 `watched_keys` 将被修改成这个样子：

<img src="https://jihulab.com/Leslie61/imagelake/-/raw/main/pictures/2023/04/image-20220324143132923.png" alt="image-20220324143132923" style="zoom:80%;" />

通过 `watched_keys` 字典， 如果程序想检查某个键是否被监视， 那么它只要检查字典中是否存在这个键即可； 如果程序要获取监视某个键的所有客户端， 那么只要取出键的值（一个链表）， 然后对链表进行遍历即可。



#### WATCH触发

在任何对数据库键空间（key space）进行修改的命令成功执行之后 （比如FLUSHDB、SET、DEL、LPUSH、SADD、ZREM等）， `multi.c/touchWatchedKey` 函数都会被调用——它检查数据库的 `watched_keys` 字典， 查找是否有被该命令修改的键，有的话 程序将所有监视这个/这些被修改键的客户端的 `REDIS_DIRTY_CAS` 选项打开：

<img src="https://jihulab.com/Leslie61/imagelake/-/raw/main/pictures/2023/04/image-20220324143653578.png" alt="image-20220324143653578" style="zoom:80%;" />

当客户端发送EXEC命令、触发事务执行时， 服务器会对客户端的状态进行检查：

- 如果客户端的 `REDIS_DIRTY_CAS` 选项已经被打开，那么说明被客户端监视的键至少有一个已经被修改了，事务的安全性已经被破坏。服务器会放弃执行这个事务，直接向客户端返回空回复，表示事务执行失败。
- 如果 `REDIS_DIRTY_CAS` 选项没有被打开，那么说明所有监视键都安全，服务器正式执行事务。

可以用一段伪代码来表示这个检查：

```python
def check_safety_before_execute_trasaction():
    if client.state & REDIS_DIRTY_CAS:
        # 安全性已破坏，清除事务状态
        clear_transaction_state(client)
        # 清空事务队列
        clear_transaction_queue(client)
        # 返回空回复给客户端
        send_empty_reply(client)
    else:
        # 安全性完好，执行事务
        execute_transaction()
```

举个例子，假设数据库的 `watched_keys` 字典如下图所示：

<img src="https://jihulab.com/Leslie61/imagelake/-/raw/main/pictures/2023/04/image-20230420225953389.png" alt="image-20230420225953389" style="zoom:80%;" />

如果某个客户端对 `key1` 进行了修改（比如执行 `DEL key1` ）， 那么所有监视 `key1` 的客户端， 包括 `client2` 、 `client5` 和 `client1` 的 `REDIS_DIRTY_CAS` 选项都会被打开， 当客户端 `client2` 、 `client5` 和 `client1` 执行EXEC的时候， 它们的事务都会以失败告终。

最后，当一个客户端结束它的事务时，无论事务是成功执行，还是失败， `watched_keys` 字典中和这个客户端相关的资料都会被清除。



## Redis发布与订阅

### 发布与订阅概念

Redis 发布订阅 (pub/sub) 是一种消息通信模式：发送者 (pub) 发送消息，订阅者 (sub) 接收消息。Redis 客户端可以订阅任意数量的频道。

如图是 channel1 和三个订阅了频道的Redis客户端：

<img src="https://jihulab.com/Leslie61/imagelake/-/raw/main/pictures/2023/04/image-20220324144453619.png" alt="image-20220324144453619" style="zoom: 80%;" />

当有消息message通过`PUBLISH`指令发送到 channel1 时，这个message会发送到订阅它的客户端：

<img src="https://jihulab.com/Leslie61/imagelake/-/raw/main/pictures/2023/04/image-20220324144910793.png" alt="image-20220324144910793" style="zoom:80%;" />

### 操作示例

1、打开一个客户端，订阅频道`channel1`：

<img src="https://jihulab.com/Leslie61/imagelake/-/raw/main/pictures/2023/04/image-20220324145443960.png" alt="image-20220324145443960" style="zoom:80%;" />

2、打开另一个客户端，通过`PUBLISH channel1 hello-redis0`发布消息，返回值1表示频道channel1有一个订阅者，可以看到订阅的客户端收到了`hello-redis0`消息：

<img src="https://jihulab.com/Leslie61/imagelake/-/raw/main/pictures/2023/04/image-20220324145758711.png" alt="image-20220324145758711" style="zoom:80%;" />

3、再打开一个客户端订阅channel1，发送消息`hello-redis1`，可以看到返回2，两个订阅的都收到消息，并且新订阅的是没有收到之前的消息`hello-redis0`的：

<img src="https://jihulab.com/Leslie61/imagelake/-/raw/main/pictures/2023/04/image-20220324150219041.png" alt="image-20220324150219041" style="zoom:80%;" />





## 参考

- [事务-Redis设计与实现](https://redisbook.readthedocs.io/en/latest/feature/transaction.html)
- Redis——B站尚硅谷周阳

