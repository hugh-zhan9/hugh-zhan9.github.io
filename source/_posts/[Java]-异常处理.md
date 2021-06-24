---
title: 异常处理
tags: Java
categories: Java
date: 2020-06-4 20:00:28


---

![](https://s1.ax1x.com/2020/06/04/tBB3Nj.png)

<!--more-->

什么叫异常？

异常是程序在运行过程中的遇到的一些阻止程序继续运行的错误

为了能及时有效地处理程序中的运行错误，Java专门设置了异常类。在Java中所有异常类型都是内置类`java.lang.Throwable`类的子类，分别是`Error`类和`Exception`类。

![](https://s1.ax1x.com/2020/05/30/tMDtE9.jpg)

如图，`Throwable`类是异常体系的根，继承自`Object`类。其余所有的异常类都源于或间接源于此。他的两个子类：

1. **`Error`**

   表示严重的错误，任何处理技术都无法恢复的情况，肯定会导致程序非正常终止。属于未检查类型。比如：

   - `OutOfMemoryError`：内存耗尽。
   - `NoClassDefFoundError`：无法加载某个Class。
   - `StackOverflowError`：栈溢出。
   - `NoClassDefFoubdError` ：找不到Class定义错误。

2. **`Exception`**

   又分为可检查(`checked`)异常和不检查(`unchecked`)异常，可检查异常在源码里**必须**显示的进行捕获处理，是编译期检查的一部分。

   不检查异常就是所谓的运行时异常(`RuntimeException`)，通常是可以编码避免的逻辑错误，具体根据需要来判断是否需要捕获，并不会在编译器强制要求。

   1). 运行时异常(`RuntimeException`)：

   - `NullPointerException` ：对某个`null`对象调用方法或字段。
   - `ClassCastException` ：类型强制转换异常。
   - `IllegalArgumentException` ：传递非法参数异常
   - `IndexOutOfBoundsException` ：下标越界异常
   - `NumberFormatException` ：数字格式异常

   2). 非运行时异常

   - `ClassNotFoundException` ：找不到指定的类
   - `IOException` ：IO操作异常



Java 通过面向对象的方法来处理异常。在一个方法的运行过程中，如果发生了异常，则这个方法会产生代表该异常的一个对象，并把它交给运行时的系统，运行时系统寻找相应的代码来处理这一异常。我们把生成异常对象，并把它提交给运行时系统的过程称为拋出（throw）异常。运行时系统在方法的调用栈中查找，直到找到能够处理该类型异常的对象，这一个过程称为捕获（catch）异常。

# 声明异常

当一个方法产生一个它不处理的异常时，那么就需要在该方法的头部声明这个异常，以便将该异常传递到方法的外部进行处理。使用 throws 声明的方法表示此方法不处理异常。throws 具体格式如下：

```java
returnType method_name(paramList) throws Exception 1,Exception2,…{…}
```

其中，`returnType`表示返回值类型，`method_name`表示方法名，`paramList`表示参数列表；`Exception 1，Exception2，… `表示异常类。如果有多个异常类，它们之间用逗号分隔。这些异常类可以是方法中调用了可能抛出异常的方法而产生的异常，也可以是方法体中生成并抛出的异常。

使用`throws`声明异常的思路是：当前方法不知道如何处理这种类型的异常，该异常由上一级的调用者处理，如果`main()`方法也不知道如何处理，也可以使用`throws`将该声明抛出异常，将该异常交给JVM处理。JVM对异常的处理方法是：打印异常的追踪栈信息，并中止程序运行，这程序遇到异常后自动结束的原因。

**方法重写时声明抛出异常的限制**

<font color=Red>子类方法声明抛出的异常类型应该是父类声明抛出的异常类型的子类或者相同异常类型，不允许子类抛出的异常类型比父类多</font>

## 自定义异常

如果Java提供的内置异常类型不能满足程序设计的需求，这时我们可以自己设计Java类库或框架，其中包括异常类型。实现自定义异常类需要继承`Exception`类或其子类，如果自定义运行时异常类需继承 `RuntimeException`类或其子类。语法：

```java
public class NameException extends Exception;
```

<font color=red>自定义异常类一般包含两个构造方法：一个是无参的默认构造方法，另一个构造方法以字符串的形式接收一个定制的异常信息，并将该消息传递给超类的构造方法</font>

