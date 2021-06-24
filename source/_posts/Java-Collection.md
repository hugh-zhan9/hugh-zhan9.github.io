---
title: Java集合之Collection架构
tags: Java-集合
categories: Java
date: 2020-06-30 11:42:28

---



-

<!--more-->



![Collection架构](https://s1.ax1x.com/2020/07/06/UFPL5R.jpg)

`Collection`是一个接口，它的两个主要分支是：`List`和`Set`。

`List`和`Set`都是接口，它们继承于`Collection`。`List`是有序的队列，`List`中可以有重复的元素；而`Set`是数学概念中的集合，`Set`中没有重复元素！`List`和`Set`都有它们各自的实现类。

为了方便实现，集合中定义了`AbstractCollection`抽象类，它实现了`Collection`中的绝大部分函数；这样，在`Collection`的实现类中，我们就可以通过继承`AbstractCollection`省去重复编码。`AbstractList`和`AbstractSet`都继承于`AbstractCollection`，具体的`List`实现类继承于`AbstractList`，而`Set`的实现类则继承于`AbstractSet`。

此外，`Collection`中有一个`iterator()`函数，它的作用是返回一个`Iterator`接口。通常，我们通过`Iterator`迭代器来遍历集合。`ListIterator`是`List`接口所特有的，在`List`接口中，通过`ListIterator()`返回一个`ListIterator`对象。

# 简介

Collection 的定义：

```java
public interface Collection<E> extends Iterable<E> {}
```

它是一个接口，是高度抽象出来的集合，它包含了集合的基本操作：添加、删除、清空、遍历（读取）、是否为空、获取大小、是否保护元素等等。

`Collection`接口的所有子类（直接子类和间接子类）都必须实现两种构造函数：

1. 不带参数的构造函数
2. 参数为`Collection`的构造函数

带参数的构造函数，可以用来转换`Collection`的类型：

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
```



# AbstractColletion

AbstractCollection 的定义如下：

```java
public abstract class AbstractCollection<E> implements Collection<E> {}
```

`AbstractCollection`是一个抽象类，它实现了`Collection`中除`iterator()`和`size()`之外的函数。
`AbstractCollection`的主要作用：它实现了`Collection`接口中的大部分函数。从而方便其它类实现`Collection`，比如`ArrayList`、`LinkedList`等，它们这些类想要实现`Collection`接口，通过继承`AbstractCollection`就已经实现了大部分的接口了。

### AbstractCollection 中定义的API

```java
void                add(int location, E object)
boolean             addAll(int location, Collection<? extends E> collection)
E                   get(int location)
int                 indexOf(Object object)
int                 lastIndexOf(Object object)
ListIterator<E>     listIterator(int location)
ListIterator<E>     listIterator()
E                   remove(int location)
E                   set(int location, E object)
List<E>             subList(int start, int end)
```



## AbstractList

AbstractList 的定义如下：

```java
public abstract class AbstractList extends AbstractCollection<E> implements List<E> {}
```

`AbstractList`是一个继承于`AbstactCollection`，并且实现`List`接口的抽象类。它实现了`List`中除了`size()`、`get(int location)`之外的函数。

`AbstractList`的主要作用：它实现了`List`接口中的大部分函数，从而方便其它类继承`List`。和`AbstractCollection`相比，`AbstractList`抽象类中，实现了`Iterator()`接口。

## AbstractSet

AbstractSet 的定义如下：

```java
public abstract class AbstractSet<E> extends AbstractCollection<E> implements Set<E> {}
```

`AbstractSet`是一个继承于`AbstractCollection`，并且实现`Set`接口的抽象类。由于`Set`接口和`Collection`接口中的API完全一样，`Set`也就没有自己单独的API。和`AbstractCollection`一样，它实现了`List`中除`iterator()`和`size()`之外的函数。

`AbstractSet`的主要作用：它实现了`Set`接口中的大部分函数。从而方便其它类实现`Set`接口。

# Iterator 

Iterator 的定义如下：

```java
public interface Iterator<E> {}
```

`Iterator`是一个接口，它是集合的迭代器。集合可以通过`Iterator`去遍历集合中的元素。`Iterator`提供的 API接口，包括：

- 是否存在下一个元素：`boolean hasNext()` 
- 获取下一个元素：`E next()`
- 删除当前元素：`void remove()`

> **注意**：`Iterator`遍历`Collection`时，是采用`fail-fast`机制的。即：当一个线程A通过`Iterator`去遍历某集合的过程中，若该集合的内容被其他线程所改变，那么线程A访问集合时就会抛出`ConcurrentModificationExcepption`异常，产生`fail-fast`事件。

## ListIterator

ListIterator 的定义如下：

```java
public interface ListIterator<E> extends Iterator<E> {}
```

`ListIterator`是一个继承于`Iterator`的接口，它是队列迭代器。专门用于遍历`List`，能提供向前/向后遍历。相比于`Iterator`，它新增了：添加、是否存在上一个元素、获取上一个元素等等API接口。

```java
// ListIterator的API
// 继承于Iterator的接口
boolean hasNext()
E next()
void remove()
    
// 新增API接口
void add(E object)
boolean hasPrevious()
int nextIndex()
E previous()
int previousIndex()
void set(E object)
```

