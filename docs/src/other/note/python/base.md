```python
def foo():
    pass

def bar():
    pass

# __name__是Python中一个隐含的变量它代表了模块的名字
# 只有被Python解释器直接执行的模块的名字才是__main__
if __name__ == '__main__':
    print('call foo()')
    foo()
    print('call bar()')
    bar()
```
## python 字符串处理
```python
str1 = 'hello, world!'
# 通过内置函数len计算字符串的长度
print(len(str1)) # 13
# 获得字符串首字母大写的拷贝
print(str1.capitalize()) # Hello, world!
# 获得字符串每个单词首字母大写的拷贝
print(str1.title()) # Hello, World!
# 获得字符串变大写后的拷贝
print(str1.upper()) # HELLO, WORLD!
# 从字符串中查找子串所在位置
print(str1.find('or')) # 8
print(str1.find('shit')) # -1
# 与find类似但找不到子串时会引发异常
# print(str1.index('or'))
# print(str1.index('shit'))
# 检查字符串是否以指定的字符串开头
print(str1.startswith('He')) # False
print(str1.startswith('hel')) # True
# 检查字符串是否以指定的字符串结尾
print(str1.endswith('!')) # True
# 将字符串以指定的宽度居中并在两侧填充指定的字符
print(str1.center(50, '*'))
# 将字符串以指定的宽度靠右放置左侧填充指定的字符
print(str1.rjust(50, ' '))
str2 = 'abc123456'
# 检查字符串是否由数字构成
print(str2.isdigit())  # False
# 检查字符串是否以字母构成
print(str2.isalpha())  # False
# 检查字符串是否以数字和字母构成
print(str2.isalnum())  # True
str3 = '  jackfrued@126.com '
print(str3)
# 获得字符串修剪左右两侧空格之后的拷贝
print(str3.strip())

# 拼接字符串
print('{0} * {1} = {2}'.format(a, b, a * b))
print(f'{a} * {b} = {a * b}')
```
# 基本数据类型转换
Python 中基本数据类型转换的方法有下面几个。

| 方法                     | 说明                              |
| ---------------------- | ------------------------------- |
| int(x [,base ])        | 将x转换为一个整数                       |
| float(x )              | 将x转换到一个浮点数                      |
| complex(real [,imag ]) | 创建一个复数                          |
| str(x )                | 将对象 x 转换为字符串                    |
| repr(x )               | 将对象 x 转换为表达式字符串                 |
| eval(str )             | 用来计算在字符串中的有效 Python 表达式,并返回一个对象 |
| tuple(s )              | 将序列 s 转换为一个元组                   |
| list(s )               | 将序列 s 转换为一个列表                   |
| chr(x )                | 将一个整数转换为一个字符                    |
| unichr(x )             | 将一个整数转换为 Unicode 字符             |
| ord(x )                | 将一个字符转换为它的整数值                   |
| hex(x )                | 将一个整数转换为一个十六进制字符串               |
| oct(x )                | 将一个整数转换为一个八进制字符串                |

## 列表
List（列表）运算符
列表对 `+` 和 `*` 的操作符与字符串相似。`+` 号用于组合列表，`*` 号用于重复列表。

| Python 表达式                   | 结果                           | 描述         |
| ---------------------------- | ---------------------------- | ---------- |
| len([1, 2, 3])               | 3                            | 计算元素个数     |
| [1, 2, 3] + [4, 5, 6]        | [1, 2, 3, 4, 5, 6]           | 组合         |
| ['Hi!'] * 4                  | ['Hi!', 'Hi!', 'Hi!', 'Hi!'] | 复制         |
| 3 in [1, 2, 3]               | True                         | 元素是否存在于列表中 |
| for x in [1, 2, 3]: print x, | 1 2 3                        | 迭代         |

List （列表）函数&方法

| 函数&方法                   | 描述                                |
| ----------------------- | --------------------------------- |
| len(list)               | 列表元素个数                            |
| max(list)               | 返回列表元素最大值                         |
| min(list)               | 返回列表元素最小值                         |
| list(seq)               | 将元组转换为列表                          |
| list.append(obj)        | 在列表末尾添加新的对象                       |
| list.count(obj)         | 统计某个元素在列表中出现的次数                   |
| list.extend(seq)        | 在列表末尾一次性追加另一个序列中的多个值（用新列表扩展原来的列表） |
| list.index(obj)         | 从列表中找出某个值第一个匹配项的索引位置              |
| list.insert(index, obj) | 将对象插入列表                           |
| list.pop(obj=list[-1])  | 移除列表中的一个元素（默认最后一个元素），并且返回该元素的值    |
| list.remove(obj)        | 移除列表中的一个元素（参数是列表中元素），并且不返回任何值     |
| list.reverse()          | 反向列表中元素                           |
| list.sort([func])       | 对原列表进行排序                          |
下面的代码演示了如何定义列表、如何遍历列表以及列表的下标运算。
```python
list1 = [1, 3, 5, 7, 100]
print(list1) # [1, 3, 5, 7, 100]
# 乘号表示列表元素的重复
list2 = ['hello'] * 3
print(list2) # ['hello', 'hello', 'hello']
# 计算列表长度(元素个数)
print(len(list1)) # 5
# 下标(索引)运算
print(list1[0]) # 1
print(list1[4]) # 100
# print(list1[5])  # IndexError: list index out of range
print(list1[-1]) # 100
print(list1[-3]) # 5
list1[2] = 300
print(list1) # [1, 3, 300, 7, 100]
# 通过循环用下标遍历列表元素
for index in range(len(list1)):
    print(list1[index])
# 通过for循环遍历列表元素
for elem in list1:
    print(elem)
# 通过enumerate函数处理列表之后再遍历可以同时获得元素索引和值
for index, elem in enumerate(list1):
    print(index, elem)
```
下面的代码演示了如何向列表中添加元素以及如何从列表中移除元素。
```python
list1 = [1, 3, 5, 7, 100]
# 添加元素
list1.append(200)
list1.insert(1, 400)
# 合并两个列表
# list1.extend([1000, 2000])
list1 += [1000, 2000]
print(list1) # [1, 400, 3, 5, 7, 100, 200, 1000, 2000]
print(len(list1)) # 9
# 先通过成员运算判断元素是否在列表中，如果存在就删除该元素
if 3 in list1:
	list1.remove(3)
if 1234 in list1:
    list1.remove(1234)
print(list1) # [1, 400, 5, 7, 100, 200, 1000, 2000]
# 从指定的位置删除元素
list1.pop(0)
list1.pop(len(list1) - 1)
print(list1) # [400, 5, 7, 100, 200, 1000]
# 清空列表元素
list1.clear()
print(list1) # []
```
和字符串一样，列表也可以做切片操作，通过切片操作我们可以实现对列表的复制或者将列表中的一部分取出来创建出新的列表，代码如下所示。
```python
fruits = ['grape', 'apple', 'strawberry', 'waxberry']
fruits += ['pitaya', 'pear', 'mango']
# 列表切片
fruits2 = fruits[1:4]
print(fruits2) # apple strawberry waxberry
# 可以通过完整切片操作来复制列表
fruits3 = fruits[:]
print(fruits3) # ['grape', 'apple', 'strawberry', 'waxberry', 'pitaya', 'pear', 'mango']
fruits4 = fruits[-3:-1]
print(fruits4) # ['pitaya', 'pear']
# 可以通过反向切片操作来获得倒转后的列表的拷贝
fruits5 = fruits[::-1]
print(fruits5) # ['mango', 'pear', 'pitaya', 'waxberry', 'strawberry', 'apple', 'grape']
```
下面的代码实现了对列表的排序操作。
```python
list1 = ['orange', 'apple', 'zoo', 'internationalization', 'blueberry']
list2 = sorted(list1)
# sorted函数返回列表排序后的拷贝不会修改传入的列表
# 函数的设计就应该像sorted函数一样尽可能不产生副作用
list3 = sorted(list1, reverse=True)
# 通过key关键字参数指定根据字符串长度进行排序而不是默认的字母表顺序
list4 = sorted(list1, key=len)
print(list1)
print(list2)
print(list3)
print(list4)
# 给列表对象发出排序消息直接在列表对象上进行排序
list1.sort(reverse=True)
print(list1)
```

