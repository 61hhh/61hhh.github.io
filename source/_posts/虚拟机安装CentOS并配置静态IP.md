---
title: 虚拟机安装CentOS并配置静态IP
tags: CentOS
categories: 环境
comment: true
abbrlink: e0a94a43
date: 2021-11-26 13:56:36
---

安装步骤

- 在[CentOS阿里云镜像](http://mirrors.aliyun.com/centos/)下载对应iso文件
- 按步骤自定义安装
- 配置并配置图形化界面
- 配置虚拟机的静态IP

<!--more-->

## 安装

先下载CentOS 7的镜像文件，建议下载7(不带后缀)，不要下载7.x【8之前的CentOS除了7其他都不再维护了】

<img src="http://img2.salute61.top/image-20211124223025492.png" alt="image-20211124223025492" style="zoom: 80%;" />

虚拟机中选择安装—》自定义。按步骤进行即可

1. 安装

   <img src="http://img2.salute61.top/image-20211124223310954.png" alt="image-20211124223310954" style="zoom:80%;" />

2. 选择稍后安装

   <img src="http://img2.salute61.top/image-20211124223429477.png" alt="image-20211124223429477" style="zoom:80%;" />

3. 命名并选择虚拟机位置，按需分配

4. 网络选择NAT即可（选择桥接模式按教程配置静态IP总有问题。）

5. 其他全部默认即可。移除USB控制器、打印机、声卡（基本用不上）



## 配置

如图进行CentOS配置。

- 系统时间、键盘、语言默认英文。看着比较直观
- 软件安装选择本地文件、最小化安装（后面再安装图形化界面）
- 分区自动选择、网络连接开启
- 配置ROOT的密码、创建一个用户配置用户名密码

<img src="http://img2.salute61.top/image-20211124224147583.png" alt="image-20211124224147583" style="zoom: 67%;" />

### 配置图形化界面

参考知乎上黑马程序员发的文章。命令行模式切换为图形化桌面步骤如下：

- 首次安装后，启动centOS 7系统，通过root用户登录命令行

- 使用指令：`systemctl get-default`查看centOS 7的默认启动模式。`cat /etc/inittab`

  ```
  multi-user.target   #命令行启动模式
  graphical.target	#图形化界面启动模式
  ```

  使用`cat /etc/inittab`查看配置文件：

  <img src="http://img2.salute61.top/image-20211124230004437.png" alt="image-20211124230004437" style="zoom: 80%;" />

- 使用`systemctl set-default graphical.target`修改centOS 7的默认启动模式为图形化界面模式

  ![image-20211124230318153](http://img2.salute61.top/image-20211124230318153.png)

- 通过`yum -h`检查yum命令是否支持；使用`ping www.baidu.com`测试网络（使用NAT模式可以ping通）

- 通过yum命令`yum groupinstall "GNOME Desktop" "Graphical Administration Tools"`获取并且安装图形界面GNOME的程序包

  <img src="http://img2.salute61.top/image-20211124233403418.png" alt="image-20211124233403418" style="zoom:67%;" />

- 安装成功后，重启CentOS 7系统，检验GUI界面效果

  <img src="http://img2.salute61.top/image-20211124233738485.png" alt="image-20211124233738485" style="zoom: 50%;" />

### 安装VMwareTools

在安装虚拟机的时候下面会有提示安装VMwareTools，不过正在安装的时候点不了，显示光盘正在使用，可以启动后点。

然后在图形化界面的文件夹可以看到有个左侧VMware Tools。执行cp命令复制文件到`/etc/opt`目录下，该目录存放的是与系统无关的程序，即用户级的程序

<img src="http://img2.salute61.top/image-20211124234713082.png" alt="image-20211124234713082" style="zoom:67%;" />

在opt文件夹下`tar -zxvf`解压，进入解压得到的文件中，选择都回车选默认即可，安装完成即可~

<img src="http://img2.salute61.top/image-20211124235149228.png" alt="image-20211124235149228" style="zoom:67%;" />

## 配置静态IP

使用指令`ip addr`查看本机网络情况，第一项lo表示localhost环回地址，可以忽略。第二项ens32即为本虚拟机网卡设置，默认是没有配置好的(我这里是先配置了才截的图)

<img src="http://img2.salute61.top/image-20211125214246933.png" alt="image-20211125214246933" style="zoom:67%;" />

配置静态IP可以通过修改网卡ens32配置文件，指令如下：

```shell
vi /etc/sysconfig/network-scripts/ifcfg-ens32
```

配置内容如图，BOOTPROTO改为none、添加地址IPADDR、网关GATEWAY、子网掩码NETMASK、广播地址BROADCAST、以及DNS

<img src="http://img2.salute61.top/image-20211125214609526.png" alt="image-20211125214609526" style="zoom:67%;" />

配置完成后执行`systemctl restart network`重启网络，使得配置生效。然后可以ping一下宿主机和外网，如图都可以ping同说明网络配置成功。

<img src="http://img2.salute61.top/image-20211125215126468.png" alt="image-20211125215126468" style="zoom: 67%;" />

要远程连接，必须开放指定端口，或者关闭防火墙。

```shell
firewall-cmd --zone=public --add-port=22/tcp --permanent
# zone:作用域   add-port:开放的端口,端口/协议   permanent:永久生效
systemctl stop firewalld #直接关闭防火墙
```

打开XShell，添加会话，设置登录的用户名密码，第一次连接会生成密钥，保存后连接成功

<img src="http://img2.salute61.top/image-20211125215434351.png" alt="image-20211125215434351" style="zoom:67%;" />

<img src="http://img2.salute61.top/image-20211125215552674.png" alt="image-20211125215552674" style="zoom: 80%;" />

虚拟机二可以通过虚拟机一直接克隆，然后修改一下ens32文件的IPADDR属性即可。
