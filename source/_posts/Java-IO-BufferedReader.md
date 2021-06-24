---
title: Java IO之 BufferedReader详解
tags: Java-IO
categories: Java
date: 2020-07-23 19:52:28



---

-

<!--more-->

# BufferedReader 简介

`BufferedReader`是缓冲字符输入流。它继承于`Reader`。

`BufferedReader`的作用是为其他字符输入流添加一些缓冲功能。

## 函数列表

```java
// 构造函数
BufferedReader(Reader in, int se)
BufferedReader(Reader in)
// 常用方法
int             read()
int             read(char cbuf[], int off, int len)
String          readLine(boolean ignoreLF)
String          readLine()
long            skip(long n)
boolean         ready()
boolean         markSupported()
void            mark(int readAheadLimit)
void            rest()
void            close()
Stream<String>  lines()
```

# 示例

```java
import java.io.BufferedReader;
import java.io.ByteArrayInputStream;
import java.io.File;
import java.io.InputStream;
import java.io.FileReader;
import java.io.IOException;
import java.io.FileNotFoundException;
import java.lang.SecurityException;

public class BufferedReaderTest {

    private static final int LEN = 5;

    public static void main(String[] args) {
        testBufferedReader() ;
    }


    private static void testBufferedReader() {

        try {
            File file = new File("bufferedreader.txt");
            BufferedReader in =new BufferedReader(new FileReader(file));

            // 从字符流中读取5个字符。abcde
            for (int i=0; i<LEN; i++) {
                if (in.ready()) {
                    int tmp = in.read();
                    System.out.printf("%d : %c\n", i, tmp);
                }
            }

            // 若该字符流不支持标记功能，则直接退出
            if (!in.markSupported()) {
                System.out.println("make not supported!");
                return ;
            }

            // 标记当前索引位置，即标记第6个位置的元素--f
            // 1024对应marklimit
            in.mark(1024);

            // 跳过22个字符。
            in.skip(22);

            // 读取5个字符
            char[] buf = new char[LEN];
            in.read(buf, 0, LEN);
            System.out.printf("buf=%s\n", String.valueOf(buf));
            // 读取该行剩余的数据
            System.out.printf("readLine=%s\n", in.readLine());

            in.reset();
            in.read(buf, 0, LEN);
            System.out.printf("buf=%s\n", String.valueOf(buf));

            in.close();
       } catch (FileNotFoundException e) {
           e.printStackTrace();
       } catch (SecurityException e) {
           e.printStackTrace();
       } catch (IOException e) {
           e.printStackTrace();
       }
    }
```



# BufferedReader 源码

