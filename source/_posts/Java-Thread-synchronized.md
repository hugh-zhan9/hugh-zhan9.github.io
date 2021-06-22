---
title: Java多线程之 同步线程
date: 2020-07-25 21:20:34
tags: Java-多线程
categories: Java



---

-

<!--more-->

# 同步线程

当多个线程同时运行时，线程的调度由操作系统决定，程序本身无法决定。因此，任何一个线程都有可能在任何指令处被操作系统暂停，然后在某个时间段后继续执行。这个时候，有个单线程模型下不存在的问题就来了：如果多个线程同时读写共享变量，会出现数据不一致的问题。

```java
public class Main {
    public static void main(String[] args) throws Exception {
        var add = new AddThread();
        var dec = new DecThread();
        add.start();
        dec.start();
        add.join();
        dec.join();
        System.out.println(Counter.count);
    }
}

class Counter {
    public static int count = 0;
}

class AddThread extends Thread {
    public void run() {
        for (int i=0; i<10000; i++) { Counter.count += 1; }
    }
}

class DecThread extends Thread {
    public void run() {
        for (int i=0; i<10000; i++) { Counter.count -= 1; }
    }
}
```

上面的代码很简单，两个线程同时对一个`int`变量进行操作，一个加10000次，一个减10000次，最后结果应该是0，但是，每次运行，结果实际上都是不一样的。使用`synchronized`关键字就可以解决这个问题：

```java
public class Main {
    public static void main(String[] args) throws Exception {
        var add = new AddThread();
        var dec = new DecThread();
        add.start();
        dec.start();
        add.join();
        dec.join();
        System.out.println(Counter.count);
    }
}

class Counter {
    public static final Object lock = new Object();
    public static int count = 0;
}

class AddThread extends Thread {
    public void run() {
        for (int i=0; i<10000; i++) {
            synchronized(Counter.lock) {
                Counter.count += 1;
            }
        }
    }
}

class DecThread extends Thread {
    public void run() {
        for (int i=0; i<10000; i++) {
            synchronized(Counter.lock) {
                Counter.count -= 1;
            }
        }
    }
}
```

它表示用`Counter.lock`实例作为锁，两个线程在执行各自的`synchronized(Counter.lock) { ... }`代码块时，必须先获得锁，才能进入代码块进行。执行结束后，在`synchronized`语句块结束会自动释放锁。这样一来，对`Counter.count`变量进行读写就不可能同时进行。上述代码无论运行多少次，最终结果都是0。

使用`synchronized`解决了多线程同步访问共享变量的正确性问题。但是，它的缺点是带来了性能下降。因为`synchronized`代码块无法并发执行。此外，加锁和解锁需要消耗一定的时间，所以，`synchronized`会降低程序的执行效率。

## synchronized关键字

### 原理

在Java中，每一个对象有且仅有一个同步锁。这也意味着，同步锁是依赖于对象而存在。

当我们调用某对象的`synchronized`方法时，就获取了该对象的同步锁。例如，`synchronized(obj)`就获取了`obj`这个对象”的同步锁。**不同线程对同步锁的访问是互斥的。**也就是说，某时间点，对象的同步锁只能被一个线程获取到！通过同步锁，我们就能在多线程中，实现对“对象/方法”的互斥访问。 例如，现在有两个线程A和线程B，它们都会访问“对象obj的同步锁”。假设，在某一时刻，线程A获取到“obj的同步锁”并在执行一些操作；而此时，线程B也企图获取“obj的同步锁” —— 线程B会获取失败，它必须等待，直到线程A释放了“该对象的同步锁”之后线程B才能获取到“obj的同步锁”从而才可以运行。

### 基本原则

- 第一条：当一个线程访问某个对象的`synchronized`方法或者`synchronized`代码块时，其他线程对该对象的该`synchronized`方法或者该`synchronized`代码块的访问将被阻塞。
- 第二条：当一个线程访问某个对象的`synchronized`方法或者`synchronized`代码块时，其他线程仍然可以访问该对象的非同步代码块。
- 第三条：当一个线程访问某个对象的`synchronized`方法或者`synchronized`代码块时，其他线程对该对象的其他`synchronized`方法或者`synchronized`代码块的访问将被阻塞。

#### 第一条

