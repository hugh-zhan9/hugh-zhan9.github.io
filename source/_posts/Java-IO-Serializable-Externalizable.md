---
title: Java IO之 序列化(Serializable和Externalizable)详解
tags: Java-IO
categories: Java
date: 2020-07-19 22:22:28



---

-

<!--more-->

# 序列化的作用和用途

序列化就是为了保存对象的状态，而与之对应的反序列化则可以把保存的对象状态再读取出来。

简言之：序列化/反序列化，是Java提供一种专门用于的保存/恢复对象状态的机制。

一般在以下几种情况下会用到序列化：

- 当你想把内存中的对象保存到一个文件中或者数据库中时候
- 当你想用套接字在网络上传送对象的时候
- 当你想通过RMI传输对象的时候



# 示例

## SerialTest1

```java
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.ObjectInputStream;
import java.io.ObjectOutputStream;
import java.io.Serializable;

public class  SerialTest1 {
    private static final String TMP_FILE = ".serialtest1.txt";
    public static void main(String[] args) {
        // 将对象通过序列化保存
        testWrite();
        // 将序列化的对象读取出来
        testRead();
    }

    // 将Box对象通过序列化，保存到文件中
    private static void testWrite() {
        try {
            // 获取文件TMP_FILE对应的对象输出流
            // ObjectOutputStream中，只能写入基本数据或支持序列化的对象
            ObjectOutputStream out = new ObjectOutputStream(new FileOutputStream(TMP_FILE));
            // 创建Box对象，Box实现了Serializable序列化接口
            Box box = new Box("desk", 80, 48);
            // 将box对象写入到对象输出流out中，即相当于将对象保存到文件TMP_FILE中
            out.writeObject(box);
            // 打印Box对象
            System.out.println("testWrite() box:" + box);

            out.close();
        } catch (Exception ex) {
            ex.printStackTrace();
        }
    }

    // 从文件中读取序列化的Box对象
    private static void testRead() {
        try {
            // 获取文件TMP_FILE对应的对象输入流
            ObjectInputStream in = new ObjectInputStream(new FileInputStream(TMP_FILE));
            // 从对象输入流中读取先前保存的Box对象
            Box box = (Box) in.readObject();
            System.out.println("testRead box: " + box);
            
            in.close();
        } catch (Exception ex) {
            ex.printStackTrace();
        }
    }
}
// Box类支持序列化。因为Box实现了Serializable接口
// 实际上一个类只需要实现Serializable即可实现序列化，而不需要实现任何函数
class Box implements Serializable {
    private String name;
    private int width;
    private int height;
    

    public Box(String name, int width, int height) {
        this.name = name;
        this.width = width;
        this.height = height;
    }

    @Override
    public String toString() {
        return "[" + name + ": (" + width +", "+ height +")]"; 
    }
}
```

运行结果：

```
testWrite() box:[desk: (80, 48)]
testRead box: [desk: (80, 48)]
```

说明：

- 程序的作用就是：先将`Box`对象通过对象输出流保存到文件中，之后再通过对象输入流将文件保存的`Box`对象读取出来。
- `Box`类说明：`Box`类是我们自己定义的类，它实现了`Serialable`接口，因此它支持序列化操作。即：`Box`支持通过`ObjectOutputStream`从输入流中读取出来。
- `testWrite()`方法说明：`testWrite()`的作用就是新建一个`Box`对象，然后将该`Box`对象写入到文件中。首先，新建文件`TMP_FILE`的文件输出流对象(即`FileOutputStream`对象)，再创建该文件输出流的对象输出流(即`ObjcetOutputStream`对象)。然后新建`Box`对象，最后通过`out.writeObject(box)`将`box`对象写入到对象输出流中。实际上，相当于将`box`写入到文件`TMP_FILE`中。
- `testRead()`方法说明：`testRead()`的作用就是从文件中读出`Box`对象。首先，新建文件`TMP_FILE`的文件对象输入流(即：`FileInputStream`)，再创建文件对象输入流的对象输入流(即：`ObjectInputStream`)。然后通过`in.readObject()`从对象输入流中读取出`Box`对象。实际上，相当于从文件`TMP_FILE`中读取`Box`对象。

通过上面的示例知道：我们可以自定义类，让它支持序列化(即实现`Serializable`接口)，从而能支持对象的保存/恢复。
若要支持序列化，除了自定义实现`Serializable`接口的类之外，Java的基本类型和Java自带的实现了`Serializable`接口的类，都支持序列化。

