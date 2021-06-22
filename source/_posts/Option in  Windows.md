---
title: Windows 下的一些操作
tags: [Windows]
categories: 杂谈
date: 2021-02-06 22:20:11





---



Windows环境下可能需要的一些操作。

<!--more-->

# Windows 端口号被占用的关闭方法

使用`win+R`键，召唤出运行窗口，并在运行窗口的文本输入框中输入`cmd`命令.

![](https://i.loli.net/2021/01/22/R7a5mL4vfeSgKWt.jpg)

```shell
# 查询指定端口号的使用情况，xxx表示端口号。查询后的结果最后一行为该进程对应的编号。
netstat-aon|findstr "xxxx"

# 查询该进程对应的应用程序。
tasklist|findstr "xxxx"

# 关闭查询到的应用程序名称。
taskkill /f /t /im "xxxx"
```



# Windows 关闭进程命令

```shell
# 使用进程名关闭
taskkill /im mspaint.exe /f

# 使用 pid 关闭
taskkill /in 12555 /f
```

# Windows下强制删除文件及文件夹命令

```shell
# 删除文件或目录
rd/s/q 盘符:\文件夹目录
del/f/s/q 盘符:\文件名   # 文件名需加后缀

# 删除文件或目录的BAT命令
# 新建.bat批处理文件输入如下命令，然后将要删除的文件拖到批处理文件图标上即可删除。
DEL /F/A/Q
RD /S /Q 
```



