import { Routes } from '@angular/router';
import { JsonFormService } from 'src/app/shared/ui/input/json-form/json-form.service';
import { EventLogService } from './data-access/event-logs.service';

export const TableViewRoutes: Routes = [
  {
    path: '',
    providers: [JsonFormService, EventLogService],
    canActivateChild: [],
    loadComponent: () => import('./shell').then((m) => m.Shell),
    children: [
      {
        path: 'menu',
        loadComponent: () =>
          import('./menu/menu.component').then((m) => m.MenuComponent),
      },
      {
        path: 'taskcounter',
        loadComponent: () =>
          import('./task-counter/task-counter.component').then(
            (m) => m.TaskCounterComponent
          ),
      },
      {
        path: 'eventlog',
        loadComponent: () =>
          import('./event-log/event-log.component').then(
            (m) => m.EventLogComponent
          ),
      },
      { path: '', pathMatch: 'full', redirectTo: 'menu' },
    ],
  },
];
