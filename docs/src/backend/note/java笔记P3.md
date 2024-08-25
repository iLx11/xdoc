## Stream流

按照下面的要求完成集合的创建和遍历

- 创建一个集合，存储多个字符串元素
- 把集合中所有以"张"开头的元素存储到一个新的集合
- 把"张"开头的集合中的长度为3的元素存储到一个新的集合
- 遍历上一步得到的集合

```java
// 创建一个集合，存储多个字符串元素
ArrayList`尖括号`String`尖括号` list = new ArrayList`尖括号`String`尖括号`();

//Stream流来改进
list.stream().filter(s -`尖括号` s.startsWith("张")).filter(s -`尖括号` s.length() == 3).forEach(System.out::println);
```

Stream流的好处

- 直接阅读代码的字面意思即可完美展示无关逻辑方式的语义：获取流、过滤姓张、过滤长度为3、逐一打印

- Stream流把真正的函数式编程风格引入到Java中



## Stream流的常见生成方式

生成Stream流的方式

- Collection体系集合

  ```java
  使用默认方法stream()生成流， default Stream`尖括号`E`尖括号` stream()
  ```

- Map体系集合

  把Map转成Set集合，间接的生成流

- 数组

  通过Stream接口的静态方法of(T... values)生成流

```java
//Collection体系的集合可以使用默认方法stream()生成流
List`尖括号`String`尖括号` list = new ArrayList`尖括号`String`尖括号`();
Stream`尖括号`String`尖括号` listStream = list.stream();

Set`尖括号`String`尖括号` set = new HashSet`尖括号`String`尖括号`();
Stream`尖括号`String`尖括号` setStream = set.stream();

//Map体系的集合间接的生成流
Map`尖括号`String,Integer`尖括号` map = new HashMap`尖括号`String, Integer`尖括号`();
Stream`尖括号`String`尖括号` keyStream = map.keySet().stream();
Stream`尖括号`Integer`尖括号` valueStream = map.values().stream();
Stream`尖括号`Map.Entry`尖括号`String, Integer`尖括号``尖括号` entryStream = map.entrySet().stream();

//数组可以通过Stream接口的静态方法of(T... values)生成流
String[] strArray = {"hello","world","java"};
Stream`尖括号`String`尖括号` strArrayStream = Stream.of(strArray);
Stream`尖括号`String`尖括号` strArrayStream2 = Stream.of("hello", "world", "java");
Stream`尖括号`Integer`尖括号` intStream = Stream.of(10, 20, 30);
```





### Stream流中间操作方法

概念

- 中间操作的意思是，执行完此方法之后，Stream流依然可以继续执行其他操作。

- 常见方法

  | 方法名                                                       | 说明                                                       |
  | ------------------------------------------------------------ | ---------------------------------------------------------- |
  | Stream`尖括号`T`尖括号` filter(Predicate predicate)          | 用于对流中的数据进行过滤                                   |
  | Stream`尖括号`T`尖括号` limit(long maxSize)                  | 返回此流中的元素组成的流，截取前指定参数个数的数据         |
  | Stream`尖括号`T`尖括号` skip(long n)                         | 跳过指定参数个数的数据，返回由该流的剩余元素组成的流       |
  | static `尖括号`T`尖括号` Stream`尖括号`T`尖括号` concat(Stream a, Stream b) | 合并a和b两个流为一个流                                     |
  | Stream`尖括号`T`尖括号` distinct()                           | 返回由该流的不同元素（根据Object.equals(Object) ）组成的流 |
  | Stream`尖括号`T`尖括号` sorted()                             | 返回由此流的元素组成的流，根据自然顺序排序                 |
  | Stream`尖括号`T`尖括号` sorted(Comparator comparator)        | 返回由该流的元素组成的流，根据提供的Comparator进行排序     |
  | `尖括号`R`尖括号` Stream`尖括号`R`尖括号` map(Function mapper) | 返回由给定函数应用于此流的元素的结果组成的流               |
  | IntStream mapToInt(ToIntFunction mapper)                     | 返回一个IntStream其中包含将给定函数应用于此流的元素的结果  |



```java
// sorted代码演示
// 按照字符串长度把数据在控制台输出
list.stream().sorted((s1,s2) -`尖括号` {
int num = s1.length()-s2.length();
int num2 = num==0?s1.compareTo(s2):num;
return num2;
}).forEach(System.out::println);

// map&mapToInt代码演示
//int sum() 返回此流中元素的总和
int result = list.stream().mapToInt(Integer::parseInt).sum();
System.out.println(result);
```



