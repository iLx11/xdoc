# ELECTRON+VUE

### 项目模板

https://github.com/iLx11/electron-vue3-template

# 创建项目

## 创建 vue3 项目(vite)

```bash
npm create vite@latest

# -- Vue
# -- Customize with create-vue
# -- Typecript -> Yes
# -- JSX Support -> No
# -- Router xxxx -> Yes
# -- Pinia -> Yes
# -- Vitest xxxx -> No
# -- End ot End -> No
# -- ESlint -> Yes
# -- Prettier -> Yes

cd <project-name>

npm install
npm run dev
```

## 加入 electron

```bash
npm install electron --save-dev
```

## 新建 electron / main 目录

###  electron / main/main.js

electron 的入口文件，创建主窗口并监听事件

```jsx
const { app, protocol, BrowserWindow, globalShortcut } = require('electron')
// 需在当前文件内开头引入 Node.js 的 'path' 模块
const path = require('path')
 
app.commandLine.appendSwitch("--ignore-certificate-errors", "true");
// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([
    { scheme: "app", privileges: { secure: true, standard: true } }
]);
 
const createWindow = () => {
    const win = new BrowserWindow({
        minWidth: 960,
        minHeight: 540,
        width: 960,
        height: 540,
        // 窗口是否在屏幕居中. 默认值为 false
        center: true,
        // 设置为 false 时可以创建一个无边框窗口 默认值为 true。
        frame: false,
        // 窗口的透明属性
        transparent: true,
        // 窗口是否在创建时显示。 默认值为 true。
        show: true,
        webPreferences: {
            nodeIntegration: true,
            nodeIntegrationInWorker: true,
            preload: path.join(__dirname, 'preload.js'),
            webSecurity: false,
        }
    })
    win.setMenu(null)
    if (app.isPackaged) {
        win.loadURL(`file://${path.join(__dirname, '../dist/index.html')}`)
    } else {
        win.loadURL('http://127.0.0.1:5173/')
		// 如果显示白屏则使用下面的地址
        // win.loadURL('http://localhost:5173/')
        win.webContents.openDevTools()
    }
    globalShortcut.register("CommandOrControl+Shift+i", function () {
        win.webContents.openDevTools();
    });
 
}
 
app.whenReady().then(() => {
 
    createWindow()
 
    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow()
    })
})
 
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
})
```

### electron / main/preload.js

渲染进程与主进程以此文件为媒介进行交流

```jsx
const { contextBridge, ipcRenderer } = require('electron')

// 最小化
const minimizeWindow = () => {
  ipcRenderer.send('window-min')
}

// 最大化
const maximizeWindow = () => {
  ipcRenderer.send('window-max')
}

// 关闭窗口
const closeWindow = () => {
  ipcRenderer.send('window-close')
}

// 裁剪图片
const resizeImage = async (resizeWidth, resizeHeight, editorPicData) => {
  const data = await ipcRenderer.invoke('pic-data-editor', resizeWidth, resizeHeight, editorPicData)
  return data
}

// 生成数据
const generateResultArray = async ( picData, configArray0,  configArray1, configArray2, configArray3) => {
  const data = ipcRenderer.invoke('pic-data-parse', picData, configArray0,  configArray1, configArray2, configArray3)
  return data
}

contextBridge.exposeInMainWorld('myApi', {
  minimizeWindow,
  maximizeWindow,
  closeWindow,
  resizeImage,
  generateResultArray
})
// 所有的 Node.js API接口 都可以在 preload 进程中被调用.
// 它拥有与Chrome扩展一样的沙盒。
window.addEventListener('DOMContentLoaded', () => {
  const replaceText = (selector, text) => {
    const element = document.getElementById(selector)
    if (element) element.innerText = text
  }

  for (const dependency of ['chrome', 'node', 'electron']) {
    replaceText(`${dependency}-version`, process.versions[dependency])
  }
})

```



### 在 package.json 引入 electron 的入口文件 main.js



```json
"name": "xxxxxx",
"version": "1.0.0",
"private": true,
"main": "electron/main/main.js", // here
"author": "iLx1",
"description": "xxxxxxxx",
"scripts": {
    "start": "vite | electron .",
    "dev": "vite",
    "build": "run-p type-check \"build-only {@}\" --",
    "preview": "vite preview",
    "build-only": "vite build",
    "type-check": "vue-tsc --noEmit -p tsconfig.app.json --composite false",
    "electron:build": "vite build && electron-builder"
},
......
```



执行下面命令看显示的效果

```shell
pnpm start / npm run start
```





## 创建 electron/controller

### 窗口工具的监听与执行

electron/controller/windowControl.js

```js
const { ipcMain, BrowserWindow } = require('electron')
// 最小化
ipcMain.on('window-min', event => {
  const webContent = event.sender
  const win = BrowserWindow.fromWebContents(webContent)
  win.minimize()
})

// 最大化
ipcMain.on('window-max', event => {
  const webContent = event.sender
  const win = BrowserWindow.fromWebContents(webContent)
  if (win.isMaximized()) {
    win.restore()
  } else {
    win.maximize()
  }
})

