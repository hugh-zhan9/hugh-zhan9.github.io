---
title: 初识SpringMVC
tags: SpringMVC
categories: Java
date: 2020-09-25 16:09:28


---



-入门

<!--more-->

# MVC设计概念

用户的请求首先会到达Servlet，然后根据请求调用对应的JavaBean对象来调取数据，并将数据返回给Servlet，最终交给JSP来呈现给用户。这种模式就称为MVC模式。

- M 表示模型（Model），用来对数据库进行操作
- V 表示视图（View），用来形成网页展示数据
- C 表示控制器（Controller），控制器的作用就是使用模型来获取数据并将数据交给视图

在之后的发展过程中，为了解决一系列数据库事务的问题，将传统的模型层又拆分为了业务层（service）和数据访问层（dao）。

最初设计设计模式的缺点：

1. Servlet编写麻烦，每个Servlet只能处理一个请求，当请求多起来之后，Servlet的数量可能会成倍的增加。
2. 耦合的程度高，不利于代码的修改。

SpringMVC是什么？

来看看 Spring 的基本架构：

![](https://s1.ax1x.com/2020/09/25/09fVaD.png)

可以看到，在 Spring 的基本架构中，红色圈起来的 Spring Web MVC ，也就是本系列的主角 SpringMVC，它是属于Spring基本架构里面的一个组成部分，属于SpringFrameWork的后续产品，已经融合在Spring Web Flow里面，所以我们在后期和 Spring 进行整合的时候，几乎不需要别的什么配置。

# SpringMVC的执行流程

请求处理流程

> 浏览器发起请求——>tomcat服务器（读取`web.xml`文件中的`url-pattern`标签）——>访问`url-pattern`中的`DispatcherServlet`中央调度器（读取`SpringMVC`的配置文件）——>将请求发送给对应的`@Controller`下对应的`@RequestMapping`处理——>框架执行方法，将`ModelAndView`进行处理转发给对应的页面展示

代码分析

1. tomcat启动，创建容器的过程

   执行`initStrategies(ApplicationContext context){...}`初始化`WebApplicationContext`对象，创建`@Controller`对应的对象，将该对象存入SpringMVC容器中。

   

2. 请求处理的过程

   执行Servlet的`doService()`方法

   service方法执行`doDispatch(request, response){...}`获取`@Controller`中的`@RequestMapping`方法





![](https://s1.ax1x.com/2020/09/19/wI9GIs.png)

1. 用户发起请求

2. `DispatcherServlet`接收请求，把请求转交给处理器映射器(`HandlerMapping`)

   处理器映射器：是SpingMVC框架中的一种对象，框架把实现了`HandlerMapping`接口的类都叫做映射器，处理器映射器的作用是：根据请求从SpringMVC容器对象中获取处理器对象。框架把找到的处理器对象放到一个叫做处理器执行链的类中保存（`HandlerExecutionChain`——处理器执行链）。

   处理器执行链中保存着处理器对象、项目中所有的拦截器`List<HandlerInterceptor> interceptorList`。

   最后处理器映射器将处理器执行链交给中期调度器。

3. 中央调度器把`HandlerExecutionChain`处理器执行链中的处理器对象交给处理器适配器对象（SpringMVC中的对象，需要实现`HandlerAdapter`接口），处理器适配器执行处理器方法返回`ModelAndView`

4. 中央调度器将3中获取到的`ModelAndView`对象交给视图解析器对象（SpringMVC中的对象，需要实现`ViewResoler`接口，一个项目中可以有多个该对象）。视图解析器会使用前缀，后缀组成视图完整路径，并创建`View`对象。`View`是一个接口，表示视图，在框架中jsp、html不是String表示的，而是使用`View`接口和它的实现类表示的，不同的实现类表示不同的视图。

   ```java
   例如：
   // 框架内部转成视图
   mv.setViewName("show")
   // 直接创建视图
   mv.setView(new RedirectView("/a.jsp"));
   ```

   `InternalResourceView`：视图类，表示JSP对象，视图解析器会创建`InternalResourceView`类对象，这个对象的里面有一个属性`url`，执行`mv.setViewName("show")`时，这个属性会被赋值`url=/WEB-INF/view/show.jsp`创建出一个`View`交给中央调度器。

5. 对视图的真正渲染，中央调度器把4中创建的`View`对象获取到，执行`View`类的方法，把`Model`中的数据放入到`Request`作用域，执行对象视图的`forward`，请求结束。



# SSM整合开发

SSM：SpringMVC+Spring+MyBatis

- SpringMVC：视图层，界面层，负责接收请求，显示处理结果
- Spring：业务层，管理Service，do，工具类
- MyBatis：持久层，访问数据库

SSM整合中涉及到的容器：

1. SpringMVC容器：管理Controller控制器对象
2. Spring容器：管理Service，Dao，工具类对象

要做到把使用的对象交给合适的容器创建和管理，把Controller还有web开发的相关对象交给SpringMVC容器，这些web用的对象写在SpringMVC配置文件中。

Service，dao对象定义在Spring的配置文件中，让Spring管理这些对象

**两个容器之间如何通讯的呢？**

SpringMVC容器和Sprin容器之间是有关系的，SpringMVC容器是Spring容器的子容器，类似于Java中的继承。子容器中的Controller可以访问父容器中的Servlet



## 实现步骤：

1. 表的设计

2. 新建maven项目，加入依赖

   （SpringMVC、Spring、MyBatis三个框架的依赖，Servlet、JSP的依赖，MySQL数据库、druid连接池的依赖...）

3. 写web.xml

   - 注册`DespatvherServlet`，目的：1. 创建SpringMVC容器对象，才能创建Controller类对象   	2. 创建的是Servlet，才能接受用户的请求
   - 注册Spring的监听器，目的：创建Spring的容器对象，才能创建Service、dao等对象
   - 注册字符集过滤器，解决字符集乱码问题

4. 创建包，Controller、Service、dao、实体类包

5. 写SpringMVC、Spring、MyBatis的配置文件

   - SpringMVC的配置文件（组件扫描器，视图解析器，注解驱动，静态资源过滤）
   - Sping的配置文件（读取配置文件、声明数据源，声明SqlSessionFactoryBean、声明MyBatis扫描器,创建Dao对象、声明service的注解`@service`所在的包名、事务配置（注解的配置，aspectJ的配置））
   - MyBatis主配置文件（实在实体类别名、指定mapper文件所在位置）
   - 数据库的配置文件

6. 写实现代码

7. 页面

# SpringMVC常用注解

@Controller：负责注册一个bean 到spring 上下文中

@RequestMapping：注解为控制器指定可以处理哪些 URL 请求

@RequestBody：该注解用于读取Request请求的body部分数据，使用系统默认配置的HttpMessageConverter进行解析，然后把相应的数据绑定到要返回的对象上 ,再把HttpMessageConverter返回的对象数据绑定到 controller中方法的参数上

@ResponseBody：该注解用于将Controller的方法返回的对象，通过适当的HttpMessageConverter转换为指定格式后，写入到Response对象的body数据区

@ModelAttribute ：

- 在方法定义上使用 @ModelAttribute 注解：Spring MVC 在调用目标处理方法前，会先逐个调用在方法级上标注了@ModelAttribute 的方法
- 在方法的入参前使用 @ModelAttribute 注解：可以从隐含对象中获取隐含的模型数据中获取对象，再将请求参数 –绑定到对象中，再传入入参将方法入参对象添加到模型中 

@RequestParam：在处理方法入参处使用 @RequestParam 可以把请求参 数传递给请求方法

@PathVariable：绑定 URL 占位符到入参

@ExceptionHandler：注解到方法上，出现异常时会执行该方法

@ControllerAdvice：使一个Contoller成为全局的异常处理类，类中用@ExceptionHandler方法注解的方法可以处理所有Controller发生的异常











# MVC核心技术

## Controller层

一、简介

 在SpringMVC 中，控制器Controller 负责处理由DispatcherServlet 分发的请求，它把用户请求的数据经过业务处理层处理之后封装成一个Model ，然后再把该Model 返回给对应的View 进行展示。在SpringMVC 中提供了一个非常简便的定义Controller 的方法，你无需继承特定的类或实现特定的接口，只需使用@Controller 标记一个类是Controller ，然后使用@RequestMapping 和@RequestParam 等一些注解用以定义URL 请求和Controller 方法之间的映射，这样的Controller 就能被外界访问到。此外Controller 不会直接依赖于HttpServletRequest 和HttpServletResponse 等HttpServlet 对象，它们可以通过Controller 的方法参数灵活的获取到。为了先对Controller 有一个初步的印象，以下先定义一个简单的Controller ：

```java
@Controller
public class MyController {

    @RequestMapping ("/showView")
    public ModelAndView showView() {
       ModelAndView modelAndView = new ModelAndView();
       modelAndView.setViewName( "viewName" );
       modelAndView.addObject( " 需要放到 model 中的属性名称 " , " 对应的属性值，它是一个对象 " );
       return modelAndView;
    }
} 
```

在上面的示例中，@Controller 是标记在类MyController 上面的，所以类MyController 就是一个SpringMVC Controller 对象了，然后使用@RequestMapping(“/showView”) 标记在Controller 方法上，表示当请求/showView.do 的时候访问的是MyController 的showView 方法，该方法返回了一个包括Model 和View 的ModelAndView 对象。

二、使用 @Controller 定义一个 Controller 控制器

 @Controller 用于标记在一个类上，使用它标记的类就是一个SpringMVC Controller 对象。分发处理器将会扫描使用了该注解的类的方法，并检测该方法是否使用了@RequestMapping 注解。@Controller 只是定义了一个控制器类，而使用@RequestMapping 注解的方法才是真正处理请求的处理器，这个接下来就会讲到。

  单单使用@Controller 标记在一个类上还不能真正意义上的说它就是SpringMVC 的一个控制器类，因为这个时候Spring 还不认识它。那么要如何做Spring 才能认识它呢？这个时候就需要我们把这个控制器类交给Spring 来管理。拿MyController 来举一个例子

```java
@Controller
public class MyController {
    @RequestMapping ("/showView")
    public ModelAndView showView() {
       ModelAndView modelAndView = new ModelAndView();
       modelAndView.setViewName( "viewName" );
       modelAndView.addObject( " 需要放到 model 中的属性名称 " , " 对应的属性值，它是一个对象 " );
       return modelAndView;
    }
} 
```

这个时候有两种方式可以把MyController 交给Spring 管理，好让它能够识别我们标记的@Controller 。

  第一种方式是在SpringMVC 的配置文件中定义MyController 的bean 对象。

```xml
<bean class="com.host.app.web.controller.MyController"/>
```

  第二种方式是在SpringMVC 的配置文件中告诉Spring 该到哪里去找标记为@Controller 的Controller 控制器。(组件扫描器)

```xml
    < context:component-scan base-package = "com.host.app.web.controller" ></ context:component-scan > 
```

三、使用 @RequestMapping 来映射 Request 请求与处理器

 可以使用@RequestMapping 来映射URL 到控制器类，或者是到Controller 控制器的处理方法上。当@RequestMapping 标记在Controller 类上的时候，里面使用@RequestMapping 标记的方法的请求地址都是相对于类上的@RequestMapping 而言的；当Controller 类上没有标记@RequestMapping 注解时，方法上的@RequestMapping 都是绝对路径。这种绝对路径和相对路径所组合成的最终路径都是相对于根路径“/ ”而言的。

```java
@Controller
public class MyController {
    @RequestMapping ("/showView")
    public ModelAndView showView() {
       ModelAndView modelAndView = new ModelAndView();
       modelAndView.setViewName( "viewName" );
       modelAndView.addObject( " 需要放到 model 中的属性名称 " , " 对应的属性值，它是一个对象 " );
       return modelAndView;
    }

} 
```

在这个控制器中，因为MyController 没有被@RequestMapping 标记，所以当需要访问到里面使用了@RequestMapping 标记的showView 方法时，就是使用的绝对路径/showView.do 请求就可以了。

```JAVA
@Controller
@RequestMapping ( "/test" )
public class MyController {
    @RequestMapping ( "/showView" )
    public ModelAndView showView() {
       ModelAndView modelAndView = new ModelAndView();
       modelAndView.setViewName( "viewName" );
       modelAndView.addObject( " 需要放到 model 中的属性名称 " , " 对应的属性值，它是一个对象 " );
       return modelAndView;
    }

} 
```

这种情况是在控制器上加了@RequestMapping 注解，所以当需要访问到里面使用了@RequestMapping 标记的方法showView() 的时候就需要使用showView 方法上@RequestMapping 相对于控制器MyController上@RequestMapping 的地址，即/test/showView.do 。



## 请求转发和重定向

forward和redirect：分别表示转发和重定向，都是关键字，有一个共同的特点：不和视图解析器一同工作，就当视图解析器不存在。

### 请求转发示例：

语法：`setViewName("forward:视图文件完整路径")`

```java
public ModelAndView doSome(){
    ModelAndView mv = new ModelAndView();
    mv.addObject("msg","测试请求转发功能");
    mv.setViewName("show");
    // 显式转发，当视图不在视图解析器中时使用
    mv.setViewName("forward:/WEB-INF/view/show.jsp");
    return mv;
}
```

### 重定向示例

>重定向不能访问到WEB-INF下的资源

语法：`setViewName("redirect:视图文件完整路径")`

```java
public ModelAndView doSome(){
    ModelAndView mv = new ModelAndView();
    // 数据会存到request作用域
    
    // 框架会把Model中简单类型的数据转换为字符串作为第二次请求的请求参数使用，目的是为了在两次请求之间传递参数
    mv.addObject("msg","测试请求转发功能");
    mv.setViewName("redirect:/WEB-INF/view/show.jsp");
    return mv;
}
```

jsp页面中取参问题

```jsp
${msg}  
// 这样无法取出参数, 因为两次请求是不同的request，但是，请求的url中是有数据的，可以这样取出参数
${param.msg}
```



## 异常处理

### 集中处理异常

解决try-catch的问题，将异常集中到一个地方统一地进行处理（AOP思想）——统一全局异常处理

使用到两个注解

1. `@ExceptionHandler`
2. `@ControllerAdvice`

https://snailclimb.gitee.io/springboot-guide/#/./docs/advanced/springboot-handle-exception



异常处理步骤：

1. 创建一个类作为全局异常处理类。
   - 类的上方加入`@ControllerAdvice`
   - 在类中定义方法，方法上面加`@ExceptionHandler`
2. 在Controller中抛出异常
3. 创建处理异常的视图页面
4. 创建SpringMVC的配置文件
   - 组件扫描器，扫描`@Controller`注解
   - 组件扫描器，扫描`@ControllerAdvice`注解
   - 声明注解驱动



```java
@RequestMapping(value="/some.do")
public ModelAndView doSome(String name, int age) throws MyException{
    ModelAndView mv = new ModelAndView();
    if(name != "zhangsan"){
        throw new NameException("姓名不正确");
    }
    if(age != 18){
        throw new AgeException("年龄不正确");
    }
    mv.addObject("msg","测试请求转发功能");
    mv.setViewName("redirect:/WEB-INF/view/show.jsp");
    return mv;
}
```

建立两个异常类

```java
package com.hugh.exception;

public class MyException extends Exception{
    public MyException() {
        super();
    }

    public MyException(String message) {
        super(message);
    }
}
```

`

```java
package com.hugh.exception;

public class NameException  extends MyException{
    public NameException() {
        super();
    }

    public NameException(String message) {
        super(message);
    }
}
```



```java
package com.hugh.exception;

public class AgeException extends MyException{
    public AgeException() {
        super();
    }

    public AgeException(String message) {
        super(message);
    }
}
```



异常处理类

```java
package com.hugh.handler;

import com.hugh.exception.AgeException;
import com.hugh.exception.NameException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.servlet.ModelAndView;

/*
    控制器增强，给控制器类增加功能——异常处理功能
    注：必须让框架直到这个注解所在的包名，需要在SpringMVC配置文件声明组件扫描器，指定@ControllerAdvice所在的位置
 */
@ControllerAdvice
public class GlobalExceptionHandler {
    // 定义方法，处理异常
    /*
        处理异常的方法和控制器方法一样，可以有多个参数，返回值可以是ModelAndView...

        形参：Exception表示Controller中抛出的异常对象，通过形参可以获取发生的异常信息

        @ExceptionHandler(异常的class)：表示当发生此类型异常时，由当前方法处理
     */
    @ExceptionHandler(value = NameException.class)
    public ModelAndView doNameException(Exception e){
        /*
            处理异常：
                1. 需要记录异常记录，记录异常发生的时间，异常的内容，发生异常的方法
                2. 发送通知，将异常的信息通过短信，邮件，微信发送给相关人员
                3. 给用户友好的提示页面
         */
        ModelAndView mv = new ModelAndView();
        mv.addObject("msg","姓名必须是zhangsan");
        mv.addObject("exception",e);
        mv.setViewName("exception");
        return mv;
    }

    @ExceptionHandler(value = AgeException.class)
    public ModelAndView doAgeException(Exception e){
        ModelAndView mv = new ModelAndView();
        mv.addObject("msg","年龄必须18");
        mv.addObject("exception",e);
        mv.setViewName("exception");
        return mv;
    }

    // 处理其余异常
    @ExceptionHandler()
    public ModelAndView doOtherException(Exception e){
        ModelAndView mv = new ModelAndView();
        mv.addObject("msg","非NameException或AgeException异常");
        mv.addObject("exception",e);
        mv.setViewName("exception");
        return mv;
    }
}
```

exception视图页面

```jsp
<%--
  Created by IntelliJ IDEA.
  User: hugh
  Date: 2020/9/18
  Time: 20:38
  To change this template use File | Settings | File Templates.
--%>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<html>
<head>
    <title>异常页面</title>
</head>
<body>
提示信息：${msg}
<br>
异常信息: ${exception.message}
<br>
</body>
</html>
```

## 拦截器

拦截器是框架中比较重要的一种对象，需要实现HandlerInterceptor接口，是用来拦截请求的，对请求做预先的处理和判断

拦截器和过滤器类似，功能方向侧重不同，过滤器是用来过滤请求参数，设置编码字符集等工作的，而拦截器是拦截用户请求，做请求判断处理的。

拦截器是全局的，可以对多个Controller做拦截，一个项目中可以有任意个拦截器，它们一起拦截用户的请求。常用在：用户登录、授权检查、记录日志。

拦截器的使用步骤：

1. 定义类实现HandlerInterceptor接口
2. 在SpringMVC配置文件中，声明拦截器，让框架知道拦截器的存在。

拦截器的使用时间：

1. 在请求处理之前，即Controller类中的方法执行之前被拦截
2. 在控制器方法执行之后也会执行拦截器
3. 在请求处理完成后也会执行拦截器

拦截器的使用：

1. 创建一个普通类，作为拦截器，实现HandlerInterceptor接口和它的三个方法
2. 在SpringMVC的配置文件中声明组件扫描器和拦截器，并指定拦截的请求uri地址



拦截器可以看作是多个Controller的公共的功能，集中到拦截器统一处理，使用的是AOP的思想





### 多个拦截器的执行顺序

多个拦截器在框架中实际上是保存在一个ArrayList中的，先声明的先执行，后声明的后执行

多为真时执行结果：

```
第一个拦截器的preHandler执行
第二个拦截器的preHandler执行
====controller方法执行====
第二个拦截器的postHandler执行
第一个拦截器的postHandler方法执行
第二个拦截器的afterCompletion方法执行
第一个拦截器的afterCompletion方法执行
```

多拦截器处理流程示意图：

![](https://s1.ax1x.com/2020/09/19/w5lmlD.png)

都为假时执行结果：

```
第一个拦截器的preHandler执行
```

一真一假的执行结果

```
第一个拦截器为真
--------------------------------------
第一个拦截器的preHandler执行
第二个拦截器的preHandler执行
第一个拦截器的afterCompletion方法执行
```



多个拦截器是为了使不同的拦截器验证不同的功能，例如：第一个拦截器验证用户是否登录，第二个拦截器验证是否具有权限。。。





### 拦截器和过滤器的区别

1. 过滤器是Servlet中的对象，过滤器是框架中的对象
2. 过滤器式实现Filter接口的对象，拦截器式实现HandlerInterceptor接口的对象
3. 过滤器式用来设置request，response的参数、属性的，侧重对数据过滤，拦截器是用来验证请求的，能截断请求
4. 过滤器是在拦截器之前执行的
5. 过滤器是tomcat服务器创建的对象，拦截器是SpringMVC创建的对象
6. 过滤器只有一个执行时间点，拦截器有三个执行时间点
7. 过滤器可以处理jsp、js、html等，拦截器是侧重对Controller拦截，如果你的请求不能被DispatcherServlet接收，这个请求不会执行拦截器内容



### 实例

> web.xml注册中央调度器
>
> 新建index.jsp页面发起请求
>
> 创建Controller处理请求
>
> 创建show.jsp
>
> 创建一个login.jsp页面模拟登录，把用户的信息放入到Session
>
> 创建一个loginout.jsp模拟登出，把用户信息从Session中删除
>
> 创建连接器，从Session中获取用户的登陆数据，验证是否能够访问系统
>
> 创建一个验证的jsp，如果验证视图，给出提示
>
> 创建SpringMVC的配置文件，声明组件扫描器，拦截器



## 实例

### 配置文件

1. web.xml文件

   ```xml
   <?xml version="1.0" encoding="UTF-8"?>
   <web-app xmlns="http://xmlns.jcp.org/xml/ns/javaee"
            xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
            xsi:schemaLocation="http://xmlns.jcp.org/xml/ns/javaee http://xmlns.jcp.org/xml/ns/javaee/web-app_4_0.xsd"
            version="4.0">
   
     <!--
         声明、注册SpringMVC的核心对象DispatcherServlet
         需要在tomcat服务器启动的时候就创建DispatcherServlet实例。
         因为DispatcherServlet在创建过程中会同时创建SpringMVC容器对象
         该对象会读取SpringMVC的配置文件，把这个配置文件中的对象都创建好，当用户发起请求时就可以直接调用
   
         DispatcherServlet的初始化会执行init(){
             // 创建容器，读取配置文件
             WebApplicationContext webApplicationContext = new ClassPathXmlApplicationContext("springmvc.xml");
             // 把容器对象放入到全局作用域ServletContext中
             getServletContext().setAttribute(key,webApplicationContext);
         }
     -->
     <servlet>
       <servlet-name>DispatcherServlet</servlet-name>
       <servlet-class>org.springframework.web.servlet.DispatcherServlet</servlet-class>
       <!--
           启动tomcat服务器时，默认会从WEB-INF中读取<servlet-name>-servlet.xml文件
           自定义配置文件位置：
       -->
       <init-param>
         <param-name>contextConfigLocation</param-name>
         <param-value>classpath:springmvc.xml</param-value>
       </init-param>
       <!--
         在tomcat启动后创建Servlet对象
         load-on-startup：表示tomcat启动后创建对象的顺序，它的值为整数，越小表示越早创建
       -->
       <load-on-startup>1</load-on-startup>
     </servlet>
   
     <servlet-mapping>
       <servlet-name>DispatcherServlet</servlet-name>
       <!--
           使用框架时，url-pattern可以使用两种值
             1.使用拓展名方式，语法:*.xxx，xxx时自定义的拓展名，常用的如：*.do, *.action, *.mvc等
             2.使用"/", 表示所有页面都交给这个Servlet来处理
               这会导致一个问题就是——静态资源无法访问，因为DispatcherServlet没有提供处理静态资源的能力，
               tomcat默认有一个叫做DefaultServlet的Servlet页面可以处理静态资源。
               解决使用“/”导致无法访问的问题的方案
                 1. 在SpringMVC的配置文件中加入一个<mvc:default-servlet-handler/>，
                     这个标签会让SpringMVC的DispatcherServlet结合Tomcat的DefaultServlet一块使用，解决对静态资源和动态资源的访问问题
                 2. <mvc:resources/>标签，专门用于处理静态资源无法访问问题，例如：<mvc:resources location="/images/" mapping="/images/**">
       -->
       <url-pattern>/</url-pattern>
     </servlet-mapping>
   
     <!--声明过滤器，防止post请求中文乱码-->
     <filter>
       <filter-name>characterEncodingFilter</filter-name>
       <filter-class>org.springframework.web.filter.CharacterEncodingFilter</filter-class>
       <init-param>
         <param-name>encoding</param-name>
         <param-value>UTF-8</param-value>
       </init-param>
       <init-param>
         <param-name>forceRequestEncoding</param-name>
         <param-value>true</param-value>
       </init-param>
       <init-param>
         <param-name>forceResponseEncoding</param-name>
         <param-value>true</param-value>
       </init-param>
       <!--
       <init-param>
         <param-name>forceEncoding</param-name>
         <param-value>true</param-value>
       </init-param>
       -->
     </filter>
     <filter-mapping>
       <filter-name>characterEncodingFilter</filter-name>
       <!--强制所有页面都是使用过滤器-->
       <url-pattern>/*</url-pattern>
     </filter-mapping>
   </web-app>
   
   ```

2. springmvc.xml文件

   ```xml
   <?xml version="1.0" encoding="UTF-8"?>
   <beans xmlns="http://www.springframework.org/schema/beans"
          xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
          xmlns:context="http://www.springframework.org/schema/context"
          xmlns:mvc="http://www.springframework.org/schema/mvc"
          xsi:schemaLocation="http://www.springframework.org/schema/beans http://www.springframework.org/schema/beans/spring-beans.xsd http://www.springframework.org/schema/context https://www.springframework.org/schema/context/spring-context.xsd http://www.springframework.org/schema/mvc https://www.springframework.org/schema/mvc/spring-mvc.xsd">
   
   	<!--组件扫描器-->
   	<context:component-scan base-package="com.hugh"></context:component-scan>
   
       <!--声明SpringMVC框架中的视图解析器，指定视图文件的路径-->
       <bean class="org.springframework.web.servlet.view.InternalResourceViewResolver">
           <!--前缀：视图文件的路径-->
           <property name="prefix" value="/WEB-INF/view/"></property>
           <!--后缀：视图文件的拓展名-->
           <property name="suffix" value=".jsp"></property>
       </bean>
   
       <!--
           注解驱动
           该驱动可以将数据转换为json对象、xml对象、text、二进制等数据格式
           实现了HttpMessageConvert接口：消息转换器，里面实现了大量的Java对象转换为其余数据格式的方法
           该标签会自动创建HttpMessageConvert接口的七个实现类，包括MappingJackson2HttpMessageConvert(使用Jackson工具库中的objectMapper方法实现Java对象转换为json字符串)
           StringHttpMessageConverter(负责读取字符串格式的数据和写出字符串格式的数据)
       -->
       <mvc:annotation-driven></mvc:annotation-driven>
       <!--
           解决使用"/"导致静态资源无法访问的问题，方案一:
               原理是：框架会创建控制器对象DispatcherServletHttpServletRequestHandler这个对象
                   把接收到的请求先交给tomcat来处理，遇到注解@RequestMapping时将请求交给DispatcherServlet来处理
   
       <mvc:default-servlet-handler></mvc:default-servlet-handler>
   
           方案二：
               使用标签<mvc:resources/>,加入该标签之后框架会创建ResourceHttpRequestHandler这个控制器对象，让这个对象来处理静态资源访问
               mapping：访问静态资源的uri地址，使用通配符**
               location：静态资源在项目中的目录位置
   
               可以将所有的静态资源放在一个静态资源文件夹，这样就可以通过一个命令，解决所有静态资源的问题
                   <mvc:resources mapping="/static/**" location="/static/">
       -->
       <mvc:resources mapping="/js/**" location="/js/"></mvc:resources>
       <mvc:resources mapping="/images/**" location="/images/"></mvc:resources>
   
       <!--声明拦截器-->
       <mvc:interceptors>
           <mvc:interceptor>
               <!--指定拦截的URI地址，可以使用通配符-->
               <mvc:mapping path="/user/**"/>
               <!--声明拦截器对象-->
               <bean class="com.hugh.interceptor.MyInterceptor"></bean>
           </mvc:interceptor>
       </mvc:interceptors>
   </beans>
   ```

3. spring配置文件applicationContext.xml

   ```xml
   <?xml version="1.0" encoding="UTF-8"?>
   <beans xmlns="http://www.springframework.org/schema/beans"
          xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
          xmlns:context="http://www.springframework.org/schema/context"
          xsi:schemaLocation="http://www.springframework.org/schema/beans
          http://www.springframework.org/schema/beans/spring-beans.xsd
          http://www.springframework.org/schema/context
          https://www.springframework.org/schema/context/spring-context.xsd">
   
       <context:property-placeholder location="classpath:JDBC.properties"></context:property-placeholder>
   
   
       <!--声明数据源dataSource，连接数据库-->
       <bean id="dataSource" class="com.alibaba.druid.pool.DruidDataSource" init-method="init" destroy-method="close">
           <!--set注入给dataSource提供连接数据库的信息-->
           <property name="url" value="${jdbc.url}"></property>
           <property name="username" value="${jdbc.username}"></property>
           <property name="password" value="${jdbc.password}"></property>
           <property name="maxActive" value="20"></property>
       </bean>
   
       <bean id="sqlSessionFactory" class="org.mybatis.spring.SqlSessionFactoryBean">
           <property name="dataSource" ref="dataSource"></property>
           <property name="configLocation" value="classpath:mybatis.xml"></property>
       </bean>
   
       <bean class="org.mybatis.spring.mapper.MapperScannerConfigurer">
           <property name="sqlSessionFactoryBeanName" value="sqlSessionFactory"></property>
           <property name="basePackage" value="com.hugh.dao"></property>
       </bean>
   
   
       <bean id="studentService" class="com.hugh.service.impl.StudentServiceImpl">
           <property name="studentDao" ref="studentDao"></property>
       </bean>
   
       <bean id="transactionManager" class="org.springframework.jdbc.datasource.DataSourceTransactionManager">
           <property name="dataSource" ref="dataSource"></property>
       </bean>
   </beans>
   ```

   

4. 数据库配置文件JDBC.properties

   ```properties
   jdbc.url=jdbc:mysql://localhost:3306/hughdatabase
   jdbc.username=root
   jdbc.password=19961220
   ```

5. dao接口对应的映射文件

   ```xml
   <?xml version="1.0" encoding="UTF-8" ?>
   <!DOCTYPE mapper
           PUBLIC "-//mybatis.org//DTD Mapper 3.0//EN"
           "http://mybatis.org/dtd/mybatis-3-mapper.dtd">
   <mapper namespace="com.hugh.dao.StudentDao">
       <insert id="insertStudent">
           insert into student values (#{id},#{name},#{age})
       </insert>
       <select id="selectStudent" resultType="Student">
           select * from student
       </select>
   </mapper>
   ```

   

6. mybatis.xml的配置文件

   ```xml
   <?xml version="1.0" encoding="UTF-8" ?>
   <!DOCTYPE configuration
           PUBLIC "-//mybatis.org//DTD Config 3.0//EN"
           "http://mybatis.org/dtd/mybatis-3-config.dtd">
   <configuration>
       <settings>
           <setting name="logImpl" value="STDOUT_LOGGING" />
       </settings>
   
       <typeAliases>
           <package name="com.hugh.pojo"/>
       </typeAliases>
   
       <mappers>
       	<!--使用package时有条件的，Dao接口文件要和Mapper文件命名一样且在同一目录-->
           <package name="com.hugh.dao"/>
       </mappers>
   </configuration>
   ```

### controller类

1. HelloController

   ```java
   @Controller
   public class HelloController {
       @RequestMapping(value = "/some.do")
       public ModelAndView doSome(){
           ModelAndView mv = new ModelAndView();
           mv.addObject("message","欢迎使用SpringMVC新建一个项目");
           /*
              mv.setViewName("WEB-INF/view/result.jsp");
              配置视图解析器之后使用逻辑名称（文件名）指定视图
              框架会将视图路径按照 前缀+"文件名"+后缀 的模式组合起来
            */
           mv.setViewName("result");
           return mv;
       }
   }
   ```

   

2. GetUserInfoController

   ```java
   package com.hugh.controller;
   
   import org.springframework.stereotype.Controller;
   import org.springframework.web.bind.annotation.RequestMapping;
   import org.springframework.web.bind.annotation.RequestMethod;
   import org.springframework.web.servlet.ModelAndView;
   
   import javax.servlet.http.HttpServletRequest;
   import javax.servlet.http.HttpServletResponse;
   import javax.servlet.http.HttpSession;
   import java.io.UnsupportedEncodingException;
   
   /*
       @RequestMapping注解放在类的上方时，表示请求地址的公共部分
       这样访问的页面就是http://localhost:8080/myweb/test/some.do
    */
   
   @Controller
   @RequestMapping(value = "/info")
   public class GetUserInfoController {
       // 指定页面的访问方式
       @RequestMapping(value = "/some.do", method = RequestMethod.POST)
       public ModelAndView doSomePostWithInfo(HttpServletRequest request, HttpServletResponse response, HttpSession session){
           String info = request.getParameter("info");
           ModelAndView mv = new ModelAndView();
           mv.addObject("message","欢迎使用post方式访问some.do, 用户传入的信息是："+info);
           /*
              mv.setViewName("WEB-INF/view/result.jsp");
              配置视图解析器之后使用逻辑名称（文件名）指定视图
              框架会将视图路径按照 前缀+"文件名"+后缀 的模式组合起来
            */
           mv.setViewName("result");
           return mv;
       }
   }
   ```

3. RequestMappingController

   ```java
   package com.hugh.controller;
   
   import org.springframework.stereotype.Controller;
   import org.springframework.web.bind.annotation.RequestMapping;
   import org.springframework.web.bind.annotation.RequestMethod;
   import org.springframework.web.servlet.ModelAndView;
   
   /*
       @RequestMapping注解放在类的上方时，表示请求地址的公共部分
       这样访问的页面就是http://localhost:8080/myweb/test/some.do
    */
   
   @Controller
   @RequestMapping(value = "/test")
   public class RequestMappingController {
       // 指定页面的访问方式
       @RequestMapping(value = "/some.do", method = RequestMethod.POST)
       public ModelAndView doSomePost(){
           ModelAndView mv = new ModelAndView();
           mv.addObject("message","欢迎使用post方式访问som.do");
           /*
              mv.setViewName("WEB-INF/view/result.jsp");
              配置视图解析器之后使用逻辑名称（文件名）指定视图
              框架会将视图路径按照 前缀+"文件名"+后缀 的模式组合起来
            */
           mv.setViewName("result");
           return mv;
       }
       @RequestMapping(value = "/some.do", method = RequestMethod.GET)
       public ModelAndView doSomeGet(){
           ModelAndView mv = new ModelAndView();
           mv.addObject("message","欢迎使用get方式访问some.do");
           /*
              mv.setViewName("WEB-INF/view/result.jsp");
              配置视图解析器之后使用逻辑名称（文件名）指定视图
              框架会将视图路径按照 前缀+"文件名"+后缀 的模式组合起来
            */
           mv.setViewName("result");
           return mv;
       }
   }
   ```

4. ReturnVoidController

   ```java
   package com.hugh.controller;
   
   import com.fasterxml.jackson.core.JsonProcessingException;
   import com.fasterxml.jackson.databind.ObjectMapper;
   import com.hugh.pojo.JavaObj;
   import org.springframework.stereotype.Controller;
   import org.springframework.web.bind.annotation.RequestMapping;
   import org.springframework.web.bind.annotation.ResponseBody;
   
   import javax.servlet.http.HttpServletResponse;
   import java.io.IOException;
   import java.io.PrintWriter;
   
   @Controller
   public class ReturnVoidController {
       /*
           使用Void作为返回值，可以通过HttpServletResponse输出返回值来响应Ajax
           ajax请求只能返回数据，和视图无关
        */
       @RequestMapping(value = "/returnVoidResponseAjax.do")
       public void returnVoidResponseAjax(HttpServletResponse response, String name, Integer age){
           // 处理Ajax，使用json做数据传输
           // 假设service已经执行完成了
           JavaObj obj = new JavaObj();
           obj.setName(name);
           obj.setAge(age);
   
           // ---------以下为重复工作，所以导入了返回值为Object的方式------------
           String json = null;
           if(obj != null){
               ObjectMapper om = new ObjectMapper();
               try {
                   json = om.writeValueAsString(obj);
                   // 将数据响应给Ajax的请求
                   response.setContentType("application/json;charset=utf-8");
                   PrintWriter pw = response.getWriter();
                   pw.println(json);
                   pw.flush();
                   pw.close();
               } catch (JsonProcessingException e) {
                   e.printStackTrace();
               } catch (IOException e) {
                   e.printStackTrace();
               }
           }
       }
   }
   
   ```

   

5. ReceiveParamController

   ```java
   package com.hugh.controller;
   
   import com.hugh.pojo.JavaObj;
   import org.springframework.stereotype.Controller;
   import org.springframework.web.bind.annotation.RequestMapping;
   import org.springframework.web.bind.annotation.RequestMethod;
   import org.springframework.web.bind.annotation.RequestParam;
   import org.springframework.web.servlet.ModelAndView;
   
   import javax.servlet.http.HttpServletRequest;
   
   @Controller
   @RequestMapping(value = "/receive")
   public class ReceiveParamController {
       /*
           逐个接收
           要求：处理器（控制器）方法的形参名和请求中参数名必须一致。同名的请求参数赋值给同名的形参
        */
       @RequestMapping(value = "onebyone1.do", method = RequestMethod.POST)
       public ModelAndView receiveOneParam1(String name,Integer age){  //使用Integer，防止用户输入的值不合法导致的异常
           ModelAndView mv = new ModelAndView();
           mv.addObject("name",name);
           mv.addObject("age",age);
           mv.setViewName("show");
           return mv;
       }
       /*
           请求参数名和控制器参数名不一致
           在控制器方法的形参前使用注解@RequestParam
               属性：
                   1. value, 绑定请求参数和控制器参数
                   2. required, 一个Boolean值，表示请求中是否必须含有参数
        */
       @RequestMapping(value = "onebyone2.do", method = RequestMethod.GET)
       public ModelAndView receiveOneParam2(@RequestParam(value = "rname",required = false) String name,
                                            @RequestParam(value = "rage",required = false) Integer age){
           ModelAndView mv = new ModelAndView();
           mv.addObject("name",name);
           mv.addObject("age",age);
           mv.setViewName("show");
           return mv;
       }
       /*
           对象接收
           控制器的形参为Java对象，这个对象类的属性名和请求中参数名一样，框架会创建该对象，给其属性赋值。
        */
       @RequestMapping(value = "/buyObj.do", method = RequestMethod.POST)
       public ModelAndView receiveByObj(JavaObj obj){
           ModelAndView mv = new ModelAndView();
           mv.addObject("name",obj.getName());
           mv.addObject("age",obj.getAge());
           mv.setViewName("show");
           return mv;
       }
   }
   
   ```

   

6. ReturnObjectController

   ```java
   package com.hugh.controller;
   
   import com.hugh.pojo.JavaObj;
   import org.springframework.stereotype.Controller;
   import org.springframework.web.bind.annotation.RequestMapping;
   import org.springframework.web.bind.annotation.ResponseBody;
   
   import java.util.ArrayList;
   import java.util.List;
   
   
   /*
       Object的返回方式，表示返回数据，和视图无关
       一般使用对象来表示数据，响应Ajax
    */
   @Controller
   public class ReturnObjectController {
       @RequestMapping(value = "/returnObj.do")
       @ResponseBody
       /*
           放在控制器方法上方，通过HttpServletResponse输出数据，响应Ajax请求。代替执行数据输出
           处理流程：
               1. 框架会返回Student类型，调用框架中的ArrayList<HttpMessageConverter>中每个类的canWriter方法，
               检查HttpMessageConverter接口的实现类可以处理该类型的数据。
               2. 框架调用这个实现类的write方法，把对向转换为对应的类型数据
               3. 框架会调用@ResponseBody把2的处理结果输出到浏览器
        */
       public Object returnObjectResponseAjax(){
           // 调用service，获取请求结果数据，这里用JavaObj模拟已经获得数据
           JavaObj obj = new JavaObj();
           obj.setName("张三");
           obj.setAge(24);
           return obj;
       }
   
       @RequestMapping(value = "/returnList.do")
       @ResponseBody
       public List<JavaObj> returnListObj(){
           List<JavaObj> list = new ArrayList<JavaObj>();
           JavaObj obj1 = new JavaObj();
           JavaObj obj2 = new JavaObj();
           obj1.setName("张三");
           obj1.setAge(24);
           obj2.setName("李四");
           obj2.setAge(24);
           list.add(obj1);
           list.add(obj2);
           return list;
       }
   }
   
   ```

7. ReturnStringController

   ```java
   package com.hugh.controller;
   
   import org.springframework.stereotype.Controller;
   import org.springframework.web.bind.annotation.RequestMapping;
   import org.springframework.web.bind.annotation.ResponseBody;
   
   import javax.servlet.http.HttpServletRequest;
   
   @Controller
   public class ReturnStringController {
       @RequestMapping(value = "/returnView.do")
       public String returnStringResponseView(HttpServletRequest request, String name, Integer age){
           // 手动对request进行赋值
           request.setAttribute("name",name);
           request.setAttribute("age",age);
           // 返回视图页面，逻辑视图名称
           return "show";
       }
   
       /*
           这个返回值需要Ajax采用格式text格式接收，但是text格式默认的编码会导致中文乱码，
           可以通过给@RequestMapping的一个produces属性来重置编码。
        */
       @RequestMapping(value = "/returnData.do", produces = "text/plain;charset=utf-8")
       @ResponseBody
       public String returnStringResponseData2Ajax(){
           return "返回String对象，表示数据";
       }
   }
   
   ```

8. StudentController

   ```java
   package com.hugh.controller;
   
   import com.fasterxml.jackson.core.JsonProcessingException;
   import com.fasterxml.jackson.databind.ObjectMapper;
   import com.hugh.pojo.Student;
   import com.hugh.service.StudentService;
   import com.hugh.service.impl.StudentServiceImpl;
   import org.springframework.context.ApplicationContext;
   import org.springframework.context.support.ClassPathXmlApplicationContext;
   import org.springframework.stereotype.Controller;
   import org.springframework.web.bind.annotation.RequestMapping;
   import org.springframework.web.context.WebApplicationContext;
   import org.springframework.web.servlet.ModelAndView;
   
   import javax.print.DocFlavor;
   import javax.servlet.http.HttpServletResponse;
   import java.io.IOException;
   import java.io.PrintWriter;
   import java.util.List;
   
   @Controller
   public class StudentController {
       private String config = "applicationContext.xml";
       private ApplicationContext applicationContext = new ClassPathXmlApplicationContext(config);
       private StudentService service = (StudentService) applicationContext.getBean("studentService");
   
       @RequestMapping(value = "/addStudent")
       public ModelAndView addStudent(int id,String name, int age){
           int num = service.addStudent(Integer.valueOf(id),name,Integer.valueOf(age));
           ModelAndView mv = new ModelAndView();
           if (num == 1){
               mv.addObject("message","注册成功");
   
           }else {
               mv.addObject("message","注册失败");
           }
           mv.setViewName("returnResult");
           return mv;
       }
   
       @RequestMapping(value = "/showStudents")
       public ModelAndView showAllStudent(HttpServletResponse response){
           List<Student> list = service.showStudent();
           ObjectMapper om = new ObjectMapper();
           ModelAndView mv = new ModelAndView();
           try {
               String json = om.writeValueAsString(list);
               PrintWriter pw  = response.getWriter();
               pw.println(json);
               pw.flush();
               pw.close();
               mv.addObject("message",json);
               mv.setViewName("showResult");
           } catch (JsonProcessingException e) {
               e.printStackTrace();
           } catch (IOException e) {
               e.printStackTrace();
           }
           return mv;
       }
   }
   ```

9. SomeController

   ```java
   package com.hugh.controller;
   
   import com.hugh.exception.AgeException;
   import com.hugh.exception.MyException;
   import com.hugh.exception.NameException;
   import org.springframework.stereotype.Controller;
   import org.springframework.web.bind.annotation.RequestMapping;
   import org.springframework.web.servlet.ModelAndView;
   
   /*
       @Controller创建处理器对象，对象放在SpringMVC中。
       位置：类上。和spring中的@Component,@Service一样都是创建对象
       有一个value属性，表示@Controller的名称
    */
   @Controller
   public class SomeController {
       /*
           处理用户提交的请求，SpringMVC中是使用方法来处理的。
           方法是自定义的，可以有很多种返回值，多种参数，方法名称自定义
        */
   
       /**
        * 使用doSome方法来除了some.do这个请求
        * 使用@RequestMapping：这个注解来告诉方法处理这个请求
        * @RequestMapping:请求映射，作用是把一个请求的地址和一个方法绑定，一个请求指定一个方法处理
        *      属性：value,字符串，表示请求uri地址,唯一，推荐使用"/"开头
        * 说明：使用@RequestMapping修饰的方法叫做处理器方法或者控制器方法，可以处理请求，类似Servlet中的doGet/doPost
        *
        *  返回值：ModelAndView
        *      Model：数据，请求处理完成后，要显示给用户的数据
        *      View：视图，如jsp页面等
        */
       @RequestMapping(value = "/somedo.do")
       public ModelAndView doSome(){
           // 处理some.do请求, 创建ModelAndView对象
           ModelAndView mv = new ModelAndView();
           // 添加数据，框架会在最后向request作用域中放入数据 request.setAttribute("message","欢迎使用SpringMVC");
           mv.addObject("message","欢迎使用SpringMVC");
           // 指定视图,相当于 request.getRequestDispatcher("/show.jsp");
           mv.setViewName("/show.jsp");
           return mv;
       }
   
       @RequestMapping(value="/some")
       public ModelAndView doSome(String name, int age) throws MyException {
           ModelAndView mv = new ModelAndView();
           if(name != "zhangsan"){
               throw new NameException("姓名不正确");
           }
           if(age != 18){
               throw new AgeException("年龄不正确");
           }
           mv.addObject("msg","测试请求转发功能");
           mv.setViewName("redirect:/WEB-INF/view/show.jsp");
           return mv;
       }
   }
   ```

### dao

dao接口

```java
package com.hugh.dao;

