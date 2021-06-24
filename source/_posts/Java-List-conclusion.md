---
title: Java集合之List总结
tags: Java-集合
categories: Java
date: 2020-07-04 20:26:28


---

-

<!--more-->

# List 概括

先回顾一下`List`的框架图

![](https://s1.ax1x.com/2020/07/15/U0dEOf.jpg)

1. `List`是一个接口，它继承于`Collection`的接口。它代表着有序的队列。
2. `AbstractList`是一个抽象类，它继承于`AbstractCollection`。`AbstractList`实现了`List`接口中除了`size()`、`get(int index)`之外的函数。
3. `AbstractSequentialList`是一个抽象类，它继承于`AbstractList`。`AbstractSequentialList`实现了链表中，根据`index`索引值操作链表的全部函数。
4. `ArrayList`, `LinkedList`, `Vector`, `Stack`是`List`的4个实现类。

> `ArrayList`是一个数组队列，相当于动态数组，随机访问效率高，随即插入、随机删除效率低。
>
> `LinkedList`是一个双向链表。它也可以被当作堆栈】队列或双端队列进行操作。`LinkedList`随机访问效率低，但随机插入、随机删除效率低。
>
> `Vector`是矢量队列，和`ArrayList`一样，它也是一个动态数组，由数组实现。但是`ArrayList`是非线程安全的，而`Vector`是线程安全的。
> `Stack`是栈，它继承于`Vector`。它的特性是：先进后出(`FILO`, `First In Last Out`)，这两个实现类已经弃用。

# List 使用场景

学东西的最终目的是为了能够连接、使用它。先说明一下各个`List`的使用场景，后面再分析原因。

如果涉及到栈、队列、链表等操作，应该考虑用`List`，具体是选择哪个`List`，可以根据下面的标准来取舍。

- 对于需要快速插入、删除元素，应该使用`LinkedList`。
- 对于需要快速随机访问元素，应该使用`ArrayList`。

通过下面的测试程序，可以验证上面的结论。相关代码如下：

```java
import java.util.*;
import java.lang.Class;

/**
* @desc 对比ArrayList和LinkedList的插入、随机读取效率、删除效率
*/
public class ListCompareTest {
    private static final int COUNT = 100000;
    private static LinkedList linkedList = new LinkedList();
    private static ArrayList arrayList = new ArrayList();
    
    public static void main(String[] args) {
        System.out.println();
        // 插入
        insertByPosition(linkedList);
        insertByPosition(arrayList);
        System.out.println();
        // 随机读取
        readByPosition(linkedList);
        readByPosition(arrayList);
        System.out.println();
        // 删除
        deleteByPosition(linkedList);
        deleteByPosition(arrayList);
        System.out.println();
    }
    private static String getListName(List list) {
        if (list instanceof LinkedList) {
            return "LinkedList";
        } else {
            return "ArrayList";
        }
    }
    // 向list的指定位置插入COUNT个元素，并统计时间
    private static void insertByPosition(List list) {
        long startTime = System.currentTimeMillis();
        // 向list的位置0插入COUNT个数
        for (int i=0; i<COUNT; i++)
            list.add(0, i);
        long endTime = System.currentTimeMillis();
        long interval = endTime - startTime;
        System.out.println(getListName(list) + " : insert "+COUNT+" elements into the 1st position use time：" + interval+" ms");
    }
    // 从list的指定位置删除COUNT个元素，并统计时间
    private static void deleteByPosition(List list) {
        long startTime = System.currentTimeMillis();
        // 删除list第一个位置元素
        for (int i=0; i<COUNT; i++)
            list.remove(0);
        long endTime = System.currentTimeMillis();
        long interval = endTime - startTime;
        System.out.println(getListName(list) + " : delete "+COUNT+" elements into the 1st position use time：" + interval+" ms");
    }
    // 根据position，不断从list中读取元素，并统计时间
    private static void readByPosition(List list) {
        long startTime = System.currentTimeMillis();
        for (int i=0; i<COUNT; i++) 
            list.get(i);
        long endTime = System.currentTimeMillis();
        long interval = endTime - startTime;
        System.out.println(getListName(list) + " : read "+COUNT+" elements into the 1st position use time：" + interval+" ms");    
    }
}
```

运行结果如下：

```java
LinkedList : insert 100000 elements into the 1st position use time：7 ms
ArrayList : insert 100000 elements into the 1st position use time：549 ms

LinkedList : read 100000 elements into the 1st position use time：3841 ms
ArrayList : read 100000 elements into the 1st position use time：2 ms

LinkedList : delete 100000 elements into the 1st position use time：5 ms
ArrayList : delete 100000 elements into the 1st position use time：428 ms
```

从运行结果中可以看到：

- 插入10万个元素，`LinkedList`所花时间最短：`7ms`。
- 删除10万个元素，`LinkedList`所花时间最短：`5ms`。
- 遍历10万个元素，`LinkedList`所花时间最长：`3841ms`。

可以的到结论：

- 需要快速插入，删除元素，应该使用`LinkedList`。
- 需要快速随机访问元素，应该使用`ArrayList`。

# LinkedList 和 ArrayList 性能差异分析

下面分析以下为什么`LinkedList`中插入元素很快，而`ArrayList`中插入元素很慢。`LinkedList`源码中向指定位置插入元素的代码如下：

```java
// 在index前添加节点，且节点的值为element
public void add(int index, E element) {
    checkPositionIndex(index);
    if (inedx == size)
        linkLast(element);
    else
        linkBefore(element, node(index));
}
// 获取双向链表中指定位置的节点
Node<E> node(int index) {
    // assert isElementIndex(index);
    if (index < (size >> 1)) {
        Node<E> x = first;
        for (int i = o; i < index; i++)
            x = x.next;
        return x;
    } else {
        Node<E> x = last;
        for (int i =size -1; i > index; i--)
            x = x.prev;
        return x;
    }
}
void linkBefore(E e, Node<E> succ) {
    // assert succ != null;
    final Node<E> pred = succ.prev;
    final Node<E> newNode = new Node<>(pred, e, succ);
    succ.prev = newNode;
    if (pred == null)
        first = newNode;
    else
        pred.next = newNode;
    size++;
    modCount++;
}
```

从中可以看到：通过`add(int index, E element)`向`LinkedList`插入元素时。先是在双向链表中找到要插入节点的位置`index`；找到之后，再插入一个新的节点。

双向链表查找`index`位置的节点时，有一个加速动作；若`index < 双向链表长度的1/2`，则从前往后查找。否则从后往前查找。

再看看`ArrayList`源码中向指定位置插入元素的代码如下：

```java
// 将e添加到ArrayList的指定位置
public void add(int index, E element) {
    rangeCheckForAdd(index);
    modeCount++;
    final int s;
    Object[] elementData;
    if ((s = size) == (elementData = this.elementData).length)
        elementData = grow();
    System.arraycopy(elementData, index,
                     elementData, index + 1,
                     s - index);
    elementData[index] = element;
    size = s + 1;
}
```

`arraycopy()`是个`JNI`函数，它是在`JVM`中实现的。sunJDK中看不到源码，不过可以在OpenJDK中看到源码。网上有对`arraycopy()`的分析说明，可以参考[System.arraycopy源码分析](https://blog.csdn.net/u011642663/article/details/49512643)

实际上只需要了解：`System.arraycopy(elementData, index, elementData, index + 1, size - index)`。会移动`index`之后所有元素即可。这就意味着，`ArrayList`的`add(int index, E element)`函数会引起`index`之后所有元素的改变。

通过上面的分析就可以理解为什么`LinkedList`中插入元素很快，而`ArrayList`中插入却很慢。"删除元素"与"插入元素"的原理类似，不再过多赘述。

接下来看看：为什么`LinkedList`中随机访问很慢，而`ArrayList`中随机访问很快。`LinkedList`随机访问的相关代码如下：

```java
// 返回LinkedList指定位置的元素
public E get(int index) {
    checkElementIndex(index);
    return node(index).item;
}
// 获取双向链表中指定位置的节点
Node<E> node(int index) {
    // assert isElementIndex(index);
    if (index < (size >> 1)) {
        Node<E> x = first;
        for (int i = 0; i < index; i++)
            x = x.next();
        return x;
    } else {
        Node<E> x = last;
        for (int i = size -1; i > index; i--)
            x = x.prev;
        return x;
    }
}
```

从中可以看出：通过`get(int index)`获取`LinkedList`第`index`个元素时，先是调用`checkPositionIndex(int index)`方法判断`index`是否在`List`的索引范围内。再调用`node(int index)`查找`index`位置的节点，有一个加速动作：若`index < 双向链表长度的1/2，则从前向后查找`，否则从后往前查找。

再来看看`ArrayList`随机访问的相关代码：

```java
// 获取index位置元素的值
public E get(int index) {
    Object.checkIndex(index, size);
    checkForComodification();
    return root.elementData(offset + index);
}

E elementData(int index) {
    return (E) elementData[index];
}
```

从上面可以看到：通过`get(int index)`获取`ArrayList`第`index`元素时，调用`elemenetData`返回指定元素，而不需要像LinkedList一样进行查找。

# Vector 和 ArrayList 比较

## 相同之处

### 它们都是 List

它们都继承于`AbstractList`，并且都实现了`List`接口。`ArrayList`和`Vector`的类定义如下：

```java
// ArrayList的定义
public class ArrayList<E> extends AbstractList<E>
        implements List<E>, RandomAccess, Cloneable, java.io.Serializable {}
// Vector的定义
public class Vector<E> extends AbstractList<E>
    implements List<E>, RandomAccess, Cloneable, java.io.Serializable {}
```

### 它们都实现了 RandomAccess 和 Cloneable 接口

实现`RandomAccess`接口，意味着它们都支持快速随机访问。

实现`Cloneable`接口，意味着它们都能克隆自己。

### 它们都是通过数组实现的，本质上都是动态数组

`ArrayList`中定义数组`elementData`用于保存元素

```java
// 保存ArrayList中数据的数组
transient Object[] elementData;
// 保存Vector中数据的数组
protected Object[] elementData;
```

### 它们的默认数组容量是10

若创建`ArrayList`或`Vector`时，没指定容量大小；则使用默认容量大小10。

`ArrayList`的默认构造函数如下：

```java
public ArrayList() {
	this.elementData = DEFAULTCAPACITY_EMPTY_ELEMENTDATA;
}
```

`Vector`的默认构造函数如下：

```java
public Vector() {
    this(10);
}
```



### 它们都支持 Iterator 和 listIterator 遍历

它们都继承与`AbstractList`，而`AbstractList`中分别实现了`iterator()`接口返回`Iterator`迭代器和`listList()`返回`ListIterator`迭代器。

## 不同之处

### 线程安全性不一样

`ArrrayList`是非线程安全的；而`Vector`是线程安全的，它的函数都是`synchronized`的，即都是支持同步的。

`ArrayList`适用于单线程，`Vector`适用于多线程。

### 对序列化支持不同

`ArrayList`支持序列化，而`Vector`不支持；即`ArrayList`有实现`java.io.Serializable`接口，而`Vector`没有实现该接口。

### 构造函数个数不同

`ArrayList`有3个构造函数，而`Vector`有4个构造函数。`Vector`除了包括和`ArrayList`类似的3个构造函数之外，另外的一个构造函数可以指定容量增加系数。

`ArrayList`的构造函数如下：

```java
public ArrayList(int initialCapacity) {
	if (initialCapacity > 0) {
		this.elementData = new Object[initialCapacity];
	} else if (initialCapacity == 0) {
		this.elementData = EMPTY_ELEMENTDATA;
	} else {
		throw new IllegalArgumentException("Illegal Capacity: "+
                                           initialCapacity);
	}
}

public ArrayList() {
    this.elementData = DEFAULTCAPACITY_EMPTY_ELEMENTDATA;
}

public ArrayList(Collection<? extends E> c) {
	elementData = c.toArray();
    if ((size = elementData.length) != 0) {
        if (elementData.getClass() != Object[].class)
            elementData = Arrays.copyOf(elementData, size, Object[].class);
	} else {
		this.elementData = EMPTY_ELEMENTDATA;
	}
}
```

`Vector`的构造函数如下：

```java
public Vector(int initialCapacity, int capacityIncrement) {
	super();
	if (initialCapacity < 0)
		throw new IllegalArgumentException("Illegal Capacity: "+
                                           initialCapacity);
	this.elementData = new Object[initialCapacity];
	this.capacityIncrement = capacityIncrement;
}

public Vector(int initialCapacity) {
	this(initialCapacity, 0);
}

public Vector() {
	this(10);
}

public Vector(Collection<? extends E> c) {
	elementData = c.toArray();
	elementCount = elementData.length;
	if (elementData.getClass() != Object[].class)
        elementData = Arrays.copyOf(elementData, elementCount, Object[].class);
}
```

### 容量增加方式不同

逐个添加元素时，`Vector`的容量增长与增长系数有关，若指定了增长系数，且增长系数有效(即，大于0)；那么，每次容量不足时，`新的容量=原始容量+增长系数`。若增长系数无效(即，小于/等于0)，则`新的容量=原始容量 x 2`。

`ArrayList`中容量增长的主要函数如下：

```java
public void ensureCapacity(int minCapacity) {
	if (minCapacity > elementData.length
        && !(elementData == DEFAULTCAPACITY_EMPTY_ELEMENTDATA
             && minCapacity <= DEFAULT_CAPACITY)) {
        modCount++;
        grow(minCapacity);
	}
}
```

`Vector`中容量增长的主要函数如下：

```java
public synchronized void ensureCapacity(int minCapacity) {
	if (minCapacity > 0) {
		modCount++;
		if (minCapacity > elementData.length)
		grow(minCapacity);
	}
}
```

### 对 Enumeration 的支持不同。 Vector 支持通过 Enumeration去遍历，而 List 不支持

`Vector`中实现`Enumeration`的相关方式如下：

```java
public Enumeration<E> element()
    return new Enumeration<E>() {
    int count = 0;
    public boolean hasMoreElements() {
        return count < elementCount;
    }
    public E nextElement() {
        synchronized (Vector.this) {
            if (count < elementCount) {
                return elementData(count++);
            }
        }
        throw new NoSuchElementException("Vector Enumeration");
    };
}
```

