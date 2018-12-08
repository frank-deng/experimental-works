export default{
	mounted(){
		let canvas = this.$refs.canvas.getContext("2d");
		canvas.fillStyle = '#ffff00';
		canvas.fillText("Frank!!!",10,50);
	},
}
