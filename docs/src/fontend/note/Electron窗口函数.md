### 1. `new BrowserWindow([options])`
- **功能**：创建一个新的浏览器窗口实例。
- **参数**：`options` 是一个可选对象，可以设置窗口的宽度、高度、背景颜色等属性。
- **示例**：
  
  ```javascript
  const { BrowserWindow } = require('electron');
  let win = new BrowserWindow({
    width: 800,
    height: 600,
    backgroundColor: '#ffffff'
  });
  ```

### 2. `win.loadURL(url)`
- **功能**：加载指定的 URL 地址，通常是 HTML 文件或远程网址。
- **参数**：`url` 是字符串类型，可以是本地文件或在线网址。
- **示例**：
  
  ```javascript
  win.loadURL('https://example.com');
  ```

### 3. `win.loadFile(filePath)`
- **功能**：加载指定的本地 HTML 文件。
- **参数**：`filePath` 是本地文件的路径。
- **示例**：
  ```javascript
  win.loadFile('index.html');
  ```

### 4. `win.show()`
- **功能**：显示窗口。
- **示例**：
  ```javascript
  win.show();
  ```

### 5. `win.hide()`
- **功能**：隐藏窗口，而不会销毁它。
- **示例**：
  ```javascript
  win.hide();
  ```

### 6. `win.close()`
- **功能**：关闭窗口，并释放资源。
- **示例**：
  ```javascript
  win.close();
  ```

### 7. `win.minimize()`
- **功能**：最小化窗口。
- **示例**：
  ```javascript
  win.minimize();
  ```

### 8. `win.maximize()`
- **功能**：最大化窗口。
- **示例**：
  ```javascript
  win.maximize();
  ```

### 9. `win.unmaximize()`
- **功能**：取消窗口的最大化状态。
- **示例**：
  ```javascript
  win.unmaximize();
  ```

### 10. `win.isMaximized()`
- **功能**：检查窗口是否已经最大化。
- **返回值**：`Boolean`，返回 `true` 表示已最大化。
- **示例**：
  ```javascript
  let isMaximized = win.isMaximized();
  console.log(isMaximized); // true or false
  ```

### 11. `win.setFullScreen(flag)`
- **功能**：设置窗口是否全屏。
- **参数**：`flag` 是布尔值，`true` 表示全屏，`false` 表示退出全屏。
- **示例**：
  ```javascript
  win.setFullScreen(true);
  ```

### 12. `win.isFullScreen()`
- **功能**：检查窗口是否处于全屏状态。
- **返回值**：`Boolean`，返回 `true` 表示已全屏。
- **示例**：
  ```javascript
  let isFullScreen = win.isFullScreen();
  console.log(isFullScreen); // true or false
  ```

### 13. `win.setBounds({x, y, width, height})`
- **功能**：设置窗口的位置和大小。
- **参数**：`x` 和 `y` 表示窗口的位置，`width` 和 `height` 表示窗口的宽度和高度。
- **示例**：
  ```javascript
  win.setBounds({ x: 100, y: 100, width: 1024, height: 768 });
  ```

### 14. `win.getBounds()`
- **功能**：获取窗口的当前位置和大小。
- **返回值**：一个包含 `x`, `y`, `width`, `height` 的对象。
- **示例**：
  ```javascript
  let bounds = win.getBounds();
  console.log(bounds); // { x: 100, y: 100, width: 1024, height: 768 }
  ```

### 15. `win.setResizable(resizable)`
- **功能**：设置窗口是否可以调整大小。
- **参数**：`resizable` 是布尔值，`true` 表示允许调整，`false` 表示禁止调整。
- **示例**：
  ```javascript
  win.setResizable(false);
  ```

### 16. `win.setAlwaysOnTop(flag)`
- **功能**：设置窗口是否总是置顶。
- **参数**：`flag` 是布尔值，`true` 表示窗口置顶。
- **示例**：
  ```javascript
  win.setAlwaysOnTop(true);
  ```

### 17. `win.setSkipTaskbar(flag)`
- **功能**：设置窗口是否隐藏在任务栏中。
- **参数**：`flag` 是布尔值，`true` 表示从任务栏中隐藏窗口。
- **示例**：
  ```javascript
  win.setSkipTaskbar(true);
  ```

### 18. `win.flashFrame(flag)`
- **功能**：闪烁窗口以吸引用户注意。
- **参数**：`flag` 是布尔值，`true` 开始闪烁，`false` 停止闪烁。
- **示例**：
  ```javascript
  win.flashFrame(true);
  ```

### 19. `win.setOpacity(opacity)`
- **功能**：设置窗口的不透明度，值在 `0.0` 到 `1.0` 之间。
- **参数**：`opacity` 是浮点数，`0` 表示全透明，`1` 表示不透明。
- **示例**：
  ```javascript
  win.setOpacity(0.5); // 半透明
  ```

### 20. `win.setBackgroundColor(color)`
- **功能**：设置窗口的背景颜色。
- **参数**：`color` 是颜色字符串，例如 `#FFFFFF` 或者 `rgba(255, 255, 255, 1.0)`。
- **示例**：
  ```javascript
  win.setBackgroundColor('#FF0000'); // 设置背景为红色
  ```

### 21. `win.on(event, listener)`
- **功能**：监听窗口的特定事件，例如关闭、聚焦等。
- **参数**：`event` 是事件名称，`listener` 是事件处理函数。
- **示例**：
  
  ```javascript
  win.on('close', () => {
    console.log('Window is closing');
  });
  ```
