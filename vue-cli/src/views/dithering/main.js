import {saveAs} from 'file-saver';
import fecha from 'fecha';
import {fitRect as _fitRect} from '@/components/common.js';
import RGBQuant from 'rgbquant';
import KMeans from './kmeans.js';

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
      paletteModeList:[
        {
          name:'自适应调色板',
          value:'adaptive'
        },
        {
          name:'固定调色板',
          value:'fixed'
        },
        {
          name:'K-Means',
          value:'kmeans'
        }
      ],
      ditherMethodList:[
        {
          name:'无',
          value:null
        },
        {
          name:'Floyd-Steinberg',
          value:'FloydSteinberg'
        },
        {
          name:'False Floyd-Steinberg',
          value:'FalseFloydSteinberg'
        },
        {
          name:'Stucki',
          value:'Stucki'
        },
        {
          name:'Atkinson',
          value:'Atkinson'
        },
        {
          name:'Jarvis',
          value:'Jarvis'
        },
        {
          name:'Burkes',
          value:'Burkes'
        },
        {
          name:'Sierra',
          value:'Sierra'
        },
        {
          name:'Two Sierra',
          value:'TwoSierra'
        },
        {
          name:'Sierra Lite',
          value:'SierraLite'
        },
      ],
      formPreparation:{
        maxWidth:640,
        maxHeight:640,
        fileList:[],
        paletteMode:'adaptive',
        colorCount:16,
        palette:[],
        initialColor:[],
        ditherMethod:null
      },
      loading:false,
      reader:undefined,
      displayResult:false,
    };
  },
  created(){
    let initialColor=[];
    for(var i=0;i<27;i++){
      let values=[0x00,0x7f,0xff];
      let r = values[Math.floor(i/9)%3], g = values[Math.floor(i/3)%3], b = values[i%3];
      initialColor.push([r,g,b]);
    }
    this.formPreparation.initialColor=initialColor;
  },
  computed:{
    allowProcessImage(){
      if('fixed'==this.formPreparation.paletteMode
        && 0==this.formPreparation.palette.length){
        return false;
      }
      if('kmeans'==this.formPreparation.paletteMode
        && 0==this.formPreparation.initialColor.length){
        return false;
      }
      return !this.loading && this.formPreparation.fileList.length;
    }
  },
  watch:{
    'formPreparation.fileList'(){
      this.$refs.formPreparation.clearValidate('fileList');
    },
    'formPreparation.palette'(value){
      console.log('>',value);
    }
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
        center:true
      });
    },
    onSaveFile(e){
      let filename = 'IMG_'+fecha.format(new Date(), 'YYYYMMDD_HHmmss.png');
      saveAs(this.$refs.canvasImage.toDataURL('image/png'), filename);
    },
    goBack(){
      this.displayResult = false;
      this.$nextTick(()=>{
        this.resetForm();
      });
    },
    resetForm(){
      this.$refs.fileUpload.clearFiles();
      this.formPreparation.fileList=[];
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
    window.addEventListener('resize', resizeCanvas);

    var reader = new FileReader();
    this.reader = reader;
    var image = new Image();

    reader.addEventListener('load', (event)=>{
      image.src = event.target.result;
    });
    var vm = this;
    image.addEventListener('load', function(e){
      //Downscale image according to maximum size specified
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

      //Specify options
      let opts={};
      switch(vm.formPreparation.paletteMode){
        case 'adaptive':
          opts.colors=vm.formPreparation.colorCount;
        break;
        case 'fixed':
          Object.assign(opts,{
            colors:vm.formPreparation.palette.length,
            palette:vm.formPreparation.palette
          });
        break;
        case 'kmeans':
          let palette=KMeans(vm.formPreparation.initialColor,imageData);
          Object.assign(opts,{
            colors:palette.length,
            palette
          });
        break;
      }

      //Start processing image
      var q=new RGBQuant(opts);
      q.sample(imageData);
      var result=q.reduce(imageData,1,vm.formPreparation.ditherMethod,true);
      for(let i=0; i<result.length; i++){
        imageData.data[i]=result[i];
      }
      ctx.putImageData(imageData,0,0);

      //Show result
      vm.displayResult = true;
      vm.$nextTick(()=>{
        resizeCanvas();
        vm.loading = false;
      })
    });
    image.addEventListener('error',(e)=>{
      console.error(e);
      vm.loading = false;
      vm.resetForm();
      vm.$message.error('图片加载失败！');
    });
  }
}