当一个线程访问某个对象的`synchronized`方法或者`synchronized`代码块时，其他线程对该对象的该`synchronized`方法或者该`synchronized`代码块的访问将被阻塞。

```java
class MyRunnable implements Runnable {
    @Override
    public void run() {
        synchronized(this) {
            try {
                for (int i = 0; i < 5, i++) {
                    Thread.sleep(100); //休眠100ms
                    System.out.println(Thread.currentThread().getName() + " loop " + i);
                }
            }catch (InterruptedException ie) {
            }
        }
    }
}
public class Demo1_1 {
    public static void main(String[] args) {
        Runnable demo = new MyRunnable();  //新建Runnbale对象
        Thread t1 = new Thread(demo, "t1");  //新建线程t1，t1是基于demo这个Runnable对象
        Thread t2 = new Thread(demo, "t2");  //新建线程t2，t2是基于demo这个Runnable对象
        t1.start();  //启动线程t1
        t2.start();  //启动线程t2
    }
}
```

运行结果：

```java
t1 loop 0
t1 loop 1
t1 loop 2
t1 loop 3
t1 loop 4
t2 loop 0
t2 loop 1
t2 loop 2
t2 loop 3
t2 loop 4
```

结果说明：`run()`方法中存在`synchronized(this)`代码块，而`t1`和`t2`都是基于`demo`这个`Runnable`对象创建的线程。这就意味着，我们可以将`synchronized(this)`中的`this`看作是`demo`这个`Runnable`对象”；因此，线程`t1`和`t2`共享`demo`对象的同步锁。所以，当一个线程运行的时候，另外一个线程必须等待“运行线程”释放`demo`的同步锁”之后才能运行。

如果你确认，你搞清楚这个问题了。那我们将上面的代码进行修改，然后再运行看看结果怎么样，看看你是否会迷糊。修改后的源码如下：

```java
class MyThread extends Thread {
    public MyThread(String name) {
        super(name);
    }
    @Override
    public void run() {
        synchronized(this) {
            try {
                for (int i = 0; i <5; i++) {
                    Thread.sleep(100); //休眠100ms
                    System.out.println(Thread.currentThread().getName() + " loop " + i);
                }
            }catch (InterruptedException ie) {
            }
        }
    }
}
public class Demo1_2 {

    public static void main(String[] args) {  
        Thread t1 = new MyThread("t1");  
        Thread t2 = new MyThread("t2");  
        t1.start();                          
        t2.start();              
    } 
}
```

代码说明：

比较`Demo1_2`和`Demo1_1`，我们发现，`Demo1_2`中的`MyThread`类是直接继承于`Thread`，而且`t1`和`t2`都是`MyThread`子线程。幸运的是，在`Demo1_2`的`run()方法`也调用了`synchronized(this)`，正如`Demo1_1`的`run()`方法也调用了`synchronized(this)`一样！

那么，`Demo1_2`的执行流程是不是和`Demo1_1`一样呢？运行结果：

```
t2 loop 0
t1 loop 0
t2 loop 1
t1 loop 1
t1 loop 2
t2 loop 2
t1 loop 3
t2 loop 3
t2 loop 4
t1 loop 4
```

结果说明：
如果这个结果一点也不令你感到惊讶，那么我相信你对`synchronized`和`this`的认识已经比较深刻了。否则的话，请继续阅读这里的分析。
`synchronized(this)`中的`this`是指“当前的类对象”，即`synchronized(this)`所在的类对应的当前对象。它的作用是获取“当前对象的同步锁”。
对于`Demo1_2`中，`synchronized(this)`中的`this`代表的是`MyThread`对象，而`t1`和`t2`是两个不同的`MyThread`对象，因此`t1`和`t2`在执行`synchronized(this)`时，获取的是不同对象的同步锁。对于`Demo1_1`对而言，`synchronized(this)`中的`this`代表的是`MyRunable`对象；`t1`和`t2`共同一个`MyRunable`对象，因此，一个线程获取了对象的同步锁，会造成另外一个线程等待。

####  第二条

当一个线程访问某个对象的`synchronized`方法或者`synchronized`代码块时，其他线程仍然可以访问该对象的非同步代码块。

下面是`Synchronized`代码块对应的演示：

