import { Routes } from '@angular/router';
import { TabService } from 'src/app/shared/ui/step-bar/tab';
import { PickingService } from './data/picking.service';
import { PickingGuard } from './utils/picking.guard';
import { ItnResolver } from './utils/resolver/itn.resolver';

export const PickingRoutes: Routes = [
  {
    path: '',
    providers: [PickingGuard, ItnResolver, PickingService, TabService],
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
    ],
  },
];
