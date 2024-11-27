---
title: Vue3笔记
date: 2023-03-22 08:41:15
tags:
categories:
classes: 笔记
---

## 创建 Vue3 项目

### 使用 vue-cil

```sh
npm install -g @vue/cli

vue create project 
# Manually select features
# 选择 3.x
#（*）空格选择
# no history mode -> hash模式
# Standard config
# lint in save
# dedicated config files
# Sava preset(模板)
```

### 使用 vite

#### 安装

使用 NPM:

```bash
npm init vite@latest
```

使用 Yarn:

```sql
yarn create vite
```

使用 PNPM:

```sql
pnpm create vite
# or
pnpm create vite@latest
```

#### 启动项目

```sh
npm run dev
# yarn dev
# vite
```



组合 API （Composition API)

## setup

- 新的option, 所有的组合API函数都在此使用, 只在初始化时执行一次
- 函数如果返回对象, 对象中的属性或方法, 模板中可以直接使用



## ref

#### 基本类型响应式数据

> 创建一个包含响应式数据的引用(reference)对象
>
> js中操作数据: xxx.value
>
> 模板中操作数据: 不需要.value

```vue
import { ref } from 'vue'

export default {
    setup() {
        const count = ref(10)
        function updataCount() {
            count.value += 6;
        }
        // 模板中使用
        return {
            count,
            updataCount
        }
	}
}
```

### 获取元素

```vue
<div ref="divRef"></div>

<script>
const divRef = ref<HTMLElement | null>(null)
console.log(divRef.value.property)
</script>
```

### v-for ref

```vue
<template>
<div v-for="" :ref="getDom"></div>
</template>

<script>
const lis: HTMLElement[] = new Array()
const getDom = (el: HTMLElement) => lis.push(el)
</script>
```



## reactive

#### 定义多个数据响应式

> const proxy = reactive(obj): 接收一个普通对象然后返回该普通对象的响应式代理器对象
>
> 响应式转换是“深层的”：会影响对象内部所有`嵌套的属性`
>
> 内部基于 ES6 的 Proxy 实现，通过代理对象操作源对象内部数据都是响应式的

```ts
import { reactive } from 'vue'

export default {
    setup() {
        const student = reactive({
			name: 'li',
            hobby: {
               	kind: 'draw'
            }
        })
        const updataStudent = () => {
            student.name += '--'
            student.hobby.kind += '--'
        }
        return {
            student
        }
    }
}
```





## 响应式比较

-

### vue2的响应式

#### 核心:

- 对象: 通过defineProperty对对象的已有属性值的读取和修改进行劫持(监视/拦截)
- 数组: 通过重写数组更新数组一系列更新元素的方法来实现元素修改的劫持

```js
Object.defineProperty(data, 'count', {
    get () {}, 
    set () {}
})
```

#### 问题:

- 对象直接新添加的属性或删除已有属性, 界面不会自动更新
- 直接通过下标替换元素或更新length, 界面不会自动更新 arr[1] = {}

-

### Vue3的响应式

#### 核心:

- 通过Proxy(代理): 拦截对data任意属性的任意(13种)操作, 包括属性值的读写, 属性的添加, 属性的删除等...

- 通过 Reflect(反射): 动态对被代理对象的相应属性进行特定的操作

- 文档:

  https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Proxy

  https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Reflect

```js
new Proxy(data, {
	// 拦截读取属性值
    get (target, prop) {
    	return Reflect.get(target, prop)
    },
    // 拦截设置属性值或添加新属性
    set (target, prop, value) {
    	return Reflect.set(target, prop, value)
    },
    // 拦截删除属性
    deleteProperty (target, prop) {
    	return Reflect.deleteProperty(target, prop)
    }
})

proxy.name = 'tom'  
```



## setup细节

- setup执行的时机
  - 在beforeCreate之前执行(一次), 此时组件对象还没有创建
  - this是undefined, 不能通过this来访问data/computed/methods / props
  - 其实所有的composition API相关回调函数中也都不可以
- setup的返回值
  - 一般都返回一个对象: 为模板提供数据, 也就是模板中可以直接使用此对象中的所有属性/方法
  - 返回对象中的属性会与data函数返回对象的属性合并成为组件对象的属性
  - 返回对象中的方法会与methods中的方法合并成功组件对象的方法
  - 如果有重名, setup优先
  - 注意:
  - 一般不要混合使用: methods中可以访问setup提供的属性和方法, 但在setup方法中不能访问data和methods
  - setup不能是一个async函数: 因为返回值不再是return的对象, 而是promise, 模板看不到return对象中的属性数据
