import {saveAs} from 'file-saver';
import selectFiles from 'select-files';

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
      type:Array,
      default:()=>[]
    }
  },
  data(){
    return{
      colors:[],
    };
  },
  watch:{
    value:{
      immediate:true,
      handler(value){
        if (!Array.isArray(value) || !value.length){
          return;
        }
        this.colors = [];
        for(let item of value){
          this.colors.push({
            value:color2hex(item[0],item[1],item[2]),
          });
        }
      }
    }
  },
  methods:{
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
    downloadPalette(){
      let data = this.colors.map((item)=>{
        return item.value;
      }).join('\n');
      saveAs(new Blob([data], {type:'text/plain;charset=utf-8'}), 'palette.pal');
    },
    handlePaletteUpload(){
      var reader = new FileReader();
      reader.addEventListener('load', (event)=>{
        let colorsFromFile = event.target.result;
        this.$set(this,'colors',[]);
        for(let value of colorsFromFile.split('\n')){
          value=value.trim();
          if(!(/^\#[0-9A-Fa-f]{6}$/.test(value))){
            return;
          }
          this.colors.push({
            value:value,
          });
        }
        this.update();
        console.log(this.value);
      });
      selectFiles({accept:'.pal'}).then((fileList)=>{
        reader.readAsText(fileList[0]);
      });
    },
    update(){
      this.$emit('input', this.colors.map((item)=>{
        return [
          parseInt(item.value.slice(1,3),16),
          parseInt(item.value.slice(3,5),16),
          parseInt(item.value.slice(5,7),16),
        ];
      }));
    }
  }
}

