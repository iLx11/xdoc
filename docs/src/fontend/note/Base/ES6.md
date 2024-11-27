---
title: ES6
date: 2022-10-16 13:22:51
tags:
categories:
classes: 笔记
---

## var, let , const之间的区别

### var

> 声明的变量既是全局变量，也是顶级变量
>
> 存在变量提升
>
> 可以多次声明，前面的会覆盖后面的
>
> 函数中是局部的

### let

> 块级作用域
>
> 没有变量提升，声明前不存在，“暂时性死区”
>
> 不允许重复

### const

> 声明简单数据类型为常量，不能改变
>
> 声明复杂数据类型，保存指向实际数据的指针，变量的结构可以改变
>
> 块级作用域
>
> 没有变量提升，声明前不存在，“暂时性死区”

## 扩展运算符

扩展元素符`...`，好比 `rest` 参数的逆运算，将一个数组转为用逗号分隔的参数序列

主要用于函数调用的时候，将一个数组变为参数序列

```js
const numbers = [4, 38];
add(...numbers) // 42

[...document.querySelectorAll('div')]
// [<div>, <div>, <div>]
```

可以简单实现复制与合并数组

通过扩展运算符实现的是`浅拷贝`

将字符串转为数组

```js
[...'hello']
// [ "h", "e", "l", "l", "o" ]
```

定义了遍历器（Iterator）接口的对象，都可以用扩展运算符转为真正的数组

- 遍历器（Iterator）。它是一种接口，为各种不同的数据结构提供统一的访问机制。任何数据结构只要部署 Iterator 接口，就可以完成遍历操作（即依次处理该数据结构的所有成员）。

  #### 遍历器的作用

  （1）为各种数据结构，提供一个统一的、简便的访问接口；
  （2）使得数据结构的成员能够按某种次序排列；
  （3） ES6 创造了一种新的遍历命令for…of循环，Iterator 接口主要供for…of消费（for of遍历的对象必须存在遍历器接口 才可以遍历）

  #### Iterator 的遍历过程

  （1）创建一个指针对象，指向当前数据结构的起始位置。也就是说，遍历器对象本质上，就是一个指针对象。
  （2）第一次调用指针对象的next方法，可以将指针指向数据结构的第一个成员。
  （3）第二次调用指针对象的next方法，指针就指向数据结构的第二个成员。
  （4）不断调用指针对象的next方法，直到它指向数据结构的结束位置。
  每一次调用next方法，都会返回数据结构的当前成员的信息。具体来说，就是返回一个包含value和done两个属性的对象。其中，value属性是当前成员的值，done属性是一个布尔值，表示遍历是否结束。

##### 关于构造函数，数组新增的方法有如下：

> - Array.from()
>
>   将两类对象转为真正的数组：类似数组的对象和可遍历`（iterable）`的对象（包括 `ES6` 新增的数据结构 `Set` 和 `Map`）
>
>   还可以接受第二个参数，用来对每个元素进行处理，将处理后的值放入返回的数组
>
> - Array.of()
>
>   用于将一组值，转换为数组
>
>   没有参数的时候，返回一个空数组
>
>   当参数只有一个的时候，实际上是指定数组的长度
>
>   参数个数不少于 2 个时，Array()才会返回由参数组成的新数组

Array.from()

```js
let arrayLike = {
    '0': 'a',
    '1': 'b',
    '2': 'c',
    length: 3
};
let arr2 = Array.from(arrayLike); // ['a', 'b', 'c']
```



## 关于数组实例对象新增的方法



> - #### copyWithin()
>
>   将指定位置的成员复制到其他位置（会覆盖原有成员），然后返回当前数组
>
>   参数如下：
>
>   - target（必需）：从该位置开始替换数据。如果为负值，表示倒数。
>   - start（可选）：从该位置开始读取数据，默认为 0。如果为负值，表示从末尾开始计算。
>   - end（可选）：到该位置前停止读取数据，默认等于数组长度。如果为负值，表示从末尾开始计算。

