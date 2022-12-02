import { Routes } from '@angular/router';
import { SortLocationResolver } from './data/resolver/sort-location.resolver';
import { SortingService } from './data/sorting';

export const StockingRoutes: Routes = [
  {
    path: '',
    providers: [SortingService, SortLocationResolver],
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
