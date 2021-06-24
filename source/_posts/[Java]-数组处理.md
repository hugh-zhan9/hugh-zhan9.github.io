---
title: 数组处理
tags: Java
categories: Java
date: 2020-06-17 22:50:29





---



数组是最常见的一种数据结构，它是相同类型的用一个标识符封装到一起的基本类型数据序列或者对象序列。数组使用一个统一的数组名和不同的下标来唯一确定数组中的元素。实质上，数组是一个简单的线性序列，因此访问速度很快。

<!--more-->

# 数组简介

**数组（`array`）是一种最简单的复合数据类型，它是有序数据的集合，数组中的每个元素具有相同的数据类型，可以用一个统一的数组名和不同的下标来确定数组中唯一的元素。根据数组的维度，可以将其分为一维数组、二维数组和多维数组等。**

数组是非常重要的集合类型，大部分计算机语言中数组具有如下三个基本特性：

- 一致性：数组只能保存相同数据类型元素，元素的数据类型可以是任何相同的数据类型。
- 有序性：数组中的元素是有序的，通过下标访问。
- 不可变性：数组一旦初始化，则长度（数组中元素的个数）不可变。

数组具有以下特点：

- 数值数组元素的默认值为 0，而引用元素的默认值为 null。
- 数组元素可以是任何类型，包括数组类型。
- 数组类型是从抽象基类 Array 派生的引用类型。

## 一维数组

一维数组（one-dimensional array）实质上是一组相同类型数据的线性集合，是数组中最简单的一种数组。数组是引用数据类型，引用数据类型在使用之前一定要做两件事情：声明和初始化。

### 分配空间

声明了数组，只是得到了一个存放数组的变量，并没有为数组元素分配内存空间，不能使用。因此要为数组分配内存空间，这样数组的每一个元素才有一个空间进行存储。分配空间就是要告诉计算机在内存中为它分配几个连续的位置来存储数据。在 Java 中可以使用 `new`关键字来给数组分配空间。分配空间的语法格式如下：

```java
arrayName = new type[size]; //数组名 = new 数据类型[数组长度];
```

> 注意：一旦声明了数组的大小，就不能再修改。这里的数组长度也是必需的，不能少。

尽管数组可以存储一组基本数据类型的元素，但是数组整体属于引用数据类型。当声明一个数组变量时，其实是创建了一个类型为“`数据类型[]`”（如`int[]`、`double[]`、`String[]`）的数组对象，它具有如下的方法和属性。

| 名称                           | 返回值     |
| ------------------------------ | ---------- |
| `clone()`                      | `Object`   |
| `equals(Object obj)`           | `boolean`  |
| `getClass()`                   | `class<?>` |
| `hashCode()`                   | `int`      |
| `notify()`                     | `void`     |
| `notyicy All()`                | `void`     |
| `toString()`                   | `String`   |
| `wait()`                       | `void`     |
| `wait(long timeout)`           | `void`     |
| `wait(long timeout,int nanos)` | `void`     |
| `length`                       | `int`      |

### 初始化

数组必须先初始化，然后才可以使用。所谓初始化，就是为数组的数组元素分配内存空间，并为每个数组元素赋初始值。

一旦为数组的每个数组元素分配了内存空间，每个内存空间里存储的内容就是该数组元素的值，即使这个内存空间存储的内容为空，这个空也是一个值（`null`）。不管以哪种方式来初始化数组，只要为数组元素分配了内存空间，数组元素就具有了初始值。初始值的获得有两种形式，一种由系统自动分配，另一种由程序员指定。

数组在初始化数组的同时，可以指定数组的大小，也可以分别初始化数组中的每一个元素。

1. 使用`new`指定数组大小后进行初始化

   ```java
   type[] arrayName = new type[size];
   arrayName[0] = value;
   ...
   ```

   如果程序员只指定了数组的长度，那么系统将负责为这些数组元素分配初始值。指定初始值时，系统按如下规则分配初始值。

   - 数组元素的类型是基本类型中的整数类型（`byte`、`short`、`int`和`long`），则数组元素的值是 0。
   - 数组元素的类型是基本类型中的浮点类型（`float`、`double`），则数组元素的值是 0.0。
   - 数组元素的类型是基本类型中的字符类型（`char`），则数组元素的值是`\u0000`。
   - 数组元素的类型是基本类型中的布尔类型（`boolean`），则数组元素的值是`false`。
   - 数组元素的类型是引用类型（类、接口和数组），则数组元素的值是`null`。

