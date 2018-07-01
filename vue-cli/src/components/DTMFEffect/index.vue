<template>
	<div class='mainFrame'>
		<el-row>
			<el-col :span='24'>
				<p class='itemTitle'>音量</p>
				<el-slider v-model="volume" :min='0' :max='1' :step='0.001' :show-tooltip='false'></el-slider>
			</el-col>
		</el-row>
		<div class='dialPad' @touchend='dial()' @mouseup='dial()'>
			<div class='dialBtn' @mousedown='dial("7")' @touchstart='dial("7")'><i>7</i></div>
			<div class='dialBtn' @mousedown='dial("8")' @touchstart='dial("8")'><i>8</i></div>
			<div class='dialBtn' @mousedown='dial("9")' @touchstart='dial("9")'><i>9</i></div>
			<div class='dialBtn' @mousedown='dial("4")' @touchstart='dial("4")'><i>4</i></div>
			<div class='dialBtn' @mousedown='dial("5")' @touchstart='dial("5")'><i>5</i></div>
			<div class='dialBtn' @mousedown='dial("6")' @touchstart='dial("6")'><i>6</i></div>
			<div class='dialBtn' @mousedown='dial("1")' @touchstart='dial("1")'><i>1</i></div>
			<div class='dialBtn' @mousedown='dial("2")' @touchstart='dial("2")'><i>2</i></div>
			<div class='dialBtn' @mousedown='dial("3")' @touchstart='dial("3")'><i>3</i></div>
			<div class='dialBtn' @mousedown='dial("*")' @touchstart='dial("*")'><i>*</i></div>
			<div class='dialBtn' @mousedown='dial("0")' @touchstart='dial("0")'><i>0</i></div>
			<div class='dialBtn' @mousedown='dial("#")' @touchstart='dial("#")'><i>#</i></div>
		</div>
	</div>
</template>
<style scoped>
.el-slider{
	margin: 0 12px;
}
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
.dialPad {
	position: absolute;
	bottom: 0;
	left: 1px;
	right: 1px;
	top: 120px;
	overflow: auto;
}
.dialBtn {
	display: table;
	width: calc(33.3% - 2px);
	height: calc(25% - 2px);
	float: left;
	background-color: rgb(64,158,255);
	margin: 1px;
	border-radius: 4px;
	cursor: pointer;
	user-select: none;
}
.dialBtn i{
	display: table-cell;
	width: 100%;
	height: 100%;
	vertical-align: middle;
	text-align: center;
	color: #ffffff;
	font-size: 24px;
	font-style: normal;
}
</style>
<script src="./main.js"></script>
