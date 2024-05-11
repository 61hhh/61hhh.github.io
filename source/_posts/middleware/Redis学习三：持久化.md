---
title: Redis学习三：持久化
tags:
  - NoSQL
  - Redis
categories: 数据库
abbrlink: a4f2d1e9
date: 2021-12-12 20:35:42
---

Redis的是一个内存数据库，所有数据都存放在内存中，这也是它读写效率高的原因所在。不过相比于MySQL等关系型数据库将持久化，内存保存数据容易在断电宕机等情况下丢失数据，因此Redis提供了数据持久化功能，通过备份内存数据到本地、将备份文件恢复等实现持久化机制。



在学习Redis持久化之前，可以先大概学习一下配置文件，了解Redis的配置参数等。

## 配置文件简述

配置文件地址：在Redis的安装目录下，对应的`redis.conf`文件（Windows 名为 `redis.windows.conf`）

**Units单位**：配置大小单位,开头定义了一些基本的度量单位，只支持bytes，不支持bit。大小写不敏感

<img src="https://leslie1-1309334886.cos.ap-shanghai.myqcloud.com/obsidian/image-20211206215540244.png" alt="image-20211206215540244" style="zoom: 80%;" />

**INCLUDES包含**：多实例的情况可以把公用的配置文件提取出来

<img src="https://leslie1-1309334886.cos.ap-shanghai.myqcloud.com/obsidian/image-20211206215658857.png" alt="image-20211206215658857" style="zoom: 80%;" />

相关配置如下表，更多详细配置可以在`redis.conf`文件中查看。

