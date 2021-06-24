---
title: 代理
tags: Java
categories: Java
date: 2020-09-23 21:58:48




---





代理（Proxy）是通过代理对象访问目标对象，这样可以在目标对象基础上增强额外的功能，如添加权限，访问控制和审计等功能。

<!--more-->



Java代理分为静态代理和动态代理和`Cglib`代理，下面进行逐个说明。

# 1. 静态代理 

在编译前使用代理类来对被代理类进行功能的增强。代理的关系在编译期前已经确定了，所以只能代理单一的对象。

静态代理比较简单，只需要代理类和被代理类实现了同一接口，在代理类的构造函数中定义一个被代理类的对象即可。

Person接口

```java
public interface Person {
    void sayHello(String content);
}
```

被代理类：Student

```java
public class Student implements Person{
    @Override
    public void sayHello(String content) {
        System.out.println(content);
    }
}
```

代理类：StudentProxy

```java
public class StudentProxy implements Person{
    private Person obj;
    public StudentProxy(Person o){
        this.obj = obj;
    }

    @Override
    public void sayHello(String content) {
        System.out.println("ProxyObject sayHello begin");
        //在代理类的方法中 间接访问被代理对象的方法
        o.sayHello(content);
        System.out.println("ProxyObject sayHello end");
    }
}
```

测试类：StaticProxyTest

```java
public class StaticProxyTest{
    public static void main(String[] args) {
        // student为被代理对象，某些情况下 我们不希望修改已有的代码，我们采用代理来间接访问
        Student student = new Student();
        // 创建代理类对象
        StudentProxy proxy = new StudentProxy(student);
        // 调用代理类对象的方法
        proxy.sayHello("静态代理实现");
    }
}
```

-------------------------------

接口类`AdminService.java`接口

```java
package com.hugh.proxy.demo.service;

public interface AdminService {
    void update();
    Object find();
}
```

实现类`AdminServiceImpl.java`

```java
package com.hugh.proxy.demo.service;

public class AdminServiceImpl implements AdminService{
    public void update() {
        System.out.println("修改管理系统数据");
    }

    public Object find() {
        System.out.println("查看管理系统数据");
        return new Object();
    }
}
```

代理类`AdminServiceProxy.java`

```java
package com.hugh.proxy.demo.service;

public class AdminServiceProxy implements AdminService {

    private AdminService adminService;

    public AdminServiceProxy(AdminService adminService) {
        this.adminService = adminService;
    }

    public void update() {
        System.out.println("判断用户是否有权限进行update操作");
        adminService.update();
        System.out.println("记录用户执行update操作的用户信息、更改内容和时间等");
    }

    public Object find() {
        System.out.println("判断用户是否有权限进行find操作");
        System.out.println("记录用户执行find操作的用户信息、查看内容和时间等");
        return adminService.find();
    }
}
```

测试类`StaticProxyTest.java`

```java
package com.hugh.proxy.demo.service;

public class StaticProxyTest {

    public static void main(String[] args) {
        AdminService adminService = new AdminServiceImpl();
        AdminServiceProxy proxy = new AdminServiceProxy(adminService);
        proxy.update();
        System.out.println("=============================");
        proxy.find();
    }
}
```

输出：

```swift
判断用户是否有权限进行update操作
修改管理系统数据
记录用户执行update操作的用户信息、更改内容和时间等
=============================
判断用户是否有权限进行find操作
记录用户执行find操作的用户信息、查看内容和时间等
查看管理系统数据
```

总结：
静态代理模式在不改变目标对象的前提下，实现了对目标对象的功能扩展。

不足：

静态代理实现了目标对象的所有方法，一旦目标接口增加方法，代理对象和目标对象都要进行相应的修改，增加了维护成本。

# 2. JDK动态代理

动态代理是通过反射原理，在运行期动态地生成字节码来对被代理类实现功能增强的。动态代理的代理关系只有在代码真正执行时才会确定，可以代理任一对象。

为解决静态代理对象必须实现接口的所有方法的问题，Java给出了动态代理，动态代理具有如下特点：

1. `Proxy`对象不需要`implements`接口；
2. `Proxy`对象的生成利用JDK的API，在JVM内存中动态的构建`Proxy`对象。需要使用`java.lang.reflect.Proxy`类的

