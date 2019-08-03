import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router);
let router = new Router({
  routes: [
		{
			path: '/',
			name: '首页',
			component: require('@/views/IndexPage/IndexPage.vue').default,
		},
		{
			path: '/dtmf',
			name: 'DTMF音效',
			component: ()=>import(/* webpackChunkName: "dtmf" */'@/views/DTMFEffect/index.vue')
		},
		{
			path: '/WebAudioAPI',
			name: 'WebAudioAPI实验',
			component: ()=>import(/* webpackChunkName: "WebAudioAPI" */'@/views/WebAudioAPI/WebAudioAPI.vue')
		},
		{
			path: '/MusicBox',
			name: '音乐盒',
			component: ()=>import(/* webpackChunkName: "MusicBox" */'@/views/MusicBox/index.vue')
		},
		{
			path: '/WebGLTry',
			name: 'WebGL实验',
			component: ()=>import(/* webpackChunkName: "WebGLTry" */'@/views/WebGLTry/index.vue')
		},
		{
			path: '/DrawPad',
			name: '画画板',
			component: (r)=>import(/* webpackChunkName: "DrawPad" */'@/views/DrawPad/main.vue')
		},
		{
			path: '/KMeansPosterization',
			name: 'K-Means图像处理',
			component: (r)=>import(/* webpackChunkName: "KMeansPosterization" */'@/views/KMeans/index.vue')
		}
	],
});
router.beforeEach((to, from, next)=>{
	document.title = to.name;
	next();
});
export default router;

