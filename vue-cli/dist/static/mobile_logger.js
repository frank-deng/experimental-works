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
		root.MobileLogger = factory();
	}
}(this, function() {
	'use strict'
	var htmlspecialchars = function(str){
		var replaceTable={
			'&':'&amp;',
			'<':'&lt;',
			'>':'&gt;',
			'"':'&quot;',
			"'":'&#039;'
		};
		return str.replace(/[&<>"']/g, function(m){
			return replaceTable[m];
		});
	}
	function humanSize(size){
		if (isNaN(size)) {
			return undefined;
		}
		if (size < 1000) {
			return parseInt(size)+'B';
		}
		if (size < 1000000) {
			return (size/1000).toFixed(1)+'KB';
		}
		if (size < 1000000000) {
			return (size/1000000).toFixed(1)+'MB';
		}
		if (size < 1000000000000) {
			return (size/1000000000).toFixed(1)+'GB';
		}
	}
	function humanTime(sec){
		if (sec < 1) {
			return parseInt(sec*1000)+'ms';
		}
		if (sec < 60) {
			return sec.toFixed(1)+'s';
		}
		if (sec < 3600) {
			return (sec/60).toFixed(1)+'m';
		}
		if (sec < 216000) {
			return (sec/3600).toFixed(1)+'h';
		}
	}

	var _slice = Array.prototype.slice;
	var logText = '';
	var elem = undefined;
	var autoScroll = true;
	var logHandler = function(e){
		var t = htmlspecialchars(String(e));
		if (!elem) {
			logText += t+'\n';
			return;
		}
		try {
			elem.innerHTML += t+'\n';
			if (autoScroll) {
				elem.scrollTop = elem.scrollHeight;
				elem.scrollLeft = 0;
			}
		} catch(e) {
			elem = undefined;
			throw e;
		}
	}
	var consoleLog = console.log;
	var consoleWarn = console.warn;
	var consoleDir = console.dir;
	var consoleError = console.error;
	console.log = function(){
		var arg = arguments;
		try{
			consoleLog.apply(this, _slice.call(arg));
		}catch(e){}
		logHandler(arg.length > 1 ? _slice.call(arg).join(' ') : arg[0]);
	}
	console.warn = function(){
		var arg = arguments;
		try{
			consoleWarn.apply(this, _slice.call(arg));
		}catch(e){}
		logHandler('[Warn] '+(arg.length > 1 ? _slice.call(arg).join(' ') : arg[0]));
	}
	console.dir = function(){
		var arg = arguments;
		try{
			consoleDir.apply(this, _slice.call(arg));
		}catch(e){}
		for (var i = 0; i < arg.length; i++){
			var e = arg[i];
			if ('object' == typeof(e) && null !== e) {
				for (var k in e) {
					logHandler('['+typeof(e[k])+'] '+k+': '+String(e[k])+'');
				}
			} else {
				logHandler(e);
			}
		}
	}
	console.error = function(){
		var arg = arguments;
		try{
			consoleError.apply(this, _slice.call(arg));
		}catch(e){}
		logHandler('[Error] '+(arg.length > 1 ? _slice.call(arg).join(' ') : arg[0]));
	}
	window.addEventListener('error', function(e){
		logHandler('[Error] '+e.message+'\n'+e.filename+' : '+e.lineno);
	});

	//Recording XHR
	var xhrproto = XMLHttpRequest.prototype
	xhrproto._send = xhrproto.send;
	xhrproto._open = xhrproto.open;
	xhrproto.send = function(content){
		this.startTime = new Date().getTime() / 1000;
		this._send(content);
	}
	xhrproto.open = function(){
		this.method = arguments[0];
		this.requestURL = arguments[1];
		return this._open.apply(this, _slice.call(arguments));
	}
	var _XMLHttpRequest = XMLHttpRequest;
	XMLHttpRequest = function(){
		var xhr = new _XMLHttpRequest();
		xhr.addEventListener('load', function(e){
			this.endTime = new Date().getTime() / 1000;
			logHandler([
				'[XHR]',
				this.method,
				this.responseURL,
				this.status,
				this.statusText,
				humanTime(this.endTime - this.startTime),
				humanSize(this.getResponseHeader('Content-Size') || this.response.length),
			].join(' '));
		});
		xhr.addEventListener('timeout', function(e){
			this.endTime = new Date().getTime() / 1000;
			var totalTime = this.endTime - this.startTime;
			logHandler([
				'[XHR]',
				this.method,
				this.requestURL,
				'Timeout',
				humanTime(this.endTime - this.startTime),
			].join(' '));
		});
		xhr.addEventListener('error', function(e){
			this.endTime = new Date().getTime() / 1000;
			var totalTime = this.endTime - this.startTime;
			logHandler([
				'[XHR]',
				this.method,
				this.requestURL,
				'Failed',
				humanTime(this.endTime - this.startTime),
			].join(' '));
		});
		xhr.addEventListener('abort', function(e){
			this.endTime = new Date().getTime() / 1000;
			var totalTime = this.endTime - this.startTime;
			logHandler([
				'[XHR]',
				this.method,
				this.requestURL,
				'Aborted',
				humanTime(this.endTime - this.startTime),
			].join(' '));
		});
		return xhr;
	}

	return {
		bind : function(e){
			if (undefined !== elem) {
				throw new Error('Element already bound');
			}
			try {
				if (!e || !e.nodeName) {
					throw new Error('Invalid DOM element');
				}
				elem = e;
				var estyle = elem.style;
				estyle.whiteSpace = 'pre';
				estyle.overflow = 'auto';
				elem.innerHTML = logText;
				if (autoScroll) {
					elem.scrollTop = elem.scrollHeight;
					elem.scrollLeft = 0;
				}
				logText = '';
			} catch(e) {
				elem = undefined;
				throw new Error('Initialization Failed: ' + e.message);
			}
		},
		autoScroll : function(toggle){
			autoScroll = toggle;
		},
		unbind : function(){
			if (undefined === elem) {
				throw new Error('Element already unbound');
			}
			elem = undefined;
		},
	};
}));
