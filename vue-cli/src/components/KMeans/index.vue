<template>
  <div class='KMeansMainFrame'>
    <el-form v-if="!displayResult"
      class='formPreparation'
      ref='formPreparation'
      :model='formPreparation'
      :rules='formPreparation._validation'
      label-width="110px">
      <el-form-item label="选择文件" prop='fileList'>
        <el-upload action='' class='fileUpload'
          ref='fileUpload'
          list-type='picture'
          :multiple='false'
          :limit='1'
          :show-file-list='true'
          :auto-upload='false'
          :on-change='updateFileList'
          :on-remove='updateFileList'
          :before-upload='onUploadFile'>
          <el-button>打开图片文件</el-button>
        </el-upload>
      </el-form-item>
      <el-form-item label="图片最大宽度" prop='maxWidth' class='imageSizeInput'>
        <el-input v-model.number='formPreparation.maxWidth'></el-input>
      </el-form-item>
      <el-form-item label="图片最大高度" prop='maxHeight' class='imageSizeInput'>
        <el-input v-model.number='formPreparation.maxHeight'></el-input>
      </el-form-item>
      <el-form-item label="图像抖动" prop='dither'>
        <el-switch v-model='formPreparation.dither'></el-switch>
      </el-form-item>
      <el-form-item label="初始颜色" prop='colors'>
        <colorManager v-model='formPreparation.colors'></colorManager>
      </el-form-item>
      </el-form-item>
        <el-button type='primary' @click='doProcessFile'>开始处理图片</el-button>
      </el-form-item>
    </el-form>
    <div v-show='displayResult'>
      <el-button type='primary' @click='onSaveFile'>下载图片</el-button><!--
      --><el-button @click='goBack'>返回</el-button>
      <div ref='imageArea' class='imageArea'>
        <canvas width='16' height='16' class='canvasImage' ref='canvasImage'></canvas>
      </div>
    </div>
  </div>
</template>
<style scoped>
.KMeansMainFrame{
  margin:10px;
}
.formPreparation{
  max-width:800px;
}
.imageArea{
  display:block;
  position:absolute;
  left:10px;
  right:10px;
  bottom:10px;
  top:60px;
}
.imageSizeInput{
  max-width:200px;
}
</style>
<style>
.dialogFailed{
  width:240px;
}
</style>
<script src='./main.js'></script>
