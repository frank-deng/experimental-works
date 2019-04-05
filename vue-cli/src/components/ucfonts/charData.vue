<template>
  <div class='charData'>
    <!--div>
      <div v-for='line of steps'>{{line}}</div>
    </div-->
    <canvas ref='preview' width='256' height='256'></canvas>
  </div>
</template>
<style scoped>
canvas{
  border:1px solid #000000;
}
</style>
<script src='./charData.js'></script>
