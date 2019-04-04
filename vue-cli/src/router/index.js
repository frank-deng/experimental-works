import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router);
let router = new Router({
	routes: [
		{
			path: '/',
			name: '首页',
			component: require('@/components/IndexPage/IndexPage.vue').default,
		},
		{
			path: '/dtmf',
			name: 'DTMF音效',
			component: (r)=>require.ensure([], ()=>r(require('@/components/DTMFEffect/index.vue')), 'dtmf'),
		},
		{
			path: '/WebAudioAPI',
			name: 'WebAudioAPI实验',
			component: (r)=>require.ensure([], ()=>r(require('@/components/WebAudioAPI/WebAudioAPI.vue')), 'WebAudioAPI'),
		},
		{
			path: '/MusicBox',
			name: '音乐盒',
			component: (r)=>require.ensure([], ()=>r(require('@/components/MusicBox/index.vue')), 'MusicBox'),
		},
		{
			path: '/WebGLTry',
			name: 'WebGL实验',
			component: (r)=>require.ensure([], ()=>r(require('@/components/WebGLTry/index.vue')), 'WebGLTry'),
		},
		{
			path: '/DrawPad',
			name: '画画板',
			component: (r)=>require.ensure([], ()=>r(require('@/components/DrawPad/main.vue')), 'DrawPad'),
		},
		{
			path: '/KMeansPosterization',
			name: 'K-Means图像处理',
			component: (r)=>require.ensure([], ()=>r(require('@/components/KMeans/index.vue')), 'KMeansPosterization'),
		},
		{
			path: '/ucfonts',
			name: 'UCDOS轮廓字体实验',
			component: (r)=>require.ensure([], ()=>r(require('@/components/ucfonts/index.vue')), 'KMeansPosterization'),
		},
	],
});
router.beforeEach((to, from, next)=>{
	document.title = to.name;
	next();
});
export default router;

