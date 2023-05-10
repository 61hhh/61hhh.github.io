---
title: 将hexo博客部署到coding上
tags: hexo
categories: 博客工具
abbrlink: '6333e931'
date: 2020-04-14 15:56:03
---

### 前言

将博客部署到GitHub上后，我发现一个很大的问题——访问速度很慢！！！因此找了一下教程，实现双部署：GitHub对应海外，coding对应默认（其实也不可能有歪果仁看这个博客。。。）

由于网上的教程很多都是在coding改版前的，很多东西例如Pages服务、认证位置都有较大变动，因此我属实废了点功夫。。。



<!--more-->

### 配置coding

- 首先就是注册coding官网账号：[coding官网](https://coding.net/)
- 注册完成后创建新项目

<img src="https://jihulab.com/Leslie61/imagelake/-/raw/main/pictures/2023/04/He0fc2946326c4828a2c7a145c1e495b0m.png" style="zoom:80%;" />

![](https://jihulab.com/Leslie61/imagelake/-/raw/main/pictures/2023/04/Ha5b5fef975e14c3fb6869f25c14195d4y.png)

### 配置SSH

由于之前GitHub已经配置过SSH key了，因此可以直接用。

- 在C盘—用户—.ssh文件加下，找到之前的SSH key文件，打开复制

- 在coding个人设置—SHH公钥中粘贴

  ![](https://jihulab.com/Leslie61/imagelake/-/raw/main/pictures/2023/04/Hf5a8605e46b843c297e3b3565c0e9e2bn.png)

### 测试SSH

使用git bash测试

```
ssh -T git@git.coding.net 
//出现Hello username You've connected to Coding.net by SSH successfully!表示成功

```

若出现权限被拒绝，解决方案是：

```
ssh -T git@e.coding.net
//首次建立连接要求信任主机，输入yes回车就🆗了，我已经输入过因此不显示了
```

![](https://jihulab.com/Leslie61/imagelake/-/raw/main/pictures/2023/04/Hfa5c1e816c8d46dcb5be564ed4dfc999q.png)

### 配置Hexo

打开刚刚创建的项目，在右侧找到SSH，复制：

![](https://jihulab.com/Leslie61/imagelake/-/raw/main/pictures/2023/04/H607ff457a1a24d1c8a6312d2b22b4d03T.png)

打开我们的hexo项目根目录下的config.yml，找到部署对应的代码，粘贴：

![](https://jihulab.com/Leslie61/imagelake/-/raw/main/pictures/2023/04/Ha6a02a2497a14fd2aedcd4d57a4a22d7g.png)

配置完成后，部署代码：

```
hexo clean
hexo d -g
```

就可以在coding上查看到我们的代码了！

![](https://jihulab.com/Leslie61/imagelake/-/raw/main/pictures/2023/04/Hb5e753659ede42ea8235f0018e8b3ccd3.png)

### 开启静态页面功能

coding改版后，很多功能默认是不开启的，因此初始代码仓库界面只有上图的前三项，要实现Pages功能先要开启对应的功能模块，在项目的项目设置中打开，建议直接把功能全打开

![](https://jihulab.com/Leslie61/imagelake/-/raw/main/pictures/2023/04/H05f698a69b33482e8b52d296d36299ecJ.png)

然后就可以看到上面代码仓库图的那些功能了，找到持续部署，首先要完成**实名认证**才能创建页面，在团队管理—团队设置—高级设置 中完成实名认证。

![](https://jihulab.com/Leslie61/imagelake/-/raw/main/pictures/2023/04/Hf3070358fe8b456e84a09b50b694502fR.png)

完成实名认证后，就可以在持续部署—静态网页中创建了，输入项目名，选择部署来源（默认hexo的项目即可）

![](https://jihulab.com/Leslie61/imagelake/-/raw/main/pictures/2023/04/H22c48fed15774816829dbe39101fa2231.png)

点击立即部署，即可访问

![](https://jihulab.com/Leslie61/imagelake/-/raw/main/pictures/2023/04/Hae599665c7754e43ae9a9a82c5bedcf03.png)

### 配置域名

参照之前的域名设置，首先也是ping 该网指，将得到的IP地址在阿里云DNS解析—新手引导 中输入，得到的值修改一下配置CNAME，将原来的GitHub设为境外，coding默认，等一会配置解析完成

![](https://jihulab.com/Leslie61/imagelake/-/raw/main/pictures/2023/04/Ha280ebbad0d147bb8369142895327d1eJ.png)

在静态页面的右上角设置中，下拉找到自定义域名，加入我们的域名即可

![](https://jihulab.com/Leslie61/imagelake/-/raw/main/pictures/2023/04/Hf8584a439e2340f19f782883d5fbd54d3.png)

部署一下，就可以访问了，速度比起之前的GitHub Pages快了很多很多啊！