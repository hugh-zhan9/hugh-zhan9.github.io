---
title: MySQL
tags: MySQL
categories: 后端
date: 2020-08-4 14:30:29

---

-MySQL

<!--more-->

> 整合修改自：
>
> 作者：静默虚空 
>
> 原文：https://juejin.im/post/5c7e524af265da2d914db18f

# SQL 语法要点

- **SQL 语句不区分大小写**，但是数据库表名、列名和值是否区分，依赖于具体的DBMS以及配置。

例如：`select` 与 `select` 、`select` 是相同的。

- **多条 SQL 语句必须以分号（`;`）分隔**。
- 处理 SQL 语句时，**所有空格都被忽略**。SQL 语句可以写成一行，也可以分写为多行。

```sql
-- 一行 SQL 语句
update user set username='robot', password='robot' where username = 'root';

-- 多行 SQL 语句
update user
set username='robot', password='robot'
where username = 'root';
```

- SQL 支持三种注释

```mysql
## 注释1
-- 注释2
/* 注释3 */
```

# SQL 分类

## 数据定义语言（DDL）

数据定义语言（Data Definition Language，DDL）是SQL语言集中负责数据结构定义与数据库对象定义的语言。

DDL的主要功能是**定义数据库对象**。

DDL的核心指令是 create、`alter`、`drop`。

## 数据操纵语言（DML）

数据操纵语言（Data Manipulation Language, DML）是用于数据库操作，对数据库其中的对象和数据运行访问工作的编程语句。

DML 的主要功能是 **访问数据**，因此其语法都是以**读写数据库**为主。

DML 的核心指令是 `insert`、`update`、`delete`、`select`。这四个指令合称**CRUD**(create, Retrieve, update, Delete)，即增删改查。

## 事务控制语言（TCL）

事务控制语言 (Transaction Control Language, TCL) 用于**管理数据库中的事务**。这些用于管理由 DML 语句所做的更改。它还允许将语句分组为逻辑事务。

TCL 的核心指令是 `commit`、`rollback`。

## 数据控制语言（DCL）

数据控制语言 (Data Control Language, DCL) 是一种可对数据访问权进行控制的指令，它可以控制特定用户账户对数据表、查看表、预存程序、用户自定义函数等数据库对象的控制权。

DCL 的核心指令是 `grant`、`revoke`。

DCL 以**控制用户的访问权限**为主，因此其指令作法并不复杂，可利用 DCL 控制的权限有：`connect`、`select`、`insert`、`update`、`delete`、`execute`、`usage`、`references`。

根据不同的 DBMS 以及不同的安全性实体，其支持的权限控制也有所不同。

# DML：增删改

> 增删改查，又称为CRUD，数据库基本操作中的基本操作。

## 插入数据

`insert into` 语句用于向表中插入新记录。

插入完整的行

```sql
insert into user
values (10,'root','root','xxxxx@163.com');
```

插入行的一部分

```sql
insert into user(username, password, email)
values ('admin', 'admin', 'xxxx@163.com');
```

插入查询出来的数据

```sql
insert into user(username) select name from account;
```

## 更新数据

`update`语句用于更新表中的记录。

```mysql
update user set username='robot', password='robot'
where username = 'root';
```

没有给定条件时更新所有语句。



## 删除数据

`delete`语句用于删除表中的记录。

删除表中的指定数据：

```mysql
delete from user where username = 'robot';
```

没有`where`条件时表示删除整个数据（可以回滚）：

```mysql
delete from user;
```

`truncate table`表示截断清空表，也就是删除所有行（不能回滚）。截断表中的数据：

```mysql
truncate table user;
```

# DQL：查询数据

`select`语句用于从数据库中查询数据

`distinct`用于返回唯一不同的值，即去重。它作用于所有列，也就是说所有列的值都相同才算相同。

`limit`限制返回的行数。可以有两个参数，第一个参数为起始行，从0开始；第二个参数为返回的总函数，是MySQL中特有的语法，其他数据库中没有，不通用。

`limit`子句是SQL语句最后执行的环节。

语法机制

```mysql
limit startIndex, length
	startIndex：表示起始位置，从0开始，表示第一行数据
	length：表示取几个
```

------

查询单列

```mysql
select prod_name from products;
```

查询多列

```mysql
select prod_id, prod_name, prod_price
from products;
```

查询所有列

```mysql
select * from products;
```

查询不同的值（去重）

```mysql
select distinct vend_id from products;
```

**distinct 只能出现在所有字段的最前面。表示所有字段联合去重。**

限制查询结果

```mysql
-- 返回前 5 行
select * from mytable limit 5;
select * from mytable limit 0, 5;
-- 返回第 3 ~ 5 行
select * from mytable limit 2, 3;
```

## 子查询

> 子查询是嵌套在较大查询中的 SQL 查询。子查询也称为**内部查询**或**内部选择**，而包含子查询的语句也称为**外部查询**或**外部选择**。

- 子查询可以嵌套在 `select`，`insert`，`update` 或 `delect` 语句内或另一个子查询中。
- 子查询通常会在另一个 `select` 语句的 `where` 子句中添加。
- 可以使用比较运算符，如 `>`，`<`，或 `=`。比较运算符也可以是多行运算符，如 `in`，`any` 或 `all`。
- 子查询必须被圆括号 `()` 括起来。
- 内部查询首先在其父查询之前执行，以便可以将内部查询的结果传递给外部查询。执行过程可以参考下图：

