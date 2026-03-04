import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { NewTeacherComponent } from '../../forms/new-teacher/new-teacher.component';
import { NEVER, Observable } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import {FormControl, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {startWith, map} from 'rxjs/operators';
import { SettingsComponent } from '../../settings/settings.component';

@Component({
  selector: 'app-buttons',
  imports: [
    CommonModule,
     MatButtonModule,
      MatMenuModule,
      AsyncPipe,
      MatAutocompleteModule,
      MatInputModule,
      MatInputModule,
      FormsModule,
      ReactiveFormsModule,
    ],
  templateUrl: './buttons.component.html',
  styleUrl: './buttons.component.scss'
})
export class ButtonsComponent implements OnInit {
  router = inject(Router)
  readonly dialog = inject(MatDialog);
  butons: string[] = ['חיפוש', 'מורות', 'כיתות', 'חזרה','הגדרות מערכת'];
  teachersButtons: string[] = ['מורה חדשה', 'עריכת מורה'];

  control = new FormControl('');
  teachers: string[] = ['שרה כהן','לאה מנלה','רחל ליטמן','דינה וידסלבסקי','חנה מונדרי','חוה גרשנקורן','נעמה בן חמו','חיהלה פרידמן'];
  filteredTeachers: Observable<string[]>=NEVER;
  
  newTeacher(): void {
    const dialogRef = this.dialog.open(NewTeacherComponent, {
      width: '500px',
      height: '1000px'
    })
  }

  
  enterToTeachers(): void{
    this.router.navigate(['/teachers-table'])
  }

  enterToClasses(): void{
    this.router.navigate(['/classes-table'])
  }

  
  setings():void{
    this.router.navigate(['/settings'])
  }
  newClass() {

  }
  subjects() {

  }

  exit(): void {
    this.router.navigate(['/start'])
  }

  ngOnInit() {
    this.filteredTeachers = this.control.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value || '')),
    );
  }

  private _filter(value: string): string[] {
    const filterValue = this._normalizeValue(value);
    return this.teachers.filter(teacher => this._normalizeValue(teacher).includes(filterValue));
  }

  private _normalizeValue(value: string): string {
    return value.toLowerCase().replace(/\s/g, '');
  }
}



