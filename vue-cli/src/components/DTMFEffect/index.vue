<template>
	<div class='mainFrame'>
		<el-row>
			<el-col :span='24'>
				<p class='itemTitle'>音量</p>
				<el-slider v-model="volume" :min='0' :max='1' :step='0.001' :show-tooltip='false'></el-slider>
			</el-col>
		</el-row>
		<el-row class='dialPad' :gutter='2'>
			<el-col	:span='8'>
				<div class='dialBtn' @mousedown='dial("7")' @touchstart='dial("7")' @mouseup='dial()' @touchend='dial()'>7</div>
			</el-col>
			<el-col	:span='8'>
				<div class='dialBtn' @mousedown='dial("8")' @touchstart='dial("8")' @mouseup='dial()' @touchend='dial()'>8</div>
			</el-col>
			<el-col	:span='8'>
				<div class='dialBtn' @mousedown='dial("9")' @touchstart='dial("9")' @mouseup='dial()' @touchend='dial()'>9</div>
			</el-col>
			<el-col	:span='8'>
				<div class='dialBtn' @mousedown='dial("4")' @touchstart='dial("4")' @mouseup='dial()' @touchend='dial()'>4</div>
			</el-col>
			<el-col	:span='8'>
				<div class='dialBtn' @mousedown='dial("5")' @touchstart='dial("5")' @mouseup='dial()' @touchend='dial()'>5</div>
			</el-col>
			<el-col	:span='8'>
				<div class='dialBtn' @mousedown='dial("6")' @touchstart='dial("6")' @mouseup='dial()' @touchend='dial()'>6</div>
			</el-col>
			<el-col	:span='8'>
				<div class='dialBtn' @mousedown='dial("1")' @touchstart='dial("1")' @mouseup='dial()' @touchend='dial()'>1</div>
			</el-col>
			<el-col	:span='8'>
				<div class='dialBtn' @mousedown='dial("2")' @touchstart='dial("2")' @mouseup='dial()' @touchend='dial()'>2</div>
			</el-col>
			<el-col	:span='8'>
				<div class='dialBtn' @mousedown='dial("3")' @touchstart='dial("3")' @mouseup='dial()' @touchend='dial()'>3</div>
			</el-col>
			<el-col	:span='8'>
				<div class='dialBtn' @mousedown='dial("*")' @touchstart='dial("*")' @mouseup='dial()' @touchend='dial()'>*</div>
			</el-col>
			<el-col	:span='8'>
				<div class='dialBtn' @mousedown='dial("0")' @touchstart='dial("0")' @mouseup='dial()' @touchend='dial()'>0</div>
			</el-col>
			<el-col	:span='8'>
				<div class='dialBtn' @mousedown='dial("#")' @touchstart='dial("#")' @mouseup='dial()' @touchend='dial()'>#</div>
			</el-col>
		</el-row>
	</div>
</template>
<style scoped>
.mainFrame {
	position: relative;
	width: 100%;
	height: 100%;
}
.itemTitle{
	display: block;
	margin: 2px 0;
	padding: 0;
}
.dialBtn {
	display: block;
	width: 100%;
	line-height: 100%;
	background-color: rgb(64,158,255);
	color: #ffffff;
	text-align: center;
	font-size: 24px;
	border-radius: 4px;
	cursor: pointer;
	user-select: none;
}
.dialPad {
	position: absolute;
	bottom: 0;
	left: 1px;
	right: 1px;
	top: 60px;
}
.el-col {
	margin-bottom: 2px;
}
.el-slider{
	margin: 0 12px;
}
</style>
<script src="./main.js"></script>