```js
[1, 2, 3, 4, 5].copyWithin(0, 3) // 将从 3 号位直到数组结束的成员（4 和 5），复制到从 0 号位开始的位置，结果覆盖了原来的 1 和 2
// [4, 5, 3, 4, 5]
```



> #### find()
>
> 参数是一个回调函数，接受三个参数依次为value, key, arr
>
> #### findIndex()
>
> 返回第一个符合条件的数组成员的位置，如果所有成员都不符合条件，则返回-1
>
> 这两个方法都可以接受第二个参数，用来绑定回调函数的`this`对象。



> #### fill()
>
> 使用给定值，填充一个数组
>
> 还可以接受第二个和第三个参数，用于指定填充的起始位置和结束位置

> `keys()`是对键名的遍历、`values()`是对键值的遍历，`entries()`是对键值对的遍历
>
> 
>
> #### includes()
>
> 用于判断数组是否包含给定的值
>
> #### flat()
>
> 将数组扁平化处理(降维)，返回一个新数组，对原数据没有影响

## 对象扩展

### 参数

#### 参数设置默认值

```js
function def(x, y = 'default') {
  console.log(x, y);
}
```

##### 与解构结合

```js
function def({x, y = 5})
```

### 属性

##### length属性

`length`将返回没有指定默认值的参数个数

`rest` 参数也不会计入`length`属性

如果设置了默认值的参数不是尾参数，那么`length`属性也不再计入后面的参数了

##### name属性

返回该函数的函数名

### 严格模式

只要函数参数使用了默认值、解构赋值、或者扩展运算符，那么函数内部就不能显式设定为严格模式，否则会报错

#### 箭头函数

- 函数体内的`this`对象，就是定义时所在的对象，而不是使用时所在的对象
- 不可以当作构造函数，也就是说，不可以使用`new`命令，否则会抛出一个错误
- 不可以使用`arguments`对象，该对象在函数体内不存在。如果要用，可以用 `rest` 参数代替
- 不可以使用`yield`命令，因此箭头函数不能用作 Generator 函数

### Set、Map

`Set`是一种叫做集合的数据结构，`Map`是一种叫做字典的数据结构

-  集合
  是由一堆无序的、相关联的，且不重复的内存结构【数学中称为元素】组成的组合 
-  字典
  是一些元素的集合。每个元素有一个称作key 的域，不同元素的key 各不相同 

### Set

成员的值都是唯一的，没有重复的值

`Set`的实例关于增删改查的方法：

> -  add() 
> -  delete() 
> -  has() 
> -  clear() 

关于遍历的方法，有如下：

> - keys()：返回键名的遍历器
> - values()：返回键值的遍历器
> - entries()：返回键值对的遍历器
> - forEach()：使用回调函数遍历每个成员

```js
for(let item of set.keys()) {
	console.log(item)
}

set.forEach((value, key) => console.log(key + ' : ' + value))
```

实现并集、交集、和差集

```js
let a = new Set([1, 2, 3]);
let b = new Set([4, 3, 2]);
// 并集
let union = new Set([...a, ...b]);
// Set {1, 2, 3, 4}

// 交集
let intersect = new Set([...a].filter(x => b.has(x)));
// set {2, 3}

// （a 相对于 b 的）差集
let difference = new Set([...a].filter(x => !b.has(x)));
// Set {1}
```

### Map

`Map`类型是键值对的有序列表，而键和值都可以是任意类型

`Map`本身是一个构造函数，用来生成 `Map` 数据结构

`Map` 结构的实例针对增删改查有以下属性和操作方法：

