import { Routes } from '@angular/router';

export const ReceivingRoutes: Routes = [
  {
    path: '',
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
        loadComponent: () =>
          import('./feature/part/part.component').then((m) => m.PartComponent),
      },
      {
        path: 'part/verify',
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
        path: 'update/rohs',
        loadComponent: () =>
          import('./feature/update-info/rohs.component').then(
            (m) => m.ROHSComponent
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
