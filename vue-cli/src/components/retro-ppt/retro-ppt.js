export default{
  components:{
    processImage:require('./processImage.vue').default,
  },
  data(){
    return{
      fileList:[],
    };
  },
  methods:{
    updateFileList(file, fileList){
      this.fileList = fileList;
    },
  },
  mounted(){
  },
}