|                   配置项                   | 配置说明                                                     |
| :----------------------------------------: | :----------------------------------------------------------- |
|                **网络相关**                |                                                              |
|                `port 6379`                 | 指定redis监听端口，默认端口是6379                            |
|              `bind 127.0.0.1`              | 绑定的主机地址                                               |
|               `timeout 300`                | 当客户端闲置多长秒后关闭连接，如果指定为 0 ，表示关闭该功能  |
|               `protect-mode`               | 将本机访问保护模式设置no                                     |
|               `tcp-keeplive`               | 单位为秒，如果设置为0，则不会进行Keepalive检测，建议设置成60 |
|               `tcp-backlog`                | 设置tcp的backlog，backlog其实是一个连接队列，backlog队列总和=未完成三次握手队列 + 已经完成三次握手队列。<br/>在高并发环境下你需要一个高backlog值来避免慢客户端连接问题。注意Linux内核会将这个值减小到/proc/sys/net/core/somaxconn的值，所以需要确认增大somaxconn和tcp_max_syn_backlog两个值<br/>来达到想要的效果 |
|                 **通用项**                 |                                                              |
|               `daemonize no`               | Redis 默认不是以守护进程的方式运行，可以通过该配置项修改，使用 yes 启用守护进程（Windows 不支持守护线程的配置为 no ） |
|        `pidfile /var/run/redis.pid`        | 当 Redis 以守护进程方式运行时，Redis 默认会把 pid 写入 /var/run/redis.pid 文件，可以通过 pidfile 指定 |
|             `loglevel notice`              | 指定日志记录级别，Redis 总共支持四个级别：debug、verbose、notice、warning，默认为 notice |
|              `logfile stdout`              | 日志记录方式，默认为标准输出，如果配置 Redis 为守护进程方式运行，而这里又配置为日志记录方式为标准输出，则日志将会发送给 /dev/null |
|               `database 16`                | 设定库的数量。默认16，默认数据库为0，可以使用SELECT命令在连接上指定数据库id |
|              `syslog-enabled`              | 是否把日志输出到syslog中                                     |
|               `syslog-ident`               | 指定syslog的日志标识                                         |
|             `syslog-facility`              | 指定syslog设备，值可以是User或者local                        |
|              **SNAPSHOT快照**              |                                                              |
|       `save  <seconds>` ` <changes>`       | `save 900 1` `save 300 10` `save 60 10000`分别表示 900 秒（15 分钟）内有 1 个更改，300 秒（5 分钟）内有 10 个更改以及 60 秒内有 10000 个更改。<br/>指定在多长时间内，有多少次更新操作，就将数据同步到数据文件，可以多个条件配合 |
|       `Stop-writes-on-bgsave-error`        | 如果配置成no，表示你不在乎数据不一致或者有其他的手段发现和控制 |
|            `rdbcompression yes`            | 指定存储至本地数据库时是否压缩数据，默认为 yes，Redis 采用 LZF 压缩，如果为了节省 CPU 时间，可以关闭该选项，但会导致数据库文件变的巨大 |
|               `rdbchecksum`                | 在存储快照后，还可以让redis使用CRC64算法来进行数据校验，但是这样做会增加大约10%的性能消耗，如果希望获取到最大的性能提升，可以关闭此功能 |
|           `dbfilename dump.rdb`            | 指定本地数据库文件名，默认值为 dump.rdb                      |
|                  `dir ./`                  | 指定本地数据库存放目录                                       |
|              **SECURITY安全**              |                                                              |
| `config set/get requirepass  "<password>"` | 设置/获取密码                                                |
|             `auth "password"`              | 密码校验                                                     |
|              `maxclients 128`              | 设置同一时间最大客户端连接数，默认无限制，Redis 可以同时打开的客户端连接数为 Redis 进程可以打开的最大文件描述符数，如果设置 maxclients 0，表示不作限制。当客户端连接数到达限制时，Redis 会关闭新的连接并向客户端返回 max number of clients reached 错误信息 |
|            **APPEND ONLY MODE**            |                                                              |
|              `appendonly no`               | 指定是否在每次更新操作后进行日志记录，Redis 在默认情况下是异步的把数据写入磁盘，如果不开启，可能会在断电时导致一段时间内的数据丢失。因为 redis 本身同步数据文件是按上面 save 条件来同步的，所以有的数据会在一段时间内只存在于内存中。默认为 no |
|      `appendfilename appendonly.aof`       | 指定更新日志文件名，默认为 appendonly.aof                    |
|           `appendfsync everysec`           | 指定更新日志条件，共有 3 个可选值：<br/>no：表示等操作系统进行数据缓存同步到磁盘（快）<br/>always：表示每次更新操作后手动调用 fsync() 将数据写到磁盘（慢，安全）<br/>everysec：表示每秒同步一次（折中，默认值） |
|        `No-appendfsync-on-rewrite`         | 重写时是否可以运用Appendfsync，用默认no即可，保证数据安全性。 |
|                   **VM**                   |                                                              |
|              `vm-enabled no`               | 指定是否启用虚拟内存机制，默认值为 no，简单的介绍一下，VM 机制将数据分页存放，由 Redis 将访问量较少的页即冷数据 swap 到磁盘上，访问多的页面由磁盘自动换出到内存中 |
|       `vm-swap-file /tmp/redis.swap`       | 虚拟内存文件路径，默认值为 /tmp/redis.swap，不可多个 Redis 实例共享 |
|             `vm-max-memory 0`              | 将所有大于 vm-max-memory 的数据存入虚拟内存，无论 vm-max-memory 设置多小，所有索引数据都是内存存储的(Redis 的索引数据 就是 keys)，也就是说，当 vm-max-memory 设置为 0 的时候，其实是所有 value 都存在于磁盘。默认值为 0 |
|             `vm-page-size 32`              | Redis swap 文件分成了很多的 page，一个对象可以保存在多个 page 上面，但一个 page 上不能被多个对象共享，vm-page-size 是要根据存储的 数据大小来设定的，作者建议如果存储很多小对象，page 大小最好设置为 32 或者 64bytes；如果存储很大大对象，则可以使用更大的 page，如果不确定，就使用默认值 |
|            `vm-pages 134217728`            | 设置 swap 文件中的 page 数量，由于页表（一种表示页面空闲或使用的 bitmap）是在放在内存中的，，在磁盘上每 8 个 pages 将消耗 1byte 的内存。 |
|             `vm-max-threads 4`             | 设置访问swap文件的线程数,最好不要超过机器的核数,如果设置为0,那么所有对swap文件的操作都是串行的，可能会造成比较长时间的延迟。默认值为4 |



Redis官网中介绍了Redis的两种持久化机制，如图所示

<img src="https://leslie1-1309334886.cos.ap-shanghai.myqcloud.com/obsidian/image-20211208211519780.png" alt="image-20211208211519780" style="zoom:80%;" />

【Redis中文网的翻译如下】Redis 提供了不同级别的持久化方式

