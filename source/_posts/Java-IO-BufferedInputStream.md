---
title: Java IO之 BufferedInputStream详解
tags: Java-IO
categories: Java
date: 2020-07-21 20:22:28





---

-

<!--more-->

# BufferedInputStream 简介

`BufferedInputStream`是缓冲输入流。它继承于`FilterInputStream`。

`BufferedInputStream`的作用是为另一个输入流添加一些功能，例如：提供缓存功能以及支持`mark()`标记和`reset()`重置方法。

`BufferedInputStream`的本质是通过一个内部缓冲区数组四线的。例如：在新建某输入流对应的`BufferedInputStream`后，当我们通过`read()`读取输入流的数据时，`BufferedInputStream`会将该输入流的数据分批地填入到缓冲区中。每当缓冲区中地数据被读完之后，输入流会再次填充数据缓冲区；如此反复，知道读完输入流数据位置。

`BufferedInputStream`函数列表

```java
// 构造方法
BufferedInputStream(InputStream in)
BufferedInputStream(InputStream in, int size)
// 常用方法
synchronized int      available()
void                  close()
synchronized void     mark(int readlimit)
boolean               markSupported()
synchronized int      read(byte[] buffer, int off, int len)
synchronized int      read()
synchronized void     reset()
synchronized long     skip(long n)
```



# 示例

```java
import java.io.BufferedInputStream;
import java.io.ByteArrayInputStream;
import java.io.File;
import java.io.InputStream;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.FileNotFoundException;
import java.lang.SecurityException;


public class BufferedInputStreamTest {

    private static final int LEN = 5;

    public static void main(String[] args) {
        testBufferedInputStream() ;
    }

    
    private static void testBufferedInputStream() {

        // 创建BufferedInputStream字节流，内容是ArrayLetters数组
        try {
            File file = new File("bufferedinputstream.txt");
            InputStream in = new BufferedInputStream(new FileInputStream(file), 512);

            // 从字节流中读取5个字节。“abcde”，a对应0x61，b对应0x62，依次类推...
            for (int i=0; i<LEN; i++) {
                // 若能继续读取下一个字节，则读取下一个字节
                if (in.available() >= 0) {
                    // 读取“字节流的下一个字节”
                    int tmp = in.read();
                    System.out.printf("%d : 0x%s\n", i, Integer.toHexString(tmp));
                }
            }

            // 若该字节流不支持标记功能，则直接退出
            if (!in.markSupported()) {
                System.out.println("make not supported!");
                return ;
            }

            // 标记当前索引位置，即标记第6个位置的元素--“f”
            // 1024对应marklimit
            in.mark(1024);

            // 跳过22个字节。
            in.skip(22);

            // 读取5个字节
            byte[] buf = new byte[LEN];
            in.read(buf, 0, LEN);
            // 将buf转换为String字符串。
            String str1 = new String(buf);
            System.out.printf("str1=%s\n", str1);

            // 重置输入流的索引为mark()所标记的位置，即重置到“f”处。
            in.reset();
            // 从重置后的字节流中读取5个字节到buf中。即读取“fghij”
            in.read(buf, 0, LEN);
            // 将buf转换为String字符串。
            String str2 = new String(buf);
            System.out.printf("str2=%s\n", str2);

            in.close();
       } catch (FileNotFoundException e) {
           e.printStackTrace();
       } catch (SecurityException e) {
           e.printStackTrace();
       } catch (IOException e) {
           e.printStackTrace();
       }
    }
}
```

程序中读取的`bufferedinputstream.txt`的内容如下：

```
abcdefghijklmnopqrstuvwxyz
0123456789
ABCDEFGHIJKLMNOPQRSTUVWXYZ
```

运行结果：

```
0 : 0x61
1 : 0x62
2 : 0x63
3 : 0x64
4 : 0x65
str1=01234
str2=fghij
```

# BufferedInputStream 源码分析

