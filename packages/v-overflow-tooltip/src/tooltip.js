{/* <template>
    <el-tooltip
        ref="tooltip"
        :popper-class="popperClass"
        :placement="placement"
        :effect="effect"
        :content="content"
    />
</template>
<script>
export default {
    name: 'table-tooltip',
    data() {
        return {
            popperClass: '', // 默认值
            placement: 'bottom',
            effect: 'light',
            content: '',
        };
    },
};
</script> */}

export default {
    name: 'OverflowTooltip',

    data() {
        return {
            popperClass: '', // 默认值
            placement: 'bottom',
            effect: 'light',
            content: '',
        };
    },

    render(h) {
        return h('el-tooltip', {
            props: {...this.$data},
            ref: 'tooltip',
        });
    },
};

