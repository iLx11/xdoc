## 常用接口

## **创建场景 (**`THREE.Scene`**)**

- 用于容纳所有 3D 对象。
- 使用 `scene.add()` 方法将对象添加到场景中。

```javascript
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x87ceeb); // 设置背景颜色
```

`Scene` 是场景对象，所有的网格对象、灯光、动画等都需要放在场景中，使用 `new THREE.Scene` 初始化场景，下面是场景的一些常用属性和方法。

- `fog`：设置场景的雾化效果,可以渲染出一层雾气，隐层远处的的物体。
- `overrideMaterial`：强制场景中所有物体使用相同材质。
- `autoUpdate`：设置是否自动更新。
- `background`：设置场景背景，默认为黑色。
- `children`：所有对象的列表。
- `add()`：向场景中添加对象。
- `remove()`：从场景中移除对象。
- `getChildByName()`：根据名字直接返回这个对象。
- `traverse()`：传入一个回调函数访问所有的对象。

## **相机 (**`THREE.PerspectiveCamera` **和** `THREE.OrthographicCamera`**)**

为了在场景中显示物体，就必须给场景添加相机，相机类型可以分为**正交相机**和**透视相机**

- `PerspectiveCamera`（透视相机）：常用于 3D 场景，符合人眼的视角。
- `OrthographicCamera`（正交相机）：没有透视效果，常用于 2D 场景或特定的 3D 视角。

```javascript
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 5; // 将相机稍微远离中心
```

- `fov`：表示视场，就是能够看到的角度范围，人的眼睛大约能够看到 `180度` 的视场，视角大小设置要根据具体应用，一般游戏会设置 `60~90` 度，默认值 `45`。
- `aspect`：表示渲染窗口的长宽比，如果一个网页上只有一个全屏的 `canvas` 画布且画布上只有一个窗口，那么 `aspect` 的值就是网页窗口客户区的宽高比 `window.innerWidth/window.innerHeight`。
- `near`：属性表示的是从距离相机多远的位置开始渲染，一般情况会设置一个很小的值。 默认值 `0.1`。
- `far`：属性表示的是距离相机多远的位置截止渲染，如果设置的值偏小，会有部分场景看不到，默认值 `1000`。

## **渲染器 (**`THREE.WebGLRenderer`**)**

- 负责渲染场景中的对象。
- 渲染器的 `render()` 方法在每帧调用时绘制场景。

```javascript
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement); // 将渲染器的 canvas 添加到页面
```

## **几何体（**`THREE.Geometry` **和** `THREE.BufferGeometry`**）**

- 几何体定义了 3D 对象的形状。
- 常用几何体有立方体、球体、圆柱体等。

```javascript
const geometry = new THREE.BoxGeometry(1, 1, 1); // 创建一个立方体
```

`Three.js` 常用几何体的分类介绍以及构造器的参数

::: details 点击打开表格