## SerialTest2

```java
import java.io.FileInputStream;   
import java.io.FileOutputStream;   
import java.io.ObjectInputStream;   
import java.io.ObjectOutputStream;   
import java.io.Serializable;   
import java.util.Map;
import java.util.HashMap;
import java.util.Iterator;

public class SerialTest2 {
    private static final String TMP_FILE = ".SerialableTest2.txt";
        
    public static void main(String[] args) {
        testWrite();
        testRead();
    }

    private static void testWrite() {
        try {
            ObjectOutputStream out = new ObjectOutputStream(new FileOutputStream(TMP_FILE));
            out.writeBoolean(true);
            out.writeByte((byte)65);
            out.writeChar('a');
            out.writeInt(20200719);
            out.writeFloat(3.14F);  
            out.writeDouble(1.414D);
            // 写入HashMap对象
            HashMap<String, String> map = new HashMap<>();
            map.put("one", "red");
            map.put("two", "green");
            map.put("three", "blue");
            out.writeObject(map);

            out.close();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
    
    private static void testRead() {
        try {
            ObjectInputStream in = new ObjectInputStream(new FileInputStream(TMP_FILE));
            System.out.printf("boolean:%b\n" , in.readBoolean());
            System.out.printf("byte:%d\n" , (in.readByte()&0xff));
            System.out.printf("char:%c\n" , in.readChar());
            System.out.printf("int:%d\n" , in.readInt());
            System.out.printf("float:%f\n" , in.readFloat());
            System.out.printf("double:%f\n" , in.readDouble());
            // 读取HashMap对象
            HashMap map = (HashMap) in.readObject();
            Iterator iter = map.entrySet().iterator();
            while(iter.hasNext()) {
                Map.Entry entry = (Map.Entry)iter.next();
                System.out.printf("%-6s -- %s\n" , entry.getKey(), entry.getValue());
            }
            in.close();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
```

运行结果：

```j
boolean:true
byte:65
char:a
int:20200719
float:3.140000
double:1.414000
one    -- red
two    -- green
three  -- blue
```

说明：

在前面，我们提到过：若要支持序列化，除了自定义实现`Serializable`接口的类之外；Java的基本类型和Java自带的实现了`Serializable`接口的类，都支持序列化。为了验证这句话，我们看看`HashMap`是否实现了`Serializable`接口。

`HashMap`是`java.util`包中定义的类，它的接口声明如下：

```java
public class HashMap<K,V> extends AbstractMap<K,V>
    implements Map<K,V>, Cloneable, Serializable {} 
```

可以看到`HashMap`实现了`Serializable`接口所以可以实现序列化。

我们在介绍序列化定义时，说过：序列化/反序列化，是专门用于的保存/恢复对象状态的机制。
从中，我们知道：**序列化/反序列化，只支持保存/恢复对象状态，即仅支持保存/恢复类的成员变量，但不支持保存类的成员方法！**
但是，序列化是不是对类的所有的成员变量的状态都能保存呢？

答案当然是否定的！

- 序列化对`static`和`transient`变量是不会自动进行状态保存的。

  `transient`的作用就是：用`transient`声明的变量不会被自动序列化。

- 对于`Socket`，`Thread`类，不支持序列化。若实现序列化的接口中，有`Thread`成员，在对该类进行序列化操作时，编译会出错。

  这主要是基于资源分配方面的原因。如果`Socket`，`Thread`类可以被序列化，但是被反序列化之后也无法对他们进行重新的资源分配；再者，也是没有必要这样实现。

## SerialTest3

通过示例来查看“序列化对static和transient的处理。

前面的SerialTest1进行简单修改，得到源文件SerialTest3如下

