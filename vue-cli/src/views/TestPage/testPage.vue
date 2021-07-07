<template>
  <div class='testPage'>
    <el-button @click='openDialog'>开对话框了</el-button>
    <Dialog :visible='dialogVisible'>
      <p>哈哈哈哈</p>
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
import Dialog from '@/components/dialog';
export default{
  components:{
    Dialog
  },
  data(){
    return{
      dialogVisible:false
    };
  },
  mounted(){
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
