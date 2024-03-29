import { NgModule } from '@angular/core';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { PickerManageRoutingModule } from './picker-manage.routing';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzTimePickerModule } from 'ng-zorro-antd/time-picker';
import { NzMessageModule } from 'ng-zorro-antd/message';

import { EventTemplateComponent } from './eventTemplate.component';
import { DayViewSchedulerComponent } from './day-view-scheduler.component';

@NgModule({
  declarations: [EventTemplateComponent],
  imports: [
    NzButtonModule,
    NzTableModule,
    NzSelectModule,
    NzInputModule,
    NzTimePickerModule,
    NzMessageModule,
    CommonModule,
    FormsModule,
    PickerManageRoutingModule,
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory,
    }),
    DayViewSchedulerComponent,
  ],
  bootstrap: [EventTemplateComponent],
})
export class PickerManageModule {}
