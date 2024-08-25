---
title: uniapp笔记
date: 2023-06-01 14:09:30
tags:
categories:
classes: 笔记
---

## 创建工程

### 创建 uniapp 应用

```bash
// 创建以 javascript 开发的工程
npx degit dcloudio/uni-preset-vue#vite my-vue3-project-name
// 创建以 typescript 开发的工程
npx degit dcloudio/uni-preset-vue#vite-ts my-vue3-project-name
```

### 安装依赖

```bash
npm i
- cnpm i
- yarn install
```

### 安装依赖sass

```js
npm i sass
- cnpm i sass
```

### 运行h5 模块

```bash
yarn dev:h5
- npm run dev:h5
```

### 卸载不需要的包

```bash
npm uninstall vue-i18n
```

### 

## uniapp 生成二维码

#### 将 uqrcode.js 文件放在 src\utils目录

#### main.ts 文件

```ts
// 导入
import { createSSRApp } from 'vue'
import App from './App.vue'
import uQRCode from './utils/uqrcode.js'

export function createApp() {
    const app = createSSRApp(App);
    // 挂载到全局
    app.config.globalProperties.$uqrcode = uQRCode
    return {
        app
    }
}
```

### index.vue

```vue
<template>
<!-- 显示二维码 -->
  <div id="qrcodeBox" v-if="qrcodeShow">
    <canvas id="qrcode" canvas-id="qrcode" style="width: 320px; height: 320px" />
    <div id="notice">请截图保存后，进行扫描导入</div>
  </div>
</template>

<script setup lang="ts">
import { getCurrentInstance } from 'vue'
const { proxy } = getCurrentInstance() as any
// 二维码生成
const genQrcode = function (text: string) {
  try {
    proxy.$uqrcode.make({
      canvasId: 'qrcode',
      componentInstance: this,
      text: text,
      size: 320,
      margin: 0,
      backgroundColor: '#ffffff',
      foregroundColor: '#000000',
      fileType: 'jpg',
      errorCorrectLevel: proxy.$uqrcode.errorCorrectLevel.H,
      success: (res) => {
        infoShow('二维码生成成功')
      },
      fail() {
        infoShow('二维码生成失败')
      }
    })
  } catch (error) {
    console.log(error)
    infoShow('发生未知错误，生成失败，请使用文本导入')
  }
}
</script>
```



## 加密和解密

### 安装：

```bash
npm install crypto-js
```

### src/utils 目录下

```js

import CryptoJS from 'crypto-js'
 
/**
 * AES 加密
 * @param word: 需要加密的文本
 * KEY: // 需要前后端保持一致
 * mode: ECB // 需要前后端保持一致
 * pad: Pkcs7 //前端 Pkcs7 对应 后端 Pkcs5
 */
const KEY = CryptoJS.enc.Utf8.parse('d7b85f6e214abcde')
 
export const AES_Encrypt = (plaintext) => {
  let ciphertext = CryptoJS.AES.encrypt(plaintext, KEY, {
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7
  }).toString()
  return ciphertext
}
 
/**
 * AES 解密
 * @param jsonStr
 */
export const AES_Decrypt = (jsonStr) => {
  let plaintext = CryptoJS.AES.decrypt(jsonStr, KEY, {
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7
  }).toString(CryptoJS.enc.Utf8)
 
  return plaintext
}
```

### main.ts

```ts
import { AES_Encrypt, AES_Decrypt } from './utils/aes.js'
export function createApp() {
    const app = createSSRApp(App);
    // 挂载到全局
    app.config.globalProperties.$AES_Encrypt = AES_Encrypt
    app.config.globalProperties.$AES_Decrypt = AES_Decrypt
    return {
        app
    }
}
```



## uniapp 动画

### 参考文档

https://uniapp.dcloud.net.cn/api/ui/animation.html

```vue
<view id="toolBox" :animation="boxAnimate"></view>
<script setup lang="ts">
// 创建变量存放动画操作
let boxAnimate = ref({})
// 动画
onShow(() => {
  let animation = uni.createAnimation()
  proxy.animation = animation
  boxShowAnimation();
})
const boxShowAnimation = function () {
  // 调用动画操作方法后要调用 step() 来表示一组动画完成
  proxy.animation.translate(0).opacity(1).step({
    duration: 1000,
    timingFunction: 'ease'
  })
  boxAnimate.value = proxy.animation.export()
}    
</script>
```

