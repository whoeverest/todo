import json
from datetime import datetime

class Todo(object):

	def __init__(self):
		now = datetime.isoformat(datetime.now())
		self.todos = [
			{ '_id': '1', 'text': 'first todo', 'due_date': now, 'priority': 2 },
			{ '_id': '2', 'text': 'second one', 'due_date': now, 'priority': 3 },
			{ '_id': '3', 'text': 'third', 'due_date': now, 'priority': 1, 'completed': True },
			{ '_id': '4', 'text': '4-th ToDo', 'due_date': now  },
			{ '_id': '5', 'text': 'Fifth td.', 'due_date': now  }
		]
		self.last_id = 5

	def list_all(self):
		return { 'todos': self.todos }

	def new(self, options):
		self.last_id += 1
		new_todo = {}
		new_todo['id'] = self.last_id
		new_todo.update(options)
		self.todos.append(new_todo)
		return { 'todo': todo }

	def show_one(self, id):
		todo = filter(lambda todo: todo['_id'] == id, self.todos)[0]
		return { 'todo': todo }

	def edit(self, id, options):
		return {'message': 'ok'}

	def delete(self, id):
		return todos[0]
