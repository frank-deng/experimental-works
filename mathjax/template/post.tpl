<html>
  <head>
    <% if(encoding){ %>
      <meta charset='<%=encoding%>'/>
    <% } %>
    <% if(title){ %>
      <title><%=title%></title>
    <% } %>
  </head>
  <body>
    <%-content%>
  </body>
</html>
