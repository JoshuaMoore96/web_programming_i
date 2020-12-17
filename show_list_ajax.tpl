<html>
<head>
  <title>Todo List 0.002</title>
  <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet"/>
  <link href="https://www.w3schools.com/w3css/4/w3.css" rel="stylesheet" />
  <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>
  <script>
  $(document).ready(function() {
    $.getJSON("https://dev-joshuamoore96.pythonanywhere.com/get_tasks", function(rows) {
        $.each(rows, function(i, row) {
            $("#content tr:last").after("<tr>" +
                "<td><a href=\"/update_task/" + row["id"] + "\"><i class=\"material-icons\">edit</i></a></td>" +
                "<td>" + row["task"] + "</td>" + 
                (row["status"] ?
                    ("<td><a href=\"/update_status/" + row["id"] + "/0\"><i class=\"material-icons\">check_box</i></a></td>") :
                    ("<td><a href=\"/update_status/" + row["id"] + "/1\"><i class=\"material-icons\">check_box_outline_blank</i></a></td>")) +
                "<td><a href=\"/delete_item/" + row["id"] + "\"><i class=\"material-icons\">delete</i></a></td>" +
            "</tr>");
        });
    });
  })
  </script>
</head>
<body>
%include("header.tpl", session=session)
<table class="w3-table w3-bordered w3-border">
    <tbody id="content">
        <tr>To Do:</tr>
    </tbody>
</table>
%include("footer.tpl", session=session)
</body>
</html>