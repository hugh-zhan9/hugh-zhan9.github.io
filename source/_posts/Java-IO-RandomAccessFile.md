---
title: Java IO之 RandomAccessFile详解
tags: Java-IO
categories: Java
date: 2020-07-24 22:22:28




---

-

<!--more-->

# RandomAccessFile 简介

`RandomAccessFile`是随机访问文件(包括读/写)的类。它支持对文件随机访问的读取和写入，即我们可以从指定的位置读取/写入文件数据。

需要注意的是，`RandomAccessFile`虽然属于`java.io`包，但它不是`InputStream`或者`OutputStream`的子类；它也不同于`FileInputStream`和`FileOutputStream`。 `FileInputStream`只能对文件进行读操作，而`FileOutputStream`只能对文件进行写操作；但是，`RandomAccessFile`同时支持文件的读和写，并且它支持随机访问。

RandomAccessFile 函数列表

```java
// 构造函数
RandomAccessFile(File file, String mode)
RandomAccessFile(String fileName, String mode)

void     close()
synchronized final FileChannel     getChannel()
final FileDescriptor     getFD()
long     getFilePointer()
long     length()
int     read(byte[] buffer, int byteOffset, int byteCount)
int     read(byte[] buffer)
int     read()
final boolean     readBoolean()
final byte     readByte()
final char     readChar()
final double     readDouble()
final float     readFloat()
final void     readFully(byte[] dst)
final void     readFully(byte[] dst, int offset, int byteCount)
final int     readInt()
final String     readLine()
final long     readLong()
final short     readShort()
final String     readUTF()
final int     readUnsignedByte()
final int     readUnsignedShort()
void     seek(long offset)
void     setLength(long newLength)
int     skipBytes(int count)
void     write(int oneByte)
void     write(byte[] buffer, int byteOffset, int byteCount)
void     write(byte[] buffer)
final void     writeBoolean(boolean val)
final void     writeByte(int val)
final void     writeBytes(String str)
final void     writeChar(int val)
final void     writeChars(String str)
final void     writeDouble(double val)
final void     writeFloat(float val)
final void     writeInt(int val)
final void     writeLong(long val)
final void     writeShort(int val)
final void     writeUTF(String str)
```

# RandomAccessFile 模式说明

`RandomAccessFile`共有4种模式：`r`, `rw`, `rws`和`rwd`。

> `r`以只读方式打开。调用结果对象的任何`write`方法都将导致抛出` IOException`。
>
> `rw`打开以便读取和写入。
>
> `rws`打开以便读取和写入。相对于 `rw`，`rws`还要求对文件的内容或元数据的每个更新都同步写入到基础存储设备。
>
> `rwd`打开以便读取和写入，相对于 `rw`，`rwd`还要求对文件的内容的每个更新都同步写入到基础存储设备。

说明：

1. 什么是元数据，即`metadata`

英文解释如下：

> The definition of metadata is "data about other data." With a file system, the data is contained in its files and directories, and the metadata tracks information about each of these objects: Is it a regular file, a directory, or a link? What is its size, creation date, last modified date, file owner, group owner, and access permissions?

大致意思是：
`metadata`是关于数据的数据。在文件系统中，数据被包含在文件和文件夹中；`metadata`信息包括：数据是一个文件，一个目录还是一个链接，数据的创建时间(简称ctime)，最后一次修改时间(简称mtime)，数据拥有者，数据拥有群组，访问权限等等。

2. rw，rws，rwd 的区别。

当操作的文件是存储在本地的基础存储设备上时(如硬盘, NandFlash等)，`rws`或`rwd`, `rw`才有区别。

当模式是`rws`并且操作的是基础存储设备上的文件；那么，每次更改文件内容(如`write()`写入数据)或修改文件元数据(如文件的`mtime`)时，都会将这些改变同步到基础存储设备上。

