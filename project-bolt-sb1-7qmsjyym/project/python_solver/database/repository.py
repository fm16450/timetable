# from models import Base, Teacher, Subject, ClassGroup, SubjectRequirement, Assignment, Schedule

from sqlalchemy import create_engine, and_, or_
from sqlalchemy.orm import sessionmaker, Session, joinedload
from typing import List, Optional, Dict, Any
from database.models import Base, Teacher, Subject, ClassGroup, SubjectRequirement, Assignment, Schedule
from models.teacher import Teacher as TeacherModel, Subject as SubjectModel
from models.class_group import ClassGroup as ClassGroupModel, SubjectRequirement as SubjectRequirementModel
import pyodbc

server="mssql+pyodbc://@PC-T06"
database= "schedule"
class DatabaseRepository:
    """מאגר נתונים לניהול מורות, כיתות ומערכות שעות"""

    def __init__(self, database_url: str = "mssql+pyodbc://@PC-T06/schedule?driver=ODBC+Driver+17+for+SQL+Server&trusted_connection=yes"):
        self.engine = create_engine(database_url)
        Base.metadata.create_all(self.engine)
        self.SessionLocal = sessionmaker(bind=self.engine)

    def get_session(self) -> Session:
        return self.SessionLocal()

    # === מורות ===
    def get_session(self) -> Session:
        return self.SessionLocal()

    def create_teacher(self, teacher_data: Dict[str, Any]) -> Teacher:
        """יצירת מורה חדשה"""
        with self.get_session() as session:
            teacher = Teacher(**teacher_data)
            session.add(teacher)
            session.commit()
            session.refresh(teacher)
            return teacher

    def get_teacher(self, teacher_id: str) -> Optional[Teacher]:
        """קבלת מורה לפי ID"""
        with self.get_session() as session:
            return session.query(Teacher).filter(Teacher.id == teacher_id).first()
