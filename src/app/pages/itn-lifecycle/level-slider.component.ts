import { Component, Output, EventEmitter, Input } from '@angular/core';

import { NzMarks, NzSliderModule } from 'ng-zorro-antd/slider';
import { Subject } from 'rxjs';
import { NgStyle } from '@angular/common';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { FormsModule } from '@angular/forms';
import { NzGridModule } from 'ng-zorro-antd/grid';

@Component({
  selector: 'level-slider',
  template: `
    <nz-row>
      <nz-col nzSpan="17">
        <nz-slider
          [nzIncluded]="false"
          [(ngModel)]="hourValue"
          [nzMin]="0"
          [nzMax]="24"
          [nzStep]="1"
          [nzTipFormatter]="hourFormatter"
          (nzOnAfterChange)="levelChange()"
        ></nz-slider>
      </nz-col>
      <div nz-col nzSpan="7">
        <input
          style="display: none; visibility: hidden;"
          type="text"
          id="hourTB"
          #hourV
          [(ngModel)]="hourValue"
          (ngModelChange)="levelChange()"
        />
        <nz-input-number
          [nzMin]="0"
          [nzMax]="24"
          [ngStyle]="{
            marginLeft: '10px',
            display: 'inline-block',
            width: '60px'
          }"
          [(ngModel)]="hourValue"
          (ngModelChange)="levelChange()"
        ></nz-input-number>
        hours
      </div>
    </nz-row>
    <nz-row>
      <nz-col nzSpan="17">
        <nz-slider
          [nzIncluded]="false"
          [(ngModel)]="minuteValue"
          [nzMin]="0"
          [nzMax]="60"
          [nzStep]="1"
          [nzTipFormatter]="minuteFormatter"
          (nzOnAfterChange)="levelChange()"
        ></nz-slider>
      </nz-col>
      <div nz-col nzSpan="7">
        <input
          style="display: none; visibility: hidden;"
          type="text"
          id="minutesTB"
          #minuteV
          [(ngModel)]="minuteValue"
          (ngModelChange)="levelChange()"
        />
        <nz-input-number
          [ngStyle]="{
            marginLeft: '10px',
            display: 'inline-block',
            width: '60px'
          }"
          [nzMin]="0"
          [nzMax]="60"
          [(ngModel)]="minuteValue"
          (ngModelChange)="levelChange()"
        ></nz-input-number>
        minutes
      </div>
    </nz-row>
    <nz-row>
      <nz-col nzSpan="17">
        <nz-slider
          [nzIncluded]="false"
          [(ngModel)]="secondValue"
          [nzMin]="0"
          [nzMax]="60"
          [nzStep]="1"
          [nzTipFormatter]="secondFormatter"
          (nzOnAfterChange)="levelChange()"
        ></nz-slider>
      </nz-col>
      <div nz-col nzSpan="7">
        <input
          style="display: none; visibility: hidden;"
          type="text"
          id="secondsTB"
          #secondV
          [(ngModel)]="secondValue"
          (ngModelChange)="levelChange()"
        />
        <nz-input-number
          [ngStyle]="{
            marginLeft: '10px',
            display: 'inline-block',
            width: '60px'
          }"
          [nzMin]="0"
          [nzMax]="60"
          [(ngModel)]="secondValue"
          (ngModelChange)="levelChange()"
        ></nz-input-number>
        seconds
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
  standalone: true,
  imports: [
    NzGridModule,
    NzSliderModule,
    FormsModule,
    NzInputNumberModule,
    NgStyle,
  ],
})
export class LevelSliderComponent {
  @Input() levelSubject: Subject<any>;
  @Output() levelEvent = new EventEmitter<number>();
  hourValue;
  minuteValue;
  secondValue;

  ngOnInit(): void {
    //subscribe to tabs-view Subject to receive level limit changes
    this.levelSubject.subscribe((data) => {
      //convert milliseconds to hours, minutes, and seconds
      const hrs = Math.trunc(Number(data) / 3600000);
      const mins = Math.trunc((Number(data) - hrs * 3600000) / 60000);
      const secs = Math.trunc(
        (Number(data) - (hrs * 3600000 + mins * 60000)) / 1000
      );

      //set hourValue, minuteValue, and secondValue, used to adjust slider value
      this.hourValue = hrs;
      this.minuteValue = mins;
      this.secondValue = secs;
    });
  }

  //format tip displayed for hour slider
  hourFormatter(value: number): string {
    return `${value}hrs`;
  }

  //format tip displayed for minute slider
  minuteFormatter(value: number): string {
    return `${value}mins`;
  }

  //format tip displayed for second slider
  secondFormatter(value: number): string {
    return `${value}secs`;
  }

  //when limit level changed convert hours and minutes to milliseconds
  //emit milliseconds to tabs-view
  levelChange(): void {
    let hours = Number(this.hourValue);
    let minutes = Number(this.minuteValue);
    let seconds = Number(this.secondValue);

    if (Number.isNaN(hours)) {
      hours = 0;
    }

    if (Number.isNaN(minutes)) {
      minutes = 0;
    }

    if (Number.isNaN(seconds)) {
      seconds = 0;
    }

    const limit = hours * 60 * 60 * 1000 + minutes * 60 * 1000 + seconds * 1000;

    this.levelEvent.emit(limit);
  }

  ngOnDestroy(): void {
    //this.levelSubject.unsubscribe();
  }
}
