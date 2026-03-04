Hello world 

```java
public class HelloWorld {
	public static void main(String[] args) {
		System.out.println("HelloWorld");
	}
}
```

编译：javac 文件名.java

执行：java 类名



### 类型转换

1. char类型的数据转换为int类型是按照码表中对应的int值进行计算的。比如在ASCII码表中，'a'对应97。

```java
int a = 'a';
System.out.println(a); // 将输出97
```

2. 整数默认是int类型，byte、short和char类型数据参与运算均会自动转换为int类型。

```java
byte b1 = 10;
byte b2 = 20;
byte b3 = b1 + b2; 
// 第三行代码会报错，b1和b2会自动转换为int类型，计算结果为int，int赋值给byte需要强制类型转换。
// 修改为:
int num = b1 + b2;
// 或者：
byte b3 = (byte) (b1 + b2);
```

1. boolean类型不能与其他基本数据类型相互转换。



### 表达式类型提升



算术表达式中包含不同的基本数据类型的值的时候，整个算术表达式的类型会自动进行提升。

提升规则：

byte类型，short类型和char类型将被提升到int类型，不管是否有其他类型参与运算。

整个表达式的类型自动提升到与表达式中最高等级的操作数相同的类型

​       等级顺序：byte,short,char --`尖括号` int --`尖括号` long --`尖括号` float --`尖括号` double



### 输入

```java
import java.util.Scanner; 

Scanner sc = new Scanner(System.in);// 创建Scanner对象，sc表示变量名，其他均不可变

int i = sc.nextInt(); // 表示将键盘录入的值作为int数返回。
```



### 随机数

```java
import java.util.Random;

Random r = new Random();

int num = r.nextInt(10);
```



## 数组

```java
// 1
int[] arr;
char[] arr;

// 2
int arr[];
char arr[];
```

### 数组动态初始化

```java
int[] arr = new int[3];
```

### 静态初始化

```java
int[] arr = {1, 2, 3}
```

### 数组异常

ArrayIndexOutOfBoundsException 数组越界异常

NullPointerException 空指针异常

## 内存分配



| 区域名称   | 作用                                                       |
| ---------- | ---------------------------------------------------------- |
| 寄存器     | 给CPU使用，和我们开发无关。                                |
| 本地方法栈 | JVM在使用操作系统功能的时候使用，和我们开发无关。          |
| 方法区     | 存储可以运行的class文件。                                  |
| 堆内存     | 存储对象或者数组，new来创建的，都存储在堆内存。            |
| 方法栈     | 方法运行时使用的内存，比如main方法运行，进入方法栈中执行。 |



## 方法

```java
public static void name () {
    // 体
}
```



## 类

###  this关键字

* this修饰的变量用于指代成员变量，其主要作用是（区分局部变量和成员变量的重名问题）
  * 方法的形参如果与成员变量同名，不带this修饰的变量指的是形参，而不是成员变量
  * 方法的形参没有与成员变量同名，不带this修饰的变量指的是成员变量



## String 类

### String类的特点

- 字符串不可变，它们的值在创建后不能被更改
- 虽然 String 的值是不可变的，但是它们可以被共享
- 字符串效果上相当于字符数组( char[] )，但是底层原理是字节数组( byte[] )



### 常用的构造方法

| 方法名                      | 说明                                      |
| --------------------------- | ----------------------------------------- |
| public   String()           | 创建一个空白字符串对象，不含有任何内容    |
| public   String(char[] chs) | 根据字符数组的内容，来创建字符串对象      |
| public   String(byte[] bys) | 根据字节数组的内容，来创建字符串对象      |
| String s =   “abc”;         | 直接赋值的方式创建字符串对象，内容就是abc |

```java
String str = new String();
```



### equals方法

```java
s1.equals(s2)
```



### String常用方法

| 方法名                                   | 说明                                           |
| ---------------------------------------- | ---------------------------------------------- |
| public boolean   equals(Object anObject) | 比较字符串的内容，严格区分大小写(用户名和密码) |
| public char charAt(int   index)          | 返回指定索引处的 char 值                       |
| public int   length()                    | 返回此字符串的长度                             |



## StringBuilder类

### 常用的构造方法

| 方法名                             | 说明                                       |
| ---------------------------------- | ------------------------------------------ |
| public StringBuilder()             | 创建一个空白可变字符串对象，不含有任何内容 |
| public StringBuilder(String   str) | 根据字符串的内容，来创建可变字符串对象     |



### 常用方法

添加和反转方法

| 方法名                                  | 说明                                                |
| --------------------------------------- | --------------------------------------------------- |
| public StringBuilder   append(任意类型) | 添加数据，并返回对象本身                            |
| public StringBuilder   reverse()        | 返回相反的字符序列                                  |
| public   int   length()                 | 返回长度，实际存储值                                |
| public   String toString()              | 通过toString()就可以实现把StringBuilder转换为String |



### StringBuilder和String相互转换

- StringBuilder转换为String

  ```java
  public String toString(); 
  // 通过 toString() 就可以实现把 StringBuilder 转换为 String
  
  StringBuilder sb = new StringBuilder();
  String s = sb.toString();
  ```

- String转换为StringBuilder

  ```java
  public StringBuilder(String s); // 通过构造方法就可以实现把 String 转换为 StringBuilder
  
  StringBuilder sb = new StringBuilder(s);
  ```



## ArrayList

### 构造方法

| 方法名             | 说明                 |
| ------------------ | -------------------- |
| public ArrayList() | 创建一个空的集合对象 |

### 成员方法

