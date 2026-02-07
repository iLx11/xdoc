# Electron 核心配置

createWindow.ts

```ts
this.defaultConfig = {
  // 页面路由
  route: '',
  parentId: null,
  isMainWin: false,
  width: 900,
  height: 700,
  //窗口是否在屏幕居中. 默认值为 false
  center: true,
  transparent: true,
  //设置为 false 时可以创建一个无边框窗口 默认值为 true。
  frame: false,
  titleBarStyle: 'hidden',
  backgroundColor: '#00000000',
  //窗口是否在创建时显示。 默认值为 true。
  show: false,
  maxWidth: null,
  maxHeight: null,
  minWidth: null,
  minHeight: null,
  autoHideMenuBar: true,
  resizable: true,
  minimizable: true,
  maximizable: true,
  windowName: '',
  /* 
    【父窗口不能操作】
     模态窗口 -- 模态窗口是禁用父窗口的子窗口，创
     建模态窗口必须设置 parent 和 modal 选项
  */
  modal: false,
  parent: null,
  titleBarOverlay: false,
  maximize: false,
  webPreferences: {
    devTools: DEV,
    // nodeIntegration: true,
    contextIsolation: true,
    // nodeIntegrationInWorker: true,
    webSecurity: false,
    // sandbox: false,
    nodeIntegration: true,
    preload: path.join(__dirname, '../preload/preload.js'),
    // 禁用离屏渲染
    offscreen: false,
    // 防止后台渲染节流
    backgroundThrottling: false,
    // 核心：放开HID设备访问权限
    permissions: ['hid', 'hid-device'],
    // 可选：允许实验性API（若使用小众HID特性）
    // experimentalFeatures: false,
    allowRunningInsecureContent: true,
    sandbox: false,
    enableWebHID: true, // 启用 WebHID
  },
}
  
```

main.ts

```ts

  session.defaultSession.setPermissionCheckHandler(
    (webContents, permission) => {
      if (permission === 'hid') {
        return true // 允许权限
      }
      return false
    },
  )

  session.defaultSession.on(
    'select-hid-device',
    async (event, details, callback) => {
      event.preventDefault()
      try {
        // 保存HID选择的最终回调（关键：等待渲染进程返回后执行）
        hidDeviceSelectCallback = callback

        if (
          CreateWindow.getMainWindow() &&
          CreateWindow.getMainWindow().webContents
        ) {
          CreateWindow.getMainWindow().webContents.send(
            'show-hid-selector',
            details.deviceList,
          )
        } else {
          // 兜底：无窗口时取消选择
          callback(null)
          hidDeviceSelectCallback = null
        }
      } catch (err) {
        // 捕获所有可能的错误（包括IPC通信失败、渲染进程返回异常等）
        console.error('select-hid-device 处理失败：', err)
        callback(null) // 兜底：返回null取消选择
      }
    },
  )

  ipcMain.on('hid-device-selected', (_, deviceId) => {
    if (hidDeviceSelectCallback) {
      // 执行HID选择的最终回调，返回设备ID
      hidDeviceSelectCallback(deviceId || null)
      // 清空回调，避免内存泄漏
      hidDeviceSelectCallback = null
    }
  })
```

preload.ts

```ts
const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('api', {
  // 接收主进程的设备列表，触发渲染进程的UI选择
  onShowHidSelector: callback => {
    ipcRenderer.on('show-hid-selector', (_, deviceList, resolve) => {
      callback(deviceList, resolve) // 把设备列表和回调传给Vue组件
    })
  },
  // 向主进程发送「设备选择结果」
  sendSelectedHidDevice: deviceId => {
    ipcRenderer.send('hid-device-selected', deviceId)
  },
  // 可选：主动获取设备列表（备用）
  getHidDevices: () => ipcRenderer.invoke('select-hid-device'),
})

```



# 渲染层配置

app.vue

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { onMounted } from 'vue'

const win = window as any

const showDeviceSelector = ref(false)
const deviceList = ref([])
let resolveSelector = null // 存储主进程的回调函数

