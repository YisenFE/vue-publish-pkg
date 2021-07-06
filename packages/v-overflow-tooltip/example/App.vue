<template>
    <div id="app">
        <div v-overflow-tooltip class="el-tooltip">
            我超出了，我要隐藏了
        </div>
        <div v-overflow-tooltip="{popperClass: 'custom-class'}" class="el-tooltip">
            我超出了，我要隐藏了123
        </div>
    </div>
</template>

<style lang="scss" scoped>
div {
    margin: 30px;
}
#app {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    transform: scale(2);
}
.el-tooltip {
    display: inline-block;
    max-width: 80px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}
</style>

<style lang="scss">
.ys-overflow-tooltip.custom-class {
    color: red;
}
</style>
