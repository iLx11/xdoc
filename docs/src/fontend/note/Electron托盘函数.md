### 1. `new Tray(image)`

- **功能**：创建一个托盘图标实例。
- **参数**：
  - `image`: 图标的路径或 `NativeImage` 对象，表示托盘显示的图标。
- **示例**：
  ```javascript
  const { Tray } = require('electron');
  let tray = new Tray('/path/to/icon.png');
  ```

### 2. `tray.setToolTip(toolTip)`

- **功能**：设置鼠标悬停在托盘图标上时显示的提示文本。
- **参数**：
  - `toolTip`: 字符串，设置显示的提示信息。
- **示例**：
  ```javascript
  tray.setToolTip('This is my application');
  ```

### 3. `tray.setContextMenu(menu)`

- **功能**：为托盘图标设置右键点击时显示的上下文菜单。
- **参数**：
  - `menu`: 一个 `Menu` 对象，用作托盘图标的上下文菜单。
- **示例**：
  ```javascript
  const { Menu } = require('electron');
  const contextMenu = Menu.buildFromTemplate([
    { label: 'Item1', click: () => { console.log('Item1 clicked'); } },
    { label: 'Item2', click: () => { console.log('Item2 clicked'); } },
    { type: 'separator' },
    { label: 'Exit', click: () => { app.quit(); } }
  ]);
  
  tray.setContextMenu(contextMenu);
  ```

### 4. `tray.setImage(image)`

- **功能**：更改托盘图标的图像。
- **参数**：
  - `image`: 图标的路径或 `NativeImage` 对象。
- **示例**：
  ```javascript
  tray.setImage('/path/to/new/icon.png');
  ```

### 5. `tray.setTitle(title)`（仅 macOS）

- **功能**：设置托盘图标旁边的标题文本，仅适用于 macOS。
- **参数**：
  - `title`: 字符串，设置托盘图标旁边显示的文本。
- **示例**：
  ```javascript
  tray.setTitle('My App');
  ```

### 6. `tray.setIgnoreDoubleClickEvents(ignore)`

- **功能**：忽略或处理托盘图标的双击事件。
- **参数**：
  - `ignore`: 布尔值，`true` 时忽略双击事件。
- **示例**：
  ```javascript
  tray.setIgnoreDoubleClickEvents(true);
  ```

### 7. `tray.displayBalloon(options)`（仅 Windows）

- **功能**：在 Windows 系统上显示气泡通知。
- **参数**：
  - `options`: 一个包含 `icon`, `title`, 和 `content` 的对象，用来配置气泡通知。
- **示例**：
  ```javascript
  tray.displayBalloon({
    icon: '/path/to/icon.png',
    title: 'New Message',
    content: 'You have received a new message.'
  });
  ```

### 8. `tray.on(event, callback)`

- **功能**：监听托盘图标上的事件，例如点击、双击等。
- **常用事件**：
  - `click`: 当用户点击托盘图标时触发。
  - `double-click`: 当用户双击托盘图标时触发。
  - `right-click`: 当用户右键点击托盘图标时触发。

- **示例**：
  ```javascript
  tray.on('click', (event, bounds, position) => {
    console.log('Tray icon clicked!');
  });
  
  tray.on('double-click', () => {
    console.log('Tray icon double-clicked!');
  });
  ```

### 9. `tray.destroy()`

- **功能**：销毁托盘图标并释放其资源。
- **示例**：
  ```javascript
  tray.destroy();
  ```

---

## 托盘图标的完整示例

下面是一个完整的示例，展示如何使用 Electron 的 `Tray` 类来创建一个托盘图标，并为其添加菜单和点击事件处理。

```javascript
const { app, Menu, Tray } = require('electron');

let tray = null;
app.whenReady().then(() => {
  // 创建托盘图标
  tray = new Tray('/path/to/icon.png');

  // 设置托盘图标的悬停提示
  tray.setToolTip('My Electron App');

  // 创建右键菜单
  const contextMenu = Menu.buildFromTemplate([
    { label: 'Show', click: () => { console.log('Show clicked'); } },
    { label: 'Settings', click: () => { console.log('Settings clicked'); } },
    { type: 'separator' },
    { label: 'Quit', click: () => { app.quit(); } }
  ]);

  // 设置托盘图标的右键菜单
  tray.setContextMenu(contextMenu);

  // 监听托盘图标点击事件
  tray.on('click', (event, bounds, position) => {
    console.log('Tray clicked', event, bounds, position);
    // 可以在此处处理点击事件，比如显示或隐藏主窗口
  });

  // 监听双击事件
  tray.on('double-click', () => {
    console.log('Tray icon double-clicked');
    // 双击时可以执行某些动作
  });

  // 设置托盘图标的气泡通知（仅 Windows）
  if (process.platform === 'win32') {
    tray.displayBalloon({
      icon: '/path/to/balloon/icon.png',
      title: 'Hello!',
      content: 'This is a balloon notification'
    });
  }
});

app.on('window-all-closed', () => {
  // Mac 下应用没有退出时，不应销毁托盘图标
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (tray === null) {
    // 在应用重新激活时，如果托盘图标已经被销毁，可以重新创建
    tray = new Tray('/path/to/icon.png');
  }
});
```
