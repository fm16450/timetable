from flask import Blueprint, request, jsonify
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from Model.subject_of_teacher import Base
from Repository.subject_of_teacher_repository import SubjectOfTeacherRepository
from Services.subject_of_teacher_service import SubjectOfTeacherService

engine = create_engine('sqlite:///subject_of_teacher.db')
Base.metadata.create_all(engine)
Session = sessionmaker(bind=engine)
session = Session()

repo = SubjectOfTeacherRepository(session)
service = SubjectOfTeacherService(repo)

subject_of_teacher_blueprint = Blueprint('subject_of_teacher', __name__)


class SubjectOfTeacherDTO:
    pass


@subject_of_teacher_blueprint.route('', methods=['POST'])
def add_subject():
    dto = SubjectOfTeacherDTO(**request.get_json())
    service.add_subject(dto)
    return jsonify({'message': 'Subject added'}), 201


@subject_of_teacher_blueprint.route('', methods=['GET'])
def get_subjects():
    subjects = service.get_all_subjects()
    return jsonify(
        [{'teacher_id': s.teacher_id, 'subject_id': s.subject_id, 'grade': s.grade, 'is_perceptor': s.is_perceptor}
         for s in subjects])


@subject_of_teacher_blueprint.route('/<int:subject_id>', methods=['GET'])
def get_subject(subject_id):
    subject = service.get_subject_by_id(subject_id)
    return jsonify(
        {'teacher_id': subject.teacher_id, 'subject_id': subject.subject_id, 'grade': subject.grade,
         'is_perceptor': subject.is_perceptor})

@subject_of_teacher_blueprint.route('/<int:subject_id>', methods=['PUT'])
def update_subject(subject_id):
    dto = SubjectOfTeacherDTO(**request.get_json())
    subject = service.update_subject(subject_id, dto)
    return jsonify({'message': 'Subject updated'})

@subject_of_teacher_blueprint.route('/<int:subject_id>', methods=['DELETE'])
def delete_subject(subject_id):
    service.delete_subject(subject_id)
    return jsonify({'message': 'Subject deleted'})


