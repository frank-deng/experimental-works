<template>
  <div class='ucfonts'>
    <div v-for='item of offsetList'>
      <span>{{item.offset.toString(16)}}</span>
      <span>{{item.length}}</span>
    </div>
  </div>
</template>
<script src='./index.js'></script>