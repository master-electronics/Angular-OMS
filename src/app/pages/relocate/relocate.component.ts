import {
  Component,
  OnInit,
  OnDestroy,
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
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { CommonService } from '../../shared/services/common.service';
import { ToteBarcodeRegex } from '../../shared/dataRegex';
import { VerifyContainerForAggregationInGQL } from '../../graphql/forAggregation.graphql-gen';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-relocate',
  templateUrl: './relocate.component.html',
})
export class RelocateComponent implements OnInit, OnDestroy, AfterViewInit {
  title = 'Relocate';
  isLoading = false;
  messageType = 'error';
  buttonStyles = 'bg-indigo-800';
  buttonLabel = 'submit';
  message = '';

  containerForm = new FormGroup({
    containerNumber: new FormControl('', [
      Validators.required,
      Validators.pattern(ToteBarcodeRegex),
    ]),
  });
  get f(): { [key: string]: AbstractControl } {
    return this.containerForm.controls;
  }

  private subscription: Subscription = new Subscription();
  constructor(
    private commonService: CommonService,
    private route: ActivatedRoute,
    private router: Router,
    private titleService: Title,
    private verifyContainerForAGIn: VerifyContainerForAggregationInGQL
  ) {
    this.commonService.changeTitle(this.title);
    this.titleService.setTitle(this.title);
  }

  @ViewChild('containerNumber') containerInput: ElementRef;
  ngOnInit(): void {
    this.messageType = this.route.snapshot.queryParams['result'];
    this.message = this.route.snapshot.queryParams['message'];
  }
  ngAfterViewInit(): void {
    setTimeout(() => {
      this.containerInput.nativeElement.select();
    }, 10);
  }

  onSubmit(): void {
    this.message = '';
    if (this.containerForm.valid) {
      this.verifyContainer();
    }
  }

  verifyContainer(): void {
    this.isLoading = true;
    this.subscription.add(
      this.verifyContainerForAGIn
        .watch(
          {
            Barcode: this.containerForm.get('containerNumber').value,
            DistributionCenter: 'PH',
          },
          { fetchPolicy: 'no-cache' }
        )
        .valueChanges.pipe(
          map((res) => {
            //
          })
        )
        .subscribe(
          (res) => {
            //
          },
          (error) => {
            this.isLoading = false;
            this.message = error;
            this.messageType = 'error';
          }
        )
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
