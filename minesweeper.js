(function(root, factory) {
	'use strict';
	if (typeof define === 'function' && define.amd) {
		// AMD support.
		define([], factory);
	} else if (typeof exports === 'object') {
		// NodeJS support.
		module.exports = factory();
	} else {
		// Browser global support.
		root.Minesweeper = factory();
	}
}(this, function() {
	'use strict';
	var MINE = 9, MARKED = -1, OPENED = 1;
	var SUCCESS = 1, FAILED = 2;
	var Minesweeper = function(w,h,mines,debug){
		/* Verify Data */
		if (isNaN(w) || isNaN(h) || w<4 || h<4) {
			throw new Error('Invalid board size');
		}
		if (isNaN(mines) || mines < 1 || mines >= w*h) {
			throw new Error('Invalid mine count');
		}

		/* Init Board */
		var board = new Array(h);
		var boardStatus = new Array(h);
		var _this = this;
		var _status = undefined;
		for (var y = 0; y < h; y++) {
			var row = new Array(w), rowStatus = new Array(w);
			for (var x = 0; x < w; x++) {
				row[x] = rowStatus[x] = 0;
			}
			board[y] = row;
			boardStatus[y] = rowStatus;
		}

		/* Private & Public methods */
		var getNeighbours = function(x,y) {
			var result = [];
			var x0 = (x<=0 ? 0 : x-1), x1 = (x>=w-1 ? x : x+1);
			var y0 = (y<=0 ? 0 : y-1), y1 = (y>=h-1 ? y : y+1);
			for (var yt = y0; yt <= y1; yt++) {
				for (var xt = x0; xt <= x1; xt++) {
					if (xt == x && yt == y) {
						continue;
					}
					result.push({x:xt,y:yt});
				}
			}
			return result;
		}
		var countMines = function(x,y) {
			var cnt = 0, neibours = getNeighbours(x, y);
			for (var i = 0; i < neibours.length; i++) {
				var n = neibours[i];
				if (MINE == board[n.y][n.x]) {
					cnt++;
				}
			}
			return cnt;
		}
		var placeMines = function(x0,y0){
			var posMines = [];
			for (var y = 0; y < h; y++) {
				for (var x = 0; x < w; x++) {
					if (x == x0 && y == y0) {
						continue;
					}
					posMines.splice(Math.floor(Math.random()*(posMines.length)), 0, {x:x, y:y});
				}
			}
			for (var i = 0; i < mines; i++) {
				var idx = Math.floor(Math.random()*(posMines.length));
				var p = posMines[idx];
				board[p.y][p.x] = MINE;
				posMines.splice(idx, 1);
			}
			for (var y = 0; y < h; y++) {
				for (var x = 0; x < w; x++) {
					if (MINE != board[y][x]) {
						board[y][x] = countMines(x, y);
					}
				}
			}
			posMines = undefined;
		}
		var checkPosition = function(x,y){
			if (_status !== undefined && _status != 0) {
				throw new Error('Game Over');
			}
			if (x<0 || x>=w || y<0 || y>=h) {
				throw new Error('Invalid positon');
			}
		}
		var isFinished = function() {
			for (var y = 0; y < h; y++) {
				for (var x = 0; x < w; x++) {
					if (board[y][x] != MINE && boardStatus[y][x] != OPENED) {
						return false;
					}
				}
			}
			for (var y = 0; y < h; y++) {
				for (var x = 0; x < w; x++) {
					if (board[y][x] == MINE) {
						boardStatus[y][x] = MARKED;
					}
				}
			}
			return true;
		}
		this.getStatus = function(){
			return _status;
		}
		this.getBoard = function(){
			var result = new Array(h);
			for (var y = 0; y < h; y++) {
				var row = new Array(w);
				for (var x = 0; x < w; x++) {
					if (-1 == boardStatus[y][x]) {
						row[x] = (0 == _status ? '!' : (MINE == board[y][x] ? '!' : 'X'));
					} else if (0 == boardStatus[y][x]) {
						row[x] = (0 == _status ? '#' : (MINE == board[y][x] ? '*' : '#'));
					} else if (MINE == board[y][x]){
						row[x] = '%';
					} else {
						row[x] = (board[y][x] == 0 ? 0 : board[y][x]);
					}
				}
				result[y] = row;
			}
			return result;
		}
		this.dig = function(x,y){
			checkPosition(x,y);
			if (MARKED == boardStatus[y][x]) {
				return this;
			} else if (OPENED == boardStatus[y][x]) {
			}
			if (undefined === _status) {
				placeMines(x,y);
				_status = 0;
			}
			boardStatus[y][x] = OPENED;

			//Dig more blocks
			switch(board[y][x]) {
				case 0:
					var neighbours = getNeighbours(x, y);
					for (var i = 0; i < neighbours.length; i++) {
						var nx = neighbours[i].x, ny = neighbours[i].y;
						if (boardStatus[ny][nx] == 0) {
							this.dig(nx, ny);
						}
					}
				break;
				case 9:
					_status = 'Failed';
				break;
			}

			//Check if finished
			if (_status === 0 && isFinished()) {
				_status = 'Success';
			}
			return this;
		}
		this.mark = function(x,y){
			checkPosition(x,y);
			var s = boardStatus[y][x];
			boardStatus[y][x] = (s == OPENED ? s : MARKED);
			return this;
		}
		this.unmark = function(x,y){
			checkPosition(x,y);
			var s = boardStatus[y][x];
			boardStatus[y][x] = (s == OPENED ? s : 0);
			return this;
		}

		/* Auto processing */
		var autoMarkBlock = function(x, y, cnt){
			var n = getNeighbours(x, y);
			var unopened = [];
			for (var i = 0; i < n.length; i++) {
				if (boardStatus[n[i].y][n[i].x] != OPENED) {
					unopened.push(n[i]);
				}
			}
			if (unopened.length != cnt) {
				return false;
			}
			var st = false;
			for (var i = 0; i < unopened.length; i++) {
				if (boardStatus[unopened[i].y][unopened[i].x] != MARKED) {
					_this.mark(unopened[i].x, unopened[i].y);
					st = true;
				}
			}
			return st;
		}
		var autoDigBlock = function(x, y, cnt) {
			var n = getNeighbours(x, y);
			var marked = 0, unopened = [];
			for (var i = 0; i < n.length; i++) {
				if (boardStatus[n[i].y][n[i].x] == MARKED) {
					marked++;
				} else if (boardStatus[n[i].y][n[i].x] == 0) {
					unopened.push(n[i]);
				}
			}
			if (marked != cnt || unopened.length == 0) {
				return false;
			}
			for (var i = 0; i < unopened.length; i++) {
				try {
					_this.dig(unopened[i].x, unopened[i].y);
				}catch(e){
					return false;
				}
			}
			return true;
		}
		this.autoProcess = function(){
			var st = false;
			//Mark out mines
			for (var y = 0; y < h; y++) {
				for (var x = 0; x < w; x++) {
					if (boardStatus[y][x] == OPENED && board[y][x] >= 1 && board[y][x] <= 8) {
						if (autoMarkBlock(x, y, board[y][x])) {
							st = true;
						}
					}
				}
			}

			//Dig mines
			for (var y = 0; y < h; y++) {
				for (var x = 0; x < w; x++) {
					if (boardStatus[y][x] == OPENED && board[y][x] >= 1 && board[y][x] <= 8) {
						if (autoDigBlock(x, y, board[y][x])) {
							st = true;
						}
					}
				}
			}

			return st;
		}
		this.randomDig = function(){
			while(1){
				var x = Math.floor(Math.random()*w), y = Math.floor(Math.random()*h);
				if (boardStatus[y][x] == 0) {
					_this.dig(x, y);
					break;
				}
			}
		}
		if (debug) {
			this._printBoard = function(){
				return {board:board, status:boardStatus};
			}
		}
	}
	return Minesweeper;
}));
