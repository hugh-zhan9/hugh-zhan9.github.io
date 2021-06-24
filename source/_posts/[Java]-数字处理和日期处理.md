---
title: 数字处理和日期处理
tags: Java
categories: Java
date: 2020-06-18 20:15:28



---



在解决实际问题时，对数字和日期的处理是非常普遍的，如数学问题、随机数问题和日期问题等。为了解决这些问题，Java 提供了处理相关问题的类，包括 Math 类、Random 类、BigInteger 类、Date 类等

<!--more-->

# `Math`类

Java 中的` +、-、*、/ `和` % `等基本算术运算符不能进行更复杂的数学运算，例如，三角函数、对数运算、指数运算等。于是 Java 提供了`Math`工具类来完成这些复杂的运算。

在 Java 中`Math`类封装了常用的数学运算，提供了基本的数学操作，如指数、对数、平方根和三角函数等。`Math`类位于`java.lang`包，它的构造方法是`private`的，因此无法创建`Math` 类的对象，并且`Math`类中的所有方法都是类方法，可以直接通过类名来调用它们。

## 静态常量

`Math`类中包含`E`和`PI`两个静态常量，分别表示`e`（自然对数）和`π`（圆周率）。

```java
System.out.println("E 常量的值：" + Math.E);
System.out.println("PI 常量的值：" + Math.PI);
//运行结果
E 常量的值：2.718281828459045
PI 常量的值：3.141592653589793
```

## 方法

1. 求最大值、最小值和绝对值

   | 方法                                    | 说明                   |
   | --------------------------------------- | ---------------------- |
   | `static int/long/float/double abs(a)`   | 返回`a`的绝对值        |
   | `statci int/double/long/float max(x,y)` | 返回`x`和`y`中的最大值 |
   | `statci int/double/long/float min(x,y)` | 返回`x`和`y`中的最小值 |

   ------

   ```java
   public class Test2{
       public static void main(String[] args){
           System.out.println("10 和 20 的较大值：" + Math.max(10, 20));
           System.out.println("15.6 和 15 的较小值：" + Math.min(15.6, 15));
           System.out.println("-12 的绝对值：" + Math.abs(-12));
       }
   }
   ```

2. 求整运算

   | 方法                            | 说明                                                         |
   | ------------------------------- | ------------------------------------------------------------ |
   | `static double ceil(double a)`  | 返回大于或等于`a`的最小整数                                  |
   | `static double float(double a)` | 返回小于或等于`a`的最小整数                                  |
   | `static double rint(double a)`  | 返回最接近`a`的整数值，<font color=red>如果有两个同样接近的整数，则结果取偶数</font> |
   | `static int round(float a)`     | 将参数加上`1/2`后返回与参数最接近的整数                      |
   | `static long round(double a)`   | 将参数加上`1/2`后返回与参数最接近的整数，如何强制转换为长整型 |

   ------

   ```java
   import java.util.Scanner;
   public class Test03 {
       public static void main(String[] args) {
           Scanner input = new Scanner(System.in);
           System.outprintln("请输入一个数字：");
           double num = input.nextDouble();
           System.out.println("大于或等于 "+ num +" 的最小整数：" + Math.ceil(num));
           System.out.println("小于或等于 "+ num +" 的最大整数：" + Math.floor(num));
           System.out.println("将 "+ num +" 加上 0.5 之后最接近的整数：" + Math.round(num));
           System.out.println("最接近 "+num+" 的整数：" + Math.rint(num));
       }
   }
   ```

3. 三角函数运算

   | 方法                                     | 说明                                                         |
   | ---------------------------------------- | ------------------------------------------------------------ |
   | `static double sin(double a)`            | 返回角的三角正弦值，参数以弧度为单位                         |
   | `static double cos(double a)`            | 返回角的三角余弦值，参数以弧度为单位                         |
   | `static double asin(double a)`           | 返回一个值的反余弦值，参数域在`[-1,1]`，值域在`[-PI/2,PI/2]` |
   | `static double acos(double a)`           | 返回一个值的反余弦值，参数域在`[-1,1]`，值域在`[0,PI]`       |
   | `static double tan(double a)`            | 返回角的三角正切值，参数以弧度为单位                         |
   | `static double atan(double a)`           | 返回一个值的反正切值，值域在`[-PI/2,PI/2]`                   |
   | `static double toDegrees(double angrad)` | 将用弧度表示的角转换为近似相等的用角度表示的角               |
   | `static double toRadians(double angdeg)` | 将用角度表示的角转换为近似相等的用弧度表示的角               |

   ------

   ```java
   public class Test4{
       public static void main(String[] args){
           System.out.println{"90 度的正弦值：" + Math.sin(Math.PI/2));
           System.out.println("0 度的余弦值：" + Math.cos(0));
           System.out.println("1 的反正切值：" + Math.atan(l));
           System.out.println("120 度的弧度值：" + Math.toRadians(120.0));
       }
   }
   ```

