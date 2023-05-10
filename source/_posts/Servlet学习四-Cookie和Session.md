---
title: Servlet学习四-Cookie和Session
tags: JavaWeb
categories: Java
abbrlink: e0643af3
date: 2020-11-15 13:34:20
---

## 会话

会话跟踪是Web应用中常见的技术，用来跟踪用户的整个访问。例如用户打开浏览器，在浏览器中点击了多个标签页，访问不同的资源，然后关闭浏览器，整个过程可以称为一次会话。

常见的会话跟踪技术有Cookie和Session，Cookie出现时间更早些，在《计算机网络》课程中有讲到过。Cookie是通过客户端记录来确定用户身份信息；Session是通过服务器端记录来确定用户身份信息。

通过会话跟踪技术，我们可以实现很多常见的功能：密码保存、购物车信息、商品推荐等

<!--more-->

## Cookie

### 1、介绍

以购物为例，用户对商品的所有操作应该属于一次会话，用户添加商品A到购物车后返回主界面，再次添加时无法判断这是否已经在购物车内【由于Web应用程序采用的是无状态的HTTP协议进行数据传输：**一旦数据交换完毕连接就会断开，再次交互时需要建立新的连接**。因此服务器无法跟踪用户的会话】

为了解决这个问题，引入了Cookie机制。W3C组织提出了：为解决HTTP无状态连接的问题，**服务器给每个客户端颁发一个通行证，访问时携带通行证，这样服务器就能确认用户信息**，这个通行证就是Cookie。

Cookie实际上是一个记录用户信息的文本数据。客户端请求服务器，如果服务器要记录客户端状态，就使用response向客户端颁发一个Cookie，客户端将其保存，再次请求时浏览器会将请求网址连同Cookie一同提交，服务器检查Cookie确定用户信息。

【查看Cookie的操作】：在浏览器网址栏中输入`javascript:alert(document.cookie)`回车即可；或者F12在控制台输出同样指令也行。

