import { Routes } from '@angular/router';
import { LabelService } from './data/label';
import { ReceiptInfoService } from './data/ReceiptInfo';
import { TabService } from '../../shared/ui/step-bar/tab';
import { updateReceiptInfoService } from './data/updateReceipt';
import { ReceiptGuard } from './utils/receipt.guard';
import { PartResolver } from './utils/resolver/part.resolver';
import { LogService } from './data/eventLog';
import { kickoutService } from './data/kickout';
import { CreateReceiptService } from './data/createReceipt';
import { VerifyResolver } from './utils/resolver/verify.resolver';
import { PrintItnResolver } from './utils/resolver/printItn.resolver';

export const ReceivingRoutes: Routes = [
  {
    path: '',
    providers: [
      TabService,
      ReceiptInfoService,
      updateReceiptInfoService,
      LabelService,
      LogService,
      kickoutService,
      CreateReceiptService,
    ],
    loadComponent: () =>
      import('./shell.component').then((m) => m.ReceivingShell),
    canActivateChild: [ReceiptGuard],
    children: [
      {
        path: 'purchasenumber',
        loadComponent: () =>
          import('./feature/receipt/purchase-number.component').then(
            (m) => m.PurchaseNumberComponent
          ),
      },
      {
        path: 'lineselecter',
        loadComponent: () =>
          import('./feature/receipt/lineSelecter.components').then(
            (m) => m.LineSelecterComponent
          ),
      },
      {
        path: 'receiptquantity',
        loadComponent: () =>
          import('./feature/receipt/receipt-quantity.component').then(
            (m) => m.ReceiptQuantityComponent
          ),
      },
      {
        path: 'receipt',
        loadComponent: () =>
          import('./feature/identify/receipt.component').then(
            (m) => m.ReceiptComponent
          ),
      },
      {
        path: 'search',
        loadComponent: () =>
          import('./feature/identify/search.component').then(
            (m) => m.SearchComponent
          ),
      },
      {
        path: 'part',
        resolve: {
          lines: PartResolver,
        },
        loadComponent: () =>
          import('./feature/identify/part.component').then(
            (m) => m.PartComponent
          ),
      },
      {
        path: 'part/verify',
        resolve: {
          info: VerifyResolver,
        },
        loadComponent: () =>
          import('./feature/verify/verify.component').then(
            (m) => m.VerifyComponent
          ),
      },
      {
        path: 'part/quantity',
        loadComponent: () =>
          import('./feature/verify/quantity.component').then(
            (mod) => mod.QuantityComponent
          ),
      },
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
        path: 'update/ROHS',
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
      {
        path: 'itnkickout',
        loadComponent: () =>
          import('./feature/kickout/itnKickout.component').then(
            (mod) => mod.ItnKickoutComponent
          ),
      },
      {
        path: 'kickout',
        loadComponent: () =>
          import('./feature/kickout/kickout.component').then(
            (m) => m.KickoutComponent
          ),
      },
      { path: '', pathMatch: 'full', redirectTo: 'receipt' },
    ],
  },
];
