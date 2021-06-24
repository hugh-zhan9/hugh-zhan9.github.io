---
title: Java IO之 DataInputStream详解
tags: Java-IO
categories: Java
date: 2020-07-22 20:22:28






---

-

<!--more-->

# DataInputStream 简介

`DataInputStream`是数据输入流。它继承于`FilterInputStream`。

`DataInputStream`是用来装饰其他输入流的，它允许应用程序以与机器无关方式从底层输入流中读取基本Java数据类型。应用程序可以使用`DataOutputStream`(数据输出流)写入由`DataInputStream`(数据输入流)读取的数据。

DataInputStream 函数列表

```java
// 构造函数
DataInputStream(InputStream in)
// 常用方法
int         read(byte[] buffer, int offset, int length)
int         read(byte[] buffer)
boolean     readBoolean()
byte        readByte()
char        readChar()
double      readDouble()
float       readFloat()
void        readFully(byte[] dst)
void        readFully(byte[] dst, int offset, int byteCount)
int         readInt()
String      readLine()    // 已弃用
long        readLong()
short       readShort()
String      readUTF(DataInput in)
String      readUTF()
int         readUnsignedByte()
int         readUnsignedShort()
int         skipBytes(int count)
```

# 示例

```java
import java.io.DataInputStream;
import java.io.DataOutputStream;
import java.io.ByteArrayInputStream;
import java.io.File;
import java.io.InputStream;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.FileNotFoundException;
import java.lang.SecurityException;

public class DataInputStreamTest {

    private static final int LEN = 5;

    public static void main(String[] args) {
        // 测试DataOutputStream，将数据写入到输出流中。
        testDataOutputStream() ;
        // 测试DataInputStream，从上面的输出流结果中读取数据。
        testDataInputStream() ;
    }

    
    private static void testDataOutputStream() {

        try {
            File file = new File("file.txt");
            DataOutputStream out = new DataOutputStream(new FileOutputStream(file));

            out.writeBoolean(true);
            out.writeByte((byte)0x41);
            out.writeChar((char)0x4243);
            out.writeShort((short)0x4445);
            out.writeInt(0x12345678);
            out.writeLong(0x0FEDCBA987654321L);

            out.writeUTF("abcdefghijklmnopqrstuvwxyz严12");

            out.close();
       } catch (FileNotFoundException e) {
           e.printStackTrace();
       } catch (SecurityException e) {
           e.printStackTrace();
       } catch (IOException e) {
           e.printStackTrace();
       }
    }

    
    private static void testDataInputStream() {

        try {
            File file = new File("file.txt");
            DataInputStream in = new DataInputStream(new FileInputStream(file));

            System.out.printf("byteToHexString(0x8F):0x%s\n", byteToHexString((byte)0x8F));
            System.out.printf("charToHexString(0x8FCF):0x%s\n", charToHexString((char)0x8FCF));

            System.out.printf("readBoolean():%s\n", in.readBoolean());
            System.out.printf("readByte():0x%s\n", byteToHexString(in.readByte()));
            System.out.printf("readChar():0x%s\n", charToHexString(in.readChar()));
            System.out.printf("readShort():0x%s\n", shortToHexString(in.readShort()));
            System.out.printf("readInt():0x%s\n", Integer.toHexString(in.readInt()));
            System.out.printf("readLong():0x%s\n", Long.toHexString(in.readLong()));
            System.out.printf("readUTF():%s\n", in.readUTF());

            in.close();
       } catch (FileNotFoundException e) {
           e.printStackTrace();
       } catch (SecurityException e) {
           e.printStackTrace();
       } catch (IOException e) {
           e.printStackTrace();
       }
    }

    // 打印byte对应的16进制的字符串
    private static String byteToHexString(byte val) {
        return Integer.toHexString(val & 0xff);
    }

    // 打印char对应的16进制的字符串
    private static String charToHexString(char val) {
        return Integer.toHexString(val);
    }

    // 打印short对应的16进制的字符串
    private static String shortToHexString(short val) {
        return Integer.toHexString(val & 0xffff);
    }
}
```

运行结果：

```java
byteToHexString(0x8F):0x8f
charToHexString(0x8FCF):0x8fcf
readBoolean():true
readByte():0x41
readChar():0x4243
readShort():0x4445
readInt():0x12345678
readLong():0xfedcba987654321
readUTF():abcdefghijklmnopqrstuvwxyz严12
```

结果说明：

1. 查看`file.txt`文本。16进制的数据显示如下：

![img]()

