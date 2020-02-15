<template>
  <div class='routerGuardMaster'>
    <p>主页面</p>
    <el-button @click='$router.push("/routerGuard/slave1")'>1</el-button>
    <el-button @click='$router.push("/routerGuard/slave2")'>2</el-button>
    <el-button @click='$router.push("/routerGuard/slave3")'>3</el-button>
    <div class='slaveContainer'>
      <router-view></router-view>
    </div>
  </div>
</template>
<style scoped>
.slaveContainer{
  border:1px solid #cccccc;
}
</style>
<script src='./master.js'></script>