```java
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.ObjectInputStream;
import java.io.ObjectOutputStream;
import java.io.Serializable;

public class  SerialTest3 {
    private static final String TMP_FILE = ".serialtest3.txt";
    public static void main(String[] args) {
        // 将对象通过序列化保存
        testWrite();
        // 将序列化的对象读取出来
        testRead();
    }

    // 将Box对象通过序列化，保存到文件中
    private static void testWrite() {
        try {
            // 获取文件TMP_FILE对应的对象输出流
            // ObjectOutputStream中，只能写入基本数据或支持序列化的对象
            ObjectOutputStream out = new ObjectOutputStream(new FileOutputStream(TMP_FILE));
            // 创建Box对象，Box实现了Serializable序列化接口
            Box box = new Box("desk", 80, 48);
            // 将box对象写入到对象输出流out中，即相当于将对象保存到文件TMP_FILE中
            out.writeObject(box);
            // 打印Box对象
            System.out.println("testWrite() box:" + box);

            out.close();
        } catch (Exception ex) {
            ex.printStackTrace();
        }
    }

    // 从文件中读取序列化的Box对象
    private static void testRead() {
        try {
            // 获取文件TMP_FILE对应的对象输入流
            ObjectInputStream in = new ObjectInputStream(new FileInputStream(TMP_FILE));
            // 从对象输入流中读取先前保存的Box对象
            Box box = (Box) in.readObject();
            System.out.println("testRead box: " + box);
            
            in.close();
        } catch (Exception ex) {
            ex.printStackTrace();
        }
    }
}
// Box类支持序列化。因为Box实现了Serializable接口
// 实际上一个类只需要实现Serializable即可实现序列化，而不需要实现任何函数
class Box implements Serializable {
    private String name;
    private static int width;
    private transient int height;
    

    public Box(String name, int width, int height) {
        this.name = name;
        this.width = width;
        this.height = height;
    }

    @Override
    public String toString() {
        return "[" + name + ": (" + width +", "+ height +") ]"; 
    }
}
```

和`SerialTest1`相比这里仅仅对`Box`类中的`width`和`height`变量的定义做了修改：

```java
private static int width;
private transient int height;
```

运行结果

```java
testWrite() box:[desk: (80, 48) ]
testRead box: [desk: (80, 48) ]
```

结果分析：

我们前面说过，序列化不对`static`和`transient`变量进行状态保存。因此，`testWrite()`中保存Box对象时，不会保存`width`和`height`的值。这点是毋庸置疑的！

但是，为什么`testRead()`中读取出来的`Box`对象的`width=80`，而`height=0`呢？

- 先说，为什么`height=0`。因为`Box`对象中`height`是`int`类型，而`int`类型的默认值是0。
- 再说，为什么`width=80`。这是因为`height`是`static`类型，而`static`类型就意味着所有的`Box`对象都共用一个`height`值；而在`testWrite()`中，我们已经将`height`初始化为80了。因此，我们通过序列化读取出来的`Box`对象的`height`值，也被就是80。

理解上面的内容之后，我们应该可以推断出下面的代码的运行结果。

## SerialTest4

```java
import java.io.FileInputStream;   
import java.io.FileOutputStream;   
import java.io.ObjectInputStream;   
import java.io.ObjectOutputStream;   
import java.io.Serializable;   

public class SerialTest4 { 
    private static final String TMP_FILE = ".serialtest4.txt";

    public static void main(String[] args) {   
        testWrite();
        testRead();
    }


    /**
     * 将Box对象通过序列化，保存到文件中
     */
    private static void testWrite() {   
        try {
            // 获取文件TMP_FILE对应的对象输出流。
            // ObjectOutputStream中，只能写入“基本数据”或“支持序列化的对象”
            ObjectOutputStream out = new ObjectOutputStream(new FileOutputStream(TMP_FILE));
            Box box = new Box("desk", 80, 48);
            out.writeObject(box);
            System.out.println("testWrite box: " + box);
            // 修改box的值
            box = new Box("room", 100, 50);

            out.close();
        } catch (Exception ex) {
            ex.printStackTrace();
        }
    }

    /**
     * 从文件中读取出“序列化的Box对象”
     */
    private static void testRead() {
        try {

            ObjectInputStream in = new ObjectInputStream(new FileInputStream(TMP_FILE));
            Box box = (Box) in.readObject();
            System.out.println("testRead  box: " + box);

            in.close();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}


class Box implements Serializable {
    private static int width;   
    private transient int height; 
    private String name;   

    public Box(String name, int width, int height) {
        this.name = name;
        this.width = width;
        this.height = height;
    }

    @Override
    public String toString() {
        return "["+name+": ("+width+", "+height+")]";
    }
}
```

`SerialTest4`相比于`SerialTest3`，在`testWrite()`中添加了一行代码`box = new Box("room", 100, 50)`

运行结果：

```
testWrite box: [desk: (80, 48)]
testRead  box: [desk: (100, 0)]
```

现在，我们更加确认序列化不对`static`和`transient`变量进行状态保存。但是，若我们想要保存`static`或`transient`变量，能不能办到呢？
当然可以！我们在类中重写两个方法`writeObject()`和`readObject()`即可。下面程序演示了如何手动保存`static`和`transient`变量。

