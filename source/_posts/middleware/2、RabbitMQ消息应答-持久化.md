---
title: 2、RabbitMQ消息应答&持久化
tags: RabbitMQ
categories: 消息队列
abbrlink: 62ae0b86
date: 2023-05-11 10:20:55
---
## 消息应答

1、问题引出

假设消费者处理某个业务功能需要100条消息，现在获取了50条，还没处理完进程就终止了。

按照入门示例写的代码，未处理的消息就会被直接丢弃，而剩余未发送的50条消息，也不会再发给它了，因为它是不可接收的状态了。即此时这100条消息还未实现对应功能便被丢失了！

2、解决方案

为了保证消息能可靠的到达消费者并处理，RabbitMQ引入了消息应答机制（message acknowledgement）——**消费者在接收并且处理该消息之后，告诉 rabbitmq 它已经处理了，rabbitmq 可以把该消息删除了。**

如果某个消费者处理时异常结束没有发送应答，RabbitMQ就会认为这条消息没被处理，然后交给另外一个消费者。这样就可以保证即使消费者挂掉也不会丢失消息数据



### 自动应答

入门示例中消费者采用的是自动应答——即消息发送后就被认为发送成功。

```java
boolean autoAck = true;
channel.basicConsume(QUEUE_NAME, autoAck, consumer);
```

自动应答模式需要在**高吞吐量和数据传输安全性方面做权衡**，

- 自动应答没有对传递消息的数量做限制，可以实现消费者接收过载的消息
- 但是有可能会使得消费者端产生消息的积压，导致内存耗尽，消费者进程被系统杀死
- 而且在消息接收处理完之前，消费者出现问题，那么消息就会丢失

所以自动应答，应该是在**消费者可以高效并以 某种速率能够处理这些消息的情况下使用**



### 手动应答

手动应答即关闭自动应答，在回调逻辑中进行手动处理应答

```java
boolean autoAck = false; // 关闭了自动应答
channel.basicConsume(QUEUE_NAME, autoAck, consumer);
```

手动应答有几个实现方法：

- `Channel.basicAck`：用于消息的肯定确认，表示已接收并处理该消息了，MQ可以删除它了
- `Channel.basicNack` ：用于消息的否定确认
- `Channel.basicReject`：用于消息的否定确认，比`basicNack`少一个参数，如果队列未配置死信队列则直接丢弃，有配置则发送到对应死信队列中



#### 确认应答

1、编写代码

生产者代码保持入门DEMO不动，调整消费者的消费成功回调逻辑即可

这里是`AckConsumer1`的处理，`AckConsumer2`只需要调整延时1秒即可，模拟不同业务的处理时间

```java
public class AckConsumer1 {

    private static final String QUEUE_NAME = "ack_queue";

    public static void main(String[] args) throws Exception {
        Channel channel = RabbitMQUtils.getChannel();

        // 消费回调逻辑
        DeliverCallback deliverCallback = (consumerTag, delivery) -> {
            System.out.println("开始消费");
            try {
                System.out.println("模拟实际业务操作，耗时20秒");
                TimeUnit.SECONDS.sleep(20);
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
            System.out.println("接收到消息：" + new String(delivery.getBody()));

            /*  手动应答
             *  参数一：消息标记tag
             *  参数二：是否批量消费消息(true：应答队列中的所有消息 | false：应答接收到的消息)
             */
            channel.basicAck(delivery.getEnvelope().getDeliveryTag(), false);
        };
        CancelCallback cancelCallback = (consumerTag) -> {
            System.out.println(consumerTag + "--->消费者取消了消费接口");
        };

        System.out.println("Work02   等待消费消息........");
        channel.basicConsume(QUEUE_NAME, false, deliverCallback, cancelCallback);
    }
}
```

2、测试

- 消费者发送了4条消息，按照默认的轮询逻辑，text1、text3会被`AckConsumer1`消费，text2、text4会被`AckConsumer2`消费
- 其中`AckConsumer1`处理并应答的时间较长，中途挂掉了后，未处理的text3消息会重新入队被`AckConsumer2`消费

<img src="https://cdn.nlark.com/yuque/0/2022/png/23183050/1657004590812-b7e6d6e2-f9f2-4fc5-9e45-c0ae4f77db82.png" style="zoom:80%;" />

通过管理面板也可以看到队列中消息的状态

<img src="https://cdn.nlark.com/yuque/0/2022/png/23183050/1657004959127-88d3b238-9175-424d-a2dd-aa7e76762332.png" alt="img" style="zoom:80%;" />

#### 否定应答

否定应答代码与确认应答类似，只是调用方法由`basicAck`变成`basicNack`或者`basicReject`

```java
/*消费者成功消费回调逻辑*/
DeliverCallback deliverCallback = (consumerTag, message) -> {

   System.out.println("消费者A对消息进行消费!");
   try {
     	TimeUnit.SECONDS.sleep(1);  //模拟实际业务操作
   } catch (InterruptedException e) {
       	e.printStackTrace();
   }
   System.out.println("消费者A接收到的信息为:"+new String(message.getBody()));

   /*
    * 参数一：  消息标记tag
    * 参数二：  是否批量消费消息（true为应答该队列中所有的消息，false为只应答接收到的消息）
    * 参数三：  是否重回队列
    * */
    channel.basicNack(message.getEnvelope().getDeliveryTag(),false, false);  //拒绝消息应答方法1

   /*
    * 参数一：  消息标记tag
    * 参数二：  是否重回队列
    * */
    channel.basicReject(message.getEnvelope().getDeliveryTag(),false);       //拒绝消息应答方法2

};
```

