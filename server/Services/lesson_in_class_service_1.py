from Exeptions.exceptions import MissingFieldException, ItemAlreadyExistsException, ItemNotFoundException
from Exeptions.lesson_in_class_exception import lessonAlreadyExistsException, MissingDayException, \
    MissingTeacherIdException, MissingClassIdException, MissingSubjectIdException
from Model.lesson_in_class import LessonInClass


class LessonInClassService:
    def __init__(self, repo):
        self.repo = repo

    def add_lesson(self, dto):
        if not dto.day:
            raise MissingFieldException('day')
        if not dto.teacher_id:
            raise MissingFieldException('teacherId')
        if not dto.class_id:
            raise MissingFieldException('classId')
        if not dto.subject_id:
            raise MissingFieldException('subject_id')
        if self.repo.exists_by_id(dto.id):
            raise ItemAlreadyExistsException('lesson')
        lesson = LessonInClass(
            class_id=dto.class_id, subject_id=dto.subject_id, teacher_id=dto.teacher_id, day=dto.day,
            num_of_lesson=dto.num_of_lesson)
        self.repo.add(lesson)

    def get_all_lessons(self):
        return self.repo.get_all()

    def get_lesson_by_id(self, lesson_id):
        lesson = self.repo.get_by_id(lesson_id)
        if not lesson:
            raise ItemNotFoundException(lesson_id)
        return lesson

    def update_lesson(self, lesson_id, dto):
        lesson = self.repo.update(lesson_id, LessonInClass(class_id=dto.class_id, subject_id=dto.subject_id,
                                                           teacher_id=dto.teacher_id, day=dto.day,
                                                           num_of_lesson=dto.num_of_lesson))
        if not lesson:
            raise ItemNotFoundException(lesson_id)
        return lesson

    def delete_lesson(self, lesson_id):
        lesson = self.repo.delete(lesson_id)
        if not lesson:
            raise ItemNotFoundException(lesson_id)