### Stream流终结操作方法

- 概念

  终结操作的意思是，执行完此方法之后，Stream流将不能再执行其他操作。

- 常见方法

  | 方法名                        | 说明                     |
  | ----------------------------- | ------------------------ |
  | void forEach(Consumer action) | 对此流的每个元素执行操作 |
  | long count()                  | 返回此流中的元素数       |



### 范例

- 男演员只要名字为3个字的前三人

- 女演员只要姓林的，并且不要第一个

- 把过滤后的男演员姓名和女演员姓名合并到一起

- 把上一步操作后的元素作为构造方法的参数创建演员对象,遍历数据

```java
 Stream.concat(manList.stream().filter(s -`尖括号` s.length() == 3).limit(3),
    womanList.stream().filter(s -`尖括号` s.startsWith("林")).skip(1)).map(Actor::new).
    forEach(p -`尖括号` System.out.println(p.getName()));
```





### Stream流的收集操作【

- 概念

  对数据使用Stream流的方式操作完毕后，可以把流中的数据收集到集合中。

- 常用方法

  | 方法名                         | 说明               |
  | ------------------------------ | ------------------ |
  | R collect(Collector collector) | 把结果收集到集合中 |

- 工具类Collectors提供了具体的收集方式

  | 方法名                                                       | 说明                   |
  | ------------------------------------------------------------ | ---------------------- |
  | public static `尖括号`T`尖括号` Collector toList()           | 把元素收集到List集合中 |
  | public static `尖括号`T`尖括号` Collector toSet()            | 把元素收集到Set集合中  |
  | public static  Collector toMap(Function keyMapper,Function valueMapper) | 把元素收集到Map集合中  |

```java
// 得到名字为3个字的流
Stream`尖括号`String`尖括号` listStream = list.stream().filter(s -`尖括号` s.length() == 3);

// 把使用Stream流操作完毕的数据收集到List集合中并遍历
List`尖括号`String`尖括号` names = listStream.collect(Collectors.toList());

Set`尖括号`Integer`尖括号` ages = setStream.collect(Collectors.toSet());

Map`尖括号`String, Integer`尖括号` map = arrayStream.collect(Collectors.toMap(s -`尖括号` s.split(",")[0], s -`尖括号` Integer.parseInt(s.split(",")[1])));
```



## 类加载器

#### 类加载器的作用

- 负责将.class文件加载到内存中，并为之生成对应的 java.lang.Class 对象。虽然我们不用过分关心类加载机制，但是了解这个机制我们就能更好的理解程序的运行！

#### JVM的类加载机制

- 全盘负责：就是当一个类加载器负责加载某个Class时，该Class所依赖的和引用的其他Class也将由该类加载器负责载入，除非显示使用另外一个类加载器来载入
- 父类委托：就是当一个类加载器负责加载某个Class时，先让父类加载器试图加载该Class，只有在父类加载器无法加载该类时才尝试从自己的类路径中加载该类
- 缓存机制：保证所有加载过的Class都会被缓存，当程序需要使用某个Class对象时，类加载器先从缓存区中搜索该Class，只有当缓存区中不存在该Class对象时，系统才会读取该类对应的二进制数据，并将其转换成Class对象，存储到缓存区

#### Java中的内置类加载器

- Bootstrap class loader：它是虚拟机的内置类加载器，通常表示为null ，并且没有父null
- Platform class loader：平台类加载器可以看到所有平台类 ，平台类包括由平台类加载器或其祖先定义的Java SE平台API，其实现类和JDK特定的运行时类
- System class loader：它也被称为应用程序类加载器 ，与平台类加载器不同。 系统类加载器通常用于定义应用程序类路径，模块路径和JDK特定工具上的类
- 类加载器的继承关系：System的父加载器为Platform，而Platform的父加载器为Bootstrap

#### ClassLoader 中的两个方法

- 方法分类

  | 方法名                                    | 说明                       |
  | ----------------------------------------- | -------------------------- |
  | static ClassLoader getSystemClassLoader() | 返回用于委派的系统类加载器 |
  | ClassLoader getParent()                   | 返回父类加载器进行委派     |

```java
ClassLoader c = ClassLoader.getSystemClassLoader();
System.out.println(c); //AppClassLoader

// ClassLoader getParent()：返回父类加载器进行委派
ClassLoader c2 = c.getParent();
System.out.println(c2); //PlatformClassLoader
```





