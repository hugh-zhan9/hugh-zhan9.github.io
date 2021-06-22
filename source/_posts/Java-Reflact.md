---
title: 反射
tags: Java
categories: Java
date: 2020-06-15 20:00:28



---



反射是一种保证程序在运行期间可以拿到一个对象的所有信息的机制，也是后期框架中应用到的重要基本思想之一。

<!--more-->

首先需要了解两个概念：

- **编译期**：是指将源码交给编译器编译成计算机可以执行的文件的过程。编译器相当于只是做了一些翻译的功能，并没有把代码放在内存中跑起来，而只是把代码当成文本进行操作，比如检查错误。
- **运行期**：把编译后的文件交给计算机执行，直到程序运行结束。

Java反射机制保证了程序在运行状态中，对于任意一个类，程序都能知道这个类所有的属性和方法；对于任意一个对象，都能调用它的任意方法和属性；这种动态获取信息以及动态调用对象方法的功能称为Java语言的反射机制。

Java的反射机制可以操作（读写）字节码文件。

反射机制下相关的重要的类：

`java.lang.Class`：代表整个字节码，代表一个类型

`java.lang.reflact.Method`：代表字节码中的方法字节码

`java.lang.Constructor`：代表字节码中的构造方法字节码

`java.lang.Field`：代表字节码中的属性字节码（静态变量和实例变量）

# Class类

除了`int`等基本类型之外，Java的其它类型都是`Class`(包括`interface`)。例如：

- `String`
- `Object`
- `Runnable`
- `Exception`
- ...

可以得出结论：`class`(包括`interface`)的本质是数据类型(`Type`)。两个无继承关系的数据类型之间无法直接赋值。

```java
Number num = new Double(123.456);
String str = new Double(123.456); //compile error!
```

`class`是由JVM在执行过程中动态加载的。JVM在每一次读取到一种`class`类型时，将其加载进内存。每加载一种`class`，JVM就为其创建一个`Class`类型的实例，并关联起来。这里的`Class`类型是一个名叫`Class`的类。长这样：

```java
public final class Class{
    private Class() {}
}
```

以`String`类为例，当JVM加载`String`类时，首先读取`String.class`文件到内存，然后，为`String`类创建一个`Class`实例并关联起来：

```java
Class cls = new Class(String);
```

这个`Class`实例是JVM内部创建的，如果我们查看JDK源码，可以发现`Class`类的构造方法是`private`，只有JVM能创建`Class`实例，我们自己的Java程序是无法创建`Class`实例的。所以，JVM持有的每个`Class`实例都指向一个数据类型（`class`或`interface`），一个`Class`实例包含了该`class`的所有完整信息。

 由于JVM为每个加载的`class`创建了对应的`Class`实例，并在实例中保存了该`class`的所有信息，包括类名、包名、父类、实现的接口、所有方法、字段等。因此，如果获取了某个`Class`实例，我们就可以通过这个`Class`实例获取到该实例对应的`class`的所有信息。**这种通过`Class`实例获取`class`信息的方法就称为反射（Reflection）。**

如何获取一个`class`的`Class`实例，有三种方法：

1. 方法一：直接通过一个`class`的静态变量`class`获取：

   ```java
   Class cls = String.class;    // Java中任意一个类都有一个class属性
   ```

2. 方法二：如果有一个实例变量，可以通过该实例变量提供的`getClass()`方法获取：

   ```java
   String str = "Hello";
   Class cls = str.getClass();  // getClass()方法是由Object类定义的
   ```

3. 方法三：如果知道一个`class`的完整类名，可以通过静态方法`Class.forName()`获取：

   ```java
   Class cls = Class.forName("java.lang.String");  // 这个方法会导致类加载，类加载时静态代码块会执行
   ```

因为`Class`实例在JVM中是唯一的，所以上述三个方法获取的`Class`实例都是同一个实例。可以用`==`比较两个`Class`实例：

```java
Class cls1 = String.class;
String str = "Hello";
Class cls2 = str.getClass();
boolean sameClass = cls1 == cls2;  //true
```

**注意：`Class`实例比较和`instanceof`的差别：**

用`instanceof`不但匹配指定类型，还匹配指定类型的子类。而`==`判断`Class`实例可以精确地判断数据类型，但不能作子类型比较。

```java
Integer n = new Integer(123);
boolean b1 = n instanceof Integer; //true
boolean b2 = n instanceof Number; //true
boolean b3 = n.getClass() == Integer.class; //true
boolean b4 = n.getClass() == Number.class; //false
```

