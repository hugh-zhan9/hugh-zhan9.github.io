---
title: 初识Spring
tags: Spring
categories: Java
date: 2020-09-18 09:39:28



---





![](https://s1.ax1x.com/2020/09/25/09o34O.png)

<!--more-->

# 概述

Spring主要功能是解耦合。

Spring 的主要作用就是为代码“解耦”，降低代码间的耦合度。就是让对象和对象（模块和模块）之间关系不是使用代码关联，而是通过配置来说明。即在 Spring 中说明对象（模块）的关系。

依赖

容器

官网：https://Spring.io/

# IOC 控制反转

控制反转（IoC，Inversion of Control），是一个概念，是一种思想。指将传统上由程序代码直接操控的对象调用权交给容器，通过容器来实现对象的装配和管理。控制反转就是对对象控制权的转移，从程序代码本身反转到了外部容器。通过容器实现对象的创建，属性赋值， 依赖的管理。

控制：创建对象，对对象的属性赋值，对象之间的关系管理。

正转：由开发人员在代码中使用new关键字创建对象，开发人员主动管理对象。

反转：把开发人员创建、管理对象的权限转移给容器，由容器代替开发人员创建、管理对象。



使用IOC的优势：



Java中创建对象有哪些方法：

1. 构造方法
2. 反射
3. 序列化
4. 克隆
5. 动态代理
6. IOC



IOC的体现

servlet：

1. 创建类继承自HttpServlet

2. 在web.xml注册servlet，使用

   ```xml
   <servlet-name>myservlet</servlet-name>
   <servlet-calss>com.hugh.controller.MyServlet</servlet-calss>
   ```

3. 没有创建servlet对象，就可以直接使用，这是因为tomcat服务器把我们创建了该对象。tomcat作为容器，里面存放了servlet、listener、filter对象



IOC的技术实现：DI

DI（Dependency Injection）:依赖注入，只需要在程序中提供要使用的对象名称就可以，至于对象如何在容器中创建，赋值，查找都由容器内部实现。

## Spring的第一个程序



## 给一个Java对象的属性赋值



### 通过XML配置文件DI

#### set注入

简单类型

引用类型

bean

School类

```java
public class School{
    private String name;
    private String address;
    
    // setter
    // toString()
}
```

Student类

```java
public class Student{
    private String name;
    private int age;
    private School school;
    
    // setter
    // toString()
}
```

xml

```xml
<bean id="mySchool" class="com.xmldi.di01.Class">
    <property name="name" value=""></property>
    <property name="address" value=""></property>
</bean>

<bean id="myStudent" class="com.xmldi.di01.Student">
    <!--简单类型的属性赋值-->
    <property name="name" value="zhangsan"></property>
    <property name="age" value="24"></property>
    <!--引用类型的属性赋值，使用ref给属性赋值-->
    <property name="school" ref="mySchool"></property>   <!--setSchool(mySchool)-->
</bean>
```



test文件

```java
@Test
public void test(){
    String springConfig = "ApplicationContext.xml";
    ApplicationContext applicationContext = ClassPathXmlApplicationContext(springConfig);
    Student student = (Student) application.getBean("myStudent"); // 执行对象的创建和赋值
    System.out.println(student);
}
```

#### 构造注入

构造注入是指：在构造调用者实例的同时，完成被调用者的实例化。即使用构造器设置依赖关系。

Student类

```java
public class Student{
    private String name;
    private int age;
    private School school;
    
    public Student(String name, int age, School school) {
        this.name = name;
        this.age = age;
        this.school = school;
    }
    
    // setter
    // toString()
}
```

ApplicationContext.xml文件

```xml
<bean id="mySchool" class="com.xmldi.di02.Class">
    <property name="name" value=""></property>
    <property name="address" value=""></property>
</bean>

<bean id="myStudent" class="com.xmldi.di02.Student">
    <constructor-arg name="name" value="zhangsan"></constructor-arg>
    <constructor-arg name="age" value="24"></constructor-arg>
    <constructor-arg name="school" ref="mySchool"></constructor-arg>
</bean>
```

**使用构造注入创建一个File()对象**

xml文件

```xml
<bean id="myFile" class="java.io.File">
	<constructor-arg name="parent" value="D:src\main\resources\ApplicationContext.xml"></constructor-arg>
	<constructor-arg name="child" value="pom1.xml"></constructor-arg>
</bean>
```

测试文件

```java
@Test
public void test03(){
	String springConfig = "ApplicationContext.xml";
	ApplicationContext applicationContext = new ClassPathXmlApplicationContext(springConfig);
	File file = (File) applicationContext.getBean("myFile");
	System.out.println(file.getAbsolutePath());
	System.out.println(file.getName());
}
// 运行结果
D:src\main\resources\ApplicationContext.xml\pom1.xml
pom1.xml
```

#### 引用类型属性自动注入

对于引用类型属性的注入，也可不在配置文件中显示的注入。可以通过为<bean/>标签设置 autowire 属性值，为引用类型属性进行隐式自动注入（默认是不自动注入引用类型属性）。根据自动注入判断标准的不同，可以分为两种：

- byName：根据名称自动注入
- byType： 根据类型自动注入

1. byName方式自动注入

   配置文件中被调用`<bean>`的id值与代码中调用者bean类的属性名称一致时，容器可以使用byName方式将被调用者的`<bean>`自动注入给调用者的属性。容器是通过调用者的`<bean>`类的属性名与配置文件中被调用者`<bean>`标签的id进行比较而实现的自动注入

   ```java
   // 调用者类
   public class Student{
       private String name;
       private int age;
       private School school; // 属性名与配置文件中的id值一致，可以执行自动注入
   }
   ```

   配置文件

   ```xml
   <bean id="school" class="xxx.School">
       <property name="name" value="大学"></property>
       <property name="address" value="湖南"></property>
   </bean>
   
   <!--执行自动注入-->
   <bean id="myStudent" class="xxx.Student" autowire="byName">
       <property name="name" value="zhangsan"></property>
       <property name="age" value="24"></property>
       <!--不再需要手动给引用类型赋值-->
   </bean>
   ```

   测试文件

   ```java
   @Test
   public void test04(){
       String springConfig = "ApplicationContext.xml";
           ApplicationContext applicationContext = new ClassPathXmlApplicationContext(springConfig);
           Student student = (Student) applicationContext.getBean("myStudent");
           System.out.println(student);
   }
   ```

   

2. byType方式自动注入

   使用`byType`方式自动注入，要求：配置文件中被调用者`bean`的 class 属性指定的类，要与代码中调用者 bean 类的某引用类型属性类型同源。即要么相同，要么有`is-a`关系（子类，或是实现类）。但这样的同源的被调用 bean 只能有一个。多于一个，容器就不知该匹配哪一个了。

   ```xml
   <bean id="mySchool" class="xxx.School">
       <property name="name" value="大学"></property>
       <property name="address" value="湖南"></property>
   </bean>
   
   <!--执行自动注入-->
   <bean id="myStudent" class="xxx.Student" autowire="byType">
       <property name="name" value="zhangsan"></property>
       <property name="age" value="24"></property>
       <!--不再需要手动给引用类型赋值-->
   </bean>
   ```

### 为应用指定多个Spring配置文件

在实际应用里，随着应用规模的增加，系统中 Bean 数量也大量增加，导致配置文件变得非常庞大、臃肿。为了避免这种情况的产生，提高配置文件的可读性与可维护性，可以将Spring 配置文件分解成多个配置文件。

#### 包含关系的配置文件

多个配置文件中有一个总文件，总配置文件将各其它子文件通过`<import/>`引入。在 Java代码中只需要使用总配置文件对容器进行初始化即可。

已有子配置文件：`spring-school.xml`，`spring-student.xml`

**spring配置文件**

```xml
<import resource="classpath:xxxx/xxxx/spring-school.xml"></import>
<import resource="classpath:xxxx/xxxx/spring-student.xml"></import>
```

也可使用通配符。但此时要求父配置文件名不能满足所能匹配的格式，否则将出现循环递归包含。就本例而言，父配置文件不能匹配 `spring-*.xml`的格式，即不能起名为`spring-total.xml`

```xml
<!--
	包含关系中可以使用通配符*，表示任意个字符
	注意：总的配置文件（total.xml）名称不能包含在通配符的范围内，不能叫spring-total.xml
-->
<import resource="classpath:xxxx/xxxx/spring-*.xml"></import>
```

测试

```java
@Test
public void test(){
    String applicationConfig = "xxxx/xxxx/total.xml";
    ApplicationContext applicationContext = new ClassPathXmlApplicationContext(applicationConfig);
    Student student = (Student) applicationContext.getBean("myStudent");
    System.out.println("student");
}
```



### 通过注解DI

对于 DI 使用注解，不再需要在 Spring 配置文件中声明 bean 实例。

Spring 中使用注解，需要在原有 Spring 运行环境基础上再做一些改变。需要在 Spring 配置文件中配置组件扫描器，用于在指定的基本包中扫描注解。

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xsi:schemaLocation="
       http://www.springframework.org/schema/beans
       http://www.springframework.org/schema/beans/spring-beans.xsd
       http://www.springframework.org/schema/context
       http://www.springframework.org/schema/beans/spring-context.xsd">
    <!--
	声明组件扫描器（component-scan）：指定注解所在的包名
	base-package:指定注解在项目中的包名。
	SPring会扫描遍历base-package指定的包，找到包和子包中的所有类中的注解，按照注解的功能创建对象，给属性赋值。
	-->
    <context:component-scan base-package="xxxx.xxxx.di01"></context:component-scan>
</beans>
```

**指定多个包的三种方式：**

1. 使用多个``context:component-scan`指定不同的包路径

   ```xml
   <context:cpmponent-scan base-package=""></context:component-scan>
   <context:cpmponent-scan base-package=""></context:component-scan>
   ```

2. 指定多个base-package的值之间使用分隔符分开

   分隔符可以使用逗号（）分号（）不建议使用空格。

   ```xml
   <!--使用，作为间隔符-->
   <context:cpmponent-scan base-package="com.hugh.beans, com.hugh.di"></context:component-scan>
   <!--使用;作为间隔符-->
   <context:cpmponent-scan base-package="com.hugh.beans; com.hugh.di"></context:component-scan>
   <!--使用空格作为间隔符，但不建议-->
   <context:cpmponent-scan base-package="com.hugh.beans com.hugh.di"></context:component-scan>
   ```

3. 使用父包名

   base-package的值指的是一个父包时，spring会扫描到子包。

   ```xml
   <context:component-scan base-package="xxxx.xxxx.total.xml"></context:component-scan>
   ```

   或者指定base-package为最顶级的父包

   ```xml
   <context:component-scan base-package="com"></context:component-scan>
   ```

   但不建议使用顶级的父包，扫描的路径比较多，导致容器启动时间变慢。指定到目标包合适的。也就是注解所在包全路径。例如注解的类在`com.hugh.beans`包中

   ```xml
   <context:component-scan base-package="com.hugh.beans"></context:component-scan>
   ```

#### 定义Bean的注解@Component

在类上使用注解`@component`，该注解的 value 属性用于指定该 bean 的 id 值。

```java
@Component(value="myStudent")     
/*
	等价于<bean id="myStudent" class=""></bean>
	也可以省略value，即：@Component("myStudent")
	还可以不指定对象的名称，由Spring来提供默认的名称：@Component，默认为类名的首字母小写。
*/
public class Student{
    private String name;
    private int age;
    private School school;
    
    // setter、toString()
}
```

`@Component`不指定 value 属性时，bean的id默认是类名的首字母小写。

```java
@Component
public class Student{
	...
}
```

测试文件：

```java
String applicationConfig = "ApplicationConfig.xml";
ApplicationContext applicationContext = new ClassPathXmlApplicationContext(applicationConfig);
Student student = (Student) applicationContext.getBean("student");
System.out.println(student);
```

另外，Spring 还提供了 3 个创建对象的注解：

- `@Repository`：用在持久层的上，用于对dao实现类进行注解，创建dao对象访问数据库。
- `@Service`：用在业务层类上，用于对Service实现类进行注解，创建service对象做业务处理，可以有事务功能。
- `@Controller`：用在控制器上，用于对Controller实现类进行注解，创建控制器对象能够接受用户提交的参数，显示请求的处理结果。

这三个注解和`@Component`都可以创建对象，但这三个注解还有其他的含义。`@Repository`，`@Service`，`@Controller`是对`@Component`注解的细化，标注不同层的对象。即持久层对象，业务层对象，控制层对象。

#### 简单类型属性注入@Value

需要在属性上使用注解`@Value`，该注解的`value`属性用于指定要注入的值。使用该注解完成属性注入时，类中无需`setter`。当然，若属性有`setter`，也可将其加到`setter`上，通过setter方法赋值。

```java
// 注解参数中省略了value属性，该属性用于指定Bean的id
@Component("myStudent")
public class Student{
    @Value("zhangsan")
    private String name;
    @Value("24")
    private int age;
    
    // toString()... 
}
```

#### byType自动注入@Autowired

需要在引用属性上使用注解`@Autowired`，该注解默认使用**按类型**自动装配Bean的方式。

使用该注解完成属性注入时，类中无需setter。若属性有`setter`，也可以将其加到`setter`上。

School类

```java
@Component("mySchool")
public class School{
    @Value("清华大学")
    private String name;
}
```

Student类

```java
@Component("myStudent")
public class Student{
    @Value("zhangsan")
    private String name;
    @Value("24")
    private int age;
    @Autowired
    private School school;
    
    ...
}
```

#### byName自动注入@Autowired与@Qualifier

需要在引用属性上联合使用注解`@Autowired`和`@Qualifier`。`@Qualifier`的value属性用于指定要匹配的Bean的id值。类中无需set方法，如果有的话也可加到set方法上进行赋值操作。

School类

```JAVA
@Component("mySchool")
public class School {
    @Value("清华大学")
    private String name;
}
```

Student类

```java
@Component("myStudent")
public class Student{
    @Value("zhangsan")
    private String name;
    @Value("24")
    private int age;
    @Autowired
    @Qualifier("mySchool")
    private School school;
    
    ...
}
```

`@Autowired`还有一个属性`required`，默认值为true，表示当匹配失败后，会终止程序运行。若将其值设置为false，则匹配失败，将被忽略，未匹配的属性值为null。

```java
@Autowired(required=false)
@Qualifier("mySchool")
private School school;
```

#### @JDK注解@Resource自动注入

Spring提供了对JDK中`@Resource`注解的支持，`@Resource`注解既可以按名称匹配Bean，也可以按类型匹配Bean。**默认是按名称注入**。`@Resource`可在属性上，也可以在set方法上。

1. byType注入引用类型属性

   `@Resource`若不带任何参数，则默认按名称的方式注入，按名称注入bean失败则会自动按照类型进行Bean的匹配注入。

   School类

   ```java
   @Component("mySchool")
   public class School{
       @Value("清华大学")
       private String name;
   }
   ```

   Student类

   ```java
   @Component("myStudent")
   public class Student{
       @Value("zhangsan")
       private String name;
       @Value("24")
       private int age;
       @Resource
       private School school;
   }
   ```

2. 只开启byName注入引用类型属性

   `@Resource`注解指定其name属性，则name的值即为按照名称进行匹配的Bean的id。

   School类

   ```java
   @Component("mySchool")
   public class School{
       @Value("清华大学")
       private String name;
   }
   ```

   Student类

   ```java
   public class Student{
       @Value("zhangsan")
       private String name;
       @Value("24")
       private int age;
       @Resource(name="mySchool")
       private School school;
   }
   ```

   

   

#### 注解与XML的对比

1. 注解的优点是：

   - 方便
   - 直观
   - 高效（代码少，没有配置文件）

   其弊端也显而易见：以硬编码的方式写入到Java代码中，修改时需要重写编译代码的。

2. XML方式的优点是：

   - 配置和代码分离
   - 在XML中做修改，无需编译代码，只需重启服务器即可将新的配置加载。

   XML的缺点是：编写麻烦，效率低下，大型项目过于复杂。



# 动态代理

可以在程序的执行过程中创建代理对象。通过代理对象执行方法，给目标类的方法增加额外的功能（功能增强）。

step1：在最原始的开发中，我们将业务方法和非业务方法交织在一起。

接口类

```java
public interface SomeService{
    void doSome();
    void doOther();
}
```

接口实现类

```java
public class SomeServiceImpl implements SomeService {
    @Override
    public void doSome() {
        doLog();
        System.out.println("执行了doSome方法");
        doTrans();
    }

    @Override
    public void doOther() {

    }

    public void doLog(){
        System.out.println("记录日志");
    }

    public void doTrans(){
        System.out.println("执行事务");
    }

}

```

step2：将第一步重重复的方法抽取为一个工作类，需要时只需调用该方法就好

接口类

```java
public interface SomeService{
    void doSome();
    void doOther();
}
```

工具类

```java
public class SomeTool{
    public void doLog(){
        System.out.println("记录日志");
    }

    public void doTrans(){
        System.out.println("执行事务");
    }
}
```

接口实现类

```java
public class SomeServiceImpl implements SomeService {
    @Override
    public void doSome() {
        SomeTool.doLog();
        System.out.println("执行了doSome方法");
        SomeTool.doTrans();
    }

    @Override
    public void doOther() {

    }
}
```

step3：使用工具类任然需要调用工具包，不同的方法需要重复调用。采用动态代理进行动态增强

```java
import java.lang.reflect.InvocationHandler;
import java.lang.reflect.Method;

public class MyInvocationHandler implements InvocationHandler {
    private Object target;
    public MyInvocationHandler(Object target){
        super();
        this.target = target;
    }
    public MyInvocationHandler(){
        super();
    }

    @Override
    public Object invoke(Object proxy, Method method, Object[] args) throws Throwable {
        Object obj = null;
        SomeTool.doLog();
        obj = method.invoke(target,args);
        SomeTool.doTrans();
        return obj;
    }
}

```

测试代码

```java
import java.lang.reflect.Proxy;

public class ProxyTest{
    public static void main(String args){
    // 创建代理对象
        SomeService target = new SomeServiceImpl();
        MyInvocationHandler handler = new MyInvocationHandler(target);

        SomeService proxy = (SomeService) Proxy.newProxyInstance(
                target.getClass().getClassLoader(),
                target.getClass().getInterfaces(),
                handler);
        // 通过代理对象执行业务方法实现日志，事务增强
        proxy.doSome();
        proxy.doOther();
    }
}
```

虽然这样可以实现不修改原类，但是代码量很大，需要创建各种代理对象，所以引入了AOP面向切面编程。

# AOP 面向切面编程

## 概述

如果说 IoC 是 Spring 的核心，那么面向切面编程就是 Spring 最为重要的功能之一了，在数据库事务中切面编程被广泛使用。

首先，在面向切面编程的思想里面，把功能分为核心业务功能，和周边功能。

- **所谓的核心业务**，比如登陆，增加数据，删除数据都叫核心业务
- **所谓的周边功能**，比如性能统计，日志，事务管理等等

周边功能在 Spring 的面向切面编程AOP思想里，即被定义为切面

在面向切面编程AOP的思想里面，核心业务功能和切面功能分别独立进行开发，然后把切面功能和核心业务功能 "编织" 在一起，这就叫AOP



------

AOP（Aspect Orient Programming），面向切面编程。是从动态角度考虑程序运行过程。它是对OOP的补强。

>但与面向切面编程AOP真正对应的，是OOP，即面向对象编程。
>
>未说面向切面，先说面向过程。
>
>
>
>面向对象侧重静态，名词，状态，组织，数据，载体是空间；
>
>面向过程侧重动态，动词，行为，调用，算法，载体是时间；
>
>
>
>这两者，运行于不同维度，本不互相冲突，理应携手合作，相互配合。
>
>
>
>所以，web项目中的controller，service，dao等各层组件，有行为无状态，有方法无属性，即使有属性，也只是对下一层组件的持有；
>
>所以，web项目中的entity，dto等各种实体，有状态无行为，有属性无方法，即使有方法，也只是getter/setter等，围着状态打转；
>
>
>
>反倒是我们刚学「面向对象」时说的「既有眼睛又会叫」的小狗那种状态行为俱全的对象，基本见不到了。
>
>
>
>程序需要状态，但对象不需要状态。
>
>如果对象有了状态，就会引发烦人的多线程问题，在集群环境下更是麻烦。
>
>程序的状态，统一由数据库，缓存，任务队列这些外部容器来容纳，在处理时，仅仅在对象的方法中以局部变量的面目偶尔出现，被封在线程内部，朝生夕灭，任由回收。
>
>—— [《好书一起读(115)：重学Spring之面向切面》](https://mp.weixin.qq.com/s?__biz=MzA4NTE1MDk5MA==&mid=2672797679&idx=1&sn=4c44e1a27b37cd30505f1f1eec88f51a&chksm=85675b8eb210d298295ed6a51fe16a632d83d732413564e88e508c66a1cebe77e89a6c0cb9fe#rd)

《Spring3.x企业应用开发实战》（下称《3.x》）第6章写道：

> AOP是OOP的有益补充。

Spring 实现的AOP是代理模式，给调用者使用的实际是已经过加工的对象，你编程时方法体里只写了A，但调用者拿到的对象的方法体却是xAy。





但x和y总还是需要你来写的，这就是增强。

x和y具体在什么时候被调用总还是需要你来规定的，虽然是基于约定的声明这种简单的规定，这就是切点。

《EXPERT ONE ON ONE J2EE DEVELOPMENT WITHOUT EJB》第8章、《Spring实战》第4章：

> 增强(advice，另译为通知，但《3.x》作者不赞成)：在特定连接点执行的动作。
>
> 切点(pointcut)：一组连接点的总称，用于指定某个增强应该在何时被调用。
>
> 连接点(join point)：在应用执行过程中能够插入切面的一个点。（我注：就是抽象的「切点」声明所指代的那些具体的点。）
>
> 切面(aspect)：通知(即增强)和切点的结合。

用人话说就是，增强是「干啥」，切入点是「啥时候干」。

生活中例子如端碗-吃饭-放筷子，端碗-吃面-放筷子，你只要定义好端碗和放筷子，并声明在吃点啥之前之后调用它们，业务方法只要实现吃饭、吃面就行了，以后想加个吃饺子也很方便。

生产中例子如事务、安全、日志(*)，用声明的方式一次性配好，之后漫漫长夜专注于写业务代码就行了，不再为这些事而烦。



------



对于AOP这个思想，很多框架都进行了实现，Spring 也不例外，但是还有一个框架——AspectJ，其实现方式更为简洁方便，而且支持注解式开发，所以Spring又将 AspectJ 对于AOP的实现引入到了自己的框架中。在 Spring 中使用 AOP 开发时，一般使用 AspectJ 的实现方式。

在`pom.xml`中添加依赖

```xml
<dependency> <groupId>org.springframework</groupId> <artifactId>spring-aspects</artifactId> <version>5.2.5.RELEASE</version>
</dependency>
```

和IoC一样，AOP也有配置文件和注解的两种实现方式

**AOP中主要使用的注解有：**

- @Aspect：定义切面

  

- @Before：前置增强，在连接点方法前调用。可以包含一个 JoinPoint 类型参数。该类型的对象本身就是切入点表达式。通过该参数，可获取切入点表达式、方法签名、目标对象等。

  ```java
  @Before(value="execute(* *..SomeServiceImpl.do*(..))")
  public void before(JoinPoint joinPoint){
      System.out.println("连接点的方法定义"+joinPoint.getSignature());
      System.out.println("连接点方法的参数个数"+joinPoint.getArgs().length);
      Object args[] = joinPoint.getArgs();
      for(Object arg : args){
          System.out.println(arg);
      }
      System.out.println("前置增强");
  }
  ```

  

- @After：后置增强，在连接点方法后调用。

  

- @AfterReturning：返回增强，在连接点方法执行并正常返回后调用，要求连接点方法在执行过程中没有发生异常，可以获取到目标方法的返回值。该注解的 returning 属性就是用于指定接收方法返回值的变量名的。所以，被注解为后置通知的方法，除了可以包含 JoinPoint 参数外，还可以包含用于接收返回值的变量。该变量最好为 Object 类型，因为目标方法的返回值可能是任何类型。

  ```java
  @AfterReturning(value="execute(* *..SomeServiceImpl.doOther(..))" returning="result")
  public void afterReturning(Object result){
      if(result != null){
          String s = (String) result;
          result = s.toUpperCase();
      }
      System.out.println("返回增强"+result);
  }
  ```

  

- @AfterThrowing：异常增强，当连接点方法发生异常时调用。该注解的 throwing 属性用于指定所发生的异常类对象。被注解为异常通知的方法可以包含一个参数 Throwable，参数名称为 throwing 指定的名称，表示发生的异常对象

  ```java
  @AfterThrowing(value="execute(* *..SomeServiceImpl.do*(..))" throwing="ex")
  public void afterThrowing(Throwable ex){
      // 把异常的时间、位置、原因记录到数据库，日志文件等
      // 可以在异常发生时，把异常信息通过短信、邮件发送给开发人员
      System.out.println("异常返回增强，异常原因："+ex.getMessage());
  }
  
  ```

  

- @Around：环绕增强，将覆盖原有方法，但是通过反射可以调用原有方法。被注解为环绕增强的方法要有返回值，Object 类型。并且方法可以包含一个 ProceedingJoinPoint 类型的参数。接口 ProceedingJoinPoint 其有一个proceed()方法，用于执行目标方法。若目标方法有返回值，则该方法的返回值就是目标方法的返回值。最后，环绕增强方法将其返回值返回。**该增强方法实际是拦截了目标方法的执行。**

  ```java
  @Around(value="execute(* *..SomeServiceImpl.doSome(..)")
  public Object around(ProceedingJoinPoint pjp) throws Throwable{
      Object obj = null;
      System.out.println("环绕增强目标方法之前执行
      pjp.proceed();
      System.out.println("环绕增强目标方法之后执行
      return obj;
  }
  ```

  

- @Pointcut：用于定义切入点表达式，将@Pointcut 注解在一个方法之上，以后所有的 execution 的 value 属性值均可使用该方法名作为切入点。代表的就是@Pointcut 定义的切入点。这个使用@Pointcut 注解的方法一般使用 private 的标识方法，即没有实际作用的方法

  ```java
  public void after(){
      System.out.println("后置增强，重视会被执行")
  }
  /*
  	@Pointcut：用来定义和管理切面点，简化切入点的定义
  */
  @Pointcut(value="execution(* *..SomeServiceImpl.doSome(..))")
  private void method(){//无需代码}
  ```



定义连接点方法：设置前面增强模式的value属性为：`execution(访问权限 方法返回值 方法声明(参数) 异常类型)`。其中访问权限和异常类型为可选项，可以使用通配符来表示值。例如：

```
@Before(value="execution(* com.hugh.Service.DoService.doSome())")
表示在com.hugh.Service包中DoService类的doSome方法之前执行增强方法。
```

## 示例

### 使用注解的方式

业务实现类

```java
@Component("landlord")
public class Landlord {

	public void service() {
		System.out.println("签合同");
		System.out.println("收房租");
	}
}
```

切面类

```java
@Component("broker")
@Aspect
public class Broker{
    @Before("execution(* com.hugh.pojo.Landlord.service())")
	public void before(){
		System.out.println("带租客看房");
		System.out.println("谈价格");
	}

	@After("execution(* com.hugh.pojo.Landlord.service())")
	public void after(){
		System.out.println("交钥匙");
    }
}
```

在 Spring 配置文件`applicationContext.xml`中设置自动代理和Bean扫描器

```xml
<context:component-scan base-package="com.hugh" />
<aop:aspectj-autoproxy/>
```

测试代码

```java
public class TestSpringAOP{
    @Test
    public void testAOP(){
        ApplicationContext applicationContext = new ClassPathXmlApplicationContext("applicationContetx.xml")
    };
    Landlord landlord = (Landlord) applicationContext.getBean("landlord");
    landlord.service();
}
```



### 使用xml配置文件的方式





参考： [好书一起读(115)：重学Spring之面向切面](https://mp.weixin.qq.com/s?__biz=MzA4NTE1MDk5MA==&mid=2672797679&idx=1&sn=4c44e1a27b37cd30505f1f1eec88f51a&chksm=85675b8eb210d298295ed6a51fe16a632d83d732413564e88e508c66a1cebe77e89a6c0cb9fe#rd)、[Spring(4)——面向切面编程（AOP模块）](https://www.cnblogs.com/wmyskxz/p/8835243.html)

# Spring集成MyBatis

## pom文件引入依赖

```xml
  <dependencies>
    <dependency>
      <groupId>org.springframework</groupId>
      <artifactId>spring-aspects</artifactId>
      <version>5.2.5.RELEASE</version>
    </dependency>

    <dependency>
      <groupId>junit</groupId>
      <artifactId>junit</artifactId>
      <version>4.11</version>
      <scope>test</scope>
    </dependency>
      
    <dependency>
      <groupId>org.springframework</groupId>
      <artifactId>spring-context</artifactId>
      <version>5.2.5.RELEASE</version>
    </dependency>
      
    <dependency>
      <groupId>org.springframework</groupId>
      <artifactId>spring-tx</artifactId>
      <version>5.2.5.RELEASE</version>
    </dependency>
      
    <dependency>
      <groupId>org.springframework</groupId>
      <artifactId>spring-jdbc</artifactId>
      <version>5.2.5.RELEASE</version>
    </dependency>
      
    <dependency>
      <groupId>org.mybatis</groupId>
      <artifactId>mybatis</artifactId>
      <version>3.5.1</version>
    </dependency>
      
    <dependency>
      <groupId>org.mybatis</groupId>
      <artifactId>mybatis-spring</artifactId>
      <version>1.3.1</version>
    </dependency>
      
    <dependency>
      <groupId>mysql</groupId>
      <artifactId>mysql-connector-java</artifactId>
      <version>5.1.9</version>
    </dependency>
      
    <dependency>
      <groupId>com.alibaba</groupId>
      <artifactId>druid</artifactId>
      <version>1.1.12</version>
    </dependency>
  </dependencies>
```

## 过滤配置文件

```xml
    <resources>
      <resource>
        <directory>src/main/java</directory>
        <includes>
          <include>**/*.properties</include>
          <include>**/*.xml</include>
        </includes>
        <filtering>false</filtering>
      </resource>
      <resource>
        <directory>src/main/resources</directory>
        <includes>
          <include>**/*.properties</include>
          <include>**/*.xml</include>
        </includes>
        <filtering>false</filtering>
      </resource>
    </resources>
```

## 定义实体类

```java
package com.springandmybatis.pojo;

public class Student {
    private Integer id;
    private String name;
    private String email;
    private Integer age;

    public Student() {
    }

    public Student(Integer id, String name, String email) {
        this.id = id;
        this.name = name;
        this.email = email;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public Integer getAge() {
        return age;
    }

    public void setAge(Integer age) {
        this.age = age;
    }

    @Override
    public String toString() {
        return "Student{" +
                "id=" + id +
                ", name='" + name + '\'' +
                ", email='" + email + '\'' +
                ", age=" + age +
                '}';
    }
}
```

## 定义dao接口

```java
package com.springandmybatis.dao;

import com.springandmybatis.pojo.Student;

import java.util.List;

public interface StudentDao {
    int insertStudent(Student student);
    List<com.springandmybatis.pojo.Student> selectStudent();
}
```

## 配置mapper映射文件

```xml
<?xml version="1.0" encoding="UTF-8" ?>
<!DOCTYPE mapper
        PUBLIC "-//mybatis.org//DTD Mapper 3.0//EN"
        "http://mybatis.org/dtd/mybatis-3-mapper.dtd">
<mapper namespace="com.springandmybatis.dao.StudentDao">
    <insert id="insertStudent">
        insert into student values (#{id},#{name},#{email},#{age})
    </insert>
    <select id="selectStudent" resultType="com.springandmybatis.pojo.Student">
        select * from student order by id desc
    </select>
</mapper>
```

## 定义Service接口和实现类

```java
package com.springandmybatis.service;

import com.springandmybatis.pojo.Student;

import java.util.List;

public interface StudentService {
    int addStudent(Student student);
    List<Student> queryStudent();
}

```

## 实现类

```java
package com.springandmybatis.service.impl;

import com.springandmybatis.dao.StudentDao;
import com.springandmybatis.pojo.Student;
import com.springandmybatis.service.StudentService;

import java.util.List;

public class StudentServiceImpl implements StudentService {
    private StudentDao studentDao;

    // 使用set注入来进行赋值
    public void setStudentDao(StudentDao studentDao) {
        this.studentDao = studentDao;
    }

    @Override
    public int addStudent(Student student) {
        int count = studentDao.insertStudent(student);
        return count;
    }

    @Override
    public List<Student> queryStudent() {
        List<Student> students = studentDao.selectStudent();
        return students;
    }
}
```

## 定义mybatis配置文件

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
        <package name="com.springandmybatis.pojo"/>
    </typeAliases>
    <!--
		配置mybatis环境
		default必须和某个environment的id值一样，告诉mybatis使用哪个数据库的链接信息，就会访问哪个数据库
	-->
    <mappers>
        <!--
			告诉mybatis要执行的sql映射文件位置
			这个路径是相对路径，从类路径开始,target/classes(这个classes就是类路径)
		-->
        <package name="com.springandmybatis.dao"/>
    </mappers>
</configuration>
```

## 配置spring配置文件

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:util="http://www.springframework.org/schema/util"
       xmlns:context="http://www.springframework.org/schema/context"
       xsi:schemaLocation="http://www.springframework.org/schema/beans http://www.springframework.org/schema/beans/spring-beans.xsd http://www.springframework.org/schema/util https://www.springframework.org/schema/util/spring-util.xsd http://www.springframework.org/schema/context https://www.springframework.org/schema/context/spring-context.xsd">
    <!--
        可以把数据库的配置信息写在一个独立的文件中，便于修改数据库的配置内容
     -->
    <context:property-placeholder location="classpath:JDBC.properties"></context:property-placeholder>

    <!--声明数据源dataSource，连接数据库-->
    <bean id="dataSource" class="com.alibaba.druid.pool.DruidDataSource" init-method="init" destroy-method="close">
        <!--set注入给dataSource提供连接数据库的信息-->
        <property name="url" value="${jdbc.url}"></property>
        <property name="username" value="${jdbc.username}"></property>
        <property name="password" value="${jdbc.password}"></property>
        <property name="maxActive" value="20"></property>
    </bean>

    <!--声明的时mybatis提供的SqlSessionFactoryBean类，这个类的作用是创建SqlSessionFactory的-->
    <bean id="sqlSessionFactory" class="org.mybatis.spring.SqlSessionFactoryBean">
        <!--set注入，把数据库连接池赋值给了dataSource属性-->
        <property name="dataSource" ref="dataSource"></property>
        <!--
            mybatis主配置文件的位置
            configLocation属性是Resource类型，读取配置文件，赋值采用value
            使用classPath:表示文件位置
        -->
        <property name="configLocation" value="classpath:mybatis.xml"></property>
    </bean>

    <!--
        创建dao对象，使用SqlSession的getMapper(StudentDao.class)
        在内部调用调用getMapper()生成每个dao接口的代理对象
    -->
    <bean class="org.mybatis.spring.mapper.MapperScannerConfigurer">
        <!--指定SqlSessionFactory对象的id-->
        <property name="sqlSessionFactoryBeanName" value="sqlSessionFactory"></property>
        <!--
            指定包名，包名是dao接口所在的包名
            MapperScannerConfigurer会扫描这个包中的所有接口，
            把每个接口都执行一个getMapper()方法，得到每个接口的dao对象
            创建好的对象是放在spring容器中的
        -->
        <property name="basePackage" value="com.springandmybatis.dao"></property>
    </bean>

    <!--声明service-->
    <bean id="studentService" class="com.springandmybatis.service.impl.StudentServiceImpl">
        <property name="studentDao" ref="studentDao"></property>
    </bean>
</beans>
```

编写测试类测试数据库连接

```java
package com.springandmybatis;

import com.springandmybatis.dao.StudentDao;
import com.springandmybatis.pojo.Student;
import com.springandmybatis.service.StudentService;
import com.springandmybatis.service.impl.StudentServiceImpl;
import org.junit.Test;
import org.springframework.context.ApplicationContext;
import org.springframework.context.support.ClassPathXmlApplicationContext;

public class TestSpringAndMybatis {
    @Test
    public void testInsertStudent() {
        String applicationConfig = "springandmybatis/applicationContext.xml";
        ApplicationContext applicationContext = new ClassPathXmlApplicationContext(applicationConfig);
        // 获取Spring容器中的dao对象
        StudentDao studentDao = (StudentDao) applicationContext.getBean("studentDao");
        Student student = new Student();
        student.setId(1);
        student.setName("zhangsan");
        student.setEmail("1549448281@qq.com");
        student.setAge(24);
        int num = studentDao.insertStudent(student);
        System.out.println(num);
    }

    // 实际开发中一般使用service调用dao
    @Test
    public void testServiceInsertStudent(){
        String applicationConfig = "springandmybatis/applicationContext.xml";
        ApplicationContext applicationContext = new ClassPathXmlApplicationContext(applicationConfig);
        // 获取Spring容器中的dao对象
        StudentService studentService = (StudentService) applicationContext.getBean("studentService");
        Student student = new Student();
        student.setId(2);
        student.setName("lisi");
        student.setEmail("2792235096@qq.com");
        student.setAge(24);
        int num = studentService.addStudent(student);
        // Spring和mybatis整合在一块时，事务是自动提交的，无需执行sqlSession.commit()
        System.out.println(num);
    }
}
```



# Spring事务

1. 什么是事务

   事务是指一组sql语句的集合，集合中有多条sql语句可能是insert、update、select。。我们希望这些多个sql语句都能执行结果是一致的，都执行成功或者都失败

2. 在什么时候想到使用事务

   当所执行的操作会涉及到多个表，或者多个sql语句insert、updat、delete操作时，需要保证这些语句都是成功才能完成我的功能，或者都失败，保证操作是符合要求的，

   在Java代码中，开支事务应该放在service类的方法中，因为这些方法会调用多个dao方法，执行多个sql语句

3. jdbc和mybatis处理事务的方式有什么不足

   不同的数据库需要不同的处理方式，处理事务的对象，方法不一致，需要了解不同数据库访问技术使用事务的原理

   掌握多种数据库中事务的处理逻辑，什么时候提交事务，什么时候回滚事务

   需要掌握处理事务的多种方法

   总结：多种数据库的访问技术，有不同的事务处理的机制，对象和方法

4. 怎么解决这些问题

   spring提供了处理事务的统一模型，能够使用统一的方式来完成不同数据库访问技术的事务处理

5. 如何解决，怎么做，做什么

   spring处理事务的模型使用的步骤都是固定的，把事务使用的信息提供给spring就可以了

   - 事务内部提交、回滚事务，使用的事务管理器对象，帮助完成事务的commit和rollback。事务管理器是一个接口和它的众多实现类。

## 事务管理器

事务管理器是`PlatformTransactionManager`接口的对象，能够完成事务的提交、回滚及获取事务的状态信息。

`PlatformTransactionManager`接口有两个常用的实现类：

- `DataSourceTransactionManager`：使用JDBC或MyBatis进行数据库操作时使用。
- `HibernateTransactionManager`：使用Hibernate进行持久化数据时使用。

在spring的配置文件中配置对应的事务管理器的实现类，什么事务管理器

```xml
<bean id="TransactionManager" class="org.springframework.jdbc.datasource.DataSourceTransactionManager">
	<property name="dataSource" ref="dataSource"></property>
</bean>
```

提交和就回滚

Spring事务的默认回滚方式是：当程序执行时发生运行时异常时进行回滚。

## 事物定义接口

事务定义接口`TransactionDefinition`中定义了事务描述相关的三类常量：事务隔离级别、事务传播行为、事务默认超时时限，及它们的操作。

### 五个事务隔离级别常量

- `ISOLATION_DEFAULT`：采用DB默认的事务隔离级别。MySql的默认为`ISOLATION_REPEATABLE_READ`；Oracle默认为`ISOLATION_READ_COMMITTED`。
- `ISOLATION_UNCOMMITTED`：读未提交，未解决任何并发问题
- `ISOLATION_COMMITTED`：读已提交，解决藏独，存在不可重复读与幻读
- `ISOLATION_REPEATABLE_READ`：可重复读，解决脏读，不可重复读，存在幻读
- `ISOLATION_SERIALIZABLE`：串行化，不存在并发问题

### 七个事务传播行为常量

事务传播行为是指：

- PROPAGATION_REQUIRED：指方法必须在事务内部执行

- PROPAGATION_REQUIRES_NEW：总是新建一个事务，如果当前有事务就将当前事务挂起直到本事务结束

- PROPAGATION_SUPPORTS：指方法支持当前事务，若当前没有事务也可以以非事务方式执行

  ----------

  

- PROPAGATION_MANDATORY 

- PROPAGATION_NESTED 

- PROPAGATION_NEVER 

- PROPAGATION_NOT_SUPPORTED

### 默认事务超时时限

TIMEOUT_DEAULT定义了事务底层默认的超时时限，即sql语句执行等待反馈的时长，**由于超时时限的影响因素比较多，且超时的时间计算点比较复杂。所以该值一般默认为-1。**

## 示例

### 准备数据库表

```sql
/* 销售表 */
create table t_sale
(
    id int auto_increment,
    goodId int not null,
    nums int null,
    constraint t_sale_pk
        primary key (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/* 商品表 */
create table t_goods
(
    id int auto_increment,
    name varchar(100) null,
    amount int null,
    price float null,
    constraint t_goods_pk
        primary key (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
insert into t_goods values (1001,"笔记本",100,15);
insert into t_goods values (1002,"手机",20,3000);
```

### 实例对象类

商品类

```java
package com.hugh.pojo;

public class Good {
    private int id;
    private String name;
    private int amount;
    private double price;

	//set、get方法
}
```

订单类

```java
package com.hugh.pojo;

public class Sale {
    private int id;
    private int goodId;
    private int nums;

    // set、get方法
}
```

### dao层接口

```java
package com.hugh.dao;

import com.hugh.pojo.Good;

public interface GoodDao {
    int updateGood(Good good);
    Good selectGoodByID(int id);
}

```



```java
package com.hugh.dao;

import com.hugh.pojo.Sale;

public interface SaleDao {
    int insertSale(Sale sale);
}

```

### 对应dao接口的mabatis映射文件

```xml
<?xml version="1.0" encoding="UTF-8" ?>
<!DOCTYPE mapper
        PUBLIC "-//mybatis.org//DTD Mapper 3.0//EN"
        "http://mybatis.org/dtd/mybatis-3-mapper.dtd">
<mapper namespace="com.hugh.dao.GoodDao">
    <update id="updateGood">
        update t_goods set amount = amount - #{amount} where id = #{id}
    </update>
    <select id="selectGoodByID" resultType="com.hugh.pojo.Good">
        select * from t_goods where id = #{id}
    </select>
</mapper>
```



```xml
<?xml version="1.0" encoding="UTF-8" ?>
<!DOCTYPE mapper
        PUBLIC "-//mybatis.org//DTD Mapper 3.0//EN"
        "http://mybatis.org/dtd/mybatis-3-mapper.dtd">
<mapper namespace="com.hugh.dao.SaleDao">
    <insert id="insertSale">
        insert into t_sale (goodId,nums) values (#{goodId},#{nums})
    </insert>
</mapper>
```

### MyBatis配置文件

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
        <!--
			告诉mybatis要执行的sql映射文件位置
			这个路径是相对路径，从类路径开始,target/classes(这个classes就是类路径)
		-->
        <package name="com.hugh.dao"/>
    </mappers>
</configuration>
```



### 异常类

为了测试Spring的事务机制，新建一个异常类

```java
package com.hugh.excep;

public class NotEnoughException extends RuntimeException{
    public NotEnoughException() {
        super();
    }

    public NotEnoughException(String message) {
        super(message);
    }
}
```

### 创建服务类接口及接口的实现

接口

```java
package com.hugh.service;

import com.hugh.excep.NotEnoughException;
import com.hugh.pojo.Good;

public interface BuyGoodService {
    public void buyGood(Integer id,Integer amount);
}

```

实现类

```java
package com.hugh.service.impl;

import com.hugh.dao.GoodDao;
import com.hugh.dao.SaleDao;
import com.hugh.excep.NotEnoughException;
import com.hugh.pojo.Good;
import com.hugh.pojo.Sale;
import com.hugh.service.BuyGoodService;

public class BuyGoodServiceImpl implements BuyGoodService {
    private GoodDao goodDao;
    private SaleDao saleDao;

    public void setGoodDao(GoodDao goodDao) {
        this.goodDao = goodDao;
    }

    public void setSaleDao(SaleDao saleDao) {
        this.saleDao = saleDao;
    }

    @Override
    public void buyGood(Integer id,Integer amount) {
        System.out.println("===================buyGood方法开始========================");
        Sale sale = new Sale();
        sale.setGoodId(id);
        sale.setNums(amount);
        saleDao.insertSale(sale);

        Good good = goodDao.selectGoodByID(id);
        if (id == null){
            throw new NullPointerException("此商品不存在");
        }else if (amount > good.getAmount()){
            throw new NotEnoughException("此商品库存不足");
        }else {
            Good buyGood = new Good();
            buyGood.setId(id);
            buyGood.setAmount(amount);
            goodDao.updateGood(buyGood);
            System.out.println("===================buyGood方法结束========================");
        }
    }
}
```



### Spring配置文件

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:util="http://www.springframework.org/schema/util"
       xmlns:context="http://www.springframework.org/schema/context"
       xsi:schemaLocation="http://www.springframework.org/schema/beans http://www.springframework.org/schema/beans/spring-beans.xsd http://www.springframework.org/schema/util https://www.springframework.org/schema/util/spring-util.xsd http://www.springframework.org/schema/context https://www.springframework.org/schema/context/spring-context.xsd">
    <!--
        可以把数据库的配置信息写在一个独立的文件中，便于修改数据库的配置内容
     -->
    <context:property-placeholder location="classpath:JDBC.properties"></context:property-placeholder>

    <!--声明数据源dataSource，连接数据库-->
    <bean id="dataSource" class="com.alibaba.druid.pool.DruidDataSource" init-method="init" destroy-method="close">
        <!--set注入给dataSource提供连接数据库的信息-->
        <property name="url" value="${jdbc.url}"></property>
        <property name="username" value="${jdbc.username}"></property>
        <property name="password" value="${jdbc.password}"></property>
        <property name="maxActive" value="20"></property>
    </bean>

    <!--声明的时mybatis提供的SqlSessionFactoryBean类，这个类的作用是创建SqlSessionFactory的-->
    <bean id="sqlSessionFactory" class="org.mybatis.spring.SqlSessionFactoryBean">
        <!--set注入，把数据库连接池赋值给了dataSource属性-->
        <property name="dataSource" ref="dataSource"></property>
        <!--
            mybatis主配置文件的位置
            configLocation属性是Resource类型，读取配置文件，赋值采用value
            使用classPath:表示文件位置
        -->
        <property name="configLocation" value="classpath:MyBatis.xml"></property>
    </bean>

    <!--
        创建dao对象，使用SqlSession的getMapper(StudentDao.class)
        在内部调用调用getMapper()生成每个dao接口的代理对象
    -->
    <bean class="org.mybatis.spring.mapper.MapperScannerConfigurer">
        <!--指定SqlSessionFactory对象的id-->
        <property name="sqlSessionFactoryBeanName" value="sqlSessionFactory"></property>
        <!--
            指定包名，包名是dao接口所在的包名
            MapperScannerConfigurer会扫描这个包中的所有接口，
            把每个接口都执行一个getMapper()方法，得到每个接口的dao对象
            创建好的对象是放在spring容器中的
        -->
        <property name="basePackage" value="com.hugh.dao"></property>
    </bean>

    <!--声明service-->
    <bean id="buyGoodServiceImpl" class="com.hugh.service.impl.BuyGoodServiceImpl">
        <property name="goodDao" ref="goodDao"></property>
        <property name="saleDao" ref="saleDao"></property>
    </bean>
</beans>
```

`JDBC.properties`

```properties
jdbc.url=jdbc:mysql://localhost:3306/hughdatabases
jdbc.username=root
jdbc.password=19961220
```

### 测试方法

```java
package com.hugh;

import com.hugh.service.BuyGoodService;
import org.junit.Test;
import org.springframework.context.ApplicationContext;
import org.springframework.context.support.ClassPathXmlApplicationContext;
import org.springframework.transaction.event.TransactionalEventListener;

public class TestBuyGoodService {
    @Test
    public void testBuyGood(){
        String springConfig = "applicationContext.xml";
        ApplicationContext applicationContext = new ClassPathXmlApplicationContext(springConfig);
        BuyGoodService buyGoodService = (BuyGoodService) applicationContext.getBean("buyGoodServiceImpl");
        buyGoodService.buyGood(1002,20);
    }
}
```

经过测试发现，在没有配置Spring的事务机制时，即使后段发生异常，前面已经执行的对表的操作仍然会执行。

### 使用Spring的事务注解管理事务 (中小型项目)

通过`@Transactional`注解方式，可将事务织入到相应 public 方法中，实现事务管理。

#### 步骤

1. 声明事务管理器对象

2. 开启事务注解驱动，告诉spring框架使用注解的方式管理事务

   spring使用aop机制，创建`@Transactional`所在的类代理对象，给方法加入事务的功能

   spring给业务方法加入事务：

   - 在业务方法执行之前开启事务，执行完毕之后提交或回滚事务，实际上使用的是AOP的环绕通知，Spring实现原理解释：

     ```java
     @Around("你要增加的事务功能的业务方法名称")
     Object myAround(){
         开启事务。Spring开启
             try{
                 业务方法
                 spring的事务管理器执行commit
             }catch (Exception e) {
                 spring的事务管理器执行rollback
             }
     }
     ```

3. 在业务方法上加`@Transactional`注解

#### 示例

在`applicationContext.xml`中加入

```xml
<!--声明事务管理器-->
<bean id="transactionManager" class="org.springframework.jdbc.datasource.DataSourceTransactionManager">
	<property name="dataSource" ref="dataSource"></property>
</bean>
<!--开启事务注解驱动，告诉spring使用注解管理事务，创建代理对象-->
<tx:annotation-driven transaction-manager="transactionManager"/>
<!--选择tx结尾的annotation-driven-->
```

在Service实现类的`public`方法上使用注解开启该方法的事务功能

```java
public class BuyGoodServiceImpl implements BuyGoodService {
    ...

    @Transactional(
            propagation = Propagation.REQUIRED,
            isolation = Isolation.DEFAULT,
            readOnly = false,
            rollbackFor = {NullPointerException.class,NotEnoughException.class}
    )
    @Override
    public void buyGood(Integer id,Integer amount) {
        ...
    }
}
```

这样事务机制就已经开启了，可以使用测试方法进行测试。实际上添加事务机制的注解可以简化为：

```java
public class BuyGoodServiceImpl implements BuyGoodService {
    ...

    @Transactional
    @Override
    public void buyGood(Integer id,Integer amount) {
        ...
    }
}
```

直接使用`@Transactional`可以起到一样的作用，因为一般使用的都是默认值，如果需要修改属性值时可以使用之前的格式。

>roolbackFor：表示发生指定的异常一定回滚。
>
>rollback的处理逻辑：
>
>1. Spring框架首先会检查方法抛出的异常是不是在rollback的属性值中，如果在属性值中：不论是什么类型的异常，一律回滚。
>2. 如果抛出的异常不在rollbackFor的列表中，Spring会判断异常是不是属于RuntimeException，如果属于RuntimeException就回滚。





### 使用AspectJ的AOP配置管理事务（大型项目）

声明式事务处理，适合大型项目，有很多的类和方法需要配置事务时使用。使用aspectJ框架功能，在spring框架的配置文件中声明类、方法需要的事务。这种方式下的业务方法和事务配置完全分离

#### 示例

**maven中注入aspectJ依赖**

```xml
<dependency> 
    <groupId>org.springframework</groupId> 
    <artifactId>spring-aspects</artifactId> 
    <version>5.2.5.RELEASE</version>
</dependency>
```

**声明事务管理器对象**

```xml
<bean id="transactionManager" class="org.springframework.jdbc.datasource.DataSourceTransactionManager">
	<property name="dataSource" ref="dataSource"></property>
</bean>
```

**声明方法需要的事务类型（配置方法的事务属性：隔离级别，传播行为，超时）**

```xml
<!--
        声明业务方法的事务属性（隔离级别，传播行为，超时时间）
        id:自定义名称，表示<tx:advice>和</tx:advice>之间的配置内容的
        transaction-manager：事务管理器对象
-->
<tx:advice id="advice" transaction-manager="transactionManager">
	<!--
		tx:attributes：配置事务的属性
		name:方法名称，完整的方法名，不带包和类
                 通配符，当项目方法比较多时，使用通配符比较方便，可以批量加事务
		propagation:传播行为，枚举值
		isolation:隔离等级
		rollback-for:指定的异常全限定类名，发生异常时回滚
	-->
	<tx:attributes>
		<!--tx:method:给具体的方法配置事务属性，method可以有多个，分别给不同的方法设置事务属性-->
		<tx:method name="buyGood" propagation="REQUIRED" isolation="DEFAULT" 
                   rollback-for="java.lang.NullPointerException,com.hugh.excep.NotEnoughException,"/>
	</tx:attributes>
</tx:advice>
```

**配置AOP，指定哪些类要创建代理**

当包和类多起来之后，可能不同包中有相同的类或者方法，这就需要配置AOP来进行区分

```xml
<aop:config>
	<!--
		配置切入点表达式：指定哪些包中类需要使用事务
		id:切入点表达式的名称
		expression：切入点表达式，指定哪些类需要使用事务，aspectJ会创建代理对象
	-->
	<aop:pointcut id="buyGood" expression="execution(* com.hugh.service.impl.BuyGoodServiceImpl.buyGood(..))"/>
	<!--
		配置增强器：管理advice和pointcut
		advice-ref：指定要增强方法的id值
		pointcut：切入点表达式的id值
	-->
	<aop:advisor advice-ref="advice" pointcut-ref="buyGood"></aop:advisor>
</aop:config>
```

# Spring与Web

使用spring框架建立web项目。关键是在servlet文件中获取Spring器，只有获取了Spring容器，才能获取service对象进行数据库操作执行业务方法。

> 参考：[Spring与Web项目整合的原理](https://www.cnblogs.com/xb1223/p/10167233.html)

新建一个maven-webapp项目

![](https://s1.ax1x.com/2020/09/15/wsIbVK.png)

pom.xml中添加项目所需要的依赖

```xml
<?xml version="1.0" encoding="UTF-8"?>

<project xmlns="http://maven.apache.org/POM/4.0.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <parent>
        <artifactId>MavenProject</artifactId>
        <groupId>com.hugh</groupId>
        <version>1.0-SNAPSHOT</version>
    </parent>
    <modelVersion>4.0.0</modelVersion>

    <artifactId>SpringWeb</artifactId>
    <packaging>war</packaging>

    <name>SpringWeb Maven Webapp</name>
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
            <scope>test</scope>
        </dependency>
        <!-- servlet依赖 -->
        <dependency>
            <groupId>javax.servlet</groupId>
            <artifactId>javax.servlet-api</artifactId>
            <version>3.1.0</version>
            <scope>provided</scope>
        </dependency>
        <!-- jsp依赖 -->
        <dependency>
            <groupId>javax.servlet.jsp</groupId>
            <artifactId>jsp-api</artifactId>
            <version>2.2.1-b03</version>
            <scope>provided</scope>
        </dependency>
        <dependency>
            <groupId>org.springframework</groupId>
            <artifactId>spring-aspects</artifactId>
            <version>5.2.5.RELEASE</version>
        </dependency>

        <dependency>
            <groupId>org.springframework</groupId>
            <artifactId>spring-context</artifactId>
            <version>5.2.5.RELEASE</version>
        </dependency>
        <dependency>
            <groupId>org.springframework</groupId>
            <artifactId>spring-tx</artifactId>
            <version>5.2.5.RELEASE</version>
        </dependency>
        <dependency>
            <groupId>org.springframework</groupId>
            <artifactId>spring-jdbc</artifactId>
            <version>5.2.5.RELEASE</version>
        </dependency>
        <dependency>
            <groupId>org.mybatis</groupId>
            <artifactId>mybatis</artifactId>
            <version>3.5.1</version>
        </dependency>
        <dependency>
            <groupId>org.mybatis</groupId>
            <artifactId>mybatis-spring</artifactId>
            <version>1.3.1</version>
        </dependency>
        <dependency>
            <groupId>mysql</groupId>
            <artifactId>mysql-connector-java</artifactId>
            <version>5.1.9</version>
        </dependency>
        <dependency>
            <groupId>com.alibaba</groupId>
            <artifactId>druid</artifactId>
            <version>1.1.12</version>
        </dependency>
        <dependency>
            <groupId>org.springframework</groupId>
            <artifactId>spring-aspects</artifactId>
            <version>5.2.5.RELEASE</version>
        </dependency>

        <!--添加监听器依赖-->
        <dependency>
            <groupId>org.springframework</groupId>
            <artifactId>spring-web</artifactId>
            <version>5.2.5.RELEASE</version>
        </dependency>
    </dependencies>
    

    <build>
        <finalName>SpringWeb</finalName>
        <pluginManagement><!-- lock down plugins versions to avoid using Maven defaults (may be moved to parent pom) -->
            <plugins>
                <plugin>
                    <artifactId>maven-clean-plugin</artifactId>
                    <version>3.1.0</version>
                </plugin>
                <!-- see http://maven.apache.org/ref/current/maven-core/default-bindings.html#Plugin_bindings_for_war_packaging -->
                <plugin>
                    <artifactId>maven-resources-plugin</artifactId>
                    <version>3.0.2</version>
                </plugin>
                <plugin>
                    <artifactId>maven-compiler-plugin</artifactId>
                    <version>3.8.0</version>
                </plugin>
                <plugin>
                    <artifactId>maven-surefire-plugin</artifactId>
                    <version>2.22.1</version>
                </plugin>
                <plugin>
                    <artifactId>maven-war-plugin</artifactId>
                    <version>3.2.2</version>
                </plugin>
                <plugin>
                    <artifactId>maven-install-plugin</artifactId>
                    <version>2.5.2</version>
                </plugin>
                <plugin>
                    <artifactId>maven-deploy-plugin</artifactId>
                    <version>2.8.2</version>
                </plugin>
            </plugins>
        </pluginManagement>

        <!--配置文件过滤-->
        <resources>
            <resource>
                <directory>src/main/java</directory>
                <includes>
                    <include>**/*.properties</include>
                    <include>**/*.xml</include>
                </includes>
                <filtering>false</filtering>
            </resource>
            <resource>
                <directory>src/main/resources</directory>
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

编写项目所需的pojo，dao，service

项目所需的实例

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
}
```

dao包下：

dao接口文件

```java
package com.hugh.dao;

import com.hugh.pojo.Student;

public interface StudentDao {
    int insertStudent(Student student);
}
```

mybati的映射文件

```xml
<?xml version="1.0" encoding="UTF-8" ?>
<!DOCTYPE mapper
        PUBLIC "-//mybatis.org//DTD Mapper 3.0//EN"
        "http://mybatis.org/dtd/mybatis-3-mapper.dtd">
<mapper namespace="com.hugh.dao.StudentDao">
    <insert id="insertStudent">
        insert into t_student values (#{id},#{name},#{age})
    </insert>
</mapper>
```

service包下的业务方法文件

接口方法

```java
package com.hugh.service;

import com.hugh.pojo.Student;

public interface StudentService {
    int addStudent(int id, String name, int age);
}
```

接口的实现类

```java
package com.hugh.service.impl;

import com.hugh.dao.StudentDao;
import com.hugh.pojo.Student;
import com.hugh.service.StudentService;

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
        int nums = studentDao.insertStudent(student);
        return nums;
    }
}
```

mabatis配置文件

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
        <package name="com.hugh.dao"/>
    </mappers>
</configuration>
```

Spring的配置文件

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xmlns:context="http://www.springframework.org/schema/context"
       xmlns:tx="http://www.springframework.org/schema/tx"
       xmlns:aop="http://www.springframework.org/schema/aop"
       xsi:schemaLocation="http://www.springframework.org/schema/beans
       http://www.springframework.org/schema/beans/spring-beans.xsd
       http://www.springframework.org/schema/context
       https://www.springframework.org/schema/context/spring-context.xsd
       http://www.springframework.org/schema/tx
       http://www.springframework.org/schema/tx/spring-tx.xsd
       http://www.springframework.org/schema/aop
       https://www.springframework.org/schema/aop/spring-aop.xsd">
    <!--
        可以把数据库的配置信息写在一个独立的文件中，便于修改数据库的配置内容
     -->
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
        <property name="configLocation" value="classpath:MyBatis.xml"></property>
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

jsp页面设置

```jsp
<%--
  Created by IntelliJ IDEA.
  User: Aqrose
  Date: 2020/8/22
  Time: 9:01
  To change this template use File | Settings | File Templates.
--%>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<html>
    <head>
    </head>
	<body>
		<center><h2>学生用户注册</h2></center>
		<form action="/myweb/rs" method="get">
    		<table align="center">
        		<tr>
            		<td>id</td>
            		<td><input type="text" name="id"></td>
        		</tr>
        		<tr>
            		<td>姓名：</td>
            		<td><input type="text" name="name"></td>
        		</tr>
        		<tr>
            		<td>年龄</td>
            		<td><input type="text" name="age"></td>
        		</tr>
        		<tr>
                    <td></td>
                    <td>
            		<input type="submit" value="注册">
                	</td>
        		</tr>
    		</table>
		</form>
	</body>
</html>
```

controller包下servlet文件

```java
package com.hugh.controller;

import com.hugh.service.StudentService;
import org.springframework.context.ApplicationContext;
import org.springframework.context.support.ClassPathXmlApplicationContext;
import org.springframework.web.context.ContextLoaderListener;
import org.springframework.web.context.WebApplicationContext;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

public class RegistServlet extends HttpServlet {
    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {

        System.out.println("开始============================================");
        String id = req.getParameter("id");
        String name = req.getParameter("name");
        String age = req.getParameter("age");
        
        /*
        // 每注册一次都要新建一个spring容器对象
        String applicationConfig = "applicationContext.xml";
        ApplicationContext applicationContext = new ClassPathXmlApplicationContext(applicationConfig);
        System.out.println("Spring容器对象："+applicationContext);
        StudentService service = (StudentService) applicationContext.getBean("studentService");
        */

        // 使用监听器来创建spring容器对象，项目运行期间只创建一次
        WebApplicationContext webApplicationContext = null;
        String key = WebApplicationContext.ROOT_WEB_APPLICATION_CONTEXT_ATTRIBUTE;
        Object attr = getServletContext().getAttribute(key);
        if (attr != null) {
            webApplicationContext = (WebApplicationContext) attr;
        }
        System.out.println("Spring容器对象："+webApplicationContext);
        StudentService service = (StudentService) webApplicationContext.getBean("studentService");
        service.addStudent(Integer.valueOf(id),name,Integer.valueOf(age));
        req.getRequestDispatcher("/result.jsp").forward(req,resp);
        System.out.println("结束=============================================");

    }

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {

    }
    
}
```

web.xml文件

```xml
<?xml version="1.0" encoding="UTF-8"?>
<web-app xmlns="http://xmlns.jcp.org/xml/ns/javaee"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://xmlns.jcp.org/xml/ns/javaee http://xmlns.jcp.org/xml/ns/javaee/web-app_4_0.xsd"
         version="4.0">
  <servlet>
    <servlet-name>RegistServlet</servlet-name>
    <servlet-class>com.hugh.controller.RegistServlet</servlet-class>
  </servlet>
  <servlet-mapping>
    <servlet-name>RegistServlet</servlet-name>
    <url-pattern>/rs</url-pattern>
  </servlet-mapping>
    <!--指定监听器位置-->
  <listener>
    <listener-class>org.springframework.web.context.ContextLoaderListener</listener-class>
  </listener>
    <!--指定Spring配置文件位置-->
  <context-param>
    <param-name>contextConfigLocation</param-name>
    <param-value>classpath:applicationContext.xml</param-value>
  </context-param>
</web-app>
```

最终项目结构

![](https://s1.ax1x.com/2020/09/15/wsIh8J.png)