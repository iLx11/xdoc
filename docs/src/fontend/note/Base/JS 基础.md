---
title: js基础
date: 2022-10-15 12:59:21
tags:
categories:
classes: 笔记
---

## js 技巧

### 浮点数转为整数（`Float to Integer`）🦊

我们一般将浮点数转化为整数会用到`Math.floor()`、`Math.ceil()`、`Math.round()`。但其实有一个更快的方式：

```js
console.log(~~6.95); // 6
console.log(6.95 >> 0); // 6
console.log(6.95 << 0); // 6
console.log(6.95 | 0); // 6
// >>>不可对负数取整
console.log(6.95 >>> 0); // 6
```

### 获取数组中的最后一项 🦁

通常，获取数组最后一项，我们用的比较多的是：

```js
let arr = [0, 1, 2, 3, 4, 5];
const last = arr[arr.length - 1];
console.log(last);

Output: 5;
```

但我们也可以通过`slice`操作来实现：

```js
let arr = [0, 1, 2, 3, 4, 5];
const last = arr.slice(-1)[0];
console.log(last);

Output: 5;
```

### 求幂运算 🍜

平时我们实现指数运算，用的比较多的应该是`Math.pow()`，比如求`2^10`：

```js
console.log(Math.pow(2, 10));
```

在`ES7`中引入了指数运算符`**`，`**`具有与`Math.pow()`一样的计算结果。

```sj
console.log(2 ** 10); // 输出1024
```

### 避免多条件并列 🦀

开发中有时会遇到多个条件，执行相同的语句，也就是多个`||`这种：

```js
if (status === 'process' || status === 'wait' || status === 'fail') {
  doSomething()
}
```

这种写法语义性、可读性都不太好。可以通过`switch case`或`includes`这种进行改造。

`switch case`

```js
switch(status) {
  case 'process':
  case 'wait':
  case 'fail':
    doSomething()
}
```

`includes`

```js
const enum = ['process', 'wait', 'fail']
if (enum.includes(status)) {
  doSomething()
}
```



## 内置类型

六种类型，Undefined, Null, Boolean, String , Number,Object ,Symbol

> 基本数据类型：Undefined, Null, Boolean, String , Number

有固定长度，保存在栈上

> 引用数据类型：Object

不可预知长度，保存在堆中，栈中保存指向堆内存的地址

js是动态类型（弱类型）

##### typeof来判断类型

判断一个值是不是 null 类型

```js
function isNull(o) {
    return !o &&  typeof o === "object"
}
```

- undefined 不是未定义，两者有区别。尝试去读一个未定义的变量的值其实会直接`Reference Error`
- typeof 不能区分未定义，还是定义了但是没有值。两者都会都会返回undefined
- typeof 一个未定义的变量不会触发`Reference Error`

> Array是一种容器类型

本质上是对象

> number事实上是浮点数

JavaScript 明确地使用了“双精度”（也就是“64位二进制”）格式。

这部分常考的一个点是精度问题。

```js
0.1 + 0.2 === 0.3; // false
```

 “错误舍入”值作为比较的 容差，这个很小的值经常被称为“机械极小值（machine epsilon）”， 对于 JavaScript 来说这种 number 通常为 Number.EPSILON。

```js
function numbersCloseEnoughToEqual(n1,n2) {
    return Math.abs( n1 - n2 ) < Number.EPSILON;
}

var a = 0.1 + 0.2;
var b = 0.3;

numbersCloseEnoughToEqual( a, b );                    // true
numbersCloseEnoughToEqual( 0.0000001, 0.0000002 );    // false
```

## 执行上下文

> 全局上下文 ：window对象
>
> 函数执行上下文：每当函数被调用一次，就创建一个函数执行上下文

### 生命周期

创建 -> 执行 -> 回收

创建阶段做了三件事：

- 确定 this 的值，也被称为 `This Binding`

  在全局执行上下文中，`this` 的值指向全局对象，在浏览器中，`this` 的值指向 window 对象。

  在函数执行上下文中，`this` 的值取决于函数的调用方式。如果它被一个对象引用调用，那么 `this` 的值被设置为该对象，否则 `this` 的值被设置为全局对象或 `undefined`（严格模式下）。

- LexicalEnvironment（词法环境） 组件被创建

- VariableEnvironment（变量环境） 组件被创建

执行阶段

如果 `Javascript` 引擎在源代码中声明的实际位置找不到变量的值，那么将为其分配 `undefined` 值

回收阶段

执行上下文出栈等待虚拟机回收执行上下文

## 作用域

即变量（变量作用域又称上下文）和函数生效（能被访问）的区域或集合

包括

-  全局作用域 
-  函数作用域 
-  块级作用域 

#### 词法作用域

又叫静态作用域，变量被创建时就确定好了，而非执行阶段确定的。也就是说我们写好代码时它的作用域就确定了，`JavaScript` 遵循的就是词法作用域

> 作用域背后地原理是`词法环境`

2. 在词法环境中，有两个组成部分：（1）**环境记录（environment record）** （2）**对外部环境的引用**

   1. **环境记录**是存储变量和函数声明的实际位置。
   2. **对外部环境的引用**意味着它可以访问其外部词法环境。
   
   **词法环境**有两种类型：
   
   - **全局环境**（在全局执行上下文中）是一个没有外部环境的词法环境。全局环境的外部环境引用为 **null**。它拥有一个全局对象（window 对象）及其关联的方法和属性（例如数组方法）以及任何用户自定义的全局变量，`this` 的值指向这个全局对象。
   - **函数环境**，用户在函数中定义的变量被存储在**环境记录**中。对外部环境的引用可以是全局环境，也可以是包含内部函数的外部函数环境。
   
   **注意：** 对于**函数环境**而言，**环境记录** 还包含了一个 `arguments` 对象，该对象包含了索引和传递给函数的参数之间的映射以及传递给函数的参数的**长度（数量）**。
   
   **环境记录** 同样有两种类型（如下所示）：
   
   - **声明性环境记录** 存储变量、函数和参数。一个函数环境包含声明性环境记录。
   - **对象环境记录** 用于定义在全局执行上下文中出现的变量和函数的关联。全局环境包含对象环境记录。

### 闭包

闭包就是当一个函数即使是在它的词法作用域之外被调用时，也可以记住并访问它的词法作用域。

在 `JavaScript`中，每当创建一个函数，闭包就会在函数创建的同时被创建出来，作为函数内部与外部连接起来的一座桥梁

使用场景

