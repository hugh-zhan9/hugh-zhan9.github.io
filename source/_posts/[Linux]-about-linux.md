---
title: Linux基本知识
tags: Linux
categories: 后端
date: 2020-11-22 20:49:28



---



Linux基本知识

<!--more-->



> https://www.cnblogs.com/kevinyau/p/11084416.html

以网络为核心的设计思想

`kali linux`：安全渗透测试



`LNMP：（linux+nginx+mysql+php）`

`LAMP：（linux+apache+mysql+php）`



基于命令行



阿里云购买服务器，开启Linux防火墙的端口之后，要在本实例安全组开放端口，端口授权对象：`0.0.0.0`（允许所有人访问）。



开机会启动很多程序，在windows中叫做服务，Linux中叫守护进行



登录方式：

- 命令行登录：`[ctrl+Alt+F2]`
- ssh
- 图形界面



指令：

```shell
$ command [-options] parameter1 parameter2
	命令		选项		参数1		参数2
```

中括号`[]`并不存在于实际指令，加入选项设定时，通常会带`-`号，例如`-h`；有时候会使用选项的完整全名，则选项前面带有`--`，例如`--help`；

指令、选项、参数之间使用空格来区分，不论几个空格都会视为一个。

> 注：在Linux中区分大小写，例如cd和CD是完全不同的东西。



1. 显示日期的指令：`date`
2. 显示日历的指令：`cal `、`cal [year]`、`cal [month] [year]`
3. 简单计算器：`bc`，使用`quit`退出。



数据同步写入磁盘：`syns`

# 《鸟哥的Linux私房菜》第五章





> 关机

关机指令为`shutdown`

```shell
sync # 将数据同步到硬盘中

shutdown

shutdown -h 10 # 十分钟之后关机

shutdown -h now # 立马关机

shutdown -h 20:25 # 20:25关机

shutdown -h +10 # 

shutdown -r now # 立即重启

shutdown -r +10 # 十分钟后重启

reboot # 重启，等同于shutdown -r now

halt # 关闭系统，等同于shutdown -h now 和poweroff
```

不管是关机还是重启，首先运行`sync`命令，同步数据。



> 系统目录结构

- 一切皆文件

- 根目录`/`，所有的文件都挂载在这个节点下



运行`ls /`

```shell
bin boot dev rtv home lib lib64 media mnt opt proc root run sbin srv sys tmp usr var
```

`/bin`：Binary的缩写，存放常用的命令。

`/boot`：存放Linux启动时使用的一些核心文件，包括一些连接文件以及镜像文件。

`/dev`：Device的缩写，存放Linux的外部设备，在Linux中访问设备的方式和访问文件的方式是相同的。

<font color=red>`/etc`：存放所有的系统管理所需要的配置文件和子目录。(redis，tomcat...)</font>

<font color=red>`/home`：用户的主目录。</font>

`/lib`：存放着系统最基本的动态连接库，作用类似于windows里的 DLL 文件。

`/lost+found`：一般是空的，当系统非法关闭时，会存放一些文件

`/media`：Linux会自动识别一些设备，例如U盘，光驱等，识别后就会挂载在这个目录下。

`/mnt`：给用户临时挂载别的文件系统的，可以将光驱挂载在`/mnt/`上，然后进入这个目录就可以查看光驱中的内容。（后面会把一些本地文件挂载在这个文件夹下。）

<font color=red>`/opt`：给额外安装软件所留的目录。</font>

`/proc`：这个目录是一个虚拟的目录，是系统内存的映射，可以通过直接访问这个目录来获取系统信息。(不用管)

`/root`：系统管理员目录，也称作超级权限者的用户主目录。

`/sbin`：s就是Super User的意思，这里存放的是系统管理员使用的系统管理程序。

`/srv`：存放服务启动之后需要提取的数据。

`/sys`：linux2.6内核的一个很大的变化，该目录下安装了2.6内核中新出现的一个文件系统 sysfs。

<font color=red>`/tmp`：存放一些临时文件</font>

`/usr`：类似于Windows下的program files，用户很多的应用程序文件都会放在这个文件目录下。

`/usr/bin`：系统用户使用的应用程序

`/usr/sbin`：超级用户使用的比较高级的管理程序和系统守护程序

`/usr/src`：内核源码的放置目录

`/var`：存放不断扩充的东西，一般将经常修改的目录放在这个目录下，包括各种日志文件。

`/run`：一个临时文件系统，存储系统启动以来的信息，当系统重启时，这个目录下的文件就会被清除。

