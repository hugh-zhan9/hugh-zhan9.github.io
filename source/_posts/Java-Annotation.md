---
title: 注解
tags: Java
categories: Java
date: 2020-09-21 20:00:28
---





注解（Annotation）是在JDK1.5时引入的，它是一种特殊的“注释”，放在Java源码的类、方法、字段、参数前。

<!--more-->

和注释不同的是，注释会被编译器直接忽略，注解则会被编译器打包放入class文件中，因此，注解是一种用于做标注的“元数据”。

# 注解的作用

从JVM的角度看，注解本身对代码逻辑没有任何影响，如何使用注解完全由工具决定。

Java的注解可以分为三类：

第一类是由编译器使用的注解，例如：

- `@Override`：让编译器检查该方法是否正确地实现了覆写；
- `@SuppressWarnings`：告诉编译器忽略此处代码产生的警告。

这类注解不会被编译进入`.class`文件，它们在编译后就被编译器扔掉了。

第二类是由工具处理`.class`文件使用的注解，比如有些工具会在加载class的时候，对class做动态修改，实现一些特殊的功能。这类注解会被编译进入`.class`文件，但加载结束后并不会存在于内存中。这类注解只被一些底层库使用，一般我们不必自己处理。

第三类是在程序运行期能够读取的注解，它们在加载后一直存在于JVM中，这也是最常用的注解。例如，一个配置了`@PostConstruct`的方法会在调用构造方法后自动被调用（这是Java代码读取该注解实现的功能，JVM并不会识别该注解）。

定义一个注解时，还可以定义配置参数。配置参数可以包括：

- 所有基本类型；
- String；
- 枚举类型；
- 基本类型、String、Class以及枚举的数组。

因为配置参数必须是常量，所以，上述限制保证了注解在定义时就已经确定了每个参数的值。

注解的配置参数可以有默认值，缺少某个配置参数时将使用默认值。

此外，大部分注解会有一个名为`value`的配置参数，对此参数赋值，可以只写常量，相当于省略了value参数。

如果只写注解，相当于全部使用默认值。

举个栗子，对以下代码：

```java
public class Hello {
    @Check(min=0, max=100, value=55)
    public int n;

    @Check(value=99)
    public int p;

    @Check(99) // @Check(value=99)
    public int x;

    @Check
    public int y;
}
```

`@Check`就是一个注解。第一个`@Check(min=0, max=100, value=55)`明确定义了三个参数，第二个`@Check(value=99)`只定义了一个`value`参数，它实际上和`@Check(99)`是完全一样的。最后一个`@Check`表示所有参数都使用默认值。

# 注解的分类

## 内置注解

### @Override

```java
package java.lang;

import java.lang.annotation.*;

@Target(ElementType.METHOD)
@Retention(RetentionPolicy.SOURCE)
public @interface Override {
}
```

`@Override`注解表示子类要重写父类的对应方法。

如果方法利用此注释类型进行注解但没有重写超类方法，则编译器会生成一条错误消息。

### @Deprecated

```java
package java.lang;

import java.lang.annotation.*;

@Documented
@Retention(RetentionPolicy.RUNTIME)
public @interface Deprecated {
}
```

`@Deprecated`注解表示方法是不被建议使用的。

### @SuppressWarnings

```java
package java.lang;

import java.lang.annotation.*;
import java.lang.annotation.ElementType;
import static java.lang.annotation.ElementType.*;

@Target({TYPE, FIELD, METHOD, PARAMETER, CONSTRUCTOR, LOCAL_VARIABLE})
@Retention(RetentionPolicy.SOURCE)
public @interface SuppressWarnings {
    String[] value();
}
```

`@SuppressWarnings`注解表示抑制警告。

例如下面的代码，声明了2个未使用的变量，加上2个`@SuppressWarnings`来抑制警告。

```java
@SuppressWarnings("unused")
int a=10;
        
@SuppressWarnings({ "rawtypes", "unused" })
List list =new ArrayList();
```



## 元注解

有一些注解可以修饰其他注解，这些注解就称为元注解（`meta annotation`）。Java标准库已经定义了一些元注解，我们只需要使用元注解，通常不需要自己去编写元注解。

### @Target

`@Target`表示该注解用于什么地方，可取的值包括：

- `ElemenetType.CONSTRUCTOR`：构造器声明
- `ElemenetType.FIELD`：域声明（包括 enum 实例）
- `ElemenetType.LOCAL_VARIABLE`：局部变量声明
- `ElemenetType.METHOD`：方法声明
- `ElemenetType.PACKAGE`：包声明
- `ElemenetType.PARAMETER`：参数声明
- `ElemenetType.TYPE`：类，接口（包括注解类型）或enum声明
- `ElementType.ANNOTATION_TYPE`：注解

### @Retention

`@Retention`表示在什么级别保存该注解信息。可选的 `RetentionPolicy`参数包括：

- `RetentionPolicy.SOURCE`：注解将被编译器丢弃
- `RetentionPolicy.CLASS`：注解在class文件中可用，但会被JVM丢弃
- `RetentionPolicy.RUNTIME`：JVM将在运行期也保留注释，因此可以通过反射机制读取注解的信息。

### @Documented

`@Documented`将此注解包含在 Javadoc 中

### @Inherited

`@Inherited`允许子类继承父类中的注解

## 自定义注解

Java使用`@interface`语法来定义注解（`Annotation`），它的格式如下：

```java
public @interface Report {
    int type() default 0;
    String level() default "info";
    String value() default "";
}
```

