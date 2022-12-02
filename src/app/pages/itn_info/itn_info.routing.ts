import { Routes } from '@angular/router';

export const ITNInfoRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./feature/itn_info.component').then((m) => m.INTInfoComponent),
  },
];
