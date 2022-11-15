import { Routes, RouterModule } from '@angular/router';
import { ReceivingComponent } from './receiving.component';

export const ReceivingRoutes: Routes = [
  {
    path: '',
    component: ReceivingComponent,
    children: [
      {
        path: 'receipt',
        loadComponent: () =>
          import('./feature/receipt.component').then((m) => m.ReceiptComponent),
      },
      {
        path: 'part',
        loadComponent: () =>
          import('./feature/part/part.component').then((m) => m.PartComponent),
      },
      {
        path: 'part/verify',
        loadComponent: () =>
          import('./feature/part/verify.component').then(
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
        path: 'kickout/scanlabel',
        loadComponent: () =>
          import('./feature/kickout/label.component').then(
            (mod) => mod.LabelComponent
          ),
      },
      {
        path: 'kickout/location',
        loadComponent: () =>
          import('./feature/kickout/location.component').then(
            (mod) => mod.LocationComponent
          ),
      },
      {
        path: 'purchaseorder',
        loadComponent: () =>
          import('./feature/purchase-order/purchase-order.component').then(
            (mod) => mod.PurchaseOrderComponent
          ),
      },
      {
        path: 'purchaseorder/quantity',
        loadComponent: () =>
          import('./feature/purchase-order/quantity.component').then(
            (mod) => mod.QuantityComponent
          ),
      },
      {
        path: 'purchaseorder/label',
        loadComponent: () =>
          import('./feature/purchase-order/label.component').then(
            (mod) => mod.LabelComponent
          ),
      },
      {
        path: 'itn',
        loadComponent: () =>
          import('./feature/purchase-order/purchase-order.component').then(
            (mod) => mod.PurchaseOrderComponent
          ),
      },
      { path: '', pathMatch: 'full', redirectTo: 'receipt' },
    ],
  },
];
