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

@Component({
  standalone: true,
  imports: [
    SingleInputformComponent,
    SimpleKeyboardComponent,
    ReactiveFormsModule,
  ],
  templateUrl: './part.component.html',
})
export class PartComponent {
  public keyboard: Keyboard;
  public isLoading = false;
  public title = `Part#`;
  public controlName = 'partNumber';
  public inputForm: FormGroup;
  public inputType = 'text';
  constructor(private _router: Router, private _service: ReceivingService) {
    this._service.changeTab(1);
    this.inputForm = new FormGroup({
      partNumber: new FormControl('', [
        Validators.required,
        this.partNumberSearch(),
      ]),
    });
  }
  partNumberList = [
    {
      PartNumber: 'wuzy',
      ProductCode: 'abc',
    },
  ];

  partNumberSearch(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;

      if (!value) {
        return null;
      }
      const isVaild = this.partNumberList.some((part) => {
        return part.PartNumber.toLowerCase() === value.toLowerCase();
      });
      return !isVaild ? { partNumberSearch: true } : null;
    };
  }

  ngOnInit(): void {
    //
  }

  ngAfterViewInit() {
    //
  }

  onChange = (input: string) => {
    this.inputForm.setValue({ partNumber: input });
  };

  onSubmit(): void {
    this._router.navigateByUrl('receiving/verify');
  }

  onBack(): void {
    this._router.navigateByUrl('receiving');
  }
}