`001f`对应的`int`值是31。它表示的含义是后面的UTF-8数据的长度。字符串`abcdefghijklmnopqrstuvwxyz严12`中字母`ab...xyz`的长度是26，`严`对应的UTF-8数据长度是3；`12`长度是2。总的长度=26+3+2=31。

2. 返回`byte`对应的16进制的字符串

源码如下：

```java
private static String byteToHexString(byte val) {
    return Integer.toHexString(val & 0xff);
}
```

想想为什么代码是：

```java
return Integer.toHexString(val & 0xff);
```

而不是

```java
return Integer.toHexString(val);
```

我们先看看`byteToHexString((byte)0x8F); `在上面两种情况下的输出结果。

> `return Integer.toHexString(val & 0xff);`对应的输出是`0xffffff8f`
> `return Integer.toHexString(val);`对应的输出是`0x8f`

为什么会这样呢？

原因其实很简单，就是`byte`类型转换成`int`类型导致的问题。
`byte`类型的`0x8F`是一个负数，它对应的2进制是`10001111`；将一个负数的`byte`转换成`int`类型时，执行的是有符号转型(新增位都填充符号位的数字)。`0x8F`的符号位是1，因为将它转换成`int`时，填充1；转型后的结果(2进制)是`11111111 11111111 11111111 10001111`，对应的16进制为`0xffffff8f`。

因此当我们执行`Integer.toHexString(val);`时，返回的就是`0xffffff8f`。

在`Integer.toHexString(val & 0xff)`中，相当于`0xffffff8f & 0xff`，得到的结果是`0x8f`。

3. 返回`char`和`short`对应的16进制的字符串

返回char对应的16进制的字符串对应的源码如下：

```java
private static String charToHexString(char val) {
    return Integer.toHexString(val);
}
```

返回`short`对应的16进制的字符串对应源码如下：

```java
private static String shortToHexString(short val) {
    return Integer.toHexString(val & 0xffff);
}
```

比较上面的两个函数，为什么一个是`val`，而另一个是`val & 0xffff`？
 通过2的分析，我们类似的推出为什么返回`short`对应的16进制的字符串要执行`val & 0xffff`。
 但是，为什么返回`char`对应的16进制的字符串只需要执行`val`即可。原因也很简单，Java中`char`是无符号类型，占两个字节。将`char`转换为`int`类型，执行的是无符号转型，新增位都填充0。

# DataInputStream 源码

