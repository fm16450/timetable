
INSERT INTO teachers (id, teacher_name, preferred_day_off, max_hours_per_day, max_hours_per_week) VALUES ('1', 'חוה', 5, 6, 30), ('2', 'יסכה', 1, 5, 25), ('3', 'מירי', 3, 7, 35), ('4', 'נועה', 2, 5, 20), ('5', 'עינת', 4, 6, 28), ('6', 'שרה', 1, 4, 20), ('7', 'מאיה', 3, 8, 32), ('8', 'אורלי', 2, 5, 26), ('9', 'תמיר', 6, 7, 33), ('10', 'נינה', 1, 5, 24);

INSERT INTO subjects (subject_name, grade_level) VALUES ('מתמטיקה', 1);
INSERT INTO subjects (subject_name, grade_level) VALUES ('אומנות', 1);
INSERT INTO subjects (subject_name, grade_level) VALUES ('חינוך גופני', 1);

INSERT INTO subjects (subject_name, grade_level) VALUES ('מדע', 2);
INSERT INTO subjects (subject_name, grade_level) VALUES ('שפה', 2);
INSERT INTO subjects (subject_name, grade_level) VALUES ('מוזיקה', 2);

INSERT INTO subjects (subject_name, grade_level) VALUES ('מדעי החיים', 3);
INSERT INTO subjects (subject_name, grade_level) VALUES ('היסטוריה', 3);
INSERT INTO subjects (subject_name, grade_level) VALUES ('גאוגרפיה', 3);

INSERT INTO subjects (subject_name, grade_level) VALUES ('מתמטיקה', 4);
INSERT INTO subjects (subject_name, grade_level) VALUES ('אנגלית', 4);
INSERT INTO subjects (subject_name, grade_level) VALUES ('מדעי המחשב', 4);

INSERT INTO subjects (subject_name, grade_level) VALUES ('ביולוגיה', 5);
INSERT INTO subjects (subject_name, grade_level) VALUES ('כימיה', 5);
INSERT INTO subjects (subject_name, grade_level) VALUES ('פיזיקה', 5);

INSERT INTO subjects (subject_name, grade_level) VALUES ('מתמטיקה', 6);
INSERT INTO subjects (subject_name, grade_level) VALUES ('אומניות', 6);
INSERT INTO subjects (subject_name, grade_level) VALUES ('חינוך גופני', 6);

INSERT INTO subjects (subject_name, grade_level) VALUES ('מדעי המחשב', 7);
INSERT INTO subjects (subject_name, grade_level) VALUES ('סוציולוגיה', 7);
INSERT INTO subjects (subject_name, grade_level) VALUES ('היסטוריה', 7);

INSERT INTO subjects (subject_name, grade_level) VALUES ('ביולוגיה', 8);
INSERT INTO subjects (subject_name, grade_level) VALUES ('כימיה', 8);
INSERT INTO subjects (subject_name, grade_level) VALUES ('פיזיקה', 8);

INSERT INTO classes (id, class_name, grade_level, homeroom_teacher_id, min_hours_per_day, max_hours_per_day) VALUES ('11', '1', 1, '1', 4, 6);
INSERT INTO classes (id, class_name, grade_level, homeroom_teacher_id, min_hours_per_day, max_hours_per_day) VALUES ('21', '2', 2, '10', 4, 6);
INSERT INTO classes (id, class_name, grade_level, homeroom_teacher_id, min_hours_per_day, max_hours_per_day) VALUES ('31', '3', 3, '2', 4, 7);
INSERT INTO classes (id, class_name, grade_level, homeroom_teacher_id, min_hours_per_day, max_hours_per_day) VALUES ('41', '4', 4, '3', 5, 8);
INSERT INTO classes (id, class_name, grade_level, homeroom_teacher_id, min_hours_per_day, max_hours_per_day) VALUES ('51', '5', 5, '4', 5, 8);
INSERT INTO classes (id, class_name, grade_level, homeroom_teacher_id, min_hours_per_day, max_hours_per_day) VALUES ('61', '6', 6, '5', 5, 8);
INSERT INTO classes (id, class_name, grade_level, homeroom_teacher_id, min_hours_per_day, max_hours_per_day) VALUES ('71', '7', 7, '6', 4, 7);
INSERT INTO classes (id, class_name, grade_level, homeroom_teacher_id, min_hours_per_day, max_hours_per_day) VALUES ('81', '8', 8, '7', 4, 8);

