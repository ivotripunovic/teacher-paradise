from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS

import datetime

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///./app.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)
CORS(app)

url_students = '/students'


class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)

    def __repr__(self):
        return '<User %r>' % self.username


class Student(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'),
                        nullable=False)
    name = db.Column(db.String(80), nullable=False)

    def __repr__(self):
        return '<Student %r>' % self.name

    def to_json(self):
        return {'id': self.id, 'name': self.name}


class StudentClass(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    student_id = db.Column(db.Integer, db.ForeignKey('student.id'),
                           nullable=False)
    class_date = db.Column(db.DateTime, nullable=False)


@app.route(url_students, methods=['get'])
def get():
    l = Student.query.all()
    return jsonify([s.to_json() for s in l])


@app.route(url_students, methods=['post'])
def create_student():
    user_id = 1  # TODO set logged user id
    data = request.get_json() or {}

    student = Student(user_id=user_id, name=data['name'])
    db.session.add(student)
    db.session.commit()
    return student.to_json()


@app.route(url_students + '/<int:id>', methods=['get'])
def get_student(id):
    # todo check logged in user
    s = Student.query.get_or_404(id)
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


if __name__ == '__main__':
    app.run(debug=True)
