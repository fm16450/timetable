from Model import lesson_in_class
from sqlalchemy.orm import Session

from Model.lesson_in_class import LessonInClass


class LessonInClassRepository:
    def __init__(self, session: Session):
        self.session = session()

    def add(self, lesson: lesson_in_class):
        self.session.add(lesson)
        self.session.commit()

    def get_all(self):
        return self.session.query(lesson_in_class).all()

    def get_by_id(self, lesson_id):
        return self.session.query(LessonInClass).get(lesson_id)

    def update(self, lesson_id, new_data: LessonInClass):
        lesson = self.get_by_id(lesson_id)
        if lesson:
            lesson.class_id = new_data.class_id
            lesson.subject_id = new_data.subject_id
            lesson.teacher_id = new_data.teacher_id
            lesson.day = new_data.day
            lesson.num_of_lesson = new_data.num_of_lesson
            self.session.commit()
        return lesson

    def delete(self, lesson_id):
        lesson = self.get_by_id(lesson_id)
        if lesson:
            self.session.delete(lesson)
            self.session.commit()
        return lesson

    # def exists_by_id(self, id):
    #     return self.session.query(lesson_in_class).filter_by(id=id).first() is not None
