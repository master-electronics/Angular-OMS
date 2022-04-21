import { Component, Input, EventEmitter, Output } from '@angular/core';
import { ColumnSelectorComponent } from './column-selector.component';
import { Column } from 'src/app/column';
import { ASTWithSource } from '@angular/compiler';
import { Subject } from 'rxjs';

@Component({
  selector: 'tabs-view',
  template: `
    <nz-tabset>
      <nz-tab [nzTitle]="'Selected Columns'"
      [nzForceRender]="true">
        <column-selector
          (checked)="onColumnSelected($event)"
          (unchecked)="onColumnUnselected($event)"
          (allChecked)="onAllColumnsSelected($event)"
          (allUnchecked)="onAllColumnsUnselected($event)"
          [columns]="columns"
          [selectedColumns]="selectedColumns"
          [allColumns]="allColumnsSelected"></column-selector>
      </nz-tab>
      <nz-tab [nzTitle]="'Highlight Limits'">
        <nz-tabset>
          <nz-tab [nzTitle]="'Pick'">
        <div nz-row style="padding-left: 5px;" nzAlign="middle">
          <div nz-col nzSpan="2">
            Low
          </div>
          <div nz-col nzSpan="20">
            <div style="height: 20px; width: 20px; background-color: yellow;"></div>
          </div>
        </div>
        <div nz-row style="padding-left: 5px;">
          <div nz-col nzSpan="24">
            <level-slider 
            (levelEvent)="pickLowEvent($event)"
            [levelSubject]="pickLowNotifier"></level-slider>
          </div>
        </div>
        <div nz-row style="padding-left: 5px;">
          <div nz-col nzSpan="3">
            Medium
          </div>
          <div nz-col nzSpan="20">
            <div style="height: 20px; width: 20px; background-color: orange;"></div>
          </div>
        </div>
        <div nz-row style="padding-left: 5px;">
          <div nz-col nzSpan="24">
            <level-slider 
              (levelEvent)="pickMediumEvent($event)"
              [levelSubject]="pickMediumNotifier"></level-slider>
          </div>
        </div>
        </nz-tab>
        <nz-tab [nzTitle]="'QC'">
        <div nz-row style="padding-left: 5px;" nzAlign="middle">
          <div nz-col nzSpan="2">
            Low
          </div>
          <div nz-col nzSpan="20">
            <div style="height: 20px; width: 20px; background-color: yellow;"></div>
          </div>
        </div>
        <div nz-row style="padding-left: 5px;">
          <div nz-col nzSpan="24">
            <level-slider 
              (levelEvent)="qcLowEvent($event)"
              [levelSubject]="qcLowNotifier"></level-slider>
          </div>
        </div>
        <div nz-row style="padding-left: 5px;">
          <div nz-col nzSpan="3">
            Medium
          </div>
          <div nz-col nzSpan="20">
            <div style="height: 20px; width: 20px; background-color: orange;"></div>
          </div>
        </div>
        <div nz-row style="padding-left: 5px;">
          <div nz-col nzSpan="24">
            <level-slider 
              (levelEvent)="qcMediumEvent($event)"
              [levelSubject]="qcMediumNotifier"></level-slider>
          </div>
        </div> 
        </nz-tab>
        <nz-tab [nzTitle]="'Aggregation'"> 
        <div nz-row style="padding-left: 5px;" nzAlign="middle">
          <div nz-col nzSpan="2">
            Low
          </div>
          <div nz-col nzSpan="20">
            <div style="height: 20px; width: 20px; background-color: yellow;"></div>
          </div>
        </div>
        <div nz-row style="padding-left: 5px;">
          <div nz-col nzSpan="24">
            <level-slider 
              (levelEvent)="agLowEvent($event)"
              [levelSubject]="agLowNotifier"></level-slider>
          </div>
        </div>
        <div nz-row style="padding-left: 5px;">
          <div nz-col nzSpan="3">
            Medium
          </div>
          <div nz-col nzSpan="20">
            <div style="height: 20px; width: 20px; background-color: orange;"></div>
          </div>
        </div>
        <div nz-row style="padding-left: 5px;">
          <div nz-col nzSpan="24">
            <level-slider 
              (levelEvent)="agMediumEvent($event)"
              [levelSubject]="agMediumNotifier"></level-slider>
          </div>
        </div> 
        </nz-tab>
        <nz-tab  [nzTitle]="'Pulling'"> 
        <div nz-row style="padding-left: 5px;" nzAlign="middle">
          <div nz-col nzSpan="2">
            Low
          </div>
          <div nz-col nzSpan="20">
            <div style="height: 20px; width: 20px; background-color: yellow;"></div>
          </div>
        </div>
        <div nz-row style="padding-left: 5px;">
          <div nz-col nzSpan="24">
            <level-slider 
              (levelEvent)="pullLowEvent($event)"
              [levelSubject]="pullingLowNotifier"></level-slider>
          </div>
        </div>
        <div nz-row style="padding-left: 5px;">
          <div nz-col nzSpan="3">
            Medium
          </div>
          <div nz-col nzSpan="20">
            <div style="height: 20px; width: 20px; background-color: orange;"></div>
          </div>
        </div>
        <div nz-row style="padding-left: 5px;">
          <div nz-col nzSpan="24">
            <level-slider 
              (levelEvent)="pullMediumEvent($event)"
              [levelSubject]="pullingMediumNotifier"></level-slider>
          </div>
        </div> 
        </nz-tab>
        <nz-tab [nzTitle]="'Drop Off'">
        <div nz-row style="padding-left: 5px;" nzAlign="middle">
          <div nz-col nzSpan="2">
            Low
          </div>
          <div nz-col nzSpan="20">
            <div style="height: 20px; width: 20px; background-color: yellow;"></div>
          </div>
        </div>
        <div nz-row style="padding-left: 5px;">
          <div nz-col nzSpan="24">
            <level-slider 
              (levelEvent)="dropOffLowEvent($event)"
              [levelSubject]="dropoffLowNotifier"></level-slider>
          </div>
        </div>
        <div nz-row style="padding-left: 5px;">
          <div nz-col nzSpan="3">
            Medium
          </div>
          <div nz-col nzSpan="20">
            <div style="height: 20px; width: 20px; background-color: orange;"></div>
          </div>
        </div>
        <div nz-row style="padding-left: 5px;">
          <div nz-col nzSpan="24">
            <level-slider 
              (levelEvent)="dropOffMediumEvent($event)"
              [levelSubject]="dropoffMediumNotifier"></level-slider>
          </div>
        </div> 
        </nz-tab>
        </nz-tabset>     
      </nz-tab>
    </nz-tabset>
  `
})
export class TabsViewComponent {
  @Output() checked: EventEmitter<any> = new EventEmitter();
  @Output() unchecked: EventEmitter<any> = new EventEmitter();
  @Output() levelsUpdated: EventEmitter<any> = new EventEmitter();
  @Output() allChecked: EventEmitter<any> = new EventEmitter();
  @Output() allUnchecked: EventEmitter<any> = new EventEmitter();
  @Input('columns') columns: Column[];
  @Input('selectedColumns') selectedColumns: string[];
  @Input('allColumns') allColumnsSelected: boolean;
  //@Input('limits') limits;
  @Input() limitsNotifier: Subject<any>;
  //limits;
  pickLow;
  pickMedium;
  qcLow;
  qcMedium;
  agLow;
  agMedium;
  pullingLow;
  pullingMedium;
  dropoffLow;
  dropoffMedium;
  levelLimits = [];
  //test;
  value: string;

