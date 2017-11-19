<?php
/*
 * Nginx configuration for uploading large file:
 * 
 *   send_timeout 60;
 *   fastcgi_connect_timeout 300;
 *   fastcgi_send_timeout 300;
 *   fastcgi_read_timeout 300;
 *   client_max_body_size 30M;
 *
 * PHP configuration for uploading large file:
 *
 *   memory_limit
 *   upload_max_filesize
 *   post_max_size
 *   max_file_uploads
 *
 *   max_input_time
 *   max_execution_time
 *   request_terminate_timeout
 *   request_slowlog_timeout
*/

if (!ini_get('file_uploads')) {
	http_response_code(500);
	exit('File uploading not supported.');
} else if (isset($_POST['action']) && $_POST['action'] == 'test') {
	exit('OK');
}

function get_new_filename($filename, $idx){
	if (preg_match('/(.*)\\.([^\\.]+)$/', $filename, $match)) {
		return $match[1].'('.$idx.').'.$match[2];
	} else {
		return $filename.'('.$idx.')';
	}
}
function get_random_filename($len = 16){
	$tmp ="";
	$characters=array("A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z","1","2","3","4","5","6","7","8","9");
	for($i=0;$i<$len;$i++) {
		$tmp.=$characters[rand(0,count($characters)-1)];
	}
	return $tmp;
}

//List files uploaded
$upload_dir = dirname($_SERVER['SCRIPT_FILENAME']);
$files_uploaded = Array();
foreach(scandir($upload_dir) as $file) {
	if (is_file($upload_dir.DIRECTORY_SEPARATOR.$file) && strpos($file, '.') !== 0) {
		array_push($files_uploaded, $file);
	}
}

$files_upload_failed = Array();
if (isset($_POST['action']) && $_POST['action'] == 'manage') {
	//Delete files
	foreach($_POST['delete'] as $file_delete) {
		$path_delete = realpath($upload_dir.DIRECTORY_SEPARATOR.$file_delete);
		if (!preg_match('/(^\\.)|(\\/)|(\\\\)/', $file_delete)
			&& is_file($path_delete)
			&& 0===strpos($path_delete, $upload_dir)) {
			$i_del = array_search($_POST['origname'], $file_delete);
			array_slice($_POST['origname'], $i_del, 1);
			array_slice($_POST['newname'], $i_del, 1);
			unlink($path_delete);
		}
	}

	//Add number for filenames when duplicated
	$dup_files = array_count_values($_POST['newname']);
	foreach ($dup_files as $filename => $times) {
		if ($times > 1) {
			$keys = array_keys($_POST['newname'], $filename);
			for ($i = 1; $i < $times; $i++) {
				$_POST['newname'][$keys[$i]] = get_new_filename($_POST['newname'][$keys[$i]], $i);
			}
		}
	}

	//Rename files
	$tmpname_list = Array();
	foreach($_POST['origname'] as $i => $file_orig) {
		$file_new = $_POST['newname'][$i] = trim($_POST['newname'][$i]);
		$path_rename = realpath($upload_dir.DIRECTORY_SEPARATOR.$file_orig);
		if ($file_orig && $file_new && $file_new !== $file_orig
			&& !preg_match('/(^\\.)|(\\/)|(\\\\)/', $file_orig)
			&& !preg_match('/(^\\.)|(\\/)|(\\\\)/', $file_new)
			&& 0===strpos($path_rename, $upload_dir)
			&& is_file($path_rename)) {
			$tmp_name = get_random_filename();
			while(array_search($tmpname_list, $tmp_name)) {
				$tmp_name = get_random_filename();
			}
			array_push($tmpname_list, $tmp_name);
			rename($path_rename, $tmp_name);
		} else {
			array_push($tmpname_list, false);
		}
	}
	foreach($tmpname_list as $i => $temp_filename) {
		if (!$temp_filename) {
			continue;
		}
		$path_rename = realpath($upload_dir.DIRECTORY_SEPARATOR.$temp_filename);
		if ($_POST['newname'][$i]
			&& 0===strpos($path_rename, $upload_dir)
			&& is_file($path_rename)) {
			rename($path_rename, $_POST['newname'][$i]);
		}
	}
} else if (isset($_POST['filename']) && isset($_FILES['userfile'])) {
	//Upload file
	foreach($_POST['filename'] as $i => $file) {
		if (!$_FILES['userfile']['tmp_name'][$i]) {
			continue;
		}

		$target_filename_orig = $target_filename = trim($_POST['filename'][$i] ? $_POST['filename'][$i] : $_FILES['userfile']['name'][$i]);
		$idx = 1;
		while (in_array($target_filename, $files_uploaded)) {
			$target_filename = get_new_filename($target_filename_orig, $idx);
			$idx++;
		}

		$target_file = $upload_dir.DIRECTORY_SEPARATOR.$target_filename;
		if (preg_match('/(^\\.)|(\\/)|(\\\\)/', $target_filename)
			|| !move_uploaded_file($_FILES['userfile']['tmp_name'][$i], $target_file)) {
			array_push($files_upload_failed, $target_filename_orig);
		}
	}
}

