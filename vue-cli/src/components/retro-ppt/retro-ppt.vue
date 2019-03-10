<template>
  <div class='retro-ppt'>
    <addImage @upload='newImage'></addImage>
    <el-table :data='imageList'>
      <el-table-column prop='fileName' label='文件名'></el-table-column>
      <el-table-column prop='layout' label='布局方式' :width='160'>
        <template slot-scope='scope'>
          <el-select v-model='scope.row.layout'>
            <el-option v-for='item of layoutSelection' :key='item.value' :value='item.value' :label='item.label'></el-option>
          </el-select>
        </template>
      </el-table-column>
      <el-table-column prop='dither' label='抖动方式' :width='200'>
        <template slot-scope='scope'>
          <el-select v-model='scope.row.dither'>
            <el-option v-for='item of ditherSelection' :key='item.value' :value='item.value' :label='item.label'></el-option>
          </el-select>
        </template>
      </el-table-column>
      <el-table-column fixed='right' width='160' align='right'>
        <template slot-scope='scope'>
          <el-button-group>
            <el-button size='small' icon='el-icon-arrow-up' @click='moveUpImage(scope.$index)'
              :disabled="scope.$index<=0"></el-button>
            <el-button size='small' icon='el-icon-arrow-down' @click='moveDownImage(scope.$index)'
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
