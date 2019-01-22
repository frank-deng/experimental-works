<!DOCTYPE html>
<html>
	<head>
		<meta name='viewport' id='viewport' content='width=device-width,initial-scale=1.0,minimum-scale=1.0,maximum-scale=1.0,user-scalable=no'/>
		<meta charset='UTF-8'/>
		<meta name='wap-font-scale' content='no'/>
		<title>{{path}} - File Manager</title>
		<style type='text/css'>
body{margin:0 auto;padding:33px 0 0 0;max-width:800px;font-family:sans,arial,"微软雅黑";}
ul{margin:0;padding:0;}
li{margin:0;padding:0;list-style:none;}
a{text-decoration:none;}
.table{display:table;width:100%;height:34px;table-layout:fixed;}
.table-inner{display:table-cell;width:100%;height:100%;text-align:left;vertical-align:middle;}
.header{position:fixed;z-index:1000;left:0;right:0;top:0;background-color:#f7f7f7;border-bottom:1px solid #cccccc;margin:0;padding:0;font-size:16px;line-height:32px;}
.header-inner{max-width:780px;margin:0 auto;padding:0 10px;color:#333333;vertical-align:middle;}
.filelist{display:block;padding:4px 10px;color:#333333;border-radius:4px;overflow-x:hidden;overflow-y:auto;}
.filelist .filename{display:block;margin-left:44px;word-wrap:break-word;min-height:34px;font-size:16px;}
.filelist.file .filename{min-height:22px;}
.filelist .filesize{margin-left:44px;font-size:10px;color:grey;min-height:12px;}
#dir_navigator {color:#777;}
#dir_navigator a{color:#333;}
svg.icon{display:block;float:left;width:34px;height:34px;}
.link-root{display:inline-block;height:30px;}
.icon-root{width:22px;height:22px;vertical-align:middle;border:none;}
		</style>
% if browser_type == 'pc':
		<style type='text/css' id='style_pc'>
.filelist:hover{background-color:#eee;opacity:0.5;}
#dir_navigator a:hover{opacity:0.5;}
		</style>
% end
% if browser_type == 'oldie':
		<style type='text/css' id='style_pc'>
.icon-root{margin-top:-3px;}
.filelist:hover{background-color:#eee;}
.filelist .filename{margin-left:0;}
.filelist .filesize{margin-left:0;}
		</style>
% end
	</head>
	<body>
		<svg display="none" version="1.1" xmlns="http://www.w3.org/2000/svg">
			<g id="icon-folder" fill="#ffc364"><path d="M1728 608v704q0 92-66 158t-158 66h-1216q-92 0-158-66t-66-158v-960q0-92 66-158t158-66h320q92 0 158 66t66 158v32h672q92 0 158 66t66 158z"/></g>
			<g id="icon-file" fill="#fa6344"><path d="M1596 380q28 28 48 76t20 88v1152q0 40-28 68t-68 28h-1344q-40 0-68-28t-28-68v-1600q0-40 28-68t68-28h896q40 0 88 20t76 48zm-444-244v376h376q-10-29-22-41l-313-313q-12-12-41-22zm384 1528v-1024h-416q-40 0-68-28t-28-68v-416h-768v1536h1280z"/></g>
			<g id="icon-file-image" fill="#fa6344"><path d="M1596 380q28 28 48 76t20 88v1152q0 40-28 68t-68 28h-1344q-40 0-68-28t-28-68v-1600q0-40 28-68t68-28h896q40 0 88 20t76 48zm-444-244v376h376q-10-29-22-41l-313-313q-12-12-41-22zm384 1528v-1024h-416q-40 0-68-28t-28-68v-416h-768v1536h1280zm-128-448v320h-1024v-192l192-192 128 128 384-384zm-832-192q-80 0-136-56t-56-136 56-136 136-56 136 56 56 136-56 136-136 56z"/></g>
			<g id="icon-file-audio" fill="#fa6344"><path d="M1596 380q28 28 48 76t20 88v1152q0 40-28 68t-68 28h-1344q-40 0-68-28t-28-68v-1600q0-40 28-68t68-28h896q40 0 88 20t76 48zm-444-244v376h376q-10-29-22-41l-313-313q-12-12-41-22zm384 1528v-1024h-416q-40 0-68-28t-28-68v-416h-768v1536h1280zm-788-814q20 8 20 30v544q0 22-20 30-8 2-12 2-12 0-23-9l-166-167h-131q-14 0-23-9t-9-23v-192q0-14 9-23t23-9h131l166-167q16-15 35-7zm417 689q31 0 50-24 129-159 129-363t-129-363q-16-21-43-24t-47 14q-21 17-23.5 43.5t14.5 47.5q100 123 100 282t-100 282q-17 21-14.5 47.5t23.5 42.5q18 15 40 15zm-211-148q27 0 47-20 87-93 87-219t-87-219q-18-19-45-20t-46 17-20 44.5 18 46.5q52 57 52 131t-52 131q-19 20-18 46.5t20 44.5q20 17 44 17z"/></g>
			<g id="icon-file-video" fill="#fa6344"><path d="M1596 380q28 28 48 76t20 88v1152q0 40-28 68t-68 28h-1344q-40 0-68-28t-28-68v-1600q0-40 28-68t68-28h896q40 0 88 20t76 48zm-444-244v376h376q-10-29-22-41l-313-313q-12-12-41-22zm384 1528v-1024h-416q-40 0-68-28t-28-68v-416h-768v1536h1280zm-640-896q52 0 90 38t38 90v384q0 52-38 90t-90 38h-384q-52 0-90-38t-38-90v-384q0-52 38-90t90-38h384zm492 2q20 8 20 30v576q0 22-20 30-8 2-12 2-14 0-23-9l-265-266v-90l265-266q9-9 23-9 4 0 12 2z"/></g>
			<g id="icon-file-word" fill="#fa6344"><path d="M1596 380q28 28 48 76t20 88v1152q0 40-28 68t-68 28h-1344q-40 0-68-28t-28-68v-1600q0-40 28-68t68-28h896q40 0 88 20t76 48zm-444-244v376h376q-10-29-22-41l-313-313q-12-12-41-22zm384 1528v-1024h-416q-40 0-68-28t-28-68v-416h-768v1536h1280zm-1175-896v107h70l164 661h159l128-485q7-20 10-46 2-16 2-24h4l3 24q1 3 3.5 20t5.5 26l128 485h159l164-661h70v-107h-300v107h90l-99 438q-5 20-7 46l-2 21h-4l-3-21q-1-5-4-21t-5-25l-144-545h-114l-144 545q-2 9-4.5 24.5t-3.5 21.5l-4 21h-4l-2-21q-2-26-7-46l-99-438h90v-107h-300z"/></g>
			<g id="icon-file-excel" fill="#fa6344"><path d="M1596 380q28 28 48 76t20 88v1152q0 40-28 68t-68 28h-1344q-40 0-68-28t-28-68v-1600q0-40 28-68t68-28h896q40 0 88 20t76 48zm-444-244v376h376q-10-29-22-41l-313-313q-12-12-41-22zm384 1528v-1024h-416q-40 0-68-28t-28-68v-416h-768v1536h1280zm-979-234v106h281v-106h-75l103-161q5-7 10-16.5t7.5-13.5 3.5-4h2q1 4 5 10 2 4 4.5 7.5t6 8 6.5 8.5l107 161h-76v106h291v-106h-68l-192-273 195-282h67v-107h-279v107h74l-103 159q-4 7-10 16.5t-9 13.5l-2 3h-2q-1-4-5-10-6-11-17-23l-106-159h76v-107h-290v107h68l189 272-194 283h-68z"/></g>
			<g id="icon-file-powerpoint" fill="#fa6344"><path d="M1596 380q28 28 48 76t20 88v1152q0 40-28 68t-68 28h-1344q-40 0-68-28t-28-68v-1600q0-40 28-68t68-28h896q40 0 88 20t76 48zm-444-244v376h376q-10-29-22-41l-313-313q-12-12-41-22zm384 1528v-1024h-416q-40 0-68-28t-28-68v-416h-768v1536h1280zm-992-234v106h327v-106h-93v-167h137q76 0 118-15 67-23 106.5-87t39.5-146q0-81-37-141t-100-87q-48-19-130-19h-368v107h92v555h-92zm353-280h-119v-268h120q52 0 83 18 56 33 56 115 0 89-62 120-31 15-78 15z"/></g>
			<g id="icon-file-text" fill="#fa6344"><path d="M1596 380q28 28 48 76t20 88v1152q0 40-28 68t-68 28h-1344q-40 0-68-28t-28-68v-1600q0-40 28-68t68-28h896q40 0 88 20t76 48zm-444-244v376h376q-10-29-22-41l-313-313q-12-12-41-22zm384 1528v-1024h-416q-40 0-68-28t-28-68v-416h-768v1536h1280zm-1024-864q0-14 9-23t23-9h704q14 0 23 9t9 23v64q0 14-9 23t-23 9h-704q-14 0-23-9t-9-23v-64zm736 224q14 0 23 9t9 23v64q0 14-9 23t-23 9h-704q-14 0-23-9t-9-23v-64q0-14 9-23t23-9h704zm0 256q14 0 23 9t9 23v64q0 14-9 23t-23 9h-704q-14 0-23-9t-9-23v-64q0-14 9-23t23-9h704z"/></g>
			<g id="icon-file-pdf" fill="#fa6344"><path d="M1596 380q28 28 48 76t20 88v1152q0 40-28 68t-68 28h-1344q-40 0-68-28t-28-68v-1600q0-40 28-68t68-28h896q40 0 88 20t76 48zm-444-244v376h376q-10-29-22-41l-313-313q-12-12-41-22zm384 1528v-1024h-416q-40 0-68-28t-28-68v-416h-768v1536h1280zm-514-593q33 26 84 56 59-7 117-7 147 0 177 49 16 22 2 52 0 1-1 2l-2 2v1q-6 38-71 38-48 0-115-20t-130-53q-221 24-392 83-153 262-242 262-15 0-28-7l-24-12q-1-1-6-5-10-10-6-36 9-40 56-91.5t132-96.5q14-9 23 6 2 2 2 4 52-85 107-197 68-136 104-262-24-82-30.5-159.5t6.5-127.5q11-40 42-40h22q23 0 35 15 18 21 9 68-2 6-4 8 1 3 1 8v30q-2 123-14 192 55 164 146 238zm-576 411q52-24 137-158-51 40-87.5 84t-49.5 74zm398-920q-15 42-2 132 1-7 7-44 0-3 7-43 1-4 4-8-1-1-1-2t-.5-1.5-.5-1.5q-1-22-13-36 0 1-1 2v2zm-124 661q135-54 284-81-2-1-13-9.5t-16-13.5q-76-67-127-176-27 86-83 197-30 56-45 83zm646-16q-24-24-140-24 76 28 124 28 14 0 18-1 0-1-2-3z"/></g>
			<g id="icon-file-archive" fill="#fa6344"><path d="M768 384v-128h-128v128h128zm128 128v-128h-128v128h128zm-128 128v-128h-128v128h128zm128 128v-128h-128v128h128zm700-388q28 28 48 76t20 88v1152q0 40-28 68t-68 28h-1344q-40 0-68-28t-28-68v-1600q0-40 28-68t68-28h896q40 0 88 20t76 48zm-444-244v376h376q-10-29-22-41l-313-313q-12-12-41-22zm384 1528v-1024h-416q-40 0-68-28t-28-68v-416h-128v128h-128v-128h-512v1536h1280zm-627-721l107 349q8 27 8 52 0 83-72.5 137.5t-183.5 54.5-183.5-54.5-72.5-137.5q0-25 8-52 21-63 120-396v-128h128v128h79q22 0 39 13t23 34zm-141 465q53 0 90.5-19t37.5-45-37.5-45-90.5-19-90.5 19-37.5 45 37.5 45 90.5 19z"/></g>
			<g id="icon-file-code" fill="#fa6344"><path d="M1596 380q28 28 48 76t20 88v1152q0 40-28 68t-68 28h-1344q-40 0-68-28t-28-68v-1600q0-40 28-68t68-28h896q40 0 88 20t76 48zm-444-244v376h376q-10-29-22-41l-313-313q-12-12-41-22zm384 1528v-1024h-416q-40 0-68-28t-28-68v-416h-768v1536h1280zm-928-896q8-11 21-12.5t24 6.5l51 38q11 8 12.5 21t-6.5 24l-182 243 182 243q8 11 6.5 24t-12.5 21l-51 38q-11 8-24 6.5t-21-12.5l-226-301q-14-19 0-38zm802 301q14 19 0 38l-226 301q-8 11-21 12.5t-24-6.5l-51-38q-11-8-12.5-21t6.5-24l182-243-182-243q-8-11-6.5-24t12.5-21l51-38q11-8 24-6.5t21 12.5zm-620 461q-13-2-20.5-13t-5.5-24l138-831q2-13 13-20.5t24-5.5l63 10q13 2 20.5 13t5.5 24l-138 831q-2 13-13 20.5t-24 5.5z"/></g>
		</svg>
		<div class='header'><div class='header-inner' id='dir_navigator'>
% if browser_type == 'oldie':
			<a class='link-root' href='/'><img class='icon-root' src='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABYAAAAWCAYAAADEtGw7AAAA1UlEQVQ4jd3UvUqCYRgG4CuDwqZEF/FIXDqApiabPIQOwjNwCJ0aXZodbWpo6QCiAxClQelnCeN18BM+ROXr+wHxhpt3ebh4lvfhGHORJ9ZAD1ME/OAFtyilRZv4iMBtfcR5mk33oev2ovkyLpPA/QRowAKD6A0Yob4PniSEt3W4Cy1nQAN+cbaJlnCXEZ7hZBN+yIgGvOEqjrZyQOPtrjd/zhkOaMO8APgVPguAv+GpAHgM1wXA96J0ckTfURXLjdVp/EsJfln9h5odOUXln0104Q47SwJpCVeUDnONAAAAAElFTkSuQmCC'/></a> / 
% else:
			<a class='link-root' href='/'>
				<svg class='icon-root' width="1920" height="1920" viewBox="0 0 1920 1920" xmlns="http://www.w3.org/2000/svg"><path d="m 1920,1280 q 0,159 -112.5,271.5 Q 1695,1664 1536,1664 l -1088,0 Q 263,1664 131.5,1532.5 0,1401 0,1216 0,1084 71,974.5 142,865 258,811 q -2,-28 -2,-43 0,-212 150,-362 150,-150 362,-150 158,0 286.5,88 128.5,88 187.5,230 70,-62 166,-62 106,0 181,75 75,75 75,181 0,75 -41,138 129,30 213,134.5 84,104.5 84,239.5 z" fill="#333"/></svg>
			</a> / 
% end
% nav_all = path.split('/')[1:-1];
% for i in range(len(nav_all)):
	<a href='/{{'/'.join(nav_all[:i+1])}}/'>{{nav_all[i]}}</a> / 
% end
		</div></div>
% for dir in dirs:
		<div><a class='filelist' href="{{dir}}/">
			<svg class='icon' viewBox="0 0 1792 1792"><use xlink:href="#icon-folder"></use></svg>
			<span class='filename'><span class='table'><span class='table-inner'>{{dir}}/</span></span></span>
		</a></div>
% end
% for file in files:
% ext = file['name'].split('.')[-1].lower();
		<div><a class='filelist file' target='_blank' href='{{file['name']}}' filename='{{file['name']}}'>
% if browser_type != 'oldie':
% if ext in ('jpg', 'gif', 'jpeg', 'png', 'bmp', 'svg', 'tif', 'tiff', 'dib', 'rle', 'wmf', 'emf', 'eps', 'ai'):
			<svg class='icon' viewBox="0 0 1792 1792"><use xlink:href="#icon-file-image"></use></svg>
% elif ext in ('wav', 'mp3', 'flac', 'ogg', 'ape', 'wma', 'amr'):
			<svg class='icon' viewBox="0 0 1792 1792"><use xlink:href="#icon-file-audio"></use></svg>
% elif ext in ('avi', 'mpg', 'mpeg', 'ogv', 'mp4', 'wmv', '3gp', 'flv', 'f4v'):
			<svg class="icon" viewBox="0 0 1792 1792"><use xlink:href="#icon-file-video"></use></svg>
% elif ext in ('doc', 'docx'):
			<svg class="icon" viewBox="0 0 1792 1792"><use xlink:href="#icon-file-word"></use></svg>
% elif ext in ('xls', 'xlsx', 'xlsm'):
			<svg class="icon" viewBox="0 0 1792 1792"><use xlink:href="#icon-file-excel"></use></svg>
% elif ext in ('ppt', 'pptx', 'pps', 'ppsx'):
			<svg class="icon" viewBox="0 0 1792 1792"><use xlink:href="#icon-file-powerpoint"></use></svg>
% elif ext in ('txt', 'htm', 'html'):
			<svg class="icon" viewBox="0 0 1792 1792"><use xlink:href="#icon-file-text"></use></svg>
% elif ext in ('pdf'):
			<svg class="icon" viewBox="0 0 1792 1792"><use xlink:href="#icon-file-pdf"></use></svg>
% elif ext in ('rar', 'zip', 'gz', 'bz2', '7z', 'arj', 'lha'):
			<svg class="icon" viewBox="0 0 1792 1792"><use xlink:href="#icon-file-archive"></use></svg>
% elif ext in ('ini', 'conf', 'py', 'c', 'cpp', 'h', 'hpp', 'hxx', 'cxx', 'asm', 'pl', 'rb', 'js', 'asp', 'jsp', 'php', 'java', 'xml', 'xslt', 'xsl'):
			<svg class="icon" viewBox="0 0 1792 1792"><use xlink:href="#icon-file-code"></use></svg>
% else:
			<svg class="icon" viewBox="0 0 1792 1792"><use xlink:href="#icon-file"></use></svg>
% end
% end
			<span class='filename'>{{file['name']}}</span>
% size = file['size'];
			<div class='filesize'>
% if size > 1073741824:
				{{'%.1fG'%(float(size)/1073741824.0)}}
% elif size > 1048576:
				{{'%.1fM'%(float(size)/1048576.0)}}
% elif size > 1024:
				{{'%.1fK'%(float(size)/1024.0)}}
% else:
				{{size}}
% end
			</div>
		</a></div>
% end
	</body>
	<script type='text/javascript'>
function isOldIE(){return (/MSIE (7.0|8.0)/.test(window.navigator.userAgent)?true:false)}

var current_dir = decodeURIComponent(window.location.pathname);
var dir_navigator = document.getElementById('dir_navigator');
var table_process_ext = [
	{match:/\.(jpg|jpeg|gif|png|bmp)$/i, action:function(e,filename,href){
		e.onclick = function(){
			window.open(current_dir+'?t=image-viewer&f='+filename);
			return false;
		}
	}},
	{match:/\.(svg)$/i, action:function(e,filename,href){
		if (!isOldIE()){
			e.onclick = function(){
				window.open(current_dir+'?t=image-viewer&f='+filename);
				return false;
			}
		}
	}},
];
var files_all = document.querySelectorAll('.filelist.file');
for (var i = 0; i < files_all.length; i++) {
	var file_selector = files_all[i];
	var filename = file_selector.getAttribute('filename');
	var href = file_selector.getAttribute('href');
	for (var j = 0; j < table_process_ext.length; j++) {
		var p = table_process_ext[j];
		if (p && p.match.test(filename)) {
			p.action(file_selector, encodeURIComponent(filename), href);
		}
	}
}

//Adjust body's top distance
function resizeTop(){
	document.body.style.paddingTop = dir_navigator.offsetHeight + 'px';
}
window.onresize = resizeTop;
resizeTop();
	</script>
</html>
