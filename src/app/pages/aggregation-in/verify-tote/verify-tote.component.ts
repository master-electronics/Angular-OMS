import {
  Component,
  OnInit,
  AfterViewInit,
  ViewChild,
  ElementRef,
} from '@angular/core';
import {
  UntypedFormBuilder,
  Validators,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { Router } from '@angular/router';

import { ToteBarcodeRegex } from '../../../shared/utils/dataRegex';
import { CommonService } from '../../../shared/services/common.service';
import { Title } from '@angular/platform-browser';
import {
  AggregationInService,
  endContainer,
  outsetContainer,
} from '../aggregation-in.server';
import { NzAlertModule } from 'ng-zorro-antd/alert';
import { NzWaveModule } from 'ng-zorro-antd/core/wave';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NgIf } from '@angular/common';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { FocusInvlidInputDirective } from '../../../shared/directives/focusInvalidInput.directive';
import { NzFormModule } from 'ng-zorro-antd/form';

@Component({
  selector: 'verify-tote',
  templateUrl: './verify-tote.component.html',
  standalone: true,
  imports: [
    FormsModule,
    NzFormModule,
    FocusInvlidInputDirective,
    ReactiveFormsModule,
    NzGridModule,
    NgIf,
    NzInputModule,
    NzButtonModule,
    NzWaveModule,
    NzAlertModule,
  ],
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
    private _fb: UntypedFormBuilder,
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