| 方法名                                   | 说明                                   |
| ---------------------------------------- | -------------------------------------- |
| public boolean   remove(Object o)        | 删除指定的元素，返回删除是否成功       |
| public E   remove(int   index)           | 删除指定索引处的元素，返回被删除的元素 |
| public E   set(int index,E   element)    | 修改指定索引处的元素，返回被修改的元素 |
| public E   get(int   index)              | 返回指定索引处的元素                   |
| public int   size()                      | 返回集合中的元素的个数                 |
| public boolean   add(E e)                | 将指定的元素追加到此集合的末尾         |
| public void   add(int index,E   element) | 在此集合中的指定位置插入指定的元素     |



```java
ArrayList`尖括号`String`尖括号` array = new ArrayList`尖括号`String`尖括号`();
array.add('hello');
```



## 继承

### 继承中变量的访问特点

在子类方法中访问一个变量，采用的是就近原则。

1. 子类局部范围找
2. 子类成员范围找
3. 父类成员范围找
4. 如果都没有就报错

### super

子类中所有的构造方法默认都会访问父类中无参的构造方法**

​	子类会继承父类中的数据，可能还会使用父类的数据。所以，子类初始化之前，一定要先完成父类数据的初始化，原因在于，每一个子类构造方法的第一条语句默认都是：super()

**问题：如果父类中没有无参构造方法，只有带参构造方法**

	1. 通过使用super关键字去显示的调用父类的带参构造方法
	2. 在父类中自己提供一个无参构造方法



* this&super关键字：
  * this：代表本类对象的引用
  * super：代表父类存储空间的标识(可以理解为父类对象引用)
* this和super的使用分别
  * 成员变量：
    * this.成员变量    -   访问本类成员变量
    * super.成员变量 -   访问父类成员变量
  * 成员方法：
    * this.成员方法  - 访问本类成员方法
    * super.成员方法 - 访问父类成员方法
* 构造方法：
  * this(…)  -  访问本类构造方法
  * super(…)  -  访问父类构造方法



### 方法重写

* 1、方法重写概念
  * 子类出现了和父类中一模一样的方法声明（方法名一样，参数列表也必须一样）
* 2、方法重写的应用场景
  * 当子类需要父类的功能，而功能主体子类有自己特有内容时，可以重写父类中的方法，这样，即沿袭了父类的功能，又定义了子类特有的内容
* 3、Override注解
  * 用来检测当前的方法，是否是重写的方法，起到【校验】的作用



### 方法重写的注意事项

* 方法重写的注意事项

1. 私有方法不能被重写(父类私有成员子类是不能继承的)
2. 子类方法访问权限不能更低(public `尖括号` 默认 `尖括号` 私有)



### Java中继承的注意事项

* Java中继承的注意事项

  1. Java中类只支持单继承，不支持多继承
     * 错误范例：class A extends B, C { }
  2. Java中类支持多层继承



### final

* fianl关键字的作用
  * final代表最终的意思，可以修饰成员方法，成员变量，类
* final修饰类、方法、变量的效果  
  * fianl修饰类：该类不能被继承（不能有子类，但是可以有父类）
  * final修饰方法：该方法不能被重写
  * final修饰变量：表明该变量是一个常量，不能再次赋值



### static

* static的概念
  * static关键字是静态的意思，可以修饰【成员方法】，【成员变量】
* static修饰的特点 
  1. 被类的所有对象共享，这也是我们判断是否使用静态关键字的条件
  2. 可以通过类名调用当然，也可以通过对象名调用**【推荐使用类名调用】**



## 多态

### 多态的概述

- 什么是多态

  ​	同一个对象，在不同时刻表现出来的不同形态

- 多态的前提

  - 要有继承或实现关系
  - 要有方法的重写
  - 要有父类引用指向子类对象

### 多态中的成员访问特点

- 成员访问特点

  - 成员变量

    ​	编译看父类，运行看父类

  - 成员方法

    ​	编译看父类，运行看子类

### 多态的好处和弊端

- 好处

  ​	提高程序的扩展性。定义方法时候，使用父类型作为参数，在使用的时候，使用具体的子类型参与操作

- 弊端

  ​	不能使用子类的特有成员

### 多态中的转型

- 向上转型

  ​	父类引用指向子类对象就是向上转型

- 向下转型

  ​	格式：子类型 对象名 = (子类型)父类引用;

```java
public class Test {
    public static void main(String[] arg) {
        // 向上转型
        Animal a = new Cat();
        a.eat();
        
        // 向下转型
        Cat c = (Cat) a;
        c.eat();
    }
}
```



## 抽象类

### 抽象类的概述

​	当我们在做子类共性功能抽取时，有些方法在父类中并没有具体的体现，这个时候就需要抽象类了！

​	在Java中，一个没有方法体的方法应该定义为抽象方法，而类中如果有抽象方法，该类必须定义为抽象类！

### 抽象类的特点

- 抽象类和抽象方法必须使用 abstract 关键字修饰

  ```java
  //抽象类的定义
  public abstract class 类名 {}
  
  //抽象方法的定义
  public abstract void eat();
  ```

- 抽象类中不一定有抽象方法，有抽象方法的类一定是抽象类

- 抽象类不能实例化

  ​	抽象类如何实例化呢？参照多态的方式，通过子类对象实例化，这叫抽象类多态

- 抽象类的子类

  ​	要么重写抽象类中的所有抽象方法

  ​	要么是抽象类



### 抽象类成员

可以是常量和变量，空参或有参构造，抽象或普通方法





## 接口

### 接口特点

- 接口用关键字interface修饰

  ```java
  public interface 接口名 {} 
  ```

- 类实现接口用implements表示

  ```java
  public class 类名 implements 接口名 {}
  ```

- 接口不能实例化

  ​	接口如何实例化呢？参照多态的方式，通过实现类对象实例化，这叫接口多态。

  ​	多态的形式：具体类多态，抽象类多态，接口多态。 

