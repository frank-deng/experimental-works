<template>
  <div>
    <canvas class='targetImage' ref='targetImage' width=640 height=200 @click='doPreview'></canvas>
    <el-dialog :append-to-body='true' width='680px' top='20px' v-if='preview' :visible.sync='preview'>
      <canvas class='targetImagePreview' ref='targetImagePreview' width=640 height=400 @click='doPreview'></canvas>
    </el-dialog>
  </div>
</template>
<style scoped>
.targetImage{
  width:160px;
  height:100px;
  cursor:pointer;
}
.targetImagePreview{
  width:640px;
  height:400px;
  border:1px solid #808080;
}
</style>
<script src='./processImage.js'></script>
