---
title: 4、RabbitMQ交换机
tags: RabbitMQ
categories: 消息队列
abbrlink: 72a21c93
date: 2023-05-11 10:22:01
---
## 交换机概念

之前的示例，都是按照`生产者-->消息队列-->消费者`的概念进行的

实际上RabbitMQ消息传递模型的核心思想是：**生产者的消息从来不会直接发送到队列**。事实上，生产者甚至不知道消息会被发到哪个队列

相反，生产者只能将消息发送到交换器。交换器工作内容非常简单：一方面它接收来自生产者的消息，另一方面它将它们推送到队列中。交换器必须确切地知道如何处理它收到的消息。是推送到特定队列还是多个队列亦或是丢弃，而这就由交换机的类型决定。

<img referrerpolicy="no-referrer" src="https://cdn.nlark.com/yuque/0/2022/png/23183050/1657175708664-46a07f76-04f2-440a-96aa-a3a225aa2738.png" alt="img" style="zoom:80%;" />

交换器有几个基本类型：`fanout`、`Direct`、`topic`、`headers`。其中`headers`已经基本弃用了

通常情况下都是生产者发送消息后才会执行消费者操作，因此一般交换机都是由生产者创建，且声明一次即可

### 无名exchange

之前的DEMO好没有明确用过exchange，但是仍能够将消息发到队列中，因为已经指定了默认的交换机。`channel.basicPublish`的第一个参数即为交换机，之前都用空字符串标识：

```java
channel.basicPublish("", QUEUE_NAME, null, msg.getBytes("UTF-8"));
```

默认交换机会隐式地绑定到每个队列上，RoutingKey即为队列名称。默认交换机不能显式绑定或者解绑，也不能删除

<img referrerpolicy="no-referrer" src="https://cdn.nlark.com/yuque/0/2022/png/23183050/1657266583824-e3d7718d-2881-4a80-be0f-548568758561.png" alt="img" style="zoom: 67%;" />

### 临时队列

可以看到上面的`basicPublish`指定了队列名QUEUE_NAME，用于确定消息会发送到哪个队列。

每当我们连接到 Rabbit 时，我们都需要一个全新的空队列，为此我们可以创建一个具有**随机名称的队列**，或者能让服务器为我们选择一个随机队列名称那就更好了。其次一旦我们断开了消费者的连接，队列将被自动删除。

可以通过以下方式创建

```java
String queueName = channel.queueDeclare().getQueue();
```

<img referrerpolicy="no-referrer" src="https://cdn.nlark.com/yuque/0/2022/png/23183050/1657269026760-961d8b83-a75e-4224-9468-3439ea26aa57.png" alt="img" style="zoom:80%;" />

### 绑定Bindings

在最上面的图中，交换机X如何将消息发到指定队列上？对应的两个箭头实际上就是两个`Binding`：它声明了交换机和队列的绑定关系，在绑定时会有一个BindingKey，这样RabbitMQ就知道如何正确将消息路由到指定队列了。

生产者发送代码到交换机时，会提供一个RoutingKey，当RoutingKey和BindingKey相匹配时，消息就会发到对应的队列中了

## Fanout类型

`fanout`类型又称广播类型，它会将消息发送到所有队列上

<img referrerpolicy="no-referrer" src="https://cdn.nlark.com/yuque/0/2022/png/23183050/1657268264623-56b3d342-177f-4d96-b300-225f581f3b82.png" alt="img" style="zoom:80%;" />

为了说明这种模式，我们将构建一个简单的日志DEMO，生产者生产日志，两个消费者一个将日志输出到文件，一个输出到控制台

