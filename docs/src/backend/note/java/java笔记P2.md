## File类

### File类概述和构造方法

- File类介绍

  - 它是文件和目录路径名的抽象表示
  - 文件和目录是可以通过File封装成对象的
  - 对于File而言，其封装的并不是一个真正存在的文件，仅仅是一个路径名而已。它可以是存在的，也可以是不存在的。将来是要通过具体的操作把这个路径的内容转换为具体存在的

- File类的构造方法

  | 方法名                              | 说明                                                        |
  | ----------------------------------- | ----------------------------------------------------------- |
  | File(String   pathname)             | 通过将给定的路径名字符串转换为抽象路径名来创建新的 File实例 |
  | File(String   parent, String child) | 从父路径名字符串和子路径名字符串创建新的   File实例         |
  | File(File   parent, String child)   | 从父抽象路径名和子路径名字符串创建新的   File实例           |

```java
File f1 = new File("E:\\test\\java.txt");
File f2 = new File("E:\\test", "java.txt");
File f3 = new File("E:\\test");
File f4 = new File(f3,"java.txt");
```



### File类创建功能

方法分类

| 方法名                         | 说明                                                         |
| ------------------------------ | ------------------------------------------------------------ |
| public boolean createNewFile() | 当具有该名称的文件不存在时，创建一个由该抽象路径名命名的新空文件 |
| public boolean mkdir()         | 创建由此抽象路径名命名的目录                                 |
| public boolean mkdirs()        | 创建由此抽象路径名命名的目录，包括任何必需但不存在的父目录   |



### File类判断和获取功能

判断功能

| 方法名                         | 说明                                 |
| ------------------------------ | ------------------------------------ |
| public   boolean isDirectory() | 测试此抽象路径名表示的File是否为目录 |
| public   boolean isFile()      | 测试此抽象路径名表示的File是否为文件 |
| public   boolean   exists()    | 测试此抽象路径名表示的File是否存在   |



获取功能

| 方法名                            | 说明                                                     |
| --------------------------------- | -------------------------------------------------------- |
| public   String getAbsolutePath() | 返回此抽象路径名的绝对路径名字符串                       |
| public   String getPath()         | 将此抽象路径名转换为路径名字符串                         |
| public   String getName()         | 返回由此抽象路径名表示的文件或目录的名称                 |
| public   String[] list()          | 返回此抽象路径名表示的目录中的文件和目录的名称字符串数组 |
| public   File[] listFiles()       | 返回此抽象路径名表示的目录中的文件和目录的File对象数组   |

```java
// 获取文件名
String[] strArray = f2.list();
for(String str : strArray) {
   System.out.println(str);
}
// 获取文件对象
File[] fileArray = f2.listFiles();
for(File file : fileArray) {
    if(file.isFile()) {
        sout(file.getName());
    }
}
```



### File类删除功能

方法分类

| 方法名                    | 说明                               |
| ------------------------- | ---------------------------------- |
| public boolean   delete() | 删除由此抽象路径名表示的文件或目录 |



## IO流

###  IO流概述和分类

- IO流介绍
  - IO：输入/输出(Input/Output)
  - 流：是一种抽象概念，是对数据传输的总称。也就是说数据在设备间的传输称为流，流的本质是数据传输
  - IO流就是用来处理设备间数据传输问题的。常见的应用：文件复制；文件上传；文件下载
- IO流的分类
  - 按照数据的流向
    - 输入流：读数据
    - 输出流：写数据
  - 按照数据类型来分
    - 字节流
      - 字节输入流
      - 字节输出流
    - 字符流
      - 字符输入流
      - 字符输出流
- IO流的使用场景
  - 如果操作的是纯文本文件，优先使用字符流
  - 如果操作的是图片、视频、音频等二进制文件。优先使用字节流
  - 如果不确定文件类型，优先使用字节流。字节流是万能的流

### 字节流写数据

- 字节流抽象基类

  - InputStream：这个抽象类是表示字节输入流的所有类的超类
  - OutputStream：这个抽象类是表示字节输出流的所有类的超类
  - 子类名特点：子类名称都是以其父类名作为子类名的后缀
- 字节输出流

  - FileOutputStream(String name)：创建文件输出流以指定的名称写入文件
- 使用字节输出流写数据的步骤

  - 创建字节输出流对象(调用系统功能创建了文件，创建字节输出流对象，让字节输出流对象指向文件)
  - 调用字节输出流对象的写数据方法
  - 释放资源(关闭此文件输出流并释放与此流相关联的任何系统资源)

| 方法                          | 功能                                               |
| ----------------------------- | -------------------------------------------------- |
| FileOutputStream(String name) | 创建文件输出流以指定的名称写入文件                 |
| void close()                  | 关闭此文件输出流并释放与此流相关联的任何系统资源。 |
| void write(int b)             | 将指定的字节写入此文件输出流                       |

```java
FileOutputStream fos = new FileOutputStream();
fos.wirte(97);
fos.close();
```



### 字节流写数据的三种方式

写数据的方法分类

| 方法名                                   | 说明                                                         |
| ---------------------------------------- | ------------------------------------------------------------ |
| void   write(int b)                      | 将指定的字节写入此文件输出流   一次写一个字节数据            |
| void   write(byte[] b)                   | 将 b.length字节从指定的字节数组写入此文件输出流   一次写一个字节数组数据 |
| void   write(byte[] b, int off, int len) | 将 len字节从指定的字节数组开始，从偏移量off开始写入此文件输出流   一次写一个字节数组的部分数据 |



### 字节流写数据的两个小问题

- 字节流写数据如何实现换行

  - windows:\r\n
  - linux:\n
  - mac:\r

- 字节流写数据如何实现追加写入

  - public FileOutputStream(String name,boolean append)
  - 创建文件输出流以指定的名称写入文件。如果第二个参数为true ，则字节将写入文件的末尾而不是开头

```java
FileOutputStream fos = new FileOutputStream("myByteStream\\fos.txt",true);
// 写数据
for (int i = 0; i < 10; i++) {
    fos.write("hello".getBytes());
	fos.write("\r\n".getBytes());
}
fos.close();
```

 

### 字节流读数据(一次读一个字节数据)

