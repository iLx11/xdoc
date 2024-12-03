### Anime.js 的常用函数和接口介绍

Anime.js 是一个轻量级的 JavaScript 动画库，用于制作复杂的 CSS、SVG、DOM 属性以及 JavaScript 对象的动画效果

------

## **1. 基本使用方式**

```javascript
anime({
    targets: 'selector',  // 动画作用的目标，可以是 DOM 元素、对象、数组等
    translateX: 250,      // 动画属性及其值
    duration: 1000,       // 动画时长（单位：毫秒）
    easing: 'easeInOutQuad' // 动画缓动函数
});
```

------

## **2. 核心选项（接口）**

### **`targets`**

- **描述**：动画的目标元素。

- **支持类型**：CSS 选择器、NodeList、数组或 JavaScript 对象。

- 示例

  ：

  ```javascript
  anime({
      targets: '.box', // 作用于类名为 'box' 的所有元素
      opacity: 1
  });
  ```

------

### **`properties`**

- **描述**：定义动画的属性和变化值，支持多种 CSS 属性、SVG 属性、和自定义 JavaScript 对象属性。

- 常用属性

  ：

  - **位移**：`translateX`、`translateY`、`translateZ`
  - **旋转**：`rotate`、`rotateX`、`rotateY`
  - **缩放**：`scale`、`scaleX`、`scaleY`
  - **透明度**：`opacity`
  - **颜色**：`backgroundColor`、`color`

**示例**：

```javascript
anime({
    targets: '.circle',
    translateX: 100,
    translateY: 50,
    scale: [0.5, 2],  // 从0.5倍放大到2倍
    opacity: [0, 1],  // 从完全透明到完全不透明
    duration: 2000
});
```

------

### **`duration`**

- **描述**：动画执行的时间（毫秒）。

- **默认值**：`1000`

- 示例

  ：

  ```javascript
  anime({
      targets: '.box',
      translateX: 250,
      duration: 2000 // 动画持续2秒
  });
  ```

------

### **`delay`**

- **描述**：动画开始之前的延迟时间（毫秒）。

- **支持回调函数**：每个元素可设置不同延迟。

- 示例

  ：

  ```javascript
  anime({
      targets: '.box',
      translateX: 250,
      delay: (el, i) => i * 100 // 每个元素延迟100ms
  });
  ```

------

### **`easing`**

- **描述**：动画的缓动效果。

- 常见缓动函数

  ：

  - `linear`
  - `easeInQuad` / `easeOutQuad` / `easeInOutQuad`
  - `easeInElastic` / `easeOutElastic`
  - `easeInBounce` / `easeOutBounce`

**示例**：

```javascript
anime({
    targets: '.box',
    translateX: 250,
    easing: 'easeOutElastic',
    duration: 3000
});
```

### **缓动函数分类**

Anime.js 支持以下几类缓动函数：

#### **Linear（线性缓动）**

- **描述**：动画速度恒定，不加速或减速。

------

#### **Quad（平方缓动）**

- **描述**：基于平方曲线的缓动效果。

------

#### **Cubic（立方缓动）**

- **描述**：基于立方曲线，过渡更加平滑。

------

#### **Quart（四次缓动）**

- **描述**：加速和减速效果比立方缓动更为强烈。

------

#### **Quint（五次缓动）**

- **描述**：极为强烈的加速和减速。

------

#### **Sine（正弦缓动）**

- **描述**：基于正弦曲线的缓动，过渡效果更加柔和自然。

------

#### **Expo（指数缓动）**

- **描述**：加速和减速非常明显，适用于快速进入或离开效果。

------

#### **Circ（圆形缓动）**

- **描述**：基于圆形曲线，过渡更加自然，常用于柔和的弹性效果。

------

#### **Back（反弹缓动）**

- **描述**：在运动开始或结束时会有轻微的反弹效果。

------

#### **Elastic（弹性缓动）**

- **描述**：动画开始或结束时会有类似弹簧的弹性效果。

------

#### **Bounce（弹跳缓动）**

- **描述**：动画结束时有类似物体弹跳的效果。

------

### **自定义 Easing**

如果内置的缓动函数不能满足需求，Anime.js 允许你定义自定义缓动函数：

#### **使用 Cubic Bezier**

Anime.js 支持自定义三次贝塞尔曲线缓动效果，定义格式如下：

```js
easing: 'cubicBezier(.5, .05, .1, .3)'
```

- 数值的范围是 `[0, 1]`，每个参数分别对应贝塞尔曲线的控制点。

------

### **`loop`**

- **描述**：是否循环播放动画。

- 支持值

  ：

  - `true`：无限循环
  - `number`：指定循环次数

**示例**：

```javascript
anime({
    targets: '.circle',
    scale: [1, 2],
    duration: 1500,
    loop: 3 // 循环3次
});
```

------

### **`autoplay`**

- **描述**：动画是否自动播放。
- **默认值**：`true`
- **示例**：

```javascript
let animation = anime({
    targets: '.box',
    translateX: 300,
    autoplay: false
});
animation.play(); // 手动播放
```

------

### **`direction`**

- **描述**：动画播放的方向。

- 支持值

  ：

  - `normal`（默认）：正向播放
  - `reverse`：反向播放
  - `alternate`：正向和反向交替播放

**示例**：

```javascript
anime({
    targets: '.box',
    translateX: 300,
    direction: 'alternate',
    loop: true // 无限循环，往返播放
});
```

------

### **回调函数接口**

#### **`begin`**

- **描述**：动画开始时触发。
- **示例**：

```javascript
anime({
    targets: '.box',
    translateX: 300,
    begin: () => console.log('Animation started')
});
```

#### **`complete`**

- **描述**：动画完成时触发。
- **示例**：

```javascript
anime({
    targets: '.box',
    translateX: 300,
    complete: () => console.log('Animation completed')
});
```

#### **`update`**

- **描述**：动画更新（每帧）时触发。
- **示例**：

```javascript
anime({
    targets: '.box',
    translateX: 300,
    update: anim => console.log(anim.progress) // 输出当前进度
});
```

#### **`loopComplete`**

- **描述**：每次循环完成时触发。
- **示例**：

```javascript
anime({
    targets: '.box',
    translateX: 300,
    loop: 3,
    loopComplete: () => console.log('Loop completed')
});
```

------

## **3. 高级用法**

### **时间线（Timeline）**

- **描述**：用来同步多个动画的执行顺序。
- **示例**：

```javascript
let tl = anime.timeline({
    easing: 'easeInOutQuad',
    duration: 1000
});

tl.add({
    targets: '.box1',
    translateX: 200
}).add({
    targets: '.box2',
    translateY: 100,
    offset: '-=500' // 相对于上一个动画提前500ms
});
```

------

### **动态控制**

```javascript
let animation = anime({
    targets: '.circle',
    translateX: 300,
    duration: 2000,
    autoplay: false
});

// 动态控制动画
animation.play();    // 播放
animation.pause();   // 暂停
animation.seek(1000); // 跳转到1秒时刻
```

------

### **内置方法**

- **`anime.random(min, max)`**：生成指定范围的随机数。
- **示例**：

```javascript
anime({
    targets: '.box',
    translateX: () => anime.random(50, 300)
});
```

