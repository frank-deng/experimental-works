<template>
	<div>
		<div v-for='joke in jokes'>
			<p v-text='joke.title'></p>
			<p v-html='joke.text'></p>
		</div>
	</div>
</template>

<script src='./JokeList.js'></script>

<style scoped>
</style>
