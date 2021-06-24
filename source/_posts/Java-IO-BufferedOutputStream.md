---
title: Java IO之 BufferedOutputStream详解
tags: Java-IO
categories: Java
date: 2020-07-20 23:22:28





---

-

<!--more-->

# BufferedOutputStream 简介

`BufferedOutputStream`是缓冲输出流。它继承于`FilterOutputStream`。

`BufferedOutputStream`的作用是为另一个输出流提供缓冲功能。

BufferedOutputStream 函数列表

```java
// 构造函数
BufferedOutputStream(OutputStream out)
BufferedOutputStream(OutputStream out, int size)
// 常用方法
synchronized void     close()
synchronized void     flush()
synchronized void     write(byte[] buffer, int offset, int length)
synchronized void     write(int oneByte)
```

# 示例

```java
import java.io.BufferedOutputStream;
import java.io.File;
import java.io.OutputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.FileNotFoundException;
import java.lang.SecurityException;
import java.util.Scanner;


public class BufferedOutputStreamTest {

    private static final int LEN = 5;
    // 对应英文字母: abcddefghijklmnopqrsttuvwxyz
    private static final byte[] ArrayLetters = {
        0x61, 0x62, 0x63, 0x64, 0x65, 0x66, 0x67, 0x68, 0x69, 0x6A, 0x6B, 0x6C, 0x6D, 0x6E, 0x6F,
        0x70, 0x71, 0x72, 0x73, 0x74, 0x75, 0x76, 0x77, 0x78, 0x79, 0x7A
    };

    public static void main(String[] args) {
        testBufferedOutputStream() ;
    }


    private static void testBufferedOutputStream() {

        // 创建文件输出流对应的BufferedOutputStream
        // 它对应缓冲区的大小是16，即缓冲区的数据>=16时，会自动将缓冲区的内容写入到输出流。
        try {
            File file = new File("out.txt");
            OutputStream out =new BufferedOutputStream(new FileOutputStream(file), 16);

            // 将ArrayLetters数组的前10个字节写入到输出流中
            out.write(ArrayLetters, 0, 10);
            // 将换行符\n写入到输出流中
            out.write('\n');

            // TODO!
            //out.flush();

            readUserInput();

            out.close();
       } catch (FileNotFoundException e) {
           e.printStackTrace();
       } catch (SecurityException e) {
           e.printStackTrace();
       } catch (IOException e) {
           e.printStackTrace();
       }
    }
    
    // 读取用户输入
    private static void readUserInput() {
        System.out.println("please input a text:");
        Scanner reader = new Scanner(System.in);
        // 等待一个输入
        String str = reader.next();
        System.out.printf("the input is : %s\n", str);
        reader.close();
    }
}
```

**运行结果**

生成文件`out.txt`，文件的内容是`abcdefghij`。

**分步测试**： 分别按照下面3种步骤测试程序，来查看缓冲区大小以及`flush()`的作用。

**第1种**：原始程序

1. 运行程序。在程序等待用户输入时，查看`out.txt`的文本内容；发现：内容为空。
2. 运行程序。在用户输入之后，查看`out.txt`的文本内容；发现：内容为`abcdefghij`。
   从中，我们发现1和2的结果不同；之所以1中的`out.txt`内容为空，是因为`out.txt`对应的缓冲区大小是16字节，而我们只写入了11个字节，所以，它不会执行清空缓冲操作(即，将缓冲数据写入到输出流中)。
   而2对应`out.txt`的内容是`abcdefghij`，是因为执行了`out.close()`，它会关闭输出流；在关闭输出流之前，会将缓冲区的数据写入到输出流中。

注意：重新测试时，要先删除`out.txt`。

**第2种**：在`readUserInput()`前添加如下语句

```java
out.flush();
```

这句话的作用，是将缓冲区的内容写入到输出流中。

1. 运行程序。在程序等待用户输入时，查看`out.txt`的文本内容；发现：内容为`abcdefghij`。

2. 运行程序。在用户输入之后，查看`out.txt`的文本内容；发现：内容为`abcdefghij`。
   从中，我们发现1和2结果一样，对应`out.txt`的内容都是`abcdefghij`。这是因为执行了`flush()`操作，它的作用是将缓冲区的数据写入到输出流中。

注意：重新测试时，要先删除`out.txt`！

