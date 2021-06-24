---
title: Java集合之Map架构
tags: Java-集合
categories: Java
date: 2020-07-13 11:42:28




---

-

<!--more-->

来看看Map的架构

![](https://s1.ax1x.com/2020/07/10/UMasoj.jpg)

如上图：

- `Map`是映射接口，`Map`中存储的内容是键值对（key-value）
- `AbstractMap`是继承于`Map`的抽象类，它实现了`Map`中的大部分API。其它`Map`的实现类可以通过继承`AbstractMap`来减少重复编码。
- `SortedMap`是继承于`Map`的接口，`SortedMap`中的内容是排序的键值对，排序的方法是通过比较器(`Comparator`)。
- `NavigableMap`是继承于`SortedMap`的接口。相比于`SortedMap`，`NavigableMap`有一系列的导航方法；如：获取大于/等于某对象的键值对、获取小于/等于某对象的键值对等等。
- `TreeMap`继承于`AbstractMap`，且实现了`NavigableMap`接口；因此，`TreeMap`中的内容是有序的键值对！
- `HashMap`继承于`AbstractMap`，但没实现`NavigableMap`接口；因此，`HashMap`的内容是键值对，但不保证次序！
- `Hashtable`虽然不是继承于`AbstractMap`，但它继承于`Dictionary`(`Dictionary`也是键值对的接口)，也实现`Map`接口；因此，`Hashtable`的内容也是键值对，也不保证次序。但和`HashMap`相比，`Hashtable`是线程安全的，而且它支持通过`Enumeration`去遍历。
- `WeakHashMap`继承于`AbstractMap`。它和`HashMap`的键类型不同，`WeakHashMap`的键是[弱键]()。

# Map 简介

Map 的定义如下：

```java
public interface Map<K,V> {}
```

`Map`是一个键值对(`key-value`)映射接口。`Map`映射中不能包含重复的键；每个键最多只能映射到一个值。

`Map`接口提供三种`collection`视图，允许以键集、值集或键-值映射关系集的形式查看某个映射的内容。

`Map`映射顺序。有些实现类，可以明确保证其顺序，如`TreeMap`；另一些映射实现则不保证顺序，如`HashMap`类。

`Map`的实现类应该提供2个标准的构造方法：

- 第一个，无参构造方法，用于创建空映射；
- 第二个，带有单个 `Map`类型参数的构造方法，用于创建一个与其参数具有相同键-值映射关系的新映射。

实际上，后一个构造方法允许用户复制任意映射，生成所需类的一个等价映射。尽管无法强制执行此建议（因为接口不能包含构造方法），但是 JDK 中所有通用的映射实现都遵从它。

## Map 的API

```java
abstract void                 clear()
abstract boolean              containsKey(Object key)
abstract boolean              containsValue(Object value)
abstract Set<Entry<K, V>>     entrySet()
abstract boolean              equals(Object object)
abstract V                    get(Object key)
abstract int                  hashCode()
abstract boolean              isEmpty()
abstract Set<K>               keySet()
abstract V                    put(K key, V value)
abstract void                 putAll(Map<? extends K, ? extends V> map)
abstract V                    remove(Object key)
abstract int                  size()
abstract Collection<V>        values()
```

说明：

- `Map`提供接口分别用于返回键集、值集或键值映射关系集。

  > `entrySet()`用于返回键值集的`set`集合
  >
  > `keySet()`用于返回键集的`Set`集合
  >
  > `values()`用户返回值集的`Collection`集合
  >
  > 因为`Map`中不能包含重复的键，每个键最多只能映射到一个值。所以：键值集、键集都是`Set`，值集是`Collection`

## Map.Entry

`Map.Entry`的定义如下：

```java
interface Entry<K,V> {}
```

`Map.Entry`是`Map`中内部的一个接口，`Map.Entry`是键值对，`Map`通过`entrySet()`获取`Map.Entry`的键值对集合，从而通过该集合实现对键值对的操作。

### Map.Entry的API

```java
abstract boolean       equals(Object o)
abstract K             getKey()
abstract V             getValue()
abstract int           hashCode()
abstract V             setValue(V value)
```

## AbstractMap

`AbstractMap`的定义如下：

```JAVA
public abstract class AbstractMap<K,V> implements Map<K,V> {}
```

`AbstractMap`类提供`Map`接口的骨干实现，以最大限度地减少实现此接口所需的工作。

要实现不可修改的映射，编程人员只需扩展此类并提供`entrySet`方法的实现即可，该方法将返回映射的映射关系`set`视图。通常，返回的`set`将依次在`AbstractSet`上实现。此`set`不支持`add()`或`remove()`方法，其迭代器也不支持 `remove()`方法。

要实现可修改的映射，编程人员必须另外重写此类的`put`方法（否则将抛出`UnsupportedOperationException`），`entrySet().iterator()`返回的迭代器也必须另外实现其`remove`方法。

### AbstractMap的API

```java
abstract Set<Entry<K, V>>     entrySet()
         void                 clear()
         boolean              containsKey(Object key)
         boolean              containsValue(Object value)
         boolean              equals(Object object)
         V                    get(Object key)
         int                  hashCode()
         boolean              isEmpty()
         Set<K>               keySet()
         V                    put(K key, V value)
         void                 putAll(Map<? extends K, ? extends V> map)
         V                    remove(Object key)
         int                  size()
         String               toString()
         Collection<V>        values()
         Object               clone()
```

## SortedMap

`SortedMap`的定义如下：

```java
public interface SortedMap<K,V> extends Map<K,V> { }
```

`SortedMap`是一个继承于`Map`接口的接口。它是一个有序的`SortedMap`键值映射。
`SortedMap`的排序方式有两种：

- 自然排序 
- 用户指定比较器 

插入有序`SortedMap`的所有元素都必须实现`Comparable`接口（或者被指定的比较器所接受）。

另外，所有`SortedMap`实现类都应该提供 4 个标准构造方法：

- 无参构造方法，它创建一个空的有序映射，按照键的自然顺序进行排序。
- 带有一个`Comparator`类型参数的构造方法，它创建一个空的有序映射，根据指定的比较器进行排序。
- 带有一个`Map`类型参数的构造方法，它创建一个新的有序映射，其键-值映射关系与参数相同，按照键的自然顺序进行排序。
- 带有一个`SortedMap`类型参数的构造方法，它创建一个新的有序映射，其键-值映射关系和排序方法与输入的有序映射相同。

### SortedMap的API

```java
// SortedMap新增的API 
abstract Comparator<? super K>     comparator()
abstract K                         firstKey()
abstract SortedMap<K, V>           headMap(K endKey)
abstract K                         lastKey()
abstract SortedMap<K, V>           subMap(K startKey, K endKey)
abstract SortedMap<K, V>           tailMap(K startKey)
```

### NavigableMap

`NavigableMap`的定义如下：

```java
public interface NavigableMap<K,V> extends SortedMap<K,V> { }
```

`NavigableMap`是继承于`SortedMap`的接口。它是一个可导航的键-值对集合，具有了为给定搜索目标报告最接近匹配项的导航方法。
`NavigableMap`分别提供了获取键、键-值对、键集、键-值对集的相关方法。

#### NavigableMap的API

```java
abstract Entry<K, V>             ceilingEntry(K key)
abstract Entry<K, V>             firstEntry()
abstract Entry<K, V>             floorEntry(K key)
abstract Entry<K, V>             higherEntry(K key)
abstract Entry<K, V>             lastEntry()
abstract Entry<K, V>             lowerEntry(K key)
abstract Entry<K, V>             pollFirstEntry()
abstract Entry<K, V>             pollLastEntry()
abstract K                       ceilingKey(K key)
abstract K                       floorKey(K key)
abstract K                       higherKey(K key)
abstract K                       lowerKey(K key)
abstract NavigableSet<K>         descendingKeySet()
abstract NavigableSet<K>         navigableKeySet()
abstract NavigableMap<K, V>      descendingMap()
abstract NavigableMap<K, V>      headMap(K toKey, boolean inclusive)
abstract SortedMap<K, V>         headMap(K toKey)
abstract SortedMap<K, V>         subMap(K fromKey, K toKey)
abstract NavigableMap<K, V>      subMap(K fromKey, boolean fromInclusive, K toKey, boolean toInclusive)
abstract SortedMap<K, V>         tailMap(K fromKey)
abstract NavigableMap<K, V>      tailMap(K fromKey, boolean inclusive)
```

说明：
`NavigableMap`除了继承`SortedMap`的特性外，它的提供的功能可以分为4类：

1. 提供操作键-值对的方法。
   `lowerEntry(K key)`、`floorEntry(K key)`、`ceilingEntry(K key)`和`higherEntry(K key)`方法，它们分别返回与小于、小于等于、大于等于、大于给定键的键关联的`Map.Entry`对象。
   `firstEntry()`、`pollFirstEntry()`、`lastEntry()`和`pollLastEntry()`方法，它们返回和/或移除最小和最大的映射关系（如果存在），否则返回`null`。
2. 提供操作键的方法。和第1类比较类似
   `lowerKey(K key)`、`floorKey(K key)`、`ceilingKey(K key)`和`higherKey(K key)`方法，它们分别返回与小于、小于等于、大于等于、大于给定键的键。
3. 获取键集。
   `navigableKeySet()`、`descendingKeySet()`分别获取正序/反序的键集。
4. 获取键-值对的子集。

## Dictionary

Dictionary的定义如下：

```JAVA
public abstract class Dictionary<K,V> {}
```

`Dictionary`是JDK 1.0定义的键值对的接口，它也包括了操作键值对的基本函数。

> **注意：此类已过时。 新的实现应实现 Map 接口，而不是扩展此类。**

### Dictionary的API

```java
abstract Enumeration<V>     elements()
abstract V                  get(Object key)
abstract boolean            isEmpty()
abstract Enumeration<K>     keys()
abstract V                  put(K key, V value)
abstract V                  remove(Object key)
abstract int                size()
```