INSERT INTO subject_requirements (class_id, subject_id, hours_per_week) VALUES ('11', 1, 4);
INSERT INTO subject_requirements (class_id, subject_id, hours_per_week) VALUES ('11', 2, 3);
INSERT INTO subject_requirements (class_id, subject_id, hours_per_week) VALUES ('21', 3, 5);
INSERT INTO subject_requirements (class_id, subject_id, hours_per_week) VALUES ('21', 4, 2);
INSERT INTO subject_requirements (class_id, subject_id, hours_per_week) VALUES ('31', 5, 6);
INSERT INTO subject_requirements (class_id, subject_id, hours_per_week) VALUES ('31', 6, 4);
INSERT INTO subject_requirements (class_id, subject_id, hours_per_week) VALUES ('41', 7, 5);
INSERT INTO subject_requirements (class_id, subject_id, hours_per_week) VALUES ('41', 8, 3);
INSERT INTO subject_requirements (class_id, subject_id, hours_per_week) VALUES ('51', 9, 6);
INSERT INTO subject_requirements (class_id, subject_id, hours_per_week) VALUES ('51', 10, 2);
INSERT INTO subject_requirements (class_id, subject_id, hours_per_week) VALUES ('61', 11, 4);
INSERT INTO subject_requirements (class_id, subject_id, hours_per_week) VALUES ('61', 12, 3);
INSERT INTO subject_requirements (class_id, subject_id, hours_per_week) VALUES ('71', 13, 5);
INSERT INTO subject_requirements (class_id, subject_id, hours_per_week) VALUES ('71', 14, 4);
INSERT INTO subject_requirements (class_id, subject_id, hours_per_week) VALUES ('81', 15, 2);
INSERT INTO subject_requirements (class_id, subject_id, hours_per_week) VALUES ('81', 16, 3);

INSERT INTO assignments (teacher_id, class_id, subject_id, _day, _hour) VALUES ('1', '11', 1, 1, 2);
INSERT INTO assignments (teacher_id, class_id, subject_id, _day, _hour) VALUES ('2', '11', 2, 2, 3);
INSERT INTO assignments (teacher_id, class_id, subject_id, _day, _hour) VALUES ('3', '21', 3, 1, 4);
INSERT INTO assignments (teacher_id, class_id, subject_id, _day, _hour) VALUES ('4', '21', 4, 2, 5);
INSERT INTO assignments (teacher_id, class_id, subject_id, _day, _hour) VALUES ('5', '31', 5, 3, 6);
INSERT INTO assignments (teacher_id, class_id, subject_id, _day, _hour) VALUES ('6', '31', 6, 1, 2);
INSERT INTO assignments (teacher_id, class_id, subject_id, _day, _hour) VALUES ('7', '41', 7, 4, 3);
INSERT INTO assignments (teacher_id, class_id, subject_id, _day, _hour) VALUES ('8', '41', 8, 5, 4);
INSERT INTO assignments (teacher_id, class_id, subject_id, _day, _hour) VALUES ('9', '51', 9, 1, 5);
INSERT INTO assignments (teacher_id, class_id, subject_id, _day, _hour) VALUES ('10', '51', 10, 2, 6);
INSERT INTO assignments (teacher_id, class_id, subject_id, _day, _hour) VALUES ('1', '61', 11, 3, 2);
INSERT INTO assignments (teacher_id, class_id, subject_id, _day, _hour) VALUES ('2', '61', 12, 4, 3);
INSERT INTO assignments (teacher_id, class_id, subject_id, _day, _hour) VALUES ('3', '71', 13, 5, 4);
INSERT INTO assignments (teacher_id, class_id, subject_id, _day, _hour) VALUES ('4', '71', 14, 1, 5);
INSERT INTO assignments (teacher_id, class_id, subject_id, _day, _hour) VALUES ('5', '81', 15, 2, 6);
INSERT INTO assignments (teacher_id, class_id, subject_id, _day, _hour) VALUES ('6', '81', 16, 3, 2);

INSERT INTO schedules (schedule_name, semester, _year, is_active, max_days_per_week, max_hours_per_day) VALUES ('new-schedule', 'א', 2025, 1, 5, 8);