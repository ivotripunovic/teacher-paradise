"""
test_getall users
get users

create user
update user
add date
remove date
"""
import unittest

from flask import json
from app import app

url = '/students'


class StudentTest(unittest.TestCase):

    def test_create_student(self):
        tester = app.test_client(self)
        student = {'name': 'Josh'}
        resp = tester.post(url, json=student)
        self.assertEqual(200, resp.status_code)
        self.assertEqual('Josh', resp.get_json()['name'])

    def test_list_student(self):
        tester = app.test_client(self)
        resp = tester.get(url)
        self.assertEqual(200, resp.status_code)
        self.assertEqual(4, len(resp.get_json()))

if __name__ == '__main__':
    unittest.main()
