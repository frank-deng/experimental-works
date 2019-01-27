<template>
  <div id="app">
    <div class='masterMenuBar'>
      <el-button type='text' icon='el-icon-menu' @click='backToMenu'></el-button>
      <el-button type='text' icon='el-icon-setting' @click='showVConsole'></el-button>
    </div>
    <router-view class='routerView'/>
  </div>
</template>

<script>
export default {
  name: 'App',
  methods:{
    backToMenu(){
      this.$router.push('/');
    },
    showVConsole(){
      self.vConsole.show();
    },
  },
}
</script>

<style>
body{
  overscroll-behavior: contain;
}
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  overflow: auto;
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  padding: 0;
  margin: 0;
}
ul, li{
	margin: 0;
	padding: 0;
}
#__vconsole .vc-switch{
  display:none;
}
.routerView{
  position: absolute;
  left: 0;
  right: 0;
  top: 32px;
  bottom: 0;
}
.masterMenuBar{
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  height: 32px;
  overflow:auto;
}
.masterMenuBar .el-button{
  display:block;
  float:left;
  line-height:32px;
  width:32px;
  border:none;
  margin:0;
  padding:0;
}
</style>