- 接口的子类

  ​	要么重写接口中的所有抽象方法

  ​	要么子类也是抽象类



### 接口的成员特点

- 成员特点

  - 成员变量

    ​	 只能是常量
    ​	 默认修饰符：public static final

  - 构造方法

    ​	没有，因为接口主要是扩展功能的，而没有具体存在

  - 成员方法

    ​	只能是抽象方法

    ​	默认修饰符：public abstract




## 参数传递

### 类名作为形参和返回值

* 1、类名作为方法的形参

  方法的形参是类名，其实需要的是该类的对象

  实际传递的是该对象的【地址值】

* 2、类名作为方法的返回值

  方法的返回值是类名，其实返回的是该类的对象

  实际传递的，也是该对象的【地址值】		

```java
public void useCat(Cat c);
```





## 内部类

内部类概念

* 在一个类中定义一个类。举例：在一个类A的内部定义一个类B，类B就被称为内部类

内部类的访问特点 

* 内部类可以直接访问外部类的成员，包括私有
* 外部类要访问内部类的成员，必须创建对象



### 匿名内部类

* 匿名内部类的前提

  * 存在一个类或者接口，这里的类可以是具体类也可以是抽象类

* 匿名内部类的格式

  * 格式：new 类名 ( ) {  重写方法 }    new  接口名 ( ) { 重写方法 }

  * 举例： 

    ```java
    new Inter(){
        @Override
        public void method(){}
    } 
    ```

* 匿名内部类的本质

  * 本质：是一个继承了该类或者实现了该接口的子类匿名对象

* 匿名内部类的细节

  * 匿名内部类可以通过多态的形式接受

    ```java
    Inter i = new Inter(){
      @Override
        public void method(){
            
        }
    }
    ```

* 匿名内部类直接调用方法

  ```java
  interface Inter{
      void method();
  }
  
  class Test{
      public static void main(String[] args){
          new Inter(){
              @Override
              public void method(){
                  System.out.println("我是匿名内部类");
              }
          }.method();	// 直接调用方法
      }
  }
  ```

### 2.4 匿名内部类在开发中的使用（应用）

* 匿名内部类在开发中的使用

  * 当发现某个方法需要，接口或抽象类的子类对象，我们就可以传递一个匿名内部类过去，来简化传统的代码

* 示例代码：

  ```java
  interface Jumpping {
      void jump();
  }
  class Cat implements Jumpping {
      @Override
      public void jump() {
          System.out.println("猫可以跳高了");
      }
  }
  class Dog implements Jumpping {
      @Override
      public void jump() {
          System.out.println("狗可以跳高了");
      }
  }
  class JumppingOperator {
      public void method(Jumpping j) { //new Cat();   new Dog();
          j.jump();
      }
  }
  class JumppingDemo {
      public static void main(String[] args) {
          //需求：创建接口操作类的对象，调用method方法
          JumppingOperator jo = new JumppingOperator();
          Jumpping j = new Cat();
          jo.method(j);
  
          Jumpping j2 = new Dog();
          jo.method(j2);
          System.out.println("--------");
  
          // 匿名内部类的简化
          jo.method(new Jumpping() {
              @Override
              public void jump() {
                  System.out.println("猫可以跳高了");
              }
          });
  		// 匿名内部类的简化
          jo.method(new Jumpping() {
              @Override
              public void jump() {
                  System.out.println("狗可以跳高了");
              }
          });
      }
  }
  ```



## 常用API

###  Math

* 1、Math类概述

  * Math 包含执行基本数字运算的方法

* 2、Math中方法的调用方式

  * Math类中无构造方法，但内部的方法都是静态的，则可以通过   **类名.进行调用**

* 3、Math类的常用方法

  | 方法名    方法名                               | 说明                                           |
  | ---------------------------------------------- | ---------------------------------------------- |
  | public static int   abs(int a)                 | 返回参数的绝对值                               |
  | public static double ceil(double a)            | 返回大于或等于参数的最小double值，等于一个整数 |
  | public static double floor(double a)           | 返回小于或等于参数的最大double值，等于一个整数 |
  | public   static int round(float a)             | 按照四舍五入返回最接近参数的int                |
  | public static int   max(int a,int b)           | 返回两个int值中的较大值                        |
  | public   static int min(int a,int b)           | 返回两个int值中的较小值                        |
  | public   static double pow (double a,double b) | 返回a的b次幂的值                               |
  | public   static double random()                | 返回值为double的正值，[0.0,1.0)                |

### System

* System类的常用方法 

| 方法名                                   | 说明                                             |
| ---------------------------------------- | ------------------------------------------------ |
| public   static void exit(int status)    | 终止当前运行的   Java   虚拟机，非零表示异常终止 |
| public   static long currentTimeMillis() | 返回当前时间(以毫秒为单位)                       |

* 示例代码

  * 需求：在控制台输出1-10000，计算这段代码执行了多少毫秒 

  ```java
  public class SystemDemo {
      public static void main(String[] args) {
          // 获取开始的时间节点
          long start = System.currentTimeMillis();
          for (int i = 1; i `尖括号`= 10000; i++) {
              System.out.println(i);
          }
          // 获取代码运行结束后的时间节点
          long end = System.currentTimeMillis();
          System.out.println("共耗时：" + (end - start) + "毫秒");
      }
  }
  ```

### Object类的toString方法

* Object类概述

  * Object 是类层次结构的根，每个类都可以将 Object 作为超类。所有类都直接或者间接的继承自该类，换句话说，该类所具备的方法，所有类都会有一份
* 查看方法源码的方式

  * 选中方法，按下Ctrl + B
* 重写toString方法的方式

  * 1. Alt + Insert 选择toString
  * 2. 在类的空白区域，右键 -`尖括号` Generate -`尖括号` 选择toString
