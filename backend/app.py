from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///./app.db' #'sqlite:////tmp/test.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)
CORS(app)

url_students = '/students'

students = {
    0: {'name': 'Ivo', 'dates': ['2019-12-03']},
    1: {'name': 'Tana', 'dates': []},
    2: {'name': 'Natalija', 'dates': []}
}


class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(12), unique=True, nullable=False)

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
        return { 'id': self.id, 'name': self.name }

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
    id = len(students)
    students[id] = request.get_json()
    return students[id]


@app.route(url_students + '/<int:id>', methods=['get'])
def get_student(id):
    return students[id]


@app.route(url_students + '/<int:id>', methods=['put'])
def update_student(id):
    students[id]['name'] = request.json['name']
    return students[id]


@app.route(url_students + '/<int:id>/dates/<string:date>', methods=['post'])
def add_date_student(id, date):
    students[id]['dates'].append(date)
    return students[id]


@app.route(url_students + '/<int:id>/dates/<string:date>', methods=['delete'])
def delete_date_student(id, date):
    students[id]['dates'].remove(date)
    return students[id]


if __name__ == '__main__':
    app.run(debug=True)
