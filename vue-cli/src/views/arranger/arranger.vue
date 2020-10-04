<template>
  <div class='arranger'>
    <ul>
      <li v-for='task of arrangedResult' :key='task.id'>{{task.name}}</li>
    </ul>
  </div>
</template>
<style scoped lang='less'>
.arranger{
  padding:10px;
  li{
    display:inline-block;
    margin-right:20px;
    vertical-align:top;
  }
}
</style>
<script src='./arranger.js'></script>

