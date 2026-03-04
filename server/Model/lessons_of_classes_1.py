from sqlalchemy import Column, Integer
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()


class LessonOfClasses(Base):
    __tablename__ = 'lesson_of_classes'
    id = Column(Integer, primary_key=True)
    subject_id = Column(Integer, foreign_key=True)
    grade = Column(Integer)
    amount = Column(Integer)
