<p>Update Task</p>
<form action="/update_task" method="POST">
    <input type="text" size="100" maxlength="100" name="id" value="{{str(row['id'])}}" hidden/>
    <input type="text" size="100" maxlength="100" name="updated_task" value="{{row['task']}}"/>
    <label for="priority">Priority:</label>
    <select id="priority" name="Priority" value="2">
        <option value="0">Low</option>
        <option value="1">Normal</option>
        <option value="2">High</option>
    </select>
    <hr/>
    <input type="submit" name="update_button" value="Update"/>
    <a href="/">Cancel</a>
</form>

<script>
    priorityDropdown = document.getElementById("priority");
    priorityDropdown.options[{{row['Priority']}}].selected = true;
</script>