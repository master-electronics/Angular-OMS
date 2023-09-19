import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { map } from 'rxjs';
import { SubmitButtonComponent } from 'src/app/shared/ui/button/submit-button.component';
import { ItnListComponent } from '../../ui/itn-list.component';

@Component({
  standalone: true,
  imports: [CommonModule, ItnListComponent, SubmitButtonComponent],
  template: `
    <h1 class=" text-base sm:text-lg md:mx-16  md:text-2xl lg:text-4xl">
      Personal Location Contents
    </h1>
    <itn-list [ItnList]="data$ | async"></itn-list>
    <div
      class="grid h-12 w-full grid-cols-3 gap-3 sm:h-16 md:mt-6 md:h-24 lg:h-36"
    >
      <submit-button
        buttonText="Continue"
        (buttonClick)="onSubmit()"
      ></submit-button>
    </div>
  `,
})
export class UserItnlistComponent {
  public data$;
  constructor(private _router: Router, private _actRoute: ActivatedRoute) {
    this.data$ = this._actRoute.data.pipe(map((res) => res.ItnList));
  }

  onSubmit(): void {
    this._router.navigate(['../'], { relativeTo: this._actRoute });
  }
}