onMounted(() => {
  // 监听主进程发来的「显示设备选择弹窗」指令
  win.api.onShowHidSelector(async (list, resolve) => {
    showDeviceSelector.value = true
    deviceList.value = list
    resolveSelector = resolve // 保存回调，用于返回选择结果

    console.info('list', list)

    const selectedDevice = await showElectronDeviceSelector(deviceList.value)

    if (!selectedDevice) {
      console.info('用户取消了设备选择')
      win.api.sendSelectedHidDevice(null)
      return null
    }
    // 向主进程发送选择结果
    win.api.sendSelectedHidDevice(selectedDevice.deviceId)

    // // 只保留用户选择的设备
    // devices = [selectedDevice]

    console.info('selectedDevice', selectedDevice)
  })
})

const requestHidDevice = async () => {
  try {
    testHID()
  } catch (err) {
    console.error('请求设备失败：', err) // 此时能看到具体错误
  }
}

async function testHID() {
  // const devices = await navigator.hid.getDevices()
  // vid: 0x1915,
  //         pid: 0x2345,
  const devices = await navigator.hid.requestDevice({
    filters: [
      {
        productId: 0x2345,
        vendorId: 0x1915,
      },
    ],
  })
  console.log('grantedDevices', devices)

  // const allAuthorizedDevices = await navigator.hid.getDevices()
  // console.log('grantedDevices', allAuthorizedDevices)

  return

  // 环境判断
  if (isElectronEnv() && devices.length > 1) {
    console.info('electron env ----------------')
    // 在Electron环境中且有多个设备时，显示设备选择弹窗
    const selectedDevice = await showElectronDeviceSelector(devices)

    if (!selectedDevice) {
      console.info('用户取消了设备选择')
      return null
    }

    // // 只保留用户选择的设备
    // devices = [selectedDevice]

    console.info('selectedDevice', selectedDevice)
  }
}

/********************************************************************************
 * @brief: 判断是否为Electron环境
 * @return {boolean} 是否为Electron环境
 ********************************************************************************/
async function isElectronEnv(): Promise<boolean> {
  // 检查是否为Electron环境的几种方式
  if (typeof window !== 'undefined') {
    // 检查window对象是否有electron属性
    const electronWindow = window as any
    if (electronWindow.electron) {
      return true
    }
    // 检查是否有navigator.userAgent包含Electron
    if (navigator.userAgent.includes('Electron')) {
      return true
    }
  }

  // 检查process对象
  if (typeof process !== 'undefined') {
    return typeof process.versions === 'object' && !!process.versions.electron
  }

  return false
}

/********************************************************************************
 * @brief: 在Electron环境中显示设备选择弹窗
 * @param {HIDDevice[]} devices 设备列表
 * @return {Promise<HIDDevice | null>} 用户选择的设备
 ********************************************************************************/
