<template>
  <div class='KMeansMainFrame'>
			<div class='main-menu'>
        <el-upload
          class='uploadImage'
          action=''
          :multiple='false'
          :limit='1'
          :show-file-list='false'
          :before-upload='onUploadFile'>
          <el-button type='primary'>上传图片文件</el-button>
        </el-upload><!--
				--><el-button type='primary' v-show='stat == "ok"' @click='onSaveFile'>下载图片</el-button>
			</div>
			<div class='image-area' id='image_area'>
				<p class='status' v-show='stat == "loading"'>Processing...</p>
				<p class='status' v-show='stat == "failed"'>Failed to load image.</p>
				<canvas width='16' height='16' class='show-image' v-show='stat == "ok"' ref='canvasImage'></canvas>
			</div>
  </div>
</template>
<style scoped>
.uploadImage{
  display:inline-block;
}
#image_area{
  position:absolute;
  left:0;
  right:0;
  bottom:0;
  top:40px;
}
</style>
<script src='./main.js'></script>
