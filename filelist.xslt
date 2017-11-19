<?xml version="1.0" encoding="UTF-8"?>
<!--
This XSLT template is used for beautifing Nginx's AutoIndex page, as well as making AutoIndex pages mobile friendly.

Requirements: Nginx 1.7.9+ with ngx_http_xslt_module module available.


Nginx Configuation
==================

	map $http_user_agent $browser_type {
		default pc;
		"~MSIE (6.0|7.0|8.0)" oldie;
		~(iPhone|Android.*Mobile) mobile;
		~(iPad|Android) pad;
	}
	server {
		listen 80 default_server;
		listen [::]:80 default_server;
		root /path/to/share/;
		charset utf-8;
		error_page 301 @error_page_301;
		error_page 401 @error_page_401;
		error_page 403 @error_page_403;
		error_page 404 @error_page_404;
		location @error_page_301{return 404 '';}
		location @error_page_401{return 401 '';}
		location @error_page_403{return 403 '';}
		location @error_page_404{return 404 '';}
		try_files $uri $uri/ =404;
		autoindex on;
		autoindex_format xml;
		xslt_types text/html;
		xslt_string_param template $arg_t;
		xslt_string_param file_open $arg_f;
		xslt_string_param dir $document_uri;
		xslt_string_param useragent $http_user_agent;
		xslt_string_param browsertype $browser_type;
		location ~ .*\/$ {
			xslt_stylesheet /path/to/template.xslt $arg_xslt_params;
		}
		location /directory {
			xslt_stylesheet /path/to/another-template.xslt $arg_xslt_params;
		}
	}
-->
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:xlink="http://www.w3.org/1999/xlink">
<xsl:output method="html" doctype-system="" version="5.0" encoding="UTF-8" indent="yes"/>

<xsl:template name='filelist' match="/list">
	<xsl:choose>
		<xsl:when test="$template = 'image-viewer'">
			<xsl:call-template name="image-viewer"/>
		</xsl:when>
		<xsl:when test="$template = 'ymplayer'">
			<xsl:call-template name="ymplayer"/>
		</xsl:when>
		<xsl:otherwise>
			<xsl:call-template name="filelist-main"/>
		</xsl:otherwise>
	</xsl:choose>
</xsl:template>

<xsl:template name='filelist-path-links'>
	<xsl:param name="path"/>
	<xsl:param name="link"/>
	<xsl:variable name="current" select="substring-before($path,'/')"/>
	<xsl:variable name="remaining" select="substring-after($path,'/')"/>
	<xsl:variable name="linknext" select="concat($link,concat('/',$current))"/>
	<xsl:if test="$path != ''"><a href='{$linknext}/'><xsl:value-of select='$current'/></a> / </xsl:if>
	<xsl:if test="$remaining != ''">
		<xsl:call-template name="filelist-path-links">
			<xsl:with-param name="path" select="$remaining"/>
			<xsl:with-param name="link" select="$linknext"/>
		</xsl:call-template>
	</xsl:if>
</xsl:template>

<xsl:template name='filelist-main'>
<html>
	<head>
		<meta name='viewport' id='viewport' content='width=device-width,initial-scale=1.0,minimum-scale=1.0,maximum-scale=1.0,user-scalable=no'/>
		<meta charset='UTF-8'/>
		<meta name='wap-font-scale' content='no'/>
		<title><xsl:value-of select='$dir'/> - File Manager</title>
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
		<xsl:if test="$browsertype = 'pc'"><style type='text/css' id='style_pc'>
