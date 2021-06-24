---
title: Java集合之Map总结
tags: Java-集合
categories: Java
date: 2020-07-16 22:22:28

---

-

<!--more-->

# Map 概括

1. `Map`：键值对映射的抽象接口。
2. `AbstractMap`实现了`Map`中的绝大部分函数接口。它减少了`Map`的实现类的重复编码。
3. `SortedMap`：有序的键值对映射及接口。
4. `NavigableMap`是继承于`SortedMap`的，支持导航函数的接口。
5. `HashMap`、`TreeMap`、`WeakHashMap`这三个类是键值对映射的实现类。它们各有区别：
   - `HashMap`是基于拉链法实现的散列表，属于线程不安全型，一般用于单线程程序中。
   - `WeakHashMap`也是基于拉链法实现的散列表，它一般也用于单线程程序中。相比`HashMap`，`WeakHashMap`中的键是弱键，当弱键被`GC`回收时，它对应的键值对也会被从`WeakHashMap`中删除；而`HashMap`中的键是强键。
   - `TreeMap`是有序的散列表，它是基于红黑树实现的，它一般用于单线程中存储有序的映射。

# HashMap 和 Hashtable 的区别

## HashMap 和 Hashtable 的相同点

`HashMap`和`Hashtable`都是存储键值对（key-value）的散列表，而且都是采用拉链法实现的。

存储的思路都是：通过数组存储，数组的每一个元素都是一个`Entry`；而一个`Entry`就是一个单向链表，`Entry`链表中的每一个节点就保存了`key-value`键值对数据。

添加`key-value`键值对：首先，根据`key`值计算出哈希表，再计算出数组索引(即，该`key-value`在数组中的索引)。然后根据数组索引找到`Entry`（即，单向链表），再遍历单向链表，将`key`和链表中的每一个节点的`key`进行对比。若`key`已经存在`Entry`链表中，则用该`value`值取代旧的`value`值；若`key`不存在`Entry`链表中，则新建一个`key-value`节点，并将该节点插入`Entry`链表的表头位置。

删除`key-value`键值对：删除键值对，相比于添加键值对来说，简单很多。首先，还是根据`key`值计算出哈希值，再计算出数组索引(即，该key-value在table中的索引)。然后，根据索引找出`Entry`(即，单向链表)。若节点`key-value`存在与链表`Entry`中，则删除链表中的节点即可。

## HashMap 和 Hashtable 的不同点

### 继承和实现方式不同

`HashMap`继承于`AbstractMap`，实现了`Map`、`Cloneable`、`java.io.Serializable`接口。

`Hashtable`继承于`Dictionary`，实现了`Map`、`Cloneable`、`java.io.Serializable`接口。

`HashMap`的定义：

```java
public class HashMap<K,V>
    extends AbstractMap<K,V>
    implements Map<K,V>, Cloneable, Serializable {...}
```

`Hashtable`的定义：

```java
public class Hashtable<K,V>
    extends Dictionary<K,V>
    implements Map<K,V>, Cloneable, Serializable {...}
```

从中可以看到：

`HashMap`和`Hashtable`都实现了`Map`、`Cloneable`、`java.io.Serializable`接口。

实现`Map`接口意味着他们都支持`key-value`键值对操作。支持添加`key-value`键值对、获取`key`、获取`value`、获取`map`大小、清空`map`等基本的`key-value`键值对操作。

实现了`Cloneable`接口意味着它能被克隆。

实现了`java.io.Serializable`接口，意味着他们支持序列化，能通过序列化去传输。



`HashMap`继承于`AbstractMap`，而`Hashtable`继承于`Dictionary`。

`Dictionary`是一个抽象类，它直接继承于`Object`类，没有实现任何接口。`Dictionary`类是JDK 1.0引入的。虽然`Dictionary`也支持添加key-value键值对、获取value、获取大小等基本操作，但它的API函数比`Map`少；

