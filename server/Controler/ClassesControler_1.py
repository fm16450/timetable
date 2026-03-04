import requests
from flask import Blueprint, request, jsonify
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from DTO.ClassesDTO import ClassesDTO
from Model.Classes import Base
from Repository.ClassesRepository import ClassesRepository
from Services.ClassesService import ClassesService

engine = create_engine('sqlite:///classes.db')
Base.metadata.create_all(engine)
Session = sessionmaker(bind=engine)
session = Session()

repo = ClassesRepository(session)
service = ClassesService(repo)

class_blueprint = Blueprint('classes', __name__)


@class_blueprint.route('', methods=['POST'])
def add_class():
    dto = ClassesDTO(**request.get_json())
    service.add_class(dto)
    return jsonify({'message': 'class added'}), 201


@class_blueprint.route('', methods=['GET'])
def get_classes():
    classes = service.get_all_classes()
    return jsonify([{'id': c.id, 'grade': c.grade, 'numOfClass': c.numOfClass} for c in classes])


@class_blueprint.route('/<int:class_id>', methods=['GET'])
def get_class(class_id):
    Class = service.get_class_by_id(class_id)
    return jsonify({'id': Class.id, 'grade': Class.grade, 'numOfClass': Class.numOfClass})


@class_blueprint.route('/<int:class_id>', methods=['DELETE'])
def delete_class(class_id):
    service.delete_class(class_id)
    return jsonify({'message': 'class deleted'})