| 名称                   | 构造器参数                                                   |
| ---------------------- | ------------------------------------------------------------ |
| `PlaneGeometry`        | 【平面几何体】 <br/>`width` — 平面沿着X轴的宽度。默认值是 `1`。<br>`height` — 平面沿着 `Y轴` 的高度。默认值是 `1`。<br/>`widthSegments` — 可选，平面的宽度分段数，默认值是 `1`。 <br/>`heightSegments` — 可选，平面的高度分段数，默认值是 `1`。 |
| `CircleGeometry`       | 【圆形几何体】 <br/>`radius` — 圆形的半径，默认值为`1`。 <br/>`segments` — 分段的数量，最小值为 `3`，默认值为 `8`。<br/>`thetaStart` — 第一个分段的起始角度，默认为 `0`。<br/>`thetaLength` — 圆形扇区的中心角，通常被称为 `θ`。默认值是 `2*Pi`，这使其成为一个完整的圆。 |
| `RingGeometry`         | 【环形几何体】  <br/>`innerRadius` — 内部半径，默认值为 `0.5`。<br/>`outerRadius` — 外部半径，默认值为 `1`。<br/>`thetaSegments` — 圆环的分段数。这个值越大，圆环就越圆。最小值为 `3`，默认值为 `8`。`phiSegments` — 最小值为 `1`，默认值为 `8`。<br/>`thetaStart` — 起始角度，默认值为 `0`。`thetaLength` — 圆心角，默认值为 `Math.PI * 2`。 |
| `ShapeGeometry`        | 【形状几何体】 <br/>`shapes` — 一个单独的 `shape`，或者一个包含形状的 `Array`。 <br/>`curveSegments` - `Integer` - 每一个形状的分段数，默认值为 `12`。 |
| `BoxGeometry`          | 【立方几何体】 <br/>`width` — X轴上面的宽度，默认值为 `1`。 <br/>`height` —  `Y` 轴上面的高度，默认值为 `1`。 <br/>`depth` — `Z` 轴上面的深度，默认值为 `1`。<br/>`widthSegments` — 可选，宽度的分段数，默认值是 `1`。<br/>`heightSegments` — 可选，宽度的分段数，默认值是 `1`。<br/>`depthSegments` — 可选，宽度的分段数，默认值是 `1`。 |
| `SphereGeometry`       | 【球几何体】 <br/>`radius` — 球体半径，默认为 `1`。<br/>`widthSegments` — 水平分段数，最小值为 `3`，默认值为 `8`。<br/>`heightSegments` — 垂直分段数，最小值为 `2`，默认值为 `6`。<br/>`phiStart` — 指定水平起始角度，默认值为 `0`。 <br/>`phiLength` — 指定水平扫描角度的大小，默认值为 `Math.PI * 2`。<br/>`thetaStart` — 指定垂直起始角度，默认值为 `0`。<br/>`thetaLength` — 指定垂直扫描角度大小，默认值为 `Math.PI`。 |
| `CylinderGeometry`     | 【圆柱几何体】 <br/>`radiusTop` — 圆柱的顶部半径，默认值是 `1`。<br/>`radiusBottom` — 圆柱的底部半径，默认值是 `1`。<br/>`height` — 圆柱的高度，默认值是 `1`。<br/>`radialSegments` — 圆柱侧面周围的分段数，默认为 `8`。 <br/>`heightSegments` — 圆柱侧面沿着其高度的分段数，默认值为 `1`。<br/>`openEnded` — 一个 `Boolean` 值，指明该圆锥的底面是开放的还是封顶的。默认值为 `false`，即其底面默认是封顶的。<br/>`thetaStart` — 第一个分段的起始角度，默认为 `0`。<br/>`thetaLength` — 圆柱底面圆扇区的中心角，通常被称为 `“θ”`。默认值是 `2*Pi`，这使其成为一个完整的圆柱。 |
| `ConeGeometry`         | 【圆锥几何体】 <br/>`radius` — 圆锥底部的半径，默认值为 `1`。<br/>height — 圆锥的高度，默认值为1。 <br/>`radialSegments` — 圆锥侧面周围的分段数，默认为 `8`。<br/>`heightSegments` — 圆锥侧面沿着其高度的分段数，默认值为 `1`。<br/>`openEnded` — 一个Boolean值，指明该圆锥的底面是开放的还是封顶的。默认值为 `false`，即其底面默认是封顶的。<br/>`thetaStart` — 第一个分段的起始角度，默认为 `0`。<br/>`thetaLength` — 圆锥底面圆扇区的中心角，通常被称为 `“θ”`。默认值是 `2*Pi`，这使其成为一个完整的圆锥。 |
| `TorusGeometry`        | 【圆环几何体】 <br/>`radius` - 圆环的半径，从圆环的中心到管道的中心。默认值是 `1`。<br/>`tube` — 管道的半径，默认值为 `0.4`。<br/>`radialSegments` — 圆环的分段数，默认值为 `8`。<br/>`tubularSegments` — 管道的分段数，默认值为 `6`。`arc` — 圆环的中心角，默认值为 `Math.PI * 2`。 |
| `TextGeometry`         | 【文本几何体】 <br/>`font` — `THREE.Font` 的实例。`size` — `Float`。字体大小，默认值为 `100`。<br/>`height` — `Float`。挤出文本的厚度。默认值为 `50`。<br/>`curveSegments` — `Integer`。曲线上点的数量。默认值为 `12`。<br/>`bevelEnabled` — `Boolean`。是否开启斜角，默认为 `false`。<br/>`bevelThickness` — `Float`。文本上斜角的深度，默认值为 `20`。<br/>`bevelSize` — `Float`。斜角与原始文本轮廓之间的延伸距离。默认值为 `8`。<br/>`bevelSegments` — `Integer`。斜角的分段数。默认值为 `3`。 |
| `TetrahedronGeometry`  | 【四面几何体】<br/> `radius` — 四面体的半径，默认值为 `1`。<br/>`detail` — 默认值为 `0`。将这个值设为一个大于 `0` 的数将会为它增加一些顶点，使其不再是一个四面体。 |
| `OctahedronGeometry`   | 【八面几何体】 <br/>`radius` — 八面体的半径，默认值为 `1`。<br/>`detail` — 默认值为 `0`，将这个值设为一个大于 `0` 的数将会为它增加一些顶点，使其不再是一个八面体。 |
| `DodecahedronGeometry` | 【十二面几何体】 <br/>`radius` — 十二面体的半径，默认值为 `1`。<br/>`detail` — 默认值为 `0`。将这个值设为一个大于 `0` 的数将会为它增加一些顶点，使其不再是一个十二面体。 |
| `IcosahedronGeometry`  | 【二十面几何体】 <br/>`radius` — 二十面体的半径，默认为 `1`。<br/>`detail` — 默认值为 `0`。将这个值设为一个大于 `0` 的数将会为它增加一些顶点，使其不再是一个二十面体。当这个值大于 `1` 的时候，实际上它将变成一个球体。 |
| `TorusKnotGeometry`    | 【圆环扭结几何体】 <br/>`radius` - 圆环的半径，默认值为 `1`。`tube` — 管道的半径，默认值为 `0.4`。<br/>`tubularSegments` — 管道的分段数量，默认值为 `64`。<br/>`radialSegments` — 横截面分段数量，默认值为 `8`。<br/> `p` — 这个值决定了几何体将绕着其旋转对称轴旋转多少次，默认值是 `2`。`q` — 这个值决定了几何体将绕着其内部圆环旋转多少次，默认值是 `3`。 |
| `PolyhedronGeometry`   | 【多面几何体】 <br/>`vertices` — 一个顶点 `Array`：`[1,1,1, -1,-1,-1, … ]`。<br/>`indices` — 一个构成面的索引 `Array`， `[0,1,2, 2,3,0, … ]`。<br/>`radius` — `Float` - 最终形状的半径。<br/>`detail` — `Integer` - 将对这个几何体细分多少个级别。细节越多，形状就越平滑。 |
| `TubeGeometry`         | 【管道几何体】<br/> `path` — `Curve` - 一个由基类 `Curve` 继承而来的路径。<br/>`tubularSegments` — `Integer` - 组成这一管道的分段数，默认值为 `64`。<br/>`radius` — `Float` - 管道的半径，默认值为 `1`。<br/>`radialSegments` — `Integer` - 管道横截面的分段数目，默认值为 `8`。<br/>`closed` — `Boolean` 管道的两端是否闭合，默认值为 `false`。 |