2. 使用`new`指定数组元素的值

   ```java
   type[] arrayName = new type[]{value1,...,valueN};
   ```

3. 直接指定数组元素的值

   ```java
   type[] arrayName = {value1,...,valueN};
   ```

## 二维数组和多维数组

为了方便组织各种信息，计算机常将信息以表的形式进行组织，然后再以行和列的形式呈现出来。二维数组的结构决定了其能非常方便地表示计算机中的表，以第一个下标表示元素所在的行，第二个下标表示元素所在的列。

### 创建二维数组

 在 Java 中二维数组被看作数组的数组，即二维数组为一个特殊的一维数组，其每个元素又是一个一维数组。Java 并不直接支持二维数组，但是允许定义数组元素是一维数组的一维数组，以达到同样的效果。声明二维数组的语法如下：

```java
type[][] arrayName;
```

### 初始化二维数组

二维数组可以初始化，和一维数组一样，可以通过 3 种方式来指定元素的初始值。这 3 种方式的语法如下：

```java
type[][] arrayName = new type[][]{value1,...,valueN};
type[][] arrayName = new type[size][size2];
type[][] arrayName = new type[size][];
```

### 多维数组

除了一维数组和二维数组外，Java 中还支持更多维的数组，如三维数组、四维数组和五维数组等，它们都属于多维数组。经过前面一维，二维的练习后不难发现，想要提高数组的维数，只要在声明数组时将索引与中括号再加一组即可，所以三维数组的声明为`type[][][] arrayName;`，以此类推。

 三维数组有三个层次，可以将三维数组理解为一个一维数组，其内容的每个元素都是二维数组。依此类推，可以获取任意维数的数组。

## 不规则数组

 Java 实际上没有多维数组，只有一维数组。多维数组被解释为是数组的数组，所以因此会衍生出一种不规则数组。规则的 4×3 二维数组有 12 个元素，而不规则数组就不一定了。如下代码静态初始化了一个不规则数组。

```java
int[][] intArray = {{1,2},{11},{21,22,23},{31,32,33}};
```

动态初始化不规则数组比较麻烦，不能使用`new int[4][3]`语句，而是先初始化高维数组，然后再分别逐个初始化低维数组。代码如下：

```java
int[][] intArray = new int[4][]; //先初始化高维数组为4
//逐一初始化低维数组
intArray[0] = new int[2];
intArray[1] = new int[1];
intArray[2] = new int[3];
intArray[3] = new int[3];
```

从上述代码初始化数组完成之后，不是有 12 个元素而是 9 个元素，其中下标 `[0][2]`、`[1][1]` 和 `[1][2]`是不存在的，如果试图访问它们则会抛出<font color=red>下标越界异常</font>。

> <font color=red>下标越界异常（ArrayIndexOutOfBoundsException）</font>是试图访问不存在的下标时引发的异常。

------

Java 的数组要求所有的数组元素具有相同的数据类型。因此，在一个数组中，数组元素的类型是唯一的，即一个数组里只能存储一种数据类型的数据，而不能存储多种数据类型的数据。因为 Java 语言是面向对象的语言，而类与类之间可以支持继承关系（从已有的类中派生出新的类，新的类能吸收已有类的数据属性和行为），这样可能产生一个数组里可以存放多种数据类型的假象。例如有一个水果数组，要求每个数组元素都是水果，实际上数组元素既可以是苹果，也可以是香蕉（苹果、香蕉都继承了水果，都是一种特殊的水果），但这个数组的数组元素的类型还是唯一的，只能是水果类型。

一旦数组的初始化完成，数组在内存中所占的空间将被固定下来，因此数组的长度将不可改变。即使把某个数组元素的数据清空，但它所占的空间依然被保留，依然属于该数组，数组的长度依然不变。

Java 的数组既可以存储基本类型的数据，也可以存储引用类型的数据，只要所有的数组元素具有相同的类型即可。

