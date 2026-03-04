import { Component, OnInit, inject } from '@angular/core';
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
import { DeleteWindowComponent } from '../delete-window/delete-window.component';
import { NavbarComponent } from '../navbar/navbar.component';
import { Router } from '@angular/router';


@Component({
  selector: 'app-teachers-table',
  imports: [CommonModule, NavbarComponent],
  templateUrl: './teachers-table.component.html',
  styleUrl: './teachers-table.component.scss'
})
export class TeachersTableComponent implements OnInit {
  // constructor(private dialog: MatDialog) {}
  // readonly dialog = inject(MatDialog);
  router = inject(Router)
  classes = ['מורה מקצועית', 'א', 'ב', 'ג', 'ד', 'ה', 'ו', 'ז', 'ח']
  teachers: Teacher[] = [];
  teacherService: GenericService<Teacher> | undefined;//הצהרה על סרויס מסוג ספר
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

  exit(): void {
    this.router.navigate(['/admin'])
  }

  constructor(private dataService: DataService, private dialog: MatDialog, private http: HttpClient) {


    this.teacherService = new GenericService<Teacher>(http, ApiEndpoints.teacher); //איתחול הסרויס

  }

  ngOnInit(): void {
    this.loadTeachers();

  }

  loadTeachers(): void {
    //הגירסא האמיתית
    // this.teacherService?.getAll().subscribe(teachers => this.teachers = teachers);
    //הגירסא המקומית
    this.teachers = this.dataService.teachers

  }
  editTeacher(teacher: Teacher, index: number) {
    const dialogRef = this.dialog.open(NewTeacherComponent, {
      data: { editedTeacher: teacher, i: index },
      width: '500px',
      height: '1000px'
    })

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        //הגירסא האמיתית
        // this.teacherService?.update(teacher.id, teacher).subscribe(this.loadTeachers);
        //הגירסא המקומית
        this.dataService.updateTeacher(index, result);
      }
    });
  }

  deleteTeacher(id: string, i: number, teacher: Teacher) {
    const dialogRef = this.dialog.open(DeleteWindowComponent, {
      data: { firstname: teacher.firstname, lastname: teacher.lastname, object: "מורה" },
      width: '350px',
      height: '100px'
    })

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        //הגירסא האמיתית
        // this.teacherService?.delete(id).subscribe(this.loadTeachers);
        //הגירסא המקומית
        this.dataService.teachers.splice(i, 1)
        // this.dataService.updateTeacher(i, this.teachers);
      }
    });

  }

  addTeacher(): void {


    const dialogRef = this.dialog.open(NewTeacherComponent, {
      width: '500px',
      height: '1000px'
    })
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        //הגירסא האמיתית
        // this.teacherService?.create(result)
        //הגירסא המקומית

        console.log(result);
        this.dataService.teachers.push(result);
        this.loadTeachers()
      }
    });
  }


  editSubjectsToTeacher(teacher: Object, index: number) {
    const dialogRef = this.dialog.open(SubjectsToTeacherComponent, {
      data: { editedTeacher: teacher },
      width: '500px',
      height: '1000px'
    })

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.dataService.updateTeacher(index, result);
      }
    });

  }

}
