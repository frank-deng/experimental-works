import Vue from 'vue'
import Router from 'vue-router'

import IndexPage from '@/components/IndexPage/IndexPage.vue'
import DTMFEffect from '@/components/DTMFEffect/index.vue'
import WebAudioAPI from '@/components/WebAudioAPI/WebAudioAPI.vue'
import ColorDist from '@/components/ColorDist/index.vue'
import WebGLTry from '@/components/WebGLTry/index.vue'
import MathML from '@/components/MathML/index.vue'

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
			path: '/colordist',
			name: '颜色分布',
			component: ColorDist,
		},
		{
			path: '/WebAudioAPI',
			name: 'WebAudioAPI实验',
			component: WebAudioAPI,
		},
		{
			path: '/WebGL',
			name: 'WebGL/three.js测试',
			component: WebGLTry,
		},
		{
			path: '/MathML',
			name: 'MathML测试',
			component: MathML,
		},
	],
});
router.beforeEach((to, from, next)=>{
	document.title = to.name;
	next();
});
export default router;
