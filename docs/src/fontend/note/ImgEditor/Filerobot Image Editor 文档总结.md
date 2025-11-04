# Filerobot Image Editor 配置文档总结

Filerobot Image Editor 是一款支持图片编辑（裁剪、注释、滤镜等）的前端插件，文档核心围绕**配置属性（Properties）** 和**回调函数（Callbacks）** 展开，同时包含插件基础控制逻辑，以下是结构化总结：

## 一、插件基础配置说明（Config）

插件通过 **CSS 宽高继承** 控制自身尺寸：

- 插件容器 / 包裹元素的 width 和 height 默认为 100%，修改容器宽高即可同步调整插件大小，无需单独配置插件尺寸。

## 二、核心配置属性（Properties）

按功能分类整理，包含 **必填属性、界面控制、多语言、保存逻辑、注释工具、性能优化** 等维度，关键属性标注「必填」「重要注意事项」。

### 1. 基础必填属性

| 属性名 | 类型                      | 支持版本 | 默认值    | 核心功能                                        | 注意事项               |
| ------ | ------------------------- | -------- | --------- | ----------------------------------------------- | ---------------------- |
| source | string / HTMLImageElement | +v4.0.0  | undefined | **必填**，指定待编辑的图片（URL 或 Image 元素） | 无此属性插件无法初始化 |

### 2. 主题与样式配置

控制插件整体视觉风格，支持自定义调色板和字体。

| 属性名 | 类型   | 支持版本 | 默认值                                                       | 核心功能             | 注意事项                                                     |
| ------ | ------ | -------- | ------------------------------------------------------------ | -------------------- | ------------------------------------------------------------ |
| theme  | object | +v4.0.0  | 基于 @scaleflex/ui 的默认主题（含 palette 和 typography 覆盖） | 自定义插件颜色和字体 | - palette：需配置 bg-secondary/accent-primary 等键（共 10 + 可自定义颜色，见文档）；- typography.fontFamily：需**自行导入字体**（必须包含 400（Normal）和 500（Medium）权重），默认字体 Roboto 需手动引入 |

### 3. 界面与交互控制

控制插件标签、默认工具、按钮显示等界面元素。

| 属性名         | 类型     | 支持版本 | 默认值               | 核心功能                                                     |
| -------------- | -------- | -------- | -------------------- | ------------------------------------------------------------ |
| tabsIds        | string[] | +v4.0.0  | []                   | 控制显示的标签（如裁剪、注释、滤镜），空数组显示所有标签；需通过 TABS 常量获取可用标签 ID（如 TABS.CROP） |
| defaultTabId   | string   | +v4.0.0  | Adjust               | 插件初始化时默认打开的标签                                   |
| defaultToolId  | string   | +v4.0.0  | 默认标签的第一个工具 | 初始化时默认激活的工具（需属于默认标签）                     |
| showBackButton | boolean  | +v4.0.0  | false                | 隐藏右上角「关闭」按钮，显示左上角「返回」按钮（同步调整保存 / 历史按钮位置） |
| showCanvasOnly | boolean  | +v4.0.0  | false                | 仅显示编辑画布，隐藏所有 UI（标签、按钮、工具栏），适合仅需裁剪等简单场景 |
| disableZooming | boolean  | +v4.2.0  | false                | 禁用缩放功能，同时移除缩放相关 UI                            |

### 4. 多语言配置

控制插件文本语言，支持后端翻译和自定义翻译。

| 属性名                 | 类型    | 支持版本 | 默认值 | 核心功能                                                     | 注意事项                                                     |
| ---------------------- | ------- | -------- | ------ | ------------------------------------------------------------ | ------------------------------------------------------------ |
| useBackendTranslations | boolean | +v4.0.0  | true   | 使用后端翻译服务（无需重新构建即可更新语言）                 | true 时，通过 language 指定语言；false 时，使用本地默认翻译 +translations 自定义翻译 |
| language               | string  | +v4.0.0  | en     | 语言缩写（如 zh 中文、ja 日文），仅在 useBackendTranslations: true 时生效 |                                                              |
| translations           | object  | +v4.0.0  | null   | 自定义翻译，覆盖本地和后端翻译（需按文档指定的翻译键配置）   |                                                              |

### 5. 保存相关配置

控制图片保存的名称、格式、质量等逻辑。

