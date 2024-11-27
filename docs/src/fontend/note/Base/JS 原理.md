---
title: js原理
date: 2023-05-24 07:57:48
tags:
categories:
classes: 笔记
---



# 数据类型

基本类型存储在栈，被引用或拷贝，会创建一个完全相等的变量

引用类型存储在堆，存储地址，多个引用指向同一地址，并涉及到共享

”共享“：

```js
let a = {
	name: 'aa',
    age: 20
}
function cc (o) { 
    o.age = 30;
    o = {
        name: 'bb',
        age: 40
    }
    return o;
}
let b = cc(a);
// b.age = 40; 	a.age = 30
```



## 数据类型检测

### typeof 

```js
typeof 1 // 'number'
typeof '1' // 'string'
typeof undefined // 'undefined'
typeof true // 'boolean'
typeof Symbol // 'symbol'
typeof null // 'object'(*)
typeof []/{}/console // 'object'
typeof console.log // 'function'
```

判断null

```js
if(? === null)
```

### instanceof

new 一个对象就是原型链继承上面的对象，通过instanceof 能判断这个对象是否是之前构造函数生成的对象

```js
let str = new String('aaa');
str instanceof String // true
let str = 'aaa'
str instanceof String // false
```



自己实现底层instanceof 

```js
function myInstanceof (left, right) {
    // 如果是基本数据类型，直接返回false
    if(typeof left != 'object' || left === null) return false;
    // Object.getPrototypeOf() 能够拿到参数的原型对象
    let proto = Object.getPrototypeOf(left);
    while((proto = Object.getPrototypeOf(proto)) !== null) {
        if(proto === right.prototype) return true;
    }
}
myInstanceOf(new Number(234), Number);
```



#### 总结：

instanceof 可以准确判断引用数据类型，不能正确判断基本数据类型

typeof 可以判断剧本数据类型，但只能判断一个 function 引用类型



### Object.prototype.toString()

对于Object 对象，可以直接调用 toString()， 其他对象需要 通过 call

```js
Object.prototype.toString({}) // [object Object]
Object.prototype.toString({}) // [object Object]
Object.prototype.toString(1) // [object Number]
Object.prototype.toString('1') // [object String]
Object.prototype.toString(true) // [object Boolean]
Object.prototype.toString(function() {}) // [object Function]
Object.prototype.toString(null/ undifined) // [.. Null/ Undefined]
Object.prototype.toString(/123/g) // RegExp
Object.prototype.toString(new Date()) // Date
Object.prototype.toString([])	// Array
Object.prototype.toString(document) // HTMLDocument
Object.prototype.toString([]) 	// Window
```

### 实现全局通用类型判断

```js
function getType (obj) {
    let type = typeof obj
	if(typeof obj !== 'object') {
        return type;
    }
    // 通过正则获取结果
    return Oject.prototype.toString.call(obj).replace(/^\[object (\S+)\]$/, '$1');
}
```



## 数据类型转换



### 强制类型转换

Number() / parseInt() / parseFloat() / toString() / String()  / Boolean()

#### Number 转换规则

- 布尔值： 1 、0
- 数组： 返回自身
- null： 0
- undefined： NaN
- 字符串：纯数字（包含16进制，正负号）；有效浮点转为浮点数值；空字符串转为 0；如果不是以上则返回 NaN
- Symbol：抛出错误

#### Boolean 转换规则

除了 undefined / null / false / '' / 0 / NaN 为false ，其他为 true

#### String 运算符转换规则

- null 转换为 'null'
- undefined 转换为 undefined
- true 转换为 'true'，false 转换为 'false'
- 数字转换遵循通用规则，极大极小的数字使用指数形式

#### NaN的概念

NaN 是一个全局对象的属性，NaN 是一个全局对象的属性，NaN是一种特殊的Number类型

#### 什么时候返回NaN （开篇第二道题也得到解决）

- 无穷大除以无穷大
- 给任意负数做开方运算
- 算数运算符与不是数字或无法转换为数字的操作数一起使用
- 字符串解析成数字

#### toString和String的区别

