import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { debounceTime, distinctUntilChanged, map, switchMap } from 'rxjs';
import { CountryListService } from 'src/app/shared/data/countryList';
import { NormalButtonComponent } from 'src/app/shared/ui/button/normal-button.component';
import { SubmitButtonComponent } from 'src/app/shared/ui/button/submit-button.component';
import { AssignLabelInfo } from '../../data/label';
import { updateReceiptInfoService } from '../../data/updateReceipt';
import { SearchListInputComponent } from '../../ui/search-list-input.component';

@Component({
  selector: 'edit-info',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SearchListInputComponent,
    SubmitButtonComponent,
    NormalButtonComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div
      id="edit-modal"
      class="    
      absolute top-0 left-0 z-50 grid h-full w-full grid-cols-1 grid-rows-1 place-items-center bg-gray-400 bg-opacity-30 text-white"
    >
      <div class="relative h-full w-4/5 text-lg md:h-auto md:w-2/3 lg:w-1/2">
        <div class="relative rounded-lg bg-white shadow">
          <form [formGroup]="editForm" (ngSubmit)="onSubmit()" class="p-6">
            <!-- Date code input field -->
            <div class="flex gap-2 md:grid">
              <!-- Datecode -->
              <label class="mb-0.5 font-bold text-gray-700" for="datecode">
                DateCode:
              </label>
              <div class="relative grow">
                <input
                  formControlName="datecode"
                  class="focus:shadow-outline h-fit w-full appearance-none rounded border py-2 px-3 leading-tight text-gray-700 shadow focus:outline-none"
                  id="datecode"
                  type="text"
                  autocomplete="off"
                  placeholder="DateCode"
                  #datecode
                />
                <!-- error mesage -->
                <div
                  *ngIf="
                    editForm.get('datecode').invalid &&
                      editForm.get('datecode').dirty;
                    else NonError
                  "
                  class="italic text-red-500"
                >
                  <div *ngFor="let validator of datecodeValidators">
                    <div
                      *ngIf="editForm.get('datecode').errors?.[validator.name]"
                    >
                      {{ validator.message }}
                    </div>
                  </div>
                </div>
                <ng-template #NonError>
                  <div class="opacity-0 ">no error</div>
                </ng-template>
              </div>

              <!-- Country input field -->
              <label class="mb-0.5 block font-bold text-gray-700" for="country">
                Country
              </label>
              <search-list-input
                (formSubmit)="onSubmit()"
                controlName="country"
                [dataSource]="countryList$ | async"
              ></search-list-input>
            </div>

            <!-- button area -->
            <div class="grid h-16 grid-cols-3  gap-10 text-xl">
              <submit-button [disabled]="editForm.invalid"> </submit-button>
              <normal-button
                class="col-start-3"
                (buttonClick)="onCancel()"
              ></normal-button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `,
})
export class EditInfoComponent implements OnInit {
  @Output() clickSubmit: EventEmitter<AssignLabelInfo> = new EventEmitter();
  @Output() clickCancel: EventEmitter<null> = new EventEmitter();
  @Input() ISO3 = '';
  @Input() datecode = '';
  public countryList$;
  private countryInfo;
  public editForm: FormGroup;
  public datecodeValidators = [
    {
      name: 'format',
      message: 'Format must be YYWW(2 digit year, 2 digit week)',
    },
    {
      name: 'value',
      message: `Input can't greater than current date!`,
    },
  ];

  constructor(
    private _fb: FormBuilder,
    private _update: updateReceiptInfoService,
    private _country: CountryListService
  ) {}

  ngOnInit(): void {
    this.editForm = this._fb.group({
      datecode: [this.datecode, [this._update.checkDateCode()]],
      country: [
        this.ISO3,
        [Validators.required],
        [this._update.countryValidator()],
      ],
    });

    this.countryList$ = this.editForm.valueChanges.pipe(
      map((res) => res.country),
      debounceTime(100),
      distinctUntilChanged(),
      switchMap((searchQuery) => {
        return this._country.countryList$.pipe(
          map((res) => {
            return res.filter((country) => {
              if (!searchQuery.length) {
                return false;
              }
              if (searchQuery.length < 3) {
                return country.ISO2.includes(searchQuery.trim().toUpperCase());
              }
              if (searchQuery.length === 3) {
                return country.ISO3.includes(searchQuery.trim().toUpperCase());
              }
              return country.CountryName.trim()
                .toLocaleUpperCase()
                .includes(searchQuery.trim().toLocaleUpperCase());
            });
          }),
          map((res) => {
            // save value for upate info
            this.countryInfo = res[0];
            return res.slice(0, 5).map((country) => ({
              name:
                country.ISO2 +
                ' - ' +
                country.ISO3 +
                ' - ' +
                country.CountryName +
                ' - ' +
                country._id,
            }));
          })
        );
      })
    );
  }

  onSubmit() {
    const datecode = this.editForm.value.datecode;
    let ISO3 = '';
    let countryID = 0;
    if (this.countryInfo) {
      ISO3 = this.countryInfo.ISO3;
      countryID = this.countryInfo._id;
    } else {
      [, ISO3, , countryID] = this.editForm.value.country.split(' - ');
    }
    if (!countryID) {
      return;
    }
    this.clickSubmit.emit({
      country: { ISO3, countryID: Number(countryID) },
      datecode,
    });
  }

  onCancel() {
    this.clickCancel.emit();
  }
}
