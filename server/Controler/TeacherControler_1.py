from flask import render_template, request, jsonify, Blueprint
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from DTO.TeacherDTO import TeacherDTO
from Model.Teacher import Base
from Repository.TeacherRepository import TeacherRepository
from Services.TeacherService import TeacherService

engine = create_engine('sqlite:///teachers.db')
Base.metadata.create_all(engine)
Session = sessionmaker(bind=engine)
session = Session()

repo = TeacherRepository(session)
service = TeacherService(repo)

teachers_blueprint = Blueprint('teachers', __name__)


@teachers_blueprint.route('', methods=['POST'])
def add_teacher():
    dto = TeacherDTO(**request.get_json())
    service.add_teacher(dto)
    return jsonify({"message": "teacher added"}), 201


@teachers_blueprint.route('', methods=['GET'])
def get_teachers():
    teachers = service.get_all_teachers()
    return jsonify([{'teacherId': t.teacher_id, 'name': t.name, 'email': t.email, 'phone': t.phone,
                     'classId': t.class_id, 'count_hours': t.count_hours}
                    for t in teachers])


@teachers_blueprint.route('/<int:teacher_id>', methods=['GET'])
def get_teacher(teacher_id):
    teacher = service.get_teacher_by_id(teacher_id)
    return jsonify(
        {'teacherId': teacher.teacher_id, 'name': teacher.name, 'email': teacher.email, 'phone': teacher.phone,
         'classId': teacher.class_id, 'count_hours': teacher.count_hours})


@teachers_blueprint.route('/<int:teacher_id>', methods=['PUT'])
def update_teacher(teacher_id):
    dto = TeacherDTO(**request.get_json())
    teacher = service.update_teacher(teacher_id, dto)
    return jsonify({'message': 'reacher updated'})


@teachers_blueprint.route('/<int:teacher_id>', methods=['DELETE'])
def delete_teacher(teacher_id):
    service.delete_teacher(teacher_id)
    return jsonify({'message': 'teacher deleted'})
# לפני העתקה משרי
# def register_teachers_routes(app):
#     @app.route('/')
#     def index():
#         teachers = service.list_Teachers()
#         return render_template('index.html', teachers=teachers)
#
#     @app.route('/api/teachers', methods=['POST'])
#     def add_teacher():
#         dto = TeacherDTO(**request.get_json())
#         service.add_Teacher(dto)
#         return jsonify({"message": "teacher added"}), 201
