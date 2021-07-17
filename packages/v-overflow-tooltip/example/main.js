import Vue from 'vue';
import ElementUI from 'element-ui';
import App from './App.vue';
import PluginOverflowTooltip, {OverflowTooltip} from '../src/index';
import 'element-ui/lib/theme-chalk/index.css';

Vue.config.productionTip = false;
Vue.use(ElementUI);
// Vue.directive('overflow-tooltip', OverflowTooltip);
Vue.use(PluginOverflowTooltip);


new Vue({
    render: h => h(App),
}).$mount('#app');
