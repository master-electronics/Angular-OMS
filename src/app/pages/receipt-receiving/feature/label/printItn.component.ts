import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { map, Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import { SingleInputformComponent } from '../../../../shared/ui/input/single-input-form.component';
import { TabService } from '../../../../shared/ui/step-bar/tab';
import { LabelService, ITNinfo } from '../../data/label';
import { LocationStrategy } from '@angular/common';
import { PrinterButtomComponent } from 'src/app/shared/ui/button/print-button.component';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SingleInputformComponent,
    PrinterButtomComponent,
  ],
  template: `
    <div
      *ngIf="ITNList$ | async as list"
      class="flex flex-col justify-center text-lg"
    >
      <h1>Scan Label</h1>
      <h1>({{ list.length }} of {{ _label.quantityList?.length }})</h1>
    </div>
    <single-input-form
      (formSubmit)="onSubmit()"
      (formBack)="onBack()"
      [data]="data$ | async"
      [validators]="validators"
      [formGroup]="inputForm"
      controlName="label"
      title="Label"
      [isvalid]="this.inputForm.valid"
    ></single-input-form>
    <printer-button
      class=" absolute bottom-1 right-1"
      [ITN]="this._label.ITNList.slice(-1)[0].ITN"
    ></printer-button>
  `,
})
export class PrintITNComponent implements OnInit {
  public inputForm: FormGroup;
  public data$: Observable<any>;
  public ITNList$ = new Observable<Array<ITNinfo>>();
  public scanAll = false;
  public validators = [
    {
      name: 'label',
      message: 'Not match the current label!',
    },
  ];

  constructor(
    private _router: Router,
    private _actRoute: ActivatedRoute,
    private _ui: TabService,
    public _label: LabelService,
    private location: LocationStrategy
  ) {}

  ngOnInit(): void {
    this._ui.changeSteps(3);
    this.data$ = this._actRoute.data.pipe(map((res) => res.print));
    this.ITNList$ = this._label.ITNList$;
    this.inputForm = new FormGroup({
      label: new FormControl('', [Validators.required, this.checKLabel()]),
    });

    // preventing back button
    history.pushState(null, null, window.location.href);
    this.location.onPopState(() => {
      history.pushState(null, null, window.location.href);
    });
  }

  public checKLabel(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value.trim();
      if (!value) {
        return null;
      }
      const isVaild = this._label.ITNList.slice(-1)[0].ITN === value;
      return !isVaild ? { label: true } : null;
    };
  }

  public onChange = (input: string) => {
    if (input) {
      this.inputForm.get('receipt').setValue(input);
    }
  };

  public onBack(): void {
    this._router.navigate(['../assign'], { relativeTo: this._actRoute });
  }

  public onSubmit(): void {
    if (this.scanAll) {
      return;
    }
    this.inputForm.setValue({ label: '' });
    this._router.navigate(['../sacnlocation'], { relativeTo: this._actRoute });
  }
}
