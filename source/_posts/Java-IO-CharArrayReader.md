---
title: Java IO之 CharArrayReader详解
tags: Java-IO
categories: Java
date: 2020-07-22 22:22:28



---

-

<!--more-->

# CharArrayReader 简介

`CharArrayReader`是字符数组输入流。它和`ByteArrayInputStream`类似，只不过`ByteArrayInputStream`是字节数组输入流，而`CharArray`是字符数组输入流。`CharArrayReader`是用于读取字符数组，它继承于`Reader`。操作的数据是以字符为单位。

## CharArrayReader 函数列表

```java
// 构造函数
public CharArrayReader(char buf[])
public CharArrayReader(char buf[], int offset, int length)
// 常用方法
int      read()
int      read(char b[], int off, int len)
long     skip(long n)
boolean  ready()
boolean  markSupport()
void     mark(int readAheadLimit)
void     reset()
void     close()
```



说明：`CharArrayReader`实际上是通过字符数组去保存数据。

- 通过`CharArrayReader(char[] buf)`或`CharArrayReader(char[] buf, int offset, int length)`，我们可以根据`buf`数组来创建`CharArrayReader`对象
- `read()`的作用是从`CharArrayReader`中读取下一个字符。
- `read(char[] b, int offset, int len)`的作用是从`CharArrayReader`读取字符数据，并写入到字符数组`b`中。`off`是将字符写入到`b`的起始位置，`len`是写入的字符的长度。
- `markSupported()`是判断`CharArrayReader`是否支持标记功能。它始终返回`true`。
- `mark(int readlimit)`的作用是记录标记位置。记录标记位置之后，某一时刻调用`reset()`则将`CharArrayReader`下一个被读取的位置重置到`mark(int readlimit)`所标记的位置；也就是说，`reset()`之后再读取`CharArrayReader`时，是从`mark(int readlimit)`所标记的位置开始读取。

# 示例

```java
import java.io.CharArrayReader;
import java.io.CharArrayWriter;
import java.io.IOException;

public class CharArrayReaderTest {

    private static final int LEN = 5;
    private static final char[] ArrayLetters = new char[] {'a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z'};

    public static void main(String[] args) {
        tesCharArrayReader() ;
    }


    private static void tesCharArrayReader() {
        try {
            // 创建CharArrayReader字符流，内容是ArrayLetters数组
            CharArrayReader car = new CharArrayReader(ArrayLetters);

            for (int i=0; i<LEN; i++) {
                // 若能继续读取下一个字符，则读取下一个字符
                if (car.ready() == true) {
                    // 读取字符流的下一个字符
                    char tmp = (char)car.read();
                    System.out.printf("%d : %c\n", i, tmp);
                }
            }

            // 若该字符流不支持标记功能，则直接退出
            if (!car.markSupported()) {
                System.out.println("make not supported!");
                return ;
            }

            // 标记字符流中下一个被读取的位置。即--标记f，因为因为前面已经读取了5个字符，所以下一个被读取的位置是第6个字符
            // 01   CharArrayReader类的mark(0)函数中的参数0是没有实际意义的。
            // 02   mark()与reset()是配套的，reset()会将字符流中下一个被读取的位置重置为mark()中所保存的位置
            car.mark(0);

            // 跳过5个字符。跳过5个字符后，字符流中下一个被读取的值应该是k。
            car.skip(5);

            // 从字符流中读取5个数据。即读取klmno
            char[] buf = new char[LEN];
            car.read(buf, 0, LEN);
            System.out.printf("buf=%s\n", String.valueOf(buf));

            // 重置字符流：即，将字符流中下一个被读取的位置重置到mark()所标记的位置，即f。
            car.reset();
            // 从重置后的字符流中读取5个字符到buf中。即读取fghij
            car.read(buf, 0, LEN);
            System.out.printf("buf=%s\n", String.valueOf(buf));
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}
```

运行结果：

```
0 : a
1 : b
2 : c
3 : d
4 : e
buf=klmno
buf=fghij
```

# CharArrayReader 源码

## Reader 源码