  pickLowNotifier: Subject<any> = new Subject<any>();
  pickMediumNotifier: Subject<any> = new Subject<any>();
  qcLowNotifier: Subject<any> = new Subject<any>();
  qcMediumNotifier: Subject<any> = new Subject<any>();
  agLowNotifier: Subject<any> = new Subject<any>();
  agMediumNotifier: Subject<any> = new Subject<any>();
  pullingLowNotifier: Subject<any> = new Subject<any>();
  pullingMediumNotifier: Subject<any> = new Subject<any>();
  dropoffLowNotifier: Subject<any> = new Subject<any>();
  dropoffMediumNotifier: Subject<any> = new Subject<any>();

  constructor() {}

  ngOnInit(): void {
    this.value = "";
    const l = this.value.length;

    this.limitsNotifier.subscribe((data) => {
      for(let i=0;i<data.length;i++) {
         this[data[i].eventName.toString().toLowerCase()+"LowNotifier"].next(data[i].lowLevelLimit);
         this[data[i].eventName.toString().toLowerCase()+"MediumNotifier"].next(data[i].mediumLevelLimit);

         this[data[i].eventName.toString().toLowerCase()+"Low"] = data[i].lowLevelLimit;
         this[data[i].eventName.toString().toLowerCase()+"Medium"] = data[i].mediumLevelLimit;
      }
    });

    //const test = "a";
  }

