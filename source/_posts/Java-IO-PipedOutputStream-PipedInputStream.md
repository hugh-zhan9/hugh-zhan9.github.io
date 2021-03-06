---
title: Java IO之 PipedOutputStream/PipedInputStream详解
tags: Java-IO
categories: Java
date: 2020-07-22 22:22:28




---

-

<!--more-->

# Java 管道简介

在Java中，`PipedOutputStream`和`PipedInputStream`分别是管道输出流和管道输入流。

它们的作用是让多线程可以通过管道进行线程间的通讯。在使用管道通信时，必须将`PipedOutputStream`和`PipedInputStream`配套使用。

使用管道通信时，大致的流程是：

- 在线程A中向`PipedOutputStream`中写入数据，这些数据会自动地发送到与`PipedInputStream`对应地`PipedInputStream`中，进而存储在`PipedInputStream`的缓冲中。

- 此时，线程B通过读取`PipedInputStream`中的数据，就可以实现线程A和线程B的通信。

# 管道通信示例

下面，我们看看多线程中通过管道通信的例子。例子中包括3个类：Receiver.java, PipedStreamTest.java 和 Sender.java。

Receiver.java 代码

```java
import java.io.IOException;   
import java.io.PipedInputStream;   

@SuppressWarnings("all")   
/**  
 * 接收者线程  
 */   
public class Receiver extends Thread {

    // 管道输入流对象。
    // 它和管道输出流(PipedOutputStream)对象绑定，
    // 从而可以接收“管道输出流”的数据，再让用户读取。
    private PipedInputStream in = new PipedInputStream();   

    // 获得管道输入流对象
    public PipedInputStream getInputStream(){   
        return in;   
    }   

    @Override
    public void run(){   
        readMessageOnce();
        //readMessageContinued();
    }

    // 从管道输入流中读取1次数据
    public void readMessageOnce(){
        // 虽然buf的大小是2048个字节，但最多只会从管道输入流中读取1024个字节。
        // 因为，管道输入流的缓冲区大小默认只有1024个字节。
        byte[] buf = new byte[2048];
        try {
            int len = in.read(buf);
            System.out.println(new String(buf,0,len));
            in.close();
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
    // 从管道输入流读取>1024个字节时，就停止读取
    public void readMessageContinued() {
        int total=0;
        while(true) {
            byte[] buf = new byte[1024];
            try {
                int len = in.read(buf);
                total += len;
                System.out.println(new String(buf,0,len));
                // 若读取的字节总数>1024，则退出循环。
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

Sender.java 代码

```java
import java.io.IOException;   
import java.io.PipedOutputStream;   

@SuppressWarnings("all")
/**  
 * 发送者线程  
 */   
public class Sender extends Thread {

    // 管道输出流对象。
    // 和管道输入流(PipedInputStream)对象绑定，
    // 从而可以将数据发送给管道输入流的数据，然后用户可以从管道输入流读取数据。
    private PipedOutputStream out = new PipedOutputStream();

