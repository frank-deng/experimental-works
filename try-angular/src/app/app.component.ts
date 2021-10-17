import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'try-angular';
  displayTimer = false;
  switchTimeDisp(){
    this.displayTimer=!this.displayTimer;
  }
}
