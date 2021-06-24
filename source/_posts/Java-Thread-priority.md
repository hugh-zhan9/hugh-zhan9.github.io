---
title: Java多线程之 线程优先级与守护线程
date: 2020-07-26 19:20:34
tags: Java-多线程
categories: Java



---

-

<!--more-->

# 线程的优先级和守护线程

Java中线程的优先级的范围是1~10，默认的优先级为5。高优先级线程会优先于低优先级线程执行。

Java中有两种线程：用户线程和守护线程。可以通过`isDeamon()`方法来区别它们：如果返回`false`，则说明该线程是用户线程；否则就是守护线程。用户线程一般是用户级任务，而守护线程也就是后台线程，一般用来执行后台任务。需要注意的是：JVM在用户线程都结束后会退出。每个线程都可以被标记为一个守护进程或非守护进程。

在一些运行的主线程中创建新的子线程时，子线程的优先级被设置为等于创建它的主线程的优先级，当且仅当创建它的主线程是守护线程时子线程才会是守护线程。

当Java虚拟机启动时，通常有一个单一的非守护线程（该线程通过是通过`main()`方法启动）。JVM会一直运行直到下面的任意一个条件发生，JVM就会终止运行：

- 调用了`exit()`方法，并且`exit()`有权限被正常执行。
- 所有的非守护线程都死了(即JVM中仅仅只有守护线程)。

# 线程优先级示例

```java
class MyThread extends Thread{
    public MyThread(String name) {
        super(name);
    }

    public void run(){
        for (int i=0; i<5; i++) {
            System.out.println(Thread.currentThread().getName()
                    +"("+Thread.currentThread().getPriority()+ ")"
                    +", loop "+i);
        }
    } 
}; 

public class Demo {  
    public static void main(String[] args) {  

        System.out.println(Thread.currentThread().getName()
                +"("+Thread.currentThread().getPriority()+ ")");

        Thread t1=new MyThread("t1");    
        Thread t2=new MyThread("t2");    
        t1.setPriority(1);                
        t2.setPriority(10);                
        t1.start();                      
        t2.start();                      
    }  
}
```

运行结果：

```
main(5)
t1(1), loop 0
t2(10), loop 0
t1(1), loop 1
t2(10), loop 1
t1(1), loop 2
t2(10), loop 2
t1(1), loop 3
t2(10), loop 3
t1(1), loop 4
t2(10), loop 4
```

结果说明：

- 主线程`main`的优先级是5。
- `t1`的优先级被设为1，而`t2`的优先级被设为10。cpu在执行`t1`和`t2`的时候，根据时间片轮循调度，所以能够并发执行。



# 守护线程示例

```java
class MyThread extends Thread{
    public MyThread(String name) {
        super(name);
    }

    public void run(){
        try {
            for (int i=0; i<5; i++) {
                Thread.sleep(3);
                System.out.println(this.getName() +"(isDaemon="+this.isDaemon()+ ")" +", loop "+i);
            }
        } catch (InterruptedException e) {
        }
    } 
}; 

class MyDaemon extends Thread{  
    public MyDaemon(String name) {
        super(name);
    }

    public void run(){
        try {
            for (int i=0; i<10000; i++) {
                Thread.sleep(1);
                System.out.println(this.getName() +"(isDaemon="+this.isDaemon()+ ")" +", loop "+i);
            }
        } catch (InterruptedException e) {
        }
    } 
}

public class Demo {  
    public static void main(String[] args) {  

        System.out.println(Thread.currentThread().getName()
                +"(isDaemon="+Thread.currentThread().isDaemon()+ ")");

        Thread t1=new MyThread("t1");    
        Thread t2=new MyDaemon("t2");    
        t2.setDaemon(true);               
        t1.start();                     
        t2.start();                        
    }  
}
```

运行结果：

```
main(isDaemon=false)
t2(isDaemon=true), loop 0
t2(isDaemon=true), loop 1
t1(isDaemon=false), loop 0
t2(isDaemon=true), loop 2
t2(isDaemon=true), loop 3
t1(isDaemon=false), loop 1
t2(isDaemon=true), loop 4
t2(isDaemon=true), loop 5
t2(isDaemon=true), loop 6
t1(isDaemon=false), loop 2
t2(isDaemon=true), loop 7
t2(isDaemon=true), loop 8
t2(isDaemon=true), loop 9
t1(isDaemon=false), loop 3
t2(isDaemon=true), loop 10
t2(isDaemon=true), loop 11
t1(isDaemon=false), loop 4
t2(isDaemon=true), loop 12
```

结果说明：

- 主线程`main`是用户线程，它创建的子线程`t1`也是用户线程。
- `t2`是守护线程。在主线程`main`和`子线程t1`(它们都是用户线程)执行完毕，只剩`t2`这个守护线程的时候，JVM自动退出。