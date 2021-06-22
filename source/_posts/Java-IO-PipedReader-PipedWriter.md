---
title: Java IO之 PipedReader和PipedWriter详解
tags: Java-IO
categories: Java
date: 2020-07-24 22:02:28




---

-

<!--more-->

# PipedWriter 和 PipedReader 简介

`PipedWriter`是字符管道输出流，它继承于`Writer`。

`PipedReader`是字符管道输入流，它继承于`Reader`。

`PipedWriter`和`PipedReader`的作用是可以通过管道进行线程间的通讯。在使用管道通信时，必须将`PipedWriter`和`PipedReader`配套使用。

# 示例

下面，来多线程中通过`PipedWriter`和`PipedReader`通信的例子。例子中包括3个类：`Receiver`,、`Sender`和`PipeTest`

## PipeTest

```java
import java.io.PipedReader;
import java.io.PipedWriter;
import java.io.IOException;

@SuppressWarnings("all")   

public class PipeTest {   

    public static void main(String[] args) {   
        Sender t1 = new Sender();   
        Receiver t2 = new Receiver();   

        PipedWriter out = t1.getWriter();   
        PipedReader in = t2.getReader();   

        try {   
            //管道连接。下面2句话的本质是一样。
            //out.connect(in);   
            in.connect(out);   

            t1.start();
            t2.start();
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}
```



## Receiver

```java
import java.io.IOException;   
import java.io.PipedReader;   

@SuppressWarnings("all")   

public class Receiver extends Thread {   

    // 管道输入流对象。
    // 它和管道输出流(PipedWriter)对象绑定，
    // 从而可以接收管道输出流的数据，再让用户读取。
    private PipedReader in = new PipedReader();   

    // 获得管道输入流对象
    public PipedReader getReader(){   
        return in;   
    }   

    @Override
    public void run(){   
        readMessageOnce() ;
    }

    // 从管道输入流中读取1次数据
    public void readMessageOnce(){   
        // 虽然buf的大小是2048个字符，但最多只会从管道输入流中读取1024个字符。
        // 因为，管道输入流的缓冲区大小默认只有1024个字符。
        char[] buf = new char[2048];   
        try {   
            int len = in.read(buf);   
            System.out.println(new String(buf,0,len));   
            in.close();   
        } catch (IOException e) {   
            e.printStackTrace();   
        }   
    }
    
    public void readMessageContinued(){
        int total=0;
        while(true) {
            char[] buf = new char[1024];
            try {
                int len = in.read(buf);
                total += len;
                System.out.println(new String(buf,0,len));
                // 若读取的字符总数>1024，则退出循环。
                if (total > 1024)
                    break;
            } catch (IOException e) {
                e.printStackTrace();
            }
        }

        try {
            in.close(); 
        } catch (IOException e) {   
            e.printStackTrace();   
        }   
    }   
}
```



## Sender

```java
import java.io.IOException;   
import java.io.PipedWriter;   
@SuppressWarnings("all")
public class Sender extends Thread {   

    // 管道输出流对象。
    // 它和管道输入流(PipedReader)对象绑定，
    // 从而可以将数据发送给管道输入流，然后用户可以从管道输入流读取数据。
    private PipedWriter out = new PipedWriter();

    // 获得管道输出流对象
    public PipedWriter getWriter(){
        return out;
    }   

    @Override
    public void run(){   
        writeShortMessage();
        //writeLongMessage();
    }   

    // 向管道输出流中写入一则较简短的消息："this is a short message" 
    private void writeShortMessage() {
        String strInfo = "this is a short message" ;
        try {
            out.write(strInfo.toCharArray());
            out.close();   
        } catch (IOException e) {   
            e.printStackTrace();   
        }   
    }
    // 向管道输出流中写入一则较长的消息
    private void writeLongMessage() {
        StringBuilder sb = new StringBuilder();
        // 通过for循环写入1020个字符
        for (int i=0; i<102; i++)
            sb.append("0123456789");
        // 再写入26个字符。
        sb.append("abcdefghijklmnopqrstuvwxyz");
        // str的总长度是1020+26=1046个字符
        String str = sb.toString();
        try {
            // 将1046个字符写入到管道输出流中
            out.write(str);
            out.close();
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}
```

