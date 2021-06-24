---
title: 字符串处理
tags: Java
categories: Java
date: 2020-06-14 21:09:29



---

字符串广泛应用 在 Java 编程中，在 Java 中字符串属于对象，Java 提供了`String`类来创建和操作字符串。

<!--more--->

# 创建字符串

字符串变量必须经过初始化才能使用。

- 关键字和构造方法创建

  `String`类的构造方法有多种重载修饰，每种修饰都可以定义字符串。

  1. `String()`

     初始化一个新创建的`String`对象，表示一个空字符序列。

  2. `String(String original)`

     初始化一个新创建的`String`对象，使其表示一个与参数相同的字符序列。换句话说，新创建的字符串是该参数字符串的副本。

     ```java
     String str1 = new String("Hello Java");
     String str2 = new String(str1);
     ```

     这里`str1`和`str2`值是相等的。

  3. `String(char[]value)`

     分配一个新的字符串，将参数中的字符数组元素全部变为字符串。该字符数组的内容已被复制，后续对字符数组的修改不会影响新创建的字符串。

     ```java
     char a[] = {'H','e','l','l','o'};
     String sChar = new String(a);
     a[1] = 's';
     ```

     上述`sChar`变量的值是字符串`Hello`。即使在创建字符串之后，对a数组中的第二个元素进行了修改，但未影响`sChar`的值。

  4. `String(char[]value,int offset,int count)`

     分配一个新的`String`，它包含来自该数组参数一个子数组的字符。`offset`参数是子数组第一个字符的索引，`count`参数指定子数组的长度。该子数组的内容已被赋值，后续对字符数组的修改不会影响新创建的字符串。

     ```java
     char a[] = {'H','e','l','l','o'};
     String sChar=new String(a,1,4);
     a[1]='s';
     ```

     上述`sChar`变量的值是字符串`"ello"`。字符串对象创建后，即使在后面修改了a数组中的第二个元素的值，对`sChar`的值也没有任何影响。

- 字符数组参数创建

  ```java
  char[] helloArray = { 'r', 'u', 'n', 'o', 'o', 'b'};
  String helloString = new String(helloArray);  //创建字符串  
  System.out.println( helloString ); 
  ```

