export default {
	name: 'JokeList',
	data () {
		return {
			jokes: [],
			page: 1,
		};
	},
	methods: {
		loadNewPage(){
			this.$http.get(`http://localhost:8082?page=${this.page}`).then((resp)=>{
				this.jokes.concat(resp.body.contentlist);
			});
			this.page++;
		},
	},
	mounted(){
		this.loadNewPage();
	},
}
