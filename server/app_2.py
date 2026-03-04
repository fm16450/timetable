from flask import Flask
from Controler.ClassesControler import class_blueprint
from Controler.SubjectsControler import subject_blueprint
from Controler.TeacherControler import teachers_blueprint
from Controler.lesson_in_class_controler import lesson_in_class_blueprint
from Controler.lessons_of_classes_controler import lesson_of_classes_blueprint

app = Flask(__name__)

app.register_blueprint(class_blueprint, url_prefix='/api/classes')
app.register_blueprint(subject_blueprint, url_prefix='/api/subjects')
app.register_blueprint(lesson_in_class_blueprint, url_prefix='/api/lesson_in_class')
app.register_blueprint(lesson_of_classes_blueprint, url_prefix='/api/lessons_of_classes')
app.register_blueprint(teachers_blueprint, url_prefix='/api/teachers')

if __name__ == '__main__':
    app.run(debug=True)
