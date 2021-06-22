---
title: Java IO之 CharArrayWriter详解
tags: Java-IO
categories: Java
date: 2020-07-18 20:12:28




---

-

<!--more-->

# CharArrayWriter 简介

`CharArrayWriter`用于写入数据符，它继承于`Writer`。操作的数据是以字符为单位！

## CharArrayWriter 函数列表

```java
// 构造函数
public CharArrayWriter()
public CharArrayWriter(int initialSize)
// 常用方法
void             write(int c)
void             write(char c[], int off, int len)
void             write(String str, int off, int len)
void             writeTo(Writer out)
CharArrayWriter  append(CharSequence csq)
CharArrayWriter  append(CharSequence csq, int start, int end)
CharArrayWriter  append(Char c)
void             reset()
char             toCharArray()[]
int              size()
String           toString()
void             flush()
void             close()
```

说明： `CharArrayWriter`实际上是将数据写入到字符数组中去。

- 通过`CharArrayWriter()`创建的`CharArrayWriter`对应的字符数组大小是32。
- 通过`CharArrayWriter(int initialSize)`创建的`CharArrayWriter`对应的字符数组大小是`initialSize`。
- `write(int c)`的作用将`int`类型的`c`换成`char`类型，然后写入到`CharArrayWriter`中。
- `write(char[] c, int off, int len)`是将字符数组`c`写入到输出流中，`off`是从`c`中读取数据的起始偏移位置，`len`是读取的长度。
- `write(String str, int off, int len)`是将字符串`str`写入到输出流中，`off`是从`str`中读取数据的起始位置，`len`是读取的长度。
- `append(char c)`的作用将`char`类型的`c`写入到`CharArrayWriter`中，然后返回`CharArrayWriter`对象。
     注意：`append(char c)`与`write(int c)`都是将单个字符写入到`CharArrayWriter`中。它们的区别是：`append(char c)`会返回`CharArrayWriter`对象，但是`write(int c)`返回`void`。
- `append(CharSequence csq, int start, int end)`的作用将`csq`从`start`开始(包括)到`end`结束(不包括)的数据，写入到`CharArrayWriter`中。
     注意：该函数返回`CharArrayWriter`对象。
- `append(CharSequence csq)`的作用将`csq`写入到`CharArrayWriter`中。
     注意：该函数返回`CharArrayWriter`对象。
- `writeTo(OutputStream out)`将该字符数组输出流的数据全部写入到输出流`out`中。

# 示例

```java
import java.io.CharArrayReader;
import java.io.CharArrayWriter;
import java.io.IOException;



public class CharArrayWriterTest {

    private static final int LEN = 5;
    // 对应英文字母abcdefghijklmnopqrstuvwxyz
    private static final char[] ArrayLetters = new char[] {'a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z'};

    public static void main(String[] args) {

        tesCharArrayWriter() ;
    }


    private static void tesCharArrayWriter() {
        try {
            CharArrayWriter caw = new CharArrayWriter();

            // 写入字符A
            caw.write('A');
            // 写入字符串BC
            caw.write("BC");
            //System.out.printf("caw=%s\n", caw);
            // 将ArrayLetters数组中从3开始的后5个字符(defgh)写入到caw中。
            caw.write(ArrayLetters, 3, 5);
            //System.out.printf("caw=%s\n", caw);

            // 写入字符0
            // 然后接着写入123456789
            // 再接着写入ArrayLetters中第8-12个字符(ijkl)
            caw.append('0').append("123456789").append(String.valueOf(ArrayLetters), 8, 12);

            System.out.printf("caw=%s\n", caw);

            int size = caw.size();
            System.out.printf("size=%s\n", size);

            // 转换成byte[]数组
            char[] buf = caw.toCharArray();
            System.out.printf("buf=%s\n", String.valueOf(buf));

            // 将caw写入到另一个输出流中
            CharArrayWriter caw2 = new CharArrayWriter();
            caw.writeTo(caw2);
            System.out.printf("caw2=%s\n", caw2);
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}
```

运行结果

```
caw=ABCdefgh0123456789ijkl
size=22
buf=ABCdefgh0123456789ijkl
caw2=ABCdefgh0123456789ijkl
```

# CharArrayWriter 源码

## Writer 源码

