import { CommonModule } from '@angular/common';
import { Component, OnInit, ChangeDetectionStrategy, inject, signal, Inject } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { DataService } from '../../services/data.service';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatDialogRef, MatDialog } from '@angular/material/dialog';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-new-teacher',
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
    MatDividerModule, MatFormFieldModule, MatSelectModule
  ],
  templateUrl: './new-teacher.component.html',
  styleUrl: './new-teacher.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NewTeacherComponent implements OnInit {
  // constructor(private dataService: DataService) {}
  // ngOnInit(): void {
  //   this.getTeachers();
  // }
  classes: string[] = ["א", "ב", "ג", "ד", "ה", "ו", "ז", "ח"]
  dayes: string[] = ['ראשון', 'שני', 'שלישי', 'רביעי', 'חמישי', 'שישי']
  // thisSubject=''
  // toppings = new FormControl(['']);
  // data:any
  // ======readonly dialogRef = inject(MatDialogRef<NewTeacherComponent>);
  //========= dataService = inject(DataService);
  subjects: string[] = []
  backgroundImage: string = 'images/person.png';
  formGroup: FormGroup = {} as FormGroup;
  subjectsList = new FormArray<FormControl<string | null>>([]);
  classesList = new FormArray<FormControl<Array<string> | null>>([]);
  dayesList = new FormArray<FormControl<Array<string> | null>>([]);
  errorMessage = signal('');
  email = new FormControl('', [Validators.email]);
  tutor = false;
  teachers: any
  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
    private formBuilder: FormBuilder,
    private dataService: DataService,
    private dialogRef: MatDialogRef<NewTeacherComponent>
  ) {
    console.log("111111111111", data);
  }

  ngOnInit() {
    this.getTeachers();
    this.initForm();
    setTimeout(() => {
      this.subjects = this.dataService.subjects;
    }, 5000)
    // console.log(this.subjects);
    // if(this.data){
    //   console.log(this.data);
    // }
  }

  getTeachers(): void {
    this.teachers = this.dataService.getTeachers();
  }

  protected readonly value = signal('');
  protected onInput(event: Event) {
    this.value.set((event.target as HTMLInputElement).value);
  }

  initForm() {
    if (this.data != null) {
      this.formGroup = this.formBuilder.group({
        firstname: [this.data.editedTeacher.firstname, [Validators.required]],
        lastname: [this.data.editedTeacher.lastname, [Validators.required]],
        tel: [this.data.editedTeacher.tel, [Validators.required]],
        id: [this.data.editedTeacher.id, [Validators.required, Validators.pattern('[0-9]*'), Validators.maxLength(9)]],
        is_tutor: [this.data.editedTeacher.is_tutor, [Validators.required]],
        amount_of_hours: [this.data.editedTeacher.amount_of_hours, [Validators.required]],
        class: [this.data.editedTeacher.class, []],
        number_of_class: [this.data.editedTeacher.number_of_class, []],
        // subjects: this.data.editedTeacher.subjects,
        // classes_of_subject: this.data.editedTeacher.classes_of_subject        subjects: this.subjectsList,
        subjects: this.subjectsList,
        classes_of_subject: this.classesList
      })
      // for (let i = 0; i < this.data.editedTeacher.subjects.length; i++) {
      //   this.subjectsList.push( new FormControl(this.data.editedTeacher.subjects[i],[Validators.required]));
      // };
    }
    else {
      this.formGroup = this.formBuilder.group({
        firstname: ['', [Validators.required]],
        lastname: ['', [Validators.required]],
        tel: ['', [Validators.required]],
        id: ['', [Validators.required, Validators.pattern('[0-9]*'), Validators.maxLength(9)]],
        is_tutor: ['', [Validators.required]],
        amount_of_hours: ['', [Validators.required]],
        class: ['', []],
        number_of_class: ['', []],
        subjects: this.subjectsList,
        classes_of_subject: this.classesList
      });
    }
    this.subjectsList.insert(0, new FormControl(this.subjects[0]));
    this.classesList.insert(0, new FormControl());
    console.log(this.formGroup);
  }

  open_the_class() {
    this.tutor = true
    console.log("aaaa");
    console.log(this.tutor);
  }

  close_the_class() {
    this.tutor = false
    console.log("bbbb");
    console.log(this.tutor);
  }

  updateErrorMessage() {
    if (this.email.hasError('required')) {
      this.errorMessage.set('חובה למלא את השדה');
    } else if (this.email.hasError('email')) {
      this.errorMessage.set('כתובת מייל לא תקינה');
    } else {
      this.errorMessage.set('');
    }
  }

  save() {
    //     if (this.data) {
    //       console.log(this.dataService.teachers);
    //       // console.log(this.formGroup.value.id);
    //       this.dataService.teachers[this.data.i] = {...this.formGroup.value}
    //     //  this.dataService.setTeachers(this.dataService.teachers.map(obj => 
    //     //     obj.id === this.formGroup.value.id ? this.formGroup.value:obj
    //     //   ))
    //       console.log(this.dataService.teachers);
    //     }
    //     else{
    //       this.dataService.teachers.push(this.formGroup.value)
    //     }
    //     const exists = this.dataService.teachers.some(obj => obj.id === this.formGroup.value.id);
    // console.log(exists)
    this.dialogRef.close(this.formGroup.value);
    console.log(this.dataService.teachers);
    console.log('value: ', this.formGroup);
    console.log(this.formGroup.value.subjects);
  }

  addSubject() {
    this.subjectsList.push(new FormControl());
    this.classesList.push(new FormControl(['']))
    // console.log(this.classesList);
  }

}
