""""
דוגמה לשימוש במערכת שיבוץ מורים ושיעורים
"""
import asyncio
from models.teacher import Teacher, Subject, TeacherModel
from models.class_group import ClassGroup, SubjectRequirement
from solver.cp_solver import SolverOptions
from api.scheduling_service import SchedulingService, SchedulingRequest
from database.repository import DatabaseRepository

"""
async def main():
    #יצירת מורות לדוגמה
    teachers = [
        Teacher(
            id="teacher_1",
            teacher_name="רחל כהן",
            subjects=[
                Subject(subject_name="מתמטיקה", grade_level=1),
                Subject(subject_name="מתמטיקה", grade_level=2),
            ],
            preferred_day_off=5,  # שבת
            max_hours_per_day=6
        ),
        Teacher(
            id="teacher_2",
            teacher_name="שרה לוי",
            subjects=[
                Subject(subject_name="עברית", grade_level=1),
                Subject(subject_name="עברית", grade_level=2),
            ],
            preferred_day_off=4,  # יום חמישי
            max_hours_per_day=7
        ),
        Teacher(
            id="teacher_3",
            teacher_name="מרים אברהם",
            subjects=[
                Subject(subject_name="אנגלית", grade_level=1),
                Subject(subject_name="אנגלית", grade_level=2),
            ],
            max_hours_per_day=6
        )
    ]

    # יצירת כיתות לדוגמה
    classes = [
        ClassGroup(
            id="class_1a",
            class_name="א1",
            grade_level=1,
            subject_requirements=[
                SubjectRequirement(subject="מתמטיקה", hours_per_week=4),
                SubjectRequirement(subject="עברית", hours_per_week=5),
                SubjectRequirement(subject="אנגלית", hours_per_week=3),
            ],
            min_hours_per_day=4,
            max_hours_per_day=6
        ),
        ClassGroup(
            id="class_2a",
            class_name="ב1",
            grade_level=2,
            subject_requirements=[
                SubjectRequirement(subject="מתמטיקה", hours_per_week=5),
                SubjectRequirement(subject="עברית", hours_per_week=4),
                SubjectRequirement(subject="אנגלית", hours_per_week=3),
            ],
            min_hours_per_day=4,
            max_hours_per_day=7
        )
    ]

    # יצירת בקשה לשיבוץ עם SolverOptions
    solver_options = SolverOptions(
        enforce_lesson_blocks=True
        # max_iterations is not set for testing
    )

    request = SchedulingRequest(
        teachers=teachers,
        classes=classes,
        working_days=[0, 1, 2, 3, 4],  # ראשון-חמישי
        hours_per_day=8,
        solver_options=solver_options  # Pass the SolverOptions instance
    )


    # יצירת שירות השיבוץ
    service = SchedulingService()

    # בדיקת תקינות נתונים
    validation = service.validate_input(request)
    if not validation['is_valid']:
        print("שגיאות בנתונים:")
        for error in validation['errors']:
            print(f"- {error}")
        return

    print("מתחיל תהליך שיבוץ...")

    # יצירת מערכת שעות
    response = await service.create_schedule(request)

    if response.success:
        print(f"✅ {response.message}")
        print(f"זמן עיבוד: {response.processing_time}ms")

        # הצגת סטטיסטיקות
        stats = service.get_schedule_statistics(
            response.schedule,
            request.teachers,
            request.classes
        )

        print(f"\nסטטיסטיקות:")
        print(f"- סה\"כ שיבוצים: {stats['total_assignments']}")
        # print(f"- חורים במערכת: {stats['gaps_count']}")
        print(f"- ציון כללי: {stats['metrics']['total_score']:.2f}")

        # הצגת מערכת השעות
        print(f"\nמערכת שעות:")
        for assignment in response.schedule.get_all_assignments():
            teacher = next(t for t in teachers if t.id == assignment.teacher_id)
            class_group = next(c for c in classes if c.id == assignment.class_id)
            print(f"יום {assignment.time_slot._day}, שעה {assignment.time_slot._hour}: "
                  f"{teacher.teacher_name} מלמדת {assignment.subject} לכיתה {class_group.class_name}")

    else:
        print(f"❌ {response.message}")
"""
async def main():
    ser = DatabaseRepository()
    s=ser.get_teachers_for_solver()
    print(s[0].id,s[0].teacher_name)
    # Fetch teachers from the database
    teachers = ser.get_teachers_for_solver()  # Fetches teachers from the database

    # Fetch classes from the database
    classes = ser.get_classes_for_solver()  # Fetches classes from the database

    # Check if teachers and classes are fetched properly
    if not teachers:
        print("לא נמצאו מורות במאגר הנתונים.")
        return
    if not classes:
        print("לא נמצאו כיתות במאגר הנתונים.")
        return

    # Create a SchedulingRequest
    solver_options = SolverOptions(
        enforce_lesson_blocks=True
    )

    request = SchedulingRequest(
        teachers=teachers,
        classes=classes,
        working_days=[0, 1, 2, 3, 4],  # ראשון-חמישי
        hours_per_day=8,
        solver_options=solver_options
    )

    # Create scheduling service and validate input
    service = SchedulingService()
    validation = service.validate_input(request)
    if not validation['is_valid']:
        print("שגיאות בנתונים:")
        for error in validation['errors']:
            print(f"- {error}")
        return
    print("מתחיל תהליך שיבוץ...")
    # Create schedule
    response = await service.create_schedule(request)
    # (rest of the code remains unchanged)
    if response.success:
        print(f"✅ {response.message}")
        print(f"זמן עיבוד: {response.processing_time}ms")
        # הצגת סטטיסטיקות
        stats = service.get_schedule_statistics(
            response.schedule,
            request.teachers,
            request.classes
        )
        print(f"\nסטטיסטיקות:")
        print(f"- סה\"כ שיבוצים: {stats['total_assignments']}")
        # print(f"- חורים במערכת: {stats['gaps_count']}")
        print(f"- ציון כללי: {stats['metrics']['total_score']:.2f}")
        # הצגת מערכת השעות
        print(f"\nמערכת שעות:")
        for assignment in response.schedule.get_all_assignments():
            teacher = next(t for t in teachers if t.id == assignment.teacher_id)
            class_group = next(c for c in classes if c.id == assignment.class_id)
            print(f"יום {assignment.time_slot._day}, שעה {assignment.time_slot._hour}: "
                  f"{teacher.teacher_name} מלמדת {assignment.subject} לכיתה {class_group.class_name}")
    else:
        print(f"❌ {response.message}")
if __name__ == "__main__":
    asyncio.run(main())