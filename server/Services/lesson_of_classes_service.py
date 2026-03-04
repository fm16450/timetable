from Exeptions.exceptions import ItemNotFoundException
from Model.lessons_of_classes import LessonOfClasses


class LessonOfClassesRepository:
    def __init__(self, repo):
        self.repo = repo

    def add_lesson(self, dto):
        self.repo.add(LessonOfClasses(subject_id=dto.subject_id, grade=dto.grade, amount=dto.amount))

    def get_all_lessons(self):
        return self.repo.get_all()

    def get_lesson_by_id(self, lesson_id):
        lesson = self.repo.get_by_id(lesson_id)
        if not lesson:
            raise ItemNotFoundException(lesson_id)
        return lesson

    def update_lesson(self, lesson_id, dto):
        lesson = self.repo.update(lesson_id,
                                  LessonOfClasses(subject_id=dto.subject_id, grade=dto.grade, amount=dto.amount))

        if not lesson:
            raise ItemNotFoundException(lesson_id)
        return lesson

    def delete_lesson(self, lesson_id):
        lesson = self.repo.delete(lesson_id)
        if not lesson:
            raise ItemNotFoundException(lesson_id)