```java
package java.io;

import jdk.internal.misc.Unsafe;


public
class BufferedInputStream extends FilterInputStream {

    private static int DEFAULT_BUFFER_SIZE = 8192;

    /**
     * The maximum size of array to allocate.
     * Some VMs reserve some header words in an array.
     * Attempts to allocate larger arrays may result in
     * OutOfMemoryError: Requested array size exceeds VM limit
     */
    private static int MAX_BUFFER_SIZE = Integer.MAX_VALUE - 8;

    /**
     * As this class is used early during bootstrap, it's motivated to use
     * Unsafe.compareAndSetObject instead of AtomicReferenceFieldUpdater
     * (or VarHandles) to reduce dependencies and improve startup time.
     */
    private static final Unsafe U = Unsafe.getUnsafe();

    private static final long BUF_OFFSET
            = U.objectFieldOffset(BufferedInputStream.class, "buf");

    /**
     * The internal buffer array where the data is stored. When necessary,
     * it may be replaced by another array of
     * a different size.
     */
    /*
     * We null this out with a CAS on close(), which is necessary since
     * closes can be asynchronous. We use nullness of buf[] as primary
     * indicator that this stream is closed. (The "in" field is also
     * nulled out on close.)
     */
    protected volatile byte[] buf;

    /**
     * The index one greater than the index of the last valid byte in
     * the buffer.
     * This value is always
     * in the range <code>0</code> through <code>buf.length</code>;
     * elements <code>buf[0]</code>  through <code>buf[count-1]
     * </code>contain buffered input data obtained
     * from the underlying  input stream.
     */
    protected int count;

    /**
     * The current position in the buffer. This is the index of the next
     * character to be read from the <code>buf</code> array.
     * <p>
     * This value is always in the range <code>0</code>
     * through <code>count</code>. If it is less
     * than <code>count</code>, then  <code>buf[pos]</code>
     * is the next byte to be supplied as input;
     * if it is equal to <code>count</code>, then
     * the  next <code>read</code> or <code>skip</code>
     * operation will require more bytes to be
     * read from the contained  input stream.
     *
     * @see     java.io.BufferedInputStream#buf
     */
    protected int pos;

    /**
     * The value of the <code>pos</code> field at the time the last
     * <code>mark</code> method was called.
     * <p>
     * This value is always
     * in the range <code>-1</code> through <code>pos</code>.
     * If there is no marked position in  the input
     * stream, this field is <code>-1</code>. If
     * there is a marked position in the input
     * stream,  then <code>buf[markpos]</code>
     * is the first byte to be supplied as input
     * after a <code>reset</code> operation. If
     * <code>markpos</code> is not <code>-1</code>,
     * then all bytes from positions <code>buf[markpos]</code>
     * through  <code>buf[pos-1]</code> must remain
     * in the buffer array (though they may be
     * moved to  another place in the buffer array,
     * with suitable adjustments to the values
     * of <code>count</code>,  <code>pos</code>,
     * and <code>markpos</code>); they may not
     * be discarded unless and until the difference
     * between <code>pos</code> and <code>markpos</code>
     * exceeds <code>marklimit</code>.
     *
     * @see     java.io.BufferedInputStream#mark(int)
     * @see     java.io.BufferedInputStream#pos
     */
    protected int markpos = -1;

    /**
     * The maximum read ahead allowed after a call to the
     * <code>mark</code> method before subsequent calls to the
     * <code>reset</code> method fail.
     * Whenever the difference between <code>pos</code>
     * and <code>markpos</code> exceeds <code>marklimit</code>,
     * then the  mark may be dropped by setting
     * <code>markpos</code> to <code>-1</code>.
     *
     * @see     java.io.BufferedInputStream#mark(int)
     * @see     java.io.BufferedInputStream#reset()
     */
    protected int marklimit;

    /**
     * Check to make sure that underlying input stream has not been
     * nulled out due to close; if not return it;
     */
    private InputStream getInIfOpen() throws IOException {
        InputStream input = in;
        if (input == null)
            throw new IOException("Stream closed");
        return input;
    }

    /**
     * Check to make sure that buffer has not been nulled out due to
     * close; if not return it;
     */
    private byte[] getBufIfOpen() throws IOException {
        byte[] buffer = buf;
        if (buffer == null)
            throw new IOException("Stream closed");
        return buffer;
    }

    /**
     * Creates a <code>BufferedInputStream</code>
     * and saves its  argument, the input stream
     * <code>in</code>, for later use. An internal
     * buffer array is created and  stored in <code>buf</code>.
     *
     * @param   in   the underlying input stream.
     */
    public BufferedInputStream(InputStream in) {
        this(in, DEFAULT_BUFFER_SIZE);
    }

    /**
     * Creates a <code>BufferedInputStream</code>
     * with the specified buffer size,
     * and saves its  argument, the input stream
     * <code>in</code>, for later use.  An internal
     * buffer array of length  <code>size</code>
     * is created and stored in <code>buf</code>.
     *
     * @param   in     the underlying input stream.
     * @param   size   the buffer size.
     * @exception IllegalArgumentException if {@code size <= 0}.
     */
    public BufferedInputStream(InputStream in, int size) {
        super(in);
        if (size <= 0) {
            throw new IllegalArgumentException("Buffer size <= 0");
        }
        buf = new byte[size];
    }

    /**
     * Fills the buffer with more data, taking into account
     * shuffling and other tricks for dealing with marks.
     * Assumes that it is being called by a synchronized method.
     * This method also assumes that all data has already been read in,
     * hence pos > count.
     */
    private void fill() throws IOException {
        byte[] buffer = getBufIfOpen();
        if (markpos < 0)
            pos = 0;            /* no mark: throw away the buffer */
        else if (pos >= buffer.length)  /* no room left in buffer */
            if (markpos > 0) {  /* can throw away early part of the buffer */
                int sz = pos - markpos;
                System.arraycopy(buffer, markpos, buffer, 0, sz);
                pos = sz;
                markpos = 0;
            } else if (buffer.length >= marklimit) {
                markpos = -1;   /* buffer got too big, invalidate mark */
                pos = 0;        /* drop buffer contents */
            } else if (buffer.length >= MAX_BUFFER_SIZE) {
                throw new OutOfMemoryError("Required array size too large");
            } else {            /* grow buffer */
                int nsz = (pos <= MAX_BUFFER_SIZE - pos) ?
                        pos * 2 : MAX_BUFFER_SIZE;
                if (nsz > marklimit)
                    nsz = marklimit;
                byte[] nbuf = new byte[nsz];
                System.arraycopy(buffer, 0, nbuf, 0, pos);
                if (!U.compareAndSetObject(this, BUF_OFFSET, buffer, nbuf)) {
                    // Can't replace buf if there was an async close.
                    // Note: This would need to be changed if fill()
                    // is ever made accessible to multiple threads.
                    // But for now, the only way CAS can fail is via close.
                    // assert buf == null;
                    throw new IOException("Stream closed");
                }
                buffer = nbuf;
            }
        count = pos;
        int n = getInIfOpen().read(buffer, pos, buffer.length - pos);
        if (n > 0)
            count = n + pos;
    }

    /**
     * See
     * the general contract of the <code>read</code>
     * method of <code>InputStream</code>.
     *
     * @return     the next byte of data, or <code>-1</code> if the end of the
     *             stream is reached.
     * @exception  IOException  if this input stream has been closed by
     *                          invoking its {@link #close()} method,
     *                          or an I/O error occurs.
     * @see        java.io.FilterInputStream#in
     */
    public synchronized int read() throws IOException {
        if (pos >= count) {
            fill();
            if (pos >= count)
                return -1;
        }
        return getBufIfOpen()[pos++] & 0xff;
    }

    /**
     * Read characters into a portion of an array, reading from the underlying
     * stream at most once if necessary.
     */
    private int read1(byte[] b, int off, int len) throws IOException {
        int avail = count - pos;
        if (avail <= 0) {
            /* If the requested length is at least as large as the buffer, and
               if there is no mark/reset activity, do not bother to copy the
               bytes into the local buffer.  In this way buffered streams will
               cascade harmlessly. */
            if (len >= getBufIfOpen().length && markpos < 0) {
                return getInIfOpen().read(b, off, len);
            }
            fill();
            avail = count - pos;
            if (avail <= 0) return -1;
        }
        int cnt = (avail < len) ? avail : len;
        System.arraycopy(getBufIfOpen(), pos, b, off, cnt);
        pos += cnt;
        return cnt;
    }

    /**
     * Reads bytes from this byte-input stream into the specified byte array,
     * starting at the given offset.
     *
     * <p> This method implements the general contract of the corresponding
     * <code>{@link InputStream#read(byte[], int, int) read}</code> method of
     * the <code>{@link InputStream}</code> class.  As an additional
     * convenience, it attempts to read as many bytes as possible by repeatedly
     * invoking the <code>read</code> method of the underlying stream.  This
     * iterated <code>read</code> continues until one of the following
     * conditions becomes true: <ul>
     *
     *   <li> The specified number of bytes have been read,
     *
     *   <li> The <code>read</code> method of the underlying stream returns
     *   <code>-1</code>, indicating end-of-file, or
     *
     *   <li> The <code>available</code> method of the underlying stream
     *   returns zero, indicating that further input requests would block.
     *
     * </ul> If the first <code>read</code> on the underlying stream returns
     * <code>-1</code> to indicate end-of-file then this method returns
     * <code>-1</code>.  Otherwise this method returns the number of bytes
     * actually read.
     *
     * <p> Subclasses of this class are encouraged, but not required, to
     * attempt to read as many bytes as possible in the same fashion.
     *
     * @param      b     destination buffer.
     * @param      off   offset at which to start storing bytes.
     * @param      len   maximum number of bytes to read.
     * @return     the number of bytes read, or <code>-1</code> if the end of
     *             the stream has been reached.
     * @exception  IOException  if this input stream has been closed by
     *                          invoking its {@link #close()} method,
     *                          or an I/O error occurs.
     */
    public synchronized int read(byte b[], int off, int len)
        throws IOException
    {
        getBufIfOpen(); // Check for closed stream
        if ((off | len | (off + len) | (b.length - (off + len))) < 0) {
            throw new IndexOutOfBoundsException();
        } else if (len == 0) {
            return 0;
        }

        int n = 0;
        for (;;) {
            int nread = read1(b, off + n, len - n);
            if (nread <= 0)
                return (n == 0) ? nread : n;
            n += nread;
            if (n >= len)
                return n;
            // if not closed but no bytes available, return
            InputStream input = in;
            if (input != null && input.available() <= 0)
                return n;
        }
    }

    /**
     * See the general contract of the <code>skip</code>
     * method of <code>InputStream</code>.
     *
     * @throws IOException  if this input stream has been closed by
     *                      invoking its {@link #close()} method,
     *                      {@code in.skip(n)} throws an IOException,
     *                      or an I/O error occurs.
     */
    public synchronized long skip(long n) throws IOException {
        getBufIfOpen(); // Check for closed stream
        if (n <= 0) {
            return 0;
        }
        long avail = count - pos;

        if (avail <= 0) {
            // If no mark position set then don't keep in buffer
            if (markpos <0)
                return getInIfOpen().skip(n);

            // Fill in buffer to save bytes for reset
            fill();
            avail = count - pos;
            if (avail <= 0)
                return 0;
        }

        long skipped = (avail < n) ? avail : n;
        pos += skipped;
        return skipped;
    }

    /**
     * Returns an estimate of the number of bytes that can be read (or
     * skipped over) from this input stream without blocking by the next
     * invocation of a method for this input stream. The next invocation might be
     * the same thread or another thread.  A single read or skip of this
     * many bytes will not block, but may read or skip fewer bytes.
     * <p>
     * This method returns the sum of the number of bytes remaining to be read in
     * the buffer (<code>count&nbsp;- pos</code>) and the result of calling the
     * {@link java.io.FilterInputStream#in in}.available().
     *
     * @return     an estimate of the number of bytes that can be read (or skipped
     *             over) from this input stream without blocking.
     * @exception  IOException  if this input stream has been closed by
     *                          invoking its {@link #close()} method,
     *                          or an I/O error occurs.
     */
    public synchronized int available() throws IOException {
        int n = count - pos;
        int avail = getInIfOpen().available();
        return n > (Integer.MAX_VALUE - avail)
                    ? Integer.MAX_VALUE
                    : n + avail;
    }

    /**
     * See the general contract of the <code>mark</code>
     * method of <code>InputStream</code>.
     *
     * @param   readlimit   the maximum limit of bytes that can be read before
     *                      the mark position becomes invalid.
     * @see     java.io.BufferedInputStream#reset()
     */
    public synchronized void mark(int readlimit) {
        marklimit = readlimit;
        markpos = pos;
    }

    /**
     * See the general contract of the <code>reset</code>
     * method of <code>InputStream</code>.
     * <p>
     * If <code>markpos</code> is <code>-1</code>
     * (no mark has been set or the mark has been
     * invalidated), an <code>IOException</code>
     * is thrown. Otherwise, <code>pos</code> is
     * set equal to <code>markpos</code>.
     *
     * @exception  IOException  if this stream has not been marked or,
     *                  if the mark has been invalidated, or the stream
     *                  has been closed by invoking its {@link #close()}
     *                  method, or an I/O error occurs.
     * @see        java.io.BufferedInputStream#mark(int)
     */
    public synchronized void reset() throws IOException {
        getBufIfOpen(); // Cause exception if closed
        if (markpos < 0)
            throw new IOException("Resetting to invalid mark");
        pos = markpos;
    }

    /**
     * Tests if this input stream supports the <code>mark</code>
     * and <code>reset</code> methods. The <code>markSupported</code>
     * method of <code>BufferedInputStream</code> returns
     * <code>true</code>.
     *
     * @return  a <code>boolean</code> indicating if this stream type supports
     *          the <code>mark</code> and <code>reset</code> methods.
     * @see     java.io.InputStream#mark(int)
     * @see     java.io.InputStream#reset()
     */
    public boolean markSupported() {
        return true;
    }

    /**
     * Closes this input stream and releases any system resources
     * associated with the stream.
     * Once the stream has been closed, further read(), available(), reset(),
     * or skip() invocations will throw an IOException.
     * Closing a previously closed stream has no effect.
     *
     * @exception  IOException  if an I/O error occurs.
     */
    public void close() throws IOException {
        byte[] buffer;
        while ( (buffer = buf) != null) {
            if (U.compareAndSetObject(this, BUF_OFFSET, buffer, null)) {
                InputStream input = in;
                in = null;
                if (input != null)
                    input.close();
                return;
            }
            // Else retry in case a new buf was CASed in fill()
        }
    }
}

```