4. 指数运算

   指数运算包括求方根、取对数及其求m次方的运算。

   | 方法                                    | 说明                               |
   | --------------------------------------- | ---------------------------------- |
   | `static double exp(double a)`           | 返回`e`的`a`次幂                   |
   | `static double pow(double a, double b)` | 返回以`a`为底数，以`b`为指数的幂值 |
   | `static double sqrt(double a)`          | 返回`a`的平方根                    |
   | `static double cbrt(double a)`          | 返回`a`的立方根                    |
   | `static double log(double a)`           | 返回`a`的自然对数，即`lna`的值     |
   | `static double log10(double a)`         | 返回以`10`为底的对数               |

   ------

   ```JAVA
   public Test5{
       public static void main(String[] args){
           System.out.println("4 的立方值：" + Math.pow(4,3));
           System.out.println("16 的平方根：" + Math.sqrt(16));
           System.out.println("10 为底 2 的对数：" + Math.log1O(2));
       }
   }
   ```

# 生成随机数

要生成一个指定范围之内的随机数字有两种方法：一种是调用`Math`类的 `random()`方法，一种是使用`Random`类。

`Random`类提供了丰富的随机数生成方法，可以产生`boolean`、`int`、`long`、`float`、`byte 数组`以及`double`类型的随机数，这是它与`random()`方法最大的不同之处。`random()` 方法只能产生`double`类型的 0~1 的随机数。

`Random`类位于`java.util`包中，该类常用的有如下两个构造方法。

- `Random()`：该构造方法使用一个和当前系统时间对应的数字作为种子数，然后使用这个种子数构造`Random`对象。
- `Random(long seed)`：使用单个`long`类型的参数创建一个新的随机数生成器。

`Random`类提供的所有方法生成的随机数字都是均匀分布的，也就是说区间内部的数字生成的概率是均等的。

| 方法                      | 说明                                                         |
| ------------------------- | ------------------------------------------------------------ |
| `boolean nextBoolean()`   | 生成一个随机的`boolean`值                                    |
| `double nextDouble()`     | 生成一个随机的`double`值，值介于`[0,1.0)`，含0而不含`1.0`    |
| `int nextInt()`           | 生成一个随机的`int`值，该值介于`int`的值区间，也就是`-2^31~2^31-1` |
| `int nextInt(int n)`      | 生成一个随机的`int`值，该值介于`[0,n)`                       |
| `void setSeed(long seed)` | 重新设置`Random`对象中的种子数。设置完种子数以后的`Random`对象和相同种子数使用`new`关键字创建出的`Random`对象相同。 |
| `long nextLong()`         | 返回一个随机长整型数字                                       |
| `boolean nextBoolean()`   | 返回一个随机布尔型值                                         |
| `float nextFloat()`       | 返回一个随机浮点型数字                                       |
| `double nextDouble()`     | 返回一个随机双精度值                                         |

------

```java
import java.util.Random;
public class Test6 {
    public static void main(String[] args) {
        Random r = new Random();
        double d1 = r.nextDouble(); // 生成[0,1.0]区间的小数
        double d2 = r.nextDouble() * 7; // 生成[0,7.0]区间的小数
        int i1 = r.nextInt(10); // 生成[0,10]区间的整数
        int i2 = r.nextInt(18) - 3; // 生成[-3,15]区间的整数
        long l1 = r.nextLong(); // 生成一个随机长整型值
        boolean b1 = r.nextBoolean(); // 生成一个随机布尔型值
        float f1 = r.nextFloat(); // 生成一个随机浮点型值
        System.out.println("生成的[0,1.0]区间的小数是：" + d1);
        System.out.println("生成的[0,7.0]区间的小数是：" + d2);
        System.out.println("生成的[0,10]区间的整数是：" + i1);
        System.out.println("生成的[-3,15]区间的整数是：" + i2);
        System.out.println("生成一个随机长整型值：" + l1);
        System.out.println("生成一个随机布尔型值：" + b1);
        System.out.println("生成一个随机浮点型值：" + f1);
        System.out.print("下期七星彩开奖号码预测：");
        for (int i = 1; i < 8; i++) {
            int num = r.nextInt(9); // 生成[0,9]区间的整数
            System.out.print(num);
        }
    }
}
```

------

`Math`类的`random()`方法没有参数，它默认会返回**大于等于**`0.0`、**小于**`1.0`的 `double`类型随机数，**即`0<=随机数<1.0`**。对`random()`方法返回的数字稍加处理，即可实现产生任意范围随机数的功能。

# 数字格式化

数字的格式在解决实际问题时使用非常普遍，这时可以使用`DecimalFormat`类对结果进行格式化处理。例如，将小数位统一成 2 位，不足 2 位的以 0 补齐。

`DecimalFormat`是`NumberFormat`的一个子类，用于格式化十进制数字。`DecimalFormat`类包含一个模式和一组符号。

| 符号 | 说明                                                         |
| ---- | ------------------------------------------------------------ |
| 0    | 显示数字，如果位数不够则补0                                  |
| #    | 显示数字，如果位数不够不发生变化                             |
| .    | 小数分隔符                                                   |
| -    | 减号                                                         |
| ，   | 组分隔符                                                     |
| E    | 分隔科学计数法中的尾数和小数                                 |
| %    | 前缀或后缀，乘以 100 后作为百分比显示                        |
| ？   | 乘以 1000 后作为千进制货币符显示，用货币符号代替。如果双写，用国际货币符号代替；<br/>如果出现在一个模式中，用货币十进制分隔符代替十进制分隔符 |

------

