import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InsertAutostoreAsnGQL } from 'src/app/graphql/autostoreASN.graphql-gen';
import { GreenButtonComponent } from 'src/app/shared/ui/button/green-button.component';
import { NormalButtonComponent } from 'src/app/shared/ui/button/normal-button.component';
import { SubmitButtonComponent } from 'src/app/shared/ui/button/submit-button.component';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    GreenButtonComponent,
    NormalButtonComponent,
    SubmitButtonComponent,
  ],
  template: `
    <div class="text-base sm:text-lg md:mx-16  md:text-2xl lg:text-4xl">
      <div
        class="grid h-12 w-full grid-cols-4 gap-3 sm:h-16 md:mt-6 md:h-24 lg:h-36"
      >
        <div></div>
        <div class="col-span-2">
          <green-button buttonText="New ASN" (buttonClick)="createASN()">
          </green-button>
        </div>
        <div></div>
      </div>
      <div
        class="grid h-12 w-full grid-cols-4 gap-3 sm:h-16 md:mt-6 md:h-24 lg:h-36"
      ></div>
      <div
        class="grid h-12 w-full grid-cols-4 gap-3 sm:h-16 md:mt-6 md:h-24 lg:h-36"
      >
        <div></div>
        <div class="col-span-2">
          <submit-button
            buttonText="Continue ASN"
            (buttonClick)="continueASN()"
          >
          </submit-button>
        </div>
        <div></div>
      </div>
      <div
        class="grid h-12 w-full grid-cols-4 gap-3 sm:h-16 md:mt-6 md:h-24 lg:h-36"
      ></div>
      <div
        class="grid h-12 w-full grid-cols-4 gap-3 sm:h-16 md:mt-6 md:h-24 lg:h-36"
      >
        <div></div>
        <div class="col-span-2">
          <normal-button buttonText="Back" (buttonClick)="back()">
          </normal-button>
        </div>
        <div></div>
      </div>
    </div>
    <div *ngIf="insertASN$ | async"></div>
  `,
})
export class CreateASN implements OnInit {
  constructor(
    private _insertASN: InsertAutostoreAsnGQL,
    private _actRoute: ActivatedRoute,
    private _router: Router
  ) {}
  insertASN$;
  ngOnInit(): void {
    //
  }

  createASN() {
    this._insertASN
      .mutate({
        asn: {
          tuType: 'BIN-1x1',
          Status: 'Open',
        },
      })
      .subscribe({
        next: (res) => {
          console.log(res);
        },
        error: (error) => {
          console.log(error);
        },
        complete: () => {
          this._router.navigate(['../scan-itn'], {
            relativeTo: this._actRoute,
          });
        },
      });
  }

  continueASN() {
    this._router.navigate(['../scan-asn'], {
      relativeTo: this._actRoute,
    });
  }

  back() {
    this._router.navigate(['/home']);
  }
}