:::

## **材质（**`THREE.Material`**）**

- 材质定义了几何体的表面特性。
- 常用材质包括 `MeshBasicMaterial`、`MeshStandardMaterial` 和 `MeshPhongMaterial`。

```javascript
const material = new THREE.MeshBasicMaterial({ color: 0x00ff00, wireframe: true }); // 绿色线框材质
```

::: details

| 名称                   | 描述                                                         |
| ---------------------- | ------------------------------------------------------------ |
| `MeshBasicMaterial`    | 基础网格基础材质，用于给几何体赋予一种简单的颜色，或者显示几何体的线框。 |
| `MeshDepthMaterial`    | 网格深度材质，这个材质使用从摄像机到网格的距离来决定如何给网格上色。 |
| `MeshStandardMaterial` | 标准网格材质，一种基于物理的标准材质，使用 `Metallic-Roughness` 工作流程 |
| `MeshPhysicalMaterial` | 物理网格材质，`MeshStandardMaterial` 的扩展，能够更好地控制反射率。 |
| `MeshNormalMaterial`   | 网格法向材质，这是一种简单的材质，根据法向向量计算物体表面的颜色。 |
| `MeshLambertMaterial`  | 网格 `Lambert` 材质，这是一种考虑光照影响的材质，用于创建暗淡的、不光亮的物体。 |
| `MeshPhongMaterial`    | 网格 `Phong` 式材质，这是一种考虑光照影响的材质，用于创建光亮的物体。 |
| `MeshToonMaterial`     | 网格 `Phong` 式材质，`MeshPhongMaterial` 卡通着色的扩展。    |
| `ShaderMaterial`       | 着色器材质，这种材质允许使用自定义的着色器程序，直接控制顶点的放置方式以及像素的着色方式。 |
| `LineBasicMaterial`    | 直线基础材质，这种材质可以用于 `THREE.Line` 直线几何体，用来创建着色的直线。 |

