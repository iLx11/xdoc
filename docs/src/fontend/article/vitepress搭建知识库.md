## 搭建环境

### Git

我在<其他>板块写了关于 Git 使用的教程

### nodejs

下载并安装

https://nodejs.org/zh-cn/download/prebuilt-installer

### pnpm

cmd 运行

```sh
npm install -g pnpm
```

### 获取文件资源

访问 github 下载我配置好的所有文件

https://github.com/iLx11/xdoc

可以使用 git clone

```sh
git clone https://github.com/iLx11/xdoc.git
```

或者直接下载压缩包



## 使用流程

在项目文件夹打开 cmd

输入命令下载所有的依赖

```bash
pnpm i
```

#### 下载完成没有错误之后，开始运行在本地看一下效果

```bash
pnpm docs:dev
```

用浏览器打开生成的网址（示例端口不一定正确）

```bash
http://localhost:5173/xdoc/
```

就可以看到显示的效果了

#### 如果要打包成静态文件可以运行

```bash
pnpm docs:build
```

#### 如果要预览打包后的效果可以运行

```bash
pnpm docs:preview
```



## 配置解释

`docs`  目录为 `vitepress`  的根目录，写的笔记和文章都在这里，我配置了路径，所以文档全部在 `docs/src` 目录下，之后的文档都放在这个目录

`.vitepress` 目录下有配置文件，路径是 `docs/.vitepress/config.mjs` 

下面大概介绍一下我的配置，里面的配置比较简单直观，有不懂的可以参考一下官网配置参考：

https://vitepress.dev/zh/reference/site-config

```js
export default defineConfig({
  // 知识库标题
  title: 'iLx1',
  // 知识库描述  
  description: 'note and article',
  // 文档源目录
  srcDir: './src',
  // 资源文件夹
  assetsDir: 'static',
  // 这个是 github 上自动部署需要配置的，格式是 /<github 仓库名>/
  base: '/xdoc/',
  // 标题索引，文章不同标题的显示层级
  themeConfig: {
    outline: {
      level: [2, 4],
      label: '标题索引'
    },
    // 这个是知识库头部区域的导航
    nav: [
      // 这几项配置文本和点击后显示的文档链接
      { text: 'Home', link: '/' },
      { text: '前端', link: '/fontend/' },
      { text: '嵌入式', link: '/hardware/' },
      { text: '后端', link: '/backend/' },
      { text: '其他', link: '/other/' },
    ],
		// 不同目录下显示的侧边栏，可以配置每个不同的路径显示不同
    sidebar: {
      // 表示带有 'fontend' 的路径
      '/fontend/': [
        {
          // 多级侧边栏显示的分类标题
          text: '文章',
          // 是否折叠
          collapsed: false,
          // 多级侧边栏底下的层级，因为要自己添加文档的路径，
          // 所以我写了一个脚本来通过路径读取并生成
          items: sidebarPathGen('/fontend/article/'),
        },
        {
          text: '笔记',
          collapsed: false,
          items: sidebarPathGen('/fontend/note/'),
        },
      ],
      '/hardware/': [
        {
          text: '文章',
          collapsed: false,
          items: sidebarPathGen('/hardware/article/'),
        },
        {
          text: '笔记',
          collapsed: false,
          items: sidebarPathGen('/hardware/note/'),
        },
      ],
      '/backend/': [
        {
          text: '笔记',
          collapsed: false,
          items: sidebarPathGen('/backend/note/'),
        },
      ],
      '/other/': [
        {
          text: '笔记',
          collapsed: false,
          items: sidebarPathGen('/other/note/'),
        },
      ],
    },
    // 知识库页面最后的图标链接
    socialLinks: [{ icon: 'github', link: 'https://github.com/iLx11' }],
    // 页脚显示的版权信息
    footer: {
      message: 'Released under the GPL License.',
      copyright: 'Copyright © iLx1',
    },
  },
  // 图片懒加载配置
  markdown: {
    image: {
      // 默认禁用图片懒加载
      lazyLoading: true,
    },
  },
  // 搜索插件的配置
  vite: {
    plugins: [
      pagefindPlugin({
        btnPlaceholder: '搜索',
        placeholder: '搜索文档',
        emptyText: '空空如也',
        heading: '共: {{searchResult}} 条结果'
      }),
    ],
  },
})

```

**因为 vitepress 没办法自动生成目录，写在 src 的文章需要自己一个一个添加路径**

`.md` 格式的文件，写路径不用写文件后缀

### 配置示例

如果添加一个文章路径是 `src/fontend/article/Electron+vue` 

