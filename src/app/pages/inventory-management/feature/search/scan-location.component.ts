import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SingleInputformComponent } from 'src/app/shared/ui/input/single-input-form.component';
import {
  ITNBarcodeRegex,
  ShelfBarcodeBarcodeRegex,
} from 'src/app/shared/utils/dataRegex';
import { catchError, map, of, switchMap, tap } from 'rxjs';
import { ReactiveFormsModule, Validators, FormBuilder } from '@angular/forms';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { FormsModule } from '@angular/forms';
import { PopupModalComponent } from 'src/app/shared/ui/modal/popup-modal.component';
import { ActivatedRoute, Router } from '@angular/router';
import { AuditInfoComponent } from '../../ui/audit-info.component';
import {
  Audit,
  AuditType,
  Inventory,
  Product,
  ProductCode,
  Container,
} from '../../utils/interfaces';
import { FindContainerGQL } from 'src/app/graphql/pick.graphql-gen';
import { environment } from 'src/environments/environment';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    SingleInputformComponent,
    ReactiveFormsModule,
    PopupModalComponent,
    NzModalModule,
    NzGridModule,
    FormsModule,
    AuditInfoComponent,
  ],
  template: `
    <ng-container *ngIf="info$ | async as info"> </ng-container>
    <div *ngIf="locations.length > 0">
      <div nz-row [nzGutter]="{ xs: 8, sm: 16, md: 24, lg: 32 }">
        <div nz-col nzSpan="14" class="text-black md:text-lg lg:text-xl">
          <span class="mr-2 font-medium" style="vertical-align: top"
            >Locations:</span
          >
          <div
            class="justify-self-start text-blue-600"
            style="display: inline-block;"
          >
            <div *ngFor="let location of locations">
              <span *ngIf="location.Status != 'done'">{{
                location.Barcode
              }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <single-input-form
      (formSubmit)="onSubmit()"
      (formBack)="onBack()"
      [data]="data$ | async"
      [formGroup]="inputForm"
      inputType="string"
      controlName="barcode"
      title="Scan Location:"
      [isvalid]="this.inputForm.valid"
    >
    </single-input-form>
  `,
})
export class ScanLocation implements OnInit {
  constructor(
    private _fb: FormBuilder,
    private _actRoute: ActivatedRoute,
    private _findContainer: FindContainerGQL,
    private _router: Router
  ) {}

  public data$;
  public info$;
  public inputForm = this._fb.nonNullable.group({
    barcode: ['', [Validators.required]],
  });

  auditInfo: Audit;
  locations: Container[];

  ngOnInit(): void {
    this.info$ = this._actRoute.data.pipe(
      map((res) => {
        const locs = JSON.parse(sessionStorage.getItem('searchLocations'));
        this.locations = [];

        if (locs) {
          locs.forEach((loc) => {
            this.locations.push({
              Barcode: loc.Barcode,
              Status: loc.Status == 'done' ? loc.Status : 'open',
            });
          });

          sessionStorage.setItem(
            'searchLocations',
            JSON.stringify(this.locations)
          );

          return of(true);
        }

        res.Location.forEach((location) => {
          this.locations.push({
            Barcode: location.Barcode,
            Status: 'open',
          });
        });
        this.auditInfo = {
          Container: {
            Barcode: res.Location[0].Barcode,
          },
        };

        sessionStorage.setItem(
          'searchLocations',
          JSON.stringify(this.locations)
        );
        return of(true);
      })
    );
    this.data$ = of(true);
  }

  onSubmit(): void {
    const barcode = this.inputForm.value.barcode.replace(/-/g, '').trim();
    const location = this.locations.find(
      (item) => item.Barcode == barcode && item.Status != 'done'
    );

    if (!location) {
      this.data$ = of({
        error: { message: 'Incorrect Location!', type: 'error' },
      });
    } else {
      this.data$ = this._findContainer
        .fetch(
          {
            Container: {
              DistributionCenter: environment.DistributionCenter,
              Barcode: barcode,
            },
          },
          { fetchPolicy: 'network-only' }
        )
        .pipe(
          tap((res) => {
            if (!res.data.findContainer) {
              throw new Error('Location not found');
            }
          }),
          map((res) => {
            const loc = this.locations.find((loc) => loc.Barcode == barcode);
            loc.Status = 'active';
            sessionStorage.setItem(
              'searchLocations',
              JSON.stringify(this.locations)
            );
            this._router.navigate(['../scan-itn'], {
              relativeTo: this._actRoute,
            });
          })
        );
    }
  }

  onBack(): void {
    //
  }
}
