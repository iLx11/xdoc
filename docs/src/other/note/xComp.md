<script setup>
// checkbox
import CheckboxMore from '../xComp/checkbox/CheckboxMore.vue'
import CheckboxMore1 from '../xComp/checkbox/CheckboxMore1.vue'
import CheckboxTool from '../xComp/checkbox/CheckboxTool.vue'
import CheckboxTool1 from '../xComp/checkbox/CheckboxTool1.vue'
// file
import FileSelector from '../xComp/file/FileSelector.vue'
// range
import RangeTool from '../xComp/range/RangeTool.vue'
import RangeTool1 from '../xComp/range/RangeTool1.vue'
import RangeTool2 from '../xComp/range/RangeTool2.vue'
// select
import SelectDropTool from '../xComp/select/SelectDropTool.vue'
// switch
import SwitchTool from '../xComp/switch/SwitchTool.vue' 
import SwitchTool1 from '../xComp/switch/SwitchTool1.vue' 
import SwitchTool2 from '../xComp/switch/SwitchTool2.vue' 
import { reactive } from 'vue'
const checkMoreData = reactive({
  // 数值
  list: [
    {
      item: '100',
      value: false,
    },
    {
      item: '100',
      value: false,
    },
    {
      item: '100',
      value: false,
    },
    {
      item: '100',
      value: false,
    }
  ],
  // 配置名
  text: 'text',
  // 配置描述
  desc: '-desc',
  // single: true,
  writable: true,
  reversible: true
})

const rangeData = reactive({
  // 数值
  value: 0,
  // 最大（范围）
  max: 100,
  // 最小（范围）
  min: 0,
  // 步进
  step: 5,
  // 配置名
  text: '',
  // 配置描述
  desc: '',
  // 刻度
  scale: 20,
})
const selectDropData = reactive({
  // 数值
  list: [
    {
      item: 'item',
      value: false,
    },
    {
      item: 'item',
      value: false,
    },
    {
      item: 'item',
      value: false,
    },
  ],
  // 配置名
  text: 'SelectDropTool',
  // 配置描述
  desc: 'SelectDropTool-desc',
})

const switchData = reactive(
  {
    value: false,
    text: '高速模式',
    desc: '响应更快，但是会增加功耗，减少使用时间',
  },
)

</script>

# Checkbox

::: details 展开配置与示例

### 普通组件

```vue
<script setup lang="ts">
import { reactive } from 'vue'
const checkboxData = reactive([
  {
    // 数值
    list: [
      {
        item: '1.0mm',
        value: false,
      },
      {
        item: '2.0mm',
        value: false,
      },
    ],
    // 配置名
    text: '鼠标 LOD 高度',
    // 配置描述
    desc: '鼠标离开桌面停止运动的距离，低：1mm，高：2mm',
    // 是否单选
    single: true,
  },
])

const checkboxPattern = reactive({
  // text 与 desc 底部间距
  textMargin: '20px',
  // 配置组件与其他组件底部间距
  boxMargin: '20px',
  // text 字体大小
  textFontSize: '1.5vw',
  // 组件 padding
  boxPadding: '0',
  // 子盒子间隔
  boxGap: '10px',
  // 标题内容布局 (start, center, end)
  textAlign: 'start',
  // 描述字符高度
  descLine: 1.2,
  // 描述底部间距
  descMargin: '20px',
  // 描述字体大小
  descFontSize: '1.2vw',
})

/********************************************************************************
 * @brief: 更新配置值
 * @param {*} newObj 更新的值
 * @param {*} config 配置值
 * @return {*}
 ********************************************************************************/
const valueUpdate = (newObj: Object, config: Object) => {
  Object.keys(config).forEach((key) => {
    if (key in newObj) {
      config[key] = newObj[key]
    }
  })
}
</script>
<template>
  <CheckboxTool
    :config="checkboxData"
    @update:config="valueUpdate($event, checkboxData)"
  />
</template>
```

### 功能组件

```vue
<script setup lang="ts">
import { reactive } from 'vue'
const checkboxData = reactive([
  {
    // 数值
    list: [
      {
        item: '1.0mm',
        value: false,
      },
      {
        item: '2.0mm',
        value: false,
      },
    ],
    // 配置名
    text: '鼠标 LOD 高度',
    // 配置描述
    desc: '鼠标离开桌面停止运动的距离，低：1mm，高：2mm',
    // 是否单选
    single: true,
    // 是否可编辑
    writable: false,
  },
])

const checkboxPattern = reactive({
  // text 与 desc 底部间距
  textMargin: '20px',
  // 配置组件与其他组件底部间距
  boxMargin: '20px',
  // text 字体大小
  textFontSize: '1.5vw',
  // 组件 padding
  boxPadding: '0',
  // 子盒子间隔
  boxGap: '10px',
  // 标题内容布局 (start, center, end)
  textAlign: 'start',
  // 描述字符高度
  descLine: 1.2,
  // 描述底部间距
  descMargin: '20px',
  // 描述字体大小
  descFontSize: '1.2vw',
})

/********************************************************************************
 * @brief: 更新配置值
 * @param {*} newObj 更新的值
 * @param {*} config 配置值
 * @return {*}
 ********************************************************************************/
const valueUpdate = (newObj: Object, config: Object) => {
  Object.keys(config).forEach((key) => {
    if (key in newObj) {
      config[key] = newObj[key]
    }
  })
}
</script>
<template>
  <CheckboxTool
    :config="checkboxData"
    @update:config="valueUpdate($event, checkboxData)"
  />
</template>
```

