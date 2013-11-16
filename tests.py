import unittest
import requests as r
import json
from functools import partial

r.get = partial(r.get, verify=False)
r.post = partial(r.post, verify=False)
r.put = partial(r.put, verify=False)
r.delete = partial(r.delete, verify=False)

class TodoTests(unittest.TestCase):

    @classmethod
    def setUpClass(cls):
        cls.url = 'https://localhost:4333'
        cls.new_user_details = {
            'email': 'test_user@gmail.com',
            'password': 'testing123'
        }
        res = r.post(cls.url + '/api/users', cls.new_user_details)
        cls.new_user_details['api_key'] = json.loads(res.text)['api_key']
        cls.api_query = '?api_key=' + cls.new_user_details['api_key']

    def test_login(self):
        res = r.post(self.url + '/api/login', self.new_user_details)
        res_data = json.loads(res.text)
        self.assertEqual(res.status_code, 200)
        self.assertEqual(self.new_user_details['email'], res_data['email'])

    def test_create_todo(self):
        res = r.post(self.url + '/api/todos' + self.api_query, {'text': 'Test todo.'})
        res_data = json.loads(res.text)
        self.assertEqual(res.status_code, 200)
        self.assertEqual(res_data['todo']['text'], 'Test todo.')
        res = r.delete(self.url + '/api/todos/' + res_data['todo']['_id'] + self.api_query)

    def test_list_todos(self):
        created_todos = []
        
        res = r.post(self.url + '/api/todos' + self.api_query, {'text': 'Test todo 1.'})
        created_todos.append(json.loads(res.text)['todo']['_id'])

        res = r.post(self.url + '/api/todos' + self.api_query, {'text': 'Test todo 2.'})
        created_todos.append(json.loads(res.text)['todo']['_id'])

        res = r.get(self.url + '/api/todos' + self.api_query)
        for todo in json.loads(res.text)['todos']:
            self.assertEqual(todo['owner'], self.new_user_details['email'])
        
        for ID in created_todos:
            r.delete(self.url + '/api/todos/' + ID + self.api_query)

    def test_edit_todo(self):
        res = r.post(self.url + '/api/todos' + self.api_query, {'text': 'Test todo 1.'})
        created_todo_id = json.loads(res.text)['todo']['_id']

        updated_data = {
            'text': 'updated todo text',
            'priority': 3,
            'completed': True
        }

        res = r.put(self.url + '/api/todos/' + created_todo_id + self.api_query, updated_data)
        
        res = r.get(self.url + '/api/todos/' + created_todo_id + self.api_query)
        todo_data = json.loads(res.text)['todo']

        self.assertEqual(todo_data['text'], updated_data['text'])
        self.assertEqual(todo_data['priority'], updated_data['priority'])
        self.assertEqual(todo_data['completed'], updated_data['completed'])

    # TODO: add tests that SHOULD fail

    @classmethod
    def tearDownClass(cls):
        res = r.delete('https://localhost:4333/api/users/' + cls.new_user_details['email'] + cls.api_query)


if __name__ == '__main__':
    unittest.main()
