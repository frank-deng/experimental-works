import Vue from 'vue'
import Router from 'vue-router'

import IndexPage from '@/components/IndexPage/IndexPage.vue'
import WebAudioAPI from '@/components/WebAudioAPI/WebAudioAPI.vue'
import XHRTry from '@/components/XHRTry/index.vue'
import WebGLTry from '@/components/WebGLTry/index.vue'
import ColorDist from '@/components/ColorDist/index.vue'
import DTMFEffect from '@/components/DTMFEffect/index.vue'

Vue.use(Router);
let router = new Router({
	routes: [
		{
			path: '/',
			name: '首页',
			component: IndexPage,
		},
		{
			path: '/WebAudioAPI',
			name: 'WebAudioAPI实验',
			component: WebAudioAPI,
		},
		{
			path: '/XHRTry',
			name: 'XHR实验',
			component: XHRTry,
		},
		{
			path: '/WebGL',
			name: 'WebGL/three.js测试',
			component: WebGLTry,
		},
		{
			path: '/colordist',
			name: '颜色分布',
			component: ColorDist,
		},
		{
			path: '/dtmf',
			name: 'DTMF音效',
			component: DTMFEffect,
		},
	],
});
router.beforeEach((to, from, next)=>{
	document.title = to.name;
	next();
});
export default router;
