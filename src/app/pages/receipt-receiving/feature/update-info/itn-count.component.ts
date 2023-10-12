import { Component, OnInit, inject } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SingleInputformComponent } from '../../../../shared/ui/input/single-input-form.component';
import { CommonModule } from '@angular/common';
import { TabService } from '../../../../shared/ui/step-bar/tab';
import { MessageBarComponent } from 'src/app/shared/ui/message-bar.component';
import { GreenButtonComponent } from 'src/app/shared/ui/button/green-button.component';
import { NormalButtonComponent } from 'src/app/shared/ui/button/normal-button.component';
import { ItnCountService } from '../../data/itnCount';
import { of } from 'rxjs';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    SingleInputformComponent,
    ReactiveFormsModule,
    MessageBarComponent,
    GreenButtonComponent,
    NormalButtonComponent,
  ],
  template: `
    <single-input-form
      [data]="data$ | async"
      (formSubmit)="submit()"
      (formBack)="
        this.router.navigate(['../ROHS'], { relativeTo: this.actRoute })
      "
      [formGroup]="inputForm"
      inputType="number"
      controlName="itnCount"
      title="How many Labels you want to create?"
      [isvalid]="this.inputForm.valid"
    ></single-input-form>
  `,
})
export class ItnCountComponent {
  data$;
  inputForm = new FormGroup({
    itnCount: new FormControl<number>(1, [
      Validators.required,
      Validators.min(1),
    ]),
  });
  itnCount = inject(ItnCountService);
  router = inject(Router);
  actRoute = inject(ActivatedRoute);

  constructor(private _ui: TabService) {
    this._ui.changeSteps(3);
    this.data$ = of(true);
  }

  submit() {
    if (this.inputForm.invalid) {
      return;
    }
    this.itnCount.update(Math.trunc(this.inputForm.get('itnCount').value));
    this.router.navigate(['../../label/assign'], { relativeTo: this.actRoute });
  }
}