通常情况下，我们应该用`instanceof`判断数据类型，因为面向抽象编程的时候，我们不关心具体的子类型。只有在需要精确判断一个类型是不是某个`class`的时候，我们才使用`==`判断`class`实例。

因为反射的目的是为了获得某个实例的信息。因此，当我们拿到某个`Object`实例时，我们可以通过反射获取该`Object`的`class`信息：

```java
void printObjectInfo(Object obj) {
    Class cls = obj.getClass();
}
```

要从`Class`实例获取获取的基本信息，参考下面的代码：

```java
public class Main {
    public static void main(String[] args) {
        printClassInfo("".getClass());
        printClassInfo(Runnable.class);
        printClassInfo(java.time.Month.class);
        printClassInfo(String[].class);
        printClassInfo(int.class);
    }

    static void printClassInfo(Class cls) {
        System.out.println("Class name: " + cls.getName());
        System.out.println("Simple name: " + cls.getSimpleName());
        if (cls.getPackage() != null) {
            System.out.println("Package name: " + cls.getPackage().getName());
        }
        System.out.println("is interface: " + cls.isInterface());
        System.out.println("is enum: " + cls.isEnum());
        System.out.println("is array: " + cls.isArray());
        System.out.println("is primitive: " + cls.isPrimitive());
        System.out.println("----------------------------------------");
    }
}
```

运行结果如下：

```java
Class name: java.lang.String 
Simple name: String 
Package name: java.lang 
is interface: false 
is enum: false 
is array: false 
is primitive: false 
---------------------------------------- 
Class name: java.lang.Runnable 
Simple name: Runnable 
Package name: java.lang 
is interface: true 
is enum: false 
is array: false 
is primitive: false 
---------------------------------------- 
Class name: java.time.Month 
Simple name: Month 
Package name: java.time 
is interface: false 
is enum: true 
is array: false 
is primitive: false 
---------------------------------------- 
Class name: [Ljava.lang.String; 
Simple name: String[] 
is interface: false 
is enum: false 
is array: true 
is primitive: false 
---------------------------------------- 
Class name: int 
Simple name: int 
is interface: false 
is enum: false 
is array: false 
is primitive: true 
---------------------------------------- 
```

数组（例如`String[]`）也是一种`Class`，而且不同于`String.class`，它的类名是`[Ljava.lang.String`。此外，JVM为每一种基本类型如`int`也创建了`Class`，通过`int.class`访问。如果获取到了一个`Class`实例，我们就可以通过该`Class`实例来创建对应类型的实例：

```java
// 获取String的Class实例:
Class cls = String.class;
// 创建一个String实例:
String s = (String) cls.newInstance();
```

上述代码的作用相当于`new String()`。通过`Class.newInstance()`可以创建类实例，它的局限是：只能调用`public`的无参数构造方法。带参数的构造方法，或者非`public`的构造方法都无法通过`Class.newInstance()`被调用（能使用new来创建尽量不使用这一方法）。

## 拓展

**反射机制的灵活性：**

测试程序

```java 
public class Test{
    public static void class main(String args){
        /*
        	FileReader file = new FileReader("project/ClassInfo.properties"); 
        	上面这个方法里写的是我配置文件的位置，当代码结构变化时，路径可能就不正确了
        	
        	
        	下面这种方法即使代码位置发生变动，还是可以读取到配置文件，这种写法要求：配置文件在src目录下
        	Thread.currentThread() 		当前线程对象
        	getContextClassLoader()   	线程的方法，获取当前线程的   类加载器对象
        	getResource()    		    类加载器对象的方法，当前线程的类加载器默认从类的根路径下加载资源， 参数为类的根路径为启点的相对路径
        	这种方法可以拿到src目录下文件的绝对路径
        String path = Thread.currentThread().getContextClassLoader().getResource("com/hugh/resource/ClassInfo.properties").getPath();  
        FileReader file = new FileReader(path); 
        */
        
        // 进一步改进，直接以流的形式返回
        InputStream file = Thread.currentThread().getContextClassLoaser().getResourceAsStream("com/hugh/resource/ClassInfo.properties");
        Properties pro = new Properties();
        pro.load(file);
        file.close();
        String className = pro.getProperty("ClassName");
        Class class = Class.forName(className);
        System.out.println(class);
    }
}
```

我们可以修改`ClassInfo.properties`文件中的内容，来新建不同的类的对象而不用修改Java代码。