import com.hugh.pojo.Student;

import java.util.List;


public interface StudentDao {
    int insertStudent(Student student);
    List<Student> selectStudent();
}

```

### exception

AgeException

```java
package com.hugh.exception;

public class AgeException extends MyException{
    public AgeException() {
        super();
    }

    public AgeException(String message) {
        super(message);
    }
}
```

MyException

```java
package com.hugh.exception;

public class MyException extends Exception{
    public MyException() {
        super();
    }

    public MyException(String message) {
        super(message);
    }
}
```

NameException

```java
package com.hugh.exception;

public class NameException extends MyException{
    public NameException() {
        super();
    }

    public NameException(String message) {
        super(message);
    }
}
```

### handler

自定义的全局异常处理类：GlobalExceptionHandler

```java
package com.hugh.handler;

import com.hugh.exception.AgeException;
import com.hugh.exception.NameException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.servlet.ModelAndView;

/*
    控制器增强，给控制器类增加功能——异常处理功能
    注：必须让框架直到这个注解所在的包名，需要在SpringMVC配置文件声明组件扫描器，指定@ControllerAdvice所在的位置
 */
@ControllerAdvice
public class GlobalExceptionHandler {
    // 定义方法，处理异常
    /*
        处理异常的方法和控制器方法一样，可以有多个参数，返回值可以是ModelAndView...

        形参：Exception表示Controller中抛出的异常对象，通过形参可以获取发生的异常信息

        @ExceptionHandler(异常的class)：表示当发生此类型异常时，由当前方法处理
     */
    @ExceptionHandler(value = NameException.class)
    public ModelAndView doNameException(Exception e){
        /*
            处理异常：
                1. 需要记录异常记录，记录异常发生的时间，异常的内容，发生异常的方法
                2. 发送通知，将异常的信息通过短信，邮件，微信发送给相关人员
                3. 给用户友好的提示页面
         */
        ModelAndView mv = new ModelAndView();
        mv.addObject("msg","姓名必须是zhangsan");
        mv.addObject("exception",e);
        mv.setViewName("exception");
        return mv;
    }