## 反射

### 反射的概述

- 是指在运行时去获取一个类的变量和方法信息。然后通过获取到的信息来创建对象，调用方法的一种机制。由于这种动态性，可以极大的增强程序的灵活性，程序不用在编译期就完成确定，在运行期仍然可以扩展

### 获取Class类对象的三种方式

#### 三种方式分类

- 类名.class属性
- 对象名.getClass()方法
- Class.forName(全类名)方法

```java
//使用类的class属性来获取该类对应的Class对象
Class`尖括号`Student`尖括号` c1 = Student.class;
System.out.println(c1);

Class`尖括号`Student`尖括号` c2 = Student.class;
System.out.println(c1 == c2);
System.out.println("--------");

//调用对象的getClass()方法，返回该对象所属类对应的Class对象
Student s = new Student();
Class`尖括号`? extends Student`尖括号` c3 = s.getClass();
System.out.println(c1 == c3);
System.out.println("--------");

//使用Class类中的静态方法forName(String className)
Class`尖括号`?`尖括号` c4 = Class.forName("com.itheima_02.Student");
System.out.println(c1 == c4);
```



### 反射获取构造方法并使用

#### Class类获取构造方法对象的方法

- 方法分类

  | 方法名                                                       | 说明                           |
  | ------------------------------------------------------------ | ------------------------------ |
  | Constructor`尖括号`?`尖括号`[] getConstructors()             | 返回所有公共构造方法对象的数组 |
  | Constructor`尖括号`?`尖括号`[] getDeclaredConstructors()     | 返回所有构造方法对象的数组     |
  | Constructor`尖括号`T`尖括号` getConstructor(Class`尖括号`?`尖括号`... parameterTypes) | 返回单个公共构造方法对象       |
  | Constructor`尖括号`T`尖括号` getDeclaredConstructor(Class`尖括号`?`尖括号`... parameterTypes) | 返回单个构造方法对象           |

```java
Class`尖括号`?`尖括号` c = Class.forName("com.colorful.Student");
Constructor`尖括号`?`尖括号`[] cons = c.getDeclaredConstructors();
for(Constructor con : cons) {}

// Constructor提供了一个类的单个构造函数的信息和访问权限
Constructor`尖括号`?`尖括号` con = c.getConstructor();

// T newInstance(Object... initargs) 使用由此 Constructor对象表示的构造函数，使用指定的初始化参数来创建和初始化构造函数的声明类的新实例
Object obj = con.newInstance();
```



#### Constructor类用于创建对象的方法

| 方法名                           | 说明                       |
| -------------------------------- | -------------------------- |
| T newInstance(Object...initargs) | 根据指定的构造方法创建对象 |

```java
// 反射获取构造方法

// 公有构造方法
// ----------------------------------------------
Constructor`尖括号`?`尖括号` con = c.getConstructor(String.class, int.class, String.class);

Object obj = con.newInstance("林青霞", 30, "西安");

// 获取私有构造方法
// ----------------------------------------------
 Constructor`尖括号`?`尖括号` con = c.getDeclaredConstructor(String.class);

// 暴力反射
// public void setAccessible(boolean flag):值为true，取消访问检查
con.setAccessible(true);

Object obj = con.newInstance("林青霞");
```





### 反射获取成员变量并使用

#### Class类获取成员变量对象的方法

- 方法分类

  | 方法名                              | 说明                           |
  | ----------------------------------- | ------------------------------ |
  | Field[] getFields()                 | 返回所有公共成员变量对象的数组 |
  | Field[] getDeclaredFields()         | 返回所有成员变量对象的数组     |
  | Field getField(String name)         | 返回单个公共成员变量对象       |
  | Field getDeclaredField(String name) | 返回单个成员变量对象           |



#### Field类用于给成员变量赋值的方法

| 方法名                            | 说明                           |
| --------------------------------- | ------------------------------ |
| void set(Object obj,Object value) | 给obj对象的成员变量赋值为value |

 

```java

// 获取Class对象
Class`尖括号`?`尖括号` c = Class.forName("com.itheima_02.Student");

Field[] fields = c.getDeclaredFields();
for(Field field : fields) {
System.out.println(field);
}

Field addressField = c.getField("address");

// 获取无参构造方法创建对象
Constructor`尖括号`?`尖括号` con = c.getConstructor();
Object obj = con.newInstance();

// obj.addressField = "西安";

// Field提供有关类或接口的单个字段的信息和动态访问
// void set(Object obj, Object value) 将指定的对象参数中由此 Field对象表示的字段设置为指定的新值
addressField.set(obj,"西安"); //给obj的成员变量
```





