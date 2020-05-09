<template>
  <div class='zonePlate' ref='zonePlateContainer'>
    <canvas class='zonePlateCanvas' ref='zonePlateCanvas' width='320' height='200'></canvas>
  </div>
</template>
<style scoped lang='less'>
.zonePlate{
  width:100%;
  height:100%;
}
.zonePlateCanvas{
  display:block;
  position:absolute;
  left:0;
  right:0;
  top:0;
  bottom:0;
  width:100%;
  height:100%;
}
</style>
<script src='./zonePlate.js'></script>

