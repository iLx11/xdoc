---
title: C++笔记
date: 2022-11-18 10:40:10
tags:
categories:
classes: 笔记
---



# C++

```c++
//输出
std::cout << "123123\n";
//输入
unsigned int aa;
std::cin >> aa

//系统        
system("cls/ shutdown /a/ pause ");

//定义变量
int year{ 12 }
```

##### 强制转换

```c++
static_cast<int>
//(int) c
```

##### 枚举

```c++
enum class EquipLv: int {
    normal = 10,
    high,
    rare
};
EquipLv weapon1 (EquipLv::normal);
EquipLv weapon2 (EquipLv::rare);
```

##### 命名空间

```c++
using namespace std;
//之后不用使用std
/
using std::cin/cout;
```



```c++
namespace Game {
	int HP{ 1000 };
    namespace Weapon {
        int damage{ 3000 }
    }
}
//使用时 ‘::’ 限定符
int c = Game::Weapon::HP;
//不能放在函数体内

```

if 与 switch 中的临时变量

```c++
//17语法
if(int a, b, c; 条件)

switch(int a, b; 条件)
```

##### 获取键盘输入

```c++
#include <coion.h>

_getch();
```

##### 填充

```c++
#include <iomanip>

std::cout << std::setfill('0');
std::cout << std::setw(3) << xx
```

##### 遍历数组

```c++
for(int aa : 数组);
```

##### 定义数组

```c++
#include <array>
//较为安全的定义数组
std::array<int, 3> shu{1, 2, 3};
//填充
shu.fill(23);
//元素个数
shu.size();
//访问成员
shu.at(2)
    
//向量
std::vector<int> studentId;
//动态添加一个元素
studentId.push_back(9600);
studentId.clear();
//判断是否为空
studentId.empty();
```

##### 判断一段程序是由c编译还是由c++编译程序编译的？

```cpp
#ifdef __cplusplus
    cout << "c++";
#else
    printf("c");
#endif
```

### 动态内存分配

```c++
int * pa = (int *) malloc(4);
//
int * pa = new int[5];

pa = (int *) realloc(pa, 8);

//内存释放
free(pa);
//释放new分配的内存
delete[] pa;
```

##### 风险：

碎片化的内存



### 引用

不能改变其他引用

```c++
int a{500};
int & la{a};
int & lla{a};
```

数组引用

```c++
int a[100];
int (&b)[100] = a
```



#### 智能指针

```c++
std::unique_ptr<类型> intPtr{};
//
std::unique_ptr<类型> intPtr{std::make_unique<int []>(5 >个数) };

//释放内存,地址清零
intPtr.reset();
```

共享指针

```c++
std::share_ptr<类型> intPtr{};

```

安全的C语言输入

```c++
char str[0xff]
wscanf_s("%s", wstr, 可接受最大字符值);
```

### 结构体

```c++
typedef struct Role {
    int HP;
}* PRole, * ARole;

Role user;
PRole puser = &user;
//
PRole puesr = new Role;
//使用
puser->HP;
```

#### union

```c++
union USER {
    short sHp;
    int nHp;
}
```

### 字符串

```c++
//截取起始位置， 个数
std::string str{"sdfsjd 123",1 ,3};
using std::string;
str.length();

//复制，（个数， ‘字符’）
std::string str(6, 'a');

//拼接
str.append("234");
//截取
str.substr(1);/ str.substr(1, 3);
//比较
str.compare("123");/ str.compare(1, 3, "123");
//查找/反向为 rfind
str.find("123");/ str.find("123", 1, 3);

//未找到返回 std:string::npos int返回 -1

//插入
str.insert(位置, "123");
//insert(位置, “123”, 截取起始, 截取长度);
str.insert(位置, 个数, '8'); // 插入字符

//替换 长度
str.replace(1, 3, "123");

//删除，清除
str.erase(); / str.clear();

```

计算中文字符长度

```c++
if(str[i] < 0) i++;
count += 1;
```

## 函数

```c++
//传递引用参数  
bool act(const Role& Acter)
//默认参数, 放在最后
int add(int a, int b = 100)
```

##### 不定量参数

```c++
int Average(int count, ...) {
    char * arg;
    //存储
    va_start(arg, count);
    //依次读取
    int x = va_arg(arg, int);
    //释放
    va_end(arg);
}
```

#### 函数指针

声明函数指针`类型`

```c++
int Add(int a, int b) {
    return a + b;
}

typedef char(*pfAdd) (int, int);
//
using pFAdd = char (*) (int, int);

pfAdd pAdd = (pfAdd) Add;
```

