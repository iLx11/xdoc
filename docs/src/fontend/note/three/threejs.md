## 示例

```tsx
import * as THREE from 'three'
// import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import Stats from 'stats.js'
import { useConfigStore } from '@/stores/configStore'

const configStore = useConfigStore()
const win = window as any

// fpc 显示
// var stats = new Stats()
// stats.showPanel(0) // 0: fps, 1: ms, 2: mb, 3+: custom
// document.body.appendChild(stats.dom)

let scene, camera, renderer, mouse, raycaster
let models: any[] = [] // 用于存储加载的模型
let isMouseOver

let threeWidth = 800
let threeHeight = 500

let defaultCameraPosition = { x: -2.5, y: 2.9, z: 14 }

const keyboardGroup = new THREE.Group()
const loader = new GLTFLoader()

/********************************************************************************
 * @brief: three 初始化
 * @return {*}
 ********************************************************************************/
export const threeInit = (parentBox: HTMLElement, size: object) => {
  threeWidth = size.width
  threeHeight = size.height
  // 场景和摄像机
  scene = new THREE.Scene()
  camera = new THREE.PerspectiveCamera(45, threeWidth / threeHeight, 0.1, 1000)
  camera.position.set(
    defaultCameraPosition.x,
    defaultCameraPosition.y,
    defaultCameraPosition.z
  )
  camera.lookAt(0, 0, 0)

  // 渲染器
  renderer = new THREE.WebGLRenderer({ antialias: true })
  renderer.setSize(threeWidth, threeHeight)
  renderer.setClearColor(0xff0000, 0) // 透明背景
  document.body.appendChild(renderer.domElement)

  // 光源
  const ambientLight = new THREE.AmbientLight(0xffffff, 2)
  scene.add(ambientLight)
  const directionalLight = new THREE.DirectionalLight(0xffffff, 1.8)
  directionalLight.position.set(1, 1, 1).normalize()
  scene.add(directionalLight)

  // 轴辅助线
  // const axesHelper = new THREE.AxesHelper(5)
  // scene.add(axesHelper)

  // 鼠标和射线
  raycaster = new THREE.Raycaster()
  mouse = new THREE.Vector2()

  // 加载键盘模型
  loadPadModel()

  // 监听鼠标移动
  renderer.domElement.addEventListener('mousemove', onMouseMove, false)

  renderer.domElement.addEventListener('mouseout', onMouseOut, false)

  renderer.domElement.addEventListener('mousedown', onMouseDown, false)

  keyboardGroup.rotation.x = 1.2
  keyboardGroup.position.x = 0.6
  keyboardGroup.position.y = 0.45

  parentBox.appendChild(renderer.domElement)

  animate()
}

/********************************************************************************
 * @brief: 加载键盘模型
 * @return {*}
 ********************************************************************************/
const loadPadModel = async () => {
  // 加载外壳
  await loadModel(
    './padThree/back.gltf',
    { x: 0, y: 0, z: 0 },
    {
      color: 0xdfe1e1,
    },
    true,
    true
  )
  // 加载大屏幕
  await loadModel(
    './padThree/bScreen.gltf',
    { x: 0, y: 0, z: 0 },
    {
      color: 0x5d5f64,
    }
  )
  // 加载小屏幕
  await loadModel(
    './padThree/sScreen.gltf',
    { x: 0, y: 0, z: 0 },
    {
      color: 0x5d5f64,
    }
  )
  // 加载按键
  for (let i = 0; i < 8; i++) {
    await loadModel(
      `./padThree/key${i}.gltf`,
      { x: 0, y: 0, z: 0 },
      {
        color: 0x3c3e3e,
      }
    )
  }
  // 加载旋钮
  for (let i = 0; i < 3; i++) {
    await loadModel(
      `./padThree/encoder${i}.gltf`,
      { x: 0, y: 0, z: 0 },
      {
        color: 0x3c3e3e,
      }
    )
  }
}

/********************************************************************************
 * @brief: 模型加载函数
 * @param {*} url
 * @param {*} position
 * @param {*} material
 * @return {*}
 ********************************************************************************/
function loadModel(url, position, material, isOpacity = false, isLine = false) {
  return new Promise((resolve, reject) => {
    loader.load(
      url,
      (gltf) => {
        const model = gltf.scene
        model.position.set(position.x, position.y, position.z)

        // 遍历模型子对象，设置材质
        model.traverse((child) => {
          if (child.isMesh) {
            child.material = new THREE.MeshStandardMaterial(material)
          }
        })
        // 设置透明材质
        if (isOpacity) {
          model.traverse((child) => {
            if (child.isMesh) {
              child.material.transparent = true
              child.material.opacity = 0.4 // 调整透明度
            }
          })
        }
        if (isLine) {
          model.traverse((child) => {
            if (child.isMesh) {
              const edges = new THREE.EdgesGeometry(child.geometry)
              const lineMaterial = new THREE.LineBasicMaterial({
                color: 0x8e8d8e,
              })
              const outline = new THREE.LineSegments(edges, lineMaterial)
              child.add(outline) // 将轮廓线添加到模型子对象上
            }
          })
        }

        // 添加模型到组
        keyboardGroup.add(model)
        scene.add(keyboardGroup)
        models.push(model)

        resolve(true)
      },
      undefined,
      (error) => {
        console.error('An error happened while loading the model', error)
        reject(error)
      }
    )
  })
}

/********************************************************************************
 * @brief: 鼠标移动事件
 * @param {*} event
 * @return {*}
 ********************************************************************************/
function onMouseMove(event) {
  let box = renderer.domElement.getBoundingClientRect()
  // 归一化鼠标位置
  mouse.x = ((event.clientX - box.x) / box.width) * 2 - 1
  mouse.y = -((event.clientY - box.y) / box.height) * 2 + 1

  // 根据鼠标位置和相机生成射线
  raycaster.setFromCamera(mouse, camera)
  // 检测射线和场景中对象的交集
  const intersects = raycaster.intersectObjects(models, true)

  // 重置所有模型的颜色
  models.forEach((model) => {
    model.traverse((child) => {
      if (child.isMesh) {
        if (models.findIndex((o) => child.parent.uuid == o.uuid) > 2) {
          // gsap.to(child.position, {
          //   y: 1,
          //   duration: 2,
          //   ease: 'power2.out',
          // })
          child.material.color.set(0x3c3e3e)
        }
      }
    })
  })

  // 改变鼠标悬停模型的颜色
  if (intersects.length > 0) {
    // 获取最接近的对象
    const hoveredObject = intersects[0].object
    hoveredObject.traverse((child) => {
      // console.info(child)
      if (child.isMesh) {
        if (models.findIndex((o) => child.parent.uuid == o.uuid) > 2) {
          child.material.color.set(0xe5e4e4) // 设置悬停颜色
        }
      }
    })
    isMouseOver = true

    // 动态调整摄像机视角
    camera.position.x = defaultCameraPosition.x + mouse.x * 2
    camera.position.y = defaultCameraPosition.y + mouse.y * 2
    // camera.lookAt(keyboardGroup.position)
    camera.lookAt(0, 0, 0)
  } else {
    isMouseOver = false
  }
}

/********************************************************************************
 * @brief: 鼠标移出事件处理
 * @return {*}
 ********************************************************************************/
function onMouseOut() {
  isMouseOver = false
  // 恢复摄像机到固定视角
  camera.position.set(
    defaultCameraPosition.x,
    defaultCameraPosition.y,
    defaultCameraPosition.z
  )
  // camera.lookAt(keyboardGroup.position)
  camera.lookAt(0, 0, 0)
}

/********************************************************************************
 * @brief: 鼠标按下事件
 * @param {*} event
 * @return {*}
 ********************************************************************************/
function onMouseDown(event) {
  raycaster.setFromCamera(mouse, camera)
  const intersects = raycaster.intersectObjects(models, true)

  if (intersects.length > 0) {
    let selectedModel = intersects[0].object // 设置被点击的模型
    selectedModel.traverse((child) => {
      if (child.isMesh) {
        let index = models.findIndex((o) => child.parent.uuid == o.uuid)
        if (index > 2) {
          // console.info(index)
          selectedModel.material.color.set(0xecd6d1)
          // 切换编辑的单键，发送信息到主窗口
          let tempObj: object = {}
          tempObj['configIndex'] = index - 3
          win.myApi.setConfigStore(tempObj)
          // 设置当前窗口的单键编辑索引
          configStore.setConfigIndex(index - 3)
          // 获取设置索引的配置数据
          win.myApi.setConfigStore({
            get: 'keyConfig',
          })
        }
      }
    })
  }
}

/********************************************************************************
 * @brief: 调整窗口大小
 * @return {*}
 ********************************************************************************/
export const resizeThreeBox = (size: object) => {
  threeWidth = size.width
  threeHeight = size.height
  camera.aspect = threeWidth / threeHeight
  camera.updateProjectionMatrix()
  renderer.setSize(threeWidth, threeHeight)
}

/********************************************************************************
 * @brief: 动画开始
 * @return {*}
 ********************************************************************************/
function animate() {
  requestAnimationFrame(animate)
  // stats.begin()
  // stats.end()
  renderer.render(scene, camera)
}
```