```java
package java.io;


public class DataInputStream extends FilterInputStream implements DataInput {

    public DataInputStream(InputStream in) {
        super(in);
    }

    private byte bytearr[] = new byte[80];
    private char chararr[] = new char[80];

    // 从数据输入流中读取一个字节
    public final int read(byte b[]) throws IOException {
        return in.read(b, 0, b.length);
    }

     // 从数据输入流中读取数据并存储到字节数组b中。
    // off是字节数组b中开始存储元素的起始位置。
    // len是读取字节的个数。
    public final int read(byte b[], int off, int len) throws IOException {
        return in.read(b, off, len);
    }

    // 从数据输入流中读取数据并填满字节数组b中；没有填满数组b则一直读取，直到填满位置。
    // 从字节数组b的位置0开始存储，并且读取的字节个数等于b的长度。
    public final void readFully(byte b[]) throws IOException {
        readFully(b, 0, b.length);
    }

    // 从数据输入流中读取数据并存储到字节数组b中；若没读取len个字节，直到一直读取直到读取完len个字节为止。
    public final void readFully(byte b[], int off, int len) throws IOException {
        if (len < 0)
            throw new IndexOutOfBoundsException();
        int n = 0;
        while (n < len) {
            int count = in.read(b, off + n, len - n);
            if (count < 0)
                throw new EOFException();
            n += count;
        }
    }

    // 从数据输入流中读取数据并存储到字节数组b中；若没读取len个字节，直到一直读取直到读取完len个字节为止。
    public final int skipBytes(int n) throws IOException {
        int total = 0;
        int cur = 0;

        while ((total<n) && ((cur = (int) in.skip(n-total)) > 0)) {
            total += cur;
        }

        return total;
    }

    // 从数据输入流中读取数据并存储到字节数组b中；若没读取len个字节，直到一直读取直到读取完len个字节为止。
    public final boolean readBoolean() throws IOException {
        int ch = in.read();
        if (ch < 0)
            throw new EOFException();
        return (ch != 0);
    }

    // 从数据输入流中读取Byte类型的值
    public final byte readByte() throws IOException {
        int ch = in.read();
        if (ch < 0)
            throw new EOFException();
        return (byte)(ch);
    }

    /**
     * See the general contract of the <code>readUnsignedByte</code>
     * method of <code>DataInput</code>.
     * <p>
     * Bytes
     * for this operation are read from the contained
     * input stream.
     *
     * @return     the next byte of this input stream, interpreted as an
     *             unsigned 8-bit number.
     * @exception  EOFException  if this input stream has reached the end.
     * @exception  IOException   the stream has been closed and the contained
     *             input stream does not support reading after close, or
     *             another I/O error occurs.
     * @see         java.io.FilterInputStream#in
     */
    public final int readUnsignedByte() throws IOException {
        int ch = in.read();
        if (ch < 0)
            throw new EOFException();
        return ch;
    }

    /**
     * See the general contract of the <code>readShort</code>
     * method of <code>DataInput</code>.
     * <p>
     * Bytes
     * for this operation are read from the contained
     * input stream.
     *
     * @return     the next two bytes of this input stream, interpreted as a
     *             signed 16-bit number.
     * @exception  EOFException  if this input stream reaches the end before
     *               reading two bytes.
     * @exception  IOException   the stream has been closed and the contained
     *             input stream does not support reading after close, or
     *             another I/O error occurs.
     * @see        java.io.FilterInputStream#in
     */
    public final short readShort() throws IOException {
        int ch1 = in.read();
        int ch2 = in.read();
        if ((ch1 | ch2) < 0)
            throw new EOFException();
        return (short)((ch1 << 8) + (ch2 << 0));
    }

    /**
     * See the general contract of the <code>readUnsignedShort</code>
     * method of <code>DataInput</code>.
     * <p>
     * Bytes
     * for this operation are read from the contained
     * input stream.
     *
     * @return     the next two bytes of this input stream, interpreted as an
     *             unsigned 16-bit integer.
     * @exception  EOFException  if this input stream reaches the end before
     *             reading two bytes.
     * @exception  IOException   the stream has been closed and the contained
     *             input stream does not support reading after close, or
     *             another I/O error occurs.
     * @see        java.io.FilterInputStream#in
     */
    public final int readUnsignedShort() throws IOException {
        int ch1 = in.read();
        int ch2 = in.read();
        if ((ch1 | ch2) < 0)
            throw new EOFException();
        return (ch1 << 8) + (ch2 << 0);
    }

    /**
     * See the general contract of the <code>readChar</code>
     * method of <code>DataInput</code>.
     * <p>
     * Bytes
     * for this operation are read from the contained
     * input stream.
     *
     * @return     the next two bytes of this input stream, interpreted as a
     *             <code>char</code>.
     * @exception  EOFException  if this input stream reaches the end before
     *               reading two bytes.
     * @exception  IOException   the stream has been closed and the contained
     *             input stream does not support reading after close, or
     *             another I/O error occurs.
     * @see        java.io.FilterInputStream#in
     */
    public final char readChar() throws IOException {
        int ch1 = in.read();
        int ch2 = in.read();
        if ((ch1 | ch2) < 0)
            throw new EOFException();
        return (char)((ch1 << 8) + (ch2 << 0));
    }

    /**
     * See the general contract of the <code>readInt</code>
     * method of <code>DataInput</code>.
     * <p>
     * Bytes
     * for this operation are read from the contained
     * input stream.
     *
     * @return     the next four bytes of this input stream, interpreted as an
     *             <code>int</code>.
     * @exception  EOFException  if this input stream reaches the end before
     *               reading four bytes.
     * @exception  IOException   the stream has been closed and the contained
     *             input stream does not support reading after close, or
     *             another I/O error occurs.
     * @see        java.io.FilterInputStream#in
     */
    public final int readInt() throws IOException {
        int ch1 = in.read();
        int ch2 = in.read();
        int ch3 = in.read();
        int ch4 = in.read();
        if ((ch1 | ch2 | ch3 | ch4) < 0)
            throw new EOFException();
        return ((ch1 << 24) + (ch2 << 16) + (ch3 << 8) + (ch4 << 0));
    }

    private byte readBuffer[] = new byte[8];

    /**
     * See the general contract of the <code>readLong</code>
     * method of <code>DataInput</code>.
     * <p>
     * Bytes
     * for this operation are read from the contained
     * input stream.
     *
     * @return     the next eight bytes of this input stream, interpreted as a
     *             <code>long</code>.
     * @exception  EOFException  if this input stream reaches the end before
     *               reading eight bytes.
     * @exception  IOException   the stream has been closed and the contained
     *             input stream does not support reading after close, or
     *             another I/O error occurs.
     * @see        java.io.FilterInputStream#in
     */
    public final long readLong() throws IOException {
        readFully(readBuffer, 0, 8);
        return (((long)readBuffer[0] << 56) +
                ((long)(readBuffer[1] & 255) << 48) +
                ((long)(readBuffer[2] & 255) << 40) +
                ((long)(readBuffer[3] & 255) << 32) +
                ((long)(readBuffer[4] & 255) << 24) +
                ((readBuffer[5] & 255) << 16) +
                ((readBuffer[6] & 255) <<  8) +
                ((readBuffer[7] & 255) <<  0));
    }

    /**
     * See the general contract of the <code>readFloat</code>
     * method of <code>DataInput</code>.
     * <p>
     * Bytes
     * for this operation are read from the contained
     * input stream.
     *
     * @return     the next four bytes of this input stream, interpreted as a
     *             <code>float</code>.
     * @exception  EOFException  if this input stream reaches the end before
     *               reading four bytes.
     * @exception  IOException   the stream has been closed and the contained
     *             input stream does not support reading after close, or
     *             another I/O error occurs.
     * @see        java.io.DataInputStream#readInt()
     * @see        java.lang.Float#intBitsToFloat(int)
     */
    public final float readFloat() throws IOException {
        return Float.intBitsToFloat(readInt());
    }

    /**
     * See the general contract of the <code>readDouble</code>
     * method of <code>DataInput</code>.
     * <p>
     * Bytes
     * for this operation are read from the contained
     * input stream.
     *
     * @return     the next eight bytes of this input stream, interpreted as a
     *             <code>double</code>.
     * @exception  EOFException  if this input stream reaches the end before
     *               reading eight bytes.
     * @exception  IOException   the stream has been closed and the contained
     *             input stream does not support reading after close, or
     *             another I/O error occurs.
     * @see        java.io.DataInputStream#readLong()
     * @see        java.lang.Double#longBitsToDouble(long)
     */
    public final double readDouble() throws IOException {
        return Double.longBitsToDouble(readLong());
    }

    private char lineBuffer[];

    /**
     * See the general contract of the <code>readLine</code>
     * method of <code>DataInput</code>.
     * <p>
     * Bytes
     * for this operation are read from the contained
     * input stream.
     *
     * @deprecated This method does not properly convert bytes to characters.
     * As of JDK&nbsp;1.1, the preferred way to read lines of text is via the
     * <code>BufferedReader.readLine()</code> method.  Programs that use the
     * <code>DataInputStream</code> class to read lines can be converted to use
     * the <code>BufferedReader</code> class by replacing code of the form:
     * <blockquote><pre>
     *     DataInputStream d =&nbsp;new&nbsp;DataInputStream(in);
     * </pre></blockquote>
     * with:
     * <blockquote><pre>
     *     BufferedReader d
     *          =&nbsp;new&nbsp;BufferedReader(new&nbsp;InputStreamReader(in));
     * </pre></blockquote>
     *
     * @return     the next line of text from this input stream.
     * @exception  IOException  if an I/O error occurs.
     * @see        java.io.BufferedReader#readLine()
     * @see        java.io.FilterInputStream#in
     */
    @Deprecated
    public final String readLine() throws IOException {
        char buf[] = lineBuffer;

        if (buf == null) {
            buf = lineBuffer = new char[128];
        }

        int room = buf.length;
        int offset = 0;
        int c;

loop:   while (true) {
            switch (c = in.read()) {
              case -1:
              case '\n':
                break loop;

              case '\r':
                int c2 = in.read();
                if ((c2 != '\n') && (c2 != -1)) {
                    if (!(in instanceof PushbackInputStream)) {
                        this.in = new PushbackInputStream(in);
                    }
                    ((PushbackInputStream)in).unread(c2);
                }
                break loop;

              default:
                if (--room < 0) {
                    buf = new char[offset + 128];
                    room = buf.length - offset - 1;
                    System.arraycopy(lineBuffer, 0, buf, 0, offset);
                    lineBuffer = buf;
                }
                buf[offset++] = (char) c;
                break;
            }
        }
        if ((c == -1) && (offset == 0)) {
            return null;
        }
        return String.copyValueOf(buf, 0, offset);
    }

    /**
     * See the general contract of the <code>readUTF</code>
     * method of <code>DataInput</code>.
     * <p>
     * Bytes
     * for this operation are read from the contained
     * input stream.
     *
     * @return     a Unicode string.
     * @exception  EOFException  if this input stream reaches the end before
     *               reading all the bytes.
     * @exception  IOException   the stream has been closed and the contained
     *             input stream does not support reading after close, or
     *             another I/O error occurs.
     * @exception  UTFDataFormatException if the bytes do not represent a valid
     *             modified UTF-8 encoding of a string.
     * @see        java.io.DataInputStream#readUTF(java.io.DataInput)
     */
    public final String readUTF() throws IOException {
        return readUTF(this);
    }

    /**
     * Reads from the
     * stream <code>in</code> a representation
     * of a Unicode  character string encoded in
     * <a href="DataInput.html#modified-utf-8">modified UTF-8</a> format;
     * this string of characters is then returned as a <code>String</code>.
     * The details of the modified UTF-8 representation
     * are  exactly the same as for the <code>readUTF</code>
     * method of <code>DataInput</code>.
     *
     * @param      in   a data input stream.
     * @return     a Unicode string.
     * @exception  EOFException            if the input stream reaches the end
     *               before all the bytes.
     * @exception  IOException   the stream has been closed and the contained
     *             input stream does not support reading after close, or
     *             another I/O error occurs.
     * @exception  UTFDataFormatException  if the bytes do not represent a
     *               valid modified UTF-8 encoding of a Unicode string.
     * @see        java.io.DataInputStream#readUnsignedShort()
     */
    public static final String readUTF(DataInput in) throws IOException {
        int utflen = in.readUnsignedShort();
        byte[] bytearr = null;
        char[] chararr = null;
        if (in instanceof DataInputStream) {
            DataInputStream dis = (DataInputStream)in;
            if (dis.bytearr.length < utflen){
                dis.bytearr = new byte[utflen*2];
                dis.chararr = new char[utflen*2];
            }
            chararr = dis.chararr;
            bytearr = dis.bytearr;
        } else {
            bytearr = new byte[utflen];
            chararr = new char[utflen];
        }

        int c, char2, char3;
        int count = 0;
        int chararr_count=0;

        in.readFully(bytearr, 0, utflen);

        while (count < utflen) {
            c = (int) bytearr[count] & 0xff;
            if (c > 127) break;
            count++;
            chararr[chararr_count++]=(char)c;
        }

        while (count < utflen) {
            c = (int) bytearr[count] & 0xff;
            switch (c >> 4) {
                case 0: case 1: case 2: case 3: case 4: case 5: case 6: case 7:
                    /* 0xxxxxxx*/
                    count++;
                    chararr[chararr_count++]=(char)c;
                    break;
                case 12: case 13:
                    /* 110x xxxx   10xx xxxx*/
                    count += 2;
                    if (count > utflen)
                        throw new UTFDataFormatException(
                            "malformed input: partial character at end");
                    char2 = (int) bytearr[count-1];
                    if ((char2 & 0xC0) != 0x80)
                        throw new UTFDataFormatException(
                            "malformed input around byte " + count);
                    chararr[chararr_count++]=(char)(((c & 0x1F) << 6) |
                                                    (char2 & 0x3F));
                    break;
                case 14:
                    /* 1110 xxxx  10xx xxxx  10xx xxxx */
                    count += 3;
                    if (count > utflen)
                        throw new UTFDataFormatException(
                            "malformed input: partial character at end");
                    char2 = (int) bytearr[count-2];
                    char3 = (int) bytearr[count-1];
                    if (((char2 & 0xC0) != 0x80) || ((char3 & 0xC0) != 0x80))
                        throw new UTFDataFormatException(
                            "malformed input around byte " + (count-1));
                    chararr[chararr_count++]=(char)(((c     & 0x0F) << 12) |
                                                    ((char2 & 0x3F) << 6)  |
                                                    ((char3 & 0x3F) << 0));
                    break;
                default:
                    /* 10xx xxxx,  1111 xxxx */
                    throw new UTFDataFormatException(
                        "malformed input around byte " + count);
            }
        }
        // The number of chars produced may be less than utflen
        return new String(chararr, 0, chararr_count);
    }
}
```

