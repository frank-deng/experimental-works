export default {
	name: 'JokeList',
	data () {
		return {
			jokes: [],
			loading: false,
			page: 1,
		};
	},
	methods: {
		loadNewPage(){
			if (this.loading) {
				return;
			}
			this.loading = true;
			return this.$http.get(`http://localhost:8082?page=${this.page}`).then((resp)=>{
				for (let item of resp.body.contentlist) {
					this.jokes.push(item);
				}
				this.loading = false;
				this.page++;
			});
		},
	},
	mounted(){
		this.loadNewPage();
	},
	created(){
		window.addEventListener('scroll', (event)=>{
			var elem = document.documentElement;
			if (elem.scrollHeight - elem.clientHeight - 10 < elem.scrollTop) {
				this.loadNewPage();
			}
		});
	},
}
