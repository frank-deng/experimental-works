import Vue from 'vue';
export default {
	name: 'HelloWorld',
	data(){
		return {
			selections: [
				{key: 'HTML', label: 'HTML使用'},
				{key: 'CSS', label: 'CSS使用'},
				{key: 'JS', label: 'JS使用'},
				{key: 'vue_js', label: 'vue.js使用'},
			],
			selected: [],
			textTable: {
				selections: {
					'HTML': 'HTML使用',
					'CSS': 'CSS使用',
					'JS': 'JS使用',
					'vue_js': 'vue.js使用',
				}
			},
			scores: [],
			tableCols: [],
			tableData: [],
		};
	},
	methods: {
		selectionChanged(){
			this.scores = [];
			for (let item of this.selected){
				this.scores.push({
					key: item,
					value: '',
				});
			}
			this.scores.sort((a, b)=>{
				return a.key > b.key ? 1 : a.key < b.key ? -1 : 0;
			});
		},
	},
	mounted(){
		window.dynTable = this;
		setTimeout(()=>{
			this.tableCols = [
				{
					prop: 'name',
					label: '名称',
				},
				{
					prop: 'type',
					label: '类型',
				},
				{
					prop: 'amount',
					label: '数量',
				},
			];
			this.$nextTick(()=>{
				this.tableData = [
					{
						name: 'aaa',
						type: 'type1',
						amount: '1',
					},
					{
						name: 'bbb',
						type: 'type1',
						amount: '2',
					},
					{
						name: 'ccc',
						type: 'type3',
						amount: '3',
					},
				];
			});
		}, 1000);
	},
}