```java
// 自定义异常类示例
import java.util.InputMismatchException;
import java.util.Scanner;
public class Test07 {
    public static void main(String[] args) {
        int age;
        System.out.println("请输入您的年龄： ");
        Scanner input = new Scanner(System.in);
        try {
            age = input.nextInt();  //获取年龄
            if(age < 0) {
                throw new AgeException("您输入的年龄为负数！输入有误！");
            } else if(age > 100) {
                throw new AgeException("您输入的年龄大于100！输入有误！");
            } else {
                System.out.println("您的年龄为："+age);
            }
        } catch(InputMismatchException e1) {
            System.out.println("输入的年龄不是数字！");
        } catch(AgeException e2) {
            System.out.println(e2.getMessage());
        }
    }
}
public class AgeException extends Exception {
    public AgeException() {
        super();
    }
    public AgeException(String str) {
        super(str);
    }
}
```



# 抛出异常

实现抛出异常和声明异常的关键字非常相似，它们是`throw`和`throws`。可以通过 throws 关键字在方法上声明该方法要拋出的异常，然后在方法内部通过 throw 拋出异常对象。

与`throws`不同的是：<font color=Red>`throw`语句用来直接抛出一个异常</font>，后接一个可抛出的异常类对象，语法格式如下：

```java
throw ExceptionObject;
```

其中`ExceptionObject`必须是`Throwable`类或其子类的对象。如果是自定义异常类，也必须是 `Throwable`的直接或间接子类。例如，以下语句在编译时将会产生语法错误：

```java
throw new String("抛出异常"); //String不是Throwable类的子类
```

所以抛出异常的基本步骤就是：

1. 创建某个`Exception`实例
2. 用`throw`抛出

实际上这两步可以合并在一块完成： `throw new NullPointerException();`

**`throws`关键字和`throw`关键字在使用上的几点区别如下**：

- `throws`用来声明一个方法可能抛出的所有异常信息，表示出现异常的一种可能性，但并不一定会发生这些异常；`throw`则是指拋出的一个具体的异常类型，执行`throw`则一定抛出了某种异常对象。
- 通常在一个方法（类）的声明处通过`throws`声明方法（类）可能拋出的异常信息，而在方法（类）内部通过`throw`声明一个具体的异常信息。
- `throws`通常不用显示地捕获异常，可由系统自动将所有捕获的异常信息抛给上级方法；`throw`则需要用户自己捕获相关的异常，而后再对其进行相关包装，最后将包装后的异常信息抛出。

# 捕获/处理异常

异常的产生是不可避免的，那么为了保证程序有效地执行，需要对发生的异常进行相应的处理。Java的异常处理通过 5 个关键字来实现：`try、catch、throw、throws`和`finally`。`try catch`语句用于捕获并处理异常，`finally`语句用于在任何情况下（除特殊情况外）都必须执行的代码，`throw`语句用于拋出异常，`throws`语句用于声明可能会出现的异常。

## 异常处理的机制

Java 的异常处理机制提供了一种结构性和控制性的方式来处理程序执行期间发生的事件。异常处理的机制如下：

- 在方法中用 try catch 语句捕获并处理异常，catch 语句可以有多个，用来匹配多个异常。
- 对于处理不了的异常或者要转型的异常，在方法的声明处通过 throws 语句拋出异常，即由上层的调用方法来处理。

## try...catch语句

捕获异常通常使用`try...catch`语句，把可能发生异常的代码放到`try{...}`中，然后使用`catch`捕获对应的`Exception`及其子类：

```java
try {
    // 可能发生异常的语句
} catch(ExceptionType e) {
    // 处理异常语句
}
```

> `try`语句块中声明的变量只是代码块内的局部变量，其他地方不能访问。

如果 try 语句块中发生异常，那么一个相应的异常对象就会被拋出，然后 catch 语句就会依据所拋出异常对象的类型进行捕获，并处理。处理之后，程序会跳过 try 语句块中剩余的语句，转到 catch 语句块后面的第一条语句开始执行。如果 try 语句块中没有异常发生，那么 try 块正常结束，后面的 catch 语句块被跳过，程序将从 catch 语句块后的第一条语句开始执行。

## 多catch语句

如果 try 代码块中有很多语句会发生异常，而且发生的异常种类又很多。那么可以在 try 后面跟有多个 catch 代码块。多 catch 代码块语法如下：

```java
try {
    // 可能会发生异常的语句
} catch(ExceptionType e) {
    // 处理异常语句
} catch(ExceptionType e) {
    // 处理异常语句
} catch(ExceptionType e) {
    // 处理异常语句
...
}
```

JVM在捕获到异常后，会从上到下匹配`catch`语句，匹配到某个`catch`后，执行`catch`代码块，然后不再继续匹配。即多个`catch`只会有一个被执行。**<font color=red>所以存在多个`catch`的时候，`catch`的顺序非常重要：子类必须写在前面。</font>**

```java
public static void main(String[] args){
    try{
        process1();
        process2();
        process3();
    }catch (IOException){
        System.out.println("IO error");
    }catch (UnsupportedEncodingException){ //永远捕获不到
        System.out.println("Bad encoding");
    }
}
```

