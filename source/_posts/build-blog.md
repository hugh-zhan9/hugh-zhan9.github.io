---
title: 基于Hexo+GitHub搭建个人博客 --美化篇
date: 2020-02-09 17:06:44
tags: [hexo, node.js, Github]
categories: 杂谈
---

# 前言
基本的搭建和美化终于弄完了，期间踩了无数的坑，曾经一度以为这小破站要重建了，结果还挺顽强。关于搭建的有关内容可以参考：[基于Hexo+GitHub搭建个人博客 --搭建篇](http://hugh-zhan9.xyz/2020/02/07/build-blog-base/)
关于NexT主题的很多配置、插件都可以在官方文档找到答案, 那么博主只是整理了一些官方没怎么提及的细节优化.
<!--more-->
既然顽强的活着，那么对于追求装X的博主来说, 基本的搭建是无法满足的, 在网上逛了无数的美化帖，终于整出了这么个四不像。那接下来就整理了一下各方面细节优化的大体步骤, 包括页面字体大小、配色、背景、SEO(搜索引擎优化)、添加自定义back2top按钮、背景图片、看板娘等等一些美化内容。
至于域名绑定、DNS域名解析实现负载均衡等由于没有进行操作，只是大概的记录一下流程.

# 主题更换及基本优化篇

## 更换Next主题
* 复制主题
hexo安装主题的方式很简单，只需要将主题文件拷贝到根目录的themes目录下，然后修改站点配置文件即可
在这我们使用git克隆最新的next主题版本
```
cd your-hexo-site
git clone https://github.com/theme-next/hexo-theme-next themes
```
* 启用主题
打开博客根目录，找到站点配置文件中themes字段，将其更改为next
```
themes: next
```
保存之后`hexo s`即可启动本地地址预览效果

## 更改主题外观
Next有三个外观，博主采用的是Gemini，直接更改主题配置文件的scheme参数即可，如果显示的是其他语言，那么修改站点配置文件中的`language: zh-CN`
```
#scheme: Mist
#scheme:Muse
scheme: Gemini
```
执行`hexo clean && hexo s`即可预览效果
大部分的设定都能在NexT的官方文档 里面找到, 如侧栏、头像、打赏、评论等等, 在此就不多讲了, 照着文档走就行了, 接下只是个性定制的问题

## 添加顶部加载条
打开`/themes/next/layout/_partials/head.swig文件，添加如下代码：
```
<script src="//cdn.bootcss.com/pace/1.0.2/pace.min.js"></script>
<link href="//cdn.bootcss.com/pace/1.0.2/themes/pink/pace-theme-flash.css" rel="stylesheet">
```
默认，加载条的颜色为粉色，如果要更改的话可以在`/themes/next/layout/_partials/head.swig`文件中添加代码（放置在之前代码之下）：
```html
<style>
    .pace .pace-progress {
        background: #ff009e; /*进度条颜色*/
        height: 3px;
    }
    .pace .pace-progress-inner {
         box-shadow: 0 0 10px #ff009e, 0 0 5px #ff009e; /*阴影颜色*/
    }
    .pace .pace-activity {
        border-top-color: #ff009e;    /*上边框颜色*/
        border-left-color: #ff009e;    /*左边框颜色*/
    }
</style>
```
## 文章结束添加结束致谢
在`/themes/next/layout/_macro/post.swig`中，在`wechat-subscriber.swig`之前添加如下代码：
```
<div style="text-align:center;color: #ccc;font-size:14px;">---------------- The End ----------------</div>
```

## 把侧边栏头像设置成圆形，鼠标放置时旋转
修改`themes\next\source\css\_common\components\sidebar\sidebar-author.styl`文件如下：
```
.site-author-image {
  display: block;
  margin: 0 auto;
  padding: $site-author-image-padding;
  max-width: $site-author-image-width;
  height: $site-author-image-height;
  border: site-author-image-border-color;

  /* start*/
  border-radius: 50%
  webkit-transition: 1.4s all;
  moz-transition: 1.4s all;
  ms-transition: 1.4s all;
  transition: 1.4s all;
  /* end */
}

/* start */
.site-author-image:hover {
  background-color: #55DAE1;
  webkit-transform: rotate(360deg) scale(1.1);
  moz-transform: rotate(360deg) scale(1.1);
  ms-transform: rotate(360deg) scale(1.1);
  transform: rotate(360deg) scale(1.1);
}
/* end */
```

## 添加音乐
可以去[网易云音乐网页版](http://music.163.com/)找到你喜欢的歌曲生成外链播放器, 复制播放器生成的代码将放到`themes/next/layout/_custom/sidebar.swig`文件里, 播放器会在站点预览中显示。`height`设为0可隐藏播放器, 但仍然可以播放音乐, `auto`设成0可手动播放, 默认是1自动播放,。

## 添加字数统计与阅读时间
* 安装插件
```
cnpm install hexo-wordcount --save
```
安装完成之后在主题配置文件中搜索wordcount所在位置，打开该功能即可。

## 给博客添加一个看板娘
该内容可参考[FJKang | 添加一个萌物](https://fjkang.github.io/2017/12/08/)
在站点根目录下执行以下命令安装依赖：
```
cnpm install --save hexo-helper-live2d
```
在站点配置文件中添加以下内容
```
# Live2D
# https://github.com/EYHN/hexo-helper-live2d
live2d:
  enable: true
  pluginRootPath: live2dw/
  pluginJsPath: lib/
  pluginModelPath: assets/ Relative)

  # 脚本加载源
  scriptFrom: local # 默认从本地加载脚本
  # scriptFrom: jsdelivr # 从 jsdelivr CDN 加载脚本
  # scriptFrom: unpkg # 从 unpkg CDN 加载脚本
  # scriptFrom: https://cdn.jsdelivr.net/npm/live2d-widget@3.x/lib/L2Dwidget.min.js # 从自定义地址加载脚本
  tagMode: false # 只在有 {{ live2d() }} 标签的页面上加载 / 在所有页面上加载
  log: false # 是否在控制台打印日志

  # 选择看板娘模型
  model:
    use: live2d-widget-model-shizuku  # npm package的名字
    # use: wanko # /live2d_models/ 目录下的模型文件夹名称
    # use: ./wives/wanko # 站点根目录下的模型文件夹名称
    # use: https://cdn.jsdelivr.net/npm/live2d-widget-model-wanko@1.0.5/assets/wanko.model.json # 自定义网络数据源
  display:
    position: left # 显示在左边还是右边
    width: 100 # 宽度
    height: 180 # 高度
  mobile:
    show: false
  react:
    opacityDefault: 0.7 # 默认透明度