```java
import java.text.DecimalFormat;
import java.util.Scanner;
public class Test08 {
    public static void main(String[] args) {
        // 实例化DecimalFormat类的对象，并指定格式
        DecimalFormat df1 = new DecimalFormat("0.0");
        DecimalFormat df2 = new DecimalFormat("#.#");
        DecimalFormat df3 = new DecimalFormat("000.000");
        DecimalFormat df4 = new DecimalFormat("###.###");
        Scanner scan = new Scanner(System.in);
        System.out.print("请输入一个float类型的数字：");
        float f = scan.nextFloat();
        // 对输入的数字应用格式，并输出结果
        System.out.println("0.0 格式：" + df1.format(f));
        System.out.println("#.# 格式：" + df2.format(f));
        System.out.println("000.000 格式：" + df3.format(f));
        System.out.println("###.### 格式：" + df4.format(f));
    }
}
//执行结果示例
请输入一个float类型的数字：5487.45697
0.0 格式：5487.5
#.# 格式：5487.5
000.000 格式：5487.457
###.### 格式：5487.457
```

# 大数字运算

在 Java 中提供了用于大数字运算的类，即`java.math.BigInteger`类和 `java.math.BigDecimal`类。这两个类用于高精度计算，**其中`BigInteger`类是针对整型大数字的处理类，而`BigDecimal`类是针对大小数的处理类。**

## `BigInteger`类

如果要存储比`Integer`更大的数字，`Integer`数据类型就无能为力了。因此，Java 中提供`BigInteger`类来处理更大的数字。`BigInteger`类型的数字范围较 `Integer`类型的数字范围要大得多。`BigInteger`支持任意精度的整数，也就是说在运算中`BigInteger`类型可以准确地表示任何大小的整数值。

对`BigInteger`做运算的时候，只能使用实例方法。

和`long`型整数运算比，`BigInteger`不会有范围限制，但缺点是速度比较慢。也可以把`BigInteger`转换成`long`型：

```java
BigInteger i = new BigInteger("1234567890");
System.out.println(i.longValue());
System.out.println(i.multiply(i).longValueExact());// java.lang.ArithmeticException: BigInteger out of long range
```

使用`longValueExact()`方法时，如果超出了`long`型的范围，会抛出<font color=red>`ArithmeticException`</font>。

`BigInteger`和`Integer`、`Long`一样，也是不可变类，并且也继承自`Number`类。因为`Number`定义了转换为基本类型的几个方法：

- 转换为`byte`：`byteValue()`
- 转换为`short`：`shortValue()`
- 转换为`int`：`intValue()`
- 转换为`long`：`longValue()`
- 转换为`float`：`floatValue()`
- 转换为`double`：`doubleValue()`

因此，通过上述方法，可以把`BigInteger`转换成基本类型。如果`BigInteger`表示的范围超过了基本类型的范围，转换时将丢失高位信息，即结果不一定是准确的。如果需要准确地转换成基本类型，可以使用`intValueExact()`、`longValueExact()`等方法，在转换时如果超出范围，将直接抛出`ArithmeticException`异常。

------

除了基本的加、减、乘、除操作之外，`BigInteger`类还封装了很多操作，像求绝对值、相反数、最大公约数以及判断是否为质数等。

要使用`BigInteger`类，首先要创建一个`BigInteger`对象。`BigInteger`类提供了很多种构造方法，其中最直接的一种是参数以字符串形式代表要处理的数字。这个方法语法格式如下：

```java
BigInteger(String val) //val：是数字十进制的字符串
//将数字5转换为BigInteger对象
BigInteger bi = new BigIntrger("5");    
```

创建`BigInteger`对象之后，便可以调用`BigInteger`类提供的方法进行各种数学运算操作：

| 方法名称                             | 说明                                                         |
| ------------------------------------ | ------------------------------------------------------------ |
| `add(BigInteger val)`                | 做加法运算                                                   |
| `subtract(BigInteger val)`           | 做减法运算                                                   |
| `multiply(BigInteger val)`           | 做乘法运算                                                   |
| `divide(BigInteger val)`             | 做除法运算                                                   |
| `remainder(BigInteger val)`          | 做取余数运算                                                 |
| `divideAndRemainder(BigInteger val)` | 做除法运算，返回数组的第一个值为商，第二个值为余数           |
| `pow(int exponent)`                  | 做参数的`exponent`次方运算                                   |
| `negate()`                           | 取相反数                                                     |
| `shiftLeft(int n)`                   | 将数字左移`n`位，如果`n`为负数，则做右移操作                 |
| `shiftRight(int n)`                  | 将数字右移`n`位，如果`n`位负数，则做左移操作                 |
| `and(BigInteger val)`                | 做与运算                                                     |
| `or(BigInteger val)`                 | 做或运算                                                     |
| `compareTo(BigInteger val)`          | 做数字的比较运算                                             |
| `equals(Object obj)`                 | 当参数`obj`是`BigInteger`类型的数字并且数值相等时返回`true`，其他返回`false` |
| `min(BigInteger val)`                | 返回较小的数值                                               |
| `max(BigInteger val)`                | 返回较大的数值                                               |

------

