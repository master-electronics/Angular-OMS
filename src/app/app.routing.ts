import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LoginGuard } from './shared/route-guard/login.guard';
import { RouterGuard } from './shared/route-guard/route-auth.guard';

import { ShellComponent } from './pages/shell/shell.component';
import { HomeComponent } from './pages/home/home.component';
import { PrinterGuard } from './shared/route-guard/printer.guard';

const routes: Routes = [
  {
    path: '',
    component: ShellComponent,
    canActivateChild: [LoginGuard, RouterGuard],
    children: [
      {
        path: 'home',
        component: HomeComponent,
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
      {
        path: 'pulltopick',
        loadChildren: () =>
          import('./pages/pull-to-pick/pick.module').then((m) => m.PickModule),
      },
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
      {
        path: 'logviewer',
        loadChildren: () =>
          import('./pages/log-viewer/log-viewer.module').then(
            (m) => m.LogViewerModule
          ),
      },
      {
        path: 'demo',
        loadChildren: () =>
          import('./pages/picker-manage/picker-manage.module').then(
            (m) => m.PickerManageModule
          ),
      },
      {
        path: 'receiving/receiptentry',
        loadChildren: () =>
          import('./pages/receiving/receipt-entry/receipt-entry.module').then(
            (m) => m.ReceiptEntryModule
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
        path: 'stocking',
        loadChildren: () =>
          import('./pages/stocking/stocking.routing').then(
            (m) => m.StockingRoutes
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
        path: 'itn_info',
        loadComponent: () =>
          import('./pages/itn_info/feature/itn_info.component').then(
            (m) => m.INTInfoComponent
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

@NgModule({
  imports: [RouterModule.forRoot(routes, { enableTracing: false })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
