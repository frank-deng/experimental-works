export default{
  data(){
    return{
      display:false,
      resolve:null,
      reject:null,
      formData:{
        level:'novice',
        width:10,
        height:10,
        mines:10
      }
    };
  },
  computed:{
    customLevel(){
      return 'custom'==this.formData.level;
    },
    maxMines(){
      return this.formData.width * this.formData.height - 4;
    }
  },
  watch:{
    display(display){
      if(display){
        return;
      }
      if(this.resolve && this.reject){
        this.reject('cancel');
      }
      this.resolve=this.reject=null;
    }
  },
  methods:{
    open(){
      return new Promise((resolve,reject)=>{
        Object.assign(this,{
          resolve,
          reject,
          display:true
        });
      });
    },
    submit(){
      let resp=Object.assign({},this.formData);
      switch(resp.level){
        case 'novice':
          Object.assign(resp,{
            width:10,
            height:10,
            mines:10
          });
        break;
        case 'medium':
          Object.assign(resp,{
            width:16,
            height:16,
            mines:40
          });
        break;
        case 'expert':
          Object.assign(resp,{
            width:30,
            height:16,
            mines:99
          });
        break;
      }
      this.resolve(resp);
      Object.assign(this,{
        resolve:null,
        reject:null,
        display:false
      });
    },
    updateMines(){
      if(this.formData.mines>this.maxMines){
        this.formData.mines=this.maxMines;
      }
    }
  }
}
