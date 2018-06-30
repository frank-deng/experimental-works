<template>
	<div>
		<el-row class='dialPad' :gutter='2'>
			<el-col	:span='8'>
				<el-button type='primary'>7</el-button>
			</el-col>
			<el-col	:span='8'>
				<el-button type='primary'>8</el-button>
			</el-col>
			<el-col	:span='8'>
				<el-button type='primary'>9</el-button>
			</el-col>
			<el-col	:span='8'>
				<el-button type='primary'>4</el-button>
			</el-col>
			<el-col	:span='8'>
				<el-button type='primary'>5</el-button>
			</el-col>
			<el-col	:span='8'>
				<el-button type='primary'>6</el-button>
			</el-col>
			<el-col	:span='8'>
				<el-button type='primary'>1</el-button>
			</el-col>
			<el-col	:span='8'>
				<el-button type='primary'>2</el-button>
			</el-col>
			<el-col	:span='8'>
				<el-button type='primary'>3</el-button>
			</el-col>
			<el-col	:span='8'>
				<el-button type='primary'>*</el-button>
			</el-col>
			<el-col	:span='8'>
				<el-button type='primary'>0</el-button>
			</el-col>
			<el-col	:span='8'>
				<el-button type='primary'>#</el-button>
			</el-col>
		</el-row>
	</div>
</template>
<style scoped>
.dialPad {
	position: absolute;
	bottom: 0;
	left: 1px;
	right: 1px;
}
.el-col {
	margin-bottom: 2px;
}
.el-button{
	display: block;
	width: 100%;
	height: 80px;
}
</style>
<script src="./main.js"></script>
