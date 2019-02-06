import fecha from 'fecha';
import KMeansWorker from './kmeans.worker.js';

function fitRect(wdest, hdest, wsrc, hsrc) {
	if (wsrc <= wdest && hsrc <= hdest) {
		return {
			width: wsrc,
			height: hsrc,
		};
	}

	var ratioSrc = wsrc / hsrc, ratioDest = wdest / hdest;
	var scale = (ratioSrc > ratioDest) ? (wsrc / wdest) : (hsrc / hdest);
	return {
		width: wsrc / scale,
		height: hsrc / scale,
	};
}
String.prototype.lpad = function(padstr, length) {
	var str = this;
	while (str.length < length) {
		str = padstr + str;
	}
	return str;
}
export default {
	data(){
    return{
      formPreparation:{
        maxWidth:640,
        maxHeight:640,
        dither:false,
        fileList:[],
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
        },
      },
      loading:undefined,
      reader:undefined,
		  displayResult:false,
	  };
  },
	methods:{
    doProcessFile(){
      this.$refs.formPreparation.validate((valid)=>{
        if(!valid){
          return;
        }
        this.$refs.fileUpload.submit();
      });
    },
    updateFileList(file, fileList){
      this.formPreparation.fileList = fileList;
    },
		onUploadFile(file){
      if(!this.reader){
        return;
      }
      this.loading = this.$loading.service({
        fullscreen:true,
        text:'正在处理中……',
        background:'#333333',
      });
			this.reader.readAsDataURL(file);
      this.formPreparation.filelist = [];
      return false;
		},
		onSaveFile(e){
			var dataURL = this.$refs.canvasImage.toDataURL('image/jpeg', 'image/jpeg');
			var link = document.createElement("a");
			link.href = dataURL;
			link.download = 'IMG_'+fecha.format(new Date(), 'YYYYMMDD_HHMMSS.jpg');
			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);
			window.URL.revokeObjectURL(dataURL);
		},
    goBack(){
      this.displayResult = false;
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
      });
    });
    image.addEventListener('error', ()=>{
      if(vm.loading){
        vm.loading.close();
      }
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
        if(this.loading){
          this.loading.close();
        }
      })
    });
    window.addEventListener('resize', resizeCanvas);
  },
}