- 字节输入流

  - FileInputStream(String name)：通过打开与实际文件的连接来创建一个FileInputStream ，该文件由文件系统中的路径名name命名

- 字节输入流读取数据的步骤

  - 创建字节输入流对象
  - 调用字节输入流对象的读数据方法
  - 释放资源

| 方法                         | 功能                                               |
| ---------------------------- | -------------------------------------------------- |
| FileInputStream(String name) | 创建字节输入流对象                                 |
| void close()                 | 关闭此文件输出流并释放与此流相关联的任何系统资源。 |
| void read()                  | 读数据                                             |

```java
int by;
while ((by=fis.read())!=-1) {
   System.out.print((char)by);
}
fis.close();
```



### 字节流读数据(一次读一个字节数组数据)

- 一次读一个字节数组的方法

  - public int read(byte[] b)：从输入流读取最多b.length个字节的数据
  - 返回的是读入缓冲区的总字节数,也就是实际的读取字节个数

```java
byte[] bys = new byte[1024]; // 1024及其整数倍
int len;
while ((len=fis.read(bys))!=-1) {
   System.out.print(new String(bys,0,len));
}
// 释放资源
fis.close();
```



## 字节缓冲流

### 字节缓冲流构造方法

- 字节缓冲流介绍

  - lBufferOutputStream：该类实现缓冲输出流。 通过设置这样的输出流，应用程序可以向底层输出流写入字节，而不必为写入的每个字节导致底层系统的调用
  - lBufferedInputStream：创建BufferedInputStream将创建一个内部缓冲区数组。 当从流中读取或跳过字节时，内部缓冲区将根据需要从所包含的输入流中重新填充，一次很多字节

| 方法名                                 | 说明                   |
| -------------------------------------- | ---------------------- |
| BufferedOutputStream(OutputStream out) | 创建字节缓冲输出流对象 |
| BufferedInputStream(InputStream in)    | 创建字节缓冲输入流对象 |

```java
BufferedOutputStream bos = new BufferedOutputStream(new	FileOutputStream("myByteStream\\bos.txt"));
// 写数据
bos.write("hello\r\n".getBytes());
bos.write("world\r\n".getBytes());
// 释放资源
bos.close();

byte[] bys = new byte[1024];
int len;
while ((len=fis.read(bys))!=-1) {
   fos.write(bys,0,len);
}
```





## 字符流

### 为什么会出现字符流

- 字符流的介绍

  由于字节流操作中文不是特别的方便，所以Java就提供字符流

  字符流 = 字节流 + 编码表

- 中文的字节存储方式

  用字节流复制文本文件时，文本文件也会有中文，但是没有问题，原因是最终底层操作会自动进行字节拼接成中文，如何识别是中文的呢？

  汉字在存储的时候，无论选择哪种编码存储，第一个字节都是负数



### 字符串中的编码解码问题

- 相关方法

  | 方法名                                   | 说明                                               |
  | ---------------------------------------- | -------------------------------------------------- |
  | byte[] getBytes()                        | 使用平台的默认字符集将该 String编码为一系列字节    |
  | byte[] getBytes(String charsetName)      | 使用指定的字符集将该 String编码为一系列字节        |
  | String(byte[] bytes)                     | 使用平台的默认字符集解码指定的字节数组来创建字符串 |
  | String(byte[] bytes, String charsetName) | 通过指定的字符集解码指定的字节数组来创建字符串     |

```java
// 定义一个字符串
String s = "中国";

byte[] bys = s.getBytes(); //[-28, -72, -83, -27, -101, -67]
byte[] bys = s.getBytes("UTF-8"); //[-28, -72, -83, -27, -101, -67]
byte[] bys = s.getBytes("GBK"); //[-42, -48, -71, -6]
System.out.println(Arrays.toString(bys));

String ss = new String(bys);
String ss = new String(bys,"UTF-8");
String ss = new String(bys,"GBK");
System.out.println(ss);
```



### 字符流中的编码解码问题

- 字符流中和编码解码问题相关的两个类

  - InputStreamReader：是从字节流到字符流的桥梁

    ​	它读取字节，并使用指定的编码将其解码为字符

    ​	它使用的字符集可以由名称指定，也可以被明确指定，或者可以接受平台的默认字符集

  - OutputStreamWriter：是从字符流到字节流的桥梁

    ​	是从字符流到字节流的桥梁，使用指定的编码将写入的字符编码为字节

    ​	它使用的字符集可以由名称指定，也可以被明确指定，或者可以接受平台的默认字符集

- 构造方法

  | 方法名                                              | 说明                                         |
  | --------------------------------------------------- | -------------------------------------------- |
  | InputStreamReader(InputStream in)                   | 使用默认字符编码创建InputStreamReader对象    |
  | InputStreamReader(InputStream in,String chatset)    | 使用指定的字符编码创建InputStreamReader对象  |
  | OutputStreamWriter(OutputStream out)                | 使用默认字符编码创建OutputStreamWriter对象   |
  | OutputStreamWriter(OutputStream out,String charset) | 使用指定的字符编码创建OutputStreamWriter对象 |

```java
OutputStreamWriter osw = new OutputStreamWriter(new                 FileOutputStream("myCharStream\\osw.txt"),"GBK");
osw.write("中国");
osw.close();

InputStreamReader isr = new InputStreamReader(new                   FileInputStream("myCharStream\\osw.txt"),"GBK");
//一次读取一个字符数据
int ch;
while ((ch=isr.read())!=-1) {
	System.out.print((char)ch);
}
isr.close();
```



### 字符流写数据的5种方式

- 方法介绍

  | 方法名                                    | 说明                 |
  | ----------------------------------------- | -------------------- |
  | void   write(int c)                       | 写一个字符           |
  | void   write(char[] cbuf)                 | 写入一个字符数组     |
  | void write(char[] cbuf, int off, int len) | 写入字符数组的一部分 |
  | void write(String str)                    | 写一个字符串         |
  | void write(String str, int off, int len)  | 写一个字符串的一部分 |

- 刷新和关闭的方法

  | 方法名  | 说明                                                         |
  | ------- | ------------------------------------------------------------ |
  | flush() | 刷新流，之后还可以继续写数据                                 |
  | close() | 关闭流，释放资源，但是在关闭之前会先刷新流。一旦关闭，就不能再写数据 |



