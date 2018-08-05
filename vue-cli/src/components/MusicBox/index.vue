<template>
	<div class='WebAudioAPI'>
		<el-row>
			<el-col :span='24'>
				<p class='itemTitle'>类型</p>
				<el-select v-model="soundType" :disabled='running'>
					<el-option label='方波' value='square'></el-option>
					<el-option label='三角波' value='triangle'></el-option>
					<el-option label='正弦波' value='sine'></el-option>
					<el-option label='锯齿波' value='sawtooth'></el-option>
				</el-select>
			</el-col>
			<el-col :span='24'>
				<p class='itemTitle'>乐曲</p>
				<el-input type="textarea" :rows="3" v-model="song" :disabled='running'></el-input>
			</el-col>
			<el-col :span='24'>
				<p class='itemTitle'>音量</p>
				<el-slider v-model="volume" :min='0' :max='1' :step='0.001' :show-tooltip='false'></el-slider>
			</el-col>
			<el-col :span='24'><el-button type='primary' @click='togglePlay'>{{running ? '停止' : '播放'}}</el-button></el-col>
		</el-row>
	</div>
</template>
<script src='./main.js'></script>
<style scoped>
.itemTitle{
	display: block;
	margin: 2px 0;
	padding: 0;
}
.el-slider{
	margin: 0 12px;
}
.el-col {
	margin: 6px 0;
}
.WebAudioAPI {
	padding: 10px;
}
</style>
