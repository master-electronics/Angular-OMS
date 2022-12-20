import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { map, of } from 'rxjs';
import { SubmitButtonComponent } from 'src/app/shared/ui/button/submit-button.component';
import { ItnListComponent } from '../../ui/itn-list.component';

@Component({
  standalone: true,
  imports: [CommonModule, ItnListComponent, SubmitButtonComponent],
  template: `
    <h1>Personal Location Contents</h1>
    <itn-list [ItnList]="data$ | async"></itn-list>
    <submit-button
      buttonText="Continue"
      (buttonClick)="onSubmit()"
      )
    ></submit-button>
  `,
})
export class UserItnlistComponent implements OnInit {
  constructor(private _router: Router, private _actRoute: ActivatedRoute) {}
  public data$;

  ngOnInit(): void {
    this.data$ = this._actRoute.data.pipe(map((res) => res.ItnList));
  }

  onSubmit(): void {
    this._router.navigate(['../'], { relativeTo: this._actRoute });
  }
}
