from flask import render_template, request, jsonify, Blueprint
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from DTO.lesson_in_class_dto import LessonInClass, LessonInClassDTO
from Model.lesson_in_class import Base
from Repository.Lesson_in_class_repository import LessonInClassRepository
from Services.lesson_in_class_service import LessonInClassService

engine = create_engine('sqlite:///lessons_in_classes')
Base.metadata.create_all(engine)
Session = sessionmaker(bind=engine)
session = Session()

repo = LessonInClassRepository(session)
service = LessonInClassService(repo)

lesson_in_class_blueprint = Blueprint('lesson_in_class', __name__)


@lesson_in_class_blueprint.route('', method=['POST'])
def add_lesson():
    dto = LessonInClassDTO(**request.get_json())
    service.add_lesson(dto)
    return jsonify({"message": 'Lesson added'}), 201


@lesson_in_class_blueprint.route('', method=['GET'])
def get_lessons():
    lessons = service.get_all_lessons()
    return jsonify([{'lesson_id': l.lesson_id, 'class_id': l.class_id, 'subject_id': l.subject_id,
                     'teacher_id': l.teacher_id, 'day': l.day, 'num_of_lesson': l.num_of_lesson}
                    for l in lessons])


@lesson_in_class_blueprint.route('/<int:lesson_id>', methods=['GET'])
def get_lesson(lesson_id):
    lesson = service.get_lesson_by_id(lesson_id)
    return jsonify({'lesson_id': lesson.lesson_id, 'class_id': lesson.class_id, 'subject_id': lesson.subject_id,
                    'teacher_id': lesson.teacher_id, 'day': lesson.day, 'num_of_lesson': lesson.num_of_lesson})

@lesson_in_class_blueprint.route('/<int:lesson_id>', methods=['PUT'])
def update_lesson(lesson_id):
    dto = LessonInClassDTO(**request.get_json())
    attraction = service.update_lesson(lesson_id, dto)
    return jsonify({'message': 'Lesson updated'})

@lesson_in_class_blueprint.route('/<int:lesson_id>', methods=['DELETE'])
def delete_attraction(lesson_id):
    service.delete_lesson(lesson_id)
    return jsonify({'message': 'Lesson deleted'})


# def register_lessonInClass_routes(app):
#     @app.route('/')
#     def index():
#         lessons = service.list_lessons()
#         return render_template('index.html', lessons=lessons)
#
#     @app.route('/api/lessonsInClass', methods=['POST'])
#     def add_lesson():
#         data = request.get_json()
#         dto = LessonInClass(**data)
#         service.add_lesson(dto)
#         return jsonify({"message:" "Lesson added"}), 201