·

- 子查询都可以出现在哪里：


```mysql
select 
	..(select).
from 
	..(select).
where
	..(select).
```

### where 子句中使用子查询

找出高于平均薪资的员工信息

```mysql
select * from emp where sal > (select avg(sal) from emp);
```

### from 子句中使用子查询

找出每个部门平均薪资等级

第一步，先找出每个部门平均薪资（按部门编号分组，求sal的平均值）

```mysql
select deptno, avg(sal) as avgsal from emp group by deptno;
```

第二步，将第一步的结果当作一个新表和salgrade进行连接

```mysql
select t.*, s.grade 
from (select deptno, avg(sal) as avgsal from emp group by deptno;) t
join salgrade s 
on t.avgsal between s.losal and hisal;
```

找出每个部门平均的薪资等级

先找出每个员工的薪资等级

```mysql
select e.ename, e.sal, e.deptno, s.garde from emp e
join salgarde s 
on e.sal between s.losal and s.hisal;  
```

再做按照部门分组做平均

```mysql
select t.* 
from (select e.ename, e.sal, e.deptno, s.garde from emp e
join salgarde s 
on e.sal between s.losal and s.hisal;) t 
where group by t.deptno;
```

没这个必要，可以直接进行分组，因为from子句已经执行完成。

```mysql
select e.ename, e.sal, e.deptno, s.garde, avg(s,grade) from emp e
join salgarde s 
on e.sal between s.losal and s.hisal
where group by e.deptno;
```

### select 子句中使用子查询

找出每个员工所在的部门名称。要求显示员工名和部门名。

```mysql
select e.ename, 
(select d.dname from dept d where e.deptno = d.deptno) as dname
from emp e;
```

### 子查询的子查询

```sql
select cust_name, cust_contact
from customers
where cust_id in (select cust_id
                  from orders
                  where order_num in (select order_num
                                      from orderitems
                                      where prod_id = 'RGAN01'));
```

## 条件查询

### where

- `where` 子句用于过滤记录，即缩小访问数据的范围。
- `where` 后跟一个返回 `true` 或 `false` 的条件。
- `where` 可以与 `select`，`update` 和 `DELETE` 一起使用。
- 可以在 `where` 子句中使用的操作符

| 运算符  | 描述                       |
| ------- | -------------------------- |
| =       | 等于                       |
| <>      | 不等于                     |
| >       | 大于                       |
| <       | 小于                       |
| >=      | 大于等于                   |
| <=      | 小于等于                   |
| BETWEEN | 在某个范围内               |
| LIKE    | 搜索某种模式               |
| IN      | 指定针对某个列的多个可能值 |

select 语句中的 where 子句

```sql
select * from Customers
where cust_name = 'Kids Place';
```

update 语句中的 where 子句

```sql
update Customers
set cust_name = 'Jack Jones'
where cust_name = 'Kids Place';
```

delete 语句中的 where 子句

```sql
delete from Customers
where cust_name = 'Kids Place';
```

### in 和 between

- `in` 操作符在 `where` 子句中使用，作用是在指定的几个特定值中任选一个值。还有一个`not in`可以组合使用。
- `between` 操作符在 `where` 子句中使用，作用是选取介于某个范围内的值。

in 示例

```sql
select * 
from products
where vend_id IN ('DLL01', 'BRS01');
```

between 示例

```SQL
select *
from products
where prod_price between 3 and 5;
```

### and、or、not

- `and`、`or`、`not` 是用于对过滤条件的逻辑处理指令。
- `and` 优先级高于 `or`，为了明确处理顺序，可以使用 `()`。注意：
- `and` 操作符表示左右条件都要满足。
- `or` 操作符表示左右条件满足任意一个即可。
- `not` 操作符用于否定一个条件。

and 示例

```sql
select prod_id, prod_name, prod_price
from products
where vend_id = 'DLL01' and prod_price <= 4;
```

or 示例

```sql
select prod_id, prod_name, prod_price
from products
where vend_id = 'DLL01' or vend_id = 'BRS01';
```

not 示例

```sql
select *
from products
where prod_price not between 3 and 5;
```

### like（模糊查询）

- `LIKE` 操作符在 `where` 子句中使用，作用是确定字符串是否匹配模式。
- 只有字段是文本值时才使用 `LIKE`。
- `LIKE` 支持两个通配符匹配选项：`%` 和 `_`。
- **不要滥用通配符，通配符位于开头处匹配会非常慢。**
- `%` 表示任何字符出现任意次数。
- `_` 表示任何字符出现一次。

% 示例

````sql
select prod_id, prod_name, prod_price
from products
where prod_name LIKE '%bean bag%';
````

_ 示例

```sql
select prod_id, prod_name, prod_price
from products
where prod_name LIKE '__ inch teddy bear';
```

找出名字中有下划线的

```sql
select ename form enames where ename like '%\_%';
```

