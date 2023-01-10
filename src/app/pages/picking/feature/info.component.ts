import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';
import { PickingService } from '../data/picking.service';
import { PickingInfoComponent } from '../ui/part-info.component';

@Component({
  standalone: true,
  imports: [CommonModule, PickingInfoComponent],
  template: ` <picking-info [info]="_picking.itnInfo"></picking-info> `,
})
export class InfoComponent implements OnInit {
  constructor(
    private _router: Router,
    private _actRoute: ActivatedRoute,
    public _picking: PickingService
  ) {}
  public data$;

  ngOnInit() {
    this.data$ = of(true);
  }

  onSubmit(): void {
    // this.data$ =
  }

  onBack(): void {
    this._router.navigate(['../itn'], { relativeTo: this._actRoute });
  }
}
