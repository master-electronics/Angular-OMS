import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from './shared/services/auth-guard.service';
import { LoginComponent } from './pages/login/login.component';
import { ErrorPageComponent } from './pages/error-page/error-page.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { ShellComponent } from './pages/shell/shell.component';
import { HomeComponent } from './pages/home/home.component';

const routes: Routes = [
  {
    path: '',
    component: ShellComponent,
    canActivate: [AuthGuard],
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
      // {
      //   path: 'stocking',
      //   loadChildren: () =>
      //     import('./pages/stocking/stocking.module').then(
      //       (m) => m.StockingModule
      //     ),
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
        path: 'receiptreceiving',
        loadChildren: () =>
          import('./pages/receipt-receiving/receiving.routing').then(
            (m) => m.ReceivingRoutes
          ),
      },
      { path: '', redirectTo: 'home', pathMatch: 'full' },
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
