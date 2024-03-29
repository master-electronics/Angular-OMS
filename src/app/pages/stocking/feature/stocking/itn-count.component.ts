import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { SingleInputformComponent } from 'src/app/shared/ui/input/single-input-form.component';
import { SimpleKeyboardComponent } from 'src/app/shared/ui/simple-keyboard.component';
import { StockingService } from '../../data/stocking.service';
import { of } from 'rxjs';

@Component({
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    RouterModule,
    SimpleKeyboardComponent,
    SingleInputformComponent,
    ReactiveFormsModule,
  ],
  template: `
    <single-input-form
      (formSubmit)="onSubmit()"
      (formBack)="onBack()"
      [data]="data$ | async"
      [formGroup]="inputForm"
      controlName="itn"
      inputType="number"
      title="Enter ITN Count"
    ></single-input-form>
    <!-- <simple-keyboard
      layout="number"
      [inputString]="inputForm.value.itn"
      (outputString)="onChange($event)"
    ></simple-keyboard> -->
  `,
})
export class ITNCountComponent implements OnInit {
  constructor(
    private _fb: FormBuilder,
    private _actRoute: ActivatedRoute,
    private _router: Router,
    private _stock: StockingService
  ) {}

  public audio = new Audio('./assets/audio/warning.wav');
  public data$;
  public inputForm = this._fb.nonNullable.group({
    itn: ['', [Validators.required]],
  });

  public onChange = (input: string) => {
    this.inputForm.patchValue({ itn: input });
  };

  ngOnInit(): void {
    this.data$ = of(true);
    this._stock.resetVerifiedAndChecked();
    this.audio.load();
  }

  onSubmit(): void {
    if (Number(this.inputForm.value.itn) === this._stock.ITNList().length) {
      this._stock.countMatch();
      this._router.navigate(['../checkitns'], {
        relativeTo: this._actRoute,
      });
      return;
    }
    this.audio.play();
    this._router.navigate(['../mismatch'], { relativeTo: this._actRoute });
  }

  onBack(): void {
    this._router.navigate(['../scantarget'], { relativeTo: this._actRoute });
  }
}