说明：DataInputStream 的作用就是“允许应用程序以与机器无关方式从底层输入流中读取基本 Java 数据类型。应用程序可以使用数据输出流写入稍后由数据输入流读取的数据。”
DataInputStream 中比较难以理解的函数就只有 readUTF(DataInput in)；下面，对这个函数进行详细的介绍，其它的函数请参考源码中的注释。

readUTF(DataInput in)源码如下：

```
public final static String readUTF(DataInput in) throws IOException {
    // 从“数据输入流”中读取“无符号的short类型”的值：
    // 注意：UTF-8输入流的前2个字节是数据的长度
    int utflen = in.readUnsignedShort();
    byte[] bytearr = null;
    char[] chararr = null;

    // 如果in本身是“数据输入流”，
    // 则，设置字节数组bytearr = "数据输入流"的成员bytearr
    //     设置字符数组chararr = "数据输入流"的成员chararr
    // 否则的话，新建数组bytearr和chararr
    if (in instanceof DataInputStream) {
        DataInputStream dis = (DataInputStream)in;
        if (dis.bytearr.length < utflen){
            dis.bytearr = new byte[utflen*2];
            dis.chararr = new char[utflen*2];
        }
        chararr = dis.chararr;
        bytearr = dis.bytearr;
    } else {
        bytearr = new byte[utflen];
        chararr = new char[utflen];
    }

    int c, char2, char3;
    int count = 0;
    int chararr_count=0;

    // 从“数据输入流”中读取数据并存储到字节数组bytearr中；从bytearr的位置0开始存储，存储长度为utflen。
    // 注意，这里是存储到字节数组！而且读取的是全部的数据。
    in.readFully(bytearr, 0, utflen);

    // 将“字节数组bytearr”中的数据 拷贝到 “字符数组chararr”中
    // 注意：这里相当于“预处理的输入流中单字节的符号”，因为UTF-8是1-4个字节可变的。
    while (count < utflen) {
        // 将每个字节转换成int值
        c = (int) bytearr[count] & 0xff;
        // UTF-8的每个字节的值都不会超过127；所以，超过127，则退出。
        if (c > 127) break;
        count++;
        // 将c保存到“字符数组chararr”中
        chararr[chararr_count++]=(char)c;
    }

    // 处理完输入流中单字节的符号之后，接下来我们继续处理。
    while (count < utflen) {
        // 下面语句执行了2步操作。
        // (01) 将字节由 “byte类型” 转换成 “int类型”。
        //      例如， “11001010” 转换成int之后，是 “00000000 00000000 00000000 11001010”
        // (02) 将 “int类型” 的数据左移4位
        //      例如， “00000000 00000000 00000000 11001010” 左移4位之后，变成 “00000000 00000000 00000000 00001100”
        c = (int) bytearr[count] & 0xff;
        switch (c >> 4) {
            // 若 UTF-8 是单字节，即 bytearr[count] 对应是 “0xxxxxxx” 形式；
            // 则 bytearr[count] 对应的int类型的c的取值范围是 0-7。
            case 0: case 1: case 2: case 3: case 4: case 5: case 6: case 7:
                /* 0xxxxxxx*/
                count++;
                chararr[chararr_count++]=(char)c;
                break;

            // 若 UTF-8 是双字节，即 bytearr[count] 对应是 “110xxxxx  10xxxxxx” 形式中的第一个，即“110xxxxx”
            // 则 bytearr[count] 对应的int类型的c的取值范围是 12-13。
            case 12: case 13:
                /* 110x xxxx   10xx xxxx*/
                count += 2;
                if (count > utflen)
                    throw new UTFDataFormatException(
                        "malformed input: partial character at end");
                char2 = (int) bytearr[count-1];
                if ((char2 & 0xC0) != 0x80)
                    throw new UTFDataFormatException(
                        "malformed input around byte " + count);
                chararr[chararr_count++]=(char)(((c & 0x1F) << 6) |
                                                (char2 & 0x3F));
                break;

            // 若 UTF-8 是三字节，即 bytearr[count] 对应是 “1110xxxx  10xxxxxx  10xxxxxx” 形式中的第一个，即“1110xxxx”
            // 则 bytearr[count] 对应的int类型的c的取值是14 。
            case 14:
                /* 1110 xxxx  10xx xxxx  10xx xxxx */
                count += 3;
                if (count > utflen)
                    throw new UTFDataFormatException(
                        "malformed input: partial character at end");
                char2 = (int) bytearr[count-2];
                char3 = (int) bytearr[count-1];
                if (((char2 & 0xC0) != 0x80) || ((char3 & 0xC0) != 0x80))
                    throw new UTFDataFormatException(
                        "malformed input around byte " + (count-1));
                chararr[chararr_count++]=(char)(((c     & 0x0F) << 12) |
                                                ((char2 & 0x3F) << 6)  |
                                                ((char3 & 0x3F) << 0));
                break;

            // 若 UTF-8 是四字节，即 bytearr[count] 对应是 “11110xxx 10xxxxxx  10xxxxxx  10xxxxxx” 形式中的第一个，即“11110xxx”
            // 则 bytearr[count] 对应的int类型的c的取值是15 
            default:
                /* 10xx xxxx,  1111 xxxx */
                throw new UTFDataFormatException(
                    "malformed input around byte " + count);
        }
    }
    // The number of chars produced may be less than utflen
    return new String(chararr, 0, chararr_count);
}
```

