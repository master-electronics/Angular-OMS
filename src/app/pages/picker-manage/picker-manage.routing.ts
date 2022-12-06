import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EventTemplateComponent } from './eventTemplate.component';

const routes: Routes = [{ path: '', component: EventTemplateComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PickerManageRoutingModule {}
