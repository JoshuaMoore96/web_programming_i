<html>
<head>
  <title>Todo List 0.001</title>
  <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet"/>
  <link href="https://www.w3schools.com/w3css/4/w3.css" rel="stylesheet" />
  <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>
  <script>
  $(document).ready(function() {
    $.getJSON("http://dev-web-drdelozier.pythonanywhere.com/get_tasks", function(rows) {
        $("#content").append("<table class=\"w3-table w3-bordered w3-border>\"");
        $.each(rows, function(i, row) {
            $("#content").append("<tr>");
                $("#content").append("<td><a href=\"/update_task/\"" + row["id"] + "><i class=\"material-icons\">edit</i></a></td>");
                $("#content").append("<td>" + row["task"] + "</td>");
                if (row["status"]) {
                    $("#content").append("<td><a href=\"/update_status/\"" + row["id"] + "/0><i class=\"material-icons\">check_box</i></a></td>");
                }
                else {
                    $("#content").append("<td><a href=\"/update_status/\"" + row["id"] + "/1><i class=\"material-icons\">check_box_outline_blank</i></a></td>");
                }
                $("#content").append("<td><a href=\"/delete_item/\"" + row["id"] + "><i class=\"material-icons\">delete</i></a></td>");
            $("#content").append("</tr>");
        });
        $("#content").append("</table>");
    });
  })
  </script>
</head>
<body>
%include("header.tpl", session=session)
<div id="content"></div>
%include("footer.tpl", session=session)
</body>
</html>