说明：
(01) readUTF()的作用，是从输入流中读取UTF-8编码的数据，并以String字符串的形式返回。
(02) 知道了readUTF()的作用之后，下面开始介绍readUTF()的流程：

**第1步**，读取出输入流中的UTF-8数据的长度。代码如下：

```
int utflen = in.readUnsignedShort();
```

UTF-8数据的长度包含在它的前两个字节当中；我们通过readUnsignedShort()读取出前两个字节对应的正整数就是UTF-8数据的长度。

**第2步**，创建2个数组：字节数组bytearr 和 字符数组chararr。代码如下：

```
if (in instanceof DataInputStream) {
    DataInputStream dis = (DataInputStream)in;
    if (dis.bytearr.length < utflen){
        dis.bytearr = new byte[utflen*2];
        dis.chararr = new char[utflen*2];
    }
    chararr = dis.chararr;
    bytearr = dis.bytearr;
} else {
    bytearr = new byte[utflen];
    chararr = new char[utflen];
}
```

首先，判断该输入流本身是不是DataInputStream，即数据输入流；若是的话，
 则，设置字节数组bytearr = "数据输入流"的成员bytearr；设置字符数组chararr = "数据输入流"的成员chararr。 
 否则的话，新建数组bytearr和chararr。

**第3步**，将UTF-8数据全部读取到“字节数组bytearr”中。代码如下：

