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
  Message,
  MessageBox,
	Button,
	ButtonGroup,
	Slider,
	Select,
	Option,
	Input,
	InputNumber,
	Row,
	Col,
	Upload,
  Loading,
  Form,
  FormItem,
  Switch,
  ColorPicker,
  Table,
  TableColumn,
  Dialog,
  Tabs,
  TabPane,
	Radio,
	RadioGroup,
} from 'element-ui'
Vue.use(Button);
Vue.use(ButtonGroup);
Vue.use(Slider);
Vue.use(Select);
Vue.use(Option);
Vue.use(Input);
Vue.use(InputNumber);
Vue.use(Row);
Vue.use(Col);
Vue.use(Upload);
Vue.use(Form);
Vue.use(FormItem);
Vue.use(Switch);
Vue.use(ColorPicker);
Vue.use(Table);
Vue.use(TableColumn);
Vue.use(Dialog);
Vue.use(Tabs);
Vue.use(TabPane);
Vue.use(Radio);
Vue.use(RadioGroup);
Vue.prototype.$message = Message;
Vue.prototype.$loading = Loading;
Vue.prototype.$alert = MessageBox.alert;
Vue.prototype.$prompt = MessageBox.prompt;
Vue.prototype.$confirm = MessageBox.confirm;

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')

