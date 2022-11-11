import { Component } from '@angular/core';
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
      [formGroup]="inputForm"
      [state]="data"
      [validator]="validator"
      controlName="partNumber"
      title="Part #"
    ></single-input-form>
    <simple-keyboard
      [inputFromParent]="inputForm.value.partNumber"
      (outputFromChild)="onChange($event)"
    ></simple-keyboard>
  `,
})
export class PartComponent {
  public inputForm: FormGroup;
  public data;
  public validator = {
    name: 'filter',
    message: 'Not Found part number!',
  };

  constructor(private _router: Router, private _service: ReceivingService) {
    this._service.changeTab(1);
    this.inputForm = new FormGroup({
      partNumber: new FormControl('', [
        Validators.required,
        this.partNumberSearch(),
      ]),
    });
    this.data = this._service.getValueReceiptH();
    if (!this.data.value) {
      this._router.navigate(['receiptreceiving']);
    }
  }

  partNumberSearch(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;

      if (!value) {
        return null;
      }
      const isVaild = this.data.value.some((part) => {
        return (
          part.Product.PartNumber.toLowerCase().trim() ===
          value.toLowerCase().trim()
        );
      });
      return !isVaild ? { filter: true } : null;
    };
  }

  onChange = (input: string) => {
    this.inputForm.setValue({ partNumber: input });
  };

  onSubmit(): void {
    this.data.value = this.data.value.filter(
      (line) =>
        line.Product.PartNumber.toLowerCase().trim() ===
        this.inputForm.value.partNumber.toLowerCase().trim()
    );
    this._service.changereceiptH(this.data);
    this._router.navigateByUrl('receiptreceiving/verify');
  }

  onBack(): void {
    this._router.navigate(['receiptreceiving/receipt']);
  }
}
