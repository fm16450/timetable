from sqlalchemy import Column, Integer, String
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()


class SubjectOfTeacher(Base):
    __tablename__ = 'subject_of_teacher'
    id = Column(Integer, primary_key=True)
    teacher_id = Column(Integer, foreign_key=True)
    subject_id = Column(Integer, foreign_key=True)
    grade = Column(Integer)
    is_perceptor = Column(bool)
