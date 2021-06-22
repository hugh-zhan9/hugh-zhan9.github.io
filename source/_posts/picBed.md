---
title: 使用PicGo+码云Gitee建立国内高速图床
date: 2020-11-15 00:04:40
tags: [blog, 图床]
categories: 后端
---





限制于GitHub的访问速度，使用Gitee搭建一个图床

<!--more-->

# 环境

- PicGo最新版
- Node.js
- 码云账号

# 配置

1. 新建码云仓库

   记住仓库的路径，类似于：`https://gitee.com/hugh-zhan9/pic-go-image-host`。这也是你之后的图床地址。

   仓库设置为公开。

2. 创建Token

   点击头像，设置，进入到安全设置中的私人令牌页面。生成新的私人令牌。描述随便填什么，最好按照你的用途填写，记住这个私人令牌。

3. PicGo设置

   下载插件 githubPlus

   在图床设置中配置 githubPlus

   ![](https://gitee.com/hugh-zhan9/pic-go-image-host/raw/master/picbed.PNG)

   

   rep：仓库地址的后半段

   token：私人令牌

   配置完成之后设置为默认图床，点击确认

4. 设置快捷键

   PicGo中可以设置上传快捷键，`ctrl+c`复制图片之后直接按下设置的快捷键即可上传。