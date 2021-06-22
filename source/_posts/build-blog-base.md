---
title: 基于Hexo+GitHub搭建个人博客 --搭建篇
date: 2020-02-07 14:36:40
tags: [hexo, node.js, Github]
categories:  杂谈
---

# 前言
搭建个人博客的初衷与好处就不再赘述，详情可以浏览*[写在最前面的一些话](http://hugh-zhan9.xyz/2020/02/06/hello-blog/)*
再次记录一下基本步骤以及所遇到的问题，仅供参考
= = = =
进入主题
<!--more-->
* 基于Hexo搭建博客的基本流程大致为：
    安装Node.js 安装hexo 本地测试运行 部署  
当然其中会有关于博客美化的操作，将在下一篇*[基于Hexo+GitHub搭建个人博客 --美化篇](http://hugh-zhan9.xyz/2020/02/09/build-blog)* 中记录

* 系统配置与版本型号
OS: Windows_NT 10.0.17763
Node.js: 12.14.1
Npm: 6.13.4
Hexo: 3.1.0
Git: 2.24.1.windows.2

* **其余操作系统的步骤大同小异**
* 文中提到的**<font color=red>站点配置文件</font>**指的是博客文件根目录下的`_config.yml`文件，**<font color=red>主题配置文件</font>**是主题文件夹下的`_config.yml`文件，不要混淆了。
------

# 安装Node.js
>Node.js的安装方式有很多种，Windows用户可以直接[Node.js官方网站](https://nodejs.org/en/)下载，下载完成之后直接安装就好。
接下来就可以查看是否成功安装
```
node -v
npm -v
```
由于npm在国内下载速度缓慢，可以将npm更换为淘宝镜像：
```
npm config set registry https://registry.npm.taobao.org/
```

# 安装Git
Git安装可以直接到[Git官网](https://git-scm.com/download/win) 下载安装即可
启动Git Bash执行`git --version`查看是否安装成功

#使用Hexo建立一个博客
Hexo是一个快速、简洁且高效的博客框架. Hexo 使用 Markdown（或其他渲染引擎）解析文章, 在几秒内即可生成静态网页.
* 接下来的操作所有操作系统都一样，在Git bash中运行
新建一个Blog文件夹，即使之后博客出现问题直接删除文件夹重建即可
```
mkdir Blog
```
进入刚刚新建的Blog文件夹中，使用Hexo建立博客
```
cd Blog
hexo init
```
等待完成...

# 启动博客
```
hexo s
```
这个时候会有如下提示在命令行中
```
INFO  Start processing
INFO  Hexo is running at http://localhost:4000 . Press Ctrl+C to stop.
```
那么我们的博客基石就算搭建完成，可以在浏览器中使用[http://localhost:4000](http://localhost:4000)访问。

# hexo的基本命令
在博客的使用过程中，有一些基本的hexo命令需要我们掌握
>hexo clean #清除缓存文件 (db.json) 和已生成的静态文件 (public)
>hexo g # 等同于hexo generate, 生成静态文件
>hexo s # 等同于hexo server, 在本地服务器运行
>hexo new "title"  # 生成新文章: \source\_posts\title.md
>hexo new page "title"  # 生成新的页面, 后面可在主题配置文件中配置页面
>hexo d # 等同于hexo deploy，将本地博客部署到服务器，可与hexo g合并为 hexo d -g

# 编辑文章
你使用hexo new "title"新建的文章会保存在blog\source\_posts文件夹中，打开文章

* title: Start My Blog Trip — Power By Hexo  # 文章页面上的显示名称, 可以任意修改, 不会出现在URL中
* date: 2017-01-10 23:49:28  # 文章生成时间, 一般不改
* categories: diary  # 文章分类目录, 多个分类使用[a,b,c]这种格式
* tags: [Hexo,diary]  # 文章标签

要想写出好看的博客，你还需要掌握markdown格式的输入原则
```
 <!--more-->
```
> more标签以下的内容要点击“阅读全文”才能看见

## 插入图片
### 方式一
在博客根目录的 `source` 文件夹下新建一个 `img` 文件夹专门存放图片, 在博文中引用的图片路径为 `/img/图片名.后缀`

```
![](图片路径)
```
### 方式二
对于那些想要更有规律地提供图片和其他资源以及想要将他们的资源分布在各个文章上的人来说, Hexo也提供了更组织化的方式来管理资源, 将**站点配置文件**中的 `post_asset_folder` 选项设为 `true` 来打开文章资源文件夹

```
post_asset_folder: true
```
然后再博文中通过相对路径引用
```
{% asset_img 图片文件名 %}
```

### 方式三
使用*[七牛云储存](http://www.qiniu.com/)*, 因为Github项目容量有限, 而且Github的主机在国外, 访问速度较慢, 把图片放在国内的图床上是个更好的选择, 免费用户实名审核之后, 新建空间, 专门用来放置博客上引用的资源, 进入空间后点击「内容管理」, 再点击「上传」
![](https://cdn.yangbingdong.com/uploadImg.png)

上传完成之后点击关闭回到管理页面, 选中刚上传的图片, 最右边的操作点击复制链接即可
![](https://cdn.yangbingdong.com/img/build-hexo/copyUrl.png)
然后在博文中通过地址引用
```
![](图片地址如: https://cdn.yangbingdong.com/img/build-hexo/copyUrl.png)
```


# 部署到Github
在此之前, 先安装**Git部署插件**
```
npm install hexo-deployer-git --save
```
打**开站点配置文件**, 拉到底部, 修改部署配置:
```
# Deployment
## Docs: https://hexo.io/docs/deployment.html
deploy:
  type: git
  repo: https://github.com/yourName/yourName1.git #此处yourName1表示你的仓库名必须与你的名称一样
  branch: master
```
保存后终端执行
```
hexo clean && hexo g && hexo d
```
稍等片刻, 可能会由于环境、网络等原因, 部署的时间会有偏差, 有的人快有的慢
部署完成后可在浏览器输入 `yourName.github.io` 就可以浏览到一个属于自己的博客了 ～


# 总结

最后用拙劣的语言总结一下博主搭建Hexo博客的体会, 六个字: 简洁但不简单.
再六个字, 正如NexT官方说的: 精于心, 简于形
= =貌似这个博客也不怎么简洁, 有点花俏, 装X嫌疑
人生在于折腾...

# 参考
> ***[使用Hexo搭建个人博客(基于hexo3.0) ](http://opiece.me/2015/04/09/hexo-guide/)***
> ***[Github Pages个人博客, 从Octopress转向Hexo](http://codepub.cn/2015/04/06/Github-Pages-personal-blog-from-Octopress-to-Hexo/#)***
> ***[Hexo 3.1.1 静态博客搭建指南](http://lovenight.github.io/2015/11/10/Hexo-3-1-1-%E9%9D%99%E6%80%81%E5%8D%9A%E5%AE%A2%E6%90%AD%E5%BB%BA%E6%8C%87%E5%8D%97/)***
> ***[Hexo官方文档](https://hexo.io/zh-cn/)***
> ***[NexT官方文档](http://theme-next.iissnan.com/getting-started.html)***
>
> 大部分热门的静态页面生成器都可在下面这个网页找到:
> ***[https://www.staticgen.com/](https://www.staticgen.com/)***
