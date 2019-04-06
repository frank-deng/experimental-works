import {
  loadOutlineFont,
} from './loadOutlineFont.js';
export default{
  components:{
    charData:require('./charData.vue').default,
  },
  data(){
    return{
      textInput:null,
      fontData:{},
    };
  },
  computed:{
    fontDataChar(){
      if(!this.textInput || !this.textInput.length){
        return '';
      }
      return this.fontData[this.textInput.charCodeAt(0).toString(16)];
    },
  },
  created(){
    let taskHZKPST=this.axios.get('./static/HZKPST',{
      responseType:'arraybuffer',
    }).then((resp)=>{
      Object.assign(this.fontData,loadOutlineFont('HZKPST',resp.data));
    }).catch((e)=>{
      console.error(e);
    });
    let taskHZKPS=this.axios.get('./static/HZKPSSTJ',{
      responseType:'arraybuffer',
    }).then((resp)=>{
      Object.assign(this.fontData,loadOutlineFont('HZKPS',resp.data));
    }).catch((e)=>{
      console.error(e);
    });
  },
}