而且`Dictionary`一般是通过`Enumeration`(枚举类)去遍历，`Map`则是通过`Iterator`(迭代器)去遍历。然而，由于`Hashtable`也实现了`Map`接口，所以，它即支持`Enumeration`遍历，又支持`Iterator`遍历。

`AbstractMap`是一个抽象类，它实现了`Map`接口的绝大部分API函数，为`Map`的具体实现类提供了极大的便利。它是JDK 1.2新增的类。

### 线程安全不同

`Hashtable`中几乎所有的函数都是同步的，即它是线程安全的，支持多线程。而`HashMap`的函数则是非同步的，它不是线程安全的。若要在多线程中使用`HashMap`，需要我们额外的进行同步处理。

对`HashMap`的同步处理可以使用`Collections`类提供的`synchronizedMap`静态方法，或者使用 JDK 1.5之后提供的`java.util.concurrent`包中的`ConcurrentHashMap`类。

### 对 null 值的处理不同

`HashMap`的`key`，`value`都可以为`null`

`Hashtable`的`key`，`value`都不可以为`null`

`HashMap`中添加`key`，`value`的方法

```java
// 将key-value添加到HashMap中
public V put (K key, V value) {
    return putVal(hash(key), key, value, false, true);
}
public void putAll(Map<? extends K, ? extends V> m) {
    putMapEntries(m, true);
}
```

`Hashtable`中添加`key`，`value`的方法

```java
public synchronized V put(K key, V value) {
    if (value == null) {
        throw new NullPointerException();
    }
    Emtry<?,?> tab[] = table;
    int hash = key.hashCode();
    int index = (hash & 0x7FFFFFFF) % tab.length;
    @SuppressWarnings("unchecked")
    Entry<K,V> entry = (Entry<K,V>)tab[index];
    for (; entry != null ; entry = entry.next) {
        if ((entry.hash == hash) && entry.key.equals(key)) {
            V old = entry.value;
            entry.value = value;
            return old;
        }
    }
    addEntry(hash, key, value, index);
    return null;
}
```

根据上面的代码，我们可以看出：

`Hashtable`的`key`或`value`，都不能为`null`。否则，会抛出异常`NullPointerException`。

`HashMap`的`key`、`value`都可以为`null`。 当`HashMap`的`key`为`null`时，`HashMap`会将其固定的插入`table[0]`位置(即`HashMap`散列表的第一个位置)；而且`table[0]`处只会容纳一个`key`为`null`的值，当有多个`key`为`null`的值插入的时候，`table[0]`会保留最后插入的`value`。

### 支持的遍历种类不同

`HashMap`只支持`Iterator`遍历

`Hashtable`支持`Iterator`和`Enumeration`两种方式遍历

`Enumeration`是JDK 1.0才添加的接口，只有`hasMoreElements()`、`nextElement()`两个API接口，不能通过`Enumeration()`对元素进行修改。

`Iterator`是JDK 1.2才添加的接口，支持`hasNext()`、`next()`、`remove()`三个API接口。`HashMap`也是JDK 1.2才添加的，所以`Iterator`取代`Enumeration`，`HashMap`只支持`Iterator`遍历。

### 通过 Iterator 迭代器遍历时，遍历的顺序不同

`HashMap`是从前往后的遍历数组，再对数据具体某项对应的链表，从表头开始遍历。

`Hashtable`是从后往前遍历数组，再对数组具体某项对应的链表，从表头开始遍历。

`HashMap`和`Hashtable`遍历`key-value`集合的方式是：

- 通过`entrySet()`获取`Map.Entry`集合。 
- 通过`iterator()`获取`Map.Entry`集合的迭代器，再进行遍历。





### 容量的初始值和增长方式不同

`HashMap`默认的容量大小是16，增加容量时，每次将容量变为。。。

`Hashtable`默认的容量大小是11，增加容量时，每次将容量变为。。

# HashMap 和 WeakHashMap 的区别

