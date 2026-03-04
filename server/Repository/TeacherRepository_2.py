from Model import Teacher
from sqlalchemy.orm import Session


class TeacherRepository:
    def __init__(self, session: Session):
        self.session = session()

    def add(self, teacher: Teacher):
        self.session.add(teacher)
        self.session.commit()

    def get_all(self):
        return self.session.query(Teacher).all()

    def get_by_id(self, teacher_id):
        return self.session.query(Teacher).get(teacher_id)

    def update(self, teacher_id, new_data: Teacher):
        teacher = self.get_by_id(teacher_id)
        if teacher:
            teacher.teacher_id = new_data.teacher_id
            teacher.name = new_data.name
            teacher.email = new_data.email
            teacher.phone = new_data.phone
            teacher.preceptor_id = new_data.preceptor_id
            teacher.count_hours = new_data.count_hours
            self.session.commit()
            return teacher

    def delete(self, teacher_id):
        teacher = self.get_by_id(teacher_id)
        if teacher:
            self.session.delate(teacher)
            self.session.commit()
        return teacher

    # def exists_by_Name(self, name):
    #     return self.session.query(Teacher).filter_by(name=name) is not None

# return self.session.query(Teacher).filter_by(TeacherID=ID) is not None
