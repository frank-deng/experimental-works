export default{
  components:{
    addImage:require('./addImage.vue').default,
  },
  data(){
    return{
      imageList:[],
    };
  },
  methods:{
    updateFileList(file, fileList){
      this.fileList = fileList;
    },
    newImage(files){
      for(let file of files){
        this.imageList.push({
          file:file,
          fileName:file.name,
          dither:'floyd-steinberg',
          fitting:'adapt-screen',
        });
      }
    },
    deleteImage(idx){
      this.imageList.splice(idx,1);
    },
    moveUpImage(idx){
      if(idx<=0){
        return;
      }
      let temp = this.imageList[idx];
      this.$set(this.imageList, idx, this.imageList[idx-1]);
      this.$set(this.imageList, idx-1, temp);
    },
    moveDownImage(idx){
      if(idx>=(this.imageList.length-1)){
        return;
      }
      let temp = this.imageList[idx];
      this.$set(this.imageList, idx, this.imageList[idx+1]);
      this.$set(this.imageList, idx+1, temp);
    },
  },
  mounted(){
  },
}
