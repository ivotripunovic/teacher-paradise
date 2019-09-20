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

    def test_get_user(self):
        tester = app.test_client(self)
        resp = tester.get(url + '/1')
        self.assertEqual(200, resp.status_code)
        self.assertEqual('Tana', resp.get_json()['name'])

    def test_update_user_name(self):
        tester = app.test_client(self)
        resp = tester.get(url + '/1')
        student = resp.get_json()
        student['name'] = 'banana'
        resp = tester.put(url + '/1', json=student)
        self.assertEqual(200, resp.status_code)

        resp = tester.get(url + '/1')
        self.assertEqual(200, resp.status_code)
        self.assertEqual('banana', resp.get_json()['name'])

    def test_add_date(self):
        tester = app.test_client(self)
        resp = tester.post(url + '/1/dates/2016-08-29')
        self.assertEqual(200, resp.status_code)

        resp = tester.get(url + '/1')
        self.assertEqual(200, resp.status_code)
        self.assertEqual('2016-08-29', resp.get_json()['dates'][0])

    def test_delete_date(self):
        tester = app.test_client(self)
        resp = tester.delete(url + '/1/dates/2016-08-29')
        self.assertEqual(200, resp.status_code)

        resp = tester.get(url + '/1')
        self.assertEqual(200, resp.status_code)
        self.assertEqual(0, len(resp.get_json()['dates']))


if __name__ == '__main__':
    unittest.main()
