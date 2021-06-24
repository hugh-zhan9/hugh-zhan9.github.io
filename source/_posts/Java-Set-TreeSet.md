---
title: Java集合之TreeSet
tags: Java-集合
categories: Java
date: 2020-07-6 18:42:28

---



-

<!--more-->

# TreeSet 介绍

## TreeSet 简介

`TreeSet`是一个有序的集合，它的作用是提供有序的`Set`集合。它继承于`AbstractSet`抽象类，实现了`NavigableSet`, `Cloneable`, `java.io.Serializable`接口。

`TreeSet`继承于`AbstractSet`，所以它是一个`Set`集合，具有`Set`的属性和方法。
`TreeSet`实现了`NavigableSet`接口，意味着它支持一系列的导航方法。比如查找与指定目标最匹配项。
`TreeSet`实现了`Cloneable`接口，意味着它能被克隆。
`TreeSet`实现了`java.io.Serializable`接口，意味着它支持序列化。

`TreeSet`是基于`TreeMap`实现的。`TreeSet`中的元素支持2种排序方式：**自然排序**或者**根据创建TreeSet 时提供的`Comparator`进行排序**。这取决于使用的构造方法。

`TreeSet`为基本操作（`add`、`remove`和`contains`）提供受保证的`log(n)`时间开销。
另外，`TreeSet`是非同步的。 它的`iterator`方法返回的迭代器是`fail-fast`的。

## TreeSet 的构造函数

```java
// 默认构造函数，使用该构造函数TreeSet中的元素按照自然排序进行排列。
TreeSet()
// 创建的TreeSet包含Collection
TreeSet(Collection<? extends E> c)
// 指定TreeSet的比较器
TreeSet(Comparator<? extends E> comparator)
// 创建的TreeSet包含set
TreeSet(SortedSet<E> s)
```

TreeSet 特有的 API

```java
boolean                   add(E object)
boolean                   addAll(Collection<? extends E> collection)
void                      clear()
Object                    clone()
boolean                   contains(Object object)
E                         first()
boolean                   isEmpty()
E                         last()
E                         pollFirst()
E                         pollLast()
E                         lower(E e)
E                         floor(E e)
E                         ceiling(E e)
E                         higher(E e)
boolean                   remove(Object object)
int                       size()
Comparator<? super E>     comparator()
Iterator<E>               iterator()
Iterator<E>               descendingIterator()
SortedSet<E>              headSet(E end)
NavigableSet<E>           descendingSet()
NavigableSet<E>           headSet(E end, boolean endInclusive)
SortedSet<E>              subSet(E start, E end)
NavigableSet<E>           subSet(E start, boolean startInclusive, E end, boolean endInclusive)
NavigableSet<E>           tailSet(E start, boolean startInclusive)
SortedSet<E>              tailSet(E start)
```

说明：

- `TreeSet`是有序的`Set`集合，因此支持`add`、`remove`、`get`等方法。
- 和`NavigableSet`一样，`TreeSet`的导航方法大致可以区分为两类，一类是提供元素项的导航方法，返回某个元素；另一类是提供集合的导航方法，返回某个集合。
- `lower`、`floor`、`ceiling`和`higher`分别返回小于、小于等于、大于等于、大于给定元素的元素，如果不存在这样的元素，则返回`null`。

# TreeSet 数据结构

TreeSet 的继承关系

```
java.lang.Object
	|-		java.util.Collection<E>
		|-		java.util.AbstractSet<E>
			|-		java.util.TreeSet<E>
```

TreeSet 的申明

```java
public class TreeSet<E> extends AbstractSet<E>
    implements NavigableSet<E>, Cloneable, java.io.Serializable
```

TreeSet与Collection关系如下图：

