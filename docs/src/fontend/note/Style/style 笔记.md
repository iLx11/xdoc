### 使用 CSS @property 实现背景色渐变动画

```css
 @property --colorA {
  syntax: '<color>';
  inherits: false;
  initial-value: fuchsia;
}
@property --colorC {
  syntax: '<color>';
  inherits: false;
  initial-value: #f79188;
}
@property --colorF {
  syntax: '<color>';
  inherits: false;
  initial-value: red;
}
div {
    background: linear-gradient(45deg,
        var(--colorA),
        var(--colorC),
        var(--colorF));
    animation: change 10s infinite linear;
}

@keyframes change {
    20% {
        --colorA: red;
        --colorC: #a93ee0;
        --colorF: fuchsia;
    }
    40% {
        --colorA: #ff3c41;
        --colorC: #e228a0;
        --colorF: #2e4c96;
    }
    60% {
        --colorA: orange;
        --colorC: green;
        --colorF: teal;
    }
    80% {
        --colorA: #ae63e4;
        --colorC: #0ebeff;
        --colorF: #efc371;
    }
}

```



### 实现渐隐

```css
mask: linear-gradient(90deg, #000 70%, transparent);
```

### 叠加多层遮罩时

```css
{
    -webkit-mask-composite: clear; /*清除，不显示任何遮罩*/
    -webkit-mask-composite: copy; /*只显示上方遮罩，不显示下方遮罩*/
    -webkit-mask-composite: source-over; 
    -webkit-mask-composite: source-in; /*只显示重合的地方*/
    -webkit-mask-composite: source-out; /*只显示上方遮罩，重合的地方不显示*/
    -webkit-mask-composite: source-atop;
    -webkit-mask-composite: destination-over;
    -webkit-mask-composite: destination-in; /*只显示重合的地方*/
    -webkit-mask-composite: destination-out;/*只显示下方遮罩，重合的地方不显示*/
    -webkit-mask-composite: destination-atop;
    -webkit-mask-composite: xor; /*只显示不重合的地方*/
}
```

标准的规范其实只支持如下 4 种模式：

```css
{
    /* Keyword values */
    /* 合并形状 */
    mask-composite: add;
    /* 减去顶层形状 */
    mask-composite: subtract;
    /* 重叠形状 */
    mask-composite: intersect;
    /* 排除重叠形状 */
    mask-composite: exclude;
}
```

### 多个元素根据鼠标 3D 移动

`requestAnimationFrame` 用来优化代码

```js
const MULTIPLE = 6
const eleArr = ['.div5', '.div6', '.div7', '.div8']
const transRotate = (x, y, i) => {
  const element = document.querySelector(eleArr[i])
  let box = element.getBoundingClientRect()
  let calcX, calcY
  calcY = (x - box.x - box.width / 2) / MULTIPLE
  calcX = ((y - box.y - box.height / 2) / MULTIPLE) * -1
  element.style.transform =
    'rotateX(' + calcX + 'deg) ' + 'rotateY(' + calcY + 'deg) '
}

const mouseInA = (e, i) => {
  window.requestAnimationFrame(function () {
    transRotate(e.clientX, e.clientY, i)
  })
}
const mouseOutA = (i) => {
  const element = document.querySelector(eleArr[i])
  window.requestAnimationFrame(function () {
    element.style.transform = 'rotateX(0) rotateY(0)'
  })
}
```

#### 元素添加样式

```css
transform-style: preserve-3d;
```

#### 视差效果增加样式

```css
transform: translateZ(xxxx);
// 可以按情况调整一下中心点
transform-origin: left top;
```

### 元素挖圆孔

```css
 background-image: radial-gradient(circle at 10px -5px, transparent 12px, #fff 13px, #fff 20px);
```



## filter

### `blur()`

- **描述**：对图像应用模糊效果。
- **参数/值类型**：`<length>`，表示模糊半径。
- **取值范围/说明**：值越大，模糊效果越明显。

### `brightness()`

- **描述**：调整图像的亮度。
- **参数/值类型**：`<percentage>` 或 `<number>`，表示亮度百分比或倍数。
- **取值范围/说明**：`0%` 会使图像完全变黑，`100%`（或`1`）表示原始亮度，超过`100%`会使图像变亮。

### `contrast()`

