---
title: Vue 面试
date: 2022-10-18 15:30:55
tags:
categories:
classes: 笔记
---

### 数据驱动（MVVM)

```
MVVM`表示的是 `Model-View-ViewModel
```

- Model：模型层，负责处理业务逻辑以及和服务器端进行交互
- View：视图层：负责将数据模型转化为UI展示出来，可以简单的理解为HTML页面
- ViewModel：视图模型层，用来连接Model和View，是Model和View之间的通信桥梁

### 组件化

1.什么是组件化一句话来说就是把图形、非图形的各种逻辑均抽象为一个统一的概念（组件）来实现开发的模式，在`Vue`中每一个`.vue`文件都可以视为一个组件2.组件化的优势

- 降低整个系统的耦合度，在保持接口不变的情况下，我们可以替换不同的组件快速完成需求，例如输入框，可以替换为日历、时间、范围等组件作具体的实现
- 调试方便，由于整个系统是通过组件组合起来的，在出现问题的时候，可以用排除法直接移除组件，或者根据报错的组件快速定位问题，之所以能够快速定位，是因为每个组件之间低耦合，职责单一，所以逻辑会比分析整个系统要简单
- 提高可维护性，由于每个组件的职责单一，并且组件在系统中是被复用的，所以对代码进行优化可获得系统的整体升级

### 指令系统

解释：指令 (Directives) 是带有 v- 前缀的特殊属性作用：当表达式的值改变时，将其产生的连带影响，响应式地作用于 DOM

## SPA

SPA（single-page application），翻译过来就是单页应用`SPA`是一种网络应用程序或网站的模型，它通过动态重写当前页面来与用户交互，这种方法避免了页面之间切换打断用户体验在单页应用中，所有必要的代码（`HTML`、`JavaScript`和`CSS`）都通过单个页面的加载而检索，或者根据需要（通常是为响应用户操作）动态装载适当的资源并添加到页面页面在任何时间点都不会重新加载，也不会将控制转移到其他页面

#### 单页应用与多页应用的区别

|                 | 单页面应用（SPA）         | 多页面应用（MPA）                   |
| --------------- | ------------------------- | ----------------------------------- |
| 组成            | 一个主页面和多个页面片段  | 多个主页面                          |
| 刷新方式        | 局部刷新                  | 整页刷新                            |
| url模式         | 哈希模式                  | 历史模式                            |
| SEO搜索引擎优化 | 难实现，可使用SSR方式改善 | 容易实现                            |
| 数据传递        | 容易                      | 通过url、cookie、localStorage等传递 |
| 页面切换        | 速度快，用户体验良好      | 切换加载资源，速度慢，用户体验差    |
| 维护成本        | 相对容易                  | 相对复杂                            |

#### 单页应用优缺点

优点：

> - 具有桌面应用的即时性、网站的可移植性和可访问性
> - 用户体验好、快，内容的改变不需要重新加载整个页面
> - 良好的前后端分离，分工更明确

缺点：

> - 不利于搜索引擎的抓取
> - 首次渲染速度相对较慢

## 实现一个SPA

#### 原理

##### hash模式

1. 监听地址栏中`hash`变化驱动界面变化
2. 用`pushsate`记录浏览器的历史，驱动界面发送变化

##### history模式

`history` 模式核心借用 `HTML5 history api`，`api` 提供了丰富的 `router` 相关属性先了解一个几个相关的api



- `history.pushState` 浏览器历史纪录添加记录
- `history.replaceState`修改浏览器历史纪录中当前纪录
- `history.popState` 当 `history` 发生变化时触发

## 如何给SPA做SEO



下面给出基于`Vue`的`SPA`如何实现`SEO`的三种方式

1. **SSR服务端渲染**

将组件或页面通过服务器生成html，再返回给浏览器，如`nuxt.js`

1. **静态化**

