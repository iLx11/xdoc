---
title: C笔记
date: 2024-01-26 19:23:30
tags:
categories:
classes: 笔记
---

# C语言

## 类型

整数

| 类型           | 存储大小     | 值范围                                               |
| :------------- | :----------- | :--------------------------------------------------- |
| char           | 1 byte       | -128 到 127 或 0 到 255                              |
| unsigned char  | 1 byte       | 0 到 255                                             |
| signed char    | 1 byte       | -128 到 127                                          |
| int            | 2 或 4 bytes | -32,768 到 32,767 或 -2,147,483,648 到 2,147,483,647 |
| unsigned int   | 2 或 4 bytes | 0 到 65,535 或 0 到 4,294,967,295                    |
| short          | 2 bytes      | -32,768 到 32,767                                    |
| unsigned short | 2 bytes      | 0 到 65,535                                          |
| long           | 4 bytes      | -2,147,483,648 到 2,147,483,647                      |
| unsigned long  | 4 bytes      | 0 到 4,294,967,295                                   |

浮点数

| 类型        | 存储大小 | 值范围                 | 精度      |
| :---------- | :------- | :--------------------- | :-------- |
| float       | 4 byte   | 1.2E-38 到 3.4E+38     | 6 位小数  |
| double      | 8 byte   | 2.3E-308 到 1.7E+308   | 15 位小数 |
| long double | 10 byte  | 3.4E-4932 到 1.1E+4932 | 19 位小数 |

点数常用的比较方法，精确度法:

```c
#define DISTANCE 0.00000001
float f_x_1 = 20.5;
float f_x_2 = 19.5;
if(f_x_1 - f_x_2 < DISTANCE)
    printf("They are Equal\n");
else
    printf("Different\n");
```



### 浮点型

C标准规定的浮点型有`float`、`double`、`long double`，和整型一样，既没有规定每种类型占多少字节，也没有规定采用哪种表示形式。浮点数的实现在各种平台上差异很大，有的处理器有浮点运算单元（FPU，Floating Point Unit），称为`硬浮点` （Hard-float）实现；有的处理器没有浮点运算单元，只能做整数运算，需要用整数运算来模拟浮点运算，称为`软浮点` （Soft-float）实现。大部分平台的浮点数实现遵循IEEE 754，`float`型通常是32位，`double`型通常是64位。

`long double`型通常是比`double`型精度更高的类型，但各平台的实现有较大差异。在x86平台上，大多数编译器实现的`long double`型是80位，因为x86的浮点运算单元具有80位精度，`gcc`实现的`long double`型是12字节（96位），这是为了对齐到4字节边界，也有些编译器实现的`long double`型和`double`型精度相同，没有充分利用x86浮点运算单元的精度。其它体系结构的浮点运算单元的精度不同，编译器实现也会不同，例如PowerPC上的`long double`型通常是128位。+

### 常量

以下是各种类型的整数常量的实例：

```c
85         /* 十进制 */
0213       /* 八进制 */
0x4b       /* 十六进制 */
30         /* 整数 */
30u        /* 无符号整数 */
30l        /* 长整数 */
30ul       /* 无符号长整数 */
```

### 变量

变量限定

`const` 是最常用的变量限定符，它的意思是告诉编译器，这个变量或者对象在初始化以后不能被改变，常用它来保护一些必要的返回值，参数以及常量的定义。

`volatile` 这个关键字常常被C语言教材所忽略，它很神秘。实际上确实如此，他的作用的确很神秘：一旦使用了，就是告诉编译器，即使这个变量没有被使用或修改其他内存单元，它的值也可能发生变化。通俗的说就是，**告诉编译器，不要把你的那一套优化策略用在我身上**。

对于一个频繁更改的变量，编译器会以最新的赋值而跳过变化

## 存储类

### static 存储类

**static** 存储类指示编译器在程序的生命周期内保持局部变量的存在，而不需要在每次它进入和离开作用域时进行创建和销毁。

