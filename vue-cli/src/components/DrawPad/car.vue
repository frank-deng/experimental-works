<template>
	<div class='car' :style='carStyle'>
		<img src='@/assets/car-in-top-view-512x512.png'/>
	</div>
</template>
<style scoped>
.car{
	position:absolute;
  border:1px solid red;
  margin:-16px;
}
.car img{
	width:32px;
	height:32px;
	position:absolute;
  margin:-26px 0 0 -16px;
}
</style>
<script src='./car.js'></script>
