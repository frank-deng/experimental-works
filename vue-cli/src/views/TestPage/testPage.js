/* global __DEV__ */
import config from '@/config.js';
import axios from 'axios';
import echarts from 'echarts';
export default{
  data(){
    return{
    };
  },
  mounted(){
    axios.get('https://api.tianapi.com/txapi/ncovcity/index',{
      params:{
        key:config.key
      }
    }).then((resp)=>{
      console.log(resp);
    });
  },
  methods:{
  }
}

