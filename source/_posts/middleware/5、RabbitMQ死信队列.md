---
title: 5、RabbitMQ死信队列
tags: RabbitMQ
categories: 消息队列
abbrlink: 9b199b28
date: 2023-05-11 10:22:45
---
## 过期时间TTL

先介绍一下TTL概念

TTL即`Time to Live`的简称，表示过期时间。RabbitMQ可以对消息和队列设置对应TTL

### 0、消息TTL设置

- 通过队列属性设置，**队列中所有消息都有相同的过期时间**。
- 通过消息属性设置，**可以实现每个消息都有自己的过期时间**。

二者可以同时使用，此时则以TTL数值较小的为准

### 1、队列上设置

在定义队列时，添加属性`x-message-ttl`，单位是毫秒，**这里设置的并不是队列的TTL，而是该队列中所有消息的TTL**

```java
final HashMap<String, Object> args = new HashMap<>();
args.put("x-message-ttl", 6000);
channel.queueDeclare(QUEUE_NAME, true, false, false, args);
```

TTL取值的区分

- 不设置TTL：该消息不会过期
- 值=0：表示除非此时可以直接将消息投递到消费者，不然就丢弃
- 值>0：表示将在到值对应时间后过期

### 2、消息上设置

针对单独消息设置TTL是在`channel.BasicPublish`方法中加入`expiration`参数，单位为毫秒

```java
final AMQP.BasicProperties.Builder builder = new AMQP.BasicProperties().builder();
builder.deliveryMode(2);//设置消息持久化
builder.expiration("5000");//设置过期时间5000毫秒
final AMQP.BasicProperties properties = builder.build();
channel.basicPublish(EXCHANGE_NAME, ROUTING_KEY, properties, msg.getBytes());
```



### 3、对比

1. 队列设置：时间从消息入队开始计算，一旦超过了队列的超时时间配置，消息会自动清除。
2. 消息设置：消息即使过期也不一定会被马上丢弃，**因为每条消息是否过期是在即将投递到消费者之前判定的**（ 如果当前队列有严重的消息积压情况，已过期的消息依旧会被积压在队列中，如果队列配置了消息积压上限，将导致后续应当正常消费的消息全部进入死信队列 ）

队列设置中，队列已过期的消息肯定在队列头部（过期时间一致的前提下，先进先出），RabbitMQ只需要定期从队列头部开始扫描是否有已过期的消息即可。

消息设置中，每个消息的过期时间不同，如果要删除过期消息就必须扫描整个队列，所以还不如等到消息即将被消费时再判定是否过期，如果过期就删除即可

## 死信队列DLX

### 概念

死信（Dead Message）：**由于某些特定原因导致无法被消费的消息**。

按照正常流程消息从producer到broker再到queue，consumer从queue中取出消息消费，由于特定原因queue中的消息无法被消费，这类消费异常的消息就会保存在死信队列中，来避免消息的丢失

场景：**用户在商城下单后，超过半小时未付款，该订单自动取消**

DLX（Dead-Letter-Exchange）可以成为死信交换器，或死信邮箱。当一个消息成为死信之后，可以被重新发送到另一个交换器即DLX中，而绑定了DLX的队列即为死信队列

### 原因

消息变成死信，一般有以下三种原因

- TTL过期
- 队列积压的消息达到最大长度，后续消息无法添加
- 消息被拒，消费者调用`basic.reject`或`basic.nack`并且`requeue=false`

DLX 是一个普通的交换器，可以在任何队列上设置，当死信消息出现时，RabbitMQ 自动将这个消息重新发布到设置的 DLX上，从而被路由到另一个队列，即 **死信队列**

## 死信DEMO

死信队列架构图

<img src="https://cdn.nlark.com/yuque/0/2022/png/23183050/1657438155832-0a0a8239-7d68-4412-9e9c-cf6437f2ae7e.png" alt="img" style="zoom:80%;" />