`/www`：存放服务器网站相关的资源，环境，网站的项目



> 常用基本命令

所有的Linux命令可以组合使用，例如：`ls -al`

# 目录管理

绝对路径，相对路径



`ls`：列出目录

- `-a`：查看全部，包括隐藏文件
- `-l`：列出所有文件，包含文件的属性和权限，没有隐藏文件



`cd`：切换目录



`mkdir`：新建目录

- `-p`：创建多级目录，`mkdir -p test/test1/test2`



`rmdir`：删除目录（只能删除空目录）

- `-p`：递归删除多级删除



`pwd`：查看当前所在目录



`cp`：复制文件或者目录，`cp [原目录] [目标目录]`



`rm`：移除文件或目录

- `-r`：递归删除目录
- `-f`：忽略不存在的文件，不会出现警告，强制删除
- `-i`：询问是否删除

`rm -rf /`：删除系统中所有文件，俗称**删库跑路**



`mv`：移动文件或者目录 / 重命名

- `-f`：强制移动
- `-u`：只替换已更新文件





# 基本属性

使用`ls -ll`查看文件的属性



第一个字符表示这个文件的类型

<font color=red>`[d]`：表示目录</font>

<font color=red>`[-]`：表示文件</font>

<font color=red>`[l]`：表示链接文档(link file)</font>

`[b]`：表示装置文件里面的可供存储的接口设备（可随机存取装置）

`[c]`：装置文件里面的串行端口设备，例如键盘，鼠标（一次性读取装置）

接下来的字符三个一组，均为`[rwx]`三个字母的组合，**三个组分别表示属主权限，属组权限，其他人权限**

`[r]`：表示可读

`[w]`：表示可写

`[x]`：表示可执行(execute)

`[-]`：表示不可操作



# 修改文件属性

`chgrp`：更改文件属组，`chgrp [属组名] [文件名]`

- `-R`：递归更改文件属组，如果在更改某个目录的属组时加上`-R`参数，那么该目录下所有文件的属组都会更改。



`chown`：更改文件属主，也可以同时修改文件属组

```shell
chown -R [属主名] [文件名]
chown -R [属主名]:[属组名] [文件名]
```



`chmod`：更改文件属性，`chmod xxx [filename]`

Linux文件属性由两种设置方法，一种是数字（常用），一种是符号。Linux文件的基本权限有九个，分别是`owner/group/others`三种身份各自的`read/write/execute`权限，数字421分别对应字母`rwx`。

```shell
r:4		w:2		x:1

可读可写可执行:7
可读可写不可执行:6

chmod 777 [文件名] 	赋予所有用户该文件可读可写可执行权限
```



# 文件内容查看

`cat`：由第一行开始显示文件内容

`tac`：由最后一行开始显示文件内容

`nl`：显示的时候，同步输出行号

`more`：一页一页地显示文件内容，空格键翻页，回车表示向下翻一行，`:f`显示行号，`q`命令退出，`/字符串`表示向下查询字符串，`?字符串`表示向上查询字符串，`N`表示上一个。

`less`：与`more`类似，但是可以向前翻页，上下键翻动页面，`q`命令退出，`/字符串`表示向下查询字符串，`?字符串`表示向上查询字符串，`n`表示搜寻下一个，`N`表示上一个。

`head`：只看头几行，`-n`表示看几行

`tail`：只看尾几行，`-n`表示看几行



可以使用`man [命令]`查看各个命令的使用文档，如：`man cp`。



# 硬链接和软链接

硬链接：A链接B，当删除两者中的某个文件时，另外一个文件还是可以访问。即相当于允许一个文件拥有多个路径，可以通过这种机制建立硬链接到重要文件上，防止误删。

软链接（符号链接）：类似Windows下的快捷方式，删除源文件，快捷方式失效。



`ln`：创建链接，默认硬链接，`ln [文件名] [链接文件名]`

- `-s`：创建软链接



`touch`：创建文件



`echo`：输出字符串，`echo "i love programing" >>[文件名]`，将字符串写入到文件中。



# Vim编辑器

三种模式：命令模式，编辑模式，底线命令模式

> 命令模式

`vim [文件名]` 直接进入命令模式，如果文件不存在则创建新文件。

`i`：切换到编辑模式

`:`：进入底线命令模式，如果时处于输入模式先按下`ESC`键退出编辑模式。

`x`：删除当前光标所在处的字符



>编辑模式