#options(joinedload(Teacher.subjects)).89
    def get_all_teachers(self) -> List[Teacher]:
        """קבלת כל המורות"""
        with self.get_session() as session:
            return session.query(Teacher).all()

    def update_teacher(self, teacher_id: str, updates: Dict[str, Any]) -> bool:
        """עדכון מורה"""
        with self.get_session() as session:
            teacher = session.query(Teacher).filter(Teacher.id == teacher_id).first()
            if teacher:
                for key, value in updates.items():
                    setattr(teacher, key, value)
                session.commit()
                return True
            return False

    def delete_teacher(self, teacher_id: str) -> bool:
        """מחיקת מורה"""
        with self.get_session() as session:
            teacher = session.query(Teacher).filter(Teacher.id == teacher_id).first()
            if teacher:
                session.delete(teacher)
                session.commit()
                return True
            return False

    # === מקצועות ===

    def create_subject(self, name: str, grade_level: int) -> Subject:
        """יצירת מקצוע חדש"""
        with self.get_session() as session:
            subject = Subject(name=name, grade_level=grade_level)
            session.add(subject)
            session.commit()
            session.refresh(subject)
            return subject

    def get_subject(self, subject_id: int) -> Optional[Subject]:
        """קבלת מקצוע לפי ID"""
        with self.get_session() as session:
            return session.query(Subject).filter(Subject.id == subject_id).first()

    def get_subjects_by_name_and_grade(self, name: str, grade_level: int) -> Optional[Subject]:
        """קבלת מקצוע לפי שם ושכבה"""
        with self.get_session() as session:
            return session.query(Subject).filter(
                and_(Subject.subject_name == name, Subject.grade_level == grade_level)
            ).first()

    def get_all_subjects(self) -> List[Subject]:
        """קבלת כל המקצועות"""
        with self.get_session() as session:
            return session.query(Subject).all()

    # === כיתות ===

    def create_class(self, class_data: Dict[str, Any]) -> ClassGroup:
        """יצירת כיתה חדשה"""
        with self.get_session() as session:
            class_group = ClassGroup(**class_data)
            session.add(class_group)
            session.commit()
            session.refresh(class_group)
            return class_group

    def get_class(self, class_id: str) -> Optional[ClassGroup]:
        """קבלת כיתה לפי ID"""
        with self.get_session() as session:
            return session.query(ClassGroup).filter(ClassGroup.id == class_id).first()

    def get_all_classes(self) -> List[ClassGroup]:
        """קבלת כל הכיתות"""
        with self.get_session() as session:
            return (session.query(ClassGroup).options(joinedload(ClassGroup.subject_requirements).joinedload(SubjectRequirement.subject)).all())

    def get_classes_by_grade(self, grade_level: int) -> List[ClassGroup]:
        """קבלת כיתות לפי שכבה"""
        with self.get_session() as session:
            return session.query(ClassGroup).filter(ClassGroup.grade_level == grade_level).all()

    # === דרישות מקצועות ===

    def create_subject_requirement(self, class_id: str, subject_id: int,
                                 hours_per_week: int) -> SubjectRequirement:
        """יצירת דרישת מקצוע לכיתה"""
        with self.get_session() as session:
            requirement = SubjectRequirement(
                class_id=class_id,
                subject_id=subject_id,
                hours_per_week=hours_per_week
            )
            session.add(requirement)
            session.commit()
            session.refresh(requirement)
            return requirement

    def get_requirements_for_class(self, class_id: str) -> List[SubjectRequirement]:
        """קבלת דרישות מקצועות לכיתה"""
        with self.get_session() as session:
            return session.query(SubjectRequirement).filter(
                SubjectRequirement.class_id == class_id
            ).all()

    # === שיבוצים ===

    def create_assignment(self, assignment_data: Dict[str, Any]) -> Assignment:
        """יצירת שיבוץ חדש"""
        with self.get_session() as session:
            assignment = Assignment(**assignment_data)
            session.add(assignment)
            session.commit()
            session.refresh(assignment)
            return assignment

    def get_assignments_for_teacher(self, teacher_id: str) -> List[Assignment]:
        """קבלת שיבוצים למורה"""
        with self.get_session() as session:
            return session.query(Assignment).filter(Assignment.teacher_id == teacher_id).all()

    def get_assignments_for_class(self, class_id: str) -> List[Assignment]:
        """קבלת שיבוצים לכיתה"""
        with self.get_session() as session:
            return session.query(Assignment).filter(Assignment.class_id == class_id).all()

    def get_assignments_for_time_slot(self, day: int, hour: int) -> List[Assignment]:
        """קבלת שיבוצים לזמן מסוים"""
        with self.get_session() as session:
            return session.query(Assignment).filter(
                and_(Assignment._day == day, Assignment._hour == hour)
            ).all()

    def delete_all_assignments(self) -> bool:
        """מחיקת כל השיבוצים"""
        with self.get_session() as session:
            session.query(Assignment).delete()
            session.commit()
            return True

    # === המרות ===

    def convert_to_model_teacher(self, db_teacher: Teacher) -> TeacherModel:
        """המרת מורה ממסד נתונים למודל"""
        subjects = [
            SubjectModel(subject_name=s.subject_name, grade_level=s.grade_level)
            for s in db_teacher.subjects
        ]

        return TeacherModel(
            id=db_teacher.id,
            teacher_name=db_teacher.teacher_name,
            subjects=subjects,
            preferred_day_off=db_teacher.preferred_day_off,
            max_hours_per_day=db_teacher.max_hours_per_day,
            max_hours_per_week=db_teacher.max_hours_per_week
        )

    def convert_to_model_class(self, db_class: ClassGroup) -> ClassGroupModel:
        """המרת כיתה ממסד נתונים למודל"""
        requirements = []
        for req in db_class.subject_requirements:
            requirements.append(SubjectRequirementModel(
                subject=req.subject.subject_name,
                hours_per_week=req.hours_per_week
            ))

        return ClassGroupModel(
            id=db_class.id,
            class_name=db_class.class_name,
            grade_level=db_class.grade_level,
            homeroom_teacher_id=db_class.homeroom_teacher_id,
            subject_requirements=requirements,
            min_hours_per_day=db_class.min_hours_per_day,
            max_hours_per_day=db_class.max_hours_per_day
        )

    def get_teachers_for_solver(self) -> List[TeacherModel]:
        """קבלת מורות במבנה המתאים לפותר"""
        db_teachers = self.get_all_teachers()
        return [self.convert_to_model_teacher(t) for t in db_teachers]

    def get_classes_for_solver(self) -> List[ClassGroupModel]:
        """קבלת כיתות במבנה המתאים לפותר"""
        db_classes = self.get_all_classes()
        return [self.convert_to_model_class(c) for c in db_classes]

    # === מערכות שעות ===

    def create_schedule(self, name: str, semester: str, year: int) -> Schedule:
        """יצירת מערכת שעות חדשה"""
        with self.get_session() as session:
            schedule = Schedule(name=name, semester=semester, year=year)
            session.add(schedule)
            session.commit()
            session.refresh(schedule)
            return schedule

    def get_active_schedule(self) -> Optional[Schedule]:
        """קבלת מערכת השעות הפעילה"""
        with self.get_session() as session:
            return session.query(Schedule).filter(Schedule.is_active == True).first()

    def set_active_schedule(self, schedule_id: int) -> bool:
        """הגדרת מערכת שעות כפעילה"""
        with self.get_session() as session:
            # ביטול כל המערכות הפעילות
            session.query(Schedule).update({Schedule.is_active: False})

            # הפעלת המערכת הנבחרת
            schedule = session.query(Schedule).filter(Schedule.id == schedule_id).first()
            if schedule:
                schedule.is_active = True
                session.commit()
                return True
            return False