### 字符流读数据的2种方式

- 方法介绍

  | 方法名                | 说明                   |
  | --------------------- | ---------------------- |
  | int read()            | 一次读一个字符数据     |
  | int read(char[] cbuf) | 一次读一个字符数组数据 |



### 字符缓冲流

- 字符缓冲流介绍

  - BufferedWriter：将文本写入字符输出流，缓冲字符，以提供单个字符，数组和字符串的高效写入，可以指定缓冲区大小，或者可以接受默认大小。默认值足够大，可用于大多数用途

  - BufferedReader：从字符输入流读取文本，缓冲字符，以提供字符，数组和行的高效读取，可以指定缓冲区大小，或者可以使用默认大小。 默认值足够大，可用于大多数用途

- 构造方法

  | 方法名                     | 说明                   |
  | -------------------------- | ---------------------- |
  | BufferedWriter(Writer out) | 创建字符缓冲输出流对象 |
  | BufferedReader(Reader in)  | 创建字符缓冲输入流对象 |

```java
// BufferedWriter(Writer out)
// 根据数据源创建字符输出流对象
BufferedWriter bw = new BufferedWriter(new                                                           FileWriter("myCharStream\\bw.txt"));
bw.write("hello\r\n");
bw.write("world\r\n");
bw.close();
```



### 字符缓冲流特有功能

- 方法介绍

  BufferedWriter：

  | 方法名         | 说明                                         |
  | -------------- | -------------------------------------------- |
  | void newLine() | 写一行行分隔符，行分隔符字符串由系统属性定义 |

  BufferedReader:

  | 方法名            | 说明                                                         |
  | ----------------- | ------------------------------------------------------------ |
  | String readLine() | 读一行文字。 结果包含行的内容的字符串，不包括任何行终止字符如果流的结尾已经到达，则为null |

```java
// 写数据
for (int i = 0; i < 10; i++) {
    bw.write("hello" + i);
    //bw.write("\r\n");
    bw.newLine();
    bw.flush();
}

// 读数据
String line;
    while ((line=br.readLine())!=null) {
    System.out.println(line);
}
br.close();
```



## 复制文件异常

```java
	// JDK9的改进方案
    private static void method4() throws IOException {
        FileReader fr = new FileReader("fr.txt");
        FileWriter fw = new FileWriter("fw.txt");
        try(fr;fw){
            char[] chs = new char[1024];
            int len;
            while ((len = fr.read()) != -1) {
                fw.write(chs, 0, len);
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
```



## IO特殊操作流

### 标准输入流

- System类中有两个静态的成员变量

  - public static final InputStream in：标准输入流。通常该流对应于键盘输入或由主机环境或用户指定的另一个输入源
  - public static final PrintStream out：标准输出流。通常该流对应于显示输出或由主机环境或用户指定的另一个输出目标

- 自己实现键盘录入数据

  ```java
  public class SystemInDemo {
      public static void main(String[] args) throws IOException {
          // public static final InputStream in：标准输入流
  		// InputStream is = System.in;
  
          BufferedReader br = new BufferedReader(new InputStreamReader(System.in));
  
          System.out.println("请输入一个字符串：");
          String line = br.readLine();
          System.out.println("你输入的字符串是：" + line);
  
          System.out.println("请输入一个整数：");
          int i = Integer.parseInt(br.readLine());
          System.out.println("你输入的整数是：" + i);
  
          // 自己实现键盘录入数据太麻烦了，所以Java就提供了一个类供我们使用
          Scanner sc = new Scanner(System.in);
      }
  }
  ```



### 标准输出流

- System类中有两个静态的成员变量

  - public static final InputStream in：标准输入流。通常该流对应于键盘输入或由主机环境或用户指定的另一个输入源
  - public static final PrintStream out：标准输出流。通常该流对应于显示输出或由主机环境或用户指定的另一个输出目标

- 输出语句的本质：是一个标准的输出流

  - PrintStream ps = System.out;
  - PrintStream类有的方法，System.out都可以使用

- 示例代码

  ```java
  public class SystemOutDemo {
      public static void main(String[] args) {
          // public static final PrintStream out：标准输出流
          PrintStream ps = System.out;
  
          //能够方便地打印各种数据值
  //        ps.print("hello");
  //        ps.print(100);
  
  //        ps.println("hello");
  //        ps.println(100);
  
          // System.out的本质是一个字节输出流
          System.out.println("hello");
          System.out.println(100);
  
          System.out.println();
  //        System.out.print();
      }
  }
  ```

### 

### 字符打印流

- 字符打印流构造房方法

  | 方法名                                       | 说明                                                         |
  | -------------------------------------------- | ------------------------------------------------------------ |
  | PrintWriter(String   fileName)               | 使用指定的文件名创建一个新的PrintWriter，而不需要自动执行刷新 |
  | PrintWriter(Writer   out, boolean autoFlush) | 创建一个新的PrintWriter    out：字符输出流    autoFlush： 一个布尔值，如果为真，则println ， printf ，或format方法将刷新输出缓冲区 |

```java
// 读写数据，复制文件, 不需要执行刷新
String line;
while ((line=br.readLine())!=null) {
	pw.println(line);
}
```



### 对象序列化流

- 对象序列化介绍

  - 对象序列化：就是将对象保存到磁盘中，或者在网络中传输对象
  - 这种机制就是使用一个字节序列表示一个对象，该字节序列包含：对象的类型、对象的数据和对象中存储的属性等信息
  - 字节序列写到文件之后，相当于文件中持久保存了一个对象的信息
  - 反之，该字节序列还可以从文件中读取回来，重构对象，对它进行反序列化

- 对象序列化流： ObjectOutputStream

  - 将Java对象的原始数据类型和图形写入OutputStream。 可以使用ObjectInputStream读取（重构）对象。 可以通过使用流的文件来实现对象的持久存储。 如果流是网络套接字流，则可以在另一个主机上或另一个进程中重构对象 

- 构造方法

  | 方法名                               | 说明                                               |
  | ------------------------------------ | -------------------------------------------------- |
  | ObjectOutputStream(OutputStream out) | 创建一个写入指定的OutputStream的ObjectOutputStream |