- RDB持久化方式能够在指定的时间间隔对你的数据进行快照存储.
- AOF持久化方式记录每次对服务器写的操作,当服务器重启的时候会重新执行这些命令来恢复原始的数据,AOF命令以redis协议追加保存每次写的操作到文件末尾.Redis还能对AOF文件进行后台重写,使得AOF文件的体积不至于过大.
- 如果你只希望你的数据在服务器运行的时候存在,你也可以不使用任何持久化方式.
- 你也可以同时开启两种持久化方式, 在这种情况下, 当redis重启的时候会优先载入AOF文件来恢复原始的数据,因为在通常情况下AOF文件保存的数据集要比RDB文件保存的数据集要完整.

（后面的官网介绍就用Redis中文网的翻译版替代，便于理解）



## 持久化之RDB

了解RDB具体内容之前，可以先看看官网的介绍

<img src="https://leslie1-1309334886.cos.ap-shanghai.myqcloud.com/obsidian/image-20211208211537873.png" alt="image-20211208211537873" style="zoom:80%;" />

### RDB是什么

RDB持久化方案是：**在指定的时间间隔内将内存中的数据集快照写入磁盘(point-in-time)，即为Snapshot，恢复方式是将快照文件直接读到内存中**。它以紧缩的二进制文件保存Redis数据库某一时刻所有数据对象的内存快照，可用于Redis的数据备份、转移与恢复。到目前为止，仍是官方的默认支持方案。

<img src="https://leslie1-1309334886.cos.ap-shanghai.myqcloud.com/obsidian/image-20211208234044320.png" alt="image-20211208234044320" style="zoom:80%;" />

### RDB工作原理

#### 1.工作原理

Redis会单独创建（fork）一个子进程来进行持久化，先将数据写入到一个临时文件`dump.rdb`中，待持久化过程都结束了，再用这个临时文件替换上次持久化好的文件（整个过程中，主进程是不进行任何IO操作的，这就确保了极高的性能）

如果需要进行大规模数据的恢复，且对于数据恢复的完整性不是非常敏感，那RDB方式要比AOF方式更加的高效。**RDB的缺点是最后一次持久化后的数据可能丢失**。

#### 2.配置文件

```yaml
## Redis.conf：********************SNAPSHOT********************
# 时间策略
save 900 1
save 300 10
save 60 10000

# 文件名称
dbfilename dump.rdb

# 文件保存路径
dir ./

# 如果持久化出错，主进程是否停止写入
stop-writes-on-bgsave-error yes

# 是否压缩
rdbcompression yes

# 导入时是否检查
rdbchecksum yes
```

- 配置文件中持久化的策略为：`save <seconds><changes>`，即在指定seconds内至少changs个key发生了改变，就会自动触发持久化；
- RDB持久化的快照文件名称默认为`dump.rdb`；
- 快照文件默认存储在Redis启动时命令行所在的目录下；
- `stop-writes-on-bgsave-error`开启表示当Redis无法写入磁盘的话，直接关掉Redis的写操作。默认为yes；
- `rdbcompression`开启表示Redis会采用LZF算法对快照文件进行压缩存储；
- `rdbchecksum`开启表示Redis启用CRC64算法来进行数据校验

#### 3.触发机制

Redis的持久化触发方式有两种：指令主动触发、自动触发

- 自动触发：满足配置文件中的`save <seconds><changes>`规则时触发；主从复制时主节点发送rdb文件到从节点会触发；执行`debug reload`时会触发；shutdown时未开启aof会触发。【自动触发采用的是bgsave】

- 手动触发：通过手动输入指令实现。

  - **save**：执行save执行后，Redis会立刻启动持久化流程，由于Redis的请求处理是单线程模型，因此会阻塞其他所有服务。不建议线上使用。

    <img src="https://leslie1-1309334886.cos.ap-shanghai.myqcloud.com/obsidian/image-20211208221452010.png" alt="image-20211208221452010" style="zoom:80%;" />

  - **bgsave**：Redis会在后台异步进行快照操作，通过fork出子进程操作持久化，主线程同时可以响应客户端请求。可以通过lastsave命令获取最后一次成功执行快照的时间

    【注】Redis的fork子进程操作会阻塞，如果频繁的执行备份或文件集较大fork耗时较长，都会影响Redis性能

    <img src="https://leslie1-1309334886.cos.ap-shanghai.myqcloud.com/obsidian/image-20211208221505183.png" alt="image-20211208221505183" style="zoom:80%;" />

  - 执行flushall命令，也会产生dump.rdb文件。flushall用于清空Redis数据库所有数据，因此也会对dump.rdb等备份文件进行清空，最终得到的就是空的dump.rdb文件。



### RDB备份操作

1.首先设置自动备份策略`save 15 2`，15秒内有两次key的修改就自动备份。