### 生成式和生成器
我们还可以使用列表的生成式语法来创建列表，代码如下所示。

```python
f = [x for x in range(1, 10)]
print(f)
f = [x + y for x in 'ABCDE' for y in '1234567']
print(f)
# 用列表的生成表达式语法创建列表容器
# 用这种语法创建列表之后元素已经准备就绪所以需要耗费较多的内存空间
f = [x ** 2 for x in range(1, 1000)]
print(sys.getsizeof(f))  # 查看对象占用内存的字节数
print(f)
# 请注意下面的代码创建的不是一个列表而是一个生成器对象
# 通过生成器可以获取到数据但它不占用额外的空间存储数据
# 每次需要数据的时候就通过内部的运算得到数据(需要花费额外的时间)
f = (x ** 2 for x in range(1, 1000))
print(sys.getsizeof(f))  # 相比生成式生成器不占用存储数据的空间
print(f)
for val in f:
    print(val)
```

## 元组
代码演示了如何定义和使用元组。
tuple 和 List 非常类似，但是 tuple 一旦初始化就不能修改，即不能修改指向
与字符串一样，元组之间可以使用 `+` 号和 `*` 号进行运算。这就意味着他们可以组合和复制，运算后会生成一个新的元组。

|Python 表达式|结果|描述|
|---|---|---|
|len((1, 2, 3))|3|计算元素个数|
|(1, 2, 3) + (4, 5, 6)|(1, 2, 3, 4, 5, 6)|连接|
|('Hi!',) * 4|('Hi!', 'Hi!', 'Hi!', 'Hi!')|复制|
|3 in (1, 2, 3)|True|元素是否存在|
|for x in (1, 2, 3): print(x)|1 2 3|迭代|

| 方法         | 描述         |
| ---------- | ---------- |
| len(tuple) | 计算元组元素个数   |
| max(tuple) | 返回元组中元素最大值 |
| min(tuple) | 返回元组中元素最小值 |
| tuple(seq) | 将列表转换为元组   |
```python
# 定义元组
t = ('骆昊', 38, True, '四川成都')
print(t)
# 获取元组中的元素
print(t[0])
print(t[3])
# 遍历元组中的值
for member in t:
    print(member)
# 重新给元组赋值
# t[0] = '王大锤'  # TypeError
# 变量t重新引用了新的元组原来的元组将被垃圾回收
t = ('王大锤', 20, True, '云南昆明')
print(t)
# 将元组转换成列表
person = list(t)
print(person)
# 列表是可以修改它的元素的
person[0] = '李小龙'
person[1] = 25
print(person)
# 将列表转换成元组
fruits_list = ['apple', 'banana', 'orange']
fruits_tuple = tuple(fruits_list)
print(fruits_tuple)
```
## 集合
可以按照下面代码所示的方式来创建和使用集合。
```python
# 创建集合的字面量语法
set1 = {1, 2, 3, 3, 3, 2}
print(set1)
print('Length =', len(set1))
# 创建集合的构造器语法(面向对象部分会进行详细讲解)
set2 = set(range(1, 10))
set3 = set((1, 2, 3, 3, 2, 1))
print(set2, set3)
# 创建集合的推导式语法(推导式也可以用于推导集合)
set4 = {num for num in range(1, 100) if num % 3 == 0 or num % 5 == 0}
print(set4)
```
向集合添加元素和从集合删除元素。
```python
set1.add(4)
set1.add(5)
set2.update([11, 12])
set2.discard(5)
if 4 in set2:
    set2.remove(4)
print(set1, set2)
print(set3.pop())
print(set3)
```
集合的成员、交集、并集、差集等运算。
```python
# 集合的交集、并集、差集、对称差运算
print(set1 & set2)
# print(set1.intersection(set2))
print(set1 | set2)
# print(set1.union(set2))
print(set1 - set2)
# print(set1.difference(set2))
print(set1 ^ set2)
# print(set1.symmetric_difference(set2))
# 判断子集和超集
print(set2 <= set1)
# print(set2.issubset(set1))
print(set3 <= set1)
# print(set3.issubset(set1))
print(set1 >= set2)
# print(set1.issuperset(set2))
print(set1 >= set3)
# print(set1.issuperset(set3))
```
## 字典
使用字典。

