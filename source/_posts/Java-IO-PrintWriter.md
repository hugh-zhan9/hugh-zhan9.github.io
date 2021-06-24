---
title: Java IO之 PrintWriter详解
tags: Java-IO
categories: Java
date: 2020-07-24 20:26:28




---

-

<!--more-->

# PrinterWriter 简介

`PrintWriter`是字符类型的打印输出流，它继承于`Writer`。

`PrintWriter`用于向文本输出流打印对象的格式化表示形式。它实现了`PrintStream`中所有的`print`方法。它不包含用于写入原始字节的方法，对于这些字节，程序应该使用未编码的字节流进行写入。

## PrintWriter 函数列表

```java
// 构造函数
public PrintWriter(Writer out)
public PrintWriter(Writer out, boolean autoFlush)
public PrintWriter(OutputStream out)
public PrintWriter(OutputStream out, boolean autoFlush)
public PrintWriter(String fileName)
public PrintWriter(String fileName, String csn)    //采用csn字符集
public PrintWriter(File file)
public PrintWriter(File file, String csn)
// 常用方法
void         flush()
void         close()
boolean      checkError()
void         write(int c)
void         write(char buf[], int off, int len)
void         write(char buf[])
void         write(String s, int off, int len)
void         write(String s)
void         print(boolean b)
void         print(char c)
void         print(int i)
void         print(long l)
void         print(float f)
void         print(double d)
void         print(char s[])
void         print(String s)
void         print(Object obj)
void         println()
void         println(boolean x)
void         println(char x)
void         println(int x)
void         println(long x)
void         println(float x)
void         println(double x)
void         println(char x[])
void         println(String x)
void         println(Object x)
PrintWriter  printf(String format, Object ... args)
PrintWriter  printf(Locale l, String format, Object ... args)
PrintWriter  format(String format, Object ... args)
PrintWriter  format(Locale l, String format, Object ... args)
PrintWriter  append(CharSequence csq)
PrintWriter  append(CharSequence csq, int start, int end)
PrintWriter  append(char c)
```

# 示例

```java
import java.io.PrintWriter;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;


public class PrintWriterTest {

    public static void main(String[] args) {

        testPrintWriterConstrutor1() ;
        //testPrintWriterConstrutor2() ;
        //testPrintWriterConstrutor3() ;

        // 测试write(), print(), println(), printf()等接口。
        testPrintWriterAPIS() ;
    }


    private static void testPrintWriterConstrutor1() {
        final char[] arr={'a', 'b', 'c', 'd', 'e' };
        try {
            File file = new File("file.txt");
            PrintWriter out = new PrintWriter(new FileOutputStream(file));
            out.write(arr);
            out.close();
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    private static void testPrintWriterConstrutor2() {
        final char[] arr={'a', 'b', 'c', 'd', 'e' };
        try {
            File file = new File("file.txt");
            PrintWriter out = new PrintWriter(file);
            out.write(arr);
            out.close();
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    private static void testPrintWriterConstrutor3() {
        final char[] arr={'a', 'b', 'c', 'd', 'e' };
        try {
            PrintWriter out = new PrintWriter("file.txt");
            out.write(arr);
            out.close();
        } catch (IOException e) {
            e.printStackTrace();
        }
    }


    private static void testPrintWriterAPIS() {
        final char[] arr={'a', 'b', 'c', 'd', 'e' };
        try {

            PrintWriter out = new PrintWriter("other.txt");

            out.println("hello PrintWriter");
            out.write(0x41);
            // 输出65
            // out.print(0x41); 等价于 out.write(String.valueOf(0x41));
            out.print(0x41);
            // 将字符'B'追加到输出流中
            out.append('B').append("CDEF");

            // 将"CDE is 5" + 回车  写入到输出流中
            String str = "GHI";
            int num = 5;
            out.printf("%s is %d\n", str, num);
            out.close();
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}
```

# PrintWriter 源码