`\`起到转义的作用。

### between and 组合

```sql
select number from emp where name between 3000 and 5000;
```

取**闭区间**`[3000,5000]`，还可以用在字符串的筛选

```SQL
select ename form emp where ename between 'A' and 'C';
```

取**左闭右开区间**

### 判断是否为空（null）

```sql
select number from emp where number is null;
```

## 函数

> 🔔 注意：不同数据库的函数往往各不相同，因此不可移植。本节主要以 Mysql 的函数为例。

### 单行处理函数

**单行处理函数中，只要存在为`null`的数据，那么之后的处理结果都为`null`。**所有数据库都是这样规定的。

#### 空值处理函数

```sql
select ename, ifnull<number,0> form emp;
```

#### 文本处理

|       函数       |          说明          |
| :--------------: | :--------------------: |
| LEFT()、RIGHT()  |   左边或者右边的字符   |
| LOWER()、UPPER() |   转换为小写或者大写   |
| LTRIM()、RTIM()  | 去除左边或者右边的空格 |
|     LENGTH()     |          长度          |
|    SOUNDEX()     |      转换为语音值      |

#### 日期和时间处理

- 日期格式：`YYYY-MM-DD`
- 时间格式：`HH:MM:SS`

|     函 数     |             说 明              |
| :-----------: | :----------------------------: |
|   AddDate()   |    增加一个日期（天、周等）    |
|   AddTime()   |    增加一个时间（时、分等）    |
|   CurDate()   |          返回当前日期          |
|   CurTime()   |          返回当前时间          |
|    Date()     |     返回日期时间的日期部分     |
|  DateDiff()   |        计算两个日期之差        |
|  Date_Add()   |     高度灵活的日期运算函数     |
| Date_Format() |  返回一个格式化的日期或时间串  |
|     Day()     |     返回一个日期的天数部分     |
|  DayOfWeek()  | 对于一个日期，返回对应的星期几 |
|    Hour()     |     返回一个时间的小时部分     |
|   Minute()    |     返回一个时间的分钟部分     |
|    Month()    |     返回一个日期的月份部分     |
|     Now()     |       返回当前日期和时间       |
|   Second()    |      返回一个时间的秒部分      |
|    Time()     |   返回一个日期时间的时间部分   |
|    Year()     |    返回一个日期的年份部分s     |

```sql
mysql> select NOW();
2018-4-14 20:25:11
```

#### 数值处理

|  函数  |  说明  |
| :----: | :----: |
| SIN()  |  正弦  |
| COS()  |  余弦  |
| TAN()  |  正切  |
| ABS()  | 绝对值 |
| SQRT() | 平方根 |
| MOD()  |  余数  |
| EXP()  |  指数  |
|  PI()  | 圆周率 |
| RAND() | 随机数 |

### 分组函数（多行处理函数）

特点：输入多行输出一行

|  函数   |       说明       |
| :-----: | :--------------: |
|  AVG()  | 返回某列的平均值 |
| COUNT() |  返回某列的行数  |
|  MAX()  | 返回某列的最大值 |
|  MIN()  | 返回某列的最小值 |
|  SUM()  |  返回某列值之和  |

**分组函数会自动忽略`null`行。**

**分组函数不能直接出现在`where`子句中。**（找出工资比平均工资高的）

```mysql
select ename from enum where sal > avg(sal);    
--这是错的，会报错ERROR 1111(BY000)：Invalid use of group function
```

为什么？

SQL语句中有一个语法规则，分组函数不可直接使用在`where`字句当中。因为`group by`语句是在`where`执行之后才会执行的。分组函数是在`group by`语句执行之后才会执行的。

所有语句的执行顺序：

```mysql
select     --5
	...
from       --1
	...
where      --2
	...
group by   --4
	...
having     --4
	...
order by   --6
	...
