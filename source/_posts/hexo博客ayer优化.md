---
title: hexo博客ayer优化
date: 2020-03-21 22:15:15
categories:	hexo
tags: 博客
---

记在前面：从完成最基本的hexo博客之后，我就想着优化一下，毕竟找的主题有很多是作者没有配置留给我们自己修改的，然后再就是自己的踩坑之旅。。。各种坑各种懵比，这只是优化一，之后还会继续优化的！
>不满足是向上的齿轮  ——鲁迅

<!--more-->

## 添加歌单页面(aplayer实现)

使用aplyer可以帮助我们为添加的歌单页面实现歌曲解析播放，具体步骤就是：

<1>添加页面文件

<2>利用aplyer插件生成歌单解析

<3>配置相关文件

### 添加页面

添加歌单页就是添加一个页面，默认情况下是只有home、archives、tags页面，创建页面可以直接用指令：

```
hexo new page xxx (xxx为页面名)
```

就可以创建hexo/source/xxx（和_post是同级目录），其中对xxx文件夹下的index.md编辑即可~

1 新建页面，命名为playlist：

```
hexo new page playlist
```

2 修改hexo/source/playlist下的index.md文件：

```
title: 歌单
date: 2020-3-21 
type: "playlist"
```

3 打开主题的_config.yml文件，在menu下新建一个名为playlist的类（在nexT主题中集成了fontAwesome可以插入图标，本主题没有。。。遗憾）

注：标点符号的中英文输入要检查

```
menu:
	playlist: /playlist/
```

4.打开主题文件下的language/zh-CN.yml添加对应中文翻译

```
playlist : 歌单
```

### 使用hexo-tag-aplayer

