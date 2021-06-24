---
title: Java集合之List架构
tags: Java-集合
categories: Java
date: 2020-07-1 11:42:28


---







-

<!--more-->



# List 简介

`List`的定义如下：

```java
public interface List<E> extends Collection<E> {}
```

`List`是继承于`Collection`的接口，即：`List`是集合中的一种。`List`是有序的队列，`List`中的每一个元素都有一个索引；第一个元素的索引值是0，往后的元素索引值依次+1。和`Set`不同，`List`中允许有重复的元素。`List`的官方介绍如下：

>A List is a collection which maintains an ordering for its elements. Every element in the List has an index. Each element can thus be accessed by its index, with the first index being zero. Normally, Lists allow duplicate elements, as compared to Sets, where elements have to be unique.

既然`List`是继承于`Collection`接口，那么自然就会实现`Collection`的全部函数接口。它也有自己的 API接口，主要包含添加、删除、获取、修改指定位置的元素、获取`List`中的子队列等。

```java
// Collection的API
boolean         add(E object)
boolean         addAll(Collection<? extends E> collection)
void            clear()
boolean         contains(Object object)
boolean         containsAll(Collection<?> collection)
boolean         equals(Object object)
int             hashCode()
boolean         isEmpty()
Iterator<E>     iterator()
boolean         remove(Object object)
boolean         removeAll(Collection<?> collection)
boolean         retainAll(Collection<?> collection)
int             size()
<T> T[]         toArray(T[] array)
Object[]        toArray()
    
// 相比与Collection，List新增的API：
void                add(int index, E object)
boolean             addAll(int index, Collection<? extends E> collection)
E                   get(int index)
int                 indexOf(Object object)
int                 lastIndexOf(Object object)
ListIterator<E>     listIterator(int index)
ListIterator<E>     listIterator()
E                   remove(int index)
E                   set(int location, E object)
List<E>             subList(int fromIndex, int toIndex)
```

