var mongoose = require('mongoose');

var UserSchema = new mongoose.Schema({
	email: { type: String, required: true, index: { unique: true }},
	password: { type: String, required: true },
})

module.exports = mongoose.model('User', UserSchema);
