import { Routes } from '@angular/router';
import { ASNService } from './data/asn.service';
import { ProductService } from './data/product.service';
import { EventLogService } from 'src/app/shared/services/eventLog.service';
import { ITNResolver } from './utils/resolver/itn.resolver';
import { LocationResolver } from './utils/resolver/location.resolver';
import { ReplenishItemResolver } from './utils/resolver/replenish-item.resolver';
import { PrinterService } from 'src/app/shared/data/printer';

export const AutostoreASNRoutes: Routes = [
  {
    path: '',
    providers: [
      ASNService,
      ProductService,
      LocationResolver,
      ReplenishItemResolver,
      ITNResolver,
      EventLogService,
      PrinterService,
    ],
    loadComponent: () =>
      import('./shell.component').then((m) => m.AutostoreASNShell),
    children: [
      {
        path: 'menu',
        loadComponent: () =>
          import('./feature/menu.component').then((m) => m.MenuComponent),
      },
      {
        path: 'print-label',
        loadComponent: () =>
          import('./feature/label/scan-itn.component').then((m) => m.ScanITN),
      },
      {
        path: 'start-location',
        loadComponent: () =>
          import('./feature/select/start-location.component').then(
            (m) => m.ASNStartLocation
          ),
      },
      {
        path: 'scan-location',
        resolve: { InventoryTrackingNumber: LocationResolver },
        loadComponent: () =>
          import('./feature/location-scan/location.component').then(
            (m) => m.ASNLocation
          ),
      },
      {
        path: 'scan-itn',
        resolve: { ReplenishmentItem: ReplenishItemResolver },
        loadComponent: () =>
          import('./feature/scan-itn/scan-itn.component').then(
            (m) => m.ScanITN
          ),
      },
      {
        path: 'create',
        loadComponent: () =>
          import('./feature/create/create-asn.component').then(
            (m) => m.CreateASN
          ),
      },
      {
        path: 'create/scan-location',
        resolve: { InventoryTrackingNumber: LocationResolver },
        loadComponent: () =>
          import('./feature/create/location.component').then(
            (m) => m.ASNLocation
          ),
      },
      {
        path: 'scan-asn',
        loadComponent: () =>
          import('./feature/select/scan-asn.component').then(
            (m) => m.SelectASN
          ),
      },
      {
        path: 'drop-off/scan-location',
        loadComponent: () =>
          import('./feature/select/drop-off-location.component').then(
            (m) => m.ASNDropOffLocation
          ),
      },
    ],
  },
  // {
  //   path: 'scan-location',
  //   providers: [ASNService, LocationResolver],
  //   resolve: { InventoryTrackingNumber: LocationResolver },
  //   loadComponent: () =>
  //     import('./feature/location-scan/location.component').then(
  //       (m) => m.ASNLocation
  //     ),
  // },
  // {
  //   path: 'scan-itn',
  //   providers: [ASNService, ITNResolver],
  //   resolve: { containerID: ITNResolver },
  //   loadComponent: () =>
  //     import('./feature/scan-itn/scan-itn.component').then((m) => m.ScanITN),
  // },
  // {
  //   path: 'create',
  //   loadComponent: () =>
  //     import('./feature/create/create-asn.component').then((m) => m.CreateASN),
  // },
  // {
  //   path: 'scan-asn',
  //   loadComponent: () =>
  //     import('./feature/select/scan-asn.component').then((m) => m.SelectASN),
  // },
];
