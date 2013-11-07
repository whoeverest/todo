var mongoose = require('mongoose');
var bcrypt = require('bcrypt');
var check = require('validator').check;

var UserSchema = new mongoose.Schema({
	email: { type: String, required: true, index: { unique: true }},
	password: { type: String, required: true },
	verified: { type: Boolean, required: true, default: false }
})

UserSchema.pre('save', function(next) {
	user = this;

	if (user.password.length < 8)
		return next(new Error('Password is too short'));

	next();
})

UserSchema.pre('save', function(next) {
	user = this;

	if (!check(user.email).isEmail())
		next(new Error('Email address is invalid'));

	return next();
})

UserSchema.pre('save', function(next) {
	user = this;

	if (!user.isModified('password'))
		return next();

	bcrypt.genSalt(10, function(err, salt) {
		if (err)
			return next(err);
		bcrypt.hash(user.password, salt, function(err, hash) {
			if (err)
				return next(err);
			user.password = hash;
			next();
		})
	})
})

UserSchema.methods.compare_password = function(candidate, cb) {
	bcrypt.compare(candidate, this.password, function(err, is_match) {
		if (err)
			return cb(err);
		cb(null, is_match);
	})
}

module.exports = mongoose.model('User', UserSchema);
