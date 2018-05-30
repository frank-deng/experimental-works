import Vue from 'vue'
import Router from 'vue-router'
import JokeList from '@/components/JokeList/JokeList.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'JokeList',
      component: JokeList,
    },
  ]
})

