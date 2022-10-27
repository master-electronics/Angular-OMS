import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { ReceiptEntry } from './receipt-entry.component';
import { ReceiptEntryRoutingModule } from './receipt-entry.routing';

import { SharedComponentModule } from 'src/app/components/shared-component.module';
import { SharedUtilityModule } from 'src/app/shared/shared-utility.module';

import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
@NgModule({
  declarations: [ReceiptEntry],
  imports: [
    CommonModule,
    FormsModule,
    ReceiptEntryRoutingModule,
    SharedComponentModule,
    SharedUtilityModule,
    NzInputModule,
    NzSelectModule,
    NzGridModule,
    NzButtonModule,
    NzDividerModule,
    NzIconModule,
    NzDatePickerModule,
  ],
})
export class ReceiptEntryModule {}