    @ExceptionHandler(value = AgeException.class)
    public ModelAndView doAgeException(Exception e){
        ModelAndView mv = new ModelAndView();
        mv.addObject("msg","年龄必须18");
        mv.addObject("exception",e);
        mv.setViewName("exception");
        return mv;
    }

    // 处理其余异常
    @ExceptionHandler()
    public ModelAndView doOtherException(Exception e){
        ModelAndView mv = new ModelAndView();
        mv.addObject("msg","非NameException或AgeException异常");
        mv.addObject("exception",e);
        mv.setViewName("exception");
        return mv;
    }
}

```

### interceptor

MyInterceptor，自定义的拦截类

```java
package com.hugh.interceptor;

import org.springframework.web.servlet.HandlerInterceptor;
import org.springframework.web.servlet.ModelAndView;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.sql.Struct;


// 拦截器类，拦截用户的请求
public class MyInterceptor implements HandlerInterceptor {
    /*
        preHandle叫做预处理方法
        参数：Object handler：被拦截的控制器对象
        返回值：Boolean true:请求通过拦截器的验证，可以执行处理器的方法 false:请求没有通过拦截器的验证，不能执行
        特点：
            1. 方法在控制器方法之前执行，用户的请求先到达这个方法
            2. 在这个方法中，可以获取请求的信息，验证请求是否符合要求，
                可以验证用户是否登录，验证用户是否有权限访问某个链接地址
                如果验证成功，可以放行请求，此时控制器方法才能执行，否则截断请求
     */
    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        // 处理，根据处理的结果返回true或false
        Boolean result = false;
        if ( true
                // TODO: 2020/9/18 处理逻辑
            ){
            result = true;
        }else {
            request.getRequestDispatcher("/error.jsp").forward(request,response);
        }
        return result;
    }

    /*
        postHandler叫做后处理方法
        参数：Object handler: 被拦截的处理器对象MyController
        ModelAndView: 处理器方法的返回值

        特点：
            1. 在处理器方法之后执行
            2. 能够获取到处理器方法的返回值ModelAndView，可以修改ModelAndView中的数据和视图，可以影响到最后的执行结果
     */
    @Override
    public void postHandle(HttpServletRequest request, HttpServletResponse response, Object handler, ModelAndView modelAndView) throws Exception {

    }

    /*
        afterCompletion最后执行的方法
        参数：Object handler： 被拦截的处理器对象
        Exception ex: 程序中发生的异常
        特点：
            1. 在请求处理完成后执行，框架中规定是当视图处理完成之后执行
            2. 一般做资源回收工作的，程序中创建了一些对象，在这里可以删除，回收占用的内存
     */
    @Override
    public void afterCompletion(HttpServletRequest request, HttpServletResponse response, Object handler, Exception ex) throws Exception {

    }
}
```

### pojo

JavaObj类

```java
package com.hugh.pojo;

