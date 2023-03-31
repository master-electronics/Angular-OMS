import { Routes } from '@angular/router';
import { SortingService } from './data/sorting.service';
import { StockingService } from './data/stocking.service';
import { SuggestLocationsService } from './data/suggestLocations.service';
import { ScanTargetResolver } from './utils/resolver/scan-target.resolver';
import { SortLocationResolver } from './utils/resolver/location.resolver';
import { StockingGuard } from './utils/stocking.guard';
import { UserItnlistResolver } from './utils/resolver/user-itnlist.resolver';
import { ItnInfoService } from './data/itn-info.service';

export const StockingRoutes: Routes = [
  {
    path: '',
    providers: [
      SortingService,
      StockingService,
      ItnInfoService,
      SuggestLocationsService,
      SortLocationResolver,
      ScanTargetResolver,
      UserItnlistResolver,
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
        path: 'itn',
        loadComponent: () =>
          import('./feature/sorting/scan-itn.component').then(
            (m) => m.ScanITNComponent
          ),
      },
      {
        path: 'location',
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
      {
        path: 'itncount',
        loadComponent: () =>
          import('./feature/stocking/itn-count.component').then(
            (m) => m.ITNCountComponent
          ),
      },
      {
        path: 'mismatch',
        loadComponent: () =>
          import('./feature/stocking/mismatch.component').then(
            (m) => m.MismatchComponent
          ),
      },
      {
        path: 'checkitns',
        loadComponent: () =>
          import('./feature/stocking/check-itns/scan-itn.component').then(
            (m) => m.ScanItnComponent
          ),
      },
      {
        path: 'putaway',
        resolve: { putAway: SortLocationResolver },
        loadComponent: () =>
          import('./feature/stocking/check-itns/put-away.component').then(
            (m) => m.PutAwayComponent
          ),
      },
      {
        path: 'rescanitn',
        loadComponent: () =>
          import('./feature/stocking/check-itns/rescan-itn.component').then(
            (m) => m.RescanItnComponent
          ),
      },
      {
        path: 'user',
        resolve: { ItnList: UserItnlistResolver },
        loadComponent: () =>
          import('./feature/stocking/user-itnlist.component').then(
            (m) => m.UserItnlistComponent
          ),
      },
    ],
  },
];