声明函数指针

```c++
int (*pxAdd) (int, int) = Add;

pxAdd(100, 100);
```

# 类

### struct 与 class 区别

C++ 中的 struct 可以包含成员函数，也能继承，也可以实现多态。

但在 C++ 中，使用 class 时，类中的成员默认都是 `private` 属性的，而使用 struct 时，结构体中的成员默认都是 public 属性的。class 继承默认是 private 继承，而 struct 继承默认是 public 继承。

C++ 中的 class 可以使用模板，而 struct 不能使用模板。

## 重载

### 函数重载

在同一个作用域内，可以声明几个功能类似的同名函数，但是这些同名函数的形式参数（指参数的个数、类型或者顺序）必须不同。不能仅通过返回类型的不同来重载函数。

```c++
void print(int i) {
	cout << "整数为: " << i << endl;
}
 
void print(double  f) {
	cout << "浮点数为: " << f << endl;
}
 
void print(char c[]) {
	cout << "字符串为: " << c << endl;
}
```

### 运算符重载

重载的运算符是带有特殊名称的函数，函数名是由关键字 operator 和其后要重载的运算符符号构成的。与其他函数一样，重载运算符有一个返回类型和一个参数列表。

```c++
// 重载二元运算符（ + ）
class Role {
    public:
    	Role operator+(const Role& role) {
    		Role newRole;
    		newRole.width = this.width + role.width;
            return newRole;
		}
}
Role r1, r2, r3;
r1 = r2 + r3;

// 关系运算符
// 重载小于运算符（ < ）
bool operator <(const Distance& d)
{
   if(feet < d.feet)
   {
		return true;
   }
   if(feet == d.feet && inches < d.inches)
   {
		return true;
   }
   return false;
}
if( D1 < D2 )
{
   cout << "D1 is less than D2 " << endl;
}

// 赋值运算符（=）
void operator = (const Distance& D) {
    feet = D.feet;
    inches = D.inches;
}

// ([])
int& operator[](int i)
{
      if( i > SIZE )
      {
           cout << "索引超过最大值" <<endl; 
           // 返回第一个元素
           return arr[0];
      }
      return arr[i];
}
```

#### 可重载运算符

| 双目算术运算符 | + (加)，-(减)，*(乘)，/(除)，% (取模)                        |
| -------------- | ------------------------------------------------------------ |
| 关系运算符     | ==(等于)，!= (不等于)，< (小于)，> (大于)，<=(小于等于)，>=(大于等于) |
| 逻辑运算符     | \|\|(逻辑或)，&&(逻辑与)，!(逻辑非)                          |
| 单目运算符     | + (正)，-(负)，*(指针)，&(取地址)                            |
| 自增自减运算符 | ++(自增)，--(自减)                                           |
| 位运算符       | \| (按位或)，& (按位与)，~(按位取反)，^(按位异或),，<< (左移)，>>(右移) |
| 赋值运算符     | =, +=, -=, *=, /= , % = , &=, \|=, ^=, <<=, >>=              |
| 空间申请与释放 | new, delete, new[ ] , delete[]                               |
| 其他运算符     | **()**(函数调用)，**->**(成员访问)，**,**(逗号)，**[]**(下标) |

下面是不可重载的运算符列表：

|      |      |      |      |
| ---- | ---- | ---- | ---- |
| ::   | .*   | .    | ?:   |



## 构造

### 拷贝构造函数

拷贝构造函数通常用于：

- 通过使用另一个同类型的对象来初始化新创建的对象。
- 复制对象把它作为参数传递给函数。
- 复制对象，并从函数返回这个对象。

如果在类中没有定义拷贝构造函数，编译器会自行定义一个。

如果类带有指针变量，并有动态内存分配，则它必须有一个拷贝构造函数。

拷贝构造函数的最常见形式如下：

```c++
class Line {
    public: 
    Line(const Line& obj);
    private:
    int* ptr;
}
Line::Line(const Line& obj) {
    ptr = new int;
	*ptr = *obj.ptr;
}
int main() {
    Line line2 = line1; // 这里调用了拷贝构造函数
}
```





## 模板

#### 函数模板

```c++
//设置默认值 
template <typename t1=int, typename t2,,,> 
t1 ave(t1 a, t2 b) {
    t1 x;
    t2 *px;
    return (a + b)/2;
}
//指定类型
ave <int, float> (123, 123); 

//模板参数
template <typename t1, short count>
t1 ave(t1 (&ary) [count]) {
    for (int i = 0; i < count; i++)
}
```

头文件

```c++
//多次引用只生效一次
#pragma once
//有定义才执行
#ifdef aa
```



