var mongoose = require('mongoose');

var SessionSchema = new mongoose.Schema({
	id: { type: String, required: true, index: { unique: true }},
	user: { type: String, required: true },
})

module.exports = mongoose.model('Session', SessionSchema);