  // testA(): void {
  //   this.pickLow = 1000;
  //   alert(this.pickLow);
  // }
  
  // testC(): void {
  //   this.testN.subscribe((data) => {
  //     //alert("B-"+JSON.stringify(data));
  //     try {
  //     for(let i=0;i<data.length;i++) {
  //       //alert(JSON.stringify(data[i]));
  //        //this[data[i].eventName.toString().toLowerCase()+"Low"] = data[i].lowLevelLimit;
  //        //this[data[i].eventName.toString().toLowerCase()+"Medium"] = data[i].mediumLevelLimit;

  //        this[data[i].eventName.toString().toLowerCase()+"LowNotifier"] = data[i].lowLevelLimit;
  //        this[data[i].eventName.toString().toLowerCase()+"MediumNotifier"] = data[i].mediumLevelLimit;
  //     }
  //     }
  //     catch(error) {
  //       alert(error);
  //     }

  //     // this.pickLowNotifier.next(this.pickLow);
  //     // this.pickMediumNotifier.next(this.pickMedium);
  //     // this.qcLowNotifier.next(this.qcLow);
  //     // this.qcMediumNotifier.next(this.qcMedium);
  //     // this.agLowNotifier.next(this.agLow);
  //   });
  //   //alert("C-"+JSON.stringify(this.limits));
  // }

  onColumnSelected(e): void {
    this.checked.emit(e);
    // const i = this.columnsVisible.indexOf(e);if (i == -1) {
    //   this.columnsVisible.push(e);
    // }
  
    //this.setColSpans();
  }
  
  onColumnUnselected(e): void {
    this.unchecked.emit(e);
    // const i = this.columnsVisible.indexOf(e);
  
    // if (i > -1) {
    //   this.columnsVisible.splice(i, 1);
    // }
  
    // this.setColSpans();
  }

  onAllColumnsSelected(e): void {
    this.allChecked.emit(e);
  }

  onAllColumnsUnselected(e): void {
    this.allUnchecked.emit(e);
  }

  onLevelChange(): void {
    this.levelLimits = [];
    this.levelLimits.push({ eventName: "Pick", eventId: 301, lowLimit: (this.pickLow) ? this.pickLow : 0, mediumLimit: (this.pickMedium) ? this.pickMedium : 0 });
    this.levelLimits.push({ eventName: "QC", eventId: 200,  lowLimit: (this.qcLow) ? this.qcLow : 0, mediumLimit: (this.qcMedium) ? this.qcMedium : 0 });
    this.levelLimits.push({ eventName: "Ag", eventId: 1, lowLimit: (this.agLow) ? this.agLow : 0, mediumLimit: (this.agMedium) ? this.agMedium : 0 });
    this.levelLimits.push({ eventName: "Pulling", eventId: 400, lowLimit: (this.pullingLow) ? this.pullingLow : 0, mediumLimit: (this.pullingMedium) ? this.pullingMedium : 0 });
    this.levelLimits.push({ eventName: "DropOff", eventId: 500, lowLimit: (this.dropoffLow) ? this.dropoffLow : 0, mediumLimit: (this.dropoffMedium) ? this.dropoffMedium : 0 });

    this.levelsUpdated.emit(this.levelLimits);
  }

  pickLowEvent(e): void {
    this.pickLow = e;
    this.onLevelChange();
  }

  pickMediumEvent(e): void {
    this.pickMedium = e;
    this.onLevelChange();
  }

  qcLowEvent(e): void {
    this.qcLow = e;
    this.onLevelChange();
  }

  qcMediumEvent(e): void {
    this.qcMedium = e;
    this.onLevelChange();
  }

  agLowEvent(e): void {
    this.agLow = e;
    this.onLevelChange();
  }

  agMediumEvent(e): void {
    this.agMedium = e;
    this.onLevelChange();
  }

  pullLowEvent(e): void {
    this.pullingLow = e;
    this.onLevelChange();
  }

  pullMediumEvent(e): void {
    this.pullingMedium = e;
    this.onLevelChange();
  }

  dropOffLowEvent(e): void {
    this.dropoffLow = e;
    this.onLevelChange();
  }

  dropOffMediumEvent(e): void {
    this.dropoffMedium = e;
    this.onLevelChange();
  }

  ngOnDestroy() : void {
    //this.testN.unsubscribe();
  }
}