---
title: Java多线程之 线程的基本操作
date: 2020-07-26 20:20:34
tags: Java-多线程
categories: Java



---

-

<!--more-->

# 线程的基本操作

## 等待和唤醒

### wait()，notify()和notifyAll()等方法

在`Object.java`中，定义了`wait()`，`notify()`和`notifyAll()`等接口。`wait()`的作用是让当前线程进入等待状态，同时，`wait()`也会让当前线程释放它所持有的锁。而`notify()`和`notifyAll()`的作用，则是唤醒当前对象上的等待线程；`notify()`是唤醒单个线程，而`notifyAll()`是唤醒所有的线程。

Object类中关于等待/唤醒的API详细信息如下：

| API接口                           | API说明                                                      |
| --------------------------------- | ------------------------------------------------------------ |
| **notify()**                      | 唤醒在此对象监视器上等待的单个线程。                         |
| **notifyAll()**                   | 唤醒在此对象监视器上等待的所有线程。                         |
| **wait()**                        | 让当前线程处于“等待(阻塞)状态”，“直到其他线程调用此对象的 notify() 方法或 notifyAll() 方法”，当前线程被唤醒(进入“就绪状态”)。 |
| **wait(long timeout)**            | 让当前线程处于“等待(阻塞)状态”，“直到其他线程调用此对象的 notify() 方法或 notifyAll() 方法，或者超过指定的时间量”，当前线程被唤醒(进入“就绪状态”)。 |
| **wait(long timeout, int nanos)** | 让当前线程处于“等待(阻塞)状态”，“直到其他线程调用此对象的 notify() 方法或 notifyAll() 方法，或者其他某个线程中断当前线程，或者已超过某个实际时间量”，当前线程被唤醒(进入“就绪状态”)。 |

###  wait() 和 notify() 

下面通过示例演示`wait()`和`notify()`配合使用的情形。

```java
class ThreadA extends Thread{

    public ThreadA(String name) {
        super(name);
    }

    public void run() {
        synchronized (this) {
            System.out.println(Thread.currentThread().getName()+" call notify()");
            // 唤醒当前的wait线程
            notify();
        }
    }
}

public class WaitTest {

    public static void main(String[] args) {

        ThreadA t1 = new ThreadA("t1");

        synchronized(t1) {
            try {
                System.out.println(Thread.currentThread().getName()+" start t1");
                t1.start();

                // 主线程等待t1通过notify()唤醒。
                System.out.println(Thread.currentThread().getName()+" wait()");
                t1.wait();

                System.out.println(Thread.currentThread().getName()+" continue");
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
        }
    }
}
```

运行结果：

```java
main start t1
main wait()
t1 call notify()
main continue
```

结果说明：
如下图，说明了主线程和线程`t1`的流程。

- 图中主线程代表主线程main。线程`t1`代表`WaitTest`中启动的线程`t1`。 而锁代表`t1`这个对象的同步锁。
- 主线程通过`new ThreadA("t1")`新建线程`t1`。随后通过`synchronized(t1)`获取`t1`对象的同步锁。然后调用`t1.start()`启动线程`t1`。
- 主线程执行`t1.wait()`释放`t1`对象的锁并且进入等待(阻塞)状态。等待`t1`对象上的线程通过`notify()`或`notifyAll()`将其唤醒。
- 线程`t1`运行之后，通过`synchronized(this)`获取当前对象的锁；接着调用`notify()`唤醒当前对象上的等待线程，也就是唤醒主线程。
- 线程`t1`运行完毕之后，释放当前对象的锁。紧接着，主线程获取`t1`对象的锁，然后接着运行。

