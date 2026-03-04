from typing import List, Optional
from dataclasses import dataclass




@dataclass
class Subject:
    subject_name: str
    grade_level: int  # 1-8 for grades א-ח

#dto
@dataclass
class Teacher:
    id: str
    teacher_name: str
    subjects: List[Subject]
    preferred_day_off: Optional[int] = None  # 0-6, optional
    max_hours_per_day: Optional[int] = None
    max_hours_per_week: Optional[int] = None

#service
class TeacherModel:
    def __init__(self):
        self.teachers = {}

    def add_teacher(self, teacher: Teacher):
        self.teachers[teacher.id] = teacher

    def get_teacher(self, teacher_id: str) -> Optional[Teacher]:
        return self.teachers.get(teacher_id)

    def get_all_teachers(self) -> List[Teacher]:
        return list(self.teachers.values())

    def get_teachers_by_subject_and_grade(self, subject: str, grade_level: int) -> List[Teacher]:
        return [
            teacher for teacher in self.get_all_teachers()
            if any(s.subject_name == subject and s.grade_level == grade_level for s in teacher.subjects)
        ]

    def validate_teacher(self, teacher: Teacher) -> List[str]:
        errors = []

        if not teacher.id or not teacher.id.strip():
            errors.append('Teacher ID is required')

        if not teacher.teacher_name or not teacher.teacher_name.strip():
            errors.append('Teacher name is required')

        if not teacher.subjects:
            errors.append('Teacher must have at least one subject')

        for i, subject in enumerate(teacher.subjects):
            if not subject.subject_name or not subject.subject_name.strip():
                errors.append(f'Subject {i + 1}: name is required')
            if subject.grade_level < 1 or subject.grade_level > 8:
                errors.append(f'Subject {i + 1}: grade level must be between 1-8')

        if teacher.preferred_day_off is not None and (teacher.preferred_day_off < 0 or teacher.preferred_day_off > 6):
            errors.append('Preferred day off must be between 0-6')

        return errors
