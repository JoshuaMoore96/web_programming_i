<p>Update Task</p>
<form action="/update_item" method="POST">
    <input type="text" size="100" maxlength="100" name="id" value="{{str(row[0])}}" hidden/>
    <input type="text" size="100" maxlength="100" name="updated_item" value="{{row[1]}}"/>
    <hr/>
    <input type="submit" name="update_button" value="Update"/>
    <a href="/">Cancel</a>
</form>