// 关闭
ipcMain.on('window-close', event => {
  const webContent = event.sender
  const win = BrowserWindow.fromWebContents(webContent)
  win.close()
})
```

### 在 main.js 入口文件中引入进行监听

main.js

```js
require('../controller/windowControl.js')
```



### 系统托盘

electron/controller/tray.js

```js
// 创建系统托盘
const { Tray, Menu } = require('electron')
// const { ipcRenderer } = require('electron')
const path = require('path')

const createTray = (app, win) => {
  let tray = new Tray(path.join(__dirname, '../public/favicon.ico'))
  // if (process.env.NODE_ENV === 'development') {
  // tray = new Tray(path.join(__dirname, '../public/favicon.ico'))
  // } else {
  // tray = new Tray(path.join(path.dirname(app.getPath('exe')), '/resources/public/logo.ico'))
  // }
  tray.setToolTip('xxxxx') // 鼠标放在托盘图标上的提示信息
  tray.on('click', (e) => {
    if (e.shiftKey) {
      app.quit()
    } else {
      win.show()
    }
  })
  tray.setContextMenu(
    Menu.buildFromTemplate([
      {
        label: '退出',
        click: () => {
          app.quit()
        }
      }
    ])
  )
}
module.exports = createTray
```

main.js

```js
require('../controller/tray.js')

const createWindow = () => {
    ...
    createTray(app, win)
}

```



# vite-plugin-electron 构建

该包集成了`Vite`和`Electron`，比如使用它之后可以让我们方便的在渲染进程中使用`Node API`或者`Electron API`，或者 vite 热更新 electron

详细使用用法可以去官网学习：[vite-plugin-electron](https://link.juejin.cn/?target=https%3A%2F%2Flink.zhihu.com%2F%3Ftarget%3Dhttps%3A%2F%2Fgithub.com%2Felectron-vite%2Fvite-plugin-electron)。

### 下载插件

```bash
npm install vite-plugin-electron -D
```

### 将 main 文件与 preload 文件修改为 `ts`  后缀

### 配置 `vite.config.ts` 

```tsx
import electron from 'vite-plugin-electron'

plugins: [
    // optimizer(getReplacer()),
    vue(), 
    electron({
      main:{
        // 入口文件的路径
        entry: "electron/main/main.ts",
        vite: {
          build: {
            // 将入口文件转为 js 后输出到指定目录
            outDir: "appDir/main"
          }
        }
      },
      preload: {
        // 预加载文件的绝对路径 
        input: path.join(__dirname, "./electron/main/preload.ts"), // 预加载文件
        vite: {
          build: {
            // 将预加载文件转为 js 后输出到指定目录
            outDir: "appDir/preload"
          }
        }
      }
    })
  ],
```

### 配置 `package.json`

```json
{
  "name": "app-name",
  "version": "0.0.1",
  "private": true,
  "main": "appDir/main/main.js",
  "author": "iLx1",
  "description": "description",
   ...
    
    "files": [
        "./dist",
        "./electron",
        // 入口文件与预加载文件输出的目录
        "./appDir"
    ],
}
```

### 在 main 中通过 import 来导入开发的不同模块



# 基础开发

## API

https://www.electronjs.org/zh/docs/latest/api/app

## 点击穿透透明区域

setIgnoreMouseEvents 可以使窗口忽略窗口内的所有鼠标事件

设置以下参数，只有点击会穿透窗口，鼠标移动则会正常触发

```js
setIgnoreMouseEvents(true, {forward: true})
```

在 App.vue 组件增加 mounted 钩子函数

```js
mounted() {
    const remote = require("electron").remote;
    let win = remote.getCurrentWindow();
    window.addEventListener("mousemove", event => {
        // 根元素 html
        let flag = event.target === document.documentElement;
        if(flag) {
            win.setIgnoreMouseEvents(true, {forward: true});
        } else {
            win.setIgnoreMouseEvents(false);
        }
    });
    win.setIgnoreMouseEvents(true, { forward: true});
}
```

给 html body 设置

```css
pointer-events: none;
```

给 app 设置

```css
pointer-events: auto;
```



# 窗口控制

## 阻止窗口关闭

```js
window.onbeforeunload = function() {
    const remote = require("electron").remote;o
    let win = remote.getCurrentWindow();
    win.destroy;
}
```

## 多窗口资源竞争

使用 Node.js 提供 `fs.watch`   来监视文件变化

## 模拟窗口与子窗口

打开模拟窗口

```js
const remote = require("electron").remote;
this.win = new remote.BrowerWindow({
    parent: remote.getCurrentWindow(),
    // 模态窗口会禁用父窗口
    modal: true,
    webPreferences: {
        nodeIntegration: true
    }
})
```



# 页面内容

### 获取 webContents

```js
let webContent = win.webContents;
```

### 获取激活状态的实例

```js
const {webContents} = requitre('electron')
let webContent = webContents.getFocusedWebContents();
```

### 获取当前窗口的 webContents 

```js
let webContent = remote.getCurrentWebContents();
```

### 根据 id 获取窗口

```js
let webContent = webContents.fromId(yourId);
```

### 遍历所有对象

```js
let webContentArr = webContents.getAllWebContents();
```



# 页面容器

## webview

可以通过此标签在网页中嵌入另一个网页的内容

```html
<webview id="id_" src="xxxxx"></webview>
```

此标签默认不可用，需要在创建窗口时，设置 webviewTag 属性

```js
webPreference: {
    webviewTag: true
}
```

## BrowserView

子窗口的形式，依托于 BrowserWindow 存在，可以绑定在具体区域，像其中的一个元素一样

```js
let view = new BrowserView({
    webPreferences: {preload}
});
win.setBrowserView(view);
let size = win.getSize();
view.setBounds({
    x: 0,
    y: 60,
    width: size[0],
    height: size[1] - 60
});
view.setAutoResize({
    width: true,
    height: true
});
view.webContents.loadURL(url);
```



# 页面动效

## javascript 控制动画

动画对象可以 pause() play() reverse() onfinish

```js
let keyframe = [{
   	transform: "xxx",
    opacity: 0
}, {
    xxxx
}]
let options = {
    iterations: 1,
    delay: 0,
    duration: 800,
    easing: "ease"
}
let animationObj = document.querySelector(".xx").animate(keyframes, options);
```

## vue3 与 ts 控制

```tsx
const popBoxShow = ref<boolean>(false)
const popBoxRef = ref<HTMLElement | null>(null)
const popBoxText = ref<string>('')