```java
  /**
     * Returns an instance of a proxy class for the specified interfaces
     * that dispatches method invocations to the specified invocation
     * handler.
 
     * @param   loader the class loader to define the proxy class
     * @param   interfaces the list of interfaces for the proxy class
     *          to implement
     * @param   h the invocation handler to dispatch method invocations to
     * @return  a proxy instance with the specified invocation handler of a
     *          proxy class that is defined by the specified class loader
     *          and that implements the specified interfaces

     */
static Object newProxyInstance(ClassLoader loader, Class<?>[] interfaces, InvocationHandler invocationHandler );
```

方法，方法参数说明：

- `ClassLoader loader`：指定当前`target`对象使用类加载器，获取加载器的方法是固定的：`被代理类对象.getClass().getClassLoader()`；
- `Class<?>[] interfaces`：`target`对象实现的接口的类型，使用泛型方式确认类型
- `InvocationHandler invocationHandler`：事件处理，执行`target`对象的方法时，会触发事件处理器的方法，会把当前执行`target`对象的方法作为参数传入。

Java的动态代理机制中，有两个重要的类/接口，一个是`InvocationHandler`（Interface），还有一个是`Proxy`（class）。

`InvocationHandler`是每一个动态代理类都必须要实现的接口，并且每个代理类的实例都关联到了一个handler，当我们通过代理对象调用一个方法的时候，该方法的调用就会被转发由`InvocationHandler`这个接口的`invoke`方法来调用。

`Proxy`类，动态的创建一个代理对象的类，它提供了许多方法，我们用的最多的是`newProxyInstance`方法，该方法的作用就是得到一个动态的代理对象。

**代理类中要实现的内容有：**

1. 因为动态代理不知道被代理的类是哪一个，所以在实现了`InvocationHandler`的代理类中定义了一个`Object`类，在代理类的构造函数中作为参数传递进来。
2. 实现`InvocationHandler`的`invoke`方法。
3. 写`main`方法，并在`main`方法中根据定义的被代理类实现代理类的生成。

动态代理的步骤：

1. 首先获得一个被代理对象的引用
2. 获得该引用的接口
3. 生成一个类，这个类实现了我们给的代理对象所实现的接口
4. 上述类编译生成了`.class`字节码供JVM使用
5. 调用上述生成的`class`

```java
import java.lang.reflect.InvocationHandler;
import java.lang.reflect.Method;
import java.lang.reflect.Proxy;

/**
 * 动态代理类
 * @author hugh
 *
 */
public class DynamicProxy implements InvocationHandler {
    // 代理类中的真实对象
    private Object object;
    // 构造函数，给真实对象赋值
    public DynamicProxy(Object object){
        this.object = object;
    }

    @Override
    public Object invoke(Object proxy, Method method, Object[] args) throws Throwable {
        System.out.println("DynamicProxy invoke begin");
        System.out.println("proxy: "+ proxy.getClass().getName());
        System.out.println("method: "+ method.getName());
        for(Object o : args){
            System.out.println("arg: "+ o);
        }
        //通过反射调用 被代理类的方法
        method.invoke(object, args);  // 这里调用的是Method的invoke方法
        System.out.println("DynamicProxy invoke end");
        return null;
    }
}
```

测试类/调用类

```java
import java.lang.reflect.Proxy;

public class DynamicProxyTest{
    public static void main(String [] args){
        //创建需要被代理的类
        Person student = new Student();
        // 创建被代理类的委托类，之后想要调用被代理类的方法时，都会委托给这个类的invoke(Object proxy, Method method, Object[] args)方法
        DynamicProxy handler = new DynamicProxy(student);
        //生成代理类, 注意newProxyInstance的三个参数所代表的含义
        Person proxy = (Person) Proxy.newProxyInstance(student.getClass().getClassLoader(), student.getClass().getInterfaces(), handler);
        //通过代理类调用 被代理类的方法
        proxy.sayHello("被代理对象执行自己的方法");
        proxy.sayGoodBye(true);
        System.out.println("end");
    }
}
```





##  实战代码：

接口

```java
public interface IUserDao {
    void save();
}
```

实现类

```java
public class UserDao implements IUserDao {
    public void save() {
        System.out.println("----已经保存数据!----");
    }
}
```

采用匿名类的方式

```java
public class ProxyFactory{
    //维护一个目标对象
    private Object target;
    public ProxyFactory(Object target){
        this.target=target;
    }

   //给目标对象生成代理对象
    public Object getProxyInstance(){
        return Proxy.newProxyInstance(
                target.getClass().getClassLoader(),
                target.getClass().getInterfaces(),
                new InvocationHandler() {
                    @Override
                    public Object invoke(Object proxy, Method method, Object[] args) throws Throwable {
                        System.out.println("开始事务2");
                        //执行目标对象方法
                        Object returnValue = method.invoke(target, args);
                        System.out.println("提交事务2");
                        return returnValue;
                    }
                }
        );
    }

}
```

