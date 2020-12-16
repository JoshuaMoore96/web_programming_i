<h3>Basic Todo List, version 1</h3>
<hr/>
<table border="1">
%for row in rows: 
    <tr>
    %for item in row:
        <td>{{str(item)}}</td>
    %end
    </tr>
%end
</table>
<hr/>
<a href="\new_item">New Item...</a>