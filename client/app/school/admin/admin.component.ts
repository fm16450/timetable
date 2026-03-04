import { Component, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { MatTabsModule } from '@angular/material/tabs';
import { TableComponent } from '../table/table.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ButtonsComponent } from '../buttons/buttons.component';
import { NavbarComponent } from '../../navbar/navbar.component';


@Component({
  selector: 'app-admin',
  imports: [
    RouterModule,
    MatTabsModule,
    TableComponent,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    ButtonsComponent,
    NavbarComponent
  ],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.scss'
})
export class AdminComponent {
  router = inject(Router);
  message: string = "שלום למזכירה"
  urlLogo: string = "pict.jpg"

}