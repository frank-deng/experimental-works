var langData = {
	'en.sysinfo': {
		'title': 'System Information',
		'msg_offline': '(Offline)',
		'connecting': 'Connecting...',
		'offline_warning': '<b>WARNING: </b>No message received for :seconds seconds.',
		'cpu_usage': 'CPU Usage',
		'mem_usage': 'Memory Usage',
		'cpu_temp': 'CPU Temperature',
		'gpu_temp': 'GPU Temperature',
		'battery_level': 'Battery Level',
		'boot_time': 'Boot Time',
	},
	'zh.sysinfo': {
		'title': '系统信息',
		'msg_offline': '（离线）',
		'connecting': '连接中……',
		'offline_warning': '<b>注意：</b>超过:seconds秒没有收到信息。',
		'cpu_usage': 'CPU使用率',
		'mem_usage': '内存使用率',
		'cpu_temp': 'CPU温度',
		'gpu_temp': 'GPU温度',
		'battery_level': '电池电量',
		'boot_time': '开机时间',
	},
	'ja.sysinfo': {
		'title': 'システム情報',
		'msg_offline': '（オフライン）',
		'connecting': '接続中……',
		'offline_warning': '<b>警告：</b>:seconds秒以内には情報ではありません。',
		'cpu_usage': 'CPU使用率',
		'mem_usage': 'メモリ使用率',
		'cpu_temp': 'CPU温度',
		'gpu_temp': 'GPU温度',
		'battery_level': '電池電量',
		'boot_time': 'ブート時間',
	},
	'ru.sysinfo': {
		'title': 'Система Информации',
		'msg_offline': '(В Автономном Режиме)',
		'connecting': 'В Связи...',
		'offline_warning': '<b>ВНИМАНИЕ: </b>:seconds секунды не информации.',
		'cpu_usage': 'Использование ЦПУ',
		'mem_usage': 'Использование ОЗУ',
		'cpu_temp': 'ЦПУ Температура',
		'gpu_temp': 'GPU Температура',
		'battery_level': 'Уровень Заряда Батареи',
		'boot_time': 'Время Загрузки',
	},
}

var getLocale = function(availLang){
	var userLang;
	if (navigator.languages) {
		for(var i=0; i<navigator.languages.length; i++){
			userLang = navigator.languages[i].slice(0,2);
			if (availLang.indexOf(userLang) >= 0) {
				return userLang;
			}
		}
		return 'en';
	} else {
		if (navigator.language) {
			userLang = navigator.language.slice(0,2);
		} else if (navigator.userLanguage) {
			userLang = navigator.userLanguage.slice(0,2);
		} else if (navigator.browserLanguage) {
			userLang = navigator.browserLanguage.slice(0,2);
		}
		return availLang.indexOf(userLang) >= 0 ? userLang : 'en';
	}
}

window.lang = new Lang({
	messages: langData,
	locale: getLocale(['zh','en','ja','ru']),
	fallback: 'en'
});

DisplayManager = function(__target__){
	var columnInfo = {
		cpu_usage: {
			formatter: function(input) {
				return (input*100).toFixed(1)+'%'
			},
		},
		mem_usage: {
			formatter: function(input) {
				return (input*100).toFixed(1)+'%'
			},
		},
		cpu_temp: {
			formatter: function(input) {
				return input+'°C';
			},
		},
		gpu_temp: {
			formatter: function(input) {
				return input+'°C';
			},
		},
		battery_level: {
			formatter: function(input) {
				return input.toFixed(0)+'%'
			},
		},
		boot_time: {
			formatter: function(input) {
				return input.replace('T', ' ');
			},
		},
	};
	var tplInstance = _.template(document.getElementById('tpl_instance').innerHTML);
	var tplSysinfo = _.template(document.getElementById('tpl_sysinfo').innerHTML);
	var target = __target__;
	var instances = {};

	var drawTable = function(target, content){
		var items = [];
		for (var key in columnInfo) {
			if (undefined == content[key]) {
				continue;
			}
			items.push({id:key, name:'sysinfo.'+key});
		}
		target.querySelector('.sysinfo').innerHTML = tplSysinfo({items:items});
	}
	var updateData = function(target, data) {
		_.each(data, function(val, key) {
			var formatter = columnInfo[key] ? columnInfo[key].formatter : undefined;
			_.each(target.getElementsByClassName(key), function(e){
				e.innerHTML = formatter ? formatter(data[key]) : data[key];
			});
		});
	}

	this.register = function(id, name) {
		target.innerHTML += tplInstance({serverId:id, serverName:name});
	}
	this.renderData = function(id, content){
		var instance = document.getElementById(id);
		if (undefined == instance) {
			throw 'Instance Not Exist.';
		}
		if (!instance.getAttribute('hastable')) {
			drawTable(instance, content);
			instance.setAttribute('hastable', 'hastable');
		}
		instance.querySelector('.timeout').setAttribute('hidden', 'hidden');
		updateData(instance, content);
		instances[id] = content;
	}
	this.renderOffline = function(id) {
		var instance = document.getElementById(id);
		if (undefined == instance) {
			throw 'Instance Not Exist.';
		}
		delete instances[id];
		instance.removeAttribute('hastable');
		instance.querySelector('.timeout').setAttribute('hidden', 'hidden');
		instance.querySelector('.sysinfo').innerHTML = lang.get('sysinfo.msg_offline');
	}
	this.renderTimeout = function(id, seconds) {
		var instance = document.getElementById(id);
		if (undefined == instance) {
			throw 'Instance Not Exist.';
		}
		instance.querySelector('.timeout').innerHTML = lang.get('sysinfo.offline_warning', {seconds:seconds});
		instance.querySelector('.timeout').removeAttribute('hidden');
	}
}