> **注意:**String 类是不可改变的，所以你一旦创建了 String 对象，那它的值就无法改变了,如果需要对字符串做很多修改，那么应该选择使用 [StringBuffer & StringBuilder 类](https://www.runoob.com/java/java-stringbuffer.html)。

# String转换为int

`String`字符串转整型`int`有以下两种方式：

- `Integer.paeseInt(str)`
- `Integer.valueOf(str).intValue()`

> 注意：`Integer`是一个类，是`int`基本数据类型的封装类。

```java
public static void main(String[] args){
    String str="123";
    int n = 0;
    //第一种转换方法：Integer。parseInt(str)
    n = Integer.parseInt(str);
    System.out.println("Integer.parseInt(str) : " + n); // Integer.parseInt(str) : 123
    //第二种转换方法：Integer.valueOf(str).intValue()
    n = 0;
    n = Integer.valueOf(str).intValue();
    System.out.println("Integer.parseInt(str) : " + n); // Integer.parseInt(str) : 123
}
```

> 注意：`String`转换`int`时，`String`的值一定是证书，否则会报数字转换异常(`java.lang.NumberFormatException`)。

 ## int转换为String

整形`int`转`String`字符串类型有以下三种方法：

- `String s = String.valueOf(i);`
- `String s = Integer,.toString(i);`
- `String s = "" + i;`

```java
public static void main (String[] args){
    int num = 0;
    //第一种方法：String.valueof(i)
    num = 10;
    String str1 = String.valueOf(num);
    System.out.println("String.valueOf(i) : " + str1); // String.valueOf(i) : 10
    //第二种方法: Integer.toString(i)
    String str2 = Integer.toString(num);
    System.out.println("Integer.toString(i) : " + str2); // Integer.toString(i) : 10
    //第三种方法：""+i
    String str3 = ""+num;
    System.out.println(str3); //10
}
```

> 注：使用第三种方法相对第一第二中耗时比较大。在使用第一种`valueOf()`方法时，**注意`valueOf()`括号中的值不能为空**，否则会报空指针异常(`NullPointerException`)。

## `valueOf()`、`parse()`和`toString()`

1. `valueOf()`

   `valueOf()`方法将数据的内部格式转换为可读的形式。它是一种静态方法，对所有Java内置的类型，在字符串内被重载，以便每一种类型都被转换为字符串。`valueOf()`方法还被类型`Object`重载，所以创建的任何形式类的对象也可被用作一个参数，这是它的几种形式：

   ```java
   static String valueOf(double num)
   static String valueOf(long num)
   static String valueOf(Object ob)
   static String valueOf(char chars[])
   ```

   与前面讨论的一样，调用`valueOf()`方法可以得到其他类型数据的字符串形式。对各种数据类型，可以直接调用这种方法得到合理的字符串形式。所有的简单类型数据转换成相应于它们的普通字符串形式。任何传递给`valueOf()`方法的对象都将返回对象的` toString()`方法调用的结果。事实上，也可以通过直接调用 `toString()`方法而得到相同的结果。

   对于大多数数组，`valueOf()`方法返回一个简单晦涩的字符串，这说明它是一个某种类型的数组。然而对于字符数组，它创建一个包含了字符数组中的字符的字符串对象。`valueOf()`方法有一种特定形式允许指定字符数组的一个子集。它具有如下的一般形式：

   ```java
   static String valueOf(char chars[],int startIndex, int numChars)
   ```

   这里`chars`是存放字符的数组，`startIndex`是字符数组中期望得到的子字符串的首字符下标，`numChars`指定子字符串的长度。

2. `parse()`

   `parseXxx(String)`这种形式，是指把字符串转换为`Xxx`类型值，其中`Xxx`对应不同的数据类型，如`int`型和`float`型。

3. `toString()`

   `toString()`可以把一个引用类型转换为`String`字符串类型。

# 字符串拼接

`String`字符串是不可变字符串，但可以进行拼接，会产生一个新的对象。

1. `String`类提供了连接两个字符串的方法：`string1.concat(string2);`返回 string2 连接 string1 的新字符串。也可以对字符串常量使用 concat() 方法，如：`"我的名字是".concat("hugh");`

2. 使用`+`操作符来连接字符串：`"Hello, " + "hugh" + "!";`

   但是在循环中，直接使用`+`进行字符串拼接每次循环都会创建新的字符串对象，然后丢掉旧的字符串，这样绝大部分字符串都是临时对象，不但浪费内存还会影响 GC 效率。

   标准库中的`StringBuilder`，是一个可变对象，可以预分配缓冲区，这样在其中新增字符时，就不会创建新的临时对象。

   ```java
   StringBuilder sb = new StringBuilder(1024);
   for (int i = 0; i < 1000; i++){
       sb.append(',');
       sn.append(i);
   }
   String s = sb.toString();
   ```

   `StringBuilder`还可以进行链式操作：

   ```java
   public class Main{
       public static void main(String[] args){
           var sb = new StringBuilder(1024);
           sb.append("Mr ")
               .append("Bob")
               .append("!")
               .insert(0, "Hellp, ");
           System.out.println(sb.toString());
       }
   }
   ```

   查看`StringBuilder`的源码，可以发现：进行链式操作的关键是，定义的`append()`方法会返回`this`，这样，就可以不断调用自身的其他方法。`StringBuilder`可以支持链式操作，实现链式操作的关键是返回实例本身。

   仿照`StringBuilder`，可以设计支持链式操作的类。例如，一个可以不断增加的计数器：

   ```java
   public class Main{
       public static void main(String[] args){
           Adder adder = new Adder();
           adder.add(3)
               .add(5)
               .inc()
               .add(10);
           System.out.println(adder.value());
       }
   }
   class Adder{
       private int sum = 0;
       public Adder add(int n){
           sum += n;
           return this;
       }
       public Adder inc(){
           sum++;
           return this;
       }
       public Adder value(){
           return sum;
       }
   }
   ```

   > 对于普通的字符串`+`操作，不需要将其改写为`StringBuilder`，因为Java编译器在编译时就会自动地把多个连续的`+`操作编码为`StringConcatFactory`的操作。在运行期间，`StringConcatFactory`会将字符串连接操作优化为数组复制或者`StringBuilder`操作。

   

   3. 用`StringJoiner`来处理用分隔符拼接数组的需求。

      ```java
      public class Main{
          public static void main(String[] args){
              String[] names = {"Bob","Alice","Grace"};
              var sj = new StringJoiner(", ", "Hello ", "!"); //(间隔，起始，结束)
              for (String name:name){
                  sj.add(name);
              }
              System.out.println(sj.toString());
          }
      }
      ```

      查看`StringJoiner`的源码可以发现：`StringJoiner`内部实际上就是使用了`StringBuilder`，所以拼接效率和`StringBuilder`几乎一模一样。

      > `String`还提供了一个静态方法`join()`，这个方法在内部使用了`StringJoiner`来拼接字符串，在不需要指定"开头"和"结尾"的时候，用`String.join()`更方便

      ```java
      String[] names = {"Bob", "Alice", "Grace"};
      var s = String.join(", ", names);
      ```

      

# 字符串长度

<font color=red>用于获取有关对象的信息的方法称为访问器方法。</font>`String`类的一个访问器方法是`length()`方法，它返回字符串对象包含的字符数。语法形式如下：

```java
StringName.length();
```

# 字符串大小写转换

`String`类的`toLowerCase()`方法可以将字符串中的所有字符全部转换为小写，而非字母的字符不受影响。语法格式如下：

```java
StringName.toLowerCase(); //将字符串中的字母全部转换为小写，非字母不受影响
```

`String`类的`toUpperCase()`则将字符串的所有字符全部转换成大写，而非字母的字符不受影响。语法格式如下：

```java
StringName.toUpperCase(); //将字符串中的字母全部转换为大写，非字母不受影响。
```

# 去除字符串中首尾空格

`trim()`方法的语法形式如下：

```java
StringName.trim();
```

> 注意：`trim()`只能去掉字符串前后的半角空格（英文空格），而无法去掉全角空格（中文空格）。可以用以下代码将全角空格替换为半角空格再进行操作，其中替换是`String`类的`replace()`方法。可在字符串的替换详细了解。

```java
Str = str.replace((char) 12288,' '); //将中文空格替换为英文空格
str = str.trim();
```

其中，12288是中文全角空格的`unicode`编码。

# 提取子字符串（substring()）

在`String`中提供了两个截取字符串的方法，一个是从指定位置截取到字符串结尾，另一个是截取指定范围的内容。

1. `substring(int beginIndex)`形式

   此方法用于提取从索引位置开始至结尾处的字符串部分。调用时，括号中是需要提取字符串的开始位置，方法返回值是提取的字符串。

2. `substring(int beginIndex, int endIndex)`形式

   此方法中的`beginIndex`表示截取的起始索引，截取的字符串中包括起始索引对应的字符，`endIndex`表示结束索引，截取的字符串中不包括结束索引对应的字符。如果不指定`endIndex`，则表示截取到目标字符串末尾。

# 分割字符串

`String`类的`split()`方法可以按指定的分隔符对目标字符串进行分割，分割后的内容存放在字符串数组中。该方法主要有以下两种重载形式：

```java
str.split(String sign)
str.split(String sign,int limit)
```

其中它们的含义如下：

- `str`为需要分割的目标字符串。
- `sign`为指定的分割符，可以是任意字符串。
- `limit`表示分割后生成的字符串的限制个数，如果不指定，则表示不限制，知道将整个目标字符串完全分割为止。

**使用分割符注意事项：**

1. "."和"|"都是转义字符，必须得加"\\"。
   - 如果用"."作为分隔的话，必须写成`String.split("\\.")`，这样才能正确的分隔开，不能用`String.split(".")`。
   - 如果用"|"作为分隔的话，必须写成`String.split("\\|")`，不能用`Strinng.split("|")`。
2. 如果在一个字符串中有多个分隔符，可以使用"|"作为连字符，比如："acount=? and uu=? or n=?"，把三个都分隔出来，可以使用`String.split("and|or")`。

```java
public static void main(String[] args){
    String Colors ="Red,Black,White,Yellow,Bule";
    String[] arr1 = Color.split(",");//不限制元素个数
    String[] arrw = Color.split(",",3);//限制元素个数为3
    System.out.println("所有颜色为： ");
    for (int i = 0; i < arr1.length; i++){
        System.ouut.println(arr1[i]);
    }
    System.out.println("前三个颜色为： ");
    for (int j = 0; j < arr2.length; j++){
        System.out.println(arr2[j]);
    }
}
/* 输出结果
所有颜色为：
Red
Black
White
Yellow Blue
前三个颜色为：
Red
Black
White,Yellow,Blue
*/
```

从输出的结果可以看出，当指定分割字符串后组成的数组长度（大于或等于 1）时，数组的前几个元素为字符串分割后的前几个字符，而最后一个元素为字符串的剩余部分。

# 字符串的替换

## `replace()`方法

用于将目标字符串中的指定字符(串)替换成新的字符(串)。

```java
stringName.replace(String oldChar, String newChar);
```

## `replaceFirst()`方法

`replaceFirst()`方法用于将目标字符串中匹配某正则表达式的第一个子字符串替换成新的字符串。

```java
string.replaceFirst(String regex, String replacement);
```

## `replaceAll()`方法 

`replaceAll()`方法用于将目标字符串中匹配某正则表达式的所有子字符串替换成新的字符串。

```java
String.replaceAll(String regex, String replacement);
```

# 字符串比较

## `equals()`方法

<font color=red>`equals()`方法将逐个地比较两个字符串地每个字符是否相同。</font>字符的大小写，也在检查的范围之内。

```java
str1.equals(str2);
```

`str1`和`str2`可以是字符串变量， 也可以是字符串字面量。 例如， 下列表达式是合法的：

```java
"Hello".equals(greeting)
```

## `equalsIgnoreCase()`方法

语法和`equals()`方法完全相同，不区分大小写。

## `equals()`与`==`的比较

`equals()`比较两个字符串对象中的字符，而`==`运算符比较两个对象引用看他们是否引用相同的实例。

## `compareTo()`方法

`compareTo()`方法用于按字典顺序比较两个字符串的大小，该比较是基于各个字符的`Unicode`值。语法如下：

```java
str.compareTo(String otherStr)
```

他会按字典顺序将`str`表示的字符序列与`otherStr`参数表示的字符序列进行比较。如果按字典顺序`str`位于`otherStr`参数之前，比较结果为一个负整数；如果位于`otherStr`之后，比较结果返回一个正整数；如果两个字符串相等，则返回0。

# 字符串查找

字符串查找分为两种形式：一种是在字符串中获取匹配字符（串）的索引值，另一种是在字符串中获取指定索引位置的字符。

## 根据字符查找

1. `indexOf()`方法

   `indexOf()`方法用于返回字符（串）在指定字符串中首次出现的索引位置，如果能找到，则返回索引值，否则返回`-1`。该方法有两种主要重载形式。

   ```java
   str.indexOf(value);
   str.indexOf(value, int fromIndex)
   ```

   - `str`：表示指定字符串
   - `value`：表示待查找的字符（串）
   - `formIndex`：表示查找时的起始索引，如不指定则从字符串开始位置查找

2. `lastIndexOf()`方法

   `lastIndexOf()`方法用于返回字符（串）在指定字符串中最后一次出现的索引位置，如果能找到则返回索引值，否则返回 -1。该方法也有两个重载方法：

   ```java
   str.lastIndexOf(value)
   str.lastIndexOf(value, int formIndex)
   ```

   > <font color=red>注意：`lastIndexOf()`方法的查找策略时从右往左查找，如果不指定起始索引，则默认从字符串末尾开始查。</font>

## 根据索引查找

`String`类的`charAt()`方法可以在字符串内根据指定的索引查找字符。语法格式如下：

```java
stringName.charAt(index)
```

# StringBuffer类

在Java中，除了通过`String`类创建和处理字符串之外，还可以使用`StringBuffer`类来处理字符串。`StringBuffer`类可以比`String`类更高效地处理字符串。

<font Color=red>`StringBuffer`类是可变字符串，`StringBuffer`类的对象可以随意修改字符串的内容。每个`StringBuffer`类的对象都能够存储指定容量的字符串。如果字符串的长度超过了`StringBuffer`类对象的容量，则该对象的容量会自动扩大。</font>

##  创建`StringBuffer`类

`StringBuffer`类提供了 3 个构造方法来创建一个字符串，如下所示：

- `StringBuffer()`构造一个空的字符串缓冲区，并且初始化为16个字符的容量。
- `StringBuffer(int length)`创建一个空的字符串缓冲区，并且初始化为指定长度`length`的容量。
- `StringBuffer(String str)`创建一个字符串缓冲区，并将其内容初始化为指定的字符串内容`str`，字符串缓冲区的初始容量为16个字符加上字符串`str`的长度。

`str.capacity()`用于查看`StringBuffer`类的容量。

## 追加字符串

`StringBuffer`类的`append()`方法用于向原有`StringBuffer`对象中追加字符串。语法如下：

```java
stringBufferObject.append(String str);
```

该方法将`str`追加到当前`stringBuffer`对象的末尾，类似于字符串的连接。

## 替换字符

`StringBuffer`类的`setCharAt()`方法用于在字符串的指定索引位置替换一个字符。语法如下：

```java
stringBufferObject.setCharAt(int index, char ch);
```

该方法的作用是修改对象中索引值为`index`位置的字符为新的字符`ch`。

## 反转字符串

`StringBuffer`类中的`reverse()`方法用于将字符串序列用其反转的形式取代。语法格式如下：

```java
stringBufferObject.reverse()
```

## 删除字符串

1. `deleteCharAt()`方法

   `deleteCharAt()`方法用于移除序列中指定位置的字符。语法如下：

   ```java
   stringBufferObject.deleteCharAt(int index)
   ```

   `deleteCharAt()`方法的作用是删除指定位置的字符，然后将剩余的内容形成一个新的字符串。

2. `delete()`方法

   `delete()`方法用于移除序列中字符串的字符，语法如下：

   ```java
   stringBufferObject.delete(int start,int end);
   ```

# String、StringBuffer、StringBuilder类的区别

在Java中字符串属于对象，Java提供了`String`类来创建和操作字符串。`String`类是不可变类，即一旦一个`String`对象被创建以后，包含在这个对象中的字符序列是不可改变的，直至这个对象被销毁。

Java 提供了两个可变字符串类`StringBuffer`和`StringBuilder`，中文翻译为“字符串缓冲区”。

`StringBuilder`类是 JDK 1.5 新增的类，它也代表可变字符串对象。实际上，`StringBuilder`和 `StringBuffer`功能基本相似，方法也差不多。不同的是，`StringBuffer`是线程安全的，而 `StringBuilder`则没有实现线程安全功能，所以性能略高。因此在通常情况下，如果需要创建一个内容可变的字符串对象，则应该优先考虑使用`StringBuilder`类。

`StringBuffer`、`StringBuilder`、`String`中都实现了`CharSequence`接口。`CharSequence`是一个定义字符串操作的接口，它只包括`length()`、`charAt(int index)`、`subSequence(int start, int end) `这几个 API。

`StringBuffer`、`StringBuilder`、`String`对`CharSequence`接口的实现过程不一样，如下图 1 所示：

![图1](https://s1.ax1x.com/2020/06/15/Np59oj.png)

可见，`String`直接实现了`CharSequence`接口，`StringBuilder`和`StringBuffer`都是可变的字符序列，它们都继承于`AbstractStringBuilder`，实现了`CharSequence`接口。

##  总结

`String`是 Java 中基础且重要的类，被声明为`final class`，是不可变字符串。因为它的不可变性，所以拼接字符串时候会产生很多无用的中间对象，如果频繁的进行这样的操作对性能有所影响。

`StringBuffer`就是为了解决大量拼接字符串时产生很多中间对象问题而提供的一个类。它提供了 `append`和`add`方法，可以将字符串添加到已有序列的末尾或指定位置，它的本质是一个线程安全的可修改的字符序列。在很多情况下我们的字符串拼接操作不需要线程安全，所以 `StringBuilder`登场了。`StringBuilder`是 JDK1.5 发布的，它和`StringBuffer`本质上没什么区别，就是去掉了保证线程安全的那部分，减少了开销。

**使用环境：**

操作少量的数据使用`String`。
单线程操作大量数据使用`StringBuilder`。
多线程操作大量数据使用`StringBuffer`。

# 格式化字符串

输出格式化数字可以使用`printf()`和`format()`方法。`String`类使用静态方法`format()`返回一个`String`对象而不是`PrintStream`对象。`String`类的静态方法`format()`能用来创建可复用的格式化字符串，而不仅仅是用于一次打印输出。

```java
System.out.printf("浮点型变量的值为 " + "%f, 整型变量的值为 " + " %d, 字符串变量的值为 " + "is %s", floatVar, intVar, stringVar);
```

也可以写成：

```java
String fs;
fs = String.format"浮点型变量的值为 " + "%f, 整型变量的值为 " + " %d, 字符串变量的值为 " + "is %s", floatVar, intVar, stringVar);
```
