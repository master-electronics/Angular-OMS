import { AfterViewInit, Directive, ElementRef } from '@angular/core';
import { asapScheduler } from 'rxjs';

@Directive({
  selector: 'autofocus',
  standalone: true,
})
export class AutoFocusDirective implements AfterViewInit {
  constructor(private elementRef: ElementRef) {}

  ngAfterViewInit(): void {
    asapScheduler.schedule(() => {
      this.elementRef.nativeElement.focus();
    });
  }
}
