---
title: Java IO之 ByteArrayOutputStream详解
tags: Java-IO
categories: Java
date: 2020-07-21 22:22:28




---

-

<!--more-->

# ByteArrayOutputStream 介绍

`ByteArrayOutputStream`是字节数组输出流。它继承于`OutputStream`。

`ByteArrayOutputStream`中的数据被写入一个`byte`数组。缓冲区会随着数据的不断写入而自动增长。可使用`toByteArray()`和`toString()`获取数据。

OutputStream 函数列表

```java
// 构造函数
OutputStream() 
// 常用方法
         void      close()
         void      flush()
         void      write(byte[] buffer, int offset, int count)
         void      write(byte[] buffer)
abstract void      write(int oneByte)
```

ByteArrayOutputStream 函数列表

```java
// 构造函数
ByteArrayOutputStream()
ByteArrayOutputStream(int size)
// 常用方法
               void     close()
synchronized   void     reset()
                int     size()
synchronized byte[]     toByteArray()
             String     toString(int hibyte)
             String     toString(String charsetName)
             String     toString()
synchronized   void     write(byte[] buffer, int offset, int len)
synchronized   void     write(int oneByte)
synchronized   void     writeTo(OutputStream out)
```

# 示例代码

```java
import java.io.IOException;
import java.io.OutputStream;
import java.io.ByteArrayOutputStream;
import java.io.ByteArrayInputStream;

public class ByteArrayOutputStreamTest {

    private static final int LEN = 5;
    // 对应英文字母 abcddefghijklmnopqrsttuvwxyz
    private static final byte[] ArrayLetters = {
        0x61, 0x62, 0x63, 0x64, 0x65, 0x66, 0x67, 0x68, 0x69, 0x6A, 0x6B, 0x6C, 0x6D, 0x6E, 0x6F,
        0x70, 0x71, 0x72, 0x73, 0x74, 0x75, 0x76, 0x77, 0x78, 0x79, 0x7A
    };

    public static void main(String[] args) {
        //String tmp = new String(ArrayLetters);
        //System.out.println("ArrayLetters="+tmp);

        tesByteArrayOutputStream();
    }

    
    //ByteArrayOutputStream的API测试函数
    private static void tesByteArrayOutputStream() {
        // 创建ByteArrayOutputStream字节流
        ByteArrayOutputStream baos = new ByteArrayOutputStream();

        // 依次写入A、B、C三个字母。0x41对应A，0x42对应B，0x43对应C。
        baos.write(0x41);
        baos.write(0x42);
        baos.write(0x43);
        System.out.printf("baos=%s\n", baos);

        // 将ArrayLetters数组中从3开始的后5个字节写入到baos中。
        // 即对应写入0x64, 0x65, 0x66, 0x67, 0x68，即defgh
        baos.write(ArrayLetters, 3, 5);
        System.out.printf("baos=%s\n", baos);

        // 计算长度
        int size = baos.size();
        System.out.printf("size=%s\n", size);

        // 转换成byte[]数组
        byte[] buf = baos.toByteArray();
        String str = new String(buf);
        System.out.printf("str=%s\n", str);

        // 将baos写入到另一个输出流中
        try {
            ByteArrayOutputStream baos2 = new ByteArrayOutputStream();
            baos.writeTo((OutputStream)baos2);
            System.out.printf("baos2=%s\n", baos2);
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}
```

运行结果：

```
baos=ABC
baos=ABCdefgh
size=8
str=ABCdefgh
baos2=ABCdefgh
```

# OutputStream 源码分析

```java
package java.io;

public abstract class OutputStream implements Closeable, Flushable {
    // 将字节b写入到“输出流”中。
    // 它在子类中实现！
    public abstract void write(int b) throws IOException;

    // 写入字节数组b到“字节数组输出流”中。
    public void write(byte b[]) throws IOException {
        write(b, 0, b.length);
    }

    // 写入字节数组b到“字节数组输出流”中，并且off是“数组b的起始位置”，len是写入的长度
    public void write(byte b[], int off, int len) throws IOException {
        if (b == null) {
            throw new NullPointerException();
        } else if ((off < 0) || (off > b.length) || (len < 0) ||
                   ((off + len) > b.length) || ((off + len) < 0)) {
            throw new IndexOutOfBoundsException();
        } else if (len == 0) {
            return;
        }
        for (int i = 0 ; i < len ; i++) {
            write(b[off + i]);
        }
    }

    public void flush() throws IOException {
    }

    public void close() throws IOException {
    }
}
```

