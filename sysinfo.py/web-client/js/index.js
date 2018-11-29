var nowTime = function(){
	return Number(String(new Date().getTime()).slice(0,10));
}

var app = angular.module('sysinfo', ['ngWebSocket','ngSanitize',  'pascalprecht.translate']);
app.factory('wsManager', function ($websocket, $interval) {
	var wsConn = {}, wsNameTable = {};
	return {
		add: function(id, url, func){
			wsConn[id] = {conn: $websocket(url), timeStamp: nowTime()};
			wsNameTable[wsConn[id].conn.socket.url] = id;
		},
		remove: function(id) {
			wsConn[id].conn.close();
			delete wsNameTable[wsConn[id].conn.socket.url];
			delete wsConn[id];
		},
		onMessage: function(id, func) {
			if ('function' !== typeof(func)) {
				throw "Function must be provided.";
			}
			wsConn[id].conn.onMessage(function(msg){
				wsConn[wsNameTable[msg.target.url]].timeStamp = nowTime();
				func(wsNameTable[msg.target.url], msg);
			});
		},
		onClose: function(id, func) {
			if ('function' !== typeof(func)) {
				throw "Function must be provided.";
			}
			wsConn[id].conn.onClose(function(e){
				func(wsNameTable[e.target.url], e);
			});
		},
		onError: function(id, func) {
			if ('function' !== typeof(func)) {
				throw "Function must be provided.";
			}
			wsConn[id].conn.onError(function(e){
				func(wsNameTable[e.target.url], e);
			});
		},
	};
});
app.filter('filter_percent', function(){
	return function(input, digits = 0, multi=100) {
		return (input*multi).toFixed(digits)+'%';
	}
});
app.filter('filter_temperature', function(){
	return function(input) {
		return input+'°C';
	}
});
app.filter('filter_boot_time', function(){
	return function(input) {
		return input.replace('T', ' ');
	}
});
app.filter('filter_network_speed', function(){
	return function(input) {
		var n, unit;
		if (n < 0) {
			return '';
		} else if (input > 1024*1024*1024*1024) {
			n = input/1024/1024/1024/1024;
			n = n.toFixed(1);
			unit = 'TB/s';
		} else if (input > 1024*1024*1024) {
			n = input/1024/1024/1024;
			n = n.toFixed(1);
			unit = 'GB/s';
		} else if (input > 1024*1024) {
			n = input/1024/1024;
			n = n.toFixed(1);
			unit = 'MB/s';
		} else if (input > 1024) {
			n = input/1024;
			n = n.toFixed(1);
			unit = 'KB/s';
		} else {
			n = input/1024;
			n = n.toFixed(0);
			unit = 'B/s';
		}
		return String(n)+' '+unit;
	}
});
app.controller('sysinfoController', function($scope, $http, $translate, wsManager){
	$scope.sysinfo = {};
	$http({
		method:'GET',
		url:'serverlist.json',
	}).then(function(resp){
		angular.forEach(resp.data, function(serverURL,serverName){
			$scope.sysinfo[serverName] = {stat : 'connecting', data: undefined};
			wsManager.add(serverName, serverURL);
			wsManager.onMessage(serverName, function(name, msg){
				var sysinfo = JSON.parse(msg.data);
				$scope.sysinfo[name].stat = 'normal';
				$scope.sysinfo[name].data = sysinfo;
			});
			wsManager.onClose(serverName, function(name){
				$scope.sysinfo[name] = undefined;
			});
			wsManager.onError(serverName, function(name){
				$scope.sysinfo[name] = undefined;
			});
		});
	});
});

app.config(function($translateProvider){
	$translateProvider
		.useSanitizeValueStrategy('sanitizeParameters')
		.translations('en', {
			'title': 'System Information',
			'msg_offline': '(Offline)',
			'connecting': 'Connecting...',
			'offline_warning': '<b>WARNING: </b>No message received for {{seconds}} seconds.',
			'cpu_usage': 'CPU Usage',
			'mem_usage': 'Memory Usage',
			'cpu_temp': 'CPU Temperature',
			'gpu_temp': 'GPU Temperature',
			'battery_level': 'Battery Level',
			'boot_time': 'Boot Time',
			'network_speed': 'Network Speed',
			'network_rx_speed': 'RX',
			'network_tx_speed': 'TX',
		})
		.translations('zh', {
			'title': '系统信息',
			'msg_offline': '（离线）',
			'connecting': '连接中……',
			'offline_warning': '<b>注意：</b>超过{{seconds}}秒没有收到信息。',
			'cpu_usage': 'CPU使用率',
			'mem_usage': '内存使用率',
			'cpu_temp': 'CPU温度',
			'gpu_temp': 'GPU温度',
			'battery_level': '电池电量',
			'boot_time': '开机时间',
			'network_speed': '网络速度',
			'network_rx_speed': '下行',
			'network_tx_speed': '上行',
		})
		.translations('ja', {
			'title': 'システム情報',
			'msg_offline': '（オフライン）',
			'connecting': '接続中……',
			'offline_warning': '<b>警告：</b>{{seconds}}秒以内には情報ではありません。',
			'cpu_usage': 'CPU使用率',
			'mem_usage': 'メモリ使用率',
			'cpu_temp': 'CPU温度',
			'gpu_temp': 'GPU温度',
			'battery_level': '電池電量',
			'boot_time': 'ブート時間',
			'network_speed': 'ネットワーク速度',
			'network_rx_speed': '下り速度',
			'network_tx_speed': '上り速度',
		})
		.translations('ru', {
			'title': 'Система Информации',
			'msg_offline': '(В Автономном Режиме)',
			'connecting': 'В Связи...',
			'offline_warning': '<b>ВНИМАНИЕ: </b>{{seconds}} секунды не информации.',
			'cpu_usage': 'Использование ЦПУ',
			'mem_usage': 'Использование ОЗУ',
			'cpu_temp': 'ЦПУ Температура',
			'gpu_temp': 'GPU Температура',
			'battery_level': 'Уровень Заряда Батареи',
			'boot_time': 'Время Загрузки',
			'network_speed': 'Скорость Сети',
			'network_rx_speed': 'RX',
			'network_tx_speed': 'TX',
		})
		.registerAvailableLanguageKeys(['en', 'zh', 'ja', 'ru'], {
			'en*': 'en',
			'zh*': 'zh',
			'ja*': 'ja',
			'ru*': 'ru',
		})
		.determinePreferredLanguage();
});

