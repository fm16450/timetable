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
import { DataService } from '../../services/data.service';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatDialogRef,  MatDialog} from '@angular/material/dialog';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';


@Component({
  selector: 'app-new-subject-to-teacher',
  imports: [],
  templateUrl: './new-subject-to-teacher.component.html',
  styleUrl: './new-subject-to-teacher.component.scss'
})
export class NewSubjectToTeacherComponent {
  classes = ["א", "ב", "ג", "ד", "ה", "ו", "ז", "ח"]
  // thisSubject=''

  // toppings = new FormControl(['']);
// data:any
  toppingList: string[] = ["א", "ב", "ג", "ד", "ה", "ו", "ז", "ח"];
  // readonly dialogRef = inject(MatDialogRef<NewTeacherComponent>);
  // dataService = inject(DataService);
  subjects: string[] = []
  backgroundImage: string = 'images/person.png';
  formGroup: FormGroup = {} as FormGroup;

  // subjectsList = new FormArray<FormControl<string | null>>([]);
  
  // classesList = new FormArray<FormControl<Array<string> | null>>([]);
  errorMessage = signal('');
  email = new FormControl('', [Validators.email]);
  tutor = false;
  constructor( @Inject(MAT_DIALOG_DATA) public data: any, 
  private formBuilder: FormBuilder,
   private dataService: DataService,
  
   ) {
    console.log("111111111111", data);
  }

  ngOnInit() {
    this.subjects = this.dataService.subjects;
  }

  initForm() {
    
      
      
      // for (let i = 0; i < this.data.editedTeacher.subjects.length; i++) {
      //   this.subjectsList.push( new FormControl(this.data.editedTeacher.subjects[i],[Validators.required]));
      // };
    

      this.formGroup = this.formBuilder.group({
        subject: ['', [Validators.required]],
 

  
      });
    
    

    console.log(this.formGroup);

  }
}