## 模型导入并自动旋转

1. **自动旋转模型**：在 `animate` 函数中，通过不断更新模型的 `rotation` 属性实现自动旋转。
2. **居中模型**：可以使用 `model.position` 设置位置，或者使用 Three.js 的 `Box3` 计算模型的边界并自动居中。

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Three.js Centered and Rotating Model</title>

  <style>body { margin: 0; overflow: hidden; }</style>

</head>

<body>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>

  <script src="https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/loaders/GLTFLoader.js"></script>

  <script>
    let scene, camera, renderer, model, mixer;
    const clock = new THREE.Clock();

    function init() {
      // 场景和摄像机
      scene = new THREE.Scene();
      camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
      camera.position.set(0, 1, 5);

      // 渲染器
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setClearColor(0x000000, 0); // 透明背景
      document.body.appendChild(renderer.domElement);

      // 光源
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
      scene.add(ambientLight);
      const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
      directionalLight.position.set(1, 1, 1).normalize();
      scene.add(directionalLight);

      // 加载模型
      const loader = new THREE.GLTFLoader();
      loader.load('path/to/your/model.gltf', (gltf) => {
        model = gltf.scene;
        
        // 居中模型
        const box = new THREE.Box3().setFromObject(model);
        const center = box.getCenter(new THREE.Vector3());
        model.position.sub(center);  // 将模型位置设置为居中
        
        // 动画初始化
        mixer = new THREE.AnimationMixer(model);
        if (gltf.animations.length > 0) {
          gltf.animations.forEach((clip) => {
            mixer.clipAction(clip).play();
          });
        }
        
        scene.add(model);
      }, undefined, (error) => {
        console.error('An error happened while loading the model', error);
      });

      // 窗口大小调整
      window.addEventListener("resize", onWindowResize);
      
      animate();
    }

    function onWindowResize() {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    }

    function animate() {
      requestAnimationFrame(animate);
      
      // 更新动画
      if (mixer) mixer.update(clock.getDelta());
      
      // 自动旋转模型
      if (model) {
        model.rotation.y += 0.01; // 设置旋转速度
      }

      renderer.render(scene, camera);
    }

    init();
  </script>

</body>

</html>
```

### 代码详解

1. **模型自动旋转**：在 `animate` 函数中，通过不断更新 `model.rotation.y` 实现水平自动旋转。可以通过调整旋转增量 `0.01` 修改旋转速度。
2. **模型居中**：使用 `Box3` 获取模型的边界，再通过 `model.position.sub(center)` 将模型移动到场景中心。
3. **窗口调整**：在 `resize` 事件中调整相机和渲染器的比例，以保持居中和旋转效果。
4. **动画更新**：如果模型包含动画，`mixer.update(clock.getDelta())` 会更新动画时间，确保动画顺利播放。
5. 