> - 创建私有变量
>
> - 延长变量的生命周期
>
>   柯里化的目的在于避免频繁调用具有相同参数函数的同时，又能够轻松的重用

一般函数的词法环境在函数返回后就被销毁，但是闭包会保存对创建时所在词法环境的引用，即便创建时所在的执行上下文被销毁，但创建时所在词法环境依然存在，以达到延长变量的生命周期的目的



## 原型

## proto

**proto** 是一个内部属性，不建议对其进行直接操作。 而是建议通过prototype来进行操作。

> 每个函数都有一个特殊的属性叫作原型prototype
>
> 一个对象的__proto__总是指向它的构造函数的prototype

当我们访问一个对象的属性的时候，引擎首先会在当前对象进行查找，如果找不到就会访问该对象的`__proto__`， 如果`__proto__`有了，就返回，如果没有则递归执行上述过程，直到`__proto__` 为 `null`。



![img](https://gitee.com/iLx1/resource-img/raw/master/images.jpg)



# this

> this的设计目的就是指向函数运行时所在的环境

## 判定this指向

### 一、默认绑定

1、严格模式下

不能将全局对象`window`作为默认绑定，此时`this`会绑定到`undefined`，但是在严格模式下调用函数则不会影响默认绑定。

2、非严格模式下

this指向全局对象

### 二、隐式绑定

当函数作为对象的属性存在，通过**对象属性执行函数**时，此时隐式绑定规则会将`this`绑定到对象上；

> 赋值操作后执行函数，会应用默认绑定

> 函数传参也是一种隐式赋值，此时在回调函数中会丢失this绑定。(函数定义位置不在对象内)

#### 隐式绑定的隐式丢失问题

隐式绑定的基本概念大家应该都清楚了，不过其实有一个关于隐式绑定的常用考点，那就是**隐式丢失问题**。

> 隐式丢失其实就是被隐式绑定的函数在特定的情况下会丢失绑定对象。

有两种情况容易发生隐式丢失问题：

- 使用另一个变量来给函数取别名
- 将函数作为参数传递时会被隐式赋值，回调函数丢失this绑定

```js
function foo () {
  console.log(this.a)
};
var obj = { a: 1, foo };
var a = 2;
var foo2 = obj.foo;
var obj2 = { a: 3, foo2: obj.foo }

function doFoo (fn) {
  console.log(this)
  fn()
}
obj.foo(); // 1
foo2(); // 2
obj2.foo2(); // 3
dofoo(obj.foo) // 2
```



`foo2`函数内部的函数`foo1`我们使用`call`来显式绑定`obj`，就算后面再用`call`来绑定`window`也没有用了。

```js
function foo1 () {
  console.log(this.a)
}
var a = 1
var obj = {
  a: 2
}

var foo2 = function () {
  foo1.call(obj)
}

foo2() // 2
foo2.call(window) // 2
```



### 三、显式绑定

> 通过call apply bind绑定

`call`做了哪些事儿。

- 将函数设为对象的属性
- 指定函数的this，并进行传参
- 执行&删除函数
- 判定如果没有指定要绑定的this，非严格模式下默认指向全局对象

```js
foo.call(obj); // Heternally  调用call方法后强行将foo函数的this指向来obj对象上

foo.call(obj).call(obj1); // Heternally  多次调用call方法，以第一次为准

foo.call();// zl 没有传入指定对象，所以this默认指向全局对象
```

#### 四、通过new绑定

`new`后，执行了什么操作：

- 它创建（构造）了一个全新的对象
- 它会被执行[[Prototype]]（也就是__proto__）链接
- 它使this指向新创建的对象
- 通过new创建的每个对象将最终被[[Prototype]]链接到这个函数的prototype对象上
- 如果函数没有返回对象类型Object(包含Functoin, Array, Date, RegExg, Error)，那么new表达式中的函数调用将返回该对象引用

在使用`new`调用构造函数后，会构造一个新对象并将函数调用中的`this`绑定到新对象上。

```js
var person1 = new Person("person1");
// 可以看为
var person1 = {
	name: 'person1',
	foo: function () {
		console.log(this.name)
		return function () {
			console.log(this.name)
		}
	}
}
```



### 箭头函数的this指向

> 根据它外层（函数/全局）作用域来决定

箭头函数不能沿用以上的绑定this指向的方法

**它里面的`this`是由外层作用域来决定的，且指向函数定义时的this而非执行时**。

`它里面的this是由外层作用域来决定的`啥意思呢？来看看这句话：

> 箭头函数中没有 this 绑定，必须通过查找作用域链来决定其值，如果箭头函数被非箭头函数包含，则 this 绑定的是最近一层非箭头函数的 this，否则，this 为 undefined。

```js
var name = 'window'
function Person (name) {
  this.name = name
  this.foo1 = function () {
    console.log(this.name)
    return function () {
      console.log(this.name)
    }
  }
  this.foo2 = function () {
    console.log(this.name)
    return () => {
      console.log(this.name)
    }
  }
  this.foo3 = () => {
    console.log(this.name)
    return function () {
      console.log(this.name)
    }
  }
  this.foo4 = () => {
    console.log(this.name)
    return () => {
      console.log(this.name)
    }
  }
}
var person1 = new Person('person1')
person1.foo1()() // 'person1' 'window'
person1.foo2()() // 'person1' 'person1'
person1.foo3()() // 'person1' 'window'
person1.foo4()() // 'person1' 'person1'
```

**箭头函数结合`.call`的题目**

```js
var name = 'window'
var obj1 = {
  name: 'obj1',
  foo1: function () {
    console.log(this.name)
    return () => {
      console.log(this.name)
    }
  },
  foo2: () => {
    console.log(this.name)
    return function () {
      console.log(this.name)
    }
  }
}
var obj2 = {
  name: 'obj2'
}
obj1.foo1.call(obj2)() // 'obj2' 'obj2'
obj1.foo1().call(obj2) // 'obj1' 'obj1'
obj1.foo2.call(obj2)() // 'window' 'window'
obj1.foo2().call(obj2) // 'window' 'obj2'
```

**避免使用的场景**

1. 使用箭头函数定义对象的方法

```javascript
let obj = {
    value: 'LinDaiDai',
    getValue: () => console.log(this.value)
}
obj.getValue() // undefined
```

1. 定义原型方法

```javascript
function Foo (value) {
    this.value = value
}
Foo.prototype.getValue = () => console.log(this.value)

const foo1 = new Foo(1)
foo1.getValue() // undefined
```

1. 构造函数使用箭头函数

```js
const Foo = (value) => {
    this.value = value;
}
const foo1 = new Foo(1)
// 事实上直接就报错了 Uncaught TypeError: Foo is not a constructor
console.log(foo1);
```

1. 作为事件的回调函数

```js
const button = document.getElementById('myButton');
button.addEventListener('click', () => {
    console.log(this === window); // => true
    this.innerHTML = 'Clicked button';
});
```



# 原型和继承

## 继承

继承是一种代码复用的方式。在面向对象编程中，继承是一个很重要的点。

### 原型链继承

在JS中继承背后的原理是原型`prototype`, 这种实现继承的方式，我们称之为原型继承。

```js
function Parent() {
    this.name = 'parent';
  }
  function Child() {
    this.type = 'child';
  }
  Child.prototype = new Parent();
  console.log(new Child())
```

问题： 多个实例对象共用一个原型对象，会相互影响

### 构造函数继承

```js
function Parent() {
    this.name = 'parent';
}
Parent.prototype.method = function(){}

function Child() {
   	Parent.call(this)
}
new Child();
```

问题： 父类原型对象自己定义的方法无法继承

### 组合继承

```js
function Child() {
    //第二次调用Parent
    Parent.call(this)
} 
//第一次调用Parent
Child.prototype = new Parent();
//手动挂载构造器，指向自己的构造函数
Child.prototype.consturctor = Child;
```

问题： 增加了构造的性能开销

### 原型式继承

借助Object.create实现普通对象继承

```js
  let Child = Object.create(Parent);
  Child.name = "xxx";
```

问题： 实现的是浅拷贝，引用数据类型指向相同的内存

### 寄生式继承

```js
function clone(original) {
    let clone = Object.create(original);
    clone.getFriends = function() {
        return this.friends;
    };
    return clone;
}

let Child = clone(parent);
```

### 寄生组合式继承

```JS
function clone (parent, child) {
    // 这里改用 Object.create 就可以减少组合继承中多进行一次构造的过程
    child.prototype = Object.create(parent.prototype);
    child.prototype.constructor = child;
}

function Parent6() {
    this.name = 'parent6';
    this.play = [1, 2, 3];
}
Parent6.prototype.getName = function () {
    return this.name;
}
function Child6() {
    Parent6.call(this);
    this.friends = 'child5';
}

clone(Parent6, Child6);

Child6.prototype.getFriends = function () {
    return this.friends;
}
```

这种继承方式是目前最优的继承方式，ES6中的extents 关键字也是采用这种方式

### 全局对象

JS中一些全局内置函数，分别为Functon, Array, Object.

```js
console.log(Object); // -> ƒ Object() { [native code] }
console.log(Array); // -> ƒ Array() { [native code] }
console.log(Function); // -> ƒ Function() { [native code] }Copy to clipboardErrorCopied
```

- 所有的数组对象，都是由全局内置函数Array创建的
- 所有的object对象，都是由全局内置函数Object创建的
- 所有的函数对象，都是由全局内置函数Function创建的



# 对象

## 对象的属性

### 属性分类

1.数据属性4个特性: configurable(可配置),enumerable(可枚举),writable(可修改),value(属性值)

2.访问器属性2个特性: get(获取),set(设置)

3.内部属性 由JavaScript引擎内部使用的属性; 不能直接访问,但是可以通过对象内置方法间接访问,如:[[Prototype]]可以通过                Object.getPrototypeOf()访问; 内部属性用[[]]包围表示,是一个抽象操作,没有对应字符串类型的属性名,如[[Prototype]].

### 属性描述符

1.定义:将一个属性的所有特性编码成一个对象返回 

2.描述符的属性有:数据属性和访问器属性 

3.使用范围: 作为方法Object.defineProperty, Object.getOwnPropertyDescriptor, Object.create的第二个参数,

### 属性描述符的默认值

1.访问对象存在的属性

| 特性名                                                   | 默认值     |
| -------------------------------------------------------- | ---------- |
| value                                                    | 对应属性值 |
| get                                                      | 对应属性值 |
| set                                                      | undefined  |
| writable                                                 | true       |
| enumerable                                               | true       |
| configurable                                             | true       |
| 所以通过上面三种声明方法已存在的属性都是有这些默认描述符 |            |

2.访问对象不存在的属性 

| 特性名                                                   | 默认值     |
| -                                                        | -          |
| value                                                    | undefined  |
| get                                                      | undefined  |
| set                                                      | undefined  |
| writable                                                 | false      |
| enumerable                                               | false      |
| configurable                                             | false      |

###  描述符属性的使用规则

get,set与wriable,value是互斥的,如果有交集设置会报错

### 属性定义

1.定义属性的函数有两个:Object.defineProperty和Object.defineProperties.

例如: 

```js
Object.defineProperty(obj, propName, desc)

Object.defineProperty(obj, "name", {value: "aaa"})
```

2.在引擎内部,会转换成这样的方法调用: 

```js
obj.[[DefineOwnProperty]](propName, desc, true)
```

### 属性赋值

1.赋值运算符(=)就是在调用[[Put]].比如: obj.prop = v;

2.在引擎内部,会转换成这样的方法调用: 

```js
obj.[[Put]]("prop", v, isStrictModeOn)
```



### 判断对象的属性

| 名称             | 含义                                                        | 用法                                                 |
| ---------------- | ----------------------------------------------------------- | ---------------------------------------------------- |
| in               | 如果指定的属性在指定的对象或其原型链中，则in 运算符返回true | 'name' in test        //true                         |
| hasOwnProperty() | 只判断自身属性                                              | test.hasOwnProperty('name')        //true            |
| .或[]            | 对象或原型链上不存在该属性，则会返回undefined               | test.name            //"lei"   test["name"]  //"lei" |

## 遍历

### 一级对象遍历方法

| 方法                              | 特性                                                         |
| --------------------------------- | ------------------------------------------------------------ |
| for ... in                        | 遍历对象自身的和继承的可枚举属性(不含Symbol属性)             |
| Object.keys(obj)                  | 返回一个数组,包括对象自身的(不含继承的)所有可枚举属性(不含Symbol属性) |
| Object.getOwnPropertyNames(obj)   | 返回一个数组,包括对象自身的所有可枚举和不可枚举属性(不含Symbol属性) |
| Object.getOwnPropertySymbols(obj) | 返回一个数组,包含对象自身的所有Symbol属性                    |
| Reflect.ownKeys(obj)              | 返回一个数组,包含对象自身的所有(不枚举、可枚举和Symbol)属性  |
| Reflect.enumerate(obj)            | 返回一个Iterator对象,遍历对象自身的和继承的所有可枚举属性(不含Symbol属性) |

总结:

1.只有Object.getOwnPropertySymbols(obj)和Reflect.ownKeys(obj)可以拿到Symbol属性

2.只有Reflect.ownKeys(obj)可以拿到不可枚举属性





## 数据拦截

定义:利用对象内置方法,设置属性,进而改变对象的属性值

### Object.defineProterty

1.ES5出来的方法; 

2.三个参数:对象(必填),属性值(必填),描述符(可选); 

3.defineProterty的描述符属性

```makefile
数据属性:value,writable,configurable,enumerable
访问器属性:get,set
注:不能同时设置value和writable,这两对属性是互斥的
```

4.拦截对象的两种情况:

```js
let obj = {name:'',age:'',sex:''  },
    defaultName = ["这是姓名默认值1","这是年龄默认值1","这是性别默认值1"];
  Object.keys(obj).forEach(key => {
    Object.defineProperty(obj, key, {
      get() {
        return defaultName;
      },
      set(value) {
        defaultName = value;
      }
    });
  });

  let objOne={},defaultNameOne="这是默认值2";
  Object.defineProperty(obj, 'name', {
      get() {
        return defaultNameOne;
      },
      set(value) {
        defaultNameOne = value;
      }
  });
  console.log(objOne.name);
  objOne.name = "这是改变值2";
  console.log(objOne.name);
```

5.拦截数组变化的情况

```js
let a={};
bValue=1;
Object.defineProperty(a,"b",{
    set:function(value){
        bValue=value;
        console.log("setted");
    },
    get:function(){
        return bValue;
    }
});
a.b;//1
a.b=[];//setted
a.b=[1,2,3];//setted
a.b[1]=10;//无输出
a.b.push(4);//无输出
a.b.length=5;//无输出
a.b;//[1,10,3,4,undefined];
```

结论:defineProperty无法检测数组索引赋值,改变数组长度的变化; 但是通过数组方法来操作可以检测到

### 多级嵌套对象监听

```js
 let info = {};
  function observe(obj) {
    // 判断是否为引用类型
    if (!obj || typeof obj !== "object") return;
    for (var i in obj) {
      definePro(obj, i, obj[i]);
    }
  }

  function definePro(obj, key, value) {
    observe(value);
    Object.defineProperty(obj, key, {
      get: function() {
        return value;
      },
      set: function(newval) {
        console.log("检测变化", newval);
        value = newval;
      }
    });
  }
  definePro(info, "friends", { name: "张三" });
  info.friends.name = "李四";
```

### 存在的问题

> 1. 复制代码不能监听数组索引赋值和改变长度的变化
> 2. 必须深层遍历嵌套的对象,因为defineProterty只能劫持对象的属性,因此我们需要对每个对象的每个属性进行遍历，如果属性值也是对象那么需要深度遍历,显然能劫持一个完整的对象是更好的选择



## proxy

1.ES6出来的方法,实质是对对象做了一个拦截,并提供了13个处理方法

2.两个参数:对象和行为函数

```js
  let handler = {
    get(target, key, receiver) {
      console.log("get", key);
      return Reflect.get(target, key, receiver);
    },
    set(target, key, value, receiver) {
      console.log("set", key, value);
      return Reflect.set(target, key, value, receiver);
    }
  };
  let proxy = new Proxy(obj, handler);
  proxy.name = "李四";
  proxy.age = 24;
```

#### 多级对象或多级数组

```js
//这是proxy的handler
let handler = {
    get(target, property) {
        console.log('get:' + property)
        return Reflect.get(target, property);
    },
    set(target, property, value) {
        console.log('set:' + property + '=' + value);
        return Reflect.set(target, property, value);
    }
}
//传递两个参数，一个是object, 一个是proxy的handler
//如果是不是嵌套的object，直接加上proxy返回，如果是嵌套的object，那么进入addSubProxy进行递归。 
function toDeepProxy(object, handler) {
    if (!isPureObject(object)) addSubProxy(object, handler); 
    return new Proxy(object, handler);

//这是一个递归函数，目的是遍历object的所有属性，如果不是pure object,那么就继续遍历object的属性的属性，如果是pure object那么就加上proxy
    function addSubProxy(object, handler) {
        for (let prop in object) {
            if ( typeof object[prop] == 'object') {
                if (!isPureObject(object[prop])) addSubProxy(object[prop], handler);
                object[prop] = new Proxy(object[prop], handler);
            }
        }
        object = new Proxy(object, handler)
    }

//是不是一个pure object,意思就是object里面没有再嵌套object了
    function isPureObject(object) {
        if (typeof object!== 'object') {
            return false;
        } else {
            for (let prop in object) {
                if (typeof object[prop] == 'object') {
                    return false;
                }
            }
        }
        return true;
    }
}
//变成监听对象
obj = toDeepProxy(obj, handler);
objArr = toDeepProxy(objArr, handler);
```

3.问题和优点 

reflect对象没有构造函数 可以监听数组索引赋值,改变数组长度的变化, 是直接监听对象的变化,不用深层遍历

### defineProterty和proxy的对比

1.defineProterty是es5的标准,proxy是es6的标准;

2.proxy可以监听到数组索引赋值,改变数组长度的变化;

3.proxy是监听对象,不用深层遍历,defineProterty是监听属性;

3.利用defineProterty实现双向数据绑定(vue2.x采用的核心) 4.利用proxy实现双向数据绑定(vue3.x会采用)



### …args剩余参数和 arguments对象的区别

剩余参数和 arguments对象之间的区别主要有三个：

>  1.剩余参数只包含那些没有对应形参的实参，而 arguments 对象包含了传给函数的所有实参。
>  2.arguments对象不是一个真正的数组，而剩余参数是真正的 Array实例，也就是说你能够在它上面直接使用所有的数组方法，比如 sort，map，forEach或pop。
>  3.arguments对象还有一些附加的属性 （如callee属性）。



### 当前日期天数

```js
const dayOfYear = date =>
Math.floor((date - new Date(date.getFullYear(), 0, 0)) / 1000 / 60 / 60 / 24);

dayOfYear(new Date()); // 285
```

### 返回当前24小时制时间的字符串

```js
const getColonTimeFromDate = date => date.toTimeString().slice(0, 8);

getColonTimeFromDate(new Date()); // "08:38:00"
```



### 返回日期间的天数

```javascript
const getDaysDiffBetweenDates = (dateInitial, dateFinal) =>
  (dateFinal - dateInitial) / (1000 * 3600 * 24);
  
getDaysDiffBetweenDates(new Date('2019-01-01'), new Date('2019-10-14')); // 286
```



### 检查值是否为特定类型。

```typescript
const is = (type, val) => ![, null].includes(val) && val.constructor === type;

is(Map, new Map()); // true
is(RegExp, /./g); // true
is(Set, new Set()); // true
is(WeakMap, new WeakMap()); // true
is(WeakSet, new WeakSet()); // true
is(String, ''); // true
is(String, new String('')); // true
```

### 全等判断

在两个变量之间进行深度比较以确定它们是否全等。

**此代码段精简的核心在于`Array.prototype.every()`的使用。**

```js
const equals = (a, b) => {
  if (a === b) return true;
  if (a instanceof Date && b instanceof Date) return a.getTime() === b.getTime();
  if (!a || !b || (typeof a !== 'object' && typeof b !== 'object')) return a === b;
  if (a.prototype !== b.prototype) return false;
  let keys = Object.keys(a);
  if (keys.length !== Object.keys(b).length) return false;
  return keys.every(k => equals(a[k], b[k]));
};
```

### 转义`HTML`

用来防`XSS`攻击啦。

```js
const escapeHTML = str =>
  str.replace(
    /[&<>'"]/g,
    tag =>
      ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        "'": '&#39;',
        '"': '&quot;'
      }[tag] || tag)
  );

escapeHTML('<a href="#">Me & you</a>'); // '&lt;a href=&quot;#&quot;&gt;Me &amp; you&lt;/a&gt;'
```

 



# Number

### 数字千分位

方法一：

```js
function thousandNum(num = 0) {
  const str = (+num).toString().split(".");
  const int = nums => nums.split("").reverse().reduceRight((t, v, i) => t + (i % 3 ? v : `${v},`), "").replace(/^,|,$/g, "");
  const dec = nums => nums.split("").reduce((t, v, i) => t + ((i + 1) % 3 ? v : `${v},`), "").replace(/^,|,$/g, "");
  return str.length > 1 ? `${int(str[0])}.${dec(str[1])}` : int(str[0]);
}

thousandNum(1234); // "1,234"
thousandNum(1234.00); // "1,234"
thousandNum(0.1234); // "0.123,4"
console.log(thousandNum(1234.5678)); // "1,234.567,8"
```

方法二

```js
console.log('1234567890'.replace(/\B(?=(\d{3})+(?!\d))/g, ","))
console.log((1234567890).toLocaleString())
```

### 判断小数是否相等

肯定有人会说这还不简单，直接用'==='比较；
 实际上0.1+0.2 !==0.3，因为计算机不能精确表示0.1， 0.2这样的浮点数，所以相加就不是0.3了

```js
Number.EPSILON=(function(){   //解决兼容性问题
    return Number.EPSILON?Number.EPSILON:Math.pow(2,-52);
})();
//上面是一个自调用函数，当JS文件刚加载到内存中，就会去判断并返回一个结果
function numbersequal(a,b){ 
    return Math.abs(a-b)<Number.EPSILON;
  }
//接下来再判断   
const a=0.1+0.2, b=0.3;
console.log(numbersequal(a,b)); //这里就为true了
```

### 双位运算符

双位运算符比Math.floor(),Math.ceil()速度快

```js
~~7.5                // 7
Math.ceil(7.5)       // 8
Math.floor(7.5)      // 7


~~-7.5        		// -7
Math.floor(-7.5)     // -8
Math.ceil(-7.5)      // -7
```

所以负数时，双位运算符和Math.ceil结果一致，正数时和Math.floor结果一致

### 判断奇偶

```js
const num=5;
!!(num & 1) // true
!!(num % 2) // true
```

### 判断数据类型

```js
function dataTypeJudge(val, type) {
  const dataType = Object.prototype.toString.call(val).replace(/\[object (\w+)\]/, "$1").toLowerCase();
  return type ? dataType === type : dataType;
}
```

### 使用Boolean过滤数组假值

```js
const compact = arr => arr.filter(Boolean)
compact([0, 1, false, 2, '', 3, 'a', 'e' * 23, NaN, 's', 34])  //[ 1, 2, 3, 'a', 's', 34 ]
```

### 在指定数组中获取指定长度的随机数

```js
// 使用Fisher-Yates算法对数组中的元素进行随机选择。
const sampleSize = ([...arr], n = 1) => {
  let m = arr.length;
  while (m) {
    const i = Math.floor(Math.random() * m--);
    [arr[m], arr[i]] = [arr[i], arr[m]];
  }
  return arr.slice(0, n);
};

sampleSize([1, 2, 3], 2); // [3,1]
sampleSize([1, 2, 3], 4); // [2,3,1]
```

### 根据`parent_id`生成树结构（阿里一面真题）

根据每项的`parent_id`，生成具体树形结构的对象。

```js
const nest = (items, id = null, link = 'parent_id') =>
  items
    .filter(item => item[link] === id)
    .map(item => ({ ...item, children: nest(items, item.id) }));
```

用法：

```js
const comments = [
  { id: 1, parent_id: null },
  { id: 2, parent_id: 1 },
  { id: 3, parent_id: 1 },
  { id: 4, parent_id: 2 },
  { id: 5, parent_id: 4 }
];
const nestedComments = nest(comments); // [{ id: 1, parent_id: null, children: [...] }]
```



# 函数

### 捕获函数运行异常

该代码段执行一个函数，返回结果或捕获的错误对象。

```javascript
onst attempt = (fn, ...args) => {
  try {
    return fn(...args);
  } catch (e) {
    return e instanceof Error ? e : new Error(e);
  }
};
var elements = attempt(function(selector) {
  return document.querySelectorAll(selector);
}, '>_>');
if (elements instanceof Error) elements = []; // elements = []
```



### 简单的发布/订阅模式

创建一个发布/订阅（发布-订阅）事件集线，有`emit`，`on`和`off`方法。

1. 使用`Object.create(null)`创建一个空的`hub`对象。
2. `emit`，根据`event`参数解析处理程序数组，然后`.forEach()`通过传入数据作为参数来运行每个处理程序。
3. `on`，为事件创建一个数组（若不存在则为空数组），然后`.push()`将处理程序添加到该数组。
4. `off`，用`.findIndex()`在事件数组中查找处理程序的索引，并使用`.splice()`删除。

```js
const createEventHub = () => ({
  hub: Object.create(null),
  emit(event, data) {
    (this.hub[event] || []).forEach(handler => handler(data));
  },
  on(event, handler) {
    if (!this.hub[event]) this.hub[event] = [];
    this.hub[event].push(handler);
  },
  off(event, handler) {
    const i = (this.hub[event] || []).findIndex(h => h === handler);
    if (i > -1) this.hub[event].splice(i, 1);
    if (this.hub[event].length === 0) delete this.hub[event];
  }
});
```

用法：

```js
const handler = data => console.log(data);
const hub = createEventHub();
let increment = 0;

// 订阅，监听不同事件
hub.on('message', handler);
hub.on('message', () => console.log('Message event fired'));
hub.on('increment', () => increment++);

// 发布：发出事件以调用所有订阅给它们的处理程序，并将数据作为参数传递给它们
hub.emit('message', 'hello world'); // 打印 'hello world' 和 'Message event fired'
hub.emit('message', { hello: 'world' }); // 打印 对象 和 'Message event fired'
hub.emit('increment'); // increment = 1

// 停止订阅
hub.off('message', handler);
```

### 只调用一次的函数

```js
const once = fn => {
  let called = false
  return function () {
    if (!called) {
      called = true
      fn.apply(this, arguments)
    }
  }
};
```

### 以键的路径扁平化对象

使用递归。

1. 利用`Object.keys(obj)`联合`Array.prototype.reduce()`，以每片叶子节点转换为扁平的路径节点。
2. 如果键的值是一个对象，则函数使用调用适当的自身`prefix`以创建路径`Object.assign()`。
3. 否则，它将适当的前缀键值对添加到累加器对象。
4. `prefix`除非您希望每个键都有一个前缀，否则应始终省略第二个参数。

```js
const flattenObject = (obj, prefix = '') =>
  Object.keys(obj).reduce((acc, k) => {
    const pre = prefix.length ? prefix + '.' : '';
    if (typeof obj[k] === 'object') Object.assign(acc, flattenObject(obj[k], pre + k));
    else acc[pre + k] = obj[k];
    return acc;
  }, {});
  
flattenObject({ a: { b: { c: 1 } }, d: 1 }); // { 'a.b.c': 1, d: 1 }
```

### 以键的路径展开对象

与上面的相反，展开对象。

```javascript
const unflattenObject = obj =>
  Object.keys(obj).reduce((acc, k) => {
    if (k.indexOf('.') !== -1) {
      const keys = k.split('.');
      Object.assign(
        acc,
        JSON.parse(
          '{' +
            keys.map((v, i) => (i !== keys.length - 1 ? `"${v}":{` : `"${v}":`)).join('') +
            obj[k] +
            '}'.repeat(keys.length)
        )
      );
    } else acc[k] = obj[k];
    return acc;
  }, {});
  
unflattenObject({ 'a.b.c': 1, d: 1 }); // { a: { b: { c: 1 } }, d: 1 }
```



# 字符串

### 返回字符串的字节长度

```scss
const byteSize = str => new Blob([str]).size;

byteSize('😀'); // 4
byteSize('Hello World'); // 11
```



### 每个单词首字母大写

```js
const capitalizeEveryWord = str => str.replace(/\b[a-z]/g, char => char.toUpperCase());

capitalizeEveryWord('hello world!'); // 'Hello World!'
```



### 将多行字符串拆分为行数组。

使用`String.prototype.split()`和正则表达式匹配换行符并创建一个数组。

```js
const splitLines = str => str.split(/\r?\n/);

splitLines('This\nis a\nmultiline\nstring.\n'); // ['This', 'is a', 'multiline', 'string.' , '']
```

### 删除字符串中的`HTMl`标签

从字符串中删除`HTML / XML`标签。

使用正则表达式从字符串中删除`HTML / XML` 标记。

```js
const stripHTMLTags = str => str.replace(/<[^>]*>/g, '');

stripHTMLTags('<p><em>lorem</em> <strong>ipsum</strong></p>'); // 'lorem ipsum'
```





# 数组的操作方法

#### 增

> - push() 尾部添加，改变原数组，返回新长度
> - unshift() 头部添加
> - splice( 开始位置，删除个数（0），插入元素) 改变原数组
> - concat(xx,[xx]) 返回新数组

#### 删

> - pop() 删除尾部，返回被删除元素
> - shift() 删除头部，返回删除元素
> - splice(开始位置，元素数量)
> - slice(删除位置（非索引）)

#### 查

> - indexOf() 查找元素位置，没有返回-1
> - includes() 查找元素位置，有则true，没有false
> - find() 返回第一个匹配元素

> reverse() 反转数组
>
> sort() 冒泡排序

#### 转换数组

> join("|") 以字符串分割数组，返回字符串

#### 数组迭代

传入执行函数

> - some(value, key) 至少一个返回true， 则返回true
> - every() 所有元素返回true， 则返回true
> - forEach() 遍历数组
> - filter() 返回元素为true的新数组
> - map() 每一项运行传入函数

### 字符串方法

#### 增

> concat() 拼接
>
> +/ ${}

#### 截取

> - slice(开始位置， 结束位置) 
> - substr(开始位置， 结束位置)
> - substring( 开始位置， 截取长度)

#### 改

> -  trim()、trimLeft()、trimRight() 
> -  repeat(次数) 
> -  padStart(长度，填充字符)、padEnd() 
> -  toLowerCase()、 toUpperCase() 

#### 查

> -  chatAt(索引位置) 返回对应字符串  
> -  indexOf(字符) 返回字符位置 
> -  startWith(字符串) 包含与否返回布尔值 
> -  includes(字符串) 包含与否返回布尔值

#### 转换

> split("|") 根据字符转换为数组

#### 模板匹配

> - match() 匹配模板，返回数组
> - search() 匹配模板，匹配失败返回-1
> - replace(匹配内容， 替换元素) 

## 类型转换

### 隐式转换

转换为布尔

> - undefined
> - null
> - false
> - +0
> - -0
> - NaN
> - ""
>
> 除了上面几种会被转化成`false`，其他都换被转化成`true`

#### 其他类型

> 除了`+`有可能把运算子转为字符串，其他运算符都会把运算子自动转成数值



#### ==和===

相等操作符（==）会做类型转换，再进行值的比较，全等运算符不会做类型转换

#### 深浅拷贝

> 深拷贝

开辟一个新的栈，两个对象属完成相同，但是对应两个不同的地址，修改一个对象的属性，不会改变另一个对象的属性

-  _.cloneDeep() 
-  jQuery.extend() 
-  JSON.stringify() 
-  手写循环递归 

```js
循环递归
function deepClone(obj, hash = new WeakMap()) {
  if (obj === null) return obj; // 如果是null或者undefined我就不进行拷贝操作
  if (obj instanceof Date) return new Date(obj);
  if (obj instanceof RegExp) return new RegExp(obj);
  // 可能是对象或者普通的值  如果是函数的话是不需要深拷贝
  if (typeof obj !== "object") return obj;
  // 是对象的话就要进行深拷贝
  if (hash.get(obj)) return hash.get(obj);
  let cloneObj = new obj.constructor();
  // 找到的是所属类原型上的constructor,而原型上的 constructor指向的是当前类本身
  hash.set(obj, cloneObj);
  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      // 实现一个递归拷贝
      cloneObj[key] = deepClone(obj[key], hash);
    }
  }
  return cloneObj;
}
```



> 浅拷贝

指的是创建新的数据，这个数据有着原始数据属性值的一份精确拷贝

如果属性是基本类型，拷贝的就是基本类型的值。如果属性是引用类型，拷贝的就是内存地址

```js
function shallowClone(obj) {
    const newObj = {};
    for(let prop in obj) {
        if(obj.hasOwnProperty(prop)){
            newObj[prop] = obj[prop];
        }
    }
    return newObj;
}
```

- `Object.assign`
- `Array.prototype.slice()`, `Array.prototype.concat()`

## 事件与事件流

`javascript`中的事件，可以理解就是在`HTML`文档或者浏览器中发生的一种交互操作，使得网页具备互动性， 常见的有加载事件、鼠标事件、自定义事件等

由于`DOM`是一个树结构，如果在父子节点绑定事件时候，当触发子节点的时候，就存在一个顺序问题，这就涉及到了事件流的概念

事件流都会经历三个阶段：

> - 事件捕获阶段(capture phase)
> - 处于目标阶段(target phase)
> - 事件冒泡阶段(bubbling phase)


事件冒泡是一种从下往上的传播方式，由最具体的元素（触发节点）然后逐渐向上传播到DOM中最高层的父节点

事件捕获与事件冒泡相反，事件最开始由不太具体的节点最早接受事件, 而最具体的节点（触发节点）最后接受事件

### 原始事件模型

> - 行内绑定
>
> - js代码绑定

#### 特性

- 绑定速度快

`DOM0`级事件具有很好的跨浏览器优势，会以最快的速度绑定，但由于绑定速度太快，可能页面还未完全加载出来，以至于事件可能无法正常运行

-  只支持冒泡，不支持捕获 
-  同一个类型的事件只能绑定一次 

删除 `DOM0` 级事件处理程序只要将对应事件属性置为`null`即可

### 标准事件模型

在该事件模型中，一次事件共有三个过程:

> - 事件捕获阶段：事件从`document`一直向下传播到目标元素, 依次检查经过的节点是否绑定了事件监听函数，如果有则执行
> - 事件处理阶段：事件到达目标元素, 触发目标元素的监听函数
> - 事件冒泡阶段：事件从目标元素冒泡到`document`, 依次检查经过的节点是否绑定了事件监听函数，如果有则执行

```js
addEventListener(eventType, handler, useCapture)
```

参数如下：

- `eventType`指定事件类型(不要加on)
- `handler`是事件处理函数
- `useCapture`是一个`boolean`用于指定是否在捕获阶段进行处理，一般设置为`false`与IE浏览器保持一致

### AJAX都有哪些优点和缺点？

解析：

ajax的优点是：

1.最大的一点是页面无刷新，用户的体验非常好。

2.使用异步方式与服务器通信，具有更加迅速的响应能力。

3.可以把以前一些服务器负担的工作转嫁到客户端，利用客户端闲置的能力来处理，减轻服务器和带宽的负担，节约空间和宽带租用成本。并且减轻服务器的负担，ajax的原则是“按需取数据”，可以最大程度的减少冗余请求，和响应对服务器造成的负担。

4.基于标准化的并被广泛支持的技术，不需要下载插件或者小程序。

ajax的缺点是：

1.ajax不支持浏览器back按钮。

2.安全问题 AJAX暴露了与服务器交互的细节。

3.对搜索引擎的支持比较弱。

4.破坏了程序的异常机制。

5.不容易调试。

### 如何进行网站性能优化

解析：

\1. 从用户角度而言，优化能够让页面加载得更快、对用户的操作响应得更及时，能够给用户提供更为友好的体验。

\2. 从服务商角度而言，优化能够减少页面请求数、或者减小请求所占带宽，能够节省可观的资源。

总之，恰当的优化不仅能够改善站点的用户体验并且能够节省相当的资源利用。

前端优化的途径有很多，按粒度大致可以分为两类，第一类是页面级别的优化，例如 HTTP请求数、脚本的无阻塞加载、内联脚本的位置优化等 ;第二类则是代码级别的优化，例如 Javascript中的DOM 操作优化、CSS选择符优化、图片优化以及 HTML结构优化等等。另外，本着提高投入产出比的目的，后文提到的各种优化策略大致按照投入产出比从大到小的顺序排列。

一、页面级优化

\1. JavaScript 压缩和模块打包

\2. 按需加载资源

\3. 在使用 DOM 操作库时用上 array-ids

\4. 缓存

\5. 启用 HTTP/2

\6. 应用性能分析

\7. 使用负载均衡方案

\8. 为了更快的启动时间考虑一下同构

\9. 使用索引加速数据库查询

\10. 使用更快的转译方案

\11. 避免或最小化 JavaScript 和 CSS 的使用而阻塞渲染

\12. 用于未来的一个建议：使用 service workers + 流

\13. 图片编码优化

### **优雅降级和渐进增强**

解析：

渐进增强（Progressive Enhancement）：一开始就针对低版本浏览器进行构建页面，完成基本的功能，然后再针对高级浏览器进行效果、交互、追加功能达到更好的体验。

优雅降级（Graceful Degradation）：一开始就构建站点的完整功能，然后针对浏览器测试和修复。比如一开始使用 CSS3 的特性构建了一个应用，然后逐步针对各大浏览器进行 hack 使其可以在低版本浏览器上正常浏览。

其实渐进增强和优雅降级并非什么新概念，只是旧的概念换了一个新的说法。在传统软件开发中，经常会提到向上兼容和向下兼容的概念。渐进增强相当于向上兼容，而优雅降级相当于向下兼容

### **JS实现对货币数字格式化函数（三位加逗号） **

#### **// 调用示例 formatMoney('1234567890'); // 1,234,567,890**

解析：

```html
<html>
<head>
<script type="text/javascript">
function outputmoney(number) {
number = number.replace(/\,/g, "");
if(isNaN(number) || number == "")return "";
number = Math.round(number * 100) / 100;
    if (number < 0)
        return '-' + outputdollars(Math.floor(Math.abs(number) - 0) + '') + outputcents(Math.abs(number) - 0);
    else
        return outputdollars(Math.floor(number - 0) + '') + outputcents(number - 0);
} 
//格式化金额
function outputdollars(number) {
    if (number.length <= 3)
        return (number == '' ? '0' : number);
    else {
        var mod = number.length % 3;
        var output = (mod == 0 ? '' : (number.substring(0, mod)));
        for (i = 0; i < Math.floor(number.length / 3); i++) {
            if ((mod == 0) && (i == 0))
                output += number.substring(mod + 3 * i, mod + 3 * i + 3);
            else
                output += ',' + number.substring(mod + 3 * i, mod + 3 * i + 3);
        }
        return (output);
    }
}
function outputcents(amount) {
    amount = Math.round(((amount) - Math.floor(amount)) * 100);
    return (amount < 10 ? '.0' + amount : '.' + amount);
}
</script>
</head>
<body>
<input type=text   maxlength="8" id="test" onblur="this.value=outputmoney(this.value);" >
</body>
</html>
```

### 异步笔试题

请写出下面代码的运行结果

```
async function async1() {
    console.log('async1 start');
    await async2();
    console.log('async1 end');
}
async function async2() {
    console.log('async2');
}
console.log('script start');
setTimeout(function() {
    console.log('setTimeout');
}, 0)
async1();
new Promise(function(resolve) {
    console.log('promise1');
    resolve();
}).then(function() {
    console.log('promise2');
});
console.log('script end');
```

### 变式一

```

async function async1() {
    console.log('async1 start');
    await async2();
    console.log('async1 end');
}
async function async2() {
    //async2做出如下更改：
    new Promise(function(resolve) {
    console.log('promise1');
    resolve();
}).then(function() {
    console.log('promise2');
    });
}
console.log('script start');

setTimeout(function() {
    console.log('setTimeout');
}, 0)
async1();

new Promise(function(resolve) {
    console.log('promise3');
    resolve();
}).then(function() {
    console.log('promise4');
});

console.log('script end');
```

可以先自己看看输出顺序会是什么，下面来公布结果：

```
script start
async1 start
promise1
promise3
script end
promise2
async1 end
promise4
setTimeout
```

在第一次macrotask执行完之后，也就是输出`script end`之后，会去清理所有microtask。所以会相继输出`promise2`，`async1 end`，`promise4`，其余不再多说。



#### 执行下列的代码会输出什么？

```js
const a = {}
const b = { key: 'b' }
const c = { key: 'c' }

a[b] = 123
a[c] = 456

console.log(a[b])

答案：456
```

解析：

对象的键会自动转换为字符串，我们试图将对象b设置为对象a的键。
当将一个对象转化为字符串的时候，会变成"[object Object]" 所以，a["[object Object]"] = 123 。然后，我们再一次做了同样的事情，c 是另外一个对象，这里也有隐式字符串化，于是，a["[object Object]"] =456。然后，我们打印 a[b]，也就是 a["[object Object]"]。之前刚设置为 456，因此返回的是 456。

### js原型遵循5个规则：

1、所有的引用类型（数组、对象、函数），都具有对象特性，即可自由扩展属性（除了“null”以外）；

2、所有的引用类型（数组、对象、函数），都有一个__proto__（隐式原型）属性，属性值是一个普通的对象；

3、所有的函数，都有一个prototype（显式原型）属性，属性值也是一个普通对象；

4、所有的引用类型（数组、对象、函数），__proto__属性值指向（完全相等）它的构造函数的 “prototype” 属性值；

5、当试图得到一个对象的某个属性时，如果这个对象本身没有这个属性，那么会去 proto（ 即它的构造函数的 prototype 中）寻找。

### js实现把一个字符串的大小写取反

方法1：利用正则表达式

思路：

大小写取反，最先想到的是替换 replace
怎么实现替换，通过正则，首先找到所有字母 /[a-zA-Z]/g
replace() 方法用于在字符串中用一些字符替换另一些字符，或替换一个与正则表达式匹配的子串。
实现：如果当前的字母转化为大写还和自己一样，那么他铁定就是大写字母，利用三木运算，是大写，那么就变为小写，反之
每一次正则匹配的结果返回
代码：

```js
function reverseChar(str) {
	// 使用正则的全局匹配
    str = str.replace(/[a-zA-Z]/g, content => {
        // content : 每一次正则匹配的结果
        return content.toUpperCase() === content ? content.toLowerCase() : content.toUpperCase()
    })
    return str;
}
```

方法2：利用 charAt()

 // 第二种方法是利用 字符串中的charAt(i) ---来获取字符串中的每一个字符（）-----再比较编码集
  //charAt()--------比较的是Unicode编码集-----charAt(i)找的是字符串中第i个字符

```js
    var str1 = "azcBfHIjs"
    console.log(str1);

    var newStr = '';//保存转换后的字符串

    for (var i = 0; i < str1.length; i++) {
    
        if (str1.charAt(i) >= 'a') {//a unicode是97、比a大的是小写字母
            aa = str1.charAt(i).toUpperCase();
        }
        else if (str1.charAt(i) >= 'A') {//A unicode 是65、比A 大的是大写字母
            aa = str1.charAt(i).toLowerCase();

        }
        newStr = newStr + aa;//字符串的拼接的思想就是 新建一个数组
    }

    console.log(newStr);
```
### 数组扁平化

##### 简单遍历

```js
let arr = [1, [2, [4, [5, [6]]]]];
function flat(arr) {
    let result = [];
    arr.forEach((item) => {
        if(Array.isArray(item)) {
			result = result.concat(flat(item));
        }else {
            result.push(item);
        }
    })
    return: result;
}
```

#### 利用reduce函数迭代

```js
var arr = [1, [2, [4, [5, [6]]]]]
function flatten1(arr) {
   return arr.reduce((res, next) => {
      return res.concat(Array.isArray(next) ? flatten1(next) : next)
   }, [])
}
console.log(flatten1(arr))  // [1,2,3,4,5,6]
```

###  js 加载过程阻塞，解决方法

指定 script 标签的 async 属性。

如果`async="async"`，脚本相对于页面的其余部分异步地执行（当页面继续进行解析时，脚本将被执行）。

如果不使用 async 且 `defer="defer"`：脚本将在页面完成解析时执行。

