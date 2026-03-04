create database SCHEDULE
go
use SCHEDULE

create table classes(
ClassID int primary key identity,
Grade int,
Class_Num int
)

create table subjects(
SubjectID int primary key identity,
Subject_Name nvarchar(50),
Subject_ClassTutor bit
)

create table teachers(
TeacherID int primary key identity,
First_Name nvarchar(50),
Last_Name nvarchar(50),
Email nvarchar(20),
Phone nvarchar(20),
ClassID int Foreign key references classes(ClassID),
Min_Hours int,
Nax_Hours int
)

create table subject_of_teacher(
Subject_Of_TeacherID int primary key identity,
TeacherID int Foreign key references teachers(TeacherID),
SubjectID int Foreign key references subjects(SubjectID),
Grade int,
ClassTutor bit
)

create table lesson_To_Class_DB(
LessonID int primary key identity,
SubjectID int Foreign key references subjects(SubjectID),
Grade int,
Count_Lessons_Week int
)

create table lesson_In_Class(
Lesson_In_ClassID int primary key identity,
ClassID int Foreign key references classes(ClassID),
SubjectID int Foreign key references subjects(SubjectID),
TeacherID int Foreign key references teachers(TeacherID),
On_Day int,
Num_Lesson int
)

create table teacher_Constrain(
Must_TeacherID int primary key identity,
TeacherID int Foreign key references teachers(TeacherID),
On_Day int,
Num_Started_Lesson int,
Num_end_Lesson int,
Count_Lessons_On_Day int,
Level_Constrain int
)

create table day_subject_contrain(
Day_subject_contrainID int primary key identity,
SubjectID int Foreign key references subjects(SubjectID),
On_Day int,
Count_Lesson_Day int,
Level_Constrain int
)

create table count_subject_teacher_contrain(
Count_subject_contrainID int primary key identity,
SubjectID int Foreign key references subjects(SubjectID),
Count_lessons_week int,
Max_lessons_of_day int,
Level_Constrain int
)




