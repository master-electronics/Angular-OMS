import { CommonModule } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzInputModule } from 'ng-zorro-antd/input';
import { Observable } from 'rxjs';
import Keyboard from 'simple-keyboard';
import { SimpleKeyboardComponent } from 'src/app/shared/ui/simple-keyboard.component';
import { KickoutStore } from '../../data/kickout';
import { PartStore } from '../../data/part';

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
      <div class="grid grid-cols-3 gap-4">
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
      </div>
      <textarea
        rows="4"
        nz-input
        name="otherReason"
        formControlName="otherReason"
        #otherReason
      ></textarea>
      <div class="mb-10 flex">
        <button
          nz-button
          class="w-32"
          [disabled]="kickoutForm.invalid"
          nzType="primary"
          type="submit"
          nzSize="large"
        >
          kickout
        </button>
        <div class="grow"></div>
        <button
          nz-button
          type="button"
          class="w-32"
          (click)="onBack()"
          nzSize="large"
        >
          Back
        </button>
      </div>
    </form>
    <simple-keyboard
      [inputFromParent]="kickoutForm.value.otherReason"
      (outputFromChild)="onChange($event)"
    ></simple-keyboard>
  `,
})
export class KickoutComponent implements OnInit {
  public kickoutOptions = [];
  public kickoutForm: FormGroup;

  constructor(
    private _fb: FormBuilder,
    private _router: Router,
    private _kickout: KickoutStore,
    private _part: PartStore
  ) {}

  ngOnInit(): void {
    this.kickoutOptions = [
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
    this.kickoutForm = this._fb.group({
      kickoutReason: ['', Validators.required],
      otherReason: [''],
    });
    this._part.receiptLs;
  }

  @ViewChild('kickoutReason') InputKickout: ElementRef;
  ngAfterViewInit() {
    this.InputKickout.nativeElement.focus();
  }

  onChange = (input: string) => {
    this.kickoutForm.get('otherReason').setValue(input);
  };

  onBack(): void {
    this._router.navigateByUrl('recyyeiptreceiving/verify');
  }

  onSubmit(): void {
    this._router.navigateByUrl('receiptreceiving/kickout/scanlabel');
  }
}
