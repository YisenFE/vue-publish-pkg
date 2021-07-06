# @ysv/v-click-outside(目前仅提供内测版本)

当目标元素以外的东西被点击时，v-click-outside 指令会调用指定的函数。

## Install

```bash
$ yarn add @ysv/v-click-outside@alpha
```

## Usage

### 引入方式

插件：

```js
import Vue from 'vue';
import PluginClickOutside from '@ysv/v-click-outside';
Vue.use(PluginClickOutside);
```

你也可以自定义指令名称：

```js
import Vue from 'vue';
import {ClickOutside} from '@ysv/v-click-outside';
Vue.directive('click-outside', ClickOutside);
```

### 使用demo

```vue
<template>
    <button v-click-outside="clickOutside" @click="onClick">{{ msg }}</button>
</template>
<script>
export default {
    data() {
        return {
            msg: '点我啊',
        };
    },
    methods: {
        clickOutside() {
            this.msg = '点我啊';
        },
        onClick() {
            this.msg = '点外面';
        },
    },
};
</script>
```
