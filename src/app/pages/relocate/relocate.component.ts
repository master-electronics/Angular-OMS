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
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';

import { CommonService } from '../../shared/services/common.service';
import { ToteBarcodeRegex } from '../../shared/dataRegex';
import { catchError, map, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { VerifyContainerForAggregationInGQL } from 'src/app/graphql/aggregationIn.graphql-gen';

@Component({
  selector: 'app-relocate',
  templateUrl: './relocate.component.html',
})
export class RelocateComponent implements OnInit, AfterViewInit {
  title = 'Relocate';
  isLoading = false;
  messageType = 'error';
  message = '';
  tote$;

  containerForm = new FormGroup({
    containerNumber: new FormControl('', [
      Validators.required,
      Validators.pattern(ToteBarcodeRegex),
    ]),
  });
  get f(): { [key: string]: AbstractControl } {
    return this.containerForm.controls;
  }

  constructor(
    private commonService: CommonService,
    private route: ActivatedRoute,
    private router: Router,
    private titleService: Title,
    private verifyTote: VerifyContainerForAggregationInGQL
  ) {
    this.commonService.changeNavbar(this.title);
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
    if (!this.containerForm.valid) {
      this.containerInput.nativeElement.select();
      return;
    }

    // build obaservable
    this.isLoading = true;
    this.tote$ = this.verifyTote
      .fetch(
        {
          Container: {
            Barcode: this.containerForm.get('containerNumber').value,
            DistributionCenter: 'PH',
          },
        },
        { fetchPolicy: 'network-only' }
      )

      .pipe(
        tap((res) => {
          const container = res.data.findContainer[0];
          if (!container) throw `Can't find the Container.`;
          if (!container.ContainerType.IsMobile)
            throw 'This container is not mobile!';
          if (!container.ORDERLINEDETAILs.length) {
            throw 'This container is empty';
          }
          if (
            container.ORDERLINEDETAILs.length &&
            !container.ORDERLINEDETAILs.every(
              (line, i, arr) =>
                line.OrderID === arr[0].OrderID &&
                line.StatusID === arr[0].StatusID
            )
          )
            throw 'Have different order or status in the Container.';
          // if the container before Aggregation in, will allow multiple items in it.
          if (
            container.ORDERLINEDETAILs.length > 1 &&
            container.ORDERLINEDETAILs[0].StatusID < environment.agInComplete_ID
          )
            throw 'More than one ITN in this Container.';
        }),

        map((res) => {
          const container = res.data.findContainer[0];
          const toteID = container._id;
          const Barcode = container.Barcode;
          const OrderID = container.ORDERLINEDETAILs[0].OrderID;
          const StatusID = container.ORDERLINEDETAILs[0].StatusID;
          this.router.navigate(['relocate/destination'], {
            queryParams: {
              OrderID,
              toteID,
              Barcode,
              StatusID,
            },
          });
          this.isLoading = false;
        }),

        catchError((error) => {
          this.isLoading = false;
          this.message = error;
          this.messageType = 'error';
          return of();
        })
      );
  }
}
