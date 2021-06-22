---
title: Java集合之HashSet
tags: Java-集合
categories: Java
date: 2020-07-5 15:42:28



---

-

<!--more-->

# HashSet 介绍

## HashSet 简介

`HashSet`是一个没有重复元素的集合。由`HashMap`实现的，不保证元素的顺序，而且`HashSet`允许使用`null`元素。

`HashSet`是非同步的。如果多个线程同时访问一个`HashSet`，而其中至少一个线程修改了该`set`，那么它必须保持外部同步。这通常是通过对自然封装该`set`的对象执行同步操作来完成的。如果不存在这样的对象，则应该使用`Collections.synchronizedSet`方法来“包装”`set`。最好在创建时完成这一操作，以防止对该`set`进行意外的不同步访问：

## HashSet 的构造函数

```java
// 默认构造函数
public HashSet() 

// 带集合的构造函数
public HashSet(Collection<? extends E> c) 

// 指定HashSet初始容量的构造函数
public HashSet(int initialCapacity) 

// 指定HashSet初始容量和加载因子的构造函数
public HashSet(int initialCapacity, float loadFactor) 
```

# HashSet 数据结构

HashSet 的继承关系：

```
java.util.Object
	|-		java.util.Collection<E>
		|-		java.util.AbstractSet<E>
			|-		java.util.HashSet<E>
```

HashSet 的申明：

```java
public class HashSet<E>
    extends AbstractSet<E>
    implements Set<E>, Cloneable, java.io.Serializable
```

HashSet 与 Map 关系如下：

