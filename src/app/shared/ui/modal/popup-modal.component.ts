import { CommonModule } from '@angular/common';
import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import { asapScheduler } from 'rxjs';
import { NormalButtonComponent } from '../button/normal-button.component';
import { SubmitButtonComponent } from '../button/submit-button.component';

@Component({
  selector: 'popup-modal',
  standalone: true,
  imports: [CommonModule, SubmitButtonComponent, NormalButtonComponent],
  template: `
    <div
      id="popup-modal"
      class="    
      absolute top-0 left-0 z-50 grid h-full w-full grid-cols-1 grid-rows-1 place-items-center bg-gray-400 bg-opacity-30 text-white"
    >
      <div class="relative h-full w-1/2 md:h-auto">
        <div class="relative rounded-lg bg-white shadow dark:bg-gray-700">
          <div class="p-6 text-center">
            <svg
              aria-hidden="true"
              class="mx-auto mb-6 h-32 w-32 text-gray-400 dark:text-gray-200"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              ></path>
            </svg>
            <h1
              class="mb-6 text-2xl font-normal text-gray-500 dark:text-gray-400"
            >
              {{ message }}
            </h1>
            <div class="grid h-16 w-full grid-cols-3 text-2xl">
              <button
                (click)="onClick()"
                class="col-start-2 h-full w-full  rounded-lg bg-blue-700 font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 disabled:bg-blue-200 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                type="submit"
                #button
              >
                OK
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
  @Output() clickOK: EventEmitter<null> = new EventEmitter();

  @ViewChild('button') button!: ElementRef;
  ngAfterViewInit(): void {
    asapScheduler.schedule(() => {
      this.button.nativeElement.focus();
    });
  }
  onClick() {
    this.clickOK.emit();
  }
}
