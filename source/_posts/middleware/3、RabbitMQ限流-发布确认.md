---
title: 3、RabbitMQ限流&发布确认
tags: RabbitMQ
categories: 消息队列
abbrlink: f2906e60
date: 2023-05-11 10:21:31
---
## 消息分发策略

默认的消息分发策略是**轮询**，参照上面的消息应答可以看出会有一定问题——消息处理慢的 `AckConsumer1` 和消息处理快的 `AckConsumer2` 分配了同等数量的消息，导致2早就结束空闲了，而1还有好几条消息没开始处理！因此看似公平的轮询分发其实是并不公平的

因此需要引入**公平分发策略（Fair Dispatch）**——在消费者中引入设置了 `prefetchCount=1` 参数的 `basicQos` 方法，它告诉了rabbitmq不要一次向该消费者传递过多消息

尚硅谷和评论区的两份笔记，都将这个叫做不公平分发，但是我在官方tutorial上看到的介绍时Fair Dispath

<img referrerpolicy="no-referrer" src="https://cdn.nlark.com/yuque/0/2022/png/23183050/1657007480908-b0ed3fd5-57f1-4dfc-b21c-d93e8f3a0352.png" alt="img" style="zoom:80%;" />

通过`fair dispatch`和手动应答来控制消费者每次处理的消息数

```java
// fiar dispatch
int prefetchCount = 1;
channel.basicQos(prefetchCount);
// 手动应答
boolean autoAck = false;
channel.basicConsume(TASK_QUEUE_NAME, autoAck, deliverCallback, cancelCallback);
```

参数`prefecthCount`表示该消费者**能积压在信道上的预处理消息数最大值**：

- 消费者通过`basicQos`方法设置了预取值后，对应的信道上最多只能积压`prefetchCount`条消息
- 达到对应数量后，RabbitMQ就不会向该信道传递消息
- 如果所有队列都达到积压上限，消息就会积压在队列中撑满队列，这个时候就只能添加新的消费者或者改变存储策略
- 通常增加预取值可以提高向消费者传递消息的速度，但是无限制的自动应答或者过大值会导致消费者节点内存消耗过大，因此合理的预取值需要反复试验，通常100-300之间

<img referrerpolicy="no-referrer" src="https://cdn.nlark.com/yuque/0/2022/png/23183050/1657008320923-af5cded8-cef3-42a3-8e36-7f49aabe939a.png" alt="img" style="zoom:80%;" />



## 消费端限流

消费者宕机过程中MQ上囤积大量消息，重启消费者服务后消息瞬间涌入，造成消息消费服务压力剧增，因此大流量下消息消费端需要进行限流设置

在非自动确认消息的前提下，如果一定数量的消息（基于Consumer和Channel设置QOS的值）没有被确认，将不进行消费新的消息

1、生产者使用线程池模拟大量消息的发送

```java
public class LimitProducer {

    public static final String QUEUE_NAME = "slowQueue";
    public static final String EXCHANGE_NAME = "fastExchange";

    public static void main(String[] args) throws Exception {
        Channel channel = RabbitMQUtils.getChannel();
        channel.queueDeclare(QUEUE_NAME, true, false, false, null);
        channel.exchangeDeclare(EXCHANGE_NAME, BuiltinExchangeType.DIRECT);
        channel.queueBind(QUEUE_NAME, EXCHANGE_NAME, "limit");

        // 使用线程池模拟短时间大量消息发送
        ThreadPoolExecutor threadPool = new ThreadPoolExecutor(5, 10, 100, TimeUnit.SECONDS, new LinkedBlockingDeque<>());
        for (int i = 0; i < 2000; i++) {
            String msg = Thread.currentThread().getName()+"_"+i;
            try {
                channel.basicPublish(EXCHANGE_NAME, "limit", null, msg.getBytes());
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
        threadPool.shutdown();
        while (!threadPool.isTerminated()) {

        }
        System.out.println("所有消息发送完成");
    }
}
```

2、消费者

