import { Routes } from '@angular/router';

export const StockingRoutes: Routes = [
  {
    path: '',
    providers: [],
    canActivateChild: [],
    loadComponent: () =>
      import('./shell.component').then((m) => m.InventoryMenegementShell),
    children: [
      {
        path: 'menu',
        loadComponent: () =>
          import('./feature/menu.component').then((m) => m.MenuComponent),
      },
    ],
  },
];
