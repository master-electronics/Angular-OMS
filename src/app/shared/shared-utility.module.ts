import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { FocusInvlidInputDirective } from './directives/focusInvalidInput.directive';

@NgModule({
  declarations: [FocusInvlidInputDirective],
  imports: [CommonModule],
  exports: [FocusInvlidInputDirective],
})
export class SharedUtilityModule {}
