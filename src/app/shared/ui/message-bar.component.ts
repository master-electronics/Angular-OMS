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
        class=" mb-4 h-12 flex border-t-4 border-blue-500 bg-blue-100 p-2 text-blue-700 dark:bg-blue-200"
        role="alert"
      >
        <ng-template [ngTemplateOutlet]="mark" ]></ng-template>
      </div>

      <!-- success -->
      <div
        *ngSwitchCase="'success'"
        id="message-bar-success"
        class="mb-4 h-12 flex border-t-4 border-green-500 bg-green-100 p-2 text-green-500 dark:bg-green-200"
        role="alert"
      >
        <ng-template [ngTemplateOutlet]="mark" ]></ng-template>
      </div>

      <!-- warning -->
      <div
        *ngSwitchCase="'warning'"
        id="message-bar-warning"
        class="mb-4 h-12 flex border-t-4 border-yellow-500 bg-yellow-100 p-2 text-yellow-500 dark:bg-yellow-200"
        role="alert"
      >
        <ng-template [ngTemplateOutlet]="mark" ]></ng-template>
      </div>

      <!-- info -->
      <div
        *ngSwitchCase="'info'"
        id="message-bar-info"
        class="flex h-12 border-t-4 border-gray-500 bg-gray-100 p-2 text-gray-500 dark:bg-gray-700"
        role="alert"
      >
        <ng-template [ngTemplateOutlet]="mark" ]></ng-template>
      </div>

      <!-- error -->
      <div
        *ngSwitchDefault
        id="message-border-error"
        class="mb-4 h-12 flex border-t-4 border-red-500 bg-red-100 p-2 text-red-500 dark:bg-red-200"
        role="alert"
      >
        <ng-template [ngTemplateOutlet]="mark" ]></ng-template>
      </div>
    </div>

    <!-- icon template -->
    <ng-template #mark>
      <svg
        class=" h-5 flex-shrink-0 lg:h-5"
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
