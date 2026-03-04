import { Component } from '@angular/core';
import {MatTableModule} from '@angular/material/table';

export interface ScheduleElement {
  subjects:string[];
  position: string;
}

const ELEMENT_DATA: ScheduleElement[] = [
  {position: '1', subjects:['תורה','חשבון','אנגלית','אנגלית','נביא','התעמלות']},
  {position: '2', subjects:['תורה','חשבון','אנגלית','אנגלית','נביא','יהדות']},
  {position: '3', subjects:['תורה','חשבון','אנגלית','אנגלית','נביא','הסטוריה']},
  {position: '4', subjects:['תורה','חשבון','אנגלית','אנגלית','נביא','הנדסה']},
  {position: '5', subjects:['תורה','חשבון','אנגלית','אנגלית','נביא','חשבון']},
  {position: '6', subjects:['תורה','חשבון','אנגלית','אנגלית','נביא','']},
  {position: '7', subjects:['תורה','חשבון','אנגלית','אנגלית','נביא','']}
 
];

@Component({
  selector: 'app-table',
  imports: [MatTableModule],
  templateUrl: './table.component.html',
  styleUrl: './table.component.scss'
})

export class TableComponent {
  columnsName: string[] = ['שישי','חמישי','רביעי','שלישי','שני','ראשון','שיעור/יום'];
  dataSource = ELEMENT_DATA;

  

}