```properties
ClassName=java.lang.Data
```

上面的类还可以更简便：

```java
 public class ResourceBundleTest{
     // java.util包下提供了一个资源绑定器，便于获取属性配置文件中的内容
     public static void mian(String[] args){
        // 资源绑定器，只能绑定xxx.properties文件，并且配置文件文件必须在类路径下，文件的拓展名也必须是properties
     	// 在写文件路径时，文件的拓展名省略
     	ResourceBundle bundle = ResourceBundle.getBundle("com/hugh/resource.ClassInfo");
     	String className =  bundle.getString("ClassName");
        System.out.println(className);
     }
 }
```

**类加载器**

类加载器（ClassLoader）是专门负责加载类的命令/工具。JDK中自带了三个类加载器：启动类加载器（父加载器），扩展类加载器（母加载器），应用类加载器。——（双亲委派机制是一个安全机制，为了保证类加载的安全性）

代码在开始执行之前，会将代码所需要的类全部加载到JVM当中。整个程序中类加载流程为：

首先启动器加载器会在`jre/lib/rt.jar`包寻找需要加载的class文件，如果启动加载器加载找不到对应的class文件，扩展类加载器会去加载`jre/lib/ext.jar`包中寻找，如果还没有找到会通过应用加载器去寻找，应用加载器专门加载`classpath`下的jar包或者class文件。



## 动态加载

JVM在执行Java程序的时候，并不是一次性把所有用到的字节码文件全部加载到内存，而是第一次需要用到时才加载。例如：

```java
// Main.java
public class Main {
    public static void main(String[] args) {
        if (args.length > 0) {
            create(args[0]);
        }
    }
    static void create(String name) {
        Person p = new Person(name);
    }
}
```

当执行`Main.java`时，由于用到了`Main`，因此，JVM首先会把`Main.class`加载到内存。然而，并不会加载`Person.class`，除非程序执行到`create()`方法，JVM发现需要加载`Person`类时，才会首次加载`Person.class`。如果没有执行`create()`方法，那么`Person.class`根本就不会被加载。

这就是JVM动态加载`class`的特性。动态加载`class`的特性对于Java程序非常重要。利用JVM动态加载`class`的特性，我们才能在运行期根据条件加载不同的实现类。



# 访问字段

对于任意一个`Object`实例，只要我们获取了它的`Class`，就可以获取它的一切信息。`Class`提供了以下几个方法来获取字段：

- `ClassName.getField(FieldName)`：根据字段名获取某个`public`的`field`（包括父类）。
- `ClassName.getDeclaredField(FieldName)`：根据字段名获取当前类的某个`field`（不包括父类）。
- `ClassName.getFields()`：获取所有`public`的`field`（包括父类）。
- `ClassName.getDeclardFields()`：获取当前类的所有`field`（不包括父类）。

```java
public class Main{
    public static void main(String[] args) throws Exception{
        // 获取Student的Class实例
        Class stdClass = Student.class;
        // 获取public字段"score"
        System.out.println(stdClass.getField("score"));
        // 获取继承的public字段"name"
        System.out.println(stdClass.getField("name"));
        // 获取private字段"grade"
        System.out.println(stdClass.getDeclaredField("grade"));
    }
}
public class Student extends Person{
    public int score;
    private int grade;
}
public class person{
    public String name;
}
```

结果如下：

````java
public int Student.score
public java.lang.String Person.name
private int Student.grade
````



一个`Field`对象包含了一个字段的所有信息：

- `getName()`：返回字段名称，如：`"name"`。
- `getType()`：返回字段类型，也是一个`Class`实例，如`String.Class`。
- `getModifiers()`：返回字段的修饰符，它返回一个`int`，`int`的值表示修饰符的个数。

------

以`Sting`类的`value`字段为例，它的定义如下：

```java
public final class String {
    private final byte[] value;
}
```

用反射获取该字段的信息：

```java
Field f = String.getDeclaredField("value");
f.getName(); // "value"
f.getType(); // class[B    表示byte[]类型
int m = f.getModifiers();
String modifiiersString = Modifier.toString(m); // private final
Modifier.isFinal(m); // true
Modifier.isPublic(m); // false
Modifier.isProtected(m); // false
Modifier.isPrivate(m); // true
Modifier.isStatic(m); // false
```

------

## 获取字段值

除了可以利用反射拿到字段的一个`Field`实例外，还可以拿到一个实例对应的该字段的值。例如：一个`Person`实例，我们可以先拿到`name`字段对应的`Field`，再获取这个实例的`name`字段的值。

