import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit {
  router = inject(Router);
  mouseoverLogin: boolean = false;
  message: string = '';
  formGroup: FormGroup = {} as FormGroup;
  users: Map<string, string> = new Map;

  readonly dialogRef = inject(MatDialogRef<LoginComponent>);

  constructor(private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.formGroup = this.formBuilder.group({
      username: this.formBuilder.control(''),
      password: this.formBuilder.control('')
    });
    this.users.set("שרה", "s123");
    this.users.set("גילה", "g123");
    this.users.set("חיה", "c123");
  }

  login(): void {
    this.message = ''
    const obj = this.formGroup.value;
    const { username, password } = this.formGroup.value;
    localStorage.setItem('login', JSON.stringify({ username, password }))
    let new_password = this.users.get(username);
    if (username == 'm123' && password == 123) {
      this.dialogRef.close();
      this.router.navigate(['/admin'])
    }
    else
      if (new_password === password) {
        this.dialogRef.close();
        this.router.navigate(['/teacher'], { state: { teacherName: username } });
      }
      else {
        this.message = 'אמצעי זיהוי לא תקין נא נסה שוב'
      }
  }


}