说明：
要想读懂`BufferedInputStream`的源码，就要先理解它的思想。`BufferedInputStream`的作用是为其它输入流提供缓冲功能。创建`BufferedInputStream`时，我们会通过它的构造函数指定某个输入流为参数。`BufferedInputStream`会将该输入流数据分批读取，每次读取一部分到缓冲中；操作完缓冲中的这部分数据之后，再从输入流中读取下一部分的数据。

为什么需要缓冲呢？原因很简单，效率问题！缓冲中的数据实际上是保存在内存中，而原始数据可能是保存在硬盘或`NandFlash`等存储介质中；而我们知道，从内存中读取数据的速度比从硬盘读取数据的速度至少快10倍以上。
那干嘛不干脆一次性将全部数据都读取到缓冲中呢？第一，读取全部的数据所需要的时间可能会很长。第二，内存价格很贵，容量不像硬盘那么大。

下面，是`BufferedInputStream`中最重要的函数`fill()`进行说明。`fill()`源码如下：

````java
private void fill() throws IOException {
    byte[] buffer = getBufIfOpen();
    if (markpos < 0)
        pos = 0;            /* no mark: throw away the buffer */
    else if (pos >= buffer.length)  /* no room left in buffer */
        if (markpos > 0) {  /* can throw away early part of the buffer */
            int sz = pos - markpos;
            System.arraycopy(buffer, markpos, buffer, 0, sz);
            pos = sz;
            markpos = 0;
        } else if (buffer.length >= marklimit) {
            markpos = -1;   /* buffer got too big, invalidate mark */
            pos = 0;        /* drop buffer contents */
        } else if (buffer.length >= MAX_BUFFER_SIZE) {
            throw new OutOfMemoryError("Required array size too large");
        } else {            /* grow buffer */
            int nsz = (pos <= MAX_BUFFER_SIZE - pos) ?
                   pos * 2 : MAX_BUFFER_SIZE;
            if (nsz > marklimit)
               nsz = marklimit;
            byte[] nbuf = new byte[nsz];
            System.arraycopy(buffer, 0, nbuf, 0, pos);
            if (!U.compareAndSetObject(this, BUF_OFFSET, buffer, nbuf)) {
                // Can't replace buf if there was an async close.
                // Note: This would need to be changed if fill()
                // is ever made accessible to multiple threads.
                // But for now, the only way CAS can fail is via close.
                // assert buf == null;
                throw new IOException("Stream closed");
            }
            buffer = nbuf;
        }
    count = pos;
    int n = getInIfOpen().read(buffer, pos, buffer.length - pos);
    if (n > 0)
       count = n + pos;
}
````

