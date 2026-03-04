from sqlalchemy.orm import Session
from Model import Classes


class ClassesRepository:
    def __init__(self, session: Session):
        self.session = session

    def add(self, Class: Classes):
        self.session.add(Class)
        self.session.commit()

    def get_all(self):
        return self.session.query(Classes).all()

    def get_by_id(self, class_id):
        return self.session.query(Classes).get(class_id)

    def delete(self, class_id):
        Class = self.get_by_id(class_id)
        if Class:
            self.session.delete(Class)
            self.session.commit()
        return Class

    def exists_by_id(self, class_id):
        return self.session.query(Classes).filter_by(id=class_id).first() is not None
