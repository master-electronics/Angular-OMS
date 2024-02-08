import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Observable, catchError, map, of, tap } from 'rxjs';
import { HDIService } from 'src/app/shared/data/hdi';
import { GreenButtonComponent } from 'src/app/shared/ui/button/green-button.component';
import { RedButtonComponent } from 'src/app/shared/ui/button/red-button.component';
import { MessageBarComponent } from 'src/app/shared/ui/message-bar.component';

@Component({
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    RouterModule,
    GreenButtonComponent,
    RedButtonComponent,
    MessageBarComponent,
  ],
  template: `
    <div class="px-1 py-4">
      <div class="grid grid-rows-2 justify-center gap-10">
        <green-button
          class="h-16 w-32"
          buttonText="Add"
          (buttonClick)="add()"
        ></green-button>
        <red-button
          class="h-16 w-32"
          buttonText="Remove"
          (buttonClick)="remove()"
        ></red-button>
      </div>

      <div *ngIf="change$ | async as info">
        <message-bar [name]="info.name" [message]="info.message"></message-bar>
      </div>
    </div>
  `,
})
export class WeightScaleSettingComponent {
  public change$: Observable<{ name: string; message: string }>;
  constructor(private _router: Router, private _hdi: HDIService) {}

  add(): void {
    this.change$ = this._hdi.addWeightScale$().pipe(
      map(() => ({
        name: 'success',
        message: 'Enable weight scale',
      })),
      catchError((error) => of({ name: 'error', message: error.message }))
    );
  }

  remove() {
    this.change$ = this._hdi.removeWeightScale$().pipe(
      map(() => ({
        name: 'success',
        message: 'Disable weight scale',
      })),
      catchError((error) => of({ name: 'error', message: error.message }))
    );
  }

  onBack(): void {
    this._router.navigateByUrl('/home');
  }
}