| 方法和函数          | 描述                       |
| -------------- | ------------------------ |
| len(dict)      | 计算字典元素个数                 |
| str(dict)      | 输出字典可打印的字符串表示            |
| type(variable) | 返回输入的变量类型，如果变量是字典就返回字典类型 |
| dict.clear()   | 删除字典内所有元素                |
| dict.copy()    | 返回一个字典的浅复制               |
| dict.values()  | 以列表返回字典中的所有值             |
| popitem()      | 随机返回并删除字典中的一对键和值         |
| dict.items()   | 以列表返回可遍历的(键, 值) 元组数组     |

```python
# 创建字典的字面量语法
scores = {'骆昊': 95, '白元芳': 78, '狄仁杰': 82}
print(scores)
# 创建字典的构造器语法
items1 = dict(one=1, two=2, three=3, four=4)
# 通过zip函数将两个序列压成字典
items2 = dict(zip(['a', 'b', 'c'], '123'))
# 创建字典的推导式语法
items3 = {num: num ** 2 for num in range(1, 10)}
print(items1, items2, items3)
# 通过键可以获取字典中对应的值
print(scores['骆昊'])
print(scores['狄仁杰'])
# 对字典中所有键值对进行遍历
for key in scores:
    print(f'{key}: {scores[key]}')
# 更新字典中的元素
scores['白元芳'] = 65
scores['诸葛王朗'] = 71
scores.update(冷面=67, 方启鹤=85)
print(scores)
if '武则天' in scores:
    print(scores['武则天'])
print(scores.get('武则天'))
# get方法也是通过键获取对应的值但是可以设置默认值
print(scores.get('武则天', 60))
# 删除字典中的元素
print(scores.popitem())
print(scores.popitem())
print(scores.pop('骆昊', 100))
# 清空字典
scores.clear()
print(scores)
```
## 函数
函数也可以返回多个值
```python
def  division ( num1, num2 ):
	# 求商与余数
         a = num1 % num2
         b = (num1-a) / num2
         return b , a

num1 , num2 = division(9,4)
```
**Python 一次接受多个返回值的数据类型就是元组。**
### 只接受关键字参数
将强制关键字参数放到某个`*`参数或者单个`*`后面
```python
def print_user_info( name , *, age  , sex = '男' ):
```
### 匿名函数
匿名函数主要有以下特点：
- lambda 只是一个表达式，函数体比 def 简单很多。
- lambda 的主体是一个表达式，而不是一个代码块。仅仅能在 lambda 表达式中封装有限的逻辑进去。
- lambda 函数拥有自己的命名空间，且不能访问自有参数列表之外或全局命名空间里的参数。
**基本语法**
```python
lambda [arg1 [,arg2,.....argn]]:expression
```
## Python 迭代器
```python
str1 = 'liangdianshui'
iter1 = iter ( str1 )

# for 循环遍历迭代器对象
for x in iter1 :
    print ( x , end = ' ' )

# next() 函数遍历迭代器
while True :
    try :
        print ( next ( iter1 ) )
    except StopIteration :
        break
```
### list 生成式的创建
```python
[expr for iter_var in iterable] 
[expr for iter_var in iterable if cond_expr]
```
例子
```python
# -*- coding: UTF-8 -*-
list1= [(x+1,y+1) for x in range(3) for y in range(5)] 
print(list1)

[(1, 1), (1, 2), (1, 3), (1, 4), (1, 5), (2, 1), ....
```
## 生成器
使用了 yield 的函数被称为生成器（generator）
生成器是一个返回迭代器的函数，只能用于迭代操作
最简单最简单的方法就是把一个列表生成式的 `[]` 改成 `()`
```python
# -*- coding: UTF-8 -*-
gen= (x * x for x in range(10))
print(gen)
```
输出的结果：
```adblock
<generator object <genexpr> at 0x0000000002734A40>
```
创建 List 和 generator 的区别仅在于最外层的 `[]` 和 `()` 。
但是生成器并不真正创建数字列表， 而是返回一个生成器，这个生成器在每次计算出一个条目后，把这个条目“产生” ( yield ) 出来。
生成器表达式使用了“惰性计算” ( lazy evaluation，也有翻译为“延迟求值”，我以为这种按需调用 call by need 的方式翻译为惰性更好一些)，只有在检索时才被赋值（ evaluated ），所以在列表比较长的情况下使用内存上更有效。
```python
# -*- coding: UTF-8 -*-
def my_function():
    for i in range(10):
        yield i

print(my_function())
```
generator 和函数的执行流程不一样。函数是顺序执行，遇到 return 语句或者最后一行函数语句就返回。而变成 generator 的函数，在每次调用 next() 的时候执行，遇到 yield语句返回，再次执行时从上次返回的 yield 语句处继续执行。
### 反向迭代
方向迭代很简单，可是要注意一点就是：**反向迭代仅仅当对象的大小可预先确定或者对象实现了 `__reversed__()` 的特殊方法时才能生效。 如果两者都不符合，那你必须先将对象转换为一个列表才行**
### 同时迭代多个序列
```python
# -*- coding: UTF-8 -*-

names = ['laingdianshui', 'twowater', '两点水']
ages = [18, 19, 20]
for name, age in zip(names, ages):
     print(name,age)

:
laingdianshui 18
twowater 19
两点水 20
```
如果 a ， b 的长度不一致的话，以最短的为标准，遍历完后就结束。
利用 `zip()` 函数，我们还可把一个 key 列表和一个 value 列表生成一个 dict （字典）
```python
names = ['laingdianshui', 'twowater', '两点水']
ages = [18, 19, 20]

dict1= dict(zip(names,ages))

print(dict1)

:
{'laingdianshui': 18, 'twowater': 19, '两点水': 20}
```
`zip()` 是可以接受多于两个的序列的参数，不仅仅是两个

### 生成式（推导式）的用法

```python
prices = {
    'AAPL': 191.88,
    'GOOG': 1186.96,
    'IBM': 149.24,
    'ORCL': 48.44,
    'ACN': 166.89,
    'FB': 208.09,
    'SYMC': 21.29
}
# 用股票价格大于100元的股票构造一个新的字典
prices2 = {key: value for key, value in prices.items() if value > 100}
print(prices2)
```

