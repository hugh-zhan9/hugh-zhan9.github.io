---
title: JUC 并发编程包
tags: [Java]
categories: Java
date: 2021-02-18 12:36:00







---



![](https://i.loli.net/2021/02/18/8BUcxpoFq4fhHtQ.jpg)

<!--more-->

# 多线程回顾

经典多线程卖票：

```java
//资源类
class Ticket{	
    private int number = 30;

    public synchronized void saleTicket(){
        if (number > 0){
            System.out.println(Thread.currentThread().getName()+"\t卖出第："+(number--)+"\t还剩下："+number);
        }
    }
}

/**
 *题目：三个售票员   卖出   30张票
 * 多线程编程的企业级套路+模板:
 * 在高内聚低耦合的前提下，线程	操作(对外暴露的调用方法)	资源类
 */
public class SaleTicket {
    public static void main(String[] args) {
        Ticket ticket = new Ticket();

        new Thread(new Runnable() {
            @Override
            public void run() {
                for (int i = 1; i <= 40; i++) {
                    ticket.saleTicket();
                }
            }
        },"A").start();

        new Thread(new Runnable() {
            @Override
            public void run() {
                for (int i = 1; i <= 40; i++) {
                    ticket.saleTicket();
                }
            }
        },"B").start();

        new Thread(new Runnable() {
            @Override
            public void run() {
                for (int i = 1; i <= 40; i++) {
                    ticket.saleTicket();
                }
            }
        },"C").start();
    }
}
```

改进之后的卖票实现

```java
//资源类 = 实例变量 + 实例方法
class Ticket{
    private int number = 30;
    Lock lock  = new ReentrantLock();

    public void sale(){
        lock.lock();
        try {
            if (number > 0){
                System.out.println(Thread.currentThread().getName()+"\t卖出第："+(number--)+"\t还剩下："+number);
            }
        }catch (Exception e){
            e.printStackTrace();
        }finally {
            lock.unlock();
        }
    }
}

/**
 *题目：三个售票员   卖出   30张票
 * 笔记：如何编写企业级的多线程
 * 固定的编程套路+模板
 * 1.在高内聚低耦合的前提下，线程    操作(对外暴露的调用方法)     资源类
 *  1.1先创建一个资源类
 */
public class SaleTicketDemo1 {
    public static void main(String[] args) {
        Ticket ticket = new Ticket();

        new Thread(()->{for (int i = 1; i <= 40; i++) ticket.sale();},"A").start();
        new Thread(()->{for (int i = 1; i <= 40; i++) ticket.sale();},"B").start();
        new Thread(()->{for (int i = 1; i <= 40; i++) ticket.sale();},"C").start();
    }
}
```

什么是JUC?

Java真的能够开启线程吗？



## 并发和并行

**并发**：多个线程操作一个资源，交替进行

- 单核CPU，模拟出多条线程，交替进行。
- 多核CPU，多个线程同时执行；线程池。

```java
public class Test1{
    public static void main(String[] args){
        // 获取CPU的核心数
        // CPU密集型、IO密集型
        System.out.println(Runtime.getRuntime().availableProcessors());
    }
}
```

并发编程的本质：充分利用CPU的资源

**并行**：多个线程一起行走，同时进行



线程有几个状态：`Thread.State`枚举类

```
NEW		RUNABLE 	BLOCKED		WAITING		TIMED_WAITING	 TERMINATED
```



```java
public enum State {
    
	/**
     * Thread state for a thread which has not yet started.
     */
    NEW,
    
    /**
     * Thread state for a runnable thread.  A thread in the runnable
     * state is executing in the Java virtual machine but it may
     * be waiting for other resources from the operating system
     * such as processor.
     */
    RUNNABLE,
    
    /**
     * Thread state for a thread blocked waiting for a monitor lock.
     * A thread in the blocked state is waiting for a monitor lock
     * to enter a synchronized block/method or
     * reenter a synchronized block/method after calling
     * {@link Object#wait() Object.wait}.
     */
    BLOCKED,
    
    /**
     * Thread state for a waiting thread.
     * A thread is in the waiting state due to calling one of the
     * following methods:
     * <ul>
     *   <li>{@link Object#wait() Object.wait} with no timeout</li>
     *   <li>{@link #join() Thread.join} with no timeout</li>
     *   <li>{@link LockSupport#park() LockSupport.park}</li>
     * </ul>
     *
     * <p>A thread in the waiting state is waiting for another thread to
     * perform a particular action.
     *
     * For example, a thread that has called <tt>Object.wait()</tt>
     * on an object is waiting for another thread to call
     * <tt>Object.notify()</tt> or <tt>Object.notifyAll()</tt> on
     * that object. A thread that has called <tt>Thread.join()</tt>
     * is waiting for a specified thread to terminate.
     */
    WAITING,
    
    /**
     * Thread state for a waiting thread with a specified waiting time.
     * A thread is in the timed waiting state due to calling one of
     * the following methods with a specified positive waiting time:
     * <ul>
     *   <li>{@link #sleep Thread.sleep}</li>
     *   <li>{@link Object#wait(long) Object.wait} with timeout</li>
     *   <li>{@link #join(long) Thread.join} with timeout</li>
     *   <li>{@link LockSupport#parkNanos LockSupport.parkNanos}</li>
     *   <li>{@link LockSupport#parkUntil LockSupport.parkUntil}</li>
     * </ul>
     */
    TIMED_WAITING,
    
    /**
     * Thread state for a terminated thread.
     * The thread has completed execution.
     */
    TERMINATED;
}
```



**wait/sleep的区别**

1. 来自不同的类

   `wait => Object`

   `sleep => Thread`  (实际生产中使用：`TimeUnit`类来进行线程休眠)

2. 关于锁的释放

   wait释放，sleep不释放

3. 使用范围不同

   wait只能在同步代码块中使用，sleep可以任何地方使用

# volatile

> [聊聊并发 —— 深入分析Volatile的实现原理](https://www.infoq.cn/article/ftf-java-volatile)

## 内存可见性

Java 内存模型规定，**对于多个线程共享的变量，存储在主内存当中**，**每个线程都有自己独立的工作内存，并且线程只能访问自己的工作内存，不可以访问其它线程的工作内存**。**工作内存中保存了主内存中共享变量的副本**，线程要操作这些共享变量，只能通过操作工作内存中的副本来实现，操作完毕之后再同步回到主内存当中，其 JMM 模型大致如下图。

![](https://s1.ax1x.com/2020/07/05/UpRAzj.jpg)

Java规定：

- 线程对共享变量的所有操作必须在自己的内存中进行，不能直接从主内存中读写; 
- 不同线程之间无法直接访问其它线程工作内存中的变量，线程间变量值的传递需要通过主内存来完成。这样的规定可能导致得到后果是：线程对共享变量的修改没有即时更新到主内存，或者线程没能够即时将共享变量的最新值同步到工作内存中，从而使得线程在使用共享变量的值时，该值并不是最新的。这就引出了内存可见性。

内存可见性（Memory Visibility）是指当某个线程正在使用对象状态，而另一个线程在同时修改该状态，需要确保当一个线程修改了对象状态后，其他线程能够看到发生的状态变化。

可见性错误是指当读操作与写操作在不同的线程中执行时，我们无法确保执行读操作的线程能适时地看到其他线程写入的值，有时甚至是根本不可能的事情。

```java
public class TestVolatile {
	public static void main(String[] args) {
		ThreadDemo td = new ThreadDemo();
		new Thread(td).start();
		
		while(true){
			if(td.isFlag()){
				System.out.println("------------------");
				break;
			}
		}
	}
}

class ThreadDemo implements Runnable {
	private boolean flag = false;

	@Override
	public void run() {
		try {
			Thread.sleep(200);
		} catch (InterruptedException e) { }
		flag = true;
		System.out.println("flag = " + isFlag());
	}
    
	public boolean isFlag() {
		return flag;
	}
	public void setFlag(boolean flag) {
		this.flag = flag;
	}
}
//输出：flag = true
```



## volatile 关键字

Java 提供了一种稍弱的同步机制，即 volatile 变量，用来确保将变量的更新操作通知到其它线程。当把共享变量声明为 volatile 类型后，**线程对该变量修改时会将该变量的值立即刷新回主内存**，同时会使其它线程中缓存的该变量无效，从而其它线程在读取该值时会从主内中重新读取该值（参考缓存一致性）。因此在读取 volatile 类型的变量时总是会返回最新写入的值。

volatile，内置关键字，虚拟机提供的轻量级的同步机制，具有三个特点：

1. **保证可见性**
2. **不保证原子性**
3. **禁止指令重排**

可以将 volatile 看做一个轻量级的锁，但是又与锁有些不同：

1. 对于多线程，**不是一种互斥关系**
2. **不能保证变量状态的“原子性操作“**

## volatile 使用示例：

```java
import java.util.concurrent.TimeUnit;

public class JMMDemo {
    public static int n = 0;

    public static void main(String[] args) throws InterruptedException {
        new Thread(()->{
            while (n==0) { }
            System.out.println("主内存变量的值发生修改，线程停止运行");
        }).start();

        TimeUnit.SECONDS.sleep(1);
        n = 1;
        System.out.println(n);
    }
}
```

这段代码并没有达到预期的效果，新建线程不知道主内存的变量的值出现了变化，需要在变量前加上关键字`volatile`保证其可见性：

```java
import java.util.concurrent.TimeUnit;

public class JMMDemo {
    // 加上volatile关键字之后可以达到预期的效果
    public static volatile int n = 0;
    
    public static void main(String[] args) throws InterruptedException {
        new Thread(()->{
            while (n==0) { }
            System.out.println("主内存变量的值发生修改，线程停止运行");
        }).start();

        TimeUnit.SECONDS.sleep(1);
        n = 1;
        System.out.println(n);
    }
}
```

一点疑惑：

```java
import java.util.concurrent.TimeUnit;

public class JMMDemo {
    public static int n = 0;

    public static void main(String[] args) throws InterruptedException {
        new Thread(()->{
            while (n==0) {
                System.out.println("为什么这里输出值会让线程停止，System.out.println()会让线程从主内存中重新读取数据吗?");
            }
            System.out.println("新建线程停止");
        }).start();

        TimeUnit.SECONDS.sleep(1);
        n = 1;
        System.out.println(n);
    }
}
```

线程B修改了主内存中共享变量的值，线程A不能及时获取改变——没有可见性

## 与其他同步方式的对比

**不保证原子性：**

线程A在执行任务的时候，不能被打扰，也不能被分割，要么同时成功，要么同时失败

```java
public class VDemo{
    // volatile不保证原子性
    public volatile static int num = 0;
    public static void add(){
        num++; // num++; 不是原子性操作
    }
    public static void main(String[] args) {
        for (int i=1; i<=20; i++){
            new Thread(()->{
                for (int j=1;j<=1000;j++){
                    add();
                }
            }).start();
        }

        /* 这里我最开始写了if，仔细理解下if和while
        if (Thread.activeCount()>2){
            Thread.yield();
        }
         */

        while (Thread.activeCount()>2){
            Thread.yield();
        }

        // 预期20000
        System.out.println(num);
    }
}
```

synchronized 是保证原子性的

```java
public class VDemo{
    public static int num = 0;
    public synchronized static void add(){
        num++;
    }
    public static void main(String[] args) {
        for (int i=1; i<=20; i++){
            new Thread(()->{
                for (int j=1;j<=1000;j++){
                    add();
                }
            }).start();
        }

        while (Thread.activeCount()>2){
            Thread.yield();
        }

        System.out.println(num);
    }
}
```

Lock锁也保证原子性

```java
import java.util.concurrent.locks.Lock;
import java.util.concurrent.locks.ReentrantLock;

public class VDemo{
    public static int num = 0;
    public static void add(){
        num++;
    }
    public static void main(String[] args) {
        Lock lock = new ReentrantLock();
        for (int i=1; i<=20; i++){
            new Thread(()->{
                lock.lock();
                try {
                    for (int j=1;j<=1000;j++){
                        add();
                    }
                }finally {
                    lock.unlock();
                }
            }).start();
        }

        while (Thread.activeCount()>2){
            Thread.yield();
        }

        System.out.println(num);
    }
}
```

如果不加Lock或者synchronized如何保证原子性：——> `java.util.concurrent.atomic`，使用该包下的原子类。

```java
import java.util.concurrent.atomic.*;

public class VDemo{
    public static AtomicInteger num = new AtomicInteger();
    public static void add(){
        num.getAndIncrement(); // 原子类操作下的自增方法，底层运用CAS
    }
    public static void main(String[] args) {
        for (int i=1; i<=20; i++){
            new Thread(()->{
                for (int j=1; j<=1000; j++){
                    add();
                }
            }).start();
        }

        while (Thread.activeCount() > 2){
            Thread.yield();
        }

        System.out.println(num);
    }
}
```

**这些类的底层都和操作系统直接挂钩，在内存中修改值，Unsafe类是一个很特殊的存在**



## 禁止指令重排

什么是指令重排：计算机执行代码并不是按照你写的那样的顺序去执行的。

源代码——>编译器优化的重排——>指令并行也可能会重排——>内存系统也会重排——>执行

**计算机在进行指令重排的时候会考虑数据之间的依赖性：**

```java
int x = 1; //1 
int y = 2; //2
x = x + 5; //3
y = x * x; //4

我们期望的是：1234 但是计算机的重排执行顺序可能是：1234  2134 1324
但是不可能是 4123 ...    
```

加入理想情况下有两个线程同步执行，初始情况下：a，b，x，y都是0，执行顺序如下表：

| 线程A | 线程B |
| ----- | ----- |
| x=a   | y=b   |
| b=1   | a=1   |

正常的情况下，x=0，y=0，可能会发生指令重排：


| 线程A | 线程B |
| ----- | ----- |
| b=1   | a=1   |
| x=a   | y=b   |

这样结果就变成了x=1，y=1。这是为了描述指令重排理想化的例子。指令重排发生的概率很低，但是理论上是存在的。volatile是可以避免指令重排的。

原理:

内存屏障，CPU指令，作用：

1. 保证特定的操作的执行顺序
2. 可以保证某些变量的内存可见性（利用这个特性volatile实现了可见性）

```
普通语句
   |
普通语句
   |
内存屏障：禁止上面的指令和下面的指令重排队
   |
volatile语句
   |
内存屏障：禁止上面的指令和下面的指令重排队
   |
普通语句
```

# CAS 算法

>[面试必问的CAS，你懂了吗?](https://www.baidu.com/link?url=GMpcIsrK_ktrEyaSEFgBpp_cy6vU0BdV-VDAHokqCFZP7PfydEnJkD6DIml__b--PbWdNh5k5-E7RmTNRswBIjaJZ9geNDuHRJIU_ynIVVK&wd=&eqid=89d7d6ca000061d4000000065fcf3607)
>
>[CAS原理](https://www.jianshu.com/p/ab2c8fce878b)



CAS：Compare and Swap，即比较再交换

JDK5 增加了并发包`java.util.concurrent.*`，其下面的类使用CAS算法实现了区别于`synchronouse`同步锁的一种乐观锁。JDK5 之前Java是靠`synchronized`关键字保证同步的，这是一种独占锁，也是悲观锁。

**CAS算法理解**

对CAS的理解，CAS是一种无锁算法，CAS有3个操作数，内存值V，旧的预期值A，要修改的新值B。当且仅当预期值A和内存值V相同时，将内存值V修改为B，否则什么都不做。

CAS比较与交换的伪代码可以表示为：

```
do{
	备份旧数据；
	基于旧数据构造新数据；
} while(!CAS(内存地址，备份的旧数据，新数据))
```

![img](https:////upload-images.jianshu.io/upload_images/5954965-b88918b03518f254?imageMogr2/auto-orient/strip|imageView2/2/w/320/format/webp)

注：t1，t2线程是同时更新同一变量56的值

因为t1和t2线程都同时去访问同一变量56，所以他们会把主内存的值完全拷贝一份到自己的工作内存空间，所以t1和t2线程的预期值都为56。

假设t1在与t2线程竞争中线程t1能去更新变量的值，而其他线程都失败。（失败的线程并不会被挂起，而是被告知这次竞争中失败，并可以再次发起尝试）。t1线程去更新变量值改为57，然后写到内存中。此时对于t2来说，内存值变为了57，与预期值56不一致，就操作失败了（想改的值不再是原来的值）。

（上图通俗的解释是：CPU去更新一个值，但如果想改的值不再是原来的值，操作就失败，因为很明显，有其它操作先改变了这个值。）

就是指当两者进行比较时，如果相等，则证明共享数据没有被修改，替换成新值，然后继续往下运行；如果不相等，说明共享数据已经被修改，放弃已经所做的操作，然后重新执行刚才的操作。容易看出 CAS 操作是基于共享数据不会被修改的假设，采用了类似于数据库的commit-retry 的模式。当同步冲突出现的机会很少时，这种假设能带来较大的性能提升。



```java
import java.util.concurrent.atomic.AtomicInteger;

public class CASDemo {
    public static void main(String[] args) {
        AtomicInteger atomicInteger = new AtomicInteger(2020);

        // 期望、更新值
        /* public final boolean compareAndSet(int expect, int update) {
               return unsafe.compareAndSwapInt(this, valueOffset, expect, update);
           }
           如果期望的值拿到了，就更新
         */
        System.out.println(atomicInteger.compareAndSet(2020,2021));
        System.out.println(atomicInteger.get());

        System.out.println(atomicInteger.compareAndSet(2020,2021));
    }
}
```

这里涉及到一个叫`unsafe`的类，使得Java可以通过这个类操作后门

```java
public final int getAndAddInt(Object var1, long var2, int var4) {
    int var5;
    // do-while 自旋锁
    do {
        var5 = this.getIntVolatile(var1, var2);
    } while(!this.compareAndSwapInt(var1, var2, var5, var5 + var4));
    return var5;
}
```

缺点：

1. 一次性只能保证一个共享变量的原子性
2. 采用的自旋锁会阻塞
3. 存在ABA问题

**CAS的ABA问题：（狸猫换太子）**

在我操作数据之前其它线程已经操作了值，并做了修改最后又修改回来了：

```java
import java.util.concurrent.atomic.AtomicInteger;

public class CASDemo {
    public static void main(String[] args) {
        AtomicInteger atomicInteger = new AtomicInteger(1);
        System.out.println(atomicInteger.get());

        // 捣乱的线程
        new Thread(()->{
            System.out.println("===修改开始===");
            atomicInteger.compareAndSet(1,2);
            System.out.println(atomicInteger.get());
            atomicInteger.compareAndSet(2,1);
            System.out.println(atomicInteger.get());
            System.out.println("===修改结束===");
        }).start();
        
        // 我期望的线程
        new Thread(()->{
            System.out.println("我期望的线程修改的结果："+atomicInteger.compareAndSet(1, 66));
        }).start();
        
    }
}
```



平时的SQL采用乐观锁解决。

使用原子引用解决。带版本号的原子操作解决。使用`AtomicStampedReference`类，它有两个初始值，可以作为版本参考。

```java
import java.util.concurrent.atomic.AtomicStampedReference;

public class CASDemo {
    public static void main(String[] args) {
        AtomicStampedReference atomicInteger = new AtomicStampedReference<Integer>(1,1);

        /*
          AtomicStampedReference atomicInteger = new AtomicStampedReference<Integer>(2020,1);
          这里有个问题导致，测试失败

            这里有个坑就是Integer的对象缓存机制，默认范围是-128~127，推荐使用静态工厂方法valueOf获取对象实例，而不是new，因为valueOf使用缓存，而new一定会创建新的对象分配新的内存空间
            阿里巴巴开发手册：
                所有的相同类型的包装类对象之间值的比较，全部使用 equals 方法比较。
                说明：对于 Integer var = ? 在-128 至 127 范围内的赋值，Integer 对象是在 IntegerCache.cache 产生，会复用已有对象，
                这个区间内的 Integer 值可以直接使用 == 进行判断，但是这个区间之外的所有数据，都会在堆上产生，并不会复用已有对象，这是一个大坑，推荐使用 equals 方法进行判断

           在实际的使用中一般是直接传入对象的，所以不会遇到这种坑。
         */

        int stamp = atomicInteger.getStamp();
        System.out.println("初始的stamp是"+stamp);

        // 捣乱的线程
        new Thread(()->{
            atomicInteger.compareAndSet(1,2,1,atomicInteger.getStamp()+1);
            System.out.println("线程a第一次拿到的stamp的值是："+atomicInteger.getStamp());
            atomicInteger.compareAndSet(2,1,2,atomicInteger.getStamp()+1);
            System.out.println("线程a第一次拿到的stamp的值是："+atomicInteger.getStamp());
        }).start();

        // 我期望的线程
        new Thread(()->{
            System.out.println("我期望的线程修改的结果："+atomicInteger.compareAndSet(1, 66, 1, atomicInteger.getStamp() + 1));
            System.out.println("我期望的线程拿到的stamp的值是："+atomicInteger.getStamp());
        }).start();

    }
}
```



# 集合类不安全

> [聊聊并发 —— 深入分析ConcurrentHashMap](https://www.infoq.cn/article/ConcurrentHashMap)
>
> [聊聊并发 —— ConcurrentLinkedQueue的实现原理分析](https://www.infoq.cn/article/ConcurrentLinkedQueue)

## ArrayList不安全

```java
import java.util.*;
import java.util.concurrent.CopyOnWriteArrayList;

public class Test1{
    public static void main(String[] args) {
        /*
            并发下ArrayList 不安全，报错:java.util.ConcurrentModificationException(并发修改异常)——> synchronized关键字
            解决方案:
                1. 使用Vector, 集合下默认安全的列表 (不推荐，使用了synchronized，导致效率低)
                2. 使用工具类, Collections.synchronizedList(new ArrayList<>()) 来创建类  (不要使用)
                3. 使用JUC下的CopyOnWriteArrayList （使用的是Lock锁）

            CopyOnWrite 写入时复制， COW是计算机程序设计领域的一种优化策略， 
            即在写入的时候复制一份，在写入之后再插入进去，避免出现数据问题

            读写分离 MyCat针对数据库
         */
        List<String> list = new CopyOnWriteArrayList<>();

        for (int i =1; i<=10; i++){
            new Thread(()->{
                list.add(UUID.randomUUID().toString().substring(0,5));
                System.out.println(list);
            },String.valueOf(i)).start();

        }
    }
}
```

## Set不安全

```java
import java.util.*;
import java.util.concurrent.CopyOnWriteArraySet;

public class Test1{
    public static void main(String[] args) {
        // Set<String> set = new HashSet<>();  这里同样会出现 java.util.ConcurrentModificationException 异常
        // 方法1:
        // Set<String> set = Collections.synchronizedSet(new HashSet<>());
        // 方法2：
        Set<String> set = new CopyOnWriteArraySet<>();
        for (int i =1; i<=10; i++){
            new Thread(()->{
                set.add(UUID.randomUUID().toString().substring(0,5));
                System.out.println(set);
            },String.valueOf(i)).start();

        }
    }
}
```

HashSet的底层就是HashMap。

## HashMap也不安全

```java
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;


public class Test1{
    public static void main(String[] args) {
        /*
            多线程中 map 是这样用的吗？ 不是，工作中不用这个HashMap
            这句话默认等价什么？ Map<String, Object> map = new HashMap<>(16,0.75);
                16称为初始化容量，0.75称为加载因子
         */
        // Map<String, Object> map = new HashMap<>();  同样会出现 java.util.ConcurrentModificationException异常
        // 方法一: Collections.synchronizedMap(new HashMap<>());
        // 方法二:
        Map<String,Object> map = new ConcurrentHashMap<>();
        for (int i =1; i<=10; i++){
            new Thread(()->{
                map.put(Thread.currentThread().getName(),UUID.randomUUID().toString().substring(0,5));
                System.out.println(map);
            },String.valueOf(i)).start();

        }
    }
}
```

# ConcurrentHashMap 实现线程安全的方式

**Java 7**

`ConcurrentHashMao`对整个数组进行了分段分割(`segment`)，每一把锁只锁容器其中的一部分数据，多线程访问容器里不同数据段的数据，就不会存在竞争，提高并发访问率。

![](https://i.loli.net/2021/02/18/MtDzo1cXymWLehO.png)

首先将数据分为一段一段的存储，然后给每一段数据配一把锁，当一个线程占用锁访问其中一个段数据时，其他段的数据也能被其他线程访问。**Java 7时 `ConcurrentHashMap` 是由 `Segment` 数组结构和 `HashEntry` 数组结构组成**。

![](https://i.loli.net/2021/02/18/i4KdPsq5jWloGk7.png)

Segment 实现了 `ReentrantLock`,所以 `Segment` 是一种可重入锁，扮演锁的角色。`HashEntry` 用于存储键值对数据。

```java
static class Segment<K,V> extends ReentrantLock implements Serializable {
}
```

一个 `ConcurrentHashMap` 里包含一个 `Segment` 数组。`Segment` 的结构和 `HashMap` 类似，是一种数组和链表结构，一个 `Segment` 包含一个 `HashEntry` 数组，每个 `HashEntry` 是一个链表结构的元素，每个 `Segment` 守护着一个 `HashEntry` 数组里的元素，当对 `HashEntry` 数组的数据进行修改时，必须首先获得对应的 `Segment` 的锁。

**Java 8**

`ConcurrentHashMap` 不再是 Segment 数组 + `HashEntry` 数组 + 链表，⽽是 Node 数 组 + 链表 / 红⿊树。不过，Node 只能⽤于链表的情况，红⿊树的情况需要使⽤ `TreeNode` 。当冲突链表达到⼀定⻓度时，链表会转换成红⿊树。并发控制使用 `synchronized` 和 CAS 来操作。虽然在Java 8中还能看到 `Segement` 的数据结构，但是已经简化了属性，只是为了兼容旧版本。

![](https://i.loli.net/2021/02/18/QvWZ58IY4cOpBKu.png)

`ConcurrentHashMap` 取消了 `Segment` 分段锁，采用 CAS 和 `synchronized` 来保证并发安全。数据结构跟 HashMap1.8 的结构类似，数组+链表/红黑二叉树。Java 8 在链表长度超过一定阈值（8）时将链表（寻址时间复杂度为 O(N)）转换为红黑树（寻址时间复杂度为 O(log(N))）。**`synchronized` 只锁定当前链表或红黑二叉树的首节点**，这样只要 hash 不冲突，就不会产生并发，效率又提升 N 倍。

# Callable接口

## 创建线程的四种方式

无返回：

1. 实现Runnable接口，重写run();
2. 继承Thread类，重写run();

有返回：

1. 实现Callable接口，重写call(),利用FutureTask包装Callable，并作为task传入Thread构造函数；
2. 利用线程池；

## Callable的使用

`Callable`接口类似于`Runnable`接口 ，因为它们都是为其实例可能由另一个线程执行而设计的。 然而，`Runnable`不返回结果，也不能抛出被检查的异常。 两者区别：1. 可以有返回值 2. 可以抛出异常 3. 方法不同`run()/call()`

```java
import java.util.concurrent.Callable;

import java.util.concurrent.ExecutionException;
import java.util.concurrent.FutureTask;


public class Test1{
    public static void main(String[] args) throws ExecutionException, InterruptedException {
        // new Thread().start();并不能直接使用callable接口创建线程
        // 要创建继承自Callable接口的线程类需要使用到Runnable接口的一个实现类:FutureTask()
        // java.util.concurrent.FutureTask<V>

        // 如果要获取callable的值，需要使用FutureTask的get()方法
        FutureTask futureTask = new FutureTask(new MyThread());
        new Thread(futureTask, "a").start();
        new Thread(futureTask, "b").start();  
        // 这里创建了两个线程，却只会打印出一个数据，因为结果会被缓存，效率高。
        
        // 这个方法可能会产生阻塞，把他放在最后执行或者使用异步通信来处理
        Integer obj = (Integer) futureTask.get();
        System.out.println(obj);
    }
}


class MyThread implements Callable<Integer> {

    @Override
    public Integer call() {
        System.out.println("线程执行中");
        return 1024;
    }
}
```

# 三大常用辅助类

## CountDownLatch

减法计数器，两个方法：`countDown()`数量减1，`await()`等待计数器归零，往下执行


```java
import java.util.concurrent.CountDownLatch;

public class CounterMachine{
    public static void main(String[] args) throws InterruptedException {
        // 定义计数器的初始值
        CountDownLatch count = new CountDownLatch(6);
        for (int i = 1; i<=6 ; i++){
            new Thread(()->{
                System.out.println("go out");
                // 如果我注释掉下面这句话，那么计数器会阻塞。
                count.countDown();
            },String.valueOf(i)).start();
        }
        // 等待计数器的值归零之后执行下面的操作
        count.await();
        System.out.println("close door");
    }
}
```

## CyclicBarrier 

加法计数器


```java
import java.util.concurrent.BrokenBarrierException;
import java.util.concurrent.CyclicBarrier;

public class CounterMachine{
    public static void main(String[] args) {
        /*
         CyclicBarrier有两个构造方法
         public CyclicBarrier(int parties)
            创建一个新的 CyclicBarrier ，当给定数量的线程（线程）正在等待时，它将跳闸，并且当屏障跳闸时不执行预定义的动作。
         public CyclicBarrier(int parties, Runnable barrierAction)
            创建一个新的 CyclicBarrier ，当给定数量的线程（线程）正在等待时，它将跳闸，当屏障跳闸时执行给定的屏障动作，由最后一个进入屏障的线程执行。
        */
        CyclicBarrier count = new CyclicBarrier(6, ()->{
            System.out.println("召唤神龙");
        });
        for(int i=1; i<=6; i++){
            // 使用final关键字将变量扩充作用域
            final int temp = i;
            new Thread(()-> {
                // 这里不能直接调用lambda表达式外面的变量i，因为lambda表达式的实质是一个类，不能调用别的类的变量。
                System.out.println(Thread.currentThread().getName()+"线程正在搜集第"+temp+"颗龙珠");
                try {
                    count.await();
                } catch (InterruptedException e) {
                    e.printStackTrace();
                } catch (BrokenBarrierException e) {
                    e.printStackTrace();
                }
            }, String.valueOf(i)).start();
        }
    }
}
```

## Semaphore 

信号量，作用：多个共享资源互斥使用，并发限流控制最大的线程数


```java
import java.util.concurrent.Semaphore;
import java.util.concurrent.TimeUnit;

public class CounterMachine{
    public static void main(String[] args) {
        // Semaphore 限制同一时间可运行线程的数量
        Semaphore semaphore = new Semaphore(3);
        for (int i=1; i<=6; i++){
            new Thread(()->{
                try {
                    // 获取信号量
                    semaphore.acquire();
                    System.out.println(Thread.currentThread().getName() + "号线程抢到停车位");
                    TimeUnit.SECONDS.sleep(5);
                } catch (InterruptedException e) {
                    e.printStackTrace();
                }finally {
                    // 释放信号量
                    semaphore.release();
                    System.out.println(Thread.currentThread().getName() + "号线程离开停车位");
                }
            },String.valueOf(i)).start();
        }
    }
}
```

# 阻塞队列

> [聊聊并发 —— Java中的阻塞队列](https://www.infoq.cn/article/java-blocking-queue)

```
	-----------------
放 🆒🆒🆒🆒🆒🆒🆒🆒🆒 取
	-----------------
	 这是一个队列
```

如果队列满了就必须阻塞等待取出，如果队列是空的就必须阻塞等待放入 

## BlockingQueue

`BlockingQueue`的常见实现类：`ArrayBlockingQueue，DelayQueue，LinkedBlockingQueue，LinkedTransferQueue，PriorityBlockingQueue，SynchronousQueue`

- ArrayBlockingQueue：由数组结构组成的有界阻塞队列
- LinkedBlockingQueue：由链表结构组成的有界（但默认值为integer.Max_VALUE）阻塞队列
- PriorityBlockingQueue：支持优先级排序的无界阻塞队列
- DelayQueue：使用优先级队列实现的延迟无界阻塞队列
- SynchronousQueue：不存储元素的阻塞队列，也即单个元素的队列
- LinkedTransferQueue：由链表组成的无界阻塞队列
- LinkedBlockingDeque：由链表组成的双向阻塞队列。



`BlockingQueue`方法有四种形式，具有不同的操作方式：

| 方式         | 抛出异常    | 不抛出异常 | 阻塞等待 | 超时等待                |
| ------------ | ----------- | ---------- | -------- | ----------------------- |
| 添加         | `add(e)`    | `offer(e)` | `put(e)` | `offer(e,timeout,unit)` |
| 移除         | `remove()`  | `poll()`   | `take()` | `poll(timeout,unit)`    |
| 检测队首元素 | `element()` | `peek()`   |          |                         |



```java
import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.ArrayBlockingQueue;
import java.util.concurrent.BlockingQueue;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.locks.ReadWriteLock;
import java.util.concurrent.locks.ReentrantReadWriteLock;


public class BlockingQueueDemo{

    public static void main(String[] args) throws InterruptedException {
        BlockingQueueDemo.blockQueueTest4();
    }

    // 抛出异常
    public static void blockQueueTest1(){
        BlockingQueue blockQueue = new ArrayBlockingQueue(3);

        blockQueue.add("a");
        blockQueue.add("b");
        blockQueue.add("c");
        // 下面这句话将导致：java.lang.IllegalStateException: Queue full 异常
        // blockQueue.add("d");

        // 获取队列队首元素
        System.out.println(blockQueue.element());

        blockQueue.remove();
        blockQueue.remove();
        blockQueue.remove();
        // 下面这句将导致：java.util.NoSuchElementException 异常
        // blockQueue.remove();

        // 下面这句将导致：java.util.NoSuchElementException 异常
        // System.out.println(blockQueue.element());
    }

    // 不抛出异常
    public static void blockQueueTest2(){
        BlockingQueue blockQueue = new ArrayBlockingQueue(3);

        blockQueue.offer("a");
        blockQueue.offer("b");
        blockQueue.offer("c");
        // 返回false, 不报错
        System.out.println(blockQueue.offer("d"));

        // 获取队列队首元素
        System.out.println(blockQueue.peek());

        blockQueue.poll();
        blockQueue.poll();
        blockQueue.poll();
        // 返回null
        System.out.println(blockQueue.poll());

        // 返回null
        System.out.println(blockQueue.peek());
    }

    // 阻塞
    public static void blockQueueTest3() throws InterruptedException {
        BlockingQueue blockQueue = new ArrayBlockingQueue(3);

        blockQueue.put("a");
        blockQueue.put("b");
        blockQueue.put("c");
        System.out.println(blockQueue);
        // 如果不取出将一直阻塞
        // 取出一个就可以继续放入元素
        blockQueue.take();
        blockQueue.put("d");
        System.out.println(blockQueue);

        blockQueue.take();
        blockQueue.take();
        blockQueue.take();
        // 这个操作如果队列里没有元素也会阻塞，直到有元素进入
        blockQueue.take();
    }

    // 等待超时, 使用第二组的重载方法
    public static void blockQueueTest4() throws InterruptedException {
        BlockingQueue blockQueue = new ArrayBlockingQueue(3);

        blockQueue.offer("a",1, TimeUnit.SECONDS);
        blockQueue.offer("b",1, TimeUnit.SECONDS);
        blockQueue.offer("c",1, TimeUnit.SECONDS);
        // 5秒后返回false;
        System.out.println(blockQueue.offer("d",5, TimeUnit.SECONDS));
        // 第四条超时放弃存入了.所以输出的结果只有前三个
        System.out.println(blockQueue);

        System.out.println(blockQueue.poll(1,TimeUnit.SECONDS));
        System.out.println(blockQueue.poll(1,TimeUnit.SECONDS));
        System.out.println(blockQueue.poll(1,TimeUnit.SECONDS));
        // 这里会在5秒之后返回null
        System.out.println(blockQueue.poll(5,TimeUnit.SECONDS));
    }
}
```



## SynchronousQueue

同步队列，没有容量，进去一个元素，必须取出之后才能继续存入。put/take

```java
import java.util.concurrent.BlockingQueue;
import java.util.concurrent.SynchronousQueue;
import java.util.concurrent.TimeUnit;

public class SynchronousQueueDemo{
    public static void main(String[] args) {

        BlockingQueue<String> blockingQueue = new SynchronousQueue();
        
        new Thread(()->{
            try {
                System.out.println(Thread.currentThread().getName()+"放入值a");
                blockingQueue.put("a");
                System.out.println(Thread.currentThread().getName()+"放入值b");
                blockingQueue.put("b");
                System.out.println(Thread.currentThread().getName()+"放入值c");
                blockingQueue.put("c");
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
        },"放入线程").start();

        new Thread(()->{
            try {
                System.out.println(Thread.currentThread().getName()+"取出值:"+blockingQueue.take());
                TimeUnit.SECONDS.sleep(4);
                System.out.println(Thread.currentThread().getName()+"取出值:"+blockingQueue.take());
                TimeUnit.SECONDS.sleep(4);
                System.out.println(Thread.currentThread().getName()+"取出值:"+blockingQueue.take());
                TimeUnit.SECONDS.sleep(4);
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
        },"取出线程").start();
    }
}
```

# Lock锁

## 简单的售票问题 

**没有使用锁的情况：**

```java
// 真正的多线程开发，公司中的开发
// 线程就是一个单独的资源类，没有任何附属的操作

/* 传统方式创建线程：
public class SaleTicketDemo{
    public static void main(String[] args){
    	new Thread(new MyThread()).start;
    }
}
class MyThread implements Runnable{
    @Override
    public void run(){
        ...
    }
}
*/


/*
多线程编程的企业级套路+模板:
线程 操作(对外暴露的调用方法) 资源类
*/
public class SaleTicketDemo{
    public static void main(String[] args){
        // 并发：多线程操作同一个资源类，把资源丢入线程
        Ticket ticket = new Ticket();

        new Thread(()->{
            for (int i = 0; i < 60; i++) {
                ticket.sale();
            }
        },"A").start();
        
        new Thread(()->{
            for (int i = 0; i < 60; i++) {
                ticket.sale();
            }
        },"B").start();
        
        new Thread(()->{
            for (int i = 0; i < 60; i++) {
                ticket.sale();
            }
        },"c").start();
    }
}

// 不使用class Ticket implement Runnable 这种形式。降低耦合性
class Ticket {
    private int number= 50;

    public void sale(){
        if (number>0) {
            System.out.println(Thread.currentThread().getName()+"卖出了第"+(number--)+"张票，剩余"+ number +"张票");
        }
    }
}
```

**使用锁的情况**

```java
public class SaleTicketDemo{
    public static void main(String[] args){
        Ticket ticket = new Ticket();

        new Thread(()->{
            for (int i = 0; i < 60; i++) {
                ticket.sale();
            }
        },"A").start();
        
        new Thread(()->{
            for (int i = 0; i < 60; i++) {
                ticket.sale();
            }
        },"B").start();
        
        new Thread(()->{
            for (int i = 0; i < 60; i++) {
                ticket.sale();
            }
        },"c").start();
    }
    
}

class Ticket {
    private int number= 50;

    // 传统的解决方式：加入synchronized，本质就是让线程排队
    public synchronized void sale(){
        if (number>0) {
            System.out.println(Thread.currentThread().getName()+"卖出了第"+(number--)+"张票，剩余"+ number +"张票");
        }
    }
}
```

## 并法包相关API

`java.util.concurrent.locks`下的接口和实现类：

```
Interfaces:
Condition
Lock	锁
ReadWriteLock	读写锁

Classes:
AbstractOwnableSynchronizer 
AbstractQueuedLongSynchronizer 
AbstractQueuedSynchronizer 
LockSupport 
ReentrantLock 
ReentrantReadWriteLock 
ReentrantReadWriteLock.ReadLock 
ReentrantReadWriteLock.WriteLock 
StampedLock 
```

`Lock`接口有三个实现类：`可重入锁 ReentrantLock，可重入读锁 ReentrantLock.ReadLock，可重入写锁 ReentrantLock.WriteLock`

使用`Lock lock = new ReentrantLock()`，查看`ReentrantLock`源码可以看到`ReentrantLock`可以构建出两种锁：

- 公平锁：先来后到

- **不公平锁：可以插队（默认）** 

```java
/**
 * Creates an instance of {@code ReentrantLock}.
 * This is equivalent to using {@code ReentrantLock(false)}.
 */
public ReentrantLock() {
    sync = new NonfairSync(); //不公平锁
}

/**
 * Creates an instance of {@code ReentrantLock} with the
 * given fairness policy.
 *
 * @param fair {@code true} if this lock should use a fair ordering policy
 */
public ReentrantLock(boolean fair) {
    sync = fair ? new FairSync() : new NonfairSync(); // 根据传入的参数获取锁
}
```

使用Lock锁来实现售票问题：

```java
import java.util.concurrent.locks.Lock;
import java.util.concurrent.locks.ReentrantLock;

public class SaleTicketDemo{
    public static void main(String[] args){
        Ticket ticket = new Ticket();

        new Thread(()->{
            for (int i = 0; i < 60; i++) ticket.sale(); },"A").start();
        new Thread(()->{
            for (int i = 0; i < 60; i++) ticket.sale(); },"B").start();
        new Thread(()->{
            for (int i = 0; i < 60; i++) ticket.sale(); },"c").start();
    }
}


class Ticket {
    private int number= 50;

    // 固定模式： new 锁， try{业务代码}catch...finally{释放锁}
    Lock lock = new ReentrantLock();

    public synchronized void sale(){
        lock.lock();
        try{
            if (number>0) {
                System.out.println(Thread.currentThread().getName()+"卖出了第"+(number--)+"张票，剩余"+ number +"张票");
            }
        } catch (Exception e){
            e.printStackTrace();
        } finally {
            lock.unlock();
        }
    }
}
```

**Lock锁和synchronized锁的区别：**

1. synchronized 是内置的Java关键字，Lock锁是Java的一个类
2. synchronized 在线程发生异常时会自动释放锁，Lock锁必须要手动释放锁，否则死锁
3. synchronized 线程1获取到锁阻塞之后，线程2只能等待，而Lock锁有一个`lock.tryLock()`方法，用于尝试获取锁
4. synchronized 可重入锁，非公平锁，不可以中断必须等待线程执行完毕之后才能释放锁；Lock锁也是可重入锁，但是可以中断，以及设置是否公平
5. synchronized 适合锁少量的代码同步问题，Lock锁适合锁大量的同步代码

**锁是什么，如何判断锁的是谁**

锁是用于通过多个线程控制对共享资源的访问的工具。  通常，锁提供对共享资源的独占访问：一次只能有一个线程可以获取锁，并且对共享资源的所有访问都要求首先获取锁。  但是，一些锁可能允许并发访问共享资源，如`ReadWriteLock`的读锁。 

## synchronized 和 Lock 示例

使用synchronized 

```java
import java.util.concurrent.locks.Lock;
import java.util.concurrent.locks.ReentrantLock;

public class SaleTicketDemo{
    public static void main(String[] args) {

        Ticket ticket = new Ticket();

        new Thread(()->{ for (int i = 0; i < 60; i++) {
            try {
                ticket.product();
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
        }
        },"a").start();
        
        new Thread(()->{ for (int i = 0; i < 60; i++) {
            try {
                ticket.sale();
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
        }
        },"b").start();
    }
}


class Ticket {
    private int number = 0;

    public synchronized void sale() throws InterruptedException {
        if (number==0){
            this.wait();
        }else {
            number--;
            System.out.println(Thread.currentThread().getName()+"----"+number);
            this.notifyAll();
        }
    }
    public synchronized void product() throws InterruptedException {
        if (number!=0){
            this.wait();
        }else {
            number++;
            System.out.println(Thread.currentThread().getName()+"----"+number);
            this.notifyAll();
        }
    }
}
```

但是，当线程多了的时候可能出现**虚假唤醒问题**：

```java
import java.util.concurrent.locks.Lock;
import java.util.concurrent.locks.ReentrantLock;

public class SaleTicketDemo{
    public static void main(String[] args) {

        Ticket ticket = new Ticket();

        new Thread(()->{ for (int i = 0; i < 60; i++) {
            try {
                ticket.product();
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
        }
        },"a").start();
        new Thread(()->{ for (int i = 0; i < 60; i++) {
            try {
                ticket.product();
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
        }
        },"b").start();
        new Thread(()->{ for (int i = 0; i < 60; i++) {
            try {
                ticket.sale();
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
        }
        },"c").start();
        new Thread(()->{ for (int i = 0; i < 60; i++) {
            try {
                ticket.sale();
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
        }
        },"d").start();
    }
}


class Ticket {
    private int number = 0;

    public synchronized void sale() throws InterruptedException {
        if (number==0){
            this.wait();
        }else {
            number--;
            System.out.println(Thread.currentThread().getName()+"----"+number);
            this.notifyAll();
        }
    }
    public synchronized void product() throws InterruptedException {
        if (number!=0){
            this.wait();
        }else {
            number++;
            System.out.println(Thread.currentThread().getName()+"----"+number);
            this.notifyAll();
        }
    }
}
```

使用while循环就可以解决虚假唤醒问题。

使用Lock：

```java
// 使用lock代替synchronized
// 使用await代替wait
// 使用signal代替notify
// await和signal是Condition的方法，Condition使用Lock.newCondition创建

import java.util.concurrent.locks.Condition;
import java.util.concurrent.locks.Lock;
import java.util.concurrent.locks.ReentrantLock;

public class SaleTicketDemo{
    public static void main(String[] args) {

        Ticket ticket = new Ticket();

        new Thread(()->{ for (int i = 0; i < 60; i++) { ticket.product(); } },"a").start();
        new Thread(()->{ for (int i = 0; i < 60; i++) { ticket.sale(); } },"b").start();
        new Thread(()->{ for (int i = 0; i < 60; i++) { ticket.product(); } },"c").start();
        new Thread(()->{ for (int i = 0; i < 60; i++) { ticket.sale(); } },"d").start();
    }
}


class Ticket {
    private int number = 0;
    Lock lock = new ReentrantLock();
    Condition condition = lock.newCondition();


    public void sale() {
        lock.lock();
        try {
            while (number==0){
                condition.await();
            }
            number--;
            System.out.println(Thread.currentThread().getName()+"----"+number);
            condition.signalAll();
        }catch (Exception e){
            e.printStackTrace();
        }finally {
            lock.unlock();
        }
    }
    
    public void product() {
        lock.lock();
        try {
            while (number!=0){
                condition.await();
            }
            number++;
            System.out.println(Thread.currentThread().getName()+"----"+number);
            condition.signalAll();
        }catch (Exception e){
            e.printStackTrace();
        }finally {
            lock.unlock();
        }
    }
}
```

使用 Conditiont 同步监视器 精准唤醒

```java
import java.util.concurrent.locks.Condition;
import java.util.concurrent.locks.Lock;
import java.util.concurrent.locks.ReentrantLock;

public class SaleTicketDemo{
    public static void main(String[] args) {

        Ticket ticket = new Ticket();

        new Thread(()->{ for (int i = 0; i < 60; i++) { ticket.printA(); } },"a").start();
        new Thread(()->{ for (int i = 0; i < 60; i++) { ticket.printC(); } },"c").start();
        new Thread(()->{ for (int i = 0; i < 60; i++) { ticket.printB(); } },"b").start();
    }
}


class Ticket {
    private int number = 0;
    Lock lock = new ReentrantLock();
    Condition condition1 = lock.newCondition();
    Condition condition2 = lock.newCondition();
    Condition condition3 = lock.newCondition();

    public void printA() {
        lock.lock();
        try {
            while (number != 0){
                condition1.await();
            }
            number = 1;
            System.out.println(Thread.currentThread().getName()+"----"+number);
            condition2.signal();
        }catch (Exception e){
            e.printStackTrace();
        }finally {
            lock.unlock();
        }
    }
    
    public void printB() {
        lock.lock();
        try {
            while (number!=1){
                condition2.await();
            }
            number = 2;
            System.out.println(Thread.currentThread().getName()+"----"+number);
            condition3.signal();
        }catch (Exception e){
            e.printStackTrace();
        }finally {
            lock.unlock();
        }
    }
    
    public void printC() {
        lock.lock();
        try {
            while (number!=2){
                condition3.await();
            }
            number=0;
            System.out.println(Thread.currentThread().getName()+"----"+number);
            condition1.signal();
        }catch (Exception e){
            e.printStackTrace();
        }finally {
            lock.unlock();
        }
    }
}
```

## 单例模式

单例模式中使用volatile最多。饿汉式，DCL懒汉式

> 饿汉式单例

```java
public class HungryMan{

    // 假设单例中存在很多的资源，这就可能导致资源浪费
    private byte[] data1 = new byte[1024*1024];
    private byte[] data2 = new byte[1024*1024];
    private byte[] data3 = new byte[1024*1024];
    private byte[] data4 = new byte[1024*1024];

    private HungryMan() {
    }
    
    // 一加载就创建对象
    private final static HungryMan HUNGRY_MAN = new HungryMan();

    public static HungryMan getInstance(){
        return HUNGRY_MAN;
    }
}
```

由于饿汉式单例一开始就创建了对象而不一定使用所以可能十分浪费内存，所以出现了懒汉式单例

> 懒汉式单例

```java
public class LazyMan{

    private LazyMan() {
    }

    private static LazyMan lazyMan;

    public static LazyMan getInstance(){
        if (lazyMan == null){
            lazyMan = new LazyMan();
        }
        return lazyMan;
    }
    
    // 测试多线程下单例
    public static void main(String[] args) {
        for(int i=1; i<=10; i++){
            new Thread(()->{
                System.out.println(LazyMan.getInstance());
            }).start();
        }
    }
}
```

但是这种单例是有问题的，在多线程的环境下会创建出多个单例对象。

> DCL懒汉式单例

```java
public class LazyMan{

    private LazyMan() {
    }

    private volatile static LazyMan lazyMan;

    // 双重检测锁模式的懒汉式单例 DCL懒汉式单例
    public static LazyMan getInstance(){
        if (lazyMan == null){
            synchronized (LazyMan.class){
                if (lazyMan == null){
                    lazyMan = new LazyMan();  // 还有一个问题就是：这不是原子性操作
                    /*
                    	1. 分配内存空间
                    	2. 执行构造方法，初始化对象
                    	3. 把这个对象指向这个空间
                    */
                }
            }
        }
        return lazyMan;
    }
    
    // 测试多线程下单例
    public static void main(String[] args) {
        for(int i=1; i<=10; i++){
            new Thread(()->{
                System.out.println(LazyMan.getInstance());
            }).start();
        }
    }
}
```

> 通过静态类实现单例

```java
public class LazyMan{
    private LazyMan() {
    }
    
    private static class createInstance{
        private static final LazyMan lazyMan = new LazyMan();
    }
    
    public static LazyMan getInstance(){
        return createInstance.lazyMan;
    }
    
    // 测试多线程下单例
    public static void main(String[] args) {
        for(int i=1; i<=10; i++){
            new Thread(()->{
                System.out.println(LazyMan.getInstance());
            }).start();
        }
    }
}
```

> 通过反射破解DCL懒汉式单例

```java
import java.lang.reflect.Constructor;
import java.lang.reflect.Field;
import java.lang.reflect.InvocationTargetException;

public class LazyMan{

    // 红绿灯机制  防止通过反射创建多个对象
    private static Boolean redAndGreen = false;

    private LazyMan() {

        /** 解决同时通过构造方法和反射获取对象
        synchronized (LazyMan.class){
            if (lazyMan != null){
                throw new RuntimeException("不是试图使用反射破坏单例模式");
            }
        }
        */

        /** 解决通过反射拿到多个对象，但是可以通过反射拿到一个对象
        synchronized (LazyMan.class){
            if (redAndGreen == false){
                redAndGreen = true;
            }else{
                throw new RuntimeException("不是试图使用反射破坏单例模式");
            }
        }
        */


    }

    private volatile static LazyMan lazyMan;

    public static LazyMan getInstance(){
        if (lazyMan == null){
            synchronized (LazyMan.class){
                if (lazyMan == null){
                    lazyMan = new LazyMan();
                }
            }
        }
        return lazyMan;
    }

    public static void main(String[] args) throws NoSuchMethodException, IllegalAccessException, InvocationTargetException, InstantiationException, NoSuchFieldException {
        /* 通过反射拿到多个对象
        LazyMan lazyMan1 = LazyMan.getInstance();
        LazyMan lazyMan2 = LazyMan.getInstance();
        System.out.println(lazyMan1==lazyMan2);
        // 通过反射获取构造器
        Constructor<LazyMan> constructor = LazyMan.class.getDeclaredConstructor(null);
        // 无视构造器的私有
        constructor.setAccessible(true);
        // 通过反射的构造器来创建对象
        LazyMan lazyMan3 = constructor.newInstance();
        LazyMan lazyMan4 = constructor.newInstance();
        System.out.println(lazyMan1 == lazyMan3);
        System.out.println(lazyMan3 == lazyMan4);
        */


        /* 同时通过构造方法和反射获取对象
        LazyMan lazyMan1 = LazyMan.getInstance();
        Constructor<LazyMan> constructor = LazyMan.class.getDeclaredConstructor(null);
        constructor.setAccessible(true);
        LazyMan lazyMan2 = constructor.newInstance();
        System.out.println(lazyMan2);
         */

        /* 又有一个问题：如果两个对象都是反射创建的怎么办? ——> 红绿灯
        Constructor<LazyMan> constructor = LazyMan.class.getDeclaredConstructor(null);
        constructor.setAccessible(true);
        LazyMan lazyMan1 = constructor.newInstance();
        LazyMan lazyMan2 = constructor.newInstance();
         */

        /* 通过反射解决红绿灯值的问题
        Constructor<LazyMan> constructor = LazyMan.class.getDeclaredConstructor(null);
        // 获取标签字段
        Field redAndGreen = LazyMan.class.getDeclaredField("redAndGreen");
        // 设置标签字段的可操作
        redAndGreen.setAccessible(true);
        constructor.setAccessible(true);
        LazyMan lazyMan1 = constructor.newInstance();
        // 将标签值修改回false
        redAndGreen.set(lazyMan1,false);
        LazyMan lazyMan2 = constructor.newInstance();
         */


        /* 枚举是如何解决反射修改问题的呢? 枚举自带单例模式
        newInstance()的源码中有这么一段：
        if ((clazz.getModifiers() & Modifier.ENUM) != 0)
            throw new IllegalArgumentException("Cannot reflectively create enum objects");
        */

    }
}
```

参考枚举阻止反射破解：

```java
import java.lang.reflect.Constructor;
import java.lang.reflect.InvocationTargetException;

public enum EnumDemo {
    Instance;

    public static EnumDemo getInstance(){
        return Instance;
    }
}

class Test{
    public static void main(String[] args) throws NoSuchMethodException, IllegalAccessException, InvocationTargetException, InstantiationException {
        EnumDemo enumDemo1 = EnumDemo.Instance;
        EnumDemo enumDemo2 = EnumDemo.Instance;
        System.out.println(enumDemo1 == enumDemo2);

        EnumDemo enumDemo3 = EnumDemo.getInstance();
        EnumDemo enumDemo4 = EnumDemo.getInstance();
        System.out.println(enumDemo3 == enumDemo4 );

        /*
        这里会抛出异常：Exception in thread "main" java.lang.NoSuchMethodException: org.example.EnumDemo.<init>()
        也就是说：枚举里压根就没有无参构造？但是可以看编译之后的target文件夹下的文件，是有无参构造的。
        --------------
        所以jdk骗了我们？
        使用反编译工具反编译一个枚举类可以发现:

            枚举类是有有参构造的：
                * Sole constructor.  Programmers cannot invoke this constructor.
                * It is for use by code emitted by the compiler in response to
                * enum type declarations.
                *
                * @param name - The name of this enum constant, which is the identifier
                *               used to declare it.
                * @param ordinal - The ordinal of this enumeration constant (its position
                *         in the enum declaration, where the initial constant is assigned
                *         an ordinal of zero).

                protected Enum(String name, int ordinal) {
                    this.name = name;
                    this.ordinal = ordinal;
                }

        Constructor<EnumDemo> constructor = EnumDemo.class.getDeclaredConstructor(null);
        constructor.setAccessible(true);
        EnumDemo enumDemo5 = constructor.newInstance();
        */

        /* 使用有参构造来破解
            这里会抛出异常：Exception in thread "main" java.lang.IllegalArgumentException: Cannot reflectively create enum objects
            这才是使用反射破解枚举应该抛出的异常
         */
        Constructor<EnumDemo> constructor = EnumDemo.class.getDeclaredConstructor(String.class, int.class);
        constructor.setAccessible(true);
        EnumDemo enumDemo5 =constructor.newInstance();

    }
}
```







# Condition 控制线程通信

Condition 接口描述了可能会与锁有关联的条件变量。这些变量在用 法上与使用 Object.wait 访问的隐式监视器类似，但提供了更强大的功能。需要特别指出的是，单个 Lock 可能与多个 Condition 对象关联。在 Condition 对象中，**与 wait、notify 和 notifyAll 方法对应的分别是 await、signal 和 signalAll**。Condition 实例实质上被绑定到一个锁上。要为特定 Lock 实例获得 Condition 实例，需要使用其`newCondition()`方法。

如果不是使用`synchronized`关键字来进行同步操作而是使用Lock对象来加锁的话，系统中不存在隐式的同步监视器，也就不能使用`wait()` ，`notify()`，`notifyAll()`来进行线程之间的通信了。Java提供了一个`Condition`类来保持Lock锁同步方式线程之间的通信。

**生产者消费者示例：**

```java
public class ProductorAndConsumerForLock {

	public static void main(String[] args) {
		Clerk clerk = new Clerk();

		Productor pro = new Productor(clerk);
		Consumer con = new Consumer(clerk);

		new Thread(pro, "生产者 A").start();
		new Thread(con, "消费者 B").start();

//		 new Thread(pro, "生产者 C").start();
//		 new Thread(con, "消费者 D").start();
	}

}

class Clerk {
	private int product = 0;

	private Lock lock = new ReentrantLock();
	private Condition condition = lock.newCondition();  //获得Lock实例的Condition实例
    
	// 进货
	public void get() {
		lock.lock();
		try {
			if (product >= 1) { // 为了避免虚假唤醒，应该总是使用在循环中。
				System.out.println("产品已满！");
				try {
					condition.await();
				} catch (InterruptedException e) {
				}
			}
			System.out.println(Thread.currentThread().getName() + " : " + ++product);
			condition.signalAll();
		} finally {
			lock.unlock();
		}
	}

	//售货
	public void sale() {
		lock.lock();
		try {
			if (product <= 0) {
				System.out.println("缺货！");
				try {
					condition.await();
				} catch (InterruptedException e) {
				}
			}
			System.out.println(Thread.currentThread().getName() + " : " + --product);
			condition.signalAll();
		} finally {
			lock.unlock();
		}
	}
}

// 生产者
class Productor implements Runnable {
	private Clerk clerk;
	public Productor(Clerk clerk) {
		this.clerk = clerk;
	}

	@Override
	public void run() {
		for (int i = 0; i < 20; i++) {
			try {
				Thread.sleep(200);
			} catch (InterruptedException e) {
				e.printStackTrace();
			}
			clerk.get();   //调用店员进货方法
		}
	}
}

// 消费者
class Consumer implements Runnable {
	private Clerk clerk;
	public Consumer(Clerk clerk) {
		this.clerk = clerk;
	}

	@Override
	public void run() {
		for (int i = 0; i < 20; i++) {
			clerk.sale();	//调用店员售货方法
		}
	}

}
```

**交替打印示例:**

```java
public class ABCAlternate {
	
	public static void main(String[] args) {
		AlternateDemo ad = new AlternateDemo();
		
		new Thread(new Runnable() {
			@Override
			public void run() {
				for (int i = 1; i <= 20; i++) {
					ad.loopA(i);
				}
			}
		}, "A").start();
		
		new Thread(new Runnable() {
			@Override
			public void run() {
				for (int i = 1; i <= 20; i++) {
					ad.loopB(i);
				}
			}
		}, "B").start();
		
		new Thread(new Runnable() {
			@Override
			public void run() {
				for (int i = 1; i <= 20; i++) {
					ad.loopC(i);
					System.out.println("-----------------------------------");
				}
			}
		}, "C").start();
	}
}

class AlternateDemo{
	private int number = 1; //当前正在执行线程的标记
	
	private Lock lock = new ReentrantLock();
	private Condition condition1 = lock.newCondition();
	private Condition condition2 = lock.newCondition();
	private Condition condition3 = lock.newCondition();
	
	/**
	 * @param totalLoop : 循环第几轮
	 */
	public void loopA(int totalLoop){
		lock.lock();
		
		try {
			//1. 判断
			if(number != 1){
				condition1.await();   //线程A等待
			}
			
			//2. 打印
			for (int i = 1; i <= 1; i++) {
				System.out.println(Thread.currentThread().getName() + "\t" + i + "\t" + totalLoop);
			}
			
			//3. 唤醒
			number = 2;
			condition2.signal();  //唤醒B线程
		} catch (Exception e) {
			e.printStackTrace();
		} finally {
			lock.unlock();
		}
	}
	
	public void loopB(int totalLoop){
		lock.lock();
		
		try {
			//1. 判断
			if(number != 2){
				condition2.await();		//线程B等待
			}
			
			//2. 打印
			for (int i = 1; i <= 1; i++) {
				System.out.println(Thread.currentThread().getName() + "\t" + i + "\t" + totalLoop);
			}
			
			//3. 唤醒
			number = 3;
			condition3.signal();		//唤醒C线程
		} catch (Exception e) {
			e.printStackTrace();
		} finally {
			lock.unlock();
		}
	}
	
	public void loopC(int totalLoop){
		lock.lock();
		
		try {
			//1. 判断
			if(number != 3){
				condition3.await();		//C线程等待
			}
			
			//2. 打印
			for (int i = 1; i <= 1; i++) {
				System.out.println(Thread.currentThread().getName() + "\t" + i + "\t" + totalLoop);
			}
			
			//3. 唤醒
			number = 1;
			condition1.signal();		//唤醒A线程
		} catch (Exception e) {
			e.printStackTrace();
		} finally {
			lock.unlock();
		}
	}
}
```

# 读写锁

实现类：`ReentranReadWriteLock`，`ReadWriteLock`维护一对关联的`lock`，一个用于只读操作，一个用于写入。只要没有写入操作，读取锁可以由多个 reader 线程同时保持，写入锁是独占的。

读写锁允许访问共享数据时的并发性高于互斥锁所允许的并发性。 它利用了这样一个事实：一次只有一个线程（  *写入*线程）可以修改共享数据，在许多情况下，任何数量的线程都可以同时读取数据（读取器线程）。  从理论上讲，通过使用读写锁允许的并发性增加将导致性能改进超过使用互斥锁。  实际上，并发性的增加只能在多处理器上完全实现，然后只有在共享数据的访问模式是合适时才可以。 

```java
import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.locks.ReadWriteLock;
import java.util.concurrent.locks.ReentrantReadWriteLock;


public class ReentrantLockDemo{

    public static void main(String[] args) {
        MyCacheLocked cache = new MyCacheLocked();
        // 写入
        for (int i=1; i<=6; i++){
            final int temp1 = i;
            new Thread(()->{
                cache.put(String.valueOf(temp1), temp1);
            },String.valueOf(i)).start();
        }
        // 读取
        for (int i=1; i<=6; i++){
            final int temp2 = i;
            new Thread(()->{
                Object o = cache.get(String.valueOf(temp2));
                System.out.println(o);
            },String.valueOf(i)).start();
        }
    }
}
// 自定义缓存
class MyCache{
    private volatile Map<String,Object> map = new HashMap<>();

    public void put(String key, Object value){
        System.out.println(Thread.currentThread().getName()+"线程正在写入");
        map.put(key, value);
        System.out.println(Thread.currentThread().getName()+"线程写入ok");
    }

    public Object get(String key){
        System.out.println(Thread.currentThread().getName()+"线程正在读取");
        Object o = map.get(key);
        System.out.println(Thread.currentThread().getName()+"线程读取ok");
        return o;
    }
}
// 加入读写锁
class MyCacheLocked{
    private volatile Map<String,Object> map = new HashMap<>();
    private ReadWriteLock readWriteLocklock = new ReentrantReadWriteLock();

    // 写的时候只允许一个线程写入
    public void put(String key, Object value){
        // 加入写锁，也叫独享锁
        readWriteLocklock.writeLock().lock();
        try {
            System.out.println(Thread.currentThread().getName() + "线程正在写入");
            map.put(key, value);
            System.out.println(Thread.currentThread().getName() + "线程写入ok");
        }catch (Exception e){
            e.printStackTrace();
        }finally {
            readWriteLocklock.writeLock().unlock();
        }
    }

    // 读的时候允许多个线程读取
    public Object get(String key){
        Object o = null;
        // 加入读锁，也叫共享锁
        readWriteLocklock.readLock().lock();
        try{
            System.out.println(Thread.currentThread().getName()+"线程正在读取");
            o = map.get(key);
            System.out.println(Thread.currentThread().getName()+"线程读取ok");

        }catch (Exception e){
            e.printStackTrace();
        }finally {
            readWriteLocklock.readLock().unlock();
        }
        return o;
    }
}
```



# 可重入锁

递归锁，拿到外部的锁就拿到了内部的锁

```java
public class LockTest1{
    public static void main(String[] args) {
        Phone phone = new Phone();

        new Thread(()->{
            phone.sendMsg();
        },"a").start();

        new Thread(()->{
            phone.sendMsg();
        },"b").start();
    }
}

class Phone{

    public synchronized void sendMsg(){
        System.out.println(Thread.currentThread().getName()+"发信息");
        call(); // 获取到call方法的锁
    }

    public synchronized void call(){
        System.out.println(Thread.currentThread().getName()+"打电话");
    }
}
```

Lock版看得更加明显：

```java
import java.util.concurrent.locks.Lock;
import java.util.concurrent.locks.ReentrantLock;

public class LockTest2{
    public static void main(String[] args) {
        Phone phone = new Phone();

        new Thread(()->{
            phone.sendMsg();
        },"a").start();

        new Thread(()->{
            phone.sendMsg();
        },"b").start();
    }
}

class Phone{
    Lock lock = new ReentrantLock();

    public void sendMsg(){
        lock.lock();
        try {
            System.out.println(Thread.currentThread().getName()+"发信息");
            call(); // 获取到call方法的锁
        } catch (Exception e) {
            e.printStackTrace();
        }
        finally {
            lock.unlock();
        }
    }

    public void call(){
        lock.lock();
        try{
            System.out.println(Thread.currentThread().getName()+"打电话");
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            lock.unlock();
        }
    }
}
```



# 自旋锁

spinlock，不断尝试直到成功为止。

```java
package org.example;

import java.util.concurrent.TimeUnit;
import java.util.concurrent.atomic.AtomicReference;

public class SpinLockDemo{
    public static void main(String[] args) throws InterruptedException {
        SpinLock lock = new SpinLock();

        new Thread(()->{
            lock.lock();
            try{
                TimeUnit.SECONDS.sleep(3);
            } catch (InterruptedException e) {
                e.printStackTrace();
            } finally {
                lock.unlock();
            }
        },"a").start();

        TimeUnit.SECONDS.sleep(1);

        new Thread(()->{
            lock.lock();
            try{
            }finally {
                lock.unlock();
            }
        },"b").start();
    }
}

// 通过CAS实现自旋锁
class SpinLock {

    AtomicReference<Thread> atomicReference = new AtomicReference();

    public void lock(){
        System.out.println(Thread.currentThread().getName()+"加锁操作");
        // 自旋锁
        while (!atomicReference.compareAndSet(null,Thread.currentThread())){
            // 自旋操作
        }
    }

    public void unlock(){
        System.out.println(Thread.currentThread().getName()+"解锁操作");
        atomicReference.compareAndSet(Thread.currentThread(),null);
    }
}
```

# 死锁

死锁的四要素

死锁测试、排除

```java
import java.util.concurrent.TimeUnit;

public class DeadLockDemo{
    public static void main(String[] args) throws InterruptedException {
        String lockA = "lockA";
        String lockB = "lockB";

        new Thread(new Lock(lockA,lockB),"线程A").start();
        new Thread(new Lock(lockB,lockA),"线程B").start();
    }
}

class Lock implements Runnable{

    private String lockA;
    private String lockB;

    public Lock(String lockA, String lockB) {
        this.lockA = lockA;
        this.lockB = lockB;
    }

    @Override
    public void run() {
        synchronized (lockA){
            System.out.println(Thread.currentThread().getName()+"持有锁:"+lockA+"  尝试获取锁:"+lockB);

            try {
                TimeUnit.SECONDS.sleep(1);
            } catch (InterruptedException e) {
                e.printStackTrace();
            }

            synchronized (lockB){
                System.out.println(Thread.currentThread().getName()+"持有锁:"+lockA+"尝试获取锁:"+lockB);
            }
        }
    }
}
```

> 死锁排查：

使用jps定位进程号`jsp -l`

使用jstack加进程号查看堆栈详细信息`jstack xxx`





锁加强：读写锁，公平锁/非公平锁，可重入锁，自旋锁，乐观锁，悲观锁，死锁







# 线程池 

> [聊聊并发 —— Java线程池的分析和使用](https://www.infoq.cn/article/java-threadPool)

程序的运行会消耗系统的资源 ——>优化资源的使用，——>使用池化技术（线程池，连接池，内存池，对象池...）

线程池的优势：

线程池做的工作是控制运行到的线程的数量，处理过程中将任务放入队列，然后再线程创建后启动这些任务，如果线程数量超过了最大数量，超出的数量的线程排队等待，等其他线程执行完毕再从队列中取出任务来执行。（线程复用，控制并发数，易于管理）

- 降低资源消耗：t过重复利用已创建的线程降低线程创建和销毁造成的消耗。
- 提高响应速度：提高响应速度。当任务到达时，任务可以不需要等待线程的创建就可以立即执行。
- 提高线程的可管理性。线程是稀缺资源，如果无限制的创建，不仅会消耗系统资源还会降低系统的稳定性，使用线程池可以进行统一的分配，调优和监控。

## 三大方法

```java
import java.util.concurrent.*;

public class ThreadPoolDemo{
    public static void main(String[] args) {
        // 线程池的三大方法
        // Executors是一个工具类，可以用来创建线程
        
        // 创建单一线程
        ExecutorService singleThreadPool = Executors.newSingleThreadExecutor();
        // 创建包含指定数量线程的线程池
        ExecutorService fixedThreadPool =  Executors.newFixedThreadPool(3);
        // 创建可变化数量的线程池
        ExecutorService cachedThreadPool = Executors.newCachedThreadPool();

        //使用线程池创建线程
        try{
            for(int i=1; i<=6; i++){
                singleThreadPool.execute(()->{
                    System.out.println(Thread.currentThread().getName()+"ok");
                });
            }
        }finally {
            // 线程池使用完毕之后要记得关闭
            singleThreadPool.shutdown();
        }

        try{
            for(int i=1; i<=6; i++){
                fixedThreadPool.execute(()->{
                    System.out.println(Thread.currentThread().getName()+"ok");
                });
            }
        }finally {
            fixedThreadPool.shutdown();
        }

        try {
            for (int i=1; i<=6; i++){
                cachedThreadPool.execute(()->{
                    System.out.println(Thread.currentThread().getName()+"ok");
                });
            }
        }finally {
            cachedThreadPool.shutdown();
        }
    }
}
```

## 七大参数

```java
public static ExecutorService newSingleThreadExecutor() {
    return new FinalizableDelegatedExecutorService
        (new ThreadPoolExecutor(1, 1,
                                0L, TimeUnit.MILLISECONDS,
                                new LinkedBlockingQueue<Runnable>()));
}

public static ExecutorService newFixedThreadPool(int nThreads) {
    return new ThreadPoolExecutor(nThreads, nThreads,
                                  0L, TimeUnit.MILLISECONDS,
                                  new LinkedBlockingQueue<Runnable>());
}

public static ExecutorService newCachedThreadPool() {
    return new ThreadPoolExecutor(0, Integer.MAX_VALUE,
                                  60L, TimeUnit.SECONDS,
                                  new SynchronousQueue<Runnable>());
}

public ThreadPoolExecutor(int corePoolSize,
                              int maximumPoolSize,
                              long keepAliveTime,
                              TimeUnit unit,
                              BlockingQueue<Runnable> workQueue) {
        this(corePoolSize, maximumPoolSize, keepAliveTime, unit, workQueue,
             Executors.defaultThreadFactory(), defaultHandler);
    }

public ThreadPoolExecutor(
    int corePoolSize,   // 核心线程数
    int maximumPoolSize,    // 最大核心线程池大小
    long keepAliveTime, // 最大存活时间，超过多长时间没人调用就释放
    TimeUnit unit,  // 存活时间的单位
    BlockingQueue<Runnable> workQueue,  // 阻塞队列
    ThreadFactory threadFactory,    // 线程工厂，用于创建线程，一般不用动
    RejectedExecutionHandler handler    // 拒绝策略
    ){...}

/**    
阿里巴巴建议：
    线程池不允许使用Executors创建，而是通过ThreadPoolExecutor的方式创建，这样更有利于理解线程池的运行规则，避免资源耗尽的风险。
    说明：
        FixedThreadPool和SingalThreadPool 允许的请求队列长度为：Integer.MAX_VALUE，可能会堆积大量请求，从而导致OOM
        CachedThreadPool和ScheduledThreadPool 允许的创建线程数量为：Integer.MAX_VALUE 可能会创建大量线程，从而导致OOM
*/
```

手动创建一个线程池：

```java
import java.util.concurrent.*;

public class MyThreadPoolDemo{
    public static void main(String[] args) {
        ExecutorService myThreadPool = new ThreadPoolExecutor(
            2,5,3,TimeUnit.SECONDS,
            new LinkedBlockingQueue(3), Executors.defaultThreadFactory(),
            new ThreadPoolExecutor.AbortPolicy());

        try{
            // 这里最大为8,大于8个就会触发拒绝策略:5+3
            // 触发java.util.concurrent.RejectedExecutionException 异常
            for(int i=1; i<=8; i++){
                myThreadPool.execute(()->{
                    System.out.println(Thread.currentThread().getName()+"ok");
                });
            }
        }finally {
            myThreadPool.shutdown();
        }
    }
}
```

四种拒绝策略

```java
AbortPolicy		// 抛出异常
CallerRunsPolicy  // 发起者执行该线程
DiscardPolicy	// 忽略，不会抛出异常
DiscardOldestPolicy	// 尝试使用最先启动的线程，如果最先启动的线程还没有执行完成，则忽略，也不会抛出异常
```

**那么问题来了（调优）：`maximumPoolSize`的值应该如何设置？**

1. CPU几核就设置多少。——CPU密集型

   ```java
   import java.util.concurrent.*;
   
   public class MyThreadPoolDemo{
       public static void main(String[] args) {
           ExecutorService myThreadPool = new ThreadPoolExecutor(2,
                   Runtime.getRuntime().availableProcessors(),
                   3,TimeUnit.SECONDS,
                   new LinkedBlockingQueue(3), Executors.defaultThreadFactory(),
                   new ThreadPoolExecutor.DiscardOldestPolicy());
   
           try{
               for(int i=1; i<=13; i++){
                   myThreadPool.execute(()->{
                       System.out.println(Thread.currentThread().getName()+"ok");
                   });
               }
           }finally {
               myThreadPool.shutdown();
           }
       }
   }
   ```

   

2. 根据根据程序中需要多少个十分消耗资源的IO连接线程来设定，一般设置为IO连接线程的两倍——IO密集型





> 参考：
>
> [Java之JUC](https://www.cnblogs.com/linkworld/p/7819270.html)
>
> [Java并发编程JUC学习总结](https://www.cnblogs.com/chenpi/p/5614290.html)
>
> [JUC](https://www.jianshu.com/p/1f19835e05c0)
>
> [并发编程网之JUC](http://ifeve.com/tag/juc/)
>
> [聊聊并发 —— Java SE1.6中的Synchronized](https://www.infoq.cn/article/java-se-16-synchronized)