注解的参数类似无参数方法，可以用`default`设定一个默认值（强烈推荐）。最常用的参数应当命名为`value`。

--------------------------------------------------------------

```java
import java.lang.annotation.*;

@Target(ElementType.METHOD)
@Retention(RetentionPolicy.RUNTIME)
@Documented
@Inherited
/*
 * 自定义一个注解 Test
 * 注解中含有两个元素 id 和 description
 * description 元素 有默认值 "hello anntation"
 */
public @interface Test {
    public int id();
    public String description() default "hello annotation";
}
```

 根据元注解，我们知道：

1. 这个注解可以用于方法
2. JVM运行期间该注解都有效
3. 该注解包含在 Javadoc 中
4. 该注解允许子类继承

下面看下通过注解我们能取到什么

```java
public class TestMain {  

    @Test(id = 1, description = "hello methodA")  
    public void methodA() {  
    }  
  
    @Test(id = 2)  
    public void methodB() {  
    }  
  
    @Test(id = 3, description = "last method")  
    public void methodC() {  
    }  
  
    /* 
     * 解析注解，将类被注解方法的信息打印出来 
     */  
    public static void main(String[] args) {  
        // 通过反射来获取类的所有方法
        Method[] methods = TestMain.class.getDeclaredMethods();  
        for (Method method : methods) {  
            /* 
             * 判断方法中是否有指定注解类型的注解 
             */  
            boolean hasAnnotation = method.isAnnotationPresent(Test.class);  
            if (hasAnnotation) {  
                /* 
                 * 根据注解类型返回方法的指定类型注解 
                 */  
                Test annotation = method.getAnnotation(Test.class);  
                System.out.println("Test( method = " + method.getName() + " , id = " + annotation.id() 
                        + " , description = " + annotation.description() + " )");
            }  
        }  
    }  
}
```

 上面的Demo打印的结果如下：

```
Test( method = methodA , id = 1 , description = hello methodA )
Test( method = methodB , id = 2 , description = hello annotation )
Test( method = methodC , id = 3 , description = last method )
```

 上例其实也说明了，我们一般通过反射来取`RUNTIME`保留策略的注解信息。

# 实例

目标：将实体bean保存到数据库

先来定义一个实体注解

```java
import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

@Target(ElementType.TYPE)  
@Retention(RetentionPolicy.RUNTIME)
public @interface Entity {
    String getTableName();
}
```

这个注解可用在类上，它有一个变量参数`getTableName`。

其实意义很明显，就是一个实体类对应一张数据库的表，通过`Entity`注解将类和数据库表名关联起来

那么，通过什么将类的参数和数据库表中的列关联起来呢？再来定义一个注解

```java
import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

@Target(ElementType.FIELD) 
@Retention(RetentionPolicy.RUNTIME)
public @interface Column {
    String getName();
}
```

有了`Column`注解，类里面的属性就和表中的列关联起来了。



下面来看看POJO中怎么用这两个注解：

```java
@Entity(getTableName = "user")
public class User {
    @Column(getName = "user_id")
    private String id;
    @Column(getName = "user_name")
    private String name;
    @Column(getName = "user_age")
    private int age;

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
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
}
```

通过`Entity`和`Column`注解，就将一个实体bean和一张数据库表连接起来了。很多ORM映射就是采取这种方式实现的。

 

最后，来感受一下注解给我们带来的便利，来个方法见证下：

```java
import java.lang.reflect.Field;
import java.sql.Connection;
import java.sql.PreparedStatement;

public class Session {
    public static void main(String[] args) {
        Session session = new Session();
        System.out.println(session.getInsertSql(new User()));
    }

    //在实际项目中，可以save(obj)方法来保存一个bean
    public void save(Object obj) {
        // get a connection
        //PreparedStatement pstmt = getStatement(con, obj);
        //pstmt.execute();
    }

    //得到PreparedStatement
    public PreparedStatement getStatement(Connection con, Object obj) throws Exception {
        PreparedStatement pstmt = con.prepareStatement(getInsertSql(obj));
        Class<?> c = obj.getClass();
        Field[] fs = c.getDeclaredFields();
        for (int i = 0; i < fs.length; i++) {
            fs[i].setAccessible(true);
            pstmt.setObject(i + 1, fs[i].get(obj));
        }
        return pstmt;
    }

    //insert into tableName(ziduan1,ziduan2...) values(?,?...)
    public String getInsertSql(Object obj) {
        StringBuilder s = new StringBuilder();
        s.append("insert into ");

        Class<?> c = obj.getClass();
        String tableName = c.getSimpleName();//类名，不包含包名 User
        Entity entity = (Entity) c.getAnnotation(Entity.class);
        if (entity != null) {
            tableName = entity.getTableName();
        }
        s.append(tableName).append("(");
        Field[] fs = c.getDeclaredFields();

        for (int i = 0; i < fs.length; i++) {
            String fieldName = fs[i].getName();
            Column column = fs[i].getAnnotation(Column.class);
            if (column != null) {
                fieldName = column.getName();
            }
            s = i == 0 ? s.append(fieldName) : s.append(",").append(fieldName);
        }
        s.append(") values").append(getString(fs.length));
        return s.toString();

    }

    //得到(?,?,?,...?,?)
    private String getString(int length) {
        StringBuilder s = new StringBuilder();
        s.append("(");
        for (int i = 0; i < length; i++) {
            s = i == 0 ? s.append("?") : s.append(",?");
        }
        s.append(")");
        return s.toString();
    }
}
```