- 定义一个DLX（其实就是普通交换器，用来绑定正常的交换器），为该DLX绑定队列，用于接收死信消息
- 定义正常的交换器，并通过属性设置它所对应的DLX和路由键



### 死信之TTL

生产者代码

```java
public class TTLProducer {

    public static final String EXCHANGE_NAME = "normalExchange";
    public static final String ROUTING_KEY = "ZhangSan";

    public static void main(String[] args) throws Exception {
        Channel channel = RabbitMQUtils.getChannel();
        channel.exchangeDeclare(EXCHANGE_NAME, BuiltinExchangeType.DIRECT);

        // 设置消息的TTL为10秒
        AMQP.BasicProperties properties = new AMQP.BasicProperties().builder().expiration("10000").build();
        // 演示队列个数限制
        for (int i = 1; i < 11; i++) {
            String msg = "INFO_" + i;
            channel.basicPublish(EXCHANGE_NAME, ROUTING_KEY, null, msg.getBytes());
            System.out.println(msg + "发送完成");
        }
    }
}
```

TTL消费者1

```java
public class TTLConsumer1 {

    public static final String EXCHANGE_NORMAL = "normalExchange";
    public static final String EXCHANGE_DEAD = "deadExchange";

    public static final String QUEUE_NORMAL = "normalQueue";
    public static final String QUEUE_DEAD = "deadQueue";

    public static final String ROUTING_KEY1 = "ZhangSan"; //普通队列routing-key
    public static final String ROUTING_KEY2 = "LiSi";     //死信队列routing-key


    public static void main(String[] args) throws Exception {
        Channel channel = RabbitMQUtils.getChannel();
        // 声明普通和死信交换机 normal-exchange在生产者处已经声明
        channel.exchangeDeclare(EXCHANGE_NORMAL, BuiltinExchangeType.DIRECT);
        channel.exchangeDeclare(EXCHANGE_DEAD, BuiltinExchangeType.DIRECT);

        /*
         * 通过额外参数指定在什么条件下讲消息转发到死信队列，其中key值是rabbitmq固定的
         * value1：TTL时间，一般由生产者指定
         * value2：死信交换机名称
         * value3：死信交换机的routing-key
         * value4：指定队列能够积压消息的数量，超出该范围的消息将进入死信队列
         */
        HashMap<String, Object> params = new HashMap<>();
        //params.put("x-dead-letter-ttl", 10000);
        params.put("x-dead-letter-exchange", EXCHANGE_DEAD);
        params.put("x-dead-letter-routing-key", ROUTING_KEY2);
        //params.put("x-max-length", 6);

        channel.queueDelete(QUEUE_NORMAL); //变更queueDeclare的params参数后，原队列要删除
        // 声明绑定正常队列
        channel.queueDeclare(QUEUE_NORMAL, false, false, false, params);
        channel.queueBind(QUEUE_NORMAL, EXCHANGE_NORMAL, ROUTING_KEY1);
        // 声明绑定死信队列
        channel.queueDeclare(QUEUE_DEAD, false, false, false, null);
        channel.queueBind(QUEUE_DEAD, EXCHANGE_DEAD, ROUTING_KEY2);

        System.out.println("----------等待接收消息----------");
        DeliverCallback deliverCallback = (consumerTag, delivery) -> {
            String msg = new String(delivery.getBody());
            System.out.println("Consumer01 接收到消息 " + message);
        };
        channel.basicConsume(QUEUE_NORMAL, false, deliverCallback, consumer -> {});
    }

}
```

先启动消费者1再关闭，模拟消费者接收不到消息，再启动生产者

<img src="https://cdn.nlark.com/yuque/0/2022/png/23183050/1657784417355-1fe19cd7-61ee-4e83-afa6-f29aa73671a0.png" alt="img" style="zoom:80%;" />

等到设置的过期时间10s到达后，消息就会送达到死信队列

