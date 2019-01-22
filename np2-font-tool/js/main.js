"use strict"
var fontManager = new FontManager();

Vue.filter('codeToChar', function (v) {
	if (v > 0xFF) {
		var idx = ((v >> 8) & 0x7F) - 0x21, idx2 = (v & 0x7F) - 0x21;
		return CHARMAP.j[idx][idx2];
	} else if (v >= 0x20) {
		return CHARMAP.a[v - 0x20];
	}
	return undefined;
})
Vue.component('char-editor', {
	template: '#template_char_editor',
	props: ['charCode', 'font'],
	data: function(){
		return {
			isKanji: undefined,
			idx: undefined,
			idx2: undefined,
			pixels: undefined,
			writeCharAtKanji: true,
			writeFullWidth: true,
		};
	},
	watch:{
		charCode:function(v){
			if (typeof v != 'number' || !FontPC98.isValidCode(v)) {
				this.isKanji = undefined;
				return;
			} else if (v > 0xFF) {
				this.isKanji = true;
				this.idx = (v >> 8) & 0x7F;
				this.idx2 = v & 0x7F;
			} else {
				this.isKanji = false;
				this.idx = v;
				this.idx2 = undefined;
			}
			try {
				this.pixels = this.isKanji ? this.font.getKanji(this.idx, this.idx2) : this.font.getAnk(this.idx);
				this.updateCanvas();
			} catch(e) {
				console.error(e);
				this.isKanji = undefined;
			}
		},
	},
	methods:{
		updateCanvas: function(){
			var charPixels = this.pixels;
			var canvas = this.isKanji ? this.$refs.canvasKanji : this.$refs.canvasANK;
			var ctx = canvas.getContext('2d');
			ctx.fillStyle = '0x000000';
			if (this.isKanji) {
				ctx.clearRect(0,0,256,256);
				for (var i = 0; i < charPixels.length; i++) {
					for (var j = 0; j < 16; j++) {
						if (charPixels[i] & (1 << (15-j))) {
							ctx.fillRect(j*16, i*16, 15, 15);
						}
					}
				}
			} else {
				ctx.clearRect(0,0,128,256);
				for (var i = 0; i < charPixels.length; i++) {
					for (var j = 0; j < 8; j++) {
						if (charPixels[i] & (1 << (7-j))) {
							ctx.fillRect(j*16, i*16, 15, 15);
						}
					}
				}
			}
		},
		onEditChar: function(e){
			var x = Math.floor(e.offsetX / 16 / 340 * 256), y = Math.floor(e.offsetY / 16 / 340 * 256);
			if (this.isKanji) {
				var target = 1 << (15 - x);
				if (this.pixels[y] & target) {
					this.pixels[y] &= (~target) & 0xFFFF;
				} else {
					this.pixels[y] |= target;
				}
				this.font.writeKanji(this.idx, this.idx2, this.pixels);
			} else {
				var target = 1 << (7 - x);
				if (this.pixels[y] & target) {
					this.pixels[y] &= (~target) & 0xFF;
				} else {
					this.pixels[y] |= target;
				}
				this.font.writeAnk(this.idx, this.pixels, this.writeCharAtKanji, this.writeFullWidth);
			}
			this.updateCanvas();
		},
		onClear: function(e){
			if (!window.confirm("Clear this glyph?")){
				return;
			}
			for (var i = 0; i < this.pixels.length; i++){
				this.pixels[i] = 0;
			}
			if (this.isKanji) {
				this.font.writeKanji(this.idx, this.idx2, this.pixels);
			} else {
				this.font.writeAnk(this.idx, this.pixels, this.writeCharAtKanji, this.writeFullWidth);
			}
			this.updateCanvas();
		},
		onShiftLeft: function(e){
			if (this.isKanji) {
				for (var i = 0; i < this.pixels.length; i++){
					var firstpx = (this.pixels[i] & 0x8000) ? 1 : 0;
					this.pixels[i] = (this.pixels[i] << 1) & 0xffff;
					this.pixels[i] |= firstpx;
				}
				this.font.writeKanji(this.idx, this.idx2, this.pixels);
			} else {
				for (var i = 0; i < this.pixels.length; i++){
					var firstpx = (this.pixels[i] & 0x80) ? 1 : 0;
					this.pixels[i] = (this.pixels[i] << 1) & 0xff;
					this.pixels[i] |= firstpx;
				}
				this.font.writeAnk(this.idx, this.pixels, this.writeCharAtKanji, this.writeFullWidth);
			}
			this.updateCanvas();
		},
		onShiftRight: function(e){
			if (this.isKanji) {
				for (var i = 0; i < this.pixels.length; i++){
					var lastpx = (this.pixels[i] & 1) ? 0x8000 : 0;
					this.pixels[i] = (this.pixels[i] >> 1) & 0xffff;
					this.pixels[i] |= lastpx;
				}
				this.font.writeKanji(this.idx, this.idx2, this.pixels);
			} else {
				for (var i = 0; i < this.pixels.length; i++){
					var lastpx = (this.pixels[i] & 1) ? 0x80 : 0;
					this.pixels[i] = (this.pixels[i] >> 1) & 0xff;
					this.pixels[i] |= lastpx;
				}
				this.font.writeAnk(this.idx, this.pixels, this.writeCharAtKanji, this.writeFullWidth);
			}
			this.updateCanvas();
		},
		onShiftUp: function(e){
			var temp = this.pixels.shift();
			this.pixels.push(temp);
			if (this.isKanji) {
				this.font.writeKanji(this.idx, this.idx2, this.pixels);
			} else {
				this.font.writeAnk(this.idx, this.pixels, this.writeCharAtKanji, this.writeFullWidth);
			}
			this.updateCanvas();
		},
		onShiftDown: function(e){
			var temp = this.pixels.pop();
			this.pixels.unshift(temp);
			if (this.isKanji) {
				this.font.writeKanji(this.idx, this.idx2, this.pixels);
			} else {
				this.font.writeAnk(this.idx, this.pixels, this.writeCharAtKanji, this.writeFullWidth);
			}
			this.updateCanvas();
		},
	},
});

