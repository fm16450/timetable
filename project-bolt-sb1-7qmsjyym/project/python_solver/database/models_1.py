from sqlalchemy import Column, Integer, String, Boolean, ForeignKey, Table
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
from typing import List

Base = declarative_base()

# טבלת קישור בין מורות למקצועות
teacher_subjects = Table(
    'teacher_subjects',
    Base.metadata,
    Column('teacher_id', String, ForeignKey('teachers.id')),
    Column('subject_id', Integer, ForeignKey('subjects.id'))
)

#כל אחד בנפרד בmodels
class Teacher(Base):
    """מורה"""
    __tablename__ = 'teachers'

    id = Column(String, primary_key=True)
    teacher_name = Column(String, nullable=False)
    preferred_day_off = Column(Integer, nullable=True)  # 0-6
    max_hours_per_day = Column(Integer, nullable=True)
    max_hours_per_week = Column(Integer, nullable=True)

    # קשרים
    subjects = relationship("Subject", secondary=teacher_subjects, back_populates="teachers")
    assignments = relationship("Assignment", back_populates="teacher")


class Subject(Base):
    """מקצוע"""
    __tablename__ = 'subjects'

    id = Column(Integer, primary_key=True, autoincrement=True)
    subject_name = Column(String, nullable=False)
    grade_level = Column(Integer, nullable=False)  # 1-8

    # קשרים
    teachers = relationship("Teacher", secondary=teacher_subjects, back_populates="subjects")
    requirements = relationship("SubjectRequirement", back_populates="subject")
    assignments = relationship("Assignment", back_populates="subject_obj")


class ClassGroup(Base):
    """כיתה"""
    __tablename__ = 'classes'

    id = Column(String, primary_key=True)
    class_name = Column(String, nullable=False)
    grade_level = Column(Integer, nullable=False)  # 1-8
    homeroom_teacher_id = Column(String, ForeignKey('teachers.id'), nullable=True)
    min_hours_per_day = Column(Integer, default=0)
    max_hours_per_day = Column(Integer, default=8)

    # קשרים
    homeroom_teacher = relationship("Teacher")
    subject_requirements = relationship("SubjectRequirement", back_populates="class_group")
    assignments = relationship("Assignment", back_populates="class_group")


class SubjectRequirement(Base):
    """דרישת מקצוע לכיתה"""
    __tablename__ = 'subject_requirements'

    id = Column(Integer, primary_key=True, autoincrement=True)
    class_id = Column(String, ForeignKey('classes.id'), nullable=False)
    subject_id = Column(Integer, ForeignKey('subjects.id'), nullable=False)
    hours_per_week = Column(Integer, nullable=False)

    # קשרים
    class_group = relationship("ClassGroup", back_populates="subject_requirements")
    subject = relationship("Subject", back_populates="requirements")


class Assignment(Base):
    """שיבוץ - מורה מלמדת מקצוע לכיתה בזמן מסוים"""
    __tablename__ = 'assignments'

    id = Column(Integer, primary_key=True, autoincrement=True)
    teacher_id = Column(String, ForeignKey('teachers.id'), nullable=False)
    class_id = Column(String, ForeignKey('classes.id'), nullable=False)
    subject_id = Column(Integer, ForeignKey('subjects.id'), nullable=False)
    _day = Column(Integer, nullable=False)  # 0-6
    _hour = Column(Integer, nullable=False)  # 0-39

    # קשרים
    teacher = relationship("Teacher", back_populates="assignments")
    class_group = relationship("ClassGroup", back_populates="assignments")
    subject_obj = relationship("Subject", back_populates="assignments")


class Schedule(Base):
    """מערכת שעות"""
    __tablename__ = 'schedules'

    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String, nullable=False)
    semester = Column(String, nullable=False)  # "א", "ב"
    _year = Column(Integer, nullable=False)
    is_active = Column(Boolean, default=False)
    max_days_per_week = Column(Integer, default=5)
    max_hours_per_day = Column(Integer, default=8)
