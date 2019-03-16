import {readFile} from '@/js/common.js'
export default{
  data(){
    return{
    };
  },
  methods:{
    pickImage(){
      this.$refs.filePicker.click();
    },
    handleChange(e){
      let promises = [];
      let length = this.$refs.filePicker.files.length;
      for(let file of this.$refs.filePicker.files){
        promises.push(readFile(file));
      }
      Promise.all(promises).then((dataURLs)=>{
        let result = [];
        for(let i = 0; i < length; i++){
          result.push({
            dataURL:dataURLs[i],
            file:this.$refs.filePicker.files[i],
          })
        }
        this.$emit('upload', result);
      });
    },
  },
}