## SerialTest5

对`SerialTest4`进行简单修改，以达到：序列化存储`static`和`transient`变量的目的。

```java
import java.io.FileInputStream;   
import java.io.FileOutputStream;   
import java.io.ObjectInputStream;   
import java.io.ObjectOutputStream;   
import java.io.Serializable;   
import java.io.IOException;   
import java.lang.ClassNotFoundException;   

public class SerialTest5 { 
    private static final String TMP_FILE = ".serialtest5.txt";

    public static void main(String[] args) {   
        testWrite();
        testRead();
    }



    // 将Box对象通过序列化，保存到文件中
    private static void testWrite() {   
        try {
            // 获取文件TMP_FILE对应的对象输出流。
            // ObjectOutputStream中，只能写入“基本数据”或“支持序列化的对象”
            ObjectOutputStream out = new ObjectOutputStream(new FileOutputStream(TMP_FILE));
            Box box = new Box("desk", 80, 48);
            out.writeObject(box);
            System.out.println("testWrite box: " + box);
            box = new Box("room", 100, 50);

            out.close();
        } catch (Exception ex) {
            ex.printStackTrace();
        }
    }


    // 从文件中读取出“序列化的Box对象”
    private static void testRead() {
        try {
            // 获取文件TMP_FILE对应的对象输入流。
            ObjectInputStream in = new ObjectInputStream(new FileInputStream(TMP_FILE));
            Box box = (Box) in.readObject();
            System.out.println("testRead  box: " + box);

            in.close();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}


/**
 * Box类“支持序列化”。因为Box实现了Serializable接口。
 *
 * 实际上，一个类只需要实现Serializable即可实现序列化，而不需要实现任何函数。
 */
class Box implements Serializable {
    private static int width;   
    private transient int height; 
    private String name;   

    public Box(String name, int width, int height) {
        this.name = name;
        this.width = width;
        this.height = height;
    }

    private void writeObject(ObjectOutputStream out) throws IOException{ 
        out.defaultWriteObject();//使定制的writeObject()方法可以利用自动序列化中内置的逻辑。 
        out.writeInt(height); 
        out.writeInt(width); 
        //System.out.println("Box--writeObject width="+width+", height="+height);
    }

    private void readObject(ObjectInputStream in) throws IOException,ClassNotFoundException{ 
        in.defaultReadObject();//defaultReadObject()补充自动序列化 
        height = in.readInt(); 
        width = in.readInt(); 
        //System.out.println("Box---readObject width="+width+", height="+height);
    }

    @Override
    public String toString() {
        return "["+name+": ("+width+", "+height+")]";
    }
}
```

运行结果：

```
testWrite box: [desk: (80, 48)]
testRead  box: [desk: (80, 48)]
```

程序说明：

序列化不会自动保存`static`和`transient`变量，因此我们若要保存它们，则需要通过`writeObject()`和`readObject()`去手动读写。

- 通过`writeObject()`方法，写入要保存的变量。`writeObject()`的原始定义是在`ObjectOutputStream.java`中，我们按照如下示例覆盖即可：

```java
private void writeObject(ObjectOutputStream out) throws IOException{ 
    out.defaultWriteObject();// 使定制的writeObject()方法可以利用自动序列化中内置的逻辑。 
    out.writeInt(ival);      // 若要保存int类型的值，则使用writeInt()
    out.writeObject(obj);    // 若要保存Object对象，则使用writeObject()
}
```

- 通过`readObject()`方法，读取之前保存的变量。`readObject()`的原始定义是在`ObjectInputStream.java`中，我们按照如下示例覆盖即可：

```java
private void readObject(ObjectInputStream in) throws IOException,ClassNotFoundException{ 
    in.defaultReadObject();       // 使定制的readObject()方法可以利用自动序列化中内置的逻辑。 
    int ival = in.readInt();      // 若要读取int类型的值，则使用readInt()
    Object obj = in.readObject(); // 若要读取Object对象，则使用readObject()
}
```

## SerialTest6

接下来，我们来研究“对于Socket, Thread类，不支持序列化。还是通过示例来查看。

我们修改`SerialTest5`，在`Box`类中添加一个`Thread`成员