```java
public class LimitConsumer {

    public static final String QUEUE_NAME = "slowQueue";

    public static void main(String[] args) throws Exception {
        Channel channel = RabbitMQUtils.getChannel();
        channel.queueDeclare(QUEUE_NAME, true, false, false, null);

        // 消费成功回调
        DeliverCallback deliverCallback = (consumerTag, delivery) -> {
            try {
                TimeUnit.SECONDS.sleep(1); // 模拟业务操作
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
            System.out.println("收到的消息为：" + new String(delivery.getBody()));
            //channel.basicAck(delivery.getEnvelope().getDeliveryTag(), false);
        };
        // 消费取消回调
        CancelCallback cancelCallback = cancel -> {
            System.out.println("取消消费");
        };

        /*
         * 参数一：单条消息大小限制，一般为0不限制
         * 参数二：一次性消费的消息数量
         * 参数三：限流设置应用于channel(true)还是consumer(false)
         */
        //channel.basicQos(0, 10, false);
        channel.basicConsume(QUEUE_NAME,true,deliverCallback,cancelCallback);
    }
}
```

可以看到设置了`Qos`后消费10条消息就结束了，由于将应答注释了所以不会继续消费

<img referrerpolicy="no-referrer" src="https://cdn.nlark.com/yuque/0/2022/png/23183050/1657788530091-d93bc039-cf19-4333-8675-0aebef171f60.png" alt="img" style="zoom:80%;" />

放开应答的注释，可以看到持续消费，每次`Unacked`的都是10条，速率也是每秒一条

<img referrerpolicy="no-referrer" src="https://cdn.nlark.com/yuque/0/2022/png/23183050/1657788655762-690e9fe9-6818-4f97-bf62-8093423d5b2a.png" alt="img" style="zoom:80%;" />



## 发布确认

上面是通过持久化来保障在服务器崩溃时，消息不会丢失。但是生产者发布消息后，消息是否能正确到达Broker服务器呢？默认情况下消息发出后是不会有返回信息的，所以需要引入发布确认机制

消息被投递到匹配的队列后，Broker会返回一个确认信息给生产者，这个操作叫做**消息确认发布，**它有两种方式：

1. 通过事务机制实现：设置 channel 为 transaction 模式，这是 AMQP协议层面提供的解决方案
2. 通过发送方确认实现：设置 channel 为 confirm 模式，这是 RabbitMQ 提供的解决方案



### 事务机制

RabbitMQ 客户端中与事务机制有关的方法有三个

- `channel.txSelect`：用于将当前 channel 设置成 transaction 模式
- `channel.txCommit`：用于提交事务
- `channel.txRollback`：用于回滚事务

`channel.txSelect`将当前信道开启为事务模式后，生产者就可以发布消息给Broker服务器了，如果`channel.txCommit`提交成功了，则消息一定到达了broker了，如果在 `channel.txCommit`执行之前 broker 异常崩溃或者由于其他原因抛出异常，这个时候我们便可以捕获异常通过`channel.txRollback`回滚事务。如图是正常提交事务的，对于使用回滚需要通过`try/catch`捕获发生的异常，Publish后也不是正常的Commit，而是异常的Rollback

<img referrerpolicy="no-referrer" src="https://cdn.nlark.com/yuque/0/2022/png/23183050/1657087189068-c913b1f3-55a9-487d-bab0-0508e20f83fc.png" alt="img" style="zoom:80%;" />

事务确实能够解决 producer 与 broker 之间消息确认的问题，只有消息成功被 broker 接收，事务提交才能成功，否则我们便可以在捕获异常进行事务回滚操作，同时进行消息重发，但是使用事务机制的话会降低RabbitMQ的性能。RabbitMQ提供了改进方案，即发送方确认（Confirm确认）

### confirm模式

#### 发布确认逻辑

生产者将信道设置成 confirm 模式，一旦信道进入confirm模式，所有在该信道上面发布的消息都将会被指派一个唯一的ID(从 1 开始)，一旦消息被投递到所有匹配的队列之后，broker 就会发送一个确认给生产者(包含消息的唯一 ID)，这就使得生产者知道消息已经正确到达目的队列了，如果消息和队列是可持久化的，那么确认消息会在将消息写入磁盘之后发出，broker回传给生产者的确认消息中的`delivery-tag`包含了确认消息的序列号，此外broker也可以设置`basic.ack`的 multiple参数，表示到这个序号之前的所有消息都已经得到了处理。

<img referrerpolicy="no-referrer" src="https://cdn.nlark.com/yuque/0/2022/png/23183050/1657087502262-4d4a734b-ef1f-4b85-83b9-3cf1b0e60a33.png" alt="img" style="zoom:80%;" />

