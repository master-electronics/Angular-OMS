import { Component, Output, EventEmitter, Input } from '@angular/core';
//import { Form, FormBuilder } from '@angular/forms';

import { NzMarks } from 'ng-zorro-antd/slider';
import { Subject } from 'rxjs';

@Component({
  selector: 'level-slider',
  template: `
    <nz-row>
      <nz-col nzSpan="17">
        <nz-slider [nzIncluded]="false" [(ngModel)]="hourValue"
          [nzMin]="0" [nzMax]="24" [nzStep]="1"
          [nzTipFormatter]="hourFormatter" (nzOnAfterChange)="levelChange()"></nz-slider>
      </nz-col>
      <div nz-col nzSpan="7">
        <input style="display: none; visibility: hidden;" type="text" id="hourTB" #hourV [(ngModel)]="hourValue"  (ngModelChange)="levelChange()"/>        
        <nz-input-number
          [nzMin]="0" [nzMax]="24"
          [ngStyle]="{ 
            marginLeft: '10px',
            display: 'inline-block',
            width: '60px' }"
          [(ngModel)]="hourValue" (ngModelChange)="levelChange()"
        ></nz-input-number> hours
      </div>
    </nz-row>
    <nz-row>
      <nz-col nzSpan="17">
        <nz-slider [nzIncluded]="false" [(ngModel)]="minuteValue"
          [nzMin]="0" [nzMax]="60" [nzStep]="1"
          [nzTipFormatter]="minuteFormatter" (nzOnAfterChange)="levelChange()"
          ></nz-slider>
      </nz-col>
      <div nz-col nzSpan="7">
        <input style="display: none; visibility: hidden;" type="text" id="minutesTB" #minuteV [(ngModel)]="minuteValue" (ngModelChange)="levelChange()"/>
        <nz-input-number
          [ngStyle]="{ 
          marginLeft: '10px', 
          display: 'inline-block', 
          width: '60px' }" 
          [nzMin]="0" [nzMax]="60" 
          [(ngModel)]="minuteValue" (ngModelChange)="levelChange()"
        ></nz-input-number> minutes
      </div>
    </nz-row>
  `,
  styles: [
    `
      h4 {
        margin: 0 0 16px;
      }

      .ant-slider-with-marks {
        margin-bottom: 44px;
      }
    `,
  ],
})
export class LevelSliderComponent {
  //@Input('lowLevel') lowLevel: Number;
  //@Input('mediumLevel') mediumLevel: Number;
  @Input() levelSubject: Subject<any>
  @Output() levelEvent = new EventEmitter<number>();
  hourValue;
  minuteValue;

  constructor() {}

  ngOnInit(): void {
    // const hrs = Math.trunc(Number(this.lowLevel)/60000);
    // const mins = Math.trunc((Number(this.lowLevel)-(hrs*60000))/1000);

    // this.hourValue = hrs;
    // this.minuteValue = mins;
    //this.testC();

    this.levelSubject.subscribe((data) => {
      const hrs = Math.trunc(Number(data)/3600000);
      const mins = Math.trunc((Number(data)-(hrs*3600000))/60000);

      this.hourValue = hrs;
      this.minuteValue = mins;
    })
  }

  // testC() {
  //   this.levelSubject.subscribe((data) => {
  //     const hrs = Math.trunc(Number(data)/60000);
  //     const mins = Math.trunc((Number(data)-(hrs*60000))/1000);

  //     this.hourValue = hrs;
  //     this.minuteValue = mins;
  //   })
  // }

  hourFormatter(value: number): string {
    return `${value}hrs`;
  }

  minuteFormatter(value: number): string {
    return `${value}mins`;
  }

  levelChange() {
    let hours = Number(this.hourValue);
    let minutes = Number(this.minuteValue);
      
    
    if (Number.isNaN(hours)) {
      hours = 0;
    }

    if (Number.isNaN(minutes)) {
      minutes = 0;
    }

    const limit = (hours*60*60*1000) + (minutes*60*1000);

    this.levelEvent.emit(limit);
  }

  ngOnDestroy() {
    this.levelSubject.unsubscribe();
  }
}
