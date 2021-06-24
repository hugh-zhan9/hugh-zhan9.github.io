---
title: Java IO之 ObjectInputStream/ObjectOutPutStream详解
tags: Java-IO
categories: Java
date: 2020-07-21 22:22:28


---

-

<!--more-->

# ObjectInputStream 和 ObjectOutputStream 简介

`ObjectOutputStream`和`ObjectInputStream`地作用是：对基本数据和对象进行序列化操作支持。

创建文件输出流对应的`ObjectOutputStream`对象，该`ObjectOutputStream`对象能提供对基本数据或对象的持久存储。当我们需要读取这些存储的基本数据或对象时，可以创建文件输入流对应的`ObjectInputStream`，进而读取出这些基本数据或对象。

> 注意：只有支持`java.io.Serializable`或`java.io.Externalizable`接口的对象才能被`ObjectInputStream/ObjectOutputStream`所操作!

ObjectOutputStream 函数列表

```
// 构造函数
ObjectOutputStream(OutputStream output)
// 常用方法
void     					  close()
void     					  defaultWriteObject()
void     					  flush()
ObjectOutputStream.PutField     putFields()
void     					  reset()
void     					  useProtocolVersion(int version)
void     					  write(int value)
void     					  write(byte[] buffer, int offset, int length)
void     					  writeBoolean(boolean value)
void     					  writeByte(int value)
void     					  writeBytes(String value)
void     					  writeChar(int value)
void     					  writeChars(String value)
void     					  writeDouble(double value)
void     					  writeFields()
void     					  writeFloat(float value)
void     					  writeInt(int value)
void     					  writeLong(long value)
final      void     		   writeObject(Object object)
void     					  writeShort(int value)
void     					  writeUTF(String value)
void     					  writeUnshared(Object object)
```

ObjetInputStream 函数列表

```
// 构造函数
ObjectInputStream(InputStream input)
// 常用方法
int     				    available()
void     				    close()
void     				    defaultReadObject()
int     				    read(byte[] buffer, int offset, int length)
int     				    read()
boolean     				readBoolean()
byte     				    readByte()
char     				    readChar()
double     			        readDouble()
ObjectInputStream.GetField   readFields()
float     				    readFloat()
void     				    readFully(byte[] dst)
void     				    readFully(byte[] dst, int offset, int byteCount)
int     				    readInt()
String     				    readLine()
long     				    readLong()
final Object     			readObject()
short     				    readShort()
String     				    readUTF()
Object     				    readUnshared()
int     				    readUnsignedByte()
int     				    readUnsignedShort()
synchronized void		     registerValidation(ObjectInputValidation object, int priority)
int     				    skipBytes(int length)
```

# 示例

```java
/**
 * ObjectInputStream 和 ObjectOutputStream 测试程序
 *
 * 注意：通过ObjectInputStream, ObjectOutputStream操作的对象，必须是实现了Serializable或Externalizable序列化接口的类的实例。
 */

import java.io.FileInputStream;   
import java.io.FileOutputStream;   
import java.io.ObjectInputStream;   
import java.io.ObjectOutputStream;   
import java.io.Serializable;   
import java.util.Map;
import java.util.HashMap;
import java.util.Iterator;

public class ObjectStreamTest { 
    private static final String TMP_FILE = "box.tmp";

    public static void main(String[] args) {   
        testWrite();
        testRead();
    }


    /**
     * ObjectOutputStream 测试函数
     */
    private static void testWrite() {   
        try {
            ObjectOutputStream out = new ObjectOutputStream(
                    new FileOutputStream(TMP_FILE));
            out.writeBoolean(true);
            out.writeByte((byte)65);
            out.writeChar('a');
            out.writeInt(20131015);
            out.writeFloat(3.14F);
            out.writeDouble(1.414D);
            // 写入HashMap对象
            HashMap map = new HashMap();
            map.put("one", "red");
            map.put("two", "green");
            map.put("three", "blue");
            out.writeObject(map);
            // 写入自定义的Box对象，Box实现了Serializable接口
            Box box = new Box("desk", 80, 48);
            out.writeObject(box);

            out.close();
        } catch (Exception ex) {
            ex.printStackTrace();
        }
    }

    // ObjectInputStream 测试函数
    private static void testRead() {
        try {
            ObjectInputStream in = new ObjectInputStream(
                    new FileInputStream(TMP_FILE));
            System.out.printf("boolean:%b\n" , in.readBoolean());
            System.out.printf("byte:%d\n" , (in.readByte()&0xff));
            System.out.printf("char:%c\n" , in.readChar());
            System.out.printf("int:%d\n" , in.readInt());
            System.out.printf("float:%f\n" , in.readFloat());
            System.out.printf("double:%f\n" , in.readDouble());
            // 读取HashMap对象
            HashMap map = (HashMap) in.readObject();
            Iterator iter = map.entrySet().iterator();
            while (iter.hasNext()) {
                Map.Entry entry = (Map.Entry)iter.next();
                System.out.printf("%-6s -- %s\n" , entry.getKey(), entry.getValue());
            }
            // 读取Box对象，Box实现了Serializable接口
            Box box = (Box) in.readObject();
            System.out.println("box: " + box);

            in.close();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}


class Box implements Serializable {
    private int width;   
    private int height; 
    private String name;   

    public Box(String name, int width, int height) {
        this.name = name;
        this.width = width;
        this.height = height;
    }

    @Override
    public String toString() {
        return "["+name+": ("+width+", "+height+") ]";
    }
}
```

