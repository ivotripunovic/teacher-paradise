from flask import Flask, request, jsonify, abort, g
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from flask_httpauth import HTTPTokenAuth

import datetime

from werkzeug.security import generate_password_hash, check_password_hash
from itsdangerous import(
    TimedJSONWebSignatureSerializer as Serializer, BadSignature, SignatureExpired)
import random
import string

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///./app.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)
CORS(app)

auth = HTTPTokenAuth('Bearer')

url_students = '/students'
url_users = '/users'
secret_key = ''.join(random.choice(
    string.ascii_uppercase + string.digits) for x in range(32))


class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=True)
    password_hash = db.Column(db.String(64))

    def hash_password(self, password):
        self.password_hash = generate_password_hash(password)

    def verify_password(self, password):
        return check_password_hash(self.password_hash, password)

    def generate_auth_token(self, expiration=600):
        s = Serializer(secret_key, expires_in=expiration)
        return s.dumps({'id': self.id})

    @staticmethod
    def verify_auth_token(token):
        s = Serializer(secret_key)
        try:
            data = s.loads(token)
        except SignatureExpired:
            # Valid token, but expired
            return None
        except BadSignature:
            # Invalid token
            return None
        return data['id']

    def __repr__(self):
        return '<User %r>' % self.username

    def to_json(self):
        return {'id': self.id, 'user': self.username}


class Student(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'),
                        nullable=False)
    name = db.Column(db.String(80), nullable=False)

    def __repr__(self):
        return '<Student %r>' % self.name

    def to_json(self):
        return {'id': self.id, 'name': self.name, 'user_id': self.user_id}


class StudentClass(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    student_id = db.Column(db.Integer, db.ForeignKey('student.id'),
                           nullable=False)
    class_date = db.Column(db.DateTime, nullable=False)


@app.route(url_students, methods=['get'])
@auth.login_required
def get():
    l = Student.query.filter_by(user_id=g.user).all()
    return jsonify([s.to_json() for s in l])


@app.route(url_students, methods=['post'])
@auth.login_required
def create_student():
    user_id = g.user
    data = request.get_json() or {}

    student = Student(user_id=user_id, name=data['name'])
    db.session.add(student)
    db.session.commit()
    return student.to_json()


@app.route(url_students + '/<int:id>', methods=['get'])
@auth.login_required
def get_student(id):
    s = Student.query.get_or_404(id)
    if s.user_id != g.user:
        return "Not found", 404

    res = s.to_json()
    dates = StudentClass.query.filter_by(student_id=id).all()
    res['dates'] = [x.class_date.strftime('%Y-%m-%d') for x in dates]

    return res


@app.route(url_students + '/<int:id>', methods=['put'])
def update_student(id):
    s = Student.query.get_or_404(id)
    data = request.get_json() or {}
    s.name = data['name']
    db.session.commit()
    return s.to_json()


@app.route(url_students + '/<int:id>/dates/<string:date>', methods=['post'])
def add_date_student(id, date):
    # TODO check logged in user
    d = datetime.datetime.strptime(date, '%Y-%m-%d')
    s = StudentClass(student_id=id, class_date=d)
    db.session.add(s)
    db.session.commit()
    return ""


@app.route(url_students + '/<int:id>/dates/<string:date>', methods=['delete'])
def delete_date_student(id, date):
    # TODO check logged in user
    d = datetime.datetime.strptime(date, '%Y-%m-%d')
    s = StudentClass.query.filter_by(student_id=id, class_date=d).first()
    db.session.delete(s)
    db.session.commit()
    return "", 204


@app.route(url_users, methods=['post'])
def create_user():
    data = request.get_json() or {}
    username = data['user']
    password = data['pass']

    if username is None or password is None:
        abort(400)  # missing arguments
    if db.session.query(User).filter_by(username=username).first() is not None:
        abort(400)  # existing user

    user = User(username=username)
    user.hash_password(password)

    db.session.add(user)
    db.session.commit()
    return user.to_json(), 201


@app.route('/login', methods=['post'])
def login():
    data = request.get_json() or {}
    username = data['user']
    password = data['pass']

    if username is None or password is None:
        abort(400)  # missing arguments

    user = db.session.query(User).filter_by(username=username).first()

    if user is None:
        abort(401)  # user not found

    if not user.verify_password(password):
        abort(500)  # password not correct

    jwt = user.generate_auth_token()

    return jsonify({'token': jwt}), 200


@app.route('/protected', methods=['get'])
@auth.login_required
def protected():
    return jsonify({'ivo': 'car', 'id': g.user}), 200


@auth.verify_token
def verify_token(token):
    g.user = None
    try:
        data = Serializer(secret_key).loads(token)
    except SignatureExpired:
        return None
    except BadSignature:
        return None

    g.user = data['id']

    return True


if __name__ == '__main__':
    app.run(debug=True)
