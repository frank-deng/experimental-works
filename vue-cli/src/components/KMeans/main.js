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
		  stat: false,
      reader: undefined,
	  };
  },
	methods:{
		onUploadFile: function(file){
      if (!this.reader){
        return;
      }
			this.reader.readAsDataURL(file);
			this.stat = 'loading';
      return false;
		},
		onSaveFile: function(e){
			var dataURL = this.$refs.canvasImage.toDataURL('image/jpeg', 'image/jpeg');
			var link = document.createElement("a");
			link.href = dataURL;
			link.download = 'IMG_'+fecha.format(new Date(), 'YYYYMMDD_HHMMSS.jpg');
			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);
			window.URL.revokeObjectURL(dataURL);
		},
	},
  mounted(){
    var resizeCanvas = ()=>{
      var canvas = this.$refs.canvasImage;
      var body = document.getElementById('image_area');
      var destSize = fitRect(body.offsetWidth - 2, body.offsetHeight - 2, canvas.width, canvas.height);
      canvas.style.width = `${destSize.width}px`;
      canvas.style.height = `${destSize.height}px`;
    };

    var vm = this;
    var reader = new FileReader();
    this.reader = reader;
    var image = new Image();
    var kmeansWorker = new KMeansWorker();

    reader.addEventListener('load', function(event){
      image.src = event.target.result;
    });
    image.addEventListener('load', function(){
      var destSize = fitRect(1024, 1024, this.width, this.height)
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
      kmeansWorker.postMessage({imageData:imageData});
    });
    kmeansWorker.addEventListener('message', function(resp){
      if (resp.data.message){
        alert(resp.data.message);
        return;
      }
      var ctx = vm.$refs.canvasImage.getContext('2d');
      ctx.putImageData(resp.data.imageData, 0, 0);
      vm.stat = 'ok';
      resizeCanvas();
    });
    image.addEventListener('error', function(){
      vm.stat = 'failed';
    });
    window.addEventListener('resize', resizeCanvas);
  },
}