## HashMap 和 WeakHashMap 的相同点

1. 它们都是散列表，存储的是键值对映射。
2. 它们都继承于`AbstractMap`，并且实现`Map`基础。
3. 它们的构造函数都一样。都包含4个构造函数，而且函数的参数都一样。
4. 默认的容量大小是16，默认的加载因子是0.75
5. 它们的键和值都允许为null
6. 它们都是非同步的。

## HashMap 和 WeakHashMap 的不同点

1. `HashMap`实现了`Cloneable`和`Serializable`接口，而`WeakHashMap`没有。

   `HashMap`实现了`Cloneable`，意味着它能通过`clone()`克隆自己。

   `HashMap`实现`Serializable`意味着它支持序列化，能通过序列化去传输。

2. `HashMap`的键是强引用(StrongReference)，而`WeakHashMap`的键是弱引用(WeakReference)。

   `WeakHashMap`的弱键能实现WeakReference对键值对的动态回收。当弱键不再被使用时，GC会回收它，`WeakHashMap`也会将弱键对应的键值对删除。

   这里的弱键回收实际上是通过`WeakReference`(弱引用)和`ReferenceQueue`(引用队列)实现的。首先`WeakHashMap`中:

   - 键是`WeakReference`，即`key`是弱键。
   - `ReferenceQueue`是一个引用队列，它是和`WeakHashMap`联合使用的。当弱引用所引用的对象被垃圾回收，Java虚拟机就会把这个弱引用加入到与之关联的引用队列中。`WeakHashMap`中的`ReferenceQueue`是`queue`。
   - `WeakHashMap`是通过数组实现的，我们假设这个数组是`table`

接下来说说动态回收的步骤

1. 新建`WeakHashMap`，将键值对添加到`WeakHashMap`中。将键值对添加到`WeakHashMap`中时，添加的键都是弱键。实际上，`WeakHashMap`是通过数组`table`保存`Entry(键值对)`。每一个`Entry`实际上是一个单向链表，即`Entry`是键值对链表。

2. 当某弱键不再被其他对象引用，并被GC回收时，这个弱键也同时会被添加到`queue`队列中。

   例如：当我们在将弱键`key`添加到`WeakHashMap`之后，将`key`设为`null`。这时便没有外部对象再引用该`key`了。接着当Java虚拟机的GC回收内存时，会回收`key`的相关内存，同时将`key`添加到`queue`队列中。

3. 当下一次我们需要操作`WeakHashMap`时，会先同步`table`和`queue`。`table`中保存了全部的键值对，而`queue`中保存被GC回收的弱键。同步它们就是删除`table`中被GC回收的弱键对应的键值对。

   例如：当我们读取`WeakHashMap`中的元素或获取`WeakReference`得到大小时，他会先同步`table`和`queue`。目的是删除`table`中被GC回收的弱键对应的键值对。删除的方法就是逐个比较`table`中元素的键和`queue`中的键。若它们相当，则删除`table`中的该键值对。

## HashMap 和 WeakHashMap 的比较测试程序