因此，使用 static 修饰局部变量可以在函数调用之间`保持局部变量的值`。

static 修饰符也可以应用于全局变量。当 static 修饰全局变量时，会使变量的作用域限制在声明它的文件内。

在 C 编程中，当 **static** 用在类数据成员上时，会导致仅有一个该成员的副本被类的所有对象共享。

###  extern 存储类

**extern** 存储类用于提供一个全局变量的引用，全局变量对所有的程序文件都是可见的。当您使用 'extern' 时，对于无法初始化的变量，会把变量名指向一个之前定义过的存储位置。

当您有多个文件且定义了一个可以在其他文件中使用的全局变量或函数时，可以在其他文件中使用 *extern* 来得到已定义的变量或函数的引用。可以这么理解，*extern* 是用来在另一个文件中声明一个全局变量或函数。

extern 修饰符通常用于当有两个或多个文件共享相同的全局变量或函数的时候，如下所示：

**第一个文件：main.c**

```c
#include <stdio.h>
 
int count ;
extern void write_extern();
 
main()
{
   count = 5;
   write_extern();
}
```

**第二个文件：support.c**

```c
#include <stdio.h>
 
extern int count;
 
void write_extern(void)
{
   printf("count is %d\n", count);
}
```

## 预处理

### 宏

"\\" 将多行宏拼接为一行

```c
//获取最大值
#define Max(a, b) ({\
	//根据参数获取类型
	__typeof(a) _a = (a);\
    __typeof(b) _b = (b);\
    _a > _b ? _a : _b;\
})
    
#define P(a) ({\
	//'#a' 表示字符串化a
	printf("%s = %d", #a, a);\
})
```



> ##### args -> 变参宏
>
> ##### frm -> 格式控制
>
> `__FILE__`宏用于检查当前文件名
>
> `__FUNCTION__`/ `__func__`宏输出当前函数名
>
> `__LINE__`宏输出当前代码是该文件中的第几行
>
> `__func__`**(C99)** 用于显示当前所在外层函数的名字
>
> - `__STDC__`
>
>   - 检验现在使用的编译器是否遵循ISO标准，如果是他的值为1。
>
>     ```
>     printf("%d\n", __STDC__);
>     ```
>
>     `输出: 1`
>
>   - 确定编译器使用的标准版本是C99还是C89，
>
>     `__STDC__VERSION__`，C99(199901)
>
>     ```
>     printf("%d\n", __STDC_VERSION__);
>     ```
>
>     `输出: 199901`

```c
#define log(frm, args...) {\
	printf("[%s, %s, %d]", __FILE__ , __func__, __LINE__);\
    
	//##args 表示把args…中的多个参数，串连起来。
	//如果写成 #fmt的话，就是把fmt传进来的内容以字符串形式输出。
	printf(frm, ##args);\
    printf("\n");\
}
printf("%d", xxx);

//函数上方添加，将会优先于 main 函数
__attribute__((constructor))
```

#### 宏定义debug

```c
//后期去掉debug
#ifdef DEBUG
#define  log(frm, args...) {\
	...
}
#else 
#define log(frm, args...)
```

#### 字符转化大小写

```c
#define CONVERT(c) (((c) >= 'A' && (c) <= 'Z') ? ((c) - 'A' + 'a') : (c))
```

#### C语言宏函数返回数组个数

```c
#define ARR_SIZE(arr)  (sizeof((arr)) / sizeof((arr[0])))
```



当表达式中存在有符号类型和无符号类型时所有的操作，

数都自动转换为无符号类型。

```c
unsigned int aa;
```



### scanf

```c
//表示扫描除回车以外的字符
//%* 表示跳过
scanf("%[^\n]", xx);
```



## 位运算

### 移位运算

移位运算符（Bitwise Shift）包括左移<<和右移>>。左移将一个整数的各二进制位全部左移若干位，例如0xcfffffff3<<2得到0x3fffffcc：

### 掩码