### 反射获取成员方法并使用

#### Class类获取成员方法对象的方法

- 方法分类

  | 方法名                                                       | 说明                                       |
  | ------------------------------------------------------------ | ------------------------------------------ |
  | Method[] getMethods()                                        | 返回所有公共成员方法对象的数组，包括继承的 |
  | Method[] getDeclaredMethods()                                | 返回所有成员方法对象的数组，不包括继承的   |
  | Method getMethod(String name, Class`尖括号`?`尖括号`... parameterTypes) | 返回单个公共成员方法对象                   |
  | Method getDeclaredMethod(String name, Class`尖括号`?`尖括号`... parameterTypes) | 返回单个成员方法对象                       |

#### Method类用于执行方法的方法

| 方法名                                   | 说明                                                 |
| ---------------------------------------- | ---------------------------------------------------- |
| Object invoke(Object obj,Object... args) | 调用obj对象的成员方法，参数是args,返回值是Object类型 |

```java
// 获取Class对象
Class`尖括号`?`尖括号` c = Class.forName("com.itheima_02.Student");

// 返回一个包含 方法对象的数组
Method[] methods = c.getDeclaredMethods();
for(Method method : methods) {
    System.out.println(method);
}

// public void method1()
Method m = c.getMethod("method1");

// 获取无参构造方法创建对象
Constructor`尖括号`?`尖括号` con = c.getConstructor();
Object obj = con.newInstance();

// 在类或接口上提供有关单一方法的信息和访问权限
// Object invoke(Object obj, Object... args) 在具有指定参数的指定对象上调用此 方法对象表示的基础方法
// Object：返回值类型
// obj：调用方法的对象
// args：方法需要的参数
m.invoke(obj);
```



### 越过泛型检查

```java
// 创建集合
ArrayList`尖括号`Integer`尖括号` array = new ArrayList`尖括号`Integer`尖括号`();

Class`尖括号`? extends ArrayList`尖括号` c = array.getClass();
Method m = c.getMethod("add", Object.class);

m.invoke(array,"hello");
m.invoke(array,"world");
m.invoke(array,"java");
```



### 运行配置文件中指定类的指定方法

```java
// 加载数据
/*
      className=com.itheima_06.Student
      methodName=study
*/
Properties prop = new Properties();
FileReader fr = new FileReader("myReflect\\class.txt");
prop.load(fr);
fr.close();

String className = prop.getProperty("className");
String methodName = prop.getProperty("methodName");

// 通过反射来使用
Class`尖括号`?`尖括号` c = Class.forName(className);

Constructor`尖括号`?`尖括号` con = c.getConstructor();
 Object obj = con.newInstance();

Method m = c.getMethod(methodName);//study
m.invoke(obj);
```



## JDBC

本质：是官方（sun公司）定义的一套操作所有关系型数据库的规则，即接口。各个数据库厂商去实现这套接口，提供数据库驱动jar包。我们可以使用这套接口（JDBC）编程，真正执行的代码是驱动jar包中的实现类。

```java
// 1. 导入驱动jar包
// 2.注册驱动
Class.forName("com.mysql.jdbc.Driver");

// 3.获取数据库连接对象--------------------------------------
Connection conn = DriverManager.getConnection("jdbc:mysql://localhost:3306/db3", "root", "root");

// 4.定义sql语句--------------------------------------------
String sql = "update account set balance = 500 where id = 1";

// 5.获取执行sql的对象 Statement-----------------------------
    1. 获取执行sql 的对象
    Statement createStatement()
    PreparedStatement prepareStatement(String sql)  
    2. 管理事务：
    开启事务：setAutoCommit(boolean autoCommit) ：调用该方法设置参数为false，即开启事务
    提交事务：commit() 
    回滚事务：rollback()

Statement stmt = conn.createStatement();

// 6.执行sql-----------------------------------------------
1. boolean execute(String sql) ：可以执行任意的sql 了解 
2. int executeUpdate(String sql) ：执行DML（insert、update、delete）语句、DDL(create，alter、drop)语句
返回值：影响的行数，可以通过这个影响的行数判断DML语句是否执行成功 返回值`尖括号`0的则执行成功，反之，则失败。
3. ResultSet executeQuery(String sql)  ：执行DQL（select)语句

int count = stmt.executeUpdate(sql);

// 7.处理结果-----------------------------------------------
System.out.println(count);
// 8.释放资源
stmt.close();
conn.close();
```



