---
title: 解决hexo部署GitHub报错问题
tags: hexo
categories: 博客工具
abbrlink: c23396ba
date: 2020-07-02 21:29:34
---

解决GitHub部署遇到的一个小问题，虽然小问题却也困扰了一晚上，还要多积累啊。。。

<!--more-->

问题描述：

之前写的一篇博客上传了就没管了，结果在网站上压根没有，重新`npm run deployee`了两遍还是没有，仔细一看才发现部署信息提示报错了（很奇怪：有时有有时无。。）——在hexo d部署时出现了`ssh: connect to host github.com port 22: Connection timed out`问题。

<img src="https://leslie1-1309334886.cos.ap-shanghai.myqcloud.com/obsidian/image-20230427165954014.png" alt="image-20230427165954014" style="zoom:80%;" />

遗憾的是第一次看见时我跑偏了。。只关注了下面的`Please make sure you have the correct access rights and the repository exists.`描述，然后找解决问题，发现是git服务器没有存储本地ssh密钥。因此执行了一遍操作：

- 找到.ssh文件夹（C:\User\用户名\.ssh），删除其中的known_host（直接删除）
- 在Git的bin目录下（一般是C:\Program File\Git\Bin）找到bash.exe输入`ssh-keygen -t rsa -C "git的username"`，成功就返回一些提示信息，都直接yes回车，然后生成了SSH KEY，即.ssh/id_rsa.pub文件
- 将id_rsa.pub中的内容赋值，在GitHub的setting中找到SSH keys复制添加
- 在bash.exe中输入`ssh -T git@github.com`验证即可

然鹅我最后出现的是：`Hi 61hhh! You've successfully authenticated, but GitHub does not provide shell access.`，一搜说出现这个没啥影响，好的。

再次hexo d没报错，结果还是没有，再执行hexo d又报错了：

<img src="https://leslie1-1309334886.cos.ap-shanghai.myqcloud.com/obsidian/image-20230427170007989.png" alt="image-20230427170007989" style="zoom:80%;" />

搜到另外的操作：

- 在.ssh文件夹下使用bash，指令`vim config`，然后:wq退出

  ```
  Host github.com
  User 注册github的邮箱
  Hostname ssh.github.com
  PreferredAuthentications publickey
  IdentityFile ~/.ssh/id_rsa
  Port 443
  ```

- 再执行`ssh -T git@github.com`，出现提示回车即可

然后依旧port 443报错，那么就不是这个端口的问题了。。改回默认的22端口，然后换个操作：

- 打开控制面板，打开：系统和安全—>Windows Defender防火墙—>左侧高级设置—>入站规则—>新建规则
- 依次选：端口—>特定本地端口22—>允许连接—>域、专用、公用默认都选上—>名称描述自己设置

提示如下图，操作完成后可以看到如图2：

<img src="https://leslie1-1309334886.cos.ap-shanghai.myqcloud.com/obsidian/image-20230427170029473.png" alt="image-20230427170029473" style="zoom:80%;" />

<img src="https://leslie1-1309334886.cos.ap-shanghai.myqcloud.com/obsidian/image-20230427170044822.png" alt="image-20230427170044822" style="zoom:80%;" />

根本的问题是：GitHub的ssh连接用到了22端口而防火墙并没有开放。（我也没动过22端口。。。真离谱）

再次尝试hexo d部署没有问题，在GitHub的代码仓库中也找到了生成的静态html文件，问题解决！











