public class JavaObj {
    private String name;
    private Integer age;

    public void setName(String name) {
        this.name = name;
    }

    public void setAge(Integer age) {
        this.age = age;
    }

    public String getName() {
        return name;
    }

    public Integer getAge() {
        return age;
    }
}
```

Student类

```java
package com.hugh.pojo;

public class Student {
    private int id;
    private String name;
    private int age;

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public int getAge() {
        return age;
    }

    public void setAge(int age) {
        this.age = age;
    }

    @Override
    public String toString() {
        return "Student{" +
                "id=" + id +
                ", name='" + name + '\'' +
                ", age=" + age +
                '}';
    }
}

```

### service

StudentService接口

```java
package com.hugh.service;

import com.hugh.pojo.Student;

import java.util.List;

public interface StudentService {
    int addStudent(int id,String name, int age);
    List<Student> showStudent();
}
```

实现类

```java
package com.hugh.service.impl;

import com.hugh.dao.StudentDao;
import com.hugh.pojo.Student;
import com.hugh.service.StudentService;
import org.springframework.stereotype.Component;

import java.util.List;


public class StudentServiceImpl implements StudentService {
    private StudentDao studentDao;

    public void setStudentDao(StudentDao studentDao) {
        this.studentDao = studentDao;
    }

    @Override
    public int addStudent(int id, String name, int age) {
        Student student = new Student();
        student.setId(id);
        student.setName(name);
        student.setAge(age);
        int num = studentDao.insertStudent(student);
        return num;
    }

