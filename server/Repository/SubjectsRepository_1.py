from sqlalchemy.orm import Session
from Model.Subjects import Subjects


class SubjectsRepository:
    def __init__(self, session: Session):
        self.session = session

    def add(self, subject: Subjects):
        self.session.add(subject)
        self.session.commit()

    def get_all(self):
        return self.session.query(Subjects).all()

    def get_by_id(self, subject_id):
        return self.session.query(Subjects).get(subject_id)

    def delete(self, subject_id):
        subject = self.get_by_id(subject_id)
        if subject:
            self.session.delete(subject)
            self.session.commit()
        return subject

    # def exists_by_name(self, name):
    #     return self.session.query(Subjects).filter_by(name=name).first() is not None
