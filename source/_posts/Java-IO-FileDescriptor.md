---
title: Java IO之 FileDescriptor详解
tags: Java-IO
categories: Java
date: 2020-07-20 22:22:28




---

-

<!--more-->



# FileDescriptor 简介

`FileDescriptor`是文件描述符。
`FileDescriptor`可以被用来表示开放文件、开放套接字等。
以`FileDescriptor`表示文件来说：当`FileDescriptor`表示某文件时，我们可以通俗的将`FileDescriptor`看成是该文件。但是，我们不能直接通过`FileDescriptor`对该文件进行操作；若需要通过`FileDescriptor`对该文件进行操作，则需要新创建`FileDescriptor`对应的`FileOutputStream`，再对文件进行操作。

**in、out、err介绍**

- in -- 标准输入(键盘)的描述符
- out -- 标准输出(屏幕)的描述符
- err -- 标准错误输出(屏幕)的描述符

它们3个的原理和用法都类似，下面我们通过`out`来进行深入研究。

## out 的作用和原理

`out`是标准输出(屏幕)的描述符。但是它有什么作用呢？
我们可以通俗理解，`out`就代表了标准输出(屏幕)。若我们要输出信息到屏幕上，即可通过`out`来进行操作；但是，`out`又没有提供输出信息到屏幕的接口(因为`out`本质是`FileDescriptor`对象，而`FileDescriptor`没有输出接口)。怎么办呢？
很简单，我们创建`out`对应的“输出流对象”，然后通过输出流的`write()`等输出接口就可以将信息输出到屏幕上。如下代码：

```java
try {
    FileOutputStream out = new FileOutputStream(FileDescriptor.out);
    out.write('A');
    out.close();
} catch (IOException e) {
}
```

执行上面的程序，会在屏幕上输出字母`A`。

为了方便我们操作，Java早已为我们封装好了“能方便的在屏幕上输出信息的接口”：通过`System.out`，我们能方便的输出信息到屏幕上。
因此，我们可以等价的将上面的程序转换为如下代码：

```java
System.out.print('A');
```

下面讲讲上面两段代码的原理
查看看`out`的定义。它的定义在`FileDescriptor`中，相关源码如下：

```java
public final class FileDescriptor {

    private int fd;

    public static final FileDescriptor out = new FileDescriptor(1);

    private FileDescriptor(int fd) {
        this.fd = fd;
        useCount = new AtomicInteger();
    }

    ...
}
```

从中，可以看出

- out就是一个FileDescriptor对象。它是通过构造函数FileDescriptor(int fd)创建的。
- `FileDescriptor(int fd)`的操作：就是给`fd`对象(int类型)赋值，并新建一个使用计数变量`useCount`。
  `fd`对象是非常重要的一个变量，`fd=1`就代表了标准输出，`fd=0`就代表了标准输入，`fd=2`就代表了标准错误输出。

`FileOutputStream out = new FileOutputStream(FileDescriptor.out);` 就是利用构造函数`FileOutputStream(FileDescriptor fdObj)`来创建`Filed.out`对应的`FileOutputStream`对象。

关于`System.out`是如何定义的。可以参考[深入了解System.out.println("hello world")]() 

通过上面的学习，我们知道，我们可以自定义标准的文件描述符 [即，`in`(标准输入)，`out`(标准输出)，`err`(标准错误输出)] 的流，从而完成输入/输出功能；但是，Java已经为我们封装好了相应的接口，即我们可以更方便的`System.in`，`System.out`，`System.err`去使用它们。
另外，我们也可以自定义文件、Socket等的文件描述符，进而对它们进行操作。参考下面示例代码中的`testWrite()`，`testRead()`等接口。



# 示例代码

```java
import java.io.PrintStream;
import java.io.FileDescriptor;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;


// FileDescriptor 测试程序
public class FileDescriptorTest {

    private static final String FileName = "file.txt";
    private static final String OutText = "Hi FileDescriptor";
    public static void main(String[] args) {
        testWrite();
        testRead();

        testStandFD() ;
        //System.out.println(OutText);
    }

    /**
     * FileDescriptor.out 的测试程序
     * 该程序的效果 等价于 System.out.println(OutText);
     */
    private static void testStandFD() {
        // 创建FileDescriptor.out 对应的PrintStream
        PrintStream out = new PrintStream(new FileOutputStream(FileDescriptor.out));
        // 在屏幕上输出 Hi FileDescriptor
        out.println(OutText);
        out.close();
    }

    /**
     * FileDescriptor写入示例程序
     * 
     * (01) 为了说明，通过文件名创建FileOutputStream与通过文件描述符创建FileOutputStream对象是等效的
     * (02) 该程序会在“该源文件”所在目录新建文件"file.txt"，并且文件内容是"Aa"。
     */
    private static void testWrite() {
        try {
            // 新建文件“file.txt”对应的FileOutputStream对象
            FileOutputStream out1 = new FileOutputStream(FileName);
            // 获取文件“file.txt”对应的“文件描述符”
            FileDescriptor fdout = out1.getFD();
            // 根据“文件描述符”创建“FileOutputStream”对象
            FileOutputStream out2 = new FileOutputStream(fdout);

            out1.write('A');    // 通过out1向“file.txt”中写入'A'
            out2.write('a');    // 通过out2向“file.txt”中写入'A'

            if (fdout!=null)
                System.out.printf("fdout(%s) is %s\n",fdout, fdout.valid());

            out1.close();
            out2.close();

        } catch(IOException e) {
            e.printStackTrace();
        }
    }

    /**
     * FileDescriptor读取示例程序
     *
     * 为了说明，"通过文件名创建FileInputStream"与“通过文件描述符创建FileInputStream”对象是等效的
     */
    private static void testRead() {
        try {
            // 新建文件“file.txt”对应的FileInputStream对象
            FileInputStream in1 = new FileInputStream(FileName);
            // 获取文件“file.txt”对应的“文件描述符”
            FileDescriptor fdin = in1.getFD();
            // 根据“文件描述符”创建“FileInputStream”对象
            FileInputStream in2 = new FileInputStream(fdin);

            System.out.println("in1.read():"+(char)in1.read());
            System.out.println("in2.read():"+(char)in2.read());

            if (fdin!=null)
                System.out.printf("fdin(%s) is %s\n", fdin, fdin.valid());

            in1.close();
            in2.close();
        } catch(IOException e) {
            e.printStackTrace();
        }
    }
}
```

运行结果：

```
fdout(java.io.FileDescriptor@2b820dda) is true
in1.read():A
in2.read():a
fdin(java.io.FileDescriptor@675b7986) is true
Hi FileDescriptor
```