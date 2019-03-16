<template>
  <div class='retro-ppt'>
    <addImage @upload='newImage'></addImage>
    <el-button type='primary' icon='el-icon-download' size='small' @click='exportAllAsZip'>导出为zip</el-button>
    <el-button type='primary' icon='el-icon-download' size='small' @click='saveDraft'>保存草稿</el-button>
    <el-table :data='imageList' row-key='id'>
      <el-table-column prop='layout' label='布局方式' width='100'>
        <template slot-scope='scope'>
          <el-select v-model='scope.row.layout'>
            <el-option v-for='item of layoutSelection' :key='item.value' :value='item.value' :label='item.label'></el-option>
          </el-select>
        </template>
      </el-table-column>
      <el-table-column prop='layout' label='背景色' width='100'>
        <template slot-scope='scope'>
          <el-select v-model='scope.row.backgroundColor'>
            <el-option v-for='item of colorSelection' :key='item.value' :value='item.value' :label='item.label'></el-option>
          </el-select>
        </template>
      </el-table-column>
      <el-table-column prop='dither' label='抖动方式' width='150'>
        <template slot-scope='scope'>
          <el-select v-model='scope.row.dither'>
            <el-option v-for='item of ditherSelection' :key='item.value' :value='item.value' :label='item.label'></el-option>
          </el-select>
        </template>
      </el-table-column>
      <el-table-column label='预览' width='140'>
        <template slot-scope='scope'>
          <processImage
            :src='scope.row.dataURL'
            :layout='scope.row.layout'
            :backgroundColor='scope.row.backgroundColor'
            :dither='scope.row.dither'
            @change='writeResult(scope.row, $event)'></processImage>
        </template>
      </el-table-column>
      <el-table-column align='left' min-width='150'>
        <template slot-scope='scope'>
          <el-button-group>
            <el-button size='small' icon='el-icon-caret-top' @click='moveUpImage(scope.$index)'
              :disabled="scope.$index<=0"></el-button>
            <el-button size='small' icon='el-icon-caret-bottom' @click='moveDownImage(scope.$index)'
              :disabled="scope.$index>=(imageList.length-1)"></el-button>
            <el-button size='small' icon='el-icon-delete' @click='deleteImage(scope.$index)'></el-button>
          </el-button-group>
        </template>
      </el-table-column>
    </el-table>
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
