import { Routes } from '@angular/router';
import { AuditResolver } from './utils/resolver/audit.resolver';
import { SubAuditResolver } from './utils/resolver/subAudit.resolver';
import { SearchLocationResolver } from './utils/resolver/search-location.resolver';
import { ManagementTriggerResolver } from './utils/resolver/management.resolver';
import { AuditService } from './data/audit.service';
import { EventLogService } from 'src/app/shared/services/eventLog.service';
import { SystemTriggerResolver } from './utils/resolver/system-trigger.resolver';

export const InventoryMangementRoutes: Routes = [
  {
    path: '',
    providers: [
      AuditResolver,
      SubAuditResolver,
      SystemTriggerResolver,
      SearchLocationResolver,
      ManagementTriggerResolver,
      AuditService,
      EventLogService,
    ],
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
        path: 'systemtriggers',
        resolve: { InitData: SystemTriggerResolver },
        loadComponent: () =>
          import('./feature/system-trigger/system-trigger.component').then(
            (m) => m.SystemTrigger
          ),
      },
      {
        path: 'management',
        resolve: { InitData: ManagementTriggerResolver },
        loadComponent: () =>
          import('./feature/maintenance/maintenance.component').then(
            (m) => m.Maintenance
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
        resolve: { Config: SubAuditResolver },
        loadComponent: () =>
          import('./feature/audit/quantity-audit.component').then(
            (m) => m.QuantityAudit
          ),
      },
      {
        path: 'audit/dateCode',
        resolve: { Config: SubAuditResolver },
        loadComponent: () =>
          import('./feature/audit/date_code-audit.component').then(
            (m) => m.DateCodeAudit
          ),
      },
      {
        path: 'audit/coo',
        resolve: { Config: SubAuditResolver },
        loadComponent: () =>
          import('./feature/audit/coo-audit.component').then((m) => m.COOAudit),
      },
      {
        path: 'audit/rohs',
        resolve: { Config: SubAuditResolver },
        loadComponent: () =>
          import('./feature/audit/rohs-audit.component').then(
            (m) => m.ROHSAudit
          ),
      },
      {
        path: 'audit/partNumber',
        resolve: { Config: SubAuditResolver },
        loadComponent: () =>
          import('./feature/audit/part_number-audit.component').then(
            (m) => m.PartNumberAudit
          ),
      },
      {
        path: 'audit/search/scan-location',
        resolve: { Location: SearchLocationResolver },
        loadComponent: () =>
          import('./feature/search/scan-location.component').then(
            (m) => m.ScanLocation
          ),
      },
      {
        path: 'audit/search/scan-itn',
        resolve: { Config: SubAuditResolver },
        loadComponent: () =>
          import('./feature/search/scan-itn.component').then((m) => m.ScanITN),
      },
      {
        path: 'audit/search/verify-quantity/:itn',
        loadComponent: () =>
          import('./feature/search/verify-quantity.component').then(
            (m) => m.VerifyQuantity
          ),
      },
      // {
      //   path: 'audit/search/verify-quantity',
      //   loadComponent: () =>
      //     import('./feature/menu.component').then((m) => m.MenuComponent),
      // },
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
