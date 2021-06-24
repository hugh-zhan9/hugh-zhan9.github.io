---
title: Java IO之 BufferedWriter详解
tags: Java-IO
categories: Java
date: 2020-07-22 21:46:28



---

-

<!--more-->

# BufferedWriter 简介

`BufferedWriter`是缓冲字符输出流。它继承于`Writer`。

`BufferedWriter`的作用是为其他字符输出流添加一些缓冲功能。

## BufferedWriter 函数列表

```java
// 构造方法
public BufferedWriter(Writer out) 
public BufferedWriter(Writer out, int sz)
// 常用方法
void 	write(int c)
void 	write(char cbuf[], int off, int len)
void 	write(String s, int off, int len)
void 	newLine()
void 	flush()
void 	close()
```



# 示例

```java
import java.io.BufferedWriter;
import java.io.File;
import java.io.OutputStream;
import java.io.FileWriter;
import java.io.IOException;
import java.io.FileNotFoundException;
import java.lang.SecurityException;
import java.util.Scanner;


public class BufferedWriterTest {

    private static final int LEN = 5;
    private static final char[] ArrayLetters = new char[] {'a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z'};

    public static void main(String[] args) {
        testBufferedWriter() ;
    }


    private static void testBufferedWriter() {

        // 创建文件输出流对应的BufferedWriter
        // 它对应缓冲区的大小是16，即缓冲区的数据 >= 16时，会自动将缓冲区的内容写入到输出流。
        try {
            File file = new File("bufferwriter.txt");
            BufferedWriter out =
                  new BufferedWriter(
                      new FileWriter(file));

            // 将ArrayLetters数组的前10个字符写入到输出流中
            out.write(ArrayLetters, 0, 10);
            // 将换行符写入到输出流中
            out.write('\n');

            out.flush();
            //readUserInput() ;

            out.close();
       } catch (FileNotFoundException e) {
           e.printStackTrace();
       } catch (SecurityException e) {
           e.printStackTrace();
       } catch (IOException e) {
           e.printStackTrace();
       }
    }

    private static void readUserInput() {
        System.out.println("please input a text:");
        Scanner reader=new Scanner(System.in);
        String str = reader.next();
        System.out.printf("the input is : %s\n", str);
    }
}
```





# BufferedWriter 源码

```java
package java.io;

public class BufferedWriter extends Writer {

    private Writer out;

    private char cb[];
    private int nChars, nextChar;

    private static int defaultCharBufferSize = 8192;

    
    private String lineSeparator;

    
    public BufferedWriter(Writer out) {
        this(out, defaultCharBufferSize);
    }

    
    public BufferedWriter(Writer out, int sz) {
        super(out);
        if (sz <= 0)
            throw new IllegalArgumentException("Buffer size <= 0");
        this.out = out;
        cb = new char[sz];
        nChars = sz;
        nextChar = 0;

        lineSeparator = java.security.AccessController.doPrivileged(
            new sun.security.action.GetPropertyAction("line.separator"));
    }

    /** Checks to make sure that the stream has not been closed */
    private void ensureOpen() throws IOException {
        if (out == null)
            throw new IOException("Stream closed");
    }

   
    void flushBuffer() throws IOException {
        synchronized (lock) {
            ensureOpen();
            if (nextChar == 0)
                return;
            out.write(cb, 0, nextChar);
            nextChar = 0;
        }
    }

    
    public void write(int c) throws IOException {
        synchronized (lock) {
            ensureOpen();
            if (nextChar >= nChars)
                flushBuffer();
            cb[nextChar++] = (char) c;
        }
    }

  
    private int min(int a, int b) {
        if (a < b) return a;
        return b;
    }

    
    public void write(char cbuf[], int off, int len) throws IOException {
        synchronized (lock) {
            ensureOpen();
            if ((off < 0) || (off > cbuf.length) || (len < 0) ||
                ((off + len) > cbuf.length) || ((off + len) < 0)) {
                throw new IndexOutOfBoundsException();
            } else if (len == 0) {
                return;
            }

            if (len >= nChars) {     
                flushBuffer();
                out.write(cbuf, off, len);
                return;
            }

            int b = off, t = off + len;
            while (b < t) {
                int d = min(nChars - nextChar, t - b);
                System.arraycopy(cbuf, b, cb, nextChar, d);
                b += d;
                nextChar += d;
                if (nextChar >= nChars)
                    flushBuffer();
            }
        }
    }


    public void write(String s, int off, int len) throws IOException {
        synchronized (lock) {
            ensureOpen();

            int b = off, t = off + len;
            while (b < t) {
                int d = min(nChars - nextChar, t - b);
                s.getChars(b, b + d, cb, nextChar);
                b += d;
                nextChar += d;
                if (nextChar >= nChars)
                    flushBuffer();
            }
        }
    }


    public void newLine() throws IOException {
        write(lineSeparator);
    }


    public void flush() throws IOException {
        synchronized (lock) {
            flushBuffer();
            out.flush();
        }
    }

    @SuppressWarnings("try")
    public void close() throws IOException {
        synchronized (lock) {
            if (out == null) {
                return;
            }
            try (Writer w = out) {
                flushBuffer();
            } finally {
                out = null;
                cb = null;
            }
        }
    }
}
```

