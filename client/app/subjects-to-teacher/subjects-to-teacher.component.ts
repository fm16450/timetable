import { CommonModule } from '@angular/common';
import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  inject,
  signal,
  Inject,

} from '@angular/core';
import {
  FormArray, FormBuilder, FormControl, FormGroup,
  FormsModule, ReactiveFormsModule, Validators, AbstractControl,
} from '@angular/forms';
import {
  MatFormFieldModule, MAT_FORM_FIELD,
} from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { Subject } from 'rxjs';
import { merge } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { DataService } from '../services/data.service';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatDialogRef,  MatDialog} from '@angular/material/dialog';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NewSubjectToTeacherComponent } from '../forms/new-subject-to-teacher/new-subject-to-teacher.component';

import { NewTeacherComponent } from '../forms/new-teacher/new-teacher.component';

import { Dialog } from '@angular/cdk/dialog';
import { computeMsgId } from '@angular/compiler';





@Component({
  selector: 'app-subjects-to-teacher',
  imports: [CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatIconModule,
    MatSelectModule,
    MatButtonModule,
    MatDividerModule, MatFormFieldModule, MatSelectModule, ],
  templateUrl: './subjects-to-teacher.component.html',
  styleUrl: './subjects-to-teacher.component.scss'
})
export class SubjectsToTeacherComponent {

subjectsToTeachers:any
getSubjectsToTeachers(): any {
  // this.subjectsToTeachers = this.dataService.getSubjectToTeachers();
}
classes = ["א", "ב", "ג", "ד", "ה", "ו", "ז", "ח"]

constructor( @Inject(MAT_DIALOG_DATA) public data: any, 
 formBuilder: FormBuilder,
 private dataService: DataService,
  dialogRef: MatDialogRef<SubjectsToTeacherComponent>
  , private dialog: MatDialog
 ) {
  console.log("111111111111", data);
}

ngOnInit() {
 
  // this.getSubjectsToTeachers();
  // setTimeout(() => {
    // this.subjectsToTeachers = this.getSubjectsToTeachers();
   
    this.subjectsToTeachers = this.dataService.subjectsToTeachers
    // this.subjectsToTeachers = this.dataService.subjectsToTeachers.filter(s => s.teacherId===this.data.editedTeacher.id)
  //   console.log(this.dataService.subjectsToTeachers,this.data.editedTeacher.id );
  // }, 10)


//  this.subjectsToTeachers= [{teacherId: "323903765", subject: "תורה", class:5},
// {teacherId: "323903765", subject: "תורה", class:6},
// {teacherId: "323903765", subject: "תורה", class:7},
// {teacherId: "323903765", subject: "תורה", class:8},
// {teacherId: "323903765", subject: "חשבון", class:5},
// {teacherId: "323903765", subject: "חשבון", class:6},
// {teacherId: "323903765", subject: "דינים", class:6},
// {teacherId: "323903765", subject: "דינים", class:7},
// ]

  

}

protected readonly value = signal('');

protected onInput(event: Event) {
  this.value.set((event.target as HTMLInputElement).value);
}

addSubjectToTeacher(){
  const dialogRef = this.dialog.open(NewSubjectToTeacherComponent, {
    width: '100px',
    height: '100px'
  })
  dialogRef.afterClosed().subscribe(result => {
    if (result) {
      this.subjectsToTeachers.push(result);
      this.dataService.updateTeacher(this.subjectsToTeachers.length - 1, this.subjectsToTeachers);
    }
  });

}

deleteSubjectToTeacher(i:number){
this.dataService.subjectsToTeachers.splice(i,1)
}

}