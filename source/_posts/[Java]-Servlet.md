---
title: Servlet
tags: [Servlet, Java]
categories: Java
date: 2020-09-25 16:09:28


---







假装有封面.jpg

[[](https://s1.ax1x.com/2020/11/03/ByLgi9.jpg)](https://imgchr.com/i/ByLgi9)

<!--more-->

# Servlet 规范介绍

1. servlet规范来自于javaee规范中的一种

2. 作用：
   - 在servlet规范中，指定【动态资源文件】开发步骤
   - 在servlet规范中，指定http服务器调用动态资源文件规则
   - 在servlet规范中，指定http服务器管理动态资源文件实例对象规则

# Servlet 接口实现类

1. servlet接口来自于servlet规范下的一个接口，这个接口存在于http服务器提供的jar包下

2. Tomcat 服务器下 lib 文件有一个`servlet-api.jar`存放servlet接口(`javax.servlet.Servlet`接口)

3. servlet规范中任务，http服务器能调用的【动态资源文件】必须是一个servlet接口实现类

   例子：

```java
　class Student{
　　　　// 不是动态资源文件，Tomcat无权调用
　　}

　　class Teacher implements Servlet{
　　　　// 合法动态资源文件，Tomcat有权利调用
　　　　// Servlet obj = new Teacher();
　　　　// obj.getName();
　　}
```



![](https://s1.ax1x.com/2020/08/24/dBviFA.png)

# Servlet 接口实现类开发

第一步：创建一个Java类继承与HttpServlet父类，使之成为一个Servlet接口实现类

第二步：重写HttpServlet父类两个方法。doGet()或者doPost()

　　浏览器 ---get---> oneServlet.doGet()

　　浏览器 ---post---> oneServlet.doPost()

第三步：将Servlet接口实现类信息【注册】到Tomcat服务器

【网站】---> 【web】-->【WEB-INF】-->web.xml

```XML
<!--将servlet接口实现类类路径地址交给Tomcat-->
<servlet>
    <servlet-name>howie</servlet-name><!--声明一个变量存储servlet接口实现类类路径-->
    <servler-class>com.howie.controller.OneServlet</servlet-class> <!--声明servlet接口实现类类路径-->
</servlet>

<!--Tomcat String howie = "com.howie.controller.OneServlet";-->
<!--为了降低用户访问Servlet接口实现类难度，需要设置简单请求别名-->
<servlet-mapping>
    <servlet-name>howie</servlet-name>
    <url-pattern>/one</url-pattern><!--设置简短请求别名，别名在书写时必须以"/"开头-->
</servlet-mapping>
```

此时如果在浏览器向Tomcat索要OneServlet时地址:http://localhost:8080/myWeb/one

servlet接口实现类开发举例

1. 在建好的网站 src 下新建包和接口实现类(例如：com.howie.controller.OneServler)注意controller是固定写法,重写doGet/doPost方法

```java
package com.howie.controller;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

/*
子类 -extends-> 父类 -extends-> A接口
此时 子类 也是A接口实现类

Servlet接口：
    init()
    getServletConfig()
    getServletInfo()
    destory() ---四个方法对于Servlet接口实现类没用

    service() ---有用

抽象类的作用：
    降低接口实现类对接口实现过程难度，将接口中不需要使用的抽象方法交给抽象类进行完成，这样接口实现类只需要对接口需要的方法进行重写
    例如：下面这个OneServlet类，如果实现Servlet接口，就必须对Servlet接口定义的方法进行重写，但是有些方法又不需要使用，如果继承
    HttpServlet实现类，就只需要对有用的方法进行重写就可以了

Tomcat根据Servlet规范调用Servlet接口实现类规则
    1.Tomcat有权创建Servlet接口实现类实例对象 Servlet oneServlet = new OneServlet();
    2.Tomcat根据实例对象调用servlet方法处理当前请求 oneServlet.service()

继承关系：
OneServlet --extends--> (abstract)HttpServlet --extends--> (abstract)GenericServlet --implements--> (interface)Servlet

通过父类决定在何种情况下调用子类方法 -----【设计模式】 --- 模板设计模式
HttpServlet:
    service(){
        if(请求方式 == "GET"){
            this.doGet()
        } else if(请求方式 == "POST"){
            this.doPost()
        }
    }
 */
public class OneServlet extends HttpServlet {
    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        System.out.println("OneServlet针对浏览器发送get请求方式处理");
    }

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        System.out.println("OneServlet针对浏览器发送post请求方式处理");
    }
}
```

2. 将Servlet接口实现类信息【注册】到Tomcat服务器

```XML
<?xml version="1.0" encoding="UTF-8"?>
<web-app xmlns="http://xmlns.jcp.org/xml/ns/javaee"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://xmlns.jcp.org/xml/ns/javaee http://xmlns.jcp.org/xml/ns/javaee/web-app_4_0.xsd"
         version="4.0">
    <!--servlet接口实现类类路径地址交给Tomcat-->
    <servlet>
        <servlet-name>oneServlet</servlet-name>
        <servlet-class>com.howie.controller.OneServlet</servlet-class>
    </servlet>

    <!--为servlet接口实现类提供简单别名-->
    <servlet-mapping>
        <servlet-name>oneServlet</servlet-name>
        <url-pattern>/one</url-pattern>
    </servlet-mapping>
</web-app>
```

3. 打卡Tomcat服务器，在浏览器中测试即可

# Servlet 对象生命周期

1. 网站中所有的servlet接口实现类的实例对象，只能由http服务器负责创建，开发人员不能手动创建Servlet接口实现类的实例对象

2. 在默认的情况下，http服务器接收到对于当前Servlet接口实现类第一次请求时，自动创建这个Servlet接口实现类的实例对象

   在手动配置情况下，要求http服务器在启动时自动创建某个servlet接口实现类的实例对象

```XML
<servlet>

　　<servlet-name>howie</servlet-name><!--声明一个变量存储servlet接口实现类类路径-->

　　<servler-class>com.howie.controller.OneServlet</servlet-class> <!--声明servlet接口实现类类路径-->

　　<load-on-startup>2</load-on-startup> <!--填写一个大于0的整数-->

</servlet>
```

3. 在http服务器运行期间，一个servlet接口实现类只能被创建出一个实例对象

4. 在http服务器关闭时刻，自动将网站中所有的servlet对象进行销毁

 

代码测试

**src/com/howie/controller/OneServlet.java**

```java
package com.howie.controller;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

public class OneServlet extends HttpServlet {
    public OneServlet(){
        System.out.println("http服务器创建了OneServlet实例对象呀");
    }
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {

    }

    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        System.out.println("OneServlet's doGet is run...");
    }
}
```

**src/com/howie/controller/TwoServlet.java**

```java
package com.howie.controller;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

public class TwoServlet extends HttpServlet {
    public TwoServlet(){
        System.out.println("TwoServlet实例对象被创建了");
    }
    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        System.out.println("TwoServlet's doGet is run...");
    }

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        System.out.println("TwoServlet's doPost is run...");
    }
}
```

**web/WEB-INF/web.xml**

```xml
<?xml version="1.0" encoding="UTF-8"?>
<web-app xmlns="http://xmlns.jcp.org/xml/ns/javaee"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://xmlns.jcp.org/xml/ns/javaee http://xmlns.jcp.org/xml/ns/javaee/web-app_4_0.xsd"
         version="4.0">
    <servlet>
        <servlet-name>OneServlet</servlet-name>
        <servlet-class>com.howie.controller.OneServlet</servlet-class>
    </servlet>

    <servlet>
        <servlet-name>TwoServlet</servlet-name>
        <servlet-class>com.howie.controller.TwoServlet</servlet-class>
        <!--通知Tomcat在启动时负责创建TwoServlet实例对象-->
        <load-on-startup>5</load-on-startup>
    </servlet>

    <servlet-mapping>
        <servlet-name>OneServlet</servlet-name>
        <url-pattern>/one</url-pattern>
    </servlet-mapping>

    <servlet-mapping>
        <servlet-name>TwoServlet</servlet-name>
        <url-pattern>/two</url-pattern>
    </servlet-mapping>
</web-app>
```

说明：该网站交给Tomcat管理后，在浏览器中以**OneServlet接口实现类的别名/one**访问该网站后（也就是回车），Tomcat服务器接收到对于当前Servlet接口实现类第一次请求，Tomcat就调用OneServlet类的构造方法，控制台输出："http服务器创建了OneServlet实例对象呀"。而对于TwoServlet类，我们在web.xml中设置了TowServlet的`[<load-on-startup>2</load-on-startup>]`，在Tomcat启动时就调用TwoServlet类的构造方法。



# HttpServletResponse 接口

1. 介绍：
   - HttpServletResponse接口来自于Servlet规范中，在Tomcat中存在servlet-api.jar
   - HttpServletResponse接口实现类由http服务器负责提供
   - HttpServletResponse接口负责将doGet/doPost方法执行结果写入到【响应体】交给浏览器
   - 开发人员习惯于将HttpServletResponse接口修饰的对象称为【响应对象】

2. 主要功能：
   - 将执行结果以二进制形式写入到【响应体】
   - 设置响应头中[content-type]属性值，从而控制浏览器使用对应编译器将响应体二进制数据编译为【文字、图片、视频、命令】
   - 设置响应体中【location】属性，将一个请求地址复制给location。从而控制浏览器向指定服务器发送请求

3.测试代码

**src/com/howie/controller/OneServlet.java**

```java
package com.howie.controller;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.PrintWriter;

public class OneServlet extends HttpServlet {
    // 暂时不用
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {

    }

    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        String result = "<h1>Hello World</h1>"; // 执行结果
        // 将响应对象结果写入到响应体 -- start
        // 1.通过响应对象，向Tomcat索要输出流
        PrintWriter out = response.getWriter();

        // 2.通过输出流，将执行结果以二进制形式写入到响应体中
        out.write(result);
        // 将响应对象结果写入到响应体 -- start
    } // doGet执行完毕，Tomcat将响应包推送给浏览器
}
```

**src/com/howie/controller/TwoServlet.java**

```java
package com.howie.controller;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.PrintWriter;

public class TwoServlet extends HttpServlet {
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {

    }
    /*
    问题描述：浏览器接收到的数据是2，不是50
    问题原因：
        out.writer方法可以将【字符】、【字符串】、【ASCII】写入到响应体
        [ASCII]：a --- 97
                 2 --- 50
     问题解决方案：实际开发过程中，都是通过out.print()将真实数据写入到响应体中

     */
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        int money = 50; // 执行结果
        PrintWriter out = response.getWriter();
        // out.write(money);
        out.print(money);
    }
}
```

**src/com/howie/controller/ThreeServlet.java**

```java
package com.howie.controller;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.PrintWriter;

public class ThreeServlet extends HttpServlet {
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {

    }

    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        String result = "Java<br/>MySQL<br/>Python<br>道阻且长，行则将至。"; // 既有文字信息又有HTML标签命令
        /*
        [问题描述]：
        ①Java<br/>MySQL<br/>Python，此时浏览器在接收到响应结果时，将<br/>作为文字内容在窗口展示出来，没有将<br/>当做HTML标签命令来执行
        ②如果是中文还会出现乱码，这时我们只需设置编码格式即可
        [问题原因]：
        ①浏览器在接收到响应包之后，根据【响应头中content-type0】属性的值，来采用对应【编译器】对【响应体中二进制内容】进行编译处理
        ②默认情况下，content-type属性的值为"text"
        [解决方案]：
        ①在得到输出流之前，对响应头中[content-type]属性，进行重新赋值
         */
        // 重新设置content-type属性
        response.setContentType("text/html;charset=utf-8");
        PrintWriter out = response.getWriter();
        out.print(result);

        String url = "http://www.baidu.com";
        // 通过响应对象，将地址赋值给响应头中location属性
        response.sendRedirect(url); // [响应头 location="http://www.baidu.com"]
        /*
        浏览器在接收到响应包之后，如果发现响应头中存在location属性，自动通过地址栏向location指定网站发送请求
        sendRedirect方法远程控制浏览器请求行为[请求地址 请求方式 请求参数]
         */
    }
}
```

**web/WEB-INF/web.xml**

```xml
<?xml version="1.0" encoding="UTF-8"?>
<web-app xmlns="http://xmlns.jcp.org/xml/ns/javaee"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://xmlns.jcp.org/xml/ns/javaee http://xmlns.jcp.org/xml/ns/javaee/web-app_4_0.xsd"
         version="4.0">
    <servlet>
        <servlet-name>OneServlet</servlet-name>
        <servlet-class>com.howie.controller.OneServlet</servlet-class>
    </servlet>
    <servlet>
        <servlet-name>TwoServlet</servlet-name>
        <servlet-class>com.howie.controller.TwoServlet</servlet-class>
    </servlet>
    <servlet>
        <servlet-name>ThreeServlet</servlet-name>
        <servlet-class>com.howie.controller.ThreeServlet</servlet-class>
    </servlet>
    <servlet-mapping>
        <servlet-name>OneServlet</servlet-name>
        <url-pattern>/one</url-pattern>
    </servlet-mapping>
    <servlet-mapping>
        <servlet-name>TwoServlet</servlet-name>
        <url-pattern>/two</url-pattern>
    </servlet-mapping>
    <servlet-mapping>
        <servlet-name>ThreeServlet</servlet-name>
        <url-pattern>/three</url-pattern>
    </servlet-mapping>
</web-app>
```



# HttpServletRequest 接口

1. 介绍：
   - HttpServletRequest接口来自于Servlet规范中，在Tomcat中存在servlet-api.jar
   - HttpServletRequest接口实现类由http服务器(Tomcat)负责提供
   - HttpServletRequest接口负责在doGet/doPost方法运行时读取Http协议包中信息
   - 开发人员习惯于将HttpServletRequest接口修饰的对象称为【请求对象】

2. 作用：
   - 可以http请求协议包中【请求行】信息
   - 可以读取保存在Http请求协议包中【请求头】或者【请求体】中请求参数信息
   - 可以代替浏览器向Http服务器申请资源文件的调用

3. 代码示例：

**src/com/howie/controller/OneServlet.java**

```java
package com.howie.controller;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

public class OneServlet extends HttpServlet {
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {

    }

    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        // 1.通过请求对象，读取【请求行】中【url】信息
        String url = request.getRequestURL().toString();
        // 2.通过请求对象，读取【请求行】中【method】信息
        String method = request.getMethod();
        // 3.通过请求对象，读取【请求行】中【URI】信息，注意URI：资源文件精准定位地址，请求行中并没有此属性，从url中截取。
        String uri = request.getRequestURI(); // 字符串格式：/网站名/资源文件
        System.out.println("URL: " + url); // URL: http://localhost:8080/myWeb/one
        System.out.println("METHOD: " + method); // METHOD: GET
        System.out.println("URI: " + uri); // URI: /myWeb/one
    }
}
```

**src/com/howie/controller/TwoServlet.java**

```java
package com.howie.controller;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.Enumeration;

public class TwoServlet extends HttpServlet {
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        // 1.通过请求对象获得【请求头】中【所有请求参数名】
        Enumeration<String> parameterNames = request.getParameterNames(); // 将所有请求参数名称保存到一个枚举对象进行返回
        while(parameterNames.hasMoreElements()){
            String paramName = parameterNames.nextElement();
            // 2.通过请求对象读取指定的请求参数的值
            String value = request.getParameter(paramName);
            System.out.println(paramName + ": " + value);
        }
    }
}
```

**src/com/howie/controller/ThreeServlet.java**

```java
package com.howie.controller;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
/*
问题描述：
    以GET方式发送中文参数内容时，得到正常结果。而以POST方式发送中文参数内容时，得到【乱码】
问题原因：
    浏览器以GET方式发送请求，请求参数保存在【请求头】，在http请求协议包到达http服务器之后，第一件事就是进行解码
    请求头二进制内容由Tomcat负责解码，Tomcat9.0默认使用[utf-8]字符集

    浏览器以POST方式发送请求，请求参数保存在【请求体】，在http请求协议包到达http服务器之后，第一件事就是进行解码
    请求体二进制内容由当前请求对象(request)负责解码。request默认使用[ISO-8859-1]字符集，东欧字符集
解决方案：
    在post请求方式下，在读取请求内容，应该通知请求对象使用utf-8字符集对请求体内容进行异常重新解码
 */
public class ThreeServlet extends HttpServlet {
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        // 通知请求对象，使用utf-8字符集对请求体二进制内容进行一次重写解码
        request.setCharacterEncoding("utf-8");
        // 通过请求对象读取【请求体】参数信息
        String value = request.getParameter("username");
        System.out.println("请求体 username: " + value);
    }

    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        // 通过请求对象读取【请求头】参数信息
        String username = request.getParameter("username");
        System.out.println("请求头 username: " + username);
    }
}
```



# 请求对象和响应对象生命周期

1）在Http服务器接收到浏览器发送的【Http请求协议包】之后，自动为当前的【Http请求协议包】生成一个【请求对象】和一个【响应对象】

2）在Http服务器调用doGet/doPost方法时，负责将【请求对象】和【响应对象】作为实参传递到方法，确保doGet/doPost正确执行

3）在Http服务器(Tomcat)准备推送Http响应协议包之前，负责将本次请求关联的【请求对象】和【响应对象】进行销毁

图解

![](https://s1.ax1x.com/2020/08/24/dBvzpq.png)



# 网站链接数据库的准备工作

1. 创建用户信息表`Users.frm`(举例)

   ```sql
   create table Users(
   	userId int primary key auto_increment, # 用户编号(自增)
   	userName varchar(50), # 用户名
   	passWord varchar(50), # 用户密码
   	sex char(1), # 用户性别 '男' or '女'
   	email varchar(50) # 用户邮箱
   );
   ```

2. 在**src**下 **com.howie.entity.Users** 实体类

3. 在**src**下 **com.howie.entity.Util.JdbcUtils** [工具类复用]

4. 在**web**下**WEB-INF**下创建**lib**文件夹，存放**mysql**提供**JDBC**实现**jar**包

# 欢迎资源文件设置

1. 前提：用户可以记住网站名，但是不会记住网站资源文件名

2. 默认欢迎资源文件：

　　用户发送了一个针对某个网站的[默认请求]，此时由http服务器自动从当前网站返回的资源文件

　　正常请求：http://localhost:8080/myWeb/index.html

　　默认请求：http://localhost:8080/myWeb/

3. Tomcat关于默认欢迎文件定位规则

   - 规则位置：`Tomcat安装位置/conf/web.xml`

   - 规则命令：

     ```xml
     <welcome-file-list>
     	<welcome-file>index.html</welcome-file>
     	<welcome-file>index.htm</welcome-file>
     	<welcome-file>index.jsp</welcome-file>
     </welcome-file-list>
     ```

4. 设置当前网站的默认欢迎资源文件规则

   - 规则位置：`网站/web/WEB-INF/web.xml`

   - 规则命令：

     ```xml
     <welcome-file-list>
     	<welcome-file>index.html</welcome-file>
     </welcome-file-list>
     ```

   - 网站设置自定义默认文件定位规则，此时Tomcat自带定位将失效

# Http 状态码

1. 介绍：

   - 由三位数字组成的一个符号
- Http服务器在推送响应包之前，根据本次请求处理情况，将Http状态码写入到【响应(状态行)】上
   - 由100 -- 599组成，可分为5个大类

2. 作用：

   - 如果Http服务器针对本次请求，返回了对应的资源文件，通过Http状态码通知浏览器应该如何处理这个结果。

   - 如果Http服务器针对本次请求，无法返回对应的资源文件，通过Http状态码向浏览器解释不能提供服务的原因。

3. 分类：

   - **1xx**：最有特征的是100，通知浏览器本次返回的资源文件，并不是一个独立的资源文件，需要浏览器在接收响应包之后，继续向Http服务器索要依赖的其他资源文件

   - **2xx**：最常见的是200，通知浏览器本次返回的资源文件是一个完整独立资源文件，浏览器在接收到之后不需要索要其他关联文件

   - **3xx**：最常见的是302，通知浏览器本次返回的不是一个资源文件内容，而是一个资源文件地址，需要浏览器根据这个地址自动发起请求来索要这个资源文件。`response.sendRedirect("资源文件地址")`命令可以将资源地址写入到响应头中`location`属性中，而这个行为导致Tomcat将302状态码写入到状态行

   - **4xx**：

     404：通知浏览器由于在服务端没有定位到被访问的资源文件，因此无法提供帮助

     405：（前提：访问的资源文件必须是一个Servlet）通知浏览器在服务端已经定位到被访问的资源文件(Servlet)，但是这个Servlet对于浏览器采用的请求方式不能处理（请求方式在所访问的资源文件中不存在，e.g：以get方式访问，但Servlet中没有写doGet方法）

   - **5xx**：

     ```java
     int a = null; // null值不可以赋值给int
     Integer b = null; // 所有高级引用类型都可以赋值给null
     ```
```
     
     500：通知浏览器，在服务端已经定位到被访问的资源文件(Servlet)这个Servlet可以接收浏览器采用请求方式，但是Servlet在处理请求期间，由于Java异常导致处理失败

# 多个Servlet之间调用规则(重点)

1. 前提条件：

   某些来自于浏览器发送请求，往往需要服务端中多个Servlet协调处理。但是浏览器一次只能访问一个Servlet，导致用户需要手动通过浏览器发起多重请求才能得到服务。这样增加用户获得服务难度，导致用户放弃访问当前网站

2. 提高用户体验规则：

   无论本次请求设计到多少个Servlet，用户只需要【手动】通知浏览器发起一次请求即可

3. 多个Servlet之间调用规则：
   - **重定向解决方案**
   - **请求转发解决方案**

4. **重定向解决方案**：

   - 工作原理：

     用户第一次通过【手动方式】通知浏览器访问OneServlet，OneServlet工作完毕后，将TwoServlet地址写入到响应头，location属性中，导致Tomcat将302状态码写入到状态行

     在浏览器接收到响应包之后，会读取到302状态，此时浏览器自动根据响应头中location属性地址发起第二次请求，访问TwoServlet去完成请求中剩余的任务

   - 实现命令：

     ```java
    response.sendRedirect("请求地址") // 将地址写入到响应包中响应头中location属性
```

   - 特征：

     1. 请求地址：

        既可以把当前网站内部的资源文件地址发送给浏览器(/网站名/资源文件名)，也可以把其他网站资源文件地址发送给浏览器

     2. 请求次数：

        浏览器至少发送两次请求，但是只有第一次请求是用户手动发送，后续请求都是浏览器自动发送的。

     3. 请求方式：

        重定向解决方案中，通过地址栏通知浏览器发起下一次请求，因此通过重定向解决方案调用的资源文件接收的请求方式一定是【get】

     4. 缺点：
     
        重定向解决方案需要在浏览器与服务器之间进行多次往返，大量时间在往返次数上，增加用户等待服务时间

图解

![](https://s1.ax1x.com/2020/08/24/dBxVhR.png)

5. **请求转发解决方案**

   - 工作原理：

     用户第一次通过手动方式要求浏览器访问OneServlet。OneServlet工作完毕后，通过当前的请求对象代替浏览器向Tomcat发送请求，申请调用TwoServlet，Tomcat在接收到这个请求之后，自动调用TwoServlet来完成剩余任务

   - 实现命令：请求对象代替浏览器向Tomcat发送请求

     ```java
     // 1.通过当前请求对象生成资源文件申请报告对象
     RequestDispatcher report = request.getRequestDispatcher("/资源文件名");   //一定要以"/"开头
     // 2.将报告对象发送给Tomcat
     report.forward(当前请求对象，当前响应对象)
     ```

   - 优点：

     1. 无论本次请求设计到多个Servlet，用户只需要手动通过浏览器发送一次请求
     2. Servlet之间调用发生在服务端计算机上，节省服务端与浏览器之间往返次数增加处理服务速度

   - 特征：

     1. 请求次数：

        在请求转发过程中，浏览器只发送一次请求

     2. 请求地址：

        只能向Tomcat服务器申请调用当前网站下资源文件地址

        ```java
        request.getRequestDispathcer("/资源文件名");   //注意不要写网站名
        ```

     3. 请求方式：

        在请求转发过程中，浏览器只发送了一个http请求协议包。参与本次请求的所有Servlet共享同一个请求协议包，因此这些Servlet接收的请求方式与浏览器发送的请求方式保持一致

图解

![](https://s1.ax1x.com/2020/08/24/dBx8Nd.png)

# 多个Servlet之间数据共享实现方案

1. 数据共享：

   OneServlet工作完毕后，将产生数据交给TwoServlet来使用

2. Servlet规范中提供四种数据共享方案
   - ServletContext接口
   - Cookie类
   - HttpSession接口
   - HttpServletRequest接口

## ServletContext接口

1. 介绍
   - 来自于Servlet规范中一个接口。在Tomcat中存在`servlet-api.jar`，在Tomcat中负责提供这个接口实现类
   - 如果两个Servlet来自于同一个网站。彼此之间通过网站的ServletContext实例对象实现数据共享
   - 开发人员习惯将ServletContext对象称为【全局作用域对象】

2. 工作原理：

   每一个网站都存在一个全局作用域对象，这个全局作用域对象相当于一个Map，在这个网站中OneServlet可以将一个数据存入到全局作用域对象，当前网站中其他servlet此时都可以从全局作用域对象得到这个数据进行使用

3. 全局作用域对象生命周期：

   - 在Http服务器启动过程中，自动为当前网站在内中创建一个全局作用域对象

   - 在Http服务器运行期间，一个网站只有一个全局作用域对象

   - 在Http服务器运行期间，全局作用域对象一直处于存活状态

   - 在Http服务器准备关闭时，负责将当前网站中全局作用域对象进行销毁处理

     **全局作用域对象生命周期贯穿网站整个运行期间**

4. 图解

![](https://s1.ax1x.com/2020/08/24/dBxIUJ.png)

5. 代码实现【同一个网站】OneServlet将数据共享给TwoServlet

   `OneServlet.java`

   ```java
   public class OneServlet {
   　　public void doGet(HttpServletRequest request,HttpServletResponse response){
   　　　　//1.通过【请求对象】向Tomcat索要当前网站中【全局作用域对象】
   　　　　ServletContext application = request.getServletContext();
   　　　　//2.将数据添加到全局作用域对象作为【共享数据】
   　　　　application.setAttribute("key",value);
   　　}
   }
   ```

   `TwoServlet.java`

   ```java
   public class TwoServlet {
   　　public void doGet(HttpServletRequest request,HttpServletResponse response) {
   　　　　//1.通过【请求对象】向Tomcat索要当前网站中【全局作用域对象】
   　　　　ServletContext application = request.getServletContext();
   　　　　//2.从全局作用域对象得到指定关键对应数据
   　　　　Object value = application.getAttribute("key");
   　　}
   }
   ```

   

## cookie

1. 介绍：
   - Cookie是来自于Servlet规范中一个工具类，存在于Tomcat提供的`servlet-api.jar`中
   - 如果两个Servlet来自于同一个网站，并且为同一个浏览器/用户提供服务，此时借助于Cookie对象进行数据共享
   - Cookie存放当前用户的私人数据，在共享数据过程中提高服务质量
   - 在现实生活场景中，Cookie相当于用户在服务端得到【会员卡】

2. 原理：
   - 用户通过浏览器第一次向MyWeb网站发送请求申请OneServlet，OneServlet在运行期间创建了一个Cookie存储与当前用户相关数据OneServlet工作完毕后，将Cookie写入到响应头交还给当前浏览器
   - 浏览器收到响应包之后，将cookie存储在浏览器的缓存，一段时间之后，用户通过【同一个浏览器】再次向【myWeb】发送请求，申请TwoServlet时：【浏览器需要无条件的将myWeb网站之前推送过来的Cookie写入请求头】发送过去
   - 此时TwoServlet在运行时，就可以通过读取请求头中cookie中信息，得到OneServlet提供的共享数据

3. 代码实现

   代码实现：同一个网站 OneServlet 与 TwoServlet 借助于Cookie实现数据共享

   ```java
   public class OneServlet {
   　　public void doGet(HttpServletRequest request,HttpServletResponse response){
   　　　　// 1.创建一个cookie对象，保存共享数据(当前用户 数据)
   　　　　Cookie card = new Cookie("key1","value");
   　　　　// cookie相当于一个Map，并且一个cookie中只能存放一个键值对，这个键值对的key(key不能是中文)与value只能是String
   　　　　// 2.将cookie写入到响应头，交给浏览器
   　　　　response.addCookie(card);
   　　}
   }
   ```

   浏览器/用户 <----响应包 

   ​							请求头【200】

   　　　　　　　  响应头【cookie:key=value】

   　　　　　　　  空白行　

   ​							响应行【处理结果】

   

   浏览器向myWeb网站发送请求访问 TwoServlet --->请求包  

   ​																				请求行【url：/myWeb/two method:get】

   　　　　　　　　　　　　　　　　　　　　　　 请求头【请求参数:xxxx   Cookie key=value】

   ​																				空白行

   ​																				请求体

   ```java
   public class TwoServlet {
   　　public void doGet(HttpServletRequest request,HttpServletResponse response){
   　　　　// 1.调用请求对象从请求头得到浏览器返回的Cookie
   　　　　Cookie[] cookieArray = request.getCookie();
   　　　　// 2.循环遍历数据得到每一个cookie 的 key 与 value
   　　　　for(Cookie cookie : cookieArray){
   　　　　　　String key = cookie.getName(); // 读取key "key"
   　　　　　　String value = cookie.getValue(); // 读取value "value"
   　　　　　　// 提供较好服务过程....
   　　　　}
   　　}
   }
   ```

   

### Cookie实现数据共享案例：网站订餐-会员卡的发送与使用

![](https://s1.ax1x.com/2020/08/24/dBxOKK.png)

**src/com/howie/controller/AddVIPUserServlet.java**

```java
package com.webprograming.entuty;

import javax.servlet.ServletException;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

public class AddVIPUserServlet extends HttpServlet {
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        String userName,money;
        // 1.调用请求对象，读取【请求头】参数信息
        userName = request.getParameter("userName");
        money = request.getParameter("money");

        // 2.创建cookie对象并将cookie写入到响应对头
        Cookie card1 = new Cookie("userName",userName);
        Cookie card2 = new Cookie("money",money);
        // 指定Cookie card2在客户端硬盘上存活1分钟
        card2.setMaxAge(60);
        response.addCookie(card1);
        response.addCookie(card2);

        // 3.通知Tomcat将【将点餐页面】写入到响应体交给浏览器(请求转发)
        request.getRequestDispatcher("/order_list.html").forward(request,response);
        // 注意这里资源地址不能写 "/myWeb/order_list.html"
    }
}
```

**src/com/howie/controller/UsersOrderServlet.java**


```java
package com.webprograming.entuty;

import javax.servlet.ServletException;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.PrintWriter;

public class UsersOrderServlet extends HttpServlet {
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        int dumpling_price = 10;
        int noodles_price = 7;
        int coverRice_price = 8;
        int money = 0,spend = 0;
        String food,userName = null;
        Cookie[] cookies = null;
        Cookie newCookie = null;
        response.setContentType("text/html;charset=utf-8");
        PrintWriter out = response.getWriter();
        // 1.读取请求头中的参数信息，得到用户点餐的食物类型
        food = request.getParameter("food");
        // 2.读取请求头中的cookie
        cookies = request.getCookies();

        // 3.刷卡消费
        for(Cookie cookie:cookies){
            String key = cookie.getName();
            String value = cookie.getValue();
            if("userName".equals(key)){
                userName = value;
            } else if("money".equals(key)){
                money = Integer.valueOf(value);
                if("饺子".equals(food)){
                    if(dumpling_price > money){
                        out.print("用户 " + userName + " 余额不足，请充值！");
                    }else{
                        newCookie = new Cookie("money",(money - dumpling_price)+"");
                        spend = dumpling_price;
                    }
                }
                else if("面条".equals(food)){
                    if(noodles_price > money){
                        out.print("用户 " + userName + " 余额不足，请充值！");
                    }else{
                        newCookie = new Cookie("money",(money - noodles_price)+"");
                        spend = noodles_price;
                    }
                }
                else if("盖饭".equals(food)){
                    if(coverRice_price > money){
                        out.print("用户 " + userName + " 余额不足，请充值！");
                    }else{
                        newCookie = new Cookie("money",(money - coverRice_price)+"");
                        spend = coverRice_price;
                    }
                }
            }
        }

        // 4.将用户会员卡返回给用户
        response.addCookie(newCookie);
        // 5.将消费记录写入到响应包中
        out.print("用户 " + userName + "本次消费：" + spend + "，余额：" + (money-spend));
    }
}
```

4. Cookie生命周期

   - 在默认情况下，Cookie对象存放在浏览器的缓存中，因此只要浏览器关闭，cookie对象就被销毁掉

   - 在手动设置情况下，可以要求浏览器将接收的Cookie存放在客户端计算机上硬盘上，同时需要指定Cookie在硬盘上存活时间。在存活时间范围内，关闭浏览器关闭客户端计算机，关闭服务器，都不会导致Cookie被销毁，在存活时间到达时，Cookie自动从硬盘上被删除
```java
     cookie.setMaxAge(60); // cookie在硬盘上存活1分钟
```



## HttpSession接口

1. 介绍
   - HttpSession接口来自于Servlet规范下一个接口。存在于`Tomcat中servlet-api.jar`。其实现类由Http服务器提供。Tomcat提供实现类存在于`Servlet-api.jar`
   - 如果两个Servlet来自于同一个网站，并且为同一个浏览器/用户提供服务，此时借助于HttpSession对象进行数据共享
   - 开发人员习惯于将HTTPSession接口修饰对象称为【会话作用域对象】

2. HttpSession 与Cookie区别【面试题】

   - 存储位置：

     Cookie：存放于客户端计算机（浏览器内存/硬盘）

     HttpSession：存放于服务端计算机内存

   - 数据类型：

     Cookie对象存储数据类型只能是String

     HTTPSession对象可以存储任意类型的共享数据Object

   - 数据数量：

     一个Cookie对象只能存储一个共享数据，而HttpSession使用Map集合存储共享数据，所以可以存储任意数量共享数据

   - 参照物：

     Cookie相当于客户在服务端【会员卡】

     HttpSession相当于客户在服务端【私人保险柜】

3. 代码实现：同一个网站（myWeb）下OneServlet将数据传递给TwoServlet

   ```java
   public class OneServlet{
   　　public void doGet(HttpServletRequest request,HttpServletResponse response){
   　　　　// 1.调用请求对象下Tomcat索要当前用户在服务端的【私人存储物柜】
   　　　　HttpSession session = request.getSession();
   　　　　// 2.将数据添加到用户私【人储物柜】
   　　　　session.setAttribute("key",共享数据);
   　　}
   }
   ```

   浏览器访问/myWeb中TwoServlet

   ```java
   public class TwoServlet{
   　　public void doGet(HttpServlerRequest request,HttpServletResponse response){
   　　　　// 1.调用请求对象向Tomcat索要当前用户在服务端的私人储物柜
   　　　　HttpSession session = request.getSession();
   　　　　// 2.从会话作用域对象得到OneServlet提供的共享数据
   　　　　Object 共享数据 = session.getAttribute("key");
   　　}
   }
   ```

   

4. 案例实现：模拟购物车功能

   图解(流程图)

   ![](https://s1.ax1x.com/2020/08/24/dBzUi9.png)

   

   部分代码示例
   
   **src/com/howie/controller/OneServlet.java**
   
   ```java
   package com.webprograming.entuty;
   
   import javax.servlet.ServletException;
   import javax.servlet.http.HttpServlet;
   import javax.servlet.http.HttpServletRequest;
   import javax.servlet.http.HttpServletResponse;
   import javax.servlet.http.HttpSession;
   import java.io.IOException;
   
   public class OneServlet extends HttpServlet {
       protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
           String goodsName;
           Integer goodsNum;
           // 1.调用请求对象，读取【请求头】中的参数，得到用户选择商品名
           goodsName = request.getParameter("goodsName");
           // 2.调用请求对象，向Tomcat服务器索要当前用户的私人储物柜
           HttpSession session = request.getSession();
           // 3.将用户选购的商品添加到当前用户的私人储物柜
           goodsNum = (Integer) session.getAttribute(goodsName); // 防止空指针异常
           if(goodsNum == null){
               session.setAttribute(goodsName,1);
           }else{
               session.setAttribute(goodsName,goodsNum+1);
           }
       }
   }
   ```

   **src/com/howie/controller/TwoServlet.java**
   
   ```java
   package com.webprograming.entuty;
   
   import javax.servlet.ServletException;
      import javax.servlet.http.HttpServlet;
      import javax.servlet.http.HttpServletRequest;
      import javax.servlet.http.HttpServletResponse;
      import javax.servlet.http.HttpSession;
      import java.io.IOException;
      import java.util.Enumeration;
   
      public class TwoServlet extends HttpServlet {
          protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
              // 1.调用请求对象，向Tomcat索要当前用户在服务端的私人储物柜
              HttpSession session = request.getSession();
              // 2.将session中所有的key读取出来，存放一个枚举对象
              Enumeration<String> goodsNames = session.getAttributeNames();
              while(goodsNames.hasMoreElements()){
                  String goodsName = goodsNames.nextElement();
                  int goodsNum = (int)session.getAttribute(goodsName);
                  System.out.println("商品名称：" + goodsName + "商品数量：" + goodsNum);
              }
          }
      }
   ```

   


5. Http服务器如何将用户与HttpSession关联起来

   ![](https://s1.ax1x.com/2020/08/24/dBz4QP.png)

6. `getSession()`与`getSession(false)``的区别

   - `getSession()`

     如果当前用户在服务端已经拥有了自己的私人储物柜，要求Tomcat将这个私人储物柜进行返回，如果当前用户在服务端尚未拥有自己的私人储物柜。要求Tomcat为当前用户创建一个全新的私人储物柜

   - `getSession(false)`

     如果当前用户在服务端已经拥有了自己的私人储物柜，要求Tomcat将这个私人储物柜进行返回,如果当前用户在服务端尚未拥有自己的私人储物柜。此时Tomcat将返回null

