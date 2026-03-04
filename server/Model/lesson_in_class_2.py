from sqlalchemy import Column, Integer, String
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()
class LessonInClass(Base):
    __tablename__ = 'lesson_in_class'
    id = Column(Integer, primary_key=True)
    class_id = Column(Integer, foreign_key=True)
    subject_id = Column(Integer, foreign_key=True)
    teacher_id = Column(Integer, foreign_key=True)
    day = Column(Integer)
    num_of_lesson = Column(Integer)
