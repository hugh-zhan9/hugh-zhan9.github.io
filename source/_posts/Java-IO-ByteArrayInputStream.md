---
title: Java IO之 ByteArrayInputStream详解
tags: Java-IO
categories: Java
date: 2020-07-20 22:22:28



---

-

<!--more-->

# ByteArrayInputStream 介绍

`ByteArrayInputStream`是字节分段输入流。它继承于`InputStream`。

它包含一个内部缓冲区，该缓冲区包含从流中读取的字节；通俗地说，它的内部缓冲区就是一个字节数组，而`ByteArrayInputStream`就是字节通过数组来实现的。
`InputStream`通过`read()`扩展提供接口，供其来读取字节数据；而`ByteArrayInputStream`的内部额外的定义了一个计数器，它被用来跟踪`read()`方法要读取的下一个字节。

InputStream 函数列表

```java
// 构造函数
InputStream()
// 常用方法
              int      available()
             void      close()
             void      mark(int readlimit)
          boolean      markSupported()
              int      read(byte[] buffer)
abstract      int      read()
              int      read(byte[] buffer, int offset, int length)
synchronized void      reset()
	         long      skip(int oneByte)
```



ByteArrayInputStream 函数列表

```java
// 构造方法
ByteArrayInputStream(byte[] buf)
ByteArrayInputStream(byte[] buf, int offset, int length)    

// 常用方法
synchronized  int      available()
             void      close()
synchronized void      mark(int readlimit)
          boolean      markSupported()
synchronized  int      read()
synchronized  int      read(byte[] buffer, int offset, int length)
synchronized void      reset()
synchronized long      skip(int ByteCount)   
```



# 示例代码

```java
import java.io.ByteArrayInputStream;

public class ByteArrayInputStreamTest {

    private static final int LEN = 5;
    // 对应英文字母 abcddefghijklmnopqrsttuvwxyz
    private static final byte[] ArrayLetters = {
        0x61, 0x62, 0x63, 0x64, 0x65, 0x66, 0x67, 0x68, 0x69, 0x6A, 0x6B, 0x6C, 0x6D, 0x6E, 0x6F,
        0x70, 0x71, 0x72, 0x73, 0x74, 0x75, 0x76, 0x77, 0x78, 0x79, 0x7A
    };

    public static void main(String[] args) {
        String tmp = new String(ArrayLetters);
        System.out.println("ArrayLetters="+tmp);

        tesByteArrayInputStream();
    }

    /**
     * ByteArrayInputStream的API测试函数
     */
    private static void tesByteArrayInputStream() {
        // 创建ByteArrayInputStream字节流，内容是ArrayLetters数组
        ByteArrayInputStream bais = new ByteArrayInputStream(ArrayLetters);

        // 从字节流中读取5个字节
        for (int i=0; i<LEN; i++) {
            // 若能继续读取下一个字节，则读取下一个字节
            if (bais.available() >= 0) {
                // 读取字节流的下一个字节
                int tmp = bais.read();
                System.out.printf("%d : 0x%s\n", i, Integer.toHexString(tmp));
            }
        }

        // 若该字节流不支持标记功能，则直接退出
        if (!bais.markSupported()) {
            System.out.println("make not supported!");
            return ;
        }

        // 标记字节流中下一个被读取的位置。即--标记0x66，因为因为前面已经读取了5个字节，所以下一个被读取的位置是第6个字节
        // ByteArrayInputStream类的mark(0)函数中的参数0是没有实际意义的。
        // mark()与reset()是配套的，reset()会将字节流中下一个被读取的位置重置为mark()中所保存的位置
        bais.mark(0);

        // 跳过5个字节。跳过5个字节后，字节流中下一个被读取的值应该是0x6B
        bais.skip(5);

        // 从字节流中读取5个数据。即读取0x6B, 0x6C, 0x6D, 0x6E, 0x6F
        byte[] buf = new byte[LEN];
        bais.read(buf, 0, LEN);
        // 将buf转换为String字符串。0x6B, 0x6C, 0x6D, 0x6E, 0x6F对应字符是klmno
        String str1 = new String(buf);
        System.out.printf("str1=%s\n", str1);

        // 重置字节流：即，将字节流中下一个被读取的位置重置到mark()所标记的位置，即0x66。
        bais.reset();
        // 从重置后的字节流中读取5个字节到buf中。即读取0x66, 0x67, 0x68, 0x69, 0x6A
        bais.read(buf, 0, LEN);
        // 将buf转换为String字符串。0x66, 0x67, 0x68, 0x69, 0x6A对应字符是fghij
        String str2 = new String(buf);
        System.out.printf("str2=%s\n", str2);
    }
}
```

运行结果：

```
ArrayLetters=abcdefghijklmnopqrstuvwxyz
0 : 0x61
1 : 0x62
2 : 0x63
3 : 0x64
4 : 0x65
str1=klmno
str2=fghij
```

结果说明：

- `ArrayLetters`是字节数组。0x61对应的ASCII码值是a，0x62对应的ASCII码值是b，依次类推...
- `ByteArrayInputStream bais = new ByteArrayInputStream(ArrayLetters)`，这句话是创建字节流`bais`，它的内容就是`ArrayLetters`。
- `for (int i=0; i<LEN; i++)`这个`for`循环的作用就是从字节流中读取5个字节。每次调用`bais.read()`就从字节流中读取一个字节。
- `bais.mark(0)`，这句话就是设置字节流的标记，此时标记的位置对应的值是0x66
- `bais.skip(5)`，这句话是跳过5个字节。跳过5个字节后，对应的字节流中下一个被读取的字节的值是0x6B。
- `bais.read(buf, 0, LEN)`，这句话是从字节流中读取`LEN`个数据写入到`buf`中，0表示从`buf`的第0个位置开始写入。
- `bais.reset()`，这句话是将字节流中下一个被读取的位置重置到`mark()`所标记的位置，即0x66。

