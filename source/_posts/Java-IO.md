---
title: Java IO之 总体架构
tags: Java-IO
categories: Java
date: 2020-07-19 22:22:28


---

-

<!--more-->

# Java IO 简介

`Java IO`设计的初衷就是为了实现文件、控制台、网络设备这些IO设备的通信。例如：对于一个文件，可以打开文件，然后进行读取和写入。

在JDK 1.0中，Java提供的类都是以字节(byte)为单位，例如：`FileInputStream`和`FileOutputStream`。而到了JDK 1.1，为了与国际化接轨，在`Java io`中添加了许多以字符(Unicode)为单位进行操作的类。

在`Java IO`的称呼中，经常会提到输入流、输出流等等概念。所谓`流`，就是一种抽象的数据的总称，它的本质是能够进行传输。

- 按照流的数据流向，可以将其分为：输入流和输出流。
- 按照流中处理数据的单位，可以将其区分为：字节流和字符流。在Java中，字节占1个`Byte`，即8位；而字符是占2个`Byte`，即16位。而且，需要注意的是：**Java的字节是有符号类型，而字符是无符号类型。**

# Java IO 框架

## 以字节为单位的输入流的框架图

下面是以字节为单位的输入流的框架图。

![](https://s1.ax1x.com/2020/07/17/U6mRC6.jpg)

从中我们可以看出：

- `InputStream`是以字节为单位的输入流的超类。`InputStream`提供了`read()`方法从输入流中读取字节数据。

- `ByteArrayInputStream`是字节数组输入流。它包含一个内部缓冲区，该缓冲区包含从流中读取的字节；通俗点说，它的内部缓冲区就是一个字节数组，而`ByteArrayInputStream`本质就是通过字节数组来实现的。

- `PipedInputStream`是管道输入流，它和`PipedOutPutStram`一起使用，能实现多线程的管道通信。

- `FilterInputStream`是过滤输入流。它是`DataInputStream`和`BufferedInputStream`的超类。

- `DataInputStream`是数据输入流。它是用来装饰其它输入流，它允许应用程序以与机器无关方式从底层输入流中读取基本 Java数据类型。

- `BufferedInputStream`是缓冲输入流。它的作用是为另一个输入流添加缓冲功能。

- `File`是文件和目录路径名的抽象表示形式。关于File，注意以下两点：

  `File`不仅仅只是表示文件，它也可以表示是目录。

  `File`虽然在`IO`定义，但是它的超类是`Object`，而不是`InputStream`。

- `FileDescriptor`是文件描述符。它可以被用来表示开放文件、开放套接字等。

- `FileInputStream`是文件输入流。它通常用于对文件进行读取操作。

- `ObjectInputStream`是对象输入流。它和`ObjectOutputStream`一起用来提供对基本数据或对象的持久存储。

## 以字节为单位的输出流的框架图

下面是以字节为单位的输出流的框架图。

![](https://s1.ax1x.com/2020/07/17/U6mcU1.jpg)

从中我们可以看出：

- `OutputStream`是以字节为单位的输出流的超类。`OutputStream`提供了`write()`接口从输入流中读取字节数据。
- `ByteArrayOutputStream`是字节数组输出流。写入`ByteArrayOutputStream`的数据被写入一个`byte`数组。缓冲区会随着数据不断写入而自动增长。可使用`toByteArray()`和`toString()`获取数据。
- `PipedOutputStream`是管道输出流，它和`PipedInputStream`一起使用，能实现多线程的通信管道。
- `FilterOutputStream`是过滤输出流。它是`DataOutputStream`，`BufferedOutputStream`和`PrintStream`的超类。
- `DataOutputStream`是数据输出流，它是用来装饰其它输出流，它允许应用程序以与机器无关方式向底层写入基本Java数据类型。
- `BufferedOutputStream`是缓冲输出流，它的作用是为另一个输出流添加缓冲功能。
- `PrintStream`是打印输出流。它是用来装饰其它输出流，能为其它输出流添加功能，使它们能够方便地打印各种数据值表示形式。
- `FileOutputStream`是文件输出流，它通常用于向文件进行写入操纵。
- `ObjectOutputStream`是对象输出流，它和`ObjectInputStream`一起，用来提供对基本数据或对象的持久存储。

## 以字节为单位的输入流和输出流关联的框架图

输入流和输出流都有对应的关系，下面是将以字节为单位的输入流和输出流关联起来的图片

![](https://s1.ax1x.com/2020/07/17/U6mrDJ.jpg)

## 以字符为单位的输入流的框架图

下面是以字符为单位的输入流的框架图

![](https://s1.ax1x.com/2020/07/17/U6mwgU.jpg)

从中可以看到：

- `Reader`是以字符为单位的输入流的超类，它提供了`read()`接口来获取字符数据。
- `CharArrayReader`是字符数组输入流，它用于读取字符数组，它继承于`Readrt`。操作的数据是以字符为单位。
- `PipedReader`是字符类型的管道输入流。它和`PipedWriter`一起可以进行多线程间的通讯。在使用管道通信时，必须将`PipedWriter`和`PipedReader`配套使用。
- `FilterReader`是字符类型的过滤输入流。
- `BufferedReader`是字符缓冲输入流。它的作用是为另一个输入流添加缓冲功能。
- `InputStreamReader`是字节转字符的输入流。它是字节流通向字符流的桥梁。它使用指定的`charset`读取字节并将其解码为字符。
- `FileReader`是字符类型的文件输入流。它通常用于对文件进行读取操作。

## 以字符为单位的输出流的框架图

下面是以字符为单位的输出流的框架图

![](https://s1.ax1x.com/2020/07/17/U6mYEn.jpg)

- `Writer`是以字符为单位的输出流的超类。它提供了`write()`接口往其中写入数据
- `CharArrayWriter`是字符数组输出流。它用于读取字符数组，它继承于`Writer`。操作的数据是以字符为单位！
- `PipedWriter`是字符类型的管道输出流。它和`PipedReader`一起是可以通过管道进行线程间的通讯。在使用管道通信时，必须将`PipedWriter`和`PipedWriter`配套使用。
- `FilterWriter`是字符类型的过滤输出流。
- `BufferedWriter`是字符缓冲输出流。它的作用是为另一个输出流添加缓冲功能。
- `OutputStreamWriter`是字节转字符的输出流。它是字节流通向字符流的桥梁：它使用指定的 `charset`将字节转换为字符并写入。
- `FileWriter`是字符类型的文件输出流。它通常用于对文件进行读取操作。
- `PrintWriter`是字符类型的打印输出流。它是用来装饰其它输出流，能为其他输出流添加了功能，使它们能够方便地打印各种数据值表示形式。

## 以字符为单位的输入流和输出流关联的框架图

下面是将以字符为单位的输入流和输出流关联起来的图片。

![](https://s1.ax1x.com/2020/07/17/U6ezA1.jpg)

## 字节转换为字符流的框架图

在Java中，字节流能转换为字符流，下面是它们的转换关系图。

![](https://s1.ax1x.com/2020/07/17/U6eXnJ.jpg)

从中我们可以看出：

- `FileReader`继承于`InputStreamReader`，而`InputStreamReader`依赖于`InputStream`。具体表现在`InputStreamReader`的构造函数是以`InputStream`为参数。我们传入`InputStream`，在`InputStreamReader`内部通过转码，将字节转换成字符。
- `FileWriter`继承于`OutputStreamWriter`，而`OutputStreamWriter`依赖于`OutputStream`。具体表现在`OutputStreamWriter`的构造函数是以`OutputStream`为参数。我们传入`OutputStream`，在`OutputStreamWriter`内部通过转码，将字节转换成字符。

## 字节和字符的输入流对应关系

![](https://s1.ax1x.com/2020/07/17/U6eRXQ.jpg)

## 字节和字符的输出流对应关系

![](https://s1.ax1x.com/2020/07/17/U6e9yQ.jpg)