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
      {
        path: 'info',
        loadComponent: () =>
          import('./feature/info.component').then((m) => m.InfoComponent),
      },
      {
        path: 'quantity',
        loadComponent: () =>
          import('./feature/quantity.component').then(
            (m) => m.QuantityComponent
          ),
      },
      {
        path: 'comment',
        loadComponent: () =>
          import('./feature/comment.component').then((m) => m.CommentComponent),
      },
      {
        path: 'isempty',
        loadComponent: () =>
          import('./feature/is-empty.component').then(
            (m) => m.IsEmptyComponent
          ),
      },
      {
        path: 'isshort',
        loadComponent: () =>
          import('./feature/is-short.component').then(
            (m) => m.IsShortComponent
          ),
      },
    ],
  },
];