* toString方法的作用：

  * 以良好的格式，更方便的展示对象中的属性值

```java
 	@Override
    public String toString() {
        return "Student{" +
                "name='" + name + '\'' +
                ", age=" + age +
                '}';
    }
```



### Object类的equals方法

* equals方法的作用

  * 用于对象之间的比较，返回true和false的结果
  * 举例：s1.equals(s2);    s1和s2是两个对象

* 重写equals方法的场景

  * 不希望比较对象的地址值，想要结合对象属性进行比较的时候。

* 重写equals方法的方式

  * 1. alt + insert  选择equals() and hashCode()，IntelliJ Default，一路next，finish即可
  * 2. 在类的空白区域，右键 -`尖括号` Generate -`尖括号` 选择equals() and hashCode()，后面的同上。

```java
	@Override
    public boolean equals(Object o) {
        //this -- s1
        //o -- s2
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;

        Student student = (Student) o; //student -- s2

        if (age != student.age) return false;
        return name != null ? name.equals(student.name) : student.name == null;
    }
```



###  Arrays

* Arrays的常用方法

  | 方法名                                 | 说明                               |
  | :------------------------------------- | ---------------------------------- |
  | public static String toString(int[] a) | 返回指定数组的内容的字符串表示形式 |
  | public static void sort(int[] a)       | 按照数字顺序排列指定的数组         |



## 包装类

### 基本类型包装类

- 基本类型包装类的作用

  ​	将基本数据类型封装成对象的好处在于可以在对象中定义更多的功能方法操作该数据

  ​	常用的操作之一：用于基本数据类型与字符串之间的转换

- 基本类型对应的包装类

  | 基本数据类型 | 包装类    |
  | ------------ | --------- |
  | byte         | Byte      |
  | short        | Short     |
  | int          | Integer   |
  | long         | Long      |
  | float        | Float     |
  | double       | Double    |
  | char         | Character |
  | boolean      | Boolean   |

### Integer类

- Integer类概述

  ​	包装一个对象中的原始类型 int 的值

- Integer类构造方法

  | 方法名                                  | 说明                                     |
  | --------------------------------------- | ---------------------------------------- |
  | public Integer(int   value)             | 根据 int 值创建 Integer 对象(过时)       |
  | public Integer(String s)                | 根据 String 值创建 Integer 对象(过时)    |
  | public static Integer valueOf(int i)    | 返回表示指定的 int 值的 Integer   实例   |
  | public static Integer valueOf(String s) | 返回一个保存指定值的 Integer 对象 String |



### int和String类型的相互转换

- int转换为String

  - 转换方式

    - 方式一：直接在数字后加一个空字符串
    - 方式二：通过String类静态方法valueOf()

  - 示例代码

    ```java
    public class IntegerDemo {
        public static void main(String[] args) {
            //int --- String
            int number = 100;
            //方式1
            String s1 = number + "";
            System.out.println(s1);
            //方式2
            //public static String valueOf(int i)
            String s2 = String.valueOf(number);
            System.out.println(s2);
            System.out.println("--------");
        }
    }
    ```

- String转换为int

  - 转换方式

    - 方式一：先将字符串数字转成Integer，再调用valueOf()方法
    - 方式二：通过Integer静态方法parseInt()进行转换

  - 示例代码

    ```java
    public class IntegerDemo {
        public static void main(String[] args) {
            //String --- int
            String s = "100";
            //方式1：String --- Integer --- int
            Integer i = Integer.valueOf(s);
            //public int intValue()
            int x = i.intValue();
            System.out.println(x);
            //方式2
            //public static int parseInt(String s)
            int y = Integer.parseInt(s);
            System.out.println(y);
        }
    }
    ```

### 



## 时间日期类

### Date类

- Date类概述

  ​	Date 代表了一个特定的时间，精确到毫秒

- Date类构造方法

  | 方法名                 | 说明                                                         |
  | ---------------------- | ------------------------------------------------------------ |
  | public Date()          | 分配一个 Date对象，并初始化，以便它代表它被分配的时间，精确到毫秒 |
  | public Date(long date) | 分配一个 Date对象，并将其初始化为表示从标准基准时间起指定的毫秒数 |

- 示例代码

  ```java
  public class DateDemo01 {
      public static void main(String[] args) {
          //public Date()：分配一个 Date对象，并初始化，以便它代表它被分配的时间，精确到毫秒
          Date d1 = new Date();
          System.out.println(d1);
  
          //public Date(long date)：分配一个 Date对象，并将其初始化为表示从标准基准时间起指定的毫秒数
          long date = 1000*60*60;
          Date d2 = new Date(date);
          System.out.println(d2);
      }
  }
  ```

### Date类常用方法

- 常用方法

  | 方法名                         | 说明                                                  |
  | ------------------------------ | ----------------------------------------------------- |
  | public long getTime()          | 获取的是日期对象从1970年1月1日 00:00:00到现在的毫秒值 |
  | public void setTime(long time) | 设置时间，给的是毫秒值                                |



### SimpleDateFormat类（应用）

- SimpleDateFormat类概述

  ​	SimpleDateFormat是一个具体的类，用于以区域设置敏感的方式格式化和解析日期。

  ​	我们重点学习日期格式化和解析

- SimpleDateFormat类构造方法

  | 方法名                                  | 说明                                                   |
  | --------------------------------------- | ------------------------------------------------------ |
  | public   SimpleDateFormat()             | 构造一个SimpleDateFormat，使用默认模式和日期格式       |
  | public SimpleDateFormat(String pattern) | 构造一个SimpleDateFormat使用给定的模式和默认的日期格式 |