```java
package java.io;

import java.util.Iterator;
import java.util.NoSuchElementException;
import java.util.Spliterator;
import java.util.Spliterators;
import java.util.stream.Stream;
import java.util.stream.StreamSupport;


public class BufferedReader extends Reader {

    private Reader in;

    private char cb[];
    private int nChars, nextChar;

    private static final int INVALIDATED = -2;
    private static final int UNMARKED = -1;
    private int markedChar = UNMARKED;
    private int readAheadLimit = 0; /* Valid only when markedChar > 0 */

    /** If the next character is a line feed, skip it */
    private boolean skipLF = false;

    /** The skipLF flag when the mark was set */
    private boolean markedSkipLF = false;

    private static int defaultCharBufferSize = 8192;
    private static int defaultExpectedLineLength = 80;

    public BufferedReader(Reader in, int sz) {
        super(in);
        if (sz <= 0)
            throw new IllegalArgumentException("Buffer size <= 0");
        this.in = in;
        cb = new char[sz];
        nextChar = nChars = 0;
    }

  
    public BufferedReader(Reader in) {
        this(in, defaultCharBufferSize);
    }

    /** Checks to make sure that the stream has not been closed */
    private void ensureOpen() throws IOException {
        if (in == null)
            throw new IOException("Stream closed");
    }

    private void fill() throws IOException {
        int dst;
        if (markedChar <= UNMARKED) {
            /* No mark */
            dst = 0;
        } else {
            /* Marked */
            int delta = nextChar - markedChar;
            if (delta >= readAheadLimit) {
                /* Gone past read-ahead limit: Invalidate mark */
                markedChar = INVALIDATED;
                readAheadLimit = 0;
                dst = 0;
            } else {
                if (readAheadLimit <= cb.length) {
                    /* Shuffle in the current buffer */
                    System.arraycopy(cb, markedChar, cb, 0, delta);
                    markedChar = 0;
                    dst = delta;
                } else {
                    /* Reallocate buffer to accommodate read-ahead limit */
                    char ncb[] = new char[readAheadLimit];
                    System.arraycopy(cb, markedChar, ncb, 0, delta);
                    cb = ncb;
                    markedChar = 0;
                    dst = delta;
                }
                nextChar = nChars = delta;
            }
        }

        int n;
        do {
            n = in.read(cb, dst, cb.length - dst);
        } while (n == 0);
        if (n > 0) {
            nChars = dst + n;
            nextChar = dst;
        }
    }

    public int read() throws IOException {
        synchronized (lock) {
            ensureOpen();
            for (;;) {
                if (nextChar >= nChars) {
                    fill();
                    if (nextChar >= nChars)
                        return -1;
                }
                if (skipLF) {
                    skipLF = false;
                    if (cb[nextChar] == '\n') {
                        nextChar++;
                        continue;
                    }
                }
                return cb[nextChar++];
            }
        }
    }

    private int read1(char[] cbuf, int off, int len) throws IOException {
        if (nextChar >= nChars) {
            if (len >= cb.length && markedChar <= UNMARKED && !skipLF) {
                return in.read(cbuf, off, len);
            }
            fill();
        }
        if (nextChar >= nChars) return -1;
        if (skipLF) {
            skipLF = false;
            if (cb[nextChar] == '\n') {
                nextChar++;
                if (nextChar >= nChars)
                    fill();
                if (nextChar >= nChars)
                    return -1;
            }
        }
        int n = Math.min(len, nChars - nextChar);
        System.arraycopy(cb, nextChar, cbuf, off, n);
        nextChar += n;
        return n;
    }

    public int read(char cbuf[], int off, int len) throws IOException {
        synchronized (lock) {
            ensureOpen();
            if ((off < 0) || (off > cbuf.length) || (len < 0) ||
                ((off + len) > cbuf.length) || ((off + len) < 0)) {
                throw new IndexOutOfBoundsException();
            } else if (len == 0) {
                return 0;
            }

            int n = read1(cbuf, off, len);
            if (n <= 0) return n;
            while ((n < len) && in.ready()) {
                int n1 = read1(cbuf, off + n, len - n);
                if (n1 <= 0) break;
                n += n1;
            }
            return n;
        }
    }


    String readLine(boolean ignoreLF) throws IOException {
        StringBuilder s = null;
        int startChar;

        synchronized (lock) {
            ensureOpen();
            boolean omitLF = ignoreLF || skipLF;

        bufferLoop:
            for (;;) {

                if (nextChar >= nChars)
                    fill();
                if (nextChar >= nChars) { /* EOF */
                    if (s != null && s.length() > 0)
                        return s.toString();
                    else
                        return null;
                }
                boolean eol = false;
                char c = 0;
                int i;

                /* Skip a leftover '\n', if necessary */
                if (omitLF && (cb[nextChar] == '\n'))
                    nextChar++;
                skipLF = false;
                omitLF = false;

            charLoop:
                for (i = nextChar; i < nChars; i++) {
                    c = cb[i];
                    if ((c == '\n') || (c == '\r')) {
                        eol = true;
                        break charLoop;
                    }
                }

                startChar = nextChar;
                nextChar = i;

                if (eol) {
                    String str;
                    if (s == null) {
                        str = new String(cb, startChar, i - startChar);
                    } else {
                        s.append(cb, startChar, i - startChar);
                        str = s.toString();
                    }
                    nextChar++;
                    if (c == '\r') {
                        skipLF = true;
                    }
                    return str;
                }

                if (s == null)
                    s = new StringBuilder(defaultExpectedLineLength);
                s.append(cb, startChar, i - startChar);
            }
        }
    }

    public String readLine() throws IOException {
        return readLine(false);
    }

    public long skip(long n) throws IOException {
        if (n < 0L) {
            throw new IllegalArgumentException("skip value is negative");
        }
        synchronized (lock) {
            ensureOpen();
            long r = n;
            while (r > 0) {
                if (nextChar >= nChars)
                    fill();
                if (nextChar >= nChars) /* EOF */
                    break;
                if (skipLF) {
                    skipLF = false;
                    if (cb[nextChar] == '\n') {
                        nextChar++;
                    }
                }
                long d = nChars - nextChar;
                if (r <= d) {
                    nextChar += r;
                    r = 0;
                    break;
                }
                else {
                    r -= d;
                    nextChar = nChars;
                }
            }
            return n - r;
        }
    }


    public boolean ready() throws IOException {
        synchronized (lock) {
            ensureOpen();

         
            if (skipLF) {
                if (nextChar >= nChars && in.ready()) {
                    fill();
                }
                if (nextChar < nChars) {
                    if (cb[nextChar] == '\n')
                        nextChar++;
                    skipLF = false;
                }
            }
            return (nextChar < nChars) || in.ready();
        }
    }

    public boolean markSupported() {
        return true;
    }

    public void mark(int readAheadLimit) throws IOException {
        if (readAheadLimit < 0) {
            throw new IllegalArgumentException("Read-ahead limit < 0");
        }
        synchronized (lock) {
            ensureOpen();
            this.readAheadLimit = readAheadLimit;
            markedChar = nextChar;
            markedSkipLF = skipLF;
        }
    }

   
    public void reset() throws IOException {
        synchronized (lock) {
            ensureOpen();
            if (markedChar < 0)
                throw new IOException((markedChar == INVALIDATED)
                                      ? "Mark invalid"
                                      : "Stream not marked");
            nextChar = markedChar;
            skipLF = markedSkipLF;
        }
    }

    public void close() throws IOException {
        synchronized (lock) {
            if (in == null)
                return;
            try {
                in.close();
            } finally {
                in = null;
                cb = null;
            }
        }
    }

    
    public Stream<String> lines() {
        Iterator<String> iter = new Iterator<String>() {
            String nextLine = null;

            @Override
            public boolean hasNext() {
                if (nextLine != null) {
                    return true;
                } else {
                    try {
                        nextLine = readLine();
                        return (nextLine != null);
                    } catch (IOException e) {
                        throw new UncheckedIOException(e);
                    }
                }
            }

            @Override
            public String next() {
                if (nextLine != null || hasNext()) {
                    String line = nextLine;
                    nextLine = null;
                    return line;
                } else {
                    throw new NoSuchElementException();
                }
            }
        };
        return StreamSupport.stream(Spliterators.spliteratorUnknownSize(
                iter, Spliterator.ORDERED | Spliterator.NONNULL), false);
    }
}
```