<img src="https://leslie1-1309334886.cos.ap-shanghai.myqcloud.com/obsidian/image-20211208231357749.png" alt="image-20211208231357749" style="zoom: 80%;" />

2.通过`config get dir`获取rdb文件存储路径为`/etc/opt`，此时该路径下还没有dump.rdb文件

<img src="https://leslie1-1309334886.cos.ap-shanghai.myqcloud.com/obsidian/image-20211208231546701.png" alt="image-20211208231546701" style="zoom:80%;" />

<img src="https://leslie1-1309334886.cos.ap-shanghai.myqcloud.com/obsidian/image-20211208231525203.png" alt="image-20211208231525203" style="zoom:67%;" />

3.进入redis-cli，通过`set k v`指令在15秒内修改2个key，此时再看发现有文件了

<img src="https://leslie1-1309334886.cos.ap-shanghai.myqcloud.com/obsidian/image-20211208231639148.png" alt="image-20211208231639148" style="zoom:67%;" />

4.通过`shutdown`关闭Redis服务，将rdb文件拷贝到myconf目录并重命名dump_old.rdb，删除原来的dump.rdb文件，启动redis，此时`KEYS *`看到的时（empty array），原来的数据都没有了

<img src="https://leslie1-1309334886.cos.ap-shanghai.myqcloud.com/obsidian/image-20211208232640759.png" alt="image-20211208232640759" style="zoom:80%;" />

5.再次关闭Redis。将dump_old.rdb拷贝到`/etc/opt`目录下【此时会提示是否覆盖，因为shutdown未指定aof时会产生rdb文件】，启动Redis，此时就又可以看到之前的key了

<img src="https://leslie1-1309334886.cos.ap-shanghai.myqcloud.com/obsidian/image-20211208232921640.png" alt="image-20211208232921640" style="zoom:80%;" />

6.手动备份直接调用save或bgsave，就会在`/etc/opt`目录下生成dump.rdb文件。其他验证操作类似

7.动态停止RDB：`redis-cli config set save ""`#save后给空值，表示禁用保存策略



### RDB的优缺点

RDB备份的优缺点官网文档已经给出

#### 优点

- 适合大规模的数据恢复
- 对数据完整性和一致性要求不高更适合使用
- 能够节省磁盘空间
- 恢复速度快

#### 缺点

- Fork的时候，内存中的数据被克隆了一份，大致2倍的膨胀性需要考虑
- 虽然Redis在fork时使用了**写时拷贝技术**,但是如果数据庞大时还是比较消耗性能。
- 在备份周期在一定间隔时间做一次备份，所以如果Redis意外down掉的话，就会丢失最后一次快照后的所有修改



## 持久化之AOF

同样可以先了解下官网文档对AOF的介绍

<img src="https://leslie1-1309334886.cos.ap-shanghai.myqcloud.com/obsidian/image-20211208234508553.png" alt="image-20211208234508553" style="zoom:80%;" />

### AOF是什么

上面的RDB是一种时间点策略的持久化，它比较适合数据备份和容灾恢复。但是它不能实时地进行数据持久化，而AOF就是对这个问题的补充。

AOF以**日志**的形式来记录每个写操作（增量保存），将Redis执行过的所有写指令记录下来(**读操作不记录**)， **只许追加文件但不可以改写文件**，redis启动之初会读取该文件重新构建数据，换言之，redis 重启的话就根据日志文件的内容将写指令从前到后执行一次以完成数据的恢复工作。



### AOF工作原理

#### 1.工作原理

AOF是Redis的完全持久化策略，它通过记录所有引起Redis数据修改的指令集合，按顺序追加到文件中，然后重启时从头全部执行一遍，达到恢复关闭前的数据状态。因此将aof文件放到任何机器上，Redis都能按需执行指令恢复数据。

由于每一次的写操作都需要记录到文件中，因此AOF会对Redis的性能有一定影响

AOF的本质是利用Redis的通讯协议，将命令以纯文本形式写入到备份文件中。例如指令`set name leslie`执行，会在缓冲区追加文本

```shell
\r\n$3\r\nset\r\n$5\r\nname\r\n$5\r\nleslie\r\n

#Redis协议
#首先Redis是以行来划分，每行以\r\n行结束。每一行都有一个消息头，消息头共分为5种分别如下:
+	#表示一个正确的状态信息，具体信息是当前行后面的字符。
-	#表示一个错误信息，具体信息是当前行后面的字符。
*	#表示消息体总共有多少行，不包括当前行,后面是具体的行数。
$	#表示下一行数据长度，不包括换行符长度\r\n,后面则是对应的长度的数据。
:	#表示返回一个数值，后面是相应的数字节符。
```

