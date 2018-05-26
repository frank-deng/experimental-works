export default {
	name: 'JokeList',
	data () {
		return {
			jokes: [],
		};
	},
	mounted(){
		this.$http.get('http://localhost:8082').then((resp)=>{
			this.jokes = resp.body.contentlist;
		});
	},
}