//Refresh information of uploaded files
$files_uploaded = Array();
foreach(scandir($upload_dir) as $file) {
	if (is_file($upload_dir.DIRECTORY_SEPARATOR.$file) && strpos($file, '.') !== 0) {
		array_push($files_uploaded, $file);
	}
}

//Show files failed to upload
if (count($files_upload_failed) > 0) {
	?><!DOCTYPE html>
<html>
	<head>
		<meta name='viewport' id='viewport' content='width=device-width,initial-scale=1.0,minimum-scale=1.0,maximum-scale=1.0,user-scalable=no'/>
		<meta charset='UTF-8'/>
		<title>Error</title>
		<style type='text/css'>
			body {max-width:800px;margin:auto;padding:10px;font-family:sans,Arial;}
		</style>
	</head>
	<body>
		<h3>Failed to upload the following files:</h3>
		<ul>
			<?php foreach($files_upload_failed as $file) { ?>
				<li><code><?=htmlspecialchars($file)?></code></li>
			<?php } ?>
		</ul>
		<form action="<?=htmlspecialchars($_SERVER['REQUEST_URI'])?>"><button>Back</button></form>
	</body>
</html><?php 
	exit(1);
}

$max_file_uploads = intval(ini_get('max_file_uploads'));
?><!DOCTYPE html>
<html>
	<head>
		<meta name='viewport' id='viewport' content='width=device-width,initial-scale=1.0,minimum-scale=1.0,maximum-scale=1.0,user-scalable=no'/>
		<meta charset='UTF-8'/>
		<title><?=htmlspecialchars(dirname($_SERVER['SCRIPT_NAME']).'/')?> - Upload Manager</title>
		<style type='text/css'>
			body{max-width:800px;margin:auto;padding:10px;font-family:sans,Arial;}
			td{padding:0 0 2px 0;}td.stretch{width:100%;}
			h3{border-bottom:1px solid #000000;margin-top:0;}
			.file-upload{display:inline-block;position:relative;}
			input[type="text"]{box-sizing:border-box;}
			input[type="file"]{filter:alpha(opacity=0);opacity:0;display:block;position:absolute;z-index:100;width:100%;left:0;right:0;top:0;bottom:0;}
			.hint{font-size:12px;padding-left:20px;}
			#form_upload table{border-collapse:collapse;}
			#form_upload tr.hidden{display:none;}
			#form_upload input[name="filename[]"]{width:100%;}
			#form_delete table{border-collapse:collapse;}
			#form_delete table th{text-align:left;font-weight:normal;padding-right:8px;padding-bottom:8px;}
			#form_delete td.delete-selection{text-align:center;padding-right:8px;}
			#form_delete input[name="newname[]"]{width:100%;}
		</style>
		<?php if (preg_match('/iPhone|iPad|Android/', $_SERVER['HTTP_USER_AGENT'])) { ?>
		<style type='text/css'>
			button,input[type="text"]{height:40px;box-sizing:border-box;}
			input[type="text"]{padding-left:6px;padding-right:6px;}
		</style>
		<?php } ?>
	</head>
	<body>
		<h3>Upload</h3>
		<form id='form_upload' method='post' enctype="multipart/form-data" action="<?=htmlspecialchars($_SERVER['REQUEST_URI'])?>">
			<ul class='hint'>
				<li>Maximum allowed size for files to be uploaded: <?=htmlspecialchars(ini_get('upload_max_filesize'))?></li>
			</ul>
			<table>
				<?php for($i = 0; $i < $max_file_uploads; $i++){ ?>
				<tr <?php if($i>0){echo 'class="hidden"';}?>>
					<td class='stretch'><input type='text' name='filename[]' <?php if($i>0){echo 'disabled="disabled"';}?> value=''/></td>
					<td><span class='file-upload'><input type='file' name='userfile[]' <?php if($i>0){echo 'disabled="disabled"';}?> onchange='fileUploadUpdate(<?=$i?>)'/><button>Browse...</button></span></td>
					<td><button type='button' <?php if($i>0){echo 'disabled="disabled"';}?> onclick='fileUploadClear(<?=$i?>)'>Clear</button></td>
				</tr>
				<?php } ?>
			</table>
			<p>
				<?php if ($max_file_uploads > 1) { ?><button type='button' id='btn_add_file'>Add File</button><?php } ?>
				<button type='submit'>Upload</button>
				<button type='button' id='btn_exit' onclick="window.location='./';">Exit</button>
			</p>
		</form>
		<?php if (count($files_uploaded) > 0) { ?>
		<h3>Uploaded Files</h3>
		<form id='form_delete' method='post' action="<?=htmlspecialchars($_SERVER['REQUEST_URI'])?>">
			<ul class='hint'>
				<li>To <b>rename</b> a file, put the new filename into the textbox with the filename you'd like to rename, and files to be renamed will be highlighted in bold font. Finally click "Apply" to finish the renamings.</li>
				<li>To <b>cancel renaming</b>, simply leave the filename textbox empty, then the textbox will be filled with the original filename.</li>
				<li>To <b>delete</b> a file, check the checkboxes before files to delete, then click "Apply" and you'll receive a confirmation dialog. Once your answer is yes, files selected will be deleted without any way to get them back!</li>
			</ul>
			<table>
				<tr><th>Delete</th><th>Files</th></tr>
				<?php foreach($files_uploaded as $file) { ?>
				<tr>
					<td class='delete-selection'><input type='checkbox' name='delete[]' value="<?=htmlspecialchars($file)?>"/></td>
					<td class='stretch'>
						<input type='hidden' name='origname[]' value="<?=htmlspecialchars($file)?>"/>
						<input type='text' name='newname[]' value="<?=htmlspecialchars($file)?>"/>
					</td>
					<td><button type='button' onclick='window.open("<?=urlencode($file)?>");'>Open</button></td>
				</tr>
				<?php } ?>
			</table>
			<input type='hidden' name='action' value='manage'/>
			<p><button type='submit' id='btn_apply'>Apply</button></p>
		</form>
		<?php } ?>
	</body>
	<script type='text/javascript'>
var filename_all = <?=json_encode($files_uploaded)?>;
var form_upload = document.getElementById('form_upload');
var upload_filename_all = form_upload.querySelectorAll('[name="filename[]"]');
var upload_file_all = form_upload.querySelectorAll('[name="userfile[]"]');
function hasDupFilename(filename) {
	for (var i = 0; i < filename_all.length; i++) {
		if (filename == filename_all[i]) {
			return true;
		}
	}
	return false;
}
function getNewFilename(fileName, counter) {
	var pos_ext = fileName.lastIndexOf('.');
	var basename = fileName.substr(0, pos_ext >= 0 ? pos_ext : fileName.length);
	var extname = pos_ext >= 0 ? fileName.substr(pos_ext) : '';
	return basename + '(' + Number(counter) + ')' + extname;
}
function fileUploadUpdate(idx){
	var new_filename = upload_file_all[idx].value.split(/\\|\//);
	new_filename = new_filename[new_filename.length - 1];
	if (hasDupFilename(new_filename)) {
		var counter = 1;
		var new_filename_temp = new_filename;
		while (hasDupFilename(new_filename)) {
			new_filename = getNewFilename(new_filename_temp, counter);
			counter++;
		}
	}
	filename_all.push(new_filename);
	upload_filename_all[idx].value = new_filename;
}
function fileUploadClear(idx){
	upload_filename_all[idx].value = upload_file_all[idx].value = '';
}
document.getElementById('btn_add_file').onclick = function(){
	var rows = form_upload.getElementsByTagName('table')[0].rows;
	for (var i = 0; i < rows.length; i++) {
		if (rows[i].getAttribute('class') == 'hidden') {
			rows[i].removeAttribute('class');
			rows[i].cells[0].childNodes[0].removeAttribute('disabled');
			rows[i].cells[1].childNodes[0].childNodes[0].removeAttribute('disabled');
			rows[i].cells[2].childNodes[0].removeAttribute('disabled');
			if (i == rows.length - 1) {
				this.setAttribute('disabled', 'disabled');
			}
			return true;
		}
	}
}
form_upload.onsubmit = function(e){
	var upload_files = form_upload.querySelectorAll('[name="userfile[]"]');
	var has_file_upload = false;
	for (var i = 0; i < upload_files.length; i++) {
		if (upload_files[i].value) {
			has_file_upload = true;
			break;
		}
	}
	if (has_file_upload) {
		return true;
	} else {
		alert('No file specified for uploading.');
		return false;
	}
}

<?php if (count($files_uploaded) > 0) { ?>
var form_delete = document.getElementById('form_delete');
var filename_text_all = form_delete.querySelectorAll('[name="newname[]"]');
var delete_sel_all = form_delete.querySelectorAll('[name="delete[]"]');
for (var i = 0; i < filename_text_all.length; i++) {
	filename_text_all[i].onchange = function(){
		var orig_filename = this.parentNode.querySelector('[name="origname[]"]').value;
		if (!this.value) {
			this.value = orig_filename;
		}
		this.style.fontWeight = (this.value != orig_filename ? 'bold' : '');
	}
}
form_delete.onsubmit = function(e){
	var has_file_delete = false;
	for (var i = 0; i < delete_sel_all.length; i++) {
		if (delete_sel_all[i].checked) {
			has_file_delete = true;
			break;
		}
	}
	if (has_file_delete && !confirm('Delete files selected?')) {
		return false;
	}
	return true;
}
<?php } ?>
	</script>
</html>
