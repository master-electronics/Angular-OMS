import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PartComponent } from './input-part/part.component';
import { ReceiptComponent } from './input-receipt/receipt.component';
import { ReceivingComponent } from './receiving.component';
import { VerifyComponent } from './verify/verify.component';

const routes: Routes = [
  {
    path: '',
    component: ReceivingComponent,
    children: [
      { path: 'receipt', component: ReceiptComponent },
      { path: 'part', component: PartComponent },
      { path: 'verify', component: VerifyComponent },
      { path: '', pathMatch: 'full', redirectTo: 'receipt' },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReceivingRoutingModule {}
