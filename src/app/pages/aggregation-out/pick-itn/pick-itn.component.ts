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
import { ActivatedRoute, Router } from '@angular/router';

import { ITNBarcodeRegex } from '../../../shared/utils/dataRegex';
import { AggregationOutService } from '../aggregation-out.server';
import { NzAlertModule } from 'ng-zorro-antd/alert';
import { NgIf, NgFor } from '@angular/common';
import { NzWaveModule } from 'ng-zorro-antd/core/wave';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { FocusInvlidInputDirective } from '../../../shared/directives/focusInvalidInput.directive';
import { NzFormModule } from 'ng-zorro-antd/form';

@Component({
  selector: 'pick-itn',
  templateUrl: './pick-itn.component.html',
  standalone: true,
  imports: [
    FormsModule,
    NzFormModule,
    FocusInvlidInputDirective,
    ReactiveFormsModule,
    NzGridModule,
    NzInputModule,
    NzButtonModule,
    NzWaveModule,
    NgIf,
    NzAlertModule,
    NgFor,
  ],
})
export class PickITNComponent implements OnInit, AfterViewInit {
  alertType = 'error';
  alertMessage = '';
  totalITNs = 0;
  itemList = [];
  selectedList = [];

  containerForm = this._fb.group({
    containerNumber: [
      '',
      [Validators.required, Validators.pattern(ITNBarcodeRegex)],
    ],
  });

  constructor(
    private _fb: UntypedFormBuilder,
    private _router: Router,
    private _route: ActivatedRoute,
    private _agOutService: AggregationOutService
  ) {}

  @ViewChild('containerNumber') containerInput: ElementRef;
  ngOnInit(): void {
    this.itemList = this._agOutService.selectedITNs;
    if (this.itemList == null) {
      this._router.navigate(['agout/picktote'], {
        queryParams: this._route.snapshot.queryParams,
      });
    }
    this.totalITNs = this.itemList.length;
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
      this.changeContainerList();
      this._router.navigate(['agout/picktote'], {
        queryParams: this._route.snapshot.queryParams,
      });
    } else if (count === 0) {
      this.alertMessage = `ITN is not in the list.`;
    }

    this.containerForm.reset({
      containerNumber: '',
    });
    this.containerInput.nativeElement.select();
    return;
  }

  changeContainerList(): void {
    let containerList = this._agOutService.containerList;
    const selectedContainerList = this._agOutService.selectedList || [];
    containerList = containerList.filter((node) => {
      const isEqual = node.Barcode === this._agOutService.pickedContainer;
      if (isEqual) {
        selectedContainerList.unshift(node);
      }
      return !isEqual;
    });
    this._agOutService.changeContainerList(containerList);
    this._agOutService.changeselectedList(selectedContainerList);
  }
}
