import { Component, inject } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { Router, RouterModule } from '@angular/router';


@Component({
  selector: 'app-school',
  imports: [MatTabsModule, RouterModule],
  templateUrl: './school.component.html',
  styleUrl: './school.component.scss'
})
export class SchoolComponent {
  router = inject(Router)
  name: string = ''
  
  
}
