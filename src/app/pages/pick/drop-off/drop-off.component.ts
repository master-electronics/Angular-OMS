import {
  Component,
  OnInit,
  AfterViewInit,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { throwServerError } from '@apollo/client/core';
import { Observable } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import {
  FindContainerGQL,
  FindItNsInCartForDropOffGQL,
  UpdateAfterDropOffGQL,
} from 'src/app/graphql/pick.graphql-gen';

import { ITNBarcodeRegex } from '../../../shared/dataRegex';
import { PickService } from '../pick.server';

@Component({
  selector: 'drop-off',
  templateUrl: './drop-off.component.html',
})
export class DropOffComponent implements OnInit, AfterViewInit {
  process = 'Pick ITN';
  hint = 'Pick ITNs in the cart';
  alertType = 'error';
  isLoading = false;
  alertMessage = '';
  totalITNs = 0;
  itemList = [];
  selectedList = [];
  submit$ = new Observable();
  init$ = new Observable();

  containerForm = this._fb.group({
    containerNumber: ['', [Validators.required]],
  });

  constructor(
    private _fb: FormBuilder,
    private _router: Router,
    private _service: PickService,
    private _findITNs: FindItNsInCartForDropOffGQL,
    private _updateForDropOff: UpdateAfterDropOffGQL,
    private _findContainer: FindContainerGQL
  ) {}

  @ViewChild('containerNumber') containerInput: ElementRef;
  ngOnInit(): void {
    if (!this._service.cartID) {
      this._router.navigate(['pick']);
    }
    this.init$ = this._findITNs
      .fetch(
        {
          Inventory: {
            ContainerID: this._service.cartID,
          },
        },
        { fetchPolicy: 'network-only' }
      )
      .pipe(
        tap((res) => {
          if (!res.data.findInventory) throw 'Not found any ITN in the cart';
        }),
        map((res) => {
          res.data.findInventory.forEach((node) => {
            this.itemList.push(node.InventoryTrackingNumber);
            this.totalITNs += 1;
          });
          return true;
        }),
        catchError((err) => {
          this.alertMessage = err;
          this.alertType = 'error';
          return err;
        })
      );
  }

  ngAfterViewInit(): void {
    this.containerInput.nativeElement.select();
  }

  onSubmit(): void {
    this.alertMessage = '';
    if (!this.containerForm.valid) {
      this.containerInput.nativeElement.select();
      return;
    }
    if (this.process === 'Drop off') {
      this.dropOff();
      return;
    }
    this.selectITN();
  }

  selectITN(): void {
    let count = 0;
    this.itemList = this.itemList.filter((node) => {
      const isEqual = node === this.containerForm.get('containerNumber').value;
      if (isEqual) {
        this.selectedList.unshift(node);
        count += 1;
      }
      return !isEqual;
    });
    if (this.totalITNs === this.selectedList.length) {
      this.process = 'Drop off';
      this.hint = `Scan Drop off position`;
    } else if (count === 0) {
      this.alertMessage = `ITN is not in the list.`;
    }

    this.containerForm.reset({
      containerNumber: '',
    });
    this.containerInput.nativeElement.select();
    return;
  }

  dropOff(): void {
    this.isLoading = true;
    this.submit$ = this._findContainer
      .fetch(
        {
          Container: {
            Barcode: this.containerForm
              .get('containerNumber')
              .value.replace(/-/g, '')
              .trim(),
          },
        },
        { fetchPolicy: 'network-only' }
      )
      .pipe(
        tap((res) => {
          if (res.data.findContainer.length === 0) {
            throw 'Container not found';
          }
        }),
        switchMap((res) => {
          const ContainerID = res.data.findContainer[0]._id;
          return this._updateForDropOff.mutate(
            {
              Inventory: {
                ContainerID,
              },
              ContainerID: this._service.cartID,
            },
            { fetchPolicy: 'network-only' }
          );
        }),
        map(() => {
          this._router.navigate(['pick'], {
            queryParams: {
              result: 'success',
              message: `Drop off in ${this.containerForm.get(
                'containerNumber'
              )} is successful.`,
            },
          });
        }),
        catchError((err) => {
          this.alertMessage = err;
          this.alertType = 'error';
          return err;
        })
      );
  }
}
