import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { map } from 'rxjs';

@Component({
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="flex h-screen w-screen items-center bg-gray-100">
      <div
        class="
      container
      flex flex-col
      items-center
      justify-center
      px-5
      text-gray-700
      md:flex-row
    "
      >
        <div class="max-w-md">
          <div class="font-dark text-5xl font-bold">{{ error | async }}</div>
          <p class="text-2xl font-light leading-normal md:text-3xl">
            We're sorry, something went wrong.
          </p>
          <p class="mb-8">
            Please contact our IT team members for more information.
          </p>

          <button
            class="
          focus:shadow-outline-blue
          inline
          rounded-lg
          border
          border-transparent
          bg-blue-600
          px-4
          py-2
          text-sm
          font-medium
          leading-5 text-white
          shadow
          transition-colors
          duration-150
          hover:bg-blue-700
          focus:outline-none
          active:bg-blue-600
        "
            routerLink="/home"
          >
            HOME
          </button>
        </div>
        <div class="max-w-lg">
          <img src="../../../assets/icon/error_page.svg" alt="error" />
        </div>
      </div>
    </div>
  `,
})
export class ErrorPageComponent {
  error = this.route.queryParams.pipe(
    map((res) => {
      return res.error || 'Error';
    })
  );
  constructor(private route: ActivatedRoute) {}
}
