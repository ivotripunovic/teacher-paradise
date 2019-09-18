from flask import Flask, request

app = Flask(__name__)

url_students = '/students'

students = {
    0: {'name': 'Ivo', 'dates': ['2019-12-03']},
    1: {'name': 'Tana', 'dates': []},
    2: {'name': 'Natalija', 'dates': []}
}

@app.route(url_students, methods=['get'])
def get():
    return students


@app.route(url_students, methods=['post'])
def create_student():
    id = len(students)
    students[id] = request.get_json()
    return students[id]


if __name__ == '__main__':
    app.run(debug=True)
