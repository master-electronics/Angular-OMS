import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ManagerToolsComponent } from './manager-tools.component';

const routes: Routes = [
  { path: '', component: ManagerToolsComponent },
  { path: 'userzone', component: TableViewsComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TableViewsRoutingModule {}
