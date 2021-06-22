---
title: Java IO之 PrintStream详解
tags: Java-IO
categories: Java
date: 2020-07-23 22:22:28



---

-

<!--more-->

# PrintStream 简介

`PrintStream`是打印输出流，继承于`FilterOutputStream`。

`PrintStream`是用来装饰其他输出流的。它能为其他输出流添加功能，使其能够方便地打印出各种数据值表示形式。与`PrintStream`不同的是：`PrintStream`永远不会抛出`IOException`。它产生的`IOException`会被自身的函数所捕获并设置错误标记，用户可以通过`checkError()`返回错误标记，从而查看`PrintStream`内部是否产生了`IOException`。另外，`PrintStream`提供了自动刷新和字符集设置功能。

PrintStream 函数列表

```java
// 构造方法
PrintStream(OutputStream out)
PrintStream(OutputStream out, boolean autoFlash)
PrintStream(OutputStream out, boolean autoFlash, string encoding)
PrintStream(String fileName)
	// 创建fileName对应的FileOutputStream，然后将该FileOutputStream作为PrintStream的输出流，采用csn字符集。
PrintStream(String fileName, String csn)
PrintStream(File file)
PrintStream(File file, String csn)

// 常用方法
void flush()
void close()
void checkError()
void setError()
void clearError()
void write(int b)
void write(byte buf[], int off, int len)
void print(boolean b)
void print(char c)
void print(int i)
void print(long l)
void print(float f)
void print(double d)
void print(char s[])
void print(String s)
void print(Object obj)
void println()
void print(boolean x)
void print(char x)
void print(int x)
void print(long x)
void print(float x)
void print(double x)
void print(char x)
void print(String x)
void print(Object x)
    // 将数据args根据默认Locale值按照format格式化，并写入到PrintStream输出流中
PrintStream printf(String format, Object...args)
    // 将数据args根据Locale值(区域属性)按照format格式化，并写入到PrintStream输出流中
PrintStream printf(Locale l, String format, Object...args)
    // 根据默认的Locale值(区域属性)来格式化数据
PrintStream format(Locale l, String format, Object...args)
    // 根据Locale值(区域属性)来格式化数据
PrintStream format(String format, Object...args)
    // 将字符序列追加到PrintStream输出流中
PrintStream append(CharSequence csq)
    // 将字符序列从start(包括)到end(不包括)的全部字符追加到PrintStream输出流中
PrintStream append(CharSequence csq, int start, int end)
    // 将字符c追加到PrintStream输出流中
PrintStream append(char c)
```

> 注意：
>
> `print())`和`println()`都是将其中参数转换成字符串之后，再写入到输入流。

例如：

```java
print(0x61);
```

等价于

```java
write(String.valueOf(0x61));
```

上面语句是将字符串`97`写入到输出流。`0x61`对应十进制数是`97`。

```java
write(0x61)
```

上面语句是将字符`a`写入到输出流。因为`0x61`对应的ASCII码的字母`a`。

# PrintStream 和 DataOutputStream 异同点

## 相同点

都是继承于`FileOutputStream`，用于包装其它输出流。

## 不同点

1. 目的不同

   `DataOutputStream`的作用时用来装饰其它的输出流，它和`DataInputStream`配合使用，允许应用程序以与机器无关的方式从底层输入流中读取Java数据类型。

   `PrintStream`的作用虽然也是装饰其他的输出流，但是它的目的不是以与机器无关的方式从底层输入流中读取Java数据类型，而是为其他输出流提供打印各种数据值表示形式，使其它输出流能方便地通过`print()`、`println()`或`printf()`等输出各种格式的数据。

2. 构造函数不同

   `DataOutputStream`的构造函数只有一个：`DataOutputStream(OutputStream out)`。即：它只支持以输出流`out`作为`DataOutputStream`的输出流。

   `PrintStream`的构造函数有很多，和`DataOutputStream`一样，支持以输出流`out`作为`PrintStream`输出流的构造函数，还支持以`File`对象或者`Stirng`类型的文件名对象的构造函数。

   而且在`PrintStream`的构造函数中，能指定字符集和是否支持自动刷新操作。

3. 输出字符串时的编码不同

   `DataOutputStream`和`PrintStream`都可以将数据格式化输出。

   `PrintStream`是输出时采用的用户指定的编码(创建`PrintStream`时指定)，若没有指定，则采用系统默认的字符编码。而`DataOutputStream`则采用的是`UTF-8`。

4. 异常处理机制不同

   `DataOutputStream`在通过`write()`向输出流中写入数据时，若产生`IOException`，会抛出。

   `PrintStream`在通过`writr()`向输出流中写入数据时，若产生`IOException`，则会在`write()`中进行捕获处理；并设置`trouble`标记(用于表示产生了异常)为`true`。用户可以通过`checkError()`返回`trouble`值，从而检查输出流中是否产生了异常。

# 示例

