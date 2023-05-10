---
title: Hexo迁移与同步
tags: hexo
categories: 博客
abbrlink: 60a54483
date: 2021-11-15 09:57:14
---

由于现在更多使用办公电脑了，自己的笔记本彻底成了游戏本了，最近又想把记笔记捡起来，所以就将原来的`hexo`博客迁移过来。顺便再熟悉一下安装过程。

<!--more-->

## 1.hexo迁移

首先安装必备的环境：`node`和`git`，配置GitHub的`ssh key`，按照`hexo`安装的基本步骤执行。`hexo init`生成基本的目录。

![image-20211115001252492](http://img2.salute61.top/PicGo/image-20211115001252492.png)

同时看看原来的目录结构，对比一下：

![image-20211115000427145](http://img2.salute61.top/PicGo/image-20211115000427145.png)

- 首先：`.idea`和`.vscode`是使用对应编辑器产生的，可以忽略；`node_modules`是`npm`的依赖包文件，可以忽略
- public：是`hexo`生成的静态文件，即博客所展示的文件
- _config.yml：是全局的配置文件，**【需要拷贝】**
- package_json：框架的参数即相关依赖，有它才能安装`node_modules`，**【需要拷贝】**
- scaffolds：本意是 “脚手架” 的意思，这里引申为模板文件夹。当 `hexo new  ` 的时候，Hexo 会根据该文件夹下的对应文件进行初始化构建，**【需要拷贝】**
- source：用户创建的博客相关文件，如_post目录就是博客的md文件存放位置，**【需要拷贝】**
- themes：下载的主题，要同步的话**【需要拷贝】**
- .gitignore：用于声明不被git记录的文件，**【需要拷贝】**

即拷贝原电脑项目文件中的`_config.yml`、`themes`、`source`、`scaffolds`、`package.json`、`.gitignore`到新电脑新建的文件夹中，已有的选择覆盖即可。

执行如下指令：

```shell
npm install #安装node_modules依赖
npm install hexo-deployer-git --save #安装部署git的服务
```

本地测试一下：

```shell
hexo g #生成静态文件
hexo s #起一个本地服务测试一下
```

<img src="http://img2.salute61.top/PicGo/image-20211115002949384.png" alt="image-20211115002949384" style="zoom:80%;" />

成功运行！

现在就可以在新电脑上开始写东西了~



## 2.多端同步

说到多端同步记笔记，自然会想到现有的有道云笔记、印象笔记、notion等等，它们也是多端协作笔记工具，不过hexo生成博客提交的是渲染之后的html文件，和这些有所不同。所以自然会想到另一个同步写作的工具——Git。

如图所示，master分支提交的是hexo渲染后的文件，而不是我们本地目录所见的

<img src="http://img2.salute61.top/PicGo/image-20211115003738030.png" alt="image-20211115003738030" style="zoom:80%;" />

网上搜到的hexo多端写作的方式，基本上都是在仓库再创建一个hexo分支，将本地的基础文件（上面所提到的那些）上传。然后不同终端需要记笔记的时候，先切换到hexo分支，拉取最新的代码，然后写了提交。比较像我们做开发项目的流程。

个人感觉这样说实话没啥必要。环境迁移好了之后，真正会修改变动的，基本上只有笔记对应的md文件，因此要同步的也就是md文件即可。目前有很多的同步工具，如OneDrive、坚果云等都很好用。以OneDrive为例，将`_post`目录下的md文件拷贝到OneDrive中，就可以实现多端的文件编辑，就算想修改主题啥的，同步一下`_config.yml`文件即可。