值得指出的是，数组也是一种数据类型，它本身是一种引用类型。例如 int 是一个基本类型，但`int[]`（这是定义数组的一种方式）就是一种引用类型了。

# Arrays类

<font color=red>`Arrays`类是一个工具类，其中包含了数组操作的很多方法。这个`Arrays`类里均为`static` 修饰的方法（`static`修饰的方法可以直接通过类名调用），可以直接通过 `Arrays.xxx(xxx)`的形式调用方法。</font>

1. `int binarySearch(type[] a, type key)`

   使用二分法查询`key`元素在 a 数组中出现的索引，如果 a 数组不包含`key`元素值，则返回负数，调用该方法时要求数组中元素已按升序排列，这样才能得到正确的结果。

2. `int binarySearch(type[] a, int fromIndex, int tolndex, type key)`

   这个方法与前一个方法类似，但它只搜索 a 数组中`fromIndex`到`toIndex`索引的元素。

3. `type[] copyOf(type[] origianl, int length)`

   这个方法把`original`数组复制成一个新数组，其中`length`是新数组的长度。如果`length`小于`original`数组的长度，则新数组就是原数组的前面`length`个元素，如果`length`大于`Original`数组的长度，则新数组的前面元素就是原数组的所有元素，后面补充 `0`（数值类型）、`false`（布尔类型）或者`null`（引用类型）。

4. `type[] copyOfRange(type[] original, int from, int to)`

   该方法与上一个方法类似，但这个方法只赋值`original`数组的`from`索引到`to`所有的元素。

5. `boolean equals(type[] a, type[] a2)`

   如果 a 数组和 a2 数组的长度相等且数组元素也一一相同，返回`true`

6. `void fill(type[] a, type val)`

   该方法将会把 a 数组的所有元素都赋值为`val`

7. `void fill(type[] a, int fromIndex, int toIndex, type val)`

   该方法与前一个方法的作用相同，区别是该方法仅仅对`fromIndex`到`toIndex`索引的数组元素赋值为`val`。

8. `void sort(type[] a)`

   该方法对 a 数组的数组元素进行排序。

9. `void sort(type[] a, int fromIndex, int toIndex)`

   该方法与前一个方法类似，区别是该方法仅仅对`fromIndex`到`toIndex`索引的元素进行排序。

10. `String toString(type[] a)`

    该方法将一个数组转换成一个字符串。该方法按顺序把多个数组元素连接在一起，多个数组元素使用逗号和空格隔开。

------

`Arrays`类的用法示例

```java
public class ArraysTest {
    public static void main(String[] args) {
        // 定义一个a数组
        int[] a = new int[] { 3, 4, 5, 6 };
        // 定义一个a2数组
        int[] a2 = new int[] { 3, 4, 5, 6 };
        // a数组和a2数组的长度相等，毎个元素依次相等，将输出true
        System.out.println("a数组和a2数组是否相等：" + Arrays.equals(a, a2));
        // 通过复制a数组，生成一个新的b数组
        int[] b = Arrays.copyOf(a, 6);
        System.out.println("a数组和b数组是否相等：" + Arrays.equals(a, b));
        // 输出b数组的元素，将输出[3, 4, 5, 6, 0, 0]
        System.out.println("b 数组的元素为：" + Arrays.toString(b));
        // 将b数组的第3个元素（包括）到第5个元素（不包括）賦值为1
        Arrays.fill(b, 2, 4, 1);
        // 输出b数组的元素，将输出[3, 4, 1, 1, 0, 0]
        System.out.println("b 数组的元素为：" + Arrays.toString(b));
        // 对b数组进行排序
        Arrays.sort(b);
        // 输出b数组的元素.将输出[0,0,1,1,3,4]
        System.out.println("b数组的元素为：" + Arrays.toString(b));
    }
}
```

`Arrays`类处于`java.util`包下，为了在程序中使用`Arrays`类，必须在程序中导入`java.util.Arrays`类。

