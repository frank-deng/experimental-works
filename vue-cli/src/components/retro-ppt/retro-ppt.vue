<template>
  <div class='retro-ppt'>
    <p class='toolBox'>
      <addImage class='toolBoxItem' @upload='newImage'></addImage>
      <el-button class='toolBoxItem' type='primary' icon='el-icon-download' size='small' @click='exportAllAsZip'>导出为zip</el-button>
      <draftManager class='toolBoxItem' v-model='imageList'></draftManager>
      <el-button class='toolBoxItem' type='danger' icon='el-icon-delete' size='small' @click='clearAllImage'>清空</el-button>
    </p>
    <el-tabs v-model='currentPage'>
      <el-tab-pane label='列表' name='list'>
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
                :file='scope.row.file'
                :layout='scope.row.layout'
                :backgroundColor='scope.row.backgroundColor'
                :dither='scope.row.dither'
                @change='writeResult(scope.row, $event)'
                @preview='doPreview(scope.row, scope.$index)'></processImage>
            </template>
          </el-table-column>
          <el-table-column align='left' min-width='150'>
            <template slot-scope='scope'>
              <el-button-group>
                <el-button size='small' icon='el-icon-caret-top' @click='moveUpImage(scope.$index)'
                  :disabled="scope.$index<=0"></el-button>
                <el-button size='small' icon='el-icon-caret-bottom' @click='moveDownImage(scope.$index)'
                  :disabled="scope.$index>=(imageList.length-1)"></el-button>
                <el-button size='small' type='danger' icon='el-icon-delete' @click='deleteImage(scope.$index)'></el-button>
              </el-button-group>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
      <el-tab-pane :label='`预览（${pageIndex+1}/${imageList.length}）`' name='preview' :disabled='0==imageList.length' ref='previewContainer'>
        <div class='previewContainer'>
          <canvas class='targetImagePreview' ref='targetImagePreview' width=640 height=400></canvas>
        </div>
      </el-tab-pane>
    </el-tabs>
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
.toolBoxItem{
  margin-bottom:4px;
}
.targetImagePreview{
  width:640px;
  height:400px;
  border:1px solid #808080;
}
.previewContainer{
  overflow:auto;
}
</style>
<script src='./retro-ppt.js'></script>