- 序列化对象的方法

  | 方法名                       | 说明                               |
  | ---------------------------- | ---------------------------------- |
  | void writeObject(Object obj) | 将指定的对象写入ObjectOutputStream |

```java
ObjectOutputStream oos = new ObjectOutputStream(new FileOutputStream("myOtherStream\\oos.txt"));

// 创建对象
Student s = new Student("林青霞",30);

// void writeObject(Object obj)：将指定的对象写入ObjectOutputStream
oos.writeObject(s);

// 释放资源
oos.close();
```

- 注意事项

  - 一个对象要想被序列化，该对象所属的类必须必须实现Serializable 接口
  - Serializable是一个标记接口，实现该接口，不需要重写任何方法

### 对象反序列化流

- 对象反序列化流： ObjectInputStream

  - ObjectInputStream反序列化先前使用ObjectOutputStream编写的原始数据和对象

- 构造方法

  | 方法名                            | 说明                                           |
  | --------------------------------- | ---------------------------------------------- |
  | ObjectInputStream(InputStream in) | 创建从指定的InputStream读取的ObjectInputStream |

- 反序列化对象的方法

  | 方法名              | 说明                            |
  | ------------------- | ------------------------------- |
  | Object readObject() | 从ObjectInputStream读取一个对象 |

```java
// ObjectInputStream(InputStream in)：创建从指定的InputStream读取的ObjectInputStream
ObjectInputStream ois = new ObjectInputStream(new FileInputStream("myOtherStream\\oos.txt"));

// Object readObject()：从ObjectInputStream读取一个对象
Object obj = ois.readObject();
 
Student s = (Student) obj;
System.out.println(s.getName() + "," + s.getAge());

ois.close();
```



### serialVersionUID&transient

- serialVersionUID

  - 用对象序列化流序列化了一个对象后，假如我们修改了对象所属的类文件，读取数据会不会出问题呢？
    - 会出问题，会抛出InvalidClassException异常
  - 如果出问题了，如何解决呢？
    - 重新序列化
    - 给对象所属的类加一个serialVersionUID 
      - private static final long serialVersionUID = 42L;

- transient

  - 如果一个对象中的某个成员变量的值不想被序列化，又该如何实现呢？
    - 给该成员变量加transient关键字修饰，该关键字标记的成员变量不参与序列化过程

```java
public class Student implements Serializable {
    private static final long serialVersionUID = 42L;
    private String name;
//    private int age;
    private transient int age;
}
```



## Properties集合

### Properties作为Map集合的使用

Properties介绍

- 是一个Map体系的集合类
- Properties可以保存到流中或从流中加载
- 属性列表中的每个键及其对应的值都是一个字符串

```java
Properties prop = new Properties();
// 存储元素
prop.put("itheima001", "林青霞");
// 遍历集合
Set<Object`尖括号` keySet = prop.keySet();
for (Object key : keySet) {
    Object value = prop.get(key);
    System.out.println(key + "," + value);
}
```



### Properties作为Map集合的特有方法

特有方法

| 方法名                                         | 说明                                                         |
| ---------------------------------------------- | ------------------------------------------------------------ |
| Object   setProperty(String key, String value) | 设置集合的键和值，都是String类型，底层调用   Hashtable方法 put |
| String   getProperty(String key)               | 使用此属性列表中指定的键搜索属性                             |
| Set<String`尖括号`   stringPropertyNames()     | 从该属性列表中返回一个不可修改的键集，其中键及其对应的值是字符串 |

```java
// 创建集合对象
Properties prop = new Properties();

// 设置集合的键和值，都是String类型，底层调用Hashtable方法put
prop.setProperty("itheima001", "林青霞");

//Set<String`尖括号` stringPropertyNames()：从该属性列表中返回一个不可修改的键集，其中键及其对应的值是字符串
Set<String`尖括号` names = prop.stringPropertyNames();
for (String key : names) {
//   System.out.println(key);
     String value = prop.getProperty(key);
     System.out.println(key + "," + value);
}
```



### Properties和IO流相结合的方法

和IO流结合的方法

| 方法名                                          | 说明                                                         |
| ----------------------------------------------- | ------------------------------------------------------------ |
| void   load(InputStream inStream)               | 从输入字节流读取属性列表（键和元素对）                       |
| void   load(Reader reader)                      | 从输入字符流读取属性列表（键和元素对）                       |
| void   store(OutputStream out, String comments) | 将此属性列表（键和元素对）写入此   Properties表中，以适合于使用   load(InputStream)方法的格式写入输出字节流 |
| void   store(Writer writer, String comments)    | 将此属性列表（键和元素对）写入此   Properties表中，以适合使用   load(Reader)方法的格式写入输出字符流 |

```java
private static void myLoad() throws IOException {
        Properties prop = new Properties();

        //void load(Reader reader)：
        FileReader fr = new FileReader("myOtherStream\\fw.txt");
        prop.load(fr);
        fr.close();

        System.out.println(prop);
}

private static void myStore() throws IOException {
        Properties prop = new Properties();

        prop.setProperty("itheima003","王祖贤");

        //void store(Writer writer, String comments)：
        FileWriter fw = new FileWriter("myOtherStream\\fw.txt");
        prop.store(fw,null);
        fw.close();
}
```





## 实现多线程

### 进程和线程

- 进程：是正在运行的程序

  ​	是系统进行资源分配和调用的独立单位

  ​	每一个进程都有它自己的内存空间和系统资源

- 线程：是进程中的单个顺序控制流，是一条执行路径

  ​	单线程：一个进程如果只有一条执行路径，则称为单线程程序

  ​	多线程：一个进程如果有多条执行路径，则称为多线程程序

### 实现多线程方式一：继承Thread类

- 方法介绍

  | 方法名       | 说明                                        |
  | ------------ | ------------------------------------------- |
  | void run()   | 在线程开启后，此方法将被调用执行            |
  | void start() | 使此线程开始执行，Java虚拟机会调用run方法() |

- 实现步骤

  - 定义一个类MyThread继承Thread类
  - 在MyThread类中重写run()方法
  - 创建MyThread类的对象
  - 启动线程