- toString()可以将数据都转为字符串，但是null和undefined不可以转换

  ```js
  console.log(null.toString())
  // 报错 TypeError: Cannot read property 'toString' of null
  
  console.log(undefined.toString())
  // 报错 TypeError: Cannot read property 'toString' of undefined
  ```

- String

  String()可以将null和undefined转换为字符串，但是没法转进制字符串

  ```js
  console.log(String(null));
  // null
  console.log(String(undefined));
  // undefine
  ```

- toString()括号中可以写数字，代表进制

  - 二进制：.toString(2)



### 隐式类型转换

通过逻辑运算符，关系运算符，相等运算符，或if/while条件操作，如果两个类型不相同，就会隐式转换

#### '==' 的转换规则

- 如果类型相同，无法转换
- 其中一个是 null / undefined， 另一个操作符也必须为 null / undefined，才为true
- 其中一个是 Symbol 类型，返回 false
- string 与 number 类型，则转为 number
- 其中一个为 boolean 转为 number
- 其中一个 为 object 且另一方为 stirng/ number/ symbol ，会将 object 转为原始类型再进行判断 （调用 object 的 valueof / toString)

#### '+'的转换规则

数字相加（两边都为数字）， 字符串拼接（两边都为字符串）
特殊规则：

- 其中一个为字符串，另一个是 undefined / null / boolean 则调用 toString() 方法进行拼接
- 如果是纯对象，数组，正则等， 则默认调用对象的转换方法存在优先级
- 其中一个是数字，另一个是 undefined/ null / boolean / number 会转为数字再运算

#### object 的转换规则

对象转换会先调用内置的[ToPrimitive] 函数

- 如果部署了 Symbol.toPrimitive 方法，优先调用再返回
- 调用 valueOf() 如果为基础类型，则返回
- 调用 toString() 如果为基础类型，则返回
- 如果都没有基础类型，则报错

```js
let obj = {
    value: 1,
    valueOf() {
        return 2;
    },
    toString() {
        return '3';
    },
    [Symbol.toPrimitive]() {
        return 4;
    }
}
console.log(obj + 1)
// 5 -> Symbol.toPrimitive
// 3 -> valueOf
// 31 -> toString
```

#### 特殊情况

```js
10 + {}
// 10[object Object]
{} + 10
// 10]
[1, 2, undefined, 4, 5] + 10
// "1,2,,4,510"
```





# 深浅拷贝

## 浅拷贝的原理和实现

如果对象属性是基本类型，复制的就是基本类型的值，如果是引用类型，复制的就是内存地址，一个对象改变则另一个也改变

### Object.assign

该方法可以用于对象合并，可以进行浅拷贝。第一个参数是拷贝的目标，后面的参数是拷贝的来源对象（可以多个来源）

```js
Object.assign(target, ...sources);
```

注意：

- 不会拷贝对象的继承属性
- 不拷贝不可枚举属性
- 可以拷贝 Symbol 类型的属性

```js
Object.defineProperty(obj1, 'innumerable', {
	value: '不可枚举属性',
    enumerable: false
})
let obj2 = {};
Object.assign(obj2, obj1);
```

### 扩展运算符

```js
let cloneObj = { ...obj};
```

如果属性都为基本类型的值，使用扩展运算符会更加方便

### concat 拷贝数组

只能用于数组的浅拷贝，比较局限
```js
let newarr = arr.concat();
```

### slice 拷贝数组

```js
arr.slice(begin, end);
```



### 手动实现浅拷贝

```js
function shallowClone (target) {
	if(typeof target === 'object' && target !== null) {
        const cloneT = Array.isArray(target) ? [] : {};
        for(let prop in target) {
            // 只检查对象的自有属性
            if(target.hasOwnProperty(prop)) {
            	cloneT[prop] = target[prop];
            }
        }
        return cloneT;
    }
    return target;
}
```



## 深拷贝的原理和实现

深拷贝对于复杂的引用类型数据类型，其在堆内存中完全开辟一块内存地址

### JSON.stringify()

```js
let obj1 = {a: 1, b: [1, 2, 3]};
let obj2 = JSON.parse(JSON.stringify(obj1));
```

- 拷贝的对象有函数、undefined、symbol，序列化后键值对会消失
- Date 引用类型会变为字符串
- 无法拷贝不可枚举属性
- RegExp 引用类型会变为空对象
- NaN Infinity -Infinity，序列化后会变为null
- 无法拷贝对象循环应用 （obj[key] = obj）

