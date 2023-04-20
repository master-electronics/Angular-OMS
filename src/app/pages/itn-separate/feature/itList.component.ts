import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ItnSeparateService } from '../data/itn-separate.service';
import { SubmitButtonComponent } from 'src/app/shared/ui/button/submit-button.component';
import { GreenButtonComponent } from 'src/app/shared/ui/button/green-button.component';
import { PrinterService } from 'src/app/shared/data/printer';
import { map } from 'rxjs';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    SubmitButtonComponent,
    GreenButtonComponent,
  ],
  template: `
    <div class="grid gap-6">
      <h1 class=" text-lg">Check All ITN Labels.</h1>
      <div
        class="block justify-items-end text-black md:text-lg lg:text-xl"
        *ngFor="let itn of this.itn.newItnList"
      >
        <div class="grid grid-cols-3">
          <span class="mr-2 font-medium">{{ itn.ITN }}:</span>
          <span class="text-blue-600">{{ itn.Quantity }}</span>
          <!-- <green-button
            class="h-8"
            buttonText="Re-print"
            [disabled]="print$ | async"
            (buttonClick)="printITN(itn.ITN)"
          ></green-button> -->
        </div>
      </div>
      <div class="mt-8 grid h-16 w-full gap-6 md:h-32 md:text-4xl">
        <submit-button buttonText="Done" (buttonClick)="onSubmit()">
        </submit-button>
      </div>
    </div>
  `,
})
export class ItnListComponent implements OnInit {
  public print$;
  constructor(
    public itn: ItnSeparateService,
    private _actRoute: ActivatedRoute,
    private _router: Router,
    private _printer: PrinterService
  ) {}

  ngOnInit(): void {
    //
  }

  printITN(ITN: string): void {
    this.print$ = this._printer
      .printITN$(ITN, this.itn.itnInfo.ProductCode, this.itn.itnInfo.PartNumber)
      .pipe(map(() => true));
  }

  onSubmit(): void {
    this._router.navigate(['../scan'], {
      relativeTo: this._actRoute,
    });
  }
}