说明： 

想读懂`BufferReader`的源码，就要先理解它的思想。`BufferReader`的作用是为其它`Reader`提供缓冲功能。创建`BufferReader`时，我们会通过它的构造函数指定某个`Reader`为参数。`BufferReader`会将该`Reader`中的数据分批读取，每次读取一部分到缓冲中；操作完缓冲中的这部分数据之后，再从`Reader`中读取下一部分的数据。

为什么需要缓冲呢？原因很简单，效率问题！缓冲中的数据实际上是保存在内存中，而原始数据可能是保存在硬盘或`NandFlash`中；而我们知道，从内存中读取数据的速度比从硬盘读取数据的速度至少快10倍以上。那干嘛不干脆一次性将全部数据都读取到缓冲中呢？第一，读取全部的数据所需要的时间可能会很长。第二，内存价格很贵，容量不像硬盘那么大。

`BufferReader`中最重要的函数`fill()`的源码：

```java
private void fill() throws IOException {
    int dst;
    if (markedChar <= UNMARKED) {
        /* No mark */
        dst = 0;
    } else {
        /* Marked */
        int delta = nextChar - markedChar;
        if (delta >= readAheadLimit) {
            /* Gone past read-ahead limit: Invalidate mark */
            markedChar = INVALIDATED;
            readAheadLimit = 0;
            dst = 0;
        } else {
            if (readAheadLimit <= cb.length) {
                /* Shuffle in the current buffer */
                System.arraycopy(cb, markedChar, cb, 0, delta);
                markedChar = 0;
                dst = delta;
            } else {
                /* Reallocate buffer to accommodate read-ahead limit */
                char ncb[] = new char[readAheadLimit];
                System.arraycopy(cb, markedChar, ncb, 0, delta);
                cb = ncb;
                markedChar = 0;
                dst = delta;
            }
            nextChar = nChars = delta;
        }
    }

    int n;
    do {
        n = in.read(cb, dst, cb.length - dst);
    } while (n == 0);
    if (n > 0) {
        nChars = dst + n;
        nextChar = dst;
    }
}
```

