<template>
	<div class="tetris-ai">
		<div class="gameBoard">
			<div v-for='row of board' class='boardRow'><span v-for='cell of row' class='boardCell' :class="'color'+cell"></span></div>
		</div>
	</div>
</template>
<script src='./main.js'></script>
<style scoped>
.tetris-ai{
	text-align:center;
}
.gameBoard{
	border:1px solid #aaaaaa;
	background-color:#000;
	display:inline-block;
	padding:0.5px;
	border-radius:2px;
}
.boardCell{
	display:block;
	float:left;
	border:none;
	width:8px;
	height:8px;
	margin:0.5px;
	border-radius:1px;
}
.color1{
	background-color:#FF0000;
}
.color2{
	background-color:#00FF00;
}
.color3{
	background-color:#0000FF;
}
.color4{
	background-color:#FFFF00;
}
.color5{
	background-color:#FF00FF;
}
.color6{
	background-color:#00FFFF;
}
.color7{
	background-color:#FFFFFF;
}
.boardRow{
	overflow:auto;
}
</style>