```java
public class FanoutProducer {

    private static final String EXCHANGE_NAME = "logs";

    public static void main(String[] args) throws Exception {
        Channel channel = RabbitMQUtils.getChannel();
        /*
         * 声明一个exchange
         * 参数一：exchange的名称
         * 参数二：exchange的类型
         */
        channel.exchangeDeclare(EXCHANGE_NAME, BuiltinExchangeType.FANOUT);

        Scanner scanner = new Scanner(System.in);
        while (scanner.hasNext()) {
            String msg = scanner.nextLine();
            channel.basicPublish(EXCHANGE_NAME, "", null, msg.getBytes(StandardCharsets.UTF_8));
            System.out.println("生产者EmitLogs发出消息：" + msg);
        }
    }
}

// 消费者输出日志到文件
public class FanoutConsumer1 {

    private static final String EXCHANGE_NAME = "logs";

    public static void main(String[] args) throws Exception {
        Channel channel = RabbitMQUtils.getChannel();
        channel.exchangeDeclare(EXCHANGE_NAME, BuiltinExchangeType.FANOUT);

        /*
         * 随机生成一个临时队列
         * 当消费者与该队列断开连接时，队列自动删除
         */
        String queueName = channel.queueDeclare().getQueue();
        // 把该临时队列绑定到exchange，其中routingkey(也称之为 binding key)为空字符串
        channel.queueBind(queueName, EXCHANGE_NAME, "");
        System.out.println("等待接收消息。。。。。。。。。。保存到文件");

        DeliverCallback deliverCallback = (consumerTag, delivery) -> {
            String msg = new String(delivery.getBody(), StandardCharsets.UTF_8);
            File file = new File("E:\\data\\rabbitmq.txt");
            FileUtils.writeStringToFile(file, msg, StandardCharsets.UTF_8);
            System.out.println("数据写入文件成功");
        };
        channel.basicConsume(queueName, true, deliverCallback, consumer -> {
        });
    }
}

// 消费者输出日志到控制台
public class FanoutConsumer2 {

    private static final String EXCHANGE_NAME = "logs";

    public static void main(String[] args) throws Exception {
        Channel channel = RabbitMQUtils.getChannel();
        channel.exchangeDeclare(EXCHANGE_NAME, BuiltinExchangeType.FANOUT);

        /*
         * 随机生成一个临时队列
         * 当消费者与该队列断开连接时，队列自动删除
         */
        String queueName = channel.queueDeclare().getQueue();
        // 把该临时队列绑定到exchange，其中routingkey(也称之为 binding key)为空字符串
        channel.queueBind(queueName, EXCHANGE_NAME, "");
        System.out.println("等待接收消息。。。。。。。。。。输出控制台");

        DeliverCallback deliverCallback = (consumerTag, delivery) -> {
            String msg = new String(delivery.getBody(), StandardCharsets.UTF_8);
            System.out.println("接收到的消息：" + msg);
        };
        channel.basicConsume(queueName, true, deliverCallback, consumer -> {
        });
    }
}
```

可以看到消费者1成功将日志写到了指定文件中，而消费者而打印了日志，内容相同

<img referrerpolicy="no-referrer" src="https://cdn.nlark.com/yuque/0/2022/png/23183050/1657268654683-dfd8d446-3946-4994-a620-d02065885fe5.png" alt="img" style="zoom:65%;" />



## Direct类型

相比于fanout类型向所有队列广播消息，有时业务场景需要根据日志的不同级别分别输出，比如warning和error输出到文件中，info就打印到控制台，这时就不能广播消息了，此时可以使用`Direct`类型：它通过对比消息的RoutingKey和队列BindingKey，将消息发送到对应队列中。

<img referrerpolicy="no-referrer" src="https://cdn.nlark.com/yuque/0/2022/png/23183050/1657270482095-66cfc377-1e2f-4483-9f88-a919e129d483.png" alt="img" style="zoom:80%;" />

如图的`direct交换机`绑定到了Q1、Q2，其中Q1的BindingKey是orange，Q2的BindingKey是black和green，即生产者在发送消息是的RoutingKey为orange时会发送到消息Q1、是black或green时会到Q2。加入Q1和Q2用了一样的BindingKey，那么此时的`direct`就和`fanout`效果相同了



代码DEMO如下：生产者创建多个BindingKey，每个BindingKey发送一条消息；消费者1的`queueBind`绑定error、消费者2的`queueBind`绑定info和warning，而没有绑定到任何队列的debug级别消息就丢弃

