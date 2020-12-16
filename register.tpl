<p>Register</p>
<form action="/register" method="POST">
    User Name: <input type="text" size="100" maxlength="100" name="username"/><br>
    Password:  <input type="text" size="100" maxlength="100" name="password"/><br>
    <hr>
    Token: <input type="text" size="100" maxlength="100" name="csrf_token" value="{{csrf_token}}"/><br>
    <hr>
    <input type="submit" name="register" value="Register"/>
</form>