根据`fill()`中的`if...else...`，将`fill()`分为4种情况进行说明。

**情况1**：读取完缓冲区的数据，并且缓冲区没有被标记

执行流程如下，

1. 其它函数调用`fill()`，来更新缓冲区的数据
2. `fill()`执行代码`if (markedChar <= UNMARKED) { ... }`

为了方便分析，我们将这种情况下`fill()`执行的操作等价于以下代码：

```java
private void fill() throws IOException {
    int dst;
    if (markedChar <= UNMARKED) {
        /* No mark */
        dst = 0;
    } 

    int n;
    do {
        n = in.read(cb, dst, cb.length - dst);
    } while (n == 0);

    if (n > 0) {
        nChars = dst + n;
        nextChar = dst;
    }
}
```

说明：

这种情况发生的情况是： `Reader`中有很长的数据，我们每次从中读取一部分数据到缓冲中进行操作。每次当我们读取完缓冲中的数据之后，并且此时`BufferedReader`没有被标记；那么，就接着从`Reader`中读取下一部分的数据到缓冲中。

其中，判断是否读完缓冲区中的数据，是通过比较`nextChar`和`nChars`之间大小来判断的。其中，`nChars`是缓冲区中字符的总的个数，而`nextChar`是缓冲区中下一个要读取的字符的位置。

判断`BufferedReader`有没有被标记，是通过`markedChar`来判断的。
理解这个思想之后，再对这种情况下的`fill()`的代码进行分析，就特别容易理解了。

1. `if (markedChar <= UNMARKED)`它的作用是判断`BufferedReader`是否被标记。若被标记，则`dst=0`。
2. `in.read(cb, dst, cb.length - dst)`等价于`in.read(cb, 0, cb.length)`，意思是从`Reader`对象`in`中读取`cb.length`个数据，并存储到缓冲区`cb`中，而且从缓冲区`cb`的位置0开始存储。该函数返回值等于n，也就是n表示实际读取的字符个数。若`n=0`(即没有读取到数据)，则继续读取，直到读到数据为止。
3. `nChars=dst+n`等价于`nChars=n`；意味着，更新缓冲区数据`cb`之后，设置`nChars`(缓冲区的数据个数)为n。
4. `nextChar=dst`等价于`nextChar=0`；意味着，更新缓冲区数据`cb`之后，设置`nextChar`(缓冲区中下一个会被读取的字符的索引值)为0。

**情况2**：读取完缓冲区的数据，缓冲区的标记位置>0，并且“当前标记的长度超过标记上限(readAheadLimit)

执行流程如下，

1. 其它函数调用`fill()`，来更新缓冲区的数据
2. `fill()`执行代码`if (delta >= readAheadLimit) { ... }`

为了方便分析，我们将这种情况下`fill()`执行的操作等价于以下代码：

```java
private void fill() throws IOException {
    int dst;
    if (markedChar > UNMARKED) {
        int delta = nextChar - markedChar;
        if (delta >= readAheadLimit) {
            markedChar = INVALIDATED;
            readAheadLimit = 0;
            dst = 0;
        } 
    }

    int n;
    do {
        n = in.read(cb, dst, cb.length - dst);
    } while (n == 0);
    if (n > 0) {
        nChars = dst + n;
        nextChar = dst;
    }
}
```

说明：
这种情况发生的情况是：`BufferedReader`中有很长的数据，我们每次从中读取一部分数据到缓冲区中进行操作。当我们读取完缓冲区中的数据之后，并且此时，`BufferedReader`存在标记时，同时，当前标记的长度大于标记上限；那么，就发生情况2。此时，我们会丢弃标记并更新缓冲区。

1. `delta = nextChar - markedChar`；其中，`delta`就是当前标记的长度，它是下一个被读取字符的位置减去被标记的位置的差值。

