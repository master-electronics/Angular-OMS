import { NgModule } from '@angular/core';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { PickerManageRoutingModule } from './picker-manage.routing';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NzTableModule } from 'ng-zorro-antd/table';

import { PickerManageComponent } from './picker-manage.component';
import { DayViewSchedulerComponent } from './day-view-scheduler.component';

@NgModule({
  declarations: [PickerManageComponent, DayViewSchedulerComponent],
  imports: [
    NzTableModule,
    CommonModule,
    FormsModule,
    PickerManageRoutingModule,
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory,
    }),
  ],
  bootstrap: [PickerManageComponent],
})
export class PickerManageModule {}