```
更多配置参数可以查看[L2Dwidget | live2d-widget.js](https://l2dwidget.js.org/docs/class/src/index.js~L2Dwidget.html#instance-method-init)

## 侧栏加入已运行的时间
`themes/next/layout/_custom`中添加`sidebar.swig`文件:

```html themes/next/layout/_custom https://reuixiy.github.io/technology/computer/computer-aided-art/2017/06/09/hexo-next-optimization.html 链接
<div id="days"></div>
    <script>
    function show_date_time(){
        window.setTimeout("show_date_time()", 1000);
        BirthDay=new Date("01/10/2017 12:34:56");
        today=new Date();
        timeold=(today.getTime()-BirthDay.getTime());
        sectimeold=timeold/1000
        secondsold=Math.floor(sectimeold);
        msPerDay=24*60*60*1000
        e_daysold=timeold/msPerDay
        daysold=Math.floor(e_daysold);
        e_hrsold=(e_daysold-daysold)*24;
        hrsold=setzero(Math.floor(e_hrsold));
        e_minsold=(e_hrsold-hrsold)*60;
        minsold=setzero(Math.floor((e_hrsold-hrsold)*60));
        seconds=setzero(Math.floor((e_minsold-minsold)*60));
        document.getElementById('days').innerHTML="已运行"+daysold+"天"+hrsold+"小时"+minsold+"分"+seconds+"秒";
    }