### ResultSet

结果集对象,封装查询结果

boolean next(): 游标向下移动一行，判断当前行是否是最后一行末尾(是否有数据)，如果是，则返回false，如果不是则返回true

getXxx(参数):获取数据

Xxx：代表数据类型   如： int getInt() ,String getString()

参数：
1. int：代表列的编号,从1开始   如： getString(1)
2. String：代表列名称。 如： getDouble("balance")

```java
1. 游标向下移动一行
2. 判断是否有数据
3. 获取数据
    
ResultSet rs = stmt.executeQuery(sql);
return rs.next();//如果有下一行，则返回true    

// 循环判断游标是否是最后一行末尾。
while(rs.next()){
    //获取数据
    int id = rs.getInt(1);
    String name = rs.getString("name");
    double balance = rs.getDouble(3);
    System.out.println(id + "---" + name + "---" + balance);
}
```



### SQL注入问题

在拼接sql时，有一些sql的特殊关键字参与字符串的拼接。会造成安全性问题

解决sql注入问题：使用PreparedStatement对象来解决
预编译的SQL：参数使用?作为占位符

```java
// 定义sql
//注意：sql的参数使用？作为占位符。 如：
select * from user where username = ? and password = ?;

// 获取执行sql语句的对象 
PreparedStatement stmt = Connection.prepareStatement(String sql);
// 给？赋值：
方法： setXxx(参数1,参数2)
参数1：？的位置编号 从1 开始
参数2：？的值
// 执行sql，接受返回结果，不需要传递sql语句
// 处理结果
// 释放资源
```



## JDBC工具类 ： JDBCUtils

配置文件
jdbc.properties
url=
user=
password=

```java
// 1. 创建Properties集合类。
Properties pro = new Properties();

//获取src路径下的文件的方式---`尖括号`ClassLoader 类加载器
ClassLoader classLoader = JDBCUtils.class.getClassLoader();
URL res  = classLoader.getResource("jdbc.properties");
String path = res.getPath();
System.out.println(path);///D:/IdeaProjects/itcast/out/production/day04_jdbc/jdbc.properties

// 2. 加载文件
// pro.load(new FileReader("D:\\IdeaProjects\\itcast\\day04_jdbc\\src\\jdbc.properties"));
pro.load(new FileReader(path));

// 3. 获取数据，赋值
url = pro.getProperty("url");
user = pro.getProperty("user");
password = pro.getProperty("password");
driver = pro.getProperty("driver");
// 4. 注册驱动
Class.forName(driver);
```



## JDBC控制事务：

1. 事务：一个包含多个步骤的业务操作。如果这个业务操作被事务管理，则这多个步骤要么同时成功，要么同时失败。
2. 操作：
	1. 开启事务
	2. 提交事务
	3. 回滚事务
3. 使用Connection对象来管理事务
	* 开启事务：setAutoCommit(boolean autoCommit) ：调用该方法设置参数为false，即开启事务
		* 在执行sql之前开启事务
	* 提交事务：commit() 
		* 当所有sql都执行完提交事务
	* 回滚事务：rollback() 
		* 在catch中回滚事务

```java
try {
conn.commit();
}catch(Exception e) {
    //事务回滚
    try {
if(conn != null) {
    conn.rollback();
}
    } catch (SQLException e1) {
e1.printStackTrace();
    }
    e.printStackTrace();
}finally {
    JDBCUtils.close(pstmt1,conn);
JDBCUtils.close(pstmt2,null);
}
```





## 数据库连接池

1. 概念：其实就是一个容器(集合)，存放数据库连接的容器。
	    当系统初始化好后，容器被创建，容器中会申请一些连接对象，当用户来访问数据库时，从容器中获取连接对象，用户访问完之后，会将连接对象归还给容器。

2. 好处：
	1. 节约资源
	2. 用户访问高效

3. 实现：
	1. 标准接口：DataSource   javax.sql包下的
		1. 方法：
			* 获取连接：getConnection()
			* 归还连接：Connection.close()。如果连接对象Connection是从连接池中获取的，那么调用Connection.close()方法，则不会再关闭连接了。而是归还连接

	2. 一般我们不去实现它，有数据库厂商来实现
		1. C3P0：数据库连接池技术
		2. Druid：数据库连接池实现技术，由阿里巴巴提供的

