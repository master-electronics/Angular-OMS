import { Directive, HostListener, ElementRef } from '@angular/core';

@Directive({
  selector: '[focusInvalidInput]',
  standalone: true,
})
export class FocusInvlidInputDirective {
  constructor(private el: ElementRef) {}
  @HostListener('submit')
  onFormSubmit() {
    const invalidControl = this.el.nativeElement.querySelector('.ng-invalid');

    if (invalidControl) {
      invalidControl.select();
    }
  }
}