### 手写递归实现

```js
function deepClone (obj) {
    let cloneObj= {};
    for(let key in obj) {
        if(typeof obj[key] === 'object' && typeof obj[key] !== null) {
            cloneOb[key] = deepClone(obj[key]);
        }else {
            cloneObj[key] = obj[key];
        }
    }
    return cloneObj;
}
```

问题：

- 不能复制不可枚举属性以及Symbol 类型
- 只针对普通的引用类型，对于Array, Date, RegExp, Error, Function 不能正确拷贝
- 没有解决循环引用

### 改进版递归实现

- 针对不可枚举属性，以及Symbol 类型，可以用 Reflect.ownKeys方法实现
- 当参数为Date RegExp 类型，直接生成一个实例返回
- 利用 Object.getOwnPropertyDescriptors 可以获得对象的所有属性，结合 Object 的 create 方法创建一个新对象，并继承传入对象的的原型链
- 利用 WeakMap 类型作为 Hash 表，为弱引用类型，可以有效防止内存泄漏，

```js
const deepClone = function(obj, hash = new WeakMap()) {
    // 日期对象
    if(obj.constructor == Date) return new Date(obj);
    // 正则对象
    if(obj.construtor == RegExp) return new RegExp(obj);
    // 循环引用用weakmap 解决
    if(hash.has(obj)) return hash.get(obj);
    // 获取所有属性
    let allDesc = Object.getOwnPropertyDescriptors(obj);
    // 传入所有键的特性
    // Object.create(proto[,propertiesObject])
    let cloneObj = Object.create(Object.getPrototypeOf(obj), allDesc);
    // 继承原型链
    hash.set(obj, cloneObj);
    // 针对不可枚举属性
    for(let key in Reflect.ownKeys(obj)) {
        cloneObj[key] = (isComplexDataType(obj[key]) && typeof obj[key] !== 'function') ? deepClone(obj[key], hash) : obj[key];
    }
    return cloneObj;
}
```





# 继承

## js 实现继承的方式

### 原型链继承

每个构造函数都有一个原型对象， 原型对象包含一个指向构造函数的指针，而实例则包含一个原型对象指针

```js
function Parent() {
	this.name = 'Parent';
}
function Child() {
    this.age = 10;
}
Child.prototype = new Parent();
```

缺点：

实例使用同一个原型对象，内存空间是共享的

### 构造函数继承

```js
function Parent() {
    this.name = 'Parent';
}
Parent.prototype.getName = function() {
	return this.name;
}
function Child() {
    Parent.call(this);
}
let Child = new Child();
Child.name = 'Parent' // 不报错
Child.getName(); // 报错
```

缺点：

父类的引用属性不会共享，只能继承实例属性和方法， 不能继承原型属性或方法

### 组合继承

结合前两种

```js
function Parent() {
    this.name = 'Parent';
    this.arr = [1, 2, 3];
}
Parent.prototype.getName = function() {
    return this.name;
}
function Child() {
    // 第二次调用
    Parent.call(this);
}
// 第一次调用
Child.prototype = new Parent();
// 手动构造器，指向自己的构造函数
Child.constructor.prototype = Child;
```

缺点：

Parent 被构造了两次，造成了性能开销

### 原型式继承

```js
let Parent = {
    name: 'name',
    getName() {
        return this.name
    }
}
let Child = Object.create(Parent);
```

缺点：

多个实例的引用类型指向相同的内存

### 寄生式继承

原型式继承获得目标对象的浅拷贝， 然后利用浅拷贝能力进行增强，添加方法

```js
let Parent = {
    name: 'name',
    friend: 10,
    getName() {
        return this.name
    }
}
function clone(original) {
    let clone = Object.create(original);
    clone.getFriend = function() {
        return this.friend;
    }
    return clone;
}
let Child = clone(Parent);
```

### 寄生组合式继承

想对最优的解决方法