除此之外，在`System`类里也包含了一个`static void arraycpooy(Object src,int srePos,Object dest, int dcsPos,int length)`方法，该方法可以将`src`数组里的元素赋值给`dest`数组的元素，其中`srccPos`指定从`src`数组的第几个元素开始赋值，`length`参数指定将`src`数组的多少个元素值赋给`dest`数组的元素。

------

Java8 增强了`Arrays`类的功能，为`Array`增加了一些工具方法，这些工具方法可以充分利用多 CPU 并行的能力来提高设值、排序的性能。下面是 Java 8 为 `Arrays`类增加的工具方法。

1. `void parallelPrefix(xxx[] array, XxxBinaryOperator op)`

   该方法使用`op`参数指定的计算公式计算得到的结果作为新的元素。`op`计算公式包括`left`，`right`两个形参，其中`left`代表数组中前一个索引处的元素，`right`代表数组中当前索引处的元素，当计算第一个新数组元素时，`left`默认为`1`。

2. `void parallelPrefix(xxx[] array, int toIndex, XxxBinaryOperator op)`

   该方法与上一个方法类似，区别是该方法仅重新计算`fromIndex`到`toIndex`索引的元素。

3. `void setAll(xxx[] array, IntToXxxFunction generator)`

   该方法使用指定的生成器（`generator`）为所有数组元素设置值，该生成器控制数组元素的值和生成算法。

4. `void parallelSetAll(xxx[] array, IntToXxxFunction generator)`

   该方法的功能与上一个方法相同，只是该方法增加了并行能力，可以利用多 CPU 并行来提高性能。

5. `void parallelSort(xxx[] a)`

   该方法的功能与`Arrays`类以前就有的`sort()`方法类似，只是该方法增加了并行能力，可以利用多 CPU 并行来提高性能。

6. `void parallelSort(xxx[] a, int fromIndex, int toIndex)`

   该方法与上一个方法类似，区别是该方法仅对`fromIndex`到`toIndex`索引的元素进行排序。

7. `Spliterator.OfXxx spliterator(xxx[] array)`

   将数组的所有元素转换成对应的`Spliterator`对象。

8. `Spliterator.OfXxx spliterator(xxx[] array, int startInclusive, int endExclusive)`

   该方法与上一个方法类似，区别是该方法仅转换`startInclusive`到`endExclusive`索引的元素。

9. `XxxStream stream(xxx[] array)`

   该方法将数组转换为`Stream`，`Stream`是 Java8 新增的流式编程的 API

10. `XxxStream stream(xxx[] array, int startInclusive, int endExclusive)`

    该方法与上一个方法类似，区别是该方法仅将`fromIndex`到`toIndex`索引转换为`Stream`。

上面方法列表中，所有以`parallel`开头的方法都表示该方法可利用 CPU 并行的能力来提高性能。上面方法中的`xxx`代表不同的数据类型，比如处理`int[]`型数组时应将`xxx`换成`int`，处理`long[]`型数组时应将`xxx`换成`long`。

------

```java
import java.util.Arrays;
import java.util.function.IntBinaryOperator;
import java.util.function.IntUnaryOperator;
public class ArrayTest2 {
    public static void main(String[] args) {
        int[] arr1 = new int[] {3,4,25,16,30,18};
        Arrays.parallelSort(arr1);
        System.out.println(Arrays.toString(arr1));
        int[] arr2 = new int[] {-13,-4,25,26,30,18};
        Arrays.parallelPrefix(arr2,new IntBinaryOperator(){
            //left 代表数组中前一个索引处的元素，计算第一个元素时，left为1
            //right 代表数组中当前索引处的元素
            @Override
            public int applyAsInt(int left, int right) {
                return left * right;
            }
        }); 
        System.out.println(Arrays.toString(arr2));
        int[] arr3 = new int[5];
        Arrays.parallelSetAll(arr3,new IntUnaryOperator(){
            // operand代表正在计算的元素索引
            public int applyAsInt(int operand) {
                return operand * 5;
            }
        });
        System.out.println(Arrays.toString(arr3));
    }
}
```

## 数组相等

数组相等的条件不仅要求数组元素的个数必须相等，而且要求对应位置的元素也相等。Arrays 类提供了 equals() 方法比较整个数组。语法如下：

```JAVA
Arrays.equals(arrayA, arrayB);
```

