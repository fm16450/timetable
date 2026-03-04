from flask import Blueprint, request, jsonify
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from DTO.SubjectsDTO import SubjectsDTO
from Repository.SubjectsRepository import SubjectsRepository
from Model.Subjects import Base
from Services.SubjectsService import SubjectsService

engine = create_engine('sqlite:///subjects.db')
Base.metadata.create_all(engine)
Session = sessionmaker(bind=engine)
session = Session()

repo = SubjectsRepository(session)
service = SubjectsService(repo)

subject_blueprint = Blueprint('subjects', __name__)


@subject_blueprint.route('', methods=['POST'])
def add_subject():
    dto = SubjectsDTO(**request.get_json())
    service.add_subject(dto)
    return jsonify({'message': 'Subject added'}), 201


@subject_blueprint.route('', methods=['GET'])
def get_subjects():
    subjects = service.get_all_subjects()
    return jsonify([{'id': s.id, 'name': s.name, 'isPreceptor': s.isPreceptor} for s in subjects])


@subject_blueprint.route('/<int:subject_id>', methods=['GET'])
def get_subject(subject_id):
    subject = service.get_subject_by_id(subject_id)
    return jsonify({'id': subject.id, 'name': subject.name, 'isPreceptor': subject.isPreceptor})


@subject_blueprint.route('/<int:subject_id>', methods=['PUT'])
def update_subject(subject_id):
    dto = SubjectsDTO(**request.get_json())
    subject = service.update_subject(subject_id, dto)
    return jsonify({'message': 'Subject updated'})


@subject_blueprint.route('/<int:subject_id>', methods=['DELETE'])
def delete_subject(subject_id):
    service.delete_subject(subject_id)
    return jsonify({'message': 'Subject deleted'})