<img src="https://cdn.nlark.com/yuque/0/2022/png/23183050/1657784627848-f85d4922-d27c-46f0-abc7-d3e6ee53fb71.png" alt="img" style="zoom:80%;" />

以上操作完成后，启动消费者2，消费死信队列中的消息

```java
public class TTLConsumer2 {

    public static final String EXCHANGE_DEAD = "deadExchange";
    public static final String QUEUE_DEAD = "deadQueue";
    public static final String ROUTING_KEY2 = "LiSi";     //死信队列routing-key

    public static void main(String[] args) throws Exception {
        Channel channel = RabbitMQUtils.getChannel();
        channel.exchangeDeclare(EXCHANGE_DEAD, BuiltinExchangeType.DIRECT);
        channel.queueDeclare(QUEUE_DEAD, false, false, false, null);
        channel.queueBind(QUEUE_DEAD, EXCHANGE_DEAD, ROUTING_KEY2);

        System.out.println("----------等待接收消息----------");
        DeliverCallback deliverCallback = (consumerTag, delivery) -> {
            String msg = new String(delivery.getBody());
            System.out.println("TTLConsumer2接收到----->" + msg);
        };
        channel.basicConsume(QUEUE_DEAD, true, deliverCallback, consumer -> {
        });
    }
}
```

<img src="https://cdn.nlark.com/yuque/0/2022/png/23183050/1657784722560-26360135-54d9-4b23-b401-3d52642e309f.png" alt="img" style="zoom:80%;" />



### 死信之最大长度

1、将生产者代码设置TTL的部分注释

<img src="https://cdn.nlark.com/yuque/0/2022/png/23183050/1657785108809-255e6577-7f9f-4ae3-a044-91480dd085f3.png" alt="img" style="zoom: 80%;" />

2、修改消费者1代码，设置队列接收消息的长度

<img src="https://cdn.nlark.com/yuque/0/2022/png/23183050/1657785167054-e9f826b1-8b1b-457c-97b1-4e59cae1ea68.png" alt="img" style="zoom:80%;" />

3、和上面示例类似，先启动消费者1再关闭，模拟正常队列无法接收消息；再发送消费者，查看消息是否到达了死信队列

<img src="https://cdn.nlark.com/yuque/0/2022/png/23183050/1657786705553-2f7fecbd-59d2-4e32-823b-4cd8f1925a8c.png" alt="img" style="zoom:80%;" />

4、启动消费者2消费死信队列中的消息即可

<img src="https://cdn.nlark.com/yuque/0/2022/png/23183050/1657786766060-55d7b605-9d81-4ab1-8e65-d6b54cabc5c0.png" alt="img" style="zoom:80%;" />



### 死信之消息拒绝

1、生产者不变，消费者1将队列最大长度限制注释，将`DeliverCallback`回调重写

```java
DeliverCallback deliverCallback = (consumerTag, delivery) -> {
    String msg = new String(delivery.getBody());
    if (msg.equals("INFO_5")) {
        System.out.println("TTLConsumer1拒收消息----->" + msg);
        /*
         * requeue设置为false表示拒绝重新入队
         * 该队列如果配置了死信队列，交换机就会将消息发送到死信队列，否则会丢弃
         */
        channel.basicReject(delivery.getEnvelope().getDeliveryTag(), false);
    } else {
        System.out.println("TTLConsumer1接收到----->" + msg);
        channel.basicAck(delivery.getEnvelope().getDeliveryTag(),false);
    }
};
channel.basicConsume(QUEUE_NORMAL, false, deliverCallback, consumer -> {
});
```

2、启动生产者后，发送10条消息。再启动消费者1和消费者2，可以查看到消费者1拒收了`INFO_5`，而消费者2消费了`INFO_5`

<img src="https://cdn.nlark.com/yuque/0/2022/png/23183050/1657787046112-42c55314-bdc7-4649-bdb9-2c45b35da533.png" alt="img" style="zoom:80%;" />