```java
public class MyThread extends Thread {
    @Override
    public void run() {
        for(int i=0; i<100; i++) {
            System.out.println(i);
        }
    }
}
public class MyThreadDemo {
    public static void main(String[] args) {
        MyThread my1 = new MyThread();
        MyThread my2 = new MyThread();

//        my1.run();
//        my2.run();

        // void start() 导致此线程开始执行; Java虚拟机调用此线程的run方法
        my1.start();
        my2.start();
    }
}
```

- 为什么要重写run()方法？

  因为run()是用来封装被线程执行的代码

- run()方法和start()方法的区别？

  run()：封装线程执行的代码，直接调用，相当于普通方法的调用

  start()：启动线程；然后由JVM调用此线程的run()方法



### 设置和获取线程名称

- 方法介绍

  | 方法名                     | 说明                               |
  | -------------------------- | ---------------------------------- |
  | void  setName(String name) | 将此线程的名称更改为等于参数name   |
  | String  getName()          | 返回此线程的名称                   |
  | Thread  currentThread()    | 返回对当前正在执行的线程对象的引用 |

```java
public class MyThread extends Thread {
    public MyThread() {}
    public MyThread(String name) {
        super(name);
    }
    @Override
    public void run() {
        for (int i = 0; i < 100; i++) {
            System.out.println(getName()+":"+i);
        }
    }
}

my1.setName("高铁");
my2.setName("飞机");

// Thread(String name)
MyThread my1 = new MyThread("高铁");
MyThread my2 = new MyThread("飞机");

my1.start();
my2.start();

// 返回对当前正在执行的线程对象的引用
System.out.println(Thread.currentThread().getName());
```





### 线程优先级【应用】

- 线程调度

  - 两种调度方式

    - 分时调度模型：所有线程轮流使用 CPU 的使用权，平均分配每个线程占用 CPU 的时间片
    - 抢占式调度模型：优先让优先级高的线程使用 CPU，如果线程的优先级相同，那么会随机选择一个，优先级高的线程获取的 CPU 时间片相对多一些

  - Java使用的是抢占式调度模型

  - 随机性

    假如计算机只有一个 CPU，那么 CPU 在某一个时刻只能执行一条指令，线程只有得到CPU时间片，也就是使用权，才可以执行指令。所以说多线程程序的执行是有随机性，因为谁抢到CPU的使用权是不一定的

- 优先级相关方法

  | 方法名                                  | 说明                                                         |
  | --------------------------------------- | ------------------------------------------------------------ |
  | final int getPriority()                 | 返回此线程的优先级                                           |
  | final void setPriority(int newPriority) | 更改此线程的优先级                                                                                         线程默认优先级是5；线程优先级的范围是：1-10 |

```java
// public final int getPriority()：返回此线程的优先级
System.out.println(tp1.getPriority()); //5

// 设置正确的优先级
tp1.setPriority(5);
```



### 线程控制

相关方法

| 方法名                         | 说明                                                         |
| ------------------------------ | ------------------------------------------------------------ |
| static void sleep(long millis) | 使当前正在执行的线程停留（暂停执行）指定的毫秒数             |
| void join()                    | 等待这个线程死亡                                             |
| void setDaemon(boolean on)     | 将此线程标记为守护线程，当运行的线程都是守护线程时，Java虚拟机将退出 |

```java
public class ThreadSleep extends Thread {
    @Override
    public void run() {
        for (int i = 0; i < 100; i++) {
            System.out.println(getName() + ":" + i);
            try {
                Thread.sleep(1000);
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
        }
    }
}
// join 
tj1.start();
try {
     tj1.join();
} catch (InterruptedException e) {
     e.printStackTrace();
}

//设置守护线程
td1.setDaemon(true);
td1.start();
```



### 实现多线程方式二：实现Runnable接口

- Thread构造方法

  | 方法名                               | 说明                   |
  | ------------------------------------ | ---------------------- |
  | Thread(Runnable target)              | 分配一个新的Thread对象 |
  | Thread(Runnable target, String name) | 分配一个新的Thread对象 |

- 实现步骤

  - 定义一个类MyRunnable实现Runnable接口
  - 在MyRunnable类中重写run()方法
  - 创建MyRunnable类的对象
  - 创建Thread类的对象，把MyRunnable对象作为构造方法的参数
  - 启动线程

```java
public class MyRunnable implements Runnable {
    @Override
    public void run() {
        for(int i=0; i<100; i++) {
        System.out.println(Thread.currentThread().getName()+":"+i);
        }
    }
}
public class MyRunnableDemo {
    public static void main(String[] args) {
        //创建MyRunnable类的对象
        MyRunnable my = new MyRunnable();

        //创建Thread类的对象，把MyRunnable对象作为构造方法的参数
        //Thread(Runnable target)
        //Thread(Runnable target, String name)
        Thread t1 = new Thread(my,"高铁");
        Thread t2 = new Thread(my,"飞机");

        //启动线程
        t1.start();
        t2.start();
    }
}
```

- 多线程的实现方案有两种

  - 继承Thread类
  - 实现Runnable接口

- 相比继承Thread类，实现Runnable接口的好处

  - 避免了Java单继承的局限性

  - 适合多个相同程序的代码去处理同一个资源的情况（买票），把线程和程序的代码、数据有效分离，较好的体现了面向对象的设计思想



### 同步代码块解决数据安全问题

- 安全问题出现的条件

  - 是多线程环境

  - 有共享数据

  - 有多条语句操作共享数据

- 如何解决多线程安全问题呢?

  - 基本思想：让程序没有安全问题的环境

- 怎么实现呢?

  - 把多条语句操作共享数据的代码给锁起来，让任意时刻只能有一个线程执行即可

  - Java提供了同步代码块的方式来解决

- 同步代码块格式：

  ```java
  synchronized(任意对象) { 
  	多条语句操作共享数据的代码 
  }
  ```

  synchronized(任意对象)：就相当于给代码加锁了，任意对象就可以看成是一把锁

- 同步的好处和弊端  

  - 好处：解决了多线程的数据安全问题

  - 弊端：当线程很多时，因为每个线程都会去判断同步上的锁，这是很耗费资源的，无形中会降低程序的运行效率

