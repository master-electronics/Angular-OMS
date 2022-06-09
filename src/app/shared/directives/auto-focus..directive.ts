import { AfterViewInit, Directive, ElementRef } from '@angular/core';

@Directive({
  selector: 'autofocus',
})
export class AutoFocus implements AfterViewInit {
  constructor(private elementRef: ElementRef) {}

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.elementRef.nativeElement.focus();
    }, 10);
  }
}
