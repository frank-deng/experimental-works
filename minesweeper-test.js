var M = require('./minesweeper');
var width = 16, height = 16, mines = 40;
var n = 10000, success = 0, failed = 0;
while (n--) {
	var m = new M(width, height, 40, true);
	m.randomDig();
	while (0 == m.getStatus()) {
		while (m.autoProcess()) {}
		if (0 == m.getStatus()) {
			m.randomDig();
		}
	}
	if ('Failed' == m.getStatus()) {
		failed++;
	} else if ('Success' == m.getStatus()) {
		success++;
	}
}
console.log(success, failed);
/*
var board = m.getBoard();
for (var row = 0; row < board.length; row++) {
	console.log(board[row].join('').replace(/0/g, '.'));
}
*/
