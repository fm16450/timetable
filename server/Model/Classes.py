from sqlalchemy import Column, Integer, String
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()


class Classes(Base):
    __tablename__ = 'classes'
    id = Column(Integer, primary_key=True)
    grade = Column(Integer)
    numOfGrade = Column(Integer)
