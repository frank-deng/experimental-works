<!DOCTYPE html>
<html>
	<head>
		<meta name='viewport' id='viewport' content='width=device-width,initial-scale=1.0,minimum-scale=1.0,maximum-scale=1.0,user-scalable=no'/>
		<meta charset='UTF-8'/>
		<meta name='wap-font-scale' content='no'/>
		<title>Image Viewer</title>
		<script type='text/javascript' src='/.res/js/touch.min.js'></script>
		<style type='text/css'>
body{user-select:none;-moz-user-select:none;-webkit-user-select:none;font-family:sans,arial,"微软雅黑";background-color:#FFFFFF;padding:0;margin:0;overflow:hidden;text-align:center;}
img{image-orientation:from-image;}
.table-center{display:table;width:100%;height:100%;}
.table-cell-center{display:table-cell;width:100%;height:100%;text-align:center;vertical-align:middle;}
#swipe_receiver{position:fixed;left:0;right:0;top:0;bottom:0;overflow:hidden;z-index:100;}
#image_viewer{position:fixed;left:0;right:0;top:0;bottom:0;overflow:hidden;}
#image_viewer .text{display:none;color:#000000;}
#image_show{cursor:pointer;}
#image_show img{display:inline-block;}
#image_viewer.loading #image_show, #image_viewer.error #image_show{display:none;}
#image_viewer.loading .text#loading{display:block;}
#image_viewer.error .text#error{display:block;}
#controls{display:none;}
		</style>
	</head>
	<body>
% if browser_type in ('pad', 'mobile'):
		<div id='swipe_receiver'></div>
% end
		<div id='image_viewer' class='loading'>
			<div class='table-center'><div class='table-cell-center'><img id='image_show' alt=''/><span class='text' id='loading'>Loading...</span><span class='text' id='error'>Failed to load image.</span></div></div>
		</div>
% for file in files:
% ext = file['name'].split('.')[-1].lower();
% if ext in ('jpg', 'jpeg', 'gif', 'png', 'bmp'):
		<input type='hidden' class='image-file' href='{{file['name']}}' filename='{{file['name']}}'/>
% elif ext == 'svg' and browser_type != 'oldie':
		<input type='hidden' class='image-file' href='{{file['name']}}' filename='{{file['name']}}'/>
% end
% end
		<input type='hidden' id='file_selected' value="{{file_open}}"/>
	</body>
	<script type='text/javascript'>
var image_viewer = document.getElementById('image_viewer');
var img_show = document.getElementById('image_show');
var img_selected = undefined;
var img_files = document.querySelectorAll('.image-file');
var current_file = document.getElementById('file_selected').value;

function centerImage(e){
	e.style.marginLeft = -e.offsetWidth / 2 + 'px';
	e.style.marginRight = -e.offsetWidth / 2 + 'px';
}
img_show.onload = function(){
	image_viewer.removeAttribute('class');
	centerImage(this);
}
img_show.onerror = function(){
	image_viewer.setAttribute('class', 'error');
}
function select_image(elem){
	image_viewer.setAttribute('class', 'loading');
	img_show.setAttribute('src', elem.getAttribute('href'));
	var img_num = elem.getAttribute('number');
	document.title = '[' + img_num + '/' + img_files.length + '] ' + elem.getAttribute('filename') + ' - Image Viewer';
	img_selected = elem;
}
function prev_image(){
	var idx = Number(img_selected.getAttribute('number')) - 1;
	select_image(img_files[idx <= 0 ? img_files.length - 1 : idx - 1]);
}
function next_image(){
	var idx = Number(img_selected.getAttribute('number')) - 1;
	select_image(img_files[idx >= img_files.length - 1 ? 0 : idx + 1]);
}

for (var i = 0; i < img_files.length; i++) {
	img_files[i].setAttribute('number', i+1);
	if (decodeURIComponent(current_file) == img_files[i].getAttribute('filename')) {
		select_image(img_files[i]);
	}
}
if (!img_selected) {
	select_image(img_files[0]);
}

//Handle the large image's size
function onResize(){
	img_show.style.maxWidth = image_viewer.offsetWidth + 'px';
	img_show.style.maxHeight = image_viewer.offsetHeight + 'px';
	centerImage(img_show);
}
window.onresize = onResize;
onResize();
	</script>
% if browser_type in ('mobile', 'pad'):
	<script type='text/javascript'>
touch.on('#swipe_receiver', 'swiperight', function(e){
	prev_image();
});
touch.on('#swipe_receiver', 'swipeleft', function(e){
	next_image();
});
touch.on('#swipe_receiver', 'tap', function(e){
	window.open(img_show.getAttribute('src'));
});
	</script>
% else:
	<script type='text/javascript'>
//Handle Keyboard
var kbdHandler = function(e){
	var e = e || event;
	switch (e.keyCode || e.which) {
		case 37:	//Left
			prev_image();
		break;
		case 32:	//Space
		case 39:	//Right
			next_image();
		break;
	}
}
if (window.onkeydown) {
	window.onkeydown = kbdHandler;
} else {
	document.onkeydown = kbdHandler;
}

//Handle wheel operation of filelist
var wheel_speed = 100;
var wheel_brake = false;
if (image_viewer.addEventListener) {
	image_viewer.addEventListener('mousewheel', function(e) {
		if (wheel_brake){return;}
		var e = e||event;
		wheel_brake = true;
		setTimeout(function(){wheel_brake = false;},wheel_speed);
		if (e.wheelData) {
			(e.wheelData > 0 ? next_image() : prev_image());
		} else if (e.wheelDelta) {
			(e.wheelDelta < 0 ? next_image() : prev_image());
		}
	});
	image_viewer.addEventListener('wheel', function(e) {
		if (wheel_brake){return;}
		wheel_brake = true;
		setTimeout(function(){wheel_brake = false;},wheel_speed);
		(e.deltaY > 0 ? next_image() : prev_image());
	});
} else {
	image_viewer.attachEvent('onmousewheel', function(e) {
		if (wheel_brake){return;}
		var e = e||event;
		wheel_brake = true;
		setTimeout(function(){wheel_brake = false;},wheel_speed);
		if (e.wheelData) {
			(e.wheelData > 0 ? next_image() : prev_image());
		} else if (e.wheelDelta) {
			(e.wheelDelta < 0 ? next_image() : prev_image());
		}
	});
}

img_show.onclick = function(){
	window.open(img_show.getAttribute('src'));
}
	</script>
% end
</html>