根据`fill()`中的`if...else...`，下面我们将`fill`分为5种情况进行说明。

## 1. 读取完 buffer 中的数据，并且 buffer 没有被标记

执行流程如下：

1. `read()`函数中调用`fill()`
2. `fill()`中的`if (markpos < 0) ...`

为了方便分析，我们将这种情况下`fill()`执行的操作等价于以下代码：

```java
private void fill() throws IOException {
    byte[] buffer = getBufIfOpen();
    if (markpos < 0)
        pos = 0;

    count = pos;
    int n = getInIfOpen().read(buffer, pos, buffer.length - pos);
    if (n > 0)
        count = n + pos;
}
```

说明：
这种情况发生的情况是 —— 输入流中有很长的数据，我们每次从中读取一部分数据到`buffer`中进行操作。每次当我们读取完`buffer`中的数据之后，并且此时输入流没有被标记；那么，就接着从输入流中读取下一部分的数据到`buffer`中。

> 判断是否读完`buffer`中的数据，是通过`if (pos >= count)`来判断的；
> 判断输入流有没有被标记，是通过`if (markpos < 0)`来判断的。

理解这个思想之后，我们再对这种情况下的`fill()`的代码进行分析，就特别容易理解了。

- `if (markpos < 0)`它的作用是判断输入流是否被标记。若被标记，则`markpos`大于/等于0；否则`markpos`等于`-1`。
- 在这种情况下：通过`getInIfOpen()`获取输入流，然后接着从输入流中读取`buffer.length`个字节到`buffer`中。
- `count = n + pos`，这是根据从输入流中读取的实际数据的多少，来更新`buffer`中数据的实际大小。