    // 获得管道输出流对象
    public PipedOutputStream getOutputStream(){
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
            out.write(strInfo.getBytes());
            out.close();   
        } catch (IOException e) {   
            e.printStackTrace();   
        }   
    }
    // 向管道输出流中写入一则较长的消息
    private void writeLongMessage() {
        StringBuilder sb = new StringBuilder();
        // 通过for循环写入1020个字节
        for (int i=0; i<102; i++)
            sb.append("0123456789");
        // 再写入26个字节。
        sb.append("abcdefghijklmnopqrstuvwxyz");
        // str的总长度是1020+26=1046个字节
        String str = sb.toString();
        try {
            // 将1046个字节写入到管道输出流中
            out.write(str.getBytes());
            out.close();
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}
```

PipedStreamTest 代码

```java
import java.io.PipedInputStream;
import java.io.PipedOutputStream;
import java.io.IOException;

@SuppressWarnings("all")   
/**  
 * 管道输入流和管道输出流的交互程序
 */   
public class PipedStreamTest {

    public static void main(String[] args) {   
        Sender t1 = new Sender();   

        Receiver t2 = new Receiver();   

        PipedOutputStream out = t1.getOutputStream();   

        PipedInputStream in = t2.getInputStream();   

        try {   
            //管道连接。下面2句话的本质是一样。
            //out.connect(in);   
            in.connect(out);   

            /**  
             * Thread类的START方法：  
             * 使该线程开始执行；Java 虚拟机调用该线程的 run 方法。   
             * 结果是两个线程并发地运行。当前线程（从调用返回给 start 方法）和另一个线程（执行其 run 方法）。   
             * 多次启动一个线程是非法的。特别是当线程已经结束执行后，不能再重新启动。   
             */
            t1.start();
            t2.start();
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}
```

# PipedOutputStream 源码分析

```java
package java.io;
import java.io.*;


public class PipedOutputStream extends OutputStream {

    // 与PipedInputStream通信的PipedInputStream对象
    private PipedInputStream sink;

    // 构造函数，指定配对的PipedInputStream
    public PipedOutputStream(PipedInputStream snk)  throws IOException {
        connect(snk);
    }
    
    // 构造函数
    public PipedOutputStream() {
    }

    // 将管道输出流和管道输入流连接
    public synchronized void connect(PipedInputStream snk) throws IOException {
        if (snk == null) {
            throw new NullPointerException();
        } else if (sink != null || snk.connected) {
            throw new IOException("Already connected");
        }
        // 设置管道输入流
        sink = snk;
        // 初始化管道输入流的读写位置
        // int是PipedInputStream中定义的，代表管道输入流的读写位置
        snk.in = -1;
        // 初始化管道输出流的读写位置
        // out是PipedInputStream中定义的，代表管道输出流的读写位置
        snk.out = 0;
        // 设置管道输入流和管道输出流为已连接状态
        // connected是PipedInputStream中定义的，用于表示管道输入流与管道输出流是否已经连接
        snk.connected = true;
    }

    // 将int类型b写入管道输出流中
    // 将b写入管道输出流之后，它会将b传输给管道输入流
    public void write(int b)  throws IOException {
        if (sink == null) {
            throw new IOException("Pipe not connected");
        }
        sink.receive(b);
    }

    // 将字节数组b写入管道输出流中
    // 将数组b写入管道输出流之后，它将会将其传输给管道输入流
    public void write(byte b[], int off, int len) throws IOException {
        if (sink == null) {
            throw new IOException("Pipe not connected");
        } else if (b == null) {
            throw new NullPointerException();
        } else if ((off < 0) || (off > b.length) || (len < 0) ||
                   ((off + len) > b.length) || ((off + len) < 0)) {
            throw new IndexOutOfBoundsException();
        } else if (len == 0) {
            return;
        }
        // 管道输入流接收数据
        sink.receive(b, off, len);
    }

    // 清空管道输出流
    // 这里会调用管道输入流的notifAll()
    // 目的是让管道输入流放弃对当前资源的占用，让其它等待线程(等待读取管道输出流的线程)读取管道输出流的值。
    public synchronized void flush() throws IOException {
        if (sink != null) {
            synchronized (sink) {
                sink.notifyAll();
            }
        }
    }

    // 关闭管道输出流
    // 关闭之后，会调用receivedLast()通知管道输入流它已经关闭
    public void close()  throws IOException {
        if (sink != null) {
            sink.receivedLast();
        }
    }
}
```

# PipedInputStream 源码解析

```java
package java.io;

public class PipedInputStream extends InputStream {
    // 管道输出流是否关闭的标记
    boolean closedByWriter = false;
    // 管道输入流是否关闭的标记
    volatile boolean closedByReader = false;
    // 管道输入流与管道输出流是否连接的标记
    // 它在PipedOutputStream的connect()连接函数中被设置为true
    boolean connected = false;

       
    Thread readSide;    // 读取管道数据的线程
    Thread writeSide;   // 向管道写入数据的线程
	// 管道的默认大小
    private static final int DEFAULT_PIPE_SIZE = 1024;

    protected static final int PIPE_SIZE = DEFAULT_PIPE_SIZE;
   
    // 缓冲区
    protected byte buffer[];
   
    // 下一个写入字节的位置。in==out代表满，说明写入的数据全部被读取了
    protected int in = -1;
    // 下一个读取字节的位置。int==out代表满，说明写入的数据全部被读取了
    protected int out = 0;

   
    // 构造函数：指定与管道输入流关联的管道输出流
    public PipedInputStream(PipedOutputStream src) throws IOException {
        this(src, DEFAULT_PIPE_SIZE);
    }

    // 构造函数：指定与管道输入流关联的管道输出流，以及缓冲区大小
    public PipedInputStream(PipedOutputStream src, int pipeSize)
            throws IOException {
         initPipe(pipeSize);
         connect(src);
    }

    // 构造函数：默认缓冲区大小是 1024字节
    public PipedInputStream() {
        initPipe(DEFAULT_PIPE_SIZE);
    }

    // 构造函数：指定缓冲区大小是pipeSize
    public PipedInputStream(int pipeSize) {
        initPipe(pipeSize);
    }

    // 初始化管道：新建缓冲区大小
    private void initPipe(int pipeSize) {
         if (pipeSize <= 0) {
            throw new IllegalArgumentException("Pipe Size <= 0");
         }
         buffer = new byte[pipeSize];
    }

    // 将管道输入流和管道输出流绑定
    public void connect(PipedOutputStream src) throws IOException {
        src.connect(this);
    }

    // 接收int类型的数据b
    // 它只会在PipedOutputStream的write(int b)中会被调用
    protected synchronized void receive(int b) throws IOException {
        // 检查管道状态
        checkStateForReceive();
        // 获取写入管道的线程
        writeSide = Thread.currentThread();
        // 若写入管道的数据正好全部被读取完，则等待
        if (in == out)
            awaitSpace();
        if (in < 0) {
            in = 0;
            out = 0;
        }
        // 将b保存到缓冲区
        buffer[in++] = (byte)(b & 0xFF);
        if (in >= buffer.length) {
            in = 0;
        }
    }

    // 接收字节数组b
    synchronized void receive(byte b[], int off, int len)  throws IOException {
        // 检查管道状态
        checkStateForReceive();
        // 获取写入管道的线程
        writeSide = Thread.currentThread();
        int bytesToTransfer = len;
        while (bytesToTransfer > 0) {
            // 若写入管道的数据正好全部被读取完，则等待
            if (in == out)
                awaitSpace();
            int nextTransferAmount = 0;
            // 如果管道中被读取的数据，少于写入管道的数据；
            // 则设置 nextTransferAmount = buffer.length - in
            if (out < in) {
                nextTransferAmount = buffer.length - in;
            } else if (in < out) {   // 如果管道中被读取的数据，大于/等于写入管道的数据，则执行后面的操作
                // 若in == -1(即管道的写入数据等于被读取数据)，此时nextTransferAmount = buffer.length -in
                // 否则，nextTransferAmount = out - in
                if (in == -1) {
                    in = out = 0;
                    nextTransferAmount = buffer.length - in;
                } else {
                    nextTransferAmount = out - in;
                }
            }
            if (nextTransferAmount > bytesToTransfer)
                nextTransferAmount = bytesToTransfer;
            // 断言的作用是：若nextTransferAmount <= 0, 则终止程序
            assert(nextTransferAmount > 0);
            // 将数据写入到缓存中
            System.arraycopy(b, off, buffer, in, nextTransferAmount);
            bytesToTransfer -= nextTransferAmount;
            off += nextTransferAmount;
            in += nextTransferAmount;
            if (in >= buffer.length) {
                in = 0;
            }
        }
    }

    // 检查管道状态
    private void checkStateForReceive() throws IOException {
        if (!connected) {
            throw new IOException("Pipe not connected");
        } else if (closedByWriter || closedByReader) {
            throw new IOException("Pipe closed");
        } else if (readSide != null && !readSide.isAlive()) {
            throw new IOException("Read end dead");
        }
    }

    // 等待
    // 若写入管道的数据正好全部被读取完(例如，管道缓冲满)，则执行awaitSpace()操作
    // 它的目的是让读取管道的线程产生读取数据请求，从而才能继续地向管道中写入数据
    private void awaitSpace() throws IOException {
        // 如果管道中被读取的数据，等于写入管道的数据时
        // 则每隔1000ms检查管道状态，并唤醒管道操作。若有读取管道数据线程被阻塞，则唤醒该线程。
        while (in == out) {
            checkStateForReceive();

            /* full: kick any waiting readers */
            notifyAll();
            try {
                wait(1000);
            } catch (InterruptedException ex) {
                throw new java.io.InterruptedIOException();
            }
        }
    }

    // 当PipedOutputStream被关闭时，被调用
    synchronized void receivedLast() {
        closedByWriter = true;
        notifyAll();
    }

    // 从管道(的缓冲)中读取一个字节，并将其转换成int类型
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
        int ret = buffer[out++] & 0xFF;
        if (out >= buffer.length) {
            out = 0;
        }
        if (in == out) {
            /* now empty */
            in = -1;
        }

        return ret;
    }

    // 从管道(的缓冲)中读取数据，并将其存入到数组b中
    public synchronized int read(byte b[], int off, int len)  throws IOException {
        if (b == null) {
            throw new NullPointerException();
        } else if (off < 0 || len < 0 || len > b.length - off) {
            throw new IndexOutOfBoundsException();
        } else if (len == 0) {
            return 0;
        }

        /* possibly wait on the first character */
        int c = read();
        if (c < 0) {
            return -1;
        }
        b[off] = (byte) c;
        int rlen = 1;
        while ((in >= 0) && (len > 1)) {

            int available;

            if (in > out) {
                available = Math.min((buffer.length - out), (in - out));
            } else {
                available = buffer.length - out;
            }

            // A byte is read beforehand outside the loop
            if (available > (len - 1)) {
                available = len - 1;
            }
            System.arraycopy(buffer, out, b, off + rlen, available);
            out += available;
            rlen += available;
            len -= available;

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

    // 返回不受阻塞地从此输入流中读取地字节数
    public synchronized int available() throws IOException {
        if(in < 0)
            return 0;
        else if(in == out)
            return buffer.length;
        else if (in > out)
            return in - out;
        else
            return in + buffer.length - out;
    }

    // 关闭管道输入流
    public void close()  throws IOException {
        closedByReader = true;
        synchronized (this) {
            in = -1;
        }
    }
}
```