嵌套列表

```python
names = ['关羽', '张飞', '赵云', '马超', '黄忠']
courses = ['语文', '数学', '英语']
# 录入五个学生三门课程的成绩
# 错误 - 参考http://pythontutor.com/visualize.html#mode=edit
# scores = [[None] * len(courses)] * len(names)
scores = [[None] * len(courses) for _ in range(len(names))]
for row, name in enumerate(names):
    for col, course in enumerate(courses):
        scores[row][col] = float(input(f'请输入{name}的{course}成绩: '))
        print(scores)
```

`collections`模块
常用的工具类：

- `namedtuple`：命令元组，它是一个类工厂，接受类型的名称和属性列表来创建一个类。
- `deque`：双端队列，是列表的替代实现。Python中的列表底层是基于数组来实现的，而deque底层是双向链表，因此当你需要在头尾添加和删除元素时，deque会表现出更好的性能，渐近时间复杂度为$O(1)$。
- `Counter`：`dict`的子类，键是元素，值是元素的计数，它的`most_common()`方法可以帮助我们获取出现频率最高的元素。`Counter`和`dict`的继承关系我认为是值得商榷的，按照CARP原则，`Counter`跟`dict`的关系应该设计为关联关系更为合理。
- `OrderedDict`：`dict`的子类，它记录了键值对插入的顺序，看起来既有字典的行为，也有链表的行为。
- `defaultdict`：类似于字典类型，但是可以通过默认的工厂函数来获得键对应的默认值，相比字典中的`setdefault()`方法，这种做法更加高效。

## 面向对象综合
### 类专有的方法

|方法|说明|
|---|---|
|`__init__`|构造函数，在生成对象时调用|
|`__del__`|析构函数，释放对象时使用|
|`__repr__`|打印，转换|
|`__setitem__`|按照索引赋值|
|`__getitem__`|按照索引获取值|
|`__len__`|获得长度|
|`__cmp__`|比较运算|
|`__call__`|函数调用|
|`__add__`|加运算|
|`__sub__`|减运算|
|`__mul__`|乘运算|
|`__div__`|除运算|
|`__mod__`|求余运算|
|`__pow__`|乘方|

当然有些时候我们需要获取类的相关信息，我们可以使用如下的方法：
- `type(obj)`：来获取对象的相应类型；
- `isinstance(obj, type)`：判断对象是否为指定的 type 类型的实例；
- `hasattr(obj, attr)`：判断对象是否具有指定属性/方法；
- `getattr(obj, attr[, default])` 获取属性/方法的值, 要是没有对应的属性则返回 default 值（前提是设置了 default），否则会抛出 AttributeError 异常；
- `setattr(obj, attr, value)`：设定该属性/方法的值，类似于 obj.attr=value；
- `dir(obj)`：可以获取相应对象的所有属性和方法名的列表：
### 类型判断
可以使用 `isinstance()` 函数
```python
class User1(object):
    pass

class User2(User1):
    pass

class User3(User2):
    pass

if __name__ == '__main__':
    user1 = User1()
    user2 = User2()
    user3 = User3()
    # isinstance()就可以告诉我们，一个对象是否是某种类型
    print(isinstance(user3, User2))

:
True
```
## 包
每一个包目录下面都会有一个 `__init__.py` 的文件
因为这个文件是必须的，否则，Python 就把这个目录当成普通目录，而不是一个包 。 `__init__.py` 可以是空文件，也可以有Python代码，因为 `__init__.py` 本身就是一个模块，而它对应的模块名就是它的包名。
## 属性的访问控制
之前也有讲到过，Python 没有真正意义上的私有属性。然后这就导致了对 Python 类的封装性比较差。我们有时候会希望 Python 能够定义私有属性，然后提供公共可访问的 get 方法和 set 方法。Python 其实可以通过魔术方法来实现封装。

| 方法                               | 说明                                                                                                                                                                                   |
| -------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `__getattr__(self, name)`        | 该方法定义了你试图访问一个不存在的属性时的行为。因此，重载该方法可以实现捕获错误拼写然后进行重定向, 或者对一些废弃的属性进行警告。                                                                                                                   |
| `__setattr__(self, name, value)` | 定义了对属性进行赋值和修改操作时的行为。不管对象的某个属性是否存在,都允许为该属性进行赋值.有一点需要注意，实现 `__setattr__` 时要避免"无限递归"的错误，                                                                                                |
| `__delattr__(self, name)`        | `__delattr__` 与 `__setattr__` 很像，只是它定义的是你删除属性时的行为。实现 `__delattr__` 是同时要避免"无限递归"的错误                                                                                                   |
| `__getattribute__(self, name)`   | `__getattribute__` 定义了你的属性被访问时的行为，相比较，`__getattr__` 只有该属性不存在时才会起作用。因此，在支持 `__getattribute__` 的 Python 版本,调用`__getattr__` 前必定会调用 `__getattribute__``__getattribute__` 同样要避免"无限递归"的错误。 |
```python
class User(object):
    def __getattr__(self, name):
        print('调用了 __getattr__ 方法')
        return super(User, self).__getattr__(name)

    def __setattr__(self, name, value):
        print('调用了 __setattr__ 方法')
        return super(User, self).__setattr__(name, value)

    def __delattr__(self, name):
        print('调用了 __delattr__ 方法')
        return super(User, self).__delattr__(name)

    def __getattribute__(self, name):
        print('调用了 __getattribute__ 方法')
        return super(User, self).__getattribute__(name)

if __name__ == '__main__':
    user = User()
    # 设置属性值，会调用 __setattr__
    user.attr1 = True
    # 属性存在,只有__getattribute__调用
    user.attr1
    try:
        # 属性不存在, 先调用__getattribute__, 后调用__getattr__
        user.attr2
    except AttributeError:
        pass
    # __delattr__调用
    del user.attr1
```
### 对象的描述器
一般来说，一个描述器是一个有“绑定行为”的对象属性 (object attribute)，它的访问控制被描述器协议方法重写。
这些方法是 `__get__()`, `__set__()` , 和 `__delete__()` 。
### 比较运算符

