import {downloadAsFile} from '@/js/common.js';

//Generate default colors
var color2hex=function(r,g,b){
  let vr = (r<=0xF ? '0'+r.toString(16) : r.toString(16));
  let vg = (g<=0xF ? '0'+g.toString(16) : g.toString(16));
  let vb = (b<=0xF ? '0'+b.toString(16) : b.toString(16));
  return `#${vr}${vg}${vb}`;
}
export default{
  props:{
    value:{
      default(){
        return [];
      },
    },
  },
  data(){
    return{
      editing:false,
      colors:[],
    };
  },
  watch:{
    value(value){
      console.log('Incoming value changed.',value);
      if (!Array.isArray(value) || !value.length){
        return;
      }
      this.colors = [];
      for(let item of value){
        this.colors.push({
          value:color2hex(item[0],item[1],item[2]),
        });
      }
    },
  },
  methods:{
    startEditing(){
      this.editing = true;
    },
    deleteColor(idx){
      this.colors.splice(idx,1);
      this.update();
    },
    addColor(){
      this.colors.push({
        value:'#000000',
      });
      this.update();
    },
    checkColor(idx, value){
      if (!value){
        this.deleteColor(idx);
      } else {
        this.update();
      }
    },
    resetColors(){
      this.colors = [];
      for(var i=0;i<27;i++){
        let values=[0x00,0x7f,0xff];
        let r = values[Math.floor(i/9)%3], g = values[Math.floor(i/3)%3], b = values[i%3];
        this.colors.push({
          value:color2hex(r,g,b),
        });
      }
      this.update();
    },
    downloadPalette(){
      downloadAsFile(this.colors.map((item)=>{
        return item.value;
      }).join('\n'), 'palette.pal');
    },
    handlePaletteUpload(file){
      var reader = new FileReader();
      reader.addEventListener('load', (event)=>{
        let colorsFromFile = String.fromCharCode.apply(null, Buffer.from(event.target.result.split(',')[1], 'base64'));
        this.colors = [];
        for(let value of colorsFromFile.split('\n')){
          if(!(/^\#[0-9A-Fa-f]{6}$/.test(value))){
            return;
          }
          this.colors.push({
            value:value,
          });
        }
      });
      reader.readAsDataURL(file);
      return false;
    },
    update(){
      this.$emit('input', this.colors.map((item)=>{
        return [
          parseInt(item.value.slice(1,3),16),
          parseInt(item.value.slice(3,5),16),
          parseInt(item.value.slice(5,7),16),
        ];
      }));
    },
  },
  mounted(){
    this.resetColors();
  },
}
