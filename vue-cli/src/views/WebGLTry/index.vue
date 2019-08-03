<template>
	<div class='main-container'>
		<div id='webgl_container' ref="webglContainer">
			<div id='comment_2d' ref="comment2d">Hahaha~~~</div>
		</div>
	</div>
</template>
<style scoped>
.main-container {
	position: relative;
	width: 100%;
	height: 100%;
	overflow: hidden;
}
#webgl_container{
	position: absolute;
	left:0;
	right:0;
	top:0;
	bottom:0;
}
#comment_2d{
	position: absolute;
	display:block;
	left:0;
	top:0;
	color:#000;
	background-color:rgba(255,127,255,0.5);
	border:1px solid #000;
	border-radius:6px;
	z-index: 1000;
}
</style>
<script src='./main.js'></script>

