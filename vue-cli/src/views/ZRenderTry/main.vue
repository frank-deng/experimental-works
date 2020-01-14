<template>
  <div class='zrender-try'>
    <div class='zr-container' ref='zrContainer'></div>
    <el-button size='mini' @click='glitch'>Giltch</el-button>
    <el-button size='mini' @click='animate'>Animate</el-button>
  </div>
</template>
<style scoped>
.zr-container{
  width:640px;
  height:480px;
  border:1px solid #000;
  margin:auto;
}
</style>
<script src='./main.js'></script>