- setup的参数
  - setup(props, context) / setup(props, {attrs, slots, emit})
  - props: 包含props配置声明且传入了的所有属性的对象
  - attrs: 包含没有在props配置中声明的属性的对象, 相当于 this.$attrs
  - slots: 包含所有传入的插槽内容的对象, 相当于 this.$slots
  - emit: 用来分发自定义事件的函数, 相当于 this.$emit



## reactive与ref-细节

- 是Vue3的 composition API中2个最重要的响应式API
- ref用来处理基本类型数据, reactive用来处理对象(递归深度响应式)
- 如果用ref对象/数组, 内部会自动将对象/数组转换为reactive的代理对象
- ref内部: 通过给value属性添加getter/setter来实现对数据的劫持
- reactive内部: 通过使用Proxy来实现对对象内部所有数据的劫持, 并通过Reflect操作对象内部数据
- ref的数据操作: 在js中要.value, 在模板中不需要(内部解析模板时会自动添加.value)



## 计算属性

#### 只有 getter 的计算属性

```ts
const fullName = computed(() => {
	return user.fistName + '-' + user.lastName
})
```

#### 有 getter 和 setter 的计算属性

```ts
const fullName = computed({
	get() {
        return user.fistName + '-' + user.lastName
    },
    set(value: string) {
        const names = value.split('-')
        user.firstName = names[0]
        user.lastName = names[1]
    }
})
```



## 监视

```ts
watch(user, () => {
	const name = user.firstName + '-' + user.lastName
}, {
   	immediate: true,
    deep: true
})
// 默认立即开始监视
 watchEffect(() => {
    fullName3.value = user.firstName + '-' + user.lastName
}) 
```

### 对reactive数据的某个属性进行监听



#### 对某个属性进行监听

```ts
watch(()=>person.name,(newValue,oldValue)=>{
    console.log(newValue,oldValue);
},{immediate:true,deep:true})
```



#### 对两个及以上的reactive属性进行监听

```ts
watch([()=>person.name,()=>person.age],(newValue,oldValue)=>{
    console.log(newValue,oldValue);
},{immediate:true,deep:true})
```



## 生命周期

**与 2.x 版本生命周期相对应的组合式 API**

- `beforeCreate` -> 使用 `setup()`
- `created` -> 使用 `setup()`
- `beforeMount` -> `onBeforeMount`
- `mounted` -> `onMounted`
- `beforeUpdate` -> `onBeforeUpdate`
- `updated` -> `onUpdated`
- `beforeDestroy` -> `onBeforeUnmount`
- `destroyed` -> `onUnmounted`
- `errorCaptured` -> `onErrorCaptured`

**新增的钩子函数**

组合式 API 还提供了以下调试钩子函数：

- onRenderTracked
- onRenderTriggered

```ts
import {
  ref,
  onMounted,
  onUpdated,
  onUnmounted, 
  onBeforeMount, 
  onBeforeUpdate,
  onBeforeUnmount
} from "vue"
```



- 利用TS泛型强化类型检查
- 封装发ajax请求的hook函数

```ts
import { ref } from 'vue'
import { axios } from 'axios'

export const getUser<T> = (url: string) => {
    const result = ref<T | null>(null)
    const loading = ref(true)
    const errorMsg = ref(null)
    axios.get(url)
    .then(response => {
 		result.value = response.data
        loading.value = false
    })
    ,catch(error => {
        loading.value = false
        errorMsg.value = error.message || "未知错误"
    })
    return {
		loading,
        result,
        errorMsg
    }
}
```



## toRefs

把一个响应式对象转换成普通对象，该普通对象的每个 property 都是一个 ref

应用: 当从合成函数返回响应式对象时，toRefs 非常有用，这样消费组件就可以在不丢失响应式的情况下对返回的对象进行分解使用

问题: reactive 对象取出的所有属性值都是非响应式的（解构后非响应）

解决: 利用 toRefs 可以将一个响应式 reactive 对象的所有原始属性转换为响应式的 ref 属性



```ts
import { ref, reactive } from 'vue'
setup() {
    const state = reactive({
        name: 'l',
        age: 121
    })
    const { name, age } = toRefs(state)
}
```



## ref获取元素

操作 dom

```vue
<template>
	<input type="text" ref="inpRef" >
</template>

export default {
	setup() {
		const inpRef = ref<HTMLElement | null>(null)
            onMounted() {
            inpRef.value && inpRef.value.focus()
        }
        return {
            inpRef        
        }
	}
}
```

## hallowReactive 与 shallowRef