:::

## **创建网格（**`THREE.Mesh`**）**

- `Mesh` 将几何体和材质结合起来，并可以被添加到场景中。

```javascript
const cube = new THREE.Mesh(geometry, material); // 创建一个立方体网格
scene.add(cube); // 将网格添加到场景
```

## **灯光 (**`THREE.Light`**)**

- 常用灯光包括环境光 (`AmbientLight`)、点光源 (`PointLight`) 和方向光 (`DirectionalLight`)。

```javascript
const ambientLight = new THREE.AmbientLight(0x404040); // 环境光
scene.add(ambientLight);

const pointLight = new THREE.PointLight(0xffffff);
pointLight.position.set(5, 5, 5);
scene.add(pointLight); // 添加点光源
```

## **动画和渲染循环**

- 使用 `requestAnimationFrame` 进行逐帧渲染。
- 在渲染函数中更新对象的旋转、位置或材质。

```javascript
function animate() {
  requestAnimationFrame(animate);
  cube.rotation.x += 0.01; // 动态旋转
  cube.rotation.y += 0.01;
  renderer.render(scene, camera); // 渲染场景
}
animate();
```

## **加载器 (**`THREE.GLTFLoader`**,** `THREE.TextureLoader`**)**

- 加载模型和纹理。
- `GLTFLoader` 用于加载 3D 模型文件，`TextureLoader` 用于加载纹理图像。

```javascript
const loader = new THREE.GLTFLoader();
loader.load('path/to/model.gltf', function(gltf) {
  scene.add(gltf.scene);
});

const textureLoader = new THREE.TextureLoader();
const texture = textureLoader.load('path/to/texture.jpg');
material.map = texture;
```

## **控制器 (**`OrbitControls`**)**

- `OrbitControls` 允许用户拖动、缩放和旋转相机。
- 需要在渲染循环中更新。

```javascript
const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true; // 阻尼效果
```

## **坐标辅助工具 (**`THREE.AxesHelper`**)**

- 显示坐标轴帮助理解对象的方向和位置。

```javascript
const axesHelper = new THREE.AxesHelper(5);
scene.add(axesHelper);
```

## **Raycaster（射线投射）**

- 用于检测鼠标点击或悬停在对象上。

```javascript
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

function onMouseMove(event) {
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;

  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects(scene.children);
  if (intersects.length > 0) {
    intersects[0].object.material.color.set(0xff0000); // 鼠标悬停时变为红色
  }
}

window.addEventListener('mousemove', onMouseMove);
```

## 贴图

为了模拟更加真实的效果，就要给模型材质添加贴图，贴图就像模型的皮肤一样，使其三维效果更佳。添加贴图的原理是通过纹理贴图加载器 `TextureLoader()` 去新创建一个贴图对象出来，然后再去调用里面的 `load()` 方法去加载一张图片，这样就会返回一个纹理对象，纹理对象可以作为模型材质颜色贴图 `map` 属性的值，材质的颜色贴图属性 `map` 设置后，模型会从纹理贴图上采集像素值。

几种常用的贴图类型以及加载贴图的基本流程。

- `map`：材质贴图
- `normalMap`：法线贴图
- `bumpMap`：凹凸贴图
- `envMap`：环境贴图
- `specularMap`：高光贴图
- `lightMap`：光照贴图

```js
const texLoader = new THREE.TextureLoader();
loader.load('assets/models/meta.fbx', function (mesh) {
  mesh.traverse(function (child) {
    if (child.isMesh) {
      if (child.name === '需要添加贴图的模型') {
        child.material = new THREE.MeshPhysicalMaterial({
          map: texLoader.load("./assets/images/metal.png"),
        });
      }
    }
  });
})
```

## 加载器 THREE.LoadingManager

其功能是处理并跟踪已加载和待处理的数据。如果未手动设置加强管理器，则会为加载器创建和使用默认全局实例加载器管理器。以下是加载器的基本使用方法：