```

解决方法：

````mysql
select ename, sal from emp where sal > (select avg(sal) from emp);
````

这就是子查询。



`count(*)`和`count(sal)`有什么区别

- `count(*)`：不是统计某个字段中数据的个数，而是统计总记录的条数。
- `count(sal)`：是统计`sal`字段中不为`null`的数据总量。

分组函数也可以组合起来用。

```mysql
sum(*), avg(*), max(sal), min(sal);
```

使用`DISTINCT`可以让汇总函数值汇总不同的值。

```sql
select AVG（DISTINCT col1） AS avg_col
from mytable
```

## 排序和分组

### order by

**`order by` 用于对结果集进行排序。**

- `ASC` ：升序（默认）
- `DESC` ：降序
- 可以按多个列进行排序，并且为每个列指定不同的排序方式

**指定多个列的排序方向**

```sql
select * from products
order by prod_price DESC, prod_name ASC;
```

先按照`prod_price`降序排列，当两个`prod_price`相同时，按照`prod_name`升序排列。

### group by

按照某些字段或某个字段进行分组。

- `group by` 为每个组返回一个记录。
- `group by` 通常还涉及聚合：COUNT，MAX，SUM，AVG 等。
- `group by` 可以按一列或多列进行分组。
- `group by` 按分组字段进行排序后，`order by` 可以以汇总字段来进行排序。
- 当一条`sql`语句没有`group by`语句时，整张表自成一组。

**分组**

```sql
select cust_name, COUNT(cust_address) AS addr_num
from Customers group by cust_name;
```

**分组后排序**

```sql
select cust_name, COUNT(cust_address) AS addr_num
from Customers group by cust_name
order by cust_name DESC;
```

查找各个工作岗位的最高薪资：

```sql
select max(sal), job from emp group by job;
```

思考一下：下面这条语句能不能执行。

```sql
select ename max(sal), job from emp group by job;
```

执行报错：

因为`ename`没有参加分组，当一条语句有`group by`的话，`select`后面只能跟参加分组的字段和分组函数，别的东西都不能跟。

查找每个部门不同岗位的最高薪资：

```sql
select max(sal), job, deptmo from emp group by deptno, job;
```

### having

`having` 用于对汇总的 `group by` 结果进行过滤。

- `having` 要求存在一个 `group by` 子句。

- `where` 和 `having` 可以在相同的查询中。

- `HAVING` vs `where`
  - `where` 和 `having` 都是用于过滤。
  - `having` 适用于汇总的组记录；而`where`适用于单个记录。

**使用 where 和 having 过滤数据**

```sql
select cust_name, count(*) as num
from Customers
where cust_email is not NULL
group by cust_name
having count(*) >= 1;
```

找出每个部门的最高薪资，要求显示薪资大于2900的数据。

```mysql
select max(sal), deptno from emp group deptno having max(sal) > 2900;
-- 这种方式效率低
```

建议使用:

```sql
select max(sal), deptno from emp where sal > 2900 group deptno;
```

找出每个部门的平均薪资，要求显示大于2000的数据。

```mysql
select deptno, avg(sal) from emp group by deptno having avg(sal) > 2000;
```

## 连接（join）

>- 连接用于连接多个表，使用 `JOIN` 关键字，并且条件语句使用 `ON` 而不是 `where`。
>- `JOIN` 保持基表（结构和数据）不变。
>- 自然连接是把同名列通过 = 测试连接起来的，同名列可以有多个。
>- 连接 vs 子查询：连接可以替换子查询，并且比子查询的效率一般会更快。

### 连接查询

在实际的开发中，大部分的情况下都不是从单表中查询数据，一般都是多张表联合查询读取最终的结果。在实际开发中，一般一个业务都会对应多张表，如果一张表就可能会造成数据的冗余。

连接查询的分类，根据表的连接方式划分，包括：

内连接

- 等值连接
- 非等值连接
- 自连接

外连接

- 左外连接（左连接）
- 右外连接（右连接）

全连接

------

在表的连接查询方面有一种现象被称为：笛卡尔积（乘积）现象、

```mysql
select ename, dname from emp, dept;
-- 表示ename和dname要联合起来一块显示，粘在一块。
```

如果两张表进行连接查询时没有条件限制的话，查询结果为两者的乘积。

关于表的别名：

```mysql
select e.ename d.dname from emp e,dept d; 
```

别名的优点：执行效率高，可读性好。

怎么避免笛卡尔积现象呢？ ——加条件进行过滤。

思考：避免了笛卡尔积现象会减少记录的匹配次数吗？

​	不会，匹配此时还是不变，只是进行了过滤输出。没有提高执行效率。

#### 内连接（inner join）

假设A和B表进行连接，使用内连接的话，凡是A表和B表能够匹配上的记录查询出来，这就是内连接，AB两张表没有主副之分，两张表是平等的。

```mysql
select vend_name, prod_name, prod_price
from vendors inner join products
on vendors.vend_id = products.vend_id;
```

##### 等值连接

最大的特点是：条件是等量关系

```mysql
select e.ename, d.dname 
from emp e inner join dept d
on e.deptno = d.deptno;
```

语法格式

```mysql
...
	A
inner join
	B
on
	连接条件
where
	....