# ByteArrayOutputStream 源码分析

```java
package java.io;

import java.nio.charset.Charset;
import java.util.Arrays;
import java.util.Objects;



public class ByteArrayOutputStream extends OutputStream {

	// 保存字节数组输出流数据的数组
    protected byte buf[];

    // 字节数组输出流的计数
    protected int count;

    // 构造函数，默认创建的字节数组大小是32
    public ByteArrayOutputStream() {
        this(32);
    }

    // 构造函数，创建指定数组大小的字节数组输出流
    public ByteArrayOutputStream(int size) {
        if (size < 0) {
            throw new IllegalArgumentException("Negative initial size: "
                                               + size);
        }
        buf = new byte[size];
    }

    // 确认容量
    // 若实际容量 < minCapacity，则增加字节数组输出流的容量
    private void ensureCapacity(int minCapacity) {
        // overflow-conscious code
        if (minCapacity - buf.length > 0)
            grow(minCapacity);
    }

    // 增加容量
    private void grow(int minCapacity) { 
        int oldCapacity = buf.length;
        // 新容量的初始化 = 旧容量x2
        int newCapacity = oldCapacity << 1;
        // 比较新容量和minCapacity的大小，并选取其中较大的数为新的容量
        if (newCapacity - minCapacity < 0)
            newCapacity = minCapacity;
        if (newCapacity - MAX_ARRAY_SIZE > 0)
            newCapacity = hugeCapacity(minCapacity);
        buf = Arrays.copyOf(buf, newCapacity);
    }

    private static int hugeCapacity(int minCapacity) {
        if (minCapacity < 0) // overflow
            throw new OutOfMemoryError();
        return (minCapacity > MAX_ARRAY_SIZE) ?
            Integer.MAX_VALUE :
            MAX_ARRAY_SIZE;
    }

    // 写入一个字节b到字节数组输出流中，并将计数+1
    public synchronized void write(int b) {
        ensureCapacity(count + 1);
        buf[count] = (byte) b;
        count += 1;
    }

    // 写入字节数组b到字节数组输出流中，off是写入字节数组b的起始位置，len是写入的长度
    public synchronized void write(byte b[], int off, int len) {
        Objects.checkFromIndexSize(off, len, b.length);
        ensureCapacity(count + len);
        System.arraycopy(b, off, buf, count, len);
        count += len;
    }
	// 将字节数组b写入到字节数组中
    public void writeBytes(byte b[]) {
        write(b, 0, b.length);
    }

    // 将字节数组输出流中的内容写入到字节数组数组输出流out中
    public synchronized void writeTo(OutputStream out) throws IOException {
        out.write(buf, 0, count);
    }

    // 重置字节数组输出流的计数
    public synchronized void reset() {
        count = 0;
    }

    // 将字节数组输出流转换成字节数组
    public synchronized byte[] toByteArray() {
        return Arrays.copyOf(buf, count);
    }

    // 返回字节数组输出流当前计数值
    public synchronized int size() {
        return count;
    }

   
    public synchronized String toString() {
        return new String(buf, 0, count);
    }

  
    public synchronized String toString(String charsetName)
        throws UnsupportedEncodingException
    {
        return new String(buf, 0, count, charsetName);
    }

    @Deprecated
    public synchronized String toString(int hibyte) {
        return new String(buf, hibyte, 0, count);
    }

    public void close() throws IOException {
    }
}
```

说明：

- `ByteArrayOutputStream`实际上是将字节数据写入到字节数组中去。
- 通过`ByteArrayOutputStream()`创建的字节数组输出流对应的字节数组大小是32。
- 通过`ByteArrayOutputStream(int size)`创建字节数组输出流，它对应的字节数组大小是`size`。
- `write(int oneByte)`的作用将`int`类型的`oneByte`换成`byte`类型，然后写入到输出流中
- `write(byte[] buffer, int offset, int len)`是将字节数组`buffer`写入到输出流中，`offset`是从`buffer`中读取数据的起始偏移位置，`len`是读取的长度。
- `writeTo(OutputStream out)`将该字节数组输出流的数据全部写入到输出流`out`中。

# 