```java
import java.io.FileInputStream;   
import java.io.FileOutputStream;   
import java.io.ObjectInputStream;   
import java.io.ObjectOutputStream;   
import java.io.Serializable;   
import java.io.IOException;   
import java.lang.ClassNotFoundException;   

public class SerialTest5 { 
    private static final String TMP_FILE = ".serialtest5.txt";

    public static void main(String[] args) {   
        testWrite();
        testRead();
    }



    // 将Box对象通过序列化，保存到文件中
    private static void testWrite() {   
        try {
            // 获取文件TMP_FILE对应的对象输出流。
            // ObjectOutputStream中，只能写入“基本数据”或“支持序列化的对象”
            ObjectOutputStream out = new ObjectOutputStream(new FileOutputStream(TMP_FILE));
            Box box = new Box("desk", 80, 48);
            out.writeObject(box);
            System.out.println("testWrite box: " + box);
            box = new Box("room", 100, 50);

            out.close();
        } catch (Exception ex) {
            ex.printStackTrace();
        }
    }


    // 从文件中读取出“序列化的Box对象”
    private static void testRead() {
        try {
            // 获取文件TMP_FILE对应的对象输入流。
            ObjectInputStream in = new ObjectInputStream(new FileInputStream(TMP_FILE));
            Box box = (Box) in.readObject();
            System.out.println("testRead  box: " + box);

            in.close();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}


/**
 * Box类“支持序列化”。因为Box实现了Serializable接口。
 *
 * 实际上，一个类只需要实现Serializable即可实现序列化，而不需要实现任何函数。
 */
class Box implements Serializable {
    private static int width;   
    private transient int height; 
    private String name;   
    private Thread thread = new Thread() {
        @Override
        public void run() {
            System.out.println("Serializable thread");
        }
    };

    public Box(String name, int width, int height) {
        this.name = name;
        this.width = width;
        this.height = height;
    }

    private void writeObject(ObjectOutputStream out) throws IOException{ 
        out.defaultWriteObject();//使定制的writeObject()方法可以利用自动序列化中内置的逻辑。 
        out.writeInt(height); 
        out.writeInt(width); 
        //System.out.println("Box--writeObject width="+width+", height="+height);
    }

    private void readObject(ObjectInputStream in) throws IOException,ClassNotFoundException{ 
        in.defaultReadObject();//defaultReadObject()补充自动序列化 
        height = in.readInt(); 
        width = in.readInt(); 
        //System.out.println("Box---readObject width="+width+", height="+height);
    }

    @Override
    public String toString() {
        return "["+name+": ("+width+", "+height+")]";
    }
}
```

结果是编译报错。

事实证明不能对`Thread`进行序列化。若希望程序能编译通过，可以对`Thread`变量添加`static`或`transient`修饰即可。即：

```java
private transient Thread thread = new Thread() {
	@Override
     public void run() {
     	System.out.println("Serializable thread");
     }
};
```

至此，是关于Serializable接口实现序列化的所有内容。但是，实现序列化，除了`Serializable`之外，还有其它的方式，就是通过实现`Externalizable`来实现序列化。

# Externalizable和完全定制序列化过程

如果一个类要完全自己的序列化，则实现`Externalizable`接口，而不是`Serializable`接口。

`Externalizable`接口定义包括两个方法`writeExternalizable()`和`readExternal()`。需要注意的是：声明类实现`Externalizable`接口会有重大的安全风险。`writeExternalizable()`和`readExternal()`方法声明为`public`，恶意类可以用这些方法读取和写入对象数据。如果对象包含敏感信息，则要格外小心。

修改之前`SerialTest1`的测试程序，将其中`Box`的实现由`Serializable`接口改为`Externalizable`接口

