---
title: 6、SpringBoot整合RabbitMQ
tags: RabbitMQ
categories: 消息队列
abbrlink: ef3b40a7
date: 2023-05-11 10:23:09
---
SpringBoot作为目前后端开发的主流框架，基本上系统都有应用，并且它对其他很多框架提供了非常优秀的集成。



新建一个springboot工程

<img referrerpolicy="no-referrer" src="https://cdn.nlark.com/yuque/0/2022/png/23183050/1656752277077-232a359f-9940-4be4-99a9-cd3e224dde69.png" alt="img" style="zoom: 80%;" />

在Messaging选项中勾选RabbitMQ，之后卡一看到mavenpom文件中依赖`spring-boot-starter-amqp`，它继承了`amqp-client`依赖实现了amqp协议

```xml
<dependencies>
  <dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-amqp</artifactId>
  </dependency>
  <dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-web</artifactId>
  </dependency>

  <dependency>
    <groupId>org.projectlombok</groupId>
    <artifactId>lombok</artifactId>
    <optional>true</optional>
  </dependency>
  <dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-test</artifactId>
    <scope>test</scope>
  </dependency>
  <dependency>
    <groupId>org.springframework.amqp</groupId>
    <artifactId>spring-rabbit-test</artifactId>
    <scope>test</scope>
  </dependency>
</dependencies>
```

修改yaml配置文件：

```yaml
spring:
  rabbitmq:
    host: 192.168.204.127
    port: 5672
    username: guest
    password: guest
    virtual-host: /
```

常用的RabbitMQ操作类有RabbitAdmin、RabbitTemplate，其中使用比较广泛的是RabbitTemplate，这里整合的也是以RabbitTemplate使用为主。它提供了编辑、发送、监听消息等一系列功能，通过RabbitTemplate，可以在Springboot中像操作原生API一样进行消息的发送监听操作



先按照之前的最基础模式，测试Springboot集成RabbitMQ的基础操作API

#### Hello World

简单模式就是最基础的消息队列，它简化了其他操作，仅模拟生产者、队列、消费者三个部分

1.  创建三个对象的对应类 

```java
// 基础的生产者，通过RabbitTemplate操作消息
public class SimpleSender {
    private static final Logger LOGGER = LoggerFactory.getLogger(SimpleSender.class);
    private static final String queueName = "simple.hello";

    @Autowired
    private RabbitTemplate template;
    
    public void send() {
        String message = "Hello World!";
        this.template.convertAndSend(queueName, message);
        LOGGER.info(" [x] Sent '{}'", message);
    }
}

// 基础的消费者
public class SimpleReceiver {
    private static final Logger LOGGER = LoggerFactory.getLogger(SimpleReceiver.class);

    @RabbitHandler
    public void receive(String in) {
        LOGGER.info(" [x] Received '{}'", in);
    }
}

// 创建对应配置类，在配置类中设置好队列
@Configuration
public class SimpleRabbitConfig {
    @Bean
    public Queue hello() {
        return new Queue("simple.hello");
    }

    @Bean
    public SimpleSender simpleSender() {
        return new SimpleSender();
    }

    @Bean
    public SimpleReceiver simpleReceiver() {
        return new SimpleReceiver();
    }
}
```

1.  创建controller进行测试 

```java
@RestController
@RequestMapping("/rabbit")
public class RabbitController {

    @Autowired
    private SimpleSender simpleSender;

    @GetMapping(value = "/simple")
    public void simpleTest() throws InterruptedException {
        for(int i=0;i<10;i++){
            simpleSender.send();
            Thread.sleep(1000);
        }
    }
}
```

#### <img referrerpolicy="no-referrer" src="https://cdn.nlark.com/yuque/0/2022/png/23183050/1656752435417-4cd39d9e-5f56-4ce2-8d23-cb9086870e5a.png" alt="img" style="zoom:80%;" />

#### Work Queue

**WorkQueue**模式将多个消费者绑定到一个队列中，默认采取轮询方式分发消息

操作可以参照上面

1.  创建对应的对象 

```java
// 生产者
public class WorkSender {
	
	public static final Logger LOGGER = LoggerFactory.getLogger(WorkSender.class);
	public static final String QUEUE_NAME = "work";
	
	@Autowired
	private RabbitTemplate rabbitTemplate;
	
	public void send(int index){
		StringBuilder builder = new StringBuilder("Hello");
		int limitIndex = index % 3+1;
		for (int i = 0; i < limitIndex; i++) {
			builder.append('.');
		}
		builder.append(index+1);
		String message = builder.toString();
		rabbitTemplate.convertAndSend(QUEUE_NAME, message);
		LOGGER.info(" [x] Sent '{}'", message);
	}
}
// 消费者
@RabbitListener(queues = "work")
public class WorkReceiver {
	
	private static final Logger LOGGER = LoggerFactory.getLogger(WorkReceiver.class);
	
	private final int instance;
	
	public WorkReceiver(int i) {
		this.instance = i;
	}
	
	@RabbitHandler
	public void receive(String in) throws InterruptedException {
		StopWatch watch = new StopWatch();
		watch.start();
		LOGGER.info("instance {} [x] Received '{}'", this.instance, in);
		doWork(in); // 模拟业务操作
		watch.stop();
		LOGGER.info("instance {} [x] Done in {}s", this.instance, watch.getTotalTimeSeconds());
	}
	
	private void doWork(String in) throws InterruptedException {
		for (char ch : in.toCharArray()) {
			if (ch == '.') {
				Thread.sleep(1000);
			}
		}
	}
}
// 配置类
@Configuration
public class WorkRabbitConfig {
	@Bean
	public Queue workQueue() {
		return new Queue("work");
	}
	
	// 模拟两个消费者
	@Bean
	public WorkReceiver workReceiver1() {
		return new WorkReceiver(1);
	}
	@Bean
	public WorkReceiver workReceiver2() {
		return new WorkReceiver(2);
	}
	
	@Bean
	public WorkSender workSender() {
		return new WorkSender();
	}
}
```

1.  编写controller，调用测试 

```java
@GetMapping(value = "/work")
    public void workTest() throws InterruptedException {
        for (int i = 0; i < 10; i++) {
            workSender.send(i);
            Thread.sleep(1000);
        }
    }
```

 <img referrerpolicy="no-referrer" src="https://cdn.nlark.com/yuque/0/2022/png/23183050/1656752830230-99043ec3-05f8-4e47-b8a5-32752b7cc937.png" alt="img" style="zoom:80%;" />