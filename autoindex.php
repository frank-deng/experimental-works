<?php
$_G = [
	'ENCODINGS' => array('UTF-8', 'GBK', 'BIG5', 'SHIFT-JIS'),
	'ROOT_DIR' => preg_replace('/\/$/', '', str_replace('\\', '/', getcwd())),
];

function list_dir($dir) {
	global $_G;

	//Check if the given $dir exists and is within the root directory
	$real_dir = str_replace('\\', '/', realpath(preg_replace('/^\/+/', '', $dir)));
	if (!is_dir($real_dir) || strpos($real_dir, $_G['ROOT_DIR']) !== 0) {
		return false;
	}

	//Initialize data structure of result
	$dir = preg_replace(Array('/\/+$/', '/^\/+/'), Array('', ''), str_replace($_G['ROOT_DIR'], '', $real_dir));
	$result = Array(
		'dir' => $dir ? $dir.'/' : '',
		'dirs' => Array(),
		'files' => Array(),
	);

	//Get parent dir
	$parent_real_dir = str_replace('\\', '/', realpath($real_dir.'/../'));;
	if (is_dir($parent_real_dir) && strpos($parent_real_dir, $_G['ROOT_DIR']) === 0) {
		$parent_dir = preg_replace(Array('/\/+$/', '/^\/+/'), Array('', ''), str_replace($_G['ROOT_DIR'], '', $parent_real_dir));
		$parent_dir = $parent_dir ? $parent_dir.'/' : '';
		$result['parent'] = $parent_dir;
	}

	//List filenames and directories in current dir
	$filename_all = Array();
	if (false != ($handle = opendir($real_dir))) {
		while (false !== ($filename = readdir($handle))) {
			if (strpos($filename, '.') !== 0) {
				array_push($filename_all, $filename);
			}
		}
		closedir($handle);
	}
	sort($filename_all);

	//Fetch information for each file/directory
	foreach ($filename_all as $i => $filename) {
		$file_info = get_file_info($real_dir, $result['dir'], $filename);
		if ($file_info['is_dir']){ 
			array_push($result['dirs'], $file_info);
		} else {
			array_push($result['files'], $file_info);
		}
	}

	return $result;
}
function get_file_info($real_dir, $dir, $filename) {
	$real_file = $real_dir.'/'.$filename;
	$path_info = stat($real_dir.'/'.$filename);
	$result = Array(
		'filename' => $filename,
		'is_dir' => (is_dir($real_file) ? true : false),
		'date' => $path_info['atime'],
		'link' => $dir.$filename,
	);
	if ($result['is_dir']) {
		$result['link'] = $dir.$filename.'/';
	} else {
		$result['size'] = $path_info['size'];
	}

	return $result;
}
function str_utf8($str) {
	global $_G;
	return iconv(mb_detect_encoding($str, $_G['ENCODINGS']), 'UTF-8//IGNORE', $str);
}
function dir2xml($dir_array) {
	$dom = new DomDocument('1.0', 'utf-8');
	$list = $dom->createElement('list');
	$dom->appendChild($list);
	$attr_dir = $dom->createAttribute('dir');
	$attr_dir->value = str_utf8($dir_array['dir']);
	$list->appendChild($attr_dir);
	if (isset($dir_array['parent'])) {
		$attr_parentdir = $dom->createAttribute('parentdir');
		$attr_parentdir->value = $dir_array['parent'];
		$list->appendChild($attr_parentdir);
	}

	foreach($dir_array['dirs'] as $dir_info) {
		$dir_info_dom = $dom->createElement('directory');
		$attr_mtime = $dom->createAttribute('mtime');
		$attr_mtime->value = $dir_info['date'];
		$dir_info_dom->appendChild($attr_mtime);
		$attr_link = $dom->createAttribute('href');
		$attr_link->value = $dir_info['link'];
		$dir_info_dom->appendChild($attr_link);
		$dir_info_dom->appendChild($dom->createTextNode(str_utf8($dir_info['filename'])));
		$list->appendChild($dir_info_dom);
	}
	foreach($dir_array['files'] as $file_info) {
		$file_info_dom = $dom->createElement('file');
		$attr_mtime = $dom->createAttribute('mtime');
		$attr_mtime->value = $file_info['date'];
		$file_info_dom->appendChild($attr_mtime);
		$attr_size = $dom->createAttribute('size');
		$attr_size->value = $file_info['size'];
		$file_info_dom->appendChild($attr_size);
		$attr_link = $dom->createAttribute('href');
		$attr_link->value = str_utf8($file_info['link']);
		$file_info_dom->appendChild($attr_link);
		$file_info_dom->appendChild($dom->createTextNode(str_utf8($file_info['filename'])));
		$list->appendChild($file_info_dom);
	}

	return $dom;
}
function size_human($size0){
	$size = intval($size0);
	if ($size > 1073741824) {
		return sprintf('%.1fG', $size / 1073741824);
	} else if ($size > 1048576) {
		return sprintf('%.1fM', $size / 1048576);
	} else if ($size > 1024) {
		return sprintf('%.1fK', $size / 1024);
	} else {
		return $size;
	}
}
function apply_xslt($xml, $xsl_path) {
	$xsl = new DomDocument();
	$xsl->load($xsl_path);
	$parser = new XSLTProcessor();
	$parser->registerPHPFunctions();
	$parser->importStylesheet($xsl);
	return $parser->transformToXML($xml);
}

