---
title: Electron窗口
date: 2024-02-18 11:15:39
tags:
categories:
classes: 笔记
---

## 创建接口

### electron/interface/IWindowConfig.ts

```tsx
export default interface IWindowConfig {
  id: number | null
  title: string
  width: number | null
  height: number | null
  minWidth: number | null
  minHeight: number | null
  route: string
  resizable: boolean
  maximize: boolean
  backgroundColor: string
  data: object | null
  isMultiWindow: boolean
  isMainWin: boolean
  parentId: number | null
  modal: boolean
}

```

### electron/interface/IWindowOption.ts

```tsx
import { BrowserWindow } from 'electron'

export default interface IWindowOption {
  width: number
  height: number
  maxWidth: number
  maxHeight: number
  minWidth: number
  minHeight: number
  center: boolean
  transparent: boolean
  backgroundColor: string
  autoHideMenuBar: boolean
  resizable: boolean
  minimizable: boolean
  maximizable: boolean
  frame: boolean
  show: boolean
  parent?: BrowserWindow
  modal: boolean
  webPreferences: {
    contextIsolation: boolean //上下文隔离
    nodeIntegration: boolean //启用 Node 集成（是否完整的支持 node）
    webSecurity: boolean
    preload: string
  }
}
```

## 创建窗口类

### electron/controller/createWindow.ts

```tsx
import { app, BrowserWindow, globalShortcut, IpcMainEvent, ipcMain } from 'electron'
import IWindowOption from '../interface/IWindowOption'
import IWindowConfig from '../interface/IWindowConfig'
import { join } from 'path'
const path = require('path')

// 窗口记录数组
interface IGroup {
  [index: number]: {
    windowId: number
    route: string
  }
}

export default class CreateWindow {
  // 路由与主窗口标识
  private public static group: IGroup = []
  // 记录主窗口
  private static main: BrowserWindow | null | undefined = null
  // 窗口配置项
  private defaultConfig: IWindowConfig
  // 窗口默认配置
  private defaultOptions: IWindowOption

  constructor() {
    this.defaultConfig = {
      id: null, //唯一 id
      title: '', //窗口标题
      width: null, //宽度
      height: null, //高度
      minWidth: null, //最小宽度
      minHeight: null, //最小高度
      route: '', // 页面路由 URL '/manage?id=123'
      resizable: true, //是否支持调整窗口大小
      maximize: false, //是否最大化
      backgroundColor: '#eee', //窗口背景色
      data: null, //数据
      isMultiWindow: false, //是否支持多开窗口 (如果为 false，当窗体存在，再次创建不会新建一个窗体 只 focus 显示即可，，如果为 true，即使窗体存在，也可以新建一个)
      isMainWin: false, //是否主窗口创建父子窗口 --(当为 true 时会替代当前主窗口)
      parentId: null, //父窗口 id   子窗口永远显示在父窗口顶部 【父窗口可以操作】
      modal: true //模态窗口 -- 模态窗口是禁用父窗口的子窗口，创建模态窗口必须设置 parent 和 modal 选项 【父窗口不能操作】
    }
    this.defaultOptions = {
      width: 900,
      height: 700,
      //窗口是否在屏幕居中. 默认值为 false
      center: true,
      //设置为 false 时可以创建一个无边框窗口 默认值为 true。
      frame: false,
      //窗口是否在创建时显示。 默认值为 true。
      show: true,
      transparent: true,
      maxWidth: null,
      maxHeight: null,
      minWidth: 688,
      minHeight: 560,
      backgroundColor: 'rgba(0,0,0,0)',
      autoHideMenuBar: true,
      resizable: true,
      minimizable: true,
      maximizable: true,
      /* 
        【父窗口不能操作】
         模态窗口 -- 模态窗口是禁用父窗口的子窗口，创
         建模态窗口必须设置 parent 和 modal 选项
      */
      modal: true,
      parent: null,
      webPreferences: {
        // nodeIntegration: true,
        contextIsolation: true,
        // nodeIntegrationInWorker: true,
        webSecurity: false,
        // sandbox: false,
        nodeIntegration: true,
        preload: path.join(__dirname, '../preload/preload.js')
      }
    }
  }

  // 根据 id 的窗口
  public getWindowById = (id: number): any => {
    return BrowserWindow.fromId(id)
  }

  // 创建窗口
  public createWindow(configurations: object, options: object) {
    // console.info(CreateWindow.group)
    // 判断是否有页面
    let windowId: number = 0
    if (
      CreateWindow.group.some((o: object, i: number) => {
        windowId = i
        return o.route === configurations.route
      })
    ) {
      console.info('window is already created')
      this.getWindowById(windowId + 1)?.blur()
      return
    }
    // 传递的配置与默认配置创建新的对象
    let windowConfig = Object.assign({}, this.defaultConfig, configurations)
    // 传递的选项与默认选项创建新的对象
    let windowOptions = Object.assign({}, this.defaultOptions, options)
    // 设定其他窗口的父窗口
    if (!windowConfig.isMainWin && CreateWindow.main) {
      windowOptions.parent = CreateWindow.main
    }
    // 创建窗口
    let win = new BrowserWindow(windowOptions)
    console.log('window id:' + win.id)
    // 记录路由与窗口 id
    CreateWindow.group[win.id - 1] = {
      windowId: win.id,
      route: windowConfig.route
    }

    // 是否最大化
    if (windowConfig.maximize && windowConfig.resizable) {
      win.maximize()
    }
    // 是否主窗口
    if (windowConfig.isMainWin) {
      if (CreateWindow.main) {
        console.info('main window already created')
        delete CreateWindow.group[0]
        CreateWindow.main.close()
      }
      // 记录主窗口
      CreateWindow.main = win
    }
    // 窗口被清除之后，清除存储
    win.on('close', () => {
      CreateWindow.group.forEach((o, i) => {
        if(this.getWindowById(o.windowId) == win)
          delete CreateWindow.group[i]
        if(win == this.main)
          app.quit()
      });
      win.setOpacity(0)
    })

    // 加载页面
    let winURL: string
    if (app.isPackaged) {
      // winURL = windowConfig.route ? `app://../../dist/index.html` : `file://${path.join(__dirname, '../../dist/index.html')}`
      win.loadFile(join(__dirname, '../../dist/index.html'), { hash: windowConfig.route })
    } else {
      //winURL = windowConfig.route ? `http://localhost:${process.env['VITE_DEV_SERVER_PORT']}/#${windowConfig.route}` : `http://localhost:${process.env['VITE_DEV_SERVER_PORT']}/#`
      winURL = windowConfig.route
        ? `${process.env.VITE_DEV_SERVER_URL}/#${windowConfig.route}`
        : `${process.env.VITE_DEV_SERVER_URL}}/#`
      win.loadURL(winURL)
    }
    console.info('new window address -> ', winURL)
    win.setMenu(null)
    // 设置路由
    win.webContents.openDevTools()
    win.on('hide', () => win.webContents.closeDevTools())
    // 全局快捷键注册
    globalShortcut.register('CommandOrControl+Shift+i', function () {
      win.webContents.openDevTools()
    })
    win.once('ready-to-show', () => {
      win.show()
    })
  }
}

