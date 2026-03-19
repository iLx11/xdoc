---
title: TS笔记
date: 20230216 10:00:54
tags:
categories:
classes: 笔记
---

## TypeScript 的介绍

TypeScript是一种由微软开发的开源、跨平台的编程语言。它是JavaScript的超集，最终会被编译为JavaScript代码。



## TypeScript 的特点

TypeScript 主要有 3 大特点：

- **始于JavaScript，归于JavaScript**

TypeScript 可以编译出纯净、 简洁的 JavaScript 代码，并且可以运行在任何浏览器上、Node.js 环境中和任何支持 ECMAScript 3（或更高版本）的JavaScript 引擎中。

- **强大的类型系统**

**类型系统**允许 JavaScript 开发者在开发 JavaScript 应用程序时使用高效的开发工具和常用操作比如静态检查和代码重构。

- **先进的 JavaScript**

TypeScript 提供最新的和不断发展的 JavaScript 特性，包括那些来自 2015 年的 ECMAScript 和未来的提案中的特性，比如异步功能和 Decorators，以帮助建立健壮的组件。



# 安装 TypeScript

命令行运行如下命令，全局安装 TypeScript：

```bash
npm install g typescript
//
yarn global add typescript
```

安装完成后，在控制台运行如下命令，检查安装是否成功(3.x)：

```bash
tsc V 
```

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

### vscode自动编译

```
1). 生成配置文件tsconfig.json
    tsc init
2). 修改tsconfig.json配置
    "outDir": "./js",
    "strict": false,    
3). 启动监视任务: 
    终端 > 运行任务 > 监视tsconfig.json
```

### vscode  开启类型提示

首先，通过 Ctrl(Command) + Shift + P 打开命令面板，找到「打开工作区设置」这一项。

在打开的设置中输入 typescript，筛选出所有 TypeScript 有关的配置，点击左侧的"TypeScript"，这里才是官方内置的配置。

补全搜索词，使用“typescript inlay hints”：

推荐开启的配置项主要是这几个：

- Function Like Return Types，显示推导得到的函数返回值类型；
- Parameter Names，显示函数入参的名称；
- Parameter Types，显示函数入参的类型；
- Variable Types，显示变量的类型。

## 代码测试