![](https://s1.ax1x.com/2020/07/06/UifiqJ.jpg)

从图中可以看出：

- `TreeSet`继承于`AbstractSet`，并且实现了`NavigableSet`接口。
- `TreeSet`的本质是一个"有序的，并且没有重复元素"的集合，它是通过`TreeMap`实现的。`TreeSet`中含有一个`NavigableMap`类型的成员变量m，而`m`实际上是`TreeMap的实例`。





# TreeSet 遍历

## Iterator 顺序遍历



## for - each 遍历 HashSet





# TreeSet 示例





# TreeSet 源码解析

```java
package java.util;

public class TreeSet<E> extends AbstractSet<E>
    implements NavigableSet<E>, Cloneable, java.io.Serializable
{
    // NavigableMap 对象
    private transient NavigableMap<E,Object> m;

    // Dummy value to associate with an Object in the backing Map
    private static final Object PRESENT = new Object();

    
    TreeSet(NavigableMap<E,Object> m) {
        this.m = m;
    }

    public TreeSet() {
        this(new TreeMap<>());
    }

    public TreeSet(Comparator<? super E> comparator) {
        this(new TreeMap<>(comparator));
    }

    public TreeSet(Collection<? extends E> c) {
        this();
        addAll(c);
    }

    public TreeSet(SortedSet<E> s) {
        this(s.comparator());
        addAll(s);
    }

    public Iterator<E> iterator() {
        return m.navigableKeySet().iterator();
    }

    public Iterator<E> descendingIterator() {
        return m.descendingKeySet().iterator();
    }

    public NavigableSet<E> descendingSet() {
        return new TreeSet<>(m.descendingMap());
    }

    public int size() {
        return m.size();
    }

    public boolean isEmpty() {
        return m.isEmpty();
    }

    public boolean contains(Object o) {
        return m.containsKey(o);
    }


    public boolean add(E e) {
        return m.put(e, PRESENT)==null;
    }

    public boolean remove(Object o) {
        return m.remove(o)==PRESENT;
    }

    public void clear() {
        m.clear();
    }

  
    public  boolean addAll(Collection<? extends E> c) {
        // Use linear-time version if applicable
        if (m.size()==0 && c.size() > 0 &&
            c instanceof SortedSet &&
            m instanceof TreeMap) {
            SortedSet<? extends E> set = (SortedSet<? extends E>) c;
            TreeMap<E,Object> map = (TreeMap<E, Object>) m;
            if (Objects.equals(set.comparator(), map.comparator())) {
                map.addAllForTreeSet(set, PRESENT);
                return true;
            }
        }
        return super.addAll(c);
    }

 
    public NavigableSet<E> headSet(E toElement, boolean inclusive) {
        return new TreeSet<>(m.headMap(toElement, inclusive));
    }

  
    public NavigableSet<E> tailSet(E fromElement, boolean inclusive) {
        return new TreeSet<>(m.tailMap(fromElement, inclusive));
    }


    public SortedSet<E> subSet(E fromElement, E toElement) {
        return subSet(fromElement, true, toElement, false);
    }

 
    public SortedSet<E> headSet(E toElement) {
        return headSet(toElement, false);
    }


    public SortedSet<E> tailSet(E fromElement) {
        return tailSet(fromElement, true);
    }

    public Comparator<? super E> comparator() {
        return m.comparator();
    }

 
    public E first() {
        return m.firstKey();
    }


    public E last() {
        return m.lastKey();
    }

   
    public E lower(E e) {
        return m.lowerKey(e);
    }

   
    public E floor(E e) {
        return m.floorKey(e);
    }

    
    public E ceiling(E e) {
        return m.ceilingKey(e);
    }

   
    public E higher(E e) {
        return m.higherKey(e);
    }

    
    public E pollFirst() {
        Map.Entry<E,?> e = m.pollFirstEntry();
        return (e == null) ? null : e.getKey();
    }

    
    public E pollLast() {
        Map.Entry<E,?> e = m.pollLastEntry();
        return (e == null) ? null : e.getKey();
    }

    
    @SuppressWarnings("unchecked")
    public Object clone() {
        TreeSet<E> clone;
        try {
            clone = (TreeSet<E>) super.clone();
        } catch (CloneNotSupportedException e) {
            throw new InternalError(e);
        }

        clone.m = new TreeMap<>(m);
        return clone;
    }

    
    @java.io.Serial
    private void writeObject(java.io.ObjectOutputStream s)
        throws java.io.IOException {
        // Write out any hidden stuff
        s.defaultWriteObject();

        // Write out Comparator
        s.writeObject(m.comparator());

        // Write out size
        s.writeInt(m.size());

        // Write out all elements in the proper order.
        for (E e : m.keySet())
            s.writeObject(e);
    }

   
    @java.io.Serial
    private void readObject(java.io.ObjectInputStream s)
        throws java.io.IOException, ClassNotFoundException {
        // Read in any hidden stuff
        s.defaultReadObject();

        // Read in Comparator
        @SuppressWarnings("unchecked")
            Comparator<? super E> c = (Comparator<? super E>) s.readObject();

        // Create backing TreeMap
        TreeMap<E,Object> tm = new TreeMap<>(c);
        m = tm;

        // Read in size
        int size = s.readInt();

        tm.readTreeSet(size, s, PRESENT);
    }

   
    public Spliterator<E> spliterator() {
        return TreeMap.keySpliteratorFor(m);
    }

    @java.io.Serial
    private static final long serialVersionUID = -2479143000061671589L;
}

```

