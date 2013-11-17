var User = require('../models/user');
var auth = require('./auth');
var helpers = require('../helpers');

var user = {};

user.new = function(req, res) {
    var user_data = {
        email: req.body.email,
        password: req.body.password
    }
    User.create(user_data, function(err, user) {
        if (err)
            return res.json(500, err);
        res.json(200, {
            status_code: 200,
            message: 'Created new user.',
            email: user.email,
            api_key: user.api_key
        });
    })
}

user.delete = function(req, res) {
    User.findOne({ email: req.params.email }, function(err, user) {
        if (user.email !== req.session.email)
            return res.json(403, { status_code: 403, message: 'Forbidden user.' });
        user.remove();
        res.json({ message: 'okay' });
    })
}

user.login = function(req, res) {
    var email = req.body.email,
        password = req.body.password,
        api_key = req.body.api_key;

    if (api_key) {
        User.findOne({ api_key: api_key }, function(err, user) {
            if (err)
                return helpers.handle_error(err, res);
            if (!user)
                return auth.fail(res);
            auth.success(req, res, user);
        })
    } else {
        User.findOne({ email: email }, function(err, user) {
            if (err)
                helpers.handle_error(err, res);
            if (!user)
                return auth.fail(res);
            if (!user.compare_password(password))
                return auth.fail(res);
            auth.success(req, res, user);
        })
    }
}

user.logout = function(req, res) {
    req.session = null;
    res.json({ status_code: 200, message: "You're now logged out."});
}

user.new_api_key = function(req, res) {
    var email = req.session.email;
    User.findOne({ email: email }, function(err, user) {
        if (err)
            return helpers.handle_error(err, res);
        if (!user)
            return res.json(404, { message: 'User not found.' })
        user.api_key = helpers.generate_id();
        user.save(function() {
            res.json({ message: "Generated new api key.", api_key: user.api_key });
        });  
    })
}

module.exports = user;
