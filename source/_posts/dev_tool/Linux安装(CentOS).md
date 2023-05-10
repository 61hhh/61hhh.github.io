---
title: Linux安装(CentOS)
tags: Linux
categories: 开发工具
comment: true
abbrlink: e0a94a43
date: 2021-11-26 13:56:36
---



## 1、安装vmware

直接在官网下载 `VMware workstation 15` 需要登陆账号，可以在官网链接

```
https://download3.vmware.com/software/wkst/file/VMware-workstation-full-15.5.7-17171714.exe
```

<img src="https://jihulab.com/Leslie61/imagelake/-/raw/main/pictures/2023/04/image-20230420230523862.png" alt="image-20230420230523862" style="zoom:80%;" />

按照图中的名称替换，下载对应的版本，然后正常安装即可，激活码直接网上搜就可以。

电脑的虚拟化技术需要开启不然启动会报错，进入对应主板的 bios 中，在 `ADVANCE` 中找到 `CPU Configuration` 修改 `Intel(VMX) Virtualization Technology` 为 `Enable` 即可。



## 2、安装CentOS

参考[人手一套Linux环境之：Windows版本教程](https://mp.weixin.qq.com/s/onVwwEQ1DAwbvK7qS2YNxg) 的操作安装 CentOS 环境

### 1. 下载镜像

可以在中国的镜像网站上下载，给两个示例：[阿里云镜像](http://mirrors.aliyun.com/centos/)、[华为云镜像](https://mirrors.huaweicloud.com/home)

先下载CentOS 7的镜像文件，建议下载7(不带后缀)，不要下载7.x【8之前的CentOS除了7其他都不再维护了】

<img src="https://jihulab.com/Leslie61/imagelake/-/raw/main/pictures/2023/04/image-20211124223025492.png" alt="image-20211124223025492" style="zoom: 80%;" />



在 VMware 中新建虚拟机

1. 安装选择自定义(高级)

2. 选择稍后安装操作系统（后面选择之前下载的 `.iso` 镜像文件）

3. 命名并选择虚拟机位置，按需分配

4. 网络选择NAT、磁盘选择分成一个

5. 其他全部默认即可。移除USB控制器、打印机、声卡（基本用不上）



### 2. 安装系统

启动虚拟机后如图进行CentOS配置。

<img src="https://jihulab.com/Leslie61/imagelake/-/raw/main/pictures/2023/04/image-20211124224147583.png" alt="image-20211124224147583" style="zoom: 67%;" />

- 系统时间、键盘、语言默认英文。看着比较直观
- 软件安装选择本地文件、最小化安装（后面再安装图形化界面）
- 分区自动选择、网络连接暂不开启
- 点击开始安装后，在上面配置 ROOT 密码、创建一个用户配置用户名密码



#### 配置静态IP

- 在 VMWare的编辑中找到虚拟网络编辑器，选择 VMnet8，修改参数

  选择 NAT 模式、不勾选本地DHCP分配IP地址、设值子网IP段 `192.168.61.0` 和子网掩码 `255.255.255.0`（记住此时的子网IP）

  在NAT设值中配置网关IP `192.168.61.2`，网关IP不能和宿主机中配置的一致（记住网关IP）

  <img src="https://jihulab.com/Leslie61/imagelake/-/raw/main/pictures/2023/04/image-20230420230508299.png" alt="image-20230420230508299" style="zoom:80%;" />

- 点击应用-确定后保存退出，在控制面板的网络适配器中配置宿主机 VMnet8 的 IPv4 属性并保存

  IP：`192.168.61.1`、子网掩码：`255.255.255.0`、 网关：`192.168.61.2`

  <img src="https://jihulab.com/Leslie61/imagelake/-/raw/main/pictures/2023/04/image-20230420230544298.png" alt="image-20230420230544298" style="zoom:80%;" />

- 在 `etc/sysconfig/netword-scripts` 目录下编辑 `ifcfg-ens32` 文件（有叫33的情况）

  BOOTPROTO 设置为 static、ONBOOT 设置为 yes、配置 IPADDR、NETMASK、GATEWAY、DNS等

  <img src="https://jihulab.com/Leslie61/imagelake/-/raw/main/pictures/2023/04/image-20230420230556909.png" alt="image-20230420230556909" style="zoom:80%;" />

- 配置完成后 wq 保存退出，`systemctl restart network`重启 network 服务，通过 `ping` 指令验证网络连通性

  <img src="https://jihulab.com/Leslie61/imagelake/-/raw/main/pictures/2023/04/image-20230420230612538.png" alt="image-20230420230612538" style="zoom:80%;" />

- 至此虚拟机网络配置完毕，通过 `ifconfig` 指令查看网络信息（如果提示命令找不到，可以通过 `yum install net-tools` 安装）

  <img src="https://jihulab.com/Leslie61/imagelake/-/raw/main/pictures/2023/04/image-20230420230625244.png" alt="image-20230420230625244" style="zoom:80%;" />

#### 配置图形化界面

正常安装完成后进入是命令行界面，可以参考知乎上黑马程序员发的[回答](https://zhuanlan.zhihu.com/p/126601630)安装图形界面

<img src="https://jihulab.com/Leslie61/imagelake/-/raw/main/pictures/2023/04/image-20230420230639896.png" alt="image-20230420230639896" style="zoom:80%;" />

命令行模式切换为图形化桌面步骤如下：

- 首次安装后，启动centOS 7系统，通过root用户登录命令行

- 使用指令：`systemctl get-default` 查看centOS 7的默认启动模式。

  ```
  multi-user.target   #命令行启动模式
  graphical.target	#图形化界面启动模式
  ```

  使用`cat /etc/inittab`查看配置文件：

  <img src="https://jihulab.com/Leslie61/imagelake/-/raw/main/pictures/2023/04/image-20211124230004437.png" alt="image-20211124230004437" style="zoom: 80%;" />

- 使用`systemctl set-default graphical.target`修改centOS 7的默认启动模式为图形化界面模式

  <img src="https://jihulab.com/Leslie61/imagelake/-/raw/main/pictures/2023/04/image-20211124230318153.png" alt="image-20211124230318153" style="zoom:80%;" />

- 通过`yum -h`检查yum命令是否支持；使用`ping www.baidu.com`测试网络（使用NAT模式可以ping通）

- 通过yum命令`yum groupinstall "GNOME Desktop" "Graphical Administration Tools"`获取并且安装图形界面GNOME的程序包

  <img src="https://jihulab.com/Leslie61/imagelake/-/raw/main/pictures/2023/04/image-20211124233403418.png" alt="image-20211124233403418" style="zoom: 80%;" />

- 安装成功后，重启CentOS 7系统，检验GUI界面效果

  <img src="https://jihulab.com/Leslie61/imagelake/-/raw/main/pictures/2023/04/image-20211124233738485.png" alt="image-20211124233738485" style="zoom: 50%;" />

- 后续要删除可视化桌面用 `yum groupremove xxx` 即可



#### 远程连接

要远程连接，必须开放指定端口，或者关闭防火墙，通过如下指令操作

```shell
firewall-cmd --zone=public --add-port=22/tcp --permanent
# zone:作用域   add-port:开放的端口,端口/协议   permanent:永久生效
systemctl stop firewalld #直接关闭防火墙
```

<img src="https://jihulab.com/Leslie61/imagelake/-/raw/main/pictures/2023/04/image-20230420230723728.png" alt="image-20230420230723728" style="zoom:80%;" />



### 安装VMwareTools

在虚拟机选项中看到 `重新安装VMware Tools` 是置灰的

在安装虚拟机的时候下面会有提示安装VMwareTools，不过正在安装的时候点不了，显示光盘正在使用，可以启动后点。

然后在图形化界面的文件夹可以看到有个左侧VMware Tools。执行cp命令复制文件到`/opt`目录下，该目录存放的是与系统无关的程序，即用户级的程序

<img src="https://jihulab.com/Leslie61/imagelake/-/raw/main/pictures/2023/04/image-20211124234713082.png" alt="image-20211124234713082" style="zoom:67%;" />

在opt文件夹下`tar -zxvf`解压，进入解压得到的文件中，选择都回车选默认即可，安装完成即可~

<img src="https://jihulab.com/Leslie61/imagelake/-/raw/main/pictures/2023/04/image-20211124235149228.png" alt="image-20211124235149228" style="zoom:67%;" />
