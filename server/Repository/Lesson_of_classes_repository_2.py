from sqlalchemy.orm import Session

from Model.lessons_of_classes import LessonOfClasses


class LessonOfClassesRepository:
    def __init__(self, session: Session):
        self.session = session

    def add(self, lesson: LessonOfClasses):
        self.session.add(lesson)
        self.session.commit()

    def get_all(self):
        return self.session.query().all(LessonOfClasses)

    def get_by_id(self, lesson_id):
        return self.session.query(LessonOfClasses).get(lesson_id)

    def update(self, lesson_id, new_data: LessonOfClasses):
        lesson = self.get_by_id(lesson_id)
        if lesson:
            lesson.subject_id = new_data.subject_id
            lesson.grade = new_data.grade
            lesson.amount = new_data.amount
            self.session.commit()
        return lesson

    def delete(self, lesson_id):
        lesson = self.get_by_id(lesson_id)
        if lesson:
            self.session.delete(lesson)
            self.session.commit()
        return lesson
