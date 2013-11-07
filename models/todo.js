var mongoose = require('mongoose');

var TodoSchema = new mongoose.Schema({
	text: { type: String, required: true },
	priority: { type: String, required: true, default: 'normal' }
})

module.exports = mongoose.model('Todo', TodoSchema);
