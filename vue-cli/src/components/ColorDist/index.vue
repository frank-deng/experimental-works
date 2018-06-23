<template>
	<div class='main-container'>
		<div id='webgl_container' ref="webglContainer"></div>
		<div class='other-container'>
			<input type='file' ref='upload' @change='fileUploaded'/>
			<el-button type='primary' @click='doUpload'>上传</el-button>
		</div>
	</div>
</template>
<style scoped>
input[type='file']{
	display: none;
}
.other-container {
	position: relative;
	z-index: 1000;
}
#webgl_container{
	position: absolute;
	left: 0;
	right: 0;
	top: 0;
	bottom: 0;
}
#comment_2d{
	position:fixed;
	display:block;
	left:0;
	top:0;
	color:#000;
	background-color:rgba(255,127,255,0.5);
	border:1px solid #000;
	border-radius:6px;
}
</style>
<script src='./main.js'></script>

