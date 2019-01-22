'use strict'
function InvalidFormatError(msg) {
	this.message = msg;
	var error = new Error(this.message);
	this.stack = error.stack;
}
InvalidFormatError.prototype = new Error();
InvalidFormatError.prototype.name = InvalidFormatError.name;
InvalidFormatError.prototype.constructor = InvalidFormatError;

function FontPC98(bufferOrig){
	var view = new DataView(bufferOrig);
	var validateBmp = function(buffer){
		var signature = view.getUint16(0, true);
		if (signature != 0x4d42) {
			throw new InvalidFormatError('Invalid signature');
		}
		var bmpsize = view.getUint32(2, true);
		if (buffer.byteLength != bmpsize) {
			throw new InvalidFormatError('BMP file size mismatch');
		}
		var planes = view.getUint16(26, true);
		if (planes != 1) {
			throw new InvalidFormatError('Color plane not 1');
		}
		var bpp = view.getUint16(28, true);
		if (bpp != 1) {
			throw new InvalidFormatError('Color depth is not 1 bit');
		}
		var compression = view.getUint32(30, true);
		if (compression != 0) {
			throw new InvalidFormatError('Compressed not supported');
		}

		var width = view.getUint32(18, true);
		var height = view.getUint32(22, true);
		if (width != 2048 || height != 2048) {
			throw new InvalidFormatError('Image resulotion is not 2048x2048');
		}
		var imgsize = view.getUint32(34, true);
		if (imgsize != 2048*2048/8) {
			throw new InvalidFormatError('Image size is not '+String(2048*2048/8));
		}
	}
	validateBmp(bufferOrig);

	var offset = view.getUint32(10, true);
	var buffer = bufferOrig.slice(0);
	view = new DataView(buffer, offset);

	this.getBuffer = function(){
		return buffer.slice(0);
	}
	this.getAnk = function(chr){
		var result = [];
		var offset = 2047 * 256 + chr;
		for (var i = 0; i < 16; i++) {
			result.push((~view.getUint8(offset)) & 0xFF);
			offset -= 256;
		}
		return result;
	}
	this.getKanji = function(a, b){
		var result = [];
		var xof = (a - 0x20) * 2, yof = b * 16, offset = (2047 - yof) * 256 + xof;
		for (var i = 0; i < 16; i++) {
			result.push((~view.getUint16(offset, false)) & 0xFFFF);
			offset -= 256;
		}
		return result;
	}
	this.writeAnk = function(chr, data, writeCharAtKanji, writeFullWidth) {
		var offset = 2047 * 256 + chr;
		for (var i = 0; i < 16; i++) {
			view.setUint8(offset, (~data[i]) & 0xFF);
			offset -= 256;
		}
		if (writeCharAtKanji) {
			var pixels = new Array(16);
			for (var i = 0; i < 16; i++) {
				pixels[i] = (data[i] << 8) & 0xffff;
			}
			this.writeKanji(0x29, chr, pixels);
		}
		if (writeFullWidth && ((chr >= 0x30 && chr <= 0x39) || (chr >= 0x41 && chr <= 0x5a) || (chr >= 0x61 && chr <= 0x7a))){
			var pixels = new Array(16);
			for (var i = 0; i < 16; i++) {
				pixels[i] = 0;
				for (var j = 0; j < 8; j++){
					pixels[i] <<= 2;
					if (data[i] & (1 << (7 - j))) {
						pixels[i] |= 0x3;
					}
				}
				pixels[i] &= 0xffff;
			}
			this.writeKanji(0x23, chr, pixels);
		}
	}
	this.writeKanji = function(a, b, data) {
		var xof = (a - 0x20) * 2, yof = b * 16, offset = (2047 - yof) * 256 + xof;
		for (var i = 0; i < 16; i++) {
			view.setUint16(offset, (~data[i]) & 0xFFFF, false);
			offset -= 256;
		}
	}
}
FontPC98.isValidCode = function(code){
	if ('string' == typeof code) {
		if (!(/([0-9A-Fa-f]{2}|[2-7][0-9A-Fa-f][2-7][0-9A-Fa-f])/.test(code))) {
			return false;
		}
		code = parseInt(code, 16);
	} else if ('number' != typeof code) {
		return false;
	}
	
	if (code <= 0 || code >= 0xffff) {
		return false;
	} else if (code <= 0xff) { //ASCII and Half-width katakana
		return true;
	}

	var row = (code >> 8) & 0xff, col = code & 0xff;
	if (row < 0x21 || row > 0x7e || col < 0x21 || col > 0x7e) {
		return false;
	}
	return true;
}
FontPC98.codeNumToStr = function(code){
	if ('number' != typeof code || !FontPC98.isValidCode(code)) {
		return undefined;
	}
	if (code <= 0xff) {
		return ('0'+code.toString(16)).slice(-2);
	}
	var row = (code >> 8) & 0xff, col = code & 0xff;
	var srow = ('0'+row.toString(16)).slice(-2);
	var scol = ('0'+col.toString(16)).slice(-2);
	return srow + scol;
}
FontPC98.prevCode = function(code){
	if ('number' != typeof code || !FontPC98.isValidCode(code)) {
		return undefined;
	}
	if (code <= 0xff) {
		return code == 0 ? code : code - 1;
	}
	var row = (code >> 8) & 0xff, col = code & 0xff;
	if (col == 0x21) {
		if (row == 0x21) {
			return 0xff;
		} else {
			col = 0x7e;
			row--;
		}
	} else {
		col--;
	}
	return ((row << 8) | col);
}
FontPC98.nextCode = function(code){
	if ('number' != typeof code || !FontPC98.isValidCode(code)) {
		return undefined;
	}
	if (code < 0xff) {
		return code + 1;
	} else if (code == 0xff) {
		return 0x2121;
	}
	var row = (code >> 8) & 0xff, col = code & 0xff;
	if (0x7e == col) {
		if (row < 0x7e) {
			col = 0x21;
			row++;
		}
	} else {
		col++;
	}
	return ((row << 8) | col);
}

