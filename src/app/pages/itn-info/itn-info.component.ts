import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import * as _ from 'lodash';
import { NzSkeletonModule } from 'ng-zorro-antd/skeleton';
import { Subject, catchError, map, of, switchMap } from 'rxjs';
import {
  FetchProductVelocityGQL,
  FindInventoryGQL,
  UpdateProductVelocityGQL,
} from 'src/app/graphql/itn_info.graphql-gen';
import { SingleInputformComponent } from 'src/app/shared/ui/input/single-input-form.component';
import { ITNBarcodeRegex } from 'src/app/shared/utils/dataRegex';
import { environment } from 'src/environments/environment';

@Component({
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    SingleInputformComponent,
    NzSkeletonModule,
  ],
  template: `
    <div class="px-1 py-4">
      <single-input-form
        (formSubmit)="onSubmit()"
        (formBack)="onBack()"
        [formGroup]="inputForm"
        controlName="itn"
        title="ITN"
      ></single-input-form>
      <div *ngIf="data$ | async as data; else loading">
        <code class="block w-full text-sm">
          <pre>
            {{ data | json }}
          </pre
          >
        </code>
      </div>
      <ng-template #loading>
        <nz-skeleton
          [nzActive]="true"
          [nzParagraph]="{ rows: 8 }"
        ></nz-skeleton>
      </ng-template>
    </div>
  `,
})
export class ItnInfoComponent {
  public data$ = new Subject().asObservable();
  public update$ = new Subject().asObservable();
  public inputForm: FormGroup = new FormGroup({
    itn: new FormControl(null, [
      Validators.required,
      Validators.pattern(ITNBarcodeRegex),
    ]),
  });
  constructor(
    private router: Router,
    private _findInventory: FindInventoryGQL,
    private _fetchVelocity: FetchProductVelocityGQL,
    private _updaeVelocity: UpdateProductVelocityGQL
  ) {
    this.data$ = of('_');
  }

  onSubmit(): void {
    this.data$ = this._findInventory
      .fetch({
        DistributionCenter: environment.DistributionCenter,
        InventoryTrackingNumber: this.inputForm.value.itn.trim().toUpperCase(),
      })
      .pipe(
        map((res) => res.data.findInventory),
        switchMap((res) => {
          if (res.Product && !res.Product.Velocity.trim()) {
            return this.fetchAndUpdateVelocity(res);
          }
          return of(res);
        }),
        map((res) => this.pruneEmpty(res))
      );
  }

  fetchAndUpdateVelocity(data) {
    return this._fetchVelocity
      .fetch({
        PartNumber: data.Product.PartNumber,
        ProductCode: data.Product.ProductCode.ProductCodeNumber,
      })
      .pipe(
        switchMap((res) => {
          data.Product.Velocity = res;
          return this._updaeVelocity.mutate({
            _id: data.Product._id,
            Velocity: res.data.fetchProductVelocity,
          });
        }),
        map(() => data),
        catchError(() => {
          return of(data);
        })
      );
  }

  pruneEmpty(obj) {
    return (function prune(current) {
      _.forOwn(current, function (value, key) {
        if (
          _.isUndefined(value) ||
          _.isNull(value) ||
          _.isNaN(value) ||
          (_.isString(value) && _.isEmpty(value)) ||
          (_.isObject(value) && _.isEmpty(prune(value))) ||
          // remove following keys
          key === '_id' ||
          key === '__typename' ||
          (_.isString(value) && value.trim() === '')
        ) {
          delete current[key];
        }
      });
      // remove any leftover undefined values from the delete operation on an array
      if (_.isArray(current)) _.pull(current, undefined);

      return current;
    })(_.cloneDeep(obj)); // Do not modify the original object, create a clone instead
  }

  onBack(): void {
    this.router.navigateByUrl('/home');
  }
}