```java
private int tickets = 100;
private Object obj = new Object();

@Override
public void run () {
    while(true) {
        // 同步代码块，异步同步化
        synchronized (obj) {
            // 进程进来后会锁住代码块
            try {
                t1.sleep(100);
            }catch (InterruptedException) {
                e.printStackTrace();
            }
        }
        // 进程出来后会解锁
    }
}
```



### 同步方法解决数据安全问题

- 同步方法的格式

  同步方法：就是把synchronized关键字加到方法上

  ```java
  修饰符 synchronized 返回值类型 方法名(方法参数) { 
  	方法体；
  }
  ```

  同步方法的锁对象是什么呢?

  ​	this

- 静态同步方法

  同步静态方法：就是把synchronized关键字加到静态方法上

  ```java
  修饰符 static synchronized 返回值类型 方法名(方法参数) { 
  	方法体；
  }
  ```

  同步静态方法的锁对象是什么呢?

  ​	类名.class

```java
@Override
public void run () {
	while (true) {
		sellTicket();
    }
}

// 同步方法
private synchronized void sellTicket () {
    // 进程进来后会锁住代码块
    try {
        t1.sleep(100);
    }catch (InterruptedException) {
        e.printStackTrace();
    }
}
```





### 线程安全的类

- StringBuffer

  - 线程安全，可变的字符序列

  - 从版本JDK 5开始，被StringBuilder 替代。 通常应该使用StringBuilder类，因为它支持所有相同的操作，但它更快，因为它不执行同步

- Vector
  - 从Java 2平台v1.2开始，该类改进了List接口，使其成为Java Collections Framework的成员。 与新的集合实现不同， Vector被同步。 如果不需要线程安全的实现，建议使用ArrayList代替Vector

- Hashtable
  - 该类实现了一个哈希表，它将键映射到值。 任何非null对象都可以用作键或者值
  - 从Java 2平台v1.2开始，该类进行了改进，实现了Map接口，使其成为Java Collections Framework的成员。 与新的集合实现不同， Hashtable被同步。 如果不需要线程安全的实现，建议使用HashMap代替Hashtable



### Lock锁

虽然我们可以理解同步代码块和同步方法的锁对象问题，但是我们并没有直接看到在哪里加上了锁，在哪里释放了锁，为了更清晰的表达如何加锁和释放锁，JDK5以后提供了一个新的锁对象Lock

Lock是接口不能直接实例化，这里采用它的实现类ReentrantLock来实例化

- ReentrantLock构造方法

  | 方法名          | 说明                        |
  | --------------- | --------------------------- |
  | ReentrantLock() | 创建一个ReentrantLock的实例 |

- 加锁解锁方法

  | 方法名        | 说明   |
  | ------------- | ------ |
  | void lock()   | 获得锁 |
  | void unlock() | 释放锁 |

```java
private Lock lock = new ReentrantLock();

while (true) {
    try {
        lock.lock();
        try {
            // 执行
        }
    } finally {
        lock.unlock();
    }
}
```





## 生产者消费者

### 生产者和消费者模式概述

- 概述

  生产者消费者模式是一个十分经典的多线程协作的模式，弄懂生产者消费者问题能够让我们对多线程编程的理解更加深刻。

  所谓生产者消费者问题，实际上主要是包含了两类线程：

  ​	一类是生产者线程用于生产数据

  ​	一类是消费者线程用于消费数据

  为了解耦生产者和消费者的关系，通常会采用共享的数据区域，就像是一个仓库

  生产者生产数据之后直接放置在共享数据区中，并不需要关心消费者的行为

  消费者只需要从共享数据区中去获取数据，并不需要关心生产者的行为

- Object类的等待和唤醒方法

  | 方法名           | 说明                                                         |
  | ---------------- | ------------------------------------------------------------ |
  | void wait()      | 导致当前线程等待，直到另一个线程调用该对象的 notify()方法或 notifyAll()方法 |
  | void notify()    | 唤醒正在等待对象监视器的单个线程                             |
  | void notifyAll() | 唤醒正在等待对象监视器的所有线程                             |

```java
//提供存储牛奶和获取牛奶的操作
    public synchronized void put(int milk) {
        //如果有牛奶，等待消费
        if(state) {
            try {
                wait();
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
        }

        //如果没有牛奶，就生产牛奶
        this.milk = milk;
        System.out.println("送奶工将第" + this.milk + "瓶奶放入奶箱");

        //生产完毕之后，修改奶箱状态
        state = true;

        //唤醒其他等待的线程
        notifyAll();
    }
// 生产者和消费者
public class Producer implements Runnable {
    private Box b;

    public Producer(Box b) {
        this.b = b;
    }

    @Override
    public void run() {
        for(int i=1; i<=30; i++) {
            b.put(i);
        }
    }
}

public class Customer implements Runnable {
    private Box b;

    public Customer(Box b) {
        this.b = b;
    }

    @Override
    public void run() {
        while (true) {
            b.get();
        }
    }
}

//创建奶箱对象，这是共享数据区域
        Box b = new Box();

        //创建生产者对象，把奶箱对象作为构造方法参数传递，因为在这个类中要调用存储牛奶的操作
        Producer p = new Producer(b);
        //创建消费者对象，把奶箱对象作为构造方法参数传递，因为在这个类中要调用获取牛奶的操作
        Customer c = new Customer(b);

        //创建2个线程对象，分别把生产者对象和消费者对象作为构造方法参数传递
        Thread t1 = new Thread(p);
        Thread t2 = new Thread(c);

        //启动线程
        t1.start();
        t2.start();
```



## 网络编程

### InetAddress【应用】

InetAddress：此类表示Internet协议（IP）地址

- 相关方法

  | 方法名                                    | 说明                                                         |
  | ----------------------------------------- | ------------------------------------------------------------ |
  | static InetAddress getByName(String host) | 确定主机名称的IP地址。主机名称可以是机器名称，也可以是IP地址 |
  | String getHostName()                      | 获取此IP地址的主机名                                         |
  | String getHostAddress()                   | 返回文本显示中的IP地址字符串                                 |

