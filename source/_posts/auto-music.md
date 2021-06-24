---
title: Hexo + Next 主题实现全局播放背景音乐
tags: hexo
categories: 杂谈
date: 2021-1-4 12:09:28




---



新年新气象，本文转载自：https://blog.csdn.net/qq_39720594/article/details/105401774

<!--more-->

# 使用网易云音乐插件

特点：

- 简单快捷
- 有版权保护的音乐无法播放（易造成歌单失效）

我们可以将此插件添加到博客界面，或者博客文章之中（直接粘贴网易云插件代码即可）。

> [如何获取网易云歌单外链音乐插件及注意事项](https://blog.csdn.net/qq_39720594/article/details/105423726)

示例：

打开我们主题文件：`themes\next\layout\_macro\sidebar.swig`找到`sidebar-inner`，将网易云插件代码代码粘贴到此`<div>`标签后即可。

演示：

```javascript
<aside class="sidebar">
 <div class="sidebar-inner"> //从下面开始复制，粘贴到这里
  <!--网易云插件-->
  <iframe frameborder="no" border="0" marginwidth="0" marginheight="0" width=330 height=86 
      src="//music.163.com/outchain/player?type=2&id=463352828&auto=0&height=66"></iframe>
```

在博客文件夹打开`GitBash`执行`hexo clean`、`hexo g`、`hexo s`，即可看到效果。

# 使用Aplayer + MetingJS插件

特点：

- 可以播放**大部分音乐**。
- 还可以添加其他音乐平台的歌单，如：`QQ音乐...`

示例：将音乐插件添加到侧边栏。

> 点击绿色框线处就会打开播放列表

![在这里插入图片描述](https://img-blog.csdnimg.cn/20200409100541773.png#pic_center)

有两种实现方式

打开我们主题文件：`themes\next\layout\_macro\sidebar.swig`找到`sidebar-inner`，复制下面代码粘贴到此`<div>`标签后即可。

**简单方式**

> 经测试：此方式，有时会失效，留作研究。【不推荐】 【要求`MetingJS`版本：@2.0.1】

```javascript
<aside class="sidebar">
    <div class="sidebar-inner">   //从下面开始复制，粘贴到这里
    <!-- require APlayer -->
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/aplayer@1.10.1/dist/APlayer.min.css">
    <script src="https://cdn.jsdelivr.net/npm/aplayer@1.10.1/dist/APlayer.min.js"></script>
    <!-- require MetingJS-->
    <script src="https://cdn.jsdelivr.net/npm/meting@2.0.1/dist/Meting.min.js"></script> 
    <!--网易云-->   
    <meting-js
      server="netease"
      id="4916164702"
	  type="playlist" 
	  mini="false"
      fixed="false"
      list-folded="true"
      autoplay="false"
      volume="0.4"
      theme="#FADFA3"
      order="random"
	  loop="all"
      preload="auto"
      mutex="true">
    </meting-js>
```

**属性**

| 选项            | 默认值     | 功能描述                                                    |
| --------------- | ---------- | ----------------------------------------------------------- |
| id              | **必须值** | 歌曲 id / 播放列表 id / 相册 id / 搜索关键字                |
| server          | **必须值** | 音乐平台: `netease`, `tencent`, `kugou`, `xiami`, `baidu`   |
| type            | **必须值** | `song`, `playlist`, `album`, `search`, `artist              |
| auto            | options    | music link, support: `netease`, `tencent`, `xiami`          |
| fixed           | `false`    | 开启固定模式                                                |
| mini            | `false`    | 开启迷你模式                                                |
| autoplay        | `false`    | 自动播放，移动端浏览器暂时不支持此功能                      |
| theme           | `#2980b9`  | 播放器风格色彩设置                                          |
| loop            | `all`      | 列表循环模式：`all`, `one`,`none`                           |
| order           | `list`     | 列表播放模式： `list`, `random`                             |
| preload         | `auto`     | 音乐文件预载入模式，可选项： `none`, `metadata`, `auto`     |
| volume          | `0.7`      | 播放器音量                                                  |
| mutex           | `true`     | 该选项开启时，如果同页面有其他 aplayer 播放，该播放器会暂停 |
| lrc-type        | `0`        | lyric type                                                  |
| list-folded     | `false`    | 歌词格式类型                                                |
| list-max-height | `340px`    | 播放列表的最大长度                                          |
| storage-name    | `metingjs` | LocalStorage 中存储播放器设定的键名                         |

> **其他属性请参照文末链接：`MetingJS**

**添加QQ音乐歌单**

将`meting-js`换成下面即可。 `auto`后为歌单网址。

```javascript
<meting-js
   auto="https://y.qq.com/n/yqq/playlist/1790504159.html#stat=y_new.playlist.pic_click">
</meting-js>
```

**复杂方式**

在`data-`后添加属性及属性值即可实现相同功能

> 【要求`MetingJS`版本：@1.2】

```javascript
<aside class="sidebar">
    <div class="sidebar-inner">   //从下面开始复制，粘贴到这里
<!-- require APlayer -->
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/aplayer@1.10.1/dist/APlayer.min.css">
    <script src="https://cdn.jsdelivr.net/npm/aplayer@1.10.1/dist/APlayer.min.js"></script>
    <!-- require MetingJS-->
    <script src="https://cdn.jsdelivr.net/npm/meting@1.2/dist/Meting.min.js"></script> 
	<!--网易云-->   
    <div class="aplayer" 
      data-id="4916164702" 
      data-server="netease" 
      data-type="playlist" 
      data-fixed="false" 
      data-autoplay="false" 
      data-list-folded="true"
      data-mutex="true"
      data-order="random" 
      data-loop="all"
      data-volume="0.4" 
      data-theme="#FADFA3" 
      date-preload="auto" > 
    </div>
```

> 其他属性请参照文末链接：`APlayer`

# 使用Aplayer添加本地音乐

此方式有些麻烦和复杂，界面相关属性都需要自己设置和修改，不做具体阐述，参考以下链接

> - [feilong4659196](https://www.jianshu.com/p/3fb29cc7a00b)：使用Aplayer + LeanCloud方式
> - [Y`s BLOG](https://blog.yleao.com/2018/0902/hexo上的aplayer应用.html)：使用Aplayer + 纯代码方式（Aplay官方文档也有描述）

# 使用 Pajx 实现背景音乐全局播放

即实现页面跳转刷新后音乐不间断播放

> 经测试，在博客文章中的网易云插件无法实现全局播放。（留作研究）

- 打开`themes\next\layout`文件夹找到`_layout.swig`
- 在`<\head>`标签前添加下面代码，并保存。

```javascript
<head>   //粘贴到这里
    
  <!--pjax：防止跳转页面音乐暂停-->
  <script src="https://cdn.jsdelivr.net/npm/pjax@0.2.8/pjax.js"></script> 
</head> 
```

- 在主题的配置文件中找到`pajx`，将它设置为`true`，并保存。

```
# Easily enable fast Ajax navigation on your website.
# Dependencies: https://github.com/theme-next/theme-next-pjax
pjax: true
```

在博客文件夹打开`GitBash`执行`hexo clean`、`hexo g`、`hexo s`，跳转页面时即可看到效果。

------

# 参考文章 【鸣谢】

> - [Aplay官方文档(中文版)](https://aplayer.js.org/#/zh-Hans/)
> - [Pjax](https://github.com/theme-next/theme-next-pjax)
> - [MetingJS](https://github.com/metowolf/MetingJS)
> - [Sourc0d](https://blog.csdn.net/yjwan521/article/details/80899992)
> - [hushhw](https://blog.csdn.net/hushhw/article/details/88092728)
> - [feilong4659196](https://www.jianshu.com/p/3fb29cc7a00b)
> - [Y`s BLOG](https://blog.yleao.com/2018/0902/hexo上的aplayer应用.html)