```java
import java.io.PrintStream;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;


public class PrintStreamTest {

    public static void main(String[] args) {

        // 下面3个函数的作用都是一样：都是将字母abcde写入到文件file.txt中。
        // 任选一个执行即可！
        testPrintStreamConstrutor1() ;
        //testPrintStreamConstrutor2() ;
        //testPrintStreamConstrutor3() ;

        // 测试write(), print(), println(), printf()等接口。
        testPrintStreamAPIS() ;
    }

    /**
     * PrintStream(OutputStream out) 的测试函数
     * 函数的作用，就是将字母abcde写入到文件file.txt中
     */
    private static void testPrintStreamConstrutor1() {
        final byte[] arr={0x61, 0x62, 0x63, 0x64, 0x65 }; // abced
        try {
            File file = new File("file.txt");
            PrintStream out = new PrintStream(new FileOutputStream(file));
            out.write(arr);
            out.close();
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    /**
     * PrintStream(File file) 的测试函数
     * 函数的作用，就是将字母abcde写入到文件file.txt中
     */
    private static void testPrintStreamConstrutor2() {
        final byte[] arr={0x61, 0x62, 0x63, 0x64, 0x65 };
        try {
            File file = new File("file.txt");
            PrintStream out = new PrintStream(file);
            out.write(arr);
            out.close();
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    /**
     * PrintStream(String fileName) 的测试函数
     * 函数的作用，就是将字母abcde写入到文件file.txt”中
     */
    private static void testPrintStreamConstrutor3() {
        final byte[] arr={0x61, 0x62, 0x63, 0x64, 0x65 };
        try {
            PrintStream out = new PrintStream("file.txt");
            out.write(arr);
            out.close();
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    /**
     * 测试write(), print(), println(), printf()等接口。
     */
    private static void testPrintStreamAPIS() {
        final byte[] arr={0x61, 0x62, 0x63, 0x64, 0x65 }; // abced
        try {
            PrintStream out = new PrintStream("other.txt");
            out.println("hello PrintStream");
            out.write(0x41);  // A
            // out.print(0x41); 等价于 out.write(String.valueOf(0x41));
            out.print(0x41);
            out.append('B');
            // 将"CDE is 5" + 回车  写入到输出流中
            String str = "CDE";
            int num = 5;
            out.printf("%s is %d\n", str, num);

            out.close();
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}
```

运行上面的代码，会在源码所在目录生成两个文件`file.txt`和`other.txt`。

`file.txt`的内容如下：

```
abcde
```

`other.txt`的内容如下：

```
hello PrintStream
A65BCDE is 5
```

# System.out.println 详解

我们初学的第一个程序就是输出一个`Hello World`。那么它是如何实现的呢？

先看看`System.java`中`out`的定义，源码如下：

```java
public final class System {
    ...
    public final static PrintStream out = null;
    ...
}
```

从中可以看到：`out`是`System`的静态变量，所以可以通过`System.out`来进行调用，而`System.out`返回类型为`PrintStrem`类型。

那么可以定义如下代码：

```java
PrintStream ps = System.out;
ps.println("Hello World");
// 等价于
System.out.println("Hello World");
```

所以实际上`System.out.println()`是调用了`PrintStream`对象的`println`方法进行输出。



# PrintStream 源码