```java
class Count {

    // 含有synchronized同步块的方法
    public void synMethod() {
        synchronized(this) {
            try {  
                for (int i = 0; i < 5; i++) {
                    Thread.sleep(100); // 休眠100ms
                    System.out.println(Thread.currentThread().getName() + " synMethod loop " + i);  
                }
            } catch (InterruptedException ie) {  
            }
        }  
    }

    // 非同步的方法
    public void nonSynMethod() {
        try {  
            for (int i = 0; i < 5; i++) {
                Thread.sleep(100);
                System.out.println(Thread.currentThread().getName() + " nonSynMethod loop " + i);  
            }
        } catch (InterruptedException ie) {  
        }
    }
}

public class Demo2 {

    public static void main(String[] args) {  
        final Count count = new Count();
        // 新建t1, t1会调用count对象的synMethod()方法
        Thread t1 = new Thread(
                new Runnable() {
                    @Override
                    public void run() {
                        count.synMethod();
                    }
                }, "t1");

        // 新建t2, t2会调用count对象的nonSynMethod()方法
        Thread t2 = new Thread(
                new Runnable() {
                    @Override
                    public void run() {
                        count.nonSynMethod();
                    }
                }, "t2");  


        t1.start(); 
        t2.start();  
    } 
}
```

运行结果：

```java
t1 synMethod loop 0
t2 nonSynMethod loop 0
t1 synMethod loop 1
t2 nonSynMethod loop 1
t1 synMethod loop 2
t2 nonSynMethod loop 2
t1 synMethod loop 3
t2 nonSynMethod loop 3
t1 synMethod loop 4
t2 nonSynMethod loop 4
```

结果说明：
主线程中新建了两个子线程`t1`和`t2`。`t1`会调用`count`对象的`synMethod()`方法，该方法内含有同步块；而`t2`则会调用`count`对象的`nonSynMethod()`方法，该方法不是同步方法。`t1`运行时，虽然调用`synchronized(this)`获取`count`的同步锁；但是并没有造成`t2`的阻塞，因为`t2`没有用到`count`同步锁。

#### 第三条

当一个线程访问某个对象的`synchronized`方法或者`synchronized`代码块时，其他线程对该对象的其他`synchronized`方法或者`synchronized`代码块的访问将被阻塞。

我们将上面的例子中的`nonSynMethod()`方法体的也用`synchronized(this)`修饰。修改后的源码如下：

```java
class Count {

    // 含有synchronized同步块的方法
    public void synMethod() {
        synchronized(this) {
            try {  
                for (int i = 0; i < 5; i++) {
                    Thread.sleep(100); // 休眠100ms
                    System.out.println(Thread.currentThread().getName() + " synMethod loop " + i);  
                }
            } catch (InterruptedException ie) {  
            }
        }  
    }

    // 也包含synchronized同步块的方法
    public void nonSynMethod() {
        synchronized(this) {
            try {  
                for (int i = 0; i < 5; i++) {
                    Thread.sleep(100);
                    System.out.println(Thread.currentThread().getName() + " nonSynMethod loop " + i);  
                }
            } catch (InterruptedException ie) {  
            }
        }
    }
}

public class Demo3 {

    public static void main(String[] args) {  
        final Count count = new Count();
        // 新建t1, t1会调用count对象的synMethod()方法
        Thread t1 = new Thread(
                new Runnable() {
                    @Override
                    public void run() {
                        count.synMethod();
                    }
                }, "t1");

        // 新建t2, t2会调用count对象的nonSynMethod()方法
        Thread t2 = new Thread(
                new Runnable() {
                    @Override
                    public void run() {
                        count.nonSynMethod();
                    }
                }, "t2");  

        t1.start();  
        t2.start();  
    } 
}
```

运行结果：

```
t1 synMethod loop 0
t1 synMethod loop 1
t1 synMethod loop 2
t1 synMethod loop 3
t1 synMethod loop 4
t2 nonSynMethod loop 0
t2 nonSynMethod loop 1
t2 nonSynMethod loop 2
t2 nonSynMethod loop 3
t2 nonSynMethod loop 4
```

结果说明：
主线程中新建了两个子线程`t1`和`t2`。`t1`和`t2`运行时都调用`synchronized(this)`，这个`this`是`Count`对象`(count)`，而`t1`和`t2`共用`count`。因此，在`t1`运行时，`t2`会被阻塞，等待`t1`运行释放`count`对象的同步锁，`t2`才能运行。