```json
sidebar: {
	'/fontend/': [
        {
          // 多级侧边栏显示的分类标题
          text: '文章',
          // 是否折叠
          collapsed: false,
          // 多级侧边栏底下的层级，因为要自己添加文档的路径，
          // 所以我写了一个脚本来通过路径读取并生成
          items: [
            {
              text: 'Electron+vue',
              // 路径从 src 下开始写，不用写 src
              link: 'fontend/article/Electron+vue'
          	},
            // 里面的文件需要一个个添加
            ...
          ],
        }
      ],
}
```

**但是我写了一个脚本，解决了这个问题，使用时候只需要调用函数，然后传入想要读取生成的路径**

可以根据自己的需要写不同的分类标题，然后传入路径，以`/<传入的路径>/` 为格式传入参数就好，记得引号包裹

```js
'/hardware/': [
  {
    text: '文章',
    collapsed: false,
    items: sidebarPathGen('/hardware/article/'),
  },
  {
    text: '笔记',
    collapsed: false,
    items: sidebarPathGen('/hardware/note/'),
  },
],
```

### 主页配置

路径 `src/index.md` 

这个就比较直观了，可以执行本地预览后直接修改配置看效果，因为是热更新的，只要文档有变化，预览的网站也会同步更新

```markdown
# https://vitepress.  /reference/default-theme-home-page
layout: home

hero:
  name: "xdoc"
  text: "note & article"
  tagline: 笔记 & 文章
  actions:
    - theme: brand
      text: 开始阅读
      // 文件夹路径，目录里需要包含一个 index.md 文件，但是不用写在路径里
      link: /fontend/
    - theme: alt
      text: 前端
      link: /fontend/
    - theme: alt
      text: 嵌入式
      link: /hardware/
    - theme: alt
      text: 后端
      link: /backend/
    - theme: alt
      text: 其他
      link: /other/

features:
  - title: 笔记
    details: 关于学习某一方面所记录的要点，防止忘记也能快速
  - title: 文章
    details: 关于一些配置与某种功能的实现步骤
  - title: 其他
    details: 有问题或是比较片面的地方还请担待了
```



## 配置到 github 并自动打包部署

打开文件路径 `xdoc/.github/workflows/deploy.yml` 这个是 github 的部署配置文件

根据自己 git 上传的配置修改分支就好，如果按我的配置则不用修改，为 `master` 分支

```yaml
  push:
    branches: [master]
```

在 github 上新建一个仓库

然后打开配置文件 `docs/.vitepress/config.mjs` 

配置这个为自己的仓库名

```json
// 这个是 github 上自动部署需要配置的，格式是 /<github 仓库名>/
base: '/xdoc/',
```

然后在 github 上配置 pages 功能

