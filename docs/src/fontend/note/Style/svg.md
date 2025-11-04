在vue3+vite+ts项目中使用

需要安装两个包，一个是vite-plugin-svg-icons，一个是fast-glob，fast-glob 是一个高性能的文件路径匹配库，它可以根据指定的 glob 模式（一种用于匹配文件路径的模式）快速查找文件系统中的文件。

```bash
npm install vite-plugin-svg-icons -D
npm install fast-glob -D
```

在 `vite.config.ts`  中配置

```tsx
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    createSvgIconsPlugin({  // [!code highlight:4]
      iconDirs: [path.resolve(path.resolve(__dirname, 'src'), 'assets/icons')],
      symbolId: 'icon-[dir]-[name]',
    }),
  ],
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: '@use "@/styles/xStyle/global.scss" as global;',
      },
    },
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})

```

这里是 svg 的路径，通常放在 `src/assets/icons/xxxxxxx`

```ts
[path.resolve(path.resolve(__dirname, 'src'), 'assets/icons')]
```

接下来创建一个专门显示 svg 的组件：

```vue
<template>
  <svg
    aria-hidden="true"
    class="svg-icon"
    :style="'width:' + size + ';height:' + size"
    :color="color"
  >
    <use
      :xlink:href="symbolId"
      :color="color"
    />
  </svg>
</template>

<script setup lang="ts">
import { computed } from 'vue'
const props = defineProps({
  prefix: {
    type: String,
    default: 'icon',
  },
  iconClass: {
    type: String,
    required: false,
    default: '',
  },
  color: {
    type: String,
    default: '',
  },
  size: {
    type: String,
    default: '1em',
  },
})

const symbolId = computed(() => `#${props.prefix}-${props.iconClass}`)
</script>

<style>
.svg-icon {
  display: inline-block;
  width: 2em;
  height: 2em;
  overflow: hidden;
  vertical-align: -0.15em;
  outline: none;
  fill: currentColor;
}

path {
  fill: currentColor;
}
</style>
```

之后在 `main.ts` 中添加

```ts
import "virtual:svg-icons-register";
import SvgIcon from './components/SvgIcon/Index.vue'; 

const app = createApp(App);
app.component('svg-icon', SvgIcon);
```

如果有标红报错，则需要添加类型声明

`tsconfig.json` 中

```json
{
  "include": ["src/**/*.ts","src/typings/**/*.d.ts", "src/**/*.tsx", "src/**/*.vue"]
}
```

创建  `src/typings/vite-env.d.ts` 内容如下：

```ts
/// <reference types="vite/client" />

declare module 'virtual:svg-icons-register' {
    const content: string;
    export default content;
  }
  
declare module 'virtual:*' {
  const content: string;
  export default content;
}
```

使用时：
```vue
<SvgIcon
         v-if="value.icon"
         :icon-class="[dir name]-[file name]"
         :size="16"
         :color="#b4b47b"
         />
```