| 属性名                           | 类型     | 支持版本 | 默认值    | 核心功能                                                     | 注意事项                                                     |
| -------------------------------- | -------- | -------- | --------- | ------------------------------------------------------------ | ------------------------------------------------------------ |
| defaultSavedImageName            | string   | +v4.0.0  | undefined | 保存图片的默认文件名，未指定则从 source 提取                 |                                                              |
| defaultSavedImageType            | string   | +v4.0.0  | png       | 保存图片的默认格式，可选 png/jpeg/jpg/webp                   |                                                              |
| defaultSavedImageQuality         | number   | +v4.4.0  | 0.92      | 保存质量（0.1~1），仅对 jpeg/jpg/webp 生效（Base64 格式）    |                                                              |
| forceToPngInEllipticalCrop       | boolean  | +v4.0.0  | false     | 椭圆裁剪时强制保存为 png（保留透明度），覆盖用户选择的格式   |                                                              |
| closeAfterSave                   | boolean  | +v4.0.0  | false     | 保存完成后触发 onClose 回调（关闭插件）                      |                                                              |
| avoidChangesNotSavedAlertOnLeave | boolean  | +v4.0.0  | false     | 禁用「未保存离开」的浏览器确认弹窗（默认离开时提示）         |                                                              |
| disableSaveIfNoChanges           | boolean  | +v4.6.0  | false     | 无编辑操作时禁用保存按钮                                     |                                                              |
| removeSaveButton                 | boolean  | +v4.7.1  | false     | 完全移除保存按钮（需通过 moreSaveOptions 或自定义逻辑实现保存） |                                                              |
| moreSaveOptions                  | object[] | +v4.0.0  | []        | 扩展保存选项（如 “另存为新版本”），显示在保存按钮旁的下拉菜单 | 每个选项需配置 label（显示文本）、onClick（点击逻辑，接收 triggerSaveModal/triggerSave 函数） |

### 6. 注释工具配置

控制文本、图片、矩形等注释工具的默认行为，所有注释工具均继承 annotationsCommon 基础配置。

| 工具类型                          | 核心配置项                                                   | 默认值 / 功能                         | 注意事项                                                     |
| --------------------------------- | ------------------------------------------------------------ | ------------------------------------- | ------------------------------------------------------------ |
| **基础注释（annotationsCommon）** | - fill/stroke：填充 / 边框色- strokeWidth：边框宽度- shadow 系列：阴影配置- opacity：透明度 | 默认为黑色填充、无阴影、不透明        | 所有注释工具共享此配置，可单独覆盖                           |
| **Text（文本注释）**              | - text：默认占位文本- fonts：可选字体列表- fontSize/letterSpacing：字号 / 字间距- onFontChange：字体切换回调 | 占位文本为 Lorem 语句，默认字体 Arial | 字体需自行导入，onFontChange 需调用 reRenderCanvasFn 重新渲染 |
| **Image（图片注释）**             | - disableUpload：禁用本地图片上传- gallery：自定义图片库（需提供 originalUrl/previewUrl） | 支持本地上传，默认无自定义图片        | previewUrl 用于缩略图（优化性能）                            |
| **Rect（矩形注释）**              | - cornerRadius：圆角大小                                     | 0（直角）                             | -                                                            |
| **Ellipse（椭圆注释）**           | 仅继承 annotationsCommon                                     | -                                     | 无额外配置                                                   |
| **Polygon（多边形注释）**         | - sides：默认边数                                            | 3（三角形）                           | -                                                            |
| **Pen（画笔注释）**               | - strokeWidth：画笔宽度- tension：线条曲度- selectAnnotationAfterDrawing：绘制后自动选中 | 宽度 1，曲度 0.5，自动选中            | -                                                            |
| **Arrow（箭头注释）**             | - pointerLength/pointerWidth：箭头长度 / 宽度                | 自动计算                              | -                                                            |
| **Watermark（水印）**             | - gallery：水印图片库- textScalingRatio：文本水印缩放比- hideTextWatermark：隐藏文本水印 | 支持文本 / 图片水印，缩放比 0.33      | 云模式下文本水印仅支持单行                                   |

### 7. 裁剪工具配置（Crop）

控制裁剪区域、比例、预设等逻辑，功能最复杂的工具配置。

| 配置项             | 类型               | 默认值   | 核心功能                                                     |
| ------------------ | ------------------ | -------- | ------------------------------------------------------------ |
| minWidth/minHeight | number             | 14px     | 裁剪区域最小宽高                                             |
| ratio              | string/number      | original | 默认裁剪比例，可选 original（原图）/ellipse（椭圆）/ 自定义数值（如 4/3） |
| autoResize         | boolean            | false    | 按预设宽高裁剪后自动缩放                                     |
| presetsItems       | CropPresetItem[]   | []       | 自定义裁剪预设（如 4:3、21:9）                               |
| presetsFolders     | CropPresetFolder[] | []       | 分组裁剪预设（如 “社交媒体” 分组含 Facebook 头像 / 封面）    |
| lockCropAreaAt     | string             | null     | 锁定裁剪区域位置（如 top-left 左上角）                       |

