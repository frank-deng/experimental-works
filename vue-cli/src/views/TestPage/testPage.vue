<template>
  <div class='testPage'>
    <div class='graphContainerOuter'>
      <div class='graphContainer' ref='graphContainer'></div>
    </div>
  </div>
</template>
<style scoped>
.graphContainerOuter{
  overflow:auto;
}
.graphContainer{
  width:1000px;
  height:600px;
  margin:auto;
}
.drawCanvas{
  display:block;
  margin:0 auto;
  width:600px;
  height:600px;
  border:1px solid #000000;
}
</style>
<script src='./testPage.js'></script>
