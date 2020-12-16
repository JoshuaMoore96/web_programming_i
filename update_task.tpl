<p>Update Task</p>
<form action="/update_task" method="POST">
    <input type="text" size="100" maxlength="100" name="id" value="{{str(row['id'])}}" hidden/>
    <input type="text" size="100" maxlength="100" name="updated_task" value="{{row['task']}}"/>
    <hr/>
    <input type="submit" name="update_button" value="Update"/>
    <a href="/">Cancel</a>
</form>