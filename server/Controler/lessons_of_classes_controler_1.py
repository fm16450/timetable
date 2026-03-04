from flask import Blueprint, request, jsonify
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from DTO.lessons_of_classesDTO import LessonOfClassesDTO
from Model.lessons_of_classes import Base
from Repository import Lesson_of_classes_repository
from Services import lesson_of_classes_service

engine = create_engine('sqlite:///lesson_of_classes.db')
Base.metadata.create_all(engine)
Session = sessionmaker(bind=engine)
session = Session()

repo = Lesson_of_classes_repository(session)
service = lesson_of_classes_service(repo)

lesson_of_classes_blueprint = Blueprint('lesson_of_classes', __name__)


@lesson_of_classes_blueprint.route('', methods=['POST'])
def add_lesson():
    dto = LessonOfClassesDTO(**request.get_json())
    service.add_lesson(dto)
    return jsonify({'message': 'Lesson added'}), 201


@lesson_of_classes_blueprint.route('', methods=['GET'])
def get_lessons():
    lessons = service.get_all_lessons()
    return jsonify(
        [{'lessonID': l.lesson_id, 'subjectID': l.subject_id, 'grade': l.grade, 'amount': l.amount} for l in lessons])


@lesson_of_classes_blueprint.route('/<int:lesson_id>', methods=['GET'])
def get_lesson(lesson_id):
    lesson = service.get_lesson_by_id(lesson_id)
    return jsonify({'lessonID': lesson.lesson_id, 'subjectID': lesson.subject_id, 'grade': lesson.grade, 'amount': l.amount})


@lesson_of_classes_blueprint.route('/<int:lesson_id>', methods=['PUT'])
def update_lesson(lesson_id):
    dto = LessonOfClassesDTO(**request.get_json())
    lesson = service.update_attraction(lesson_id, dto)
    return jsonify({'message': 'Lesson updated'})


@lesson_of_classes_blueprint.route('/<int:lesson_id>', methods=['DELETE'])
def delete_lesson(lesson_id):
    service.delete_lesson(lesson_id)
    return jsonify({'message': 'Lesson deleted'})


