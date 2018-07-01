// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import VueResource from 'vue-resource';
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import DelayMapBatch from 'delay-map-batch'
import loadSound from '@/js/util.js'
global.DelayMapBatch = DelayMapBatch;

Vue.config.productionTip = false
Vue.use(ElementUI, {zIndex: 3000 });
Vue.use(VueResource);

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})

var beepData = {
	audioCtx: undefined,
	oscillator: undefined,
	timeout: undefined,
}
beepData.audioCtx = new AudioContext();
Vue.prototype.$beep = function(beep){
	clearTimeout(beepData.timeout);
	beepData.timeout = undefined;
	if (!beep && beepData.oscillator){
		beepData.oscillator.stop();
		beepData.oscillator = undefined;
	} else if (beep) {
		if (!beepData.oscillator){
			let oscillator = beepData.audioCtx.createOscillator();
			oscillator.type = 'square';
			oscillator.frequency.setValueAtTime(2000, beepData.audioCtx.currentTime);
			oscillator.connect(beepData.audioCtx.destination);
			oscillator.start();
			beepData.oscillator = oscillator;
		}
		beepData.timeout = setTimeout(()=>{
			beepData.oscillator.stop();
			beepData.oscillator = undefined;
			beepData.timeout = undefined;
		}, 1000);
	}
}
