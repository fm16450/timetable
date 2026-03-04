import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { BehaviorSubject } from 'rxjs';
import { Teacher } from '../models/teacher.model';
import { Class } from '../models/class';
import { Lesson } from '../models/lesson';
@Injectable({
  providedIn: 'root'
})
export class DataService {
  teachersSubject = new BehaviorSubject<any[]>([]);
  teachers$ = this.teachersSubject.asObservable();

  // updateTeachers(teachers: any[]) {
  //   this.teachersSubject.next(teachers);
  // }
  courses: any;
   subjects : string[] = [
 "מתמטיקה","אנגלית", "טבע","הנדסה","ציור","תורה","נביא","דינים","באורי תפילה","תהילים"

  ];
  lessons: Lesson[]=[
    { class: 22, subject: 'מתמטיקה', teacher: ' כהן', day: 1, num_of_lesson: 1 },
    { class: 22, subject: 'אנגלית', teacher: ' לוי', day: 1, num_of_lesson: 2 },
    { class: 22, subject: 'מדעים', teacher: ' פישר', day: 2, num_of_lesson: 1 },
    { class: 22, subject: 'היסטוריה', teacher: ' רוזנברג', day: 3, num_of_lesson: 1 },
    { class: 22, subject: 'ספרות', teacher: ' אברהם', day: 4, num_of_lesson: 1 },
    { class: 22, subject: 'פיזיקה', teacher: ' גולדשטין', day: 5, num_of_lesson: 1 },
    { class: 22, subject: 'כימיה', teacher: ' ברק', day: 6, num_of_lesson: 1 },
    { class: 22, subject: 'מתמטיקה', teacher: ' כהן', day: 2, num_of_lesson: 2 },
    { class: 22, subject: 'אנגלית', teacher: ' לוי', day: 3, num_of_lesson: 2 },
    { class: 22, subject: 'מדעים', teacher: ' פישר', day: 4, num_of_lesson: 2 },
    { class: 22, subject: 'היסטוריה', teacher: ' רוזנברג', day: 5, num_of_lesson: 2 },
    { class: 22, subject: 'ספרות', teacher: ' אברהם', day: 6, num_of_lesson: 2 },
    { class: 22, subject: 'פיזיקה', teacher: ' גולדשטין', day: 1, num_of_lesson: 3 },
    { class: 22, subject: 'כימיה', teacher: ' ברק', day: 2, num_of_lesson: 3 },
    { class: 22, subject: 'מתמטיקה', teacher: ' כהן', day: 3, num_of_lesson: 3 },
    { class: 22, subject: 'אנגלית', teacher: ' לוי', day: 4, num_of_lesson: 3 },
    { class: 22, subject: 'מדעים', teacher: ' פישר', day: 5, num_of_lesson: 3 },
    { class: 22, subject: 'היסטוריה', teacher: ' רוזנברג', day: 6, num_of_lesson: 3 },
    { class: 22, subject: 'ספרות', teacher: ' אברהם', day: 1, num_of_lesson: 4 },
    { class: 22, subject: 'פיזיקה', teacher: ' גולדשטין', day: 2, num_of_lesson: 4 },
    { class: 22, subject: 'כימיה', teacher: ' ברק', day: 3, num_of_lesson: 4 },
    { class: 22, subject: 'מתמטיקה', teacher: ' כהן', day: 4, num_of_lesson: 4 },
    { class: 21, subject: 'מתמטיקה', teacher: ' כהן', day: 1, num_of_lesson: 1 },
    { class: 21, subject: 'אנגלית', teacher: ' לוי', day: 1, num_of_lesson: 2 },
    { class: 21, subject: 'מדעים', teacher: ' פישר', day: 2, num_of_lesson: 1 },
    { class: 21, subject: 'היסטוריה', teacher: ' רוזנברג', day: 2, num_of_lesson: 2 },
    { class: 21, subject: 'ספרות', teacher: ' אברהם', day: 3, num_of_lesson: 1 },
    { class: 21, subject: 'פיזיקה', teacher: ' גולדשטין', day: 3, num_of_lesson: 2 },
    { class: 21, subject: 'כימיה', teacher: ' ברק', day: 4, num_of_lesson: 1 },
    { class: 21, subject: 'גיאוגרפיה', teacher: ' סלע', day: 4, num_of_lesson: 2 },
    { class: 21, subject: 'אמנות', teacher: ' שקד', day: 5, num_of_lesson: 1 },
    { class: 21, subject: 'ספורט', teacher: ' עוז', day: 5, num_of_lesson: 2 },
    { class: 21, subject: 'מוזיקה', teacher: ' נוי', day: 6, num_of_lesson: 1 },
    { class: 21, subject: 'תנ"ך', teacher: ' ברוך', day: 6, num_of_lesson: 2 },
    { class: 21, subject: 'מתמטיקה', teacher: ' כהן', day: 1, num_of_lesson: 3 },
    { class: 21, subject: 'אנגלית', teacher: ' לוי', day: 1, num_of_lesson: 4 },
    { class: 21, subject: 'מדעים', teacher: ' פישר', day: 2, num_of_lesson: 3 },
    { class: 21, subject: 'היסטוריה', teacher: ' רוזנברג', day: 2, num_of_lesson: 4 },
    { class: 21, subject: 'ספרות', teacher: ' אברהם', day: 3, num_of_lesson: 3 },
    { class: 21, subject: 'פיזיקה', teacher: ' גולדשטין', day: 3, num_of_lesson: 4 },
    { class: 21, subject: 'כימיה', teacher: ' ברק', day: 4, num_of_lesson: 3 },
    { class: 21, subject: 'גיאוגרפיה', teacher: ' סלע', day: 4, num_of_lesson: 4 },
    { class: 21, subject: 'אמנות', teacher: ' שקד', day: 5, num_of_lesson: 3 },
    { class: 21, subject: 'ספורט', teacher: ' עוז', day: 5, num_of_lesson: 4 },
];
  Classes: Class[] = [
    {
      id:11,
      grade:1,
      number_of_class:1,
      tutor:"",
      maxLessons:5
    },
    {
      id:12,
      grade:1,
      number_of_class:2,
      tutor:"",
      maxLessons:5
    },
    {
      id:21,
      grade:2,
      number_of_class:1,
      tutor:"",
      maxLessons:5
    },
    {
      id:22,
      grade:2,
      number_of_class:2,
      tutor:"",
      maxLessons:5
    },




  ]


subjectsToTeachers=[{teacherId: "323903765", subject: "תורה", class:5},
{teacherId: "323903765", subject: "תורה", class:6},
{teacherId: "323903765", subject: "תורה", class:7},
{teacherId: "323903765", subject: "תורה", class:8},
{teacherId: "323903765", subject: "חשבון", class:5},
{teacherId: "323903765", subject: "חשבון", class:6},
{teacherId: "323903765", subject: "דינים", class:6},
{teacherId: "323903765", subject: "דינים", class:7},
{teacherId: "214968018", subject: "דינים", class:7},
]

getSubjectToTeachers(){
  return  this.subjectsToTeachers
}
  getSubjects() {
    return this.subjects;
  }
     teachers:Teacher[] = [{
    firstname: "ליבי",
    lastname: "זיידנפלד",
    tel: "0548504147",
    id: "323903765",
    is_tutor: true,
    amount_of_hours: 35,
    class: 8,
    number_of_class: 2,
    // subjects: ["תורה", "חשבון", "הבעה"],
    // classes_of_subject: [[8], [6, 7, 8], [5, 6, 7, 8]]
  },
  {
    firstname: "מירי",
    lastname: "פרידמן",
    tel: "0548505555",
    id: "214968018",
    is_tutor: false,
    amount_of_hours: 42,
    class: 0,
    number_of_class: 0,
    // subjects: ["אנגלית", "דינים", "ספרות"],
    // classes_of_subject: [[4,5,6,7,8,9], [6, 7, 8], [3,4,5,6]]
  },
  {
    firstname: "רחלי",
    lastname: "ליטמן",
    tel: "0548505555",
    id: "214968018",
    is_tutor: true,
    amount_of_hours: 20,
    class: 3,
    number_of_class: 4,
    // subjects: ["אנגלית", "דינים", "ספרות"],
    // classes_of_subject: [[4,5,6,7,8,9], [6, 7, 8], [3,4,5,6]]
  },

  ];
  constructor() {
    this.teachersSubject.next(this.teachers);
  }
  getTeachers(): Teacher[] {
    return this.teachers;
  }
  setTeachers(new_teachers: any[]):void{
    this.teachers = new_teachers;
  }


  updateTeacher(index: number, updatedTeacher: any): void {
    this.teachers[index] = updatedTeacher;
    this.teachersSubject.next(this.teachers);
  }
}
  // getTeachers(): Observable<object[]> {
  //   return of(this.teachers);
  // }


