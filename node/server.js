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
var https = require('https');

var express = require('express');
var MongoStore = require('connect-mongo')(express);
var mongoose = require('mongoose');

var auth = require('./controllers/auth');
var controllers = {
    todo: require('./controllers/todo'),
    user: require('./controllers/user'),
}

var helpers = require('./helpers');

var private_key  = fs.readFileSync('ssl/ssl.key', 'utf8');
var certificate = fs.readFileSync('ssl/ssl.crt', 'utf8');
var ssl_options = { key: private_key, cert: certificate };

var config = require('./config');

app = express();
app.use(helpers.log);
app.use(express.static('frontend'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.cookieParser());
app.use(express.session({
    secret: 'O8gu2odaivgp8u2owg842urwf2883ufdf24yt6h0',
    store: new MongoStore({ db: 'todo_db' })
}));

app.get('/', function(req, res) {
    var html = fs.readFileSync('./frontend/index.html');
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(html);
});

app.get('/api/todos',
    auth.api_key, auth.password,
    controllers.todo.list_all);
app.get('/api/todos/:id',
    auth.api_key, auth.password,
    controllers.todo.show_one);
app.post('/api/todos',
    auth.api_key, auth.password,
    controllers.todo.new);
app.put('/api/todos/:id',
    auth.api_key, auth.password,
    controllers.todo.edit);
app.delete('/api/todos/:id',
    auth.api_key, auth.password,
    controllers.todo.delete);

app.post('/api/users',
    controllers.user.new);
app.delete('/api/users/:email',
    auth.api_key, auth.password,
    controllers.user.delete);
app.post('/api/login',
    controllers.user.login);
app.post('/api/logout',
    auth.api_key, auth.password,
    controllers.user.logout);

app.post('/api/new_api_key',
    auth.password,
    controllers.user.new_api_key)

mongoose.connect('mongodb://localhost/todo_db');

server = https.createServer(ssl_options, app);
server.listen(4333);