-- inner可以省略，写出来可读性更好。表示内连接
```

(表的连接条件和后来的过滤条件分开了，结构更清晰)

##### 非等值连接

最大的特点是：连接条件中的关系是非等值关系

```mysql
select e.name, e.sal, s,grade
from emp e inner join salgrade s
on e.sal between s.losal and s.hisal;
```

##### 自连接

最大的特点是：一张表看作两张表，自己连接自己。

```mysql
select c1.cust_id, c1.cust_name, c1.cust_contact
from customers c1 join customers c2
on c1.cust_name = c2.cust_name
and c2.cust_contact = 'Jim Jones';
```

#### 自然连接（natural join）

```mysql
select * from Products natural join Customers;
```

#### 外连接

假设A和B表进行连接，使用外连接的话，AB两张表中有一张是主表，一张表是副表，主要查询主表中的数据，捎带查询副表，当副表中的数据没有和主表中的数据匹配上，副表自动模拟出 null 与之匹配。

最重要的特点就是：主表的数据无条件的查询出来。

##### 左连接（left join）

```sql
select customers.cust_id, orders.order_num
from customers left join orders
on customers.cust_id = orders.cust_id;
```

##### 右连接（right join）

```sql
select customers.cust_id, orders.order_num
from customers right join orders
on customers.cust_id = orders.cust_id;
```

三张表以上的连接

找出每个员工的部门名称和工资等级。

```mysql
select e.ename '员工名', d.dname '部门', s.grade, e1.ename '领导'
from emp e
join dept d
on e.deptno = d.deptno
join salgrade s
on e.sal between s.losal and s.hisal;
```

找出每个员工的部门名称和工资等级以及上级领导。

```mysql
select e.ename '员工名', d.dname '部门', s.grade, e1.ename '领导'
from emp e
join dept d
on e.deptno = d.deptno
join salgrade s
on e.sal between s.losal and s.hisal
left join emp e1
on e.mgr = e1.empno;
```

## 组合（union）

`union` 运算符将两个或更多查询的结果组合在一块，并生成一个结果集，其中包含来自 `union` 中参与查询的提取行。

`union` 基本规则：

- 所有查询的列数和列顺序必须相同。
- 每个查询中涉及表的列的数据类型必须相同或兼容。
- 通常返回的列名取自第一个查询。
- 默认会去除相同行，如果需要保留相同行，使用 `union all`。
- 只能包含一个 `order by` 子句，并且必须位于语句的最后。

应用场景：

- 在一个查询中从不同的表返回结构数据。
- 对一个表执行多个查询，按一个查询返回数据。

组合查询

```sql
select cust_name, cust_contact, cust_email
from customers
where cust_state in ('IL', 'IN', 'MI')
union
select cust_name, cust_contact, cust_email
from customers
where cust_name = 'Fun4All';
```

join vs union

- `join` 中连接表的列可能不同，但在 `union` 中，所有查询的列数和列顺序必须相同。
- `union` 将查询之后的行放在一起（垂直放置），但 `join` 将查询之后的列放在一起（水平放置），即它构成一个笛卡尔积。

# DDL：数据定义

> DDL的主要功能是定义数据库对象（如：数据库、数据包、视图、索引等）。

## 数据库（database）

### 创建数据库

```mysql
create database test;
```

### 删除数据库

```mysql
drop database test;
```

### 选择数据库

```mysql
use test;
```

## 数据表（table）

### MySQL 中字段的数据类型

- `int` 整形
- `bigint`   长整型（Java中的`long`）
- `float`    浮点型 （Java中的`float、double`）
- `decimal`    记录小数，不存在精度损失。
- `char`    定长字符串（`String`）
- `varchar`   可变长字符串（`StringBuffer / StringBuilder`）
- `date`   日期类型（对应Java中的`java.sql.Date`类型）
- `blob`  二进制大对象 （存储图片、视频等流媒体信息，对应Java中`object`。）
- `clob`   字符大对象（存储较大文本，比如存储4G的字符串，对应Java中的`object`。）

**char 和 varchar如何选择**

当某个字段中的数据长度从头到尾一直不变就用`char`，其余情况用`varchar`。

> `blob`和`clob`只能使用IO流写入，而其余的数据类型都可以使用 insert 插入

### 创建数据表

表名在数据库中建议使用`t_`或者`tbl_`开头。

普通创建

```mysql
create TABLE user (
  id int(10) unsigned NOT NULL COMMENT 'Id',
  username varchar(64) NOT NULL DEFAULT 'default' COMMENT '用户名',
  password varchar(64) NOT NULL DEFAULT 'default' COMMENT '密码',
  email varchar(64) NOT NULL DEFAULT 'default' COMMENT '邮箱'
) COMMENT='用户表';
```

根据已有的表创建新表（表的复制）

```mysql
create table vip_user as select * from user;
```

### 插入数据

```mysql
insert into t_student (no,name,sex,classno,birth) values (1,'zhangyukun','1','8','1996-12-20');
```

也可以不写字段名直接给数据，但是要和字段名在表中的顺序对齐。

```mysql
insert into t_student(1,'zhangyukun','1','8','1996-12-20');
```

可以一次插入多条语句

```mysql
insert into t_student(1,'zhangyukun','1','8','1996-12-20'),(2,'zhangyu','1','8','1996-12-20'),(3,'zhang','1','8','1996-12-20');
```

将查询结果插入到表中

````mysql
insert into dept1 select * from dept;
````

### 删除数据表

```mysql
drop table vip_user;
```

### 修改数据表

添加列

```mysql
alter table user add age int(3);
```

添加列时可以附加信息：

```mysql
alter table user add age int(3) not null default 20;
```

删除列

 ```sql
alter table user drop column age;
 ```

修改列

```mysql
alter table user modify column age tinyint;
```

添加主键

```mysql
alter table user add primary key(id);
```

删除主键

```mysql
alter table user drop primary key;
```

## 约束

>SQL 约束用于规定表中的数据规则。

在创建表的时候，可以给表的字段添加相应的约束，添加约束的目的是为了保证表中数据的合法性、有效性、完整性。如果存在违反约束的数据行为，行为会被约束终止。约束可以在创建表时规定（通过`create TABLE`语句），或者在表创建之后规定（通过`ALTER TABLE`语句）。

### 约束类型

默认约束：`default`，设置该数据的默认值

非空约束：`not null`，约束的字段不能为`null`

唯一性约束：`unique`，约束的字段不能重复

主键约束：`primary key`，约束的字段既不能为`null`，也不能重复（简称PK）。主键值是这一行记录在这张表中的唯一标识，类比身份证号。

外键约束：`foreign key`，子表下某字段引用父表中某字段的值来作为取值的范围（简称FK）。删除数据和表时先子表再父表，创建和插入数据时先父表，再子表。**父表作为外键的字段不一定是主键但必须具有唯一性。**

检查约束：`check`，Oracle数据库有check约束，但是MySQL约束没有，目前MySQL不支持该约束。

------

创建表时使用约束条件：

```mysql
create table Users (
  Id int(10) unsigned not null auto_increment comment '自增Id',
  Username varchar(64) not null unique default 'default' comment '用户名',
  Password varchar(64) not null default 'default' comment '密码',
  Email varchar(64) not null default 'default' comment '邮箱地址',
  Enabled int(4) default null comment '是否有效',
  primary key (Id)   
) ENGINE=InnoDB auto_increment=2 default CHARSET=utf8mb4 comment='用户表';