如果要对一个整数中的某些位进行操作，可以用掩码（Mask）来表示。比如掩码0x0000ff00表示对一个32位整数的8~15位进行操作，举例如下。

1、取出8~15位。

```c
unsigned int a, b, mask = 0x0000ff00;
a = 0x12345678;
b = (a & mask) >> 8;
/* 0x00000056 */
```

这样也可以达到同样的效果：

```c
b = (a >> 8) & ~(~0U << 8);
```

2、将8~15位清0。

```c
unsigned int a, b, mask = 0x0000ff00;
a = 0x12345678;
b = a & ~mask;
/* 0x12340078 */
```

3、将8~15位置1。

```c
unsigned int a, b, mask = 0x0000ff00;
a = 0x12345678;
b = a | mask;
/* 0x1234ff78 */
```

### 异或运算

从异或的真值表可以看出，不管是0还是1，和0做异或保持原值不变，和1做异或得到原值的相反值。可以利用这个特性配合掩码实现某些位的翻转，例如：

```c
unsigned int a, b, mask = 1U << 6;
a = 0x12345678;
b = a ^ mask;
/* flip the 6th bit */
```

利用位运算可以这样做交换

```c
a = a ^ b;
b = b ^ a;
a = a ^ b;
```



## 指针

> 1.调用函数灵活修改实参变量的值
>
> 2.支持动态内存分配，方便实现动态的数据结构
>
> 3.提高某些程序的效率
>
> 4.实现缓冲方式文件存取

指针在不同位的操作系统上的大小是不一样的，但是在同一个操作系统下，无论什么类型的指针都是相同大小

### malloc / calloc  / realloc 区别

#### （1）malloc函数

其原型void *malloc(unsigned int num_bytes)；
num_byte为要申请的空间大小，需要我们手动的去计算

```c
//指针转换
int *p = (int *)malloc(20*sizeof(int))
```

如果编译器默认int为4字节存储的话，那么计算结果是80Byte，

一次申请一个80Byte的连续空间，并将空间基地址强制转换为int类型，赋值给指针p,此时申请的内存值是不确定的。

#### （2）calloc函数

其原型void *calloc(size_t n, size_t size)；
不需要人为的计算空间的大小

```c
int *p = (int *)calloc(20, sizeof(int)）
```

省去了人为空间计算的麻烦。malloc申请后空间的值是随机的，并没有进行初始化，

而calloc却在申请后，对空间逐一进行初始化，并设置值为0。

因此calloc 较于 malloc 效率较低。

#### （3）realloc函数

和上面两个有本质的区别，其原型void realloc(void *ptr, size_t new_Size)

用于对动态内存进行扩容(及已申请的动态空间不够使用，需要进行空间扩容操作)，ptr为指向原来空间基址的指针， new_size为接下来需要扩充容量的大小。

```c
int size = 2000;
int *p = (int *)malloc(20*sizeof(int));
int *pp = (int *)realloc(p, size*sizeof(int));
```

`如果size较小`，原来申请的动态内存后面还有空余内存，系统将直接在原内存空间后面扩容，并返回原动态空间基地址；

`如果size较大`，原来申请的空间后面没有足够大的空间扩容，系统将重新申请一块(20+size)*sizeof(int)的内存，并把原来空间的内容拷贝过去，原来空间free;

`如果size非常大`，系统内存申请失败，返回NULL,原来的内存不会释放。注意：如果扩容后的内存空间较原空间小，将会出现数据丢失，如果直接realloc(p, 0);相当于free(p).



### 字符数组

```c
char a[] = "hello";
```

#### 指针指向字符数组

```c
char *p
p = a; 
// p = &a[0]
```

#### 字符指针

```c
char *str = "hello";
```

字符数组存储在`全局数据区或栈区`

字符指针的字符串存储在`常量区`。

全局数据区和栈区的字符串（也包括其他数据）有读取和写入的权限，而常量区的字符串（也包括其他数据）`只有读取权限，没有写入权限。`

