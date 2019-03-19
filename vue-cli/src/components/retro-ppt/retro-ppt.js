import uuid from 'uuid/v4'
import JSZip from 'jszip';
import {saveAs} from 'file-saver'
import {
  extensionMatch,
} from '@/js/common.js'
import {
  image2CGA,
  generateBASIC,
  generateDeployScript,
} from './util.js'
export default{
  components:{
    addImage:require('./addImage.vue').default,
    draftManager:require('./draftManager.vue').default,
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
    clearAllImage(){
      this.$confirm('是否清空所有图片？',{
        type:'warning',
        closeOnClickModal:false,
      }).then(()=>{
        this.imageList = [];
      })
    },
    newImage(files){
      for(let file of files){
        this.imageList.push({
          id:uuid(),
          file:file,
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
      this.$prompt('请输入文件名：', '导出', {
        closeOnClickModal:false,
        center:true,
        roundButton:true,
      }).then(({value})=>{
        let fileName = value, folderName = value;
        if(!extensionMatch('.zip', fileName)){
          fileName += '.zip';
        }else{
          folderName = folderName.slice(0,-4);
        }
        let zip = new JSZip(), fileList = [];
        let target = zip.folder(folderName);
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
          saveAs(file, fileName);
        });
      });
    },
  },
  mounted(){
  },
}
