# vue-publish-pkg

> 此项目参考vue-next架构

用于发布vue相关的npm包

## 组件包目录
```sh
packages
  └── xxx
      ├── README.md
      ├── index.js # 组件包入口
      ├── package.json
      └── src # 组件包核心
      │   ├── ...
      │   └── index.[tj]s # 暴露组件包核心逻辑
      └── example # 用于本地开发调试组件包，可有可无
          ├── ...
          ├── App.vue # vue根组件
          └── main.js # vue项目入口文件
```

### 内置公共依赖包

在开发组件包时，`package.json` 的 `dependencies` 中不需要定义以下公共依赖：
- `vue@2.6.11`
- `element-ui@2.12.0`

> **内置公共依赖包**指的是你的项目基于`vue@2.6.11`、`element-ui@2.12.0`开发，所以在开发npm包给你的项目使用时不需要在npm包中定义`dependencies`依赖
>
> 当然，如果要提供给其他可能不是这些前置依赖的项目，你需要在`dependencies`声明，并且打包时指定排除这些依赖

## 开始

此项目使用 node 12+ 版本、 [yarn workspaces](https://classic.yarnpkg.com/blog/2017/08/02/introducing-workspaces/)。

满足上述配置要求后，克隆此代码库并运行 `yarn install`。

```sh
git clone git@github.com:YisenFE/vue-publish-pkg.git
cd vue-publish-pkg
yarn install
yarn build

# 然后
code .
# 现在你可以启动网站了
yarn serve
```

## 开发示例

在 `packages` 目录下新建目录 `pkg-demo`
```sh
cd packages
mkdir pkg-demo
```

### 1.初始化npm包

```sh
cd pkg-demo
yarn init -y
```

假如pkg-demo依赖`vue@2.6.11`、`element-ui@2.12.0`、`axios@^0.19.0`

由于vue、element-ui已是公共依赖，所以不需要安装

<a href="#内置公共依赖包">查看公共依赖</a>

```sh
yarn add axios@^0.19.0
```

现在，我们将创建以下目录结构、文件和内容：

**project**

```sh
pkg-demo
    ├── README.md
    ├── index.js
    ├── package.json
    └── src
    │   ├── main.vue
    │   └── index.js
    └── example
        ├── App.vue
        └── main.js
```

**package.json**

```json
{
  "name": "pkg-demo",
  "version": "1.0.0",
  "main": "index.js",
  "license": "MIT",
  "buildOptions": {
    "externals": {
      "axios": {
        "root": "axios",
        "commonjs": "axios",
        "commonjs2": "axios",
        "amd": "axios"
      },
      "vue": {
        "root": "Vue",
        "commonjs": "vue",
        "commonjs2": "vue",
        "amd": "vue"
      },
      "element-ui": {
        "root": "ELEMENT",
        "commonjs": "ELEMENT",
        "commonjs2": "ELEMENT",
        "amd": "ELEMENT"
      }
    }
  },
  "dependencies": {
    "axios": "^0.19.0"
  }
}
```

**src/main.vue**

```vue
<template>
    <el-input v-model="value"></el-input>
</template>
<script>
export default {
    name: 'PkgDemo',
    data() {
        return {
            value: ''
        };
    },
};
</script>
<style lang="scss" scoped>
.el-input {
    background: red;
}
</style>
```

**src/index.js**

```js
import PkgDemo from './main';
PkgDemo.install = function (Vue) {
    Vue.component('pkg-demo', PkgDemo);
};
export default PkgDemo;
```

**index.js**

只能使用commonjs，require的模块为打包后dist下的文件

```js
'use strict';
require('./dist/index.css');
module.exports = require('./dist/index.js');
```

**example/App.vue**

```vue
<template>
    <div id="app">
        <pkg-demo/>
    </div>
</template>
```

**example/main.js**

```js
import Vue from 'vue';
import ElementUI from 'element-ui';
import App from './App.vue';
import axios from 'axios';
/**
 * 引入编译后的包：
 * 执行 yarn build --includes pkg-demo
 * 下面语句替换为：import PkgDemo from '../index';
 */
import PkgDemo from '../src/index';


import 'element-ui/lib/theme-chalk/index.css';
Vue.config.productionTip = false;
Vue.use(ElementUI).use(PkgDemo);
Vue.prototype.request = axios;
new Vue({
    render: h => h(App),
}).$mount('#app');
```

**启动本地开发服务**

进入项目根目录

```sh
yarn install
yarn serve
```

### 2.提交代码

commit message 提交需要符合Angular提交规范，若不清楚则使用`yarn commit` 来代替 `git commit` 命令。
```sh
git stash
git pull --rebase
git stash pop
git add .
yarn commit
# 按照提示操作完成后,push代码
git push
```

### 3.发包

使用`yarn release --dry`查看release脚本发包流程
查看更多使用参数 `yarn release --help`

[NPM package 版本管理最佳实践](https://github.com/canvasT/blog/issues/2)

代码提交完成并合入后
发布内部测试alpha包
```sh
# 执行release时，一定要保证工作区干净，本地无任何改动
git pull --rebase

# 登录npm帐号
yarn npm login
# 确保已经登录
yarn npm whoami

# release脚本自动发包，提交代码
yarn release --targetVersion 0.0.0-alpha.0 --tag alpha
# 然后复制评审链接，评审合入仓库
```
内测完成，发布公测beta包
```sh
# 执行release时，一定要保证工作区干净，本地无任何改动
git pull --rebase
# release脚本自动发包，提交代码
yarn release --targetVersion 0.0.0-beta.0 --tag beta
# 然后复制评审链接，评审合入仓库
```
公测完成，发布预发rc包
```sh
# 执行release时，一定要保证工作区干净，本地无任何改动
git pull --rebase
# release脚本自动发包，提交代码
yarn release --targetVersion 0.0.0-rc.0 --tag rc
# 然后复制评审链接，评审合入仓库
```
预发测试完成，发布正式稳定版本
```sh
# 执行release时，一定要保证工作区干净，本地无任何改动
git pull --rebase
# release脚本自动发包，提交代码
yarn release --targetVersion 0.0.1
# 然后复制评审链接，评审合入仓库
```

### bugfix

如alpha有bug(当前版本0.0.0-beta.0)
1. 修改bug，提交代码并合入仓库
2. 保证本地仓库和远程仓库版本一致，且工作区干净
3. `git pull --rebase`
4. 执行`yarn release --tag alpha`
5. 选择`prerelease`项
6. 按提示操作
7. 复制评审链接，评审合入仓库