#### 字符数组操作

```c
if(str[i][j] != 'B') continue;
//'n' 表示安全操作
if(strncmp(str[i][j], "xxx", 3)) continue; 
strncpy(str[i][j], "xxxx", 4);
//移位
move(str[i][j] + 4);


//move
void move(char *p) {
    int i = 0;
   	for(; p[i]; i++) {
        p[i] = p[i++]
    }
    p[i] = '\0';
    return ;
}
```

字符串操作

| 序号 | 函数 & 目的                                                  |
| :--- | :----------------------------------------------------------- |
| 1    | **strcpy(s1, s2);** 复制字符串 s2 到字符串 s1。              |
| 2    | **strcat(s1, s2);** 连接字符串 s2 到字符串 s1 的末尾。       |
| 3    | **strlen(s1);** 返回字符串 s1 的长度。                       |
| 4    | **strcmp(s1, s2);** 如果 s1 和 s2 是相同的，则返回 0；如果 s1<s2 则返回小于 0；如果 s1>s2 则返回大于 0。 |
| 5    | **strchr(s1, ch);** 返回一个指针，指向字符串 s1 中字符 ch 的第一次出现的位置。 |
| 6    | **strstr(s1, s2);** 返回一个指针，指向字符串 s1 中字符串 s2 的第一次出现的位置。 |

### 函数指针

```c
//p 为函数的地址
//p = strcmp
void process(char *a, char *b, int(* p)(const char*, const char *));
// 声明
int (* funcName) (int, int);
// 定义
funcName = FUNC;
funcName = &FUNC;
// 调用
funcName();
(* funcName)();
```

#### 函数指针数组

```c
int (* funcName[3])(int, int) = { func1, func2, func3 }
```



### 二维数组指针

#### 二维数组指针传递

##### 1.传递时指指定列数

```c
void foo(int a[][3], int m, int n)
```

##### 2.参数声明为一个指向数组的指针

```c
void foo(int (*a)[3], int m, int n)
    
// *(*(p+1)+1)表示第 1 行第 1 个元素的值
// a[i][j] == p[i][j] == *(a[i]+j) == *(p[i]+j) == *(*(a+i)+j) == *(*(p+i)+j)    
```

##### 3.把参数声明为指向指针的指针

```c
void foo(int **a, int m, int n)
    
	int a[2][3] = {
        {1,2,3},
        {4,5,6}
    };
    int * p[3] = {a[0], a[1], a[2]};
    foo(p, 2, 3);
```

#### 二维数组，计算大小的小总结： 

```c
二维数组中：int a[3][4] = { 0 };

计算整个数组的大小： sizeof(a); 
计算整个第一行的大小： sizeof(a[0]); sizeof(*a);

计算第一行第二个元素的大小：  sizeof(a[0][1]); sizeof(*(a[0] + 1));
计算第一行第二个元素的地址的大小： sizeof(&a[0][1]); sizeof(a[0] + 1);

计算第二行的大小： sizeof(a[1]); sizeof(*(a + 1)); sizeof(*(&a[0] + 1));
计算第二行的地址的大小： sizeof(&a[1]); sizeof(a + 1); sizeof(&a[0] + 1);
```



## 结构体

> 默认用最大的字节来对齐

#### 结构体变量


```c
//函数的传递结构体
void output(struct stru str[2])//结构体数组
```

#### 结构体指针

```c
struct Student {
    long num;
    char *name; // char name[20]
}
struct student stu;
struct student *p;
p = &stu;
p->num = 123;
//指针数组分配内存
p->name = (char *)malloc(20);
```

##### 结构体指针的形式

```c
(*p).name ==> p->name
```



#### 定义指针类型 

```c
typedef struct Student {
    int HP;
}Stu, * PStu;

PStu newStu = (PStu) malloc(sizeof(Stu));
newStu->HP = 1000;
```

#### 结构体构建队列

