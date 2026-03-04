from typing import List, Dict, Any, Optional
import time

from models.teacher import Teacher
from models.class_group import ClassGroup
from models.schedule import Schedule, ScheduleConstraints
from solver.cp_solver import CPSolver, SolverOptions, SolverResult
from constraints.constraint_validator import ConstraintValidator


class SchedulingRequest:
    def __init__(self, teachers: List[Teacher], classes: List[ClassGroup],
                 working_days: Optional[List[int]] = None, hours_per_day: int = 8,
                 solver_options: Optional[Dict[str, Any]] = None):
        self.teachers = teachers
        self.classes = classes
        self.working_days = working_days or [0, 1, 2, 3, 4]
        self.hours_per_day = hours_per_day
        self.solver_options = solver_options or {}


class SchedulingResponse:
    def __init__(self, success: bool, schedule: Optional[Schedule],
                 metrics: Optional[Dict[str, Any]], message: str, processing_time: int):
        self.success = success
        self.schedule = schedule
        self.metrics = metrics
        self.message = message
        self.processing_time = processing_time


class SchedulingService:
    def __init__(self):
        self.validator = ConstraintValidator()

    async def create_schedule(self, request: SchedulingRequest) -> SchedulingResponse:

        """שירות ראשי ליצירת מערכת שעות"""
        start_time = time.time()

        try:
            # בדיקת תקינות נתונים
            validation = self.validator.validate_system(
                request.teachers,
                request.classes,
                Schedule(ScheduleConstraints(
                    max_days_per_week=5,
                    max_hours_per_day=8,
                    working_days=[0, 1, 2, 3, 4]
                ))
            )

            if not validation.is_valid:
                return SchedulingResponse(
                    success=False,
                    schedule=None,
                    metrics=None,
                    message=f'שגיאות בנתונים: {", ".join(validation.errors)}',
                    processing_time=int((time.time() - start_time) * 1000)
                )

            # הגדרת אפשרויות פותר
            solver_options = SolverOptions(
                max_iterations=10000,
                timeout_ms=300000,  # 5 דקות
                optimize_for_teacher_preferences=True,
                allow_partial_solutions=False,
                enforce_lesson_blocks=True,  # מניעת חורים במערכת
                #**request.solver_options
            )
            print(solver_options.max_iterations)

            # יצירת פותר
            solver = CPSolver(
                request.teachers,
                request.classes,
                request.working_days,
                request.hours_per_day
            )

            # פתרון הבעיה
            result: SolverResult = await solver.solve(solver_options)

            if not result.success or not result.schedule:
                return SchedulingResponse(
                    success=False,
                    schedule=None,
                    metrics=None,
                    message=result.message,
                    processing_time=int((time.time() - start_time) * 1000)
                )

            # הערכת איכות הפתרון
            metrics = self._evaluate_schedule(result.schedule, request.teachers, request.classes)

            return SchedulingResponse(
                success=True,
                schedule=result.schedule,
                metrics=metrics,
                message='מערכת שעות נוצרה בהצלחה עם בלוקי שיעורים תקינים',
                processing_time=int((time.time() - start_time) * 1000)
            )

        except Exception as error:
            return SchedulingResponse(
                success=False,
                schedule=None,
                metrics=None,
                message=f'שגיאה בתהליך: {error}',
                processing_time=int((time.time() - start_time) * 1000)
            )

    def validate_input(self, request: SchedulingRequest) -> Dict[str, Any]:
        """בדיקת תקינות נתונים לפני פתרון"""
        errors = []

        if not request.teachers:
            errors.append('חובה להגדיר לפחות מורה אחת')

        if not request.classes:
            errors.append('חובה להגדיר לפחות כיתה אחת')

        # בדיקת התאמה בין מורות למקצועות
        available_subjects = set()
        for teacher in request.teachers or []:
            for subject in teacher.subjects:
                available_subjects.add(f'{subject.subject_name}-{subject.grade_level}')

        for class_group in request.classes or []:
            for requirement in class_group.subject_requirements:
                key = f'{requirement.subject}-{class_group.grade_level}'
                if key not in available_subjects:
                    errors.append(
                        f'אין מורה זמינה למקצוע {requirement.subject} בשכבה {class_group.grade_level}'
                    )

        return {
            'is_valid': len(errors) == 0,
            'errors': errors
        }

    def get_schedule_statistics(self, schedule: Schedule, teachers: List[Teacher],
                                classes: List[ClassGroup]) -> Dict[str, Any]:
        """קבלת סטטיסטיקות על מערכת שעות"""
        assignments = schedule.get_all_assignments()

        teacher_stats = []
        for teacher in teachers:
            teacher_assignments = schedule.get_assignments_for_teacher(teacher.id)
            teacher_stats.append({
                'teacher_id': teacher.id,
                'name': teacher.teacher_name,
                'total_hours': len(teacher_assignments),
                'subjects': list(set(a.subject for a in teacher_assignments)),
                'classes': list(set(a.class_id for a in teacher_assignments))
            })

        class_stats = []
        for class_group in classes:
            class_assignments = schedule.get_assignments_for_class(class_group.id)
            class_stats.append({
                'class_id': class_group.id,
                'name': class_group.class_name,
                'total_hours': len(class_assignments),
                'subjects': list(set(a.subject for a in class_assignments)),
                'teachers': list(set(a.teacher_id for a in class_assignments))
            })

        # בדיקת חורים
        gaps = schedule.get_schedule_gaps()

        return {
            'total_assignments': len(assignments),
            'teacher_stats': teacher_stats,
            'class_stats': class_stats,
            'gaps': gaps,
            'has_gaps': len(gaps) > 0,
            'metrics': self._evaluate_schedule(schedule, teachers, classes)
        }

    def _evaluate_schedule(self, schedule: Schedule, teachers: List[Teacher],
                           classes: List[ClassGroup]) -> Dict[str, Any]:
        """הערכת איכות מערכת שעות"""
        # איזון עומס מורות
        workloads = [len(schedule.get_assignments_for_teacher(t.id)) for t in teachers]
        if workloads:
            average = sum(workloads) / len(workloads)
            variance = sum((w - average) ** 2 for w in workloads) / len(workloads)
            workload_balance = max(0, 1 - variance / (average + 1))
        else:
            workload_balance = 0

        # שביעות רצון מהעדפות
        satisfied_preferences = 0
        total_preferences = 0

        for teacher in teachers:
            if teacher.preferred_day_off is not None:
                total_preferences += 1
                assignments_on_preferred_day_off = [
                    a for a in schedule.get_assignments_for_teacher(teacher.id)
                    if a.time_slot._day == teacher.preferred_day_off
                ]

                if not assignments_on_preferred_day_off:
                    satisfied_preferences += 1

        preferences_satisfaction = (satisfied_preferences / total_preferences
                                    if total_preferences > 0 else 1)

        # בדיקת חורים
        gaps = schedule.get_schedule_gaps()
        gap_penalty = len(gaps) * 0.1  # עונש על כל חור

        total_score = (
                workload_balance * 0.4 +
                preferences_satisfaction * 0.3 +
                max(0, 1 - gap_penalty) * 0.3
        )

        return {
            'workload_balance': workload_balance,
            'preferences_satisfaction': preferences_satisfaction,
            'gaps_count': len(gaps),
            'total_score': total_score
        }
