import JSZip from 'jszip';
import uuid from 'uuid/v4'
export default{
  props:{
    value:Array,
  },
  data(){
    return {
    };
  },
  watch:{
    value:{
      immediate:true,
      handler(value){
      },
    },
  },
  methods:{
    saveDraft(){
      if (0==this.value.length){
        this.$alert('请添加图片');
        return;
      }
      let zip = new JSZip();
      let imageFolder = zip.folder('image');
      let jsonToSave = [];
      this.value.map((item,i)=>{
        jsonToSave.push({
          layout:item.layout,
          backgroundColor:item.backgroundColor,
          dither:item.dither,
        });
        imageFolder.file(`IMG${('00000'+String(i)).slice(-5)}.DAT`, item.file);
      });
      zip.file('index.json', JSON.stringify(jsonToSave, null, 2));
      zip.generateAsync({type:'blob'}).then((file)=>{
        this.$saveAs(file, null, '.zip', '保存草稿');
      });
    },
    loadDraft(){
      this.$refs.filePicker.click();
    },
    handleChange(){
      let files = this.$refs.filePicker.files;
      if(0 == files.length){
        this.$message.error('请选择文件');
        return;
      }

      let jsZip = new JSZip();
      let zip = undefined;
      jsZip.loadAsync(files[0]).then((_zip)=>{
        zip = _zip;
        return _zip.file('index.json').async('string');
      }).then((json)=>{
        let imageList = JSON.parse(json);
        let promises = [];
        let imageDir = zip.folder('image');
        for(let i=0; i<imageList.length; i++){
          promises.push(imageDir.file(`IMG${('00000'+String(i)).slice(-5)}.DAT`).async('blob'));
        }
        Promise.all(promises).then((blob)=>{
          for(let i=0; i<imageList.length; i++){
            Object.assign(imageList[i],{
              id:uuid(),
              file:blob[i],
            });
          }
          this.$emit('input',imageList);
        });
      }).catch((e)=>{
        this.$message.error('打开草稿失败');
        console.error(e);
      });
    },
  },
}