```java
InetAddress address = InetAddress.getByName("192.168.1.66");

// public String getHostName()：获取此IP地址的主机名
String name = address.getHostName();
// public String getHostAddress()：返回文本显示中的IP地址字符串
String ip = address.getHostAddress();
```



## UDP通信程序

### UDP发送数据

- Java中的UDP通信

  - UDP协议是一种不可靠的网络协议，它在通信的两端各建立一个Socket对象，但是这两个Socket只是发送，接收数据的对象，因此对于基于UDP协议的通信双方而言，没有所谓的客户端和服务器的概念
  - Java提供了DatagramSocket类作为基于UDP协议的Socket

- 构造方法

  | 方法名                                                      | 说明                                                 |
  | ----------------------------------------------------------- | ---------------------------------------------------- |
  | DatagramSocket()                                            | 创建数据报套接字并将其绑定到本机地址上的任何可用端口 |
  | DatagramPacket(byte[] buf,int len,InetAddress add,int port) | 创建数据包,发送长度为len的数据包到指定主机的指定端口 |

- 相关方法

  | 方法名                         | 说明                   |
  | ------------------------------ | ---------------------- |
  | void send(DatagramPacket p)    | 发送数据报包           |
  | void close()                   | 关闭数据报套接字       |
  | void receive(DatagramPacket p) | 从此套接字接受数据报包 |

- 发送数据的步骤

  - 创建发送端的Socket对象(DatagramSocket)
  - 创建数据，并把数据打包
  - 调用DatagramSocket对象的方法发送数据
  - 关闭发送端

```java
DatagramSocket ds = new DatagramSocket();
// 数据打包
byte[] barr = "hello".getBytes();
DatagramPacket dp = new DatagramPacket(barr, barr.length(), InetAddres.getByName("192.168.1.1"), 10086);

// void send(DatagramPacket p) 从此套接字发送数据报包
ds.send(dp);
// void close() 关闭此数据报套接字
ds.close();
```



### UDP接收数据

- 接收数据的步骤

  - 创建接收端的Socket对象(DatagramSocket)
  - 创建一个数据包，用于接收数据
  - 调用DatagramSocket对象的方法接收数据
  - 解析数据包，并把数据在控制台显示
  - 关闭接收端

- 构造方法

  | 方法名                              | 说明                                            |
  | ----------------------------------- | ----------------------------------------------- |
  | DatagramPacket(byte[] buf, int len) | 创建一个DatagramPacket用于接收长度为len的数据包 |

- 相关方法

  | 方法名            | 说明                                     |
  | ----------------- | ---------------------------------------- |
  | byte[]  getData() | 返回数据缓冲区                           |
  | int  getLength()  | 返回要发送的数据的长度或接收的数据的长度 |

```java
DatagramSocket ds = new DatagramSocket(10086);

while (true) {
    byte[] bys = new byte[1024];
    DatagramPacket dp = new DatagramPacket(bys, bys.length());
    // 调用DatagramSocket对象的方法接收数据
    ds.receive(dp);
    // 解析数据包，并把数据在控制台显示
    System.out.println("数据是：" + new String(dp.getData(), 0,                                             dp.getLength()));
}
```



## TCP通信程序

### TCP发送数据

- Java中的TCP通信

  - Java对基于TCP协议的的网络提供了良好的封装，使用Socket对象来代表两端的通信端口，并通过Socket产生IO流来进行网络通信。
  - Java为客户端提供了Socket类，为服务器端提供了ServerSocket类

- 构造方法

  | 方法名                               | 说明                                           |
  | ------------------------------------ | ---------------------------------------------- |
  | Socket(InetAddress address,int port) | 创建流套接字并将其连接到指定IP指定端口号       |
  | Socket(String host, int port)        | 创建流套接字并将其连接到指定主机上的指定端口号 |

- 相关方法

  | 方法名                         | 说明                 |
  | ------------------------------ | -------------------- |
  | InputStream  getInputStream()  | 返回此套接字的输入流 |
  | OutputStream getOutputStream() | 返回此套接字的输出流 |

```java
Socket s = new Socket("192.168.1.1", 10086);

// 获取输出流，写数据
// OutputStream getOutputStream() 返回此套接字的输出流
OutputStreams os = s.getOutputStream();
os.wirte("hello".getBytes());

// 释放资源
s.close();
```



### TCP接收数据

- 构造方法

  | 方法名                 | 说明                             |
  | ---------------------- | -------------------------------- |
  | ServerSocket(int port) | 创建绑定到指定端口的服务器套接字 |

- 相关方法

  | 方法名          | 说明                           |
  | --------------- | ------------------------------ |
  | Socket accept() | 监听要连接到此的套接字并接受它 |

```java
// 创建绑定到指定端口的服务器套接字
ServerSocket ss = new ServerSocket(10086);
Socket s = ss.accept();

// 获取输入流，读数据，并把数据显示在控制台
InputStream is = s.getInputStream();
byte[] bys = new byte[1024];
int len = is.read(bys);
String data = new String(bys, 0, len);
sout(data);

// 释放资源
s.close();
ss.close();

```



- 案例分析

  - 创建客户端对象，创建输入流对象指向文件，每读入一行数据就给服务器输出一行数据，输出结束后使用shutdownOutput()方法告知服务端传输结束
  - 创建服务器对象，创建输出流对象指向文件，每接受一行数据就使用输出流输出到文件中，传输结束后。使用输出流给客户端反馈信息
  - 客户端接受服务端的回馈信息

- 相关方法

  | 方法名                | 说明                               |
  | --------------------- | ---------------------------------- |
  | void shutdownInput()  | 将此套接字的输入流放置在“流的末尾” |
  | void shutdownOutput() | 禁止用此套接字的输出流             |

```java
		// 发送数据 -----------------------------
		// 封装文本文件的数据
        BufferedReader br = new BufferedReader(new FileReader("myNet\\InetAddressDemo.java"));		
		// 封装输出流写数据(字符缓冲)
        BufferedWriter bw = new BufferedWriter(new OutputStreamWriter(s.getOutputStream()));

        String line;
        while ((line=br.readLine())!=null) {
            bw.write(line);
            bw.newLine();
            bw.flush();
        }

        // public void shutdownOutput()
        s.shutdownOutput();

		// 接收数据 -----------------------------
        BufferedReader br = new BufferedReader(new InputStreamReader(s.getInputStream()));
        //把数据写入文本文件
        BufferedWriter bw = new BufferedWriter(new FileWriter("myNet\\Copy.java"));

        String line;
        while ((line=br.readLine())!=null) { //等待读取数据
            bw.write(line);
            bw.newLine();
            bw.flush();
        }
```





