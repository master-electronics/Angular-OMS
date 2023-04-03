import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SingleInputformComponent } from 'src/app/shared/ui/input/single-input-form.component';
import {
  FormGroup,
  ReactiveFormsModule,
  Validators,
  FormBuilder,
} from '@angular/forms';
import { VerifyAsnLocationGQL } from 'src/app/graphql/autostoreASN.graphql-gen';
import { environment } from 'src/environments/environment';
import { catchError, map, of, tap } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { ASNService } from '../../data/asn.service';
import { PopupModalComponent } from 'src/app/shared/ui/modal/popup-modal.component';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    SingleInputformComponent,
    ReactiveFormsModule,
    PopupModalComponent,
  ],
  template: `
    <single-input-form
      (formSubmit)="onSubmit()"
      [data]="data$ | async"
      [formGroup]="inputForm"
      controlName="location"
      title="Scan Location:"
      [isvalid]="this.inputForm.valid"
    ></single-input-form>
    <ng-container *ngIf="message">
      <popup-modal (clickSubmit)="onOk()" [message]="message"></popup-modal>
    </ng-container>
  `,
})
export class ASNLocation implements OnInit {
  constructor(
    private _findContainer: VerifyAsnLocationGQL,
    private _actRoute: ActivatedRoute,
    private _router: Router,
    private _fb: FormBuilder,
    private _asn: ASNService
  ) {}

  public data$;
  public inputForm = this._fb.nonNullable.group({
    location: ['', [Validators.required]],
  });

  itnList;
  message;

  ngOnInit(): void {
    this.data$ = of(true);
  }

  public onSubmit(): void {
    this.data$ = this._asn
      .sendToAutostore$(this.inputForm.value.location.toString())
      .pipe(
        map((res) => {
          this.message = `ASN '${res}' created`;
          return res;
        }),
        catchError((error) => {
          return of({
            error: { message: error.message, type: 'error' },
          });
        })
      );
  }

  onOk() {
    this.message = null;
  }
}