说明：  

- `in.connect(out)`;

  它的作用是将管道输入流和管道输出流关联起来。查看`PipedWriter`和`PipedReader`中`connect()`的源码；我们知道 `out.connect(in)`; 等价于`in.connect(out)`;

- 先查看`Sender`的源码，线程启动后执行`run()`函数；在`Sender`的`run()`中，调用`writeShortMessage()`;
  `writeShortMessage()`;的作用就是向管道输出流中写入数据`this is a short message`；这条数据会被管道输入流接收到。下面看看这是如何实现的。
  `PipedWriter`继承于`Writer`；`Writer`中`write(char cbuf[])`的源码如下：

```java
public void write(char cbuf[]) throws IOException {
    write(cbuf, 0, cbuf.length);
}
```

实际上`write(char c[])`是调用的`PipedWriter`中的`write(char c[], int off, int len)`函数。查看`write(char c[], int off, int len)`的源码，我们发现：它会调用`sink.receive(cbuf, off, len)`; 进一步查看`receive(char c[], int off, int len)`的定义，我们知道`sink.receive(cbuf, off, len)`的作用就是：将管道输出流中的数据保存到管道输入流的缓冲中。而管道输入流的缓冲区`buffer`的默认大小是1024个字符。

至此，我们知道：`t1.start()`启动`Sender`线程，而`Sender`线程会将数据`this is a short message`写入到管道输出流；而管道输出流又会将该数据传输给管道输入流，即而保存在管道输入流的缓冲中。

接下来，我们看看用户如何从管道输入流的缓冲中读取数据。这实际上就是`Receiver`线程的动作。
`t2.start()`会启动`Receiver`线程，从而执行`Receiver`的`run()`函数。查看`Receiver`的源码，我们知道`run()`调用了`readMessageOnce()`。
而`readMessageOnce()`就是调用`in.read(buf)`从管道输入流`in`中读取数据，并保存到`buf`中。
通过上面的分析，我们已经知道管道输入流`in`的缓冲中的数据是`this is a short message`；因此，`buf`的数据就是`this is a short message`。

为了加深对管道的理解。我们接着进行下面两个小试验。

**试验一：修改Sender**

将

```java
public void run(){   
    writeShortMessage();
    //writeLongMessage();
}
```

修改为

```java
public void run(){   
    //writeShortMessage();
    writeLongMessage();
}
```

运行程序。运行结果如下：