### C3P0：数据库连接池技术

```java
/*
    1. 导入jar包 (两个) c3p0-0.9.5.2.jar mchange-commons-java-0.2.12.jar 
    不要忘记导入数据库驱动jar包
    2. 定义配置文件：
    名称： c3p0.properties 或者 c3p0-config.xml
    路径：直接将文件放在src目录下即可。
    3. 创建核心对象 数据库连接池对象 ComboPooledDataSource
    4. 获取连接： getConnection
*/

// 1.创建数据库连接池对象
DataSource ds  = new ComboPooledDataSource();
// 2. 获取连接对象
Connection conn = ds.getConnection();
```

### Druid：数据库连接池

```java
/*
    1. 导入jar包 druid-1.0.9.jar
    2. 定义配置文件：
    是properties形式的
    可以叫任意名称，可以放在任意目录下
    3. 加载配置文件。Properties
    4. 获取数据库连接池对象：通过工厂来来获取  DruidDataSourceFactory
    5. 获取连接：getConnection
*/

// 3.加载配置文件
Properties pro = new Properties();
InputStream is = DruidDemo.class.getClassLoader().getResourceAsStream("druid.properties");
pro.load(is);
// 4.获取连接池对象
DataSource ds = DruidDataSourceFactory.createDataSource(pro);
// 5.获取连接
Connection conn = ds.getConnection();
```

### JDBCUtils

```java
public class JDBCUtils {
  //1.定义成员变量 DataSource
  private static DataSource ds ;
  static{
      try {
          //1.加载配置文件
          Properties pro = new Properties();
          pro.load(JDBCUtils.class.getClassLoader().getResourceAsStream("druid.properties"));
          //2.获取DataSource
          ds = DruidDataSourceFactory.createDataSource(pro);
      } catch (IOException e) {
          e.printStackTrace();
      } catch (Exception e) {
          e.printStackTrace();
      }
  }

  /**
   * 获取连接
   */
  public static Connection getConnection() throws SQLException {
      return ds.getConnection();
  }
  /**
   * 获取连接池方法
   */
  public static DataSource getDataSource(){
	  return  ds;
  }
  /**
   * 释放资源
   */
  public static void close(ResultSet rs, Statement stmt,Connection conn){
     /* if(stmt != null){
          try {
              stmt.close();
          } catch (SQLException e) {
              e.printStackTrace();
          }
      }
      if(conn != null){
          try {
              conn.close();//归还连接
          } catch (SQLException e) {
              e.printStackTrace();
          }
      }*/
     close(null,stmt,conn);
  }
```



## Spring JDBC

Spring框架对JDBC的简单封装。提供了一个JDBCTemplate对象简化JDBC的开发

```java
1. 导入jar包
2. 创建JdbcTemplate对象。依赖于数据源DataSource
  * JdbcTemplate template = new JdbcTemplate(ds);

3. 调用JdbcTemplate的方法来完成CRUD的操作
  * update():执行DML语句。增、删、改语句
    String sql = "delete from emp where id = ?";
	int count = template.update(sql, 1015);

  * queryForMap():查询结果将结果集封装为map集合，将列名作为key，将值作为value 将这条记录封装为一个map集合
  	* 注意：这个方法查询的结果集长度只能是1
    String sql = "select * from emp where id = ? or id = ?";
	Map`尖括号`String, Object`尖括号` map = template.queryForMap(sql, 1001,1002);

  * queryForList():查询结果将结果集封装为list集合
  	* 注意：将每一条记录封装为一个Map集合，再将Map集合装载到List集合中
    String sql = "select * from emp";
	List`尖括号`Map`尖括号`String, Object`尖括号``尖括号` list = template.queryForList(sql);    
  * query():查询结果，将结果封装为JavaBean对象
  	* query的参数：RowMapper
    * 一般我们使用BeanPropertyRowMapper实现类。可以完成数据到JavaBean的自动封装
    * new BeanPropertyRowMapper`尖括号`类型`尖括号`(类型.class)
    String sql = "select * from emp";
	List`尖括号`Emp`尖括号` list = template.query(sql, new BeanPropertyRowMapper`尖括号`Emp`尖括号`(Emp.class));

  * queryForObject：查询结果，将结果封装为对象
  	* 一般用于聚合函数的查询
  String sql = "select count(id) from emp";
  Long total = template.queryForObject(sql, Long.class);	
```





