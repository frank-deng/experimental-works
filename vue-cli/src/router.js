import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router);
let router = new Router({
  routes: [
		{
			path:'/',
			name:'首页',
			component:require('@/views/IndexPage/IndexPage.vue').default,
		},
		{
			path:'/zrender',
			name:'ZRender Try',
			component:()=>import(/* webpackChunkName: "zrender-try" */'@/views/ZRenderTry/main.vue')
		},
		{
			path:'/dtmf',
			name:'DTMF音效',
			component:()=>import(/* webpackChunkName: "dtmf" */'@/views/DTMFEffect/index.vue')
		},
		{
			path:'/WebAudioAPI',
			name:'WebAudioAPI实验',
			component:()=>import(/* webpackChunkName: "WebAudioAPI" */'@/views/WebAudioAPI/WebAudioAPI.vue')
		},
		{
			path:'/MusicBox',
			name:'音乐盒',
			component:()=>import(/* webpackChunkName: "MusicBox" */'@/views/MusicBox/index.vue')
		},
		{
			path:'/WebGLTry',
			name:'WebGL实验',
			component:()=>import(/* webpackChunkName: "WebGLTry" */'@/views/WebGLTry/index.vue')
		},
		{
			path:'/DrawPad',
			name:'画画板',
			component:()=>import(/* webpackChunkName: "DrawPad" */'@/views/DrawPad/main.vue')
		},
		{
			path:'/dithering',
			name:'图像抖动处理',
			component:()=>import(/* webpackChunkName: "dithering" */'@/views/dithering/index.vue')
		},
		{
			path:'/ncov',
			name:'肺炎疫情',
			component:()=>import(/* webpackChunkName: "ncov" */'@/views/ncov/ncov.vue')
		},
		{
			path:'/testPage',
			name:'测试页面',
			component:()=>import(/* webpackChunkName: "testPage" */'@/views/TestPage/testPage.vue')
		}
	],
});
router.beforeEach((to, from, next)=>{
	document.title = to.name;
	next();
});
export default router;

