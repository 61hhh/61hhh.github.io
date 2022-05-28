---
title: 计算机网络CH4-CH6概述
tags: 计网
categories: 基础
abbrlink: 598de264
date: 2020-07-13 11:28:01
---

继续复习计网，后面ch4-ch6是网络层、运输层、应用层，真正是计算机网络最核心的部分了，无论是学习还是面试工作，基本上网络的知识都是以这部分为主提问，一个是内容多一个是难度大，要好好吸收消化才行

<!--more-->

## 第四章 网络层

- 网络层向上只提供简单灵活的、无连接的、尽最大努力交付的数据报服务。网络层不提供服务质量的承诺

  - 

    <img src="https://img.mubu.com/document_image/fef357d9-d4a3-40ce-bacc-a96a930b6f00-1513806.jpg" alt="img" style="zoom:67%;" />



### 网际协议IP

- IP协议配套使用的三个协议

  - 

    <img src="https://img.mubu.com/document_image/b6ef6c35-4893-4519-9ae8-379d97d7fa15-1513806.jpg" alt="img" style="zoom: 80%;" />

  - 地址解析协议 ARP(Address Resolution Protocol)

  - 网际控制报文协议 ICMP(Internet Control Message Protocol)

  - 网际组管理协议 IGMP(Internet Group Management Protocol)

- 各层的中间设备，将网络互相连接起来

  - 

    <img src="https://img.mubu.com/document_image/08701c85-4f06-452f-95c9-57e2204ffc39-1513806.jpg" alt="img" style="zoom:67%;" />

- 三类IP地址

  - 

    <img src="https://img.mubu.com/document_image/25c3b814-7ae3-4eaa-a082-77d31011c26c-1513806.jpg" alt="img" style="zoom:67%;" />

  - 

    <img src="https://img.mubu.com/document_image/cd4db9a8-ab70-42a8-9190-c99c85e599d8-1513806.jpg" alt="img" style="zoom: 50%;" />

    <img src="https://img.mubu.com/document_image/9232e06b-79c1-460a-9458-f9f7481ea567-7976057.jpg" alt="img" style="zoom: 80%;" />

  - 

    <img src="https://img.mubu.com/document_image/b5f65e5e-95cf-4967-88e4-4030a5ab73e3-1513806.jpg" alt="img" style="zoom:67%;" />

### IP地址与硬件地址

- 物理地址/硬件地址/MAC地址：物理层和数据链路层所使用的 IP地址是网络层及以上各层所使用的

  <img src="https://img.mubu.com/document_image/04c7f12a-0e46-44f1-a127-1acae8055fbd-1513806.jpg" alt="img" style="zoom:67%;" />

  <img src="https://img.mubu.com/document_image/6c82df2f-f156-4e90-9400-c3bf845b0551-1513806.jpg" alt="img" style="zoom:67%;" />



### 地址解析协议ARP

- 地址解析协议的方法是在主机ARP高速缓存中存放一个从IP地址到硬件地址的映射表，并且这个映射表还经常动态更新

  <img src="https://img.mubu.com/document_image/b1b1a33f-d805-46d5-b52b-c774c2194733-1513806.jpg" alt="img" style="zoom:67%;" />

- ARP是解决同一个局域网上的主机或路由器的IP地址和硬件地址的映射问题。如果目的主机和源主机不在同一个局域网上，则源主机通过ARP找到位于本局域网上的一个路由器硬件地址，把IP数据报传给这个路由器

- 

  <img src="https://img.mubu.com/document_image/4975d4bb-f9ef-406d-97fa-9d9a068bcc7e-1513806.jpg" style="zoom:67%;" />





### IP数据报格式

- 首部由定长20字节的固定部分+可变长度的可选字段构成

  <img src="https://img.mubu.com/document_image/2f06d97c-ba5b-486c-8546-b1abb60f11bf-1513806.jpg" alt="img" style="zoom:67%;" />

- 首部长度：单位是32位（即4字节 ，若为1111，则说明首部长度60字节），当IP分组的首部长度不是4字节的整数倍时，必须利用最后的填充字段加以补充。因此IP数据报的数据部分永远是在4字节的整数倍开始的，方便IP协议的实现

- 总长度：首部和 数据之和的长度，单位为字节。可表示最大长度为2^16-1=65535字节。当超过了数据链路层中数据帧的数据字段最大长度时，需要进行分片处理