（1）采用文本协议的原因

1. 文本协议具有很好的兼容性。
2. 开启AOF后，所有写入命令都包含追加操作，直接采用协议格式，避免二次处理开销。
3. 文本协议具有可读性，方便直接修改和处理。

（2）追加指令到缓冲区的原因

1. Redis使用单线程响应命令，如果每次写AOF文件命令都直接追加到硬盘，会带来很高的磁盘IO，影响整体性能；
2. Redis还可以通过提供不同的缓冲区同步策略，在性能和安全性方面做出平衡。

#### 2.配置文件

```shell
# 是否开启aof
appendonly yes

# 文件名称
appendfilename "appendonly.aof"

# 同步方式
appendfsync everysec

# aof重写期间是否同步
no-appendfsync-on-rewrite no

# 重写触发配置
auto-aof-rewrite-percentage 100
auto-aof-rewrite-min-size 64mb

# 加载aof时如果有错如何处理
aof-load-truncated yes

# 文件重写策略
aof-rewrite-incremental-fsync yes
```

- AOF默认是关闭的，通过修改配置中的`appendonly`为yes开启；
- 默认的备份文件名称是`appendonly.aof`；
- 同步方式有三种：always、everysec、no。一般采用everysec，顶多损失1s的数据；
- `no-appendfsync-on-rewrite`开启表示：在重写aof文件期间执行的写操作，不会写进aof文件而是写入缓存
- `auto-aof-rewrite-percentage`和`auto-aof-rewrite-min-size`设置了AOF文件重写的增长百分比或文件大小；
- `aof-load-truncated `开启表示：在加载时发现aof尾部不正确，会向客户端写入一个log，然后继续执行，如果设置为 `no` ，发现错误就会停止，必须修复后才能重新加载。



#### 3.工作流程

AOF总体分为两个部分：将指令实时写入aof文件、读取aof文件重写数据。具体流程包括**命令写入append**、**文件同步sysc**、**文件重写rewrite**、**重启加载load**。

##### 3.1 命令写入

Redis在启动AOF后，每执行一个写操作的指令，都会以协议格式将被执行的命令追加到Redis的AOF缓存区（aof_buf）末尾。这样的好处在于在大量写请求情况下，采用缓冲区暂存一部分命令随后根据策略一次性写入磁盘，这样可以减少磁盘的I/O次数，提高性能。

【注】：如果命令append时正在进行重写，这些命令还会写入缓存区

##### 3.2 文件同步

学习文件同步前，先了解Linux的**系统调用write和fsync**

- write操作会触发**延迟写（delayed write）机制**——传统的UNIX实现在内核中设有缓冲区高速缓存或页面高速缓存，大多数磁盘I/O都通过缓冲进行。 当将数据写入文件时，内核通常先将该数据复制到其中一个缓冲区中，如果该缓冲区尚未写满，则并不将其排入输出队列，而是等待其写满或者达到特定时间周期时， 再将该缓冲排到输出队列，然后待其到达队首时，才进行实际的I/O操作。这种输出方式就被称为延迟写。

  write操作通过延迟写减少了磁盘IO提高了性能。但是降低了aof文件内容更新的速度，在未达到缓冲区输出条件这段时间的数据都没有同步。如果此时系统发生故障，可能造成文件更新内容的丢失。为了保证磁盘上实际文件系统与缓冲区高速缓存中内容的一致性，UNIX系统提供了sync、fsync和fdatasync三个函数为强制写入硬盘提供支持。

- fsync针对单个文件操作（比如AOF文件），做强制硬盘同步，fsync将阻塞进程直到写入硬盘完成后返回，保证了数据持久化。



Redis根据指定策略将缓冲区数据写入文件。Redis提供了三种同步策略，由配置参数`appendfsync`决定，下面是每个策略对应的含义：

- no：不使用fsync方法同步，而是交给操作系统write函数去执行同步操作，在linux操作系统中大约每30秒刷一次缓冲；
- always：表示每次有写操作都调用fsync方法强制内核将数据写入到aof文件；
- everysec：数据将使用调用操作系统write写入文件，并使用fsync每秒一次从内核刷新到磁盘。 这是折中的方案，最多丢失1S数据，兼顾性能和数据安全，所以Redis**默认推荐使用该配置**。



