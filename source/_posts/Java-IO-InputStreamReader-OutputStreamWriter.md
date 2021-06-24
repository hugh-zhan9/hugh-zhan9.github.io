---
title: Java IO之 InputStreamReader和OutputStreamWriter详解
tags: Java-IO
categories: Java
date: 2020-07-24 19:25:28




---

-

<!--more-->

# InputStreamReader 和 OutputStreamWriter 简介

`InputStreamReader`和`OutputStreamWriter`是字节流通向字符流的桥梁：它使用指定的`charset`读写字节并将其解码为字符。

`InputStreamReader`的作用是将字节输入流转换成字符输入流。它继承于`Reader`。
`OutputStreamWriter`的作用是将字节输出流转换成字符输出流。它继承于`Writer`。

# 示例

```java
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.OutputStreamWriter;
import java.io.InputStreamReader;
import java.io.IOException;

public class StreamConverter {

    private static final String FileName = "file.txt";
    private static final String CharsetName = "utf-8";
    //private static final String CharsetName = "gb2312";

    public static void main(String[] args) {
        testWrite();
        testRead();
    }

 
    private static void testWrite() {
        try {
            File file = new File(FileName);
            // 创建FileOutputStream对应OutputStreamWriter：将字节流转换为字符流，即写入out1的数据会自动由字节转换为字符。
            OutputStreamWriter out1 = new OutputStreamWriter(new FileOutputStream(file), CharsetName);
            out1.write("字节流转为字符流示例");
            out1.write("0123456789\n");

            out1.close();

        } catch(IOException e) {
            e.printStackTrace();
        }
    }

    private static void testRead() {
        try {
            File file = new File(FileName);
            InputStreamReader in1 = new InputStreamReader(new FileInputStream(file), CharsetName);

            char c1 = (char)in1.read();
            System.out.println("c1="+c1);

            in1.skip(6);

            char[] buf = new char[10];
            in1.read(buf, 0, buf.length);
            System.out.println("buf="+(new String(buf)));

            in1.close();
        } catch(IOException e) {
            e.printStackTrace();
        }
    }
}
```

运行结果：

```
c1=字
buf=流示例0123456
```

结果说明：

- `testWrite()`的作用是将内容写入到输出流。写入的时候，会将写入的内容转换`utf-8`编码并写入。
- `testRead()`的作用是将内容读取到输入流。读取的时候，会将内容转换成`utf-8`的内容转换成字节并读出来。

# InputStreamReader 和 OutputStreamWriter 源码

## InputStreamReader 源码

```java
package java.io;

import java.nio.charset.Charset;
import java.nio.charset.CharsetDecoder;
import sun.nio.cs.StreamDecoder;


public class InputStreamReader extends Reader {

    private final StreamDecoder sd;

    
    public InputStreamReader(InputStream in) {
        super(in);
        try {
            sd = StreamDecoder.forInputStreamReader(in, this, (String)null); // ## check lock object
        } catch (UnsupportedEncodingException e) {
            // The default encoding should always be available
            throw new Error(e);
        }
    }

   
    public InputStreamReader(InputStream in, String charsetName)
        throws UnsupportedEncodingException
    {
        super(in);
        if (charsetName == null)
            throw new NullPointerException("charsetName");
        sd = StreamDecoder.forInputStreamReader(in, this, charsetName);
    }

    
    public InputStreamReader(InputStream in, Charset cs) {
        super(in);
        if (cs == null)
            throw new NullPointerException("charset");
        sd = StreamDecoder.forInputStreamReader(in, this, cs);
    }

  
    public InputStreamReader(InputStream in, CharsetDecoder dec) {
        super(in);
        if (dec == null)
            throw new NullPointerException("charset decoder");
        sd = StreamDecoder.forInputStreamReader(in, this, dec);
    }

   
    public String getEncoding() {
        return sd.getEncoding();
    }


    public int read() throws IOException {
        return sd.read();
    }


    public int read(char cbuf[], int offset, int length) throws IOException {
        return sd.read(cbuf, offset, length);
    }

    
    public boolean ready() throws IOException {
        return sd.ready();
    }

    public void close() throws IOException {
        sd.close();
    }
}
```

## OutputStreamWriter 源码

```java
package java.io;

import java.nio.charset.Charset;
import java.nio.charset.CharsetEncoder;
import sun.nio.cs.StreamEncoder;



public class OutputStreamWriter extends Writer {

    private final StreamEncoder se;

    
    public OutputStreamWriter(OutputStream out, String charsetName)
        throws UnsupportedEncodingException
    {
        super(out);
        if (charsetName == null)
            throw new NullPointerException("charsetName");
        se = StreamEncoder.forOutputStreamWriter(out, this, charsetName);
    }

    
    public OutputStreamWriter(OutputStream out) {
        super(out);
        try {
            se = StreamEncoder.forOutputStreamWriter(out, this, (String)null);
        } catch (UnsupportedEncodingException e) {
            throw new Error(e);
        }
    }

    
    public OutputStreamWriter(OutputStream out, Charset cs) {
        super(out);
        if (cs == null)
            throw new NullPointerException("charset");
        se = StreamEncoder.forOutputStreamWriter(out, this, cs);
    }

    
    public OutputStreamWriter(OutputStream out, CharsetEncoder enc) {
        super(out);
        if (enc == null)
            throw new NullPointerException("charset encoder");
        se = StreamEncoder.forOutputStreamWriter(out, this, enc);
    }

    
    public String getEncoding() {
        return se.getEncoding();
    }

  
    void flushBuffer() throws IOException {
        se.flushBuffer();
    }

   
    public void write(int c) throws IOException {
        se.write(c);
    }

   
    public void write(char cbuf[], int off, int len) throws IOException {
        se.write(cbuf, off, len);
    }

 
    public void write(String str, int off, int len) throws IOException {
        se.write(str, off, len);
    }

 
    public void flush() throws IOException {
        se.flush();
    }

    public void close() throws IOException {
        se.close();
    }
}
```

说明：

`OutputStreamWriter`作用和原理都比较简单。
作用就是将字节输出流转换成字符输出流。它的原理是，我们创建字符输出流对象时，会指定字节输出流以及字符编码。