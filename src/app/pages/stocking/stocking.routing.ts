import { Routes } from '@angular/router';
import { SortingService } from './data/sorting';
import { SortLocationResolver } from './utils/resolver/sort-location.resolver';
import { StockingGuard } from './utils/stocking.guard';

export const StockingRoutes: Routes = [
  {
    path: '',
    providers: [SortingService, SortLocationResolver, StockingGuard],
    canActivateChild: [StockingGuard],
    loadComponent: () =>
      import('./shell.component').then((m) => m.StockingShell),
    children: [
      {
        path: 'menu',
        loadComponent: () =>
          import('./feature/menu.component').then((m) => m.MenuComponent),
      },
      { path: '', pathMatch: 'full', redirectTo: 'menu' },
      {
        path: 'sorting/itn',
        loadComponent: () =>
          import('./feature/sorting/scan-itn.component').then(
            (m) => m.ScanITNComponent
          ),
      },
      {
        path: 'sorting/location',
        resolve: { locations: SortLocationResolver },
        loadComponent: () =>
          import('./feature/sorting/location.component').then(
            (m) => m.LocationComponent
          ),
      },
    ],
  },
];
