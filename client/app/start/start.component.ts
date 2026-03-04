import { AfterViewInit, Component, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { LoginComponent } from '../school/login/login.component';
import { MatGridListModule } from '@angular/material/grid-list';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { NavbarComponent } from '../navbar/navbar.component';

@Component({
  selector: 'app-start',
  imports: [MatGridListModule, NavbarComponent],
  templateUrl: './start.component.html',
  styleUrl: './start.component.scss',
})


export class StartComponent implements AfterViewInit {
  readonly dialog = inject(MatDialog);
  urlLogo: string = "pict.jpg"
  openDialog(): void {
    const dialogRef = this.dialog.open(LoginComponent)
  }
  name= "מערכת שעות";
  massage1='';
  massage2='מערכת שעות ';
  massage3='';

  arr: number[] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
  page = "des.jpg";
  count=0
  ngAfterViewInit() {
    let randomNumber = 0
    
      setInterval(() => {
        randomNumber = Math.ceil((Math.random() * (this.arr.length-1)));
        this.arr[randomNumber] = 1
        this.count++;
        if(this.count>70){
          this.count=0;
          this.arr=[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
        }
      }, 50);
    
  
      this.arr[0]=1
      setTimeout(()=>{this.massage2="תחסכו בשעות תקבלו מערכת"},1000)
      setTimeout(()=>{this.massage1="מ-ו-ש-ל-מ-ת"},3000)
      // setTimeout(()=>{this.massage2="בול למטרה שלכם"},5000)
    }


}