async function showElectronDeviceSelector(devices: any): Promise<any | null> {
  return new Promise(resolve => {
    // 创建弹窗容器
    const dialog = document.createElement('div')
    dialog.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.5);
      z-index: 9999;
      display: flex;
      justify-content: flex-start;
      align-items: flex-start;
      padding: 20px;
      box-sizing: border-box;
    `

    // 创建弹窗内容
    const content = document.createElement('div')
    content.style.cssText = `
      background-color: #2a2a2a;
      border-radius: 8px;
      padding: 16px;
      width: 430px;
      max-height: 80vh;
      overflow-y: auto;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
    `

    // 创建标题
    const title = document.createElement('h3')
    title.textContent = '选择设备'
    title.style.cssText = `
      color: #ffffff;
      margin-top: 0;
      margin-bottom: 16px;
      font-size: 18px;
    `
    content.appendChild(title)

    // 创建设备列表
    const deviceList = document.createElement('div')
    deviceList.style.cssText = `
      display: flex;
      flex-direction: column;
      gap: 8px;
    `

    devices.forEach((device, index) => {
      const deviceItem = document.createElement('div')
      deviceItem.style.cssText = `
        padding: 12px;
        background-color: #3a3a3a;
        border-radius: 4px;
        cursor: pointer;
        transition: background-color 0.2s;
      `
      deviceItem.addEventListener('click', () => {
        resolve(device)
        document.body.removeChild(dialog)
      })
      deviceItem.addEventListener('mouseenter', () => {
        deviceItem.style.backgroundColor = '#4a4a4a'
      })
      deviceItem.addEventListener('mouseleave', () => {
        deviceItem.style.backgroundColor = '#3a3a3a'
      })

      // 设备名称
      const deviceName = document.createElement('div')
      deviceName.textContent = `设备名称: ${device.productName || device.name || '未知设备'}`
      deviceName.style.cssText = `
        color: #ffffff;
        font-weight: 500;
        margin-bottom: 4px;
      `
      deviceItem.appendChild(deviceName)

      // 设备信息
      const deviceInfo = document.createElement('div')
      deviceInfo.textContent = `VID: ${device.vendorId.toString(16).padStart(4, '0')}, PID: ${device.productId.toString(16).padStart(4, '0')}`
      deviceInfo.style.cssText = `
        color: #cccccc;
        font-size: 14px;
      `
      deviceItem.appendChild(deviceInfo)

      deviceList.appendChild(deviceItem)
    })

    content.appendChild(deviceList)

    // 创建取消按钮
    const cancelBtn = document.createElement('button')
    cancelBtn.textContent = '取消'
    cancelBtn.style.cssText = `
      margin-top: 16px;
      padding: 8px 16px;
      background-color: #4a4a4a;
      color: #ffffff;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      transition: background-color 0.2s;
      width: 100%;
    `
    cancelBtn.addEventListener('click', () => {
      resolve(null)
      document.body.removeChild(dialog)
    })
    cancelBtn.addEventListener('mouseenter', () => {
      cancelBtn.style.backgroundColor = '#5a5a5a'
    })
    cancelBtn.addEventListener('mouseleave', () => {
      cancelBtn.style.backgroundColor = '#4a4a4a'
    })
    content.appendChild(cancelBtn)

    dialog.appendChild(content)
    document.body.appendChild(dialog)
  })
}
</script>

<template>
  <!-- <MainPage /> -->
  <!-- <div class="bg-box"></div> -->

  <!-- <n-config-provider :locale="zhCN">
    <n-dialog-provider>
      <n-notification-provider>
        <keep-alive>
          <RouterView />
        </keep-alive>
      </n-notification-provider>
    </n-dialog-provider>
  </n-config-provider> -->

  <button @click="requestHidDevice">连接HID设备</button>
</template>

<style lang="scss">
:root {
  --content-box-color: rgb(255, 255, 255);
  --pop-box-color: rgba(255, 255, 255, 0.95);

  // 组件颜色
  --bg-color-comp-1: rgba(255, 255, 255, 0.95);
  --bg-color-comp-2: rgba(51, 51, 51, 0.25);
  --bg-color-comp-3: rgba(51, 51, 51, 0.1);
  --bg-color-comp-4: rgba(129, 241, 185, 0.5);

  // 文字颜色
  --text-color-1: rgba(51, 51, 51, 0.85);
  --text-color-2: rgba(51, 51, 51, 0.5);
  --text-color-3: rgba(216, 211, 211, 0.8);
  --text-color-4: rgba(255, 255, 255, 0.8);

  --span-text-color: rgb(143, 206, 202);

  --gap-1: 9px;
  --gap-2: 15px;

  // 层级
  --z-index-1: 100;
}

[main-theme='color'] {
  --content-box-color: rgb(255, 255, 255);
  --pop-box-color: rgba(255, 255, 255, 0.95);
  --text-color-1: rgba(51, 51, 51, 0.85);
  --text-color-2: rgba(51, 51, 51, 0.5);
  --span-text-color: rgb(143, 206, 202);
}

@font-face {
  font-family: 'ceyy';
  src: url('./assets/font/ceyy.ttf');
}

img[src='']:not([src]),
img:not([src]) {
  width: 0;
  height: 0;
  opacity: 0;
}
.bg-box {
  @include global.fixed-center;
  @include global.full_wh;
  z-index: -1;
}

@include global.app_common;

#app {
  background: white;
}
</style>
 
```

