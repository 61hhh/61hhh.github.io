---
title: 用hexo+github Page搭建博客
tags: hexo
categories: 博客
abbrlink: 6d909da5
date: 2020-04-10 08:00:00
---
基本原理：Hexo是github上一个优秀的开源博客框架，支持markdown解析文章，有多种第三方主题插件供选择。先由hexo将.md文件生成静态网页.html文件，然后上传到你创建的个人GitHub仓库，这个仓库比较特殊，相当于是github为我们提供的展示网页的资源挂载库。因此hexo+github全程的搭建免费且便捷。我们只需要自己购买一个域名解析到对应的github-page就行了。


<!--more-->

### 1 前言

#### 1.1想法

本着好玩感兴趣的想法尝试弄一个个人博客，毕竟以前好多课考前赶的笔记都是手写的，考完试课程结束笔记本也找不到了。。。用博客的话可以写点东西留着。


#### 1.3 GitHub page搭建的优缺点：

1. 全是静态文件，访问速度快
2. 免费快捷，并且也不需要服务器和后台
3. 可以自由绑定自己的域名
4. 数据基于github版本管理，安全可靠，还能学习团队协作
5. 不适合 大型网站，因为它没有使用数据库，每次运行都遍历全部文件
6. 生成的是静态网页，要添加动态功能只能使用外部服务


### 2 准备工作

<1>一个github账号（github网站注册即可）

<2>安装git bash

<3>安装nodejs、hexo

#### 2.1安装git bash

Git是目前世界上最先进的分布式版本控制系统，无论是我们目前的搭建还是以后做项目都必须要用，下载好后建议使用git bash，而不是git GUI，有助于对指令的理解