## 数组填充

`Arrays`类提供了一个`fill()`方法，可以在指定位置进行数值填充。`fill()`方法虽然可以填充数组，但是它的功能有限制，只能使用同一个数值进行填充。

```java
Arrays.fill(array, value);
```

------

示例：

```java
public static void main(String[] args){
    int[] number = new int[5];
    System.out.println("number 一共有" + number.length +"个元素，它们分别是：");
    for (int i = 0; i < number.length; i++){
        Arrays.fill(number, i);
        System.out,println("number[" + i +"]=" + i);
    }
}
```

## 查找指定元素----binarySearch()

查找数组是指从数组中查询指定位置的元素，或者查询某元素在指定数组中的位置。使用`Arrays`类的`binarySearch()`方法可以实现数组的查找，该方法可使用二分搜索法来搜索指定数组，以获得指定对象，该方法返回要搜索元素的索引值。`binarySearch()`方法有多种重载形式来满足不同类型数组的查找需要，常用的重载形式有两种。

1. `binarySearch(Object[] a, Object key);`

   其中`a`表示要搜索的数组，`key`表示要搜索的值。如果`key`包含在数组中，则返回搜索值的索引，否则返回`-1`或`-插入点`。插入点指搜索键将要插入数组的位置，即第一个大于此键的元素索引。

   <font color=red>**在进行数组查询之前，必须对数组进行排序(可以使用`sort()`方法)**</font>。如果没有对数组进行排序，则结果是不确定的。如果数组包含多个带有指定值的元素，则无法确认找到的是哪个。

2. `binarySearch(Object[] a, int fromIndex, int toIndex, Object key);`

   `fromIndex`指定索引的开始处（包括开始处），`toIndex`指定索引范围的结束处（不包括结束处）。

## 数组复制

复制数组，是指将一个数组中的元素在另一个数组中进行复制。在 Java 中实现数组复制分别有以下4中方法

- `Arrays`类的`copyOf()`方法
- `Arrays`类的`copyOfRange()`方法
- `System`类的`arraycopy()`方法
- `Object`类的`clone()`方法

#### copyOf()  和 copyOfRange() 

`Arrays`类的`copyOf()`方法与`copyOfRange()`方法都可实现对数组的复制。`copyOf()`方法是复制数组至新数组，`copyOfRange()`方法则将指定数组的指定长度复制到一个新数组中。

1. 使用`copyOf()`方法对数组进行复制

   `Arrays`类的`copyOf()`方法语法格式如下：

   ```java
   Arrays.copyOf(dataType[] srcArray, int length);
   ```

   其中，`srcArray`表示原数组，`length`表示复制后的新数组的长度。

   使用这种方法复制数组时，默认从原数组的第一个元素（索引值为0）开始复制，目标数组的长度将为`length`。如果`length`大于`srcArray.length`，则目标数组中采用默认值填充；如果`length`小于`srcArray.length`，则复制到第`length`个元素即止。

   > 注意：如果目标数组已经存在，将会被重构。

2. 使用`copyOfRange()`方法对数组进行复制

   `Arrays`类的`copyOfRange()`方法是另一种复制数组的方法，其语法结构如下：

   ```java
   Arrays.copyOfRange(dataType[] srcArray, int startIndex, int endIndex);
   ```

   `srcArray`表示原数组，`startIndex`表示开始复制的起始索引，目标数组中将包含起始索引对应的元素，另外，`startIndex`必须在`0 ~ srcArray.length`之间。`endIndex`表示终止索引，目标数组中将不包含终止索引对应的元素，`endIndex`可以大于`srcArray.length`，如果大于`srcArray.length`，则目标数组中使用默认值填充。

#### arraycopy() 

`arraycopy()`方法位于`java.lang.System`类中，语法格式如下：

```java
System.arraycopy(dataType[] srcArray, int srcIndex, dataType[] destArray, int destIndex, int length)
```

其中，`srcArray`表示原数组；`srcIndex`表示原数组的起始位置索引，`destArray`表示目标数组，`destIndex`表示目标数组的起始位置索引，`length`表示要复制的数组长度。

