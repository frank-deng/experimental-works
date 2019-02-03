<template>
  <div>
    <div class='drawPadContainer'>
      <drawPad ref='drawPad' :width='320' :height='320'></drawPad>
      <car ref='car'></car>
    </div>
    <div class='toolBox'>
      <el-button size='tiny' @click='clearDrawPad'>Clear</el-button>
    </div>
    <div class='miscBox'>
      <p>地面相机：
        <canvas class='groundCamera' ref='groundCamera' width='64' height='64'></canvas>
        <canvas ref='groundCameraCrop' width='32' height='32'></canvas>
      </p>
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
.miscBox{
  text-align:center;
}
.miscBox canvas{
  border:1px solid #409EFF;
  border-radius:2px;
  vertical-align:middle;
}
.groundCamera{
  display:none;
}
</style>
<script src='./main.js'></script>

