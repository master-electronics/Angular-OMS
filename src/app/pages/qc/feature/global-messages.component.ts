import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  HostListener,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, map } from 'rxjs';

@Component({
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule],
  template: `
    <div *ngIf="data$ | async as data">
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
    <div class="grid grid-cols-2 justify-center">
      <button class="btn btn-primary">Primary</button>
      <button class="btn btn-neutral">Neutral</button>
    </div>
  `,
})
export class GlobalMessagesComponent {
  public data$: Observable<{ orderLine: string[]; part: string[] }>;
  constructor(
    private _actRoute: ActivatedRoute,
    private _router: Router
  ) {
    this.data$ = this._actRoute.data.pipe(
      map((res) => {
        return {
          orderLine: res.messages.fetchOrderLineMessage?.comments,
          part: res.messages.fetchPartMessage?.comments,
        };
      })
    );
  }

  @HostListener('document:keydown', ['$event'])
  onKeyDownHandler(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      this.onSubmit();
    }
  }

  onSubmit(): void {
    this._router.navigate(['../verify'], { relativeTo: this._actRoute });
  }

  onBack(): void {
    this._router.navigate(['../'], { relativeTo: this._actRoute });
  }
}