```c
#include <assert.h>

typedef struct QueNode {
    int val;
    //单向队列
    struct QueNode* next;
}QNode;
typedef struct Que {
    //指向队列尾部
    QNode* tail;
    //指向队列头部
    QNode* head;
}Que;
//队列初始化
void QueInit(Que* que) {
	//assert()宏接受一个整形表达式参数。
    //如果表达式的值为假，assert()宏就会调用_assert函数在标准错误流中打印一条错误信息，并调用abort()
    //（abort()函数的原型在stdlib.h头文件中）函数终止程序。
    assert(que);
    que->tail = que->head = NULL;
}

```

##### 数据入队列

```c
void push(Que* que, int val) {
    assert(que);
    Que* newNode = (QNode *) malloc(sizeof(QNode));
    newNode->val = val;
    newNode->next = NULL;
    //队列为空
    if(que->tail == NULL) {
        que->tail = que->head = newNode;
    }else {
        //尾指针指向的节点，下一个节点指向新节点
        que-tail->next = newNode;
        //尾指针指向新节点
        que->tail = newNode;
    }
}
```

##### 数据出队列

```c
void pop(Que* que) {
    assert(que);
   	assert(que->head);s
    //只有一个节点
    if(que->head->next == NULL) {
        que->tail = que->head = NULL;
     	return ;   
    }
    Que* temp = que->head;
    que->head = que->head->next;
    free(temp);
}
```

## qsort

```c
// 按名字排序

#include <stdio.h>
#include <string.h>
#include <stdlib.h>
 
struct Stu
{
	char name[20];
	int age;
};
// 比较结构体的成员
int cmp_stu_by_name(const void* e1, const void* e2)
{
	//strcmp --> >0 ==0 <0
	return strcmp(((struct Stu*)e1)->name, ((struct Stu*)e2)->name);
}

// 比较数字
int int_cmp(const void* e1, const void* e2)
{
    return (*(int*)e1 - *(int*)e2);
}

 
int main()
{
	struct Stu s[] = { {"zhangsan", 15}, {"lisi", 30}, {"wangwu", 25} };
	int sz = sizeof(s) / sizeof(s[0]);
    // 排序
	qsort(s, sz, sizeof(s[0]), cmp_stu_by_name);
	
	return 0;
}
```



## 共用体

> 将几种不同类型的变量存放在同一内存单元中，实现覆盖技术

```c
union IP {
   	struct {
        unsigned char a1;
        unsigned char a2;
        unsigned char a3;
        unsigned char a4;
    } ip;
    unsigned int num;
}

```



## 时间



```c
#include <time.h>

time_t current_time;
time(&current_time);
printf("%d", current_time);
```

### 定义毫秒时间戳

```c
#if defined(_WIN32)
#include <sys/timeb.h>
#endif
#if defined(__unix__)
#include <sys/time.h>
#endif

typedef long long long_time_t;

long_time_t time_in_millisecond(void) {
#if defined(_WIN32)
    struct timeb time_buffer;
    ftime(&time_buffer);
    return time_buffer.time * 1000LL + time_buffer.millitm;
    // unix || 苹果
#elif defined(__unix__) || defined(__APPLE__)
    struct timeval  time_value;
    gettimeofday(&time_value, NULL);
    return time_value.tv_sec * 1000LL + time_value.tv_usec / 1000;
    // C11
#elif defined(__STDC__) && __STDC_VERSION__ = 201112L
    struct timespec timespec_value;
    timespec_get(&timespec_value, TIME_UTC);
    return timespec_value.tv_sec * 1000LL + timespec_value.tv_nsec / 1000000;
#else
    time_t current_time = time(NULL);
    return current_time * 1000;
#endif
    
}
```



### 获取日历时间

```c
time_t = current_time;
time(&current_time);
struct tm* calendar_time = localtime(&current_time);
// calendar_time.tm_year / tm_mon / tm_mday / tm_hour / tm_min / tm_sec
```

#### 日历时间转时间戳

```c
time_t current_time2 = mktime(calendar_time);
```