- SimpleDateFormat类的常用方法

  - 格式化(从Date到String)
    - public final String format(Date date)：将日期格式化成日期/时间字符串
  - 解析(从String到Date)
    - public Date parse(String source)：从给定字符串的开始解析文本以生成日期

- 示例代码

  ```java
  public class SimpleDateFormatDemo {
      public static void main(String[] args) throws ParseException {
          //格式化：从 Date 到 String
          Date d = new Date();
  //        SimpleDateFormat sdf = new SimpleDateFormat();
          SimpleDateFormat sdf = new SimpleDateFormat("yyyy年MM月dd日 HH:mm:ss");
          String s = sdf.format(d);
          System.out.println(s);
          System.out.println("--------");
  
          //从 String 到 Date
          String ss = "2048-08-09 11:11:11";
          //ParseException
          SimpleDateFormat sdf2 = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
          Date dd = sdf2.parse(ss);
          System.out.println(dd);
      }
  }
  ```



## Calendar类

- Calendar类概述

  ​	Calendar 为特定瞬间与一组日历字段之间的转换提供了一些方法，并为操作日历字段提供了一些方法

  ​	Calendar 提供了一个类方法 getInstance 用于获取这种类型的一般有用的对象。

  ​	该方法返回一个Calendar 对象。

  ​	其日历字段已使用当前日期和时间初始化：Calendar rightNow = Calendar.getInstance();

- Calendar类常用方法

  | 方法名                                             | 说明                                                   |
  | -------------------------------------------------- | ------------------------------------------------------ |
  | public int   get(int field)                        | 返回给定日历字段的值                                   |
  | public abstract void add(int   field, int amount)  | 根据日历的规则，将指定的时间量添加或减去给定的日历字段 |
  | public final void set(int year,int month,int date) | 设置当前日历的年月日                                   |

- 示例代码

  ```java
  public class CalendarDemo {
      public static void main(String[] args) {
          // 获取日历类对象
          Calendar c = Calendar.getInstance();
  
          // public int get(int field):返回给定日历字段的值
          int year = c.get(Calendar.YEAR);
          int month = c.get(Calendar.MONTH) + 1;
          int date = c.get(Calendar.DATE);
          System.out.println(year + "年" + month + "月" + date + "日");
  
          // public abstract void add(int field, int amount):根据日历的规则，将指定的时间量添加或减去给定的日历字段
          // 需求1:3年前的今天
          c.add(Calendar.YEAR,-3);
  
          // 需求2:10年后的10天前
          c.add(Calendar.YEAR,10);
          c.add(Calendar.DATE,-10);
  
          //public final void set(int year,int month,int date):设置当前日历的年月日
          c.set(2050,10,10);
          year = c.get(Calendar.YEAR);
          month = c.get(Calendar.MONTH) + 1;
          date = c.get(Calendar.DATE);
          System.out.println(year + "年" + month + "月" + date + "日");
  
      }
  }
  ```



## 异常

- 异常的概述

  ​	异常就是程序出现了不正常的情况

### 异常体系

Throwable 

|--Exception : 程序本身可以处理的问题

|	|--RuntimeException : 编译期不检查，出现问题再修改

|	|--非RuntimeException: 编译期必须处理

|--Error 

### try-catch方式处理异常

- 定义格式

  ```java
  try {
  	可能出现异常的代码;
  } catch(异常类名 变量名) {
  	异常的处理代码;
  }
  ```

- 执行流程

  - 程序从 try 里面的代码开始执行
  - 出现异常，就会跳转到对应的 catch 里面去执行
  - 执行完毕之后，程序还可以继续往下执行

```java
try {
    int[] arr = {1, 2, 3};
    System.out.println(arr[3]);
} catch (ArrayIndexOutOfBoundsException e) {
    e.printStackTrace();
} 
```



### Throwable成员方法

- 常用方法

  | 方法名                        | 说明                              |
  | ----------------------------- | --------------------------------- |
  | public String getMessage()    | 返回此 throwable 的详细消息字符串 |
  | public String toString()      | 返回此可抛出的简短描述            |
  | public void printStackTrace() | 把异常的错误信息输出在控制台      |

```java
e.getMessage();
e.toString();
e.printStackTrace();
```



### throws方式处理异常

- 定义格式

  ```java
  public void 方法() throws 异常类名 {
      
  }
  ```



### 自定义异常

- 自定义异常类

  ```java
  public class ScoreException extends Exception {
  
      public ScoreException() {}
  
      public ScoreException(String message) {
          super(message);
      }
  
  }
  
  // 使用时
  try {
      t.checkScore(score);
  } catch (ScoreException e) {
      e.printStackTrace();
  }
  ```



## Collection集合

### 集合体系结构

- 集合类的特点

  ​	提供一种存储空间可变的存储模型，存储的数据容量可以随时发生改变

|--集合

|	|--Collection : 单列 - 接口

|	|	|--List : 可重复 - 接口

|	|	|	|--ArrayList

|	|	|	|--LinkedList

|	|	|--Set : 不可重复 - 接口

|	|	|	|--HashSet

|	|	|	|--TreeSet

|	|--Map : 单列 - 接口



### Collection集合概述和基本使用【应用】

- Collection集合概述

  - 是单例集合的顶层接口，它表示一组对象，这些对象也称为Collection的元素

  - JDK 不提供此接口的任何直接实现，它提供更具体的子接口（如Set和List）实现

- Collection集合基本使用

  ```java
  // 创建Collection集合的对象
  Collection`尖括号`String`尖括号` c = new ArrayList`尖括号`String`尖括号`();
  
  // 添加元素：boolean add(E e)
  c.add("hello");
  c.add("world");
  c.add("java");
  
  // 输出集合对象
  System.out.println(c);
  ```



### Collection集合的常用方法

