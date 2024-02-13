import { Routes } from '@angular/router';

export const QualityControlRoutes: Routes = [
  {
    path: '',
    providers: [],
    loadComponent: () =>
      import('./shell.component').then((m) => m.QualityControlShell),
    children: [
      {
        path: 'scanitn',
        loadComponent: () =>
          import('./feature/scan-itn.component').then(
            (m) => m.ScanItnComponent
          ),
      },
      { path: '', pathMatch: 'full', redirectTo: 'scanitn' },
    ],
  },
];
