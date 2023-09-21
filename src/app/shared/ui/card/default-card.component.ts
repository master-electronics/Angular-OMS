import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule],
  selector: 'default-card',
  template: `
    <a
      [href]="link"
      class="block max-w-sm rounded-lg border border-gray-200 bg-white p-6 shadow hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700"
    >
      <h5
        class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white"
      >
        {{ title }}
      </h5>
      <p class="font-normal text-gray-700 dark:text-gray-400">
        {{ discription }}
      </p>
    </a>
  `,
})
export class DefaultCardComponent {
  @Input() link = '';
  @Input() title = '';
  @Input() discription = '';
}