## Lambda表达式

### 体验Lambda表达式

- 案例需求

  启动一个线程，在控制台输出一句话：多线程程序启动了

- 实现方式一

  - 实现步骤
    - 定义一个类MyRunnable实现Runnable接口，重写run()方法
    - 创建MyRunnable类的对象
    - 创建Thread类的对象，把MyRunnable的对象作为构造参数传递
    - 启动线程

- 实现方式二

  - 匿名内部类的方式改进

- 实现方式三

  - Lambda表达式的方式改进

```java
// 方式二
new Thread(new Runnable () {
	@Override
    public void run () {
        sout("多线程");
    }
}).start();

// 方式三
new Thread( () -`尖括号` {
	sout("多线程");
}).start();
```

- 函数式编程思想概述


函数式思想则尽量忽略面向对象的复杂语法：“强调做什么，而不是以什么形式去做”

而我们要学习的Lambda表达式就是函数式思想的体现



### Lambda表达式的使用前提

- 有一个接口
- 接口中有且仅有一个抽象方法

#### 参数传递

```java
public interface Addable {
    int add(int x,int y);
}

public class AddableDemo {
    public static void main(String[] args) {
        //在主方法中调用useAddable方法
        useAddable((int x,int y) -`尖括号` {
            return x + y;
        });
    }
    private static void useAddable(Addable a) {
        int sum = a.add(10, 20);
        System.out.println(sum);
    }
}
```



### Lambda表达式的省略模式

- 省略的规则

  - 参数类型可以省略。但是有多个参数的情况下，不能只省略一个
  - 如果参数有且仅有一个，那么小括号可以省略
  - 如果代码块的语句只有一条，可以省略大括号和分号，和return关键字





## 接口组成更新

### 接口组成更新概述

- 常量

  public static final

- 抽象方法

  public abstract

- 默认方法(Java 8)

- 静态方法(Java 8)

- 私有方法(Java 9)



### 接口中默认方法

- 格式

  public default 返回值类型 方法名(参数列表) {   }

- 范例

  ```java
  public default void show3() { 
  }
  ```

- 注意事项

  - 默认方法不是抽象方法，所以不强制被重写。但是可以被重写，重写的时候去掉default关键字

  - public可以省略，default不能省略

### 接口中静态方法

- 格式

  public static 返回值类型 方法名(参数列表) {   }

- 范例

  ```java
  public static void show() {
  }
  ```

- 注意事项

  - 静态方法只能通过接口名调用，不能通过实现类名或者对象名调用

  - public可以省略，static不能省略



### 接口中静态方法

- 格式

  public static 返回值类型 方法名(参数列表) {   }

- 范例

  ```java
  public static void show() {
  }
  ```

- 注意事项

  - 静态方法只能通过接口名调用，不能通过实现类名或者对象名调用

  - public可以省略，static不能省略





### 方法引用符

- 方法引用符

  ::  该符号为引用运算符，而它所在的表达式被称为方法引用

- 推导与省略 

  - 如果使用Lambda，那么根据“可推导就是可省略”的原则，无需指定参数类型，也无需指定的重载形式，它们都将被自动推导
  - 如果使用方法引用，也是同样可以根据上下文进行推导
  - 方法引用是Lambda的孪生兄弟

### 引用类方法

​	引用类方法，其实就是引用类的静态方法

- 格式

  类名::静态方法

- 范例

  Integer::parseInt

  Integer类的方法：public static int parseInt(String s) 将此String转换为int类型数据

- 练习描述

  - 定义一个接口(Converter)，里面定义一个抽象方法 int convert(String s);

  - 定义一个测试类(ConverterDemo)，在测试类中提供两个方法

    - 一个方法是：useConverter(Converter c)

    - 一个方法是主方法，在主方法中调用useConverter方法

```java
public interface Converter {
    int convert(String s);
}
public class ConverterDemo {
    public static void main(String[] args) {
		//Lambda写法
        useConverter(s -`尖括号` Integer.parseInt(s));
        //引用类方法
        useConverter(Integer::parseInt);
    }
    private static void useConverter(Converter c) {
        int number = c.convert("666");
        System.out.println(number);
    }
}
```



### 引用对象的实例方法

引用对象的实例方法，其实就引用类中的成员方法

- 格式

  对象::成员方法

- 范例

  "HelloWorld"::toUpperCase

    String类中的方法：public String toUpperCase() 将此String所有字符转换为大写

```java
public class PrintString {
    //把字符串参数变成大写的数据，然后在控制台输出
    public void printUpper(String s) {
        String result = s.toUpperCase();
        System.out.println(result);
    }
}
// Lambda简化写法
usePrinter(s -`尖括号` System.out.println(s.toUpperCase()));

// 引用对象的实例方法
PrintString ps = new PrintString();
usePrinter(ps::printUpper);
```

### 引用类

```java
public interface MyString {
    String mySubString(String s,int x,int y);
}
public static void main(String[] args) {
	// Lambda简化写法
    useMyString((s,x,y) -`尖括号` s.substring(x,y));
    // 引用类的实例方法
    useMyString(String::substring);
}
private static void useMyString(MyString my) {
    String s = my.mySubString("HelloWorld", 2, 5);
    System.out.println(s);
}
```

### 引用构造器

```java
public interface StudentBuilder {
    Student build(String name,int age);
}
public class StudentDemo {
    public static void main(String[] args) {
		//Lambda简化写法
        useStudentBuilder((name,age) -`尖括号` new Student(name,age));
        //引用构造器
        useStudentBuilder(Student::new);
    }
    private static void useStudentBuilder(StudentBuilder sb) {
        Student s = sb.build("林青霞", 30);
        System.out.println(s.getName() + "," + s.getAge());
    }
}
```

- 使用说明

  Lambda表达式被对象的实例方法替代的时候，它的形式参数全部传递给该方法作为参数
