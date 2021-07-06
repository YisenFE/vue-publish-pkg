<template>
    <div class="send-request">
        <button @click="onSendRequest">点击发送普通请求</button>
    </div>
</template>

<script>
export default {
    name: 'SendRequest',

    methods: {
        onSendRequest() {
            const url = '/user/list';
            const params = {
                user: 123,
            };
            this.request(url, params).then(res => {
                console.log(res);
            });
        },
    },
};
</script>

<style lang="scss" scoped>

</style>