let timer: any

const showPop = (text: string) => {
  popBoxShow.value = true
  popBoxText.value = text
  if (timer) {  
    clearTimeout(timer)
  }
  timer = setTimeout(() => {
    const backAnimationEffect = new KeyframeEffect(
      (popBoxRef as any).value, // element to animate
      [
        {
          width: '30%',
          opacity: '100%', 
          top: '10%'
        },
        {
          width: '26%',
          opacity: '100%', 
          top: '10%',
          height: '50px'
        },
        {
          width: '35%',
          opacity: '0%',
          top: '8%',
          height: '30px'
        }
      ],
      {
        duration: 250
      } // keyframe options
    )
    const backAnimation = new Animation(backAnimationEffect, document.timeline)
    backAnimation.play()
    backAnimation.onfinish = () => {
      popBoxShow.value = false
    }
  }, 2000)
}

defineExpose({
  showPop
})
```



# 数据

## 本地文件持久化存储

### 存储在用户数据目录

```
win: C:\Users\[your user name]\AppData\Roaming
mac: /Users/[]/Library/Application Support/
Linux: /home/[]/.config/xiangxuema
```

可以获取路径

```js
app.getPath("userData");
```

### 通过传入参数不同，可以获取不同用途路径

**home destop documents downloads pictures music video**

- temp -> 临时文件夹
- exe  -> 当前执行程序的路径
- appData -> 用户个性化数据的目录
- userData -> 是 appData 加应用名的路径，是子路径

### Node.js 获取

- require('os').homedir()
- require('os').tmpdir()

### 设置路径

```js
app.setPath('appData', 'D:\\xxx\\xxx')
```



## 读写本地文件

### 写入

```js
let fs = require("fs-extra")
let path = require("path")

let dataPath = app.getPath("userData")
dataPath = path.join(dataPath, "test.data")
fs.writeFileSync(dataPath, yourData, {encoding: 'utf8'})
```

### 读取

```js
let fs = require("fs-extra")
let path = require("path")

let dataPath = app.getPath("userData")
dataPath = path.join(dataPath, "test.data")
let yourData = fs.readFileSync(dataPath, {encoding: 'utf8'})
```



## 第三方持久化数据

### lowdb

基于 Lodash 的小巧 JSON 数据库

```js
// 创建数据库访问对象
const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')

const adapter = new FileSync('db.json')
const db = low(adapter)
// 查找数据
db.get('posts').find({id: 1}).value();
// 更新数据
db.get('posts').find({title: 'low'}).assign({
    title: 'hi'
}).write();
// 删除数据
db.get('posts').remove({
    title: 'low'
}).write();
// 排序数据
db.get('posts').filter({
    published: true
}).sortBy('views').take(5).value();
```

### electron-store

```js
const Store = require('electron-store')
const store = new Store()

store.set('key', 'value')
store.get('key')
```



# 系统

## 系统对话框

### 文件对话框

```js
const {dialog, app} = require("electron").remote

let filePath = await  dialog.showOpenDialog({
	title: "选择一个文件",
    buttonLabel: "打开文件",
    // 默认打开路径
    defaultPath: app.getPath('pictures'),
    // 多选文件 可以是 'openFile', 'openDirectory', 'multiSelections'
    properties: "multiSelections",
    // 限制文件类型
    filters: [
        // 文件类型
        {name: "图片", extensions: ["jpg", "png", "gif"]},
        {name: "视频", extensions: ["xxx", "xxx", "xxx"]},
    ]
})
// 拿到文件路径可以进行读写操作
```

### 保存文件

```js
// 保存文件
const saveConfigFile = async () => {
  const savePath = await dialog.showSaveDialog({
    title: '保存文件',
    defaultPath: 'config.json', // 默认文件名
    buttonLabel: '保存',
    filters: [
      { name: 'Text Files', extensions: ['txt'] },
      { name: 'All Files', extensions: ['*'] },
    ],
  })
  // 如果没有取消
  if(!savePath.canceled) {
    console.info(savePath.filePath)
  }
}
```



## 菜单

### 窗口菜单

#### 可以设置属性隐藏

```js
let win = new BrowserWindow({
    webPreferences: {nodeIntergration: true},
    // 隐藏系统菜单
    autoHideMenuBar: true
})
```

#### 自定义菜单，覆盖自带

```js
let Menu = require('electron').Menu