-- auto_incremet 自增    Oracle中也提供了一种自增，叫sequence（序列）
```

多个字段联合添加约束：

```mysql
create table t_user(
	id int,
    usercode varchar(255),
    username varchar(255),
    unique(usercode,username)
);
```

主键的分类：

1. 根据主键字段的字段数量来分：

   - 单一主键（推荐，常用）

   - 复合主键（多个字段联合起来添加一个主键约束，不建议使用，违背三范式。）

2. 根据主键性质来分：

   - 自然主键（推荐使用）

   - 业务主键（主键值和系统的业务挂钩，不推荐使用）

**主键值最好和业务之没有任何关系，因为一旦以后业务发生改变时，主键值也需要随之改变，但可能导致主键值重复，无法改变。**

创建外界约束

```mysql
drop table if exits t_student;
drop table if exits t_class;

create table t_class(
	cno int,
    cname varchar(255),
    primary key(cno)
);

creat table t_student(
	sno int,
	sname varchar(255),
	classno int,
    primary key (sno)
    foreign key(classno) references t_class(cno)
);
```

外键可以为`null`。

# TCL：事务处理

>- 不能回退`select`语句，回退`select`语句也没意义；也不能回退`create`和`drop`语句。
>- **MySQL 默认是隐式提交**，每执行一条语句就把这条语句当成一个事务然后进行提交。当出现 `start transaction` 语句时，会关闭隐式提交；当 `commit` 或 `rollback` 语句执行后，事务会自动关闭，重新恢复隐式提交。
>- 通过 `set autocommit=0` 可以取消自动提交，直到`set autocommit=1`才会提交；`autocommit`标记是针对每个连接而不是针对服务器的。

## 什么是事务

一个事务是一个完整的业务逻辑单元，不可区分。

​	比如：银行账户转账，需要执行两条update语句

```mysql
update t_act set balance = balance - 1000 where actno = 'act-001';
update t_act set balance = balance + 1000 where actno = 'act-002';
```

以上两条DML语句必须同时成功，或者同时失败，不允许一条成功，一条失败。要保证以上的两条DML语句同时成功或者失败，那么就必须使用数据库的**事务机制**。

**只有DML语句才支持事务，（insert, delete, update），为什么？**

因为只有它们适合数据库表当中的数据有关的，事务的存在是为了保证数据的完整性，安全性。

## 指令

- `start transaction` - 指令用于标记事务的起始点。
 - `savepoint` - 指令用于创建保留点。
 - `rollback to` - 指令用于回滚到指定的保留点；如果没有设置保留点，则回退到 `start transaction` 语句处。
 - `commit` - 提交事务。

## 原理

假设一个事需要执行一条insert，再执行一条update，最后执行一条delete，这个事才算完成。

```
开启事务机制（开始）

执行insert语句 （这个执行成功之后，把这个执行记录到数据库的历史当中，并不会向文件中保存一条数据，不会真正的修改硬盘上的数据。）

执行update语句 （这个执行之后也是记录以下历史操作，不会真正的修改硬盘上的数据）

执行delete语句 （同上，也是记录历史操作）

提交或回滚事务 （commit / rollback）（结束）
```

保存点 `savepoint a1`，回滚`rollback a1`。

## 事务的四大特性 ACID

A：原子性：事务是最小的工作单元，不可再分。

C：一致性：事务必须保证多条DML语句同时成功或者同时失败。

I：隔离性：事务A与事务B之间具有隔离。存在隔离级别，理论上有四级。

D：持久性：持续性说的是最终数据必须持久化到硬盘文件中，事务才算成功的结束。

### 隔离性的分级：

- 第一级别：读未提交（read uncommitted），可以读取到还没提交的事务，存在脏读（dirty read）现象，表示读到了脏的数据。

- 第二级别：读已提交（read committed），对方提交之后的数据才可读取，解决了脏读现象。存在的问题：不可重复读。

- 第三级别：可重复读（repeatable read），解决了不可重复读的问题。存在的问题：读取到的数据是幻象。

- 第四级别：序列化/串行化（serializable），解决了所有问题，但是效率低，需要事务排队。

MySQL默认隔离级别：可重复读。Oracle默认隔离级别：读已提交。

```mysql
-- 设置全局的隔离级别
set global transaction isolation level read uncommitted;
-- 设置全局隔离级别为 read uncommitted

-- 查看全局隔离级别
select @@global.tx_isolation;
```



## 演示

```mysql
-- 开始事务，关闭自动提交机制
start transaction;

-- 插入操作 A
insert into user values (1, 'root1', 'root1', 'xxxx@163.com');

-- 创建保留点 updateA
savepoint updateA;

-- 插入操作 B
insert into user values (2, 'root2', 'root2', 'xxxx@163.com');

-- 回滚到保留点 updateA
rollback to updateA;

