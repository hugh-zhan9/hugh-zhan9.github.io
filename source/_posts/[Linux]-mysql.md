---
title: Linux环境下的MySQL安装
tags: [Linux, MySQL]
categories: 后端
date: 2020-11-13 23:48:29




---



[![](https://s3.ax1x.com/2020/11/13/D9gM2d.jpg)](https://imgchr.com/i/D9gM2d)



<!--more-->



Linux环境下MySQL的安装实在是太多坑了，装了三次，两次虚拟机，一次云服务器，总是能出现千奇百怪的bug。

这里记录一下大致的安装过程。

**解压安装包**：

```shell
tar -zxvf mysql-5.7.32-linux-glibc2.12-x86_64.tar.gz
```

将解压之后的文件夹移动到想要的安装目录，顺便可以重命名解压包。

这里建议移动到`/usr/lcoal`下，这也可以避免很多的麻烦，虽然这里仍然写的是`/opt`目录

```shell
mv mysql-5.7.32-linux-glibc2.12-x86_64 /opt/mysql-5.7.32
```

在**MySQL**的文件夹在创建一个`data`目录存放数据库中的数据

```shell
mkdir data
```

**创建mysql用户组和用户**

```shell
groupadd mysql
useradd -g mysql mysql
```

**执行初始化命令**(bin目录下)

```shell
./mysqld --initialize --user=mysql --datadir=/opt/mysql-5.7.32/data --basedir=/opt/mysql-5.7.32
```

执行完毕之后会获得一个临时密码。这个密码是你待会登录的密码，别忽视，不然找死你。

**启用数据传输加密**(bin目录下)：

```shell
./mysql_ssl_rsa_setup --datadir=/opt/mysql-5.7.32/data
```

**修改权限**

```shell
chown -R mysql:mysql /opt/mysql-5.7.32
chmod 777 /opt/mysql-5.7.32
```

**启动服务**(bin目录下)

```shell
service mysql start

# 或者
./mysqld_safe &     # 后台启动
```

**关闭服务**(bin目录下)

```shell
./mysqladmin -uroot -p shutdown
```

启动成功之后使用：`mysql -u root -p`进行登录，这一步大概率也会遇到各种问题，祝好运：:happy:，一些我遇到的问题，在下面做了记录，可以参考，但不能保证一定解决哈。

如果一切顺利，你来到了这里，那么接下来就基本上是一帆风顺了。

**修改登陆密码**

```shell
# 使用root登录mysql数据库
mysql -u root mysql
# 修改密码
mysql> alter user user() identified by "密码";
# 刷新权限
mysql> FLUSH PRIVILEGES;
# 退出mysql
mysql> quit
# 使用新密码登录
mysql -uroot -p
```

接下来就可以开启数据库的远程访问了，首先你要确认你的机器防火墙的3306端口的开启状态

```
use mysql;   
GRANT ALL ON *.* TO root@'%' IDENTIFIED BY '你要设置的登录密码' WITH GRANT OPTION;   
```

那么如果到了这，你应该可以远程的操作数据库了，如果出现异常概不负责，可以自行百度或者留言:laughing:，真的太多坑了。

**修改字符编码**

我没有尝试，在网上看到的方法。

```shell
# 查看当前字符编码
show variables like 'char%';
# 检测是否都是utf-8（filesystem除外），如果不是就得改，例如这个character_set_server一般是拉丁编码

# 修改编码
# 停数据库
./mysqladmin -uroot -p shutdown

# 进入 my.cnf 文件，一般是在etc路径下
vim /etc/my.cnf
# 加入要修改的字符集 修改完:wq退出
在[mysqld]下追加：
character-set-server=utf8

# 重启数据库
./mysqld_safe &
```



------------------------

**CentOS7安装MySQL**

下载并安装MySQL官方的 Yum Repository

```shell
[root@hugh-zhan9 ~]# wget -i -c http://dev.mysql.com/get/mysql57-community-release-el7-10.noarch.rpm
```

使用上面的命令就直接下载了安装用的Yum Repository，可以直接yum安装

```shell
[root@hugh-zhan9 ~]# yum -y install mysql57-community-release-el7-10.noarch.rpm
```

安装完成之后就可以安装MySQL的服务器，这一步会花费一点时间

```shell
[root@hugh-zhan9 ~]# yum -y install mysql-community-server
```

安装完成之后，启动MySQL

```shell
[root@hugh-zhan9 ~]# systemctl start  mysqld.service
```

查看MySQL运行状态:

```shell
[root@hugh-zhan9 ~]# systemctl status mysqld.service
```

此时MySQL已经开始正常运行，不过要想进入MySQL还得先找出此时root用户的密码，通过如下命令可以在日志文件中找出密码

```shell
[root@hugh-zhan9 ~]# grep "password" /var/log/mysqld.log
```

修改密码

```shell
mysql> ALTER USER 'root'@'localhost' IDENTIFIED BY '新密码';
```

开启mysql的远程访问

执行以下命令开启远程访问限制（注意：下面命令开启的IP是 192.168.0.1，如要开启所有的，用`%`代替IP）：

```sql
mysql> grant all privileges on *.* to 'root'@'192.168.0.1' identified by '连接密码' with grant option;
```

然后再输入下面两行命令

```mysql
mysql> flush privileges; 
mysql> exit
```

为`firewalld`添加开放端口，添加mysql端口3306

```shell
[root@hugh-zhan9 ~]# firewall-cmd --zone=public --add-port=3306/tcp --permanent
```

然后再重新载入

```shell
[root@hugh-zhan9 ~]# firewall-cmd --reload
```

更改mysql的编码，登录mysql输入status：

![img](https://img-blog.csdn.net/2018053119584461)

 

可以看到，绿色箭头处不是utf-8，修改`etc`目录下的`my.cnf`文件内容，新增四行代码：

![img](https://img-blog.csdn.net/20180531201748668)

保存更改后的`my.cnf`文件后，重启下mysql，然后输入status再次查看，就会发现变化啦



 

 

 



---------------------------

**一些遇到的错误**

```shell
错误：ERROR 1045 (28000): Access denied for user 'root'@'localhost' (using password: YES)
或者：错误：ERROR 1045 (28000): Access denied for user 'root'@'localhost' (using password: NO)


解决办法
　　修改my.ini/my.cnf配置文件，在[mysqld]下添加skip-grant-tables，保存后重启mysql

进入mysql，登录 mysql -u root -p 不用输入密码，直接回车（出现Enter Password 也一样直接回车，即可登陆成功）

输入use mysql，修改root的密码：update user set authentication_string=password('新密码') where user='root';
刷新权限：flush privileges;
退出：quit;

再次重启mysql，测试是否成功。
```





```
开放远程访问时遇到错误：ERROR 1819 (HY000): Your password does not satisfy the current policy requirements


查看 mysql 初始的密码策略，输入语句： SHOW VARIABLES LIKE 'validate_password%';  进行查看。
设置 validate_password_policy 的全局参数为 LOW 即可，输入设值语句：set global validate_password_policy=LOW; 
```





使用`mysql -uroot -p`登录报错：`bash: mysql: command not found`

```shell
# 错误：
root@DB-02 ~]# mysql -u root
-bash: mysql: command not found

# 原因:这是由于系统默认会查找/usr/bin下的命令，如果这个命令不在这个目录下，当然会找不到命令，我们需要做的就是映射一个链接到/usr/bin目录下，相当于建立一个链接文件。
# 首先得知道mysql命令或mysqladmin命令的完整路径，比如mysql的路径是：/opt/mysql/bin/mysql，我们则可以这样执行命令：

# ln -s /opt/mysql/bin/mysql /usr/bin

---------------------------------------------------------------------
 

以下是补充：

linux下，在mysql正常运行的情况下，输入mysql提示：mysql command not found

遇上-bash: mysql: command not found的情况别着急，这个是因为/usr/local/bin目录下缺失mysql导致，只需要一下方法建立软链接，即可以解决：

把mysql安装目录，比如MYSQLPATH/bin/mysql，映射到/usr/local/bin目录下： 
# cd /usr/local/bin
# ln -fs /MYSQLPATH/bin/mysql mysql

还有其它常用命令mysqladmin、mysqldump等不可用时候都可按用此方法解决。
注：其中MYSQLPATH是mysql的实际安装路径
```



或者报错：`Can 't connect to local MySQL server through socket '/tmp/mysql.sock '(2) ";`

```shell
https://blog.csdn.net/guanripeng/article/details/79626250

# 查找mysql.sock文件
find / -name mysql.sock  
# 如果存在直接软链接到指定文件夹
ln -s /var/lib/mysql/mysql.sock /tmp/mysql.sock
```

启动时遇到**`The server quit without updating PID file (/usr/local/[my](https://edu.aliyun.com/jiaocheng/1107)[sql](https://edu.aliyun.com/jiaocheng/1043)/var/xxx.pid). ... failed`**错误**。

```
错误解决排查思路：

1.可能是/usr/local/mysql/data/rekfan.pid文件没有写的权限
解决方法 ：给予权限，执行 “chown -R mysql:mysql /var/data” “chmod -R 755 /usr/local/mysql/data”  然后重新启动mysqld！

2.可能进程里已经存在mysql进程
解决方法：用命令 ps -ef|grep mysqld 查看是否有mysqld进程，如果有使用 kill -9 pid 杀死，然后重新启动mysqld！

3.可能是第二次在机器上安装mysql，有残余数据影响了服务的启动。
解决方法：去mysql的数据目录/data看看，如果存在mysql-bin.index，就赶快把它删除掉吧，它就是罪魁祸首了。

4.mysql在启动时没有指定配置文件时会使用/etc/my.cnf配置文件，请打开这个文件查看在[mysqld]节下有没有指定数据目录(datadir)。
解决方法：请在[mysqld]下设置这一行：datadir = /usr/local/mysql/data  <-----我当时就是这里出了问题，明明初始化的时候设置了

5.skip-federated字段问题
解决方法：检查一下/etc/my.cnf文件中有没有没被注释掉的skip-federated字段，如果有就立即注释掉吧。

6.错误日志目录不存在
解决方法：使用“chown” “chmod”命令赋予mysql所有者及权限

7.selinux惹的祸，如果是centos系统，默认会开启selinux
解决方法：关闭它，打开/etc/selinux/config，把SELINUX=enforcing改为SELINUX=disabled后存盘退出重启机器试试。


```



---------------------



如果启动失败，报错`Failed to start mysql.service: Unit not found.`这里涉及到`mariadb`，由于centos默认使用`mariadb`代替了`mysql`，所以使用这个可以解决，但是我没有尝试。

```shell
yum install -y mariadb-server
# 启动
systemctl start mariadb.service
# 设置开机启动
systemctl enable mariadb.service
-----------------------
start mariadb.service
enable mariadb.service
```



开启root远程登录

```shell
# 进入mysql数据库表
MariaDB [(none)]> use mysql;
Reading table information for completion of table and column names
You can turn off this feature to get a quicker startup with -A

Database changed

# 查看用户表
MariaDB [mysql]>  select host,user,password from user;
+-----------------------+------+-------------------------------------------+
| host                  | user | password                                  |
+-----------------------+------+-------------------------------------------+
| localhost             | root | *CAEC4DE6BE3200D208760FFC7D85DA7A96EFD967 |
| localhost.localdomain | root | *CAEC4DE6BE3200D208760FFC7D85DA7A96EFD967 |
| 127.0.0.1             | root | *CAEC4DE6BE3200D208760FFC7D85DA7A96EFD967 |
| ::1                   | root | *CAEC4DE6BE3200D208760FFC7D85DA7A96EFD967 |
| localhost             |      |                                           |
| localhost.localdomain |      |                                           |
+-----------------------+------+-------------------------------------------+
6 rows in set (0.00 sec)

# 修改root用户远程连接权限
MariaDB [mysql]> grant all privileges  on *.* to root@'%' identified by "19961220";
Query OK, 0 rows affected (0.00 sec)

MariaDB [mysql]> select host,user,password from user;
+-----------------------+------+-------------------------------------------+
| host                  | user | password                                  |
+-----------------------+------+-------------------------------------------+
| localhost             | root | *CAEC4DE6BE3200D208760FFC7D85DA7A96EFD967 |
| localhost.localdomain | root | *CAEC4DE6BE3200D208760FFC7D85DA7A96EFD967 |
| 127.0.0.1             | root | *CAEC4DE6BE3200D208760FFC7D85DA7A96EFD967 |
| ::1                   | root | *CAEC4DE6BE3200D208760FFC7D85DA7A96EFD967 |
| localhost             |      |                                           |
| localhost.localdomain |      |                                           |
| %                     | root | *CAEC4DE6BE3200D208760FFC7D85DA7A96EFD967 |
+-----------------------+------+-------------------------------------------+
7 rows in set (0.00 sec)

# 刷新权限
MariaDB [mysql]> flush privileges;
Query OK, 0 rows affected (0.00 sec)
```





-----------2021/5/27 更新：一些遇到的问题-----------



**学会查看错误日志**发现：安装mysql报错无法创建测试文件`cant create test file /usr/local/mysql…`

解决方法：删除安装时创建的的data文件夹，赋予权限：`chown 777 data路径`，重新初始化`./mysqld *--initialize --lower-case-table-names=1*`



**mysql启动：Failed to start mysqld.service: Unit not found.**

解决：

查询/etc/init.d/下是否存在mysqld

```shell
ll /etc/init.d/ | grep mysqld
```

发现该目录下并没有mysqld的文件，若存在，请备份一下

查询mysqld：

```shell
find / -name mysqld
```

执行复制操作，/usr/local/mysql/是我自己的mysql安装目录，大家根据查询出来的结果复制

```
cp mysqld的目录 /etc/init.d/mysqld 
```

然后 service mysqld start 启动成功！

 

**linux下开启、关闭、重启mysql服务命令**
**一、 启动**
1、使用 service 启动：service mysql start
2、使用 mysqld 脚本启动：/etc/inint.d/mysql start
3、使用 safe_mysqld 启动：safe_mysql&

**二、停止**
1、使用 service 启动：service mysql stop
2、使用 mysqld 脚本启动：/etc/inint.d/mysql stop
3、mysqladmin shutdown

**三、重启**
1、使用 service 启动：service mysql restart
2、使用 mysqld 脚本启动：/etc/inint.d/mysql restart



**Mysql启动错误：Please read "Security" section of the manual to find out how to run mysqld as root!**

错误：

```css
2019-01-10T15:03:17.368118Z 0 [ERROR] Fatal error: Please read "Security" section of the manual to find out how to run mysqld as root!

2019-01-10T15:03:17.368146Z 0 [ERROR] Aborting
```

此处 mysql是出于安全考虑，默认拒绝用root账号启动mysql服务。

解决方案：

加入启动参数`--user=[username]`，

可以通过在命令后面加上`--user=root`进行强制使用root账号启动。这样是最快的。

也可以通过前面创建的mysql用户启动`--user=mysql`参数

```undefined
mysqld --user=mysql --explicit_defaults_for_timestamp
```





**The innodb_system data file 'ibdata1' must be writable**

错误日志中看了提示的错误：

```
The innodb_system data file 'ibdata1' must be writable
```

应该是文件的操作权限不够,可以修改下该文件的读写权限或目录下所有文件的权限。

```
chmod -R 777 /usr/local/mysql/data/
```

执行上面命令，重启了MySQL就可以了。





**linux未找到目录项，Linux下解决命令未找到的问题**

有时候我们在Linux命令行执行某个命令时，会报命令找不到的错误，这个错误出现的原因是，在执行命令时，系统会从系统环境变量中去寻找，如果找到了就执行，没找都就会报命令未找到。下面我们拿Linux下执行`mysql mysqladmin`时，报 command not found为例讲解一下解决办法吧。

查看一下系统目前的环境变量

![](https://img-blog.csdnimg.cn/img_convert/7a2928dff61710adf946114ab5fa1c3d.png)

mysql程序安装好后，直接执行`mysql`或`mysqladmin`时，系统首先会去`/usr/bin`下寻找命令，如果不在这个目录中，当然就会找不到了。这个时候我们就需要为这些找不到的命令建立一个链接文件，链接到`/usr/bin`下。

首先我们查看一下环境变量中是否存在这个命令，操作如下：

```shell
[root@admin bin]# `which mysqladmin
```

或

```shell
[root@admin bin]# where is mysqladmin
```

如果环境变量中存在该命令，就会输出存在的具体路径，如下图

![](https://img-blog.csdnimg.cn/img_convert/019f24af52eefef270e59c2cd5463bba.png)

如果不存在就会提示命令未找到，如下图

![](https://img-blog.csdnimg.cn/img_convert/7aa5675d2dbce2ebe2b3c37691705a10.png)

做链接前，我们必须的知道这个命令所在的完整路径，比如`mysqladmin`

查找一下这个命令的完整路径

```shell
[root@admin bin]# find / -name mysqladmin
```

![](https://img-blog.csdnimg.cn/img_convert/f30b8cf060081d6fc741a6d88850709d.png)

结果可以看出，有两个地方存在`mysqladmin`，第一个我们不用管他，那是他的原始路径。接下来需要做的是把下面的路径直接链接到`/usr/bin`下。操作如下：

```shell
[root@admin bin]# ln -s /usr/local/mysql/bin/mysqladmin /usr/bin
```

链接成功以后，再次执行一下这个命令就ok了。

![](https://img-blog.csdnimg.cn/img_convert/53cdeec5a1691cbabead193672cef6f7.png)

------------------------

```shell
[root@iZbp1eu1bivr5z1aelgb9gZ bin]# service mysql start
Redirecting to /bin/systemctl start mysql.service
Failed to start mysql.service: Unit not found.
[root@iZbp1eu1bivr5z1aelgb9gZ bin]# 
```



`Can't find error-message file '/usr/local/mysql/share/errmsg.sys`

```
方法一
mysqld --basedir=/usr/soft/mysql/ --datadir=/usr/soft/mysql/data
这两个参数改为mysql的安装路径或解压路径，需要绝对路径

方法二
修改my.cnf文件中的参数
basedir = /usr/soft/mysql/
datadir = /usr/soft/mysql/data
需要说明的是，由于my.cnf文件的读取顺序不同，有可能修改之后不能够生效

读取顺序为：
/etc/my.cnf	
basedir/my.cnf
datadir/my.cnf
–defaults-extra-file #在读取全局配置文件之后，读取用户配置文件(~/.my.cnf)之前，读取extra指定的参数文件
~/.my.cnf #家目录下面的隐藏文件，my.cnf前面的点，说明my.cnf是隐藏文件
假设4个配置文件都存在，同时使用–defaults-extra-file指定了参数文件，如果这时有一个 "参数变量"在5个配置文件中都出现了，那么后面的配置文件中的参数变量值会覆盖 前面配置文件中的参数变量值，就是说会使用~/.my.cnf中设置的值。
或者可以通过下面的命令获取my.cnf的位置

mysql --help | grep 'Default options' -A 1
```



`Can't open the mysql.plugin table. Please run mysql_upgrade to create it.`

```
使用查找文件命令找到ib_logfile0 文件：
find / -name ib_logfile0
跟他在一起还有ib_logfile1文件，你只需要删除这两个文件，或者修改这两个文件名，之后再次启动mysql，就好了。
```





注：MySQL和MariaDB的区别：

LAMP架构盛极一时，这离不开MySQL的免费与易用，但是在Oracle收购了Sun之后，很多公司开始担忧MySQL的开源前景，而最近Oracle进一步闭源的举措更是让人难以安心，众多互联网公司纷纷开始寻求MySQL的替代方案。
不得不提的是Apple的远见，在Oracle收购Sun之初就宣布迁移到PostgreSQL。但PostgreSQL的设计初衷就不同于MySQL，并不是使用MySQL的大部分互联网公司合适的解决方案。除了Apple，Google、Facebook、Twitter也大量使用了MySQL，纷纷发布了自己的MySQL分支/补丁集，并为不少公司所采用。同时，MariaDB、Percona等MySQL分支也渐渐步入大众的视野。

MySQL之父Widenius先生离开了Sun之后，觉得依靠Sun/Oracle来发展MySQL，实在很不靠谱，于是决定另开分支，这个分支的名字叫做MariaDB。
MariaDB跟MySQL在绝大多数方面是兼容的，对于开发者来说，几乎感觉不到任何不同。目前MariaDB是发展最快的MySQL分支版本，新版本发布速度已经超过了Oracle官方的MySQL版本。

MariaDB 是一个采用Aria存储引擎的MySQL分支版本，是由原来 MySQL 的作者Michael Widenius创办的公司所开发的免费开源的数据库服务器。[1]
这个项目的更多的代码都改编于 MySQL 6.0，例如 “pool of threads”功能提供解决多数据连接问题。MariaDB 5.1.41 RC可以到这里下载，32位和64位已编译Linux版本，还包括源代码包。MariaDB基于GPL 2.0发布。

所以对于大部分的MySQL用户来说，从现在主流的MySQL转到MariaDB应该是没有什么难度。