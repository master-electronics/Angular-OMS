import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SimpleKeyboardComponent } from 'src/app/shared/ui/simple-keyboard.component';
import { TabService } from '../../data/tab';
import { SubmitButtonComponent } from 'src/app/shared/ui/button/submit-button.component';
import { NormalButtonComponent } from 'src/app/shared/ui/button/normal-button.component';
import { LoaderButtonComponent } from 'src/app/shared/ui/button/loader-button.component';
import { ReceiptHeaderTableComponent } from '../../ui/header-table.component';
import { FindReceiptHeaderListGQL } from 'src/app/graphql/receiptReceiving.graphql-gen';
import { map, Observable, of, shareReplay, tap } from 'rxjs';
import { ReceiptInfoService } from '../../data/ReceiptInfo';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SimpleKeyboardComponent,
    SubmitButtonComponent,
    ReceiptHeaderTableComponent,
    NormalButtonComponent,
    LoaderButtonComponent,
  ],

  template: `
    <form [formGroup]="inputForm" (ngSubmit)="onSearch()">
      <div class=" text-base sm:text-lg md:mx-16  md:text-2xl lg:text-4xl">
        <div class="grid w-full gap-10 md:grid-cols-2">
          <!-- search form area -->
          <div>
            <!-- input area -->
            <div>
              <label for="partNumber" class="block font-medium "
                >PartNumber</label
              >
              <input
                formControlName="partNumber"
                type="text"
                name="partNumber"
                autocomplete="off"
                id="partNumber"
                class="focus:ring-primary-600 focus:border-primary-600 block w-full rounded-lg
        border bg-gray-50 p-2.5 text-gray-900"
                #partNumber
              />
            </div>
            <div>
              <label for="vendor" class="block font-medium">VendorNumber</label>
              <input
                formControlName="vendor"
                type="vendor"
                name="vendor"
                autocomplete="off"
                id="vendor"
                class="focus:ring-primary-600 focus:border-primary-600 block w-full rounded-lg border bg-gray-50 p-2.5 text-gray-900 "
              />
            </div>
            <!-- button area -->
            <div
              class="grid h-8 w-full grid-cols-3 sm:h-12 md:mt-6 md:h-16 lg:h-20"
            >
              <submit-button
                *ngIf="search$; else loading"
                [disabled]="!this.inputForm.valid"
              >
              </submit-button>
              <ng-template #loading>
                <loader-button></loader-button>
              </ng-template>
              <normal-button
                class="col-start-3"
                (buttonClick)="onBack()"
              ></normal-button>
            </div>
          </div>
          <!-- header list -->
          <div class=" h-80 overflow-auto">
            <receipt-header-table
              [headerList]="search$ | async"
              (selectCol)="onSelect($event)"
            ></receipt-header-table>
          </div>
        </div>
      </div>
    </form>
    <simple-keyboard
      [inputString]="this.currentInputFied?.value"
      (outputString)="onChange($event)"
    ></simple-keyboard>
  `,
})
export class SearchComponent implements OnInit {
  public inputForm: FormGroup;
  public search$: Observable<any>;

  constructor(
    private _router: Router,
    private _ui: TabService,
    private _actRoute: ActivatedRoute,
    private _searchList: FindReceiptHeaderListGQL,
    private receipt: ReceiptInfoService
  ) {}

  ngOnInit(): void {
    this._ui.changeSteps(0);
    this.search$ = of(true);
    this.inputForm = new FormGroup({
      partNumber: new FormControl(''),
      vendor: new FormControl(''),
    });
  }

  /**
   * Select input fied for v-keyboard.
   */
  public currentInputFied;
  onInputFocus(event) {
    this.currentInputFied = this.inputForm.get(`field${event.target.id}`);
  }
  onChange(input) {
    this.currentInputFied.setValue(input);
  }

  onSearch(): void {
    this.search$ = this._searchList
      .fetch({
        VendorNumber: this.inputForm.value.vendor,
        PartNumber: this.inputForm.value.partNumber,
      })
      .pipe(
        map((res) => res.data.findReceiptInfoByPartorVendor),
        shareReplay(1)
      );
  }

  onSelect(id: number): void {
    this.search$ = this.receipt.checkReceiptHeader(id).pipe(
      tap(() => {
        this._router.navigate(['../part'], { relativeTo: this._actRoute });
      })
    );
  }

  onBack(): void {
    this._router.navigate(['../receipt'], { relativeTo: this._actRoute });
  }
}
