"""
Testing flask app
"""
import unittest
import os
import datetime

from flask import json
from app import app, db, User, Student, StudentClass

url = '/students'
TESTDB = 'test.db'


class StudentTest(unittest.TestCase):

    @classmethod
    def setUpClass(cls):
        app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///./' + TESTDB
        app.config['TESTING'] = True
        db.create_all()

        u = User(username='admin', email='admin@net.com')
        u.hash_password('sekret')
        sess = db.session
        sess.add(u)
        sess.commit()

        for n in ['Ivo', 'Tana', 'Natalija']:
            s = Student(name=n, user_id=u.id)
            sess.add(s)
        sess.commit()
        s = Student.query.get(1)
        date = datetime.datetime.strptime('2016-08-29', '%Y-%m-%d')
        sess.add(StudentClass(student_id=s.id, class_date=date))
        sess.commit()

    @classmethod
    def tearDownClass(cls):
        db.drop_all()
        os.remove(TESTDB)

    def test_create_student(self):
        tester = app.test_client(self)
        student = {'name': 'Josh'}
        resp = tester.post(url, json=student, headers=self.get_header())
        self.assertEqual(200, resp.status_code)
        self.assertEqual('Josh', resp.get_json()['name'])
        self.assertEqual(1, resp.get_json()['user_id'])

    def test_list_student(self):
        tester = app.test_client(self)
        resp = tester.get(url, headers=self.get_header())
        self.assertEqual(200, resp.status_code)
        self.assertTrue(len(resp.get_json()) >= 3)

    def test_get_user(self):
        tester = app.test_client(self)
        resp = tester.get(url + '/2', headers=self.get_header())
        self.assertEqual(200, resp.status_code)
        self.assertEqual('Tana', resp.get_json()['name'])

    def test_update_user_name(self):
        tester = app.test_client(self)
        resp = tester.get(url + '/1', headers=self.get_header())
        student = resp.get_json()
        student['name'] = 'banana'
        resp = tester.put(url + '/1', json=student, headers=self.get_header())
        self.assertEqual(200, resp.status_code)

        resp = tester.get(url + '/1', headers=self.get_header())
        self.assertEqual(200, resp.status_code)
        self.assertEqual('banana', resp.get_json()['name'])

    def test_add_date(self):
        tester = app.test_client(self)
        resp = tester.post(url + '/2/dates/2016-08-29',
                           headers=self.get_header())
        self.assertEqual(200, resp.status_code)

        resp = tester.get(url + '/2', headers=self.get_header())
        self.assertEqual(200, resp.status_code)
        self.assertEqual('2016-08-29', resp.get_json()['dates'][0])

    def test_delete_date(self):
        tester = app.test_client(self)
        resp = tester.delete(url + '/2/dates/2016-08-29',
                             headers=self.get_header())
        self.assertEqual(204, resp.status_code)

        resp = tester.get(url + '/2', headers=self.get_header())
        self.assertEqual(200, resp.status_code)
        self.assertEqual(0, len(resp.get_json()['dates']))

    def test_create_user(self):
        tester = app.test_client(self)
        user = {'user': 'ivo', 'pass': 'pa55word'}
        resp = tester.post('/users', json=user)
        self.assertEqual(201, resp.status_code)
        self.assertEqual('ivo', resp.get_json()['user'])

    def test_verify_password(self):
        tester = app.test_client(self)
        user = {'user': 'ivo', 'pass': 'pa55word'}
        resp = tester.post('/login', json=user)
        self.assertEqual(200, resp.status_code)
        self.assertIsNotNone(resp.get_json()['token'])

    def test_wrong_username(self):
        tester = app.test_client(self)
        user = {'user': 'wrong_ivo', 'pass': 'not_good_pass'}
        resp = tester.post('/login', json=user)
        self.assertEqual(401, resp.status_code)
        self.assertIsNone(resp.get_json())

    def test_wrong_password(self):
        tester = app.test_client(self)
        user = {'user': 'ivo', 'pass': 'not_good_pass'}
        resp = tester.post('/login', json=user)
        self.assertEqual(500, resp.status_code)
        self.assertIsNone(resp.get_json())

    def test_protected_route(self):
        tester = app.test_client(self)
        head = self.get_header()
        resp = tester.get('/protected', headers=head)
        self.assertEqual(200, resp.status_code)
        self.assertIsNotNone(resp.get_json()['id'])

        self.assertEqual(401, tester.get('/protected').status_code)

    def get_header(self):
        tester = app.test_client(self)
        data = {'user': 'admin', 'pass': 'sekret'}
        resp = tester.post('/login', json=data)
        token = resp.get_json()['token']

        return {'Authorization': 'Bearer ' + token}

    def test_delete_student(self):
        tester = app.test_client(self)
        resp = tester.delete('/students/4', headers=self.get_header())
        self.assertEqual(204, resp.status_code)

        resp = tester.delete('/students/4', headers=self.get_header())
        self.assertEqual(404, resp.status_code)


if __name__ == '__main__':
    unittest.main()
