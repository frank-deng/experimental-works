<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:xlink="http://www.w3.org/1999/xlink">
<xsl:output method="html" doctype-system="" version="5.0" encoding="UTF-8" indent="yes"/>
<xsl:strip-space elements="*" />

<xsl:template name='show-time'>
	<xsl:param name="year"/>
	<xsl:param name="month"/>
	<xsl:param name="year2"/>
	<xsl:param name="month2"/>
	<xsl:value-of select="$year"/>/<xsl:value-of select="$month"/><!--
	--><xsl:choose>
		<xsl:when test="$year2 != '' and $month2 != ''"> — <xsl:value-of select="$year2"/>/<xsl:value-of select="$month2"/></xsl:when>
		<xsl:otherwise> 至今</xsl:otherwise>
	</xsl:choose>
</xsl:template>

<xsl:template match='/'>
<html>
	<head>
		<meta charset='UTF-8'/>
		<title><xsl:value-of select='/resume/main/name'/>　<xsl:value-of select='/resume/main/direction'/>　<xsl:value-of select='/resume/main/years'/>年</title>
		<style type='text/css'><![CDATA[
			th {
				text-align: left;
			}
			.warpline{
				white-space: pre;
			}
		]]></style>
	</head>
	<body>
		<h1><xsl:value-of select='/resume/main/name'/>　<xsl:value-of select='/resume/main/direction'/>　<xsl:value-of select='/resume/main/years'/>年</h1>

		<h2>基本信息</h2>
		<table>
			<tr>
				<th>姓别</th><td><xsl:value-of select='/resume/main/gender'/></td>
				<th>手机</th><td><xsl:value-of select='/resume/main/mobile'/></td>
			</tr>
			<tr>
				<th>邮箱</th><td><xsl:value-of select='/resume/main/email'/></td>
				<th>英语水平</th><td><xsl:value-of select='/resume/main/englishSkill'/></td>
			</tr>
			<tr>
				<th>个人主页</th><td><xsl:value-of select='/resume/main/homepage'/></td>
				<th>GitHub</th><td><xsl:value-of select='/resume/main/github'/></td>
			</tr>
		</table>

		<h2>自我评价</h2>
		<p class='warpline'><xsl:value-of select='/resume/self-assessment'/></p>

		<h2>项目经验</h2>
		<xsl:for-each select='/resume/projects/project'>
			<xsl:sort select="time/from/year" data-type="number" order="descending"/>
			<xsl:sort select="time/from/month" data-type="number" order="descending"/>
			<h3><xsl:value-of select='name'/></h3>
			<p><b>时间：</b><!--
				--><xsl:call-template name="show-time">
					<xsl:with-param name="year" select="time/from/year"/>
					<xsl:with-param name="month" select="time/from/month"/>
					<xsl:with-param name="year2" select="time/to/year"/>
					<xsl:with-param name="month2" select="time/to/month"/>
				</xsl:call-template><!--
			--></p>
			<p class='warpline'><xsl:value-of select='desc'/></p>
		</xsl:for-each>

		<h2>工作经历</h2>
		<table>
			<tr>
				<th>时间</th>
				<th>公司名称</th>
				<th>职位</th>
				<th>工作描述</th>
			</tr>
			<xsl:for-each select='/resume/companies/company'>
				<xsl:sort select="time/from/year" data-type="number" order="descending"/>
				<xsl:sort select="time/from/month" data-type="number" order="descending"/>
				<tr>
					<td>
						<xsl:call-template name="show-time">
							<xsl:with-param name="year" select="time/from/year"/>
							<xsl:with-param name="month" select="time/from/month"/>
							<xsl:with-param name="year2" select="time/to/year"/>
							<xsl:with-param name="month2" select="time/to/month"/>
						</xsl:call-template>
					</td>
					<td><xsl:value-of select='name'/></td>
					<td><xsl:value-of select='title'/></td>
					<td class='warpline'><xsl:value-of select='desc'/></td>
				</tr>
			</xsl:for-each>
		</table>

		<h2>教育背景</h2>
		<table>
			<tr>
				<th>时间</th>
				<th>院校</th>
				<th>专业</th>
				<th>学历</th>
			</tr>
			<xsl:for-each select='/resume/education-experience/education'>
				<tr>
					<td>
						<xsl:call-template name="show-time">
							<xsl:with-param name="year" select="time/from/year"/>
							<xsl:with-param name="month" select="time/from/month"/>
							<xsl:with-param name="year2" select="time/to/year"/>
							<xsl:with-param name="month2" select="time/to/month"/>
						</xsl:call-template>
					</td>
					<td><xsl:value-of select='college'/></td>
					<td><xsl:value-of select='major'/></td>
					<td><xsl:value-of select='degree'/></td>
				</tr>
			</xsl:for-each>
		</table>
	</body>
</html>
</xsl:template>
</xsl:stylesheet>
