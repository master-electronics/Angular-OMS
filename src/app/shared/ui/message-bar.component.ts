import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'message-bar',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div [ngSwitch]="name">
      <!-- alert -->
      <div
        *ngSwitchCase="'alert'"
        id="message-border-alert"
        class=" mb-4 flex border-t-4 border-blue-500 bg-blue-100 p-4 text-blue-700 dark:bg-blue-200"
        role="alert"
      >
        <ng-template [ngTemplateOutlet]="mark" ]></ng-template>
        <button
          type="button"
          class="-mx-1.5 -my-1.5 ml-auto inline-flex h-5 rounded-lg  bg-blue-100 p-1.5 hover:bg-blue-200 focus:ring-2 focus:ring-blue-400 dark:bg-blue-200 dark:hover:bg-blue-300 lg:h-10"
          aria-label="Close"
        ></button>
      </div>

      <!-- success -->
      <div
        *ngSwitchCase="'success'"
        id="message-bar-success"
        class="mb-4 flex border-t-4 border-green-500 bg-green-100 p-4 text-green-500 dark:bg-green-200"
        role="alert"
      >
        <ng-template [ngTemplateOutlet]="mark" ]></ng-template>
        <button
          type="button"
          class="-mx-1.5 -my-1.5 ml-auto inline-flex h-5 rounded-lg  bg-green-100 p-1.5 text-green-500 hover:bg-green-200 focus:ring-2 focus:ring-green-400 dark:bg-green-200 dark:hover:bg-green-300 lg:h-10"
          aria-label="Close"
        ></button>
      </div>

      <!-- warning -->
      <div
        *ngSwitchCase="'warning'"
        id="message-bar-warning"
        class="mb-4 flex border-t-4 border-yellow-500 bg-yellow-100 p-4 text-yellow-500 dark:bg-yellow-200"
        role="alert"
      >
        <ng-template [ngTemplateOutlet]="mark" ]></ng-template>
        <button
          type="button"
          class="-mx-1.5 -my-1.5 ml-auto inline-flex h-5 rounded-lg  bg-yellow-100 p-1.5 text-yellow-500 hover:bg-yellow-200 focus:ring-2 focus:ring-yellow-400 dark:bg-yellow-200 dark:hover:bg-yellow-300 lg:h-10"
          data-dismiss-target="#message-bar-warning"
          aria-label="Close"
        ></button>
      </div>

      <!-- info -->
      <div
        *ngSwitchCase="'info'"
        id="message-bar-info"
        class="flex border-t-4 border-gray-500 bg-gray-100 p-4 text-gray-500 dark:bg-gray-700"
        role="alert"
      >
        <ng-template [ngTemplateOutlet]="mark" ]></ng-template>
        <button
          type="button"
          class="-mx-1.5 -my-1.5 ml-auto inline-flex h-5 rounded-lg  bg-gray-100 p-1.5 text-gray-500 hover:bg-gray-200 focus:ring-2 focus:ring-gray-400 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-white lg:h-10"
          data-dismiss-target="#message-bar-info"
          aria-label="Close"
        ></button>
      </div>

      <!-- error -->
      <div
        *ngSwitchDefault
        id="message-border-error"
        class="mb-4 flex border-t-4 border-red-500 bg-red-100 p-4 text-red-500 dark:bg-red-200"
        role="alert"
      >
        <ng-template [ngTemplateOutlet]="mark" ]></ng-template>
        <button
          type="button"
          class="-mx-1.5 -my-1.5 ml-auto inline-flex h-5 rounded-lg  bg-red-100 p-1.5 text-red-500 hover:bg-red-200 focus:ring-2 focus:ring-red-400 dark:bg-red-200 dark:hover:bg-red-300 lg:h-10"
          aria-label="Close"
        ></button>
      </div>
    </div>

    <!-- icon template -->
    <ng-template #mark>
      <svg
        class=" h-5 flex-shrink-0 lg:h-10"
        fill="currentColor"
        viewBox="0 0 20 20"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fill-rule="evenodd"
          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
          clip-rule="evenodd"
        ></path>
      </svg>
      <div class="ml-3 font-medium">{{ message }}</div>
    </ng-template>
  `,
})
export class MessageBarComponent {
  public type;
  @Input() message = '';
  @Input() name = 'error';
}
