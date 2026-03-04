from typing import List, Dict, Optional, Tuple
import time
from dataclasses import dataclass
from models.teacher import Teacher, TeacherModel
from models.class_group import ClassGroup, ClassModel
from models.schedule import Schedule, Assignment, TimeSlot, ScheduleConstraints
from models.time_structure import TimeStructure
from constraints.constraint_validator import ConstraintValidator, ValidationResult


@dataclass
class SolverOptions:
    max_iterations: int = 10000
    timeout_ms: int = 300000  # 5 minutes
    optimize_for_teacher_preferences: bool = True
    allow_partial_solutions: bool = False
    enforce_lesson_blocks: bool = True  # אכיפת בלוקי שיעורים (2 שיעורים + הפסקה)


@dataclass
class SolverResult:
    success: bool
    schedule: Optional[Schedule]
    iterations: int
    time_ms: int
    message: str
    validation: ValidationResult


@dataclass
class Variable:
    teacher_id: str
    class_id: str
    subject: str
    time_slot: TimeSlot
    domain: List[TimeSlot]  # אפשרויות זמן אפשריות


class CPSolver:
    def __init__(self, teachers: List[Teacher], classes: List[ClassGroup],
                 working_days: List[int] = None, hours_per_day: int = 8):
        self.teachers = teachers
        self.classes = classes
        self.validator = ConstraintValidator()
        self.working_days = working_days or [0, 1, 2, 3, 4]  # ראשון-חמישי
        self.hours_per_day = hours_per_day
        self.time_structure = TimeStructure(
            lesson_duration_minutes=45,
            break_duration_minutes=15,
            lessons_per_block=2
        )

    async def solve(self, options: SolverOptions) -> SolverResult:
        """פתרון ראשי של בעיית השיבוץ"""
        start_time = time.time()
        iterations = 0

        try:
            # יצירת משתנים
            variables = self._create_variables()
            # הגדרת דומיינים ראשוניים
            self._initialize_domains(variables, options.enforce_lesson_blocks)

            # פתרון עם backtracking
            schedule = Schedule(ScheduleConstraints(
                max_days_per_week=len(self.working_days),
                max_hours_per_day=self.hours_per_day,
                working_days=self.working_days
            ))

            solution = await self._backtrack_search(variables, schedule, options, iterations)
            end_time = time.time()
            validation = self.validator.validate_system(self.teachers, self.classes, solution or schedule)

            return SolverResult(
                success=solution is not None,
                schedule=solution,
                iterations=iterations,
                time_ms=int((end_time - start_time) * 1000),
                message='פתרון נמצא בהצלחה' if solution else 'לא נמצא פתרון תקין',
                validation=validation
            )

        except Exception as error:
            return SolverResult(
                success=False,
                schedule=None,
                iterations=iterations,
                time_ms=int((time.time() - start_time) * 1000),
                message=f'שגיאה בפתרון: {error}',
                validation=ValidationResult(is_valid=False, errors=[str(error)], warnings=[])
            )

    def _create_variables(self) -> List[Variable]:
        """יצירת משתנים לכל שיבוץ נדרש"""
        variables = []

        for class_group in self.classes:
            for requirement in class_group.subject_requirements:
                # מציאת מורות מתאימות למקצוע ושכבה
                suitable_teachers = [
                    teacher for teacher in self.teachers
                    if any(s.subject_name == requirement.subject and s.grade_level == class_group.grade_level
                           for s in teacher.subjects)
                ]

                if not suitable_teachers:
                    raise Exception(
                        f'אין מורה זמינה למקצוע {requirement.subject} בשכבה {class_group.grade_level}'
                    )

                # יצירת משתנה לכל שעה נדרשת של המקצוע
                for hour in range(requirement.hours_per_week):
                    for teacher in suitable_teachers:
                        variables.append(Variable(
                            teacher_id=teacher.id,
                            class_id=class_group.id,
                            subject=requirement.subject,
                            time_slot=TimeSlot(_day=-1, _hour=-1),  # יוגדר בפתרון
                            domain=[]  # יוגדר בהמשך
                        ))

        return variables

    def _initialize_domains(self, variables: List[Variable], enforce_blocks: bool):
        """הגדרת דומיינים ראשוניים לכל משתנה"""
        for variable in variables:
            variable.domain = []

            for day in self.working_days:
                # קבלת שעות תקינות (רק בתוך בלוקים)
                valid_hours = (self.time_structure.get_valid_lesson_hours(self.hours_per_day)
                               if enforce_blocks else range(self.hours_per_day))

                for hour in valid_hours:
                    time_slot = TimeSlot(_day=day, _hour=hour)

                    # בדיקה אם הזמן מתאים למורה (יום חופשי)
                    teacher = next((t for t in self.teachers if t.id == variable.teacher_id), None)
                    if teacher and teacher.preferred_day_off == day:
                        continue  # דילוג על יום חופשי מועדף

                    variable.domain.append(time_slot)

    def _is_continuous_slot(self, variable: Variable, time_slot: TimeSlot) -> bool:
        """בדיקה האם השעה רצופה (ללא חורים)"""
        # כרגע מחזיר True - ניתן לפתח לוגיקה מורכבת יותר
        # לדוגמה: בדיקה שהשעה מתחברת לשעות קיימות של הכיתה
        return True

    async def _backtrack_search(self, variables: List[Variable], schedule: Schedule,
                                options: SolverOptions, iterations: int) -> Optional[Schedule]:
        """אלגוריתם Backtracking עם אופטימיזציות"""

        if iterations >= options.max_iterations:
            return None

        # בחירת משתנה הבא (MRV - Minimum Remaining Values)
        unassigned_var = self._select_unassigned_variable(variables, schedule)

        if not unassigned_var:
            # כל המשתנים שובצו - בדיקה אם הפתרון שלם
            return schedule if self._is_complete_solution(schedule) else None

        # מיון ערכים לפי LCV (Least Constraining Value)
        ordered_values = self._order_domain_values(unassigned_var, variables, schedule)

        for time_slot in ordered_values:
            assignment = Assignment(
                teacher_id=unassigned_var.teacher_id,
                class_id=unassigned_var.class_id,
                subject=unassigned_var.subject,
                time_slot=time_slot
            )

            # בדיקת עקביות (כולל בדיקת בלוקי שיעורים)
            if self._is_consistent(assignment, schedule, options.enforce_lesson_blocks):
                # שיבוץ
                schedule.add_assignment(assignment)
                unassigned_var.time_slot = time_slot

                # Forward Checking - עדכון דומיינים
                removed_values = self._forward_check(variables, assignment, schedule)

                # המשך רקורסיבי
                result = await self._backtrack_search(variables, schedule, options, iterations + 1)

                if result:
                    return result

                # Backtrack - ביטול השיבוץ
                schedule.remove_assignment(assignment)
                unassigned_var.time_slot = TimeSlot(_day=-1, _hour=-1)
                self._restore_domains(variables, removed_values)

        return None

    def _select_unassigned_variable(self, variables: List[Variable], schedule: Schedule) -> Optional[Variable]:
        """בחירת משתנה הבא לשיבוץ (MRV Heuristic)"""
        unassigned = [v for v in variables if v.time_slot._day == -1]

        if not unassigned:
            return None

        # בחירת המשתנה עם הכי מעט אפשרויות (MRV)
        return min(unassigned, key=lambda v: len(v.domain))

    def _order_domain_values(self, variable: Variable, all_variables: List[Variable],
                             schedule: Schedule) -> List[TimeSlot]:
        """מיון ערכי דומיין (LCV Heuristic)"""
        return sorted(variable.domain,
                      key=lambda slot: self._count_constraints(slot, variable, all_variables, schedule))

    def _count_constraints(self, time_slot: TimeSlot, variable: Variable,
                           all_variables: List[Variable], schedule: Schedule) -> int:
        """ספירת אילוצים שערך יוצר"""
        constraints = 0

        for other_var in all_variables:
            if other_var == variable or other_var.time_slot._day != -1:
                continue

            if self._would_remove_from_domain(time_slot, variable, other_var):
                constraints += 1

        return constraints

    def _would_remove_from_domain(self, time_slot: TimeSlot, variable: Variable,
                                  other_variable: Variable) -> bool:
        """בדיקה אם שיבוץ יסיר ערך מדומיין של משתנה אחר"""
        # אותו מורה לא יכול להיות בשני מקומות
        if variable.teacher_id == other_variable.teacher_id:
            return any(slot._day == time_slot._day and slot._hour == time_slot._hour
                       for slot in other_variable.domain)

        # אותה כיתה לא יכולה להיות עם שני מורים
        if variable.class_id == other_variable.class_id:
            return any(slot._day == time_slot._day and slot._hour == time_slot._hour
                       for slot in other_variable.domain)

        return False

    def _is_consistent(self, assignment: Assignment, schedule: Schedule, enforce_blocks: bool) -> bool:
        """בדיקת עקביות של שיבוץ"""
        # בדיקת התנגשויות בסיסיות
        if schedule.has_conflict(assignment):
            return False

        # בדיקה שהמורה מתמחצעת במקצוע ובשכבה הנכונה
        teacher = next((t for t in self.teachers if t.id == assignment.teacher_id), None)
        class_group = next((c for c in self.classes if c.id == assignment.class_id), None)

        if not teacher or not class_group:
            return False

        can_teach = any(s.subject_name == assignment.subject and s.grade_level == class_group.grade_level
                        for s in teacher.subjects)

        if not can_teach:
            return False

        # בדיקת מגבלות שעות יומיות לכיתה - אילוץ קשיח
        daily_hours = schedule.get_class_hours_per_day(assignment.class_id, assignment.time_slot._day)
        if daily_hours + 1 > class_group.max_hours_per_day:
            return False

        # בדיקת מגבלות מורה
        if teacher.preferred_day_off == assignment.time_slot._day:
            return False

        if teacher.max_hours_per_day:
            teacher_daily_hours = schedule.get_teacher_hours_per_day(
                assignment.teacher_id, assignment.time_slot._day
            )
            if teacher_daily_hours + 1 > teacher.max_hours_per_day:
                return False

        # בדיקת בלוקי שיעורים (אם נדרש)
        if enforce_blocks:
            # יצירת לוח זמני עם השיבוץ החדש
            temp_schedule = Schedule(schedule.constraints)
            for existing in schedule.get_all_assignments():
                temp_schedule.add_assignment(existing)
            temp_schedule.add_assignment(assignment)

            # בדיקה שהשיעורים עומדים בדרישות הבלוקים
            class_lessons_today = [
                a.time_slot._hour for a in temp_schedule.get_assignments_for_class(assignment.class_id)
                if a.time_slot._day == assignment.time_slot._day
            ]

            if not self.time_structure.validate_lesson_continuity(
                    class_lessons_today, self.hours_per_day
            ):
                return False

        return True

    def _forward_check(self, variables: List[Variable], assignment: Assignment,
                       schedule: Schedule) -> Dict[Variable, List[TimeSlot]]:
        """Forward Checking - עדכון דומיינים לאחר שיבוץ"""
        removed_values = {}

        for variable in variables:
            if variable.time_slot._day != -1:  # כבר שובץ
                continue

            to_remove = []

            for time_slot in variable.domain:
                test_assignment = Assignment(
                    teacher_id=variable.teacher_id,
                    class_id=variable.class_id,
                    subject=variable.subject,
                    time_slot=time_slot
                )
                if not self._is_consistent(test_assignment, schedule, True):
                    to_remove.append(time_slot)
            if removed_values:
                removed_values[variable] = to_remove.copy()
                variable.domain = [slot for slot in variable.domain if slot not in to_remove]


        return removed_values

    def _restore_domains(self, variables: List[Variable],
                         removed_values: Dict[Variable, List[TimeSlot]]):
        """שחזור דומיינים לאחר backtrack"""
        for variable, removed in removed_values.items():
            variable.domain.extend(removed)

    def _is_complete_solution(self, schedule: Schedule) -> bool:
        """בדיקה אם הפתרון שלם"""
        # בדיקה שכל הדרישות מולאו - אילוץ קשיח
        for class_group in self.classes:
            for requirement in class_group.subject_requirements:
                assigned_hours = len([
                    a for a in schedule.get_all_assignments()
                    if a.class_id == class_group.id and a.subject == requirement.subject
                ])

                # חובה לקבל בדיוק את כמות השעות הנדרשת
                if assigned_hours != requirement.hours_per_week:
                    return False

            # בדיקת מינימום ומקסימום שעות יומיות לכל יום - אילוצים קשיחים
            for day in self.working_days:
                daily_hours = schedule.get_class_hours_per_day(class_group.id, day)

                # אם יש שעות ביום - חייב להיות לפחות המינימום
                if daily_hours > 0 and daily_hours < class_group.min_hours_per_day:
                    return False

                # לא יותר מהמקסימום - אילוץ קשיח
                if daily_hours > class_group.max_hours_per_day:
                    return False

        # בדיקה שכל הכיתות עומדות בדרישות הבלוקים
        for class_group in self.classes:
            for day in self.working_days:
                class_lessons_today = [
                    a.time_slot._hour for a in schedule.get_assignments_for_class(class_group.id)
                    if a.time_slot._day == day
                ]

                if not self.time_structure.validate_lesson_continuity(
                        class_lessons_today, self.hours_per_day
                ):
                    return False

        return True