```
in.readFully(bytearr, 0, utflen);
```

注意: 这里是存储到字节数组，而不是字符数组！而且读取的是全部的数据。

**第4步**，对UTF-8中的单字节数据进行预处理。代码如下：

```
while (count < utflen) {
    // 将每个字节转换成int值
    c = (int) bytearr[count] & 0xff;
    // UTF-8的单字节数据的值都不会超过127；所以，超过127，则退出。
    if (c > 127) break;
    count++;
    // 将c保存到“字符数组chararr”中
    chararr[chararr_count++]=(char)c;
}
```

UTF-8的数据是变长的，可以是1-4个字节；在readUTF()中，我们最终是将全部的UTF-8数据保存到“字符数组(而不是字节数组)”中，再将其转换为String字符串。
 由于UTF-8的单字节和ASCII相同，所以这里就将它们进行预处理，直接保存到“字符数组chararr”中。对于其它的UTF-8数据，则在后面进行处理。

**第5步**，对“第4步 预处理”之后的数据，接着进行处理。代码如下：

```
// 处理完输入流中单字节的符号之后，接下来我们继续处理。
while (count < utflen) {
    // 下面语句执行了2步操作。
    // (01) 将字节由 “byte类型” 转换成 “int类型”。
    //      例如， “11001010” 转换成int之后，是 “00000000 00000000 00000000 11001010”
    // (02) 将 “int类型” 的数据左移4位
    //      例如， “00000000 00000000 00000000 11001010” 左移4位之后，变成 “00000000 00000000 00000000 00001100”
    c = (int) bytearr[count] & 0xff;
    switch (c >> 4) {
        // 若 UTF-8 是单字节，即 bytearr[count] 对应是 “0xxxxxxx” 形式；
        // 则 bytearr[count] 对应的int类型的c的取值范围是 0-7。
        case 0: case 1: case 2: case 3: case 4: case 5: case 6: case 7:
            /* 0xxxxxxx*/
            count++;
            chararr[chararr_count++]=(char)c;
            break;

        // 若 UTF-8 是双字节，即 bytearr[count] 对应是 “110xxxxx  10xxxxxx” 形式中的第一个，即“110xxxxx”
        // 则 bytearr[count] 对应的int类型的c的取值范围是 12-13。
        case 12: case 13:
            /* 110x xxxx   10xx xxxx*/
            count += 2;
            if (count > utflen)
                throw new UTFDataFormatException(
                    "malformed input: partial character at end");
            char2 = (int) bytearr[count-1];
            if ((char2 & 0xC0) != 0x80)
                throw new UTFDataFormatException(
                    "malformed input around byte " + count);
            chararr[chararr_count++]=(char)(((c & 0x1F) << 6) |
                                            (char2 & 0x3F));
            break;

        // 若 UTF-8 是三字节，即 bytearr[count] 对应是 “1110xxxx  10xxxxxx  10xxxxxx” 形式中的第一个，即“1110xxxx”
        // 则 bytearr[count] 对应的int类型的c的取值是14 。
        case 14:
            /* 1110 xxxx  10xx xxxx  10xx xxxx */
            count += 3;
            if (count > utflen)
                throw new UTFDataFormatException(
                    "malformed input: partial character at end");
            char2 = (int) bytearr[count-2];
            char3 = (int) bytearr[count-1];
            if (((char2 & 0xC0) != 0x80) || ((char3 & 0xC0) != 0x80))
                throw new UTFDataFormatException(
                    "malformed input around byte " + (count-1));
            chararr[chararr_count++]=(char)(((c     & 0x0F) << 12) |
                                            ((char2 & 0x3F) << 6)  |
                                            ((char3 & 0x3F) << 0));
            break;

        // 若 UTF-8 是四字节，即 bytearr[count] 对应是 “11110xxx 10xxxxxx  10xxxxxx  10xxxxxx” 形式中的第一个，即“11110xxx”
        // 则 bytearr[count] 对应的int类型的c的取值是15 
        default:
            /* 10xx xxxx,  1111 xxxx */
            throw new UTFDataFormatException(
                "malformed input around byte " + count);
    }
}
```