```java
import java.math.BigInteger;
import java.util.Scanner;
public class Test09 {
    public static void main(String[] args) {
        Scanner input = new Scanner(System.in);
        System.out.println("请输入一个整型数字：");
        // 保存用户输入的数字
        int num = input.nextInt();
        // 使用输入的数字创建BigInteger对象
        BigInteger bi = new BigInteger(num + "");
        // 计算大数字加上99的结果
        System.out.println("加法操作结果：" + bi.add(new BigInteger("99")));
        // 计算大数字减去25的结果
        System.out.println("减法操作结果：" + bi.subtract(new BigInteger("25")));
        // 计算大数字乘以3的结果
        System.out.println("乘法橾作结果：" + bi.multiply(new BigInteger("3")));
        // 计算大数字除以2的结果
        System.out.println("除法操作结果：" + bi.divide(new BigInteger("2")));
        // 计算大数字除以3的商
        System.out.println("取商操作结果：" + bi.divideAndRemainder(new BigInteger("3"))[0]);
        // 计算大数字除以3的余数
        System.out.println("取余操作结果：" + bi.divideAndRemainder(new BigInteger("3"))[1]);
        // 计算大数字的2次方
        System.out.println("取 2 次方操作结果：" + bi.pow(2));
        // 计算大数字的相反数
        System.out.println("取相反数操作结果：" + bi.negate());
    }
}
```

上述代码将用户输入的整型数字保存到 num 变量中，由于 BigInteger 类的构造方法只接收字符串类型的参数，所以使用“new BigInteger(num+"")”代码来创建 BigInteger 对象。

## `BigDecimal`类

`BigInteger`和`BigDecimal`都能实现大数字的运算，不同的是`BigDecimal`加入了小数的概念。一般的`float`和`double`类型数据只能用来做科学计算或工程计算，但由于在商业计算中要求数字精度比较高，所以要用到`BigDecimal`类。`BigDecimal`类支持任何精度的浮点数，可以用来精确计算货币值。

`BigDecimal`常用的构造方法如下。

- `BigDecimal(double val)`：实例化时将双精度型转换为`BigDecimal`类型。
- `BigDecimal(String val)`：实例化时将字符串形式转换为`BigDecimal`类型。

------

`BigDecimal`用`scale()`表示小数位数，例如：

```java
BigDecimal d1 = new BigDecimal("123.45");
BigDecimal d2 = new BigDecimal("1234500");
System.out.println(d1.scale()); // 2,两位小数
System.out.println(d2.scale()); // 0
```

通过`BigDecimal`的`stripTrailingZeros()`方法，可以将一个`BigDecimal`格式化为一个相等的，但去掉了末尾0的`BigDecimal`：

```java
BigDecimal d1 = new BigDecimal("123.4500");
BigDecimal d2 = d1.stripTrailingZeros();
System.out.println(d1.scale()); // 4
System.out.println(d2.scale()); // 2,因为去掉了00

BigDecimal d3 = new BigDecimal("1234500");
BigDecimal d4 = d3.stripTrailingZeros();
System.out.println(d3.scale()); // 0
System.out.println(d4.scale()); // -2  表示这个数是个整数，并且末尾有2个0。
```

`BigDecimal`类的方法可以用来做超大浮点数的运算，像加、减、乘和除等。在所有运算中，除法运算是最复杂的，因为在除不尽的情况下，末位小数的处理方式是需要考虑的。

```java
BigDecimal add(BigDecimal augend); //加法操作
BigDecimal subtract(BigDecimal subtrahend); //减法操作
BigDecimal multiply(BigDecimal multiplieand); //乘法操作
BigDecimal divide(BigDecimal divisor); //除法操作，存在除不尽的情况  报错：ArithmeticException
BigDecimal divide(BigDecimal divisor,int scale,int roundingMode); //除法运算 （参数分别表示：除数，商的小数点后的位数和近似值处理模式）
```

**在比较两个`BigDecimal`的值是否相等时，要特别注意，使用`equals()`方法不但要求两个`BigDecimal`的值相等，还要求它们的`scale()`相等。必须使用`compareTo()`方法来比较，它根据两个值的大小分别返回负数、正数和`0`，分别表示小于、大于和等于。**

`roundingMode`参数支持的处理模式：

| 模式名称                   | 说明                                                         |
| -------------------------- | ------------------------------------------------------------ |
| BigDecimal.ROUND_UP        | 上的最后一位如果大于0，则向前进位，正负都如此                |
| BigDecimal.ROUND_DOWM      | 商的最后一位无论是什么数字都能省略                           |
| BigDecimal.ROUND_CEILING   | 商如果是正数，按照`ROUND_UP`模式处理；如果是负数，按照`ROUND_DOWN`模式处理 |
| BigDecimal.ROUND_FLOOR     | 与`ROUND_CELING`模式相反，商如果是正数，按照`ROUND_DOWN`模式处理；如果是负数，按照`ROUND_UP`模式处理 |
| BigDecimal.ROUND_HALF_DOWN | 对商进行五舍六入操作。如果商最后一位小于等于5，则做舍弃操作，否则对最后一位进行进位操作 |
| BigDecimal.ROUND_HALF_UP   | 对商进行四舍五入操作。如果商最后一位小于5，则做舍弃操作，否则对最后一位进行进位操作 |
| BigDecimal.ROUND_HALF_EVEN | 如果商的倒数第二位是奇数，则按照`ROUND_HALF_UP`处理；如果是偶数，则按照`ROUND_HALF_DOWN`处理 |