- shallowReactive : 只处理了对象内最外层属性的响应式(也就是浅响应式)
- shallowRef: 只处理了value的响应式, 不进行对象的reactive处理
- 什么时候用浅响应式呢?
  - 一般情况下使用ref和reactive即可
  - 如果有一个对象数据, 结构比较深, 但变化时只是外层属性变化 ===> shallowReactive
  - 如果有一个对象数据, 后面会产生新的对象来替换 ===> shallowRef



## readonly 与 shallowReadonly

- readonly:
  - 深度只读数据
  - 获取一个对象 (响应式或纯对象) 或 ref 并返回原始代理的只读代理。
  - 只读代理是深层的：访问的任何嵌套 property 也是只读的。
- shallowReadonly
  - 浅只读数据
  - 创建一个代理，使其自身的 property 为只读，但不执行嵌套对象的深度只读转换
- 应用场景:
  - 在某些特定情况下, 我们可能不希望对数据进行更新的操作, 那就可以包装生成一个只读代理对象来读取数据, 而不能修改或删除



## toRaw 与 markRaw

- toRaw
  - 返回由 `reactive` 或 `readonly` 方法转换成响应式代理的普通对象。
  - 这是一个还原方法，可用于临时读取，访问不会被代理/跟踪，写入时也不会触发界面更新。
- markRaw
  - 标记一个对象，使其永远不会转换为代理。返回对象本身
  - 应用场景:
    - 有些值不应被设置为响应式的，例如复杂的第三方类实例或 Vue 组件对象。
    - 当渲染具有不可变数据源的大列表时，跳过代理转换可以提高性能。



## toRef

- 为源响应式对象上的某个属性创建一个 ref对象, 二者内部操作的是同一个数据值, 

  更新时二者是同步的（相当于引用）

- 区别ref: 拷贝了一份新的数据值单独操作, 更新时相互不影响

- 应用: 当要将 某个prop 的 ref 传递给复合函数时，toRef 很有用

```ts
setup() {
    const state = reactive({
        foo: 'name'
    })
    const foo = toRef(state, 'foo')
    return {
        foo
    }
}
```



## customRef

- 创建一个自定义的 ref，并对其依赖项跟踪和更新触发进行显式控制（控制更新页面的时机）
- 需求: 使用 customRef 实现 debounce 的示例

```tsx
// 实现延迟更改
<template>
	<input v-model="userRef">
</template>
export default {
	const userRef = userDevouncedRef('', 200)
	return {
		userRef
	}
}
// 实现函数防抖的自定义 ref
function userDevouncedRef<T>(value: T, dalay = 200) {
	let timeout: number
    return customRef((track, trigger) => {
        return {
            get() {
                // 追踪数据
                return value
            },
            set(newValue: T) {
                clearTimeout(timeout)
                timeout = setTimeout(() => {
                   	value = newValue
                    // 告诉 Vue 触发界面更新
                    trigger()
                }, delay)
            }
        }
    })
}
```







# 组件间传值

## props & emit

### 子组件

```vue
<script setup="props, {emit}">
	const props = defineProps({
        msg: {
            type: Stirng,
            default: () => "default"
        }
    })
    const msg = ref(props.msg)
    // emits
    const emits = defineEmits(['method'])
    emits('method', params)
</script>
```

### 父组件

```vue
<template>
  <child-components @method="handleAdd"></child-components>
</template>

<script setup>
import { ref } from 'vue'
import ChildComponents from './child.vue'
const list = ref(['JavaScript', 'HTML', 'CSS'])
// add 触发后的事件处理函数
const handleAdd = value => {
  list.value.push(value)
}
</script>
```

### v-model

```vue
<ChildComponent v-model:title="pageTitle" />
// 就是下面这段代码的简写形势
<ChildComponent :title="pageTitle" @update:title="pageTitle = $event" />
```

#### 子组件

```vue
<template>
  <div>
    <input v-model="value" placeholder="请输入"/>
    <button @click="handleAdd" type="button">添加</button>
  </div>
</template>
<script setup>
import { ref, defineEmits, defineProps } from 'vue'
const value = ref('')
const props = defineProps({
  list: {
    type: Array,
    default: () => [],
  },
})
const emits = defineEmits(['update:list'])
// 添加操作
const handleAdd = () => {
  const arr = props.list
  arr.push(value.value)
  emits('update:list', arr)
  value.value = ''
}
</script>
```

#### 父组件