## Maven 

Maven 是一个项目管理工具，它包含了一个项目对象模型 (POM：Project Object Model)，一组标准集合，一个项目生命周期(Project Lifecycle)，一个依赖管理系统(Dependency Management System)，和用来运行定义在生命周期阶段(phase)中插件(plugin)目标(goal)的逻辑。 

### Maven 工程的目录结构 

src/main/java —— 存放项目的.java 文件 
src/main/resources —— 存放项目资源文件，如spring, hibernate 配置文件 
src/test/java —— 存放所有单元测试.java 文件，如JUnit 测试类 
src/test/resources —— 测试资源文件 
target —— 项目输出位置，编译后的class 文件会输出到此目录 
pom.xml——maven 项目核心配置文件 



### Maven常用命令

#### compile 

compile 是 maven 工程的编译命令，作用是将 src/main/java 下的文件编译为 class 文件输出到 target
目录下。 

#### test 

test 是maven 工程的测试命令 mvn test，会执行src/test/java 下的单元测试类。 
cmd 执行mvn test 执行src/test/java 下单元测试类，

#### clean 

clean 是maven 工程的清理命令，执行 clean 会删除target 目录及内容。 

#### package 

package 是maven 工程的打包命令，对于java 工程执行package 打成jar 包，对于web 工程打成war
包。 

####  install 

install 是maven 工程的安装命令，执行install 将maven 打成jar 包或war 包发布到本地仓库。 
从运行结果中，可以看出： 
当后面的命令执行时，前面的操作过程也都会自动执行， 

#### Maven 指令的生命周期 

maven 对项目构建过程分为三套相互独立的生命周期，请注意这里说的是“三套”，而且“相互独立”，
这三套生命周期分别是： 

Clean Lifecycle 在进行真正的构建之前进行一些清理工作。 
Default Lifecycle 构建的核心部分，编译，测试，打包，部署等等。 
Site Lifecycle 生成项目报告，站点，发布站点。 



###  maven 的概念模型 

Maven 包含了一个项目对象模型 (Project Object Model)，一组标准集合，一个项目生命周期(Project 
Lifecycle)，一个依赖管理系统(Dependency Management System)，和用来运行定义在生命周期阶段
(phase)中插件(plugin)目标(goal)的逻辑。 



#### 项目对象模型 (Project Object Model) 

一个maven 工程都有一个pom.xml 文件，通过pom.xml 文件定义项目的坐标、项目依赖、项目信息、
插件目标等。 



####  依赖管理系统(Dependency Management System) 

通过maven 的依赖管理对项目所依赖的jar 包进行统一管理。 
比如：项目依赖junit4.9，通过在pom.xml 中定义junit4.9 的依赖即使用junit4.9，如下所示是junit4.9
的依赖定义： 



#### 一个项目生命周期(Project Lifecycle) 

 使用maven 完成项目的构建，项目构建包括：清理、编译、测试、部署等过程，maven 将这些
过程规范为一个生命周期，



###  idea 开发 maven 项目

打开 -`尖括号` File -`尖括号` Settings 配置 maven 



### 依赖范围 

A 依赖 B，需要在 A 的 pom.xml 文件中添加 B 的坐标，添加坐标时需要指定依赖范围，依赖范围包括： 

 compile：编译范围，指A 在编译时依赖B，此范围为默认依赖范围。编译范围的依赖会用在
编译、测试、运行，由于运行时需要所以编译范围的依赖会被打包。 

 provided：provided 依赖只有在当JDK 或者一个容器已提供该依赖之后才使用， provided 依
赖在编译和测试时需要，在运行时不需要，比如：servlet api 被tomcat 容器提供。 

 runtime：runtime 依赖在运行和测试系统的时候需要，但在编译的时候不需要。比如：jdbc
的驱动包。由于运行时需要所以runtime 范围的依赖会被打包。 

 test：test 范围依赖 在编译和运行时都不需要，它们只有在测试编译和测试运行阶段可用，
比如：junit。由于运行时不需要所以test 范围依赖不会被打包。 

 system：system 范围依赖与 provided 类似，但是你必须显式的提供一个对于本地系统中JAR
文件的路径，需要指定systemPath 磁盘路径，system 依赖不推荐使用。 