```java
public class DirectProducer {

    private static final String EXCHANGE_NAME = "direct_logs";

    public static void main(String[] args) throws Exception {
        Channel channel = RabbitMQUtils.getChannel();
        channel.exchangeDeclare(EXCHANGE_NAME, BuiltinExchangeType.DIRECT);

        // 创建多个bindingKey
        HashMap<String, String> keyMap = new HashMap<>();
        keyMap.put("info", "info信息");
        keyMap.put("warning", "warning警告");
        keyMap.put("error", "error错误");
        // debug不设置消费者接收，查看效果是全部丢失
        keyMap.put("debug", "debug调试");


        for (Map.Entry<String, String> keyEntry : keyMap.entrySet()) {
            String key = keyEntry.getKey();
            String value = keyEntry.getValue();
            channel.basicPublish(EXCHANGE_NAME, key, null, value.getBytes(StandardCharsets.UTF_8));
            System.out.println("生产者发送消息：" + value);
        }
    }
}


public class DirectConsumer1 {

    private static final String EXCHANGE_NAME = "direct_logs";

    public static void main(String[] args) throws Exception {
        Channel channel = RabbitMQUtils.getChannel();
        channel.exchangeDeclare(EXCHANGE_NAME, BuiltinExchangeType.DIRECT);

        String queueName = "disk";
        // 队列声明
        channel.queueDeclare(queueName, false, false, false, null);
        // 队列绑定
        channel.queueBind(queueName, EXCHANGE_NAME, "error");
        System.out.println("error等待接收消息。。。");

        // 回调函数
        DeliverCallback deliverCallback = (consumerTag, delivery) -> {
            String msg = new String(delivery.getBody(), StandardCharsets.UTF_8);
            System.out.println("接收绑定键：" + delivery.getEnvelope().getRoutingKey() + ",消息：" + msg);
        };
        channel.basicConsume(queueName, true, deliverCallback, consumer -> {
        });
    }
}

public class DirectConsumer2 {

    private static final String EXCHANGE_NAME = "direct_logs";

    public static void main(String[] args) throws Exception {
        Channel channel = RabbitMQUtils.getChannel();
        channel.exchangeDeclare(EXCHANGE_NAME, BuiltinExchangeType.DIRECT);

        String queueName = "console";
        // 队列声明
        channel.queueDeclare(queueName, false, false, false, null);
        // 队列绑定
        channel.queueBind(queueName, EXCHANGE_NAME, "info");
        channel.queueBind(queueName, EXCHANGE_NAME, "warning");
        System.out.println("info&&warning等待接收消息。。。");

        // 回调函数
        DeliverCallback deliverCallback = (consumerTag, delivery) -> {
            String msg = new String(delivery.getBody(), StandardCharsets.UTF_8);
            System.out.println("接收绑定键：" + delivery.getEnvelope().getRoutingKey() + ",消息：" + msg);
        };
        channel.basicConsume(queueName, true, deliverCallback, consumer -> {
        });
    }
}
```

效果如图

<img referrerpolicy="no-referrer" src="https://cdn.nlark.com/yuque/0/2022/png/23183050/1657270418677-9e85644d-a472-486f-bf3a-4cec836605a3.png" alt="img" style="zoom: 67%;" />



## Topic类型

上面对广播的消息做了改造，使得可以按照不同的级别(RoutingKey)发送消息到指定队列，实现有选择的接收日志。不过direct也有一定局限性，例如info下可能是不同模块的日志，比如`info.common`、`info.msg`之类，如果都通过direct就会定义过多的BindingKey且拓展性较差，这时就可以使用`topic`类型

<img referrerpolicy="no-referrer" src="https://cdn.nlark.com/yuque/0/2022/png/23183050/1657272750395-78a5e31e-ef63-4757-9a3d-858231f9ed64.png" alt="img" style="zoom:80%;" />

`topic`类型相当于”高级版的`direct`类型“，它支持在队列绑定时对RoutingKey使用通配符，其中RoutingKey由一个或多个单词组成，单词间通过`.`连接。例如：`rabbit.test.hello`、`kafka.port.what` 不过它不能超过255个字节，并且它可以使用通配符

```java
/**   通配符匹配规则
 *      * 匹配一个单词
 *      # 匹配一个或多个单词
 */
```

以上图为例：

- RoutingKey凡是长度为三且中间单词为orange的消息，都会发到Q1中
- RoutingKey凡是长度为三且最后单词为rabbit的消息，都会发到Q2中
- RoutingKey凡是以lazy开头的消息都会发到Q2中

