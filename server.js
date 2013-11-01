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

var express = require('express');
var winston = require('winston');
var mongoose = require('mongoose');

var todo_model = {
	id: '123',
	text: 'something',
	status: ['active', 'completed', 'deleted'],  // I can mark an entry as completed
	priority: ['low', 'normal', 'high'],  // Assign priorities and due dates to the entries // 1, 2, 3 in order to be sortable?
	due: 'date'
}

var user_model = {
	id: '123',http://stackoverflow.com/questions/10298291/cannot-push-to-github-keeps-saying-need-merge
	email: 'asd@gmail.com',
	password: 'hash(password)',

}

app = express()

app.get('/', function(req, res) {
	res.end('Got it.')
})

// I can have my todo list displayed
app.get('/api/todos', function(req, res) {
	res.json({ code: 200, message: 'List of todos...'})
})

// I can manipulate my list ...
app.get('/api/todos/:id', function(req, res) {
	res.json({ code: 200, todo: todo_model })
})

// ... add
app.post('/api/todos/:id', function(req, res) {
	res.json({ code: 200, message: 'Created new todo.' })
})

// ... modify
app.put('/api/todos/:id', function(req, res) {
	res.json({ code: 200, message: 'Updated todo with id 123.'})
})

// ... and remove entries
app.delete('/api/todos/:id', function(req, res) {
	res.json({ code: 200, message: 'Deleted todo with id 123.'})
})

// As complementary to the last item, one should be able to create users
// in the system via an interface, probably a signup/register screen
app.get('/signup', function(req, res) {
	res.end('<html><form></form></html>') // Or a normal API call?
})

app.post('/signup', function(req, res) {
	res.end('signup post');
})

app.get('/login', function(req, res) {
	res.end('login');
})

app.post('/login', function(req, res) {
	res.end('login post');
})

app.post('/logout', function(req, res) {
	res.end('logout');
})

app.listen(4333) // Make it HTTPS