------

```java
import java.math.BigDecimal;
import java.util.Scanner;
public class Test10 {
    public static void main(String[] args) {
        Scanner input = new Scanner(System.in);
        System.out.println("请输入一个数字：");
        // 保存用户输入的数字
        double num = input.nextDouble();
        // 使用输入的数字创建BigDecimal对象
        BigDecimal bd = new BigDecimal(num);
        // 计算大数字加上99.154的结果
        System.out.println("加法操作结果：" + bd.add(new BigDecimal(99.154)));
        // 计算大数字减去-25.157904的结果
        System.out.println("减法操作结果：" + bd.subtract(new BigDecimal(-25.157904)));
        // 计算大数字乘以3.5的结果
        System.out.println("乘法操作结果：" + bd.multiply(new BigDecimal(3.5)));
        // 计算大数字除以3.14的结果，并保留小数后2位
        System.out.println("除法操作结果(保留 2 位小数)：" + bd.divide(new BigDecimal(3.14), 2, BigDecimal.ROUND_CEILING));
        // 计算大数字除以3.14的结果，并保留小数后5位
        System.out.println("除法操作结果(保留 5 位小数)：" + bd.divide(new BigDecimal(3.14), 5, BigDecimal.ROUND_CEILING));
    }
}
```

# 时间日期的处理

在 Java 中获取当前时间，可以使用`java.util.Date`类和`java.util.Calendar`类完成。其中，`Date`类主要封装了系统的日期和时间的信息，`Calendar`类则会根据系统的日历来解释`Date`对象。

## `Date`类

`Date`类表示系统特定的时间戳，可以精确到毫秒。`Date`对象表示时间的默认顺序是星期、月、日、小时、分、秒、年。

1. 构造方法

   `Date`类有如下两个构造方法

   - `Date()`：此种形式表示分配`Date`对象并初始化此对象，以表示分配它的时间（精确到毫秒），使用该构造方法创建的对象可以获取本地的当前时间。
   - `Date(long date)`：此种形式表示从`GMT`时间（格林尼治时间）1970 年 1 月 1 日 0 时 0 分 0 秒开始经过参数 `date`指定的毫秒数。

   ```java
   Date date1 = new Date();    // 调用无参数构造函数
   System.out.println(date1.toString());    // 输出：Thu Jun 18 15:57:06 CST 2020
   Date date2 = new Date(60000);    // 调用含有一个long类型参数的构造函数
   System.out.println(date2);    // 输出：Thu Jan 01 08:01:00 CST 1970
   ```

   `Date`类的无参数构造方法获取的是系统当前的时间，显示的顺序为星期、月、日、小时、分、秒、年。

   `Date`类带`long`类型参数的构造方法获取的是距离`GMT`指定毫秒数的时间，60000 毫秒是一分钟，而`GMT`（格林尼治标准时间）与`CST`（中央标准时间）相差 8 小时，也就是说 1970 年 1 月 1 日 00:00:00 `GMT`与 1970 年 1 月 1 日 08:00:00 `CST` 表示的是同一时间。 因此距离 1970 年 1 月 1 日 00:00:00 `CST` 一分钟的时间为 1970 年 1 月 1 日 00:01:00 `CST`，即使用`Date`对象表示为 Thu Jan 01 08:01:00 CST 1970。

2. 常用方法

   | 方法                              | 描述                                                         |
   | --------------------------------- | ------------------------------------------------------------ |
   | `boolean after(Date when)`        | 判断此日期是否在指定日期之后                                 |
   | `boolean before(Date when)`       | 判断此日期是否在指定日期之前                                 |
   | `int compareTo(Date anotherDate)` | 比较两个日期的顺序                                           |
   | `boolean equals(Object obj)`      | 比较两个日期的相等性                                         |
   | `long getTime()`                  | 返回自1970年1月1日 00:00:00 GMT以来，此`Date`对象表示的毫秒数 |
   | `String toString()`               | 把此`Date`对象转换为以下形式的String：`dow mon dd hh:mm:ss zzz yyy`。其中`dow`是一周中的某一天 |

## `calendar`类

`Calendar`类是一个抽象类，它为特定瞬间与`YEAR`、`MONTH`、`DAY_OF--MONTH`、`HOUR`等日历字段之间的转换提供了一些方法，并为操作日历字段提供了一些方法。创建`Calendar`对象不能使用`new`关键字，因为`Calendar`类是一个抽象类，但是它提供了一个`getInsatance()`方法来获得`Calendar`类的对象。`getInstance()`方法返回一个`Calendar`对象，其日历字段已由当前日期和时间初始化。

```java
Calendar c = Calendar.getInstance();
```

`Calendar`类的常用方法：

