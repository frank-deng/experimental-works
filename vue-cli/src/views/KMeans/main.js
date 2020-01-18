import fecha from 'fecha';
import KMeansWorker from './kmeans.worker.js';
import {fitRect as _fitRect} from '@/components/common.js';

function fitRect(wdest, hdest, wsrc, hsrc) {
  if (wsrc <= wdest && hsrc <= hdest) {
    return {
      width: wsrc,
      height: hsrc,
    };
  }
  let width = 0, height = 0;
  [width, height] = _fitRect(wdest,hdest,wsrc,hsrc);
  return {
    width: width,
    height: height,
  };
}
export default {
  components:{
    colorManager:require('./colormgr.vue').default,
  },
  data(){
    return{
      formPreparation:{
        maxWidth:640,
        maxHeight:640,
        dither:false,
        fileList:[],
        colors:[],
        _validation:{
          fileList:{
            required:true,
            validator:(rule,value,callback)=>{
              if(0==value.length){
                callback(new Error('请选择文件'));
                return;
              }
              callback();
            },
          },
          maxWidth:[
            {required:true, message:'请填写图片最大宽度'},
            {type:'number', message:'请输入数字类型的值'},
          ],
          maxHeight:[
            {required:true, message:'请填写图片最大宽度'},
            {type:'number', message:'请输入数字类型的值'},
          ],
          colors:{
            required:true,
            validator:(rule,value,callback)=>{
              if(0==value.length){
                callback(new Error('请添加初始颜色'));
                return;
              }
              callback();
            },
          },
        },
      },
      loading:false,
      reader:undefined,
      displayResult:false,
    };
  },
  watch:{
    'formPreparation.fileList'(){
      this.$refs.formPreparation.clearValidate('fileList');
    },
    'formPreparation.colors'(){
      this.$refs.formPreparation.clearValidate('colors');
    },
  },
  methods:{
    updateFileList(file, fileList){
      this.formPreparation.fileList = fileList;
    },
    doProcessFile(){
      this.$refs.formPreparation.validate((valid)=>{
        if(!valid){
          return;
        }
        this.loading = true;
        this.reader.readAsDataURL(this.formPreparation.fileList[0].raw);
      });
    },
    noMoreFiles(){
      this.$alert('一次只能打开一个文件。', {
        type:'error',
      });
    },
    onSaveFile(e){
      let filename = 'IMG_'+fecha.format(new Date(), 'YYYYMMDD_HHMMSS.png');
      saveAs(this.$refs.canvasImage.toDataURL('image/png'), filename);
    },
    goBack(){
      this.displayResult = false;
      this.resetForm();
    },
    resetForm(){
      this.formPreparation.filelist = [];
    },
  },
  mounted(){
    var resizeCanvas = ()=>{
      if (!this.displayResult){
        return;
      }
      var canvas = this.$refs.canvasImage;
      var body = this.$refs.imageArea;
      var destSize = fitRect(body.offsetWidth - 2, body.offsetHeight - 2, canvas.width, canvas.height);
      canvas.style.width = `${destSize.width}px`;
      canvas.style.height = `${destSize.height}px`;
    };

    var reader = new FileReader();
    this.reader = reader;
    var image = new Image();
    var kmeansWorker = new KMeansWorker();

    reader.addEventListener('load', (event)=>{
      image.src = event.target.result;
    });
    var vm = this;
    image.addEventListener('load', function(e){
      var destSize = fitRect(
        vm.formPreparation.maxWidth,
        vm.formPreparation.maxHeight,
        this.width, this.height);
      vm.$refs.canvasImage.width = destSize.width;
      vm.$refs.canvasImage.height = destSize.height;
      var ctx = vm.$refs.canvasImage.getContext('2d');
      ctx.drawImage(image,
        0, 0, this.width, this.height,
        0, 0, destSize.width, destSize.height
      );
      var canvasWidth = vm.$refs.canvasImage.width;
      var canvasHeight = vm.$refs.canvasImage.height;
      var imageData = ctx.getImageData(0, 0, canvasWidth, canvasHeight);
      kmeansWorker.postMessage({
        imageData:imageData,
        dither:vm.formPreparation.dither,
        initPoints:vm.formPreparation.colors,
      });
    });
    image.addEventListener('error', ()=>{
      vm.loading = false;
      vm.resetForm();
      vm.$alert('图片加载失败', '错误', {
        type:'error',
        center:true,
        roundButton:true,
        showClose:false,
        customClass:'dialogFailed',
      });
    });
    kmeansWorker.addEventListener('message', (resp)=>{
      if (resp.data.message){
        alert(resp.data.message);
        return;
      }
      var ctx = vm.$refs.canvasImage.getContext('2d');
      ctx.putImageData(resp.data.imageData, 0, 0);
      this.displayResult = true;
      this.$nextTick(()=>{
        resizeCanvas();
        this.loading = false;
      })
    });
    kmeansWorker.addEventListener('error',(e)=>{
      console.error('Error from worker.', e);
    });
    window.addEventListener('resize', resizeCanvas);
  },
}