function setzero(i){
    if (i<10)
    {i="0" + i};
    return i;
}
show_date_time();
</script>
```

在`themes/next/layout/_macro/sidebar.swig`中的`</section>`之前添加

```
{% include '../_custom/sidebar.swig' %}
```

样式:

```diff themes/next/source/css/_custom/custom.styl
// 自定义的侧栏时间样式
#days {
    display: block;
    color: #fffa74;
    font-size: 14px;
    margin-top: 15px;
}
```
## 给博客添加一个背景图片
新建一个`_data`文件夹放置在`source`中，新建一个`styles.styl`文件,将以下代码复制其中：
```
//背景图片
body {
 	background: url(/images/background.jpg);
 	background-repeat: no-repeat;
    background-attachment: fixed;
    background-position: 50% 50%;
}
```
将你要设置的背景图片放置在`source/images`中，更改为`background.jpg`

## 添加自定义back2top按钮
从[DIYgod博客](https://diygod.me/)中发现的，一路找到了配置的方法，原理很简单将 back-to-top 按钮添加图片背景，并添加 CSS3 动效即可。
首先，找到自己喜欢的图片素材放到 source\images\ 目录下。
你可以点击[下载](http://yearito.cn/images/scroll.png)本站所使用的小猫上吊素材
然后在`source/_data/styles.styl`中添加如下代码：
```
//自定义回到顶部样式
.back-to-top {
  right: 60px;
  width: 70px;  //图片素材宽度
  height: 900px;  //图片素材高度
  top: -1000px;
  bottom: unset;
  transition: all .5s ease-in-out;
  background: url("/images/scroll.png");

  //隐藏箭头图标
  > i {
    display: none;
  }

  &.back-to-top-on {
    bottom: unset;
    top: 100vh < (900px + 100px) ? calc( 100vh - 900px - 200px ) : 0px;
  }
}
```

# 元素微调
接下来的内容是从[ookamiantd's Blog](https://yangbingdong.com)中找过来的，因为我没有做这方面的修改，但是之后可能会进行，所以就保存在这里。
## 好玩的样式
先在`themes/next/source/css/_custom/custom.styl`中添加以下样式:
```css
// 下载样式
a#download {
display: inline-block;
padding: 0 10px;
color: #000;
background: transparent;
border: 2px solid #000;
border-radius: 2px;
transition: all .5s ease;
font-weight: bold;
&:hover {
background: #000;
color: #fff;
}
}
/ /颜色块-黄
span#inline-yellow {
display:inline;
padding:.2em .6em .3em;
font-size:80%;
font-weight:bold;
line-height:1;
color:#fff;
text-align:center;
white-space:nowrap;
vertical-align:baseline;
border-radius:0;
background-color: #f0ad4e;
}
// 颜色块-绿
span#inline-green {
display:inline;
padding:.2em .6em .3em;
font-size:80%;
font-weight:bold;
line-height:1;
color:#fff;
text-align:center;
white-space:nowrap;
vertical-align:baseline;
border-radius:0;
background-color: #5cb85c;
}
// 颜色块-蓝
span#inline-blue {
display:inline;
padding:.2em .6em .3em;
font-size:80%;
font-weight:bold;
line-height:1;
color:#fff;
text-align:center;
white-space:nowrap;
vertical-align:baseline;
border-radius:0;
background-color: #2780e3;
}
// 颜色块-紫
span#inline-purple {
display:inline;
padding:.2em .6em .3em;
font-size:80%;
font-weight:bold;
line-height:1;
color:#fff;
text-align:center;
white-space:nowrap;
vertical-align:baseline;
border-radius:0;
background-color: #9954bb;
}
// 左侧边框红色块级
p#div-border-left-red {
display: block;
padding: 10px;
margin: 10px 0;
border: 1px solid #ccc;
border-left-width: 5px;
border-radius: 3px;
border-left-color: #df3e3e;
}
// 左侧边框黄色块级
p#div-border-left-yellow {
display: block;
padding: 10px;
margin: 10px 0;
border: 1px solid #ccc;
border-left-width: 5px;
border-radius: 3px;
border-left-color: #f0ad4e;
}
// 左侧边框绿色块级
p#div-border-left-green {
display: block;
padding: 10px;
margin: 10px 0;
border: 1px solid #ccc;
border-left-width: 5px;
border-radius: 3px;
border-left-color: #5cb85c;
}
// 左侧边框蓝色块级
p#div-border-left-blue {
display: block;
padding: 10px;
margin: 10px 0;
border: 1px solid #ccc;
border-left-width: 5px;
border-radius: 3px;
border-left-color: #2780e3;
}
// 左侧边框紫色块级
p#div-border-left-purple {
display: block;
padding: 10px;
margin: 10px 0;
border: 1px solid #ccc;
border-left-width: 5px;
border-radius: 3px;
border-left-color: #9954bb;
}
// 右侧边框红色块级
p#div-border-right-red {
display: block;
padding: 10px;
margin: 10px 0;
border: 1px solid #ccc;
border-right-width: 5px;
border-radius: 3px;
border-right-color: #df3e3e;
}
// 右侧边框黄色块级
p#div-border-right-yellow {
display: block;
padding: 10px;
margin: 10px 0;
border: 1px solid #ccc;
border-right-width: 5px;
border-radius: 3px;
border-right-color: #f0ad4e;
}
// 右侧边框绿色块级
p#div-border-right-green {
display: block;
padding: 10px;
margin: 10px 0;
border: 1px solid #ccc;
border-right-width: 5px;
border-radius: 3px;
border-right-color: #5cb85c;
}
// 右侧边框蓝色块级
p#div-border-right-blue {
display: block;
padding: 10px;
margin: 10px 0;
border: 1px solid #ccc;
border-right-width: 5px;
border-radius: 3px;
border-right-color: #2780e3;
}
// 右侧边框紫色块级
p#div-border-right-purple {
display: block;
padding: 10px;
margin: 10px 0;
border: 1px solid #ccc;
border-right-width: 5px;
border-radius: 3px;
border-right-color: #9954bb;
}
// 上侧边框红色
p#div-border-top-red {
display: block;
padding: 10px;
margin: 10px 0;
border: 1px solid #ccc;
border-top-width: 5px;
border-radius: 3px;
border-top-color: #df3e3e;
}
// 上侧边框黄色
p#div-border-top-yellow {
display: block;
padding: 10px;
margin: 10px 0;
border: 1px solid #ccc;
border-top-width: 5px;
border-radius: 3px;
border-top-color: #f0ad4e;
}
// 上侧边框绿色
p#div-border-top-green {
display: block;
padding: 10px;
margin: 10px 0;
border: 1px solid #ccc;
border-top-width: 5px;
border-radius: 3px;
border-top-color: #5cb85c;
}
// 上侧边框蓝色
p#div-border-top-blue {
display: block;
padding: 10px;
margin: 10px 0;
border: 1px solid #ccc;
border-top-width: 5px;
border-radius: 3px;
border-top-color: #2780e3;
}
// 上侧边框紫色
p#div-border-top-purple {
display: block;
padding: 10px;
margin: 10px 0;
border: 1px solid #ccc;
border-top-width: 5px;
border-radius: 3px;
border-top-color: #9954bb;
}
```

**用法如下**:
## 文字增加背景色块
<span id="inline-blue">站点配置文件</span> , <span id="inline-purple">主题配置文件</span>
```html
<span id="inline-blue">站点配置文件</span>,
<span id="inline-purple">主题配置文件</span>
```
## 引用边框变色
<p id="div-border-left-red">如果没有安装成功, 那可能就是墙的原因. 建议下载 `Node.js` 直接安装. </p>
<p id="div-border-top-blue">关于更多基本操作和基础知识, 请查阅 [Hexo](https://hexo.io/zh-cn/) 与 [NexT](http://theme-next.iissnan.com/) 官方文档.</p>
```html
<p id="div-border-left-red">如果没有安装成功, 那可能就是墙的原因. 建议下载 `Node.js` 直接安装. </p>
<p id="div-border-top-blue">关于更多基本操作和基础知识, 请查阅 [Hexo](https://hexo.io/zh-cn/) 与 [NexT](http://theme-next.iissnan.com/) 官方文档.</p>
```

## 在文档中增加图标

- <i class="fa fa-pencil"></i>支持Markdown
  <i>Hexo 支持 GitHub Flavored Markdown 的所有功能, 甚至可以整合 Octopress 的大多数插件. </i>
- <i class="fa fa-cloud-upload"></i>一件部署
  <i>只需一条指令即可部署到Github Pages, 或其他网站</i>
- <i class="fa fa-cog"></i>丰富的插件
  <i>Hexo 拥有强大的插件系统, 安装插件可以让 Hexo 支持 Jade, CoffeeScript. </i>

```
- <i class="fa fa-pencil"></i>支持Markdown
<i>Hexo 支持 GitHub Flavored Markdown 的所有功能, 甚至可以整合 Octopress 的大多数插件. </i>
- <i class="fa fa-cloud-upload"></i>一件部署
<i>只需一条指令即可部署到Github Pages, 或其他网站</i>
- <i class="fa fa-cog"></i>丰富的插件
<i>Hexo 拥有强大的插件系统, 安装插件可以让 Hexo 支持 Jade, CoffeeScript. </i>
```

<i class="fa fa-github"></i>`<i class="fa fa-github"></i>`
<i class="fa fa-github fa-lg"></i>`<i class="fa fa-github fa-lg"></i>`
<i class="fa fa-github fa-2x"></i>`<i class="fa fa-github fa-2x"></i>`

采用的是***[Font Awesome](http://fontawesome.io/examples/)***的图标.

## 图形边框效果
<a id="download" href="https://git-scm.com/download/win"><i class="fa fa-download"></i><span> Download Now</span>
</a>
```html
<a id="download" href="https://git-scm.com/download/win"><i class="fa fa-download"></i><span> Download Now</span>
</a>
```
这也是调用了***[Font Awesome](http://fontawesome.io/examples/)***的方法.

# 站点加速篇
## 更改默认Google字体库
访问系统总是会耗费一大部分的时间在加载`google`字体库上, 而且经常加载不成功.

方法一: 用国内的CDN库来替代主题中的`google`字体库, 到`主题配置文件`中设置默认字体库:
```
host: fonts.useso.com
```

方法二: 关掉字体库的引用, 默认加载本地字体库, 到`主题配置文件`设置:
```
font:
  enable: false
```
## 使用云盘存放图片资源
由于Github的服务器在海外, 那么如果把图片也放到Github显然是不科学的, 而且Github的存储空间也有局限, 那么在这里博主推荐使用*[七牛云储存](http://www.qiniu.com/)*
具体怎么做在之前的基础篇已经介绍过了, 详情请看→*[传送门](/2017/build-blog-hexo-base/#%E6%96%B9%E5%BC%8F%E4%B8%89)*

## 压缩代码
安装插件:
```
npm install hexo-all-minifier --save
```
之后执行`hexo g`就会自动压缩
但这有一个**缺点**, 就是本地运行也就是执行`hexo s`之后浏览器打开本地项目会很慢, 原因是每次点击一个链接它就会重新压缩一次, 所以建议本地调试的时候把项目根目录下的`package.json`中的`"hexo-all-minifier": "0.0.14"`先删掉再调试,或者改成注释:
```
"dependencies": {
    .
	.
	.
    "hexo-server": "^0.2.0",
    "hexo-wordcount": "^2.0.1",
    "this-is-compress-plugin": {
      "hexo-all-minifier": "0.0.14"
    }
```
其实也没必要压缩代码, 牺牲了性能, 每次生成静态文件都太慢了, 得不偿失的感觉.

**高性能**的压缩工具参考这里: ***[minify文件压缩](/2017/build-blog-hexo-base/#%E6%96%87%E4%BB%B6%E5%8E%8B%E7%BC%A9)***

# 参考
>https://yangbingdong.com/
>https://xian6ge.netlify.com/
>http://yearito.cn
>https://eyhn.in/
>https://muyinchen.github.io
