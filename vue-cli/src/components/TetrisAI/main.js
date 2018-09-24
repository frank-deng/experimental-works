import {newBoard, dropBlock, dropBlockPreview} from './tetris.js';
export default{
	data(){
		return{
			board:[],
		};
	},
	methods:{
	},
	mounted(){
		this.board=newBoard();
		dropBlock(this.board,'J',0,0);
		dropBlock(this.board,'J',0,2);
		dropBlock(this.board,'L',0,3);
		dropBlock(this.board,'S',0,5);
		console.log(dropBlockPreview(this.board,'J',0,0));
	},
}
