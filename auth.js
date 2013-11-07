var express = require('express');
var fs = require('fs');
var uuid = require('node-uuid');

function auth(req, res, next) {
    console.log(req.query.id);
    if (req.cookies['Session-Id'] && sessions[req.cookies['Session-Id']])
        if (req.query.id !== 'localhost')
            return res.redirect('/login');
        next();
    if (api_key)
        next();
    return res.redirect('/login');
}

var sessions = {}

app = express()
app.use(express.bodyParser());
app.use(express.cookieParser());

app.use('/api', auth);

function check_credentials(username, password) {
    return username === 'andrej' && password === 'asd123';
}

app.get('/', auth, function(req, res) {
    res.end('homepage');
})

app.get('/login', function(req, res) {
    res.setHeader('Content-Type', 'text/html');
    res.end(fs.readFileSync('login.html'));
})

app.post('/login', function(req, res) {
    if (check_credentials(req.body.username, req.body.password)) {
        var token = uuid.v4()
        sessions[token] = req.body.username;
        res.cookie('Session-Id',
                   token,
                   { expires: new Date(Date.now() + 60 * 60 * 1000) });
        return res.redirect('/');
    }
    return res.status(403).end('Bad login.');

})

app.listen(8000)
