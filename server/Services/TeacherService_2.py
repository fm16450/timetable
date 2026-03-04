from Exeptions.TeacherException import MissingNameAndID, MisingName, MisingID, TeacherAlreadyExistException
from Exeptions.exceptions import ItemNotFoundException, MissingFieldException, ItemAlreadyExistsException
from Model.Teacher import Teacher


class TeacherService:
    def __init__(self, repository):
        self.repository = repository

    def add_teacher(self, dto):
        if not dto.Name:
            raise MissingFieldException('name')
        if not dto.TecherID:
            raise MissingFieldException('teacherId')
        if self.repository.exist_by_ID(dto.TeacherID):
            raise ItemAlreadyExistsException(dto.Name)
        teacher = Teacher(TeacherID=dto.techer_id, Name=dto.name, Email=dto.email, Phone=dto.phone,
                          ClassID=dto.class_id, CountHours=dto.count_hours)
        self.repository.add(teacher)

    def get_all_teachers(self):
        return self.repository.get_all()

    def get_teacher_by_id(self, teacher_id):
        teacher = self.repository.get_by_id(teacher_id)
        if not teacher:
            raise ItemNotFoundException(teacher_id)
        return teacher

    def update_teacher(self, teacher_id, dto):
        teacher = self.repository.update(teacher_id, Teacher(Name=dto.name, Email=dto.email, Phone=dto.phone,
                                                             ClassID=dto.class_id, CountHours=dto.count_hours))
        if not teacher:
            raise ItemNotFoundException(teacher_id)
        return teacher

    def delete_teacher(self, teacher_id):
        teacher = self.repository.delete(teacher_id)
        if not teacher:
            raise ItemNotFoundException(teacher_id)


