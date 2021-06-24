---
title: Java集合之总体架构
tags: Java-集合
categories: Java
date: 2020-06-29 11:12:28





---

-

<!--more-->

Java集合是Java提供的工具包，包含了常用的数据结构：集合、链表、队列、栈、数组、映射等。Java集合工具包位置是`java.util.*`

Java集合主要可以划分为四个部分：

- List 列表
- Set 集合
- Map 映射
- 工具类（Iterator迭代器、Enumeration枚举类、Arrays和Collections）

集合工具包框架如下：

![](https://s1.ax1x.com/2020/07/09/Unc1iQ.jpg)

说明：

1. `Collection`是一个接口，是高度抽象出来的集合，包含了集合的基本操作和属性。`Collection`包含了`List`和`Set`两大分支。

   - `List`是一个有序的队列，每一个元素都于它的所有。第一个元素的索引值是0。

     `List`的实现类有`ArrayList`、`LinkedList`、`Vector`、`Stcak`。

   - `Set`是一个不允许有重复元素的集合。

     `Set`的实现类有`HashSet`和`TreeSet`。`HashSet`依赖于`HashMap`，它实际上是通过`HashMap`实现的；`TreeSet`依赖于`TreeMap`，它实际上是通过`TreeMap`实现的。

2. `Map`是一个映射接口，即`key-value`键值对。`Map`中的每一个元素包含：`一个key`和`key对应的value`。

   `AbstractMap`是个抽象类，它实现了`Map`接口中的大部分API。而`HashMap`，`TreeMap`，`WeakHashMap`都是继承于`AbstractMap`。
   `Hashtable`虽然继承于`Dictionary`，但它实现了`Map`接口。

3. `Iterator`是遍历集合的工具。我们通常通过`Iterator`迭代器来遍历集合。

4. `Enumeration`是JDK 1.0时期引入的抽象类，作用和`Iterator`一样，但是功能要少于`Iterator`。在上面的架构图中可以看到，`Enumeration`只能在`Hashtable`、`Vector`、`Stack`中使用。

5. 最后，Arrays和Collections。它们是操作数组、集合的两个工具类。