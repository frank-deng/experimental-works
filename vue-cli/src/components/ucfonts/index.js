import {
  loadASCPS,
  loadHZKPST,
  loadHZKPS,
} from './loadOutlineFont.js';
export default{
  components:{
    charData:require('./charData.vue').default,
  },
  data(){
    return{
      textInput:'、',
      fontData:{},
      ascFontData:[],
      ascFont:0,
      width:100,
      height:100,
      x:0,y:0,
    };
  },
  computed:{
    fontDataChar(){
      if(!this.textInput || !this.textInput.length){
        return '';
      }
      let charCode = this.textInput.charCodeAt(0).toString(16);
      return this.fontData[charCode];
    },
  },
  watch:{
    ascFont(ascFont){
      Object.assign(this.fontData,this.ascFontData[this.ascFont]);
    },
  },
  created(){
    let taskASCPS=this.axios.get('./static/ASCPS',{
      responseType:'arraybuffer',
    }).then((resp)=>{
      this.ascFontData=loadASCPS(resp.data);
      Object.assign(this.fontData,this.ascFontData[this.ascFont]);
    }).catch((e)=>{
      console.error(e);
    });
    let taskHZKPST=this.axios.get('./static/HZKPST',{
      responseType:'arraybuffer',
    }).then((resp)=>{
      Object.assign(this.fontData,loadHZKPST(resp.data));
    }).catch((e)=>{
      console.error(e);
    });
    let taskHZKPS=this.axios.get('./static/HZKPSSTJ',{
      responseType:'arraybuffer',
    }).then((resp)=>{
      Object.assign(this.fontData,loadHZKPS(resp.data));
    }).catch((e)=>{
      console.error(e);
    });
  },
}
