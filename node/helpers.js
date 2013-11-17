var uuid = require('uuid');

module.exports = {
	log: function(req, res, next) {
	    console.log(Date.now(), req.method, req.path);
	    next();
	},
	handle_error: function(err, res) {
	    console.error(err);
	    res.json(500, {
	        status_code: 500,
	        message: 'Something bad happened.'
	    })
	},
	generate_id: function() {
	    return uuid.v4();
	}
}