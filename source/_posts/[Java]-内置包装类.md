---
title: 内置包装类
tags: Java
categories: Java
date: 2020-06-16 21:50:29




---

Java是一种面向对象的编程语言，Java中的类把方法与数据类型连接在一起，构成了自包含式的处理单元。但在Java中不能定义基本类型对象，为了能将基本类型视为对象处理，并能连接相关方法。Java为每个基本类型都提供了包装类。

<!--more-->



# 包装类、装箱和拆箱

虽然 Java 可以直接处理基本类型，但是在有些情况下需要将其作为对象来处理，这时就需要将其转换为包装类。

那么如何把一个基本类型视为对象(引用类型)？比如我们想要把`int`基本类型变成一个引用类型，可以定义一个`Integer`类，它只包含一个实例字段`int`，这样`Integer`类就可以视为`int`的**包装类(Wrapper Class):**

```java
public class Integer{
    private int value;
    public Integer(int value){
        this.value = value;
    }
    public int intValue(){
        return this.value;
    }
}
//定义了好了`Integer`类就可以把`int`和`Integer`互相转换：
Integer n = null;
Integer n2 = new Integer(99);
int n3 = n2.intValue();
int i = 100;
Integer n = Integer.valueOf(i);
```

Java核心库为每种基本类型都提供了对应的包装类型`java.lang.类名`，可以直接使用。

包装类和基本数据类型的关系如下表所示：

| 基本数据类型 | 包装类    |
| ------------ | --------- |
| byte         | Byte      |
| short        | Short     |
| int          | Integer   |
| long         | Long      |
| char         | Character |
| float        | Float     |
| double       | Double    |
| boolean      | Boolean   |

## 装箱和拆箱

基本数据类型转换为包装类的过程称为装箱，例如把`int`包装成`Integer`类的对象；**包装类变为基本数据类型的过程称为拆箱，例如把`Integer`类的对象简化成`int`。**

手动实例化一个包装类称为手动拆箱装箱。Java 1.5 版本之前必须手动拆箱装箱，之后可以自动拆箱装箱，也就是在进行基本数据类型和对应的包装类转换时，系统将自动进行装箱及拆箱操作，不用在进行手工操作，为开发者提供了更多的方便。例如：

```java
public class Test{
    public static void main(String[] args){
        int num1 = 100;
        Integer obj1 = num1; //自动装箱 编译器自动使用Integer.valueOf(int) 
        int num2 = obj1; //自动拆箱 编译器自动使用Integer.intValue()
        Integer obj2 = 100;
        System.out.println("obj1等价于obj2返回结果为： "+ obj1.equals(obj2)); //obj1等价于obj2返回结果为： true
    }
}
```

## 包装类的应用

1. 实现`int`和`Integer`的相互转换

   可以通过`Integer`类的构造方法将`int`装箱，通过`Integer`类的`intValue`将`Integer`拆箱。

   ```java
   public class test{
       public static void main(String[] args){
           int num = 500;
           Integer obj = new Integer(num); //手动装箱
           int num1 = obj.intValue(); //手动拆箱
       }
   }
   ```

2. 将字符串转换为数值类型

   - `Integer`类

     ```java
     Integer.parseInt(string)
     ```

   - `Float`类

     ```java
     Float.parseFloat(string)
     ```

3. 将整数转换位字符串

   `Integer`类有一个静态的`toString()`方法，可以将整数转换为字符串。

## 不变类

所有的包装类型都是不变类，查看`Integer`的源码，核心代码如下：

```java
public final class Integer{
    private final int value;
}
```

因此一旦创建了`Integer`对象，该对象就是不变的。对两个`Integer`实例比较因为`Integer`是引用类型所以使用`equals()`。

```java
public class Main{
    public static void main(String[] args){
        Integer x = 127;
        Integer y = 127;
        Integer m = 99999;
        Integer n = 99999;
        System.out.println("x == y: " + (x==y));
        System.out.println("m == n: " + (m==n));
        System.out.println("x.equals(y): " + x.equals(y));
        System.out.println("m.equals(n): " + m.equals(n));
    }
}
```

