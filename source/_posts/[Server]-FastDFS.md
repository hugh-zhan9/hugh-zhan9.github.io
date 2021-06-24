---
title: FastDFS分布式文件系统 —— 单体安装
tags: [FastDFS,Java]
categories: 后端
date: 2021-04-10 16:29:28




---

![](https://images3.alphacoders.com/595/thumb-1920-595064.jpg)

[](https://count.getloli.com/get/@:FastDFS-single?theme=gelbooru)



<!--more-->

# 简介

FastDFS 是一个开源的高性能分布式文件系统（DFS）。 它的主要功能包括：文件存储，文件同步和文件访问，以及高容量和负载平衡。主要解决了海量数据存储问题，特别适合以中小文件（建议范围：4 KB < file_size <500 MB）为载体的在线服务。

FastDFS 系统有三个角色：跟踪服务器(Tracker Server)、存储服务器(Storage Server)和客户端(Client)。

- **Tracker Server**：跟踪服务器，主要做调度工作，起到均衡的作用；负责管理所有的 storage server和 group，每个 storage 在启动后会连接 Tracker，告知自己所属 group 等信息，并保持周期性心跳。
- **Storage Server**：存储服务器，主要提供容量和备份服务；以 group 为单位，每个 group 内可以有多台 storage server，数据互为备份。
- **Client**：客户端，上传下载数据的服务器，也就是我们自己的项目所部署在的服务器。

 ![](https://i.loli.net/2021/04/10/kN6bnPIrgEGJ1t9.png)

## **FastDFS的存储策略**

为了支持大容量，存储节点（服务器）采用了分卷（或分组）的组织方式。存储系统由一个或多个卷组成，卷与卷之间的文件是相互独立的，所有卷的文件容量累加就是整个存储系统中的文件容量。一个卷可以由一台或多台存储服务器组成，一个卷下的存储服务器中的文件都是相同的，卷中的多台存储服务器起到了冗余备份和负载均衡的作用。

在卷中增加服务器时，同步已有的文件由系统自动完成，同步完成后，系统自动将新增服务器切换到线上提供服务。当存储空间不足或即将耗尽时，可以动态添加卷。只需要增加一台或多台服务器，并将它们配置为一个新的卷，这样就扩大了存储系统的容量。

## **FastDFS的上传过程**

FastDFS向使用者提供基本文件访问接口，比如upload、download、append、delete等，以客户端库的方式提供给用户使用。

Storage Server会定期的向Tracker Server发送自己的存储信息。当Tracker Server Cluster中的Tracker Server不止一个时，各个Tracker之间的关系是对等的，所以客户端上传时可以选择任意一个Tracker。

当Tracker收到客户端上传文件的请求时，会为该文件分配一个可以存储文件的group，当选定了group后就要决定给客户端分配group中的哪一个storage server。当分配好storage server后，客户端向storage发送写文件请求，storage将会为文件分配一个数据存储目录。然后为文件分配一个fileid，最后根据以上的信息生成文件名存储文件。

![](https://i.loli.net/2021/04/10/KlCwIHqhvfim4cG.png)

## **FastDFS的文件同步**

写文件时，客户端将文件写至group内一个storage server即认为写文件成功，storage server写完文件后，会由后台线程将文件同步至同group内其他的storage server。

每个storage写文件后，同时会写一份binlog，binlog里不包含文件数据，只包含文件名等元信息，这份binlog用于后台同步，storage会记录向group内其他storage同步的进度，以便重启后能接上次的进度继续同步；进度以时间戳的方式进行记录，所以最好能保证集群内所有server的时钟保持同步。

storage的同步进度会作为元数据的一部分汇报到tracker上，tracke在选择读storage的时候会以同步进度作为参考。

## **FastDFS的文件下载**

客户端上传成功后，会拿到一个storage生成的文件名，接下来客户端根据这个文件名即可访问到该文件。

![](https://i.loli.net/2021/04/10/PXqFEeNojHUZ673.png)

跟上传一样，在文件下载时客户端可以选择任意tracker server。tracker发送download请求给某个tracker，必须带上文件名信息，tracke从文件名中解析出文件的group、大小、创建时间等信息，然后为该请求选择一个storage用来服务读请求。

# 单体安装FastDFS服务

接下来在虚拟机中单体安装一下服务，安装需要的依赖时出现 yum 占用情况：`Another app is currently holding the yum lock; waiting for it to exit...`，表明虚拟机中有别的服务正在占用`yum`服务，关掉它。

```shell
[root@localhost ~]# yum groupinstall "Development Tools" "Server platform Development" -y
Loaded plugins: fastestmirror, langpacks
There is no installed groups file.
Maybe run: yum groups mark convert (see man yum)
Existing lock /var/run/yum.pid: another copy is running as pid 14754.
Another app is currently holding the yum lock; waiting for it to exit...
  The other application is: PackageKit
    Memory : 182 M RSS (630 MB VSZ)
    Started: Wed Apr  7 20:12:13 2021 - 05:33 ago
    State  : Sleeping, pid: 14754
^C

Exiting on user cancel.
[root@localhost ~]# ps aux|grep yum
root      14754  3.8  9.9 644932 185604 ?       SN   20:12   0:16 /usr/bin/python /usr/share/PackageKit/helpers/yum/yumBackend.py get-updates none
root      15803  0.0  0.0 112808   968 pts/1    S+   20:19   0:00 grep --color=auto yum
[root@localhost ~]# kill -9 14754
[root@localhost ~]# ps aux|grep yum
root      15835  0.0  0.0 112808   968 pts/1    S+   20:19   0:00 grep --color=auto yum
```

## 安装服务需要的依赖：

- `yum groupinstall "Development Tools" "Server platform Development" -y`
- `yum install -y libao*`
- `yum -y install cmake make gcc-c++`

```shell
[root@localhost ~]# yum groupinstall "Development Tools" "Server platform Development" -y
BDB2053 Freeing read locks for locker 0xa89: 14754/139637928314688
BDB2053 Freeing read locks for locker 0xa8b: 14754/139637928314688
...
Complete!
[root@localhost ~]# yum install -y libao*
Loaded plugins: fastestmirror, langpacks
Loading mirror speeds from cached hostfile
...                                    
Complete!
[root@localhost ~]# yum -y install cmake make gcc-c++
Loaded plugins: fastestmirror, langpacks
Loading mirror speeds from cached hostfile
...
Complete!
```

依赖安装完成后，创建目录存储需要的压缩包，同时将压缩包传入服务器

```shell
[root@localhost home]# mkdir -p /usr/local/fastdfs
[root@localhost home]# cd /usr/local/fastdfs/
[root@localhost fastdfs]# ls
fastdfs-6.06.tar.gz               libfastcommon-1.0.43.tar.gz
fastdfs-nginx-module-1.22.tar.gz  nginx-1.16.1.tar.gz
```

## 安装 FastDFS 需要的依赖包：

```shell
[root@localhost fastdfs]# tar -zxvf libfastcommon-1.0.43.tar.gz 
libfastcommon-1.0.43/
...
libfastcommon-1.0.43/src/tests/test_thourands_seperator.c
[root@localhost fastdfs]# ls
fastdfs-6.06.tar.gz               libfastcommon-1.0.43.tar.gz
fastdfs-nginx-module-1.22.tar.gz  nginx-1.16.1.tar.gz
libfastcommon-1.0.43
[root@localhost fastdfs]# cd libfastcommon-1.0.43/
[root@localhost libfastcommon-1.0.43]# ll
total 32
drwxrwxr-x 2 root root   114 Dec 25  2019 doc
-rw-rw-r-- 1 root root 10301 Dec 25  2019 HISTORY
-rw-rw-r-- 1 root root   674 Dec 25  2019 INSTALL
-rw-rw-r-- 1 root root  1607 Dec 25  2019 libfastcommon.spec
-rwxrwxr-x 1 root root  3253 Dec 25  2019 make.sh
drwxrwxr-x 2 root root   191 Dec 25  2019 php-fastcommon
-rw-rw-r-- 1 root root  2776 Dec 25  2019 README
drwxrwxr-x 3 root root  4096 Dec 25  2019 src
```

编译并安装服务：

```shell
[root@localhost libfastcommon-1.0.43]# ./make.sh 
cc -Wall -D_FILE_OFFSET_BITS=64 -D_GNU_SOURCE -g -O3 -c -o hash.o hash.c  
...
common_blocked_queue.o multi_socket_client.o skiplist_set.o json_parser.o buffered_file_writer.o
[root@localhost libfastcommon-1.0.43]# ./make.sh install
mkdir -p /usr/lib64
mkdir -p /usr/lib
mkdir -p /usr/include/fastcommon
...
if [ ! -e /usr/lib/libfastcommon.so ]; then ln -s /usr/lib64/libfastcommon.so /usr/lib/libfastcommon.so; fi
```

因为FastDFS主程序设置的lib目录是在`usr/local/lib`，所以需要设置软链接

```shell
[root@localhost libfastcommon-1.0.43]# ln -s /usr/lib64/libfastcommon.so  /usr/local/lib/libfastcommon.so
[root@localhost libfastcommon-1.0.43]# ln -s /usr/local/lib64/libfdfsclient.so /usr/local/lib/libfdfsclient.so
[root@localhost libfastcommon-1.0.43]# ln -s /usr/local/lib64/libfdfsclient.so /usr/lib/libfdfsclient.so
```

## 安装FastDFS主程序

解压主程序压缩包，修改安装路径（可选）：

```shell
cd 至解压路径

vi make.sh
修改前：TARGET_PREFIX=$DESTDIR/usr
修改后：TARGET_PREFIX=$DESTDIR/usr/local

编译并安装
./make.sh
./make.sh install
```

安装后：

- `/usr/local/bin`：可执行文件所在位置，默认安装在`/usr/bin`中
- `/etc/fdfs`：配置文件所在位置
- `/usr/local/lib64`：主程序代码所在位置，默认在`/usr/bin`中
- `/usr/local/include/fastdfs`：包含的一些组件所在位置。默认在`/usr/include/fastdfs`中

服务配置与脚本所在位置

`/etc/init.d`：脚本所在位置

```shell
[root@localhost fdfs]# cd /etc/init.d
[root@localhost init.d]# ll
total 60
-rwxr-xr-x  1 root root   961 Apr  7 21:06 fdfs_storaged
-rwxr-xr-x  1 root root   963 Apr  7 21:06 fdfs_trackerd
-rw-r--r--. 1 root root 18281 Aug 19  2019 functions
lrwxrwxrwx. 1 root root    35 Nov  5 20:17 jexec -> /usr/java/latest/.java/init.d/jexec
-rwxr-xr-x. 1 root root 10576 Nov 13 22:31 mysql
-rwxr-xr-x. 1 root root  4569 Aug 19  2019 netconsole
-rwxr-xr-x. 1 root root  7928 Aug 19  2019 network
-rw-r--r--. 1 root root  1160 Apr  1  2020 README
```

`/etc/fdfs`：配置文件所在位置

```shell
[root@localhost fastdfs-6.06]# cd /etc/fdfs/
[root@localhost fdfs]# ll
total 32
-rw-r--r-- 1 root root  1909 Apr  7 21:06 client.conf.sample
-rw-r--r-- 1 root root 10246 Apr  7 21:06 storage.conf.sample
-rw-r--r-- 1 root root   620 Apr  7 21:06 storage_ids.conf.sample
-rw-r--r-- 1 root root  9138 Apr  7 21:06 tracker.conf.sample
```

`/usr/local/bin`：内置命令

```shell
[root@localhost init.d]# cd /usr/local/bin
[root@localhost bin]# ll
total 52324
-rw-r--r--. 1 root root     7473 Nov  9 23:57 dump.rdb
-rwxr-xr-x  1 root root   362256 Apr  7 21:06 fdfs_appender_test
-rwxr-xr-x  1 root root   362032 Apr  7 21:06 fdfs_appender_test1
-rwxr-xr-x  1 root root   348912 Apr  7 21:06 fdfs_append_file
-rwxr-xr-x  1 root root   348528 Apr  7 21:06 fdfs_crc32
-rwxr-xr-x  1 root root   348944 Apr  7 21:06 fdfs_delete_file
-rwxr-xr-x  1 root root   349680 Apr  7 21:06 fdfs_download_file
-rwxr-xr-x  1 root root   349632 Apr  7 21:06 fdfs_file_info
-rwxr-xr-x  1 root root   364952 Apr  7 21:06 fdfs_monitor
-rwxr-xr-x  1 root root   349168 Apr  7 21:06 fdfs_regenerate_filename
-rwxr-xr-x  1 root root  1280144 Apr  7 21:06 fdfs_storaged
-rwxr-xr-x  1 root root   372120 Apr  7 21:06 fdfs_test
-rwxr-xr-x  1 root root   367240 Apr  7 21:06 fdfs_test1
-rwxr-xr-x  1 root root   512360 Apr  7 21:06 fdfs_trackerd
-rwxr-xr-x  1 root root   349872 Apr  7 21:06 fdfs_upload_appender
-rwxr-xr-x  1 root root   350888 Apr  7 21:06 fdfs_upload_file
-rwxr-xr-x. 1 root root  6398656 Nov  5 22:13 redis-benchmark
-rwxr-xr-x. 1 root root 11321584 Nov  5 22:13 redis-check-aof
-rwxr-xr-x. 1 root root 11321584 Nov  5 22:13 redis-check-rdb
-rwxr-xr-x. 1 root root  6726104 Nov  5 22:13 redis-cli
lrwxrwxrwx. 1 root root       12 Nov  5 22:13 redis-sentinel -> redis-server
-rwxr-xr-x. 1 root root 11321584 Nov  5 22:13 redis-server
-rwxr-xr-x  1 root root     1768 Apr  7 21:06 restart.sh
-rwxr-xr-x  1 root root     1680 Apr  7 21:06 stop.sh
```



复制配置文件

```shell
[root@localhost bin]# cd /etc/fdfs/
[root@localhost fdfs]# ll
total 32
-rw-r--r-- 1 root root  1909 Apr  7 21:06 client.conf.sample
-rw-r--r-- 1 root root 10246 Apr  7 21:06 storage.conf.sample
-rw-r--r-- 1 root root   620 Apr  7 21:06 storage_ids.conf.sample
-rw-r--r-- 1 root root  9138 Apr  7 21:06 tracker.conf.sample
[root@localhost fdfs]# cp tracker.conf.sample tracker.conf
[root@localhost fdfs]# cp storage.conf.sample storage.conf
[root@localhost fdfs]# ll
total 56
-rw-r--r-- 1 root root  1909 Apr  7 21:06 client.conf.sample
-rw-r--r-- 1 root root 10246 Apr  7 21:16 storage.conf
-rw-r--r-- 1 root root 10246 Apr  7 21:06 storage.conf.sample
-rw-r--r-- 1 root root   620 Apr  7 21:06 storage_ids.conf.sample
-rw-r--r-- 1 root root  9138 Apr  7 21:16 tracker.conf
-rw-r--r-- 1 root root  9138 Apr  7 21:06 tracker.conf.sample

```

修改`trackerd`配置文件：

```conf
# is this config file disabled
# false for enabled
# true for disabled
# 配置文件是否不生效，false为生效
disabled = false

# bind an address of this host
# empty for bind all addresses of this host
bind_addr =

# the tracker server port
port = 22122

# connect timeout in seconds
# default value is 30
# Note: in the intranet network (LAN), 2 seconds is enough.
connect_timeout = 5

# network timeout in seconds for send and recv
# default value is 30
network_timeout = 60

# the base path to store data and log files
# 文件存储路径
base_path = /home/yuqing/fastdfs

# max concurrent connections this server support
# you should set this parameter larger, eg. 10240
# default value is 256
max_connections = 1024

# accept thread count
# default value is 1 which is recommended
# since V4.07
accept_threads = 1

# work thread count
# work threads to deal network io
# default value is 4
# since V2.00
work_threads = 4

# the min network buff size
# default value 8KB
min_buff_size = 8KB

# the max network buff size
# default value 128KB
max_buff_size = 128KB

# the method for selecting group to upload files
# 0: round robin
# 1: specify group
# 2: load balance, select the max free space group to upload file
store_lookup = 2

# which group to upload file
# when store_lookup set to 1, must set store_group to the group name
store_group = group2

# which storage server to upload file
# 0: round robin (default)
# 1: the first server order by ip address
# 2: the first server order by priority (the minimal)
# Note: if use_trunk_file set to true, must set store_server to 1 or 2
store_server = 0

# which path (means disk or mount point) of the storage server to upload file
# 0: round robin
# 2: load balance, select the max free space path to upload file
store_path = 0

# which storage server to download file
# 0: round robin (default)
# 1: the source storage server which the current file uploaded to
download_server = 0

# reserved storage space for system or other applications.
# if the free(available) space of any stoarge server in 
# a group <= reserved_storage_space, no file can be uploaded to this group.
# bytes unit can be one of follows:
### G or g for gigabyte(GB)
### M or m for megabyte(MB)
### K or k for kilobyte(KB)
### no unit for byte(B)
### XX.XX% as ratio such as: reserved_storage_space = 10%
reserved_storage_space = 20%

#standard log level as syslog, case insensitive, value list:
### emerg for emergency
### alert
### crit for critical
### error
### warn for warning
### notice
### info
### debug
log_level = info

#unix group name to run this program, 
#not set (empty) means run by the group of current user
run_by_group=

#unix username to run this program,
#not set (empty) means run by current user
run_by_user =

# allow_hosts can ocur more than once, host can be hostname or ip address,
# "*" (only one asterisk) means match all ip addresses
# we can use CIDR ips like 192.168.5.64/26
# and also use range like these: 10.0.1.[0-254] and host[01-08,20-25].domain.com
# for example:
# allow_hosts=10.0.1.[1-15,20]
# allow_hosts=host[01-08,20-25].domain.com
# allow_hosts=192.168.5.64/26
allow_hosts = *

# sync log buff to disk every interval seconds
# default value is 10 seconds
sync_log_buff_interval = 1

# check storage server alive interval seconds
check_active_interval = 120

# thread stack size, should >= 64KB
# default value is 256KB
thread_stack_size = 256KB

# auto adjust when the ip address of the storage server changed
# default value is true
storage_ip_changed_auto_adjust = true

# storage sync file max delay seconds
# default value is 86400 seconds (one day)
# since V2.00
storage_sync_file_max_delay = 86400

# the max time of storage sync a file
# default value is 300 seconds
# since V2.00
storage_sync_file_max_time = 300

# if use a trunk file to store several small files
# default value is false
# since V3.00
use_trunk_file = false 

# the min slot size, should <= 4KB
# default value is 256 bytes
# since V3.00
slot_min_size = 256

# the max slot size, should > slot_min_size
# store the upload file to trunk file when it's size <=  this value
# default value is 16MB
# since V3.00
slot_max_size = 1MB

# the alignment size to allocate the trunk space
# default value is 0 (never align)
# since V6.05
# NOTE: the larger the alignment size, the less likely of disk
#       fragmentation, but the more space is wasted.
trunk_alloc_alignment_size = 256

# if merge contiguous free spaces of trunk file
# default value is false
# since V6.05
trunk_free_space_merge = true

# if delete / reclaim the unused trunk files
# default value is false
# since V6.05
delete_unused_trunk_files = false

# the trunk file size, should >= 4MB
# default value is 64MB
# since V3.00
trunk_file_size = 64MB

# if create trunk file advancely
# default value is false
# since V3.06
trunk_create_file_advance = false

# the time base to create trunk file
# the time format: HH:MM
# default value is 02:00
# since V3.06
trunk_create_file_time_base = 02:00

# the interval of create trunk file, unit: second
# default value is 38400 (one day)
# since V3.06
trunk_create_file_interval = 86400

# the threshold to create trunk file
# when the free trunk file size less than the threshold,
# will create he trunk files
# default value is 0
# since V3.06
trunk_create_file_space_threshold = 20G

# if check trunk space occupying when loading trunk free spaces
# the occupied spaces will be ignored
# default value is false
# since V3.09
# NOTICE: set this parameter to true will slow the loading of trunk spaces 
# when startup. you should set this parameter to true when neccessary.
trunk_init_check_occupying = false

# if ignore storage_trunk.dat, reload from trunk binlog
# default value is false
# since V3.10
# set to true once for version upgrade when your version less than V3.10
trunk_init_reload_from_binlog = false

# the min interval for compressing the trunk binlog file
# unit: second, 0 means never compress
# FastDFS compress the trunk binlog when trunk init and trunk destroy
# recommand to set this parameter to 86400 (one day)
# default value is 0
# since V5.01
trunk_compress_binlog_min_interval = 86400

# the interval for compressing the trunk binlog file
# unit: second, 0 means never compress
# recommand to set this parameter to 86400 (one day)
# default value is 0
# since V6.05
trunk_compress_binlog_interval = 86400

# compress the trunk binlog time base, time format: Hour:Minute
# Hour from 0 to 23, Minute from 0 to 59
# default value is 03:00
# since V6.05
trunk_compress_binlog_time_base = 03:00

# max backups for the trunk binlog file
# default value is 0 (never backup)
# since V6.05
trunk_binlog_max_backups = 7

# if use storage server ID instead of IP address
# if you want to use dual IPs for storage server, you MUST set
# this parameter to true, and configure the dual IPs in the file
# configured by following item "storage_ids_filename", such as storage_ids.conf
# default value is false
# since V4.00
use_storage_id = false

# specify storage ids filename, can use relative or absolute path
# this parameter is valid only when use_storage_id set to true
# since V4.00
storage_ids_filename = storage_ids.conf

# id type of the storage server in the filename, values are:
## ip: the ip address of the storage server
## id: the server id of the storage server
# this paramter is valid only when use_storage_id set to true
# default value is ip
# since V4.03
id_type_in_filename = id

# if store slave file use symbol link
# default value is false
# since V4.01
store_slave_file_use_link = false

# if rotate the error log every day
# default value is false
# since V4.02
rotate_error_log = false

# rotate error log time base, time format: Hour:Minute
# Hour from 0 to 23, Minute from 0 to 59
# default value is 00:00
# since V4.02
error_log_rotate_time = 00:00

# if compress the old error log by gzip
# default value is false
# since V6.04
compress_old_error_log = false

# compress the error log days before
# default value is 1
# since V6.04
compress_error_log_days_before = 7

# rotate error log when the log file exceeds this size
# 0 means never rotates log file by log file size
# default value is 0
# since V4.02
rotate_error_log_size = 0

# keep days of the log files
# 0 means do not delete old log files
# default value is 0
log_file_keep_days = 0

# if use connection pool
# default value is false
# since V4.05
use_connection_pool = true

# connections whose the idle time exceeds this time will be closed
# unit: second
# default value is 3600
# since V4.05
connection_pool_max_idle_time = 3600

# HTTP port on this tracker server
# Http服务的端口号
http.server_port = 8080

# check storage HTTP server alive interval seconds
# <= 0 for never check
# default value is 30
http.check_alive_interval = 30

# check storage HTTP server alive type, values are:
#   tcp : connect to the storge server with HTTP port only, 
#        do not request and get response
#   http: storage check alive url must return http status 200
# default value is tcp
http.check_alive_type = tcp

# check storage HTTP server alive uri/url
# NOTE: storage embed HTTP server support uri: /status.html
http.check_alive_uri = /status.html
```

启动`trackerd`服务

```shell
[root@localhost home]# cd /etc/init.d/
[root@localhost init.d]# ll
total 60
-rwxr-xr-x  1 root root   961 Apr  7 21:06 fdfs_storaged
-rwxr-xr-x  1 root root   963 Apr  7 21:06 fdfs_trackerd
-rw-r--r--. 1 root root 18281 Aug 19  2019 functions
lrwxrwxrwx. 1 root root    35 Nov  5 20:17 jexec -> /usr/java/latest/.java/init.d/jexec
-rwxr-xr-x. 1 root root 10576 Nov 13 22:31 mysql
-rwxr-xr-x. 1 root root  4569 Aug 19  2019 netconsole
-rwxr-xr-x. 1 root root  7928 Aug 19  2019 network
-rw-r--r--. 1 root root  1160 Apr  1  2020 README

[root@localhost init.d]# vi fdfs_trackerd 
修改前：PRG=/usr/bin/fdfs_trackerd
修改后：PRG=/usr/local/bin/fdfs_trackerd

启动：
[root@localhost init.d]# ./fdfs_trackerd start
Starting FastDFS tracker server: 

查看启动状态
[root@localhost init.d]# ./fdfs_trackerd status
fdfs_trackerd (pid 32845) is running...

设置开启启动
[root@localhost init.d]# vi /etc/rc.d/rc.local 
在文件中添加：/etc/init.d/fdfs_tracked start
```



修改`Storage`配置文件：

```conf
# is this config file disabled
# false for enabled
# true for disabled
disabled = false

# the name of the group this storage server belongs to
#
# comment or remove this item for fetching from tracker server,
# in this case, use_storage_id must set to true in tracker.conf,
# and storage_ids.conf must be configured correctly.
group_name = group1

# bind an address of this host
# empty for bind all addresses of this host
bind_addr =

# if bind an address of this host when connect to other servers 
# (this storage server as a client)
# true for binding the address configured by the above parameter: "bind_addr"
# false for binding any address of this host
client_bind = true

# the storage server port
port = 23000

# connect timeout in seconds
# default value is 30
# Note: in the intranet network (LAN), 2 seconds is enough.
connect_timeout = 5

# network timeout in seconds for send and recv
# default value is 30
network_timeout = 60

# the heart beat interval in seconds
# the storage server send heartbeat to tracker server periodically
# default value is 30
heart_beat_interval = 30

# disk usage report interval in seconds
# the storage server send disk usage report to tracker server periodically
# default value is 300
stat_report_interval = 60

# the base path to store data and log files
# NOTE: the binlog files maybe are large, make sure
#       the base path has enough disk space,
#       eg. the disk free space should > 50GB
# 存放进程号、日志等基础的数据
base_path = /home/fastdfs/storage/base

# max concurrent connections the server supported,
# you should set this parameter larger, eg. 10240
# default value is 256
max_connections = 1024

# the buff size to recv / send data from/to network
# this parameter must more than 8KB
# 256KB or 512KB is recommended
# default value is 64KB
# since V2.00
buff_size = 256KB

# accept thread count
# default value is 1 which is recommended
# since V4.07
accept_threads = 1

# work thread count
# work threads to deal network io
# default value is 4
# since V2.00
work_threads = 4

# if disk read / write separated
##  false for mixed read and write
##  true for separated read and write
# default value is true
# since V2.00
disk_rw_separated = true

# disk reader thread count per store path
# for mixed read / write, this parameter can be 0
# default value is 1
# since V2.00
disk_reader_threads = 1

# disk writer thread count per store path
# for mixed read / write, this parameter can be 0
# default value is 1
# since V2.00
disk_writer_threads = 1

# when no entry to sync, try read binlog again after X milliseconds
# must > 0, default value is 200ms
sync_wait_msec = 50

# after sync a file, usleep milliseconds
# 0 for sync successively (never call usleep)
sync_interval = 0

# storage sync start time of a day, time format: Hour:Minute
# Hour from 0 to 23, Minute from 0 to 59
sync_start_time = 00:00

# storage sync end time of a day, time format: Hour:Minute
# Hour from 0 to 23, Minute from 0 to 59
sync_end_time = 23:59

# write to the mark file after sync N files
# default value is 500
write_mark_file_freq = 500

# disk recovery thread count
# default value is 1
# since V6.04
disk_recovery_threads = 3

# store path (disk or mount point) count, default value is 1
store_path_count = 1

# store_path#, based on 0, to configure the store paths to store files
# if store_path0 not exists, it's value is base_path (NOT recommended)
# the paths must be exist.
#
# IMPORTANT NOTE:
#       the store paths' order is very important, don't mess up!!!
#       the base_path should be independent (different) of the store paths
# 文件存储的路径
store_path0 = /home/yuqing/fastdfs
#store_path1 = /home/yuqing/fastdfs2

# subdir_count  * subdir_count directories will be auto created under each 
# store_path (disk), value can be 1 to 256, default value is 256
subdir_count_per_path = 256

# tracker_server can ocur more than once for multi tracker servers.
# the value format of tracker_server is "HOST:PORT",
#   the HOST can be hostname or ip address,
#   and the HOST can be dual IPs or hostnames seperated by comma,
#   the dual IPS must be an inner (intranet) IP and an outer (extranet) IP,
#   or two different types of inner (intranet) IPs.
#   for example: 192.168.2.100,122.244.141.46:22122
#   another eg.: 192.168.1.10,172.17.4.21:22122
# 修改成你tracker的地址
tracker_server = 192.168.209.121:22122
tracker_server = 192.168.209.122:22122

#standard log level as syslog, case insensitive, value list:
### emerg for emergency
### alert
### crit for critical
### error
### warn for warning
### notice
### info
### debug
log_level = info

#unix group name to run this program, 
#not set (empty) means run by the group of current user
run_by_group =

#unix username to run this program,
#not set (empty) means run by current user
run_by_user =

# allow_hosts can ocur more than once, host can be hostname or ip address,
# "*" (only one asterisk) means match all ip addresses
# we can use CIDR ips like 192.168.5.64/26
# and also use range like these: 10.0.1.[0-254] and host[01-08,20-25].domain.com
# for example:
# allow_hosts=10.0.1.[1-15,20]
# allow_hosts=host[01-08,20-25].domain.com
# allow_hosts=192.168.5.64/26
allow_hosts = *

# the mode of the files distributed to the data path
# 0: round robin(default)
# 1: random, distributted by hash code
file_distribute_path_mode = 0

# valid when file_distribute_to_path is set to 0 (round robin).
# when the written file count reaches this number, then rotate to next path.
# rotate to the first path (00/00) after the last path (such as FF/FF).
# default value is 100
file_distribute_rotate_count = 100

# call fsync to disk when write big file
# 0: never call fsync
# other: call fsync when written bytes >= this bytes
# default value is 0 (never call fsync)
fsync_after_written_bytes = 0

# sync log buff to disk every interval seconds
# must > 0, default value is 10 seconds
sync_log_buff_interval = 1

# sync binlog buff / cache to disk every interval seconds
# default value is 60 seconds
sync_binlog_buff_interval = 1

# sync storage stat info to disk every interval seconds
# default value is 300 seconds
sync_stat_file_interval = 300

# thread stack size, should >= 512KB
# default value is 512KB
thread_stack_size = 512KB

# the priority as a source server for uploading file.
# the lower this value, the higher its uploading priority.
# default value is 10
upload_priority = 10

# the NIC alias prefix, such as eth in Linux, you can see it by ifconfig -a
# multi aliases split by comma. empty value means auto set by OS type
# default values is empty
if_alias_prefix =

# if check file duplicate, when set to true, use FastDHT to store file indexes
# 1 or yes: need check
# 0 or no: do not check
# default value is 0
check_file_duplicate = 0

# file signature method for check file duplicate
## hash: four 32 bits hash code
## md5: MD5 signature
# default value is hash
# since V4.01
file_signature_method = hash

# namespace for storing file indexes (key-value pairs)
# this item must be set when check_file_duplicate is true / on
key_namespace = FastDFS

# set keep_alive to 1 to enable persistent connection with FastDHT servers
# default value is 0 (short connection)
keep_alive = 0

# you can use "#include filename" (not include double quotes) directive to 
# load FastDHT server list, when the filename is a relative path such as 
# pure filename, the base path is the base path of current/this config file.
# must set FastDHT server list when check_file_duplicate is true / on
# please see INSTALL of FastDHT for detail
##include /home/yuqing/fastdht/conf/fdht_servers.conf

# if log to access log
# default value is false
# since V4.00
use_access_log = false

# if rotate the access log every day
# default value is false
# since V4.00
rotate_access_log = false

# rotate access log time base, time format: Hour:Minute
# Hour from 0 to 23, Minute from 0 to 59
# default value is 00:00
# since V4.00
access_log_rotate_time = 00:00

# if compress the old access log by gzip
# default value is false
# since V6.04
compress_old_access_log = false

# compress the access log days before
# default value is 1
# since V6.04
compress_access_log_days_before = 7

# if rotate the error log every day
# default value is false
# since V4.02
rotate_error_log = false

# rotate error log time base, time format: Hour:Minute
# Hour from 0 to 23, Minute from 0 to 59
# default value is 00:00
# since V4.02
error_log_rotate_time = 00:00

# if compress the old error log by gzip
# default value is false
# since V6.04
compress_old_error_log = false

# compress the error log days before
# default value is 1
# since V6.04
compress_error_log_days_before = 7

# rotate access log when the log file exceeds this size
# 0 means never rotates log file by log file size
# default value is 0
# since V4.02
rotate_access_log_size = 0

# rotate error log when the log file exceeds this size
# 0 means never rotates log file by log file size
# default value is 0
# since V4.02
rotate_error_log_size = 0

# keep days of the log files
# 0 means do not delete old log files
# default value is 0
log_file_keep_days = 0

# if skip the invalid record when sync file
# default value is false
# since V4.02
file_sync_skip_invalid_record = false

# if use connection pool
# default value is false
# since V4.05
use_connection_pool = true

# connections whose the idle time exceeds this time will be closed
# unit: second
# default value is 3600
# since V4.05
connection_pool_max_idle_time = 3600

# if compress the binlog files by gzip
# default value is false
# since V6.01
compress_binlog = true

# try to compress binlog time, time format: Hour:Minute
# Hour from 0 to 23, Minute from 0 to 59
# default value is 01:30
# since V6.01
compress_binlog_time = 01:30

# if check the mark of store path to prevent confusion
# recommend to set this parameter to true
# if two storage servers (instances) MUST use a same store path for
# some specific purposes, you should set this parameter to false
# default value is true
# since V6.03
check_store_path_mark = true

# use the ip address of this storage server if domain_name is empty,
# else this domain name will ocur in the url redirected by the tracker server
http.domain_name =

# the port of the web server on this storage server
http.server_port = 8888
```

启动服务

```shell
修改启动文件
[root@localhost init.d]# vi /etc/init.d/fdfs_storaged 
修改前：PRG=/usr/bin/fdfs_storaged
修改后：PRG=/usr/local/bin/fdfs_storaged

启动服务:
[root@localhost init.d]# ./fdfs_storaged start
Starting FastDFS storage server: 
```



## nginx安装

解压`fastdfs-nginx-module-1.22.tar.gz`包，修改解压目录下`src`文件夹中的`config`文件

```shell
修改配置：
[root@localhost src]# vi config 

ngx_addon_name=ngx_http_fastdfs_module

if test -n "${ngx_module_link}"; then
    ngx_module_type=HTTP
    ngx_module_name=$ngx_addon_name
    ngx_module_incs="/usr/local/include"
    ngx_module_libs="-lfastcommon -lfdfsclient"
    ngx_module_srcs="$ngx_addon_dir/ngx_http_fastdfs_module.c"
    ngx_module_deps=
    CFLAGS="$CFLAGS -D_FILE_OFFSET_BITS=64 -DFDFS_OUTPUT_CHUNK_SIZE='256*1024' -DFDFS_MOD_CONF_FILENAME='\"/etc/fdfs/mod_fastdfs.conf\"'"
    . auto/module
else
    HTTP_MODULES="$HTTP_MODULES ngx_http_fastdfs_module"
    NGX_ADDON_SRCS="$NGX_ADDON_SRCS $ngx_addon_dir/ngx_http_fastdfs_module.c"
    CORE_INCS="$CORE_INCS /usr/local/include/fastdfs /usr/include/fastcommon/"
    CORE_LIBS="$CORE_LIBS -lfastcommon -lfdfsclient"
    CFLAGS="$CFLAGS -D_FILE_OFFSET_BITS=64 -DFDFS_OUTPUT_CHUNK_SIZE='256*1024' -DFDFS_MOD_CONF_FILENAME='\"/etc/fdfs/mod_fastdfs.conf\"'"
fi

如果没有修改则改为：CORE_INCS="$CORE_INCS /usr/include/fastdfs"
```

安装 nginx 需要的依赖

```shell
yum install -y gcc gcc-c++ make automake autoconf libtool pcre pcre-develzlib zlib-devel openssl openssl-devel
```

将`fastdfs-nginx-module`模块加入到 nginx 并编译安装：

```shell
在nginx文件夹下：
./configure \
--prefix=/usr/local/nginx \
--pid-path=/var/run/nginx/nginx.pid \
--lock-path=/var/lock/nginx.lock \
--error-log-path=/var/log/nginx/error.log \
--http-log-path=/var/log/nginx/access.log \
--with-http_gzip_static_module \
--http-client-body-temp-path=/var/temp/nginx/client \
--http-proxy-temp-path=/var/temp/nginx/proxy \
--http-fastcgi-temp-path=/var/temp/nginx/fastcgi \
--http-uwsgi-temp-path=/var/temp/nginx/uwsgi \
--http-scgi-temp-path=/var/temp/nginx/scgi \
--add-module=/usr/local/fastdfs/fastdfs-nginx-module-1.22/src

make 
make install
```

提供FastDFS需要的HTTP配置文件

复制FastDFS安装包种的两个配置文件（`http.conf`和`mime.types`）到`etc/fdfs`目录下

```shell
[root@localhost fdfs]# cp /usr/local/fastdfs/fastdfs-6.06/conf/http.conf /etc/fdfs/
[root@localhost fdfs]# cp /usr/local/fastdfs/fastdfs-6.06/conf/mine.types /etc/fdfs/
```

创建nginx需要的软链接

```shell
[root@localhost fdfs]# ln -s /usr/local/lib64/libfdfsclient.so /usr/lib64/libfdfsclient.so
```

nginx启动后，会默认的`/usr/lib64`目录下寻找需要的so文件。如果在安装FastDFS时，修改了`make.sh`文件中的`TARGET_PREFIX`参数则必须创建此软链接

创建网络访问存储服务的软连接

```shell
[root@localhost fdfs]# ln -s /fastdfs/storage/store/data /fastdfs/storage/store/data/M00
```

修改nginx的配置文件：

```conf
user  root;
# worker_processes  1;

#error_log  logs/error.log;
#error_log  logs/error.log  notice;
#error_log  logs/error.log  info;

#pid        logs/nginx.pid;


events {
    worker_connections  1024;
}


http {
    include       mime.types;
    default_type  application/octet-stream;

    #log_format  main  '$remote_addr - $remote_user [$time_local] "$request" '
    #                  '$status $body_bytes_sent "$http_referer" '
    #                  '"$http_user_agent" "$http_x_forwarded_for"';

    #access_log  logs/access.log  main;

    sendfile        on;
    #tcp_nopush     on;

    #keepalive_timeout  0;
    keepalive_timeout  65;

    #gzip  on;

    server {
        listen       8888;
        server_name  localhost;

        location / {
            root   html;
            index  index.html index.htm;
        }

        location ~/group[0-9]/M00 {
            ngx_fastdfs_module;
        }

        #error_page  404              /404.html;

        # redirect server error pages to the static page /50x.html
        #
        error_page   500 502 503 504  /50x.html;
        location = /50x.html {
            root   html;
        }

        # proxy the PHP scripts to Apache listening on 127.0.0.1:80
        #
        #location ~ \.php$ {
        #    proxy_pass   http://127.0.0.1;
        #}

        # pass the PHP scripts to FastCGI server listening on 127.0.0.1:9000
        #
        #location ~ \.php$ {
        #    root           html;
        #    fastcgi_pass   127.0.0.1:9000;
        #    fastcgi_index  index.php;
        #    fastcgi_param  SCRIPT_FILENAME  /scripts$fastcgi_script_name;
        #    include        fastcgi_params;
        #}

        # deny access to .htaccess files, if Apache's document root
        # concurs with nginx's one
        #
        #location ~ /\.ht {
        #    deny  all;
        #}
    }


    # another virtual host using mix of IP-, name-, and port-based configuration
    #
    #server {
    #    listen       8000;
    #    listen       somename:8080;
    #    server_name  somename  alias  another.alias;

    #    location / {
    #        root   html;
    #        index  index.html index.htm;
    #    }
    #}


    # HTTPS server
    #
    #server {
    #    listen       443 ssl;
    #    server_name  localhost;

    #    ssl_certificate      cert.pem;
    #    ssl_certificate_key  cert.key;

    #    ssl_session_cache    shared:SSL:1m;
    #    ssl_session_timeout  5m;

    #    ssl_ciphers  HIGH:!aNULL:!MD5;
    #    ssl_prefer_server_ciphers  on;

    #    location / {
    #        root   html;
    #        index  index.html index.htm;
    #    }
    #}

}
```

再启动nginx就可以通过nginx访问FastDFS中的文件了



# 使用Java API来控制FastDFS文件存储

## FastDFS-Client使用方式

在项目Pom当中加入依赖，Maven依赖为

```xml
<dependency>
    <groupId>com.github.tobato</groupId>
    <artifactId>fastdfs-client</artifactId>
    <version>1.27.2</version>
</dependency>
```

在application.yml当中配置Fdfs相关参数

```
# ===================================================================
# 分布式文件系统FDFS配置
# ===================================================================
fdfs:
  so-timeout: 1501
  connect-timeout: 601 
  thumb-image:             #缩略图生成参数
    width: 150
    height: 150
  tracker-list:            #TrackerList参数,支持多个
    - 192.168.1.105:22122
    - 192.168.1.106:22122 
```

连接池的管理参数

应用启动后拥有两个连接池管理对象:

- Tracker连接池(`TrackerConnectionManager`)
- Storage连接池(`FdfsConnectionManager`)

必要的时候可以注入这两个对象，跟踪打印并分析连接池的情况，两个连接池的参数配置一致，可参考 ConnectionPoolConfig 与 apache.pool2 进行优化配置，默认配置为

```
fdfs:
   ..其他配置信息..
  pool:
    #从池中借出的对象的最大数目（配置为-1表示不限制）
    max-total: -1
    #获取连接时的最大等待毫秒数(默认配置为5秒)
    max-wait-millis: 5*1000
    #每个key最大连接数
    max-total-per-key: 50
    #每个key对应的连接池最大空闲连接数
    max-idle-per-key: 10
    #每个key对应的连接池最小空闲连接数
    min-idle-per-key: 5
```

**注意: key配置的是连接服务端的地址(IP+端口)连接情况，如果有连接不够用的情况可以调整以上参数**

使用接口服务对 FastDFS 服务端进行操作，主要接口包括

```
1. TrackerClient - TrackerServer接口
2. GenerateStorageClient - 一般文件存储接口 (StorageServer接口)
3. FastFileStorageClient - 为方便项目开发集成的简单接口(StorageServer接口)
4. AppendFileStorageClient - 支持文件续传操作的接口 (StorageServer接口)
```





> 参考：
>
> https://www.cnblogs.com/qiuhom-1874/p/12366808.html
> 配置参考：https://blog.csdn.net/ajsfo/article/details/6106438
> 实现图床的思路：https://blog.csdn.net/W_Meng_H/article/details/85402879
> https://blog.csdn.net/zhoujian_Liu/article/details/80840269
> 集群部署：https://blog.csdn.net/xifeijian/article/details/38568521

