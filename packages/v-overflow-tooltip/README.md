# @ysv/v-overflow-tooltip(目前仅提供内测版本)

当目标元素内容超出元素后，鼠标hover显示tooltip展示元素全部内容

目标元素必须添加`el-tooltip`类名，否则自定义指令不生效

## Install

```bash
$ yarn add @ysv/v-overflow-tooltip@alpha
```

## Usage

### 引入方式

插件：

```js
import Vue from 'vue';
import PluginOverflowTooltip from '@ysv/v-overflow-tooltip';
Vue.use(PluginOverflowTooltip);
```

你也可以自定义指令名称：

```js
import Vue from 'vue';
import {OverflowTooltip} from '@ysv/v-overflow-tooltip';
Vue.directive('overflow-tooltip', OverflowTooltip);
```

### 使用demo

```vue
<template>
    <div v-overflow-tooltip class="el-tooltip">
        我超出了，我要隐藏了
    </div>
</template>
<style lang="scss" scoped>
.el-tooltip {
    display: inline-block;
    max-width: 80px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}
</style>
```

### 自定义的样式

```js
import Vue from 'vue';
import PluginOverflowTooltip from '@ysv/v-overflow-tooltip/dist/index.js';
Vue.use(PluginOverflowTooltip);
```

然后为`ys-overflow-tooltip`类名自定义样式

### 自定义属性

语法：`v-overflow-tooltip="{...}"`

对象内部属性参考：https://element.eleme.cn/#/zh-CN/component/tooltip#attributes
```vue
<template>
    <div v-overflow-tooltip="{popperClass: 'custom-class'}" class="el-tooltip">
        我超出了，我要隐藏了
    </div>
</template>
<style lang="scss" scoped>
.el-tooltip {
    display: inline-block;
    max-width: 80px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}
</style>
```