【注】消息只会被消费一次，所以如果有消息（例如`lazy.test.rabbit`）同时满足Q2的两个条件，它也只会被Q2消费一次

| **RoutingKey类型**       | **消费情况**                           |                    |
| ------------------------ | -------------------------------------- | ------------------ |
| quick.orange.rabbit      | 被队列 Q1、Q2 接收                     |                    |
| azy.orange.elephant      | 被队列 Q1、Q2 接收                     | 被队列 Q1Q2 接收到 |
| quick.orange.fox         | 被队列 Q1 接收                         | 被队列 Q1 接收到   |
| lazy.brown.fox           | 被队列 Q2 接收到                       |                    |
| lazy.pink.rabbit         | 虽然满足两个绑定但只被队列 Q2 接收一次 |                    |
| quick.brown.fox          | 不匹配任何绑定，不会被接收，会被丢弃   |                    |
| quick.orange.male.rabbit | 是四个单词不匹配任何绑定会被丢弃       |                    |
| lazy.orange.male.rabbit  | 满足Q2条件，被Q2接收                   |                    |

参照上面，编写demo代码：

```java
public class TopicProducer {

    private static final String EXCHANGE_NAME = "topic_exchange";

    public static void main(String[] args) throws Exception {
        Channel channel = RabbitMQUtils.getChannel();
        channel.exchangeDeclare(EXCHANGE_NAME, BuiltinExchangeType.TOPIC);

        /*
         * Q1绑定：中间带orange的3个单词字符串—> *.orange.*
         * Q2绑定：最后一个单词为rabbit的3个单词字符串—> *.*.rabbit 或 首单词为lazy的多单词-> lazy.#
         */
        HashMap<String, String> keyMap = new HashMap<>();
        keyMap.put("quick.orange.rabbit", "被队列 Q1Q2 接收到");
        keyMap.put("lazy.orange.elephant", "被队列 Q1Q2 接收到");
        keyMap.put("quick.orange.fox", "被队列 Q1 接收到");
        keyMap.put("lazy.brown.fox", "被队列 Q2 接收到");
        keyMap.put("lazy.pink.rabbit", "虽然满足 Q2 的两个绑定,但只被队列 Q2 接收一次");
        keyMap.put("quick.brown.fox", "不匹配任何绑定不会被任何队列接收到 会被丢弃");
        keyMap.put("quick.orange.male.rabbit", "是四个单词不匹配任何绑定 会被丢弃");
        keyMap.put("lazy.orange.male.rabbit", "是四个单词但匹配 Q2");


        for (Map.Entry<String, String> keyEntry : keyMap.entrySet()) {
            String key = keyEntry.getKey();
            String value = keyEntry.getValue();
            channel.basicPublish(EXCHANGE_NAME, key, null, (key + value).getBytes(StandardCharsets.UTF_8));
            System.out.println("生产者发送消息：" + value);
        }
    }
}

// 消费者1  *.orange.*
public class TopicConsumer1 {

    private static final String EXCHANGE_NAME = "topic_exchange";

    public static void main(String[] args) throws Exception {
        Channel channel = RabbitMQUtils.getChannel();
        channel.exchangeDeclare(EXCHANGE_NAME, BuiltinExchangeType.TOPIC);

        String queueName = "Q1";
        channel.queueDeclare(queueName, false, false, false, null);
        channel.queueBind(queueName, EXCHANGE_NAME, "*.orange.*");
        System.out.println("Q1等待接收消息。。。");

        DeliverCallback deliverCallback = (consumerTag, delivery) -> {
            String msg = new String(delivery.getBody(), StandardCharsets.UTF_8);
            System.out.println("Q1接收到的消息：" + msg);
        };
        channel.basicConsume(queueName, true, deliverCallback, consumer -> {
        });
    }
}

// 消费者2   *.*.rabbit  lazy.#
public class TopicConsumer2 {

    private static final String EXCHANGE_NAME = "topic_exchange";

    public static void main(String[] args) throws Exception {
        Channel channel = RabbitMQUtils.getChannel();
        channel.exchangeDeclare(EXCHANGE_NAME, BuiltinExchangeType.TOPIC);

        String queueName = "Q2";
        channel.queueDeclare(queueName, false, false, false, null);
        channel.queueBind(queueName, EXCHANGE_NAME, "*.*.rabbit");
        channel.queueBind(queueName, EXCHANGE_NAME, "lazy.#");
        System.out.println("Q2等待接收消息。。。");

        DeliverCallback deliverCallback = (consumerTag, delivery) -> {
            String msg = new String(delivery.getBody(), StandardCharsets.UTF_8);
            System.out.println("Q2接收到的消息：" + msg);
        };
        channel.basicConsume(queueName, true, deliverCallback, consumer -> {
        });
    }
}
```