> - size 属性
>
> - set()
>
>   设置键名`key`对应的键值为`value`，然后返回整个 Map 结构
>
>   如果`key`已经有值，则键值会被更新，否则就新生成该键
>
>   同时返回的是当前`Map`对象，可采用链式写法
>
> - get()
>
>   get`方法读取`key`对应的键值，如果找不到`key`，返回`undefined
>
> - has()
>
> - delete()
>
> - clear()

`Map`结构原生提供三个遍历器生成函数和一个遍历方法：

> - keys()：返回键名的遍历器
> - values()：返回键值的遍历器
> - entries()：返回所有成员的遍历器
> - forEach()：遍历 Map 的所有成员

在`API`中`WeakMap`与`Map`有两个区别：

> - 没有遍历操作的`API`
> - 没有`clear`清空方法



# Promise



异步编程的一种解决方案

`promise`解决异步操作的优点：

> - 链式操作减低了编码难度
> - 代码可读性明显增强

### 状态

`promise`对象仅有三种状态

> - `pending`（进行中）
> - `fulfilled`（已成功）
> - `rejected`（已失败）

### 特点

> - 对象的状态不受外界影响，只有异步操作的结果，可以决定当前是哪一种状态
> - 一旦状态改变（从`pending`变为`fulfilled`和从`pending`变为`rejected`），就不会再变，任何时候都可以得到这个结果

### 用法

```js
const promise = new Promise(function(resolve, reject) {});
```

`Promise`构建出来的实例存在以下方法：

> - then()
> - catch()
> - finally()

#### then

`then`是实例状态发生改变时的回调函数，第一个参数是`resolved`状态的回调函数，第二个参数是`rejected`状态的回调函数

#### catch

`catch()`方法是`.then(null, rejection)`或`.then(undefined, rejection)`的别名，用于指定发生错误时的回调函数

`Promise`对象的错误具有“冒泡”性质，会一直向后传递，直到被捕获为止

#### finally()

`finally()`方法用于指定不管 Promise 对象最后状态如何，都会执行的操作

#### all()

`Promise.all()`方法用于将多个 `Promise`实例，包装成一个新的 `Promise`实例

```js
const p = Promise.all([p1, p2, p3]);
```

- 只有`p1`、`p2`、`p3`的状态都变成`fulfilled`，`p`的状态才会变成`fulfilled`，此时`p1`、`p2`、`p3`的返回值组成一个数组，传递给`p`的回调函数

#### resolve()

将现有对象转为 `Promise`对象

```javascript
Promise.resolve('foo')
// 等价于
new Promise(resolve => resolve('foo'))
```

参数可以分成四种情况，分别如下：

- 参数是一个 Promise 实例，`promise.resolve`将不做任何修改、原封不动地返回这个实例
- 参数是一个`thenable`对象，`promise.resolve`会将这个对象转为 `Promise`对象，然后就立即执行`thenable`对象的`then()`方法
- 参数不是具有`then()`方法的对象，或根本就不是对象，`Promise.resolve()`会返回一个新的 Promise 对象，状态为`resolved`
- 没有参数时，直接返回一个`resolved`状态的 Promise 对象

#### reject()

```js
const p = Promise.reject('出错了');
// 等同于
const p = new Promise((resolve, reject) => reject('出错了'))

p.then(null, function (s) {
  console.log(s)
});
// 出错了
```

### Generator函数

异步编程解决方法

执行 `Generator` 函数会返回一个遍历器对象，可以依次遍历 `Generator` 函数内部的每一个状态

形式上，`Generator`函数是一个普通函数，但是有两个特征：

> - `function`关键字与函数名之间有一个星号
> - 函数体内部使用`yield`表达式，定义不同的内部状态

```js
function* helloWorldGenerator() {
  yield 'hello';
  yield 'world';
  return 'ending';
}
```

`Generator` 函数会返回一个遍历器对象，即具有`Symbol.iterator`属性，并且返回给自己

```js
g[Symbol.iterator] === g
```

yield 关键字可以暂停返回遍历器对象的状态

通过`next`方法才会遍历到下一个内部状态，其运行逻辑如下：

