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
 - You need to be able to pass credentials to both the webpage and the API.
 - As complementary to the last item, one should be able to create users in the system via an interface, probably a signup/register screen.

NOTE: Keep in mind that this is the project that will be used to evaluate your skills.
So we do expect you to make sure that the app is fully functional and doesn't have any obvious missing pieces.
*/

var fs = require('fs');
var path = require('path');
var https = require('https');
var crypto = require('crypto');

var express = require('express');
var winston = require('winston');
var mongoose = require('mongoose');

var User = require('./models/user');
var Todo = require('./models/todo');
var helpers = require('./helpers');

var private_key  = fs.readFileSync('ssl/ssl.key', 'utf8');
var certificate = fs.readFileSync('ssl/ssl.crt', 'utf8');
var ssl_options = { key: private_key, cert: certificate };

var config = require('./config');

app = express();
app.use(express.json());
app.use(express.urlencoded());
app.use(express.cookieParser());
app.use(express.session({ secret: '123asd' }));
app.use(express.static('frontend'));

var sessions = {}

var auth =  function(req, res, next) {
    var session_id = req.cookies['Session-Id'];
    var api_key = req.query.api_key;
    
    if (session_id == undefined && api_key == undefined) {        
        return res.json(403, { status_code: 403, message: 'Forbidden.' });
    }
    
    if (sessions[session_id]) {
        req.session.email = sessions[session_id].email;
        return next();
    }

    if (api_key) {
        User.findOne({ api_key: api_key }, function(err, user) {
            if (err)
                return helpers.handle_error(err, res);
            if (!user)
                return res.json(403, { status_code: 403, message: 'Forbidden.' });
            req.session.email = user.email;
            next();
        })
    } else {
        return res.json(403, { status_code: 403, message: 'Forbidden.' });
    }
}

app.use('/api', helpers.log);
app.use('/noauth', helpers.log);
app.use('/api', auth);

app.get('/', function(req, res) {
    var html = fs.readFileSync('./frontend/index.html');
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.end(html);
})

// I can have my todo list displayed
app.get('/api/todos', function(req, res) {
    Todo.find({ owner: req.session.email }, function(err, todos) {
        if (err)
            return helpers.handle_error(err, res);
        res.json({
            status_code: 200,
            todos: todos
        });
    })
})

// I can manipulate my list ...
app.get('/api/todos/:id', function(req, res) {
    Todo.findById(req.params.id, function(err, todo) {
        if (err)
            return helpers.handle_error(err, res);
        if (todo.owner !== req.session.email)
            return res.json(403, { status_code: 403, message: 'Forbidden todo.' });
        res.json({
            status_code: 200,
            todo: todo
        })
    })
})

// ... add
app.post('/api/todos', function(req, res) {
    var new_todo = new Todo(req.body);
    new_todo.owner = req.session.email;
    new_todo.save(function(err) {
        if (err)
            return helpers.handle_error(err, res);
        res.json({
            code: 200,
            todo: new_todo
        })
    })
})

// ... modify
app.put('/api/todos/:id', function(req, res) {
    Todo.update({ _id: req.params.id, owner: req.session.email }, { $set: req.body }, function(err, todo) {
        if (err)
            return helpers.handle_error(err, res);
        res.json({
            code: 200,
            todo: todo
        });
    })
})

// ... and remove entries
app.delete('/api/todos/:id', function(req, res) {
    Todo.findById(req.params.id, function(err, todo) {
        if (err)
            return helpers.handle_error(err, res);
        if (todo.owner !== req.session.email)
            return res.json(403, { status_code: 403, message: 'Forbidden todo.' });
        todo.remove();
        res.json({
            code: 200
        });
    })
})

// As complementary to the last item, one should be able to create users
// in the system via an interface, probably a signup/register screen
app.post('/noauth/api/signup', function(req, res) {
    var user_data = {
        email: req.body.email,
        password: req.body.password
    }
    User.create(user_data, function(err) {
        if (err)
            return res.json(err);
        res.json(200, { message: 'Created new user for ' + user_data.email });
    })
})

app.post('/noauth/api/login', function(req, res) {
    var email = req.body.email,
        password = req.body.password;
    User.findOne({ email: email }, function(err, user) {
        if (err)
            console.log(err);
        if (!user)
            return res.json(403, { message: 'Login failed.' });
        if (!user.compare_password(password))
            return res.json(403, { message: 'Login failed.' });
        var new_session_id = helpers.generate_id();
        sessions[new_session_id] = { email: email };
        res.cookie('Session-Id', new_session_id, { httpOnly: true, secure: true });
        res.json({
            status_code: 200,
            message: 'Logged in.'
        })
    })
})

app.post('/api/logout', function(req, res) {
    delete sessions[req.cookies['Session-Id']];
    res.clearCookie('Session-Id');
    res.json({ status_code: 200, message: "You're now logged out."});
})

mongoose.connect('mongodb://localhost/todo_db');

server = https.createServer(ssl_options, app);
server.listen(4333);