### 格式化时间

```c
// Min Nov 9 06:59:47 2020
asctime(calendar_time);
ctime(&current_time);

// 2020-11-09 06:59:47
char current_time_s[20];
// "%F %T"
size_t size = strftime(current_time_s, 20, "%Y-%m-%d %H:%M:%S", calendar_time);
```



### 解析时间

```c
char* time = "2020-11-09 06:59:47";
struct tm parsed_time;
// 返回解析不了的字符串
char* unparsed_string = strptime(time, "%F %T", &parse_time);
// parsed_time.tm_year
```



### 计算时间差

```c
// 真实世界时间差
time_t start_time = time(NULL);
//
time_t end_time = time(NULL);
double diff = difftime(start_time, end_time);
// 处理器消耗时间
clock_t start_time_c = clock();
//
clock_t end_time_c = clock();
// (end_time_c - start_time_c) * 1.0 / CLOCKS_PER_SEC);
```





## 文件

### 读写文件

#### 字符读取

```c
// 定义异常情况
#define COPY_SUCCESS 0
#define ...


while(1) {
    // 一个字符读取
	int next = fgetc(file);
    // 判断结尾以及是否有问题出现
    if(next == EOF) {
    	if(ferror(src_file)) {
            result = COPY_SRC_READ_ERROR;
        } else if(feof(src_file)) {
           	result = COPY_SUCCESS;
        } else if{
            result = COPY_UNKNOWN_ERROR;
        }
        break;
    }
    if(fputs(next, dest_file) == EOF) {
    	result = COPY_DEST_WRITE_ERROR;
        break;
	}
}
fclose(src_file);
fclose(dest_file);
```

#### 按行读取

```c
char buffer[BUFFER_SIZE];
char* next;
while(1) {
	next = fgets(buffer, BUFFER_SIZSE, src_file);
    if(! next) {
        if(ferror(src_file)) {
            result = COPY_SRC_READ_ERROR;
        } else if(feof(src_file)) {
            result = COPY_SUCCESS;
        } else {
            result = COPY_UNKNOWN_ERROR;
        }
        break;
    }
    if(fputs(next, dest_file) == EOF) {
        result = COPY_DEST_WRITE_ERROR;
        break;
    }
}
fclose(src_file);
fclose(dest_file);
```



### 设置编码格式

```c
setlocale(LC_ALL, "zh_CN.utf-8");
```



### 读写字节

```c
char buffer[BUFFER_SIZE];
while(1) {
    // 读取的字符数
    size_t bytes_read = fread(buffer, sizeof(char), BUFFER_SIZE, stdin)
    // 读完    
    if(bytes_read < BUFFER_SIZE) {
       	if(feof(stdin)) {
            puts("EOF");
           	fwrite(buffer, sizeof(buffer[0]), bytes_read, stdout);
        } else if(ferror(stdin)) {
            perror("ERROR");
        }
        break;
    }
    fwrite(buffer, sizeof(char), BUFFER_SIZE, stdout);
}
```







# 多线程

## 借助开源库 `TinyCThread`

### 基本用法

```c
thrd_t new_thread;
// 只能一个函数，且传一个参数
int result = thrd_create(&new_thread, func, arg);
if(result == thrd_success) {
    // 创建成功
}
// 阻塞线程
1.thrd_sleep(&(struct timespec) {.tv_sec = 0, .tv_nsec = 10000000}, NULL);

// 接收的结果
int res;
2.thrd_join(new_thread, &res);

// 不接收结果
thrd_detach(new_thread);
```

### 线程的问题

- 对共享资源进行非原子的并发访问 （可以拆解的操作）
- 不同线程之间的代码可见性问题  （参数对于已经执行的语句有可能不可见）
- 线程内部代码编译时的重排序问题 （对于线程优先创建的问题）



### volatile

(易变）修饰的变量读写可观察；禁止编译器优化读写操作

解决重排序

```c
// 线程变量
volatile int aa = 0;
```

 
