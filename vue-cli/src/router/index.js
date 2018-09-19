import Vue from 'vue'
import Router from 'vue-router'

import IndexPage from '@/components/IndexPage/IndexPage.vue'
import DTMFEffect from '@/components/DTMFEffect/index.vue'
import WebAudioAPI from '@/components/WebAudioAPI/WebAudioAPI.vue'
import MusicBox from '@/components/MusicBox/index.vue'
import TetrisAI from '@/components/TetrisAI/index.vue'
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
		{
			path: '/MusicBox',
			name: '音乐盒',
			component: MusicBox,
		},
		{
			path: '/TetrisAI',
			name: '俄罗斯方块AI',
			component: TetrisAI,
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

