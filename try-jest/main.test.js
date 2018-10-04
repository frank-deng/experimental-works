var tetrisAIUtil = require('./tetrisAIUtil.js');

var processLine=function(line){
	let result=[];
	for(let n of line){
		result.push({
			value:n,
		})
	}
	return result;
}
var processBoard=function(board){
	let result=[];
	for(let row of board){
		result.push(processLine(row));
	}
	return result;
};

test('getElimateLines',()=>{
	let board=processBoard([
		[0,0,0,0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0,0,0,0],
		[1,1,1,1,1,1,1,1,1,1],
		[1,1,1,1,1,1,1,1,1,1],
		[1,1,1,1,1,1,1,1,1,1],
		[1,1,1,1,1,1,1,1,1,1],
	]);
	expect(tetrisAIUtil.getElimateLines(board)).toBe(4);
});
test('_getTransition',()=>{
	let line = processLine([0,0,0,0,0,0,0,0,0,0]);
	expect(tetrisAIUtil._getTransition(line)).toBe(2);
	line = processLine([0,0,0,1,0,0,0,0,0,0]);
	expect(tetrisAIUtil._getTransition(line)).toBe(4);
	line = processLine([1,1,0,0,1,1,0,0,1,1,0,0]);
	expect(tetrisAIUtil._getTransition(line)).toBe(6);
	line = processLine([0,0,0,1,0,1,0,1,0,1]);
	expect(tetrisAIUtil._getTransition(line)).toBe(8);
	line = processLine([1,1,1,1,1,1,1,1,1,1]);
	expect(tetrisAIUtil._getTransition(line)).toBe(0);
});