> 注意：在使用`arraycopy()`方法时要注意，此方法的命名违背了 Java 的命名惯例。即第二个单词`copy`的首字母没有大写，但按惯例写法应该为`arrayCopy`。请读者在使用此方法时注意方法名的书写。

#### clone()

`clone`方法也可以实现复制数组，该方法是类`Object`中的方法，可以创建一个单独内存空间的对象。因为数组也是一个`Object`类，因此也可以使用数组对象的`clone()`方法来复制数组。

<font color=red>`clone()`方法的返回值是`Object`类型，要使用强制类型转换为适当的类型</font>，其语法形式如下：

```java
arrayName.clone()
// 示例：int[] targetArray = (int[]) sourceArray.clone();
```

------

<font color=red>注意：以上几种方法都是浅拷贝（浅复制）。浅拷贝只是复制了对象的引用地址，两个对象指向同一个内存地址，所以修改其中任意的值，另一个值都会随之变化。深拷贝是将对象及值复制过来，两个对象修改其中任意的值另一个值不会改变。</font>

# 数组排序

> 注意，要想改变默认的排列顺序，不能使用基本类型（`int`,`double`,`char`）而要使用它们对应的类。

1. 升序

   导入`java.util.Arrays`包

   使用`Arrays.sort(数组名)`对数组进行排序，排序规则是从大到小，即升序。

2. 降序

   在 Java 中使用`sort`实现降序有两种方法：

   - 利用`Collections.reverseOrder()`方法

     ```java
     public static void main(String[] args){
         Integer[] a = {9, 8, 7, 2, 3, 4, 1, 0, 6, 5}; //数组类型为 Integer
         Arrays.sort(a, Collections.reverseOrder());
         for (int arr : a){
             System.out.print(arr + " ");
         }
     }
     //输出结果: 9 8 7 6 5 4 3 2 1 0
     ```

   - 实现`Comparator`接口的复写`compare()`方法

     ```java
     public class Test{
     	public static void main(String[] args) {
     		/*
     		*注意，要想改变默认的排列顺序，不能使用基本类型(int, double, char)而要使用它们对应的类
     		*/
     		Integer[] a = {9, 8, 7, 2, 3, 4, 1, 0, 6, 5};
     		// 定义一个自定义类myComparator的对象
     		Comparator cmp = new MyComparator();
     		Arrays.sort(a, cmp);
     		for (int arr : a) {
     			System.out.print(arr + " ");
     		}
     	}
     }
     // 实现 Comparator接口
     class MyComparator implements Comparator<Integer>{
     	@Override
     	public int compare(Integer o1, Integer o2){
     		/*
     		* 如果o1小于o2，就返回正值，如果o1大于o2就返回负值
     		* 这样颠倒一下，就可以实现降序排序了,反之即可自定义升序排序了
     		*/
     		return o2 - o1;
     	}
     }
     //输出结果： 9 8 7 6 5 4 3 2 1 0
     ```

   > 注意：使用以上两种方法时，数组必须是包装类型，否则会编译不通过。

## 冒泡排序法（重要）

冒泡排序`(Bubble sort)`是常用的数组排序算法之一，冒泡排序的基本思想是：对比相邻的元素值，如果满足条件就交换元素值，把较小的元素值移动到数组前面，把大的元素值移动到数组后面（也就是交换两个元素的位置），这样数组元素就像气泡一样从底部上升到顶部。

冒泡排序的算法比较简单，排序的结果稳定，但时间效率不太高。<font color=red>Java 中的冒泡排序在双层循环中实现，其中外层循环控制排序轮数，总循环次数为要排序数组的长度减 1。而内层循环主要用于对比相邻元素的大小，以确定是否交换位置，对比和交换次数依排序轮数而减少。</font>

------



