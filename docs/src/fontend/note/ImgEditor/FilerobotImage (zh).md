## 配置

> 注意：该插件通过 CSS 尊重容器/包装器 HTML 元素，将 `width` 和 `height` 都设置为 `100%`，因此您可以通过添加/更改包装器 HTML 元素的 width/height 来更改插件的宽度/高度。

### 属性

#### `source`

<u>类型：</u> `string` | `HTMLImageElement` **_必需_**。

<u>支持版本：</u> +v4.0.0

<u>默认值：</u> `undefined`。

图像 URL 或一个 `HTMLImageElement`，表示将应用操作/编辑的图像。

#### `theme`

<u>类型：</u> `object`

<u>支持版本：</u> +v4.0.0

<u>默认值：</u>

来自 [@scaleflex/ui](https://github.com/scaleflex/ui/blob/1617f8b19ade7199110df6e2ceff77dacefd75bd/packages/ui/src/theme/entity/default-theme.ts#L43) 的主题与以下覆盖项深度合并

```
// 覆盖项
{
  palette: {
    'bg-primary-active': '#ECF3FF',
  },
  typography: {
    fontFamily: 'Roboto, Arial',
  },
}

// 使用的属性，如果您需要提供自定义颜色/主题，您应使用您的颜色十六进制/名称字符串值自定义这些属性（全部或任意部分）。
{
  palette: {
    'bg-secondary': '....',
    'bg-primary': : '....',
    'bg-primary-active': : '....',
    'accent-primary': : '....',
    'accent-primary-active': : '....',
    'icons-primary': : '....',
    'icons-secondary': : '....',
    'borders-secondary': : '....',
    'borders-primary': : '....',
    'borders-strong': : '....',
    'light-shadow': : '....',
    'warning': : '....',

  },
  typography: {
    fontFamily: : '....', // 字体家族字符串值，您应该在您的应用中导入此字体。
  },
}
```

几乎您会需要这两个对象（[**palette**](https://github.com/scaleflex/ui/blob/master/packages/ui/src/utils/types/palette/color.ts#L1) _值是 palette 对象可能的键_ & [**typograpghy**](https://github.com/scaleflex/ui/blob/master/packages/ui/src/theme/entity/default-theme.ts#L52)）来获得您想要的主题。

由于插件的颜色是从主题对象动态获取的，它使您能够将颜色和字体家族自定义为您自己的。

> 注意：您必须从您那边导入具有两种字重（Normal === 400, Medium === 500）的字体家族，以使字体正常工作并按预期显示文本，这意味着 `Roboto` 默认不包含在插件中，所以如果您通过主题提供了另一个字体家族值，您也必须从您那边导入它，别忘了也从您那边导入它。

#### `tabsIds`

<u>类型：</u> `string[]`

<u>支持版本：</u> +v4.0.0

<u>默认值：</u> `[]`

将向用户显示的标签页，如果提供空数组或保留默认值，则将使用所有标签页，否则将显示提供的标签页 ID。

通过以下任一方式访问可用的标签页 ID 和工具 ID

```js
// 从 CDN 包访问
const { TABS, TOOLS } = window.FilerobotImageEditor;

// 从 React 函数组件库访问。NPM
import ReactFilerobotImageEditor, {
  TABS,
  TOOLS,
} from 'react-filerobot-image-editor';

// 从 VanillaJS 库访问。NPM
import VanillaFilerobotImageEditor from 'filerobot-image-editor';
const { TABS, TOOLS } = VanillaFilerobotImageEditor;
```

#### `defaultTabId`

<u>类型：</u> `string`

<u>支持版本：</u> +v4.0.0

<u>默认值：</u> `Adjust`

用户打开插件时默认打开的标签页。

#### `defaultToolId`

<u>类型：</u> `string`

<u>支持版本：</u> +v4.0.0

<u>默认值：</u> 默认打开标签页的第一个工具。

用户打开插件时默认打开的工具，并且必须是与打开标签页相关的工具之一。

#### `useBackendTranslations`

<u>类型：</u> `boolean`

<u>支持版本：</u> +v4.0.0

<u>默认值：</u> `true`

一个后端服务，托管插件的翻译，以便能够在翻译更改时无需重新构建即可更改翻译，并有机会支持更多语言，如果为 `true` 则将使用该服务，并且下一个 [`language`](#language) 属性将用于确定显示哪种语言，`false` 表示避免使用此服务，在这种情况下将使用默认翻译和提供的 [`translations`](#translations) 属性。

#### `language`

<u>类型：</u> `string`

<u>支持版本：</u> +v4.0.0

<u>默认值：</u> `en`

用于语言/翻译的 2 字母简写，在 [`useBackendTranslations`](#usebackendtranslations) 为 `true` 时使用。

#### `translations`

<u>类型：</u> `object`

<u>支持版本：</u> +v4.0.0

<u>默认值：</u> `null`

如果提供，将用于覆盖随插件本地到达的默认翻译和[后端](#usebackendtranslations)的翻译。

> 所有翻译键可以在这里找到 [这里](https://github.com/scaleflex/filerobot-image-editor/blob/master/packages/react-filerobot-image-editor/src/context/defaultTranslations.js#L1)。

#### `avoidChangesNotSavedAlertOnLeave`

<u>类型：</u> `boolean`

<u>支持版本：</u> +v4.0.0

<u>默认值：</u> `false`

默认情况下，一旦用户对图像进行了任何更改/编辑并且尚未保存图像，然后尝试在保存前离开页面，则会显示浏览器确认框，询问他是否真的想在保存前离开，`true` 表示不会显示。

#### `showBackButton`

<u>类型：</u> `boolean`

<u>支持版本：</u> +v4.0.0

<u>默认值：</u> `false`

如果为 `true`，右上角的关闭按钮将被隐藏，并且左上角将显示返回按钮（替换保存和历史记录按钮的位置）。

#### `defaultSavedImageName`

<u>类型：</u> `string`

<u>支持版本：</u> +v4.0.0

<u>默认值：</u> undefined

图像文件名，用作将保存的图像文件的默认名称，如果未提供，则将从提供的图像 src 中提取名称。

#### `defaultSavedImageType`

<u>类型：</u> `string`

<u>支持版本：</u> +v4.0.0

<u>默认值：</u> `png`

可能的值：`'png' | 'jpeg' | 'jpg' | 'webp'`

保存图像时使用和选择的默认类型（用户有可能从保存模态框中更改它）。

> 注意：质量修改将仅应用于 `jpeg`、`jpg` 和 `webp` 类型，且仅在通过默认行为保存图像时在返回的 [`base64`](#onsave) 格式中生效。

#### `defaultSavedImageQuality`

<u>类型：</u> `number`

<u>支持版本：</u> +v4.4.0

<u>默认值：</u> `0.92`

可能的值：`[0.1 - 1]`

用于最终画布保存的 quality 属性的默认值。使用的值越高（最小值：0.1，最大值：1），生成的图像分辨率越高，生成的图像文件大小也越大，反之亦然。

> 注意：质量修改将仅应用于 `jpeg`、`jpg` 和 `webp` 类型，且仅在返回的 [`base64`](#onsave) 格式中生效。

> 注意：此属性的值将反映默认保存行为 UI 中找到的质量选项（如果使用默认保存行为，否则仅 UI 不受影响）。

#### `forceToPngInEllipticalCrop`

<u>类型：</u> `boolean`

<u>支持版本：</u> +v4.0.0

<u>默认值：</u> `false`

如果为 `true`，即使用户在保存模态框中选择了其他扩展名，保存的图像类型将始终为 `png` 类型，以保留透明度，否则熟悉的行为（defaultSavedImageType 或用户选择的类型）优先。

#### `closeAfterSave`

<u>类型：</u> `boolean`

<u>支持版本：</u> +v4.0.0

<u>默认值：</u> `false`

在处理保存并触发 [`onSave`](#onsave) 后，触发 [`onClose`](#onclose) 回调（如果为 `true`）。

#### `loadableDesignState`

<u>类型：</u> `object`

<u>支持版本：</u> +v4.0.0

<u>默认值：</u> `null`

如果提供，插件将在初始加载时加载此设计状态，以便有可能在另一个时间回到该设计并继续编辑它，它接受与 [`onSave`](#onsave) 回调的 designState 参数中提供的相同对象。

#### `annotationsCommon`

<u>类型：</u> `object`

<u>支持版本：</u> +v4.0.0

<u>默认值：</u>

```js
{
    fill: '#000000',
    stroke: '#000000',
    strokeWidth: 0,
    shadowOffsetX: 0,
    shadowOffsetY: 0,
    shadowBlur: 0,
    shadowColor: '#000000',
    shadowOpacity: 1,
    opacity: 1,
}
```

所有注释工具中存在的通用选项，并用作默认值。

| 属性                | 类型           | 默认值    | 描述                          |
| ------------------- | -------------- | --------- | ----------------------------- |
| **`fill`**          | string         | '#000000' | 任何添加的注释的填充颜色      |
| **`stroke`**        | string         | '#000000' | 任何添加的注释的描边颜色      |
| **`strokeWidth`**   | number         | 0         | 任何添加的注释的描边宽度      |
| **`shadowOffsetX`** | number         | 0         | 从其基本注释的水平/X 阴影偏移 |
| **`shadowOffsetY`** | number         | 0         | 从其基本注释的垂直/Y 阴影偏移 |
| **`shadowBlur`**    | number         | 0         | 添加到注释的阴影的模糊值      |
| **`shadowColor`**   | string         | '#000000' | 添加到注释的阴影的颜色        |
| **`shadowOpacity`** | number         | 1         | 注释阴影的透明度/不透明度值   |
| **`opacity`**       | number (0 - 1) | 1         | 整个注释的透明度/不透明度值   |

#### `Text`

<u>类型：</u> `object`

<u>支持版本：</u> +v4.0.0

<u>默认值：</u>

```js
{
    ...annotationsCommon,
    text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    fontFamily: 'Arial',
    fonts: [
      { label: 'Arial', value: 'Arial' },
      'Tahoma',
      'Sans-serif',
      { label: 'Comic Sans', value: 'Comic-sans' },
    ],
    fontSize: 14,
    letterSpacing: 0,
    lineHeight: 1,
    align: 'left',
    fontStyle: 'normal',
    onFontChange: (newFontFamily, reRenderCanvasFn) => undefined,
}
```

文本注释工具可用的选项，除了 annotationsCommon 属性外，

| 属性                | 类型                   | 默认值（可能的值）                                         | 描述                                                         |
| ------------------- | ---------------------- | ---------------------------------------------------------- | ------------------------------------------------------------ |
| **`text`**          | string                 | 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.' | 添加新文本注释时使用的占位符文本                             |
| **`fontFamily`**    | string                 | 'Arial'                                                    | 文本使用的字体家族                                           |
| **`fonts`**         | (strings \| objects)[] | 上面提到的                                                 | 用户添加文本时可供选择的字体                                 |
| **`fontSize`**      | number                 | 14                                                         | 添加文本的默认大小                                           |
| **`letterSpacing`** | number                 | 0                                                          | 文本字母之间的间距/填充                                      |
| **`lineHeight`**    | number                 | 1                                                          | 添加文本的每行高度                                           |
| **`align`**         | string                 | 'left' ('left' \| 'center' \| 'right')                     | 添加文本的水平对齐方式                                       |
| **`fontStyle`**     | string                 | 'normal' ('normal' \| 'bold' \| 'italic' \| 'bold italic') | 添加文本的字体样式和字重                                     |
| **`onFontChange`**  | function               | `(newFontFamily, reRenderCanvasFn) => undefined`           | 更改字体家族时调用的回调方法（几乎在延迟加载/导入所选字体家族时需要，以防您不想在用户选择之前加载所有字体，并且您必须在字体加载后调用 `reRenderCanvasFn` 以使用所选字体渲染文本） |

> 如果您是延迟加载字体，则必须在字体加载后手动重新渲染画布（如果字体未加载且用户更改了字体，则字体将不会应用），您可以在 `onFontChange` 函数内部调用第二个参数 (`reRenderCanvasFn`) 以在您想要的任何时候手动重新渲染画布。

> 字体必须从您那边的实现中加载才能生效，因为不能保证用户的操作系统上有该字体。

#### `Image`

<u>类型：</u> `object`

<u>支持版本：</u> +v4.0.0

<u>默认值：</u>

```js
{
    ...annotationsCommon,
    fill: undefined,
    disableUpload: false,
    gallery: [{
      originalUrl: '...', // 要在画布中添加的原始大小图像的 url
      previewUrl: '...', // 用作图库列表预览的图像的 url（用于减少数据消耗和更好的性能）。
    }]
}
```

图像注释工具可用的选项，除了 annotationsCommon 属性外，

| 属性                | 类型                                            | 默认值（可能的值） | 描述                                                         |
| ------------------- | ----------------------------------------------- | ------------------ | ------------------------------------------------------------ |
| **`fill`**          | string                                          | undefined          | 填充图像透明部分的颜色                                       |
| **`disableUpload`** | boolean                                         | false              | 如果为 `true`，则禁用从本地设备（用户计算机）上传/添加图像的可能性 |
| **`gallery`**       | ({ originalUrl: string, previewUrl: string })[] | []                 | 用户将从中选择以添加到画布上的自定义图像，`originalUrl` 是原始大小图像的 url，`previewUrl` 是同一图像的预览 url（视为缩略图，以获得更好的性能和更少的数据消耗）。 |

#### `Rect`

<u>类型：</u> `object`

<u>支持版本：</u> +v4.0.0

<u>默认值：</u>

```js
{
    ...annotationsCommon,
    cornerRadius: 0,
}
```

矩形注释工具可用的选项，除了 annotationsCommon 属性外，

| 属性               | 类型   | 默认值（可能的值） | 描述         |
| ------------------ | ------ | ------------------ | ------------ |
| **`cornerRadius`** | number | 0                  | 矩形角的半径 |

#### `Ellipse`

<u>类型：</u> `object`

<u>支持版本：</u> +v4.0.0

<u>默认值：</u> `annotationsCommon`

椭圆没有特定的选项，只有 annotationsCommon 用于椭圆，您可以通过在这里传递它们来仅为椭圆覆盖其中任何一个。

#### `Polygon`

<u>类型：</u> `object`

<u>支持版本：</u> +v4.0.0

<u>默认值：</u>

```js
{
    ...annotationsCommon,
    sides: 3,
}
```

多边形注释工具可用的选项，除了 annotationsCommon 属性外，

| 属性        | 类型   | 默认值（可能的值） | 描述                       |
| ----------- | ------ | ------------------ | -------------------------- |
| **`sides`** | number | 3                  | 默认考虑的添加多边形的边数 |

#### `Pen`

<u>类型：</u> `object`

<u>支持版本：</u> +v4.0.0

<u>默认值：</u>

```js
{
    ...annotationsCommon,
    strokeWidth: 1,
    tension: 0.5,
    lineCap: 'round',
    selectAnnotationAfterDrawing: true,
}
```

画笔注释工具可用的选项，除了 annotationsCommon 属性外，

| 属性                               | 类型    | 默认值（可能的值）                     | 描述                                                         |
| ---------------------------------- | ------- | -------------------------------------- | ------------------------------------------------------------ |
| **`lineCap`**                      | string  | 'butt' ('butt' \| 'round' \| 'square') | 起始和结束边框的线帽                                         |
| **`tension`**                      | number  | 0.5                                    | 绘制线条的张力值，值越高使线条更弯曲和有张力（最好保留默认值） |
| **`selectAnnotationAfterDrawing`** | boolean | true                                   | 绘制后自动选择                                               |

#### `Line`

<u>类型：</u> `object`

<u>支持版本：</u> +v4.0.0

<u>默认值：</u>

```js
{
    ...annotationsCommon,
    lineCap: 'butt',
    strokeWidth: 1,
}
```

线条注释工具可用的选项，除了 annotationsCommon 属性外，

| 属性          | 类型   | 默认值（可能的值）                     | 描述                 |
| ------------- | ------ | -------------------------------------- | -------------------- |
| **`lineCap`** | string | 'butt' ('butt' \| 'round' \| 'square') | 起始和结束边框的线帽 |

#### `Arrow`

<u>类型：</u> `object`

<u>支持版本：</u> +v4.0.0

<u>默认值：</u>

```js
{
    ...annotationsCommon,
    strokeWidth: 6,
    lineCap: 'butt',
    pointerLength: undefined,
    pointerWidth: undefined,
}
```

箭头注释工具可用的选项，除了 annotationsCommon 属性外，

| 属性                | 类型   | 默认值（可能的值）                     | 描述                   |
| ------------------- | ------ | -------------------------------------- | ---------------------- |
| **`lineCap`**       | string | 'butt' ('butt' \| 'round' \| 'square') | 边框线帽               |
| **`pointerLength`** | number | undefined                              | 箭头指针的长度（像素） |
| **`pointerWidth`**  | number | undefined                              | 箭头指针的宽度（像素） |

#### `Watermark`

<u>类型：</u> `object`

<u>支持版本：</u> +v4.0.0

<u>默认值：</u>

```js
{
    ...(config[TOOLS.TEXT || TOOLS.IMAGE]), // 取决于添加的水印类型，将使用相应的配置
    gallery: [],
    textScalingRatio: 0.33,
    imageScalingRatio: 0.33,
    hideTextWatermark: false,
    onUploadWatermarkImgClick: () => {},
}
```

水印工具可用的选项，水印使用上述文本和图像注释工具的选项，具体取决于所选的水印类型，

| 属性                            | 类型                                                         | 默认值（可能的值） | 描述                                                         |
| ------------------------------- | ------------------------------------------------------------ | ------------------ | ------------------------------------------------------------ |
| **`gallery`**                   | (string \| { url: string, previewUrl: string })[]            | []                 | 水印图像 URL，用于直接从水印标签页向用户显示可用水印列表以供使用 |
| **`textScalingRatio`**          | number                                                       | 0.33               | 文本缩放比例                                                 |
| **`imageScalingRatio`**         | number                                                       | 0.33               | 图像缩放比例                                                 |
| **`hideTextWatermark`**         | boolean                                                      | false              | 用于隐藏添加文本水印的可能性                                 |
| **`onUploadWatermarkImgClick`** | (loadAndSetWatermarkImgFn) => Promise<{ url: string, revokeObjectUrl?: boolean }> \| void | undefined          | 点击添加图像水印按钮时触发的回调函数，返回一个 Promise，其中包含一个具有要添加的水印图像 URL 的 `url` 属性的对象，或者您可以使用作为参数提供的回调函数。`revokeObjectUrl` 属性用于在提供的 URL 是对象 URL 的情况下撤销该 URL |

> 文本水印的宽度/多行在 [cloudimage](#usecloudimage) 模式下不受支持，即使在选择时显示了变换/调整大小框架，这意味着在插件生成的 cloudimage URL 中，文本水印将始终为 1 行。
>
> 仅在 cloudimage 模式下支持的文本水印字体可以在[这里](https://docs.cloudimage.io/go/cloudimage-documentation-v7/en/watermarking/text-watermark/watermark-fonts)找到，您可以通过 [`Text` 属性](#text) 提供它们/其中任何一个。

#### `Rotate`

<u>类型：</u> `object`

<u>支持版本：</u> +v4.3.2

<u>默认值：</u>

```js
{
    angle: 90,
    componentType: 'slider',
}
```

裁剪工具可用的选项，

| 属性                | 类型   | 默认值（可能的值）      | 描述               |
| ------------------- | ------ | ----------------------- | ------------------ |
| **`angle`**         | number | 90                      | 旋转角度           |
| **`componentType`** | number | ('slider' \| 'buttons') | 用于更改旋转的组件 |

#### `Crop`

<u>类型：</u> `object`

<u>支持版本：</u> +v4.0.0

<u>默认值：</u>

```js
{
    minWidth: 14,
    minHeight: 14,
    maxWidth: null,
    maxHeight: null,
    ratio: 'original',
    ratioTitleKey: 'original',
    noPresets: false,
    autoResize: false,
    presetsItems: [],
    presetsFolders: [],
    lockCropAreaAt: null, // 'top-left'
}
```

裁剪工具可用的选项，

| 属性                 | 类型                                                         | 默认值（可能的值）                                         | 描述                                                         |
| -------------------- | ------------------------------------------------------------ | ---------------------------------------------------------- | ------------------------------------------------------------ |
| **`minWidth`**       | number                                                       | 14                                                         | 可能裁剪区域的最小宽度（像素）                               |
| **`minHeight`**      | number                                                       | 14                                                         | 可能裁剪区域的最小高度（像素）                               |
| **`maxWidth`**       | number                                                       | null                                                       | 可能裁剪区域的最大宽度（像素）                               |
| **`maxHeight`**      | number                                                       | null                                                       | 可能裁剪区域的最大高度（像素）                               |
| **`ratio`**          | string \| number                                             | 'original' ('original' \| 'ellipse' \| 'custom' \| number) | 裁剪区域的默认比例                                           |
| **`ratioTitleKey`**  | string                                                       | 与提供的/默认裁剪的 `ratio` 相同                           | 所选裁剪比例的标题翻译键，将最初显示在裁剪工具图标旁边       |
| **`noPresets`**      | boolean                                                      | false                                                      | 如果为 `true` 则隐藏裁剪预设                                 |
| **`autoResize`**     | boolean                                                      | false                                                      | 如果为 `true` 并且所选的裁剪预设项同时具有宽度和高度，则原始图像将被裁剪，然后使用该宽度和高度对裁剪后的图像应用调整大小，否则将应用无调整大小的裁剪 |
| **`presetsItems`**   | [`CropPresetItem`](#croppresetitem) 对象数组                 | []                                                         | 裁剪预设项，用于扩展插件中提供的默认项，将显示在裁剪预设的第一个菜单中 |
| **`presetsFolders`** | [`CropPresetFolder`](#croppresetfolder) 对象数组             | []                                                         | 裁剪预设文件夹，将显示为带有子列表的项，悬停时打开另一个列表，其中包含提供的裁剪预设组，这些组包含不同的裁剪项 |
| **`lockCropAreaAt`** | `y-x` 格式的字符串 => `top/center/bottom`-`left/center/right` | null                                                       | 为裁剪区域定义一个固定位置，并将其锁定（不允许用户操作）     |

##### **CropPresetFolder**:

<u>类型：</u> `object`

<u>支持版本：</u> +v4.0.0

| 属性           | 类型                                           | 默认值（可能的值） | 描述                                                         |
| -------------- | ---------------------------------------------- | ------------------ | ------------------------------------------------------------ |
| **`titleKey`** | string **_必需_**                              | ''                 | 预设文件夹标题的翻译键（如果后端翻译不包含该翻译，则该翻译必须存在于 [`translations`](#translations) 对象中） |
| **`groups`**   | [`CropPresetGroup`](#croppresetgroup) 对象数组 | undefined          | 在子列表中显示的裁剪预设组，作为用户的面包屑导航，并让他有机会选择裁剪预设项 |
| **`icon`**     | HTML 元素 \| string \| React 函数组件          | undefined          | 前缀在裁剪预设文件夹标题前的图标                             |

##### **CropPresetGroup**:

<u>类型：</u> `object`

<u>支持版本：</u> +v4.0.0

| 属性           | 类型                                         | 默认值（可能的值） | 描述                                                         |
| -------------- | -------------------------------------------- | ------------------ | ------------------------------------------------------------ |
| **`titleKey`** | string **_必需_**                            | ''                 | 预设组标题的翻译键（如果后端翻译不包含该翻译，则该翻译必须存在于 [`translations`](#translations) 对象中） |
| **`items`**    | [`CropPresetItem`](#croppresetitem) 对象数组 | undefined          | 在组的面包屑导航内部显示的裁剪预设项，让用户从中选择         |

##### **CropPresetItem**:

<u>类型：</u> `object`

<u>支持版本：</u> +v4.0.0

| 属性                      | 类型                                                   | 默认值（可能的值）                                 | 描述                                                         |
| ------------------------- | ------------------------------------------------------ | -------------------------------------------------- | ------------------------------------------------------------ |
| **`titleKey`**            | string **_必需_**                                      | ''                                                 | 预设项标题的翻译键（如果后端翻译不包含该翻译，则该翻译必须存在于 [`translations`](#translations) 对象中） |
| **`descriptionKey`**      | string                                                 | ''                                                 | 裁剪预设项描述标签的翻译键，显示在标题键旁边，用于更具描述性的预设（几乎用于显示预设项的比例/大小） |
| **`ratio`**               | string **_如果没有提供 `width` 和 `height` 则为必需_** | '' ('original' \| 'ellipse' \| 'custom' \| number) | 用于裁剪的预设项比例                                         |
| **`width`**               | number **_如果没有提供 `ratio` 则为必需_**             | undefined                                          | 裁剪预设项的宽度，与高度一起使用以计算适当的预设项比例（`ratio = width / height`） |
| **`height`**              | number **_如果没有提供 `ratio` 则为必需_**             | undefined                                          | 裁剪预设项的高度，与宽度一起使用以计算适当的预设项比例（`ratio = width / height`） |
| **`icon`**                | HTML 元素 \| string \| React 函数组件                  | undefined                                          | 前缀在裁剪预设项标题前的图标                                 |
| **`disableManualResize`** | boolean                                                | false                                              | 如果为 `true`，则如果用户选择了此裁剪预设项，调整大小输入将被禁用，并且 `autoResize` 必须为 `true`，否则它将不起作用 |
| **`noEffect`**            | boolean                                                | false                                              | 如果为 `true`，则仅在裁剪标签页的画布上显示警告文本，并且裁剪不会影响图像，它只是作为一个选定的选项添加，应该从您那边处理 |

> 注意：同一数组中的其他对象之间，每个对象的 `titleKey` 必须是唯一的。

示例，

```js
{
  autoResize: true,
  presetsItems: [
    {
      titleKey: 'classicTv',
      descriptionKey: '4:3',
      ratio: 4 / 3,
      icon: CropClassicTv,
    },
    {
      titleKey: 'cinemascope',
      descriptionKey: '21:9',
      ratio: 21 / 9,
      icon: CropCinemaScope, // 可选的
    },
  ],
  presetsFolders: [
    {
      titleKey: 'socialMedia', // 将被翻译成 Social Media，因为后端包含此翻译键
      icon: Social, // React 函数组件、字符串或 HTML 元素
      groups: [
        {
          titleKey: 'facebook',
          items: [
            {
              titleKey: 'profile',
              width: 180,
              height: 180,
              descriptionKey: 'fbProfilePhotoSize',
            },
            {
              titleKey: 'coverPhoto',
              width: 820,
              height: 312,
              descriptionKey: 'fbCoverPhotoSize',
            },
          ],
        },
      ],
    },
  ],
}
```

> 请注意上述属性的大小写。

#### `useCloudimage`

<u>类型：</u> `boolean`

<u>支持版本：</u> +v4.0.0

<u>默认值：</u> `false`

如果为 `true`，插件将在 [`cloudimage`](https://cloudimage.io/) 模式下工作，意味着您在保存时将收到一个包含转换/操作的 cloudimage URL，而不是图像本身，并且在此模式下不支持某些标签页、工具和选项，否则使用默认模式。

> 要使用 Cloudimage 模式，您需要一个 Cloudimage 令牌来通过 CDN 传递您的图像。别担心，只需[在这里](https://www.cloudimage.io/en/register_page)注册即可在几秒钟内获得一个。一旦您的令牌创建完成，您可以按照 [`cloudimage` 属性](#cloudimage) 中的描述进行配置。此令牌允许您每月免费使用 25GB 的图像缓存和 25GB 的全球 CDN 流量。

#### `cloudimage`

<u>类型：</u> `object`

<u>支持版本：</u> +v4.0.0

<u>默认值：</u>

```js
{
  token: '',
  dontPrefixUrl: false,
  domain: 'cloudimg.io',
  version: '',
  secureProtocol: true,
  imageSealing: {
    enable: false,
    salt: '',
    charCount: 10,
    includeParams: [],
  }
}
```

cloudimage 模式可用的选项，

| 属性                             | 类型                                          | 默认值（可能的值） | 描述                                                         |
| -------------------------------- | --------------------------------------------- | ------------------ | ------------------------------------------------------------ |
| **`token`**                      | string                                        | ''                 | [cloudimage](https://cloudimage.io/) 令牌                    |
| **`dontPrefixUrl`**              | boolean                                       | false              | 不要将整个 URL（协议、令牌和域）前缀添加到生成的 cloudimage URL |
| **`domain`**                     | string                                        | cloudimg.io        | cloudimage 服务中使用的域名                                  |
| **`version`**                    | string                                        | ''                 | 使用的 cloudimage 服务版本                                   |
| **`secureProtocol`**             | boolean                                       | true               | `true` 表示在 URL 中使用 (`https`)，`false` 表示使用 (`http`) |
| **`loadableQuery`**              | string                                        | ''                 | 一个 cloudimage 字符串查询参数，用于加载到插件的设计状态中并继续对先前的编辑进行编辑（例如，`w=500&h=300&blur=5`），您可以将其与 [`loadableDesignState`](#loadabledesignstate-experimental) 一起使用 |
| **`imageSealing`**               | object                                        | 上面提到的         | 分配图像密封功能的选项（您的 cloudimage 帐户必须支持它）     |
| imageSealing.**`enable`**        | boolean                                       | true               | `true` 表示在 URL 中使用 (`https`)，`false` 表示使用 (`http`) |
| imageSealing.**`salt`**          | string **_如果启用了 imageSealing 则为必需_** | ''                 | 在配置时设置的盐字符串，用于加密                             |
| imageSealing.**`charCount`**     | number                                        | 10                 | 计算的哈希（URL ci_seal 参数）长度                           |
| imageSealing.**`includeParams`** | string[]                                      | []                 | 要密封的 URL 查询参数。默认情况下，所有参数都将被密封。您可以设置一个查询参数列表，例如 ['wat_url']，这使您能够自由地向 URL 附加其他转换（密封的参数不能被覆盖）。 |

#### `savingPixelRatio`

<u>类型：</u> `number`

<u>支持版本：</u> +v4.0.0

<u>默认值：</u> `4`

保存图像时使用的像素比率（比率越高，保存的图像分辨率越高，直到达到图像可能的最大分辨率，使用的内存和保存的处理时间也越高）。

> 高像素比率可能导致某些设备崩溃/变慢，或在某些浏览器中保存时显示堆栈错误，因此请考虑为您的用例选择合适的比率。

#### `previewPixelRatio`

<u>类型：</u> `number`

<u>支持版本：</u> +v4.0.0

<u>默认值：</u> `window.devicePixelRatio`

在执行操作时预览图像使用的像素比率（比率越高，插件中绘制/预览的图像分辨率越高，直到达到图像可能的最大分辨率，绘制图像的处理时间和更多内存使用也越高）。

> 高像素比率可能导致某些设备在绘制/预览和执行操作时崩溃/变慢，因此请考虑为您的用例选择合适的比率。

#### `moreSaveOptions`

<u>类型：</u> `对象数组`

<u>支持版本：</u> +v4.0.0

<u>默认值：</u> `[]`

用于如果您想向用户显示更多保存选项，除了当前保存按钮之外，作为通过保存按钮旁边的箭头打开的覆盖菜单。

如果提供 `[]` 或保留默认值，则打开菜单的箭头按钮将被隐藏，否则它将显示。

要提供的选项对象，

| 属性          | 类型                                                | 默认值（可能的值） | 描述                                                         |
| ------------- | --------------------------------------------------- | ------------------ | ------------------------------------------------------------ |
| **`label`**   | string **_必需_**                                   | ''                 | 将向用户显示的选项标签                                       |
| **`onClick`** | function (triggerSaveModal, triggerSave) **_必需_** | `undefined`        | 点击选项时将触发的函数，它接收 2 个参数，第一个是调用保存模态框的函数，第二个是直接调用保存的函数，这两个函数都接受（1 个参数作为回调函数，该函数与保存过程后调用的 [`onSave 函数`](#onsave) 相同） |
| **`icon`**    | HTML 元素 \| string \| React 函数组件               | `null`             | 将显示在标签前的选项图标                                     |

> 注意：在使用传递给选项 onClick 函数的任何函数时，您必须提供一个 [`onSave`](#onsave) 回调函数。
> 示例，

```js
[
  {
    label: '另存为新版本',
    onClick: (triggerSaveModal, triggerSave) =>
      triggerSaveModal((...args) => {
        console.log('已保存', args);
      }), // 需要传递回调函数
    icon: '<svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">...</svg>', // 字符串形式的 HTML 元素
  },
  {
    label: '另存为新文件',
    onClick: (triggerSaveModal, triggerSave) =>
      triggerSave((...args) => {
        console.log('已保存', args);
      }), // 需要传递回调函数
    icon: () => (
      <svg
        width="14"
        height="14"
        viewBox="0 0 14 14"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        ...
      </svg>
    ), // React 函数组件
  },
];
```

#### `observePluginContainerSize`

<u>类型：</u> `boolean`

<u>支持版本：</u> +v4.0.0

<u>默认值：</u> `false`

默认情况下，插件的根 HTML 元素通过 CSS 设置为 `100%` 的 `height` 和 `width`，以尊重插件的容器 HTML 元素大小，如果为此属性提供 `true`，则该根元素将始终通过 JS 观察器而不是 CSS 成为插件容器 HTML 元素的相同绝对 `width` 和 `height` 值。

> 注意：此属性在某些情况下可能有用（其中之一是如果您将容器元素的高度保留为 `auto` 或未设置），在这些情况下，根元素将通过 JS 成为容器当前大小的相同值。

#### `showCanvasOnly`

<u>类型：</u> `boolean`

<u>支持版本：</u> +v4.0.0

<u>默认值：</u> `false`

如果为 `true`，则隐藏插件的所有 UI，包括（保存和关闭按钮、标签页和工具条等），仅显示画布，否则将正常显示整个 UI。

> 此属性可能有用，如果您在同一项目中以不同方式使用编辑器，（例如，使用编辑器进行快速照片编辑的不同转换，以及在上传一些个人资料照片后使用编辑器仅裁剪照片并忽略其他转换）。

#### `getCurrentImgDataFnRef`

<u>类型：</u> `React Ref | Object`

<u>支持版本：</u> +v4.0.0

<u>默认值：</u> undefined

如果提供，画布处理/保存/操作函数将被分配为 `.current` 属性给这个传递的 `Object | React Ref`，以便在默认保存按钮之外的其他地方使用/调用，并返回最终的转换后的图像数据对象和当前设计状态，这些参数与 [`onSave 回调`](#onsave) 中的参数相同，

传递的对象/ref 在内部分配后具有以下语法

```js
{
  current: (
    imageFileInfo = {},
    pixelRatio = false,
    keepLoadingSpinnerShown = false,
  ) => ({
    imageData, // 一个包含当前图像数据和信息的对象
    designState, // 一个包含图像编辑器当前设计状态的对象
    hideLoadingSpinner, // 一个函数，在调用时隐藏加载旋转器（如果尚未隐藏）（在您提供了 `keepLoadingSpinnerShown` 参数为 `true` 并希望在从您那边完成某些操作后隐藏旋转器时很有用）
  });
}
```

该函数具有以下参数：

-   _`imageFIleInfo`_: 一个对象，定义保存时要考虑的文件信息，并包含以下属性：
    ```js
    {
      name,
      extension,
      quality, // 仅应用于 JPEG/JPG/WEBP 格式
      size: { // 用于调整大小
        width, height
      },
    }
    ```
-   _`pixelRatio`_: 一个 `number`，定义在转换/保存图像时使用的像素比率（比率越高，保存的图像分辨率越高，直到达到图像可能的最大分辨率，使用的内存和转换/保存的处理时间也越高）。

> 注意：调用分配的函数将阻塞 UI，因此请注意您在何处以及何时调用该函数。

#### `updateStateFnRef`

<u>类型：</u> `React Ref | Object`

<u>支持版本：</u> +v4.0.0

<u>默认值：</u> undefined

将插件的更新状态主函数分配给传递的对象/ref 的 `.current` 属性，用于更改应用程序的主状态，该函数有 1 个参数，可以是（`function | object`），该函数接收当前状态对象作为参数。对象是新状态部分，在两种类型中，都不需要返回/传递整个状态对象，因为它会与当前状态深度合并。

> 注意：使用此函数时请注意，因为它可能导致意外行为，我们不建议使用它，除非您知道自己在做什么。

#### `useZoomPresetsMenu`

<u>类型：</u> `Boolean`

<u>支持版本：</u> +v4.1.0

<u>默认值：</u> true

在点击缩放百分比并且此属性设置为 `true` 时，将向用户显示一些缩放预设百分比，以便快速选择某些缩放百分比，如果设置为 `false`，则不会显示缩放预设，并且仅使用 `fit percentage` 作为默认值。

注意：如果 [`disableZooming`](#disablezooming) 属性为 `true`，则此属性将不起任何作用。

#### `disableZooming`

<u>类型：</u> `Boolean`

<u>支持版本：</u> +v4.2.0

<u>默认值：</u> false

如果为 `true`，插件中将没有缩放功能可用，并且与缩放相关的 UI 将被移除。

#### `noCrossOrigin`

<u>类型：</u> `Boolean`

<u>支持版本：</u> +v4.5.0

<u>默认值：</u> false

如果为 `true`，`crossOrigin=Anonymous` 属性及其值将不会用于原始图像（要编辑的图像）加载请求 -- 不推荐 --。

> 禁用 crossOrigin 的使用可能会导致应用过滤器或保存图像时出现一些问题，因此除非您知道自己在做什么，否则不建议将其设置为 `true`。

> 如果您在基于 Chromium 的浏览器上遇到 CORS 的奇怪行为，请查看此问题 [#319](https://github.com/scaleflex/filerobot-image-editor/issues/319) 可能对您有用。

#### `disableSaveIfNoChanges`

<u>类型：</u> `Boolean`

<u>支持版本：</u> +v4.6.0

<u>默认值：</u> false

如果为 `true`，保存按钮将被禁用，直到用户对图像进行更改，否则在加载编辑器时没有任何用户功能，它将被禁用，用户将无法保存。

> 禁用 crossOrigin 的使用可能会导致应用过滤器或保存图像时出现一些问题，因此除非您知道自己在做什么，否则不建议将其设置为 `true`。

> 如果您在基于 Chromium 的浏览器上遇到 CORS 的奇怪行为，请查看此问题 [#319](https://github.com/scaleflex/filerobot-image-editor/issues/319) 可能对您有用。

#### `removeSaveButton`

<u>类型：</u> `Boolean`

<u>支持版本：</u> +v4.7.1

<u>默认值：</u> false

如果为 `true`，保存按钮将从编辑器中移除。

#### `resetOnImageSourceChange`

<u>类型：</u> `Boolean`

<u>支持版本：</u> +v4.8.0

<u>默认值：</u> false

如果为 `true`，编辑器将在提供新的原始图像 [source](#source) 时重置其设计状态和保存的数据。

#### `backgroundColor`

<u>类型：</u> `String`

<u>支持版本：</u> +vx.x.x

<u>默认值：</u> undefined

在编辑图像时用作画布背景的颜色，并且不会在最终保存的图像中考虑。

#### `backgroundImage`

<u>类型：</u> `HTMLImageElement`

<u>支持版本：</u> +vx.x.x

<u>默认值：</u> undefined

将显示为画布背景图像的图像，它将重复（x 和 y 方向），并且在保存时将被忽略。

> 注意：如果同时提供了 `backgroundImage` 和 `backgroundColor`，则优先级将给予 `backgroundColor`。

### 回调函数

#### `onBeforeSave`

<u>类型：</u> `function(imageFileInfo) {}`

<u>支持版本：</u> +v4.0.0

<u>默认值：</u> `undefined`

此函数将在用户点击保存按钮后、触发默认保存行为之前触发...

> 如果函数返回 `false`，则插件中实现的默认保存行为将不会被触发。

> 此函数在 ([`cloudimage 模式`](#usecloudimage) 和 [`moreSaveOptions`](#moresaveoptions)) 中不起作用，并且直接触发 [`onSave`](#onsave)。

#### `onSave`

<u>类型：</u> `function(imageData, imageDesignState) {}`

<u>支持版本：</u> +v4.0.0

<u>默认值：</u> `undefined`

它用于处理保存功能，当用户点击保存模态框的保存按钮时触发，或者如果通过 [`onBeforeSave`](#onbeforesave) 函数阻止了默认行为，则在点击保存按钮时触发。如果您需要保持显示加载旋转器（在开始保存时显示）直到您完成项目那边的某些功能/操作（例如，异步将文件上传到您的服务器），那么您必须返回一个 `Promise`，否则返回空/void 也可以。

> 在 `imageData` 参数中，您有 2 种格式的保存图像（Base64 字符串和 Canvas HTML 元素），Canvas HTML 元素格式不支持在默认行为中保存时选择的质量。

#### `onModify`

<u>类型：</u> `function(currentImageDesignState)`

<u>支持版本：</u> +v4.0.0

<u>默认值：</u> `undefined`

在任何操作/转换应用于图像后调用（例如，添加/更改过滤器、调整图像大小等）。

-   _`currentImageDesignState`_: 一个包含插件当前状态的最新设计状态的对象。

> 注意：此回调可能在更改与同一操作/功能相关的某些属性时多次触发，因此请确保您检查了它何时被调用以了解您将具有的行为。

#### `onClose`

<u>类型：</u> `function(closingReason, haveNotSavedChanges) {}`

<u>支持版本：</u> +v4.0.0

<u>默认值：</u> `undefined`

当用户点击关闭/取消按钮或返回按钮时触发，如果未提供，则关闭按钮根本不会显示。

-   _`closingReason`_: 一个字符串值，显示插件关闭的地点/原因。
-   _`haveNotSavedChanges`_: 一个布尔值，true 表示用户在保存最新更改之前点击了关闭按钮，否则他在保存后关闭。

<hr />

## 桥接

-   [Vanilla JS <s>**_(已完成)_**</s>](#vanilla-javascript)
-   [React <s>**_(已完成)_**</s>](#react-component)
-   Angular (暂无预计时间)
-   Vue (暂无预计时间)
-   React-native (暂无预计时间)
-   Flutter (暂无预计时间)

> 注意：目前桥接的附加文档在当前页面提供，但在有更多桥接时，文档将移动到单独的文件。

<hr />

## 桥接文档

### Vanilla Javascript

除了上面提到的适用于所有桥接的主配置外，以下方法特定于此桥接：

#### `render`

<u>类型：</u> `function render (additionalConfig)`

<u>支持版本：</u> +v4.0.0

初始化/重新渲染插件，并有可能向先前提供给同一插件实例的属性提供额外的配置属性。

#### `terminate`

<u>类型：</u> `function terminate ()`

<u>支持版本：</u> +v4.0.0

从页面卸载插件的容器以将其移除。

#### `getCurrentImgData`

<u>类型：</u> `function getCurrentImgData (imageFileInfo, pixelRatio, keepLoadingSpinnerShown)`

<u>支持版本：</u> +v4.0.0

调用此函数将触发负责处理/操作当前图像操作的函数，并拥有当前图像数据的可能最终结果以及当前设计状态，它是这里提到的 [`getCurrentImgDataFnRef`](#getcurrentimgdatafnref) 函数的桥接。