-- 提交事务，只有操作 A 生效
commit;
```



# DCL：权限控制

>- `grant`和`revoke`可在几个层次上控制访问权限：
>
>- - 整个服务器，使用`grant all`和`revoke all`；
>  - 整个数据库，使用`on database.*`；
>  - 特定的表，使用`on database.table`；
>  - 特定的列；
>  - 特定的存储过程。
>
>- 新创建的账户没有任何权限。
>
>- 账户用 username@host 的形式定义，username@% 使用的是默认主机名。
>
>- MySQL 的账户信息保存在 mysql 这个数据库中。
>
>  ​	USE mysql;
>
>  ​	select user from user;
>  ​	复制代码

## 创建账户

```mysql
create user myuser identified by 'mypassword';
```

## 修改账户名

```mysql
update user set user='newuser' where user='myuser';
flush privileges;
```

## 删除账户

```mysql
drop user myuser;
```

## 查看权限

```mysql
show grants for myuser;
```

## 授予权限

```mysql
grant select, insert on *.* to myuser;
```

## 删除权限

```sql
remove select, insert on *.* form myuser;
```

## 更改密码

```mysql
set password for myuser = 'mypass';
```

# 索引

>索引相当于一本书的目录，通过目录可以快速查找数据。

在数据库中有两种查找数据方式：1. 全表扫描  2. 通过索引。虽然索引可以通过缩小扫描范围来提高搜索效率。但是不能随便添加索引，因为有维护成本，如果表中数据需要经常修改，就不适合添加索引。因为一旦修改，索引需要重写排序，维护。

## 什么时候添加索引

- 很少DML操作时，添加索引是给某些字段添加索引。
- 数据量庞大时。
- 该字段经常出现在`where`字段中时。

注意：

- 主键和具有`union`的字段会自动添加索引，所以根据主键检索效率较高。
- 更新一个包含索引的表需要比更新一个没有索引的表花费更多的时间，这是由于索引本身也需要更新。因此，理想的做法是仅仅在常常被搜索的列（以及表）上面创建索引。
- 模糊查询时，第一个字母为通配符`%`时，索引会失效。

## 创建索引

```mysql
create index user_id_index on user(id);
```

创建唯一索引

```mysql
create unique index user_id_index on user(id);
```

## 删除索引

```mysql
drop index user_id_index on user;
```

## 索引的分类

单一索引：给单个字段添加索引。

复合索引：给多个字段联合起来添加1个索引。

主键索引：主键上会自动添加索引。

唯一索引：有unique约束的字段会自动添加索引。

## 索引的底层实现原理

BTree

索引会自动排序。

# 视图

>视图是基于 SQL语句的结果集的可视化的表，它是虚拟的表，本身不包含数据，也就不能对其进行索引操作。对视图的操作和对普通表的操作一样。可以对视图进行增删改查，会影响到原表数据。

作用：

- 简化复杂的 SQL操作，比如复杂的联结；
 - 只使用实际表的一部分数据；
 - 通过只给用户访问视图的权限，保证数据的安全性；

创建视图

```mysql
create view top_10_user_view as 
select id, username from user
where id < 10;
-- 只有DQL语句才能以视图的方式创建，可以对视图进行CRUD
```

删除视图

```mysql
drop view top_10_user_view;
```

# 数据库设计三范式

什么是范式：简言之就是，数据库设计对数据的存储性能，还有开发人员对数据的操作都有莫大的关系。所以建立科学的，规范的的数据库是需要满足一些规范的来优化数据数据存储方式。在关系型数据库中这些规范就可以称为范式。范式是关系数据库理论的基础，也是我们在设计数据库结构过程中所要遵循的规则和指导方法。

## 第一范式

> 具有原子性

1. 每一张数据表必须有主键，数据表中的每一列(字段)，必须是不可拆分的最小单元，也就是确保每一列的原子性。
2. 满足第一范式是关系模式规范化的最低要求，否则，将有很多基本操作在这样的关系模式中实现不了。

## 第二范式

> 主键列与非主键列遵循完全依赖关系

满足第一范式之后要求：所有非主键字段完全依赖于主键，不能产生部分依赖。（不存在复合主键）

> 多对多，三张表，关系表两外键。 学生-老师表

## 第三范式

> 非主键列之间没有传递函数依赖关系

满足第二范式之后要求：所有非主键字段全部依赖于主键不能产生传递依赖。

数据不能存在传递关系，即每个属性都跟主键有直接关系而不是间接关系。像：a-->b-->c  属性之间含有这样的关系，是不符合第三范式的。

> 一对多，两张表，多的表加外键。 学生-班级表

注意事项：

1.第二范式与第三范式的本质区别：在于有没有分出两张表。

第二范式是说一张表中包含了多种不同实体的属性，那么必须要分成多张表，第三范式是要求已经分好了多张表的话，一张表中只能有另一张表的ID，而不能有其他任何信息，（其他任何信息，一律用主键在另一张表中查询）。

2.必须先满足第一范式才能满足第二范式，必须同时满足第一第二范式才能满足第三范式。

三大范式只是一般设计数据库的基本理念，可以建立冗余较小、结构合理的数据库。如果有特殊情况，当然要特殊对待，数据库设计最重要的是看需求跟性能，需求>性能>表结构。所以不能一味的去追求范式建立数据库。





# 存储过程

>- 存储过程可以看成是对一系列 SQL 操作的批处理；
>- 使用存储过程的好处：代码封装，保证了一定的安全性；代码复用；由于是预先编译，因此具有很高的性能。
>

 ## 创建存储过程

- 命令行中创建存储过程需要自定义分隔符，因为命令行是以 `;` 为结束符，而存储过程中也包含了分号，因此会错误把这部分分号当成是结束符，造成语法错误。
 - 包含 in、out 和 inout 三种参数。
 - 给变量赋值都需要用 select into 语句。
 - 每次只能给一个变量赋值，不支持集合的操作。

```mysql
drop procedure if exists `proc_adder`;
delimiter ;;
creatr definer=`root`@`localhost` procedure `proc_adder`(in a int, in b int, out sum int)
begin
    declare c int;
    if a is null then set a = 0;
    end if;

    if b is null then set b = 0;
    end if;

    set sum  = a + b;