- 标识：被分片之后标识属于同一个IP数据报

- 标志： MF（more fragment）MF=1 表示后面还有分片 DF （don't fragment） 意思是不能分片，当DF=0才允许分片

- 片位移：分片后，某片在原分组中的相对位置，片位移以8个字节为偏移单位

  - 

    <img src="https://img.mubu.com/document_image/fa582285-60be-41d7-9099-f55693943095-1513806.jpg" alt="img" style="zoom:67%;" />

- 生存时间：跳数限制

- IP层转发分组流程

  - 

    <img src="https://img.mubu.com/document_image/9a25d044-0b7e-4537-991b-b9d43ece4720-1513806.jpg" alt="img" style="zoom: 67%;" />



### 划分子网和构造超网

#### 划分子网

- 

  <img src="https://img.mubu.com/document_image/0ac1eea2-88d7-4f7b-8cbc-617cbe2571e3-1513806.jpg" alt="img" style="zoom: 67%;" />

  <img src="https://img.mubu.com/document_image/352bae33-428b-4574-9508-c0cec19411e7-1513806.jpg" alt="img" style="zoom: 67%;" />

- 子网掩码

  - 从一个 IP数据报的首部并无法判断源主机或目的主机所连接的网络是否进行了子网划分。使用子网掩码(subnetmask)可以找出IP地址中的子网部分。

  - 将IP地址与子网掩码进行 与 运算，即可得到子网的网络地址。所有的网络都必须使用子网掩码，如果一个网络不划分子网，那么该网络的子网掩码就使用默认的子网掩码

  - 子网数=2^n -2 n为子网号的位数。减二是除去全 0和全1两种情况.划分子网增加了灵活性，但却减少了能够连接在网络上的主机总数。 ABC 类IP地址和子网主机数都需要(2^n)-2。若是CIDR则直接2^n，不用-2

    ![img](https://img.mubu.com/document_image/815a6e6d-0216-4137-872a-1b75cb79a3de-1513806.jpg)



#### 使用子网时的分组转发

- 路由表需包含：目的网络地址、子网掩码和下一跳的地址

  <img src="https://img.mubu.com/document_image/324f6837-b26f-4a49-a4ce-8a3688d02904-1513806.jpg" alt="img" style="zoom:50%;" />



#### 无分类编制CIDR

- 192.199.170.82/27 不仅表示IP地址是192.199.170.82，而且还表示这个地址的网络的前缀有27位。192.199.170.‭010 10010‬ 取前27位，表明这个地址块的最小地址是192.199.170.64，最大地址是 192.199.170.010 11111 。

- CIDR使用32位的地址掩码，掩码中1的个数就是网络前缀的长度

  <img src="https://img.mubu.com/document_image/01fd68a3-a25a-4cdd-b161-923df04830d7-1513806.jpg" alt="img" style="zoom:50%;" />

- 一个 CIDR 地址块可以表示很多地址，这种地址的聚合常称为路由聚合，它使得路由表中的一个项目可以表示很多个（例如上千个）原来传统分类地址的路由。路由聚合也称为构成超网 

  - 

    <img src="https://img.mubu.com/document_image/75abeceb-0aac-4563-bcbc-0b025f8eee6d-1513806.jpg" alt="img" style="zoom:67%;" />

- 最长前缀匹配：目的IP地址D与路由表中两个项目的掩码做与运算之后都匹配，则选择两个匹配的地址中更具体地一个

  - 

    <img src="https://img.mubu.com/document_image/4cc7f689-e61f-46aa-8b80-7fec1a3215cc-1513806.jpg" alt="img" style="zoom:50%;" />

- 



### 网际控制报文协议ICMP

- 允许路由器或主机报告差错情况和提供有关异常情况的报告，更有效地转发IP数据报和提高交付成功地机会

- ICMP报文是装在IP数据报中，作为其中的数据部分。ICMP报文作为IP层数据报的数据，加上数据报的首部，组成IP数据报发送出去。

- 

  <img src="https://img.mubu.com/document_image/091d5410-f894-42b4-bbb9-d75239a1c4bb-1513806.jpg" alt="img" style="zoom: 67%;" />

  <img src="https://img.mubu.com/document_image/fcafd995-74a7-4366-b0b0-fc02d8c1bc97-7976057.jpg" alt="img" style="zoom: 67%;" />

#### 报文种类

- ICMP差错报告报文
  - 终点不可达
  - 时间超过 TTL超过。traceroute利用这点
  - 参数问题。 数据报的首部中有字段的值不正确
  - 改变路由
- ICMP询问报文
  - 回送请求和问答。 PING是应用层直接使用网络层ICMP的一个例子，没有通过运输层。traceroute，不断发送数据报，TTL+1，获得到达目的主机所经过的路由器IP地址和其中每一个路由器的往返时间
  - 时间戳请求和回答 请求某台主机或路由器回答当前日期和时间

- 路由选择协议

  - 静态路由选择（人工配置每一条路由） 动态路由选择 （自适应路由选择）

  - 分层次的路由选择协议

    - 把整个互联网划分为许多较小的自治系统

      - 内部网关协议 IGP 域内路由选择 RIP OSPF
      - 外部网关协议 EGP 域间路由选择 BGP

    - RIP 基于向量的路由选择协议（内部网关协议）

      - 从一个路由器到直接连接的网络的距离定义为1。从一个路由器到非直接连接的网络的距离定义为所经过的路由器数加1。不能超过15个路由器，16时不可达

      - 距离向量算法

        <img src="https://img.mubu.com/document_image/e9b313a0-9237-459a-a6ea-81159dd7b43d-1513806.jpg" alt="img" style="zoom: 67%;" />

      - 特点：

        - 1.仅和相邻路由器交换信息
        - 2.交换的信息是当前本路由器所指的全部信息，即自己现在的路由表
        - 3.按固定的时间间隔交换路由信息
        - RIP 协议让互联网中的所有路由器都和自己的相邻路由器不断交换路由信息，并不断更新其路由表，使得从每一个路由器到每一个目的网络的路由都是最短的（即跳数最少）。

      - RIP协议使用运输层的用户数据报UDP进行传送，即类似ICMP报文是塞进IP数据报的数据段里.RIP报文中的每个路由信息需要用20个字节，一个RIP报文最多包括25个路由

      - RIP存在的问题：当网络出现故障时，要经过比较长的时间才能将此消息传递到所有路由器。好消息传的快，坏消息传的慢

        - 

          <img src="https://img.mubu.com/document_image/1a1377fd-b8f1-45c7-b887-b5f74b330831-1513806.jpg" alt="img" style="zoom: 80%;" />

    - OSPF 开放最短路径优先

      - 最主要的特征：使用分布式的链路状态协议
      - OSPF不使用UDP而是直接使用IP数据报传送

### 虚拟专用网VPN和网络地址转换NAT

- 专用地址：这些地址只能用于一个机构的内部通信，而不能用于和互联网上的主机通信。在互联网中的所有路由器，对目的地址是专用地址的数据报一律不进行转发

- VPN利用公用的互联网作为本机构各专用网之间的通信载体。

- NAT技术，可以在专用网络内部使用专用IP地址，而仅在连接到互联网的计算机使用全球IP地址。

  <img src="https://img.mubu.com/document_image/6bc5b165-41df-453a-8014-5200d0ea2c56-1513806.jpg" alt="img" style="zoom:67%;" />



## 第五章 运输层

- 网络层为主机之间提供逻辑通信，而运输层为主机进程间提供逻辑通信
- 端口：TCP/IP运输层用16位端口号来标志一个端口，端口号只具有本地意义，
  - 服务器端使用的端口号：1.熟知端口号（系统端口号）0-1023 ，指派给TCP/IP最重要的一些应用程序。2.登记端口号：1024-49515
  - 客户端使用的端口号：49512-65535 仅在客户进程运行时才动态选择



### 用户数据报协议 UDP

- 无连接的、尽最大努力交付

- 面向报文的。UDP对应用层交下来的报文，完整的保留，加上UDP首部后交给IP层。一次发送一个报文

- UDP没有拥塞控制。网络出现拥塞时不会使源主机的发送速率降低

- UDP支持一对一，一对多，多对一和多对多的交互通信

- UDP首部开销小。8字节

- 首部格式

  <img src="https://img.mubu.com/document_image/b0bb7c15-e686-4487-bc05-133675d63146-1513806.jpg" alt="img" style="zoom:67%;" />

- 基于端口的分用

  - 

    <img src="https://img.mubu.com/document_image/a65625d3-7591-41ca-a599-8cecd33d95dc-1513806.jpg" alt="img" style="zoom:67%;" />



### 传输控制协议 TCP

#### 特点

- 1.TCP是面向连接的运输层协议。应用程序在使用TCP协议之前，必须先建立TCP连接。在传送完数据后，再释放TCP连接
- 2.每一条TCP连接只能有两个端点，即点对点的
- 3.TCP提供可靠交付的服务。数据无差错，不丢失，不充分，且按序到达
- 4.TCP提供全双工通信
- 5.面向字节流。应用程序将数据传送到TCP缓存块，TCP根据对方给出的窗口值和网络拥塞程度来决定一个报文段应该包含多少个字节。



#### TCP的连接

- TCP连接的端点叫做套接字 socket

  - 同一个IP 地址可以有多个不同的TCP 连接。同一个端口号也可以出现在多个不同的TCP 连接中。

    <img src="https://img.mubu.com/document_image/4b68d3fd-c857-4a0c-baf5-47fa009b88d0-1513806.jpg" alt="img" style="zoom:50%;" />



### 可靠传输工作原理

- 理想的传输条件特点：1.传输信道不产生差错 2.不管发送方以多块速度发送数据，接收方总来得及处理收到的数据



#### 停止等待协议

- 在发送完一个分组后，必须暂时保留已发送的分组的副本，以备重发。

- 分组和确认分组都必须进行编号。

- 超时计时器的重传时间应当比数据在分组传输的平均往返时间更长一些。

  <img src="https://img.mubu.com/document_image/12ffe2a2-4367-4546-8761-712ca3875f06-1513806.jpg" alt="img" style="zoom:50%;" />

  <img src="https://img.mubu.com/document_image/3415fe58-3712-428e-adfb-407139362b5f-1513806.jpg" alt="img" style="zoom:50%;" />

  <img src="https://img.mubu.com/document_image/bf4948d5-f607-4ea2-a860-10f437edf319-1513806.jpg" alt="img" style="zoom:50%;" />



#### 连续ARQ协议

- 

  <img src="https://img.mubu.com/document_image/d6db65aa-8855-4743-ab8e-b1a02198a811-1513806.jpg" alt="img" style="zoom:50%;" />

- 接收方一般采用累积确认的方式。即不必对收到的分组逐个发送确认，而是对按序到达的最后一个分组发送确认。会出现(Go-Back-N)回退N现象

  - 如果发送方发送了前 5 个分组，而中间的第 3 个分组丢失了。这时接收方只能对前两个分组发出确认。发送方无法知道后面三个分组的下落，而只好把后面的三个分组都再重传一次。



### TCP报文段的首部格式

- 分为首部和数据两部分，首部前20各字节是固定的，后面又4n字节是根据需要而增加的选项

- 

  <img src="https://img.mubu.com/document_image/10b83a16-87e3-4f75-a053-6a49b1670b7b-1513806.jpg" alt="img" style="zoom: 67%;" />

- 1.序号：TCP 连接中传送的数据流中的每一个字节都编上一个序号。序号字段的值则指的是本报文段所发送的数据的第一个字节的序号

- 2.确认号：是期望收到对方的下一个报文段的数据的第一个字节的序号。 若确认号=N，则表明：到序号N-1为止的所有数据都已正确收到

- 3.数据偏移（即首部长度），它指出 TCP 报文段的数据起始处距离 TCP 报文段的起始处有多远，实际上就是首部长度

- 4.窗口：指的是接收方的接收窗口，窗口值明确指出勒现在允许对方发送的数据量。窗口值作为接收方让发送方设置其发送窗口的值的依据。

- 最大报文段长度 MSS。MSS 告诉对方 TCP：“我的缓存所能接收的报文段的数据字段的最大长度是 MSS 个字节。” 注意MSS是每一个TCP报文段中的数据字段最大长度。MSS应该尽可能大些，只要在IP层传输时不需要再分片就行。



### TCP可靠传输的实现

#### 以字节为单位的滑动窗口

- TCP的滑动窗口是以字节为单位的

- 根据 B 给出的窗口值，A 构造出自己的发送窗口。发送窗口表示：在没有收到 B 的确认的情况下，A 可以连续把窗口内的数据都发送出去。

  <img src="https://img.mubu.com/document_image/f1c1022e-c2e4-47fb-a08b-dc3196e39fef-1513806.jpg" alt="img" style="zoom: 67%;" />



#### 超时重传时间的选择

- 报文段发出的时间——接收到相应确认的时间：报文段往返时间RTT，TCP保留了RTT的一个加权平均往返时间RTTs
- 新的RTTs=(1-a) x (旧的RTTs) + a x (新的RTT样本)
- 0<=a<=1。若a接近0表示新的RTTs相比旧的变化不大；若接近1表示新的RTTS受新的RTT样本影响较大。推荐标准值为a=1/8即0.125
- 超时计时器设置超时重传时间RTO应略大于上面的加权平均往返时间RTO=RTTs + 4 x RTTd（RTTd是RTT的偏差的加权平均值）
- RTTd取值：第一次时RTTd为样本RTT的一半；后面的计算中RTTd= (1-b) x (旧的RTTd) + b x | RTTs - 新的RTT样本 |。（b推荐值为1/4即0.25）
- 假定发送一个报文段，设定的重传时间到了未收到确认于是再重传，之后收到了确认报文，但是我们不知道这是对原报文的确认还是对超时重传报文的确认，而两种不同的确认会导致计算出时间有较大偏差
  - 卡恩(karn)算法：在计算加权平均RTTs，只要报文段重传了，就不采用其往返时间的样本，这样得出的加权平均RTTs和RTO比较准确。（但是这样无法更新超时重传时间）
  - 修正的卡恩算法：报文段每重传一次，就把超时重传时间RTO增大一些，具体是在取新的重传时间为旧的2倍

- 选择确认SACK selective ACK



### TCP的流量控制

- 流量控制就是让发送方的发送速率不要太快，要让接收方来得及接收

  <img src="https://img.mubu.com/document_image/a412b07a-0ef6-4974-98ed-cef7e36ce92b-1513806.jpg" alt="img" style="zoom: 67%;" />



### TCP的拥塞控制

详见博客[《TCP拥塞控制详解》]([http://salute61.top/2020/07/12/TCP%E6%8B%A5%E5%A1%9E%E6%8E%A7%E5%88%B6%E8%AF%A6%E8%A7%A3/](http://salute61.top/2020/07/12/TCP拥塞控制详解/))

- 拥塞：对资源的需求>可用资源
- 拥塞控制的算法：慢开始、拥塞避免、快重传和快恢复
- 基于窗口的拥塞控制，发送方维持一个叫做拥塞窗口cwnd（congestion window）的状态变量，拥塞窗口的大小取决于网络的拥塞程度。发送方让自己的发送窗口等于拥塞窗口
- 发送方控制拥塞窗口原则：只要网络没有出现拥塞，拥塞窗口就可以再增大一点。判断网络拥塞的依据是出现了超时

#### 慢开始算法

- 由小到大逐渐增大拥塞窗口数值

- 每收到一个对新的报文段的确认后，就把拥塞窗口增加多一个SMSS（发送方的最大报文段）的数值

  <img src="https://img.mubu.com/document_image/3f234605-7a05-4e16-8271-8deb558712b4-1513806.jpg" alt="img" style="zoom: 67%;" />

- 使用慢开始算法后，每经过一个传输轮次 (transmission round)，拥塞窗口 cwnd 就加倍

  <img src="https://img.mubu.com/document_image/50616af3-80f0-48b9-8231-056dbcc3c1e0-1513806.jpg" alt="img" style="zoom: 67%;" />



##### 慢开始门限

- 防止拥塞窗口CWND增长过大引起网络拥塞

  <img src="https://img.mubu.com/document_image/45fc9ec8-e9e6-4868-82b9-e2b9a6b0ba0d-1513806.jpg" alt="img" style="zoom: 67%;" />



#### 拥塞避免算法

- 每经过一个往返时间RTT就把发送方的拥塞窗口cwnd+1，缓慢地增大，不是像慢开始那样指数倍的增长

#### 快速重传算法

- 发送方只要一连收到三个重复确认，就知道接收方确实没有收到报文段，因而应当立即进行重传（即“快重传”），这样就不会出现超时，发送方也不就会误认为出现了网络拥塞。

- 防止因为个别报文段在网络中丢失（此时网络未发生拥塞）导致发送发迟迟收不到确认而超时，误认为发生了拥塞，错误的减少了cwnd，降低了传输效率

  <img src="https://img.mubu.com/document_image/6f9a1c2f-9ddd-4103-9649-d061ba5848c3-1513806.jpg" alt="img" style="zoom: 67%;" />

#### 快速恢复算法

- 当发送端收到连续三个重复的确认时，由于发送方现在认为网络很可能没有发生拥塞，因此现在不执行慢开始算法，而是执行快恢复算法 FR (Fast Recovery) 算法

  <img src="https://img.mubu.com/document_image/f6309a3f-468a-46ef-93fc-64c445392c66-1513806.jpg" alt="img" style="zoom: 67%;" />

#### 示例图

<img src="https://img.mubu.com/document_image/38c9c653-bb97-4613-970c-6a829310398d-1513806.jpg" alt="img" style="zoom:67%;" />

<img src="https://img.mubu.com/document_image/2ba9fd1b-20d8-4d7d-9411-4b81de1cd851-1513806.jpg" alt="img" style="zoom: 67%;" />

<img src="https://img.mubu.com/document_image/703e63a1-f731-497a-8a9f-712b5289844e-1513806.jpg" alt="img" style="zoom:67%;" />



### TCP的运输连接管理

详见博客[《TCP运输连接管理》]([http://salute61.top/2020/07/12/TCP%E4%BC%A0%E8%BE%93%E8%BF%9E%E6%8E%A5%E7%AE%A1%E7%90%86/](http://salute61.top/2020/07/12/TCP传输连接管理/))

<img src="https://img.mubu.com/document_image/e952df77-8a9c-43ff-b052-473012c16790-1513806.jpg" alt="img" style="zoom: 80%;" />

<img src="https://img.mubu.com/document_image/960e20b6-dcaf-4c04-9916-48167425fb26-1513806.jpg" alt="img" style="zoom: 80%;" />



## 第六章 应用层

### 域名解析系统DNS

从域名中解析出IP地址

- 递归查询：让别人帮你查

  <img src="https://img.mubu.com/document_image/f2e2994c-8430-4e7b-a689-1ed7db99260d-7976057.jpg" alt="img"  />

- 迭代查询：自己去查

  <img src="https://img.mubu.com/document_image/003ddf6d-46ae-47f1-aaec-810deb828047-7976057.jpg" alt="img"  />

### 文件传送协议FTP

- 基于TCP和UDP的简单文件传送协议TFTP：复制整个文件。特点是若要存取一个文件就必须先获得一个本地副本；若要修改文件只能对本地副本修改，再将修改后的文件副本传回到原节点。
- 联机访问：多个程序使用同一文件，操作系统中的文件系统提供对共享文件的透明存取，其优点是原来处理本地文件的应用城西用来处理远程文件时无需对程序做明显改动。联机访问的代表是网络文件系统NFS

- 远程终端协议 TELNET 终端仿真协议
- 万维网WWW：一个大规模的、联机式的信息储藏所
  - 统一资源定位符 URL 表示从互联网上得到的资源位置和访问这些资源的方法。实际上就是在互联网上的资源的地址
  - 万维网是一个分布式的超媒体系统
  - 客户程序向服务器程序发出请求，服务器程序向客户程序送回客户所要的万维网文档
- 动态主机配置协议DHCP
  - 对于运行服务器软件的计算机：DHCP指派一个永久地址，而当这计算机重新启动时其地址不改变
  - 租用期：DHCP服务器分配给DHCP客户的IP地址是临时的，因此DHCP客户只能在一段有限的时间内使用这个分配到的IP地址。DHCP客户根据据服务器提供的租用期T设置两个计时器T1,T2，它们的超过时间分别是0.5T和0.875T.当超时时间到了就要请求更新租用期
  - DHCP客户可以随时提前终止服务器所提供的租用期

### 电子邮件

- 

  <img src="https://img.mubu.com/document_image/7678835d-75f6-40c9-97ca-761e7e96e9ab-7976057.jpg" alt="img" style="zoom:67%;" />

- 简单邮件传送协议 :SMTP

- 邮件读取协议POP3

### 超文本传输协议HTTP

- HTTP协议本身是无连接的，使用了面向连接的TCP作为运输层协议
  - HTTP/1.0 非持续连接
  - HTTP1.1 持续连接 分为流水线方式和非流水线方式