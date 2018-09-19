<template>
	<div class="tetris-ai">
		<div v-for='row of board'>
			<span v-for='cell of row'>{{cell}}</span>
		</div>
	</div>
</template>
<script src='./main.js'></script>
<style>
.tetris-ai{
}
</style>