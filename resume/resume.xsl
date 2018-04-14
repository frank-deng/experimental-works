<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:xlink="http://www.w3.org/1999/xlink">
<xsl:output method="html" doctype-system="" version="5.0" encoding="UTF-8" indent="yes"/>
<xsl:template>
<html>
	<head>
		<meta charset='UTF-8'/>
		<title><xsl:value-of select='/resume/main/name'/>　　<xsl:value-of select='/resume/main/direction'/>　　<xsl:value-of select='/resume/main/years'/>年</title>
	</head>
	<body>
		<h1><xsl:value-of select='/resume/main/name'/>　　<xsl:value-of select='/resume/main/direction'/>　　<xsl:value-of select='/resume/main/years'/>年</h1>
	</body>
</html>
</xsl:template>
</xsl:stylesheet>
