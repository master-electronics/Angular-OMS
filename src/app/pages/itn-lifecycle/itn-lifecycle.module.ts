import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ITNLifecycleRoutingModule } from './itn-lifecycle.routing';

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
import { NzIconModule } from 'ng-zorro-antd/icon';

import { ITNLifecycleComponent } from './itn-lifecycle.component';
import { ColumnSelectorComponent } from './column-selector.component';
import { LevelSelectorComponent } from './level-selector.component';
import { LevelSliderComponent } from './level-slider.component';
import { TabsViewComponent } from './tabs-view.component';
import { TemplateSettings } from './template-settings.component';

@NgModule({
  declarations: [
    ITNLifecycleComponent,
    ColumnSelectorComponent,
    LevelSelectorComponent,
    LevelSliderComponent,
    TabsViewComponent,
    TemplateSettings,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
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
    ITNLifecycleRoutingModule,
    NzIconModule,
  ],
})
export class ITNLifeCycleModule {}
