import Vue from 'vue'
import Router from 'vue-router'

import IndexPage from '@/components/IndexPage/IndexPage.vue'
import DynamicTable from '@/components/DynamicTable/DynamicTable.vue'
import WebAudioAPI from '@/components/WebAudioAPI/WebAudioAPI.vue'
import XHRTry from '@/components/XHRTry/index.vue'
import WebGLTry from '@/components/WebGLTry/index.vue'

Vue.use(Router);
let router = new Router({
	routes: [
		{
			path: '/',
			name: '首页',
			component: IndexPage,
		},
		{
			path: '/DynamicTable',
			name: '动态添加表头和填写项目',
			component: DynamicTable,
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
	],
});
router.beforeEach((to, from, next)=>{
	document.title = to.name;
	next();
});
export default router;
