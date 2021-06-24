---
title: 长沙信息规划中心-面试
tags: [Java, 面试]
categories: Java
date: 2021-03-13 11:54:11


---







第一次面试可以说是惨不忍睹了😭

<!--more-->



1. `Redis`如何实现单点登录的，描述以下实现过程

   ```
   1. cookie + redis实现
      - 在任何一个模块中登录，在登陆后把数据放到两个地方
      redis：key使用唯一随机值（ip、用户ID等等），value使用用户数据
      cookie：把redis中生成key放到cookie中
   
      - 访问项目中的其他模块，发送请求带着cookie进行发送，获取cookie值查询redis.
   2. 使用token令牌实现
      token是按照一定规则生成的字符串，字符串中可以包含用户信息。（自包含令牌）
      原理：在某个模块进行登录，登录之后按照一定规则生成字符串，把登录之后用户包含到生成字符串中，把字符串返回（   1. 通过cookie返回字符串 2. 通过地址栏返回字符串），再去访问其他模块时，每次访问在地址栏或cookie中带着字符串，在访问模块中获取字符串，根据字符串获取用户信息。如果可以获取到就是登录状态。
   ```

2. Spring Cloud中有用到哪些组件

   ```
   Spring Cloud 
   注册中心：Eureka 服务调用：Feign 负载均衡：Ribbon 服务容错/降级：Hystrix 网关：Zuul
   
   Spring Cloud Alibaba
   注册中心：Nacos 服务容错/降级：Sentinel 消息队列：RocketMQ 分布式事务:Seata
   
   Spring或其它开源厂商
   网关：gateway
   ```

3. Spring Cloud feign中有哪些注解，服务端和客户端应该怎么配置

   ```
   // 引入依赖
   <dependencies>
       <dependency>
           <groupId>org.springframework.cloud</groupId>
           <artifactId>spring-cloud-starter-feign</artifactId>
       </dependency>
   </dependencies>
   
   @EnableDiscoveryClient	服务端使用，将服务注册给注册中心
   @EnableFeignClients 	开启服务调用，配置在启动类上开启扫描Spring Cloud Feign客户端的功能
   @FeignClient	创建一个Feign的客户端接口定义。使用@FeignClient注解来指定这个接口所要调用的服务名称
   修改Controller。通过定义的feign客户端来调用服务提供方的接口
   
   // 配置文件中配置服务中心地址
   ```

4. Spring MVC的生命周期（执行过程）

   ```
   发起请求到前端控制器(DispatcherServlet)
   前端控制器请求HandlerMapping（处理器映射器）查找 Handler，可以根据xml配置、注解进行查找
   处理器映射器HandlerMapping向前端控制器返回Handler
   前端控制器调用处理器适配器去执行Handler
   处理器适配器去执行Handler
   Handler执行完成给适配器返回ModelAndView
   处理器适配器向前端控制器返回ModelAndView
   ModelAndView是springmvc框架的一个底层对象，包括 Model和view
   前端控制器请求视图解析器去进行视图解析，根据逻辑视图名解析成真正的视图(jsp)
   视图解析器向前端控制器返回View
   前端控制器进行视图渲染，视图渲染将模型数据(在ModelAndView对象中)填充到request域
   前端控制器向用户响应结果
   ```

5.  Spring Boot中如何做全局异常处理是如何实现的

   ```
   @ControllerAdvice	标注在全局异常处理类上，表示这是一个全局异常处理类
   @ExceptionHandler(xxx.class)	标注在方法上，表示使用该方法处理指定的异常
   ```

6. 常用的值类型和引用类型有哪些，值类型和引用类型有什么区别

   ```
   基本类型：byte、short、int、long、float、double、boolean、char
   引用类型：类、接口类型、数组类型、枚举类型、注释类型
   
   基本类型：它的值就是一个数字，一个字符或一个布尔值。
   
   引用类型：是一个对象类型，值是什么呢？它的值是指向内存空间的引用，就是地址，所指向的内存中保存着变量所表示的一个值或一组值。 
   ```

7. 数组去重你知道哪些方式

   ```
   使用HashSet的不可重复性去重
   使用LinkedHashSet不可重复性和有序性去重
   使用list的contains方法去重
   两重遍历判断去重
   ```

