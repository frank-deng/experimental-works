<template>
  <div class='ucfonts'>
    <div v-for='item of offsetList'>
      <span>{{item.offset.toString(16)}}</span>
      <span>{{item.length}}</span>
      <charData v-if='item.length' :fontData='item.buffer'></charData>
    </div>
  </div>
</template>
<script src='./index.js'></script>