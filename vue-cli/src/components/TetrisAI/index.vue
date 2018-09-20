<template>
	<div class="tetris-ai">
		<div class="gameBoard">
			<div v-for='row of board' class='boardRow'><span v-for='cell of row' class='boardCell'></span></div>
		</div>
	</div>
</template>
<script src='./main.js'></script>
<style>
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
	background-color:#ff0000;
	width:8px;
	height:8px;
	margin:0.5px;
	border-radius:1px;
}
.boardRow{
	overflow:auto;
}
</style>