运行后可以查看到名为`topic_exchange`的交换机下，有对应的三个`Bindings`

<img referrerpolicy="no-referrer" src="https://cdn.nlark.com/yuque/0/2022/png/23183050/1657434093508-7a1ce8c2-bf13-43e7-97c8-a36d9573bbbf.png" alt="img" style="zoom:80%;" />

查看消费者1和消费者2的控制台，看到正确获取了响应的消息：

<img referrerpolicy="no-referrer" src="https://cdn.nlark.com/yuque/0/2022/png/23183050/1657434360638-f4cc592f-5a61-4bc1-8e7a-d56550f15441.png" alt="img" style="zoom:80%;" />



## 交换机持久化

交换机默认是没有持久化的，因此RabbitMQ重启后交换机就会丢失，对于常用的交换机应该设置持久化

```java
/*
 *参数一:  交换机名称
 *参数二:  交换机类型
 *参数三:  是否持久化
 */
channel.exchangeDeclare("交换机名称", BuiltinExchangeType.XXXX,true);
```



## Return消息机制

在消息应答一节中提到`发送确认`——确保消息从生产者到交换机。那么消息从交换机到队列的过程中要怎样保证可靠性呢？这就需要return机制

Return机制：监控交换机是否将消息发送到指定队列。对于队列不存在或者RoutingKey无法路由到的消息，都需要进行捕获，通过`addReturnListener`方法添加`ReturnListener`回调接口，该接口有一个方法`handleReturn`用于处理交换机到队列路由失败的消息



<img referrerpolicy="no-referrer" src="https://cdn.nlark.com/yuque/0/2022/png/23183050/1657436096461-1ba0e68d-94ab-4319-a1c9-9f9be506b74a.png" alt="img" style="zoom:80%;" />



编写简单DEMO测试

- 生产者的RoutingKey为vip消息
- 消费者的BindingKey为普通用户消息
- 观察是否会进入回调方法

```java
public class ReturnProducer {

    private static final String EXCHANGE_NAME = "return_exchange";
    private static final String NORMAL_KEY = "normal";
    private static final String VIP_KEY = "vip";


    public static void main(String[] args) throws Exception {
        Channel channel = RabbitMQUtils.getChannel();
        channel.exchangeDeclare(EXCHANGE_NAME, BuiltinExchangeType.DIRECT);

        channel.addReturnListener(new ReturnListener() {
            /**
             * replyCode：路由是否成功的响应码
             * replyText：文本说明
             * exchange：具体路由到的交换机
             * routingKey：路由键
             * properties：消息配置
             */
            @Override
            public void handleReturn(int replyCode, String replyText, String exchange, String routingKey, AMQP.BasicProperties basicProperties, byte[] bytes) throws IOException {
                System.out.println("----------------------进入回调方法----------------------");
                System.out.println("Listener获取到无法路由的消息：\n" +
                        "replyCode：" + replyCode + "\n" +
                        "replyText：" + replyText + "\n" +
                        "exchange：" + exchange + "\n" +
                        "routingKey：" + routingKey + "\n" +
                        "properties：" + basicProperties + "\n" +
                        "body：" + new String(bytes));
            }
        });

        /*
         * 指定mandatory为true，会将不可路由的消息返回给生产者，设置为false时broker会直接丢弃不可路由的消息
         * 指定queue为vip而消费端为normal，无法路由就会触发回调函数
         */
        channel.basicPublish(EXCHANGE_NAME, NORMAL_KEY, true, null, "测试不可路由的消息文本".getBytes(StandardCharsets.UTF_8));
    }
}

public class ReturnConsumer {

    private static final String EXCHANGE_NAME = "return_exchange";
    private static final String VIP_KEY = "vip";

    public static void main(String[] args) throws Exception {
        Channel channel = RabbitMQUtils.getChannel();
        channel.exchangeDeclare(EXCHANGE_NAME, BuiltinExchangeType.DIRECT);

        String queueName = "queue_vip";
        channel.queueDeclare(queueName, false, false, false, null);
        channel.queueBind(queueName, EXCHANGE_NAME, VIP_KEY);

        DeliverCallback deliverCallback = (consumerTag, delivery) -> {
            System.out.println("VIP接收到的消息：" + new String(delivery.getBody(), StandardCharsets.UTF_8));
            channel.basicAck(delivery.getEnvelope().getDeliveryTag(), false);
        };
        CancelCallback cancelCallback = consumer -> {
            System.out.println("取消消费！");
        };
        channel.basicConsume(queueName, false, deliverCallback, cancelCallback);
    }
}
```

