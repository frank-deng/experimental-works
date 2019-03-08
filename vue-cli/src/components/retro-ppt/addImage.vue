<template>
  <div class='addFile'>
    <el-button size='small' type='primary' icon='el-icon-plus' @click='pickImage'></el-button>
    <input type='file' class='filePicker' ref='filePicker' multiple='multiple' @change='handleChange'/>
  </div>
</template>
<style scoped>
.addFile{
  display:inline-block;
}
.filePicker{
  display:none;
}
</style>
<script src='./addImage.js'></script>
