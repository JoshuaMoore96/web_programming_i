<p>New Task</p>
<form action="/new_item" method="POST">
    <input type="text" size="100" maxlength="100" name="new_task"/>
    <label for="priority">Priority:</label>
    <select id="priority" name="Priority" value="2">
        <option value="0">Low</option>
        <option value="1" selected>Normal</option>
        <option value="2">High</option>
    </select>
    <hr/>
    <input type="submit" name="save" value="Save"/>
    <a href="/">Cancel</a>
</form>