##### 3.3 文件重写

AOF采用文件追加方式，文件会越来越大为避免出现此种情况，新增了重写机制, 当AOF文件的大小超过所设定的阈值时，Redis就会启动AOF文件的内容压缩， 只保留可以恢复数据的最小指令集。

Redis会记录上次重写时的AOF大小，上面的配置文件有介绍，默认配置是当AOF文件大小是上次rewrite后大小的100%且文件大于64M时自动触发。也可以使用命令`bgrewriteaof`手动触发。

例如：文件达到70MB开始重写，降到50MB，下次什么时候开始重写？100MB

系统载入时或者上次重写完毕时，Redis会记录此时AOF大小，设为base_size，如果Redis的AOF当前大小>= base_size +base_size*100% (默认)且当前大小>=64mb(默认)的情况下，Redis会对AOF进行重写。 

**重写流程**

AOF文件持续增长而过大时，会fork出一条新进程来将文件重写(也是先写临时文件最后再rename覆盖)，遍历新进程的内存中数据，每条记录有一条的Set语句。重写aof文件的操作，并没有读取旧的aof文件，而是将整个内存中的数据库内容用命令的方式重写了一个新的aof文件，这点和快照有点类似

（1）bgrewriteaof触发重写，判断是否当前有bgsave或bgrewriteaof在运行，如果有，则等待该命令结束后再继续执行。

（2）主进程fork出子进程执行重写操作，保证主进程不会阻塞。

（3）子进程遍历redis内存中数据到临时文件，客户端的写请求同时写入aof_buf缓冲区和aof_rewrite_buf重写缓冲区保证原AOF文件完整以及新AOF文件生成期间的新的数据修改动作不会丢失。

（4）1).子进程写完新的AOF文件后，向主进程发信号，父进程更新统计信息。2).主进程把aof_rewrite_buf中的数据写入到新的AOF文件。

（5）使用新的AOF文件覆盖旧的AOF文件，完成AOF重写。

<img src="https://leslie1-1309334886.cos.ap-shanghai.myqcloud.com/obsidian/image-20211210002329960.png" alt="image-20211210002329960" style="zoom: 80%;" />

**重写举例**

Redis服务器通过AOF重写生成新的aof文件替代旧aof，新旧aof文件所对应的是相同的Redis数据状态。不过新的文件在指令上做了精简

启动Redis输入如下指令：

<img src="https://leslie1-1309334886.cos.ap-shanghai.myqcloud.com/obsidian/image-20211210225414544.png" alt="重写实现" style="zoom:80%;" />

此时list中的数据状态：`["v0","v1","v2","v3","v7","v8"]`，旧的aof文件包括以上所有修改数据的指令。

如果要重写AOF达到和当前list相同的数据状态，最好的方法不是读取旧的aof文件，而是直接遍历当前Redis数据库中list键值，用：`RPUSH list v0 v1 v2 v3 v7 v8`一条指令实现相同的数据状态。



##### 3.4 重启加载

当Redis服务关闭重启后，对于服务器上既有RDB又有AOF文件时，优先加载AOF文件

<img src="https://leslie1-1309334886.cos.ap-shanghai.myqcloud.com/obsidian/image-20211210003029035.png" alt="image-20211210003029035" style="zoom: 80%;" />



## 总结

其实Redis官网的持久化介绍就是关于RDB和AOF的优缺点及使用推荐。

可以参考中文官网：[Redis 持久化](http://www.redis.cn/topics/persistence.html)进行了解。

RDB快照、AOF重写都需要fork，这是一个重量级操作，会对Redis造成阻塞。因此为了不影响Redis主进程响应，需要尽可能降低阻塞。比如降低fork频率、制定合理的内存分配策略、控制Redis的最大内存等

在具体实践时，可以自己制定策略，RDB和AOF结合使用，并定期检查Redis情况，然后手动备份、重写数据；单机部署多个实例时，需要注意防止福哦个机器同时持久化和重写，避免出现IO、内存的竞争，造成串行操作；也可以加入主从机器，一台备份一台响应请求等；



## 参考

- [一文看懂Redis的持久化原理](https://juejin.cn/post/6844903655527677960)
- [Redis专题：万字长文详解持久化原理](https://segmentfault.com/a/1190000039208726)
- [尚硅谷Redis持久化](https://www.bilibili.com/video/BV1oW411u75R?p=18)
