import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ItnInfoService } from '../data/itn-info.service';
import { StockingService } from '../data/stocking.service';

@Component({
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterModule],
  template: `
    <div class="container mx-auto px-2 py-2 text-lg md:mt-4">
      <div class="mt-5 grid justify-center gap-20 text-base">
        <a class="" routerLink="/stocking/itn">Sorting</a>
        <a class="" routerLink="/stocking/scantarget">Stocking</a>
        <a class="" routerLink="/stocking/personalitns">Personal ITNs</a>
        <a class="" routerLink="/stocking/movetouser">Move to Personal</a>
      </div>
    </div>
  `,
})
export class MenuComponent {
  constructor(
    private _itn: ItnInfoService,
    private _stocking: StockingService
  ) {
    _itn.reset();
    _stocking.reset();
  }
}
