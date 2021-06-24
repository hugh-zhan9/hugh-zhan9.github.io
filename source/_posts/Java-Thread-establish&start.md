---
title: Java多线程之 创建&启动线程
date: 2020-07-25 20:20:34
tags: Java-多线程
categories: Java


---

-

<!--more-->

# 创建线程

## Thread 和 Runnable 简介

`Runnable`是一个接口，该接口中只包含了一个`run()`方法。定义如下：

```java
public interface Runnable{
    public abstract void run();
}
```

可以定义一个类A实现`Runnable`接口；然后，通过`new Thread(new A())`等方式新建线程。

`Thread`是一个类。`Thread`本身就实现了`Runnable`接口。它的声明如下：

```java
public class Thread implements Runnable {}
```

`Thread`是类，而`Runnable`是接口；`Thread`本身是实现了`Runnable`接口的类。我们知道：一个类只能有一个父类，但是却能实现多个接口，因此`Runnable`具有更好的扩展性。
此外，`Runnable`还可以用于“资源的共享”。即，多个线程都是基于某一个`Runnable`对象建立的，它们会共享`Runnable`对象上的资源。所以通常建议通过`Runnable`来实现多线程！

## 继承 Thread

```java
public class ThreadTest {

    public static void main(String[] args) {

        class MyThread extends Thread{
            private int ticket = 10;
            public  void run(){
                    for(int i=0;i<20;i++){
                        if(this.ticket>0){
                            System.out.println(this.getName()+"买票：ticket "+this.ticket--);
                        }
                    }               
            }
        }
        // 启动3个线程t1,t2,t3；每个线程各卖10张票！
        MyThread t1 =new MyThread(); 
        MyThread t2 =new MyThread(); 
        MyThread t3 =new MyThread(); 
        t1.start();
        t2.start();
        t3.start();
    }
}
```

## 实现 Runnnable接口

```java
class MyThread implements Runnable{  
    private int ticket=10;  
    public void run(){
        for(int i=0;i<20;i++){ 
            if(this.ticket>0){
                System.out.println(Thread.currentThread().getName()+" 卖票：ticket"+this.ticket--);
            }
        }
    } 
}

public class RunnableTest {  
    public static void main(String[] args) {  
        MyThread mt=new MyThread();
        // 启动3个线程t1,t2,t3(它们共用一个Runnable对象)，这3个线程一共卖10张票！
        Thread t1=new Thread(mt);
        Thread t2=new Thread(mt);
        Thread t3=new Thread(mt);
        t1.start();
        t2.start();
        t3.start();
    }  
}        
```

运行结果：

```
hread-0 卖票：ticket10
Thread-2 卖票：ticket8
Thread-1 卖票：ticket9
Thread-2 卖票：ticket6
Thread-0 卖票：ticket7
Thread-2 卖票：ticket4
Thread-1 卖票：ticket5
Thread-2 卖票：ticket2
Thread-0 卖票：ticket3
Thread-1 卖票：ticket1
```

结果说明：

- 和上面`MyThread`继承于`Thread`不同；这里的`MyThread`实现了`Runnable`接口。
- 主线程`main`创建并启动3个子线程，而且这3个子线程都是基于`mt`这个`Runnable`对象而创建的。运行结果是这3个子线程一共卖出了10张票。这说明它们是共享了`Runnable`接口的。

# 启动线程

线程的启动需要调用`start()`方法，而在创建线程时我们都需要重写线程的`run()`方法。他们有什么区别呢？可以直接调用`run()`方法启动线程吗？

## start() 和 run() 的区别

**`start()`**：它的作用是启动一个新线程，新线程会执行相应的`run()`方法。`start()`不能被重复调用。
**`run()`**：它的作用就和普通的成员方法一样，可以被重复调用。单独调用`run()`的话，会在当前线程中执行`run()`，而并不会启动新线程！

下面以代码来进行说明。

```java
class MyThread extends Thread{  
    public void run(){
        ...
    } 
};
MyThread mythread = new MyThread();
```

`mythread.start()`会启动一个新线程，并在新线程中运行`run()`方法。
而`mythread.run()`则会直接在当前线程中运行`run()`方法，并不会启动一个新线程来运行`run()`。

## 示例

```java
class MyThread extends Thread{
    public MyThread(String name) {
        super(name);
    }
    
    public void run() {
        System.out.println(Thread.currentThread().getName() + " is running");
    }
};

public class Demo {
    public static void main(String[] args) {
        Thread mythread = new MyThread("mythread");
        System.out.println(Thread.currentThread().getName()+" call mythread.run()");
        mythread.run();

        System.out.println(Thread.currentThread().getName()+" call mythread.start()");
        mythread.start();
    }
}
```

运行结果：

```
main call mythread.run()
main is running
main call mythread.start()
mythread is running
```

结果说明：

- `Thread.currentThread().getName()`是用于获取当前线程的名字。当前线程是指正在cpu中调度执行的线程。
- `mythread.run()`是在主线程`main`中调用的，该`run()`方法直接运行在主线程`main`上。
- `mythread.start()`会启动线程`mythread`，线程`mythread`启动之后，会调用`run()`方法；此时的`run()`方法是运行在线程`mythread`上。



## 源码

`Thread`中`start()`方法源码如下：

```java
public synchronized void start() {
    // 如果线程不是就绪状态，则抛出异常
    if (threadStatus != 0)
        throw new IllegalThreadStateException();
    // 将线程添加到ThreadGroup中
    group.add(this);

    boolean started = false;
    try {
        // 通过start0()启动线程
        start0();
        // 设置statred标记
        started = true;
    } finally {
        try {
            if (!started) {
                group.threadStartFailed(this);
            }
        } catch (Throwable ignore) {
        }
    }
}
```

说明：

`start()`实际上是通过本地方法`start0()`启动线程的。而`start0()`会新运行一个线程，新线程会调用`run()`方法。

```java
private native void start0();
```

`Thread`中`run()`的代码如下：

```java
public void run() {
    if (target != null) {
        target.run();
    }
}
```

说明：

`target`是一个`Runnable`对象。`run()`就是直接调用`Thread`线程的`Runnable`成员的`run()`方法，并不会新建一个线程。