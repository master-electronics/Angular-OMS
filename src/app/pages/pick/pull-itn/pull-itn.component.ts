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
import { ITNBarcodeRegex } from '../../../shared/dataRegex';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { PickService } from '../pick.server';
import { FindNextItnForPullingGQL } from 'src/app/graphql/pick.graphql-gen';

@Component({
  selector: 'pull-itn',
  templateUrl: './pull-itn.component.html',
})
export class PullITNComponent implements OnInit, AfterViewInit {
  title = 'Pick ITN';
  isLoading = false;
  alertType = 'error';
  alertMessage = '';
  query$ = new Observable();

  ITNForm = new FormGroup({
    containerNumber: new FormControl('', [
      Validators.required,
      Validators.pattern(ITNBarcodeRegex),
    ]),
  });
  get f(): { [key: string]: AbstractControl } {
    return this.ITNForm.controls;
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

  @ViewChild('containerNumber') containerInput!: ElementRef;
  ngOnInit(): void {
    //
  }
  ngAfterViewInit(): void {
    setTimeout(() => {
      this.containerInput.nativeElement.select();
    }, 10);
  }

  onSubmit(): void {
    this.alertMessage = '';
    if (!this.ITNForm.valid || this.isLoading) {
      this.containerInput.nativeElement.select();
      return;
    }
    this.isLoading = true;
    this.query$ = this._findNextITN
      .fetch(
        {
          Zone: this._pickService.pickSettings.Zone,
          StrictPriority: this._pickService.pickSettings.StrictPriority,
          PriorityCutoff: this._pickService.pickSettings.PriorityCutoff,
        },
        { fetchPolicy: 'network-only' }
      )

      .pipe(
        tap((res) => {
          const targetITN = res.data.findNextITNForPulling;
        }),
        map(() => {
          this.isLoading = false;
          this._router.navigate(['agin/location']);
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

  endPick(): void {
    this._router.navigate(['pick']);
  }
}