```js
function clone(Parent, Child) {
    // 使用 Object.create() 方法减少组合继承种一次构造
    Child.prototype = Object.create(Parent.prototype);
    chile.prototype.constuctor = Child;
}
function Parent {
    this.name = 'Parent';
}
Parent.prototype = getName() {
    return this.name;
}
function Child() {
    Parent.call(this);
}
clone(Parent, Child);
Child.prototype.getFriend = function() {
    return this.friend;
}
let Child1 = new Child();
```

 

### extends 关键字，使用的也是寄生组合式继承





## new 原理

### 生成步骤

1. 创建一个新对象
2. 将构造函数的作用域赋给新对象（this 指向新对象）
3. 执行构造函数的代码 （新对象添加属性）
4. 返回新对象

#### 当构造函数中有 return 一个对象的操作

当构造函数 return 一个新对象与 this 无关时， new 会直接返回新对象，而不通过执行步骤

```js
function Person() {
    this.name = 'people';
    return {
        age: 18
    }
}
let p1 = new Person();
console.log(p1) // { age: 18 }
```



## apply & call & bind 原理

### 基本语法

三个方法是挂在 Function 对象上的三个方法，调用三个方法必须是一个函数

tihsArg 表示所指向的对象

```js
func.call(thisArg, param1, param2, ..);
func.apply(thisArg, [param1, param2]);
func.bind(thisArg, param1, param2);
```

- call , apply 改变this 指向后立即执行
- bind 改变后并不立即执行

#### 理解借用的原理

```js
let a = {
	name: 'aaa',
    getName(msg) {
        return this.name + this.msg;
    }
}
let b = {
    name: 'bbb'
}
console.log(a.getName.call(b, '->message')) // bbb->message
console.log(a.getName.apply(b, ['->message'])) // bbb->message
let name = a.getName(b, '->message')
name(); // bbb->message
```

### 应用场景

#### 判断数据类型

```	js
Object.prototype.call(obj).replace(//);
```

#### 类数组借用方法

```js
let arrLike = {
    0: 'aa',
    1: 'bb',
    length: 2
}
Array.prototype.push.call(arrLike, 'cc', 'dd');
// {..2: 'cc', 3: 'dd', length: 4}
```

#### 获取最大最小值

减少展开数组的一步

```js
let arr = [12, 324, 12 , 4, 456];
const max = Math.max.apply(Math, arr);
```

-

### 手动实现 call, apply

eval() 函数计算 JavaScript 字符串，并把它作为脚本代码来执行。

如果参数是一个表达式，eval() 函数将执行表达式。如果参数是JavaScript语句，eval()将执行 JavaScript 语句（代码）。

```js
Function.prototype.call = function(context, ...args) {
    // 判断context是否有传值，没有则默认为window
    let context = context || window;
    // 将被调用的方法设置为context的属性（修改this指向为context）
    context.fn = this;
    let result = eval('context.fn(..args)');
    // 删除手动增加的属性方法
    delete context.fn;
    return result;
}
Function.prototype.apply = function(context, args) {
    let context = context || window;
    context.fn = this;
    let result = eval('context.fn(..args)');
    delete context.fn;
    return result;
}
```

### bind 的实现

不需要直接执行，所以不需要 eval，而是需要通过一个函数的方式将结果返回

```js
Function.prototype.bind = function(context, ...args) {
	if(typeof this !== 'function') throw Error("must function");
    let self = this;
    let fbound = function() {
        self.apply(this.intanceof self ? this : context, args.concat(Array.prototype.slice.call(arguments)));
    }
    if(this.prototype) {
        fbound.prototype = Object.create(this.prototype);
    }
    return fbound;
}
```

实现bind 的核心是返回的时候需要返回函数，且返回过程的原型链的属性不能丢失，所以需要 Object.create() 方法





## 闭包

是指有权访问另外一个函数作用域中的变量的函数，内层函数访问外层函数的作用域

### 解决循环输出

```js
fon(var i = 0; i < 5; i ++) {
    setTimeout(() => {
        console.log(i);
    }, 0);
}
// 666666
```

解释：

1. setTimeout 为宏任务， js  单线程 eventLoop 机制，在主线程同步任务执行完成之后才执行宏任务
2. setTimeout 函数也为闭包，寻找父级作用域 window 的全局变量，执行之前 i 已经为6

解决：

#### 利用 IIFE

