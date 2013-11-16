var Todo = require('../models/todo');
var helpers = require('../helpers');

todo = {};

todo.list_all = function(req, res) {
    Todo.find({ owner: req.session.email }, function(err, todos) {
        if (err)
            return helpers.handle_error(err, res);
        res.json({
            status_code: 200,
            todos: todos
        });
    })
}

todo.show_one = function(req, res) {
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
}

todo.new = function(req, res) {
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
}

todo.edit = function(req, res) {
    Todo.update({ _id: req.params.id, owner: req.session.email }, { $set: req.body }, function(err, todo) {
        if (err)
            return helpers.handle_error(err, res);
        res.json({
            code: 200,
            todo: todo
        });
    })
}

todo.delete = function(req, res) {
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
}

module.exports = todo;
