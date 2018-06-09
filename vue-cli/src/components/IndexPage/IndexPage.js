import { routeInfo } from '../../router';
export default {
	data(){
		return {
			routeInfo: [],
		};
	},
	methods: {
		navigate(idx){
			this.$router.push(this.routeInfo[idx].path);
		},
	},
	mounted(){
		for (let route of this.$router.options.routes) {
			if (route.path !== this.$route.path) {
				this.routeInfo.push(route);
			}
		}
	},
};