因为`UnsupportedEncodingException`是`IOException`的子类。当抛出`IOException`时，`UnsupportedEncodingException`就不会被捕获。正确的做法是把子类放在前面。

## try...catch...finally

```java
try{
    //可能会发生异常的语句
}catch(Exception e){
    //处理异常语句
}finally{
    //清理代码块
}
```

无论是否发生异常（除特殊情况外），finally 语句块中的代码都会被执行。

使用 try-catch-finally 语句时需注意以下几点：

1. 异常处理语法结构中只有 try 块是必需的，也就是说，如果没有 try 块，则不能有后面的 catch 块和 finally 块；

2. catch 块和 finally 块都是可选的，但 catch 块和 finally 块至少出现其中之一，也可以同时出现；

3. 可以有多个 catch 块，捕获父类异常的 catch 块必须位于捕获子类异常的后面；

4. 不能只有 try 块，既没有 catch 块，也没有 finally 块；

5. 多个 catch 块必须位于 try 块之后，finally 块必须位于所有的 catch 块之后。

6. finally 与 try 语句块匹配的语法格式，此种情况会导致异常丢失，所以不常见。(当方法声明了可能抛出的异常时可以不用`catch`语句块。)

   



## 异常的转型

如果一个方法捕获了某个异常后，又在`catch`子句中抛出新的异常，就相当于把抛出的异常类型“转换”了：

```java
public class Main {
    public static void main(String[] args) {
        try {
            process1();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
    static void process1() {
        try {
            process2();
        } catch (NullPointerException e) {
            throw new IllegalArgumentException(); //异常转型
        }
    }
    static void process2() {
        throw new NullPointerException();
    }
}
```

打印出的异常栈类似：

```
java.lang.IllegalArgumentException
    at Main.process1(Main.java:15)
    at Main.main(Main.java:5)
```

这说明新的异常丢失了原始异常信息，我们已经看不到原始异常`NullPointerException`的信息了。为了能追踪到完整的异常栈，在构造异常的时候，把原始的`Exception`实例传进去，新的`Exception`就可以持有原始`Exception`信息。对上述代码改进如下：

```java
public class Main {
    public static void main(String[] args) {
        try {
            process1();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
    static void process1() {
        try {
            process2();
        } catch (NullPointerException e) {
            throw new IllegalArgumentException(e);
        }
    }
    static void process2() {
        throw new NullPointerException();
    }
}
```

运行上述代码，打印出的异常栈类似：

```
java.lang.IllegalArgumentException: java.lang.NullPointerException
    at Main.process1(Main.java:15)
    at Main.main(Main.java:5)
Caused by: java.lang.NullPointerException
    at Main.process2(Main.java:20)
    at Main.process1(Main.java:13)
```

注意到`Caused by: Xxx`，说明捕获的`IllegalArgumentException`并不是造成问题的根源，根源在于`NullPointerException`，是在`Main.process2()`方法抛出的。

在代码中获取原始异常可以使用`Throwable.getCause()`方法。如果返回`null`，说明已经是“根异常”了。

## 异常屏蔽

如果在执行`finally`语句时抛出异常，那么，`catch`语句的异常还能否继续抛出？

```java
public class Main {
    public static void main(String[] args) {
        try {
            Integer.parseInt("abc");
        } catch (Exception e) {
            System.out.println("catched");
            throw new RuntimeException(e);
        } finally {
            System.out.println("finally");
            throw new IllegalArgumentException();
        }
    }
}
```

执行上述代码，发现异常信息如下：

```
catched
finally
Exception in thread "main" java.lang.IllegalArgumentException
    at Main.main(Main.java:11)
```

这说明`finally`抛出异常后，原来在`catch`中准备抛出的异常就“消失”了，因为只能抛出一个异常。没有被抛出的异常称为“被屏蔽”的异常（Suppressed Exception）。

在极少数的情况下，我们需要获知所有的异常。如何保存所有的异常信息？方法是先用`origin`变量保存原始异常，然后调用`Throwable.addSuppressed()`，把原始异常添加进来，最后在`finally`抛出：

```java
public class Main {
    public static void main(String[] args) throws Exception {
        Exception origin = null;
        try {
            System.out.println(Integer.parseInt("abc"));
        } catch (Exception e) {
            origin = e;
            throw e;
        } finally {
            Exception e = new IllegalArgumentException();
            if (origin != null) {
                e.addSuppressed(origin);
            }
            throw e;
        }
    }
}
```

当`catch`和`finally`都抛出了异常时，虽然`catch`的异常被屏蔽了，但是，`finally`抛出的异常仍然包含了它：

