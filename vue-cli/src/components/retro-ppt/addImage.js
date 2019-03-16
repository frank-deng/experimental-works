import FileReader from "promisify-file-reader"
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
      this.$emit('upload', this.$refs.filePicker.files);
    },
  },
}
