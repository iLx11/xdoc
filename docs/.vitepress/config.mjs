import { defineConfig } from 'vitepress'
import { sidebarPathGen } from '../pathGen.mjs'
import { pagefindPlugin } from 'vitepress-plugin-pagefind'
// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: 'iLx1',
  description: 'note and article',
  srcDir: './src',
  assetsDir: 'static',
  base: '/xdoc/',
  themeConfig: {
    nav: [
      { text: 'Home', link: '/' },
      { text: '前端', link: '/fontend/' },
      { text: '嵌入式', link: '/hardware/' },
      { text: '后端', link: '/backend/' },
      { text: '其他', link: '/other/' },
    ],

    sidebar: {
      '/fontend/': [
        {
          text: '文章',
          collapsed: false,
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
    socialLinks: [{ icon: 'github', link: 'https://github.com/iLx11' }],
    footer: {
      message: 'Released under the GPL License.',
      copyright: 'Copyright © iLx1',
    },
  },
  markdown: {
    image: {
      // 默认禁用图片懒加载
      lazyLoading: true,
    },
  },
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

//default options
var options = {
  previewLength: 62,
  buttonLabel: 'Search',
  placeholder: 'Search docs',
  allow: [],
  ignore: [],
}
