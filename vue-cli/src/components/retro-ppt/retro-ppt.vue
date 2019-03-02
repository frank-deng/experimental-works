<template>
  <div class='retro-ppt'>
    <el-form label-width='80px' size='small'>
      <el-form-item label='图片文件'>
        <el-upload action='' class='fileUpload'
          ref='fileUpload'
          list-type='picture'
          :multiple='true'
          :show-file-list='true'
          :auto-upload='false'
          :on-change='updateFileList'
          :on-remove='updateFileList'>
          <el-button>打开</el-button>
        </el-upload>
      </el-form-item>
    </el-form>
    <ul class='resultList'>
      <li v-for='file of fileList'>
        {{file.name}}
        <processImage :image='file.raw'></processImage>
      </li>
    </ul>
  </div>
</template>
<style scoped>
.retro-ppt{
  margin:10px;
}
.resultList{
  list-style:none;
  padding:0;
}
</style>
<script src='./retro-ppt.js'></script>
