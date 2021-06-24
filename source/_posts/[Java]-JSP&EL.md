---
title: JSP & EL表达式
tags: [JSP, EL]
categories: Java
date: 2020-09-25 16:09:28




---



[![](https://s1.ax1x.com/2020/11/03/ByLY5j.jpg)](https://imgchr.com/i/ByLY5j)

<!--more-->

# JSP

## JSP规范介绍

- 来自于JavaEE规范中一种
- JSP规范制定了如何开发JSP文件代替响应对象将处理结果写入到响应体的开发流程
- JSP规范制定Http服务器应该如何调用管理JSP文件
- JSP文件在执行时，自动将文件所有内容写入到响应体，从而不用书写`respone.getWriter().print();`

**优势：**

- JSP文件在互谅网通信过程，是响应对象代替品
- 降低将处理结果写入到响应体的开发工作量降低处理结果维护难度
- 在JSP文件开发时，可以直接将处理结果写入到JSP文件不需要手写`respone.getWriter().print();`命令，在Http服务器调用JSP文件时，根据JSP规范要求自动的将JSP文件书写的所有内容通过输出流写入到响应体

## 响应对象存在的弊端

- 适合将数据量较少的处理结果写入到响应体
- 如果处理数量过多，使用响应对象增加开发难度

## JSP文件内置对象

## request

类型：HttpServletRequst

作用：在JSP文件运行时，读取请求包信息与Servlet在请求转发过程中实现数据共享

## session

类型：HTTPSession

作用：在JSP文件运行时，session可以指向当前用户私人储物柜，添加共享数据或者读取共享数据

## application

类型：ServletContext()

作用：在JSP文件运行时，通过全局作用域对象实现数据共享

## Servlet 与 JSP分工

**Servlet：**负责处理业务并得到处理结果 --- 大厨师

**JSP：**不负责处理业务，主要任务将Servlet中处理结果写入到响应体 --- 传菜员

**Servlet** 与 **JSP**之间的调用关系：Servlet工作完毕后，一般通过【请求转发】方式向Tomcat申请调用JSP

## Servlet与JSP之间如何实现数据共享

1. 使用【请求作用域对象】实现数据共享

2. 使用【全局作用对象】实现数据共享

Servlet将处理结果添加到【请求作用域对象(request)】

JSP文件在运行时从【请求作用域对象(request)】得到处理结果

代码示例：

在Servlet接口实现类下(OneServlet.java)

```java
Person p1 = new Person(1,"a");
Person p2 = new Person(2,"b");
List<Person> personList = new ArrayList<>();
personList.add(p1);
personList.add(p2);
// 将处理结果添加到请求作用域对象
request.setAttribute("key",personList);
// 通过请求转发方案，向Tomcat申请调用user_show.jsp，同时将request与response通过Tomcat交给user_show.jsp使用
request.getRequestDispatcher("/user_show.jsp").forward(request,response);
```

在JSP文件中读取：

```jsp
<%=
    List<Person> personList = (List<Person>) application.getAttributee("key");
%>
```

## Http服务器调用JSP文件步骤(面试题)

1. Http服务器将JSP文件内容【编辑】为一个Servlet接口实现类(.java)

2. Http服务器将Servlet接口实现类【编译】为class文件(.class)

3. Http服务器负责创建这个class的实例对象，这个实例对象就是Servlet实例对象

4. Http服务器通过Servlet实例对象调用`jsp_service`方法，将JSP文件内容写入到响应体

**Http服务器【编辑】与【编译】JSP文件位置：**

`tomcat\[网站工作空间]\work\Catalina\localhost\[网站别名]\org\apache\jsp`

# EL表达式

## El工具包介绍

- 由Java技术开发的一个jar包
- 作用降低JSP文件开发时Java命令开发强度
- Tomcat服务器本身自带了EL工具包(在Tomcat安装地址`/lib/el-api.jar`)
- JSP文件作用：代替响应对象将Servlet中`doGet/doPost`的执行结果写入到响应体



## EL表达式与作用域对象别名

1. 命令格式：`${作用域对象别名.共享数据}`  例子：`${applicationScope.key}`

2. 命令作用：

   - EL表达式是EL工具包提供一种特殊命令格式【表达式命令格式】
   - EL表达式在JSP文件上使用，负责在JSP文件上从作用域对象读取指定的共享数据并输出到响应体

3. JSP文件可以使用的作用域对象

   - 全局作用域对象(application)：`ServletContext application = new ServletContext();`

   - 会话作用域对象(session)：`HttpSession session = new HttpSession();`

   - 请求作用域对象(request)：`HttpServletRequest request = new HttpServletRequest();`

   - 当前页作用域对象(pageContext)：`PageContext pageContext = new PageContext();`

     这是JSP文件独有的作用域对象，Servlet中不存在。在【当前作用域对象】存放的共享数据仅能在当前JSP文件中使用，不能共享给其他Servlet或者其他JSP文件。在真实开发过程中，主要用于JSTL标签与JSP文件之间数据共享。`JSTL--->数据---> pageContex---> JSP`

4. EL表达式提供作用域对象别名

   |     JSP     |            EL表达式            |
   | :---------: | :----------------------------: |
   | application | ${applicationScope.共享数据名} |
   |   session   |   ${sessionScope.共享数据名}   |
   |   request   |   ${requestScope.共享数据名}   |
   | pageContex  |     ${pageScope.共享数据}      |

## 用EL表达式将引用对象属性写入到响应体

1. 命令格式：`${作用域对象别名.共享数据名.属性名}`

   例如：

   ```jsp
   Student student = new Student(100,"alex");
   　　request.setAttribute("key",student);
   　　<body>
   　　　　学号：${requestScope.key.studentNumber} <!--studentNumber来自于Student类属性,大小完全一致-->
   　　　　姓名：${requestScope.key.studentName}
   　　</body>
   　　${"A" == requestScope.key.answer?"cheched":""}
   ```

2. 命令作用：从作用域对象读取指定共享数据关联的引用对象的属性值，并自动将属性的结果写入到响应体

3. 属性名：一定要与类中的属性名一致

4. EL表达式没有提供遍历集合方法，因此无法从作用域对象读取集合内容输出

## EL表达式简化版

1. 命令格式：`${共享数据名}`

2. 命令作用：EL表达式允许开发人员开发时省略作用域对象别名

3. 工作原理：

   EL表达式简化版由于没有指定作用域对象，所以在执行时采用【猜】算法，首先到`pageContext`定位共享数据，如果存在直接输出并结束执行，如果在`pageContext`没有定位成功，到`request`定位共享数据，如果存在直接输出并结束执行，由此类推，再到`session、application`。如果都没定位成功则返回null。

   总结：查找顺序(自上而下)`pageContext --> request --> session --> application --> null`

4. 存在隐患：

   容易降低程序执行的速度（南辕北辙），容易导致数据定位错误

5. 应用场景：

   简化从`pageContext`读取共享数据并输出难度

6. **EL表达式简化版尽管存在很多隐患，但是在实际开发过程中，为了节省时间，一般都使用简化版，拒绝使用标准版**

## EL表达式 -- 支持运算表达式

1. 前提：在JSP文件有时需要将读取共享数据进行一番运算之后，将运算结果写入到响应体

   ```jsp
   <!--传统的Java命令-->
   <%
   　　String num1 = (String) request.getAttribute("key1");
   　　Integer num2 = (Integer) request.getAttribute("key2");
   　　int sum = Integer.valueOf(num1) + num2;
   %>
   sum=<%=sum%>
   ```

   El表达式简化版(支持运算)

   ```jsp
   <!--不用写读取语句直接就可以获取-->
   sum=${key1+key2}
   ```

2. 运算表达式（JSP只做简单输出，复杂判断一般交给Servlet）

   - 数学运算

   - 关系运算：> < = >= <= !=

     部分代码示例：

     ```jsp
     request.setAttribute("age",22);
     --------------------------------
     ${age>18?"欢迎光临":"谢绝入内"}
     ```

   - 逻辑运算： && || !



## EL表达式提供的内置对象

1. 命令格式：`${param.请求参数名}`

2. 命令作用：通过请求对象读取当前请求包中请求参数内容，并将请求参数内容写入到响应体

3. 代替命令：浏览器发送请求Http://localhost:8080/myWeb/index.jsp?userName=alex&passWord=123时获取请求参数的值

   ```jsp
   <!--JSP命令获取-->
   <%
   	String userName = request.getParameter("userName");
   	String passWord = request.getParameter("passWord");
   %>
   用户名：<%=userName%>
   密  码：<%=passWord%>
   ------------------------------------------------------
   <!--EL表达式获取-->
   用户名：${param.userName}
   密  码：${param.passWord}
   ```

1. 命令格式：`${paramValues.请求参数名[下标]}`

2. 命令作用：如果浏览器发送的请求参数时，一个请求参数关联多个值，此时可以通过`paramValues`读取请求参数下指定位置的值，并写入到响应体

3. 代替命令：浏览器发送请求http://localhost:8080/myWeb/index.jsp?page=1&page=2&page=3，此时page请求参数在【http请求包】以数组形式存在----`page:[1,2,3]`

   ```jsp
   <!--JSP命令获取-->
   <%
   　　　　String[] array = request.getParameterValues("page");
   %>
   第一个值：<%=array[0]%>
   第二个值：<%=array[1]%>
   第三个值：<%=array[2]%>
   -----------------------------------------
   <!--EL表达式获取-->
   第一个值：${paramValues.page[0]}
   第二个值：${paramValues.page[1]}
   第三个值：${paramValues.page[2]}
   ```

   

## 常见异常

`javax.el.PropertyNotFoundException`：在对象中没有找到指定属性。