7. `HttpSession`的生命周期
   
   - 用户与HttpSession关联时使用的Cookie只能存放在浏览器缓存中
   - 在浏览器关闭时，意味着用户与他的HttpSession关系被切断
   - 由于Tomcat无法检测浏览器何时关闭，因此在浏览器关闭时并不会导致Tomcat将浏览器关联的HttpSession进行销毁
- 为了解决这个问题，Tomcat为每一个HttpSession对象设置【空闲时间】这个空闲时间默认30分钟，如果当前HttpSession对象空闲时间达到30分钟，此时Tomcat认为用户已经放弃了自己的HttpSession，此时Tomcat就会销毁掉这个HttpSession
8. HttpSession空闲时间手动

   在当前网站/web/WEB-INF/web.xml

   ```xml
   <session-config>
   	<session-timeout>5</session-timeout><!--当前网站中每一个session最大空闲时间5分钟-->
   </session-config>
   ```



## HttpServletRequest接口

1. 介绍
   - 在同一个网站中，如果两个Servlet之间通过【请求转发】方式进行调用，彼此之间共享同一个请求协议包，而一个请求协议包只对应一个请求对象，因此Servlet之间共享同一个请求对象，此时就可以利用这个请求对象在两个Servlet之间实现数据共享
   - 在请求对象实现Servlet之间数据共享功能时，开发人员将请求对象称为【请求作用域对象】
   
