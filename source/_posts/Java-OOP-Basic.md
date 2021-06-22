---
title: 面向对象基础
tags: Java
categories: Java
date: 2020-06-15 16:00:28

---

-

<!--more-->

- 在面向对象的世界中，万物皆对象
- 对象的实质：属性 + 行为（方法）

 OOP（面向对象）

- OOP 不仅仅是编程思想，还可以运用到设计，测试等多个方向
- OOP 是指以对象为基本单位去分析，设计实现的系统
- 使用 OOP 去开发的时候是先有类，分析过程时是现有对象后有类



# 类与对象

`Class`就是定义了一种数据类型

字段(`field`)，用来描述一个类的特征。*在方法之外。*

- 类是具有共同属性 和 行为对象的集合
- 类定义了对象的 属性 和 方法
- 通过类可以实例化多个对象，每个对象的属性值不相同
- 类是`Java`程序程序的基本组成单位
- 类是对象的抽象，是对对象的描述，是创建对象的模板
- 对象表示现实世界中某个具体的事物，是类的实例化

类是一种模板，根据类创建出来的对象就称作实例，使用`new`来进行实例化`Class instance = new Class();`，`Class instance`是定义`Class`类型的变量`instance`，而`new Class()`是创建`Class`实例。使用`变量.字段`实现对实例变量的访问。

指向`instance`的变量都是**引用变量**。

## 类的基本结构

- **属性**：对象数据的描述
- **方法**：对象的行为（可以做哪些事）
- **构造方法**：用于实例化对象
- **内部类**：（`inner class`）即在类体中声明的类
- **块**：分为静态块（`static`），实例块

```java
public class Person{
    
    // 定义属性
    String name;//姓名
    int age;//年龄
    

    // 创建一个构造方法，这个方法会在对象实例化的时候调用
    public Person() {
        ...   
    }
    
    
    // 方法
    public void eat() {
        System.out.println('吃饭');   
    }
    

    //   定义块，区别就是类实例化时，执行的顺序不同
    {
        System.out.println('我是实例块');
    }
    
    static {
        System.out.println("我是静态块");   
    }
    
    
    // 内部类
    class InnerClass {  
    }
    
}
```

## 类的声明及作用

### 声明形式：

```java 
【访问权限修饰符】【修饰符】class ClassName {
	类体
}
```

访问修饰符有两种：`public`、`default`（默认就是`default`）

修饰符：`final`、`synchronized`、`abstract`

### 类的作用

类就是一个模板，定义好了多个对象**共有**的属性和方法

```java
public class Student{
      String name;//学生姓名
      int age;// 学生年龄
      String score;//学生成绩
    
      public void play() {
        System.out.print("学生爱玩");
      }
    
    public static void main(String[] args) {
        Student stu = new Student(); // 实例化一个学生对象
        stu.name = '张三';
        ....
        Student stu1 = new Student(); // 再实例化一个学生对象   
        stu1.name = "李四";
        ...
    }
}
```

# 属性

## 属性的定义：

属性即对象的属性，也称为**成员变量**，是声明在类中的变量，在方法体中声明的变量称为**局部变量或临时变量**

属性的声明方式：

>【访问修饰符】   【修饰符】   数据类型   属性名   =   初值

```java
public class Student {
    String stuName;
    private static int age = 18;
    private double avgScores;   
    .....
        
}
```



# 方法

什么是方法

- 方法是解决一类问题的步骤的有序组合。
- 方法包含于类或对象中。
- 方法在程序中被创建，在其他地方被引用。

例如：

`System.out.println()`

- `println()`是一个方法。
- `System`是系统类。
- `out`是标准输出对象。

调用系统类`System`中的标准输出对象`out`中的`println()`方法。

------

## 方法的声明格式

```java
【修饰权限修饰符】【修饰符】 返回值类型 方法名(形参列表){
	方法体；
	return 方法返回值； //如果没有返回值，返回类型设置为void，省略return
}
```

## 引入方法的原因

一个`class`可以包含多个`field`，但是直接将`field`暴露在外部可能会破坏封装性，直接操作`field`容易造成逻辑混乱，为了避免外部代码直接去访问`field`，可以用`private`修饰`field`，拒绝外部访问。

当使用`private`修饰`field`时，就需要使用方法(`method`)来让外部代码可以间接访问`field`。

```java
public class Main{
    public static void main(String[] args){
        Person ming = new Person();
        ming.setName("xiao ming"); //设置name 
        ming.setAge(12); //设置age
        System.out.println(ming.getName() + ", " + ming.getAge());
    }
}
class Person{
    private String name;
    private int age;
    public void setName(String name){
        this.name = name;
    }
    public String getName(){
        return this.name;
    }
    public int getAge(){
        return this.age;
    }
    public void setAge(int age){
        if (age>0 || age<100){
            this.name = name;
        }
        else{
            throw new IllegalArgumentException("invalid age value");
        }
    }
}
```