    @Override
    public List<Student> showStudent() {
        List<Student> list = studentDao.selectStudent();
        return list;
    }
}
```

### JSP页面

index

```jsp
<%@ taglib prefix="form" uri="http://www.springframework.org/tags/form" %>
<%--
  Created by IntelliJ IDEA.
  User: Aqrose
  Date: 2020/9/17
  Time: 8:37
  To change this template use File | Settings | File Templates.
--%>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<html>
<head>
    <title>学生信息注册</title>
</head>
<body>
<form action="addStudent" method="get">
    <table>
        <tr>
            <td>
                学号：
            </td>
            <td>
                <input type="text" name="id">
            </td>
        </tr>
        <tr>
            <td>
                姓名：
            </td>
            <td>
                <input type="text" name="name">
            </td>
        </tr>
        <tr>
            <td>
                年龄：
            </td>
            <td>
                <input type="text" name="age">
            </td>
        </tr>
        <tr>
            <td>
                学号：
            </td>
            <td>
                <input type="submit" value="注册">
            </td>
        </tr>
    </table>
<br><br>
    <a href="showStudents">查询学生</a>

    <br><br>
    <a href="index1.jsp">index1.jsp页面</a>
</form>
</body>
</html>
```

show.jsp

```jsp
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags" %>
<%--
  Created by IntelliJ IDEA.
  User: hugh_
  Date: 2020/9/16
  Time: 23:32
  To change this template use File | Settings | File Templates.
