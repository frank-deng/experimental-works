import {blockMap, newBoard, dropBlock, dropBlockPreview} from './tetris.js';
export default{
	data(){
		return{
			board:[],
		};
	},
	mounted(){
		this.board=newBoard();
		for (let x=0;x<this.board[0].length-1;x++){
			dropBlock(this.board,'I',1,x);
		}
		setTimeout(()=>{
			dropBlock(this.board,'I',1,this.board[0].length-1);
			setTimeout(()=>{
				dropBlock(this.board,'S',0,4);
				dropBlock(this.board,'S',0,4);
				dropBlock(this.board,'S',0,4);
				dropBlock(this.board,'S',0,4);
			},1000);
		},1000);
		setInterval(()=>{
			let blockType=Object.keys(blockMap)[parseInt(Math.random()*7)];
			//console.log(blockType);
			/*
			let bestMove=findBestMove(this.board,blockType);
			dropBlock(this.board,blockType,bestMove.idx,bestMove.x);
			*/
		},500);
	},
}