confirm 模式最大的好处在于他是异步的，一旦发布一条消息，生产者应用程序就可以在等信道返回确认的同时继续发送下一条消息，当消息最终得到确认之后，生产者应用便可以通过回调方法来处理该确认消息，如果RabbitMQ 因为自身内部错误导致消息丢失，就会发送一条 nack 消息， 生产者应用程序同样可以在回调方法中处理该 nack 消息。

发布确认默认是没有开启的，通过在信道上设置开启

```java
//开启发布确认
channel.confirmSelect();
```

#### 单个确认发布

单个发布确认是一种简单的发布确认方式：生产者发布一个消息之后只有等收到确认才会发送下一个，它是一种**同步确认发布**的方式。`waitForConfirmsOrDie(long)`这个方法只有在消息被确认的时候才返回，如果在指定时间范围内这个消息没有被确认那么它将抛出异常。

这种方式最大的缺点是发布速度很慢，效率低，每秒只能不超过数百条数据

```java
public static void singleConfirm() throws Exception {
    Channel channel = RabbitMQUtils.getChannel();
    channel.queueDeclare(QUEUE_NAME, false, false, false, null);
    // 开启发布确认
    channel.confirmSelect();

    long start = System.currentTimeMillis();
    for (int i = 0; i < MSG_COUNT; i++) {
        String msg = "消息_" + i;
        System.out.println("生产了：" + msg);
        channel.basicPublish("", QUEUE_NAME, null, msg.getBytes());
        // 服务端返回 false 或超时时间内未返回，生产者可以消息重发
        boolean flag = channel.waitForConfirms();
        if (flag) {
            System.out.println(msg + "已发送到队列中");
        }
    }
    long end = System.currentTimeMillis();
    System.out.println("发布了 " + MSG_COUNT + " 个单独确认消息，耗时：" + (end - start) + " ms");
}
```

可以看到每次都是`waitForConfirms`之后才发送下一条：

<img referrerpolicy="no-referrer" src="https://cdn.nlark.com/yuque/0/2022/png/23183050/1657075515953-df32b9f9-2f44-4a36-a2ab-5f4bd2959ccd.png" alt="img" style="zoom:80%;" />

#### 批量确认发布

批量确认模式也是一种**同步确认发布**的方式，先发布一批消息再一起确认，这样可以提高吞吐量，不过如果如果出现问题不能定位到具体的消息上

```java
public static void batchConfirm() throws Exception {
    Channel channel = RabbitMQUtils.getChannel();
    channel.queueDeclare(QUEUE_NAME, false, false, false, null);
    channel.confirmSelect();
    // 批量确认size
    int batchSize = 100;
    // 待确认的消息个数
    int size4Confirm = 0;

    long start = System.currentTimeMillis();
    for (int i = 0; i < MSG_COUNT; i++) {
        String msg = "消息_" + i;
        channel.basicPublish("", QUEUE_NAME, null, msg.getBytes());
        size4Confirm++;
        if (size4Confirm == batchSize) {
            channel.waitForConfirms();
            size4Confirm = 0;
            System.out.println("批量确认，最新的消息是：" + msg);
        }
    }
    //为了确保还有剩余没有确认消息 再次确认
    if (size4Confirm > 0) {
        System.out.println("处理剩余的未确认消息");
        channel.waitForConfirms();
    }
    long end = System.currentTimeMillis();
    System.out.println("发布了 " + MSG_COUNT + " 个批量确认消息，耗时：" + (end - start) + " ms");
}
```

可以看到每一百个消息进行一次确认，当前的100个确认之前不会发送下一批，所以每批消息的确认序号都是固定增加的：

<img referrerpolicy="no-referrer" src="https://cdn.nlark.com/yuque/0/2022/png/23183050/1657075878906-402f0f24-0303-4211-b687-f85932cbe6ef.png" alt="img" style="zoom:80%;" />

#### 异步确认发布

因为异步非阻塞的特性，异步确认的可靠性和效率都很高，它是通过回调函数来实现消息的可靠传递的



<img referrerpolicy="no-referrer" src="https://cdn.nlark.com/yuque/0/2022/png/23183050/1657075982958-f0c9af4a-80b5-4d00-8979-c61b6dc8ff9e.png" alt="img" style="zoom:80%;" />



