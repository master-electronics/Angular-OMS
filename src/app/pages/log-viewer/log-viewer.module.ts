import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { NzInputModule } from 'ng-zorro-antd/input';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzListModule } from 'ng-zorro-antd/list';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzSliderModule } from 'ng-zorro-antd/slider';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { LogViewerComponent } from './log-viewer.component';
import { LogViewerRoutingModule } from './log-viewer.routing';

@NgModule({
  declarations: [LogViewerComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    LogViewerRoutingModule,
    NzInputModule,
    NzTableModule,
    NzDropDownModule,
    NzButtonModule,
    NzFormModule,
    NzListModule,
    NzCardModule,
    NzDatePickerModule,
    NzSelectModule,
    NzDividerModule,
    NzModalModule,
    NzSliderModule,
    NzTabsModule,
    NzInputNumberModule,
    NzRadioModule,
    NzSpinModule,
  ],
  bootstrap: [LogViewerComponent],
})
export class LogViewerModule {}
