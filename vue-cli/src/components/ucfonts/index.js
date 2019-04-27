import {
  saveAs,
}from 'file-saver';
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
      textInput:'黄',
      hzkps:'HZKPSKTJ',
      fontData:{},
      fontDataChar:[],
    };
  },
  methods:{
    drawFont(){
      if(!this.textInput || !this.textInput.length){
        return;
      }
      let charCode = this.textInput.charCodeAt(0).toString(16);
      this.fontDataChar=this.fontData[charCode];
      this.$refs.charData.update();
    },
    getFont(){
      let data=Uint8Array.from(require('./fontData.js').default);
      saveAs(new Blob([data]),'asc8x8.fon');
    },
  },
  created(){
    let taskHZKPST=this.axios.get('./static/HZKPST',{
      responseType:'arraybuffer',
    }).then((resp)=>{
      Object.assign(this.fontData,loadHZKPST(resp.data));
    }).catch((e)=>{
      console.error(e);
    });
    let taskHZKPS=this.axios.get(`./static/${this.hzkps}`,{
      responseType:'arraybuffer',
    }).then((resp)=>{
      Object.assign(this.fontData,loadHZKPS(resp.data));
    }).catch((e)=>{
      console.error(e);
    });
    Promise.all([taskHZKPST,taskHZKPS]).then(()=>{
      this.drawFont();
    })
  },
}
