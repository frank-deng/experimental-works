//消行数
var exports={};
var _getColumnHeight=function(column){
	let result=column.length;
	for(let cell of column){
		if(cell.value){
			break;
		}
		result--;
	}
	return result;
}
exports._getColumnHeight = _getColumnHeight;
exports.getLandingHeight=function(board){
	let result=0;
	for(let x=0;x<board[0].length;x++){
		let column=[];
		for(let y=0;y<board.length;y++){
			column.push(board[y][x]);
		}
		result+=_getColumnHeight(column);
	}
	return result/board[0].length;
}
exports.getElimateLines=function(board){
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
var _getTransition=function(array){
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
exports._getTransition=_getTransition;
exports.getRowTransitions=function(board){
	let result=0;
	for(let y=0;y<board.length;y++){
		result+=_getTransition(board[y]);
	}
	return result;
};
//列变换
exports.getColumnTransitions=function(board){
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
var _getColumnHoles=function(column){
	let result=0,active=false;
	for(let cell of column){
		active=active?true:(!!cell.value);
		if(active && !cell.value){
			result++;
		}
	}
	return result;
}
exports._getColumnHoles=_getColumnHoles;
exports.getHoles=function(board){
	return 0;
};
//井数
exports.getWellSums=function(board){
	return 0;
};
module.exports=exports;