| 魔术方法                   | 说明                                                                                                                                                                         |
| ---------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `__cmp__(self, other)` | 如果该方法返回负数，说明 `self < other`; 返回正数，说明 `self > other`; 返回 0 说明 `self == other` 。强烈不推荐来定义 `__cmp__` , 取而代之, 最好分别定义 `__lt__`, `__eq__` 等方法从而实现比较功能。 `__cmp__` 在 Python3 中被废弃了。 |
| `__eq__(self, other)`  | 定义了比较操作符 == 的行为                                                                                                                                                            |
| `__ne__(self, other)`  | 定义了比较操作符 != 的行为                                                                                                                                                            |
| `__lt__(self, other)`  | 定义了比较操作符 < 的行为                                                                                                                                                             |
| `__gt__(self, other)`  | 定义了比较操作符 > 的行为                                                                                                                                                             |
| `__le__(self, other)`  | 定义了比较操作符 <= 的行为                                                                                                                                                            |
| `__ge__(self, other)`  | 定义了比较操作符 >= 的行为                                                                                                                                                            |
### 算术运算符

| 魔术方法                        | 说明                                                                   |
| --------------------------- | -------------------------------------------------------------------- |
| `__add__(self, other)`      | 实现了加号运算                                                              |
| `__sub__(self, other)`      | 实现了减号运算                                                              |
| `__mul__(self, other)`      | 实现了乘法运算                                                              |
| `__floordiv__(self, other)` | 实现了 // 运算符                                                           |
| `___div__(self, other)`     | 实现了/运算符. 该方法在 Python3 中废弃. 原因是 Python3 中，division 默认就是 true division |
| `__truediv__(self, other)`  | 实现了 true division. 只有你声明了 `from __future__ import division` 该方法才会生效  |
| `__mod__(self, other)`      | 实现了 % 运算符, 取余运算                                                      |
| `__divmod__(self, other)`   | 实现了 divmod() 內建函数                                                    |
| `__pow__(self, other)`      | 实现了 `**` 操作. N 次方操作                                                  |
| `__lshift__(self, other)`   | 实现了位操作 `<<`                                                          |
| `__rshift__(self, other)`   | 实现了位操作 `>>`                                                          |
| `__and__(self, other)`      | 实现了位操作 `&`                                                           |
| `__or__(self, other)`       | 实现了位操作 `                                                             |
| `__xor__(self, other)`      | 实现了位操作 `^`                                                           |
## 枚举
### 示例
```python
from enum import Enum

Month = Enum('Month', ('Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'))

# 遍历枚举类型
for name, member in Month.__members__.items():
    print(name, '---------', member, '----------', member.value)

# 直接引用一个常量
print('\n', Month.Jan)
```
### 自定义类型的枚举
```python
from enum import Enum, unique

Enum('Month', ('Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'))

# @unique 装饰器可以帮助我们检查保证没有重复值
@unique
class Month(Enum):
    Jan = 'January'
    Feb = 'February'
    Mar = 'March'
    Apr = 'April'
    May = 'May'
    Jun = 'June'
    Jul = 'July'
    Aug = 'August'
    Sep = 'September '
    Oct = 'October'
    Nov = 'November'
    Dec = 'December'

if __name__ == '__main__':
    print(Month.Jan, '----------',
          Month.Jan.name, '----------', Month.Jan.value)
    for name, member in Month.__members__.items():
        print(name, '----------', member, '----------', member.value)
```
### 枚举的比较
```python
from enum import Enum

class User(Enum):
    Twowater = 98
    Liangdianshui = 30
    Tom = 12

Twowater = User.Twowater
Liangdianshui = User.Liangdianshui

print(Twowater == Liangdianshui, Twowater == User.Twowater)
print(Twowater is Liangdianshui, Twowater is User.Twowater)

:
False True
False True

# 枚举类进行大小的比较
class User(enum.IntEnum):
    Twowater = 98
    Liangdianshui = 30
    Tom = 12
```


## 文件和异常
|操作模式|具体含义|
|---|---|
|`'r'`|读取 （默认）|
|`'w'`|写入（会先截断之前的内容）|
|`'x'`|写入，如果文件已经存在会产生异常|
|`'a'`|追加，将内容写入到已有文件的末尾|
|`'b'`|二进制模式|
|`'t'`|文本模式（默认）|
|`'+'`|更新（既可以读又可以写）|
### 读写文本文件
通过`with`关键字指定文件对象的上下文环境并在离开上下文环境时自动释放文件资源
```python
def main():
    f = None
    try:
        # 一次性读取整个文件内容
	    with open('致橡树.txt', 'r', encoding='utf-8') as f:
	        print(f.read())
	
	    # 通过for-in循环逐行读取
	    with open('致橡树.txt', mode='r') as f:
	        for line in f:
	            print(line, end='')
	            time.sleep(0.5)
	    print()
		# 读取文件按行读取到列表中
		with open('致橡树.txt') as f:
			lines = f.readlines()
		print(lines)
    except FileNotFoundError:
        print('无法打开指定的文件!')
    except LookupError:
        print('指定了未知的编码!')
    except UnicodeDecodeError:
        print('读取文件时解码错误!')

if __name__ == '__main__':
    main()
```
### 读写二进制文件
```python
def main():
    try:
        with open('guido.jpg', 'rb') as fs1:
            data = fs1.read()
            print(type(data))  # <class 'bytes'>
        with open('吉多.jpg', 'wb') as fs2:
            fs2.write(data)
    except FileNotFoundError as e:
        print('指定的文件无法打开.')
    except IOError as e:
        print('读写文件时出现错误.')
    print('程序执行结束.')

if __name__ == '__main__':
    main()
```
### 读写JSON文件
```python
import json

def main():
    mydict = {
        'name': '骆昊',
        'age': 38,
        'qq': 957658,
        'friends': ['王大锤', '白元芳'],
        'cars': [
            {'brand': 'BYD', 'max_speed': 180},
            {'brand': 'Audi', 'max_speed': 280},
            {'brand': 'Benz', 'max_speed': 320}
        ]
    }
    try:
        with open('data.json', 'w', encoding='utf-8') as fs:
            json.dump(mydict, fs)
    except IOError as e:
        print(e)
    print('保存数据完成!')