```vue
<template>
  <!-- 父组件 -->
  <ul >
    <li  v-for="i in list" :key="i">{{ i }}</li>
  </ul>
  <!-- 子组件 -->
  <child-components v-model:list="list"></child-components>
</template>
<script setup>
import { ref } from 'vue'
import ChildComponents from './child.vue'
const list = ref(['JavaScript', 'HTML', 'CSS'])
</script>
```

#### 使用 v-model 传递对象

```vue
<script setup>
import { reactive, watch } from 'vue'

// 默认配置
const defaultConfig = {
  switchValue: 0,
  switchText: 'text',
  switchDesc: 'desc',
}

// 默认样式
const defaultPattern = {
  textMargin: '20px',
  boxMargin: '20px',
}

const props = defineProps({
  config: {
    type: Object,
    default: () => ({}),
  },
  pattern: {
    type: Object,
    default: () => ({}),
  },
})

const emit = defineEmits(['update:config'])

/********************************************************************************
 * @brief: 配置副本
 ********************************************************************************/
const switchConfig = reactive({ ...defaultConfig, ...props.config })

watch(
  switchConfig,
  () => {
    emit('update:config', { ...switchConfig })
  },
  { deep: true }
)
    
/********************************************************************************
 * @brief: 样式副本
 ********************************************************************************/
const switchPattern = reactive({ ...defaultPattern, ...props.pattern })
</script>
```



## 父调用子

子组件默认不对外暴露数据，我们需要用到defineExpose({})

子组件对外暴露之后，父组件才能调用

```ts
defineExpose({
  list2
})
```

## provide 与 inject

provide`和`inject`提供依赖注入，功能类似 2.x 的`provide/inject

#### 实现跨层级组件(祖孙)间通信

```ts
// 父组件
/*<template>
	<son />
  <template/>
*/
import { ref, provide } from 'vue'
setup() {
    const color = ref('red')
    provide('color', color)
    return {
        color
    }
}

// 子/子孙组件
import { inject } from 'vue'
setup() {
    const color = inject('color')
    return {
        color
    }
}
```

# 路由传值

可以使用`router.push`方法来传递参数给路由，这些参数可以是`query`或`params`类型。`query`参数会附加在URL后面，通常用于非敏感信息的传递；而`params`参数则包含在路由路径中，适合传递敏感信息或路由特定的参数

## 参数传值

### query

```vue

<template>
 <button @click="navigateToUser">Navigate with Query</button>
</template>
 
<script setup>
import { useRouter } from 'vue-router';
 
const router = useRouter();
 
function navigateToUser() {
 router.push({
    path: '/user',
    query: { id: 123, name: 'John Doe' }
 });
}

```

### params

```vue
<template>
 <button @click="navigateToUserParam">Navigate with Params</button>
</template>
 
<script setup>
import { useRouter } from 'vue-router';
 
const router = useRouter();
 
function navigateToUserParam() {
 router.push({
    name: 'User',
    params: { id: 123 }
 });
}
</script>
```

### 接收路由参数

```vue
<template>
 <p>User ID: {{ $route.query.id }}</p>
 <p>User Name: {{ $route.query.name }}</p>
 <!-- 或者 -->
 <p>User ID: {{ $route.params.id }}</p>
</template>
 
<script setup>
import { useRoute } from 'vue-router';
 
const route = useRoute();
console.log(route) // 包含query & params的参数
</script>
```

## 路由组件方式传值

### 1. 配置路由

```js
// router/index.js
import { createRouter, createWebHistory } from 'vue-router';
import User from '../views/User.vue';
 
const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/user/:id',
      component: User,
    },
  ],
});
 
export default router;
```

### 2. 组件使用

```vue

<!-- views/User.vue -->
<template>
  <div>
    <h1>User Information</h1>
    <p>User ID: {{ userId }}</p>
  </div>
</template>
 
<script setup>
import { useRoute } from 'vue-router';
 
const route = useRoute();
const userId = route.params.id;
</script>
```

### 3. 导航到动态路由

```vue
<!-- components/SomeComponent.vue -->
<template>
  <button @click="goToUser">Go to User</button>
</template>
 
<script setup>
import { useRouter } from 'vue-router';
 
const router = useRouter();
 
function goToUser() {
  router.push({ path: '/user/123' });
}
</script>

// or 

<!-- components/SomeComponent.vue -->
<template>
  <router-link :to="{ path: '/user/123' }">Go to User</router-link>
</template>
```



# 自定义指令

如果是在`setup`定义组件内的指令，有一个语法糖可以使用：

任何以v开头的驼峰式命名的变量都可以被用作一个自定义指令，然后在模板中使用。

```vue
<script setup> 
	const vFocus = {
        mounted: (el) => el.focus()
    }
</script>
```

