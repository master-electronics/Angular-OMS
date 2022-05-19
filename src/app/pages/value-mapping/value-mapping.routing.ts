import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ValueMapping } from './value-mapping.component';

const routes: Routes = [{ path: '', component: ValueMapping }];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class ValueMappingRoutingModule {}