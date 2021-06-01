import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { SubmitButtonComponent } from './form-button/form-button.component';
import { MessageBarComponent } from './message-bar/message-bar.component';
import { FullscreenButtonComponent } from './fullscreen-button/fullscreen-button.component';
import { LoaderComponent } from './loader/loader.component';
// import { FloatingInputComponent } from './floating-input/floating-input.component';

@NgModule({
  declarations: [
    SubmitButtonComponent,
    MessageBarComponent,
    FullscreenButtonComponent,
    LoaderComponent,
  ],
  exports: [
    SubmitButtonComponent,
    MessageBarComponent,
    FullscreenButtonComponent,
    LoaderComponent,
  ],
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
})
export class SharedComponentModule {}
