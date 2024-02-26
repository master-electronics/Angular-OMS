import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GreenButtonComponent } from 'src/app/shared/ui/button/green-button.component';
import { NormalButtonComponent } from 'src/app/shared/ui/button/normal-button.component';

@Component({
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, GreenButtonComponent, NormalButtonComponent],
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
    <div class="grid grid-rows-2 justify-center gap-10">
      <green-button
        class="h-16 w-32"
        buttonText="Add"
        (buttonClick)="onSubmit()"
      ></green-button>
      <normal-button
        class="h-16 w-32"
        buttonText="Remove"
        (buttonClick)="onBack()"
      ></normal-button>
    </div>
  `,
})
export class GlobalMessagesComponent {
  public data;
  constructor(
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
