---
title: 静态工厂方法
tags: Java
categories: Java
date: 2020-06-19 20:00:28



---





假装有封面.jpg

[](https://s1.ax1x.com/2020/06/19/NMiT0S.jpg)

<!--more-->

# 什么是静态工厂方法

在 Java 中，获得一个类实例最简单的方法就是使用 `new` 关键字，通过构造函数来实现对象的创建。就像这样：

```java
    Fragment fragment = new MyFragment();
    // or
    Date date = new Date();
```

不过在实际的开发中，我们经常还会见到另外一种获取类实例的方法：

```java
    Fragment fragment = MyFragment.newIntance();
    // or 
    Calendar calendar = Calendar.getInstance();
    // or 
    Integer number = Integer.valueOf("3");
```

↑ 像这样的：不通过 `new`，而是用一个静态方法来对外提供自身实例的方法，即为我们所说的`静态工厂方法(Static factory method)`。

> 知识点：**`new` 究竟做了什么?**
>
> 简单来说：当我们使用 new 来构造一个新的类实例时，其实是告诉了 JVM 我需要一个新的实例。JVM 就会自动在内存中开辟一片空间，然后调用构造函数来初始化成员变量，最终把引用返回给调用方。

# Effective Java

在关于 Java 中书籍中，《Effective Java》绝对是最负盛名几本的之一，在此书中，作者总结了几十条改善 Java 程序设计的金玉良言。其中开篇第一条就是『**考虑使用静态工厂方法代替构造器**』，关于其原因，作者总结了 4 条（第二版），我们先来逐个看一下。

## 静态工厂方法与构造器不同的第一优势在于，它们有名字

由于语言的特性，Java 的构造函数都是跟类名一样的。这导致的一个问题是构造函数的名称不够灵活，经常不能准确地描述返回值，在有多个重载的构造函数时尤甚，如果参数类型、数目又比较相似的话，那更是很容易出错。

比如，如下的一段代码 ：

```java
Date date0 = new Date();
Date date1 = new Date(0L);
Date date2 = new Date("0");
Date date3 = new Date(1,2,1);
Date date4 = new Date(1,2,1,1,1);
Date date5 = new Date(1,2,1,1,1,1);
```

—— Date 类有很多重载函数，对于开发者来说，假如不是特别熟悉的话，恐怕是需要犹豫一下，才能找到合适的构造函数的。而对于其他的代码阅读者来说，估计更是需要查看文档，才能明白每个参数的含义了。

（当然，Date 类在目前的 Java 版本中，只保留了一个无参和一个有参的构造函数，其他的都已经标记为 @Deprecated 了）

而如果使用静态工厂方法，就可以给方法起更多有意义的名字，比如前面的 `valueOf`、`newInstance`、`getInstance` 等，对于代码的编写和阅读都能够更清晰。

## 第二个优势，不用每次被调用时都创建对象

这个很容易理解了，有时候外部调用者只需要拿到一个实例，而不关心是否是新的实例；又或者我们想对外提供一个单例时 —— 如果使用工厂方法，就可以很容易的在内部控制，防止创建不必要的对象，减少开销。

在实际的场景中，单例的写法也大都是用静态工厂方法来实现的。

> 如果你想对单例有更多了解，可以看一下这里：☞[《Hi，我们再来聊一聊Java的单例吧》](https://www.jianshu.com/p/eb30a388c5fc)

## 第三个优势，可以返回原返回类型的子类

这条不用多说，设计模式中的基本的原则之一——『里氏替换』原则，就是说子类应该能替换父类。
 显然，构造方法只能返回确切的自身类型，而静态工厂方法则能够更加灵活，可以根据需要方便地返回任何它的子类型的实例。

```java
Class Person {
    public static Person getInstance(){
        return new Person();
        // 这里可以改为 return new Player() / Cooker()
    }
}
Class Player extends Person{
}
Class Cooker extends Person{
}
```

比如上面这段代码，Person 类的静态工厂方法可以返回 Person 的实例，也可以根据需要返回它的子类 Player 或者 Cooker。（当然，这只是为了演示，在实际的项目中，一个类是不应该依赖于它的子类的。但如果这里的 getInstance () 方法位于其他的类中，就更具有的实际操作意义了）

## 第四个优势，在创建带泛型的实例时，能使代码变得简洁

这条主要是针对带泛型类的繁琐声明而说的，需要重复书写两次泛型参数：

```java
Map<String,Date> map = new HashMap<String,Date>();
```

不过自从 Java7 开始，这种方式已经被优化过了 —— 对于一个已知类型的变量进行赋值时，由于泛型参数是可以被推导出，所以可以在创建实例时省略掉泛型参数。

```java
Map<String,Date> map = new HashMap<>();
```

所以这个问题实际上已经不存在了。

# 除此之外

以上是《Effective Java》中总结的几条应该使用静态工厂方法代替构造器的原因，如果你看过之后仍然犹豫不决，那么我觉得可以再给你更多一些理由 —— 我个人在项目中是大量使用静态工厂方法的，从我的实际经验来看，除了上面总结的几条之外，静态工厂方法实际上还有更多的优势。

## 可以有多个参数相同但名称不同的工厂方法

构造函数虽然也可以有多个，但是由于函数名已经被固定，所以就要求参数必须有差异时（类型、数量或者顺序）才能够重载了。举例来说：

```java
class Child{
    int age = 10;
    int weight = 30;
    public Child(int age, int weight) {
        this.age = age;
        this.weight = weight;
    }
    public Child(int age) {
        this.age = age;
    }
}
```

Child 类有 age 和 weight 两个属性，如代码所示，它已经有了两个构造函数：Child(int age, int weight) 和 Child(int age)，这时候如果我们想再添加一个指定 wegiht 但不关心 age 的构造函数，一般是这样：

```java
public Child( int weight) {
    this.weight = weight;
}
```

↑ 但要把这个构造函数添加到 Child 类中，我们都知道是行不通的，因为 java 的函数签名是忽略参数名称的，所以 `Child(int age)` 跟 `Child(int weight)` 会冲突。这时候，静态工厂方法就可以登场了。

```java
class Child{
    int age = 10;
    int weight = 30;
    public static Child newChild(int age, int weight) {
        Child child = new Child();
        child.weight = weight;
        child.age = age;
        return child;
    }
    public static Child newChildWithWeight(int weight) {
        Child child = new Child();
        child.weight = weight;
        return child;
    }
    public static Child newChildWithAge(int age) {
        Child child = new Child();
        child.age = age;
        return child;
    }
}
```

其中的 `newChildWithWeight` 和 `newChildWithAge`，就是两个参数类型相同的的方法，但是作用不同，如此，就能够满足上面所说的类似`Child(int age)` 跟 `Child(int weight)`同时存在的需求。
 （另外，这两个函数名字也是自描述的，相对于一成不变的构造函数更能表达自身的含义，这也是上面所说的第一条优势 —— 『它们有名字』）

## 可以减少对外暴露的属性

软件开发中有一条很重要的经验：**对外暴露的属性越多，调用者就越容易出错**。所以对于类的提供者，一般来说，应该努力减少对外暴露属性，从而降低调用者出错的机会。考虑一下有如下一个 Player 类：

```java
// Player : Version 1
class Player {
    public static final int TYPE_RUNNER = 1;
    public static final int TYPE_SWIMMER = 2;
    public static final int TYPE_RACER = 3;
    protected int type;
    public Player(int type) {
        this.type = type;
    }
}
```

Player 对外提供了一个构造方法，让使用者传入一个 type 来表示类型。那么这个类期望的调用方式就是这样的：

```java
    Player player1 = new Player(Player.TYPE_RUNNER);
    Player player2 = new Player(Player.TYPE_SWEIMMER);
```

但是，我们知道，提供者是无法控制调用方的行为的，实际中调用方式可能是这样的：

```java
    Player player3 = new Player(0);
    Player player4 = new Player(-1);
    Player player5 = new Player(10086);
```

提供者期望的构造函数传入的值是事先定义好的几个常量之一，但如果不是，就**很容易导致程序错误**。

—— 要避免这种错误，使用枚举来代替常量值是常见的方法之一，当然如果不想用枚举的话，使用我们今天所说的主角`静态工厂方法`也是一个很好的办法。

> 插一句：
> 实际上，使用枚举也有一些缺点，比如增大了调用方的成本；如果枚举类成员增加，会导致一些需要完备覆盖所有枚举的调用场景出错等。

如果把以上需求用静态工厂方法来实现，代码大致是这样的：

```java
// Player : Version 2
class Player {
    public static final int TYPE_RUNNER = 1;
    public static final int TYPE_SWIMMER = 2;
    public static final int TYPE_RACER = 3;
    int type;

    private Player(int type) {
        this.type = type;
    }

    public static Player newRunner() {
        return new Player(TYPE_RUNNER);
    }
    public static Player newSwimmer() {
        return new Player(TYPE_SWIMMER);
    }
    public static Player newRacer() {
        return new Player(TYPE_RACER);
    }
}
```

注意其中的构造方法被声明为了 `private`，这样可以防止它被外部调用，于是调用方在使用 Player 实例的时候，基本上就必须通过`newRunner`、`newSwimmer`、`newRacer`这几个静态工厂方法来创建，调用方无须知道也无须指定 type 值 —— 这样就能把 type 的赋值的范围控制住，防止前面所说的异常值的情况。

>插一句：
>严谨一些的话，通过反射仍能够绕过静态工厂方法直接调用构造函数，甚至直接修改一个已创建的 Player 实例的 type 值，但本文暂时不讨论这种非常规情况。

## 多了一层控制，方便统一管理

我们在开发中一定遇到过很多次这样的场景：在写一个界面时，服务端的数据还没准备好，这时候我们经常就需要自己在客户端编写一个测试的数据，来进行界面的测试，像这样：

```java
    // 创建一个测试数据
    User tester = new User();
    tester.setName("隔壁老张");
    tester.setAge(16);
    tester.setDescription("我住隔壁我姓张！");
    // use tester
    bindUI(tester);
    ……
```

要写一连串的测试代码，如果需要测试的界面有多个，那么这一连串的代码可能还会被复制多次到项目的多个位置。

这种写法的缺点呢，首先是代码臃肿、混乱；其次是万一上线的时候漏掉了某一处，忘记修改，那就可以说是灾难了……

但是如果你像我一样，习惯了用静态工厂方法代替构造器的话，则会很自然地这么写，先在 User 中定义一个 newTestInstance 方法：

```java
static class User{
    String name ;
    int age ;
    String description;
    public static User newTestInstance() {
        User tester = new User();
        tester.setName("隔壁老张");
        tester.setAge(16);
        tester.setDescription("我住隔壁我姓张！");
        return tester;
    }
}
```

然后调用的地方就可以这样写了：

```java
    // 创建一个测试数据
    User tester = User.newTestInstance();
    // use tester
    bindUI(tester);
```

是不是瞬间就觉得优雅了很多？！

而且不只是代码简洁优雅，由于所有测试实例的创建都是在这一个地方，所以在需要正式数据的时候，也只需把这个方法随意删除或者修改一下，所有调用者都会编译不通过，彻底杜绝了由于疏忽导致线上还有测试代码的情况。



# 构造方法 的缺点

类如果不含有共有的或受保护的构造器，就不能被子类化。



```java
public class Person {
    private final SEX sex;
    private final String name;
    private final int age;
    
private Person(String name, int age, SEX sex){
    this.sex = sex;
    this.name = name;
    this.age = age;
}

public static Person getManInstance(String name, int age){
    return new Person(name, age, SEX.man);
}

public static Person getWomanInstance(String name, int age){
    return new Person(name, age, SEX.woman);
	}
}
class Student extends Person{
}
```
实际在编译器的静态检查中会报错，原因是父类缺少公有的构造方法，而子类无法调用父类的私有构造器，导致子类无法生成构造器。

# 最后

作为一个开发者，当我们作为调用方，使用别人提供的类时，如果要使用 new 关键字来为其创建一个类实例，如果对类不是特别熟悉，那么一定是要特别慎重的 —— `new` 实在是太好用了，以致于它经常被滥用，随时随地的 new 是有很大风险的，除了可能导致性能、内存方面的问题外，也经常会使得代码结构变得混乱。

而当我们在作为类的提供方时，无法控制调用者的具体行为，但是我们可以尝试使用一些方法来增大自己对类的控制力，减少调用方犯错误的机会，这也是对代码更负责的具体体现。

参考：

https://www.cnblogs.com/sluggard/p/4343426.html

https://www.cnblogs.com/muyuhu/p/3398701.html

https://www.jb51.net/article/123228.htm

http://ifeve.com/static-factory-methods-vs-traditional-constructors/



https://github.com/barryhappy?tab=overview&from=2020-06-01&to=2020-06-19