import { Component, OnInit, inject, Inject } from '@angular/core';
import { NewTeacherComponent } from '../forms/new-teacher/new-teacher.component';
import { MatDialog } from '@angular/material/dialog';
import { Dialog } from '@angular/cdk/dialog';
import { computeMsgId } from '@angular/compiler';
import { CommonModule } from '@angular/common';
import { DataService } from '../services/data.service';
import { SubjectsToTeacherComponent } from '../subjects-to-teacher/subjects-to-teacher.component';
import { Teacher } from '../models/teacher.model';
import { GenericService } from '../services/generic.service';
import { HttpClient } from '@angular/common/http';
import { ApiEndpoints } from '../config/api-endpoints';
import { Lesson } from '../models/lesson';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';


@Component({
  selector: 'app-lessons-table',
  imports: [],
  templateUrl: './lessons-table.component.html',
  styleUrl: './lessons-table.component.scss'
})
export class LessonsTableComponent {
  classes = ['מורה מקצועית', 'א', 'ב', 'ג', 'ד', 'ה', 'ו', 'ז', 'ח']
  lessons: Lesson[] = [];
  sorted_lessons: Lesson[][] = [];
  days:number[]=[1,2,3,4,5,6]
  hours:number[]=[1,2,3,4,5,6,7]
  lessonService: GenericService<Lesson> | undefined;//הצהרה על סרויס מסוג ספר
  // teacher1: Teacher =
  //   {
  //     firstname: "ליבי",
  //     lastname: "זיידנפלד",
  //     tel: "0548504147",
  //     id: "323903765",
  //     is_tutor: true,
  //     amount_of_hours: 35,
  //     class: 8,
  //     number_of_class: 2,
  //   }
  // 
  constructor(@Inject(MAT_DIALOG_DATA) public data: any,private dataService: DataService, private dialog: MatDialog, private http: HttpClient) {


    this.lessonService = new GenericService<Teacher>(http, ApiEndpoints.teacher); //איתחול הסרויס

  }

  filterLessonsByClass(classNumber: number, lessons: Lesson[]): Lesson[][] {
    // מסננים את השיעורים לפי הכיתה
    const filteredLessons = lessons.filter(lesson => lesson.class === classNumber);
    
    // יוצרים מטריצה של 6 ימים
    const schedule: Lesson[][] = Array.from({ length: 6 }, () => 
        Array(6).fill({ subject: '', teacher: '' })
    );

    // ממלאים את המטריצה בשיעורים
    filteredLessons.forEach(lesson => {
        const dayIndex = lesson.day - 1; // מתאם בין יום למערך (0-5)
        schedule[dayIndex][lesson.num_of_lesson - 1] = lesson; // ממלאים את השיעור במיקום המתאים
    });

    return schedule;
}

  ngOnInit(): void {
    this.loadLessons();

  }

  loadLessons(): void {
    //הגירסא האמיתית
    // this.teacherService?.getAll().subscribe(teachers => this.teachers = teachers);
    //הגירסא המקומית
    this.lessons = this.dataService.lessons
    console.log(this.data);
    
    this.sorted_lessons = this.filterLessonsByClass(1*this.data, this.lessons);
  //   this.sorted_lessons = [[{
  //     class:11,
  //     subject: "דינים",
  //     teacher: "לוי",
  //     day:1,
  //     num_of_lesson:1
  //   },
  //   {
  //     class:11,
  //     subject: "תורה",
  //     teacher: "לוי",
  //     day:2,
  //     num_of_lesson:1
  //   },
  //   {
  //     class:11,
  //     subject: "חשבון",
  //     teacher: "לוי",
  //     day:3,
  //     num_of_lesson:1
  //   },
  //   {
  //     class:11,
  //     subject: "תורה",
  //     teacher: "לוי",
  //     day:4,
  //     num_of_lesson:1
  //   },
  //   {
  //     class:11,
  //     subject: "תורה",
  //     teacher: "לוי",
  //     day:5,
  //     num_of_lesson:1
  //   }]]

  // }



//   filterLessonsByClass(classNumber: number, lessons: Lesson[]): Lesson[][] {
//     // מסנן את השיעורים לפי הכיתה שנבחרה
//     const filteredLessons = lessons.filter(lesson => lesson.class === classNumber);
    
//     // יוצר מטריצה של שיעורים ממוינים לפי מספר השיעור
//     const lessonsMatrix: Lesson[][] = [];

//     // ממיין את השיעורים לפי יום
//     filteredLessons.sort((a, b) => a.day - b.day);

//     // ממלא את המטריצה
//     filteredLessons.forEach(lesson => {
//         // אם המערך עבור מספר השיעור לא קיים, יוצר אותו
//         if (!lessonsMatrix[lesson.num_of_lesson]) {
//             lessonsMatrix[lesson.num_of_lesson] = [];
//         }
//         // מוסיף את השיעור למערך המתאים
//         lessonsMatrix[lesson.num_of_lesson].push(lesson);
//     });

//     return lessonsMatrix;
// }
  // editTeacher(teacher: Teacher, index: number) {
  //   const dialogRef = this.dialog.open(NewTeacherComponent, {
  //     data: { editedTeacher: teacher, i: index },
  //     width: '500px',
  //     height: '1000px'
  //   })

  //   dialogRef.afterClosed().subscribe(result => {
  //     if (result) {
  //       //הגירסא האמיתית
  //       // this.teacherService?.update(teacher.id, teacher).subscribe(this.loadTeachers);
  //       //הגירסא המקומית
  //       this.dataService.updateTeacher(index, result);
  //     }
  //   });
  // }

  // deleteTeacher(id: string, i: number) {
  //   //הגירסא האמיתית
  //   // this.teacherService?.delete(id).subscribe(this.loadTeachers);
  //   //הגירסא המקומית
  //   this.dataService.teachers.splice(i, 1)
  //   // this.dataService.updateTeacher(i, this.teachers);
  // }

  // addTeacher(): void {


  //   const dialogRef = this.dialog.open(NewTeacherComponent, {
  //     width: '500px',
  //     height: '1000px'
  //   })
  //   dialogRef.afterClosed().subscribe(result => {
  //     if (result) {
  //       //הגירסא האמיתית
  //       // this.teacherService?.create(result)
  //       //הגירסא המקומית
  //       console.log(result);
  //       this.dataService.teachers.push(result);
  //       this.loadTeachers()
  //     }
  //   });
  // }


  // editSubjectsToTeacher(teacher: Object, index: number) {
  //   const dialogRef = this.dialog.open(SubjectsToTeacherComponent, {
  //     data: { editedTeacher: teacher },
  //     width: '500px',
  //     height: '1000px'
  //   })

  //   dialogRef.afterClosed().subscribe(result => {
  //     if (result) {
  //       this.dataService.updateTeacher(index, result);
  //     }
  //   });

  }

}

