import { Component, OnInit, inject } from '@angular/core';
// import { NewTeacherComponent } from '../forms/new-teacher/new-teacher.component';
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
import { Class } from '../models/class';
import { NewClassComponent } from '../forms/new-class/new-class.component';
import { LessonsTableComponent } from '../lessons-table/lessons-table.component';
import { DeleteWindowComponent } from '../delete-window/delete-window.component';
import { ButtonsComponent } from '../school/buttons/buttons.component';
import { Router } from '@angular/router';
import { NavbarComponent } from '../navbar/navbar.component';

@Component({
  selector: 'app-classes-table',
  imports: [ButtonsComponent, NavbarComponent,NavbarComponent],
  templateUrl: './classes-table.component.html',
  styleUrl: './classes-table.component.scss'
})
export class ClassesTableComponent {
 router = inject(Router);
  names_of_classes = ['מורה מקצועית', 'א', 'ב', 'ג', 'ד', 'ה', 'ו', 'ז', 'ח']
  classes: Class[] = [  ]
  teachers: Teacher[] = [];
  teacherService: GenericService<Teacher> | undefined;//הצהרה על סרויס מסוג מורה
  classService: GenericService<Class> | undefined;//הצהרה על סרויס מסוג כיתה
  x: Class = {grade:0, number_of_class: 0, id:0, tutor:'', maxLessons:5}
  teacher1: Teacher =
    {
      firstname: "ליבי",
      lastname: "זיידנפלד",
      tel: "0548504147",
      id: "323903765",
      is_tutor: true,
      amount_of_hours: 35,
      class: 8,
      number_of_class: 2,
    }
  // 
  constructor(private dataService: DataService, private dialog: MatDialog, private http: HttpClient) {


    // this.teacherService = new GenericService<Teacher>(http, ApiEndpoints.teacher); //איתחול הסרויס
    // this.classService = new GenericService<Class>(http, ApiEndpoints.class); //איתחול הסרויס
  }

  ngOnInit(): void {
    // this.loadTeachers();
    this.loadClasses();
  }

  exit(): void {
    this.router.navigate(['/admin'])
  }

  update():void{
 
      this.router.navigate(['/settings'])
  
  }

  // loadTeachers(): void {
  //   //הגירסא האמיתית
  //   this.teacherService?.getAll().subscribe(teachers => this.teachers = teachers);
  //   //הגירסא המקומית
  //   this.teachers = this.dataService.teachers

  // }
  loadClasses(): void {
    //הגירסא האמיתית
    // this.classService?.getAll().subscribe(this.allTheClasses => this.allTheClasses = this.classes);
    //הגירסא המקומית
    this.classes = this.dataService.Classes


  }
  // editTeacher(teacher: Teacher, index: number) {
  //   const dialogRef = this.dialog.open(NewTeacherComponent, {
  //     data: { editedTeacher: teacher, i: index },
  //     width: '500px',
  //     height: '1000px'
  //   })

  //   dialogRef.afterClosed().subscribe(result => {
  //     if (result) {
  //       //הגירסא האמיתית
  //       this.teacherService?.update(teacher.id, teacher).subscribe(this.loadTeachers);
  //       //הגירסא המקומית
  //       this.dataService.updateTeacher(index, result);
  //     }
  //   });
  // }

  deleteClass(id: number, i: number, my_class:Class ) {
    const dialogRef = this.dialog.open(DeleteWindowComponent, {
      data: { firstname:this.names_of_classes[my_class.grade], lastname:my_class.number_of_class, object:"כיתה" },
      width: '350px',
      height: '100px'
    })

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
    //הגירסא האמיתית
    // this.teacherService?.delete(id).subscribe(this.loadTeachers);
    //הגירסא המקומית
    this.dataService.Classes.splice(i, 1)
    // this.dataService.updateTeacher(i, this.teachers);
      }
    });

  }

  openTableByClass(id: number, i: number) {
    const dialogRef = this.dialog.open(LessonsTableComponent, {
      data:id,
      width: '3000px',
      height: '400px'
    })
    // dialogRef.afterClosed().subscribe(result => {
    //   if (result) {
    //     //הגירסא האמיתית
    //     // this.teacherService?.create(result)
    //     //הגירסא המקומית
    //     console.log(result);
    //     this.x = { grade: result.grade, number_of_class: result.number_of_class, id: (result.grade * 10 + result.number_of_class), tutor:"" }
    //     this.dataService.Classes.push(this.x);
    //     this.loadClasses()
    //   }
    // });

  }

  addClass(): void {


    const dialogRef = this.dialog.open(NewClassComponent, {
      width: '300px',
      height: '500px'
    })
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        //הגירסא האמיתית
        // this.teacherService?.create(result)
        //הגירסא המקומית
        console.log(result);
        this.x = { grade: result.grade, number_of_class: result.number_of_class, id: (result.grade * 10 + result.number_of_class), tutor:result.tutor_of_class,maxLessons:result.max_on_day }
        this.dataService.Classes.push(this.x);
        this.loadClasses()
      }
    });
  }


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

  // }

}


