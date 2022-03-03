import {
  Component,
  OnInit,
  AfterViewInit,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { ITNBarcodeRegex } from '../../../shared/dataRegex';

@Component({
  selector: 'drop-off',
  templateUrl: './drop-off.component.html',
})
export class DropOffComponent implements OnInit, AfterViewInit {
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
    private _fb: FormBuilder,
    private _router: Router,
    private _route: ActivatedRoute
  ) {}

  @ViewChild('containerNumber') containerInput: ElementRef;
  ngOnInit(): void {
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
    //
  }
}
