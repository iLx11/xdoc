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

```
git add .
git commit -m "xxxx"
git push origin master