(a) 我们将下面的两条语句一起进行说明

```
c = (int) bytearr[count] & 0xff;
switch (c >> 4) { ... }
```

首先，我们必须要理解 为什么要这么做(执行上面2条语句)呢？
 原因很简单，这么做的目的就是为了区分UTF-8数据是几位的；因为UTF-8的数据是1～4字节不等。

我们先看看UTF-8在1～4位情况下的格式。

```
--------------------+---------------------------------------------
1字节 UTF-8的通用格式  | 0xxxxxxx
2字节 UTF-8的通用格式  | 110xxxxx 10xxxxxx
3字节 UTF-8的通用格式  | 1110xxxx 10xxxxxx 10xxxxxx
4字节 UTF-8的通用格式  | 11110xxx 10xxxxxx 10xxxxxx 10xxxxxx
```

执行 c = (int) bytearr[count] & 0xff; 和 c>>4 这2项操作之后，上面的数据变成

```
--------------------+---------------------------------------------
1字节 UTF-8的变换后对应的int类型值  | 00000000 00000000 00000000 00000xxx    (范围是0~7) 
2字节 UTF-8的变换后对应的int类型值  | 00000000 00000000 00000000 0000110x    (范围是12~13) 
3字节 UTF-8的变换后对应的int类型值  | 00000000 00000000 00000000 00001110    (范围是14) 
4字节 UTF-8的变换后对应的int类型值  | 00000000 00000000 00000000 00001111    (范围是15) 
```

