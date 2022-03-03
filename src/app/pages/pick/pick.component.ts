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

import { CommonService } from '../../shared/services/common.service';
import { CartBarcodeRegex } from '../../shared/dataRegex';
import { catchError, map, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { PickService } from './pick.server';
import {
  FetchPickingSettingsGQL,
  VerifyCartBarcodeGQL,
} from 'src/app/graphql/pick.graphql-gen';

@Component({
  selector: 'pick',
  templateUrl: './pick.component.html',
})
export class PickComponent implements OnInit, AfterViewInit {
  title = 'Pick';
  isLoading = true;
  alertType = 'error';
  alertMessage = '';
  submit$ = new Observable();
  init$ = new Observable();

  containerForm = new FormGroup({
    containerNumber: new FormControl('', [
      Validators.required,
      Validators.pattern(CartBarcodeRegex),
    ]),
  });
  get f(): { [key: string]: AbstractControl } {
    return this.containerForm.controls;
  }

  constructor(
    private _commonService: CommonService,
    private _router: Router,
    private _titleService: Title,
    private _verifyCart: VerifyCartBarcodeGQL,
    private _pickService: PickService,
    private _fetchSettings: FetchPickingSettingsGQL
  ) {
    this._commonService.changeNavbar(this.title);
    this._titleService.setTitle('Pick a Cart');
  }

  @ViewChild('containerNumber') containerInput!: ElementRef;
  ngOnInit(): void {
    const userID = Number(JSON.parse(sessionStorage.getItem('userInfo'))._id);
    this.init$ = this._fetchSettings
      .fetch(
        {
          UserInfo: {
            _id: userID,
          },
        },
        { fetchPolicy: 'network-only' }
      )
      .pipe(
        tap((res) => {
          if (res.data.findUserInfo[0].Zone === null)
            throw 'User has no zone assigned!';

          if (res.data.findUserInfo[0].StrictPriority === null)
            throw 'User has no Strict Priority assigned!';

          if (res.data.findUserInfo[0].PriorityCutoff === null)
            throw 'User has no Priority lvl assigned!';
        }),
        map((res) => {
          this.isLoading = false;
          this._pickService.changePickSettings({
            Zone: res.data.findUserInfo[0].Zone,
            StrictPriority: res.data.findUserInfo[0].StrictPriority,
            PriorityCutoff: res.data.findUserInfo[0].PriorityCutoff,
          });
        }),
        catchError((err) => {
          this.alertMessage = err;
          this.alertType = 'error';
          return err;
        })
      );
  }
  ngAfterViewInit(): void {
    setTimeout(() => {
      this.containerInput.nativeElement.select();
    }, 10);
  }

  onSubmit(): void {
    this.alertMessage = '';
    if (!this.containerForm.valid || this.isLoading) {
      this.containerInput.nativeElement.select();
      return;
    }
    this.isLoading = true;
    this.submit$ = this._verifyCart
      .fetch(
        {
          Container: {
            DistributionCenter: environment.DistributionCenter,
            Barcode: this.containerForm.value.containerNumber,
          },
        },
        { fetchPolicy: 'network-only' }
      )

      .pipe(
        tap((res) => {
          const container = res.data.findContainer;
          if (!container?.length) throw 'Cart not found!';
          if (container[0].CONTAINERs.length !== 0)
            throw 'The Cart is not empty!';
        }),
        map(() => {
          this.isLoading = false;
          this._router.navigate(['pick/position']);
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
}