```java
import java.lang.reflect.Field;
public class Main{
    public static void main(String[] args){
        Object p = new Person("Xiao Ming");
        Class c = p.getClass();
        Field f = c.getDeclaredField("name");
        Object value = f.get(p);
        System.out.println(value); //"Xiao Ming"
    }
}
class Person{
    private String name;
    public Person(String name){ //构造方法
        this.name = name;
    }
}
```

上述代码先获取`Class`实例，再获取`Field`实例，然后，用`Field.get(Object)`获取指定实例的指定字段的值。

运行代码，如果不出意外，会得到一个`IllegalAccessException`，这是因为`name`被定义为一个`private`字段，正常情况下，`Main`类无法访问`Person`类的`private`字段。要修复错误，可以将`private`改为`public`，或者，在调用`Object value = f.get(p);`前，先写一句：

```java
f.setAccessible(true);
```

调用`Field.setAccessible(true)`的意思是，别管这个字段是不是`public`，一律允许访问。可以试着加上上述语句，再运行代码，就可以打印出`private`字段的值。

正常情况下，我们总是通过`p.name`来访问`Person`的`name`字段，编译器会根据`public`、`protected`和`private`决定是否允许访问字段，这样就达到了数据封装的目的。而反射是一种非常规的用法，使用反射，首先代码非常繁琐，其次，它更多地是给工具或者底层框架来使用，目的是在不知道目标实例任何信息的情况下，获取特定字段的值。

此外，`setAccessible(true)`可能会失败。如果JVM运行期存在`SecurityManager`，那么它会根据规则进行检查，有可能阻止`setAccessible(true)`。例如，某个`SecurityManager`可能不允许对`java`和`javax`开头的`package`的类调用`setAccessible(true)`，这样可以保证JVM核心库的安全。

## 设置字段值

通过Field实例既然可以获取到指定实例的字段值，自然也可以设置字段的值。设置字段是通过`Field.set(Object, Object)`实现的，其中第一个`Object`参数是指定的实例，第二个`Object`参数是待修改的值。

```java
import java.lang.reflect.Field;
public class main{
    public static void main(String[] args){
        Person p = new Person("Xiao Ming");
        System.out.println(p.getName()); // "Xiao Ming"
        Class c = p.getClass();
        Field f = c.getDeclaredField("name");
        f.setAccessible(true);
        f.set(p, "Xiao Hong");
        System.out.println(p.getName()); // "Xiao Hong"
    }
}
class Person{
    private String name;
    public Person(String name){
        this.name = name;
    }
    public String getName(){
        return this.name;
    }
}
```

运行上述代码，打印的`name`字段从`Xiao Ming`变成了`Xiao Hong`，说明通过反射可以直接修改字段的值。同样的，修改非`public`字段，需要首先调用`setAccessible(true)`。

# 调用方法

同样的通过`Class`实例我们还可以获取所有的`Method`信息。`Class`类提供了以下几个方法来获取`Method`：

- `Method getMethod(name, Class...)`：获取某个`public`的`Method`（包括父类）。
- `Method getDeclaredMethod(name, Class...)`：获取当前类的某个`Method`（不包括父类）。
- `Method[] getMethods()`：获取所有`public`的`Method`（包括父类）。
- `Method[] getDeclareMethods()`：获取当前类的所有`Method`（不包括父类）。

```java
public class Main{
    public static void main(String[] args){
        Class stdClass = Student.class;
        // 获取public方法getScore，参数类型为String
        System.out.println(stdClass.getMethod("getScore", String.class));
        // 获取继承的public方法getName，无参数
        System.out.println(stdClass.getMethod("getName"));
        // 获取private方法getGrade，参数类型为int
        System.out.println(stdClass.getDeclaredMethod("getGrade", int.class));
    }
}
class Student extends Person{
    public int getScore(String type){
        return 99;
    }
    private int getGrade(int year){
        return 1;
    }
}
class Person{
    public String getName(){
        return "Person";
    }
}
```

执行结果：

```java
public int Student.getScore(java.lang.String)
public java.lang.String Person.getName()
private int Student.getGrade(int)
```

一个`Method`对象包含一个方法的所有信息：

- `getName()`：返回方法名称，例如：`"getScore"`。

- `getReturnType()`：返回方法返回值类型，也是一个Class实例，例如：`String.class`。

- `getParameterTypes()`：返回方法的参数类型，是一个Class数组，例如：`{String.class, int.class}`。

