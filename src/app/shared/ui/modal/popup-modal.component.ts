import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import { asapScheduler } from 'rxjs';

@Component({
  selector: 'popup-modal',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div
      id="popup-modal"
      class="    
      absolute top-0 left-0 z-50 grid h-full w-full grid-cols-1 grid-rows-1 place-items-center bg-gray-400 bg-opacity-30 text-white"
    >
      <div class="relative h-full w-4/5 md:h-auto md:w-2/3 lg:w-1/2">
        <div class="relative rounded-lg bg-white shadow dark:bg-gray-700">
          <div class="p-6 text-center">
            <h1
              [innerHTML]="message"
              class="mb-6 text-base font-normal text-gray-500 dark:text-gray-400 md:text-lg lg:text-2xl"
            ></h1>
            <div
              class="grid h-16 w-full grid-cols-3 text-base md:text-lg lg:text-2xl"
            >
              <button
                (click)="onSubmit()"
                class="h-full w-full  rounded-lg bg-blue-700 font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 disabled:bg-blue-200 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                type="submit"
                #submit
              >
                {{ buttonOne }}
              </button>
              <button
                (click)="onCancel()"
                class="col-start-3 h-full w-full rounded-lg border border-gray-200 bg-gray-100 font-medium text-gray-900 hover:bg-gray-200 hover:text-blue-700 focus:z-10 focus:outline-none focus:ring-4 focus:ring-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white dark:focus:ring-gray-700"
                type="button"
              >
                {{ buttonTwo }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class PopupModalComponent {
  @Input() message = '';
  @Input() buttonOne = 'OK';
  @Input() buttonTwo = 'Cancel';
  @Output() clickSubmit: EventEmitter<null> = new EventEmitter();
  @Output() clickCancel: EventEmitter<null> = new EventEmitter();

  @ViewChild('submit') submit!: ElementRef;
  ngAfterViewInit(): void {
    asapScheduler.schedule(() => {
      this.submit.nativeElement.focus();
    });
  }
  onSubmit() {
    this.clickSubmit.emit();
  }

  onCancel() {
    this.clickCancel.emit();
  }
}
