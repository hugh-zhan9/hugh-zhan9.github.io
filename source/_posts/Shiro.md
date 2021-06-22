---
title: Shiro
tags: [Shiro, Java]
categories: Java
date: 2021-01-04 19:35:29


---



![](https://i.loli.net/2021/01/04/6487t3EMBAm5svY.png)

<!--more-->

# 权限管理

**什么是权限管理**

基本上涉及到用户参与的系统都要进行权限管理，权限管理属于系统安全的范畴，权限管理实现对用户访问系统的控制，按照安全规则或者安全策略控制用户可以访问而且只能访问自己被授权的资源。

**权限管理包括用户身份认证和授权两部分，简称认证授权**，对于需要访问控制的资源用户首先经过身份认证，认证通过后用户具有该资源的访问权限方可访问。

**什么是身份认证**

身份认证就是判断一个用户是否为合法用户的处理过程，最常用的简单身份认证方式就是系统通过核对用户输入的用户名和口令，看是否与系统中存储的该用户的用户名和口令一致，来判断用户身份是否正确。

**什么是授权**

授权，即访问控制，控制谁能访问哪些资源。主体进行身份认证后需要分配权限方可访问系统的资源，对于某些资源没有权限是无法访问的。

# Shiro 核心架构

Shiro 是一个功能强大且易于使用的Java安全框架，它执行身份验证、授权、加密和会话管理。使用 Shiro 易于理解的API，可以快速轻松地保护任何应用程序——从小的移动应用程序到大的Web和企业应用程序。

![](https://i.loli.net/2020/12/31/uTCA8yE6mWjgXiQ.png)

## Shiro中的八大概念

**Subject** 即主体，外部应用与subject进行交互，subject记录了当前操作用户，将用户的概念理解为当前操作的主体，主体可能是通过浏览器发起请求的用户，也可能是一个运行的程序。Subject在Shiro中是一个接口，接口中定义了很多认证授权相关的方法，外部应用通过subject进行认证授权，而Subject 通过 SecurityManager安全管理器进行认证授权。

**SecurityManager** 即安全管理器，是Shiro的核心，负责对所有的subject进行安全管理。通过SecurityManager可以完成对subject的认证、授权等操作。

**Authenticator** 即认证器，对用户身份进行认证。Authenticator是一个接口，Shiro提供`ModularRealmAuthenticator`实现类，通过`ModularRealmAuthenticator`基本上可以满足大多数需求，可以自定义认证器。

**Realm** 用于进行权限信息的验证，需要我们自己实现。本质上是一个特定的DAO，它封装了个与数据库连接的实现，相当于datasource数据源。SecurityManager进行安全认证需要通过Realm获取用户权限数据，比如：如果用户身份数据在数据库那么Realm就需要从数据库获取用户身份信息。

- 注意：不要把Realm理解成只是从数据源获取数据，在Realm中还有认证授权校验相关的代码

**SessionManager** 即会话管理，Shiro框架定义了一套会话管理，它不依赖Web容器，所以Shiro可以使用在非Web应用上，也可以将分布式应用的会话集中在一点管理，此特性可以使它实现单点登录。

**SeesionDao** 即会话Dao，是对Session会话操作的一套接口，比如要将session存储到数据库，可以通过jdbc将会话存储到数据库。

**CachManager** 缓存管理，将用户数据存储在缓存，提高性能，减轻数据库压力

**Cryptography** 密码管理，Shiro提供了一套加密/解密组件，方便开发。比如通常提供的散列、加/解密等功能。

# Shiro中的认证和授权

## 认证

**认证中的关键对象**

subject：主体，访问系统的用户、主体可以是用户、程序等，进行认证的都称为主体。

principal：身份信息，是主体进行身份认证的标识，标识必须具有唯一性，如用户名、手机号、邮箱地址等，一个主体可以有多个身份，但必须只有一个主身份（primary Principal）。

credential：凭证信息，是只有主体自己知道的安全信息，如密码、证书等。

### 认证流程



![](https://i.loli.net/2021/01/04/QJFtXmxaZI5jns9.png)

### 示例

创建一个简单的Maven项目，引入Shiro的依赖

```xml
<dependency>
    <groupId>org.apache.shiro</groupId>
    <artifactId>shiro-core</artifactId>
    <version>1.5.3</version>
</dependency>
```

Shiro提供了一种配置文件的方式来做权限控制，实际生产中基本上不会使用。可以用来测试一下Shiro的原理。在项目的`resources`目录下创建配置文件`shiro.ini`，内容如下：

```ini
[user]
zhangsan=123456
lisi=123456789
```

测试例

```java
import org.apache.shiro.SecurityUtils;
import org.apache.shiro.authc.IncorrectCredentialsException;
import org.apache.shiro.authc.UnknownAccountException;
import org.apache.shiro.authc.UsernamePasswordToken;
import org.apache.shiro.mgt.DefaultSecurityManager;
import org.apache.shiro.realm.text.IniRealm;
import org.apache.shiro.subject.Subject;

/**
 * Created by hugh on 2020/12/31 10:38
 */
public class TestAuthenticator{
    public static void main(String[] args) {
        // 创建安全管理器
        DefaultSecurityManager securityManager = new DefaultSecurityManager();

        // 给安全管理器设置Realm
        securityManager.setRealm(new IniRealm("classpath:shiro.ini"));

        // 全局工具类SecurityUtils设置安全管理器
        SecurityUtils.setSecurityManager(securityManager);
        // 关键对象 subject 主体
        Subject subject = SecurityUtils.getSubject();
        // 创建令牌
        UsernamePasswordToken token = new UsernamePasswordToken("zhangsan","123456");
        
        // 进行用户认证
        try{
            subject.login(token);
            System.out.println("认证状态："+subject.isAuthenticated());
        }catch (UnknownAccountException e){
            e.printStackTrace();
            System.out.println("认证失败，用户名不存在");
        }catch(IncorrectCredentialsException e){
            e.printStackTrace();
            System.out.println("认证失败，用户密码错误");
        }
    }
}

```



### 实际处理流程

断点调试可以发现：

最终用户名比较实际上是由 `simpleAccountRealm`类的`doGetAuthenticationInfo`方法中完成的，最终密码校验是在`AuthenticatingRealm`类的`assertCredentialsMath`方法中自动完成的。



自定义Realm，在真实的应用场景中用户的数据和密码一般是从数据库中查询的得到而不是存储在`ini`配置文件中，所以就需要我们自己去实现一个Realm重写`doGetAuthorizationInfo`和`doGetAuthenticationInfo`方法

```java
import org.apache.shiro.authc.AuthenticationException;
import org.apache.shiro.authc.AuthenticationInfo;
import org.apache.shiro.authc.AuthenticationToken;
import org.apache.shiro.authc.SimpleAuthenticationInfo;
import org.apache.shiro.authz.AuthorizationInfo;
import org.apache.shiro.realm.AuthorizingRealm;
import org.apache.shiro.subject.PrincipalCollection;

/**
 * 自定义Realm实现，将认证、授权数据的来源转化为数据库的实现
 *
 * Created by hugh on 2020/12/31 11:37
 */
public class CustomerRealm extends AuthorizingRealm {
    // 授权
    @Override
    protected AuthorizationInfo doGetAuthorizationInfo(PrincipalCollection principalCollection) {
        return null;
    }

    // 认证
    @Override
    protected AuthenticationInfo doGetAuthenticationInfo(AuthenticationToken authenticationToken) throws AuthenticationException {
        // 获取用户名
        String principal = (String) authenticationToken.getPrincipal();
        // 根据用户名去查询数据库验证，这里先模拟查询
        if("zhangsan".equals(principal)){
            // 参数1：返回数据库中正确的用户名 参数2：返回数据库中正确密码 参数3：提供当前realm名称
            SimpleAuthenticationInfo simpleAuthenticationInfo = new SimpleAuthenticationInfo("zhangsan","123456",this.getName());
            return simpleAuthenticationInfo;
        }
        return null;
    }
}
```

测试方法中使用自定义的Realm

```java
import com.hugh.quick.realm.CustomerRealm;
import org.apache.shiro.SecurityUtils;
import org.apache.shiro.authc.IncorrectCredentialsException;
import org.apache.shiro.authc.UnknownAccountException;
import org.apache.shiro.authc.UsernamePasswordToken;
import org.apache.shiro.mgt.DefaultSecurityManager;
import org.apache.shiro.subject.Subject;

/**
 * 测试自定义Realm的实现
 *
 * Created by hugh on 2020/12/31 11:52
 */
public class TestCustomerRealm {
    public static void main(String[] args) {
        DefaultSecurityManager securityManager = new DefaultSecurityManager();
        securityManager.setRealm(new CustomerRealm());
        SecurityUtils.setSecurityManager(securityManager);
        Subject subject = SecurityUtils.getSubject();
        UsernamePasswordToken token = new UsernamePasswordToken("zhangsan","123456");
        try{
            subject.login(token);
            System.out.println("认证状态："+subject.isAuthenticated());
        }catch (UnknownAccountException e){
            e.printStackTrace();
            System.out.println("认证失败，用户名不存在");
        }catch(IncorrectCredentialsException e){
            e.printStackTrace();
            System.out.println("认证失败，用户密码错误");
        }
    }
}
```

## 加密

在实际项目中我们的密码不会使用明文存储在数据库中，需要都密码进行加密和加盐，甚至散列，Shiro提供了很多加密的方式。

**采用MD5算法、加盐、散列进行认证**

使用shiro中提供的MD5算法进行加密

```java
import org.apache.shiro.crypto.hash.Md5Hash;

public class TestMD5 {
    public static void main(String[] args) {
        // 不推荐使用，这种方式并没进行加密
        Md5Hash md5 = new Md5Hash();
        md5.setBytes("19961220".getBytes());
        System.out.println(md5.toHex());

        // 推荐使用的方式：通过构造方法赋值进行加密
        Md5Hash md5Hash = new Md5Hash("19961220zyk.");
        System.out.println(md5Hash.toHex());

        // 使用MD5加盐处理，一般加的盐使用随机生成并和数据一起存入数据库
        Md5Hash md5HashSalt = new Md5Hash("19961220","zyk.");
        System.out.println(md5HashSalt.toHex());

        // 使用hash散列，第三个参数表示进行散列的次数,一般使用1024的倍数
        Md5Hash md5HashSalt1 = new Md5Hash("19961220","zyk.",1024);
        System.out.println(md5HashSalt1);
    }
}

```

进行认证

```java
import org.apache.shiro.authc.AuthenticationException;
import org.apache.shiro.authc.AuthenticationInfo;
import org.apache.shiro.authc.AuthenticationToken;
import org.apache.shiro.authc.SimpleAuthenticationInfo;
import org.apache.shiro.authz.AuthorizationInfo;
import org.apache.shiro.realm.AuthorizingRealm;
import org.apache.shiro.subject.PrincipalCollection;
import org.apache.shiro.util.ByteSource;

/**
 * 自定义Realm实现MD5加盐，将认证、授权数据的来源转化为数据库的实现
 *
 * Created by hugh on 2020/12/31 11:37
 */
public class CustomerMD5Realm extends AuthorizingRealm {
    @Override
    protected AuthorizationInfo doGetAuthorizationInfo(PrincipalCollection principalCollection) {
        return null;
    }

    @Override
    protected AuthenticationInfo doGetAuthenticationInfo(AuthenticationToken authenticationToken) throws AuthenticationException {
        String principal = (String) authenticationToken.getPrincipal();
        if("zhangsan".equals(principal)){
            // 参数1：返回数据库中正确的用户名 参数2：返回数据库中正确密码 参数3：提供当前realm名称
            // SimpleAuthenticationInfo simpleAuthenticationInfo = new SimpleAuthenticationInfo("zhangsan","89f64208bfa52aa4da900aaeb906438c", this.getName());
            // 使用加盐处理，参数3表示加入的盐：ByteSource.Util.bytes("zyk.")来表示盐的内容
            SimpleAuthenticationInfo simpleAuthenticationInfo = new SimpleAuthenticationInfo("zhangsan","d059de448d8737b2f66106170e866663", ByteSource.Util.bytes("zyk."),this.getName());
            return simpleAuthenticationInfo;
        }
        return null;
    }
}
```

测试一下

```java
import com.hugh.quick.realm.CustomerMD5Realm;
import org.apache.shiro.SecurityUtils;
import org.apache.shiro.authc.IncorrectCredentialsException;
import org.apache.shiro.authc.UnknownAccountException;
import org.apache.shiro.authc.UsernamePasswordToken;
import org.apache.shiro.authc.credential.HashedCredentialsMatcher;
import org.apache.shiro.mgt.DefaultSecurityManager;
import org.apache.shiro.subject.Subject;

/**
 * 测试加盐的方式
 *
 * Created by hugh on 2020/12/31
 */
public class TestCustomerMD5Realm {
    public static void main(String[] args) {
        DefaultSecurityManager securityManager = new DefaultSecurityManager();

        // 使用md5算法进行解密
        CustomerMD5Realm realm = new CustomerMD5Realm();
        HashedCredentialsMatcher credentialsMatcher = new HashedCredentialsMatcher();
        // 使用的算法
        credentialsMatcher.setHashAlgorithmName("md5");
        // 散列的次数
        credentialsMatcher.setHashIterations(1024);
        // 设置realm使用hash凭证匹配器
        realm.setCredentialsMatcher(credentialsMatcher);

        securityManager.setRealm(realm);
        // 设置全局工具类的securityManager
        SecurityUtils.setSecurityManager(securityManager);
        // 通过全局工具类获取认证主体
        Subject subject = SecurityUtils.getSubject();
        
        UsernamePasswordToken token = new UsernamePasswordToken("zhangsan","19961220");
        try{
            subject.login(token);
            System.out.println("认证状态："+subject.isAuthenticated());
        }catch (UnknownAccountException e){
            e.printStackTrace();
            System.out.println("认证失败，用户名不存在");
        }catch(IncorrectCredentialsException e){
            e.printStackTrace();
            System.out.println("认证失败，用户密码错误");
        }
    }
}
```







## 授权

授权可以简单的理解为 who 对 what(which) 进行 how 授权

who：即主体Subject，主体需要访问系统中的资源

what：即资源Resource，如系统菜单、页面、按钮、类方法、系统商品信息等。资源包括**资源类型**和**资源实例**，比如商品信息为资源类型，类型为t01的商品为资源实例，编号为001的商品信息也属于资源实例。

How：权限/许可（Permission），规定了主体对资源的操作许可，权限离开资源没有意义，如用户查询权限，用户添加权限、某个类方法的调用权限，编号为001的用户的修改权限等，通过权限可知主体对哪些资源都有哪些操作许可。

### 授权流程

![](https://i.loli.net/2020/12/31/dTc8JiVI6g2OXqx.png)



上图就是整个认证和授权流程

### 授权方式

-  基于角色的访问控制

  RBAC(Role-Based Access Controller)，以角色为中心进行访问控制

  ```java
  if(subject.hasRole("admin")){
  	// 操作什么样的资源
  }
  ```

- 基于资源的访问控制

  RBAC(Resource-Based Access Controller)，以资源(权限)为中心进行访问控制

  ```java
  if(subject.isPermission("user:create:*")){  // 资源实例
  	// 对用户模块的所有资源具有创建权限
  }
  if(subject.isPermission("user:*:01")){  // 资源类型
  	// 对于用户模块下的01号用户具有所有权限
  }
  ```

**权限字符串**

权限字符串的规则是：`资源标识符：操作：资源实例标识符`。意思是对哪个资源的哪个实例具有什么操作，`:`是资源/操作/实例的分隔符，权限字符串也可以使用通配符`*`。

例子：

用户创建权限：`user:create`或`user:create:*`

用户修改实例001的权限：`user:update:001`

用户实例001的所有权限：`user:*:001`

### 授权实现方式

代码式

```java
Subject subject = SecurityUtils.getSubject();
if(subject.hasRole("admin")){
    // 有权限
}else{
    // 没有权限
}
```

注解式

```java
@RequiresRoles("admin")
public void hello(){
    // 有权限
}
```

标签式

```xml
<!--JSP 标签-->
<shiro:hasRole name="admin">
    // 有权限
</shiro:hasRole>
注意：Thymeleaf中Shiro需要额外集成
```



### 授权示例

Realm

```java
import org.apache.shiro.authc.AuthenticationException;
import org.apache.shiro.authc.AuthenticationInfo;
import org.apache.shiro.authc.AuthenticationToken;
import org.apache.shiro.authc.SimpleAuthenticationInfo;
import org.apache.shiro.authz.AuthorizationInfo;
import org.apache.shiro.authz.SimpleAuthorizationInfo;
import org.apache.shiro.realm.AuthorizingRealm;
import org.apache.shiro.subject.PrincipalCollection;
import org.apache.shiro.util.ByteSource;

import java.util.ArrayList;
import java.util.Collection;

/**
 * 自定义Realm实现MD5加盐，将认证、授权数据的来源转化为数据库的实现
 *
 * Created by hugh on 2020/12/31 11:37
 */
public class CustomerMD5Realm extends AuthorizingRealm {
    @Override
    protected AuthorizationInfo doGetAuthorizationInfo(PrincipalCollection principalCollection) {
        ArrayList<String> arrayList = new ArrayList();
        arrayList.add("admin");
        arrayList.add("user");

        String principal = (String) principalCollection.getPrimaryPrincipal();
        System.out.println("进入到权限验证阶段========"+ principal);
        // 可以看到，每次进行权限验证都要执行这个方法，所以一旦大量验证就要耗费大量资源
        SimpleAuthorizationInfo authorizationInfo = new SimpleAuthorizationInfo();
        authorizationInfo.addRole("admin");
        authorizationInfo.addRoles(arrayList);

        authorizationInfo.addStringPermission("user:create:01");
        authorizationInfo.addStringPermission("user:update:01");
        return authorizationInfo;
    }

    @Override
    protected AuthenticationInfo doGetAuthenticationInfo(AuthenticationToken authenticationToken) throws AuthenticationException {
        String principal = (String) authenticationToken.getPrincipal();
        if("zhangsan".equals(principal)){
            SimpleAuthenticationInfo simpleAuthenticationInfo = new SimpleAuthenticationInfo("zhangsan","d059de448d8737b2f66106170e866663", ByteSource.Util.bytes("zyk."),this.getName());
            return simpleAuthenticationInfo;
        }
        return null;
    }
}
```

测试：

```java
import com.hugh.quick.realm.CustomerMD5Realm;
import org.apache.shiro.SecurityUtils;
import org.apache.shiro.authc.IncorrectCredentialsException;
import org.apache.shiro.authc.UnknownAccountException;
import org.apache.shiro.authc.UsernamePasswordToken;
import org.apache.shiro.authc.credential.HashedCredentialsMatcher;
import org.apache.shiro.mgt.DefaultSecurityManager;
import org.apache.shiro.subject.Subject;
import java.util.Arrays;

/**
 * Created by hugh on 2020/12/31
 */
public class TestAuthorization {
    public static void main(String[] args) {
        DefaultSecurityManager securityManager = new DefaultSecurityManager();
        CustomerMD5Realm realm = new CustomerMD5Realm();
        HashedCredentialsMatcher credentialsMatcher = new HashedCredentialsMatcher();
        credentialsMatcher.setHashAlgorithmName("MD5");
        credentialsMatcher.setHashIterations(1024);
        realm.setCredentialsMatcher(credentialsMatcher);
        securityManager.setRealm(realm);

        SecurityUtils.setSecurityManager(securityManager);
        Subject subject = SecurityUtils.getSubject();
        UsernamePasswordToken token = new UsernamePasswordToken("zhangsan","19961220");
        try{
            subject.login(token);
            System.out.println("认证状态："+subject.isAuthenticated());
        }catch (UnknownAccountException e){
            e.printStackTrace();
            System.out.println("认证失败，用户名不存在");
        }catch(IncorrectCredentialsException e){
            e.printStackTrace();
            System.out.println("认证失败，用户密码错误");
        }

        if(subject.isAuthenticated()){
            System.out.println("========================基于角色权限进行访问控制===============================");
            // 基于角色权限验证
            System.out.println(subject.hasRole("admin"));
            System.out.println(subject.hasRole("user"));
            // 基于多角色权限验证
            System.out.println(subject.hasAllRoles(Arrays.asList("admin","user")));
            // 是否具有其中一个角色
            boolean[] booleans = subject.hasRoles(Arrays.asList("admin","user"));
            for (boolean b : booleans){
                System.out.println(b);
            }

            System.out.println("========================基于权限字符串进行访问控制===============================");

            // 基于权限字符串进行访问控制
            System.out.println(subject.isPermitted("user:*:*"));
            boolean[] permittedBooleans = subject.isPermitted("user:create:01","user:update:01");
            for (boolean b: permittedBooleans){
                System.out.println(b);
            }
            System.out.println(subject.isPermittedAll("user:create:01", "user:update:01"));
        }

    }
}
```

# Shiro 整合Spring Boot

> 简易项目地址：https://github.com/hugh-zhan9/learn-Shiro



## 整合思路

![](https://i.loli.net/2020/12/31/8NSLuU4skKzeCGW.png)

**依赖**

```xml
<dependency>
    <groupId>org.apache.shiro</groupId>
    <artifactId>shiro-spring-boot-starter</artifactId>
    <version>1.5.3</version>
</dependency>
```



## 配置 Shiro 环境

创建Shiro配置类

```java
import com.hugh.springboot_shiro_thymeleaf.realm.CustomerMD5Realm;
import org.apache.shiro.mgt.DefaultSecurityManager;
import org.apache.shiro.realm.Realm;
import org.apache.shiro.spring.web.ShiroFilterFactoryBean;
import org.apache.shiro.web.mgt.DefaultWebSecurityManager;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.HashMap;
import java.util.Map;

/**
 * Created by hugh on 2020/12/31
 */
@Configuration
public class ShiroConfig {

    // 创建ShiroFilter
    @Bean
    public ShiroFilterFactoryBean getShiroFilterFactoryBean(DefaultSecurityManager defaultSecurityManager){
        ShiroFilterFactoryBean shiroFilterFactoryBean = new ShiroFilterFactoryBean();
        // 给filter设置安全管理器
        shiroFilterFactoryBean.setSecurityManager(defaultSecurityManager);
        // 配置受限资源和公共资源
        Map<String,String> map = new HashMap<>();
        map.put("/index.jsp","authc"); //authc:一个过滤器，表示需要认证和授权
        // 默认认证界面路径
        shiroFilterFactoryBean.setLoginUrl("/login.jsp");
        shiroFilterFactoryBean.setFilterChainDefinitionMap(map);
        return shiroFilterFactoryBean;
    }
    // 创建安全管理器
    @Bean
    public DefaultSecurityManager getDefaultSecurityManager(Realm realm){
        DefaultSecurityManager defaultSecurityManager = new DefaultWebSecurityManager();
        // 给安全管理器设置realm
        defaultSecurityManager.setRealm(realm);
        return defaultSecurityManager;
    }

    // 创建自定义 realm
    @Bean("realm")
    public Realm getRealm(){
        CustomerMD5Realm customerMD5Realm = new CustomerMD5Realm();
        return customerMD5Realm;
    }
}
```

## 常见过滤器

| 配置缩写          | 对应的过滤器                    | 功能                                                         |
| ----------------- | ------------------------------- | ------------------------------------------------------------ |
| anon              | AnonymousFilter                 | 指定url可以匿名访问                                          |
| authc             | FormAuthenticationFilter        | 指定url需要form表单登录，默认会从请求中获取username，password，rememberMe等参数并尝试登录。如果登陆不了就会跳转到loginUrl配置的路径。 |
| authcBasic        | BasicHttpAuthenticationFilter   | 指定url需要basic登录                                         |
| logout            | LogoutFilter                    | 登出过滤器，配置指定url就可以实现退出功能，非常方便          |
| noSessionCreation | NoSessionCreationFilter         | 禁止创建会话                                                 |
| perms             | PermissionsAuthorizzationFilter | 需要指定权限才能访问                                         |
| port              | PortFilter                      | 需要指定端口才能访问                                         |
| rest              | HttpMethodPermissionFilter      | 将http请求方法转化成相应的多次来构造一个权限字符串           |
| roles             | RolesAuthorizationFilteer       | 需要指定角色才能访问                                         |
| ssl               | SslFilter                       | 需要https请求才能访问                                        |
| user              | UserFilter                      | 需要已登录或“记住我”的用户才能访问                           |



## 使用缓存减轻数据库压力

### 使用 Ehcache 实现缓存

**引入依赖**

```xml
<dependency>
    <groupId>org.apache.shiro</groupId>
    <artifactId>shiro-ehcache</artifactId>
    <version>1.5.3</version>
</dependency>
```

**开启缓存**

```java
@Bean("realm")
    public Realm getRealm(){
        CustomerMD5Realm customerMD5Realm = new CustomerMD5Realm();
        // 修改凭证校验匹配器和Hash散列次数
        HashedCredentialsMatcher credentialsMatcher = new HashedCredentialsMatcher();
        credentialsMatcher.setHashAlgorithmName("MD5");
        credentialsMatcher.setHashIterations(1024);
        customerMD5Realm.setCredentialsMatcher(credentialsMatcher);

        // 开启缓存管理
        customerMD5Realm.setCacheManager(new EhCacheManager());
        customerMD5Realm.setCachingEnabled(true);   // 开启全局缓存
        customerMD5Realm.setAuthenticationCachingEnabled(true);     // 开启认证缓存
        customerMD5Realm.setAuthenticationCacheName("authenticationCache");
        customerMD5Realm.setAuthorizationCachingEnabled(true);      // 开启授权缓存
        customerMD5Realm.setAuthorizationCacheName("authorizationCache");
    }
```

### 使用 Redis 实现缓存

**引入依赖**

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-data-redis</artifactId>
</dependency>
```

**配置文件中配置Redis的连接参数**

```properties
# application.properties配置文件中配置 Redis服务
spring.redis.port=6379
spring.redis.host=localhost
spring.redis.database=0
```



**在缓存管理器中使用redis的缓存管理器**

因为Shiro中默认集成了Ehcache，Shiro已经实现了基于其的缓存管理器，当实现用redis作为缓存时，需要自己实现基于redis的缓存管理器

```java
import org.apache.shiro.cache.Cache;
import org.apache.shiro.cache.CacheException;
import org.apache.shiro.cache.CacheManager;
import org.springframework.stereotype.Component;

/**
 * 自定义shiro中的缓存管理器
 *
 * Created by hugh on 2021/1/1
 */
@Component
public class RedisCacheManager implements CacheManager {

    /**
     * @param s: 认证或授权缓存的名称
     */
    @Override
    public <K, V> Cache<K, V> getCache(String s) throws CacheException {
        // 使用实现的Redis缓存
        return new RedisCache<K,V>(s);
    }
}
```

实现Redis缓存

```java
import com.hugh.springboot_shiro_thymeleaf.utils.ApplicationContextUtils;
import org.apache.shiro.cache.Cache;
import org.apache.shiro.cache.CacheException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.serializer.StringRedisSerializer;

import java.util.Collection;
import java.util.Set;

/**
 * 自定义Redis缓存实现
 *
 * Created by hugh on 2021/1/1
 */
public class RedisCache<K,V> implements Cache<K,V> {

    /*
    @ASutowired
    private RedisTemplate redisTemplate;
    这里自动引入的话会出现创建bean错误，因为这个类不是由spring管理的bean对象，需要使用工具类引入RedisTemplate
    */
    
    private String cacheName;

    public RedisCache(){}

    public RedisCache(String cacaheName){
        this.cacheName = cacaheName;
    }

    @Override
    public V get(K k) throws CacheException {
        RedisTemplate redisTemplate = getRedisTemplate();
        return (V) redisTemplate.opsForHash().get(this.cacheName, k.toString());
    }

    @Override
    public V put(K k, V v) throws CacheException {
        RedisTemplate redisTemplate = getRedisTemplate();
        redisTemplate.opsForHash().put(this.cacheName, k.toString(),v);
        return null;
    }

    @Override
    public V remove(K k) throws CacheException {
        return null;
    }

    @Override
    public void clear() throws CacheException {

    }

    @Override
    public int size() {
        return 0;
    }

    @Override
    public Set<K> keys() {
        return null;
    }

    @Override
    public Collection<V> values() {
        return null;
    }

    private RedisTemplate getRedisTemplate() {
        RedisTemplate redisTemplate = (RedisTemplate) ApplicationContextUtils.getBean("redisTemplate");
        redisTemplate.setKeySerializer(new StringRedisSerializer());
        redisTemplate.setHashKeySerializer(new StringRedisSerializer());
        return redisTemplate;
    }
}
```

自定义工具类用来引入容器管理的Bean对象

```java
import org.springframework.beans.BeansException;
import org.springframework.context.ApplicationContext;
import org.springframework.context.ApplicationContextAware;
import org.springframework.stereotype.Component;

/**
 * 自定义工具类，给不能自动注入的类提供spring的Bean对象
 *
 * Created by hugh on 2021/1/1
 */
@Component
public class ApplicationContextUtils implements ApplicationContextAware {

    private static ApplicationContext applicationContext;

    // 将对象以参数的形式回传
    @Override
    public void setApplicationContext(ApplicationContext applicationContext) throws BeansException {
        this.applicationContext=applicationContext;
    }

    // 使用bean的名称获取容器中的Bean
    public static Object getBean(String beanName){
        return applicationContext.getBean(beanName);
    }
}
```



修改 Shiro 配置类中的缓存管理器的使用

```java
// 使用Redis作为缓存
customerMD5Realm.setCacheManager(new RedisCacheManager());
customerMD5Realm.setCachingEnabled(true);   // 开启全局缓存
customerMD5Realm.setAuthenticationCachingEnabled(true);     // 开启认证缓存
customerMD5Realm.setAuthenticationCacheName("authenticationCache");
customerMD5Realm.setAuthorizationCachingEnabled(true);      // 开启授权缓存
customerMD5Realm.setAuthorizationCacheName("authorizationCache");
```

## 图片验证码

在登录页面上进行登录验证码校验，验证码工具类

```java
package com.hugh.springboot_shiro_thymeleaf.utils;

import javax.imageio.ImageIO;
import java.awt.*;
import java.awt.geom.AffineTransform;
import java.awt.image.BufferedImage;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.OutputStream;
import java.util.Arrays;
import java.util.Random;

/**
 *
 * 验证码工具类
 */
public class VerifyCodeUtils {

    //使用到Algerian字体，系统里没有的话需要安装字体，字体只显示大写，去掉了1,0,i,o几个容易混淆的字符
    public static final String VERIFY_CODES = "23456789ABCDEFGHJKLMNPQRSTUVWXYZ";
    private static Random random = new Random();


    /**
     * 使用系统默认字符源生成验证码
     * @param verifySize    验证码长度
     * @return
     */
    public static String generateVerifyCode(int verifySize){
        return generateVerifyCode(verifySize, VERIFY_CODES);
    }
    /**
     * 使用指定源生成验证码
     * @param verifySize    验证码长度
     * @param sources   验证码字符源
     * @return
     */
    public static String generateVerifyCode(int verifySize, String sources){
        if(sources == null || sources.length() == 0){
            sources = VERIFY_CODES;
        }
        int codesLen = sources.length();
        Random rand = new Random(System.currentTimeMillis());
        StringBuilder verifyCode = new StringBuilder(verifySize);
        for(int i = 0; i < verifySize; i++){
            verifyCode.append(sources.charAt(rand.nextInt(codesLen-1)));
        }
        return verifyCode.toString();
    }

    /**
     * 生成随机验证码文件,并返回验证码值
     * @param w 宽
     * @param h 高
     * @param outputFile
     * @param verifySize
     * @return
     * @throws IOException
     */
    public static String outputVerifyImage(int w, int h, File outputFile, int verifySize) throws IOException{
        String verifyCode = generateVerifyCode(verifySize);
        outputImage(w, h, outputFile, verifyCode);
        return verifyCode;
    }

    /**
     * 输出随机验证码图片流,并返回验证码值
     * @param w
     * @param h
     * @param os
     * @param verifySize
     * @return
     * @throws IOException
     */
    public static String outputVerifyImage(int w, int h, OutputStream os, int verifySize) throws IOException{
        String verifyCode = generateVerifyCode(verifySize);
        outputImage(w, h, os, verifyCode);
        return verifyCode;
    }

    /**
     * 生成指定验证码图像文件
     * @param w
     * @param h
     * @param outputFile
     * @param code
     * @throws IOException
     */
    public static void outputImage(int w, int h, File outputFile, String code) throws IOException{
        if(outputFile == null){
            return;
        }
        File dir = outputFile.getParentFile();
        if(!dir.exists()){
            dir.mkdirs();
        }
        try{
            outputFile.createNewFile();
            FileOutputStream fos = new FileOutputStream(outputFile);
            outputImage(w, h, fos, code);
            fos.close();
        } catch(IOException e){
            throw e;
        }
    }

    /**
     * 输出指定验证码图片流
     * @param w
     * @param h
     * @param os
     * @param code
     * @throws IOException
     */
    public static void outputImage(int w, int h, OutputStream os, String code) throws IOException{
        int verifySize = code.length();
        BufferedImage image = new BufferedImage(w, h, BufferedImage.TYPE_INT_RGB);
        Random rand = new Random();
        Graphics2D g2 = image.createGraphics();
        g2.setRenderingHint(RenderingHints.KEY_ANTIALIASING,RenderingHints.VALUE_ANTIALIAS_ON);
        Color[] colors = new Color[5];
        Color[] colorSpaces = new Color[] { Color.WHITE, Color.CYAN,
                Color.GRAY, Color.LIGHT_GRAY, Color.MAGENTA, Color.ORANGE,
                Color.PINK, Color.YELLOW };
        float[] fractions = new float[colors.length];
        for(int i = 0; i < colors.length; i++){
            colors[i] = colorSpaces[rand.nextInt(colorSpaces.length)];
            fractions[i] = rand.nextFloat();
        }
        Arrays.sort(fractions);

        g2.setColor(Color.GRAY);// 设置边框色
        g2.fillRect(0, 0, w, h);

        Color c = getRandColor(200, 250);
        g2.setColor(c);// 设置背景色
        g2.fillRect(0, 2, w, h-4);

        //绘制干扰线
        Random random = new Random();
        g2.setColor(getRandColor(160, 200));// 设置线条的颜色
        for (int i = 0; i < 20; i++) {
            int x = random.nextInt(w - 1);
            int y = random.nextInt(h - 1);
            int xl = random.nextInt(6) + 1;
            int yl = random.nextInt(12) + 1;
            g2.drawLine(x, y, x + xl + 40, y + yl + 20);
        }

        // 添加噪点
        float yawpRate = 0.05f;// 噪声率
        int area = (int) (yawpRate * w * h);
        for (int i = 0; i < area; i++) {
            int x = random.nextInt(w);
            int y = random.nextInt(h);
            int rgb = getRandomIntColor();
            image.setRGB(x, y, rgb);
        }

        shear(g2, w, h, c);// 使图片扭曲

        g2.setColor(getRandColor(100, 160));
        int fontSize = h-4;
        Font font = new Font("Algerian", Font.ITALIC, fontSize);
        g2.setFont(font);
        char[] chars = code.toCharArray();
        for(int i = 0; i < verifySize; i++){
            AffineTransform affine = new AffineTransform();
            affine.setToRotation(Math.PI / 4 * rand.nextDouble() * (rand.nextBoolean() ? 1 : -1), (w / verifySize) * i + fontSize/2, h/2);
            g2.setTransform(affine);
            g2.drawChars(chars, i, 1, ((w-10) / verifySize) * i + 5, h/2 + fontSize/2 - 10);
        }

        g2.dispose();
        ImageIO.write(image, "jpg", os);
    }

    private static Color getRandColor(int fc, int bc) {
        if (fc > 255)
            fc = 255;
        if (bc > 255)
            bc = 255;
        int r = fc + random.nextInt(bc - fc);
        int g = fc + random.nextInt(bc - fc);
        int b = fc + random.nextInt(bc - fc);
        return new Color(r, g, b);
    }

    private static int getRandomIntColor() {
        int[] rgb = getRandomRgb();
        int color = 0;
        for (int c : rgb) {
            color = color << 8;
            color = color | c;
        }
        return color;
    }

    private static int[] getRandomRgb() {
        int[] rgb = new int[3];
        for (int i = 0; i < 3; i++) {
            rgb[i] = random.nextInt(255);
        }
        return rgb;
    }

    private static void shear(Graphics g, int w1, int h1, Color color) {
        shearX(g, w1, h1, color);
        shearY(g, w1, h1, color);
    }

    private static void shearX(Graphics g, int w1, int h1, Color color) {

        int period = random.nextInt(2);

        boolean borderGap = true;
        int frames = 1;
        int phase = random.nextInt(2);

        for (int i = 0; i < h1; i++) {
            double d = (double) (period >> 1)
                    * Math.sin((double) i / (double) period
                    + (6.2831853071795862D * (double) phase)
                    / (double) frames);
            g.copyArea(0, i, w1, 1, (int) d, 0);
            if (borderGap) {
                g.setColor(color);
                g.drawLine((int) d, i, 0, i);
                g.drawLine((int) d + w1, i, w1, i);
            }
        }

    }

    private static void shearY(Graphics g, int w1, int h1, Color color) {

        int period = random.nextInt(40) + 10; // 50;

        boolean borderGap = true;
        int frames = 20;
        int phase = 7;
        for (int i = 0; i < w1; i++) {
            double d = (double) (period >> 1)
                    * Math.sin((double) i / (double) period
                    + (6.2831853071795862D * (double) phase)
                    / (double) frames);
            g.copyArea(i, 0, 1, h1, 0, (int) d);
            if (borderGap) {
                g.setColor(color);
                g.drawLine(i, (int) d, i, 0);
                g.drawLine(i, (int) d + h1, i, h1);
            }

        }

    }
    public static void main(String[] args) throws IOException {
        //获取验证码
        String s = generateVerifyCode(4);
        //将验证码放入图片中
        outputImage(260,60,new File("/Users/chenyannan/Desktop/安工资料/aa.jpg"),s);
        System.out.println(s);
    }
}
```

页面

```html
验证码：<input type="text" name="code"><img th:src="@{/user/getImage}"/><br>
<!--通过请求的方式获取验证码-->
```

Controller设计

```java
@RequestMapping("getImage")
public void getImage(HttpSession httpSession, HttpServletResponse response) throws IOException {
    // 使用工具类获取验证码
    String code = VerifyCodeUtils.generateVerifyCode(4);
    // 将获取到的验证码放入Session中以便后面进行验证
    httpSession.setAttribute("code", code);
    // 获取输出流，将验证码以图片的形式返回给页面
    OutputStream outputStream = response.getOutputStream();
    response.setContentType("image/png");
    VerifyCodeUtils.outputImage(220, 60, outputStream,code);
}
```

## 整合 Shiro 和 Thymeleaf  

Shiro 和 Thymeleaf 的整合需要另外引入 thymeleaf 对于 Shiro 支持的依赖

**依赖**

```xml
<dependency>
    <groupId>com.github.theborakompanioni</groupId>
    <artifactId>thymeleaf-extras-shiro</artifactId>
    <version>2.0.0</version>
</dependency>
```

在HTML页面中引入命名空间

```html
<!DOCTYPE html>
<html lang="en" xmlns:th="http://www.thymeleaf.org" xmlns:shiro="http://www.pollix.at/thymeleaf/shiro">

<head>
    <meta charset="UTF-8">
    <title>index页面</title>
</head>
<body>
<h1><center>Index 页面</center></h1>
    
<p>
    Hello <span shiro:principal=""></span>, how are you today ?
</p>

<a shiro:hasRole="admin" href="https://www.baidu.com"></a>
</body>
</html>
```

要使shiro标签方言生效需要在shiro的配置文件`ShiroConfig`中加入

```java
// Thymeleaf整合shiro时的方言依赖
@Bean(name = "shiroDialect")
public ShiroDialect shiroDialect(){
    return new ShiroDialect();
}
```

### Thymeleaf 中的 Shiro 标签

```html
<!--验证当前用户是否为“访客”，即未认证（包含未记住）的用户-->
<p shiro:guest="">please <a href="login.html">login</a></p>

<!--认证通过或已记住的用户-->
<p shiro:user="">Welcome back</p>

<!--已认证通过的用户，不包含已记住的用户，这是与user标签的区别所在-->
<p shiro:authenticated></p>

<!--未通过认证的用户，与guest的区别是包含已记住的用户-->
<p shiro:notAuthenticated="">

<!--输出当前用户信息，通常为登陆账号的信息-->
<shiro:principal />

<!--验证当前用户是否属于该角色-->
<p shiro:hasRole="admin"></p>
    
<!--当前用户不属于该角色时验证通过-->
<p shiro:lackRole="developer"></p>

<!--验证当前用户是否属于以下所有角色-->
<p shiro:hasAllRoles="admin, developer"></p>
    
<!--验证当前用户是否属于以下任一角色-->
<p shiro:hasAnyRoles="admin, vip, developer"></p>    
    
<!--验证当前用户是否拥有指定权限-->
<p shiro:hasPermission="user:add:*"></p>  
    
<!--与hasPermission标签逻辑相反，当前用户没有该权限时验证通过-->
<p shrio:lacksPermission="user:add:*"></p>

<!--验证用户是否具有以下所有权限-->
<p shiro:hasAllPermissions="user:*:*, developer:*:*"></p>

<!--验证用户是否有以下一种权限-->
<p shiro:hasAnyPermissions="user:*:*, developer:*:*"></p>

```



## 实现 RememberMe 功能

首先在登录页面选中“记住我”然后登录成功；如果是浏览器登录，一般会把“记住我”的Cookie写到客户端并保存下来。关闭浏览器再重新打开，会发现浏览器还是记住你的。访问一般的网页服务器端还是知道你是谁，且能正常访问。

设置SessionManager

```java
@Bean("cookieRememberMeManager")
public CookieRememberMeManager getCookieRememberMeManager(){
    CookieRememberMeManager cookieRememberMeManager = new CookieRememberMeManager();
    SimpleCookie simpleCookie = new SimpleCookie();

    // Cookie失效时间
    simpleCookie.setMaxAge(259200);
    // 如果为true表示客户端不会暴露给客户端脚本代码，使用HttpOnly cookie有助于减少某些类型的跨站点脚本攻击
    simpleCookie.setHttpOnly(true);
    simpleCookie.setName("RememberMe");
    /*
    -1表示关闭浏览器Cookie失效
    simpleCookie.setMaxAge(-1);
     */

    // rememberMe cookie加密的密匙 建议每个项目都不要一样，默认AES算法 密钥长度（128 256 512 位），通过以下代码可以获取
    // KeyGenerator keygen = KeyGenerator.getInstance("AES");
    // SecretKey deskey = keygen.generateKey();
    // System.out.println(Base64.encodeToString(deskey.getEncoded()));
    byte[] cipherKey = Base64.decode("wGiHplamyXlVB11UXWol8g==");
    cookieRememberMeManager.setCipherKey(cipherKey);
    cookieRememberMeManager.setCookie(simpleCookie);
    // cookieRememberMeManager.forgetIdentity();
    return cookieRememberMeManager;
}
```

完整的config文件如下

```java
import ...;

/**
 * Created by hugh on 2020/12/31
 */
 
@Configuration
public class ShiroConfig {

    // Thymeleaf整合shiro时的方言依赖
    @Bean(name = "shiroDialect")
    public ShiroDialect shiroDialect(){
        return new ShiroDialect();
    }

    // 创建ShiroFilter
    @Bean
    public ShiroFilterFactoryBean getShiroFilterFactoryBean(DefaultWebSecurityManager defaultWebSecurityManager){
        ShiroFilterFactoryBean shiroFilterFactoryBean = new ShiroFilterFactoryBean();
        // 给filter设置安全管理器
        shiroFilterFactoryBean.setSecurityManager(defaultWebSecurityManager);
        // 配置受限资源和公共资源
        Map<String,String> map = new HashMap<>();
        map.put("/user/login","anon");
        map.put("/user/register","anon");
        map.put("/user/remember","anon");

        map.put("/login.jsp","anon");
        map.put("/register.jsp","anon");

        map.put("/fav/index.html","anon");
        map.put("/fav/index","anon");

        map.put("/login.html","anon");
        map.put("/register.html","anon");
        //map.put("/**","authc"); //authc:一个过滤器，表示需要认证和授权
        // 默认认证界面路径
        // jsp 页面
        // shiroFilterFactoryBean.setLoginUrl("/login.jsp");
        // thymeleaf
        shiroFilterFactoryBean.setLoginUrl("/");
        /*
        * 设置认证通过访问的页面
        * shiroFilterFactoryBean.setSuccessUrl("/user/index");
        * 设置未授权页面
        * shiroFilterFactoryBean.setUnauthorizedUrl("403");
         */
        shiroFilterFactoryBean.setFilterChainDefinitionMap(map);
        return shiroFilterFactoryBean;
    }

    @Bean("cookieRememberMeManager")
    public CookieRememberMeManager getCookieRememberMeManager(){
        CookieRememberMeManager cookieRememberMeManager = new CookieRememberMeManager();
        SimpleCookie simpleCookie = new SimpleCookie();

        // Cookie失效时间
        simpleCookie.setMaxAge(259200);
        // 如果为true表示客户端不会暴露给客户端脚本代码，使用HttpOnly cookie有助于减少某些类型的跨站点脚本攻击
        simpleCookie.setHttpOnly(true);
        simpleCookie.setName("RememberMe");
        /*
        -1表示关闭浏览器Cookie失效
        simpleCookie.setMaxAge(-1);
         */

        // rememberMe cookie加密的密匙 建议每个项目都不要一样，默认AES算法 密钥长度（128 256 512 位），通过以下代码可以获取
        // KeyGenerator keygen = KeyGenerator.getInstance("AES");
        // SecretKey deskey = keygen.generateKey();
        // System.out.println(Base64.encodeToString(deskey.getEncoded()));
        byte[] cipherKey = Base64.decode("wGiHplamyXlVB11UXWol8g==");
        cookieRememberMeManager.setCipherKey(cipherKey);
        cookieRememberMeManager.setCookie(simpleCookie);
        // cookieRememberMeManager.forgetIdentity();

        return cookieRememberMeManager;
    }


    // 创建安全管理器
    @Bean
    public DefaultWebSecurityManager getWebDefaultSecurityManager(Realm realm){
        DefaultWebSecurityManager defaultWebSecurityManager = new DefaultWebSecurityManager();

        // 设置cookie管理器
        defaultWebSecurityManager.setRememberMeManager(getCookieRememberMeManager());
        // 给安全管理器设置realm
        defaultWebSecurityManager.setRealm(realm);
        return defaultWebSecurityManager;
    }

    // 创建自定义 realm
    @Bean("realm")
    public Realm getRealm(){
        CustomerMD5Realm customerMD5Realm = new CustomerMD5Realm();
        // 修改凭证校验匹配器和Hash散列次数
        HashedCredentialsMatcher credentialsMatcher = new HashedCredentialsMatcher();
        credentialsMatcher.setHashAlgorithmName("MD5");
        credentialsMatcher.setHashIterations(1024);
        customerMD5Realm.setCredentialsMatcher(credentialsMatcher);

        // 开启缓存管理（本地缓存）
        /*
        customerMD5Realm.setCacheManager(new EhCacheManager());
        customerMD5Realm.setCachingEnabled(true);   // 开启全局缓存
        customerMD5Realm.setAuthenticationCachingEnabled(true);     // 开启认证缓存
        customerMD5Realm.setAuthenticationCacheName("authenticationCache");
        customerMD5Realm.setAuthorizationCachingEnabled(true);      // 开启授权缓存
        customerMD5Realm.setAuthorizationCacheName("authorizationCache");
        */

        // 使用Redis作为缓存
        customerMD5Realm.setCacheManager(new RedisCacheManager());
        customerMD5Realm.setCachingEnabled(true);   // 开启全局缓存
        customerMD5Realm.setAuthenticationCachingEnabled(true);     // 开启认证缓存
        customerMD5Realm.setAuthenticationCacheName("authenticationCache");
        customerMD5Realm.setAuthorizationCachingEnabled(true);      // 开启授权缓存
        customerMD5Realm.setAuthorizationCacheName("authorizationCache");

        return customerMD5Realm;

    }
}
```

前端页面

```html
<!DOCTYPE html>
<html lang="en" xmlns:th="http://www.thymeleaf.org" xmlns:shiro="http://www.pollix.at/thymeleaf/shiro">
<head>
    <meta charset="UTF-8">
    <title>RememberMe</title>
</head>
<body>


<p shiro:user=""> RememberMe 和认证用户可以看到这句话 </p>
<p shiro:guest="">please <a th:href="@{/}">login</a></p>


<!--已认证通过的用户，不包含已记住的用户，这是与user标签的区别所在-->
<p shiro:authenticated>1</p>

<!--未通过认证的用户，与guest的区别是包含已记住的用户-->
<p shiro:notAuthenticated="">2</p>

    <!--输出当前用户信息，通常为登陆账号的信息-->
    <shiro:principal />

    <!--验证当前用户是否属于该角色-->
<p shiro:hasRole="admin"3></p>

<!--当前用户不属于该角色时验证通过-->
<p shiro:lackRole="developer">4</p>

<!--验证当前用户是否属于以下所有角色-->
<p shiro:hasAllRoles="admin, developer">5</p>

<!--验证当前用户是否属于以下任一角色-->
<p shiro:hasAnyRoles="admin, vip, developer">6</p>

<!--验证当前用户是否拥有指定权限-->
<p shiro:hasPermission="user:add:*">7</p>

<!--与hasPermission标签逻辑相反，当前用户没有该权限时验证通过-->
<p shiro:lacksPermission="user:add:*">8</p>

<!--验证用户是否具有以下所有权限-->
<p shiro:hasAllPermissions="user:*:*, developer:*:*">9</p>

<!--验证用户是否有以下一种权限-->
<p shiro:hasAnyPermissions="user:*:*, developer:*:*">10</p>

</body>
</html>
```

控制层

```java
@RequestMapping("remember")
public String rememberMe(){
    System.out.println(SecurityUtils.getSubject().isRemembered());
    System.out.println(SecurityUtils.getSubject().isAuthenticated());
    return "rememberMe";
}
```



# 遇到的问题

`java.io.NotSerializableException: org.apache.shiro.util.SimpleByteSource`

解决方法：

```java
//由于认证部分使用的是：BytesSource类没有实现序列化，所以会导致序列化错误
// 认证
@Override
protected AuthenticationInfo doGetAuthenticationInfo(AuthenticationToken authenticationToken) throws AuthenticationException {
    String principal = (String) authenticationToken.getPrincipal();
    User user = userService.login(principal);
    if(!ObjectUtils.isEmpty(user)){
        return new SimpleAuthenticationInfo(user.getUsername(), user.getPassword(), ByteSource.Util.bytes(user.getSalt()),this.getName());
    }
    return null;
}

// 此时需要自己编写一个类来实现ByteSource 接口和序列化接口Serializable
import ...;

public class MyByteSource implements ByteSource, Serializable {
    private byte[] bytes;
    private String cachedHex;
    private String cachedBase64;

    public MyByteSource(){};
    public MyByteSource(byte[] bytes) {
        this.bytes = bytes;
    }
    public MyByteSource(char[] chars) {
        this.bytes = CodecSupport.toBytes(chars);
    }
    public MyByteSource(String string) {
        this.bytes = CodecSupport.toBytes(string);
    }
    public MyByteSource(ByteSource source) {
        this.bytes = source.getBytes();
    }
    public MyByteSource(File file) {
        this.bytes = (new MyByteSource.BytesHelper()).getBytes(file);
    }

    public MyByteSource(InputStream stream) {
        this.bytes = (new MyByteSource.BytesHelper()).getBytes(stream);
    }

    public static boolean isCompatible(Object o) {
        return o instanceof byte[] || o instanceof char[] || o instanceof String || o instanceof ByteSource || o instanceof File || o instanceof InputStream;
    }

    public byte[] getBytes() {
        return this.bytes;
    }

    public boolean isEmpty() {
        return this.bytes == null || this.bytes.length == 0;
    }

    public String toHex() {
        if (this.cachedHex == null) {
            this.cachedHex = Hex.encodeToString(this.getBytes());
        }

        return this.cachedHex;
    }

    public String toBase64() {
        if (this.cachedBase64 == null) {
            this.cachedBase64 = Base64.encodeToString(this.getBytes());
        }

        return this.cachedBase64;
    }

    public String toString() {
        return this.toBase64();
    }

    public int hashCode() {
        return this.bytes != null && this.bytes.length != 0 ? Arrays.hashCode(this.bytes) : 0;
    }

    public boolean equals(Object o) {
        if (o == this) {
            return true;
        } else if (o instanceof ByteSource) {
            ByteSource bs = (ByteSource)o;
            return Arrays.equals(this.getBytes(), bs.getBytes());
        } else {
            return false;
        }
    }

    private static final class BytesHelper extends CodecSupport {
        private BytesHelper() {
        }

        public byte[] getBytes(File file) {
            return this.toBytes(file);
        }

        public byte[] getBytes(InputStream stream) {
            return this.toBytes(stream);
        }
    }
}

// 使用自己实现的类来进行加盐的序列化工作
...
return new SimpleAuthenticationInfo(user.getUsername(), user.getPassword(), new MyByteSource(user.getSalt()),this.getName());
...
```





`java.lang.ClassCastException: class org.apache.shiro.authc.SimpleAuthenticationInfo cannot be cast to class org.apache.shiro.authz.AuthorizationInfo;`

解决方法：

```java
   // 不知道为什么直接使用opsForValue进行传值会出现opsForHash传入时就不会出现该问题
import ...;

/**
 * 自定义Redis缓存实现
 */
public class RedisCache<K,V> implements Cache<K,V> {

    private String cacheName;

    public RedisCache(){}

    public RedisCache(String cacaheName){
        this.cacheName = cacaheName;
    }

    @Override
    public V get(K k) throws CacheException {
        RedisTemplate redisTemplate = getRedisTemplate();
        return (V) redisTemplate.opsForValue().get(k.toString());
    }

    @Override
    public V put(K k, V v) throws CacheException {
        RedisTemplate redisTemplate = getRedisTemplate();
        redisTemplate.opsForValue().set(k.toString(),v);
        return null;
    }

    @Override
    public V remove(K k) throws CacheException {
        return null;
    }

    @Override
    public void clear() throws CacheException {

    }

    @Override
    public int size() {
        return 0;
    }

    @Override
    public Set<K> keys() {
        return null;
    }

    @Override
    public Collection<V> values() {
        return null;
    }

    private RedisTemplate getRedisTemplate() {
        RedisTemplate redisTemplate = (RedisTemplate) ApplicationContextUtils.getBean("redisTemplate");
        redisTemplate.setKeySerializer(new StringRedisSerializer());
        redisTemplate.setHashKeySerializer(new StringRedisSerializer());
        return redisTemplate;
    }
}

// 这样就不会有问题
import ...;

/**
 * 自定义Redis缓存实现
 */
public class RedisCache<K,V> implements Cache<K,V> {

    private String cacheName;

    public RedisCache(){}

    public RedisCache(String cacaheName){
        this.cacheName = cacaheName;
    }

    @Override
    public V get(K k) throws CacheException {
        RedisTemplate redisTemplate = getRedisTemplate();
        return (V) redisTemplate.opsForHash().get(this.cacheName, k.toString());
    }

    @Override
    public V put(K k, V v) throws CacheException {
        RedisTemplate redisTemplate = getRedisTemplate();
        redisTemplate.opsForHash().put(this.cacheName, k.toString(),v);
        return null;
    }

    @Override
    public V remove(K k) throws CacheException {
        return null;
    }

    @Override
    public void clear() throws CacheException {

    }

    @Override
    public int size() {
        return 0;
    }

    @Override
    public Set<K> keys() {
        return null;
    }

    @Override
    public Collection<V> values() {
        return null;
    }

    private RedisTemplate getRedisTemplate() {
        RedisTemplate redisTemplate = (RedisTemplate) ApplicationContextUtils.getBean("redisTemplate");
        redisTemplate.setKeySerializer(new StringRedisSerializer());
        redisTemplate.setHashKeySerializer(new StringRedisSerializer());
        return redisTemplate;
    }
}
```



`java.lang.IllegalArgumentException: non null key required`

解决方法：

```java
// 当时没有在CacheManager中传值时会报这个错误
public <K, V> Cache<K, V> getCache(String s) throws CacheException {
    return new RedisCache<K,V>();  // 此处应该为：return new RedisCache<K,V>(s);
}

```

