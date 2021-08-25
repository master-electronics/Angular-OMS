import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { SubmitButtonComponent } from './form-button/form-button.component';
import { MessageBarComponent } from './message-bar/message-bar.component';
import { FullscreenButtonComponent } from './fullscreen-button/fullscreen-button.component';
import { LoaderComponent } from './loader/loader.component';
import { CheckPrinterModalComponent } from './check-printer/check-printer-modal.component';

@NgModule({
  declarations: [
    SubmitButtonComponent,
    MessageBarComponent,
    FullscreenButtonComponent,
    LoaderComponent,
    CheckPrinterModalComponent,
  ],
  exports: [
    SubmitButtonComponent,
    MessageBarComponent,
    FullscreenButtonComponent,
    LoaderComponent,
    CheckPrinterModalComponent,
  ],
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
})
export class SharedComponentModule {}