虽然外部代码不能直接修改`private`字段，但是外部代码可以调用方法`setName()`和`setAge()`来间接修改`private`字段，在方法内部就可以乘机检查参数是不是正确。同样，外部代码不能访问`private`字段，但是可以通过`getName`和`getAge`间接获取`private`字段的值。

所以，一个类通过定义方法，就可以给外部代码暴露一些操作的接口，同时内部保证逻辑一致性。

调用方法的语法是：`实例变量.方法名(参数)`。



## 方法重载

- 在 Java 中如果有多个同名但是不同参数的方法就称为方法的重载
- 编译器会根据调用时传递的实际参数自动判断具体调用的是哪个重载方法

### 方法重载的三大法则

- 方法名相同
- 参数不同
  - 数量不同
  - 数据类型不同
  - 顺序不同
- 同一作用域

> 当返回值不同时就无法构成重载，在不同的类中，作用域不同，方法重载就无法生效。

# 构造方法

构造方法是一种比较特殊的方法，在我们创建实例的时候就需要使用构造方法。

构造方法的名称就是类名。构造方法的参数没有限制，在方法内，也可以编写任意语句。但是，和普通方法相比，构造方法没有返回值（也没有`void`），调用构造方法，必须用`new`操作符。

## 构造方法的声明格式

```Java
【权限访问修饰符】类名 (形参列表) {
    方法体
}
```

## 构造方法与方法的区别

构造方法

1. 在实例化对象的时候调用
2. 没有返回值，不用加`void`
3. 方法名必须与类名相同
4. 不能使用修饰符：`static`、`final`、`abstract`

方法

1. 有静态方法和非静态方法
2. 可以使用修饰符：`static`、`final`、`abstract`
3. 静态方法可以直接由类名直接调用也可以用对象调用，非静态方法需要对象调用
4. 返回值可无，但是要加`void`

## 构造方法重载

方法重载：在一个类中有同名但是参数不同的方法

#### 默认构造方法

任何`class`都有构造方法，如果一个类没有定义构造方法，编译器会自动为我们生成一个默认构造方法，它没有参数，也没有执行语句，类似这样：

```java
public class Person{
    public Person(){        
    }
}
```

如果我们自定义了一个构造方法，那么，编译器就不再自动创建默认构造方法：

```java
public class Main {
    public static void main(String[] args) {
        Person p = new Person(); // 编译错误:找不到这个构造方法
    }
}
class Person {
    private String name;
    private int age;
    public Person(String name, int age) {
        this.name = name;
        this.age = age;
    }
    public String getName() {
        return this.name;
    }
    public int getAge() {
        return this.age;
    }
}
```

没有在构造方法中初始化字段时，引用类型的字段默认是`null`，数值类型的字段用默认值，`int`类型默认值是`0`，布尔类型默认值是`false`。

#### 多构造方法

可以定义多个构造方法，在通过`new`操作符调用的时候，编译器通过构造方法的参数数量、位置和类型自动区分。

一个构造方法可以调用其他构造方法，这样做的目的是便于代码复用。构造方法内部调用其他构造方法的语法是`this(形参列表)`：

```java
class Person {
    private String name;
    private int age;
    public Person(String name, int age) {
        this.name = name;
        this.age = age;
    }
    public Person(String name) {
        this(name, 18); // 调用另一个构造方法Person(String, int)
    }
    public Person() {
        this("Unnamed"); // 调用另一个构造方法Person(String)
    }
}
```



# 块与内部类

## 块的定义

块在类中声明，类似一个没有方法声明的方法体，分为`实例块`和`静态块`

### 实例块：

作用：每次调用构造方法前自动调用

```java
{
    // 任何符语法的 Java 代码
}
```

### 静态块：

类加载时被调用，仅一次，与是否创建对象无关

```java
static {
    // 任何符语法的 Java 代码
}
```

## 块测试

运行一下，看一下执行的先后顺序

```java
public class Person
{
    private String name;
    private int age;
    
    public void work() {
        System.out.print("工作啦！");   
    }
    
    static {
        System.out.println("调用静态块");
    }
    
    {
        System.out.println("执行实例块");
    }
    
    public Person() {
        System.out.println("调用无参构造方法");
    }
    
    public Person(String name, int age) {
        this.name = name;
        this.age = age;
    }
    
    public Person(String name) {
        this.name = name;
    }
    

    public static void main(String [] args) {
        // 第一种方式创建对象（一步到位）
        Person p = new Person(); // 调用无参的构造方法
        Person p1 = new Person("嘿黑",18); // 调用有参的构造方法
        
        // 第二种方式创建对象（两步创建）
        Person one;
        one = new Person();
    }
   
}
```

## 内部类

内部类：在类内部定义的类，可以直接调用外部类的属性，往往在 GUI 中使用的比较多

```java
public class Outter {
    private String name;
    private int age;
    
    class Inner {
        public void test() {
            age=18;   
        }
    }
}
```