```js
for(var i = 0; i < 5; i ++) {
    (function(j) {
        setTimeout(() => {
           console.log(j)
        });
    })(i);
}
```

#### 利用 let 块级作用域

```js
for(let i = 0; i < 5; i ++) {
	setTimeout(() => {
        console.log(i);
    }, 0);
}
```

#### 定时器传入第三个参数

```js
setTimeout(() => {
    console.log(i);
}, 0, i);
```



## 手动实现 stringify

通过 typeof 根据数据类型来处理不同情况

```js
function jsonStringify(data) {
	let type = typeof data;
    if(type !== 'object') {
        let result = data;
        if(Number.isNaN(data) || data == Infinity) {
            result = "null";
        }else if(type === 'function' || type === 'undefined' || type === 'symbol') {
            result = undefined;
        }else if(type === 'string') {
            result = `${ data }`;
        }
        return String(result);
    }else if(type === 'object') {
        if(data === null) {
            return "null";
        // Date 对象
        }else if(data.toJSON && typeof data.toJSON === 'function') {
            return jsonStringify(data.toJSON());
        // 处理数组
        }else if(data instanceof Array) {
            let result = [];
           	// 数组需要判断每一项
            data.forEach((o, i) => {
                if(typeof o === 'undefined' || typeof o === 'function' || typeof o === 'symbol') {
                    result[i] = "null";
                }else {
                    result[i] = jsonStringify(o);
                }
            });
            return `${result}`.replace(/'/, "");
        // 处理对象
        }else {
        	let result = [];
            Object.keys(data).forEach((o, i) => {
                // 忽略 symbol
                if(typeof o !== 'symbol') {
                    if(data[o] !== undefined typeof data[o] !== 'function' || typeof data[o] !== 'symbol') {
                     	result.push(`${o}:${jsonStringify(data[o])}`)   
                    }
                }
            })
        }
    }
}
```

​	

## 数组

### Array.from()

从一个类数组的可迭代对象中创建一个新的数组实例，返回新数组，步改变原对象

三个参数：

1. 类似数组的对象，必须
2. 加工函数， 经过加工和再返回
3. this 作用域，表示加工函数执行时的 this 的值

```js
let obj = {0: 'a', 1: 'b', 2: 'c', length: 3};
Array.from(obj, (value) => value.repeat(3))
// String
Array.from('abc') // ['a', 'b', 'c']
// Set
Array.from(new Set(['a', 'b'])) // ['a', 'b']
// Map
Array.from(new Map([1, 'a'], [2, 'b'])) // [[1, 'a'], [2, 'b']]
```

### 判断数组的 6种方法

```js
let arr = [];
// 1. es6 isArray()
Array.isArray(arr)
// 2. instanceof 
arr instanceof Array
// 3. constructor === Array
arr.constructor === Array
// 4. Object.prototype.isPrototypeOf
// 对象的原型（__proto__）指向Object的原型（prototype）
Array.prototype.isPrototypeOf(arr)
// 5. getPrototypeOf
Object.getPrototypeOf(arr) === Array.prototype()
// 6. prototype.toString
Object.prototype.call(arr) === '[object Array]'
```



### reduce

callback:

1. previousValue : 上一次调用的返回值
2. currentValue: 当前处理元素
3. current: 当前处理元素下标
4. array: 调用的数组

initialValue: 可选初始值





# 类数组

### 种类

1. 函数的参数对象 arguments
2. getElementsBy... 获得的 HTMLCollection
3. querySelector 获得的 NodeList

### arguments

#### 遍历参数

```js
for(let i = 0; i < arguments.length; i ++) {
	console.log(arguments[i])
}
```

#### 链接字符串

```js
let args = Array.prototype.slice.call(argument, 1);
return args.join(',')
```

#### 传递参数

```js
function foo() {
    bar.apply(this, arguments);
}
function bar(a, b, c) {
    console.log(a, b, c);
}
// 通过 apply 将 foo 的参数给 bar
foo(1, 2, 3);
```



### 类数组转数组

```js
let args = Array.from(arguments);

let args = [...arguments];

sum(..args)
```

#### 借用方法高级写法

```js
Array.prototype.slice.call(arguments);
// ==
[].slice(arguments);
```



