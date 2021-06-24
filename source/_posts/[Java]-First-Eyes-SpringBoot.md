---
title: SpringBoot学习笔记
tags: [Java, SpringBoot]
categories: Java
date: 2020-11-18 15:10:21



---



![](https://gitee.com/hugh-zhan9/pic-go-image-host/raw/master/wallhaven-9mxz8k.jpg)

<!--more-->

> 参考了大佬Guide的[**SpringBoot+Spring常用注解总结**](https://github.com/Snailclimb/JavaGuide/blob/master/docs/system-design/framework/spring/SpringBoot%2BSpring%E5%B8%B8%E7%94%A8%E6%B3%A8%E8%A7%A3%E6%80%BB%E7%BB%93.md)

----------

SpringBoot的四大核心特性

- 自动配置
- 起步依赖
- Actuator
- 命令行界面

# 核心注解

## @SpringBootApplication

这里先单独拎出`@SpringBootApplication` 注解说一下，虽然我们一般不会主动去使用它。

*Guide 哥：这个注解是 Spring Boot 项目的基石，创建 SpringBoot 项目之后会默认在主类加上。*

```java
@SpringBootApplication
public class SpringSecurityJwtGuideApplication {
      public static void main(java.lang.String[] args) {
        SpringApplication.run(SpringSecurityJwtGuideApplication.class, args);
    }
}
```

我们可以把 `@SpringBootApplication`看作是 `@Configuration`、`@EnableAutoConfiguration`、`@ComponentScan` 注解的集合。

```java
package org.springframework.boot.autoconfigure;
@Target(ElementType.TYPE)
@Retention(RetentionPolicy.RUNTIME)
@Documented
@Inherited
@SpringBootConfiguration
@EnableAutoConfiguration
@ComponentScan(excludeFilters = {
		@Filter(type = FilterType.CUSTOM, classes = TypeExcludeFilter.class),
		@Filter(type = FilterType.CUSTOM, classes = AutoConfigurationExcludeFilter.class) })
public @interface SpringBootApplication {
   ......
}

package org.springframework.boot;
@Target(ElementType.TYPE)
@Retention(RetentionPolicy.RUNTIME)
@Documented
@Configuration
public @interface SpringBootConfiguration {

}
```

根据 SpringBoot 官网，这三个注解的作用分别是：

- `@EnableAutoConfiguration`：启用 SpringBoot 的自动配置机制
- `@ComponentScan`： 扫描被`@Component` (`@Service`,`@Controller`)注解的 bean，注解默认会扫描该类所在的包下所有的类。
- `@Configuration`：允许在 Spring 上下文中注册额外的 bean 或导入其他配置类

## Spring Bean 相关

###   @Autowired

自动导入对象到类中，被注入进的类同样要被 Spring 容器管理比如：Service 类注入到 Controller 类中。

```java
@Service
public class UserService {
  ......
}

@RestController
@RequestMapping("/users")
public class UserController {
   @Autowired
   private UserService userService;
   ......
}
```

### @Component、@Repository、@Service、@Controller

我们一般使用 `@Autowired` 注解让 Spring 容器帮我们自动装配 bean。要想把类标识成可用于 `@Autowired` 注解自动装配的 bean 的类,可以采用以下注解实现：

- `@Component` ：通用的注解，可标注任意类为 `Spring` 组件。如果一个 Bean 不知道属于哪个层，可以使用`@Component` 注解标注。
- `@Repository` : 对应持久层即 Dao 层，主要用于数据库相关操作。
- `@Service` : 对应服务层，主要涉及一些复杂的逻辑，需要用到 Dao 层。
- `@Controller` : 对应 Spring MVC 控制层，主要用于接受用户请求并调用 Service 层返回数据给前端页面。

###  @RestController

`@RestController`注解是`@Controller和`@`ResponseBody`的合集,表示这是个控制器 bean,并且是将函数的返回值直 接填入 HTTP 响应体中,是 REST 风格的控制器。

> Guide 哥：现在都是前后端分离，说实话我已经很久没有用过`@Controller`。如果你的项目太老了的话，就当我没说。

单独使用 `@Controller` 不加 `@ResponseBody`的话一般使用在要返回一个视图的情况，这种情况属于比较传统的 Spring MVC 的应用，对应于前后端不分离的情况。`@Controller` +`@ResponseBody` 返回 JSON 或 XML 形式数据

关于`@RestController` 和 `@Controller`的对比，请看这篇文章：[@RestController vs @Controller](https://mp.weixin.qq.com/s?__biz=Mzg2OTA0Njk0OA==&mid=2247485544&idx=1&sn=3cc95b88979e28fe3bfe539eb421c6d8&chksm=cea247a3f9d5ceb5e324ff4b8697adc3e828ecf71a3468445e70221cce768d1e722085359907&token=1725092312&lang=zh_CN#rd)。

### @Scope

声明 Spring Bean 的作用域，使用方法:

```java
@Bean
@Scope("singleton")
public Person personSingleton() {
    return new Person();
}
```

**四种常见的 Spring Bean 的作用域：**

- singleton : 唯一 bean 实例，Spring 中的 bean 默认都是单例的。
- prototype : 每次请求都会创建一个新的 bean 实例。
- request : 每一次 HTTP 请求都会产生一个新的 bean，该 bean 仅在当前 HTTP request 内有效。
- session : 每一次 HTTP 请求都会产生一个新的 bean，该 bean 仅在当前 HTTP session 内有效。

### @Configuration

一般用来声明配置类，可以使用 `@Component`注解替代，不过使用`@Configuration`注解声明配置类更加语义化。

```java
@Configuration
public class AppConfig {
    @Bean
    public TransferService transferService() {
        return new TransferServiceImpl();
    }
}
```

## 处理常见的 HTTP 请求类型

**5 种常见的请求类型:**

- **GET** ：请求从服务器获取特定资源。举个例子：`GET /users`（获取所有学生）
- **POST** ：在服务器上创建一个新的资源。举个例子：`POST /users`（创建学生）
- **PUT** ：更新服务器上的资源（客户端提供更新后的整个资源）。举个例子：`PUT /users/12`（更新编号为 12 的学生）
- **DELETE** ：从服务器删除特定的资源。举个例子：`DELETE /users/12`（删除编号为 12 的学生）
- **PATCH** ：更新服务器上的资源（客户端提供更改的属性，可以看做作是部分更新），使用的比较少，这里就不举例子了。

### GET 请求

```java
@GetMapping("users")  等价于 @RequestMapping(value="/users",method=RequestMethod.GET)
    
@GetMapping("/users")
public ResponseEntity<List<User>> getAllUsers() {
 return userRepository.findAll();
}
```

### POST 请求

```java
@PostMapping("users")  等价于 @RequestMapping(value="/users",method=RequestMethod.POST)
```

关于`@RequestBody`注解的使用，在下面的**前后端传值**这块会讲到。

```java
@PostMapping("/users")
public ResponseEntity<User> createUser(@Valid @RequestBody UserCreateRequest userCreateRequest) {
 return userRespository.save(user);
}
```

### PUT 请求

```java
@PutMapping("/users/{userId}") 等价于 @RequestMapping(value="/users/{userId}",method=RequestMethod.PUT)
    
@PutMapping("/users/{userId}")
public ResponseEntity<User> updateUser(@PathVariable(value = "userId") Long userId,
  @Valid @RequestBody UserUpdateRequest userUpdateRequest) {
  ......
}
```

### DELETE 请求

```java
@DeleteMapping("/users/{userId}") 等价于 @RequestMapping(value="/users/{userId}",method=RequestMethod.DELETE)
    
@DeleteMapping("/users/{userId}")
public ResponseEntity deleteUser(@PathVariable(value = "userId") Long userId){
  ......
}
```

### PATCH 请求

一般实际项目中，我们都是 PUT 不够用了之后才用 PATCH 请求去更新数据。

```java
  @PatchMapping("/profile")
  public ResponseEntity updateStudent(@RequestBody StudentUpdateRequest studentUpdateRequest) {
        studentRepository.updateDetail(studentUpdateRequest);
        return ResponseEntity.ok().build();
    }
```

## 前后端传值

**掌握前后端传值的正确姿势，是你开始 CRUD 的第一步！**

### @PathVariable 和 @RequestParam

`@PathVariable`用于获取路径参数，`@RequestParam`用于获取查询参数。

举个简单的例子：

```java
@GetMapping("/klasses/{klassId}/teachers")
public List<Teacher> getKlassRelatedTeachers(
         @PathVariable("klassId") Long klassId,
         @RequestParam(value = "type", required = false) String type ) {
...
}
```

如果我们请求的 url 是：`/klasses/123456/teachers?type=web`

那么我们服务获取到的数据就是：`klassId=123456,type=web`。

### @RequestBody

用于读取 Request 请求（可能是 POST、PUT、DELETE、GET 请求）的 body 部分并且**Content-Type 为 application/json** 格式的数据，接收到数据之后会自动将数据绑定到 Java 对象上去。系统会使用`HttpMessageConverter`或者自定义的`HttpMessageConverter`将请求的 body 中的 json 字符串转换为 java 对象。

用一个简单的例子来给演示一下基本使用！有一个注册的接口：

```java
@PostMapping("/sign-up")
public ResponseEntity signUp(@RequestBody @Valid UserRegisterRequest userRegisterRequest) {
  userService.save(userRegisterRequest);
  return ResponseEntity.ok().build();
}
```

`UserRegisterRequest`对象：

```java
@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserRegisterRequest {
    @NotBlank
    private String userName;
    @NotBlank
    private String password;
    @NotBlank
    private String fullName;
}
```

我们发送 post 请求到这个接口，并且 body 携带 JSON 数据：

```json
{"userName":"coder","fullName":"shuangkou","password":"123456"}
```

这样我们的后端就可以直接把 json 格式的数据映射到我们的 `UserRegisterRequest` 类上。



👉 需要注意的是：**一个请求方法只可以有一个`@RequestBody`，但是可以有多个`@RequestParam`和`@PathVariable`**。 如果你的方法必须要用两个 `@RequestBody`来接受数据的话，大概率是你的数据库设计或者系统设计出问题了！

## 读取配置信息

**很多时候我们需要将一些常用的配置信息比如阿里云 oss、发送短信、微信认证的相关配置信息等等放到配置文件中。**

**下面我们来看一下 Spring 为我们提供了哪些方式帮助我们从配置文件中读取这些配置信息。**

我们的数据源`application.yml`内容如下：：

```yml
wuhan2020: 2020年初武汉爆发了新型冠状病毒，疫情严重，但是，我相信一切都会过去！武汉加油！中国加油！

my-profile:
  name: Guide哥
  email: koushuangbwcx@163.com

library:
  location: 湖北武汉加油中国加油
  books:
    - name: 天才基本法
      description: 二十二岁的林朝夕在父亲确诊阿尔茨海默病这天，得知自己暗恋多年的校园男神裴之即将出国深造的消息——对方考取的学校，恰是父亲当年为她放弃的那所。
    - name: 时间的秩序
      description: 为什么我们记得过去，而非未来？时间“流逝”意味着什么？是我们存在于时间之内，还是时间存在于我们之中？卡洛·罗韦利用诗意的文字，邀请我们思考这一亘古难题——时间的本质。
    - name: 了不起的我
      description: 如何养成一个新习惯？如何让心智变得更成熟？如何拥有高质量的关系？ 如何走出人生的艰难时刻？
```

### @value(常用)

使用 `@Value("${property}")` 读取比较简单的配置信息：

```java
@Value("${wuhan2020}")
String wuhan2020;
```

### @ConfigurationProperties(常用)

通过`@ConfigurationProperties`读取配置信息并与 bean 绑定。

```java
@Component
@ConfigurationProperties(prefix = "library")
class LibraryProperties {
    @NotEmpty
    private String location;
    private List<Book> books;

    @Setter
    @Getter
    @ToString
    static class Book {
        String name;
        String description;
    }
  省略getter/setter
  ......
}
```

你可以像使用普通的 Spring bean 一样，将其注入到类中使用。

### PropertySource（不常用）

`@PropertySource`读取指定 properties 文件

```java
@Component
@PropertySource("classpath:website.properties")

class WebSite {
    @Value("${url}")
    private String url;

  省略getter/setter
  ......
}
```

更多内容请查看我的这篇文章：《[10 分钟搞定 SpringBoot 如何优雅读取配置文件？](https://mp.weixin.qq.com/s?__biz=Mzg2OTA0Njk0OA==&mid=2247486181&idx=2&sn=10db0ae64ef501f96a5b0dbc4bd78786&chksm=cea2452ef9d5cc384678e456427328600971180a77e40c13936b19369672ca3e342c26e92b50&token=816772476&lang=zh_CN#rd)》 。



##  json 数据处理

### 过滤 json 数据

**`@JsonIgnoreProperties` 作用在类上用于过滤掉特定字段不返回或者不解析。**

```java
//生成json时将userRoles属性过滤
@JsonIgnoreProperties({"userRoles"})
public class User {

    private String userName;
    private String fullName;
    private String password;
    @JsonIgnore
    private List<UserRole> userRoles = new ArrayList<>();
}
```

**`@JsonIgnore`一般用于类的属性上，作用和上面的`@JsonIgnoreProperties` 一样。**

```java
public class User {

    private String userName;
    private String fullName;
    private String password;
   //生成json时将userRoles属性过滤
    @JsonIgnore
    private List<UserRole> userRoles = new ArrayList<>();
}
```

### 格式化 json 数据

`@JsonFormat`一般用来格式化 json 数据。比如：

```java
@JsonFormat(shape=JsonFormat.Shape.STRING, pattern="yyyy-MM-dd'T'HH:mm:ss.SSS'Z'", timezone="GMT")
private Date date;
```

### 扁平化对象

```java
@Getter
@Setter
@ToString
public class Account {
    @JsonUnwrapped
    private Location location;
    @JsonUnwrapped
    private PersonInfo personInfo;

	@Getter
  	@Setter
  	@ToString
  	public static class Location {
    	private String provinceName;
    	private String countyName;
  	}
    
  	@Getter
  	@Setter
  	@ToString
  	public static class PersonInfo {
    	private String userName;
    	private String fullName;
  	}
}
```

未扁平化之前：

```java
{
    "location": {
        "provinceName":"湖北",
        "countyName":"武汉"
    },
    "personInfo": {
        "userName": "coder1234",
        "fullName": "shaungkou"
    }
}
```

使用`@JsonUnwrapped` 扁平对象之后：

```java
@Getter
@Setter
@ToString
public class Account {
    @JsonUnwrapped
    private Location location;
    @JsonUnwrapped
    private PersonInfo personInfo;
    ......
}

{
  "provinceName":"湖北",
  "countyName":"武汉",
  "userName": "coder1234",
  "fullName": "shaungkou"
}
```

# 配置文件

## 多陪环境配置 profile

多环境配置文件： `application-[profile].yml / application-[profile].properties`，如：

```
application-prod.yml
application-dev.yml
application-test.yml
```

在主配置文件`application.yml`中设置

```yml
spring:
  profile: 
    # active的值决定配置文件的选择
    active: test
```

## 设置日志格式

```yml
logging:
  pattern:
  	# 自定义格式
    console: "%d{yyyy-mm-dd HH:mm:ss} [%thread] %-5level %logger- %msg%n"
    level: debug
  # 自定义日志文件
  file:
    path: ""
    name: "SpringBoot.log"
```

# 连接数据库

## 集成MyBatis

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 https://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>
    <parent>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-parent</artifactId>
        <version>2.3.4.RELEASE</version>
        <relativePath/> <!-- lookup parent from repository -->
    </parent>

    <groupId>com.hugh</groupId>
    <artifactId>springbootdemo</artifactId>
    <version>0.0.1-SNAPSHOT</version>
    <packaging>war</packaging>
    <name>springbootdemo</name>
    <description>Demo project for Spring Boot</description>

    <properties>
        <java.version>1.8</java.version>
    </properties>

    <dependencies>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-test</artifactId>
            <scope>test</scope>
            <exclusions>
                <exclusion>
                    <groupId>org.junit.vintage</groupId>
                    <artifactId>junit-vintage-engine</artifactId>
                </exclusion>
            </exclusions>
        </dependency>
        
        <!--MyBatis整合需要的依赖-->
        <dependency>
            <groupId>org.mybatis.spring.boot</groupId>
            <artifactId>mybatis-spring-boot-starter</artifactId>
            <version>2.1.1</version>
        </dependency>
        <dependency>
            <groupId>com.github.pagehelper</groupId>
            <artifactId>pagehelper-spring-boot-starter</artifactId>
            <version>1.2.13</version>
        </dependency>
        <dependency>
            <groupId>mysql</groupId>
            <artifactId>mysql-connector-java</artifactId>
        </dependency>
        <dependency>
            <groupId>com.alibaba</groupId>
            <artifactId>druid</artifactId>
            <version>1.1.12</version>
        </dependency>
        
        
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-thymeleaf</artifactId>
        </dependency>
        <dependency>
            <groupId>org.projectlombok</groupId>
            <artifactId>lombok</artifactId>
            <version>1.18.10</version>
        </dependency>
    </dependencies>

    <build>
        <plugins>
            <plugin>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-maven-plugin</artifactId>
            </plugin>
        </plugins>
    </build>
</project>

```

配置文件

```yml
server:
  port: 8080
  servlet:
    context-path: /

spring:
  datasource:
    driver-class-name: com.mysql.jdbc.Driver
    url: jdbc:mysql://localhost:3306/crm
    data-username: root
    data-password: 123
    type: com.alibaba.druid.pool.DruidDataSource

mybatis:
  mapper-locations: classpath:/mappers/*.xml
  type-aliases-package: com.xxx.springboot
  configuration:
    # 数据库字段下划线转驼峰规则
    map-underscorec-to-camel-case: true

pagehelper:
  helper-dialect: mysql

# 显示dao 执行sql语句
logging:
  level:
    com:
      xxx:
        springBoot:
          dao: debug
```

注意启动类上需要加入`@MapperScan("com.xxx.dao")`注解进行Dao接口扫描



### 数据访问









### 分页查询

PageHelper的使用

https://www.cnblogs.com/kitor/p/11009434.html
https://baijiahao.baidu.com/s?id=1645186885613613303&wfr=spider&for=pc
https://blog.csdn.net/qq_33609401/article/details/83749083
https://segmentfault.com/a/1190000018200373
https://www.cnblogs.com/ustc-anmin/p/10638119.html



## MyBatis 逆向工程

详见[MyBatis 逆向工程](http://hugh-zhan9.xyz/2020/11/14/MyBatis%20Generator/#more)

## MyBatis 实现分布式事务

[分布式事务]()





## SpringBoot JDBC

依赖：

```xml
<dependency>
    <groupId>mysql</groupId>
    <artifactId>mysql-connector-java</artifactId>
    <version>5.1.49</version>
</dependency>
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-jdbc</artifactId>
</dependency>
```

在`application.yml`中配置数据源

```yml
spring:
  datasource:
    url: jdbc:mysql://127.0.0.1:3306/springbootdemo?useUnicode=true&characterEncoding=UTF-8&useSSL=false&autoReconnect=true&failOverReadOnly=false&serverTimezone=GMT%2B8
    username: root
    password: 19961220
    driver-class-name: com.mysql.jdbc.Driver
```

持久层使用 SpringBoot JDBC

```java
import com.hugh.springbootdemo.pojo.OrmUser;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import javax.annotation.Resource;
import java.util.ArrayList;
import java.util.List;

@Repository
public class JdbcDao {

    @Resource
    private JdbcTemplate jdbcTemplate;

    /*
	*	execute方法：可以用于执行任何SQL语句，一般用于执行DDL语句;
	*	update方法及batchUpdate方法：update方法用于执行新增、修改、删除等语句; batchUpdate方法用于执行批处理相关语句；
	*	query方法及queryForXXX方法：用于执行查询相关语句;
	*	call方法：用于执行存储过程、函数相关语句。
	*/

     public void insertTest (OrmUser user){
        jdbcTemplate.update("insert into orm_user(username, password, email) values (?, ?, ?)",
                user.getUsername(),
                user.getPassword(),
                user.getEmail());
    }

    public void updateTest (OrmUser user){
         jdbcTemplate.update("update orm_user set password = ?, email = ? where username = ?",
                 user.getPassword(),
                 user.getEmail(),
                 user.getUsername());
    }

    public void deleteTest(OrmUser user){
         jdbcTemplate.update("delete from orm_user where uername = ?",user.getUsername());
    }

    
    /*
     *  查询操作
     */

    public OrmUser queryTest1(String name){
        // BeanPropertyRowMapper 数据库映射对象，完成数据库字段与实体类属性的对应，下划线映射驼峰
        OrmUser ormUser = jdbcTemplate.queryForObject("select * from orm_user where username = ?",
                new Object[]{name},
                new BeanPropertyRowMapper<>(OrmUser.class));
        return ormUser;
    }

    public List<OrmUser> queryAll(){
        List<OrmUser> list = new ArrayList();
        list = jdbcTemplate.query("select * from orm_user;", new BeanPropertyRowMapper<>(OrmUser.class));
        return list;
    }
    
    /*
    *	批量操作
    */
    
    public void batch(){
        List<User> batchArgs = new ArrayList<User>();
        batchArgs.add(new User("zhangsan","1"));
        batchArgs.add(new User("lisi","2"))
        jdbcTemplate.batchUpdate("insert into orm_user (username, password) values (?,?)", batchArgs)
    }
}
```

### 多数据源实现

修改`application.yml`中数据源配置

```yml
spring:
  datasource:
    # 多数据源 1号数据源id，可自定义
    primary:
      jdbc-url: jdbc:mysql://127.0.0.1:3306/springbootdemo1?useUnicode=true&characterEncoding=UTF-8&useSSL=false&autoReconnect=true&failOverReadOnly=false&serverTimezone=GMT%2B8
      username: root
      password: 19961220
      driver-class-name: com.mysql.jdbc.Driver
    secendary:
      jdbc-url: jdbc:mysql://127.0.0.1:3306/springbootdemo2?useUnicode=true&characterEncoding=UTF-8&useSSL=false&autoReconnect=true&failOverReadOnly=false&serverTimezone=GMT%2B8
      username: root
      password: 19961220
      driver-class-name: com.mysql.jdbc.Driver
```

实例化数据源

```java
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.boot.jdbc.DataSourceBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.jdbc.core.JdbcTemplate;

import javax.sql.DataSource;

@Configuration
public class DataSourceConfig {

    // 构建数据源 primary
    @Primary
    @Bean("primaryDataSource")
    @ConfigurationProperties(prefix = "springboot.datasource.primary")
    public DataSource primaryDataSource(){
        return DataSourceBuilder.create().build();
    }

    // 构建数据源 secondary
    @Bean("secondaryDataSource")
    @ConfigurationProperties(prefix = "springboot.datasource.secondary")
    public DataSource secondaryDataSource(){
        return DataSourceBuilder.create().build();
    }

    // 构建JdbcTemplate
    
    @Bean("primaryJdbcTemplate")
    public JdbcTemplate primaryJdbcTemplate(@Qualifier("primaryDataSource") DataSource dataSource){
        return new JdbcTemplate(dataSource);
    }

    @Bean("secondaryJdbcTemplate")
    public JdbcTemplate secondaryJdbcTemplate(@Qualifier("secondaryDataSource") DataSource dataSource){
        return new JdbcTemplate(dataSource);
    }
}
```

使用不同的`JdbcTemplate`操作不同的数据库。

```java
import com.hugh.springbootdemo.pojo.OrmUser;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import javax.annotation.Resource;
import java.util.ArrayList;
import java.util.List;

@Repository
public class JdbcDao {

    
    @Resource
    private JdbcTemplate primaryJdbcTemplate;
    @Resource
    private JdbcTemplate secondaryJdbcTemplate;


     public void insertTest (OrmUser user, JdbcTemplate jdbcTemplate){
         if (jdbcTemplate == null){
             jdbcTemplate = primaryJdbcTemplate;
         }
         jdbcTemplate.update("insert into orm_user(username, password, email) values (?, ?, ?)",
                user.getUsername(),
                user.getPassword(),
                user.getEmail());
    }
    
    ...
    // 将jdbcTemplate作为方法参数传入，判断是否为null，为null则默认使用primaryTemplate  
    
}
```

## JDBC 分布式事务（埋坑）

[分布式事务]()

**先埋个坑吧，之后学习了分布式相关在来填，以下代码报错**

>https://www.cnblogs.com/mayundalao/p/11798502.html

数据库事务不能跨数据源，也不能跨库，一旦出现了多数据源等情况，数据库事务机制就会失效。（@Transactional）

实现分布式事务：

- XA规范——两阶段提交（基础）
- JTA规范（Java版XA规范）
- Atomikos（具体实现）

分布式事务需要：事务管理器

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-jta-atomikos</artifactId>
</dependency>
```

修改数据源配置：

注释到之前的数据源配置

```yml
primarydb:
  uniqueResourceName: primary
  xaDataSourceClassName: com.mysql.jdbc.MysqlXADataSource
  xaProperties:
    url: jdbc:mysql://127.0.0.1:3306/springbootdemo1?useUnicode=true&characterEncoding=UTF-8&useSSL=false&autoReconnect=true&failOverReadOnly=false&serverTimezone=GMT%2B8
    user: root
    password: 19961220
  exclusiveConnectionMode: true
  minPoolSize: 3
  maxPoolSize: 10
  testQuery: select 1 from dual    # 由于采用Hikiricp，可以检测数据库连接是否存活

secondarydb:
  uniqueResourceName: secondary
  xaDataSourceClassName: com.mysql.jdbc.MysqlXADataSource
  xaProperties:
    url: jdbc:mysql://127.0.0.1:3306/springbootdemo2?useUnicode=true&characterEncoding=UTF-8&useSSL=false&autoReconnect=true&failOverReadOnly=false&serverTimezone=GMT%2B8
    user: root
    password: 19961220
  exclusiveConnectionMode: true
  minPoolSize: 3
  maxPoolSize: 10
  testQuery: select 1 from dual    # 由于采用Hikiricp，可以检测数据库连接是否存活
```

数据源对象的初始化

```java
import com.atomikos.jdbc.AtomikosDataSourceBean;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.jdbc.core.JdbcTemplate;

import javax.sql.DataSource;

@Configuration
public class DataSourceConfig {

    // 构建数据源 primary
    @Primary
    @Bean(name = "primaryDataSource", initMethod = "init", destroyMethod = "close")
    @ConfigurationProperties(prefix = "springboot.datasource.primary")
    public DataSource primaryDataSource(){
        return new AtomikosDataSourceBean();
    }

    // 构建数据源 secondary
    @Bean(name = "secondaryDataSource", initMethod = "init", destroyMethod = "close")
    @ConfigurationProperties(prefix = "springboot.datasource.secondary")
    public DataSource secondaryDataSource(){
        return new AtomikosDataSourceBean();
    }

    // 构建JdbcTemplate
    @Bean("primaryJdbcTemplate")
    public JdbcTemplate primaryJdbcTemplate(@Qualifier("primaryDataSource") DataSource dataSource){
        return new JdbcTemplate(dataSource);
    }

    @Bean("secondaryJdbcTemplate")
    public JdbcTemplate secondaryJdbcTemplate(@Qualifier("secondaryDataSource") DataSource dataSource){
        return new JdbcTemplate(dataSource);
    }
}
```

注册事务管理器

```java
import com.atomikos.icatch.jta.UserTransactionImp;
import com.atomikos.icatch.jta.UserTransactionManager;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.DependsOn;
import org.springframework.transaction.PlatformTransactionManager;
import org.springframework.transaction.jta.JtaTransactionManager;

import javax.transaction.SystemException;
import javax.transaction.TransactionManager;
import javax.transaction.UserTransaction;


@Configuration
public class TransactionManagerConfig {
    @Bean
    public UserTransaction userTransaction() throws SystemException{
        UserTransaction userTransactionImp = new UserTransactionImp();
        userTransactionImp.setTransactionTimeout(10000);
        return userTransactionImp;
    }

    @Bean(name = "atomikosTransactionManager", initMethod = "init", destroyMethod = "close")
    public TransactionManager atomikosTransactionManager() throws Throwable{
        UserTransactionManager userTransactionManager = new UserTransactionManager();
        return  userTransactionManager;
    }

    @Bean(name = "transactionManager")
    @DependsOn({"userTransaction","atomikosTransactionManager"})
    public PlatformTransactionManager transactionManager() throws Throwable{
        UserTransaction userTransaction = userTransaction();
        JtaTransactionManager manager = new JtaTransactionManager(userTransaction, atomikosTransactionManager());
        return manager;
    }
}
```

## SpringBoot  JPA

在实际开发过程中，对数据库的操作大多可以归结为：“增删改查”。就最为普遍的单表操作而言，除了表和字段不同外，语句几乎都是类似的，开发人员需要写大量类似而枯燥的语句来完成业务逻辑。为了解决这些大量枯燥的数据操作语句，诞生了非常多的优秀框架，比如：Hibernate。通过整合Hibernate，我们能够以操作Java实体的方式来完成对数据的操作，通过框架的帮助，对Java实体的变更最终将自动地映射到数据库表中。

在Hibernate的帮助下，Java实体映射到数据库表数据完成之后，再进一步解决抽象各个Java实体基本的“增删改查”操作，我们通常会以泛型的方式封装一个模板Dao来进行抽象简化，但是这样依然不是很方便，我们需要针对每个实体编写一个继承自泛型模板Dao的接口，再编写该接口的实现。虽然一些基础的数据访问已经可以得到很好的复用，但是在代码结构上针对每个实体都会有一堆Dao的接口和实现。

由于模板Dao的实现，使得这些具体实体的Dao层已经变的非常“薄”，有一些具体实体的Dao实现可能完全就是对模板Dao的简单代理，并且往往这样的实现类可能会出现在很多实体上。Spring Data JPA的出现正可以让这样一个已经很“薄”的数据访问层变成只是一层接口的编写方式。比如，下面的例子：

```java
public interface UserRepository extends JpaRepository<User, Long> {

    User findByName(String name);

    @Query("from User u where u.name=:name")
    User findUser(@Param("name") String name);

}
```

我们只需要通过编写一个继承自`JpaRepository`的接口就能完成数据访问，下面以一个具体实例来体验Spring Data JPA给我们带来的强大功能。

### 使用步骤

**依赖**

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-data-jpa</artifactId>
</dependency>
<dependency>
    <groupId>mysql</groupId>
    <artifactId>mysql-connector-java</artifactId>
    <version>5.1.49</version>
</dependency>
```

在`application.yml`中配置

```yml
spring:
  jackson:
    date-format: yyyy-MM-dd HH:mm:ss
    time-zone: GMT+8
  datasource:
    url: jdbc:mysql://127.0.0.1:3306/springbootdemo?useUnicode=true&characterEncoding=UTF-8&useSSL=false&autoReconnect=true&failOverReadOnly=false&serverTimezone=GMT%2B8
    username: root
    password: 19961220
    driver-class-name: com.mysql.jdbc.Driver
  jpa:
    database-platform: org.hibernate.dialect.MySQL5Dialect
    hibernate:
      ddl-auto: create
      			# create 每次加载都会删除上次生成的表，再重新生成表
      			# create-drop 每次加载生成表，在结束时删除表
      			# update 在加载时如果数据库中没有对应的表，则会自动创建，如果已有则会更新表结构，且不会删除之前的数据
      			# validate 每次加载时，验证表结构和pojo是否一致，不一致则抛出异常
    database: mysql
    show-sql: true
```

创建表对应的对象

```java
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.util.Date;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
//表示这是一个实体类，并且接受jpa管理
@Entity
// 表示对应数据库中table表
@Table(name = "book")   // 当表名和类名不同时间会报错，会以engine=MyISAM的格式创建表，mysql5.0以上报错
public class Book {
    // 主键
    @Id
    // 自增
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(nullable = false, unique = true, length = 32)
    private String name;
    private String description;
    private Date createTime;
}
```

数据库操作类，数据库访问接口，JpaRepository接口内部已经定义了很多的方法来完成基本的CRUD操作，也可以定义自己的方法

```java
import com.hugh.springbootdemo.pojo.Book;
import org.springframework.data.jpa.repository.JpaRepository;

// Book：要操作的数据库表对应的实体类
// Long：主键类型
@Repository
public interface BookRepository extends JpaRepository<Book, Long> {
    
    Book findByName(String name);

    Book findByNameAndAuthor(String name, Author author);
    
    // 自定义方法
    @Query("from Book b where b.author=:author")
    User findBookAuthor(@Param("author") String author);
    
	@Query("from Book b where b.name= ?1")
    Book findBookName(@Param("name") String name)
}
```

下面对上面的`BookRepository`做一些解释，该接口继承自`JpaRepository`，通过查看`JpaRepository`接口的[API文档](http://docs.spring.io/spring-data/data-jpa/docs/current/api/)，可以看到该接口本身已经实现了创建（save）、更新（save）、删除（delete）、查询（findAll、findOne）等基本操作的函数，因此对于这些基础操作的数据访问就不需要开发者再自己定义。

在我们实际开发中，`JpaRepository`接口定义的接口往往还不够或者性能不够优化，需要进一步实现更复杂一些的查询或操作。由于本文重点在Spring Boot中整合spring-data-jpa，在这里先抛砖引玉简单介绍一下spring-data-jpa中让我们兴奋的功能，后续再单独开篇讲一下spring-data-jpa中的常见使用。

在上例中，我们可以看到下面两个函数：

- `Book findByName(String name)`
- `Book findByNameAndAuthor(String name, Author author)`

它们分别实现了按name查询Book实体和按name和author查询Book实体，可以看到我们这里没有任何类SQL语句就完成了两个条件查询方法。这就是Spring-data-jpa的一大特性：**通过解析方法名创建查询**。

除了通过解析方法名来创建查询外，它也提供通过使用`@Query`注解来创建查询，您只需要编写JPQL语句，并通过类似`:author`来映射@Param指定的参数，就像例子中的第三个findUser函数一样。

**JPA中的关键字**

下表是常用的Spring Data支持的关键字：

| 关键字             | 例子                           | 转化为JPQL片段                               |
| ------------------ | ------------------------------ | -------------------------------------------- |
| And                | findByLastnameAndFirstname     | ...where x.lastname =?1 and x.firstname =?2  |
| Or                 | findByLastnameOrFirstname      | ...where x.lastname = ?1 or x.firstname = ?2 |
| Between            | findByStartDateBetween         | ...where x.startDate between ?1 and ?2       |
| LessThan           | findByAgeLessThan              | ...where x.age < ?1                          |
| LessThanEqual      | findByAgeLessThanEqual         | ...where x.age <= ?1                         |
| GreatThan          | findByAgeGreaterThan           | ...where x.age > ?1                          |
| GreaterThanEqual   | findByAgeGreaterThanEqual      | ...where x.age >= ?1                         |
| After              | findByStartDateAfter           | ... where x.startDate > ?1                   |
| Before             | findByStartDateBefore          | ...where x.startDate < ?1                    |
| IsNull             | findByAgeIsNull                | ...where x.age is null                       |
| IsNotNull，NotNULL | findByAge(Is)NotNull           | ...where x.age not null                      |
| OrderBy            | findByAgeOrderByLastnameDesc   | ...where x.age = ?1 order by x.lastname desc |
| Not                | findByLastnameNot              | ...where x.lastname <> ?1                    |
| In                 | findByAgeIn(Collection ages)   | ...where x.age in ?1                         |
| NotIn              | findByAgeNotIn(Collection age) | ...where x.age not in ?1                     |
| True               | findByActiceTrue()             | ...where x.active = true                     |
| Fales              | findByActiceFalse()            | ...where x.actice = false                    |
| IgnoreCase         | findByFirstnameIgnoreCase      | ...where UPPER(x.firstname) = UPPER(?1)      |
| Like               | findByFirstnameLike            | ...where x.firstname like ?1                 |
| NotLike            | findByFirstnameNotLike         | ...where x.firstname not like ?1             |

> **注意：**Spring Data的Query构造既适合JPA，也适合其他Spring Data支持的NoSQL。在大部分Spring Boot应用中，Query构造都只能创建一些简单的查询。但对于NoSQL来说已经足够了，不需要再自己构造NoSQL查询。

服务层

```java
import com.hugh.springbootdemo.dao.BookRepository;
import com.hugh.springbootdemo.pojo.Book;

import javax.annotation.Resource;

public class BookService {
    @Resource
    private BookRepository bookRepository;

    public void saveBook(Book book){
        bookRepository.save(book);
    }
    
    ....
}
```

#### 拓展阅读：关于Spring Data

Spring Data JPA在Spring家族中实际上是一个二级项目，它隶属于[Spring Data](https://spring.io/projects/spring-data)这个顶级项目。可以看一下关于这个项目的介绍，它除了涵盖对关系型数据库的抽象之外，其实还有很多对其他数据存储中间件的实现，比如我们常用的Redis、MongoDB、Elasticsearch等。

如果再找几个项目看一下它们的简单示例，你会发现：不论你是要访问什么数据存储产品，它们的编码方式几乎都是一样的！这就是Spring Data这个项目充满魅力的地方！通过对数据访问操作的抽象来屏蔽细节，用不同子项目的方式去实现细节。让开发者只需要学会使用Spring Data，就能方便快捷的学会对各种数据存储的操作。所以，对于Spring Data，我是强烈推荐Java开发者们可以学、甚至读一下源码的重要框架。虽然，目前来说很多大型互联网公司并不会选择它（性能考量居多，能真正用好它的人不多）作为主要的开发框架，但是其背后的抽象思想是非常值得我们学习的。并且，在做一些非高并发项目的时候，这简直就是一个快捷开发神器，它可以帮助我们少写非常多的代码！

### 多数据源实现

方式一：将数据源作为参数，传入到调用方法内部使用（例如JDBC中多数据源配置方式）

方式二：将不同数据源对应的实体类和接口分包存放，由spring去管理

配置多数据源：

```yml
spring:
  jackson:
    date-format: yyyy-MM-dd HH:mm:ss
    time-zone: GMT+8
  datasource:
    primary:
      jdbc-url: jdbc:mysql://127.0.0.1:3306/springbootdemo1?useUnicode=true&characterEncoding=UTF-8&useSSL=false&autoReconnect=true&failOverReadOnly=false&serverTimezone=GMT%2B8
        username: root
        password: 19961220
        driver-class-name: com.mysql.jdbc.Driver
    secondary:
      jdbc-url: jdbc:mysql://127.0.0.1:3306/springbootdemo2?useUnicode=true&characterEncoding=UTF-8&useSSL=false&autoReconnect=true&failOverReadOnly=false&serverTimezone=GMT%2B8
        username: root
        password: 19961220
        driver-class-name: com.mysql.jdbc.Driver
  jpa:
    database-platform: org.hibernate.dialect.MySQL5Dialect
    hibernate:
      ddl-auto: create
    database: mysql
    show-sql: true
```

**说明与注意**：

1. 多数据源配置的时候，与单数据源不同点在于`spring.datasource`之后多设置一个数据源名称`primary`和`secondary`来区分不同的数据源配置，这个前缀将在后续初始化数据源的时候用到。
2. 数据源连接配置2.x和1.x的配置项是有区别的：2.x使用`spring.datasource.secondary.jdbc-url`，而1.x版本使用`spring.datasource.secondary.url`。如果你在配置的时候发生了这个报错`java.lang.IllegalArgumentException: jdbcUrl is required with driverClassName.`，那么就是可能是这个配置项的问题。



配置数据源

primary 数据源配置

```java
import org.springframework.boot.autoconfigure.orm.jpa.HibernateProperties;
import org.springframework.boot.autoconfigure.orm.jpa.HibernateSettings;
import org.springframework.boot.autoconfigure.orm.jpa.JpaProperties;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.boot.jdbc.DataSourceBuilder;
import org.springframework.boot.orm.jpa.EntityManagerFactoryBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.orm.jpa.JpaTransactionManager;
import org.springframework.orm.jpa.LocalContainerEntityManagerFactoryBean;
import org.springframework.transaction.PlatformTransactionManager;
import org.springframework.transaction.annotation.EnableTransactionManagement;

import javax.annotation.Resource;

import javax.persistence.EntityManager;
import javax.sql.DataSource;
import java.util.Map;

@Configuration
@EnableTransactionManagement
@EnableJpaRepositories(
        entityManagerFactoryRef="entityManagerFactoryPrimary",
        transactionManagerRef="transactionManagerPrimary",
        basePackages= { "com.hugh.springbootdemo" })    //Repository所在的位置
public class JpaPrimaryConfig {

    @Resource
    private JpaProperties jpaProperties;

    @Resource
    private HibernateProperties hibernateProperties;

    @Primary
    @Bean(name = "primaryDataSource")
    @ConfigurationProperties(prefix = "spring.datasource.primary")
    public DataSource primaryDataSource() {
        return DataSourceBuilder.create().build();
    }

    @Primary
    @Bean(name = "entityManagerPrimary")
    public EntityManager entityManager(EntityManagerFactoryBuilder builder){
        return entityManagerFactoryPrimary(builder).getObject().createEntityManager();
    }

    @Primary
    @Bean(name = "entityManagerFactoryPrimary")
    public LocalContainerEntityManagerFactoryBean entityManagerFactoryPrimary(EntityManagerFactoryBuilder builder){
        Map<String,Object> properties =
                hibernateProperties.determineHibernateProperties(
                        jpaProperties.getProperties(),
                        new HibernateSettings());

        return builder.dataSource(primaryDataSource())
                .properties(properties)
                .packages("com.hugh") //实体类所在的包名
                .persistenceUnit("primaryPersistenceUnit")
                .build();
    }

    @Primary
    @Bean(name = "transactionManagerPrimary")
    public PlatformTransactionManager transactionManagerPrimary(EntityManagerFactoryBuilder builder){
        return new JpaTransactionManager(entityManagerFactoryPrimary(builder).getObject());
    }
}

```



Secondary 数据源配置

```java
import org.springframework.boot.autoconfigure.orm.jpa.HibernateProperties;
import org.springframework.boot.autoconfigure.orm.jpa.HibernateSettings;
import org.springframework.boot.autoconfigure.orm.jpa.JpaProperties;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.boot.jdbc.DataSourceBuilder;
import org.springframework.boot.orm.jpa.EntityManagerFactoryBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.orm.jpa.JpaTransactionManager;
import org.springframework.orm.jpa.LocalContainerEntityManagerFactoryBean;
import org.springframework.transaction.PlatformTransactionManager;
import org.springframework.transaction.annotation.EnableTransactionManagement;

import javax.annotation.Resource;
import javax.persistence.EntityManager;
import javax.sql.DataSource;
import java.util.Map;

@Configuration
@EnableTransactionManagement
@EnableJpaRepositories(
        entityManagerFactoryRef="entityManagerFactorySecondary",
        transactionManagerRef="transactionManagerSecondary",
        basePackages= { "com.hugh.springbootdemo" })    //Repository所在的位置
public class JpaSecondaryConfig {

    @Resource
    private JpaProperties jpaProperties;

    @Resource
    private HibernateProperties hibernateProperties;


    @Bean(name = "secondaryDataSource")
    @ConfigurationProperties(prefix = "spring.datasource.secondary")
    public DataSource secondaryDataSource() {
        return DataSourceBuilder.create().build();
    }


    @Bean(name = "entityManagerSecondary")
    public EntityManager entityManager(EntityManagerFactoryBuilder builder){
        return entityManagerFactorySecondary(builder).getObject().createEntityManager();
    }

    @Bean(name = "entityManagerFactorySecondary")
    public LocalContainerEntityManagerFactoryBean entityManagerFactorySecondary(EntityManagerFactoryBuilder builder){
        Map<String,Object> properties =
                hibernateProperties.determineHibernateProperties(
                        jpaProperties.getProperties(),
                        new HibernateSettings());

        return builder.dataSource(secondaryDataSource())
                .properties(properties)
                .packages("com.hugh")
                .persistenceUnit("SecondaryPersistenceUnit")
                .build();

    }

    @Bean(name = "transactionManagerSecondary")
    public PlatformTransactionManager transactionManagerSecondary(EntityManagerFactoryBuilder builder){
        return new JpaTransactionManager(entityManagerFactorySecondary(builder).getObject());
    }
}
```

**说明与注意**：

- 在使用JPA的时候，需要为不同的数据源创建不同的package来存放对应的Entity和Repository，以便于配置类的分区扫描
- 类名上的注解`@EnableJpaRepositories`中指定Repository的所在位置
- `LocalContainerEntityManagerFactoryBean`创建的时候，指定Entity所在的位置

#### 

## JPA  实现分布式事务

[分布式事务]()

## JPA 相关注解

### 创建表

`@Entity`声明一个类对应一个数据库实体。

`@Table` 设置表名

```java
@Entity
@Table(name = "role")
public class Role {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    private String description;
    省略getter/setter......
}
```

### 创建主键

`@Id` ：声明一个字段为主键。使用`@Id`声明之后，还需要定义主键的生成策略。可以使用 `@GeneratedValue` 指定主键生成策略。

**1.通过 `@GeneratedValue`直接使用 JPA 内置提供的四种主键生成策略来指定主键生成策略。**

```java
@Id
@GeneratedValue(strategy = GenerationType.IDENTITY)
private Long id;
```

JPA 使用枚举定义了 4 中常见的主键生成策略，如下：

*Guide 哥：枚举替代常量的一种用法*

```java
public enum GenerationType {

    /**
     * 使用一个特定的数据库表格来保存主键
     * 持久化引擎通过关系数据库的一张特定的表格来生成主键,
     */
    TABLE,

    /**
     *在某些数据库中,不支持主键自增长,比如Oracle、PostgreSQL其提供了一种叫做"序列(sequence)"的机制生成主键
     */
    SEQUENCE,

    /**
     * 主键自增长
     */
    IDENTITY,

    /**
     *把主键生成策略交给持久化引擎(persistence engine),
     *持久化引擎会根据数据库在以上三种主键生成 策略中选择其中一种
     */
    AUTO
}

// @GeneratedValue 注解默认使用的策略是 GenerationType.AUTO
public @interface GeneratedValue {

    GenerationType strategy() default AUTO;
    String generator() default "";
}
```

一般使用 MySQL 数据库的话，使用`GenerationType.IDENTITY`策略比较普遍一点（分布式系统的话需要另外考虑使用分布式 ID）。

**2.通过 `@GenericGenerator`声明一个主键策略，然后 `@GeneratedValue`使用这个策略**

```java
@Id
@GenericGenerator(name = "IdentityIdGenerator", strategy = "identity")
@GeneratedValue(generator = "IdentityIdGenerator")
private Long id;
```

等价于：

```java
@Id
@GeneratedValue(strategy = GenerationType.IDENTITY)
private Long id;
```

Jpa 提供的主键生成策略有如下几种：

```java
public class DefaultIdentifierGeneratorFactory
		implements MutableIdentifierGeneratorFactory, Serializable, ServiceRegistryAwareService {

	@SuppressWarnings("deprecation")
	public DefaultIdentifierGeneratorFactory() {
		register( "uuid2", UUIDGenerator.class );
		register( "guid", GUIDGenerator.class );			// can be done with UUIDGenerator + strategy
		register( "uuid", UUIDHexGenerator.class );			// "deprecated" for new use
		register( "uuid.hex", UUIDHexGenerator.class ); 	// uuid.hex is deprecated
		register( "assigned", Assigned.class );
		register( "identity", IdentityGenerator.class );
		register( "select", SelectGenerator.class );
		register( "sequence", SequenceStyleGenerator.class );
		register( "seqhilo", SequenceHiLoGenerator.class );
		register( "increment", IncrementGenerator.class );
		register( "foreign", ForeignGenerator.class );
		register( "sequence-identity", SequenceIdentityGenerator.class );
		register( "enhanced-sequence", SequenceStyleGenerator.class );
		register( "enhanced-table", TableGenerator.class );
	}

	public void register(String strategy, Class generatorClass) {
		LOG.debugf( "Registering IdentifierGenerator strategy [%s] -> [%s]", strategy, generatorClass.getName() );
		final Class previous = generatorStrategyToClassNameMap.put( strategy, generatorClass );
		if ( previous != null ) {
			LOG.debugf( "    - overriding [%s]", previous.getName() );
		}
	}

}
```

### 设置字段类型

`@Column` 声明字段。**示例：**

设置属性 userName 对应的数据库字段名为 user_name，长度为 32，非空

```java
@Column(name = "user_name", nullable = false, length=32)
private String userName;
```

设置字段类型并且加默认值，这个还是挺常用的。

```java
@Column(columnDefinition = "tinyint(1) default 1")
private Boolean enabled;
```

### 指定不持久化特定字段

`@Transient` ：声明不需要与数据库映射的字段，在保存的时候不需要保存进数据库 。

如果想让`secrect` 这个字段不被持久化，可以使用 `@Transient`关键字声明。

```java
@Entity(name="USER")
public class User {

    ......
    @Transient
    private String secrect; // not persistent because of @Transient

}
```

除了 `@Transient`关键字声明， 还可以采用下面几种方法：

```java
static String secrect; // not persistent because of static
final String secrect = “Satish”; // not persistent because of final
transient String secrect; // not persistent because of transient
```

一般使用注解的方式比较多。

### 声明大字段

`@Lob`:声明某个字段为大字段。

```java
@Lob
private String content;
```

更详细的声明：

```java
@Lob
//指定 Lob 类型数据的获取策略， FetchType.EAGER 表示非延迟加载，而 FetchType.LAZY 表示延迟加载；
@Basic(fetch = FetchType.EAGER)
//columnDefinition 属性指定数据表对应的 Lob 字段类型
@Column(name = "content", columnDefinition = "LONGTEXT NOT NULL")
private String content;
```

### 创建枚举类型的字段

可以使用枚举类型的字段，不过枚举字段要用`@Enumerated`注解修饰。

```java
public enum Gender {
    MALE("男性"),
    FEMALE("女性");
    private String value;
    
    Gender(String str){
        value = str;
    }
}

@Entity
@Table(name = "role")
public class Role {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    private String description;
    
    @Enumerated(EnumType.STRING)
    private Gender gender;
    省略getter/setter......
}
```

数据库里面对应存储的是： `MAIL/FEMAIL`。

### 增加审计功能

只要继承了 `AbstractAuditBase`的类都会默认加上下面四个字段。

```java
@Data
@AllArgsConstructor
@NoArgsConstructor
@MappedSuperclass
@EntityListeners(value = AuditingEntityListener.class)
public abstract class AbstractAuditBase {

    @CreatedDate
    @Column(updatable = false)
    @JsonIgnore
    private Instant createdAt;

    @LastModifiedDate
    @JsonIgnore
    private Instant updatedAt;

    @CreatedBy
    @Column(updatable = false)
    @JsonIgnore
    private String createdBy;

    @LastModifiedBy
    @JsonIgnore
    private String updatedBy;
}
```

我们对应的审计功能对应地配置类可能是下面这样的（Spring Security 项目）:

```java
@Configuration
@EnableJpaAuditing
public class AuditSecurityConfiguration {
    @Bean
    AuditorAware<String> auditorAware() {
        return () -> Optional.ofNullable(SecurityContextHolder.getContext())
                .map(SecurityContext::getAuthentication)
                .filter(Authentication::isAuthenticated)
                .map(Authentication::getName);
    }
}
```

简单介绍一下上面设计到的一些注解：

1. `@CreatedDate`: 表示该字段为创建时间时间字段，在这个实体被 insert 的时候，会设置值
2. `@CreatedBy` :表示该字段为创建人，在这个实体被 insert 的时候，会设置值`@LastModifiedDate`、`@LastModifiedBy`同理。
3. `@EnableJpaAuditing`：开启 JPA 审计功能。

### 删除/修改数据

`@Modifying` 注解提示 JPA 该操作是修改操作，注意还要配合`@Transactional`注解使用。

```java
@Repository
public interface UserRepository extends JpaRepository<User, Integer> {

    @Modifying
    @Transactional(rollbackFor = Exception.class)
    void deleteByUserName(String userName);
}
```

### 关联关系

- `@OneToOne` 声明一对一关系
- `@OneToMany` 声明一对多关系
- `@ManyToOne`声明多对一关系
- `MangToMang`声明多对多关系

更多关于 Spring Boot JPA 的文章请看Guide 哥的这篇文章：[一文搞懂如何在 Spring Boot 正确中使用 JPA](https://mp.weixin.qq.com/s?__biz=Mzg2OTA0Njk0OA==&mid=2247485689&idx=1&sn=061b32c2222869932be5631fb0bb5260&chksm=cea24732f9d5ce24a356fb3675170e7843addbfcc79ee267cfdb45c83fc7e90babf0f20d22e1&token=292197051&lang=zh_CN#rd) 。



# 热部署

配置DevTools环境

依赖

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-devtools</artifactId>
    <!--当这个项目被继承之后，这个不向下传递-->
    <optional>true</optional>
</dependency>
```

在plugin中添加devtools工具生效标志

```xml
<plugin>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-devtools</artifactId>
    <configuration>
        <!--如果没有该配置，热部署的devtools不生效-->
        <fork>true</fork>
    </configuration>
</plugin>
```

devtools可以实现页面的热部署，直接在application.yml中配置spring.thymelead.cache=false即可实现。实现类文件如部署（类文件修改后不会立即生效），实现对属性文件的热部署，即devtools会监听classpath下的文件变动，并且会立即重启应用（发生在保存时机）。注意：因为其采用的虚拟机机制，该项重启非常迅速，配置了后再修改Java文件后也就支持了热启动，不过这种方式是属于项目重启，会清空session，也就说需要重新登录。

全局配置文件配置

在application.yml中配置spring.devtools.restart.enable=false，此时restart类加载器还会初始化，但不会监视文件更新。

```yml
spring:
  #热部署配置
  devtools:
    restart:
    enable: true
    #设置重启的目录，填加目录的文件需要restart
    additional=paths: src/main/java
    #解决项目自动重新编译后接口报404的问题
    poll-interval: 3000
    quiet-period: 1000
```

当我们修改了Java类后，IDEA默认是不会自动编译的，而spring-boot-devtools又是监测classpath下的文件发生变化才会重启应用，所以需要设置IDEA的自动编译。

- 自动编译设置：

  `File --> Settings--> Compiler--> Build Project automatically`

- Registry属性修改:

  `ctrl + shift + alt + / `，选择Registry，勾上`Compiler autoMake allow when app running`

# 单元测试

依赖

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-test</artifactId>
</dependency>
```

服务处层测试类示例

```java
@RunWith(SpringRunner.class)
@SpringBootTest(classes = {starter.class})
public class TestUserService{
    private Logger log = LoggerFactory.getLogger(TestUserService.class);
    
    @Resource
    private UserService userService;
    
    @Before
    public void before(){
        log.info("单元测试开始...");
    }
    
    @Test
    public void test01(){
        log.info("用户记录：{}", userService.queryUserById(1).toString());
    }
    
    @Test
    public void test02(){
        log.info("用户记录{}", userService.queryUserByParams(new UserQuery()).toString());
    }
    
    @After
    public void after(){
        log.info("单元测试结束...")
    }
}
```

控制层接口方法测试示例

```java
@RunWith(SpringRunner.class)
@SpringBootTest(classes = {starter.class})
@AutoConfigureMockMVC
public class TestUserController{
    private Logger log = LoggerFactory.getLogger(TestUserController.class);
    
    @AutoWired
    private MockMvc mockMvc;
    
    // 用户列表查询
    @Test
    public void apiTest01() throws Exception{
        // 构建请求
        MockHttpServletRequestBuilder request = MockMvcRequestBuilders.get("/user/list")
            .contentType("text/html")
            .accept(MediaType.APPLICATION_JSON);
        
        // 发送请求，获取请求结果
        ResultAction perform = mockMvc.perform(request);
        // 请求结果校验
        perform.andExpect(MockMvcResultMatchers.status().isOk());
        // 表示执行完成后返回相应的结果
        MvcResult mvcResult = perform.andResult();
        // 得到执行后的响应
        MockHttpServletResponse response = mvcResult.getResponse();
        
        log.info("响应状态 {}", response.getStatus());
        log.info("响应内容 {}", response.getContentAsString());
    }
    
    // 用户名记录查询
    @Test
    public void apiTest02() throws Exception{
        MvcResult mvcResult = mockMvc.perform(MockMvcRequestBukders.get("/user/admin"))
            .andException(mockMvcResultMatchers.status().isOk()).addReturn();
        
        log.info("响应状态 {}", mvcResult.getResponse.getStatus());
        log.info("响应内容 {}", mvcResult.getResponse.getContentAsString());
    }
}
```

## 相关注解

**`@ActiveProfiles`一般作用于测试类上， 用于声明生效的 Spring 配置文件。**

```java
@SpringBootTest(webEnvironment = RANDOM_PORT)
@ActiveProfiles("test")
@Slf4j
public abstract class TestBase {
  ......
}
```

**`@Test`声明一个方法为测试方法**

**`@Transactional`被声明的测试方法的数据会回滚，避免污染测试数据。**

**`@WithMockUser` Spring Security 提供的，用来模拟一个真实用户，并且可以赋予权限。**

```java
@Test
@Transactional
@WithMockUser(username = "user-id-18163138155", authorities = "ROLE_TEACHER")
void should_import_student_success() throws Exception {
    ......
}
```





# 分布式缓存集成和使用

[分布式缓存Ehache/Redis集成和使用]()



# 全局异常与事务管理

## 事务管理

在使用 JDBC 作为数据库访问技术时，Spring Boot框架定义了基于 JDBC 的`PlatformTransactionManager`接口的实现`DataSourceManagerTransactionManager`，并在Spring Boot应用启动时自动进行配置。



Spring Boot 集成了MyBatis框架，MyBatis框架底层是基于JDBC来实现的，所以在Spring Boot环境下对事务进行控制，事务实现由Spring Boot实现并自动配置，在使用时通过注解的方式在相关方法上加入事务控制即可。

声明式事务配置

```java
@Transactional(propagation=Propagation.REQUIRED)
public void saveUser(User user){
    ...
}

@Transactional(propagation=Propagation.REQUIRED)
public void updateUser(User user){
    ...
}

@Transactional(propagation=Propagation.REQUIRED)
public void deleteUser(Integer id){
    ...
}
```

除了JDBC还有多种连接方式

| 数据库访问技术 |             实现             |
| :------------: | :--------------------------: |
|      JDBC      | DataSourceTransactionManager |
|      JPA       |    JpaTransactionManager     |
|   Hibernate    | HibernateTransactionManager  |
|      JDO       |    JdoTransactionManager     |
|   分布式事务   |    JtaTransactionManager     |

## 相关注解

在要开启事务的服务层方法上使用`@Transactional`注解

```java
@Transactional(rollbackFor = Exception.class)
public void save() {
  ......
}
```

Exception 分为运行时异常 RuntimeException 和非运行时异常。在`@Transactional`注解中如果不配置`rollbackFor`属性，那么事务只会在遇到`RuntimeException`的时候才会回滚，加上`rollbackFor=Exception.class`，可以让事务在遇到非运行时异常时也回滚。

**`@Transactional` 注解一般用在可以作用在`类`或者`方法`上。**

- **作用于类**：当把`@Transactional` 注解放在类上时，表示所有该类的`public`方法都配置相同的事务属性信息。
- **作用于方法**：当类配置了`@Transactional`，方法也配置了`@Transactional`，方法的事务会覆盖类的事务配置信息。

更多关于关于 Spring 事务的内容可查看：

1. [可能是最漂亮的 Spring 事务管理详解](https://mp.weixin.qq.com/s?__biz=Mzg2OTA0Njk0OA==&mid=2247484943&idx=1&sn=46b9082af4ec223137df7d1c8303ca24&chksm=cea249c4f9d5c0d2b8212a17252cbfb74e5fbe5488b76d829827421c53332326d1ec360f5d63&token=1082669959&lang=zh_CN#rd)
2. [一口气说出 6 种 @Transactional 注解失效场景](https://mp.weixin.qq.com/s?__biz=Mzg2OTA0Njk0OA==&mid=2247486483&idx=2&sn=77be488e206186803531ea5d7164ec53&chksm=cea243d8f9d5cacecaa5c5daae4cde4c697b9b5b21f96dfc6cce428cfcb62b88b3970c26b9c2&token=816772476&lang=zh_CN#rd)





## 全局异常

1. `@ControllerAdvice` ：注解定义全局异常处理的切面类，该注解组合了`@Component`注解功能，约定了几种可行的返回值，如果是直接返回model类型的话，需要使用`@ResponseBody`进行 json 转换。
2. `@ExceptionHandler` ：注解声明异常处理方法。在处理异常时标注在方法级别，代表当前方法处理的异常类型有哪些。

例子：如果方法参数不对的话就会抛出`MethodArgumentNotValidException`，我们来处理这个异常。

```java
@ControllerAdvice
@ResponseBody
public class GlobalExceptionHandler {

    /**
     * 请求参数异常处理
     */
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<?> handleMethodArgumentNotValidException(MethodArgumentNotValidException ex, HttpServletRequest request) {
       ......
    }
}
```

更多关于 Spring Boot 异常处理的内容，请看我的这两篇文章：

1. [SpringBoot 处理异常的几种常见姿势](https://mp.weixin.qq.com/s?__biz=Mzg2OTA0Njk0OA==&mid=2247485568&idx=2&sn=c5ba880fd0c5d82e39531fa42cb036ac&chksm=cea2474bf9d5ce5dcbc6a5f6580198fdce4bc92ef577579183a729cb5d1430e4994720d59b34&token=2133161636&lang=zh_CN#rd)
2. [使用枚举简单封装一个优雅的 Spring Boot 全局异常处理！](https://mp.weixin.qq.com/s?__biz=Mzg2OTA0Njk0OA==&mid=2247486379&idx=2&sn=48c29ae65b3ed874749f0803f0e4d90e&chksm=cea24460f9d5cd769ed53ad7e17c97a7963a89f5350e370be633db0ae8d783c3a3dbd58c70f8&token=1054498516&lang=zh_CN#rd)

# 参数校验

**数据的校验的重要性就不用说了，即使在前端对数据进行校验的情况下，我们还是要对传入后端的数据再进行一遍校验，避免用户绕过浏览器直接通过一些 HTTP 工具直接向后端请求一些违法数据。**

**JSR(Java Specification Requests）** 是一套 JavaBean 参数校验的标准，它定义了很多常用的校验注解，我们可以直接将这些注解加在我们 JavaBean 的属性上面，这样就可以在需要校验的时候进行校验了，非常方便！

校验的时候我们实际用的是 **Hibernate Validator** 框架。Hibernate Validator 是 Hibernate 团队最初的数据校验框架，Hibernate Validator 4.x 是 Bean Validation 1.0（JSR 303）的参考实现，Hibernate Validator 5.x 是 Bean Validation 1.1（JSR 349）的参考实现，目前最新版的 Hibernate Validator 6.x 是 Bean Validation 2.0（JSR 380）的参考实现。

Spring Validation 依赖在引入`spring-boot-starter-validation`时会自动引入。非 SpringBoot 项目需要自行引入相关依赖包，这里不多做讲解，具体可以查看我的这篇文章：《[如何在 Spring/Spring Boot 中做参数校验？你需要了解的都在这里！](https://mp.weixin.qq.com/s?__biz=Mzg2OTA0Njk0OA==&mid=2247485783&idx=1&sn=a407f3b75efa17c643407daa7fb2acd6&chksm=cea2469cf9d5cf8afbcd0a8a1c9cc4294d6805b8e01bee6f76bb2884c5bc15478e91459def49&token=292197051&lang=zh_CN#rd)》。

👉 需要注意的是： **所有的注解，推荐使用 JSR 注解，即`javax.validation.constraints`，而不是`org.hibernate.validator.constraints`**

## 一些常用的字段验证的注解

- `@NotEmpty` 被注释的字符串的不能为 null 也不能为空，且长度必须大于0
- `@NotBlank` 被注释的字符串非 null，并且必须包含一个非空白字符
- `@Null` 被注释的元素必须为 null
- `@NotNull` 被注释的元素必须不为 null，可以为空字符串。
- `@AssertTrue` 被注释的元素必须为 true
- `@AssertFalse` 被注释的元素必须为 false
- `@Pattern(regex=,flag=)`被注释的元素必须符合指定的正则表达式
- `@Email` 被注释的元素必须是 Email 格式。
- `@Min(value)`被注释的元素必须是一个数字，其值必须大于等于指定的最小值
- `@Max(value)`被注释的元素必须是一个数字，其值必须小于等于指定的最大值
- `@DecimalMin(value)`被注释的元素必须是一个数字，其值必须大于等于指定的最小值
- `@DecimalMax(value)` 被注释的元素必须是一个数字，其值必须小于等于指定的最大值
- `@Size(max=, min=)`被注释的元素的大小必须在指定的范围内
- `@Digits (integer, fraction)`被注释的元素必须是一个数字，其值必须在可接受的范围内
- `@Past`被注释的元素必须是一个过去的日期
- `@Future` 被注释的元素必须是一个将来的日期
- `@Valid` 去验证注解对象中的每个属性是否符合要求，不符合时返回`MethodArgumentNotValidException`
- ......

## 验证请求体(RequestBody)

```java
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Person {

    @NotNull(message = "classId 不能为空")
    private String classId;

    @Size(max = 33)
    @NotNull(message = "name 不能为空")
    private String name;

    @Pattern(regexp = "((^Man$|^Woman$|^UGM$))", message = "sex 值不在可选范围")
    @NotNull(message = "sex 不能为空")
    private String sex;

    @Email(message = "email 格式不正确")
    @NotNull(message = "email 不能为空")
    private String email;

}
```

我们在需要验证的参数上加上了`@Valid`注解，如果验证失败，它将抛出`MethodArgumentNotValidException`。

```java
@RestController
@RequestMapping("/api")
public class PersonController {

    @PostMapping("/person")
    public ResponseEntity<Person> getPerson(@RequestBody @Valid Person person) {
        return ResponseEntity.ok().body(person);
    }
}
```

## 验证请求参数(Path Variables 和 Request Parameters)

**一定一定不要忘记在类上加上 `Validated` 注解了，这个注解告诉 Spring 去校验方法参数。**

```java
@RestController
@RequestMapping("/api")
@Validated
public class PersonController {

    @GetMapping("/person/{id}")
    public ResponseEntity<Integer> getPersonByID(@Valid @PathVariable("id") @Max(value = 5,message = "超过 id 的范围了") Integer id) {
        return ResponseEntity.ok().body(id);
    }
}
```







#  Restful API

http请求接口：`https://localhost:8080/boot/order?id=1021&status=1`

restful风格接口：`https://localhost:8080/boot/order/1021/1`

一个重要注解：`@PathVariable`用来获取 url 中的值

**RESTful API具体设计如下：**

| 请求类型 | URL       | 功能说明           |
| -------- | --------- | ------------------ |
| GET      | /users    | 查询用户列表       |
| POST     | /users    | 创建一个用户       |
| GET      | /users/id | 根据id查询一个用户 |
| PUT      | /users/id | 根据id更新一个用户 |
| DELETE   | /users/id | 根据id删除一个用户 |

**实例：**

```java
@RestController
@RequestMapping("/users")
public class UserController {

    // 创建线程安全的Map，模拟users信息的存储
    static Map<Long, User> users = Collections.synchronizedMap(new HashMap<Long, User>());

    /**
     * 处理"/users/"的GET请求，用来获取用户列表
     *
     * @return
     */
    @GetMapping("/")
    public List<User> getUserList() {
        // 还可以通过@RequestParam从页面中传递参数来进行查询条件或者翻页信息的传递
        List<User> r = new ArrayList<User>(users.values());
        return r;
    }

    /**
     * 处理"/users/"的POST请求，用来创建User
     *
     * @param user
     * @return
     */
    @PostMapping("/")
    public String postUser(@RequestBody User user) {
        // @RequestBody注解用来绑定通过http请求中application/json类型上传的数据
        users.put(user.getId(), user);
        return "success";
    }

    /**
     * 处理"/users/{id}"的GET请求，用来获取url中id值的User信息
     *
     * @param id
     * @return
     */
    @GetMapping("/{id}")
    public User getUser(@PathVariable Long id) {
        // url中的id可通过@PathVariable绑定到函数的参数中
        return users.get(id);
    }

    /**
     * 处理"/users/{id}"的PUT请求，用来更新User信息
     *
     * @param id
     * @param user
     * @return
     */
    @PutMapping("/{id}")
    public String putUser(@PathVariable Long id, @RequestBody User user) {
        User u = users.get(id);
        u.setName(user.getName());
        u.setAge(user.getAge());
        users.put(id, u);
        return "success";
    }

    /**
     * 处理"/users/{id}"的DELETE请求，用来删除User
     *
     * @param id
     * @return
     */
    @DeleteMapping("/{id}")
    public String deleteUser(@PathVariable Long id) {
        users.remove(id);
        return "success";
    }

}
```

这里使用了更细化的`@GetMapping`、`@PostMapping`等系列注解替换了以前的`@RequestMaping`注解；另外还使用了`@RequestBody`替换了`@ModelAttribute`的参数绑定。

# 参考

>[SpringBoot官方文档](https://docs.spring.io/spring-boot/docs/current/reference/htmlsingle/)
>
>[Spring boot 入门篇——纯洁的微笑](https://www.cnblogs.com/ityouknow/p/5662753.html)
>
>[SpringBoot从入门到高级](https://www.jianshu.com/p/8e3de55d4373)
>
>**JPA：**
>
>https://blog.csdn.net/qq_32534441/category_8563056.html
>
>https://blog.csdn.net/qq_32534441/article/list/6
>
>http://www.itsoku.com/
>
>https://www.itmanbu.com/
>
>https://www.itmanbu.com/springboot%E4%B8%AD%E7%94%A8crudrepository%E7%AE%80%E5%8C%96mysql%E6%9F%A5%E8%AF%A2.html
>
>**Restful API：**
>
>https://blog.csdn.net/weixin_47324424/article/details/107050056
>
>https://www.baidu.com/s?ie=utf-8&f=8&rsv_bp=1&rsv_idx=2&tn=baiduhome_pg&wd=mybatis%E5%88%86%E9%A1%B5%E6%9F%A5%E8%AF%A2&rsv_spt=1&oq=mybatis%25E6%25A8%25A1%25E7%25B3%258A%25E6%259F%25A5%25E8%25AF%25A2&rsv_pq=b88176f70006cbb6&rsv_t=8bd9TimI77E%2BphdSOcUOZrGhPa11O3dvG%2Fp2H%2FkVgXAOC4xlyX26zYJhg%2FkI4ous2%2Fe2&rqlang=cn&rsv_dl=tb&rsv_enter=1&rsv_btype=t&inputT=4747&rsv_sug3=48&rsv_sug1=1&rsv_sug7=100&rsv_sug2=0&rsv_sug4=5849
>
>https://www.cnblogs.com/97guoxiang/p/12770022.html
>
>https://blog.csdn.net/zhenwei1994/article/details/81876278
>
>https://blog.csdn.net/zhenwei1994/article/details/81913531
>
>https://www.cnblogs.com/parable/p/11225717.html