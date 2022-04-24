---
title: https协议详解
date: 2020-07-31 16:13:40
tags: 计网
categories: 基础
---

### HTTPS简介

**HTTP协议是一种使用明文数据传输的网络协议。**这样会存在很大的隐患——数据在传输过程中可能会被截获，截获者因此可以获取你的信息，甚至篡改你发送的数据，导致服务器接收到错误的数据！！！

因此在HTTP协议基础上增加数据加密，即为HTTPS，他的维基百科定义如下

> **安全超文本传输协议**（**HTTPS**）是[超文本传输协议](https://en.wikipedia.org/wiki/Hypertext_Transfer_Protocol)（HTTP）的扩展。它用于在[计算机网络上](https://en.wikipedia.org/wiki/Network_operating_system)进行[安全通信](https://en.wikipedia.org/wiki/Secure_communications)，并在Internet上广泛使用。在HTTPS中，使用[传输层安全协议](https://en.wikipedia.org/wiki/Transport_Layer_Security)（TLS）或(以前)使用安全套接字层（SSL）对[通信协议](https://en.wikipedia.org/wiki/Communication_protocol)进行加密。因此，该协议也被称为**HTTP over TLS**，或**over SSL的HTTP**。
>
> HTTPS的主要动机是对访问的[网站](https://en.wikipedia.org/wiki/Website)进行[身份验证](https://en.wikipedia.org/wiki/Authentication)，以及在传输过程中保护交换数据的[隐私](https://en.wikipedia.org/wiki/Information_privacy)和[完整性](https://en.wikipedia.org/wiki/Data_integrity)。它可以防止[中间人攻击](https://en.wikipedia.org/wiki/Man-in-the-middle_attack)，并且客户端与服务器之间的双向通信[加密](https://en.wikipedia.org/wiki/Block_cipher_mode_of_operation)可以保护通信免遭[窃听](https://en.wikipedia.org/wiki/Eavesdropping)和[篡改](https://en.wikipedia.org/wiki/Tamper-evident#Tampering)。实际上，这可以合理地保证人们在与预期的网站进行通信而不受攻击者的干扰。

<!--more-->

数据加密传输，是HTTP和HTTPS之间的本质性区别

HTTPS特点：

1. 内容加密：采用混合加密技术，中间者无法直接查看明文内容
2. 验证身份：通过证书认证客户端访问的是自己的服务器
3. 保护数据完整性：防止传输的内容被中间人冒充或者篡改

HTTPS 协议就是 HTTP+SSL/TLS，即在 HTTP 基础上加入 SSL /TLS 层，提供了内容加密、身份认证和数据完整性3大功能，目的就是为了加密数据，用于安全的数据传输。



### HTTPS工作原理

客户端使用HTTPS方式与web服务器通信的基本步骤

1. 客户使用https的URL访问Web服务器，要求与Web服务器建立SSL连接。
2. Web服务器收到客户端请求后，会将网站的证书信息（证书中包含公钥）传送一份给客户端。
3. 客户端的浏览器与Web服务器开始协商SSL/TLS连接的安全等级，也就是信息加密的等级。
4. 客户端的浏览器根据双方同意的安全等级，建立会话密钥，然后利用网站的公钥将会话密钥加密，并传送给网站。
5. Web服务器利用自己的私钥解密出会话密钥。
6. Web服务器利用会话密钥加密与客户端之间的通信。

![](http://img2.salute61.top/https1.png)

#### HTTPS：TSL/SSL原理

HTTPS协议的主要功能基本都依赖于TLS/SSL协议。
TLS/SSL的功能实现主要依赖于三类基本算法：散列函数 Hash、对称加密和非对称加密，其利用非对称加密实现身份认证和密钥协商，对称加密算法采用协商的密钥对数据加密，基于散列函数验证信息的完整性。

关于这三类算法在网络安全基础知识博文中有详细介绍

**SSL和TLS区别**

SSL：（Secure Socket Layer，安全套接字层），位于可靠的面向连接的网络层协议和应用层协议之间的一种协议层。SSL通过互相认证、使用数字签名确保完整性、使用加密确保私密性，以实现客户端和服务器之间的安全通讯。该协议由两层组成：SSL记录协议和SSL握手协议。

TLS：(Transport Layer Security，传输层安全协议)，用于两个应用程序之间提供保密性和数据完整性。该协议由两层组成：TLS记录协议和TLS握手协议。



#### HTTP跳转HTTPS过程

以进入leetcode为例：

- 在浏览器中输入http://leetcode-cn.com/，浏览器与服务器三次握手；
- 服务器收到请求后响应状态码301，让用户跳转到HTTPS，重新请求https://leetcode-cn.com/；
- 用户重新发起HTTPS请求，再次与服务器三次TCP握手



### HTTP和HTTPS区别

  1、HTTPS是加密传输协议，HTTP是名文传输协议;
  2、HTTPS需要用到SSL证书，而HTTP不用;
  3、HTTPS比HTTP更加安全，对搜索引擎更友好，利于SEO
  4、 HTTPS标准端口443，HTTP标准端口80;
  5、 HTTPS基于传输层，HTTP基于应用层;
  6、 HTTPS在浏览器显示绿色安全锁，HTTP没有显示;



### HTTPS缺点

- HTTPS降低用户访问速度（需多次握手）
- 网站改用 HTTPS 以后，由 HTTP 跳转到 HTTPS 的方式增加了用户访问耗时（多数网站采用 301、302 跳转）
- HTTPS 涉及到的安全算法会消耗 CPU 资源，需要增加服务器资源（https 访问过程需要加解密）



### HTTPS优化

##### 1、HSTS重定向技术

HSTS（HTTP Strict Transport Security）技术，启用HSTS后，将保证浏览器始终连接到网站的 HTTPS 加密版本。

1. 用户在浏览器里输入 HTTP 协议进行访问时，浏览器会自动将 HTTP 转换为 HTTPS 进行访问，确保用户访问安全；

2. 省去301跳转的出现，缩短访问时间；

3. 能阻止基于 SSL Strip 的中间人攻击，万一证书有错误，则显示错误，用户不能回避警告，从而能够更加有效安全的保障用户的访问。

 

##### 2、TLS握手优化

​    在传输应用数据之前，客户端必须与服务端协商密钥、加密算法等信息，服务端还要把自己的证书发给客户端表明其身份，这些环节构成 TLS 握手过程。

​    采用 False Start （抢先开始）技术，浏览器在与服务器完成 TLS 握手前，就开始发送请求数据，服务器在收到这些数据后，完成 TLS 握手的同时，开始发送响应数据。

​    开启 False Start 功能后，数据传输时间将进一步缩短。

 

##### 3、Session Identifier（会话标识符）复用

​    如果用户的一个业务请求包含了多条的加密流，客户端与服务器将会反复握手，必定会导致更多的时间损耗。或者某些特殊情况导致了对话突然中断，双方就需要重新握手，增加了用户访问时间。

​    （1）服务器为每一次的会话都生成并记录一个 ID 号，然后发送给客户端；

​    （2）如果客户端发起重新连接，则只要向服务器发送该 ID 号；

​    （3）服务器收到客户端发来的 ID 号，然后查找自己的会话记录，匹配 ID 之后，双方就可以重新使用之前的对称加密秘钥进行数据加密传输，而不必重新生成，减少交互时间。

 

##### 4、开启OSCP Stapling，提高TLS握手效率

​    采用OCSP Stapling ，提升 HTTPS 性能。服务端主动获取 OCSP 查询结果并随着证书一起发送给客户端，从而客户端可直接通过 Web Server 验证证书，提高 TLS 握手效率。

​    服务器模拟浏览器向 CA 发起请求，并将带有 CA 机构签名的 OCSP 响应保存到本地，然后在与客户端握手阶段，将 OCSP 响应下发给浏览器，省去浏览器的在线验证过程。由于浏览器不需要直接向 CA 站点查询证书状态，这个功能对访问速度的提升非常明显。

 

##### 5、完全前向加密PFS，保护用户数据，预防私钥泄漏

​    非对称加密算法 RSA，包含了公钥、私钥，其中私钥是保密不对外公开的，由于此算法既可以用于加密也可以用于签名，所以用途甚广，但是还是会遇到一些问题：

（1） 假如我是一名黑客，虽然现在我不知道私钥，但是我可以先把客户端与服务器之前的传输数据（已加密）全部保存下来

（2）如果某一天，服务器维护人员不小心把私钥泄露了，或者服务器被我攻破获取到了私钥

（3）那我就可以利用这个私钥，破解掉之前已被我保存的数据，从中获取有用的信息

​    所以为了防止上述现象发生，我们必须保护好自己的私钥。

​    如果私钥确实被泄漏了，那我们改如何补救呢？那就需要PFS（perfect forward secrecy）完全前向保密功能，此功能用于客户端与服务器交换对称密钥，起到前向保密的作用，也即就算私钥被泄漏，黑客也无法破解先前已加密的数据。维基解释是：**长期使用的[主密钥](https://zh.wikipedia.org/wiki/密钥)泄漏不会导致过去的[会话密钥](https://zh.wikipedia.org/wiki/會話密鑰)泄漏**

​    实现此功能需要服务器支持以下算法和签名组合：

（1）ECDHE 密钥交换、RSA 签名；

（2）ECDHE 密钥交换、ECDSA 签名；



### 参考

1. [HTTP与HTTPS的区别，详细介绍]([https://blog.csdn.net/qq_35642036/article/details/82788421#HTTP%E4%B8%8EHTTPS%E4%BB%8B%E7%BB%8D](https://blog.csdn.net/qq_35642036/article/details/82788421#HTTP与HTTPS介绍))
2. [详解全站 HTTPS 访问优化](https://segmentfault.com/p/1210000009272802/read)
3. [HTTPS协议详解(二)：TLS/SSL工作原理](https://blog.csdn.net/hherima/article/details/52469360)