命令模式下按下`i`进入到编辑模式



> 底线命令模式

命令模式按下`:`进入底线命令模式。

`:w`：保存

`:wq`：表示保存修改，退出vim编辑器

`:w!`：强制写入

`:q!`：强制退出，不会保存

`ZZ`：如档案改动过则储存后退出，如档案没有改动过，则不储存直接离开

`:set nu`：设置显示行号

`:set nonu`：设置隐藏行号

> 命令模式下的命令：

`hjkl`表示上下左右移动光标

`ctrl+f`：屏幕向下移动一页

`ctrl+b`：屏幕向上移动一页

`ctrl+d`：屏幕向下移动半页

`ctrl+u`：屏幕向上移动半页

`+`：光标移动到非空格符的下一行

`-`：光标移动到非空格符的上一行

`n<space>`：移动n个字符

`n<enter>`：移动n行

`0/[home]`：移动到本行的结束

`$/[end]`：移动到本行的开始

`H`：光标移动到屏幕最上方那一行的第一个字符

`M`：光标移到到屏幕中间那一行的第一个字符

`L`：光标移动到屏幕最后一行的第一个字符

`G`： 光标移动到档案的最后一行。

`nG`：表示移动到这个档案的第n行

`gg`：移动到这个档案的第一行，



替换/搜索

```shell
# 全匹配
/[查找的字符]	向下查
?[查找的字符]	向上查

# 模糊查询
.	匹配一个字符
*	匹配多个字符

n/N 	分别表示查找下一处和上一处
```



...

https://blog.csdn.net/ballack_linux/article/details/53187283

https://blog.csdn.net/qq_42007020/article/details/107536377

# 用户管理

实际上就是修改文件：`/etc/passwd`

```
用户名：口令（登陆密码，不可见）：用户标识号：组标识号：注释性描述：主目录：登录shell
```

这个文件的每一行都表示一个用户，可以在这个文件中看出用户的主目录在哪，属于哪个组。



`useradd`：创建用户

- `-m`：自动创建这个用户的主目录
- `-G`：给用户分配组



`userdel`：删除用户

- `-r`：删除用户时将他的目录也一起删除



`usermod`：修改用户，`usermod [修改内容] [用户名称]`



`su username`：切换用户。`exit`或`logout`可以退回原来的用户。



`hostname [hostname]`：即可修改主机名称（临时的）



`passwd [用户名]`：用户密码设置（root账户下修改）

`passwd`：用户密码设置（非root用户修改本身密码）

`passwd -l [用户名]`：锁定账户



# 用户组管理

组的增加、删除和修改实际上是对`etc/gruop`文件的更新

`groupadd`：创建一个用户组，`groupadd [组名]`

创建完一个用户组后可以从`/etc/group`文件中得到一个组的id，这个id是可以通过`-g`指定的。`groupadd -g [id] [组名]`



`groupdel`：删除用户组



`groupmod`：修改用户组的权限信息和名字

- `-g`：修改id
- `-n`：修改名称





# 磁盘管理

`df`：列出文件系统整体的磁盘使用量

- `-h`：以M/G为单位显示磁盘容量



`du`：检查当前磁盘空间使用量

- `-a`：包含隐藏文件
- `-sm /*`：检查根目录下每个目录所占用的容量



Linux挂载磁盘

```shell
mount /dev/hugh /mnt/hugh
将外部设备hugh挂载到mnt目录下
umount [挂载位置]
卸载 
umont -f [挂载位置] 	 强制卸载
```





# 进程管理

每一个进程都有一个pid号，每一个进程都会有一个父进程，

进程有两种存在方式：前台/后台运行

一般服务都是后台运行，基本的程序都是前台运行。



<font color=red>`ps`：查看当前系统中正在执行的各种进程的信息</font>

- `-a`：显示终端当前运行的所有进程的信息
- `-u`：显示当前用户运行的所有进程的信息
- `-x`：显示后台运行进程的参数
- `-ef`：查看父进程的信息（一般使用pstree查看）

```
ps -aux|
# | 在Linux中叫做管道符 		A|B 将A命令的结果给B命令作为参数
grep 查找文件中符合条件的字符串.

ps -aux|grep mysql	查看进程中所有和mysql相关的进程
```



`pstree`：查看进程树

- `-p`：显示父id
- `-u`：显示用户组

`kill`：结束进程，`kill -9 [进程的pid]`

-------------------------------------

# 软件安装



## rpm安装

Java安装