let templateArr = [{
    label: '菜单 1',
    submenu: [{label: "菜单 1 - 1"}]
},{
    label: '菜单 1',
    submenu: [{label: "菜单 1 - 1"}]
}]
let menu = Menu.buildFromTemplate(templateArr)
Menu.setApplactionMenu(menu)
```

### 自定义右键菜单

写完 html 与 css 之后用 js 关联响应

```js
window.oncontextmenu = function(e) {
    e.preventDefault()
    const menu = document.querySelector("#xxx")
    menu.style.left = e.clientX + 'px'
    menu.style.top = e.clientY + 'px'
    menu.style.display = 'block'
}
window.onclick = function(e) {
    document.querySelector('#xxx').style.display = 'none'
}
```

### 系统右键菜单

```js
let {Menu} = require('electron').remote

let menu = Menu.buildFromTemplate([
    {
        label: "",
    	click() {
            console.log("xxx")
        }
    }
])
window.oncontextmenu = function(e) {
    e.preventDefault()
    menu.popup()
}
```

## 快捷键

### 监听快捷键

```js
window.onkeydown = function() {
	if((event.ctrlKey || event.metakey) && xxxxx))
}
```

### 监听全局按键事件

在非激活状态下也能监听到用户按键

```js
const {globalShortcut} = require('electron')
globalShortcut.register('CommandOrControl+K', () => {
    console.log("按键监听")
})

// 取消注册快捷键
globalShortcut.unregister
```

## 托盘图标

### 托盘图标闪烁

设置托盘

```js
let {app, BrowserWindow, Tray} = require('electron')
let path = require('path')

let tray
app.on('ready', () => {
    let iconPath = path.join(__dirname, 'icon.png')
    tray = new Tray(iconPath)
})
```

托盘闪烁

```js
let iconPath2 = path.join(__dirname, 'icon2.png')
let flag = true
setInterval(() => {
	if(flag) {
        tray.setImage(iconPath2)
        flag = false
    } else {
        tray.setImage(iconPath)
        flag = true
    }
},600)
```

### 响应事件

```js
// double-click right-click
tray.on('click', () => {
    win.show()
})
```

### 托盘注册菜单

```js
let {Tray, Menu} = require('electron')
let menu = Menu.buildFromTemplate([
    {
        click() {
            win.show()
        },
        label: '显示窗口',
        type: 'normal'
	},
    {
		click() {
            app.quit()
        },
        label: '退出应用',
        type: 'normal'
    }
}])
tray.setContextMenu(menu)
```

## 剪切板

### 剪切板写入文本和 HTML

```js
let {clipboard} = require("electron")

clipboard.writeText("你好")
clipboard.writeHTML("<h1>你好</h1>")
```

### 图片写入剪切板

```js
let path = require("path")
let {clipboard, nativeImage} = require("electron")

let imgPath = path.join(__static, "icon.png")
let img = nativeImage.createFromPath(imgPath)
clipboard.writeImage(img)
```

### 清除剪切板的数据

```js
clipboard.clear()
```

### 剪切板读取文本和 HTML

```js
clipboard.readText()
clipboard.readHTML()
```

### 读取显示剪切板的图片

```js
let img = clipboard.readImage()
let dataUrl = img.toDataURL()
let imgDom = document.createElement('img')
imgDom.src = dataUrl
document.body.appendChild(imgDom)
```

### 剪切板如果是文件

可以获取文件路径

```js
// win
let filePath = clipboard.readBuffer('FileNameW').toString('ucs2')
filePath = filePath.replace(RegExp(String.fromCharCode(0), 'g'), '')
// mac
var filePath = clipboard.read('public.file-url').replace('file://', '')
```

或者借助 `clipboard-files`  Node.js 模块

```js
const clipboard = require('clipboard-files')
let fileNames = clipboard.readFiles()
```



## 系统通知

### HTML API 发送系统通知

首先需要获取用户授权，在渲染进程中可以不需要授权，直接创建实例

```js
Notification.requestPermission(function(status) {
    if(status === "granted") {
        let notification = new Notification('新的信息', {
            body: '消息内容'
        })
    } else {
        // 拒绝授权
    }
})
```

如果点击通知就会触发

```js
notification.onclick = function() {
    console.log('xxx')
}
```

### 主进程发送系统通知

可以多次调用显示同样通知，click 事件不能用 onclick 注册

```js
const {Notification} = require("electron").remote

let notification = new Notification({
    title: "消息",
   	body: "消息正文"
})
notification.show()
notification.on("click", () => {
    console.log("点击了消息")
})
```

## 使用默认应用打开文件

```js
const {shell} = require("electron")

