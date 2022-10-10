import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ITNLifecycleComponent } from './itn-lifecycle.component';

const routes: Routes = [{ path: '', component: ITNLifecycleComponent }];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class ITNLifecycleRoutingModule {}