![](https://s1.ax1x.com/2020/07/24/UxSgUI.jpg)

从中，我们看出，程序运行出错！抛出异常`java.io.IOException: Pipe closed`

为什么会这样呢？

我分析一下程序流程。

1. 在`PipeTest`中，通过`in.connect(out)`将输入和输出管道连接起来；然后，启动两个线程。`t1.start()`启动了线程`Sender`，`t2.start()`启动了线程`Receiver`。
2. `Sender`线程启动后，通过`writeLongMessage()`写入数据到输出管道，`out.write(str.toCharArray())`共写入了1046个字符。而根据`PipedWriter`的源码，`PipedWriter`的`write()`函数会调用`PipedReader`的`receive()`函数。而观察`PipedReader`的`receive()`函数，我们知道，`PipedReader`会将接受的数据存储缓冲区。仔细观察`receive()`函数，有如下代码：

```java
while (in == out) {
    if ((readSide != null) && !readSide.isAlive()) {
        throw new IOException("Pipe broken");
    }
    /* full: kick any waiting readers */
    notifyAll();
    try {
        wait(1000);
    } catch (InterruptedException ex) {
        throw new java.io.InterruptedIOException();
    }
}
```

而`in`和`out`的初始值分别是`in=-1`, `out=0`；结合上面的`while(in==out)`。我们知道，它的含义就是，每往管道中写入一个字符，就达到了`in==out`这个条件。然后，就调用`notifyAll()`，唤醒读取管道的线程。

也就是，每往管道中写入一个字符，都会阻塞式的等待其它线程读取。
然而，`PipedReader`的缓冲区的默认大小是1024！但是，此时要写入的数据却有1046！所以，一次性最多只能写入1024个字符。

3. `Receiver`线程启动后，会调用`readMessageOnce()`读取管道输入流。读取1024个字符会，会调用`close()`关闭，管道。

由2和3的分析可知，`Sender`要往管道写入1046个字符。其中，前1024个字符(缓冲区容量是1024)能正常写入，并且每写入一个就读取一个。当写入1025个字符时，依然是依次的调用`PipedWriter`中的`write()`；然后，`write()`中调用`PipedReader`中的`receive()`；在`PipedReader`中，最终又会调用到`receive(int c)`函数。 而此时，管道输入流已经被关闭，也就是`closedByReader`为`true`，所以抛出`throw new IOException("Pipe closed")`。

我们对试验一继续进行修改，解决该问题。

**试验二： 在试验一的基础上继续修改Receiver** 将

```java
public void run(){   
    readMessageOnce() ;
    //readMessageContinued() ;
}
```

修改为

```java
public void run(){   
    //readMessageOnce() ;
    readMessageContinued() ;
}
```

此时，程序能正常运行。运行结果为：

```
01234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789
01234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789
01234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789
01234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789
01234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789
01234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789
01234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789
01234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789
01234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789
012345678901234567890123456789abcd
efghijklmnopqrstuvwxyz
```



# PipedWriter 和 PipedReader 源码

## PipedWriter 源码

```java
package java.io;


public class PipedWriter extends Writer {
    private PipedReader sink;
    private boolean closed = false;

    public PipedWriter(PipedReader snk)  throws IOException {
        connect(snk);
    }


    public PipedWriter() {
    }

    public synchronized void connect(PipedReader snk) throws IOException {
        if (snk == null) {
            throw new NullPointerException();
        } else if (sink != null || snk.connected) {
            throw new IOException("Already connected");
        } else if (snk.closedByReader || closed) {
            throw new IOException("Pipe closed");
        }

        sink = snk;
        snk.in = -1;
        snk.out = 0;
        snk.connected = true;
    }

    
    public void write(int c)  throws IOException {
        if (sink == null) {
            throw new IOException("Pipe not connected");
        }
        sink.receive(c);
    }

  
    public void write(char cbuf[], int off, int len) throws IOException {
        if (sink == null) {
            throw new IOException("Pipe not connected");
        } else if ((off | len | (off + len) | (cbuf.length - (off + len))) < 0) {
            throw new IndexOutOfBoundsException();
        }
        sink.receive(cbuf, off, len);
    }


    public synchronized void flush() throws IOException {
        if (sink != null) {
            if (sink.closedByReader || closed) {
                throw new IOException("Pipe closed");
            }
            synchronized (sink) {
                sink.notifyAll();
            }
        }
    }


    public void close()  throws IOException {
        closed = true;
        if (sink != null) {
            sink.receivedLast();
        }
    }
}

```

## PipedReader 源码

```java
package java.io;

public class PipedReader extends Reader {
    boolean closedByWriter = false;
    boolean closedByReader = false;
    boolean connected = false;

  
    Thread readSide;
    Thread writeSide;

  
    private static final int DEFAULT_PIPE_SIZE = 1024;

    char buffer[];

    int in = -1;
    
    int out = 0;

   
    public PipedReader(PipedWriter src) throws IOException {
        this(src, DEFAULT_PIPE_SIZE);
    }

    public PipedReader(PipedWriter src, int pipeSize) throws IOException {
        initPipe(pipeSize);
        connect(src);
    }


    public PipedReader() {
        initPipe(DEFAULT_PIPE_SIZE);
    }

   
    public PipedReader(int pipeSize) {
        initPipe(pipeSize);
    }

    private void initPipe(int pipeSize) {
        if (pipeSize <= 0) {
            throw new IllegalArgumentException("Pipe size <= 0");
        }
        buffer = new char[pipeSize];
    }

    
    public void connect(PipedWriter src) throws IOException {
        src.connect(this);
    }

    synchronized void receive(int c) throws IOException {
        if (!connected) {
            throw new IOException("Pipe not connected");
        } else if (closedByWriter || closedByReader) {
            throw new IOException("Pipe closed");
        } else if (readSide != null && !readSide.isAlive()) {
            throw new IOException("Read end dead");
        }

        writeSide = Thread.currentThread();
        while (in == out) {
            if ((readSide != null) && !readSide.isAlive()) {
                throw new IOException("Pipe broken");
            }
            /* full: kick any waiting readers */
            notifyAll();
            try {
                wait(1000);
            } catch (InterruptedException ex) {
                throw new java.io.InterruptedIOException();
            }
        }
        if (in < 0) {
            in = 0;
            out = 0;
        }
        buffer[in++] = (char) c;
        if (in >= buffer.length) {
            in = 0;
        }
    }

    synchronized void receive(char c[], int off, int len)  throws IOException {
        while (--len >= 0) {
            receive(c[off++]);
        }
    }

 
    synchronized void receivedLast() {
        closedByWriter = true;
        notifyAll();
    }

    public synchronized int read()  throws IOException {
        if (!connected) {
            throw new IOException("Pipe not connected");
        } else if (closedByReader) {
            throw new IOException("Pipe closed");
        } else if (writeSide != null && !writeSide.isAlive()
                   && !closedByWriter && (in < 0)) {
            throw new IOException("Write end dead");
        }

        readSide = Thread.currentThread();
        int trials = 2;
        while (in < 0) {
            if (closedByWriter) {
                /* closed by writer, return EOF */
                return -1;
            }
            if ((writeSide != null) && (!writeSide.isAlive()) && (--trials < 0)) {
                throw new IOException("Pipe broken");
            }
            /* might be a writer waiting */
            notifyAll();
            try {
                wait(1000);
            } catch (InterruptedException ex) {
                throw new java.io.InterruptedIOException();
            }
        }
        int ret = buffer[out++];
        if (out >= buffer.length) {
            out = 0;
        }
        if (in == out) {
            /* now empty */
            in = -1;
        }
        return ret;
    }

   
    public synchronized int read(char cbuf[], int off, int len)  throws IOException {
        if (!connected) {
            throw new IOException("Pipe not connected");
        } else if (closedByReader) {
            throw new IOException("Pipe closed");
        } else if (writeSide != null && !writeSide.isAlive()
                   && !closedByWriter && (in < 0)) {
            throw new IOException("Write end dead");
        }

        if ((off < 0) || (off > cbuf.length) || (len < 0) ||
            ((off + len) > cbuf.length) || ((off + len) < 0)) {
            throw new IndexOutOfBoundsException();
        } else if (len == 0) {
            return 0;
        }

        /* possibly wait on the first character */
        int c = read();
        if (c < 0) {
            return -1;
        }
        cbuf[off] =  (char)c;
        int rlen = 1;
        while ((in >= 0) && (--len > 0)) {
            cbuf[off + rlen] = buffer[out++];
            rlen++;
            if (out >= buffer.length) {
                out = 0;
            }
            if (in == out) {
                /* now empty */
                in = -1;
            }
        }
        return rlen;
    }

  
    public synchronized boolean ready() throws IOException {
        if (!connected) {
            throw new IOException("Pipe not connected");
        } else if (closedByReader) {
            throw new IOException("Pipe closed");
        } else if (writeSide != null && !writeSide.isAlive()
                   && !closedByWriter && (in < 0)) {
            throw new IOException("Write end dead");
        }
        if (in < 0) {
            return false;
        } else {
            return true;
        }
    }

   
    public void close()  throws IOException {
        in = -1;
        closedByReader = true;
    }
}

```

