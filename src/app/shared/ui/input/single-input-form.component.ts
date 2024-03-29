import { CommonModule } from '@angular/common';
import {
  Component,
  Input,
  OnInit,
  Output,
  EventEmitter,
  ViewChild,
  ElementRef,
  ChangeDetectionStrategy,
} from '@angular/core';
import {
  ControlContainer,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzSkeletonModule } from 'ng-zorro-antd/skeleton';
import { NormalButtonComponent } from 'src/app/shared/ui/button/normal-button.component';
import { SubmitButtonComponent } from 'src/app/shared/ui/button/submit-button.component';
import { MessageBarComponent } from 'src/app/shared/ui/message-bar.component';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NzSkeletonModule,
    NormalButtonComponent,
    SubmitButtonComponent,
    MessageBarComponent,
    NzIconModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'single-input-form',
  template: `
    <form [formGroup]="inputForm" (ngSubmit)="onSubmit()">
      <div class=" text-base sm:text-lg md:mx-16  md:text-2xl lg:text-4xl">
        <div class="gap-2 md:grid" [class.flex]="title.length < 10">
          <label class="mb-0.5 font-bold text-gray-700" [for]="controlName">
            {{ title }}
          </label>
          <div class="relative grow">
            <input
              [formControlName]="controlName"
              [ngClass]="[
                inputForm.get(controlName).invalid &&
                inputForm.get(controlName).dirty
                  ? 'input-error'
                  : 'input-bordered'
              ]"
              class="input w-full input-sm md:input-md lg:input-lg"
              [id]="controlName"
              [type]="inputType"
              autocomplete="off"
              [placeholder]="placeholder"
              [maxlength]="maxLength"
              #input
            />
            <!-- error mesage -->
            <div
              *ngIf="
                inputForm.get(controlName).invalid &&
                  inputForm.get(controlName).dirty;
                else NonError
              "
              class="italic text-red-500"
            >
              <div *ngIf="inputForm.get(controlName).errors?.['required']">
                This field is required.
              </div>
              <div *ngIf="inputForm.get(controlName).errors?.['pattern']">
                Invalid Format!
              </div>
              <div *ngFor="let validator of validators">
                <div
                  *ngIf="inputForm.get(controlName).errors?.[validator.name]"
                >
                  {{ validator.message }}
                </div>
              </div>
            </div>
            <ng-template #NonError>
              <div class="opacity-0 ">no error</div>
            </ng-template>
          </div>
        </div>
        <!-- Button area -->
        <div
          class="grid h-12 w-full grid-cols-3 gap-3 sm:h-16 md:mt-6 md:h-24 lg:h-36"
        >
          <submit-button [loading]="!data" [disabled]="!isvalid">
          </submit-button>
          <normal-button
            [buttonText]="backButtonText"
            class="col-start-3"
            (buttonClick)="onBack()"
          ></normal-button>
        </div>

        <div *ngIf="data?.error" class="mt-1 md:mt-3 lg:mt-6">
          <message-bar
            [message]="data?.error.message"
            [name]="data?.error.name"
          ></message-bar>
        </div>
      </div>
    </form>
  `,
})
export class SingleInputformComponent implements OnInit {
  public inputForm: FormGroup;
  @Input() data = { error: null };
  @Input() validators = [{ name: '', message: '' }];
  @Input() controlName = 'input';
  @Input() inputType = 'text';
  @Input() placeholder = '';
  @Input() maxLength = null;
  @Input() title = '';
  @Input() isvalid = true;
  @Input() backButtonText = 'Back';
  @Output() formSubmit: EventEmitter<null> = new EventEmitter();
  @Output() formBack: EventEmitter<null> = new EventEmitter();

  constructor(private controlContainer: ControlContainer) {}

  @ViewChild('input') inputFiled!: ElementRef;
  ngAfterViewInit(): void {
    this.inputFiled?.nativeElement.focus();
  }

  clean() {
    this.inputForm.get(this.controlName).setValue('');
    this.inputFiled.nativeElement.focus();
  }

  public ngOnInit(): void {
    this.inputForm = this.controlContainer.control as FormGroup;
  }

  public onSubmit(): void {
    if (this.inputForm.valid) {
      this.formSubmit.emit();
    }
    this.inputForm.reset();
    this.inputFiled.nativeElement.select();
  }

  public onBack(): void {
    this.formBack.emit();
  }

  public textTrans(event) {
    console.log(event);
  }
}
