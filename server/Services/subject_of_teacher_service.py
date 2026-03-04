from Exeptions.exceptions import ItemNotFoundException
from Model.subject_of_teacher import SubjectOfTeacher


class SubjectOfTeacherService:
    def __init__(self, repo):
        self.repo = repo

    def add_subject(self, dto):
        self.repo.add(SubjectOfTeacher(teacher_id=dto.teacher_id, subject_id=dto.subject_id, grade=dto.grade,
                                       is_perceptor=dto.is_perceptor))

    def get_all_subjects(self):
        return self.repo.get_all

    def get_subject_by_id(self, subject_id):
        subject = self.repo.get_by_id(subject_id)
        if not subject:
            raise ItemNotFoundException(subject_id)
        return subject

    def update_subject(self, subject_id, dto):
        subject = self.repo.update(subject_id, SubjectOfTeacher(teacher_id=dto.teacher_id, subject_id=dto.subject_id,
                                                                grade=dto.grade,
                                                                is_perceptor=dto.is_perceptor))
        if not subject:
            raise ItemNotFoundException(subject_id)
        return subject

    def delete_subject(self, subject_id):
        subject = self.repo.delete(subject_id)
        if not subject:
            raise ItemNotFoundException(subject_id)
