import {OverflowTooltip} from './main';

OverflowTooltip.install = function (Vue) {
    Vue.directive('overflow-tooltip', OverflowTooltip);
};

export {
    OverflowTooltip,
};

export default OverflowTooltip;