--%>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<html>
<head>
    <title>Title</title>
</head>
<body>
返回的数据是：${message}
</body>
</html>
```

index1.jsp（使用Ajax从后端获取数据）

```jsp
<%@ taglib prefix="form" uri="http://www.springframework.org/tags/form" %>
<%--
  Created by IntelliJ IDEA.
  User: hugh
  Date: 2020/9/17
  Time: 8:37
  To change this template use File | Settings | File Templates.
--%>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<html>
<head>
    <title>HelloSpringMVC</title>
</head>
<script type="text/javascript" src="js/jquery-3.4.1.js"></script>
<script type="text/javascript">
    $(function () {
        $("button").click(function () {
            // alert("message");
            $.ajax({
                // url:"returnVoidResponseAjax.do",
                // url:"returnObj.do",
                // url:"returnList.do",
                url:"returnData.do",
                data:{name:"zhangsan", age:24},
                type:"get",
                type:"text",
                // dataType:"json",
                dataType:"text",
                success:function(rsp){
                    // 从服务器返回的是json格式的字符串，jQuery会把字符串转换为json格式的对象，赋值给rsp
                    // alert(rsp);
                    // alert(rsp.name+"  "+rsp.age)
                    /* $.each(rsp,function (i,n) {
                           alert(n.name+"  "+n.age);
                       })
                     */
                    alert("返回的数据是："+rsp);
                }
            })
        })
    })
