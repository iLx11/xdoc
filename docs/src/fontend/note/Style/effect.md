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
background-image: radial-gradient(
    circle at 10px -5px,
    transparent 12px,
    #fff 13px,
    #fff 20px
 );
```

#### 透出下方内容的动画

```css
@keyframes scale-animate {
  0% {
    transform: scale(1);
  }
  100% {
    transform: scale(10);
  }
}
```



### 内凹平滑圆角

```css
.box {
    width: 200px;
    height: 100px;
    background: rgba(255, 255, 255, 1);
    --r: 5vw;
    --s: 12vw;
    --a: 24deg;

    --_m: 0 / calc(2 * var(--r)) var(--r) no-repeat
      radial-gradient(50% 100% at bottom, #000 calc(100% - 1px), #0000);
    --_d: (var(--s) + var(--r)) * cos(var(--a));
    mask: calc(50% + var(--_d)) var(--_m), calc(50% - var(--_d)) var(--_m),
      radial-gradient(
          var(--s) at 50% calc(-1 * sin(var(--a)) * var(--s)),
          #0000 100%,
          #000 calc(100% + 1px)
        )
        0 calc(var(--r) * (1 - sin(var(--a)))),
      linear-gradient(
        90deg,
        #000 calc(50% - var(--_d)),
        #0000 0 calc(50% + var(--_d)),
        #000 0
      );
    mask-repeat: no-repeat;
}
```

### 字体边框颜色动画

```vue
<template>
<svg viewBox="0 0 600 300">
  <!-- Symbol-->
  <symbol id="s-text">
    <text text-anchor="middle" x="50%" y="50%" dy=".35em">替换文本</text>
  </symbol>
  <!-- Duplicate symbols-->
  <use class="text" xlink:href="#s-text"></use>
  <use class="text" xlink:href="#s-text"></use>
  <use class="text" xlink:href="#s-text"></use>
  <use class="text" xlink:href="#s-text"></use>
  <use class="text" xlink:href="#s-text"></use>
</svg>
</template>
<style lang="scss">
$colors: #F2385A, #F5A503, #E9F1DF, #56D9CD, #3AA1BF;
$max: length($colors);
$dash: 70;
$dash-gap: 10;
$dash-space: $dash * ($max - 1) + $dash-gap * $max;
$time: 6s;
$time-step: $time/$max;

/* Main styles */
@import url(https://fonts.googleapis.com/css?family=Open+Sans:800);

.text {
  fill: none;
  stroke-width: 3;
  stroke-linejoin: round;
  stroke-dasharray: $dash $dash-space;
  stroke-dashoffset: 0;
  -webkit-animation: stroke $time infinite linear;
  animation: stroke $time infinite linear;
  
  @for $item from 1 through $max {
    &:nth-child(#{$max}n + #{$item}) {
      $color: nth($colors, $item);
      stroke: $color;
      -webkit-animation-delay: -($time-step * $item);
      animation-delay: -($time-step * $item);
    }
  }
}

@-webkit-keyframes stroke {
  100% {
    stroke-dashoffset: -($dash + $dash-gap) * $max;
  }
}

@keyframes stroke {
  100% {
    stroke-dashoffset: -($dash + $dash-gap) * $max;
  }
}
</style>
```

## 