import { Routes } from '@angular/router';
import { PickingService } from './data/picking.service';
import { PickingGuard } from './utils/picking.guard';
import { ItnResolver } from './utils/resolver/itn.resolver';

export const PickingRoutes: Routes = [
  {
    path: '',
    providers: [PickingGuard, ItnResolver, PickingService],
    canActivateChild: [PickingGuard],
    loadComponent: () =>
      import('./shell.component').then((m) => m.StockingShell),
    children: [
      {
        path: 'itn',
        resolve: { userContainer: ItnResolver },
        loadComponent: () =>
          import('./feature/itn.component').then((m) => m.ItnComponent),
      },
      { path: '', pathMatch: 'full', redirectTo: 'itn' },
    ],
  },
];
