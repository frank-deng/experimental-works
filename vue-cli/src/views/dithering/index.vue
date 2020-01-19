<template>
  <div class='KMeansMainFrame'>
    <el-form v-if="!displayResult"
      class='formPreparation'
      ref='formPreparation'
      :model='formPreparation'
      :rules='formPreparation._validation'
      :disabled='loading'
      size='small'
      label-width="110px">
      <el-form-item label="选择文件" prop='fileList'>
        <el-upload action='' class='fileUpload'
          ref='fileUpload'
          list-type='picture'
          :multiple='false'
          accept='image/*'
          :limit='1'
          :show-file-list='true'
          :auto-upload='false'
          :on-change='updateFileList'
          :on-remove='updateFileList'
          :on-exceed='noMoreFiles'>
          <el-button :disabled='!!formPreparation.fileList.length'>打开图片文件</el-button>
        </el-upload>
      </el-form-item>
      <el-form-item label="图片最大宽度" prop='maxWidth' class='imageSizeInput'>
        <el-input-number :min='2' v-model.number='formPreparation.maxWidth'></el-input-number>
      </el-form-item>
      <el-form-item label="图片最大高度" prop='maxHeight' class='imageSizeInput'>
        <el-input-number :min='2' v-model.number='formPreparation.maxHeight'></el-input-number>
      </el-form-item>
      <el-form-item label="颜色数" prop='paletteMode'>
        <el-radio-group v-model='formPreparation.paletteMode'>
          <el-radio v-for='item of paletteModeList'
            :key='item.value'
            :label='item.value'>{{item.name}}</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="颜色数" prop='colorCount'>
        <el-input-number v-model.number='formPreparation.colorCount' :min='2'></el-input-number>
      </el-form-item>
      <el-form-item label="图像抖动" prop='ditherMethod'>
        <el-select v-model='formPreparation.ditherMethod'>
          <el-option v-for='item of ditherMethodList'
            :key='item.value'
            :label='item.name'
            :value='item.value'></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type='primary' @click='doProcessFile' :disabled='loading' :icon='loading ? "el-icon-loading" : null'>
          {{loading ? "图片处理中" : "开始处理图片"}}
        </el-button>
      </el-form-item>
    </el-form>
    <div v-show='displayResult'>
      <el-button size='small' type='primary' @click='onSaveFile'>下载图片</el-button><!--
      --><el-button size='small' @click='goBack'>返回</el-button>
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
  width:100%;
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
