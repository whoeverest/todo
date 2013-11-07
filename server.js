/*
Could you write me a todo list management web application where:
 - I can have my todo list displayed.
 - I can manipulate my list (add/remove/modify entries).
 - Assign priorities and due dates to the entries.
 - I can sort my entry lists using due date and priority.
 - I can mark an entry as completed.
 - Minimal UI/UX design is needed. (Bootstrap)
 - I need every client operation done using JavaScript, reloading the page is not an option. (Angular.js)
 - Write a RESTful API which will allow a third-party application to trigger actions on your app (same actions available on the webpage).
 - You need to be able to pass credentials to both the webpage and the API. // user + pass && api_key
 - As complementary to the last item, one should be able to create users in the system via an interface, probably a signup/register screen.

NOTE: Keep in mind that this is the project that will be used to evaluate your skills.
So we do expect you to make sure that the app is fully functional and doesn't have any obvious missing pieces.
*/
var fs = require('fs');
var path = require('path');

var express = require('express');
var winston = require('winston');
var mongoose = require('mongoose');

// var User = require('./models/user');
var Todo = require('./models/todo');

var todo_model = {
    id: '123',
    text: 'something',
    status: ['active', 'completed', 'deleted'],  // I can mark an entry as completed
    priority: ['low', 'normal', 'high'],  // Assign priorities and due dates to the entries // 1, 2, 3 in order to be sortable?
    due: 'date'
}

var user_model = {
    id: '123',
    email: 'asd@gmail.com',
    password: 'hash(password)',

}

app = express()
app.use(express.bodyParser());
app.use(express.cookieParser());

app.use(express.static('frontend'));

// app.use('/api', auth);

app.get('/', function(req, res) {
    var html = fs.readFileSync('./frontend/index.html');
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.end(html);
})

// I can have my todo list displayed
app.get('/api/todos', function(req, res) {
    Todo.find({}, function(err, todos) {
        res.json({ status: 200, results: todos });
    })
})

// I can manipulate my list ...
app.get('/api/todos/:id', function(req, res) {
    Todo.findById(req.params.id, function(err, todo) {
        res.json({ code: 200, todo: todo })
    })
})

// ... add
app.post('/api/todos', function(req, res) {
    var new_todo = new Todo(req.body);
    new_todo.save(function() {
        res.json({ code: 200, new_todo: new_todo })
    })
})

// ... modify
app.put('/api/todos/:id', function(req, res) {
    Todo.update({_id: req.params.id}, { $set: req.body }, function(err, todo) {
        res.json({ code: 200, todo: todo });
    })
})

// ... and remove entries
app.delete('/api/todos/:id', function(req, res) {
    Todo.findById(req.params.id, function(err, todo) {
        todo.remove();
        res.json({ code: 200, message: 'Deleted todo.', todo: todo });
    })
})

// As complementary to the last item, one should be able to create users
// in the system via an interface, probably a signup/register screen
app.get('/signup', function(req, res) {
    res.end('<html><form></form></html>') // Or a normal API call?
})

app.post('/signup', function(req, res) {
    var email = req.body.username,
        password = req.body.password;
    User.create({ email: email, password: password }, function(err) {
        if (err)
            console.log(err);
        res.json(400, { status_code: 400, message: err });
    })
})

app.post('/login', function(req, res) {
    var email = req.body.email,
        pass = req.body.password;
    if (check_credentials(email, pass)) {
        var token = start_session(email);
        res.cookie('Session-Id', token, { maxAge: 60 * 60 * 1000 });
        res.json({ status_code: 200, message: 'Logged in.'});
    } else {
        res.json(403, { status_code: 403, message: 'Login failed.'});
    }
})

app.post('/logout', function(req, res) {
    delete sessions[req.cookies['Session-Id']];
    res.clearCookie('Session-Id');
    res.json({ status_code: 200, message: "You're now logged out."});
})

mongoose.connect('mongodb://localhost/todo_db');
app.listen(4333) // Make it HTTPS