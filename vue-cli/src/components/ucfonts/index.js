export default{
  components:{
    charData:require('./charData.vue').default,
  },
  data(){
    return{
      fontData:null,
      offsetList:[],
    };
  },
  created(){
    this.axios.get('./static/HZKPST',{
      responseType:'arraybuffer',
    }).then((resp)=>{
      this.fontData=resp.data;
      let dataView=new DataView(this.fontData);
      //for(let qu=0xa1;qu<=0xa9;qu++){
      for(let qu=0xa1;qu<=0xa1;qu++){
        //for(let wei=0xa1;wei<=0xfe;wei++){
        for(let wei=0xa1;wei<=0xa9;wei++){
          let offset=((qu-0xa1)*94+(wei-0xa1))*6;
          let dataOffset=(dataView.getInt32(offset,true)&0xfffffff);
          let dataLength=dataView.getUint16(offset+4,true);
          this.offsetList.push({
            offset:dataOffset,
            length:dataLength,
            buffer:dataLength?new Uint8Array(this.fontData,dataOffset,dataLength):null,
          });
        }
      }
    }).catch((e)=>{
      console.error(e);
    });
  },
}
