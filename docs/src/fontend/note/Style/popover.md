### 基本使用：

```html
<button popovertarget="my-popover">打开 Popover</button>

<div id="my-popover" popover>
    <p>我是一个带有更多信息的弹出框。</p>
</div>
```

`popover` 属性提供了 `auto` 和 `manual` 两个值：

- `popover="auto"` 是默认值，会创建一个可以轻松关闭的弹出框。可以通过点击外部或按下键盘上的 `ESC` 键关闭。
- `popover="manual"` 将创建一个不能轻松关闭的弹出框。因此，如果需要，应该提供自定义关闭操作。

Popover API 还引入了`popovertarget` 和 `popovertargetaction` 新属性：

- `popovertarget` 用于引用我们希望显示、隐藏或切换的弹出框的 `id`
- `popovertargetaction` 提供应执行的操作，选项包括：`show`（显示）、`hide`（隐藏）或 `toggle`（切换）

#### 创建一个需要手动关闭的弹出框

```html
<button 
    popovertarget="some-popover" 
    popovertargetaction="show"
>
    Open the popover
</button>

<div 
 id="some-popover" 
 popover="manual" 
 role="dialog">
    Hi, I'm a popover!
	<button 
        popovertarget="some-popover" 
        popovertargetaction="hide"
    >
        ❌
    </button>
</div>
```

#### 默认行为

启用 `popover` 属性后，浏览器无需额外脚本即可处理许多关键行为，包括：

- **提升到顶层**：放置在页面其他内容之上的独立层，不需要处理 `z-index`
- **轻触关闭功能**：点击弹出框区域外部即可关闭弹出框并恢复焦点
- **默认 Tab 键焦点管理**：打开弹出框后，Tab 键的下一个焦点点会在弹出框内
- **内置键盘绑定**：按下 Esc 键或双重切换会关闭弹出框并恢复焦点
- **默认组件绑定**：浏览器会语义化地将弹出框与其触发器关联

#### 交互动效

在使用 `popover` 时，你还可以使用下面这几个 CSS 特性，为设置 `popover` 属性的元素提供入场和退出（即淡入淡出）的交互动效：

- 在关键帧时间线上为 `display` 和 `content-visibility` 属性添加动画
- 使用 `transition-behavior` 属性的 `allow-discrete` 关键字为离散属性（如 `display`）启用过渡效果
- 通过 `@starting-style` 规则从 `display: none` 到顶层元素实现入场动画
- 使用 `overlay` 属性在动画期间控制顶层行为

```css
/*  打开前状态   */
@starting-style {
    [popover]:popover-open {
        translate: 0 -22rem;
    }
}

/*  打开状态  */
[popover]:popover-open {
    translate: 0 0;
}

/*   退出状态  */
[popover] {
    transition: translate 0.7s ease-out, display 0.7s ease-out allow-discrete;
    translate: 0 -22rem;
} 
```

#### 再加入锚点的功能，就能自由的控制弹出框的位置

```css
.anchor {
    anchor-name: --popover;
}

[popover] {
    position-anchor: --popover;
    bottom: calc(anchor(top) + 1.5rem);
    top: unset;
}
```

