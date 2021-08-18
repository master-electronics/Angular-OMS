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
import {
  FetchContainerForAggregationInGQL,
  FetchContainerForAggregationInQuery,
} from '../../graphql/forAggregation.graphql-gen';
import { ApolloQueryResult } from '@apollo/client/core';

@Component({
  selector: 'aggregation-in',
  templateUrl: './aggregation-in.component.html',
})
export class AggregationInComponent
  implements OnInit, OnDestroy, AfterViewInit
{
  title = 'Aggregation In';
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
    private fetchContainer: FetchContainerForAggregationInGQL
  ) {
    this.commonService.changeTitle(this.title);
    this.titleService.setTitle('Aggregation In');
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
      this.fetchContainer
        .watch(
          {
            Barcode: this.containerForm.get('containerNumber').value,
            DistributionCenter: 'PH',
          },
          { fetchPolicy: 'no-cache' }
        )
        .valueChanges.subscribe(
          (res) => {
            this.isLoading = res.loading;
            if (res.error) {
              this.message = res.error.message;
              this.messageType = 'error';
            }
            // if has error, return error message
            this.message = this.checkVaild(res);
            this.message && (this.messageType = 'error');
            this.containerInput.nativeElement.select();
          },
          (error) => {
            this.isLoading = false;
            this.message = error;
            this.messageType = 'error';
          }
        )
    );
  }

  checkVaild(
    result: ApolloQueryResult<FetchContainerForAggregationInQuery>
  ): string {
    const container = result.data.findContainer[0];
    if (container === undefined) return 'Container not found!';
    // only accepte mobile container
    if (!container.Type.IsMobile) return 'This container is not mobile!';
    // only accepte container from qc or already in ag area
    if (container.Row !== 'QC' && container.Row !== 'AG')
      return 'Container should come from QC or already in AG!';
    if (container.INVENTORies.length === 0) return 'No item in this Container!';
    // if the container already in Aggregation area, will allow multiple items in it.
    if (container.INVENTORies.length > 1 && container.Row !== 'AG') {
      return 'More than 1 items in this Container.';
    }
    // only accepte ITN status from qc done to AG out complete.
    if (container.INVENTORies[0].StatusID > 4) {
      return 'This Order is not in Ag.';
    }
    // if pass all naveigate to next page
    const isRelocation = container.Row === 'AG';
    const ITNList = container.INVENTORies.map(
      (node) => node.InternalTrackingNumber
    );
    this.router.navigate(['agin/location'], {
      queryParams: {
        isRelocation: isRelocation,
        qcContainer: container._id,
        Bin: this.containerForm.get('containerNumber').value,
        ITNList: ITNList,
      },
    });
    return null;
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
