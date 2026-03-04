from Exeptions.exceptions import MissingFieldException, ItemAlreadyExistsException
from Model.Subjects import Subjects


class SubjectsService:
    def __init__(self, repo):
        self.repo = repo

    def add_subject(self, dto):
        if not dto.Name:
            raise MissingFieldException('name')
        if self.repo.exist_by_ID(dto.TeacherID):
            raise ItemAlreadyExistsException(dto.Name)
        self.repo.add(Subjects(name=dto.name, is_preceptor=dto.is_preceptor))

    def get_all_subjects(self):
        return self.repo.get_all()

    def get_subject_by_id(self, subject_id):
        subject = self.repo.get_by_id(subject_id)
        if not subject:
            raise MissingFieldException('subject')
        return subject

    def update_subject(self, subject_id, dto):
        subject = self.repo.update(subject_id, Subjects(name=dto.name, is_preceptor=dto.is_preceptor))
        if not subject:
            raise MissingFieldException('subject')
        return subject

    def delete_subject(self, subject_id):
        subject = self.repo.delete(subject_id)
        if not subject:
            raise MissingFieldException('subject')