// 打开 URL 链接
shell.openExternal("http://xxx")
```

### word 文档或其他系统注册默认程序的文件

是一个同步方法，可能会阻塞执行

```js
let openFlag = shell.openItem("D:\\xxx\\xxx.docx")
```

### 把文件移入垃圾箱

```js
let delFlag = shell.moveItemToTrash("D:\\xx\\")
```

## 接受拖拽到窗口的文件

### HTML5 API

```js
document.addEventListener('dragover', ev => {
    // 保证 drop 事件正确触发
    ev.preventDefault()
})
document.addEventListener('drop', ev => {
    // File 数组
    console.log(ev.dataTransfer.files)
    ev.preventDefault()
})
```

#### 读取拖拽的文件

```js
let fr = new FileReader()
fr.onload = () => {
    var buffer = new Buffer.from(fr.result)
    fs.writeFile(newFilePath, buffer, err => {
        // 保存
    })
}
fr.readAsArrayBuffer(fileObj)
// fr.readAsText() -> 文本方式
// fr.readAsDataURL() -> base64
// fr.readAsBinaryString() -> 二进制
```

## 最近打开的文件

### API 实现功能

```js
app.addRecentDocument('C:\XXX\XXX')
```

### 清空最近打开的文件列表

```js
app.clearRecentDocuments();
```



# 通信

## 与 Web 服务器通信

### 禁用同源实现跨域

Node.js 访问

```js
let https = require("https")

let url = "https://xxxxx"
https.get(url, res => {
    let html = ""
    res.on("data", data => (html += data))
    res.on("end", () => console.log(html))
})
```

#### 渲染层访问需要禁用同源

```js
webSecurity: false
```



## 使用 WebSocket 通信

### webSocket 客户端

```js
let websocket = new WebSocket("ws://localhost:8000/")
// 打开时触发
websocket.onopen = function(evt) 
// 关闭时触发
websocket.onclose
// 收到消息
websocket.onmessage
// 产生异常
websocket.onerror
// 发送数据
websocket.send("xxxx")
// 关闭连接
websocket.close()
```

## 与系统其他应用通信

### Electron 应用与其他应用通信

IPC 命名管道技术，包含服务端和客户端，可以持久连接双向通信

如果有第三方程序需要发送数据，可以在 Electron 创建命名管道服务端接收数据

```js
let net = require('net')
let PIPE_PATH = "\\\\.\\ pipe\\ mypipe"
let server = net.createServer(function(conn) {
    conn.on('data', d => console.log(`接收到数据: ${d.toString()}`))
    conn.on('end', () => console.log("客户端已关闭连接"))
    conn.write('建立连接后，发送信息')
})
server.on('close', () => console.log('服务关闭'))
server.listen(PIPE_PATH, () => console.log("服务启动，正在监听"))
```

客户端

```js
let net = require('net')
let PIPE_PATH = "\\\\.\\ pipe\\ mypipe"
let client = net.connect(PIPE_PATH, () => {
    console.log("连接成功")
    client.write("第一个数据包")
})
client.on("data", d => {
    console.log("接收数据 -> ", d)
    client.end("最后的消息，发完就关闭")
})
client.on("end", () => console.log("服务端关闭了连接"))
```

## 网页与 Electron 通信

### 建立 Web 服务器

```js
var http = require('http')

let server = http.createServer((request, reponse) => {
    if(request.url == "/electron") {
        let jsonString = ''
        request.on('data', data => jsonString += data)
        request.on('end', () => {
            let post = JSON.parse(jsonString)
            // 业务逻辑
            response.writeHead(200, {
                "Content-Type": "text/html",
                "Access-Control-Allow-Origin": "*"
            })
            let result = JSON.stringify({
                "ok": true,
                "msg": "请求成功"
            })
            reponse.end(result)
        })
        return 
    }
})
server.on("error", err => {
    // 可以发给渲染进程
})
server.listen(9416)


// 如果设置 listen(0)，需要获取具体监听的端口
server.on('listening', () => {
	console.log(server.address().port)
})
```



# 硬件

Electron 可以自由使用操作硬件设备的能力，且默认有硬件的访问权限

## 屏幕

### 获取扩展屏幕

获取主显示信息

```js
let remote = require("electron").remote

let mainScreen = remote.screen.getPrimaryDisplay()
console.log(mainScreen)
```

控制窗口显示在外接显示器上

```js
let {screen} require('electron')

let displays = screen.getAllDisplays()
let externalDisplay = displays.find(display => {
    // 判断是否为外接屏幕
    return display.bounds.x !== 0 || diplay.bounds.y !== 0
})
if(externalDisplay) ){
    win = new BrowserWindow({
        x: externalDisplay.bounds.x + 50,
        y: externalDisplay.bounds.y + 50,
        webPreferences: {
            nodeIntegration: true
        }
    })
    win.loadURL('https://xx')
}
```

### 打开系统软件盘

```js
const exec = require("child_process").exec
exec("osk.exe")
```

## 音视频设置

### 摄像头和麦克风

```js
let option = {
    audio: true,
    video: true
}
let mediaStream = await navigator.mediaDevices.getUserMedia(option)
let viode = document.querySelector("video")
video.srcObject = mediaStream
video.onloadedmetadata = function(e) {
    video.play()
}
```

### 可以对摄像头进行设置

```js
// 设置视频的大小
video: {widht: xxx, height: xxx}
// 取设备前置摄像头
video: {facingMode: "user"}
// 后置摄像头
video: {facingMode: "environment"}
```

### 所有摄像头的基本信息

获取数组中包含视频和音频设备信息

```js
let devices = await navigator.mediaDevices.enumerateDevices()
```

### 指定设备

此方法如果配置的设备不可用，将会随机返回可用设备

```js
video: {deviceId: myPreferencedCameraDeviceId}
```

可以指定，不可用则会抛出异常

```js
video: {deviceId: {exect: myPreferencedCameraDeviceId} }
```

## 录屏

### 获取桌面应用的屏幕视频流

```js
const {desktopCapturer} = require("electron")

