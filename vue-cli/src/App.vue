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
  top: 0;
  bottom: 30%;
  padding: 8px;
}
ul, li{
	margin: 0;
	padding: 0;
}
#logger_element{
	display:block;
	position:fixed;
	left:0;
	right:0;
	bottom:0;
	height:30%;
	font-size:1em;
	line-height:1.1em;
	font-family:monospace;
	font-weight:normal;
	color:#000;
	background-color:#ecf5ff;
	border-top: 1px solid #b3d8ff;
	margin:0;
	padding:0;
	z-index: 100;
}
</style>