if __name__ == '__main__':
    main()
```
json模块主要有四个比较重要的函数，分别是：

- `dump` - 将Python对象按照JSON格式序列化到文件中
- `dumps` - 将Python对象处理成JSON格式的字符串
- `load` - 将文件中的JSON数据反序列化成对象
- `loads` - 将字符串的内容反序列化成Python对象
### [requests](http://docs.python-requests.org/zh_CN/latest/)模块
```python
import requests
import json

def main():
    resp = requests.get('http://api.tianapi.com/guonei/?key=APIKey&num=10')
    data_model = json.loads(resp.text)
    for news in data_model['newslist']:
        print(news['title'])

if __name__ == '__main__':
    main()
```
### 正则表达式
Python提供了re模块来支持正则表达式相关操作，下面是re模块中的核心函数。

| 函数                                           | 说明                                        |
| -------------------------------------------- | ----------------------------------------- |
| compile(pattern, flags=0)                    | 编译正则表达式返回正则表达式对象                          |
| match(pattern, string, flags=0)              | 用正则表达式匹配字符串 成功返回匹配对象 否则返回None             |
| search(pattern, string, flags=0)             | 搜索字符串中第一次出现正则表达式的模式 成功返回匹配对象 否则返回None     |
| split(pattern, string, maxsplit=0, flags=0)  | 用正则表达式指定的模式分隔符拆分字符串 返回列表                  |
| sub(pattern, repl, string, count=0, flags=0) | 用指定的字符串替换原字符串中与正则表达式匹配的模式 可以用count指定替换的次数 |
| fullmatch(pattern, string, flags=0)          | match函数的完全匹配（从字符串开头到结尾）版本                 |
| findall(pattern, string, flags=0)            | 查找字符串所有与正则表达式匹配的模式 返回字符串的列表               |
| finditer(pattern, string, flags=0)           | 查找字符串所有与正则表达式匹配的模式 返回一个迭代器                |
| purge()                                      | 清除隐式编译的正则表达式的缓存                           |
| re.I / re.IGNORECASE                         | 忽略大小写匹配标记                                 |
| re.M / re.MULTILINE                          | 多行匹配标记                                    |

> **说明：** 上面提到的re模块中的这些函数，实际开发中也可以用正则表达式对象的方法替代对这些函数的使用，如果一个正则表达式需要重复的使用，那么先通过compile函数编译正则表达式并创建出正则表达式对象无疑是更为明智的选择。

“原始字符串”的写法（在字符串前面加上了r）
```python
import re

def main():
    # 创建正则表达式对象 使用了前瞻和回顾来保证手机号前后不应该出现数字
    pattern = re.compile(r'(?<=\D)1[34578]\d{9}(?=\D)')
    sentence = '''
    重要的事情说8130123456789遍，我的手机号是13512346789这个靓号，
    不是15600998765，也是110或119，王大锤的手机号才是15600998765。
    '''
    # 查找所有匹配并保存到一个列表中
    mylist = re.findall(pattern, sentence)
    print(mylist)
    print('--------华丽的分隔线--------')
    # 通过迭代器取出匹配对象并获得匹配的内容
    for temp in pattern.finditer(sentence):
        print(temp.group())
    print('--------华丽的分隔线--------')
    # 通过search函数指定搜索位置找出所有匹配
    m = pattern.search(sentence)
    while m:
        print(m.group())
        m = pattern.search(sentence, m.end())

if __name__ == '__main__':
    main()
```
# 进程和线程
## 多进程
```python
from multiprocessing import Process
from os import getpid
from random import randint
from time import time, sleep

def download_task(filename):
    print('启动下载进程，进程号[%d].' % getpid())
    print('开始下载%s...' % filename)
    time_to_download = randint(5, 10)
    sleep(time_to_download)
    print('%s下载完成! 耗费了%d秒' % (filename, time_to_download))

def main():
    start = time()
    p1 = Process(target=download_task, args=('Python从入门到住院.pdf', ))
    p1.start()
    p2 = Process(target=download_task, args=('Peking Hot.avi', ))
    p2.start()
    p1.join()
    p2.join()
    end = time()
    print('总共耗费了%.2f秒.' % (end - start))

if __name__ == '__main__':
    main()
```
### 把进程创建成类
```python
import multiprocessing
import time

class ClockProcess(multiprocessing.Process):
    def __init__(self, interval):
        multiprocessing.Process.__init__(self)
        self.interval = interval

    def run(self):
        n = 5
        while n > 0:
            print("当前时间: {0}".format(time.ctime()))
            time.sleep(self.interval)
            n -= 1

if __name__ == '__main__':
    p = ClockProcess(3)
    p.start()
```
### daemon 属性
如果在子进程中添加了 daemon 属性，那么当主进程结束的时候，子进程也会跟着结束
```python
p = multiprocessing.Process(target=worker, args=(3,))
p.daemon = True
```
### join 方法
join 方法的主要作用是：阻塞当前进程，直到调用 join 方法的那个进程执行完，再继续执行当前进程。
### Pool
使用进程池的方法批量创建子进程。
```python
from multiprocessing import Pool
import os, time, random

def long_time_task(name):
    print('进程的名称：{0} ；进程的PID: {1} '.format(name, os.getpid()))
    start = time.time()
    time.sleep(random.random() * 3)
    end = time.time()
    print('进程 {0} 运行了 {1} 秒'.format(name, (end - start)))

if __name__ == '__main__':
    print('主进程的 PID：{0}'.format(os.getpid()))
    p = Pool(4)
    for i in range(6):
        p.apply_async(long_time_task, args=(i,))
    p.close()
    # 等待所有子进程结束后在关闭主进程
    p.join()
    print('【End】')
```
## 进程间通信
```python
from multiprocessing import Process, Queue
import os, time, random

def write(q):
    # 写数据进程
    print('写进程的PID:{0}'.format(os.getpid()))
    for value in ['两点水', '三点水', '四点水']:
        print('写进 Queue 的值为：{0}'.format(value))
        q.put(value)
        time.sleep(random.random())

