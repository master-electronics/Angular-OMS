import {
  Component,
  OnInit,
  AfterViewInit,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { Title } from '@angular/platform-browser';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

import { CommonService } from '../../../shared/services/common.service';
import { ShelfBarcodeBarcodeRegex } from '../../../shared/dataRegex';
import { catchError, map, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { PickService } from '../pick.server';
import { VerifyPositionBarcodeForPullingGQL } from 'src/app/graphql/pick.graphql-gen';

@Component({
  selector: 'position',
  templateUrl: './position.component.html',
})
export class PositionComponent implements OnInit, AfterViewInit {
  title = 'Position';
  isLoading = false;
  alertType = 'error';
  alertMessage = '';
  submit$ = new Observable();
  init$ = new Observable();

  positionForm = new FormGroup({
    positionNumber: new FormControl('', [
      Validators.required,
      Validators.pattern(ShelfBarcodeBarcodeRegex),
    ]),
  });
  get f(): { [key: string]: AbstractControl } {
    return this.positionForm.controls;
  }

  constructor(
    private _commonService: CommonService,
    private _router: Router,
    private _titleService: Title,
    private _pickService: PickService,
    private _verifyPosition: VerifyPositionBarcodeForPullingGQL
  ) {
    this._commonService.changeNavbar(this.title);
    this._titleService.setTitle(this.title);
  }

  @ViewChild('positionNumber') positionInput!: ElementRef;
  ngAfterViewInit(): void {
    setTimeout(() => {
      this.positionInput.nativeElement.select();
    }, 10);
  }

  ngOnInit(): void {
    if (!this._pickService.pickSettings) {
      this._router.navigate(['pick']);
    }
  }

  onSubmit(): void {
    this.alertMessage = '';
    this.alertMessage = '';
    if (!this.positionForm.valid || this.isLoading) {
      return;
    }
    const barcodeInput = this.f.positionNumber.value;
    const Barcode = barcodeInput.replace(/-/g, '');
    if (!this.positionForm.valid || this.isLoading) {
      this.positionInput.nativeElement.select();
      return;
    }
    this.isLoading = true;
    this.submit$ = this._verifyPosition
      .fetch(
        {
          Container: {
            DistributionCenter: environment.DistributionCenter,
            Barcode,
          },
        },
        { fetchPolicy: 'network-only' }
      )

      .pipe(
        tap((res) => {
          const position = res.data.findContainer;
          if (!position?.length) throw 'Cart not found!';
        }),
        map(() => {
          this.isLoading = false;
          this._pickService.changeLastPosition(Barcode);
          this._router.navigate(['pick/pullitn']);
          return true;
        }),
        catchError((err) => {
          this.alertMessage = err;
          this.alertType = 'error';
          this.isLoading = false;
          return [];
        })
      );
  }

  dropOff(): void {
    this._router.navigate(['pick/dropoff']);
  }
}
