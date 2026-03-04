from sqlalchemy import column, Integer, String
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()


class Teacher(Base):
    __tablename__ = 'teachers'
    teacher_id = column(Integer, primery_key=True)
    name = column(String)
    email = column(String)
    phone = column(String)
    preceptor_id = column(bool)
    count_hours = column(Integer)
