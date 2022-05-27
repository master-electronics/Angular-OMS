import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IconsProviderModule } from '../../icons-provider.module';

import { SharedComponentModule } from '../../components/shared-component.module';
import { SharedUtilityModule } from '../../shared/shared-utility.module';

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
import { OrderTasktimeComponent } from './order-tasktime/order-tasktime.component';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { NzSpinModule } from 'ng-zorro-antd/spin';

import { TableViewsComponent } from './table-views.component';
import { ITNViewComponent } from './order-view/itn-view.component';
import { WmsStatusComponent } from './wms-countby-status/wms-status.component';
import { OrderListComponent } from './wms-countby-status/order-list.component';
import { EventLogComponent } from './event-log/event-log.component';
import { TableViewsRoutingModule } from './table-views.routing';
import { OrderViewComponent } from './order-view/order-view.component';
import { TaskCounterComponent } from './task-counter/task-counter.component';
import { HoldOnCounterComponent } from './hold-on-counter/hold-on-counter.component';
import { ITNLifecycleComponent } from './itn-lifecycle/itn-lifecycle.component';
import { ColumnSelectorComponent } from './itn-lifecycle/column-selector.component';
import { LevelSelectorComponent } from './itn-lifecycle/level-selector.component';
import { LevelSliderComponent } from './itn-lifecycle/level-slider.component';
import { TabsViewComponent } from './itn-lifecycle/tabs-view.component';
import { TemplateSettings } from './itn-lifecycle/template-settings.component';

@NgModule({
  declarations: [
    TableViewsComponent,
    WmsStatusComponent,
    OrderListComponent,
    OrderViewComponent,
    ITNViewComponent,
    EventLogComponent,
    TaskCounterComponent,
    OrderTasktimeComponent,
    HoldOnCounterComponent,
    ITNLifecycleComponent,
    ColumnSelectorComponent,
    LevelSelectorComponent,
    LevelSliderComponent,
    TabsViewComponent,
    TemplateSettings
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SharedUtilityModule,
    SharedComponentModule,
    TableViewsRoutingModule,
    NzInputModule,
    NzTableModule,
    NzDropDownModule,
    NzButtonModule,
    IconsProviderModule,
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
  bootstrap: [TableViewsComponent],
})
export class TableViewsModule {}
