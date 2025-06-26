

##  Fabric.js v6 的核心变更与迁移指南：

---

### **一、架构重构**
1. **模块化导入**  
   - 弃用 `import { fabric } from 'fabric'`  
   - 新方式：  
     ```javascript
     // 按需导入
     import { Canvas, Rect, util } from 'fabric'  
     // 或全量导入
     import * as fabric from 'fabric'  
     // Node环境专用
     import { StaticCanvas } from 'fabric/node'  
     ```

2. **命名空间移除**  
   
   - `fabric.Object` → `FabricObject`  
   - `fabric.Text` → `FabricText`  
   - `fabric.Image` → `FabricImage`  
   - 引入 `classRegistry` 替代命名空间功能

---

### **二、破坏性变更**
#### **对象系统**
- **坐标系统重写**  
  - 移除 `lineCoords`，`aCoords` 改为受保护属性  
  - 所有几何方法（如 `getCoords()`, `containsPoint()`）现基于**场景平面（scene plane）**计算  
  - 新增：  
    - `getXY()/setXY()`：场景平面坐标  
    - `getRelativeXY()/setRelativeXY()`：父级平面坐标  

- **关键方法移除**  
  ```javascript
  // 废弃
  obj.center()     // 改用 canvas.centerObject()
  obj.getPointer() // 改用 getScenePoint() 或 getViewportPoint()
  obj.adjustPosition() // 改用 setPositionByOrigin()
  ```

#### **动画与交互**
- **动画系统**  
  
  - 弃用 `+=/-=` 语法和 `byValue` 选项  
  - 强制使用 `startValue/endValue` 定义动画  
  ```javascript
  // 新方式
  obj.animate('left', { 
    startValue: 10, 
    endValue: 100,
    onChange: canvas.requestRenderAll
  });
  ```
  
- **事件坐标系**  
  
  - 替换废弃属性：  
    - `absolutePointer` → `scenePoint`  
    - `pointer` → `viewportPoint`  

#### **序列化**
- **文本样式存储**  
  - `Text.styles` 序列化格式改为数组索引结构（节省空间）  
  - 运行时仍兼容旧对象格式，但**禁止直接操作样式对象**  

- **JSON处理**  
  - `toJSON()` 不再作为 `toObject()` 的别名（专用于 `JSON.stringify`）  
  - `populateWithProperties()` 改为通用 `pick()` 方法  

---

### **三、API 调整**
#### **集合操作**
| 旧方法                    | 新方法/行为                   | 变更原因                 |
| ------------------------- | ----------------------------- | ------------------------ |
| `addWithUpdate()`         | 移除，`add()` 自动更新        | 简化API                  |
| `insertAt(object, index)` | `insertAt(index, ...objects)` | 支持多对象插入           |
| `sendObjectToBack()`      | `sendToBack()`                | 统一Group/Collection逻辑 |

#### **画布控制**
- **异步销毁**  
  `canvas.dispose()` 改为异步方法（避免渲染冲突）  
- **方法移除**  
  ```javascript
  canvas.setBackgroundColor()  // 直接赋值: canvas.backgroundColor = 'red'
  canvas.straightenObject()    // 无实用价值
  ```

#### **多边形/路径**
- **尺寸计算**  
  `_setPositionDimensions()` → `setDimensions()`  
  - 底层逻辑重构（视觉位置稳定性待优化）  
- **顶点控制**  
  公开 `createPolyControls()` 方法支持自定义顶点编辑  

---

### **四、功能增强**
#### **Group 重写**
- **严格对象树**  
  对象仅允许单一父级（新增 `parent` 属性替代 `group`）  
- **布局管理器**  
  引入 `LayoutManager` 实现自适应布局（默认 `fit-content`）  
- **动态更新**  
  Group 自动响应子对象增删/修改  

#### **数学工具**
- **新增坐标系转换**  
  ```javascript
  sendObjectToPlane()  // 对象坐标系转换
  sendPointToPlane()   // 点坐标转换
  sendVectorToPlane()  // 向量坐标系转换
  ```
- **点运算优化**  
  新增 `Point.divide()`, `scalarDivide()` 等向量运算方法  

---

### **五、迁移必读**
#### **弃用警告**
1. **链式调用**  
   所有方法链式调用（如 `obj.setX(10).setY(20)`）将在 v7 移除
2. **状态管理**  
   `stateful` 和 `statefulCache` 已移除（改用事件监听）
3. **工具函数**  
   `clone()`, `extend()`, `makeElementSelectable()` 等工具函数被删除（推荐 Lodash）

#### **TypeScript**
- **内置类型**  
  移除 `@types/fabric`（源码已集成类型定义）  
- **类字段类型**  
  属性不再存在于原型（通过 `getDefaults()` 访问默认值）  