.filelist:hover{background-color:#eee;opacity:0.5;}
#dir_navigator a:hover{opacity:0.5;}
		</style></xsl:if>
		<xsl:if test="$browsertype = 'oldie'"><style type='text/css' id='style_pc'>
.icon-root{margin-top:-3px;}
.filelist:hover{background-color:#eee;}
.filelist .filename{margin-left:0;}
.filelist .filesize{margin-left:0;}
		</style></xsl:if>
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
			<xsl:choose>
				<xsl:when test="$browsertype = 'oldie'">
					<a class='link-root' href='/'><img class='icon-root' src='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABYAAAAWCAYAAADEtGw7AAAA1UlEQVQ4jd3UvUqCYRgG4CuDwqZEF/FIXDqApiabPIQOwjNwCJ0aXZodbWpo6QCiAxClQelnCeN18BM+ROXr+wHxhpt3ebh4lvfhGHORJ9ZAD1ME/OAFtyilRZv4iMBtfcR5mk33oev2ovkyLpPA/QRowAKD6A0Yob4PniSEt3W4Cy1nQAN+cbaJlnCXEZ7hZBN+yIgGvOEqjrZyQOPtrjd/zhkOaMO8APgVPguAv+GpAHgM1wXA96J0ckTfURXLjdVp/EsJfln9h5odOUXln0104Q47SwJpCVeUDnONAAAAAElFTkSuQmCC'/></a> / 
				</xsl:when>
				<xsl:otherwise>
					<a class='link-root' href='/'>
						<svg class='icon-root' width="1920" height="1920" viewBox="0 0 1920 1920" xmlns="http://www.w3.org/2000/svg"><path d="m 1920,1280 q 0,159 -112.5,271.5 Q 1695,1664 1536,1664 l -1088,0 Q 263,1664 131.5,1532.5 0,1401 0,1216 0,1084 71,974.5 142,865 258,811 q -2,-28 -2,-43 0,-212 150,-362 150,-150 362,-150 158,0 286.5,88 128.5,88 187.5,230 70,-62 166,-62 106,0 181,75 75,75 75,181 0,75 -41,138 129,30 213,134.5 84,104.5 84,239.5 z" fill="#333"/></svg>
					</a> / 
				</xsl:otherwise>
			</xsl:choose>
			<xsl:call-template name="filelist-path-links"><xsl:with-param name="path" select="substring-after($dir,'/')"/></xsl:call-template>
		</div></div>
		<xsl:for-each select='directory'>
			<div><a class='filelist' href="{.}/">
				<svg class='icon' viewBox="0 0 1792 1792"><use xlink:href="#icon-folder"></use></svg>
				<span class='filename'><span class='table'><span class='table-inner'><xsl:value-of select="."/>/</span></span></span>
			</a></div>
		</xsl:for-each>
		<xsl:for-each select='file'>
			<xsl:variable name='filename' select='.'/>
			<xsl:variable name='lfilename' select="translate($filename,'ABCDEFGHIJKLMNOPQRSTUVWXYZ','abcdefghijklmnopqrstuvwxyz')"/>
			<xsl:variable name='ext-1' select="substring($lfilename,string-length($lfilename)-1,string-length($lfilename))"/>
			<xsl:variable name='ext-2' select="substring($lfilename,string-length($lfilename)-2,string-length($lfilename))"/>
			<xsl:variable name='ext-3' select="substring($lfilename,string-length($lfilename)-3,string-length($lfilename))"/>
			<xsl:variable name='ext-4' select="substring($lfilename,string-length($lfilename)-4,string-length($lfilename))"/>
			<div><a class='filelist file' target='_blank' href='{.}' filename='{.}'>
				<xsl:if test="$browsertype != 'oldie'"><xsl:choose>
					<xsl:when test="$ext-3 = '.jpg' or $ext-4 = '.jpeg' or $ext-3 = '.gif'
						or $ext-3 = '.png' or $ext-3 = '.bmp' or $ext-3 = '.svg'
						or $ext-3 = '.tif' or $ext-4 = '.tiff' or $ext-3 = '.dib'
						or $ext-3 = '.rle' or $ext-3 = '.wmf' or $ext-3 = '.emf'
						or $ext-3 = '.eps' or $ext-2 = '.ai'">
						<svg class='icon' viewBox="0 0 1792 1792"><use xlink:href="#icon-file-image"></use></svg>
					</xsl:when>
					<xsl:when test="$ext-3 = '.wav' or $ext-3 = '.mp3' or $ext-4 = '.flac'
						or $ext-3 = '.ogg' or $ext-3 = '.ape' or $ext-3 = '.wma'
						or $ext-3 = '.amr'">
						<svg class='icon' viewBox="0 0 1792 1792"><use xlink:href="#icon-file-audio"></use></svg>
					</xsl:when>
					<xsl:when test="$ext-3 = '.avi' or $ext-3 = '.mpg' or $ext-4 = '.mpeg'
						or $ext-3 = '.ogv' or $ext-3 = '.mp4' or $ext-3 = '.wmv'
						or $ext-3 = '.3gp' or $ext-3 = '.flv' or $ext-3 = '.f4v'">
						<svg class="icon" viewBox="0 0 1792 1792"><use xlink:href="#icon-file-video"></use></svg>
					</xsl:when>
					<xsl:when test="$ext-3 = '.doc' or $ext-4 = '.docx'">
						<svg class="icon" viewBox="0 0 1792 1792"><use xlink:href="#icon-file-word"></use></svg>
					</xsl:when>
					<xsl:when test="$ext-3 = '.xls' or $ext-4 = '.xlsx' or $ext-4 = '.xlsm'">
						<svg class="icon" viewBox="0 0 1792 1792"><use xlink:href="#icon-file-excel"></use></svg>
					</xsl:when>
					<xsl:when test="$ext-3 = '.ppt' or $ext-3 = '.pps' or $ext-4 = '.pptx' or $ext-4 = '.ppsx'">
						<svg class="icon" viewBox="0 0 1792 1792"><use xlink:href="#icon-file-powerpoint"></use></svg>
					</xsl:when>
					<xsl:when test="$ext-3 = '.txt' or $ext-3 = '.htm' or $ext-4 = '.html'">
						<svg class="icon" viewBox="0 0 1792 1792"><use xlink:href="#icon-file-text"></use></svg>
					</xsl:when>
					<xsl:when test="$ext-3 = '.pdf'">
						<svg class="icon" viewBox="0 0 1792 1792"><use xlink:href="#icon-file-pdf"></use></svg>
					</xsl:when>
					<xsl:when test="$ext-3 = '.rar' or $ext-3 = '.zip' or $ext-2 = '.gz'
						or $ext-3 = '.bz2' or $ext-2 = '.7z' or $ext-3 = '.arj'">
						<svg class="icon" viewBox="0 0 1792 1792"><use xlink:href="#icon-file-archive"></use></svg>
					</xsl:when>
					<xsl:when test="$ext-3='.ini' or $ext-4='.conf' or $ext-2='.py' or $ext-1='.c'
						or $ext-3='.cpp' or $ext-1='.h' or $ext-3='.hpp' or $ext-3='.hxx'
						or $ext-3='.cxx' or $ext-3='.asm' or $ext-2='.pl' or $ext-2='.rb'
						or $ext-2='.js' or $ext-3='.asp' or $ext-3='.jsp' or $ext-3='.php'
						or $ext-4='.java' or $ext-3='.xml' or $ext-4='.xslt' or $ext-3='.xsl'">
						<svg class="icon" viewBox="0 0 1792 1792"><use xlink:href="#icon-file-code"></use></svg>
					</xsl:when>
					<xsl:otherwise>
						<svg class="icon" viewBox="0 0 1792 1792"><use xlink:href="#icon-file"></use></svg>
					</xsl:otherwise>
				</xsl:choose></xsl:if>
				<span class='filename'><xsl:value-of select="."/></span>
				<div class='filesize'><xsl:choose>
					<xsl:when test='@size &gt; 1073741824'><xsl:value-of select="format-number(@size div 1073741824, '#.0')"/>G</xsl:when>
					<xsl:when test='@size &gt; 1048576'><xsl:value-of select="format-number(@size div 1048576, '#.0')"/>M</xsl:when>
					<xsl:when test='@size &gt; 1024'><xsl:value-of select="format-number(@size div 1024, '#.0')"/>K</xsl:when>
					<xsl:otherwise><xsl:value-of select="@size"/></xsl:otherwise>
				</xsl:choose></div>
			</a></div>
		</xsl:for-each>
	</body>
	<script type='text/javascript'><![CDATA[
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
	{match:/\.(wav|mp3|ogg)$/i, action:function(e,filename,href){
		if (!isOldIE()){
			e.onclick = function(e){
				window.open(current_dir+'?t=ymplayer&f='+filename);
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
	]]></script>
</html>
</xsl:template>

<!--
This XSLT template is used to display image files in a folder

Deployment:

Download touch.min.js from https://github.com/Clouda-team/touchjs, then put it into folder $DOCUMENT_ROOT/.res/js/.
-->
<xsl:template name='image-viewer'>
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
		<xsl:if test="$browsertype = 'pad' or $browsertype = 'mobile'"><div id='swipe_receiver'></div></xsl:if>
		<div id='image_viewer' class='loading'>
			<div class='table-center'><div class='table-cell-center'><img id='image_show' alt=''/><span class='text' id='loading'>Loading...<span id='loading_progress'></span></span><span class='text' id='error'>Failed to load image.</span></div></div>
		</div>
		<xsl:for-each select='file'>
			<xsl:variable name='filename' select='.'/>
			<xsl:variable name='lfilename' select="translate($filename,'ABCDEFGHIJKLMNOPQRSTUVWXYZ','abcdefghijklmnopqrstuvwxyz')"/>
			<xsl:variable name='ext-3' select="substring($lfilename,string-length($lfilename)-3,string-length($lfilename))"/>
			<xsl:variable name='ext-4' select="substring($lfilename,string-length($lfilename)-4,string-length($lfilename))"/>
			<xsl:if test="$ext-3 = '.png' or $ext-3 = '.jpg' or $ext-3 = '.gif' or $ext-3 = '.bmp' or $ext-4 = '.jpeg'">
				<input type='hidden' class='image-file' href='{.}' filename='{.}'/>
			</xsl:if>
			<xsl:if test="$ext-3 = '.svg' and $browsertype != 'oldie'">
				<input type='hidden' class='image-file' href='{.}' filename='{.}'/>
			</xsl:if>
		</xsl:for-each>
		<input type='hidden' id='file_selected' value="{$file_open}"/>
	</body>
	<script type='text/javascript'><![CDATA[
var image_viewer = document.getElementById('image_viewer');
var loading_progress = document.getElementById('loading_progress');
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
	loading_progress.innerHTML = '';
	centerImage(this);
}
img_show.onprogress = function(e){
	loading_progress.innerHTML = ' '+Math.round(e.loaded/e.total*100)+'%'
}
img_show.onerror = function(){
	image_viewer.setAttribute('class', 'error');
	loading_progress.innerHTML = '';
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
	]]></script>
	<xsl:choose>
		<xsl:when test="$browsertype = 'pad' or $browsertype = 'mobile'"><script type='text/javascript'><![CDATA[
touch.on('#swipe_receiver', 'swiperight', function(e){
	prev_image();
});
touch.on('#swipe_receiver', 'swipeleft', function(e){
	next_image();
});
touch.on('#swipe_receiver', 'tap', function(e){
	window.open(img_show.getAttribute('src'));
});
		]]></script></xsl:when>
		<xsl:otherwise><script type='text/javascript'><![CDATA[
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
		]]></script></xsl:otherwise>
	</xsl:choose>
</html>
</xsl:template>

<!--
This XSLT template is used to play music files in a folder using Ymplayer (https://github.com/kirainmoe/ymplayer).

Deployment:

1. Download ymplayer.css and ymplayer.js from https://github.com/kirainmoe/ymplayer.
2. Put ymplayer.css into folder $DOCUMENT_ROOT/.res/css/.
3. Put ymplayer.js into folder $DOCUMENT_ROOT/.res/js/.

To automatically play a music file when loading the page, please use the following URL:

	http://host:port/musicdir/?f=music_file.mp3
-->
<xsl:template name='ymplayer'>
<html>
	<head>
		<meta http-equiv='X-UA-Compatible' content='IE=9'/>
		<meta name='viewport' id='viewport' content='width=device-width,initial-scale=1.0,minimum-scale=1.0,maximum-scale=1.0,user-scalable=no'/>
		<meta charset='UTF-8'/>
		<meta name='wap-font-scale' content='no'/>
		<title>YmPlayer</title>
		<link id='style_ymplayer' rel="stylesheet" type="text/css" href="/.res/css/ymplayer.css"/>
		<script type='text/javascript' src='/.res/js/ymplayer.js'></script>
		<style type='text/css'>
body{position:fixed;left:0;right:0;top:0;bottom:0;width:100%;height:100%;margin:0;padding:0;font-family:sans,arial,"微软雅黑";}
#background{width:100%;height:100%;background-size:cover;background-position:center center;background-repeat:no-repeat;}
ymplayer{margin:0;position:fixed;bottom:0;left:0;right:0;}
		</style>
		<script type='text/javascript'><![CDATA[
function htmlspecialchars(s){
	var M={'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'};
	return s.replace(/[&<>"']/g,function(m){return M[m]});
}
function each(array,func){if(!func){return;}for(var i=0;i<array.length;i++){func(array[i],i,array)}}
function hasClass(e,c){return e.className.match(new RegExp('(\\s|^)'+c+'(\\s|$)'))?true:false;}
function addClass(e,c){if(!c||hasClass(e,c)){return}if(e.className){e.className+=' '+c}else{e.className=c}}
		]]></script>
	</head>
	<body>
		<ymplayer loop="no"><xsl:for-each select='file'>
			<xsl:variable name='filename' select="."/>
			<xsl:variable name='lfilename' select="translate($filename,'ABCDEFGHIJKLMNOPQRSTUVWXYZ','abcdefghijklmnopqrstuvwxyz')"/>
			<xsl:variable name='base-3' select="substring($filename,0,string-length($filename)-3)"/>
			<xsl:variable name='base-4' select="substring($filename,0,string-length($filename)-4)"/>
			<xsl:variable name='lbase-3' select="substring($lfilename,0,string-length($lfilename)-3)"/>
			<xsl:variable name='lbase-4' select="substring($lfilename,0,string-length($lfilename)-4)"/>
			<xsl:variable name='ext-3' select="substring($lfilename,string-length($lfilename)-3,string-length($lfilename))"/>
			<xsl:variable name='ext-4' select="substring($lfilename,string-length($lfilename)-4,string-length($lfilename))"/>
			<xsl:if test="$ext-3 = '.mp3' or $ext-3 = '.wav' or $ext-3 = '.ogg'"><song>
				<xsl:attribute name='src'><xsl:value-of select="."/></xsl:attribute>
				<xsl:attribute name='song'><xsl:value-of select="$base-3"/></xsl:attribute>
				<xsl:for-each select='//list/file'>
					<xsl:variable name='filename-lrc' select="."/>
					<xsl:variable name='base-lrc' select="substring(translate($filename-lrc,'ABCDEFGHIJKLMNOPQRSTUVWXYZ','abcdefghijklmnopqrstuvwxyz'),0,string-length($filename-lrc)-3)"/>
					<xsl:variable name='ext-lrc' select="substring(translate($filename-lrc,'CLR','clr'),string-length($filename-lrc)-3,string-length($filename-lrc))"/>
					<xsl:if test="$base-lrc = $lbase-3 and $ext-lrc = '.lrc'"><xsl:attribute name='lyrics'><xsl:value-of select="."/></xsl:attribute></xsl:if>
				</xsl:for-each>
				<xsl:for-each select='//list/file'>
					<xsl:variable name='filename-cover' select="."/>
					<xsl:variable name='base-cover' select="substring(translate($filename-cover,'ABCDEFGHIJKLMNOPQRSTUVWXYZ','abcdefghijklmnopqrstuvwxyz'),0,string-length($filename-cover)-3)"/>
					<xsl:variable name='ext-cover' select="substring(translate($filename-cover,'ABCDEFGHIJKLMNOPQRSTUVWXYZ','abcdefghijklmnopqrstuvwxyz'),string-length($filename-cover)-3,string-length($filename-cover))"/>
					<xsl:if test="$base-cover = $lbase-3 and ($ext-cover = '.jpg' or $ext-cover = '.png' or $ext-cover = '.gif' or $ext-cover = '.bmp')">
						<xsl:attribute name='cover'><xsl:value-of select="."/></xsl:attribute>
					</xsl:if>
				</xsl:for-each>
			</song></xsl:if>
		</xsl:for-each></ymplayer>
		<xsl:for-each select='file'>
			<xsl:variable name='filename' select="."/>
			<xsl:variable name='lfilename' select="translate($filename,'ABCDEFGHIJKLMNOPQRSTUVWXYZ','abcdefghijklmnopqrstuvwxyz')"/>
			<xsl:variable name='lbase-3' select="substring($lfilename,0,string-length($lfilename)-3)"/>
			<xsl:variable name='lbase-4' select="substring($lfilename,0,string-length($lfilename)-4)"/>
			<xsl:variable name='ext-3' select="substring($lfilename,string-length($lfilename)-3,string-length($lfilename))"/>
			<xsl:variable name='ext-4' select="substring($lfilename,string-length($lfilename)-4,string-length($lfilename))"/>
			<xsl:choose>
				<xsl:when test="$lbase-3 = 'cover' and ($ext-3 = '.jpg' or $ext-3 = '.gif' or $ext-3 = '.bmp' or $ext-3 = '.png')">
					<input type='hidden' id='default_cover' value='{$filename}'/>
				</xsl:when>
				<xsl:when test="$lbase-4 = 'cover' and $ext-4 = '.jpeg'">
					<input type='hidden' id='default_cover' value='{$filename}'/>
				</xsl:when>
				<xsl:when test="$lbase-3 = 'background' and ($ext-3 = '.jpg' or $ext-3 = '.gif' or $ext-3 = '.bmp' or $ext-3 = '.png')">
					<div id='background' style="background-image:url('{$filename}');"></div>
				</xsl:when>
				<xsl:when test="$lbase-4 = 'background' and $ext-4 = '.jpeg'">
					<div id='background' style="background-image:url('{$filename}');"></div>
				</xsl:when>
			</xsl:choose>
		</xsl:for-each>
		<input type='hidden' id='file_selected' value="{$file_open}"/>
	</body>
	<script type='text/javascript'><![CDATA[
var ymplayer = document.getElementsByTagName('ymplayer')[0];
var theme_all = ['', 'honoka', 'kotori', 'umi', 'nico'];
var theme_idx = parseInt(Math.random() * theme_all.length);
addClass(ymplayer, theme_all[theme_idx]);

var default_cover = document.getElementById('default_cover');
each(ymplayer.querySelectorAll('song'), function(song){
	var artist = '';
	try{
		artist = htmlspecialchars(decodeURIComponent(/\/([^\/]+)\//.exec(window.location.pathname)[1]));
	}catch(e){}
	song.setAttribute('artist', artist);
	var cover = song.getAttribute('cover');
	song.setAttribute('cover', cover ? encodeURIComponent(cover) : (default_cover ? encodeURIComponent(default_cover.value) : ''));
});

/* Init Ymplayer after all the lyrics loaded */
var ymplayer_inited = false;
function tryInitYmplayer(){
	if (ymplayer.querySelectorAll('song[lyrics]').length == 0 && !ymplayer_inited) {
		ymplayer_inited = true;
		Ymplayer.Init();
		addClass(ymplayer.querySelector(".ym-playlist"), 'ym-show');
		window.addEventListener('keydown', function(e){
			var e = e || event;
			switch (e.keyCode) {
				case 32:	//Space
					Ymplayer.TogglePlay(ymplayer);
				break;
			}
		});

		//Automatically play file specified after hash
		var current_file = document.getElementById('file_selected').value;
		each(ymplayer.getElementsByTagName('single'), function(single){
			if (decodeURIComponent(single.getAttribute('src')) == decodeURIComponent(current_file)) {
				Ymplayer.ChangeAudio(ymplayer, single, true);
				ymplayer.getElementsByTagName('audio')[0].play();
			}
		});
	}
}
each(ymplayer.querySelectorAll('song[lyrics]'), function(song){
	var xhr = new XMLHttpRequest();
	xhr.addEventListener('readystatechange', function(){
		if (this.readyState == 4 && this.status == 200) {
			song.innerHTML = htmlspecialchars(this.responseText);
			song.removeAttribute('lyrics');
			tryInitYmplayer();
		}
	});
	xhr.open("GET", song.getAttribute('lyrics'), true);
	xhr.send(null);
});
tryInitYmplayer();

/* Change playlist's height based on window height */
var style_ymplayer = document.getElementById('style_ymplayer');
function setYmplayer(){
	var rules_all = style_ymplayer.sheet.cssRules;
	for (var i = 0; i < rules_all.length; i++) {
		var rule = rules_all[i];
		switch(rule.selectorText) {
			case '.ym-playlist.ym-show':
				rule.style.height = (document.body.offsetHeight - 120) + 'px';
			break;
			case '.ym-lrcbox.ym-show':
				rule.style.height = (document.body.offsetHeight - 120) + 'px';
			break;
		}
	}
}
window.addEventListener('resize', setYmplayer);
window.addEventListener('load', setYmplayer);
setYmplayer();
	]]></script>
</html>
</xsl:template>

</xsl:stylesheet>
