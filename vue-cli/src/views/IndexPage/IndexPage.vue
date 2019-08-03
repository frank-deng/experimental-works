<template>
	<div class='mainFrame'>
		<ul>
			<li v-for='(route, $index) of routeInfo'>
				<el-button type='primary' @click='navigate($index)'>{{route.name}}</el-button>
			</li>
		</ul>
	</div>
</template>
<script src='./IndexPage.js'></script>
<style scoped>
.mainFrame {
	padding: 8px;
}
.el-button {
	width: 100%;
}
li {
	margin: 0 0 10px 0;
}
</style>
