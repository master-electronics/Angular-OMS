import { CommonModule } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzInputModule } from 'ng-zorro-antd/input';
import Keyboard from 'simple-keyboard';
import { SimpleKeyboardComponent } from 'src/app/shared/ui/simple-keyboard.component';
import { ReceivingService } from '../../data/receiving.server';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    NzInputModule,
    ReactiveFormsModule,
    NzButtonModule,
    SimpleKeyboardComponent,
  ],
  template: `
    <form
      class="flex flex-col gap-5"
      [formGroup]="kickoutForm"
      (ngSubmit)="onSubmit()"
    >
      <div *ngFor="let option of kickoutOptions">
        <label>
          <input
            type="radio"
            name="kickoutReason"
            formControlName="kickoutReason"
            [value]="option.id"
            #kickoutReason
          />
          {{ option.content }}
        </label>
      </div>
      <textarea
        rows="4"
        nz-input
        name="otherReason"
        formControlName="otherReason"
        #otherReason
      ></textarea>
      <div class="mb-10 flex gap-5">
        <button
          nz-button
          class="w-32"
          [disabled]="kickoutForm.invalid"
          nzType="primary"
          type="submit"
          nzSize="large"
          [nzLoading]="isLoading"
        >
          kickout
        </button>
        <div class="grow"></div>
        <button
          nz-button
          type="button"
          class="w-32"
          (click)="cancal()"
          nzSize="large"
        >
          Cancel
        </button>
      </div>
    </form>
    <simple-keyboard
      [inputFromParent]="kickoutForm.value.otherReason"
      (outputFromChild)="onChange($event)"
    ></simple-keyboard>
  `,
})
export class LabelComponent {
  isLoading = false;
  keyboard: Keyboard;

  kickoutOptions = [
    { id: 1, content: 'Short Quantity' },
    { id: 2, content: 'Damaged' },
    { id: 3, content: 'Repackaging' },
    { id: 4, content: 'Wrong Parts' },
    { id: 5, content: 'Verify Quantity' },
    { id: 6, content: 'Mixed Parts' },
    { id: 7, content: 'Part Number Verification' },
    { id: 8, content: 'Kit Set' },
    { id: 0, content: 'Other' },
  ];

  kickoutForm = this._fb.group({
    kickoutReason: ['', Validators.required],
    otherReason: [''],
  });

  constructor(
    private _fb: FormBuilder,
    private _router: Router,
    private _service: ReceivingService
  ) {
    this._service.changeTab(2);
  }

  @ViewChild('kickoutReason') InputKickout: ElementRef;
  ngAfterViewInit() {
    this.InputKickout.nativeElement.focus();
  }

  onChange = (input: string) => {
    this.kickoutForm.get('otherReason').setValue(input);
  };

  cancal(): void {
    this._router.navigateByUrl('recyyeiptreceiving/verify');
  }

  onSubmit(): void {
    this._router.navigateByUrl('receiptreceiving/kickout/location');
  }
}