```js
// 初始化加载器
const manager = new THREE.LoadingManager();
// 此函数在加载开始时被调用
manager.onStart = function ( url, itemsLoaded, itemsTotal ) {
  console.log( 'Started loading file: ' + url + '.\nLoaded ' + itemsLoaded + ' of ' + itemsTotal + ' files.' );
};
// 所有的项目加载完成后将调用此函数。默认情况下，该函数是未定义的，除非在构造函数中传入
manager.onLoad = function ( ) {
  console.log( 'Loading complete!');
};
// 此方法加载每一个项，加载完成时进行调用
manager.onProgress = function ( url, itemsLoaded, itemsTotal ) {
  console.log( 'Loading file: ' + url + '.\nLoaded ' + itemsLoaded + ' of ' + itemsTotal + ' files.' );
};
// 此方法将在任意项加载错误时，进行调用
manager.onError = function ( url ) {
  console.log( 'There was an error loading ' + url );
};
const loader = new THREE.OBJLoader( manager );
// 加载模型
loader.load('file.obj', function (object) {});
```

## 补间动画TWEEN

`Tween.js` 是附加在 `Three.js` 库中的一个扩充动画库，它可以平滑的修改元素的属性值，使一个对象在一定时间内从一个状态缓动变化到另外一个状态，配合动画函数实现丝滑的动画效果`TWEEN.js` 本质就是一系列缓动函数算法，结合`Canvas`、`Three.js` 很简单就能实现很多动画效果。

```js
var tween = new TWEEN.Tween({x: 1})     // position: {x: 1}
.delay(100)                             // 等待100ms
.to({x: 200}, 1000)                     // 1s时间，x到200
.onUpdate(render)                       // 变更期间执行render方法
.onComplete(() => {})                   // 动画完成
.onStop(() => {})                       // 动画停止
.start();                               // 开启动画
```

要让动画真正动起来，需要在 `requestAnimationFrame` 中调用 `update` 方法。

```js
TWEEN.update()
```

缓动类型：

```js
tween.easing(TWEEN.Easing.Cubic.InOut);
```

链式调用：

```js
var tweenA = new TWEEN.Tween(position).to({x: 200}, 1000);
var tweenB = new TWEEN.Tween(position).to({x: 0}, 1000);
tweenA.chain(tweenB);
tweenB.chain(tweenA);
tweenA.start();
```

## DRACOLoader

- `DRACOLoader` 是使用 `Draco` 库压缩的几何图形加载器。
- `Draco` 是一个开源库，用于压缩和解压缩 `3D` 网格和点云。压缩后的几何图形可以明显更小，代价是客户端设备上的额外解码时间。
- 独立的 `Draco` 文件具有 `.drc` 扩展名，并包含顶点位置、法线、颜色和其他属性。 `Draco` 文件不包含材质、纹理、动画或节点层次结构，要使用这些功能，需要将 `Draco` 几何图形嵌入到 `glTF` 文件中。 可以使用 `glTF-Pipeline` 将普通的 `glTF` 文件转换为 `Draco` 压缩的 `glTF` 文件。 当使用带有 `glTF` 的 `Draco` 时，`GLTFLoader` 将在内部使用 `DRACOLoader` 的实例。
- `DRACOLoader` 依赖于 `IE11` 不支持的 `ES6 Promises`，要在 `IE11` 中使用加载器，必须包含一个提供 `Promise` 替换的 `polyfill`。
- 开源 `3D` 建模工具 `Blender` 可以生成使用 `Draco` 压缩过的模型。

使用 `DRACOLoader` 时，必须在静态资源目录引入以下文件，并在初始化时设置正确的资源路径。

```js
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

// 使用 dracoLoader 加载用blender压缩过的模型
const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath('/draco/');
dracoLoader.setDecoderConfig({ type: 'js' });
const loader = new GLTFLoader(loadingManager);
loader.setDRACOLoader(dracoLoader);

// 模型加载
let oldMaterial;
loader.load('/models/statue.glb', function (gltf) {
  gltf.scene.traverse((obj) => {
    if (obj.isMesh) {
      oldMaterial = obj.material;
      obj.material = new MeshPhongMaterial({
        shininess: 100
      })
    }
  })
  scene.add(gltf.scene);
  oldMaterial.dispose();
  renderer.renderLists.dispose();
});
```



