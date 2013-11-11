var mongoose = require('mongoose');

var TodoSchema = new mongoose.Schema({
	text: { type: String, required: true },
	priority: { type: Number, required: true, default: 2 },
	due_date: { type: Date },
	completed: { type: Boolean }
})

module.exports = mongoose.model('Todo', TodoSchema);
