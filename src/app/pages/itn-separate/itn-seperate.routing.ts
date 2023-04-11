import { Routes } from '@angular/router';
import { ItnSeparateService } from './data/itn-separate.service';

export const ItnSeperateRoutes: Routes = [
  {
    path: '',
    providers: [ItnSeparateService],
    canActivateChild: [],
    loadComponent: () =>
      import('./shell.component').then((m) => m.ItnSeperateShell),
    children: [
      {
        path: 'scan',
        loadComponent: () =>
          import('./feature/scan.component').then((m) => m.ScanComponent),
      },
      {
        path: 'assign',
        loadComponent: () =>
          import('./feature/assign.component').then((m) => m.AssignComponent),
      },
      {
        path: 'itnlist',
        loadComponent: () =>
          import('./feature/itList.component').then((m) => m.ItnListComponent),
      },
      {
        path: '',
        redirectTo: 'scan',
        pathMatch: 'full',
      },
    ],
  },
];