### synchronized 方法和 synchronized 代码块

`synchronized`方法就是用`synchronized`修饰的方法，而`synchronized`代码块则是用`synchronized`修饰代码块。

synchronized 方法示例：

```java
public synchronized void fool () {
    System.out.println("synchroized methoed");
}
```

synchronized 代码块示例：

```java
public void fool2 () {
    synchronized (this) {
        System.out.println("synchronized methoed");
    }
}
```

`synchronized`代码块中的`this`是指当前对象。也可以将`this`替换成其他对象，例如将`this`替换成`obj`，则`foo2()`在执行`synchronized(obj)`时就获取的是`obj`的同步锁。

`synchronized`代码块可以更精确的控制冲突限制访问区域，有时候表现更高效率。下面通过一个示例来演示：

```java
public class Demo4 {

    public synchronized void synMethod() {
        for(int i=0; i<1000000; i++)
            ;
    }

    public void synBlock() {
        synchronized( this ) {
            for(int i=0; i<1000000; i++)
                ;
        }
    }

    public static void main(String[] args) {
        Demo4 demo = new Demo4();

        long start, diff;
        start = System.currentTimeMillis();               
        demo.synMethod();                              
        diff = System.currentTimeMillis() - start;      
        System.out.println("synMethod() : "+ diff);

        start = System.currentTimeMillis();              
        demo.synBlock();                               
        diff = System.currentTimeMillis() - start;    
        System.out.println("synBlock()  : "+ diff);
    }
}
```

(某一次)执行结果：

```java
synMethod() : 11
synBlock() : 3
```

### 实例锁 和 全局锁

- 实例锁：锁在某一个实例对象上。如果该类是单例，那么该锁也具有全局锁的概念。实例锁对应的就是`synchronized`关键字。
- 全局锁：该锁针对的是类，无论实例多少个对象，那么线程都共享该锁。全局锁对应的就是`static synchronized`（或者是锁在该类的`class`或者`classloader`对象上）。

关于“实例锁”和“全局锁”有一个很形象的例子：

```java
pulbic class Something {
    public synchronized void isSyncA(){}
    public synchronized void isSyncB(){}
    public static synchronized void cSyncA(){}
    public static synchronized void cSyncB(){}
}
```

假设，`Something`有两个实例`x`和`y`。分析下面4组表达式获取的锁的情况。

1. `x.isSyncA()`与`x.isSyncB()`
2. `x.isSyncA()`与`y.isSyncA()`
3. `x.cSyncA()`与`y.cSyncB()`
4. `x.isSyncA()`与`Something.cSyncA()`

------

1. 不能被同时访问

   因为`isSyncA()`和`isSyncB()`都是访问同一个对象（对象x）的同步锁！

   ```java
   class Something {
       public synchronized void isSyncA(){
           try {  
               for (int i = 0; i < 5; i++) {
                   Thread.sleep(100); // 休眠100ms
                   System.out.println(Thread.currentThread().getName()+" : isSyncA");
               }
           }catch (InterruptedException ie) {  
           }  
       }
       public synchronized void isSyncB(){
           try {  
               for (int i = 0; i < 5; i++) {
                   Thread.sleep(100); // 休眠100ms
                   System.out.println(Thread.currentThread().getName()+" : isSyncB");
               }
           }catch (InterruptedException ie) {  
           }  
       }
   }
   
   public class LockTest1 {
   
       Something x = new Something();
       Something y = new Something();
   
       // 比较(01) x.isSyncA()与x.isSyncB() 
       private void test1() {
           // 新建t11, t11会调用 x.isSyncA()
           Thread t11 = new Thread(
                   new Runnable() {
                       @Override
                       public void run() {
                           x.isSyncA();
                       }
                   }, "t11");
   
           // 新建t12, t12会调用 x.isSyncB()
           Thread t12 = new Thread(
                   new Runnable() {
                       @Override
                       public void run() {
                           x.isSyncB();
                       }
                   }, "t12");  
   
           t11.start();  // 启动t11
           t12.start();  // 启动t12
       }
   
       public static void main(String[] args) {
           LockTest1 demo = new LockTest1();
           demo.test1();
       }
   }
   ```

   运行结果：

   ```
   t11 : isSyncA
   t11 : isSyncA
   t11 : isSyncA
   t11 : isSyncA
   t11 : isSyncA
   t12 : isSyncB
   t12 : isSyncB
   t12 : isSyncB
   t12 : isSyncB
   t12 : isSyncB
   ```

   

