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
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { PickService } from '../pick.server';
import { FindNextItnForPullingGQL } from 'src/app/graphql/pick.graphql-gen';

@Component({
  selector: 'pull-itn',
  templateUrl: './pull-itn.component.html',
})
export class PullITNComponent implements OnInit, AfterViewInit {
  title = 'Pull ITN';
  isLoading = false;
  alertType = 'error';
  alertMessage = '';
  query$ = new Observable();
  inputRegex = /^(\w{2}\d{8})|(\w{2}-\w{2}-\d{2}-\d{2}-[A-Z]-\d{2})$/;
  location = '';
  ITN = '';

  inputForm = new FormGroup({
    barcodeInput: new FormControl('', [
      Validators.required,
      Validators.pattern(this.inputRegex),
    ]),
  });
  get f(): { [key: string]: AbstractControl } {
    return this.inputForm.controls;
  }

  constructor(
    private _commonService: CommonService,
    private _router: Router,
    private _titleService: Title,
    private _pickService: PickService,
    private _findNextITN: FindNextItnForPullingGQL
  ) {
    this._commonService.changeNavbar(this.title);
    this._titleService.setTitle('Pick a Cart');
  }

  @ViewChild('barcodeInput') barcodeInput!: ElementRef;
  ngOnInit(): void {
    //
  }
  ngAfterViewInit(): void {
    setTimeout(() => {
      this.barcodeInput.nativeElement.select();
    }, 10);
  }

  onSubmit(): void {
    this.alertMessage = '';
    if (!this.inputForm.valid || this.isLoading) {
      this.barcodeInput.nativeElement.select();
      return;
    }
    this.isLoading = true;
    this.query$ = this._findNextITN
      .fetch(
        {
          Zone: this._pickService.pickSettings.Zone,
          StrictPriority: this._pickService.pickSettings.StrictPriority,
          PriorityCutoff: this._pickService.pickSettings.PriorityCutoff,
          Barcode: this._pickService.lastPosition,
        },
        { fetchPolicy: 'network-only' }
      )

      .pipe(
        tap((res) => {
          const targetITN = res.data.findNextITNForPulling;
        }),
        map(() => {
          this.isLoading = false;
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
