import {
  Component,
  OnInit,
  AfterViewInit,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { ToteBarcodeRegex } from '../../../shared/dataRegex';
import { CommonService } from '../../../shared/services/common.service';
import { Title } from '@angular/platform-browser';
import {
  AggregationInService,
  endContainer,
  outsetContainer,
} from '../aggregation-in.server';

@Component({
  selector: 'verify-tote',
  templateUrl: './verify-tote.component.html',
})
export class VerifyToteComponent implements OnInit, AfterViewInit {
  endContainer: endContainer;
  outsetContainer: outsetContainer;
  alertType = 'error';
  alertMessage = '';

  containerForm = this._fb.group({
    container: [
      '',
      [Validators.required, Validators.pattern(ToteBarcodeRegex)],
    ],
  });

  constructor(
    private _fb: FormBuilder,
    private _router: Router,
    private _titleService: Title,
    private _commonService: CommonService,
    private _agInService: AggregationInService
  ) {
    this._commonService.changeNavbar('Verify Tote');
    this._titleService.setTitle('agIn/verify-tote');
  }

  @ViewChild('container') containerInput: ElementRef;
  ngOnInit(): void {
    this.endContainer = this._agInService.endContainer;
    this.outsetContainer = this._agInService.outsetContainer;
    if (!this.endContainer || !this.outsetContainer) {
      this._router.navigate(['agin']);
      return;
    }
  }

  ngAfterViewInit(): void {
    this.containerInput.nativeElement.select();
  }

  onSubmit(): void {
    this.alertMessage = '';
    if (this.containerForm.invalid) {
      this.containerInput.nativeElement.select();
      return;
    }
    if (
      this.endContainer.type === 'shelf' &&
      this.containerForm.get('container').value !== this.outsetContainer.Barcode
    ) {
      this.alertMessage = 'Please sacn the start tote.';
      this.containerInput.nativeElement.select();
      return;
    }
    if (
      this.endContainer.type === 'tote' &&
      this.containerForm.get('container').value !== this.endContainer.Barcode
    ) {
      this.alertMessage = 'Please sacn the end tote.';
      this.containerInput.nativeElement.select();
      return;
    }
    this._router.navigate(['agin/verifyitn']);
  }
}
