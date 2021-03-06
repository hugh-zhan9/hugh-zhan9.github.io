---
title: 数据结构 - 数组
tags: 数据结构与算法
categories: 数据结构与算法
date: 2021-05-28 20:10:00


---



![](https://ftp.bmp.ovh/imgs/2020/04/63a522b242d7a443.jpg)

<!--more-->

> [课程地址](https://time.geekbang.org/column/article/40961)

每一种编程语言中，基本上都会有数组这种数据类型。不过，**它不仅仅是一种编程语言中的数据类型，还是一种最基础的数据结构。**尽管数组看起来非常基础、简单，但是我估计很多人都并没有理解这个基础数据结构的精髓。

> 注意区分**数据类型**和**数据结构**是两个不同概念。数组作为数据结构是具体的底层实现，而数组作为数据类型可以有不同的底层数据结构实现，比如链表，哈希表等

在大部分编程语言中，数组都是从 0 开始编号的，但你是否下意识地想过，为什么数组要从 0 开始编号，而不是从 1 开始呢？ 从 1 开始不是更符合人类的思维习惯吗？

> 数组的下标是一种offset的概念, 而不是第几个的意思. 方便与机器对于地址的解析, 符合计算机的寻址方式.

数组的下标应该是一种`offset（偏移）`的概念，而不是第几个的意思。如果用 a 来表示数组的首地址，a[0] 就是偏移为 0 的位置，也就是首地址，a[k] 就表示偏移 k 个 type_size 的位置，

所以计算 a[k]的内存地址只需要用这个公式：

````
a[k]_address = base_address + k * type_size
````

但是，如果数组从 1 开始计数，那计算数组元素 a[k]的内存地址就会变为：

```
a[k]_address = base_address + (k-1)*type_size
```

对比两个公式可以发现，从 1 开始编号，每次随机访问数组元素都多了一次减法运算，对于 CPU 来说，就是多了一次减法指令。

# 数组是如何实现随机访问的

## 什么是数组？

数组（Array）是一种**线性表**数据结构，它用一组**连续的内存空间**来存储一组**具有相同类型的数据**。

> 线性表：数据排成像一条线一样的结构。每个线性表上的数据最多只有前和后两个方向。非线性表: 数据之间并不是简单的前后关系。线性表数据结构包括: 数组、链表、队列、栈。非线性表数据结构包括: 二叉树、堆、图

1. 线性表

   线性表（Linear List），顾名思义：线性表就是数据排除一条线一样的结构。每个线性表上的数据最多只有前和后两个方向。除了数组，链表、队列、栈等也是线性表结构。

   ![](https://static001.geekbang.org/resource/image/b6/77/b6b71ec46935130dff5c4b62cf273477.jpg)

   与线性表对立的就是非线性表，比如二叉树、堆、图等。之所以叫非线性是因为在非线性表中，数据之间并不是简单的前后关系

   ![](https://static001.geekbang.org/resource/image/6e/69/6ebf42641b5f98f912d36f6bf86f6569.jpg)

2. 连续的内存空间和相同类型的数据

正是因为这两个限制，数组才有了一个堪称“杀手锏”的特性：**随机访问**。但有利就有弊，这两个限制也让数组的很多操作变得非常低效，比如要想在数组中删除、插入一个数据，为了保证连续性，就需要做大量的数据搬移工作。

**那么数组是如何实现根据下标随机访问数组元素的呢？**

拿一个长度为 10 的 int 类型的数组 `int[] a = new int[10]` 来举例。在下面这个图中，计算机给数组 `a[10]`，分配了一块连续内存空间 1000～1039，其中，内存块的首地址为 base_address = 1000。

>Int长度是4个字节，所以分配的内存长度是10×4=40，此处内存分配从1000-1039共40个字节长度。此处使用的Java语言定义int类型，Java基本类型的整型分4中：byte、short、int、long，长度分别为1、2、4、8，所以此处int数组的每个值长度为4

![](https://static001.geekbang.org/resource/image/98/c4/98df8e702b14096e7ee4a5141260cdc4.jpg)

我们知道，计算机会给每个内存单元分配一个地址，计算机通过地址来访问内存中的数据。当计算机需要随机访问数组中的某个元素时，它会首先通过下面的寻址公式，计算出该元素存储的内存地址：

```java
a[i]_address = base_address + i * data_type_size 
// data_type_size 表示数组中每个元素的大小
```

> 这里要特别纠正一个“错误”。在面试的时候，常常会问数组和链表的区别，很多人都回答说，“链表适合插入、删除，时间复杂度 `O(1)`；数组适合查找，查找时间复杂度为 `O(1)`”。
>
> 实际上，这种表述是不准确的。数组是适合查找操作，但是查找的时间复杂度并不为 `O(1)`。即便是排好序的数组，你用二分查找，时间复杂度也是 `O(logn)`。所以，正确的表述应该是：**数组支持随机访问，根据下标随机访问的时间复杂度为 `O(1)`**。

# 低效的插入和删除

由于数组保持了内存数据的连续性，所以会导致插入、删除这两个操作比较低效。那么为什么会导致低效呢？有什么方法改进呢？

## 插入

假设数组的长度为 n，现在，如果我们需要将一个数据插入到数组中的第 k 个位置。为了把第 k 个位置腾出来，给新来的数据，我们需要将第 k～n 这部分的元素都顺序地往后挪一位。那插入操作的时间复杂度是多少呢？你可以自己先试着分析一下。

>往数组中插入数据，此时根据数组长度不同，复杂度会有量级的差距。 
>
>最好：在最后一位插入数据，不用移动元素，复杂度`O(1)`； 
>
>最差：在第一位插入数据，所有元素向右移动n位，复杂度`O(n)`； 
>
>平均：先考虑概率，就是每个位置插入元素的情况是`1/n`。插入数组的第一位，需要将剩余元素向右移动n个位置，插入数组的第二位，需要将剩余元素向右移动n-1个位置。。。由此得到：`( n + n-1 + n-2 + ... + 1 + 0 ) * 1/n = (n+1)/2`。去掉系数则复杂度为`O(n)`)。

如果数组中的数据是有序的，我们在某个位置插入一个新的元素时，就必须按照刚才的方法搬移 k 之后的数据。但是，如果数组中存储的数据并没有任何规律，数组只是被当作一个存储数据的集合。在这种情况下，如果要将某个数据插入到第 k 个位置，为了避免大规模的数据搬移，一个简单的办法就是，直接将第 k 位的数据搬移到数组元素的最后，把新的元素直接放入第 k 个位置。

利用这种处理技巧，在特定场景下，在第 k 个位置插入一个元素的时间复杂度就会降为 `O(1)`。这个处理思想在快排中就会用到。

>Java 中的`ArrayList`中的`add()`方法就有两种实现 
>
>```java
>// 末尾插入，时间复杂度是O(1)
>public boolean add(E e) {
>...
>}
>
>// 指定位置插入挪动元素，时间复杂度是O(n)
>public void add(int index, E element) {
>...
>}
>```

## 删除

删除数据和插入数据类似，如果我们要删除第 k 个位置的数据，为了内存的连续性，也需要搬移数据，不然中间就会出现空洞，内存就不连续了。

> 这是为了数组定义中的内存连续这个特性，所以插入和删除很多情况下多了很多移动数据的操作。

如果删除数组末尾的数据，则最好情况时间复杂度为 `O(1)`；如果删除开头的数据，则最坏情况时间复杂度为 `O(n)`；平均情况时间复杂度也为 `O(n)`。

实际上，在某些特殊场景下，并不一定非得追求数组中数据的连续性。如果我们将多次删除操作集中在一起执行，删除的效率是不是会提高很多呢？

我们继续来看例子。数组 a[10]中存储了 8 个元素：a，b，c，d，e，f，g，h。现在，我们要依次删除 a，b，c 三个元素。

![](https://static001.geekbang.org/resource/image/b6/e5/b69b8c5dbf6248649ddab7d3e7cfd7e5.jpg)

为了避免 d，e，f，g，h 这几个数据会被搬移三次，可以先记录下已经删除的数据。每次的删除操作并不是真正地搬移数据，只是记录数据已经被删除。当数组没有更多空间存储数据时，再触发执行一次真正的删除操作，这样就大大减少了删除操作导致的数据搬移。

>这跟MySQL InnoDB的两阶段提交有点像，数据页的修改先在内存中修改，记redo log。等服务空闲，内存满了，redo log满了或者查操作的情况会触发merge 将脏页merge到磁盘。并不是直接操作磁盘，目的是减少IO。当然，是不一样的，只是恰好联想到这个所谓的WAL技术。 还有 InnoDB对表数据空间纪录的删除并不是真正的删除，而是标记为可复用，等待着空间被插入的数据复用。这种操作会造成空间的空洞也就是磁盘碎片。所以你会发现，delete一堆数据后表数据的文件大小没有变。当然如果你drop掉这张表的话那就尘归尘，土归土了。解决大量空洞的方法就是重做表 —— [极客时间《MySQL实战45讲》]()。

如果你了解 JVM，你会发现，这不就是 JVM 标记清除垃圾回收算法的核心思想吗？没错，数据结构和算法的魅力就在于此，很多时候**我们并不是要去死记硬背某个数据结构或者算法，而是要学习它背后的思想和处理技巧，这些东西才是最有价值的。**如果你细心留意，不管是在软件开发还是架构设计中，总能找到某些算法和数据结构的影子。

> JVM垃圾回收算法: 
>
> 1.复制算法. 2.标记清除算法. 3.标记整理算法. 
>
> 简单思想: 数组中删除数据时,并不真正的删除,而是标记一下，先不进行数据的搬移工作，等数组空间不够用时，再执行删除操作进行数据的搬移工作。→  这样可以减少因为删除操作导致的数据搬移。这种思想在JVM垃圾回收算法的标记清除算法中也有体现：第一遍扫描先标记垃圾对象，第二遍扫描再清除垃圾对象。→  这种垃圾回收算法容易产生内存碎片，导致出现虽然内存空间充足，但是无法放置大对象的现象。

# 数组的访问越界问题

首先，我请你来分析一下这段 C 语言代码的运行结果：

```c
int main(int argc, char* argv[]){
    int i = 0;
    int arr[3] = {0};
    for(; i<=3; i++){
        arr[i] = 0;
        printf("hello world\n");
    }
    return 0;
}
```

你发现问题了吗？这段代码的运行结果并非是打印三行“hello word”，而是会无限打印“hello world”，这是为什么呢？

因为，数组大小为 3，a[0]，a[1]，a[2]，而我们的代码因为书写错误，导致 for 循环的结束条件错写为了 `i<=3` 而非 `i<3`，所以当 `i=3` 时，数组 a[3]访问越界。

我们知道，在 C 语言中，只要不是访问受限的内存，所有的内存空间都是可以自由访问的。根据我们前面讲的数组寻址公式，a[3]也会被定位到某块不属于数组的内存地址上，而这个地址正好是存储变量 i 的内存地址，那么 a[3]=0 就相当于 i=0，所以就会导致代码无限循环。

>作者答复：
>
>1. 不同的语言对数组访问越界的处理方式不同，即便是同一种语言，不同的编译器处理的方式也不同。至于你熟悉的语言是怎么处理的，请行百度。
>
>2. C语言中，数组访问越界的处理是未决。并不一定是错，有同学做实验说没问题，那并不代表就是正确的。
>
>3. 我觉得那个例子，栈是由高到低位增长的，所以，i和数组的数据从高位地址到低位地址依次是：`i`，`a[2]`，`a[1]`，`a[0]`。`a[3]`通过寻址公式，计算得到地址正好是`i`的存储地址，所以`a[3]=0`，就相当于`i=0`.
>
>精彩评论解释：
>
>对于死循环那个问题，要了解栈这个东西。栈是向下增长的，首先压栈的`i`，`a[2]`，`a[1]`，`a[0]`，这是我在我VC上调试查看汇编的时候看到的压栈顺序。相当于访问`a[3]`的时候，是在访问`i`变量，而此时`i`变量的地址是数组当前进程的，所以进行修改的时候，操作系统并不会终止进程。
>
>对文中示例的无限循环有疑问的同学，建议去查函数调用的栈桢结构细节（操作系统或计算机体系结构的教材应该会讲到）。函数体内的局部变量存在栈上，且是连续压栈。在Linux进程的内存布局中，栈区在高地址空间，从高向低增长。变量`i`和`arr`在相邻地址，且`i`比`arr`的地址大，所以`arr`越界正好访问到`i`。当然，前提是`i`和`arr`元素同类型，否则那段代码仍是未决行为。
>
>关于数组越界访问导致死循环的问题，我也动手实践了一下，发现结果和编译器的实现有关，gcc有一个编译选项（`-fno-stack-protector`）用于关闭堆栈保护功能。默认情况下启动了堆栈保护，不管`i`声明在前还是在后，`i`都会在数组之后压栈，只会循环4次；如果关闭堆栈保护功能，则会出现死循环。请参考：https://www.ibm.com/developerworks/cn/linux/l-cn-gccstack/index.html
>
>例子中死循环的问题跟编译器分配内存和字节对齐有关数组3个元素加上一个变量i 。4个整数刚好能满足8字节对齐所以`i`的地址恰好跟着`a[2]`后面，导致死循环。如果数组本身有4个元素则这里不会出现死循环。因为编译器64位操作系统下默认会进行8字节对齐变量`i`的地址就不紧跟着数组后面了。
>
>对于数组访问越界造成无限循环，我理解是编译器的问题，对于不同的编译器，在内存分配时，会按照内存地址递增或递减的方式进行分配。上面的程序，如果是内存地址递减的方式，就会造成无限循环。



数组越界在 C 语言中是一种未决行为，并没有规定数组访问越界时编译器应该如何处理。因为，访问数组的本质就是访问一段连续内存，只要数组通过偏移计算得到的内存地址是可用的，那么程序就可能不会报任何错误。

这种情况下，一般都会出现莫名其妙的逻辑错误，就像我们刚刚举的那个例子，debug 的难度非常的大。而且很多计算机病毒也正是利用到了代码中的数组越界可以访问非法地址的漏洞，来攻击系统，所以写代码的时候一定要警惕数组越界。

但并非所有的语言都像 C 一样，把数组越界检查的工作丢给程序员来做，像 Java 本身就会做越界检查，比如下面这几行 Java 代码，就会抛出 `java.lang.ArrayIndexOutOfBoundsException`。

```java
int[] a = new int[3];
a[3] = 10;
```

# 容器与数组

针对数组类型，很多语言都提供了容器类，比如 Java 中的 ArrayList、C++ STL 中的 vector。在项目开发中，什么时候适合用数组，什么时候适合用容器呢？

如果你是 Java 工程师，几乎天天都在用 ArrayList，对它应该非常熟悉。那它与数组相比，到底有哪些优势呢？

个人觉得，ArrayList 最大的优势就是**可以将很多数组操作的细节封装起来**。比如前面提到的数组插入、删除数据时需要搬移其他数据等。另外，它还有一个优势，就是**支持动态扩容**。

数组本身在定义的时候需要预先指定大小，因为需要分配连续的内存空间。如果我们申请了大小为 10 的数组，当第 11 个数据需要存储到数组中时，我们就需要重新分配一块更大的空间，将原来的数据复制过去，然后再将新的数据插入。如果使用 ArrayList，我们就完全不需要关心底层的扩容逻辑，ArrayList 已经帮我们实现好了。每次存储空间不够的时候，它都会将空间自动扩容为 1.5 倍大小。

不过，这里需要注意一点，因为扩容操作涉及内存申请和数据搬移，是比较耗时的。所以，如果事先能确定需要存储的数据大小，**最好在创建 ArrayList 的时候事先指定数据大小**。

看下面这几行代码，你会发现相比之下：事先指定数据大小可以省掉很多次内存申请和数据搬移操作。

```java
ArrayList<User> users = new ArrayList(10000);
for (int i = 0; i < 10000; ++i) {
    users.add(xxx);
}
```

那数组就无用武之地了呢？当然不是，有些时候，用数组会更合适些，比如以下几个场景：

1. Java ArrayList 无法存储基本类型，比如 int、long，需要封装为 Integer、Long 类，而 Autoboxing、Unboxing 则有一定的性能消耗，所以如果特别关注性能，或者希望使用基本类型，就可以选用数组。

2. 如果数据大小事先已知，并且对数据的操作非常简单，用不到 ArrayList 提供的大部分方法，也可以直接使用数组。
3. 当要表示多维数组时，用数组往往会更加直观。比如 `Object[][] array`；而用容器的话则需要这样定义：`ArrayList<ArrayList<object> > array`。

> 总结：
>
> 对于业务开发，直接使用容器就足够了，省时省力。毕竟损耗一丢丢性能，完全不会影响到系统整体的性能。但如果你是做一些非常底层的开发，比如开发网络框架，性能的优化需要做到极致，这个时候数组就会优于容器，成为首选。

# 思考

前面基于数组的原理引出 JVM 的标记清除垃圾回收算法的核心理念。回顾下你理解的标记清除垃圾回收算法。

>大多数主流虚拟机采用**可达性分析算法**来判断对象是否存活，在标记阶段，会遍历所有 GC ROOTS，将所有 GC ROOTS 可达的对象标记为存活。只有当标记工作完成后，清理工作才会开始。
>
>不足：
>
>1. 效率问题。标记和清理效率都不高，但是当只有少量垃圾产生时会很高效。
>2. 空间问题。会产生不连续的内存空间碎片。

前面讲到一维数组的内存寻址公式，类比一下，二维数组的内存寻址公式是怎样的呢？

>对于 m * n 的数组，`a[i][j](i<m, j<n)`的地址为：
>
>```
>a[i][j]_address = base_address + (i*n+j)* data_type_size 
>```