```
Exception in thread "main" java.lang.IllegalArgumentException
    at Main.main(Main.java:11)
Suppressed: java.lang.NumberFormatException: For input string: "abc"
    at java.base/java.lang.NumberFormatException.forInputString(NumberFormatException.java:65)
    at java.base/java.lang.Integer.parseInt(Integer.java:652)
    at java.base/java.lang.Integer.parseInt(Integer.java:770)
    at Main.main(Main.java:6)
```

通过`Throwable.getSuppressed()`可以获取所有的`Suppressed Exception`。

绝大多数情况下，在`finally`中不要抛出异常。因此，我们通常不需要关心`Suppressed Exception`。

# 记录异常

## 异常跟踪栈

异常对象的`printStackTrace()`方法用于打印异常的跟踪栈信息，根据`printStackTrace()`方法输出的结果可以找到异常的源头，并跟踪到异常一路触发的过程。

异常跟踪栈信息的第一行一般详细显示异常的类型和异常的详细消息，接下来是所有异常的发生点，各行显示被调用方法中执行的停止位置，并标明类、类中的方法名、与故障点对应的文件的行。一行行地往下看，跟踪栈总是最内部的被调用方法逐渐上传，直到最外部业务操作的起点，通常就是程序的入口 main 方法或 Thread 类的 run 方法（多线程的情形）。

```java
public class Main{
    public static void main(String[] args){
        try{
            process1();
        }catch(Exception e){
            e.printStackTrace(); //printStackTrace()可以打印出方法的调用栈。
        }
    }
    static void process1(){
        prcess2();
    }
    static void process2(){
        Integer.parseInt(null); //会抛出NumberFormatException。
    }
}
```

上面的代码会抛出如下错误：

```java
java.lang.NumberFormatException: null
    at java.base/java.lang.Integer.parseInt(Integer.java:614)
    at java.base/java.lang.Integer.parseInt(Integer.java:770)
    at Main.process2(Main.java:16)
    at Main.process1(Main.java:12)
    at Main.main(Main.java:5)
```

`printStackTrace()`对于调试错误十分有用，上述信息表示`NumberFormatException`是在`java.lang.Integer.parseInt()`方法中抛出的，从下往上看调用关系依次是：

1. `main()`调用`process1()`；
2. `process1()`调用`process2()`;
3. `process2()`调用`Integer.parseInt(String)`;
4. `Integer.parseInt(String)`调用`Integer.parseInt(String, int)`。

## 日志记录异常

如果要生成简单的日志记录，可以使用全局日志记录器并调用其 info 方法

```java
Logger.getGlobal().info("打印信息");
```

JDK Logging 把日志分为如下表 7 个级别，等级依次降低。

| 级别     | SEVERE   | WARNING   | INFO   | CONFIG   | FINE   | FINER   | FINEST   |
| -------- | -------- | --------- | ------ | -------- | ------ | ------- | -------- |
| 调用方法 | severe() | warning() | info() | config() | fine() | finer() | finest() |
| 含义     | 严重     | 警告      | 信息   | 配置     | 良好   | 较好    | 最好     |

`Logger`的默认级别是`INFO`，比`INFO`级别低的日志将不显示。`Logger`的默认级别定义在`jre`安装目录的`lib`下。

```java
#Limit the message that are printed on the console to INFO and above.
java.util.logging.ConsoleHandler.level = INFO    
```

所以在默认情况下，日志只显示前三个级别，对于所有级别有下面几种记录方法：

```java
logger.warning(message);
logger.fine(message);
// 还可以使用log方法指定级别：
logger.log(Level.FINE, mesage);
```

可以使用`setLevel`方法设置级别，例如`logger.setLevel(Level.FINE);`可以将`FINE`和更高级别的都记录下来。另外，还可以使用`Level.ALL`开启所有级别的记录，或者使用`Level.OFF`关闭所有级别的记录。

> 如果将记录级别设计为`INFO`或者更低，则需要修改日志处理器的配置，默认的日志处理器不会处理低于`INFO`级别的信息。

修改日志管理器配置

可以通过编辑配置文件来修改日志系统的各种属性。在默认情况下，配置文件存在于`jre`安装目录下`jre/lib/logging.properties`。要想使用另一个配置文件，就要将`java.util.logging.config.file`特性设置为配置文件的存储位置，并用以下命令启动应用程序。

```java
java-Djava.util.logging.config.file = <config-file-name>
```

日志管理器在JVM启动过程中初始化，在`main()`执行之前完成，一旦开始运行`main()`方法就无法修改配置。如果在`main()`方法中调用`System.setProperty("java.util.logging.config.file",file)`，也会调用`LogManager.readConfiguration()`来重新初始化日志管理器。