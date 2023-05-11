---
title: 1、RabbitMQ快速入门
tags: RabbitMQ
categories: 消息队列
abbrlink: 34902a6
date: 2023-05-11 10:11:14
---
## 1、消息队列

### 1.1 消息队列的基本概念

消息（Message）是指在应用层之间传递的数据，比如文本字符串、JSON。现在的互联网系统中，前后端各个组件模块间传递数据信息，都可以称之为消息

而消息队列中间件（Message Queue Middleware，简称MQ）则是利用 **可靠的消息传递机制**进行与平台无关的数据交流，并基于数据通信来进行分布式系统的集成。通过消息模型，它可以在**分布式环境下扩展进程间的通信**。

基于此，消息队列有两种模型：

1. **点对点模式**（P2P，Point to Point），也可以称作队列模型。基本组成生产者Producer、队列Queue、消费者Consumer，生产者发送消息到队列、消费者从队列中消费消息，总体是一个发->存->收的流程；其中一个队列可以存储多个生产者的消息、一个队列也可以有多个消费者，但是消费者之间对于消息的消费是竞争的，即消息只能被一个消费者消费。

   <img src="https://cdn.nlark.com/yuque/0/2022/png/23183050/1656752853775-d629dca9-650b-45c6-82fc-f1ea314de706.png" alt="img" style="zoom:80%;" />

1. **发布订阅模型**（P/S，Pub/Sub），发布订阅模型中基本组成为生产者Publisher、主题Topic、订阅者Subscriber

<img src="https://cdn.nlark.com/yuque/0/2022/png/23183050/1656752866085-a83509a2-55ec-42f3-90a7-7dc831e8c365.png" alt="img" style="zoom:80%;" />

消息中间件适用于**需要可靠的数据传送的分布式环境**。发送者将消息发送给消息服务器，消息服务器将 消息存放在若干队列中，在合适的时候再将消息 转发给接收者。实现应用程序之间的协同，优点在于能够在客户和服务器之间提供同步和异步的链接，并且在任何时刻都可以将消息进行传送或存储转发。

### 1.2 为什么用消息队列

消息队列的主要应用场景有三点：**解耦、异步、削峰**

- **解耦**：在引入消息队列之前，上游业务模块A的功能FA可能需要调用到BCD的服务，还需要考虑到怎么调？变更怎么处理？等等。而引入消息队列后，功能FA执行后将消息发送到消息队列，下游的服务需要就自己消费消息即可
- **异步**：一个功能的调用链路往往涉及到多个服务，如果调用链路过长，就会导致功能的响应时间过长。引入消息队列后处理异步进行，可以极大降低响应时间
- **削峰**：在高峰期大量数据涌入，可能会超出系统能处理的极限，如果有消息队列做缓冲就不至于导致系统宕机

由以上三点可以知道，在个人或小型的系统中其实是不需要消息队列的，消息队列应该主要应用于大型的分布式系统中，以实现系统功能解耦、提高响应率、保证高并发环境的稳定性。

<img src="https://cdn.nlark.com/yuque/0/2022/png/23183050/1656752892421-6a275339-4254-47bf-92f1-7b7d8d67c033.png" alt="img" style="zoom: 80%;" />

### 1.3 主流消息队列的简单对比

市场上主流的消息队列有以下几种，他们各有优劣

1、RabbitMQ：使用Erlang语言，基于AMQP（高级消息队列协议）实现的开源消息中间件。消息延迟能做到微秒级，有较好的并发特性，能实现万级流量吞吐

2、Kafka：主要应用于大数据的消息中间件，以超高的并发吞吐量而闻名。能做到十万级的吞吐，毫秒级的延迟，在大数据实时计算和日志采集领域被大规模使用

3、ActiveMQ：作为老牌MQ，基于主从架构实现高可用，能保证较低的消息丢失率

4、RocketMQ：阿里开源的消息中间件。性能好延迟低，有对应的中文社区

