import './index.scss';
import Vue from 'vue';

import {hasClass, getStyle} from './utils/dom';
import {debounce} from './utils/debounce';
import tooltip from './tooltip';

const popperClass = 'ys-overflow-tooltip';
const OverflowShowTooltip = {
    mounted() { // beforeDestroy在新组件created之后执行，因此必须用mounted
        this.activateTooltip = debounce(50, tooltip => tooltip.handleShowPopper());
        this.overflowTooltipComponent = this.renderTooltip();
    },

    methods: {
        renderTooltip() {
            // const hasPopperClassDOM = !!document.getElementsByClassName(popperClass).length;
            // if (hasPopperClassDOM) {
            //     return;
            // }

            const TooltipConstructor = Vue.extend(tooltip);

            const instance = new TooltipConstructor({
                el: document.createElement('div'),
                data: {
                    popperClass,
                },
            });

            document.getElementsByTagName('body')[0].appendChild(instance.$el);

            return instance;
        },
        removeTooltip() {
            const tableTooltip = document.getElementsByClassName(popperClass);
            [...tableTooltip].forEach(node => {
                node.parentNode.removeChild(node);
            });
        },
        // mouseenter事件，显示tooltip
        overflowShowTooltipMouseenter(event, value) {
            if (!this.overflowTooltipComponent) {
                console.error('overflowTooltipComponent不能为undefined');
                return;
            }

            const {target} = event;

            if (!(hasClass(target, 'el-tooltip') && target.childNodes.length)) {
                return;
            }

            const range = document.createRange();
            range.setStart(target, 0);
            range.setEnd(target, target.childNodes.length);
            const rangeWidth = range.getBoundingClientRect().width;
            const padding = (parseInt(getStyle(target, 'paddingLeft'), 10) || 0)
                + (parseInt(getStyle(target, 'paddingRight'), 10) || 0);

            if (
                rangeWidth + padding > target.getBoundingClientRect().width
                || target.scrollWidth > target.offsetWidth
            ) {
                const tableTooltip = this.overflowTooltipComponent;
                const {tooltip} = tableTooltip.$refs;

                Object.assign(tableTooltip, value);
                tableTooltip.content = value.content || target.innerText || target.textContent;

                tooltip.referenceElm = target;
                tooltip.$refs.popper && (tooltip.$refs.popper.style.display = 'none');
                tooltip.doDestroy();
                tooltip.setExpectedState(true);
                this.activateTooltip(tooltip);
            }
        },
        // mouseleave 重置 tooltip
        overflowShowTooltipMouseleave(event) {
            if (!this.overflowTooltipComponent) {
                console.error('overflowTooltipComponent不能为undefined');
                return;
            }

            const {tooltip} = this.overflowTooltipComponent.$refs;
            if (tooltip) {
                tooltip.setExpectedState(false);
                tooltip.handleClosePopper();
            }
        },
    },
    beforeDestroy() {
        this.removeTooltip();
    },
};

const tooltipMethods = {
    mounted: OverflowShowTooltip.mounted,
    ...OverflowShowTooltip.methods,
    beforeDestroy: OverflowShowTooltip.beforeDestroy,
};

export const OverflowTooltip = {
    bind() {
        if (!tooltipMethods.activateTooltip) {
            tooltipMethods.mounted();
        }
    },
    inserted(el, {value = {}}) {
        el.addEventListener('mouseenter', e => {
            if (typeof value.popperClass === 'string') {
                value.popperClass += ` ${popperClass}`;
            }
            else {
                value.popperClass = popperClass;
            }
            tooltipMethods.overflowShowTooltipMouseenter(e, value);
        });
        el.addEventListener('mouseleave', e => {
            tooltipMethods.overflowShowTooltipMouseleave(e);
        });
    },
    unbind() {
        tooltipMethods.beforeDestroy();
    },
};
