import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PartComponent } from './feature/part/part.component';
import { ReceiptComponent } from './feature/receipt/receipt.component';
import { KickoutComponent } from './feature/kickout/kickout.component';
import { ReceivingComponent } from './receiving.component';
import { VerifyComponent } from './feature/verify/verify.component';

const routes: Routes = [
  {
    path: '',
    component: ReceivingComponent,
    children: [
      { path: 'receipt', component: ReceiptComponent },
      { path: 'part', component: PartComponent },
      { path: 'verify', component: VerifyComponent },
      { path: 'kickout', component: KickoutComponent },
      {
        path: 'kickout/location',
        loadComponent: () =>
          import('./feature/kickout/location/location.component').then(
            (mod) => mod.LocationComponent
          ),
      },
      {
        path: 'kickout/part',
        loadComponent: () =>
          import('./feature/kickout/part/part.component').then(
            (mod) => mod.PartComponent
          ),
      },
      { path: '', pathMatch: 'full', redirectTo: 'receipt' },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReceivingRoutingModule {}