| 方法名                     | 说明                               |
| -------------------------- | ---------------------------------- |
| boolean add(E e)           | 添加元素                           |
| boolean remove(Object o)   | 从集合中移除指定的元素             |
| void   clear()             | 清空集合中的元素                   |
| boolean contains(Object o) | 判断集合中是否存在指定的元素       |
| boolean isEmpty()          | 判断集合是否为空                   |
| int   size()               | 集合的长度，也就是集合中元素的个数 |



### Collection集合的遍历

迭代器的介绍

- 迭代器，集合的专用遍历方式
- Iterator`尖括号`E`尖括号` iterator()：返回此集合中元素的迭代器，通过集合的iterator()方法得到
- 迭代器是通过集合的iterator()方法得到的，所以我们说它是依赖于集合而存在的

```java
Collection`尖括号`String`尖括号` c = new ArrayList`尖括号``尖括号`();
// 添加元素
c.add("hello");
c.add("world");
// Iterator`尖括号`E`尖括号` iterator()：返回此集合中元素的迭代器，通过集合的iterator()方法得到
Iterator`尖括号`String`尖括号` it = c.iterator();

// 用while循环改进元素的判断和获取
while (it.hasNext()) {
   String s = it.next();
   System.out.println(s);
}
```





## List集合

### List集合概述和特点

- List集合概述
  - 有序集合(也称为序列)，用户可以精确控制列表中每个元素的插入位置。用户可以通过整数索引访问元素，并搜索列表中的元素
  - 与Set集合不同，列表通常允许重复的元素
- List集合特点
  - 有索引
  - 可以存储重复元素
  - 元素存取有序



### List集合的特有方法

| 方法名                          | 描述                                   |
| ------------------------------- | -------------------------------------- |
| void add(int index,E   element) | 在此集合中的指定位置插入指定的元素     |
| E remove(int   index)           | 删除指定索引处的元素，返回被删除的元素 |
| E set(int index,E   element)    | 修改指定索引处的元素，返回被修改的元素 |
| E get(int   index)              | 返回指定索引处的元素                   |

```java
List`尖括号`Student`尖括号` list = new ArrayList`尖括号``尖括号`();
// 创建对象，并添加到集合
Student s1 = new Student("xxx", 100);
list.add(s1);

// 遍历集合
// 迭代器
Iterator`尖括号`Student`尖括号` it = list.iterator();
while(it.hasNext()) {
    Student s = it.next();
    sout(s);
}

// for 循环
for(int i = 0; i `尖括号` list.size(); i ++) {
	Student st = list.get(i);
    sout(st.getName, st.getAge());
}
```



### 并发修改异常

- 出现的原因

  ​	迭代器遍历的过程中，通过集合对象修改了集合中的元素，造成了迭代器获取元素中判断预期修改值和实际修改值不一致，则会出现：ConcurrentModificationException

- 解决的方案

  ​	用for循环遍历，然后用集合对象做对应的操作即可



### 列表迭代器

- ListIterator介绍

  - 通过List集合的listIterator()方法得到，所以说它是List集合特有的迭代器
  - 用于允许程序员沿任一方向遍历的列表迭代器，在迭代期间修改列表，并获取列表中迭代器的当前位置

```java
ListIterator`尖括号`String`尖括号` lit = list.listIterator();
while(lit.hasNext()) {
	String s = lit.next();
}
```



### 增强for循环【应用】

- 定义格式

  ```java
  for(元素数据类型 变量名 : 数组/集合对象名) {
      循环体;
  }
  ```

```java
// 数组
int[] arr = {1, 2, 3};
for(int a : arr) {
	sout(a);
}
// 集合
List`尖括号`String`尖括号` list = new ArrayList`尖括号``尖括号`();
for(String s: list) {
	sout(s);
}
```



### LinkedList集合的特有功能

- 特有方法

  | 方法名                    | 说明                             |
  | ------------------------- | -------------------------------- |
  | public void addFirst(E e) | 在该列表开头插入指定的元素       |
  | public void addLast(E e)  | 将指定的元素追加到此列表的末尾   |
  | public E getFirst()       | 返回此列表中的第一个元素         |
  | public   E getLast()      | 返回此列表中的最后一个元素       |
  | public E removeFirst()    | 从此列表中删除并返回第一个元素   |
  | public   E removeLast()   | 从此列表中删除并返回最后一个元素 |



## Set集合

### Set集合概述和特点

- Set集合的特点
  - 元素存取无序
  - 没有索引、只能通过迭代器或增强for循环遍历
  - 不能存储重复元素

```java
// 创建集合对象
Set`尖括号`String`尖括号` set = new HashSet`尖括号`String`尖括号`();

// 添加元素
set.add("hello");
set.add("world");
set.add("java");
// 不包含重复元素的集合
set.add("world");

// 遍历
for(String s : set) {
    System.out.println(s);
}
```



### HashSet集合概述和特点【应用】

- HashSet集合的特点

  - 底层数据结构是哈希表
  - 对集合的迭代顺序不作任何保证，也就是说不保证存储和取出的元素顺序一致
  - 没有带索引的方法，所以不能使用普通for循环遍历
  - 由于是Set集合，所以是不包含重复元素的集合

```java
HashSet`尖括号`String`尖括号` hs = new HashSet`尖括号``尖括号`();
// 添加元素
hs.add("hello");
// 遍历
for(String s : hs) {
    sout(s);
}
```



### HashSet集合保证元素唯一性的原理

​	1.根据对象的哈希值计算存储位置

​            如果当前位置没有元素则直接存入

​            如果当前位置有元素存在，则进入第二步

​     2.当前元素的元素和已经存在的元素比较哈希值

​            如果哈希值不同，则将当前元素进行存储

