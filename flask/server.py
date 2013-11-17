from os import path

from flask import Flask, request, abort, session, jsonify
from flask.ext.login import LoginManager, login_required, login_user, UserMixin
from OpenSSL import SSL

from controllers.todo import Todo

DIRNAME = path.dirname(path.realpath(__file__))

ssl_context = SSL.Context(SSL.SSLv23_METHOD)
ssl_context.use_privatekey_file(path.join(DIRNAME, 'ssl', 'ssl.key'))
ssl_context.use_certificate_file(path.join(DIRNAME, 'ssl', 'ssl.crt'))

app = Flask('TodoApp',
	static_folder='frontend',
	static_url_path="")
app.secret_key = '\x94\xba\xe8\xdb#\xe9\xf6*\xa9\xe6\xe7Dq\xa2\x9b\x19\x9aWpfo\xfd=\xc6'

login_manager = LoginManager(app=app)

@login_manager.user_loader
def load_user(userid):
	user = UserMixin()
	user.id 

# Instantiate models
Todo = Todo()

@app.route('/')
def index():
	return open(path.join(DIRNAME, 'frontend', 'index.html')).read()

@app.route('/api/todos', methods=['GET', 'POST'])
# @login_required
def handle_todo_no_id():
	if request.method == 'GET':
		return jsonify(Todo.list_all())
	if request.method == 'POST':
		return jsonify(Todo.new())

@app.route('/api/todos/<ID>', methods=['GET', 'PUT', 'DELETE'])
def handle_todo_with_id(ID):
	if request.method == 'GET':
		return jsonify(Todo.show_one(ID))
	if request.method == 'PUT':
		options = request.form
		return jsonify(Todo.edit(ID, options))
	if request.method == 'DELETE':
		return jsonify(Todo.delete(ID))

@app.route('/api/login', methods=["POST"])
def login():
	login_user(request.form.get('username'))


app.run(host='localhost',
	port=4333,
	ssl_context=ssl_context,
	debug=True)
