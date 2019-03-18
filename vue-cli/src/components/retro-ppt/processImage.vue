<template>
  <div class='processImageContainer'>
    <div class='processingIndicator' v-show='!result'>
      <div class='tableDisplay'><div class='tableInner'>
        <i class='el-icon-loading'></i>
      </div></div>
    </div>
    <canvas class='targetImage' ref='targetImage' width=640 height=200 @click='doPreview'></canvas>
    <el-dialog :append-to-body='true' width='680px' top='20px' v-if='preview' :visible.sync='preview'>
      <canvas class='targetImagePreview' ref='targetImagePreview' width=640 height=400 @click='doPreview'></canvas>
      <el-button-group>
        <el-button size='small' icon='el-icon-download' @click='saveImage'>下载PNG</el-button>
        <el-button size='small' icon='el-icon-download' @click='saveImageCGA'>下载PIC</el-button>
      </el-button-group>
    </el-dialog>
  </div>
</template>
<style scoped>
.processImageContainer{
  position:relative;
  width:102px;
  height:64px;
  border:1px solid #808080;
}
.targetImage{
  width:100px;
  height:62px;
  cursor:pointer;
}
.targetImagePreview{
  width:640px;
  height:400px;
  border:1px solid #808080;
}
.processingIndicator{
  position:absolute;
  left:0;
  right:0;
  top:0;
  bottom:0;
  background:#ffffff;
}
.processingIndicator .tableDisplay{
  display:table;
  width:100%;
  height:100%;
}
.processingIndicator .tableInner{
  display:table-cell;
  width:100%;
  height:100%;
  text-align:center;
  vertical-align:middle;
}
</style>
<script src='./processImage.js'></script>
