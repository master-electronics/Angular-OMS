import { Routes } from '@angular/router';
import { AuditResolver } from './utils/resolver/audit.resolver';
import { AuditService } from './data/audit.service';
import { EventLogService } from 'src/app/shared/services/eventLog.service';

export const InventoryMangementRoutes: Routes = [
  {
    path: '',
    providers: [AuditResolver, AuditService, EventLogService],
    canActivateChild: [],
    loadComponent: () =>
      import('./shell.component').then((m) => m.InventoryMenegementShell),
    children: [
      {
        path: 'menu',
        loadComponent: () =>
          import('./feature/menu.component').then((m) => m.MenuComponent),
      },
      {
        path: 'usertrigger',
        loadComponent: () =>
          import('./feature/user-trigger/user-trigger.component').then(
            (m) => m.UserTrigger
          ),
      },
      {
        path: 'audit/scan-itn',
        resolve: { Audit: AuditResolver },
        loadComponent: () =>
          import('./feature/select/scan-itn.component').then((m) => m.ScanITN),
      },
      {
        path: 'audit/quantity',
        loadComponent: () =>
          import('./feature/audit/quantity-audit.component').then(
            (m) => m.QuantityAudit
          ),
      },
      {
        path: 'audit/dateCode',
        loadComponent: () =>
          import('./feature/audit/date_code-audit.component').then(
            (m) => m.DateCodeAudit
          ),
      },
      {
        path: 'audit/coo',
        loadComponent: () =>
          import('./feature/audit/coo-audit.component').then((m) => m.COOAudit),
      },
      {
        path: 'audit/rohs',
        loadComponent: () =>
          import('./feature/audit/rohs-audit.component').then(
            (m) => m.ROHSAudit
          ),
      },
      {
        path: 'audit/partNumber',
        loadComponent: () =>
          import('./feature/audit/part_number-audit.component').then(
            (m) => m.PartNumberAudit
          ),
      },
      {
        path: 'audit/search/scan-location',
        loadComponent: () =>
          import('./feature/search/scan-location.component').then(
            (m) => m.ScanLocation
          ),
      },
      {
        path: 'audit/verify/scan-itn',
        loadComponent: () =>
          import('./feature/verify/scan-itn.component').then((m) => m.ScanITN),
      },
      {
        path: 'audit/verify/scan-location',
        loadComponent: () =>
          import('./feature/verify/scan-location.component').then(
            (m) => m.ScanLocation
          ),
      },
    ],
  },
];
