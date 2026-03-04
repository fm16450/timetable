import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { Component, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { SubjectDialogComponent } from '../subject-dialog/subject-dialog.component';
import { Classes } from '../models/classes';
import { NavbarComponent } from '../navbar/navbar.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-settings',
  imports: [FormsModule,
    ReactiveFormsModule,
    NavbarComponent
  ],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss'
})
export class SettingsComponent {
  router = inject(Router)
  readonly dialog = inject(MatDialog);
  subjectOfClass:Classes=new Classes();

  exit(): void {
    this.router.navigate(['/admin'])
  }

    setings():void{
     console.log(this.subjectOfClass.subjectsOfClasses[0][0].subject);
      
    const dialogRef = this.dialog.open(SubjectDialogComponent , {
      width: '500px',
      // height: '1000px'
    })
  }
}
