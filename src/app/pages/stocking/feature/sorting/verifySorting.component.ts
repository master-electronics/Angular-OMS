import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { SubmitButtonComponent } from 'src/app/shared/ui/button/submit-button.component';
import { ItnInfoService } from '../../data/itn-info.service';

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
export class VerifySortingComponent {
  constructor(
    private _actRoute: ActivatedRoute,
    private _router: Router,
    public itn: ItnInfoService
  ) {}

  onSubmit(): void {
    this._router.navigate(['../itn'], { relativeTo: this._actRoute });
  }
}
