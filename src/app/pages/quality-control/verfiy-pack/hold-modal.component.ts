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
} from '../../../graphql/forQualityControl.graphql-gen';
import { CommonService } from '../../../shared/services/common.service';

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
    private commonService: CommonService
  ) {
    //
  }

  @ViewChild('holdInput') holdInput: ElementRef;
  ngAfterViewInit(): void {
    this.holdInput.nativeElement.select();
  }

  holdOptions = [
    { id: 1, content: 'Short Quantity' },
    { id: 2, content: 'Damaged' },
    { id: 3, content: 'Bad D/C' },
    { id: 4, content: 'Wrong Parts' },
    { id: 5, content: 'Waiting C of C' },
    { id: 6, content: 'Mixed Parts' },
    { id: 7, content: 'Hardware' },
    { id: 8, content: 'Non-Conforming' },
    { id: 9, content: 'Over Shipment' },
  ];

  onSubmit(): void {
    const Status = this.holdForm.get('holdReason').value;
    const qcHoldOrderInfo = {
      InternalTrackingNumber: this.ITN,
      Status: String(Status).padStart(2, '3'),
      Station: this.commonService.stationInfo,
    };
    this.isLoading = true;
    this.writeInfoToMerp(qcHoldOrderInfo);
  }

  onCancel(): void {
    this.isModalHiddenChange.emit(true);
  }

  writeInfoToMerp(holdInfo: HoldQcOrderMutationVariables): void {
    this.subscription.add(
      this.holdQCOrder.mutate(holdInfo, { fetchPolicy: 'no-cache' }).subscribe(
        (res) => {
          let response: { type: string; message: string };
          if (res.data.holdQCOrder.success) {
            response = {
              type: `warning`,
              message: `${this.ITN} is on hold.`,
            };
          } else {
            response = {
              type: 'error',
              message: `${this.ITN} hold failed. ${res.data.holdQCOrder.message}`,
            };
          }
          this.router.navigate(['qc'], {
            queryParams: response,
          });
          this.isLoading = false;
        },
        (error) => {
          this.router.navigate(['qc'], {
            queryParams: {
              type: `error`,
              message: `${this.ITN} hold failed.${error}`,
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
