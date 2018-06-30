export default{
	data(){
		return {
			dialNum: undefined,
		};
	},
	watch: {
		'dialNum'(dialNum){
			console.log(dialNum);
		},
	},
	methods: {
		dial(number){
			this.dialNum = number;
		},
	},
	mounted(){
	},
}
