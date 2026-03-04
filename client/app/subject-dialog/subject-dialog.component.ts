import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SubjectOfClasses } from '../models/subjectsOfClasses';
import { fromEvent } from 'rxjs';
import { Classes } from '../models/classes';

@Component({
  selector: 'app-subject-dialog',
  imports: [CommonModule,
    FormsModule,
    ReactiveFormsModule],
  templateUrl: './subject-dialog.component.html',
  styleUrl: './subject-dialog.component.scss'
})
export class SubjectDialogComponent implements OnInit{
  formGroup: FormGroup = {} as FormGroup;
  subList = new FormArray<FormControl<string | null>>([]);
  countList = new FormArray<FormControl<number | null>>([]);
  sub:string='';
  subjects:string[]=[]
  subjectOfClass:Classes=new Classes();



  constructor(private fb: FormBuilder) {
  //   this.formGroup = this.fb.group({
  //     sub: ['תורה'] // Pre-filled value
  //   });
  // }
  }

  onSubmit() {
    console.log(this.formGroup.value.sub[0]);
    console.log(this.formGroup.value.co[0]);
    // console.log(this.subList+" "+this.countList);
    console.log(this.subjectOfClass.subjectsOfClasses[0][0].subject);
    
  }

  ngOnInit() {

   
    this.initForm();
}

initForm(){
  console.log(this.subList+" "+this.countList);
 
  this.formGroup = this.fb.group({
    // subject:[''],
    // count:[''],
    sub:this.subList,
    co:this.countList

  });
  // this.subList.insert(0,new FormControl({subject:'תורה',count:4}));
  // this.subList.insert(1,new FormControl({subject:'נביא',count:2}));
  // this.subList.insert(2,new FormControl({subject:'חשבון',count:4}));
  // this.subList.insert(3,new FormControl({subject:'הנדסה',count:1}));
  this.subList.insert(0,new FormControl('תורה'))
   this.countList.insert(0,new FormControl(4));
  for (let i = 0; i < this.subjectOfClass.subjectsOfClasses[0].length; i++) {
    this.subList.push(new FormControl(this.subjectOfClass.subjectsOfClasses[0][0].subject));
    this.countList.push(new FormControl(this.subjectOfClass.subjectsOfClasses[0][0].count));
  }
  
 

}
removeSubject(index: number) {
  this.subList.removeAt(index);
}

addSubject() {
  this.subList.push(new FormControl(''));
}
}