当模式是`rwd`并且操作的是基础存储设备上的文件；那么，每次更改文件内容(如`write()`写入数据)时，都会将这些改变同步到基础存储设备上。
当模式是`rw`并且操作的是基础存储设备上的文件；那么，关闭文件时，会将文件内容的修改同步到基础存储设备上。至于，更改文件内容时，是否会立即同步，取决于系统底层实现。

# 示例

```java
import java.io.File;
import java.io.FileDescriptor;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.BufferedInputStream;
import java.io.BufferedOutputStream;
import java.io.PrintStream;;
import java.io.RandomAccessFile;
import java.io.IOException;

/**
 * RandomAccessFile 测试程序
 *
 * 运行结果(输出如下)：
 * c1=a
 * c2=b
 * buf=9876543210
 * 
 * 此外,
 * 	在源文件所在目录生成了file.txt。
 * 	注意RandomAccessFile写入boolean, byte, char, int,所占的字符个数。
 */
public class RandomAccessFileTest {

    private static final String FileName = "file.txt";

    public static void main(String[] args) {
        // 若文件file.txt存在，则删除该文件。
        File file = new File(FileName);
        if (file.exists())
            file.delete();

        testCreateWrite();
        testAppendWrite();
        testRead();
    }

    /**
     * 若file.txt不存在的话，则新建文件，并向文件中写入内容
     */
    private static void testCreateWrite() {
        try {
            // 创建文件file.txt对应File对象
            File file = new File(FileName);
            // 创建文件file.txt对应的RandomAccessFile对象
            RandomAccessFile raf = new RandomAccessFile(file, "rw");

            // 向文件中写入26个字母+回车
            raf.writeChars("abcdefghijklmnopqrstuvwxyz\n");
            // 向文件中写入 9876543210+回车
            raf.writeChars("9876543210\n");

            raf.close();
        } catch(IOException e) {
            e.printStackTrace();
        }
    }

    /**
     * 向文件末尾追加内容
     */
    private static void testAppendWrite() {
        try {
            // 创建文件file.txt对应File对象
            File file = new File(FileName);
            // 创建文件file.txt对应的RandomAccessFile对象
            RandomAccessFile raf = new RandomAccessFile(file, "rw");

            // 获取文件长度
            long fileLen = raf.length();
            // 将位置定位到文件末尾
            raf.seek(fileLen);

            // 以下向raf文件中写数据  
            raf.writeBoolean(true); // 占1个字节  
            raf.writeByte(0x41);    // 占1个字节  
            raf.writeChar('a');     // 占2个字节  
            raf.writeShort(0x3c3c); // 占2个字节  
            raf.writeInt(0x75);     // 占4个字节  
            raf.writeLong(0x1234567890123456L); // 占8个字节  
            raf.writeFloat(4.7f);  // 占4个字节  
            raf.writeDouble(8.256);// 占8个字节  
            raf.writeUTF("UTF严"); // UTF-8格式写入
            raf.writeChar('\n');   // 占2个字符。换行符

            raf.close();
        } catch(IOException e) {
            e.printStackTrace();
        }
    }

    /**
     * 通过RandomAccessFile读取文件
     */
    private static void testRead() {
        try {
            // 创建文件file.txt对应File对象
            File file = new File(FileName);
            // 创建文件file.txt对应的RandomAccessFile对象，以只读方式打开
            RandomAccessFile raf = new RandomAccessFile(file, "r");

            // 读取一个字符
            char c1 = raf.readChar();
            System.out.println("c1="+c1);
            // 读取一个字符
            char c2 = raf.readChar();
            System.out.println("c2="+c2);

            // 跳过54个字节。
            raf.seek(54);

            // 测试read(byte[] buffer, int byteOffset, int byteCount)
            byte[] buf = new byte[20];
            raf.read(buf, 0, buf.length);
            System.out.println("buf="+(new String(buf)));

            raf.close();
        } catch(IOException e) {
            e.printStackTrace();
        }
    }
}
```

