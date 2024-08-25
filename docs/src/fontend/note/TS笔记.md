---
title: TS笔记
date: 2023-02-16 10:00:54
tags:
categories:
classes: 笔记
---

## TypeScript 的介绍

TypeScript是一种由微软开发的开源、跨平台的编程语言。它是JavaScript的超集，最终会被编译为JavaScript代码。

-

## TypeScript 的特点

TypeScript 主要有 3 大特点：

- **始于JavaScript，归于JavaScript**

TypeScript 可以编译出纯净、 简洁的 JavaScript 代码，并且可以运行在任何浏览器上、Node.js 环境中和任何支持 ECMAScript 3（或更高版本）的JavaScript 引擎中。

- **强大的类型系统**

**类型系统**允许 JavaScript 开发者在开发 JavaScript 应用程序时使用高效的开发工具和常用操作比如静态检查和代码重构。

- **先进的 JavaScript**

TypeScript 提供最新的和不断发展的 JavaScript 特性，包括那些来自 2015 年的 ECMAScript 和未来的提案中的特性，比如异步功能和 Decorators，以帮助建立健壮的组件。

-

# 安装 TypeScript

命令行运行如下命令，全局安装 TypeScript：

```bash
npm install -g typescript
//
yarn global add typescript
```

安装完成后，在控制台运行如下命令，检查安装是否成功(3.x)：

```bash
tsc -V 
```

-

### 运行TS

在命令行上，运行 TypeScript 编译器：

```bash
tsc helloworld.ts
```

输出结果为一个 `helloworld.js` 文件，它包含了和输入文件中相同的 JavsScript 代码。

在命令行上，通过 Node.js 运行这段代码：

```bash
node helloworld.js
```

-

### vscode自动编译

```
1). 生成配置文件tsconfig.json
    tsc --init
2). 修改tsconfig.json配置
    "outDir": "./js",
    "strict": false,    
3). 启动监视任务: 
    终端 -> 运行任务 -> 监视tsconfig.json
```

-

-

# TS基础语法

-

## 一、类型注解

### 基本类型

```ts
//bool
let isDone: boolean = false;

//number
//支持 十进制 二进制 八进制 十六进制
let num: number = 123;

//string
let str: string = "name";

//undefined / null
let u: undefined = undefined;
let n: null = null;
```

### 数组

```ts
let array: number[] = [];

//泛型
let array: Array<number> = [];
```

### 元组 Tuple

元组类型允许表示一个已知元素数量和类型的数组，`各元素的类型不必相同`。 比如，你可以定义一对值分别为 `string` 和 `number` 类型的元组。

```ts
let tArray: [string, number];
//right
tArray = ["str", 123];
//wrong
tArray = [123, "str"];
```

-

### 枚举

默认从0开始

```ts
enum Colorful {
    red = 2,
    blue, 
    yellow,
    green
}

let meColor: Colorful = Colorful.blue;
```

-

### any

有时候，我们会想要为那些在编程阶段还不清楚类型的变量指定一个类型。 这些值可能来自于动态的内容，比如来自用户输入或第三方代码库。 这种情况下，我们不希望类型检查器对这些值进行检查而是直接让它们通过编译阶段的检查。 那么我们可以使用 `any` 类型来标记这些变量：

```ts
let notdecide: any = 123;
notdecide = 'string'; // ok
notdecide = true;  // ok

// 数组
let array: any[] = ['123', 123, true];
```

-

### void

某种程度上来说，`void` 类型像是与 `any` 类型相反，它`表示没有任何类型`。 当一个函数没有返回值时，你通常会见到其返回值类型是 `void`：

-

### object

`object` 表示非原始类型，也就是除 `number`，`string`，`boolean`之外的类型。

使用 `object` 类型，就可以更好的表示像 `Object.create` 这样的 `API`

-

### 联合类型

联合类型（Union Types）表示取值可以为多种类型中的一种

（或）

```ts
function func(x: number | string ): string {
    return x.toString();
}
```

-

### 类型断言

通过类型断言这种方式可以告诉编译器，“相信我，我知道自己在干什么”。 类型断言好比其它语言里的类型转换，但是不进行特殊的数据检查和解构。 它没有运行时的影响，只是在编译阶段起作用。 TypeScript 会假设你，程序员，已经进行了必须的检查。

> ```typescript
> 类型断言(Type Assertion): 可以用来手动指定一个值的类型
> 语法:
>     方式一: <类型>值
>     方式二: 值 as 类型  tsx中只能用这种方式
> ```



```ts
// 需求: 定义一个函数得到一个字符串或者数值数据的长度
function getLength(x: number | string) {
  if ((<string>x).length) {
    return (x as string).length
  } else {
    return x.toString().length
  }
```



### 类型推断

类型推断: TS会在没有明确的指定类型的时候推测出一个类型

> 1. 定义变量时赋值了, 推断为对应的类型. 
> 2. 定义变量时没有赋值, 推断为any类型

```typescript
/* 定义变量时赋值了, 推断为对应的类型 */
let num = 123 // number
// b9 = 'abc' // error

/* 定义变量时没有赋值, 推断为any类型 */
let anything  // any类型
b10 = 123
b10 = 'abc'
```

-

-

## 接口

TypeScript 的核心原则之一是对值所具有的结构进行类型检查。我们使用接口（Interfaces）来定义对象的类型。`接口是对象的状态(属性)和行为(方法)的抽象(描述)`

-

创建对象，对属性进行约束

