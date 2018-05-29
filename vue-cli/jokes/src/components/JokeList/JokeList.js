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
			return this.$http.get(`http://localhost:8082?page=${this.page}`).then((resp)=>{
				for (let item of resp.body.contentlist) {
					this.jokes.push(item);
				}
				this.page++;
			});
		},
	},
	mounted(){
		this.loadNewPage().then(()=>{
			return this.loadNewPage();
		}).then(()=>{;
			return this.loadNewPage();
		});
	},
}