```
解压压缩包
命令:tar -zxvf jdk-8u171-linux-x64.tar.gz -C /usr/local/src/
因为我的jdk放在这个目录下所以直接解压到这个src目录下了

配置环境变量：vi /etc/profile

另起一行写下如下数据
export JAVA_HOME=/usr/local/src/jdk1.8.0_171 （根据自己的完整路径修改）
export PATH=$PATH:$JAVA_HOME/bin:$JAVA_HOME/jre/bin:$PATH
export CLASSPATH=.:$JAVA_HOME/lib:$JAVA_HOME/jre/lib

执行命令:source /etc/profile 让环境变量生效
然后执行以下命令验证是否安装成功:
java -version
此时就可以看到自己的环境变量已经设置成功了.显示了JDK的版本
```

npm方式

```shell
检测当前环境是否存在Java环境 java-version
如果有的话就卸载： 
	rpm -qa|grep jdk 检测JDK版本信息
	rpm -e --nodeps [jdk版本信息]  卸载命令
	
rpm -ivh [rpm安装包] 	安装


/etc/profile	配置环境变量(/etc/profile就是环境变量文件)
vim /etc/profile  	修改环境变量，在最后一行添加：
	JAVA_HOME=/usr/java/jdk1.8.0_271-amd64
	JRE_HOME=$JAVA_HOME/jre
	CLASSPATH=.:$JAVA_HOME/lib/dt.jar:$JAVA_HOME/lib/tools.jar:$JRE_HOME/lib/rt.jar
	PATH=$PATH:$JAVA_HOME/bin:$JRE_HOME/bin
	export JAVA_HOME JRE_HOME CLASSPATH PATH

source /etc/profile 让配置文件生效

firewall-cmd --list-ports  	查看防火墙开启端口列表
firewall-cmd --zone=public --add-port=[需要开启的端口号]/tcp --permanent 	开启端口命令
	--zone：作用域
	--80/tcp：端口/通讯协议
	--permanent：永久有效，否则重启之后失效
systemctl restart firewalld.service	重启防火墙服务


java -jar [项目名称]	发布项目	可以通过 nohuop后台执行
```





## 解压缩安装

```shell
tar -zxvf [文件名.tar.gz] 	解压文件

./startup.sh	 cd进入bin目录启动.sh文件即可执行对应的操作
```

域名解析后，端口时80 -http或者443 -https可以直接访问，如果是9000 8080，就需要通过Apache或者Nginx反向代理即可。



## yum在线安装

docker安装

```shell
# yum安装命令
yum -y install [包名] 	# yum install 安装命令  -y自动确认所有提示



# 检测当前系统版本
cat /etc/redhat-release 	

# 安装准备环境
yum -y install gcc
yum -y install gcc-c++

# 清除以前的docker
yum remove docker \ docker-client \ docker-client-latest \ docker-common \ docker-latest \ docker-latest-logrotate \ docker-logrotate \ docker-engine

# 安装docker需要的依赖
yum install -y yum-utils
yum install -y device-mapper-persistent-data 
yum install -y lvm2

# 安装阿里云docker镜像
yum-config-manager --add-repo http://mirrors.aliyun.com/docker-ce/linux/centos/docker-ce.repo

# 更新yum软件包索引
yum makecache fast

# 安装docker CE
yum -y install docker-ce docker-ce-cli containerd.io

# 启动docker
systemctl start docker

# 测试
docker version
docker run hello-world
docker images
```





# 防火墙

```shell
# 查看firewall服务状态
systemctl status firewalld
# 防火墙服务

service firewalld start	# 开启
service firewalld restart	# 重启
service firewalld stop	# 停止

# 查看防火墙规则
firewall-cmd --list-all	# 查看全部信息
firewall-cmd --list-ports	# 查看端口信息

# 开启端口
firewall-cmd --zone=public --add-port=3306/tcp --permanent

# 重启防火墙
systemctl restart firewalled.service

# 命令含义
--zone	# 作用域
--add-port=80/tcp	# 添加端口，格式为：端口/通讯协议
--permanent	# 永久有效，否则重启之后失效
```



# Vmware

## 快照

保留当前系统信息为快照，随时可以恢复，以防系统出现问题。



## 本地网络配置

需要保证Linux虚拟机和本机处于同一个网段（计算机网络原理）

例如：

Windows：`192.168.0.106`

Linux：`192.168.0.110`



`/etc/sysconfig/network-scripts/ifcfg-eno16777736`

### 动态配置

