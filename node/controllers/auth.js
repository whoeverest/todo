var User = require('../models/user');
var helpers = require('../helpers');

var auth = {};

auth.api_key = function(req, res, next) {
    var api_key = req.query.api_key;
    User.findOne({ api_key: api_key }, function(err, user) {
        if (err)
            return helpers.handle_error(err, res);
        if (user)
            req.session['email'] = user.email;
        next();
    })
}

auth.password = function(req, res, next) {
    if (req.session.email) {
        next();
    } else {
        auth.fail(res);
    }
}

auth.success = function(req, res, user) {
    req.session['email'] = user.email;
    res.json({
        status_code: 200,
        message: 'Logged in.',
        email: user.email,
        api_key: user.api_key
    })
}

auth.fail = function(res) {
    res.json(403, { message: 'Login failed.' });
}

module.exports = auth;