## 外联

```c++
class Role {
    private: 
		int damage;
    public: 
    	int hp;
    	void act();
    	void init() {
            hp = 1;
        }
   //构造函数
   Role() {
       cout << "构造";
   }
   //默认构造
    ROLE() = default;
}

//定义对象
Role role;
```

### 外联成员函数

```c++
class Role {
    public :
    	int width;
    	int height;
    	//成员函数声明
    	void set(int w, int h);
}
void Role::set(int w, int h) {
    width = w;
    height = h;
}
```

### 外联构造

```c++
//无参构造
Role::Role {
    cout << "构造函数" << endl;
}
//有参构造
Role::Role(int w, int h) {
    width = w;
    height = h;
    cout << "有参构造" << endl;
}
```

#### 成员初始化列表构造

> 效率更高
>
> 在某些情况下，只能用这种方式进行初始化

```c++
Role::Role(int _w, int _h): width{w}, heigth{h} {
	cout << "有参构造" << endl;
}
```

##### 禁止类型转换

```c++
explicit Role() {}
```

### 析构函数

类的**析构函数**是类的一种特殊的成员函数，它会在每次删除所创建的对象时执行。

析构函数在类的生命结束时，自动调用，若没有则会添加一个空的析构函数，且只能有一个

```c++
//默认析构函数
~Role = default;

Role::~Role(void) {
    cout << "对象已被删除" << endl;
}
```

#### 指向类的指针

```c++
//定义类指针
Role* ptrRole;
//访问成员
ptrRole->print();
```



### Static 静态成员函数

当我们声明类的成员为静态时，这意味着无论创建多少个类的对象，静态成员都只有一个副本。

```c++
class Role {
    public:
    	static int objectCount;
}
```

##### 初始化静态成员

```c++
int Role::objectCount = 0;
```

##### 访问静态成员

```c++
Role::objectCount
    
//通过函数访问
static int getOC() {
    return objectCount;
}
Role::getOC();
```



> 没有创建实例，都可以访问静态成员函数
>
> 静态成员函数不能访问非静态成员变量
>
> 不能是 const
>
> 不能使用 this 指针
>
> (在 C++ 中，每一个对象都能通过 **this** 指针来访问自己的地址。**this** 指针是所有成员函数的隐含参数。因此，在成员函数内部，它可以用来指向调用对象)



## 友元

类的友元函数是定义在类外部，但有权访问类的所有私有（private）成员和保护（protected）成员。尽管友元函数的原型有在类的定义中出现过，但是友元函数并不是成员函数。

### 友元函数

友元函数没有 **this** 指针，因为友元不是类的成员。只有成员函数才有 **this** 指针。

```c++
class Role {
    public : 
    	int width;
    	int height;
    	friend void print(Role role);
}
//友元函数并不属于 Role 类
void print(Role role) {
    cout << "width" << role.width << endl;
    cout << "heigth" << role.heigth << endl;
}
```

### 友元类

```c++
//声明类 Role 的所有成员函数作为类 RoleTwo 的友元
public: 
	friend class RoleTwo;

class RoleTwo {
    public:
    	void print(Role role) {
            cout << role.width << endl;
        }
}
```



### 嵌套类

```c++
class Role {
	class Weapon {
        int lv;
    }
}
//嵌套类定义对象
Role::Weapon wp;
```



## 继承

继承允许我们依据另一个类来定义一个类，这使得创建和维护一个应用程序变得更容易。这样做，也达到了重用代码功能和提高执行效率的效果。

当创建一个类时，您不需要重新编写新的数据成员和成员函数，只需指定新建的类继承了一个已有的类的成员即可。这个已有的类称为**基类**，新建的类称为**派生类**。

```c++
// 基类
class Animal {
    // eat() 函数
    // sleep() 函数
};

//派生类
class Dog : public Animal {
    // bark() 函数
};

Dog dog;
dog.eat();
```

> 派生类可以访问基类中所有的非私有成员。
>
> 因此基类成员如果不想被派生类的成员函数访问，则应在基类中声明为 private。

一个派生类继承了所有的基类方法，但下列情况除外：

- 基类的构造函数、析构函数和拷贝构造函数。

- 基类的重载运算符。

