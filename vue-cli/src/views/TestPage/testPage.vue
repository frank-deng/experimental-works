<template>
  <div class='testPage'>
    <el-button @click='openDialog'>开对话框了</el-button>
    <Dialog :visible='dialogVisible' destroyOnClose>
      <p>哈哈哈哈</p>
      <input v-model='inputContent'/>
      <p>{{inputContent}}</p>
      <el-button @click='closeDialog'>关闭</el-button>
    </Dialog>
  </div>
</template>
<style scoped>
.graphContainerOuter{
  overflow:auto;
}
.graphContainer{
  width:1000px;
  height:600px;
  margin:auto;
}
.drawCanvas{
  display:block;
  margin:0 auto;
  width:600px;
  height:600px;
  border:1px solid #000000;
}
</style>
<script>
import linefold from 'linefold';
import Dialog from '@/components/dialog';
export default{
  components:{
    Dialog
  },
  data(){
    return{
      dialogVisible:false,
      showPopup:false,
      inputContent:'inputContent'
    };
  },
  watch:{
    inputContent(){
      console.log(this.inputContent);
    }
  },
  mounted(){
    var text1='根据给定的文本、最大宽度、字体等条件，对一段文本进行换行操作。然后渲染到一些不支持自动换行的环境上，比如HTML5 Canvas。';
    var text='Convert given text into folded lines with given font and maximum width before rendering, so as to render paragraphs onto platforms without line-folding support, e.g. HTML5 Canvas.';
	  var lines=linefold(text,320,'16px Times New Roman');
    var lines2=linefold(text,36,(text)=>{
      let len=0;
      for(let char of text){
        len += (/[\u4E00-\u9FA5\u3000-\u303f\uFF01-\uFF5E]+/.test(char) ? 2 : 1);
      }
      return len;
    });
    //console.log(lines);
    console.log(JSON.stringify(lines2,null,2));
  },
  methods:{
    openDialog(){
      this.dialogVisible=true;
    },
    closeDialog(){
      this.dialogVisible=false;
    }
  }
}
</script>