可以发现，`==`比较，较小的两个相同的`Integer`返回`true`，较大的两个相同的`Integer`返回`false`，这是因为`Integer`是不变类，编译器把`Integer x = 127;`自动变为`Integer x = Integer.valueOf(127);`，为了节省内存，`Integer.valueOf()`对于较小的数，始终返回相同的实例，因此，`==`比较“恰好”为`true`，但我们**绝不能**因为Java标准库的`Integer`内部有缓存优化就用`==`比较，必须用`equals()`方法比较两个`Integer`。

因为`Integer.valueOf()`可能始终返回同一个`Integer`实例，因此，在我们自己创建`Integer`的时候，以下两种方法：

- 方法1：`Integer n = new Integer(100);`
- 方法2：`Integer n = Integer.valueOf(100);`

方法2更好，因为方法1总是创建新的`Integer`实例，方法2把内部优化留给`Integer`的实现者去做，即使在当前版本没有优化，也有可能在下一个版本进行优化。

我们把能创建“新”对象的静态方法称为静态工厂方法。`Integer.valueOf()`就是静态工厂方法，它尽可能地返回缓存的实例以节省内存。[静态工厂方法](http://hugh-zhan9.xyz/2020/06/19/Static-Method/)



>  创建新对象时，优先选用静态工厂方法而不是new操作符。

如果我们考察`Byte.valueOf()`方法的源码，可以看到，标准库返回的`Byte`实例全部是缓存实例，但调用者并不关心静态工厂方法以何种方式创建新实例还是直接返回缓存的实例。

# `Object`类

`Object`是Java类库中的一个特殊类，也是所有类的父类。也就是说：Java允许把任何类型的对象赋值给`Object`类型的变量。

| 方法             | 说明                                                         |
| ---------------- | ------------------------------------------------------------ |
| `clone()`        | 创建与该对象的类相同的新对象。                               |
| `equals(object)` | 比较两对象是否相等。                                         |
| `finalize()`     | 当垃圾回收器确定不存在对该对象的更多引用时，对象垃圾回收器调用该方法。 |
| `getClass()`     | 返回一个对象运行时的实例类。                                 |
| `hashCode()`     | 返回该对象的散列码值。                                       |
| `notify()`       | 激活等待在该对象的监视器上的一个线程。                       |
| `notiflyAll()`   | 激活等待在该对象的监视器上的全部线程。                       |
| `toString()`     | 返回该对象的字符串表示。                                     |
| `wait()`         | 在其他线程调用此对象的`notify()`方法或`notifyAll()`方法前，导致当前线程等待。 |

## `toString()`方法

`toString()`方法返回该对象的字符串，当程序输出一个对象或者把某个对象和字符串进行连接运算时，系统会自动调用该对象的`toString()`方法返回该对象的字符串表示。Object 类的 `toString()`方法返回“运行时类名@十六进制哈希码”格式的字符串，但很多类都重写了 Object 类的`toString()`方法，用于返回可以表述该对象信息的字符串。

> 哈希码(`hashCode`)，每个Java对象都用哈希码属性，哈希码可以用来标识对象，以提高对象在集合操作中的执行效率。

## `equals()`方法

`==`运算符是比较两个引用变量是否指向同一个实例，`equals()`方法是比较两个对象的内容是否相等，通常字符串的比较只是关心内容是否相等。

```java
result = obj1.equals(obj2);
```

## `getClass()`方法

`getClass()`方法返回对象所属的类，是一个`Class`对象。通过`Class`对象可以获取该类的各种信息，包括类名、父类以及它所实现的接口名称。

- `getName()`：获取名称
- `getSuperclass()`：获取父类
- `getInterfaces()`：获取实现的接口

## 接受任意引用类型的对象

既然`Object`类是所有对象的父类，则所有的对象都可以向`Object`进行转换，在这其中也包含了数组和接口类型，即一切的引用数据类型都可以使用`Object`进行接收。

虽然接口不能继承一个类，但是依然是`Object` 类的子类，因为接口本身是引用数据类型，所以可以进行向上转型操作。同理，也可以使用 `Object`接收一个数组，因为数组本身也是引用数据类型。

# `Integer`类

 `Integer`类在对象中包装了一个基本类型`int`的值，`Integer`类对象包含一个`int`类型的字段。此外，该类提供了多个方法，能在`int`类型和`String`类型之间互相转换，还提供了处理`int`类型时的一些常量和方法。

## `Integer`类的构造方法

`Integer`类中的构造方法有以下两个：

- `Integer(int)`：构造一个新分配的`Integer`对象，它表示指定的`int`值。
- `Integer(string)`：构造一个新分配的`Integer`对象，它表示`String`参数所指示的`int`值。

```Java
Integer integer1 = new Integer(100); //以int型变量作为参数创建Integer对象
Integer integer2 = new Integer("100"); //以String型变量作为参数创建Integer对象
```

## `Integer`类的常用方法

| 方法                        | 返回值  | 功能                                                         |
| --------------------------- | ------- | ------------------------------------------------------------ |
| `byteValue()`               | byte    | 以`byte`类型返回该`Integer`的值                              |
| `shortValue()`              | short   | 以`short`类型返回该`Integer`的值                             |
| `intValue()`                | int     | 以`int`类型返回该`Integer`的值                               |
| `toString()`                | String  | 返回一个表示该`Integer`值的`String`对象                      |
| `equals(Object)`            | boolean | 比较此对象与指定对象是否相等                                 |
| `compareTo(anotherInteger)` | int     | 在数字上比较两个`Integer` 对象，如相等，则返回 0；<br/>如调用对象的数值小于 `anotherlnteger`的数值，则返回负值；<br/>如调用对象的数值大于 `anotherlnteger`的数值，则返回正值 |
| `valueOf(string)`           | Integer | 返回保存指定的`String`值的`Integer`对象                      |
| `parseInt(string)`          | int     | 将数字字符串转换为`int`数值                                  |



## `Integer`类的常量

`Integer`类包含以下4个常量：

- `MAX_VALUE`：值为`2^31-1`的常量，它表示 int 类型能够表示的最大值。
- `MIN_VALUE`：值为`-2^31的常量，它表示 int 类型能够表示的最小值。
- `SIZE`：用二进制补码形式表示`int`值的比特位数。
- `TYPE`：表示基本类型`int`的`Class`实例。

```java
 int num = Integer.MAX_VALUE;
```



# `Float`类

`Float`类中的构造方法有以下3个：

- `Float(double value)`：构造一个新分配的`Float`对象，它表示转换为`float`类型的参数。
- `Float(float value)`：构造一个新分配的`Float`对象，它表示基本的`float`参数。
- `Float(String s)`：构造一个新分配的`Float`对象，它表示`String`参数所指示的`float`值。

在`Float`类内部包含了一些和`float`操作有关的方法：

| 方法                   | 返回值  | 功能                                                         |
| ---------------------- | ------- | ------------------------------------------------------------ |
| `byteValue()`          | byte    | 以`byte`类型返回该`Float`的值。                              |
| `doubleValue()`        | double  | 以`double`类型返回该`Float`的值。                            |
| `floatValue()`         | float   | 以`float`类型返回该`Float`的值。                             |
| `intValue()`           | int     | 以`int`类型返回该`Float`的值（强制转换为`int`类型）。        |
| `longValue()`          | long    | 以`long`类型返回该`Float`的值（强制转换为`long`类型）。      |
| `shortValue()`         | short   | 以`short`类型返回该`Float`的值（强制转换为`short`类型）。    |
| `isNaN()`              | boolean | 如果此`Float`值是一个非数字值，则返回`true`，否则返回`false`。 |
| `isNaN(float v)`       | boolean | 如果指定的参数是一个非数字值，则返回`true`，否则返回`false`。 |
| `toString()`           | String  | 返回一个表示该`Float`值的`String`对象。                      |
| `valueOf(string s)`    | Float   | 返回保存指定的`String`值的`Float`对象。                      |
| `parseFloat(String s)` | float   | 将数字字符串转换为`float`数值。                              |

## `Float`类的常用常量

在`Float`类中包含了许多常量，其中较为常用的常量如下：

- `MAX_VALUE`：值为`1.4E38`的常量，它表示`float`类型能够表示的最大值。
- `MIN_VALUE`：值为`3.4E-45`的常量，它表示`float`类型能够表示的最小值。
- `MAX_EXPONENT`：有限`float`变量可能具有的最大指数。
- `MIN_EXPONENT`：有限`float`变量可能具有的最小指数。
- `MIN_NORMAL`：保存`float`类型数值的最小标准值的常量，即`2^-126`。
- `NaN`：保存`float`类型的非数字值的常量。
- `SIZE`：用来以二进制补码形式表示`float`值的比特位数。
- `TYPE`：表示基本类型`float`的`Class`实例。

下面的代码演示了`Float`类中常量的使用：

```java
float max_value = Float.MAX_VALUE; //获取float类型可取的最大值
float min_value = Float.MIN_VALUE; //获取float类型可取的最小值
float min_normal = Float.MIN_NORMAL; //获取float类型可取的最小标准值
float.size = Float.SIZE; //获取float类型的二进制位
```

# `Double`类

`Double`类在对象中包装了一个基本类型`double`的值。`Double`类对象包含一个`double`类型的字段。此外，该类还提供了多个方法可以将`double`类型与`String`类型相互转换，同时还提供了处理`double`类型时比较常用的常量和方法。

## `double`类中的构造方法

`Double`类中的构造方法有如下两个：

- `Double(double value)`：构造一个新分配的`Double`对象，它表示转换为`double`类型的参数。
- `Double(String s)`：构造一个新分配的`Double`对象，它表示`String`参数所指示的`double`值。

## `double`类的常用方法

| 方法                    | 返回值  | 功能                                                         |
| ----------------------- | ------- | ------------------------------------------------------------ |
| `byteValue()`           | byte    | 以`byte`类型返回该`Double`的值                               |
| `doubleValue()`         | double  | 以`double`类型返回该`Double`的值                             |
| `floatValue()`          | float   | 以`float`类型返回该`Double`的值                              |
| `intValue()`            | int     | 以`int`类型返回该`Double`的值（强制转换为`int`类型）         |
| `longValue()`           | long    | 以`long`类型返回该`Double`的值（强制转换为`long`类型）       |
| `shortValue()`          | short   | 以`short`类型返回该`Double`的值（强制转换为`short`类型）     |
| `isNaN()`               | boolean | 如果此`Double`值是一个非数字值，则返回`true`，否则返回`false` |
| `isNaN(double v)`       | boolean | 如果指定的参数时一个非数字值，则返回`true`，否则返回`false`  |
| `toString()`            | String  | 返回一个表示该`Double`值的`String`对象                       |
| `valueOf(String s)`     | Double  | 返回保存指定的`String`值的`Double`对象                       |
| `parseDouble(String s)` | double  | 将数字字符串转换为`Double`数值                               |

## `Double`类的常用变量

在`Double`类中包含了很多常量，其中较为常用的常量如下：

- `MAX_VALUE`：值为`1.8E308`的常量，它表示`double`类型的最大正有限值的常量。
- `MIN_VALUE`：值为`4.9E-324`的常量，它表示`double`类型的最小正非零值的常量。
- `NaN`：保存`double`类型的非数字值的常量
- `NEGATIVE_INFINITY`：保持`double`类型的负无穷大的常量
- `POSITIVE_INFINITY`：保持`double`类型的正无穷大的常量
- `SIZE`：用来以二进制补码形式表示`double`值的比特位数
- `TYPE`：表示基本类型`double`的`Class`实例

# `Number`类

`Number`是一个抽象类，也是一个超类(即父类)。`Number`类属于`java.lang`包，所有的包装类（如`Double`、`Float`、`Byte`、`Short`、`Integer`以及`Long`）都是抽象类`Number`的子类。

`Number`类定义了一些抽象方法，以各种不同数字格式返回对象的值。如`XxxValue()`方法，它将`Number`对象转换为`Xxx`数据类型的值并返回。这些方法如下所示：

| 方法            | 说明                 |
| --------------- | -------------------- |
| `byteValue()`   | 返回`byte`类型的值   |
| `doubleValue()` | 返回`double`类型的值 |
| `floatValue()`  | 返回`float`类型的值  |
| `intValue()`    | 返回`int`类型的值    |
| `longValue()`   | 返回`long`类型的值   |
| `shortValue()`  | 返回`short`类型的值  |

<font color=red>抽象类不能直接实例化，而是必须实例化其具体的子类。</font>如下代码演示了`Number`类的使用：

```java
Number num = new Double(12.5);
System.out.println("返回double类型的值：" + num.doubleValue()); //返回double类型的值：12.5
System.out.println("返回int类型的值：" + num.intValue()); //返回int类型的值：12
System.out.println("返回float类型的值：" + num.floatValue()); //返回float类型的值：12.5
```

# `Character`类

<font color=red>`Charater`类是字符数据类型`char`的包装类。`Charater`类的对象包含类型为`char`的单个字段，这一能把基本数据类型当对象来处理。</font>常用方法如下：

| 方法                          | 描述                                                         |
| ----------------------------- | ------------------------------------------------------------ |
| `Character(value)`            | 构造一个新分配的`Character`对象，用以表示指定的`char`值。    |
| `charValue()`                 | 返回此`Character`对象的值，此对象表示基本`char`值            |
| `compareTo(anotherCharacter)` | 根据数字比较两个`Character`对象                              |
| `equals(anotherCharacter)`    | 将此对象与指定对象比较，当且仅当参数不是`null`，而是一个与此对象包含相同`char`值的`Character`对象时，结果才是`true` |
| `isDigir(ch)`                 | 确定指定字符是否为数字，如果通过`Character.getType(ch)`提供的字符的常规类型为`DECIMAL_DIGIT_NUMBER`，则字符为数字 |
| `isLetter(codePoint)`         | 确定指定字符（Unicode代码点）是否为字母                      |
| `isLetterOrDigit(codePoint)`  | 确定指定字符（Unicode代码点）是否为字母或数字                |
| `isLowerCase(ch)`             | 确定指定字符是否为小写字母                                   |
| `isUpperCase(ch)`             | 确定指定字符是否为大写字母                                   |
| `toLowerCase(ch)`             | 使用来自`UnicodeData`文件的大小写映射信息将字符参数转化为小写 |
| `toUpperCase(ch)`             | 使用来自`UnicodeData`文件的大小写映射信息将字符参数转化为大写 |

## 实例

1. 可以从`char`值中创建一个`Character`对象

   ```java
   Character character = new Character('S');
   ```

2. <font color=red>`compareTo()`方法将这个字符与其他字符比较，并且返回一个整形数组，这个值是两个字符比较后的标准代码差值。当且仅当两个字符相同时，`equals()`方法的返回值才为`true`。</font>

   ```java
   Character character = new Character('A');
   int result1 = character.compareTo(New Character('V'));
   System.out.println(result1);  //输出： 0
   int result1 = character.compareTo(New Character('B'));
   System.out.println(result2);  //输出： -1
   int result1 = character.compareTo(New Character('1'));
   System.out.println(result3);  //输出： -2
   ```

# `Boolean`类

`Boolean`类将基本类型为`boolean`的值包装在一个对象中。一个`Boolean`类的对象只包含一个类型为`boolean`的字段。

## `Boolean`类的构造方法

```java
Boolean(boolean boolValue); //boolValue必须是true或false（不区分大小写）
Boolean(String boolString); //boolString包含字符串true或false（不区分大小写）
```

## `Boolean`类的常用方法



|           方法           | 返回值  | 功能                                       |
| :----------------------: | :-----: | :----------------------------------------- |
|      `boolValue()`       | boolean | 将`Boolean`对象的值以对应的`boolean`值返回 |
|   `equals(Object obj)`   | boolean | 判断调用该方法的对象与`obj`是否相等。      |
| `parseBoolean(String s)` | boolean | 将字符串参数解析成`boolean`值              |
|       `toString()`       | string  | 返回表示该`boolean`值的`String`对象        |
|   `valueOf(String s)`    | boolean | 返回一个用指定的字符串表示的`boolean`值    |

# `Byte`类

## `Byte`类的构造方法

Byte 类提供了两个构造方法来创建`Byte`对象。

1. `Byte(byte value)`

   通过这种方法创建的`Byte`对象，可以表示指定的`byte`值。

2. `Byte(String s)`

   通过这种方法创建的`Byte`对象，可以表示`String`参数所指的`byte`值。

   ```java
   String my_byte = "5"; 
   Byte b = new Byte(my_byte);
   ```

> <font color=red>注意：必须使用数值型的`String`变量作为参数才能创建成功，否则会抛出`NumberFormatException`异常。</font>

## `Byte`类的常用方法

| 方法                   | 返回值  | 功能                                                         |
| ---------------------- | ------- | ------------------------------------------------------------ |
| `byteValue()`          | byte    | 以一个`byte`值返回此`Byte`的值                               |
| `compareTo(Byte byte)` | int     | 在数字上比较两个`Byte`对象                                   |
| `doubleValue()`        | double  | 以一个`double`值返回此`Byte`的值                             |
| `intValue()`           | int     | 以一个`int`值返回此`Byte`的值                                |
| `parseByte(String s)`  | byte    | 将`String`型参数解析成等价的`byte`形式                       |
| `toString()`           | String  | 返回表示此`byte`值的`String`对象                             |
| `valueOf(string s)`    | Byte    | 返回一个保持指定`String`所给出的值的`Byte`对象               |
| `equals(Object obj)`   | boolean | 将此对象与指定对象比较，如果调用该方法的对象与`obj`相等则返回`true`，否则返回`false`。 |

# `System`类

`System`类位于`java.lang`包，代表当前 Java 程序的运行平台，系统级的很多属性和控制方法都放置在该类的内部。由于该类的构造方法是`private`的，所以无法创建该类的对象，也就是无法实例化该类。

`System`类提供了一些类变量和类方法，允许直接通过 `System`类来调用这些类变量和类方法。

## `System`类的成员变量

`System`类有3个静态成员变量，分别是`PrintStream out`、`InputStream`和`PrintStream err`。

1. `PrintStream out`

   标准输出流。此流已打开并准备接收数据。通常，此流对应于显示器输出或者主机环境或用户指定的另一个输出目标。

   例如：编写一行输出数据的典型方法是：

   ```java
   System.out.println(data);
   ```

   其中，`println`方法是属于流类`PrintStream`的方法，而不是`System`中的方法。

2. `InputStream in`

   标准输入流。此流已打开并准备提供输入数据。通常，此流对应于键盘输入或者由主机环境或用户指定的另一个输入源。

3. `PrintStream err`

   标准的错误输出流。其语法与`System.out`类似，不需要提供参数就输出错误信息。也可以用来输出用户指定的其他信息，包括变量的值。

   ```java
   import java.io.IOException;
   public class Test{
       public static void main(String[] args){
           System.out.println("请输入字符，并按回车结束输入：");
           int c;
           try{
               c = System.in.read();
               while (c != '\r'){
                   System.out.print((char) c);
                   c = System.in.read();
               }
           }catch(IOException e){
               System.out.println(e.toString());
           }finally{
               System.err.println();
           }
       }
   }
   ```

   以上代码中，`System.in.read()`语句读入一个字符，`read()`方法是`InputStream`类拥有的方法。变量`c`必须用`int`类型而不能用`char`类型，否则会丢失精度而导致编译失败。

   以上的程序如果输入汉字将不能正确输出，如果要正常输出汉字，需要把`System.in`声明为`InputStreamReader`类型的实例，最终在`try`语句块中的代码为：

   ```java 
   InputStreamReader in = new InputStreamReader(System.in,"GB2312");
   c = in.read();
   while(c != '\r'){
       System.out.print((char) c);
       c = in.read();
   }
   ```

   如上所述，语句`InputStreamReader in = new InputStreamReader(System.in,"GB2312");`声明一个新对象`in`，它从`Reader`继承而来，此时就可以读入完整的`Unicode`码，显示正常的汉字。

## `System`类的成员方法

System类中提供了一些系统级的操作方法，常用的方法有`arraycopy()`、`currentTimeMillis()`、`exit()`、`gc()`和`getProperty()`。

1. `arraycopy()`方法

   <font color=red>该方法的作用是数组复制，即从指定源数组中复制一个数组，</font>复制从指定的位置开始，到目标数组的指定位置结束。该方法的具体定义如下： 

   ```java
   public static void arraycopy(Object src,int srcPos,Object dest,int destPos,int length)
   ```

   其中`src`表示源数组，`srcPos`表示从原数组中复制的起始位置，`dest`表示目标数组，`destPos`表示要复制到的目标数组的起始位置，`length`表示复制的个数。

   用法示例：

   ```java 
   public class System_arrayCopy{
       public static void main(String[] args){
           char[] srcArray = {'A','B','C','D'};
           char[] destArray = {'E','F','G','H'};
           System.arraycopy(srcArray,1,destArray,1,2);
           System.out.println("源数组：");
           for (int i=0;i<scrArray.length;i++){
               System.out.println(srcArray[i]);
           }
           System.out.println("目标数组：");
           for(int j = 0;j < destArray.length;j++) {
               System.out.println(destArray[j]);
           }
       }
   }
   ```

   如上述代码，将数组`srcArray`中，从下标 1 开始的数据复制到数组`destArray`从下标 1 开始的位置，总共复制两个。也就是将`srcArray[1]`复制给`destArray[1]`，将 `srcArray[2] `复制给`destArray[2]`。这样经过复制之后，数组`srcArray`中的元素不发生变化，而数组`destArray`中的元素将变为 E、B、C、 H。

2. `currentTimeMillis()`方法

   该方法的作用是返回当前的计算机时间，**时间的格式为当前计算机时间与GMT时间（格林尼治时间）1970年1月1日0时0分0秒所差的毫秒数。**一般用它来测试程序的执行时间。

   ```java
   long m = System.currentTimeMillis()；
   ```

   上述语句将获得一个长整型的数字，该数字就是以差值表达的当前时间。

   使用`currentTimeMillis()`方法来显示时间不够直观，但是可以很方便地进行时间计算。例如，计算程序运行需要的时间就可以使用如下的代码：

   ```java
   public class System_currentTimeMillis {
       public static void main(String[] args) {
           long start = System.currentTimeMillis();
           for(int i = 0;i < 100000000;i++) {
               int temp = 0;
           }
           long end = System.currentTimeMillis();
           long time = end - start;
           System.out.println("程序执行时间" + time + "秒");
       }
   }
   ```

3. `exit()`方法

   该方法的作用是终止当前正在运行的 Java 虚拟机，具体的定义格式如下：

   ```java
   public static void exit(int status)
   ```

   其中，`status`的值为0时表示正常退出，非零时表示异常退出。使用该方法可以在图形界面编程中实现程序的退出功能等。

4. `gc()`方法

   该方法的作用是请求系统进行垃圾回收，完成内存中的垃圾清除。至于系统是否立刻回收，取决于系统中垃圾回收算法的实现以及系统执行时的情况。定义如下：

   ```java
   public static void exit(int status)
   ```

5. `getProperty()`方法

   该方法的作用是获得系统中属性名为`key`的属性对应的值，具体的定义如下：

   ```java
   public static Sring getProrerty(String key)
   ```

   系统中常见的属性名以及属性的说明如表 1 所示。

   | 属性名         | 属性说明           |
   | -------------- | ------------------ |
   | `java.version` | Java运行时环境版本 |
   | `java.home`    | Java安装目录       |
   | `os.name`      | 操作系统的名称     |
   | `os.version`   | 操作系统的版本     |
   | `user.name`    | 用户的账户名称     |
   | `user.home`    | 用户的主目录       |
   | `user.dir`     | 用户的当前工作目录 |

   `getProperty()`方法的使用：
   
   ```java
   public class System_getProperty{
       public static void main(String[] args){
           String jversion = System.getProperty("java.version");
           String jversion = System.getProperty("os.name");
           String jversion = System.getProperty("user.name");
           System.out.println("Java运行时环境版本：" + jversion);
           System.out.println("当前操作系统是：" + oName);
           System.out.println("当前用户是：" + user);
       }
   }
   ```
   
   