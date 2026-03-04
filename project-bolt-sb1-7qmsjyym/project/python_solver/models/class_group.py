from typing import List
from dataclasses import dataclass

@dataclass
class SubjectRequirement:
    subject: str
    hours_per_week: int

@dataclass
class ClassGroup:
    id: str
    class_name: str  # e.g., "א1", "ב2"
    grade_level: int  # 1-8
    homeroom_teacher_id: str = None  # מחנכת
    subject_requirements: List[SubjectRequirement] = None
    min_hours_per_day: int = 5
    max_hours_per_day: int = 8
    break_duration_minutes: int = 15  # הפסקה בין בלוקים
    lesson_duration_minutes: int = 45  # משך שיעור
    
    def __post_init__(self):
        if self.subject_requirements is None:
            self.subject_requirements = []


def validate_class(class_group: ClassGroup) -> List[str]:
    errors = []

    if not class_group.id or not class_group.id.strip():
        errors.append('Class ID is required')

    if not class_group.class_name or not class_group.class_name.strip():
        errors.append('Class name is required')

    if class_group.grade_level < 1 or class_group.grade_level > 8:
        errors.append('Grade level must be between 1-8')

    if class_group.min_hours_per_day < 0:
        errors.append('Minimum hours per day cannot be negative')

    if class_group.max_hours_per_day < class_group.min_hours_per_day:
        errors.append('Maximum hours per day must be >= minimum hours per day')

    if not class_group.subject_requirements:
        errors.append('Class must have at least one subject requirement')

    for i, req in enumerate(class_group.subject_requirements):
        if not req.subject or not req.subject.strip():
            errors.append(f'Subject requirement {i + 1}: subject name is required')
        if req.hours_per_week <= 0:
            errors.append(f'Subject requirement {i + 1}: hours per week must be positive')

    return errors


class ClassModel:
    def __init__(self):
        self.classes = {}
    
    def add_class(self, class_group: ClassGroup):
        self.classes[class_group.id] = class_group
    
    def get_class(self, class_id: str) -> ClassGroup:
        return self.classes.get(class_id)
    
    def get_all_classes(self) -> List[ClassGroup]:
        return list(self.classes.values())
    
    def get_classes_by_grade(self, grade_level: int) -> List[ClassGroup]:
        return [c for c in self.get_all_classes() if c.grade_level == grade_level]
    
    def get_total_hours_for_class(self, class_id: str) -> int:
        class_group = self.get_class(class_id)
        if not class_group:
            return 0
        
        return sum(req.hours_per_week for req in class_group.subject_requirements)
    
