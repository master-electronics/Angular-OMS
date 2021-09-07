import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  OnDestroy,
  Output,
  ViewChild,
} from '@angular/core';
import { Subscription } from 'rxjs';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import {
  HoldQcOrderGQL,
  HoldQcOrderMutationVariables,
} from '../../../graphql/qualityControl.graphql-gen';
import { CommonService } from '../../../shared/services/common.service';
import { Title } from '@angular/platform-browser';
import { environment } from 'src/environments/environment';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'hold-modal',
  templateUrl: './hold-modal.component.html',
})
export class HoldModalComponent implements OnDestroy, AfterViewInit {
  isLoading = false;
  @Input() isHoldModalHidden: boolean;
  @Input() ITN: string;
  @Output() isModalHiddenChange = new EventEmitter<boolean>();

  holdForm = this.fb.group({
    holdReason: [1, Validators.required],
  });
  private subscription = new Subscription();
  constructor(
    private holdQCOrder: HoldQcOrderGQL,
    private fb: FormBuilder,
    private router: Router,
    private commonService: CommonService,
    private titleService: Title
  ) {}

  @ViewChild('holdInput') holdInput: ElementRef;
  ngAfterViewInit(): void {
    setTimeout(() => {
      this.holdInput.nativeElement.select();
    }, 50);
  }

  holdOptions = [
    { id: 1, content: 'Short Quantity' },
    { id: 2, content: 'Damaged' },
    { id: 3, content: 'Repackaging' },
    { id: 4, content: 'Wrong Parts' },
    { id: 5, content: 'Verify Quantity' },
    { id: 6, content: 'Mixed Parts' },
    { id: 7, content: 'Part Number Verification' },
    { id: 8, content: 'Kit Set' },
    { id: 9, content: 'Over Shipment' },
  ];

  onSubmit(): void {
    const Status = this.holdForm.get('holdReason').value;
    const qcHoldOrderInfo = {
      InternalTrackingNumber: this.ITN,
      Status: String(Status).padStart(2, '3'),
      Station: this.commonService.printerInfo,
      StatusID: environment.warehouseHold_ID,
    };
    this.isLoading = true;
    this.writeInfoToMerp(qcHoldOrderInfo);
  }

  onCancel(): void {
    this.isModalHiddenChange.emit(true);
  }

  writeInfoToMerp(holdInfo: HoldQcOrderMutationVariables): void {
    this.subscription.add(
      this.holdQCOrder.mutate(holdInfo).subscribe(
        (res) => {
          let type = '';
          let message = '';
          this.isLoading = false;
          if (!res.data.holdQCOrder.success) {
            type = 'error';
            message = `HOLDORDER api: ${res.data.holdQCOrder.message}\n`;
          }
          if (!res.data.updateOrderLineDetail[0]) {
            type = 'error';
            message = message.concat(`Fail to update SQL`);
          }
          message = `${this.ITN} hold failed\n`.concat(message);
          if (!type) {
            type = `warning`;
            message = `${this.ITN} is on hold.`;
          }
          this.router.navigate(['qc'], {
            queryParams: { type, message },
          });
        },
        (error) => {
          this.router.navigate(['qc'], {
            queryParams: {
              type: `error`,
              message: `${this.ITN} hold failed.\n${error}`,
            },
          });
          this.isLoading = false;
        }
      )
    );
  }

  @ViewChild('modal') modal: ElementRef;

  @HostListener('document:mousedown', ['$event'])
  onGlobalClick(event: MouseEvent): void {
    if (!this.modal.nativeElement.contains(event.target)) {
      this.onCancel();
    }
  }
  @HostListener('document:keydown', ['$event'])
  onKeyDownHandler(event: KeyboardEvent): void {
    if (event.key === 'Escape') {
      this.onCancel();
    }
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