![](https://s1.ax1x.com/2020/07/06/UiIKfI.jpg)

从图中可以看出：

- `HashSet`继承于`AbstractSet`，并且实现了`Set`接口。
- `HashSet`的本质是一个"没有重复元素"的集合，它是通过`HashMap`实现的。`HashSet`中含有一个`HashMap`类型的成员变量`map`，`HashSet`的操作函数，实际上都是通过`map`实现的。

# HashSet 遍历

## 通过 Iterator 遍历 HashSet

1. 根据`iterator()`获取`HashSet`的迭代器
2. 遍历迭代器获取各个元素

```java
Iterator iterator = hashSet.iterator();
while (iterator.hasNext()) {
    System.out.println(iterator.next());
}
// 匿名局部类来写 
for(Iterator iterator = hashSet.iterator();
   		iterator.hasNext();) {
    System.out.println(iterator.next());
}
```

## 通过 for - each 遍历 HashSet

```java
for (Obj obj : hashSet){
    System.out.println(obj);
}
```

# HashSet 示例

```java
import java.util.HashSet;
import java.util.Iterator;
 
public class Test {

    /** 
    * @desc HashSet常用API的使用。 
    * 
    * @author hugh-zhan9
    */

	public static void main(String[] args) {
        // HashSet常用API
        testHashSetAPIs() ;
    }
    
    /*
     * HashSet除了iterator()和add()之外的其它常用API
     */
    private static void testHashSetAPIs() {
        // 新建HashSet
        HashSet<String> set = new HashSet<>();
    
        // 将元素添加到Set中
        set.add("a");
        set.add("b");
        set.add("c");
        set.add("d");
        set.add("e");
    
        // 打印HashSet的实际大小
        System.out.printf("size : %d\n", set.size());
    
        // 判断HashSet是否包含某个值
        System.out.printf("HashSet contains a :%s\n", set.contains("a"));
        System.out.printf("HashSet contains g :%s\n", set.contains("g"));
    
        // 删除HashSet中的“e”
        set.remove("e");
    
        // 将Set转换为数组
        String[] arr = (String[])set.toArray(new String[0]);
        for (String str:arr)
            System.out.printf("for each : %s\n", str);
    
        // 新建一个包含b、c、f的HashSet
        HashSet<String> otherset = new HashSet<>();
        otherset.add("b");
        otherset.add("c");
        otherset.add("f");
    
        // 克隆一个removeset，内容和set一模一样
        HashSet<String> removeset = (HashSet)set.clone();
        // 删除“removeset中，属于otherSet的元素”
        removeset.removeAll(otherset);
        // 打印removeset
        System.out.printf("removeset : %s\n", removeset);
    
        // 克隆一个retainset，内容和set一模一样
        HashSet retainset = (HashSet)set.clone();
        // 保留“retainset中，属于otherSet的元素”
        retainset.retainAll(otherset);
        // 打印retainset
        System.out.printf("retainset : %s\n", retainset);
    
    
        // 遍历HashSet
        // Iterator 遍历 HashSet
        for(Iterator<String> iterator = set.iterator();
               iterator.hasNext(); ) {
                System.out.printf("iterator : %s\n", iterator.next());
               }
	    // for-each 遍历 HashSet 
        for(String s:set) {
            System.out.println(s);
        }

        // 清空HashSet
        set.clear();
    
        // 输出HashSet是否为空
        System.out.printf("%s\n", set.isEmpty()?"set is empty":"set is not empty");
    }
}
```

运行结果：

```java
size : 5
HashSet contains a :true
HashSet contains g :false
for each : a
for each : b
for each : c
for each : d
removeset : [a, d]
retainset : [b, c]
iterator : a
iterator : b
iterator : c
iterator : d
a
b
c
d
set is empty
```

# HashSet 源码解析

```java
package java.util;

import java.io.InvalidObjectException;
import jdk.internal.access.SharedSecrets;


public class HashSet<E>
    extends AbstractSet<E>
    implements Set<E>, Cloneable, java.io.Serializable
{
    // java序列化机制，通过判断类的serialVersionUID来验证的版本一致性
    @java.io.Serial
    static final long serialVersionUID = -5024744406713321676L;

    // 声明一个HashMap，transient修饰表示该对象不会被序列化
    private transient HashMap<E,Object> map;

    // Dummy value to associate with an Object in the backing Map
    // 伪值，以便与后备映射中的对象相关联
    // 新建一个对象，这个对象会在后续的 HashMap中充当Value的值
    private static final Object PRESENT = new Object();


    // 构造方法，实际上是新建一个 HashMap ————HashSet是通过HashMap实现的 
    public HashSet() {
        map = new HashMap<>(); // 初始化持有的HashMap对象，由实例变量map负责持有
    }

    // 构造方法，参数为集合
    public HashSet(Collection<? extends E> c) {
        // 初始化map，将集合c的size属性值/0.75之后强转为int类型，最后与16比较取最大值设为map的容量
        map = new HashMap<>(Math.max((int) (c.size()/.75f) + 1, 16));
        /** 
        * addAll是属于AbstractCollection的方法，定义如下：
        *	public boolean addAll(Collection<? extends E> c) {
        *		boolean modified = false;
        *		for (E e : c)
        *    		if (add(e))
        *        		modified = true;
        *		return modified;
    	*	}
        */
        addAll(c);
    }

    // 构造方法，参数为初始化的大小以及负载因子
    public HashSet(int initialCapacity, float loadFactor) {
        map = new HashMap<>(initialCapacity, loadFactor);
    }

    // 构造方法，参数为初始化的大小
    public HashSet(int initialCapacity) {
        map = new HashMap<>(initialCapacity);
    }

    // 构造方法，参数为初始化的大小，负载因子，以及一个标志位
    HashSet(int initialCapacity, float loadFactor, boolean dummy) {
        map = new LinkedHashMap<>(initialCapacity, loadFactor);
    }

    // 迭代器方法，返回迭代器对象
    public Iterator<E> iterator() {
        return map.keySet().iterator();
    }

    
    public int size() {
        return map.size();
    }


    public boolean isEmpty() {
        return map.isEmpty();
    }


    public boolean contains(Object o) {
        return map.containsKey(o);
    }


    public boolean add(E e) {
        return map.put(e, PRESENT)==null;
    }


    public boolean remove(Object o) {
        return map.remove(o)==PRESENT;
    }


    public void clear() {
        map.clear();
    }

    // 表示告诉编译器忽视unchecked警告
    @SuppressWarnings("unchecked")
    public Object clone() {
        try {
            // 这里的clone是深拷贝，当原来的本体发生了改变，克隆体不会变
            HashSet<E> newSet = (HashSet<E>) super.clone();
            newSet.map = (HashMap<E, Object>) map.clone();
            return newSet;
        } catch (CloneNotSupportedException e) {
            throw new InternalError(e);
        }
    }


    @java.io.Serial
    private void writeObject(java.io.ObjectOutputStream s)
        throws java.io.IOException {
        // Write out any hidden serialization magic
        s.defaultWriteObject();

        // Write out HashMap capacity and load factor
        s.writeInt(map.capacity());
        s.writeFloat(map.loadFactor());

        // Write out size
        s.writeInt(map.size());

        // Write out all elements in the proper order.
        for (E e : map.keySet())
            s.writeObject(e);
    }


    @java.io.Serial
    private void readObject(java.io.ObjectInputStream s)
        throws java.io.IOException, ClassNotFoundException {
        // Read in any hidden serialization magic
        s.defaultReadObject();

        // Read capacity and verify non-negative.
        int capacity = s.readInt();
        if (capacity < 0) {
            throw new InvalidObjectException("Illegal capacity: " +
                                             capacity);
        }

        // Read load factor and verify positive and non NaN.
        float loadFactor = s.readFloat();
        if (loadFactor <= 0 || Float.isNaN(loadFactor)) {
            throw new InvalidObjectException("Illegal load factor: " +
                                             loadFactor);
        }

        // Read size and verify non-negative.
        int size = s.readInt();
        if (size < 0) {
            throw new InvalidObjectException("Illegal size: " +
                                             size);
        }

        // Set the capacity according to the size and load factor ensuring that
        // the HashMap is at least 25% full but clamping to maximum capacity.
        capacity = (int) Math.min(size * Math.min(1 / loadFactor, 4.0f),
                HashMap.MAXIMUM_CAPACITY);

        // Constructing the backing map will lazily create an array when the first element is
        // added, so check it before construction. Call HashMap.tableSizeFor to compute the
        // actual allocation size. Check Map.Entry[].class since it's the nearest public type to
        // what is actually created.
        SharedSecrets.getJavaObjectInputStreamAccess()
                     .checkArray(s, Map.Entry[].class, HashMap.tableSizeFor(capacity));

        // Create backing HashMap
        map = (((HashSet<?>)this) instanceof LinkedHashSet ?
               new LinkedHashMap<>(capacity, loadFactor) :
               new HashMap<>(capacity, loadFactor));

        // Read in all elements in the proper order.
        for (int i=0; i<size; i++) {
            @SuppressWarnings("unchecked")
                E e = (E) s.readObject();
            map.put(e, PRESENT);
        }
    }


    public Spliterator<E> spliterator() {
        return new HashMap.KeySpliterator<>(map, 0, -1, 0, 0);
    }

    @Override
    public Object[] toArray() {
        return map.keysToArray(new Object[map.size()]);
    }

    @Override
    public <T> T[] toArray(T[] a) {
        return map.keysToArray(map.prepareArray(a));
    }
}
```