function FontManager(){
	this.loadFont = function(params){
		var reader = new FileReader();
		reader.addEventListener('load', function(){
			var font = undefined;
			try {
				font = new FontPC98(this.result);
			} catch(e) {
				if (typeof params.error === 'function'){
					params.error(e, this.result);
				}
			}
			if (typeof params.success === 'function'){
				params.success(font);
			}
		});
		reader.addEventListener('abort', function(e){
			if (typeof params.abort === 'function'){
				params.abort(e);
			}
		});
		reader.readAsArrayBuffer(params.src);
	}
	this.saveFont = function(font){
		if (!(font instanceof FontPC98)) {
			throw Error('Not a saveable instance');
		}
		var file = new File([new Blob([font.getBuffer()])], 'font.bmp', {type: "image/x-bmp"});
		var dataURL = window.URL.createObjectURL(file);
		var link = document.createElement("a");
		link.href = dataURL;
		link.download = 'font.bmp';
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
		window.URL.revokeObjectURL(dataURL);
	}
	var FONT_LOCALSTORAGE_KEY = 'FontData';
	this.loadFontLC = function(){
		try {
			var lsData = window.localStorage.getItem(FONT_LOCALSTORAGE_KEY);
			if (!lsData){
				return undefined;
			}
			var len = lsData.length / 2;
			var arrayBuffer = new ArrayBuffer(len);
			var view = new DataView(arrayBuffer);
			for (var i = 0; i < len; i++) {
				view.setUint8(i, parseInt(lsData.slice(i*2, i*2+2), 16));
			}
			return new FontPC98(arrayBuffer);
		} catch(e) {
			console.warn(e.message);
		}
		return undefined;
	}
	this.saveFontLC = function(font){
		try {
			var bytes = new Uint8Array(font.getBuffer());
			var len = bytes.length;
			var result = new Array();
			for (var i = 0; i < len; i++) {
				var hexval = bytes[i].toString(16);
				if (hexval.length < 2) {
					hexval = '0'+hexval;
				}
				result.push(hexval);
			}
			window.localStorage.setItem(FONT_LOCALSTORAGE_KEY, result.join(''));
		} catch(e) {
			this.clearFontLC();
			console.warn(e.message);
		}
	}
	this.clearFontLC = function(){
		window.localStorage.removeItem(FONT_LOCALSTORAGE_KEY);
	}
}