- **描述**：调整图像的对比度。
- **参数/值类型**：`<percentage>` 或 `<number>`，表示对比度百分比或倍数。
- **取值范围/说明**：`0%` 会使图像完全变灰，`100%`（或`1`）表示原始对比度，超过`100%`会增加对比度。

### `drop-shadow()`

- **描述**：给图像添加一个阴影效果。
- **参数/值类型**：`<offset-x> <offset-y> <blur-radius> <color>`，分别表示阴影的水平偏移、垂直偏移、模糊半径和颜色。
- **取值范围/说明**：`offset-x` 和 `offset-y` 可以是负值，`blur-radius` 和 `color` 是可选的。

### `grayscale()`

- **描述**：将图像转换为灰度图像。
- **参数/值类型**：`<percentage>` 或 `<number>`，表示灰度转换的百分比或倍数。
- **取值范围/说明**：`0%`（或`0`）表示原始彩色图像，`100%`（或`1`）表示完全灰度图像。

### `hue-rotate()`

- **描述**：给图像应用色相旋转。
- **参数/值类型**：`<angle>`，表示旋转的角度。
- **取值范围/说明**：`0deg` 表示原始色相，正值表示顺时针旋转，负值表示逆时针旋转。

### `invert()`

- **描述**：反转图像中的颜色。
- **参数/值类型**：`<percentage>` 或 `<number>`，表示反转的百分比或倍数。
- **取值范围/说明**：`0%`（或`0`）表示原始颜色，`100%`（或`1`）表示完全反转颜色。

### `opacity()`

- **描述**：调整图像的透明度。
- **参数/值类型**：`<percentage>` 或 `<number>`，表示透明度百分比或倍数。
- **取值范围/说明**：`0%` 会使图像完全透明，`100%`（或`1`）表示原始透明度。

### `saturate()`

- **描述**：调整图像的饱和度。
- **参数/值类型**：`<percentage>` 或 `<number>`，表示饱和度百分比或倍数。
- **取值范围/说明**：`0%` 会使图像完全去色（灰度），`100%`（或`1`）表示原始饱和度，超过`100%`会增加饱和度。

### `sepia()`

- **描述**：将图像转换为棕褐色调。
- **参数/值类型**：`<percentage>` 或 `<number>`，表示棕褐色转换的百分比或倍数。
- **取值范围/说明**：`0%`（或`0`）表示原始颜色，`100%`（或`1`）表示完全棕褐色调。

## mask

### `mask-image`

- **描述**：设置用于遮罩的图像。
- **参数/值类型**：`<image>`（可以是URL、渐变、颜色等）。
- **取值范围/说明**：可以是任何CSS图像值，包括URL指向的图像文件、渐变、颜色等。

### `mask-mode`

- **描述**：设置遮罩图像的模式。
- **参数/值类型**：`match-source`（默认）、`luminance`、`alpha`、`paint`（实验性功能）。
- **取值范围/说明**：根据图像的源类型或亮度、Alpha通道等信息选择模式。

### `mask-repeat`

- **描述**：设置遮罩图像是否及如何重复。
- **参数/值类型**：`repeat`（默认）、`no-repeat`、`repeat-x`、`repeat-y`、`space`、`round`。
- **取值范围/说明**：控制遮罩图像在元素背景区域中的重复方式。

### `mask-position`

- **描述**：设置遮罩图像的位置。
- **参数/值类型**：`<position>`（可以是两个或四个值，分别表示水平/垂直位置或四个角的偏移）。
- **取值范围/说明**：使用百分比、长度值、关键字（如`center`、`top`、`bottom`、`left`、`right`）来指定位置。

### `mask-clip`

- **描述**：设置遮罩的作用区域。
- **参数/值类型**：`border-box`（默认）、`padding-box`、`content-box`、`text`（实验性功能）。
- **取值范围/说明**：控制遮罩应用于元素的哪个部分（边框、内边距、内容或文本）。

### `mask-origin`

- **描述**：设置遮罩图像的定位原点。
- **参数/值类型**：`border-box`（默认）、`padding-box`、`content-box`。
- **取值范围/说明**：与`mask-clip`类似，但控制的是遮罩图像的定位原点。

### `mask-size`

- **描述**：设置遮罩图像的大小。
- **参数/值类型**：`<size>`（可以是两个值，分别表示宽度和高度；也可以是`auto`、`cover`、`contain`等）。
- **取值范围/说明**：控制遮罩图像的大小和缩放方式。

