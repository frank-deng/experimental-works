import Vue from 'vue'
import Router from 'vue-router'

import IndexPage from '@/components/IndexPage/IndexPage.vue'
import DTMFEffect from '@/components/DTMFEffect/index.vue'
import WebAudioAPI from '@/components/WebAudioAPI/WebAudioAPI.vue'
//import WebGLTry from '@/components/WebGLTry/index.vue'

Vue.use(Router);
let router = new Router({
	routes: [
		{
			path: '/',
			name: '首页',
			component: IndexPage,
		},
		{
			path: '/dtmf',
			name: 'DTMF音效',
			component: DTMFEffect,
		},
		{
			path: '/WebAudioAPI',
			name: 'WebAudioAPI实验',
			component: WebAudioAPI,
		},
		/*
		{
			path: '/WebGL',
			name: 'WebGL/three.js测试',
			component: WebGLTry,
		},
		*/
	],
});
router.beforeEach((to, from, next)=>{
	document.title = to.name;
	next();
});
export default router;

