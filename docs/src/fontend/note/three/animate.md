## 基础 Tween：控制 Mesh 属性

### 平移、旋转、缩放

直接对 Three.js 对象的属性做 Tween：

```js
// position
gsap.to(mesh.position, { x: 5, duration: 2, ease: "power1.inOut" });
// rotation （弧度制）
gsap.to(mesh.rotation, { y: Math.PI, duration: 1 });
// scale
gsap.from(mesh.scale, { x: 0, y: 0, z: 0, duration: 1, stagger: 0.1 });
```

这种写法与操作 DOM 或者 Canvas 动画几乎一致

### 材质和灯光

GSAP 也能驱动材质属性或灯光强度、颜色等：

```js
gsap.to(mesh.material.color, { r: 1, g: 0, b: 0, duration: 1 });
gsap.to(light, { intensity: 2, duration: 0.5 });
```

------

## 相机动画

### 简单移动

```js
gsap.to(camera.position, {
  x: 0, y: 3, z: 10,
  duration: 2,
  onUpdate: () => camera.lookAt(scene.position)
});
```

也可以在 `onUpdate` 回调里不断调整朝向，保证视角对准目标

### 多段滚动控制相机

结合 ScrollTrigger，实现随着滚动分段切换相机位置：

```js
gsap.timeline({
  scrollTrigger: {
    trigger: "#container",
    start: "top top",
    end: "bottom bottom",
    scrub: true
  }
})
  .to(camera.position, { x: 5, duration: 1 })
  .to(camera.position, { y: 5, duration: 1 })
  .to(camera.position, { z: 5, duration: 1 });
```

ScrollTrigger 可灵活绑定到 Timeline 或单个 Tween

------

## Timeline 编排与控制

### 创建与连接

```js
const tl = gsap.timeline({ defaults: { duration: 1, ease: "power2" } });
tl.to(mesh.position, { x: 2 })
  .to(mesh.rotation, { y: Math.PI * 2 }, "<")    // 与上一个动画同时开始
  .from(material, { opacity: 0 }, "-=0.5");     // 比上一步提前 0.5s
```

Timeline 不仅能串联，还能并行、错位，轻松编排复杂流程

```js
tl.pause();          // 暂停
tl.play(1.5);        // 从 1.5s 位置播放
tl.reverse();        // 反向播放
tl.timeScale(0.5);   // 整体速率减半
```