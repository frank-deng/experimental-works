export default{
	data(){
		return{
			board:[],
		};
	},
	mounted(){
		for(let y=0;y<20;y++){
			let row=[];
			for(let x=0;x<10;x++){
				row.push(0);
			}
			this.board.push(row);
		}
	},
}