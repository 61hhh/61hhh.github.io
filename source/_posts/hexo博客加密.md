---
title: hexo博客加密
date: 2020-04-18 21:04:06
tags: hexo
categories: 博客
---

有时当我们写了一篇博客，但并不想所有人能够访问它。对于`WordPress`这很容易做到，但是对于hexo，由于是静态网页，并不能做到完全的加密。

Github上有大神做了插件可以帮助我们。地址： [GitHub](https://github.com/MikeCoder/hexo-blog-encrypt/blob/master/ReadMe.zh.md)，可以参照他的文档配置

<!--more-->

### 效果

不知道为啥，当时正常输密码查看没问题，后来输密码没反应了。。。。

![](http://img.salute61.top/%E5%8D%9A%E5%AE%A2%E5%8A%A0%E5%AF%86.png)

![](http://img.salute61.top/%E5%8D%9A%E5%AE%A2%E5%8A%A0%E5%AF%862.png)

### 安装

在项目根目录下，输入命令：`npm install hexo-blog-encrypt --save`

### 根目录配置

在根目录_config.yml文件中末尾配置，添加代码：

```
##Security
encrypt: 
    enable: true
```

### 快速使用

在要加密的文章头部加上对应字段，如`password`、`abstract`、`message`。

```
---
title: hexo博客加密
date: 2020-04-18 21:04:06
tags: 
	- web
	- hexo
categories: 学习
password: ly61
abstract: hello, an encode try
message: Type the password ly61!
---
```

- password: 是该博客加密使用的密码
- abstract: 是该博客的摘要，会显示在博客的列表页
- message: 这个是博客查看时，密码输入框上面的描述性文字

### 对 TOC 进行加密

如果你有一篇文章使用了 TOC，你需要修改模板的部分代码。这里用 landscape 作为例子：

+ 你可以在 hexo/themes/landscape/layout/_partial/article.ejs 找到 article.ejs。
+ 然后找到 <% post.content %> 这段代码，通常在30行左右。
+ 使用如下的代码来替代它:

```
<% if(post.toc == true){ %>
  <div id="toc-div" class="toc-article" <% if (post.encrypt == true) { %>style="display:none" <% } %>>
    <strong class="toc-title">Index</strong>
      <% if (post.encrypt == true) { %>
        <%- toc(post.origin, {list_number: true}) %>
      <% } else { %>
        <%- toc(post.content, {list_number: true}) %>
      <% } %>
  </div>
<% } %>
<%- post.content %>
```

### 自定义

如果不想每篇文章都输入`abstract`、`message`等字段，可以在根目录下配置：

```
encrypt:
  enable: true
  default_abstract: 这是一篇加密文章，内容可能是个人情感宣泄或者收费技术。如果你确实想看，请与我联系。
  default_message: 输入密码，查看文章。
```

#### 示例

```
# Security
encrypt: # hexo-blog-encrypt
  abstract: 有东西被加密了, 请输入密码查看.
  message: 您好, 这里需要密码.
  tags:
  - {name: tagName, password: 密码A}
  - {name: tagName, password: 密码B}
  template: <div id="hexo-blog-encrypt" data-wpm="{{hbeWrongPassMessage}}" data-whm="{{hbeWrongHashMessage}}"><div class="hbe-input-container"><input type="password" id="hbePass" placeholder="{{hbeMessage}}" /><label>{{hbeMessage}}</label><div class="bottom-line"></div></div><script id="hbeData" type="hbeData" data-hmacdigest="{{hbeHmacDigest}}">{{hbeEncryptedData}}</script></div>
  wrong_pass_message: 抱歉, 这个密码看着不太对, 请再试试.
  wrong_hash_message: 抱歉, 这个文章不能被校验, 不过您还是能看看解密后的内容.
```

这样就不需要每篇文章都加了，它会自动填充。不过如果某一篇文章想加点不一样的也可以加上文章信息头。

#### 优先级

文章信息头 > `_config.yml` (站点根目录下的) > 默认配置

### 问题

- 对于`hexo-blog-encrypt2.0`之前的版本，无法触发渲染`mathjax`的函数，需要升级。
- 在部分博客中, 解密后部分元素可能无法正常显示或者表现, 这属于已知问题. 目前的解决办法是通过自行查阅自己的博客中的代码, 了解到在 onload 事件发生时调用了哪些函数, 并将这些函数挑选后写入到博客内容中.
- 字数统计功能会出现问题。
