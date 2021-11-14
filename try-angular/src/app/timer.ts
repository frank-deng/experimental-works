import { Component, OnDestroy, OnInit } from '@angular/core';

@Component({
  selector: 'frank-timer',
  templateUrl: './timer.html'
})
export class FrankTimer implements OnInit, OnDestroy {
  title = 'try-angular';
  currentTime = '';
  intervalHandler:any = null;
  ngOnInit(){
    this.updateTime();
      this.intervalHandler=setInterval(()=>{
        this.updateTime();
      },100);
  }
  updateTime(){
    this.currentTime=new Date().toUTCString();
  }
  ngOnDestroy(){
      clearInterval(this.intervalHandler);
  }
}
