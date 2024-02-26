import { Routes } from '@angular/router';

import { LoginGuard } from './shared/route-guard/login.guard';
import { AuthGuard } from './shared/route-guard/auth.guard';
import { PrinterGuard } from './shared/route-guard/printer.guard';
import { SetupDcComponent } from './pages/setup-DC/setup-Dc.component';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/shell/shell.component').then((m) => m.ShellComponent),
    canActivateChild: [LoginGuard, AuthGuard],
    children: [
      {
        path: 'home',
        loadComponent: () =>
          import('./pages/home/home.component').then((m) => m.HomeComponent),
      },
      {
        path: 'agin',
        loadChildren: () =>
          import('./pages/aggregation-in/aggregation-in.module').then(
            (m) => m.AggregationInModule
          ),
      },
      {
        path: 'agout',
        loadChildren: () =>
          import('./pages/aggregation-out/aggregation-out.module').then(
            (m) => m.AggregationOutModule
          ),
      },
      {
        path: 'qc',
        loadChildren: () =>
          import('./pages/quality-control/quality-control.module').then(
            (m) => m.QualityControlModule
          ),
      },
      {
        path: 'searchbarcode',
        loadChildren: () =>
          import('./pages/search-barcode/search-barcode.module').then(
            (m) => m.SearchBarcodeModule
          ),
      },
      {
        path: 'tableviews',
        loadChildren: () =>
          import('./pages/table-views/table-views.module').then(
            (m) => m.TableViewsModule
          ),
      },
      {
        path: 'tableviews/itnlifecycle',
        loadChildren: () =>
          import('./pages/itn-lifecycle/itn-lifecycle.module').then(
            (m) => m.ITNLifeCycleModule
          ),
      },
      {
        path: 'printitn',
        loadChildren: () =>
          import('./pages/print-itn/print-itn.module').then(
            (m) => m.PrintITNModule
          ),
      },
      {
        path: 'shelfinventory',
        loadChildren: () =>
          import('./pages//shelf-inventory/shelf-inventory.module').then(
            (m) => m.ShelfInventoryModule
          ),
      },
      // {
      //   path: 'pulltopick',
      //   loadChildren: () =>
      //     import('./pages/pull-to-pick/pick.module').then((m) => m.PickModule),
      // },
      {
        path: 'valuemap',
        loadChildren: () =>
          import('./pages/value-mapping/value-mapping.module').then(
            (m) => m.ValueMappingModule
          ),
      },
      {
        path: 'printermaintenance',
        loadChildren: () =>
          import('./pages/printer-maintenance/printer-maintenance.module').then(
            (m) => m.PrinterMaintenanceModule
          ),
      },
      {
        path: 'dataMaintenance',
        loadChildren: () =>
          import('./pages/dataMaintenance/data-maintenance.module').then(
            (m) => m.DataMaintenanceModule
          ),
      },
      // {
      //   path: 'demo',
      //   loadChildren: () =>
      //     import('./pages/picker-manage/picker-manage.module').then(
      //       (m) => m.PickerManageModule
      //     ),
      // },
      {
        path: 'receiving/receiptentry',
        loadChildren: () =>
          import('./pages/receiving/receipt-entry/receipt-entry.module').then(
            (m) => m.ReceiptEntryModule
          ),
      },
      {
        path: 'qct',
        loadChildren: () =>
          import('./pages/qc/quality-control.routing').then(
            (m) => m.QualityControlRoutes
          ),
      },
      {
        path: 'receiptreceiving',
        canActivate: [PrinterGuard],
        loadChildren: () =>
          import('./pages/receipt-receiving/receiving.routing').then(
            (m) => m.ReceivingRoutes
          ),
      },
      {
        path: 'autostore-asn',
        canActivate: [PrinterGuard],
        loadChildren: () =>
          import('./pages/Autostore-ASN/autostore-asn.routing').then(
            (m) => m.AutostoreASNRoutes
          ),
      },
      {
        path: 'stocking',
        canActivate: [PrinterGuard],
        loadChildren: () =>
          import('./pages/stocking/stocking.routing').then(
            (m) => m.StockingRoutes
          ),
      },
      {
        path: 'inventorymanagement',
        loadChildren: () =>
          import('./pages/inventory-management/routing').then(
            (m) => m.InventoryMangementRoutes
          ),
      },
      {
        path: 'picking',
        title: 'Picking',
        loadChildren: () =>
          import('./pages/picking/picking.routing').then(
            (m) => m.PickingRoutes
          ),
      },
      {
        path: 'printersetting',
        loadComponent: () =>
          import('./pages/printer-setting/printer-setting.component').then(
            (m) => m.PrinterSettingComponent
          ),
      },
      {
        path: 'setupdc',
        loadComponent: () =>
          import('./pages/setup-DC/setup-Dc.component').then(
            (m) => SetupDcComponent
          ),
      },
      {
        path: 'itn_info',
        loadComponent: () =>
          import('./pages/itn-info/itn-info.component').then(
            (m) => m.ItnInfoComponent
          ),
      },
      {
        path: 'clearsuspect',
        loadComponent: () =>
          import(
            './pages/clear-suspect-inventory/clear-suspect-inventory.component'
          ).then((m) => m.ClearSuspectInventoryComponent),
      },
      {
        path: 'weightscalesetting',
        loadComponent: () =>
          import(
            './pages/weight-scale-setting/weight-scale-setting.component'
          ).then((m) => m.WeightScaleSettingComponent),
      },
      {
        path: 'tableview',
        loadChildren: () =>
          import('./pages/table-view/routing').then((m) => m.TableViewRoutes),
      },
      {
        path: 'itnseparate',
        canActivate: [PrinterGuard],
        loadChildren: () =>
          import('./pages/itn-separate/itn-separate.routing').then(
            (m) => m.ItnSeparateRoutes
          ),
      },
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full',
      },
    ],
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./pages/login/login.component').then((m) => m.LoginComponent),
  },
  {
    path: 'error',
    loadComponent: () =>
      import('./pages/util-pages/error-page.component').then(
        (m) => m.ErrorPageComponent
      ),
  },
  {
    path: '**',
    loadComponent: () =>
      import('./pages/util-pages/not-found.component').then(
        (m) => m.NotFoundComponent
      ),
  },
];
