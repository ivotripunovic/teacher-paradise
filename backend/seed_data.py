from app import db, User, Student, StudentClass
import datetime

db.drop_all()
db.create_all()


u = User(username='ivo', email='ivo@car.com')
db.session.add(u)
db.session.commit()

counter = 0
with open('names.txt', encoding='UTF-8') as f:
    for name in f: 
        if counter > 1000:
            break
        s = Student(name=name, user_id=u.id)
        db.session.add(s)
        db.session.commit()

        for x in range(10):
            date = datetime.date(2019, 11, x+1)
            klass = StudentClass(student_id=s.id, class_date=date)
            db.session.add(klass)
        counter+=1
db.session.commit()