- `getModifiers()`：返回方法的修饰符，它是一个`int`，不同的bit表示不同的涵义。

## 调用方法

当获取到一个`Method`对象时，就可以对他进行调用。以下面代码为例：

```java
String s = "Hello world";
String r = s.substring(6); //"world"
```

如果用反射来调用`substring`方法，需要如下代码：

```java
import java.lang.reflext.Method;
public class Main{
    public static void main(String[] args){
        // 创建String对象
        String s = "Hello world";
        // 获取String substring(int)方法，参数为int
        Method m = String.class.getMethod("substring", int.class);
        // 对s对象调用该方法并获取结果给r
        String r = (string) m.invoke(s,6);
        // 打印调用结果
        System.out.println(r);
    }
}
```

注意到`substring()`有两个重载方法，我们获取的是`String substring(int)`这个方法，那么如何获取`String substring(int, int)`方法呢？



对`Method`实例调用`invoke`就相当于调用方法，`invoke`的第一个参数是对象实例，即要调用方法的对象，第二个参数是方法要传入的参数。



## 调用静态方法

如果获取到的`Method`表示一个静态方法，调用静态方法时，由于无需指定实例对象，所以`invoke`方法传入的第一个参数永远是`null`，我们以`Integer.parseInt(String)`方法为例。

```java
import java.lang.reflect.Method;
public class Main{
    public static void main(String[] args){
        // 获取Integer.parseInt(String)方法，参数String
        Method m = Integer.class.getMethod("parseInt", String.class);
        // 调用该静态方法并获取结果
        Integer n = (Integer) m.invoke(null, "123456");
        System.ou.printlln(n);
    }
}
```

## 调用非public方法

和`Field`类似，对于非`public`方法，我们虽然可以通过`Class.getDeclaredMethod()`获取方法实例，但是直接对其调用将会得到一个`IllegalAccessException`。所以我们需要通过`Method.setAccessible(true)`允许其调用。

```java
import java.lang.reflect.Method;
public class Main{
    public static void main(String[] args){
        Person p = new Person();
        Method m = p.class.getDeclaredMethod("setName", String.class);
        m.setAccessible(true);
        m.invoke(p,"Bob");
        System.out.println(p.name);
    }
}
class Person{
    String name;
    private void setName(String name){
        this.name = name;
    }
}
```

此外，`setAccessible(true)`可能会失败。如果JVM运行期存在`SecurityManager`，那么它会根据规则进行检查，有可能阻止`setAccessible(true)`。例如，某个`SecurityManager`可能不允许对`java`和`javax`开头的`package`的类调用`setAccessible(true)`，这样可以保证JVM核心库的安全。

## 多态

如果一个`Person`类定义了`hello`方法，并且它的子类`Student`重写了`hello`方法，那么，从`Person.class`获取的`Method`，作用于`Student`实例时，调用的方法到底是哪个？

```java
import java.lang.reflect.Method;
public class Main {
    public static void main(String[] args) throws Exception {
        // 获取Person的hello方法:
        Method h = Person.class.getMethod("hello");
        // 对Student实例调用hello方法:
        h.invoke(new Student());
    }
}
class Person {
    public void hello() {
        System.out.println("Person:hello");
    }
}
class Student extends Person {
    public void hello() {
        System.out.println("Student:hello");
    }
}
```

运行上述代码，发现打印出的是`Student:hello`，因此，使用反射调用方法时，仍然遵循多态原则：即总是调用实际类型的覆写方法（如果存在）。上述的反射代码：

```java
Method m = Person.class.getMethod("hello");
m.invoke(new Student());
```

实际上相当于：

```java
Person p = new Student();
p.hello();
```

# 调用构造方法

我们通常使用`new`操作符创建新的实例：`Person p = new Person();`

如果要通过反射来创建新的实例时，可以调用`Class`提供的`newInstance()`方法:

```
Person p = Person.class.newInstance();
```

`Class.newInstance()`只能调用该类的`public`无参数构造方法。如果构造方法带有参数，或者不是`public`方法就无法通过它来调用。为了调用任意的构造方法，Java儿对反射API提供了`Constructor`对象，它包含一个构造方法的所有信息，可以创建一个实例。`Constructor`对象和`Method`非常类似，不同之处仅在于它是一个构造方法，并且，调用结果总是返回实例：

