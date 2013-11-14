var mongoose = require('mongoose');
var validators = require('validator').validators;
var bcrypt = require('bcrypt');

var helpers = require('../helpers');

var UserSchema = new mongoose.Schema({
	email: { type: String, required: true, index: { unique: true }},
	password: { type: String, required: true },
	salt: { type: String },
	api_key: { type: String }
})

UserSchema.path('email').validate(validators.isEmail, 'Invalid email');

UserSchema.path('password').validate(function(password) {
	return password.length >= 6;
}, 'Password is too short')

UserSchema.pre('save', function(next) {
	this.password = bcrypt.hashSync(this.password, 12);
	next();
})

UserSchema.pre('save', function(next) {
	this.api_key = helpers.generate_id();
	next();
})

UserSchema.methods.compare_password = function(candidate) {
	return bcrypt.compareSync(candidate, this.password);
}

module.exports = mongoose.model('User', UserSchema);
