<html>
<head>
  <title>Todo List 0.002</title>
  <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet"/>
  <link href="https://www.w3schools.com/w3css/4/w3.css" rel="stylesheet" />
  <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>
  <script>
  priorities = ['low_priority','format_list_bulleted', 'priority_high'];
  myList = [];
  allCompleted = true;
  $(document).ready(function() {
    $.getJSON("https://dev-joshuamoore96.pythonanywhere.com/get_tasks", function(rows) {
        $.each(rows, function(i, row) {
            myList.push("<tr>");
            myList.push("<td><a href=\"/update_task/" + row["id"] + "\"><i class=\"material-icons\">edit</i></a></td>");
            myList.push("<td><p class=\"text_priority_" + row["Priority"]);
            if(row["status"])
                myList.push(" completed");
            myList.push("\">" + row["task"] + "</p></td>");
            myList.push("<td><i class=\"material-icons\">" + priorities[row["Priority"]] + "</i></td>");
            if (row["status"]){
                myList.push("<td><a href=\"/update_status/" + row["id"] + "/0\"><i class=\"material-icons\">check_box</i></a></td>");
            }
            else{
                myList.push("<td><a href=\"/update_status/" + row["id"] + "/1\"><i class=\"material-icons\">check_box_outline_blank</i></a></td>");
                allCompleted = false;
            }
            myList.push("<td><a href=\"/delete_item/" + row["id"] + "\"><i class=\"material-icons\">delete</i></a></td>")
            myList.push("</tr>");
        });
        myList = myList.join("");
        $("#content tr:last").after(myList);
        if (allCompleted){
            $("#tasks-done").append("<h1>You have completed all of your tasks!</h1>" +
            "<p>Now you can relax and play a game:</p>" +
            "<a href=\"/bubbles\"><button class=\"w3-button w3-indigo\">Bubble Game</button></a>");
        }
    });
  })
  </script>
  <style>
    .text_priority_0{
        color: darkcyan;
    }
    .text_priority_1{
        color: black;
    }
    .text_priority_2{
        color: firebrick;
        font-weight: bold;
    }
    .completed{
        text-decoration: line-through;
        color: black;
    }
  </style>
</head>
<body>
%include("header.tpl", session=session)
<table class="w3-table w3-bordered w3-border">
    <tbody id="content">
        <tr>To Do:</tr>
    </tbody>
</table>
<div style="text-align:center" id="tasks-done">
</div>
%include("footer.tpl", session=session)
</body>
</html>