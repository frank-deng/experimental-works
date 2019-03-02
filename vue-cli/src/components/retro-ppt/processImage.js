export default{
  props:{
    image:null,
  },
  data(){
    return{
    };
  },
  watch:{
    image:{
      immediate:true,
      handler(image){
        if(!(image instanceof File)){
          console.error('Invalid type of image object.');
          return;
        }
        this.$nextTick(()=>{
          this.processImage();
        });
      },
    },
  },
  methods:{
    processImage(){
      var vm = this;
      return new Promise((resolve,reject)=>{
        let reader = new FileReader();
        let image = new Image();
        reader.addEventListener('load', (event)=>{
          image.src = event.target.result;
        });
        image.addEventListener('load', function(e){
          resolve(image);
        });
        image.addEventListener('error', ()=>{
          reject('图片加载失败');
        });
        reader.readAsDataURL(this.image);
      }).then((imageObject)=>{
        let targetWidth = this.$refs.targetImage.width;
        let targetHeight = this.$refs.targetImage.height;
        let ctx = this.$refs.targetImage.getContext('2d');
        ctx.drawImage(imageObject,
          0, 0, imageObject.width, imageObject.height,
          0, 0, targetWidth, targetHeight
        );
      });
    },
  },
}
