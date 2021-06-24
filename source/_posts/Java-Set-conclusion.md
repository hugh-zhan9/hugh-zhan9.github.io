---
title: Java集合之Set总结
tags: Java-集合
categories: Java
date: 2020-07-07 23:42:28






---

-

<!--more-->

# Set 概括

`Set`继承于`Collection`接口，是一个不允许出现重复元素，并且无序的集合，主要有`HashMap`和`TreeMap`两大实现类.

`Set`

在判断重复元素的时候，`Set`集合会调用`hashCode()`和`equal()`方法来实现。

`HashSet`是哈希表结构，主要利用`HashMap`的`key`来存储元素，计算插入元素的`hashCode`来获取元素在集合中的位置；

`TreeSet`是红黑树结构，每一个元素都是树中的一个节点，插入的元素都会进行排序；



# HashSet 和 TreeSet 的区别

`HashSet`不能保证元素的排列顺序，顺序有可能发生变化，`TreeSet`是`SortedSet`接口的实现类，可以确保集合元素处于排序状态，它支持两种排序方式——自然排序和`Comparator`排序。

`HashSet`集合中可以存入一个`null`值，`TreeSet`集合中不允许存入`null`值。

`HashSet`是基于`HashMap`实现的，`TreeSet`是基于`TreeMap`实现的。