from typing import List
from dataclasses import dataclass

from models.teacher import Teacher
from models.class_group import ClassGroup
from models.schedule import Schedule, Assignment

@dataclass
class ValidationResult:
    is_valid: bool
    errors: List[str]
    warnings: List[str]

class ConstraintValidator:
    
    def validate_system(self, teachers: List[Teacher], classes: List[ClassGroup], 
                       schedule: Schedule) -> ValidationResult:
        """בדיקת תקינות כללית של המערכת"""
        errors = []
        warnings = []
        
        # בדיקת תקינות מורות
        for i, teacher in enumerate(teachers):
            teacher_errors = self._validate_teacher(teacher)
            errors.extend([f'Teacher {i + 1}: {e}' for e in teacher_errors])
        
        # בדיקת תקינות כיתות
        for i, class_group in enumerate(classes):
            class_errors = self._validate_class(class_group)
            errors.extend([f'Class {i + 1}: {e}' for e in class_errors])
        
        # בדיקת תקינות מערכת שעות
        schedule_errors = self._validate_schedule(schedule, teachers, classes)
        errors.extend(schedule_errors)
        
        # בדיקות אזהרה
        system_warnings = self._generate_warnings(teachers, classes, schedule)
        warnings.extend(system_warnings)
        
        return ValidationResult(
            is_valid=len(errors) == 0,
            errors=errors,
            warnings=warnings
        )
    
    def _validate_teacher(self, teacher: Teacher) -> List[str]:
        """בדיקת תקינות מורה בודדת"""
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
        
        if (teacher.preferred_day_off is not None and 
            (teacher.preferred_day_off < 0 or teacher.preferred_day_off > 6)):
            errors.append('Preferred day off must be between 0-6')
        
        return errors
    
    def _validate_class(self, class_group: ClassGroup) -> List[str]:
        """בדיקת תקינות כיתה בודדת"""
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
    
    def _validate_schedule(self, schedule: Schedule, teachers: List[Teacher], 
                          classes: List[ClassGroup]) -> List[str]:
        """בדיקת תקינות מערכת שעות"""
        errors = []
        assignments = schedule.get_all_assignments()
        
        # בדיקת התנגשויות
        for i in range(len(assignments)):
            for j in range(i + 1, len(assignments)):
                if self._assignments_conflict(assignments[i], assignments[j]):
                    errors.append(
                        f'Conflict: {assignments[i].teacher_id} and {assignments[j].teacher_id} '
                        f'at day {assignments[i].time_slot._day}, hour {assignments[i].time_slot._hour}'
                    )
        
        # בדיקת התאמת מורה למקצוע ושכבה
        for i, assignment in enumerate(assignments):
            teacher = next((t for t in teachers if t.id == assignment.teacher_id), None)
            class_group = next((c for c in classes if c.id == assignment.class_id), None)
            
            if not teacher:
                errors.append(f'Assignment {i + 1}: Teacher {assignment.teacher_id} not found')
                continue
            
            if not class_group:
                errors.append(f'Assignment {i + 1}: Class {assignment.class_id} not found')
                continue
            
            can_teach = any(s.subject_name == assignment.subject and s.grade_level == class_group.grade_level
                           for s in teacher.subjects)
            
            if not can_teach:
                errors.append(
                    f'Assignment {i + 1}: Teacher {teacher.teacher_name} cannot teach '
                    f'{assignment.subject} to grade {class_group.grade_level}'
                )
        
        # בדיקת חורים במערכת
        gaps = schedule.get_schedule_gaps()
        for class_id, gap_days in gaps.items():
            for day in gap_days:
                errors.append(f'Class {class_id} has gaps in schedule on day {day}')
        
        return errors
    
    def _assignments_conflict(self, a1: Assignment, a2: Assignment) -> bool:
        """בדיקת התנגשות בין שני שיבוצים"""
        same_time = (a1.time_slot._day == a2.time_slot._day and
                    a1.time_slot._hour == a2.time_slot._hour)
        
        if not same_time:
            return False
        
        # מורה לא יכולה להיות בשני מקומות
        if a1.teacher_id == a2.teacher_id:
            return True
        
        # כיתה לא יכולה להיות עם שני מורים
        if a1.class_id == a2.class_id:
            return True
        
        return False
    
    def _generate_warnings(self, teachers: List[Teacher], classes: List[ClassGroup], 
                          schedule: Schedule) -> List[str]:
        """יצירת אזהרות למערכת"""
        warnings = []
        
        # אזהרה על מורות עם עומס גבוה
        for teacher in teachers:
            assignments = schedule.get_assignments_for_teacher(teacher.id)
            if len(assignments) > 30:  # יותר מ-30 שעות בשבוע
                warnings.append(f'Teacher {teacher.teacher_name} has {len(assignments)} hours per week (high load)')
        
        # בדיקת השלמת דרישות כיתות
        for class_group in classes:
            for requirement in class_group.subject_requirements:
                assignments = [
                    a for a in schedule.get_assignments_for_class(class_group.id)
                    if a.subject == requirement.subject
                ]
                
                if len(assignments) != requirement.hours_per_week:
                    warnings.append(
                        f'Class {class_group.class_name}: {requirement.subject} has '
                        f'{len(assignments)}/{requirement.hours_per_week} hours'
                    )
            
            # בדיקת מגבלות יומיות
            working_days = [0, 1, 2, 3, 4]
            for day in working_days:
                daily_hours = schedule.get_class_hours_per_day(class_group.id, day)
                
                if daily_hours > class_group.max_hours_per_day:
                    warnings.append(
                        f'Class {class_group.class_name} exceeds max hours on day {day}: '
                        f'{daily_hours}/{class_group.max_hours_per_day}'
                    )
                
                if daily_hours > 0 and daily_hours < class_group.min_hours_per_day:
                    warnings.append(
                        f'Class {class_group.class_name} below min hours on day {day}: '
                        f'{daily_hours}/{class_group.min_hours_per_day}'
                    )
        
        return warnings