---
title: hexo博客提交Google和百度收录
tags: hexo
categories: 博客
abbrlink: 750226c4
date: 2020-04-16 20:25:09
---

## 前言

到现在位置博客算是搭建好了，但是自己写的博客别问访问不了，Github和Coding都有反爬虫机制，搜索引擎搜不到，因此我们要让搜索引擎收录我们的网站。

**验证：**在百度/Google搜索框中输入`site:***(你的网站/域名)`，如果没找到说明没有被收录（必然找不到啊！），Google的验证要先翻墙。

**收录步骤：**主要分为两步，一是`验证网站`，再是`链接提交`。

下面分别说一下百度和谷歌的收录步骤。

<!--more-->

## 百度收录

首先要验证网站，我们要在百度站长平台中的[站长工具](http://zhanzhang.baidu.com/dashboard/index)去验证，步骤：

- 输入网站（可能会有一些信息的绑定）
- 站点属性（自己随便选，我选了个信息技术、生活情感）
- 验证网站

### 验证网站

通过验证之后百度会认为你是网站所有者，然后能做诸如自动推送、手动推送的高级功能！

验证方法有三个：

- 文件验证
- HTML验证
- CNAME验证

#### (1)文件验证

1. 我选择的是第一个文件验证，按步骤下载验证文件，得到一个`baidu_verify_xxxxx.html`文件。
2. 把这个验证文件放在`theme/ayer/source/`根目录下面，（也可以放在主题的根目录下，好象这样可以避免对应主题在构建过程中在验证文件中加入很多东西影响验证）
3. 当我们编译网站`hexo generate`的时候，这个文件会被原封不动的拷贝到我们博客的`public/`根目录下。
4. 重新编译部署，就可以点击验证—>完成验证。

![](https://ae01.alicdn.com/kf/H3f8b0c4effb8448fabe53d2ea3b6b81bU.png)



#### (2)HTML验证

这种方法需要根据不同的主题进行配置，不过原理一样：都是将HTML验证标签加入到博客每个页面的head里面！注意是完整的标签，而不是一部分！

- 选择HTML验证，会出现`<meta name="..." content="...">`标签，将完整标签加到每个博客页面的`<head>...</head>`中间
- 在对应主题的配置文件中开启提交百度...

#### (3)CNAME验证

好像CNAME是最简单的，只要有域名即可

具体步骤：添加一条新的CNAME解析：**记录类型**是*CNAME*，**主机记录**是你的token，，**记录值**是zz.baidu.com，其他默认。然后验证即可。

### 链接提交

接下来要做的就是[链接提交](http://zhanzhang.baidu.com/linksubmit/index).链接提交有`手动`和`自动`两种方法。

**手动提交**你的站点到百度搜索，在搜索框输入`site:salute61.top`搜索不到后，下面有提交网址的选项，当然这种方法很麻烦，因为如果想让每一篇文章都能被搜索到就需要把所有的页面链接进行提交！

![](https://ae01.alicdn.com/kf/H2f7b18d9dd414a85a741d4d770e3a3fdS.png)

**自动提交**显然是更好的选择，在自己网站的站长平台可以看到三种提交方式。

#### 主动提交

因为百度收录的效率很低，所以我在sitemap基础上增加了主动推送。

**主动推送：**最为快速的提交方式，建议您将站点当天新产出链接立即通过此方式推送给百度，以保证新链接可以及时被百度收录。

主动推送的好处：

- **及时发现：**可以缩短百度爬虫发现您站点新链接的时间，使新发布的页面可以在第一时间被百度收录
- **保护原创：**对于网站的最新原创内容，使用主动推送功能可以快速通知到百度，使内容可以在转发之前被百度发现

![](https://ae01.alicdn.com/kf/H03bfde373cab4943b4d6b91a6af11d7cb.png)

首先安装插件：`npm install hexo-baidu-url-submit --save`

（插件GitHub地址:https://github.com/huiwang/hexo-baidu-url-submit ）

在根目录配置文件中新增字段：

```
##主动推送
baidu_url_submit: 
    count: 100 # 提交最新的一个链接
    host: http://salute61.top/ # 你注册的域名
    token: *** #上图中的token后面的字段
    path: baidu_urls.txt #文本文档的地址， 新链接会保存在此文本文档里
```

在deploy中新增：

```
  type: baidu_url_submit
```

这样执行`hexo deploy`的时候，新的链接就会被推送了。成功后可以在bash中看到：

![](https://ae01.alicdn.com/kf/Hb6a1d85346784508ab5bfc8eccff0f5fB.png)



#### sitemap提交

选择sitemap方式时

##### 1.安装sitemap插件

```
npm install hexo-generator-sitemap --save
npm install hexo-generator-baidu-sitemap --save
##一个是谷歌的，一个是百度的
```

##### 2.修改博客配置文件

修改url为你的博客首页，xxx.github.io或自己的域名

![](https://ae01.alicdn.com/kf/Hca76c42e1527487185a2fb4f31062e79O.png)

指定生成文件名和生成路径

```
# 自动生成sitemap
sitemap: 
  path: sitemap.xml
baidusitemap: 
  path: baidusitemap.xml
```

配置完成后执行`hexo g`，正常情况下会在source文件夹下看到多出两个文件：`sitemap.xml`和`baidusitemap.xml`，这就是sitemap文件。

在自动提交—sitemap的输入框中，按格式填写。然后就可以了！等待一段时间让他收录，也可以访问该xml文件，查看详情

![](https://ae01.alicdn.com/kf/H2ebfe3c5ab864cec938269a41b520a96S.png)

![](https://pic.downk.cc/item/5ea4f3d1c2a9a83be58d3506.png)

## Google收录

先进入[google站点平台](https://www.google.com/webmasters/tools/home?hl=zh-CN)，具体步骤与百度相同，只不过要翻墙。步骤也是`验证网站`，`链接提交`，不过我网址前缀验证进入，然后没找到验证网站的地方？？？（左侧菜单栏找遍了也没看见哪个是验证网站）

进入网站有两种方式：网域、网址前缀

![](https://ae01.alicdn.com/kf/Hde6a7df83385422fbbfc930a1da6d983Y.jpg)

查了一下好像直接链接提交就行，直接提交sitemap。完成

[帮助文档](https://support.google.com/webmasters/answer/183669?hl=zh-Hans)

![](https://ae01.alicdn.com/kf/Hc2b4ff8fb80342a489a7e889936a6d70M.png)



然后就是等待他们收录了！

谷歌收录较快，基本我弄完一个小时就收到邮件了，而且每篇新的博客都很快就收录了！

百度得等很久。。。得近两周才搜得到