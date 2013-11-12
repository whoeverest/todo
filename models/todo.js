var mongoose = require('mongoose');

var TodoSchema = new mongoose.Schema({
	text: { type: String, required: true },
	priority: { type: Number, required: true, default: 2 },
	due_date: { type: Date },
	completed: { type: Boolean },
	owner: { type: String },
})

TodoSchema.path('text').validate(function(text) {
	return text.length < 1000;
}, 'Text is too >1000 chars.')

TodoSchema.path('priority').validate(function(priority) {
	return (priority == 1 || priority == 2 || priority == 3);
}, 'Priority value is wrong');

module.exports = mongoose.model('Todo', TodoSchema);
