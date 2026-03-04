import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { NavbarComponent } from '../../navbar/navbar.component';
import { MatDialog } from '@angular/material/dialog';
import { TeacherFormComponent } from '../../forms/teacher-form/teacher-form.component';

@Component({
  selector: 'app-teacher',
  imports: [CommonModule, RouterModule, NavbarComponent],
  templateUrl: './teacher.component.html',
  styleUrl: './teacher.component.scss'
})
export class TeacherComponent implements OnInit {
  router = inject(Router)
  name: string = '';
  message: string = ``;
  urlLogo: string = "pict.jpg"
  readonly dialog = inject(MatDialog);

  ngOnInit(): void {
    this.name = history.state.teacherName;
    this.message = `  שלום למורה ${this.name}  `;
  }

  exit(): void {
    this.router.navigate(['/start'])
  }

  formTeacher(): void {
    const dialogRef = this.dialog.open(TeacherFormComponent, {
      width: '500px',
      height: '1000px'
    })
  }

}