1 Aplayer是hexo上的一个插件，配置可以参考[官方文档](https://github.com/MoePlayer/hexo-tag-aplayer/blob/master/docs/README-zh_cn.md)，第一步安装插件：

```
npm install --save hexo-tag-aplayer
```

2 最新版的aplayer已经支持MetingJS的使用，可以直接解析网络平台歌曲，想在本插件中使用MetingJS，要先在根目录的_config.yml中配置：

```
aplyer:
	meting: true
```

3 复制想要的歌单链接：打开网易云音乐网站，找到想要的歌单，在网址中复制，例如https://music.163.com/#/my/m/music/playlist?id=817407958 其中id就是对应歌单id，在index.md文件中编辑加入：

```
{% aplayer title author url [picture_url, narrow, autoplay, width:xxx, lrc:xxx] %}
```

上面是对应的编辑模板，其中标签参数：

- `title` : 曲目标题
- `author`: 曲目作者
- `url`: 音乐文件 URL 地址
- `picture_url`: (可选) 音乐对应的图片地址
- `narrow`: （可选）播放器袖珍风格
- `autoplay`: (可选) 自动播放，移动端浏览器暂时不支持此功能
- `width:xxx`: (可选) 播放器宽度 (默认: 100%)
- `lrc:xxx`: （可选）歌词文件 URL 地址

官方文档的讲解——在文章中使用 MetingJS 播放器：

```
<!-- 简单示例 (id, server, type)  -->
{% meting "60198" "netease" "playlist" %}

<!-- 进阶示例 -->
{% meting "60198" "netease" "playlist" "autoplay" "mutex:false" "listmaxheight:340px" "preload:none" "theme:#ad7a86"%}
```

有关 `{% meting %}` 的选项列表如下:

| 选项          | 默认值     | 描述                                                        |
| ------------- | ---------- | ----------------------------------------------------------- |
| id            | **必须值** | 歌曲 id / 播放列表 id / 相册 id / 搜索关键字                |
| server        | **必须值** | 音乐平台: `netease`, `tencent`, `kugou`, `xiami`, `baidu`   |
| type          | **必须值** | `song`, `playlist`, `album`, `search`, `artist`             |
| fixed         | `false`    | 开启固定模式                                                |
| mini          | `false`    | 开启迷你模式                                                |
| loop          | `all`      | 列表循环模式：`all`, `one`,`none`                           |
| order         | `list`     | 列表播放模式： `list`, `random`                             |
| volume        | 0.7        | 播放器音量                                                  |
| lrctype       | 0          | 歌词格式类型                                                |
| listfolded    | `false`    | 指定音乐播放列表是否折叠                                    |
| storagename   | `metingjs` | LocalStorage 中存储播放器设定的键名                         |
| autoplay      | `true`     | 自动播放，移动端浏览器暂时不支持此功能                      |
| mutex         | `true`     | 该选项开启时，如果同页面有其他 aplayer 播放，该播放器会暂停 |
| listmaxheight | `340px`    | 播放列表的最大长度                                          |
| preload       | `auto`     | 音乐文件预载入模式，可选项： `none`, `metadata`, `auto`     |
| theme         | `#ad7a86`  | 播放器风格色彩设置                                          |

关于如何设置自建的 Meting API 服务器地址，以及其他 MetingJS 配置，请参考章节[自定义配置](https://github.com/MoePlayer/hexo-tag-aplayer/blob/master/docs/README-zh_cn.md#自定义配置30-新功能)



以我的配置为例：

```
{% meting "817407958" "netease" "playlist" "theme:#FF4081" "mode:circulation" "mutex:true" "listmaxheight:340px" "preload:auto" %}
```

就完成了歌单页的配置，（至于集成侧边栏小窗口，可以在各个页面播放音乐的网易云插件，在后面会讲到）



## 添加网易云外链播放

使用网易云iframe插件实现外链播放，主要步骤就是：

1. 进入网易云网页端，获取外链和html代码
2. 进入主题下的布局文件中，在你想要的位置对应的布局文件添加复制的html代码
3. 修改主题的配置文件_config.yml

该主题ayer已经实现了网易云外链播放，只需要配置一下

### 获取外链代码

进入网易云网页端，找到你想要的歌曲，可以到外链播放器，点击生成查看对应代码

<img src="http://img.salute61.top/netease.png"  style="zoom:50%;" />

<img src="http://img.salute61.top/netease2.png"  style="zoom:50%;" />



### 完成相应配置

- 首先是添加html代码到布局文件对应位置（这里的对应位置就是你想要的位置。。一般主题里有相关的文件，ayer主题中themes/ayer/layout/_partial的music.ejs文件）

  ayer主题的作者已经实现了这一块代码，因此只需要把我复制的html替换

  ![配置](http://img.salute61.top/netease%E9%85%8D%E7%BD%AE.png)

- 然后是在对应主题的_config.yml配置一下就可以了

<img src="http://img.salute61.top/netease%E9%85%8D%E7%BD%AE2.png"  style="zoom:80%;" />

- 之后就可以在博客上看到啦

![](http://img.salute61.top/netease%E6%95%88%E6%9E%9C.png)



（注：网易云中很多歌曲由于版权保护不能生成外链播放器，在网上找的方法是：F12进入控制台查看代码找对应id，然后复制到对应配置。不过这个方法不一定可行，我照这样还是不能播放。。。所以还是要自己多试试几首歌，找到能直接生成外链播放器的吧。。。）

<img src="http://img.salute61.top/netease%E5%BC%BA%E8%A1%8C%E5%A4%96%E9%93%BE.png" alt="外链获取" style="zoom:50%;" />



## 使用七牛云图床

blog中要插入图片，在网页端无法直接读取个人电脑的地址，因此要用到图床工具生成外链

图床的选择可以参考知乎上的这篇回答：[盘点国内免费好用的图床](https://zhuanlan.zhihu.com/p/35270383?ivk_sa=1023345p)

我个人的话推荐使用七牛云图床，免费10g的空间，链接速度也快

进入[七牛云](https://portal.qiniu.com/signup?code=1hdw91gk6g4lu)注册，完成实名认证，然后创建对象存储->设置参数->上传图片生成外链

> **注意：**七牛云注册后的试用域名只有一个月时间，之后会收回，因此要自己绑定加速域名！

![创建](http://img.salute61.top/qiniu1.png)

![设置参数](http://img.salute61.top/qiniu2.png)

![操作](http://img.salute61.top/qiniu3.png)

最后就是在你的博客文章中插入外链写博客，在网站中就可以看到啦！



## 开启打赏功能

原作者的ayer主题中已经自带了打赏功能，支持微信打赏和支付宝打赏。 只需要themes/ayer/_config.yml中填入 微信 和 支付宝 收款二维码图片地址（将你的个人支付宝、微信收款码放在对应地址）即可开启该功能。

大概代码示例：

```
# 打赏type设定：0-关闭打赏； 1-文章对应的md文件里有reward:true属性，才有打赏； 2-所有文章均有打赏
reward_type: 2
# 打赏wording
reward_wording: '请我喝杯咖啡吧~'
# 支付宝二维码图片地址，跟你设置logo的方式一样。比如：/images/alipay.jpg
alipay: /images/alipay.jpg
# 微信二维码图片地址
weixin: /images/wechat.jpg
```



## 添加百度、谷歌Analytics

百度统计和Google统计主要可以用于分析网站数据：流量、访客量等。

基本步骤就是注册账号，创建网页应用（按提示步骤来就行），获取js代码（在管理->获取代码 中即可找到js代码），添加。附上网站链接：

[百度统计网站]([https://tongji.baidu.com](https://tongji.baidu.com/))

[Google统计网站](https://analytics.google.com/analytics/web/)

（说明：在ayer主题中已经集成，只需要配置一下即可。这个大部分主题都有集成吧0.0）具体位置：

```
themes\ayer\lauout\_partial\google-analytics.ejs
themes\ayer\lauout\_partial\baidu-analytics.ejs
```

![image-20200322114644925](http://img.salute61.top/tongji1.png)

在主题配置文件_config.yml中配置一下id：

![image-20200322113331239](http://img.salute61.top/tongji2.png)

Google Analytics和百度类似，找到UA码复制，在.ejs文件中替换你的js代码，在_config.yml中配置id即可。配置成功后可以在控制台看到相关信息：

![image-20200322115142347](http://img.salute61.top/tongji3.png)

网站底部的UV页面访问、PV IP访问，在localhost下数值会异常，不过部署到服务器上会重新设置。



## 增加评论功能(Valine、Gitalk)

hexo博客评论系统有很多常用的有：来比力、Gitalk、畅言、valine等，多个评论系统已经下线或者是外国网站，容易被墙，所有好用的主要就Valine和Gitalk。

- Valine：https://github.com/xCss/Valine  （快速高效）
- Gitalk：https://github.com/settings/applications/new （注册git application）

### 1.Valine评论

Valin是一款快速、简洁且高效的无后端评论系统,访问快。

Valine评论使用leancloud作为线上数据库，因此要使用Valine先注册[leancloud](https://www.leancloud.cn/)账号，然后添加应用。按步骤提示创建应用后，可以在控制台看到对应ID

![](http://img.salute61.top/leancloud.png)

然后在主题的_config.yml中配置，将复制得到AppID和AppKey粘贴到对应位置即可

<img src="http://img.salute61.top/leancloud2.png" alt="comment_config" style="zoom:70%;" />

### 2.Gitalk评论

要使用gitalk首先要新建一个git application，填写参数

<img src="http://img.salute61.top/gitalk1.png" alt="注册application" style="zoom:30%;" />

注册完成后可以在个人的settings中查看client key和 client secret，由于ayer主题已经集成gitalk插件，因此只需要复制两个key然后粘贴到主题_config.yml的对应位置

![查看application key](http://img.salute61.top/gitalk2.png)

<img src="http://img.salute61.top/gitalk%E9%85%8D%E7%BD%AE.png" style="zoom:67%;" />



**注**：如果没有集成gitalk插件也可以*/layout/_partial/下新建一个comment.ejs，添加相应代码：

```
<link rel="stylesheet" href="<%- theme.libs.css.gitalk %>">
<link rel="stylesheet" href="/css/my-gitalk.css">

<div class="card gitalk-card" data-aos="fade-up">
    <div id="gitalk-container" class="card-content"></div>
</div>

<script src="<%- theme.libs.js.gitalk %>"></script>
<script>
    let gitalk = new Gitalk({
        clientID: '<%- theme.gitalk.oauth.clientId %>',
        clientSecret: '<%- theme.gitalk.oauth.clientSecret %>',
        repo: '<%- theme.gitalk.repo %>',
        owner: '<%- theme.gitalk.owner %>',
        admin: <%- JSON.stringify(theme.gitalk.admin) %>,
        id: '<%- date(page.date, 'YYYY-MM-DDTHH-mm-ss') %>',
        distractionFreeMode: false  // Facebook-like distraction free mode
    });

    gitalk.render('gitalk-container');
</script>
```

在post页面添加代码：

```
{% elseif theme.gitalk.enable %}
    <%- partial('_partial/comment') %>
{% endif %}
```

在主题_config.yml 下添加配置代码，可以参照上面的 comment_config图片，里面下半段就是Gitalk的配置。配置好部署后就可以使用了



相比Valine，Gitalk第一次访问要登陆github账户，完成关联才能评论，因为第一次加载会自动在管理员的repo仓库下创建对应issue（当然也可以手动创建，只要有Gitalk标签和id对应标签就可以），并且每篇文章都会创建issue（如果文章多就会比较麻烦）



## 增加看板娘功能

要使用看板娘，首先在根目录安装live2d插件：

```
npm install --save hexo-helper-live2d
```

然后修改根目录下 _config.yml文件，增加看板娘配置：

```
## live2d看板娘
live2d:
  enable: true
  scriptFrom: local
  pluginRootPath: live2dw/
  pluginJsPath: lib/
  pluginModelPath: assets/
  tagMode: false
  debug: false
  model:
    use: live2d-widget-model-wanko #看板娘的model
    scale: 1
    hHeadPos: 0.5
    vHeadPos: 0.618
  display:
    superSample: 2
    width: 150
    height: 300
    position: right #看板娘位置
    hOffset: 50 #看板娘水平偏移量
    vOffset: 100 #看板娘垂直偏移量
  mobile:
    show: false
    scale: #0.5
  react:
    opacityDefault: 0.7
    opacityOnHover: 0.2
```

配置完成后安装对应看板娘model的动效就可：

```
npm install live2d-widget-model-wanko
```

可以进入[模型预览](https://links.jianshu.com/go?to=https%3A%2F%2Fblog.csdn.net%2Fwang_123_zy%2Farticle%2Fdetails%2F87181892) 挑选自己喜欢的看板娘，也可以在[模型的Github地址](https://github.com/xiazeyu/live2d-widget-models)将整个package下载

效果演示：

![wanko](http://img.salute61.top/live2d.png)

## References

1. [Hexo添加Player播放器](https://www.jianshu.com/p/f1005ae09e5a)
2. [hexo+yilia添加百度统计和Google统计](http://yansheng836.coding.me/article/eda67a25.html)
3. [hexo-next主题优化](https://www.jianshu.com/p/0e091bb04531)
4. [《为博客添加 Gitalk 评论插件》](https://links.jianshu.com/go?to=http%3A%2F%2Fqiubaiying.vip%2F2017%2F12%2F19%2F%E4%B8%BA%E5%8D%9A%E5%AE%A2%E6%B7%BB%E5%8A%A0-Gitalk-%E8%AF%84%E8%AE%BA%E6%8F%92%E4%BB%B6%2F)