测试类，模拟现实中需要使用代理的情景

```java
/**
 * 测试类
 */
public class App {
    public static void main(String[] args) {
        // 目标对象
        IUserDao target = new UserDao();
        // 【原始的类型 class cn.itcast.b_dynamic.UserDao】
        System.out.println(target.getClass());

        // 给目标对象，创建代理对象
        IUserDao proxy = (IUserDao) new ProxyFactory(target).getProxyInstance();
        // class $Proxy0   内存中动态生成的代理对象
        System.out.println(proxy.getClass());

        // 执行方法   【代理对象】
        proxy.save();
    }
}
```



-----------------------------

`AdminServiceImpl.java`和`AdminService.java`和原来一样，这里不再赘述。

`AdminServiceInvocation.java`  

```java
package com.hugh.proxy.demo.service;

import java.lang.reflect.InvocationHandler;
import java.lang.reflect.Method;

public class AdminServiceInvocation  implements InvocationHandler {

    private Object target;

    public AdminServiceInvocation(Object target) {
        this.target = target;
    }

    @Override
    public Object invoke(Object proxy, Method method, Object[] args) throws Throwable {
        System.out.println("判断用户是否有权限进行操作");
       Object obj = method.invoke(target);
        System.out.println("记录用户执行操作的用户信息、更改内容和时间等");
        return obj;
    }
}
```

`AdminServiceDynamicProxy.java`

```java
package com.hugh.proxy.demo.service;

import java.lang.reflect.InvocationHandler;
import java.lang.reflect.Proxy;

public class AdminServiceDynamicProxy {
    
    private Object target;
    private InvocationHandler invocationHandler;
    
    public AdminServiceDynamicProxy(Object target,InvocationHandler invocationHandler){
        this.target = target;
        this.invocationHandler = invocationHandler;
    }

    public Object getPersonProxy() {
        Object obj = Proxy.newProxyInstance(target.getClass().getClassLoader(), target.getClass().getInterfaces(), invocationHandler);
        return obj;
    }
}
```

`DynamicProxyTest.java`

```java
package com.hugh.proxy.demo.service;

import java.lang.reflect.InvocationHandler;
import java.lang.reflect.Method;
import java.lang.reflect.Proxy;

public class DynamicProxyTest {
    public static void main(String[] args) {

        // 方法一
        System.out.println("============ 方法一 ==============");
        AdminService adminService = new AdminServiceImpl();
        System.out.println("代理的目标对象：" + adminService.getClass());

        AdminServiceInvocation adminServiceInvocation = new AdminServiceInvocation(adminService);

        AdminService proxy = (AdminService) new AdminServiceDynamicProxy(adminService, adminServiceInvocation).getPersonProxy();

        System.out.println("代理对象：" + proxy.getClass());

        Object obj = proxy.find();
        System.out.println("find 返回对象：" + obj.getClass());
        System.out.println("----------------------------------");
        proxy.update();

        //方法二
        System.out.println("============ 方法二 ==============");
        AdminService target = new AdminServiceImpl();
        AdminServiceInvocation invocation = new AdminServiceInvocation(adminService);
        AdminService proxy2 = (AdminService) Proxy.newProxyInstance(target.getClass().getClassLoader(), target.getClass().getInterfaces(), invocation);

        Object obj2 = proxy2.find();
        System.out.println("find 返回对象：" + obj2.getClass());
        System.out.println("----------------------------------");
        proxy2.update();

        //方法三
        System.out.println("============ 方法三 ==============");
        final AdminService target3 = new AdminServiceImpl();
        AdminService proxy3 = (AdminService) Proxy.newProxyInstance(target3.getClass().getClassLoader(), target3.getClass().getInterfaces(), new InvocationHandler() {

            public Object invoke(Object proxy, Method method, Object[] args) throws Throwable {
                System.out.println("判断用户是否有权限进行操作");
                Object obj = method.invoke(target3, args);
                System.out.println("记录用户执行操作的用户信息、更改内容和时间等");
                return obj;
            }
        });

        Object obj3 = proxy3.find();
        System.out.println("find 返回对象：" + obj3.getClass());
        System.out.println("----------------------------------");
        proxy3.update();


    }
}
```

输出结果：