**第3种**：在第1种的基础上，将

```java
out.write(ArrayLetters, 0, 10);
```

修改为

```java
out.write(ArrayLetters, 0, 20);
```

1. 运行程序。在程序等待用户输入时，查看`out.txt`的文本内容；发现：内容为`abcdefghijklmnopqrst`(不含回车)。
2. 运行程序。在用户输入之后，查看`out.txt`的文本内容；发现：内容为`abcdefghijklmnopqrst`(含回车)。
   从中，我们发现1运行结果是`abcdefghijklmnopqrst`(不含回车)。这是因为，缓冲区的大小是16，而我们通过`out.write(ArrayLetters, 0, 20)`写入了20个字节，超过了缓冲区的大小；这时，会直接将全部的输入都写入都输出流中，而不经过缓冲区。
3. 运行结果是`abcdefghijklmnopqrst`(含回车)，这是因为执行`out.close()`时，将回车符号`\n`写入了输出流中。

注意：重新测试时，要先删除`out.txt`！



# BufferedOutputStream 源码

```java
package java.io;

public class BufferedOutputStream extends FilterOutputStream {
    /**
     * The internal buffer where data is stored.
     */
    protected byte buf[];

    /**
     * The number of valid bytes in the buffer. This value is always
     * in the range {@code 0} through {@code buf.length}; elements
     * {@code buf[0]} through {@code buf[count-1]} contain valid
     * byte data.
     */
    protected int count;

    /**
     * Creates a new buffered output stream to write data to the
     * specified underlying output stream.
     *
     * @param   out   the underlying output stream.
     */
    public BufferedOutputStream(OutputStream out) {
        this(out, 8192);
    }

    /**
     * Creates a new buffered output stream to write data to the
     * specified underlying output stream with the specified buffer
     * size.
     *
     * @param   out    the underlying output stream.
     * @param   size   the buffer size.
     * @exception IllegalArgumentException if size &lt;= 0.
     */
    public BufferedOutputStream(OutputStream out, int size) {
        super(out);
        if (size <= 0) {
            throw new IllegalArgumentException("Buffer size <= 0");
        }
        buf = new byte[size];
    }

    /** Flush the internal buffer */
    private void flushBuffer() throws IOException {
        if (count > 0) {
            out.write(buf, 0, count);
            count = 0;
        }
    }

    /**
     * Writes the specified byte to this buffered output stream.
     *
     * @param      b   the byte to be written.
     * @exception  IOException  if an I/O error occurs.
     */
    @Override
    public synchronized void write(int b) throws IOException {
        if (count >= buf.length) {
            flushBuffer();
        }
        buf[count++] = (byte)b;
    }

    /**
     * Writes <code>len</code> bytes from the specified byte array
     * starting at offset <code>off</code> to this buffered output stream.
     *
     * <p> Ordinarily this method stores bytes from the given array into this
     * stream's buffer, flushing the buffer to the underlying output stream as
     * needed.  If the requested length is at least as large as this stream's
     * buffer, however, then this method will flush the buffer and write the
     * bytes directly to the underlying output stream.  Thus redundant
     * <code>BufferedOutputStream</code>s will not copy data unnecessarily.
     *
     * @param      b     the data.
     * @param      off   the start offset in the data.
     * @param      len   the number of bytes to write.
     * @exception  IOException  if an I/O error occurs.
     */
    @Override
    public synchronized void write(byte b[], int off, int len) throws IOException {
        if (len >= buf.length) {
            /* If the request length exceeds the size of the output buffer,
               flush the output buffer and then write the data directly.
               In this way buffered streams will cascade harmlessly. */
            flushBuffer();
            out.write(b, off, len);
            return;
        }
        if (len > buf.length - count) {
            flushBuffer();
        }
        System.arraycopy(b, off, buf, count, len);
        count += len;
    }

    /**
     * Flushes this buffered output stream. This forces any buffered
     * output bytes to be written out to the underlying output stream.
     *
     * @exception  IOException  if an I/O error occurs.
     * @see        java.io.FilterOutputStream#out
     */
    @Override
    public synchronized void flush() throws IOException {
        flushBuffer();
        out.flush();
    }
}

```

说明： `BufferedOutputStream`通过字节数组来缓冲数据，当缓冲区满或者用户调用`flush()`函数时，它就会将缓冲区的数据写入到输出流中。