## 2. 读取完 buffer 中的数据，buffer 的标记位置>0，并且 buffer 中没有多余的空间

执行流程如下：

1. `read()`函数中调用`fill()``
2. `fill()`中的`else if (pos >= buffer.length) ...`
3. `fill()`中的`if (markpos > 0) ...`

为了方便分析，我们将这种情况下fill()执行的操作等价于以下代码：

```java
private void fill() throws IOException {
    byte[] buffer = getBufIfOpen();
    if (markpos >= 0 && pos >= buffer.length) {
        if (markpos > 0) {
            int sz = pos - markpos;
            System.arraycopy(buffer, markpos, buffer, 0, sz);
            pos = sz;
            markpos = 0;
        }
    }

    count = pos;
    int n = getInIfOpen().read(buffer, pos, buffer.length - pos);
    if (n > 0)
        count = n + pos;
}
```

说明：
这种情况发生的情况是 —— 输入流中有很长的数据，我们每次从中读取一部分数据到`buffer`中进行操作。当我们读取完`buffer`中的数据之后，并且此时输入流存在标记时；那么，就发生情况2。此时，我们要保留被标记位置到`buffer`末尾的数据，然后再从输入流中读取下一部分的数据到`buffer`中。

> 其中，判断是否读完`buffer`中的数据，是通过`if (pos >= count)`来判断的；
> 判断输入流有没有被标记，是通过`if (markpos < 0)`来判断的。
> 判断`buffer`中没有多余的空间，是通过`if (pos >= buffer.length)`来判断的。

理解这个思想之后，我们再对这种情况下的`fill()`代码进行分析，就特别容易理解了。

-  `int sz = pos - markpos`; 作用是获取被标记位置到`buffer`末尾的数据长度。
- `System.arraycopy(buffer, markpos, buffer, 0, sz)`; 作用是将`buffer`中从`markpos`开始的数据拷贝到`buffer`中(从位置0开始填充，填充长度是`sz`)。接着，将`sz`赋值给`pos`，即`pos`就是被标记位置到`buffer`末尾的数据长度。
- `int n = getInIfOpen().read(buffer, pos, buffer.length - pos)`; 从输入流中读取出`buffer.length - pos`的数据，然后填充到`buffer`中。
- 通过第2和第3步组合起来的`buffer`，就是包含了原始`buffer`被标记位置到`buffer`末尾的数据，也包含了从输入流中新读取的数据。

注意：**执行过情况2之后，`markpos`的值由大于0变成了等于0！**

## 3. 读取完 buffer 中的数据，buffer 被标记位置=0，buffer 中没有多余的空间，并且 buffer.length>=marklimit

执行流程如下：

- `read()`函数中调用`fill()`
- `fill()`中的`else if (pos >= buffer.length) ...`
- `fill()`中的`else if (buffer.length >= marklimit) ...`

为了方便分析，我们将这种情况下`fill()`执行的操作等价于以下代码：

```java
private void fill() throws IOException {
    byte[] buffer = getBufIfOpen();
    if (markpos >= 0 && pos >= buffer.length) {
        if ( (markpos <= 0) && (buffer.length >= marklimit) ) {
            markpos = -1;   /* buffer got too big, invalidate mark */
            pos = 0;        /* drop buffer contents */
        }
    }

    count = pos;
    int n = getInIfOpen().read(buffer, pos, buffer.length - pos);
    if (n > 0)
        count = n + pos;
}
```

说明：这种情况的处理非常简单。首先，就是取消标记，即`markpos = -1`；然后，设置初始化位置为0，即`pos=0`；最后，再从输入流中读取下一部分数据到`buffer`中。

## 4. 读取完 buffer 中的数据，buffer 被标记位置=0，buffer 中没有多余的空间，并且 buffer.length<marklimit

执行流程如下：

- `read()`函数中调用`fill()`
- `fill()`中的`else if (pos >= buffer.length) ...`
- `fill()`中的`else { int nsz = pos * 2; ... }`

为了方便分析，我们将这种情况下`fill()`执行的操作等价于以下代码：

```java
private void fill() throws IOException {
    byte[] buffer = getBufIfOpen();
    if (markpos >= 0 && pos >= buffer.length) {
        if ( (markpos <= 0) && (buffer.length < marklimit) ) {
            int nsz = pos * 2;
            if (nsz > marklimit)
                nsz = marklimit;
            byte nbuf[] = new byte[nsz];
            System.arraycopy(buffer, 0, nbuf, 0, pos);
            if (!bufUpdater.compareAndSet(this, buffer, nbuf)) {
                throw new IOException("Stream closed");
            }
            buffer = nbuf;
        }
    }

    count = pos;
    int n = getInIfOpen().read(buffer, pos, buffer.length - pos);
    if (n > 0)
        count = n + pos;
}
```

说明：
这种情况的处理非常简单。

- 新建一个字节数组`nbuf`。`nbuf`的大小是`pos*2`和`marklimit`中较小的那个数。

```java
int nsz = pos * 2;
if (nsz > marklimit)
    nsz = marklimit;