如图公众号博主【三分恶】在他的：[面渣逆袭：RocketMQ二十三问](https://mp.weixin.qq.com/s/fcyDIr6Nas8fBukByI3tEg) 中做出了详细对比：

<img src="https://cdn.nlark.com/yuque/0/2022/png/23183050/1656746312635-45d549c0-1c5d-41b0-bd2f-27e8663c8619.png" alt="img" style="zoom: 80%;" />

## 2、RabbitMQ简介

### 2.1 RabbitMQ概念

RabbitMQ是Erlang基于AMQP（Advanced Message Queuing Protocol）的实现，最初起源于金融系统，用于在分布式系统中存储转发消息

<img src="https://cdn.nlark.com/yuque/0/2022/png/23183050/1654765818347-bc4a54a8-7d21-4002-8f78-9f73b1feb75d.png" alt="img" style="zoom: 80%;" />

#### RabbitMQ核心组件

- Producer：消息生产者，投递消息的一方，属于Client；消息一般由两部分组成——标签（label）和消息体（payload）
- Consumer：消息消费者，接收消息的一方，属于Client；消费者连接到RabbitMQ服务器，并订阅到队列上，消费消息时只消费消息体，丢弃标签
- Broker：消息队列服务进程，一般可以将一个Broker看作一台服务器
- Exchange：消息队列交换机，实际上消息并不是由生产者直接投递到消息队列，而是发到交换机Exchange上，**由交换机采用相应策略将消息路由转发到对应队列中**

<img src="https://cdn.nlark.com/yuque/0/2022/png/23183050/1654768178092-5b24deb4-f615-4bdd-aa42-27c4dcb3af9d.png" alt="img" style="zoom: 80%;" />

- Queue：消息队列，存储消息的队列，RabbitMQ中消息只能存储在队列中。多个消费者可以订阅同一个队列，此时消息会采用轮询机制（Round-Robin），即消息被平摊给多个消费者，而不是所有消费者都收到所有消息

 【注】RabbitMQ不支持队列层面的广播消息，要实现广播需要二次开发，但不建议这么做

<img src="https://cdn.nlark.com/yuque/0/2022/png/23183050/1654767707901-6f3e059a-9ddf-4058-afed-3b343640b22b.png" alt="img" style="zoom: 80%;" />





#### RabbitMQ的运行流程

1. 生产者连接到Broker，建立连接（connection）开启信道（channel）
2. 生产者声明一个交换机（Exchange），并设置对应属性，如交换机类型、是否持久化等
3. 生产者声明一个队列（Queue）并设置对应属性，如是否持久化、是否排他、是否自动删除等
4. 生产者通过路由键（RoutingKey）将交换机和队列设置绑定（Binding）
5. 生产者发送消息到Broker中，消息包含了路由键、交换器等信息
6. 交换机根据设置的类型规则，通过路由键匹配对应的队列
7. 如果找到则存入相应的队列中并，可以设置是否确认
8. 如果没有找到，则根据之前配置的属性选择丢弃或者回退
9. 关闭信道与连接

<img src="https://cdn.nlark.com/yuque/0/2022/png/23183050/1654767542320-5f7bcd66-2552-4ad0-9228-4797cd539962.png" alt="img" style="zoom: 80%;" />

#### RabbitMQ主要特点

- 可靠性：支持持久化，传输确认，发布确认等保证了MQ的可靠性
- 灵活的分发消息策略：在消息进入MQ队列前由Exchange(交换机)进行路由消息，RabbitMQ提供了内置的Exchange，也可以通过插件自定义
- 支持集群：多台RabbitMQ服务器可以组成一个集群，形成一个逻辑Broker
- 多种协议：RabbitMQ支持除原生AMQP外的多种消息队列协议，如 STOMP、MQTT 等
- 多种语言客户端：RabbitMQ几乎支持所有常用语言，如 Java、Python、Ruby 等
- 可视化管理界面：RabbitMQ提供了一个易用的用户界面，使得用户可以监控和管理消息 Broker
- 插件机制：RabbitMQ提供了许多插件，也可以自定义插件



## 3、RabbitMQ安装

### 3.1 安装&运行

Windows安装RabbitMQ需要前置erlang环境

1. 在[erlang官网](https://www.erlang-solutions.com/downloads/)下载，
2. RabbitMQ的官方[下载链接](https://www.rabbitmq.com/download.html)下载
3. 下载按步骤安装完毕后，打开RabbitMQ安装目录下的sbin目录，通过命令行界面执行：rabbitmq-plugins enable rabbitmq_management安装管理功能插件
4. 执行bat文件即可启动

Linux安装可以参照Windows，也可以使用Docker简化安装操作

1. 指令dockers search rabbitmq搜索相关镜像

2. 由于rabbitmq默认镜像是不带web管理端的，所以可以拉取management后缀的镜像，通过指令docker pull rabbitmq:3.8-management拉取

   <img src="https://cdn.nlark.com/yuque/0/2022/png/23183050/1654759324467-d5934078-1b18-43b9-9cad-d0da55934a08.png" alt="img" style="zoom:80%;" />

3. 指令docker run --name rabbitmq -d -p 15672:15672 -p 5672:5672 镜像ID启动镜像<img src="https://cdn.nlark.com/yuque/0/2022/png/23183050/1654759352997-5654f308-267e-44fd-907e-0fde0a679a7c.png" alt="img" style="zoom:80%;" />

- - 其中5672为rabbitmq的通信端口，而15672是web管理页面端口
  - 通过docker ps查看正在运行的容器

1. 启动运行后，放行对应防火墙端口才可以访问。firewall-cmd --zone=public --add-port=5672/tcp --permanent开放对应端口，就可以正常访问了，浏览器中键入：虚拟机IP:15672，默认账户密码都是guest，登录

   <img src="https://cdn.nlark.com/yuque/0/2022/png/23183050/1654759730631-640e63db-3d6e-415e-8169-59565a9ac176.png" alt="img" style="zoom:80%;" />

【注】有时强制关闭虚拟机再重启恢复后，会还原虚拟机之前的状态，可以看到docker容器已经在运行，但是对应服务无法访问，通过`systemctl restart docker.service`就可以访问了

### 3.2 RabbitMQ的基本使用

#### 命令行与控制台

通过Docker的docker exec -it rabbitMQ容器ID bash进入bash界面，在此处可以通过rabbitMQ自己的命令行进行相关操作。基本命令都是rabbitmqctl xxx形式，详细指令可以参考官方文档：https://www.rabbitmq.com/rabbitmqctl.8.html

**1、查看基本信息**

```shell
rabbitmqctl start_app # 开启服务
rabbitmqctl stop_app # 关闭服务
# 查看状态
rabbitmqctl status
# 查看binding、channel、交换机
rabbitmqctl list_bindings
rabbitmqctl list_channels
rabbitmqctl list_exchanges
```

**2、rabbitmq用户操作**

```shell
# 创建账号和密码
rabbitmqctl add_user admin admin123
# 设置用户角色
rabbitmqctl set_user_tags admin administrator
# 为用户添加资源权限
# set_permissions [-p <vhostpath>] <user> <conf> <write> <read>
rabbitmqctl set_permissions -p "/" admin ".*" ".*" ".*"

# 查看用户列表
rabbitmqctl list_users
# 删除用户
rabbitmqctl delete_user admin
```

由于默认的guest 账户有访问限制，默认只能通过本地网络(如 localhost) 访问，远程网络访问受限，所以在使用时我们一般另外添加用户，例如我们添加一个root用户

①执行`docker exec -i -t 3ae bin/bash`进入到rabbitMq容器内部

<img src="https://cdn.nlark.com/yuque/0/2022/png/23183050/1654760021752-654720b7-eb24-4680-b871-25151972f9f3.png" alt="img" style="zoom:80%;" />

②执行 `rabbitmqctl add_user root 123456 `添加用户，用户名为root,密码为123456

<img src="https://cdn.nlark.com/yuque/0/2022/png/23183050/1654760040728-bd353bfa-20ac-4845-a06a-decdf308c4a9.png" alt="img" style="zoom:80%;" />

③执行`abbitmqctl set_permissions -p / root ".*" ".*" ".*"`赋予root用户所有权限

<img src="https://cdn.nlark.com/yuque/0/2022/png/23183050/1654760075446-e91a2b4e-f6dd-4271-b250-dd17a37e0de8.png" alt="img" style="zoom:80%;" />

④执行`rabbitmqctl set_user_tags root administrator`赋予root用户administrator角色

<img src="https://cdn.nlark.com/yuque/0/2022/png/23183050/1654760104338-da9692f5-ab66-47a4-abac-56c3002bde3d.png" alt="img" style="zoom:80%;" />

⑤执行`rabbitmqctl list_users `查看所有用户即可看到root用户已经添加成功

<img src="https://cdn.nlark.com/yuque/0/2022/png/23183050/1654760121394-dc5c8d32-f9e3-4d57-be7e-d73603d494ea.png" alt="img" style="zoom:80%;" />

⑥后续可以用root用户登录

**3、虚拟主机vhost操作**

```shell
# 添加vhost
rabbitmqctl add_vhost "虚拟主机名"
# 查看vhost
rabbitmqctl list_vhosts
# 查看vhost权限，一般创建时不需要配置权限
rabbitmqctl list_permissions -p "虚拟主机名"
# 删除vhost
rabbitmqctl delete_vhost "虚拟主机名"
```

上述操作也可以在管理界面执行，同时管理界面还支持配置文件的导入导出




## 4、代码测试

### 4.1 Hello World模型

一个最简单的消息队列就是`producer`、`message queue`、`consumer`，现在Docker部署了队列服务，可以简单写一下生产者消费者

<img src="https://cdn.nlark.com/yuque/0/2022/png/23183050/1654854211560-bd2d988d-79d6-43a7-936a-f73ee2b86ced.png" alt="img" style="zoom:80%;" />

准备pom依赖

```xml
<dependencies>
  <!--rabbitmq 依赖客户端-->
  <dependency>
    <groupId>com.rabbitmq</groupId>
    <artifactId>amqp-client</artifactId>
    <version>5.8.0</version>
  </dependency>
  <!--操作文件流的一个依赖-->
  <dependency>
    <groupId>commons-io</groupId>
    <artifactId>commons-io</artifactId>
    <version>2.6</version>
  </dependency>
</dependencies>
```

**生产者代码**

产生消息的步骤

1. 生产者连接到MQ的Broker，创建connection，开启channel
2. 生命队列的相关属性：名称、是否持久化、消费模式等
3. 发送消息，并指定持久化和routing key等属性

```java
public class Producer {

    private static final String QUEUE_NAME = "hello rabbit";

    public static void main(String[] args) throws Exception {
        ConnectionFactory factory = new ConnectionFactory();
        factory.setHost("192.168.204.127");
        factory.setUsername("guest");
        factory.setPassword("guest");

        Connection connection = factory.newConnection();
        Channel channel = connection.createChannel();
        /**
         * 生成一个队列
         * 1.队列名称
         * 2.队列里面的消息是否持久化 也就是是否用完就删除
         * 3.该队列是否只供一个消费者进行消费 是否进行共享 true 可以多个消费者消费
         * 4.是否自动删除 最后一个消费者端开连接以后 该队列是否自动删除 true 自动删除
         * 5.其他参数
         */
        channel.queueDeclare(QUEUE_NAME, false, false, false, null);
        String msg = "你好 Rabbit MQ！";
        /**
         * 发送一个消息
         * 1.发送到那个交换机
         * 2.路由的 key 是哪个
         * 3.其他的参数信息
         * 4.发送消息的消息体
         */
        channel.basicPublish("",QUEUE_NAME,null,msg.getBytes());
        System.out.println("生产者发送了一条消息！");
    }
}
```

![img](https://cdn.nlark.com/yuque/0/2022/png/23183050/1654854864787-ca717c44-fe79-40eb-b355-1269681db414.png)

【注】如果先启动消费者，由于MQ里没有相应队列，连接会报错，要先启动生产者发送一条消息到队列中，此时可以看到MQ中创建了队列并有一条消息待消费

<img src="https://cdn.nlark.com/yuque/0/2022/png/23183050/1654855241716-e190ae6d-b304-425b-a0be-90deaf21d68c.png" alt="img" style="zoom:80%;" />

**消费者代码**

```java
public class Consumer {

    private static final String QUEUE_NAME="hello rabbit";

    public static void main(String[] args) throws Exception{
        ConnectionFactory factory = new ConnectionFactory();
        factory.setHost("192.168.204.127");
        factory.setUsername("guest");
        factory.setPassword("guest");

        Connection connection = factory.newConnection();
        Channel channel = connection.createChannel();

        System.out.println("-----等待接收消息-----");

        //推送的消息如何进行消费的接口回调
        DeliverCallback deliverCallback = (consumerTag, delivery) -> {
            String message = new String(delivery.getBody());
            System.out.println(message);
        };
        //取消消费的一个回调接口 如在消费的时候队列被删除掉了
        CancelCallback cancelCallback = (consumerTag) -> {
            System.out.println("消息消费被中断");
        };
        /**
         * 消费者消费消息 - 接受消息
         * 1.消费哪个队列
         * 2.消费成功之后是否要自动应答 true 代表自动应答 false 手动应答
         * 3.消费者未成功消费的回调
         * 4.消息被取消时的回调
         */
        channel.basicConsume(QUEUE_NAME, true, deliverCallback, cancelCallback);
    }

}
```

<img src="https://cdn.nlark.com/yuque/0/2022/png/23183050/1654854904517-acbd1a4b-eaff-488e-a422-50505ce5f9d7.png" alt="img" style="zoom:80%;" />



### 4.2 Work queue模型

①抽取出创建连接开启通道的代码，得到工具类`RabbitMQUtils`

```java
public class RabbitMQUtils {

    public static Channel getChannel() throws Exception{
        ConnectionFactory factory = new ConnectionFactory();
        factory.setHost("192.168.204.127");
        factory.setUsername("guest");
        factory.setPassword("guest");

        Connection connection = factory.newConnection();
        Channel channel = connection.createChannel();
        return channel;

    }
}
```

②创建消费者类`Worker01`，模拟多个消费者

```java
public class Worker01 {

    private static final String QUEUE_NAME="hello rabbit";

    public static void main(String[] args) throws Exception{
        Channel channel = RabbitMQUtils.getChannel();

        DeliverCallback deliverCallback = (consumerTag,delivery)->{
            String receiveMsg = new String(delivery.getBody());
            System.out.println("接收到消息："+receiveMsg);
        };
        CancelCallback cancelCallback = (consumerTag)->{
            System.out.println(consumerTag+"--->消费者取消了消费接口");
        };

        System.out.println("线程1启动   等待消费消息........");
        channel.basicConsume(QUEUE_NAME,true,deliverCallback,cancelCallback);
    }
}
```

由于多个消费者逻辑代码一样，没必要再去新建类copy代码，直接在IDEA的Run Configuration勾选允许多个实例运行：

<img src="https://cdn.nlark.com/yuque/0/2022/png/23183050/1654856449966-69deba9b-b0ba-4d6f-957f-f02e2aa40365.png" alt="img" style="zoom:80%;" />

运行`Worker01`后，修改提示信息为`"线程2启动   等待消费消息........"`，再次Run，得到两个不同的线程

③修改创建者类，使得可以从控制台不断输入

```java
public class Task01 {

    private static final String QUEUE_NAME="hello rabbit";

    public static void main(String[] args) throws Exception{
        Channel channel = RabbitMQUtils.getChannel();

        Scanner scanner = new Scanner(System.in);
        while (scanner.hasNext()){
            String msg = scanner.next();
            channel.basicPublish("",QUEUE_NAME,null,msg.getBytes());
            System.out.println("task01发送了消息："+msg);
        }
    }
}
```

④将三者都启动，输入多条数据，可以发现rabbitmq默认采取轮询策略读取消息

<img src="https://cdn.nlark.com/yuque/0/2022/png/23183050/1654856773461-66a30dd9-e6a4-4490-bc50-564a98e08872.png" alt="img" style="zoom:80%;" />

<img src="https://cdn.nlark.com/yuque/0/2022/png/23183050/1654856782526-216d3d82-9384-496a-813a-bd616660f528.png" alt="img" style="zoom:80%;" />

<img src="https://cdn.nlark.com/yuque/0/2022/png/23183050/1654856792692-a8b2b2d6-e673-4a6d-ab33-fc86cd3cbf17.png" alt="img" style="zoom:80%;" />





## 参考

学习主要看的尚硅谷网课，参考评论区两位学员的笔记，以及官方文档和《RabbitMQ实战指南》电子书

- 官方tutorial文档：https://www.rabbitmq.com/tutorials/tutorial-one-java.html
- [尚硅谷RabbitMQ教程丨快速掌握MQ消息中间件_哔哩哔哩_bilibili](https://www.bilibili.com/video/BV1cb4y1o7zz?share_source=copy_pc)
- 《RabbitMQ实战指南》PDF
- [RabbitMQ - - OddFar’s Notes](https://note.oddfar.com/pages/95ce73/#hello-world)
- [RabbitMQ - - 宇轩英建](https://www.yuque.com/yuxuandmbjz/rabbitmq)