如图可以看到成功调用回调方法

<img referrerpolicy="no-referrer" src="https://cdn.nlark.com/yuque/0/2022/png/23183050/1657436841518-bc5f9d03-cff7-4a79-9537-ce77f2a84cab.png" alt="img" style="zoom:80%;" />



mandatory 和 immediate 他们都有当消息传递过程中不可达目的地时将消息 **返回给生产者** 的功能

RabbitMQ 提供的 **备份交换器（Alternate Exchange）** 可以将 **未能被交换器路由**（没有绑定队列或没有匹配的队列） 的消息存储起来，而不用返回给客户端

### mandatory参数

- true：找不到匹配的队列，会将消息返回给生产者
- false：找不到匹配的队列，直接丢弃

交换机无法根据自身类型和路由键将消息传递到某个队列上时，会调用`Basic.Return`将消息返回给生产者，生产者通过`addReturnListener`添加返回监听，来处理未能成功路由的消息



### immediate参数

当设置immediate参数为 true ，如果交换器在将消息路由到队列时，发现 **队列上并不存在任何消费者**，那么该 **消息将不会存入队列中**。当与路由键匹配的所有队列都没有消费者时，会通过`Basic.Return`返回给生产者。



二者对比

- mandatory ：要求消息至少被路由到一个队列中，要么丢弃、要么返回给生产者
- immediate：要求至少有一个订阅者，否则就返回给生产者。

**RabbitMQ 3.+ 版本后不再对immediate支持**，官方解释：该参数会影响镜像队列的性能，增加代码复杂性。建议采用 TTL 和 DLX 的方法替代



### 备份交换机

如果设置了`mandatory = false`，未被路由的消息会被丢弃，`mandatory = true`则需要生产者通过Return监听处理未被路由的消息。

备份交换机（`Alternate Exchange`简称AE），如果不想丢失消息，又不想自己立即接收处理这些消息，则可以使用这个备份交换器，**在需要的时候再去处理**这些消息

可以通过两种方式实现：

1. 可以在声明交换器时，增加`alternate-exchange`参数实现
2. 可以通过策略（Policy）

如果两种方式同时使用，前者的优先级更高，会覆盖掉 Policy 的设置

```java
// 定义备份交换器
channel.exchangeDeclare("myAe", "fanout", true, false, null);
channel.queueDeclare("unroutedQueue", true, false, false, null);
channel.queueBind("unroutedQueue", "myAe", "");

final HashMap<String, Object> arguments = new HashMap<>();
arguments.put("alternate-exhcange", "myAe");
// 使用备用交换器 myAe
channel.exchangeDeclare("normalExchange", "direct", true, false, arguments);
channel.queueDeclare("normalQueue", true, false, false, null);
channel.queueBind"normalQueue", "normalExchange", ROUTING_KEY);
```

以上代码的逻辑即为：

- 使用部分：定义了一个normal交换机和队列，交换机的参数添加`alternate-exhcange`，用于声明normal队列的消息不可达时，将消息存放到备份交换机
- 定义部分：声明了备份交换机的定义，并绑定到用于存放不可路由消息的队列