- [安装地址](https://gitforwindows.org/)，直接下载安装即可

  ```
  git --version（或git -v）查看是否安装成功
  ```

- 后续若要学习git，推荐一个很全面的参考教程 [*Git*简介 - 廖雪峰的官方网站](https://www.baidu.com/link?url=Z8O3Sg4igVflUvqE5-hwJJjzkB34zZiXH2AEdNsItuC_Avh0lVB4MP9gn-e0CsVqqpXtcMx_--570lKkiS0xUwmX3Mqw3url-J6PF71I-i7&ck=7290.9.0.0.0.121.268.0&shh=www.baidu.com&sht=baidu&wd=&eqid=982d1239000645b1000000055e734703)

​		<img src="http://img.salute61.top/git%20--version.png" style="zoom:70%;"/>



#### 2.2安装NodeJs和Hexo

<1>hexo是基于nodejs的静态博客，安装要用到npm工具

- [Node.js安装包及源码](https://nodejs.org/en/download/)，按个人配置直接安装即可

​		<img src="http://img.salute61.top/node.png" style="zoom:80%;" />

<2>先准备一个文件夹安装hexo（以我的D:\Blog61\HG_Blog为例），在此处git bash

- 由于hexo用npm正常安装会出现卡住的情况，我们可以换源，采用淘宝的npm源：

  ```
  npm config set registry  https://registry.npm.taobao.org 
  ```

-  安装hexo命令和查看版本命令：

  ```
  安装：npm -i g hexo
  查看版本：hexo -v
  ```

​		<img src="http://img.salute61.top/hexo-v.png" style="zoom: 67%;" />

- 安装后新建一个文件夹存放你的博客（我的是D:\Blog61\HG_Blog\HEXO_File）初始化：hexo init，完成后可以看到文件

  <img src="http://img.salute61.top/blogfile.png" style="zoom:80%;" />

- 文件含义：

  - .deploy_git是连接git仓库后生成的文件

  - node_modules存放依赖包
  - public即为由hexo将博客生成的相关html静态文件，是要提交到github上的
  - scaffolds是一些通用的markdown模板
  - source是创建文章的地方，hexo命令生成文章在source/_post下
  - themes是个人博客的主题
  - _config.yml是博客网站的配置



### 3GitHub创建仓库连接

#### 3.1创建仓库

- 新建一个仓库，命名为username.github.io(username即为自己的GitHub账号名，我的是61hhh.github.io )，每个GitHub账号只能创建一个这样可以直接按域名访问的仓库
- 创建成功后默认有一些示例代码，还有readme.md文件

注意：

1. 命名规则必须为username.github.io，这样才能保证访问
2. 注册账号的邮箱要验证，后面配置SSH Key要用到

#### 3.2绑定域名

- 绑定域名与否都可以，不绑就采用默认的username.github.io来访问（我就没有绑定域名）

- 绑定域名首先要注册一个域名，在随意网站上购买，godaddy、阿里都行
- 配置域名有两种方式：CNAME和A记录，CNAME填写域名，A记录填写IP（详细内容等以后绑定域名再加）

#### 3.3配置SSH Key

- 采用Github page搭建大概原理是对仓库操作，然后提交到github仓库，直接采用用户名密码方式不够安全，因此配置SSH key可以解决本地和服务器的连接问题

- 在git bash中输入：

  ```
  ssh-keygen -t rsa -C "youremail@example.com" 
  ```

  可以在目标文件中找到生成的对应id_rsa.pub文件，用notepad++打开，复制

  ![](http://img.salute61.top/C%E7%9B%98.ssh%E6%96%87%E4%BB%B6.png)

- 或者在bash中输入：

  ```
  cd !/.ssh （切换目录）
  cat id_rsa.pub（查看key）
  ```

- 打开个人github账号，找到settings，新建SSH key，粘贴

  <img src="http://img.salute61.top/GitHub-ssh.png" style="zoom: 30%;" />

- 填好后，在git bash中输入：

  ```
  ssh -T git@github.com
  ```

  <img src="http://img.salute61.top/ssh-T.png" style="zoom:70%;" />

- 要提交就要指明用户是谁，所以要git config设置，--global表示全作用域的

  ```
  git config --global user.name "61hhh"
  
  git config --globaluser.email "1587403870@qq.com"
  ```

  

### 4 修改config上传到github

#### 4.1 编辑配置文件

- 编辑器打开_config.yml文件，简单修改一下配置（以后更多功能的增加都要记得编辑配置）

  ```
  deploy:
  
  	type: git
  
  	repo: git@github.com/username/username.github.io
  
  	branch: master
  ```

- 回到git bash中，在blog文件夹中执行

  ```
  hexo clean（清除缓存文件db.json和生成的静态文件public）
  
  hexo generate（生成网站静态文件到public文件夹）
  
  hexo server（启动本地服务器，用于预览主题）
  ```

  注：hexo 3.0吧服务器独立，要单独安装：

  ```
  npm i hexo-server
  ```

- 打开浏览器输入：http://localhost:4000，即为初始的博客界面

  

#### 4.2上传到github

- 安装配置，确保文章能上传到github，此指令会生成上面的deploy_git文件：

  ```
  npm install hexo-deployer-git --save
  ```

- 执行指令（建议每次编辑修改了都执行一遍）

  ```
  hexo clean
  
  hexo generate (hexo g)
  
  hexo deploy (hexo d)
  ```

  注：deploy会要求输入github账户密码

- 之后在浏览器输入http://61hhh.github.io即可看到个人博客

### 5.修改配置主题

- hexo默认主题是landscape，可以在[官方主题网站](https://hexo.io/themes/)更换，选自己喜欢的主题

- 在blog文件夹中：

  ```
  git clone  https://github.com/xx/xxx.git  themes/xxx 
  ```

- clone的文件在blog文件夹的themes目录，修改_config.yml文件的themes：landscape为下载的主题themes:xxx，然后上传提交即可

   

### 6 写博客

- 新建文章：

  ```
  hexo new '文章名'
  ```

- 该指令会在_posts文件夹下生成相关md文件，对md文件编辑可以开始写博客了

- 具体的文章编辑可以参照[官网的介绍](https://hexo.io/zh-cn/docs/writing.html)

- 工具可以网上查找md编写工具

  tips：默认情况下，生成的博文目录会显示全部的文章内容，在指定位置加上代码可使文章显示指定摘要

  ```
  <!--more-->
  ```

### 7 其他操作

#### 7.1 常用指令

常用的指令上面已经基本介绍了，再讲一下大概功能

```
hexo new "postName" #新建文章
hexo new page "pageName" #新建页面
hexo generate #生成静态页面至public目录
hexo server #开启预览访问端口（默认端口4000，'ctrl + c'关闭server）
hexo deploy #将.deploy目录部署到GitHub
hexo help  # 查看帮助
hexo version  #查看Hexo的版本
```

#### 7.2 更多操作

​	大部分操作都要求针对_config.yml文件进行配置，在此列举一些常用的（暂时没有实现。。。因为没学js。。。）

​	大部分的模块网上都有，可以自己找相关的按操作提示进行

##### 	7.2.1 评论

- 添加一个第三方评论系统
- 在当前主题的配置文件中找到comment，添加代码
- 注册评论系统，获取代码，在当前主题的layout下找到commnet新建的对应ejs模板
- 编辑，再部署，即可。

##### 	7.2.2 统计

- 在主题中配置analytics系统，添加代码后在对应ejs模板中编辑代码
- 注册baidu analytics或者google analytics，获取tracked_id，和跟踪代码
- 将tracked_id和url写入配置中，编辑部署即可

##### 	7.2.3 404页面

- github page有提供404页面的指引：[Custom 404 Pages](https://help.github.com/articles/custom-404-Pages)

- 直接在根目录下创建404.html（根目录指的是HEXO_File/source）

- 404.html代码可以参照网上，推荐使用[腾讯公益404](http://www.qq.com/404)

  注：_config.yml中的permalink_defaults属性不需要修改



### 8 小结

​	本来建博客是因为领了阿里云服务器，想尝试建博客，结果网上找教程跑偏了。。。建了个不需要服务器就能访问的博客，建都建了干脆搞完，下一步可以考虑部署hexo博客到服务器，或者用LAMP搭建一个真正意义上的服务器。

​	感觉必须要学习前端知识了（虽然之前学过html和css。。。不过已经忘光了==这边不就是没学嘛。。。），先学习一下前端，再来改进这个博客。
​    PS：为了优化博客踩了几天的坑，结果才发现[hexo官方文档](https://hexo.io/zh-cn/docs/)中有相关建站和一些进阶操作的指南。。。

### 9 REFERENCE

- [如何搭建一个独立博客——简明Github Pages与Hexo教程](https://www.jianshu.com/p/05289a4bc8b2)
- [hexo官方说明文档](https://hexo.io/zh-cn/docs/)