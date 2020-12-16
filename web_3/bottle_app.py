# A very simple Bottle Hello World app for you to get started with...
import datetime
import time
import os
import random
import sqlite3
import uuid

from tinydb import TinyDB, Query
db = TinyDB("sessions.json")
query = Query()

from bottle import get, post, request, response, template, redirect

ON_PYTHONANYWHERE = "PYTHONANYWHERE_DOMAIN" in os.environ.keys()

if ON_PYTHONANYWHERE:
    from bottle import default_app
else:
    from bottle import run, debug

random.seed()

@get('/')
def get_show_list():

    # ask for cookie, if we don't have one start a guest session
    session_id = request.cookies.get("session_id",None)
    if session_id == None:
        session_id = str(uuid.uuid4())
        session = {'session_id':session_id, "username":"Guest", "time":int(time.time())}
        db.insert(session)
        response.set_cookie("session_id",session_id)
    # had a cookie with an id, look up the session
    else:
        result = db.search(query.session_id == session_id)
        # the session isn't found, start a new one
        if len(result) == 0:
            session_id = str(uuid.uuid4())
            session = {'session_id':session_id, "username":"Guest", "time":int(time.time())}
            db.insert(session)
            response.set_cookie("session_id",session_id)
        # the session is found, use it
        else:
            session=result[0]

    connection = sqlite3.connect("todo.db")
    cursor = connection.cursor()
    cursor.execute("select * from todo")
    result = cursor.fetchall()
    cursor.close()
    return template("show_list", rows=result, session={})

@get('/sandbox')
def get_sandbox():
    return template("sandbox")

@get('/ajaxdemo')
def get_ajaxdemo():
    return template("ajaxdemo")

@get('/jquerydemo')
def get_jquerydemo():
    return template("jquerydemo")

@get('/login')
def get_login():
    return template("login", csrf_token="abcrsrerredadfa")

@post('/login')
def post_login():
    csrf_token = request.forms.get("csrf_token").strip()
    if csrf_token != "abcrsrerredadfa":
        redirect('/login_error')
        return
    username = request.forms.get("username").strip()
    password = request.forms.get("password").strip()
    if password != "password":
        redirect('/login_error')
        return
    session_id = request.cookies.get("session_id",str(uuid.uuid4()))
    result = db.search(query.session_id == session_id)
    if len(result) == 0:
        db.insert({'session_id':session_id, 'username':username})
    else:
        session = result[0]
        db.update({'username':username},query.session_id == session_id)
    response.set_cookie("session_id",session_id)
    redirect('/')

@get('/logout')
def get_logout():
    session_id = request.cookies.get("session_id",str(uuid.uuid4()))
    result = db.search(query.session_id == session_id)
    if len(result) == 0:
        db.insert({'session_id':session_id, 'username':"Unknown"})
    else:
        db.update({'username':"Unknown"},query.session_id == session_id)
    response.set_cookie("session_id",session_id)
    redirect('/')

@get('/login_error')
def get_login_error():
    return template("login_error")

@get('/set_status/<id:int>/<value:int>')
def get_set_status(id, value):
    connection = sqlite3.connect("todo.db")
    cursor = connection.cursor()
    cursor.execute("update todo set status=? where id=?", (value, id,))
    connection.commit()
    cursor.close()
    redirect('/')


@get('/new_item')
def get_new_item():
    return template("new_item")


@post('/new_item')
def post_new_item():
    new_item = request.forms.get("new_item").strip()
    connection = sqlite3.connect("todo.db")
    cursor = connection.cursor()
    cursor.execute("insert into todo (task, status) values (?,?)", (new_item, 1))
    connection.commit()
    cursor.close()
    redirect('/')


@get('/update_item/<id:int>')
def get_update_item(id):
    connection = sqlite3.connect("todo.db")
    cursor = connection.cursor()
    cursor.execute("select * from todo where id=?", (id,))
    result = cursor.fetchall()
    cursor.close()
    return template("update_item", row=result[0])


@post('/update_item')
def post_update_item():
    id = int(request.forms.get("id").strip())
    updated_item = request.forms.get("updated_item").strip()
    connection = sqlite3.connect("todo.db")
    cursor = connection.cursor()
    cursor.execute("update todo set task=? where id=?", (updated_item, id,))
    connection.commit()
    cursor.close()
    redirect('/')

@get('/delete_item/<id:int>')
def get_delete_item(id):
    print("we want to delete #" + str(id))
    connection = sqlite3.connect("todo.db")
    cursor = connection.cursor()
    cursor.execute("delete from todo where id=?", (id,))
    connection.commit()
    cursor.close()
    redirect('/')

@get("/picture")
def get_picture():
    # picture from here: https://editor.p5js.org/p5/sketches/Hello_P5:_animate
    # p5js.org
    return template("picture")


@get("/visit")
def get_visit():
    session_id = request.cookies.get("session_id",str(uuid.uuid4()))
    result = db.search(query.session_id == session_id)
    if len(result) == 0:
        db.insert({'session_id':session_id, 'visit_count':1})
        visit_count = 1
    else:
        session = result[0]
        visit_count = session['visit_count'] + 1
        db.update({'visit_count':visit_count},query.session_id == session_id)
    response.set_cookie("session_id",session_id)
    return(f"Welcome, session_id #{session_id}. Visit# {visit_count}.")

if ON_PYTHONANYWHERE:
    application = default_app()
else:
    debug(True)
    run(host="localhost", port=8080)


