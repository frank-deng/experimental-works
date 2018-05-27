<template>
	<div>
		<div class='joke' v-for='joke in jokes'>
			<h2 class='title' v-text='joke.title'></h2>
			<p class='text' v-html='joke.text'></p>
		</div>
	</div>
</template>

<script src='./JokeList.js'></script>

<style scoped>
</style>