```java
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.ObjectInputStream;
import java.io.ObjectOutputStream;
import java.io.Serializable;

public class  SerialTest1 {
    private static final String TMP_FILE = ".serialtest1.txt";
    public static void main(String[] args) {
        // 将对象通过序列化保存
        testWrite();
        // 将序列化的对象读取出来
        testRead();
    }

    // 将Box对象通过序列化，保存到文件中
    private static void testWrite() {
        try {
            // 获取文件TMP_FILE对应的对象输出流
            // ObjectOutputStream中，只能写入基本数据或支持序列化的对象
            ObjectOutputStream out = new ObjectOutputStream(new FileOutputStream(TMP_FILE));
            // 创建Box对象，Box实现了Serializable序列化接口
            Box box = new Box("desk", 80, 48);
            // 将box对象写入到对象输出流out中，即相当于将对象保存到文件TMP_FILE中
            out.writeObject(box);
            // 打印Box对象
            System.out.println("testWrite() box:" + box);

            out.close();
        } catch (Exception ex) {
            ex.printStackTrace();
        }
    }

    // 从文件中读取序列化的Box对象
    private static void testRead() {
        try {
            // 获取文件TMP_FILE对应的对象输入流
            ObjectInputStream in = new ObjectInputStream(new FileInputStream(TMP_FILE));
            // 从对象输入流中读取先前保存的Box对象
            Box box = (Box) in.readObject();
            System.out.println("testRead box: " + box);
            
            in.close();
        } catch (Exception ex) {
            ex.printStackTrace();
        }
    }
}
// Box类支持序列化。因为Box实现了Serializable接口
// 实际上一个类只需要实现Serializable即可实现序列化，而不需要实现任何函数
class Box implements Externalizable {
    private String name;
    private int width;
    private int height;
    
    public Box() {
    }

    public Box(String name, int width, int height) {
        this.name = name;
        this.width = width;
        this.height = height;
    }
    
    @Override
    public void writeExternal(ObjectOutput out) throws IOException {
    }
    
    @Override
    public void readExternal(ObjectInput in) throws IOException, ClassNotFoundException {
    }

    @Override
    public String toString() {
        return "[" + name + ": (" + width +", "+ height +")]"; 
    }
}
```

运行结果：

```
testWrite box: [desk: (80, 48)]
testRead  box: [null: (0, 0)]
```

说明：

- 实现`Externalizable`接口的类，不会像实现`Serializable`接口那样，会自动将数据保存。
- 实现`Externalizable`接口的类，必须实现`writeExternal()`和`readExternal()`接口！
  否则，程序无法正常编译！
- 实现`Externalizable`接口的类，必须定义不带参数的构造函数！
  否则，程序无法正常编译！
- `writeExternal()`和`readExternal()`的方法都是`public`的，不是非常安全！

接着，修改上面的程序实现`Box`类中的`writeExternal()`和`readExternal()`接口！

```java
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.ObjectInputStream;
import java.io.ObjectOutputStream;
import java.io.Serializable;

public class  SerialTest1 {
    private static final String TMP_FILE = ".serialtest1.txt";
    public static void main(String[] args) {
        // 将对象通过序列化保存
        testWrite();
        // 将序列化的对象读取出来
        testRead();
    }

    // 将Box对象通过序列化，保存到文件中
    private static void testWrite() {
        try {
            // 获取文件TMP_FILE对应的对象输出流
            // ObjectOutputStream中，只能写入基本数据或支持序列化的对象
            ObjectOutputStream out = new ObjectOutputStream(new FileOutputStream(TMP_FILE));
            // 创建Box对象，Box实现了Serializable序列化接口
            Box box = new Box("desk", 80, 48);
            // 将box对象写入到对象输出流out中，即相当于将对象保存到文件TMP_FILE中
            out.writeObject(box);
            // 打印Box对象
            System.out.println("testWrite() box:" + box);

            out.close();
        } catch (Exception ex) {
            ex.printStackTrace();
        }
    }

    // 从文件中读取序列化的Box对象
    private static void testRead() {
        try {
            // 获取文件TMP_FILE对应的对象输入流
            ObjectInputStream in = new ObjectInputStream(new FileInputStream(TMP_FILE));
            // 从对象输入流中读取先前保存的Box对象
            Box box = (Box) in.readObject();
            System.out.println("testRead box: " + box);
            
            in.close();
        } catch (Exception ex) {
            ex.printStackTrace();
        }
    }
}
// Box类支持序列化。因为Box实现了Serializable接口
// 实际上一个类只需要实现Serializable即可实现序列化，而不需要实现任何函数
class Box implements Externalizable {
    private int width;   
    private int height; 
    private String name;   

    public Box() {
    }

    public Box(String name, int width, int height) {
        this.name = name;
        this.width = width;
        this.height = height;
    }

    @Override
    public void writeExternal(ObjectOutput out) throws IOException {
        out.writeObject(name);
        out.writeInt(width);
        out.writeInt(height);
    }

    @Override
    public void readExternal(ObjectInput in) throws IOException, ClassNotFoundException {
        name = (String) in.readObject();
        width = in.readInt();
        height = in.readInt();
    }

    @Override
    public String toString() {
        return "["+name+": ("+width+", "+height+")]";
    }
}
```

运行结果如下：

```
testWrite box: [desk: (80, 48)]
testRead  box: [desk: (80, 48)]
```

