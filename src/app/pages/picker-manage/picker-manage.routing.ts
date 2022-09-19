import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PickerManageComponent } from './picker-manage.component';

const routes: Routes = [{ path: '', component: PickerManageComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PickerManageRoutingModule {}