```

## preload 添加方法

### electron/main/preload.ts

```tsx
// 打开新窗口
const createNewWindow = (optionObj: object, configObj: object) => {
  ipcRenderer.send('window-create', optionObj, configObj)
}

contextBridge.exposeInMainWorld('myApi', {
  createNewWindow
})
```

## 修改 main 入口文件

### electron/main/main.ts

```tsx
const { app, protocol, BrowserWindow, ipcMain } = require('electron')
// 需在当前文件内开头引入 Node.js 的 'path' 模块
const path = require('path')

import { windowControlListener } from '../controller/windowControl'
import CreateWindow from '../controller/createWindow'

// 窗口监听
windowControlListener()

// 创建其他窗口
ipcMain.on('window-create', (event, optionObj: object, configObj: object) => {
  let cw = new CreateWindow()
  cw.createWindow(optionObj, configObj)
})

// 创建主窗口
const createMainWindow = async () => {
  let mainW = new CreateWindow()
  mainW.createWindow({
    route: '/home',
    isMainWin: true,
  }, {
    width: 900,
    height: 700
  })
}

app.commandLine.appendSwitch('--ignore-certificate-errors', 'true')
// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([{ scheme: 'app', privileges: { secure: true, standard: true } }])

app.whenReady().then(() => {
  // 创建窗口
  createMainWindow()
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createMainWindow()
  })
})

// 关闭所有窗口
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})

```

## 渲染层调用

```tsx
const win = window as any

const createWindow = () => {
  win.myApi.createNewWindow(
    {
      route: '/child'
    },
    {
      width: 500,
      height: 500
    }
  )
}
```