</script>
<body>

<a href="somedo.do">访问第一个SpringMVC项目</a>
<br><br>
<a href="test/some.do">访问test/some.do页面</a>
<br><br>
<a href="some.do">访问some.do页面</a>
<br><br>
<form method="post" action="test/some.do">
    以post方式访问test/some.do<input type="submit" value="访问">
</form>
<br>
<form method="post" action="info/some.do">
    <input type="text" name="info"> &nbsp;&nbsp;&nbsp;
    以post方式访问test/some.do<input type="submit" value="访问">
</form>
<br><br>
<p>
    <font size="5">提交参数给Controller</font>
    <br>
<form action="receive/onebyone1.do" method="post">
    逐个接收<br>
    姓名：<input type="text" name="name"><br>
    年龄：<input type="text" name="age"><br>
    <input type="submit" value="提交">
</form>

<form action="receive/onebyone2.do" method="get">
    请求参数名和控制器参数名不一致<br>
    姓名：<input type="text" name="rname"><br>
    年龄：<input type="text" name="rage"><br>
    <input type="submit" value="提交">
</form>
<form action="receive/buyObj.do" method="post">
    对象接收<br>
    姓名：<input type="text" name="name"><br>
    年龄：<input type="text" name="age"><br>
    <input type="submit" value="提交">
