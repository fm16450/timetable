CREATE DATABASE schedule;
GO
USE schedule;

CREATE TABLE teachers(
id NVARCHAR(20) PRIMARY KEY,
teacher_name NVARCHAR(20) NOT NULL,
preferred_day_off INT,
max_hours_per_day INT,
max_hours_per_week INT, 
);

CREATE TABLE subjects(
id INT PRIMARY KEY IDENTITY,
subject_name NVARCHAR(20) NOT NULL,
grade_level int NOT NULL
);

CREATE TABLE classes(
id NVARCHAR(20) PRIMARY KEY,
class_name NVARCHAR(20) NOT NULL,
grade_level int NOT NULL,
homeroom_teacher_id NVARCHAR(20) FOREIGN KEY REFERENCES teachers(id),
min_hours_per_day INT default(0),
max_hours_per_day INT default(8)
);

CREATE TABLE subject_requirements(
id INT PRIMARY KEY IDENTITY,
class_id NVARCHAR(20) FOREIGN KEY REFERENCES classes(id) NOT NULL,
subject_id INT FOREIGN KEY REFERENCES subjects(id) NOT NULL,
hours_per_week INT NOT NULL
);

CREATE TABLE assignments(
id INT PRIMARY KEY IDENTITY,
teacher_id NVARCHAR(20) FOREIGN KEY REFERENCES teachers(id) NOT NULL,
class_id NVARCHAR(20) FOREIGN KEY REFERENCES classes(id) NOT NULL,
subject_id INT FOREIGN KEY REFERENCES subjects(id) NOT NULL,
_day INT NOT NULL,
_hour INT NOT NULL
);

CREATE TABLE schedules(
id INT PRIMARY KEY IDENTITY,
schedule_name NVARCHAR(20) NOT NULL,
semester NVARCHAR(2) NOT NULL,
_year INT NOT NULL,
is_active bit NOT NULL,
max_days_per_week INT default(5),
max_hours_per_day INT default(8)
);

CREATE TABLE teacher_subjects(
teacher_id NVARCHAR(20) FOREIGN KEY REFERENCES teachers(id),
subject_id INT FOREIGN KEY REFERENCES subjects(id)
);