| 方法                                                         | 描述                                                         |
| ------------------------------------------------------------ | ------------------------------------------------------------ |
| `void add(int field, int amount)`                            | 根据日历的规则，为给定的日历字段`field`添加或减去指定的时间量`amount` |
| `boolean after(Object when))`                                | 判断此`Calendar`表示的时间是否在指定时间`when`之后，并返回判断结果 |
| `boolean before(Object when)`                                | 判断此`Calendar`表示的时间是否在指定时间`when`之后，并返回判断结果 |
| `void clear()`                                               | 清空`Calendar`中的日期时间                                   |
| `int compareTo(Calendar anotherCalendar)`                    | 比较两个`Calendar`对象表示的时间值（从格林威治时间 1970 年 01 月 01 日 00 时 00 分 00 秒至现在的毫秒偏移量），大则返回 1，小则返回 -1，相等返回 0 |
| `int get(int field)`                                         | 返回指定日历字段的值                                         |
| `int getActualMaximum(int field)`                            | 返回指定日历可能拥有的最大值                                 |
| `int getActualMinimum(int field)`                            | 返回指定日历可能拥有的最小值                                 |
| `int getFirstDayOfWeek()`                                    | 获取一星期的第一天。根据不同的国家地区，返回不同的值         |
| `static Calendar getInstance()`                              | 使用默认时区和语言环境获得一个日历                           |
| `static Calendar getInstance(TimeZone zone)`                 | 使用指定时区和默认语言环境获得一个日历                       |
| `static Calendar getInstance(TimeZone zone,Local aLocale)`   | 使用指定时区和语言环境获得一个日历                           |
| `Date getTime()`                                             | 返回一个表示此`Calendar`时间值（从格林威治时间 1970 年 01 月 01 日 00 时 00 分 00 秒至现在的毫秒偏移量）的`Date`对象 |
| `long getTimeInMillis()`                                     | 返回`Calendar`的时间值，以毫秒为单位                         |
| `void set(int field, int value)`                             | 为指定的日历字段设置给定值                                   |
| `void set(int year,int mouth, int date)`                     | 使用日历字段`YEAR`、`MONTH`、`DAY_OF_MONTH HOUR`的值         |
| `void set(int year,int mouth, int date,int hourOfDay, int minute,int second)` | 设置字段`YEAR`、`MONTH`、`DAY_OF_MONTH HOUR`、 `MINUTE` `SECOND`的值 |
| `void setFirstDayOfWeek(int value)`                          | 设置一星期的第一天是哪一天                                   |
| `void setTimeInMillis(long millis)`                          | 用给定的`long`值设置此`Calendar`的当前时间值                 |

<font color=red>`Calendar`对象可以调用`set()`方法将日历翻到任何一个时间，当参数`year`取负数时表示公元前。`Calendar`对象调用`get()`方法可以获取有关年、月、日等时间信息</font>，参数`field`的有效值由`Calendar`静态常量指定。

`Calendar`类中定义了许多常量。分别表示不同的意义

- `Calendar.YEAR`：年份。
- `Calendar.Month`：月份。
- `Calendar.DATE`：日期
- `Calendar.DAY_OF_MONTH`：日期，和上面的字段意义完全相同
- `Calendar.HOUR`：12小时制的小时
- `Calendar.HOUR_OF_DAY`：24小时制的小时
- `Calendar.MINUTE`：分钟
- `Calendar.SECOND`：秒
- `Calendar.DAY_OF_WEEK`：星期几

```java
int mouth = Calendar.getInstance().get(Calendar.MONTH); //如果整型变量 month 的值是 0，表示当前日历是在 1 月份；如果值是 11，则表示当前日历在 12 月份。
```

------

使用`Calendar`类处理日期时间：

```java
Calendar calendar = Calendar.getInstance(); // 如果不设置时间，则默认为当前时间
calendar.setTime(new Date()); // 将系统当前时间赋值给 Calendar 对象
System.out.println("现在时刻：" + calendar.getTime()); // 获取当前时间
int year = calendar.get(Calendar.YEAR); // 获取当前年份
System.out.println("现在是" + year + "年");
int month = calendar.get(Calendar.MONTH) + 1; // 获取当前月份（月份从 0 开始，所以加 1）
System.out.print(month + "月");
int day = calendar.get(Calendar.DATE); // 获取日
System.out.print(day + "日");
int week = calendar.get(Calendar.DAY_OF_WEEK) - 1; // 获取今天星期几（以星期日为第一天）
System.out.print("星期" + week);
int hour = calendar.get(Calendar.HOUR_OF_DAY); // 获取当前小时数（24 小时制）
System.out.print(hour + "时");
int minute = calendar.get(Calendar.MINUTE); // 获取当前分钟
System.out.print(minute + "分");
int second = calendar.get(Calendar.SECOND); // 获取当前秒数
System.out.print(second + "秒");
int millisecond = calendar.get(Calendar.MILLISECOND); // 获取毫秒数
System.out.print(millisecond + "毫秒");
int dayOfMonth = calendar.get(Calendar.DAY_OF_MONTH); // 获取今天是本月第几天
System.out.println("今天是本月的第 " + dayOfMonth + " 天");
int dayOfWeekInMonth = calendar.get(Calendar.DAY_OF_WEEK_IN_MONTH); // 获取今天是本月第几周
System.out.println("今天是本月第 " + dayOfWeekInMonth + " 周");
int many = calendar.get(Calendar.DAY_OF_YEAR); // 获取今天是今年第几天
System.out.println("今天是今年第 " + many + " 天");
Calendar c = Calendar.getInstance();
c.set(2012, 8, 8); // 设置年月日，时分秒将默认采用当前值
System.out.println("设置日期为 2012-8-8 后的时间：" + c.getTime()); // 输出时间
```

使用`Calendar`类来实现日历的打印功能：