## 数组扁平化

### 普通递归

```js
function flatten(arr) {
    let result = [];
    for(let i < arr.length; i ++) {
		if(Array.isArray(arr[i])) {
            result = result.concat(flatten(arr[i]));
        }else {
            result.push(arr[i]);
        }	
    }
    return result;
}
```

### reduce 迭代

```js
function flatten(arr) {
    return arr.reduce((pre, cur) => Array.isArray(cur) ?  pre.concat(flatten(cur)) : pre.push(cur), []);
}
```

### 扩展运算符

```js
function flatten(arr) {
    // 一层层展开
    while(arr.some(o => Array.isArray(o))) {
        arr = [].concat(...arr);
    }
    return arr;
}
```

### split 与 toString 共同处理

```js
function flatten(arr) {
    return arr.toString().split(',');
}
```

### 调用 falt

```js
return flat(Infinity);
```

### 正则和 JSON 方法

```js
function flatten(arr) {
    return JSON.parse(`[${JSON.stringify(arr).replace(/(\[|\])/g, '')}]`);
}
```





## sort 底层原理

1. 当 n < = 10 时， 采用插入排序
2. 当 n > 10 时，采用三路快速排序
3. 10 < n <= 1000，采用中位数作为哨兵元素
4. n > 1000 每隔 200 ~ 215 个元素挑一个元素放在新数组中，排序后找出中位数



### push 底层

```js
Array.prototype.push = function(...items) {
    // 先转为对象
    let O = Object(this);
    // 设置默认为0 -> lenght || 0
    let len = this.length >>> 0;
    // 参数数量
    let argCount = items.length >>> 0
    // 2 ^ 53 - 1 js 能表示的最大数
    if(len + argCount >  2 ** 53 - 1) {
        throw new TypeError("over the max value")
    }
    for(let i = 0; i < argCount; i ++) {
        O[len + i] = items[i];
    }
    let newLength = len + argCount;
    O.lenght = newLength;
    return newLength;
}
```





# 异步编程

### 同步：

执行代码时，在改代码没有得到返回结果之前，其他代码无法执行， 一旦执行完成拿到结果就会执行其他代码。也就是会阻塞之后的代码执行。

### 异步：

一段代码异步过程调用发出后，这段代码不会立刻得到返回结果，而是在发出后通过回调函数处理调用之后拿到结果。不会阻塞后面代码执行。

### 回调函数

早年的异步编程采用回调函数的方式，如事件回调。会存在回调地狱的问题。



## Promise 

没有根本解决回调地狱问题，换了一种写法，提升了可读性

```js
function read(url) {
    return new Promise((resolve, reject) => {
        fs.read(url, 'utf-8', (err, data) => {
            if(err) reject(err);
            resolve(data);
        })
    })
}
Promise.all([read(A), read(B)]).then(data => {
	console.log(data);
}).catch(err => console.log(data));
```

### 执行过程的状态

1. 待定 （pending）： 初始状态，没有被完成，也没有被拒绝
2. 已完成（fulfilled）：操作成功完成
3. 已拒绝（rejected）：操作失败

三大技术手段解决回调地狱：

回调函数延迟绑定，返回值穿透， 错误冒泡

回调函数不是直接声明的，而是通过后面的 then 方法传入，延迟传入，也就是回调函数延迟绑定

根据 then 中回调函数的传入值创建不同类型 promise 然后把返回的Promise 穿透到外层，以供后续调用

```js
let x = readFilePromise('x.json').then(data => readFilePromise('x.json'));
x.then();
```

前面产生的错误会一直向后传递， 被 catch 接收，错误冒泡

```js
readFilePromise('x.json', then(data => readFilePromise(''))).then().then().catch(err => //xxx)
```

### 静态方法

#### Promise.all(iterable)

参数为可迭代对象，如数组

1. 当所有结果成功返回时按请求顺序返回成功
2. 其中有一个失败方法时，则进入失败方法

#### allSettled

参数为数组，返回新的Promise

全部处理完后拿到每个 Promise 状态， 不管是否成功