```ts
interface Person {
    // 必须属性
    // 只读属性
    readonly id: number,
    name: string, 
    sex: string,
    // 可选属性
    age?: number
}

let person: Person {
    id: 1,
    name: '123',
    sex: '男'
}
```

-

### 函数类型

```ts
/* 
接口可以描述函数类型(参数的类型与返回的类型)
*/

interface SearchFunc {
  (source: string, subString: string): boolean
}
```

实例

```ts
const mySearch: SearchFunc = function (source: string, sub: string): boolean {
  return source.search(sub) > -1
}
```

-

### 类类型

#### 接口的实现类

```ts
interface Alarm {
  alert(): any;
}

interface Light {
    LightOn(): void;
}

// 类可以实现多个接口
class Clock implements Alarm, Light {
	alert() {
		console.log("the alarm")
    }
    LightOn() {
        console.log("the light is on")
    }
}
```

-

### 接口继承接口

```ts
interface lightAlarm extends Alarm, Ligth {}
```

-

## 类

### 公共，私有与受保护的修饰符

### [#](https://24kcs.github.io/vue3_study/chapter2/3_class.html#默认为-public)默认为 public

在上面的例子里，我们可以自由的访问程序里定义的成员。 如果你对其它语言中的类比较了解，就会注意到我们在之前的代码里并没有使用 `public` 来做修饰；例如，C# 要求必须明确地使用 `public` 指定成员是可见的。 在 TypeScript 里，成员都默认为 `public`。

你也可以明确的将一个成员标记成 `public`。 我们可以用下面的方式来重写上面的 `Animal` 类：

### [#](https://24kcs.github.io/vue3_study/chapter2/3_class.html#理解-private)理解 private

当成员被标记成 `private` 时，它就不能在声明它的类的外部访问。

### [#](https://24kcs.github.io/vue3_study/chapter2/3_class.html#理解-protected)理解 protected

`protected` 修饰符与 `private` 修饰符的行为很相似，但有一点不同，`protected`成员在派生类中仍然可以访问。



```ts
class Animal {
  public name: string

  public constructor (name: string) {
    this.name = name
  }

  public run (distance: number=0) {
    console.log(`${this.name} run ${distance}m`)
  }
}

class Person extends Animal {
  private age: number = 18
  protected sex: string = '男'
	// 重写父类方法
  run (distance: number=5) {
    console.log('Person jumping...')
    // 调用父的一般方法
    super.run(distance)
  }
}
```

-

### readonly 修饰符

`readonly` 关键字将属性设置为只读的。 只读属性必须在声明时或构造函数里被初始化

```ts
class Person {
    readonly name: string = 'qwe'
    // 参数属性
    constructor(readonly name: string) {
  		
    }
}
```

-

### 存取器

`TypeScript` 支持通过 `getters/setters` 来截取对对象成员的访问。 它能帮助你有效的控制对对象成员的访问。

```ts
class Person {
  firstName: string = 'A'
  lastName: string = 'B'
  get fullName () {
    return this.firstName + '-' + this.lastName
  }
  set fullName (value) {
    const names = value.split('-')
    this.firstName = names[0]
    this.lastName = names[1]
  }
}
const p = new Person()
console.log(p.fullName)
```

-

### 静态属性

> 静态属性, 是类对象的属性
> 非静态属性, 是类的实例对象的属性



```typescript
class Person {
  name1: string = 'A'
  static personalId: string = 'HUMAN001'
}

console.log( Person.personalId )
```

-

###  抽象类

抽象类做为其它派生类的基类使用。 它们不能被实例化。不同于接口，抽象类可以包含成员的实现细节。 `abstract` 关键字是用于定义抽象类和在抽象类内部定义抽象方法。



## 函数

-

### 可选参数和默认参数

TypeScript 里的每个函数参数都是必须的。 这不是指不能传递 `null` 或 `undefined` 作为参数，而是说编译器检查用户是否为每个参数都传入了值。编译器还会假设只有这些参数会被传递进函数。 简短地说，传递给一个函数的参数个数必须与函数期望的参数个数一致。

TypeScript 里我们可以在参数名旁使用 `?` 实现可选参数的功能。

```ts
function getName(firstName: string='L', lastName?: string): string {}
// const getName = (firstName: string='L', lastName?: string): string => {}
```

### 剩余参数

```ts
function info(x: string, ...args: string[]): string {}
```

-

### 函数重载

函数重载: 函数名相同, 而形参不同的多个函数

```typescript
// 重载函数声明
function add (x: string, y: string): string
function add (x: number, y: number): number

// 定义函数实现
function add(x: string | number, y: string | number): string | number {
  // 在实现上我们要注意严格判断两个参数的类型是否相等，而不能简单的写一个 x + y
  if (typeof x === 'string' && typeof y === 'string') {
    return x + y
  } else if (typeof x === 'number' && typeof y === 'number') {
    return x + y
  }
}
```

-

-

# 泛型

指在定义函数、接口或类的时候，不预先指定具体的类型，而在使用的时候再指定具体类型的一种特性

-



### 多个泛型参数的函数

一个函数可以定义多个泛型参数

```typescript
function swap <K, V> (a: K, b: V): [K, V] {
  return [a, b]
}
const result = swap<string, number>('abc', 123)
// （字符串的方法，数字的方法）
console.log(result[0].length, result[1].toFixed())
```



## 泛型接口

在定义接口时, 为接口中的属性或方法定义泛型类型
在使用接口时, 再指定具体的泛型类型













