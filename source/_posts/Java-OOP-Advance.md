---
title: 面向对象编程进阶
tags: Java
categories: Java
date: 2020-06-15 20:00:28


---

-

<!--more-->

# 封装

## 封装性

封装性是一种信息隐藏技术：将对象的全部属性和方法结合在一起，形成一个不可独立分割的独立单位，尽可能隐藏对象的内部结构。

## 访问修饰符权限范围

![](https://s1.ax1x.com/2020/07/27/aFbeyT.png)

## 封装实现细节

类中的属性一般使用`private`修饰，提供`getter`和`setter`方法供外界访问并修改

封装：隐藏类的实际细节，对外提供访问接口

```java
public class Person {
    private String name;
    private int age;
    private String gender;

    public Person() {
        super();
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public int getAge() {
        return age;
    }

    public void setAge(int age) {
        this.age = age;
    }

    public String getGender() {
        return gender;
    }

    public void setGender(String gender) {
        this.gender = gender;
    }

    public Person(String name, int age, String gender) {
        this.name = name;
        this.age = age;
        this.gender = gender;
    }
    
}
```

Tips: 在真实开发中，我们一般会把这样的类成为实体类 （entity）

## 封装的好处

- 数据安全：保证数据安全性
- 方便调用：提供清晰的对外接口
- 降低耦合：类内部实现可以修改，不影响其他类

# 继承

- 继承机制是面向对象程序设计不可缺少的关键概念，是实现软件可重用的根基，是提高软件系统的可扩展性与可维护性的主要途径。
- 所谓继承是指一个类的定义可以基于另外一个已经存在的类，即子类基于父类，从而实现父类代码的重用，子类能吸收已有类的数据属性和行为，并能扩展新的能力。

```java
class Person{
    private String name;
    private int age;
    public String getName(){
        return this.name;
    }
    public void setName(String name){
        this.name = name;
    }
    public int getAge(){...;}
    public void setAge(int age){...;}
}

class Student extends Person{
    //不要重复name和age字段/方法，只需要定义新增score字段/方法
    private int score;
    public void setScore(int score){...;}
    public int getScore(){...;}
}
```

通过继承，`Student`只需要编写额外的功能，不再需要重复代码。

> 注意：子类自动获得了父类的所有字段，严禁定义与父类重名的字段！

继承有一个特点，就是子类无法访问父类的`private`字段或者`private`方法。`Student`类就无法访问`Person`类的`name`和`age`字段：

```java
class Person{
    private String name;
    private int age;
}
class Student extends Person{
    public String getName(){
        return "Hello, " + name;  //编译错误，无法访问name字段。
    }
}
```

这使得继承的作用被削弱了。为了让子类可以访问父类的字段，我们需要把`private`改为`protected`。用`protected`修饰的字段可以被子类访问。`protected`关键字可以把字段和方法的访问权限控制在继承树内部，一个`protected`字段和方法可以被其子类，以及子类的子类所访问。

## 继承中构造方法的调用

- 子类构造方法总是先调用父类构造方法
- 默认情况下，调用父类无参构造方法
- 可以在子类构造方法第一行，使用 super() 关键字调用父类任意一个构造方法

```java
public class Person{
    private String name;
    private int age;
    
    public Peron(){
    
    }
    
    public Peron(String name, int age) {
        this.name = name;
        this.age = age;
    }
}

// 子类、衍生类                                 
public class Alice extends Person{
    // 调用自己的无参构造方法
    public Alice() {
    }
    
    public Alice() {
        super(); // 调用父类的无参构造方法
    }
    
    public Alice(String name, int age) {
        // 在子类构造方法中的第一行语句，使用 super 调用父类构造方法
        super(name,age); // 调用父类的有参构造方法
    }
    
    public void eat() {
        System.out.println("eat");
    }
}
```

## 方法的重写

如果父类的方法无法满足子类的使用，那么子类可以使用同名方法覆盖父类方法。

**要求：**

方法名一致，参数列表一致，返回名一致、访问修饰符不能比父类的权限小

## 继承的缺点

继承是实现类复用的重要手段，但是继承会破坏封装。 每个类都应该封装其内部信息和实现细节，仅暴露必要的方法给其他类使用。但子类可以直接访问父类的内部信息，甚至可以重写父类的方法，这增加了子类和父类的耦合度，破坏了封装。 设计父类时，应遵循以下原则：

- 尽量将父类的成员变量设置为`private`。
- 尽量缩小方法的访问权限，能私有尽量不要共有。
- 不希望被子类重写的方法设置为`final`。
- 不要在父类的构造方法中调用被子类重写的方法。

# 多态

**多态的必要条件：**

1. 必须有继承（或者实现的接口）
2. 必须有子类对象获取父类的引用
3. 必须有子类对父类的方法进行重写

## 多态性

多态性是面向对象三大特征之一。

多态性是对外的一种表现形式，内部有多种具体实现，若：方法的重载、方法覆盖、多态参数。

## 编译期与运行期

我们创建对象一般是 `类名 对象名 = new 类名()`;

- 等号组边成为**编译器**
- 等号右边称为**运行期**

下面围绕编译期和运行期展开讲解

```java
// 最常见的方式
A a = new A(); 
a.show();

// 当 A 是 B的父类的时候，我们还可以这样做
A ab = new B();
ab.show();

// 对象类型转换
B b = (B)ab; 
```

## 父类的引用指向子类

编译类型是父类，运行期是子类，被称为父类引用指向子类的对象

```java
class Animal{
    ...   
}

class Cat extends Animal {
    ...   
}

class Dog extends Animal {
    ...   
}

Cat m = new Cat();
Animal a = new Cat(); // Animal 的引用指向 Cat 的对象
// 对象 m 可以调用猫类的的所有方法，
// 对象 a 只能调用动物类中定义的方法，猫类扩展的方法不能调用

// 在集合中，我们会经常使用到这个方法
List list = new ArrayList(); // 这也是父类引用子类的常见使用
```

## 多态环境下的调用

### 对成员方法的调用

```java
class Animal{
    void show() {
        System.out.println("Animal");
    }
}

class Cat extends Animal {
    void show() {
        System.out.println("Cat");
    }   
}
...
Animal x = new Cat();
x.show(); // 调用的是子类中的方法
```

编译看左边，运行看右边

### 对静态方法的调用

```java
class Animal{
    static void show() {
        System.out.println("Animal");
    }
}

class Cat extends Animal {
    static void show() {
        System.out.println("Cat");
    }   
}
...
Animal x = new Cat();
x.show(); // 调用的动物类中静态成员方法
```

编译和运行看左边

### 对成员变量的调用

```java
class Animal{
    int num = 3;
}

class Cat extends Animal {
    int num = 4;
}
...
Animal x = new Cat();
x.num; // 调用的动物类中成员变量
```

编译和运行看左边

> 变量不存在被子类覆盖的说法，只有方法存在腹泻

## 多态参数

```java
class Animal{
    void eat() {}
}

class Cat extends Animal {
    void eat() {}  
}

class Dog extends Animal {
    void eat() {}   
}

// 方法的形式参数类型是父类类型，而传递的实际参数可以是任意子类对象
method(Animal animal) {
    animal.eat();   
}
```

方法参数多态性的好处：提高代码的扩展性

## 多态环境下的对象转型

假设有`Person`和`Student`两个类，`Student`继承自`Person`。

### 向上转型

如果一个引用变量的类型是`Student`，那么它可以指向一个`Student`类型的实例：`Student s = new Student();`。

如果一个引用变量的类型是`Person`，那么它可以指向一个`Person`类型的实例：`Person p = new Person();`。

如果`Student`是从`Person`继承下来的，那么`Person s = new Student();`这样的写法也是允许的。这种把一个子类类型安全地变为父类类型的赋值，被称为向上转型(`upcasting`)。

### 向下转型

和向上转型相反，如果把一个父类类型强制转型为子类类型，就是向下转型(`downcasting`)。向下转型很可能会失败，失败的时候Java虚拟机会报`ClassCastException`。

## instanceof 操作符

判断对象类型，常用来判断一个对象类是否为一个特定对象的实例

```java
class Person {
    ...
}

Person p = new Person();
boolean result = Person instanceof p;
```

## 多态的两种表现形式

1. 方法的重载和重写
   - 重载发生在本类
   - 重写发生在父类和子类之间（有继承关系的或者有接口关系的）
2. 实现的两种方式
   - 继承
   - 接口

# 抽象

## 抽象类

如果一个类中没有包含足够的信息来描述一个具体的对象，这样的类就是抽象类。比如形状类就是抽象类，圆形，三角形就是具体的类。

- 用`abstract`修饰的类就是抽象类。如果某个类中包含有抽象方法，那么该类必须定义为抽象类 ，但是抽象类不一定有抽象方法
- 抽象类可以有成员属性和非抽象成员方法

- 抽象类不能被实例化，但是可以有构造函数
- 抽象类只能用作基类，表示的是一种继承关系。继承抽象类的非抽象类必须实现其中的所有抽象方法，而已实现方法的参数、返回值要和抽象类中的方法一样。否则，该类也必须声明为抽象类。

### 抽象类的定义

使用关键字`abstract`定义抽象类

```java
[访问权限] abstract class 类名 {
       成员列表
}
```

比如：

```java
public abstract class Shapes {
    public abstract void draw();   
}
// 或
public abstract class Shapes{
    public void draw() {
        //具体代码   
    }
}
```

### 抽象类的注意事项

1. 抽象类可以有构造方法，但不能直接实例化，只能用来继承
2. 抽象类的派生子类应该提供对其所有抽象方法的具体实现，如果抽象类的派生子类没有实现其中的所有抽象方法，那么该派生子类仍然是抽象类，只能用于继承，而不能实例化
3. 抽象类中也可以包含有非抽象的方法，子类中重写非抽象方法时返回值和参数必须与父类一致
4. 构造方法和静态方法不可以修饰为`abstract`。

## 抽象方法

### 抽象方法的定义

```java
[访问权限] abstract 返回值类型 方法名(参数列表); 

// 这里定义了一个抽象方法，为 what to do （做什么）
public abstract void draw(); // 父类 Shapes

// 怎么做，要在子类中具体实现 How to do
@overide 
public abstract void draw() {
    // 方法体   
}
```

### 抽象方法的相关概念

- 类无法提供具体的实现，可以将此方法声明成抽象方法
- 在类中没有方法体的方法，就是抽象方法
- 含有抽象方法的类，一定是抽象类

## 抽象的作用

- 在面向对象领域，抽象类主要用来进行类型隐藏。也就是使用抽象的类型来编程，但是具体运行时就可以使用具体类型。
- 利用抽象的概念，能够在开发项目中创建扩展性很好的架构，优化程序。
- 抽象类，抽象方法，在软件开发过程中都是设计层面的概念。也就是说，设计人员会设计出抽象类，抽象方法，程序员都是来继承这些抽象类并覆盖抽象方法，实现具体功能。

# 面向对象中的一些关键字

## this

- this关键字代表自身，在程序中主要的用途：
  - 使用`this`关键字在自身构造方法内部引用其它构造方法
  - 使用`this`关键字代表自身类的对象
    - 直接使用`this`
    - 使用`this`关键字引用成员变量
    - 使用`this`关键字引用成员方法

>注意: **`this`关键字必须放在非静态方法里面**，因为静态方法和当前对象没有关系

**this 的作用**

1. `this`代表当前
2. 使用`this`可以在当前成员方法中调用其他方法
3. 使用`this`也可以在构造方法中引用其它构造方法

**示例**

```java
public class Person {
    private String name;
    private int age;
    private String gender;
    
    Person p; 
    // 使用this代表当前对象
    public Person() { 
        p = this;
    }

    // this在构造方法中引用其它构造方法
    public Person() {
       this("alice");
    }
    
    public Person(String name) {
        this.name = name;
    }
    
    // 在类内部，成员方法之间的相互调用也可以使用 this.方法名引用
    public void a() {
        System.out.println("我是a");
    }
    public void b() {
        this.a();
    }

    .... getter 和 setter 省略

    public Person(String name, int age, String gender) {
        this.name = name;
        this.age = age;
        this.gender = gender;
    }

}
```



## super

`super`一般会在继承关系中使用

- 在子类构造方法中要调用父类的构造方法，需要注意: `super`语句只能出现在子类构造方法体的第一行。
- 当子类方法体中的局部变量或者子类的成员变量与父类成员变量同名时，即子类局部变量覆盖父类成员变量时，用`super.成员变量名`来引用父类成员变量
- 当子类的成员方法覆盖了父类的成员方法时，也就是子类和父类有完全相同的方法定义(方法体可以不同)，此时，用`super.方法名(参数列表)`的方式访问父类的方法。
- 与`this`的区别，`this`通常指代当前对象，`super`通常指代父类。

------

`super`关键字表示父类(超类)。子类引用父类的字段时，可以用`super.fieldName`。

```java
class Student extends Person{
    public String getName(){
        return "Hello, " + super.name;
    }
}
```

实际上，这里使用`super.name`，或者`this.name`，或者`name`，效果都是一样的。编译器会自动定位到父类的`name`字段。但是，在某些时候，就必须使用`super`。我们来看一个例子：

```java
public class Main{
    public static void main(String[] args){
        Student s = new Student("Xiao Ming", 12, 89);
    }
}
class Person{
    protected String name;
    protected int age;
    public Person(String name, int age){
        this.name = name;
        this.age = age;
    }
}
class Student extends Person{
    protected int score;
    public Student(String name, int age, int Score){
        this.score = score;
    }
}
```

运行上面的代码，会得到一个编译错误，大意是在`Student`的构造方法中，无法调用`Person`的构造方法。

这是因为在Java中，任何`class`的构造方法，第一行语句必须是调用父类的构造方法。如果没有明确地调用父类的构造方法，编译器会帮我们自动加一句`super();`，所以，`Student`类的构造方法实际上是这样：

```java
class Student extends Person{
    protected int score;
    public Student(String name, int age, int Score){
        super(); //自动调用父类的构造方法
        this.score = score;
    }
}
```

但是，`Person`类并没有无参数的构造方法，因此，编译失败。解决方法是调用`Person`类存在的某个构造方法。

```java
class Student extends Person{
    protected int score;
    public Student(String name, int age, int Score){
        super(name, age);  //调用父类的构造方法Person(String int)
        this.score = score;
    }
}
```

因此我们得出结论：如果父类没有默认的构造方法，子类就必须显式调用`super()`并给出参数以便让编译器定位到父类的一个合适的构造方法。

这里还顺带引出了另一个问题：即子类**不会继承**任何父类的构造方法。子类默认的构造方法是编译器自动生成的，不是继承的。

## 方法重写

子类可以重写父类中某一个方法，称为方法重写，也称为方法覆盖。如果子类需要修改从父类继承到的方法的方法体，就可以使用方法重写。
**方法重写的原则：**

同名，同参，同返回值，访问权限不能缩小

**示例**

```java
public class Person() {
    ....
        
    public void play() {
        System.out.println("HAHA");   
    }
}
// 子类
public class Alice() extends Person {
    ...
    public void play() {
        System.out.println("hehe");    // 方法覆盖了
    }    
    
}
```

## private

`private`方法和`private`字段一样，不允许外部调用，虽然外部不能调用，但是内部却是可以调用的。例如：

```java
public class Main{
    public static void main(String[] args){
        Person ming = new Person();
        ming.setBirth(2008);
        System.out.println(ming.getAge());
    }
}
class Person{
    private String name;
    private int birth;
    
    public void setBirth(int birth){
        this.birth = birth;
    }
    public int getAge(){
        return calcAge(2020); //调用private方法
    }
    //private方法
    private int calcAge(int currentYear){
        return currentYear - this.birth;
    }
}
```

可以看到，我们在`Person`类中只定义了`birth`和`name`字段，没有定义`age`字段，获取`age`时，通过`getAge()`方法返回的是一个实时计算的值，并非存储在某个字段的值，这说明方法可以封装一个类的对外接口，调用方法不需要知道也不关心`Person`实例在内部到底有没有`age`字段。

```java
class Person{
    private String name;
    public getName(){return name;} //无局部变量
    public void setName(){this.name = name;} //有局部变量 String name，使用this.name
}
```

# 接口

Java中的接口都是一对一的，为了解决这个问题，Java提出了接口的概念。

## 接口的定义

接口是一系列方法的声明，是一些抽象的集合。一个接口的抽象方法没有方法实现，因为这些方法可以在不同的地方被不同的类实现，而这些实现可以有不同的行为。

接口就是特殊的抽象类，即所有的方法都是抽象方法的抽象类就是 Java中的接口（interface）。

## 接口的基本格式

```java 
[修饰符] interface 接口名 [extends 父类名列表] {
    [public] [static] [final] 常量 ;
    [public] [abstract] 方法 ;
}
```

- 修饰符：可选，用于指定接口的访问权限，可选值为public。即使省略，也依然是public。
- 接口名：必选参数，用于指定接口的名称，接口名必须是合法的Java标识符：一般情况下，要求首字母大写。
- extends 父接口名列表：可选参数，用于指定要定义的接口继承于哪个父接口。当使用`extends`关键字时，父接口名为必选参数。父接口可以存在多个，用逗号隔开。
- 方法：接口中的方法只有定义而没有被实现。

## 接口的特点

- 一种特殊的抽象类，`abstract`可以省略
- 接口中没有变量，只能由`public static final`修饰的静态常量。三个修饰符可以省略
- 接口中所有的方法都是抽象方法，默认都是`public`权限

```java
public interface User {
    public static final int TYPE = 1;
    // 只有定义，没有实现
    public int addUser(String name,String password); 
    public User addUser(User user);
    public void land();
}
```

## 类实现接口

接口的实现可以实现一对多

```java
public class UserImpl implements User, [xxxxx,xxxx,...] {
    // 这里实现了 User 接口，下面必须是方法的实现
    public int addUser(String name,String password) {
        xxxx   
    }
    public User addUser(User user) {
        xxx   
    }
    public abstract void land() {
        xxx   
    }
}
```

类实现接口的特点：

- 类实现接口，本质上与类继承类相似，区别在于类最多只能继承一个类，即单继承，而一个类却可以同时实现多个接口，多个接口间用逗号隔开即可。实现类需要重写所有接口中的所有抽象方法，否则该类也必须声明为抽象类。
- 接口是抽象的，接口中没有任何具体方法和变量, 所以接口不能进行实例化。接口定义的是多个类都要实现的操作，即“what to do”。类可以实现接口，从而重写接口中的方法，实现“how to do'。

## 接口继承接口

- Java 接口继承接口原则
  - Java 接口可以继承多个接口
  - 接口继承接口依然使用关键字`extends`，不要错用 `implements`

- Java 接口继承接口形式
  - `interface3 extends interface1, interface2 .....` 

### 接口继承与类继承

- 接口继承与类继承对比：Java类的继承是单一继承，Java接口的继承是多重继承。
- 接口可实现多继承原因分析
  - 不允许类多重继承的主要原因是，如果A同时继承B和C，而B和C同时有一个仿法，A无法确定该继承哪一个。
  - 接口全都是抽象方法继承谁都可以，所以接口可继承多个接口

## 接口与抽象类区别

|          | abstract class   | interface      |
| -------- | ---------------- | -------------- |
| 属性     | 不用限制         | 静态常量       |
| 构造方法 | 可有可无         | 没有           |
| 普通方法 | 可以没有具体方法 | 必须是抽象方法 |
| 子类     | 单一继承         | 多重实现       |



## 接口的作用 与 面向接口编程

### 接口的作用

接口是设计层的概念，由设计师实现，将定义与实现分离。程序员实现接口，实现具体方法

常见的类设计结构

![](https://s1.ax1x.com/2020/07/27/aFbZlV.png)

### 面向接口编程

面向接口编程和面向对象编程并不是平级的，它并不是比面向对象编程更先进的一种独立的编程思想，而是附属于面向对象思想体系，属于其一部分。或者说，它是面向对象编程体系中的思想精髓之一。

面向接口编程的意思是指在面向对象的系统中所有的类或者模块之间的交互是由接口完成的。

# OOP 概念总结

## OOP三大特征

1. 封装
2. 继承
3. 多态

## 封装（安全性）

1. 借助`private`修饰符去修饰属性，让属性私有化，保护属性的值的安全性
2. 借助`public`修饰符的方法去为私有属性提供 属性值的设置和获取 => `getter`和`setter`

## 继承（复用性）

> 当分析发现了很多类出现了共同的属性和方法，而且使用频率很高，使用继承

1. 把相同的方法和属性抽象到父类，让子类继承并获取属性和方法
2. 方法的重写：当父类的方法无法满足子类的使用，子类能够加以改造
3. 重写特点：重写发生在子父类关系中，名字相同，参数列表相同，返回值相同，访问权限修饰符可以不同
4. 抽象方法：当父类中的方法无法诠释，就声明为抽象方法，必须被子类重写（除非子类是抽象类）

## 重载与重写

**重载**

1. 发生同一个类中
2. 名字相同
3. 参数列表不完全相同
4. 返回值相同
5. 访问权限修饰符相同

**重写**

1. 发生在父子类中
2. 名字相同
3. 参数列表相同
4. 返回值相同
5. 访问权限符不同

## 多态（增强程序的多样性）

**多态的前提**

1. 有继承
2. 有子类对象获取父类引用
3. 方法必须重写

**接口实现：**

1. 有实现类对象获取接口的引用
2. 有方法的重写（强制的）

## 接口与抽象类

接口不是类，所以没有构造方法，属性全为常量，方法全为抽象方法

**抽象类和接口的区别：**

1. 抽象类（类的模板）
   - 有构造方法，不能实例化（给子类使用）
   - 属性可以是变量，也可以是常量
   - 单一继承
   - 方法可以为抽象方法，可以为普通方法

2. 接口（方法的模板）
   - 不是类，所以没有构造方法
   - 属性全为常量
   - 方法均为抽象方法
   - 一个类可以继承多个接口