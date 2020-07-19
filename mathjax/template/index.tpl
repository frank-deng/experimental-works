<html>
  <head>
		<meta name='viewport' id='viewport' content='width=device-width,initial-scale=1.0,minimum-scale=1.0,maximum-scale=1.0,user-scalable=no'/>
    <% if(encoding){ %>
      <meta charset='<%=encoding%>'/>
    <% } %>
    <title>我的博客</title>
  </head>
  <body topmargin='4'>
    <div align='center'><table
      border='3'
      bordercolorlight='#ccccff'
      bordercolordark='#0000cc'
      cellspacing='0'
      cellpadding='6'><tr><td align='center'
        bgcolor='#ffffff'
        ><font face='黑体' size='6'><font color='#ff0000'>我</font><font color='#ff8000'>的</font><font color='#008000'>博</font><font color='#0000ff'>客</font></font></td></tr></table></div>
    <hr>
    <ul>
    <% for(let item of postList){ %>
      <li>
        <a href='<%=item.link%>'><%=item.title%></a><br>
        <font size='1'>标签：数学</font>
      </li>
    <% } %>
    </ul>
  </body>
</html>