- 基类的友元函数。

  ##### 继承类型

  当一个类派生自基类，该基类可以被继承为 **public、protected** 或 **private** 几种类型。继承类型是通过上面讲解的访问修饰符 access-specifier 来指定的。

  我们几乎不使用 **protected** 或 **private** 继承，通常使用 **public** 继承。当使用不同类型的继承时，遵循以下几个规则：

  - **公有继承（public）：**当一个类派生自**公有**基类时，基类的**公有**成员也是派生类的**公有**成员，基类的**保护**成员也是派生类的**保护**成员，基类的**私有**成员不能直接被派生类访问，但是可以通过调用基类的**公有**和**保护**成员来访问。
  - **保护继承（protected）：** 当一个类派生自**保护**基类时，基类的**公有**和**保护**成员将成为派生类的**保护**成员。
  - **私有继承（private）：**当一个类派生自**私有**基类时，基类的**公有**和**保护**成员将成为派生类的**私有**成员。

### 多继承

多继承即一个子类可以有多个父类，它继承了多个父类的特性。

```c++
// 派生类
class ChildrenWorker : public Children,public Worker
    
// 派生类构造函数
ChildrenWorker(string name,float salary,float score):Worker(salary),Children(score),m_name(name)
    
// 构造顺序
// Chidren Worker ChildrenWorker
```

基类构造函数的调用顺序和它们在派生类构造函数中出现的顺序无关，而是和声明派生类时基类出现的顺序相同。

多继承如果多个基类中有相同的成员变量或者成员函数，那么此时就会存在成员名字冲突的问题，如果存在名字冲突，我们在调用时，就必须显式声明需要调用的成员。

```c++
void info()
{
	Worker::show();
	Children::show();
}
```

### 虚继承

在使用多继承时，如果发生了菱形继承，那么就会出现数据冗余的问题，为了解决菱形继承出现的数据冗余的问题，C++ 提出了虚继承，虚继承使得派生类中只保留一份间接基类的成员。

虚继承的目的是让某个类做出声明，承诺愿意共享它的基类。其中，这个被共享的基类就称为虚基类（Virtual Base Class），菱形继承中的顶层类 就是一个虚基类。在这种机制下，不论虚基类在继承体系中出现了多少次，在派生类中都只包含一份虚基类的成员。

```c++
class A{}
class B: virtual public A{}
class C: virtual public A{}
class D: public B, public C{}
```



## 多态

**多态**按字面的意思就是多种形态。当类之间存在层次结构，并且类之间是通过继承关联时，就会用到多态。

C++ 多态意味着调用成员函数时，会根据调用函数的对象的类型来执行不同的函数。基类指针指向基类对象时就使用基类的成员（包括 成员函数和 成员变量），指向派生类对象时就使用派生类的成员。

```c++
class Role {
    public:
    	void mission() {
            cout << "主线任务";
        }
}
class Npc: public Role {
    public:
    	void mission() {
            cout << "支线任务";
        }
}
class Vip: public Role {
    public:
    	void mission() {
            cout << "个人任务";
        }
}
Role* role;
Npc npc;
vip vip;

```

这就是静态多态**，或**静态链接** - 函数调用在程序执行前就准备好了。有时候这也被称为**早绑定**，因为 mission() 函数在程序编译期间就已经设置好了。

```c++
role = &npc;
role.mission();
//主线任务

role = &vip;
role.mission();
//主线任务
```

## 虚函数

**虚函数** 是在基类中使用关键字 **virtual** 声明的函数。在派生类中重新定义基类中定义的虚函数时，会告诉编译器不要静态链接到该函数。

我们想要的是在程序中任意点可以根据所调用的对象类型来选择调用的函数，这种操作被称为**动态链接**，或**后期绑定**。

#### 加入 virtual 关键字

```c++
virtual void mission() {}

role = &npc;
role.mission();
//支线任务

role = &vip;
role.mission();
//个人任务
```

#### 纯虚函数

您可能想要在基类中定义虚函数，以便在派生类中重新定义该函数更好地适用于对象，但是您在基类中又不能对虚函数给出有意义的实现，这个时候就会用到纯虚函数。

```c++
// pure virtual function
virtual int mission() = 0;
```





## 数据抽象

数据抽象是指，只向外界提供关键信息，并隐藏其后台的实现细节，即只表现必要的信息而不呈现细节。

数据抽象是一种依赖于接口和实现分离的编程（设计）技术。

#### 数据抽象的好处  

数据抽象有两个重要的优势：

- 类的内部受到保护，不会因无意的用户级错误导致对象状态受损。
- 类实现可能随着时间的推移而发生变化，以便应对不断变化的需求，或者应对那些要求不改变用户级代码的错误报告。

如果只在类的私有部分定义数据成员，编写该类的作者就可以随意更改数据。如果实现发生改变，则只需要检查类的代码，看看这个改变会导致哪些影响。如果数据是公有的，则任何直接访问旧表示形式的数据成员的函数都可能受到影响。