```java
import java.util.Calendar;
public class CalendarDemo {
    public static void main(String[] args) {
        Calendar calendar = Calendar.getInstance();
        calendar.set(2016, 5, 1); // 实际的calendar对象所表示的日期为2016年6月1日
        // 判断2016年6月1日为一周中的第几天
        int index = calendar.get(Calendar.DAY_OF_WEEK) - 1;
        char[] title = { '日', '一', '二', '三', '四', '五', '六' }; // 存放曰历的头部
        int daysArray[][] = new int[6][7];// 存放日历的数据
        int daysInMonth = 31; // 该月的天数
        int day = 1; // 自动增长
        for (int i = index; i < 7; i++) {
            // 填充第一周的日期数据，即日历中的第一行
            daysArray[0][i] = day++;
        }
        for (int i = 1; i < 6; i++) {
            // 填充其他周的日历数据，控制行
            for (int j = 0; j < 7; j++) {
                // 如果当前day表示的是本月最后一天，则停止向数组中继续赋值
                if (day > daysInMonth) {
                    i = 6;
                    break;
                }
                daysArray[i][j] = day++;
            }
        }
        System.out.println("------------------2016 年 6 月--------------------\n");
        for (int i = 0; i < title.length; i++) {
            System.out.print(title[i] + "\t");
        }
        System.out.print("\n");
        // 输出二元数组daysArray中的元素
        for (int i = 0; i < 6; i++) {
            for (int j = 0; j < 7; j++) {
                if (daysArray[i][j] == 0) {
                    if (i != 0) {
                        // 如果到月末，则完成显示日历的任务，停止该方法的执行
                        return;
                    }
                    System.out.print("\t");
                    continue;
                }
                System.out.print(daysArray[i][j] + "\t");
            }
            System.out.print("\n");
        }
    }
}
```

该程序看似复杂其实很简单。因为`Calendar`类所表示的时间月份是`set()`方法中表示月份的参数值 +1，因此`Calendar`类的实际时间为 2016 年 6 月 1 日。在下面的代码中分别获取 6 月 1 日为本周中的第几天，以便在相应的星期下开始输出 6 月份的日历。程序中的`daysArray`是一个二元数组，该二元数组控制了日历的格式输出，第一个子数组控制日历的行，第二个子数组控制曰历的列，即可输出二元数组中的每一个元素。



# 日期格式化

格式化日期表示将日期/时间格式转换为预先定义的日期/时间格式。例如将日期“Fri May 18 15:46:24 CST2016” 格式转换为 “2016-5-18 15:46:24 星期五”的格式。在 Java 中，可以使用`DateFormat`类和`SimpleDateFormat`类来格式化日期，下面详细介绍这两个格式化日期类的使用。

## `DateFormat`类

**`DateFormat`是日期/时间格式化子类的抽象类，它以与语言无关的方式格式化并解析日期或时间。**日期/时间格式化子类（如`SimpleDateFormat`）允许进行格式化（也就是日期→文本）、解析（文本→日期）和标准化日期。

在创建`DateFormate`对象时不能使用`new`关键字，而应该使用`DateFormat`类中的静态方法`getDateInstance()`：

```java
DateFormat df = DateFormat.getDateInstance();
```

`DateFormat`类中的常用方法：

| 方法                                                         | 描述                                                         |
| ------------------------------------------------------------ | ------------------------------------------------------------ |
| `String format(Date date)`                                   | 将`Date`格式化日期/时间字符串                                |
| `Calendar getCalendar()`                                     | 获取与此日期/时间格式相关联的日历                            |
| `static DateFormat getDateInstance()`                        | 获取具有默认格式化风格和默认语言环境的日期格式               |
| `static DateFormat getDateInstance(intr style)`              | 获取具有指定格式化风格和默认语言环境的日期格式               |
| `static DateFormat getDateInstance(int style,Locale locale)` | 获取具有指定格式化风格和指定语言环境的日期格式               |
| `stattic DateFormate getDateTimeInstance()`                  | 获取具有默认格式风格和默认语言环境的日期/时间格式            |
| `static DateFormate getDateTimeInstance(int dateStyle,int timeStyle)` | 获取具有指定日期/时间格式化风格和默认语言环境的日期/时间格式 |
| `static DateFormate getDateTimeInstance(int dateStyle,int timeStyle, Locale locale)` | 获取具有指定日期/时间格式化风格和指定语言环境的日期/时间格式 |
| `static DateFormate getTimeInstance()`                       | 获取具有默认格式化风格和默认语言环境的时间格式               |
| `static DateFormate getTimeInstance(int style)`              | 获取具有指定格式化风格和默认语言环境的时间格式               |
| `static DateFormate getTimeInstance(int style, Locale locale)` | 获取具有指定格式化风格和指定语言环境的时间格式               |
| `void setCalendar(Calendar newCalendar)`                     | 为此格式设置日历                                             |
| `Date parse(String source)`                                  | 将给定的字符串解析成日期/时间                                |

格式化样式主要通过`DateFormat`常量设置。将不同的常量传入到方法中，以控制结果的长度。`DateFormat`常量如下：

- `SHORT`：完全为数字
- `MEDIUM`：较长
- `LONG`：更长
- `FULL`：是完全显示

------

