import { CommonModule } from '@angular/common';
import {
  Component,
  Input,
  OnInit,
  Output,
  EventEmitter,
  ViewChild,
  ElementRef,
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

  selector: 'single-input-form',
  template: `
    <form
      *ngIf="data; else loading"
      [formGroup]="inputForm"
      (ngSubmit)="onSubmit()"
    >
      <div class="md:mx-16 md:text-2xl lg:text-4xl">
        <label class="mb-0.5 block font-bold text-gray-700" [for]="controlName">
          {{ title }}
        </label>
        <div class="relative">
          <input
            [formControlName]="controlName"
            [ngClass]="
              inputForm.get(controlName).invalid &&
              inputForm.get(controlName).dirty
                ? 'border-red-500'
                : 'border-blue-500'
            "
            class="focus:shadow-outline h-fit w-full appearance-none rounded border py-2 px-3 leading-tight text-gray-700 shadow focus:outline-none md:text-2xl lg:text-4xl"
            [id]="controlName"
            [type]="inputType"
            autocomplete="off"
            [placeholder]="placeholder"
            #input
          />
          <a class=" absolute right-8" (click)="clean()">
            <span nz-icon nzType="close-circle" nzTheme="outline"></span>
          </a>
        </div>
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
          <div *ngIf="inputForm.get(controlName).errors?.[validator.name]">
            {{ validator.message }}
          </div>
        </div>
        <ng-template #NonError>
          <div class="opacity-0 ">no error</div>
        </ng-template>
        <!-- Button area -->
        <div class="grid h-16 w-full grid-cols-3 md:mt-6 md:h-32 lg:h-40">
          <submit-button [disabled]="inputForm.invalid"> </submit-button>
          <div></div>
          <normal-button (buttonClick)="onBack()"></normal-button>
        </div>
        <div *ngIf="data?.error" class="mt-2 md:mt-4 lg:mt-6">
          <message-bar
            [message]="data?.error.message"
            [name]="data?.error.name"
          ></message-bar>
        </div>
      </div>
    </form>
    <ng-template #loading>
      <nz-skeleton [nzActive]="true" [nzParagraph]="{ rows: 8 }"></nz-skeleton>
    </ng-template>
  `,
})
export class SingleInputformComponent implements OnInit {
  public inputForm: FormGroup;
  public vaild;
  @Input() data = { loading: false, error: null };
  @Input() validator = { name: '', message: '' };
  @Input() controlName = 'input';
  @Input() inputType = 'text';
  @Input() placeholder = '';
  @Input() title = 'Input';
  @Output() formSubmit: EventEmitter<null> = new EventEmitter();
  @Output() formBack: EventEmitter<null> = new EventEmitter();

  constructor(private controlContainer: ControlContainer) {}

  @ViewChild('input') inputFiled!: ElementRef;
  ngAfterViewInit(): void {
    this.inputFiled.nativeElement.focus();
  }

  clean() {
    this.inputForm.get(this.controlName).setValue('');
    this.inputFiled.nativeElement.focus();
  }

  public ngOnInit(): void {
    this.inputForm = this.controlContainer.control as FormGroup;
  }

  public onSubmit(): void {
    this.inputFiled.nativeElement.select();
    this.formSubmit.emit();
  }

  public onBack(): void {
    this.formBack.emit();
  }
}