byte nbuf[] = new byte[nsz];
```

- 接着，将`buffer`中的数据拷贝到新数组`nbuf`中。通过`System.arraycopy(buffer, 0, nbuf, 0, pos)`
- 最后，从输入流读取部分新数据到`buffer`中。通过`getInIfOpen().read(buffer, pos, buffer.length - pos)`；

注意：**在这里，思考一个问题，为什么需要`marklimit`，它的存在到底有什么意义？结合情况2、情况3、情况4的情况来分析。**

假设，`marklimit`是无限大的，而且我们设置了`markpos`。当我们从输入流中每读完一部分数据并读取下一部分数据时，都需要保存`markpos`所标记的数据；这就意味着，我们需要不断执行情况4中的操作，要将`buffer`的容量扩大……随着读取次数的增多，`buffer`会越来越大；这会导致我们占据的内存越来越大。所以，我们需要给出一个`marklimit`；当`buffer>=marklimit`时，就不再保存`markpos`的值了。

## 5. 除了上面4种情况之外的情况

执行流程如下，

1. ` read()`函数中调用`fill()`
2. `fill()`中的`count = pos...`

为了方便分析，我们将这种情况下fill()执行的操作等价于以下代码：

```java
private void fill() throws IOException {
    byte[] buffer = getBufIfOpen();

    count = pos;
    int n = getInIfOpen().read(buffer, pos, buffer.length - pos);
    if (n > 0)
        count = n + pos;
}
```

说明：这种情况的处理非常简单。直接从输入流读取部分新数据到`buffer`中。