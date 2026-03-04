import { Component, Inject } from '@angular/core';
import { MatDialogRef,  MatDialog} from '@angular/material/dialog';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-delete-window',
  imports: [],
  templateUrl: './delete-window.component.html',
  styleUrl: './delete-window.component.scss'
})
export class DeleteWindowComponent {
  constructor( @Inject(MAT_DIALOG_DATA) public data: any, 
  // private formBuilder: FormBuilder,
  //  private dataService: DataService,
   private dialogRef: MatDialogRef<DeleteWindowComponent>
   ) {
    // console.log("111111111111", data);
  }

  del(){
    this.dialogRef.close(true);

  }
  cancel(){
    this.dialogRef.close(false);

  }
}
