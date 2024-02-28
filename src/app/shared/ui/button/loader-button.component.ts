import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  standalone: true,
  selector: 'loader-button',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <button
      type="button"
      class="w-full btn btn-sm no-animation btn-active md:btn-md lg:btn-lg"
    >
      <span class="loading loading-spinner"></span>
      loading
    </button>
  `,
})
export class LoaderButtonComponent {}