2. 可以被同时访问

   因为访问的不是同一个对象的同步锁，`x.isSyncA()`访问的是`x`的同步锁，而`y.isSyncA()`访问的是`y`的同步锁。

   ```java
   class Something {
       public synchronized void isSyncA(){
           try {  
               for (int i = 0; i < 5; i++) {
                   Thread.sleep(100); // 休眠100ms
                   System.out.println(Thread.currentThread().getName()+" : isSyncA");
               }
           }catch (InterruptedException ie) {  
           }  
       }
       public synchronized void isSyncB(){
           try {  
               for (int i = 0; i < 5; i++) {
                   Thread.sleep(100); // 休眠100ms
                   System.out.println(Thread.currentThread().getName()+" : isSyncB");
               }
           }catch (InterruptedException ie) {  
           }  
       }
       public static synchronized void cSyncA(){
           try {  
               for (int i = 0; i < 5; i++) {
                   Thread.sleep(100); // 休眠100ms
                   System.out.println(Thread.currentThread().getName()+" : cSyncA");
               } 
           }catch (InterruptedException ie) {  
           }  
       }
       public static synchronized void cSyncB(){
           try {  
               for (int i = 0; i < 5; i++) {
                   Thread.sleep(100); // 休眠100ms
                   System.out.println(Thread.currentThread().getName()+" : cSyncB");
               } 
           }catch (InterruptedException ie) {  
           }  
       }
   }
   
   public class LockTest2 {
   
       Something x = new Something();
       Something y = new Something();
   
       // 比较(02) x.isSyncA()与y.isSyncA()
       private void test2() {
           // 新建t21, t21会调用 x.isSyncA()
           Thread t21 = new Thread(
                   new Runnable() {
                       @Override
                       public void run() {
                           x.isSyncA();
                       }
                   }, "t21");
   
           // 新建t22, t22会调用 x.isSyncB()
           Thread t22 = new Thread(
                   new Runnable() {
                       @Override
                       public void run() {
                           y.isSyncA();
                       }
                   }, "t22");  
   
           t21.start();  // 启动t21
           t22.start();  // 启动t22
       }
   
       public static void main(String[] args) {
           LockTest2 demo = new LockTest2();
   
           demo.test2();
       }
   }
   ```

   运行结果：

   ```
   t21 : isSyncA
   t22 : isSyncA
   t21 : isSyncA
   t22 : isSyncA
   t21 : isSyncA
   t22 : isSyncA
   t21 : isSyncA
   t22 : isSyncA
   t21 : isSyncA
   t22 : isSyncA
   ```

   

3. 不能被同时访问

   因为`cSyncA()`和`cSyncB()`都是`static`类型，`x.cSyncA()`相当于`Something.isSyncA()`，`y.cSyncB()`相当于`Something.isSyncB()`，因此它们共用一个同步锁，不能被同时访问。

   ```java
   class Something {
       public synchronized void isSyncA(){
           try {  
               for (int i = 0; i < 5; i++) {
                   Thread.sleep(100); // 休眠100ms
                   System.out.println(Thread.currentThread().getName()+" : isSyncA");
               }
           }catch (InterruptedException ie) {  
           }  
       }
       public synchronized void isSyncB(){
           try {  
               for (int i = 0; i < 5; i++) {
                   Thread.sleep(100); // 休眠100ms
                   System.out.println(Thread.currentThread().getName()+" : isSyncB");
               }
           }catch (InterruptedException ie) {  
           }  
       }
       public static synchronized void cSyncA(){
           try {  
               for (int i = 0; i < 5; i++) {
                   Thread.sleep(100); // 休眠100ms
                   System.out.println(Thread.currentThread().getName()+" : cSyncA");
               } 
           }catch (InterruptedException ie) {  
           }  
       }
       public static synchronized void cSyncB(){
           try {  
               for (int i = 0; i < 5; i++) {
                   Thread.sleep(100); // 休眠100ms
                   System.out.println(Thread.currentThread().getName()+" : cSyncB");
               } 
           }catch (InterruptedException ie) {  
           }  
       }
   }
   
   public class LockTest3 {
   
       Something x = new Something();
       Something y = new Something();
   
       // 比较(03) x.cSyncA()与y.cSyncB()
       private void test3() {
           // 新建t31, t31会调用 x.isSyncA()
           Thread t31 = new Thread(
                   new Runnable() {
                       @Override
                       public void run() {
                           x.cSyncA();
                       }
                   }, "t31");
   
           // 新建t32, t32会调用 x.isSyncB()
           Thread t32 = new Thread(
                   new Runnable() {
                       @Override
                       public void run() {
                           y.cSyncB();
                       }
                   }, "t32");  
   
   
           t31.start();  
           t32.start(); 
       }
   
       public static void main(String[] args) {
           LockTest3 demo = new LockTest3();
   
           demo.test3();
       }
   }
   ```

   运行结果：

   ```java
   t31 : cSyncA
   t31 : cSyncA
   t31 : cSyncA
   t31 : cSyncA
   t31 : cSyncA
   t32 : cSyncB
   t32 : cSyncB
   t32 : cSyncB
   t32 : cSyncB
   t32 : cSyncB
   ```

   

