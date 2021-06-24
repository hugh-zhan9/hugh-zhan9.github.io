---
title: Java IO之 FileReader和FileWriter详解
tags: Java-IO
categories: Java
date: 2020-07-24 20:52:28




---

-

<!--more-->

# FileReader 和 FileWriter 简介

`FileReader`是用于读取字符流的类，它继承于`InputStreamReader`。要读取原始字节流，考虑使用 `FileInputStream`。

`FileWriter`是用于写入字符流的类，它继承于`OutputStreamWriter`。要写入原始字节流，考虑使用 `FileOutputStream`。

# 示例

```java
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.FileWriter;;
import java.io.FileReader;
import java.io.IOException;


public class FileReaderWriterTest {

    private static final String FileName = "file.txt";
    private static final String CharsetName = "utf-8";

    public static void main(String[] args) {
        testWrite();
        testRead();
    }

    private static void testWrite() {
        try {
            File file = new File(FileName);
            // 创建FileOutputStream对应FileWriter：将字节流转换为字符流，即写入out1的数据会自动由字节转换为字符。
            FileWriter out1 = new FileWriter(file);
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
            FileReader in1 = new FileReader(file);


            char c1 = (char)in1.read();
            System.out.println("c1="+c1);

            // 测试skip(long byteCount)，跳过4个字符
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

# FileReader 和 FileWriter 源码

## FileReader 源码

```java
package java.io;

public class FileReader extends InputStreamReader {
    public FileReader(String fileName) throws FileNotFoundException {
        super(new FileInputStream(fileName));
    }

    public FileReader(File file) throws FileNotFoundException {
        super(new FileInputStream(file));
    }

    public FileReader(FileDescriptor fd) {
        super(new FileInputStream(fd));
    }
}
```

从中，可以看出`FileReader`是基于`InputStreamReader`实现的。

## FileWriter 源码

```java
package java.io;

public class FileWriter extends OutputStreamWriter {
    public FileWriter(String fileName) throws IOException {
        super(new FileOutputStream(fileName));
    }

    public FileWriter(String fileName, boolean append) throws IOException {
        super(new FileOutputStream(fileName, append));
    }

    public FileWriter(File file) throws IOException {
        super(new FileOutputStream(file));
    }

    public FileWriter(File file, boolean append) throws IOException {
        super(new FileOutputStream(file, append));
    }

    public FileWriter(FileDescriptor fd) {
        super(new FileOutputStream(fd));
    }
}
```

从中，可以看出`FileWriter`是基于`OutputStreamWriter`实现的。