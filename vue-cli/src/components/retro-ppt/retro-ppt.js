import uuid from 'uuid/v4'
import {saveAs} from 'file-saver'
import JSZip from 'jszip';
import {
  image2CGA,
  generateBASIC,
  generateDeployScript,
} from './util.js'
export default{
  components:{
    addImage:require('./addImage.vue').default,
    processImage:require('./processImage.vue').default,
  },
  data(){
    return{
      imageList:[],
      layoutSelection:[
        {label:'适应', value:'fit'},
        {label:'居中', value:'center'},
        {label:'拉伸', value:'stretch'},
        {label:'填充', value:'fill'},
        {label:'平铺', value:'tile'},
      ],
      colorSelection:[
        {label:'黑色', value:'#000000'},
        {label:'白色', value:'#FFFFFF'},
      ],
      ditherSelection:[
        {label:'无', value:'none'},
        {label:'Ordered', value:'ordered'},
        {label:'Floyd-Steinberg', value:'floyd-steinberg'},
        {label:'Minimized Average Error', value:'min-avg-error'},
      ],
    };
  },
  methods:{
    updateFileList(file, fileList){
      this.fileList = fileList;
    },
    newImage(files){
      console.log(files);
      for(let file of files){
        this.imageList.push({
          id:uuid(),
          dataURL:file.dataURL,
          fileName:file.file.name,
          layout:'fit',
          backgroundColor:'#000000',
          dither:'floyd-steinberg',
          image:null,
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
    writeResult(row, image){
      row.image = image;
    },
    saveDraft(){
      let jsonToSave = [];
      for(let item of this.imageList){
        jsonToSave.push({
          image:item.dataURL,
          layout:'fit',
          backgroundColor:'#000000',
          dither:'floyd-steinberg',
        });
      }
      this.$prompt('请输入文件名：', '保存草稿', {
        showCancelButton:false,
        closeOnClickModal:false,
        center:true,
        roundButton:true,
      }).then((fileName)=>{
        saveAs(jsonToSave, `${fileName}.zip`);
      });
    },
    exportAllAsZip(){
      if (0==this.imageList.length){
        this.$alert('请添加图片');
        return;
      }
      for(let item of this.imageList){
        if(!item.image){
          this.$alert('有图片未处理完',{type:'warning'});
          return;
        }
      }
      let zip = new JSZip(), fileList = [];
      let target = zip.folder('photo');
      for(let i = 0; i < this.imageList.length; i++){
        let item = this.imageList[i];
        let filename = `IMG${('00000'+String(i)).slice(-5)}.PIC`;
        fileList.push(filename);
        target.file(filename, image2CGA(item.image));
      }
      target.file('PHOTO.BAS', generateBASIC(fileList));
      target.file('deploy.sh', generateDeployScript(), {
        unixPermissions:'755',
      });
      zip.generateAsync({type:'blob'}).then((file)=>{
        saveAs(file, 'export.zip');
      });
    },
  },
  mounted(){
  },
}