## 持久化

持久化分为三个部分：交换器持久化、队列持久化、消息持久化

其中如果交换器不设置持久化，mq重启后并不会丢失消息，丢失的是该交换器的元数据，只是之后不能将消息发送到该交换机了，对于常用的交换机建议将其持久化。交换器的持久化在声明方法`exchangeDeclare`中设置durable参数为true即可

上面的消息应答，作用是避免消费者出现事故时消息丢失，而如果要避免RabbitMQ出现事故导致的消息丢失，则需要**将队列和消息标记为持久化的**

### 队列持久化

之前声明队列的第二个参数durable默认都是false，即非持久化的，rabbitmq如果重启就会删改该队列，将参数设置为true后可以保证队列不被删除

```java
//让队列持久化
boolean durable = true;
//声明队列
channel.queueDeclare(TASK_QUEUE_NAME, durable, false, false, null);
```

在生产者声明队列时设置持久化参数后，可以在管理面板中查看

<img src="https://cdn.nlark.com/yuque/0/2022/png/23183050/1657005848793-65f41b46-3f42-4fc8-8bf7-e900da2189c6.png" alt="img" style="zoom:80%;" />

【注】如果之前创建队列`dur_queue`非持久化，再创建持久化，会报错参数不等价，反之亦然

<img src="https://cdn.nlark.com/yuque/0/2022/png/23183050/1657006026388-328c4e4c-9129-4546-8496-05a72c76fd6b.png" alt="img" style="zoom:80%;" />

### 消息持久化

队列持久化只能保证rabbitmq下线时不会删除队列，但是队列中的消息如果要不丢失，也需要开启持久化！通过生产者发布消息时第三个参数`BasicProperties`添加`MessageProperties.PERSISTENT_TEXT_PLAIN`来实现

可以将所有消息都设置持久化，但是会影响RabbitMQ性能，因为磁盘的读写速度远慢于内存读写！对于可靠性不高的消息可以不采取持久化。对于消息持久化的选择需要综合可靠性和吞吐量

```java
//basicProperties设置为PERSISTENT_TEXT_PLAIN：以text/plain形式将消息持久化到磁盘中
channel.basicPublish("", QUEUE_NAME, MessageProperties.PERSISTENT_TEXT_PLAIN, msg.getBytes());
```



将队列、消息都设置为持久化后，就能百分百保证消息不丢失了吗？当然是不行的！

1. 如果消费者设置自动应答，应答后没处理就宕机了，那应答的消息肯定就丢失了。这一部分可以通过手动应答处理
2. RabbitMQ并不会每次遇到一条持久化的消息都（调用内核的fsync）进行同步存盘操作，而是会先保存到操作系统的缓存中再存入磁盘，这个时间间隔很短但是存在！如果在这个间隔内发生宕机还是会丢失消息

因此队列+消息持久化设置持久性保证不强，只能用于一些简单场景，可以采用的参考方案是**MQ集群+发布确认+消息缓存Redis(AOF备份)**来保证消息不丢失



## 消息优先级

消息队列默认是先进先出的，消费顺序也是如此，如果**需要使后面的某些特定消息先进行消费，需要对队列和消息设置优先级**

设置了优先级的队列和消息，会在队列中排序。没有设置优先级的消息依旧按照进入队列的顺序消费，消费者需要在消息进入队列排序完成后消费才能体现优先级。优先级范围为 0~255，值越高优先级越高，且消息优先级不能超过队列优先级

1、生产者

```java
public class PriorityProducer {
    public static final String EXCHANGE_NAME = "FanoutExchange"; //交换机名称

    public static void main(String[] args) throws Exception {
        final Channel channel = RabbitMQUtils.getChannel();
        channel.exchangeDeclare(EXCHANGE_NAME, BuiltinExchangeType.FANOUT);

        // 对队列设置优先级 范围在0-255之间
        HashMap<String, Object> map = new HashMap<>(1);
        map.put("x-max-priority", 10);
        channel.queueDeclare("PriorityQueue", false, false, false, map);
        channel.queueBind("PriorityQueue", EXCHANGE_NAME, "", null);

        for (int i = 0; i < 10; i++) {
            String msg = "INFO_" + i;
            if (i % 3 == 0) {
                final AMQP.BasicProperties properties = new AMQP.BasicProperties().builder().priority(5).build();
                channel.basicPublish(EXCHANGE_NAME, "", properties, msg.getBytes());
            } else {
                channel.basicPublish(EXCHANGE_NAME, "", null, msg.getBytes());
            }
        }
        System.out.println("-----消息发送完毕-----");
    }
}
```

2、消费者

```java
public class PriorityConsumer {
    public static final String QUEUE_NAME = "PriorityQueue"; //交换机名称

    public static void main(String[] args) throws Exception {
        Channel channel = RabbitMQUtils.getChannel();

        DeliverCallback deliverCallback = (consumerTag, msg) -> {
            System.out.println("接收到消息：" + new String(msg.getBody()));
            channel.basicAck(msg.getEnvelope().getDeliveryTag(), false);
        };
        channel.basicConsume(QUEUE_NAME, false, deliverCallback, consumer -> {});
    }
}
```

可以看到对3取余为0的消息`0、3、6、9`被提前消费了

<img src="https://cdn.nlark.com/yuque/0/2022/png/23183050/1657789513216-c636aa2d-349b-4d2b-ac3e-b89217a51ef8.png" alt="img" style="zoom:80%;" />