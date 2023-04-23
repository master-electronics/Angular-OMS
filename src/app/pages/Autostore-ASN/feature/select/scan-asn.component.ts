import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SingleInputformComponent } from 'src/app/shared/ui/input/single-input-form.component';
import { 
  FormGroup,
  FormControl,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { catchError, map, Observable, of, tap } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  standalone: true,
  imports: [CommonModule, SingleInputformComponent, ReactiveFormsModule],
  template: `
    <single-input-form
      (formSubmit)="onSubmit()"
      [data]="data$ | async"
      [formGroup]="inputForm"
      inputType="string"
      controlName="asn"
      title="ASN"
      [isvalid]="this.inputForm.valid"
    ></single-input-form>
  `,
})
export class SelectASN implements OnInit {
  constructor(private _actRoute: ActivatedRoute, private _router: Router) {}
  public data$;
  public inputForm: FormGroup;

  ngOnInit(): void {
    this.inputForm = new FormGroup({
      asn: new FormControl(null, [Validators.required]),
    });
    this.data$ = this._actRoute.queryParamMap;
  }

  public onSubmit(): void {
    //
  }
}