```java
package java.io;

public abstract class Writer implements Appendable, Closeable, Flushable {


    private char[] writeBuffer;


    private static final int WRITE_BUFFER_SIZE = 1024;

 
    protected Object lock;

   
    protected Writer() {
        this.lock = this;
    }

  
    protected Writer(Object lock) {
        if (lock == null) {
            throw new NullPointerException();
        }
        this.lock = lock;
    }

   
    public void write(int c) throws IOException {
        synchronized (lock) {
            if (writeBuffer == null){
                writeBuffer = new char[WRITE_BUFFER_SIZE];
            }
            writeBuffer[0] = (char) c;
            write(writeBuffer, 0, 1);
        }
    }

   
    public void write(char cbuf[]) throws IOException {
        write(cbuf, 0, cbuf.length);
    }

  
    abstract public void write(char cbuf[], int off, int len) throws IOException;


    public void write(String str) throws IOException {
        write(str, 0, str.length());
    }

    
    public void write(String str, int off, int len) throws IOException {
        synchronized (lock) {
            char cbuf[];
            if (len <= WRITE_BUFFER_SIZE) {
                if (writeBuffer == null) {
                    writeBuffer = new char[WRITE_BUFFER_SIZE];
                }
                cbuf = writeBuffer;
            } else {    // Don't permanently allocate very large buffers.
                cbuf = new char[len];
            }
            str.getChars(off, (off + len), cbuf, 0);
            write(cbuf, 0, len);
        }
    }

    
    public Writer append(CharSequence csq) throws IOException {
        if (csq == null)
            write("null");
        else
            write(csq.toString());
        return this;
    }

    
    public Writer append(CharSequence csq, int start, int end) throws IOException {
        CharSequence cs = (csq == null ? "null" : csq);
        write(cs.subSequence(start, end).toString());
        return this;
    }


    public Writer append(char c) throws IOException {
        write(c);
        return this;
    }


    abstract public void flush() throws IOException;


    abstract public void close() throws IOException;

}

```

## CharArrayWriter 源码

```java
package java.io;

import java.util.Arrays;


public class CharArrayWriter extends Writer {

    protected char buf[];

 
    protected int count;


    public CharArrayWriter() {
        this(32);
    }


    public CharArrayWriter(int initialSize) {
        if (initialSize < 0) {
            throw new IllegalArgumentException("Negative initial size: "
                                               + initialSize);
        }
        buf = new char[initialSize];
    }


    public void write(int c) {
        synchronized (lock) {
            int newcount = count + 1;
            if (newcount > buf.length) {
                buf = Arrays.copyOf(buf, Math.max(buf.length << 1, newcount));
            }
            buf[count] = (char)c;
            count = newcount;
        }
    }


    public void write(char c[], int off, int len) {
        if ((off < 0) || (off > c.length) || (len < 0) ||
            ((off + len) > c.length) || ((off + len) < 0)) {
            throw new IndexOutOfBoundsException();
        } else if (len == 0) {
            return;
        }
        synchronized (lock) {
            int newcount = count + len;
            if (newcount > buf.length) {
                buf = Arrays.copyOf(buf, Math.max(buf.length << 1, newcount));
            }
            System.arraycopy(c, off, buf, count, len);
            count = newcount;
        }
    }


    public void write(String str, int off, int len) {
        synchronized (lock) {
            int newcount = count + len;
            if (newcount > buf.length) {
                buf = Arrays.copyOf(buf, Math.max(buf.length << 1, newcount));
            }
            str.getChars(off, off + len, buf, count);
            count = newcount;
        }
    }


    public void writeTo(Writer out) throws IOException {
        synchronized (lock) {
            out.write(buf, 0, count);
        }
    }


    public CharArrayWriter append(CharSequence csq) {
        String s = (csq == null ? "null" : csq.toString());
        write(s, 0, s.length());
        return this;
    }


    public CharArrayWriter append(CharSequence csq, int start, int end) {
        String s = (csq == null ? "null" : csq).subSequence(start, end).toString();
        write(s, 0, s.length());
        return this;
    }


    public CharArrayWriter append(char c) {
        write(c);
        return this;
    }


    public void reset() {
        count = 0;
    }


    public char toCharArray()[] {
        synchronized (lock) {
            return Arrays.copyOf(buf, count);
        }
    }


    public int size() {
        return count;
    }


    public String toString() {
        synchronized (lock) {
            return new String(buf, 0, count);
        }
    }


    public void flush() { }

    public void close() { }

}
```