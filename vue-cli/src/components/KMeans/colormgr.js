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
  created(){
    for(var i=0;i<27;i++){
      let values=[0x00,0x7f,0xff];
      let r = values[Math.floor(i/9)%3], g = values[Math.floor(i/3)%3], b = values[i%3];
      this.colors.push({
        value:color2hex(r,g,b),
      });
    }
  },
  mounted(){
    this.update();
  },
}
