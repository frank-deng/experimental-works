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
      path:'/routerGuard',
      name:'子页面处理',
      component:()=>import(/* webpackChunkName: "routerGuardFrame" */'@/views/routerGuard/frame.vue'),
      children:[
        {
          path:'/routerGuard',
          name:'子页面处理-正式页面',
          component:()=>import(/* webpackChunkName: "routerGuard" */'@/views/routerGuard/master.vue'),
          children:[
            {
              path:'slave1',
              name:'1号子页面',
              component:()=>import(/* webpackChunkName: "routerGuardSlave1" */'@/views/routerGuard/slave1.vue'),
              meta:{
                permission:1
              }
            },
            {
              path:'slave2',
              name:'2号子页面',
              component:()=>import(/* webpackChunkName: "routerGuardSlave2" */'@/views/routerGuard/slave2.vue'),
              meta:{
                permission:2
              }
            },
            {
              path:'slave3',
              component:()=>import(/* webpackChunkName: "routerGuardSlave3" */'@/views/routerGuard/slave3.vue'),
              meta:{
                permission:3
              }
            }
          ]
        }
      ]
    },
    {
      path:'/minesweeper',
      name:'扫雷',
      component:()=>import(/* webpackChunkName: "minesweeper" */'@/views/minesweeper/minesweeper.vue')
    },
    {
      path:'/zonePlate',
      name:'Zone Plate',
      component:()=>import(/* webpackChunkName: "zonePlate" */'@/views/zonePlate/zonePlate.vue')
    },
    {
      path:'/arranger',
      name:'排班表',
      component:()=>import(/* webpackChunkName: "zonePlate" */'@/views/arranger/arranger.vue')
    },
    {
      path:'/testPage',
      name:'测试页面',
      component:()=>import(/* webpackChunkName: "testPage" */'@/views/TestPage/testPage.vue')
    }
  ],
});
router.afterEach((to, from)=>{
  let title='';
  for(let item of to.matched){
    if(item.name){
      title=item.name;
    }
  }
  document.title = title;
});
export default router;