- 遇到`yield`表达式，就暂停执行后面的操作，并将紧跟在`yield`后面的那个表达式的值，作为返回的对象的`value`属性值。
- 下一次调用`next`方法时，再继续往下执行，直到遇到下一个`yield`表达式
- 如果没有再遇到新的`yield`表达式，就一直运行到函数结束，直到`return`语句为止，并将`return`语句后面的表达式的值，作为返回的对象的`value`属性值。
- 如果该函数没有`return`语句，则返回的对象的`value`属性值为`undefined`

```js
function* helloWorldGenerator() {
  yield 'hello';
  yield 'world';
  return 'ending';
}
var hw = helloWorldGenerator();

hw.next() 
//{value: hello, done: false}

hw.next() 
//{value: undefine, done: true}
```

返回的iterator对象可以用 for of 遍历

`yield`表达式可以暂停函数执行，`next`方法用于恢复函数执行，这使得`Generator`函数非常适合将异步任务同步化

```js
const gen = function* () {
  const f1 = yield readFile('/etc/fstab');
  const f2 = yield readFile('/etc/shells');
  console.log(f1.toString());
  console.log(f2.toString());
};
```



## anysc/await

### 异步最终解决方案



#### async

async是一个加在函数前的修饰符，被async定义的函数会默认返回一个Promise对象resolve的值。因此对async函数可以直接then，返回值就是then方法传入的函数。

#### await

await 也是一个修饰符，只能放在async定义的函数内。

await 修饰的如果是Promise对象：可以获取Promise中返回的内容（resolve或reject的参数），且取到值后语句才会往下执行；

如果不是Promise对象：把这个非promise的东西当做await表达式的结果。



### EventLoop

JavaScript主线程从“任务队列”中读取异步任务的回调函数，放到执行栈中依次执行。这个过程是循环不断的，所以整个的这种运行机制又称为EVentLoop（事件循环）。

## 宏任务和微任务

### 宏任务（macrotask）

> ·异步Ajax请求、
> ·setTimeout、setlnterval、
> ·文件操作
> ·其它宏任务

### 微任务（microtask）

> ·Promise.then、.catch和.finally
> ·process.nextTick
> ·其它微任务

每一个宏任务执行完之后，都会检查是否存在待执行的`微任务`，如果有，则执行完所有`微任务`之后，再继续执行下一个`宏任务`。



# proxy



**定义：** 用于定义基本操作的自定义行为

**本质：** 修改的是程序默认形为，就形同于在编程语言层面上做修改，属于元编程`(meta programming)`



元编程（Metaprogramming，又译超编程，是指某类计算机程序的编写，这类计算机程序编写或者操纵其它程序（或者自身）作为它们的数据，或者在运行时完成部分本应在编译时完成的工作

用于创建一个对象的代理，从而实现基本操作的拦截和自定义（如属性查找、赋值、枚举、函数调用等）

> 用于创建一个对象的代理，从而实现基本操作的拦截和自定义（如属性查找、赋值、枚举、函数调用等）



Proxy为 构造函数，用来生成 Proxy实例

```js
var proxy = new Proxy(target, handler)
```

### 参数

> `target`表示所要拦截的目标对象（任何类型的对象，包括原生数组，函数，甚至另一个代理））
>
> `handler`通常以函数作为属性的对象，各属性中的函数分别定义了在执行各种操作时代理 `p` 的行为

### handler解析



关于`handler`拦截属性，有如下：

