import { Routes } from '@angular/router';
import { PartResolver } from './data/resolver/part.resolver';
import { CountryListService } from 'src/app/shared/data/countryList';
import { KickoutService } from './data/kickout';
import { LabelService } from './data/label';
import { ReceiptInfoService } from './data/ReceiptInfo';
import { ReceivingService } from './data/receivingService';
import { updateReceiptInfoService } from './data/updateReceipt';
import { VerifyResolver } from './data/resolver/verify.resolver';
import { PrintItnResolver } from './data/resolver/printItn.resolver';
import { PrinterService } from 'src/app/shared/data/printerInfo';

export const ReceivingRoutes: Routes = [
  {
    path: '',
    providers: [
      PartResolver,
      VerifyResolver,
      PrintItnResolver,
      ReceivingService,
      ReceiptInfoService,
      KickoutService,
      updateReceiptInfoService,
      LabelService,
      CountryListService,
      PrinterService,
    ],
    loadComponent: () =>
      import('./shell.component').then((m) => m.ReceivingShell),
    children: [
      {
        path: 'receipt',
        loadComponent: () =>
          import('./feature/receipt.component').then((m) => m.ReceiptComponent),
      },
      {
        path: 'part',
        resolve: {
          lines: PartResolver,
        },
        loadComponent: () =>
          import('./feature/part/part.component').then((m) => m.PartComponent),
      },
      {
        path: 'part/verify',
        resolve: {
          info: VerifyResolver,
        },
        loadComponent: () =>
          import('./feature/part/verify.component').then(
            (m) => m.VerifyComponent
          ),
      },
      {
        path: 'part/quantity',
        loadComponent: () =>
          import('./feature/part/quantity.component').then(
            (mod) => mod.QuantityComponent
          ),
      },
      {
        path: 'kickout',
        loadComponent: () =>
          import('./feature/kickout/kickout.component').then(
            (m) => m.KickoutComponent
          ),
      },
      // {
      //   path: 'kickout/scanlabel',
      //   loadComponent: () =>
      //     import('./feature/kickout/label.component').then(
      //       (mod) => mod.LabelComponent
      //     ),
      // },
      // {
      //   path: 'kickout/location',
      //   loadComponent: () =>
      //     import('./feature/kickout/location.component').then(
      //       (mod) => mod.LocationComponent
      //     ),
      // },
      // {
      //   path: 'kickout/rescanlabel',
      //   loadComponent: () =>
      //     import('./feature/kickout/rescan-label.component').then(
      //       (mod) => mod.RescanLabelComponent
      //     ),
      // },
      {
        path: 'update/country',
        loadComponent: () =>
          import('./feature/update-info/country.component').then(
            (m) => m.CountryComponent
          ),
      },
      {
        path: 'update/datecode',
        loadComponent: () =>
          import('./feature/update-info/datecode.component').then(
            (m) => m.DateCodeComponent
          ),
      },
      {
        path: 'update/rhos',
        loadComponent: () =>
          import('./feature/update-info/rhos.component').then(
            (m) => m.RHOSComponent
          ),
      },
      {
        path: 'label/selectline',
        loadComponent: () =>
          import('./feature/label/selectLine.component').then(
            (mod) => mod.SelectLineComponent
          ),
      },
      {
        path: 'label/assign',
        loadComponent: () =>
          import('./feature/label/assignLabel.component').then(
            (mod) => mod.AssignLabelComponent
          ),
      },
      {
        path: 'label/printitn',
        resolve: {
          print: PrintItnResolver,
        },
        loadComponent: () =>
          import('./feature/label/printItn.component').then(
            (mod) => mod.PrintITNComponent
          ),
      },
      {
        path: 'label/sacnlocation',
        loadComponent: () =>
          import('./feature/label/scanLocation.component').then(
            (mod) => mod.ScanLocationComponent
          ),
      },
      { path: '', pathMatch: 'full', redirectTo: 'receipt' },
    ],
  },
];