:::

<br />
<CheckboxMore
:config="Object.assign({}, checkMoreData, {
  text: 'CheckboxMore',
  desc: 'CheckboxMore-desc',
  single: true,
})"
/>

<br />
<CheckboxMore1
:config="Object.assign({}, checkMoreData, {
  text: 'CheckboxMore1',
  desc: 'CheckboxMore1-desc',
  single: true,
})"
/>

<br />
<CheckboxTool
:config="Object.assign({}, checkMoreData, {
  text: 'CheckboxTool',
  desc: 'CheckboxTool-desc',
  single: true,
})"
/>
<br />
<CheckboxTool1
:config="Object.assign({}, checkMoreData, {
  text: 'CheckboxTool1',
  desc: 'CheckboxTool1-desc',
  single: true,
})"
/>



# file
<br />
<FileSelector
  :config="Object.assign({}, {
  text: 'FileSelector',
  value: '',
  disable: false,
})"
/>
<br />

# range

::: details 展开配置与示例

### 普通组件

```vue
<script setup lang="ts">
import { reactive } from 'vue'
const rangeData = reactive({
  // 数值
  value: 0,
  // 最大（范围）
  max: 100,
  // 最小（范围）
  min: 0,
  // 步进
  step: 10,
  // 配置名
  text: 'text',
  // 配置描述
  desc: 'desc',
})

const rangePattern = reactive(
	{
        // 移动快左位移
    	moveLeft: '0%',
        // text 字体大小
        textFontSize: '1.5vw',
        // 组件 padding
        boxPadding: '0',
        // 子盒子间隔
        boxGap: '10px',
        // 标题内容布局 (start, center, end)
        textAlign: 'start',
        // 描述字符高度
        descLine: 1.2,
        // 描述底部间距
        descMargin: '20px',
        // 描述字体大小
        descFontSize: '1.2vw',
    }
)
</script>
<template>
    <RangeTool
        :config="rangeData"
        @update:config="valueUpdate($event, rangeData)"/>
</template>
```

### 刻度 range

```vue
<script setup lang="ts">
import { reactive } from 'vue'
const rangeData = reactive({
  // 数值
  value: 0,
  // 最大（范围）
  max: 100,
  // 最小（范围）
  min: 0,
  // 步进
  step: 10,
  // 配置名
  text: 'text',
  // 配置描述
  desc: 'desc',
  // 刻度
  scale: 10
})

const rangePattern = reactive(
	{
        // 移动快左位移
    	moveLeft: '0%',
        // text 字体大小
        textFontSize: '1.5vw',
        // 组件 padding
        boxPadding: '0',
        // 子盒子间隔
        boxGap: '10px',
        // 标题内容布局 (start, center, end)
        textAlign: 'start',
        // 描述字符高度
        descLine: 1.2,
        // 描述底部间距
        descMargin: '20px',
        // 描述字体大小
        descFontSize: '1.2vw',
    }
)
</script>
<template>
    <RangeTool
        :config="rangeData"
        @update:config="valueUpdate($event, rangeData)"/>
</template>
```
:::

<br />

<RangeTool 
  :config="Object.assign({},rangeData, {
    text: 'RangeTool',
    // 配置描述
    desc: 'RangeTool-desc',
  })"
/>
<br />
<RangeTool2
  :config="Object.assign({},rangeData, {
    text: 'RangeTool2',
    // 配置描述
    desc: 'RangeTool2-desc',
  })"
/>
<br />

# select

::: details 展开配置与示例

## drop down

### 父组件

```vue
<script setup lang="ts">
import { reactive } from 'vue'
const selectDropData = reactive({
  // 数值
  list: [
    {
      item: 'item',
      value: false,
    },
  ],
  // 配置名
  text: 'text',
  // 配置描述
  desc: 'desc',
})

const selectPattern = reactive(
	{
        // text 与 desc 底部间距
    	textMargin: '20px',
        // 配置组件与其他组件底部间距
  		boxMargin: '20px',
    }
)
</script>
<template>
    <SelectDropTool
       v-model:config="selectDropData" 
       :pattern="selectPattern"
    />
</template>
```

:::

<br />

<SelectDropTool
  :config="selectDropData"
/>
<br />

# switch

::: details 展开配置与示例

### 父组件

```vue
<script setup lang="ts">
import { reactive } from 'vue'
const switchData = reactive(
	{
        // 数值
        value: false,
        // 配置名
        text: 'text',
        // 配置描述
        desc: 'desc',
	}
)

const switchPattern = reactive(
	{
        // text 与 desc 底部间距
    	textMargin: '20px',
        // 配置组件与其他组件底部间距
  		boxMargin: '20px',
    }
)
</script>
<template>
    <SwitchTool
       v-model:config="switchData" 
       :pattern="switchPattern"
    />
</template>
```

:::

<SwitchTool 
  :config="Object.assign({}, switchData, {
    text: 'SwitchTool',
    // 配置描述
    desc: 'SwitchTool-desc',
  })" 
/>
<br />
<SwitchTool1
  :config="Object.assign({}, switchData, {
    text: 'SwitchTool1',
    // 配置描述
    desc: 'SwitchTool1-desc',
  })" 
/>
<br />
<SwitchTool2 
  :config="Object.assign({}, switchData, {
    text: 'SwitchTool2',
    // 配置描述
    desc: 'SwitchTool2-desc',
  })" 
/>
<br />