**CropPresetItem 结构**：需包含 titleKey（翻译键）、ratio（比例）或 width/height（宽高），支持自定义图标。

### 8. 云图片模式配置（useCloudimage）

开启后插件返回图片处理 URL（而非 Base64），需 Cloudimage Token 支持。

| 配置项        | 类型    | 默认值 | 核心功能                                                     |
| ------------- | ------- | ------ | ------------------------------------------------------------ |
| useCloudimage | boolean | false  | 是否启用云模式                                               |
| cloudimage    | object  | -      | 云服务配置：- token：Cloudimage 令牌（必填）- domain：服务域名- imageSealing：图片加密配置 |

### 9. 性能与高级控制

| 属性名                     | 类型             | 支持版本 | 默认值                  | 核心功能                                              | 注意事项                              |
| -------------------------- | ---------------- | -------- | ----------------------- | ----------------------------------------------------- | ------------------------------------- |
| savingPixelRatio           | number           | +v4.0.0  | 4                       | 保存图片的像素比（越高分辨率越高，内存占用越大）      | 过高可能导致浏览器崩溃                |
| previewPixelRatio          | number           | +v4.0.0  | window.devicePixelRatio | 预览画布的像素比（影响编辑时的清晰度）                | -                                     |
| observePluginContainerSize | boolean          | +v4.0.0  | false                   | 通过 JS 监听容器尺寸变化（默认用 CSS 继承）           | 容器高度为 auto 时建议开启            |
| loadableDesignState        | object           | +v4.0.0  | null                    | 加载历史编辑状态（与 onSave 返回的 designState 一致） | 实现 “继续编辑” 功能                  |
| getCurrentImgDataFnRef     | React Ref/Object | +v4.0.0  | undefined               | 获取当前图片数据的函数（赋值到 ref.current）          | 用于自定义保存逻辑，调用时可能阻塞 UI |
| updateStateFnRef           | React Ref/Object | +v4.0.0  | undefined               | 手动更新插件状态的函数                                | 风险较高，需了解插件内部状态结构      |
| noCrossOrigin              | boolean          | +v4.5.0  | false                   | 禁用图片加载的 crossOrigin=Anonymous                  | 可能导致 CORS 问题，不推荐开启        |
| resetOnImageSourceChange   | boolean          | +v4.8.0  | false                   | 更换 source 时重置编辑状态                            | -                                     |

## 三、回调函数（Callbacks）

控制插件编辑、保存、关闭等时机的自定义逻辑。

| 回调名       | 触发时机                                            | 参数含义                                                     | 特殊逻辑                                                     |
| ------------ | --------------------------------------------------- | ------------------------------------------------------------ | ------------------------------------------------------------ |
| onBeforeSave | 用户点击保存按钮后，默认保存前                      | imageFileInfo：图片文件信息                                  | 返回 false 会**阻止默认保存行为**；云模式 /moreSaveOptions 下不生效 |
| onSave       | 保存完成后（或 onBeforeSave 返回 false 时手动触发） | - imageData：图片数据（含 Base64 和 Canvas 元素）- imageDesignState：当前编辑状态 | 返回 Promise 可保持加载状态（如异步上传服务器）              |
| onModify     | 图片发生任何编辑操作后（如裁剪、添加注释）          | currentImageDesignState：最新编辑状态                        | 可能多次触发（如调整滑块时），需注意性能                     |
| onClose      | 用户点击关闭 / 返回按钮时                           | - closingReason：关闭原因- haveNotSavedChanges：是否有未保存修改 | 未配置此回调则不显示关闭按钮                                 |

## 四、核心使用建议

1. **必填配置**：初始化时必须指定 source（图片源）和 onClose（关闭逻辑），否则插件无法正常使用。

1. **主题与字体**：自定义 theme 时，务必导入字体的 400 和 500 权重，避免文字显示异常。

1. **模式选择**：本地编辑用默认模式（返回 Base64），大规模图片处理用云模式（需 Cloudimage Token）。

1. **性能优化**：高分辨率图片建议降低 savingPixelRatio（如 2），避免保存时浏览器卡顿。

1. **CORS 注意**：加载外部图片时，确保图片支持 CORS，否则可能无法保存或应用滤镜（可尝试 noCrossOrigin: true，但不推荐）。