![image-20240827215001414](https://picr.oss-cn-qingdao.aliyuncs.com/img/image-20240827215001414.png)

最后写完文档就可以提交到 github 上了，只要有新的提交就会自动部署打包

只需要执行 git 的本地三部走 （已经添加了远程仓库，可以看我关于 git 的文章）

```bash
git add .
git commit -m "xxxx"
git push origin master
```



# 常用语法

## 目录表 (TOC)

**输入**

```md
[[toc]]
```

## 自定义容器

自定义容器可以通过它们的类型、标题和内容来定义。

### 默认标题

**输入

```md
::: info
This is an info box.
:::

::: tip
This is a tip.
:::

::: warning
This is a warning.
:::

::: danger
This is a dangerous warning.
:::

::: details
This is a details block.
:::
```

### 自定义标题

可以通过在容器的 "type" 之后附加文本来设置自定义标题。

````md
::: danger STOP
危险区域，请勿继续
:::

::: details 点我查看代码
```js
console.log('Hello, VitePress!')
```
:::
````

### raw

这是一个特殊的容器，可以用来防止与 VitePress 的样式和路由冲突。这在记录组件库时特别有用。可能还想查看 [whyframe](https://whyframe.dev/docs/integrations/vitepress) 以获得更好的隔离。

**语法**

md

```
::: raw
Wraps in a <div class="vp-raw">
:::
```

## 在代码块中实现行高亮

**输入**

~~~md
```js{4}
export default {
  data () {
    return {
      msg: 'Highlighted!'
    }
  }
}
```
~~~

除了单行之外，还可以指定多个单行、多行，或两者均指定：

- 多行：例如 `{5-8}`、`{3-10}`、`{10-17}`
- 多个单行：例如 `{4,7,9}`
- 多行与单行：例如 `{4,7-13,16,23-27,40}`

也可以使用 `// [!code highlight]` 注释实现行高亮。

此外，可以使用 `// [!code highlight:<lines>]` 定义要高亮的行数。

**输入**

````
```js
export default {
  data () {
    return {
      msg: 'Highlighted!' // [!code highlight]
    }
  }
}
```
````

## 代码块中聚焦

在某一行上添加 `// [!code focus]` 注释将聚焦它并模糊代码的其他部分。

此外，可以使用 `// [!code focus:<lines>]` 定义要聚焦的行数。

**输入**

````
```js
export default {
  data () {
    return {
      msg: 'Focused!' // [!code focus]
    }
  }
}
```
````

## 代码块中的颜色差异

在某一行添加 `// [!code --]` 或 `// [!code ++]` 注释将会为该行创建 diff，同时保留代码块的颜色。

**输入**

````
```js
export default {
  data () {
    return {
      msg: 'Removed' // [!code --]
      msg: 'Added' // [!code ++]
    }
  }
}
```
````

## 高亮“错误”和“警告”

在某一行添加 `// [!code warning]` 或 `// [!code error]` 注释将会为该行相应的着色。

**输入**

````
```js
export default {
  data () {
    return {
      msg: 'Error', // [!code error]
      msg: 'Warning' // [!code warning]
    }
  }
}
```
````

## 数学方程

现在这是可选的。要启用它，需要安装 `markdown-it-mathjax3`，在配置文件中设置`markdown.math` 为 `true`：

```sh
npm add -D markdown-it-mathjax3
```



```ts
// .vitepress/config.ts
export default {
  markdown: {
    math: true
  }
}
```

**输入**

```
When $a \ne 0$, there are two solutions to $(ax^2 + bx + c = 0)$ and they are
$$ x = {-b \pm \sqrt{b^2-4ac} \over 2a} $$

**Maxwell's equations:**

| equation                                                                                                                                                                  | description                                                                            |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------- |
| $\nabla \cdot \vec{\mathbf{B}}  = 0$                                                                                                                                      | divergence of $\vec{\mathbf{B}}$ is zero                                               |
| $\nabla \times \vec{\mathbf{E}}\, +\, \frac1c\, \frac{\partial\vec{\mathbf{B}}}{\partial t}  = \vec{\mathbf{0}}$                                                          | curl of $\vec{\mathbf{E}}$ is proportional to the rate of change of $\vec{\mathbf{B}}$ |
| $\nabla \times \vec{\mathbf{B}} -\, \frac1c\, \frac{\partial\vec{\mathbf{E}}}{\partial t} = \frac{4\pi}{c}\vec{\mathbf{j}}    \nabla \cdot \vec{\mathbf{E}} = 4 \pi \rho$ | _wha?_                                                                                 |
```

# vitepress github 自动打包上传子模块仓库

### 1. 确保子模块正确初始化

在你的 VitePress 项目中，如果使用了 Git 子模块，需要确保子模块正确初始化并更新：

bash复制

```bash
git submodule init
git submodule update
```

这会确保子模块的内容被正确拉取。

### 2. 配置 GitHub Actions

在 `.github/workflows` 目录下，创建或更新 `deploy.yml` 文件，以支持子模块的部署。以下是一个示例配置：

yaml复制

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches:
      - main  # 触发部署的分支

jobs:
  deploy:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout code with submodules
        uses: actions/checkout@v3
        with:
          submodules: recursive  # 确保子模块也被拉取 // [!code highlight]

      - name: Set up Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'  # 根据你的项目需求选择 Node.js 版本

      - name: Install dependencies
        run: npm install

      - name: Build project
        run: npm run build

      - name: Deploy to GitHub Pages
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
        run: |
          cd docs/.vitepress/dist
          git init
          git add .
          git commit -m "Deploy to GitHub Pages"
          git push -f https://${{ github.actor }}:${{ secrets.GITHUB_TOKEN }}@github.com/${{ github.repository }}.git gh-pages
```

这个配置文件会：

1. 检出代码并拉取子模块。
2. 安装依赖并构建项目。
3. 将构建后的静态文件推送到 `gh-pages` 分支。

### 3. 配置子模块路径

确保子模块的路径在你的 VitePress 配置中正确引用。例如，如果子模块包含主题或其他资源，确保路径正确

### 4. 推送代码到主分支

在本地开发完成后，将代码推送到主分支：

GitHub Actions 会自动触发并执行部署

### 注意事项

- 确保子模块的仓库是公开的，或者你有权限访问
- 如果子模块包含敏感信息，请确保它们不会被意外泄露
- 如果需要更复杂的部署逻辑（例如多环境部署），可以扩展 `deploy.yml` 文件
