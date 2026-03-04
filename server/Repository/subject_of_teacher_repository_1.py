from sqlalchemy.orm import Session
from Model.subject_of_teacher import SubjectOfTeacher


class SubjectOfTeacherRepository:
    def __init__(self, session: Session):
        self.session = session

    def add(self, subject: SubjectOfTeacher):
        self.session.add(subject)
        self.session.commit()

    def get_all(self):
        return self.session.query(SubjectOfTeacher).all()

    def get_by_id(self, subject_of_teacher_id):
        return self.session.query(SubjectOfTeacher).get(subject_of_teacher_id)

    def update(self, subject_of_teacher_id, new_data: SubjectOfTeacher):
        subject_of_teacher = self.get_by_id(subject_of_teacher_id)
        if subject_of_teacher:
            subject_of_teacher.teacher_id = new_data.teacher_id
            subject_of_teacher.subject_id = new_data.subject_id
            subject_of_teacher.grade = new_data.grade
            subject_of_teacher.isPerceptor = new_data.isPreceptor
            self.session.commit()
        return subject_of_teacher

    def delete(self, subject_of_teacher_id):
        subject_of_teacher = self.get_by_id(subject_of_teacher_id)
        if subject_of_teacher:
            self.session.delete(subject_of_teacher)
            self.session.commit()
        return subject_of_teacher

    # def exists_by_id(self, id):
    #     return self.session.query(SubjectOfTeacher).filter_by(id=id).first() is not None
