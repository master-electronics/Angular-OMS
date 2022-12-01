import { Routes } from '@angular/router';
import { SortingService } from './data/sorting';

export const StockingRoutes: Routes = [
  {
    path: '',
    providers: [SortingService],
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
        loadComponent: () =>
          import('./feature/sorting/sort-location.component').then(
            (m) => m.SortLocationComponent
          ),
      },
    ],
  },
];
