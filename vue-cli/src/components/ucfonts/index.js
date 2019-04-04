export default{
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
      for(let qu=0xa1;qu<=0xa9;qu++){
        for(let wei=0xa1;wei<=0xfe;wei++){
          let offset=((qu-0xa1)*94+(wei-0xa1))*6;
          this.offsetList.push({
            offset:(dataView.getInt32(offset,true)&0xfffffff).toString(16),
            length:dataView.getUint16(offset+4,true),
          });
        }
      }
    });
  },
}