let sources = await desktopCapturer.getSources({
    types: ["window", "screen"]
})
let target = sources.find(v => v.name == "微信")
let mediaStream = await navigator.mediaDevices.getUserMedia({
    audio: false,
    video: {
        mandatory: {
            chromeMediaSource: "desktop",
            chromeMediaSourceId: target.id
        }
    }
})
var video = document.querySelector("video")
video.srcObject = mediaStream
video.onloadedmetadata = function(e) {
    video.play()
}
```

## 电源

### 基本状态

- **charging** -> 正在充电时值为 true
- **chargingTime** -> 距离电池充满还剩多少时间，如果是 0 则表示充满
- **dischargingTime** -> 电池用完时间
- **level** -> 充电水平

```js
let batteryManager = await navigator.getBattery()
```

### 可控事件

- **onchargingchange**
- **onchargingtimechanged**
- **ondischargingtimechanged**
- **onlevelchange**

## 监控系统挂起与锁屏事件

```js
const {powerMonitor} = require("electron").remote

powerMonitor.on("suspend", () => {
    console.log("sys is going to sleep")
})
powerMonitor.on("resume", () => {
    console.log("sys is going to wakeup")
})
```

### 锁屏与解锁

```js
powerMonitor.on("lock-screen", () => {
    console.log("sys is lock screen")
})
powerMonitor.on("unlock-screen", () => {
    console.log("sys is unlock screen")
})
```

### 阻止系统锁屏

```js
const {powerSaveBlocker} = require("electron")

// 阻止锁屏
cosnt id = powerSaveBlocker.start("prevent-display-sleep")

// 取消阻止
powerSaveBlocker.stop(id)

// 判断是否阻止
powerSaveBlocker.isStarted(id)
```

## 导出 PDF 

### 导出页面内容

```js
let {remote} = require("electron")
let path = require("path")

let webContents = remote.getCurrentWebContents()
let data = await webContents.printToPDF({})
let filePath = path.join(__static, "xxx.pdf")
fs.writeFile(filePath, data, err => {
	id(err) throw err
    console.log("保存成功")
})
```

### 可以打开文件存储对话框

```js
let pathObj = await remote.dialog.showSaveDialog({
    title: "保存 PDF",
    filters: [{name: "pdf", extensions: ["pdf"]}]
})
if(pathObj.cancled) return 
fs.writeFile(pathObj.filePath, data, err => {
    if(err) throw err
    console.log("保存成功")
})
```

## 硬件信息

### 获取目标平台硬件信息

#### Electron  API

```js
// 内存使用量
let memoryUseage = process.getSystemMemoryInfo()

// CPU 使用情况
let cpuUseage = process.getCPUUseage()

// 每次调用是取本次与上次的评价值，所以用定时器读取
setInterval(() => {
    cpuUseage = process.getCPUUseage()
    console.log(cpuUseage)
})
```

### systeminformation 包

```js
let si = require('systeminformation')
(async function() {
    // cpu 信息
    let cpuInfo = await si.cpu()
    // 内存信息
    let memInfo = await si.mem()
    // 网卡信息
	let networkInterfaces = await si.networkInterfaces()
    // 获取磁盘信息
    let diskLayout = await si.diskLayout()
})
```



# 发布

## 生成图标

### 安装包

```shell
pnpm i electron-icon-builder --dev
```

### 在 package.json 中配置

```json
"build-icon": "electron-icon-builder --input=./public/icon.png --output=build --flatten"
```





# 窗口

## 窗口记录

```js
setState() {
    let win = remote.getCurrentWindow();
    // 返回 Rectangle 对象，包含窗口在屏幕上的坐标和大小
    let rect = win.getBounds();
    let isMaxsize = win.isMaximized();
}
```

## 窗口间通信

### 解决不同窗口间， pinia store 不同步问题

### 主进程转发

```ts
// pinia
ipcMain.on('store-set', (event, objData) => {
  // 遍历窗口发送
  for(const cur of BrowserWindow.getAllWindows()) {
    if(cur != BrowserWindow.fromWebContents(event.sender)) {
      cur.webContents.send('store-get', objData)
    }
  }
})
```

### 预加载设置通信与监听

```ts
// Pinia store 设置主动更改同步
const setConfigStore = (obj: object) => {
  // console.log(obj)
  ipcRenderer.send('store-set', obj)
}

