<template>
  <div>
    <div class='drawPadContainer'>
      <drawPad ref='drawPad' :width='320' :height='320' @click='doPlaceCar'></drawPad>
      <car ref='car'></car>
    </div>
    <div class='toolBox'>
      <span>速度：</span><!--
      --><el-select v-model='delay' class='speedSel'>
        <el-option label='慢' :value='300'></el-option>
        <el-option label='中' :value='100'></el-option>
        <el-option label='快' :value='50'></el-option>
        <el-option label='很快' :value='10'></el-option>
      </el-select>
      <el-button-group>
        <el-button size='tiny' @click='clearDrawPad'>清空画板</el-button>
        <el-button size='tiny' :disabled='placeCar' @click='enterPlaceCarMode'>放置小车</el-button>
      </el-button-group>
    </div>
    <div class='miscBox'>
      <p>地面相机：
        <canvas class='groundCamera' ref='groundCamera' width='64' height='64'></canvas>
      </p>
      <p>分析结果：{{analyzerResult}}</p>
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
.speedSel{
  width:80px;
}
.miscBox{
  display:none;
  text-align:center;
}
.miscBox canvas{
  border:1px solid #409EFF;
  border-radius:2px;
  vertical-align:middle;
}
</style>
<script src='./main.js'></script>

