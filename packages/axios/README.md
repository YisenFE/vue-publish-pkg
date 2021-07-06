# @ysv/axios(目前仅提供内测版本)

基于axios二次封装

## Install

```bash
$ yarn add @ysv/axios@alpha
```

## Usage

main.js:

```js
import Vue from 'vue';
import { request } from '@ysv/axios';
Vue.prototype.$axios = request;
```

## Custom

使用[tapable](https://github.com/webpack/tapable)为各请求阶段添加勾子

```js
import Vue from 'vue';
import { baseRequest } from '@ysv/axios';

baseRequest.hooks..beforeRequesttap('请求之前', (config) => {
    // ...
    return config;
});

baseRequest.hooks.responseImmediate.tap('请求返回后不管成功与否立即触发', (config) => {
    // ...
});

baseRequest.hooks.responseSuccess.tapPromise('请求返回成功', (res) => {
    // ...
    return res;
});

baseRequest.hooks.responseFail.tap('捕获Promise失败态', (config) => {
    // ...
    return res;
});

Vue.prototype.$axios = baseRequest.request;
```



