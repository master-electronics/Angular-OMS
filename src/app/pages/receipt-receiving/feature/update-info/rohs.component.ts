import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { SimpleKeyboardComponent } from 'src/app/shared/ui/simple-keyboard.component';
import { SingleInputformComponent } from '../../ui/single-input-form.component';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    SingleInputformComponent,
    ReactiveFormsModule,
    SimpleKeyboardComponent,
  ],
  template: ` <div>ROHS</div> `,
})
export class ROHSComponent {
  public data$: Observable<any>;

  constructor(private _router: Router) {}

  onSubmit(): void {
    this._router.navigateByUrl('receiptreceiving/verify/rohs');
  }

  public onBack(): void {
    this._router.navigateByUrl('receiptreceiving/verify/country');
  }
}