contextBridge.exposeInMainWorld('myApi', {
  setConfigStore,
  // Pinia store 设置被动同步监听
  storeChangeListen: (callbacka) =>
    ipcRenderer.on('store-get', (event, data) => {
      callbacka(data)
    })
})
```

### 窗口组件中使用

```ts
// 窗口 1
onMounted(() => {
  // 主页面监听
  win.myApi.storeChangeListen((objData: object) => {
    console.info('homePage listening', objData)
    // 有 get 属性
    if (objData.get) {
      let storeValue = objData.get
      let tempObj: object = {}
      tempObj[storeValue] = configStore[storeValue]
      // 发送其他窗口同步
      win.myApi.setConfigStore(tempObj)
      return
    }
    try {
      // 同步信息
      const keys = Object.keys(objData)
      for (let key of keys) {
        // 设置对应 store 的值
        configStore[`set${key.replace(key.charAt(0), key.charAt(0).toUpperCase())}`](objData[key])
      }
    } catch (error) {
      console.error(error)
    }
  })
})

// 窗口 2 获取窗口 1 的 store
onMounted(() => {
  win.myApi.storeChangeListen((objData: object) => {
    console.info('keyConfigPage listening')
    const keys = Object.keys(objData)
    for(let key of keys) {
      // 设置对应 store 的
      configStore[`set${key.replace(key.charAt(0), key.charAt(0).toUpperCase())}`](objData[key])
    }
  })
  // 获取 配置的索引
  win.myApi.setConfigStore({
    get: 'configIndex'
  })
})
```





# electron打包

### 引用静态路径

#### 渲染层

路径 `public/img/test.png` 

示例引用 

```js
'./img/test.png'
```

#### 主进程

路径 `public/json/test.json` 

```js
path.join(__dirname, '../xx/dist/test.json')
```



安装electron打包开发依赖

> 最新版本：npm install --save-dev electron-builder
>
> 指定版本：npm install --save-dev electron-builder@23.6.0



### package.json 中配置

```json
"build": {
    "appId": "com.xxxxx.xxxx",//包名  
    "productName": "xxxxxx", //项目名 这也是生成的exe文件的前缀名
    "asar": false,
    "copyright": "Copyright © 2022 electron",//版权  信息
    "publish": {
      "provider": "github",// 服务器提供商 也可以是GitHub等等
      "url": ""// 服务器地址
      "owner": "iLx11",
      "repo": "screen-go"
    },
    "directories": { // 输出文件夹
      "output": "dist_electron/"
    },
    "extraResources": [
      {
        "from": "./public",
        "to": "./public"
      }
    ],
    "files": [ // 打包的electron需要包含的文件,一般就是与electron的有关的打包进去
      "./dist", // vue 打包文件
      "./electron" // electron 主文件
    ],
    "mac": {
      "artifactName": "${productName}_${version}.${ext}",
      "target": [
        "dmg"
      ]
    },
    "win": {
      "icon": "public/favicon.ico",
      "target": [
        {
          "target": "nsis",
          "arch": [
            "ia32"
          ]
        }
      ],
      "artifactName": "${productName}_${version}.${ext}"
    },
    "nsis": {
      "oneClick": false,// 是否一键安装
      "perMachine": false,
      "allowToChangeInstallationDirectory": true,// 允许修改安装目录
      "deleteAppDataOnUninstall": false,
      "installerIcon": "public/favicon.ico",// 安装图标
      "uninstallerIcon": "public/favicon.ico",// 创建桌面图标
      "createDesktopShortcut": true,// 创建桌面图标
      "createStartMenuShortcut": true,// 创建开始菜单图标
      "shortcutName": "xxxxx" // 图标名称
    },
    "releaseInfo": {
      "releaseNotes": "版本更新的具体内容"
    }
  }