4. 可以被同时访问

   因为`isSyncA()`是实例方法，`x.isSyncA()`使用的是对象`x`的锁；而`cSyncA()`是静态方法，`Something.cSyncA()`可以理解对使用的是“类的锁”。因此，它们是可以被同时访问的。

   ```java
   class Something {
       public synchronized void isSyncA(){
           try {  
               for (int i = 0; i < 5; i++) {
                   Thread.sleep(100); // 休眠100ms
                   System.out.println(Thread.currentThread().getName()+" : isSyncA");
               }
           }catch (InterruptedException ie) {  
           }  
       }
       public synchronized void isSyncB(){
           try {  
               for (int i = 0; i < 5; i++) {
                   Thread.sleep(100); // 休眠100ms
                   System.out.println(Thread.currentThread().getName()+" : isSyncB");
               }
           }catch (InterruptedException ie) {  
           }  
       }
       public static synchronized void cSyncA(){
           try {  
               for (int i = 0; i < 5; i++) {
                   Thread.sleep(100); // 休眠100ms
                   System.out.println(Thread.currentThread().getName()+" : cSyncA");
               } 
           }catch (InterruptedException ie) {  
           }  
       }
       public static synchronized void cSyncB(){
           try {  
               for (int i = 0; i < 5; i++) {
                   Thread.sleep(100); // 休眠100ms
                   System.out.println(Thread.currentThread().getName()+" : cSyncB");
               } 
           }catch (InterruptedException ie) {  
           }  
       }
   }
   
   public class LockTest4 {
   
       Something x = new Something();
       Something y = new Something();
   
       // 比较(04) x.isSyncA()与Something.cSyncA()
       private void test4() {
           // 新建t41, t41会调用 x.isSyncA()
           Thread t41 = new Thread(
                   new Runnable() {
                       @Override
                       public void run() {
                           x.isSyncA();
                       }
                   }, "t41");
   
           // 新建t42, t42会调用 x.isSyncB()
           Thread t42 = new Thread(
                   new Runnable() {
                       @Override
                       public void run() {
                           Something.cSyncA();
                       }
                   }, "t42");  
   
   
           t41.start(); 
           t42.start();  
       }
   
       public static void main(String[] args) {
           LockTest4 demo = new LockTest4();
   
           demo.test4();
       }
   }
   ```

   运行结果：

   ```java
   t41 : isSyncA
   t42 : cSyncA
   t41 : isSyncA
   t42 : cSyncA
   t41 : isSyncA
   t42 : cSyncA
   t41 : isSyncA
   t42 : cSyncA
   t41 : isSyncA
   t42 : cSyncA
   ```

# 同步锁（Lock）

`Lock`机制提供了比`synchronized`代码块和`synchronized`方法更广泛的锁定操作，同步代码块/同步方法具有的功能`Lock`都有，除此之外更强大，更体现面向对象。在并发包的类族中，`Lock`是`JUC`包的顶层接口，它的实现逻辑并未用到`synchronized`，而是利用了`volatile`的可见性。

```java
class X {
    private final ReentrantLock lock = new ReentrantLock();
    // ...
    public void m() {  // m方法是需要同步操作的方法
        lock.lock();
        try {
            // method body
        } finally {
            lock.unlock();
        }
    }
}
```

