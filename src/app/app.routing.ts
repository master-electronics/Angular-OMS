import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LoginGuard } from './shared/services/login-guard';
import { LoginComponent } from './pages/login/login.component';
import { ErrorPageComponent } from './pages/error-page/error-page.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { ShellComponent } from './pages/shell/shell.component';
import { HomeComponent } from './pages/home/home.component';
import { RouterGuard } from './shared/services/route-guard';

const routes: Routes = [
  {
    path: '',
    component: ShellComponent,
    children: [
      {
        path: 'home',
        canActivate: [LoginGuard],
        component: HomeComponent,
      },
      {
        path: 'agin',
        canActivate: [LoginGuard, RouterGuard],
        loadChildren: () =>
          import('./pages/aggregation-in/aggregation-in.module').then(
            (m) => m.AggregationInModule
          ),
      },
      {
        path: 'agout',
        canActivate: [LoginGuard, RouterGuard],
        loadChildren: () =>
          import('./pages/aggregation-out/aggregation-out.module').then(
            (m) => m.AggregationOutModule
          ),
      },
      {
        path: 'qc',
        canActivate: [LoginGuard, RouterGuard],
        loadChildren: () =>
          import('./pages/quality-control/quality-control.module').then(
            (m) => m.QualityControlModule
          ),
      },
      {
        path: 'searchbarcode',
        canActivate: [LoginGuard, RouterGuard],
        loadChildren: () =>
          import('./pages/search-barcode/search-barcode.module').then(
            (m) => m.SearchBarcodeModule
          ),
      },
      {
        path: 'tableviews',
        canActivate: [LoginGuard, RouterGuard],
        loadChildren: () =>
          import('./pages/table-views/table-views.module').then(
            (m) => m.TableViewsModule
          ),
      },
      {
        path: 'tableviews/itnlifecycle',
        canActivate: [LoginGuard, RouterGuard],
        loadChildren: () =>
          import('./pages/itn-lifecycle/itn-lifecycle.module').then(
            (m) => m.ITNLifeCycleModule
          ),
      },
      {
        path: 'printitn',
        canActivate: [LoginGuard, RouterGuard],
        loadChildren: () =>
          import('./pages/print-itn/print-itn.module').then(
            (m) => m.PrintITNModule
          ),
      },
      {
        path: 'shelfinventory',
        canActivate: [LoginGuard, RouterGuard],
        loadChildren: () =>
          import('./pages//shelf-inventory/shelf-inventory.module').then(
            (m) => m.ShelfInventoryModule
          ),
      },
      {
        path: 'pulltopick',
        canActivate: [LoginGuard, RouterGuard],
        loadChildren: () =>
          import('./pages/pull-to-pick/pick.module').then((m) => m.PickModule),
      },
      // {
      //   path: 'stocking',
      // canActivate: [LoginGuard, RouterGuard],
      //   loadChildren: () =>
      //     import('./pages/stocking/stocking.module').then(
      //       (m) => m.StockingModule
      //     ),
      // },
      {
        path: 'valuemap',
        canActivate: [LoginGuard, RouterGuard],
        loadChildren: () =>
          import('./pages/value-mapping/value-mapping.module').then(
            (m) => m.ValueMappingModule
          ),
      },
      {
        path: 'printermaintenance',
        canActivate: [LoginGuard, RouterGuard],
        loadChildren: () =>
          import('./pages/printer-maintenance/printer-maintenance.module').then(
            (m) => m.PrinterMaintenanceModule
          ),
      },
      {
        path: 'dataMaintenance',
        canActivate: [LoginGuard, RouterGuard],
        loadChildren: () =>
          import('./pages/dataMaintenance/data-maintenance.module').then(
            (m) => m.DataMaintenanceModule
          ),
      },
      {
        path: 'logviewer',
        canActivate: [LoginGuard, RouterGuard],
        loadChildren: () =>
          import('./pages/log-viewer/log-viewer.module').then(
            (m) => m.LogViewerModule
          ),
      },
      {
        path: 'demo',
        canActivate: [LoginGuard, RouterGuard],
        loadChildren: () =>
          import('./pages/picker-manage/picker-manage.module').then(
            (m) => m.PickerManageModule
          ),
      },
      {
        path: 'receiving/receiptentry',
        canActivate: [LoginGuard, RouterGuard],
        loadChildren: () =>
          import('./pages/receiving/receipt-entry/receipt-entry.module').then(
            (m) => m.ReceiptEntryModule
          ),
      },
      {
        path: 'receiptreceiving',
        canActivate: [LoginGuard, RouterGuard],
        loadChildren: () =>
          import('./pages/receipt-receiving/receiving.routing').then(
            (m) => m.ReceivingRoutes
          ),
      },
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full',
      },
    ],
  },
  { path: 'login', component: LoginComponent },
  { path: 'error', component: ErrorPageComponent },
  { path: '**', component: NotFoundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { enableTracing: false })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