#### **React 兼容**
- **严格清理**  
  
  ```jsx
  useEffect(() => {
    const canvas = new Canvas(...);
    return () => canvas.dispose(); // 必须调用异步销毁
  }, []);
  ```
- **DOM 管理**  
  Fabric 自动清理自修改的 DOM 元素（需确保调用 `dispose()`）

---

### **六、模块变更**
| 模块        | 关键变更                                                     |
| ----------- | ------------------------------------------------------------ |
| **Brushes** | 移除 `PatternBrush.getPatternSrcFunction`（因 Pattern 重构失效） |
| **Eraser**  | 迁移至独立库 [erase2d](https://github.com/ShaMan123/erase2d) |
| **Node**    | 移除 `registerFont()`（改用 Node Canvas 原生方法）           |
| **Utils**   | 删除数组工具（`min/max/find`），由 ES6 替代                  |
| **Testing** | 迁移至 Jest + Playwright 测试框架                            |

---

### **七、重要修复方向**
1. **边界框计算**  
   多边形负坐标边界问题（Issue #8299 核心）：
   
   ```javascript
   polygon._calcDimensions(true); // 强制重算边界
   polygon.setCoords();           // 必须调用
   ```
2. **坐标偏移**  
   响应式布局中需手动更新画布偏移：
   
   ```javascript
   window.addEventListener('resize', () => {
     canvas.calcOffset(); // 重算内部坐标
   });
   ```

> 完整迁移指南见 [Fabric.js v6 Release Notes](https://github.com/fabricjs/fabric.js/wiki/V6-changes)

## Fabric.js 中文文档 

### 概述 

Fabric.js 是一个简单而强大的 JavaScript HTML5 canvas 库，用于处理 canvas 元素上的图形和交互。它提供了一个交互式的对象模型，使开发者能够轻松地在网页上操作 canvas 元素。

### 配置项 

Fabric.js 提供了多种配置项，允许开发者根据需要自定义其行为和外观。

#### 常见配置项 

当然，为了更全面地了解Fabric.js的配置项，下面我将补充一些常见的配置项及其说明。请注意，这些配置项通常用于初始化画布(`fabric.Canvas`)或画布上的对象（如矩形、圆形、文本等）。

#### Canvas 配置项 

 *  width: `Number` \- 画布的宽度，以像素为单位。
 *  height: `Number` \- 画布的高度，以像素为单位。
 *  backgroundColor: `String` \- 画布的背景颜色。可以使用十六进制颜色代码、CSS颜色名称或RGBA值。
 *  selectionColor: `String` \- 当对象被选中时的高亮颜色。
 *  selectionLineWidth: `Number` \- 选中对象边框的线宽。
 *  renderOnAddRemove: `Boolean` \- 当添加或移除对象时是否自动渲染画布。
 *  preserveObjectStacking: `Boolean` \- 是否保持对象的堆叠顺序。如果为`true`，则对象的堆叠顺序将保持不变，即后添加的对象会位于上层。
 *  selection: `Boolean` \- 是否启用对象选择功能。
 *  multiSelect: `Boolean` \- 是否允许多选。如果为`true`，用户可以通过拖动鼠标选择多个对象。
 *  perPixelTargetFind: `Boolean` \- 是否启用按像素查找目标的功能。这可以提高选择精度，但可能会影响性能。

### 方法 

Fabric.js 提供了一系列方法来操作画布和画布上的对象。

#### 初始化与创建对象 

 *  new fabric.Canvas(element)：创建并初始化一个新的画布。
 *  new fabric.Rect(\{ … \})：创建矩形对象。
 *  new fabric.Circle(\{ … \})：创建圆形对象。
 *  new fabric.Image.fromURL(url, callback)：从URL加载图像并创建图像对象。

#### Canvas 方法 

1.  初始化与配置
    
     *  `new fabric.Canvas(element, options)`：创建并初始化一个新的画布。`element` 是一个HTML元素（通常是`<canvas>`标签），`options` 是一个包含配置选项的对象。
2.  对象管理
    
     *  `add(object)`：向画布添加图形对象。
     *  `remove(object)`：从画布中移除指定的图形对象。
     *  `clear()`：清除画布上的所有图形对象。
     *  `getActiveObject()`：获取当前活动的（即被选中的）图形对象。
     *  `getActiveGroup()`：获取当前活动的图形对象组（如果有的话）。
     *  `deactivateAll()`：取消选择画布上的所有图形对象。
     *  `deactivateAllWithDispatch()`：与 `deactivateAll()` 类似，但会触发 `selection:cleared` 事件。
     *  `forEachObject(callback, context)`：遍历画布上的所有图形对象，并对每个对象执行回调函数。
3.  渲染与重绘
    
     *  `renderAll()`：重新渲染画布上的所有图形对象。
     *  `requestRenderAll()`：请求重新渲染画布，但可能会延迟执行以提高性能。
     *  `renderTop()`：仅渲染画布的顶层对象，通常用于快速更新画布的一小部分。
4.  事件处理
    
     *  `on(eventName, callback)`：为画布添加事件监听器。
     *  `off(eventName, callback)`：移除画布上的事件监听器。
     *  `fire(eventName, options)`：触发画布上的自定义事件。
5.  序列化与反序列化
    
     *  `toJSON([propertiesToInclude])`：将画布上的所有图形对象序列化为JSON字符串。可选的 `propertiesToInclude` 参数用于指定哪些属性应该被包含在序列化结果中。
     *  `loadFromJSON(json, callback)`：从JSON字符串加载图形对象到画布上。`callback` 函数在加载完成后被调用。
     *  `loadFromDatalessJSON(json, callback)`：与 `loadFromJSON` 类似，但用于加载不包含 `sourcePath` 属性的JSON数据（即“无数据源”的JSON）。
6.  视图与变换
    
     *  `viewportTransform`：获取或设置画布的视口变换矩阵。
     *  `calcOffset()`：计算画布相对于其定位容器的偏移量。
     *  `zoomToPoint(point, value)`：以指定点为中心进行缩放。
7.  尺寸与边界
    
     *  `setHeight(height)` 和 `setWidth(width)`：设置画布的宽度和高度。
     *  `setHeight(height, options)` 和 `setWidth(width, options)`：同上，但允许通过 `options` 参数指定额外的行为（如是否重新渲染画布）。
     *  `getElement()`：获取画布对应的DOM元素（即`<canvas>`标签）。

### 对象类型 

Fabric.js 支持多种对象类型，每种类型都有其特定的用途和配置。

#### 矩形（Rect） 

用于在画布上绘制矩形。

以下是矩形（`Rect`）对象在Fabric.js中的一些常见配置项和方法。

##### 矩形（Rect）配置项 

 *  left: `Number` \- 矩形左上角的X坐标。这决定了矩形在画布上的水平位置。
 *  top: `Number` \- 矩形左上角的Y坐标。这决定了矩形在画布上的垂直位置。
 *  width: `Number` \- 矩形的宽度。单位是像素。
 *  height: `Number` \- 矩形的高度。单位也是像素。
 *  fill: `String` \- 矩形的填充颜色。可以使用十六进制颜色代码、CSS颜色名称或RGBA值。
 *  stroke: `String` \- 矩形边框的颜色。如果设置为`null`或`undefined`，则不显示边框。
 *  strokeWidth: `Number` \- 矩形边框的线宽。单位是像素。如果`stroke`未设置或设置为`null`，则此属性无效。
 *  strokeDashArray: `Array` \- 定义矩形边框的虚线模式。例如，`[5, 5]`表示边框由5个单位的实线和5个单位的空格交替组成。如果未设置，则边框为实线。
 *  rx: `Number` \- 矩形圆角的X轴半径。如果设置此值，矩形的四个角将变为圆角。
 *  ry: `Number` \- 矩形圆角的Y轴半径。通常与`rx`相同以创建圆形角，但也可以单独设置以创建椭圆形角。
 *  angle: `Number` \- 矩形旋转的角度（以度为单位）。正值表示顺时针旋转，负值表示逆时针旋转。
 *  opacity: `Number` \- 矩形的透明度。范围是0（完全透明）到1（完全不透明）。
 *  selectable: `Boolean` \- 矩形是否可选。如果设置为`false`，则用户无法通过鼠标点击或拖动来选择该矩形。
 *  hasControls: `Boolean` \- 是否在矩形上显示控制点（用于调整大小、旋转等）。如果设置为`false`，则不会显示这些控制点。
 *  lockMovementX: `Boolean` \- 是否锁定矩形在X轴上的移动。如果设置为`true`，则用户无法通过拖动来改变矩形的水平位置。
 *  lockMovementY: `Boolean` \- 是否锁定矩形在Y轴上的移动。如果设置为`true`，则用户无法通过拖动来改变矩形的垂直位置。

##### 矩形（Rect）方法 

 *  set(\{…properties\}): 用于同时设置多个属性。接受一个对象作为参数，对象的键是属性名，值是希望设置的新值。
    
    ```java
    rect.set({
      left: 100,
      top: 100,
      fill: 'red'
    });
    ```
 *  scale(scaleX, scaleY): 按比例缩放矩形。`scaleX`和`scaleY`分别是X轴和Y轴的缩放比例。
    
    ```java
    rect.scale(2, 1); // 水平方向放大2倍，垂直方向不变
    ```
 *  rotate(degree): 旋转矩形指定的度数。正值表示顺时针旋转，负值表示逆时针旋转。
    
    ```java
    rect.rotate(45); // 顺时针旋转45度
    ```
 *  moveTo(index): 将矩形移动到画布上对象的指定索引位置。注意，这会影响对象的堆叠顺序。
    
    ```java
    canvas.moveTo(rect, 0); // 将矩形移动到画布上的第一个位置
    ```
 *  clone(): 克隆矩形对象，返回一个新的矩形实例，其所有属性都与原始矩形相同，但独立于原始矩形。
    
    ```java
    const clonedRect = rect.clone();
    canvas.add(clonedRect); // 将克隆的矩形添加到画布上
    ```

请注意，上述方法是Fabric.js中所有图形对象共有的通用方法的一部分，但矩形（`Rect`）对象也有其特定的配置项，如`rx`和`ry`，用于创建圆角矩形。

##### 矩形（Rect）示例 

```java
<!DOCTYPE html>  
<html lang="en">  
<head>  
    <meta charset="UTF-8">  
    <title>Fabric.js Rectangle Example</title>  
    <script src="https://cdnjs.cloudflare.com/ajax/libs/fabric.js/4.5.1/fabric.min.js"></script>  
    <style>  
        canvas {
              
     
       
         
            border: 1px solid black;  
        }  
    </style>  
</head>  
<body>  
    <canvas id="c" width="600" height="400"></canvas>  
    <script src="app.js"></script>  
    <script>
    // 初始化画布  
    var canvas = new fabric.Canvas('c');  
      
    // 创建一个矩形对象  
    var rect = new fabric.Rect({
              
     
       
         
      left: 100,  
      top: 100,  
      fill: 'red', // 填充颜色  
      width: 200, // 宽度  
      height: 100, // 高度  
      stroke: 'black', // 边框颜色  
      strokeWidth: 5 // 边框宽度  
    });  
      
    // 将矩形添加到画布上  
    canvas.add(rect);
    </script>
</body>  
</html>
```

#### 圆形（Circle） 

用于在画布上绘制圆形。

 *  配置项:  
    以下是圆形（`Circle`）对象在Fabric.js中的一些常见配置项和方法

##### 圆形（Circle）配置项 

 *  left: `Number` \- 圆心左侧的X坐标。这决定了圆形在画布上的水平位置。
 *  top: `Number` \- 圆心顶部的Y坐标。这决定了圆形在画布上的垂直位置。
 *  radius: `Number` \- 圆形的半径。单位是像素。
 *  fill: `String` \- 圆形的填充颜色。可以使用十六进制颜色代码、CSS颜色名称或RGBA值。
 *  stroke: `String` \- 圆形边框的颜色。如果设置为`null`或`undefined`，则不显示边框。
 *  strokeWidth: `Number` \- 圆形边框的线宽。单位是像素。如果`stroke`未设置或设置为`null`，则此属性无效。
 *  strokeDashArray: `Array` \- 定义圆形边框的虚线模式。与矩形相同，如果未设置，则边框为实线。
 *  startAngle: `Number` \- 圆形起始绘制角度（以弧度为单位）。用于创建扇形等形状。
 *  endAngle: `Number` \- 圆形结束绘制角度（以弧度为单位）。与`startAngle`一起使用以定义扇形的角度范围。
 *  originX/originY: `String` \- 控制对象缩放的基点。默认为`'center'`，表示缩放时围绕圆心进行。
 *  opacity: `Number` \- 圆形的透明度。范围是0（完全透明）到1（完全不透明）。
 *  selectable: `Boolean` \- 圆形是否可选。
 *  hasControls: `Boolean` \- 是否在圆形上显示控制点。
 *  lockScalingFlip: `Boolean` \- 缩放时是否允许翻转。对于圆形来说，这通常不是必要的，因为圆形是对称的。

##### 圆形（Circle）方法 

在Fabric.js中，圆形（`fabric.Circle`）对象继承自`fabric.Object`，因此它拥有`fabric.Object`及其父类定义的所有方法。不过，对于圆形来说，并没有特定的、专为其设计的方法，因为其操作（如移动、缩放、旋转等）都是通过继承自`fabric.Object`的方法来实现的。

1.  set(property, value) 或 set(\{…properties\})
    
     *  用于设置对象的属性。可以接受单个属性和值作为参数，或者一个包含多个属性和值的对象。
2.  get(property)
    
     *  用于获取对象的某个属性值。
3.  moveTo(left, top)
    
     *  将对象移动到画布上的指定位置。
4.  scale(scaleX, scaleY)
    
     *  按指定比例缩放对象。如果只提供一个参数，则默认在X和Y方向上进行等比例缩放。
5.  scaleToWidth(width) 和 scaleToHeight(height)
    
     *  分别将对象缩放到指定的宽度或高度，保持对象的宽高比不变。
6.  rotate(angle)
    
     *  按指定角度旋转对象。角度以度为单位，正值表示顺时针旋转，负值表示逆时针旋转。
7.  skew(x, y)
    
     *  对对象进行倾斜变换。参数`x`和`y`分别表示在X轴和Y轴方向上的倾斜角度（以度为单位）。
8.  flipX() 和 flipY()
    
     *  分别在X轴或Y轴上翻转对象。
9.  setOpacity(opacity)
    
     *  设置对象的透明度。透明度值应该在0（完全透明）到1（完全不透明）之间。
10. setCoords()
    
     *  手动更新对象的坐标缓存。这通常是在对象的位置、尺寸或形状发生变化后调用的，以确保进一步的交互（如拖动、缩放）能够正确进行。
11. toObject(\[propertiesToInclude\])
    
     *  将对象序列化为一个JSON对象。可以接受一个可选的参数来指定要序列化的属性。
12. toSVG()
    
     *  将对象导出为SVG格式的字符串。

需要注意的是，圆形对象的一些属性（如`radius`、`startAngle`、`endAngle`）在调用某些方法（如`scale`、`rotate`）时可能会被自动更新，以反映对象当前的状态。

对于圆形特有的操作，主要是通过设置`startAngle`和`endAngle`属性来创建扇形形状，但这并不是通过特定的方法实现的，而是通过直接设置属性来完成的。此外，圆形对象也可以使用`fabric.Canvas`提供的方法来与其他对象进行交互，如选择、拖动、分组等。

##### 创建扇形示例 

要创建一个扇形而不是完整的圆形，你可以设置`startAngle`和`endAngle`属性。请注意，这些角度是以弧度为单位的，因此你可能需要使用`Math.PI`（π的弧度值）来计算所需的角度。

```java
// 初始化画布
var canvas = new fabric.Canvas('c');

// 创建一个扇形（作为圆形的一部分）
var sector = new fabric.Circle({
            
   
     
     
  left: 100,
  top: 100,
  radius: 100,
  fill: 'none', // 无填充颜色
  stroke: 'red', // 边框颜色为红色
  strokeWidth: 5, // 边框宽度为5像素
  startAngle: -Math.PI / 4, // 从-45度（π/4弧度）开始
  endAngle: Math.PI / 2, // 到90度结束（π/2弧度）
  originX: 'center', // 缩放基点为圆心
  originY: 'center'
});

// 将扇形添加到画布上
canvas.add(sector);
```

在这个例子中，我们创建了一个`fabric.Circle`对象，但通过设置`startAngle`和`endAngle`属性，我们实际上创建了一个扇形而不是完整的圆形。我们还设置了无填充颜色（`fill: 'none'`），以便只显示边框。这样，我们就得到了一个红色的扇形。

#### 文本（Text） 

用于在画布上添加文本。

 *  配置项:  
    在Fabric.js中，`fabric.Text`对象的配置项允许你高度自定义文本的外观和行为。以下是一些关键的配置项列表，它们允许你详细指定文本的各个方面：

##### 文本（Text）配置项 

 *  text: `String` \- 要显示在画布上的文本内容。
 *  fontSize: `Number` \- 文本的字体大小，以像素为单位。
 *  fontFamily: `String` \- 文本的字体族。可以指定具体的字体名称，如"Arial", "Times New Roman"等。
 *  fontWeight: `String` \- 文本的字体粗细，如"normal"（正常）、“bold”（粗体）等。
 *  fontStyle: `String` \- 文本的字体样式，如"normal"（正常）、“italic”（斜体）等。
 *  fill: `String` \- 文本的颜色，可以是十六进制颜色代码（如"\#FF0000"）、颜色名称（如"red"）或RGBA值（如"rgba(255, 0, 0, 0.5)"）。
 *  stroke: `String` \- 文本的描边颜色，与`fill`相同，可以是十六进制颜色代码、颜色名称或RGBA值。如果未设置或设置为`null`，则不显示描边。
 *  strokeWidth: `Number` \- 文本描边的线宽，以像素为单位。
 *  textAlign: `String` \- 文本的水平对齐方式，可以是"left"（左对齐）、“center”（居中对齐）、“right”（右对齐）或"justify"（两端对齐，但Fabric.js可能不完全支持此对齐方式）。
 *  lineHeight: `Number` \- 文本的行高，控制文本行之间的垂直间距。通常与`fontSize`相关。
 *  textBackgroundColor: `String` \- 文本的背景色，与`fill`属性相同，用于设置文本背后的颜色或渐变。
 *  left: `Number` \- 文本左侧边缘的X坐标。
 *  top: `Number` \- 文本顶部边缘的Y坐标。
 *  originX/originY: `String` \- 定义对象位置的基点，可以是"left"、“center”、“right”、“top”、"bottom"或数值（相对于对象的宽度或高度）。这影响对象的定位方式。
 *  visible: `Boolean` \- 控制文本对象是否可见。
 *  editable: `Boolean` \- 指定文本对象是否可编辑。如果设置为`true`，则允许用户通过输入框直接编辑文本内容。
 *  selectable: `Boolean` \- 控制文本对象是否可选。如果设置为`true`，则允许用户通过鼠标拖动选择文本。
 *  hasControls: `Boolean` \- 控制对象边界框上是否显示控制手柄，允许用户通过拖动这些手柄来变换对象。
 *  width: `Number` \- 可以设置文本的固定宽度，这会影响文本的换行和布局。
 *  charSpacing: `Number` \- 字符间距，以像素为单位，用于调整字符之间的水平间距。

请注意，虽然这里列出了许多配置项，但并不是所有配置项都必须在创建文本对象时指定。你可以根据需要设置必要的配置项，以满足你的布局和设计需求。同时，由于Fabric.js的版本更新，可能会有新的配置项被添加或旧的配置项被弃用，因此建议查阅最新的Fabric.js文档以获取最准确的信息。

##### 文本（Text）方法 

在Fabric.js中，`fabric.Text`对象继承自`fabric.Object`，因此它拥有`fabric.Object`提供的所有方法，同时也拥有一些特定于文本的方法。以下是一些常见的`fabric.Text`方法：

1.  setText(text: string): 设置文本内容。
    
     *  参数：`text`（字符串） - 新的文本内容。
2.  setFontSize(fontSize: number): 设置文本的字体大小。
    
     *  参数：`fontSize`（数字） - 新的字体大小（以像素为单位）。
3.  setFontFamily(fontFamily: string): 设置文本的字体族。
    
     *  参数：`fontFamily`（字符串） - 新的字体族名称。
4.  setFontWeight(fontWeight: string): 设置文本的字体粗细。
    
     *  参数：`fontWeight`（字符串） - 如"bold"、"normal"等。
5.  setFontStyle(fontStyle: string): 设置文本的字体样式。
    
     *  参数：`fontStyle`（字符串） - 如"italic"、"normal"等。
6.  setFill(color: string): 设置文本的填充颜色。
    
     *  参数：`color`（字符串） - 十六进制颜色代码、颜色名称或RGBA值。
7.  setStroke(color: string, width: number, lineCap?: string, lineJoin?: string): 设置文本的描边颜色、线宽、线帽样式和线连接样式。
    
     *  参数：
        
         *  `color`（字符串）：描边颜色。
         *  `width`（数字）：描边线宽。
         *  `lineCap`（可选，字符串）：线帽样式，如"butt"、“round”、“square”。
         *  `lineJoin`（可选，字符串）：线连接样式，如"miter"、“round”、“bevel”。
8.  setTextAlign(alignment: string): 设置文本的水平对齐方式。
    
     *  参数：`alignment`（字符串） - 如"left"、“center”、“right”。
9.  setLineHeight(lineHeight: number): 设置文本的行高。
    
     *  参数：`lineHeight`（数字） - 新的行高值。
10. setTextBackgroundColor(color: string): 设置文本的背景色。
    
     *  参数：`color`（字符串） - 十六进制颜色代码、颜色名称或RGBA值。
11. setEditable(editable: boolean): 设置文本是否可编辑。
    
     *  参数：`editable`（布尔值） - 如果为`true`，则文本可编辑。
12. fromObject(object: Object, callback?: Function): 使用JSON对象创建一个新的`fabric.Text`实例。这个方法主要用于从序列化数据中恢复文本对象。
    
     *  参数：
        
         *  `object`（对象）：包含文本对象属性的JSON对象。
         *  `callback`（可选，函数）：在对象创建后调用的回调函数。
13. toObject(\[propertiesToInclude\]): 将文本对象序列化为JSON对象。可以指定要包含的属性。
    
     *  参数：`propertiesToInclude`（可选，数组/字符串）：指定要序列化的属性名称列表或通配符（如`'*'`）以包含所有属性。

请注意，由于Fabric.js的API可能会随着版本的更新而发生变化，因此建议查阅最新的Fabric.js文档以获取最准确的信息。

此外，`fabric.Text`还继承了`fabric.Object`的所有方法，如`set`、`get`、`moveTo`、`scale`、`rotate`等，这些方法允许你对文本对象进行更广泛的变换和操作。

##### 文本（Text）示例 

```java
// 首先，初始化一个画布  
var canvas = new fabric.Canvas('myCanvas'); // 假设你的<canvas>元素有一个id="myCanvas"  
  
// 创建一个新的fabric.Text实例  
var textSample = new fabric.Text('Hello, world!', {
            
   
     
       
  left: 100, // 文本左侧的位置  
  top: 100,  // 文本顶部的位置  
  fontSize: 30, // 文本字体大小  
  fill: '#333', // 文本颜色  
  fontFamily: 'arial' // 文本字体  
});  
  
// 将文本对象添加到画布上  
canvas.add(textSample);
```

#### 图片（Image） 

用于在画布上添加图片。

 *  配置项:  
    在Fabric.js中，`fabric.Image`对象继承自`fabric.Object`，因此它具有许多可以配置的属性和方法。以下是一些常见的`fabric.Image`配置选项，这些选项可以在创建或修改`fabric.Image`实例时设置：

##### 图片（Image）配置项 

 *  基本属性：
    
     *  `left`：图片的左边界位置。
     *  `top`：图片的上边界位置。
     *  `width`：图片的宽度（如果设置了，则图片会被缩放以适应此宽度）。
     *  `height`：图片的高度（如果设置了，则图片会被缩放以适应此高度）。
     *  `scaleX`：图片在X轴方向上的缩放比例。
     *  `scaleY`：图片在Y轴方向上的缩放比例。
 *  旋转与倾斜：
    
     *  `angle`：图片旋转的角度（以度为单位）。
     *  `skewX`：图片在X轴方向上的倾斜角度。
     *  `skewY`：图片在Y轴方向上的倾斜角度。
 *  位置与对齐：
    
     *  `originX`、`originY`：控制图片缩放和旋转的基点。可以是`'left'`、`'center'`或`'right'`（对于`originX`）和`'top'`、`'center'`或`'bottom'`（对于`originY`）。
     *  `centeredRotation`：如果为`true`，则旋转将围绕图片的中心点进行。
 *  样式：
    
     *  `opacity`：图片的透明度（0到1之间的值）。
     *  `fill`：虽然通常用于设置颜色，但在`fabric.Image`中通常不直接设置，因为图片本身具有颜色。但可以通过滤镜（如`BlendColor`）来改变图片的颜色。
     *  `stroke`：图片边框的颜色和宽度。虽然通常不给图片设置边框，但这个属性是存在的。
     *  `strokeWidth`：图片边框的宽度。
 *  剪裁与裁剪：
    
     *  在Fabric.js中，虽然`fabric.Image`对象本身没有直接的裁剪属性，但你可以通过其他方式（如使用`clipPath`）来实现裁剪效果。
 *  滤镜：
    
     *  Fabric.js支持对图片应用各种滤镜效果，如模糊、灰度、色彩调整等。你可以通过`filters`数组来添加滤镜。
 *  交互性：
    
     *  `selectable`：如果为`true`，则图片可以被选中并进行移动、缩放等操作。
     *  `evented`：如果为`true`，则图片将触发事件（如点击、移动等）。
 *  其他：
    
     *  `crossOrigin`：处理跨域图片时使用的CORS设置。
     *  `src`：图片的源URL（注意，在直接使用`new fabric.Image`构造函数时通常不设置此属性，而是通过`fabric.Image.fromURL`方法加载图片）。

请注意，当你使用`fabric.Image.fromURL`方法来加载图片时，一些属性（如`left`、`top`、`width`、`height`等）可以在回调函数中设置，因为此时图片对象已经被创建但尚未添加到画布上。

以下是一个设置图片配置的例子：

```java
fabric.Image.fromURL('path/to/your-image.jpg', function(img) {
            
   
     
     
  // 设置图片的基本属性
  img.set({
            
   
     
     
    left: 100,
    top: 100,
    angle: 30, // 旋转30度
    scaleX: 0.8, // 在X轴上缩小到80%
    scaleY: 1.2, // 在Y轴上放大到120%
    opacity: 0.7, // 设置透明度
    selectable: true, // 允许选中图片
    evented: true, // 允许图片触发事件
    // 可以继续添加其他属性...
  });

  // 添加滤镜（例如，灰度滤镜）
  img.filters.push(new fabric.ColorMatrix({
            
   
     
     
    type: 'grayscale'
  }));
  img.applyFilters(); // 应用滤镜

  // 将图片添加到画布
  canvas.add(img);
});
```

在这个例子中，我们使用`fabric.Image.fromURL`来加载图片，并在回调函数中设置了多个配置属性，包括位置、旋转、缩放、透明度、可选性和事件性。此外，我们还添加了一个灰度滤镜并应用到图片上。

##### 图片（Image）方法 

在Fabric.js中，`fabric.Image`对象继承自`fabric.Object`，因此它拥有许多内置的方法，这些方法可以用于操作图片对象。以下是一些常用的`fabric.Image`方法：

1.  `set(property, value)`：
    
     *  用于设置图片对象的属性。如果传入一个对象，则可以一次性设置多个属性。
     *  示例：`img.set({ left: 100, top: 100 });`
2.  `scale(sX, sY)`：
    
     *  用于按给定的比例缩放图片对象。`sX`是X轴方向上的缩放比例，`sY`是Y轴方向上的缩放比例。
     *  注意：这个方法会直接修改对象的`scaleX`和`scaleY`属性。
     *  示例：`img.scale(0.5, 0.5);` // 将图片在X和Y方向上缩小到原来的一半大小。
3.  `rotate(angle)`：
    
     *  用于旋转图片对象。`angle`是旋转的角度（以度为单位）。正值表示顺时针旋转，负值表示逆时针旋转。
     *  注意：这个方法会直接修改对象的`angle`属性。
     *  示例：`img.rotate(45);` // 将图片顺时针旋转45度。
4.  `moveTo(left, top)`：
    
     *  用于移动图片对象到画布上的指定位置。`left`和`top`分别表示新位置的X和Y坐标。
     *  注意：这个方法会直接修改对象的`left`和`top`属性。
     *  示例：`img.moveTo(150, 200);`
5.  `skewX(angle)` 和 `skewY(angle)`：
    
     *  分别用于在X轴和Y轴方向上倾斜图片对象。`angle`是倾斜的角度（以度为单位）。
     *  注意：这些方法会直接修改对象的`skewX`和`skewY`属性。
     *  示例：`img.skewX(10);` // 在X轴方向上倾斜图片10度。
6.  `setCoords()`：
    
     *  用于更新图片对象的边界框坐标。这个方法通常在手动修改图片位置、大小或旋转等属性后调用，以确保边界框正确反映对象的当前状态。
     *  示例：`img.set({ left: 200 }).setCoords();`
7.  `moveToCenter()`：
    
     *  将图片对象移动到画布的中心位置。注意，这个方法可能不是`fabric.Image`类直接提供的方法，但可以通过设置`left`和`top`属性为画布中心位置的值来模拟这一行为。
     *  示例（模拟）：`img.set({ left: canvas.width / 2, top: canvas.height / 2 });`
8.  `clone(deep)`：
    
     *  用于克隆图片对象。`deep`参数指定是否进行深克隆（包括对象的所有子对象）。对于`fabric.Image`，通常不需要深克隆，因为图片对象通常不包含子对象。
     *  示例：`var clonedImg = img.clone();`
9.  `toDataURL(options)`：
    
     *  用于将图片对象导出为DataURL格式。`options`是一个对象，可以包含多个选项，如格式（`format`）、质量（`quality`，仅JPEG格式有效）等。
     *  示例：`var dataURL = img.toDataURL({ format: 'png', quality: 0.8 });`

请注意，不是所有上述方法都是`fabric.Image`类特有的，其中一些（如`set`、`clone`）是继承自`fabric.Object`的方法。此外，由于Fabric.js是一个活跃的开源项目，其功能可能会随着版本的更新而发生变化，因此建议查阅最新的Fabric.js文档以获取最准确的信息。

##### 图片（Image）示例 

```java
// 首先，初始化一个画布  
var canvas = new fabric.Canvas('myCanvas'); // 假设你的<canvas>元素有一个id="myCanvas"  
  
// 创建一个新的fabric.Image实例  
fabric.Image.fromURL('path/to/your-image.jpg', function(img) {
            
   
     
       
  // 设置图片的位置和大小  
  img.set({
            
   
     
       
    left: 100,  
    top: 100,  
    angle: 30, // 可选：旋转角度  
    opacity: 0.85 // 可选：透明度  
  });  
  
  // 将图片对象添加到画布上  
  canvas.add(img);  
});
```

### 事件 

Fabric.js 提供了丰富的事件来处理用户的交互，如选择、移动、缩放等。

#### Fabric.js常见事件 

1.  `object:added`：当对象被添加到画布上时触发。
2.  `object:removed`：当对象从画布中移除时触发。
3.  `object:moving`：当对象正在移动时触发。这通常发生在鼠标拖动对象时。
4.  `object:scaling`：当对象正在被缩放时触发。
5.  `object:rotating`：当对象正在被旋转时触发。
6.  `object:modified`：当对象的属性（如位置、尺寸、角度等）被修改时触发。
7.  `object:selected`：当对象被选中时触发。
8.  `object:deselected`：当对象被取消选中时触发。
9.  `selection:created`：当一个新的选择集被创建时触发。
10. `selection:updated`：当选择集中的对象发生变化时触发。
11. `selection:cleared`：当选择集被清除时触发，即没有任何对象被选中时。
12. `path:created`：当一个新的路径对象被创建时触发。
13. `mouse:down`、`mouse:up`、`mouse:move`、`mouse:over`、`mouse:out`：这些是与鼠标事件相关的事件，用于监听画布上的鼠标活动。
14. `before:selection:cleared`、`before:selection:created`、`before:object:modified` 等带有 `before:` 前缀的事件：这些事件在对应操作发生之前触发，允许你在操作实际执行之前进行干预或取消操作。

### 总结 

Fabric.js 是一个功能强大的 canvas 库，它提供了一套丰富的 API 来操作 canvas 元素和上面的对象。通过配置项、方法和事件，开发者可以轻松地在网页上实现复杂的图形和交互设计。上述文档简要介绍了 Fabric.js 的一些基本用法和配置，更多高级功能和细节请参考官方文档。