​            如果哈希值相同，则进入第三步

​     3.通过equals()方法比较两个元素的内容

​            如果内容不相同，则将当前元素进行存储

​            如果内容相同，则不存储当前元素



### LinkedHashSet集合概述和特点

- LinkedHashSet集合特点

  - 哈希表和链表实现的Set接口，具有可预测的迭代次序
  - 由链表保证元素有序，也就是说元素的存储和取出顺序是一致的
  - 由哈希表保证元素唯一，也就是说没有重复的元素





## Set集合排序

### 2.1TreeSet集合概述和特点【应用】

- TreeSet集合概述

  - 元素有序，可以按照一定的规则进行排序，具体排序方式取决于构造方法
    - TreeSet()：根据其元素的自然排序进行排序
    - TreeSet(Comparator comparator) ：根据指定的比较器进行排序
  - 没有带索引的方法，所以不能使用普通for循环遍历
  - 由于是Set集合，所以不包含重复元素的集合



### 自然排序Comparable的使用

- 案例需求

  - 存储学生对象并遍历，创建TreeSet集合使用无参构造方法
  - 要求：按照年龄从小到大排序，年龄相同时，按照姓名的字母顺序排序

- 实现步骤

  - 用TreeSet集合存储自定义对象，无参构造方法使用的是自然排序对元素进行排序的
  - 自然排序，就是让元素所属的类实现Comparable接口，重写compareTo(T o)方法
  - 重写方法时，一定要注意排序规则必须按照要求的主要条件和次要条件来写

```java
public class Student implements Comparable`尖括号`Student`尖括号` 
    
@Override
public int compareTo(Student s) {
//        return 0;
//        return 1;
//        return -1;
    // 按照年龄从小到大排序
    int num = this.age - s.age;
//        int num = s.age - this.age;
        //年龄相同时，按照姓名的字母顺序排序
    int num2 = num == 0 ? this.name.compareTo(s.name) : num;
    return num2;
}
```



### 比较器排序Comparator的使用

- 案例需求

  - 存储学生对象并遍历，创建TreeSet集合使用带参构造方法
  - 要求：按照年龄从小到大排序，年龄相同时，按照姓名的字母顺序排序

- 实现步骤

  - 用TreeSet集合存储自定义对象，带参构造方法使用的是比较器排序对元素进行排序的
  - 比较器排序，就是让集合构造方法接收Comparator的实现类对象，重写compare(T o1,T o2)方法
  - 重写方法时，一定要注意排序规则必须按照要求的主要条件和次要条件来写

```java
// 创建集合对象
TreeSet`尖括号`Student`尖括号` ts = new TreeSet`尖括号`Student`尖括号`(new Comparator`尖括号`Student`尖括号`() {
      @Override
      public int compare(Student s1, Student s2) {
      // this.age - s.age
      // s1,s2
      int num = s1.getAge() - s2.getAge();
      int num2 = num == 0 ? s1.getName().compareTo(s2.getName()) : num;
      return num2;
    }
});
```





## 泛型

```java
- 泛型定义格式

  - `尖括号`类型`尖括号`：指定一种类型的格式。这里的类型可以看成是形参
  - `尖括号`类型1,类型2…`尖括号`：指定多种类型的格式，多种类型之间用逗号隔开。这里的类型可以看成是形参
  - 将来具体调用时候给定的类型可以看成是实参，并且实参的类型只能是引用数据类型

- 泛型的好处

  - 把运行时期的问题提前到了编译期间
  - 避免了强制类型转换
```



### 泛型类

定义格式

```java
修饰符 class 类名`尖括号`类型`尖括号` {  }
```

示例代码泛型类

```java
public class Generic`尖括号`T`尖括号` {
    private T t;

    public T getT() {
        return t;
    }

    public void setT(T t) {
        this.t = t;
    }
}
```

```java
 Generic`尖括号`String`尖括号` g1 = new Generic`尖括号`String`尖括号`();
```



### 泛型方法

- 定义格式

  ```java
  修饰符 `尖括号`类型`尖括号` 返回值类型 方法名(类型 变量名) {  }
  ```

- 示例代码

  - 带有泛型方法的类

    ```java
    public class Generic {
        public `尖括号`T`尖括号` void show(T t) {
            System.out.println(t);
        }
    }
    ```

    ```java
    Generic g = new Generic();
    g.show("hello");
    g.show(12);
    ```



### 泛型接口

- 定义格式

  ```java
  修饰符 interface 接口名`尖括号`类型`尖括号` {  }
  ```

- 示例代码

  - 泛型接口

    ```java
    public interface Generic`尖括号`T`尖括号` {
        void show(T t);
    }
    ```

  - 泛型接口实现类

    ```java
    public class GenericImpl`尖括号`T`尖括号` implements Generic`尖括号`T`尖括号` {
        @Override
        public void show(T t) {
            System.out.println(t);
        }
    }
    ```



### 类型通配符

```java
- 类型通配符的作用

  ​	为了表示各种泛型List的父类，可以使用类型通配符	

- 类型通配符的分类

  - 类型通配符：`尖括号`?`尖括号`
    - List`尖括号`?`尖括号`：表示元素类型未知的List，它的元素可以匹配任何的类型
    - 这种带通配符的List仅表示它是各种泛型List的父类，并不能把元素添加到其中
  - 类型通配符上限：`尖括号`? extends 类型`尖括号`
    - List`尖括号`? extends Number`尖括号`：它表示的类型是Number或者其子类型
  - 类型通配符下限：`尖括号`? super 类型`尖括号`
    - List`尖括号`? super Number`尖括号`：它表示的类型是Number或者其父类型

- 类型通配符的基本使用
```



