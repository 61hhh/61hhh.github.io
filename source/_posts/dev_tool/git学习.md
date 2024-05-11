---
title: git学习
tags: git
categories: 开发工具
abbrlink: e28ceec1
date: 2020-04-15 14:58:08
---

## 写在前面

这两天因为想升级博客主题，结果搞崩溃了好几次，然后发现我对于git指令很不熟悉，虽然以前用过，软工实验也写过报告，但是由于没有团队协作项目，使用起来不熟悉，着这个机会重新学习一下，不求精通，只是温习一下git的基本操作，结合之前的软工实验的git报告，加上网上教程，达到熟练掌握常用的指令即可。

参考：[Git教程—廖雪峰](https://www.liaoxuefeng.com/wiki/896043488029600)；[一小时学会Git](https://www.cnblogs.com/best/archive/2017/09/07/7474442.html)

推荐一个很有趣的网站，在教程评论下看到的：[Learn Git Braching](https://learngitbranching.js.org/?locale=zh_CN)

<!--more-->

## 1 Git安装与配置

### 1.1 Git简述

首先要说的是：`Git!=GitHub!!!`千万不要以为Git就是GitHub！一个是版本控制系统，一个是代码托管仓库。

Git是目前世界上最先进的分布式版本控制系统；并且Git是免费、开源的；最初Git是为辅助 Linux 内核开发的，来替代 BitKeeper，作者是Linux和Git之父李纳斯·托沃兹（Linus Benedic Torvalds）。

**官网**： https://git-scm.com/

**源码：** https://github.com/git/git/

### 1.2 搭建Git环境

#### 1.2.1Git安装

首先要在Git官网上下载对应系统的版本，然后按提示步骤完成安装

<img src="https://leslie1-1309334886.cos.ap-shanghai.myqcloud.com/obsidian/H5da6c37265a54867b1190bfc0b36e0d1j.png" style="zoom:80%;" />

安装完成后，鼠标右键就可以看到Git GUI和Git Bash了，推荐使用Git Bash，类Linux风格，而且使用命令行可以帮助我们熟悉Git的指令，至于GUI熟悉了指令以后可以自己摸索

**常用的Linux指令也可以在Git Bash执行：**

```
git --version//查看版本
cd //切换盘符
cd ..//回退到上级目录
pwd//打印当前目录路径
ll(ls)//列出目录中的文件
touch ***//新建一个***文件
rm ***//删除***文件
mkdir ** //新建文件夹
......
```

![](https://leslie1-1309334886.cos.ap-shanghai.myqcloud.com/obsidian/H5974392aa90748dca3543325057c141eJ.png)

#### 1.2.2 Git配置

使用`git config -l`可以查看Git环境配置

![](https://leslie1-1309334886.cos.ap-shanghai.myqcloud.com/obsidian/Hd516afc4940940db8e24c54761cefadfM.png)

查看不同级别配置文件：

```
#查看系统config
git config --system --list
#查看当前用户（global）配置
git config --global  --list
#查看当前仓库配置信息
git config --local  --list
```

Git相关配置文件：

```
1： /etc/gitconfig：包含了适用于系统所有用户和所有项目的值。 --system 系统级
2： ~/.gitconfig：只适用于当前登录用户的配置。--global 全局
3： 位于git项目目录中的.git/config：适用于特定git项目的配置。--local当前项目
注意：对于同一配置项，三个配置文件的优先级是1<2<3
```

**设置用户标识：**

安装Git后首先要做的事情是设置用户名和e-mail地址。这是非常重要的，因为每次Git提交都会使用该信息。

```
$ git config --global user.name "zhangguo"  #名称
$ git config --global user.email zhangguo@qq.com   #邮箱
```

以在配置时加上--global，设置为全局配置，用了这个参数，表示你这台机器上所有的Git仓库都会使用这个配置，当然也可以对某个仓库指定不同的用户名和Email地址。

## 2 Git理论基础

本部分我直接照搬了[一小时学会Git](https://www.cnblogs.com/best/archive/2017/09/07/7474442.html)，因为他讲的很详细。

### 2.1 Git工作区域

Git本地有三个工作区域：工作目录（Working Directory）、暂存区(Stage/Index)、资源库(Repository或Git Directory)。加上远程的git仓库(Remote Directory)就可以分为四个工作区域。其中相互关系为：

<img src="https://leslie1-1309334886.cos.ap-shanghai.myqcloud.com/obsidian/Ha7648ddd85f34d628d2e3155b0e63f07m.png" style="zoom:80%;" />

- Workspace：工作区，就是你平时存放项目代码的地方
- Index / Stage：暂存区，用于临时存放你的改动，事实上它只是一个文件，保存即将提交到文件列表信息
- Repository：仓库区（或本地仓库），就是安全存放数据的位置，这里面有你提交到所有版本的数据。其中HEAD指向最新放入仓库的版本
- Remote：远程仓库，托管代码的服务器，可以简单的认为是你项目组中的一台电脑用于远程数据交换

本地的三个区域确切的说应该是git仓库中HEAD指向的版本

<img src="https://leslie1-1309334886.cos.ap-shanghai.myqcloud.com/obsidian/Hcce1b8d54f634f8b94039a86e4710200r.png" style="zoom:80%;" />

- Directory：使用Git管理的一个目录，也就是一个仓库，包含我们的工作空间和Git的管理空间。
- WorkSpace：需要通过Git进行版本控制的目录和文件，这些目录和文件组成了工作空间。
- .git：存放Git管理信息的目录，初始化仓库的时候自动创建。
- Index/Stage：暂存区，或者叫待提交更新区，在提交进入repo之前，我们可以把所有的更新放在暂存区。
- Local Repo：本地仓库，一个存放在本地的版本库；HEAD会只是当前的开发分支（branch）。
- Stash：隐藏，是一个工作状态保存栈，用于保存/恢复WorkSpace中的临时状态。



### 2.2 Git操作流程

git的工作流程一般是这样的：

１、在工作目录中添加、修改文件；

２、将需要进行版本管理的文件放入暂存区域；

３、将暂存区域的文件提交到git仓库。

因此，git管理的文件有三种状态：已修改（modified）,已暂存（staged）,已提交(committed)

<img src="https://leslie1-1309334886.cos.ap-shanghai.myqcloud.com/obsidian/Ha8ec5d2890514721a77519937e88f24ew.png" style="zoom: 67%;" />

### 2.3 图解教程

Git的原理还是有点小复杂的，要看明白得费点功夫

[图解教程中文版](http://www.cnblogs.com/yaozhongxiao/p/3811130.html)

<img src="https://leslie1-1309334886.cos.ap-shanghai.myqcloud.com/obsidian/Hf9a115bf51cc4fa4add8ebdf5064940cg.png" style="zoom:80%;" />

## 3 Git操作

### 3.1 创建仓库

有两种方法可以创建版本库：

版本库又名仓库，英文名**repository**，你可以简单理解成一个目录，这个目录里面的所有文件都可以被Git管理起来，每个文件的修改、删除，Git都能跟踪，以便任何时刻都可以追踪历史，或者在将来某个时刻可以“还原”。

- 在本地创建项目目录
- 克隆远程仓库到本地

#### 3.1.1 本地创建

首先创建一个空目录，然后使用`git init`把这个目录变成Git可管理的仓库，可以看到过了一个隐藏文件.git，这个就是Git用来跟踪管理版本库的。

![](https://leslie1-1309334886.cos.ap-shanghai.myqcloud.com/obsidian/Hd4233891706a4f7ebc8b666732284b07j.png)

#### 3.1.2 克隆远程仓库

远程克隆就是利用`git clone "url"`形式将远程代码仓库的代码克隆到本地，完成后就可以看到对应文件夹

![](https://leslie1-1309334886.cos.ap-shanghai.myqcloud.com/obsidian/H162feeb4765d4f598e84f4bc16dea2b7S.png)



### 3.2 Git文件操作

#### 3.2.1 文件状态

版本控制就是对文件的版本控制，要对文件进行修改、提交等操作，首先要知道文件当前在什么状态，不然可能会提交了现在还不想提交的文件，或者要提交的文件没提交上。GIT不关心文件两个版本之间的具体差别，而是关心文件的整体是否有改变，若文件被改变，在添加提交时就生成文件新版本的快照，而**判断文件整体是否改变的方法就是用SHA-1算法计算文件的校验和**。

文件的四个状态：

<img src="https://leslie1-1309334886.cos.ap-shanghai.myqcloud.com/obsidian/Ha29b42020bb54910ad0af45dd70e43acv.png" style="zoom:80%;" />

- **Untracked**: 未跟踪, 此文件在本地文件夹中, 但并没有加入到git库, 不参与版本控制. 通过`git add` 状态变为`Staged`.
- **Unmodify**: 文件已经入库, 未修改, 即版本库中的文件快照内容与文件夹中完全一致. 这种类型的文件有两种去处, 如果它被修改, 而变为`Modified`. 如果使用`git rm`移出版本库, 则成为`Untracked`文件
- **Modified**: 文件已修改, 仅仅是修改, 并没有进行其他的操作. 这个文件也有两个去处, 通过`git add`可进入暂存`staged`状态, 使用`git checkout` 则丢弃修改过, 返回到`unmodify`状态, 这个`git checkout`即从库中取出文件, 覆盖当前修改
- **Staged**: 暂存状态. 执行`git commit`则将修改同步到库中, 这时库中的文件和本地文件又变为一致, 文件为`Unmodify`状态. 执行`git reset HEAD filename`取消暂存, 文件状态为`Modified`



#### 3.2.2 状态操作

##### 1.查看状态

可以通过指令查看文件状态：

```
git status //查看文件状态
//可以加filename查看具体文件状态
```

版本库（Repository）工作区有一个隐藏目录`.git`，这个不算工作区，而是Git的版本库。

Git的版本库里存了很多东西，其中最重要的就是称为stage（或者叫index）的暂存区，还有Git为我们自动创建的第一个分支`master`，以及指向`master`的一个指针叫`HEAD`。

在实际操作中，要随时掌握工作区状态，就要常用`git status`

##### 2.添加到暂存区

为什么Git比其他版本控制系统设计得优秀，因为Git跟踪并管理的是修改，而非文件。什么是修改？比如你新增了一行，这就是一个修改，删除了一行，也是一个修改，更改了某些字符，也是一个修改，删了一些又加了一些，也是一个修改，甚至创建一个新文件，也算一个修改。

将untracked状态的文件添加到暂存区：

```
# 添加指定文件到暂存区
$ git add [file1] [file2] ...
# 添加指定目录到暂存区，包括子目录
$ git add [dir]
# 添加当前目录的所有文件到暂存区
$ git add .
```

**举例：**

第一次修改 -> `git add` -> 第二次修改 -> `git commit`

当使用`git add`命令后，在工作区的第一次修改被放入暂存区，准备提交，但是，在工作区的第二次修改并没有放入暂存区，所以，`git commit`只负责把暂存区的修改提交了，也就是第一次的修改被提交了，第二次的修改不会被提交。

##### 3.移出暂存区

当我们发现某一个add到暂存区的文件有误时，可以执行如下指令从暂存区移除：

```
git rm --cached <file>
#直接从暂存区删除文件，工作区则不做出改变
```

或通过重写目录树移除add文件：

```
#如果已经用add 命令把文件加入stage了，就先需要从stage中撤销
git reset HEAD <file>...
```

更多移除的指令：

```
#移除所有未跟踪文件
#一般会加上参数-df，-d表示包含目录，-f表示强制清除。
git clean [options] 

#只从stage中删除，保留物理文件
git rm --cached readme.txt 

#不但从stage中删除，同时删除物理文件
git rm readme.txt 

#把a.txt改名为b.txt
git mv a.txt b.txt 
```



##### 4.commit提交

通过add只是将文件或目录添加到了index暂存区，使用commit将暂存区的文件提交到本地仓库，每次使用git commit 命令我们都会在本地版本库生成一个40位的哈希值，这个哈希值也叫commit-id：

```
# 提交暂存区到仓库区，-m 后面是本次提交的说明
$ git commit -m [message]
# 提交暂存区的指定文件到仓库区
$ git commit [file1] [file2] ... -m [message]
# 提交工作区自上次commit之后的变化，直接到仓库区，跳过了add,对新文件无效
$ git commit -a
# 提交时显示所有diff信息
$ git commit -v
# 使用一次新的commit，替代上一次提交
# 如果代码没有任何新变化，则用来改写上一次commit的提交信息
$ git commit --amend -m [message]
# 重做上一次commit，并包括指定文件的新变化
$ git commit --amend [file1] [file2] ...
```

##### **<代码提交到Git仓库步骤>**

1. 使用`git add`将文件加到缓存区

   执行该步骤没有任何显示，即正确执行

2. 使用`git commit`提交到本地仓库

   建议加上-m，写上每次提交的说明，团队项目方便以后查看。

3. 使用`git push origin master`将本地版本库推送到远程服务器（详细参数参照4.3.6 git push）

**注：**因为`commit`可以一次提交很多文件，所以你可以多次`add`不同的文件

```
$ git add file1.txt
$ git add file2.txt file3.txt
$ git commit -m "add 3 files."
```

基本

![](https://leslie1-1309334886.cos.ap-shanghai.myqcloud.com/obsidian/H0db03f9a49d4440795317da4b9af5dd0G.png)

##### 5.比较代码

git diff用于显示WorkSpace中的文件和暂存区文件的差异。用`git status`只能查看对哪些文件做了改动，如果要看改动了什么，可以通过`git diff`指令，比较本次修改的内容具体是啥

```
#比较本地工作区和暂存区
git diff
#比较暂存区的文件与之前已经提交过的文件
git diff --cached
#比较repo与工作空间中的文件差异
git diff HEAD~n
```

##### 6.提交日志

在实际工作中，我们不可能记得一个几千行的文件每次都改了什么内容，因此要借助指令查看提交历史。借助`git log`命令显示从最近到最远的提交日志，如果嫌输出信息太多，看得眼花缭乱的，可以试试加上`--pretty=oneline`参数。

```
#查看提交日志
git log [<options>] [<revision range>] [[\--] <path>…?]
# git log -1则表示显示1行。
# git log --graph以图形化的方式显示提交历史的关系，这就可以方便地查看提交历史的分支信息，当然是控制台用字符画出来的图形。
```

还可以使用history可以查看您在bash下输入过的指令

注：我们看到的一大串类似`1094adb...`的是`commit id`（版本号）就是之前说的SHA1计算出来的校验码

##### 7.版本回退

可能某一次提交并不是自己想要的，因此可以采用版本回退，回到上一个或者更早之前的版本

```
$ git reset --hard HEAD^
#HEAD指向的版本总是当前的版本
#还可以根据git log中的commmit id回到指定版本
```

Git的版本回退速度非常快，因为Git在内部有个指向当前版本的`HEAD`指针，当你回退版本的时候，Git仅仅是把HEAD从指向对应版本。

回退后又想恢复新版本，可以使用`git relog`查看记录的每一次命令，其中会记录这个仓库中所有的分支的所有更新记录，包括已经撤销的更新。，然后就可以恢复了

##### 8.删除/恢复

当我们提交代码到版本库后，如果对本地的代码进行了删除操作，通过`git status`查看到工作区与版本库就出现了不一致。

可能是就是要删除，就用如下指令：

```
git rm ***
git commmit -m "删除了***"
```

如果是操作失误：

```
git checkout -- ***
# git checkout其实是用版本库里的版本替换工作区的版本，无论工作区是修改还是删除，都可以“一键还原”。
```

**注：**从来没有被添加到版本库就被删除的文件，是无法恢复的！



## 4.远程仓库

Git是分布式版本控制系统，同一个Git仓库，可以分布到不同的机器上，打个比方：一个资源服务器链接多个主机，这些主机都可以从该服务器上下载资源。我们每个人的本机就类似于主机，托管平台，例如GitHub、Coding就类似于资源服务器。

同时相较于传统的代码都是管理到本机或者内网。 一旦本机或者内网机器出问题，代码可能会丢失，使用远端代码仓库将永远存在一个备份。同时也免去了搭建本地代码版本控制服务的繁琐。 云计算时代 Git 以其强大的分支和克隆功能，更加方便了开发者远程协作。

### 4.1 Github

GitHub应该是最著名的代码托管平台了，全世界的程序员都在使用，很多优秀的开源项目也都发布在上面，因此作为程序员熟悉GitHub对我们的学习进步有很大的帮助。

![](https://leslie1-1309334886.cos.ap-shanghai.myqcloud.com/obsidian/H5e4830bfd6b2494c8d816bbf8e12a29fE.png)

不过由于这是国外的托管平台，因此使用起来会有一些小问题：例如访问较慢、私有仓库收费等。

不过好像就在我写这篇文章的时候，GitHub私有仓库免费了

![](https://leslie1-1309334886.cos.ap-shanghai.myqcloud.com/obsidian/H17cc747c3d9d4f339a36ef3002fdc1a6O.png)

### 4.2 Coding

之前并不太了解这个，还是这段时间建博客，发现部署到GitHub访问很慢，查解决方法的时候，看到的。用了一下真的很快，在国内访问速度非常的快！功能类似于码云，可以创建私有仓库(<=5个)

![](https://leslie1-1309334886.cos.ap-shanghai.myqcloud.com/obsidian/H8e599157833f4fe68dcc694273416ed5u.png)



### 4.3 远程仓库操作

申请到了Git远程仓库的帐号并创建了一个空的远程仓库现在我们就可以结合本地的仓库与远程仓库一起协同工作了，模拟多人协同开发

#### 4.3.1 常用操作

```
# 下载远程仓库的所有变动
$ git fetch [remote]

# 显示所有远程仓库
$ git remote -v

# 显示某个远程仓库的信息
$ git remote show [remote]

# 增加一个新的远程仓库，并命名
$ git remote add [shortname] [url]

# 取回远程仓库的变化，并与本地分支合并
$ git pull [remote] [branch]

# 上传本地指定分支到远程仓库
$ git push [remote] [branch]

# 强行推送当前分支到远程仓库，即使有冲突
$ git push [remote] --force

# 推送所有分支到远程仓库
$ git push [remote] --all

#简单查看远程---所有仓库
git remote  （只能查看远程仓库的名字）
#查看单个仓库
git  remote show [remote-branch-name]

#新建远程仓库
git remote add [branchname]  [url]

#修改远程仓库
git remote rename [oldname] [newname]

#删除远程仓库
git remote rm [remote-name]

#获取远程仓库数据
git fetch [remote-name] (获取仓库所有更新，但不自动合并当前分支)
git pull (获取仓库所有更新，并自动合并到当前分支)

#上传数据，如git push origin master
git push [remote-name] [branch]
```

#### 4.3.2 远程git clone

远程操作的第一步，通常是从远程主机克隆一个版本库，这时就要用到`git clone`命令：

```
$ git clone <版本库的网址>
```

该命令会在本地主机生成一个目录，与远程主机的版本库同名。如果要指定不同的目录名，可以将目录名作为`git clone`命令的第二个参数：

```
#以之前的博客主题下载为例
#themes/ayer就是指定的目录名
git clone https://github.com/Shen-Yu/hexo-theme-ayer.git  themes/ayer
```

`git clone`支持多种协议，除了HTTP(s)以外，还支持SSH、Git、本地文件协议等：

```
git clone git@github.com:61hhh/JavaScript30day-challenge.git//SSH协议写法
```

#### 4.3.3 git remote

为了便于管理，Git要求每个远程主机都必须指定一个主机名。`git remote`命令就用于管理主机名。

不带选项的时候，`git remote`命令列出所有远程主机。

```
$ git remote

#使用-v选项，可以参看远程主机的网址。
$ git remote -v

#git remote show命令加上主机名，可以查看该主机的详细信息。
$ git remote show <主机名>

#git remote add命令用于添加远程主机。
$ git remote add <主机名> <网址>
```

#### 4.3.4 git fetch

一旦远程主机的版本库有了更新（即执行了commit），需要将这些更新取回本地，这时就要用到`git fetch`命令：

```
$ git fetch <远程主机名>
```

上面命令将某个远程主机的更新，全部取回本地。

`git fetch`命令通常用来查看其他人的进程，因为它取回的代码对你本地的开发代码没有影响。

默认情况下，`git fetch`取回所有分支（branch）的更新。如果只想取回特定分支的更新，可以指定分支名。

#### 4.3.5 git pull

`git pull`命令的作用是，取回远程主机某个分支的更新，再与本地的指定分支合并。它的完整格式稍稍有点复杂。

```
$ git pull <远程主机名> <远程分支名>:<本地分支名>

#取回origin主机的next分支，与本地的master分支合并，需要写成下面这样
$ git pull origin next:master
...
```

#### 4.3.6 git push

在使用git commit命令将修改从暂存区提交到本地版本库后，只剩下最后一步将本地版本库的分支推送到远程服务器上对应的分支，`git push`命令用于将本地分支的更新，推送到远程主机。它的格式与`git pull`命令相仿。

```
$ git push <远程主机名> <本地分支名>:<远程分支名>
```

注意，分支推送顺序的写法是<来源地>:<目的地>，所以`git pull`是<远程分支>:<本地分支>，而`git push`是<本地分支>:<远程分支>。

1. git push origin master
   如果远程分支被省略，如上则表示将本地分支推送到与之存在追踪关系的远程分支（通常两者同名），如果该远程分支不存在，则会被新建
2. git push origin ：refs/for/master
   如果省略本地分支名，则表示删除指定的远程分支，因为这等同于推送一个空的本地分支到远程分支，等同于 git push origin –delete master
3. git push origin
   如果当前分支与远程分支存在追踪关系，则本地分支和远程分支都可以省略，将当前分支推送到origin主机的对应分支
4. git push
   如果当前分支只有一个远程分支，那么主机名都可以省略，形如 git push，可以使用git branch -r ，查看远程的分支名



## 5. 分支管理

分支管理应该是项目中经常遇到的问题了，本身也很重要，而Git的分支管理功能是非常强大的，因此分支操作要好好了解熟悉。关于分支管理，廖雪峰大佬已经讲的很好了，因此我把他的讲解引用过来，主要说说创建与合并、冲突解决，后面的分支策略、Bug分支等就用我自己的理解简单说一下。

**常用Git分支管理指令：**

```
# 列出所有本地分支,查看
$ git branch

# 列出所有远程分支
$ git branch -r

# 列出所有本地分支和远程分支
$ git branch -a

# 新建一个分支，但依然停留在当前分支
$ git branch [branch-name]

# 新建一个分支，并切换到该分支
$ git checkout -b [branch]

# 新建一个分支，指向指定commit
$ git branch [branch] [commit]

# 新建一个分支，与指定的远程分支建立追踪关系
$ git branch --track [branch] [remote-branch]

# 切换到指定分支，并更新工作区
$ git checkout [branch-name]

# 切换到上一个分支
$ git checkout -

# 建立追踪关系，在现有分支与指定的远程分支之间
$ git branch --set-upstream [branch] [remote-branch]

# 合并指定分支到当前分支
$ git merge [branch]

# 选择一个commit，合并进当前分支
$ git cherry-pick [commit]

# 删除分支
$ git branch -d [branch-name]

# 删除远程分支
$ git push origin --delete [branch-name]
$ git branch -dr [remote/branch]
```

### 5.1 创建与合并分支

每次提交，Git都把它们串成一条时间线，这条时间线就是一个分支。截止到目前，只有一条时间线，在Git里，这个分支叫主分支，即`master`分支。`HEAD`严格来说不是指向提交，而是指向`master`，`master`才是指向提交的，所以，`HEAD`指向的就是当前分支。

一开始的时候，master分支是一条线，Git用master指向最新的提交，再用HEAD指向master，就能确定当前分支，以及当前分支的提交点：

![](https://leslie1-1309334886.cos.ap-shanghai.myqcloud.com/obsidian/Ha6d04b9e9fd24b399ea4d02825265a38z.png)

每次提交，master分支都会向前移动一步，这样，随着你不断提交，master分支的线也越来越长：

![](https://leslie1-1309334886.cos.ap-shanghai.myqcloud.com/obsidian/He13a65570b914f05b419abc08931a709W.gif)

当我们创建新的分支，例如`dev`时，Git新建了一个指针叫`dev`，指向`master`相同的提交，再把`HEAD`指向`dev`，就表示当前分支在`dev`上：

```
$ git branch dev
```

Git创建一个分支很快，因为除了增加一个`dev`指针，改改`HEAD`的指向，工作区的文件都没有任何变化！

```
$ git checkout -b dev
Switched to a new branch 'dev'
#相当于以下两条指令
$ git branch dev
$ git checkout dev
Switched to branch 'dev'
```

![](https://leslie1-1309334886.cos.ap-shanghai.myqcloud.com/obsidian/H746ce5ecf824418c959889b9b957e418o.png)

不过，从现在开始，对工作区的修改和提交就是针对`dev`分支了，比如新提交一次后，`dev`指针往前移动一步，而`master`指针不变：

![](https://leslie1-1309334886.cos.ap-shanghai.myqcloud.com/obsidian/Hf95a9fcb27a5452e922f537d7055892cQ.png)

假如我们在`dev`上的工作完成了，就可以把`dev`合并到`master`上。Git怎么合并呢？最简单的方法，就是直接把`master`指向`dev`的当前提交，就完成了合并：

![](https://leslie1-1309334886.cos.ap-shanghai.myqcloud.com/obsidian/H16833115b2d944e4b10438a08986f700x.png)

所以Git合并分支也很快！就改改指针，工作区内容也不变！

合并完分支后，甚至可以删除`dev`分支。删除`dev`分支就是把`dev`指针给删掉，删掉后，我们就剩下了一条`master`分支：

![](https://leslie1-1309334886.cos.ap-shanghai.myqcloud.com/obsidian/Hed917a4e6ad74308bb79798bb4e146feH.png)

过程演示：

![](https://leslie1-1309334886.cos.ap-shanghai.myqcloud.com/obsidian/H4638bffc36ed420b8ac8eef62e88a33fW.gif)

以之前的软工实验截图为例，演示实际操作：

<img src="https://leslie1-1309334886.cos.ap-shanghai.myqcloud.com/obsidian/H3e8350bc69894c8d8d8b2d21b91c40c8p.png" style="zoom:80%;" />

<img src="https://leslie1-1309334886.cos.ap-shanghai.myqcloud.com/obsidian/H422f82153f0944c6aeba13e8d396d231X.png" style="zoom:80%;" />



### 5.2 冲突解决

当我们在新建分支feature1上修改、commit，然后切回master分支后修改、commit，会照成`master`分支和`feature1`分支各自都分别有新的提交，变成了这样：

![](https://leslie1-1309334886.cos.ap-shanghai.myqcloud.com/obsidian/H7499ff22baf54401b068503db9f70940O.png)

这时如果快速合并，就会报错：

```
$ git merge feature1
Auto-merging readme.txt
CONFLICT (content): Merge conflict in readme.txt
Automatic merge failed; fix conflicts and then commit the result.
#用git status查看错误原因，会发现是因为对同一文件的两次修改导致冲突
```

此时对冲突文件进行修改，然后再add、commit，现在，`master`分支和`feature1`分支变成了下图所示：

![](https://leslie1-1309334886.cos.ap-shanghai.myqcloud.com/obsidian/H72bdfbd2e5af4dd1b8ac5367ee35a2e3Q.png)

**小结：**当Git无法自动合并分支时，就必须首先解决冲突。解决冲突后，再提交，合并完成。

解决冲突就是把Git合并失败的文件手动编辑为我们希望的内容，再提交。

用`git log --graph`命令可以看到分支合并图。



实例演示：创建新分支bbb，在bbb对文件try.txt修改提交，再切回master分支，然后master上再修改提交try.txt，此时两个分支就各自有新的提交了，合并时就会出现冲突，这时再次add然后commit提交，两个分支会走到一个点，类似于三角形。

<img src="https://leslie1-1309334886.cos.ap-shanghai.myqcloud.com/obsidian/Hebf7896d6ee841d180e18c949d05a3d4z.png" style="zoom:80%;" />

<img src="https://leslie1-1309334886.cos.ap-shanghai.myqcloud.com/obsidian/Hbdb75ce1eb654ec0bd4e1b62f62b608a5.png" style="zoom:80%;" />

<img src="https://leslie1-1309334886.cos.ap-shanghai.myqcloud.com/obsidian/H8a909fd825ab432caf70077a6ff4b1c00.png" style="zoom:80%;" />

<img src="https://leslie1-1309334886.cos.ap-shanghai.myqcloud.com/obsidian/He4faa72548cd4b7db5994528c5464da7v.png" style="zoom:80%;" />



### 5.3 分支策略

在实际开发中，我们应该按照几个基本原则进行分支管理：

首先，`master`分支应该是非常稳定的，也就是仅用来发布新版本，平时不能在上面干活；

那在哪干活呢？干活都在`dev`分支上，也就是说，`dev`分支是不稳定的，到某个时候，比如1.0版本发布时，再把`dev`分支合并到`master`上，在`master`分支发布1.0版本；

你和你的小伙伴们每个人都在`dev`分支上干活，每个人都有自己的分支，时不时地往`dev`分支上合并就可以了。

所以，团队合作的分支看起来就像这样：

![](https://leslie1-1309334886.cos.ap-shanghai.myqcloud.com/obsidian/H0f374a983f834c42ba7298b077e3d5a9Z.png)

### 5.4 Bug分支

当出现Bug时，可以通过新建一个分支bug1，此时bug1内容和master一样，对bug1进行修复后，然后合并，再将这个临时分支删除，具体步骤是：

- `git stash`存储当前工作现场
- 先找到出Bug的分支，在该分支上创建临时分支bug1，此时bug1=出Bug的分支
- 修复Bug，提交，切回之前的分支，再完成合并，删除临时分支bug1
- 可以用`git stash list`查看之前的工作现场，将现场恢复，有两个方法
  1. 用`git stash apply`恢复，恢复后并未删除stash中的内容，因此还要用`git stash drop`删除
  2. 使用`git stash pop`，恢复的同时也删除了

也可以多次stash，恢复的时候，先用`git stash list`查看，然后恢复指定的stash，用命令：

```
$ git stash apply stash@{0}
```

假如master分支出了bug，由他引申出来的分支dev上，肯定也有相同的bug，对dev上的bug当然也可以采用上面的方法来修复，不过太麻烦了。Git专门提供了一个`cherry-pick`命令，让我们能复制一个特定的提交到当前分支：

```
$ git branch
* dev
  master
$ git cherry-pick 4c805e2
[master 1d4b803] fix bug 101
 1 file changed, 1 insertion(+), 1 deletion(-)
```

Git自动给dev分支做了一次提交，注意这次提交的commit是`1d4b803`，它并不同于master的`4c805e2`，因为这两个commit只是改动相同，但确实是两个不同的commit。用`git cherry-pick`，我们就不需要在dev分支上手动再把修bug的过程重复一遍。

既然可以在master分支上修复bug后，在dev分支上可以“重放”这个修复过程，那么直接在dev分支上修复bug，然后在master分支上“重放”行不行？当然可以，不过你仍然需要`git stash`命令保存现场，才能从dev分支切换到master分支。



### 5.5 feature分支

对于一个项目，如果想添加新功能，最好新建一个feature分支，在feature分支上进行该功能开发，完成后再合并然后删除feature分支，这样能保证该功能无论开发成功与否（或者这些实验性的功能代码可能会放弃使用），都不会影响主分支。如果要丢弃一个没有被合并过的分支，可以通过`git branch -D `强行删除。



## 总结

通过对网上的Git教程大概的学习，再加上之前的一点印象，感觉基本的Git流程操作应该是知道了，但是远谈不上熟练吧，以后多多练习多多熟悉，争取熟练Git常用的命令操作。

Git Cheat Sheet，可以打印出来备用：[Git Cheat Sheet](https://gitee.com/liaoxuefeng/learn-java/raw/master/teach/git-cheatsheet.pdf)









