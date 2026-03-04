from Exeptions.exceptions import ItemAlreadyExistsException, MissingFieldException, ItemNotFoundException
from Model.Classes import Classes


class ClassesService:
    def __init__(self, repo):
        self.repo = repo

    def add_class(self, dto):
        if not dto.id:
            raise MissingFieldException('id')
        if self.repo.exists_by_id(dto.id):
            raise ItemAlreadyExistsException(dto.id)
        self.repo.add(Classes(id=dto.id, grade=dto.grade, numOfGrade=dto.numOfGrade))

    def get_all_classes(self):
        return self.repo.get_all()

    def get_class_by_id(self):
        Class = self.repo.get_by_id(id)
        if not Class:
            raise ItemNotFoundException('class')
        return Class

    def delete_class(self, class_id):
        Class = self.repo.delete(class_id)
        if not Class:
            raise ItemNotFoundException(class_id)