```java
import java.lang.reflect.Constructor;
public class Main{
    public static void main(String[] args)throws Exception{
        // 获取构造方法Integer(int)
        Constructor cons1 = Integer.class.getConstructor(int.class);
        // 调用构造方法
        Integer n1 = (Integer) cons1.newInstance(123);
        System.out.println(n1);
        // 获取构造方法Integer(String)
        Constructor cons2 = Integer.class.getConstructor(String.class);
        Integer n2 = (Integer) cons2.newInstance("456");
        System.out.println(n2);
    }
}
```

通过Class实例获取Constructor方法如下：

- `getConstructor(Class...)`：获取某个`public`的`Constructor`。

- `getDeclaredConstructor(Class...)`：获取某个`Constructor`。

- `getConstructors()`：获取所有`public`的`Constructor`。

- `getDeclaredConstructors()`：获取所有`Constructor`。

注意`Constructor`总是当前类定义的构造方法，和父类无关，因此不存在多态的问题。

# 获取继承关系

当我们获取到某个`Class`对象时，实际上就获取到了一个类的类型：

```java
Class cls = String.class; // 获取到String的Class
```

还可以用实例的`getClass()`方法获取：

```java
String s = "";
Class cls = s.getClass(); // s是String，因此获取到String的Class
```

最后一个获取`Class`的方法是通过`Class.forName("")`，传入`Class`的**完整类名**获取：

```java
Class s = Class.forName("java.lang.String");
```

这三种方式获取的`Class`实例都是同一个实例，因为JVM对每个加载的`Class`只创建一个`Class`实例来表示它的类型。

## 获取父类的Class

有了`Class`实例，还可以获取它的父类的`Class`：

```java
public class Main{
    public static void main(String[] args) throws Exception{
        Class i = Integer.class;
        Class n = i.getSuperclass();
        System.ou.println(n);
        Class o = n.getSuperclass();
        System.out.println(o);
        System.out.println(o.getSuperclass());
    }
}
// 运行结果
class java.lang.Number
class java.lang.Object
null
```

## 获取interface

由于一个类可能实现一个或多个接口，通过`Class`我们就可以查询到实现的接口类型。例如：查询`Integer`实现的接口：

```java
import java.lang.reflect.Method;
public class Main {
    public static void main(String[] args) throws Exception{
        Class s = Integer.class;
        Class[] is = s.getInterfaces();
        for (Class i : is){
            System.out.println();
        }
    }
}
```

要特别注意：`getInterfaces()`只返回当前类直接实现的接口类型，并不包括其父类实现的接口类型：

```java
import java.lang.reflect.Method;
public class Main{
    public static void main(String[] args) throws Exception{
        Class s = Integer.class.getSuperclass();
        Class[] is = s.getInterfaces();
        for (Class i : is){
            System.out.println(i);
        }
    }
}
```

`Integer`的父类是`Number`，`Number`实现的接口是`java.io.Serializable`。

此外，对所有`interface`的`Class`调用`getSuperclass()`返回的是`null`，获取接口的父接口要用`getInterfaces()`：

```java
System.out.println(java.io.DataInputStream.class.getSuperclass()); // java.io.FilterInputStream，因为DataInputStream继承自FilterInputStream
System.out.println(java.io.Closeable.class.getSuperclass()); // null，对接口调用getSuperclass()总是返回null，获取接口的父接口要用getInterfaces()
```

如果一个类没有实现任何`interface`，那么`getInterfaces()`返回空数组。

## 继承关系

使用`instanceof`操作符判断一个实例是否是某个类型。

```java
Object n = Integer.valueOf(123)；
boolean isDouble = n instanceof Double; //false
boolean isInteger = n instanceof Integer; // true
boolean isNumber = n instanceof Number; // true
boolean isSerializable = n instanceof java.io.Serializable; //true
```

如果是两个`Class`实例，要判断一个向上转型是否成立，可以调用`isAssignableFrom()`：

```java
//Integer i = ?
Integer.class isAssignableForm(Integer.class); //true，因为Integer可以赋值给Integer
//Number n = ?
Number.class isAssignableForm(Integer.class); //true，因为Integer可以赋值给Number
// Object o = ?
Object.class.isAssignableFrom(Integer.class); // true，因为Integer可以赋值给Object
// Integer i = ?
Integer.class.isAssignableFrom(Number.class); // false，因为Number不能赋值给Integer
```

小结：

通过`Class`对象可以获取继承关系：

- `Class getSuperclass()`：获取父类类型。
- `Class[] getInterfaces()`：获取当前类实现的所有接口。

