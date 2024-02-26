import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { NzDescriptionsModule } from 'ng-zorro-antd/descriptions';
import { SingleInputformComponent } from 'src/app/shared/ui/input/single-input-form.component';

@Component({
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    RouterModule,
    SingleInputformComponent,
    CommonModule,
    ReactiveFormsModule,
    NzDescriptionsModule,
  ],
  template: `
    <div *ngIf="data">
      <h2 class="text-xl font-semibold text-gray-900">Order Line Messages:</h2>
      <ul
        *ngFor="let message of data.orderLine"
        class="max-w-md ml-4 space-y-1 text-gray-500 text-xl list-inside "
      >
        <li>
          {{ message }}
        </li>
      </ul>
      <h2 class="text-xl font-semibold text-gray-900">Part Messages:</h2>
      <ul
        *ngFor="let message of data.part"
        class="max-w-md ml-4 space-y-1 text-gray-500 text-xl list-inside "
      >
        <li>
          {{ message }}
        </li>
      </ul>
    </div>
  `,
})
export class RepackComponent {
  public data;
  constructor(
    private _fb: FormBuilder,
    private _actRoute: ActivatedRoute,
    private _router: Router
  ) {
    this.data = this._actRoute.data.pipe();
  }

  onSubmit(): void {
    //
  }

  onBack(): void {
    this._router.navigate(['../'], { relativeTo: this._actRoute });
  }
}
