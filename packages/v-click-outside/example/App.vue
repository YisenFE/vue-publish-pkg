<template>
    <div id="app">
        <button v-click-outside="clickOutside" @click="onClick">{{ msg }}</button>
    </div>
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


<style lang="scss">
#app {
    //
}
</style>
