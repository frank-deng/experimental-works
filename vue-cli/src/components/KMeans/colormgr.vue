<template>
  <div>
    <el-button v-if='!editing' @click='startEditing'>编辑初始颜色</el-button>
    <div v-if='editing'>
      <ul>
        <li class='colorItem' v-for='(color,idx) of colors' :key='idx'>
          <el-color-picker v-model='color.value' @change='checkColor(idx, $event)'></el-color-picker>
        </li>
      </ul>
      <el-button-group><!--
        --><el-button class='textButton' type='text' icon='el-icon-plus' @click='addColor'></el-button><!--
        --><el-button class='textButton' type='text' icon='el-icon-refresh' @click='resetColors'></el-button><!--
        --><el-button class='textButton' type='text' icon='el-icon-download' @click='downloadPalette'></el-button><!--
      --></el-button-group><!--
      --><el-upload action='' class='paletteUpload'
        :multiple='false'
        :limit='1'
        :show-file-list='false'
        :auto-upload='true'
        :before-upload='handlePaletteUpload' >
        <el-button class='textButton' type='text' icon='el-icon-upload2' @click='resetColors'></el-button>
      </el-upload>
    </div>
  </div>
</template>
<style scoped>
ul{
  overflow:auto;
}
li{
  list-style:none;
}
.el-color-picker{
  vertical-align:top;
}
.colorItem{
  float:left;
  margin:0 4px 4px 0;
}
.paletteUpload{
  display:inline-block;
}
.textButton{
  width:40px;
}
</style>
<script src='./colormgr.js'></script>

