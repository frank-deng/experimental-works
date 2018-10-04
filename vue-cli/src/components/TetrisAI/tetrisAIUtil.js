//消行数
export function getElimateLines(board){
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
export function getRowTransitions(board){
	let result=0;
	for(let y=0;y<board.length;y++){
		result+=_getTransition(board[y]);
	}
	return result;
};
//列变换
export function getColumnTransitions(board){
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
export function getHoles(board){
	return 0;
};
//井数
export function getWellSums(board){
	return 0;
};