```java
import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;
import java.util.WeakHashMap;
import java.util.Date;
import java.lang.ref.WeakReference;

public class CompareHashmapAndWeakHashmap {

    public static void main(String[] args) throws Exception {

    	// 当弱键是String时，比较HashMap和WeakHashMap
    	compareWithString();
    	// 当弱键是自定义类型时，比较HashMap和WeakHashMap
    	compareWithSelfClass();
    }

    /**
     * 遍历map，并打印map的大小
     */
    private static void iteratorAndCountMap(Map map) {
    	// 遍历map
    	for (Iterator iter = map.entrySet().iterator(); iter.hasNext(); ) {
        	Map.Entry en = (Map.Entry)iter.next();
        	System.out.printf("map entry : %s - %s\n ",en.getKey(), en.getValue());
    	}
    	// 打印HashMap的实际大小
    	System.out.printf(" map size:%s\n\n", map.size());
    }

    // 通过String对象测试HashMap和WeakHashMap
    private static void compareWithString() {
    	// 新建4个String字符串
    	String w1 = new String("W1");
    	String w2 = new String("W2");
    	String h1 = new String("H1");
    	String h2 = new String("H2");

    	// 新建 WeakHashMap对象，并将w1,w2添加到 WeakHashMap中
    	Map wmap = new WeakHashMap();
    	wmap.put(w1, "w1");
    	wmap.put(w2, "w2");

    	// 新建 HashMap对象，并将h1,h2添加到 WeakHashMap中
    	Map hmap = new HashMap();
    	hmap.put(h1, "h1");
    	hmap.put(h2, "h2");

    	// 删除HashMap中的“h1”。
    	// 结果：删除“h1”之后，HashMap中只有 h2 ！
    	hmap.remove(h1);

    	// 将WeakHashMap中的w1设置null，并执行gc()。系统会回收w1
    	// 结果：w1是“弱键”，被GC回收后，WeakHashMap中w1对应的键值对，也会被从WeakHashMap中删除。
    	//       w2是“弱键”，但它不是null，不会被GC回收；也就不会被从WeakHashMap中删除。
    	// 因此，WeakHashMap中只有 w2
    	// 注意：若去掉“w1=null” 或者“System.gc()”，结果都会不一样！
    	w1 = null;
    	System.gc();

    	// 遍历并打印HashMap的大小
    	System.out.printf(" -- HashMap --\n");
    	iteratorAndCountMap(hmap);

    	// 遍历并打印WeakHashMap的大小
    	System.out.printf(" -- WeakHashMap --\n");
    	iteratorAndCountMap(wmap);
    }

    // 通过自定义类测试HashMap和WeakHashMap
    private static void compareWithSelfClass() {
    	// 新建4个自定义对象
    	Self s1 = new Self(10);
    	Self s2 = new Self(20);
    	Self s3 = new Self(30);
    	Self s4 = new Self(40);

    	// 新建 WeakHashMap对象，并将s1,s2添加到 WeakHashMap中
    	Map wmap = new WeakHashMap();
    	wmap.put(s1, "s1");
    	wmap.put(s2, "s2");

    	// 新建 HashMap对象，并将s3,s4添加到 WeakHashMap中
    	Map hmap = new HashMap();
    	hmap.put(s3, "s3");
    	hmap.put(s4, "s4");

    	// 删除HashMap中的s3。
    	// 结果：删除s3之后，HashMap中只有 s4 ！
    	hmap.remove(s3);

    	// 将WeakHashMap中的s1设置null，并执行gc()。系统会回收w1
    	// 结果：s1是“弱键”，被GC回收后，WeakHashMap中s1对应的键值对，也会被从WeakHashMap中删除。
    	//       w2是“弱键”，但它不是null，不会被GC回收；也就不会被从WeakHashMap中删除。
    	// 因此，WeakHashMap中只有 s2
    	// 注意：若去掉“s1=null” 或者“System.gc()”，结果都会不一样！
    	s1 = null;
    	System.gc();

    	/*
    	// 休眠500ms
    	try {
        	Thread.sleep(500);
    	} catch (InterruptedException e) {
        	e.printStackTrace();
    	}
    	// */

    	// 遍历并打印HashMap的大小
    	System.out.printf(" -- Self-def HashMap --\n");
    	iteratorAndCountMap(hmap);

    	// 遍历并打印WeakHashMap的大小
    	System.out.printf(" -- Self-def WeakHashMap --\n");
    	iteratorAndCountMap(wmap);
    }


	private static class Self { 
    	int id;

    	public Self(int id) {
    		this.id = id;
		}

    	// 覆盖finalize()方法
		// 在GC回收时会被执行
		protected void finalize() throws Throwable {
    		super.finalize();
    		System.out.printf("GC Self: id=%d addr=0x%s)\n", id, this);
    	}   
	}
}
```

