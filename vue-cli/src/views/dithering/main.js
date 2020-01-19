import {saveAs} from 'file-saver';
import fecha from 'fecha';
import {fitRect as _fitRect} from '@/components/common.js';
import RGBQuant from 'rgbquant';

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
        ditherMethod:null,
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
          ],
          maxHeight:[
            {required:true, message:'请填写图片最大宽度'},
          ],
          colorCount:[
            {required:true, message:'请填写颜色数'}
          ]
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
      let filename = 'IMG_'+fecha.format(new Date(), 'YYYYMMDD_HHMMSS.png');
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
      let opts={
        colors:vm.formPreparation.colorCount
      };

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
  }
}