修改`vim ifcfg-eno16777736`

```
TYPE=Ethernet
PROXY_METHOD=none
BROWSER_ONLY=no
BOOTPROTO=dhcp
DEFROUTE=yes
IPV4_FAILURE_FATAL=no
IPV6INIT=yes
IPV6_AUTOCONF=yes
IPV6_DEFROUTE=yes
IPV6_FAILURE_FATAL=no
IPV6_ADDR_GEN_MODE=stable-privacy
NAME=eno16777736
UUID=e9c1a29d-8483-439b-b438-b54ee084b211
DEVICE=eno16777736
ONBOOT=yes
PEERDNS=yes
PEERROUTES=yes
IPV6_PEERDNS=yes
IPV6_PEERROUTES=yes
```



### 静态配置

```
TYPE=Ethernet
BOOTPROTO=none
DEFROUTE=yes
NAME=eno16777736
UUID=e9c1a29d-8483-439b-b438-b54ee084b211
ONBOOT=yes
DNS1=8.8.8.8
IPADDR=192.168.0.110
PREFIX=24
GATEWAY=192.168.0.1
IPV4_FAILURE_FATAL=no
IPV6INIT=no
```



### 傻瓜式配置，只有图形界面有效

`nm-connection-editor`





# redis 安装

```shell
# 解压redis的压缩文件
tar -zxvf [redis压缩文件名称]

# 解压完成之后执行make命令编译，如果没有安装gcc会报错，使用make distclean清理之前的编译
make

#报错
server.c:2868:11: error: ‘struct redisServer’ has no member named ‘cron_malloc_stats’
     server.cron_malloc_stats.allocator_resident = 0;
           ^
....

# 错误原因：gcc版本问题，新版本的。redis6.0以上，升级版本
yum -y install centos-release-scl
yum -y install devtoolset-9-gcc devtoolset-9-gcc-c++ devtoolset-9-binutils
scl enable devtoolset-9 bash
# 注意：scl命令启用只是临时的，退出xshell或者重启就会恢复到原来的gcc版本。
# 如果要长期生效的话，执行如下：
echo "source /opt/rh/devtoolset-9/enable" >>/etc/profile

# 再次执行make命令即可编译

# 创建快捷方式至 /usr/local/bin
make install

# 前台启动（会占用整个命令行窗口）
redis-server
# 后台启动redis
redis-server &
# 启动redis服务时，指定配置文件（redis.conf）
redis-server [配置文件名称] &

# 关闭redis
redis-cli shutdown

# 启动redis客户端连接redis
redis-cli
# 连接指定端口号下的redis服务，默认6379
redis-cli -p [端口号]
# 连接其它地址的redis服务
redis-cli -h [ip地址] -p [端口号]

# 关闭客户端，在客户端下执行
exit/quit
```



## redis安装遇到的问题：

Redis安装完成之后，启动会默认使用安全模式启动

![](https://upload-images.jianshu.io/upload_images/1368054-fe79012e98f787ba.png?imageMogr2/auto-orient/strip|imageView2/2/w/1200/format/webp)

```log
redis.clients.jedis.exceptions.JedisDataException: DENIED Redis is running in protected mode because protected mode is enabled
```

本机可以通过redis-cli连接，而其他机器却不可以连接。

解决：

修改配置文件../redis.conf

```conf
# bind 127.0.0.1  注释调用这个
bind 0.0.0.0	# 使用这个表示所有的机器都可以连接
```

Redis默认不是以守护进程的方式运行，可以通过该配置项修改，使用yes启用守护进程

```conf
daemonize  yes   # 改为yes可以使redis以守护进程的方式启动
```

将保护模式关闭

```conf
protected-mode no # 关闭保护模式
```

指定配置文件启动redis：

```shell
./redis-server redis.conf 
```


如果还是不行的话，使用本机连接Redis，使用命令`CONFIG SET protected-mode no`关闭保护模式。

> 参考：
>
> https://www.cnblogs.com/supery007/p/8718532.html
>
> https://blog.csdn.net/kawayiyy123/article/details/107110946









# tomcat 安装



下载好tomcat压缩包，移动到`/usr/local/tomcat`解压。

```shell
tar -zxvf apache-tomcat-9.0.39.tar.gz
```

解压之后即可在tomcat目录下的bin目录

```shell
# 启动
./catalina.sh start
./startup.sh

# 关闭
./catalina.sh stop
./shutdown
```

> https://www.cnblogs.com/moonsoft/p/9264883.html



