---
title: Java8 新特性
tags: [Java]
categories: Java
date: 2021-02-16 12:36:00






---



![](https://i.loli.net/2021/02/16/KExynYaTMhQ17Xv.jpg)



<!--more-->

# ⭐Lambda 表达式

Lambda 表达式是一个匿名函数，可以取代大部分的匿名内部类，写出更优雅的 Java 代码，尤其在集合的遍历和其他集合操作中，可以极大地优化代码结构。JDK 也提供了大量的内置函数式接口供我们使用，使得 Lambda 表达式的运用更加方便、高效。

**`Lambda` 允许把函数作为一个方法的参数，即 行为参数化，把函数作为参数传递进方法中。**

## 什么是 Lambda 表达式

lambda表达式实际上对接口方法的实现的一种简写，基本格式为：`(参数) -> {实现}`。例如：

```java
// 原来的匿名内部类
public void test(){
    Comparator<Integer> comp = new Comparator<Integer>(){
        @Override
        public int compare(Integer o1, Integer o2){
            return Integer.compare(o1,o2);
        }
    };
    TreeSet<Integer> ts = new TreeSet<>(comp);
}

// 使用lambda表达式
Comparator<Integer> comp = (x,y) -> Integer.compare(x,y);
```

**lambda表达式的常见格式**

```java
//1.简化参数类型，可以不写参数类型，但是必须所有参数都不写
NoReturnMultiParam lamdba1 = (a, b) -> {
    System.out.println("简化参数类型");
};

//2.简化参数小括号，如果只有一个参数则可以省略参数小括号
NoReturnOneParam lambda2 = a -> {
    System.out.println("简化参数小括号");
};

//3.简化方法体大括号，如果方法体只有一条语句，则可以省略方法体大括号
NoReturnNoParam lambda3 = () -> System.out.println("简化方法体大括号");

//4.如果方法体只有一条语句，并且是 return 语句，则可以省略方法体大括号
ReturnOneParam lambda4 = a -> a+3;
ReturnMultiParam lambda5 = (a, b) -> a+b;
```

**在 Java 8 里面，所有的 Lambda 的类型都是一个接口，而 Lambda 表达式本身，也就是「那段代码」，需要是这个接口的实现。**这是理解 Lambda 的一个关键所在，简而言之就是，**Lambda 表达式本身就是一个接口的实现**。

## 对接口的要求

虽然使用 Lambda 表达式可以对某些接口进行简单的实现，但并不是所有的接口都可以使用 Lambda 表达式来实现。**Lambda 规定接口中只能有一个需要被实现的方法，不是规定接口中只能有一个方法**

> JDK 8 中有另一个新特性：接口的默认方法， 被 default 修饰的方法会有默认实现，不是必须被实现的方法，所以不影响 Lambda 表达式的使用。

`@FunctionalInterface`修饰函数式接口的注解，要求接口中的抽象方法只有一个。 这个注解往往会和 lambda 表达式一起出现。

## Lambda 表达式中的闭包问题

这个问题在匿名内部类中也会存在，如果把注释放开编译会报错，提示 num 值是 final 不能被改变。这里虽然没有标识 num 类型为 final，但是在编译期间虚拟机会自动加上 final 关键字修饰。

```java
import java.util.function.Consumer;

public class Main {
    public static void main(String[] args) {
        int num = 10;
        
        Consumer<String> consumer = ele -> System.out.println(num);
        //num = num + 2;  取消这里的注释会报错
        // 因为num是final修饰的，虽然没有标识出来，但是虚拟机编译时会自动添加
        consumer.accept("hello");
    }
}
```

# 函数式接口

## 什么是函数式接口

**只包含一个抽象方法的接口，称为函数式接口。**可以通过Lambda表达式来创建该接口的对象。（若Lambda表达式抛出一个受检异常，那么该异常需要在目标接口的抽象方法上进行声明）。可以在任意函数式接口上使用`@FunctionalInterface`注解，这样做可以检查它是否是一个函数式接口，同时`javadoc`也会包含一条声明，说明这个接口是一个函数式接口。

## 四大内置函数式接口

要使用 lambda 表达式，我们就要创建一个函数式接口，为了不需要使用都要创建函数式接口，Java给我们内置了四大核心函数式接口。

### `Consumer<T>` : 消费型接口

代码示例：

```csharp
@Test
public void test() {
    happy(10000,(m) -> System.out.println("大保健花了："+m));
}

public void happy(double money, Consumer<Double> con) {
    con.accept(money);
}
```

### `Supplier<T> `: 供给型接口

示例代码：

```csharp
@Test
public void test() {
    List<Integer> numList = getNumList(10, ()->(int)(Math.random()*100 ));
    for (Integer integer : numList) {
        System.out.println(integer);
    }
}

//需求：产生指定个数的整数，并放入集合中
public List<Integer> getNumList(int num,Supplier<Integer> sup){
    List<Integer> list = new ArrayList<>();
    for(int i=0;i<num;i++) {  
        Integer n = sup.get();
        list.add(n);
    }
    return list;
}
```

### `Function<T, R> `: 函数型接口

示例代码：

```kotlin
@Test
public void  test() {
    String trimStr=strHandler("\t\t  你好，world！   ",(str) -> str.trim());
    System.out.println(trimStr);
    String sumString=strHandler("Helloworld!",(str)->str.substring(2, 4));
    System.out.println(sumString);
}

//需求：用于处理字符串
public  String strHandler(String str,Function<String,String> fun) {
    return fun.apply(str);
} 
```

### `Predicate<T>` : 断言型接口

示例代码：

```dart
@Test
public void test() {
    List<String> list = Arrays.asList("Hello","world","hi","o","123");
    List<String> filterStr = filterStr(list, (str) -> str.length() > 1);
    for (String string : filterStr) {
        System.out.println(string);
    }
}
    
//需求：将满足条件的字符串，放入集合中
public List<String> filterStr(List<String> list, Predicate<String> pre){
    List<String> list2=new ArrayList<>();
    for (String str : list) {
        if(pre.test(str)){
            list2.add(str);
        }
    }
    return list2;
}
```



>相关：
>
>https://www.jianshu.com/p/8005f32caf3d
>
>https://www.cnblogs.com/jianwei-dai/p/5819479.html
>
>https://www.cnblogs.com/lsswudi/p/11449151.html



# 方法引用与构造器引用

## 方法引用

若 lambda 体中的内容有方法已经实现了，就可以使用方法引用（可以理解为方法引用是lambda表达式的另外一种表达形式）。

要求：lambda 体中实现方法的方法参数类型与返回参数类型与参数引用的参数类型和返回参数类型一致。

主要有三种语法格式：

- `对象::实例方法名`
- `类::静态方法名`
- `类::实例方法名`   两个参数，第一个参数是方法的调用者，第二个参数是方法的参数时使用

```java
// 示例：
public class Exe1 {
    public static void main(String[] args) {
        ReturnOneParam lambda1 = a -> doubleNum(a);
        System.out.println(lambda1.method(3));

        // 类::静态方法
        //lambda2 引用了已经实现的 doubleNum 方法
        ReturnOneParam lambda2 = Exe1::doubleNum;
        System.out.println(lambda2.method(3));

        Exe1 exe = new Exe1();

        // 对象::实例方法
        //lambda4 引用了已经实现的 addTwo 方法
        ReturnOneParam lambda4 = exe::addTwo;
        System.out.println(lambda4.method(2));
        
        // 类::实例方法名
        // BiPredicate<String, String> bp  = (x,y) -> x.equals(y);
        BiPredicate<String, String> bp  = String::equals;
    }

    /**
     * 要求
     * 1.参数数量和类型要与接口中定义的一致
     * 2.返回值类型要与接口中定义的一致
     */
    public static int doubleNum(int a) {
        return a * 2;
    }

    public int addTwo(int a) {
        return a + 2;
    }
    
}
```



## 构造器引用

语法格式：`ClassName::new`

```java
// 无参构造
Supplier<Employee> sup = () -> new Employee();
// 构造器引用方式
Supplier<Employee> sup2 = Employee::new;

// 有参构造
Function<Integer, Employee> fun = (x) -> new Employee(x);
// 构造器引用方式
Function<Integer, Employee> fun2 = Employee::new;

// 多个参数的构造方法
BiFunction<Integer, Integer, Employee> bf = Employee::new;
// 根据接口的方法参数和返回参数来判断使用哪个构造函数
```



## 数组引用

语法格式：`Type::new`

```java
Function<Integer, String[]> fun = (x) -> new String[x];
// 数组引用写法
Function<Integer, String[]> fun2 = String[]::new;
```



# ⭐Stream API

## Stream 是什么

Stream 数据渠道，用于操作数据源所生产的元素序列。集合讲的是数据，流讲的是计算。

它的主要作用就是：使用一种管道的思想处理我们的集合对象，对集合对象进行如同SQL语句一样的查找、过滤、排序等操作。

特点：

1. Stream自己不会存储数据，不会改变数据源对象
2. 数据来源：集合、数组、IO channel、生成器函数等
3. 借助于lambda表达式，极大的提高了编程效率
4. 中间操作返回新流，它们总是惰性的，除非流水线触发终止操作，否则中间操作不会执行任何处理。由于是在终止操作时一次性全部处理，所以也称为惰性求值
5. 内部迭代：迭代操作是Stream API完成的

## 使用步骤

1. 创建Stream。从一个数据源，如：集合、数组中获取流。
2. 中间操作。一个操作的中间链，对数据源的数据进行操作。
3. 终止操作。一个操作的终止，执行中间操作链，并产生结果。

示例:

### 创建流

```java
/**
* 集合流
*	- Collection.stream();	顺序流
*	- Collection.parallelStream();	并行流
*/	
List<String> list = new ArrayList<>();
Stream<String> stream = list.stream();

/**
* 数组流
*	- Arrays.stream(array);
*/	
String[] stringArray = new String[10];
Stream<String> arrayStream = Arrays.stream(stringArray);

/**
* Stream 静态方法
*	Stream.of(...)
*/	
Stream<Integer> staticMethodStream = Stream.of(1,2,3);

/**
* 无限流（没有停止操作）
*	1. 迭代
* 	2. 生成
*/
// 迭代    iterate方法参数：初始值、Function接口
Stream<Integer> iterate = Stream.iterate(0, (x)-> x+2);
// 生产（可无限制造对象）
Stream<Double> generate = Stream.generate(() -> Math.random());

/**
* BufferedReader.lines() 将每行的内容转换成流对象
*/
BufferedReader reader = new BufferedReader(new FileReader("D:/text.txt"));
Stream<String> lineStream = reader.lines();

/*
* 将字符串分隔成流
*/
Pattern pattern = pattern.compile(",");
Stream<String> stringStrean = pattern.splitAsStream("a","b","c","d");
```

### 中间操作

#### **筛选/切片**

- `filter(lambda表达式)`：接收lambda，从流中排除某些元素
- `limit(n)`：截断流，使其元素**不超过**给定数量
- `skip(n)`：通过元素，返回一个**舍弃了前n个元素**的流，若流中元素不足n个，则返回一个空流。
- `distinct()`：筛选去重，通过流所生成的`hashCode()`和`equals()`去除重复元素。(注意重写`hashCode()`和`equals()`)

```java
List<Employee> emps = Arrays.asList(
    new Employee(101, "Z3", 19, 9999.99),
    new Employee(102, "L4", 20, 7777.77),
    new Employee(103, "W5", 35, 6666.66),
    new Employee(104, "Tom", 44, 1111.11),
    new Employee(105, "Jerry", 60, 4444.44)
);

public void test(){
    Stream<Employee> stream = emps.Stream()
        .filter((x) -> x.getAge > 35)
        .limit(3)
        .distinct() 	// 注意重写hashCode()和equals()方法
        .skip(1);
    /* 
    	多个中间操作连接起来形成一个流水线，
    	当触发终止操作时，一次性执行全部操作，称为惰性求值。
    */
    stream.forEach(System.out::println);
}
```

#### **映射**

- `map()`：接收 lambda表达式，将元素转换为其他形式或提取信息；接收一个函数作为参数，该函数会被应用到每一个元素上，并将其映射成一个新元素。
- `flatMap()`：接收一个函数作为参数，将流中每一个值都转换为了一个流，然后将所有流连接成一个新流。

```java
public class TestStreamApi{
    public void mapTest(){
        List<String> list = Arrays.asList("a", "b", "c");
    	// 大小写转换
    	list.stream()
            .map((str) -> str.toUpperCase())
            .forEach(System.out.printl);
        // 提取元素
    	emps.stream()
        	.map(Employee::getAge)
        	.forEach(System.out::println);
	}
    
    public void flatMapTest(){
    	Stream<Stream<Character>> stream = list.stream()
        	.map(TestStreamApi::filterCharacter);
    	stream.forEach((sm) -> {
        	sm.forEach(System.out::println);
    	});
    
    	// 使用flatMap()进行操作，二者的效果一致
    	list.stream()
        	.flatMap(TestStreamApi::filterCharater)
        	.forEach(System.out::println);
	}

	public static Stream<Character> filterCharacter(String str){
    	List<Character> list = new ArrayList<>();
    
    	for (Character ch : str.toCharArray()){
        	list.add(ch);
    	}
    	return list.stream();
	}
}
```

#### **排序**

- `sorted()`：自然排序(comparable)
- `sorted(Comparator c)`：定制排序（comparator）

```java
public void test(){
    List<Integer> list = Arrays.asList(2,1,3,4,5);
    list.stream()
        .sorted()
        .forEach(System.out::println);
    
    // 定制排序
    emps.stream()
        .sorted((e1,e2)->{ //compara()
            if (e1.getAge().equals(e2.getAge())){ 
                    return e1.getName().compareTo(e2.getName());
                } else {
                    return e1.getAge().compareTo(e2.getAge());
                }
            }).forEach(System.out::println);
        }
}
```

#### **消费**

- `peek()`：如同`map()`，会得到流中的每一个元素。但是`map()`接收的是一个`Function`表达式，有返回值，而`peek()`接收的是一个`Consumer`表达式，无返回值。

```java
public void PeekTest(){
    Student s1 = new Student("aa", 10);
    Student s2 = new Student("bb", 20);
    List<Student> studentList = Arrays.asList(s1, s2);

    studentList.stream()
        .peek(o -> o.setAge(100))
        .forEach(System.out::println);

    //结果：
    Student{name='aa', age=100}
    Student{name='bb', age=100}
}
```

#### **终止操作**

- `allMatch()`：检查是否匹配所有元素
- `anyMatch()`：检查是否至少匹配一个元素
- `noneMatch()`：检查是否没有匹配所有元素
- `findFirst()`：返回第一个元素
- `findAny()`：返回当前流中的任意元素
- `count()`：返回流中元素的总个数
- `max()`：返回流中最大值
- `min()`：返回流中最小值

```java
package com.hugh.edu;


import java.util.Arrays;
import java.util.List;
import java.util.Optional;

public class StopTest{

    static List<Employee> emps = Arrays.asList(
            new Employee(101, "Z3", 19, 9999.99),
            new Employee(102, "L4", 20, 7777.77),
            new Employee(103, "W5", 35, 6666.66),
            new Employee(104, "Tom", 44, 1111.11),
            new Employee(105, "Jerry", 60, 4444.44)
    );

    public static void main(String[] args) {

        List<Status> list = Arrays.asList(Status.FREE, Status.BUSY, Status.VOCATION);
        // 匹配所有元素
        boolean flag1 = list.stream()
                .allMatch((s) -> s.equals(Status.BUSY));
        System.out.println(flag1);

        // 至少匹配一个元素
        boolean flag2 = list.stream()
                .anyMatch((s) -> s.equals(Status.BUSY));
        System.out.println(flag2);

        // 是否没有匹配所有元素
        boolean flag3 = list.stream()
                .noneMatch((s) -> s.equals(Status.BUSY));
        System.out.println(flag3);

        // 返回第一个元素
        // 避免空指针异常
        Optional<Status> op1 = list.stream().findFirst();
        // 如果Optional为空 找一个替代的对象
        Status s1 = op1.orElse(Status.BUSY);
        System.out.println(s1);

        // 返回任一元素
        Optional<Status> op2 = list.stream().findAny();
        System.out.println(op2);

        long count = list.stream().count();
        System.out.println(count);

        // 获取最大工资的员工信息
        Optional<Employee> max = emps.stream()
                .max((e1, e2) -> Double.compare(e1.getSalary(), e2.getSalary()));
        System.out.println(max.get());

        // 获取最小工资
        Optional<Double> min = emps.stream()
                .map(Employee::getSalary)
                .min(Double::compare);
        System.out.println(min.get());

    }
}
```

### 归纳/收集

- 归纳：`reduce(T identity, BinaryOperator) / reduce(BinaryOperator)`可以将流中的数据反复结合起来，得到一个值
- 收集：`collect`将流转换成其他形式，接收一个`Collection`接口的实现，用于给流中元素做汇总的方法。

**归纳**

```java
public void test(){
    List<Integer> list = Array.asList(1,2,3,4,5,6,7,8,9);
    Integer sum = list.stream()
        .reduce(0, (x,y) -> x+y);	
    // identity起始值 binaryOperator二元运算 
    // 这里就相当于：将起始值当作x，从流中取出元素y进行运算。
    System.out.println(sum);
    
    Optional<Double> reduce = emps.stream()
        .map(Employee::getSalary)
        .reduce(Double::sum);	// 这里返回的是Optional，因为没有起始值
}
```

**收集**

`collect`将流转换为其他形式。接收一个Collection接口的实现，用于给 Stream 中元素汇总的方法。

```java
public void testCollect(){
    
	// 把公司员工所有名字提取出来，放入集合中
	List<String> list = emps.stream()
	        .map(Employee::getName)
	        .collect(Collectors.toList());
	list.forEach(System.out::println);

 	Set<String> set = emps.stream()
 	        .map(Employee::getName)
 	        .collect(Collectors.toSet());
 	set.forEach(System.out::println);

	HashSet<String> hs = emps.stream()
	        .map(Employee::getName)
	        .collect(Collectors.toCollection(HashSet::new));
	hs.forEach(System.out::println);

	// 收集总数
	Long collect = emps.stream()
	        .collect(Collectors.counting());
	// 平均值
	Double avg = emps.stream()
	        .collect(Collectors.averagingDouble(Employee::getSalary));
	// 总和
	Double sumCount = emps.stream()
	        .collect(Collectors.summingDouble(Employee::getSalary));
	// 最大值
	Optional<Employee> max = emps.stream()
	        .collect(Collectors.maxBy((e1,e2) -> Double.compare(e1.getSalary(), e2.getSalary())));
	// 最小值
	Optional<Double> min = emps.stream()
	        .map(Employee::getSalary)
	        .collect(Collectors.minBy(Double::compare));

	// 根据状态分组
	Map<Status, List<Employee>> map = emps.stream()
	        .collect(Collectors.groupingBy(Employee::getStatus));
    
	// 多级分组
	Map<Status, Map<String, List<Employee>>> collect2 = emps.stream()
	        .collect(Collectors.groupingBy(Employee::getStatus, Collectors.groupingBy((e)->{
	            if (e.getAge() <= 35){
	                return "青年";
	            } else if (e.getAge() <= 45){
	                return "中年";
	            } else {
	                return "老年";
	            }
	        })));

	// 分区	满足条件的一个区，不满足的一个区
	Map<Boolean, List<Employee>> listMap = emps.stream()
        .collect(Collectors.partitioningBy((e) -> e.getSalary() > 5000));
    
	DoubleSummaryStatistics dss = emps.stream()
        .collect(Collectors.summarizingDouble(Employee::getSalary));
    System.out.println(dss.getMax());
    System.out.println(dss.getMin());
   	System.out.println(dss.getSum());
   	System.out.println(dss.getCount());
   	System.out.println(dss.getAverage());
   
   // 将参数连接起来
   String str = emps.stream()
       .map(Employee::getName)
       .collect(Collectors.joining("-"));  // 可传入分隔符，首尾需要接着添加两个参数
   System.out.println(str);

}
```

### 并行流

并行流就是把一个内容分成多个数据块，并用不同的线程分别处理每个数据块的流。可以通过 Collection 系列集合提供的 `parallelStream()`。

Java 8 中将并行进行了优化，我们可以很容易的对数据进行操作；`Stream API`可以声明性地通过`parallel()`与`sequential()`在并行流与串行流之间切换。

```java
public void test(){
    // 串行流（单线程）：切换为并行流 parellel()
    // 并行流：切换为串行流 sequential()
    LongStream.rangeClose(0, 100000000L)	// rangClose:生成连续的数
        .paralelel()		// 并行流来执行ForkJoin框架执行的拆分执行操作，提升效率
        .reduce(0, Long::sum);
}
```



## Optional类

`Optioanl<T>`类(`java.util.Optional`)是一个容器类，代表一个值存在或者不存在，原来使用`null`来表示一个值的存在与否，现在`Optional`可以更好地表达这个概念，并且可以避免出现空指针异常。

常用方法：

```
Optional.of(T t)：创建一个Optional实例
Optional.empty()：创建一个空的Optional实例
Optional.ofNullable(T t)：若t不为null，创建Optional实例，否则创建空实例

isPresent()：判断是否包含值
orElse(T t)：如果调用对象包含值，则返回该值，否则返回t
orElseGet(Supplier s)：如果调用对象包含值，则返回该值，否则返回s获取的值
map(Function f)：如果有值对其处理，则返回处理后的Optional，否则返回Optional.empty()
flatMap(function mapper)：与map类似，要求返回必须是Optional
```

示例：

```java
public class optionalTest {
    @Test
    public void test(){
        Optional<Godness> gn = Optional.ofNullable(new Godness("波多老师"));
        optional<NewMan> op = OPtional.ofNullable(new NewMan(gn));
        String str = getGodnessName(op);
        System.out.println(str);
    }
    
    public String getGodnessName(Optional<NewMan> man) {
        return man.orElse(new NewMan())
            .getGodness()
            .orElse(new Godness("苍老师"))
            .getName();
    }
    
}

class NewMan {
    private Optional<Godness> godness = Optional.empty();
    
    public NewMan(){}
    public NewMan(Option<Godness> godness){
        super();
        this.godness = godness;
    }
    
    public Optional<Godness> getGodness(){
        return godness;
    }
    
    public void setGodness(Optional<Godness> godness){
        this.godness = godness;
    } 
    
    @Overrde
    public String toString(){
        return "NewMan [godeness=" + godeness + "]";
    }
}
```

# 接口默认方法和静态方法

## 接口默认方法

Java8 中允许为接口方法提供一个默认的实现。**必须用`default`修饰符标记这样一个方法**，例如JDK中的`Iterator`接口：

```java
public interface Iterator<E> {
      boolean hasNext();
    
      E next();
    
      default void remove() { 
          throw new UnsupportedOperationExceition("remove"); 
      }
}
```

如果要实现一个迭代器，就需要提供 `hasNext()` 和 `next()` 方法。这些方法没有默认实现——它们依赖于你要遍历访问的数据结构。不过，如果你的迭代器是**只读**的，那么就不用操心实现 `remove()` 方法。

默认方法也可以调用其他方法，例如：可以改造 `Collection` 接口，定义一个方便的 `isEmpty()` 方法：

```java
public interface Collection {
    // 一个抽象方法
    int size(); 
    
    default boolean isEmpty() { 
        return size() == 0; 
    }
}
```

这样，实现 `Collection` 的程序员就不用再操心实现 `isEmpty()` 方法了。

在 JVM 中，默认方法的实现是非常高效的，并且通过字节码指令为方法调用提供了支持。默认方法允许继续使用现有的 Java 接口，而同时能够保障正常的编译过程。这方面好的例子是大量的方法被添加到`java.util.Collection`接口中去：`stream()`，`parallelStream()`，`forEach()`，`removeIf()`等。尽管默认方法非常强大，但是在使用默认方法时我们需要小心注意一个地方：**在声明一个默认方法前，请仔细思考是不是真的有必要使用默认方法**。

### 解决默认方法冲突

如果先在一个接口中将一个方法定义为默认方法，然后又在类或另一个接口中定义同样的方法，会发生什么？

```java
// 测试接口 1
public interface TestInterface1 {
    default void sameMethod() { System.out.println("Invoke TestInterface1 method！"); }
}

// 测试接口 2
public interface TestInterface2 {
    default void sameMethod() { System.out.println("Invoke TestInterface2 method！"); }
}


// 继承两个接口的测试类
public class TestObject implements TestInterface1, TestInterface2 {

    @Override
    public void sameMethod() {
          // 这里也可以选择两个接口中的一个默认实现
          // 如： TestInterface1.super.sameMethod();
        System.out.println("Invoke Object method！");
    }
}

// 测试类
public class Tester {

    public static void main(String[] args) {
        TestObject testObject = new TestObject();
        testObject.sameMethod();
    }
}
```

**测试输出：**

```text
Invoke Object method！
```

对于 `Scale` 或者 `C++` 这些语言来说，解决这种具有 **二义性** 的情况规则会很复杂，`Java` 的规则则简单得多：

1. **类优先**：如果本类中提供了一个具体方法符合签名，则同名且具有相同参数列表的接口中的默认方法会被忽略；
2. **接口冲突**：如果一个接口提供了一个默认方法，另一个接口提供了一个同名且参数列表相同的方法 *(顺序和类型都相同)* ，则必须覆盖这个方法来解决冲突 *(不覆盖编译器不会编译..)*；



前面只讨论了两个接口的命名冲突。现在来考虑另一种情况，一个类继承自一个类，同时实现了一个接口，**从父类继承的方法和接口拥有同样的方法签名**，又将怎么办呢？

```java
// 测试接口
public interface TestInterface {
    default void sameMethod() { System.out.println("Invoke TestInterface Method！"); }
}

// 父类
public class Father {
    void sameMethod() { System.out.println("Invoke Father Method！"); }
}

// 子类
public class Son extends Father implements TestInterface {
    @Override
    public void sameMethod() {
        System.out.println("Invoke Son Method！");
    }
}

// 测试类
public class Tester {
    public static void main(String[] args) { new Son().sameMethod(); }
}
```

**程序输出：**

```test
Invoke Son Method！
```

还记得方法调用的过程吗 (先找本类的方法找不到再从父类找)，加上这里提到的 “类优先” 原则 (本类中有方法则直接调用)，这很容易理解！

> **千万不要让一个默认方法重新定义 `Object` 类中的某个方法**。例如，不能为 `toString()` 或 `equals()` 定义默认方法，尽管对于 List 之类的接口这可能很有吸引力，但由于 **类优先原则**，这样的方法绝对无法超越 `Object.toString()` 或者`Object.equals()`。

## 接口静态方法

Java8 中允许在接口中增加静态方法 。理论上讲，没有任何理由认为这是不合法的，**只是这有违将接口作为抽象规范的初衷**。

**例子：**

```java
public interface StaticInterface {
    static void method() {
        System.out.println("这是Java8接口中的静态方法!");
    }
}
```

**调用：**

```java
public class Main {
    public static void main(String[] args) {
        StaticInterface.method(); // 输出 这是Java8接口中的静态方法!
    }
}
```

目前为止，通常的做法都是将静态方法放在 **伴随类** *(可以理解为操作继承接口的实用工具类)* 中。在标准库中，你可以看到成对出现的接口和实用工具类，如 `Collection/ Collections` 或 `Path/ Paths`。

在 **Java 11** 中，`Path` 接口就提供了一个与之工具类 `Paths.get()` 等价的方法 *(该方法用于将一个 URI 或者字符串序列构造成一个文件或目录的路径)*：

```java
public interface Path {
    public static Path of(String first, String... more) { ... }
    public static Path of(URI uri) { ... }
}
```

这样一来，`Paths` 类就不再是必要的了。类似地，如果实现你自己的接口时，没有理由再额外提供一个带有实用方法的工具类。

另外，在 **Java 9** 中，接口中的方法可以是 `private`。`private` 方法可以是静态方法或实例方法。由于私有方法只能在接口本身的方法中使用，所以它们的用法很有限，只能作为接口中其他方法的辅助方法。



>相关：
>
>https://www.jianshu.com/p/38e648e07cfb
>
>https://blog.csdn.net/tangshuai96/article/details/101264446
>
>⭐   https://www.cnblogs.com/sum-41/p/10878807.html
>
>https://zhuanlan.zhihu.com/p/111787426

# 新时间日期API

之前提供的时间日期API都不是线程安全的，使用起来也比较麻烦。所以Java8提供了一套新的时间日期API位于`java.time`包下。

```java
// 获取当前时间日期
LocalDateTime ldt = LocalDateTime.now();
// 获取指定时间日期
LocalDateTime ldt2 = LocalDateTime.of(2015,12,20,13,22,33);

// 对时间日期进行处理
LocalDateTime ldt3 = ldt.plusYears(2);
LocalDateTime ldt4 = ldt.minusMonths(2);

// 提取时间日期的指定部分
System.out.println(ldt.getYear());
System.out.println(ldt.getMonthValue());
System.out.println(ldt.getDayOfMonth());
System.out.println(ldt.getHour());
System.out.println(ldt.getMinute());
System.out.println(ldt.getSecond());

-------------------------------------
    
// 时间戳 Instant	以Unix元年：1970年1月1日00:00:00之间的毫秒值
// 默认获取UTC时区
Instant ins = Instant.now();	
// 返回偏移8个小时的值
offsetDateTime odt = ins.atOffset(ZoneOffset.ofHours(8));	
//输出毫秒值
System.out.println(ins.toEpochMilli());	
// 返回指定时间的时间戳
Instant ins2 = Instant.ofEpochSecond(60);	

---------------------------------------
    
// Duration：计算两个时间之间的间隔
// Period：计算两个日期之间的间隔
    
Instant ins3 = Instant.now();
TimeUnit.MINUTES.sleep(10);
Instant ins4 = instant.now();
Duration duration = Duration.between(ins3, ins4);
System.out.println(duration.toMills());

---------------------------------------

// 时间日期格式化 DateTimeFormatter
DateTimeFormatter dtf = DateTimeFormatter.ISO_DATE;
LocalDateTime ldt = LocalDateTime.now();
String strDate = ldt.format(dtf);

// 自定义formate格式
DateTimeFormatter dtf2 = DateTimeFormatter.ofPattern("yyyy年MM月dd日 HH:mm:ss");
String strData2 = dtf2.format(ldt);

// 解析回标准格式
LocalDateTime newDate = ldt.parse(strData2, dtf2);

---------------------------------------

// 获取所有时区
Set<String> set = ZoneId.getAvailableZoneIdS();
set.forEach(System.out::println);
    
// 创建指定时区的时间
LocalDateTime ldt = LocalDateTime.now(ZoneId.of("Europ/Tallinn"));
System.out.println(zdt);
// 2021-02-16T11:56:31.903

LocalDateTime ldt2 = LocalDateTime.now(ZoneId.of("Europ/Tallinn"));
ZonedDateTime zdt = ldt2.atZone(ZoneId.of("Europ/Tallinn"));
System.out.println(zdt);
// 2021-02-16T11:56:31.903+02:00[Europ/Tallinn]
```