- get(target,propKey,receiver)：拦截对象属性的读取
- set(target,propKey,value,receiver)：拦截对象属性的设置
- has(target,propKey)：拦截`propKey in proxy`的操作，返回一个布尔值
- deleteProperty(target,propKey)：拦截`delete proxy[propKey]`的操作，返回一个布尔值
- ownKeys(target)：拦截`Object.keys(proxy)`、`for...in`等循环，返回一个数组
- getOwnPropertyDescriptor(target, propKey)：拦截`Object.getOwnPropertyDescriptor(proxy, propKey)`，返回属性的描述对象
- defineProperty(target, propKey, propDesc)：拦截`Object.defineProperty(proxy, propKey, propDesc）`，返回一个布尔值
- preventExtensions(target)：拦截`Object.preventExtensions(proxy)`，返回一个布尔值
- getPrototypeOf(target)：拦截`Object.getPrototypeOf(proxy)`，返回一个对象
- isExtensible(target)：拦截`Object.isExtensible(proxy)`，返回一个布尔值
- setPrototypeOf(target, proto)：拦截`Object.setPrototypeOf(proxy, proto)`，返回一个布尔值
- apply(target, object, args)：拦截 Proxy 实例作为函数调用的操作
- construct(target, args)：拦截 Proxy 实例作为构造函数调用的操作

### Reflect



若需要在`Proxy`内部调用对象的默认行为，建议使用`Reflect`，其是`ES6`中操作对象而提供的新 `API`

基本特点：

- 只要`Proxy`对象具有的代理方法，`Reflect`对象全部具有，以静态方法的形式存在
- 修改某些`Object`方法的返回结果，让其变得更合理（定义不存在属性行为的时候不报错而是返回`false`）
- 让`Object`操作都变成函数行为

> `get`能够对数组增删改查进行拦截，下面是试下数组读取负数的索引

```js
function() createArray(...el) {
    lel handler = {
        get(target, propKey, receiver) {
            let index = Number(propKey) 
            if(index < 0) {
                propKey = String(target.length + index);   
            }
            return Reflect get(target, propKey, receiver);
        }
    }
   	ler target = [];
    target.push(...el);
    return new proxy(target, handler;
}
```

### set()

`set`方法用来拦截某个属性的赋值操作，可以接受四个参数，依次为目标对象、属性名、属性值和 `Proxy` 实例本身

假定`Person`对象有一个`age`属性，该属性应该是一个不大于 200 的整数，那么可以使用`Proxy`保证`age`的属性值符合要求



```javascript
let validator = {
  set: function(obj, prop, value) {
    if (prop === 'age') {
      if (!Number.isInteger(value)) {
        throw new TypeError('The age is not an integer');
      }
      if (value > 200) {
        throw new RangeError('The age seems invalid');
      }
    }

    // 对于满足条件的 age 属性以及其他属性，直接保存
    obj[prop] = value;
  }
};

let person = new Proxy({}, validator);

person.age = 100;

person.age // 100
person.age = 'young' // 报错
person.age = 300 // 报错
```



如果目标对象自身的某个属性，不可写且不可配置，那么`set`方法将不起作用

如果目标对象自身的某个属性，不可写且不可配置，那么`set`方法将不起作用

```js
Object.defineProperty(obj, 'foo', {
    value: 'bar',
    writable: false
})
```

## 使用场景



`Proxy`其功能非常类似于设计模式中的代理模式，常用功能如下：

- 拦截和监视外部对对象的访问
- 降低函数或类的复杂度
- 在复杂操作前对操作进行校验或对所需资源进行管理

使用 `Proxy` 保障数据类型的准确性



```javascript
let numericDataStore = { count: 0, amount: 1234, total: 14 };
numericDataStore = new Proxy(numericDataStore, {
    set(target, key, value, proxy) {
        if (typeof value !== 'number') {
            throw Error("属性只能是number类型");
        }
        return Reflect.set(target, key, value, proxy);
    }
});

numericDataStore.count = "foo"
// Error: 属性只能是number类型

numericDataStore.count = 333
// 赋值成功
```



声明了一个私有的 `apiKey`，便于 `api` 这个对象内部的方法调用，但不希望从外部也能够访问 `api._apiKey`



