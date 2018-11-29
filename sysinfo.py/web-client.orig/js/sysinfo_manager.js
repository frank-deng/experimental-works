WebSocketConnection = function(__url__, __name__){
	var watchdogInterval = 10000;
	var msgTimeout = 5;
	var url = __url__, name = __name__;
	var socket = undefined, watchdog = undefined;
	var msgHandler = (function(){}), errorHandler = (function(){});
	var lastMsgTime = undefined;

	var nowTime = function(){
		return Number(String(new Date().getTime()).slice(0,10));
	}
	var doConnect = function(){
		try {
			socket = new WebSocket(url);
			socket.addEventListener('open', function(event) { 
				socket.onmessage = function(event) { 
					lastMsgTime = nowTime();
					try {
						var sysinfo = JSON.parse(event.data);
						msgHandler(sysinfo, name);
					} catch(e) {
						errorHandler(e, name, event.data);
					}
				}; 
				socket.onclose = function(event) {
					lastMsgTime = undefined;
					errorHandler('closed', name, event);
				}
			});
			socket.addEventListener('error', function(event) { 
				lastMsgTime = undefined;
				errorHandler(event, name);
			});
		} catch(e) {
			socket = lastMsgTime = undefined;
			errorHandler(e, name);
		}
	}
	this.setMsgHandler = function(handler){
		msgHandler = handler;
	}
	this.setErrorHandler = function(handler){
		errorHandler = handler;
	}
	this.open = function(){
		doConnect();
		watchdog = setInterval(function(){
			if (undefined == socket || WebSocket.CLOSED == socket.readyState) {
				doConnect();
			}
			if (lastMsgTime != undefined) {
				var timeout = nowTime() - lastMsgTime;
				if (timeout > msgTimeout) {
					errorHandler('timeout', name, {timeout:timeout});
				}
			}
		}, watchdogInterval);
	}
	this.close = function(){
		if (watchdog) {
			clearInterval(watchdog);
		}
		socket.close();
	}
}
SysinfoManager = function() {
	var server = {};
	this.setServerList = function(list) {
		for (var name in list) {
			server[name] = new WebSocketConnection(list[name], name);
		}
	}
	this.setErrorHandler = function(handler) {
		for (var name in server) {
			server[name].setErrorHandler(handler);
		}
	}
	this.setMessageHandler = function(handler) {
		for (var name in server) {
			server[name].setMsgHandler(handler);
		}
	}
	this.start = function(){
		for(var name in server) {
			server[name].open();
		}
	}
	window.addEventListener('beforeunload', function(){
		for (var name in server) {
			server[name].close();
		}
	});
}

