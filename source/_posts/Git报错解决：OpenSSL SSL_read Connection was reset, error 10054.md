---
title: git error 10054
tags: [Git]
categories: 杂谈
date: 2021-06-19 14:20:11






---



Git push的时候报错：`OpenSSL SSL_read: Connection was reset, error 10054` 

<!--more-->



*首先，造成这个错误很有可能是网络不稳定，连接超时导致的，
如果再次尝试后依然报错，可以执行下面的命令。*

**临时解决方案**

**打开Git命令页面，执行git命令脚本：修改设置，解除ssl验证**

```
git config --global http.sslVerify "false"
```

此时，再执行git操作即可。

**使用SSH方式链接远程仓库，而不是HTTP** 

```
https://github.com/xiangshuo1992/preload.git
git@github.com:xiangshuo1992/preload.git
```

这两个地址展示的是同一个项目，但是这两个地址之间有什么联系呢？

- 前者是 HTTPS URL 直接有效网址打开，用户每次通过git提交的时候都要输入用户名和密码，
- 后者是SSH URL，远程仓库配置SSH Key的目的是为了帮助我们在通过git提交代码是，不需要繁琐的验证过程，简化操作流程。

**步骤**

1. 设置 git 的 user name 和 email
   如果你是第一次使用，或者还没有配置过的话需要操作一下命令，自行替换相应字段。

```
git config --global user.name "hugh-zhang"
git config --global user.email  "hugh_zhan9@163.com"
```

说明：`git config --list` 查看当前 Git 环境所有配置，还可以配置一些命令别名之类的。

2. 检查是否存在SSH Key

   ```
   cd ~/.ssh
   ls 或者 ll
   //看是否存在 id_rsa 和 id_rsa.pub文件，如果存在，说明已经有SSH Key
   ```

   如果没有SSH Key，则需要先生成一下

   ```
   ssh-keygen -t rsa -C "hugh_zhan9@163.com"
   ```

   执行之后继续执行以下命令来获取 SSH Key

   ```
   cd ~/.ssh
   ls 或者 ll
   //看是否存在 id_rsa 和 id_rsa.pub文件，如果存在，说明已经有SSH Key
   ```

3. 获取 SSH Key

   ```
   cat id_rsa.pub
   //拷贝秘钥 ssh-rsa
   ```

4. 远程仓库添加SSH Key
   在设置中新建一个SSH Key，把之前拷贝的秘钥复制进去，添加就好啦。

5. 验证和修改
   测试是否成功配置SSH Key

   ```
   ssh -T git@github.com
   //运行结果出现类似如下
   Hi hugh-zhan9! You've successfully authenticated, but GitHub does not provide shell access.
   ```

   之前已经是https的链接，直接修改项目目录下 .git文件夹下的 config 文件，将地址修改一下就好了。

