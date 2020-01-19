<template>
  <div class='colorEditor'>
    <div class='paletteEmpty' v-if='0==colors.length'>调色板为空，请添加颜色</div>
    <el-color-picker
      class='colorItem'
      v-for='(color,idx) of colors'
      :key='idx'
      v-model='color.value'
      @change='checkColor(idx, $event)'></el-color-picker>
    <div class='toolBox'>
      <el-button-group><!--
        --><el-button class='textButton' type='text' icon='el-icon-plus' @click='addColor'></el-button><!--
        --><el-button class='textButton' type='text' icon='el-icon-download' @click='downloadPalette'></el-button><!--
      --></el-button-group><!--
      --><el-upload action='' class='paletteUpload'
        :multiple='false'
        :limit='1'
        :show-file-list='false'
        :auto-upload='true'
        :before-upload='handlePaletteUpload'>
        <el-button class='textButton' type='text' icon='el-icon-upload2'></el-button>
      </el-upload>
    </div>
  </div>
</template>
<style scoped>
.editorContainer{
  overflow:hidden;
}
.colorItem{
  display:block;
  float:left;
  margin:0 4px 4px 0;
}
.paletteUpload{
  display:inline-block;
  vertical-align:middle;
}
.toolBox{
  clear:both;
}
.textButton{
  width:40px;
}
.paletteEmpty{
  color:#aaaaaa;
}
</style>
<script src='./colormgr.js'></script>