def read(q):
    # 读取数据进程
    print('读进程的PID:{0}'.format(os.getpid()))
    while True:
        value = q.get(True)
        print('从 Queue 读取的值为：{0}'.format(value))

if __name__ == '__main__':
    # 父进程创建 Queue，并传给各个子进程
    q = Queue()
    pw = Process(target=write, args=(q,))
    pr = Process(target=read, args=(q,))
    # 启动子进程 pw
    pw.start()
    # 启动子进程pr
    pr.start()
    # 等待pw结束:
    pw.join()
    # pr 进程里是死循环，无法等待其结束，只能强行终止
    pr.terminate()
```
## 多线程
### 创建类
```python
from random import randint
from threading import Thread
from time import time, sleep

def download(filename):
    print('开始下载%s...' % filename)
    time_to_download = randint(5, 10)
    sleep(time_to_download)
    print('%s下载完成! 耗费了%d秒' % (filename, time_to_download))

def main():
    start = time()
    t1 = Thread(target=download, args=('Python从入门到住院.pdf',))
    t1.start()
    t2 = Thread(target=download, args=('Peking Hot.avi',))
    t2.start()
    t1.join()
    t2.join()
    end = time()
    print('总共耗费了%.3f秒' % (end - start))

if __name__ == '__main__':
    main()
```
### 继承类
```python
from random import randint
from threading import Thread
from time import time, sleep

class DownloadTask(Thread):

    def __init__(self, filename):
        super().__init__()
        self._filename = filename

    def run(self):
        print('开始下载%s...' % self._filename)
        time_to_download = randint(5, 10)
        sleep(time_to_download)
        print('%s下载完成! 耗费了%d秒' % (self._filename, time_to_download))

def main():
    start = time()
    t1 = DownloadTask('Python从入门到住院.pdf')
    t1.start()
    t2 = DownloadTask('Peking Hot.avi')
    t2.start()
    t1.join()
    t2.join()
    end = time()
    print('总共耗费了%.2f秒.' % (end - start))

if __name__ == '__main__':
    main()
```
#### 使用锁来保护进程资源
```python
from time import sleep
from threading import Thread, Lock

class Account(object):

    def __init__(self):
        self._balance = 0
        self._lock = Lock()

    def deposit(self, money):
        # 先获取锁才能执行后续的代码
        self._lock.acquire()
        try:
            new_balance = self._balance + money
            sleep(0.01)
            self._balance = new_balance
        finally:
            # 在finally中执行释放锁的操作保证正常异常锁都能释放
            self._lock.release()

    @property
    def balance(self):
        return self._balance

class AddMoneyThread(Thread):

    def __init__(self, account, money):
        super().__init__()
        self._account = account
        self._money = money

    def run(self):
        self._account.deposit(self._money)

def main():
    account = Account()
    threads = []
    for _ in range(100):
        t = AddMoneyThread(account, 1)
        threads.append(t)
        t.start()
    for t in threads:
        t.join()
    print('账户余额为: ￥%d元' % account.balance)

if __name__ == '__main__':
    main()
```
### Condition 条件变量
**使用 Condition 对象可以在某些事件触发或者达到特定的条件后才处理数据，Condition 除了具有 Lock 对象的 acquire 方法和 release 方法外，还提供了 wait 和 notify 方法。**
线程首先 acquire 一个条件变量锁。如果条件不足，则该线程 wait，如果满足就执行线程，甚至可以 notify 其他线程。其他处于 wait 状态的线程接到通知后会重新判断条件。
其中条件变量可以看成不同的线程先后 acquire 获得锁，如果不满足条件，可以理解为被扔到一个（ Lock 或 RLock ）的 waiting 池。直到其他线程 notify 之后再重新判断条件。不断的重复这一过程，从而解决复杂的同步问题。
```python
import threading, time

class Consumer(threading.Thread):
    def __init__(self, cond, name):
        # 初始化
        super(Consumer, self).__init__()
        self.cond = cond
        self.name = name

    def run(self):
        # 确保先运行Seeker中的方法
        time.sleep(1)
        self.cond.acquire()
        print(self.name + ': 我这两件商品一起买，可以便宜点吗')
        self.cond.notify()
        self.cond.wait()
        print(self.name + ': 我已经提交订单了，你修改下价格')
        self.cond.notify()
        self.cond.wait()
        print(self.name + ': 收到，我支付成功了')
        self.cond.notify()
        self.cond.release()
        print(self.name + ': 等待收货')

class Producer(threading.Thread):
    def __init__(self, cond, name):
        super(Producer, self).__init__()
        self.cond = cond
        self.name = name

    def run(self):
        self.cond.acquire()
        # 释放对琐的占用，同时线程挂起在这里，直到被 notify 并重新占有琐。
        self.cond.wait()
        print(self.name + ': 可以的，你提交订单吧')
        self.cond.notify()
        self.cond.wait()
        print(self.name + ': 好了，已经修改了')
        self.cond.notify()
        self.cond.wait()
        print(self.name + ': 嗯，收款成功，马上给你发货')
        self.cond.release()
        print(self.name + ': 发货商品')

cond = threading.Condition()
consumer = Consumer(cond, '买家（两点水）')
producer = Producer(cond, '卖家（三点水）')
consumer.start()
producer.start()
```
### 线程间通信
从一个线程向另一个线程发送数据最安全的方式可能就是使用 queue 库中的队列了。创建一个被多个线程共享的 `Queue` 对象，这些线程通过使用 `put()` 和 `get()` 操作来向队列中添加或者删除元素。
```python
from queue import Queue
from threading import Thread

isRead = True

def write(q):
    # 写数据进程
    for value in ['两点水', '三点水', '四点水']:
        print('写进 Queue 的值为：{0}'.format(value))
        q.put(value)

def read(q):
    # 读取数据进程
    while isRead:
        value = q.get(True)
        print('从 Queue 读取的值为：{0}'.format(value))

if __name__ == '__main__':
    q = Queue()
    t1 = Thread(target=write, args=(q,))
    t2 = Thread(target=read, args=(q,))
    t1.start()
    t2.start()