如果是使用选项式，则自定义指令需要在`directives`选项中注册

```vue
<script> 
	export default {
        setup() {},
        derectives: {
            focus: {
                mounted(el) {
                    el.focus()
                }
            }
        }
    }
</script>
```

```ts
// 自定义复制指令
const vCopy = {
  mounted: (el: any, { value }: any) => {
    el.$value = value
    el.handler = () => {
      if (!el.$value) {
        infoShow('内容为空')
        return
      }
      uni.setClipboardData({
        data: el.$value,
        success() {
          infoShow('复制成功')
        },
        fail() {
          infoShow('复制失败')
        },
        showToast: false
      })
    }
    //绑定事件
    el.addEventListener('click', el.handler)
  },
  //当传进来的值更新的时候触发
  updated(el, { value }) {
    el.$value = value
  },
  //指令与元素解绑的时候
  unMounted(el) {
    el.removeEventListener('click', el.handler)
  }
}
```





# 响应式数据的判断

- isRef: 检查一个值是否为一个 ref 对象
- isReactive: 检查一个对象是否是由 `reactive` 创建的响应式代理
- isReadonly: 检查一个对象是否是由 `readonly` 创建的只读代理
- isProxy: 检查一个对象是否是由 `reactive` 或者 `readonly` 方法创建的代理



# 手写组合 API 

```ts
const reactiveHandler = {
  get (target, key) {

    if (key==='_is_reactive') return true

    return Reflect.get(target, key)
  },

  set (target, key, value) {
    const result = Reflect.set(target, key, value)
    console.log('数据已更新, 去更新界面')
    return result
  },

  deleteProperty (target, key) {
    const result = Reflect.deleteProperty(target, key)
    console.log('数据已删除, 去更新界面')
    return result
  },
}

/* 
自定义shallowReactive
*/
function shallowReactive(obj) {
  return new Proxy(obj, reactiveHandler)
}

/* 
自定义reactive
*/
function reactive (target) {
  if (target && typeof target==='object') {
    if (target instanceof Array) { // 数组
      target.forEach((item, index) => {
        target[index] = reactive(item)
      })
    } else { // 对象
      Object.keys(target).forEach(key => {
        target[key] = reactive(target[key])
      })
    }

    const proxy = new Proxy(target, reactiveHandler)
    return proxy
  }

  return target
}

/*
自定义shallowRef
*/
function shallowRef(target) {
  const result = {
    _value: target, // 用来保存数据的内部属性
    _is_ref: true, // 用来标识是ref对象
    get value () {
      return this._value
    },
    set value (val) {
      this._value = val
      console.log('set value 数据已更新, 去更新界面')
    }
  }

  return result
}

/* 
自定义ref
*/
function ref(target) {
  if (target && typeof target==='object') {
    target = reactive(target)
  }

  const result = {
    _value: target, // 用来保存数据的内部属性
    _is_ref: true, // 用来标识是ref对象
    get value () {
      return this._value
    },
    set value (val) {
      this._value = val
      console.log('set value 数据已更新, 去更新界面')
    }
  }
  return result
}
```



# Pinia

## 安装

```sh
yarn add pinia
# 或者使用 npm
npm install pinia
```

## 项目导入 pinia 

```sh
import { createPinia } from 'pinia'

createApp(App).use(router).use(createPinia()).mount('#app')
```



## stores/counter.js

#### 第一种

```ts
import { defineStore } from 'pinia'

export const useCounterStore = defineStore('counter', {
  state: () => {
    return { count: 0 }
  },
  /* 
   * 也可以定义为
   * state: () => ({ count: 0 })
  */  
  getters: {
    doubleCount: (state) => state.count * 2,
  },
  actions: {
    increment() {
      this.count++
    },
  },
})
```

#### 第二种

```js
import { defineStore } from 'pinia'

export const useCounterStore = defineStore('counter', () => {
    const count = ref(0)
    const doubleCount = computed(() => count.value * 2)
  	const increment = () => {
    	count.value++
  	}
  	return { count, name, doubleCount, increment }
})
```



## state的五种方式修改值

```ts
state的五种方式修改值
// 1.直接修改值
Test.current=2
// 2.通过$patch修改,支持单个或多个属性修改
Test.$patch({current:33})
// 3.$patch工厂函数方式
Test.$patch((state) => {
  state.current = 99;
  state.name = '范迪塞尔'
})
// 4.$state 缺点是必须修改整个对象
Test.$state = { current: 88, name: '123' }
// 5.action
Test.setCurrent()
```

