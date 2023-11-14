import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ItnInfoService } from '../../../data/itn-info.service';
import { StockingService } from '../../../data/stocking.service';
import { SubmitButtonComponent } from 'src/app/shared/ui/button/submit-button.component';

@Component({
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, RouterModule, SubmitButtonComponent],
  template: `
    <div class="text-base sm:text-lg md:mx-16  md:text-2xl lg:text-4xl">
      <p class="text-blue-600 ">{{ itn.itnInfo().ITN }}</p>
      <p>has been move to location</p>
      <p class="text-blue-600">{{ itn.itnInfo().BinLocation }}</p>
    </div>

    <div
      class="grid  h-12 w-full grid-cols-3 text-base sm:h-16 md:mx-16 md:mt-6 md:h-24  md:text-2xl lg:bottom-10 lg:h-36 lg:text-4xl"
    >
      <submit-button (buttonClick)="onSubmit()"></submit-button>
    </div>
  `,
})
export class ConformRelocationComponent {
  constructor(
    private _actRoute: ActivatedRoute,
    private _router: Router,
    private _stock: StockingService,
    public itn: ItnInfoService
  ) {}

  onSubmit(): void {
    if (
      this._stock.verifiedItns()?.length !== this._stock.checkedItns()?.length
    ) {
      this._router.navigate(['../checkitns'], {
        relativeTo: this._actRoute,
      });
      return;
    }
    this._router.navigate(['../user'], { relativeTo: this._actRoute });
  }
}