2. `if (delta >= readAheadLimit)`；其中，当`delta >= readAheadLimit`，就意味着，当前标记的长度 >= 标记上限。为什么要有标记上限，即`readAheadLimit`的值到底有何意义呢？

   我们标记一个位置之后，更新缓冲区的时候，被标记的位置会被保存；当我们不停的更新缓冲区的时候，被标记的位置会被不停的放大。然后内存的容量是有效的，我们不可能不限制长度的存储标记。所以，需要`readAheadLimit`来限制标记长度！

3. `in.read(cb, dst, cb.length - dst)`等价于`in.read(cb, 0, cb.length)`，意思是从`Reader`对象`in`中读取`cb.length`个数据，并存储到缓冲区`cb`中，而且从缓冲区`cb`的位置0开始存储。该函数返回值等于n，也就是n表示实际读取的字符个数。若n=0(即没有读取到数据)，则继续读取，直到读到数据为止。
4. `nChars=dst+n`等价于 `nChars=n`；意味着，更新缓冲区数据`cb`之后，设置`nChars`(缓冲区的数据个数)为n。
5. `nextChar=dst`等价于`nextChar=0`；意味着，更新缓冲区数据`cb`之后，设置`nextChar`(缓冲区中下一个会被读取的字符的索引值)为0。

**情况3**：读取完缓冲区的数据，缓冲区的标记位置>0，当前标记的长度没超过标记上限(readAheadLimit)，并且标记上限(readAheadLimit)小于/等于缓冲的长度；

执行流程如下，

1. 其它函数调用`fill()`，来更新缓冲区的数据
2. `fill()`执行代码`if (readAheadLimit <= cb.length) { ... }`

为了方便分析，我们将这种情况下`fill()`执行的操作等价于以下代码：

```java
private void fill() throws IOException {
    int dst;
    if (markedChar > UNMARKED) {
        int delta = nextChar - markedChar;
        if ((delta < readAheadLimit) &&  (readAheadLimit <= cb.length) ) {
            System.arraycopy(cb, markedChar, cb, 0, delta);
            markedChar = 0;
            dst = delta;

            nextChar = nChars = delta;
        }
    }

    int n;
    do {
        n = in.read(cb, dst, cb.length - dst);
    } while (n == 0);
    if (n > 0) {
        nChars = dst + n;
        nextChar = dst;
    }
}
```

说明：

这种情况发生的情况是 ：`BufferedReader`中有很长的数据，我们每次从中读取一部分数据到缓冲区中进行操作。当我们读取完缓冲区中的数据之后，并且此时，`BufferedReader`存在标记时，同时，当前标记的长度小于标记上限，并且标记上限小于/等于缓冲区长度；那么，就发生情况3。此时，我们保留被标记的位置(即，保留被标记位置开始的数据)，并更新缓冲区(将新增的数据，追加到保留的数据之后)。

**情况4**：读取完缓冲区的数据，缓冲区的标记位置>0，当前标记的长度没超过标记上限(readAheadLimit)，并且标记上限(readAheadLimit)大于缓冲的长度；

执行流程如下，

1. 其它函数调用`fill()`，来更新缓冲区的数据
2. `fill()`执行代码`else { char ncb[] = new char[readAheadLimit]; ... }`

为了方便分析，我们将这种情况下`fill()`执行的操作等价于以下代码：

```java
private void fill() throws IOException {
    int dst;
    if (markedChar > UNMARKED) {
        int delta = nextChar - markedChar;
        if ((delta < readAheadLimit) &&  (readAheadLimit > cb.length) ) {
            char ncb[] = new char[readAheadLimit];
            System.arraycopy(cb, markedChar, ncb, 0, delta);
            cb = ncb;
            markedChar = 0;
            dst = delta;

            nextChar = nChars = delta;
        }
    }

    int n;
    do {
        n = in.read(cb, dst, cb.length - dst);
    } while (n == 0);
    if (n > 0) {
        nChars = dst + n;
        nextChar = dst;
    }
}
```

说明：

这种情况发生的情况是：`BufferedReader`中有很长的数据，我们每次从中读取一部分数据到缓冲区中进行操作。当我们读取完缓冲区中的数据之后，并且此时，`BufferedReader`存在标记时，同时，当前标记的长度小于标记上限，并且标记上限大于缓冲区长度；那么，就发生情况4。此时，我们要先更新缓冲区的大小，然后再保留被标记的位置(即，保留被标记位置开始的数据)，并更新缓冲区数据(将新增的数据，追加到保留的数据之后)。