![image-20201115141148663](https://jihulab.com/Leslie61/imagelake/-/raw/main/pictures/2023/05/image-20201115141148663.png)

我们访问很多网站时，他也会在网站底部提示：是否允许保存Cookie



### 2、Cookie举例

#### 2.1、API及属性方法

Java中将Cookie封装在`Javax.servlet.http.cookie`类中。每个Cookie都是该Cookie类的对象。服务器通过操作Cookie类对象对客户端Cookie进行操作。

- 通过**`request.getCookie()`获取客户端提交的所有Cookie**（以Cookie[]数组形式返回）；
- 通过**`response.addCookie(Cookiecookie)`向客户端设置Cookie；**它用于在响应头中增加一个Set-Cookie头字段

常见属性方法：【这里直接将别的博客整理的拿过来作为参考】

| 属性名         | 描述                                                         |
| -------------- | ------------------------------------------------------------ |
| String name    | 该Cookie的名称。Cookie一旦创建，名称便不可更改               |
| Object value   | 该Cookie的值。如果值为Unicode字符，需要为字符编码。如果值为二进制数据，则需要使用BASE64编码 |
| **int maxAge** | **该Cookie失效的时间，单位秒。如果为正数，则该Cookie在maxAge秒之后失效。如果为负数，该Cookie为临时Cookie，关闭浏览器即失效，浏览器也不会以任何形式保存该Cookie。如果为0，表示删除该Cookie。默认为–1** |
| boolean secure | 该Cookie是否仅被使用安全协议传输。安全协议。安全协议有HTTPS，SSL等，在网络上传输数据之前先将数据加密。默认为false |
| String path    | 该Cookie的使用路径。如果设置为“/sessionWeb/”，则只有contextPath为“/sessionWeb”的程序可以访问该Cookie。如果设置为“/”，则本域名下contextPath都可以访问该Cookie。注意最后一个字符必须为“/” |
| String domain  | 可以访问该Cookie的域名。如果设置为“.google.com”，则所有以“google.com”结尾的域名都可以访问该Cookie。注意第一个字符必须为“.” |
| String comment | 该Cookie的用处说明。浏览器显示Cookie信息的时候显示该说明     |
| int version    | 该Cookie使用的版本号。0表示遵循Netscape的Cookie规范，1表示遵循W3C的RFC 2109规范 |

方法

- public Cookie(String name,String value)
- setValue与getValue⽅法
- setPath与getPath⽅法
- setDomain与getDomain⽅法
- getName⽅法





编写代码如下：验证Cookie

```java
public class CookieTest extends HttpServlet {
    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        resp.setContentType("txt/html;charset=UTF-8");
        //创建Cookie对象
        Cookie cookie = new Cookie("username","LiuYi");
        //设置时间
        cookie.setMaxAge(1000);
        //给浏览器颁发Cookie
        resp.addCookie(cookie);
        resp.getWriter().write("向浏览器颁发了用户名Cookie！");
    }
}
```

【记得要设置Cookie的时间】在`web.xml`中注册，打开页面会下载Cookie文件，打开即为我们的Cookie信息。

![image-20201115145147399](https://jihulab.com/Leslie61/imagelake/-/raw/main/pictures/2023/05/image-20201115145147399.png)





### 3、Cookie特性

#### 3.1、Cookie有效期

Cookie中有个属性叫`maxAge`，它决定了Cookie的有效期，**通过`setMaxAge`与`getMaxAge`⽅法来设置`maxAge`属性**。

- 如果`maxAge`属性为正数，则表示该Cookie会在`maxAge`秒之后自动失效。浏览器会将对应的Cookie持久化到硬盘中。无论客户关闭了浏览器还是电脑，只要还在`maxAge`秒之前，登录网站时该Cookie仍然有效

  ```java
  // 新建Cookie
  Cookie cookie = new Cookie("username","LiuYi");
  // 设置生命周期为MAX_VALUE
  cookie.setMaxAge(Integer.MAX_VALUE);
  // 输出到客户端
  response.addCookie(cookie);
  ```

  

- 如果`maxAge`为负数，则表示该Cookie是临时的，仅在本浏览器窗口内有效，关闭窗口后该Cookie即失效。`maxAge`为负数的Cookie不会被持久化。Cookie信息保存在浏览器内存中，因此关闭浏览器该Cookie就消失了。Cookie默认的`maxAge`值为–1。

  因此上面的代码如果没有写`setMaxAge`的话，就不会下载到本地文件。

- `maxAge`设置为0，表示**删除Cookie**。Cookie机制没有提供删除Cookie的方法，因此通过设置该Cookie即时失效实现删除Cookie的效果。失效的Cookie会被浏览器从Cookie文件或者内存中删除



#### 3.2、Cookie不可跨域性

由于很多网站都会使用Cookie，例如`baidu.com`颁发了Cookie、`bilibili.com`颁发了Cookie。那么我们在访问B站时，浏览器会不会把百度的Cookie也上传过去？或者百度会不会修改B站的Cookie？

其实是不会的。因为**Cookie有一个特性：不可跨域性**。即访问百度时浏览器只会携带百度的Cookie，百度能操作的也只有百度的Cookie！

由于Cookie是保存在客户端的，因此对Cookie的管理是由浏览器进行的。浏览器会根据网址域名来判断该网站能否操作另一网站的Cookie。例如根据域名`baidu.com`得知它不能操作`bilibili.com`的域名、`img.baidu.com`和`baidu.com`都是百度但是二者不能操作对方的Cookie······



#### 3.3、Cookie编码

中英文的字符编码是不同的。中文采用的是4字符的Unicode字符、英文采用的是2字节的ASCII编码。因此在Cookie中设置中文时要对Unicode字符进行编码，否则会出现乱码错误



#### 3.4、Cookie修改删除

Cookie并没有直接提供修改删除的操作。

- 如果要修改某个Cookie，实际操作是创建同名Cookie添加到Response中覆盖原来的。
- 删除Cookie在上面有说过，就是设置Cookie的时间为0然后添加到浏览器。

【注：新建的的Cookie除了value和maxAge，其余的属性要和原来的Cookie保持一致】



#### 3.5、Cookie的域名

Cookie是不可跨域的，`www.baidu.com`颁发的Cookie是不会提交到`www.bilibili.com`上的。这个特性保证了网站不能非法获取其他网站的Cookie。同一个一级域名下的子域名也不能交接Cookie。例如：`goole.com`和`images.goole.com`的Cookie也不能访问。

Cookie有domain属性，可以设置访问改Cookie的域名，例如`.baidu.com`，则所有`.baiu.com`结尾的域名都可以访问该Cookie【注意第一个字符必须为`"."`】

```java
Cookie cookie1 = new Cookie("time","20201111");//创建Cookie
cookie1.setDomain(".liuyirespect.com");//设置Cookie的有效域名
cookie1.setPath("/");//设置路径
cookie1.setMaxAge(Integer.MAX_VALUE);//设置有效期
resp.addCookie(cookie1);//resp输出
```



#### 3.6、Cookie的路径

Cookie的domain属性决定了访问Cookie的域名，而path属性决定了访问Cookie的路径。

默认Cookie是当前域名都可以使用它，假设我们只允许`cookieServlet`可以使用，那就设置对应`cookieServlet`的路径即可。

```java
Cookie cookie1 = new Cookie("time","20201111");//创建Cookie
cookie1.setPath("/cookieServlet");//设置路径
resp.addCookie(cookie1);//resp输出
```



#### 3.7、Cookie的安全性

由于HTTP协议无状态不安全，所以如果不想Cookie在不安全的协议中传输，可以设置对应Cookie的Secure属性为true，则浏览器只会在HTTPS和SSL等安全协议中传输

```java
Cookie cookie1 = new Cookie("time","20201111");//创建Cookie
cookie1.setSecure(true);//设置安全属性
resp.addCookie(cookie1);//resp输出
```

![image-20201126073935429](https://jihulab.com/Leslie61/imagelake/-/raw/main/pictures/2023/05/image-20201126073935429.png)

【注】secure只是保证Cookie在安全的协议中传输，但是对于Cookie本身没有做任何安全操作，因此要提高安全性，可以在程序中对Cookie进行加密操作





### 4、Cookie举例

#### 4.1、显示访问时间

编写代码如下，并在web.xml中注册

```java
public class CookieDemo01 extends HttpServlet {
    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        //设置编码
        req.setCharacterEncoding("utf-8");
        resp.setCharacterEncoding("utf-8");

        //打印输出
        PrintWriter out = resp.getWriter();

        //Cookie是服务器从客户端获取的
        Cookie[] cookies = req.getCookies();//cookies数组表示可能有多个cookie
        //判断cookie
        if(cookies!=null){
            //存在的话
            out.write("上一次的访问时间是：");
            //获取上一次的cookie
            for(int i=0;i<cookies.length;i++){
                Cookie cookie = cookies[i];
                if(cookie.getName().equals("lastTime")){
                    long l = Long.parseLong(cookie.getValue());
                    Date date = new Date((l));
                    out.write(date.toLocaleString());
                }
            }
        }else{
            out.write("第一次访问本站！");
        }

        //服务器响应给客户端的cookie
        Cookie cookie = new Cookie("lastTime", System.currentTimeMillis() + "");
        //设置有效期
        cookie.setMaxAge(24*60*60);

        resp.addCookie(cookie);
    }

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        doGet(req, resp);
    }
}
```

结果如图：

![image-20201126074829511](https://jihulab.com/Leslie61/imagelake/-/raw/main/pictures/2023/05/image-20201126074829511.png)





## Session

### 1、介绍

看一下百度的Session定义

> Session：在计算机中，尤其是在网络应用中，称为“会话控制”。Session对象存储特定用户会话所需的属性及配置信息。这样，当用户在应用程序的Web页之间跳转时，存储在Session对象中的变量将不会丢失，而是在整个用户会话中一直存在下去。当用户请求来自应用程序的 Web页时，如果该用户还没有会话，则Web服务器将自动创建一个 Session对象。当会话过期或被放弃后，服务器将终止该会话。Session 对象最常见的一个用法就是存储用户的首选项。注意会话状态仅在支持cookie的浏览器中保留。

也就是说：Session是**服务器端使用的一种记录客户端状态的机制**。

创建Session的同时，服务器会为该Session生成唯一的Session id，而这个Session id在随后的请求中会被用来重新获得已经创建的Session；在Session被创建之后，就可以调用Session相关的方法往Session中增加内容了，而这些内容只会保存在服务器中，发到客户端的只有Session id；当客户端再次发送请求的时候，会将这个Session id带上，服务器接受到请求之后就会依据Session id找到相应的Session，从而再次使用之。

把访问网络应用比作参加宴会。Cookie相当于请帖，来宾【客户端】出示请帖进入宴会，而Session相当于嘉宾表，主人【服务器】拿着嘉宾表来确认是否邀请了对应的嘉宾。



#### 1.1、Cookie的优点

- Session使用上比Cookie简单；
- Session存储更多样化，Cookie只能存储字符串，Session还可以存储对象



### 2、Session特性

#### 2.1、Session的生命周期和有效期

**Session是在用户第一次访问服务器的时候自动创建的**，对应的Session对象保存在内存中【只有访问jsp、servlet等程序时才会创建Session，而访问HTML、IMAGE等静态资源时并不会创建。也可以使用req.getSession(true)】

Session生成后，只要用户继续访问，服务器都会认为该Session活跃(active)了一次，就会更新Session的最后访问时间。

对于长期没有活跃的Session，服务器会把它从内存中删除，这样的目的就是为了避免内存溢出【Session内容相比Cookie较复杂，所以如果大量Session放在服务器中会导致内存溢出】，有一个超时时间属性`maxInactiveInterval`，默认是30分钟，过了超时时间都没有访问的就自动失效了，可以通过`getMaxInactiveInterval()`方法获取。修改方法如下：

- 1、在`tomcat/conf/web.xml`中修改。对所有的web应用都有效。默认是20分钟

  ```xml
  <session-config>
  	<session-timeout>20</session-timeout>
  </session-config>
  ```

- 2、在对应应用的web.xml中设置。发生冲突时以自己应用中的web.xml为准。

- 3、通过`setMaxInactiveInterval()`方法修改

  ```java
  //设置Session最⻓超时时间为60秒，这⾥的单位是秒
  httpSession.setMaxInactiveInterval(60);
  System.out.println(httpSession.getMaxInactiveInterval());
  ```





#### 2.2、Session的域对象特性

Session常见的API如下：

![image-20201128074433997](https://jihulab.com/Leslie61/imagelake/-/raw/main/pictures/2023/05/image-20201128074433997.png)

可以看到，Session和ServletContext有类似的方法，即Session也是一个域对象。只要Session对象没有被销毁，就可以通过它来实现通信。



#### 2.3、Session实现原理

我们的一个Session对应一个用户，一个浏览器的会话会产生一个Session，那么再用另一个浏览器打开相同的会话会产生另一个Session。即服务器能为不同的用户提供不同Session

由于HTTP是无状态协议，因此Session无法根据HTTP连接来判断是否为同一客户。**因此服务器向客户端发送一个名为JSESSIONID的Cookie，它的值为该Session的id【即`HttpSession.getId()`的返回值】**，Session根据该Cookie来判断是否为同一用户。

![image-20201128091027056](https://jihulab.com/Leslie61/imagelake/-/raw/main/pictures/2023/05/image-20201128091027056.png)

这个Cookie的MaxAge是-1，即只有在当前浏览器使用，不会存储在硬盘中

所以：

- 访问使用Session的网页应用1时，服务器会自动创建名为JSESSIONID的Cookie并颁发给用户浏览器。
- 使用同一浏览器访问服务器的网页应用2时，浏览器会将Cookie值传给服务器，服务器根据此得知该用户使用的是哪一个Session。
- 采用新的会话浏览器时，用户浏览器是没有对应Cookie的，所以服务器无法判断用户的Session。



#### 2.3、URL地址重写

如果浏览器禁止了Cookie，或者它本身不支持Cookie时【比如手机浏览器很多不支持】，对应的解决方法是采用**URL地址重写**。它的原理是将该用户的Session的id信息重写到URL地址中，服务器解析重写后的URL获取Session的id。

它使用的方法如下：

- `encodeURL(String url)`
- `encodeRedirectURL(String url)`

这两个方法会自动判断是否支持Cookie。如果支持，重写后的URL就不会带有JSESSIONID。



## 参考

- [Servlet第五篇【介绍会话技术、Cookie的API、详解、应用】](https://segmentfault.com/a/1190000013129480)
- [Servlet第六篇【Session介绍、API、生命周期、应用、与Cookie区别】](https://segmentfault.com/a/1190000013130309)
- [cookie和session的详解与区别](https://www.cnblogs.com/l199616j/p/11195667.html)



