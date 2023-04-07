import { Routes } from '@angular/router';
import { ItnSeperateService } from './data/itn-seperate.service';

export const ItnSeperateRoutes: Routes = [
  {
    path: '',
    providers: [ItnSeperateService],
    canActivateChild: [],
    loadComponent: () =>
      import('./shell.component').then((m) => m.ItnSeperateShell),
    children: [
      {
        path: 'scan',
        loadComponent: () =>
          import('./feature/scan.component').then((m) => m.ScanComponent),
      },
      // {
      //   path: 'assign',
      //   loadComponent: () =>
      //     import('./feature/assign.component').then((m) => m.AssignComponent),
      // },
      {
        path: '',
        redirectTo: 'scan',
        pathMatch: 'full',
      },
    ],
  },
];
