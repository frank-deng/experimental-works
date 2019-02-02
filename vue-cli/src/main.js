import VConsole from 'vconsole'
const vConsole = new VConsole();
vConsole.show();
self.vConsole = vConsole;

// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import 'element-ui/lib/theme-chalk/index.css'
import axios from 'axios'
Vue.prototype.axios = axios;

Vue.config.productionTip = false

import {
	Button,
	Slider,
	Select,
	Option,
	Input,
	InputNumber,
	Row,
	Col,
} from 'element-ui'
Vue.use(Button);
Vue.use(Slider);
Vue.use(Select);
Vue.use(Option);
Vue.use(Input);
Vue.use(InputNumber);
Vue.use(Row);
Vue.use(Col);

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})

