<template>
  <div class='draftManager'>
    <el-button-group>
      <el-button type='primary' icon='el-icon-upload2' size='small' @click='loadDraft'>打开草稿</el-button>
      <el-button type='primary' icon='el-icon-download' size='small' @click='saveDraft'>保存草稿</el-button>
    </el-button-group>
    <input type='file' class='filePicker' ref='filePicker' @change='handleChange' accept='.zip'/>
  </div>
</template>
<style scoped>
.draftManager{
  display:inline-block;
}
.filePicker{
  display:none;
}
</style>
<script src='./draftManager.js'></script>