# InputStream 源码分析

```java
package java.io;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Objects;

public abstract class InputStream implements Closeable {


    // 能skip的最大缓冲区大小
    private static final int MAX_SKIP_BUFFER_SIZE = 2048;
	// 默认缓冲区大小
    private static final int DEFAULT_BUFFER_SIZE = 8192;

    // 从输入流中读取数据的下一个字节
    public abstract int read() throws IOException;

    // 将数据从输入流读取至byte数组
    public int read(byte b[]) throws IOException {
        return read(b, 0, b.length);
    }

    // 将最多len个数据字节从此输入流读入byte数组
    public int read(byte b[], int off, int len) throws IOException {
        Objects.checkFromIndexSize(off, len, b.length);
        if (len == 0) {
            return 0;
        }

        int c = read();
        if (c == -1) {
            return -1;
        }
        b[off] = (byte)c;

        int i = 1;
        try {
            for (; i < len ; i++) {
                c = read();
                if (c == -1) {
                    break;
                }
                b[off + i] = (byte)c;
            }
        } catch (IOException ee) {
        }
        return i;
    }
    // 跳过输入流中的n个字节
    public long skip(long n) throws IOException {

        long remaining = n;
        int nr;

        if (n <= 0) {
            return 0;
        }

        int size = (int)Math.min(MAX_SKIP_BUFFER_SIZE, remaining);
        byte[] skipBuffer = new byte[size];
        while (remaining > 0) {
            nr = read(skipBuffer, 0, (int)Math.min(size, remaining));
            if (nr < 0) {
                break;
            }
            remaining -= nr;
        }

        return n - remaining;
    }

    
    public int available() throws IOException {
        return 0;
    }

   
    public void close() throws IOException {}

    
    public synchronized void mark(int readlimit) {}

   
    public synchronized void reset() throws IOException {
        throw new IOException("mark/reset not supported");
    }

    
    public boolean markSupported() {
        return false;
    }
}

```

# ByteArrayInputStream 源码分析

```java
package java.io;

import java.util.Arrays;
import java.util.Objects;


public class ByteArrayInputStream extends InputStream {
	// 保存字节输入流数据的字节数组
    protected byte buf[];
    // 下一个会被读取的字节的索引
    protected int pos;
    // 标记的索引
    protected int mark = 0;
    // 字节流的长度
    protected int count;
    
    // 构造函数：创建一个内容为buf的字节流
    public ByteArrayInputStream(byte buf[]) {
        this.buf = buf;
        this.pos = 0;
        this.count = buf.length;
    }

	// 构造函数：创建一个内容为buf的字节流，并且是从offset位置开始读取数据，读取的长度为length
    public ByteArrayInputStream(byte buf[], int offset, int length) {
        this.buf = buf;
        this.pos = offset;
        this.count = Math.min(offset + length, buf.length);
        this.mark = offset;
    }
    
    // 读取下一个字节
    public synchronized int read() {
        return (pos < count) ? (buf[pos++] & 0xff) : -1;
    }

	// 将字节流的数据写入到字节数组b中
    // off是字节数组b的偏移量，表示从数组b的off位置开始写入数据
    // len是写入的字节长度
    public synchronized int read(byte b[], int off, int len) {
        Objects.checkFromIndexSize(off, len, b.length);

        if (pos >= count) {
            return -1;
        }

        int avail = count - pos;
        if (len > avail) {
            len = avail;
        }
        if (len <= 0) {
            return 0;
        }
        System.arraycopy(buf, pos, b, off, len);
        pos += len;
        return len;
    }

    // 跳过字节流中的n个字节
    public synchronized long skip(long n) {
        long k = count - pos;
        if (n < k) {
            k = n < 0 ? 0 : n;
        }

        pos += k;
        return k;
    }

	// 是否能读取字节流的下一个字节
    public synchronized int available() {
        return count - pos;
    }

    // 是否支持标签
    public boolean markSupported() {
        return true;
    }

    // 保存当前位置，readAheadLimit在此没有任何实际意义
    public void mark(int readAheadLimit) {
        mark = pos;
    }

	// 重置字节流的读取所有为mark标记的位置
    public synchronized void reset() {
        pos = mark;
    }

    public void close() throws IOException {
    }
}
```

说明：

ByteArrayInputStream实际上是通过字节数组去保存数据。

- 通过`ArrayInputStream(byte buf[])`或`ByteArrayInputStream(byte buf[], int offset, int length)`我们可以根据`buf`数组来创建字节流对象。
- `read()`的作用是：从字节流中读取下一个字节。
- `read(byte[] buffer, int offset, int length)`的作用是从字节流读取字节数据，并写入到字节数组`bufffer`中。`offset`是将字节写入到`buffer`的起始位置，`length`是写入的字节的长度。
- `markSupported()`是判断字节流是否支持标记功能，它一直返回`true`。
- `mark(int readlimit)`的作用是记录标记位置。记录标记位置之后，某一时刻调用`reset()`则将字节流下一个被读取的位置重置到`mark(int readlimit)`所标记的位置。也就是说，`reset()`之后再读取字节流时，是从`mark(int readlimit)`所标记的位置开始读取的。

