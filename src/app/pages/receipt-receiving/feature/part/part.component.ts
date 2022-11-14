import { Component, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { ReceivingService } from '../../data/receiving.server';
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { SingleInputformComponent } from '../../ui/single-input-form.component';
import { CommonModule } from '@angular/common';
import { SimpleKeyboardComponent } from 'src/app/shared/ui/simple-keyboard.component';
import { PartStore } from '../../data/part';
import { ReceivingUIStateStore } from '../../data/ui-state';
import { tap } from 'rxjs';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    SingleInputformComponent,
    ReactiveFormsModule,
    SimpleKeyboardComponent,
  ],

  template: `
    <single-input-form
      (back)="onBack()"
      (submit)="onSubmit()"
      [data]="data$ | async"
      [formGroup]="inputForm"
      controlName="partNumber"
      title="Part #"
    ></single-input-form>
    <simple-keyboard
      [inputFromParent]="inputForm.value.partNumber"
      (outputFromChild)="onChange($event)"
    ></simple-keyboard>
  `,
})
export class PartComponent implements OnInit {
  public inputForm: FormGroup;
  public data$;

  constructor(
    private _router: Router,
    private _partStore: PartStore,
    private _ui: ReceivingUIStateStore
  ) {}

  ngOnInit(): void {
    this._ui.changeSteps(1);
    this.inputForm = new FormGroup({
      partNumber: new FormControl('', [Validators.required]),
    });
    console.log(this._partStore.receiptHeader);
    this.data$ = this._partStore.part$;
  }

  partNumberSearch(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;

      if (!value) {
        return null;
      }
      const isVaild = true;
      return !isVaild ? { filter: true } : null;
    };
  }

  onChange = (input: string) => {
    this.inputForm.setValue({ partNumber: input });
  };

  onSubmit(): void {
    //
  }

  onBack(): void {
    this._router.navigate(['receiptreceiving/receipt']);
  }
}