```java
package java.io;

import java.util.Objects;
import java.util.Formatter;
import java.util.Locale;
import java.nio.charset.Charset;
import java.nio.charset.IllegalCharsetNameException;
import java.nio.charset.UnsupportedCharsetException;



public class PrintWriter extends Writer {


    protected Writer out;

    private final boolean autoFlush;
    private boolean trouble = false;
    private Formatter formatter;
    private PrintStream psOut = null;

 
    private final String lineSeparator;


    private static Charset toCharset(String csn)
        throws UnsupportedEncodingException
    {
        Objects.requireNonNull(csn, "charsetName");
        try {
            return Charset.forName(csn);
        } catch (IllegalCharsetNameException|UnsupportedCharsetException unused) {
            // UnsupportedEncodingException should be thrown
            throw new UnsupportedEncodingException(csn);
        }
    }

 
    public PrintWriter (Writer out) {
        this(out, false);
    }


    public PrintWriter(Writer out,
                       boolean autoFlush) {
        super(out);
        this.out = out;
        this.autoFlush = autoFlush;
        lineSeparator = java.security.AccessController.doPrivileged(
            new sun.security.action.GetPropertyAction("line.separator"));
    }


    public PrintWriter(OutputStream out) {
        this(out, false);
    }


    public PrintWriter(OutputStream out, boolean autoFlush) {
        this(new BufferedWriter(new OutputStreamWriter(out)), autoFlush);

        // save print stream for error propagation
        if (out instanceof java.io.PrintStream) {
            psOut = (PrintStream) out;
        }
    }

    
    public PrintWriter(String fileName) throws FileNotFoundException {
        this(new BufferedWriter(new OutputStreamWriter(new FileOutputStream(fileName))),
             false);
    }

    /* Private constructor */
    private PrintWriter(Charset charset, File file)
        throws FileNotFoundException
    {
        this(new BufferedWriter(new OutputStreamWriter(new FileOutputStream(file), charset)),
             false);
    }

  
    public PrintWriter(String fileName, String csn)
        throws FileNotFoundException, UnsupportedEncodingException
    {
        this(toCharset(csn), new File(fileName));
    }


    public PrintWriter(File file) throws FileNotFoundException {
        this(new BufferedWriter(new OutputStreamWriter(new FileOutputStream(file))),
             false);
    }


    public PrintWriter(File file, String csn)
        throws FileNotFoundException, UnsupportedEncodingException
    {
        this(toCharset(csn), file);
    }

    /** Checks to make sure that the stream has not been closed */
    private void ensureOpen() throws IOException {
        if (out == null)
            throw new IOException("Stream closed");
    }


    public void flush() {
        try {
            synchronized (lock) {
                ensureOpen();
                out.flush();
            }
        }
        catch (IOException x) {
            trouble = true;
        }
    }


    public void close() {
        try {
            synchronized (lock) {
                if (out == null)
                    return;
                out.close();
                out = null;
            }
        }
        catch (IOException x) {
            trouble = true;
        }
    }


    public boolean checkError() {
        if (out != null) {
            flush();
        }
        if (out instanceof java.io.PrintWriter) {
            PrintWriter pw = (PrintWriter) out;
            return pw.checkError();
        } else if (psOut != null) {
            return psOut.checkError();
        }
        return trouble;
    }


    protected void setError() {
        trouble = true;
    }


    protected void clearError() {
        trouble = false;
    }


    public void write(int c) {
        try {
            synchronized (lock) {
                ensureOpen();
                out.write(c);
            }
        }
        catch (InterruptedIOException x) {
            Thread.currentThread().interrupt();
        }
        catch (IOException x) {
            trouble = true;
        }
    }


    public void write(char buf[], int off, int len) {
        try {
            synchronized (lock) {
                ensureOpen();
                out.write(buf, off, len);
            }
        }
        catch (InterruptedIOException x) {
            Thread.currentThread().interrupt();
        }
        catch (IOException x) {
            trouble = true;
        }
    }

    public void write(char buf[]) {
        write(buf, 0, buf.length);
    }


    public void write(String s, int off, int len) {
        try {
            synchronized (lock) {
                ensureOpen();
                out.write(s, off, len);
            }
        }
        catch (InterruptedIOException x) {
            Thread.currentThread().interrupt();
        }
        catch (IOException x) {
            trouble = true;
        }
    }


    public void write(String s) {
        write(s, 0, s.length());
    }

    private void newLine() {
        try {
            synchronized (lock) {
                ensureOpen();
                out.write(lineSeparator);
                if (autoFlush)
                    out.flush();
            }
        }
        catch (InterruptedIOException x) {
            Thread.currentThread().interrupt();
        }
        catch (IOException x) {
            trouble = true;
        }
    }


    public void print(boolean b) {
        write(b ? "true" : "false");
    }


    public void print(char c) {
        write(c);
    }


    public void print(int i) {
        write(String.valueOf(i));
    }


    public void print(long l) {
        write(String.valueOf(l));
    }


    public void print(float f) {
        write(String.valueOf(f));
    }


    public void print(double d) {
        write(String.valueOf(d));
    }


    public void print(char s[]) {
        write(s);
    }


    public void print(String s) {
        if (s == null) {
            s = "null";
        }
        write(s);
    }


    public void print(Object obj) {
        write(String.valueOf(obj));
    }


    public void println() {
        newLine();
    }


    public void println(boolean x) {
        synchronized (lock) {
            print(x);
            println();
        }
    }


    public void println(char x) {
        synchronized (lock) {
            print(x);
            println();
        }
    }


    public void println(int x) {
        synchronized (lock) {
            print(x);
            println();
        }
    }


    public void println(long x) {
        synchronized (lock) {
            print(x);
            println();
        }
    }


    public void println(float x) {
        synchronized (lock) {
            print(x);
            println();
        }
    }


    public void println(double x) {
        synchronized (lock) {
            print(x);
            println();
        }
    }


    public void println(char x[]) {
        synchronized (lock) {
            print(x);
            println();
        }
    }


    public void println(String x) {
        synchronized (lock) {
            print(x);
            println();
        }
    }


    public void println(Object x) {
        String s = String.valueOf(x);
        synchronized (lock) {
            print(s);
            println();
        }
    }


    public PrintWriter printf(String format, Object ... args) {
        return format(format, args);
    }

  
    public PrintWriter printf(Locale l, String format, Object ... args) {
        return format(l, format, args);
    }

  
    public PrintWriter format(String format, Object ... args) {
        try {
            synchronized (lock) {
                ensureOpen();
                if ((formatter == null)
                    || (formatter.locale() != Locale.getDefault()))
                    formatter = new Formatter(this);
                formatter.format(Locale.getDefault(), format, args);
                if (autoFlush)
                    out.flush();
            }
        } catch (InterruptedIOException x) {
            Thread.currentThread().interrupt();
        } catch (IOException x) {
            trouble = true;
        }
        return this;
    }


    public PrintWriter format(Locale l, String format, Object ... args) {
        try {
            synchronized (lock) {
                ensureOpen();
                if ((formatter == null) || (formatter.locale() != l))
                    formatter = new Formatter(this, l);
                formatter.format(l, format, args);
                if (autoFlush)
                    out.flush();
            }
        } catch (InterruptedIOException x) {
            Thread.currentThread().interrupt();
        } catch (IOException x) {
            trouble = true;
        }
        return this;
    }


    public PrintWriter append(CharSequence csq) {
        if (csq == null)
            write("null");
        else
            write(csq.toString());
        return this;
    }


    public PrintWriter append(CharSequence csq, int start, int end) {
        CharSequence cs = (csq == null ? "null" : csq);
        write(cs.subSequence(start, end).toString());
        return this;
    }

   
    public PrintWriter append(char c) {
        write(c);
        return this;
    }
}
```

