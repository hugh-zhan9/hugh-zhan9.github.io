---
title: Java IO之 FileInputStream/FileOutputStream详解
tags: Java-IO
categories: Java
date: 2020-07-20 22:22:28




---

-

<!--more-->

# FileInputStream 和 FileOutputStream 简介

`FileInputStream`是文件输入流，它继承于`InputStream`。
通常，使用`FileInputStream`从某个文件中获得输入字节。

`FileOutputStream`是文件输出流，它继承于`OutputStream`。
通常，使用`FileOutputStream`将数据写入`File`或 `FileDescriptor`的输出流。

FileInputStream 函数接口

```java
FileInputStream(File file)         // 构造函数1：创建File对象对应的文件输入流
FileInputStream(FileDescriptor fd) // 构造函数2：创建文件描述符对应的文件输入流
FileInputStream(String path)       // 构造函数3：创建文件(路径为path)对应的文件输入流
    
// 常用方法
int      available()             // 返回剩余的可读取的字节数或者skip的字节数
void     close()                 // 关闭文件输入流
FileChannel      getChannel()    // 返回FileChannel
final FileDescriptor     getFD() // 返回文件描述符
int      			read()      // 返回文件输入流的下一个字节
// 读取文件输入流的数据并存在到buffer，从byteOffset开始存储，存储长度是byteCount。
int      read(byte[] buffer, int byteOffset, int byteCount) 
long     skip(long byteCount)    // 跳过byteCount个字节
```

FileOutputStream 函数接口

```java
// 构造函数1：创建File对象对应的文件输入流；默认追加模式是false，即写到输出的流内容不是以追加的方式添加到文件中。
FileOutputStream(File file)     
// 构造函数2：创建File对象对应的文件输入流；指定追加模式。
FileOutputStream(File file, boolean append)   
// 构造函数3：创建文件描述符对应的文件输入流；默认追加模式是false，即写到输出的流内容不是以追加的方式添加到文件中。
FileOutputStream(FileDescriptor fd)
// 构造函数4：创建文件(路径为path)对应的文件输入流；默认追加模式是false，即写到输出的流内容不是以追加的方式添加到文件中。
FileOutputStream(String path) 
// 构造函数5：创建文件(路径为path)对应的文件输入流；指定追加模式。
FileOutputStream(String path, boolean append) 

// 常用方法
void                    close()      // 关闭输出流
FileChannel             getChannel() // 返回FileChannel
final FileDescriptor    getFD()      // 返回文件描述符
// 将buffer写入到文件输出流中，从buffer的byteOffset开始写，写入长度是byteCount。
void                    write(byte[] buffer, int byteOffset, int byteCount) 
void                    write(int oneByte)  // 写入字节oneByte到文件输出流中
```



# 示例

```java
import java.io.File;
import java.io.FileDescriptor;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.BufferedInputStream;
import java.io.BufferedOutputStream;
import java.io.PrintStream;
import java.io.IOException;


public class FileStreamTest {

    private static final String FileName = "file.txt";

    public static void main(String[] args) {
        testWrite();
        testRead();
    }

    /**
     * FileOutputStream 演示函数
     *
     * 运行结果：
     * 在源码所在目录生成文件file.txt，文件内容是abcdefghijklmnopqrstuvwxyz0123456789
     *
     * 加入，我们将 FileOutputStream fileOut2 = new FileOutputStream(file, true);
     *       修改为 FileOutputStream fileOut2 = new FileOutputStream(file, false);
     * 然后再执行程序，file.txt的内容变成0123456789。
     * 原因是：
     * 1 FileOutputStream fileOut2 = new FileOutputStream(file, true);
     *      它是以追加模式将内容写入文件的。即写入的内容，追加到原始的内容之后。
     * 2 FileOutputStream fileOut2 = new FileOutputStream(file, false);
     *      它是以新建模式将内容写入文件的。即删除文件原始的内容之后，再重新写入。
     */
    private static void testWrite() {
        try {
            // 创建文件file.txt对应File对象
            File file = new File(FileName);
            // 创建文件file.txt对应的FileOutputStream对象，默认是关闭追加模式
            FileOutputStream fileOut1 = new FileOutputStream(file);
            // 创建FileOutputStream对应的PrintStream，方便操作。PrintStream的写入接口更便利
            PrintStream out1 = new PrintStream(fileOut1);
            // 向文件中写入26个字母
            out1.print("abcdefghijklmnopqrstuvwxyz");
            out1.close();

            // 创建文件file.txt对应的FileOutputStream对象，打开追加模式
            FileOutputStream fileOut2 = new FileOutputStream(file, true);
            // 创建FileOutputStream对应的PrintStream，方便操作。PrintStream的写入接口更便利
            PrintStream out2 = new PrintStream(fileOut2);
            // 向文件中写入0123456789+换行符
            out2.println("0123456789");
            out2.close();

        } catch(IOException e) {
            e.printStackTrace();
        }
    }

 
    // FileInputStream 演示程序
    private static void testRead() {
        try {
            // 方法1：新建FileInputStream对象
            // 新建文件file.txt对应File对象
            File file = new File(FileName);
            FileInputStream in1 = new FileInputStream(file);

            // 方法2：新建FileInputStream对象
            FileInputStream in2 = new FileInputStream(FileName);

            // 方法3：新建FileInputStream对象
            // 获取文件file.txt对应的文件描述符
            FileDescriptor fdin = in2.getFD();
            // 根据文件描述符创建FileInputStream对象
            FileInputStream in3 = new FileInputStream(fdin);

            // 测试read()，从中读取一个字节
            char c1 = (char)in1.read();
            System.out.println("c1="+c1);

            // 测试skip(long byteCount)，跳过4个字节
            in1.skip(25);

            // 测试read(byte[] buffer, int byteOffset, int byteCount)
            byte[] buf = new byte[10];
            in1.read(buf, 0, buf.length);
            System.out.println("buf="+(new String(buf)));


            // 创建FileInputStream对象对应的BufferedInputStream
            BufferedInputStream bufIn = new BufferedInputStream(in3);
            // 读取一个字节
            char c2 = (char)bufIn.read();
            System.out.println("c2="+c2);

            in1.close();
            in2.close();
            in3.close();
        } catch(IOException e) {
            e.printStackTrace();
        }
    }
}
```

运行结果：

```
c1=a
buf=0123456789
c2=a
```

结果说明：

运行程序，会在源码所在位置新生成一个文件`file.txt`。它的内容是`abcdefghijklmnopqrstuvwxyz0123456789`。