8. `ArrayList`和`LinkedList`之间有什么区别

   ```
   1.是否保证线程安全： ArrayList 和 LinkedList 都是不同步的，也就是不保证线程安全；
   2.底层数据结构： Arraylist 底层使⽤的是 Object 数组； LinkedList 底层使⽤的是 双向链
   表 数据结构（JDK1.6 之前为循环链表，JDK1.7 取消了循环。注意双向链表和双向循环链
   表的区别，下⾯有介绍到！）
   3.插⼊和删除是否受元素位置的影响：ArrayList 采⽤数组存储，所以插⼊和删除元素的
   时间复杂度受元素位置的影响。 ⽐如：执⾏ add(E e) ⽅法的时候， ArrayList 会默认在将指定的元素追加到此列表的末尾，这种情况时间复杂度就是 O(1)。但是如果要在指定位置 i
   插⼊和删除元素的话（ add(int index, E element) ）时间复杂度就为 O(n-i)。因为在进⾏上述操
   作的时候集合中第 i 和第 i 个元素之后的(n-i)个元素都要执⾏向后位/向前移⼀位的操作。
   LinkedList 采⽤链表存储，所以对于 add(E e) ⽅法的插⼊，删除元素时间复杂度不受元素
   位置的影响，近似 O(1)，如果是要在指定位置 i 插⼊和删除元素的话（ (add(int index, E
   element) ） 时间复杂度近似为 o(n)) 因为需要先移动到指定位置再插⼊。
   4.是否⽀持快速随机访问： LinkedList 不⽀持⾼效的随机元素访问，⽽ ArrayList ⽀持。快
   速随机访问就是通过元素的序号快速获取元素对象(对应于 get(int index) ⽅法)。
   5.内存空间占⽤： ArrayList 的空 间浪费主要体现在在 list 列表的结尾会预留⼀定的容量空
   间，⽽ LinkedList 的空间花费则体现在它的每⼀个元素都需要消耗⽐ ArrayList 更多的空间
   （因为要存放直接后继和直接前驱以及数据）。
   ```

9. MyBatis是如何防止SQL注入

   ```
   使用#{}
   通过MyBatis的SQL预编译，其实在框架底层，是JDBC中的PreparedStatement类在起作用，PreparedStatement是Statement的子类，它的对象包含了编译好的SQL语句。这种方式不仅能提高安全性，而且在多次执行同一个SQL时，能够提高效率。原因是SQL已编译好，再次执行时无需再编译。
   ```

10. 微服务的分表分库是做什么，什么情况下需要分库

    ```
    分库分表是把一个库的数据分散到多个库中，把一个表的数据分散到多个表中
    
    当一个数据库被创建之后，随着时间的推移和业务量的增加，数据库中的表以及表中的数据量都会越来越多，就有可能会出现两种弊端：
    （1）数据库的存储资源是有限的，其负载能力也是有限的，数据的大量积累肯定会导致其处理数据的能力下降；
    （2）数据量越多，那么对数据的增删改查等操作的开销也会越来越大，所以，当出现如上两种情况，分库分表势在必行。
    
    分库分表的方式
    垂直切分
    适用场景：如果是因为表的个数多而让数据多，可以按照功能划分，把联系密切的表切分出来放在同一个库中（分库）；
    垂直拆分是指，将一个属性较多，一行数据较大的表，将不同的属性拆分到不同的表中，以降低单库（表）大小，达到提升性能的目的的方法，垂直切分后，各个库（表）的特点是：
    （1）每个库（表）的结构都不一样
    （2）一般来说，每个库（表）的属性至少有一列交集，一般是主键
    （3）所有库（表）的并集是全量数据
    
    水平切分
    适用场景：如果是因为表中的数据量过于庞大，则可以采用水平切分，按照某种约定好的规则将数据切分到不同的数据库中；
    水平切分是指，以某个字段为依据（例如uid），按照一定规则（例如取模），将一个库（表）上的数据拆分到多个库（表）上，以降低单库（表）大小，达到提升性能的目的的方法，水平切分后，各个库（表）的特点是：
    （1）每个库（表）的结构都一样
    （2）每个库（表）的数据都不一样，没有交集
    （3）所有库（表）的并集是全量数据
    
     
    如何联合查找？
    分库分表的结果会使数据分散，不好查询，主要有两种查询方式：
    （1）、分步查：先查找主表，然后得到关联表的id，再发起请求得到关联数据；
    （2）、联合查：同时发起多个查询请求，然后将所有的结果集合起来。
    
    https://blog.csdn.net/a646705816/article/details/109658493
    https://www.cnblogs.com/looyee/articles/13558178.html
    ```

