---
title: SSH连接虚拟机Linux
tags: ssh
categories: 学习
abbrlink: 6e919bfb
date: 2020-07-08 15:56:05
---

看到网上的一个项目部署视频，提到配置虚拟机的Linux服务器，由于之前Linux课已经有现成的Ubuntu系统，网络配置也已经完成，只需要配置远程连接即可

<!--more-->

### 配置原料：

- Window：宿主机、ssh客户端
- VMware：Ubuntu系统、ssh服务

### 前提条件：

- 确定网络配置完成：Windows——ipconfig指令；Linux——ifconfig指令（都是在命令行中打开）
- 确定宿主机和虚拟机可以互相ping通

### 操作步骤：

1. 安装openssh-server。Linux中一般已安装了openssh-client，但是没有安装openssh-server（可以用ssh localhost检查一下），使用指令`sudo apt-get install openssh-server`安装即可。

   我在安装时出现报错

   ![](http://img2.salute61.top/ssh1.png)

   发现是系统自带的openssh-client版本，与要安装的openssh-server所依赖的版本不同，所以先安装依赖的版本`sudo apt-get install openssh-client=1:7.6p1-4`，出现以下提示：

   ```
   正在读取软件包列表... 完成
   正在分析软件包的依赖关系树       
   正在读取状态信息... 完成       
   建议安装：
     keychain libpam-ssh monkeysphere ssh-askpass
   下列软件包将被【降级】：
     openssh-client
   升级了 0 个软件包，新安装了 0 个软件包，降级了 1 个软件包，要卸载 0 个软件包，有 5 个软件包未被升级。
   需要下载 611 kB 的归档。
   解压缩后会消耗 0 B 的额外空间。
   您希望继续执行吗？ [Y/n] y
   获取:1 http://cn.archive.ubuntu.com/ubuntu bionic/main amd64 openssh-client amd64 1:7.6p1-4 [611 kB]
   已下载 611 kB，耗时 3秒 (191 kB/s)      
   dpkg: 警告: 即将把 openssh-client 从 1:7.6p1-4ubuntu0.3 降级到 1:7.6p1-4
   (正在读取数据库 ... 系统当前共安装有 164860 个文件和目录。)
   正准备解包 .../openssh-client_1%3a7.6p1-4_amd64.deb  ...
   正在将 openssh-client (1:7.6p1-4) 解包到 (1:7.6p1-4ubuntu0.3) 上 ...
   正在设置 openssh-client (1:7.6p1-4) ...
   正在处理用于 man-db (2.8.3-2ubuntu0.1) 的触发器 ...
   ```

   再次执行`sudo apt-get install openssh-server`即可安装成功

2. 使用putty尝试连接成功

   ![](http://img2.salute61.top/ssh2.png)