![](https://s1.ax1x.com/2020/07/05/UpZM6O.png)

对于上面的代码？曾经有个朋友问到过：`t1.wait()`应该是让线程`t1`等待；但是，为什么却是让主线程main等待了呢？
在解答该问题前，我们先看看jdk文档中关于`wait`的一段介绍：

>Causes the current thread to wait until another thread invokes the notify() method or the notifyAll() method for this object. 
>In other words, this method behaves exactly as if it simply performs the call wait(0).
>The current thread must own this object's monitor. The thread releases ownership of this monitor and waits until another thread notifies threads waiting on this object's monitor to wake up either through a call to the notify method or the notifyAll method. The thread then waits until it can re-obtain ownership of the monitor and resumes execution.

中文意思大概是：

引起当前线程等待，直到另外一个线程调用`notify()`或`notifyAll()`唤醒该线程。换句话说：这个方法和`wait(0)`的效果一样！(补充:**对于`wait(long millis)`方法，当millis为0时，表示无限等待，直到被notify()或notifyAll()唤醒)。**
**当前线程在调用`wait()`时，必须拥有该对象的同步锁。**该线程调用`wait()`之后，会释放该锁；然后一直等待直到其它线程调用对象的同步锁的`notify()`或`notifyAll()`方法。然后，该线程继续等待直到它重新获取该对象的同步锁，然后就可以接着运行。

注意：**jdk的解释中，说`wait()`的作用是让当前线程等待，而当前线程是指正在cpu上运行的线程！**
这也意味着，虽然`t1.wait()`是通过线程`t1`调用的`wait()`方法，但是调用`t1.wait()`的地方是在主线程main中。而主线程必须是当前线程，也就是运行状态，才可以执行`t1.wait()`。所以，此时的当前线程是主线程main！因此，`t1.wait()`是让主线程等待，而不是线程`t1`！

### wait(long timeout) 和 notify() 

`wait(long timeout)`会让当前线程处于等待(阻塞)状态，直到其他线程调用此对象的`notify()`方法或`notifyAll()`方法，或者超过指定的时间量，当前线程被唤醒(进入就绪状态)。

下面的示例就是演示`wait(long timeout)`在超时情况下，线程被唤醒的情况。

```java
class ThreadA extends Thread{

    public ThreadA(String name) {
        super(name);
    }

    public void run() {
        System.out.println(Thread.currentThread().getName() + " run ");
        while(true){}
    }
}

public class WaitTimeoutTest {

    public static void main(String[] args) {

        ThreadA t1 = new ThreadA("t1");

        synchronized(t1) {
            try {
                System.out.println(Thread.currentThread().getName() + " start t1");
                t1.start();

                // 主线程等待t1通过notify()唤醒 或 notifyAll()唤醒，或超过3000ms延时；然后才被唤醒。
                System.out.println(Thread.currentThread().getName() + " call wait ");
                t1.wait(3000);

                System.out.println(Thread.currentThread().getName() + " continue");
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
        }
    }
}
```

运行结果：

```java
main start t1
main call wait 
t1 run                  // 大约3秒之后...输出 main continue
main continue
```

结果说明：

- 主线程`main`执行`t1.start()`启动线程`t1`。
- 主线程`main`执行`t1.wait(3000)`，此时，主线程进入阻塞状态。需要用于`t1`对象锁的线程通过`notify()`或者`notifyAll()`将其唤醒”或者超时3000ms之后，主线程`main`才进入到就绪状态，然后才可以运行。
- 线程`t1`运行之后，进入了死循环，一直不断的运行。
- 超时3000ms之后，主线程`main`会进入到就绪状态，然后接着进入运行状态。

### wait() 和 notifyAll()

通过前面的示例，我们知道`notify()`可以唤醒在此对象监视器上等待的单个线程。下面，我们通过示例演示`notifyAll()`的用法；它的作用是唤醒在此对象监视器上等待的所有线程。

```java
public class NotifyAllTest {

    private static Object obj = new Object();
    public static void main(String[] args) {

        ThreadA t1 = new ThreadA("t1");
        ThreadA t2 = new ThreadA("t2");
        ThreadA t3 = new ThreadA("t3");
        t1.start();
        t2.start();
        t3.start();

        try {
            System.out.println(Thread.currentThread().getName()+" sleep(3000)");
            Thread.sleep(3000);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }

        synchronized(obj) {
            // 主线程等待唤醒。
            System.out.println(Thread.currentThread().getName()+" notifyAll()");
            obj.notifyAll();
        }
    }

    static class ThreadA extends Thread{

        public ThreadA(String name){
            super(name);
        }

        public void run() {
            synchronized (obj) {
                try {
                    System.out.println(Thread.currentThread().getName() + " wait");

                    // 唤醒当前的wait线程
                    obj.wait();

                    System.out.println(Thread.currentThread().getName() + " continue");
                } catch (InterruptedException e) {
                    e.printStackTrace();
                }
            }
        }
    }
}
```

运行结果：

```
main sleep(3000)
t1 wait
t3 wait
t2 wait
main notifyAll()
t2 continue
t3 continue
```

结果说明：

- 主线程中新建并启动了三个线程`t1`，`t2`和`t3`。
- 主线程通过sleep(3000)休眠2秒。在主线程休眠3秒的过程中，假设`t1`, `t2`和`t3`这3个线程都运行了。以`t1`为例，当它运行的时候，它会执行`obj.wait()`等待其它线程通过`notify()`或`nofityAll()`来唤醒它；相同的道理，`t2`和`t3`也会等待其它线程通过`nofity()`或`nofityAll()`来唤醒它们。
- 主线程休眠3秒之后，接着运行。执行`obj.notifyAll()`唤醒`obj`上的等待线程，即唤醒`t1`, `t2`和`t3`这3个线程。 紧接着，主线程的`synchronized(obj)`运行完毕之后，主线程释放`obj锁`。这样，`t1`, `t2`和`t3`就可以获取`obj锁`而继续运行了！

### 为什么 notify()，wait()等函数定义在 Object 中，而不是 Thread 中

`Object`中的`wait()`, `notify()`等函数，和`synchronized`一样，会对对象的同步锁进行操作。

`wait()`会使当前线程等待，因为线程进入等待状态，所以线程应该释放它锁持有的同步锁，否则其它线程获取不到该同步锁而无法运行！
OK，线程调用`wait()`之后，会释放它锁持有的同步锁；而且，根据前面的介绍，我们知道：等待线程可以被`notify()`或`notifyAll()`唤醒。

**现在，请思考一个问题：`notify()`是依据什么唤醒等待线程的？或者说，`wait()`等待线程和`notify()`之间是通过什么关联起来的？**

答案是：依据对象的同步锁。

负责唤醒等待线程的那个线程(称为唤醒线程)，它只有在获取该对象的同步锁(这里的同步锁必须和等待线程的同步锁是同一个)，并且调用`notify()`或`notifyAll()`方法之后，才能唤醒等待线程。虽然，等待线程被唤醒；但是，它不能立刻执行，因为唤醒线程还持有该对象的同步锁。必须等到唤醒线程释放了对象的同步锁之后，等待线程才能获取到对象的同步锁进而继续运行。

**总之，`notify()`, `wait()`依赖于同步锁，而同步锁是对象锁持有，并且每个对象有且仅有一个！这就是为什么`notify()`,  `wait()`等函数定义在`Object`类，而不是`Thread`类中的原因。**

## 让步

`yield()`方法的作用是让步。它能让当前线程由运行状态进入到就绪状态，从而让其它具有相同优先级的等待线程获取执行权；但是，并不能保证在当前线程调用`yield()`之后，其它具有相同优先级的线程就一定能获得执行权；也有可能是当前线程又进入到运行状态继续运行！

### yield() 和 wait() 比较

我们知道，`wait()`的作用是让当前线程由运行状态进入等待(阻塞)状态的同时，也会释放同步锁。而`yield()`的作用是让步，它也会让当前线程离开运行状态。它们的区别是：

1. `wait()`是让线程由运行状态进入到等待(阻塞)状态，而不`yield()`是让线程由运行状态进入到就绪状态。
2. `wait()`是会线程释放它所持有对象的同步锁，而`yield()`方法不会释放锁。

下面通过示例演示`yield()`是不会释放锁的。

````java
public class YieldLockTest{ 

    private static Object obj = new Object();

    public static void main(String[] args){ 
        ThreadA t1 = new ThreadA("t1"); 
        ThreadA t2 = new ThreadA("t2"); 
        t1.start(); 
        t2.start();
    } 

    static class ThreadA extends Thread{
        public ThreadA(String name){ 
            super(name); 
        } 
        public void run(){ 
            // 获取obj对象的同步锁
            synchronized (obj) {
                for(int i=0; i <10; i++){ 
                    System.out.printf("%s [%d]:%d\n", this.getName(), this.getPriority(), i); 
                    // i整除4时，调用yield
                    if (i%4 == 0)
                        Thread.yield();
                }
            }
        } 
    } 
} 
````

运行结果：

```
t1 [5]:0
t1 [5]:1
t1 [5]:2
t1 [5]:3
t1 [5]:4
t1 [5]:5
t1 [5]:6
t1 [5]:7
t1 [5]:8
t1 [5]:9
t2 [5]:0
t2 [5]:1
t2 [5]:2
t2 [5]:3
t2 [5]:4
t2 [5]:5
t2 [5]:6
t2 [5]:7
t2 [5]:8
t2 [5]:9
```

结果说明：
主线程`main`中启动了两个线程`t1`和`t2`。`t1`和`t2`在`run()`会引用同一个对象的同步锁，即`synchronized(obj)`。在`t1`运行过程中，虽然它会调用`Thread.yield()`；但是，`t2`是不会获取`cpu`执行权的。因为，`t1`并没有释放`obj`所持有的同步锁！

## 休眠

`sleep()`方法定义在`Thread.java`中。`sleep()`的作用是让当前线程休眠，即当前线程会从运行状态进入到休眠(阻塞)状态。`sleep()`会指定休眠时间，线程休眠的时间会大于/等于该休眠时间；在线程重新被唤醒时，它会由阻塞状态变成就绪状态，从而等待cpu的调度执行。

### sleep() 和 wait() 比较

我们知道，`wait()`的作用是让当前线程由运行状态进入等待(阻塞)状态的同时，也会释放同步锁。而`sleep()`的作用是也是让当前线程由运行状态进入到休眠(阻塞)状态。但是，`wait()`会释放对象的同步锁，而`sleep()`则不会释放锁。

下面通过示例演示`sleep()`是不会释放锁的。

```java
public class SleepLockTest{ 

    private static Object obj = new Object();

    public static void main(String[] args){ 
        ThreadA t1 = new ThreadA("t1"); 
        ThreadA t2 = new ThreadA("t2"); 
        t1.start(); 
        t2.start();
    } 

    static class ThreadA extends Thread{
        public ThreadA(String name){ 
            super(name); 
        } 
        public void run(){ 
            // 获取obj对象的同步锁
            synchronized (obj) {
                try {
                    for(int i=0; i <10; i++){ 
                        System.out.printf("%s: %d\n", this.getName(), i); 
                        // i能被4整除时，休眠100毫秒
                        if (i%4 == 0)
                            Thread.sleep(100);
                    }
                } catch (InterruptedException e) {
                    e.printStackTrace();
                }
            }
        } 
    } 
} 
```

运行结果：

```java
t1: 0
t1: 1
t1: 2
t1: 3
t1: 4
t1: 5
t1: 6
t1: 7
t1: 8
t1: 9
t2: 0
t2: 1
t2: 2
t2: 3
t2: 4
t2: 5
t2: 6
t2: 7
t2: 8
t2: 9
```

结果说明：
主线程`main`中启动了两个线程`t1`和`t2`。`t1`和`t2`在`run()`会引用同一个对象的同步锁，即`synchronized(obj)`。在`t1`运行过程中，虽然它会调用`Thread.sleep(100)`；但是，`t2`是不会获取cpu执行权的。因为，`t1`并没有释放`obj`所持有的同步锁！

注意，若注释掉`synchronized (obj)`后再次执行该程序，`t1`和`t2`是可以相互切换的。

## join() 

`join()`定义在`Thread.java`中。作用是：让主线程等待子线程结束之后才能继续运行。这句话可能有点晦涩，我们还是通过例子去理解：

```java
// 主线程
public class Father extends Thread {
    public void run() {
        Son s = new Son();
        s.start();
        s.join();
        ...
    }
}
// 子线程
public class Son extends Thread {
    public void run() {
        ...
    }
}
```

说明： 

上面的有两个类`Father`(主线程类)和`Son`(子线程类)。因为`Son`是在`Father`中创建并启动的，所以，`Father`是主线程类，`Son`是子线程类。 在`Father`主线程中，通过`new Son()`新建`子线程s`。接着通过`s.start()`启动`子线程s`，并且调用`s.join()`。在调用`s.join()`之后，`Father`主线程会一直等待，直到`子线程s`运行完毕；在`子线程s`运行完毕之后，`Father`主线程才能接着运行。 这也就是我们所说的`join()`的作用：是让主线程会等待子线程结束之后才能继续运行！



## interrupt()和线程终止方式

### Interrupt() 说明

在学习终止线程的方式之前，有必要先对`interrupt()`进行了解。关于`interrupt()`，Java的[JDK 文档描述](http://docs.oracle.com/javase/8/docs/api/)

>Interrupts this thread.
>Unless the current thread is interrupting itself, which is always permitted, the checkAccess method of this thread is invoked, which may cause a SecurityException to be thrown.
>
>If this thread is blocked in an invocation of the wait(), wait(long), or wait(long, int) methods of the Object class, or of the join(), join(long), join(long, int), sleep(long), or sleep(long, int), methods of this class, then its interrupt status will be cleared and it will receive an InterruptedException.
>
>If this thread is blocked in an I/O operation upon an interruptible channel then the channel will be closed, the thread's interrupt status will be set, and the thread will receive a ClosedByInterruptException.
>
>If this thread is blocked in a Selector then the thread's interrupt status will be set and it will return immediately from the selection operation, possibly with a non-zero value, just as if the selector's wakeup method were invoked.
>
>If none of the previous conditions hold then this thread's interrupt status will be set.
>
>Interrupting a thread that is not alive need not have any effect.

大致意思是：

>`interrupt()`的作用是中断本线程。
>本线程中断自己是被允许的；其它线程调用本线程的`interrupt()`方法时，会通过`checkAccess()`检查权限。这有可能抛出`SecurityException`异常。
>
>如果本线程是处于阻塞状态：调用线程的`wait(), wait(long)`或`wait(long, int)`会让它进入等待(阻塞)状态，或者调用线程的`join(), join(long)`, `join(long, int)`, `sleep(long)`, `sleep(long, int)`也会让它进入阻塞状态。若线程在阻塞状态时，调用了它的`interrupt()`方法，那么它的“中断状态”会被清除并且会收到一个`InterruptedException`异常。
>
>例如，线程通过`wait()`进入阻塞状态，此时通过`interrupt()`中断该线程；调用`interrupt()`会立即将线程的中断标记设为`true`，但是由于线程处于阻塞状态，所以该“中断标记”会立即被清除为`false`，同时，会产生一个`InterruptedException`的异常。
>
>如果线程被阻塞在一个`Selector`选择器中，那么通过`interrupt()`中断它时；线程的中断标记会被设置为`true`，并且它会立即从选择操作中返回。
>
>如果不属于前面所说的情况，那么通过interrupt()中断线程时，它的中断标记会被设置为“true”。
>中断一个“已终止的线程”不会产生任何操作。

### 终止线程的方式

#### 终止处于阻塞状态的线程

通常，我们通过中断方式终止处于阻塞状态的线程。
当线程由于被调用了`sleep()`,` wait()`,` join()`等方法而进入阻塞状态；若此时调用线程的`interrupt()`将线程的中断标记设为`true`。由于处于阻塞状态，中断标记会被清除，同时产生一个`InterruptedException`异常。将`InterruptedException`放在适当的为止就能终止线程，形式如下：

```java
@Override
public void run{
    try {
        while (true) {
            // 执行任务...
        }
    }catch(InterruptedException ie) {
        // 由于产生InterruptedException异常，退出while(true)循环，线程终止！
    }
}
```

说明：在`while(true)`中不断的执行任务，当线程处于阻塞状态时，调用线程的`interrupt()`产生`InterruptedException`中断。中断的捕获在`while(true)`之外，这样就退出了`while(true)`循环！

注意：对`InterruptedException`的捕获任务一般放在`while(true)`循环体的外面，这样，在产生异常时就退出了`while(true)`循环。否则，`InterruptedException在while(true)`循环体之内，就需要额外的添加退出处理。

```java
@Override
public void run() {
    while(true){
        try{
            //执行任务...
        }catch (InterruptedException ie) {
            // InterruptedException在while(true)循环体内。
            // 当线程产生了InterruptedException异常时，while(true)仍能继续运行！需要手动退出
            break;
        }
    }
}
```

#### 终止处于运行状态的线程

通常，我们通过标记方式终止处于运行状态的线程。其中，包括中断标记和额外添加标记。

- 通过中断标记终止线程

  ```java
  @Override
  public void run() {
      while(!isInterrupted()) {
          //执行任务...
      }
  }
  ```

  说明：`isInterrupted()`是判断线程的中断标记是不是为`true`。当线程处于运行状态，并且我们需要终止它时；可以调用线程的`interrupt()`方法，使用线程的中断标记为`true`，即`isInterrupted()`会返回`true`。此时，就会退出`while`循环。
  注意：`interrupt()`并不会终止处于运行状态的线程！它会将线程的中断标记设为`true`。

- 通过额外添加标记终止线程

  ```java
  private volatile boolean flag = true;
  protected void stopTask() {
      flag = false;
  }
  
  @Override
  public void run() {
      while(flag) {
          //执行任务...
      }
  }
  ```

  说明：线程中有一个`flag`标记，它的默认值是`true`；并且我们提供`stopTask()`来设置`flag`标记。当我们需要终止该线程时，调用该线程的`stopTask()`方法就可以让线程退出`while`循环。
  注意：将`flag`定义为`volatile`类型，是为了保证`flag`的可见性。即其它线程通过`stopTask()`修改了`flag`之后，本线程能看到修改后的`flag`的值。

**综合线程处于阻塞状态和运行状态的终止方式，比较通用的终止线程的形式如下：**

```java
@Override
public void run() {
    try {
        // 1. isInterrupted()保证，只要中断标记为true就终止线程。
        while (!isInterrupted()) {
            // 执行任务...
        }
    } catch (InterruptedException ie) {  
        // 2. InterruptedException异常保证，当InterruptedException异常产生时，线程被终止。
    }
}
```

### 终止线程的示例

```java
class MyThread extends Thread {

    public MyThread(String name) {
        super(name);
    }

    @Override
    public void run() {
        try {  
            int i=0;
            while (!isInterrupted()) {
                Thread.sleep(100); // 休眠100ms
                i++;
                System.out.println(Thread.currentThread().getName()+" ("+this.getState()+") loop " + i);  
            }
        } catch (InterruptedException e) {  
            System.out.println(Thread.currentThread().getName() +" ("+this.getState()+") catch InterruptedException.");  
        }
    }
}

public class Demo1 {

    public static void main(String[] args) {  
        try {  
            Thread t1 = new MyThread("t1"); 
            System.out.println(t1.getName() +" ("+t1.getState()+") is new.");  

            t1.start();            
            System.out.println(t1.getName() +" ("+t1.getState()+") is started.");  

            // 主线程休眠300ms，然后主线程给t1发中断指令。
            Thread.sleep(300);
            t1.interrupt();
            System.out.println(t1.getName() +" ("+t1.getState()+") is interrupted.");

            // 主线程休眠300ms，然后查看t1的状态。
            Thread.sleep(300);
            System.out.println(t1.getName() +" ("+t1.getState()+") is interrupted now.");
        } catch (InterruptedException e) {  
            e.printStackTrace();
        }
    } 
}
```

运行结果：

```
t1 (NEW) is new.
t1 (RUNNABLE) is started.
t1 (RUNNABLE) loop 1
t1 (RUNNABLE) loop 2
t1 (TIMED_WAITING) is interrupted.
t1 (RUNNABLE) catch InterruptedException.
t1 (TERMINATED) is interrupted now.
```

结果说明：

- 主线程`main`中通过`new MyThread("t1")`创建线程`t1`，之后通过`t1.start()`启动线程`t1`。
- `t1`启动之后，会不断的检查它的中断标记，如果中断标记为`false`；则休眠100ms。
- `t1`休眠之后，会切换到主线程`main`；主线程再次运行时，会执行`t1.interrupt()`中断线程`t1`。`t1`收到中断指令之后，会将`t1`的中断标记设置`false`，而且会抛出`InterruptedException`异常。在`t1`的`run()`方法中，是在循环体`while`之外捕获的异常；因此循环被终止。

### interrupted() 和 isInterrupted()

`interrupted()`和`isInterrupted()`都能够用于检测对象的中断标记。
区别是，`interrupted()`除了返回中断标记之外，它还会清除中断标记(即将中断标记设为`false`)；而`isInterrupted()`仅仅返回中断标记。