```java
package java.io;

public abstract class Reader implements Readable, Closeable {

   
    protected Object lock;


    protected Reader() {
        this.lock = this;
    }

    
    protected Reader(Object lock) {
        if (lock == null) {
            throw new NullPointerException();
        }
        this.lock = lock;
    }

    
    public int read(java.nio.CharBuffer target) throws IOException {
        int len = target.remaining();
        char[] cbuf = new char[len];
        int n = read(cbuf, 0, len);
        if (n > 0)
            target.put(cbuf, 0, n);
        return n;
    }

    
    public int read() throws IOException {
        char cb[] = new char[1];
        if (read(cb, 0, 1) == -1)
            return -1;
        else
            return cb[0];
    }

    
    public int read(char cbuf[]) throws IOException {
        return read(cbuf, 0, cbuf.length);
    }

    
    abstract public int read(char cbuf[], int off, int len) throws IOException;

    /** Maximum skip-buffer size */
    private static final int maxSkipBufferSize = 8192;

    /** Skip buffer, null until allocated */
    private char skipBuffer[] = null;

    
    public long skip(long n) throws IOException {
        if (n < 0L)
            throw new IllegalArgumentException("skip value is negative");
        int nn = (int) Math.min(n, maxSkipBufferSize);
        synchronized (lock) {
            if ((skipBuffer == null) || (skipBuffer.length < nn))
                skipBuffer = new char[nn];
            long r = n;
            while (r > 0) {
                int nc = read(skipBuffer, 0, (int)Math.min(r, nn));
                if (nc == -1)
                    break;
                r -= nc;
            }
            return n - r;
        }
    }

    
    public boolean ready() throws IOException {
        return false;
    }

    
    public boolean markSupported() {
        return false;
    }

    
    public void mark(int readAheadLimit) throws IOException {
        throw new IOException("mark() not supported");
    }

    
    public void reset() throws IOException {
        throw new IOException("reset() not supported");
    }

     abstract public void close() throws IOException;

}
```



## CharArrayReader

```java
package java.io;

public class CharArrayReader extends Reader {
    
    protected char buf[];

    /** The current buffer position. */
    protected int pos;

    protected int markedPos = 0;

    
    protected int count;

    public CharArrayReader(char buf[]) {
        this.buf = buf;
        this.pos = 0;
        this.count = buf.length;
    }

    public CharArrayReader(char buf[], int offset, int length) {
        if ((offset < 0) || (offset > buf.length) || (length < 0) ||
            ((offset + length) < 0)) {
            throw new IllegalArgumentException();
        }
        this.buf = buf;
        this.pos = offset;
        this.count = Math.min(offset + length, buf.length);
        this.markedPos = offset;
    }

    private void ensureOpen() throws IOException {
        if (buf == null)
            throw new IOException("Stream closed");
    }

    public int read() throws IOException {
        synchronized (lock) {
            ensureOpen();
            if (pos >= count)
                return -1;
            else
                return buf[pos++];
        }
    }

    public int read(char b[], int off, int len) throws IOException {
        synchronized (lock) {
            ensureOpen();
            if ((off < 0) || (off > b.length) || (len < 0) ||
                ((off + len) > b.length) || ((off + len) < 0)) {
                throw new IndexOutOfBoundsException();
            } else if (len == 0) {
                return 0;
            }

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
    }

    public long skip(long n) throws IOException {
        synchronized (lock) {
            ensureOpen();

            long avail = count - pos;
            if (n > avail) {
                n = avail;
            }
            if (n < 0) {
                return 0;
            }
            pos += n;
            return n;
        }
    }
    
    public boolean ready() throws IOException {
        synchronized (lock) {
            ensureOpen();
            return (count - pos) > 0;
        }
    }

    public boolean markSupported() {
        return true;
    }

    public void mark(int readAheadLimit) throws IOException {
        synchronized (lock) {
            ensureOpen();
            markedPos = pos;
        }
    }

    public void reset() throws IOException {
        synchronized (lock) {
            ensureOpen();
            pos = markedPos;
        }
    }

    public void close() {
        buf = null;
    }
}
```