```java
public class GenericDemo {
    public static void main(String[] args) {
        //类型通配符：`尖括号`?`尖括号`
        List`尖括号`?`尖括号` list1 = new ArrayList`尖括号`Object`尖括号`();
        List`尖括号`?`尖括号` list2 = new ArrayList`尖括号`Number`尖括号`();
        List`尖括号`?`尖括号` list3 = new ArrayList`尖括号`Integer`尖括号`();
        System.out.println("--------");

        //类型通配符上限：`尖括号`? extends 类型`尖括号`
//        List`尖括号`? extends Number`尖括号` list4 = new ArrayList`尖括号`Object`尖括号`();
        List`尖括号`? extends Number`尖括号` list5 = new ArrayList`尖括号`Number`尖括号`();
        List`尖括号`? extends Number`尖括号` list6 = new ArrayList`尖括号`Integer`尖括号`();
        System.out.println("--------");

        //类型通配符下限：`尖括号`? super 类型`尖括号`
        List`尖括号`? super Number`尖括号` list7 = new ArrayList`尖括号`Object`尖括号`();
        List`尖括号`? super Number`尖括号` list8 = new ArrayList`尖括号`Number`尖括号`();
    }
}
```



## 可变参数

### 可变参数

- 可变参数介绍

  ​	可变参数又称参数个数可变，用作方法的形参出现，那么方法参数个数就是可变的了

- 可变参数定义格式

  ```java
  修饰符 返回值类型 方法名(数据类型… 变量名) {  }
  ```

- 可变参数的注意事项

  - 这里的变量其实是一个数组
  - 如果一个方法有多个参数，包含可变参数，可变参数要放在最后

```java
sum(10,20,30,40,50,60,70,80,90,100)

public static int sum(int... a) {
   int sum = 0;
   for(int i : a) {
       sum += i;
   }
   return sum;
}   
```





## Map 集合

Map集合的特点

- 键值对映射关系
- 一个键对应一个值
- 键不能重复，值可以重复
- 元素存取无序

```java
public class MapDemo01 {
    public static void main(String[] args) {
        //创建集合对象
        Map`尖括号`String,String`尖括号` map = new HashMap`尖括号`String,String`尖括号`();

        //V put(K key, V value) 将指定的值与该映射中的指定键相关联
        map.put("itheima001","林青霞");

        //输出集合对象
        System.out.println(map);
    }
}
```



### Map集合的基本功能

方法介绍

| 方法名                              | 说明                                 |
| ----------------------------------- | ------------------------------------ |
| V   put(K key,V   value)            | 添加元素                             |
| V   remove(Object key)              | 根据键删除键值对元素                 |
| void   clear()                      | 移除所有的键值对元素                 |
| boolean containsKey(Object key)     | 判断集合是否包含指定的键             |
| boolean containsValue(Object value) | 判断集合是否包含指定的值             |
| boolean isEmpty()                   | 判断集合是否为空                     |
| int size()                          | 集合的长度，也就是集合中键值对的个数 |

### Map集合的获取功能

方法介绍

| 方法名                                                       | 说明                     |
| ------------------------------------------------------------ | ------------------------ |
| V   get(Object key)                                          | 根据键获取值             |
| Set`尖括号`K`尖括号`   keySet()                              | 获取所有键的集合         |
| Collection`尖括号`V`尖括号`   values()                       | 获取所有值的集合         |
| Set`尖括号`Map.Entry`尖括号`K,V`尖括号``尖括号`   entrySet() | 获取所有键值对对象的集合 |

```java
// Set`尖括号`K`尖括号` keySet():获取所有键的集合
Set`尖括号`String`尖括号` keySet = map.keySet();
for(String key : keySet) {
	System.out.println(key);
}
```





### Map集合的遍历

#### 方式一

```java
Set`尖括号`String`尖括号` keySet = map.keySet();
// 增强for
for(String key : keySet) {
    String value = map.get(key);
    sout(key + ":" + value)
}
```

#### 方式二

```java
- 获取所有键值对对象的集合
  - Set`尖括号`Map.Entry`尖括号`K,V`尖括号``尖括号` entrySet()：获取所有键值对对象的集合
- 遍历键值对对象的集合，得到每一个键值对对象
  - 用增强for实现，得到每一个Map.Entry
- 根据键值对对象获取键和值
  - 用getKey()得到键
  - 用getValue()得到值
```



```java
// 获取键值对对象集合
Set`尖括号`Map.Entry`尖括号`String, String`尖括号``尖括号` entrySet = map.entrySet();
for(Map.Entry`尖括号`String, String`尖括号` me: entrySet) {
    String key = me.getKey();
    String value = me.getValue();
}
```



## Collections集合工具类

### Collections概述和使用

- Collections类的作用

  ​	是针对集合操作的工具类

- Collections类常用方法

  | 方法名                                                 | 说明                             |
  | ------------------------------------------------------ | -------------------------------- |
  | public static void sort(List`尖括号`T`尖括号` list)    | 将指定的列表按升序排序           |
  | public static void reverse(List`尖括号`?`尖括号` list) | 反转指定列表中元素的顺序         |
  | public static void shuffle(List`尖括号`?`尖括号` list) | 使用默认的随机源随机排列指定的列 |

```java
// 创建集合
List`尖括号`Integer`尖括号` list = new ArrayList`尖括号``尖括号`();

Collections.sort(list, new Comparator`尖括号`Student`尖括号`() {
    @Override
    public int compare(Student s1, Student s2) {
     // 按照年龄从小到大排序，年龄相同时，按照姓名的字母顺序排序
    int num = s1.getAge() - s2.getAge();
    int num2 = num == 0 ? s1.getName().compareTo(s2.getName()) : num;
    return num2;
  }
});
Collections.reverse(list);
Collections.shuffle(list);
```

