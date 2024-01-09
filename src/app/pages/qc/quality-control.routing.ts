import { Routes } from '@angular/router';

export const StockingRoutes: Routes = [
  {
    path: '',
    providers: [],
    loadComponent: () =>
      import('./shell.component').then((m) => m.QualityControlShell),
    children: [],
  },
];
