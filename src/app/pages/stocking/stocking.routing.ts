import { Routes } from '@angular/router';
import { SortingService } from './data/sorting.service';
import { StockingService } from './data/stocking.service';
import { SuggestLocationsService } from './data/suggestLocations.service';
import { ScanTargetResolver } from './utils/resolver/scan-target.resolver';
import { SortLocationResolver } from './utils/resolver/sort-location.resolver';
import { StockingGuard } from './utils/stocking.guard';

export const StockingRoutes: Routes = [
  {
    path: '',
    providers: [
      SortingService,
      StockingService,
      SuggestLocationsService,
      SortLocationResolver,
      ScanTargetResolver,
      StockingGuard,
    ],
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
      {
        path: 'scantarget',
        resolve: { containerID: ScanTargetResolver },
        loadComponent: () =>
          import('./feature/stocking/scan-target.component').then(
            (m) => m.ScanTargetComponent
          ),
      },
    ],
  },
];