```java
public static void asyConfirm1() throws Exception {
    Channel channel = RabbitMQUtils.getChannel();
    channel.queueDeclare(QUEUE_NAME, false, false, false, null);
    channel.confirmSelect();

    /*
         * 消息确认成功的回调函数
         * 参数一：消息的标记
         * 参数二：是否批量确认
         */
    ConfirmCallback successCall = (deliveryTag, multiple) -> {
        System.out.println("确认的消息：" + deliveryTag);
    };

    /*
         * 消息确认失败的回调函数
         * 参数一：消息的标记
         * 参数二：是否批量确认
         */
    ConfirmCallback failedCall = (deliveryTag, multiple) -> {
        System.out.println("未能确认的消息：" + deliveryTag);
    };

    /*
         * 设置异步确认模式的消息确认监听器
         * 参数一：成功的回调
         * 参数二：失败的回调
         */
    channel.addConfirmListener(successCall, failedCall);

    long start = System.currentTimeMillis();
    for (int i = 0; i < MSG_COUNT; i++) {
        String msg = "消息_" + i;
        channel.basicPublish("", QUEUE_NAME, null, msg.getBytes());
    }
    long end = System.currentTimeMillis();
    System.out.println("发布了 " + MSG_COUNT + " 个异步确认消息，耗时：" + (end - start) + " ms");
}
```

可以看到消息的确认是异步进行的，并没有特定的串行顺序：

<img referrerpolicy="no-referrer" src="https://cdn.nlark.com/yuque/0/2022/png/23183050/1657093167844-de63969a-ebb5-47a2-9555-0c09c7563351.png" alt="img" style="zoom:80%;" />

#### 如何处理未被确认的消息？

最好的解决方案就是把未确认的消息放到一个基于内存的能被发布线程访问的队列，比如说用 ConcurrentLinkedQueue 这个队列在 confirm callbacks 与发布线程之间进行消息的传递。

1. 通过一个并发队列，将所有要发送的消息加到队列中
2. 在发布确认的回调函数中删除已确认的消息，剩下的就是未确认的消息了
3. 在失败的回调函数中处理未确认的消息，比如重发或者打印出来

```java
    public static void asyConfirm2() throws Exception {
        Channel channel = RabbitMQUtils.getChannel();
        channel.queueDeclare(QUEUE_NAME, false, false, false, null);
        channel.confirmSelect();

        /*
         * 用于存储消息的线程安全队列
         * concurrentSkipListMap比concurrentHashMap有更好的并发支持，是一个有序map容器，原理为跳表
         */
        ConcurrentSkipListMap<Long, Object> infoMap = new ConcurrentSkipListMap<>();

        /*
         * 消息确认成功的回调函数：删除已确认的消息
         */
        ConfirmCallback successCall = (deliveryTag, multiple) -> {
            if (multiple) {
                // 从key=null到截止key，作为指定key合集
                ConcurrentNavigableMap<Long, Object> confirmed = infoMap.headMap(deliveryTag);
                confirmed.clear();
            } else {
                infoMap.remove(deliveryTag);
            }
            System.out.println("确认的消息：" + deliveryTag);
        };

        /*
         * 消息确认失败的回调函数
         */
        ConfirmCallback failedCall = (deliveryTag, multiple) -> {
            String info = String.valueOf(infoMap.get(deliveryTag));
            System.out.println("未能确认的消息：" + deliveryTag + " ，消息是：" + info);
        };

        /*
         * 设置异步确认模式的消息确认监听器
         */
        channel.addConfirmListener(successCall, failedCall);

        long start = System.currentTimeMillis();
        for (int i = 0; i < MSG_COUNT; i++) {
            String msg = "消息_" + i;
            channel.basicPublish("", QUEUE_NAME, null, msg.getBytes());
            // 记录所有要打的消息，key为下一次发布信息的序号
            infoMap.putIfAbsent(channel.getNextPublishSeqNo(), msg);
        }
        long end = System.currentTimeMillis();
        System.out.println("发布了 " + MSG_COUNT + " 个异步确认消息，耗时：" + (end - start) + " ms");
    }
```

<img referrerpolicy="no-referrer" src="https://cdn.nlark.com/yuque/0/2022/png/23183050/1657093787471-61fa1944-eba6-4982-8b07-30f6fe950706.png" alt="img" style="zoom:80%;" />