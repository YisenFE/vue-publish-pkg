import ClickOutside from './main';

ClickOutside.install = function (Vue) {
    Vue.directive('click-outside', ClickOutside);
};

export {
    ClickOutside,
};

export default ClickOutside;

