---
title: Typora+PicGo简化图床操作
tags: blog
categories: 博客工具
abbrlink: f39da986
date: 2020-10-09 14:32:23
---

## 前言

每次写博客最费劲的问题就是图片。。。直接截图的是本地图片，上传到博客无法显示，必须要用图床工具，之前我用的是七牛云的图床，但是每次还是很麻烦：**截图-->保存-->上传-->复制外联外链-->粘贴外链**

<img src="https://leslie1-1309334886.cos.ap-shanghai.myqcloud.com/obsidian/PicGo1.png" style="zoom:50%;" />

<!--more-->

## 准备



- markdown编辑器Typora，可以点击[官网](https://www.typora.io/)下载

- 图床工具PicGo，在它的[GitHub](https://github.com/Molunerfinn/PicGo/releases)上可以下载

- 自己的图床，这个就随意了，选PicGo支持的就行

  > PicGo支持的7种图床：七牛云，腾讯云COS，又拍云，GitHub，阿里云OSS，SM.MS，imgur 



## PicGo设置

### 1、配置图床信息

以我的七牛云图床为例，配置一下对应信息，找到图床设置-->七牛图床

![](https://leslie1-1309334886.cos.ap-shanghai.myqcloud.com/obsidian/PicGo3.png)

- 前两个AccessKey和SecretKey在个人中心的密钥管理中配置（如上图）

- 设定存储空间名：即为你设置的图床bucket的名字

- 设定访问网址：就是你的存储空间的域名，从图床bucket的“空间概览”里找到（要加上http://）

- 存储区域：你的存储区域。华东`z0`华北`z1`华南`z2`北美`na0`东南亚`as0`

- 存储路径：存储后的形式，要加/

  如图就是以`PicGo/`为路径上传的图片：

  ![](https://leslie1-1309334886.cos.ap-shanghai.myqcloud.com/obsidian/PicGo4.png)



### 2、打开PicGo的server服务

在PicGo设置/设置Server中找到对应设置，默认设置如图，基本上与不需要改，只要确定开了就行：

<img src="https://leslie1-1309334886.cos.ap-shanghai.myqcloud.com/obsidian/PicGo2.png" style="zoom:67%;" />





## Typora设置

找到：文件-->偏好设置-->图像，进行设置

![PicGo5](https://leslie1-1309334886.cos.ap-shanghai.myqcloud.com/obsidian/PicGo5.png)

![PicGo6](https://leslie1-1309334886.cos.ap-shanghai.myqcloud.com/obsidian/PicGo6.png)



## 开始使用！

使用的方式很多：

1. 将本地图片拖到Typora上，它会自动上传

2. 任意截图，然后粘贴，然后出现上传图片，点击即可，效果如图：

   ![image-20201009171350737](https://leslie1-1309334886.cos.ap-shanghai.myqcloud.com/obsidian/image-20201009171350737.png)

3. 采用快捷键插入图片：**Ctrl + Shift + I**    或者   `![]() `都可以，效果如图：

   ![image-20201009171609612](https://leslie1-1309334886.cos.ap-shanghai.myqcloud.com/obsidian/image-20201009171609612.png)