</form>
<form action="returnView.do" method="get">
    仅返回视图<br>
    姓名：<input type="text" name="name"><br>
    年龄：<input type="text" name="age"><br>
    <input type="submit" value="提交">
</form>
</p>
<br>
<p>
    Ajax请求:<button id="button">发起Ajax请求</button>
</p>

<br><br>
测试异常处理
<form method="post" action="some">
    <input type="text" name="name"> &nbsp;&nbsp;&nbsp;
    <input type="text" name="age"> &nbsp;&nbsp;&nbsp;
    以post方式访问test/some.do<input type="submit" value="访问">
</form>
</body>
</html>
```

# MVC九大组件

查看`DispatcherServlet`的源码：

```java
import ...

public class DispatcherServlet extends FrameworkServlet {
    
    ...
    
    @Nullable
    // 国际化解析器
    private LocaleResolver localeResolver;
    @Nullable
    // 主题解析器
    private ThemeResolver themeResolver;
    @Nullable
    // 视图名称解析器
    private RequestToViewNameTranslator viewNameTranslator;
    @Nullable
    // 用于管理FlashMap，FlashMap用于在redirect重定向中传递参数
    private FlashMapManager flashMapManager;
    @Nullable
    // 文件处理器
    private MultipartResolver multipartResolver;
    @Nullable
    // 处理器映射器
    private List<HandlerMapping> handlerMappings;
    @Nullable
    // 处理器适配器
    private List<HandlerAdapter> handlerAdapters;
    @Nullable
    // 异常处理器
    private List<HandlerExceptionResolver> handlerExceptionResolvers;
    @Nullable
    // 视图解析器
    private List<ViewResolver> viewResolvers;
    
    ....

    // 初始化组件方法
    protected void initStrategies(ApplicationContext context) {
        this.initMultipartResolver(context);
        this.initLocaleResolver(context);
        this.initThemeResolver(context);
        this.initHandlerMappings(context);
        this.initHandlerAdapters(context);
        this.initHandlerExceptionResolvers(context);
        this.initRequestToViewNameTranslator(context);
        this.initViewResolvers(context);
        this.initFlashMapManager(context);
    }
    
	...
}
```

可以看到其中声明了九大组件，每个组件都有其对应的功能：

## HandlerMapping 处理器映射器

根据`request`找到相应的处理器。因为Handler（Controller）有两种形式，一种是基于类的Handler，另一种是基于Method的Handler（也就是我们常用的）

## HandlerAdapter 处理器适配器

调用Handler的适配器。如果把Handler（Controller）当做工具的话，那么HandlerAdapter就相当于干活的工人

## HandlerExceptionResolver

对异常的处理

## ViewResolver 视图解析器

用来将String类型的视图名和Locale解析为View类型的视图

## RequestToViewNameTranslator

有的Handler（Controller）处理完后没有设置返回类型，比如是void方法，这是就需要从request中获取viewName

## LocaleResolver

从request中解析出Locale。Locale表示一个区域，比如zh-cn，对不同的区域的用户，显示不同的结果，这就是i18n（SpringMVC中有具体的拦截器LocaleChangeInterceptor）

## ThemeResolver

主题解析，这种类似于我们手机更换主题，不同的UI，css等

## MultipartResolver

处理上传请求，将普通的request封装成MultipartHttpServletRequest

## FlashMapManager

用于管理FlashMap，FlashMap用于在redirect重定向中传递参数

# 流程图

![](https://s1.ax1x.com/2020/09/25/09W55Q.png)