```java
// 获取不同格式化风格和中国环境的日期
DateFormat df1 = DateFormat.getDateInstance(DateFormat.SHORT, Locale.CHINA);
DateFormat df2 = DateFormat.getDateInstance(DateFormat.FULL, Locale.CHINA);
DateFormat df3 = DateFormat.getDateInstance(DateFormat.MEDIUM, Locale.CHINA);
DateFormat df4 = DateFormat.getDateInstance(DateFormat.LONG, Locale.CHINA);
// 获取不同格式化风格和中国环境的时间
DateFormat df5 = DateFormat.getTimeInstance(DateFormat.SHORT, Locale.CHINA);
DateFormat df6 = DateFormat.getTimeInstance(DateFormat.FULL, Locale.CHINA);
DateFormat df7 = DateFormat.getTimeInstance(DateFormat.MEDIUM, Locale.CHINA);
DateFormat df8 = DateFormat.getTimeInstance(DateFormat.LONG, Locale.CHINA);
// 将不同格式化风格的日期格式化为日期字符串
String date1 = df1.format(new Date());
String date2 = df2.format(new Date());
String date3 = df3.format(new Date());
String date4 = df4.format(new Date());
// 将不同格式化风格的时间格式化为时间字符串
String time1 = df5.format(new Date());
String time2 = df6.format(new Date());
String time3 = df7.format(new Date());
String time4 = df8.format(new Date());
// 输出日期
System.out.println("SHORT：" + date1 + " " + time1);
System.out.println("FULL：" + date2 + " " + time2);
System.out.println("MEDIUM：" + date3 + " " + time3);
System.out.println("LONG：" + date4 + " " + time4);
//输出结果
SHORT：18-10-15 上午9:30
FULL：2018年10月15日 星期一 上午09时30分43秒 CST
MEDIUM：2018-10-15 9:30:43
LONG：2018年10月15日 上午09时30分43秒
```

## `SimpleDateFormat`类

如果使用`DateFormat`类格式化日期/时间并不能满足要求，那么就需要使用`DateFormat`类的子类——`SimpleDateFormat`。

**`SimpleDateFormat`是一个以与语言环境有关的方式来格式化和解析日期的具体类，它允许进行格式化（日期→文本）、解析（文本→日期）和规范化。**`SimpleDateFormat`使得可以选择任何用户定义的日期/时间格式的模式。

`SimpleDateFormate`类主要有如下三种构造方式：

- `SimpleDateFormat()`：用默认的格式和默认的语言环境构造`SimpleDateFormat`。
- `SimoleDateFormat(String pattern)`：用指定的格式和默认的语言环境构造`SimpleDateFormat`。
- `SimpleDateFormat(String pattern, Locale locale)`：用指定的格式和语言环境构造`SimpleDateFormat`。

`SimpleDateFormat`自定义格式中常用的字母及含义：

| 字母 | 含义                                                         | 示例                                                         |
| ---- | ------------------------------------------------------------ | ------------------------------------------------------------ |
| y    | 年份。一般用 yy 表示两位年份， yyyy 表示 4 位年份            | 使用 yy 表示的年份，如 11；<br />使用 yyyy 表示的年份，如 2011 |
| M    | 月份。一般用 MM 表示月份，如果使用 MMM ，则会根据语言环境显示不同语言的月份 | 使用 MM 表示的月份，如 05；<br/>使用 MMM 表示月份，在 Locale.CHINA语言环境下，如 十月；<br />在 Locale.US<br/语言环境下，如 Oct |
| d    | 月份中的天数。一般用 dd 表示天数                             | 使用 dd 表示的天数，如 10                                    |
| D    | 年份中的天数。表示当天是当年的第几天，用 D 表示              | 使用 D 表示的年份中的天数，如 295                            |
| E    | 星期几。用 E 表示，会根据语言环境的不同，显示不同语言的星期几 | 使用 E 表示星期几，<br />在 Locale.CHINA 语言环境下，如“星期四”；<br />在 Locale.US 语言环境下，如 Thu |
| H    | 一天中的小时数（0~23）。一般使用 HH 表示小时数               | 使用 HH 表示的小时数，如 18                                  |
| h    | 一天中的小时数（1~12）。一般使用 hh 表示小时数               | 使用 hh 表示的小时数，如 10                                  |
| m    | 分钟数。一般使用 mm 表示分钟数                               | 使用 mm 表示的分钟数，如 29                                  |
| s    | 秒数。一般使用 ss 表示秒数                                   | 使用 ss 表示的秒数，如 38                                    |
| S    | 毫秒数。一般使用 SSS 表示毫秒数                              | 使用 SSS 表示的毫秒数，如 156                                |

------

使用 SimpleDateFormat 类格式化当前日期并打印，日期格式为“xxxx 年 xx 月 xx 日星期 xxx 点 xx 分 xx 秒”：

```java
import java.text.SimpleDateFormat;
import java.util.Date;
public class Test13 {
    public static void main(String[] args) {
        Date now = new Date(); // 创建一个Date对象，获取当前时间
        // 指定格式化格式
        SimpleDateFormat f = new SimpleDateFormat("今天是 " + "yyyy 年 MM 月 dd 日 E HH 点 mm 分 ss 秒");
        System.out.println(f.format(now)); // 将当前时间袼式化为指定的格式
    }
}
```