```

### 执行打包

```shell
pnpm electron:build / npm run electron:build
```



# 进程间通信

https://blog.csdn.net/weixin_43239880/article/details/129563632?spm=1001.2014.3001.5501

https://www.electronjs.org/zh/docs/latest/tutorial/ipc

1. 主进程向渲染进程通讯

- 主进程使用 `win.webContents.send` 发送消息
- 渲染进程使用 `ipcRenderer.on` 接收消息

2. 渲染进程向主进程通信

- - 渲染进程使用 `ipcRenderer.send` 或者 `ipcRenderer.invoke` 发送消息
  - 主进程使用 `ipcMain.on`或者`ipcMain.handle` 接收消息





# 问题与解决

#### electron 打包_桌面端框架Electron使用问题整理和总结

https://blog.csdn.net/weixin_39607450/article/details/110647391

-

#### vue3+vite assets动态引入图片的三种方法及解决打包后图片路径错误不显示的问题

https://www.jb51.net/article/278408.htm

content:

vite官方文档的解释：https://vitejs.bootcss.com/guide/assets.html 

我们看到实际上我们不希望资源文件被webpack编译**可以把图片放到public 目录会更省事，不管是开发环境还是生产环境，可以始终以根目录保持图片路径的一致**，这点跟webpack是一致的

##### 第一种方式（适用于处理单个链接的资源文件）

```js
import homeIcon from '@/assets/images/home/home_icon.png'
<img :src="homeIcon"/>
```

##### 第二种方式（适用于处理多个链接的资源文件）

**推荐，这种方式传入的变量可以动态传入文件路径！！**

[静态资源处理 | Vite 官方中文文档](https://links.jianshu.com/go?to=https%3A%2F%2Flink.zhihu.com%2F%3Ftarget%3Dhttps%3A%2F%2Fcn.vitejs.dev%2Fguide%2Fassets.html%23new-url-url-import-meta-url)
new URL() + import.meta.url

**这里我们假设：**
工具文件目录： `src/util/pub-use.ts`
pub-use.ts

```
// 获取assets静态资源export defaultconst getAssetsFile = (url: string) => {  returnnewURL(`../assets/images/${url}`, import.meta.url).href}
```

使用

```
import usePub from '@/util/public-use'setup () { const Pub = usePub() const getAssetsFile = Pub.getAssetsFile return{ getAssetsFile }}
```

可以包含文件路径

```
<img :src="getAssetsFile('/home/home_icon.png')"/>
```

##### 第三种方式（适用于处理多个链接的资源文件）

**不推荐，这种方式引入的文件必须指定到具体文件夹路径，传入的变量中只能为文件名，不能包含文件路径**

使用vite的`import.meta.glob`或`import.meta.globEager`，两者的区别是前者懒加载资源，后者直接引入。

**这里我们假设：**
工具文件目录： `src/util/pub-use.ts`
pub-use.ts

```js
// 获取assets静态资源
export defaultconst getAssetsHomeFile = (url: string) => {  
    const path = `../assets/images/home/${url}`;  
    const modules = import.meta.globEager("../assets/images/home/*");  
    return modules[path].default;
}
```

使用

```js
import usePub from '@/util/public-use'
setup () { 
    const Pub = usePub() 
    const getAssetsHomeFile = Pub.getAssetsHomeFile  
    return{ getAssetsHomeFile }
}
```

不能包含文件路径

```html
<img :src="getAssetsHomeFile('home_icon.png')"/>
```



##### 补充：如果是背景图片引入的方式（一定要使用相对路径）

```css
.imgText { background-image: url('../../assets/images/1462466500644.jpg');}
```

-

#### vite Some chunks are larger than 500 kBs after minification. Consider: - Using dynamic import()

https://blog.csdn.net/qq_45284938/article/details/129707796

vite.config:

```js
outDir: BUILD_DIR, // 指定打包文件的输出目录
emptyOutDir: true,  // 打包时先清空上一次构建生成的目录
```

完整 build：

```json
 build: {
    outDir: BUILD_DIR,
    sourcemap: false,
    minify: 'terser',
    chunkSizeWarningLimit: 1500,
    emptyOutDir: true,
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true
      }
    },
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            return id.toString().split('node_modules/')[1].split('/')[0].toString();
          }
        },
        chunkFileNames: (chunkInfo) => {
          const facadeModuleId = chunkInfo.facadeModuleId ? chunkInfo.facadeModuleId.split('/') : [];
          const fileName = facadeModuleId[facadeModuleId.length - 2] || '[name]';
          return `js/${fileName}/[name].[hash].js`;
        }
      }
    }
  },
```

-

#### Electron报错Unable to load preload script

https://blog.csdn.net/s5s5s5s5s/article/details/127493590

preload 文件有错，或许是代码次序问题，暴露的函数要在定义之后

-

#### 【Electron】require和contextBridge导致的contextIsolation相悖问题

#### && 解决electron中出现Uncaught ReferenceError: require is not defined

https://blog.csdn.net/weixin_41568995/article/details/120352394

```js
webPreferences: {
    // 版本默认不支持 node，使用需添加
    nodeIntegration:true,
    // 不使用 contextBridge API 
    contextIsolation: false,
    enableRemoteModule: true,
    preload: path.join(__dirname, 'preload.js')
}
```

-

#### 异步功能+ await + setTimeout的组合

https://cloud.tencent.com/developer/ask/sof/171603

```js
function timeout(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
async function sleep(fn, ...args) {
    await timeout(3000);
    return fn(...args);
}
```

或简短

```js
 await new Promise(resolve => setTimeout(resolve, 1000));
```

-

#### Electron+Vite渲染进程无法import内置模块的问题

https://zhuanlan.zhihu.com/p/540056695

使用 `optimizer`  插件

不推荐，主进程与渲染进程分开好一点

```js
//vite.config.ts
import { defineConfig } from "vite";
import optimizer from "vite-plugin-optimizer";
let getReplacer = () => {
  let externalModels = ["electron", "os", "fs", "path", "events", "child_process", "crypto", "http", "buffer", "url", "better-sqlite3", "knex"];
  let result = {};
  for (let item of externalModels) {
    result[item] = () => ({
      find: new RegExp(`^${item}$`),
      code: `const ${item} = require('${item}');export { ${item} as default }`,
    });
  }
  return result;
};
export default defineConfig({
  plugins: [optimizer(getReplacer())],
});
```



-

#### Error: Module “crypto“ has been externalized for browser compatibility and cannot be accessed in ...

https://codeantenna.com/a/prLQN2PBl9

使用vite构建项目的时候需要用到crypto进行加密出现的错误。问题出在vite本身使用了crypto，我们如果通过npm i crypto -S会导致vite构建时报错。

换个库或者是使用上面的方法

-







