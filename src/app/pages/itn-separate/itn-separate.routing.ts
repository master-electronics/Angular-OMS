import { Routes } from '@angular/router';
import { ItnSeparateService } from './data/itn-separate.service';
import { ItnListResolver } from './utils/resolver/itn-list.resolver';

export const ItnSeparateRoutes: Routes = [
  {
    path: '',
    providers: [ItnSeparateService, ItnListResolver],
    canActivateChild: [],
    loadComponent: () =>
      import('./shell.component').then((m) => m.ItnSeparateShell),
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
        resolve: { itnList: ItnListResolver },
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