```java
import java.util.Scanner;
public class BubbleSort{
	public static void main(String[] args) {
		Scanner scan = new Scanner(System.in);
		double[] score = new double[5];
		for (int i = 0; i < score.length; i++) {
			System.out.print("请输入第" + (i + 1) + "个成绩：");
			score[i] = scan.nextDouble();
		}
		System.out.println("排序前的元素值：");
		for (double val : score ) {
			System.out.print(val + "\t");
		}
		System.out.println();
		System.out.println("通过冒泡排序方法对数组进行排序：");
		for (int i = 0; i < score.length - 1; i++) {
			//比较相邻两个元素，较大的数往后冒泡
			for (int j = 0; j < score.length - 1 - i ; j++) {
				if (score[j] > score[j+1]) {
					double temp = score[j + 1]; //把第一个元素值保存到临时变量中
					score[j + 1] = score[j]; //把第二个元素值转移到第一个元素变量中
					score[j] = temp; //把临时变量(第一个元素的原始值)保存到第二个元素中
				}
				System.out.print(score[j] + " "); //对排序后的数组元素进行输出
			}
			System.out.print("【");
			for (int j = score.length - 1 - i; j < score.length ; j++) {
				System.out.print(score[j] + " ");
			}
			System.out.println("】");
		}
	}
}
```

## 快速排序法

快速排序`（Quicksort）`是对冒泡排序的一种改进，是一种排序执行效率很高的排序算法。

快速排序的基本思想是：通过一趟排序，将要排序的数据分隔成独立的两部分，其中一部分的所有数据比另外一部分的所有数据都要小，然后再按此方法对这两部分数据分别进行快速排序，整个排序过程可以

具体做法是：假设要对某个数组进行排序，首先需要任意选取一个数据（通常选用第一个数据）作为关键数据，然后将所有比它小的数都放到它的前面，所有比它大的数都放到它的后面。这个过程称为一趟快速排序；递归调用此过程，即可实现数据的快速排序。递归进行，以此使整个数据变成有序序列。

------

示例：

```java
public class QuickSort{
	public static void main(String[] args) {
		int[] number = {12, 15, 24, 99, 14, 11, 1, 2, 3};
		 System.out.println("排序前: ");
		 for (int val : number) {
		 	System.out.print(val + " ");
		 }
		 System.out.println();
		 quick(number);
		 System.out.println("排序后: ");
		 for (int val : number) {
		 	System.out.print(val + " ");
		 }
	}
	public static void quick(int[] arr){
		if(arr.length > 0) {
			//查看数组是否为空
			unckSort(arr, 0, arr.length-1);
		}
	}
	public static void unckSort(int[] arr, int low, int high){
		if (low < high) {
			int middle = getMiddle(arr, low, high); //将list数组一分为二
			unckSort(arr, low, middle-1); //对低字表进行递归排序
			unckSort(arr, middle+1, high); //对高字表进行递归排序
		}
	}
	public static int getMiddle(int[] list, int low, int high){
		int tmp = list[low];  //数组的第一个值作为中轴(凤姐点或关键数据)
		while (low < high){
			while (low < high && list[high] > tmp) {
				high--;
			}
			list[low] = list[high]; //比中轴小的记录移到低端
			while (low < high && list[low] < tmp) {
				low++;
			}
			list[high] = list[low]; //比中轴大的记录移到高端
		}
		list[low] = tmp; //中轴记录到尾
		return low; //返回中轴位置
	}
}
```

## 选择排序法

https://www.jianshu.com/p/5223afa8796c

https://www.cnblogs.com/menglong1108/p/11632225.html

https://codeplayer.vip/p/j7sbj

https://www.runoob.com/w3cnote/selection-sort.html

https://blog.csdn.net/changhangshi/article/details/82740541

https://blog.csdn.net/dangzhangjing97/article/details/79597435

https://www.cnblogs.com/2019wxw/p/11234072.html

## 直接插入排序法

直接插入排序的基本思想是：将 n 个有序数存放在数组 a 中，要插入的数为 x，首先确定 x 插在数组中的位置 p，然后将 p 之后的元素都向后移一个位置，空出 a(p)，将 x 放入 a(p)，这样可实现插入 x 后仍然有序。

https://www.cnblogs.com/2019wxw/

https://www.cnblogs.com/menglong1108/

idea激活

https://www.cnblogs.com/menglong1108/p/12111794.html

https://www.jianshu.com/p/3dca2c2f7b11

https://www.cnblogs.com/ximensama/p/12576449.html

动态初始化/静态初始化

https://www.cnblogs.com/aademeng/articles/6126742.html