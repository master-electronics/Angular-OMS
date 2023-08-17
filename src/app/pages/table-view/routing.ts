import { Routes } from '@angular/router';

export const TableViewRoutes: Routes = [
  {
    path: '',
    providers: [],
    canActivateChild: [],
    loadComponent: () => import('./shell').then((m) => m.Shell),
    children: [
      {
        path: 'menu',
        loadComponent: () =>
          import('./menu/menu.component').then((m) => m.MenuComponent),
      },
      { path: '', pathMatch: 'full', redirectTo: 'menu' },
    ],
  },
];