```javascript
let api = {
    _apiKey: '123abc456def',
    getUsers: function(){ },
    getUser: function(userId){ },
    setUser: function(userId, config){ }
};
const RESTRICTED = ['_apiKey'];
api = new Proxy(api, {
    get(target, key, proxy) {
        if(RESTRICTED.indexOf(key) > -1) {
            throw Error(`${key} 不可访问.`);
        } return Reflect.get(target, key, proxy);
    },
    set(target, key, value, proxy) {
        if(RESTRICTED.indexOf(key) > -1) {
            throw Error(`${key} 不可修改`);
        } return Reflect.get(target, key, value, proxy);
    }
});

console.log(api._apiKey)
api._apiKey = '987654321'
// 上述都抛出错误
```



还能通过使用`Proxy`实现观察者模式



观察者模式（Observer mode）指的是函数自动观察数据对象，一旦对象有变化，函数就会自动执行



`observable`函数返回一个原始对象的 `Proxy` 代理，拦截赋值操作，触发充当观察者的各个函数



```javascript
const queuedObservers = new Set();

const observe = fn => queuedObservers.add(fn);
const observable = obj => new Proxy(obj, {set});

function set(target, key, value, receiver) {
  const result = Reflect.set(target, key, value, receiver);
  queuedObservers.forEach(observer => observer());
  return result;
}
```

观察者函数都放进`Set`集合，当修改`obj`的值，在会`set`函数中拦截，自动执行`Set`所有的观察者

## ES6模块

#### 为什么需要模块化

- 代码抽象
- 代码封装
- 代码复用
- 依赖管理

模块化的机制：

- CommonJs (典型代表：node.js早期)
- AMD (典型代表：require.js)
- CMD (典型代表：sea.js)



（自动采用严格模式）模块功能主要由两个命令构成：

- `export`：用于规定模块的对外接口
- `import`：用于输入其他模块提供的功能



### 按需导出/ 导入

每个模块中可以使用多次按需导出
按需导入的成员名称必须和按需导出的名称保持一致
按需导入时，可以使用as关键字进行重命名
按需导入可以和默认导入一起使用

#### export 

```js
let year = 'year'
let mouth = 'mouth'
let day = 'day'
export {
year as Year, //重命名
mouth,
day
}
```

#### import

```js
import {Year as nian, mouth, day} from './js'

//导入整个模块
import * as all from './js'

//如果只有一个模块名，需要有配置文件，告诉引擎模块的位置
import { myMethod } from 'util'
```



在编译阶段，`import`会提升到整个模块的头部，首先执行

多次重复执行同样的导入，只会执行一次



### 默认导出

如果不需要知道变量名或函数就完成加载，就要用到`export default`命令，为模块指定默认输出

```javascript
// export-default.js
export default function () {
    console.log('foo')
}
```

加载该模块的时候，`import`命令可以为该函数指定任意名字

```javascript
// import-default.js
import customName from './export-default';
customName(); // 'foo'
```



### 动态加载

允许您仅在需要时动态加载模块，而不必预先加载所有模块，这存在明显的性能优势

这个新功能允许您将import()作为函数调用，将其作为参数传递给模块的路径。 它返回一个 promise，它用一个模块对象来实现，让你可以访问该对象的导出

```js
import('/modules/myModule.mjs')
  .then((module) => {
    // Do something with the module.
  });
```



# Decorator

简单来讲，装饰者模式就是一种在不改变原类和使用继承的情况下，动态地扩展对象功能的设计理论。

> - 代码可读性变强了，装饰器命名相当于一个注释
> - 在不改变原有代码情况下，对原来功能进行扩展

```js
//这里定义一个士兵，这时候他什么装备都没有
class soldier{ 
}

//定义一个得到 AK 装备的函数，即装饰器
function strong(target){
    target.AK = true
}

//使用该装饰器对士兵进行增强
@strong
class soldier{
}

//这时候士兵就有武器了
soldier.AK // true
```

