11. 平时的学习方式是什么，学了哪些东西，接触的开源项目有哪些

12. 通过什么方式来解决高并发问题

    ```
    消息中间件：kafka rocketMQ RabbitMq等
    kv中间件：redis （缓存）memcache （缓存） es(可作为搜索引擎)
    一致性：zookeeper(zab)，etcd(raft)
    微服务：dubbo springcloud
    ```

13. xxx项目中你觉得的技术难点在哪个地方？

14. `Redis`中的数据结构，`zset`底层的数据结构

    ```
    zset底层的存储结构包括ziplist或skiplist，在同时满足以下两个条件的时候使用ziplist，其他时候使用skiplist，两个条件如下：
    - 有序集合保存的元素数量小于128个
    - 有序集合保存的所有元素的长度小于64字节
    
    链接：https://www.jianshu.com/p/fb7547369655
    ```

15. SQL中有没有什么优化经验？复杂的语句呢？

    ```
    使用like进行模糊查询时应注意：有的时候会需要进行一些模糊查询比如
    select*from contact where username like ‘%yue%’
    关键词%yue%，由于yue前面用到了“%”，因此该查询必然走全表扫描，除非必要，否则不要在关键词前加%
    ...
    ```

16. MySQL索引如何设置。什么叫联合索引，联合索引需要注意什么，什么情况导致联合索引失效？

    ```
    包含两列或更多列以上的索引，称为联合索引；同时又被称为复合索引。
    
    ALTER TABLE
    ALTER TABLE用来创建普通索引、UNIQUE索引或PRIMARY KEY索引。例如：
    ALTER TABLE table_name ADD INDEX index_name (column_list)
    ALTER TABLE table_name ADD UNIQUE (column_list)
    ALTER TABLE table_name ADD PRIMARY KEY (column_list)
      其中table_name是要增加索引的表名，column_list指出对哪些列进行索引，多列时各列之间用逗号分隔。索引名index_name可选，缺省时，MySQL将根据第一个索引列赋一个名称。另外，ALTER TABLE允许在单个语句中更改多个表，因此可以在同时创建多个索引。
    
    CREATE INDEX
    CREATE INDEX可对表增加普通索引或UNIQUE索引。例如：
    CREATE INDEX index_name ON table_name (column_list)
    CREATE UNIQUE INDEX index_name ON table_name (column_list)
    table_name、index_name和column_list具有与ALTER TABLE语句中相同的含义，索引名不可选。另外，不能用CREATE INDEX语句创建PRIMARY KEY索引。
    
    
    索引失效的情况：
    1. 索引不会包含有NULL值的列，只要列中包含有NULL值都将不会被包含在索引中，复合索引中只要有一列含有NULL值，那么这一列对于此复合索引就是无效的。所以我们在数据库设计时不要让字段的默认值为NULL。
    2. 排序的索引问题，mysql查询只使用一个索引，因此如果where子句中已经使用了索引的话，那么order by中的列是不会使用索引的。因此数据库默认排序可以符合要求的情况下不要使用排序操作；尽量不要包含多个列的排序，如果需要最好给这些列创建复合索引。
    3. 以通配符开头的like语句操作。一般情况下不鼓励使用like操作，如果非使用不可，如何使用也是一个问题。like "%aaa%" 不会使用索引，而like "aaa%"可以使用索引。
    4. 不使用NOT IN操作，NOT IN操作不会使用索引将进行全表扫描。NOT IN可以用NOT EXISTS代替
    5. 不在索引列上做任何操作（计算、函数、（自动or手动）类型转换），会导致索引失效而转向全表扫描
    6. mysql在使用不等于（!=或者<>）的时无法使用索引会导致全表扫描
    7. 字符串不加单引号会导致索引失效
    ```

17. 前端掌握些什么?

    

    