```java
import java.util.Formatter;
import java.util.Locale;
import java.nio.charset.Charset;
import java.nio.charset.IllegalCharsetNameException;
import java.nio.charset.UnsupportedCharsetException;


public class PrintStream extends FilterOutputStream
    implements Appendable, Closeable
{

    private final boolean autoFlush;
    private boolean trouble = false;
    private Formatter formatter;

   
    private BufferedWriter textOut;
    private OutputStreamWriter charOut;

 
    private static <T> T requireNonNull(T obj, String message) {
        if (obj == null)
            throw new NullPointerException(message);
        return obj;
    }

    
    private static Charset toCharset(String csn)
        throws UnsupportedEncodingException
    {
        requireNonNull(csn, "charsetName");
        try {
            return Charset.forName(csn);
        } catch (IllegalCharsetNameException|UnsupportedCharsetException unused) {
            
            throw new UnsupportedEncodingException(csn);
        }
    }

    
    private PrintStream(boolean autoFlush, OutputStream out) {
        super(out);
        this.autoFlush = autoFlush;
        this.charOut = new OutputStreamWriter(this);
        this.textOut = new BufferedWriter(charOut);
    }

    private PrintStream(boolean autoFlush, OutputStream out, Charset charset) {
        super(out);
        this.autoFlush = autoFlush;
        this.charOut = new OutputStreamWriter(this, charset);
        this.textOut = new BufferedWriter(charOut);
    }

    
    private PrintStream(boolean autoFlush, Charset charset, OutputStream out)
        throws UnsupportedEncodingException
    {
        this(autoFlush, out, charset);
    }

    
    public PrintStream(OutputStream out) {
        this(out, false);
    }

   
    public PrintStream(OutputStream out, boolean autoFlush) {
        this(autoFlush, requireNonNull(out, "Null output stream"));
    }

   
    public PrintStream(OutputStream out, boolean autoFlush, String encoding)
        throws UnsupportedEncodingException
    {
        this(autoFlush,
             requireNonNull(out, "Null output stream"),
             toCharset(encoding));
    }

    
    public PrintStream(String fileName) throws FileNotFoundException {
        this(false, new FileOutputStream(fileName));
    }

    
    public PrintStream(String fileName, String csn)
        throws FileNotFoundException, UnsupportedEncodingException
    {
        this(false, toCharset(csn), new FileOutputStream(fileName));
    }

    
    public PrintStream(File file) throws FileNotFoundException {
        this(false, new FileOutputStream(file));
    }

 
    public PrintStream(File file, String csn)
        throws FileNotFoundException, UnsupportedEncodingException
    {
        
        this(false, toCharset(csn), new FileOutputStream(file));
    }

    
    private void ensureOpen() throws IOException {
        if (out == null)
            throw new IOException("Stream closed");
    }

 
    
    public void flush() {
        synchronized (this) {
            try {
                ensureOpen();
                out.flush();
            }
            catch (IOException x) {
                trouble = true;
            }
        }
    }

    private boolean closing = false; 

    
    public void close() {
        synchronized (this) {
            if (! closing) {
                closing = true;
                try {
                    textOut.close();
                    out.close();
                }
                catch (IOException x) {
                    trouble = true;
                }
                textOut = null;
                charOut = null;
                out = null;
            }
        }
    }

    
    public boolean checkError() {
        if (out != null)
            flush();
        if (out instanceof java.io.PrintStream) {
            PrintStream ps = (PrintStream) out;
            return ps.checkError();
        }
        return trouble;
    }

    
    protected void setError() {
        trouble = true;
    }

   
    protected void clearError() {
        trouble = false;
    }

    
    public void write(int b) {
        try {
            synchronized (this) {
                ensureOpen();
                out.write(b);
                if ((b == '\n') && autoFlush)
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

    
    public void write(byte buf[], int off, int len) {
        try {
            synchronized (this) {
                ensureOpen();
                out.write(buf, off, len);
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
    

    private void write(char buf[]) {
        try {
            synchronized (this) {
                ensureOpen();
                textOut.write(buf);
                textOut.flushBuffer();
                charOut.flushBuffer();
                if (autoFlush) {
                    for (int i = 0; i < buf.length; i++)
                        if (buf[i] == '\n')
                            out.flush();
                }
            }
        }
        catch (InterruptedIOException x) {
            Thread.currentThread().interrupt();
        }
        catch (IOException x) {
            trouble = true;
        }
    }

    private void write(String s) {
        try {
            synchronized (this) {
                ensureOpen();
                textOut.write(s);
                textOut.flushBuffer();
                charOut.flushBuffer();
                if (autoFlush && (s.indexOf('\n') >= 0))
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

    private void newLine() {
        try {
            synchronized (this) {
                ensureOpen();
                textOut.newLine();
                textOut.flushBuffer();
                charOut.flushBuffer();
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
        write(String.valueOf(c));
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
        synchronized (this) {
            print(x);
            newLine();
        }
    }

  
    public void println(char x) {
        synchronized (this) {
            print(x);
            newLine();
        }
    }


    public void println(int x) {
        synchronized (this) {
            print(x);
            newLine();
        }
    }


    public void println(long x) {
        synchronized (this) {
            print(x);
            newLine();
        }
    }

  
    public void println(float x) {
        synchronized (this) {
            print(x);
            newLine();
        }
    }


    public void println(double x) {
        synchronized (this) {
            print(x);
            newLine();
        }
    }


    public void println(char x[]) {
        synchronized (this) {
            print(x);
            newLine();
        }
    }

    
    public void println(String x) {
        synchronized (this) {
            print(x);
            newLine();
        }
    }


    public void println(Object x) {
        String s = String.valueOf(x);
        synchronized (this) {
            print(s);
            newLine();
        }
    }



    public PrintStream printf(String format, Object ... args) {
        return format(format, args);
    }


    public PrintStream printf(Locale l, String format, Object ... args) {
        return format(l, format, args);
    }


    public PrintStream format(String format, Object ... args) {
        try {
            synchronized (this) {
                ensureOpen();
                if ((formatter == null)
                    || (formatter.locale() != Locale.getDefault()))
                    formatter = new Formatter((Appendable) this);
                formatter.format(Locale.getDefault(), format, args);
            }
        } catch (InterruptedIOException x) {
            Thread.currentThread().interrupt();
        } catch (IOException x) {
            trouble = true;
        }
        return this;
    }


    public PrintStream format(Locale l, String format, Object ... args) {
        try {
            synchronized (this) {
                ensureOpen();
                if ((formatter == null)
                    || (formatter.locale() != l))
                    formatter = new Formatter(this, l);
                formatter.format(l, format, args);
            }
        } catch (InterruptedIOException x) {
            Thread.currentThread().interrupt();
        } catch (IOException x) {
            trouble = true;
        }
        return this;
    }


    public PrintStream append(CharSequence csq) {
        if (csq == null)
            print("null");
        else
            print(csq.toString());
        return this;
    }


    public PrintStream append(CharSequence csq, int start, int end) {
        CharSequence cs = (csq == null ? "null" : csq);
        write(cs.subSequence(start, end).toString());
        return this;
    }

    public PrintStream append(char c) {
        print(c);
        return this;
    }

}

```

