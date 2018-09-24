const blockMap={
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
const blockPalette={
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
			row.push(0);
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
			if(block.m&mask && board[y+y0][x+x0]){
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
				board[y0+y][x0+x]=blockPalette[type];
			}
			mask<<=1;
		}
	}
	return true;
}
export function dropBlock(board,type,idx,x0){
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
	return true;
}
export function dropBlockPreview(boardOrig,type,idx,x0){
	let board=newBoard();
	for(let y=0;y<BOARD_HEIGHT;y++){
		for(let x=0;x<BOARD_WIDTH;x++){
			board[y][x]=boardOrig[y][x];
		}
	}
	dropBlock(board,type,idx,x0);
	return board;
}