var vm = new Vue({
	el: '#app',
	data: {
		font: undefined,
		charCode: undefined,
		search: {
			charCode: undefined,
		},
	},
	methods:{
		onUploadFile: function(e){
			var files = e.target.files || e.dataTransfer.files;
			if (files.length) {
				fontManager.loadFont({
					src: files[0],
					success: function(font){
						vm.$refs.fileUpload.value = null;
						vm.charCode = undefined;
						vm.font = font;
						vm.$nextTick(function () {
							vm.onShowChar();
						});
					},
					error: function(e, data){
						alert('Invalid file format.');
						throw e;
					}
				});
			}
		},
		onSaveFont: function(e) {
			if (this.font) {
				fontManager.saveFont(this.font);
			} else {
				console.warn('No font file uploaded');
			}
		},
		onCloseFont: function(e) {
			if (window.confirm("Close this font file?")){
				fontManager.clearFontLC();
				this.charCode = undefined;
				this.font = undefined;
			}
		},
		onShowChar: function(e) {
			var code = String(this.search.charCode);
			if (FontPC98.isValidCode(code)) {
				localStorage.setItem('searchCharCode', code);
				this.charCode = parseInt(code, 16);
			}
			this.search.charCode = FontPC98.codeNumToStr(this.charCode);
		},
		onShowPrevChar: function(e) {
			this.search.charCode = FontPC98.codeNumToStr(FontPC98.prevCode(this.charCode));
			this.onShowChar();
		},
		onShowNextChar: function(e) {
			this.search.charCode = FontPC98.codeNumToStr(FontPC98.nextCode(this.charCode));
			this.onShowChar();
		},
	},
	created: function(){
		this.font = fontManager.loadFontLC();
		if (!this.font) {
			this.font = undefined;
		}
		var lastCharCode = localStorage.getItem('searchCharCode');
		this.search.charCode = FontPC98.isValidCode(lastCharCode) ? FontPC98.codeNumToStr(parseInt(lastCharCode, 16)) : '20';
		if (this.font) {
			this.$nextTick(function () {
				this.onShowChar();
			});
		}
	},
	beforeDestroy: function(){
		if (this.font) {
			fontManager.saveFontLC(this.font);
		}
	},
});

/* Save current font to localstorage when closing page or refreshing */
window.addEventListener('beforeunload', function(){
	vm.$destroy();
});

/* Save current font to localstorage when hiding page */
(function(){
	var hidden, visibilityChange; 
	if (typeof document.hidden !== "undefined") {
		hidden = "hidden";
		visibilityChange = "visibilitychange";
	} else if (typeof document.mozHidden !== "undefined") {
		hidden = "mozHidden";
		visibilityChange = "mozvisibilitychange";
	} else if (typeof document.msHidden !== "undefined") {
		hidden = "msHidden";
		visibilityChange = "msvisibilitychange";
	} else if (typeof document.webkitHidden !== "undefined") {
		hidden = "webkitHidden";
		visibilityChange = "webkitvisibilitychange";
	}

	if (typeof document.addEventListener !== "undefined" && typeof document[hidden] !== "undefined") {
		document.addEventListener(visibilityChange, function(){
			if (vm.font) {
				fontManager.saveFontLC(vm.font);
			}
		}, false);
	}
})();