抽象把代码分离为接口和实现。所以在设计组件时，必须保持接口独立于实现，这样，如果改变底层实现，接口也将保持不变。

在这种情况下，不管任何程序使用接口，接口都不会受到影响，只需要将最新的实现重新编译即可。



## 数据封装

封装是面向对象编程中的把数据和操作数据的函数绑定在一起的一个概念，这样能避免受到外界的干扰和误用，从而确保了安全。数据封装引申出了另一个重要的 OOP 概念，即**数据隐藏**。

**数据封装**是一种把数据和操作数据的函数捆绑在一起的机制，**数据抽象**是一种仅向用户暴露接口而把具体的实现细节隐藏起来的机制。

通过创建**类**来支持封装和数据隐藏（public、protected、private）。我们已经知道，类包含私有成员（private）、保护成员（protected）和公有成员（public）成员。默认情况下，在类中定义的所有项目都是私有的。



## 接口（抽象类）

接口描述了类的行为和功能，而不需要完成类的特定实现。

C++ 接口是使用**抽象类**来实现的，抽象类与数据抽象互不混淆，数据抽象是一个把实现细节与相关的数据分离开的概念。

如果类中至少有一个函数被声明为纯虚函数，则这个类就是抽象类。

```c++
class Role {
    public:
    	//纯虚函数
    	virtual void mission() = 0;
    	void setWidth(int w) {
            width = w;
        }
    	void setHeigth(int h) {
            height = h;
        }
    protected:
    	int width;
    	int height;
}
class Npc: public Role {
    public:
    	//重写纯虚函数
    	void mission() {
            cout << "支线任务";
            cout << width * heigth;
        }
}
class Vip: public Role {
    public:
    	//重写纯虚函数
    	void mission() {
            cout << "个人任务";
            cout << width * heigth;
        }
}
```



## 文件和流

### 数据类型

| 数据类型 | 描述                                                         |
| :------- | :----------------------------------------------------------- |
| ofstream | 该数据类型表示输出文件流，用于创建文件并向文件写入信息。     |
| ifstream | 该数据类型表示输入文件流，用于从文件读取信息。               |
| fstream  | 该数据类型通常表示文件流，且同时具有 ofstream 和 ifstream 两种功能，这意味着它可以创建文件，向文件写入信息，从文件读取信息。 |

要在 C++ 中进行文件处理，必须在 C++ 源代码文件中包含头文件

```c++
#include <iostream>
#include <fstream>
```

#### open()函数

第一参数指定要打开的文件的名称和位置，第二个参数定义文件被打开的模式。

| 模式标志   | 描述                                                         |
| :--------- | :----------------------------------------------------------- |
| ios::app   | 追加模式。所有写入都追加到文件末尾。                         |
| ios::ate   | 文件打开后定位到文件末尾。                                   |
| ios::in    | 打开文件用于读取。                                           |
| ios::out   | 打开文件用于写入。                                           |
| ios::trunc | 如果该文件已经存在，其内容将在打开文件之前被截断，即把文件长度设为 0。 |

您可以把以上两种或两种以上的模式结合使用。例如，如果您想要以写入模式打开文件，并希望截断文件，以防文件已存在，那么您可以使用下面的语法：

```
ofstream outfile;
outfile.open("file.dat", ios::out | ios::trunc );
```

类似地，您如果想要打开一个文件用于读写，可以使用下面的语法：

```
ifstream  afile;
afile.open("file.dat", ios::out | ios::in );
```

### 关闭文件

当 C++ 程序终止时，它会自动关闭刷新所有流，释放所有分配的内存，并关闭所有打开的文件。

```c++
void close();
```

### 写入文件

```c++
char data[100];
ofstream outfile;
outfile.open("test.txt");

//写入操作
outfile << data << endl;
outfile.close();
```

### 读取文件

```c++
char data[100];
ofstream infile;
infile.open("text.txt");

//读取文件操作，存在data中
infile >> data;
infile.close();
```



### 文件位置指针

文件位置指针是一个整数值，指定了从文件的起始位置到指针所在位置的字节数。

```c++
/ 定位到 fileObject 的第 n 个字节（假设是 ios::beg）
fileObject.seekg( n );
 
// 把文件的读指针从 fileObject 当前位置向后移 n 个字节
fileObject.seekg( n, ios::cur );
 
// 把文件的读指针从 fileObject 末尾往回移 n 个字节
fileObject.seekg( n, ios::end );
 
// 定位到 fileObject 的末尾
fileObject.seekg( 0, ios::end );
```



















