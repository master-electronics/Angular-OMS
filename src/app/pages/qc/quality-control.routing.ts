import { Routes } from '@angular/router';
import { TabService } from 'src/app/shared/ui/step-bar/tab';
import { OrderService } from './data-access/order';
import { MessagesResolver } from './utils/messages.resolver';

export const QualityControlRoutes: Routes = [
  {
    path: '',
    providers: [TabService, OrderService],
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
      {
        path: 'globalmessages',
        resolve: {
          messages: MessagesResolver,
        },
        loadComponent: () =>
          import('./feature/global-messages.component').then(
            (m) => m.GlobalMessagesComponent
          ),
      },
      { path: '', pathMatch: 'full', redirectTo: 'scanitn' },
    ],
  },
];
