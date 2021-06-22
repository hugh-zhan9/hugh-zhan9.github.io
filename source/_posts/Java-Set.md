---
title: Java集合之Set架构
tags: Java-集合
categories: Java
date: 2020-07-4 23:42:28


---

`Set`的实现类都是基于`Map`来实现的 (`HashSet`是通过`HashMap`实现，`TreeSet`是通过`TreeMap`实现)

<!--more-->

# Set 架构

![Set架构](https://s1.ax1x.com/2020/07/06/UFpDvF.jpg)

`Set`的定义如下：

```java
public interface Set<E> extends Collecction<E> {}
```



说明：

- `Set`是继承于`Collection`接口的。它是一个不允许有重复元素的集合。

- `AbstractSet`是`Set`的抽象类，它继承于`AbstractCollection`，`AbstractCollection`实现了`Set`中的绝大部分函数，为`Set`的实现类提供了便利。

- `HashSet`和`TreeSet`是`Set`的两个实现类。

  `HashSet`依赖于`HashMap`，它实际上是通过`HashMap`实现的。`HashSet`中的元素是无序的。

  `TreeSet`依赖于`TreeMap`，它实际上是通过`TreeMap`实现的。`TreeSet`中的元素是有序的。