```js
const resolved = Promise.resolve(2);
const rejected= Promise.reject(-1);
const allSettledPromise = Promise.allSettled([resolve, rejected]);
allSettledPromise.then(results => console.log(results));
// result: 
[
    {status: 'fulfilled', value: 2},
    {status: 'rejected', reason: -1}
]
```

#### any

只要有一个为 fulfilled 最后返回的实例就是 fulfilled 状态，否则为 rejected

#### race

race 方法返回一个 Promise，只要参数的 Promise 之中有一个实例率先改变状态，则 race 方法的返回状态就跟着改变。那个率先改变的 Promise 实例的返回值，就传递给 race 方法的回调函数。

##### 图片加载业务：

```js
// 请求资源
function requestImg() {
    let p = new Promise(function(resolve, reject) {
        let img = new Image();
        img.onload = function() {resolve(img);}
        img.src = 'http://xxx';
    })
}
// 延时函数
function timeout() {
    let p = new Promise((resolve, reject) => {
        setTimeout(() => {reject('图片请求超时');}, 5000);
    })
}
Promise.race([requestImg(), timeout()]).then(result => {console.log)(result)}).catch(reason => {console.log(reason)});
```



## Generator

可以交出函数的执行权，可以看为异步任务的容器，需要暂停时，用yield语法标注

```js
function* gen() {
    let a = yield 1;
    let b = yield (function(){return 2})();
    return 3;
}
// 程序阻塞不会执行任何语句
let g = gen();
g.next(); // {value: 1, done: false}
g.next(); // {value: 2, done: false}
g.next(); // {value: 3, done: true}
g.next(); // {value: undefined, done: true}
```

### Genetator 和 Promise 

```js
const gen = function* () {
    const data1 = yield readFilePromise('');
    console.log(data2.toString());
    const data2 = yield readFilePromise('');
    console.log(data2.toString());
}
let g = gen();
function run(gen) {
    const next = (err, data) => {
        let res = gen.next(data);
        if(res.done) return;
        res.value.then(next);
    }
    next();
}
run(g);
```

### co 函数库

```js
const con = require('co');
let g = gen();
co(g).then(res => {
    console.log(res);
})
```



## async / await

是 Generator 函数的语法糖，代码更为清晰，使异步同步化

```js
function testWait() {
    return new Promise((resolve, reject) => {
        setTimeout(function() {
            console.log("test");
            resolve();
        }, 1000);
    })
}
async function test() {
    await testWait();
    console.log("hello");
}
// test hello
```

### async 函数对 Generator 的改进

1. 内置执行器： Generator 函数执行必须依靠执行器，因为不能一次性执行完。 async 不使用 next 方法，自带执行器，会自动执行。
2. 适用性更好： await 关键词之后可以不受约束
3. 可读性更好： 语义清晰明了



## JavaScript 内存管理

在 javascript 中创建变量时， 系统会自动给对象分配对应的内存

简单数据类型 -》 （stack）  引用数据类型 -》 （heap）

### Chrome 内存回收机制

V8 引擎将堆内存分为两类，新生代回收和老生代回收机制

#### 新生代内存回收

在64位下分配 32MB ，新生代变量存活时间短， 不太容易产生太大的内存压力。

内存分为作用两个空间 from - to。当浏览器开始进行内存垃圾回收时，引擎会将左边的对象检查一遍， 如果是存活对象，就会复制到右边的空间去，如果不是存活的就直接进行系统回收。当左边内存没有对象时， 等有新生代对象产生时， 内存则左右对调，循环处理。

#### 内存碎片处理

利用 Scavenge 算法处理内存碎片， 使其紧密排列

#### 老生代内存回收

如果新生代中的变量经过回收之后依然存在，那么就会被放入老生代内存中。只要是经历过一次 Scavenge 算法回收的就可以晋升为老生代内存的对象。进入老生代内存后就不能再用 Scavenge 的算法了。因为不适合内存比较大的。

老生代中采用 Mark-Sweep (标记清除) 和 Mark-Compact (标记整理) 的策略

#### Mark-Sweep (标记清除)

首先它会遍历堆上的所有的对象，分别对它们打上标记；然后在代码执行过程结束之后，对使用过的变量取消标记。那么没取消标记的就是没有使用过的变量，因此在清除阶段，就会把还有标记的进行整体清除，从而释放内存空间。