```
============ 方法一 ==============
代理的目标对象：class com.hugh.proxy.demo.service.AdminServiceImpl
代理对象：class com.sun.proxy.$Proxy0
判断用户是否有权限进行操作
查看管理系统数据
记录用户执行操作的用户信息、更改内容和时间等
find 返回对象：class java.lang.Object
----------------------------------
判断用户是否有权限进行操作
修改管理系统数据
记录用户执行操作的用户信息、更改内容和时间等
============ 方法二 ==============
判断用户是否有权限进行操作
查看管理系统数据
记录用户执行操作的用户信息、更改内容和时间等
find 返回对象：class java.lang.Object
----------------------------------
判断用户是否有权限进行操作
修改管理系统数据
记录用户执行操作的用户信息、更改内容和时间等
============ 方法三 ==============
判断用户是否有权限进行操作
查看管理系统数据
记录用户执行操作的用户信息、更改内容和时间等
find 返回对象：class java.lang.Object
----------------------------------
判断用户是否有权限进行操作
修改管理系统数据
记录用户执行操作的用户信息、更改内容和时间等
```

# 3. Cglib代理

JDK动态代理要求`target`对象是一个接口的实现对象，假如`target`对象只是一个单独的对象，并没有实现任何接口，这时候就会用到`Cglib`代理(`Code Generation Library`)，即通过构建一个子类对象，从而实现对`target`对象的代理，因此目标对象不能是`final`类(报错)，且目标对象的方法不能是`final`或`static`（不执行代理功能）。
 `Cglib`依赖的jar包

```xml
  <dependency>
            <groupId>cglib</groupId>
            <artifactId>cglib</artifactId>
            <version>3.2.10</version>
  </dependency>
```

## 实战

目标对象类`AdminCglibService.java`

```java
package com.hugh.proxy.demo.service;

public class AdminCglibService {
    public void update() {
        System.out.println("修改管理系统数据");
    }

    public Object find() {
        System.out.println("查看管理系统数据");
        return new Object();
    }
}
```

代理类`AdminServiceCglibProxy.java`

```java
package com.hugh.proxy.demo.service;

import net.sf.cglib.proxy.Enhancer;
import net.sf.cglib.proxy.MethodInterceptor;
import net.sf.cglib.proxy.MethodProxy;

import java.lang.reflect.Method;

public class AdminServiceCglibProxy implements MethodInterceptor {

    private Object target;

    public AdminServiceCglibProxy(Object target) {
        this.target = target;
    }

    //给目标对象创建一个代理对象
    public Object getProxyInstance() {
        //工具类
        Enhancer en = new Enhancer();
        //设置父类
        en.setSuperclass(target.getClass());
        //设置回调函数
        en.setCallback(this);
        //创建子类代理对象
        return en.create();
    }

    @Override
    public Object intercept(Object object, Method method, Object[] arg2, MethodProxy proxy) throws Throwable {

        System.out.println("判断用户是否有权限进行操作");
        Object obj = method.invoke(target);
        System.out.println("记录用户执行操作的用户信息、更改内容和时间等");
        return obj;
    }


}
```

`Cglib`代理测试类`CglibProxyTest.java`

```java
package com.hugh.proxy.demo.service;

public class CglibProxyTest {
    public static void main(String[] args) {

        // 创建目标对象
        AdminCglibService target = new AdminCglibService();
        // 创建代理对象
        AdminServiceCglibProxy proxyFactory = new AdminServiceCglibProxy(target);
        AdminCglibService proxy = (AdminCglibService) proxyFactory.getProxyInstance();

        System.out.println("代理对象：" + proxy.getClass());

        Object obj = proxy.find();
        System.out.println("find 返回对象：" + obj.getClass());
        System.out.println("----------------------------------");
        proxy.update();
    }
}
```

输出结果：

```
代理对象：class com.hugh.proxy.demo.service.AdminCglibService$$EnhancerByCGLIB$$41b156f9
判断用户是否有权限进行操作
查看管理系统数据
记录用户执行操作的用户信息、更改内容和时间等
find 返回对象：class java.lang.Object
----------------------------------
判断用户是否有权限进行操作
修改管理系统数据
记录用户执行操作的用户信息、更改内容和时间等
```

# 总结

理解上述Java代理后，也就明白Spring AOP的代理实现模式，即加入Spring中的target是接口的实现时，就使用JDK动态代理，否是就使用Cglib代理。Spring也可以通过`<aop:config proxy-target-class="true">`强制使用Cglib代理，使用Java字节码编辑类库ASM操作字节码来实现，直接以二进制形式动态地生成 stub 类或其他代理类，性能比JDK更强。