```
- 设置信号
	使用 Event 的 `set()` 方法可以设置 Event 对象内部的信号标志为真。Event 对象提供了 `isSe()` 方法来判断其内部信号标志的状态。当使用 event 对象的 `set()` 方法后，`isSet()` 方法返回真
- 清除信号
	使用 Event 对象的 `clear()` 方法可以清除 Event 对象内部的信号标志，即将其设为假，当使用 Event 的 clear 方法后，isSet() 方法返回假
- 等待
	Event 对象 wait 的方法只有在内部信号为真的时候才会很快的执行并完成返回。当 Event 对象的内部信号标志位假时，则 wait 方法一直等待到其为真时才返回。
```python
import threading

class mThread(threading.Thread):
    def __init__(self, threadname):
        threading.Thread.__init__(self, name=threadname)

    def run(self):
        # 使用全局Event对象
        global event
        # 判断Event对象内部信号标志
        if event.isSet():
            event.clear()
            event.wait()
            print(self.getName())
        else:
            print(self.getName())
            # 设置Event对象内部信号标志
            event.set()

# 生成Event对象
event = threading.Event()
# 设置Event对象内部信号标志
event.set()
t1 = []
for i in range(10):
    t = mThread(str(i))
    # 生成线程列表
    t1.append(t)

for i in t1:
    # 运行线程
    i.start()
```
## 网络编程入门
#### requests库
```python
pip install requests
```
使用
```python
from time import time
from threading import Thread

import requests

# 继承Thread类创建自定义的线程类
class DownloadHanlder(Thread):

    def __init__(self, url):
        super().__init__()
        self.url = url

    def run(self):
        filename = self.url[self.url.rfind('/') + 1:]
        resp = requests.get(self.url)
        with open('/Users/Hao/' + filename, 'wb') as f:
            f.write(resp.content)

def main():
    # 通过requests模块的get函数获取网络资源
    # 下面的代码中使用了天行数据接口提供的网络API
    # 要使用该数据接口需要在天行数据的网站上注册
    # 然后用自己的Key替换掉下面代码的中APIKey即可
    resp = requests.get(
        'http://api.tianapi.com/meinv/?key=APIKey&num=10')
    # 将服务器返回的JSON格式的数据解析为字典
    data_model = resp.json()
    for mm_dict in data_model['newslist']:
        url = mm_dict['picUrl']
        # 通过多线程的方式实现图片下载
        DownloadHanlder(url).start()

if __name__ == '__main__':
    main()
```
提供时间日期的服务器
```python
from socket import socket, SOCK_STREAM, AF_INET
from datetime import datetime

def main():
    # 1.创建套接字对象并指定使用哪种传输服务
    # family=AF_INET - IPv4地址
    # family=AF_INET6 - IPv6地址
    # type=SOCK_STREAM - TCP套接字
    # type=SOCK_DGRAM - UDP套接字
    # type=SOCK_RAW - 原始套接字
    server = socket(family=AF_INET, type=SOCK_STREAM)
    # 2.绑定IP地址和端口(端口用于区分不同的服务)
    # 同一时间在同一个端口上只能绑定一个服务否则报错
    server.bind(('192.168.1.2', 6789))
    # 3.开启监听 - 监听客户端连接到服务器
    # 参数512可以理解为连接队列的大小
    server.listen(512)
    print('服务器启动开始监听...')
    while True:
        # 4.通过循环接收客户端的连接并作出相应的处理(提供服务)
        # accept方法是一个阻塞方法如果没有客户端连接到服务器代码不会向下执行
        # accept方法返回一个元组其中的第一个元素是客户端对象
        # 第二个元素是连接到服务器的客户端的地址(由IP和端口两部分构成)
        client, addr = server.accept()
        print(str(addr) + '连接到了服务器.')
        # 5.发送数据
        client.send(str(datetime.now()).encode('utf-8'))
        # 6.断开连接
        client.close()

if __name__ == '__main__':
    main()
```
设计一个使用多线程技术处理多个用户请求的服务器，该服务器会向连接到服务器的客户端发送一张图片。
服务器端代码：
```python
from socket import socket, SOCK_STREAM, AF_INET
from base64 import b64encode
from json import dumps
from threading import Thread

def main():
    
    # 自定义线程类
    class FileTransferHandler(Thread):

        def __init__(self, cclient):
            super().__init__()
            self.cclient = cclient

        def run(self):
            my_dict = {}
            my_dict['filename'] = 'guido.jpg'
            # JSON是纯文本不能携带二进制数据
            # 所以图片的二进制数据要处理成base64编码
            my_dict['filedata'] = data
            # 通过dumps函数将字典处理成JSON字符串
            json_str = dumps(my_dict)
            # 发送JSON字符串
            self.cclient.send(json_str.encode('utf-8'))
            self.cclient.close()

    # 1.创建套接字对象并指定使用哪种传输服务
    server = socket()
    # 2.绑定IP地址和端口(区分不同的服务)
    server.bind(('192.168.1.2', 5566))
    # 3.开启监听 - 监听客户端连接到服务器
    server.listen(512)
    print('服务器启动开始监听...')
    with open('guido.jpg', 'rb') as f:
        # 将二进制数据处理成base64再解码成字符串
        data = b64encode(f.read()).decode('utf-8')
    while True:
        client, addr = server.accept()
        # 启动一个线程来处理客户端的请求
        FileTransferHandler(client).start()

if __name__ == '__main__':
    main()
```
客户端代码：
```python
from socket import socket
from json import loads
from base64 import b64decode

def main():
    client = socket()
    client.connect(('192.168.1.2', 5566))
    # 定义一个保存二进制数据的对象
    in_data = bytes()
    # 由于不知道服务器发送的数据有多大每次接收1024字节
    data = client.recv(1024)
    while data:
        # 将收到的数据拼接起来
        in_data += data
        data = client.recv(1024)
    # 将收到的二进制数据解码成JSON字符串并转换成字典
    # loads函数的作用就是将JSON字符串转成字典对象
    my_dict = loads(in_data.decode('utf-8'))
    filename = my_dict['filename']
    filedata = my_dict['filedata'].encode('utf-8')
    with open('/Users/Hao/' + filename, 'wb') as f:
        # 将base64格式的数据解码成二进制数据并写入文件
        f.write(b64decode(filedata))
    print('图片已保存.')

if __name__ == '__main__':
    main()
```
