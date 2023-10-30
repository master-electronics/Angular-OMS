import { Routes } from '@angular/router';
import { LabelService } from './data/label';
import { ReceiptInfoService } from './data/ReceiptInfo';
import { TabService } from '../../shared/ui/step-bar/tab';
import { updateReceiptInfoService } from './data/updateReceipt';
import { ReceiptGuard } from './utils/receipt.guard';
import { PartResolver } from './utils/resolver/part.resolver';
import { kickoutService } from './data/kickout';
import { CreateReceiptService } from './data/createReceipt';
import { VerifyResolver } from './utils/resolver/verify.resolver';
import { PrintItnResolver } from './utils/resolver/printItn.resolver';
import { ItnCountService } from './data/itnCount';

export const ReceivingRoutes: Routes = [
  {
    path: '',
    providers: [
      TabService,
      ReceiptInfoService,
      updateReceiptInfoService,
      LabelService,
      kickoutService,
      CreateReceiptService,
      ItnCountService,
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
        path: 'alllines',
        loadComponent: () =>
          import('./feature/over-receipt/selectLine.component').then(
            (m) => m.SelectLineComponent
          ),
      },
      {
        path: 'overreceiving',
        resolve: {
          info: VerifyResolver,
        },
        loadComponent: () =>
          import('./feature/over-receipt/overReceiving.component').then(
            (m) => m.OverReceivingComponent
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
          import('./feature/verify/part.component').then(
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
        path: 'update/selectline',
        loadComponent: () =>
          import('./feature/update-info/selectLine.component').then(
            (mod) => mod.SelectLineComponent
          ),
      },
      {
        path: 'update/itncount',
        loadComponent: () =>
          import('./feature/update-info/itn-count.component').then(
            (m) => m.ItnCountComponent
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
        path: 'label/summary',
        loadComponent: () =>
          import('./feature/label/summary.component').then(
            (mod) => mod.SummaryComponent
          ),
      },
      {
        path: 'itnlist',
        loadComponent: () =>
          import('./feature/kickout/itnList.component').then(
            (mod) => mod.ItnListComponent
          ),
      },
      {
        path: 'kickoutitn',
        loadComponent: () =>
          import('./feature/kickout/kickoutITN.component').then(
            (m) => m.KickoutItnComponent
          ),
      },
      { path: '', pathMatch: 'full', redirectTo: 'receipt' },
    ],
  },
];