TypeScript 官方提供的 [TypeScript Playground](https://link.juejin.cn/?target=https%3A%2F%2Fwww.typescriptlang.org%2Fplay)

编译行为会随着你的代码变更自动执行，无需手动操作，但是如果你希望执行编译后的 JS 代码，就需要通过 Command(Ctrl) + Enter 的方式

### 代码编译测试

来自社区的 npm 包 esno，简化 -> js -> node 步骤：

```bash
$ npx esno index.ts

Hello World!
```



# 配置

如果我们的 target 指定了一个版本，比如 es5，但你又希望使用 es6 中才有的 Promise 语法，此时就需要在 lib 配置项中新增 'es2015.promise'，来告诉 TypeScript 你的目标环境中需要启用这个能力，否则就会得到一个错误：

```typescript
const handler = async () => {};
```

> *异步函数或方法必须返回 “Promise”。请确保具有对 “Promise” 的声明或在 “--lib” 选项中包含了 “ES2015”。ts(2697)*

```ts
{
  "compilerOptions": {
    "lib": ["ES2015"],
    "target": "ES5"
  }
}
```



## 输入控制

使用 include 和 exclude 这两个配置项来确定要包括哪些代码文件，再通过 outDir 选项配置你要存放输出文件的文件夹

首先通过 include ，我们指定了要包括 src 目录下所有的文件，再通过 exclude 选项，剔除掉已经被 include 进去的文件，包括 `src/generated` 文件夹，以及所有 `.spec.ts` 后缀的测试用例文件。然后在完成编译后，就可以在 dist 目录下找到编译产物了。

```json
{
  "compilerOptions": {
    "target": "es5",
    "module": "commonjs",
    "outDir": "dist",
    "strict": true
  },
  "include": [
    "src/**/*"
  ],
  "exclude": [
    "src/generated",
    "**/*.spec.ts"
  ]
}
```

假设我们的项目中被三方依赖安装了大量的 @types 文件，导致类型加载缓慢或者冲突，此时就可以使用 types 配置项来显式指定你需要加载的类型定义：

会加载 `@types/node`，`@types/jest`，`@types/react` 这几个类型定义包

```json
{
  "compilerOptions": {
    "types": ["node", "jest", "react"],
  }
}
```



# TS基础语法

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

TypeScript 4.0 中，有了具名元组（[Labeled Tuple Elements](https://link.juejin.cn/?target=https%3A%2F%2Fgithub.com%2FMicrosoft%2FTypeScript%2Fissues%2F28259)）的支持，使得我们可以为元组中的元素打上类似属性的标记：

```ts
const arr7: [name: string, age: number, male?: boolean] = ['linbudu', 599, true];
```



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

### any

有时候，我们会想要为那些在编程阶段还不清楚类型的变量指定一个类型。 这些值可能来自于动态的内容，比如来自用户输入或第三方代码库。 这种情况下，我们不希望类型检查器对这些值进行检查而是直接让它们通过编译阶段的检查。 那么我们可以使用 `any` 类型来标记这些变量：

```ts
let notdecide: any = 123;
notdecide = 'string'; // ok
notdecide = true;  // ok

// 数组
let array: any[] = ['123', 123, true];
```

### void

某种程度上来说，`void` 类型像是与 `any` 类型相反，它`表示没有任何类型`。 当一个函数没有返回值时，你通常会见到其返回值类型是 `void`：

### object

`object` 表示非原始类型，也就是除 `number`，`string`，`boolean`之外的类型。

使用 `object` 类型，就可以更好的表示像 `Object.create` 这样的 `API`



和 Object 类似的还有 Boolean、Number、String、Symbol，这几个**装箱类型（Boxed Types）** 同样包含了一些超出预期的类型。以 String 为例，它同样包括 undefined、null、void，以及代表的 **拆箱类型（Unboxed Types）** string，但并不包括其他装箱类型对应的拆箱类型，如 boolean 与 基本对象类型

**在任何情况下，都不应该使用这些装箱类型。**



### 联合类型

联合类型（Union Types）表示取值可以为多种类型中的一种

（或）

```ts
function func(x: number | string ): string {
    return x.toString();
}
```

## 断言

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



### 非空断言

非空断言其实是类型断言的简化，它使用 `!` 语法，即 `obj!.func()!.prop` 的形式标记前面的一个声明一定是非空的（实际上就是剔除了 null 和 undefined 类型）

```ts
foo.func!().prop!.toFixed();
```

类似于可选链：

```typescript
foo.func?.().prop?.toFixed();
```

但不同的是，非空断言的运行时仍然会保持调用链，因此在运行时可能会报错。而可选链则会在某一个部分收到 undefined 或 null 时直接短路掉，不会再发生后面的调用。

为什么说非空断言是类型断言的简写？因为上面的非空断言实际上等价于以下的类型断言操作：

```typescript
((foo.func as () => ({
  prop?: number;
}))().prop as number).toFixed();
```



## 类型推断

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





## 接口

TypeScript 的核心原则之一是对值所具有的结构进行类型检查。我们使用接口（Interfaces）来定义对象的类型。`接口是对象的状态(属性)和行为(方法)的抽象(描述)`



创建对象，对属性进行约束

```ts
interface Person {
    // 只读属性
    readonly id: number,
    // 必须属性
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
  return source.search(sub) > 1
}
```

 

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

### 接口继承接口

```ts
interface lightAlarm extends Alarm, Ligth {}
```

### type 与 interface

推荐 interface 用来描述**对象、类的结构**，而类型别名用来**将一个函数签名、一组联合类型、一个工具类型等等抽离成一个完整独立的类型**。但大部分场景下接口结构都可以被类型别名所取代，因此，只要你觉得统一使用类型别名让你觉得更整齐，也没什么问题。



## 类

### 公共，私有与受保护的修饰符

### [#](https://24kcs.github.io/vue3_study/chapter2/3_class.html#默认为public)默认为 public

在上面的例子里，我们可以自由的访问程序里定义的成员。 如果你对其它语言中的类比较了解，就会注意到我们在之前的代码里并没有使用 `public` 来做修饰；例如，C# 要求必须明确地使用 `public` 指定成员是可见的。 在 TypeScript 里，成员都默认为 `public`。

你也可以明确的将一个成员标记成 `public`。 我们可以用下面的方式来重写上面的 `Animal` 类：

### [#](https://24kcs.github.io/vue3_study/chapter2/3_class.html#理解private)理解 private

当成员被标记成 `private` 时，它就不能在声明它的类的外部访问。

### [#](https://24kcs.github.io/vue3_study/chapter2/3_class.html#理解protected)理解 protected

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



### 存取器

`TypeScript` 支持通过 `getters/setters` 来截取对对象成员的访问。 它能帮助你有效的控制对对象成员的访问。

```ts
class Person {
  firstName: string = 'A'
  lastName: string = 'B'
  get fullName () {
    return this.firstName + '' + this.lastName
  }
  set fullName (value) {
    const names = value.split('')
    this.firstName = names[0]
    this.lastName = names[1]
  }
}
const p = new Person()
console.log(p.fullName)
```



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



###  抽象类

抽象类做为其它派生类的基类使用。 它们不能被实例化。不同于接口，抽象类可以包含成员的实现细节。 `abstract` 关键字是用于定义抽象类和在抽象类内部定义抽象方法。



## 函数

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

### 可选参数与 rest 参数

对象类型中我们使用 `?` 描述一个可选属性一样，在函数类型中我们也使用 `?` 描述一个可选参数：

```ts
// 在函数逻辑中注入可选参数默认值
function foo1(name: string, age?: number): number {
  const inputAge = age ?? 18;
  return name.length + inputAge
}

// 直接为可选参数声明默认值
function foo2(name: string, age: number = 18): number {
  const inputAge = age;
  return name.length + inputAge
}
```



## 泛型

指在定义函数、接口或类的时候，不预先指定具体的类型，而在使用的时候再指定具体类型的一种特性

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



## 类型接口

TypeScript 中，需要专门的 .d.ts 文件来进行书写，这里的 d 即是 declaration 声明之意

在从 TS 编译到 JS 的过程中，类型并不是真的全部消失了，而是被放到了专门的类型声明文件里，编译一个 TS 文件时，它不仅仅会产生 JS 文件，还会产生一个 .d.ts 文件

## 字面量类型与联合类型

### 字面量类型

字面量类型主要包括**字符串字面量类型**、**数字字面量类型**、**布尔字面量类型**和**对象字面量类型**，它们可以直接作为类型标注：

```typescript
const str: "linbudu" = "linbudu";
const num: 599 = 599;
const bool: true = true;
```

单独使用字面量类型比较少见，因为单个字面量类型并没有什么实际意义。它通常和联合类型（即这里的 `|`）一起使用，表达一组字面量类型：

```ts
interface Tmp {
  bool: true | false;
  num: 1 | 2 | 3;
  str: "lin" | "bu" | "du"
}
```

### 联合类型

而联合类型你可以理解为，它代表了**一组类型的可用集合**，只要最终赋值的类型属于联合类型的成员之一，就可以认为符合这个联合类型。联合类型对其成员并没有任何限制，除了上面这样对同一类型字面量的联合，我们还可以将各种类型混合到一起：

```ts
interface Tmp {
  mixed: true | string | 599 | {} | (() => {}) | (1 | 2)
}
```

- 对于联合类型中的函数类型，需要使用括号`()`包裹起来
- 函数类型并不存在字面量类型，因此这里的 `(() => {})` 就是一个合法的函数类型
- 你可以在联合类型中进一步嵌套联合类型，但这些嵌套的联合类型最终都会被展平到第一级中

联合类型的常用场景之一是通过多个对象类型的联合，来实现手动的互斥属性，即这一属性如果有字段1，那就没有字段2：

```ts
interface Tmp {
  user:
    | {
        vip: true;
        expires: string;
      }
    | {
        vip: false;
        promotion: string;
      };
}

declare var tmp: Tmp;

if (tmp.user.vip) {
  console.log(tmp.user.expires);
} 
```



# 内置方法

## Partial

它接收一个对象类型，并将这个对象类型的所有属性都标记为可选，这样我们就不需要一个个将它们标记为可选属性了。 

```ts
type User = {
  name: string;
  age: number;
  email: string;
};

type PartialUser = Partial<User>;

// 可以不实现全部的属性
const partialUser: PartialUser = {
  name: 'John Doe',
  age: 30
};
```

Required, readonly ，使用方式和 Partial 完全一致

## 索引签名类型

### Record

```ts
type UserProps = 'name' | 'job' | 'email';

// 等价于你一个个实现这些属性了
type User = Record<UserProps, string>;

const user: User = {
  name: 'John Doe',
  job: 'fe-developer',
  email: 'john.doe@example.com'
};
```

声明属性名还未确定的接口类型

```ts
type User = Record<string, string>;

const user: User = {
  name: 'John Doe',
  job: 'fe-developer',
  email: 'john.doe@example.com',
  bio: 'Make more interesting things!',
  type: 'vip',
  // ...
};
```

### Pick 

Pick 类型接收一个对象类型，以及一个字面量类型组成的联合类型，这个联合类型只能是由对象类型的属性名组成的。它会对这个对象类型进行裁剪，只保留你传入的属性名组成的部分：

```typescript
type User = {
  name: string;
  age: number;
  email: string;
  phone: string;
};

// 只提取其中的 name 与 age 信息
type UserBasicInfo = Pick<User, 'name' | 'age'>;

const user: User = {
  name: 'John Doe',
  age: 30,
  email: 'john.doe@example.com',
  phone: '1234567890'
};

const userBasicInfo: UserBasicInfo = {
  name: 'John Doe',
  age: 30
};
```

而 Omit 类型就是 Pick 类型的另一面，它的入参和 Pick 类型一致，但效果却是相反的——它会移除传入的属性名的部分，只保留剩下的部分作为新的对象类型：

```typescript
type User = {
  name: string;
  age: number;
  email: string;
  phone: string;
};

// 只移除 phone 属性
type UserWithoutPhone = Omit<User, 'phone'>;

const user: User = {
  name: 'John Doe',
  age: 30,
  email: 'john.doe@example.com',
  phone: '1234567890'
};

const userWithoutPhone: UserWithoutPhone = {
  name: 'John Doe',
  age: 30,
  email: 'john.doe@example.com'
};
```

### Exclude

从一个类型中移除另一个类型中也存在的部分：

```typescript
type UserProps = 'name' | 'age' | 'email' | 'phone' | 'address';
type RequiredUserProps = 'name' | 'email';

// OptionalUserProps = UserProps - RequiredUserProps
type OptionalUserProps = Exclude<UserProps, RequiredUserProps>;

const optionalUserProps: OptionalUserProps = 'age'; // 'age' | 'phone' | 'address';
```

而 Extract 则用于提取另一个类型中也存在的部分，即交集：

```typescript
type UserProps = 'name' | 'age' | 'email' | 'phone' | 'address';
type RequiredUserProps = 'name' | 'email';

type RequiredUserPropsOnly = Extract<UserProps, RequiredUserProps>;

const requiredUserPropsOnly: RequiredUserPropsOnly = 'name'; // 'name' | 'email';
```

## 函数类型

###  Parameters 和 ReturnType 

这两个类型来提取函数的参数类型与返回值类型：

``` ts
type Add = (x: number, y: number) => number;

type AddParams = Parameters<Add>; // [number, number] 类型
type AddResult = ReturnType<Add>; // number 类型

const addParams: AddParams = [1, 2];
const addResult: AddResult = 3;
```

只有一个函数，而并没有这个函数类型，此时可以使用 TypeScript 提供的类型查询操作符，即 typeof（和 JavaScript 不同），来获得一个函数的结构化类型：

```ts
const addHandler = (x: number, y: number) => x + y;

type Add = typeof addHandler; // (x: number, y: number) => number;

type AddParams = Parameters<Add>; // [number, number] 类型
type AddResult = ReturnType<Add>; // number 类型
```

### Promise<string> 读取 string

```ts
const promise = new Promise<string>((resolve) => {
  setTimeout(() => {
    resolve("Hello, World!");
  }, 1000);
});

type PromiseInput = Promise<string>;
type AwaitedPromiseInput = Awaited<PromiseInput>; // string
```

可以直接嵌套在 ReturnType 内部使用：

```ts
// 定义一个函数，该函数返回一个 Promise 对象
async function getPromise() {
  return new Promise<string>((resolve) => {
    setTimeout(() => {
      resolve("Hello, World!");
    }, 1000);
  });
}

type Result = Awaited<ReturnType<typeof getPromise>>; // string 类型

```

## 模板字符串类型

```ts
type Brand = 'iphone' | 'xiaomi' | 'honor';
type Memory = '16G' | '64G';
type ItemType = 'official' | 'second-hand';

type SKU = `${Brand}-${Memory}-${ItemType}`;
```

可以得到了一个由所有联合类型的可能分支进行排列组合，共 3x2x2 = 12 个类型组成的联合类型
