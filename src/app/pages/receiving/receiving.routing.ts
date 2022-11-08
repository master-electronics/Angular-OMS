import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ReceivingComponent } from './receiving.component';

const routes: Routes = [
  {
    path: '',
    component: ReceivingComponent,
    children: [
      {
        path: 'receipt',
        loadComponent: () =>
          import('./feature/receipt/receipt.component').then(
            (m) => m.ReceiptComponent
          ),
      },
      {
        path: 'part',
        loadComponent: () =>
          import('./feature/part/part.component').then((m) => m.PartComponent),
      },
      {
        path: 'verify',
        loadComponent: () =>
          import('./feature/verify/verify.component').then(
            (m) => m.VerifyComponent
          ),
      },
      {
        path: 'kickout',
        loadComponent: () =>
          import('./feature/kickout/kickout.component').then(
            (m) => m.KickoutComponent
          ),
      },
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