2. 代码实现：OneServlet通过请求转发申请调用TwoServlet时，需要给TwoServlet提供共享数据

   `OneServlet.java`

   ```java
   public class OneServlet{
   　　public void doGet(HttpServletRequest request,HttpServletResponse response){
   　　　　// 1.将数据添加到【请求作用域对象】中attribute属性
   　　　　request.setAttribute("key",数据); // 数据类型可以是任意类型Object
   　　　　// 2.向Tomcat申请调用TwoServlet
   　　　　request.getRequestDispatcher("/two").forward(request,response);
   　　}
   }
   ```

   `TwoServlet.java`

   ```java
   public class TwoServlet{
   　　public void doGet(HttpServletRequest request,HttpServletResponse response){
   　　　　// 1.调用当前请求对象得到OneServlet写入到共享数据
   　　　　Object 数据 = request.getAttribute("key");
   　　}
   }
   ```



# Servlet规范扩展 -- 监听器接口

1. 介绍：
   - 一组来自于 Servlet 规范下的接口，共有8个接口，在Tomcat存在``servlet-api.jar`包
   - 监听器接口需要由开发人员亲自实现，http服务器提供 jar 包并没有对应的实现类
   - 监听器接口用于监控【作用域对象生命周期变化时刻】以及【作用域对象共享数据变化时刻】

2. 作用域对象：

   - 在 servlet 规范中，认为在服务端内存可以在某些条件下为两个servlet之间提供数据共享方案的对象，被称为【作用域对象】

   - Servlet 规范下作用域对象：

     ​	`ServletContext`：全局作用域对象

     ​	`HttpSession`：会话作用域对象

     ​	`HttpServletRequest`：请求作用域对象

3. 监听器接口实现类开源规范：三步
   - 根据监听的实际情况，选择对应监听器接口进行实现
   
   - 重写监听器接口声明【监听事件处理方法】

   - 在`web.xml`文件将监听器接口实现类注册到http服务器
   
     ```xml
     <listener>
         <listener-class>com.hugh.Lisener.OneServletListener.class</listener-class>
     </listener>
     ```
   
4. `ServletContextListener`接口：

   - 作用：通过这个接口合法的检测【全局作用域对象】被初始化时刻以及被销毁时刻

   - 监听事件处理方法：

     ​	`public void contextInitialized(ServletContextEvent sce)`：在全局作用域对象被Http服务器初始化被调用

     ​	`public void contextDestroyed(ServletContextEvent sce)`：在全局作用域对象被Http服务器销毁时候触发调用

5. `ServletContextAttributeListener`接口：

   - 作用：通过这个接口合法的检测【全局作用域对象】共享数据变化时刻

   - 监听事件处理方法：

     ​	`public void contextAdd()`：在全局作用域对象添加共享数据

     ​	`public void contextReplaced()`：在全局作用域对象更新共享数据

     ​	`public void contextRemove()`：在全局作用域对象删除共享数据

6. 全局作用域对象共享数据变化时刻

   ```java
   ServletContext application = request.getServletContext();
   application.setAttribute("key",100); // 新增共享数据
   application.setAttribute("key",200); // 更新共享数据
   application.removeAttribute("key"); // 删除共享数据
   ```


# Servlet规范扩展 -- 过滤器(Filter)接口

1. 介绍：

   - Servlet规范扩展，来自于Servlet规范下接口，在Tomcat中存在于`servlet-api.jar`包
   - Filter接口实现类由开发人员负责提供，http服务器不负责提供
   - Filter接口在http服务器调用资源文件之前，对http服务器进行拦截

2. 具体作用

   - 拦截http服务器，帮助http服务器检测当前请求合法性

     ```java
     public class TestFilter implements Filter{
     	@Override
     	public void doFilter(ServletRequest servletRequest, ServletResponse servletResponse, FilterChain filterChain) throws IOException, ServletException {
         	// filterChain 负责将请求对象和响应对象交还给Tomcat
             
         	// 1.通过拦截请求对象得到请求包参数信息，从而得到来访用户的真实年龄
     		String age = servletRequest.getParameter("age");
     		// 2.根据年龄，帮助http服务器判断本次请求合法性
     		if(Integer.valueOf(age) < 70){
     			// 请求合法
     			// 将拦截请求对象和响应对象交还给http服务器(Tomcat)，http继续调用资源文件
     			filterChain.doFilter(servletRequest,servletResponse); // 放行
     		} else{
     			// 过滤器代替http服务器拒绝本次请求
     			servletResponse.setContentType("text/html;charset=utf-8");
     			PrintWriter out = servletResponse.getWriter();
     			out.print("<center><font style='color:red;font-size:40px'>大爷，珍爱生命啊</font></center>");
         	}
     	}
     }
     ```

   - 拦截http服务器，对当前请求进行增强操作

     ```java
     public class PostEncodingFilter implements Filter{
         @Override
     	public void doFilter(ServletRequest servletRequest, ServletResponse servletResponse, FilterChain filterChain) throws Exception{
     		// 通知拦截的请求对象，使用utf-8字符集对当前请求信息进行一次重新编辑
     		servletRequest.setCharacterEncoding("utf-8");  // 进行增强操作
         	filterChain.doFilter(servletRequest,servletResponse);
     	}
     }
     
     
     /* web.xml
     
     将过滤器接口实现类注册到http服务器
     <filter>
     	<filter-name>PostEncodingFilter</filter-name>
     	<filter-class>com.webprograming.Filter.PostEncodingFilter</filter-class>
     </filter>
     
     通知Tomcat在调用所有资源文件前都需要PostEncodingFilter过滤器进行拦截
     <filter-mapping>
     	<filter-name>PostEncodingFilter</filter-name>
     	<url-pattern>/*</url-pattern> 
     </filter-mapping>
     
     */
     ```

3. Filter接口实现类开发步骤：三步

   - 创建一个Java类实现`Filter`接口
   - 重写`Filter`接口中的`doFilter`方法
   - 在`web.xml`将过滤器接口实现类注册到http服务器

4. Filter拦截地址格式

   - 命令格式：

     ```xml
     <filter-mapping>
     	<filter-name>oneFilter</filter-name>
     	<url-pattern>拦截地址</url-pattern>
     </filter-mapping>
     ```

   - 命令作用：拦截地址通知Tomcat在调用何种资源文件之前需要调用`OneFilter`过滤器进行拦截

5. 拦截的模式

   - 要求Tomcat在调用某一个具体文件之前，来调用OneFilter拦截

     ```xml
     <url-pattern>/img/mm.jpg</url-pattern>
     ```

   - 要求Tomcat在调用某一个文件夹下所有的资源文件之前，来调用OneFilter拦截

     ```xml
     <url-pattern>/img/*</url-pattern>
     ```

   - 要求Tomcat在调用任意文件夹下某种类型文件之前，来调用OneFilter拦截

     ```xml
     <url-pattern>*.jpg</url-pattern>
     ```

   - 要求Tomcat在调用网站中任意文件时，来调用OneFilter拦截

     ```xml
     <url-pattern>/*</url-pattern>
     ```

   



# 过滤器防止用户恶意登录行为

解决用户恶意登录行为

1. 令牌机制，不使用过滤器，在登录成功后在LoginServlet里设置session的id，通过id判断是否是合法用户，但是此方法也有很大的缺点，见图。![](https://s1.ax1x.com/2020/08/24/dBzHoQ.png)

2. 使用过滤器![](https://s1.ax1x.com/2020/08/24/dBzOWn.png) 

   部分代码实现

   ```java
   package com.webprograming.filter;
   
   import javax.servlet.*;
   import javax.servlet.http.HttpServletRequest;
   import javax.servlet.http.HttpServletResponse;
   import javax.servlet.http.HttpSession;
   import java.io.IOException;
   
   public class OneFilter implements Filter {
       @Override
       public void doFilter(ServletRequest servletRequest, ServletResponse servletResponse, FilterChain filterChain) throws IOException, ServletException {
           // 1.拦截后，通过请求对象向Tomcat索要当前用户的HttpSession
           HttpServletRequest request = (HttpServletRequest) servletRequest;
           HttpServletResponse response = (HttpServletResponse) servletResponse;
           HttpSession session = request.getSession(false);
           // 2.判断来访用户合法性
           if(session == null){
               request.getRequestDispatcher("/myweb/login.html").forward(servletRequest,servletResponse);
               return;
           }
           // 放行
           filterChain.doFilter(servletRequest,servletResponse);
           // 把过滤器注册到服务器即可
       }
   }
   ```

   **说明：使用此方法时，对网站形成 "绝对保护" 没有一种请求可以访问得到服务端资源，因为每次访问服务端资源文件时过滤器都会进行拦截，连登陆和登陆验证都会进行拦截，所以无法访问得到服务端资源文件。顾对此方需要改进。**

   改进后部分过滤器代码实现

   ```java
   @Override
       public void doFilter(ServletRequest servletRequest, ServletResponse servletResponse, FilterChain filterChain) throws IOException, ServletException {
           HttpServletRequest request = (HttpServletRequest) servletRequest;
           HttpSession session = null;
           // 1.调用请求对象读取请求包中请求行中URI，了解用户访问的资源文件是谁？
           String requestURI = request.getRequestURI(); // 网站名/资源文件名 /myWeb/login.html or /myWeb/login
           // 2.如果本次请求资源文件与登录相关[login.html] 或者 [LoginServlet] 此时应该无条件放行
           System.out.println("login".indexOf(requestURI)); // 获取"login" 第一次出现的位置
           if(requestURI.indexOf("login") != -1 || "/myWeb/".equals(requestURI)){
               filterChain.doFilter(servletRequest,servletResponse);
               return;
           }
           // 3.如果本次请求访问的是其他资源文件，需要得到用户在服务端的HttpSession
           session = request.getSession(false);
           if(session != null){
               filterChain.doFilter(servletRequest,servletResponse);
               return;
           }
           // 做拒绝请求
           request.getRequestDispatcher("/login.html").forward(servletRequest,servletResponse);
       }
   ```

   

# 互联网通信流程图最终版

![](https://s1.ax1x.com/2020/08/24/dDSiFJ.png)

 





> 参考：https://www.cnblogs.com/laizhenghua/

