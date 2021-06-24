---
title: 初识MyBatis
tags: MyBatis
categories: Java
date: 2020-09-10 16:29:28



---



![](https://s1.ax1x.com/2020/09/25/09I7nI.png)

<!--more-->

# 概述

## 软件开发常用结构

三层架构包含的三层：

界面层：也叫表示层，视图层。主要功能是接受用户的数据，显示请求的处理结果。使用Web页面和用户交互，手机app也就是表示层的，用户在app中操作，业务逻辑在服务器端处理。`controller`

业务逻辑层：接收界面层传递过来的数据，检查数据，计算业务逻辑，调用数据访问层获取数据。`service`

数据访问层：也叫持久层，与数据库直接打交道，主要实现对数据的增删改查。将存储在数据库中的数据提交给业务层，同时将业务层处理的数据保存到数据库。`dao`

三层之间的交互：

```
用户--->界面层--->业务逻辑层--->数据访问层--->DB数据库
```

三层对应的框架：

界面层----servlet-----springmvc框架

业务逻辑层---service类---spring框架

数据访问层----dao类---MyBatis框架



## 什么叫框架

框架(Framework)是这或部分相同的可重设计，表现为一组抽象构件及构件实例间交互的方法，也可以认为框架是可被开发者定制的应用骨架、模板。

简单的说，框架其实是半成品软件，就是一组组件，供你使用完成你自己的系统，框架是安全的，可复用的，不断升级的软件。 

可以这么理解：

框架是一个模板，规定好了一些条款，内容不需要修改，也可以加入自己的东西。

框架中定义了一些功能，这些功能是可用的，可以加入项目中自己的功能，这些功能可以利用框架中写好的功能。

### 框架的特点

框架一般不是全能的，不能做所有的事情

框架是针对某一个领域有效，特长在某一个方面，比如MyBatis做数据库操作强，但是不能做其他的。

## JDBC编程

JDBC编程的缺点：

代码量比较大，重复，开发效率低。

需要关注Connection，Statement，ResultSet对象创建和销毁

对ResultSet查询的结果需要自己封装为List

业务代码和数据库的操作混在一起 

## MyBatis的概述

MyBatis 是一款优秀的持久层框架，它支持自定义 SQL、存储过程以及高级映射。MyBatis 免除了几乎所有的 JDBC 代码以及设置参数和获取结果集的工作。MyBatis 可以通过简单的 XML 或注解来配置和映射原始类型、接口和 Java POJO（Plain Old Java Objects，普通老式 Java 对象）为数据库中的记录。

mabatis的两个概念：

1. sql mapper：sql映射

   可以把数据库表中的一行数映射为一个Java对象。一行数据可以看作是一个Java对象，操作这个对象就相当于操作表中的数据。

2. Data Access Object(DAOs)：数据库访问，对数据数据进行增删改查

### 功能简介:

减轻使用JDBC的复杂性，不用编写重复的创建和关闭Connetion，Statement；直接使用Java对象，表示结果数据。让开发者专注SQL的处理，其他分析的工作有MyBatis完成。

MyBatis可以完成：

1. 注册数据库的驱动，例如`Class.forName("com.mysql.jdbc.Driver")`
2. 创建JDBC中必须使用的Connection，Statement，ResultSet对象
3. 从XML中获取SQL语句并执行，把ResultSet结果转换为Java对象
4. t提供了关闭资源的能力，不再需要自己来关闭Connection，Statement，ResultSet



# MyBatis的使用

## 使用示例

![](https://s1.ax1x.com/2020/09/09/w3NZ0U.png)

### 实现步骤

1. 新建的students表
2. 加入maven的MyBatis坐标，mysql驱动的坐标
3. 创建实体类，Student---用来保存表中的一行数据
4. 创建持久层的dao接口，定义操作数据库的方法
5. 创建一个MyBatis使用的配置文件叫做sql映射文件。写sql语句的，一般一个表一个sql语句，这个文件就是xml文件，写在接口所在的目录中，文件名称和接口保持一致。
6. 创建MyBatis的主配置文件，一个项目就一个主配置文件。主配置文件提供了数据库的连接信息和sql映射文件的位置信息
7. 创建使用MyBatis类，通过MyBatis访问数据库

### 实现示例

pom.xml文件导入依赖

```xml
<?xml version="1.0" encoding="UTF-8"?>

<project xmlns="http://maven.apache.org/POM/4.0.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
  xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
  <modelVersion>4.0.0</modelVersion>

  <groupId>com.mavenprograming</groupId>
  <artifactId>LearnMyBatisDemo</artifactId>
  <version>1.0-SNAPSHOT</version>

  <name>LearnMyBatisDemo</name>
  <!-- FIXME change it to the project's website -->
  <url>http://www.example.com</url>

  <properties>
    <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
    <maven.compiler.source>1.7</maven.compiler.source>
    <maven.compiler.target>1.7</maven.compiler.target>
  </properties>

  <dependencies>
    <dependency>
      <groupId>junit</groupId>
      <artifactId>junit</artifactId>
      <version>4.11</version>
    </dependency>
      
    <!--MyBatis依赖-->
    <dependency>
      <groupId>org.mybatis</groupId>
      <artifactId>mybatis</artifactId>
      <version>3.5.5</version>
    </dependency>
      
    <!--mysql驱动-->
    <dependency>
      <groupId>mysql</groupId>
      <artifactId>mysql-connector-java</artifactId>
      <version>5.1.49</version>
    </dependency>  
  </dependencies>

  <build>
    <resources>
        <resource>
            <directory>src/main/java</directory>
            <includes>
                <include>**/*.properties</include>
                <include>**/*.xml</include>
            </includes>
            <filtering>false</filtering>
        </resource>
    </resources>
  </build>
</project>
```

创建实体类

```java
public class Student{
    // 变量名称和数据库中的列名一致
    private Integer id;
    private String name;
    private String email;
    private Integer age;
    
    //重写set、get、toString 方法
}
```

创建持久层的dao接口

```java
package com.hugh.dao;

import com.hugh.entity.Student;
import java.util.List;

public interface StudentDao {
    List<Student> selectStudent();
}
```

sql映射文件

````xml
<?xml version="1.0" encoding="UTF-8" ?>
<!--
1.指定MyBatis约束文件：MyBatis-3-mapper.dtd是约束文件的名称，扩展名是dtd
2.约束文件作用：限制，检查在当前文件中出现的标签，属性必须符合MyBatis的要求
-->
<!DOCTYPE mapper
        PUBLIC "-//mybatis.org//DTD Mapper 3.0//EN"
        "http://mybatis.org/dtd/mybatis-3-mapper.dtd">
<!--
mapper：是当前文件的根标签，必须的
namespace：叫做命名空间，是唯一的，可以是自定义的字符串，但最好使用dao接口的全限定名称。
在当前文件中，可以使用特定的标签表示数据库的特定操作
	<select>：select语句
	<update>：update语句
	<delete>：delete语句
	<insert>：insert语句
id：为你要执行的sql语法的唯一标识，MyBatis会使用这个id的值来找到要执行的sql语句，使用接口中方法的名称
resultType:表示sql语句执行之后得到的结果类型，是sql语句执行后得到ResultSet遍历得到的Java对象类型，值为类型的全限定名称
-->
<mapper namespace="com.hugh.dao.StudentDao">
  <select id="selectStudent" resultType="Student">
    select * from students
  </select>
</mapper>
````

创建MyBatis的主配置文件

```xml
<!--
主配置文件创建在src/main/resource目录下，名称为mybatis.xml
-->
<?xml version="1.0" encoding="UTF-8" ?>
<!DOCTYPE configuration
        PUBLIC "-//mybatis.org//DTD Config 3.0//EN"
        "http://mybatis.org/dtd/mybatis-3-config.dtd">
<configuration>
    <!--
		配置mybatis环境
		default必须和某个environment的id值一样，告诉mybatis使用哪个数据库的链接信息，就会访问哪个数据库
	-->
    <environments default="mysql">
        <environment id="mysql">
            <!--配置事务类型，使用JDBC事务类型（使用connection进行事务提交和回滚）-->
            <transactionManager type="JDBC"/>
            <!--
				数据源dataSource:创建数据库Connection对象
				type="POOLED":使用数据库连接池
			-->
            <dataSource type="POOLED">
                <!--连接数据库的四个要素-->
                <property name="driver" value="com.mysql.jdbc.Driver"/>
                <property name="url" value="jdbc:mysql://localhost:3306/hughdatabases"/>
                <property name="username" value="root"/>
                <property name="password" value="19961220"/>
            </dataSource>
        </environment>
    </environments>
    <mappers>
        <!--
			告诉mybatis要执行的sql映射文件位置
			这个路径是相对路径，从类路径开始,target/classes(这个classes就是类路径)
		-->
        <mapper resource="com/hugh/dao/selectStudent.xml"/>
    </mappers>
</configuration>
```

创建MyBatis测试类

```java
package com.hugh;

import com.hugh.entity.Student;
import org.apache.ibatis.io.Resources;
import org.apache.ibatis.session.SqlSession;
import org.apache.ibatis.session.SqlSessionFactory;
import org.apache.ibatis.session.SqlSessionFactoryBuilder;
import org.junit.Test;
import java.io.IOException;
import java.io.InputStream;
import java.util.List;

public class MyBatisTest {
    @Test
    public void testStart() throws IOException{
        /*
        	mybatis主配置文件
        	定义mybatis主配置文件的名称，从类路径开始
        */
        String config = "mybatis.xml";
        // 读取配置文件
        InputStream in = Resources.getResourceAsStream(config);
        // 创建SqlSessionFactory对象，目的是获取SqlSession
        SqlSessionFactory factory = new SqlSessionFactoryBuilder().build(in);
        /* 【重要】
        	获取SqlSession,SqlSession能执行sql语句
        */
        SqlSession session = factory.openSession();
        /* 【重要】
        	执行SqlSession的selectList()
        	指定要执行的sql语句的表示
        	sql映射文件中的namespace + '.' + 标签的id值
        */ 
        List<Student> students = session.selectList("com.hugh.dao.StudentDao.selectStuden");
        // 循环输出查询结果
        students.forEach(student -> System.out.println(student));
        // 关闭SqlSession释放资源
        session.close();
    }
}
```

说明：

```java
List<Student> studentList = session.selectList("com.bjpowernode.dao.StudentDao.selectStudents");
// 这一步近似等价于jdbc代码中的下列代码
Connection conn = 获取连接对象
String sql= "select id,name,email,age from student";
PreparedStatement ps = conn.prepareStatement(sql);
ResultSet rs = ps.executeQuery();
```



### 配置日志功能

在mybatis.xml中设置如下属性

```xml
<settings>
	<setting name="logImpl" value="STDOUT_LOGGING" />
</settings>
```

**注意标签插入的位置**

### 基本的CURD

#### 执行插入操作

修改接口文件和映射文件分别添加插入方法和插入的sql语句。

```xml
<?xml version="1.0" encoding="UTF-8" ?>
<!DOCTYPE mapper
  PUBLIC "-//MyBatis.org//DTD Mapper 3.0//EN"
  "http://MyBatis.org/dtd/MyBatis-3-mapper.dtd">
<mapper namespace="com.hugh.dao.StudentDao">
  <select id="selectStudent" resultType="Student">
    select * from students
  </select>
  <insert>
      insert into students (id,name,email,age) values (#{id},#{name},#{email},#{age})
  </insert>
</mapper>
```

执行时只需要更改测试类的调用和返回值类型。

#### 执行更新操作

```xml
<update id="updateStudent">
	update student set age = #{age} where id=#{id}
</update>
```

#### 执行删除操作

```xml
<delete id="deleteStudent">
	delete from student where id=#{studentId}
</delete>
```

## mybatis内部对象分析

### 四个对象

1. Resources类

   Resources类，用于读取mybatis主配置文件。有多个重载方法对资源的读取和解析，返回不同类型的IO流对象。

2. SqlSessionBuilder类

   SqlSessionBuilder的主要作用是通过其`build()`方法来创建SqlSessionFactory对象。 由于SqlSessionFactoryBuilder 对象在创建完工厂对象后，就完成了其历史使命，即可被销毁。所以，一般会将该SqlSessionFactoryBuilder对象创建为一个方法内的局部对象，方法结束，对象销毁。

3. SqlSessionFactory接口

   SqlSessionFactory对象主要的作用是创建SqlSession对象，它是线程安全的重量级对象，所以一个应用只需要一个该对象即可。创建SqlSession需要使用其`openSession()`方法。

   - openSession()：创建一个非自动提交的SqlSession。
   - openSession(true)：创建一个自动提交的SqlSession。

4. SqlSession接口

   SqlSession接口用于执行持久化操作，一个SqlSession对应着一次数据库会话，一次会话以SqlSession对象的创建开始，以SqlSession对象的关闭结束。 SqlSession接口对象是线程不安全的，所以每次数据库会话结束前，需要马上调用其close()方法，将其关闭。再次需要会话，再次创建。 SqlSession在方法内部创建，使用完毕后关闭。

### 创建工具类

可以看到测试类中有大量的重复代码：

```java
String config = "mybatis.xml";
InputStream inputStream = Resources.getResourceAsStream(config);
SqlSessionFactoryBuilder factoryBuilder = new SqlSessionFactoryBuilder();
SqlSessionFactory factory = factoryBuilder.build(inputStream);
SqlSession session = factory.openSession();
```

这些代码每一个测试、实现类都需要使用，可以把他们封装到一个工具类中，就像JDBC中使用的工具类一样。

工具类代码：

```java
package com.hugh.util;

import org.apache.ibatis.io.Resources;
import org.apache.ibatis.session.SqlSession;
import org.apache.ibatis.session.SqlSessionFactory;
import org.apache.ibatis.session.SqlSessionFactoryBuilder;

import java.io.IOException;
import java.io.InputStream;

public class MybatisUtil {
    private static SqlSessionFactory sqlSessionFactory = null;
    static {
        try {
            String config = "mybatis.xml";
            InputStream inputStream = Resources.getResourceAsStream(config);
            sqlSessionFactory = new SqlSessionFactoryBuilder().build(inputStream);
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
    public SqlSession getSqlSession(){
        SqlSession sqlSession = sqlSessionFactory.openSession();
        return sqlSession;
    }
}
```

## 使用Dao对象

我们在设计目录结构的时候，创建了dao包，在其中创建了接口，但是却重来没有使用过。如何使用dao接口来实现mybatis的使用呢？

### 创建Dao接口的实现类

```java
package com.hugh.dao.impl;

import com.hugh.dao.StudentDao;
import com.hugh.entity.Province;
import com.hugh.util.MybatisUtil;
import org.apache.ibatis.session.SqlSession;

import java.util.List;

public class selectStudentImpl implements StudentDao {
    @Override
    public List<Province> selectStudent() {
        SqlSession sqlSession = MybatisUtil.getSqlSession();
        List<Province> provinces = sqlSession.selectList("com.hugh.dao.StudentDao.selectStudent");
        sqlSession.close();
        return provinces;
    }

    @Override
    public int insetStudent(Province province) {
        SqlSession sqlSession = MybatisUtil.getSqlSession();
        int row = sqlSession.insert("com.hugh.dao.StudentDao.selectStudent",province);
        sqlSession.commit();
        sqlSession.close();
        return row;
    }
}
```

测试类调用测试

```java
package com.hugh;

import com.hugh.dao.impl.SelectStudentImpl;
import com.hugh.entity.Province;
import org.junit.Test;

import java.util.List;

public class batisTest {
    @Test
    public void selectTest(){
        List<Province> provinces = new SelectStudentImpl().selectStudent();
        for(Province province : provinces){
            System.out.println(province.getName());
        }
    }

    @Test
    public void insertTest(){
        Province province = new Province();
        province.setId(1);
        province.setName("湖南");
        province.setJiancheng("湘");
        province.setShenghui("长沙");
        int count = new SelectStudentImpl().insetStudent(province);
        System.out.println("插入了"+ count +"行");
    }
}
```

### 分析

在自定义Dao接口实现类时发现一个问题：Dao的实现类其实并没有干什么实质性的工作，它仅仅就是通过SqlSession的相关 API 定位到映射文件mapper中相应 id 的 SQL 语句，真正对 DB 进行操作的工作其实是由框架通过 mapper 中的 SQL 完成的。

所以，在实际开发中MyBatis 框架抛开了 Dao 的实现类，直接定位到映射文件 mapper 中的相应 SQL 语句，对DB 进行操作。这种对 Dao 的实现方式称为**Mapper 的动态代理方式。**

**Mapper动态代理方式无需程序员实现Dao接口。接口是由MyBatis结合映射文件自动生成的动态代理实现的。**

# MyBatis框架的动态代理

## Dao实现CURD

1. 不需要Dao的是实现类，MyBatis会自动创建对应的实现类。

2. 使用`getMapper()`方法获取代理对象

   只需调用`SqlSession`的`getMapper()`方法，即可获取指定接口的实现类对象。该方法的参数为指定Dao接口类的 class 值。

   示例：

   ```java
   SqlSession session = factory.openSession();
   Province province = session.getMapper(ProvinceDao.class);
   ```

   使用工具类改进：

   ```java
   Province province = MyBatisUtil.getSqlSession().getMapper(ProvinceDao.class);
   ```

3. 使用代理对象执行SQL语句

   测试类示例：

   ```java
   package com.hugh;
   
   import com.hugh.dao.ProvinceDao;
   import com.hugh.entity.Province;
   import com.hugh.util.MybatisUtil;
   import org.junit.Test;
   
   import java.io.IOException;
   import java.util.List;
   
   public class MybatisTest {
       @Test
       public void testSelect() throws IOException{
           ProvinceDao provinceDao = MybatisUtil.getSqlSession().getMapper(ProvinceDao.class);
           List<Province> provinces = provinceDao.selectProvince();
           for(Province pro : provinces){
               System.out.println("ID："+pro.getId()+"   省份名称："+pro.getName());
           }
       }
       @Test
       public void testInsert(){
           Province province = new Province();
           province.setId(1);
           province.setName("湖南");
           province.setJiancheng("湘");
           province.setShenghui("长沙");
           ProvinceDao provinceDao = MybatisUtil.getSqlSession().getMapper(ProvinceDao.class);
           int count = provinceDao.insetProvince(province);
           System.out.println("插入了"+count+"行");
       }
   }
   ```

   

## 原理

动态代理

## 深入理解参数

### parameterType

mapper文件中的一个属性，表示dao接口中方法参数的数据类型。值为对应类型的全限定名称或者mybatis设置的别名。

```xml
<select id="selectProvince" parameterType="java.lang.Integer" resultType="Province">
    select * from province where id = #{id}
</select>
```

因为mybatis通过反射机制可以推断出具体传入语句的参数的实际类型，所以这个属性可省略。

```xml
<select id="selectProvince" resultType="Province">
    select * from province where id = #{id}
</select>
```

### MyBatis传递参数

#### 一个简单类型参数

简单类型参数：mybatis把Java基本类型和String类型称为简单类型

在mapper文件中，使用`#{任意字符串}`可以表示要传入的简单类型参数，程序运行时会传入参数。

```java
// 接口中的定义：
List<Province> selectProvince(int id);
// mappper文件中的定义
<select id="selectProvince" resultType="Province">
    select * from province where id = #{id}
</select>
```

#### 多个参数

##### 使用@Param("自定义参数名")传递参数

当接口中有多个参数时，可以设置`@Param{"自定义参数名"}`来给变量命名，在mapper文件中可以使用`#{"自定义参数名"}`来获取参数。

```java
// 接口中的定义：
List<Province> selectProvince(@Param("personid")int id, @Param("personname")String name);
// mappper文件中的定义
<select id="selectProvince" resultType="Province">
    select * from province where id = #{personid} and name = #{personname}
</select>
```

##### 使用Java对象传递参数

使用Java对象进行参数的传递，Java对象的属性值即参数值，每一个属性就是一个参数。

基本语法为：`#{属性名,javaType=java类型名称,jdbcType=数据库类型名称}`

实际开发中一般使用简化的方式：`#{属性名}`，`javaType`和`jdbcType`的值反射能获取，可以不提供。

这种方式需要先定义一个参数类，通过参数的属性值来传递参数，可以使用已经存在的参数类

```java
// 参数类
public class queryParam{
    private .....
}
```

mapper.xml文件设置：

```java
<select id="selectProvince" resultType="Province">
    select * from province where id = #{personid} and name = #{personname}
</select>
```

测试类代码：

```java
// 测试类
public void testSelectMulitiObject(){
    SqlSession sqlSession = MyBatisUtil.getSqlSession();
    Student dao = sqlSession.getMapper(Student.class);
    QueryParam queryParam = new QueryParam();
    queryParam.setParamNam("张三");
    queryParam.setAge(28);
    List<Student> students = dao.selectMultiObject();
}
```

##### 按参数的位置获取参数

接口方法：`List selectByNameAndAge(String name,int age);`

mapper文件

```xml
<select id="selectByNameAndAge" resultType="Student">
    select * from province where name = #{arg0} and age = #{arg1}
</select>
```

##### 使用Map传递参数

Map 集合可以存储多个值，使用Map向 mapper 文件一次传入多个参数。Map 集合使用 String的 key， Object 类型的值存储参数。 mapper 文件使用 # { key } 引用参数值。

接口方法：

```java
List<Student> selectMultiMap(Map<String,Object> map);
```

测试方法

```java
Map<String,Object> data = new HashMap<String,Object>();
data.put(“myname”,”李力”);
data.put(“myage”,20);
```

mapper文件：

```xml
<select id="selectMultiMap" resultType="Student">
    select * from province where name = #{myname} and age = #{myage}
</select>
```



#### 占位符#和字符串拼接符$

使用在SQL语句中的符号

1. `#{}`：表示占位符，代替sql 语句的`?`，使用PreparedStatement执行SQL语句，可以有效防止SQL注入，执行效率高。使用`#{}`设置参数。无需考虑参数的类型。 
2. `${}`：表示拼接符，告诉mybatis使用`${}`包含的“字符串”替换所在位置。使用 Statement 把SQL语句和`${}`的内容连接起来。主要用在替换表名，列名，不同列排序等操作。无法防止SQL注入，使用`${}`设置参数必须考虑参数的类型。 
3. 传递简单类型参数
   - 如果获取简单类型参数，`#{}`中可以使用value或其他名称
   - 如果获取简单类型参数，`${}`中只能使用value。例如：`select * from t_student where id='${value}'`

4. 在没有特殊要求的情况下，通常使用`#{}`占位符
5. 有些情况必须使用`${}`，比如需要动态拼接表名，`select * from ${tablename}`，比如动态拼接排序字段：`select * from tablename order by ${username} desc`

   

   

## 封装输出结果

### resultType标签

mapper.xml文件中`<select>`标签的属性，表示sql语句执行后返回值的数据类型。`resultType`属性的值为该类型的全限定名称或别名。

```xml
<select id="selectProvince" resultType="Province">
	select * from province
</select>
```

执行的操作对等JDBC中的

```java
ResultSet rs = ps.excuteQuery();
while(rs.next()){
    Province province = new Province();
    province.setId(rs.getInt("id"));
    province.setName(rs.getName("name"));
    ...
}
```

即：mybatis执行SQL语句，然后调用对象类的无参构造方法创建对象，将数据库中列值传递给对象**同名**的对应属性。

>注：SQL执行结果返回`List<xx>`时，`resultType`为`List<xx>`中泛型指定的类型。

#### 返回值类型

- 简单类型

  ```java
  // 接口方法：
  int countStudent();
  // mapper 文件：
  <select id="countStudent" resultType="int"> // <select id="countStudent" resultType="com.lang.Integer">
  	select count(*) from student
  </select>
  // 测试方法：
  @Test
  public void testRetunInt(){
      int count = studentDao.countStudent();
      System.out.println("学生总人数："+ count);
  }
  ```

- 对象类型

  可以在MyBatis的主配置文件中设置对象类型的别名：

  ```xml
  <typeAliases>
      <!--第一种方式-->
  	<typeAlias type="com.hugh.entity.Province" alias="Province"></typeAlias>
      ...
      <!--
  		第二种方式
  		name的值是包名，这个包中的所有类，类名就是别名（类名不区分大小写）
  	-->
      <package name="com.hugh.entity"></package>
      ...
  </typeAliases>
  ```

  mapper文件：

  ```xml
  <select id="countProvince" resultType="Province">
  	select count(*) from province
  </select>
  ```

  

- map

  **注意：Map 作为接口返回值，SQL语句的查询结果最多只能有一条记录。大于一条记录是错误。**

  ```java
  // 接口方法：
  Map<Object,Object> selectReturnMap(int id);
  // mapper 文件：
  <select id="selectReturnMap" resultType="java.util.HashMap">
  	select name,email from student where id = #{studentId}
  </select>
  // 测试方法：
  @Test
  public void testReturnMap(){
      Map<Object,Object> retMap = studentDao.selectReturnMap(1002);
      System.out.println("查询结果是 Map:"+retMap);
  }
  ```

  返回的值：列名为key，列值为value。

### resultMap标签

resultMap称为结果映射，可以自定义SQL的列名和Java对象属性的映射关系。更灵活的把列值赋值给指定属性。常用在列名和Java对象属性名不一样的情况。

```xml
// 接口方法
List<Province> selectAllProvince();
// Mapper文件
<!--
    定义resultMap
    id：自定义名称
    type：Java类的全限定名称
-->
<resultMap id="ProvinceMap" type="com.hugh.entity.Province">
    <!--
    	colum表示列名，property表示属性名
    	主键列使用id标签
		非主键列使用result标签
    -->
    <id colum="id" property="id">
    <result colum="name" property="name">
    ...
</resuleMap>
<select id="selectAllProvince" resultMap="ProvinceMap">
    select * form province
</select>
    
// 测试方法
@Test
public void testSelectAllProvince(){
	SqlSession sqlSession = MyBatisUtil.getSqlSession();
    Student dao = sqlSession.getMapper(Province.class);
    List<Province> provinces = dao.selectAllProvince();
    for (Province province : provinces){
        System.out.println("省份"+province);
    }
}
```

### 实体类属性名和列名不同的处理方式

1. resultMap标签

2. 使用列的别名

   ```java
   // 创建新的实体类 PrimaryStudent
   public class PrimaryStudent {
   	private Integer stuId;
   	private String stuName;
   	private Integer stuAge;
   	// set , get 方法
       ...
   }
   
   // 接口方法
   List<PrimaryStudent> selectUseFieldAlias(QueryParam param);
   
   // mapper 文件：
   <select id="selectUseFieldAlias" resultType="com.bjpowernode.domain.PrimaryStudent">
   	select id as stuId, name as stuName,age as stuAge from student where name=#{queryName} or age=#{queryAge}
   </select> 
   
   // 测试方法
   @Test
   public void testSelectUseFieldAlias(){
    QueryParam param = new QueryParam();
    param.setQueryName("李力");
    param.setQueryAge(20);
    List<PrimaryStudent> stuList;
    stuList = studentDao.selectUseFieldAlias(param);
    stuList.forEach( stu -> System.out.println(stu));
   }
   ```

### 模糊查询

案例：查询省份名称带"江"的信息

1. `${}`实现like模糊查询---------------?

   ```java
   // 接口方法
   List<Province> select1(String partName);
   // mapper文件
   <select id="select1" resultType="com.hugh.entity.Province">
       select * from province where name like '%${value}%'
   </select>
   // 测试方法
   public class Test1 {
       public static void main(String[] args) {
           ProvinceDao provinceDao = MyBatisUtil.getSqlSession().getMapper(ProvinceDao.class);
           
           List<Province> provinceList = provinceDao.select1("江");
           for(Province p:provinceList){
               System.out.println(p);
           }
   	}
   }
   ```

   

2. `#{}`实现like模糊查询

   - 以`"%参数%"`的形式传给SQL语句

     ```java
     // 接口方法
     Lsit<Province> select2(String partName);
     // mapper文件
     <select id="select3" resultType="com.hugh.entity.Province">
         select * from province where name like #{name}
     </select>
     // 测试方法
     public class Test2 {
         public static void main(String[] args) {
             ProvinceDao provinceDao = MyBatisUtil.getSqlSession().getMapper(ProvinceDao.class);
           
             List<Province> provinceList = provinceDao.select2("%江%");
             for(Province p:provinceList){
                 System.out.println(p);
             }
         }
     }
     ```

     

   - SQL语句中设置%

     ```java
     // 接口方法
     List<Province> select(String partName);
     // mapper文件
     <select id="select3" resultType="com.hugh.entity.Province">
         select * from province where name like '%' #{name} '%'
     </select>
     // 测试方法
     public class Test3 {
         public static void main(String[] args) {
             ProvinceDao provinceDao = MyBatisUtil.getSqlSession().getMapper(ProvinceDao.class);
             /*
             select * from province where name like '%' #{name} '%';  MySQL中空格相当于+号(拼接)
              */
             List<Province> provinceList = provinceDao.select3("江");
             for(Province p:provinceList){
                 System.out.println(p);
             }
         }
     }
     ```

# 输入映射和输出映射

MyBatis中输入映射和输出映射可以是基本数据类型、HashMap或者pojo的包装类型，这里主要说以下pojo包装类型的使用，因为这在开发中比较常用。

## 输入映射

输入映射是在映射文件中通过`parameterType`指定输入参数的类型，类型可以时简单类型、HashMap或者pojo的包装类型。假设现在有个比较复杂的查询需求：完成用户信息的综合查询，需要传入查询条件很复杂（可能包括用户信息，其他信息，比如商品、订单的）那么我们传入一个User就不行了，所以首先我们得根据查询条件自定义一个新的pojo，在这个pojo中包含所有的查询条件。

### 定义包装类型pojo

定义一个`UserQueryVo`类，将要查询的条件包装进去。这里为了简单起见，就不添加其他的查询条件了，`UserQueryVo`中就包含一个User，假设复杂的查询条件在User中都已经包含了。

```java
public class UserQueryVo{
    // 在这里添加所需要的查询条件
    // 用户查询条件，这里假设一个User就已经够了
    private User user;
    
    public User getUser(){
        return user;
    }
    
    public void setUser(User user){
        this.user = user;
    }
    // 可以包装其它的查询条件，比如订单、商品等
}
```

### 配置UserMapper.xml映射文件

定义好pojo后，需要在`UserMapper.xml`映射文件中配置查询的`statement`。

```xml
<select id="findUserList" parameterType="mybatis.po.UserQueryVo" resultType="mybatis.po.User">
    select * from user where user.sex = #{user.sex} and user.username like '%${user.username}%'
</select>
```

可以看到输入的`parameterType`的值是自己定义的pojo，输出的是`User`，当然这里的`User`也可以换成另一个用户自定义的pojo，包含用户所需要的条件，不仅仅局限为`User`。然后查询条件使用OGNL表达式，取出`UserQueryVo`中`User`的相应属性即可。然后在主配置文件中配置这个映射文件。

### 定义Mapper接口

```java
public interface UserMapper{
    // 省去无关代码
    // 用户信息综合查询
    public List<User> findUserList(UserQueryVo userQueryVo) throws Exception;
}
```

到此为止，pojo的输入映射已经完成了，下面编写测试类测试以下程序是否正确。

```java
@Test
public void testFindUserList() throws Exception{
    SqlSession sqlSession = new MyBatisUtilo().getSqlSession();
    // 创建UserMapper对象，MyBatis自动生成mapper代理对象
    UserMapper userMapper = sqlSession.getMapper(UserMapper.class);
    
    // 创建包装对象，设置查询条件
    UserQueryVo userQueryVo = new UserQueryVo();
    User user = new User();
    user.setSex("man");
    user.setUsername("hugh");
    userQueryVo.setUser(user);
    
    // 调用UserMapper方法
    List<User> list = userMapper.findUserList(userQueryVo);
    System.out.println(list);
}
```



## 输出映射

输出映射和输入映射一样，同样有很多种对象类型，这里也着重总结以下输出pojo对象。MyBatis中的与输出映射有关的`resultType`就不再赘述了。这里主要是记录`resultMap`的使用。

我们知道：`resultType`输出映射的时候，查询出来的列名和pojo中对应的属性名要一致才可以做正确的映射，如果不一致就会出现映射错误，而`resultMap`就是为了解决这个问题的。

假设现在映射文件中有一个SQL语句：`select id id_,username username_ form user where id=#{id}`。从这个SQL语句中看出，查询出了`id`和`username`两列，但是都起了别名。也就是说：现在用`resultType`去映射到User时，肯定会出现问题，所以需要第一个`resultMap`来做查询结果列与User的属性之间的一个映射。

### 定义resultMap

首先需要在`UserMapper.xml`文件中定义一个`resultMap`，如下：

```xml
<resultMap type="user" id="userResultMap">
    <id column="id_" property="id"></id>
    <result column="username_" property="username"></result>
</resultMap>
```

介绍以下`resultMap`中相关属性的作用：

```
<resultMap>中的type属性表示 resultMap最终映射的java对象类型。上面用的是别名，如果没有定义别名，需要使用完全限定名 
<resultMap>中的id属性是对这个resultMap的唯一标识。 
<resultMap>的子标签<id>表示查询结果集中的唯一标识，因为id是主键。 
<resultMap>的子标签<result>表示对查询结果集中普通名映射的定义。 
子标签中的column属性：表示查询出来的列名 
子标签中的property属性：表示上面type指定的pojo类型中的属性名
```

### 配置UserMapper.xml映射文件

```xml
<select id="findUserByIdResultMap" parameterType="int" resultMap="userResultMap">
    select id id_, username username_ form user where id = #{id}
</select>
```

### 定义Mapper接口

```java
public interface UserMapper{
	//省去无关代码

    //根据id查询用户信息，使用resultMap输出
    public User findUserByIdResultMap(int id) throws Exception;
}   
```

使用一个测试类来测试一下

```java
@Test
public void testFindUserByIdResultMap() throws Exception {

    SqlSession sqlSession = new MyBatis().getSqlSesstion();
    //创建UserMapper对象，mybatis自动生成mapper代理对象
    UserMapper userMapper = sqlSession.getMapper(UserMapper.class);

    User user = userMapper.findUserByIdResultMap(1);
    System.out.println(user);
}
```

在最后的结果中可以看出，打印出的user中只有id和username是有值的，其他都是null，因为我们在sql中只要了这两个属性，所以是正常的。 

# MyBatis动态SQL

动态sql是mybatis中的一个核心，什么是动态sql？动态sql即对sql语句进行灵活操作，通过表达式进行判断，对sql进行灵活拼接、组装。就比如这句SQL：

```sql
select * from user where user.sex = #{user.sex} and user.username like '%${user.username}%'1
```

假如这个user是null咋整？或者`user.sex`或者`user.username`为null呢？所以更严谨的做法应该是在执行这个语句之前要先进行判断才对，确保都不为空，那么我再去查询。这就涉及到了mybatis中的动态sql了。 在mybatis中，动态sql可以使用标签来表示，这很类似于`jstl`表达式，我们可以将上面的sql语句改成动态sql，如下：

```xml
<select id="findUserList" parameterType="mybatis.po.UserQueryVo" resultType="mybatis.po.User">
    select * from user
    <!-- where可以自动去掉条件中的第一个and -->
    <where>
        <if test="user!=null">
            <if test="user.sex!=null and user.sex!=''">
                and user.sex = #{user.sex}
            </if>
            <if test="user.username!=null and user.username!=''">
                and user.username like '%${user.username}%'
            </if>
        </if>
    </where>
</select>
```

上面的代码很好理解，主要就是加了一些判断，条件不为空，才进行查询条件的拼接，让mybatis动态的去执行。那么在测试代码中，我们可以故意的将`user.sex`不赋初值，就可以看到查询的结果是不一样的。动态SQL的实现依赖mybatis提供的标签`<if>、<where>、<foreach>`。

1. if是判断条件的，语法：

   ```xml
   <if test = "判断Java对象的属性值">
       部分SQL语句
   </if>
   ```

    例如：

   ```xml
   <select id="selectProvinceIf" resultType="Province">
       select * from Province where
       <if test = "id > 0">
           id > #{id}
       </if>
       <if test="name != '' and name != null">
           or name = #{name}
       </if>
   </select>
   ```

2. where标签是用来包含多个`<if>`的，当多个`<if>`中有一个成立时，`<where>`会自动增加一个where关键字，并去掉`<if>`中多余的and、or等连接词

   ```XML
   <select id="selectProvinceWhere" resultType="Province">
       select * from Province
       <where>
           <if test = "id > 0">
           	id > #{id}
       	</if>
       	<if test="name != '' and name != null">
           	or name = #{name}
       	</if>
       </where>
   </select>
   ```

3. foreach主要是用来循环Java数组，list集合的。用在sql的in语句中。

   基本语法：

   ```xml
   <foreach collection="表示接口中方法参数的类型" item="自定义表示数组或集合成员的变量" open="循环开始时的字符" cloes="循环结束时的字符" separator="集合成员的分隔符">
   </foreach>
   ```

   示例：

   ```xml
   select * from student where id in (1001,1002,1003);
   
   <!--mybatis实现-->
   
   <!--集合中元素为值-->
   <select id="selectProvinceforeach" resultType="com.hugh.entity.Province">
       select * from province where id in
       <foreach collection="list" item="myid" open="(" close=")" separator=",">
           #{myid}
       </foreach>
   </select>
   
   <!--集合中元素为对象-->
   <select id="selectStudentforeach" resultType="com.hugh.entity.Student">
       select * from student where id in
       <foreach collection="list" item="stu" open="(" close=")" separator=",">
           #{stu.id}
       </foreach>
   </select>
   ```

4. SQL代码片段

   使用`<sql>`标签定义SQL片段，以便其他SQL标签复用，其他标签使用该SQL片段时只需要使用`<include/>`子标签即可引用。

   ```xml
   <sql id="studentSql">
       select * from student
   </sql>
   <select id="SelectStudentPart" resultType="com.hugh.entity.student">
       <include refid="studentSql"/>
       <if test="list != null and list.size > 0">
           where id in
           <foreach colletion="list" item="stuObject" open="(" cloes=")" separator=",">
               #{stuObject.id}
           </foreach>
       </if>
   </select>
   ```


# MyBatis配置文件

使用数据库属性配置文件

为了方便对数据库连接的管理，DB连接四要素数据一般都是存放在一个专门的属性文件中的。MyBatis

主配置文件需要从这个属性文件中读取这些数据。

1. 在classpath路径下，创建properties文件

   在 resources 目录创建 jdbc.properties 文件，文件名称自定义。

   ```properties
   jdbc.driver=com.mysql.jdbc.Driver
   jdbc.url=jdbc:mysql://loacalhost:3306/ssm?charset=utf-8
   jdbc.username=root
   jdbc.password=19961220
   ```

2. 使用properties标签

   修改主配置文件，文件开始位置加入：

   ```xml
   <properties resource="jdbc.properties"></properties>
   ```

3. 使用key指定值

   ```xml
   <dataSource type="POOLED">
       <property name="driver" value="jdbc.driver"></property>
       <property name="url" value="jdbc.url"></property>
       <property name="username" value="jdbc.username"></property>
       <property name="password" value="jdbc.password"></property>
   </dataSource>
   ```

# 高级映射之一对一查询

建表

```sql
DROP TABLE IF EXISTS `items`;
DROP TABLE IF EXISTS `orders`;
DROP TABLE IF EXISTS `user`;
DROP TABLE IF EXISTS `orderdetail`;

/*items是商品表*/
CREATE TABLE `items` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(32) NOT NULL COMMENT '商品名称',
  `price` FLOAT(10,1) NOT NULL COMMENT '商品定价',
  `detail` TEXT COMMENT '商品描述',
  `pic` VARCHAR(64) DEFAULT NULL COMMENT '商品图片',
  `createtime` DATETIME NOT NULL COMMENT '生产日期',
  PRIMARY KEY (`id`)
) ENGINE=INNODB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4;

/*user是用户表*/
CREATE TABLE `user` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `username` VARCHAR(32) NOT NULL COMMENT '用户名称',
  `birthday` DATE DEFAULT NULL COMMENT '生日',
  `sex` CHAR(1) DEFAULT NULL COMMENT '性别',
  `address` VARCHAR(256) DEFAULT NULL COMMENT '地址',
  PRIMARY KEY (`id`)
) ENGINE=INNODB AUTO_INCREMENT=27 DEFAULT CHARSET=utf8mb4;

/*orders是订单表*/
CREATE TABLE `orders` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `user_id` INT(11) NOT NULL COMMENT '下单用户id',
  `number` VARCHAR(32) NOT NULL COMMENT '订单号',
  `createtime` DATETIME NOT NULL COMMENT '创建订单时间',
  `note` VARCHAR(100) DEFAULT NULL COMMENT '备注',
  PRIMARY KEY (`id`),
  KEY `FK_orders_1` (`user_id`),
  CONSTRAINT `FK_orders_id` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=INNODB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4;

/*orderdetail是订单明细表*/
DROP TABLE IF EXISTS orderdetail;
CREATE TABLE `orderdetail` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `orders_id` INT(11) NOT NULL COMMENT '订单id',
  `items_id` INT(11) NOT NULL COMMENT '商品id',
  `items_num` INT(11) DEFAULT NULL COMMENT '商品购买数量',
  PRIMARY KEY (`id`),
  KEY `FK_orderdetail_1` (`orders_id`),
  KEY `FK_orderdetail_2` (`items_id`),
  CONSTRAINT `FK_orderdetail_1` FOREIGN KEY (`orders_id`) REFERENCES `orders` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `FK_orderdetail_2` FOREIGN KEY (`items_id`) REFERENCES `items` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=INNODB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4;
```

![](https://s1.ax1x.com/2020/09/09/w3tvm8.png)

这一节主要总结mybatis中一对一的映射，所以选择左边orders和user之间的一对一关系来总结，主要是查询订单信息，关联查询创建订单的用户信息。查询结果可以使用resultType，也可以使用resultMap，在这里对比一下各个方法的特点。

## resultType

### SQL查询语句

写查询语句的时候首先得确定查询的主表，这里是订单表，然后关联表是用户表。由于orders表中有一个外键（user_id），通过此外键关联查询用户表只能查询出一条记录，所以使用内连接。查询的sql如下：

```sql
select orders.*, user.username, user.sex, user.address from orders, user where oders.user_id = user.id;
```

### 创建pojo

使用resultType的话，有个前提就是查询结果要想映射到pojo中去，pojo中必须包括所有查询出的列名才行。这里不仅查询出order表中的所有字段，而且还查询出了用户表中的部分字段，所以我们要自己新建一个pojo来包含所有的这些查询出来的字段才行。

创建pojo的原则是继承包括查询字段较多的po类。

**Orders类**

```java
public class Orders{
    private int id;
    private int user_id;
    private String number;
    private String createtime;
    private String note;
    
    //省略get和set方法
}
```

**组合了用户信息的OrdersCustom类**

```java
//通过此类映射订单和用户查询的结果，让此类继承包括字段较多的po类
public class OrdersCustom extends Orders {

    //继承了Orders，已经有了Orders的所有属性了
    //下面添加用户属性
    private String username;
    private String sex;
    private String address;

    //省略get和set方法
}
```

### 创建mapper.xml文件

UserMapperOrders.xml

```xml
<mapper namespace="mybatis.mapper.UserMapperOrders">
    <select id="findOrdersUser" resultType="mybatis.po.OrdersCustom">
        SELECT 
          orders.*, user.`username`, user.`sex`, user.`address` 
        FROM
          orders, USER 
        WHERE orders.`user_id` = user.`id` 
    </select>
</mapper>
```

### 创建接口文件

UserMapperOrders.java

```java
public interface UserMapperOrders{
    //查询订单，关联查询用户信息
    public OrdersCustom findOrdersUser();
}
```

到这里就完成了使用`resultType`方法来实现一对一查询了，下面测试一下：

```java
@Test
public void testUserMapperOrders(){
    SqlSession sqlSession = new MyBatisUtil().getSqlSession();
    UserMapperOrders userMapperOrders = sqlsession.getMapper(UserMapperOrders.class);
    OrdersCustom orderCustom = userMapperOrders.findOrderUser(); 
    System.out.println(orderCustom);
}
```



## resultMap

还是上面那个sql，使用resultMap方法的思路如下：使用resultMap将查询结果中的订单信息映射到Orders对象中，在Orders类中添加User属性，将关联查询出来的用户信息映射到Orders对象中的User属性中，所以现在Orders类中添加一项User属性。

### 创建pojo

**Orders类**

```java
public class Orders{
    private User user;
    private int id;
    private int userId;
    private String number;
    private String createtime;
    private String note;
    //省略了set，get方法
}
```

### 定义resultMap

```xml
<resultMap type="mybatis.po.Orders" id="OrdersUserResulrMap">
    <id column="id" property="id"></id>
    <result column="user_id" property="userId"></result>
    <result column="number" property="number"></result>
    <result column="createtime" property="createtime"></result>
    <result column="note" property="note"></result>
    <association property="user" javaType="mybatis.po.User">
        <id column="user_id" property="id"></id>
        <result column="username" property="username"></result>
        <result column="sex" property="sex"></result>
        <result column="address" property="address"></result>
    </association>
</resultMap>
```

### Mapper.xml配置文件

```xml
<select id="findOrdersUserResultMap" resultMap="OrdersUserResultMap">
        select orders.*, user.`username`, user.`sex`, user.`address` FROM orders,USER WHERE orders.`user_id` = user.`id`
    </select>
```

### 创建接口文件

```java
public interface UserMapperOrders{
    // 查询订单，关联查询用户信息，使用resultMap
    public List<OrdersCustom> findOrdersUserResultMap() throws Exception;
}
```

测试方法

```java
@Test
    public void testUserMapperOrdersResultMap() throws Exception {
        SqlSession sqlSession = new MybatisUtil().getSqlSession();
        UserMapperOrders userMapperOrders = sqlSession.getMapper(UserMapperOrders.class);
        List<OrdersCustom> list = userMapperOrders.findOrdersUserResultMap();
        System.out.println(list);
    }
```

## resultType和resultMap对比

　实现一对一查询：

> 1. resultType：使用`resultType`实现较为简单，如果pojo中没有包括查询出来的列名，需要增加列名对应的属性，即可完成映射。如果没有查询结果的特殊要求建议使用`resultType`。
> 2. resultMap：需要单独定义resultMap，实现有点麻烦，如果对查询结果有特殊的要求，使用resultMap可以完成将关联查询映射pojo的属性中。
> 3. resultMap可以实现延迟加载，resultType无法实现延迟加载。

# 高级映射之一对多查询

订单项和订单明细是一对多的关系，所以查询订单表，然后关联订单明细表，这样就有一对多的问题出来了。首先还是先写sql语句，在写sql语句的时候遵循两点：

> 1. 查询的主表是哪个？ 订单表
> 2. 查询的关联表是哪个？ 订单明细表

明确了主表和关联表，下面就可以写sql了，在上一节的sql基础上添加订单明细表的关联即可。

```sql
SELECT
    o.*, u.`username`, u.`sex`, u.`address`, od.`id` orderdetail_id, od.`items_id`, od.`items_num`, od.`orders_id`
FROM
    orders o, USER u, orderdetail od
WHERE o.`user_id`=u.`id` AND o.`id` = od.`orders_id` 
```

这样我们就查询出了订单表中的所有字段，user表和orderdetail表的部分字段，当然也可以查询所有字段，这个根据具体需求来定。看一下查询结果：
![](https://s1.ax1x.com/2020/09/09/w3NCfs.png)
　　从结果中可以看出，订单的信息有重复，订单项是不重复的，因为一对多嘛，这很好理解。所以如果我们用resultType来做映射的话就会出现订单信息的重复，我们不希望出现这个结果，即对orders的映射不能出现重复记录的情况。那么我们就需要在`Orders.java`类中添加一个`List<OrderDetail> orderDetails`属性来封装订单明细项（比较简单，代码就不贴了），最终会将订单信息映射到Orders中，该订单所对应的订单明细映射到Orders中的`orderDetails`属性中。

## 映射文件

```xml
<select id="findOrdersAndOrderDetailResultMap" resultMap="OrdersAndOrderDetailResultMap">
SELECT
    o.*, u.`username`, u.`sex`, u.`address`, od.`id` orderdetail_id, od.`items_id`, od.`items_num`, od.`orders_id`
FROM
    orders o, USER u, orderdetail od
WHERE o.`user_id`=u.`id` AND o.`id` = od.`orders_id` 
</select>
<resultMap id="OrdersAndOrderDetailResultMap的resultMap" type = "mybatis.po.Orders" extends="OrdersUserResultMap">
    <!-- 配置映射订单信息和关联的用户信息和上面的一样，继承上面的即可 -->
    <!-- 配置关联的订单明细信息 -->
    <collection property="orderdetails" ofType="mybatis.po.Orderdetail">
        <id column="orderdetail_id" property="id"/>
        <result column="items_id" property="itemsId"/>
        <result column="items_num" property="itemsNum"/>
        <result column="orders_id" property="ordersId"/>
    </collection>
</resultMap>
```

这里看到了一个继承，因为订单信息和关联的用户信息和前面一对一是完全一样的，我们就不需要再写一遍了，`<resultMap>`支持继承，直接继承那个`resultMap`即可，然后加上订单明细这部分即可。`<collection>`是用来处理一对多映射的标签，`property`属性是`Orders.java`类中对应的装`OrderDetail`的`List`的属性名，就是刚刚定义的那个List，`ofType`属性表示该List中装的是啥，可以是完全限定名，也可以是别名。

## 接口文件

```java
public interface UserMapperOrders {

    //省去不相关代码

    //查询订单（关联用户）及订单明细
    public List<Orders> findOrdersAndOrderDetailResultMap() throws Exception;

}
```

使用测试方法测试一下

```java
@Test
public void testFindOrdersAndOrderDetailResultMap() throws Exception {
    SqlSession sqlSession = new MyBatisUtil().getSqlSession();
    UserMapperOrders userMapperOrders = sqlSession.getMapper(UserMapperOrders.class);
    List<Orders> list = userMapperOrders.findOrdersAndOrderDetailResultMap();
    System.out.println(list);
}
```

# 高级映射之多对多查询

用户表和商品表是多对多关系，它们两的多对多是通过订单项和订单明细这两张表所关联起来的，这里总结一下用户表和商品表之间的多对多映射。首先是写sql：

```sql
SELECT 
  o.*, u.`username`, u.`sex`, u.`address`,
  od.`id` orderdetail_id, od.`items_id`, od.`items_num`, od.`orders_id`,
  i.`name` items_name, i.`detail` items_detail, i.`price` items_price
FROM
  orders o, USER u, orderdetail od, items i
WHERE orders.`user_id`=user.`id` AND orders.`id` = orderdetail.`orders_id` AND orderdetail.`items_id`=items.`id`
```

因为多对多比较复杂，总共有四张表，分析一下思路：

> 1. 将用户信息映射到User中；
> 2. 在User类中添加订单列表属性`List<Orders>ordersList`，将用户创建的订单映射到ordersList中；
> 3. 在Orders中添加订单明细列表属性`List<OrderDetail>orderDetails`，将订单的明细映射到orderDetails中；
> 4. 在OrderDetail中添加Items属性，将订单明细所对应的商品映射到Items中。

## 映射文件

```xml
<resultMap type="mybatis.po.User" id="UserAndItemsResultMap">
    <!-- 用户信息 -->
    <id column="user_id" property="id"/>
    <result column="username" property="username"/>
    <result column="sex" property="sex"/>
    <result column="address" property="address"/>
    <!-- 订单信息 -->
    <!-- 一个用户对应多个订单，使用collection -->
    <collection property="ordersList" ofType="mybatis.po.Orders">
        <id column="id" property="id"/>
        <result column="user_id" property="userId"/>
        <result column="number" property="number"/>
        <result column="createtime" property="createtime"/>
        <result column="note" property="note"/>
        <!-- 订单明细信息 -->
        <!-- 一个订单包括多个明细，使用collection -->
        <collection property="orderdetails" ofType="mybatis.po.Orderdetail">
            <id column="orderdetail_id" property="id"/>
            <result column="items_id" property="itemsId"/>
            <result column="items_num" property="itemsNum"/>
            <result column="orders_id" property="ordersId"/>
            <!-- 商品信息 -->
            <!-- 一个明细对应一个商品信息，使用association -->
            <association property="items" javaType="mybatis.po.Items">
                <id column="items_id" property="id"/>
                <result column="items_name" property="name"/>
                <result column="items_detail" property="detail"/>
                <result column="items_price" property="price"/>
            </association>
        </collection>
    </collection>
</resultMap>
```

## Mapper接口文件

```java
public interface UserMapperOrders {

    //省去不相关代码

    //查询用户购买商品信息
    public List<User> findUserAndItemsResultMap() throws Exception;

}
```

测试一下：

```java
@Test
public void findUserAndItemsResultMap() throws Exception {
    SqlSession sqlSession = new MyBatisUtil().getSqlSession();
    UserMapperOrders userMapperOrders = sqlSession.getMapper(UserMapperOrders.class);
    List<User> list = userMapperOrders.findUserAndItemsResultMap();
    System.out.println(list);
}
```

这样多对多的映射就搞定了。不过还有个问题，就是这里多对多的查询会把所有关联的表的信息都查询出来，然后放到pojo中的对应的List或者某个类中，所以即使我只查了个用户信息，但是这个用户里包含了订单，订单项，商品等信息，感觉装的有点多，好像有时候并不需要这么多冗余的数据出来，但是如果用resultType的话查询出来的字段必须对应pojo中的属性，如果有List等，需要手动装入才行。所以下面总结一下对于这种查询数据比较多的时候，resultType和resultMap各有什么作用？

> 1. 比如我们只需要将查询用户购买的商品信息明细清单（如用户名、用户地址、购买商品名称、购买商品时间、购买商品数量），那么我们完全不需要其他的信息，这个时候就没必要使用resultMap将所有的信息都搞出来，我们可以自己定义一个pojo，包含我们需要的字段即可，然后查询语句只查询我们需要的字段，这样使用resultType会方便很多。
> 2. 如果我们需要查询该用户的所有详细信息，比如用户点击该用户或者鼠标放上去，会出来跟该用户相关的订单啊，订单明细啊，商品啊之类的，然后我们要点进去看下详细情况的时候，那就需要使用resultMap了，必须将所有信息都装到这个User中，然后具体啥信息再从User中取，很好理解。
> 3. 总结一点：使用resultMap是针对那些对查询结果映射有特殊要求的功能，，比如特殊要求映射成list中包括多个list。否则使用resultType比较直接。

# 延迟加载

## 什么是延迟加载

举个例子：如果查询订单并且关联查询用户信息。如果先查询订单信息即可满足要求，当我们需要查询用户信息时再查询用户信息。把对用户信息的按需去查询就是延迟加载。 所以延迟加载即先从单表查询、需要时再从关联表去关联查询，大大提高数据库性能，因为查询单表要比关联查询多张表速度要快。 对比一下：

```
关联查询：SELECT orders.*, user.username FROM orders, USER WHERE orders.user_id = user.id 
延迟加载相当于： 
SELECT orders.*, (SELECT username FROM USER WHERE orders.user_id = user.id) username FROM orders
```

所以这就比较直观了，也就是说，我把关联查询分两次来做，而不是一次性查出所有的。第一步只查询单表orders，必然会查出orders中的一个`user_id`字段，然后我再根据这个`user_id`查user表，也是单表查询。下面来总结一下如何使用这个延迟加载

## 使用assocaiation实现延迟加载

前面提到的`resultMap`可以实现高级映射（使用association、collection实现一对一及一对多映射），其实`association`和`collection`还具备延迟加载的功能，这里就拿`association`来说明，`collection`和`association`使用的方法一样。需求就是上面提到的，查询订单并且关联查询用户，查询用户使用延迟加载。 

由上面的分析可知，延迟加载要查询两次，第二次是按需查询，之前一对一关联查询的时候只需要查一次，把订单和用户信息都查出来了，所以只要写一个`mapper`即可，但是延迟加载查两次，所以理所当然要有两个`mapper`。

### 两个mapper.xml

需要定义两个mapper的方法对应的statement。先来分析一下思路：

>1. 只查询订单信息的statement，使用resultMap
>2. 通过查询到的订单信息中的user_id去查询用户信息的statement，得到用户
>3. 定义的resultMap将两者关联起来，即用订单信息user_id去查用户

下面来实现这个思路： 

1. 只查询订单信息的statement：

   ```xml
   <select id="findOrdersUserLazyLoading" resultMap="OrdersUserLazyLoadingResultMap">
       SELECT * FROM orders
   </select>
   ```

2. 只查询用户信息的statement：

   ```xml
   <select id="findUserById" parameterType="int" resultType="user">
       select * from user where id = #{id}
   </select>
   ```

3. 定义上面那个resultMap： 

   ```xml
   <!--延迟加载的resultMap-->
   <resultMap type="mybatis.po.Orders" id="OrderUserLazyLoadingResultMap">
       <!--对订单信息进行映射配置-->
       <id colum="id" property="id"></id>
       <result colum="user_id" property="userId"></result>
       <result colum="number" property="number"></result>
       <result colum="createtime" property="createtime"></result>
       <result colum="note" property="note"></result>
       <!--实现对用户信息进行延迟加载
   	select：指定延迟加载需要执行的statement的id（是根据user_id查询用户信息的statement）
   	colum：订单信息中关联用户信息查询的列，是user_id-->
       
       <association property="user" javaType="mybatis.po.User" select="mybatis.mapper.UserMapper.findUserById" colum="user_id">
           <!--如果要实现延迟加载的那个statement不在本mapper中，前面要加上那个statement的所在mapper的namespace。-->
           <!--这里的findUserById这个statement就定义在UserMapper.xml中，跟查询订单不是在同一个mapper中，所以要加上namespace-->
           <!--将订单表中查询出来的user_id作为findUserById的参数传进去，查用户-->
       </association>
   </resultMap>
   ```

   ### 延迟加载的配置

   mybatis默认没有开始延迟加载，需要在mybatis的主配置文件中`setting`配置

   ```xml
   <settings>
       <!-- 打开延迟加载的开关 -->
       <setting name="lazyLoadingEnabled" value="true"/>
       <!-- 将积极加载改为消极加载，即延迟加载 -->
       <setting name="aggressiveLazyLoading" value="false"/>
   </settings>
   ```

   ### 接口文件

   ```java
   public interface UserMapperOrders {
   
       //省去不相关代码
   
       //查询订单，关联用户查询，用户查询用的是延迟加载
       public List<Orders> findOrdersUserLazyLoading() throws Exception;
   }
   ```

   接下来进行测试

   ```java
   @Test
   public void testFindOrdersUserLazyLoading() throws Exception {
       SqlSession sqlSession = sqlSessionFactory.openSession();
       UserMapperOrders userMapperOrders = sqlSession.getMapper(UserMapperOrders.class);
       //查询订单表（单表）
       List<Orders> list = userMapperOrders.findOrdersUserLazyLoading();
   
       //遍历上边的订单列表
       for(Orders orders : list) {
           //执行getUser()去查询用户信息，这里实现按需加载
           User user = orders.getUser();
           System.out.println(user);
       }
   }
   ```

   

   

# MyBatis缓存介绍

在 Web 系统中，最重要的操作就是查询数据库中的数据。但是有些时候查询数据的频率非常高，这是很耗费数据库资源的，往往会导致数据库查询效率极低，影响客户的操作体验。于是我们可以将一些变动不大且访问频率高的数据，放置在一个缓存容器中，用户下一次查询时就从缓存容器中获取结果。

正如大多数持久层框架一样，MyBatis 同样提供了**一级缓存**和**二级缓存**的支持

1. **一级缓存**: 基于`PerpetualCache`的`HashMap`本地缓存，其**存储作用域为** **Session**（一级缓存是一个SqlSession级别，sqlsession只能访问自己的一级缓存的数据），当 **Session flush** **或** **close** 之后，该**Session中的所有 Cache 就将清空**。
2. **二级缓存**与一级缓存其机制相同，默认也是采用 PerpetualCache，HashMap存储，不同在于其**存储作用域为 Mapper(Namespace)**（二级缓存是跨SqlSession的，属于mapper级别的缓存，对于mapper击毙的缓存sqlsession是可以共享的），并且**可自定义存储源**，如 Ehcache。
3. 对于缓存数据更新机制，当某一个作用域(一级缓存Session/二级缓存Namespaces)的进行了 C/U/D 操作后，默认该作用域下所有 select 中的缓存将被clear。

![](https://s1.ax1x.com/2020/09/09/w143N9.png)

从图中可以看出：

> 1. 一级缓存是`SqlSession`级别的缓存。在操作数据库时需要构造`sqlSession`对象，在对象中有一个数据结构（HashMap）用于存储缓存数据。不同的sqlSession之间的缓存数据区域（HashMap）是互相不影响的。
> 2. 二级缓存是mapper级别的缓存，多个SqlSession去操作同一个Mapper的sql语句，多个SqlSession可以共用二级缓存，二级缓存是跨SqlSession的。

## 一级缓存测试

一级缓存的工作原理：

![](https://s1.ax1x.com/2020/09/09/w156IJ.png)

从图中可以看出：第一次发起查询用户id为1的用户信息，先去找缓存中是否有id为1的用户信息，如果没有，从数据库查询用户信息。得到用户信息，将用户信息存储到一级缓存中。

如果中间sqlSession去执行commit操作（执行插入、更新、删除），则会清空SqlSession中的一级缓存，这样做的目的为了让缓存中存储的是最新的信息，避免脏读。

第二次发起查询用户id为1的用户信息，先去找缓存中是否有id为1的用户信息，缓存中有，直接从缓存中获取用户信息。

mybatis的一级缓存比较简单，我们不知不觉中就在用了，为了完整性，测试一下：

**一级缓存测试**

```java
@Test
public void testCache1() throws Exception {
    SqlSession sqlSession = new MyBatisUtil().getSqlSession(); //创建代理对象
    UserMapper userMapper = sqlSession.getMapper(UserMapper.class);

    //下边查询使用一个SqlSession
    //第一次发起请求，查询id为1的用户
    User user1 = userMapper.findUserById(1);
    System.out.println(user1);

	//如果sqlSession去执行commit操作（执行插入、更新、删除），清空SqlSession中的一级缓存，这样做的目的为了让缓存中存储的是最新的信息，避免脏读。

    //更新user1的信息
    user1.setUsername("测试用户22");
    userMapper.updateUser(user1);
    //执行commit操作去清空缓存
    sqlSession.commit();

    //第二次发起请求，查询id为1的用户
    User user2 = userMapper.findUserById(1);
    System.out.println(user2);

    sqlSession.close();

}
```



-------------------------------------------------------------



```java
package me.gacl.test;

import me.gacl.domain.User;
import me.gacl.util.MyBatisUtil;
import org.apache.ibatis.session.SqlSession;
import org.junit.Test;

/**
 * 测试一级缓存
 */
public class TestOneLevelCache {

    /*
     * 一级缓存: 也就Session级的缓存(默认开启)
     */
    @Test
    public void testCache1() {
        SqlSession session = MyBatisUtil.getSqlSession();
        String statement = "me.gacl.mapping.userMapper.getUser";
        User user = session.selectOne(statement, 1);
        System.out.println(user);

        /*
         * 一级缓存默认就会被使用
         */
        user = session.selectOne(statement, 1);
        System.out.println(user);
        session.close();
        /*
         1. 必须是同一个Session,如果session对象已经close()过了就不可能用了
         */
        session = MyBatisUtil.getSqlSession();
        user = session.selectOne(statement, 1);
        System.out.println(user);

        /*
         2. 查询条件是一样的
         */
        user = session.selectOne(statement, 2);
        System.out.println(user);

        /*
         3. 没有执行过session.clearCache()清理缓存
         */
        //session.clearCache();
        user = session.selectOne(statement, 2);
        System.out.println(user);

        /*
         4. 没有执行过增删改的操作(这些操作都会清理缓存)
         */
        session.update("me.gacl.mapping.userMapper.updateUser",
                new User(2, "user", 23));
        user = session.selectOne(statement, 2);
        System.out.println(user);

    }
}
```

MyBatis 一级缓存值得注意的地方：

- **MyBatis 默认就是支持一级缓存的，并不需要我们配置.**
- MyBatis 和 spring 整合后进行 mapper 代理开发，不支持一级缓存，mybatis和 spring 整合，**spring 按照 mapper 的模板去生成 mapper 代理对象，模板中在最后统一关闭 sqlsession。**



## 二级缓存测试

> **一级缓存存在的问题：**
>
> 有些时候，在 Web 工程中会将执行查询操作的方法封装在某个`Service`方法中，当查询完一次后，`Service`方法结束，此时`SqlSession`类的实例对象就会关闭，一级缓存就会被清空。

**二级缓存的范围是 mapper 级别（mapper即同一个命名空间），mapper 以命名空间为单位创建缓存数据结构，结构是 map，不同的mapper都有一个二级缓存，也就是说，不同的mapper之间的二级缓存是互不影响的。为了更加清楚的描述二级缓存，先来看一个示意图：**

![](https://s1.ax1x.com/2020/09/09/w3nTiT.png)

从图中可以看出：

> 1. `sqlSession1`去查询用户id为1的用户信息，查询到用户信息会将查询数据存储到该`UserMapper`的二级缓存中。
> 2. 如果`SqlSession3`去执行相同 mapper下sql，执行commit提交，则会清空该UserMapper下二级缓存区域的数据。
> 3. `sqlSession2`去查询用户id为1的用户信息，去缓存中找是否存在数据，如果存在直接从缓存中取出数据。

缓存的执行原理和前面提到的一级缓存是差不多的，二级缓存与一级缓存区别在于二级缓存的范围更大，多个`sqlSession`可以共享一个mapper中的二级缓存区域。mybatis是如何区分不同mapper的二级缓存区域呢？它是按照不同mapper有不同的namespace来区分的，也就是说，如果两个mapper的namespace相同，即使是两个mapper，那么这两个mapper中执行sql查询到的数据也将存在相同的二级缓存区域中。

要开启二级缓存，需要进行两步操作。

1. **第一步：**在 MyBatis 的全局配置文件`mybatis-config.xml`中配置 setting 属性，设置名为`cacheEnable`的属性值为`true`即可：

   ```xml
   <settings>
       <setting name="cacheEnable" value="true">
   </settings>
   ```

   > **注意：** `settings`配置的位置一定是在`properties后面，`typeAliases`前！

   

2. **第二步：**然后由于二级缓存是 Mapper 级别的，还要在需要开启二级缓存的具体`mapper.xml`文件中开启二级缓存，只需要在相应的`mapper.xml`中添加一个 `<cache>`标签即可：

   ```xml
   <!-- 开启本 Mapper 的 namespace 下的二级缓存 -->
   <cache></cache>
   ```

   cache标签常用属性：

   ```xml
   <cache 
   eviction="FIFO"  <!--回收策略为先进先出-->
   flushInterval="60000" <!--自动刷新时间60s-->
   size="1024" <!--最多缓存1024个引用对象-->
   readOnly="true"/> <!--只读-->
   ```

   开启二级缓存之后，我们需要为查询结果映射的实例类实现`java.io.serializable`接口，**二级缓存可以将内存的数据写到磁盘，存在对象的序列化和反序列化**，所以要实现`java.io.serializable`接口。

   ------------------------------------

   **二级缓存测试：**

   ```java
   @Test
   public void testCache2() throws Exception {
       SqlSession sqlSession1 = new MyBatisUtil().getSqlSession();
       SqlSession sqlSession2 = new MyBatisUtil().getSqlSession();
       SqlSession sqlSession3 = new MyBatisUtil().getSqlSession();
       // 创建代理对象
       UserMapper userMapper1 = sqlSession1.getMapper(UserMapper.class);
       // 第一次发起请求，查询id为1的用户
       User user1 = userMapper1.findUserById(1);
       System.out.println(user1);  
       
       //执行关闭操作，将sqlsession中的数据写到二级缓存区域
       sqlSession1.close();
   
       //sqlSession3用来清空缓存的，如果要测试二级缓存，需要把该部分注释掉
       //使用sqlSession3执行commit()操作
       UserMapper userMapper3 = sqlSession3.getMapper(UserMapper.class);
       User user  = userMapper3.findUserById(1);
       user.setUsername("hugh");
       userMapper3.updateUser(user);
       //执行提交，清空UserMapper下边的二级缓存
       sqlSession3.commit();
       sqlSession3.close();
   
       UserMapper userMapper2 = sqlSession2.getMapper(UserMapper.class);
       // 第二次发起请求，查询id为1的用户
       User user2 = userMapper2.findUserById(1);
       System.out.println(user2);
   
       sqlSession2.close();
   
   }
   ```
   
   我们先把`sqlSession3`部分注释掉来测试一下二级缓存的结果：
   ![](https://s1.ax1x.com/2020/09/09/w31ZPx.png)![二级缓存](https://img-blog.csdn.net/20160614135639431)
   当我们把`sqlSession3`部分加上后，再测试一下二级缓存结果：
![](https://s1.ax1x.com/2020/09/09/w31S2T.png)
   

   
   -----------------------------------------------------------------------------
   
   
   
   ```java
   package me.gacl.test;
   
   import me.gacl.domain.User;
   import me.gacl.util.MyBatisUtil;
   import org.apache.ibatis.session.SqlSession;
   import org.apache.ibatis.session.SqlSessionFactory;
   import org.junit.Test;
   
   /**
    * 测试二级缓存
    */
   public class TestTwoLevelCache {
   
       /*
        *  测试二级缓存
        *  使用两个不同的SqlSession对象去执行相同查询条件的查询，第二次查询时不会再发送SQL语句，而是直接从缓存中取出数据
        */
       @Test
       public void testCache2() {
           String statement = "me.gacl.mapping.userMapper.getUser";
           SqlSessionFactory factory = MyBatisUtil.getSqlSessionFactory();
           // 开启两个不同的SqlSession
           SqlSession session1 = factory.openSession();
           SqlSession session2 = factory.openSession();
           // 使用二级缓存时，User类必须实现一个Serializable接口===> User implements Serializable
           User user = session1.selectOne(statement, 1);
           session1.commit(); // session1.commit();// 因为，二级缓存是从cache（mapper.xml中定义的cache）中取得，如果session不commit，那么，数据就不会放入cache中。所以，只有commit后，才能取得。
           System.out.println("user=" + user);
   
           // 由于使用的是两个不同的SqlSession对象，所以即使查询条件相同，一级缓存也不会开启使用
           user = session2.selectOne(statement, 1);
           // session2.commit();
           System.out.println("user2=" + user);
       }
   }
   ```
   
   
   
   ### 其他配置（useCache和flushCache）
   
   mybatis中还可以配置userCache和flushCache等配置项，userCache是用来**设置是否禁用二级缓存**的，在`statement`中设置`useCache=false`可以禁用当前select语句的二级缓存，即每次查询都会发出sql去查询，默认情况是true，即该sql使用二级缓存。
   
   ```xml
   <select id="findOrderListResultMap" resultMap="ordersUserMap" useCache="false">1
   ```
   
   这种情况是针对每次查询都需要最新的数据sql，要设置成`useCache=false`，禁用二级缓存，直接从数据库中获取。在mapper的同一个namespace中，如果有其它`insert、update、delete`操作数据后需要刷新缓存，如果不执行刷新缓存会出现**脏读**。 设置`statement`配置中的`flushCache="true"`属性，默认情况下为true，即刷新缓存，如果改成false则不会刷新。使用缓存时如果手动修改数据库表中的查询数据会出现脏读。
   
   ```xml
   <insert id="insertUser" parameterType="cn.itcast.mybatis.po.User" flushCache="true">1
   ```
   
   一般下执行完`commit`操作都需要刷新缓存，`flushCache="true"`表示刷新缓存，这样可以避免数据库脏读。所以我们不用设置，默认即可，这里只是提一下。
   
   
   
   

# 参考

https://www.jianshu.com/p/76d35d939539

https://blog.csdn.net/eson_15/category_9266032.html

https://github.com/eson15/E_shop

https://github.com/eson15?tab=repositories

https://www.cnblogs.com/xdp-gacl/p/4261895.html

https://www.cnblogs.com/ywqbj/p/5707652.html





https://www.cnblogs.com/a1111/

http://www.mamicode.com/