目前主流的静态化主要有两种：（1）一种是通过程序将动态页面抓取并保存为静态页面，这样的页面的实际存在于服务器的硬盘中（2）另外一种是通过WEB服务器的 `URL Rewrite`的方式，它的原理是通过web服务器内部模块按一定规则将外部的URL请求转化为内部的文件地址，一句话来说就是把外部请求的静态地址转化为实际的动态页面地址，而静态页面实际是不存在的。这两种方法都达到了实现URL静态化的效果

1. **使用**`**Phantomjs**`**针对爬虫处理**

原理是通过`Nginx`配置，判断访问来源是否为爬虫，如果是则搜索引擎的爬虫请求会转发到一个`node server`，再通过`PhantomJS`来解析完整的`HTML`，返回给爬虫。下面是大致流程图

![img](https://gitee.com/iLx1/resource-img/raw/master/25be6630-3ac7-11eb-ab90-d9ae814b240d.png)

## Vue实例挂载过程

-  `new Vue`的时候调用会调用`_init`方法 

- - 定义 `$set`、`$get` 、`$delete`、`$watch` 等方法
  - 定义 `$on`、`$off`、`$emit`、`$off`等事件
  - 定义 `_update`、`$forceUpdate`、`$destroy`生命周期

-  调用`$mount`进行页面的挂载 
-  挂载的时候主要是通过`mountComponent`方法 
-  定义`updateComponent`更新函数 
-  执行`render`生成虚拟`DOM` 
-  `_update`将虚拟`DOM`生成真实`DOM`结构，并且渲染到页面中 

## v-if 和 v-for

1. 不要把 `v-if` 和 `v-for` 同时用在同一个元素上，带来性能方面的浪费（每次渲染都会先循环再进行条件判断）
2. 如果避免出现这种情况，则在外层嵌套`template`（页面渲染不生成`dom`节点），在这一层进行v-if判断，然后在内部进行v-for循环

## 首屏加载

首屏时间（First Contentful Paint），指的是浏览器从响应用户输入网址地址，到首屏内容渲染完成的时间，此时整个网页不一定要全部渲染完成，但需要展示当前视窗需要的内容

首屏加载可以说是用户体验中**最重要**的环节



#### 常见的几种SPA首屏优化方式

> - 减小入口文件积
> - 静态资源本地缓存
> - UI框架按需加载
> - 图片资源的压缩
> - 组件重复打包
> - 开启GZip压缩
> - 使用SSR

### 组件data属性

`vue`组件可能会有很多个实例，采用函数返回一个全新`data`形式，使每个实例对象的数据不会受到其他实例对象数据的污染

## NextTick是什么



官方对其的定义

> 在下次 DOM 更新循环结束之后执行延迟回调。在修改数据之后立即使用这个方法，获取更新后的 DOM

我们可以理解成，`Vue` 在更新 `DOM` 时是异步执行的。当数据发生变化，`Vue`将开启一个异步更新队列，视图需要等队列中所有数据变化完成之后，再统一进行更新

## mixin

先来看一下官方定义

`mixin`（混入），提供了一种非常灵活的方式，来分发 `Vue` 组件中的可复用功能。
本质其实就是一个`js`对象，它可以包含我们组件中任意功能选项，如`data`、`components`、`methods`、`created`、`computed`等等



我们只要将共用的功能以对象的方式传入 `mixins`选项中，当组件使用 `mixins`对象时所有`mixins`对象的选项都将被混入该组件本身的选项中来

### 局部混入



定义一个`mixin`对象，有组件`options`的`data`、`methods`属性

```javascript
var myMixin = {
  created: function () {
    this.hello()
  },
  methods: {
    hello: function () {
      console.log('hello from mixin!')
    }
  }
}
```



组件通过`mixins`属性调用`mixin`对象

```javascript
Vue.component('componentA',{
  mixins: [myMixin]
})
```

该组件在使用的时候，混合了`mixin`里面的方法，在自动执行`created`生命钩子，执行`hello`方法



### 全局混入



通过`Vue.mixin()`进行全局的混入

```javascript
Vue.mixin({
  created: function () {
      console.log("全局混入")
    }
})
```

使用全局混入需要特别注意，因为它会影响到每一个组件实例（包括第三方组件）

PS：全局混入常用于插件的编写

### 使用场景

在日常的开发中，我们经常会遇到在不同的组件中经常会需要用到一些相同或者相似的代码，这些代码的功能相对独立

可以通过`Vue`的`mixin`功能将相同或者相似的代码提出来

## create 和 mounted 相关

beforecreated：el 和 data 并未初始化
created:完成了 data 数据的初始化，el没有
beforeMount：完成了 el 和 data 初始化
mounted ：完成挂载

## key的作用

> key是给每一个vnode的唯一id，也是diff的一种优化策略，可以根据key，更准确， 更快的找到对应的vnode节点

## Keep-alive 是什么

```
keep-alive`是`vue`中的内置组件，能在组件切换过程中将状态保留在内存中，防止重复渲染`DOM
```



`keep-alive` 包裹动态组件时，会缓存不活动的组件实例，而不是销毁它们



`keep-alive`可以设置以下`props`属性：



-  `include` - 字符串或正则表达式。只有名称匹配的组件会被缓存 
-  `exclude` - 字符串或正则表达式。任何名称匹配的组件都不会被缓存 
-  `max` - 数字。最多可以缓存多少组件实例 



关于`keep-alive`的基本用法：

```html
<keep-alive>
  <component :is="view"></component>
</keep-alive>
```



使用`includes`和`exclude`：

```vue
<keep-alive include="a,b">
  <component :is="view"></component>
</keep-alive>
<!-- 正则表达式 (使用 `v-bind`) -->
<keep-alive :include="/a|b/">
  <component :is="view"></component>
</keep-alive>
<!-- 数组 (使用 `v-bind`) -->
<keep-alive :include="['a', 'b']">
  <component :is="view"></component>
</keep-alive>
```



匹配首先检查组件自身的 `name` 选项，如果 `name` 选项不可用，则匹配它的局部注册名称 (父组件 `components` 选项的键值)，匿名组件不能被匹配



设置了 keep-alive 缓存的组件，会多出两个生命周期钩子（`activated`与`deactivated`）：



-  首次进入组件时：`beforeRouteEnter` > `beforeCreate` > `created`> `mounted` > `activated` > ... ... > `beforeRouteLeave` > `deactivated` 
-  再次进入组件时：`beforeRouteEnter` >`activated` > ... ... > `beforeRouteLeave` > `deactivated` 



### 表单修饰符

在我们填写表单的时候用得最多的是`input`标签，指令用得最多的是`v-model`



关于表单的修饰符有如下：

> - lazy
>
>   光标离开标签时，才会赋值给value
>
> - trim
>
>   过滤首空格
>
> - number
>
>   将输入值转为数值类型

### 事件修饰符

事件修饰符是对事件捕获以及目标进行了处理，有如下修饰符：

> - stop
>
>   阻止事件冒泡
>
> - prevent
>
>   阻止默认行为
>
> - self
>
>   当前元素自身
>
> - once 单次触发
>
> - capture
>
>   使事件触发从包含这个元素的顶层开始往下触发
>
> - passive
>
>   在移动端，当我们在监听元素滚动事件的时候，会一直触发`onscroll`事件会让我们的网页变卡，因此我们使用这个修饰符的时候，相当于给`onscroll`事件整了一个`.lazy`修饰符
>
> - native
>
>   让组件变成像`html`内置标签那样监听根元素的原生事件，否则组件上使用 `v-on` 只会监听自定义事件

### 鼠标按钮修饰符

鼠标按钮修饰符针对的就是左键、右键、中键点击，有如下：

> - left 左键点击
> - right 右键点击
> - middle 中键点击

### 键盘修饰符

键盘修饰符是用来修饰键盘事件（`onkeyup`，`onkeydown`）的，有如下：

`keyCode`存在很多，但`vue`为我们提供了别名，分为以下两种：

> - 普通键（enter、tab、delete、space、esc、up...）
> - 系统修饰键（ctrl、alt、meta、shift...）

### v-bind修饰符

v-bind修饰符主要是为属性进行操作，用来分别有如下：

> - sync
> - prop
> - camel

### sync 

```js
//父组件
<comp :myMessage.sync="bar"></comp> 
//子组件
this.$emit('update:myMessage',params);
```

#### props

设置自定义标签属性，避免暴露数据，防止污染HTML结构

```javascript
<input id="uid" title="title1" value="1" :index.prop="index">
```

#### camel

将命名变为驼峰命名法，如将`view-Box`属性名转换为 `viewBox

```javascript
<svg :viewBox="viewBox"></svg>
```

## Vue注册自定义指令

注册一个自定义指令有全局注册与局部注册



`全局注册`主要是通过Vue.directive方法进行注册

Vue.directive第一个参数是指令的名字（不需要写上v-前缀），第二个参数可以是对象数据，也可以是一个指令函数

```js
// 注册一个全局自定义指令 `v-focus`

Vue.directive('focus', {
  // 当被绑定的元素插入到 DOM 中时……
  inserted: function (el) {
   // 聚焦元素
  el.focus()  // 页面加载完成之后自动让输入框获取到焦点的小功能
  }
})
```



`局部注册`通过在组件options选项中设置directive属性

```js
directives: {
  focus: {
 // 指令的定义
	inserted: function (el) {
		el.focus() // 页面加载完成之后自动让输入框获取到焦点的小功能
	}
  }
}
```



然后你可以在模板中任何元素上使用新的 v-focus property，如下：

```html
<input v-focus />
```



##### 自定义指令也像组件那样存在钩子函数：

-  `bind`：只调用一次，指令第一次绑定到元素时调用。在这里可以进行一次性的初始化设置 
-  `inserted`：被绑定元素插入父节点时调用 (仅保证父节点存在，但不一定已被插入文档中) 
-  `update`：所在组件的 `VNode` 更新时调用，但是可能发生在其子 `VNode` 更新之前。指令的值可能发生了改变，也可能没有。但是你可以通过比较更新前后的值来忽略不必要的模板更新 
-  `componentUpdated`：指令所在组件的 `VNode` 及其子 `VNode` 全部更新后调用 
-  `unbind`：只调用一次，指令与元素解绑时调用 

##### 所有的钩子函数的参数都有以下：

- `el`：指令所绑定的元素，可以用来直接操作 `DOM`
- `binding`：一个对象，包含以下 `property`： 

- - `name`：指令名，不包括 `v-` 前缀。
  - `value`：指令的绑定值，例如：`v-my-directive="1 + 1"` 中，绑定值为 `2`。
  - `oldValue`：指令绑定的前一个值，仅在 `update` 和 `componentUpdated` 钩子中可用。无论值是否改变都可用。
  - `expression`：字符串形式的指令表达式。例如 `v-my-directive="1 + 1"` 中，表达式为 `"1 + 1"`。
  - `arg`：传给指令的参数，可选。例如 `v-my-directive:foo` 中，参数为 `"foo"`。
  - `modifiers`：一个包含修饰符的对象。例如：`v-my-directive.foo.bar` 中，修饰符对象为 `{ foo: true, bar: true }`

- `vnode`：`Vue` 编译生成的虚拟节点
- `oldVnode`：上一个虚拟节点，仅在 `update` 和 `componentUpdated` 钩子中可用



```html
<div v-demo="{ color: 'white', text: 'hello!' }"></div>
<script>
    Vue.directive('demo', function (el, binding) {
    console.log(binding.value.color) // "white"
    console.log(binding.value.text)  // "hello!"
    })
</script>
```

### 自定义事件实现节流

```js
// 1.设置v-throttle自定义指令
Vue.directive('throttle',{
    bind: (el, binding) => {
    	let throttleTime = binding.time;
        if(!throttle) {
            throttleTime = 2000;
        }
       	let timer = null;
        el.addEventListener('click', function(event){
                if(!timer) {
                timer = setTimeout(() => {
                    timer = null;
                }, throttleTime); 
            }else {
                event && event.stopImmediatePropagation();
            }
        }, true);
    }
})
// 2.为button标签设置v-throttle自定义指令
<button @click="sayHello" v-throttle>提交</button>
```



### 自定义事件实现Copy功能

```js
Vue.directive('copy', {
    bind: (el, { value }) => {
        el.$value = value;
        el.handler = () => {
            if (!el.$value) {
                console.log("内容为空")
                return;
            }
            const textarea = document.createElement('textarea');
            textarea.readOnly = 'readOnly';
            textarea.style.postion = 'absolute';
            textarea.style.left = '-6666px';
            textarea.value = el.$value;
            document.body.appendChild(textarea);
            textarea.select();
            if (document.execCommand('Copy')) {
                console.log("复制成功");
            }
            document.body.removeChild(textarea);
        };
        //绑定事件
        el.addEventListener('click', el.handler);
    },
    //当传进来的值更新的时候触发
    componentUpdated(el, { value }) {
        el.$value = value;
    },
    //指令与元素解绑的时候
    unbind(el) {
        el.removeEventListener('click', el.handler);
    }
})
```



## 虚拟DOM

实际上它只是一层对真实`DOM`的抽象，以`JavaScript` 对象 (`VNode` 节点) 作为基础的树，用对象的属性来描述节点，最终可以通过一系列操作使这棵树映射到真实环境上



在`Javascript`对象中，虚拟`DOM` 表现为一个 `Object`对象。并且最少包含标签名 (`tag`)、属性 (`attrs`) 和子元素对象 (`children`) 三个属性，不同框架对这三个属性的名命可能会有差别

创建虚拟`DOM`就是为了更好将虚拟的节点渲染到页面视图中，所以虚拟`DOM`对象的节点与真实`DOM`的属性一一照应



当你在一次操作时，需要更新10个`DOM`节点，浏览器没这么智能，收到第一个更新`DOM`请求后，并不知道后续还有9次更新操作，因此会马上执行流程，最终执行10次流程

通过`VNode`，同样更新10个`DOM`节点，虚拟`DOM`不会立即操作`DOM`，而是将这10次更新的`diff`内容保存到本地的一个`js`对象中，最终将这个`js`对象一次性`attach`到`DOM`树上，避免大量的无谓计算

## diff算法

`diff` 算法是一种通过同层的树节点进行比较的高效算法



其有两个特点：

> - 比较只会在同层级进行, 不会跨层级比较
> - 在diff比较的过程中，循环从两边向中间比较

`diff` 算法在很多场景下都有应用，在 `vue` 中，作用于虚拟 `dom` 渲染成真实 `dom` 的新旧 `VNode` 节点比较

## 实现一个简易版axios



构建一个`Axios`构造函数，核心代码为`request`

```js
class Axios {
    constructor() {

    }

    request(config) {
        return new Promise(resolve => {
            const {url = '', method = 'get', data = {}} = config;
            // 发送ajax请求
            const xhr = new XMLHttpRequest();
            xhr.open(method, url, true);
            xhr.onload = function() {
                console.log(xhr.responseText)
                resolve(xhr.responseText);
            }
            xhr.send(data);
        })
    }
}
```

导出`axios`实例

```javascript
// 最终导出axios的方法，即实例的request方法
function CreateAxiosFn() {
    let axios = new Axios();
    let req = axios.request.bind(axios);
    return req;
}
// 得到最后的全局变量axios
let axios = CreateAxiosFn();
```

## SSR服务端渲染

SSR主要解决了以下两种问题：

> - seo：搜索引擎优先爬取页面`HTML`结构，使用`ssr`时，服务端已经生成了和业务想关联的`HTML`，有利于`seo`
> - 首屏呈现渲染：用户无需等待页面所有`js`加载完成就可以看到页面视图（压力来到了服务器，所以需要权衡哪些用服务端渲染，哪些交给客户端）

但是使用`SSR`同样存在以下的缺点：

-  复杂度：整个项目的复杂度 
-  库的支持性，代码兼容 
-  性能问题 

- -  每个请求都是`n`个实例的创建，不然会污染，消耗会变得很大 
  -  缓存 `node serve`、 `nginx`判断当前用户有没有过期，如果没过期的话就缓存，用刚刚的结果。 
  -  降级：监控`cpu`、内存占用过多，就`spa`，返回单个的壳 

-  服务器负载变大，相对于前后端分离服务器只需要提供静态资源来说，服务器负载更大，所以要慎重使用 

## Vue项目结构

在划分项目结构的时候，需要遵循一些基本的原则：

> - 文件夹和文件夹内部文件的语义一致性
> - 单一入口/出口
> - 就近原则，紧耦合的文件应该放到一起，且应以相对路径引用
> - 公共的文件应该以绝对路径的方式从根目录引用
> - `/src` 外的文件不应该被引入



## Vue解决跨域问题

### 跨域是什么

跨域本是浏览器基于**同源策略**的一种安全手段

同源策略（Sameoriginpolicy），是一种约定，它是浏览器最核心也最基本的安全功能

所谓同源（即指在同一个域）具有以下三个相同点

> - 协议相同（protocol）
> - 主机相同（host）
> - 端口相同（port）

反之非同源请求，也就是协议、端口、主机其中一项不相同的时候，这时候就会产生跨域

跨域是浏览器的限制

### 解决方式

### CORS

> CORS （Cross-Origin Resource Sharing，跨域资源共享）是一个系统，它由一系列传输的HTTP头组成，这些HTTP头决定浏览器是否阻止前端 JavaScript 代码获取跨域请求的响应

`CORS` 实现起来非常方便，只需要增加一些 `HTTP` 头，让服务器能声明允许的访问来源

只要后端实现了 `CORS`，就实现了跨域

![img](https://gitee.com/iLx1/resource-img/raw/master/140deb80-4e32-11eb-ab90-d9ae814b240d.png)




> 如果是通过vue-cli脚手架工具搭建项目，我们可以通过webpack为我们起一个本地服务器作为请求的代理对象

在vue.config.js文件，新增以下代码

```js
amodule.exports = {
    devServer: {
        host: '127.0.0.1',
        port: 8084,
        open: true,// vue项目启动时自动打开浏览器
        proxy: {
            '/api': { // '/api'是代理标识，用于告诉node，url前面是/api的就是使用代理的
                target: "http://xxx.xxx.xx.xx:8080", //目标地址，一般是指后台服务器地址
                changeOrigin: true, //是否跨域
                pathRewrite: { // pathRewrite 的作用是把实际Request Url中的'/api'用""代替
                    '^/api': "" 
                }
            }
        }
    }
}
```

通过axios发送请求中，配置请求的根路径

```js
axios.defaults.baseURL = '/api'
```

**`vue.config.js`**的改动如果要生效,需要进行重启服务

同时，还需要注意的是，我们同时需要注释掉 mock的加载，因为mock-server会导致代理服务的异常

```js
// before: require('./mock/mock-server.js'),  // 注释mock-server加载
```

**生产环境的跨域**

## Vue2 与 Vue3区别

https://www.yuque.com/sxd_panda/sdluga/ny2cc2#4d77f6d3

## vue-router如何重定向？

答：使用`redirect`进行重定向

```javascript
在routes:[{ path: '/a', redirect: '/b' }]
```

## vue-router有哪些组件？

答：`router-link`、`router-view`

## active-class 是哪个组件的属性？

答：router-link组件

## 怎么定义 vue-router 的动态路由? 怎么获取传过来的值？怎么获取当前的路由信息？

答：在router目录下的index.js文件中，对path属性加上/:id。 使用router对象的params.id。使用this.$router获取当前的路由信息。

### vue-router钩子函数有哪些？

### 导航守卫

1. beforeEach：全局前置守卫

**to**: 即将要进入的目标

**from**: 当前导航正要离开的路由

1. beforeResolve：全局解析守卫
2. afterEach：全局后置钩子

### 组件守卫

- beforeRouteEnter
- beforeRouteUpdate
- beforeRouteLeave

## $route 和 $router 的区别是什么？

答：$router是VueRouter的实例，在script标签中想要导航到不同的URL,使用$router.push方法。返回上一个历史history用$router.to(-1)



$route为当前router跳转对象。里面可以获取当前路由的name,path,query,parmas等。

















