<template>
  <div>
    <div class='drawPadContainer'>
      <drawPad ref='drawPad' :width='320' :height='320'></drawPad>
      <car ref='car'></car>
    </div>
    <div class='toolBox'>
      <el-button size='tiny' @click='clearDrawPad'>Clear</el-button>
    </div>
  </div>
</template>
<style scoped>
.drawPadContainer{
  display:block;
  margin:auto;
  border:1px solid #409EFF;
  border-radius:2px;
  position:relative;
  width:320px;
  height:320px;
}
.toolBox{
  text-align:center;
  margin-top:10px;
}
</style>
<script src='./main.js'></script>

