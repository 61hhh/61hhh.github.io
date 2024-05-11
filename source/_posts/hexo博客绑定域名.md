---
title: hexo博客绑定域名
tags: hexo
categories: 博客工具
abbrlink: 12cd500b
date: 2020-04-14 12:02:00
---

搭建的博客，默认域名是GitHub下的二级域名：`61hhh.github.io`，每次输入比较麻烦，而且缺少个性化，因此购买了一个域名，并绑定到博客上。

<!--more-->

### 域名选择

国内的域名服务商有很多，新网，腾讯云，阿里云等。我选择的是阿里云的万网，刚好看到新用户1元购活动，就在万网上购买了心仪的域名`salute61.top`，然后进入阿里云的`管理控制台`--`域名`就可以看到了，此时域名是未认证的状态，先按提示进行实名认证(一般2小时内就可以通过)。

### 域名解析

首先要获取我们的GitHub的IP地址，直接cmd中ping自己的博客地址就可以，然后在`域名`--`解析`中，点击新手引导，将得到的IP地址填到记录栏中，修改为CNAME和A类型

![](https://leslie1-1309334886.cos.ap-shanghai.myqcloud.com/obsidian/H762ccabff22a463ebdefb802e88344a4v.png)

### 添加CNAME文件

在hexo的source文件夹下创建CNAME文件(没有后缀！)，里面填写你的域名：

![](https://leslie1-1309334886.cos.ap-shanghai.myqcloud.com/obsidian/Hccac12360b894735bfa5e68ee16784c4J.png)

### github设置

打开GitHub，找到对应仓库github.io，在setting中下拉找到GitHub Pages，在custom domain中填写你的域名，至此域名的配置就算完成啦！

![](https://leslie1-1309334886.cos.ap-shanghai.myqcloud.com/obsidian/H0479f0ae8b5c4fddb0a32241d472c795E.png)

