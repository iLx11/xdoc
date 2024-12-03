## **1. 变量**

Sass 提供了变量功能，允许开发者存储重复使用的值（例如颜色、字体大小等）。

### 语法：

```scss
$primary-color: #3498db;
$font-size: 16px;

body {
  color: $primary-color;
  font-size: $font-size;
}
```

### 特点：

- 可定义任何 CSS 属性值，包括颜色、尺寸、字体等。
- 便于统一管理全局样式。

------

## **2. 嵌套**

Sass 支持规则嵌套，可以直接在父选择器内编写子选择器，清晰地表示层级关系。

### 语法：

```scss
.nav {
  background: #333;

  ul {
    list-style: none;

    li {
      display: inline-block;

      a {
        color: white;
        text-decoration: none;
      }
    }
  }
}
```

### 编译后的 CSS：

```css
.nav {
  background: #333;
}
.nav ul {
  list-style: none;
}
.nav ul li {
  display: inline-block;
}
.nav ul li a {
  color: white;
  text-decoration: none;
}
```

------

## **3. 混合（Mixin）**

`@mixin` 是一种代码复用机制，用于定义可重用的样式片段。可通过 `@include` 调用。

### 语法：

```scss
@mixin border-radius($radius) {
  -webkit-border-radius: $radius;
  -moz-border-radius: $radius;
  border-radius: $radius;
}

.box {
  @include border-radius(10px);
}
```

### 编译后的 CSS：

```css
.box {
  -webkit-border-radius: 10px;
  -moz-border-radius: 10px;
  border-radius: 10px;
}
```

------

## **4. 函数**

`@function` 用于定义可计算返回值的自定义函数，便于封装复杂的计算逻辑。

### 语法：

```scss
@function calculate-spacing($base, $factor) {
  @return $base * $factor;
}

.container {
  margin: calculate-spacing(10px, 2); // 返回 20px
}
```

### 编译后的 CSS：

```css
.container {
  margin: 20px;
}
```

------

## **5. 继承**

Sass 提供了 `@extend` 功能，可以继承其他选择器的样式。

### 语法：

```scss
.btn {
  padding: 10px 20px;
  border: none;
  background: #3498db;
  color: white;
}

.btn-primary {
  @extend .btn;
  background: #2ecc71;
}
```

### 编译后的 CSS：

```css
.btn, .btn-primary {
  padding: 10px 20px;
  border: none;
  background: #3498db;
  color: white;
}
.btn-primary {
  background: #2ecc71;
}
```

------

## **6. 条件语句**

Sass 支持条件控制，可以根据不同情况生成不同的样式。

### 语法：

```scss
$theme: dark;

body {
  @if $theme == dark {
    background: #333;
    color: white;
  } @else {
    background: white;
    color: black;
  }
}
```

### 编译后的 CSS：

```css
body {
  background: #333;
  color: white;
}
```

------

## **7. 循环语句**

Sass 支持循环，通过 `@for`、`@each` 和 `@while` 实现样式的动态生成。

### `@for` 示例：

```scss
@for $i from 1 through 3 {
  .box-#{$i} {
    width: $i * 10px;
  }
}
```

### 编译后的 CSS：

```css
.box-1 {
  width: 10px;
}
.box-2 {
  width: 20px;
}
.box-3 {
  width: 30px;
}
```

### `@each` 示例：

```scss
$colors: red, green, blue;

@each $color in $colors {
  .text-#{$color} {
    color: $color;
  }
}
```

### 编译后的 CSS：

```css
.text-red {
  color: red;
}
.text-green {
  color: green;
}
.text-blue {
  color: blue;
}
```

------

## **8. 分隔符插值**

通过 `#{} `插入动态内容，可用于动态生成选择器或属性值。

### 语法：

```scss
$side: left;

.box {
  margin-#{$side}: 10px; // 动态生成 margin-left
}
```

### 编译后的 CSS：

```css
.box {
  margin-left: 10px;
}
```

------

## **9. Partials 和 Import**

Sass 允许将样式拆分为多个文件并通过 `@use` 或 `@import` 引入，便于模块化管理。

### 语法：

`_variables.scss`：

```scss
$primary-color: #3498db;
```

`main.scss`：

```scss
@use 'variables';

body {
  color: variables.$primary-color;
}
```

------

## **10. 模块系统**

Sass 使用 `@use` 和 `@forward` 管理模块化样式，取代了老式的 `@import`。

### 语法：

```scss
// _buttons.scss
$btn-color: #3498db;

@mixin button {
  padding: 10px 20px;
  background: $btn-color;
}

// main.scss
@use 'buttons';

.btn {
  @include buttons.button;
}
```

