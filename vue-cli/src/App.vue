<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  overflow: auto;
  position: fixed;
  left: 0;
  right: 0;
  top: 34px;
  bottom: 0;
  padding: 0;
  margin: 0;
}
ul, li{
	margin: 0;
	padding: 0;
}
#__vconsole .vc-switch{
  right:0;
  top:0;
  bottom:auto;
}
</style>

