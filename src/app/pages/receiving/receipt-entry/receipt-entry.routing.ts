import { NgModule } from '@angular/core';
import { NgModel } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { ReceiptEntry } from './receipt-entry.component';

const routes: Routes = [{ path: '', component: ReceiptEntry }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReceiptEntryRoutingModule {}
