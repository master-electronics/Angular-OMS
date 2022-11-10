import { Component } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import Keyboard from 'simple-keyboard';
import { ReceivingService } from '../../data/receiving.server';
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { SingleInputformComponent } from '../../ui/single-input-form/single-input-form.component';
import { SimpleKeyboardComponent } from 'src/app/shared/ui/simple-keyboard/simple-keyboard.component';
import { filter, map, Observable, tap } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    SingleInputformComponent,
    SimpleKeyboardComponent,
    ReactiveFormsModule,
  ],
  templateUrl: './part.component.html',
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