end
;;
delimiter ;
```

## 使用存储过程

```sql
set @b=5;
call proc_adder(2,@b,@s);
select @s as sum;
```

# 游标

>- 游标（cursor）是一个存储在DBMS服务器上的数据库查询，它不是一条`select`语句，而是被该语句检索出来的结果集。
>
>- 在存储过程中使用游标可以对一个结果集进行移动遍历。
>
>- 游标主要用于交互式应用，其中用户需要对数据集中的任意行进行浏览和修改。
>

使用游标的四个步骤：

1. 声明游标，这个过程没有实际检索出数据；
2. 打开游标；
3. 取出数据；
4. 关闭游标；

```mysql
delimiter $
create  PROCEDURE getTotal()
begin
    declare total int;
    -- 创建接收游标数据的变量
    declare sid int;
    declare sname varchar(10);
    -- 创建总数变量
    declare sage int;
    -- 创建结束标志变量
    declare done int default false;
    -- 创建游标
    declare cur cursor dor select id,name,age from cursor_table where age>30;
    -- 指定游标循环结束时的返回值
    declare continue handler for not found set done = true;
    set total = 0;
    open cur;
    fetch cur into sid, sname, sage;
    while(not done)
    do
        set total = total + 1;
        fetch cur into sid, sname, sage;
    end while;

    close cur;
    select total;
end $
delimiter ;

-- 调用存储过程
call getTotal();
```

# 触发器

> 触发器是一种与表操作有关的数据库对象，当触发器所在表上出现指定事件时，将调用该对象，即表的操作事件触发表上的触发器的执行。

可以使用触发器来进行审计跟踪，把修改记录到另外一张表中。

MySQL不允许在触发器中使用CALL语句 ，也就是不能调用存储过程。

**`begin` 和 `end`**

当触发器的触发条件满足时，将会执行 `begin` 和 `end` 之间的触发器执行动作。

> 🔔 注意：在 MySQL 中，分号 `;` 是语句结束的标识符，遇到分号表示该段语句已经结束，MySQL 可以开始执行了。因此，解释器遇到触发器执行动作中的分号后就开始执行，然后会报错，因为没有找到和`begin`匹配的`end`。
>
> 这时就会用到 `delimiter` 命令（`delimiter`是定界符，分隔符的意思）。它是一条命令，不需要语句结束标识，语法为：`delimiter new_delemiter`。`new_delemiter` 可以设为 1 个或多个长度的符号，默认的是分号 `;`，我们可以把它修改为其他符号，如 `$` - `delimiter $` 。在这之后的语句，以分号结束，解释器不会有什么反应，只有遇到了 `$`，才认为是语句结束。注意，使用完之后，我们还应该记得把它给修改回来。

**`new` 和 `old`**

- MySQL 中定义了 `new` 和 `old` 关键字，用来表示触发器的所在表中，触发了触发器的那一行数据。
- 在 `insert` 型触发器中，`new` 用来表示将要（`before`）或已经（`after`）插入的新数据；
- 在 `update` 型触发器中，`old` 用来表示将要或已经被修改的原数据，`new` 用来表示将要或已经修改为的新数据；
- 在 `delete` 型触发器中，`old` 用来表示将要或已经被删除的原数据；
- 使用方法： `new.columnName` （`columnName`为相应数据表某一列名）

### 创建触发器

> 提示：为了理解触发器的要点，有必要先了解一下创建触发器的指令。

`create trigger` 指令用于创建触发器。

语法：

```mysql
create trigger trigger_name
trigger_time
trigger_event
on table_name
for each row
begin
  trigger_statements
end;
```

说明：

- trigger_name：触发器名
- trigger_time：触发器的触发时机。取值为 `BEFORE` 或 `AFTER`。
- trigger_event：触发器的监听事件。取值为 `insert`、`update` 或 `DELETE`。
- table_name：触发器的监听目标。指定在哪张表上建立触发器。
- for each row：行级监视，MySQL固定写法，其他 DBMS 不同。
- trigger_statements：触发器执行动作。是一条或多条 SQL 语句的列表，列表内的每条语句都必须用分号 `;` 来结尾。

示例：

```mysql
delimiter $
create trigger `trigger_insert_user`
after insert on `user`
for each row
begin
    insert into `user_history`(user_id, operate_type, operate_time)
    values (NEW.id, 'add a user',  now());
end $
delimiter ;
```

### 查看触发器

```mysql
show triggers;
```

### 删除触发器

```mysql
drop trigger if exists trigger_insert_user;
```