**为什么会是这样呢？**

我们以“2字节 UTF-8的通用格式”来说明。
 它的通用格式是 “110xxxxx 10xxxxxx”，我们在操作时，只会操作第1个字节，即只会操作“110xxxxx”
(a.1) 在执行 c = (int) bytearr[count] & 0xff; 时，首先将 bytearr[count] 转换成int。

```
“110xxxxx”
```

转成int类型之后，变成

```
“11111111 11111111 11111111 110xxxxx”
```

因为“110xxxxx”是负数(第1为是1)，所以转换成int类型时多出来的位补1。

(a.2) 接着 c = (int) bytearr[count] & 0xff; 中，会将 “转换成int类型后的bytearr[count]” 与 “0xff”进行 逻辑与(即&) 操作。结果如下：

```
“00000000 00000000 00000000 110xxxxx”
```

(a.3) 执行 c>>4 时，会将上面的结果左移4位。得到的结果如下：

```
“00000000 00000000 00000000 0000110x”
```

(b) 上面的理解之后，swicth (c>>4) { ... } 其中的省略号部分就相当容易理解了。

我们还是以“2字节 UTF-8的通用格式”来说明。
 它会执行 case 12 和 case 13；源码如下：

```
count += 2;
if (count > utflen)
    throw new UTFDataFormatException(
        "malformed input: partial character at end");
char2 = (int) bytearr[count-1];
if ((char2 & 0xC0) != 0x80)
    throw new UTFDataFormatException(
        "malformed input around byte " + count);
chararr[chararr_count++]=(char)(((c & 0x1F) << 6) | (char2 & 0x3F));
```

(b.1) 由于这种情况对应的UTF-8数据是“2字节”的，因此，执行count+2；直接跳过2个字节。
(b.2) 由于chararr的元素是字符类型，而一个字符正好占2个字节；因为正好将(((c & 0x1F) << 6) | (char2 & 0x3F)); 的结果转换成char，然后保存在chararr数组中。

**第6步**，将字符数组转换成String字符串，并返回。代码如下：

```
return new String(chararr, 0, chararr_count);
```