####  Mark-Compact (标记整理) 

为了方便解决浏览器中的内存碎片问题，标记整理这个策略被提出。这个策略是在标记清除的基础上演进而来的，和标记清除来对比来看，标记整理添加了活动对象整理阶段，处理过程中会将所有的活动对象`往一端靠拢`，整体移动完成后，直接清理掉边界外的内存。





## 内存泄露与优化

### 内存泄漏场景

1. 过多的缓存未释放
2. 闭包太多未释放
3. 定时器太多或回调太多
4. 太多的无效的 DOIM 未释放
5. 全局变量太多



## 浏览器Eventloop

#### 调用堆栈 (call stack) 负责跟踪所用要执行的代码

每当一个函数执行完成，就会从堆栈中弹出 (pop) 该执行完成函数，有代码需要执行就进行 push

#### 事件队列 (event queue) 负责将新的 function 发送到队列中进行处理

####  每当调用事件队列 (event queue) 中的异步函数时， 都将其发送到浏览器

根据从调用堆栈收到的命令，API 开始自己的单线程操作。其中 setTimeout 方法就是一个比较典型的例子，在堆栈中处理 setTimeout 操作时，会将其发送到相应的 API，该 API 一直等到指定的时间将此操作送回进行处理。它将操作发送到事件队列（event queue）。这样，就有了一个循环系统，用于在 JavaScript 中运行异步操作。

#### JavaScript 语言本身是单线程的，而浏览器 API 充当单独的线程

事件循环（Eventloop）促进了这一过程，它会不断检查调用堆栈是否为空。如果为空，则从事件队列中添加新的函数进入调用栈（call stack）；如果不为空，则处理当前函数的调用。

#### Eventloop 通过内部两个队列来实现 Event Queue 放进来的异步任务

以 setTimeout 为代表的任务被称为宏任务，放到宏任务队列（macrotask queue）中；而以 Promise&nbsp;为代表的任务被称为微任务，放到微任务队列（microtask queue）中。

1. JavaScript 引擎首先从宏任务队列（macrotask queue）中取出第一个任务
2. 执行完毕后，再将微任务（microtask queue）中的所有任务取出，按照顺序分别全部执行（这里包括不仅指开始执行时队列里的微任务），如果在这一步过程中产生新的微任务，也需要执行
3. 然后再从宏任务队列中取下一个，执行完毕后，再次将 microtask queue 中的全部取出，循环往复，直到两个 queue 中的任务都取完

#### 一次 Eventloop 循环会处理一个宏任务和所有这次循环中产生的微任务



## js代码执行

### V8 引擎介绍

V8 是众多浏览器的 JS 引擎中性能表现最好的一个，并且它是 Chrome 的内核，Node.js 也是基于 V8 引擎研发的。

### 执行阶段

- Parse 阶段：V8 引擎负责将 JS 代码转换成 AST（抽象语法树）；
- Ignition 阶段：解释器将 AST 转换为字节码，解析执行字节码也会为下一个阶段优化编译提供需要的信息；
- TurboFan 阶段：编译器利用上个阶段收集的信息，将字节码优化为可以执行的机器码；
- Orinoco 阶段：垃圾回收阶段，将程序中不再使用的内存空间进行回收。

### 生成 AST

#### 词法分析：

这个阶段会将源代码拆成最小的、不可再分的词法单元，称为 token。比如这行代码 var a =1；通常会被分解成 var 、a、=、2、; 这五个词法单元。另外刚才代码中的空格在 JavaScript 中是直接忽略的。

#### 语法分析：

这个过程是将词法单元转换成一个由元素逐级嵌套所组成的代表了程序语法结构的树，这个树被称为抽象语法树。



## 宏任务与微任务

### 宏任务

1. 渲染事件（解析DOM 计算布局 绘制）
2. 用户交互事件
3. setTimeout, setInterval
4. 网络请求完成，文件读写完成事件

### 微任务

- 使用 MutationObserver 监控某个 DOM 节点，或者为这个节点添加、删除部分子节点，当 DOM 节点发生变化时，就会产生 DOM 变化记录的微任务。
- 使用 Promise，当调用 Promise.resolve() 或者 Promise.reject() 的时候，也会产生微任务。

