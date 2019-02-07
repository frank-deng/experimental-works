<template>
  <ul>
    <li v-for='(color,idx) of colors' :key='idx'>
      <el-color-picker v-model='color.value' @change='update'></el-color-picker>
      <span class='colorDisp' v-text='color.value'></span>
      <el-button type='text' icon='el-icon-delete' @click='deleteColor(idx)'></el-button>
    </li>
    <li>
      <el-button class='buttonAdd' type='text' icon='el-icon-plus' @click='addColor'></el-button>
    </li>
  </ul>
</template>
<style scoped>
li{
  list-style:none;
  margin-bottom:4px;
}
.el-color-picker{
  vertical-align:top;
}
.colorDisp{
  display:inline-block;
  min-width:80px;
}
.buttonAdd{
  width:40px;
}
</style>
<script src='./colormgr.js'></script>

