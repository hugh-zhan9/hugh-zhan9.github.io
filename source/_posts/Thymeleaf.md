---
title: Thymeleaf模板技术
tags: [Java, SpringBoot, Thymeleaf]
categories: Java
date: 2020-11-12 16:41:28


---



[![](https://s3.ax1x.com/2020/11/12/BzHHBj.png)](https://imgchr.com/i/BzHHBj)

<!---more-->

# Thymeleaf 的特点

动静结合：Thymeleaf 在有网络和无网络的环境下皆可运行，即它可以让美工在浏览器查看页面的静态效果，也可以让程序员在服务器查看带数据的动态页面效果。这是由于它支持 html 原型，然后在 html 标签里增加额外的属性来达到模板+数据的展示方式。浏览器解释 html 时会忽略未定义的标签属性，所以 Thymeleaf 的模板可以静态地运行；当有数据返回到页面时，Thymeleaf 标签会动态地替换掉静态内容，使页面动态显示。

Thymeleaf 的主要作用时把model中的数据渲染到html中，因此其语法主要是如何解析model中的数据。

- 变量、方法、条件判断、循环、运算 [逻辑运算、布尔运算、比较运算、条件运算]
- 其他

# 导入依赖

```xml
<dependency>
    <groupId>org.thymeleaf</groupId>
    <artifactId>thymeleaf-spring5</artifactId>
</dependency>
<dependency>            
    <groupId>org.thymeleaf.extras</groupId>
    <artifactId>thymeleaf-extras-java8time</artifactId>
</dependency>
```

# 表达式

```
${...}		变量表达式
*{...}		选择变量表达式
#{...}		消息表达式
@{...}		连接网址表达式
~{...}		片段表达式
[[...]]		内联表达式，经过转义之后再输出
[(...)]		内联表达式，原文直接输出
```

> Thymeleaf表达式只能放置标签的Thymeleaf的自定义属性里面（如：div标签中的`th:text`属性）。如果要放在非Thymeleaf的自定义属性里面，那么需要使用内联表达式包起来。
>
> 内联表达式的意思是：在内嵌表达式的基础上嵌入基本表达式（变量、选择变量、消息等等）

# 变量表达式

变量表达式的作用是：从web作用域里面取到对应的值，作用域包括 **request、session、application**

前台：

```html
<!DOCTYPE html>
<html lang="en" xmlns:th="http://www.thymeleaf.org/">
<head>
    <meta charset="UTF-8">
    <title>Title</title>
</head>
<body>

request： <br/>
<div>
    编号： <label th:text="${user1.id}"></label><br/>
    用户名：<label th:text="${user1.username}"></label> <br/>
    密码：<label th:text="${user1.password}"></label><br/>
</div>

session：<br/>
<div>
    编号： <label th:text="${session.user2.id}"></label><br/>
    用户名：<label th:text="${session.user2.username}"></label> <br/>
    密码：<label th:text="${session.user2.password}"></label><br/>
</div>

application：<br/>
<div>
    编号：<label th:text="${application.user3.id}"></label><br/>
    用户名：<label th:text="${application.user3.username}"></label><br/>
    密码：<label th:text="${application.user3.password}"></label><br/>
</div>

</body>
</html>
```

后台：

```java
@GetMapping("/index")
public String showPage(HttpServletRequest request, HttpSession session) {

    User user1 = new User(1L, "zhangsan", "333333");
    request.setAttribute("user1", user1);

    User user2 = new User(2L, "lisi", "444444");
    session.setAttribute("user2", user2);

    User user3 = new User(3L, "wangwu", "555555");
    ServletContext application = request.getServletContext();
    application.setAttribute("user3", user3);

    return "index";
}
```

Thymeleaf 是通过`${}`来获取model中的变量，注意这不是[el表达式](https://www.baidu.com/s?wd=el%E8%A1%A8%E8%BE%BE%E5%BC%8F&rsv_spt=1&rsv_iqid=0x815adcee00011937&issp=1&f=8&rsv_bp=1&rsv_idx=2&ie=utf-8&tn=baiduhome_pg&rsv_enter=1&rsv_dl=tb&rsv_sug3=13&rsv_sug1=11&rsv_sug7=101&rsv_sug2=0&rsv_btype=i&inputT=2465&rsv_sug4=3011)，而是[ognl表达式](https://www.baidu.com/s?wd=ognl%E8%A1%A8%E8%BE%BE%E5%BC%8F&rsv_spt=1&rsv_iqid=0x899fb7df0000264b&issp=1&f=8&rsv_bp=1&rsv_idx=2&ie=utf-8&tn=baiduhome_pg&rsv_enter=1&rsv_dl=tb&rsv_sug3=15&rsv_sug1=14&rsv_sug7=100&rsv_sug2=0&rsv_btype=i&inputT=5576&rsv_sug4=5576)，但是语法很相似。

```html
<h1>
    你好，<span th:text="${user.name}">陌生人</span>
</h1>
```

和el表达式差不多的。区别在于，表达式写在一个名为：`th:text`的标签属性中，这个叫做指令





# 选择变量表达式

使用变量表达式来取request、session、application作用域上的属性时，可以发现，我们需要重复编写user1、session.user2和application.use3三次，如果user对象的属性有十几个怎么办？显然写十几次相同的代码不是我们想要解决方案。针对这种问题，Thymeleaf提供了**选择变量表达式**来解决。

```html
request： <br/>
<div>
    编号： <label th:text="${user1.id}"></label><br/>
    用户名：<label th:text="${user1.username}"></label> <br/>
    密码：<label th:text="${user1.password}"></label><br/>
</div>

session：<br/>
<div>
    编号： <label th:text="${session.user2.id}"></label><br/>
    用户名：<label th:text="${session.user2.username}"></label> <br/>
    密码：<label th:text="${session.user2.password}"></label><br/>
</div>
------------------------------
等价于：
------------------------------
request： <br/>
<div th:object="${user1}">
    编号： <label th:text="*{id}"></label><br/>
    用户名：<label th:text="*{username}"></label> <br/>
    密码：<label th:text="*{password}"></label><br/>
</div>

session：<br/>
<div th:object="${session.user2}">
    编号： <label th:text="*{id}"></label><br/>
    用户名：<label th:text="*{username}"></label> <br/>
    密码：<label th:text="*{password}"></label><br/>
</div>
```

# 内置对象

Thymeleaf中提供了一些内置对象，并且在这些对象中提供了一些方法，方便我们来调用。获取这些对象，需要使用`#对象名`来引用。

| 对象              | 作用                          |
| ----------------- | ----------------------------- |
| `#ctx`            | 获取Thymeleaf的Context对象    |
| `#request`        | 获取`HttpServletRequest`对象  |
| `#response`       | 获取`HttpServletResponse`对象 |
| `#session`        | 获取`HttpSession`对象         |
| `#servletContext` | 获取`HttpServletContext`对象  |

Thymeleaf还提供了一些方法对象：

| 对象        | 作用                               |
| ----------- | ---------------------------------- |
| `#dates`    | 处理`java.util.date`的工具对象     |
| `#clendars` | 处理`java.util.calendar`的工具对象 |
| `#numbers`  | 处理数字处理的对象                 |
| `#strings`  | 处理字符串处理的对象               |
| `#bools`    | 处理布尔值处理的对象               |
| `#arrays`   | 处理数组的对象                     |
| `#lists`    | 处理list集合的对象                 |
| `#sets`     | 处理set集合的对象                  |
| `#maps`     | 处理map集合的对象                  |

e.g：

后端

```java
@GetMapping("/hello")
public String hello(Model model){
    Date today = new Date();
    model.addAttribute("today",today);
    return "hello";
}
```

前端：

```html
<p>
    今天是：<span th:text="${#dates.format(today,'yyyy-MM-dd hh:mm:ss')}" />
</p>
```

**字面值**

有的时候，需要在指令中填写基本类型如：字符串、数值、布尔等，并不希望被Thymeleaf解析为变量，这个时候称为字面值。

- 字符串字面值

  ```html
  <p>
      <span th:text="'thymeleaf'">模板</span>
  </p>
  ```

  `th:text`中的thymeleaf并不会被认为是变量，而是一个字符串

- 数字字面值

  不需要任何特殊语法， 写的什么就是什么，而且可以直接进行算术运算

  ```html
  <span th:text="2020"></span>
  <span th:text="2020 + 2020"></span>
  ```

- 布尔字面值

  ```html
  <div th:if="true">
      你填的是true。
  </div>
  ```

  这里引用了一个`th:if`指令，可以使用这个指令进行判断。

  ```html
  <div th:if="${user.name}">
      你传入的值是true。
  </div>
  ```

**拼接**

```html
<span th:text=" '你好'+ ${user.name} +'!' "></span>

<span th:text="|你好：${user.name}|"></span>	<!--不介意使用-->
```

**运算**

`${}`内部的是通过OGNL表达式引擎解析的，外部的才是通过Thymeleaf 的引擎解析，因此运算符尽量放在`${}`外进行。

- 算术运算：``+ - * /`

  ```html
  <span th:text="${user.age}"></span>
  <span th:text="${user.age} % 2 == 0 "></span> 		<!--值为false-->
  ```

- 比较运算：`> < <= >= == != !`

  > 注意：>、< 不能直接使用，因为会被解析为xml标签，需要使用别名：
  >
  > `gt(>), lt(<), ge(>=), le(<=), not(!).   Also eq (==), neq/ne (!=)`

- 条件运算

  > 三元运算

  ```html
  <span th:text="${user.sex} ? '1' : '0'"></span>
  
  <!--当一个值可能为空时，这个时候需要做非空判断，表达式：?: ，注意:?之间没有空格-->
  <span th:text="${user.name} ?: 'zhangsan'"></span>
  ```

# 循环

可以使用`th:each`指令来将元素循环取出。

假设有用户集合users在Context中。

```html
<tr th:each="user : ${users}">
    <td th:text="${user.name}">Onions</td>
    <td th:text="${user.age}">2.41</td>
</tr>
```

`${users}` 是要遍历的集合，可以是以下类型：

- `Iterable`，实现了`Iterable`接口的类
- `Enumeration`，枚举
- `Interator`，迭代器
- `Map`，遍历得到的是`Map.Entry`
- `Array`，数组及其它一切符合数组结果的对象

在迭代的同时，也可以使用`stat`获取迭代的对象的状态，stat对象包含以下属性：

- `index`，从0开始的角标
- `count`，元素的个数，从1开始
- `size`，总元素个数
- `current`，当前遍历到的元素
- `even/odd`，返回是否为奇偶，boolean值
- `first/last`，返回是否为第一或最后，boolean值

```html
<tr th:each="user,stat : ${users}">
    <td th:text="${stat.index}"></td>
    <td th:text="${stat.even}"></td>
    <td th:text="${stat.odd}"></td>
    <td th:text="${stat.size}"></td>
    <td th:text="${stat.crrunt}"></td>
    <td th:text="${stat.first}"></td>
    <td th:text="${stat.last}"></td>
</tr>
```

# 逻辑判断

Thymeleaf 支持多种判断：`th:if/th:unless`、逻辑运算符（and、or、not）、三目运算符。

```html
 <!-- 如果条件为真，执行标签内的内容 -->
<div th:if="${false}">
    条件为真
</div>

<!-- 如果添加为假，执行标签内的内容 -->
<div th:unless="${false}">
    条件为假
</div>
```

以下情况下会被视作true：

- 表达式值为true、非0数值、非空字符
- 表达式为不为`false`、`no`、`off`
- 表达式不为布尔、字符串、数字、字符中的任意一种

其他情况下都会视作false；

<br>

表达式中还可以使用逻辑运算符：`and`、`or`、`not`

```html
<div th:if="${true or false}">
    or 运算符
</div>

<div th:if="${not false}">
    not 运算符
</div>
```

<br>

三目运算符：

```html
<span th:text="true ? '结果为真' : '结果为假'"></span>
```



# 分支控制

```html
<div th:switch="${3}">
    <div th:case="0">选择值为0</div>
    <div th:case="1">选择值为1</div>
    <div th:case="2">选择值为2</div>
    <div th:case="*">选择值不为0，1，2</div>
</div>
```

> 注意：这里演示的案例，都是写死的值，在开发中，应该是读取作用域对象中的值。一旦有一个`th:case`成立，其它的则不再判断。与Java中的switch是一样的。

# JavaScript 模板

模板引擎不仅可以渲染html，也可以对JS中的进行预处理。而且为了在纯静态环境下可以运行，其Thymeleaf代码可以被注释起来：

```html
<!--script标签中加入：th:inline="javascript，使用内联表达式取值-->
<script th:inline="javascript">
    var user = /*[[${user}]]*/ {};
    var age = /*[[${user.age}]]*/ 20;
    console.log(user);
    console.log(age);
</script>
```

在`<script>`标签中通过`th:inline="javascript"`来声明这是要特殊处理的JavaScript脚本

语法结构：

```javascript
var user = /*[[Thymeleaf表达式]]*/ "静态环境下的默认值";
```

因为Thymeleaf语句被注释起来，因此即便是静态环境下， JavaScript代码也不会报错，而是采用表达式后面跟着的默认值。且User对象会被直接处理为json格式。

# 代码片段

```html
<html lang="en" xmlns:th="http://www.thymeleaf.org">
    <head th:fragment="static(title)" >
    <!--th:fragment：表示这是一个可复用的公共代码片段-->
        <meta charset="utf-8">
        <title th:text="${title}"></title>
        ...
    </head>
    
    <head id="xxx" th:fragment="static(title)" >
    <!--th:fragment：表示这是一个可复用的公共代码片段-->
        <meta charset="utf-8">
        <title th:text="${title}"></title>
        ...
    </head>
```

**引用代码片段**

```html
<!--th:replace：读取一个代码片段，::前为代码片段路径，::后为传递参数-->
<div th:replace="~{common/head::static(页面标题)}"></div>

<div th:replace="~{common/head::#xxx(页面标题)}">
```

**引入代码片段的完整语法**

```
~{viewName}				表示引入完整页面
~{viewName::selector}	 表示在指定页面寻找片段。其中selector可为片段名，css选择器等，可以在一个HTML页面引入多个片段，可以通过id引入。
~{::selector}			表示在当前HTML页查找代码片段。
```



```
th:replace		不要自己的主标签，保留th:fragment的主标签
th:insert		保留自己的主标签，保留th:fragment的主标签
th:include		保留自己的主标签，不要th:fragment的主标签（不推荐）
```



# ThymeleafProperties

SpringBoot中的配置文件类

```java
//
// Source code recreated from a .class file by IntelliJ IDEA
// (powered by Fernflower decompiler)
//

package org.springframework.boot.autoconfigure.thymeleaf;

import ...

@ConfigurationProperties(
    prefix = "spring.thymeleaf"
)
public class ThymeleafProperties {
    private static final Charset DEFAULT_ENCODING;
    // 前缀
    public static final String DEFAULT_PREFIX = "classpath:/templates/";
    // 后缀
    public static final String DEFAULT_SUFFIX = ".html";
    private boolean checkTemplate = true;
    private boolean checkTemplateLocation = true;
    private String prefix = "classpath:/templates/";
    private String suffix = ".html";
    private String mode = "HTML";
    private Charset encoding;
    private boolean cache;
    private Integer templateResolverOrder;
    private String[] viewNames;
    private String[] excludedViewNames;
    private boolean enableSpringElCompiler;
    private boolean renderHiddenMarkersBeforeCheckboxes;
    private boolean enabled;
    private final ThymeleafProperties.Servlet servlet;
    private final ThymeleafProperties.Reactive reactive;

    public ThymeleafProperties() {
        this.encoding = DEFAULT_ENCODING;
        this.cache = true;
        this.renderHiddenMarkersBeforeCheckboxes = false;
        this.enabled = true;
        this.servlet = new ThymeleafProperties.Servlet();
        this.reactive = new ThymeleafProperties.Reactive();
    }

    public boolean isEnabled() {
        return this.enabled;
    }

    public void setEnabled(boolean enabled) {
        this.enabled = enabled;
    }

    public boolean isCheckTemplate() {
        return this.checkTemplate;
    }

    public void setCheckTemplate(boolean checkTemplate) {
        this.checkTemplate = checkTemplate;
    }

    public boolean isCheckTemplateLocation() {
        return this.checkTemplateLocation;
    }

    public void setCheckTemplateLocation(boolean checkTemplateLocation) {
        this.checkTemplateLocation = checkTemplateLocation;
    }

    public String getPrefix() {
        return this.prefix;
    }

    public void setPrefix(String prefix) {
        this.prefix = prefix;
    }

    public String getSuffix() {
        return this.suffix;
    }

    public void setSuffix(String suffix) {
        this.suffix = suffix;
    }

    public String getMode() {
        return this.mode;
    }

    public void setMode(String mode) {
        this.mode = mode;
    }

    public Charset getEncoding() {
        return this.encoding;
    }

    public void setEncoding(Charset encoding) {
        this.encoding = encoding;
    }

    public boolean isCache() {
        return this.cache;
    }

    public void setCache(boolean cache) {
        this.cache = cache;
    }

    public Integer getTemplateResolverOrder() {
        return this.templateResolverOrder;
    }

    public void setTemplateResolverOrder(Integer templateResolverOrder) {
        this.templateResolverOrder = templateResolverOrder;
    }

    public String[] getExcludedViewNames() {
        return this.excludedViewNames;
    }

    public void setExcludedViewNames(String[] excludedViewNames) {
        this.excludedViewNames = excludedViewNames;
    }

    public String[] getViewNames() {
        return this.viewNames;
    }

    public void setViewNames(String[] viewNames) {
        this.viewNames = viewNames;
    }

    public boolean isEnableSpringElCompiler() {
        return this.enableSpringElCompiler;
    }

    public void setEnableSpringElCompiler(boolean enableSpringElCompiler) {
        this.enableSpringElCompiler = enableSpringElCompiler;
    }

    public boolean isRenderHiddenMarkersBeforeCheckboxes() {
        return this.renderHiddenMarkersBeforeCheckboxes;
    }

    public void setRenderHiddenMarkersBeforeCheckboxes(boolean renderHiddenMarkersBeforeCheckboxes) {
        this.renderHiddenMarkersBeforeCheckboxes = renderHiddenMarkersBeforeCheckboxes;
    }

    public ThymeleafProperties.Reactive getReactive() {
        return this.reactive;
    }

    public ThymeleafProperties.Servlet getServlet() {
        return this.servlet;
    }

    static {
        DEFAULT_ENCODING = StandardCharsets.UTF_8;
    }

    public static class Reactive {
        private DataSize maxChunkSize = DataSize.ofBytes(0L);
        private List<MediaType> mediaTypes;
        private String[] fullModeViewNames;
        private String[] chunkedModeViewNames;

        public Reactive() {
        }

        public List<MediaType> getMediaTypes() {
            return this.mediaTypes;
        }

        public void setMediaTypes(List<MediaType> mediaTypes) {
            this.mediaTypes = mediaTypes;
        }

        public DataSize getMaxChunkSize() {
            return this.maxChunkSize;
        }

        public void setMaxChunkSize(DataSize maxChunkSize) {
            this.maxChunkSize = maxChunkSize;
        }

        public String[] getFullModeViewNames() {
            return this.fullModeViewNames;
        }

        public void setFullModeViewNames(String[] fullModeViewNames) {
            this.fullModeViewNames = fullModeViewNames;
        }

        public String[] getChunkedModeViewNames() {
            return this.chunkedModeViewNames;
        }

        public void setChunkedModeViewNames(String[] chunkedModeViewNames) {
            this.chunkedModeViewNames = chunkedModeViewNames;
        }
    }

    public static class Servlet {
        private MimeType contentType = MimeType.valueOf("text/html");
        private boolean producePartialOutputWhileProcessing = true;

        public Servlet() {
        }

        public MimeType getContentType() {
            return this.contentType;
        }

        public void setContentType(MimeType contentType) {
            this.contentType = contentType;
        }

        public boolean isProducePartialOutputWhileProcessing() {
            return this.producePartialOutputWhileProcessing;
        }

        public void setProducePartialOutputWhileProcessing(boolean producePartialOutputWhileProcessing) {
            this.producePartialOutputWhileProcessing = producePartialOutputWhileProcessing;
        }
    }
}

```



# 相关推荐

> [Thymeleaf使用详解](https://www.cnblogs.com/ityouknow/p/5833560.html)
>
> [Thymeleaf【快速入门】](https://www.jianshu.com/p/ac8201031334)
>
> [Thymeleaf基本表达式](http://www.baikeyang.com/code/97351.html)
>
> [Spring Boot 之 Thymeleaf 篇](http://www.baikeyang.com/code/97344.html)