$xslt_given = (isset($_GET['t']) && preg_match('/^[A-Za-z0-9\-_]+$/', $_GET['t'])) ? $_G['ROOT_DIR'].'/.'.$_GET['t'].'.xslt' : false;
$dir_array = list_dir(isset($_GET['d']) ? trim(urldecode($_GET['d'])) : '');
if (false === $dir_array) {
	header('Location: ?d=');
} else {
	if ($xslt_given && is_file($xslt_given)) {
		$xslt_file = $xslt_given;
	} else {
		$xslt_file = $_G['ROOT_DIR'].'/.global.xslt';
		$xslt_file_dir = $_G['ROOT_DIR'].'/'.$dir_array['dir'].'/.folder.xslt';
		$xslt_file = (is_file($xslt_file_dir) ? $xslt_file_dir : (is_file($xslt_file) ? $xslt_file : false));
	}
	if (isset($_GET['showxml']) && $_GET['showxml'] == 'showxml') {
		header('Content-type: text/xml');
		echo dir2xml($dir_array)->saveXML();
	} else if ($xslt_file && extension_loaded('xsl')){
		echo apply_xslt(dir2xml($dir_array), $xslt_file);
	} else {
?><!DOCTYPE html>
<html>
	<head>
		<meta charset='UTF-8'/>
		<title>Index of /<?=htmlspecialchars(str_utf8($dir_array['dir']))?></title>
		<style type='text/css'>td{padding-right:20px;}</style>
	</head>
	<body>
		<h1>Index of /<?=htmlspecialchars(str_utf8($dir_array['dir']))?></h1><hr/>
		<table>
			<?php
			if (isset($dir_array['parent'])) {
				echo '<tr><td><a href="?d='.str_ireplace('%2F','/',urlencode($dir_array['parent'])).'">../</a></td></tr>';
			}
			foreach($dir_array['dirs'] as $dir) { ?>
				<tr>
					<td><a href="?d=<?=str_ireplace('%2F','/',urlencode($dir['link']))?>"><?=htmlspecialchars(str_utf8($dir['filename']))?>/</a></td>
					<td><?=date('Y-m-d H:i:s', $dir['date'])?></td><td>-</td>
				</tr>
			<?php }
			foreach($dir_array['files'] as $file) { ?>
				<tr>
					<td><a target='_blank' href="<?=str_ireplace('%2F','/',urlencode(str_utf8($file['link'])))?>"><?=htmlspecialchars(str_utf8($file['filename']))?></a></td>
					<td><?=date('Y-m-d H:i:s', $file['date'])?></td><td><?=$file['size']?></td>
				</tr>
			<?php }
			?>
		</table>
	</body>
</html>
<?php
	}
}

