<html>
<head>
  <title>Ajax Demo Page</title>
  <script>
  function onLoad() {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            content = this.responseText;
            document.getElementById("my_text").innerHTML = content;
        }
    }
    console.log("sending request");
    xhttp.open("GET", "http://dev-web-drdelozier.pythonanywhere.com/static/data.txt", true);
    xhttp.send();
  };
  </script>
</head>
<body onload='onLoad();'>
Hello from the sandbox.
<hr/>
<div id="my_text"></div>
<hr/>
</body>
</html>