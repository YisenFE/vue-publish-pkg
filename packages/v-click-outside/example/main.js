import Vue from 'vue';
import App from './App.vue';
import PluginClickOutside, {ClickOutside} from '../src/index';

Vue.config.productionTip = false;
Vue.directive('click-outside', ClickOutside);
// Vue.use(PluginClickOutside);


new Vue({
    render: h => h(App),
}).$mount('#app');
