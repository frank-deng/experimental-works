export const blockMap={
	'O':[
		{w:2,h:2,x:0,y:0,m:0x0f},
	],
	'I':[
		{w:4,h:1,x:2,y:0,m:0x0F},
		{w:1,h:4,x:0,y:2,m:0x0F},
	],
	'S':[
		{w:2,h:3,x:0,y:1,m:0x2D},
		{w:3,h:2,x:1,y:1,m:0x1E},
	],
	'Z':[
		{w:2,h:3,x:0,y:1,m:0x1E},
		{w:3,h:2,x:1,y:1,m:0x33},
	],
	'T':[
		{w:2,h:3,x:0,y:1,m:0x1D},
		{w:3,h:2,x:1,y:1,m:0x3A},
		{w:2,h:3,x:1,y:1,m:0x2E},
		{w:3,h:2,x:1,y:0,m:0x17},
	],
	'L':[
		{w:2,h:3,x:1,y:1,m:0x35},
		{w:3,h:2,x:1,y:0,m:0x3C},
		{w:2,h:3,x:0,y:1,m:0x2B},
		{w:3,h:2,x:1,y:1,m:0x0F},
	],
	'J':[
		{w:2,h:3,x:0,y:1,m:0x3A},
		{w:3,h:2,x:1,y:1,m:0x27},
		{w:2,h:3,x:1,y:1,m:0x17},
		{w:3,h:2,x:1,y:0,m:0x39},
	],
}
export const blockPalette={
	'O':1,
	'I':2,
	'S':3,
	'Z':4,
	'T':5,
	'J':6,
	'L':7,
}
const BOARD_WIDTH = 10;
const BOARD_HEIGHT = 20;
export function newBoard(){
	let result=[];
	for(let y=0;y<BOARD_HEIGHT;y++){
		let row=[];
		for(let x=0;x<BOARD_WIDTH;x++){
			row.push({value:0});
		}
		result.push(row);
	}
	return result;
}
function hitTest(board,type,idx,x0,y0){
	let block = undefined;
	try{
		block = blockMap[type][idx];
	}catch(e){
		console.error(`Block ${type} #${idx} not found.`);
		return undefined;
	}
	//Check if block is out of range
	if (y0+block.h>BOARD_HEIGHT || x0+block.w>BOARD_WIDTH){
		return true;
	}
	//Check if block collides with already fixed blocks
	let mask=1;
	for(let y=0;y<block.h;y++){
		for(let x=0;x<block.w;x++){
			if(block.m&mask && board[y+y0][x+x0].value){
				return true;
			}
			mask<<=1;
		}
	}
	return false;
}
function drawBlock(board,type,idx,x0,y0){
	let block = undefined;
	try{
		block = blockMap[type][idx];
	}catch(e){
		console.error(`Block ${type} #${idx} not found.`);
		return undefined;
	}
	//Start drawing block
	let mask=1;
	for(let y=0;y<block.h;y++){
		for(let x=0;x<block.w;x++){
			if(block.m&mask){
				board[y0+y][x0+x].value=blockPalette[type];
			}
			mask<<=1;
		}
	}
	return true;
}
export function dropBlock(board,type,idx,x0,noelimate=false){
	//Board is full
	if(hitTest(board,type,idx,x0,0)){
		return false;
	}
	let y=0;
	while(y<BOARD_HEIGHT){
		if(hitTest(board,type,idx,x0,y+1)){
			break;
		}
		y++;
	}
	drawBlock(board,type,idx,x0,y);

	//Elimate full lines
	if(noelimate){
		return true;
	}
	let elimateLines=(board)=>{
		let count=0,y=board.length-1,times=1000;
		while(y>=0&&times){
			let row=board[y],elimate=true;
			for(let x=0;x<row.length;x++){
				if(!row[x].value){
					elimate=false;
					break;
				}
			}
			if(!elimate){
				y--;
				continue;
			}
			count++;
			for(let x=0;x<row.length;x++){
				for(let y1=y;y1>=1;y1--){
					board[y1][x].value=board[y1-1][x].value;
				}
				board[0][x].value=0;
			}
			times--;
		}
		if(!times){
			console.error('Deadlock');
		}
		return count;
	}
	let cnt=elimateLines(board);
	return true;
}
export function dropBlockPreview(boardOrig,type,idx,x0){
	let board=newBoard();
	for(let y=0;y<BOARD_HEIGHT;y++){
		for(let x=0;x<BOARD_WIDTH;x++){
			board[y][x].value=boardOrig[y][x].value;
		}
	}
	dropBlock(board,type,idx,x0,false);
	return board;
}

export function scoreBoard(board){
	//消行数
	let getElimateLines=(board)=>{
		let result=0;
		for(let y=0;y<board.length;y++){
			let row=board[y],elimated=true;
			for(let x=0;x<row.length;x++){
				if(!row[x].value){
					elimated=false;
					break;
				}
			}
			if(elimated){
				result++;
			}
		}
		return result;
	};
	//行变换
	let _getTransition=(array)=>{
		let transition=0;
		if(!array[0].value){
			transition++;
		}
		for(let i=1;i<array.length;i++){
			if(array[i-1].value!=array[i].value){
				transition++;
			}
		}
		if(!array[array.length-1].value){
			transition++;
		}
		return transition;
	}
	let getRowTransitions=(board)=>{
		let result=0;
		for(let y=0;y<board.length;y++){
			result+=_getTransition(board[y]);
		}
		return result;
	};
	//列变换
	let getColumnTransitions=(board)=>{
		let result=0;
		for(let x=0;x<board[0].length;x++){
			let array=[];
			for(let y=0;y<board.length;y++){
				array.push(board[y][x]);
			}
			result+=_getTransition(array);
		}
		return result;
	};
	//空洞数
	let getHoles=(board)=>{
		return 0;
	};
	//井数
	let getWellSums=(board)=>{
		return 0;
	};
	return 1;
}
export function findBestMove(board,type){
	let bestScore=undefined,bestIdx=undefined,bestPos=undefined;
	blockMap[type].map((block,idx)=>{
		for (let x=0;x<BOARD_WIDTH-block.w;x++){
			let score=scoreBoard(dropBlockPreview(board,type,idx,x));
			if(undefined===bestScore || score>bestScore){
				bestScore=score;
				bestIdx=idx;
				bestPos=x;
			}
		}
	});
	return {
		idx:bestIdx,
		x:bestPos,
	};
}

