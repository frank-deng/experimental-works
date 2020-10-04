<template>
	<div class='mainFrame'>
    <el-button
      v-for='(route, $index) of routeInfo' :key='route.name'
      type='primary'
      @click='navigate($index)'>{{route.name}}</el-button>
	</div>
</template>
<script src='./IndexPage.js'></script>
<style scoped lang='less'>
.mainFrame{
	padding: 8px;
  .el-button{
    margin: 0 4px 10px 4px;
  }
}
</style>
