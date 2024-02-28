import { CommonModule } from '@angular/common';
import { Component, ChangeDetectionStrategy } from '@angular/core';
import { NzImageModule } from 'ng-zorro-antd/image';
import {
  ControlContainer,
  FormGroup,
  ReactiveFormsModule,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  standalone: true,
  selector: 'verify-info',
  imports: [CommonModule, NzImageModule, ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <form [formGroup]="inputForm">
      <div class="grid grid-cols-3 gap-4">
        <!-- Date code -->
        <input
          type="text"
          placeholder="Type here"
          class="input input-bordered w-full max-w-xs"
        />
        <!-- ROHS -->
        <div>
          <input type="radio" name="radio-1" class="radio" checked />
          <input type="radio" name="radio-1" class="radio" />
        </div>
      </div>
    </form>
  `,
})
export class VerifyInfoComponent {
  public inputForm: FormGroup;
  public isDisable = true;

  constructor(
    private controlContainer: ControlContainer,
    private _router: Router,
    private _route: ActivatedRoute
  ) {
    this.inputForm = this.controlContainer.control as FormGroup;
  }

  public edit(): void {
    this.isDisable = false;
  }

  public onHold(): void {
    this._router.navigate(['../onhold'], { relativeTo: this._route });
  }
}