### `mask-composite`

- **描述**：设置多个遮罩层如何组合在一起（实验性功能）。
- **参数/值类型**：`add`（默认）、`subtract`、`intersect`、`exclude`、`lighten`、`darken`、`hue`、`saturation`、`color`、`luminosity`。
- **取值范围/说明**：控制多个遮罩层如何组合，以实现不同的视觉效果。

## clip-path

可以做圆形或其他形状动画

### 基本语法与取值

```css
clip-path: <shape> | <external-reference> | none;
```

- `<shape>`

  ：定义裁剪区域的形状

  - **圆形**（`circle()`）
  - **椭圆形**（`ellipse()`）
  - **多边形**（`polygon()`）
  - **SVG 路径**（`path()`）
  - **内嵌矩形**（`inset()`，部分浏览器支持）

- **`<external-reference>`**：引用一个外部 SVG 元素来定义裁剪区域

- **`none`**：默认值，表示不进行裁剪，元素完整显示

#### 

### **圆形（`circle()`）**

```css
clip-path: circle(<length> [at <position>]);
```

- **`<length>`**：圆的半径
- **`<position>`**：可选，定义圆心的位置，默认为元素的中心

### **椭圆形（`ellipse()`）**

```css
clip-path: ellipse(<length1> <length2> [at <position>]);
```

- **`<length1>`** 和 **`<length2>`**：椭圆的水平和垂直半径
- **`<position>`**：可选，定义椭圆中心的位置，默认为元素的中心

### **多边形（`polygon()`）**

```css
clip-path: polygon(<x1> <y1>, <x2> <y2>, ...);
```

- **`<x1> <y1>`**, **`<x2> <y2>`**, ...：定义多边形各个顶点的坐标

### **SVG 路径（`path()`）**

```css
clip-path: path('M<x1>,<y1> L<x2>,<y2> ... Z');
```

- 路径字符串由一系列命令和坐标点组成

### **内嵌矩形（`inset()`，部分浏览器支持）**

```css
clip-path: inset(<top> <right> <bottom> <left> [round <border-radius>]);
```

- **`<top>`**, **`<right>`**, **`<bottom>`**, **`<left>`**：定义矩形裁剪区域的上、右、下、左边距
- **`<border-radius>`**：可选，定义矩形裁剪区域的圆角半径

## SVG path

### 基础样式属性

#### `stroke`

- **描述**：设置路径的描边颜色。
- **取值**：颜色值（如`red`、`#ff0000`、`rgb(255,0,0)`等）。
- **示例**：`stroke="red"`

#### `stroke-width`

- **描述**：设置路径的描边宽度。
- **取值**：长度值（如`2px`、`0.5em`等）。
- **示例**：`stroke-width="2px"`

#### `fill`

- **描述**：设置路径内部的填充颜色。
- **取值**：颜色值（与`stroke`相同）。
- **示例**：`fill="blue"`

#### `fill-opacity`

- **描述**：设置路径填充颜色的透明度。
- **取值**：0（完全透明）到1（完全不透明）之间的数值。
- **示例**：`fill-opacity="0.5"`

#### `stroke-opacity`

- **描述**：设置路径描边颜色的透明度。
- **取值**与**示例**：与`fill-opacity`相同。

### 描边样式属性

#### `stroke-linecap`

- **描述**：设置路径描边端点的形状。
- **取值**：`butt`（平头）、`round`（圆头）、`square`（方头）。
- **示例**：`stroke-linecap="round"`

#### `stroke-linejoin`

- **描述**：设置路径描边转角处的形状。
- **取值**：`miter`（尖角）、`round`（圆角）、`bevel`（斜角）。
- **示例**：`stroke-linejoin="round"`

#### `stroke-dasharray`

- **描述**：设置路径描边的虚线模式。
- **取值**：一系列由逗号分隔的长度值，表示实线和空白线的交替长度。
- **示例**：`stroke-dasharray="5,2"`（5像素的实线和2像素的空白线交替）。

#### `stroke-dashoffset`

- **描述**：设置路径描边虚线模式的起始偏移量。
- **取值**：长度值。
- **示例**：`stroke-dashoffset="3"`（从路径开始处偏移3像素开始绘制虚线）。