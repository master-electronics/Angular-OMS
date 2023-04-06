import { Routes } from '@angular/router';
import { ASNService } from './data/asn.service';
import { ProductService } from './data/product.service';
import { ITNResolver } from './utils/resolver/itn.resolver';
import { LocationResolver } from './utils/resolver/location.resolver';

export const AutostoreASNRoutes: Routes = [
  {
    path: '',
    providers: [ASNService, ProductService, LocationResolver, ITNResolver],
    loadComponent: () =>
      import('./shell.component').then((m) => m.AutostoreASNShell),
    children: [
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
        resolve: { containerID: ITNResolver },
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
