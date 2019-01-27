<template>
  <div>
    <drawPad class='drawPad' ref='drawPad' :width='320' :height='320'></drawPad>
    <div class='toolBox'>
      <el-button size='tiny' @click='clearDrawPad'>Clear</el-button>
    </div>
  </div>
</template>
<style>
.drawPad{
  display:block;
  margin:auto;
  border:1px solid #409EFF;
  border-radius:2px;
}
.toolBox{
  text-align:center;
  margin-top:10px;
}
</style>
<script src='./main.js'></script>

